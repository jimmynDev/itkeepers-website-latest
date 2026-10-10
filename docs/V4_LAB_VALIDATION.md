# V4 Phase 2 — Structural Frame lab

## Final approval — 10 October 2026

**LOCKED: B — Refined Copper.** Jim approved the final accent and closed the design-lab phase. B is the lab's default selection; A and C remain as comparison history. The review below records the preapproval evaluation and its original control state. The approved palette is primary `#A34E26`, hover `#8D4020`, active `#723319`, dark `#E3A06F`, tint `#F3E8E1`. Existing layout, typography, semantic colors and animation behavior remain as validated. This checkpoint does not migrate the production pages.

## Phase 2C.1 — Final Human Signal hue comparison — 10 October 2026

**Recommendation: B / Refined Copper. READY TO LOCK: YES.** Human Signal is the owner's chosen direction; this section evaluates only its three copper/orange variants. A/B/C here are new hue-variant labels, not the earlier blue/green/orange directions. The lab retains all three for review and starts on control A. No production migration or release is implied.

### 1–3. Exact palettes

| Role | A / Burnt Orange (control) | B / Refined Copper | C / Alternative Copper |
|---|---|---|---|
| Primary | `#A94700` | `#A34E26` | `#AD552B` |
| Hover | `#8D3900` | `#8D4020` | `#934623` |
| Active | `#722D00` | `#723319` | `#78371C` |
| Dark field | `#F28B3C` | `#E3A06F` | `#EDA477` |
| Tint | `#F6E9DE` | `#F3E8E1` | `#FBF3EE` |
| Focus on light | `#A94700` | `#A34E26` | `#AD552B` |
| Focus on dark | `#F28B3C` | `#E3A06F` | `#EDA477` |

Focus retains the existing 2px outline and 5px offset. Danger `#B42318`, warning `#8A5A00` and success `#27723C` remain fixed across every selectable variant.

C was developed as a cleaner, slightly lighter copper rather than a midpoint between A/B. Its approximate OKLCH lightness/chroma/hue is 0.550 / 0.128 / 44.3 degrees, versus B 0.524 / 0.124 / 43.9 and A 0.520 / 0.145 / 46.4. It lifts perceptual lightness above both controls, retains a restrained chroma below A, and uses a pale tint to protect small ticket text. The brighter dark variant remains muted. These are descriptive color coordinates, not a semantic-separation certification.

### 4. Contrast

Ratios are calculated from opaque sRGB tokens, checked before rounding. All listed text pairings exceed 4.5:1. Focus rings exceed the 3:1 graphical requirement against their surrounding field.

| Pair | A | B | C |
|---|---:|---:|---:|
| Primary on off-white `#F5F5F3` | 5.36 | 5.23 | 4.68 |
| Primary on white / white text on primary CTA | 5.85 | 5.71 | 5.11 |
| White text on hover | 7.73 | 7.27 | 6.69 |
| White text on active | 10.04 | 9.53 | 8.89 |
| Dark variant on `#191919` | 7.14 | 7.97 | 8.52 |
| Ticket text on its tint | 4.91 | 4.75 | 4.66 |
| Focus on light field | 5.36 | 5.23 | 4.68 |
| Focus on dark field | 7.14 | 7.97 | 8.52 |

These token calculations do not establish contrast for every fading SVG frame or certify the whole site. The preserved illustration contains small supplementary labels and varying opacity; its visible narrative caption remains necessary. No color-vision-user study, native screen-reader test or physical-phone test is claimed.

### 5. Semantic separation

