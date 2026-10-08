# V3 editorial iteration 2

8 October 2026. Local refinement on `v3-editorial-concept`; no push, deployment or merge.

## Checkpoint

V3 v1 was reviewed for scope, accidental files, secrets and generated output, validated with Node **22.23.3**, then committed as **6f7a4f7d77445abeb3325cb4032d23ca8d5dfdde**, `Create V3 editorial homepage concept`. Seven files committed. Build: 16 pages, exit 0. Tests: 78 passed, zero failures/cancellations/skips/todo, exit 0. Working tree was clean before Iteration 2.

Preserved V2 remains `da3161d38f99a8c2a29e4e2d1fba56f283e15740`. Iteration 2 remains uncommitted for review.

## Changes and rationale

| Area | Refinement |
| --- | --- |
| Hero | Support copy and the single existing review CTA share a left-aligned column, with a 20px desktop / 16px mobile gap. Existing label, `/contact` destination and behavior preserved; facts follow the action. |
| Service orientation | Six numbered text links before the chapters, in three desktop columns or two mobile columns. Thin rules and generous native link targets; no sticky controls, tabs, cards, arrows or new JavaScript. All six fragment targets verified. |
| Services | Individual chapter spacing retains split/reversed/panoramic compositions. Phone art-size variables reduce managed/network/AI scale; cybersecurity SVG geometry is unchanged. Copy and Explore CTA precede every mobile artwork. Cloud and panoramic infrastructure retain more breathing room. |
| Pulse | Smaller phone gaps around the existing full-width product reveal. Tablet glow no longer creates document overflow. Functional dashboard and controllers unchanged. |
| Team / engineering | One tighter group; phone team diagram is 480px rather than 580px high, with percentage-based connector/node positions retained. Engineering subheading, progression and proof gaps reduced; all copy stays. |
| Operations | Seven-step main workflow remains dominant and visible. Documentation and Keep / Upgrade / Replace explanations stay visible; their existing animated figures move into two native, initially closed disclosures. Enter and Space work without JavaScript. Daily/security disclosures have smaller phone summary spacing and remain generous touch targets. |
| Interactive | Only shell spacing and mobile minimum reviewed. Initialized phone stage minimum is 620px, with intrinsic growth to about 631px at 360px. All four scenarios, 12 choices, explicit Continue, final/restart and stable overlapping layout remain unchanged. No-JS minimum remains zero. |
| Resource / close | Resource aside and final review chapter have smaller phone padding/gaps. One existing closing action; no homepage form. |
| CSS | Moved public prototype CSS to `src/styles/home-editorial.css`, compiled only by the homepage. Removed doubled root specificity, redundant Hero component overrides and duplicate rules. Captured documentation surfaces use two component variables with original defaults rather than a competing state selector. No new `!important`, transforms, timings or dependencies. The homepage composition layer still references existing component classes; this is scoped cleanup, not a sitewide refactor. |

Supporting illustrations open on demand and start through the existing animation lifecycle; normal documentation playback was observed in `running/capture` state after opening and entering view. Reduced-motion branches settle them immediately. Their data, explanations and captions remain in initial HTML.

## Mobile length

Local browser document heights, same 390px viewport and night theme, default disclosures closed:

| Measurement | Approximate height |
| --- | ---: |
| V3 v1 | 15,703px |
| V3 iteration 2 | 13,507px |
| Reduction | 2,196px / 14.0% |
| Iteration 2 with both optional examples expanded | 14,911px |

These are comparative local layout measurements, not performance or conversion claims. Optional disclosure expansion intentionally changes page height; phishing state changes do not.

The main reduction is How We Operate: approximately 4,812px to 3,239px. Who We Are: 2,080px to 1,893px. Six service chapters together: about 4,787px to 4,291px. The new overview adds about 254px including its preceding margin.

| Phone width | Default document height | Overflow / clipped text |
| --- | ---: | --- |
| 430px | 13,478px | None observed |
| 390px | 13,507px | None observed |
| 375px | 13,616px | None observed |
| 360px | 13,701px | None observed |

Expanded documentation/assessment content also checked at all four phone widths; no overflow or clipped text observed.

