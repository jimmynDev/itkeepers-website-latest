# ITKeepers V2 — targeted Claude audit refinements

Date: 23 October 2026 (Asia/Beirut). Local candidate on `codex/v2-prompt3-restored`, based on `v2-phase9-release-2026-10-23` / `7908e1aaf906c231e7bc9137396d2c53142f9e4d`.

Requested safe local improvements are complete. No deployment, commit, tag, push, merge, DNS or Cloudflare configuration action was performed. This was a targeted refinement and regression pass, not another general audit. Prior uncommitted work was snapshotted and preserved.

## Changes and before/after evidence

| Area | Release baseline | Local candidate |
| --- | --- | --- |
| Homepage title | ITKeepers \| Managed Service Provider in Lebanon | **Managed IT, Cybersecurity & Cloud in Lebanon \| ITKeepers** |
| Homepage description | ITKeepers is a Lebanon-based MSP offering Managed IT with familiar engineers, shared context and a team behind ongoing business IT. | **ITKeepers provides managed IT services, cybersecurity, Microsoft 365, networking and backup for businesses in Lebanon, backed by proactive engineering.** |
| Social image | Original transparent logo, 1747×289; `twitter:card=summary` | Branded PNG, **1200×630**, 33,682 bytes; `summary_large_image`; correct absolute image URLs, MIME, dimensions and descriptive alt text on all 20 pages |
| Accessible homepage H1 | Exact static heading outside the rotating visual text | **Unchanged:** “Your IT person is a team.” No contamination found; no hero code or animation changes needed |
| Managed IT disclaimer | Same scope/coverage/response sentence appears twice | Appears **once**, in the shared service-scope section |
| Managed IT explanations | Generic ownership/escalation/documentation paragraphs; circular “IT Services” subheading | Specific assessment, ticket assignment, investigation, escalation, restoration/follow-up, monitoring, maintenance, records and reporting; “Monitoring & Triage” replaces the circular subheading |
| Navigation | “Digital” category and “Explore Digital Services” | “Web & Hosting” and “Explore Web Design & Hosting”; original six categories, destinations, IDs and concise working labels retained |
| Contact | “Send us a message”; “Write to us.”; generic introductory text | “Prepare an email”; “Email our team”; clear email-app/copy-address and phone-app instructions; helper/status explicitly says nothing is sent by this website |

Search, Open Graph and Twitter titles/descriptions agree. The existing homepage WebSite schema description automatically follows the requested description. Staging output retains the current workers.dev canonical origin; the established production-build configuration was not changed.

Machine-readable comparison: [content evidence](<C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v2-claude-refinements-evidence/content-evidence.json>). Screenshots: [desktop before](<C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v2-claude-refinements-evidence/before-home-1440.png>), [desktop after](<C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v2-claude-refinements-evidence/after-home-viewport-1440.png>), [mobile before](<C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v2-claude-refinements-evidence/before-home-390.png>), [mobile after](<C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v2-claude-refinements-evidence/after-home-viewport-390.png>), [Managed IT before](<C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v2-claude-refinements-evidence/before-managed.png>), [Managed IT after](<C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v2-claude-refinements-evidence/after-managed-1440.png>), [Contact before](<C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v2-claude-refinements-evidence/before-contact.png>), [Contact after](<C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v2-claude-refinements-evidence/after-contact-1440.png>).

## Share image and preview

[New image](<C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v2-mega-navigation/public/assets/itkeepers-og.png>) uses the existing approved transparent logo without altering its source, the site's navy/cyan palette and the exact approved homepage heading. Decorative rings echo existing site artwork. No client mark, metric, office, certification, guarantee, stock photography, tracking URL or new brand claim was added.

[Local preparation script](<C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v2-mega-navigation/scripts/prepare-social-image.mjs>) uses existing installed Sharp and Arial; run `node scripts/prepare-social-image.mjs` from the repository with Node 22 and Arial available. The PNG is included in `public/`, so ordinary builds do not require running this preparation step. No dependency or lockfile change was made.

