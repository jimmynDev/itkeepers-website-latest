# ITKeepers Website — Project Context and Handoff Brief

Prepared: 28 September 2026 (Asia/Beirut)
Owner/contact in this project: Jim Nassar, ITKeepers Systems & Network Engineer
Current public website: https://itkeepers.com/
Status: Discovery and positioning developed; architecture, design and implementation are next.

## 1. Purpose and how to use this source

This document preserves the substantive context from the ITKeepers website discussion so a new chat can continue without repeating the employee questionnaire. Read this source before planning, writing or building the site.

The project is a distinctive redesign of ITKeepers' public website. The discussion frames it as a website challenge with a $500 prize and possible evaluation by Claude/ChatGPT. Those challenge details came from the previous assistant's framing; the actual competition rules, submission requirements, judging method and deadline have not been supplied here. Obtain them if they affect implementation.

The desired result is a website that clearly communicates the company, demonstrates credibility and care, and performs well for prospective customers, search engines and AI-assisted evaluations. There is no established universal ChatGPT or Claude website score in this project. Any scoring rubric we create is an internal audit, not an official evaluator's rubric.

Evidence labels throughout this brief:

- **Employee-reported:** Jim's first-hand description of operations. Useful for discovery, but not independently audited or automatically approved for public publication.
- **Earlier research:** Findings reported in the prior conversation. Source URLs are retained below. They have not been freshly verified while compiling this brief.
- **Proposed:** Marketing, design and implementation ideas from the discussion. They are not proof of actual service commitments or final production decisions.
- **Open:** Missing details that should not be invented.

The current task was to create this handoff source. No website has been built, changed or deployed in this task. Do not imply otherwise.

## 2. Core company facts reported by Jim

| Item | Employee-reported information | Publication qualification |
|---|---|---|
| Business | Managed IT services with Microsoft/cloud, security, networking, servers, endpoints and backup expertise | Confirm final service naming and commercial scope |
| Active client companies/environments | Approximately 50 | Approximate, as of this discussion; not an audited metric |
| Users supported | Approximately 1,500 | Same qualification |
| Endpoints managed | Approximately 2,000 | Same qualification; do not add users and endpoints into a single total |
| Servers managed | Approximately 200 | Same qualification |
| Engineering team | Four engineers in Lebanon and two in the United States | Six total; confirm whether leadership is included and exact team presentation |
| Geographic operations | Lebanon and United States | US presence extends available working times; no formal around-the-clock human coverage established |
| Strongest technical areas | Microsoft managed cloud, firewalls/security and backups | Do not turn this into unsupported certification or partner-status claims |
| Industries mentioned | Construction, NGOs, transit, academies and legal | Clarify meaning of transit/academies before final sector page wording |
| Leadership | Small coordinated team works directly with a technically experienced, detail-oriented CEO | No name, biography, credentials or photo supplied |

Current Microsoft 365 tenant count was not provided. Do not derive it from client count.

## 3. Support, monitoring and escalation

### Serious incidents

Employee-reported process:

1. An issue arrives by phone or email.
2. The receiving engineer prioritizes a serious incident, pausing other work and moving that work to the queue or other engineers where needed.
3. The engineer contacts the customer when useful, gathers information, asks questions and starts investigation.
4. Immediate restoration/workaround may come first; deeper remediation follows.
5. Escalation happens immediately when another engineer is clearly better suited, or after initial attempts / exceeding the expected time to resolve.

Jim reports that customers normally receive a response, assignment and usually the start of investigation within about 2–4 minutes, with rare exceptions during very busy periods. This is an employee estimate, not measured performance or a contractual guarantee. Planner is used to handle tickets/tasks, and its timestamps are not considered a reliable basis for response-time statistics. No reliable reporting export was offered.

Proposed public treatment: describe serious requests as prioritized quickly and normally answered within minutes. Avoid a numeric SLA, guaranteed two-minute response, or any suggestion that resolution takes 2–4 minutes. Exact business hours, priority definitions, contractual response times and coverage must still be confirmed.

### Proactive monitoring

