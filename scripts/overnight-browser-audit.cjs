// Read-only browser evidence. No form submissions, external navigations or deployment.
const fs = require('node:fs');
const path = require('node:path');
const { chromium, webkit, firefox } = require('C:/Users/Jim/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = process.env.AUDIT_BASE || 'http://127.0.0.1:4388';
const phase = process.env.AUDIT_PHASE || 'baseline';
const engine = process.env.AUDIT_ENGINE || 'chromium';
const out = path.resolve('../v2-overnight-audit', phase);
fs.mkdirSync(out, { recursive: true });
const axe = fs.readFileSync('C:/Users/Jim/AppData/Local/npm-cache/_npx/1722e863ebfd623b/node_modules/axe-core/axe.min.js', 'utf8');
function files(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(path.join(dir, e.name)) : [path.join(dir, e.name)]); }
const routes = files('dist-staging').filter(f => f.endsWith('.html')).map(f => '/' + path.relative('dist-staging', f).replaceAll('\\', '/').replace(/index\.html$/, '')).sort();
if (routes.length !== 20) throw new Error('Audit requires the completed 20-page artifact; do not run during a rebuild.');
const rows = [];
(async () => {
  let browser;
  try { browser = await ({ chromium, webkit, firefox })[engine].launch(engine === 'chromium' ? { executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true } : { headless: true }); }
  catch (e) { fs.writeFileSync(path.join(out, engine + '-blocked.json'), JSON.stringify({ error: e.message })); console.log(engine, 'BLOCKED', e.message); return; }
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  // Explicitly prevent any POST, including accidental third-party submissions.
  await ctx.route('**/*', route => route.request().method() === 'POST' ? route.abort() : route.continue());
  let errors = [], csp = [], external = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('request', r => { if (!r.url().startsWith(base) && !r.url().startsWith('data:')) external.push(r.url()); });
  await ctx.addInitScript(() => { window.auditCSP = []; document.addEventListener('securitypolicyviolation', e => window.auditCSP.push({ directive: e.effectiveDirective, blocked: e.blockedURI })); });
  try {
    const widths = process.env.AUDIT_WIDTHS?.split(',').map(Number) || (engine === 'chromium' ? [1440, 1024, 768, 390, 375, 320] : [1440, 390, 320]);
    for (const route of routes) {
      for (const width of widths) {
        errors = []; external = [];
        await page.setViewportSize({ width, height: 900 });
        const response = await page.goto(base + route, { waitUntil: 'networkidle', timeout: 30000 });
        await page.evaluate(() => document.fonts.ready);
        // Reveal scroll-triggered content without changing site motion preferences.
        await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 750) { scrollTo(0, y); await new Promise(r => setTimeout(r, 15)); } scrollTo(0, 0); });
        await page.waitForTimeout(80);
        const data = await page.evaluate(() => {
          const visible = e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden' && !e.closest('[aria-hidden="true"], [inert]'); };
          return {
            overflow: document.documentElement.scrollWidth > innerWidth,
            scrollWidth: document.documentElement.scrollWidth,
            h1: [...document.querySelectorAll('main h1')].map(e => e.textContent.trim()),
            overflowingText: [...document.querySelectorAll('main h1, main h2, main h3, main p, main a, main button')].filter(e => visible(e) && e.scrollWidth > e.clientWidth + 2 && e.clientWidth > 0).map(e => ({ tag: e.tagName, class: e.className, text: e.textContent.trim().slice(0, 120), client: e.clientWidth, scroll: e.scrollWidth })).slice(0, 30),
            outsideViewport: [...document.querySelectorAll('main h1,main h2,main h3,main p,main button,main a')].filter(e => visible(e) && (e.getBoundingClientRect().right > innerWidth + 2 || e.getBoundingClientRect().left < -2)).map(e => ({ tag: e.tagName, class: e.className, text: e.textContent.trim().slice(0, 100) })).slice(0, 30),
            smallControls: [...document.querySelectorAll('button,summary,input,select,textarea')].filter(e => visible(e) && (e.getBoundingClientRect().width < 24 || e.getBoundingClientRect().height < 24)).map(e => ({ tag: e.tagName, class: e.className, name: e.getAttribute('aria-label') || e.textContent.trim(), w: e.getBoundingClientRect().width, h: e.getBoundingClientRect().height })),
            csp: window.auditCSP
          };
        });
        const row = { engine, route, url: base + route, width, status: response.status(), errors, external, ...data };
        if (engine === 'chromium' && process.env.AUDIT_AXE !== 'false' && [1440, 390].includes(width)) {
          await page.evaluate(axe);
          const a = await page.evaluate(async () => { const r = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } }); return { violations: r.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => ({ target: n.target, html: n.html, summary: n.failureSummary, any: n.any })) })), incomplete: r.incomplete.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, html: n.html, any: n.any })) })) }; });
          row.axe = a;
        }
        if (engine === 'chromium' && [1440, 768, 390].includes(width)) {
          const name = (route === '/' ? 'home' : route.replace(/^\/|\/$/g, '').replaceAll('/', '_')) + '-' + width;
          await page.screenshot({ path: path.join(out, name + '.png'), fullPage: true });
          if (width === 1440) fs.writeFileSync(path.join(out, name + '.html'), await page.content());
        }
        rows.push(row);
        fs.writeFileSync(path.join(out, engine + '-results.json'), JSON.stringify(rows, null, 2));
      }
      console.log(phase, engine, route, 'done');
    }
    await page.goto(base + '/audit-missing-page/', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(out, engine + '-404.png'), fullPage: true });
    fs.writeFileSync(path.join(out, engine + '-404.html'), await page.content());
  } finally { await browser.close(); }
  const summary = { phase, engine, version: browser.version(), layouts: rows.length, overflow: rows.filter(r => r.overflow).map(r => ({ route: r.route, width: r.width })), axeScans: rows.filter(r => r.axe).length, violations: rows.filter(r => r.axe?.violations.length).map(r => ({ route: r.route, width: r.width, violations: r.axe.violations })), pageErrors: rows.filter(r => r.errors.length), cspErrors: rows.filter(r => r.csp?.length) };
  fs.writeFileSync(path.join(out, engine + '-summary.json'), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify({ ...summary, violations: summary.violations.map(r => ({ route: r.route, width: r.width, ids: r.violations.map(v => v.id) })) }));
  if (summary.overflow.length || summary.violations.length || summary.pageErrors.length || summary.cspErrors.length || rows.some(r => r.status !== 200)) process.exitCode = 1;
})().catch(e => { console.error(e); process.exitCode = 1; });
