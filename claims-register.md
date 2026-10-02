# ITKeepers — Claims Register

Updated: 1 October 2026. Owner: Copy; validation/publication owners: responsible business owner and project owner.

## Use and approval

Root `AGENTS.md` defines evidence statuses and publication rules. This register records candidate wording, not approved public copy. “Not recorded” means no approval is documented here; it does not invalidate an approval later located in a current authoritative source. Record its scope, approver and date before reuse.

Keep exact approved wording separate from evidence. Material wording changes, new scope or a changed operating practice trigger review. Do not infer approval from employee reports, source-document inclusion or this register’s creation.

## Candidate claims

The imported C01–C14 candidate entries are held from publication pending applicable validation and wording approval. Their locations are proposals from the archive; current implementation inspection and existing local approvals are recorded in the preserved workspace section below and PROJECT_STATUS.md.

| ID | Exact candidate wording | Proposed locations | Source | Evidence status | Publication approval | Approver / date | Review trigger / next action |
|---|---|---|---|---|---|---|---|
| C01 | Approximately 50 client environments. | Home | `docs/ITKeepers-Website-Project-Brief.md` §2 | Employee-reported | Not recorded; hold | Not recorded | Validate scope/date and approve; review when scale changes |
| C02 | Approximately 1,500 users supported. | Home | Brief §2 | Employee-reported | Not recorded; hold | Not recorded | Validate count/date; never sum unlike measures |
| C03 | Approximately 2,000 endpoints managed. | Home | Brief §2 | Employee-reported | Not recorded; hold | Not recorded | Validate count/date and approve |
| C04 | Approximately 200 servers managed. | Home | Brief §2 | Employee-reported | Not recorded; hold | Not recorded | Validate count/date and approve |
| C05 | Automated monitoring runs continuously; critical alerts can notify engineers after hours. | How We Work | Brief §3 | Employee-reported | Not recorded; hold | Not recorded | B6: confirm coverage, eligibility and qualifications |
| C06 | Backup status is checked every morning. | How We Work / Backup & Recovery | Brief §§3–4 | Employee-reported | Not recorded; hold | Not recorded | B7: confirm cadence/scope; no inference of restore testing |
| C07 | Engineers share documentation of devices, users and infrastructure. | Home / How We Work | Brief §4 | Employee-reported | Not recorded; hold | Not recorded | Validate practice/scope; dummy public examples only |
| C08 | Monthly reports cover patching, backups, security and recommendations. | How We Work / service pages | Brief §4 | Employee-reported | Not recorded; hold | Not recorded | Confirm actual fields and client scope; review sample |
| C09 | We assess equipment before recommending whether to keep, upgrade or replace it. | Tool page / Home | Brief §5 | Employee-reported | Not recorded; hold | Not recorded | Confirm practice; do not imply no resale margin |
| C10 | Four engineers in Lebanon and two in the United States. | Team | Brief §2 | Employee-reported | Not recorded; hold | Not recorded | B2/B5: confirm team, roles and geographic meaning |
| C11 | MFA, endpoint protection, firewalls and backup monitoring are selected for client needs. | Service pages | Brief §4 | Employee-reported | Not recorded; hold | Not recorded | Validate offered scope; no universal deployment claim |
| C12 | Requests are typically picked up within 2–4 minutes. | No release location | Brief §3; employee estimate | Employee-reported | Excluded by current root policy | Not recorded | Requires explicit policy revision and substantiated evidence |
| C13 | 24/7 monitoring. Human response when it matters. | How We Work candidate | Brief §3 | Proposed | Not recorded; hold | Not recorded | B6: approve exact wording and necessary qualifications |
| C14 | This example uses dummy data to illustrate shared context. | Example component | Design proposal | Illustrative | Not recorded | Not recorded | Verify implemented example is dummy and clearly labeled |

## Open or excluded assertions

