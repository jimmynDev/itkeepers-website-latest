import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from 'parse5';
const nodes = n => [n, ...(n.childNodes ?? []).flatMap(nodes)];
const attrs = n => Object.fromEntries((n.attrs ?? []).map(a => [a.name, a.value]));
const text = n => n.value ?? (n.childNodes ?? []).map(text).join('');
test('homepage service text uses native semantics without prohibited accessible names', () => {
  const tree = nodes(parse(readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8')));
  for (const cls of ['business-services', 'business-service-line']) {
    const element = tree.find(n => attrs(n).class?.split(/\s+/).includes(cls));
    assert.ok(element, cls + ' remains present');
    assert.equal(attrs(element)['aria-label'], undefined, 'Do not name generic/paragraph roles');
    assert.equal(attrs(element)['aria-labelledby'], undefined, 'Use visible native text');
    for (const service of ['Managed IT', 'Security', 'Cloud', 'Infrastructure', 'AI', 'Web'])
      assert.ok(text(element).includes(service), 'Keep service text: ' + service);
  }
});