- Naverisk/RMM and security monitoring produce automated alerts, especially for severe conditions.
- Jim describes automatic ticket creation and prompt engineer assignment, often around two minutes in ordinary conditions. Treat that timing as an estimate, not an audited metric.
- Some issues are addressed before clients notice them.
- Monitoring is automated and continuous; engineers are not physically staffing a NOC 24/7.
- Critical alerts can reach technicians through WhatsApp or email outside ordinary working hours. Jim says someone is usually ready to assist for a critical situation at any time.
- Exact after-hours obligations, eligibility, rota and response guarantees are not established.

Proposed wording: **“24/7 monitoring. Human response when it matters.”** Explain that automated systems run continuously and critical alerts can notify engineers after hours. Do not publish “24/7 staffed support,” “24/7 engineers,” or guaranteed uninterrupted human coverage without further evidence.

### Recurring issues

Repeated issues receive a thorough investigation. If the engineer cannot identify the answer, the issue is transferred/escalated. Describe the goal as identifying underlying causes and reducing recurrence; do not guarantee that every issue will be permanently eliminated.

### Morning operations

Jim reports daily reviews of monitoring, backups, security, performance, user/email requests, open work and scheduled recurring monthly/yearly tasks. An exact start time was not supplied. Earlier “08:00” copy was an illustrative concept, not an actual operating schedule. Do not assume checks happen before every client's working day.

## 4. Infrastructure, security and client lifecycle

### Backups and recovery

Backups are monitored through software and checked every morning. Routine restore testing, recoverability validation, recovery time objectives, recovery point objectives, retention periods and guarantees have not been established. Do not convert successful-job checks into a claim of tested restoration.

Jim described one phishing-related device compromise that affected files, including turning filenames into gibberish, from which the team recovered. This is a potential anonymized case study. The exact threat type, affected scope, chronology, containment steps, recovery method, data loss and recovery duration are unknown. Do not label it definitively as ransomware, promise zero data loss, invent a recovery time, or claim recurrence was prevented.

### Connectivity and power

- The team consistently recommends a backup internet connection.
- This does not establish that every client has automatic failover, SD-WAN, 4G/5G or dual WAN installed. Confirm actual implementations before making those claims.
- For electrical/power risks the company brings in a specialized team to address, maintain or help prevent problems. Do not imply ITKeepers itself supplies every electrical service or guarantees protection from power failures.

### Security tools and practices

Jim named or confirmed: firewalls, EDR/antivirus, WDAC/application control, RMM, Microsoft Conditional Access, Intune, MFA, DNS filtering, SIEM/alerting and backups. Named tools include Bitdefender, Naverisk, ThreatLocker and Backup Radar.

There is a security baseline and checklist, with client-specific configurations according to business needs. Do not imply every technology is deployed to every client, or that every client has every license needed for those technologies.

Proposed security explanation:

| Layer | Examples to describe where applicable |
|---|---|
| Identity | Entra ID, MFA, Conditional Access |
| Endpoint | Intune, EDR, application control / WDAC |
| Network | Firewalls and DNS filtering; confirm segmentation practices before claiming universal implementation |
| Operations | Monitoring, alerting, patching and follow-up |
| Recovery | Backup monitoring, daily checks and documented recovery procedures where substantiated |

### Onboarding

For Microsoft environments, Jim describes Entra enrollment followed by Intune enrollment and automated deployment of security tools and applications based on department/role. Exact join/enrollment and licensing arrangements vary and should be technically validated when writing detailed service content.

For non-Microsoft-managed clients, tools such as Bitdefender, Naverisk, ThreatLocker and Backup Radar are used as applicable. This is not yet a complete commercial onboarding timeline. Discovery, credential transfer, inventory, transition duration and client responsibilities still need definition.

### Inherited environments

Common findings include poor server installations, poor cable management, weak security, insufficient maintenance, weak support and many hidden issues. Frame these as problems ITKeepers encounters; do not publish unsupported accusations against named competitors.

### Documentation and continuity

Jim reports detailed documentation of devices, users, IP addressing/maps, VLANs, vaults/credentials, licenses, tenants and environment details. Another engineer can mostly take over, though continuity is not perfect in every case. Avoid promising total interchangeability or complete elimination of individual knowledge dependencies.

