const express = require('express');
const fs = require('fs');
const path = require('path');

const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;
const SECRET_KEY = process.env.SECRET_KEY || 'hdl_super_secret_key_123';

// Determine if we should use Supabase
const useSupabase = process.env.SUPABASE_URL && 
                    process.env.SUPABASE_KEY && 
                    !process.env.SUPABASE_KEY.startsWith('YOUR_');

let supabase = null;
if (useSupabase) {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    console.log("Supabase Client initialized successfully.");
} else {
    console.warn("Supabase credentials not configured in .env. Running in local file-based mode.");
}

// Middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dataFile = path.join(__dirname, 'data.json');
const inquiriesFile = path.join(__dirname, 'inquiries.json');

// --- API ROUTES ---

// 1. Get Configuration (Public)
app.get('/api/config', async (req, res) => {
    try {
        if (useSupabase) {
            const { data, error } = await supabase.from('config').select('data').eq('id', 1).single();
            if (error) throw error;
            return res.json(data.data);
        } else {
            const data = fs.readFileSync(dataFile, 'utf8');
            return res.json(JSON.parse(data));
        }
    } catch (err) {
        console.error("Fetch config error:", err);
        res.status(500).json({ error: 'Failed to read configuration data.' });
    }
});

// 2. Login (Public)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    // Hardcoded credentials
    if (username === 'hdladmin' && password === '1230') {
        const token = jwt.sign({ user: username }, SECRET_KEY, { expiresIn: '2h' });
        res.json({ token, message: 'Login successful' });
    } else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
});

// 3. Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// 4. Update Configuration (Protected)
app.post('/api/config', authenticateToken, async (req, res) => {
    try {
        const newData = req.body;
        // Basic validation
        if (!newData.basicInfo || !newData.links) {
            return res.status(400).json({ error: 'Invalid data format' });
        }

        if (useSupabase) {
            const { error } = await supabase.from('config').update({ data: newData, updated_at: new Date() }).eq('id', 1);
            if (error) throw error;
            res.json({ message: 'Configuration updated successfully in Supabase' });
        } else {
            fs.writeFileSync(dataFile, JSON.stringify(newData, null, 2));
            res.json({ message: 'Configuration updated successfully locally' });
        }
    } catch (err) {
        console.error("Save config error:", err);
        res.status(500).json({ error: 'Failed to save configuration data.' });
    }
});

// 4.5 Submit Inquiry (Public)
app.post('/api/inquiry', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !message) {
            return res.status(400).json({ error: 'Name and Message are required.' });
        }

        if (useSupabase) {
            const { error } = await supabase.from('inquiries').insert([{ name, email: email || '', phone: phone || '', message }]);
            if (error) throw error;
            res.json({ message: 'Inquiry submitted successfully to Supabase!' });
        } else {
            let inquiries = [];
            if (fs.existsSync(inquiriesFile)) {
                try {
                    inquiries = JSON.parse(fs.readFileSync(inquiriesFile, 'utf8'));
                } catch (e) {
                    inquiries = [];
                }
            }
            
            const newInquiry = {
                id: Date.now(),
                name,
                email: email || '',
                phone: phone || '',
                message,
                timestamp: new Date().toISOString()
            };
            
            inquiries.push(newInquiry);
            fs.writeFileSync(inquiriesFile, JSON.stringify(inquiries, null, 2));
            res.json({ message: 'Inquiry submitted successfully locally!' });
        }
    } catch (err) {
        console.error("Submit inquiry error:", err);
        res.status(500).json({ error: 'Failed to save inquiry.' });
    }
});

// 4.6 Get Inquiries (Protected)
app.get('/api/inquiries', authenticateToken, async (req, res) => {
    try {
        if (useSupabase) {
            const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            
            const formatted = data.map(inq => ({
                id: inq.id,
                name: inq.name,
                email: inq.email,
                phone: inq.phone,
                message: inq.message,
                timestamp: inq.created_at
            }));
            return res.json(formatted);
        } else {
            let inquiries = [];
            if (fs.existsSync(inquiriesFile)) {
                inquiries = JSON.parse(fs.readFileSync(inquiriesFile, 'utf8'));
            }
            return res.json(inquiries.reverse());
        }
    } catch (err) {
        console.error("Get inquiries error:", err);
        res.status(500).json({ error: 'Failed to read inquiries.' });
    }
});

// 4.7 Delete Inquiry (Protected)
app.delete('/api/inquiries/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (useSupabase) {
            const { error } = await supabase.from('inquiries').delete().eq('id', id);
            if (error) throw error;
            res.json({ message: 'Inquiry deleted successfully from Supabase' });
        } else {
            if (fs.existsSync(inquiriesFile)) {
                let inquiries = JSON.parse(fs.readFileSync(inquiriesFile, 'utf8'));
                inquiries = inquiries.filter(inq => inq.id !== id);
                fs.writeFileSync(inquiriesFile, JSON.stringify(inquiries, null, 2));
            }
            res.json({ message: 'Inquiry deleted successfully locally' });
        }
    } catch (err) {
        console.error("Delete inquiry error:", err);
        res.status(500).json({ error: 'Failed to delete inquiry.' });
    }
});

// 5. Admin Panel Route (Serves the admin page)
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`Admin Panel available at http://localhost:${PORT}/admin`);
});
