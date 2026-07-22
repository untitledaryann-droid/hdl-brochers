const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building hdl-web...');
execSync('npm install', { cwd: path.join(__dirname, 'hdl-web'), stdio: 'inherit' });
execSync('npm run build', { cwd: path.join(__dirname, 'hdl-web'), stdio: 'inherit' });

console.log('Copying dist to root...');
const src = path.join(__dirname, 'hdl-web', 'dist');
const dest = path.join(__dirname, 'dist');

if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
}
fs.cpSync(src, dest, { recursive: true });

console.log('Build complete!');
