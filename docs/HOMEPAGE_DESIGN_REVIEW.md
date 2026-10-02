# Home design review — staged local candidate

Owner: Agent 01 / Design. Review started 1 October 2026 (Asia/Beirut).
Revision: current unborn master checkout; no HEAD commit available.
Scope: header, hero and first two Home sections first; parent browser checkpoint
before lower homepage implementation. Existing interactions remain required.

## Authority and review sources

Read root AGENTS.md, PROJECT_STATUS.md, claims-register.md, DESIGN_TOKENS.md,
project brief/site map, Agent 01 role and active Home components/styles.
Retrieved the Vercel skill and current rules on 1 October 2026:
- https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md
- https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md

Retrieval Pass. Canonical project policy governs conflicting editorial suggestions:
retain approved sentence case/copy, native control keyboard behavior, no automatic
focus on every result, and no tool answers in URLs. Transform-only recommendations
will inform new effects; existing purposeful SVG trace painting is an explicitly
reviewed performance trade-off, not an automatic rewrite or unmeasured performance
pass. Publication approval remains distinct from local implementation permission.

Agent role source still contains stale requirements for automatic tool focus,
mechanical alternating sections, development team placeholders and reopening an
unknown stack. Follow root shared policy instead; discrepancy flagged to parent.

## Initial actionable findings

- src/layouts/Base.astro:58 — no skip link/main target. Impact: repeated keyboard
  navigation. Fix: visible-on-focus skip link and named main target. Owner: Design.
- src/layouts/Base.astro:61 — header logo missing intrinsic dimensions. Impact:
  potential layout shift. Fix: verify asset dimensions and reserve aspect ratio.
  Owner: Design; SEO supports review.
- public/mobile.css:1 — non-CTA navigation hidden below 800px with no alternative.
  Impact: routes inaccessible through primary navigation on mobile. Fix: semantic
  native mobile disclosure menu; preserve keyboard/no-JS access. Owner: Design.
- public/style.css:1 — links/buttons lack explicit hover feedback. Impact: weak
  interaction affordance. Fix: underline links and purposeful control hover/focus,
  honor reduced motion. Owner: Design.

## Checkpoint status

Reference observations pending parent browser inspection. No new visual direction
or implementation started. Existing rendered QA history remains scoped to the
previous candidate and does not validate this redesign.

## Reference observations and first checkpoint

Parent inspected rendered EMPIST at approximately 1240px: oversized typographic
hero, polished inset navigation, generous split service pacing and interactive
menus. Changing headlines, auto-updating ticket mockups, particles/orb imagery,
reference assets and operational copy are deliberately excluded. Observations
support hierarchy/spacing/section pacing only, not claims or copied source.

Implemented first stage: inset navy header, stable oversized white/cyan hero,
three-tenet strip, light editorial TeamThread with blue accents, dark split
service index. Header gains skip link and native mobile disclosure navigation;
links preserve standard browser navigation. Existing TeamThread script and lower
workflow/review/layers/purchasing/knowledge/closing sections are untouched.

- src/layouts/Base.astro — prior skip-link/mobile-nav findings fixed in source.
  Logo has an explicit object-fit reserved box; intrinsic asset dimensions still
  Blocked (direct asset request HTTP403). Owner: Design/SEO.
- public/style.css — explicit hover, focus, text balancing and touch affordances
  added; full-opacity local themes reuse measured contrast tokens. Owner: Design.
- src/components/Hero.astro — exact stable H1 and HTML tenets; no rotating text.
- src/components/Services.astro — semantic list of native service links, no tabs.
- src/components/TeamThread.astro — only section theme/packet surface changed;
  existing pause, measured viewport fallback and reduced-motion behavior retained.

Source review Pass, owner Design. Parent build and actual browser checkpoint
pending. No mouse/touch/keyboard/layout pass asserted for this candidate. First
stage stops here until parent checkpoint feedback; no lower-section redesign yet.

## Taste reconciliation — 1 October 2026

Reread the updated Agent 01 tailored Taste/Vercel profile before further design.
Retrieved the linked upstream core guidance successfully (GitHub core sections on
brief inference, preservation, hierarchy, contrast and layout); no bundle installed:
https://github.com/Leonxlnx/taste-skill/blob/main/skills/taste-skill/SKILL.md

Design read: an approachable enterprise B2B IT homepage for business owners,
using original navy/cyan editorial composition around familiar people and shared
context. Current stage already follows the tailored profile: preserve Astro/plain
CSS, stable exact hero, concise lead/contact path, purposeful light relationship
composition, open service index, readable initial HTML and bounded motion.

Project overrides remain authoritative over upstream suggestions for frameworks,
UI packages, icon/font libraries, theme toggles, design dials and rigid headline or
copy limits. Existing custom SVG explains the relationship; no decorative assets,
looping effects, fake metrics, or imagery are introduced. Contact labels follow
project vocabulary by context. Native details remain valid accessible controls.

Parent desktop checkpoint at 1240x712: hero/headline and contact CTA visible,
strong stable composition. Header logo observed broken (HTTP403, natural width 0);
this is a Fail requiring an authentic current asset, not a plausible substitute.
Parent is inspecting the official site asset. Mobile/first-two-section checkpoint
still pending; lower-section changes remain on hold.

## Lower composition and current review findings

Checkpoint passed by parent before extension: desktop 1240x712 CTA ends near 582px;
mobile 375x812 CTA ends near 519px and document width 360px; native Menu Enter opens,
Space closes with visible 3px cyan focus; service anchor navigation works. Light
TeamThread diagram/story and dark service index were actually inspected as readable.
These are bounded observations, not a full compliance or real-touch pass.

