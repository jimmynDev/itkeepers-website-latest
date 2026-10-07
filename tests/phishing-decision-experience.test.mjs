import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const compile = path => ts.transpileModule(read(path), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
const compiled = compile('src/scripts/phishing-decision-experience.ts');
const dataExports = {};
vm.runInNewContext(compile('src/data/phishing-scenarios.ts'), { exports: dataExports });
const scenarios = dataExports.phishingScenarios;

function element(document, dataset = {}, hidden = false) {
  const attrs = new Map(), listeners = new Map();
  return {
    dataset, hidden, inert: hidden, textContent: '',
    setAttribute(name, value) { attrs.set(name, value); },
    removeAttribute(name) { attrs.delete(name); },
    getAttribute(name) { return attrs.get(name); },
    addEventListener(name, handler) { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(handler); },
    removeEventListener(name, handler) { listeners.get(name)?.delete(handler); },
    click() { for (const handler of listeners.get('click') ?? []) handler(); },
    emit(name) { for (const handler of listeners.get(name) ?? []) handler(); },
    focus(options) { document.activeElement = this; this.focusOptions = options; },
    count(name) { return listeners.get(name)?.size ?? 0; }
  };
}
function fixture(document, animations) {
  const root = element(document), fallback = element(document), announcement = element(document);
  const progress = element(document, {}, true), count = element(document), segments = scenarios.map(() => element(document));
  const steps = scenarios.map((scenario, index) => {
    const panel = element(document, {}, true), heading = element(document);
    const options = scenario.options.map(option => element(document, { decisionOption: option.id }));
    const feedback = scenario.options.map(option => {
      const panel = element(document, { decisionExplanation: option.id, decisionIndex: String(index) }, true);
      const next = element(document), copy = Object.assign(element(document), { textContent: option.explanation });
      panel.querySelector = selector => ({ '[data-decision-next]': next, '[data-decision-feedback]': copy })[selector];
      return { panel, next, copy };
    });
    panel.querySelector = () => heading;
    panel.querySelectorAll = () => options;
    return { panel, heading, options, feedback };
  });
  const final = element(document, {}, true), finalHeading = element(document), restart = element(document);
  final.querySelector = () => finalHeading;
  root.querySelector = selector => ({ '[data-decision-fallback]': fallback, '[data-decision-progress]': progress, '[data-decision-count]': count, '[data-decision-final]': final, '[data-decision-restart]': restart, '[data-decision-announcement]': announcement })[selector];
  root.querySelectorAll = selector => ({ '[data-decision-segment]': segments, '[data-decision-scenario]': steps.map(step => step.panel), '[data-decision-explanation]': steps.flatMap(step => step.feedback.map(view => view.panel)) })[selector];
  for (const panel of [...steps.map(step => step.panel), ...steps.flatMap(step => step.feedback.map(view => view.panel)), final]) {
    panel.animate = (frames, timing) => {
      let resolve, reject;
      const animation = { frames, timing, finished: new Promise((ok, error) => { resolve = ok; reject = error; }), finish: () => resolve(), cancel: () => { animation.cancelled = true; reject(new Error('cancelled')); } };
      animations.push(animation); return animation;
    };
  }
  return { root, fallback, announcement, progress, count, segments, steps, final, finalHeading, restart };
}
function harness(count = 1, reduced = true) {
  const document = element(null), animations = [], motion = Object.assign(element(null), { matches: reduced });
  const instances = Array.from({ length: count }, () => fixture(document, animations));
  const exports = {}, forbidden = () => { throw new Error('Automatic progression or storage is forbidden'); };
  vm.runInNewContext(compiled, { exports, document, window: { matchMedia: () => motion }, setTimeout: forbidden, setInterval: forbidden, localStorage: { getItem: forbidden, setItem: forbidden } });
  return { document, animations, motion, instances, initialize: () => exports.initializePhishingExperiences({ querySelectorAll: () => instances.map(instance => instance.root) }) };
}
function complete(flow, choice = 0) { for (const step of flow.steps) { step.options[choice].click(); step.feedback[choice].next.click(); } }

 test('four fictional scenarios cover accounts, payments, file shares and executive urgency without verdicts', () => {
  assert.equal(scenarios.length, 4);
  assert.deepEqual(Array.from(scenarios, scenario => scenario.id), ['account', 'invoice', 'shared-file', 'executive']);
  for (const scenario of scenarios) {
    assert.match(scenario.address, /\.example$/);
    assert.equal(scenario.options.length, 3);
    assert.equal(new Set(scenario.options.map(option => option.id)).size, 3);
    assert.ok(scenario.checks.length >= 1 && scenario.checks.length <= 2);
    for (const option of scenario.options) { assert.ok(option.response.length > 10); assert.ok(option.explanation.length > 60); }
    assert.equal(scenario.preferredAction, undefined);
  }
  assert.ok(scenarios[2].options.some(option => /does not establish whether it is safe/.test(option.explanation)));
});

test('choice replaces decision with its explanation; only explicit Continue advances progress', () => {
  const h = harness(), flow = h.instances[0]; h.initialize();
  assert.equal(flow.fallback.hidden, true); assert.equal(flow.progress.hidden, false);
  for (const [index, step] of flow.steps.entries()) {
    step.feedback[1].next.click(); assert.equal(step.panel.hidden, false, 'Inactive Continue cannot advance');
    step.options[1].focus(); step.options[1].click();
    assert.equal(step.panel.hidden, true); assert.equal(step.panel.inert, true);
    assert.equal(step.feedback[1].panel.hidden, false);
    assert.equal(h.document.activeElement, step.feedback[1].next);
    assert.equal(h.document.activeElement.focusOptions.preventScroll, true);
    assert.equal(flow.root.dataset.decisionPhase, 'explanation');
    assert.equal(flow.announcement.textContent, scenarios[index].options[1].explanation);
    assert.equal(flow.count.textContent, `0${index + 1} / 04`);
    step.options[2].click(); assert.equal(step.feedback[2].panel.hidden, true, 'Retired options cannot change the explanation');
    step.feedback[0].next.click(); assert.equal(step.feedback[1].panel.hidden, false, 'Inactive feedback cannot advance');
    step.feedback[1].next.click();
    assert.equal(step.feedback[1].panel.hidden, true);
    assert.equal(h.document.activeElement, index === 3 ? flow.finalHeading : flow.steps[index + 1].heading);
    assert.equal(h.document.activeElement.focusOptions.preventScroll, true);
  }
  assert.equal(flow.final.hidden, false); assert.equal(flow.root.dataset.decisionPhase, 'final');
  assert.ok(flow.segments.every(segment => segment.dataset.active === 'true'));
  assert.match(flow.announcement.textContent, /Your IT person is a team/);
});

test('all twelve choices reach their own calm feedback, then the shared final takeaway', () => {
  for (let choice = 0; choice < 3; choice++) {
    const h = harness(), flow = h.instances[0]; h.initialize(); complete(flow, choice);
    assert.equal(flow.final.hidden, false);
    assert.ok(flow.steps.every(step => step.options[choice].getAttribute('aria-pressed') === 'true'));
  }
});

test('restart clears selection and progress without scrolling or dumping focus', () => {
  const h = harness(), flow = h.instances[0]; h.initialize(); complete(flow); flow.restart.click();
  assert.equal(flow.final.hidden, true); assert.equal(flow.steps[0].panel.hidden, false);
  assert.equal(h.document.activeElement, flow.steps[0].heading);
  assert.equal(flow.count.textContent, '01 / 04');
  assert.ok(flow.steps.every(step => step.options.every(option => option.getAttribute('aria-pressed') === 'false')));
  assert.ok(flow.steps.every(step => step.feedback.every(view => view.panel.hidden && view.panel.inert)));
});

test('initialization is idempotent; separate instances and offscreen reentry preserve state', () => {
  const h = harness(2), [first, second] = h.instances; h.initialize();
  first.steps[0].options[0].click(); h.initialize();
  assert.equal(first.steps[0].feedback[0].panel.hidden, false); assert.equal(second.steps[0].panel.hidden, false);
  assert.equal(first.steps[0].options[0].count('click'), 1); assert.equal(first.steps[0].feedback[0].next.count('click'), 1);
});

test('normal transitions crossfade 8px and retire inactive content; rapid explicit navigation settles prior motion', async () => {
  const h = harness(1, false), flow = h.instances[0]; h.initialize();
  flow.steps[0].options[0].click();
  assert.equal(h.animations.length, 2);
  assert.equal(h.animations[0].timing.duration, 380);
  assert.equal(h.animations[0].frames[1].transform, 'translateY(-8px)');
  assert.equal(h.animations[1].frames[0].transform, 'translateY(8px)');
  assert.equal(flow.steps[0].panel.inert, true);
  flow.steps[0].feedback[0].next.click();
  assert.ok(h.animations.slice(0, 2).every(animation => animation.cancelled));
  assert.equal(flow.steps[0].panel.hidden, true);
  h.animations.slice(2).forEach(animation => animation.finish());
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(flow.steps[0].feedback[0].panel.hidden, true); assert.equal(flow.steps[1].panel.hidden, false);
});

test('live reduced-motion preference immediately settles current state without advancing it', () => {
  const h = harness(1, false), flow = h.instances[0]; h.initialize(); flow.steps[0].options[0].click();
  h.motion.matches = true; h.motion.emit('change');
  assert.equal(flow.steps[0].panel.hidden, true); assert.equal(flow.steps[0].feedback[0].panel.hidden, false);
  assert.equal(flow.root.dataset.decisionPhase, 'explanation');
  flow.steps[0].feedback[0].next.click(); assert.equal(h.animations.length, 2);
});

test('incomplete markup keeps static fallback and installs no handlers', () => {
  const h = harness(), flow = h.instances[0], query = flow.root.querySelector;
  flow.root.querySelector = selector => selector === '[data-decision-restart]' ? null : query(selector);
  h.initialize(); assert.equal(flow.fallback.hidden, false); assert.equal(flow.progress.hidden, true);
  assert.equal(flow.steps[0].options[0].count('click'), 0);
});

test('navigation cleanup cancels motion and removes control and media listeners', () => {
  const h = harness(1, false), flow = h.instances[0]; h.initialize(); flow.steps[0].options[0].click();
  h.document.emit('astro:before-swap');
  assert.ok(h.animations.every(animation => animation.cancelled));
  assert.equal(flow.steps[0].options[0].count('click'), 0); assert.equal(flow.restart.count('click'), 0);
  assert.equal(h.motion.count('change'), 0); assert.equal(h.document.count('astro:before-swap'), 0);
});

test('production markup provides a shared intrinsic stage, native controls and fallback without pressure mechanics', () => {
  const component = read('src/components/PhishingDecisionExperience.astro');
  const content = component + read('src/data/phishing-scenarios.ts') + read('src/scripts/phishing-decision-experience.ts');
  assert.doesNotMatch(content, /localStorage|sessionStorage|setTimeout|setInterval|countdown|high.?score|streak|confetti|leaderboard|\bquiz\b|\bgame\b|\bpoints\b|\bwrong\b|incorrect|you failed|bad choice|mountAnimation|onclick=|fetch\(/i);
  assert.match(component, /<button type="button" data-decision-option/);
  assert.match(component, /<fieldset[^>]*><legend>What would you do\?/);
  assert.match(component, /aria-live="polite" aria-atomic="true"/);
  assert.match(component, /grid-area:1 \/ 1/);
  assert.match(component, /decision-panel\[hidden\] \{ visibility:hidden/);
  assert.match(component, /Pause\. Check the context\. Involve your team\./);
  assert.match(component, /You shouldn’t have to investigate every suspicious message yourself\./);
});

test('built homepage preserves placement and testimonial infrastructure with four decisions and twelve explanations', () => {
  const html = read('dist/index.html'), start = html.indexOf('id="phishing-decisions"');
  assert.ok(start > html.indexOf('id="how-we-operate"')); assert.ok(start < html.indexOf('class="cta home-closing"'));
  assert.equal((html.match(/data-decision-scenario=/g) ?? []).length, 4);
  assert.equal((html.match(/data-decision-explanation=/g) ?? []).length, 12);
  assert.equal((html.match(/data-decision-segment /g) ?? []).length, 4);
  assert.doesNotMatch(html, /Client testimonial content is pending|Approved quote and attribution pending|CONTENT PENDING|id="client-proof"/);
  const proof = {}; vm.runInNewContext(compile('src/data/client-proof.ts'), { exports: proof });
  assert.ok(proof.videoTestimonials.every(item => !item.approved && item.sources.length === 0));
  assert.ok(proof.textTestimonials.every(item => !item.approved));
});