Never expose real credentials, tenant identifiers, internal network maps, client names, IP addresses or live monitoring data in website demonstrations. Use clearly illustrative or properly anonymized examples.

### Reporting and reviews

Monthly reporting includes patches, backups, security updates/policies, device information, recommendations and opportunities to reduce costs. Exact report fields, samples and client access should be confirmed.

Formal recurring business/technology reviews are not currently established; Jim said this is something the company should implement. Do not advertise existing quarterly business reviews or a guaranteed review cadence.

## 5. Financial advice and operating culture

### Keep / upgrade / replace

Jim describes regular assessment of client equipment and recommendations about what performs well, what needs upgrades and what should be retired. Examples include avoiding overspecified new laptops, upgrading RAM where appropriate, and avoiding unnecessary servers, firewalls or other equipment.

Proposed explanatory device: **KEEP / UPGRADE / REPLACE**, based on needs and condition. These are illustrative categories, not a claim that a specific assessment product already exists.

Hardware/software procurement involves vendor pricing and an added margin. Jim described “10%” but also “$10 on a $200 order”; those figures conflict because 10% of $200 is $20. Clarify privately if margin matters. Do not publish either figure without confirmation, and do not claim ITKeepers earns no resale margin or is wholly financially independent of purchases.

### Why clients stay

Jim emphasizes:

- Friendly engineers who feel like part of the client's own team.
- Familiarity with individual users, names, systems and history.
- Follow-up, remembering details clients may forget, and attention to small problems.
- Care for the client's budget, productivity and peace of mind.
- A small, coordinated team with direct technical CEO involvement.
- Professional, detail-oriented work and internal access to specialist help.

Reported complaints about previous providers include slow replies, repeated unresolved problems, poor service and harsh interactions. These are employee-reported themes, not authenticated customer quotations.

Most engineers handle broad responsibilities, with deeper specialists involved for detailed matters. Do not represent the six proposed expertise categories as six verified separate job titles or one specialty assigned to each engineer.

### Internal IT comparison

Jim's argument for the service: a coordinated team provides several skill sets, more coverage and specialist escalation while reducing the customer's recruitment and management burden. Any claim that it costs less than hiring must be qualified or supported with an actual scenario; no pricing comparison was supplied.

His wording about “insuring your IT” is not evidence of insurance coverage or a legal indemnity. Do not make insurance, liability-transfer or guaranteed-protection claims.

Present internal IT respectfully. ITKeepers can potentially complement an existing IT person; confirm whether co-managed IT is actually offered before making it a service promise.

## 6. Real examples available for future proof

| Employee-reported example | What can be developed | What is still needed |
|---|---|---|
| Disk-space issue identified; data backed up to OneDrive and space freed | Short proactive maintenance example | Device/context, approved data location, validation, chronology and outcome; do not present OneDrive as a universal backup solution |
| RAM/performance issues led to upgrades or retiring older devices | Keep/upgrade/replace example | A specific anonymized case and actual recommendation/outcome |
| Backup alerts and security vulnerability patches | Explanation of routine prevention | One concrete incident and verified timeline; do not invent a CVE |
| Phishing-related compromise and affected filenames, followed by recovery | Potential incident case study | Exact technical sequence, scope, evidence and publication permission |
| Advice against unnecessary hardware or overspecified laptops | Budget-conscious consulting story | A real purchase comparison; no invented savings |

No authenticated testimonial, client logo permission, quantified savings, audited response statistics, named reference customer or certification evidence has been supplied in this thread.

## 7. Working positioning and message hierarchy

These are the leading proposals from the conversation, not separately approved final website copy.

**Primary headline:** Your IT person is a team.

**Supporting explanation:** ITKeepers gives businesses a coordinated team of engineers who know their people, understand their infrastructure and work proactively to keep technology secure and reliable.

**Human relationship message:** Outsourced IT. Without feeling outsourced.

**Operational framework:** We know your IT. We watch your IT. We take ownership of your IT.

Four proposed promises:

1. **You know us. We know you.** Familiar engineers, environment knowledge and follow-up.
2. **We don't wait for the phone to ring.** Monitoring, daily checks and proactive maintenance.
3. **We fix causes, not just tickets.** Investigate recurring issues and involve the right engineer.
4. **We protect your technology budget too.** Assess before recommending purchases.

