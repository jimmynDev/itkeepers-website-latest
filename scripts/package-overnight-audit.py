"""Package an explicit public-evidence whitelist; never package source recovery material."""
from pathlib import Path
import hashlib
import json
import re
import shutil
import zipfile

ROOT = Path(__file__).resolve().parent.parent
AUDIT = ROOT.parent / 'v2-overnight-audit'
PACKAGE = AUDIT / 'AI_Audit_Package'
PACKAGE.mkdir(exist_ok=True)
selected = set()

def digest(data): return hashlib.sha256(data).hexdigest()

def write(relative, data):
    target = PACKAGE / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    if isinstance(data, str):
        for src, label in [(str(ROOT), '<WORKSPACE>'), (ROOT.as_posix(), '<WORKSPACE>'), (str(Path.home()), '<USER_HOME>'), (Path.home().as_posix(), '<USER_HOME>')]:
            data = data.replace(src.replace('\\', '\\\\'), label).replace(src, label)
    target.write_bytes(data if isinstance(data, bytes) else data.encode('utf-8'))
    selected.add(target)

def copy(source, relative):
    data = source.read_bytes()
    if source.suffix.lower() in {'.json', '.html', '.txt', '.md', '.log'}:
        value = data.decode('utf-8-sig')
        for src, label in [(str(ROOT), '<WORKSPACE>'), (ROOT.as_posix(), '<WORKSPACE>'), (str(Path.home()), '<USER_HOME>'), (Path.home().as_posix(), '<USER_HOME>')]:
            value = value.replace(src.replace('\\', '\\\\'), label).replace(src, label)
        data = value.encode('utf-8')
    write(relative, data)

def read(relative): return json.loads((AUDIT / relative).read_text(encoding='utf-8-sig'))

for name in ['AI_AUDIT_README.md']:
    copy(ROOT / name, name)

for file in (ROOT / 'dist-staging').rglob('*'):
    if not file.is_file() or file.suffix == '.pdf': continue
    relative = file.relative_to(ROOT / 'dist-staging')
    copy(file, Path('http/generated-policy' if file.name in {'_headers', '_redirects'} else 'site') / relative)

for phase, target in [('baseline', 'baseline'), ('live-browser', 'live'), ('final', 'candidate')]:
    for file in (AUDIT / phase).glob('*'):
        if file.suffix == '.png' and '404' not in file.name:
            copy(file, Path(target) / 'screenshots' / file.name)
        if file.suffix == '.html' and phase == 'final': copy(file, Path('rendered-html') / file.name)
        if file.name.endswith('-results.json') or (file.name.endswith('-summary.json') and phase != 'live-browser'):
            copy(file, Path('accessibility') / phase / file.name)

for folder in ['components', 'reflow-before', 'reflow', 'interactions', 'inventory', 'performance']:
    for file in (AUDIT / folder).rglob('*'):
        if not file.is_file() or file.suffix not in {'.png', '.json', '.html', '.txt'}: continue
        if folder == 'reflow' and file.name.endswith('-failure.png'): continue
        if folder == 'components' and file.name.startswith('404-rendered'): target = Path('rendered-html') / file.name
        else: target = Path(folder) / file.relative_to(AUDIT / folder)
        copy(file, target)

for folder, target in [('live-http', 'http/live'), ('final-http', 'http/local')]:
    for file in (AUDIT / folder).rglob('*'):
        if file.is_file(): copy(file, Path(target) / file.relative_to(AUDIT / folder))

for name in ['seo-production.json', 'seo-staging.json', 'public-security.json', 'npm-audit.json', 'contrast-samples.json', 'artifact-comparison.json', 'memory-navigation.json', 'visual-comparison.json', 'image-metadata.json']:
    copy(AUDIT / name, Path('checks') / name)

for name in ['final-tests.log', 'final-types.log', 'final-build.log', 'final-staging-build.log', 'final-staging-check.log']:
    copy(AUDIT / name, Path('checks') / name)

metadata = read('inventory/metadata.json')
nav = ['# Website structure and navigation', '', 'Public preview origin: https://itkeepers-v2-staging.jimnassar99.workers.dev', '', 'Header categories: IT Services, Cybersecurity, Cloud, AI & Automation, Digital, Why ITKeepers; Emergency and Contact actions. Footer groups: Services, Company, Resources, Support.', '', '| Route | Title | Indexing |', '|---|---|---|']
for page in metadata: nav.append(f"| `{page['route']}` | {page['title']} | {'indexable' if page['indexable'] else 'held/noindex'} |")
nav.extend(['', 'All seven service pages belong below `/services/`; all indexable routes are in the supplied sitemap. Query-based Free IT Review links target `/contact/?type=review`. The 28 legacy rules and direct targets are in HTTP evidence. The 404 is a dynamic Worker response and is not an additional indexable page.', '', 'Links JSON includes repeated header/mobile/footer occurrences; occurrence counts are not unique link counts. Internal link and fragment resolution was checked by the offline SEO audit.'])
write('inventory/NAVIGATION_MAP.md', '\n'.join(nav))
write('FINDINGS.md', '# Findings and local refinements\n\n- Baseline: ordinary responsive layouts passed, but text-spacing overrides overflowed long H1 words on How We Work and AI/Cybersecurity/Infrastructure pages. Final wrapping fix clears all 64 spacing/reflow checks.\n- Named generic containers were not reliably exposed to assistive technology. Corrected semantic groups/regions and phishing status; prohibited-name incompletes cleared.\n- Live unknown URLs returned an empty 404 body and could produce a native browser failure. Local staging Worker now provides safe recovery links while preserving 404/noindex/no-store. Not deployed.\n- Seven service breadcrumb graphs now describe the existing navigation hierarchy. No new factual business claims.\n- Fifty-five of 60 ordinary before/after screenshots are pixel-identical; all 60 retain dimensions. Five differences lie in illustrative/animation regions and are supplied for inspection.\n- Remaining confidence limits: composited contrast, actual assistive technology/devices/zoom, Firefox runtime, genuine crawler networks, source evidence for business metrics and testimonial permissions. See the scoring README.\n- The existing internally-labelled public PDF is excluded pending distribution-scope review. No document bytes, recovery snapshots or confidential project notes are included.\n')

