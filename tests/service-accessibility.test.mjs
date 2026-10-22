import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from 'parse5';

function elements(file) {
  const found = [];
  const walk = node => { if (node.tagName) found.push({ tag: node.tagName, ...Object.fromEntries(node.attrs.map(a => [a.name, a.value])) }); for (const child of node.childNodes || []) walk(child); };
  walk(parse(readFileSync(file, 'utf8')));
  return found;
}
test('named service examples and details expose roles that support accessible names', () => {
  const inventory = [
    ['dist/services/index.html', n => n.class?.split(' ').includes('assessment-options'), 'group'],
    ['dist/services/ai-automation/index.html', n => n.id === 'ai-automation-details', 'region'],
    ['dist/services/web-design-hosting/index.html', n => n.id === 'web-design-hosting-details', 'region']
  ];
  for (const [file, find, role] of inventory) {
    const node = elements(file).find(find); assert(node, file); assert.equal(node.role, role);
    assert(node['aria-label'] || node['aria-labelledby'], 'named semantic container');
  }
});
test('all phishing decisions and explanations retain names when made visible', () => {
  const nodes = elements('dist/services/cybersecurity/index.html');
  const panels = nodes.filter(n => 'data-decision-scenario' in n || 'data-decision-explanation' in n);
  assert.equal(panels.length, 16);
  for (const panel of panels) { assert.equal(panel.role, 'group'); assert(nodes.some(n => n.id === panel['aria-labelledby']), 'label resolves'); }
  const count = nodes.find(n => 'data-decision-count' in n);
  assert.equal(count.role, 'status'); assert.equal(count['aria-live'], 'off');
  assert.equal(count['aria-label'], 'Message 1 of 4');
});
