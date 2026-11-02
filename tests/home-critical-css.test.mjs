import test from 'node:test';
import assert from 'node:assert/strict';
import { criticalHomeCSS, containLaterContent } from '../scripts/home-critical-css.mjs';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const html='<html><body><header class="header-region"><a class="nav">Menu</a></header><main><section class="home-hero"><span class="title" data-astro-cid-hero>Team</span></section><section id="services/managed"><div class="managed">Example</div></section><section class="late"><p>Later</p></section></main></body></html>';
test('critical extraction retains responsive/theme/focus states, required animation and original cascade order',()=>{
 const css=':root{--ink:white}.title[data-astro-cid-hero]{color:red}.late{color:blue}@media(max-width:600px){.title[data-astro-cid-hero]{color:green}.late{display:grid}}[data-hero-theme="day"] .title[data-astro-cid-hero]:hover{color:black}.title.is-active{animation:rise 1s}.managed{padding:10px}@keyframes rise{from{opacity:0}to{opacity:1}}@keyframes unused{to{opacity:0}}.title{color:white}';
 const actual=criticalHomeCSS(css,html);
 assert(!actual.includes('.late'));assert(!actual.includes('@keyframes unused'));
 for(const part of [':root','@media','color:green','data-hero-theme','hover','@keyframes rise','.managed'])assert(actual.includes(part),part);
 assert(actual.indexOf('color:red')<actual.indexOf('color:white'));
});
test('unrecognized selector grammar is kept rather than silently dropping styles',()=>{
 assert(criticalHomeCSS('.title:future-state{color:red}',html).includes('color:red'));
});
test('temporary containment masks later illustration overflow while preserving the first screen and global control',()=>{
 const source=html.replace('</body>','<button class="home-motion-control">Pause motion</button></body>');
 const result=containLaterContent(source);
 assert.match(result,/<section class="late" data-home-late>/);
 assert(!result.includes('id="services/managed" data-home-late'));
 assert(!result.includes('class="home-motion-control" data-home-late'));
});
test('full cascade is available natively without a JavaScript stylesheet loader',()=>{
 const html=readFileSync('dist/index.html','utf8');
 assert(html.includes('<style data-home-critical>'));
 const links=[...html.matchAll(/<link rel="stylesheet"[^>]*data-home-full[^>]*>/g)];assert.equal(links.length,1);
 assert(!links[0][0].includes('media='));assert(html.indexOf(links[0][0])>html.indexOf('</footer>'));
 assert(!html.includes('data-home-deferred'));assert(!html.includes('complete-home-styles.js'));
});

test('complete stylesheet failure removes temporary containment; unrelated errors do not',()=>{
 const attributes=new Set();let handle;
 class Link { constructor(full){this.full=full;} hasAttribute(name){return name==='data-home-full'&&this.full;} }
 const root={dataset:{},setAttribute:name=>attributes.add(name),removeAttribute:name=>attributes.delete(name)};
 vm.runInNewContext(readFileSync('public/hero-theme-init.js','utf8'),{HTMLLinkElement:Link,document:{documentElement:root,addEventListener:(name,fn,capture)=>{assert.equal(name,'error');assert.equal(capture,true);handle=fn;}}});
 assert(attributes.has('data-home-enhanced'));assert.equal(root.dataset.heroTheme,'night');
 handle({target:new Link(false)});handle({target:{}});assert(attributes.has('data-home-enhanced'));
 handle({target:new Link(true)});assert(!attributes.has('data-home-enhanced'));
});
