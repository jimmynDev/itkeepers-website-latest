const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const p = require('C:/Users/Jim/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out = '../v2-overnight-audit/reflow'; fs.mkdirSync(out, { recursive: true });
const rows = [];
function files(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(path.join(dir, e.name)) : [path.join(dir, e.name)]); }
const routes = files('dist-staging').filter(f => f.endsWith('.html')).map(f => '/' + path.relative('dist-staging', f).replaceAll('\\', '/').replace(/index\.html$/, ''));
(async () => {
 const b = await p.chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
 const c = await b.newContext({ reducedMotion: 'reduce' }); const page = await c.newPage();
 async function check(name, fn) { try { const detail = await fn(); rows.push({ name, status: 'pass', detail }); } catch (e) { rows.push({ name, status: 'fail', error: e.message }); } fs.writeFileSync(out + '/results.json', JSON.stringify(rows, null, 2)); }
 try {
  for (const route of routes) for (const width of [640, 390, 320]) {
   await check(`text spacing ${width} ${route}`, async () => {
    await page.setViewportSize({ width, height: 900 }); await page.goto('http://127.0.0.1:4388' + route, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: '* { line-height:1.5 !important; letter-spacing:.12em !important; word-spacing:.16em !important; } p { margin-bottom:2em !important; }' });
    const detail = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, clipped: [...document.querySelectorAll('main h1,main h2,main h3,main p,main button')].filter(e => { const s = getComputedStyle(e); return e.clientWidth > 5 && s.visibility !== 'hidden' && (s.overflowY === 'hidden' || s.overflowY === 'clip') && e.scrollHeight > e.clientHeight + 2; }).map(e => ({ tag: e.tagName, class: e.className, text: e.textContent.slice(0, 120) })) }));
    if (detail.scrollWidth > width || detail.clipped.length) { await page.screenshot({ path: out + '/' + route.replaceAll('/', '_') + '-' + width + '-failure.png', fullPage: true }); throw new Error(JSON.stringify(detail)); }
    if (['/how-we-work/', '/services/ai-automation/', '/services/cybersecurity/', '/services/networks-infrastructure/'].includes(route) && [320, 390].includes(width)) await page.screenshot({ path: out + '/' + route.replaceAll('/', '_') + '-' + width + '-after.png', fullPage: true });
    return detail;
   });
  }
  for (const route of ['/', '/contact/', '/services/managed-it/', '/emergency/']) await check('double text size ' + route, async () => {
    await page.setViewportSize({ width: 1280, height: 900 }); await page.goto('http://127.0.0.1:4388' + route, { waitUntil: 'networkidle' });
    await page.evaluate(() => { const list = [...document.querySelectorAll('body *')].map(e => [e, parseFloat(getComputedStyle(e).fontSize)]); for (const [e, size] of list) if (e instanceof HTMLElement) e.style.fontSize = size * 2 + 'px'; });
    const d = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
    await page.screenshot({ path: out + '/double-text' + route.replaceAll('/', '_') + '.png', fullPage: true }); assert(d.scrollWidth <= d.width, JSON.stringify(d));
    return { ...d, limitation: 'Computed-font-size stress test, not native browser zoom or assistive-technology signoff.' };
  });
 } finally { await b.close(); }
 console.log(JSON.stringify({ checks: rows.length, pass: rows.filter(r => r.status === 'pass').length, failures: rows.filter(r => r.status === 'fail') }));
 if (rows.some(r => r.status === 'fail')) process.exitCode = 1;
})().catch(e => { console.error(e); process.exitCode = 1; });
