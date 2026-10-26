# V2 Phase 2 performance optimization — 19 October 2026

Local work on `codex/v2-prompt3-restored`, HEAD `22b5c2f9e74d9c734137036ec74a3db289c67761`. All starting uncommitted work preserved. No redesign, commit, push, merge, deployment, dependency update, tracking installation or remote configuration change.

## Measurement method

- Fresh production builds served through the existing local Cloudflare Workers configuration at `http://127.0.0.1:4366/`. Lighthouse 13.5.0, Chrome 155.0.8059.84, Node 22.23.3. Audit tooling installed in npm's external cache; project manifest/lockfile unchanged.
- Four representative routes: Home; Managed IT service template; Contact form; Cybersecurity with the interactive phishing exercise. Three runs per route and mode, before and after: **48 Lighthouse reports**. The table uses medians, never the best run.
- Mobile: Lighthouse simulated throttling, 412×823 CSS px, DPR1.75, RTT150ms, throughput1638.4Kbps, CPU4×. Desktop: Lighthouse desktop preset, 1350×940, DPR1, RTT40ms, throughput10240Kbps, CPU1×. Fresh Chrome instances/storage reset; no other benchmark/profile/browser-review jobs were run concurrently.
- Runtime profiling: desktop1440×1000/DPR1 and touch-mobile390×844/DPR1.75 at CPU4×. Chrome CPU profiles, timeline/raster/GPU-category traces, renderer task/script/layout/style metrics, RAF callback instrumentation and process CPU counters. Hardware acceleration enabled: Intel Graphics, ANGLE/D3D11. GPU-process CPU counters and trace events are proxies; they are not GPU busy percentage, watts or battery measurements.
- Capture/serialization overhead was excluded from renderer metric intervals. Trace profiles carry more overhead than ordinary playback. A separate focused comparison alternated before/after builds, used identical random seeds and particle counts, omitted tracing, and collected three five-second windows per variant/mode. Frozen baseline files were served at localhost4367 for that playback comparison, after page/image loading had completed; network performance comparisons used Workers4366 in both phases.
- These are lab results. No field INP, field LCP/CLS, real-phone power, native Safari/Firefox performance or production-CDN performance is asserted. Lighthouse TBT is not field INP.

## Lighthouse results

All entries are before → after. CLS was **0 in every run**.

| Route / mode | Performance score | LCP seconds | TBT ms | Total transfer KiB |
|---|---:|---:|---:|---:|
| Home / mobile | 91 → 95 | 3.129 → 2.647 | 0 → 0 | 252.8 → 177.3 |
| Home / desktop | 99 → 100 | 0.849 → 0.728 | 2 → 13 | 252.8 → 174.8 |
| Managed IT / mobile | 100 → 100 | 1.557 → 1.292 | 0 → 24.4 | 164.8 → 89.8 |
| Managed IT / desktop | 100 → 100 | 0.472 → 0.395 | 0 → 0 | 164.8 → 87.3 |
| Contact / mobile | 99 → 100 | 2.036 → 1.688 | 0 → 0 | 156.0 → 81.0 |
| Contact / desktop | 100 → 100 | 0.563 → 0.401 | 0 → 0 | 156.0 → 78.5 |
| Cybersecurity / mobile | 98 → 100 | 2.177 → 1.709 | 0 → 0 | 164.3 → 89.2 |
| Cybersecurity / desktop | 100 → 100 | 0.553 → 0.397 | 0 → 0 | 164.3 → 86.7 |

Home mobile median LCP improves15.4%, transfer29.9%. Its baseline score range was88–91 and LCP3.096–3.221s; after score94–95 and LCP2.642–2.706s. Contact after mobile LCP ranges1.554–1.697s, showing why medians matter. Not every timing improves: Home desktop and Managed IT mobile have small TBT increases. The largest after TBT is about26ms; baseline Home had one74ms run. All measured after scores meet the unchanged repository ≥90 mobile target.

### Home delivery weight

Median mobile network transfer includes headers and compressed response bodies:

| Resource | Before | After |
|---|---:|---:|
| JavaScript | 35.9KiB | 37.0KiB |
| CSS | 50.1KiB | 40.1KiB |
| Font requests | 0 | 0 |
| Stylesheet requests | 13 | 6 |

A representative run has decoded JS50,602→51,392B and decoded CSS210,327→199,601B. JS grows slightly because the logo rail now has an offscreen/hidden-page lifecycle controller; its rendering-work reduction is the tradeoff. No unused-code percentage was blindly removed. The current appearance uses fallback/system fonts with no downloaded font requests, so no font swap/preload was justified.

## Proven bottlenecks and applied fixes

