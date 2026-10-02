# Home redesign — SEO and performance review

Date: 1 October 2026 (Asia/Beirut). Owner: Agent 02; integrator: parent/Workflow. Scope: local homepage redesign and the shared head affected by it. No deployment or production readiness is asserted.

## Sources and decisions

Read root `AGENTS.md`, current `PROJECT_STATUS.md`, brief, site map, claims register, Agent 02 instructions, existing layout/routes, Astro/package configuration, public crawler files, and adjacent Home components. All required assigned sources were present. The root instructions override stale filenames or draft publication proposals in the role/brief.

- Keep Astro, canonical host `https://itkeepers.com`, current routes, deployment configuration and package/lockfile unchanged.
- Remove unsupported `LocalBusiness`, `ITStore`, geographic `areaServed` and expertise properties from the shared schema. Emit minimal `Organization` name/URL/stable identifier; Home also emits `WebSite` referencing it. Schema contains no addresses, phone numbers, figures, reviews, certifications or unapproved coverage.
- Use the approved central positioning for Home/default metadata. Operational claims and geographic scope need their existing publication inputs rather than being amplified in hidden metadata.
- Retain semantic native links/buttons, the skip link, initial HTML explanatory content and progressive enhancement. Do not encode tool answers in URLs to meet a generic guideline preference.

