const fs = require('fs');
const path = require('path');

// Simple manual packaging script for Inno Setup
// This avoids electron-builder's symbolic link issues

const electronVersion = '28.3.3';
const platform = 'win32';
const arch = 'x64';

console.log('📦 Manual Electron Packaging for Inno Setup');
console.log('============================================\n');

console.log('⚠️  electron-builder requires admin rights for symbolic links.');
console.log('💡 Solution: Use portable Electron + Inno Setup instead.\n');

console.log('📋 Steps to create installer:\n');

console.log('1️⃣  Download Electron:');
console.log(`   https://github.com/electron/electron/releases/download/v${electronVersion}/electron-v${electronVersion}-${platform}-${arch}.zip`);
console.log('   Extract to: dist/win-unpacked/\n');

console.log('2️⃣  Copy your app files:');
console.log('   - Copy src/ folder to dist/win-unpacked/resources/app/src/');
console.log('   - Copy assets/ folder to dist/win-unpacked/resources/app/assets/');
console.log('   - Copy package.json to dist/win-unpacked/resources/app/package.json\n');

console.log('3️⃣  Rename electron.exe:');
console.log('   - Rename dist/win-unpacked/electron.exe to NebulaTorrent.exe\n');

console.log('4️⃣  Install dependencies:');
console.log('   cd dist/win-unpacked/resources/app');
console.log('   npm install --production\n');

console.log('5️⃣  Compile with Inno Setup:');
console.log('   Open installer.iss in Inno Setup Compiler and press F9\n');

console.log('✨ Or use the automated script below:\n');
console.log('═══════════════════════════════════════════════════════════\n');

console.log(`
@echo off
echo 📦 Packaging NebulaTorrent for Inno Setup...
echo.

REM Create directories
if not exist "dist\\win-unpacked" mkdir "dist\\win-unpacked"
cd dist\\win-unpacked

REM Download Electron (if not exists)
if not exist "electron.exe" (
    echo 📥 Downloading Electron ${electronVersion}...
    curl -L -o electron.zip "https://github.com/electron/electron/releases/download/v${electronVersion}/electron-v${electronVersion}-${platform}-${arch}.zip"
    echo 📂 Extracting...
    tar -xf electron.zip
    del electron.zip
)

REM Create app structure
if not exist "resources\\app" mkdir "resources\\app"

REM Copy app files
echo 📋 Copying application files...
xcopy /E /I /Y "..\\..\\src" "resources\\app\\src\\"
xcopy /E /I /Y "..\\..\\assets" "resources\\app\\assets\\"
copy /Y "..\\..\\package.json" "resources\\app\\package.json"

REM Rename electron.exe
if exist "electron.exe" (
    echo 🔄 Renaming electron.exe to NebulaTorrent.exe...
    ren "electron.exe" "NebulaTorrent.exe"
)

REM Install dependencies
echo 📦 Installing production dependencies...
cd resources\\app
call npm install --production --no-optional
cd ..\\..\\..

echo.
echo ✅ Packaging complete!
echo 📁 Output: dist\\win-unpacked\\
echo.
echo 🚀 Next step: Compile installer.iss with Inno Setup
echo.
pause
`);

// Save as batch file
const batchScript = `@echo off
echo 📦 Packaging NebulaTorrent for Inno Setup...
echo.

REM Create directories
if not exist "dist\\win-unpacked" mkdir "dist\\win-unpacked"
cd dist\\win-unpacked

REM Download Electron (if not exists)
if not exist "electron.exe" (
    echo 📥 Downloading Electron ${electronVersion}...
    curl -L -o electron.zip "https://github.com/electron/electron/releases/download/v${electronVersion}/electron-v${electronVersion}-${platform}-${arch}.zip"
    echo 📂 Extracting...
    tar -xf electron.zip
    del electron.zip
)

REM Create app structure
if not exist "resources\\app" mkdir "resources\\app"

REM Copy app files
echo 📋 Copying application files...
xcopy /E /I /Y "..\\..\\src" "resources\\app\\src\\"
xcopy /E /I /Y "..\\..\\assets" "resources\\app\\assets\\"
copy /Y "..\\..\\package.json" "resources\\app\\package.json"

REM Rename electron.exe
if exist "electron.exe" (
    echo 🔄 Renaming electron.exe to NebulaTorrent.exe...
    if exist "NebulaTorrent.exe" del "NebulaTorrent.exe"
    ren "electron.exe" "NebulaTorrent.exe"
)

REM Install dependencies
echo 📦 Installing production dependencies...
cd resources\\app
call npm install --production --no-optional
cd ..\\..\\..

echo.
echo ✅ Packaging complete!
echo 📁 Output: dist\\win-unpacked\\
echo.
echo 🚀 Next step: Compile installer.iss with Inno Setup
echo    Open installer.iss and press F9
echo.
pause
`;

fs.writeFileSync('package-app.bat', batchScript);
console.log('💾 Saved as: package-app.bat');
console.log('\n🎯 Run: package-app.bat');
