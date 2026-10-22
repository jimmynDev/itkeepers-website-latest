"""Read-only smoke checks against an approved deployed candidate; not release approval.
Run from repository root after rebuilding the approved candidate. No POST or email.
Remote execution requires --allow-production after explicit authorization.
--local-fixture is explicitly NOT evidence of remote deployment, TLS or Access.
"""
import argparse,csv,importlib.util,json,re
from pathlib import Path
from urllib.parse import urljoin,urlsplit
from urllib.request import build_opener,HTTPRedirectHandler,Request
from urllib.error import HTTPError

class NoRedirect(HTTPRedirectHandler):
 def redirect_request(self,*args):return None

p=argparse.ArgumentParser();p.add_argument('--base',required=True);p.add_argument('--allow-production',action='store_true');p.add_argument('--output',required=True);p.add_argument('--local-fixture',action='store_true');args=p.parse_args()
root=Path.cwd();base=args.base.rstrip('/');origin=urlsplit(base)
if not args.local_fixture and not args.allow_production:p.error('Remote checks require separately authorized --allow-production; default performs no network request.')
if not args.local_fixture and (origin.scheme!='https' or origin.netloc!='itkeepers.com' or origin.path or origin.query or origin.fragment):p.error('Production smoke base must be https://itkeepers.com; use --local-fixture only for localhost.')
if args.local_fixture and (origin.hostname not in ('localhost','127.0.0.1') or origin.scheme != 'http' or origin.path or origin.query or origin.fragment or origin.username):p.error('Local fixtures require an HTTP loopback origin only.')
spec=importlib.util.spec_from_file_location('seo_audit',root/'scripts/audit-seo.py');audit=importlib.util.module_from_spec(spec);spec.loader.exec_module(audit)
opener=build_opener(NoRedirect());requests=[];failures=[]
def fetch(path,extra=None,method=None):
 url=path if '://' in path else base+path
 if args.local_fixture and urlsplit(url).netloc != origin.netloc:raise ValueError('Local smoke cannot contact a remote origin')
 headers={'User-Agent':'ITKeepers-approved-release-smoke/1.0'}
 if args.local_fixture:headers['Host']='itkeepers.com'
 headers.update(extra or {})
 try:r=opener.open(Request(url,headers=headers,method=method),timeout=25)
 except HTTPError as e:r=e
 with r:
  body=r.read().decode('utf-8','replace');h={k.lower():v for k,v in r.headers.items()};row={'url':url,'method':method or 'GET','status':r.code,'headers':{k:v for k,v in h.items() if k in ('content-type','location','cache-control','etag','content-security-policy','strict-transport-security','x-content-type-options','x-frame-options','referrer-policy','permissions-policy','x-robots-tag','access-control-allow-origin','access-control-allow-credentials')}};requests.append(row);return row,body

def check(ok,message):
 if not ok:failures.append(message)

def projection(body):
 page=audit.Page(body);meta={d.get('name',d.get('property')):d.get('content') for t,d in page.tags if t=='meta'}
 return {'title':[s for t,d,s in page.texts if t=='title'],'h1':[s for t,d,s in page.texts if t=='h1'],'canonical':[d.get('href') for t,d in page.tags if t=='link' and d.get('rel')=='canonical'],'meta':{k:meta.get(k) for k in ['description','robots','og:title','og:description','og:url','og:image','twitter:card','twitter:title','twitter:description','twitter:image']},'schema':[json.loads(s) for t,d,s in page.texts if t=='script' and d.get('type')=='application/ld+json']}

required={'x-content-type-options':'nosniff','x-frame-options':'DENY','referrer-policy':'strict-origin-when-cross-origin','permissions-policy':'camera=(), microphone=(), geolocation=()','strict-transport-security':'max-age=86400'}
required['content-security-policy']=next(l.strip().split(': ',1)[1] for l in (root/'public/_headers').read_text().splitlines() if l.strip().startswith('Content-Security-Policy:'))
route_results={}
for file in (root/'dist').rglob('index.html'):
 rel=file.parent.relative_to(root/'dist').as_posix();route='/' if rel=='.' else '/'+rel+'/'
 row,body=fetch(route);route_results[route]=row
 check(row['status']==200 and 'text/html' in row['headers'].get('content-type',''),route+': status/type')
 check(projection(body)==projection(file.read_text(encoding='utf-8')),route+': metadata/H1/schema differs from approved build')
 for k,v in required.items():check(row['headers'].get(k)==v,route+': '+k)
 check('noindex' not in row['headers'].get('x-robots-tag',''),route+': unexpected production-wide noindex')
 check('immutable' not in row['headers'].get('cache-control','') and 'max-age=0' in row['headers'].get('cache-control',''),route+': HTML caching')
 check(not row['headers'].get('access-control-allow-origin') and not row['headers'].get('access-control-allow-credentials'),route+': unexpected CORS grant')
 main=re.search(r'<main\b[\s\S]*?</main>',body);expected=re.search(r'<main\b[\s\S]*?</main>',file.read_text(encoding='utf-8'))
 def links(m):return sorted(d.get('href','') for t,d in audit.Page(m[0] if m else '').tags if t=='a' and d.get('href','').startswith('/'))
 check(links(main)==links(expected),route+': contextual links changed')
