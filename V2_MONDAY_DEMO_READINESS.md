# ITKeepers — Monday 26 October 2026 demo readiness

**Local preparation: PASS. Public release: HOLD — exact Privacy wording approval required.**

This is the public competition preview on the owner's personal Worker, not the official ITKeepers production launch. Prepared 24 October 2026, Asia/Beirut. No deployment, additional real inquiry, new commit, tag change, push, merge, DNS, Microsoft365, official mailbox configuration, Natural Touch/JIVON, other Worker or security-setting change occurred.

## Exact public wording for owner approval

This candidate supersedes the earlier “configured ITKeepers notification inbox” wording. The owner states that notification delivery is currently to a **temporary administrator-managed inbox**. The account destination itself was not changed. Prior owner confirmation of local delivery remains valid evidence; no additional live submission was sent.

### Disclosure on both forms

> We use your details to respond to your inquiry. Formspree processes your submission for delivery to a temporary administrator-managed inbox for this competition preview, not an officially configured ITKeepers mailbox. Read our Privacy notice.

“Privacy notice” links to `/privacy/`.

### Full proposed Privacy page

### Privacy matters.

This is a public competition preview of ITKeepers V2, not the official ITKeepers production launch. This notice covers inquiries sent through the preview's contact and free IT review forms.

#### Information you submit

The forms collect your name and email address, any company or phone details you choose to provide, your message or free IT review request, and any selected service interests. Please do not submit passwords or confidential technical information.

#### Purpose and delivery

During this competition preview, the website administrator uses these details to respond to your inquiry and discuss the services or free IT review you request. Formspree is our external form-processing provider. It processes submissions for delivery to a temporary administrator-managed inbox and applies its spam protections. This is not an officially configured ITKeepers mailbox. Website acceptance confirms provider acceptance, not that an email has reached the inbox or been read.

#### Provider processing and retention

Formspree may store submissions and process technical information, such as IP address and browser details, to operate and protect its service. Formspree describes processing in the United States and other countries where it operates.

How long Formspree makes submissions available depends on the account plan; its Privacy Policy describes additional retention for service, security and legal purposes. Copies delivered by email are retained separately in the temporary administrator-managed inbox. See Formspree's Privacy Policy and its submission archive information.

#### Privacy questions and requests

For questions about your inquiry or to request access, correction or deletion, email info@itkeepers.com. You can also use this address to contact ITKeepers directly instead of submitting a form.

