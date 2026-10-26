import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const source=readFileSync(new URL('../src/scripts/ambient-preview.ts',import.meta.url),'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
function target(extra={}){const listeners=new Map();return Object.assign(extra,{addEventListener(n,f){listeners.set(n,f)},removeEventListener(n){listeners.delete(n)},emit(n,e={}){listeners.get(n)?.(e)},listeners});}
function fixture({reduced=false,observer=true}={}){
 let now=0,id=0,observe,settled=0;const timers=new Map(),attrs=new Set();
 const root={hasAttribute:n=>attrs.has(n),setAttribute:n=>attrs.add(n),removeAttribute:n=>attrs.delete(n),toggleAttribute:(n,v)=>v?attrs.add(n):attrs.delete(n)};
 const media=target({matches:reduced}),document=target({hidden:false}),window=target();
 class Observer{constructor(f){observe=f}observe(){}disconnect(){observe=undefined}}
 if(observer)window.IntersectionObserver=Observer;
 const exports={};vm.runInNewContext(compiled,{exports,window,document,IntersectionObserver:Observer,matchMedia:()=>media,performance:{now:()=>now},setTimeout(f,d){timers.set(++id,{f,at:now+d});return id},clearTimeout:i=>timers.delete(i)});
 return{root,attrs,media,document,window,timers,mount:()=>exports.mountAmbientPreview(root,()=>settled++),settled:()=>settled,visible:v=>observe?.([{target:root,isIntersecting:v}]),tick(d){const end=now+d;while(true){const t=[...timers].filter(([,t])=>t.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!t)break;now=t[1].at;timers.delete(t[0]);t[1].f()}now=end}};
}
test('ambient CSS remains active at 3, 10, 20, 30 and 120 seconds without timers',()=>{const h=fixture();h.mount();h.visible(true);for(const seconds of [3,7,10,10,90]){h.tick(seconds*1000);assert.ok(h.attrs.has('data-ambient-running'));assert.ok(!h.attrs.has('data-ambient-settled'));assert.equal(h.timers.size,0);assert.equal(h.settled(),0);}});
test('offscreen, hidden and bfcache suspension resume without a deadline',()=>{for(const kind of ['viewport','hidden','bfcache']){const h=fixture();h.mount();h.visible(true);h.tick(30000);if(kind==='viewport')h.visible(false);if(kind==='hidden'){h.document.hidden=true;h.document.emit('visibilitychange')}if(kind==='bfcache')h.window.emit('pagehide',{persisted:true});assert.ok(!h.attrs.has('data-ambient-running'));h.tick(30000);if(kind==='viewport')h.visible(true);if(kind==='hidden'){h.document.hidden=false;h.document.emit('visibilitychange')}if(kind==='bfcache')h.window.emit('pageshow');assert.ok(h.attrs.has('data-ambient-running'));assert.equal(h.settled(),0);}});
test('initial and live reduced motion stay static until the preference changes',()=>{for(const reduced of [true,false]){const h=fixture({reduced});h.mount();h.visible(true);if(!reduced){h.media.matches=true;h.media.emit('change')}assert.ok(h.attrs.has('data-ambient-settled'));assert.ok(!h.attrs.has('data-ambient-running'));h.media.matches=false;h.media.emit('change');assert.ok(h.attrs.has('data-ambient-running'));assert.ok(!h.attrs.has('data-ambient-settled'));}});
test('mounting and cleanup are idempotent with zero timers or duplicate listeners',()=>{const h=fixture(),dispose=h.mount();assert.equal(h.mount(),dispose);h.visible(true);assert.equal(h.timers.size,0);dispose();dispose();assert.equal(h.media.listeners.size+h.window.listeners.size+h.document.listeners.size,0);const fallback=fixture({observer:false});fallback.mount();assert.ok(!fallback.attrs.has('data-ambient-enhanced'));});