Lower composition now follows the same design system: open navy process controls,
light daily-review content plus a purposeful navy security-layers panel, cyan
purchasing definition rows, blue shared-context example with a white index, and
an oversized cyan closing invitation. Existing five-step evaluation/navigation
script, daily questions and all five native layer disclosures remain unchanged.
No Keep/Upgrade page exists in this checkout; no fictitious tool/link was added.

### File/line review

- src/layouts/Base.astro:52 — Pass: skip link targets focusable main at 58. Native
  keyboard semantics retained; no forced focus during content updates. Owner Design.
- src/layouts/Base.astro:54 — Fixed: broken remote logo replaced with parent's
  authentic byte-identical official local PNG; actual 1747x289 dimensions reserve
  layout. Footer at 60 lazy/async. Parent final rendering verification required.
- src/layouts/Base.astro:56 — Pass source: mobile native details plus progressive
  Escape at 63 closes and intentionally restores summary focus. Prior Enter/Space
  mouse checks passed; new Escape behavior awaiting rendered verification.
- src/components/Hero.astro:2 — Pass source: exact normalized positioning including
  final period; concise local-only Copy lead at 3. No text rotation/hidden duplicate.
- src/components/TeamThread.astro:16 — SVG trace painting is a bounded existing
  purposeful animation exception to Vercel transform-only preference; full route
  and readable labels remain. Existing viewport/motion fallback unchanged.
- src/components/Workflow.astro:13 — Native selectable buttons; polite status at 19,
  no auto-advance or focus movement. Style refinement preserves data attributes,
  aria-current/disabled behavior and initial HTML fallback. Owner Design/Workflow.
- src/components/Attention.astro:5 — DailyChecks/SecurityLayers remain native
  details and full-contrast text within scoped light/navy themes. Qualifications
  stay outside collapsed disclosures. Owner Design.
- src/components/Advice.astro:1 — Three concrete static verdict explanations;
  Illustrative and rule-of-thumb limitation adjacent. No evaluator or invented
  threshold. Owner Design/Copy; B9 evaluator release remains Blocked.
- src/components/Knowledge.astro:1 — Copy's exact description of dummy example
  replaces actual-reporting assertion; native definition list groups shared context.
- public/style.css — Explicit hover/focus, reduced-motion hover exceptions, logical
  gutters/safe-area protection, open layouts and responsive stacks. Existing
  workflow/daily-layer behavior preserved. Owner Design.

Typography/radius rules: UI pills for contact/step navigation, 16px grouping panels
for intentional shared/layer context, small square labels for technical annotations.
No arbitrary universal card grid, gradients, particles, ongoing decorative loops,
stock photography, new dependencies, processors or collection were introduced.

Validation: Pass source review (Design). Integrated final build/tests, exact
computed contrast, final all-breakpoint and mouse/keyboard review remain Blocked
until parent completes them. True touch/device, screen-reader and complete zoom,
text-spacing/forced-colors checks require manual QA owner (B14). Forms, loading,
async failure/success states: Not applicable to this static redesign; existing
inquiry implementation is unchanged and B3/B13 remain outside this scope.

Files: Base body/header/footer, Hero, Services, TeamThread themes, Attention,
Advice, Knowledge, CTA, public/style.css, DESIGN_TOKENS.md and this review.
Workflow markup/script and root registers are integration-owned and unchanged by
Design. No commit or deployment. Next: integrated build/browser review and fixes.


Integrated build-output evidence read by Design: `.codex/qa/2026-10-01/build-checks.json`
records ten routes with one H1 each, no missing link targets/duplicate IDs/public
placeholders, three same-origin external modules totaling 2,669 bytes on Home,
zero executable inline Home scripts and valid Menu Escape logic. Pass for those
bounded emitted-output checks; owner Workflow, reviewed by Design. This evidence
is not a browser input-mode, full accessibility or performance measurement.


## Recording-led correction — authorized pointer lighting

Read both local detail sheets of the supplied recording and the appended reference
observations before this correction. User explicitly requested the broad moving
color wash; it is now a bounded exception to the earlier blanket glow avoidance,
used to cue the current service scene. No idle loops, particles, copied assets,
rotating headline or fake console/ticket are introduced.

First comparison stage: continuous dark navy surface, actual Managed IT intro,
alternating-scene foundation and initial-HTML four-part context diagram. Services
now precede TeamThread; its four semantic chapters remain with shortened title/
spacing and no extended sticky chapter heights. Remaining service links stay
available while the first scene awaits parent visual comparison.

Pointer lighting uses a fixed pointer-events-none 1000px radial layer below all
content. Fine mouse/hover with no reduced-motion only; pointer events schedule one
frame and update transform/opacity. No idle requestAnimationFrame loop. Leaving,
window blur, hidden document or motion-preference change hides the layer. Touch/
coarse/reduced-motion shows complete static content. Keyboard focus-within gives
an equivalent static scene wash on an opaque base, preventing additive lighting.
Hero entrance is one-shot transform-only; important content is never opacity 0.

Worst-case cyan light compositing (24% #01beff over #061b3b): background approximately
#05426a; white 10.52:1, muted #d6e4f5 8.15:1, sky #5cc5ff 5.45:1, cyan #42baeb 4.74:1.
Source calculations Pass; actual browser pointer/render checks pending parent.
First-stage implementation has no new dependencies, thresholds, collection or
business wording; copied intro remains local candidate with publication pending.

