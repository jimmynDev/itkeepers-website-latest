# V2 testimonial carousel — 13 October 2026

Branch: codex/v2-prompt3-restored, existing 41d5940 base. Local review only; no dependencies, commit, merge, push or deployment. Review: http://127.0.0.1:4385/#client-proof.

## Actual component and cause

src/pages/index.astro renders ClientProof.astro directly between RecordsAdvice and the closing CTA. That component still contained proof-text-grid / proof-text-slot markup and two-column CSS. The existing client-proof.ts controller handled video only. Replaced the actual written layout and added its carousel controller; no duplicate system.

## Current behavior and decisions

WHAT CLIENTS SAY precedes the centered “Clients, in their words.” heading. One white quote and centered company appear on the existing navy surface, with two circular arrows and four dots below. No cards, borders, avatars, logos or decorative quote artwork. Quotes measure 30px at 1440px, 26px at 768px and 20.88px at 360px. Attribution is 16px/#B8C4D6. Shared 1100px container and 96px desktop/56px mobile section spacing remain.

Each settled quote holds for 10 seconds. Sequential 175ms fade-out/fade-in totals 350ms without exposing two quotes together. Hover, focus, hidden documents and page lifecycle events pause rotation. Reduced motion disables automatic rotation and makes manual changes immediate, including live preference changes. Rapid input cancels pending transitions safely.

Jim's later direct request in “Redesign ITKeepers footer” removes the separate pause button. It stays removed. Its removal initially disabled autoplay too; this continuation restores the originally requested autoplay. Activating an arrow or dot stops automatic rotation for the remainder of the page visit, even after focus/hover leave. An accessible description explains that action. Optional support for an explicit rotation control remains reusable. [W3C pause/stop guidance](https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html) was reviewed: temporary focus alone is insufficient, so navigation provides persistent stop.

All slides size one overlapping track, reserving the longest quote naturally: 260px at desktop/tablet and 268.79px at 360px, unchanged across all four quotes. Inactive slides are invisible, aria-hidden and inert. Manual changes announce position/company politely without moving focus; automatic changes do not repeatedly announce. First approved quote remains readable without JavaScript; inactive controls stay hidden.

The four exact quote excerpts, company attributions, approvals and excerpt metadata in src/data/client-proof.ts remain unchanged. Separate video data remains empty. Existing approved-only 16:9 facade and click-to-load player remain intact, without empty area, automatic sources or autoplay. Empty/unapproved written content emits no section when approved videos are also absent.

## Files for the carousel request

- src/components/ClientProof.astro: single quote, controls, styles, initialization; remove grid/card CSS.
- src/scripts/client-proof-carousel.ts: rotation/navigation/fade/pause/stop/reduced-motion/lifecycle.
- tests/client-proof-carousel.test.mjs: seven controller regressions, including actual no-pause-button configuration.
- tests/client-proof-render.test.mjs: exact built quotes, one exposed slide, inert inactive slides, empty/consent/media gates.
- docs/V2_TESTIMONIAL_CAROUSEL.md: current report.
- docs/V2_REAL_CLIENT_TESTIMONIALS.md: prior grid report marked historical.
- PROJECT_STATUS.md and claims-register.md: validation, decisions and local review handoff.

The data array, index placement, shared container, video controller and package files were not modified by this carousel request. Concurrent footer, theme, records-footnote and contact edits were preserved.

## Validation

Implementation: Codex. Visual approval: Jim.

| Check | Result |
| --- | --- |
| Final Astro build / Node22.23.3 | Pass — 16 routes |
| Final regression suite | Pass — 125/125 |
| Actual homepage360/768/1440 | Pass — correct heading, one visible/exposed quote, no cards or horizontal overflow |
| All dots/arrows/wrapping/keyboard Enter | Pass — live browser at all three widths; focus retained |
| Automatic rotation | Pass — desktop/mobile advances observed; exact10,000ms hold/350ms fade verified with controlled timers |
| Persistent navigation stop | Pass — real page unchanged beyond10seconds after hover/focus leave; no-button controller regression passes |
| Hover/focus pause | Pass — live waits exceeding10seconds plus isolated controller tests |
| Hidden tab/page lifecycle | Pass — actual controller tests including interrupted fades/cleanup. Live tab check unavailable: tooling reports inspected tabs visible |
| Reduced motion | Pass — initial/live preference controller tests and CSS rules; live OS preference not changed |
| Longest quote reservation | Pass — all four stage heights identical at each width |
| Contrast | Pass — earlier six day/night width checks with unchanged proof tokens: scoped text minimum8.96:1. Final night checks repeated. Latest owner direction hides theme control, so final day switching not repeated |
| Literal content/empty arrays | Pass — original data SHA256 identical; exact data/built quote tests; actual Astro empty render emits no visible markup |
| Existing videos | Pass — original playback/lifecycle tests. No approved real media supplied for playback review |
| Whitespace | Pass — git diff --check |

Evidence: sibling outputs/v2-carousel-evidence contains final build/tests, final-navigation/runtime JSON and desktop/mobile review captures. Earlier preservation.json verifies the carousel-only snapshot:15other HTML routes/11homepage blocks identical. It predates concurrent owner-authorized footer/theme/records-note edits and is not a claim those final pages remained byte-identical.

No physical-device, Safari or native screen-reader speech review performed; these scoped checks are not full-site accessibility certification. B14: stop for Jim's visual review. No implementation blocker identified for local scope. No release authorized.
