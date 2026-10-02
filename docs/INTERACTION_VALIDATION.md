# Interaction validation — 30 September 2026

## Integration follow-up — local candidate

The earlier missing-controls matrix below is the **pre-change baseline**. It is
preserved as evidence; it does not describe the new candidate's availability.
Workflow/integration implemented the unblocked process/disclosure scope locally.
No commit exists on unborn master; no deployment was performed.

| Flow | Current implementation | Automated verification | Browser input verification | Owner |
| --- | --- | --- | --- | --- |
| Monitoring workflow | Five manually selected steps on Home and How We Work, with Previous/Next and selected step text | Pass: built module forward/reverse/direct navigation and endpoint guards; five initial-HTML panels | Pass for observed mouse/keyboard cases below; touch Blocked (no touch API/device) | Integration / manual QA |
| Escalation | Colleague involved step explicitly says not every incident needs escalation; same context stays in the example | Pass: direct selection and complete text in built Home/How We Work | Pass: direct mouse selection on Home and Space on How We Work; touch Blocked | Integration / manual QA |
| Daily checks | Three native disclosures on Home/How We Work: backups, alerts/system health, open work/follow-up | Pass for initial HTML presence; no simulated native input-mode pass | Pass: all three Home controls by mouse, Space and Enter; reused markup verified on How We Work; touch Blocked | Integration / manual QA |
| Security layers | Five native disclosures on Home/Cybersecurity: Identity, Endpoints, Network, Operations, Backups | Pass for built native details/summary presence on both routes | Pass: all five Home controls by mouse, Space and Enter; Cybersecurity includes five and Backups toggled by Space; touch Blocked | Integration / manual QA |
| Purchasing examples | Existing static illustrative explanation retained; evaluator not enabled | Blocked B9: no approved thresholds/precedence | Blocked for tool input modes; static copy remains readable | Engineers |
| Self-check | Still absent; questions/notes and evaluator not enabled | Blocked B9: questions/notes remain Proposed | Blocked for tool input modes | Engineers |

**Pass:** `npm run build` (ten existing routes); `node --test
tests/workflow.test.mjs` (four tests against the actual emitted workflow module
and generated HTML). Checks cover all steps, both directions, direct selection,
endpoint guards, independent component instances, repeated initialization and
missing-control fallback. These are state/source checks, not mouse, keyboard or
touch browser tests. Stepper module is external same-origin JS (~1.07 kB,
~0.50 kB gzip), preserving the existing CSP/build policy.

**Pass (scoped):** changed output contains no unresolved publication placeholders;
five workflow articles start visible in initial HTML and controls start hidden.
Native disclosures work independently of JavaScript. Added explanatory copy uses
an explicitly hypothetical storage-warning example and generic questions/control
categories; production wording review remains pending. This is not a complete
sitewide claim/security audit.

**Not applicable:** new form/delivery tests (no inquiry endpoint or processing
change), new loading/error/success states (local explanations, no asynchronous
operation), lint/type scripts (none configured in existing package.json).

**Blocked B14:** real touch/device tests, screen-reader announcements, complete
zoom/text-spacing, forced-colors, reduced-motion rendering and automated browser
accessibility audit pending appropriate QA/access. Parent's observed browser
results are recorded below; no full compliance or touch result is inferred.

### Independent browser review of integrated candidate

Pass (scoped): the parent used the same in-app browser through its documented
APIs. Original user tab 3 timed out on reload/focus emulation; a fresh temporary
QA tab 4 loaded the HTTP preview normally. No error-page security block was
bypassed, and the temporary tab was closed after testing.

- Next clicked from step 1 through steps 2, 3, 4 and 5; each status matched the
  step and exactly one panel was visible. Native Enter on the focused last Next
  left step 5 unchanged. The locator helper declined its disabled endpoint;
  native keyboard input verified the guarded behavior instead.
- Previous activated with Space moved step 5 to step 4. Priority assessed selected
  with Enter moved to step 2; Colleague involved selected by mouse moved to step 4.
- Selecting Signal detected, then five Tab presses, reached Previous in source
  order. Native Enter at the first Previous left step 1 unchanged. Focus remained
  on the initiating button; computed keyboard outline was 3px solid #5cc5ff.
- All eight Home summaries: mouse opened, Space closed and Enter reopened each.
  Computed keyboard outline was 3px solid #0b2c5f on the light section. Shift+Tab
  from Identity reached Open work & follow-up; Tab returned to Identity.
- How We Work loaded the reused workflow and three daily checks. Space selected
  Colleague involved and produced Step 4 of 5: Colleague involved.
- Cybersecurity contained all five layers through the shared service-page slot.
  Space opened Backups; its dark-section focus outline was 3px solid #5cc5ff.
