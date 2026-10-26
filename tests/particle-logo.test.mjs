import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/scripts/particle-logo.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
function target(extra = {}) {
  const listeners = new Map();
  return Object.assign(extra, {
    addEventListener(name, fn) { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(fn); },
    removeEventListener(name, fn) { listeners.get(name)?.delete(fn); },
    emit(name, value) { for (const fn of listeners.get(name) ?? []) fn(value); },
    count() { return [...listeners.values()].reduce((sum, set) => sum + set.size, 0); },
  });
}
function harness({ mobile = false, reduced = false, fine = true, canvasAvailable = true } = {}) {
  const media = new Map();
  const frames = new Map(), images = [], draws = [];
  let frameId = 0, width = mobile ? 288 : 520, sampleCrop;
  const context = { clearRect() { draws.length = 0; }, setTransform(...args) { this.transform = args; },
    beginPath() {}, arc(x,y,r) { draws.push({x,y,r,alpha:this.globalAlpha,color:this.fillStyle,composite:this.globalCompositeOperation}); }, fill() {}, moveTo() {}, lineTo() {}, stroke() {} };
  const canvas = { width: 0, height: 0, getContext: () => canvasAvailable ? context : null };
  const makeFallback = () => ({ cloneNode: () => makeFallback(), remove() { fallbackNode = undefined; } });
  let fallbackNode = makeFallback();
  const stage = target({ dataset: {}, querySelector: selector => selector === 'canvas' ? canvas : fallbackNode,
    prepend(node) { fallbackNode = node; }, getBoundingClientRect: () => ({left:0,top:0,width,height:width}) });
  const root = { querySelector: () => stage };
  const pixels = new Uint8ClampedArray(740 * 830 * 4);
  for(let y=80;y<750;y++) for(let x=100;x<600;x++) {
    const p=(y*740+x)*4; pixels[p]=x<300?255:0;pixels[p+1]=x<300?255:186;pixels[p+2]=x<300?255:235;pixels[p+3]=255;
  }
  // A separate bright pixel must be discarded by the connected-region mask.
  pixels.set([255,255,255,255],(40*740+720)*4);
  // Simulated raster image; the real logo crop is checked in the built preview.
  const document = { hidden: false, createElement: () => ({ getContext: () => ({ clearRect() {}, drawImage(...args) { sampleCrop = args.slice(1); }, getImageData: () => ({data:pixels}) }) }) };
  const observers = [];
  class Observer { constructor(fn) { this.fn = fn; observers.push(this); } observe() {} disconnect() { this.disconnected = true; } }
  class Image { constructor() { images.push(this); } }
  const exports = {};
  vm.runInNewContext(compiled, { exports, document, Image, ResizeObserver: Observer, devicePixelRatio: 3,
    matchMedia(query) { if (!media.has(query)) media.set(query, target({matches: query.includes('reduced-motion') ? reduced : query.includes('pointer') ? fine : query.includes('max-width') ? mobile : false})); return media.get(query); },
    requestAnimationFrame(fn) { frames.set(++frameId, fn); return frameId; }, cancelAnimationFrame(id) { frames.delete(id); },
  });
  const renderer = canvasAvailable ? exports.createParticleLogo(root) : undefined;
  return { renderer, root, stage, canvas, context, document, frames, images, media, observers, draws,
    create: () => exports.createParticleLogo(root),
    load() { images.at(-1)?.onload?.(); },
    frame(time) { const pending = [...frames]; frames.clear(); for (const [, fn] of pending) fn(time); },
    resize(value) { width = value; observers.forEach(o => !o.disconnected && o.fn()); },
    crop: () => sampleCrop,
  };
}


const logoPoints = h => h.draws.filter(p=>p.composite==='screen');
function play(h) {h.renderer.activity(true);h.renderer.play();h.load();}

test('starts fully formed with no reveal, retains reference colors, and caps density',()=>{
  const h=harness();assert.equal(h.images[0].src,undefined);assert.equal(h.frames.size,0);
  h.renderer.activity(true);assert.equal(h.images[0].src,'/assets/itkeepers-particle-k.png');assert.equal(h.frames.size,0);h.renderer.play();h.load();
  assert.equal(h.stage.dataset.particleReady,'true');assert.equal(h.frames.size,1);
  assert.equal(h.stage.querySelector('.particle-fallback'),undefined,'Remove the fallback DOM after painting the particle frame');
  assert.deepEqual(Array.from(h.crop()),[0,0,740,830]);assert.equal(h.canvas.width,910);
  const initial=logoPoints(h).map(p=>({...p}));
  assert.ok(initial.length>5000);assert.ok(initial.some(p=>p.color==='rgb(255,255,255)'));assert.ok(initial.some(p=>p.color==='rgb(0,186,235)'));
  h.frame(100);assert.deepEqual(logoPoints(h),initial,'First frame already has every particle at its fixed home');
  h.frame(116);assert.ok(logoPoints(h).some((p,i)=>p.x!==initial[i].x));
  assert.equal(h.renderer.duration,0);assert.equal(h.renderer.ambient,true);
});

test('mobile samples fewer particles and all particles fit from the first frame',()=>{
  const desktop=harness();play(desktop);const h=harness({mobile:true});play(h);
  assert.ok(logoPoints(h).length<logoPoints(desktop).length*.65);
  assert.equal(h.draws.length-logoPoints(h).length,55);
  assert.equal(desktop.draws.length-logoPoints(desktop).length,125);
  for(const p of logoPoints(h)) {assert.ok(p.x-p.r>0 && p.x+p.r<288);assert.ok(p.y-p.r>0 && p.y+p.r<288);}
});

