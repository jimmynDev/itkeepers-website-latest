const fs = require('node:fs'), assert = require('node:assert/strict');
const p = require('C:/Users/Jim/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out = '../v2-overnight-audit/components'; fs.mkdirSync(out, { recursive: true });
const results = [], axe = fs.readFileSync('C:/Users/Jim/AppData/Local/npm-cache/_npx/1722e863ebfd623b/node_modules/axe-core/axe.min.js', 'utf8');
(async () => {
 const b = await p.chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
 const c = await b.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
 const page = await c.newPage();
 await c.route('**/*', route => route.request().method() === 'POST' ? route.abort() : route.continue());
 async function check(name, fn) { try { results.push({ name, status: 'pass', detail: await fn() }); } catch (e) { results.push({ name, status: 'fail', error: e.message }); } fs.writeFileSync(out + '/results.json', JSON.stringify(results, null, 2)); }
 try {
  await page.goto('http://127.0.0.1:4388/', { waitUntil: 'networkidle' });
  await check('playbook can be dismissed before inspecting component content', async () => {
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight * .25));
    const card = page.locator('.playbook-card'); await card.waitFor({ state: 'visible' });
    await card.screenshot({ path: out + '/playbook-open.png' });
    await card.locator('.playbook-close').click(); assert(await card.isHidden());
    await page.evaluate(() => scrollTo(0, 0));
  });
  for (const [name, selector] of [['hero', '.home-hero'], ['seven-services', '#services'], ['proof-circles', '.business-value'], ['technology', '.technology-ecosystem'], ['who-you-work-with', '.who-we-are'], ['incident-timeline', '.how-we-operate'], ['testimonials', '.client-proof'], ['contact-cta', '.home-closing']]) await check('screenshot ' + name, async () => { const el = page.locator(selector); if (!(await el.count())) throw Error('Selector absent: ' + selector); await el.scrollIntoViewIfNeeded(); await el.screenshot({ path: out + '/' + name + '.png' }); });
  for (const el of await page.locator('[data-animation]').all()) await check('settled animation ' + await el.getAttribute('data-animation'), async () => { await el.scrollIntoViewIfNeeded(); await el.screenshot({ path: out + '/animation-' + await el.getAttribute('data-animation') + '-settled.png' }); return { state: await el.getAttribute('data-animation-state'), alternative: await el.getAttribute('aria-label') }; });
  for (const width of [1440, 390, 320]) await check('404 recovery ' + width, async () => {
    await page.setViewportSize({ width, height: 900 }); const r = await page.goto('http://127.0.0.1:4388/missing/', { waitUntil: 'networkidle' }); assert.equal(r.status(), 404);
    assert.equal(await page.locator('h1').innerText(), 'Let’s get you back on track.'); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.evaluate(axe); const a = await page.evaluate(async () => { const r = await axe.run(); return { violations: r.violations, incomplete: r.incomplete }; }); assert.equal(a.violations.length, 0);
    await page.screenshot({ path: out + '/404-after-' + width + '.png', fullPage: true }); fs.writeFileSync(out + '/404-rendered.html', await page.content()); return { status: r.status(), axe: a };
  });
  await check('phishing flow semantic names remain exposed across all four choices and explanations', async () => {
    await page.setViewportSize({ width: 390, height: 900 }); await page.goto('http://127.0.0.1:4388/services/cybersecurity/', { waitUntil: 'networkidle' });
    const states = [];
    for (let i = 0; i < 4; i++) {
      const panel = page.locator(`[data-decision-scenario="${i}"]`); await panel.scrollIntoViewIfNeeded(); assert.equal(await panel.getAttribute('role'), 'group');
      await page.evaluate(axe); const scan = await page.evaluate(async () => { const r = await axe.run(document.querySelector('[data-phishing-experience]'), { runOnly: { type: 'rule', values: ['aria-prohibited-attr', 'aria-valid-attr-value', 'button-name'] } }); return { violations: r.violations, incomplete: r.incomplete }; }); assert.equal(scan.violations.length + scan.incomplete.length, 0);
      await panel.locator('[data-decision-option]').first().click(); const feedback = page.locator('[data-decision-explanation]:not([hidden])'); assert.equal(await feedback.getAttribute('role'), 'group'); states.push(await feedback.innerText()); await feedback.locator('[data-decision-next]').click();
    }
    assert(await page.locator('[data-decision-final]').isVisible()); return { exploredMessages: states.length, counter: await page.locator('[data-decision-count]').getAttribute('aria-label') };
  });
  await check('normal motion starts service canvases near viewport and particle pause works', async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await c.addInitScript(() => { window.auditContexts = []; window.auditLongTasks = []; const original = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function(...args) { window.auditContexts.push({ type: args[0], animation: this.closest('[data-animation]')?.getAttribute('data-animation'), at: performance.now() }); return original.apply(this, args); }; new PerformanceObserver(list => window.auditLongTasks.push(...list.getEntries().map(e => ({ start: e.startTime, duration: e.duration })))).observe({ type: 'longtask', buffered: true }); });
    await page.setViewportSize({ width: 1440, height: 900 }); await page.goto('http://127.0.0.1:4388/', { waitUntil: 'networkidle' });
    const atLoad = await page.evaluate(() => window.auditContexts); assert(!atLoad.some(e => ['isometric-network', 'neural-sphere'].includes(e.animation)));
    for (const name of ['isometric-network', 'neural-sphere', 'particle-logo']) {
      const el = page.locator(`[data-animation="${name}"]`); await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(600); await el.screenshot({ path: out + '/' + name + '-normal-motion.png' });
      if (name === 'particle-logo') { const button = el.locator('[data-animation-toggle]'); await button.click(); assert.equal((await button.textContent()).trim(), 'Resume animation'); await el.screenshot({ path: out + '/' + name + '-paused.png' }); }
    }
    const evidence = await page.evaluate(() => ({ contexts: window.auditContexts, longTasks: window.auditLongTasks, states: [...document.querySelectorAll('[data-animation]')].map(e => ({ animation: e.getAttribute('data-animation'), state: e.getAttribute('data-animation-state') })) }));
    await page.locator('.home-hero').scrollIntoViewIfNeeded(); await page.waitForTimeout(200); evidence.offscreenStates = await page.evaluate(() => [...document.querySelectorAll('[data-animation]')].map(e => ({ animation: e.getAttribute('data-animation'), state: e.getAttribute('data-animation-state') })));
    return { atLoad, ...evidence };
  });
 } finally { await b.close(); }
 console.log(JSON.stringify({ checks: results.length, pass: results.filter(r => r.status === 'pass').length, failures: results.filter(r => r.status === 'fail') }));
 if (results.some(r => r.status === 'fail')) process.exitCode = 1;
})().catch(e => { console.error(e); process.exitCode = 1; });
