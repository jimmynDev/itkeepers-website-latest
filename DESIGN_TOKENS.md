# Design tokens — Home contrast

## Hero day-mode pilot — 3 October 2026

Only the homepage hero switches theme. Day surface #f5f9fc; navy foreground #0b2c5f;
supporting text #42566f; small accent text #075d7d; unchanged cyan CTA #42baeb.
Grid uses navy at 5%, static glow cyan at 12%, local mouse glow cyan at 20%.
Conservatively compounding their maximum opacities gives supporting text 5.33:1,
small accents 5.18:1 and navy 9.66:1. Large rotating-word colors use darker shades:
brand #4071b5 → #087ea8, support #087ea8, cloud #2567ad, security #207644,
networking #137487, automation #6250b3 and digital #386799; minimum large-text
ratio is 3.26:1 on that conservative surface. CTA navy on cyan remains 6.14:1.
The navigation and lower page retain their existing navy design. Full accessibility
certification, native screen-reader and real-device checks remain unverified.

The active Astro layout loads `public/style.css` and `public/mobile.css`.
The root `style.css` and `assets/styles.css` are unused concept files and were not changed.
Existing brand aliases (`--n`, `--b`, `--c`, `--s`, `--i`) are preserved; this task does not establish independent asset-derived brand verification.

## Section themes

Each rendered section sets or inherits `--bg`, `--fg`, `--muted`, `--accent` and `--focus`.
Headings inherit the section foreground. Eyebrows use its accent, and supporting
copy uses its muted token. The white illustrative paper sets its own complete
theme so pale copy cannot inherit from the blue section. Light and cyan surfaces
use dark foregrounds. No opacity is applied to readable text.

| Surface / usage | Foreground | Background | Ratio | Result |
| --- | --- | --- | --- | --- |
| Navy headings/body | #ffffff | #0b2c5f | 13.64 | Pass |
| Dark headings/body | #ffffff | #071f44 | 16.30 | Pass |
| Knowledge headings/body | #ffffff | #063970 | 11.49 | Pass |
| Footer body | #ffffff | #061b3b | 17.11 | Pass |
| Navy supporting copy/notes | #d6e4f5 | #0b2c5f | 10.57 | Pass |
| Dark notes | #d6e4f5 | #071f44 | 12.63 | Pass |
| Blue notes | #d6e4f5 | #063970 | 8.91 | Pass |
| Navy eyebrow / focus | #5cc5ff | #0b2c5f | 7.07 | Pass |
| Dark eyebrow / focus | #5cc5ff | #071f44 | 8.45 | Pass |
| Blue eyebrow / focus | #5cc5ff | #063970 | 5.96 | Pass |
| Footer focus | #5cc5ff | #061b3b | 8.87 | Pass |
| Navy advice headings / cyan button and strip text (reverse pair) | #42baeb | #0b2c5f | 6.14 | Pass |
| Light headings/body | #10233d | #f5f9fc | 14.92 | Pass |
| Light supporting copy | #53677f | #f5f9fc | 5.49 | Pass |
| Light accent (theme token) | #1e5aa8 | #f5f9fc | 6.43 | Pass |
| Paper headings/body | #10233d | #ffffff | 15.79 | Pass |
| Paper supporting copy/notes | #53677f | #ffffff | 5.81 | Pass |
| White CTA button text | #0b2c5f | #ffffff | 13.64 | Pass |
| Footer navigation | #abc0d9 | #061b3b | 9.18 | Pass |

Ratios calculated using WCAG sRGB relative luminance, rounded to two decimal
places. All listed text combinations exceed 4.5:1, including small notes.
Focus outlines use sky on dark surfaces and navy on light/cyan/paper surfaces;
navy on light is above 13:1 and navy on cyan is 6.14:1. A surface-colored inner
ring separates the outline from a differently colored control. Forced-colors mode
uses the system Highlight outline. Decorative article borders are not essential
control boundaries and are not asserted to meet 3:1. The official logo is excluded
from ordinary text contrast requirements. Home has no disabled controls.

## Validation and limits

- **Pass:** `npm run build` (29 September 2026); 10 static routes generated.
- **Pass:** source inspection of every Home component and declared color-pair
  calculations above. Existing active Home text pairs already passed; low-contrast
  concept rows are absent from the active Home. The change prevents theme leakage
  and supplies explicit contextual focus styling; it does not claim a reproduced
  failure in active text.