- At 375 × 812, mouse Next advanced to step 2; the measured smallest step selector
  was 82.78px high and summary 60.80px high. Document scroll width 360 at viewport
  375. At 320 × 740, scroll width 305 and no inspected main element extended beyond
  the viewport. Viewport override reset. These are narrow-layout mouse checks,
  not touch or zoom tests.
- Observed console warning/error sample was empty (limit 8); not a network/security
  audit. Screenshots visually reviewed and saved at
  `.codex/qa/2026-09-30/workflow-integrated-desktop.jpg` and
  `.codex/qa/2026-09-30/disclosures-integrated-desktop.jpg`.

Owner: parent integration reviewer. No browser-found implementation defects in
these cases; outstanding B9/B14 gates still apply. Initial-HTML fallback checks
come from generated-output tests, not a browser session with JavaScript disabled.

Keyboard contract: these are ordinary buttons, not ARIA tabs. Tab/Shift+Tab move
between step selectors and Previous/Next; Enter/Space activate. `aria-current`
marks the selected step and a polite atomic status names the new step. Focus stays
on the initiating button. Endpoint buttons remain focusable with `aria-disabled`
and guarded handlers to avoid losing focus at the first/last step. Native
summary controls handle Enter/Space and exposed expanded state. No automatic
advance, gesture-only controls, tool storage/network requests or new dependency.

B9 needs an authoritative revision: the proposed HDD cutoff at age six cannot be
resolved from the five-to-seven age bucket; battery rule six uses age five or less
while its starter test expects Upgrade for a six-year-old. The MVP says four-to-six
questions but enumerates up to nine. Proposed Windows support assumptions also
need current official verification when engineers approve rules. No conflicts
were silently resolved. Self-check questions and notes still need engineer wording
approval. Phase 1's tools remain agreed outstanding scope, not removed scope.

