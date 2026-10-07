import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('homepage has one exact semantic H1 with rotating phrases outside it', () => {
  const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  const headings = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];
  assert.equal(headings.length, 1);
  assert.equal(headings[0][1], 'Your IT person is a team.');
  assert.ok(html.indexOf('</h1>') < html.indexOf('data-hero-headline'));
  assert.match(html, /class="itk-hero-fixed"[^>]*aria-hidden="true"/);
  assert.match(html, /class="itk-hero-rotator"[^>]*aria-label="IT capabilities\. Rotation pauses while focused\."[^>]*aria-live="off"/);
  assert.doesNotMatch(html, /data-hero-headline[^>]*aria-hidden="true"/);
  for (const channel of ['og:description', 'twitter:description']) assert.match(html, new RegExp(channel + '" content="Your IT person is a team\\. Managed IT'));
  assert.doesNotMatch(html, /Explore a sample request workflow|Follow an example website/);
});