Restore testing, formal quarterly reviews, hard SLAs, uptime guarantees, certifications, partnerships, client evidence, legal addresses, pricing/savings and purchasing-independence claims have no approval recorded in this package. Track relevant input IDs in `PROJECT_STATUS.md`; do not fabricate entries marked Verified.

## Approval record template

For each approval record: claim ID; exact approved wording; allowed pages/string locations; supporting evidence reference; evidence status; publication decision; responsible approver; approval date; scope/qualifications; review date or trigger; implementation revision. Store private evidence outside public output and reference it safely without exposing client information or secrets.

## Maintained local implementation records (preserved)

The following entries preserve existing local implementation authorization and production-review status. They do not approve the seed operational candidates or tool thresholds.

This register covers new copy introduced by the 30 September 2026 Home animation and interaction-integration tasks. Earlier site claims remain outside this scoped review and are not approved by these entries.

| Claim ID | Exact wording | Affected pages | Source | Evidence status | Publication approval | Approver | Approval date | Review trigger |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ANIM-01 | “A working relationship, illustrated in four parts.” / “Illustrative” / “Familiar engineer → shared context → wider expertise → follow-up.” | Home, TeamThread composition | AGENTS.md central design narrative; hypothetical role/notes diagram, no real identities or client records | Illustrative | Local design implementation authorized; production wording approval pending | Jim authorized local animation task; production copy owner pending | 2026-09-30 (local task only) | Any move from illustration to operational promises, real people/data, or production release |
| INTERACT-01 | “Follow a storage-warning example from the first signal to the next action. No real incident data or measured timings.” / “Not every incident needs escalation.” | Home, How We Work | AGENTS.md five-step process requirement; hypothetical example in Workflow.astro | Illustrative | Local integration authorized; production wording approval pending | Jim requested workflow/integration agent; production copy owner pending | 2026-09-30 (local task only) | Production release, operational promise, real incident data or process change |
| INTERACT-02 | “Explore the questions behind a daily review. These examples explain checks, not the status of a real environment.” / “These examples explain what a review can consider. They contain no client records, real alerts or promised schedule.” | Home, How We Work | Generic review questions in DailyChecks.astro, based on brief categories without asserting current operations | Illustrative | Local integration authorized; production wording approval pending | Production copy owner pending | 2026-09-30 (local task only) | Production release, schedule/restore claim or real records introduced |
| INTERACT-03 | “These are examples of control categories. Suitable controls depend on the environment, licensing and agreed scope; no single layer prevents every incident.” | Home, Cybersecurity | AGENTS.md layer plan; generic definitions in SecurityLayers.astro, not a statement that every control is deployed | Proposed | Local integration authorized; production wording approval pending | Production copy owner pending | 2026-09-30 (local task only) | Production release, universal controls/compliance claim or scope change |

The full illustrative chapter wording lives in `src/components/TeamThread.astro`; review it with this entry before release. No figures, timing, guarantees or customer outcomes are introduced.

Review complete new process/review/layer wording in Workflow.astro,
DailyChecks.astro and SecurityLayers.astro plus the How We Work example explanation
before production publication. Local implementation is separate from approval of
actual operational claims and does not approve tool rules or preexisting copy.

## 1 October 2026 — Local homepage redesign

The project owner authorized a working local redesign and then a closer visual rhythm reference. These entries record the exact integrated candidates; no factual claim is promoted to Verified and no production wording approval is granted.

