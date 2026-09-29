// Generates favicon.ico, apple-touch-icon.png and the Open Graph image from the SVG sources.
// Run: node tools/build-icons.mjs (from the repo root) after installing sharp in tools/.
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const mark = readFileSync(join(root, "assets/logo-mark.svg"));
const truck = readFileSync(join(root, "assets/truck-illustration.svg"));

// favicon.ico containing a single 48px PNG
const png48 = await sharp(mark, { density: 300 }).resize(48, 48).png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
header.writeUInt8(48, 6); header.writeUInt8(48, 7); header.writeUInt8(0, 8); header.writeUInt8(0, 9);
header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12);
header.writeUInt32LE(png48.length, 14); header.writeUInt32LE(22, 18);
writeFileSync(join(root, "favicon.ico"), Buffer.concat([header, png48]));

await sharp(mark, { density: 600 }).resize(180, 180).flatten({ background: "#0a1a31" })
  .png().toFile(join(root, "assets/apple-touch-icon.png"));

// Open Graph 1200x630
const truckPng = await sharp(truck, { density: 160 }).resize(640).png().toBuffer();
const markPng = await sharp(mark, { density: 300 }).resize(72, 72).png().toBuffer();
const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
<defs><radialGradient id="a" cx=".85" cy=".1" r=".7"><stop offset="0" stop-color="#2dd4bf" stop-opacity=".22"/><stop offset="1" stop-color="#2dd4bf" stop-opacity="0"/></radialGradient>
<linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1a31"/><stop offset="1" stop-color="#0f2442"/></linearGradient></defs>
<rect width="1200" height="630" fill="url(#b)"/><rect width="1200" height="630" fill="url(#a)"/>
<g font-family="Segoe UI, Arial, Helvetica, sans-serif" fill="#fff">
<text x="164" y="118" font-size="34" font-weight="800">Xpress Septic Pumping</text>
<text x="72" y="238" font-size="64" font-weight="800" letter-spacing="-1.5">Septic Tank Pumping</text>
<text x="72" y="314" font-size="64" font-weight="800" letter-spacing="-1.5" fill="#2dd4bf">in Lehigh Acres, FL</text>
<text x="72" y="392" font-size="28" font-weight="600" fill="#b5c3d6">Fast • Professional • Local</text>
<rect x="72" y="452" width="372" height="84" rx="16" fill="#2dd4bf"/>
<text x="258" y="508" font-size="38" font-weight="800" fill="#0a1a31" text-anchor="middle">(239) 506-1163</text>
</g></svg>`);
await sharp(bg).composite([
  { input: markPng, left: 72, top: 64 },
  { input: truckPng, left: 540, top: 250 },
]).jpeg({ quality: 84, mozjpeg: true }).toFile(join(root, "assets/og-xpress-septic-pumping.jpg"));
console.log("icons + og done");
