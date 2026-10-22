import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const source = readFileSync(new URL('../src/scripts/deferred-canvas.js', import.meta.url), 'utf8');
const deferred = source.replace('export function', 'function');
function fixture(observerAvailable = true, fail = false) {
  const events = [], root = {}; let observer;
  class Observer {
    constructor(callback, options) { this.callback = callback; assert.equal(options.rootMargin, '160px 0px'); observer = this; }
    observe(target) { assert.equal(target, root); }
    disconnect() { events.push('disconnect'); }
  }
  const context = { window: observerAvailable ? { IntersectionObserver: Observer } : {}, IntersectionObserver: Observer,
    createIsometricNetwork(target) { assert.equal(target, root); events.push('create'); if (fail) throw new Error('Canvas unavailable'); return { play() { events.push('play'); }, settle() { events.push('settle'); }, dispose() { events.push('dispose'); } }; } };
  vm.runInNewContext(deferred + ';this.make = createDeferredCanvas;', context);
  return { timeline: context.make(root, context.createIsometricNetwork), events, near(visible) { observer.callback([{ target: root, isIntersecting: visible }]); } };
}
test('offscreen network defers initialization, prepares once near viewport and preserves renderer controls', () => {
  const f = fixture(); assert.deepEqual(f.events, []); f.near(false); assert.deepEqual(f.events, []);
  f.near(true); f.near(true); assert.deepEqual(f.events, ['create']); f.timeline.play(); f.timeline.settle();
  assert.deepEqual(f.events, ['create', 'play', 'settle']); assert.equal(f.timeline.duration, 12000);
  f.timeline.dispose(); f.near(true); assert.deepEqual(f.events, ['create','play','settle','disconnect','dispose']);
});
test('reduced-motion settling and missing observer retain the original final-frame renderer', () => {
  for (const available of [true, false]) { const f = fixture(available); f.timeline.settle(); assert.deepEqual(f.events, ['create','settle']); f.timeline.dispose(); }
  const f = fixture(); f.timeline.dispose(); f.near(true); assert.deepEqual(f.events, ['disconnect']);
});

test('a near-viewport preparation failure cannot escape the observer callback', () => {
  const f = fixture(true, true); assert.doesNotThrow(() => f.near(true));
  assert.deepEqual(f.events, ['create', 'disconnect']);
  assert.throws(() => f.timeline.play(), /Canvas unavailable/); // mountAnimation owns playback/fallback failures.
});
