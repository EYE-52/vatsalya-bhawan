// Usage: NODE_PATH=/path/to/bundled/node_modules node scripts/social-preview/render-icons.cjs
const sharp = require('sharp');
const fs = require('node:fs/promises');
const path = require('node:path');

async function main() {
  const publicDir = path.resolve(__dirname, '../../public');
  const svg = await fs.readFile(path.join(publicDir, 'favicon.svg'));
  for (const [size, filename] of [[32, 'favicon-32.png'], [180, 'apple-touch-icon.png'], [192, 'logo192.png'], [512, 'logo512.png']]) {
    const png = await sharp(svg, { density: size * 72 / 64 }).resize(size, size).png().toBuffer();
    await fs.writeFile(path.join(publicDir, filename), png);
    if (size === 32) {
      // ICO permits a PNG payload; one directory entry points to the 32px image.
      const header = Buffer.alloc(22);
      header.writeUInt16LE(1, 2);
      header.writeUInt16LE(1, 4);
      header[6] = header[7] = size;
      header.writeUInt16LE(1, 10);
      header.writeUInt16LE(32, 12);
      header.writeUInt32LE(png.length, 14);
      header.writeUInt32LE(header.length, 18);
      await fs.writeFile(path.join(publicDir, 'favicon.ico'), Buffer.concat([header, png]));
    }
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
