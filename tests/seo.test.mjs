import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
function htmlFiles(path = 'dist') {
  return readdirSync(path, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? htmlFiles(`${path}/${entry.name}`) : entry.name.endsWith('.html') ? [`${path}/${entry.name}`] : []);
}
const files = htmlFiles();
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&#39;', "'").replaceAll('&quot;', '"');
const routes = files.map(file => ({
  path: file.replace(/^dist/, '').replace(/index\.html$/, ''), html: read(file)
}));

test('all twenty pages have unique metadata, canonical social URLs and one H1', () => {
  assert.equal(routes.length, 20);
  for (const tag of ['title', 'description']) {
    const values = routes.map(({ html }) => tag === 'title'
      ? html.match(/<title>(.*?)<\/title>/)[1]
      : html.match(/<meta name="description" content="([^"]+)"/)[1]);
    assert.equal(new Set(values).size, 20, `unique ${tag}`);
  }
  for (const { path, html } of routes) {
    const canonical = `https://itkeepers.com${path}`;
    assert.ok(html.includes(`<link rel="canonical" href="${canonical}"`));
    assert.ok(html.includes(`<meta property="og:url" content="${canonical}"`));
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
    assert.match(html, /<meta property="og:image" content="https:\/\/itkeepers.com\/assets\/itkeepers-og-v2.png"/);
    assert.match(html, /<meta property="og:image:alt" content="ITKeepers\. Your IT person is a team\. Managed IT, Cybersecurity, Cloud and Infrastructure\. Lebanon\."/);
  }
  assert.match(read('dist/index.html'), /<h1[^>]*>Your IT person is a team\.<\/h1>/);
});

test('one structured-data graph per route describes only supported entities', () => {
  let services = 0;
  for (const { path, html } of routes) {
    const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    assert.equal(scripts.length, 1, path);
    const graph = JSON.parse(scripts[0][1])['@graph'];
    assert.equal(graph.filter(entity => entity['@type'] === 'Organization').length, 1);
    const organization = graph.find(entity => entity['@type'] === 'Organization');
    assert.deepEqual(organization.location, [
      {
        '@type': 'Place', name: 'ITKeepers Lebanon office', telephone: '+961 81 816 761',
        address: { '@type': 'PostalAddress', addressLocality: 'Dbayeh', addressCountry: 'LB' },
        containedInPlace: { '@type': 'Place', name: 'Enterprise & Innovation Centre' }
      },
      {
        '@type': 'Place', name: 'ITKeepers USA office', telephone: '+1 561 600-9940',
        address: { '@type': 'PostalAddress', streetAddress: '6778 NW 66th Ave', addressLocality: 'Parkland', addressRegion: 'FL', postalCode: '33067', addressCountry: 'US' }
      }
    ], `Only the two company-verified offices belong in the Organization: ${path}`);
    assert.deepEqual(organization.telephone, ['+961 81 816 761', '+1 561 600-9940']);
    assert.deepEqual(organization.areaServed, [
      { '@type': 'Place', name: 'Middle East and North Africa (MENA)' },
      { '@type': 'Country', name: 'United States' }
    ]);
    for (const service of graph.filter(entity => entity['@type'] === 'Service')) assert.deepEqual(service.areaServed, organization.areaServed);
    const visible = decode(html);
    for (const location of organization.location) {
      assert.ok(visible.includes(location.address.addressLocality), path);
      if (location.containedInPlace) assert.ok(visible.includes(location.containedInPlace.name), path);
    }
    assert.equal(graph.filter(entity => entity['@type'] === 'WebSite').length, path === '/' ? 1 : 0);
    const ids = graph.map(entity => entity['@id']);
    assert.equal(new Set(ids).size, ids.length);
    for (const entity of graph) {
      assert.ok(!['Review', 'AggregateRating', 'LocalBusiness'].includes(entity['@type']));
      for (const field of ['address', 'geo', 'aggregateRating', 'review', 'openingHours', 'priceRange']) assert.equal(entity[field], undefined);
      if (entity['@type'] === 'Service') {
        services++;
        assert.equal(entity.url, `https://itkeepers.com${path}`);
        assert.equal(entity.provider['@id'], 'https://itkeepers.com/#organization');
        assert.ok(decode(html).includes(entity.name));
      }
    }
    if (path === '/it-keepers-pulse/') assert.ok(graph.some(entity => entity['@type'] === 'WebApplication'));
    if (path === '/resources/ai-governance/') assert.ok(graph.some(entity => entity['@type'] === 'DigitalDocument'));
  }
  assert.equal(services, 7);
});

