import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const source = readFileSync(new URL('../src/scripts/technology-marquee.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module:ts.ModuleKind.CommonJS, target:ts.ScriptTarget.ES2022 } }).outputText;
function target(extra={}) {
  const listeners=new Map();
  return Object.assign(extra,{addEventListener(n,f){listeners.set(n,f)},removeEventListener(n){listeners.delete(n)},emit(n,e={}){listeners.get(n)?.(e)},listeners});
}
function fixture({reduced=false,observer=true}={}) {
  const attrs=new Set(),icon={textContent:''};
  const button=target({hidden:true,querySelector:()=>icon,setAttribute(n,v){this[n]=v}});
  let decode,observed,count=0;
  const image={loading:'lazy',decode:()=>new Promise(resolve=>{decode=resolve})};
  const root={querySelector:()=>button,querySelectorAll:()=>[image],setAttribute:n=>attrs.add(n),removeAttribute:n=>attrs.delete(n),toggleAttribute:(n,v)=>v?attrs.add(n):attrs.delete(n)};
  const media=target({matches:reduced}),document=target({hidden:false}),window=target();
  class Observer{constructor(f){observed=f;count++}observe(){}disconnect(){observed=undefined}}
  if(observer)window.IntersectionObserver=Observer;
  const exports={};vm.runInNewContext(compiled,{exports,window,document,matchMedia:()=>media,IntersectionObserver:Observer,setTimeout(){throw Error('Continuous marquee must not have a fixed stop timer')}});
  return {root,attrs,button,icon,image,media,document,window,mount:()=>exports.mountTechnologyMarquee(root),visible:v=>observed?.([{target:root,isIntersecting:v}]),loaded:async()=>{decode?.();await new Promise(resolve=>setImmediate(resolve))},count:()=>count};
}
test('marquee waits for horizontal image decoding and has no five-second deadline',async()=>{
  const h=fixture();h.mount();assert.equal(h.image.loading,'lazy');h.visible(true);assert.equal(h.image.loading,'eager');assert.ok(!h.attrs.has('data-marquee-running'));await h.loaded();assert.ok(h.attrs.has('data-marquee-running'));assert.equal(h.button.listeners.size,0);
});
test('document and bfcache suspension resume automatically with no playback button',async()=>{const h=fixture();h.mount();h.visible(true);await h.loaded();h.document.hidden=true;h.document.emit('visibilitychange');assert.ok(!h.attrs.has('data-marquee-running'));h.document.hidden=false;h.document.emit('visibilitychange');assert.ok(h.attrs.has('data-marquee-running'));h.window.emit('pagehide',{persisted:true});assert.ok(!h.attrs.has('data-marquee-running'));h.window.emit('pageshow');assert.ok(h.attrs.has('data-marquee-running'));assert.equal(h.button.listeners.size,0);assert.doesNotMatch(readFileSync(new URL('../src/components/TechnologyEcosystem.astro',import.meta.url),'utf8'),/data-marquee-toggle/);});
test('automatic suspension resumes an existing enhancement rather than remounting',async()=>{
  const h=fixture();const dispose=h.mount();h.visible(true);await h.loaded();h.visible(false);assert.ok(!h.attrs.has('data-marquee-running'));h.visible(true);assert.ok(h.attrs.has('data-marquee-running'));assert.equal(h.mount(),dispose);assert.equal(h.count(),1);
});
test('initial and live reduced-motion modes expose a static row without playback controls',async()=>{
  for(const initial of [true,false]){const h=fixture({reduced:initial});h.mount();h.visible(true);await h.loaded();if(!initial){h.media.matches=true;h.media.emit('change')}assert.ok(h.attrs.has('data-marquee-static'));assert.ok(!h.attrs.has('data-marquee-running'));assert.equal(h.button.hidden,true);h.media.matches=false;h.media.emit('change');assert.ok(h.attrs.has('data-marquee-running'))}
});
test('disposal cancels later decode mutation, removes listeners and restores no-JS layout',async()=>{
  const h=fixture(),dispose=h.mount();h.visible(true);dispose();dispose();await h.loaded();assert.equal(h.attrs.size,0);assert.equal(h.button.hidden,true);assert.equal(h.button.listeners.size+h.media.listeners.size+h.document.listeners.size+h.window.listeners.size,0);const fallback=fixture({observer:false});fallback.mount();await fallback.loaded();assert.ok(fallback.attrs.has('data-marquee-running'));
});
