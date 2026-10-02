# Homepage copy review — 1 October 2026

Owner: Agent 04, Copywriting and Messaging. Scope: the authorized local homepage redesign. This review does not approve production publication or change service commitments.

Read: root AGENTS.md, PROJECT_STATUS.md, claims-register.md, the project brief, site map, Agent 04 instructions, both proposed tool specifications, Home, Base and all homepage components. No required source was missing. Current Git baseline is unborn master; no inspected commit exists.

## Copy for the redesign

| Location | Copy / implementation direction | Evidence and approval scope |
|---|---|---|
| Hero H1 | **Your IT person is a team.** | Required exact positioning in root policy and the current user request. Keep the final period and a stable headline. A line break must not change the accessible text. |
| Hero supporting copy | **Familiar engineers who know your business. Shared expertise, proactive monitoring, documented context and follow-up.** | Proposed concise local candidate incorporating the user's requested topics. Familiar people/shared expertise/follow-up are central positioning; monitoring/documentation remain employee-reported practices (C05/C07). Local design authorization is separate from production wording approval. No human coverage, response time or uninterrupted availability is implied. |
| Hero contact link | **Talk to our team** → existing `/contact` | Established general CTA vocabulary and current destination. Do not promise a booked meeting or an engineer's response time. |
| Header contact link | **Let's talk** → existing `/contact` | Established navigation CTA vocabulary. Typographic apostrophe is optional; use consistently. |
| Three tenets, if introduced as the first content section | **You know us. Familiar people.** / **We know your IT. Shared context.** / **We stay involved. Follow-up.** | Root positioning, reused without new numerical or service commitments. Supporting prose should use existing context rather than add absolute availability or continuity promises. |
| Services | **Managed IT** / **Microsoft & Cloud** / **Cybersecurity** / **Networks** / **Backup & Recovery** | Retain existing local service names and `/services/*` routes. Service scope/geography remains subject to existing production inputs; redesign does not release a deferred page. |
| Context thread | Existing four-part story, chapter wording and **Illustrative** badge | ANIM-01 local-only approval; hypothetical roles and dummy notes. Do not turn the example into real telemetry or real personnel. |
| Monitoring / escalation | Existing five manual steps and storage-warning explanation | INTERACT-01 local-only approval. Keep conditional colleague involvement and **Not every incident needs escalation.** No automatic progression or timing claims. |
| Daily checks | Existing generic review questions and qualification | INTERACT-02 local-only approval. Keep the example independent of an asserted schedule, real system status or tested restoration. |
| Security layers | Existing category definitions and scope qualification | INTERACT-03 local-only approval. Do not imply every category is deployed to every client or proves compliance. |
| Purchasing examples | Keep / Upgrade / Replace static explanations; use **a rule of thumb, not a diagnosis** near the examples | Illustrative categories in the brief, not a launched evaluation product. B9 still blocks evaluator thresholds and self-check behavior. Preserve examples without pricing, margins or savings promises. |
| Shared-context section | Replace the current reporting sentence with **This example brings environment notes, open questions and follow-up into one shared thread.** | Proposed description of the dummy example itself. Avoid C08's held monthly-reporting practice. Keep **Illustrative index. Not a client record or portal.** near the example. |
| Closing CTA | Existing **What would you like your IT team to handle?** / **Tell us what keeps coming back—or what you are planning next.** / **Talk to our team** | Reuse the invitation. No invented response commitment or inquiry-delivery claim. |

The suggested hero lead is an internal candidate until integrated. It is suitable for the requested local preview; it must not be marked Verified or production-approved in the register. An Illustrative badge qualifies a genuine hypothetical example, not actual monitoring or documentation claims.

## Alternating service scenes — follow-up local redesign

The owner requested a closer lighting/rhythm reference, five alternating service scenes and a less dominant context-thread composition. Reuse these exact existing service-page introductions with their established routes; their existing presence is not new production evidence or approval.

