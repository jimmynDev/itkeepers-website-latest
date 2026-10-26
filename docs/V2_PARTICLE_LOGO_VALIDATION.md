# V2 fixed-flow particle K — 16 October 2026

This revision supersedes the earlier assembly/reveal implementation. Local V2 work only, on `codex/v2-prompt3-restored` at inspected HEAD `22b5c2f9e74d9c734137036ec74a3db289c67761`. Existing Cloudflare Workers static-assets configuration remains unchanged. No commit, push, merge or deployment.

## Result

The existing isolated `ParticleLogoAnimation.astro` now runs the supplied `itkeepers_K_fixed_particles (1).html` animation. The K is fully formed from its first particle frame, flows continuously around fixed home positions and responds to the mouse. There is no scattered assembly, reveal, progress fade or completion timer. The original largest-connected-bright-region mask, cyan/white particle colors, background stars, dual slow-flow waves, spring/damping constants, mouse swirl and 22px/30px displacement limits are retained.

The supplied embedded PNG is extracted byte-for-byte to `public/assets/itkeepers-particle-k.png`; no reference document layout, metadata or schema is embedded. The existing official static fallback, visual container style, Pause/Resume control and reserved dimensions remain. `WhoWeAre.astro` is unchanged in this revision: heading, proof points, typography, two-column/mobile layout, section IDs and navigation are preserved.

Only sizing is adapted to the existing column: fit the original 740:830 sampling aspect into its central 62%, at 49% vertical center. The reference's desktop/mobile 6px/8px mask sampling and 2% random thinning remain; the mobile branch follows the actual viewport below 640px rather than the narrower component width. Typical observed counts were 7,846 desktop / 4,426 mobile, plus the reference's 125/55 stars. Counts vary slightly with the original random thinning.

## Lifecycle and performance

- Reuse the existing shared `mountAnimation` with explicit continuous playback. No second IntersectionObserver system. Every entry starts fully formed; no reveal can replay.
- Pause offscreen, when the document is hidden, or via the existing Pause control. Re-entry follows the shared lifecycle rules. Pointer input excludes touch and is enabled only with a fine hover pointer.
- Reduced motion retains the fully formed static fallback and schedules no rendering. Live preference changes cancel the loop. Canvas/image/mask failure retains the fallback.
- Cache the layout-independent connected-region raster mask across instances/re-entry; do not repeat its flood fill on resizing. Reuse particle records per frame, precompute RGB strings and use global alpha instead of allocating color strings per particle/frame. Cap canvas density at 1.75x. Use no additional library.
- Preserve idempotent custom-element setup and dispose renderer work/listeners on replacement, disconnection or page teardown. No duplicate canvases or loops.

## Validation

- Pass: Astro 5.18.2 production build under Node 22.23.3; all 16 routes.
- Pass: 132/132 regression tests, including seven updated renderer tests for fully formed first frame, continuous flow, original colors, mobile sampling, bounded mouse response, touch exclusion, offscreen/hidden cancellation, reduced motion, density limits, resizing and cleanup.
- Pass: renderer TypeScript check with ES2022 and DOM libraries.
- Pass: in-app Chromium desktop/mobile visual review, including full mobile K; layout bounds at 1440/1024/768/390/320, no horizontal overflow or text clipping, one canvas per instance. Observed running state followed by replay-ready offscreen state, then fully formed running re-entry. No reveal.
- Pass: source audit compares the entire original animate function body with the adapted version. Only the visibility guard and viewport-breakpoint expression differ; all physics expressions are identical. Extracted PNG matches the attachment byte-for-byte.
- Pass: built main markup is identical to the task baseline after excluding changed JavaScript module URLs. Baseline file hashes preserve all existing source/public/test files except the intended component/controller/tests. No V3 or unrelated source edits.
- Pass: no browser page warning/error logs during review.

Evidence: sibling `outputs/fixed-particle-k-evidence/` contains build/test logs, hashes, source/markup preservation audit, responsive measurements and desktop/mobile screenshots.

Limits: physical devices, Safari/Firefox, native screen-reader speech, native OS preference toggling, hidden-tab timing, field CLS and device CPU/battery measurements were not performed. Reduced-motion and hidden-document behavior are covered by controlled tests. The reference intentionally uses more particles than the previous implementation to preserve its density; rendering stops offscreen and for reduced motion.

Modified this revision: `src/components/animations/ParticleLogoAnimation.astro`, `src/scripts/particle-logo.ts`, `tests/particle-logo.test.mjs`, this record and `PROJECT_STATUS.md`. Added: `public/assets/itkeepers-particle-k.png`.

No implementation blockers or new product assumptions. Needs review: Jim's visual approval. Local production preview: http://127.0.0.1:4352/#who-we-are . Stop for review before any release or Git publication action.
