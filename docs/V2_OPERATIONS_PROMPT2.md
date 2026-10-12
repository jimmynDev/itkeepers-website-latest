# Prompt 2 — How We Work and operational animation

12 October 2026. Branch `v2-mega-navigation`, baseline HEAD `da3161d38f99a8c2a29e4e2d1fba56f283e15740` with prior local work preserved. Prompt1 is intact. Prompt3 is untouched. No V3/V4 change, dependency, commit, push, merge or deployment.

## Result

The existing incident panel now shows three compact cyan line icons and readable source titles: Monitoring alerts, Routine reviews and Client reports. Desktop paths converge on Issue assessment; narrow screens retain all labels and use a single vertical connector. The same seven-stage rail follows assessment. Ticket created replaces Ticket created automatically. The travelling ticket uses a transform and is hidden until the incident sequence begins. The final status is Documented.

Three source entrances start at100/240/380ms; the connection starts650ms, after their260ms entrances finish. The first stage starts1100ms, with the original480ms stage interval. Playback remains4800ms, without looping. The shared animation-lifecycle.ts is unchanged, including spatial entry/exit hysteresis, offscreen pause, replay, reduced-motion and static-fallback rules. No independent timer, observer or animation library was added.

Removed visible explanations below all seven stage titles, the incident introductory sentence and the redundant one-thread footer. Stage descriptions remain visually clipped rather than hidden from assistive technology. Added concise accessible source/assessment context stating that not every signal becomes an incident and ticket creation is not universally automated. One visible qualification remains: “Illustrative — Example workflow, not an outcome or timing guarantee.”

Kept From signal to resolution and the general two-column composition. The intro is now “Signals are assessed before action is taken, with context, ownership and follow-up.” Right-hand text is consolidated into Reviewed by engineers and “Engineers assess signals in context and follow up on work that needs attention. Scope and schedule depend on your service agreement.”

Reused DailyChecks.astro and SecurityLayers.astro without changing either file or their other consumers. The three daily-review and five security-layer items retain their existing explanations. They appear in two columns above768px and stack on narrower screens, without surrounding filled cards. Native details/summary remain collapsed by default, independently expandable and keyboard accessible. Labels16px, targets48px, descriptions16px/1.6/400. Existing scope/restore caveats remain, with Explore cybersecurity linking to `/services/cybersecurity/`.

Documentation and Keep/Upgrade/Replace content, drawings and functionality are unchanged; no data-control or ownership claim added. Old supporting anchors remain: operate-monitoring-title now identifies the concise engineer-review copy and operate-reviews-title identifies the source label. New/current heading anchors have room below the sticky navigation.

## Files changed

| File | Change |
| --- | --- |
| src/components/HowWeOperate.astro | Shorter copy, reused technical details, scoped layout/focus-friendly heading anchors |
| src/components/animations/OperationalWorkflowAnimation.astro | Source/assessment graphic, simpler visible timeline, accessible context, responsive/motion styles |
| src/scripts/approved-operate-animations.ts | Incident factory/source sequencing and transform travel; knowledge/hardware functions unchanged |
| src/styles/home-continuity.css | Incident-only gap adjustment/comment; protected story overrides unchanged |
| tests/operational-workflow.test.mjs | New seven focused tests using actual controller and shared lifecycle |
| tests/workflow.test.mjs | Updates prior intentional absence assertion for restored homepage details |
| claims-register.md | Records exact owner-authorized qualitative/illustrative copy |
| PROJECT_STATUS.md | Scope, decisions, validation and review stop |
| docs/V2_OPERATIONS_PROMPT2.md | This handoff |

No component file was deleted. DailyChecks, SecurityLayers, the shared lifecycle, Prompt1 components, dependency manifests and other pages are preserved.

## Validation and limits

Owner: primary agent. Independent source reviewer: contact_review, no actionable implementation findings. One new test initially counted the unrelated navigation details; its count and default-closed checks were scoped to operate-details. The pre-consolidation workflow test was updated for the intentionally restored components. Focused11/11 and final114/114 tests pass.

