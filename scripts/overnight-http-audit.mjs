// Passive GET/HEAD/OPTIONS only, restricted to the owner's public preview or loopback.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const live = process.argv.includes('--live');
const base = live ? 'https://itkeepers-v2-staging.jimnassar99.workers.dev' : 'http://127.0.0.1:4388';
const out = path.resolve('../v2-overnight-audit', live ? 'live-http' : 'final-http');
fs.mkdirSync(out, { recursive: true });
const policy = JSON.parse(fs.readFileSync('worker/public-indexing-policy.json'));
const rows = [], failures = [];
function files(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(path.join(dir, e.name)) : [path.join(dir, e.name)]); }
const headersToSave = ['content-type', 'content-security-policy', 'cache-control', 'x-robots-tag', 'x-content-type-options', 'referrer-policy', 'x-frame-options', 'permissions-policy', 'strict-transport-security', 'location', 'allow', 'server', 'cf-ray', 'etag', 'content-encoding', 'access-control-allow-origin'];
async function probe(route, expected, options = {}) {
  try {
    const response = await fetch(base + route, { redirect: 'manual', signal: AbortSignal.timeout(20000), ...options });
    const bytes = Buffer.from(await response.arrayBuffer());
    const body = bytes.toString('utf8');
    const headers = Object.fromEntries(headersToSave.map(k => [k, response.headers.get(k)]).filter(([, v]) => v !== null));
    const row = { route, method: options.method || 'GET', agent: options.headers?.['User-Agent'] || 'node', expected, status: response.status, headers, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
    rows.push(row);
    if (response.status !== expected) failures.push({ route, expected, actual: response.status });
    return { row, body };
  } catch (e) { failures.push({ route, error: e.message }); return { row: {}, body: '' }; }
}
for (const file of files('dist-staging').filter(f => f.endsWith('.html'))) {
  const route = '/' + path.relative('dist-staging', file).replaceAll('\\', '/').replace(/index\.html$/, '');
  const { row, body } = await probe(route, 200);
  const local = fs.readFileSync(file, 'utf8');
  row.matchesLocalArtifact = body === local;
  // Differences are expected after local refinement and are recorded, not hidden.
  row.indexable = !Object.hasOwn(policy.noindex, route);
  if ((row.headers?.['x-robots-tag']?.includes('noindex') || false) === row.indexable) failures.push({ route, error: 'indexing header mismatch' });
  fs.mkdirSync(path.join(out, 'html'), { recursive: true });
  fs.writeFileSync(path.join(out, 'html', route === '/' ? 'home.html' : route.slice(1, -1).replaceAll('/', '_') + '.html'), body);
}
for (const route of ['/robots.txt', '/sitemap.xml']) { const { body } = await probe(route, 200); fs.writeFileSync(path.join(out, route.slice(1)), body); }
// Verify every shipped static asset, including unused fallbacks. Live uses its
// preserved deployment artifact, so newly generated local fingerprints are not
// mistaken for broken live URLs. Only status/header/hash evidence is saved.
const assetRoot = live ? '../v2-overnight-audit/baseline-dist' : 'dist-staging';
for (const file of files(assetRoot).filter(f => !f.endsWith('.html') && !['_headers', '_redirects', 'robots.txt', 'sitemap.xml'].includes(path.basename(f)))) {
  const route = '/' + path.relative(assetRoot, file).replaceAll('\\', '/');
  const { row } = await probe(route, 200);
  row.matchesArtifactBytes = row.sha256 === crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  if (!row.matchesArtifactBytes) failures.push({ route, error: 'public asset byte mismatch' });
}
for (const line of fs.readFileSync('redirects.csv', 'utf8').trim().split(/\r?\n/).slice(1)) {
  const [source, target] = line.split(',');
  for (const suffix of ['', '?audit=overnight']) {
    const { row } = await probe(source + suffix, 301);
    const location = new URL(row.headers?.location || '/', base);
    if (location.pathname !== target || location.search !== suffix || location.origin !== new URL(base).origin) failures.push({ route: source + suffix, error: 'redirect destination/query mismatch' });
  }
  await probe(target, 200);
}
for (const route of ['/.env', '/.dev.vars', '/.git/config', '/wrangler.toml', '/wrangler.staging.toml', '/package.json', '/PROJECT_STATUS.md', '/AGENTS.md', '/docs/drafts/V2_PRIVACY_NOTICE.md', '/worker/index.ts', '/worker/public-indexing-policy.json', '/_headers', '/_redirects', '/missing/', '/missing.html']) await probe(route, 404);
for (const route of ['/api/contact', '/api/inquiry']) for (const method of ['GET', 'OPTIONS']) await probe(route, 405, { method });
for (const agent of ['Googlebot', 'bingbot', 'GPTBot/1.2', 'OAI-SearchBot/1.3', 'ChatGPT-User/1.0', 'ClaudeBot', 'curl/8.0']) for (const route of ['/', '/services/', '/robots.txt']) await probe(route, 200, { headers: { 'User-Agent': agent } });
const restrictions = [];
if (live) {
  const { row, body } = await probe('/', 403, { headers: { 'User-Agent': 'Python-urllib/3.12' } });
  restrictions.push({ agent: row.agent, status: row.status, error1010: /1010/.test(body), cfRay: row.headers?.['cf-ray'], securityHeadersPresent: !!row.headers?.['content-security-policy'], note: 'A spoofed user-agent tests only this network, not the actual crawler operator.' });
}
fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ base, requests: rows.length, failures, restrictions, rows }, null, 2));
console.log(JSON.stringify({ base, requests: rows.length, failures, restrictions }));
process.exitCode = failures.length ? 1 : 0;
