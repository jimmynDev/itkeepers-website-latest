import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/scripts/animation-lifecycle.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;

function target(properties = {}) {
  const listeners = new Map();
  return Object.assign(properties, {
    addEventListener(name, fn) { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(fn); },
    removeEventListener(name, fn) { listeners.get(name)?.delete(fn); },
    emit(name, properties = {}) { for (const fn of listeners.get(name) ?? []) fn(properties); },
    listenerCount() { return [...listeners.values()].reduce((sum, values) => sum + values.size, 0); },
  });
}

function harness({ reduced = false, observerAvailable = true, entrance = false } = {}) {
  let now = 0;
  let id = 0;
  const timers = new Map();
  const media = target({ matches: reduced });
  const document = target({ hidden: false });
  const window = target({ matchMedia: () => media });
  const visual = {
    innerHTML: '<p>Readable static example</p>', className: 'visual', style: null,
    attributes: {},
    getAttribute(name) { return name === 'style' ? this.style : this.attributes[name] ?? null; },
    setAttribute(name, value) { if(name === 'style') this.style = value; else this.attributes[name] = value; },
    removeAttribute(name) { if(name === 'style') this.style = null; else delete this.attributes[name]; },
    getBoundingClientRect() { return {}; },
  };
  const classes = new Set();
  const root = {
    dataset: {},
    closest() { return entrance ? {} : null; },
    classList: { toggle(name, enabled) { if (enabled) classes.add(name); else classes.delete(name); } },
    querySelector(selector) { return selector === '[data-animation-visual]' ? visual : null; },
  };
  const observers = new Map();
  class FakeObserver {
    constructor(callback, options) { this.callback = callback; observers.set(options.rootMargin, this); }
    observe() { this.connected = true; }
    disconnect() { this.connected = false; }
    emit(visible) { if (this.connected) this.callback([{ target: root, isIntersecting: visible }]); }
  }
  if (observerAvailable) window.IntersectionObserver = FakeObserver;
  const exports = {};
  vm.runInNewContext(compiled, {
    exports, window, document, IntersectionObserver: FakeObserver,
    performance: { now: () => now },
    setTimeout(callback, delay) { const key = ++id; timers.set(key, { callback, at: now + delay }); return key; },
    clearTimeout(key) { timers.delete(key); },
  });
  return {
    root, visual, classes, document, window, media, timers,
    mount: (factory, options) => exports.mountAnimation(root, factory, options),
    visible(value = true) { observers.get('0px')?.emit(value); observers.get('-96px 0px')?.emit(value); },
    boundary(margin, value) { observers.get(margin)?.emit(value); },
    leave() { this.visible(false); observers.get('160px 0px')?.emit(false); },
    tick(duration) {
      const end = now + duration;
      while (true) {
        const next = [...timers].filter(([, task]) => task.at <= end).sort((a, b) => a[1].at - b[1].at || a[0] - b[0])[0];
        if (!next) break;
        now = next[1].at; timers.delete(next[0]); next[1].callback();
      }
      now = end;
    },
  };
}

function sequence(h, events = []) {
  return h.mount(({ later }) => ({
    duration: 1000,
    play() { events.push('play'); later(() => { events.push('step'); later(() => events.push('nested'), 100); }, 400); },
    settle() { events.push('settle'); h.visual.innerHTML = '<p>Meaningful final example</p>'; },
  }));
}

