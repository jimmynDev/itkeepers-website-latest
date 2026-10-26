import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const source=readFileSync(new URL('../src/scripts/hero-status-motion.ts',import.meta.url),'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
function target(extra={}){const events=new Map();return Object.assign(extra,{addEventListener(n,f){events.set(n,f)},removeEventListener(n){events.delete(n)},emit(n,e={}){events.get(n)?.(e)},events});}
function fixture({reduced=false,observer=true}={}){
 const attrs=new Map(),button=target({hidden:true,setAttribute(n,v){this[n]=v}}),lastRow={};
 const root=target({querySelector:s=>s==='[data-status-toggle]'?button:lastRow,setAttribute:(n,v)=>attrs.set(n,v),removeAttribute:n=>attrs.delete(n),toggleAttribute:(n,v)=>v?attrs.set(n,''):attrs.delete(n)});
 const media=target({matches:reduced}),document=target({hidden:false}),window=target({matchMedia:()=>media});let observe,count=0;
 class Observer{constructor(f){observe=f;count++}observe(){}disconnect(){observe=undefined}}
 if(observer)window.IntersectionObserver=Observer;
 const exports={};vm.runInNewContext(compiled,{exports,window,document,IntersectionObserver:Observer,setTimeout(){throw Error('Continuous CSS motion must not have an automatic stop timer')}});
 return{root,attrs,button,lastRow,media,document,window,mount:()=>exports.mountHeroStatusMotion(root),visible:v=>observe?.([{target:root,isIntersecting:v}]),observers:()=>count};
}
test('status panel uses CSS clocks with no deadline or playback button',()=>{const h=fixture();h.mount();assert.ok(!h.attrs.has('data-status-running'));h.visible(true);assert.ok(h.attrs.has('data-status-running'));assert.equal(h.button.events.size,0);assert.doesNotMatch(readFileSync(new URL('../src/components/HeroStatusPanel.astro',import.meta.url),'utf8'),/data-status-toggle/);});
test('viewport, document and bfcache suspend and resume automatically',()=>{const h=fixture();h.mount();h.visible(true);h.visible(false);assert.ok(!h.attrs.has('data-status-running'));h.visible(true);assert.ok(h.attrs.has('data-status-running'));h.document.hidden=true;h.document.emit('visibilitychange');assert.ok(!h.attrs.has('data-status-running'));h.document.hidden=false;h.document.emit('visibilitychange');assert.ok(h.attrs.has('data-status-running'));h.window.emit('pagehide',{persisted:true});assert.ok(!h.attrs.has('data-status-running'));h.window.emit('pageshow');assert.ok(h.attrs.has('data-status-running'));});
test('visibility resumes the same completed entrance',()=>{const h=fixture();h.mount();h.visible(true);h.root.emit('animationend',{target:h.lastRow,animationName:'rise-scoped'});h.visible(false);h.visible(true);assert.ok(h.attrs.has('data-status-running'));assert.ok(h.attrs.has('data-status-entered'));assert.equal(h.observers(),1);});
test('initial and live reduced motion are static without replaying entrance',()=>{for(const reduced of [true,false]){const h=fixture({reduced});h.mount();h.visible(true);if(!reduced){h.media.matches=true;h.media.emit('change')}assert.ok(h.attrs.has('data-status-static'));assert.ok(!h.attrs.has('data-status-running'));h.media.matches=false;h.media.emit('change');assert.ok(h.attrs.has('data-status-running'));assert.ok(h.attrs.has('data-status-entered'));}});
test('idempotent teardown removes listeners; missing observers allow motion',()=>{const h=fixture(),dispose=h.mount();assert.equal(h.mount(),dispose);assert.equal(h.observers(),1);dispose();dispose();assert.equal(h.root.events.size+h.media.events.size+h.document.events.size+h.window.events.size,0);const fallback=fixture({observer:false});fallback.mount();assert.ok(fallback.attrs.has('data-status-running'));});
