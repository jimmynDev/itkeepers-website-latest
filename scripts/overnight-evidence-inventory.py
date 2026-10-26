"""Extract public-only metadata, schemas, links and readable content for offline review."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin, urlsplit, unquote
import json
import re

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT.parent / 'v2-overnight-audit' / 'inventory'
ORIGIN = 'https://itkeepers-v2-staging.jimnassar99.workers.dev'
OUT.mkdir(parents=True, exist_ok=True)

class Page(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.tags, self.content, self.stack, self.text = [], [], [], []
        self.excluded = 0
        self.feed(html)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags.append((tag, attrs))
        if tag in ('script', 'style'): self.excluded += 1
        if tag in ('title','h1','h2','h3','h4','h5','h6','script'): self.stack.append([tag, attrs, ''])
    def handle_data(self, text):
        if not self.excluded and text.strip(): self.text.append(text.strip())
        for entry in self.stack: entry[2] += text
    def handle_endtag(self, tag):
        if self.stack and self.stack[-1][0] == tag: self.content.append(self.stack.pop())
        if tag in ('script', 'style'): self.excluded = max(0, self.excluded - 1)

pages, links, schemas, failures = [], [], [], []
for file in sorted((ROOT / 'dist-staging').rglob('*.html')):
    route = '/' + file.relative_to(ROOT / 'dist-staging').as_posix().removesuffix('index.html')
    page = Page(file.read_text(encoding='utf-8'))
    metadata = {a.get('name', a.get('property')): a.get('content') for t,a in page.tags if t == 'meta'}
    headings = [{'level': int(t[1]), 'text': ' '.join(v.split())} for t,a,v in page.content if re.fullmatch('h[1-6]', t)]
    graph = [json.loads(v) for t,a,v in page.content if t == 'script' and a.get('type') == 'application/ld+json']
    canonical = next(a.get('href') for t,a in page.tags if t == 'link' and a.get('rel') == 'canonical')
    pages.append({'route': route, 'canonical': canonical, 'title': next(v for t,a,v in page.content if t == 'title'), 'meta': metadata, 'headings': headings, 'indexable': 'noindex' not in metadata['robots']})
    for data in graph:
        for entity in data.get('@graph', [data]):
            schemas.append({'route': route, 'entity': entity})
            if entity.get('@type') == 'Service':
                for key in ('name','serviceType','url','description','provider'):
                    if not entity.get(key): failures.append(f'{route}: Service missing project-required {key}')
            if entity.get('@type') == 'BreadcrumbList':
                items = entity.get('itemListElement', [])
                if len(items) != 3 or [i.get('position') for i in items] != [1,2,3]: failures.append(f'{route}: breadcrumb sequence')
                for item in items:
                    if not item.get('name') or not item.get('item','').startswith(ORIGIN + '/'): failures.append(f'{route}: breadcrumb name/origin')
            if entity.get('@type') in ('LocalBusiness', 'ITStore'): failures.append(f'{route}: unexpected location/store schema requires factual review')
    for t,a in page.tags:
        if t == 'a' and a.get('href'):
            target = urljoin(canonical, a['href'])
            links.append({'source': route, 'href': a['href'], 'absolute': target, 'internal': urlsplit(target).netloc == urlsplit(ORIGIN).netloc, 'fragment': unquote(urlsplit(target).fragment)})
    (OUT / (route.strip('/').replace('/', '_') or 'home')).with_suffix('.txt').write_text('\n'.join(page.text), encoding='utf-8')
for name, value in [('metadata.json', pages), ('json-ld.json', schemas), ('links.json', links), ('schema-findings.json', {'failures': failures, 'serviceEntities': sum(r['entity'].get('@type') == 'Service' for r in schemas), 'breadcrumbEntities': sum(r['entity'].get('@type') == 'BreadcrumbList' for r in schemas), 'method': 'JSON parsing plus bounded field, sequence and host checks against actual public markup. Not the external Schema.org validator or Google Rich Results Test.', 'notUsed': ['LocalBusiness', 'ITStore', 'Review', 'AggregateRating'], 'sources': ['https://schema.org/Service', 'https://developers.google.com/search/docs/appearance/structured-data/breadcrumb']})]:
    (OUT / name).write_text(json.dumps(value, indent=2, ensure_ascii=False), encoding='utf-8')
print(json.dumps({'pages': len(pages), 'indexable': sum(p['indexable'] for p in pages), 'held': sum(not p['indexable'] for p in pages), 'links': len(links), 'schemaFailures': failures}))