| Check | Result | Evidence |
| --- | --- | --- |
| Production build | Pass | Final Astro build,16 pages |
| Tests / whitespace | Pass | 114/114; git diff --check |
| Responsive layout | Pass | 1920/1440/1280/1024/768/430/390/375/320; no horizontal overflow/clipping; controls>=48px |
| Text contrast | Pass | Computed ancestor backgrounds/alpha/gradient stop bounds; minimum6.41:1. Source/assessment cyan minimum6.50:1; supporting B8C4D6 minimum10.57:1 |
| Mouse / keyboard details | Pass | All8 open/close by click on390px; all8 open simultaneously; Enter opens and Space closes; visible cyan focus; expanded descriptions16px/25.6px with no clipping |
| Source gate / seven stages | Pass | Actual-controller/lifecycle tests and live desktop/mobile sampling show sources, assessment, all7 phases and settled Documented |
| Offscreen/replay | Pass | Actual lifecycle tests cover shallow pause, full-exit replay and no timer/listener growth; live desktop exit/re-entry observed |
| Reduced motion | Automated/source pass | Actual lifecycle/controller tests cover initial and mid-play preference change; all sources/steps settle without timers. CSS reduced variant and complete authored fallback checked |
| Initialization/playback stability | Geometry pass | 0px workflow-height change in live desktop/mobile playback samples; no dimension-changing source entrances. No CLS score measured |
| Protected functionality | Pass | Knowledge finishes at Engineer B; hardware finishes with6 read signals and Upgrade selected; stories remain762px/1884px at1440/390 |
| Prompt1 / unrelated preservation | Pass | Baseline hashes;15 non-home main regions/all16 headers/footers and12 unaffected home sections byte-identical; both protected story articles byte-identical |
| Internal links | Pass | 1,643 built href checks,0 broken; actual Explore cybersecurity click reaches Cybersecurity H1 |
| Live reduced-motion emulation, native screen reader/zoom, physical devices/Safari, no-JS browser mode | Not performed | Browser tools expose viewport/visibility only; authored HTML and controller tests are not a native-device certification |
| Release | Not applicable | Owner required local implementation and stop for review |

The final changed-file review followed the project-required [Vercel review skill](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md) and [current rules](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md), retrieved12 October2026. Native semantics, focus, headings, defensive wrapping and transform-based travel were checked. No unresolved actionable finding in changed scope. Existing project/owner scope governs unrelated components and copy.

Workflow figure:628.2→530.8px at1440,694.4→585.8px at390, approximately16% shorter. Restoring eight required accordion rows increases the full section's closed height; no whole-section shortening is claimed. Their density/full-section height is a human visual-review point. Protected story dimensions are unchanged.

Evidence is outside Git at `../v2-operations-evidence/`: baseline-hashes/status/dist/controller, before-layout/screenshots; final build/tests/focused-tests logs, after-layout.json, contrast-layout-results.json, preservation-results.json, desktop-motion.json, mobile-motion.json, accordion-interaction.json, keyboard-final.json and protected-functionality.json; final desktop/mobile captures. Local development style caches were refreshed before final checks. Travelling-ticket samples naturally include intermediate positions between stage nodes; target geometry is tested directly.

## Handoff

Done: local Prompt2 refinement and validation. Decisions: conditional human assessment; no universal automation claim; native reused accordions; finite existing lifecycle; protected Prompt1/Prompt3 content. Assumptions: no new company facts beyond owner-attested qualitative copy, recorded separately from independent evidence. Blocked on: none for this local task. Needs review from: Jim for visual review, particularly accordion density and restored section height.

Preview: `http://127.0.0.1:4352/#operate-title` and `http://127.0.0.1:4352/#operate-daily-title`. Next: stop. Do not begin Prompt3. Not deployed; no commit created.
