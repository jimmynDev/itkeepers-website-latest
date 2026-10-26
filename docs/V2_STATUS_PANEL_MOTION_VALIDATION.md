# Status-panel looping and consultation wording — 26 October 2026

Current checkout: `codex/v2-prompt3-restored`, HEAD `e86d5ff1f7f22ee0135d6071f8377106c0a31260`. Local implementation only; no commit, push, merge, deployment or dependency change. Existing unrelated changes were retained.

## Changes and decisions

The earlier cleanup intentionally routed the status panel through `mountAmbientPreview`, which removed its animations after five seconds. The owner's new request supersedes that limit for this panel. It now uses its own small controller, `src/scripts/hero-status-motion.ts`. Other sections keep their existing finite-preview behavior.

The original CSS clocks from `itkeepers-status-box.html` remain: floating 7s, scan 5s, horizontal beam 3.2s, indicator ring 2s, and three activity messages on a 12s cycle with 0/4/8s delays. CSS repeats these continuously. The five row entrances remain 0.8s, with the original stagger, and finish once. Visibility, document suspension, bfcache and user input pause the existing clocks instead of removing/recreating them. Reduced motion/forced colors display a static first activity message and hide the unnecessary control; no-JS is also static.

The discreet pause/play button has a 14px SVG icon in a 24px native button, an action-specific accessible name, visible keyboard focus and a tooltip. It occupies existing space below the panel without adding layout height. Its entire focus ring fits above the metrics at small widths. It uses the hero's existing theme-aware text/accent/focus tokens. Panel design, colors, copy, type, spacing and hero layout are unchanged. The Example view indicator remains.

The owner's subsequent instruction renames **IT review** to **IT consultation** across website copy: navigation/feature CTA, footer, form heading/button, prefilled message, Formspree and disabled-worker email subject, mailto draft, contact metadata, and Privacy references. Existing `?type=review` URLs and internal form intent values remain compatible; those are routing identifiers, not customer-facing terminology. Privacy processing/retention/inbox/rights disclosures otherwise remain intact. Historical project records and internal filenames were not rewritten.

## Validation

Evidence is in sibling `outputs/v2-status-loop/`. Owner: Codex for implementation/automated checks; project owner for visual review.

| Check | Result | Evidence |
| --- | --- | --- |
| Astro build | Pass | `build.log`; 20 pages |
| TypeScript | Pass | `typecheck.log` |
| Automated tests | Pass | `tests.log`; 212/212, including new controller and published terminology checks |
| Continuous motion, real elapsed time | Pass | `review.json`: desktop 1440px ran 32,025ms; mobile viewport 390px ran 32,015ms. All seven CSS loop objects remained running with advancing clocks and unchanged identities; all three messages appeared. Exactly five row entrance completions, with no replay. |
| Loop-boundary behavior | Pass | 1,809 sampled frames per viewport, zero fully blank activity frames after entrance; scan resets occurred wholly outside the panel. Maximum sampled float step under 0.07px for frames less than 40ms apart. Source CSS durations/delays/iterations verified. |
| Pause/play and visibility | Pass | Keyboard Space/Enter, stationary clocks while paused, same-clock resume, explicit pause surviving viewport exit/re-entry, offscreen suspension, reduced-motion changes and no-JS fallback. Unit tests additionally cover document/bfcache gates, idempotence and cleanup. |
| Final control / responsive accessibility | Pass | `controls.json`: 320/375/390/768/1024/1440px; usable target, full focus ring above metrics, no overflow, zero scoped axe WCAG A/AA findings. This final control check follows the long motion run and changes only control sizing/theme styles. |
| Touch and themes | Pass | `theme-touch.json`: touch emulation pause/play and keyboard focus; day/night icon contrast against the base canvas exceeds 7:1 and focus exceeds 8:1; forced colors static. These are emulated checks, not physical-device results. |
| Source-panel fidelity | Pass | `reference.log`: zero computed layout/type differences inside the panel at 320/390/901/1024/1440px, using the established Example view/stopped decorative-effect reference for reduced motion. |
| Consultation terminology / forms | Pass | Built HTML/browser JS scanned by test; three mocked form acceptance paths, new subject/prefill and compatible review-intent URL verified. No real submission sent. Source/public/worker scans found no old customer-facing phrase. Downloadable 26-page AI governance PDF has no matching old phrase in 22,291 extracted characters and is unchanged. |
| Vercel UI review | Pass for scoped changes | Official skill/current rules retrieved 26 October 2026. Fixed a mobile focus-ring overlap and checked both hero themes. The original bounded beam-left and ring-shadow animations are intentionally retained at the owner's request; no animation library or new asset dependency. |
| Actual mail delivery / deployment | Not applicable | Local-only request, mocked provider responses |
| Physical devices, Safari, native screen-reader speech, actual browser zoom, field performance | Not performed | Manual follow-up; automation does not establish those results |

Guidelines: [Vercel skill](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md), [current rules](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md).

## Handoff

Done: looping fix, accessible compact control and sitewide consultation terminology. Decisions: isolate the panel exception from other finite decorations; preserve source CSS clocks and compatible URLs. Proposed assumptions: none. Implementation blockers: none. Needs review from: project owner, visual review. Files: panel component/new motion controller, inquiry/navigation/SEO/footer/Privacy wording, one worker subject literal, related tests and project records; see evidence inventories. Deployment: local preview on port 4400, no Git or remote mutation. Next: owner review; actual device/assistive-technology checks remain manual follow-up.
