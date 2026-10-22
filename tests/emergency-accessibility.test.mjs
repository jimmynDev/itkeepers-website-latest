import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from 'parse5';

const nodes = node => [node, ...(node.childNodes ?? []).flatMap(nodes)];
const attributes = node => Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value]));
const namingText = node => attributes(node)['aria-hidden'] === 'true'
  ? '' : node.value ?? (node.childNodes ?? []).map(namingText).join('');

test('emergency call link uses its exact visible label as its native accessible name', () => {
  const document = parse(readFileSync(new URL('../dist/emergency/index.html', import.meta.url), 'utf8'));
  const matches = nodes(document).filter(node => attributes(node).class?.split(/\s+/).includes('emergency-link--primary'));
  assert.equal(matches.length, 1, 'One primary emergency call control');
  const link = matches[0];
  const attrs = attributes(link);
  assert.equal(link.tagName, 'a', 'Keep native link behavior');
  assert.equal(attrs.href, 'tel:+96181816761', 'Keep the approved telephone destination');
  assert.equal(attrs['aria-label'], undefined, 'Use the visible label rather than an overriding aria-label');
  assert.equal(attrs['aria-labelledby'], undefined, 'Do not replace the name with another element’s text');
  assert.equal(namingText(link).replace(/\s+/g, ' ').trim(), 'Call +961 81 816 761');
  const icon = nodes(link).find(node => node.tagName === 'svg');
  assert.ok(icon, 'Preserve the call icon');
  assert.equal(attributes(icon)['aria-hidden'], 'true', 'The decorative icon must not alter the name');
});
