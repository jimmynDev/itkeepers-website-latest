/** Reproduce the dedicated V2 social PNG using the actual logo and bundled font.
 * Uses existing local browser tooling; no website screenshot or build dependency.
 * Optional tooling paths: ITKEEPERS_PLAYWRIGHT_PATH, ITKEEPERS_CHROMIUM_EXECUTABLE.
 */
import fs from 'node:fs';
import sharp from 'sharp';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); }
catch {
  const bundled = path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
  playwright = require(process.env.ITKEEPERS_PLAYWRIGHT_PATH || bundled);
}
const installedChrome = path.join(process.env.PROGRAMFILES || '', 'Google/Chrome/Application/chrome.exe');
const executablePath = process.env.ITKEEPERS_CHROMIUM_EXECUTABLE || (process.platform === 'win32' && fs.existsSync(installedChrome) ? installedChrome : undefined);
const browser = await playwright.chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
try {
  const page = await browser.newPage();
  const logo = fs.readFileSync(path.join(root, 'public/assets/itkeepers-logo.png'));
  const font = fs.readFileSync(path.join(root, 'public/fonts/hero-status/instrument-sans-latin.woff2'));
  const result = await page.evaluate(async ({ logo, font }) => {
    const family = 'ITKeepers Social';
    const face = new FontFace(family, `url(data:font/woff2;base64,${font})`, { weight: '400 700' });
    document.fonts.add(await face.load());
    await document.fonts.ready;
    const mark = new Image(); mark.src = 'data:image/png;base64,' + logo; await mark.decode();
    const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 630;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#081321'; ctx.fillRect(0, 0, 1200, 630);
    const glow = ctx.createRadialGradient(1090, 270, 0, 1090, 270, 570);
    glow.addColorStop(0, 'rgba(56,189,248,.10)'); glow.addColorStop(1, 'rgba(56,189,248,0)');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, 1200, 630);
    // Sparse routed lines sit well outside the headline and service text.
    ctx.strokeStyle = 'rgba(56,189,248,.14)'; ctx.lineWidth = 1.25;
    for (const points of [ [[955,-20],[955,128],[1040,213],[1220,213]], [[1052,-20],[1052,102],[1112,162],[1220,162]], [[1220,355],[1080,355],[1000,435],[1000,650]], [[1220,428],[1138,428],[1085,481],[1085,650]] ]) {
      ctx.beginPath(); points.forEach(([x,y],i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y)); ctx.stroke();
    }
    for (const [x,y] of [[955,128],[1040,213],[1112,162],[1080,355],[1000,435],[1085,481]]) {
      ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fillStyle='rgba(56,189,248,.30)'; ctx.fill();
    }
    ctx.drawImage(mark, 72, 54, 332, 332 * mark.height / mark.width);
    ctx.fillStyle = '#38BDF8'; ctx.beginPath(); ctx.roundRect(72, 150, 52, 4, 2); ctx.fill();
    ctx.textBaseline = 'alphabetic'; ctx.letterSpacing = '-2px'; ctx.font = `700 92px "${family}"`;
    ctx.fillStyle = '#F7FAFF'; ctx.fillText('Your IT person', 68, 261);
    ctx.fillStyle = '#38BDF8'; ctx.fillText('is a team.', 68, 365);
    const bounds = [{ text:'Your IT person', x:68, y:261, width:ctx.measureText('Your IT person').width }, { text:'is a team.', x:68, y:365, width:ctx.measureText('is a team.').width }];
    ctx.letterSpacing = '0px'; ctx.font = `500 29px "${family}"`; ctx.fillStyle='#D6E3F2';
    const supporting = 'Managed IT · Cybersecurity · Cloud · Infrastructure';
    ctx.fillText(supporting, 72, 438); bounds.push({text:supporting,x:72,y:438,width:ctx.measureText(supporting).width});
    const divider = ctx.createLinearGradient(72,0,1128,0); divider.addColorStop(0,'rgba(184,205,230,.24)'); divider.addColorStop(1,'rgba(184,205,230,.04)');
    ctx.fillStyle=divider;ctx.fillRect(72,515,1056,1);
    ctx.font=`500 24px "${family}"`;ctx.fillStyle='#B8C8DB';ctx.fillText('ITKeepers · Lebanon',72,565);
    bounds.push({text:'ITKeepers · Lebanon',x:72,y:565,width:ctx.measureText('ITKeepers · Lebanon').width});
    if (bounds.some(b=>b.x+b.width>1128)) throw Error('Social image text exceeds its safe area');
    return { png:canvas.toDataURL('image/png').split(',')[1], bounds };
  }, { logo:logo.toString('base64'), font:font.toString('base64') });
  const output = path.join(root, 'public/assets/itkeepers-og-v2.png');
  await sharp(Buffer.from(result.png, 'base64')).png({ compressionLevel:9, effort:10 }).toFile(output);
  console.log(JSON.stringify({ output, width:1200, height:630, bytes:fs.statSync(output).size, bounds:result.bounds }));
} finally { await browser.close(); }
