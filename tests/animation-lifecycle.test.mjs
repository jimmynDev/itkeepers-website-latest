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

function harness({ reduced = false, observerAvailable = true } = {}) {
  let now = 0;
  let id = 0;
  const timers = new Map();
  const media = target({ matches: reduced });
  const document = target({ hidden: false });
  const window = target({ matchMedia: () => media });
  const button = target({ hidden: true, textContent: '', attributes: {}, setAttribute(name, value) { this.attributes[name] = value; } });
  const visual = {
    innerHTML: '<p>Readable static example</p>', className: 'visual', style: null,
    getAttribute() { return this.style; }, setAttribute(_, value) { this.style = value; }, removeAttribute() { this.style = null; },
    getBoundingClientRect() { return {}; },
  };
  const classes = new Set();
  const root = {
    dataset: {},
    classList: { toggle(name, enabled) { if (enabled) classes.add(name); else classes.delete(name); } },
    querySelector(selector) { return selector === '[data-animation-toggle]' ? button : visual; },
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
    root, button, visual, classes, document, window, media, timers,
    mount: factory => exports.mountAnimation(root, factory),
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

test('waits for visibility, completes one sequence, and cancels all work', () => {
  const h = harness(); const events = [];
  sequence(h, events); h.tick(2000);
  assert.deepEqual(events, []);
  assert.equal(h.button.hidden, true);
  h.visible(); h.tick(1000);
  assert.deepEqual(events, ['play', 'step', 'nested', 'settle']);
  assert.equal(h.root.dataset.animationState, 'settled');
  assert.equal(h.classes.has('is-idle'), true);
  assert.equal(h.button.hidden, true);
  assert.equal(h.timers.size, 0);
  h.visible(false); h.visible(); h.tick(2000);
  assert.equal(events.filter(value => value === 'play').length, 1);
});

test('offscreen and hidden document pauses preserve time remaining, including nested tasks', () => {
  const h = harness(); const events = [];
  sequence(h, events); h.visible(); h.tick(250); h.visible(false); h.tick(5000);
  assert.deepEqual(events, ['play']);
  assert.equal(h.timers.size, 0);
  h.visible(); h.tick(149); assert.deepEqual(events, ['play']);
  h.tick(1); assert.deepEqual(events, ['play', 'step']);
  h.tick(50); h.document.hidden = true; h.document.emit('visibilitychange'); h.tick(5000);
  assert.deepEqual(events, ['play', 'step']);
  h.document.hidden = false; h.document.emit('visibilitychange'); h.tick(50);
  assert.deepEqual(events, ['play', 'step', 'nested']);
  h.tick(500); assert.equal(events.at(-1), 'settle');
});

test('user pause persists through viewport and visibility events until explicit resume', () => {
  const h = harness(); const events = [];
  sequence(h, events); h.visible(); h.tick(200); h.button.emit('click');
  assert.equal(h.button.textContent, 'Resume animation');
  assert.equal(h.root.dataset.animationState, 'paused');
  h.visible(false); h.visible(); h.document.emit('visibilitychange'); h.tick(5000);
  assert.deepEqual(events, ['play']);
  h.button.emit('click'); assert.equal(h.button.textContent, 'Pause animation');
  h.tick(200); assert.deepEqual(events, ['play', 'step']);
});

test('initial reduced motion and missing observer show final state with no motion', () => {
  for (const options of [{ reduced: true }, { observerAvailable: false }]) {
    const h = harness(options); const events = [];
    sequence(h, events); h.visible(); h.tick(5000);
    assert.deepEqual(events, ['settle']);
    assert.match(h.visual.innerHTML, /Meaningful final/);
    assert.equal(h.timers.size, 0);
    assert.equal(h.root.dataset.animationState, 'settled');
  }
});

test('changing reduced motion stops an active timeline permanently', () => {
  const h = harness(); const events = [];
  sequence(h, events); h.visible(); h.tick(200);
  h.media.matches = true; h.media.emit('change');
  h.media.matches = false; h.media.emit('change'); h.tick(2000);
  assert.deepEqual(events, ['play', 'settle']);
  assert.equal(h.timers.size, 0);
});

test('bfcache pauses/resumes remaining work; normal page exit removes timers and listeners', () => {
  const h = harness(); const events = [];
  sequence(h, events); h.visible(); h.tick(200);
  h.window.emit('pagehide', { persisted: true }); h.tick(5000);
  assert.deepEqual(events, ['play']);
  h.window.emit('pageshow', { persisted: true }); h.tick(200);
  assert.deepEqual(events, ['play', 'step']);
  h.window.emit('pagehide', { persisted: false }); h.tick(5000);
  assert.deepEqual(events, ['play', 'step', 'settle']);
  assert.equal(h.timers.size, 0);
  assert.equal(h.window.listenerCount() + h.document.listenerCount() + h.media.listenerCount() + h.button.listenerCount(), 0);
});

test('duplicate mounts do not initialize or schedule twice', () => {
  const h = harness(); const events = [];
  const dispose = sequence(h, events);
  assert.equal(h.mount(() => { throw new Error('must not run'); }), dispose);
  h.visible(); h.tick(1000);
  assert.deepEqual(events, ['play', 'step', 'nested', 'settle']);
});

test('completion preserves the focused pause button as an inert named control', () => {
  const h = harness(); const events = [];
  sequence(h, events); h.visible(); h.document.activeElement = h.button;
  h.tick(1000);
  assert.equal(h.document.activeElement, h.button);
  assert.equal(h.button.hidden, false);
  assert.equal(h.button.textContent, 'Animation complete');
  assert.equal(h.button.attributes['aria-disabled'], 'true');
  h.button.emit('click'); h.tick(1000);
  assert.deepEqual(events, ['play', 'step', 'nested', 'settle']);
  assert.equal(h.button.textContent, 'Animation complete');
  assert.equal(h.timers.size, 0);
});

test('factory, playback, timer and settling errors restore the readable static visual', () => {
  for (const stage of ['factory', 'play', 'timer', 'settle']) {
    const h = harness();
    h.mount(({ later }) => {
      h.visual.innerHTML = '';
      if (stage === 'factory') throw new Error(stage);
      return {
        duration: 1000,
        play() { if (stage === 'play') throw new Error(stage); later(() => { if (stage === 'timer') throw new Error(stage); }, 200); },
        settle() { throw new Error(stage); },
      };
    });
    h.visible(); h.tick(2000);
    assert.match(h.visual.innerHTML, /Readable static/);
    assert.equal(h.root.dataset.animationEnhanced, undefined);
    assert.equal(h.root.dataset.animationState, 'settled');
    assert.equal(h.timers.size, 0);
  }
});

test('meaningful entry and spatial exit hysteresis prevent edge-jitter replays', () => {
  const h = harness(); const events = [];
  sequence(h, events);
  h.boundary('0px', true); h.tick(2000);
  assert.deepEqual(events, []);
  h.boundary('-96px 0px', true); h.tick(1000);
  for (let i = 0; i < 6; i++) { h.visible(false); h.visible(); h.tick(2000); }
  assert.equal(events.filter(x => x === 'play').length, 1);
  h.leave(); h.boundary('0px', true); h.tick(2000);
  assert.equal(events.filter(x => x === 'play').length, 1);
  h.boundary('-96px 0px', true); h.tick(1000);
  assert.equal(events.filter(x => x === 'play').length, 2);
  assert.equal(h.timers.size, 0);
});

test('repeated real exits restore pristine markup and rebind once without growing timers or listeners', () => {
  const h = harness(); let factories = 0; let plays = 0;
  h.mount(({ later }) => {
    factories++;
    assert.equal(h.visual.innerHTML, '<p>Readable static example</p>');
    h.visual.innerHTML += '<i>one generated overlay</i>';
    return { duration: 1000, play() { plays++; later(() => {}, 500); }, settle() { h.visual.innerHTML = 'final'; } };
  });
  const listeners = h.window.listenerCount() + h.document.listenerCount() + h.button.listenerCount();
  for (let i = 0; i < 8; i++) {
    h.visible(); h.tick(1000);
    assert.equal(h.visual.innerHTML, 'final');
    assert.equal(h.timers.size, 0);
    assert.equal(plays, i + 1);
    assert.equal(factories, i + 1);
    h.leave(); h.tick(2000);
  }
  assert.equal(h.window.listenerCount() + h.document.listenerCount() + h.button.listenerCount(), listeners);
});

test('a real exit cancels the interrupted sequence on replay; shallow exits resume it', () => {
  const h = harness(); const events = [];
  sequence(h, events); h.visible(); h.tick(250); h.leave(); h.tick(5000);
  assert.equal(h.timers.size, 0);
  h.visible(); h.tick(399);
  assert.deepEqual(events, ['play', 'play']);
  h.tick(601);
  assert.deepEqual(events, ['play', 'play', 'step', 'nested', 'settle']);
  assert.equal(h.timers.size, 0);
});

test('reduced motion disables replay after a settled or interrupted exit', () => {
  for (const duration of [200, 1000]) {
    const h = harness(); const events = [];
    sequence(h, events); h.visible(); h.tick(duration); h.leave();
    h.media.matches = true; h.media.emit('change');
    h.media.matches = false; h.media.emit('change');
    for (let i = 0; i < 3; i++) { h.visible(); h.tick(2000); h.leave(); }
    assert.equal(events.filter(x => x === 'play').length, 1);
    assert.equal(h.root.dataset.animationState, 'settled');
    assert.equal(h.timers.size, 0);
  }
});
