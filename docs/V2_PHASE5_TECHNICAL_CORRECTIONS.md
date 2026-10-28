# Phase 5 — Targeted technical corrections

27 October 2026, Asia/Beirut. Local candidate on `codex/v2-business-locations`; HEAD remains `bfcd0322174c6bf5a00ed602c47c633fc9aaf337`. All starting Phase 1–3 work is preserved. No commit, push, merge, upload, deployment, real inquiry or remote configuration change.

**Recommendation:** the targeted popup and dependency corrections pass local release checks and are ready for owner review. This is not approval for an official production cutover. Indexing decisions and the previously recorded production Privacy, inquiry-delivery, testimonial-permission and account/domain/rollback checks remain open.

## Popup correction

The reproduced obstruction is on the homepage consultation form, including Company, rather than the standalone Contact route. `src/components/AIPlaybook.astro` mounts only on `/`; `/contact/` has no popup. Both routes were checked.

Before: collision avoidance considered links/buttons, floating controls and current keyboard focus, but omitted input/textarea/select fields. The card could cover Company on desktop.

After: `src/scripts/ai-playbook.ts` includes interactive form controls and their existing `.inquiry-field` wrappers, protecting labels and field errors as well as inputs. It moves the card above the visible form where there is enough room for its existing size. Where that would compress or overlap the card, it temporarily hides the card and makes it inert. Scrolling clear restores it without recording a dismissal or replaying the entrance animation. Focus leaves a card that becomes inert. Resize, visual-viewport resize, scroll and focus changes trigger repositioning; a closing card cannot be reactivated by a queued update.

The popup component, CSS, artwork, copy, entrance/exit keyframes, trigger timing, resource links, 14-day dismissal storage and existing return-focus behavior are unchanged. No hero or service animation changed. Three focused tests cover clearance, temporary yielding/reappearance, focus and dismissal persistence.

**Public before/after copy:** identical. No visitor-facing strings changed in this phase.

## Dependency security

Fresh before/after npm registry audits and official Undici advisories were inspected. Three distinct advisories affected both installed Undici branches:

