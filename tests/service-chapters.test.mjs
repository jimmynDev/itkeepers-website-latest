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
    emit(name, props = {}) { for (const fn of listeners.get(name) ?? []) fn(props); },
  });
}
function harness(reduced = false) {
  let now = 0, id = 0;
  const timers = new Map(), observers = [];
  const media = target({ matches: reduced }), document = target({ hidden: false });
  const window = target({ matchMedia: () => media });
  class Observer {
    constructor(callback, options) { this.callback = callback; this.margin = options.rootMargin; observers.push(this); }
    observe(root) { this.root = root; this.connected = true; }
    disconnect() { this.connected = false; }
  }
  window.IntersectionObserver = Observer;
  const exports = {};
  vm.runInNewContext(compiled, { exports, window, document, IntersectionObserver: Observer, performance: { now: () => now },
    setTimeout(fn, delay) { timers.set(++id, { fn, at: now + delay }); return id; }, clearTimeout(key) { timers.delete(key); },
  });
  const roots = Array.from({ length: 5 }, () => {
    const visual = { innerHTML: 'initial', className: '', getAttribute: () => null, removeAttribute() {}, getBoundingClientRect() {} };
    const root = { dataset: {}, classList: { toggle() {} }, querySelector: selector => selector === '[data-animation-visual]' ? visual : null };
    const events = [];
    const factory = ({ later }) => ({ duration: 1000, play() { events.push('play'); later(() => { events.push('step'); visual.innerHTML = 'step'; }, 400); }, settle() { events.push('settle'); visual.innerHTML = 'complete'; } });
    const dispose = exports.mountAnimation(root, factory);
    return { root, visual, events, factory, dispose };
  });
  const boundary = (index, margin, value) => { for (const o of observers) if (o.root === roots[index].root && o.margin === margin && o.connected) o.callback([{ target: o.root, isIntersecting: value }]); };
  return { roots, timers, document, exports, boundary,
    enter(index) { boundary(index, '0px', true); boundary(index, '-96px 0px', true); boundary(index, '160px 0px', true); },
    leave(index) { boundary(index, '0px', false); boundary(index, '-96px 0px', false); boundary(index, '160px 0px', false); },
    tick(amount) { const end = now + amount; while (true) { const next = [...timers].filter(([, x]) => x.at <= end).sort((a,b) => a[1].at-b[1].at)[0]; if (!next) break; now = next[1].at; timers.delete(next[0]); next[1].fn(); } now = end; },
  };
}
test('all five chapters are in initial homepage HTML without selector or hidden panels', () => {
  const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  const headings = [...html.matchAll(/<h2 id="service-([^"]+)-title">([\s\S]*?)<\/h2>/g)].map(x => [x[1], x[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()]);
  assert.deepEqual(headings, [['managed','Managed IT Services'],['cloud','Microsoft 365 &amp; Cloud'],['security','Cybersecurity'],['networking','Networking &amp; Infrastructure'],['ai','AI &amp; Automation']]);
  assert.doesNotMatch(html, /role="(?:tablist|tab|tabpanel)"|data-services-stage|all-services-index|service-directory/);
  assert.equal((html.match(/class="service-story(?: |")/g) ?? []).length, 5);
  assert.ok(html.indexOf('hero-tenets') < html.indexOf('id="services/managed"'));
  assert.ok(html.indexOf('id="services/ai"') < html.indexOf('id="offering-web-design-hosting"'));
});
test('five roots share the lifecycle module but trigger and settle independently', () => {
  const h = harness(); assert.equal(h.timers.size, 0);
  h.enter(0); h.enter(2); h.tick(1000);
  for (const i of [0,2]) { assert.deepEqual(h.roots[i].events, ['play','step','settle']); assert.equal(h.roots[i].visual.innerHTML,'complete'); }
  for (const i of [1,3,4]) assert.deepEqual(h.roots[i].events, []);
  assert.equal(h.timers.size,0);
  h.enter(4); h.tick(1000); assert.deepEqual(h.roots[4].events,['play','step','settle']);
});
test('offscreen pause, threshold jitter and genuine re-entry are isolated per chapter', () => {
  const h = harness(); h.enter(0); h.tick(200);
  h.boundary(0,'0px',false); h.boundary(0,'-96px 0px',false);
  h.enter(1); h.tick(1000); assert.deepEqual(h.roots[0].events,['play']);
  h.enter(0); h.tick(200); assert.deepEqual(h.roots[0].events,['play','step']);
  h.leave(0); assert.equal(h.timers.size,0); h.enter(0);
  assert.equal(h.roots[0].visual.innerHTML,'initial'); h.tick(1000);
  assert.deepEqual(h.roots[0].events,['play','step','play','step','settle']);
  assert.deepEqual(h.roots[1].events,['play','step','settle']);
});
test('reduced motion settles all five roots immediately without any timers', () => {
  const h=harness(true);
  for(const {root,visual,events} of h.roots){assert.equal(root.dataset.animationState,'settled');assert.equal(visual.innerHTML,'complete');assert.deepEqual(events,['settle']);}
  assert.equal(h.timers.size,0);
});
test('repeat mounting and disposal do not duplicate or cancel another chapter timers', () => {
  const h=harness();const first=h.roots[0];assert.equal(h.exports.mountAnimation(first.root,first.factory),first.dispose);
  h.enter(0);h.enter(1);first.dispose();h.tick(1000);
  assert.deepEqual(first.events,['play','settle']);assert.deepEqual(h.roots[1].events,['play','step','settle']);assert.equal(h.timers.size,0);
});