test('repeated activity keeps one loop; offscreen/hidden pauses and delayed loading cannot restart it',()=>{
  const h=harness();h.renderer.activity(true);h.renderer.play();h.renderer.activity(false);h.load();
  assert.equal(h.frames.size,0);assert.equal(h.stage.dataset.particleReady,undefined);
  assert.ok(h.stage.querySelector('.particle-fallback'),'Loading offscreen retains the particle fallback');
  h.renderer.activity(true);h.renderer.activity(true);assert.equal(h.frames.size,1);
  h.frame(100);h.frame(116);assert.equal(h.frames.size,1);
  h.renderer.activity(false);assert.equal(h.frames.size,0);
  h.renderer.activity(true);h.document.hidden=true;h.frame(132);assert.equal(h.frames.size,0);
});

test('reduced motion and canvas failure keep the visible static fallback without an animation loop',()=>{
  const h=harness({reduced:true});h.renderer.settle();h.renderer.activity(true);h.renderer.play();
  assert.equal(h.images[0].src,undefined);assert.equal(h.frames.size,0);assert.equal(h.stage.dataset.particleReady,undefined);
  assert.throws(()=>harness({canvasAvailable:false}).create(),/Canvas unavailable/);
});

test('live reduced motion cancels rendering and restores the static mark',()=>{
  const h=harness();play(h);const media=h.media.get('(prefers-reduced-motion: reduce)');media.matches=true;media.emit('change');
  assert.equal(h.frames.size,0);assert.equal(h.stage.dataset.particleReady,undefined);
  assert.ok(h.stage.querySelector('.particle-fallback'),'Live reduced motion restores only the particle fallback');
});

test('touch cannot disturb the fixed shape; reference mouse force stays bounded and returns after leaving',()=>{
  const h=harness();play(h);h.frame(100);const homes=logoPoints(h).map(p=>({...p}));
  h.stage.emit('pointermove',{pointerType:'touch',clientX:200,clientY:200});h.frame(100);assert.deepEqual(logoPoints(h),homes);
  const point=homes[200];h.stage.emit('pointermove',{pointerType:'mouse',clientX:point.x+5,clientY:point.y});
  for(let time=116;time<1800;time+=16) h.frame(time);
  assert.ok(logoPoints(h).some((p,i)=>Math.hypot(p.x-homes[i].x,p.y-homes[i].y)>10));
  for(const [i,p] of logoPoints(h).entries()) assert.ok(Math.hypot(p.x-homes[i].x,p.y-homes[i].y)<=30.000001);
  h.stage.emit('pointerleave');for(let time=1800;time<4500;time+=16) h.frame(time);
  for(const [i,p] of logoPoints(h).entries()) assert.ok(Math.hypot(p.x-homes[i].x,p.y-homes[i].y)<10);
});

test('resizing preserves one loop and disposal removes all renderer work and listeners',()=>{
  const h=harness();play(h);h.resize(400);assert.equal(h.frames.size,1);assert.equal(h.canvas.width,700);
  h.renderer.dispose();h.renderer.dispose();assert.equal(h.frames.size,0);assert.equal(h.stage.count(),0);
  assert.ok([...h.media.values()].every(m=>m.count()===0));assert.ok(h.observers.every(o=>o.disconnected));assert.equal(h.images[0].onload,null);
});

test('delayed and failed image loading cannot replace particles with a solid image',()=>{
  const h=harness();h.renderer.activity(true);h.renderer.play();
  const fallback=h.stage.querySelector('.particle-fallback');
  assert.ok(fallback);assert.equal(h.frames.size,0);
  h.images[0].onerror();assert.equal(h.stage.querySelector('.particle-fallback'),fallback);
  assert.equal(h.frames.size,0);
  h.load();assert.equal(h.stage.querySelector('.particle-fallback'),undefined);
  assert.ok(logoPoints(h).length>5000,'A complete particle frame exists before takeover');
  h.renderer.activity(false);h.renderer.activity(true);
  assert.equal(h.stage.querySelector('.particle-fallback'),undefined,'Resume keeps canvas output without swapping to an image');
  assert.equal(h.frames.size,1);
});

test('fallback asset contains only colored dots and no solid-logo primitives or transitions',()=>{
  const component=readFileSync(new URL('../src/components/animations/ParticleLogoAnimation.astro',import.meta.url),'utf8');
  const fallback=readFileSync(new URL('../public/assets/itkeepers-particle-k-fallback.svg',import.meta.url),'utf8');
  assert.match(component,/src="\/assets\/itkeepers-particle-k-fallback\.svg"/);
  assert.doesNotMatch(component,/<image\b|href="\/assets\/itkeepers-logo\.png"|data-particle-ready/);
  assert.doesNotMatch(fallback,/<(?:image|path|polygon|rect|use)\b/);
  assert.ok((fallback.match(/<circle\b/g)||[]).length>2000);
  assert.match(fallback,/viewBox="0 0 74 83"/);
});

test('an initially reduced-motion particle fallback can resume ambient motion without replaying a reveal',()=>{const h=harness({reduced:true});h.renderer.settle();assert.equal(h.frames.size,0);const media=h.media.get('(prefers-reduced-motion: reduce)');media.matches=false;media.emit('change');h.renderer.activity(true);h.load();assert.equal(h.stage.dataset.particleReady,'true');assert.equal(h.frames.size,1);const first=logoPoints(h).map(p=>({...p}));h.frame(100);h.frame(116);assert.ok(logoPoints(h).some((p,i)=>p.x!==first[i].x));h.renderer.dispose();assert.equal(h.frames.size,0);});
