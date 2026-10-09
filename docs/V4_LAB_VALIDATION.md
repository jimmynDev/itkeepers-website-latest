# V4 Phase 2 — Structural Frame lab

## Phase 2B refinement — 9 October 2026

This section supersedes the Phase 2 implementation/validation conclusions below. Jim approved Structural Frame as the V4 base direction and requested a focused lab refinement. Branch/HEAD unchanged: `v4-design-reset` / `587b98bad771e3111704c0ed01285ad70003b5b1`. Production migration and final accent selection remain outside scope.

### 1. Files changed in this refinement

- `src/pages/v4-lab.astro`
- `src/styles/v4-lab.css`
- `docs/V4_LAB_VALIDATION.md`
- `PROJECT_STATUS.md`

No changes to production source, shared animation components, SVG source, lifecycle logic, the lab accessibility adapter, font binaries, packages or hosting configuration. All **16 production HTML outputs, including the homepage, are byte-identical to the pre-Phase-2B build**. Evidence: `outputs/v4-lab-2b/production-isolation.json` outside the repository.

### 2. Typography

Default is now **Archivo display/headings + Source Sans 3 body/UI/navigation**. Hybrid, A, B and C remain selectable; the comparison area includes four equal-size specimens. Existing assets suffice, with no extra font download/payload. Mono is retained for the service identifier, security-layer numbers and explicit technical comparison material; human captions and the hero CTA note use the body family. UI and minor heading sizes now use rem units so they enlarge with root text preferences.

### 3. Hero composition

Kept the approved headline, scale and static behavior. The lower row pairs copy in columns 1–3 with CTA/note in columns 4–6, using first-baseline alignment instead of a separating empty column. Mobile puts the CTA directly after the copy. Proof metrics remain open and unchanged. Design commentary was removed from the hero and product chapters; evaluation text remains in the top strip and the explicitly labeled lab controls/type specimens. Hero entry space replaces the removed label area; chapter spacing tokens are unchanged.

### 4. Managed IT composition

One `01 / MANAGED IT` identifier now belongs to the same text column as the heading, copy and detail link. The heading uses 32–48px at default text settings; supporting text has a narrow 30ch cap. This column occupies two macro columns, alongside four columns of artwork, including at 1024px. The SVG now fills that stage instead of being capped at 640px. It remains proportional and uses its original viewBox without extra cropping or distortion. Below 800px, index/heading/copy/link precede the artwork in one column.

### 5. Animation grayscale hierarchy

Active marks, ticket text/outlines, engineer marks and checks use near-black; frame and supporting details use stronger gray; rows remain pale. Frame, row-line, ticket, avatar and check strokes are slightly stronger. The existing line-shortening, ticket, engineer and check shapes continue to communicate state without relying on hue. All transforms, state logic, timing and narrative sequence are untouched.

The pause/resume control is a quiet text control with a 44px minimum target and visible keyboard focus. Its reserved area is 4.25rem, scaling with enlarged text. The visible caption supplies a readable summary of the SVG narrative; tiny in-art ticket identifiers remain supplementary.

### 6. Cybersecurity

Preserved the dark field, large Archivo heading and existing content/alignment. A shared rule now connects the five layers under their narrative label, replacing separate column-top rules. At mobile widths the same model becomes a vertical spine with five readable rows. No additional animation or decorative effects.

### 7. Who We Are

Preserved the approved copy. Replaced the tabular three-step treatment with an unequal 1/2/3-column relationship: a small environment reference, a stronger familiar-engineer focal point and a branching list inside the wider team. Removed the step numbers and cell-like dividers. On mobile the three parts follow their exact DOM order vertically, with the five disciplines nested under the wider team.

Reused the approved **concept**, not another controller. The existing TeamEscalation component was inspected; its absolute positioning, rounded nodes and original color styling would require extensive presentation overrides. A static semantic relationship keeps this editorial chapter open without changing or duplicating its animation behavior. No photography or new motion was added.

### 8. Mobile and responsive validation

Final browser sweep and full-page JPEG captures completed at all six requested widths. Browser viewport settings are nominal; the Chromium scrollbar reduces the available layout width by roughly 15px.

| Requested width | Document client/scroll width | Managed SVG width | Result |
|---:|---:|---:|---|
| 1920 | 1905 / 1905 | about 907px | Pass |
| 1440 | 1425 / 1425 | about 858px | Pass |
| 1024 | 1009 / 1009 | 607px | Pass |
| 768 | 753 / 753 | about 688px | Pass |
| 430 | 415 / 415 | about 367px | Pass |
| 390 | 375 / 375 | about 327px | Pass |

