# Home redesign validation — 1 October 2026

## Scope and baseline

Authorized work: redesign the local ITKeepers Home page with EMPIST as a layout/
composition reference, coordinated through the parent integrator and all five
roles. Preserve the official logo/colors and central team positioning. Extend
the established Astro project; do not clone a reference site's copy, claims or
assets. No production release or changes to approved tool rules are inferred.

Candidate has no commit: master is unborn, HEAD absent, remote list empty. A
review baseline of 38 source/public/test/config/reference files and SHA-256
manifest is saved at `.codex/backups/homepage-before-20261001/`. It is a local
source restore aid; actual Cloudflare rollback remains unverified B11.

Configured delivery: `wrangler.toml` Worker static assets from dist; actual remote
deployment type/project/revision is not verified. Astro 5.14.0, npm lockfile,
Node 22.x target; shell observed Node 24.21.0/npm 11.19.0. Runtime mismatch is
recorded; no runtime or dependency change performed. Local preview starts with
`npm run dev -- --host 127.0.0.1 --port 4321`. Initial agent session 33865
ended; parent restarted it in session 74795 for active design QA. Parent owns
the foreground built-site Wrangler preview at http://127.0.0.1:8788/ once ready.

Workflow ownership: this report, root PROJECT_STATUS.md, baseline backup and
build/preview process only. Parent integrator owns app/config integration; design
and copy own their explicitly assigned files; SEO/security review final output.

## Validation matrix

| Check | Result | Evidence / next action | Owner |
| --- | --- | --- | --- |
| Baseline preserved | Pass | 38 files copied with baseline.json SHA-256 manifest before design edits | Workflow |
| Git/stack/deployment configuration inspection | Pass for local evidence | Unborn master/no HEAD, no remote; existing scripts/Astro config/Worker assets read. Actual remote deployment remains unverified | Workflow |
| Dev preview availability | Pass | Initial port refused; established dev command started, HTTP GET / returned 200 with hero/data-workflow. URL http://127.0.0.1:4321/ | Workflow |
| Final build and workflow regression tests | Pass | npm run build: ten routes; node --test tests/workflow.test.mjs: four pass after disclosure-count assertions scoped to their component wrappers (new Menu adds a separate details element) | Workflow |
| Dedicated lint/type scripts | Not applicable | None configured in the existing package.json; no fabricated pass | Workflow |
| Final rendered initial HTML/metadata/schema structure | Pass (scoped) | All ten pages have one H1 and parseable Organization JSON-LD; Home also WebSite, central narrative and three tenets present in initial HTML. SEO owner performs detailed metadata review separately | Workflow / SEO |
| Generated public placeholders | Pass (scoped) | No pending-input markers in 18 generated HTML/JS/CSS/JSON/TXT/SVG/XML text files; private drafts excluded. Not a full secret/exposure scan | Workflow |
| Public exposure/security review | Blocked | Security owner review and actual built-response header checks pending local preview | Security / parent |
| Generated internal URLs/fragments/IDs | Pass | No missing root-relative href/src or fragments; no duplicate IDs across ten built pages | Workflow |
| Responsive/contrast/keyboard/mouse and retained interactions | Blocked | Parent final browser review in progress; inspect 320, 375, 768, 1024, 1440, visible focus, menu/service controls, workflow, details and thread pause/fallback | Design / parent QA |
| Reduced motion/forced colors/text spacing/400% zoom | Blocked | Await final candidate and supported browser/device checks; record unavailable capabilities | Design / manual QA B14 |
| True touch and screen reader | Blocked | Previous connection lacked touch API/real-device and screen-reader evidence; no substitute pass from narrow mouse viewport | Manual QA B14 |
| Production publication/headers/rollback | Blocked | Outside authorized local change; deployed commit and release authorization still unverified | Owner / Workflow B11/B14 |
| New form/delivery tests | Not applicable | No inquiry processor or enabled collection change assigned to this local design | Security |

## Final review plan

1. Wait for parent to declare integrated design stable; do not race source edits
   with a final build.
2. Run existing build and meaningful workflow tests. If assertions no longer fit
   approved UI, report the mismatch to parent rather than changing tests to
   conceal missing behavior.
3. Inspect changed output for publication placeholders, broken internal URLs,
   one H1, initial-HTML central narrative, schema/claims alignment, script budget
   and same-origin external modules under the existing CSP policy.
4. Parent/design exercise mouse and native keyboard controls on final Home and
   affected shared routes. Inspect all five required viewport sizes; keep real
   touch separate from mouse at mobile dimensions.
5. Copy/SEO/security reviews reconcile final copy, assets, metadata and exposure.
   Record each result as Pass, Fail, Blocked or Not applicable with evidence.
6. Append exact final files/changes/limitations and local URL to PROJECT_STATUS.
   Stop short of release; no full-phase completion inferred from a local build.

## Existing scoped inputs

B9 holds purchasing/self-check evaluators and authoritative result tests; the
proposed HDD age-six threshold versus five-to-seven answer bucket and battery
age-five rule versus six-year starter test remain unresolved. B3/B13 hold active
inquiry collection. B4/B5 hold figures/people; B6/B7 hold coverage/restore/review
claims. B11/B14 hold remote release verification and outstanding real-device/
accessibility/release review. Continue local layout work without inventing these
facts or silently removing agreed eventual Phase 1 tools.

## Integrated build evidence

`npm run build` passed for all ten existing routes; retained workflow tests
passed all four cases after the component-specific disclosure-count correction.
The prior whole-page count failed because the new mobile menu adds its own
native details; the assertions still require three daily checks and five layers
in the correct component wrappers. No application code was changed for this fix.

Home has three external same-origin executable modules: TeamThread 1,439 bytes,
Workflow 1,066 bytes and Base/mobile-menu 164 bytes (2,669 bytes total before
compression). Zero inline executable scripts; JSON-LD remains an inert data
script. Current script-src 'self' permits the modules; actual CSP behavior awaits
the Security/browser preview checks. A VM check of the emitted Base module
verified Escape closes an open menu and focuses summary, and Enter leaves it
unchanged. This is a module logic check, not manual keyboard/browser evidence.

Output evidence: `.codex/qa/2026-10-01/build-checks.json` records ten routes,
H1/schema checks, no missing local target/fragment or duplicate IDs, scoped
placeholder scan, module sizes and mobile Escape logic. Root AGENTS.md and
.codex/config.toml match the installed package. Package manifest/lockfile,
Astro/Worker configuration and runtime requirement match the pre-redesign
snapshot. The owner-updated Design role document is preserved.

Automatic approval review rejected the proposed hidden Start-Process detached
Wrangler launch, with stated reason only “blocked by policy.” No background
process was created and no alternate detached launch attempted. Parent will use
a supported ordinary foreground exec preview for QA and retain that root session.
Parent started ordinary foreground Wrangler in session 41535. Local static
URL http://127.0.0.1:8788/ is live; Workflow confirmed all ten built routes return
200 text/html and a unique unknown URL returns 404. Evidence is
`.codex/qa/2026-10-01/static-route-checks.json`. Security owns response-header and
exposure review; parent owns browser evidence. This is local runtime evidence,
not production smoke verification.

No manual/browser redesigned-page pass, commit or deployment is claimed by these
build checks. Prior interaction report remains historical evidence in
`docs/INTERACTION_VALIDATION.md`, not a redesigned-page pass.
