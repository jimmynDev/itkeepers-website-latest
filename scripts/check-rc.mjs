import { readFileSync, readdirSync } from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const policy=JSON.parse(readFileSync(path.join(root,'worker/rc-policy.json'),'utf8'));
const files=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);
const out=path.join(root,'dist-rc'),production=path.join(root,'dist');
const robots=/<meta name="robots" content="[^"]*"\s*\/?>/g;
let pages=0,forms=0;
assert.equal(policy.name,'itkeepers-v2-rc-20261027');
assert.equal(policy.accountId,'eabf58c0ea3cf8629b95c29042124f72');
assert.equal(policy.hostname,policy.name+'.jimnassar99.workers.dev');assert.equal(policy.origin,'https://'+policy.hostname);
for(const file of files(out)){
  const relative=path.relative(out,file),actual=readFileSync(file),original=readFileSync(path.join(production,relative));
  if(file.endsWith('.html')){
    pages++;const html=actual.toString(),before=original.toString();
    const route='/'+relative.replaceAll('\\','/').replace(/index\.html$/,'');
    assert.deepEqual(html.match(robots),['<meta name="robots" content="noindex, follow">'],relative);
    assert.equal(html.slice(html.indexOf('<body')),before.slice(before.indexOf('<body')),'RC visible content/scripts changed: '+relative);
    assert.equal(html.slice(0,html.indexOf('<body')).replaceAll(policy.origin,'https://itkeepers.com').replace(robots,before.match(robots)[0]),before.slice(0,before.indexOf('<body')),'Unexpected RC head change: '+relative);
    assert(html.includes(`rel="canonical" href="${policy.origin}${route}"`),relative);
    assert(html.includes(`property="og:url" content="${policy.origin}${route}"`),relative);
    assert(!html.includes('data-inquiry-delivery="backend"'));
    const tags=html.match(/<form\b[^>]*data-inquiry-form[^>]*>/g)||[];
    for(const form of tags){assert(form.includes('action="https://formspree.io/f/mrppzvpo"'));assert(form.includes('method="post"'));assert(form.includes('data-inquiry-delivery="formspree"'));}forms+=tags.length;
  }else if(relative==='robots.txt')assert.equal(actual.toString(),'User-agent: *\nAllow: /\n');
  else if(relative==='sitemap.xml')assert.equal(actual.toString(),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
  else if(relative==='_headers')assert.equal(actual.toString(),original.toString().replaceAll('\r\n','\n').replace('/*\n','/*\n  X-Robots-Tag: noindex, follow\n').replaceAll('https://itkeepers.com',policy.origin));
  else assert.deepEqual(actual,original,'RC asset/redirect changed: '+relative);
}
assert.equal(files(out).length,files(production).length);assert.equal(pages,20);assert.equal(forms,2);
const parsed=spawnSync('python',['-c','import tomllib,json;print(json.dumps(tomllib.load(open("wrangler.rc.toml","rb"))))'],{cwd:root,encoding:'utf8'});
assert.equal(parsed.status,0,parsed.stderr);const c=JSON.parse(parsed.stdout);
assert.deepEqual(c,{name:policy.name,account_id:policy.accountId,main:'worker/rc.ts',compatibility_date:'2026-09-29',send_metrics:false,workers_dev:true,preview_urls:false,routes:[],vars:{STAGING_HOSTNAME:policy.hostname,CONTACT_VALIDATION_ENABLED:'false',CONTACT_DELIVERY_ENABLED:'false'},assets:{directory:'./dist-rc',binding:'ASSETS',run_worker_first:true},observability:{enabled:false}});
console.log(JSON.stringify({pages,indexable:0,forms,files:files(out).length,origin:policy.origin,publicAccess:true,emptyUnadvertisedSitemap:true,assetsBodiesSecurityHeadersPreserved:true,exactIsolatedConfig:true}));
