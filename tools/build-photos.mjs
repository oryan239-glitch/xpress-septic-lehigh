// Converts original photos into responsive AVIF / WebP / JPEG sets.
//
//   1. Put originals in  photos/        (e.g. photos/xpress-truck-side.jpg — real photos only)
//   2. Run               node tools/build-photos.mjs
//   3. Paste the printed <picture> snippet into the page source in src/pages/, then run
//      node tools/build-pages.mjs
//
// Output goes to assets/img/<name>-<width>.<ext>. The photos/ folder is not published.

import sharp from "sharp";
import { readdirSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, parse } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "photos");
const outDir = join(root, "assets/img");
const WIDTHS = [480, 800, 1200, 1600];
mkdirSync(outDir, { recursive: true });

for (const file of readdirSync(srcDir).filter((f) => /\.(jpe?g|png|webp|heic|tiff?)$/i.test(f))) {
  const name = parse(file).name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const img = sharp(join(srcDir, file)).rotate(); // respect camera orientation
  const { width: w0, height: h0 } = await img.metadata();
  const widths = WIDTHS.filter((w) => w <= w0);
  for (const w of widths) {
    const r = img.clone().resize({ width: w }).withMetadata({ exif: {} }); // strips GPS/EXIF
    await r.clone().avif({ quality: 52, effort: 6 }).toFile(join(outDir, `${name}-${w}.avif`));
    await r.clone().webp({ quality: 74 }).toFile(join(outDir, `${name}-${w}.webp`));
    await r.clone().jpeg({ quality: 78, mozjpeg: true, progressive: true }).toFile(join(outDir, `${name}-${w}.jpg`));
  }
  const h = Math.round((h0 * widths.at(-1)) / w0);
  const set = (ext) => widths.map((w) => `/assets/img/${name}-${w}.${ext} ${w}w`).join(", ");
  const sizes = "(min-width: 900px) 520px, 100vw";
  console.log(`\n<!-- ${file}: hero use = fetchpriority="high" and no loading attr; below the fold = loading="lazy" -->
<picture>
  <source type="image/avif" srcset="${set("avif")}" sizes="${sizes}">
  <source type="image/webp" srcset="${set("webp")}" sizes="${sizes}">
  <img src="/assets/img/${name}-${widths.at(-1)}.jpg" srcset="${set("jpg")}" sizes="${sizes}"
       width="${widths.at(-1)}" height="${h}" alt="DESCRIBE WHAT IS ACTUALLY IN THE PHOTO" decoding="async">
</picture>`);
}
