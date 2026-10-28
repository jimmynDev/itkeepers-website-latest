import { spawnSync } from 'node:child_process';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const policy = JSON.parse(await readFile(new URL('../worker/rc-policy.json', import.meta.url), 'utf8'));
const [major, minor] = process.versions.node.split('.').map(Number);
if (major !== 22 || minor < 19) throw new Error('Use the reviewed Node 22.19+ runtime within Node 22.');
if (policy.origin !== 'https://' + policy.hostname || policy.hostname !== policy.name + '.jimnassar99.workers.dev') {
  throw new Error('Review the fixed RC identity before building.');
}
// Fixed outDir and private child environment: never mutate production/staging
// source, output directories, canonical defaults or the parent process settings.
const result = spawnSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build', '--outDir', 'dist-rc'], {
  cwd: root, stdio: 'inherit', env: { ...process.env, PUBLIC_CONTACT_FORM_ENABLED: 'false', PUBLIC_CONTACT_FORM_ENDPOINT: '', PUBLIC_TURNSTILE_SITE_KEY: '' }
});
if (result.status !== 0) process.exit(result.status || 1);
const out = new URL('../dist-rc/', import.meta.url);
let pages = 0;
async function visit(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = new URL(entry.name + (entry.isDirectory() ? '/' : ''), dir);
    if (entry.isDirectory()) await visit(file);
    else if (entry.name.endsWith('.html')) {
      const html = await readFile(file, 'utf8');
      const robots = /<meta name="robots" content="[^"]*"\s*\/?>/g;
      if ([...html.matchAll(robots)].length !== 1 || html.includes('data-inquiry-delivery="backend"')) throw new Error('Review RC metadata/contact gates.');
      const updated = html.replace(/<head>[\s\S]*?<\/head>/, head => head
        .replace(robots, '<meta name="robots" content="noindex, follow">')
        .replaceAll('https://itkeepers.com', policy.origin));
      await writeFile(file, updated);pages++;
    }
  }
}
await visit(out);
// Public evaluator/browser access, no authentication or disallow-all rule.
// No advertised sitemap: every RC page is intentionally excluded from indexing.
await writeFile(new URL('robots.txt', out), 'User-agent: *\nAllow: /\n');
await writeFile(new URL('sitemap.xml', out), '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
const headers = new URL('_headers', out);
const original = (await readFile(headers, 'utf8')).replaceAll('\r\n', '\n');
if (!original.startsWith('/*\n')) throw new Error('Review the RC header template.');
await writeFile(headers, original.replace('/*\n', '/*\n  X-Robots-Tag: noindex, follow\n').replaceAll('https://itkeepers.com', policy.origin));
console.log(`RC artifact ready: ${pages} HTML pages, all noindex; public access; origin ${policy.origin}. No deployment.`);
