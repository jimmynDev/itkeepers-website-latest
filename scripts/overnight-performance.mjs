// Local lab profiling only. Uses already-installed Lighthouse and Chrome.
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
const modules = 'C:/Users/Jim/AppData/Local/npm-cache/_npx/1722e863ebfd623b/node_modules/';
const { default: lighthouse } = await import(pathToFileURL(modules + 'lighthouse/core/index.js'));
const { default: desktopConfig } = await import(pathToFileURL(modules + 'lighthouse/core/config/desktop-config.js'));
const chromeLauncher = await import(pathToFileURL(modules + 'chrome-launcher/dist/chrome-launcher.js'));
const dir = '../v2-overnight-audit/performance'; fs.mkdirSync(dir, { recursive: true });
const rows = [];
for (const [name, route] of [['home', '/'], ['managed-it', '/services/managed-it/'], ['contact', '/contact/']]) {
  for (const mode of ['mobile', 'desktop']) {
    const chrome = await chromeLauncher.launch({ chromePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', chromeFlags: ['--headless=new', '--no-first-run', '--no-default-browser-check', '--disable-extensions'] });
    try {
      const result = await lighthouse('http://127.0.0.1:4388' + route, { port: chrome.port, onlyCategories: ['performance'], output: ['json', 'html'], logLevel: 'error' }, mode === 'desktop' ? desktopConfig : undefined);
      if (result.lhr.runtimeError) throw new Error(JSON.stringify(result.lhr.runtimeError));
      fs.writeFileSync(`${dir}/${name}-${mode}.json`, result.report[0]);
      fs.writeFileSync(`${dir}/${name}-${mode}.html`, result.report[1]);
      const a = result.lhr.audits;
      const row = { name, route, mode, score: result.lhr.categories.performance.score * 100, lcpMs: a['largest-contentful-paint'].numericValue, cls: a['cumulative-layout-shift'].numericValue, tbtMs: a['total-blocking-time'].numericValue, totalBytes: a['total-byte-weight'].numericValue, resources: a['resource-summary'].details.items, longTasks: a['long-tasks']?.details?.items, bootup: a['bootup-time']?.details?.items, version: result.lhr.lighthouseVersion, settings: result.lhr.configSettings };
      rows.push(row); fs.writeFileSync(`${dir}/summary.json`, JSON.stringify(rows, null, 2));
      console.log(JSON.stringify({ name, mode, score: row.score, lcpMs: Math.round(row.lcpMs), cls: row.cls, tbtMs: Math.round(row.tbtMs), bytes: row.totalBytes }));
    } finally { await chrome.kill(); }
  }
}
