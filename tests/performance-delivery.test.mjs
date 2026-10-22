import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';

function htmlFiles(path = 'dist') {
  return readdirSync(path, { withFileTypes: true }).flatMap(entry => entry.isDirectory()
    ? htmlFiles(`${path}/${entry.name}`) : entry.name.endsWith('.html') ? [`${path}/${entry.name}`] : []);
}

test('shared CSS delivery uses content-addressed bundles without changing page or service scope', () => {
  const bundles = new Set();
  for (const file of htmlFiles()) {
    const html = readFileSync(file, 'utf8');
    const links = [...html.matchAll(/<link rel="stylesheet" href="(\/styles\/site-([a-f0-9]{12})\.css)"/g)];
    assert.equal(links.length, 1, file);
    const [, path, hash] = links[0];
    const css = readFileSync(`dist${path}`, 'utf8');
    assert.equal(createHash('sha256').update(css).digest('hex').slice(0, 12), hash);
    assert.ok(css.includes('--itk-brand-cyan'));
    assert.ok(css.includes('prefers-reduced-motion'));
    assert.ok(css.includes('forced-colors'));
    assert.equal(css.includes('view-transition-name:services-theme'), file === 'dist/index.html');
    bundles.add(path);
    assert.ok(!html.includes('href="/style.css"'), 'no duplicate shared CSS fetch');
  }
  assert.equal(bundles.size, 2, 'separate home and inner-page cascade');
});

test('responsive logo reserves its original aspect ratio; immutable caching excludes HTML and mutable public artwork', () => {
  const html = readFileSync('dist/index.html', 'utf8');
  const logos = [...html.matchAll(/<img\b[^>]*srcset="[^"]+192w, [^"]+384w"[^>]*>/g)];
  assert.equal(logos.length, 2);
  for (const [tag] of logos) {
    assert.match(tag, /width="1747" height="289"/);
    assert.match(tag, /alt="ITKeepers"/);
  }
  const headers = readFileSync('dist/_headers', 'utf8');
  const immutable = headers.split(/\r?\n\r?\n/).filter(block => block.includes('immutable'));
  assert.equal(immutable.length, 2);
  assert.ok(immutable.every(block => /(?:\/_astro\/\*|\/styles\/site-\*\.css)/.test(block)));
  assert.ok(immutable.every(block => !block.split(/\r?\n/).some(line => line.trim() === '/*')));
});