- **Blocked:** computed browser styles, automated axe scan, breakpoint screenshots,
  manual keyboard, 200%/400% zoom, forced-colors rendering, screen reader and real
  device checks were not performed in this bounded implementation session.
  Integration/QA owner should verify these on the local preview before release.
- **Blocked:** Git metadata and a pre-existing `PROJECT_STATUS.md` are absent from
  this checkout; no inspected commit can be reported. Integration owner records
  this limitation.

No layouts, copy, links, scripts, behavior or motion were changed. Shared header,
footer and other pages using the same stylesheet receive the theme/focus rules;
review representative light and dark routes during integration.

## 1 October 2026 — staged editorial Home redesign

Preserve all existing navy/cyan aliases. Added shared layout/type tokens:
`--font-editorial` (system UI), `--font-annotation` (system monospace),
`--layout-gutter` (20–64px), `--layout-max` (1320px), `--space-section`
(80–152px) and `--radius-control` (pill). No font dependency or raster asset added.

Hero: white and cyan on existing navy, muted lead on navy. Inset header: white,
sky focus/border and cyan CTA on dark surface. Relationship composition is now a
purposeful light surface: dark foreground (14.92:1), muted text (5.49:1), blue
annotation/trace (6.43:1), navy focus above 13:1. Its white context packet uses
dark ink (15.79:1) and muted text (5.81:1). Services uses white and sky on dark.
All combinations reuse the measured matrix above, with full-opacity text.

Source review Pass (Design): stable exact headline, native no-JS menu, skip link,
semantic service links, full initial-HTML relationship example and preserved
scroll/reduced-motion logic. Browser checkpoint pending parent; no rendered
contrast, overflow, keyboard, screen-reader or performance pass inferred.
Logo width/height reserve a 150x48px object-fit box; intrinsic asset dimensions
remain unverified after its remote server returned HTTP403 to a direct read.

Lower composition uses the same matrix: process/navy13.64 white and7.07 sky;
security-layers/navy muted10.57; purchasing/cyan navy6.14; shared-context/blue
muted8.91; white index dark15.79/muted5.81; closing/cyan navy6.14.
No low-opacity text introduced. Disabled step controls remain readable de-emphasized
content with existing muted token; dashed boundary/state communicates disability.
Authentic official PNG is now local,1747x289, supplied by parent from observed
current official site. Header/footer use these verified dimensions; footer lazy
and async. Prior HTTP403 failure is resolved in source, awaiting final browser check.
Footer supporting copy #d6e4f5 on #061b3b: 13.26:1 (Pass, sRGB source calculation).

Official logo provenance (1 October 2026): parent extracted opaque pixels from the
byte-identical current-site PNG using sharp. Dominant colors are #ffffff (175,799
pixels) and #01beff (16,917 pixels), with antialiasing variants. Record #01beff as
actual asset cyan; existing --c/#42baeb and --s/#5cc5ff remain accessible supporting
cyan tones, and existing navy is preserved. This evidence does not require a
palette migration or approve additional business claims.

## 2 October 2026 — Phase 2 offering composition