## V2 comparison

Subjective design assessment, without conversion data or invented scores:

| Dimension | Assessment |
| --- | --- |
| Premium feel | V3 remains stronger: lighter display type, calmer surfaces and more deliberate artwork presentation. |
| Conversion clarity | The detached desktop CTA is resolved. The existing action now follows the message directly, with tighter phone spacing than v1. |
| Service comprehension | Full landscape is immediately legible and directly reachable. V2's tighter detailed chapters are still faster to compare line by line; V3 now provides a clear map before richer storytelling. |
| Visual hierarchy | V3 remains stronger; Pulse and the main operations narrative retain priority over supporting evidence. |
| Mobile experience | Materially shorter default journey, clearer overview and tighter grouping. It remains a substantial page, with optional illustrations requiring an extra action. |
| Differentiation | V3 retains the authored service visuals and editorial chapter variation, with less generic MSP framing. |

**Recommendation: V3 is now clearly stronger than V2.** The three specific v1 weaknesses have been addressed while retaining its visual gains. The remaining tradeoff is length versus depth: the default phone page is still about sixteen 844px viewports, and opening both optional examples adds about 1,404px. Those examples now require a click, but their primary explanations remain visible. This is a design-direction recommendation, not a measured conversion result or deployment approval. Header/theme refinement remains outside this pass.

## Validation

- Final runtime: **Node 22.23.3**, isolated official Windows runtime outside the repository; project runtime/dependency files unchanged.
- Final `npm run build`: exit 0, **16 pages**.
- Final `node --test tests/*.test.mjs`: exit 0, **78 passed; 0 failed, cancelled, skipped or todo**.
- Browser widths: **1920, 1440, 1024, 768, 430, 390, 375, 360**. No final document overflow or clipped major headings. Full phone-text and expanded-evidence geometry audit passed. Cybersecurity recovery circle width/height ratio **1.0** at every width. Mobile CTA-before-artwork preserved for all six services.
- Phishing: all four scenarios at every width; all 12 choices at 1440 and 360; final/restart exercised. Stage height and document height unchanged across states; following-content document position differences below **0.001px**. All active controls fit the stage. A native mouse-choice / keyboard-Continue run at 360px preserved scroll **11900px** throughout all four scenarios. Final state persisted after leaving and returning to the section.
- Console: no captured warnings/errors in checked local flows. Existing day/night control verified; no toggle code changes.
- CLS: local external PerformanceObserver harness sampled **0** non-input layout-shift contribution through the checked width/interaction runs. Not a field Core Web Vitals benchmark. Native scroll checks independently verified page position.
- Reduced motion: external harness forced existing CSS/JS preference branches. Static hero, settled cybersecurity/documentation/assessment and non-animated logo rail verified; runtime tests also pass. Native OS preference emulation was unavailable and is not claimed.
- Script-free fallback: external harness removed application scripts and applied existing noscript rules. Hero, six overview links, seven operational steps and native disclosures remain available. At 360px, phishing fallback measured about **409px** with minimum **0px**, and no interactive buttons displayed. This is not browser-level JavaScript disabling.
- Semantics/schema: existing H1, metadata, JSON-LD and service headings retained; native labelled service navigation added. Compiled-HTML tests verify six valid fragment targets and unchanged daily/security counts. No new tracking or executable inline script.
- Isolation: final SHA-256 comparison shows **15/15 internal-page HTML outputs byte-identical** to the Node 22 v1 checkpoint build. Contact, dedicated Pulse, emergency, privacy, AI resource, service content, dependency/configuration files and animation/phishing controllers unchanged.
- Independent review: two findings corrected (no-JS minimum collision and hard-coded captured surface); final source review has no remaining actionable findings. `git diff --check` passes. No secrets, unrelated files, dependencies, build output or temporary artifacts included.

Evidence, logs, measurements and viewport screenshots live outside Git at `C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v3-iteration-2/`. Full-page screenshot capture was unavailable; viewport screenshots and whole-document geometry measurements were used. Preview: `http://127.0.0.1:4333/`. No push, deploy or merge.
