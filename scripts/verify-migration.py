"""Read-only HTTP verification of the built Workers migration configuration.

Run against Wrangler --local, or an explicitly authorized deployment URL.
--host-header is only for local host-rule fixtures, not proof of remote setup.
"""
import argparse
import concurrent.futures
import csv
import json
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urlsplit, urljoin
from urllib.request import build_opener, HTTPRedirectHandler, Request
from xml.etree import ElementTree


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args):
        return None


def verify(base, host_header=None):
    opener = build_opener(NoRedirect())
    def get(path):
        request = Request(base.rstrip('/') + path, headers={'Host': host_header} if host_header else {})
        try:
            response = opener.open(request, timeout=20)
        except HTTPError as error:
            response = error
        with response:
            return {'path': path, 'status': response.code, 'location': response.headers.get('Location'),
                    'robots': response.headers.get('X-Robots-Tag'), 'type': response.headers.get('Content-Type'),
                    'body': response.read().decode('utf-8', 'replace')}
    rules = list(csv.DictReader(Path('redirects.csv').open(encoding='utf-8')))
    built_rules = [line.split() for line in Path('dist/_redirects').read_text().splitlines() if line.strip() and not line.startswith('#')]
    assert [(r['source'], r['destination'], r['status']) for r in rules] == [tuple(r) for r in built_rules]
    sources = {r['source'] for r in rules}
    assert len(sources) == len(rules) == 28
    assert not any(r['destination'] in sources for r in rules), 'redirect loop or chain in rules'
    html_routes = ['/' + p.parent.relative_to('dist').as_posix().strip('.') + '/' for p in Path('dist').rglob('index.html')]
    html_routes = [p.replace('//', '/') for p in html_routes]
    unresolved = list(csv.DictReader(Path('legacy-unresolved.csv').open(encoding='utf-8')))
    retention_file = Path('legacy-retention-manifest.csv')
    retention_status = {row['legacy_path']: int(row['expected_local_status'])
                        for row in csv.DictReader(retention_file.open(encoding='utf-8'))} if retention_file.exists() else {}
    missing = sorted({'/migration-readiness-missing/', '/solutions/0', '/solutions/8/'} | {r['path'] for r in unresolved})
    paths = sorted(sources | set(html_routes) | set(missing) | {'/robots.txt', '/sitemap.xml'})
    paths += [r['source'] + '?utm_source=migration-check&type=review' for r in rules]
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(get, paths))
    by = {r['path']: r for r in results}
    failures = []
    for rule in rules:
        for suffix in ['', '?utm_source=migration-check&type=review']:
            result = by[rule['source'] + suffix]
            target = urlsplit(urljoin(base, result['location'] or ''))
            if result['status'] != 301 or target.path != rule['destination']:
                failures.append(f"{result['path']}: expected direct 301 to {rule['destination']}")
            if suffix and target.query != suffix[1:]:
                failures.append(f"{result['path']}: query not preserved")
            if by[rule['destination']]['status'] != 200:
                failures.append(f"{rule['destination']}: target not direct 200")
    for path in html_routes:
        r = by[path]
        if r['status'] != 200 or 'text/html' not in (r['type'] or ''):
            failures.append(f'{path}: HTML status/type')
        if f'<link rel="canonical" href="https://itkeepers.com{path}"' not in r['body']:
            failures.append(f'{path}: wrong runtime canonical')
        policy = 'noindex, follow' if path == '/privacy/' else 'index, follow'
        if f'<meta name="robots" content="{policy}"' not in r['body']:
            failures.append(f'{path}: wrong runtime robots meta')
        if host_header and host_header.endswith('.workers.dev'):
            if 'noindex' not in (r['robots'] or ''):
                failures.append(f'{path}: missing preview-domain header')
        elif r['robots'] and 'noindex' in r['robots']:
            failures.append(f'{path}: unexpected global noindex header')
    for path in missing:
        expected_status = retention_status.get(path, 404)
        if by[path]['status'] != expected_status:
            failures.append(f'{path}: expected {expected_status} from the retention manifest')
    if 'name="robots" content="noindex, follow"' not in by['/privacy/']['body']:
        failures.append('Privacy must stay noindex pending approval')
    expected = {'https://itkeepers.com' + p for p in html_routes if p != '/privacy/'}
    try:
        sitemap = ElementTree.fromstring(by['/sitemap.xml']['body'])
        actual = {n.text for n in sitemap.findall('.//{*}loc')}
        if actual != expected:
            failures.append('Sitemap canonical/indexable membership mismatch')
    except ElementTree.ParseError:
        failures.append('Invalid sitemap XML')
    if 'Sitemap: https://itkeepers.com/sitemap.xml' not in by['/robots.txt']['body']:
        failures.append('robots sitemap declaration missing')
    for path, mime in [('/robots.txt', 'text/plain'), ('/sitemap.xml', 'application/xml')]:
        if by[path]['status'] != 200 or mime not in (by[path]['type'] or ''):
            failures.append(f'{path}: wrong status or content type')
    # Keep response body out of evidence logs; metadata is sufficient for this HTTP audit.
    return {'base': base, 'hostHeaderFixture': host_header, 'rules': len(rules), 'htmlRoutes': len(html_routes),
            'results': [{k: v for k, v in r.items() if k != 'body'} for r in results], 'failures': failures}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('base')
    parser.add_argument('--host-header')
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    report = verify(args.base, args.host_header)
    Path(args.output).write_text(json.dumps(report, indent=2), encoding='utf-8')
    print(json.dumps({k: v for k, v in report.items() if k != 'results'}))
    raise SystemExit(bool(report['failures']))
