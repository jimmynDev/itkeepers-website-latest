# ITKeepers Website: Site Map and Page Plan

Prepared: 28 September 2026 | Status: **Proposed, not an approved sitemap**
Base design: the navy "refined homepage concept" (real logo and brand colors), with its contrast and layout bugs fixed.
Root `AGENTS.md` governs current release order, approvals and shared policy; this document retains page-planning proposals.
Labels follow the project brief: **Employee-reported**, **Proposed**, **Open**.

## 1. Structure at a glance

| Phase | Page | URL | Role |
|---|---|---|---|
| 1 | Home | `/` | Positioning, proof of behavior, route to contact |
| 1 | How We Work | `/how-we-work/` | The operating model: monitoring, escalation, daily checks, documentation, reporting |
| 1 | Keep / Upgrade / Replace | `/keep-upgrade-replace/` | Signature tool plus the quick self-check |
| 1 | Contact | `/contact/` | Conversion page |
| 2 | Managed IT | `/managed-it/` | Service page |
| 2 | Microsoft & Cloud | `/microsoft-cloud/` | Service page (strongest area) |
| 2 | Cybersecurity | `/cybersecurity/` | Service page (strongest area) |
| 2 | Backup & Recovery | `/backup-recovery/` | Service page (strongest area) |
| 3 | Team | `/team/` | People and escalation, once verified |
| 3 | Networks & Infrastructure | `/networks-infrastructure/` | Service page, after confirming actual scope |
| Foundation | Privacy, conditional Terms, HTTP 404 | `/privacy/`, `/terms/` when required | Approved privacy before inquiry collection; real HTTP 404 before release; Terms per approved scope |
| Later | Client Stories | `/stories/` | **Only when real, permitted case material exists.** Do not launch empty |
| Later | Industry pages, articles | TBD | Only if substantial; no thin keyword pages |

**Navigation:** Services (dropdown) · How we work · The team · **Let's talk** (CTA). Keep / Upgrade / Replace is reached from Home and How We Work, and linked in the footer.

**Conversion path:** any page leads to Contact. The tool and self-check lead to Contact with an optional, opt-in answer summary.

## 2. Shared components

| Component | Used on | Notes |
|---|---|---|
| Header, footer, sticky CTA | All | One CTA label everywhere: "Let's talk" or "Talk to our team" |
| "Illustrative" badge | Any mock or example | One consistent badge; details live on How We Work |
| Process step-through ("A signal gets noticed") | Home, How We Work | Buttons plus keyboard; no auto-advance |
| Layers accordion (Identity, Endpoints, Network, Operations, Backups) | Home, Cybersecurity | Native `<details>` |
| Shared-context card (dummy data only) | Home, How We Work | Never real client data |
| Keep / Upgrade / Replace tool | Tool page, Home teaser | Spec: `docs/Keep-Upgrade-Replace-Tool-Spec.md` |
| Quick self-check | Tool page | Spec: `docs/Self-Check-Copy-and-Rules.md` |
| Team strip | Home, Team, Contact | Real photos only, with permission |
| Contact form | Contact, CTA bands | Service dropdown, rate-limited, bot-protected |
| Visible FAQ | Service pages | Real questions only; don't rely on FAQ rich results |

## 3. Page specs

### Home (`/`)
- **Purpose:** in seconds, say who ITKeepers is and why it feels different.
- **Sections:** hero ("Your IT person is a team.") → three tenets → service strip → process step-through → "The work you rarely see" → Keep / Upgrade / Replace teaser → shared-context card → team strip → final CTA ("Let's talk about your IT before there's a problem").
- **Evidence and claims:** approximate scale figures (about 50 clients, 1,500 users, 2,000 endpoints, 200 servers) only if approved, labeled approximate, never summed. No response-time numbers, no "24/7 staffed."
- **Needs:** approved figures; team photos.
- **Meta title (proposed):** ITKeepers | Managed IT with a Team That Knows Your Business
- **Schema:** Organization, WebSite. Add LocalBusiness only after legal name and addresses are verified.

### How We Work (`/how-we-work/`)
- **Purpose:** carry the proof the brief says you can't yet quantify: behaviors instead of statistics.
- **Sections:** monitoring and escalation (step-through) → daily checks → recurring problems → documentation and continuity → monthly reporting (anonymized sample when available) → onboarding outline → what's illustrative and why.
- **Evidence and claims:** "24/7 monitoring, human response when it matters." Explain that critical alerts can reach engineers after hours; no guarantee. No quarterly reviews until they exist. Restore-testing statements only if it's actually happening.
- **Needs:** onboarding steps and client responsibilities; sample report (anonymized); after-hours policy.
- **Schema:** BreadcrumbList.

### Keep / Upgrade / Replace (`/keep-upgrade-replace/`)
- **Purpose:** the signature interaction and a genuinely useful standalone page.
- **Sections:** static explanation of the three verdicts (in HTML without JavaScript) → tool tab → self-check tab → how ITKeepers uses this in practice → CTA.
- **Claims:** illustrative advice only; no prices, scores or savings; disclosure of hardware margin once decided.
- **Needs:** engineer-approved thresholds.