Official references retrieved 1 October 2026: [Organization](https://schema.org/Organization), [WebSite](https://schema.org/WebSite), [Core Web Vitals thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds), [Vercel review skill](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md) and [current review rules](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md). Agent 01 owns the combined Vercel review; this document covers semantics and performance support.

## Validation

| Check | Result | Evidence / owner |
|---|---|---|
| Revised Home metadata and JSON syntax in local dev HTML | Pass | HTTP 200 at `http://127.0.0.1:4321/`; Home canonical remains `https://itkeepers.com/`; parsed schema shape inspected; Agent 02 |
| Initial headline | Pass | One HTML H1: “Your IT person is a team.”; no changing/JavaScript-only headline; Agent 02 |
| Final production-mode semantic/head/schema/link checks | Pass (scoped) | Fresh build served through Wrangler `http://127.0.0.1:8788/`: all ten local routes return 200, one H1/main and `lang="en"`; all root-relative links/fragments resolve; no duplicate IDs. Home heading hierarchy H1→H2→H3, parsed Organization/WebSite JSON-LD, self-canonical; `.codex/qa/2026-10-01/seo-static-audit.json`; Agent 02/Workflow |
| Final image sizing/loading | Pass | Parent captured the existing official image through the first-party browser, copied unchanged to local asset. PNG bytes verify 1,747×289 / 17,991 bytes; both instances reserve intrinsic dimensions, footer lazy/async, header not lazy. No remote image/network dependency remains; Agent 01/parent/SEO |
| Lighthouse mobile measured performance | Pass | Three comparable Lighthouse 13.5.0 mobile lab runs against local Wrangler: 100/100/100; median LCP 1.258s, CLS 0, TBT 0ms. Reproducible configuration and limitations below; Agent 02 |
| Field LCP/INP/CLS | Blocked | No authorized field dataset available. Lab measurements cannot establish real-user Core Web Vitals; Agent 02/owner |
| Production compression/caching/headers/indexability | Blocked | No deployment authorized or actual deployed revision verified, B11; Workflow/Security |
| Public preview authentication | Not applicable | Requested preview bound to local loopback, not publicly hosted. A future hosted preview needs authentication and noindex independently; Workflow |
| Form delivery/state audit | Not applicable | No active inquiry form or new collection in the scoped redesign; B3/B13 still block collection; Security/Workflow |

## Existing release issues outside the redesign

- `public/robots.txt:3` references `https://itkeepers.com/sitemap-index.xml`; the repository contains `public/sitemap.xml` and no sitemap-index. Existing crawler policy approval and actual deployed response remain B11 inputs. This redesign leaves policy/configuration intact and does not infer approval from `docs/drafts/robots.txt`.
- Current sitemap includes local draft/about/network routes whose publication gates remain unresolved. Route release status and production sitemap require the wider release review; Home redesign does not complete that work.
- Home and four non-Home pages currently share the safe default description; the non-Home inventory still needs unique approved descriptions and service schema. Changing the default to safe positioning removes unsupported geographic wording but does not complete route-level SEO. This is recorded separately from Home's accurate metadata/schema check.
- B9 purchasing/self-check rules, B5 team/photo inputs, B6 coverage and B7 restore/reporting approvals remain unchanged. No metrics, real-person photos, testimonials or default tool outcomes added by SEO.

## Vercel semantic/performance findings

- `src/layouts/Base.astro:10` — fixed unsupported business/location schema; minimal approved identity used instead.
- `src/layouts/Base.astro:4` and `src/pages/index.astro:4` — fixed geographic/default operational metadata; central positioning used.
- `src/layouts/Base.astro:60` — fixed by Design: local official image with width/height, lazy loading and async decoding.
- `src/components/TeamThread.astro` — existing scroll handler batches chapter layout reads before CSS writes, gated by viewport/reduced-motion/visibility; no continual timer. Final rendered/reduced-motion review owned by Agent 01.
- Home explanations, five process panels and native daily/layer disclosures remain initial HTML; no SEO dependency on executing motion scripts.

## Handoff

- Done: scoped inspection and accurate shared/Home metadata/schema corrections.
- Decisions made: minimal schema using known brand identity; preserve host, routes and architecture.
- Assumptions Proposed: per-route budgets will be baseline proposals until project owner adopts them as CI gates.
- Validation: dev and fresh static HTML checks above; lab measurements completing below.
- Blocked on: existing B11 deployment/crawler inputs and B14 device checks; unavailable field performance does not block local implementation.
- Needs review from: Design for combined semantics/Vercel review; parent/Workflow for integration.
- Files changed: `src/layouts/Base.astro` frontmatter/head only, `src/pages/index.astro` description prop only, this report. No commit created.
- Deployment: local dev preview only; no push/deploy/DNS or dependency changes.
- Next: parent records final browser/device limitations and preview handoff; adopt budgets and resolve broader release inputs separately.

## Measured mobile lab performance

These are local lab results, not real-device/field Core Web Vitals or production response evidence. Tested built Home at `http://127.0.0.1:8788/` using the installed Chrome 148.0.7778.217, Lighthouse 13.5.0, Node 24.21.0, default simulated mobile throttling: 150ms RTT, 1,638.4Kbps throughput, 4× CPU slowdown; 412×823 CSS-pixel mobile emulation at DPR 1.75. Each CLI run used a fresh browser/storage-reset run. No project package or lockfile changed; Lighthouse resolved only through npm's cache.

| Run | Performance | LCP | CLS | TBT | Speed Index | Total transfer |
|---|---:|---:|---:|---:|---:|---:|
| 1 | 100 | 1.443s | 0 | 0ms | 2.258s | 36,429B |
| 2 | 100 | 1.258s | 0 | 0ms | 2.103s | 36,429B |
| 3 | 100 | 1.257s | 0 | 0ms | 2.079s | 36,429B |
| Median | 100 | 1.258s | 0 | 0ms | 2.103s | 36,429B |

All runs meet the repository's mobile Lighthouse ≥90 target. TBT is a lab blocking-time metric; it is not field INP. Field LCP/INP/CLS remain unavailable. Three JSON audit artifacts and `lighthouse-home-mobile-summary.json` are in `.codex/qa/2026-10-01/`. Static resource fingerprints and the ten-route semantic/link inventory are in `seo-static-audit.json`; no Git commit exists for this candidate.

Repeat the command with `N` replaced by the run number:

```powershell
npm exec --yes --package=lighthouse@13.5.0 -- lighthouse http://127.0.0.1:8788/ --only-categories=performance --chrome-path='C:\Program Files\Google\Chrome\Application\chrome.exe' --chrome-flags='--headless --disable-gpu --no-first-run' --output=json --output-path=.codex/qa/2026-10-01/lighthouse-home-mobile-N.json --quiet
```

Measured Home assets: JavaScript 2,669B raw / 1,360B gzip, CSS 26,295B raw / 6,602B gzip, official logo 17,991B raw. Gzip here is an artifact comparison and excludes HTTP headers; actual local transfer is recorded in the audits. `seo-asset-baseline.json` inventories each route's assets and records **Proposed** Home regression budgets: JS ≤5KiB raw, CSS ≤30KiB raw, major image ≤25KiB raw, initial transfer ≤50KiB, Lighthouse mobile ≥90. The measured candidate fits these proposals. They are not newly enforced CI gates or owner-approved long-term budgets.

Optimization findings retained for review:

- Initial run attributed 176ms forced reflow to existing TeamThread startup geometry; runs 2/3 reported none, all TBT values 0. Parent notified of a low-risk viewport short-circuit opportunity in `configure()`; no uncoordinated source change made.
- Three small stylesheets block rendering; Lighthouse estimated about 150ms potential savings. Current budgets pass; no architecture/CSP change justified by this estimate.
- The full official PNG is larger than its displayed size; Lighthouse estimates ~17KiB savings, with zero estimated LCP savings. Byte-preserving official identity is retained; smaller approved derivatives can be prepared later.
- Browser requests nonexistent `favicon.ico` (404), a preexisting low-impact asset omission. No fabricated logo variant or unapproved icon added.
