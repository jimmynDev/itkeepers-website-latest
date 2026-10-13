import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from 'parse5';
import { clientProofRenderer } from './helpers/client-proof-render.mjs';

test('actual proof component emits no visible markup for empty, unapproved or blank content', async t => {
  const renderer = await clientProofRenderer();
  t.after(renderer.dispose);
  const visibleMarkup = html => html.replace(/<script\b[\s\S]*?<\/script>/g, '').trim();
  assert.equal(visibleMarkup(await renderer.render()), '');
  assert.equal(visibleMarkup(await renderer.render({ quotes: [
    { id: 'unapproved-test', approved: false, quote: 'TEST ONLY: withheld content.' },
    { id: 'blank-test', approved: true, quote: ' \n\t ' },
  ], videos: [{ id: 'missing-assets-test', approved: true, sources: [], captions: [] }] })), '');
  const home = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(home, /testimonial content.*pending|CONTENT PENDING/);
});

test('homepage publishes the four exact authorized excerpts and companies once, without empty media', async t => {
  const renderer = await clientProofRenderer();
  t.after(renderer.dispose);
  const expected = [
    ['Slide Designers', 'Amazing service! The team is fast, reliable, and always ready to help. They make IT simple and stress-free — highly recommended!'],
    ['PFC International SAL', 'Beyond their reliable support, ITKeepers has played a key role in integrating advanced AI tools into our systems, significantly boosting our efficiency and productivity.'],
    ['International Maritime Academy', "The team is professional, responsive, and always ready to support with tailored solutions. I've appreciated the smooth communication and the consistency in delivering what we need."],
    ['MSAD — Customs Clearance Agency', 'Their swift response to any emergency - even to the slightest issue - proves how professional and dedicated the team is.'],
  ];
  const data = renderer.api.textTestimonials;
  assert.deepEqual(data.map(item => [item.attribution.company,item.quote]), expected);
  assert.ok(data.every(item => item.approved === true && item.excerpt === true && item.attribution.publicationApproved === true));
  assert.ok(data.every(item => !item.attribution.name && !item.attribution.role));
  const home = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  const matches = (node,predicate) => [ ...(predicate(node) ? [node] : []), ...(node.childNodes ?? []).flatMap(child => matches(child,predicate)) ];
  const proof = matches(parse(home), n => n.tagName === 'section' && n.attrs.some(a => a.name === 'id' && a.value === 'client-proof'));
  assert.equal(proof.length, 1);
  const text = node => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join('');
  const quotes = matches(proof[0], n => n.tagName === 'blockquote');
  assert.deepEqual(quotes.map(n => [text(n.childNodes.find(c => c.tagName === 'cite')),text(n.childNodes.find(c => c.tagName === 'p'))]),expected);
  assert.equal(quotes.filter(n => n.attrs.some(a => a.name === 'aria-hidden' && a.value === 'false')).length,1);
  assert.equal(quotes.filter(n => n.attrs.some(a => a.name === 'inert')).length,3);
  assert.doesNotMatch(home,/proof-text-grid|proof-text-slot/);
  assert.match(home,/Clients, in their words\./);
  assert.equal(matches(proof[0],n => ['video','figure','img'].includes(n.tagName)).length,0);
  assert.ok(home.indexOf('id="client-proof"') > home.indexOf('id="records-advice"'));
  assert.ok(home.indexOf('id="client-proof"') < home.indexOf('class="cta home-closing"'));
});

test('proof preserves complete literal quotes and withholds attribution without separate permission', async t => {
  const renderer = await clientProofRenderer();
  t.after(renderer.dispose);
  const quote = 'TEST ONLY: “Exact punctuation.”\nSecond line — <literal> & final sentence.';
  const item = { id: 'literal-test', approved: true, quote, attribution: { name: 'TEST ONLY NAME', role: 'TEST ONLY ROLE', company: 'TEST ONLY COMPANY' } };
  const html = await renderer.render({ quotes: [item] });
  assert.match(html, /WHAT CLIENTS SAY/);
  assert.match(html, /Clients, in their words\./);
  assert.ok(html.includes('TEST ONLY: “Exact punctuation.”\nSecond line — &lt;literal&gt; &amp; final sentence.'));
  assert.doesNotMatch(html, /<cite|TEST ONLY NAME|TEST ONLY ROLE|TEST ONLY COMPANY|<figure|<video|<img/);
  assert.equal((html.match(/<blockquote\b/g) ?? []).length, 1);
  const attributed = await renderer.render({ quotes: [{ ...item, attribution: { ...item.attribution, publicationApproved: true } }] });
  assert.match(attributed, /TEST ONLY NAME · TEST ONLY ROLE · TEST ONLY COMPANY/);
  assert.equal(renderer.api.approvedAttribution(item), '');
});

test('approved complete media survives empty quotes, without automatic video sources', async t => {
  const renderer = await clientProofRenderer();
  t.after(renderer.dispose);
  const video = { id: 'media-test', label: 'TEST ONLY MEDIA', approved: true, poster: '/test-only.png', sources: [{ src: '/test-only.webm', type: 'video/webm' }], captions: [{ src: '/test-only.vtt', srclang: 'en', label: 'English' }], transcript: '/test-only.txt' };
  const html = await renderer.render({ videos: [video] });
  assert.match(html, /<video[^>]*controls[^>]*preload="none"/);
  assert.match(html, /data-proof-config/);
  assert.match(html, /Read transcript/);
  assert.doesNotMatch(html, /<source|<track|autoplay|proof-carousel|Pending/);
  const multiple = await renderer.render({ videos: [video, { ...video, id: 'second-media-test' }, { ...video, id: 'withheld-media-test', approved: false }] });
  assert.equal((multiple.match(/data-proof-select=/g) ?? []).length, 2);
  assert.doesNotMatch(multiple, /withheld-media-test/);
});
