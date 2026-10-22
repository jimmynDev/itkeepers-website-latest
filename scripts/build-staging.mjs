import { spawnSync } from 'node:child_process';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const policy = JSON.parse(await readFile(new URL('../worker/public-indexing-policy.json', import.meta.url), 'utf8'));
const indexable = new Set();
const result = spawnSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build', '--outDir', 'dist-staging'], {
  cwd: root, stdio: 'inherit', env: { ...process.env, PUBLIC_CONTACT_FORM_ENABLED: 'false', PUBLIC_CONTACT_FORM_ENDPOINT: '', PUBLIC_TURNSTILE_SITE_KEY: '' }
});
if (result.status !== 0) process.exit(result.status || 1);
const out = new URL('../dist-staging/', import.meta.url);
async function visit(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const file = new URL(item.name + (item.isDirectory() ? '/' : ''), dir);
    if (item.isDirectory()) await visit(file);
    else if (item.name.endsWith('.html')) {
      const html = await readFile(file, 'utf8');
      const robots = /<meta name="robots" content="[^"]*"\s*\/?>(?:)/g;
      if ([...html.matchAll(robots)].length !== 1 || html.includes('data-inquiry-delivery="backend"')) throw new Error('Review staging index/contact build gates');
      const route = '/' + decodeURI(file.pathname.slice(out.pathname.length)).replace(/index\.html$/, '');
      const noindex = route in policy.noindex || /noindex/.test(html.match(robots)[0]);
      if (!noindex) indexable.add(route);
      // Only head metadata/entity URLs change; preserve visible copy, links and scripts.
      const updated = html.replace(robots, `<meta name="robots" content="${noindex ? 'noindex' : 'index'}, follow">`)
        .replace(/<head>[\s\S]*?<\/head>/, head => head.replaceAll('https://itkeepers.com', policy.origin));
      await writeFile(file, updated);
    }
  }
}
await visit(out);
await writeFile(new URL('robots.txt', out), `User-agent: *\nAllow: /\nSitemap: ${policy.origin}/sitemap.xml\n`);
const sitemap = new URL('sitemap.xml', out);
await writeFile(sitemap, (await readFile(sitemap, 'utf8')).replace(/<url>\s*<loc>([^<]+)<\/loc>\s*<\/url>/g, (entry, url) => {
  const original = new URL(url);
  return indexable.has(original.pathname) ? entry.replace('https://itkeepers.com', policy.origin) : '';
}));
// Remove the workers.dev-wide indexing guard only in this standalone artifact.
const headers = new URL('_headers', out);
const sourceHeaders = await readFile(headers, 'utf8');
const guard = '# Workers default, version and alias URLs must not become indexed duplicates.\n# This is an indexing safeguard; private previews still require Cloudflare Access.\nhttps://:version.:subdomain.workers.dev/*\n  X-Robots-Tag: noindex';
const normalized = sourceHeaders.replaceAll('\r\n', '\n');
if (!normalized.includes(guard)) throw new Error('Review changed workers.dev header guard before public indexing.');
await writeFile(headers, normalized.replace(guard, '# Approved public workers.dev site; per-page indexing handled by Worker.')
  .replaceAll('https://itkeepers.com', policy.origin));
console.log(`Public site artifact ready: ${indexable.size} indexable pages, ${Object.keys(policy.noindex).length} held routes; contact disabled.`);