- **Danger:** Under Attack remains the fixed saturated red, underlined and explicitly labeled. All three copper CTAs remain visibly different in the examined header/mobile/control specimens; none was rejected for actual danger-red confusion. B/C are closer in warm hue than a blue would be, so meaning must continue to come from words, position and treatment. No universal hue-discrimination claim is made.
- **Warning:** Detect and the warning dot remain fixed amber. Copper colors only the ticket and its outline/tint. The paused animation comparison visibly separates the amber dot/Detect label from each copper ticket. A has the strongest safety-signaling association; B/C reduce it. Warning and copper have similar luminance and must not be substituted for one another as unlabeled states.
- **Success:** Checks stay fixed green in computed styles across A/B/C and retain their check shape. Copper is never used as a success color. The unchanged lifecycle retains its original state shapes and sequence.
- The previous Neutral entry and its semantic-color overrides were removed from this focused three-hue selector. The locked semantic colors are therefore identical in every selectable mode. No new semantic or accent placement was added.

### 6–9. Visual findings

**Header and hero:** A has the most orange force and the most industrial/safety association. B is quieter, established and warm while the solid CTA remains decisive. C looks a little lighter and cleaner; the improvement over B is subtle at the actual usage size. Hero words, proof numbers and general copy remain entirely neutral. Desktop CTA/emergency adjacency and mobile emergency utility remain clear.

**Managed IT and animation:** All three work in the service identifier, detail link and small ticket. The existing open stage and neutral structural geometry dominate. A feels most like industrial signaling. B has sufficient definition at small sizes; C's paler tint protects its ticket contrast but provides less margin for future changes to light surfaces. Actual animation pause was used for comparison; timing, lifecycle, SVG geometry and semantic shapes were not edited.

**Cybersecurity:** All three sections remain overwhelmingly near-black/white/gray. Accent covers only the existing link and small layer identifiers. A's dark orange is the most conspicuous; B feels more integrated without losing readability. C's lighter peach-copper is clear but does not solve a visibility problem in B. None creates an orange field. No extra tint, rule or geometry was colored.

**Who We Are and focus:** The same small relationship connector remains colored on desktop and mobile; headings and disciplines stay neutral. Real keyboard focus was verified for every variant on the hero CTA and Cybersecurity link, with `:focus-visible` true and the correct field-specific outline color. Native typography and color radio groups remain separate.

**Mobile:** Reviewed all variants at 390px and desktop at 1440px. Six measured cases have no horizontal overflow; all mobile section rectangles are identical across the variants. Browser client widths were 375px on mobile and 1425–1440px on desktop because of scrollbar behavior during capture; screenshot comparisons are nominal viewport tests, not physical devices. No layout, spacing or typography CSS was changed.

### 10. Evaluation matrix

Scores are comparative design judgments, not measured audience preferences. Positive criteria: 10 = strongest. Risk rows: 10 = worst. Accessibility scores acknowledge common passing thresholds; C receives less margin on light/tinted surfaces. No numerical total is used to manufacture a winner.

| Criterion | A | B | C |
|---|---:|---:|---:|
| Enterprise credibility | 8 | 9 | 8 |
| Technical compatibility | 8 | 9 | 9 |
| ITKeepers distinctiveness | 7 | 8 | 8 |
| Human/team fit | 8 | 9 | 9 |
| Structural Frame compatibility | 8 | 9 | 9 |
| Light-field performance | 9 | 9 | 8 |
| Dark-field performance | 8 | 9 | 9 |
| Mobile performance | 9 | 9 | 9 |
| Semantic separation | 7 | 8 | 8 |
| Accessibility | 9 | 9 | 8 |
| Longevity | 8 | 9 | 8 |
| Safety/construction risk | 7 | 3 | 4 |
| Startup/playful risk | 4 | 2 | 3 |
| Muddy/brown risk | 3 | 4 | 2 |
| Danger-red confusion risk | 3 | 3 | 3 |

### 11–12. Final recommendation

**Choose B / Refined Copper. READY TO LOCK: YES.** It balances human warmth, decisive action and engineering composure most consistently across light and dark fields. C is a credible cleaner alternative and slightly reduces the earthy quality of B, but its visual benefit is small while light-surface contrast drops from 5.23:1 to 4.68:1. A supplies force at the cost of a stronger safety-orange association. B's darker copper does not look muddy in this restrained composition; no broad brown or terracotta surface is introduced.

