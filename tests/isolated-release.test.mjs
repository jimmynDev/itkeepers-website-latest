import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import ts from 'typescript';
import { assertIsolatedConfig } from '../scripts/isolated-release-config.mjs';
const dir=path.resolve('.wrangler/isolated-release-unit-tests');mkdirSync(dir,{recursive:true});
for(const name of ['public-indexing-policy','isolated-release-policy'])writeFileSync(path.join(dir,name+'.json'),readFileSync('worker/'+name+'.json'));
for(const name of ['staging-handler','isolated-release']){
  const compiled=ts.transpileModule(readFileSync('worker/'+name+'.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText.replace('./staging-handler.ts','./staging-handler.mjs');
  writeFileSync(path.join(dir,name+'.mjs'),compiled);
}
const rcModule=await import(pathToFileURL(path.join(dir,'isolated-release.mjs')));
const rcHandler=rcModule.default;
const{createStagingHandler}=await import(pathToFileURL(path.join(dir,'staging-handler.mjs')));
const policy=JSON.parse(readFileSync('worker/isolated-release-policy.json','utf8'));
const request=(route='/',options={})=>new Request(policy.origin+route,options);
test('isolated configuration rejects existing targets, route overrides, old artifacts and extra capabilities',()=>{
  const parsed=spawnSync('python',['-c','import tomllib,json;print(json.dumps(tomllib.load(open("wrangler.isolated.toml","rb"))))'],{encoding:'utf8'});
  assert.equal(parsed.status,0,parsed.stderr);const valid=JSON.parse(parsed.stdout);assert.doesNotThrow(()=>assertIsolatedConfig(valid));
  const mutations=[
    c=>{c.name='itkeepers-v2-rc-20261101'},c=>{c.name='itkeepers-v2-rc-20261027'},
    c=>{c.name='itkeepers-v2-staging'},c=>{c.name='itkeepers-website'},
    c=>{c.main='worker/release.ts'},c=>{c.routes=['itkeepers.com/*']},
    c=>{c.assets.directory='./dist-release'},c=>{c.vars.STAGING_HOSTNAME='itkeepers.com'},
    c=>{c.vars.CONTACT_DELIVERY_ENABLED='true'},c=>{c.build={command:'npm run deploy'}},
    c=>{c.env={production:{name:'itkeepers-website'}}},c=>{c.send_email=[{name:'MAIL'}]},
    c=>{c.durable_objects={bindings:[{name:'GUARD',class_name:'Guard'}]}},
  ];
  for(const mutate of mutations){const bad=structuredClone(valid);mutate(bad);assert.throws(()=>assertIsolatedConfig(bad),/isolated configuration/);}
});
function fixture(asset=()=>new Response('Mock asset',{headers:{'Content-Type':'text/html','Content-Security-Policy':"default-src 'self'"}})){
  const calls=[];return{calls,handler:rcHandler,env:{STAGING_HOSTNAME:policy.hostname,ASSETS:{async fetch(req){calls.push(req);return asset(req);}}}};
}
test('November 2 isolated release is public to browsers and AI evaluators and retains consultation query parameters',async()=>{
  const f=fixture();for(const agent of ['Mozilla/5.0','ChatGPT-User/1.0','Googlebot']){
    const r=await f.handler.fetch(request('/contact/?type=review&utm_source=rc',{headers:{'User-Agent':agent}}),f.env);
    assert.equal(r.status,200);assert.equal(r.headers.get('X-Robots-Tag'),'noindex, follow');assert.equal(new URL(f.calls.at(-1).url).search,'?type=review&utm_source=rc');
    assert.equal(r.headers.get('Content-Security-Policy'),"default-src 'self'");assert.equal(r.headers.get('X-Content-Type-Options'),'nosniff');
  }
});
test('November 2 isolated release rejects staging, production, alias and incorrectly configured hostnames before assets',async()=>{
  const f=fixture();for(const host of ['itkeepers-v2-rc-20261101.jimnassar99.workers.dev','itkeepers-v2-rc-20261027.jimnassar99.workers.dev','itkeepers-v2-staging.jimnassar99.workers.dev','itkeepers.com','www.itkeepers.com','alias.jimnassar99.workers.dev']){
    const r=await f.handler.fetch(new Request('https://'+host+'/'),f.env);assert.equal(r.status,403);assert.equal(r.headers.get('X-Robots-Tag'),'noindex, follow');
  }
  for(const host of [undefined,'itkeepers.com','itkeepers-v2-staging.jimnassar99.workers.dev'])assert.equal((await f.handler.fetch(request(),{...f.env,STAGING_HOSTNAME:host})).status,403);
  assert.equal(f.calls.length,0);
});
test('November 2 isolated release indexing protection survives document ranges, HEAD, 304s and redirects without changing representations',async()=>{
  for(const[status,method,body,headers]of [
    [200,'GET','document',{'Content-Type':'application/pdf','ETag':'"doc"'}],
    [206,'GET','range',{'Content-Type':'application/pdf','Content-Range':'bytes 0-4/100','Accept-Ranges':'bytes'}],
    [200,'HEAD',null,{'Content-Type':'application/pdf','Content-Length':'100'}],
    [304,'GET',null,{'ETag':'"doc"'}],
    [301,'GET',null,{'Location':'/contact/?type=review&from=legacy'}]
  ]){
    const f=fixture(()=>new Response(body,{status,headers}));const r=await f.handler.fetch(request('/resources/example.pdf',{method}),f.env);
    assert.equal(r.status,status);assert.equal(r.headers.get('X-Robots-Tag'),'noindex, follow');
    for(const[k,v]of Object.entries(headers))assert.equal(r.headers.get(k),v);
    assert.equal(await r.text(),body||'');
  }
});

test('November 2 isolated release preserves the Formspree-compatible response policy across representations and generated failures',async()=>{
  for(const[status,method,body,headers]of[
    [200,'GET','Synthetic form',{'Content-Type':'text/html','Referrer-Policy':'no-referrer'}],
    [200,'HEAD',null,{'Content-Type':'text/html'}],
    [206,'GET','range',{'Content-Type':'application/pdf','Content-Range':'bytes 0-4/100'}],
    [304,'GET',null,{'ETag':'"synthetic"'}],
    [301,'GET',null,{'Location':'/contact/?type=review'}],
    [404,'GET','missing',{}],
    [500,'GET','Synthetic upstream error',{}]
  ]){
    const f=fixture(()=>new Response(body,{status,headers}));
    const r=await f.handler.fetch(request('/contact/?type=review',{method}),f.env);
    assert.equal(r.status,status);assert.equal(r.headers.get('Referrer-Policy'),'strict-origin-when-cross-origin');
    assert.equal(r.headers.get('X-Robots-Tag'),'noindex, follow');
    if(status!==404)assert.equal(await r.text(),body||'');
  }
  const f=fixture();
  for(const req of[new Request('https://other.example/'),request('/api/contact',{method:'POST'}),request('/',{method:'PUT'})]){
    const r=await f.handler.fetch(req,f.env);
    assert.equal(r.headers.get('Referrer-Policy'),'strict-origin-when-cross-origin');
    assert.equal(r.headers.get('X-Robots-Tag'),'noindex, follow');
  }
  assert.equal(f.calls.length,0);
  const failed=fixture(()=>{throw Error('Synthetic private failure');});
  const r=await failed.handler.fetch(request(),failed.env);
  assert.equal(r.status,503);assert.equal(r.headers.get('Referrer-Policy'),'strict-origin-when-cross-origin');
});
test('November 2 isolated release local collection APIs and unsupported methods remain disabled',async()=>{
  const f=fixture();for(const route of ['/api/contact','/api/inquiry'])for(const method of ['GET','POST']){
    const r=await f.handler.fetch(request(route,{method}),f.env);assert.equal(r.status,method==='POST'?503:405);assert.equal(r.headers.get('X-Robots-Tag'),'noindex, follow');
  }
  assert.equal((await f.handler.fetch(request('/',{method:'PUT'}),f.env)).status,405);assert.equal(f.calls.length,0);
});

test('November 2 isolated RC keeps host-only one-day HSTS on generated failures without changing staging',async()=>{
 const f=fixture();
 for(const req of[request('/api/contact'),request('/api/contact',{method:'POST'}),request('/',{method:'PUT'}),request('/missing/')]){
  const r=await f.handler.fetch(req,f.env);assert.equal(r.headers.get('Strict-Transport-Security'),'max-age=86400');
 }
 const failed=fixture(()=>{throw Error('Synthetic');});
 const missing=fixture(()=>new Response('Synthetic missing',{status:404}));
 assert.equal((await missing.handler.fetch(request('/missing/'),missing.env)).headers.get('Strict-Transport-Security'),'max-age=86400');
 assert.equal((await failed.handler.fetch(request(),failed.env)).headers.get('Strict-Transport-Security'),'max-age=86400');
 const staging=await createStagingHandler().fetch(new Request('https://stage.example.workers.dev/api/contact'),{STAGING_HOSTNAME:'stage.example.workers.dev',ASSETS:{fetch:async()=>new Response('unused')}});
 assert.equal(staging.headers.get('Strict-Transport-Security'),null);
 assert.equal((await f.handler.fetch(new Request('https://other.example/'),f.env)).headers.get('Strict-Transport-Security'),null);
});
test('November 2 isolated release asset errors preserve safe fallback responses and clear stale representation headers',async()=>{
  const f=fixture(()=>new Response('missing',{status:404,headers:{'Content-Length':'7','Content-Encoding':'gzip','ETag':'"missing"','Location':'/incorrect'}}));
  const r=await f.handler.fetch(request('/missing/'),f.env);assert.equal(r.status,404);assert.equal(r.headers.get('X-Robots-Tag'),'noindex, follow');
  for(const k of ['Content-Length','Content-Encoding','ETag','Location'])assert.equal(r.headers.get(k),null);
  assert.match(await r.text(),/Page not found/);
  const fail=fixture(()=>{throw Error('Mock internal failure');});const error=await fail.handler.fetch(request(),fail.env);assert.equal(error.status,503);assert.equal(error.headers.get('X-Robots-Tag'),'noindex, follow');assert.doesNotMatch(await error.text(),/Mock internal failure/);
});
test('November 2 isolated release retains immutable fingerprinted asset caching and mutable document protection',async()=>{
  const f=fixture(()=>new Response('js',{headers:{'Content-Type':'application/javascript','Cache-Control':'public, max-age=31536000, immutable'}}));
  const asset=await f.handler.fetch(request('/_astro/widget.12345678.js'),f.env);assert.equal(asset.headers.get('Cache-Control'),'public, max-age=31536000, immutable');
  assert.equal(asset.headers.get('X-Robots-Tag'),'noindex, follow');
  const page=await f.handler.fetch(request('/resources/file.pdf'),f.env);assert.equal(page.headers.get('Cache-Control'),'private, no-store');
});
test('November 2 isolated release wrapper does not change the existing public staging indexing policy',async()=>{
  const r=await createStagingHandler().fetch(new Request('https://itkeepers-v2-staging.jimnassar99.workers.dev/'),{STAGING_HOSTNAME:'itkeepers-v2-staging.jimnassar99.workers.dev',ASSETS:{fetch:async()=>new Response('original staging')}});
  assert.equal(r.status,200);assert.equal(r.headers.get('X-Robots-Tag'),null);
  for(const file of ['worker/staging.ts','worker/index.ts','src/data/seo.ts','scripts/build-staging.mjs'])assert.doesNotMatch(readFileSync(file,'utf8'),/rc-policy\.json|worker\/rc\.ts/);
});
test('November 2 isolated release built artifact preserves production content and uses only the exact isolated configuration',()=>{
  assert.deepEqual(Object.keys(rcModule),['default'],'Only the fetch entry is exported');
  const r=spawnSync(process.execPath,['scripts/check-isolated-release.mjs'],{encoding:'utf8'});assert.equal(r.status,0,r.stderr||r.stdout);
});