No visible HTML element crossed the viewport horizontally, no horizontal scroll was detected, and major type remained unclipped. The mobile hero uses natural wrapping; CTA follows support copy; metrics form two columns; Managed IT text precedes the animation; security layers stack; the relationship remains environment → engineer → wider team. State-label rectangles were checked at 390px with zero collisions. All four font choices were also checked at 1440/390 with no overflow.

### 9. Accessibility validation

- **Pass, real browser keyboard:** skip link focuses main; native radio group; brand/navigation; Under Attack; mobile menu; primary CTA; Managed IT/Cybersecurity links; pause control; control specimens. Focus outlines are visible. Enter opens the menu; Escape closes it and returns focus to summary. Forward traversal exits the animation control into the Cybersecurity link; no trap observed.
- **Pass, real browser animation controls:** keyboard pause changes the lifecycle state to paused and SVG CSS play states to paused; resume returns to running. No controller edits.
- **Pass, browser/source:** one H1, H2 sections, H3 comparison specimens; descriptive animation group; caption; semantic ordered relationship with nested disciplines; unchanged source order. Text-pair contrast remains 14.93:1 body, 5.59:1 muted, 16.29:1 action, 16.11:1 inverse body and 9.36:1 inverse muted.
- **Pass, external reduced-motion fixture:** the local-only fixture supplies a reduced-motion media result and activates the existing reduced-motion stylesheet branch. The animation settles immediately, all three checks are visible, zero CSS animations remain active and pause is hidden because nothing moves. Existing unit tests also cover reduced-motion changes. This is not an OS preference test.
- **Pass, external script-free fixture:** all script elements removed; meaningful SVG fallback has all three checks visible, zero active CSS animations and no inserted pause control. Native menu and CSS font comparison still work. This is not a browser-wide JavaScript-disable test.
- **Pass, external enlarged-text fixture:** 200% root text sizing at 390px produces 36px body / 40px large body / 96px minimum hero text, with zero horizontal overflow and natural reflow. Native browser zoom shortcuts produced no measurable change, so no native zoom pass is claimed.
- **Not run:** actual screen reader, OS-level reduced motion/forced colors, Safari/macOS and physical mobile devices; automated axe/Lighthouse audits. These remain platform-level manual checks, not blockers to this local visual review.

### 10. Remaining dependencies and contamination review

Same dependencies as Phase 2: official logo, Managed IT SVG/component and existing lifecycle. Every legacy SVG color variable is mapped locally. Its existing radii and geometry remain part of the preserved artwork; no new card shells are added.

Rendered inspection found **zero non-neutral colors, applied gradients, shadows or glow filters**, with the intentional black-logo brightness filter excluded from the effect check. Zero `.btn`, `.section`, `.split`, `.light` or `.dark` legacy presentation classes occur. Only the V4 and preserved Managed IT stylesheets are loaded. No increased override chain or new `!important` declaration was introduced.

Vercel Web Interface Guidelines re-read on 9 October 2026: https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md . Code review and actual keyboard/browser checks covered the changed UI. Rem-based control sizing and its reserved animation-control space were refined during enlarged-text review. No remaining actionable source finding; platform-level limitations are recorded above.

### 11. Build

**Pass:** Node 22.23.3, `npm run build`, 17 static pages. Local preview returns 200. No dependency or configuration changes.

### 12. Tests and static checks

**Pass:** `node --test tests/*.test.mjs`, 78/78; no failures, skips or cancellations. Static checks pass for local href/src/fragment targets, duplicate IDs, one H1, noindex, WOFF2 signatures, SVG variable coverage, neutral tokens and production preservation. No captured browser console warnings/errors.

### 13. Remaining visual review and evidence

Jim's review is the next design decision: judge the hybrid, the stronger service stage and the more human relationship composition. No final accent or global font selection was made.

The previous browser blocker was resolved by discovering an already-open, valid user review tab. It was inspected and refreshed through the normal supported browser API; the stale error/data-URL tab was not used. Mandatory responsive browser checks are now completed.

Evidence directory (outside Git): `C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v4-lab-2b/`. Contains six final full-page screenshots, desktop/mobile hero captures, mobile paused animation, team/200%-text captures, responsive/font/keyboard/rendered audit JSON, external QA fixtures, build/test/static logs and production hashes. The QA fixtures are not shipped. Preview: http://127.0.0.1:4344/v4-lab/ . Work remains local and uncommitted; no push, deploy or merge.

---

## Original Phase 2 record (historical)

Updated 9 October 2026 (Asia/Beirut). Local implementation on `v4-design-reset`, inspected HEAD `587b98bad771e3111704c0ed01285ad70003b5b1`. Owner: Codex implementation; visual decision: Jim. No commit, push, merge or deployment.

## 1. Files created

