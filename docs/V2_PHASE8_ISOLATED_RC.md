# Phase 8 — Isolated V2 release candidate, prepared locally

27 October 2026, Asia/Beirut. Branch `codex/v2-business-locations`, HEAD remains `bfcd0322174c6bf5a00ed602c47c633fc9aaf337`. **Local preparation only; no commit, push, merge, Worker creation, upload, deployment, route/domain/secret/settings change or real inquiry.**

**Recommendation: GO for an explicitly owner-approved isolated RC deployment.** The local artifact/configuration/handler pass the checks below. Stop here for approval; this does not authorize publication or a production cutover. Existing publication/Privacy/testimonial-permission and real-inbox checks retain their separate approval boundaries.

## Concrete paths and identity

Project: `C:\Users\Jim\Documents\ChatGPT\ITKeepers Website\outputs\v2-business-locations`.

| Item | Exact value |
|---|---|
| Verified account | `eabf58c0ea3cf8629b95c29042124f72`, Jim's personal preview account. Phase7 CLI/API confirmed Super Administrator membership and Worker edit/read permissions. |
| RC Worker | `itkeepers-v2-rc-20261027` |
| RC hostname/origin | `https://itkeepers-v2-rc-20261027.jimnassar99.workers.dev` |
| Executable configuration | `wrangler.rc.toml` in the project root; no longer the Phase6 proposal template. |
| Built artifact | `dist-rc/` in this project,118 files/20 HTML routes. Ignored by Git. |
| Worker entry | `worker/rc.ts`; identity in `worker/rc-policy.json`. |
| Commands | `npm run build:rc`, `npm run check:rc`. No deploy script added. |
| Review evidence/package | Sibling `../../v2-phase8-isolated-rc-20261027/`, including preservation/config diff, test/browser/HTTP logs, dry-run bundle and release integrity/archive files. |

Cloudflare read-only checks confirm account/subdomain, existing deployment and absence of the proposed Worker and Service (404, not an authorization failure). Recheck immediately before an authorized deployment: name availability can change. No route/domain creation or DNS change is needed for a separate workers.dev Worker.

## Implementation and isolation

`scripts/build-rc.mjs` builds current V2 source directly into fixed `dist-rc`, with a private child environment for the existing static/provider form mode. It accepts only the project's Node22.19+ family and never changes the production/staging source or canonical defaults. All current Phase1–5 office/metric/credibility/form/popup improvements are included.

Only generated RC head metadata changes: absolute canonical/Open Graph/social/JSON-LD URLs use the RC origin and every HTML robots tag is `noindex, follow`. Body content, relative internal links, scripts, styling, images, four testimonials, office details, metrics, forms and query handling are identical to the current production build. No visitor-facing copy changed. The checker reverses only approved head substitutions and compares all20 pages and all remaining assets byte-for-byte.

RC robots is exactly:

```text
User-agent: *
Allow: /
```

The sitemap XML intentionally contains zero URL entries and is not advertised or intended for submission to search engines. All RC pages are excluded from indexing while direct navigation remains available. There is no authentication wall, evaluator-specific content, added CAPTCHA or blanket robots disallow. Noindex is not access control or a guarantee of removal from every search/retrieval system.

`worker/rc.ts` exports only the default fetch entry. It reuses the unchanged staging handler's established security, hostname guard, redirects/errors and disabled APIs. It fails closed unless the configured hostname equals the fixed RC hostname; the inherited guard also checks each request URL. The wrapper adds `X-Robots-Tag: noindex, follow` to **every response**, including PDFs/documents, HEAD/304, redirects, errors and assets. `run_worker_first = true` prevents static assets bypassing it. Public document bytes, MIME types, ETags and supported response representations are preserved.

Generated RC `_headers` also has a blanket noindex header. Existing CSP/nosniff/frame/referrer/permissions/cache controls keep their values; the existing one-day HSTS rule is scoped to the RC origin, as the staging artifact scopes its rule to staging. The additional version-host preview guard remains as defense in depth. No source `public/_headers`, production output or existing staging rule was changed.

Production/staging entries, shared SEO defaults, standard staging builder and indexing policy do **not** import the RC policy/entry. Their freshly rebuilt118-file outputs match the Phase8 starting manifests byte-for-byte: production retains19 indexable pages and staging15, with all existing holds preserved. RC has0. No noindex leakage or archive-policy change to production.

The direct Formspree endpoint and visible temporary-inbox Privacy disclosures are retained. `CONTACT_* = false` blocks local collection APIs; it does not disable the direct provider forms. All provider submissions in validation were intercepted/mocked; no real inquiry or inbox-delivery verification occurred.

## All configuration differences from existing staging

Machine-readable exhaustive field comparison: sibling evidence `preservation.json`, `configDiff`. Neither existing configuration was edited.

