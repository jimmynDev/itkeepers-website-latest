# ITKeepers Website — Agent Instructions

## 1. Purpose and authority

This file defines shared rules and five working roles for the ITKeepers website. It is the canonical instruction set, not merely an index. Role files in `docs/agents/`, must reference these shared rules rather than maintain conflicting copies.

One agent may perform multiple roles. Role names assign responsibilities; they do not require five simultaneous agents. The Workflow owner coordinates integration and assigns an independent reviewer when available.

Follow the latest explicit project-owner instructions within applicable platform and security constraints. Record material project decisions in `PROJECT_STATUS.md`. Otherwise resolve trade-offs in this order:

1. Security, privacy and factual integrity.
2. Accessibility.
3. SEO and performance.
4. Visual preference.
5. Convenience.

Do not silently resolve conflicting sources or invent missing approvals.

## 2. Project context and current state

**Project:** ITKeepers public marketing website.

**Positioning:** “Your IT person is a team.” Familiar engineers who know the business, supported by shared knowledge and wider expertise.

**Three tenets:**

- You know us. Familiar people.
- We know your IT. Shared context.
- We stay involved. Follow-up.

**Brand:** preserve the official ITKeepers logo and colors. Use the navy refined-homepage concept as a starting point. Do not copy the code, wording, palette or chatbot from `itkeepers2.webverseai.com`.

**Current state:** an existing GitHub repository and Cloudflare deployment are already in place. Inspect the repository, branch, framework, dependencies, build scripts, deployment configuration and implementation before changing anything. Extend the existing project. Do not scaffold a replacement or reopen settled stack and hosting decisions without a concrete reason and project-owner direction.

Record the inspected commit and actual Cloudflare deployment type in `PROJECT_STATUS.md`; do not assume Pages versus Workers. Existing deployment does not prove that the production domain, redirects, security controls or form are configured correctly.

Lebanon/US service coverage, public figures and operational statements still follow the evidence rules below. Do not infer an office address or legal presence from service coverage.

### Required sources

All paths below are relative to the repository root. Keep `PROJECT_STATUS.md`, `claims-register.md` and `README.md` at the root; do not create competing copies under `docs/`. Resolve an absent source by exact filename and use only an unambiguous current match. Older source proposals do not override this file’s shared policy or release order.


Read the sources relevant to the assigned work:

- `docs/ITKeepers-Website-Project-Brief.md`: facts and claim controls.
- `docs/ITKeepers-Site-Map.md`: pages, phases and components.
- `docs/Keep-Upgrade-Replace-Tool-Spec.md`: tool behavior and rules.
- `docs/Self-Check-Copy-and-Rules.md`: self-check behavior and copy.
- `docs/drafts/robots.txt`: draft crawler policy only; inspect the actual deployed `robots.txt` separately and confirm approval.
- Repository instructions, current code and `PROJECT_STATUS.md`.

### Role document paths

| Role | Instruction document |
|---|---|
| Design and UI/UX | `docs/agents/AGENT-01-Design-UIUX.md` |
| Technical SEO and Performance | `docs/agents/AGENT-02-Technical-SEO-Performance.md` |
| Security, Privacy and Operational Hygiene | `docs/agents/AGENT-03-Security-Hygiene-Compliance.md` |
| Copywriting and Messaging | `docs/agents/AGENT-04-Copywriting-Messaging.md` |
| Workflow, Integration and Build | `docs/agents/AGENT-05-Workflow-Integration-Build.md` |

Record missing documents with an input ID and the exact work they block. Continue unrelated work. Do not repeat completed discovery or reconstruct missing tool rules from assumptions.

## 3. Evidence, claims and approvals

### Evidence register

Maintain `claims-register.md` with: claim ID, exact wording, affected pages, source, evidence status, publication approval, approver, approval date and review trigger.

| Evidence status | Meaning | Publication rule |
|---|---|---|
| Verified | Supported by documented evidence | Publish only with recorded wording approval |
| Employee-reported | Supplied by an employee; not independently confirmed | Hold until a responsible owner validates it |
| Proposed | Suggested design, policy or wording | Not a factual claim about current operations |
| Open | Evidence or a decision is missing | Hold the affected claim or feature |
| Illustrative | Clearly identified hypothetical example | Use dummy data and an Illustrative label |