An independent Astra High reviewer inspected the rendered mobile hero, security and controls comparison strips and independently selected B. The primary agent also inspected desktop, the team connector, real focus and the paused animation. This recommendation follows the rendered comparison rather than the previous preference. No further hue round is recommended; readiness is a design recommendation for the owner's lock decision, not a claim of production-release readiness.

### 13–15. Files and validation

- Modified: `src/pages/v4-lab.astro` (lab selector only), `src/styles/v4-lab.css` (palette blocks and removal of obsolete neutral-only overrides), this report and `PROJECT_STATUS.md`.
- Pass: `npm run build`, **17 static pages**; `node --test tests/*.test.mjs`, **78/78**.
- Pass: all **16 production HTML outputs are byte-identical** to the start-of-phase build. No production source, shared component, animation, font, dependency or hosting changes.
- Pass: source review confirms no new placement, layout/spacing/type rule, keyframe, gradient, glow or effect. No commit, push, deployment or merge.
- Evidence outside Git: `C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v4-lab-2c1/` includes six full-page captures, mobile comparisons, paused animation comparisons, keyboard focus screenshots/JSON, contrast data, source before/diffs, production hashes and build/test logs.

## Phase 2C independent reassessment — 9 October 2026

**This review supersedes the prior recommendation of B. Recommend C / Human Signal, with one final muted-copper hue refinement before locking. No direction is approved or locked.** An independent `gpt-6-astra` reviewer with `high` reasoning assessed the brief and source; the primary agent performed the real-browser inspection and framework corrections. Brand scores below are design judgments, not customer research.

### Implementation audit

Keep the comparison framework after the corrections below. Header, hero, CTA, Managed IT, its animation, Cybersecurity, Who We Are, links/focus and 390px mobile were inspected. The dominant neutral architecture, typography, macro grid, spacing and open stages remain suitable. Equal placement makes comparison meaningful. The 90/10 principle is an art-direction constraint, not a measured area percentage.

Corrected only lab presentation defects that skewed comparison:

- Neutral previously retained red emergency text and green checks. It now restores grayscale semantic marks, neutral ticket surface, muted service identifier/connector and the original outlined hover specimen.
- Warning was independent only in the token list: the SVG adapter actually mapped its warning dot and Detect phase to the brand color. These now use fixed warning `#8A5A00`. The ticket has its own local brand alias; checks remain semantic success `#27723C`. Timelines, geometry and lifecycle were not changed. Other phase labels stay neutral so completed phases do not all acquire brand color.
- The team connector lost its accent at the mobile breakpoint. Its vertical version now preserves the same role. The existing mobile Services link now carries the matching current specimen marker; both current links expose `aria-current="true"` inside explicitly labeled navigation specimens.
- Restored the noninteractive hero reassurance sentence and typography-selector selection to neutral. Neither needs to compete with the CTA or color selector.
- Fixed the forced-colors token cascade at the body, where palette selection occurs. Previously root-only overrides could be superseded by body palette tokens. Native OS forced-colors behavior still needs device validation.
- Updated the lab footer description. No product copy, typography, dimensions, spacing, grid or composition changed.

The current three hue sets remain unchanged in the browser. The refinements below are **proposals**, calculated for contrast but not installed or visually accepted.

### A — Infrastructure Blue: keep

Keep primary `#2F5FE3`, hover `#244CC2`, active `#1C3C9E`, dark `#7EA2FF`, tint `#E9EEFC`; focus uses primary on light and the dark variant on dark.

The cobalt is clear, credible and effective for infrastructure and managed services. Its chroma makes actions obvious without needing more coverage. The lighter dark variant preserves readability. No technical reason requires changing it. The brand weakness is familiarity: the combination resembles established software/MSP interfaces and may feel Microsoft-adjacent, without being an exact Microsoft palette. It reinforces competence more than familiar people and shared context. Safe but relatively forgettable is a real tradeoff, not an automatic rejection.