Supporting copy candidates to test:

- The best IT ticket is the one you never have to open.
- The goal isn't to close your ticket. It's to stop it coming back.
- When one engineer needs another, you get the team.
- Six engineers. One IT team. Yours.
- Your infrastructure shouldn't exist inside someone's head.
- Security isn't a product we install. It's a system we maintain.
- Good IT advice shouldn't always end with an invoice.
- Our job isn't to sell you more IT. It's to make the IT you need work better.
- Let's talk about your IT before there's a problem.

Use restrained, evidence-backed language. These lines should express direction and behaviors, not absolute outcomes or guarantees.

Earlier alternatives preserved for context:

- “Your IT team. Without the limitations of an IT department.” Earlier hero candidate; the shorter team headline became the leading proposal.
- “Prevent → Prove → Improve.” Earlier framework: prevention, visible reporting and ongoing improvement.
- “No black-box IT.” Transparency concept supported partly by monthly reporting; a live customer dashboard has not been established. Earlier research also found similar wording at EXEO, so do not claim the phrase is unique.
- “We don't wait for IT problems. We engineer them out.” Earlier strong prevention line; avoid implying that all problems can be eliminated.

**Internal design rule:** Don't merely tell visitors ITKeepers cares. Show the operational behaviors that demonstrate care: familiar engineers, monitoring, daily checks, documentation, escalation, follow-up and careful purchasing advice.

## 8. Proposed homepage story and interactions

The following is a starting sequence to refine into a wireframe. It is not a requirement to keep all ten sections or make a very long homepage.

| Order | Section purpose | Proposed content / visual |
|---|---|---|
| 1 | Immediate positioning | “Your IT person is a team.” Supporting explanation, “Talk to Our Team” CTA, approximate scale figures |
| 2 | Familiar relationship | Engineers know the business and users; real team photography when available |
| 3 | Proactive monitoring | Monitor → Detect → Assign → Investigate → Resolve; visibly illustrative process |
| 4 | Recurring problem ownership | Restore work, investigate causes, escalate internally and follow up |
| 5 | Daily operations | Backup, security, system health, performance, requests and recurring maintenance checks |
| 6 | Budget protection | Interactive keep/upgrade/replace device assessment example |
| 7 | Security layers | Identity, endpoint, network, operations and recovery |
| 8 | Documentation | Illustration of organized environment knowledge and continuity |
| 9 | People and escalation | Team across Lebanon and US, actual expertise and leadership once verified |
| 10 | Evidence | Verified/anonymized client story; omit or defer until enough evidence exists |
| Final | Contact | “Let's talk about your IT before there's a problem.” Clear route to the team |

Suggested CTAs: “Talk to an Engineer,” “Talk to Our Team,” “See How ITKeepers Works.” Confirm who receives inquiries before promising direct engineer access or “no sales call.”

Animations should clarify the service and remain accessible. The earlier second-by-second monitoring timeline and the “08:00” morning check were conceptual mockups. They must not look like live telemetry, real case records or measured service timings unless based on evidence.

No colors, fonts, logo changes, final visual system, approved photos, frontend stack or hosting platform have been selected. The desired tone is distinctive, human, precise and professional. Avoid generic MSP stock imagery and generic “innovative trusted partner” copy as the main differentiator.

## 9. Previous market research — retained leads, not fresh verification

The earlier assistant reported the following competitive observations. Revisit the relevant original pages before making current comparisons or public claims. The assessments of competitors are interpretations, not objective rankings.