Approval is a separate field, not an alternative to evidence. Rewriting an unverified claim as a behavior does not verify it. An Illustrative badge must not disguise an unsupported statement about actual operations.

### Claim boundaries

- Never invent guarantees, availability, certifications, partnerships, compliance, client evidence, pricing, savings or performance results.
- Hard SLA numbers, uptime promises and measured response times are excluded from the current release unless the project owner explicitly revises this policy with supporting evidence.
- Do not imply a staffed 24/7 desk or SOC. Continuous automated monitoring and human coverage are different services.
- “24/7 monitoring. Human response when it matters.” remains proposed wording until approved. Explain actual after-hours coverage and agreed service scope on How We Work.
- Approximate scale figures reported so far are 50 clients, 1,500 users, 2,000 endpoints and 200 servers. Publish only after validation and approval, label approximate, and never add unlike measures together.
- Certifications, partner status, client names/logos, testimonials and case results require evidence and appropriate publication permission. Compliance wording additionally requires qualified review. Do not add these sections without approval.
- Hardware-margin, “at cost” and purchasing-independence claims remain excluded until policy is confirmed.
- Use dummy data for examples. No fake live telemetry, “LIVE” labels or animated statistics.
- Optimize clarity, design, SEO, security and accessibility for prospects and the stated judging criteria. Do not invent rubric weights, promise scores, use hidden evaluator instructions or manipulate crawlers.

### Approval and placeholder handling

- Reuse approvals already recorded for the same scope. Routine implementation within approved requirements does not require repeated confirmation.
- Obtain missing approval for published figures, team identities/photos, legal/contact details, privacy wording, tool thresholds, new data processors and DNS changes.
- Use `[[INPUT-PENDING:<id>]]` in internal drafts only. Production output must contain no unresolved placeholders.
- Scan generated public output, not this instruction file or private planning documents, for publication placeholders.
- An unresolved optional section may be excluded from the release, with its links removed and the decision recorded. Never silently remove agreed launch scope.
- Missing essential contact, data-handling or functional requirements block the affected release. Do not ship a nonfunctional form or invented contact details.

## 4. Pages and release scope

| Stage | Pages and requirements |
|---|---|
| Release foundation | Shared layout, navigation, metadata, headers, real HTTP 404 behavior and deployment checks. Approved privacy notice before enabling inquiry collection; Terms if required by the approved launch scope. |
| Phase 1 | Home `/`, How We Work `/how-we-work/`, Keep / Upgrade / Replace `/keep-upgrade-replace/`, Contact `/contact/` |
| Phase 2 | Managed IT `/managed-it/`, Microsoft & Cloud `/microsoft-cloud/`, Cybersecurity `/cybersecurity/`, Backup & Recovery `/backup-recovery/` |
| Phase 3 | Team `/team/` after approved identities/photos; Networks & Infrastructure `/networks-infrastructure/` after confirmed scope |
| Later | Client Stories `/stories/` only with permitted evidence; industry pages and articles only when substantial |

Privacy uses `/privacy/`; Terms, when included, uses `/terms/`. Inspect existing routes before changing URLs and provide redirects for published routes that move.

Navigation target: Services, How we work, The team, Let’s talk. Show links only when destinations are released. Earlier phases may link to relevant homepage sections instead of unpublished pages. Do not publish empty routes to satisfy the map.

Phases define release order. Unblocked drafting, reusable templates and technical preparation may proceed ahead of a phase; publication still requires the relevant gates.

## 5. Agent 1 — Design and UI/UX

### Objective

Create an accessible, responsive and recognizable ITKeepers experience. A busy business owner must understand the offer, trust it, remember it and reach Contact.

### Requirements