| Field | Existing staging | New RC |
|---|---|---|
| `name` | `itkeepers-v2-staging` | `itkeepers-v2-rc-20261027` |
| `account_id` | Omitted | Explicit verified `eabf58c0ea3cf8629b95c29042124f72` |
| `main` | `worker/staging.ts` | `worker/rc.ts` |
| `build.command` | `npm run build:staging` | Absent: publish the already checked artifact; no implicit rebuild. |
| `vars.STAGING_HOSTNAME` | `itkeepers-v2-staging.jimnassar99.workers.dev` | `itkeepers-v2-rc-20261027.jimnassar99.workers.dev` |
| `assets.directory` | `./dist-staging` | `./dist-rc` |

All other fields are identical: compatibility date `2026-09-29`, metrics off, workers.dev on, version-preview URLs off, empty custom routes, both local API switches false, ASSETS binding, run Worker first, observability off. No custom domain, zone ID, secrets, DO, migrations, email, database, service or cron binding. The binding **names** are retained in a separate Worker namespace; no current binding or existing target was changed.

Additional artifact behavior differences: all HTML gets the RC origin/global noindex; robots stops advertising the staging sitemap; sitemap entries15→0; RC static/Worker headers cover every response/document rather than staging's page-specific holds. These are confined to `dist-rc` and `worker/rc.ts`.

## Validation results

| Check | Result and evidence |
|---|---|
| Full suite | **PASS238/238**, existing230 plus8 meaningful RC hostname/representation/cache/isolation/config cases; `tests.log`. |
| TypeScript | **PASS**, `typecheck.log`. Astro templates compile in the builds. |
| Builds/checkers | **PASS**, production/staging/RC each20 pages and118 files; existing staging checker15 indexable/5 held/2 forms/28 redirects; new RC checker0 indexable/2 forms/exact isolated configuration. |
| Phase1–5 preservation | **PASS**, all starting business/animation/form/SEO/Privacy source unchanged; only four existing operational/doc files changed in this phase. Production/staging artifacts byte-identical to their start; RC page bodies and95 unchanged assets/control-independent files match. `preservation.json`, checker output. |
| Full consultation matrix | **PASS**, Chromium/WebKit,390/1440,72 validation/success/delay/error/challenge/network/rate/server cases;12 native/no-JS payload cases,8 keyboard jump cases,2 manual intent switches and20 scoped responsive/axe surfaces. `browser.json`. |
| Broad actual local RC Worker | **PASS**,56 page surfaces (Chromium all20 routes/WebKit8 representative routes at390/1440),0 axe violations/page errors/overflow;30 further reflow checks;6 keyboard-menu/jump checks;12 generic/consultation/native cases. `wide-browser.json`. |
| Animations/focus | **PASS in tested scope**, normal motion remains active; platform reduced-motion removes the tested continuous animation in both engines; form centers remain usable. Source animation/component/style bytes preserved. `wide-browser.json`. |
| Popup | **PASS**,650 collision checks,12 Contact surfaces,12 keyboard dismissal/focus/persistence cases;320/375/390/768/1024/1440 and short viewport, normal/reduced motion; no page error or remote POST. `popup-browser.json`. |
| Extra actual-Worker form smoke | **PASS**, six15-second-timeout/generic-success/no-JS-home cases across both browsers; `smoke.json`. Provider acceptance, inbox delivery and appointment scheduling remain distinct. |
| Runtime HTTP/indexing/security | **PASS**,40 HTML GET/HEAD requests,28 query-preserving redirects,7 document/robots/sitemap requests,7 API/missing/exposure probes and3 browser/AI/crawler user agents. All tested responses have noindex and applicable security headers. `http-rc.json`. |
| PDFs/documents | **PASS**,190729-byte published PDF matches original, GET/HEAD/304 have noindex; static license text/documents protected. Local range requests return200 full PDF in **both** unchanged staging and RC; no regression. Unit coverage additionally verifies206 headers/body are preserved when supplied. `document-baseline.json`, `http-rc.json`, RC tests. Hosted range behavior remains a post-deploy check. |
| SEO/schema/public exposure | **PASS**, production/staging SEO audits have no failures/warnings; RC checker verifies exact head changes, canonical/OG/schema origin, robots/sitemap and preserved bodies/links. RC JSON-LD has no vocabulary/domain/range issues against the saved official vocabulary. Public118-file credential/placeholder scan has no findings. `schema-validation.json`, `security-rc.json`, SEO JSON files. |
| Dependencies/Node | **PASS**, registry audit0 vulnerabilities, no dependency/lockfile change. Node22.23.3 satisfies project^22.19.0. Default system Node24 is outside the project range; commands below explicitly select22. |
| Wrangler packaging | **PASS**, project-local4.153.0 dry run,6.76KiB/gzip2.67KiB Worker, only ASSETS plus three declared variables. Bundle inputs are RC entry/policy and unchanged staging handler/policy; no production handler, DO or mail code. `rc-dry-run.log`, `rc-bundle-meta.json`. |
| Cloudflare preservation | **PASS for read-only snapshots**, existing staging deployment `dc77ddc8-0ee8-4ad3-bc8b-0d9bf3dad286`, version `97cf3bf6-69c6-43db-b044-cc7704d41e72` at100%; proposed RC Worker/Service absent. Before/after records in sibling evidence. No remote mutations. |

