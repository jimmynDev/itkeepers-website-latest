// Local asset preparation only. Uses the existing approved logo unchanged,
// the site's navy/cyan colors, and its exact approved homepage heading.
// Run with the existing Node 22 dependencies and Arial available to librsvg.
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const logo = await readFile(new URL('../public/assets/itkeepers-logo.png', import.meta.url));
const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#071f44"/>
  <circle cx="1150" cy="150" r="300" fill="none" stroke="#42baeb" stroke-opacity=".12" stroke-width="2"/>
  <circle cx="1150" cy="150" r="212" fill="none" stroke="#42baeb" stroke-opacity=".12" stroke-width="2"/>
  <rect x="80" y="211" width="72" height="6" rx="3" fill="#42baeb"/>
  <image x="80" y="80" width="380" height="62.86204923" xlink:href="data:image/png;base64,${logo.toString('base64')}"/>
  <g font-family="Arial, sans-serif" font-size="84" font-weight="700" letter-spacing="-2">
    <text x="80" y="329" fill="#ffffff">Your IT person</text>
    <text x="80" y="431" fill="#42baeb">is a team.</text>
  </g>
</svg>`;
const output = new URL('../public/assets/itkeepers-og.png', import.meta.url);
await writeFile(output, await sharp(Buffer.from(svg)).png({ compressionLevel:9 }).toBuffer());
const { width, height, format, size } = await sharp(await readFile(output)).metadata();
if (width !== 1200 || height !== 630 || format !== 'png') throw new Error('Unexpected social image dimensions or format');
console.log(`Prepared ${width}×${height} ${format}, ${size} bytes`);
