import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import { spawnSync } from 'node:child_process';

const compiledDir = path.resolve('.wrangler/staging-unit-tests');
mkdirSync(compiledDir, { recursive: true });
writeFileSync(path.join(compiledDir,'public-indexing-policy.json'),readFileSync('worker/public-indexing-policy.json'));
for (const name of ['staging-handler', 'staging']) {
  const code = ts.transpileModule(readFileSync('worker/' + name + '.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
  }).outputText.replace('./staging-handler.ts', './staging-handler.mjs');
  writeFileSync(path.join(compiledDir, name + '.mjs'), code);
}
const { createStagingHandler } = await import(pathToFileURL(path.join(compiledDir, 'staging-handler.mjs')));
const entry = await import(pathToFileURL(path.join(compiledDir, 'staging.mjs')));
const hostname = 'itkeepers-v2-staging.jimnassar99.workers.dev';

function fixture(options = {}) {
  const calls = { assets: 0, mail: 0 };
  const handler = createStagingHandler();
  const env = { STAGING_HOSTNAME: hostname,
    ASSETS: { async fetch(request) { calls.assets++; if (options.assets) return options.assets(request); return new Response('asset', { headers: { 'Content-Security-Policy': "default-src 'self'", 'Cache-Control': 'public, max-age=31536000, immutable' } }); } } };
  return { handler, env, calls };
}
function request(path = '/', extra = {}) { return new Request('https://' + hostname + path, extra); }
function stagingResponse(response, expected, noindex = expected >= 400) {
  assert.equal(response.status, expected); assert.equal(response.headers.get('x-robots-tag'), noindex ? 'noindex, follow' : null);
  assert.equal(response.headers.get('cache-control'), 'private, no-store'); assert.equal(response.headers.get('x-content-type-options'), 'nosniff'); assert.equal(response.headers.get('x-frame-options'), 'DENY');
}

test('staging configuration is public workers.dev link only and has no Access or resource bindings', () => {
  const result = spawnSync('python', ['-c', "import tomllib,json;print(json.dumps(tomllib.load(open('wrangler.staging.toml','rb'))))"], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr); const c = JSON.parse(result.stdout);
  assert.equal(c.name, 'itkeepers-v2-staging'); assert.equal(c.main, 'worker/staging.ts'); assert.equal(c.workers_dev, true); assert.equal(c.preview_urls, false); assert.deepEqual(c.routes, []);
  assert.equal(c.assets.directory, './dist-staging'); assert.equal(c.assets.run_worker_first, true); assert.equal(c.build.command, 'npm run build:staging');
  assert.equal(c.vars.STAGING_HOSTNAME, hostname); assert.equal(c.vars.CONTACT_VALIDATION_ENABLED, 'false'); assert.equal(c.vars.CONTACT_DELIVERY_ENABLED, 'false');
  for (const key of ['STAGING_ACCESS_ISSUER','STAGING_ACCESS_AUD','durable_objects','migrations','send_email','d1_databases','kv_namespaces','services','account_id','zone_id']) assert.equal(c[key] ?? c.vars[key], undefined);
  assert.deepEqual(Object.keys(entry), ['default']); assert(!readFileSync('worker/staging.ts','utf8').includes('staging-access'));
  assert.match(readFileSync('wrangler.toml','utf8'), /new_sqlite_classes = \["InquiryGuard"\]/, 'Production preparation is preserved');
});

test('exact workers.dev hostname is required but no authentication header is needed', async () => {
  const f = fixture(); const response = await f.handler.fetch(request('/'), f.env); stagingResponse(response, 200); assert.equal(await response.text(), 'asset'); assert.equal(f.calls.assets, 1);
  for (const host of ['alias-' + hostname, 'itkeepers.com', 'other.jimnassar99.workers.dev']) stagingResponse(await f.handler.fetch(new Request('https://' + host + '/'), f.env), 403);
  f.env.STAGING_HOSTNAME = ''; stagingResponse(await f.handler.fetch(request('/'), f.env), 403); assert.equal(f.calls.assets, 1);
});

test('pages and unversioned assets retain CSP and no-store despite upstream immutable headers', async () => {
  const f = fixture();
  for (const path of ['/','/contact/','/services/','/_astro/test.js','/robots.txt','/sitemap.xml']) {
    const response = await f.handler.fetch(request(path), f.env); stagingResponse(response, 200); assert.equal(response.headers.get('content-security-policy'), "default-src 'self'");
  }
  assert.equal(f.calls.assets, 6);
});

test('only successful fingerprinted assets with explicit public immutable policy are cacheable', async () => {
  for (const [route, type] of [['/_astro/app.Abcdef_1.js','text/javascript'], ['/_astro/page.Abcdef_1.css','text/css'], ['/_astro/logo.Abcdef_1.webp','image/webp'], ['/styles/site-012345abcdef.css','text/css']]) {
    for (const method of ['GET','HEAD']) for (const status of [200,304]) {
      const f=fixture({assets:()=>new Response(status===304?null:'asset',{status,headers:{'Cache-Control':'public, max-age=31536000, immutable','Content-Type':type,'ETag':'"fingerprint"','Content-Security-Policy':"default-src 'self'"}})});
      const response=await f.handler.fetch(request(route+'?version=1',{method}),f.env);
      assert.equal(response.headers.get('cache-control'),'public, max-age=31536000, immutable');
      assert.equal(response.headers.get('etag'),'"fingerprint"');
      assert.equal(response.headers.get('x-content-type-options'),'nosniff');
      assert.equal(response.headers.get('content-security-policy'),"default-src 'self'");
    }
  }
});