Local runtime tests use Wrangler's `--local-upstream` to present the RC hostname to the exact handler while browsing loopback. Disallowed hostnames/misconfigured environments are exercised directly in Worker unit tests; no hosted RC exists yet. Remote headers, browser rendering, actual provider-origin permissions and Cloudflare edge behavior require post-deployment verification. No physical-device/screen-reader/full-WCAG certification or new Lighthouse measurement is claimed. Existing publication/Privacy/customer-permission and authorized real-inbox tests remain separate owner follow-ups.

## Exact changed-file inventory for Phase8

Relative to the Phase8 starting snapshot, not the earlier baseline dirty tree:

1. Modified `.gitignore` — ignore the separate generated `dist-rc/`.
2. Modified `package.json` — add local `build:rc`/`check:rc` commands only; dependencies/Node requirement/lockfile unchanged.
3. Modified `README.md` — RC local workflow and approval boundaries.
4. Modified `PROJECT_STATUS.md` — preparation decisions, results and handoff.
5. Added `wrangler.rc.toml` — exact separate executable target, account, handler and artifact.
6. Added `worker/rc-policy.json` — fixed approved account/name/hostname/origin identity.
7. Added `worker/rc.ts` — default-only RC wrapper, strict identity and blanket response noindex.
8. Added `scripts/build-rc.mjs` — fixed isolated build/head/header/robots/sitemap export.
9. Added `scripts/check-rc.mjs` — exact config and artifact/body/asset/head isolation checks.
10. Added `tests/rc.test.mjs` —8 targeted RC boundary/response/isolation tests.
11. Added `docs/V2_PHASE8_ISOLATED_RC.md` — this report, commands and verification/recovery procedure.

No deleted source, new page, redesign, animation/business-copy/metrics/testimonial change or dependency added. Existing V2 staging/production configuration and deployed resources are preserved. Logs, browser scripts, local runtime state, manifests/ZIP review package and dry-run bundle are generated/private evidence, not public release assets.

## Deployment procedure — commands prepared, NOT executed

First obtain explicit owner approval covering this separate public RC and its retained publication/Privacy/provider scope. Immediately recheck authenticated account and that **both** proposed Worker and Service are absent;401/403 is not absence. If either exists, STOP for review rather than overwriting it. Compare the existing staging deployment identifier and preserve its versions/backup; inspect any drift instead of automatically rolling it back.

Use the V2 checkout and reviewed Node runtime:

```powershell
Set-Location -LiteralPath 'C:\Users\Jim\Documents\ChatGPT\ITKeepers Website\outputs\v2-business-locations'
$NodeBin = 'C:\Users\Jim\Documents\ChatGPT\ITKeepers Website\outputs\v3-iteration-2\runtime\node-v22.23.3-win-x64'
$env:PATH = $NodeBin + ';' + $env:PATH
$env:WRANGLER_SEND_METRICS = 'false'
node --version
npx --no-install wrangler whoami
npm run check:rc
```

Account must be `eabf58c0ea3cf8629b95c29042124f72`; config must remain the reviewed literal RC name/hostname with `routes = []`, no custom domains/resources and `assets.directory = "./dist-rc"`. Verify the review package's recorded source/config/artifact hashes. Any changed source or artifact needs rebuild/review; do not deploy stale output. A rebuild uses `npm run build`, `npm run build:staging`, `npm run build:rc`, both checkers, TypeScript and the full test suite before approval of refreshed hashes.

Read-only availability checks use Cloudflare GET endpoints:

```text
/accounts/eabf58c0ea3cf8629b95c29042124f72/workers/scripts/itkeepers-v2-rc-20261027/settings
/accounts/eabf58c0ea3cf8629b95c29042124f72/workers/services/itkeepers-v2-rc-20261027
```

Both must still return genuine not-found404 after account/subdomain access is verified. Never print credentials. Then repeat the exact packaging dry run:

```powershell
npx --no-install wrangler deploy --config .\wrangler.rc.toml --dry-run --no-autoconfig --strict
```

**Exact deployment command, only after explicit approval and successful immediate checks:**

```powershell
npx --no-install wrangler deploy --config .\wrangler.rc.toml --no-autoconfig --strict --message 'V2 Phase 1-5 isolated release candidate'
```

