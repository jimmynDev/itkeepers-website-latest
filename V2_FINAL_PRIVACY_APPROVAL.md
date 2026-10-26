# ITKeepers V2 — Final Privacy approval for Monday competition preview

**Local correction and validation: PASS. Public deployment: HOLD pending explicit approval of the exact Privacy text below.**

Prepared 24 October 2026, Asia/Beirut, for Monday 26 October. The owner confirms Formspree was tested successfully and the temporary notification inbox is the owner's personal email. Its address is not published or included in this report or the candidate source. No new real inquiry was sent.

## Why the request-contact paragraph changed

Existing records approve `info@itkeepers.com` as a business contact/previous proposed recipient but do not confirm mailbox operation or successful receipt there. Recipient selection is not operational verification. Following the owner's exact instruction, only the Privacy page's request-contact paragraph changes; an unused import is removed and the relevant regression assertion updated. Existing direct business-email/telephone alternatives elsewhere, all other Privacy paragraphs and both temporary-inbox disclosures remain unchanged. No official email configuration or mail routing changed.

## Exact final public Privacy text — approval requested

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

For questions about your inquiry, or to request access, correction or deletion of information you submitted, use our contact form and write 'Privacy request' in your message. Your request will be forwarded to the administrator managing inquiries for this competition preview.

“contact form” links to `/contact/`. Retention links remain [Formspree's Privacy Policy](https://formspree.io/legal/privacy-policy/) and [submission archive information](https://formspree.io/plans/). The existing page eyebrow is “Privacy”. No personal email address appears in this page's request-contact paragraph. No fixed retention/deletion deadline or compliance/legal approval claim is added.

## Existing form disclosure — unchanged

> We use your details to respond to your inquiry. Formspree processes your submission for delivery to a temporary administrator-managed inbox for this competition preview, not an officially configured ITKeepers mailbox. Read our Privacy notice.

“Privacy notice” links to `/privacy/`. This remains a public competition preview, not the official ITKeepers production launch.

## Relevant validation

| Gate | Result |
| --- | --- |
| Full automated suite | **200/200 PASS**, including exact request text and labelled `/contact/` link assertions |
| TypeScript and standard/staging builds/comparison | **PASS** |
| SEO/security checks and npm audit | **PASS**, zero security findings/vulnerabilities |
| Mocked browser/CSP/provider behavior | **19 scenarios PASS**, including acceptance/rejection, duplicate prevention, invalid fields, spam, limits, native fallback and the new keyboard Privacy-request link flow; zero automated real submissions |
| Accessibility/reflow | **Six axe layouts PASS**, Home/Contact/Privacy at 1440/390; zero automated violations, no overflow |
| Local Worker HTTP | **269 checks PASS**, all 20 routes,15 indexable / five holds,28 redirects,108 served file hashes, immutable caching/security/private-file protection and disabled API responses |
| Privacy scope preservation | All prior Privacy paragraphs except the requested one match the starting candidate; form disclosure is byte-identical |
| Public-output address check | No known private account-owner address literal found; private address values never printed or recorded in the report |
| Existing protected scope | All 20 page metadata unchanged; seven services, animation/navigation/hero/metric/testimonial source, PDF and Worker configuration unchanged |

The prior Monday candidate additionally passed 60 route/animation browser checks, desktop/mobile menu discovery of all seven services, and 139 samples across all six hero states at both widths confirming exact textContent/innerText/computed heading name. Those sources are unchanged by this paragraph correction. Post-deployment checks will run against the final live artifact; this report does not claim they have happened.

The PDF remains 200/application/pdf, 190729 bytes, unchanged SHA-256 `bf8c6143016208502bf1ef30019d6d275ad1c4dde407f6740e430f0de33874b9`. Formspree endpoint remains `https://formspree.io/f/mrppzvpo`. Both `/api/contact` and `/api/inquiry` remain disabled. No database, key, dependency, additional provider, official-email configuration or third-party script permission was introduced.

## Source and deployment gate

Base commit `e86d5ff1f7f22ee0135d6071f8377106c0a31260` and annotated tag `v2-formspree-contact-2026-10-23` remain unchanged. The prior four-file local wording/test amendment is preserved with this correction. No commit, tag move, push, merge, reset, stash, clean or discard occurred. Starting work and evidence were snapshotted in sibling `../v2-monday-privacy-contact-evidence/`; exact candidate patch, 190-source manifest, 110-file artifact manifest and test/browser/HTTP outputs are preserved privately.

**Explicit final wording approval is still required.** After approval, the owner authorizes a new local wording commit if needed, without rewriting the existing tag/history, then deployment only to account `eabf58c0ea3cf8629b95c29042124f72`, Worker `itkeepers-v2-staging`, existing `wrangler.staging.toml`. Recheck current version and exact candidate before upload. DNS/Microsoft365, official email configuration, Natural Touch/JIVON and all other Workers are outside scope.

No new Worker version or deployment timestamp exists yet. Previous documented version/rollback target remains `1d88e2b0-4e2c-40e0-b92a-4fe310b7beba`. Existing rollback commands/checker in `V2_FORMSPREE_DEPLOYMENT.md` and the separate previous-Claude manifest remain valid. Record actual new version/time and live results only after the approved deployment.

## Later one-time manual public inbox test

After approved deployment, open https://itkeepers-v2-staging.jimnassar99.workers.dev/contact/. Enter your own name/reply email, two service interests and a harmless unique `Competition preview delivery test — [date/time]` message; submit once. Complete hosted verification if prompted. Check provider acceptance, Formspree Submissions and the temporary personal inbox/junk for the matching fields/reply address. Acceptance alone does not establish inbox delivery. No automated real test or official mail-system change is required.

Local wording review: http://127.0.0.1:4394/privacy/. Deployment and live presentation readiness remain pending approval; the validated local correction is PASS.
