const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIcon() {
  const sizes = [256, 128, 64, 48, 32, 16];
  const inputFile = path.join(__dirname, 'assets', 'icon.png');
  const outputFile = path.join(__dirname, 'assets', 'icon.ico');

  console.log('🎨 Generating icon.ico with multiple sizes...');
  
  try {
    // Generate PNG files for each size
    const pngBuffers = await Promise.all(
      sizes.map(async (size) => {
        console.log(`  ✓ Creating ${size}x${size} icon...`);
        return await sharp(inputFile)
          .resize(size, size, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .png()
          .toBuffer();
      })
    );

    // Create ICO file header
    const iconDir = Buffer.alloc(6);
    iconDir.writeUInt16LE(0, 0); // Reserved
    iconDir.writeUInt16LE(1, 2); // Type: 1 = ICO
    iconDir.writeUInt16LE(sizes.length, 4); // Number of images

    // Create directory entries
    const dirEntries = [];
    let imageOffset = 6 + (sizes.length * 16); // Header + all directory entries

    for (let i = 0; i < sizes.length; i++) {
      const size = sizes[i];
      const imageData = pngBuffers[i];
      const entry = Buffer.alloc(16);
      
      entry.writeUInt8(size === 256 ? 0 : size, 0); // Width (0 means 256)
      entry.writeUInt8(size === 256 ? 0 : size, 1); // Height (0 means 256)
      entry.writeUInt8(0, 2); // Color palette
      entry.writeUInt8(0, 3); // Reserved
      entry.writeUInt16LE(1, 4); // Color planes
      entry.writeUInt16LE(32, 6); // Bits per pixel
      entry.writeUInt32LE(imageData.length, 8); // Image size
      entry.writeUInt32LE(imageOffset, 12); // Image offset
      
      dirEntries.push(entry);
      imageOffset += imageData.length;
    }

    // Combine all parts
    const icoFile = Buffer.concat([
      iconDir,
      ...dirEntries,
      ...pngBuffers
    ]);

    // Write to file
    fs.writeFileSync(outputFile, icoFile);
    
    console.log(`✅ Icon generated successfully: ${outputFile}`);
    console.log(`📦 File size: ${(icoFile.length / 1024).toFixed(2)} KB`);
    console.log(`🎯 Sizes included: ${sizes.join(', ')}`);
    
  } catch (error) {
    console.error('❌ Error generating icon:', error);
    process.exit(1);
  }
}

generateIcon();