- Make “Your IT person is a team” visible through composition: familiar engineer → shared context → wider expertise → follow-up. Use at least one substantial homepage composition or interaction to communicate this relationship.
- Preserve the strongest parts of the refined concept while improving hierarchy and pacing. Avoid repetitive card grids and decorative technology clichés.
- Use shared design tokens for color, typography, spacing, radius and shadows. Derive brand colors from official assets; document accessible supporting colors. Reuse existing token infrastructure where present.
- Scope section themes with background, foreground, muted and accent tokens. Avoid hard-coded heading colors that break across themes.
- Use purposeful tonal variation; do not alternate backgrounds mechanically.
- Use semantic HTML: native buttons and links, landmarks, fieldsets/legends and details/summary where appropriate. Custom tabs and menus require documented keyboard behavior and accessible names/states.
- Maintain WCAG 2.1 AA as the minimum acceptance baseline. Body text contrast must reach 4.5:1; qualifying large text 3:1; required visual information for controls and meaningful graphics 3:1. Distinguish disabled controls from readable, merely de-emphasized content. Document applicable exceptions rather than claiming every color pair is subject to the same rule.
- Provide a skip link, logical tab order, visible focus and keyboard operation without traps. Announce tool status/results politely; do not move focus on every update. Move focus only for an intentional context change that improves navigation.
- Honor reduced-motion preferences. No auto-advancing content. Provide pause controls for ongoing automatic movement; interactions must explain relationships or state changes.
- Use at least 16px body text and 12px fine print as project design rules, not claims about WCAG font-size requirements. Keep long prose readable, usually 60–80 characters per line.
- Support text-spacing overrides, 200% text resize and reflow at 320 CSS pixels. Inspect 320, 375, 768, 1024 and 1440px layouts; test 400% browser zoom. Sticky controls must not obscure content or focus.
- Use logical CSS properties and safe-area insets where needed. Do not rely on hover or color alone.
- Use real, approved team photography. Development placeholders must not reach production. Exclude an unapproved team section explicitly or hold its release.
- Keep one Illustrative badge style. Explain examples on How We Work and place essential tool limitations near results.

Do not use stock team photos, implied testimonials, client-logo marquees, testimonial carousels, decorative dashboards, gratuitous glows, the overlapping scroll circle or the concept banner. Keep meaningful text in HTML; the official logo is an exception to the restriction on image-based text.

### Page and interaction plan

Home baseline: hero → tenets → services → process → work you rarely see → Keep/Upgrade/Replace → shared context → approved team strip → closing CTA.

Regroup or reorder when it improves comprehension and the central message. Record meaningful structural changes and coordinate them with Copy.

- How We Work: monitoring, escalation, daily checks, documentation, reporting, onboarding and follow-up, using approved claims.
- Keep / Upgrade / Replace: static explanations followed by Tool and Quick self-check views.
- Contact: short form, truthful next steps and verified contact options.
- Process: Signal detected, Priority assessed, Engineer investigates, Colleague involved, Action and follow-up. Provide Previous/Next and selectable steps, no invented timings, and an Illustrative label. Do not imply every incident requires escalation.
- Shared-context example: documented knowledge using dummy data, without resembling live telemetry.
- Layers accordion: Identity, Endpoints, Network, Operations and Backups.

Specify empty, loading, error, success and result states for applicable components. Keep core explanations available without JavaScript and provide a useful fallback for unavailable interactive tools.

### Deliverables and checks

- Tokens and `DESIGN_TOKENS.md`, including contrast results for combinations actually used.
- Reusable components, usage notes and a noindex styleguide if a public styleguide is needed.
- Implemented release layouts and reusable service/team templates.
- Breakpoint screenshots; automated accessibility checks; manual keyboard, zoom, reduced-motion and forced-colors checks.
- Screen-reader and real-device results when available. Record unavailable checks honestly and assign follow-up; never report them as passed.

Fix implementation defects before handoff. Independent review supplements these checks; automated scores alone do not establish accessibility compliance.

## 6. Agent 2 — Technical SEO and Performance

### Objective

Make approved content discoverable, accurately described and fast for visitors, search engines and AI retrieval systems.

### Requirements

