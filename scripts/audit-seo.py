"""Audit generated HTML without network access. Run after the Astro build."""
import json
import re
import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
from xml.etree import ElementTree


class Page(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.tags, self.texts, self.stack = [], [], []
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags.append((tag, attrs))
        if tag in ['title', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'script']:
            self.stack.append([tag, attrs, ''])

    def handle_data(self, data):
        for entry in self.stack:
            entry[2] += data

    def handle_endtag(self, tag):
        if self.stack and self.stack[-1][0] == tag:
            self.texts.append(self.stack.pop())


def audit(directory, origin='https://itkeepers.com'):
    root = Path(directory)
    pages = {}
    for file in root.rglob('*.html'):
        route = '/' + file.parent.relative_to(root).as_posix().strip('.') + '/'
        route = route.replace('//', '/')
        pages[route] = Page(file.read_text(encoding='utf-8'))
    rows, failures, warnings = [], [], []
    for route, page in sorted(pages.items()):
        def values(tag, key, value, field):
            return [a.get(field, '') for t, a in page.tags if t == tag and a.get(key) == value]
        title = [v for t, a, v in page.texts if t == 'title']
        description = values('meta', 'name', 'description', 'content')
        canonical = values('link', 'rel', 'canonical', 'href')
        robots = values('meta', 'name', 'robots', 'content')
        headings = [(t, ' '.join(v.split())) for t, a, v in page.texts if re.fullmatch('h[1-6]', t)]
        schemas = [json.loads(v) for t, a, v in page.texts if t == 'script' and a.get('type') == 'application/ld+json']
        entities = [e for s in schemas for e in s.get('@graph', [s])]
        ids = [a['id'] for t, a in page.tags if 'id' in a]
        row = dict(route=route, title=title, description=description, canonical=canonical, robots=robots,
                   h1=[v for t, v in headings if t == 'h1'], schemaTypes=[e.get('@type') for e in entities])
        rows.append(row)
        for label, data in [('title', title), ('description', description), ('canonical', canonical), ('robots', robots)]:
            if len(data) != 1 or not data[0]: failures.append(f'{route}: expected one nonempty {label}')
        if canonical != [origin + route]: failures.append(f'{route}: canonical mismatch')
        if len(row['h1']) != 1: failures.append(f'{route}: expected one H1')
        levels = [int(t[1]) for t, v in headings]
        if any(b > a + 1 for a, b in zip(levels, levels[1:])): failures.append(f'{route}: heading level skipped')
        if len(ids) != len(set(ids)): failures.append(f'{route}: duplicate element IDs')
        entity_ids = [e['@id'] for e in entities if '@id' in e]
        if len(entity_ids) != len(set(entity_ids)): failures.append(f'{route}: duplicate schema definitions')
        for field, expected in [('og:title', title), ('og:description', description), ('og:url', canonical)]:
            if values('meta', 'property', field, 'content') != expected: failures.append(f'{route}: {field} mismatch')
        for field in ['og:type', 'og:site_name', 'og:image', 'og:image:alt']:
            if len(values('meta', 'property', field, 'content')) != 1: failures.append(f'{route}: missing {field}')
        for tag, attrs in page.tags:
            if tag != 'a' or not attrs.get('href'): continue
            href = attrs['href']
            url = urlsplit(urljoin(origin + route, href))
            if url.netloc != urlsplit(origin).netloc or url.scheme not in ['http', 'https']: continue
            path = unquote(url.path)
            target = path.rstrip('/') + '/' if path != '/' else '/'
            if target in pages:
                if url.fragment and unquote(url.fragment) not in [a.get('id') for t, a in pages[target].tags]: failures.append(f'{route}: missing fragment {href}')
                if path != target: warnings.append(f'{route}: noncanonical link {href}')
            elif not (root / path.lstrip('/')).is_file(): failures.append(f'{route}: broken link {href}')
    for label in ['title', 'description']:
        counts = Counter(r[label][0] for r in rows if r[label])
        for value, count in counts.items():
            if count > 1: failures.append(f'duplicate {label}: {value}')
    sitemap = ElementTree.parse(root / 'sitemap.xml')
    locations = [n.text for n in sitemap.findall('.//{*}loc')]
    expected = [origin + r['route'] for r in rows if not any('noindex' in v for v in r['robots'])]
    if sorted(locations) != sorted(expected): failures.append('Sitemap differs from canonical indexable HTML routes')
    robots_text = (root / 'robots.txt').read_text()
    if f'Sitemap: {origin}/sitemap.xml' not in robots_text: failures.append('robots sitemap missing')
    return dict(routes=rows, failures=sorted(set(failures)), warnings=sorted(set(warnings)), sitemap=locations)


if __name__ == '__main__':
    result = audit(sys.argv[1] if len(sys.argv) > 1 else 'dist', sys.argv[3] if len(sys.argv) > 3 else 'https://itkeepers.com')
    output = json.dumps(result, indent=2, ensure_ascii=False)
    if len(sys.argv) > 2: Path(sys.argv[2]).write_text(output, encoding='utf-8')
    print(output)
    sys.exit(bool(result['failures']))
