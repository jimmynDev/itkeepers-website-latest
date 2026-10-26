import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/scripts/hero-headline.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
function element() {
  const classes = new Set(), attributes = new Map(), listeners = new Map();
  return {
    classes, attributes, offsetWidth: 400,
    classList: { add(...names) { names.forEach(x => classes.add(x)); }, remove(...names) { names.forEach(x => classes.delete(x)); }, toggle(name, on) { if (on) classes.add(name); else classes.delete(name); } },
    setAttribute(name, value) { attributes.set(name, value); },
    removeAttribute(name) { attributes.delete(name); },
    toggleAttribute(name, on) { if (on) attributes.set(name, ''); else attributes.delete(name); },
    addEventListener(name, fn) { listeners.set(name, fn); }, removeEventListener(name) { listeners.delete(name); },
    emit(name, event = {}) { listeners.get(name)?.(event); }, listeners,
  };
}
function fixture(reduced = false) {
  let now = 0, key = 0, observer;
  const timers = new Map(), frames = new Map();
  const roles = Array.from({ length: 6 }, element); roles[0].classes.add('is-active');
  const root = element(), rotator = element(), button = element(), document = element(), window = element(), media = element();
  media.matches = reduced; window.matchMedia = () => media;
  root.querySelectorAll = () => roles; root.querySelector = () => rotator; root.parentElement = { querySelector: () => button };
  class Observer { constructor(fn) { observer = fn; } observe() {} disconnect() { observer = undefined; } }
  window.IntersectionObserver = Observer;
  const exports = {};
  vm.runInNewContext(compiled, { exports, window, document, IntersectionObserver: Observer, performance: { now: () => now },
    setTimeout(fn, delay) { const id = ++key; timers.set(id, { fn, at: now + delay }); return id; }, clearTimeout(id) { timers.delete(id); },
    requestAnimationFrame(fn) { const id = ++key; frames.set(id, fn); return id; }, cancelAnimationFrame(id) { frames.delete(id); },
  });
  const flush = () => { for (const [id, fn] of frames) { frames.delete(id); fn(); } };
  return { root, rotator, roles, button, document, window, media, timers, frames,
    mount: () => exports.mountHeroHeadline(root),
    current: () => roles.findIndex(role => role.classes.has('is-active')),
    visible(value) { observer?.([{ target: root, isIntersecting: value }]); },
    tick(ms) {
      const end = now + ms;
      while (true) {
        const entry = [...timers].filter(([, item]) => item.at <= end).sort((a,b) => a[1].at-b[1].at)[0];
        if (!entry) break;
        now = entry[1].at; timers.delete(entry[0]); entry[1].fn(); flush();
      }
      now = end; flush();
    },
  };
}

test('headline preserves six-role choreography through 30 seconds without settling at five',()=>{const h=fixture();h.mount();h.tick(2999);assert.equal(h.current(),0);h.tick(1);assert.equal(h.current(),1);for(let i=2;i<=9;i++){h.tick(3350);assert.equal(h.current(),i%6);assert.equal(h.roles.filter(r=>r.classes.has('is-active')).length,1);}assert.equal(h.timers.size,1);});
test('offscreen, document and bfcache suspension preserve remaining dwell time',()=>{for(const kind of ['viewport','hidden','bfcache']){const h=fixture();h.mount();h.tick(1000);if(kind==='viewport')h.visible(false);if(kind==='hidden'){h.document.hidden=true;h.document.emit('visibilitychange')}if(kind==='bfcache')h.window.emit('pagehide',{persisted:true});h.tick(30000);assert.equal(h.current(),0);assert.equal(h.timers.size,0);if(kind==='viewport')h.visible(true);if(kind==='hidden'){h.document.hidden=false;h.document.emit('visibilitychange')}if(kind==='bfcache')h.window.emit('pageshow');h.tick(1999);assert.equal(h.current(),0);h.tick(1);assert.equal(h.current(),1);}});
test('reduced motion suspends role rotation and can resume without a jump',()=>{for(const reduced of [true,false]){const h=fixture(reduced);h.mount();if(!reduced){h.tick(3000);h.media.matches=true;h.media.emit('change')}const before=h.current();h.tick(30000);assert.equal(h.current(),before);assert.equal(h.timers.size,0);h.media.matches=false;h.media.emit('change');h.tick(3350);assert.notEqual(h.current(),before);}});
test('hover and focus remain independent, smooth temporary suspensions',()=>{const h=fixture();h.mount();h.tick(1000);h.rotator.emit('mouseenter');h.rotator.emit('focusin');h.tick(30000);h.rotator.emit('mouseleave');h.tick(30000);assert.equal(h.current(),0);h.rotator.emit('focusout');h.tick(1999);assert.equal(h.current(),0);h.tick(1);assert.equal(h.current(),1);});
test('duplicate mount and normal exit clean all timers, frames and input listeners',()=>{const h=fixture(),dispose=h.mount();assert.equal(h.mount(),dispose);h.window.emit('pagehide',{persisted:false});assert.equal(h.timers.size+h.frames.size,0);assert.equal(h.rotator.listeners.size+h.window.listeners.size+h.document.listeners.size+h.media.listeners.size,0);});