- Image SHA-256: `cd8ef908bb5e400f5d2534967652c71e9d9c2cf53333026e6f1b9242109064a9`.
- PNG signature/IHDR dimensions, built asset existence, `image/png` response, absolute URL origin and matching OG/Twitter metadata pass on all 20 pages.
- [Rendered local card preview](<C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v2-claude-refinements-evidence/local-share-card-preview.png>) and full-size PNG were visually inspected: logo and heading are legible, uncropped and correctly proportioned. The preview is an illustrative local rendering of the actual metadata, not a certified external platform rendering.
- Image dimensions/type/alt fields follow the [Open Graph protocol](https://ogp.me/). No social handle was fabricated.
- **Not performed:** external X/Facebook/LinkedIn fetch/debugger verification. The candidate is unpublished, so public scrapers still see the Phase 9 release. Their cache/rendering can only be checked after a separately authorized publication.

## Hero accessibility evidence

Baseline desktop/mobile sampling captured 262 `textContent`/`innerText` observations at each width over 21 seconds, including all six visual phrases. The browser accessibility tree and exact heading locator resolve one level-one heading named “Your IT person is a team.”

After the refinements, 135 additional samples across 1440px and 390px check **textContent, innerText and the browser-computed accessible H1 name together** through full cycles longer than 21 seconds. All six visual states are observed at each width: team, support, cloud, security, automation and digital. The heading name never changes. The DOM heading outline is recorded; static SEO checks find one H1 and no skipped heading levels. Reduced-motion and JavaScript-disabled checks retain the exact H1. Focus/hover/offscreen lifecycle unit regressions pass.

The fixed H1 and rotating visual spans were already correctly separated. Their source and controller remain byte-identical to the release baseline. A browser screen-reader name check is not a complete physical screen-reader test. Evidence: [baseline samples](<C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v2-claude-refinements-evidence/before-browser.json>) and [final browser evidence](<C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v2-claude-refinements-evidence/browser.json>).

## Managed IT: evidence and limits

Copy uses the existing project brief §§3–4, qualified operations entries `V2-OPERATIONS-01/02`, and restore-testing confirmation `V2-P42-RESTORE`. These are owner/employee-reported project evidence, not independently audited service measurements. The current request authorizes local clarification; it does not authorize a deployment.

| New explanation | Project evidence and wording limit |
| --- | --- |
| Assessment → ticket → assigned engineer → investigation/follow-up | Brief §3 monitoring and incident workflow; existing approved qualitative operations sequence. No automatic incident/ticket for every signal or measured response time is promised. |
| Phone/email requests; serious incidents may take priority | Brief §3 incident intake and prioritization. No staffed desk, always-available engineer or queue-time guarantee. |
| Escalation when another engineer is better suited or investigation is unresolved | Brief §3 escalation and recurring-issue handling. No fixed escalation timer or staffing number. |
| Restoration/workaround may precede remediation | Brief §3 serious incidents. No recovery-time or guaranteed-resolution statement. |
| Monitoring/security alerts, backup status and open work reviewed in context | Brief §3 proactive monitoring and operations. No daily start time, universal prevention or human 24/7 claim. |
| Patch/security-update status, failed jobs and outstanding maintenance tasks | Brief §§3–4 operations/security/reporting plus existing review explanations. Actual scope and maintenance arrangements remain agreement-dependent; no patch cadence. |
| Shared device/user/network/license records; reporting on patches/backups/security/devices/recommendations | Brief §4 documentation and reporting. No perfect handover, portal inclusion, report-field guarantee or reporting cadence. |
| Routine restore tests | Existing approved paragraph retained verbatim, with agreed scope and recovery-objective qualification; no new restore claim. |

The internal management tools named in discovery were not added to public copy. Existing subarea IDs and the Service Desk navigation anchor remain valid. Shared service templates, animations, illustrative storage-warning scene and Pulse development/sample-data qualification are retained.

## Navigation, contact and schema verification

All seven service destinations are visible in the appropriate expanded desktop and mobile menus: Managed IT, Microsoft 365 & Cloud, Cybersecurity, Backup & Recovery, Networking & Infrastructure, AI & Automation, Web Design & Hosting. Desktop Enter/Escape activation, collapse and focus return pass. Mobile category expansion and all seven visible destination links pass. With JavaScript disabled, keyboard activation of IT Services reaches the service hub and its seven service links. No navigation-controller change was needed.

Contact links still target `tel:+96181816761` and `mailto:info@itkeepers.com`. Form headings/helpers and invalid-field feedback explain the email-app handoff. Browser invalid submission focuses the first required field and sends no POST. Existing tests cover mailto composition, validation, unsafe recipient/header injection, failure behavior and disabled API/delivery paths. No actual phone call, email-app send, inquiry submission or email delivery was attempted.

Schema was inspected before adding anything. **No entity or schema block was added.** Before and after there is one Organization per page, one graph per page, seven Service entities and seven BreadcrumbLists overall; the same single WebSite, single WebApplication, single DigitalDocument and three Article entities remain. There is no LocalBusiness schema to duplicate. All graph data is unchanged except the homepage WebSite description, which follows the requested metadata. No address, geo, office location, opening hours, certification, Review or AggregateRating was invented. [Schema comparison](<C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v2-claude-refinements-evidence/content-evidence.json>) records the counts and exact diff.

## Validation results

| Check | Result | Evidence |
| --- | --- | --- |
| TypeScript | PASS | `npm run typecheck`, [log](<C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v2-claude-refinements-evidence/types.log>) |
| Production build | PASS | `npm run build`, [log](<C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v2-claude-refinements-evidence/build.log>) |
| Staging build and origin/indexing comparison | PASS | `npm run build:staging`; `npm run check:staging`, [build log](<C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v2-claude-refinements-evidence/staging-build.log>), [comparison log](<C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v2-claude-refinements-evidence/staging-check.log>) |
| Regression/security unit suite | PASS **191/191** | `node --test tests/*.test.mjs`, [log](<C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v2-claude-refinements-evidence/tests.log>); three new semantic social-image/H1/scope-boundary regressions; old metadata/contact/nav expectations updated |
| Generated SEO checks | PASS, zero failures/warnings | 20 pages, unique metadata, one H1, headings, internal links, canonical/social URLs, schema and sitemap; [JSON](<C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v2-claude-refinements-evidence/seo.json>) |
| Public-output/credential-pattern security scan | PASS, zero findings | 110 generated files, [JSON](<C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v2-claude-refinements-evidence/security.json>) |
| Dependency security check | PASS, zero advisories | `npm audit --json`, [log](<C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v2-claude-refinements-evidence/npm-audit.log>); no dependency changes |
| Local Worker HTTP regressions | PASS **264 checks** | All 108 directly served file hashes, 20 pages, 28 redirects including query/target cases, security/cache headers, HEAD/304, private-file 404s, true 404 and disabled APIs; [JSON](<C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v2-claude-refinements-evidence/http-local.json>) |
| Accessibility | PASS for automated checks run | axe WCAG A/AA/2.1 AA: zero violations on Home/Managed IT/Contact at 1440/390px; H1 name/text/outline and keyboard checks as above |
| Browser/reflow | PASS within tested coverage | Six main layouts plus nine additional reflow cases at 320/1439/1600px, all seven services on both menus, reduced motion, JavaScript-disabled direct contact/hub fallback and local share preview; zero page/CSP-console errors and zero browser POSTs |
| Preservation | PASS | 287 starting files snapshotted; only intended source/test/journal changes; HEAD/branch/index unchanged; [manifest/check](<C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v2-claude-refinements-evidence/preservation.json>) |

The initial mobile axe snapshot sampled the existing “All under one roof.” fade mid-transition. The final check lets that reveal settle (computed opacity 1; cyan `rgb(56,189,248)` over `rgb(8,19,33)`) and passes without changing the animation. axe still lists manual contrast-review items involving complex/animated surfaces; zero automated violations does not certify full WCAG conformance. Hero sampling uses a fresh visible viewport because offscreen inspection correctly pauses its controller. JavaScript-disabled fallback uses real keyboard activation; automated click-stability waiting was unsuitable in that emulated context.

**Preserved:** seven services; 15 staging indexable pages; five noindex holds (Privacy, blog index and three legacy articles); workers.dev canonicals; all 28 redirects; security/CSP/cache controls; exact hero metrics and four testimonials; disabled collection/delivery; public AI Governance PDF. PDF remains 190,729 bytes, SHA-256 `bf8c6143016208502bf1ef30019d6d275ad1c4dde407f6740e430f0de33874b9` in source, build and local HTTP response. No PDF bytes, metadata, publication access or download links changed. Privacy/article sources and publication policy remain unchanged.

The candidate has 110 generated files versus 109 in the baseline: one new PNG plus ordinary replaced fingerprinted Contact CSS and inquiry JavaScript. All 20 HTML files differ because the shared image metadata and navigation label apply site-wide; these are expected changes, not twenty page rewrites. Build/dependency directories and private evidence were not added to the public artifact.

## Owner evidence checklist: five operating claims

Current owner-approved wording and Phase 9 preservation authorization remain in force. **Approval to retain a statement is separate from independently substantiating it.** None of the following statements was altered, removed or repurposed as schema. Store evidence privately; record responsible approver, verification date, exact allowed wording and next review date in the claims register.

| Status | Exact public statement / claim reference | Evidence to supply or confirm | Responsible owner |
| --- | --- | --- | --- |
| ☐ Open substantiation | “15+ years” / Experience; `P3-HERO-PROOF-01` | Define company history versus individual/team experience; dated employment/company records supporting that definition. Do not infer a founding year. | CEO / business owner |
| ☐ Open substantiation | “50+” / Clients supported; `P3-HERO-PROOF-03` | Dated, deduplicated active-client count; definition of client and inclusions/exclusions; confirm current threshold and review date. Brief's approximately 50 is employee-reported. | Operations / account owner |
| ☐ Open substantiation | “1,500+” / Endpoints managed; `P3-HERO-PROOF-04` | Dated deduplicated managed-device inventory and endpoint definition. Separate devices/users/servers; reconcile the older brief's approximately 1,500 users / 2,000 endpoints with the later explicitly approved endpoint wording. | Operations / engineering lead |
| ☐ Open substantiation | “2 locations” / Lebanon & USA; `P3-HERO-PROOF-05` | Confirm what “locations” means and evidence of country presence; clarify remote staff, service coverage, office and legal entity distinctions. No public street address or two-office claim is inferred. | CEO / operations |
| ☐ Open operational confirmation | “24/7” / Automated Monitoring; `BusinessValue.astro`, Brief §3 | Confirm continuous automated monitoring scope, systems/clients covered, alert routing and exceptions. Existing discovery supports automation qualitatively, not audited coverage/uptime. Human rota and after-hours commitments require separate evidence before any expanded promise. | Engineering / operations |

## Owner evidence checklist: four testimonials

Exact excerpts/company attributions were owner-supplied on 13 October; current release preservation was authorized on 23 October. No person, job title, customer logo, rating, measurable performance result or new testimonial media was added. Owner authorization is recorded; underlying customer-origin records and publication permissions have not been independently supplied/verified.

For **each** row, obtain: ☐ original dated message/document; ☐ confirmation of accurate exact excerpt and attribution; ☐ permission from an authorized customer representative for public website use of this text and company name; ☐ rights/scope, approver/date and withdrawal/review contact recorded privately. This does not request or assume rights to logos, names of individuals, videos or expanded uses.

| Status | Customer / register ID | Exact approved excerpt to match against evidence |
| --- | --- | --- |
| ☐ Open evidence/permission record | Slide Designers / `V2-QUOTE-SLIDE` | Amazing service! The team is fast, reliable, and always ready to help. They make IT simple and stress-free — highly recommended! |
| ☐ Open evidence/permission record | PFC International SAL / `V2-QUOTE-PFC` | Beyond their reliable support, ITKeepers has played a key role in integrating advanced AI tools into our systems, significantly boosting our efficiency and productivity. |
| ☐ Open evidence/permission record | International Maritime Academy / `V2-QUOTE-IMA` | The team is professional, responsive, and always ready to support with tailored solutions. I've appreciated the smooth communication and the consistency in delivering what we need. |
| ☐ Open evidence/permission record | MSAD — Customs Clearance Agency / `V2-QUOTE-MSAD` | Their swift response to any emergency - even to the slightest issue - proves how professional and dedicated the team is. |

PFC's efficiency/productivity and MSAD's emergency-response wording remain attributed client statements; they are not generalized ITKeepers outcome, SLA or availability guarantees. The original data file is byte-identical to the baseline.

## Remaining decisions and recommended next actions

1. **Highest impact — owner evidence:** complete the five claim and four testimonial records above. Any proposed changes to those approved public statements require separate owner approval; no wording change is pre-authorized by this report.
2. **Release decision:** owner reviews the local candidate, new branded image and service/contact wording before separately authorizing any deployment or Git commit. The current instruction expressly prohibits both; no commands performing them ran.
3. **After an authorized deployment:** verify the actual public image fetch/metadata and external social-card cache/rendering. Current evidence verifies local output and browser rendering only.

No further safe local implementation is blocked. Privacy/article indexing holds, backend/delivery enablement and wider publication-rights decisions remain outside this refinement. The PDF retention decision is already closed by explicit owner approval and is not reopened here.

Last deployment recorded by Phase 9: personal Worker version `28243d90-b52f-49d5-bd03-6f4de33d7fbf`; no Cloudflare read/write operation was needed or performed in this task. This local candidate has **not** replaced that release. Existing release tag/HEAD/index and every unrelated starting file are preserved.

Changed implementation: `src/data/seo.ts`, `src/layouts/Base.astro`, `public/assets/itkeepers-og.png`, `scripts/prepare-social-image.mjs`, `src/pages/services/managed-it.astro`, `src/data/managed-services.ts`, `src/data/navigation.ts`, `src/pages/contact.astro`, `src/components/InquiryForm.astro`, `src/scripts/contact-form.ts`. Regression updates/new coverage: `tests/seo.test.mjs`, `tests/free-it-review.test.mjs`, `tests/mega-navigation.test.mjs`, `tests/phase-two-cleanup.test.mjs`, `tests/claude-refinements.test.mjs`. Owner journals were appended without rewriting prior entries. Full evidence remains outside the public repository build in [private evidence folder](<C:/Users/Jim/Documents/ChatGPT/ITKeepers Website/outputs/v2-claude-refinements-evidence>).
