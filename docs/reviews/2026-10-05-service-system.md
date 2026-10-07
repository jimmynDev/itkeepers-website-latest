# Homepage service canvas and viewport entrance — 5 October 2026

Scope: all homepage service chapters and the Web Design & Hosting banner. No animation redesign, copy/order/route changes, Git commands, commit, push, deployment or Phase 3 work.

## Continuous canvas

The original seams came from opaque chapter backgrounds covering the body-level pointer light, clipped chapter-specific hover pseudo-elements, and visible horizontal chapter/banner borders. The earlier correction only made Service 01 transparent.

All dark-mode service chapters and the Digital Services banner now reveal the same approved body canvas, --itk-bg (#081321), and the same continuous pointer illumination. Section-specific hover overlays are disabled. Borders retain their layout width but become transparent, preserving spacing. Existing animation-interior glow, service accents and title atmosphere remain intact. Day-mode palette remains supported.

The shared cyan hover light is restrained to 6% at its center, 3.5% in the middle, and 1.5% at its outer shoulder, then transparent. This preserves readable text and the violet AI CTA: conservative flat-canvas peak contrast for #8175E8 is 4.59:1. There is no section fill change on hover and no new gradient band or spacer.

## Shared animation entrance

The existing animation-lifecycle.ts controller automatically opts homepage service figures into a presentation state. No new per-component scroll JavaScript or observer system was added.

- Waiting: visual opacity 0 and translateY(16px), with full dimensions reserved; hidden visual controls are inert. Number, H2, paragraph and CTA remain visible and searchable.
- Meaningful entry: existing -96px viewport boundary starts a 600ms opacity/transform entrance using the established easing. Internal sequence/CSS/canvas motion remains paused during entrance.
- Playback: after 600ms, visual controls are restored and the existing approved sequence starts. Internal story timing is unchanged.
- Shallow exit: pauses tasks/motion and resumes remaining playback/entrance on return.
- Full exit: existing 160px spatial boundary re-arms the visual entrance and pristine story replay. Interrupted entrances cancel/reset cleanly; repeated mounts do not add duplicate work.
- Reduced motion, missing IntersectionObserver or renderer failure: meaningful static final state is visible immediately, without entrance movement. No-JavaScript markup also remains readable.

All five existing homepage animation visuals use this behavior independently: Managed IT, Microsoft 365 & Cloud, Cybersecurity, Networking and AI & Automation. Web Design & Hosting is currently a text-only homepage banner; there is no homepage Web Design animation to hide or enter. Its canvas is included in the cleanup, and its existing detail-page animation remains unchanged.

Approved playback policy is retained: Managed IT, Networking and AI continue while visible; Cloud and Cybersecurity settle after their approved sequences. The current 96px entry and 160px full-exit hysteresis remain unchanged.

## Validation

- PASS: build, 14 routes.
- PASS: 40/40 tests (35 existing plus 5 meaningful entrance/replay/fallback cases).
- PASS: Chrome at 1440/1024/768/390/360. All five visuals wait at a shallow viewport glimpse, enter over 600ms, then play; offscreen pause and full-exit replay checked independently. Reserved figure bounds remain equal before/after entrance and replay; no section jump or horizontal overflow.
- PASS: all six dark-canvas boundaries, including the Digital Services banner, checked with pointer illumination above and below each boundary. Transparent canvas/borders and naturally continuous pixel gradients verified.
- PASS: reduced-motion static states across all five visuals at all widths; no-JavaScript fallback visible; bounded sequences settle and continuous Managed IT remains running beyond its former end time.
- PASS: no console/runtime errors. Existing copy, animation sources, palette, routes and order preserved.

Evidence in C:/Users/Jim/Documents/Codex/2026-10-03/hi/outputs/: service-system-lifecycle-results.json, service-system-results.json, service-canvas-*-hover.png. Browser test script is outside the repository.

## Exact files changed for this correction

- public/services-theme.css — global shared canvas/hover cleanup and visual entrance CSS.
- src/scripts/animation-lifecycle.ts — shared entrance scheduling, replay and accessible visual state.
- tests/animation-lifecycle.test.mjs — entrance, interrupted replay and fallback coverage.
- PROJECT_STATUS.md — scope and validation record.
- docs/reviews/2026-10-05-service-system.md — this report.

Earlier title refinement was completed separately in Services.astro with a semantic-heading assertion update in service-chapters.test.mjs. It was preserved during this correction.

Stopped; not deployed.