| Claim ID | Exact wording | Affected pages | Source | Evidence status | Publication approval | Approver | Approval date | Review trigger |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| HOME-01 | “Familiar engineers who know your business. Shared expertise, proactive monitoring, documented context and follow-up.” | Home hero | Root positioning; current owner request; employee reports in brief §§3–4, related C05/C07 | Employee-reported | Local preview implementation authorized; production wording approval pending | Jim authorized local homepage task; responsible business owner pending for publication | 2026-10-01 (local task only) | Production release, monitoring/coverage or documentation scope changes |
| HOME-02 | “This example brings environment notes, open questions and follow-up into one shared thread.” / “Illustrative index. Not a client record or portal.” | Home shared-context example | Implemented dummy index in Knowledge.astro; current local redesign request | Illustrative | Local preview implementation authorized; production wording approval pending | Jim authorized local homepage task; production copy owner pending | 2026-10-01 (local task only) | Real records introduced, reporting/portal implication or production release |
| HOME-03 | “Day-to-day IT management with familiar engineers, proactive attention and a team behind the work.” | Home Managed IT service scene | Exact reused local Managed IT page introduction; brief employee-reported service/relationship descriptions | Employee-reported | Local preview reuse authorized; production wording approval pending | Jim authorized local homepage task; responsible business owner pending for publication | 2026-10-01 (local task only) | Service scope or commitment changes, or production release |

Service introductions remain existing local candidates. Reusing them in alternating homepage scenes does not independently validate service scope or grant publication approval; review exact integrated wording and qualifications against docs/HOMEPAGE_COPY_REVIEW.md before release.

## 2 October 2026 — Astra Phase 2 local integration authorization

This is the master integration brief's Phase 2 (seven homepage offering animations), not a claim that the shared release plan's Phase 2 service pages are complete. Jim's instruction, “start with phase 2”, authorizes local implementation of the previously reported integration map. It does not approve factual prototype assertions or production publication. The two updated Managed IT and Web prototypes supersede their earlier copies for this integration only.

| Claim ID | Exact wording / authorization | Affected pages | Source | Evidence status | Publication approval | Approver | Approval date | Review trigger |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ASTRA-P2-SCOPE | “start with phase 2” | Home: Managed IT, Microsoft 365 & Cloud, Cybersecurity, Networking & Infrastructure, Backup & Disaster Recovery, AI & Automation, and adjacent Web Design & Hosting animation candidates | Jim's current direct instruction; Phase 1 integration map; supplied master integration brief | Proposed (implementation scope; not a service claim) | Local integration authorized; production wording approval pending | Jim, local implementation only | 2026-10-02 | Production release, factual capability wording, or integration scope change |

Source review by Copy: supplied prototype headings, descriptions, accessible narration, visible panels and script-generated status strings were reviewed for this integration. The five existing service families remain employee-reported as recorded above and in the project brief. Requested AI & Automation and Web Design & Hosting architecture does not establish their commercial scope, delivery model, governance controls or outcomes. No entry has been promoted to Verified.

Production holds apply to exact affected claims, not local component work: B6 coverage/response commitments; B7 routine restore testing and recovery assurances; B8 network scope; B14 final publication/review authorization. AI and Web capability evidence and exact wording approval are additionally required before asserting those offerings as delivered services. Hypothetical diagrams must use a visible Illustrative label, dummy situations and narration that describes examples; the label cannot validate an operational claim. No real domains, live-status labels, compliance assurances or invented performance metrics should be carried over from prototypes.

### Integrated example captions and introductions

Exact local candidates below were read from the new components and `Services.astro` on 2026-10-02. Every animation uses the visible “Illustrative” badge. The entire panel, dynamic statuses, mobile variant and fallback remain part of the production wording review; the captions do not approve assertions elsewhere in a component.