Implementation references: Workflow.astro, scripts/workflow.ts, DailyChecks.astro,
SecurityLayers.astro, Attention.astro, how-we-work.astro, ServicePage.astro,
services/cybersecurity.astro and scoped additions to public/style.css.
Technical references checked: [W3C status messages](https://www.w3.org/WAI/WCAG21/Understanding/status-messages)
and [MDN details](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details).

## Pre-change audit

## Scope and environment

Requested: monitoring workflow, escalation, daily checks, security layers,
purchasing examples and self-check, using mouse, touch and keyboard.

Inspected the active Astro sources and the rendered local Home, How We Work and
Cybersecurity pages via the user's working in-app browser tab 3. The earlier tab
1 remains a data-URL connection-error page; it was not accessed or worked around.
Tab 3 already displayed the user-loaded HTTP preview and was accessible normally.
Local dev preview: http://127.0.0.1:4321/. Desktop viewport: 1254 × 884 CSS pixels.
Narrow viewport checks: 375 × 812 and 320 × 740; override reset afterward.
Git is on unborn master, with no HEAD commit and all project files untracked.
Owner of this review: workflow/integration agent. No website implementation changed.

## Requested-flow results

**Overall: Blocked — interaction validation cannot complete while the requested
interactive implementations are absent.** This is not an input-mode pass.
The availability column distinguishes missing interactive scope from ordinary
static text, which remains readable. It does not assert that a paragraph should
itself be keyboard-focusable.

| Requested flow | Interactive availability | Evidence | Mouse | Touch | Keyboard | Remediation owner |
| --- | --- | --- | --- | --- | --- | --- |
| Monitoring workflow | Fail | Workflow.astro is one static scenario. Rendered section has zero stateful controls; no Previous/Next or selectable steps required by AGENTS.md. | Blocked: no step controls | Blocked: no step controls and no touch API | Blocked: no step controls | Design/workflow implementation |
| Escalation | Fail | How We Work has static Assess impact / Bring in the right colleague / Document and revisit articles; main has zero buttons, inputs, summaries or tabs. | Blocked: no scenario control | Blocked: no scenario control and no touch API | Blocked: no scenario control | Design/workflow; owner to define interactive scope beyond the agreed process stepper |
| Daily checks | Fail | Attention.astro has static backup/alert copy and a Backups & failed jobs article. No selectable checks or state changes. | Blocked: no check controls | Blocked: no check controls and no touch API | Blocked: no check controls | Design/workflow; owner to define intended interaction |
| Security layers | Fail | Home displays a text list, not a details/summary accordion. Cybersecurity has three static articles; no five-layer accordion as required by AGENTS.md. | Blocked: no expand/collapse controls | Blocked: no expand/collapse controls and no touch API | Blocked: no expand/collapse controls | Design/workflow |
| Purchasing examples | Fail | Advice.astro contains static Keep/Upgrade/Replace explanations; no device/new-purchase questions, evaluator, results or rule configuration. Clicking UPGRADE. produced no state change; advice section has zero controls. | Blocked: no tool controls | Blocked: no tool controls and no touch API | Blocked: no tool controls | Workflow + engineers (B9 rules) |
| Self-check | Fail | No component, questions, radio groups, evaluator or results UI in src; absent from rendered Home. Specification is marked Proposed, not built. | Blocked: absent | Blocked: absent and no touch API | Blocked: absent | Workflow + engineers (B9 questions/notes) |

The Fail results apply to availability of the requested interactive scope, not to
execution of nonexistent controls. Mouse/touch/keyboard test execution for those
controls is Blocked. Static content's nonexistent loading/error/result states are
Not applicable: there is no stateful implementation to test.

## Existing controls actually exercised

| Check | Result and evidence | Owner |
| --- | --- | --- |
| Home security link, mouse | Pass: clicking Explore cybersecurity navigated to /services/cybersecurity; rendered H1 Cybersecurity and its three articles verified. This is a navigation pass, not a layers-accordion pass. | Integration |
| How We Work link, keyboard | Pass: Enter activated Primary navigation's How we work link; correct H1 and articles rendered. | Integration |
| Scroll animation pause, mouse | Pass: click changed button to Resume scroll animation, aria-pressed=true and data-animated removed; data-layout remained true. | Integration |
| Scroll animation resume, Enter | Pass: Enter restored Pause scroll animation, aria-pressed=false and data-animated. Focus stayed on the button; computed outline was 3px solid #5cc5ff. | Integration |
| Scroll animation pause, Space | Pass: Space paused again. Tab then moved to Managed IT; no trap observed in that transition. | Integration |
| Home link, keyboard | Pass: Enter on ITKeepers home returned from How We Work to Home. | Integration |
| Purchasing text, mouse | Pass for static behavior only: clicking UPGRADE. produced no state change, consistent with its h3 markup. It is not a purchasing tool pass. | Integration |
| Narrow Home reflow | Pass for measured page-width checks only: document scroll width 360 at viewport 375; 305 at viewport 320. At 320, no main element extended outside the viewport in DOM rectangle inspection. No full zoom/text-spacing review claimed. | Integration |
| Animation narrow fallback | Pass: at 375, data-animated absent, pause hidden, four narrative chapters present. | Integration |
| Console observation | Pass for observed sample: no captured warning/error entries returned (limit 8). Not a full network or runtime audit. | Integration |
| True touch gestures/taps | Blocked: connection exposes mouse clicks, keyboard and viewport sizing, but no touch API/device. Narrow viewport plus mouse input is not touch testing. | Manual QA/device owner (B14) |
| Full keyboard flow / screen reader / zoom / reduced-motion rendering | Blocked for missing requested features; extended checks on other site features were outside this bounded review. | Manual QA/design owner (B14) |
| Build/lint/type | Not applicable to this session: documentation/evidence-only changes; application source unchanged. No fresh build pass claimed. | Integration |

## Evidence

Screenshots are local QA artifacts, not public website assets:

- `.codex/qa/2026-09-30/workflow-desktop.jpg`: static monitoring scenario and beginning of daily-check section.
- `.codex/qa/2026-09-30/checks-purchasing-desktop.jpg`: static security/backup cards and purchasing explanations.
- `.codex/qa/2026-09-30/mobile-static-workflow.jpg`: 375px layout around service links and monitoring scenario.

Source evidence: src/components/Workflow.astro, Attention.astro, Advice.astro,
src/pages/how-we-work.astro and src/pages/services/cybersecurity.astro. Source
search found only TeamThread's pause and scroll handlers; no self-check evaluator
or questions. Astro development toolbar controls are excluded from site controls.

## Inputs and next actions

- B9: existing purchasing/self-check specifications remain Proposed, with no recorded engineer-approved rule configuration. Blocks approved tool implementation/release and authoritative result tests; does not block documenting absent UI.
- B14: real touch/device QA and complete modality testing require working flows and appropriate browser/device access. Browser automation on working tab 3 is now available; previous blocked-tab result does not make this session browser-blocked.
- Monitoring and security-layer interactions are specified by AGENTS.md. Build those controls, preserving initial HTML and native semantics; verify all step directions and all five layer toggles.
- Escalation/daily-check interaction designs beyond the process stepper are not specified in the inspected source. Define their expected states before accepting an interactive test result; no invented controls or operations added in this validation task.
- Purchasing and self-check: implement from approved configuration, then test unanswered, invalid, boundary, conflicting and Not sure paths; restart/back navigation, result announcements and unchecked opt-in; verify no storage or network transmission of answers.
- Obtain real touch testing. Check single-tap activation, scroll versus control activation, visible hit areas, repeated toggles, no hover dependency and focus/keyboard equivalence. Do not treat viewport emulation as a substitute.

No implementation fixes, claim changes, commit or deployment occurred. Assumptions:
none about missing feature behavior. Reviewer needed: design/workflow owner and
engineers for B9; manual QA/device owner for B14. Next: complete the missing
interactive scope, then rerun this matrix.
