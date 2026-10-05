import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

// Run the actual Home browser module after npm run build, with controlled input
// events and animation frames. These are logic checks, not browser/device QA.
const html = readFileSync('dist/index.html', 'utf8');
const sources = [...html.matchAll(/<script\b[^>]*src="([^"]+)"[^>]*>/g)].map(match => match[1]);
const script = sources.map(src => readFileSync(`dist${src}`, 'utf8')).find(text => text.includes('home-pointer-light'));
assert.ok(script, 'Run the integrated motion build before these tests');

function eventTarget() {
  const callbacks = new Map();
  return {
    addEventListener(name, callback) { callbacks.set(name, [...(callbacks.get(name) ?? []), callback]); },
    emit(name, event = {}) { for (const callback of callbacks.get(name) ?? []) callback(event); }
  };
}
function fixture({ matches = true, hasPage = true, hasWash = true } = {}) {
  const wash = { style: {}, dataset: {} };
  const classes = new Set();
  const page = { ...eventTarget(), classList: { add: name => classes.add(name) }, querySelector: () => hasWash ? wash : null };
  const media = { ...eventTarget(), matches };
  const document = { ...eventTarget(), hidden: false, querySelector: () => hasPage ? page : null };
  const window = eventTarget();
  const frames = new Map();
  let frameId = 0;
  let mediaQueries = 0;
  const context = {
    document, innerWidth: 1440, innerHeight: 900,
    matchMedia(query) { mediaQueries++; assert.ok(query.includes('prefers-reduced-motion: no-preference')); assert.ok(query.includes('pointer: fine')); assert.ok(query.includes('hover: hover')); return media; },
    addEventListener: window.addEventListener,
    requestAnimationFrame(callback) { const id = ++frameId; frames.set(id, callback); return id; }
  };
  runInNewContext(script, context);
  return {
    wash, page, media, document, window, classes, frames,
    mediaQueries: () => mediaQueries,
    move(x, y, { pointerType = 'mouse', tone, service } = {}) {
      page.emit('pointermove', { pointerType, clientX: x, clientY: y, target: { closest: selector => selector === '.service-story' ? service ?? null : tone ? { dataset: { light: tone } } : null } });
    },
    flush() { const pending = [...frames.values()]; frames.clear(); for (const callback of pending) callback(); }
  };
}

test('rapid pointer events batch into one frame and draw the latest coordinates', () => {
  const flow = fixture();
  assert.ok(flow.classes.has('home-motion-ready'));
  flow.move(100, 200); flow.move(200, 300); flow.move(810, 640, { tone: 'blue' });
  assert.equal(flow.frames.size, 1);
  assert.equal(flow.wash.style.opacity, undefined, 'No writes before scheduled frame');
  flow.flush();
  assert.equal(flow.wash.style.transform, 'translate3d(310px, 140px, 0)');
  assert.equal(flow.wash.style.opacity, '1');
  assert.equal(flow.wash.dataset.tone, 'blue');
  flow.move(500, 500); assert.equal(flow.frames.size, 1); flow.flush();
  assert.equal(flow.wash.dataset.tone, 'cyan', 'No section tone falls back to cyan');
});

test('service light follows local coordinates and clears the previous section and stop state', () => {
  const flow = fixture();
  const section = () => ({ style: { setProperty(key, value) { this[key] = value; }, removeProperty(key) { delete this[key]; } }, getBoundingClientRect: () => ({ left:60, top:100 }) });
  const first = section(), second = section();
  flow.move(180, 300, { service:first }); flow.flush();
  assert.equal(first.style['--service-pointer-x'], '120px');
  assert.equal(first.style['--service-pointer-y'], '200px');
  assert.equal(first.style['--service-pointer-visible'], '1');
  flow.move(400, 400, { service:second }); flow.flush();
  assert.equal(first.style['--service-pointer-visible'], undefined);
  assert.equal(second.style['--service-pointer-visible'], '1');
  flow.page.emit('pointerleave'); flow.flush();
  assert.equal(second.style['--service-pointer-visible'], undefined);
});

test('leave, blur and hidden document clear light even with a pointer frame pending', () => {
  for (const stop of [flow => flow.page.emit('pointerleave'), flow => flow.window.emit('blur'), flow => { flow.document.hidden = true; flow.document.emit('visibilitychange'); }]) {
    const flow = fixture();
    flow.move(800, 400); stop(flow);
    assert.equal(flow.frames.size, 1, 'Stop reuses the pending frame');
    flow.flush(); assert.equal(flow.wash.style.opacity, '0');
    flow.document.hidden = false;
    flow.move(820, 420); flow.flush(); assert.equal(flow.wash.style.opacity, '1');
  }
});

test('visibility change while visible does not interrupt a legitimate pointer frame', () => {
  const flow = fixture(); flow.move(720, 450); flow.document.emit('visibilitychange');
  flow.flush(); assert.equal(flow.wash.style.opacity, '1');
});

test('touch and pen do not schedule light frames or override mouse position', () => {
  const flow = fixture();
  flow.move(100, 100, { pointerType: 'touch' }); flow.move(200, 200, { pointerType: 'pen' });
  assert.equal(flow.frames.size, 0);
  flow.move(700, 600); flow.move(950, 850, { pointerType: 'touch' }); flow.flush();
  assert.equal(flow.wash.style.transform, 'translate3d(200px, 100px, 0)');
});

test('static media fallback stays inactive; media change clears active light and allows later mouse input', () => {
  const staticFlow = fixture({ matches: false });
  assert.ok(!staticFlow.classes.has('home-motion-ready'));
  staticFlow.move(500, 500); assert.equal(staticFlow.frames.size, 0);
  const flow = fixture(); flow.move(900, 500); flow.flush();
  flow.media.matches = false; flow.media.emit('change'); flow.flush();
  assert.equal(flow.wash.style.opacity, '0');
  flow.move(1000, 600); assert.equal(flow.frames.size, 0);
  flow.media.matches = true; flow.media.emit('change'); flow.flush();
  assert.equal(flow.wash.style.opacity, '0', 'Preference change alone does not activate the light');
  flow.move(1000, 600); flow.flush(); assert.equal(flow.wash.style.opacity, '1');
});

test('missing Home root or light returns without media initialization', () => {
  for (const options of [{ hasPage: false }, { hasWash: false }]) {
    const flow = fixture(options);
    assert.equal(flow.mediaQueries(), 0); assert.equal(flow.frames.size, 0);
    assert.equal(flow.classes.size, 0);
  }
});

test('initial HTML contains the Home explanations without a script-added motion class', () => {
  assert.ok(html.includes('home-pointer-light'));
  assert.ok(html.includes('aria-hidden="true"'));
  assert.ok(!/<(?:main|body)\b[^>]*class="[^"]*home-motion-ready/.test(html));
  assert.ok(html.includes('Your IT person'));
  assert.ok(html.includes('Not every incident needs escalation.'));
  assert.equal((html.match(/<article\b[^>]*data-step-panel/g) ?? []).length, 5);
});