### B — Operational Signal: modify

Propose primary `#506345`, hover `#435538`, active `#35462B`, dark `#A4BD82`, tint `#ECF0E7`; focus follows the field-specific accent.

Current `#4E6B00` is a strong yellow olive. On light it can read military/industrial; on dark `#B7D84A` makes a larger perceptual jump toward chartreuse monitoring/status indicators. Its high contrast is useful but does not establish brand fit. It leans toward a control-room identity more than a familiar engineering team. Eco/sustainability associations are secondary in the existing frame; cyberpunk/neon risk would rise with more chartreuse or animation coverage. The proposed muted olive reduces yellow intensity and gives light/dark fields a more consistent character. It also introduces some sage/eco association and loses some distinctiveness. A viable alternative, but not the strongest lead.

### C — Human Signal: modify and recommend

Propose primary `#A34E26`, hover `#8D4020`, active `#723319`, dark `#E3A06F`, tint `#F3E8E1`; focus follows the field-specific accent.

Current `#A94700` is already mature enough for a serious CTA, but the zero-blue orange and `#F28B3C` dark variant can suggest industrial safety or urgency. The proposed copper is less saturated, with a lighter, softer dark variant instead of a brighter safety orange. It retains contrast and a coherent warm hue family. The Structural Frame already supplies technical authority and operational maturity; a small copper signal contributes human attention and continuity, fitting “Your IT person is a team.” It should not be used to claim that a service state is safe, failed or urgent.

Construction/safety and danger associations remain possible; separating the warning token and using explicit labels/shapes matters. Startup/playfulness and excessive warmth are lower risks at this density with neutral headings, square controls and restrained movement. Copper is recommended for the contribution it makes to ITKeepers' positioning, not simply because it is unusual.

### Optional replacement

None. All three hue families can function; adding a fourth would expand choice without solving the actual decision.

### Comparison matrix

Scores evaluate the **current rendered directions after framework corrections**. Higher is better for positive criteria; **10 means greater risk** for the final two rows. Equal accessibility/mobile scores reflect common implementation and passing palette pairs, not universal certification. No total is calculated: brand fit cannot be inferred from an unweighted sum.

| Criterion | A Blue | B Olive/chartreuse | C Burnt orange |
|---|---:|---:|---:|
| Enterprise credibility | 9 | 8 | 8 |
| Technical authority | 9 | 8 | 8 |
| ITKeepers distinctiveness | 5 | 8 | 8 |
| Operational identity | 8 | 9 | 7 |
| Human/team fit | 6 | 5 | 9 |
| Accessibility | 9 | 9 | 9 |
| Dark-field performance | 9 | 8 | 8 |
| Mobile performance | 9 | 9 | 9 |
| Longevity | 9 | 7 | 8 |
| Generic-brand risk | 8 | 4 | 4 |
| Trend risk | 3 | 6 | 4 |

The proposed B refinement addresses dark-field consistency/trend risk; the proposed C refinement addresses longevity and safety-orange associations. Those expected improvements are not presented as visually verified scores.

### Validation and limits

