import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { parse } from 'parse5';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const articles = JSON.parse(read('src/data/legacy-articles.json'));
const nodes = node => [node, ...(node.childNodes ?? []).flatMap(nodes)];
const attrs = node => Object.fromEntries((node.attrs ?? []).map(a => [a.name, a.value]));
const text = node => (node.value ?? (node.childNodes ?? []).map(text).join('')).replace(/\s+/g, ' ').trim();
function csvRows(value) {
  const rows = []; let row = [], field = '', quoted = false;
  for (let i = 0; i < value.length; i++) {
    const c = value[i];
    if (c === '"') { if (quoted && value[i + 1] === '"') { field += '"'; i++; } else quoted = !quoted; }
    else if (!quoted && (c === ',' || c === '\n')) { row.push(field); field = ''; if (c === '\n') { rows.push(row); row = []; } }
    else if (c !== '\r' || quoted) field += c;
  }
  if (field || row.length) rows.push([...row, field]);
  const [header, ...data] = rows;
  return data.map(values => Object.fromEntries(header.map((key, index) => [key, values[index]])));
}

test('retained educational articles preserve source blocks, dates, paths and qualified archive context', () => {
  assert.deepEqual(articles.map(a => a.path).sort(), [
    '/2023/09/the-future-of-artificial-intelligence-ai/',
    '/2023/09/understanding-datafication/',
    '/2023/10/how-do-ai-and-ml-differ/'
  ].sort());
  for (const article of articles) {
    const html = read('dist' + article.path + 'index.html');
    const document = parse(html);
    const body = nodes(document).find(n => attrs(n).class?.split(/\s+/).includes('archive-body'));
    const content = body.childNodes.filter(n => ['p', 'h2', 'h3'].includes(n.tagName));
    assert.deepEqual(content.slice(0, article.blocks.length).map(n => ({ tag: n.tagName, text: text(n) })), article.blocks);
    assert.equal(article.sourceUrl, 'https://itkeepers.com' + article.path);
    assert.match(article.sourceSnapshot, /^https:\/\/web\.archive\.org\/web\/\d{14}id_\//);
    assert.match(article.published, /^2023-\d{2}-\d{2}$/);
    assert.ok(html.includes(`datetime="${article.published}"`));
    assert.match(html, /has not been updated and does not describe current ITKeepers service inclusions/);
    assert.doesNotMatch(html, /edit-locationGoogleDescription|Got Questions\? Let Us Help!/);
    const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
    const schema = graph.filter(e => e['@type'] === 'Article');
    assert.equal(schema.length, 1);
    assert.equal(schema[0].headline, article.title);
    assert.equal(schema[0].datePublished, article.published);
    assert.equal(schema[0].publisher['@id'], 'https://itkeepers.com/#organization');
    assert.equal(schema[0].author, undefined, 'Do not invent an expert identity from the old admin account');
    assert.equal(schema[0].dateModified, undefined, 'Do not claim a new editorial update');
  }
});

test('retention manifests keep seventeen original decisions and all thirteen recovered article URLs explicit', () => {
  const manifest = csvRows(read('legacy-retention-manifest.csv'));
  const inventory = csvRows(read('legacy-article-inventory.csv'));
  assert.equal(manifest.length, 17);
  assert.equal(new Set(manifest.map(r => r.legacy_path)).size, 17);
  assert.equal(inventory.length, 13);
  assert.equal(inventory.filter(r => r.implementation_status === 'implemented').length, 3);
  assert.equal(inventory.filter(r => r.implementation_status === 'blocked').length, 10);
  assert.deepEqual(manifest.filter(r => r.expected_local_status === '200').map(r => r.legacy_path), ['/blog/']);
  const sitemap = read('dist/sitemap.xml');
  const blog = parse(read('dist/blog/index.html'));
  const links = nodes(blog).filter(n => n.tagName === 'a').map(n => attrs(n).href);
  for (const row of [...manifest, ...inventory]) {
    assert.equal(row.active_redirect_destination ?? '', '', 'No speculative redirect');
    const path = row.legacy_path.replace(/\/$/, '') + '/';
    if (row.expected_local_status === '200') {
      assert.ok(sitemap.includes(`<loc>https://itkeepers.com${path}</loc>`));
      assert.ok(existsSync(new URL('../dist' + path + 'index.html', import.meta.url)));
    } else {
      assert.ok(!existsSync(new URL('../dist' + path + 'index.html', import.meta.url)), 'No placeholder route: ' + path);
      assert.ok(!sitemap.includes(`<loc>https://itkeepers.com${path}</loc>`));
      assert.ok(!links.includes(path), 'Do not link to an unpublished article');
    }
  }
  assert.ok(articles.every(a => links.includes(a.path)));
  assert.match(read('dist/index.html'), /href="\/blog\/"[^>]*>Blog Archive/);
});
