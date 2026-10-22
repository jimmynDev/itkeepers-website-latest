"""Offline public-output/credential-pattern audit. Never print matched values.

This deliberately bounded scan is supporting evidence, not proof of no secrets.
Usage: python scripts/audit-security.py [dist] [report.json]
"""
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
import subprocess
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent.parent
DIST = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / 'dist'
RULES = {
    'private-key': rb'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----',
    'github-token': rb'\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{60,})\b',
    'aws-access-key': rb'\b(?:AKIA|ASIA)[A-Z0-9]{16}\b',
    'stripe-live-secret': rb'\bsk_live_[A-Za-z0-9]{20,}\b',
    'google-api-key': rb'\bAIza[0-9A-Za-z_-]{35}\b',
    'slack-token': rb'\bxox[baprs]-[A-Za-z0-9-]{20,}\b',
    'credential-assignment': rb'''(?i)(?:api[_-]?key|secret|token|password)\s*[:=]\s*["'][A-Za-z0-9_+/.=-]{20,}["']''',
    'unresolved-public-placeholder': rb'\[\[INPUT-PENDING:',
}


class Resources(HTMLParser):
    def __init__(self):
        super().__init__()
        self.requests = []
        self.inline_scripts = 0
        self.script = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        for key in ('src', 'poster'):
            if a.get(key):
                self.requests.append(a[key])
        if tag == 'link' and set(a.get('rel', '').split()) & {'stylesheet', 'preload', 'modulepreload', 'icon'}:
            self.requests.append(a.get('href', ''))
        self.script = tag == 'script' and not a.get('src') and a.get('type') != 'application/ld+json'

    def handle_data(self, value):
        if self.script and value.strip():
            self.inline_scripts += 1

    def handle_endtag(self, tag):
        if tag == 'script':
            self.script = False


findings = []
public_files = sorted(p for p in DIST.rglob('*') if p.is_file())
listed = subprocess.check_output(['git', 'ls-files', '-co', '--exclude-standard', '-z'], cwd=ROOT).decode().split('\0')
source_files = sorted({ROOT / name for name in listed if name and (ROOT / name).is_file()})
for path in source_files + public_files:
    data = path.read_bytes()
    for rule, pattern in RULES.items():
        if rule == 'unresolved-public-placeholder' and path not in public_files:
            continue
        if re.search(pattern, data):
            findings.append({'rule': rule, 'path': str(path.relative_to(ROOT))})
for path in public_files:
    rel = path.relative_to(DIST)
    if path.suffix in {'.map', '.ts', '.astro', '.toml', '.md', '.zip'} or any(
        part.startswith('.env') or part in {'.git', 'node_modules', 'docs'} for part in rel.parts
    ):
        findings.append({'rule': 'unexpected-public-file', 'path': str(rel)})
pages = []
for path in public_files:
    if path.suffix != '.html':
        continue
    parser = Resources()
    parser.feed(path.read_text(encoding='utf-8'))
    remote = sorted({u for u in parser.requests if urlsplit(u).netloc})
    if remote or parser.inline_scripts:
        findings.append({'rule': 'remote-or-inline-executable-resource', 'path': str(path.relative_to(DIST)),
                         'remote': remote, 'inline_scripts': parser.inline_scripts})
    pages.append(str(path.relative_to(DIST)))
result = {'public_file_count': len(public_files), 'scanned_source_files': len(source_files),
          'html_pages': pages, 'findings': findings,
          'public_sha256': {str(p.relative_to(DIST)): hashlib.sha256(p.read_bytes()).hexdigest() for p in public_files}}
if len(sys.argv) > 2:
    Path(sys.argv[2]).write_text(json.dumps(result, indent=2), encoding='utf-8')
print(json.dumps({'public_file_count': len(public_files), 'html_pages': len(pages), 'findings': findings}, indent=2))
sys.exit(bool(findings))