- Pass: built Chromium at 1440px and 390px, Neutral/A/B/C; no horizontal overflow in eight measured cases. Scrollbar behavior produced 1425–1440px desktop client widths and 375px mobile client width. Mobile section dimensions were identical across palettes; the added work changes color/semantics only.
- Pass: real keyboard focus through the mobile current-navigation specimen and from pause control to Cybersecurity; visible field-appropriate focus ring. Actual pause click produced `data-animation-state="paused"` and the labeled Resume control. A paused mobile frame visibly separated warning dot/Detect, brand ticket and neutral structure.
- Pass: hero/metrics stay neutral, disabled CTA stays neutral, semantic warning/success remain fixed across A/B/C, and the mobile team connector retains its selected accent. Dark layers are identifiers, not active-state indicators.
- Contrast calculations: current A/B/C accent on off-white = **4.97 / 5.61 / 5.36:1**; white CTA text = **5.43 / 6.13 / 5.85:1**; dark variant on `#191919` = **7.12 / 10.83 / 7.14:1**. Ticket text on tint = **4.68 / 5.35 / 4.91:1**. Fixed warning and success against the actual row surface `#E6E6E3` = **4.74 / 4.72:1**.
- Proposed B/C accent on off-white = **5.99 / 5.23:1**; white CTA text = **6.54 / 5.71:1**; dark variant on near-black = **8.52 / 7.97:1**. Hover/active white text and ticket text on tint also exceed 4.5:1.
- These are opaque token-pair results. The preserved SVG includes fading/low-opacity details and tiny supplementary labels; this is not a claim that every intermediate animation frame passes text contrast. Its visible narrative caption remains necessary. No physical phone, Safari, native screen reader, OS forced-colors or color-vision user testing was performed.
- Pass: `npm run build`, 17 pages; `node --test tests/*.test.mjs`, **78/78**. No dependency or shared animation source changes. Source diff confirms only the lab page/CSS and existing report/status files are modified; no new production-output hash comparison is claimed.
- Reviewed the current [Vercel interface rules](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) and [W3C non-text contrast guidance](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html) on 9 October 2026. Pixel coverage and customer preference were not measured.

### Next step and handoff

Perform **one final hue refinement before locking C**: compare current burnt orange with proposed copper at the same placements, especially CTA/emergency adjacency, the warning/ticket distinction and the dark security field. Do not add a fourth direction or increase accent coverage. Neutral is restored in the preview for impartial review.

Files changed this review: `src/pages/v4-lab.astro`, `src/styles/v4-lab.css`, this validation record and `PROJECT_STATUS.md`. Evidence: `C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v4-lab-reassessment/` (before/final desktop and mobile screenshots, comparison strips, browser measurements, contrast calculations, build/test logs). No commit, push, deployment or merge.

## Phase 2C accent exploration — 9 October 2026

This color study keeps the approved Structural Frame, Archivo/Source Sans 3 typography, spacing, grid, copy, section order and animation lifecycle unchanged. It is isolated to `/v4-lab`; the production pages are untouched. The lab now has a second native radio group for Neutral plus three accent directions. Neutral remains the default so the checkpoint is directly comparable.

### 1–3. Exact accent systems

| Direction | Accent | Hover | Active | On dark | Tinted surface | Focus |
|---|---|---|---|---|---|---|
| A — Infrastructure Blue | `#2F5FE3` | `#244CC2` | `#1C3C9E` | `#7EA2FF` | `#E9EEFC` | `#2F5FE3` |
| B — Operational Signal | `#4E6B00` | `#3F5800` | `#314600` | `#B7D84A` | `#EDF2DC` | `#4E6B00` |
| C — Human Signal | `#A94700` | `#8D3900` | `#722D00` | `#F28B3C` | `#F6E9DE` | `#A94700` |

Direction C was revised from a red-orange draft to burnt orange so it stays visibly separate from the fixed emergency red.

### 4. Token changes

Added `--v4-accent`, `--v4-accent-hover`, `--v4-accent-active`, `--v4-accent-on-dark`, `--v4-accent-surface`, `--v4-action-hover` and `--v4-action-active`. Existing `--v4-action` and `--v4-focus` now resolve from the selected accent at the lab body boundary. Brand-independent semantic tokens are `--v4-danger: #B42318`, `--v4-warning: #8A5A00`, `--v4-success: #27723C`, with dark-field variants `#FF8A7A`, `#F2C14E` and `#7BD493`. Neutral maps back to the approved grayscale values.

### 5–6. Accent placement and restraint

Accent appears on the selected color/type labels, selected desktop navigation rule, filled primary CTA and hover/active/focus states, hero CTA note, Managed IT index and detail link, active animation warning/ticket state, Cybersecurity detail link and layer numbers, and the Who We Are handoff connector. It is withheld from hero and section headings, proof numbers, body copy, background fields, general dividers, disabled controls, the logo, inactive animation geometry and most navigation. The page remains predominantly neutral.