- Ship core content and approved figures in initial HTML. Use one descriptive H1 per page, logical headings, landmarks, descriptive links, correct language and appropriate image alternatives.
- Maintain one metadata source with unique titles/descriptions, canonical URL, robots policy, social metadata and schema types. Character counts are editorial guidance, not rigid validation limits.
- Preserve the existing canonical host unless a change is approved. Inventory alternate hosts, HTTP/HTTPS and preview URLs before configuring redirects.
- Generate Organization/WebSite schema on Home and Service schema on relevant pages from approved data. Add breadcrumbs where the page hierarchy warrants them. LocalBusiness/ProfessionalService requires verified applicable details. Schema must match visible content; omit unknown optional properties.
- Use the inspected, approved crawler policy. Search/retrieval access and training access are separate business decisions. Validate user-agent group behavior and API exclusions; do not assume the draft's active option is approved.
- Public thank-you and styleguide pages use `noindex` and remain crawlable so crawlers can see it. Exclude them from the sitemap.
- Protect previews with authentication and add `noindex` as defense in depth. A preview-wide robots disallow may also be used, but it does not provide access control or guarantee deindexing. Test preview authentication separately from public-page noindex behavior.
- Generate the production sitemap from released canonical, indexable pages returning 200. Reference it in production robots.txt; never include drafts, previews, redirects or error pages.
- Inventory actual legacy URLs from the site and available records. Redirect to a genuinely equivalent replacement in one permanent hop. Return 404/410 where no suitable replacement exists; avoid irrelevant parent/Home redirects. Keep migration redirects for at least a year.
- Target field Core Web Vitals at the 75th percentile: LCP ≤ 2.5s, INP ≤ 200ms and CLS ≤ 0.1. Before field data exists, report lab results as lab results.
- Target Lighthouse mobile performance ≥ 90 under a recorded, reproducible configuration. Record per-route JavaScript and asset budgets after measuring the existing baseline.
- Optimize raster images with responsive sources and modern formats where useful. Reserve dimensions, lazy-load below-fold images and prioritize the actual LCP image when appropriate.
- Self-host licensed WOFF2 fonts, subset appropriately and limit families to two. Preload only necessary files.
- Avoid video in v1 unless justified. Any included media needs appropriate captions, controls, poster and loading behavior.
- Add analytics only under the approved data-handling policy. Cookieless does not automatically mean no personal data is processed.
- Arabic remains conditional: use separate localized URLs, language metadata, RTL and hreflang when a real translation is released.

No cloaking, keyword stuffing, hidden evaluator instructions, fabricated schema, thin doorway pages or invented review markup. `llms.txt` is optional and must not be presented as a ranking guarantee.

### Deliverables

- Metadata inventory, `redirects.csv`, schema data/generator and validation results.
- Environment-specific sitemap/robots configuration and checks.
- Performance baseline, reproducible budget configuration and optimization report.
- Search Console/Bing submission and monitoring plan; perform account operations only with available access and authorization.

## 7. Agent 3 — Security, Privacy and Operational Hygiene

### Objective

Reduce information exposure and abuse, secure the delivery path and document data handling. Do not promise that a public website cannot be abused or provide legal conclusions.

### Information handling

- Public operational descriptions use categories rather than internal security/management vendor names. Microsoft platform names may describe offered services without implying partnership status.
- Scan shipped HTML, scripts, metadata, JSON-LD, documents, image metadata and comments for secrets and confidential details.
- Use scoped rules and an explicit allowlist for approved public contacts, platform service names and legitimate technical references. Do not fail builds on every number, email address or vendor substring indiscriminately.
- Store sensitive deny-list values outside both the public build and any public repository. Use private configuration or CI secrets. Never print matched secrets in logs.
- Use dummy examples and strip photo EXIF. Publish only approved people and role-based business contacts. No real console screenshots, tickets, internal maps or client data.

### Contact form