test('cache gate rejects HTML fallbacks, errors, redirects, credentials and unversioned or encoded names', async () => {
  const route='/_astro/app.Abcdef_1.js';
  const normal={'Cache-Control':'public, max-age=31536000, immutable','Content-Type':'text/javascript'};
  const cases=[
    {status:200,headers:{...normal,'Content-Type':'text/html'}},
    {status:200,headers:{...normal,'Set-Cookie':'synthetic=test'}},
    {status:200,headers:{...normal,'Cache-Control':'private, public, max-age=31536000, immutable'}},
    {status:200,headers:{...normal,'Cache-Control':'public, max-age=31536000, immutable, no-store'}},
    {status:200,headers:{...normal,'Cache-Control':'public, max-age=31536000'}},
    ...[206,301,404,500].map(status=>({status,headers:normal}))
  ];
  for(const init of cases){
    const f=fixture({assets:()=>new Response('asset',init)});
    const response=await f.handler.fetch(request(route),f.env);
    assert.equal(response.headers.get('cache-control'),'private, no-store');
  }
  const f=fixture({assets:()=>new Response('asset',{headers:normal})});
  for(const name of ['/_astro/app.js','/_astro/app.short.js','/_astro/app.Abcdef_1.js/extra','/_astro/app%2eAbcdef_1.js','/assets/app.Abcdef_1.js','/resources/itkeepers-ai-governance-playbook.pdf']) {
    assert.equal((await f.handler.fetch(request(name),f.env)).headers.get('cache-control'),'private, no-store',name);
  }
  assert.equal((await f.handler.fetch(request(route,{headers:{Authorization:'Bearer synthetic'}}),f.env)).headers.get('cache-control'),'private, no-store');
});

test('only held pages and errors retain noindex, including direct HTML variants', async () => {
  const f=fixture();
  for(const route of ['/privacy/','/privacy','/privacy.html','/privacy/index.html','/blog/','/2023/09/the-future-of-artificial-intelligence-ai/','/2023/09/understanding-datafication/','/2023/10/how-do-ai-and-ml-differ/']) {
    stagingResponse(await f.handler.fetch(request(route+'?audit=1'),f.env),200,true);
  }
  for(const route of ['/','/about/','/emergency/','/it-keepers-pulse/','/resources/ai-governance/']) stagingResponse(await f.handler.fetch(request(route),f.env),200,false);
});

test('redirect targets, query strings and conditional statuses are preserved', async () => {
  for (const status of [301,304]) {
    const f = fixture({ assets: () => new Response(status === 304 ? null : 'asset', { status, headers: { Location: '/services/managed-it/?check=1', 'Content-Security-Policy': "default-src 'self'" } }) });
    const response = await f.handler.fetch(request('/managed-it/?check=1'), f.env); stagingResponse(response, status); assert.equal(response.headers.get('location'), '/services/managed-it/?check=1');
  }
});

test('missing assets provide accessible recovery links with a true private 404 and strict CSP', async () => {
  const f = fixture({ assets: () => new Response('', { status: 404, headers: { 'ETag': 'stale', 'Content-Length': '0', 'Location': '/wrong/' } }) });
  const response = await f.handler.fetch(request('/missing-private-name/?untrusted=secret'), f.env);
  stagingResponse(response, 404);
  assert.equal(response.headers.get('content-type'), 'text/html; charset=utf-8');
  assert.match(response.headers.get('content-security-policy'), /default-src 'none'; style-src 'self'/);
  for (const name of ['etag','content-length','location']) assert.equal(response.headers.get(name), null);
  const html = await response.text();
  assert.match(html, /<h1>Let’s get you back on track\.<\/h1>/);
  for (const href of ['/', '/services/', '/contact/']) assert(html.includes(`href="${href}"`));
  assert.match(html, /name="robots" content="noindex, follow"/);
  assert(!html.includes('missing-private-name')); assert(!html.includes('secret'));
  assert(!html.includes('<script'));
  const head = await f.handler.fetch(request('/missing/', { method: 'HEAD' }), f.env);
  stagingResponse(head, 404); assert.equal(await head.text(), '');
});

test('contact remains disabled even if flags or mail bindings are supplied', async () => {
  const f = fixture(); Object.assign(f.env, { CONTACT_VALIDATION_ENABLED: 'true', CONTACT_DELIVERY_ENABLED: 'true', CONTACT_EMAIL: { send() { f.calls.mail++; } } });
  for (const path of ['/api/contact','/api/inquiry']) for (const method of ['POST','GET','OPTIONS']) {
    const r = request(path, { method, ...(method === 'POST' ? { body: 'synthetic-unread' } : {}) }); const response = await f.handler.fetch(r, f.env);
    stagingResponse(response, method === 'POST' ? 503 : 405); assert.equal((await response.json()).ok, false); assert.equal(r.bodyUsed, false);
  }
  assert.equal(f.calls.assets, 0); assert.equal(f.calls.mail, 0);
});

test('non-read methods are rejected and asset failures disclose no private detail', async () => {
  const f = fixture(); const post = request('/other', { method: 'POST', body: 'synthetic-unread' }); const blocked = await f.handler.fetch(post, f.env);
  stagingResponse(blocked, 405); assert.equal(blocked.headers.get('allow'), 'GET, HEAD'); assert.equal(post.bodyUsed, false);
  const a = fixture({ assets: () => { throw new Error('private-asset-detail'); } }); const result = await a.handler.fetch(request('/'), a.env);
  stagingResponse(result, 503); assert(!(await result.text()).includes('private-asset-detail'));
});