The seven offering stages use the existing continuous navy (`--journey-surface`,
#061b3b), system editorial/annotation fonts and section foreground tokens. Six
Core IT Operations sections precede a separately labeled Digital Services section.
Each service has an H2, initial-HTML explanation and Explore link. The first five
links preserve the existing service routes. AI and Web links target substantive
on-page planning sections with a Contact path until the later hub/navigation phase.

New supporting tokens in the existing `public/style.css` infrastructure:

| Token | Value | Purpose |
| --- | --- | --- |
| `--offering-expertise` | #b4b8ff | Indigo annotations and links for networking and AI |
| `--offering-success` | #68dbc1 | Teal annotation and link for backup/recovery |
| `--offering-rule` | #57738f | Decorative section/index separators |
| `--offering-gap` | clamp(40px, 5vw, 72px) | Editorial heading and details gaps |
| `--offering-section-space` | clamp(72px, 8vw, 120px) | Space around the visual chapters |

Source sRGB calculations: indigo on base navy 9.16:1; teal on base navy 10.17:1;
separator on base navy 3.47:1. The separators carry no exclusive state or control
boundary meaning. Their contrast is not claimed as essential visual information.
The surrounding existing pointer wash changes the rendered background; rendered
contrast still needs verification. Existing white and muted text remain full opacity.

Visual stages occupy the available content width rather than a narrow half-column.
Managed IT and Networking use a broad title with a shorter description/CTA row;
other sections use a two-column heading above the full-width visual. Digital Services
has its own category break. Header copy stacks at 1024px, the service index becomes
two columns at 768px and one column at 480px, and supporting details stack at 768px.
The prototype-specific mobile and reduced-motion states remain owned by their
animation components. This composition adds no autoplay, scroll capture or sticky UI.
Hover arrow movement is gated by fine-pointer, hover and no-reduced-motion queries.
Native links retain the existing visible focus treatment and full touch operation.

Validation: Pass — source review of semantic service headings, local anchor targets,
seven component imports, preserved five hub links, viewport rules and scoped CSS;
source contrast calculations above. Copy review supplied the seven example-based
introductions and retained the adjacent qualification for the requested AI slogan.
Blocked — rendered breakpoints, 200%/400% zoom, real touch, keyboard walkthrough,
forced-colors, screen reader and computed contrast not performed by this specialist
in this phase; Workflow/Design QA owner must record integrated results. Build not run
by this specialist: the integration owner owns the single candidate build. These
notes do not establish publication approval or a complete accessibility pass.

## 5 October 2026 — Phase 2.75 Visual System

Canonical shell token source: public/visual-system-tokens.css; implementation: public/visual-system.css. Namespace --itk-* keeps official --n/--c/--s and approved diagram variables unchanged. Canvas #070B14, alternate #0A1020, surfaces #0D1525/#111A2B; text #E8EEF9, muted #8A98B2, brand #42BAEB. Borders rgba(126,156,204,.14/.24); radius 10/14/18px. Semantic success #2DD4A7, warning #F0A93B, danger #E85D5D, AI #8175E8 are reserved for real states/categories, not decorative variation.

Major shell H2 clamp(30px,4vw,48px), weight600, 1.12 line-height, -.035em tracking. Supporting prose16px/1.6, labels12px/.1em. Section rhythm96px desktop,72px through1024px,56px through600px. Specialized hero, stage, compact index and banner preserve their geometry. Existing system font families and hero rotating scale unchanged.

Source sRGB contrast against canvas/alternate/surface/raised respectively: text16.90/16.27/15.66/14.94; muted6.76/6.51/6.27/5.98; cyan8.86/8.53/8.21/7.84. Dim#61708A only3.93/3.78/3.64/3.48, and deep blue#4071B5 only3.98/3.83/3.69/3.52: neither is used for small readable text. Thin decorative structural borders are not relied on as control focus/state indicators. Existing day navy/muted/link on#F5F9FC:12.88/7.10/6.91. Diagram-local text/status colors remain outside this shell remapping.

Validation: build13routes and30tests pass; Chrome13routes at1440/1024/768/390/360px, day/night homepage, unchanged semantics/copy/links, seven reduced-motion service diagrams, stage replay/cycle checks, zero overflow/errors. All16 protected animation/script source hashes match pre-phase snapshots. Screen reader, physical device, Lighthouse and field CWV not performed. No blanket accessibility/performance certification claimed. Phase3 not started.


## 5 October 2026 — Approved dark-palette rebalance

Owner approved the Phase 2.75 direction and requested a palette-only navy adjustment. Primary shell canvas --itk-bg is now #081321; secondary depth --itk-bg-alt is #0A1728. Raised surfaces remain #0D1525/#111A2B. All brand, semantic, text, spacing, type and radius tokens retained. No animation-interior styles changed. The alternate depth token remains available without introducing alternating blue section blocks.

Night hero replaces its existing glow with radial-gradient(75% 70% at 18% 28%, rgba(66,186,235,.08), transparent 65%). This uses the existing noninteractive pseudo-element, with no new layer or motion. Night grid opacity reduced from .03 to .025. Day-mode treatment and pointer-light behavior retained.

Source sRGB contrast against canvas/depth/surface/raised: text 16.02/15.46/15.66/14.94; muted 6.41/6.19/6.27/5.98; cyan 8.40/8.11/8.21/7.84. These are flat-surface calculations, not blanket accessibility certification.

Validation Pass: hero and first two services checked in Chrome at 1440/1024/768/390px. Existing dimensions, spacing, headings and text match before/after; all animation and script hashes unchanged. No overflow or console/runtime errors. Day service palette retained. Build (13 routes) and all32 tests pass. Screenshot outputs navy-{hero,managed,cloud}-{width}.png. Stopped; no Phase3, Git, push or deployment.

## 5 October 2026 - Scoped service and CTA tokens
Service accents: Managed/Security #42BAEB, Cloud #5AA9FF, Networking #36B8D0 with #5C74D8 support, AI #8175E8 with cyan support. Shared CTA #329DCA / hover #42BAEB / text #071525; later hero-only pale #F4F7FB / hover #FFFFFF / text #081321. Service title clamp(36px,4.2vw,58px), weight500, line-height1.08, tracking-.025em; chapter11px plus44px rule; copy16px/1.6/46ch. Full validation and scoped changes: docs/reviews/2026-10-05-homepage-refinements.md.

## 7 October 2026 — Hero rotating phrase refinement

Added adjacent cyan tokens in public/visual-system-tokens.css: --itk-cyan-sky #7DD3FC / existing --itk-brand-cyan #42BAEB / --itk-cyan-deep #22B8E8. Only the hero rotating phrase consumes the new stops, at 135deg with background-clip:text; solid cyan remains the unsupported-clip fallback. Day overrides are --itk-cyan-sky-light #086B8D / --itk-cyan-light #08698B / --itk-cyan-deep-light #075D7D. Glow is a static 24px/.20 cyan drop-shadow on the night rotator only; day and forced colors have none. Other tokens/consumers unchanged.

Measured sRGB contrast for fully visible, settled text against sampled rendered backgrounds at 1440px (cyan pointer light centered on phrase), with 360px also checked:

| Stop | Night minimum | Day minimum |
|---|---:|---:|
| Sky |8.98:1|4.77:1|
| Middle |6.74:1|4.91:1|
| Deep |6.48:1|5.82:1|

All 101 interpolated gradient samples were checked against background pixels in the text bounds. Stops are channel-monotonic, so endpoint minima also confirm the final build. The pale night stops would only reach 1.58/2.10/2.18:1 on flat #F5F9FC; darker day tokens are therefore required. These measurements concern settled glyph colors, not partially transparent transition frames or a blanket WCAG certification.

Focus uses two contrasting bottom rules (3px focus color plus surface separation) without changing geometry; forced colors substitutes a 3px Highlight bottom rule. This keeps focus visible below the phrase and clear of the tightly spaced fixed headline. Motion 350ms ease-out with 10px vertical translation and 1.25px blur; reduced motion removes all transitions/translation/blur. Existing fixed headline typography, initial entrance easing and geometry unchanged.

## 7 October 2026 — Homepage header emphasis

Homepage-only emergency accents in public/emergency.css: night #FF 5A 5F; day #B 01D 2B for small-text contrast. Existing 1px border uses 90% accent opacity, surface uses 4%, halo is 14px at 22%; the existing 6px dot uses the same accent. Existing 3.2-second dot opacity pulse remains within prefers-reduced-motion:no-preference; reduced motion is static. Other routes retain their original emergency treatment.

The homepage theme track mixes the existing header ink at 5% fill /9% hover, with a neutral border mixing existing --itk-dim at 90% and header ink at 10%. Only the small existing knob uses brand cyan. No new global color tokens, fonts or typography introduced. State, symbol movement, focus system, size and script remain unchanged. Homepage-specific forced-color rules restore Canvas/ButtonText/LinkText/Highlight instead of author hues.

Actual Chrome rendered-background minimum ratios, including 360px and 1440px default/hover tracks: emergency text 5.34:1 day /5.74:1 night; proof text 6.55:1 across all eight widths/two themes; track border 3.53:1; focus ring 9.47:1; knob icon 6.14:1. All relevant text/control checks pass their 4.5:1/3:1 thresholds. The initial neutral border was 2.95:1 on night hover and was corrected by the 10% header-ink blend. These are tested render conditions, not a blanket accessibility certification.
