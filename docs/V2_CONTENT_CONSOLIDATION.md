# V2 homepage content consolidation

12 October 2026, Asia/Beirut. Working branch `v2-mega-navigation`, V2 checkpoint
`da3161d38f99a8c2a29e4e2d1fba56f283e15740`, with current uncommitted navigation and
continuous-background refinements preserved. No reset, V3/V4 edits or release actions.

## Pre-edit content audit

| Component | Distinct value / overlap | Treatment / dependencies |
| --- | --- | --- |
| WhoWeAre | Familiar people, broader expertise, training and proof categories | Retain unchanged; keep team escalation and EngineeringDevelopment |
| HowWeOperate | Seven-stage execution, documentation, hardware decisions | Consolidate copy here; preserve all three existing visuals and lifecycle |
| PhishingDecisionExperience | Four messages, twelve explanations, user-controlled decisions | Relocate to existing Cybersecurity page, which has no duplicate exercise; preserve reusable component/controller and fix navigation destination |
| ClientProof | External approved evidence, video controls, captions/transcripts | Keep exact conditional gate and implementation; current data has no approved media/quotes, so no public placeholder |
| TeamThread | Familiar engineer/context/expertise/follow-up repeats Who/How | Remove homepage and unused component with its scroll listeners/scoped styles; no other imports exist |
| Workflow | Five-stage storage example repeats primary seven-stage workflow | Remove homepage invocation only; `/how-we-work` still requires the component, controller and tests |
| Attention | Daily-review questions plus security layers | Merge concise, qualified review reference into How; Cybersecurity already uses identical SecurityLayers; DailyChecks remains on `/how-we-work` |
| Advice | Workload, condition/supportability before purchases | Merge rationale into How's existing hardware row; remove unused standalone component |
| Knowledge | Records, service information and open actions repeat documentation | Merge into one How documentation explanation/visual; remove unused standalone component |
| AIPlaybook | Policy resource, cover, existing corner feature and inline promotion | Retain original nonmodal popup/dismissal; compact inline resource becomes no-JS fallback, so no simultaneous automatic promo and no layout shift from hiding/showing an inline row |
| CTA | Clear next step and existing review/contact flow | Preserve byte-identical component and destination |

Original order after unchanged service/Pulse/Technology prefix: Who → How → Phishing →
conditional ClientProof → TeamThread → Workflow → Attention → Advice → Knowledge →
AI resource presentations → CTA → Footer.

Final order: unchanged prefix → Who → consolidated How → conditional ClientProof →
CTA → Footer, with the existing nonblocking Playbook feature and compact no-JS fallback.
No new service route, testimonial, capability, guarantee or booking system.

Routine review scope/schedule remains qualified; existing detailed DailyChecks describes
illustrative questions without promised daily coverage. Release approval for operational
claims remains separate from this authorized local copy consolidation.

## Implementation and validation

Completed in the current V2 worktree. Baseline source/build hashes and browser
measurements/screenshots are outside Git at `../v2-consolidation-evidence/`.

- Removed homepage TeamThread, duplicate Workflow, Attention, Advice and Knowledge.
  Deleted the four components with no remaining imports. Their scoped scripts and
  scroll containers disappear with them; 88 obsolete public CSS selectors and two
  dead branches of shared selectors were pruned. No shared asset was deleted.
- Kept Workflow and DailyChecks on `/how-we-work`, and the existing SecurityLayers
  on Cybersecurity. Preserved all animation/controller source files byte-for-byte.
- Consolidated records/configurations/service information/decisions/open actions
  into the existing documentation row, and workload/condition/supportability into
  the existing hardware row. Routine reviews replace the repeated escalation story;
  daily frequency is not promised without supporting service-scope evidence.
- WhoWeAre, training, proof strip, Hero, Services, Pulse, Technology and CTA source
  are unchanged from the starting worktree. Previous navy/spacing/navigation work
  remains intact. Existing bounded seven-stage example and its timings are unchanged.
- Relocated the intact phishing component after the existing Cybersecurity example,
  before its CTA. Scoped its existing navy theme to the reusable component rather
  than Home and added 140px anchor clearance. Updated the menu destination.
- Preserved Playbook cover, resource route and dismissal/controller source. The
  compact inline presentation is now a no-JavaScript fallback; normal browser DOM
  has no inline promotion competing with the existing corner feature.
- Preserved ClientProof component/data/media handling and exact approval gate.
  No approved content is supplied, so this optional section remains absent.

### Validation results

- PASS: final Astro production build, 16 pages; Node 22 test suite, **97/97**;
  `git diff --check`. Replaced outdated homepage expectations with coverage for the
  new hierarchy; retained meaningful workflow, phishing, motion and resource checks.
- PASS: all seven requested widths, no horizontal page overflow, no missing homepage
  fragments, expected section order and continuous navy throughout the retained chapters.
  No removed section wrappers or TeamThread scroll regions remain.
