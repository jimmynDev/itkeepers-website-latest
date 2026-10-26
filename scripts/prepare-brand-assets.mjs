// Reproduce delivery derivatives using the existing Astro image dependency.
// Original brand artwork and the social-sharing PNG remain unchanged.
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

for (const width of [192, 384]) {
  await sharp('public/assets/itkeepers-logo.png').resize({ width })
    .webp({ lossless: true, effort: 6 }).toFile(`src/assets/itkeepers-logo-${width}.webp`);
}
const file = 'public/favicon.svg';
const svg = await readFile(file, 'utf8');
const embedded = svg.match(/data:image\/(?:png|webp);base64,([^"\s]+)/);
if (!embedded) throw new Error('Expected embedded official favicon image');
const original = Buffer.from(embedded[1], 'base64');
const optimized = await sharp(original).webp({ lossless: true, effort: 6 }).toBuffer();
const before = await sharp(original).ensureAlpha().raw().toBuffer();
const after = await sharp(optimized).ensureAlpha().raw().toBuffer();
if (before.length !== after.length) throw new Error('Favicon dimensions changed');
for (let i = 0; i < before.length; i += 4) {
  if (before[i + 3] !== after[i + 3] || (before[i + 3] &&
      (before[i] !== after[i] || before[i + 1] !== after[i + 1] || before[i + 2] !== after[i + 2]))) {
    throw new Error('Favicon visible pixels changed');
  }
}
await writeFile(file, svg.replace(embedded[0], `data:image/webp;base64,${optimized.toString('base64')}`));