- `src/pages/v4-lab.astro`: standalone document with masthead, exact static hero, approved proof facts, Managed IT, dark Cybersecurity, Who We Are/handoff, control states, three font specimens and ten type roles.
- `src/styles/v4-lab.css`: route-exclusive V4 tokens, primitives, responsive rules and a small presentation adapter for the existing SVG.
- `public/v4-lab/prepare-animation.js`: exposes a native control to the existing animation lifecycle before its module initializes; handles Escape in the native mobile menu.
- `public/v4-lab/fonts/`: six WOFF2 assets, four OFL license files and the source/size README.
- `docs/V4_LAB_VALIDATION.md`: this report.

## 2. Files modified

`PROJECT_STATUS.md` only. Production homepage, public page sources, Base layout, old CSS, shared animations, lifecycle, dependency lockfile and hosting configuration are unchanged. Build output in ignored `dist` is regenerated.

## 3. Typography candidates

| Candidate | Display | Body | Character |
|---|---|---|---|
| A | Archivo 600, 85% width | Archivo 400/600 | Dense, architectural, adjustable width |
| B | Barlow Semi Condensed 600 | Barlow 400/600 | Narrower, more operational |
| C | Source Sans 3 600 | Source Sans 3 400/600 | More open and humanist |

All three share IBM Plex Mono for short metadata only. Native radio controls switch the full composition with CSS `:has`; no JavaScript is needed for selection. Identical smaller headline/support specimens remain together below. All assets are self-hosted OFL WOFF2, 201,636 bytes total. Only Archivo is preloaded. No font is finalized. Windows Chromium desktop views of all three were inspected before the final minor refinements; macOS and physical mobile devices were not tested.

## 4. V4 token structure

Every authored design token uses `--v4-`: semantic colors (`page`, `inverse-page`, `text`, `muted-text`, `rule`, `action`, `action-text`, `focus`, `surface` plus inverse text/rules); layout (`max`, `gutter`, `gap`, `chapter-space`, `measure`); body/display/meta font roles and ten size roles. No final accent token exists.

Palette: off-white `#f5f5f3`, near-black `#202020`/`#191919`, muted `#626262`, pale rule/surface `#c8c8c5`/`#e6e6e3`, inverse muted `#bdbdbd`, white. No cyan, navy, blue or purple V4 value. Static calculated text contrast: body **14.93:1**, muted **5.59:1**, primary action **16.29:1**, inverse body **16.11:1**, inverse muted **9.36:1**. These are token-pair calculations, not an automated rendered accessibility audit.

## 5. Grid

1380px maximum content field; six equal macro columns; 24–80px fluid outer gutters; 20–40px internal gaps; 64–128px chapter spacing. General prose has a 60ch maximum, with intentionally shorter display-support passages. Desktop hero/support/action align to different grid spans. Managed IT uses a two-column copy span and four-column artwork span on wide screens. Dark security uses a full-width title with an offset copy span. The human chapter uses editorial copy and a quiet, static three-stage handoff.

At 1100px the masthead becomes two rows in source order; at 800px the macro layout becomes one column and authored desktop headline breaks are removed; at 600px navigation becomes a native disclosure. Proof changes from four columns to two. No CSS `order` rearranges the semantic reading sequence.

## 6. Animation reused

`ManagedITDashboardAnimation.astro`, its original SVG and `animation-lifecycle.ts` are imported unchanged. Existing viewBox, intrinsic aspect ratio, state changes, transforms, timing, viewport pause/replay and reduced-motion logic remain intact. The illustration is labeled hypothetical/illustrative and presented on the page canvas. No new entrance or ambient animation was added.

The lab adapter sets the outer accessible role to `group`, adds a hidden native pause button before the existing lifecycle mounts, and lets that lifecycle own the control. A reserved 68px area prevents control appearance/disappearance from shifting the following caption. The human handoff is a static conceptual diagram, not a rewritten service animation.

## 7. Unavoidable legacy dependencies and isolation

Only the official logo asset and Managed IT component/SVG/lifecycle are reused. No Base layout, production navigation component, `home-editorial.css`, old visual-system CSS or global production shell is imported.

The SVG's existing internal variable names are interface aliases: a local `.v4-animation .mit-mini-dashboard` rule maps every legacy color variable to V4 values or transparent. The V4 system itself does not consume legacy visual values. SVG geometry, including its existing small internal radii, remains intact; decorative panel fill is removed, edge stroke becomes solid neutral and filters are suppressed. The one filter `!important` is needed to override the preserved filter keyframe; the mobile grid reset is the other structural specificity boundary.

