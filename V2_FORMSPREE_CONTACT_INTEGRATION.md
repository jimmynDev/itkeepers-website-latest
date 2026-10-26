# ITKeepers — Formspree contact integration

23 October 2026. **Local implementation and automated regression gates PASS. Not deployed or committed. Actual inbox delivery awaits the owner's manual test.**

Preview is running at **http://127.0.0.1:4394/contact/**. The second form is on the homepage at http://127.0.0.1:4394/ under **Book your free IT review**. The existing public Worker is unchanged by this task.

## Changes and before/after evidence

| Area | Before | Local result |
| --- | --- | --- |
| Submission | Mailto-only handoff; website did not submit | Both existing forms POST directly to the owner-provided `https://formspree.io/f/mrppzvpo`, using AJAX FormData, HTTPS and `Accept: application/json` |
| Fields | Existing contact fields, intent and optional service chips | Same fields/order/validation/responsive form; name, email, company, phone, message, validated repeated interests and readable `services` mapped explicitly; fixed inquiry subject/context; no visitor-controlled recipient/redirect |
| Feedback | Email-app instructions | Sending state, duplicate lock, accepted state only after recognized successful provider response; field errors, spam/verification, unavailable form, rate limit, malformed response, network failure and timeout handled without asserting delivery |
| Retained details | Existing inputs | Values remain after error or acceptance; accepted form stays locked until edited; no automatic retry; uncertain outcomes advise checking before resending |
| Spam | Disabled backend verification path | Supported `_gotcha` honeypot; provider protections remain in control; explicit hosted verification button when appropriate, never a CAPTCHA bypass |
| No JavaScript | Direct email alternative | Native HTTPS POST with browser validation, labelled service checkboxes and provider-hosted confirmation; email and phone also remain available |
| Privacy | Deployed copy described the previous disabled collection flow | Both local forms disclose Formspree processing and link to a clearly labelled Privacy draft; no final legal policy or general-public approval inferred |
| CSP | Same-origin connections/forms | `connect-src 'self' https://formspree.io/f/mrppzvpo`; `form-action 'self' https://formspree.io` for native hosted verification/confirmation redirects; other directives and security controls preserved |

AJAX recognizes Formspree's current `next` success contract and successful `ok` responses; rejects error-bearing, verification, malformed or unknown responses. It never follows response URLs. Provider errors are inserted as text, not HTML. Requests omit credentials, reject redirects, time out after 15 seconds and have no automatic retries. The form does not promise inbox arrival. Direct email remains `info@itkeepers.com`; telephone remains `+961 81 816 761`.

Native fallback retains field names and repeated `interests` values. AJAX additionally supplies readable service labels. The native route leaves the site for Formspree; provider account activation, hosted checks, acceptance and notification delivery remain controlled by Formspree. Account recipient, rules, spam settings, quotas and domain restrictions were not inspected or changed.

Primary implementation: `src/data/formspree.ts`, `src/components/InquiryForm.astro`, `src/scripts/contact-form.ts`, `src/styles/inquiry-form.css`, `public/_headers` and local draft `src/pages/privacy.astro`. Related build/check assertions and regression tests were updated. Architecture and processor decision: `docs/adr/2026-10-23-formspree-local-contact.md`.

## Validation results

| Gate | Result |
| --- | --- |
| TypeScript | `npm run typecheck` PASS |
| Standard and staging builds | `npm run build`, `npm run build:staging`, `npm run check:staging` PASS |
| Complete test suite | All 199 tests PASS, including eight new provider/payload/security/native-form tests |
| Dependency audit | `npm audit --json`: zero vulnerabilities; package/lockfile unchanged, no dependency added |
| Generated-output security | `python scripts/audit-security.py dist-staging …`: zero findings; private files excluded |
| SEO | `python scripts/audit-seo.py dist-staging … <existing Worker origin>` PASS; all 20 pages' title/description/robots/canonical/social metadata match the starting build |
| Local Worker HTTP | 266 checks PASS: 20 routes, 15 indexable/five holds, sitemap/canonicals/robots, 28 redirects with query preservation, security headers, private-file 404s, disabled APIs, HEAD/304 and immutable cache guards |
| Served build identity | All 108 served artifact files match the validated manifest by SHA-256; `_headers` and `_redirects` are configuration, not public assets |
| Mocked browser scenarios | All 17 PASS; zero automated real provider submissions, page errors or unexpected external requests |
| Accessibility/reflow | axe WCAG 2 A/AA and 2.1 AA checks on Home, Contact and Privacy at 1440/390: zero automated violations; no horizontal overflow; keyboard submission/service selections and first-invalid-field focus verified |
| Visual review | Desktop and mobile Contact screenshots reviewed; established layout, typography, colors, controls and responsive arrangement preserved |
| PDF preservation | Public download remains 200/application/pdf, SHA-256 `bf8c6143016208502bf1ef30019d6d275ad1c4dde407f6740e430f0de33874b9`, byte-identical |