| Claim ID | Exact wording | Affected pages / component | Source | Evidence status | Publication approval | Approver | Approval date | Review trigger |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ASTRA-P2-01 | “Follow a hypothetical storage warning from detection through investigation and follow-up.” / “A hypothetical storage warning moves from monitoring to detection, ownership and resolution.” | Home / ManagedITAnimation.astro | Owner-supplied Managed IT prototype adapted as a dummy scenario | Illustrative | Local implementation authorized; production wording pending | Jim, local task only | 2026-10-02 (local only) | Current-operations implication, coverage promise, actual incident data or publication |
| ASTRA-P2-02 | “Explore an example of joining and leaving a Microsoft environment.” / “An illustrative identity connects people, devices and cloud services, followed by an offboarding checklist.” | Home / MicrosoftCloudAnimation.astro | Owner-supplied Cloud prototype; hypothetical identity scenario | Illustrative | Local implementation authorized; production wording pending | Jim, local task only | 2026-10-02 (local only) | Licensing/scope, compliance implication or publication |
| ASTRA-P2-03 | “See an example of layered checks and human review.” / “A hypothetical suspicious sign-in passes through control checks and an engineer review. No single layer prevents every incident.” | Home / CybersecurityAnimation.astro | Owner-supplied Security prototype adapted as a dummy scenario | Illustrative | Local implementation authorized; production wording pending | Jim, local task only | 2026-10-02 (local only) | Security/coverage guarantee, current-operations implication or publication |
| ASTRA-P2-04 | “Explore how a hypothetical network connects people, devices and systems.” / “An illustrative network connects its systems, then traces a Wi-Fi link issue through detection and recovery.” | Home / NetworkingInfrastructureAnimation.astro | Owner-supplied Networking prototype; dummy topology | Illustrative | Local implementation authorized; production wording pending | Jim, local task only | 2026-10-02 (local only) | B8 scope, universal implementation/repair promise or publication |
| ASTRA-P2-05 | “Follow an example from a backup copy to a restore check.” / “A successful backup job does not by itself prove a tested restore.” / “A hypothetical recovery sequence distinguishes a completed backup from a restore check. It does not represent current restore-testing coverage or a recovery guarantee.” | Home / BackupRecoveryAnimation.astro | Owner-supplied Backup prototype corrected to avoid asserting current restore verification | Illustrative | Local implementation authorized; production wording pending | Jim, local task only | 2026-10-02 (local only) | B7 restore-testing scope, recovery guarantee or publication |
| ASTRA-P2-06 | “Explore a sample request workflow with a person reviewing the draft.” / “A hypothetical request compares manual steps with an assisted workflow, keeping a human approval step before action.” | Home / AIAutomationAnimation.astro | Owner-requested AI architecture and hypothetical supplied workflow; no measured benefit | Illustrative | Local implementation authorized; production wording pending | Jim, local task only | 2026-10-02 (local only) | Delivered AI capabilities, data controls, measured productivity or publication |
| ASTRA-P2-07 | “Follow an example website from wireframe through launch and maintenance.” / “An illustrative website moves from a wireframe through responsive layouts, publication and maintenance planning. This is not a live website status.” | Home / WebDesignHostingAnimation.astro | Owner-requested adjacent Digital Services architecture; hypothetical supplied website example | Illustrative | Local implementation authorized; production wording pending | Jim, local task only | 2026-10-02 (local only) | Delivered Web/hosting capability, uptime/performance/security promise or publication |
| ASTRA-P2-08 | “Use AI. Without the new risk.” / “This is the aim of a considered approach to AI, not a promise of risk-free use. Define permitted uses, decide who can access information and keep human review where it matters.” | Home / Services.astro, AI governance subsection | Exact requested master-brief headline, paired with a local qualification and general planning guidance | Proposed | Local candidate authorized; production wording pending | Jim, local scope only; responsible owner for publication pending | 2026-10-02 (local only) | Headline reused without its adjacent qualification, actual governance assurance or publication |

Copy validation: Pass — scoped source review of seven supplied prototypes, the integrated captions and homepage introductions; exact candidate wording recorded above. Owner: Copy. Production claim approval: Blocked for the affected claims until responsible business-owner validation and wording approval. Browser behavior, generated-output verification, responsive rendering and runtime states: not performed by Copy; assigned to parent integration/Design for the final candidate. No build, Git operation, commit or deployment performed by Copy. Next: parent applies the communicated visible/script status corrections and validates final output; publication review remains separate from this local implementation.
