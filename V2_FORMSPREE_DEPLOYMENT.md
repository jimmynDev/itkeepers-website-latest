# ITKeepers V2 — Formspree release checkpoint

**LOCAL CHECKPOINT PASS — AWAITING OWNER PRIVACY WORDING APPROVAL. NOT DEPLOYED.**

Prepared 24 October 2026, Asia/Beirut. Report generated `2026-10-23T21:07:20.399241+00:00`. This is an approval checkpoint, not a completed deployment report. The owner explicitly confirms local manual inbox delivery; no additional real inquiry was sent.

## Release facts

| Item | Result |
| --- | --- |
| Branch | `codex/v2-prompt3-restored` |
| Local commit | `e86d5ff1f7f22ee0135d6071f8377106c0a31260` |
| Annotated tag | `v2-formspree-contact-2026-10-23` — verified to resolve to the commit; annotation records approval pending |
| Commit/checkpoint UTC | `2026-10-23T21:05:47.489804+00:00` (24 October in Asia/Beirut); requested tag date retained exactly |
| Previous release | `v2-claude-refinements-2026-10-23`, commit `e34b69b1f4288e5fcc6c80b1a6c70519c4d9ff94` |
| Allowed target | `itkeepers-v2-staging`, account `eabf58c0ea3cf8629b95c29042124f72`, unchanged `wrangler.staging.toml` |
| Current active Worker | `1d88e2b0-4e2c-40e0-b92a-4fe310b7beba` at 100%; deployment `d011faf2-af1c-4867-9b97-4adc4bc51ced` |
| Current deployment timestamp | `2026-10-22T22:45:31.793341Z`  / 23 October 2026 01:45:31 Asia/Beirut |
| Read-only current-state observation | `2026-10-23T21:04:07.457648+00:00` |
| New Worker version / deployment timestamp | **None: no upload or deployment performed** |
| Immediate future-release rollback target | `1d88e2b0-4e2c-40e0-b92a-4fe310b7beba` — current validated Claude release |
| Privacy approval | **PENDING. Explicit wording approval required by the owner's release request.** |
| Push / merge / additional live submissions | None |

## Exact proposed public wording — approval requested

The following text is the exact candidate for this release. Removing the previous local draft labels prepares the public-facing copy; it does **not** signify approval. The wording is visible only in the local preview until approval. The existing `/privacy/` noindex hold remains unchanged. Approval is requested for both the form disclosure and all Privacy text below, including their links.

### Disclosure on both forms

> We use your details to respond to your inquiry. Formspree processes your submission for delivery to our configured notification inbox. Read our Privacy notice.

“Privacy notice” links to `/privacy/`. Existing direct email/telephone, provider-verification explanation, no-JavaScript instructions and acceptance/error messages remain as validated.

### Proposed `/privacy/` page

### Privacy matters.

This notice covers inquiries sent through ITKeepers' website contact and free IT review forms.

#### Information you submit

The forms collect your name and email address, any company or phone details you choose to provide, your message or free IT review request, and any selected service interests. Please do not submit passwords or confidential technical information.

#### Purpose and delivery

ITKeepers uses these details to respond to your inquiry and discuss the services or free IT review you request. Formspree is our external form-processing provider. It processes submissions for delivery to the configured ITKeepers notification inbox and applies its spam protections. Website acceptance confirms provider acceptance, not that an email has reached the inbox or been read.

#### Provider processing and retention

Formspree may store submissions and process technical information, such as IP address and browser details, to operate and protect its service. Formspree describes processing in the United States and other countries where it operates.

How long Formspree makes submissions available depends on the account plan; its Privacy Policy describes additional retention for service, security and legal purposes. Copies delivered by email are retained separately in the notification mailbox. See Formspree's Privacy Policy and its submission archive information.

#### Privacy questions and requests

For questions about your inquiry or to request access, correction or deletion, email info@itkeepers.com. You can also use this address to contact ITKeepers directly instead of submitting a form.

