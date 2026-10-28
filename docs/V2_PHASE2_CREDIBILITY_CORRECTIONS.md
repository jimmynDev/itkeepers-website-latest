# Phase 2 credibility corrections — 26 October 2026

Done: minimal local copy changes on `codex/v2-business-locations`, HEAD `bfcd0322174c6bf5a00ed602c47c633fc9aaf337`. All pre-existing business-location edits and unrelated work are preserved. No commit, push, merge, upload or deployment occurred.

## Exact public changes

| Source | Before | Final |
|---|---|---|
| `src/components/Hero.astro:9` | `50+` / `Clients supported` | `50+` / `Active clients` |
| `src/components/Hero.astro:9` | `1,500+` / `Endpoints managed` | `1,500+` / `Managed endpoints` |
| `src/components/WhoWeAre.astro:13` | `Meet the team behind the work` | `Discover how ITKeepers works` |

The identity link retains `href="/about/"`, its class and surrounding office paragraph. The homepage metric stays exactly `15+ years` / `Experience`. The `2 locations` / `Lebanon & USA` metric is unchanged. No other public copy, number, quotation, company attribution, approval flag, navigation label or destination changed.

## Experience and numerical consistency

- Searched current website sources/public textual content for 15-year/company-age language, founding/establishment claims, scale counts and obsolete metric labels. Reviewed current generated HTML, while the unchanged public PDF had already been inspected in the preceding Phase 2 audit. No public statement saying ITKeepers itself has operated for 15+ years was found. Therefore no company-age correction was necessary beyond retaining the requested unqualified Experience metric; no individual-engineer or combined-experience explanation was added.
- Jim's current company confirmation establishes that `50+` refers to active clients. No contradictory current public client total was found.
- Jim's current company confirmation establishes that ITKeepers currently manages `1,500+` endpoints. No user count is substituted for this metric. No contradictory current public endpoint total was found.
- The original private project brief's approximate 1,500 users / 2,000 endpoints and approximate 50 clients are historical discovery inputs, not current public metrics. The later owner-confirmed endpoint definition/count and active-client definition govern the present copy. Historical records remain intact; no replacement figure is invented.
- Current SEO, structured data and both company-confirmed physical offices remain unchanged. Existing `Our Team` navigation/footer labels are unchanged.

## Testimonial publication-permission audit

All four quotations and company attributions remain byte-identical in `src/data/client-proof.ts` and in generated HTML. The `approved` and `publicationApproved` fields are unchanged. They are implementation/owner-authorization flags, not proof of customer consent.

| Company | Source | Direct customer publication permission documented? | Owner follow-up |
|---|---|---|---|
| Slide Designers | `src/data/client-proof.ts:36`; claims-register `V2-QUOTE-SLIDE` | Not found in inspected repository evidence | Retain the original dated testimonial and permission from an authorized customer representative for this exact excerpt and company attribution on the public website. |
| PFC International SAL | `src/data/client-proof.ts:43`; `V2-QUOTE-PFC` | Not found in inspected repository evidence | Same; confirm the AI-project/outcome context represented by the original quotation. |
| International Maritime Academy | `src/data/client-proof.ts:50`; `V2-QUOTE-IMA` | Not found in inspected repository evidence | Same; confirm the authority behind the first-person statement and company attribution without inventing a speaker identity. |
| MSAD — Customs Clearance Agency | `src/data/client-proof.ts:57`; `V2-QUOTE-MSAD` | Not found in inspected repository evidence | Same; keep emergency-response praise as an attributed statement, without treating it as an SLA. |

Evidence reviewed: source comments/flags; `claims-register.md` entries dated 13 October, P8-QUOTES and P9-CONTENT-PRESERVE; `docs/V2_REAL_CLIENT_TESTIMONIALS.md`; `docs/V2_TESTIMONIAL_CAROUSEL.md`; `V2_CLAUDE_AUDIT_REFINEMENTS.md` customer-permission checklist. These document Jim's supply/authorization and subsequent preservation authorization. They do not attach direct customer releases. Missing repository evidence is not a finding that permission does not exist. No customer, mailbox or account was contacted or changed.

## Verification

Owner: Codex. Existing dependencies and Node 22.23.3; no package/runtime/configuration changes.

- PASS: production build, 20 pages.
- PASS: TypeScript `npm run typecheck`.
- PASS: all 225 existing tests; no new tests added for three static text replacements.
- PASS: staging build and checker: 20 pages, 15 indexable / 5 held, 2 forms, 28 redirects; production/staging content consistency preserved.
- PASS: production before/after comparison across 118 built files. Homepage differs by exactly the three requested replacements; all other 117 files, including all 19 other HTML pages, are byte-identical. This preserves metadata, JSON-LD, offices, testimonials, CSS/JS/animation assets, routing/header files, forms, CTAs and query parameters. Existing `Our Team` navigation labels are also byte-identical.
- PASS: 216-file source/configuration baseline captured before changes. Only Hero and WhoWeAre changed before adding the project records, and both match their before files with exactly the requested replacements. All previously prepared location source is preserved.
- PASS: local Chromium at 390px and 1440px serves the exact final production homepage; all four metric pairs and `/about/` identity destination verified; no horizontal overflow or page errors.
- PASS: whitespace diff review with CR-at-EOL handling for existing Windows line endings.
- NOT RUN: hosted deployment, real inquiry delivery, physical-device or screen-reader testing. No claim of new deployment or comprehensive accessibility certification.

Evidence: sibling `outputs/v2-phase2-credibility-evidence/` contains the before-source manifest, before build/source snapshots, production/staging/type/test logs, `preservation.json` and `browser.json`.

## Files changed in this phase only

1. `src/components/Hero.astro` — two metric labels.
2. `src/components/WhoWeAre.astro` — identity link text.
3. `claims-register.md` — current company confirmations and explicit consent-evidence boundaries.
4. `PROJECT_STATUS.md` — phase decisions, validation and handoff.
5. `docs/V2_PHASE2_CREDIBILITY_CORRECTIONS.md` — this exact-change and permission report.

Assumptions: no new business facts inferred. Blocked on: no implementation input. Needs review from: Jim, final copy and missing customer-permission records. Deployment: local only, no commit/push/merge/deploy. Next: review the existing local preview at `http://127.0.0.1:4411/`; release actions require explicit approval.
