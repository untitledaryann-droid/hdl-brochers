const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 8000;
const SECRET_KEY = 'hdl_super_secret_key_123'; // In production, use environment variables

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dataFile = path.join(__dirname, 'data.json');

// --- API ROUTES ---

// 1. Get Configuration (Public)
app.get('/api/config', (req, res) => {
    try {
        const data = fs.readFileSync(dataFile, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json({ error: 'Failed to read configuration data.' });
    }
});

// 2. Login (Public)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    // Hardcoded credentials as requested
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
app.post('/api/config', authenticateToken, (req, res) => {
    try {
        const newData = req.body;
        // Basic validation
        if (!newData.basicInfo || !newData.links) {
            return res.status(400).json({ error: 'Invalid data format' });
        }
        fs.writeFileSync(dataFile, JSON.stringify(newData, null, 2));
        res.json({ message: 'Configuration updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save configuration data.' });
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
