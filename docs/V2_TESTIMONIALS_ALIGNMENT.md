# V2 testimonials and homepage alignment — 13 October 2026

**Historical empty-state report. Superseded by [the real testimonials review](V2_REAL_CLIENT_TESTIMONIALS.md).** The supplied four excerpts now render; the shared container is 1100px and the desktop grid is 2×2.

Implemented locally on `codex/v2-prompt3-restored`, inspected at `41d5940`.
Astro 5.18.2, existing Node 22.23.3 runtime, Cloudflare Worker static assets
(`wrangler.toml`), no dependency or deployment-configuration changes.
No commit, merge, push or deployment was performed. Stop for Jim's visual review.

## Result and content controls

The existing `ClientProof.astro` implementation is reused in its existing position
after RecordsAdvice and before the closing CTA. Its heading is now exactly
“WHAT CLIENTS SAY” / “What our clients say.”

`src/data/client-proof.ts` remains the single editable data source. Neither an
approved quote nor complete approved video was present in the inspected arrays;
the unapproved empty slots have been replaced with empty editable arrays. The
homepage therefore renders no testimonial section, heading, placeholder, player,
attribution or section spacing. The component also guards its own visible markup.

Only nonblank quotes with `approved: true` render. The stored quote is rendered
verbatim with HTML escaping and preserved whitespace, without shortening it.
Names, roles and companies render only when their attribution object has
`publicationApproved: true`; that flag covers all populated fields. Confirm and
record exact content and publication permission before enabling either approval.

Approved complete videos remain supported when quotes are absent. Their existing
controller was not edited. Posters, captions, transcripts, manual selection,
explicit playback, offscreen/hidden-page pause and navigation cleanup remain.
The video element retains `preload="none"`, with no source or caption tracks
attached until the visitor plays it. Only ready, approved selectors render.
No real approved video assets were available for playback/device verification.

## Layout

All three sections use one centered 1240px container including their gutters:
`home-review-container` in `src/styles/home-review-sections.css`. Section gutters
are applied once, removing the records section's former double inset. Safe-area
padding is retained. Section padding is 96px above and below at 768px and wider,
56px below 768px.

Quotes use two columns at 768px, three at 1100px when at least three quotes exist,
and one column below 768px. Desktop grid rows have equal heights; mobile cards
use natural heights to avoid unnecessary blank space. Cards reuse the existing
navy surface, radius, cyan border and subtle glow treatment. Quotes use 18px /
1.6 / #E6ECF5; attributions use 14px / 1.6 / #B8C4D6 and sit below the quote.
There are no quote-card images, avatars, faces, carousel or new animations.

Scoped body text remains at least 16px. The records footnote is 14px and
“Prefer to talk?” retains the existing shared 16px readability override. Both
use #B8C4D6. Eyebrows use the existing 14px label token. Existing dark surrounds
remain dark in both hero theme modes; no new theme behavior was introduced.

Removed CSS belongs only to deleted pending media/quote markup or container and
spacing rules replaced by the shared rule. Other section CSS was not cleaned up.

## Files changed

| File | Change |
| --- | --- |
| `src/components/ClientProof.astro` | Guard, exact heading, approved cards, attribution gating, ready-only media UI and scoped styles |
| `src/data/client-proof.ts` | Empty editable arrays, quote readiness, explicit attribution permission and approval documentation |
| `src/components/RecordsAdvice.astro` | Shared container, shared spacing and 14px eyebrow |
| `src/components/CTA.astro` | Shared container/spacing, supporting color, line height and 14px eyebrow |
| `src/pages/index.astro` | Shared CSS import and reusable quote-readiness gate |
| `src/styles/home-review-sections.css` | Single container and spacing rules for the three requested sections |
| `tests/client-proof-render.test.mjs` | Actual component rendering checks for empty/withheld content, literal quotes, attribution consent and approved media |
| `tests/helpers/client-proof-render.mjs` | Isolated component compiler/container harness using existing packages |
| `docs/V2_TESTIMONIALS_ALIGNMENT.md` | This report |
| `claims-register.md` | Supersede the historical local placeholder permission |
| `PROJECT_STATUS.md` | Current decision, validation and review handoff |

The pre-existing `src/components/BusinessValue.astro` edit is not part of this
task; its diff was captured before editing and preserved exactly.

## Validation

Owner of implementation checks: Codex. Owner of visual approval: Jim.

| Check | Result and evidence |
| --- | --- |
| Baseline build/regressions | **Pass**: 16 routes and 114/114 tests before editing |
| Final Astro build | **Pass**: 16 routes, Node 22.23.3 |
| Final regression suite | **Pass**: 117/117 tests, including three new rendering tests and existing playback/lifecycle tests |
| 360 / 768 / 1440px, day/night | **Pass**: six final homepage cases and six isolated populated-card cases; aligned left edges, no document overflow or measured element clipping |
| Desktop card heights | **Pass**: fixture cards all 272.8px at 768px and 244px at 1440px; one-column natural-height stack at 360px |
| Typography | **Pass**: quotes 18px / 28.8px / rgb(230,236,245), attribution 14px / rgb(184,196,214), navy rgb(13,21,37) surfaces; supporting text sizes as documented above |
| Scoped text contrast | **Pass**: lowest measured contrast 8.27:1 in both theme modes, exceeding applicable AA text thresholds; this is a changed-scope contrast check, not whole-site accessibility certification |
| Empty and unapproved data | **Pass**: actual component has no visible markup; actual built homepage contains no proof section, pending text or test-fixture content |
| Attribution permissions | **Pass**: quote approval alone does not expose identity fields; explicit attribution permission exposes unchanged supplied fields |
| Video preservation | **Pass** for rendering/controller regression checks: no automatic source/track attachment; approved-only selectors, captions, transcript and lifecycle behavior retained |
| Real testimonial video playback | **Not applicable**: no approved assets were supplied; recheck when permitted media is added |
| Scope preservation | **Pass**: all 15 other HTML routes are byte-identical; all nine untouched homepage blocks are byte-identical; pre-existing BusinessValue diff is identical |
| Browser errors | **Pass**: none recorded in the built review page |
| Dependency changes | **Pass**: package manifests and lockfile untouched |
| Diff whitespace | **Pass**: `git diff --check` |

Evidence is stored outside the application build in sibling
`outputs/v2-testimonials-evidence/`: build/tests logs, viewport JSON, preservation
JSON, desktop/mobile review captures and six populated-fixture screenshots.
Synthetic layout strings are explicitly marked TEST FIXTURE ONLY, injected only
into an isolated in-memory renderer/local diagnostic page. They are never added
to production data, source routes or the `dist` output.

No full-site audit, physical-device/Safari/native screen-reader checks, release
checks or actual inquiry delivery were undertaken for this scoped task.

## Outstanding review

B15 remains open with Jim/client owners: exact approved quotes and any permitted
identity/media are needed only to populate the currently absent section. There
is no implementation blocker for the required empty state.

B14: Jim reviews the local built homepage at
http://127.0.0.1:4383/#records-advice. The requested visual stop is in effect.
There are no other known implementation issues in this scope. No release action
is authorized by this handoff.