test('sitemap contains exactly canonical indexable routes; draft Privacy remains crawlable noindex', () => {
  const locs = [...read('dist/sitemap.xml').matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
  const indexable = routes.filter(({ html }) => !html.includes('content="noindex, follow"')).map(({ path }) => `https://itkeepers.com${path}`);
  assert.deepEqual(locs.sort(), indexable.sort());
  assert.equal(locs.length, 19);
  assert.match(read('dist/privacy/index.html'), /name="robots" content="noindex, follow"/);
  const robots = read('dist/robots.txt');
  assert.match(robots, /Sitemap: https:\/\/itkeepers.com\/sitemap.xml/);
  assert.doesNotMatch(robots, /Disallow:\s*\/privacy/);
});

test('service breadcrumbs describe the real Home, Services and current-page hierarchy', () => {
  let count = 0;
  for (const { path, html } of routes) {
    const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
    const service = graph.find(e => e['@type'] === 'Service');
    const breadcrumb = graph.find(e => e['@type'] === 'BreadcrumbList');
    if (!service) { assert.equal(breadcrumb, undefined); continue; }
    count++;
    assert.deepEqual(breadcrumb.itemListElement, [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://itkeepers.com/' },
      { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://itkeepers.com/services/' },
      { '@type': 'ListItem', position: 3, name: service.name, item: `https://itkeepers.com${path}` }
    ]);
  }
  assert.equal(count, 7);
});

test('all verified legacy rules are permanent, exact, loop-free and point directly to indexable pages', () => {
  const rules = read('dist/_redirects').split(/\r?\n/).filter(line => line.trim() && !line.startsWith('#')).map(line => line.split(/\s+/));
  assert.equal(rules.length, 28);
  const sources = rules.map(([source]) => source);
  assert.equal(new Set(sources).size, sources.length);
  for (const [source, destination, status] of rules) {
    assert.equal(status, '301');
    assert.ok(!source.includes('*'));
    assert.ok(!sources.includes(destination), 'no redirect chain');
    const target = routes.find(route => route.path === destination);
    assert.ok(target, destination);
    assert.ok(!target.html.includes('content="noindex, follow"'));
  }
  for (const withheld of ['/privacy-policy/', '/reviews/', '/feedback/', '/clients/', '/blog/']) assert.ok(!sources.includes(withheld));
});

test('Workers deployment assets include redirect rules and host-scoped preview noindex', () => {
  const config = read('wrangler.toml');
  assert.match(config, /\[assets\][\s\S]*directory\s*=\s*"\.\/dist"/);
  assert.match(config, /^main\s*=\s*"worker\/index\.ts"/m);
  assert.match(config, /run_worker_first\s*=\s*\["\/api\/contact", "\/api\/inquiry"\]/, 'only the two contact API routes bypass asset-first routing');
  assert.match(config, /CONTACT_DELIVERY_ENABLED\s*=\s*"false"/, 'delivery stays disabled');
  assert.match(config, /CONTACT_VALIDATION_ENABLED\s*=\s*"false"/, 'production validation/collection stays disabled');
  assert.equal(read('dist/_redirects'), read('public/_redirects'));
  assert.equal(read('dist/_headers'), read('public/_headers'));
  const headers = read('dist/_headers');
  assert.match(headers, /https:\/\/:version\.:subdomain\.workers\.dev\/\*\r?\n\s+X-Robots-Tag: noindex/);
  const global = headers.split(/\r?\n\r?\n/)[0];
  assert.doesNotMatch(global, /X-Robots-Tag/i, 'production pages must not inherit global noindex');
});

test('unresolved legacy inventory is not silently redirected to unrelated content', () => {
  const unresolved = read('legacy-unresolved.csv').trim().split(/\r?\n/).slice(1).map(line => line.split(',')[0]);
  assert.equal(unresolved.length, 17);
  const rules = read('dist/_redirects').split(/\r?\n/).filter(line => line.trim() && !line.startsWith('#')).map(line => line.split(/\s+/)[0].replace(/\/$/, ''));
  for (const source of unresolved) assert.ok(!rules.includes(source.replace(/\/$/, '')), source);
  assert.ok(unresolved.includes('/clients/international-maritime-academy'));
  assert.ok(unresolved.includes('/privacy-policy/'));
});