Browser scenarios cover required-field validation, exact mapping and loading, duplicate lock, accepted-value retention/editing, current next-only acceptance, 422 errors, 403 spam verification, JSON and HTML 429 limits, 500 failure, inactive form, HTML challenge, malformed JSON, network/timeout failure, provider error markup escaping, compact homepage intent and native hosted/no-JavaScript submissions. **All provider POSTs, including native submissions, were intercepted and mocked. No automated live submission, email or inbox check occurred.** Automated axe results do not constitute a full manual screen-reader/device certification.

Private evidence is preserved outside the site/repository in sibling `../v2-formspree-evidence/`: gate logs/results, browser JSON/screenshots, HTTP results, validated artifact manifest, preservation manifest and the original work snapshot. No screenshots, private reports, credentials, generated audit bundle or test payload logs were added to public assets.

## Source and scope preservation

Branch remains `codex/v2-prompt3-restored`; HEAD remains `e34b69b1f4288e5fcc6c80b1a6c70519c4d9ff94` (previous Claude release). Index remains empty. No Git commit, tag, push, merge, reset, clean, stash or discard operation occurred.

All 292 starting files were accounted for: 282 are byte-identical, and ten contain only the intended integration/build assertions/test/journal changes. Both existing journal byte prefixes are preserved. Original private evidence and audit ZIP are unchanged. New files are the provider helper, provider tests, processor ADR and this report. Original work and the previous built artifact were snapshotted before editing.

Worker sources/configuration, package/lockfile, seven services, navigation, animations, exact accessible H1, business metrics, testimonials, social image, SEO data, redirect and indexing policies are unchanged. The PDF is unchanged. No backend, database, API key, third-party script or new dependency was introduced. Both `/api/contact` and `/api/inquiry` still return 503 on POST and 405 on GET/OPTIONS, without collection or email delivery. The separate direct Formspree path is enabled in this local preview for the requested manual test.

## Manual email-delivery test

1. On this computer, open **http://127.0.0.1:4394/contact/** in your normal browser. The preview is unmocked; submitting here contacts the real owner-specified Formspree endpoint.
2. Enter your own name and a real reply email; company/phone are optional. Open **Add details (optional)** and select two services so mapping can be checked. Use a harmless unique message such as `ITKeepers manual Formspree test — 2026-10-23 [current time]`. Do not include passwords or sensitive client information.
3. Click **Send my message** once. Expect **Sending…**, followed by **Formspree accepted your message. Thank you.** only if the provider confirms acceptance. If verification is required, use **Continue on Formspree** and complete the provider's hosted check. This explicit action posts the retained details; the website does not automatically retry.
4. Check Formspree's Submissions view and your configured recipient inbox, including junk/spam. Confirm the unique message, sender/reply email, company/phone and both service selections. Provider acceptance and actual inbox arrival are separate outcomes.
5. If delivery does not arrive, record the visible response and whether the provider shows the inquiry. Check recipient verification/notification routing, activation, domain restrictions, account limits and spam rules in Formspree before resending. No DNS or Microsoft 365 change is part of this test; do not disable spam protection to force a result.

If JavaScript is disabled, the same primary button posts natively and the provider supplies its own confirmation/check page. The phone/email alternatives stay usable. The preview process must remain running; it is local to this computer and is not a public deployment.

## Remaining owner decisions and release verdict

- **Manual delivery verification:** actual provider/account acceptance and inbox arrival remain unverified until the owner performs the test above. The provided form ID does not expose or establish the destination inbox in this source.
- **Privacy before general public use:** approve the final legal identity/contact, processing purpose, Formspree/provider/subprocessor handling, retention/deletion, international processing, rights and related notice wording. Current `/privacy/` is a noindex draft, not an approved policy; noindex is not access control.
- **Any deployment or commit:** separately authorize after the manual test and Privacy review. This task performs neither. Existing metrics/testimonial evidence approvals are unchanged and are not reopened or silently resolved.

**Verdict: ready for the requested local manual delivery test; public release withheld.** No Cloudflare configuration, deployment, official-domain, DNS or Microsoft 365 operation occurred.

## Provider references

Implementation was checked against primary provider documentation: [AJAX forms](https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax), [special fields](https://help.formspree.io/articles/building-your-form/special-fields), [honeypot protection](https://help.formspree.io/articles/building-your-form/honeypot-spam-filtering), [limits](https://help.formspree.io/articles/form-and-project-settings/system-limits), [current response contract](https://github.com/formspree/formspree-js/blob/main/packages/formspree-core/src/submission.ts), [hosted spam verification](https://help.formspree.io/articles/form-and-project-settings/recaptcha-settings/) and [Privacy Policy](https://formspree.io/legal/privacy-policy/). Provider documentation does not verify this owner's notification/account configuration.
