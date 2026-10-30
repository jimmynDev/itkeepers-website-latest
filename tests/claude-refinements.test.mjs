import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'parse5';

const read = path => readFileSync(new URL('../' + path, import.meta.url));
const walk = node => [node, ...(node.childNodes ?? []).flatMap(walk)];
const text = node => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join('');
const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value;
const title = 'Managed IT, Cybersecurity & Cloud | ITKeepers';
const description = 'Managed IT, cybersecurity, Microsoft 365 and infrastructure across MENA and the United States, with offices in Dbayeh, Lebanon and Parkland, Florida.';
function htmlFiles(path = 'dist-staging') {
  return readdirSync(path, { withFileTypes:true }).flatMap(entry => entry.isDirectory() ? htmlFiles(`${path}/${entry.name}`) : entry.name.endsWith('.html') ? [`${path}/${entry.name}`] : []);
}

test('homepage search and social metadata agree and animated roles are outside the sole H1', () => {
  const nodes = walk(parse(read('dist-staging/index.html').toString()));
  const metas = key => nodes.filter(n => n.tagName === 'meta' && (attr(n,'name') === key || attr(n,'property') === key)).map(n => attr(n,'content'));
  assert.equal(text(nodes.find(n => n.tagName === 'title')), title);
  for (const key of ['og:title','twitter:title']) assert.deepEqual(metas(key), [title]);
  for (const key of ['description','og:description','twitter:description']) assert.deepEqual(metas(key), [description]);
  const headings = nodes.filter(n => n.tagName === 'h1');
  assert.equal(headings.length,1);
  assert.equal(text(headings[0]),'Your IT person is a team.');
  assert.equal(walk(headings[0]).filter(n => attr(n,'aria-hidden') === 'true' || attr(n,'data-hero-headline') !== undefined).length,0);
});

test('every staging share image resolves to a real PNG whose dimensions match the metadata', () => {
  const origin = 'https://itkeepers-v2-staging.jimnassar99.workers.dev';
  const files = htmlFiles(); assert.equal(files.length,20);
  for (const file of files) {
    const nodes = walk(parse(read(file).toString()));
    const meta = key => nodes.filter(n => n.tagName === 'meta' && (attr(n,'name') === key || attr(n,'property') === key)).map(n => attr(n,'content'));
    assert.deepEqual(meta('twitter:card'),['summary_large_image'],file);
    assert.deepEqual(meta('og:image'),[origin+'/assets/itkeepers-og-v2.png'],file);
    assert.deepEqual(meta('twitter:image'),meta('og:image'),file);
    assert.deepEqual(meta('og:image:type'),['image/png']);
    const image = read('dist-staging'+new URL(meta('og:image')[0]).pathname);
    assert.equal(image.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
    assert.equal(image.toString('ascii',12,16),'IHDR');
    assert.equal(image.readUInt32BE(16),Number(meta('og:image:width')[0]));
    assert.equal(image.readUInt32BE(20),Number(meta('og:image:height')[0]));
    assert.equal(image.readUInt32BE(16),1200); assert.equal(image.readUInt32BE(20),630);
    assert.equal(meta('og:image:alt').length,1); assert.deepEqual(meta('twitter:image:alt'),meta('og:image:alt'));
  }
});

test('Managed IT keeps one scope boundary and the existing service-desk and maintenance anchors', () => {
  const nodes = walk(parse(read('dist-staging/services/managed-it/index.html').toString()));
  const boundary = 'Exact support scope, coverage and response commitments depend on the agreed service.';
  assert.equal(nodes.filter(n => n.tagName === 'p' && text(n) === boundary).length,1);
  for (const id of ['it-services','service-desk','backup-disaster-recovery','patch-management','service-packages']) assert.equal(nodes.filter(n => attr(n,'id') === id).length,1,id);
  assert(!nodes.some(n => n.tagName === 'h3' && text(n) === 'IT Services'));
});
