@echo off
echo 📦 Packaging NebulaTorrent for Inno Setup...
echo.

REM Create directories
if not exist "dist\win-unpacked" mkdir "dist\win-unpacked"
cd dist\win-unpacked

REM Download Electron (if not exists)
if not exist "electron.exe" (
    echo 📥 Downloading Electron 28.3.3...
    curl -L -o electron.zip "https://github.com/electron/electron/releases/download/v28.3.3/electron-v28.3.3-win32-x64.zip"
    echo 📂 Extracting...
    tar -xf electron.zip
    del electron.zip
)

REM Create app structure
if not exist "resources\app" mkdir "resources\app"

REM Copy app files
echo 📋 Copying application files...
xcopy /E /I /Y "..\..\src" "resources\app\src\"
xcopy /E /I /Y "..\..\assets" "resources\app\assets\"
copy /Y "..\..\package.json" "resources\app\package.json"

REM Rename electron.exe
echo 🔄 Renaming electron.exe to NebulaTorrent.exe...
if exist "NebulaTorrent.exe" del "NebulaTorrent.exe"
if exist "electron.exe" ren "electron.exe" "NebulaTorrent.exe"

REM Replace icon in exe
echo 🎨 Replacing icon in NebulaTorrent.exe...
if exist "NebulaTorrent.exe" (
    echo    Icon will be visible after installation
)

REM Install dependencies
echo 📦 Installing production dependencies...
cd resources\app
call npm install --production --no-optional --ignore-scripts
cd ..\..\..

REM Replace icon using rcedit
cd ..\..\..
echo 🎨 Replacing icon in executable...
if not exist "rcedit-x64.exe" (
    echo 📥 Downloading rcedit...
    curl -L -o rcedit-x64.exe "https://github.com/electron/rcedit/releases/download/v2.0.0/rcedit-x64.exe"
)
echo 🔧 Applying icon to NebulaTorrent.exe...
rcedit-x64.exe "dist\win-unpacked\NebulaTorrent.exe" --set-icon "assets\icon.ico"
echo 📝 Setting product information...
rcedit-x64.exe "dist\win-unpacked\NebulaTorrent.exe" --set-version-string ProductName "NebulaTorrent"
rcedit-x64.exe "dist\win-unpacked\NebulaTorrent.exe" --set-version-string CompanyName "NebulaTorrent"
rcedit-x64.exe "dist\win-unpacked\NebulaTorrent.exe" --set-version-string FileDescription "NebulaTorrent Torrent Client"
rcedit-x64.exe "dist\win-unpacked\NebulaTorrent.exe" --set-version-string InternalName "NebulaTorrent"
rcedit-x64.exe "dist\win-unpacked\NebulaTorrent.exe" --set-version-string OriginalFilename "NebulaTorrent.exe"
rcedit-x64.exe "dist\win-unpacked\NebulaTorrent.exe" --set-file-version "1.0.0"
rcedit-x64.exe "dist\win-unpacked\NebulaTorrent.exe" --set-product-version "1.0.0"

echo.
echo ✅ Packaging complete!
echo 📁 Output: dist\win-unpacked\
echo.
echo 🚀 Next step: Compile installer.iss with Inno Setup
echo    Open installer.iss and press F9
echo.
pause
