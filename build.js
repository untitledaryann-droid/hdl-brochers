const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building hdl-web...');
execSync('npm install', { cwd: path.join(__dirname, 'hdl-web'), stdio: 'inherit' });
execSync('npm run build', { cwd: path.join(__dirname, 'hdl-web'), stdio: 'inherit' });

console.log('Copying dist to root...');
const src = path.join(__dirname, 'hdl-web', 'dist');
const destDist = path.join(__dirname, 'dist');

if (fs.existsSync(destDist)) {
    fs.rmSync(destDist, { recursive: true, force: true });
}
fs.cpSync(src, destDist, { recursive: true });

console.log('Copying contents to the repository root as a fallback...');
const files = fs.readdirSync(src);
for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(__dirname, file);
    fs.cpSync(srcPath, destPath, { recursive: true });
}

console.log('Build complete!');
