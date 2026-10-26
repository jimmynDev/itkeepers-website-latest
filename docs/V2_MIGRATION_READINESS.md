# V2 SEO migration readiness — 19 October 2026

**20 October follow-up:** [Phase 5.2](V2_PHASE52_RETENTION_MIGRATION.md) records approved retention and recovered source content, implements the blog index plus three original articles, and updates the candidate to 20 HTML / 19 indexable routes. The 28 original redirects remain unchanged. Counts/content availability in the audit below describe its earlier baseline; current blocked paths and evidence are in the retention manifests. No deployment has occurred.

Local verification complete; production migration readiness remains blocked on the items below. Branch `codex/v2-prompt3-restored`, HEAD `22b5c2f9e74d9c734137036ec74a3db289c67761`. No commit, push, merge, upload, deployment, account setting or DNS change.

## Workers deployment configuration and redirects

- Inspected the actual checked-out `wrangler.toml`: Worker name `itkeepers-website`, static assets from `./dist`, compatibility date `2026-09-29`, no user Worker entry point, no SPA fallback, no alternate deployment configuration selected. The source configuration has no explicit domain/account binding and does not establish which remote version serves `itkeepers.com`.
- Workers supports `_redirects` and `_headers` natively. Built files match `public/` byte-for-byte. Wrangler local runtime parses all 28 redirect rules; local packaging with `wrangler deploy --dry-run` reads 114 assets and exits without upload. No deployment was performed.
- `scripts/verify-migration.py` checks every rule, including slash variants and query parameters, with redirect following disabled. All rules return 301 with the expected destination; all destinations return 200 immediately. No sources are destinations, so there are no migration loops/chains. All 16 canonical HTML routes return 200. Unknown/unmapped routes return real 404s.
- Retested the same configuration using canonical-host and two Workers hostname fixtures (default-style and version-style). Each fixture performs 94 requests, including all rules with/without query parameters, canonical routes, crawler resources and unresolved paths. All three pass.
- **Live-domain probe:** all 28 existing legacy sources on `https://itkeepers.com` return 200, not the intended 301. These rules are not currently active at that domain. Local success does not mean deployed success.
- **Remote configuration blocker:** read-only `wrangler deployments list` fails because Cloudflare API credentials are unavailable. No temporary account was created. Deployed version, account routing, dashboard rules and access policies cannot be certified from the local file. No credentials are needed for the completed local tests; authenticated read access is needed to finish remote verification.

All mappings remain the 28 verified exact rules in [redirects.csv](../redirects.csv). No speculative migration was added in this follow-up. The full destination table is in [the technical SEO audit](V2_TECHNICAL_SEO_AUDIT.md).

## Legacy URL coverage

The inspected live application's client-list function contains six client names and builds links by lowercasing and replacing spaces with hyphens. This establishes these concrete paths without guessing:

- `/clients/corning-insurance-solutions`
- `/clients/drugstore3u`
- `/clients/international-maritime-academy`
- `/clients/transglobal`
- `/clients/pfc-international`
- `/clients/sawaya-group`

None has an equivalent V2 story. The complete [unresolved inventory](../legacy-unresolved.csv) contains 17 concrete paths: the six stories, `/clients`, `/privacy-policy/`, `/reviews/`, `/feedback/`, `/blog/` and six Florida-location pages. Each remains unmapped and returns 404 in the local V2 runtime. This documents current behavior, not an approved retirement decision. Retaining/restoring material traffic destinations or serving 410 requires an owner decision; unrelated Home/service redirects would be misleading.

Evidence is the previously captured live application module, route/service records, indexed former privacy/navigation pages and indexed location/review/feedback pages. Current live sitemap endpoints return HTML rather than an inventory. Search Console/Bing exports, server logs, old CMS/article exports and backlink data are unavailable. Blog articles or other historical URLs may be missing; no exhaustive historical coverage is claimed.

## Privacy review

Prepared [V2_PRIVACY_NOTICE.md](drafts/V2_PRIVACY_NOTICE.md), a proposed website notice plus evidence/approval matrix. It accurately describes the current build's form fields, fixed email destination, browser validation, user-reviewed email handoff, lack of an active form API, AI-playbook local storage and separate hosting/email-provider handling.

The 14-day playbook dismissal interval suppresses the prompt; it is not automatic storage deletion. The opened flag has no expiry in source. Application code contains no analytics scripts or cookie writes, but this does not establish Cloudflare/account-level analytics, cookies, logs or mailbox practices.

Old-policy claims about sale/rental, sharing, organizational safeguards, rights, age threshold and broad website/application/service coverage are unverified for V2; they were not copied into a final policy. No legal conclusion that those claims are false or unlawful is made. Verified legal entity/controller, inquiry owner, mailbox/hosting processors, actual retention and transfers, rights handling, applicable jurisdictions and effective date remain approval inputs B3/B13.

