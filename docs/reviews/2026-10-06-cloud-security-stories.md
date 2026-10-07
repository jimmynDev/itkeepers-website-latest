# Phase 2 — Cloud and Cybersecurity operational visuals

Implemented directly in the existing local project. Only the two homepage animation components were rebuilt; shared service layout, hero, routes, CTAs, service copy, global canvas and other animation components remain unchanged. No Git, commit, push, deployment or Phase 3 work.

## Microsoft 365 & Cloud

The connected map now explains User → Entra ID → Microsoft 365 → Devices / Email & Collaboration → ITKeepers business context and oversight. Google and AWS were removed from this homepage visual. Nodes stay legible while a short sequence activates connections, sends a data token and confirms the managed environment. Blue #5AA9FF remains the accent; no vendor-color palette or fabricated live metrics.

Desktop retains the connected map. Mobile replaces its wide connector paths with a vertical identity/service spine, paired device/communication endpoints and an oversight node; secondary micro-labels are omitted. The outcome remains readable.

## Cybersecurity

Replaced the generic orbit/shield with five explicit protection bands: Identity, Endpoint, Network, Operations, Recovery. One example suspicious event moves down the layers, with named access/device checks, containment, response review and recovery checks. The final state reads “Contained. Reviewed. Recovery checked.” Cyan #42BAEB remains dominant; the existing success token #2DD4A7 is limited to containment/recovery outcomes. The small event marker uses muted warning #E58B77 (day #A23E2C). There are no counters, live-feed claims or SOC dashboard.

Mobile keeps the five layers, short result labels and a compact signal path, removing secondary explanatory labels. It is not a shrunken desktop diagram.

## Lifecycle, accessibility and layout

The unchanged shared animation-lifecycle.ts controller owns viewport entry, the existing 600ms visual entrance, 96px entry / 160px full-exit replay, pausable scheduling, document visibility, disposal and reduced-motion behavior. The new service-operational-stories.ts module supplies only the two timelines via that controller's scheduler; no extra observers, scroll listeners, RAF loops or independent timers.

Both stories play once. They reach the meaningful final illustration at 5.1s and the controller settles at 6.25s. Cloud retains its prior 6.25s duration; Security replaces its 16s decorative orbit with the new 6.25s explanatory story. Offscreen and user pauses preserve remaining time. Full exit restores pristine markup and starts a clean entrance/story on return.

Reduced motion and no-JavaScript fallback show all meaningful layers/nodes and the final outcome immediately. HTML lists expose each story once; decorative connectors, tokens and transient status text are hidden from assistive technology. Native pause controls have visible focus and keyboard operation. Each artwork reserves 48px below its canvas for the 44px control, including while it is hidden, avoiding both CTA overlap and appearance-time layout shifts. This is the only small artwork-spacing adjustment.

Service headings, descriptions and CTA text were not edited. New copy is confined to diagram labels, sample status and outcomes.

## Validation

- Build: PASS, 14 routes.
- Tests: PASS, 47/47 (40 existing plus 7 story/static-content cases).
- Responsive final-state checks: PASS at 1440, 1024, 768, 390, 360 in day/night; additional 320px reflow check passes. Labels/outcomes stay inside reserved artwork bounds; no horizontal overflow.
- Playback: all five requested widths checked for entrance before internal playback, native keyboard pause, offscreen pause, meaningful settlement, full-exit replay and live reduced-motion changes. Reserved figure heights remain unchanged during playback and completion.
- Continuous canvas: transparent section backgrounds retained; hover pixel checks across Cloud and Security section boundaries show no hard seam.
- Reduced motion/no JavaScript: meaningful final-state content visible, no active step motion.
- Console/runtime: no errors in browser checks.
- Independent Design/UIUX review: initial pause-control overlap concern fixed by reserved space and 44px targets; reviewer confirmed no remaining actionable code findings.
- Vercel UI review skill and current rules retrieved 6 October 2026 from https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md and https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md. Review applied to changed components. Physical-device/screen-reader testing and a formal accessibility certification were not performed.

Evidence outside the repository: C:/Users/Jim/Documents/Codex/2026-10-03/hi/outputs/operational-responsive.json, operational-reflow.json, operational-lifecycle.json, operational-mobile-lifecycle.json and operational-{cloud,security}-{width}.png. A mobile fixed-time settlement assertion was timing-sensitive; the final check waits for actual completion state with a bounded timeout. No product playback workaround was added.

## Exact files changed

- src/components/animations/CloudEcosystemAnimation.astro
- src/components/animations/CybersecurityBadgeAnimation.astro
- src/scripts/service-operational-stories.ts
- tests/service-operational-stories.test.mjs
- PROJECT_STATUS.md
- docs/reviews/2026-10-06-cloud-security-stories.md

Stopped after this refinement. Not deployed.