### Contact (`/contact/`)
- **Purpose:** the conversion page.
- **Sections:** short form (name, work email, service of interest, message) → who answers and what happens next (only what's true) → phone and address (verified) → optional pre-fill note when arriving from a tool.
- **Needs:** legal entity, verified phone/email/addresses, form destination, and who responds. Confirm before promising "an engineer will reply" or "no sales call."
- **Privacy:** privacy notice link, minimal data, retention policy.

### Managed IT (`/managed-it/`)
- **Purpose:** explain the everyday service: helpdesk, monitoring, maintenance, patching, reporting.
- **Sections:** what's covered → how a request is handled → who you talk to → monthly reporting → co-managed option (**only if actually offered**) → FAQ → CTA.
- **Claims:** "prioritized quickly, normally answered within minutes" only as approved wording; no SLA numbers.

### Microsoft & Cloud (`/microsoft-cloud/`)
- **Purpose:** the strongest technical area.
- **Sections:** Microsoft 365 administration → identity (Entra ID, MFA, Conditional Access) → device management (Intune, onboarding flow) → email and collaboration → licensing sanity checks → FAQ → CTA.
- **Claims:** no partner status, certifications or badges without proof and permission. Don't say every client has every license.
- **Schema:** Service, BreadcrumbList.

### Cybersecurity (`/cybersecurity/`)
- **Purpose:** security as a maintained system, not a product.
- **Sections:** layers (identity, endpoint, network, operations, recovery) → baseline plus client-specific configuration → monitoring and alerting → how we respond → FAQ → CTA.
- **Claims and safety:** describe **tool categories**, not named products, on the public page, because naming your RMM and controls helps attackers. Name specific tools under NDA. No "complete protection," no compliance claims.
- **Schema:** Service, BreadcrumbList.

### Backup & Recovery (`/backup-recovery/`)
- **Purpose:** the third strongest area.
- **Sections:** how backups are monitored → daily checks → what a *tested* restore means → recovery planning → connectivity and power (recommend a backup connection; specialists handle electrical work) → FAQ → CTA.
- **Claims:** don't say "tested recovery" unless restore testing is real. No RTO/RPO or retention numbers without confirmation.
- **Optional:** the phishing-related recovery as an anonymized case, only after details are verified and permission is given.

### Team (`/team/`)
- **Purpose:** put faces behind "a team."
- **Sections:** how the team works (broad responsibilities with specialists) → Lebanon and US coverage → engineers (names, roles, photos) → leadership → escalation.
- **Claims:** don't present six specialties or six job titles unless verified.
- **Needs:** approved names, roles, photos and a leadership bio. **This page waits on those inputs.**

### Networks & Infrastructure (`/networks-infrastructure/`)
- **Purpose:** firewalls, switching, servers, cabling, and the inherited-environment problems you commonly find.
- **Sections:** what's covered → firewall and DNS filtering → server and network standards → documentation of IP and VLAN maps (never real data) → FAQ → CTA.
- **Needs:** confirmed scope. Don't imply universal failover or segmentation.

## 4. SEO and technical rules (all pages)

- One H1 per page, logical headings, semantic landmarks, descriptive link text.
- Final content present in HTML (static or prerendered); no counters that start at 0.
- Unique titles and descriptions, canonical URLs, sitemap, intentional indexing rules.
- **Redirects:** audit the current site's URLs (for example `/solutions/2`) and map each to its replacement before launch.
- Crawler policy: see draft `docs/drafts/robots.txt` and the approved deployed policy (allow search and retrieval bots; training crawlers are a business decision).
- Confirmation pages: `noindex` via meta tag, not `Disallow`.
- Site security headers and email authentication (SPF, DKIM, DMARC) as visible hygiene.

## 5. Fixes for the current concept (before building pages)

1. Contrast: scope heading and body colors per section theme; nothing near-black on navy, and no pale text on light grey.
2. Remove the floating "scroll down" circle that overlaps content.
3. Consolidate the small fine print into one "Illustrative" badge and one explanation on How We Work.
4. Add a real-photo team strip and remove the "Refined concept" banner in production.
5. Alternate light and dark sections deliberately.
6. Reword the two internal-caveat lines (restore testing, 24/7) into the approved positive framing.

## 6. Build order

1. Confirm blocking inputs (section 7).
2. Design system and fixes (colors, type, spacing, components).
3. Home, How We Work, Keep / Upgrade / Replace, Contact.
4. Service pages (Managed IT, Microsoft & Cloud, Cybersecurity, Backup & Recovery).
5. Team and Networks when approved inputs are ready. Privacy before inquiry collection, conditional Terms and real HTTP 404 handling are release-foundation work alongside Phase 1.
6. Redirect map, structured data, accessibility and performance audit, security headers, launch checklist.

## 7. Open inputs that block content

- Competition rules, deadline and required format (if this is entered in the challenge).
- Primary buyer and geography (Lebanon vs US), plus language plan (Arabic/RTL).
- Legal company name, addresses, phone, email, form destination and inquiry owner.
- Approval to publish scale figures; team names, roles and photos; leadership bio.
- After-hours policy and the support commitments you're prepared to make.
- Whether restore testing and formal reviews are (or will be) real.
- Actual scope for Networks & Infrastructure, and whether co-managed IT is offered.
- Existing site URLs, hosting, DNS ownership and deployment workflow.
