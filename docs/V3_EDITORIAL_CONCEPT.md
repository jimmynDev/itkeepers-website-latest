# V3 editorial homepage experiment

8 October 2026. Branch: `v3-editorial-concept`. Preserved base: `da3161d38f99a8c2a29e4e2d1fba56f283e15740` (Complete conversion and interactive experience).

This report records the original V3 v1 design direction, checkpointed subsequently at `6f7a4f7d77445abeb3325cb4032d23ca8d5dfdde` (`Create V3 editorial homepage concept`) after Node 22 build/test validation. The original observations below are historical; current refinements and validation are in [V3 Editorial Iteration 2](V3_EDITORIAL_ITERATION_2.md). No push, deployment or merge. The experiment changes the homepage composition; all 15 internal-page HTML outputs remain byte-identical to the initial V2 build. The existing day/night control and default remain in place, as explicitly requested. The navy direction is evaluated in night mode; the first six service/hero palettes retain their existing day-mode compatibility.

## Reference principles

The [Refero reference](https://styles.refero.design/style/c60f05ff-2420-4a24-92db-80c4b6a74683) was inspected before editing, alongside the existing homepage, tokens, reusable components and controllers. Adopted: large display typography, quieter surrounding surfaces, negative space, restrained labels, flat tonal transitions and a clear rhythm between visual chapters. Rejected: its exact typography, brand palette, artwork, gallery/product compositions and directional icons. ITKeepers keeps its existing sans-serif stack, navy canvas, blue/cyan identity, approved service accents and authored artwork. The pre-edit component/order report was provided in the conversation before implementation.

## Exact homepage order

1. Hero and four proof facts.
2. Managed IT Services.
3. Microsoft 365 & Cloud Services.
4. Cybersecurity.
5. Networking & Infrastructure.
6. AI & Automation.
7. Web Design & Hosting (the existing digital-services bridge).
8. IT Keepers Pulse product reveal.
9. Technology Ecosystem logo intermission.
10. Who We Are: team statement, supporting copy, Team Escalation, Engineering Development, team proof.
11. How We Operate: seven-step incident story, proactive monitoring/internal escalation, documentation, Keep / Upgrade / Replace, compact daily/security disclosures.
12. Four-message phishing experience.
13. Approved client proof only if available; currently omitted by the existing evidence gate.
14. Compact AI Governance resource link.
15. Final Free IT Review CTA, followed by the existing footer.

## Major changes

| Area | Composition |
| --- | --- |
| Hero | Lighter 400-weight display type, up to 136px, tighter tracking, no ambient hero grid/glow, large whitespace. All six rotating phrases, approved support copy and review CTA retained. |
| Proof | One strip, large figures, restrained labels and a thin rule; four facts retained. Two columns on mobile. |
| Services | Split and reversed split chapters; networking becomes a panoramic statement with artwork below. Larger section headings and less surrounding chrome. Existing motion geometry, controllers, palettes and timings retained. Mobile copy and CTA precede each visual. |
| Pulse | Large statement/support split above a full-width dashboard reveal; cyan selected states, functional dashboard surfaces and little exterior chrome. Existing product logic/animation retained. |
| Technology | Dark intermission, monochrome artwork and navy edge fades; original slow rail, hover/focus pause and static reduced-motion behavior retained. |
| Who We Are | Statement and concise support, one team composition below, then engineering proof separated by a rule. Light V2 diagram surfaces recolored for navy without changing positions or animation transforms. |
| How We Operate | One dominant incident thread with seven steps; window ornament removed. Documentation and hardware evidence form two adjacent desktop stories, then stack responsively. Daily/security questions remain native disclosures. |
| Interactive | Quiet, bounded product-demo surface. Original overlapping intrinsic grid, four scenarios, all feedback, animated replacement, explicit Continue, final state and restart retained. No scoring/timer added. |
| Final CTA | Large close, brief copy and one rectangular cyan CTA to `/contact`; no form added. |

Only `index.astro` loads `public/home-editorial.css`; every experiment selector is homepage-scoped. Repeated root specificity intentionally wins against the existing Astro component styles without modifying their shared routes. If this direction is adopted, fold these prototype overrides into a smaller permanent homepage style system.

## Duplication cleanup

| Existing block | Decision | Retained purpose |
| --- | --- | --- |
| TeamThread | Remove from homepage / merge | Familiar team and internal handoff are already explained by Who We Are and Team Escalation. Component remains available. |
| Storage-warning Workflow | Remove from homepage | Seven-step How We Operate becomes the single operational spine. Workflow and its internal How We Work usage remain unchanged. |
| Attention | Compact / merge | Approved daily checks and security-layer disclosures move into the ongoing-work area within How We Operate. Illustrative qualification retained. |
| Keep / Upgrade / Replace (Advice) | Merge | Existing hardware assessment and approved decision copy remain under How We Operate; duplicate standalone chapter removed. |
| Knowledge | Merge | Documentation story and Knowledge Continuity animation remain together, including the approved memory/context positioning; standalone duplicate chapter removed. |
| Floating AI Playbook | Compact | Approved message and resource destination become an inline, quiet resource aside. The reusable original overlay component remains available. |

No reusable component files were deleted. No invented testimonials, clients, results or claims were introduced.

## Component reuse

- Unchanged source/functionality: Base/header/footer/theme control; Hero and headline controller; Services and all six service artworks; Pulse signal/preview logic; Technology rail markup; Team Escalation; Engineering Development; operational workflow/knowledge/hardware animations; phishing scenarios/controller; ClientProof infrastructure and evidence gate; CTA destinations; all internal routes; dependencies.
- Restyled on homepage: Hero/proof, services, Pulse, Technology, Who We Are/engineering, operational illustrations, phishing shell, final CTA.
- Restructured: homepage section composition, homepage-only HowWeOperate; DailyChecks and SecurityLayers reused inside that chapter.
- Removed from homepage: standalone TeamThread, Workflow, Attention, Advice, Knowledge and floating AIPlaybook instances. Source remains available.
- New: one homepage-only CSS file and an inline resource aside. No new animation, font, runtime dependency, canvas or rendering library.
- Tests: two existing built-HTML assertions updated to the intentionally consolidated homepage. Internal five-step Workflow assertions and all controller behavior tests retained.

## V2 versus V3

Subjective design ratings, out of 10; higher is better. These are a comparison of this pass, not measured conversion or performance results.

| Dimension | V2 | V3 | Assessment |
| --- | ---: | ---: | --- |
| First impression | 8 | 9 | V3's larger, lighter positioning is stronger. |
| Premium feel | 7 | 9 | V3's quieter surfaces and whitespace help substantially. |
| Enterprise credibility | 8 | 8 | Both use the same operational substance; neither has approved client testimonials. |
| Clarity | 8 | 8 | V3 reduces duplication; V2 is quicker to scan. |
| Visual hierarchy | 7 | 9 | V3 gives major chapters more distinct priority. |
| Content density | 6 | 8 | V3 reduces repeated modules while keeping useful detail. |
| Differentiation from typical MSP sites | 8 | 9 | Authored artwork plus editorial chapters make V3 more distinctive. |
| Service comprehension | 9 | 8 | V2's tighter repeated layouts are more immediately comparable. |
| Animation prominence | 8 | 9 | V3 presents existing artwork with less surrounding competition. |
| Conversion clarity | 9 | 8 | V2 groups the hero message and CTA more closely. V3's right-aligned desktop CTA is clear but more detached. |
| Mobile experience | 8 | 8 | V3 has cleaner hierarchy and preserved ordering, but the journey remains long. |
| Accessibility | 8 | 8 | Core semantics, native controls and motion safeguards preserved. No claim of a complete assistive-technology audit. |
| Performance complexity | 7 | 7 | Fewer homepage instances/scripts, no new dependencies; the experiment adds a stylesheet with deliberate cascade overrides. No field benchmark yet. |

V2 strengths: tighter conversion grouping, faster comparative service scan, familiar compact density. V2 weaknesses: repeated team/operation/documents narratives, many competing framed modules and stronger decorative competition. V3 strengths: calmer first impression, stronger hierarchy, larger Pulse moment, more unified operations story. V3 weaknesses: still a long mobile page; large desktop whitespace separates the hero CTA from its message; the retained header and day/night presentation do not yet form one settled editorial system; no real client proof is available.

**Recommendation: V3 has potential but needs another iteration.** The visual direction improves the brand presentation, but should not replace V2 yet. A subsequent owner-authorized pass should tighten the hero conversion grouping, assess the longest mobile chapters, and resolve the already-deferred theme/header direction before deciding which version to adopt.

## Validation

- Node: **24.19.0**, npm 11.17.0. Project target remains Node 22; no installed Node 22 was found in the inspected runtime locations. Node 22 validation remains outstanding. No runtime/dependency configuration changed.
- Build: `npm run build`, exit 0; **16 static pages**.
- Tests: `node --test tests/*.test.mjs`, exit 0; **78 tests passed, 0 failed, 0 cancelled, 0 skipped, 0 todo**. Includes lifecycle, replay/offscreen pause, reduced-motion settlement, phishing focus/state and internal Workflow coverage.
- Widths: native browser viewport checks at **1920, 1440, 1024, 768, 430, 390, 375, 360**. No horizontal document overflow or clipped large headings. Mobile CTA-before-artwork ordering retained for all service chapters, including the separate digital-services bridge. Existing desktop circular cybersecurity SVG remains displayed on mobile; legacy rectangular variant remains hidden; SVG aspect ratio/coordinates unchanged.
- Interactive: all four scenarios exercised at every width, all 12 choices at 1440 and 360, final and restart exercised. Stage remained **600px** on desktop/tablet and **660px** at the narrow mobile widths. Following resource position varied by less than **0.001px** across states. Native mouse selections and keyboard Continue preserved scroll after setup scrolling/viewport changes had settled. Locator auto-centering and in-progress setup wheel motion were separated from application transitions.
- Console: no captured browser errors/warnings during checked flows. QA harness observed no runtime errors. This is local static-preview validation, not production-header/deployment testing.
- CLS: local PerformanceObserver measurement; final width captures recorded no shifts. One earlier 768px run recorded a non-input layout-shift contribution of approximately **0.000145**. Resizing/theme changes generated input-associated entries, excluded from CLS. Fixed-stage transitions did not move subsequent content. This is a local sample, not a field Core Web Vitals result or a cross-browser certification.
- Motion: normal entry/settlement and offscreen states inspected, authored controllers/source unchanged. Logo rail pauses with hover/focus; keyboard focus was visible. Reduced-motion **simulation** outside the repository forced the existing JS preference and CSS media branches; hero static state, settled cybersecurity and static rail verified. Native OS preference emulation was unavailable; it was not claimed as performed. Runtime tests separately exercise preference changes and transition settlement.
- No JS: an external QA server stripped application scripts and applied existing noscript rules. Meaningful hero, service, seven-step operational content, native disclosures and phishing explanatory fallback remained visible; no score/timer/buttons promised without JS. This is a script-free rendering harness, not a browser-level JavaScript-disable run.
- Accessibility: one H1, existing descriptions/schema and semantic hierarchy retained; native Enter/Space disclosures and keyboard skip link verified; review links remain `/contact`. V3 main supporting copy uses `#adbbcf` against navy; compact controls retain meaningful touch sizing. Existing day/night toggle works and was not redesigned. Screen-reader and forced-colors device testing were not performed; the source fallback was reviewed and its pseudo-element selector corrected.
- Isolation: SHA-256 comparison confirms **15/15 internal-page HTML files byte-identical** to V2. Animation/controller source, Base, service pages, contact/privacy/emergency/resource routes, package files, lockfile and configs unchanged. Homepage-only CSS not included on internal pages. No new secrets or unrelated generated files added to Git.
- Independent source review: no scope/architecture blocker. Two CSS findings fixed: matching inline/image vendor-logo luminance and valid forced-colors pseudo-element selectors.

Evidence is outside the repository in `C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v3-editorial/`: V2/V3 screenshots, width measurements, all-choice/native-input checks, source/page hashes and the explicitly local QA harness. Screenshots capture real browser states; transient animation/scroll setup frames are not a static-design benchmark.

## Review and rollback

Preview: `http://127.0.0.1:4333/` (ordinary built Astro preview). The instrumented QA server on 4334 is separate from the deliverable. The preserved V2 checkpoint remains on `v2-full-services` at `da3161d`. V3 v1 is preserved at `6f7a4f7`; the subsequent Iteration 2 refinement remains in the working tree for review.