1. **Blocking stylesheet requests:** Home initially had13, with Lighthouse estimating410ms savings. Eight public shared CSS links are now one minified, content-fingerprinted bundle; inner pages have their own variant without home services CSS. Original source files and exact cascade order remain. Five existing component stylesheets remain on Home. `src/data/shared-styles.ts` and `src/pages/styles/[file].css.ts` generate content-addressed URLs without an extra browser script or new dependency.
2. **Oversized header logo:** Lighthouse identified about18KiB of avoidable image delivery. Header/footer use192/384px lossless-WebP derivatives and srcset/sizes while retaining the original width/height aspect ratio and alt text. Original1747×289 PNG remains unchanged for approved source/social use. Derivatives are3,024B and5,604B versus17,991B original. Screenshot/layout review preserves the brand's appearance.
3. **Large favicon:** the SVG contained a95,365B PNG, producing a127,411B SVG. Re-encoding only its embedded image as lossless WebP reduces the wrapper to53,336B. A decoded-RGBA comparison found **zero changed visible pixels**, including unchanged alpha. The SVG geometry/padding is unchanged. `scripts/prepare-brand-assets.mjs` reproduces these assets using existing sharp0.34.5; idempotent output hashes verified.
4. **Offscreen logo rail:** the technology track previously continued running offscreen. It now pauses through IntersectionObserver/document visibility and resumes at its held timeline position. Hover/focus pause, reduced-motion styling, keyboard semantics, scroll layout and visible speed remain. No-JavaScript fallback remains the existing CSS behavior.
5. **Particle hot loop:** CPU profiles attribute substantial scripting to particle update/draw, including native arc/fill work. Hoisted invariant damping/radius calculations out of the per-particle loop; replaced unconditional distance normalization with a squared-distance check and square root only when clamping. Count, sampling, DPR cap, geometry, colors, opacity, draw order, flow equations, displacement limits, hover forces and frame scheduling remain intact.
6. **Caching:** added one-year immutable browser caching only for content-fingerprinted `/_astro/*` and `/styles/site-*.css`. Verified actual local Workers response headers on both CSS bundles and a logo derivative. HTML, robots, sitemap, mutable public files and inquiry behavior receive no new immutable rule. Production activation is not claimed.

## Runtime and animation findings

### Focused particle playback: three alternating pairs, no tracing

Counts identical for every paired run:7,892 desktop and4,437 mobile. The original randomized visual remains in the application; only the measurement harness fixes randomness.

| Metric, median | Desktop before → after | Mobile CPU4× before → after |
|---|---:|---:|
| RAF callback cost | 4.79 → 4.47ms | 16.21 → 14.82ms |
| Measured RAF callbacks/second | 58.9 → 60.0 | 41.7 → 46.4 |
| Renderer task time | 447.1 → 438.8ms/s | 987.2 → 984.5ms/s |
| Renderer scripting time | 283.9 → 268.0ms/s | 675.5 → 692.6ms/s |

Per-frame work improves about6.7% desktop and8.6% throttled mobile. Mobile executes more frames, so total scripting time does not decrease; it remains main-thread bound. Do not interpret the result as a mobile battery or overall CPU-usage reduction. The ordinary RAF callback rate is a rendering proxy, not a guarantee that every frame reached the display.

### Full interaction traces

- Particle idle desktop main-thread task time518→469ms/s; hover541→505ms/s. This single-window trace is supportive, not the more controlled three-pair estimate above. Particle draw/arc/fill remains the dominant visible cost.
- Spotlight remains event-driven: about one scheduled draw per pointer movement, no perpetual spotlight RAF loop. Its desktop hover scripting cost stays around4ms/s. Pointer exclusion on touch/coarse input, Tab dismissal and reduced motion remain.
- Scroll scenario desktop main tasks346→336ms/s; mobile867→849ms/s under4× throttling. Differences are modest and include existing service animations entering/leaving. No scroll listener or entrance timing was changed.
- Particle RAF work stops offscreen, when hidden, on user Pause, and for reduced motion; resume/re-entry works. Hidden/reduced-motion profiles record zero RAF callbacks. Offscreen Home can still have a headline-swap callback; this is not particle work.
- Mobile profiles show the unnecessary offscreen technology-scroll animation removed (one → zero running offscreen leaf animations). Other desktop leaf animation counts can include children outside the viewport inside a partly visible Managed IT illustration; that is not proof its root is offscreen. A direct inspection with the Managed IT root fully offscreen confirms `is-idle`, `replay-ready` and paused leaf animation state.
- GPU traces show continued raster/compositing work for the visible artwork. GPU-process CPU time during particle idle is roughly1.33→1.29 core-seconds/second desktop and0.62→0.61 mobile in the traced windows. These small differences do **not** establish GPU utilization or power improvement. No reliable GPU/battery reduction is claimed.
- No particle-count reduction, frame-rate cap, visual-effect removal or animation simplification was used to improve the score.

