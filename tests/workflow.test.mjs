import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

// Exercise the actual built browser module, not a second copy of its evaluator.
const scriptName = readdirSync('dist/_astro').find(name => name.startsWith('Workflow.') && name.endsWith('.js'));
assert.ok(scriptName, 'Run npm run build before this test');
const script = readFileSync(`dist/_astro/${scriptName}`, 'utf8');
const titles = ['Signal detected', 'Priority assessed', 'Engineer investigates', 'Colleague involved', 'Action and follow-up'];

function element(dataset = {}, hidden = false) {
  const attrs = new Map();
  const listeners = new Map();
  return {
    dataset, hidden, textContent: '',
    setAttribute: (name, value) => attrs.set(name, value),
    removeAttribute: name => attrs.delete(name),
    getAttribute: name => attrs.get(name),
    addEventListener(name, callback) { listeners.set(name, [...(listeners.get(name) ?? []), callback]); },
    click() { for (const callback of listeners.get('click') ?? []) callback(); }
  };
}
function fixture() {
  const panels = titles.map(stepTitle => element({ stepTitle }));
  const buttons = titles.map((_, index) => element({ step: String(index) }));
  const previous = element(), next = element(), status = element();
  const selectors = element({}, true), navigation = element({}, true);
  const root = element();
  root.querySelectorAll = name => ({ '[data-step-panel]': panels, '[data-step]': buttons })[name];
  root.querySelector = name => ({ '[data-previous]': previous, '[data-next]': next, '[data-step-status]': status, '[data-step-selectors]': selectors, '[data-step-navigation]': navigation })[name];
  return { root, panels, buttons, previous, next, status, selectors, navigation };
}
function expectStep(flow, index) {
  assert.deepEqual(flow.panels.map(panel => !panel.hidden), titles.map((_, position) => position === index));
  assert.deepEqual(flow.buttons.map(button => button.getAttribute('aria-current')), titles.map((_, position) => position === index ? 'step' : undefined));
  assert.equal(flow.previous.getAttribute('aria-disabled'), String(index === 0));
  assert.equal(flow.next.getAttribute('aria-disabled'), String(index === 4));
}
test('five-step navigation, endpoint guards, reverse and direct selection', () => {
  const flow = fixture();
  runInNewContext(script, { document: { querySelectorAll: () => [flow.root] } });
  expectStep(flow, 0);
  assert.equal(flow.selectors.hidden, false);
  assert.equal(flow.navigation.hidden, false);
  flow.previous.click(); expectStep(flow, 0);
  for (let index = 1; index < 5; index++) {
    flow.next.click(); expectStep(flow, index);
    assert.equal(flow.status.textContent, `Step ${index + 1} of 5: ${titles[index]}`);
  }
  flow.next.click(); expectStep(flow, 4);
  for (let index = 3; index >= 0; index--) { flow.previous.click(); expectStep(flow, index); }
  for (const index of [3, 1, 4, 0, 2]) { flow.buttons[index].click(); expectStep(flow, index); }
});
test('multiple instances remain independent and repeated initialization is harmless', () => {
  const first = fixture(), second = fixture();
  const context = { document: { querySelectorAll: () => [first.root, second.root] } };
  runInNewContext(script, context);
  runInNewContext(script, context);
  first.next.click(); expectStep(first, 1); expectStep(second, 0);
  second.buttons[4].click(); expectStep(first, 1); expectStep(second, 4);
});
test('missing control preserves readable noninteractive fallback', () => {
  const flow = fixture();
  const query = flow.root.querySelector;
  flow.root.querySelector = name => name === '[data-next]' ? null : query(name);
  runInNewContext(script, { document: { querySelectorAll: () => [flow.root] } });
  assert.ok(flow.panels.every(panel => !panel.hidden));
  assert.equal(flow.selectors.hidden, true);
  assert.equal(flow.navigation.hidden, true);
});
test('built pages preserve complete initial-HTML content and native disclosures', () => {
  // V3 Home consolidates the older storage example into its seven-step system.
  // The reusable five-step interaction still serves How We Work unchanged.
  for (const path of ['dist/how-we-work/index.html']) {
    const html = readFileSync(path, 'utf8');
    const panels = html.match(/<article\b[^>]*data-step-panel[^>]*>/g) ?? [];
    assert.equal(panels.length, 5);
    assert.ok(panels.every(panel => !/\bhidden\b/.test(panel)), 'All five articles visible without JS');
    assert.match(html, /<ol[^>]*data-step-selectors[^>]*hidden/);
    for (const title of titles) assert.ok(html.includes(title));
    assert.ok(html.includes('Not every incident needs escalation.'));
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    assert.ok(!html.includes('[[INPUT-PENDING:'));
  }
  const home = readFileSync('dist/index.html', 'utf8');
  const operationalSteps = home.match(/<li\b[^>]*data-process-step[^>]*>/g) ?? [];
  assert.equal(operationalSteps.length, 7);
  assert.ok(operationalSteps.every(step => !/\bhidden\b/.test(step)), 'Operational story available without JS');
  for (const title of ['Issue detected', 'Ticket created automatically', 'Engineer assigned', 'Client notified', 'Investigation', 'Resolved', 'Documented']) assert.ok(home.includes(title));
  assert.equal((home.match(/<h1\b/g) ?? []).length, 1);
  assert.ok(!home.includes('[[INPUT-PENDING:'));
  const linkedCss = html => [...html.matchAll(/href="(\/_astro\/[^" ]+\.css)"/g)].map(match => readFileSync(`dist${match[1]}`, 'utf8')).join('\n');
  assert.ok(linkedCss(home).includes('--v3-canvas'), 'Homepage editorial CSS is included in the build');
  assert.ok(!linkedCss(readFileSync('dist/how-we-work/index.html', 'utf8')).includes('--v3-canvas'), 'Editorial styles stay homepage-only');
  const overview = home.match(/<nav\b[^>]*class="service-orientation"[^>]*>([\s\S]*?)<\/nav>/);
  assert.ok(overview, 'The complete service landscape is available without JS');
  const overviewLinks = [...overview[1].matchAll(/href="#([^"]+)"/g)];
  assert.equal(overviewLinks.length, 6);
  for (const [, target] of overviewLinks) assert.ok(home.includes(`id="${target}"`), `Service target ${target} exists`);
  const security = readFileSync('dist/services/cybersecurity/index.html', 'utf8');
  const disclosureCount = (html, componentClass) => {
    const wrapper = html.match(new RegExp(`<div\\b[^>]*class="[^"]*\\b${componentClass}\\b[^"]*"[^>]*>([\\s\\S]*?)</details>\\s*</div>`));
    assert.ok(wrapper, `${componentClass} wrapper must exist`);
    return (wrapper[1].match(/<details\b/g) ?? []).length;
  };
  assert.equal(disclosureCount(home, 'daily-checks'), 3);
  assert.equal(disclosureCount(home, 'security-layers'), 5);
  assert.equal(disclosureCount(security, 'security-layers'), 5);
  for (const title of ['Identity', 'Endpoints', 'Network', 'Operations', 'Backups']) {
    assert.ok(home.includes(`<summary>${title}</summary>`));
    assert.ok(security.includes(`<summary>${title}</summary>`));
  }
});
