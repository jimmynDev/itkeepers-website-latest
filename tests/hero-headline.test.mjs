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
test('six phrases retain their order with 3-second settled holds, including return', () => {
  const h = fixture(); h.mount();
  h.tick(2999); assert.equal(h.current(), 0);
  h.tick(1); assert.equal(h.current(), 1);
  for (let role = 2; role < h.roles.length; role++) { h.tick(3349); assert.equal(h.current(), role-1); h.tick(1); assert.equal(h.current(), role); }
  h.tick(3350); assert.equal(h.current(), 0);
  h.tick(3349); assert.equal(h.current(), 0);
  h.tick(1); assert.equal(h.current(), 1);
  assert.equal(h.roles.filter(x => x.classes.has('is-active')).length, 1);
  assert.equal(h.timers.size, 1);
});
test('hidden document, offscreen and bfcache preserve remaining hold without a pause control', () => {
  const h = fixture(); const dispose = h.mount(); assert.equal(h.mount(), dispose);
  h.tick(3000); assert.equal(h.current(), 1);
  assert.equal(h.button.listeners.size, 0);
  for (const [pause, resume] of [
    [() => h.visible(false), () => h.visible(true)],
    [() => { h.document.hidden = true; h.document.emit('visibilitychange'); }, () => { h.document.hidden = false; h.document.emit('visibilitychange'); }],
    [() => h.window.emit('pagehide', { persisted: true }), () => h.window.emit('pageshow')],
  ]) { pause(); h.tick(10000); assert.equal(h.current(), 1); assert.equal(h.timers.size, 0); resume(); assert.equal(h.timers.size, 1); }
  h.window.emit('pagehide', { persisted: false });
  assert.equal(h.timers.size + h.frames.size, 0);
  assert.equal(h.button.listeners.size + h.window.listeners.size + h.document.listeners.size + h.media.listeners.size, 0);
  assert.equal(h.rotator.listeners.size, 0);
  assert.ok(!h.rotator.attributes.has('tabindex'));
});
test('reduced motion swaps at 3-second intervals without reserving transition time', () => {
  const h = fixture(true); h.mount(); assert.ok(h.root.attributes.has('data-reduced'));
  h.tick(3000); assert.equal(h.current(), 1);
  h.tick(2999); assert.equal(h.current(), 1);
  h.tick(1); assert.equal(h.current(), 2);
  h.media.matches = false; h.media.emit('change'); assert.ok(!h.root.attributes.has('data-reduced'));
  h.media.matches = true; h.media.emit('change'); assert.ok(h.root.attributes.has('data-reduced'));
});
test('hover and keyboard focus independently pause and preserve the remaining hold', () => {
  const h = fixture(); h.mount();
  assert.equal(h.rotator.attributes.get('tabindex'), '0');
  h.tick(1000); h.rotator.emit('mouseenter'); h.tick(10000);
  assert.equal(h.current(), 0); assert.equal(h.timers.size, 0);
  h.rotator.emit('focusin'); h.rotator.emit('mouseleave'); h.tick(10000);
  assert.equal(h.current(), 0); assert.equal(h.timers.size, 0);
  h.rotator.emit('focusout'); h.tick(1999); assert.equal(h.current(), 0);
  h.tick(1); assert.equal(h.current(), 1);
  h.rotator.emit('mouseenter'); h.rotator.emit('focusin'); h.rotator.emit('focusout');
  h.tick(10000); assert.equal(h.current(), 1); assert.equal(h.timers.size, 0);
  h.rotator.emit('mouseleave'); h.tick(3350); assert.equal(h.current(), 2);
});
test('leaving hover cannot resume rotation while offscreen', () => {
  const h = fixture(); h.mount(); h.tick(1000); h.rotator.emit('mouseenter');
  h.visible(false); h.rotator.emit('mouseleave'); h.tick(10000);
  assert.equal(h.current(), 0); assert.equal(h.timers.size, 0);
  h.visible(true); h.tick(2000); assert.equal(h.current(), 1);
});