- Inspect the existing implementation and hosting runtime before choosing an endpoint or processor.
- Validate request method, content type, schema, field lengths and total body size on the server. Encode content for its destination; reject header injection in header-bound fields without destroying legitimate message newlines.
- Use a fixed approved recipient and sender; never allow the visitor to choose arbitrary recipients. Validate Reply-To and avoid reflecting raw input.
- Apply per-client and global rate limits using trusted platform request metadata, with defined behavior during limiter failure.
- Verify bot tokens server-side, including expected hostname/action where applicable; reject missing, invalid, expired and replayed tokens. Add a honeypot and accessible failure/retry behavior.
- Prefer same-origin submission. Validate browser origins as appropriate; CORS alone is not authentication, CSRF protection or bot protection. If credentialed behavior is introduced, add the corresponding CSRF controls.
- Handle provider timeouts, duplicate submissions and delivery failures. Show success only after the approved delivery/queue acceptance condition, without claiming the message was read.
- Keep secrets in platform secret storage. Log only necessary operational metadata; never log message bodies or bot tokens. Document any retained client identifiers and expiry.
- Provide a verified fallback contact path. Do not publish an active form before destination, ownership, privacy notice and retention are approved.

### Headers and dependencies

- Enforce HTTPS. Stage HSTS carefully; include subdomains or request preload only after assessing all affected hosts.
- Implement CSP for the actual rendered site. Use hashes for deterministic inline scripts or fresh response nonces where supported; never reuse a static nonce.
- Start with restrictive defaults, including `object-src 'none'`, `frame-ancestors 'none'`, controlled base/form destinations and only necessary resource origins. Test framework output and bot protection before enforcement.
- Allow Turnstile script/frame origins only when used and follow its current integration guidance. Do not force SRI onto provider-managed scripts that do not support stable hashes.
- Use CSP Report-Only for CSP rollout; it is not a report-only mode for other headers. Protect and minimize collected CSP reports.
- Set nosniff, an appropriate referrer policy and minimal permissions policy. Evaluate COOP compatibility. Remove unnecessary application disclosures where configurable; do not promise removal of provider-controlled headers.
- Keep lockfiles, reproducible installs, dependency and secret scans, least-privilege tokens, branch protections and account MFA. Record controls that require account-owner action.
- Security-header grades are diagnostic evidence, not proof that the site is secure.

### Privacy and domain operations

- Collect only necessary inquiry fields; normally name, work email, service interest and message. Document which fields are optional.
- Tools run locally without collecting or persisting answers. Copying answers into an inquiry is an explicit unchecked opt-in; never put answers in URLs, analytics or persistent browser storage.
- Map the form endpoint, delivery service, mailbox, logs and retention. A private inquiry mailbox may retain messages under the approved policy; “no message logging” does not prohibit intended inquiry delivery.
- Prepare privacy/Terms drafts for qualified review based on actual operations. Do not invent jurisdictions, retention periods, lawful bases or compliance assurances.
- Audit email senders and SPF/DKIM/DMARC. Propose staged improvements without weakening existing protections. MTA-STS, TLS-RPT, CAA and DNSSEC require compatibility checks and owner decisions.
- DNS/mail changes require recorded authorization and rollback steps. Domain-wide improvements are tracked separately from website release blockers unless they are needed for this release's operation.
- Publish `/.well-known/security.txt` only with an approved monitored contact and valid expiry; assign renewal ownership. Document vulnerability handling in `SECURITY.md`.
- Restrict active testing to explicitly authorized targets. Ownership alone is not permission for disruptive scans.

### Deliverables

`THREAT_MODEL.md`, scoped scanning rules, header configuration, form implementation and abuse/delivery tests, data map, reviewed privacy copy, domain audit/change plan, `SECURITY.md`, security.txt where ready, and incident/rollback runbooks.

## 8. Agent 4 — Copywriting, Messaging and Brand Voice

### Objective

Explain what ITKeepers does and how working with the team feels through specific, supportable language.

### Requirements