Public `/privacy/` is unchanged and stays crawlable/noindex. The draft is outside `public/` and is not included in `dist`. It is not an effective notice. `/privacy-policy/` remains unmapped until an approved equivalent notice exists.

## Canonicals, crawler resources and preview indexing

- **Local V2:** 16 self-canonical HTML routes on `https://itkeepers.com/`; unique titles/descriptions, coherent OG/schema, exact hero H1 preserved. Fifteen indexable routes are in the sitemap; Privacy is noindex and excluded. Robots retains the established allow policy and production sitemap declaration. `robots.txt` returns text/plain and `sitemap.xml` application/xml in the Workers runtime.
- **Safe fix:** added Cloudflare's documented hostname-scoped `_headers` rule, `https://:version.:subdomain.workers.dev/*` → `X-Robots-Tag: noindex`. It covers standard Worker, version and alias URLs with that hostname shape. Canonical-host fixtures have no global noindex header; both preview fixtures have it on all 16 HTML routes. Canonical/schema/sitemap URLs remain production URLs.
- Header noindex is defense in depth, not authentication. Existing robots allows crawlers to observe the header; it was not replaced with a crawler block. Static redirects run before headers, so a redirect response is not expected to inherit `_headers`; its eventual preview destination carries noindex.
- **Remote preview blocker:** no verified account Workers subdomain, version URLs, custom preview domain or Cloudflare Access configuration is available. The local host fixtures are test names, not discovered deployed hosts. Actual remote preview authentication and noindex must be checked with access. Custom preview hostnames need explicit equivalent rules after inventory. `workers_dev`/`preview_urls` were not disabled blindly because remote domain routing is unknown.
- **Current live site:** `/robots.txt`, `/sitemap.xml` and `/privacy-policy/` return the React HTML shell, all with 200; sitemap has no XML loc entries. Live Home canonical is the apex. HTTP apex redirects directly to HTTPS apex. HTTP www redirects to HTTPS www, then HTTPS www redirects to HTTPS apex: two host/scheme hops. Consolidating these at the edge needs verified account/routing access and a separately authorized release; no unsupported domain rule was added to path-only `_redirects`.

## Validation and preservation

| Check | Result |
|---|---|
| Node 22 Astro build | Pass: 16 HTML pages and generated sitemap |
| Regression tests | Pass: 139/139, including deployment-asset/preview-header and unresolved-inventory regressions |
| Generated SEO audit | Pass: no failures or noncanonical-link warnings |
| Local Workers runtime | Pass: 28 exact rules, both slash forms, query preservation, one hop, canonical targets/indexability and unresolved 404s; 94 requests for each of three host fixtures |
| Deployment packaging | Pass: dry run only, no upload/deploy |
| Current live migration redirects | Fail for migration readiness: 0/28 intended 301s active; all return 200 |
| Remote deployed config / preview access | Blocked: Cloudflare read credentials and verified preview inventory unavailable |
| Privacy publication | Blocked: B3/B13 owner/legal facts and approval required |
| Preservation | Pass: all 16 generated main regions byte-identical to this turn's starting build; no source page, component, style, controller, animation, asset, existing public Privacy text or metadata changed |

Only starting implementation files changed this turn: `public/_headers` and `tests/seo.test.mjs`. Added read-only verifier, unresolved CSV, private draft and documentation. The prior turn's uncommitted changes remain intact.

Evidence outside Git: sibling `outputs/v2-migration-readiness-evidence/` contains starting hashes/HTML, build/test/audit output, runtime reports, live redirect/indexing probes, local packaging log and preservation results. Runtime preview remains <http://127.0.0.1:4366/>.

Reproduction from repo root, using Node 22:

```powershell
node node_modules/astro/astro.js build
node --test tests/*.test.mjs
python scripts/audit-seo.py dist
node node_modules/wrangler/bin/wrangler.js dev --local --config wrangler.toml --port 4366
# In a second terminal, while the local Worker is running:
python scripts/verify-migration.py http://127.0.0.1:4366 --host-header itkeepers.com --output runtime-production.json
python scripts/verify-migration.py http://127.0.0.1:4366 --host-header readiness-fixture.audit-fixture.workers.dev --output runtime-preview.json
```

The example fixture hosts are sent only as Host headers to localhost. The verifier does not contact those public hostnames. Use approved output paths outside the repository for evidence.

References: [Workers static redirects](https://developers.cloudflare.com/workers/static-assets/redirects/), [preview noindex header pattern](https://developers.cloudflare.com/workers/static-assets/headers/), [version URL controls](https://developers.cloudflare.com/workers/versions-and-deployments/version-urls/), [workers.dev routing](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/), [existing indexed policy](https://itkeepers.com/privacy-policy/). Checked 19 October 2026. Stop for review; no release action authorized or performed.