| Scene | Existing introduction | Existing destination |
|---|---|---|
| Managed IT | Day-to-day IT management with familiar engineers, proactive attention and a team behind the work. | /services/managed-it |
| Microsoft & Cloud | Manage users, access, devices and Microsoft cloud services with the surrounding business context in view. | /services/microsoft-cloud |
| Cybersecurity | Security maintained in layers across identity, endpoints, networks, operations and recovery. | /services/cybersecurity |
| Networks & Infrastructure | Keep the systems underneath everyday work understandable, maintainable and connected. | /services/networks-infrastructure |
| Backup & Recovery | Know what is being checked today—and what recovery would actually require. | /services/backup-recovery |

For the backup scene, retain the existing limitation: **A successful backup job does not by itself prove a tested restore.** Do not add the held “Morning checks” or monthly-reporting detail as proof. Generic explanatory illustrations must not resemble live service status or claim universal deployed controls. Preserve B9 tool approval and B13 inquiry collection holds.

### Integrated source review

Pass, scoped to source wording: the integrated hero uses the exact requested headline and suggested concise support; the tenets retain the root positioning; CTA routes remain `/contact`; decorative CTA arrows are hidden from assistive technology. Advice retains the nearby “A rule of thumb, not a diagnosis” qualification. Knowledge uses the dummy-example description without implying monthly reporting.

The latest Services candidate list reuses all five existing introductions verbatim. Its first rendered Managed IT scene describes a generic shared thread with an Illustrative badge, not a real client, service status or measured outcome. At this review snapshot the other four services are ordinary links; no nonexistent full-scene interaction or backup-scene qualification is marked passed. Final rendered composition is owned by Design/Workflow. Copy review does not expand production claim approval.

## Findings to address

1. Existing copy is not automatically approved because it appears in Astro. C05 monitoring, C06 daily backup checks, C07 documentation, C08 monthly reporting and C09 purchasing practice remain held from production in the register. Preserve the evidence distinction when shortening text.
2. Home's existing metadata mentions proactive monitoring. SEO should apply the same local-only/production review distinction to metadata and JSON-LD. Base's existing LocalBusiness/ITStore and Lebanon-only areaServed exceed verified legal/geographic details; SEO owns the scoped schema correction.
3. Header currently says “Our team” while the existing `/about` destination has no approved team identities/photos. A general approach link is acceptable only with an accurate destination label; avoid suggesting a released photographic Team page.
4. Keep one primary contact invitation per section. A separate workflow Next/Previous button is a functional control, not a competing contact action. Decorative arrows must not reduce understandable accessible labels.
5. Preserve essential qualifications beside the affected examples on mobile, including when details are collapsed. Do not hide caveats in hover states, animation or remote pages.
6. No numerical proof, testimonials, partner marks, client logos, named engineers, pricing, guarantees, “LIVE” indicators, or staffed 24/7 claims are approved by this task.

## Validation and handoff

- **Done:** read the authoritative sources and current homepage, supplied concise reusable strings, mapped held operational claims and example qualifications, and coordinated recommendations with Workflow.
- **Decisions made:** keep existing routes/content system; exact hero and CTA vocabulary; distinguish local preview authorization from production claim approval; retain the static purchasing scope while B9 is open.
- **Assumptions — Proposed:** the suggested condensed hero lead and dummy-index description fit the redesign. Their actual rendered length must be reviewed after integration.
- **Validation — Pass:** source review and CTA destination consistency against current code; no missing source; no invented figures, operational cadence, or approvals in the proposed copy. Owner: Copy.
- **Validation — Blocked:** final rendered desktop/mobile editorial review until the redesigned components are integrated; production factual wording approval remains with the business owner. Owner: Copy/business owner.
- **Validation — Not applicable:** build/form/backend tests for this documentation-only ownership; implementation/build checks belong to Workflow.
- **Blocked on:** B6 actual monitoring/after-hours scope; B7 relevant backup/restore/reporting practices; B9 evaluator rules; B3/B13 verified inquiry handling before collection; B5 real team presentation. These do not block the authorized local design preview.
- **Needs review from:** Design for composition/length, SEO for metadata/schema, Workflow for final integration, responsible business owner before production publication.
- **Files changed:** docs/HOMEPAGE_COPY_REVIEW.md. No commit created.
- **Deployment:** not deployed; no deployment action authorized for this subtask.
- **Next:** check integrated copy and qualifications in the working desktop/mobile preview, then record any final new wording in the root register with its exact local-only scope.
