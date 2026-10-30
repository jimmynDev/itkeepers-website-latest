# V2 sitewide content audit and cleanup

29 October 2026, Asia/Beirut. Local changes for Jim's review. No commit, push, merge or deployment.

## Scope and baseline

Worked in `outputs/v2-business-locations`, the latest V2 checkout on `codex/v2-parkland-mena-usa`, HEAD `b35279b5ba4ee0baa20c8004d0260489b956b6b3`. Preserved the uncommitted 28 October Parkland/MENA/USA updates and all other starting work. The separate V4 checkout was not edited. Hosting remains the existing Cloudflare Worker plus static assets.

Reviewed all 20 public HTML routes, their rendered content, shared navigation/footer, service illustrations, disclosure panels, homepage consultation form, Contact form and consultation intent. No standalone Team route exists: About provides team context, and the existing Our Team navigation points there.

Local preview: [Home](http://127.0.0.1:4513/), [Services](http://127.0.0.1:4513/services/), [Contact](http://127.0.0.1:4513/contact/), [consultation](http://127.0.0.1:4513/contact/?type=review).

## Page decisions

| Page | Removed or shortened | Retained |
|---|---|---|
| Home `/` | Generic Managed IT/cloud/network descriptions; second AI sales paragraph; hardware-advice aside; vague team link label; unsupported assumption and “NEW” label in the playbook promotion; competition preamble in the form notice. | Exact hero, status panel, approved metrics and geography; service illustrations/lines; spotlight; service links; Pulse development labels; testimonials; form controls and fallback contacts. |
| Services `/services/` | Comparison instructions and forced How We Work link; generic Managed IT and AI descriptions. | Seven named service scopes and their individual page links; documentation/ownership terms and illustrative hardware advice. |
| Managed IT `/services/managed-it/` | Generic lead and Lebanon/MSP comparison paragraph with two links; repeated animation preamble; verbose monitoring, service-desk, maintenance and reporting notes. | Assessment, assignment, escalation, restoration and follow-up; all five navigation anchors; reporting contents; coverage boundary; backup link; illustrative workflow and Pulse. |
| Microsoft `/services/microsoft-cloud/` | Generic administration sentence and repeated animation introduction; shortened cross-service explanation. | Microsoft 365, Entra ID, MFA, Conditional Access, Intune, licensing limits, onboarding/offboarding, and relevant security/recovery links. |
| Cybersecurity `/services/cybersecurity/` | Generic lead and repeated animation introduction; shortened recovery/incident paragraph. | Identity/endpoint/network scope, security layers, checks, fictional phishing exercise, recovery link, emergency contact link and availability/response caveat. |
| Backup `/services/backup-recovery/` | Forced cross-service paragraph repeating the restore boundary; duplicate job/status-review descriptions; animation preamble. | Distinct job monitoring, routine restore tests and recovery planning; agreed test scope, retention and recovery objectives; no implication that a successful job proves a tested restore. |
| Networks `/services/networks-infrastructure/` | Generic context paragraph with two links; animation preamble; vague server-maintenance wording. | Routing, switching, Wi-Fi, firewalls, connectivity, servers/endpoints, resilience and site/agreement limits. |
| AI `/services/ai-automation/` | “Explore a sample” introduction, verbose governance preambles and generic closing instructions. | Repeatable task, inputs/output, human review, access controls, scope and risk caveat; illustrative workflow and Playbook link. |
| Web `/services/web-design-hosting/` | “Follow an example” introduction, generic planning prose, unrelated service-directory link and repeated closing instructions. | Audience/content/navigation, wireframe-to-launch design, hosting, security, updates, maintenance and agreed scope. |
| About `/about/` | Repeated handoff explanation, generic section openers, “long-term relationship” preamble, repeated concluding promise and service-directory prompt. | Approved offices, addresses, phones and MENA/USA coverage verbatim; internal escalation, monitoring versus human coverage, documentation, training, planning, team illustration and Contact CTA. |
| How We Work `/how-we-work/` | Generic “not a tool list” lead; final section repeating the workflow disclaimer and navigation. | Specific lead, coverage boundary, step-through, daily questions; fictional-data/no-response-guarantee/every-step caveats consolidated beside the workflow. |
| Contact `/contact/` | “Go to the contact form” and its unused styling; competition preamble in the form notice. | Existing form anchor, headings, labels, required/optional fields, intent selector, emergency/email/phone/office information, validation and submission states. Office phones retain their approved placement; repeated footer contacts remain useful global navigation. |
| Pulse `/it-keepers-pulse/` | Repeated team positioning, generic portal/visibility promises, seven feature slogans, verbose planned-feature descriptions and repeated closing prompts. | All seven planned feature areas, specific Microsoft/security/device/licensing/report/support details, development/sample-data labels, health-score limits, integration/service boundaries, workflow and contact links. |
| AI Governance `/resources/ai-governance/` | Wordy lead, audience preamble and self-explanatory PDF instructions. | Seven substantive topics, intended audience, original document title, internal-draft/review/legal-advice limitations, PDF open/download controls and descriptive new-tab label. |
| Privacy `/privacy/` | No edits. | Entire notice, preview status, actual Formspree processing, temporary inbox, acceptance-versus-delivery distinction, retention/transfers, provider links and privacy-request route. |
| Emergency `/emergency/` | No edits. | Incident contacts, concrete do/don't guidance, situation-specific warning and prevention link. |
| Blog `/blog/` | No edits. | Archive purpose, original publication dates, three article links and current-guidance link. |
| Three retained articles | Reviewed `/2023/09/the-future-of-artificial-intelligence-ai/`, `/2023/09/understanding-datafication/`, `/2023/10/how-do-ai-and-ml-differ/`; no edits. | Original article bodies, dates, archive/provenance warning and relevant current-guidance links. These are explicitly retained historical documents, not current service marketing. Rewriting them would change the represented historical record. |

Seven service-page closing paragraphs saying “Tell us what you are managing today and what needs attention” were removed. The existing headings, CTA labels and `/contact/` destinations remain. Deleted blocks collapse naturally; no spacer replaces them. Typography, colors, layout rules and animation/controller sources are unchanged, except removal of the unused Contact jump-link selector.

## Significant before/after comparisons

| Before | After | Why |
|---|---|---|
| “Competition preview. Inquiries are processed by Formspree for a temporary administrator-managed inbox.” | “Formspree processes inquiries for a temporary administrator-managed inbox.” | Names the actual processor and temporary destination concisely; full status and handling remain in Privacy. |
| “Go to the contact form” above that form. | Removed. | Redundant section CTA; existing form ID remains available to external links. |
| “Support, monitoring, maintenance and documentation for the day-to-day operation of your business IT.” | “Engineers assess alerts and support requests, maintain systems and track follow-up in shared IT records.” | Describes handling and records rather than repeating a service category. |
| “As a Lebanon-based MSP, ITKeepers connects ongoing support with shared environment knowledge. See … or compare …” | Removed. | Repeated positioning and forced links; geography remains in metadata and approved office information. |
| “AI is already inside your business. Make sure your data isn't leaving with it.” | “Set clear rules for AI use. Protect company data.” | Removes an unsupported assumption about the visitor and focuses on the resource's purpose. |
| Pulse's repeated portal/visibility explanations and feature slogans. | Specific planned feature descriptions, retaining “planned” and development limitations. | Preserves detail without implying a released platform. |

## Links and essential content

Removed 14 body-link instances: Contact's `#contact-form`; service-directory prompts from About, Managed IT and Web; generic How We Work prompts from Services and Managed IT; Managed IT/security prompts from Backup and Networks; and four links in How We Work's redundant final section. No broken or cross-environment navigation link needed replacement. Global navigation/footer structure and useful contextual Microsoft/security/recovery, emergency, Pulse and resource links remain.

All 20 pages retain exactly the same titles, descriptions, canonical/social metadata, robots declarations and JSON-LD as this task's baseline. H1s and substantive service scopes remain. The removed “What these workflow examples show” H2 introduced a deleted duplicate section; the remaining hierarchy has no skipped level. No keyword, address, metric, testimonial or schema fact was invented. Existing metadata retains natural Lebanon references and the approved MENA/USA coverage. Unchanged metadata does not establish future search-ranking performance.

The shorter form notice does not change the processor, inbox, consent, retention or privacy-request mechanism. Native no-JavaScript intent instructions, anti-spam honeypot, provider-verification warning, error contacts and acceptance/delivery feedback remain. No provider account setting or mailbox was changed.

## Validation

| Check | Result |
|---|---|
| Runtime/build | PASS — Node 22.23.4; production, staging and RC builds each emit 20 pages. No dependency/lockfile change. |
| TypeScript | PASS — `npm run typecheck`. |
| Existing regression suite | PASS — 240/240; zero failures/skips/cancellations. Only the old exact form-notice assertion changed, retaining processor, temporary inbox and associated Privacy-link checks. |
| Environment checks | PASS — `check:staging` and `check:rc`; existing body/asset isolation, form endpoint, metadata origins and indexability policies retained. |
| SEO/schema | PASS — production/staging audits each report zero failures/warnings. All 20 baseline metadata/JSON-LD sets are unchanged. All pages have one H1 and no heading-level skips. |
| Internal links | PASS — all local route/file/fragment targets resolve in generated output; no localhost, staging or RC host in navigation anchors; no body link points to its own page without a fragment/query. Global navigation self-links are intentional. |
| Browser rendering | PASS — 65 local surfaces: all 20 routes at 375/1440px in Chromium; Home, Contact, About, Managed IT and Pulse at those widths in WebKit; those five at 320/768/1024px in Chromium. All HTTP 200, no horizontal overflow/page errors. |
| Accessibility | PASS in tested scope — axe A/AA scans on 50 desktop/mobile surfaces, zero violations. This is not full WCAG certification. |
| Forms | PASS — 10 intercepted submissions across Chromium/WebKit cover general, consultation and compact requests, rate limits and provider verification. Two native no-JavaScript manual-intent cases pass without submitting. Real submissions: zero; inbox receipt is unverified. |
| Visual review | PASS — desktop/mobile Home form, Contact, About, Managed IT and Pulse screenshots inspected; shortened sections collapse without inserted spacers. Original spacing/design remains. |
| Preservation | PASS — source hashes retain hero/status, all illustrations and controllers, service lines, navigation/footer, public assets, geographic data, SEO data, worker/build/deployment configuration and packages. Privacy source is byte-identical. |
| Patch hygiene | PASS — CRLF-aware `git diff --check`; final baseline-relative source/test patch saved as `task.patch`. |

Static-main copy is shorter by 898 words across the generated site, excluding script/style/ARIA-hidden content. This is an editorial comparison, not a search or reading-time score. No essential service category or scope boundary was deleted; already concise illustrated pages retain their substantive descriptions. Physical-device/Safari, screen-reader, native forced-colors/zoom, field performance and real inbox delivery are not certified by these local checks.

## Owner review

The temporary Formspree/admin-inbox setup and competition/production distinction in Privacy remain accurate to the implemented configuration. A production transition needs its own verified mailbox/handling decision and Privacy review; this cleanup does not relabel it as a production integration.

Pulse remains under development. Historical article bodies include dated, broad predictions and promotional wording; consider a separately identified editorial update if those articles should become current guidance. Existing testimonial permission/evidence follow-ups remain unchanged. The footer's Our Team destination remains About, which contains team context rather than named staff profiles; navigation restructuring was outside this request.

Jim's local content/layout review is the next step. No release action is authorized or performed by this work.

Evidence and complete exact edits: sibling `../v2-content-cleanup-20261029/` (`changes.json`, `audit.json`, `route-copy.txt`, `before/`, build/type/test/environment logs and browser screenshots). Only this task's deltas are measured against the saved starting tree; the checkout also contains earlier uncommitted work.