## Preservation and verification

- Build passes:16 HTML pages, generated sitemap and two CSS resources. **141/141 regression tests pass**, including particle lifecycle/geometry/interaction, all prior suites and two new delivery/cache checks.
- Generated SEO audit passes without failures or noncanonical-link warnings. All28 migration redirects, target/status/query behavior, all16 canonicals, sitemap/robots, Privacy noindex and preview-domain noindex pass again in local Workers.
-40 before/after layout comparisons: Home, Managed IT, Contact and Cybersecurity at320/360/390/768/1440px, in actual dark/day CSS states. Main text, sampled typography/colors/background/padding and element geometry are identical; no horizontal overflow. Existing overflow heuristics are unchanged in both builds and include visually hidden text and decorative heading extents; no new clipping was seen in the reviewed captures. Screenshots inspected at mobile Home in both themes and desktop/proof captures retained.
- Live browser checks pass: rail offscreen pause/resume and hover pause; particle Pause/Resume/offscreen and reduced-motion fallback; spotlight pointer behavior/keyboard exclusion; no unintended active particle frame loop.
-15 inner-route main regions are byte-identical. Home main matches after accounting only for the added rail module tag, changed particle-script fingerprint and whitespace. Exact hero H1, all visible words, ordered links and artwork/layout are retained. Existing SEO metadata, migration rules, privacy draft, robots policy, runtime/configuration, manifest and lockfile unchanged.
-Five starting implementation files changed: `src/layouts/Base.astro`, `src/components/TechnologyEcosystem.astro`, `src/scripts/particle-logo.ts`, `public/favicon.svg`, `public/_headers`. New files: shared-style module/endpoint, two logo derivatives, asset preparation script, delivery tests and this report/budget proposal. Other pre-existing uncommitted work was not reverted or overwritten.

## Remaining risks and follow-up

- Visible particle K remains expensive on a4×-throttled mobile CPU, including occasional long callbacks. Native device, battery, thermal, Safari/Firefox and GPU-busy validation remain unavailable. Further particle optimization needs equivalent-pixel rendering validation; do not silently lower density, quality or motion frequency.
- Home mobile median lab LCP is still2.65s. The LCP node is the visible hero rotator; shared CSS, initial document/style/layout work and intentional entrance rendering remain. Lighthouse also attributes initial forced layout to navigation header measurement. Those timings/behaviors were not changed without isolated evidence of a safe improvement.
- No field INP or production Core Web Vitals are available. TBT changes and benchmark variability are retained above rather than described as universal improvements.
- Cache headers and preview safeguards have only been validated locally. Prior migration-readiness blockers remain: deployed account/configuration access, live redirect/crawler activation, final Privacy approval and unresolved legacy content. No release readiness is asserted by a performance score.
- [PERFORMANCE_BUDGETS.json](PERFORMANCE_BUDGETS.json) records proposed monitoring budgets based on these cold-load measurements; no new CI gate was imposed and no existing target lowered.

## Evidence and reproduction

Sibling `outputs/v2-performance-evidence/` contains before hashes/source/build snapshot,48 Lighthouse JSON reports, `comparison.json`, browser system information, timeline/GPU/CPU profiles, alternating seeded particle samples,40 layout comparisons/screenshots, interaction/caching/migration/SEO checks and test/build logs. Discard the earlier exploratory profile files only if retaining the final corrected measurement intervals and their reports; final before/after profile summaries are the ones used here.

Reproduce with Node22: build using `node node_modules/astro/astro.js build`, run `node --test tests/*.test.mjs` and `python scripts/audit-seo.py dist`, serve through `node node_modules/wrangler/bin/wrangler.js dev --local --port 4366`. The evidence folder's `benchmark.mjs` runs the recorded Lighthouse configuration for `before` or `after`; `profile.mjs`, `focused-particle.mjs` and `visual.mjs` retain profiling/layout procedures. Audit-module paths in those local helpers refer to the recorded external npm cache. Do not run rendering benchmarks concurrently with each other or tests.

References checked: [Lighthouse scoring/variability](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring), [Chrome performance profiling](https://developer.chrome.com/docs/devtools/performance/reference), [Workers header matching](https://developers.cloudflare.com/workers/static-assets/headers/), [Vite processed inline CSS imports](https://vite.dev/guide/features#disabling-css-injection-into-the-page).

Local preview: <http://127.0.0.1:4366/>. Stop for Jim's review; no publication action performed.
