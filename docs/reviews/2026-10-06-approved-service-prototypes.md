# Approved service prototype integration — 6 October 2026

Implemented directly in the existing local project. This replaces the previous Cloud map and Security bands with the owner's final SVG prototypes. Latest steering also replaces the hero paragraph and removes the two animation pause buttons. No Git commands, commit, push, deployment or Phase 3 work.

## Integration

Cloud source: C:/Users/Jim/Downloads/m365-cloud-visual-final-fixed.html. Both supplied SVGs are preserved, including User → Entra ID → Microsoft 365 → Devices / Email & Collaboration → ITKeepers, the management frame, “Managed in context,” and the 4.4-second CSS story. The quiet final ITKeepers treatment and occasional data pulses remain. No Google/AWS nodes, rotating frame or Microsoft border breathing were added.

Security source: C:/Users/Jim/Downloads/deepseek_html_20261005_e02413.html, the attached layered-defense prototype. Both SVGs are preserved: nested Identity / Endpoint / Network / Operations / Recovery layers around Business, threat containment at Network, Operations response, verification and healthy final indicators. Recovery's status dot reaches full opacity while the layer remains quieter. The file contains the required view-box-centered orbit implementation but specifies 100s; the owner's explicit 110s requirement takes precedence. Production uses orbitOps, transform-box:view-box, transform-origin:320px 300px, 110s linear infinite. Main story: 5 seconds. Slow Network flow is retained; no repeated threat or core/background breathing added.

The independent reviewer compared all four SVGs to the sources and confirmed matching markup after whitespace normalization. CSS animation names in Security are scoped to avoid cross-component collisions; orbitOps retains its requested name. Healthy/text colors map to approved tokens where practical, and local day-mode variables preserve readability. No new global colors or section backgrounds. Removed obsolete Cloud/shield theme selectors and consolidated the prototype's duplicate pulse declaration without changing its effective rendering.

## Production lifecycle

Only SVG markup, visual CSS and phase states were extracted. No html/head/body, standalone page backgrounds, preview Replay/Final Frame buttons, preview scripts or extra IntersectionObservers were copied.

The existing shared lifecycle still owns the 600ms entrance, 96px entry / 160px full-exit replay, pausable main duration, document visibility and reduced motion. The adapter sets idle/play/settled phases. An opt-in ambient activity hook is required because these approved final states retain gentle motion after the main story completes. It pauses CSS animations, existing CSS transitions and SVG SMIL offscreen; re-entry after a full exit restores a clean main sequence. The shared entrance transition is excluded from descendant timeline pausing. No additional timer/scroll/RAF system.

Failure restoration now includes the authored phase/motion attributes, so a failed renderer returns to the meaningful static frame. Settled activity refresh does not reveal replay-ready hidden artwork. Other timelines do not opt into ambient behavior and retain their existing policies.

Reduced motion shows the final visual immediately with orbit, threat motion and pulses stopped. No-JavaScript markup is a meaningful settled frame. Both SVG variants retain role=img and their descriptive aria-labels; inactive responsive variants use display:none. No new focusable diagram elements or keyboard traps.

The owner explicitly requested removing the pause animation buttons during implementation. Both buttons, their styles and reserved control padding are removed. Automatic offscreen/document/reduced-motion pauses remain. This owner instruction supersedes the project's default pause-control guideline for these two visuals; this report does not claim formal accessibility certification.

## Layout and copy

Existing service columns, headings, descriptions, Explore CTAs, order and section padding tokens remain unchanged. SVG dimensions follow the approved desktop/mobile aspect ratios and remain substantial within the existing columns. Hero CTA, grid, headline, proof points and styles remain unchanged.

The separately authorized hero paragraph now reads exactly: “Familiar engineers. Shared context. A whole team behind the work.” No other service or marketing copy changed.

## Validation

- Build: PASS, 14 routes.
- Existing relevant suite plus integration regressions: PASS, 51/51. Tests cover preserved lifecycle behavior, opt-in settled motion, offscreen/user/document/bfcache pauses, replay preparation, disposal, reduced motion, phase failure restoration, adapter durations/static states, transition pausing and approved initial SVG content. Assertions about the superseded map were replaced with tests for the approved prototypes rather than relaxed.
- Chrome at 1440 / 1024 / 768 / 390 / 360: both stories enter before playback, main motion pauses offscreen, then settles, ambient CSS/SMIL stops offscreen, full exit/re-entry replays, live reduced motion stops all motion. Reserved figure heights remain equal through these state changes.
- Security desktop/tablet orbit: computed 110s duration, view-box transform and 320px 300px origin; transform advances slowly after settlement. Recovery dot opacity 1.
- Final-state bounds and reduced motion: all requested widths in both day/night, plus 320px reflow. SVG labels remain inside their viewports; no horizontal page overflow. Desktop/mobile screenshots inspected.
- Canvas: existing transparent service backgrounds retained. Hover boundary pixel checks show no hard seam (maximum sampled jump ≤3 RGB levels).
- Prototype-only controls absent; hero paragraph verified in the browser.
- Console/runtime: no errors in final browser checks.
- Independent Design/UIUX review: phase-fallback concern resolved; final review reports no remaining actionable code findings. Current Vercel rules retrieved 6 October 2026: https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md. Owner-approved SVG geometry/orbit takes precedence over generic diagram recommendations. Physical-device/screen-reader testing and formal certification were not performed.

Evidence outside the repository: C:/Users/Jim/Documents/Codex/2026-10-03/hi/outputs/prototype-responsive.json, prototype-final-lifecycle.json, prototype-{cloud,security}-{width}.png. Test scripts remain outside the repo.

## Exact files changed

- src/components/animations/CloudEcosystemAnimation.astro
- src/components/animations/CybersecurityBadgeAnimation.astro
- src/scripts/service-operational-stories.ts
- src/scripts/animation-lifecycle.ts
- public/services-theme.css
- src/components/Hero.astro
- tests/service-operational-stories.test.mjs
- tests/animation-lifecycle.test.mjs
- PROJECT_STATUS.md
- docs/reviews/2026-10-06-approved-service-prototypes.md

Stopped after this scope. Not deployed.
