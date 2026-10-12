# V2 homepage records and hardware refinement

13 October 2026. Local review candidate on `codex/v2-prompt3-restored`, based on `fc3ccf4f4f35ae39195f5a0ad5db9365e3250a39`. Owner: Codex; visual approval: Jim. No commit, merge, push or deployment performed. Hosting remains the existing Cloudflare assets-only Worker (`wrangler.toml`, `./dist`).

## Done and decisions

The homepage retains the operational workflow, monitoring copy, security link and all unrelated components. One compact `RecordsAdvice.astro` section follows How We Operate and precedes the conditional client proof / existing closing CTA. It uses the supplied eyebrow, heading, two paragraphs, static labels and footnote exactly. Cards retain navy surfaces in both day and night modes, consistent with the approved lower homepage canvas. Existing typography, color, spacing and radius tokens are reused. No dependency, animation controller, theme behavior or deployment configuration changed.

The original documentation and hardware articles were extracted into `ServiceRecordsAdvice.astro`, preserving their content and importing the original animation components. They appear **after the seventh service overview, Web Design & Hosting, and before the footer**:

- `/services/#operate-documentation-title`: original Documentation copy and Environment → Client IT Record → Engineer handoff diagram.
- `/services/#operate-decisions-title`: original Keep / Upgrade / Replace copy, sample CPU/RAM/Storage/age/warranty/security assessment and three outcome cards.
- Parent section: `/services/#service-records-advice`.

Article headings become H2s to fit the service page hierarchy. Navy/cyan styles replace pale/grey/yellow surfaces and keep the original captured/read/selected states, transitions and animation hooks. The Technology Planning navigation item now points to the relocated hardware heading. Obsolete homepage story selectors and variables are removed; animation styles remain inside the original components.

The new section has 96px padding at desktop widths and 56px below 768px. Its eyebrow sits exactly 96px below the existing operational footnote at 768/1440, and 56px below at 360. Its bottom padding leads into the existing CTA, which keeps its own approved padding and border. Container edges match How We Operate. The existing operational example retains its own disclaimer.

## Validation

Evidence directory: `../v2-records-evidence/` relative to this worktree. Browser: existing bundled Playwright with headless Microsoft Edge; no package installation. The original baseline passed 110 tests.

| Check | Result | Evidence |
| --- | --- | --- |
| Astro production build | Pass: 16 pages | `build.log` |
| Complete regression suite | Pass: 114/114 (final combined worktree; 111/111 before concurrent inquiry changes) | `tests-final.log` |
| Desktop/mobile and both themes | Pass: 360, 768 and 1440px, both routes | `visual-results.json`, 12 PNGs |
| 360px | Pass: one column, no clipped text or horizontal overflow | `home-day-360.png`, `home-night-360.png` |
| 768px | Pass: two columns, both cards 250.77px high | `home-day-768.png`, `home-night-768.png` |
| 1440px | Pass: two columns, both cards 199.58px high | `home-day-1440.png`, `home-night-1440.png` |
| Typography | Pass: headings 20px/600; paragraphs 16px/25.6px/#B8C4D6; labels 14px; eyebrow 13px | `visual-results.json` |
| Text contrast | Pass: minimum 10.34:1 on new homepage section, 9.95:1 across relocated service content; exceeds AA text thresholds | `visual-results.json` |
| Keyboard | Pass: existing link above cards and final service link remain focusable, visible focus on next target; static labels/examples add no tab stops or trap | `visual-results.json` |
| Animation preservation | Pass: original markup before styles identical to HEAD; controllers unchanged; both timelines complete and replay after full scroll exit on Services | `preservation.json`, `supplemental-results.json` |
| Reduced motion and no JavaScript | Pass: both animations settled under reduced motion; all five record categories and three outcomes readable without JS | `visual-results.json` |
| Forced colors | Pass: card shadows removed, system colors used | `visual-results.json` |
| Additional reflow | Pass: both routes at 320, 375 and 1024px; changed content at 200% text size plus line/letter/word spacing at 360px | `supplemental-results.json` |
| Runtime browser errors | Pass: none | `visual-results.json` |
| Dependencies and unrelated animation logic | Pass: no diff | `preservation.json` |
| Diff whitespace | Pass | `git diff --check` |

Screenshots were inspected for the new section at 360/768/1440 and the relocated content at 360/1440. The existing Playbook can overlay lower homepage content; final screenshots use its existing Dismiss button. Its implementation remains unchanged. A global paragraph rule initially overrode the eyebrow; this was fixed before final screenshots and checks. The services paragraph spacing was also corrected after visual review.

Vercel's [UI review skill](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md) and [current rules](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) were retrieved on 13 October 2026. Review scope: changed Astro components, scoped styles, semantic heading order, static labels, overflow, anchors, keyboard focus, reduced motion and theme contrast. No unresolved finding in the changed scope. Approved sentence-case copy and existing animations take precedence over editorial/performance preferences in those rules.

## Files changed by this task

- `src/components/RecordsAdvice.astro` — compact homepage section.
- `src/components/ServiceRecordsAdvice.astro` — extracted original documentation/hardware articles and scoped service layout.
- `src/components/HowWeOperate.astro` — remove relocated articles/imports and unused styles; preserve workflow.
- `src/components/animations/KnowledgeContinuityAnimation.astro` — navy/cyan colors only.
- `src/components/animations/HardwareAssessmentAnimation.astro` — navy/cyan colors only.
- `src/pages/index.astro` — place new section.
- `src/pages/services/index.astro` — place extracted articles after service summaries.
- `src/data/navigation.ts` — repair Technology Planning anchor destination.
- `src/styles/home-continuity.css` — remove unused homepage story selectors/variables; set spacing into new section.
- `public/supporting-copy.css` — remove unused homepage story selector.
- `tests/home-consolidation.test.mjs` — update expected content placement and check preservation/no duplication.
- `tests/home-motion.test.mjs` — update homepage static-content expectation.
- `docs/V2_RECORDS_HARDWARE_REFINEMENT.md` and `PROJECT_STATUS.md` — report and status.

Concurrent edits to `BusinessValue.astro` and an existing `PROJECT_STATUS.md` entry appeared after initial clean V2 inspection. Later, `InquiryForm.astro`, `src/data/inquiry.ts`, `src/scripts/contact-form.ts`, `src/styles/inquiry-form.css` and `tests/free-it-review.test.mjs` also changed in another session; the combined final worktree was rebuilt and all 114 tests passed. They were preserved and are excluded from this task's implementation inventory. No factual assumptions or new purchasing claims were added beyond the owner's supplied wording.

## Issues, limitations and next step

No unresolved changed-scope functional or visual issue. Native screen-reader speech, physical-device/Safari checks and actual browser 400% zoom were not performed; they are not reported as passed. Small-viewport reflow and 200% text resize were tested separately. The existing contact endpoint/real-delivery limitations remain outside this task.

An early screenshot path encoded the workspace space as `%20`, creating eight temporary PNGs under `C:/Users/Jim/Documents/ChatGPT/ITKeepers%20Website/outputs/v2-records-evidence`. Correct final evidence lives under the normal workspace path. Automatic approval review rejected optional recursive cleanup as a policy-blocked deletion; those temporary files remain. No source operation was rejected.

Needs review from Jim. Review [homepage](http://127.0.0.1:4370/#records-advice) and [relocated Services content](http://127.0.0.1:4370/services/#service-records-advice). Local preview is running. Stop here; no merge, push or deploy.
