import { readFileSync, readdirSync } from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
const policy=JSON.parse(readFileSync('worker/public-indexing-policy.json','utf8'));
const files=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);
const robots=/<meta name="robots" content="[^"]*"\s*\/?>/g;
const urls=[];let pages=0,forms=0,held=0;
for(const staged of files('dist-staging')){
 const relative=path.relative('dist-staging',staged);const actual=readFileSync(staged);const original=readFileSync(path.join('dist',relative));
 if(staged.endsWith('.html')){
  pages++;const html=actual.toString(),before=original.toString();
  const route='/'+relative.replaceAll('\\','/').replace(/index\.html$/,'');
  const noindex=Object.hasOwn(policy.noindex,route)||/noindex/.test(before.match(robots)[0]);
  assert.equal([...html.matchAll(robots)].length,1,relative);
  assert(html.includes(`<meta name="robots" content="${noindex?'noindex':'index'}, follow">`),relative);
  if(noindex)held++;else urls.push(policy.origin+route);
  assert.equal(html.slice(html.indexOf('<body')),before.slice(before.indexOf('<body')),'Visible content/scripts changed: '+relative);
  const restoredHead=html.slice(0,html.indexOf('<body')).replaceAll(policy.origin,'https://itkeepers.com').replace(robots,before.match(robots)[0]);
  assert.equal(restoredHead,before.slice(0,before.indexOf('<body')),'Unexpected head change: '+relative);
  assert(html.includes(`rel="canonical" href="${policy.origin}${route}"`),relative);
  assert(html.includes(`property="og:url" content="${policy.origin}${route}"`),relative);
  assert(!html.includes('data-inquiry-delivery="backend"'));
  const formTags=html.match(/<form\b[^>]*data-inquiry-form[^>]*>/g)||[];
  for(const form of formTags) { assert(form.includes('action="https://formspree.io/f/mrppzvpo"'));assert(form.includes('method="post"'));assert(form.includes('data-inquiry-delivery="formspree"')); }
  forms+=formTags.length;
 }else if(relative==='robots.txt'){
  assert.equal(actual.toString(),`User-agent: *\nAllow: /\nSitemap: ${policy.origin}/sitemap.xml\n`);
 }else if(relative==='_headers'){
  const value=actual.toString();assert(!/X-Robots-Tag:/i.test(value),'Blanket indexing guard remains');
  for(const name of ['Content-Security-Policy','X-Content-Type-Options','X-Frame-Options','Referrer-Policy','Permissions-Policy','Strict-Transport-Security']){
   const re=new RegExp(`  ${name}: [^\\r\\n]+`);assert.equal(value.match(re)?.[0],original.toString().match(re)?.[0],name);
  }
  assert(value.includes(policy.origin+'/*'));assert(!value.includes('https://:version.:subdomain.workers.dev/*'));
 }else if(relative!=='sitemap.xml')assert.deepEqual(actual,original,'Asset/redirect changed: '+relative);
}
const sitemap=readFileSync('dist-staging/sitemap.xml','utf8');
assert.deepEqual([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]).sort(),urls.sort());
assert.equal(files('dist-staging').length,files('dist').length);assert.equal(pages,20);assert.equal(forms,2);assert.equal(held,5);assert.equal(urls.length,15);
console.log(JSON.stringify({pages,indexable:urls.length,held,forms,assetsAndBodyIdentical:true,canonicals:policy.origin,contact:'direct Formspree; local APIs disabled; Privacy approval pending',redirectRules:28}));