| Competitor | Earlier observation | Reference retained from discussion |
|---|---|---|
| CSB Group | Detailed enterprise IT, cybersecurity, cloud and continuity content; reported scale claims, certifications, SLAs and NOC/SOC services | https://csbgroupco.com/services |
| EXEO | Strong cybersecurity trust/certification story and documented service detail; prior discussion mentioned ISO 27001/27017/27701 and SOC 2 Type II | https://exeo.net/en/about-us/ |
| EXEO managed SOC | Prior research found a “not a Black Box” visibility message | https://exeo.net/en/managed-soc-services/ |
| Pi Tele | Broad ICT offering across networking, cloud, security and managed services with local engineering | https://pi-tele.com/ |
| ITL Connect | Managed IT, Microsoft 365, Azure, networking and partner messaging | https://www.itlconnect.com/ |
| Information Systems | Long-established provider; prior research reported operation since 1993 | https://infosystems.com.lb/ |
| Capital Outsourcing | Enterprise outsourcing, cloud and infrastructure/data-centre positioning | https://www.c-o.com/ |
| CTNET | Broad IT/low-current/support catalogue; earlier research reported a 300+ client claim | https://ctnet-lb.com/ |
| IBS | Outsourced IT department, monitoring, patching, SLAs and roadmaps | https://www.ibsleb.com/services |
| MSPE | Earlier research noted Lebanese SMB managed IT/security, transparency and cost-control positioning | https://lb.linkedin.com/company/mspe-lebanon |

Working conclusion: many providers emphasize similar tool categories, certifications, support and “trusted partner” language. ITKeepers' proposed opportunity is to explain the actual client experience and operating model: familiar engineers, coordinated escalation, daily attention, reporting and thoughtful spending. Do not claim competitors lack these practices merely because a page did not describe them.

### Previous observations about the current ITKeepers website

- Earlier research found personality in “Hackers Hate Us. Clients Trust Us.” and “We became your IT department.” Retain as existing-brand references, not mandatory new copy.
- A text extraction reportedly exposed initial counter values as “0% Lower IT Costs / $0M+ Data Secured / 0+ Clients / 0/0 Support.” This may have been caused by animated counter starting values; reproduce the issue before treating it as a current defect.
- Earlier research found a cloud-related URL at https://itkeepers.com/solutions/2 . A descriptive service URL was proposed. Audit existing URLs and map redirects before changing any live route.
- The prior research noted public Florida/Lebanon presence. Exact legal entity details, addresses and service coverage require verification.

## 10. Technical quality direction

These are proposed requirements to confirm during architecture, not completed work.

### Content and search visibility

- Clear company identity, location/service area, customer fit and services.
- One meaningful main heading per page, logical heading structure, semantic landmarks and descriptive navigation/links.
- Essential copy and final metric values present in delivered HTML or reliably prerendered output; do not depend on watching an animation.
- Descriptive page URLs, unique titles/descriptions, canonical URLs, sitemap and intentional indexing rules.
- Redirect mapping for replaced URLs; preserve useful existing traffic and links.
- Appropriate structured data that matches visible, verified content, potentially Organization, Service, BreadcrumbList and a suitable LocalBusiness type where applicable. Do not fabricate reviews, ratings or facts.
- Intentional crawler policy. Review relevant search/retrieval bots separately from model-training bots; do not promise that bot access guarantees inclusion or favorable ranking.
- Useful, people-first service and evidence content. No hidden instructions aimed at manipulating an AI evaluator.

### Accessibility and performance

- Keyboard support, visible focus, readable contrast, labels, meaningful alt text, responsive layouts and reduced-motion support.
- Keep information and actions usable without animation.
- Optimize images, font loading, scripts and layout stability.
- Earlier discussion used Core Web Vitals goals of LCP ≤2.5 s, INP ≤200 ms and CLS ≤0.1. Verify current official guidance when auditing. Distinguish lab measurements from field data and avoid guaranteeing scores on all devices/networks.

### Security and privacy

- HTTPS and appropriate security headers, with CSP designed around the actual stack, clickjacking controls, MIME-sniffing prevention and sensible referrer/permissions policies.
- HSTS only with a deployment/domain plan that supports it safely.
- Secure form validation and handling, rate limiting/abuse controls, protected secrets and minimal required data collection.
- Dependency hygiene, review of third-party scripts and appropriate CORS where applicable.
- Confirm privacy notice, analytics/cookie choices, contact-data retention and form destinations according to the final implementation.
- Public marketing must not expose private client or operational data.

### Research references retained for technical follow-up

- OpenAI crawlers: https://developers.openai.com/api/docs/bots — URL retained from earlier research; verify current canonical documentation.
- Google LocalBusiness structured data: https://developers.google.com/search/docs/appearance/structured-data/local-business
- Google Core Web Vitals: https://developers.google.com/search/docs/appearance/core-web-vitals
- Google Search Essentials: https://developers.google.com/search/docs/essentials
- Anthropic crawler guidance was referenced, but an exact official URL was not preserved in the supplied conversation. Locate the current official source rather than inventing a link or crawler policy.