- Write calmly and directly for a nontechnical business owner. Use “you” for the visitor and “we” for the team; explain necessary jargon.
- Keep the hero “Your IT person is a team.” Support it with familiar engineers, shared expertise and continued involvement.
- Prefer approved behavioral evidence: backup checks, alert review, shared documentation, reporting and follow-up. These are factual claims and still need evidence.
- Follow the shared claims register. Omit unconfirmed capabilities rather than implying them through softer wording.
- Explain coverage once clearly on How We Work; add local clarification wherever another page would otherwise mislead.
- Keep one primary CTA per section. Vocabulary: “Let’s talk” in navigation, “Talk to our team” generally, “Talk to an engineer about this” for tool results and “Talk to an engineer about these” for self-check results.
- Use approved tool strings and rules. Verdicts: Keep, Upgrade, Replace, Ask an engineer. Include reasons and what to check next. Keep “a rule of thumb, not a diagnosis” and “a conversation starter, not an audit” near the relevant outputs.
- Do not label a visitor unsafe, protected or compliant based on a short self-check.
- No invented response promises, pricing, savings, fear-based claims, competitor disparagement or template claims.
- Avoid generic sales language such as cutting-edge, world-class, best-in-class, seamless, holistic, trusted partner and peace of mind.
- Keep strings in the existing content/i18n system. Preserve the established framework rather than imposing MDX or a new CMS.

### Deliverables

- Release-ready page content and interface strings, including errors, retries and success states.
- Claims register, voice guide and CTA vocabulary.
- Metadata drafts coordinated with SEO.
- Explicit open inputs for coverage, restore testing, reporting, figures, margin policy and team details.

Coordinate the homepage narrative with Design. Service pages should explain scope, handling, shared expertise, relevant reporting, real FAQs and next steps; do not force identical visual layouts.

## 9. Agent 5 — Workflow, Integration and Build

### Objective

Integrate the existing website, manage dependencies and release validated work without blocking unrelated progress.

### Working rules

- Maintain `PROJECT_STATUS.md`: inspected commit, deployed environment, current phase, route status, decisions, inputs, approvals, risks, validation and next steps.
- Inspect Git status before editing. Preserve unrelated changes and use the established package manager, lockfile and project scripts. Never overwrite work or force-push without explicit authorization.
- Confirm whether pushes to the target branch trigger production deployment. Treat such pushes as releases and apply release gates first.
- Use small, reviewable commits and branches consistent with the existing workflow. Coordinate ownership before multiple agents edit shared files; designate one integrator for merges, package/config changes and releases.
- Record material architecture/dependency/processor changes in `docs/adr/`. Routine fixes within the established architecture do not need a new ADR.
- Keep tool rules in versioned configuration with pure evaluation functions where practical. Test boundaries, invalid values, precedence and every “Not sure” path. Do not launch unapproved rules.
- Do not add a CMS, CRM, new framework or hosting migration without a demonstrated requirement and approval. The current form destination and any CRM use must be confirmed, not inferred from other projects.
- Ask only for unresolved decisions that affect current work. Group questions and explain exactly what each blocks.
- Define the release scope before evaluating completion. A limited release must explicitly identify deferred pages/features; it is not completion of the original full phase.

### Input register

Reuse existing answers and approvals. For each entry record status, evidence/decision, owner, affected feature and next action; do not automatically mark all entries unresolved.

| ID | Input | Owner | Actual dependency |
|---|---|---|---|
| B1 | Competition rules, exact deadline and submission format | Project owner | Competition submission; not ordinary design work |
| B2 | Buyer, service geography and language plan | Project owner/CEO | Geographic claims and localization |
| B3 | Legal/contact details, form destination and inquiry owner | CEO/Ops | Contact, privacy and relevant schema |
| B4 | Scale evidence and approval | CEO/Ops | Scale claims only |
| B5 | Approved team identities and photos | CEO/Team | Team page and team strip |
| B6 | After-hours policy and support commitments | CEO/Ops | Coverage wording |
| B7 | Restore testing and formal review practices | Ops | Related service claims |
| B8 | Network and co-managed service scope | Ops | Relevant service pages |
| B9 | Tool thresholds, rule precedence and self-check notes | Engineers | Interactive tool release |
| B10 | Hardware-margin policy | CEO | Purchasing-independence claims |
| B11 | Legacy URLs, canonical host, DNS owner and actual deploy workflow | IT/Ops | Migration, redirects and release configuration |
| B12 | Confirmed CMS/CRM requirement | CEO/Ops | Optional integrations only |
| B13 | Form processor, retention and approved privacy notice | CEO/Ops/reviewer | Inquiry collection |
| B14 | Review access, manual QA owner and release authorization | Project owner | Outstanding checks and release |