No `--name`, `--env`, `--routes`, `--domains`, `--assets`, `--var`, secret-file or account override is permitted. No implicit build hook means this uploads the already reviewed `dist-rc`. Do not use bare `npm run deploy`, `wrangler.toml`, or `wrangler.staging.toml`: those select existing targets. No deployment command without `--dry-run` was executed here.

## Required post-deployment verification

Before sharing the new URL, record its deployment/version ID and compare its hosted assets against the approved RC manifest. Verify:

1. All20 pages return200; canonical/OG/social/JSON-LD origins match RC; noindex meta/header is present on every route. Robots permits public access; sitemap has0 entries and is not advertised.
2. Actual PDF/document GET/HEAD/conditional responses retain noindex, correct MIME/content and security headers. Check redirects, errors, immutable assets, source/config/map probes, and HTTPS HSTS/CSP behavior at the edge.
3. Browser/ChatGPT-User/ordinary crawler requests receive the same public content without authentication or an interstitial; disallowed/custom/version hostnames do not expose the RC.
4. Navigation, both Pulse consultation links, legacy redirects and `?type=review` still work; homepage/Contact selector/prefill and keyboard jump retain their behavior. Repeat Chromium/WebKit mobile/desktop checks with Formspree interception and block all real inquiry submissions.
5. Local `/api/contact`/`/api/inquiry` remain disabled. Verify provider hostname acceptance through authorized account review; a real inquiry/inbox test needs separate explicit approval and does not follow from provider acceptance.
6. Existing staging deployment/version/traffic/bindings and original public responses remain unchanged. No new route/custom domain/production traffic change; official production is not deployed by this RC configuration. Its zone was not visible in the personal account during Phase7, so do not claim production DNS ownership was verified.

If any check fails, stop distribution and inspect. Do not automatically deploy a repair or change another Worker.

## Safe recovery/removal

**The first RC deployment has no earlier RC version to roll back to.** Preserve the existing staging URL as the working fallback; do not use its version IDs with the new Worker. A broken RC is handled by withdrawing its link and, after explicit owner approval, removing only that newly created RC.

Before removal, verify account, exact Worker name, creation/deployment ID and lack of new dependants/routes. Use the dedicated config, first dry-run, then only with removal approval:

```powershell
npx --no-install wrangler delete --config .\wrangler.rc.toml --dry-run
# MUTATION — only after explicit removal approval; confirm the exact RC name.
npx --no-install wrangler delete --config .\wrangler.rc.toml
```

Do not use `--force`, and never substitute an existing staging/production config. After removal, verify RC unavailable and existing staging/production targets unchanged. No removal was executed.

Before any later RC revision, archive the verified good **RC** version ID, deployment,100% traffic/configuration and asset hashes. A later owner-authorized rollback can select that exact RC version:

```powershell
# $RcGoodVersion must be freshly verified as belonging to this RC Worker.
npx --no-install wrangler versions view $RcGoodVersion --config .\wrangler.rc.toml
npx --no-install wrangler versions deploy "$RcGoodVersion@100" --config .\wrangler.rc.toml --dry-run
# MUTATION — only after explicit rollback approval.
npx --no-install wrangler versions deploy "$RcGoodVersion@100" --config .\wrangler.rc.toml
```

The existing staging version `97cf3bf6-69c6-43db-b044-cc7704d41e72` and earlier `1d88e2b0-4e2c-40e0-b92a-4fe310b7beba` belong to `itkeepers-v2-staging`; both were verified available in Phase7 and a pinned selection dry run passed without changing deployment `dc77ddc8-0ee8-4ad3-bc8b-0d9bf3dad286`. They are preservation/fallback evidence, not valid new-RC rollback IDs. Historical backup SHA `11d9c3b85496b3c9f9eb8d609462e1a5c94ec9fa50ca92baf73fd421db12d5fa` remains recorded in Phase6 evidence.

No stateful RC database/email/migration needs restoration. Any later real Formspree submissions would be external effects not undone by a Worker rollback. No existing Worker or production website needs modification to release/remove this isolated RC.

## Handoff and stop point

Done: deployment-ready local RC configuration/output/handler, strict hostname/indexing isolation, complete checks and review evidence. Decisions: reuse the established read-only staging handler; RC-only wrapper/build; frozen-artifact publishing without an implicit build; public access plus noindex. No new business assumption, dependency, infrastructure service or implementation blocker. Needs Jim's approval of the exact isolated public RC before any publication. Existing separate content/Privacy/customer-permission/real-delivery gates are not falsely marked verified.

**Stop before deployment.** Local review can use `http://127.0.0.1:4500/` while the local RC Worker is running. That is a loopback preview, not the public RC hostname. Existing local production preview at4411 and deployed staging/official production were not replaced.