test('homepage entrance takes 600ms once and resumes its remaining delay after a full exit',()=>{
 const h=harness({entrance:true}),events=[];sequence(h,events);h.visible();h.tick(200);h.leave();h.tick(30000);assert.deepEqual(events,[]);h.visible();h.tick(399);assert.deepEqual(events,[]);h.tick(1);assert.deepEqual(events,['play']);h.tick(1000);assert.equal(h.visual.inert,false);h.leave();h.visible();h.tick(30000);assert.deepEqual(events,['play','step','nested','settle']);
});
test('a viewport-edge glimpse cannot initialize an explanation',()=>{const h=harness(),events=[];sequence(h,events);h.boundary('0px',true);h.tick(30000);assert.deepEqual(events,[]);h.boundary('-96px 0px',true);h.tick(1000);assert.deepEqual(events,['play','step','nested','settle']);});
for(const seconds of [3,10,20,30,120])test('ambient renderer remains active at '+seconds+' seconds with no deadline timer',()=>{const h=harness(),events=[],activity=[];h.mount(()=>({duration:0,ambient:true,play(){events.push('play')},settle(){events.push('settle')},activity(v){activity.push(v)}}));h.visible();h.tick(seconds*1000);assert.equal(activity.at(-1),true);assert.equal(h.root.dataset.animationActive,'true');assert.deepEqual(events,['play']);assert.equal(h.timers.size,0);});
for(const duration of [1000,3100,4400,4700,5000,8300,8400,8700,9200,9300,11800,16660])test('explanation '+duration+'ms completes once; ambient motion survives 30 seconds and re-entry',()=>{const h=harness(),events=[];let factories=0;h.mount(()=>{factories++;return{duration,ambient:true,play(){events.push('play')},settle(){events.push('settle');h.visual.innerHTML='complete'}}});h.visible();h.tick(30000);assert.deepEqual(events,['play','settle']);assert.equal(h.root.dataset.animationActive,'true');const html=h.visual.innerHTML;for(let i=0;i<5;i++){h.leave();h.tick(2000);assert.equal(h.root.dataset.animationActive,'false');h.visible();h.tick(30000);assert.equal(h.visual.innerHTML,html);assert.equal(h.root.dataset.animationActive,'true');}assert.equal(factories,1);assert.deepEqual(events,['play','settle']);assert.equal(h.timers.size,0);});
for(const kind of ['offscreen','hidden','bfcache'])test(kind+' suspends and resumes remaining nested work without replay',()=>{const h=harness(),events=[];sequence(h,events);h.visible();h.tick(250);if(kind==='offscreen')h.leave();if(kind==='hidden'){h.document.hidden=true;h.document.emit('visibilitychange')}if(kind==='bfcache')h.window.emit('pagehide',{persisted:true});h.tick(30000);assert.deepEqual(events,['play']);assert.equal(h.timers.size,0);if(kind==='offscreen')h.visible();if(kind==='hidden'){h.document.hidden=false;h.document.emit('visibilitychange')}if(kind==='bfcache')h.window.emit('pageshow');h.tick(149);assert.deepEqual(events,['play']);h.tick(1);assert.deepEqual(events,['play','step']);h.tick(100);assert.deepEqual(events,['play','step','nested']);h.tick(500);assert.deepEqual(events,['play','step','nested','settle']);});
test('finite nonambient APIs retain a static terminal state',()=>{const h=harness(),events=[];sequence(h,events);h.visible();h.tick(30000);assert.deepEqual(events,['play','step','nested','settle']);assert.equal(h.root.dataset.animationActive,'false');assert.ok(h.classes.has('is-idle'));});
test('initial and live reduced motion expose complete information, then resume only ambient motion',()=>{for(const reduced of [true,false]){const h=harness({reduced}),events=[];h.mount(()=>({duration:1000,ambient:true,play(){events.push('play')},settle(){events.push('settle')}}));h.visible();if(!reduced){h.tick(200);h.media.matches=true;h.media.emit('change')}assert.equal(h.root.dataset.animationActive,'false');assert.equal(h.root.dataset.animationState,'settled');assert.equal(h.timers.size,0);h.media.matches=false;h.media.emit('change');h.tick(30000);assert.equal(h.root.dataset.animationActive,'true');assert.equal(events.filter(x=>x==='settle').length,1);assert.equal(events.filter(x=>x==='play').length,reduced?0:1);}});
test('CSS and SMIL clocks pause offscreen and resume the same animation identity',()=>{const h=harness();let clock={playState:'running',pause(){this.playState='paused'},play(){this.playState='running'}},paused=false;h.root.getAnimations=()=>[clock];h.root.querySelectorAll=()=>[{pauseAnimations(){paused=true},unpauseAnimations(){paused=false}}];h.mount(()=>({duration:0,ambient:true,play(){},settle(){}}));h.visible();assert.equal(clock.playState,'running');assert.equal(paused,false);h.leave();assert.equal(clock.playState,'paused');assert.equal(paused,true);h.visible();assert.equal(clock.playState,'running');assert.equal(paused,false);});
test('idempotent mount and disposal remove timers, observers, listeners and renderer exactly once',()=>{const h=harness(),events=[];let disposed=0;const factory=()=>({duration:30000,ambient:true,play(){events.push('play')},settle(){events.push('settle')},dispose(){disposed++}});const stop=h.mount(factory);assert.equal(h.mount(factory),stop);h.visible();h.tick(200);stop();stop();h.tick(60000);assert.equal(disposed,1);assert.deepEqual(events,['play']);assert.equal(h.timers.size,0);assert.equal(h.window.listenerCount()+h.document.listenerCount()+h.media.listenerCount(),0);});
test('missing observer and factory failures reveal readable fallback immediately',()=>{const h=harness({observerAvailable:false,entrance:true}),events=[];sequence(h,events);assert.deepEqual(events,['settle']);assert.equal(h.visual.inert,false);assert.equal(h.timers.size,0);const bad=harness({entrance:true});bad.visual.setAttribute('data-phase','settled');bad.mount(()=>{bad.visual.innerHTML='partial';bad.visual.setAttribute('data-phase','play');throw Error('canvas unavailable')});assert.equal(bad.visual.innerHTML,'<p>Readable static example</p>');assert.equal(bad.visual.getAttribute('data-phase'),'settled');assert.equal(bad.root.dataset.animationEnhanced,undefined);assert.equal(bad.visual.inert,false);});
test('invalid durations and failing scheduled callbacks retain a static fallback',()=>{for(const value of [-1,Infinity,NaN]){const h=harness();h.mount(()=>({duration:value,play(){},settle(){}}));assert.equal(h.root.dataset.animationEnhanced,undefined);assert.equal(h.timers.size,0);}const h=harness();h.mount(({later})=>({duration:10000,play(){later(()=>{throw Error('bad phase')},100)},settle(){}}));h.visible();h.tick(30000);assert.equal(h.timers.size,0);assert.equal(h.root.dataset.animationActive,'false');assert.equal(h.visual.innerHTML,'<p>Readable static example</p>');});