## 11. Claim controls and missing evidence

| Avoid asserting | Reason / acceptable next step |
|---|---|
| Guaranteed 2–4 minute response or resolution | Employee estimate, no reliable measurement or SLA supplied |
| Staffed 24/7 human support | Automated monitoring is continuous; human staffing is not |
| Tested recovery for every backup | Daily status checks confirmed; routine restore testing not confirmed |
| Zero downtime, zero data loss, complete prevention | Unsupported absolute outcomes |
| Six named specialists with six distinct roles | Six engineers reported, actual roles not provided |
| Formal quarterly reviews | Jim said structured reviews should be introduced |
| Live customer dashboard or portal | Reporting exists; a portal has not been confirmed |
| Guaranteed lower costs / quantified savings | Specific evidence and pricing comparisons are missing |
| Vendor-neutral/no resale incentive | Resale markup exists; exact figure requires clarification |
| Insurance or full transfer of IT liability | No such contractual detail supplied |
| All clients have automatic connectivity failover | Backup connections are recommended, not universally confirmed |
| Certifications, official partnerships or vendor badges | Require actual status and permission to use marks |
| Case-study chronology, loss totals or recovery time | Not supplied; develop from verified incident facts |

## 12. Open inputs and decisions

Do not repeat the whole discovery questionnaire. Ask only for missing details when they materially affect the next stage. Architecture and a concept wireframe can proceed with clearly labeled assumptions.

Needed before production claims/design are finalized:

- Competition brief, deadline, evaluation criteria and required deliverable format.
- Exact target buyer, company size, geographic priority and website languages.
- Brand assets: current logo/vector files, approved colors/fonts and any identity constraints.
- Current repository/site stack, CMS/backend, hosting, DNS ownership and authorized deployment workflow.
- Final contact details, addresses, legal company name, contact form destination and inquiry handling.
- Current support hours, service scope, after-hours arrangements and actual contractual commitments.
- Confirmation of approximate scale figures and permission to publish them.
- Team names, accurate roles, approved headshots and leadership biography.
- Actual report samples suitable for anonymization, customer permission for logos/testimonials and incident details.
- Existing service pages and URLs to retain or redirect; actual broader service offerings beyond the core MSP scope.
- Conversion goal: call, inquiry form, assessment booking or another agreed action.

Do not import assumptions from Jim's unrelated Natural Touch/JIVON, Chabeb Electric, WhatsApp-business or other website projects. Their domains, branding, hosting and repositories do not belong to ITKeepers.

## 13. Recommended next work package

1. Read this source and preserve the distinctions between employee reports, earlier research and proposed copy.
2. Produce the site architecture: navigation, page list, page purposes, conversion paths and initial URL structure.
3. Produce a homepage wireframe and visual direction with purposeful interaction concepts.
4. Map each prominent claim to available evidence or mark it for confirmation.
5. Define an internal audit rubric covering positioning, proof, usability, accessibility, performance, SEO, security and content integrity. Label it as our own rubric.
6. Once the design and technical route are settled, implement and validate. Do not claim a live deployment until one is actually completed and checked.

Candidate page families to evaluate, not an approved sitemap: Home; Managed IT; Microsoft & Cloud; Cybersecurity; Networks & Infrastructure; Backup & Recovery; How We Work; Team/About; verified Client Stories; Contact. Avoid thin, repetitive pages created only for keywords.

## 14. Suggested opening request for the next chat

“Read ITKeepers-Website-Project-Brief.md in this project's Sources before starting. Continue the ITKeepers website project from the completed discovery phase. Use ‘Your IT person is a team’ as the leading positioning proposal. Create the complete site architecture, navigation, homepage wireframe, visual direction, interaction concepts, SEO/security requirements and an internal evaluation checklist. Ground the design in the employee-reported operations and respect all claim limitations. Do not repeat the discovery questionnaire or invent evidence. Identify only the missing inputs that materially block the next stage.”