### 7. Managed IT animation

The existing SVG, timings, lifecycle and state shapes are unchanged. Inactive structure stays grayscale. The existing warning/ticket phase receives the selected accent through the lab adapter; the final check uses the independent success token and its check shape. Panel geometry remains dark neutral, and each state is still understandable in grayscale from line shortening, ticket, engineer and check shapes.

### 8. Cybersecurity treatment

The field stays `#191919`; its heading, copy and rules stay neutral. Only the detail link and five small layer identifiers use the lighter `accent-on-dark` value. No field wash, gradient, glow or added decoration was introduced.

### 9. Semantic states

`Under Attack?` always uses danger red and underline, independent of brand direction. Warning and success have dedicated tokens; the animation success mark also has a check shape. Direction C uses burnt orange rather than red-orange to keep brand and emergency treatments distinct. Disabled controls retain neutral structure.

### 10. Accessibility and contrast

Static WCAG contrast calculations pass for all intended text pairs. Primary accents against `#F5F5F3`: A **4.97:1**, B **5.61:1**, C **5.36:1**. White CTA text against primary accents: A **5.43:1**, B **6.13:1**, C **5.85:1**. Dark-field variants against `#191919`: A **7.12:1**, B **10.83:1**, C **7.14:1**. Semantic colors against `#F5F5F3`: danger **6.02:1**, warning **5.43:1**, success **5.41:1**. Focus uses a 2px outline with 5px offset; state meaning also uses text, underline, border, animation geometry or check shape rather than hue alone.

### 11. Desktop and mobile

All four selector states were inspected in the real Chromium preview at 1440px and 390px. Each selected system produced the expected CTA, current-nav, link and dark-field colors. At 390px, each state measured 375px document client/scroll width after scrollbar correction: no horizontal overflow. CTA, emergency link, proof metrics, selector wrapping and headline remained clear. The selector adds lab-only height but does not alter the specimen layout.

### 12. Comparison scores

Positive criteria use 10 as strongest. The two risk rows use 10 as highest risk.

| Criterion | A Blue | B Operational | C Human |
|---|---:|---:|---:|
| Enterprise credibility | 9 | 8 | 8 |
| Technical authority | 9 | 8 | 7 |
| ITKeepers distinctiveness | 5 | 9 | 8 |
| Structural Frame compatibility | 9 | 9 | 8 |
| Existing animation compatibility | 9 | 8 | 8 |
| Accessibility | 9 | 9 | 9 |
| Dark-field performance | 9 | 10 | 9 |
| Mobile performance | 9 | 9 | 9 |
| Risk of looking generic | 8 | 3 | 4 |
| Risk of looking trendy | 3 | 5 | 4 |
| Long-term brand durability | 8 | 9 | 8 |

### 13. Recommendation

Recommend **Direction B — Operational Signal**. Its deep olive on light fields feels disciplined rather than fashionable, while the lighter chartreuse variant reads exceptionally well in the dark security field. It connects to monitoring, readiness and resolution without repeating generic IT blue or borrowing emergency red. Used at the current density, it gives ITKeepers a recognizable operational signature while leaving the Structural Frame in control. Direction A is the safest enterprise option but the least distinctive. Direction C is warmer and human, though its proximity to urgency semantics requires more restraint.

### 14–16. Files, build and tests

- Changed: `src/pages/v4-lab.astro`, `src/styles/v4-lab.css`, this report and `PROJECT_STATUS.md` only.
- Build: **Pass**, Node 22 / `npm run build`, 17 static pages.
- Existing tests: **Pass**, `node --test tests/*.test.mjs`, 78/78.
- Static checks: **Pass** for token/palette presence, contrast pairs, lab-only selector, no new gradients/glow/keyframes, and changed-path isolation.
- Deployment: not committed, pushed, deployed or merged.

Evidence is outside Git at `C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v4-lab-2c/`.

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
