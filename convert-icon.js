const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function convertIcon() {
  try {
    const svgPath = path.join(__dirname, 'assets', 'icon.svg');
    const pngPath = path.join(__dirname, 'assets', 'icon.png');
    
    console.log('Converting SVG to PNG (512x512)...');
    
    // Create 512x512 PNG
    await sharp(svgPath)
      .resize(512, 512)
      .png()
      .toFile(pngPath);
    
    console.log('✅ Created assets/icon.png (512x512)');
    
    // Create 256x256 for ICO
    const png256Path = path.join(__dirname, 'assets', 'icon-256.png');
    await sharp(svgPath)
      .resize(256, 256)
      .png()
      .toFile(png256Path);
    
    console.log('✅ Created assets/icon-256.png');
    
    // Try to create ICO using ImageMagick if available
    try {
      console.log('\nTrying to create .ico file...');
      execSync(`magick convert "${png256Path}" -define icon:auto-resize=256,128,64,48,32,16 "${path.join(__dirname, 'assets', 'icon.ico')}"`, {
        stdio: 'inherit'
      });
      console.log('✅ Created assets/icon.ico using ImageMagick');
    } catch (e) {
      console.log('\n⚠️  ImageMagick not found.');
      console.log('Please create icon.ico manually:');
      console.log('1. Go to https://cloudconvert.com/png-to-ico');
      console.log('2. Upload assets/icon-256.png');
      console.log('3. Set sizes: 256, 128, 64, 48, 32, 16');
      console.log('4. Download as icon.ico');
      console.log('5. Save to assets/icon.ico');
    }
    
    console.log('\n🎉 PNG icons created successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

convertIcon();
