# V2 real client testimonials — 13 October 2026

**Historical 2×2 layout report. Superseded by [the testimonial carousel review](V2_TESTIMONIAL_CAROUSEL.md).** All approved content remains unchanged.

Implemented on `codex/v2-prompt3-restored` at the existing `41d5940` base.
All prior uncommitted work is preserved. No dependencies, commit, merge, push
or deployment. Stop for Jim's visual review.

The existing `ClientProof.astro` now displays the four exact excerpts supplied
by Jim, in the supplied order, attributed to Slide Designers, PFC International
SAL, International Maritime Academy and MSAD — Customs Clearance Agency.
The heading and eyebrow remain “What our clients say.” / “WHAT CLIENTS SAY”.
Placement remains after “Clear records. Honest advice.” and before
“See what your IT could do better.”

The single data source remains `src/data/client-proof.ts`. Each supplied entry
has `approved: true`, `excerpt: true` and an explicitly approved company
attribution. No individual name, role, logo, avatar, image or new client claim
was added. Quote punctuation, spelling and attribution are unchanged. In
particular, the MSAD quote retains its supplied ASCII hyphens, while its company
attribution retains the supplied em dash. HTML escaping does not change the
rendered text. Empty/unapproved-data and attribution-permission guards remain.

The desktop grid is strictly two columns, with equal row heights; mobile stacks
below 768px with natural card heights. Navy surfaces, thin light-blue borders,
existing radii and subtle glow remain. A small cyan quotation mark is decorative
and has `aria-hidden="true"`. Quotes are 18px/1.6/#E6ECF5 and company attributions
are 14px/#B8C4D6, aligned at the bottom of each desktop card. The obsolete
three-column rule and modifier class were removed.

RecordsAdvice, ClientProof and the closing CTA now share the same centered
1100px container, including responsive gutters and existing safe-area padding.
Their existing shared vertical spacing remains 96px at 768px and above, 56px
below 768px. Only the shared width rule changed for the adjacent sections.

## Future video area

The separate `videoTestimonials` array remains empty. The existing reusable
16:9 video area stays inside ClientProof and renders only for approved,
complete media. There is no empty placeholder on the homepage. Poster facade,
explicit play button, `preload="none"`, captions, transcript, approved selectors
and offscreen/navigation cleanup are preserved. Video sources and caption tracks
attach only after playback is requested. There is no autoplay. The existing
`src/scripts/client-proof.ts` controller was not modified.

## Changed files in this request

| File | Change |
| --- | --- |
| `src/data/client-proof.ts` | Four exact owner-supplied excerpts/companies and excerpt metadata |
| `src/components/ClientProof.astro` | Strict 2×2 desktop grid and small decorative cyan quotation mark |
| `src/styles/home-review-sections.css` | Shared container changed from 1240px to 1100px |
| `tests/client-proof-render.test.mjs` | Exact four-entry data and decoded built-HTML checks; retain isolated empty-state/media/consent checks |
| `tests/phishing-decision-experience.test.mjs` | Replace stale empty-data expectation with the actual approval gate |
| `docs/V2_REAL_CLIENT_TESTIMONIALS.md` | Current report |
| `docs/V2_TESTIMONIALS_ALIGNMENT.md` | Mark earlier empty-state report historical |
| `claims-register.md` | Exact supplied content, source and local authorization |
| `PROJECT_STATUS.md` | Result, validation and visual-review handoff |

The existing dirty BusinessValue, CTA, RecordsAdvice, index and rendering-helper
files were not edited during this request.

## Validation

Implementation checks: Codex. Visual approval: Jim.

| Check | Result |
| --- | --- |
| Astro build, existing Node 22.23.3 runtime | **Pass** — 16 routes |
| Regression suite | **Pass** — 118/118 tests |
| Exact content and companies | **Pass** — source data and decoded built HTML match all four supplied strings; exactly four cards, each marked as an excerpt in data |
| 360px, both themes | **Pass** — four stacked cards; aligned section headings; no horizontal overflow or measured clipping |
| 768px, both themes | **Pass** — 2×2 grid; all four cards 308.8px tall; aligned section headings |
| 1440px, both themes | **Pass** — 2×2 grid; all four cards 251.2px tall; all three heading left edges 186.4px in the measured browser |
| Scoped WCAG AA text contrast | **Pass** — minimum 8.27:1 across the three sections in each theme. The existing surrounds/cards remain navy in both hero theme modes |
| Typography | **Pass** — quotes 18px/28.8px line height; attributions 14px; body/helper minima retained |
| Empty video state | **Pass** — no video, figure or image rendered in ClientProof |
| Future video behavior | **Pass** — existing rendering/playback/lifecycle regressions; no automatic source/track loading or autoplay |
| Scope preservation | **Pass** — all 15 other HTML routes and all 11 pre-existing homepage blocks are byte-identical; BusinessValue's pre-existing diff is identical |
| Browser errors | **Pass** — none recorded |
| Diff whitespace | **Pass** — `git diff --check` |

Screenshots, viewport/contrast JSON, build/test logs and preservation evidence
are in sibling `outputs/v2-real-testimonials-evidence/`. No test content was
added to the public homepage. Visual desktop/mobile captures were inspected.

No implementation issues remain in this scope. B15 is resolved for these
owner-supplied written excerpts and company attributions in the authorized local
review. Approved video assets are still absent; real-media playback and device
checks must follow when those assets are supplied. Photos/logos remain excluded.
This scoped contrast/layout check is not a full-site accessibility audit; native
screen-reader, physical-device and Safari checks were not performed.

Review: http://127.0.0.1:4383/#client-proof. B14 remains with Jim for visual review.
No merge, push or deployment.