for path in ['/robots.txt','/sitemap.xml']:
 row,body=fetch(path);check(row['status']==200,path+': status');check(body.replace('\r\n','\n')==(root/'dist'/path[1:]).read_text(encoding='utf-8'),path+': differs from approved build')
 check(('text/plain' if path=='/robots.txt' else 'application/xml') in row['headers'].get('content-type',''),path+': MIME')
rules=list(csv.DictReader((root/'redirects.csv').open(encoding='utf-8')))
for rule in rules:
 for suffix in ['', '?utm_source=release-smoke&type=review']:
  row,_=fetch(rule['source']+suffix);target=urlsplit(urljoin('https://itkeepers.com'+rule['source'],row['headers'].get('location','')))
  check(row['status']==301 and target.scheme=='https' and target.netloc=='itkeepers.com' and target.path==rule['destination'] and target.query==suffix[1:] and not target.fragment,rule['source']+suffix+': single-hop redirect')
  check(route_results.get(rule['destination'],{}).get('status')==200,rule['destination']+': target not direct 200')
row,_=fetch('/phase5-release-smoke-missing/');check(row['status']==404,'Unknown URL must return real 404')
check(all(row['headers'].get(k)==v for k,v in required.items()),'404 security-header coverage')
unresolved=[]
for entry in csv.DictReader((root/'legacy-unresolved.csv').open(encoding='utf-8')):
 row,_=fetch(entry['path']);unresolved.append({'path':entry['path'],'status':row['status'],'location':row['headers'].get('location'),'approval':'COMPARE TO OWNER-APPROVED DISPOSITION; source CSV records unresolved decisions'})
for folder in ['_astro','styles']:
 asset=next(p for p in (root/'dist'/folder).iterdir() if p.is_file() and p.suffix in ('.js','.css'));row,_=fetch('/'+asset.relative_to(root/'dist').as_posix());check(row['status']==200 and 'immutable' in row['headers'].get('cache-control','') and 'max-age=31536000' in row['headers'].get('cache-control',''),folder+': fingerprinted caching')
etag=route_results['/']['headers'].get('etag')
if etag:
 row,_=fetch('/',{'If-None-Match':etag});check(row['status']==304,'HTML conditional GET must revalidate');check(all(row['headers'].get(k)==v for k,v in required.items()),'304 security-header coverage')
if not args.local_fixture:
 for variant in ['http://itkeepers.com/','http://www.itkeepers.com/','https://www.itkeepers.com/']:
  row,_=fetch(variant);check(row['status'] in (301,308) and row['headers'].get('location')=='https://itkeepers.com/',variant+': host/scheme must consolidate directly')
# Never POST or send an inquiry. These checks apply to the approved disabled candidate.
for endpoint in ['/api/contact','/api/inquiry']:
 for method in ['GET','OPTIONS']:
  row,_=fetch(endpoint,method=method)
  check(row['status']==405,endpoint+': '+method+' must reject')
  check(row['headers'].get('cache-control')=='no-store' and 'noindex' in row['headers'].get('x-robots-tag',''),endpoint+': private API errors')
  check(row['headers'].get('x-content-type-options')=='nosniff' and row['headers'].get('x-frame-options')=='DENY' and row['headers'].get('content-security-policy')=="default-src 'none'; frame-ancestors 'none'; base-uri 'none'",endpoint+': API security headers')
  check(not row['headers'].get('access-control-allow-origin'),endpoint+': no CORS grant')
for private_path in ['/docs/drafts/V2_PRIVACY_NOTICE.md','/FINAL_RELEASE_READINESS.md','/.env','/worker/index.ts','/package.json']:
 row,_=fetch(private_path);check(row['status']==404,private_path+': private source must not be public')
# Approved retention records remain explicit; temporary 404s are not retirement approval.
for manifest in ['legacy-retention-manifest.csv','legacy-article-inventory.csv']:
 for entry in csv.DictReader((root/manifest).open(encoding='utf-8')):
  canonical=entry['legacy_path'].rstrip('/')+'/'
  expected=int(entry['expected_local_status'])
  for path in [canonical,canonical.rstrip('/')]:
   row,_=fetch(path)
   wanted=307 if expected==200 and path!=canonical else expected
   check(row['status']==wanted,path+': differs from retained candidate expectation')
   if wanted==307:check(urlsplit(row['headers'].get('location','')).path==canonical,path+': folder normalization target')
result={'base':base,'local_fixture_only':args.local_fixture,'routes':len(route_results),'redirect_rules':len(rules),'requests':len(requests),'failures':failures,'unresolved_legacy_observations':unresolved,'manual_release_gates_still_required':['approved privacy/inquiry handling','approved dispositions for unresolved legacy paths','deployed version/account/routing/rollback identity','actual preview inventory and unauthenticated/authenticated Access/noindex checks','manual accessibility and contact delivery signoff'],'responses':requests}
Path(args.output).write_text(json.dumps(result,indent=2),encoding='utf-8');print(json.dumps({k:v for k,v in result.items() if k not in ('responses','unresolved_legacy_observations')},indent=2));raise SystemExit(bool(failures))