Provider links remain [Formspree's Privacy Policy](https://formspree.io/legal/privacy-policy/) and [submission archive information](https://formspree.io/plans/). Privacy requests link to the existing approved `mailto:info@itkeepers.com` contact. That direct-contact alternative is distinct from the temporary Formspree notification destination; no official ITKeepers mailbox configuration or mail routing is changed.

**Owner approval of both the disclosure and full Privacy wording above is PENDING.** Preview scope and temporary recipient are owner-supplied facts. Provider handling/retention statements retain the previously verified policy/plan basis. No inbox address, fixed retention/deletion deadline, compliance claim, legal basis or legal approval is invented. Removing local draft labels in the prepared UI does not represent approval. `/privacy/` remains one of five noindex holds.

Review locally: http://127.0.0.1:4394/privacy/ and http://127.0.0.1:4394/contact/. No further real submission is needed during review.

## Local readiness results

| Check | Result |
| --- | --- |
| Complete automated tests | **200/200 PASS** |
| TypeScript, production/staging builds and staging comparison | **PASS** |
| SEO/security scans and npm audit | **PASS**, zero security findings/vulnerabilities; all 20 pages' metadata preserved |
| Provider behavior | **18 mocked scenarios PASS**, including acceptance/rejection, invalid fields, concurrent duplicates, spam verification, JSON/HTML rate limits, timeout/failure and no-JavaScript native fallback |
| CSP | **PASS**, exact Formspree endpoint allowed; other Formspree paths blocked by enforced `connect-src`; provider native confirmation/verification uses the existing narrowly scoped form-action origin |
| Accessibility/mobile reflow | **Six axe layouts PASS**, Home/Contact/Privacy at 1440/390; zero automated violations; keyboard/error focus and visible disclosure retained |
| All-page browser regression | **60 checks PASS**, all 20 routes at 1440/390, all seven service animation lifecycles, four testimonials, PDF downloads and 404/direct-contact recovery |
| Menus and hero | **PASS**, all seven services discoverable in desktop/mobile menus; desktop Enter/Escape/focus behavior; all six hero animation states observed at both widths while H1 textContent, innerText and computed accessible name remain exactly “Your IT person is a team.” |
| Local Worker HTTP | **268 checks PASS**, 20 routes, 15 indexable/five holds, all 28 redirects/query preservation, sitemap/canonicals, disabled APIs, security/private-file protection, immutable asset caching, HEAD/304 |
| Served artifact identity | **108 served hashes match** the validated 110-file artifact; configuration files remain non-public |
| PDF | Public 200/application/pdf, 190729 bytes; unchanged SHA-256 `bf8c6143016208502bf1ef30019d6d275ad1c4dde407f6740e430f0de33874b9` |
| Design/content preservation | Existing services, layout, animation code, metrics, testimonials, navigation, H1, social image, metadata, headers and redirects unchanged; only requested disclosure/Privacy wording and related assertions changed |

All automated provider submissions, including native navigation, were mocked. No new live inquiry or email was sent. Provider spam settings and the fixed endpoint `https://formspree.io/f/mrppzvpo` are unchanged; `/api/contact` and `/api/inquiry` remain disabled. No database, dependency, key or provider binding was added. Automated accessibility and local checks do not replace the post-deployment environment checks.

## Source, target and rollback

- Base commit remains `e86d5ff1f7f22ee0135d6071f8377106c0a31260`, annotated tag `v2-formspree-contact-2026-10-23`; neither history nor tag moved. Four local files contain a seven-line insertion/seven-line deletion wording/test delta. This is a validated amendment to the tagged candidate, not a claim that the original commit already contains the new wording. Exact patch and 190-input manifest are preserved in sibling `../v2-monday-demo-evidence/` along with snapshots, tests, browser captures and the new artifact manifest.
- The authorized target is only `itkeepers-v2-staging`, account `eabf58c0ea3cf8629b95c29042124f72`, existing `wrangler.staging.toml` and workers.dev URL. Current documented prior version and rollback target: `1d88e2b0-4e2c-40e0-b92a-4fe310b7beba`. No new Worker version or deployment timestamp exists for this candidate yet.
- After wording approval, recheck live account/target/current version, exact source/artifact hashes and disabled bindings, then deploy only this approved candidate. Run live HTTP/artifact checks plus intercepted provider and desktop/mobile/menu/animation checks; record the new version/timestamp. No automated real inquiries. Any critical live regression uses the previous version below.

Prepared recovery command (not executed):

```powershell
$env:CLOUDFLARE_ACCOUNT_ID = 'eabf58c0ea3cf8629b95c29042124f72'
$env:WRANGLER_SEND_METRICS = 'false'
node node_modules/wrangler/bin/wrangler.js rollback 1d88e2b0-4e2c-40e0-b92a-4fe310b7beba --config wrangler.staging.toml --yes --message 'Recover competition demo to validated Claude release'
node ../v2-formspree-release-evidence/rollback-qa/http-qa.mjs live
```

Use the previous Claude artifact manifest for rollback verification; confirm restored version and mailto-only behavior. No stateful resource migration is involved.

## One manual public delivery test — after approved deployment

Open https://itkeepers-v2-staging.jimnassar99.workers.dev/contact/. Enter your own name and real reply email, optionally company/phone, select two services and write a harmless unique `Competition preview delivery test — [date/time]` message. Submit once, complete hosted verification only if prompted, and check the provider acceptance, Formspree Submissions and **temporary administrator-managed inbox** including junk/spam. Confirm message, reply address and selected services. Acceptance alone does not prove inbox arrival. Check the dashboard before any resend; no DNS/Microsoft365 or official mailbox change is part of the test.

**Monday verdict at this checkpoint: local preparation PASS; final public presentation release pending explicit wording approval, deployment and live verification.**


## 24 October 2026 — Final request-contact wording supersedes the paragraph above

Review V2_FINAL_PRIVACY_APPROVAL.md for the exact current text. The Privacy request-contact paragraph now uses the owner's contact-form/“Privacy request” instructions because role-mailbox operation is unconfirmed. No personal inbox address is published. All other Privacy wording and the temporary administrator-managed inbox disclosure are unchanged. Local correction/tests PASS; deployment remains on HOLD until explicit approval of the final notice. No new commit, tag move, public deployment or additional live inquiry occurred.
