const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎨 Replacing icon in NebulaTorrent.exe...\n');

const exePath = path.join(__dirname, 'dist', 'win-unpacked', 'NebulaTorrent.exe');
const iconPath = path.join(__dirname, 'assets', 'icon.ico');

if (!fs.existsSync(exePath)) {
    console.error('❌ NebulaTorrent.exe not found!');
    console.log('   Run package-app.bat first');
    process.exit(1);
}

if (!fs.existsSync(iconPath)) {
    console.error('❌ icon.ico not found!');
    process.exit(1);
}

console.log('📦 Using rcedit to replace icon...');
console.log('   This requires rcedit-x64.exe\n');

// Check if rcedit exists
const rceditPath = path.join(__dirname, 'node_modules', 'electron', 'dist', 'rcedit.exe');
const rceditAlt = path.join(__dirname, 'rcedit-x64.exe');

let rcedit = null;
if (fs.existsSync(rceditPath)) {
    rcedit = rceditPath;
} else if (fs.existsSync(rceditAlt)) {
    rcedit = rceditAlt;
}

if (!rcedit) {
    console.log('⚠️  rcedit not found. Downloading...\n');
    console.log('Download rcedit-x64.exe from:');
    console.log('https://github.com/electron/rcedit/releases/latest/download/rcedit-x64.exe');
    console.log('\nSave it to the project root folder.\n');
    console.log('Or install electron: npm install electron --save-dev');
    process.exit(1);
}

try {
    console.log('🔧 Replacing icon...');
    execSync(`"${rcedit}" "${exePath}" --set-icon "${iconPath}"`, { stdio: 'inherit' });
    console.log('\n✅ Icon replaced successfully!');
    console.log('📁 File: ' + exePath);
} catch (error) {
    console.error('❌ Failed to replace icon:', error.message);
    process.exit(1);
}