Astro extracts Managed IT CSS into a shared emitted asset when a second route imports it. Consequently the built homepage's stylesheet links and adjacent newlines change. Comparing a clean HEAD build: **15 existing internal HTML pages are byte-identical**; homepage HTML is identical after removing stylesheet links and normalizing consecutive newlines; its complete CSS rule multiset is unchanged after line-ending normalization. This verifies content/declaration preservation, not a fresh visual regression pass. No V4 stylesheet is linked by a production page.

## 8. Contamination findings

The SVG carries navy/cyan/amber defaults, two gradient definitions, several glow filters, old font styling and a 400px minimum canvas height. These remain in the unchanged source but are neutralized at the lab presentation boundary: all color aliases mapped; gradient-painted panel/edge replaced with none/solid; filter application suppressed; SVG labels inherit the selected V4 body face; default canvas minimum removed. Gradient definitions are unused, not deleted from the shared asset.

The earlier 1440px browser views showed the grayscale masthead/hero/proof and all three font choices without visible V3 styling. The final lower-page rendered contamination sweep is **Blocked**, not marked passed. Static checks confirm the lab links only its own stylesheet and the Managed IT component stylesheet, maps every SVG color variable, has no V3 token references and introduces no gradient/shadow/keyframes.

## 9. Responsive validation

The table records the authored CSS model, not measured browser geometry. Widths exclude no scrollbar correction.

| Viewport | Calculated maximum field | Macro grid | Display XL | Final rendered status |
|---|---:|---:|---:|---|
| 1920 | 1380px | 6 columns | 144px | Blocked |
| 1440 | about 1319px | 6 columns | 144px | Earlier A/B/C hero views inspected; final recheck blocked |
| 1024 | about 938px | 6 columns | 102.4px | Blocked |
| 768 | about 703px | 1 column | 76.8px | Blocked |
| 430 | 382px | 1 column | 48px | Blocked |
| 390 | 342px | 1 column | 48px | Blocked |

On continuation, the browser security check rejected reopening the local HTTP preview, reporting a URL-policy restriction. No alternate browser or automation workaround was attempted. This prevented the final viewport, clipping, keyboard and animation-control sweeps. Those checks remain assigned to visual QA/Jim or a later authorized browser session. The preview server was restarted for manual review at `http://127.0.0.1:4344/v4-lab/`.

## 10. Accessibility and other checks

| Check | Status | Evidence / limitation |
|---|---|---|
| Node 22.23.3 build | Pass | 17 static pages; `build.log` |
| Existing test suite | Pass | 78/78; includes animation pause/replay/reduced motion and focused completion |
| Local href/src/fragment targets and IDs | Pass | Built-output scan: no missing target or duplicate ID |
| Semantic structure | Pass, source review | One H1, section H2s, H3 type specimens, main landmark, skip target with tabindex -1, labeled native radio group/menu, disabled native button |
| Focus and reading order | Pass, source review | 2px visible focus outline, 5px offset, inverse focus token; proof number/label and responsive navigation retain source order |
| Contrast | Pass, token calculation | Five text pairs above 4.5:1; SVG opacity/text not included in that assertion |
| Reduced motion | Pass, existing unit tests/source | Preserved controller and component media rule; no new motion |
| No-JS behavior | Pass, source review | Hero/copy/control links/menu/font selection static/native; original meaningful illustration fallback; no unusable inserted pause button |
| Actual keyboard/pause/menu/reflow checks | Blocked | Browser policy restriction; no final manual pass claimed |
| Screen reader, forced colors, native reduced-motion setting | Not run | Source support exists; device/assistive-technology validation remains |
| Automated browser a11y/performance audit | Not run | No axe/Lighthouse/CLS/Core Web Vitals result claimed |
| Deployment checks | Not applicable | Local-only scope; no deployment authorized or performed |

Remaining accessibility concerns for visual review: 12px metadata is deliberately secondary; the preserved SVG contains small labels and variable-opacity graphical details, supplemented by its accessible description and visible caption. Confirm their mobile readability. The new control adapter's real keyboard operation and stable geometry still need final browser verification.

Evidence is outside Git at `C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v4-lab/`: baseline hash manifest/build, isolated HEAD rebuild, production-isolation JSON, static-validation script/JSON/log, final build and test logs. No secrets, forms, processors or analytics were added.

## 11. Preferred candidate and next decision

**Proposed: A / Archivo + IBM Plex Mono.** In the inspected desktop comparison its width axis and compact, substantial headline best expressed Structural Frame while keeping normal-width body copy readable. Barlow is a credible more condensed alternative; Source Sans 3 is the strongest human/editorial alternative but softens the primary structural voice. This is a recommendation for review, not a final font choice.

Implementation stops here. Jim should compare A/B/C in the lab, review the service and human chapters, and resolve the blocked visual QA before approving a direction for production migration. No production redesign begins in this phase.
