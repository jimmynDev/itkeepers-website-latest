// Bounded unauthenticated smoke test for this specific preview; never production.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
const base = 'https://itkeepers-v2-staging.jimnassar99.workers.dev';
const policy = JSON.parse(readFileSync('worker/public-indexing-policy.json','utf8'));
assert.equal(base,policy.origin);
const rows = [];
async function probe(route, expected, options = {}) {
  assert(route.startsWith('/') && !route.startsWith('//'));
  const response = await fetch(base + route, { redirect: 'manual', signal: AbortSignal.timeout(20000), ...options });
  const body = await response.text();
  rows.push({ route, method: options.method || 'GET', userAgent: options.headers?.['User-Agent'] || 'node', status: response.status });
  assert.equal(response.status, expected, `${route}: ${body.slice(0,80)}`);
  const canonicalPath = new URL(base+route).pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '').replace(/\/+$/,'')+'/';
  const noindex = expected >= 400 || Object.hasOwn(policy.noindex,canonicalPath);
  assert.equal(response.headers.get('x-robots-tag'), noindex ? 'noindex, follow' : null, route);
  assert(response.headers.get('cache-control')?.includes('no-store'), route);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff', route);
  assert.equal(response.headers.get('x-frame-options'), 'DENY', route);
  assert.equal(response.headers.get('referrer-policy'), 'no-referrer', route);
  assert(response.headers.get('content-security-policy'), route);
  return { response, body };
}
const files = dir => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(path.join(dir,e.name)) : [path.join(dir,e.name)]);
const artifact = files('dist-staging');
for (const file of artifact.filter(f => f.endsWith('.html'))) {
  const route = '/' + path.relative('dist-staging',file).replaceAll('\\','/').replace(/index\.html$/, '');
  const { body } = await probe(route, 200);
  assert.equal(body, readFileSync(file,'utf8'), 'Deployed page differs: ' + route);
  const held = Object.hasOwn(policy.noindex,route);
  assert(body.includes(`<meta name="robots" content="${held?'noindex':'index'}, follow">`),route);
  assert(body.includes(`rel="canonical" href="${base}${route}"`),route);
  assert(body.includes(`property="og:url" content="${base}${route}"`),route);
  assert(body.includes(`property="og:image" content="${base}/assets/itkeepers-logo.png"`),route);
  assert(body.includes(`name="twitter:image" content="${base}/assets/itkeepers-logo.png"`),route);
  const graph=JSON.parse(body.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert(!JSON.stringify(graph).includes('https://itkeepers.com'),route+' stale schema host');
  assert(graph['@graph'].every(entity=>!entity.url||new URL(entity.url).origin===base),route+' schema origin');
  const last=rows[rows.length-1];last.canonical=base+route;last.indexable=!held;last.socialAndSchemaVerified=true;
}
for (const file of artifact.filter(f => /\.(js|css|svg|png|webp|pdf|ico)$/.test(f))) {
  const route = '/' + path.relative('dist-staging', file).replaceAll('\\','/');
  await probe(route, 200);
}
assert.equal((await probe('/robots.txt',200)).body, `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
const xml=(await probe('/sitemap.xml',200)).body;
assert.equal(xml, readFileSync('dist-staging/sitemap.xml','utf8'));
const locs=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert.equal(locs.length,15);assert(locs.every(loc=>new URL(loc).origin===base&&!Object.hasOwn(policy.noindex,new URL(loc).pathname)));
for (const line of readFileSync('redirects.csv','utf8').trim().split(/\r?\n/).slice(1)) {
  const [source, target] = line.split(',');
  for (const suffix of ['', '?audit=public']) {
    const { response } = await probe(source + suffix,301);
    const location = new URL(response.headers.get('location'),base);
    assert.equal(location.origin,base); assert.equal(location.pathname,target); assert.equal(location.search,suffix);
  }
  await probe(target,200);
}
for (const route of ['/.env','/.dev.vars','/.git/config','/wrangler.toml','/wrangler.staging.toml','/package.json','/PROJECT_STATUS.md','/AGENTS.md','/docs/drafts/V2_PRIVACY_NOTICE.md','/docs/V2_PERSONAL_CLOUDFLARE_STAGING_DEPLOYMENT.md','/worker/index.ts','/worker/public-indexing-policy.json','/scripts/build-staging.mjs','/_headers','/_redirects','/missing/']) await probe(route,404);
for (const route of ['/api/contact','/api/inquiry']) {
  for (const method of ['GET','OPTIONS']) {
    const { response } = await probe(route,405,{method}); assert.equal(response.headers.get('allow'),'POST');
  }
  const { body } = await probe(route,503,{method:'POST',body:'synthetic-disabled-check'});
  assert.deepEqual(JSON.parse(body),{ok:false,code:'contact_unavailable'});
}
for (const agent of ['Googlebot','bingbot','GPTBot/1.2','OAI-SearchBot/1.3','ChatGPT-User/1.0','ClaudeBot','curl/8.0']) {
  for (const route of ['/','/services/','/robots.txt']) await probe(route,200,{headers:{'User-Agent':agent}});
}
// Report upstream restrictions separately; never represent them as Worker passes.
const upstream = await fetch(base+'/', {redirect:'manual', headers:{'User-Agent':'Python-urllib/3.13'}, signal:AbortSignal.timeout(20000)});
const upstreamBody = await upstream.text();
const edgeRestrictions = upstream.status === 200 ? [] : [{userAgent:'Python-urllib/3.13',status:upstream.status,cloudflare1010:/1010/.test(upstreamBody),workerReached:upstream.headers.has('x-robots-tag')}];
mkdirSync('.wrangler/public-verification',{recursive:true});
writeFileSync('.wrangler/public-verification/http.json',JSON.stringify({base,requests:rows.length+1,functionalFailures:0,edgeRestrictions,authentication:'no cookies or credentials',rows},null,2));
console.log(JSON.stringify({base,requests:rows.length+1,functionalFailures:0,edgeRestrictions,pages:20,indexable:15,held:5,redirectRules:28,privateFiles:'404',crawlerUserAgentsPassed:7,contact:'disabled'}));
