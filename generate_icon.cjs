const fs = require('fs');
const path = require('path');

function createIcoBuffer(width, height) {
  const bpp = 32;
  const pixelDataSize = width * height * 4;
  const maskDataSize = Math.ceil((width * height) / 8);
  const infoHeaderSize = 40;
  const imageSize = infoHeaderSize + pixelDataSize + maskDataSize;
  const headerSize = 6 + 16;
  const fileSize = headerSize + imageSize;

  const buf = Buffer.alloc(fileSize);

  // ICO Header
  buf.writeUInt16LE(0, 0); // Reserved
  buf.writeUInt16LE(1, 2); // Image type (1 = ICO)
  buf.writeUInt16LE(1, 4); // Number of images

  // Icon Directory Entry
  buf.writeUInt8(width, 6);
  buf.writeUInt8(height, 7);
  buf.writeUInt8(0, 8); // Color palette
  buf.writeUInt8(0, 9); // Reserved
  buf.writeUInt16LE(1, 10); // Color planes
  buf.writeUInt16LE(bpp, 12); // Bits per pixel
  buf.writeUInt32LE(imageSize, 14); // Size of image data
  buf.writeUInt32LE(headerSize, 18); // Offset of image data

  // BITMAPINFOHEADER
  let offset = headerSize;
  buf.writeUInt32LE(infoHeaderSize, offset); offset += 4;
  buf.writeInt32LE(width, offset); offset += 4;
  buf.writeInt32LE(height * 2, offset); offset += 4;
  buf.writeUInt16LE(1, offset); offset += 2;
  buf.writeUInt16LE(bpp, offset); offset += 2;
  buf.writeUInt32LE(0, offset); offset += 4;
  buf.writeUInt32LE(pixelDataSize, offset); offset += 4;
  buf.writeInt32LE(0, offset); offset += 4;
  buf.writeInt32LE(0, offset); offset += 4;
  buf.writeUInt32LE(0, offset); offset += 4;
  buf.writeUInt32LE(0, offset); offset += 4;

  const cx = width / 2;
  const cy = height / 2;
  const rCorner = 14;

  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const dx = Math.abs(x - cx + 0.5);
      const dy = Math.abs(y - cy + 0.5);

      const bx = x - 16;
      const by = 31 - y - 16;

      let bgR = 0xF5, bgG = 0x9E, bgB = 0x0B, alpha = 255;
      
      if (dx > rCorner || dy > rCorner) {
        alpha = 0;
      }

      let r = bgR, g = bgG, b = bgB;

      const bulbHeadDist = Math.sqrt(bx * bx + (by - 3) * (by - 3));
      const isBase = Math.abs(bx) <= 4 && by >= -8 && by <= -3;
      const isScrew = Math.abs(bx) <= 3 && by >= -12 && by <= -9;

      if (bulbHeadDist <= 7 || isBase) {
        if (bulbHeadDist >= 5.5 && bulbHeadDist <= 7) {
          r = 0; g = 0; b = 0;
        } else {
          r = 0xFA; g = 0xCC; b = 0x15;
        }
      } else if (isScrew) {
        r = 0x33; g = 0x33; b = 0x33;
      }

      if ((Math.abs(bx - 9) < 1.5 && Math.abs(by - 9) < 1.5) ||
          (Math.abs(bx + 9) < 1.5 && Math.abs(by - 9) < 1.5) ||
          (Math.abs(bx) < 1.5 && Math.abs(by - 12) < 1.5) ||
          (Math.abs(bx - 12) < 1.5 && Math.abs(by - 1) < 1.5) ||
          (Math.abs(bx + 12) < 1.5 && Math.abs(by - 1) < 1.5)) {
        r = 0; g = 0; b = 0;
      }

      buf.writeUInt8(b, offset);
      buf.writeUInt8(g, offset + 1);
      buf.writeUInt8(r, offset + 2);
      buf.writeUInt8(alpha, offset + 3);
      offset += 4;
    }
  }

  for (let i = 0; i < maskDataSize; i++) {
    buf.writeUInt8(0, offset + i);
  }

  return buf;
}

const icoBuf = createIcoBuffer(32, 32);
const outPath = path.join(__dirname, 'app_logo.ico');
fs.writeFileSync(outPath, icoBuf);

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuf);

console.log('Successfully generated app_logo.ico and public/favicon.ico!');
