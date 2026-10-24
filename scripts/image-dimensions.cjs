const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'../public');

// Read intrinsic dimensions without a runtime image-processing dependency.
module.exports = src => {
  const file = fs.readFileSync(path.join(root,src));
  if (src.endsWith('.svg')) {
    const svg = file.toString();
    return [Number(svg.match(/width="(\d+)"/)[1]),Number(svg.match(/height="(\d+)"/)[1])];
  }
  if (src.endsWith('.png')) return [file.readUInt32BE(16),file.readUInt32BE(20)];
  if (src.endsWith('.webp')) {
    let offset = 12;
    while (offset + 8 < file.length) {
      const chunk = file.toString('ascii',offset,offset+4);
      const size = file.readUInt32LE(offset+4);
      const data = offset+8;
      if (chunk === 'VP8X') return [file.readUIntLE(data+4,3)+1,file.readUIntLE(data+7,3)+1];
      if (chunk === 'VP8L') {
        const bits = file.readUInt32LE(data+1);
        return [(bits & 0x3fff)+1,((bits >>> 14) & 0x3fff)+1];
      }
      if (chunk === 'VP8 ') return [file.readUInt16LE(data+6)&0x3fff,file.readUInt16LE(data+8)&0x3fff];
      offset += 8+size+(size%2);
    }
  }
  throw new Error(`Cannot read image dimensions: ${src}`);
};
