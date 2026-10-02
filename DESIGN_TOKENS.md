# Design tokens — Home contrast

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