| Advisory | Severity | Condition / applicability | Result |
|---|---|---|---|
| [GHSA-xjj6-f33q-929c](https://github.com/nodejs/undici/security/advisories/GHSA-xjj6-f33q-929c) | High | Unhandled error with excessive response content encodings; applies to affected Undici clients processing a hostile response. | Both locked branches patched. |
| [GHSA-4qv8-2p9j-2685](https://github.com/nodejs/undici/security/advisories/GHSA-4qv8-2p9j-2685) | Moderate | Unbounded EventSource parser memory; requires using the affected EventSource path with hostile data. | Both locked branches patched. |
| [GHSA-f72v-6w45-q472](https://github.com/nodejs/undici/security/advisories/GHSA-f72v-6w45-q472) | Moderate | Subresource-integrity algorithm-token handling; requires relying on the affected integrity-check path. | Both locked branches patched. |

Patched thresholds are 7.30.1 and 8.12.2 for the affected major branches. No exploit against the public website was established. This is a static Astro build with a separately authored Worker: these npm Undici packages are build/development tooling, not a deployed Astro server or visitor JavaScript dependency. Cloudflare's deployed runtime and Node's bundled fetch implementation are separate from these npm package versions. Developer/build inputs and upstream responses still justify patching the tools.

| Exact dependency path | Before | After | Use |
|---|---|---|---|
| `wrangler → miniflare → undici` (`node_modules/undici`) | 4.151.1 → 5.20261012.1-beta → 7.29.1 | 4.153.0 → 5.20261023.0-beta → 7.30.1 | Development/local Worker tooling. |
| `astro → unifont → undici` (`node_modules/unifont/node_modules/undici`) | 7.3.3 → 0.7.5 → 8.11.2 | 7.3.3 → 0.7.5 → 8.12.3 | Astro font/build tooling; Astro and Unifont unchanged. |
| `wrangler / miniflare → workerd` and its five platform packages | 1.20261012.1 | 1.20261023.1 | Corresponding local tooling release. |

Wrangler is pinned to the compatible 4.153.0 release. npm updated the nested Undici within its existing supported range; no overrides, forced audit fixes or unrelated major upgrades. The lockfile changes ten package versions, preserves all package paths, and also fills the previously absent registry URL/integrity for unchanged `cookie@1.1.1`. `lock-record-diff.json` records every changed lock entry. No unrelated version changes.

`engines.node` now accurately requires `^22.19.0`, previously `^22.12.0`. Undici 8 already required at least 22.19 in the starting dependency tree; this corrects the advertised minimum. `.nvmrc` still selects Node 22. Validation used 22.23.3. README and SECURITY minimum-version guidance are updated. No new architecture or processor; a separate ADR is unnecessary for this maintenance fix.

Before: npm reported three vulnerable packages, one high and two moderate: Undici plus propagated Miniflare/Wrangler findings. These are not three additional independent upstream advisories. After: **zero vulnerabilities**, both full and `--omit=dev` audits. No remaining advisory or broader major update is required by the current audit.

Lockfile-backed `npm ci --ignore-scripts` succeeds; `npm ls --all --json` exits 0 without missing/invalid/extraneous dependencies. npm emits Windows EPERM cleanup warnings for optional WASM-support directories; these are retained in the evidence rather than presented as a warning-free install. Native compiler, tests, builds and local Worker all pass. The original V2 checkout's shared dependencies were preserved; this worktree now has its own ignored dependency directory.

## Staging indexing — recommendation only

**No indexing-policy change implemented.** The approved competition preview currently intentionally self-canonicalizes at `itkeepers-v2-staging.jimnassar99.workers.dev`; its build has 15 indexable pages and five held routes. Five fresh live response hashes match the start of this phase. The number of preview URLs actually indexed by search engines remains unverified.

Safest proposed transition before official production launch:

1. Obtain owner approval to end the public competition indexing policy. Keep production and preview exports/configurations separate.
2. In staging only, emit `noindex, follow` for every HTML route and enforce an `X-Robots-Tag: noindex, follow` response header through the existing `protect()` logic in `worker/staging-handler.ts`, including aliases/error/fallback paths. The current static preview-header rule is not sufficient evidence of blanket noindex: the preview deliberately serves its main routes indexable. Audit every permitted hostname. Do not reuse this Worker as the production handler.
3. Stop advertising preview pages in the staging sitemap; do not submit that sitemap. Keep pages crawlable while relying on noindex. A blanket robots.txt disallow can prevent a crawler from seeing noindex; it is not a substitute. [Google's noindex guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing) explains this requirement. Noindex is not private access control; authenticated preview access is a separate owner decision.
4. Assert the production export retains `https://itkeepers.com` canonical/sitemap URLs and approved indexable pages with no staging-wide noindex directive. Add environment-isolation checks, then verify actual hosted responses after an authorized release. If retiring the preview, plan appropriate redirects to the approved production destinations instead.

Affected future implementation points: `scripts/build-staging.mjs`, `scripts/check-staging.mjs`, `worker/staging-handler.ts`, `worker/public-indexing-policy.json`, tests for those controls, and the separate staging configuration if required. None changed here. Production `src/data/seo.ts`, `src/pages/sitemap.xml.ts`, `_headers`, robots output and both Wrangler configurations are preserved.

## Production archive policy — recommendation only

These four routes currently return published archive content. Staging applies noindex holds and omits them from its sitemap; the production build makes them indexable and includes them in its 19-entry sitemap:

| Route | Recorded pending approval |
|---|---|
| `/blog/` | Archive publication rights/editorial approval. |
| `/2023/09/the-future-of-artificial-intelligence-ai/` | Publication rights/editorial qualifications. |
| `/2023/09/understanding-datafication/` | Publication rights/editorial qualifications. |
| `/2023/10/how-do-ai-and-ml-differ/` | Publication rights/editorial qualifications. |

Recommendation pending owner approval: keep the existing routes available, apply `index: false` consistently through the shared SEO data while the holds remain open, and let the existing sitemap filter omit the same four routes. This would reduce production sitemap entries from 19 to 15, with Privacy remaining separately noindex. On documented publication approval, change each approved route's indexing state and sitemap membership together. Noindex does not supply publication rights or resolve permission requirements. Alternatively, the owner may close the holds before production export. **No route, response, metadata or sitemap policy was changed in this phase.**

Sources: `worker/public-indexing-policy.json`, `src/data/seo.ts:13`, `src/pages/sitemap.xml.ts:5`, `scripts/build-staging.mjs`. This remains a production-launch decision.

## Validation evidence

Evidence directory: sibling `../../v2-phase5-technical-corrections-20261027/` (outside this checkout). Browser harnesses block remote traffic and mock provider requests. No real inquiry or live abuse/security payload was sent.

| Check | Result / evidence |
|---|---|
| Complete suite | PASS, 230/230: existing 227 plus three popup regressions; `tests.log`. |
| TypeScript | PASS, `npm run typecheck`; `typecheck.log`. |
| Production/staging builds | PASS, 20 pages each; `build.log`, `staging-build.log`. Staging checker: 15 indexable/5 held, 2 forms, 28 redirects. |
| Dependency integrity/security | PASS, clean install, installed tree, full and production-filtered audits; `npm-ci-local.log`, `dependency-tree-after.json`, `audit-before.json`, `audit-after.json`, `audit-after-production.json`. |
| Popup browser matrix | PASS, Chromium/WebKit; 320/375/390/768/1024/1440 widths, 900px height plus 480px resize; 650 clearance assertions over focused/unfocused fields/buttons, scroll positions and normal-motion cases. Twelve desktop/mobile Contact surfaces confirm popup absence. Twelve keyboard-dismissal/focus/persistence checks; no page errors or external POST; `popup-browser.json`, screenshots. |
| Consultation flows | PASS, 72 cases: invalid, success, delayed success/error with attempted edits, provider validation/rate/server errors, verification challenge and network failure, homepage/Contact, 390/1440 widths, Chromium/WebKit. Twelve native/no-JS payload cases, eight keyboard jump checks, two manual-JS intent switches; `browser.json`. |
| Additional consultation cases | PASS, six cases: real 15-second local timeouts restore editing, generic inquiry retains generic success, no-JS homepage retains consultation payload, in both browsers; `smoke.json`. |
| Accessibility | PASS for the 20 scoped automated axe/reflow checks from the consultation harness; focus/dismissal and reduced/normal-motion popup behavior tested. No claim of full screen-reader or physical-device certification. |
| SEO/links/schema | PASS, all 20 production/staging pages: no audit failures/warnings; JSON-LD type/property/domain/range checks report no issues against the Phase 4 official Schema.org vocabulary snapshot; `seo-production.json`, `seo-staging.json`, `schema-validation.json`. |
| Local Worker/toolchain | PASS under Wrangler 4.153.0, Miniflare and Workerd: 20 pages/security headers, 28 redirects retaining `?type=review&phase5=audit`, nine status/exposure/robots/sitemap/API-GET probes; `http.json`, `fixture/wrangler.log`. Local-only fixture, not a deployment. |
| Public output scan | PASS, 118 public files/20 HTML pages, no bounded credential/placeholder findings; `security.json`. |
| Deployed staging preservation | PASS for five GET response bodies/statuses: Home, Contact, Privacy, robots, sitemap match starting SHA-256 values; `http.json`. No release operation; active Cloudflare version/account settings not independently verified. |
| Baseline comparison | PASS, `preservation.json` and `lock-record-diff.json`: expected source/document changes only, no deleted source. Both builds retain 118 files. Each changes only the popup module and homepage reference to its new filename; the other 116 files are byte-identical. All 20 pages' copy/links/forms/metadata/schema are identical after normalizing that one script URL. No unexpected difference. |

Source comparison preserves all original office/metric/testimonial/form/Privacy/SEO/Worker/navigation changes. Exact retained claims include `15+ years` / `Experience`, `50+` / `Active clients`, `1,500+` / `Managed endpoints`, and the existing two-location Lebanon/USA metric. Both physical offices and all four testimonials remain unchanged. All Pulse/query/legacy CTA behavior is preserved.

## Exact files changed in Phase 5

1. `src/scripts/ai-playbook.ts` — form-aware collision avoidance, temporary inert yielding, viewport/focus/closing safeguards.
2. `tests/ai-playbook.test.mjs` — three focused behavioral tests and realistic control geometry in the existing fixture.
3. `package.json` — Wrangler 4.151.1 → 4.153.0, Node requirement ^22.12.0 → ^22.19.0.
4. `package-lock.json` — compatible affected dependency chains and synchronized manifest/integrity metadata.
5. `README.md` — current Node/tooling guidance and report link.
6. `SECURITY.md` — current Node minimum and Undici maintenance reference; older historical sections retained.
7. `PROJECT_STATUS.md` — decisions, results, limitations and handoff.
8. `docs/V2_PHASE5_TECHNICAL_CORRECTIONS.md` — this report and unimplemented indexing recommendations.

Builds, logs, screenshots, dependency installation and temporary local Worker state are ignored/generated or outside the source tree. This inventory is relative to the Phase 5 starting snapshot, not a comparison that would incorrectly attribute earlier dirty changes to this phase.

## Remaining risks and approval boundaries

- **Owner decision before official launch:** staging-wide noindex/retirement strategy and the four archive publication/indexing holds. Recommendations above are not published policy.
- **Existing operational release gates:** approved production Privacy/processor/mailbox arrangements; explicit authorized real end-to-end inquiry delivery and inbox verification; direct customer publication permission for the four testimonials; official account/domain/deployment and rollback checks. Provider acceptance alone does not establish inbox delivery. These have not been marked verified by mocked tests.
- **Manual coverage:** real mobile keyboards, physical devices, assistive-technology combinations and field performance remain outside this emulated browser matrix. The existing Phase 4 homepage mobile-paint opportunity remains; no evidence justified changing approved animations here.
- **Scope:** no outstanding reported dependency advisory in the current registry audit and no implementation blocker for these targeted corrections. Future advisories require rechecking before release.

Needs review from Jim: local popup behavior and the proposed indexing/archive policy. Next action is owner review of this local candidate. Any commit, push, merge or deployment requires explicit approval; none occurred.