- PASS: retained team/workflow/documentation/hardware entrances observed in the local
  browser and settled states verified. Desktop team has all seven visible nodes;
  the How visuals reach their original resolved/shared/upgrade outcomes. Animation
  lifecycle and reduced-motion unit checks pass; reduced-motion CSS remains unchanged.
- PASS: all twelve phishing choices exercised using Enter, with explicit Continue,
  final takeaway and Space restart, at 1440px and 390px. Across 24 choices, exercise
  stage and section height deltas were **0px**. Focus moves to Continue as before,
  and feedback remains a polite live announcement. No duplicate exercise exists.
- PASS: actual menu link opens `/services/cybersecurity/#phishing-decisions`;
  Playbook opens its substantive resource page/PDF links; closing review CTA opens
  the existing contact page. Full built-anchor audit across all 16 pages finds **0**
  broken internal destinations/fragments.
- PASS: 14 other pages' built main content and all 16 footers are byte-identical to
  the captured pretask build. The shared navigation's phishing link is intentionally
  changed on every route. No unrelated service animation was altered.
- Browser resizing and retained animation settlement did not change page geometry
  after the recorded layout. This is measured local geometry, not a field CLS claim.

### Measured page length

Same local browser, 1000px viewport height, normal-size text and current V2 theme.
Measurements include the entire document, not just the edited chapters.

| Width | Before, px | After, px | Reduction, px | Shorter |
| --- | ---: | ---: | ---: | ---: |
| 1920 | 15,089 | 9,247 | 5,842 | 38.7% |
| 1440 | 15,085 | 9,245 | 5,840 | 38.7% |
| 1024 | 16,326 | 9,277 | 7,049 | 43.2% |
| 768 | 19,334 | 12,059 | 7,275 | 37.6% |
| 430 | 19,858 | 12,089 | 7,769 | 39.1% |
| 390 | 20,234 | 12,349 | 7,885 | 39.0% |
| 375 | 20,367 | 12,321 | 8,046 | 39.5% |

Approximate reduction: **38–43%**. The old TeamThread height depends on its viewport
fit guard; these are the captured rendered baseline states rather than an assumed
maximum scroll height. Its removal eliminates that variable storytelling region.

Comparable WhoWeAre screenshots: `before-desktop.jpg` / `after-desktop.jpg`, and
`before-mobile.jpg` / `after-mobile.jpg`. This retained chapter intentionally looks
the same. Added workflow/documentation screenshots show the consolidated material.
Raw evidence: `before-metrics.json`, `after-metrics.json`, `phishing-relocation-qa.json`,
`final-audit.json`, `build.log`, `tests.log`, source hashes and `baseline-dist/`.

### Files changed for this task

- `src/pages/index.astro`, `src/pages/services/cybersecurity.astro`.
- `src/components/HowWeOperate.astro`, `AIPlaybook.astro`,
  `PhishingDecisionExperience.astro`.
- Removed `src/components/{TeamThread,Attention,Advice,Knowledge}.astro`.
- `src/data/navigation.ts`, `src/styles/home-continuity.css` (dead selector only),
  `public/{style,mobile,visual-system}.css`.
- `tests/{home-motion,workflow,phishing-decision-experience}.test.mjs`;
  new `tests/home-consolidation.test.mjs`.
- `docs/V2_MEGA_NAVIGATION.md` (relocated link), this report,
  `claims-register.md`, `PROJECT_STATUS.md`.

Other dirty/untracked files shown by Git belong to the preserved navigation and
continuous-background tasks. This task's source hash audit distinguishes them.

### Review and limitations

Vercel Web Interface Guidelines retrieved 12 October 2026 from
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md.
Reviewed changed markup, native controls/headings, resource artwork dimensions,
focus, anchor clearance, responsive layout and existing motion preferences.
No new actionable finding remains in the changed UI scope.

No approved real testimonial media is available to exercise. Physical devices,
Safari, native screen-reader speech, full browser zoom/text-spacing overrides,
forced-colors and live browser reduced-motion emulation were not repeated in this
task; existing automated lifecycle/reduced-motion coverage passed. These checks
remain unavailable/unperformed rather than being labeled Pass. Local width checks
and keyboard flows are not a comprehensive accessibility certification.

The contact page's existing online submission remains disabled and honestly labeled
unavailable; its backend/privacy/contact-input prerequisites are outside this task.
Operational copy remains owner-attested and production evidence review remains
separate. Unconfirmed offerings and unapproved client evidence stay excluded.

**Done:** local consolidation and checks. **Decisions:** retain strongest existing
visuals and relocate the exercise; avoid unsupported daily-frequency claims.
**Assumptions:** none added as company facts. **Blocked:** no local implementation
blocker; unavailable validation and existing contact prerequisites listed above.
**Needs review:** Jim's visual review at http://127.0.0.1:4352/#who-we-are.
**Deployment:** none; no commit/push/merge/deploy, no V3/V4 edits.
**Next:** stop for the requested visual review.