The two provider links in the retention paragraph are [Formspree's Privacy Policy](https://formspree.io/legal/privacy-policy/) and [submission archive information](https://formspree.io/plans/). The privacy-request address links to `mailto:info@itkeepers.com`, the existing approved public business contact.

### Basis and limits of this proposal

Field names/optionality, message/review intent, selected services, fixed endpoint and acceptance wording match the source. Notification inbox delivery is supported by the owner's confirmation of a successful manual local test; this report does not identify an unverified mailbox destination from the opaque form ID. Purpose text is the proposed handling for requested inquiries, not a marketing-consent or legal-basis assertion.

Provider policy confirms possible storage, technical/security processing and international handling; [Formspree's Privacy Policy](https://formspree.io/legal/privacy-policy/) describes retention exceptions. [Plan documentation](https://formspree.io/plans/) establishes plan-dependent submission archive availability. The configured account plan, precise mailbox retention and deletion workflow have not been inspected. No fixed duration, automatic deletion guarantee, unverified legal entity/address/jurisdiction, compliance assurance or approval statement is invented. Mailbox copies are explicitly separate from the provider archive. This is a narrowly scoped form notice, not an audit or legal certification of all business processing.

**Owner decision needed: approve or revise the exact disclosure and Privacy wording above for this personal Worker release.** The owner already authorizes deployment only after that approval; no additional general deployment permission is requested here.

## Implementation preserved

Both existing forms use HTTPS AJAX FormData with `Accept: application/json` to `https://formspree.io/f/mrppzvpo`. Existing fields/chips/validation, loading, duplicate locks, status focus/live announcements, truthful acceptance, field rejection, spam/verification, rate limits, unavailable-form and network/timeout handling are retained. Details remain available after failure. Native no-JavaScript POST and explicit hosted verification are retained, along with direct email and telephone links.

The `_gotcha` honeypot remains. Provider protection/settings are not changed. Narrow CSP remains `connect-src 'self' https://formspree.io/f/mrppzvpo`; native `form-action 'self' https://formspree.io` permits hosted confirmation/verification navigation. No third-party script/frame permission or wildcard is added. Browser enforcement blocks another Formspree path before network access.

`/api/contact` and `/api/inquiry` remain disabled. No backend/database/API key/dependency/extra email provider or binding is introduced. Read-only target metadata confirms only ASSETS, STAGING_HOSTNAME and the two false contact flags; workers.dev remains enabled, previews disabled, no custom domains. DNS, Microsoft365, Natural Touch/JIVON, other Workers and Cloudflare security settings are untouched.

## Final validation

| Gate | Result |
| --- | --- |
| Complete working-tree automated suite | **200/200 PASS**, including nine pre-existing private-fixture-dependent tests |
| TypeScript | `npm run typecheck` PASS |
| Standard/staging builds | `npm run build`, `npm run build:staging`, `npm run check:staging` PASS |
| Clean portable source | Fresh `npm ci --ignore-scripts`, TypeScript/build/check and **191/191 portable tests PASS**; private fixtures remain excluded/preserved |
| Reproducibility | All 190 source blobs in the commit/archive equal validated inputs; all 110 static artifacts reproduce byte-for-byte |
| npm audit | Zero vulnerabilities; package/lockfile unchanged |
| Security/SEO output scans | Zero security findings; SEO PASS |
| Local Worker HTTP | **267 PASS**,20 routes,15 indexable / five holds,28 redirects incl query/target cases, sitemap/canonicals, headers/private protection and disabled API responses |
| Served artifact identity/cache |108 served file SHA-256 matches; immutable hashed assets, private/no-store HTML/error guards, HEAD/304/cache negative controls pass |
| Provider/browser tests | **18 mocked scenarios PASS**: acceptance contracts, rejection, invalid fields, mapping, loading, concurrent duplicate lock, spam/native verification, JSON/HTML rate limiting, unavailable form, malformed/HTML response, timeout/network failure, error escaping, compact form and no-JavaScript fallback; exact-path CSP enforcement |
| Accessibility/reflow | **Six axe WCAG 2 A/AA and 2.1 AA layouts PASS**, Home/Contact/Privacy at 1440/390; zero automated violations, no horizontal overflow, keyboard controls/error focus retained |
| Route/animation browser checks | **60 PASS**, all 20 routes at 1440/390, all seven service animation lifecycles, four exact testimonial selections, actual PDF downloads, direct contacts, true 404 recovery |
| Visual inspection | Mobile/desktop candidate captures retained; Privacy mobile layout reviewed; existing form design preserved |
| H1/content preservation | Exact “Your IT person is a team.” remains; hero/animation/navigation/service/metric/testimonial source unchanged; all 20 page metadata remains identical |
| Public PDF |200/application/pdf, 190729 bytes, SHA-256 `bf8c6143016208502bf1ef30019d6d275ad1c4dde407f6740e430f0de33874b9`, byte-identical |

All automated provider submissions were mocked, including native navigation. The read-only all-route browser guard blocks external requests/POSTs. No real customer inquiry, email, CAPTCHA/account action or new live-delivery test occurred. A reused prior-release browser expectation was updated from mailto delivery to the new Formspree contract; the final route run passes. An expired OAuth access token initially caused a read-only 401; Wrangler refreshed the existing session, and read-only target verification then passed. No security or account setting was changed.

Automated accessibility coverage is not a full manual screen-reader/device certification. Actual hosted CAPTCHA behavior, plan limits/account changes and production-network inbox arrival remain provider/environment-dependent. Owner-confirmed local receipt is recorded, not independently re-tested.

## Git preservation and checkpoint

Exactly ten allowlisted paths were staged and reviewed: two additions/eight modifications,307 insertions / 57 deletions. No private report, credential, evidence log/archive, audit ZIP, generated build or unrelated file was staged. A per-command `core.autocrlf=false` preserved validated bytes without changing Git configuration. Whitespace checks pass with Windows CR line-ending handling. The final index is empty; no push, merge, rewrite, stash, clean, reset or discard occurred.

Committed paths:

```text
public/_headers
scripts/build-staging.mjs
scripts/check-staging.mjs
src/components/InquiryForm.astro
src/data/formspree.ts
src/pages/privacy.astro
src/scripts/contact-form.ts
src/styles/inquiry-form.css
tests/formspree.test.mjs
tests/free-it-review.test.mjs
```

Private evidence: `../v2-formspree-release-evidence/`, including original 296-file snapshot, source/artifact manifests, full staged diff/review, tests/browser/HTTP output, Cloudflare read-only state and private recovery archive. `SOURCE_ONLY.zip`: 734441 bytes, SHA-256 `0ce71c26c3a8313e9dd7ce2b5f85c7a794367cb7131dc4b7d31138899601b1b1`. It is a private source-recovery artifact, not permission to redistribute historical repository content. Existing journals are appended and their previous bytes preserved. Original unrelated files/reports and audit ZIP remain intact.

## Deployment and verification after wording approval

No deployment command has run. Once the exact wording is explicitly approved, record the approval, recheck source/artifact hashes and current target/account/version, and deploy this validated candidate only through `wrangler.staging.toml`. If the active version has changed, inspect that change before uploading. Revalidate relevant changes if the owner requests wording revisions; do not move or overwrite an existing tag silently.

After upload, record the new version/deployment timestamp, run anonymous live HTTP/artifact/SEO/security/cache checks and desktop/mobile route tests. Verify both forms and their disclosures with provider responses intercepted; perform no automatic real submissions. Confirm disabled API flags/no unintended bindings, unchanged PDF, metrics/testimonials/animations/H1 and all 20 routes / 28 redirects. Then provide the one manual public test below. These deployment/live gates are **pending**, not claimed complete.

## Rollback instructions

If a critical regression occurs after the authorized deployment, restore only the current Claude release version on the same personal Worker. Under the established Node 22 runtime:

```powershell
$env:CLOUDFLARE_ACCOUNT_ID = 'eabf58c0ea3cf8629b95c29042124f72'
$env:WRANGLER_SEND_METRICS = 'false'
node node_modules/wrangler/bin/wrangler.js rollback 1d88e2b0-4e2c-40e0-b92a-4fe310b7beba --config wrangler.staging.toml --yes --message 'Recover Formspree release to validated Claude release'
node ../v2-formspree-release-evidence/rollback-qa/http-qa.mjs live
```

The separate rollback checker uses the previous Claude 110-file manifest, not the new candidate. Confirm active version/account/Worker and restored mailto-only behavior after recovery. No database/stateful resource migration is involved. No rollback was executed or needed at this local checkpoint.

## Safe manual public inbox test — only after deployment

Open https://itkeepers-v2-staging.jimnassar99.workers.dev/contact/ after release. Enter your own name/reply email, optional company/phone, select two services and use one harmless unique message such as `ITKeepers public delivery check — [date/time]`. Submit once; complete hosted verification only if prompted. Check the visible provider acceptance, Formspree Submissions and configured inbox/junk for the matching content, reply address and both service selections. Provider acceptance is not proof of inbox receipt. If uncertain, check the provider/dashboard before resending; do not disable spam protection or change DNS/Microsoft365.

Local review remains available at http://127.0.0.1:4394/privacy/ and http://127.0.0.1:4394/contact/. No further real test submission is needed during wording review.

**Verdict: source preserved and validated; local commit/tag complete; public release intentionally awaits the owner's explicit Privacy wording approval.**

Final preservation check: all 296 starting files accounted for; 290 byte-identical, with only the four intended wording/test files and two appended journals changed from the start of this release task. Original journal byte prefixes, private reports/audit ZIP, all other source and prior evidence remain preserved. All 190 validated inputs and 110 artifacts remain unchanged after the commit. Index empty; Privacy approval still pending.


## 24 October 2026 — Monday demo amendment, awaiting wording approval

The current owner request identifies this release as a public competition preview rather than the official production launch, and notifications as going to a temporary administrator-managed inbox, not an officially configured ITKeepers mailbox. The exact current candidate and approval request are in `V2_MONDAY_DEMO_READINESS.md`; that wording supersedes the original “configured ITKeepers notification inbox” text above. The tagged base is unchanged with a four-file local wording/test amendment. All new local regression checks pass. Privacy approval, deployment/new Worker version/timestamp and post-deployment verification remain pending. No new commit, push, merge, official-email/DNS/Microsoft365, other-resource or additional real-submission operation occurred.


## 24 October 2026 — Final Privacy contact correction; approval still pending

The latest exact final notice is in V2_FINAL_PRIVACY_APPROVAL.md. The owner confirms a temporary personal notification inbox whose address must not be published. Because current evidence does not confirm info@itkeepers.com operation, only the Privacy request-contact paragraph is replaced with the owner's contact-form wording; existing disclosures and other Privacy paragraphs remain intact. Relevant tests pass. No new commit/deployment/version/time exists yet; owner explicitly requires approval of this final text before public submissions. Historical sections above remain preserved.