pdf = ROOT / 'public/resources/itkeepers-ai-governance-playbook.pdf'
write('EXCLUDED_ASSETS.md', '# Deliberately excluded asset\n\n`/resources/itkeepers-ai-governance-playbook.pdf`\n\nThe existing publicly linked document labels itself proprietary/internal. Confirm intended distribution with the owner before sharing its bytes. It is not included in this package; the site download itself was not changed.\n\nSHA-256 of the inspected existing file: `' + digest(pdf.read_bytes()) + '`\n\nThe offline PDF link will not resolve. Public cover imagery and the resource landing-page evidence remain available. Private recovery sources, account configuration and confidential project documents are also excluded.\n')

summary = {
    'date': '2026-10-22', 'timezone': 'Asia/Beirut', 'deployment': 'not deployed; local uncommitted changes only',
    'baselineSourceFilesPreserved': 270, 'unitTests': {'pass': 186, 'fail': 0},
    'finalLayouts': {'chromium': read('final/chromium-summary.json')['layouts'], 'webkit': read('final/webkit-summary.json')['layouts']},
    'fullPageAxeScans': 40, 'componentChecks': len(read('components/results.json')),
    'componentFailures': [r for r in read('components/results.json') if r['status'] != 'pass'],
    'reflowChecks': len(read('reflow/results.json')), 'reflowFailures': [r for r in read('reflow/results.json') if r['status'] != 'pass'],
    'interactionChecks': read('interactions/browser-summary.json'),
    'http': {'live': read('live-http/results.json')['requests'], 'local': read('final-http/results.json')['requests']},
    'indexable': 15, 'held': 5, 'redirectRules': 28,
    'lighthouse': [{k: r[k] for k in ['name', 'route', 'mode', 'score', 'lcpMs', 'cls', 'tbtMs', 'totalBytes']} for r in read('performance/summary.json')],
    'excludedAssets': ['/resources/itkeepers-ai-governance-playbook.pdf'],
    'limitations': ['See AI_AUDIT_README.md; no physical device, real Safari, screen reader/speech input, native zoom, field CWV/INP, genuine crawler network, account or email delivery signoff.']
}
assert summary['finalLayouts'] == {'chromium': 120, 'webkit': 60}
assert not summary['componentFailures'] and not summary['reflowFailures']
assert summary['interactionChecks']['pass'] == 46 and not summary['interactionChecks']['failures']
assert len(summary['lighthouse']) == 6
test_log = (AUDIT / 'final-tests.log').read_text(encoding='utf-8-sig')
assert re.search(r'^# pass 186$', test_log, re.M) and re.search(r'^# fail 0$', test_log, re.M)
write('EVIDENCE_SUMMARY.json', json.dumps(summary, indent=2, ensure_ascii=False))

for file in selected:
    relative = file.relative_to(PACKAGE)
    assert file.suffix not in {'.pdf', '.zip', '.toml', '.astro', '.ts'}, relative
    assert not any(x in relative.parts for x in ['private-baseline', '.git', 'node_modules', 'drafts']), relative
    if file.suffix in {'.json', '.html', '.txt', '.md', '.log', '.js', '.css'}:
        value = file.read_text(encoding='utf-8')
        assert not re.search(r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bAKIA[A-Z0-9]{16}\b|\bsk-[A-Za-z0-9]{32,}\b', value), relative
        assert str(Path.home()).lower() not in value.lower(), relative

manifest = [{'path': f.relative_to(PACKAGE).as_posix(), 'bytes': f.stat().st_size, 'sha256': digest(f.read_bytes())} for f in sorted(selected)]
write('PACKAGE_MANIFEST.json', json.dumps({'method': 'Explicit evidence whitelist; sanitized local user paths; document exclusion; file hashes. Bounded checks, not a guarantee of no conceivable sensitive content.', 'files': manifest}, indent=2))
zip_path = ROOT / 'ITKeepers_V2_AI_Audit.zip'
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as z:
    for file in sorted(selected): z.write(file, file.relative_to(PACKAGE).as_posix())
with zipfile.ZipFile(zip_path) as z:
    assert z.testzip() is None
    for entry in manifest: assert digest(z.read(entry['path'])) == entry['sha256']
    assert len(z.namelist()) == len(manifest) + 1
summary['package'] = {'files': len(selected), 'bytes': zip_path.stat().st_size, 'sha256': digest(zip_path.read_bytes()), 'crcAndManifestVerified': True}
(AUDIT / 'final-evidence-summary.json').write_text(json.dumps(summary, indent=2, ensure_ascii=False), encoding='utf-8')
print(json.dumps({'package': str(zip_path), **summary['package']}))