### Execution sequence

1. Inspect sources, repository and existing deployment configuration. Record facts, gaps and the implementation baseline.
2. Reconcile approved decisions and scope; resolve only current blockers.
3. Extend existing tokens, components, content and routes. Add only missing infrastructure.
4. Integrate metadata, schema, privacy, headers and form behavior alongside Phase 1 implementation.
5. Implement the tools from approved specifications and validate their rules.
6. Review the release candidate, including manual interactions and truthful claims.
7. Release the validated commit using the established Cloudflare workflow when authorized. DNS cutover is a separate action and is unnecessary for ordinary site updates.
8. Verify production responses, form delivery, redirects and headers. Record the deployed commit and rollback target.
9. Continue later pages as their content and approvals become ready; maintain an explicit outstanding-work list.

## 10. Validation and definition of done

Every result must be Pass, Fail, Blocked or Not applicable, with evidence and an owner. Not applicable requires a reason. Never mark unavailable tooling or missing access as a pass.

### Build and automated checks

- Established lint/type/build checks pass.
- Tool tests cover approved rules, boundaries, conflicting inputs, invalid input and unknown answers.
- Public output contains no placeholders, secrets or confidential information.
- Released routes, internal links, HTTP statuses and redirects behave correctly.
- Metadata, schema, sitemap, robots and canonical behavior match the target environment.
- Automated accessibility checks and agreed performance budgets pass on representative page types and all unique interactive flows.
- Form abuse, failure, retry and delivery behavior pass in a controlled environment.
- Dependency findings are assessed for relevance and severity; applicable release-blocking issues are fixed.

### Manual and deployment checks

- Keyboard, focus, screen-reader, zoom/reflow, reduced-motion and responsive behavior are reviewed with recorded results.
- Public claims match their approved evidence; approved photography and consent are recorded.
- Preview protection and production indexability are checked separately.
- Headers are tested on actual static and dynamic responses, including errors and form endpoints. Do not assume static hosting configuration covers functions.
- Inquiry routing and privacy requirements are verified before enabling the form.
- A known-good rollback target and executable rollback procedure exist.

### Completion rules

- Phase 1 is complete when all four pages and specified tools meet applicable gates, with the release foundation in place.
- Phase 2 is complete when all four service pages meet the same gates and claims are approved.
- Phase 3 is complete when approved team and network pages meet the same gates.
- A release is complete only after production smoke checks pass for the deployed commit. Post-launch search submission, field metrics and domain-hardening follow-ups remain tracked separately when not yet available.
- Failures block the affected release. Any permitted exception requires a recorded owner decision, scope, rationale and remediation date. Never use an exception to ship secrets, private client data, fabricated claims or a knowingly deceptive form.

Maintain README setup/build/deploy instructions, validation evidence and a maintenance runbook covering dependencies, claim reviews, tool-rule reviews, inquiry handling and security.txt expiry.

## 11. Handoff format

End each implementation session with:

- **Done:** completed work and resulting behavior.
- **Decisions made:** decision and reason.
- **Assumptions:** explicitly labeled Proposed.
- **Validation:** checks run, results and unavailable checks.
- **Blocked on:** input IDs and exact affected scope.
- **Needs review from:** role or human owner.
- **Files changed:** relevant paths and commit, if created.
- **Deployment:** not deployed, preview or production; include verified commit/status.
- **Next:** highest-priority remaining action.

## 12. Technical references

Verify implementation details against current official documentation:

- [Google: noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
- [Google: URL migrations](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)
- [W3C: status messages](https://www.w3.org/WAI/WCAG21/Understanding/status-messages)
- [W3C: non-text contrast](https://www.w3.org/WAI/WCAG21/understanding/non-text-contrast.html)
- [Cloudflare: Turnstile server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Cloudflare: Turnstile CSP](https://developers.cloudflare.com/turnstile/reference/content-security-policy/)
