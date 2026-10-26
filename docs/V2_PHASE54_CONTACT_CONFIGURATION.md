# Phase 5.4 — fixed recipient and production preparation

> Historical preparation: current activation and release gates are consolidated in [FINAL_RELEASE_READINESS.md](../FINAL_RELEASE_READINESS.md). Both public API routes are validation-only and disabled; earlier flag/endpoint instructions do not activate email. No email integration is authorized now.

Prepared 20 October; final validation 21 October 2026 · `codex/v2-prompt3-restored` · **Prepared locally, real delivery disabled.** No verification email, real message, Cloudflare account mutation, DNS/MX change, commit, push, merge or deployment.

## Completed

- Owner explicitly confirmed **info@itkeepers.com** as the form recipient. `contactFormRecipient` is now an independent server constant, and Wrangler's `CONTACT_EMAIL` binding is restricted to the same `destination_address`. Changing displayed contact details or posting `to/from/cc/bcc/replyTo/recipient` cannot reroute a submission.
- `CONTACT_DELIVERY_ENABLED=false` remains the production kill switch. `remote=false` makes local email bindings use simulation; **it does not disable sending in a deployed Worker**. Public forms remain email handoff.
- Sender stays in server-only `CONTACT_EMAIL_FROM`, with no invented default. It must be an approved exact address under `itkeepers.com` authenticated by native Email Service; the provider must accept the send before the API reports acceptance. Visitor email is validated for syntax, length and header controls, then used only as Reply-To. This is not verification that the visitor owns that address.

Recipient selection is resolved. Cloudflare destination verification, authenticated sender, mailbox monitoring/retention, Privacy and successful controlled receipt remain separate gates. [Phase 5.3](V2_PHASE53_PRIVACY_CONTACT.md) retains the implementation/data-flow detail.

## DNS and Cloudflare verification — prepared, not performed

Read-only public DNS observations are saved in sibling `v2-phase54-contact-evidence/dns-observations.json`:

| Item | Observed / requirement |
|---|---|
| DNS hosting | Cloudflare nameservers `guy.ns.cloudflare.com` / `liv.ns.cloudflare.com` observed; this does not establish account access or Email Sending eligibility. |
| Apex MX | **itkeepers-com.mail.protection.outlook.com**. Keep this Microsoft 365 routing unchanged; do not add Cloudflare inbound MX or enable Email Routing. |
| Existing apex SPF | Includes Microsoft 365 and MailerSend, ending `-all`. Preserve the current policy; a DNS include alone does not prove an active delivery account/contract. Do not create a second apex SPF policy. |
| Existing DMARC | **p=reject**, with existing reporting destinations. Preserve the whole policy; do not relax it or discard reporting to onboard another sender. |
| `cf-bounce` MX/TXT and `cf-bounce._domainkey` TXT | Not observed in this DNS check; this is not an authenticated account-status check. Any required records must come from the chosen Cloudflare account. |

The mail-domain owner should:

1. Check outbound **Email Sending** eligibility and current destination/sender status in the intended account. Reuse any already-verified destination. If `info@itkeepers.com` requires verification, arrange an explicitly authorized verification email and have its mailbox owner complete it. [Destination verification is account-level](https://developers.cloudflare.com/email-service/get-started/route-emails/#add-a-destination-address); do not follow the separate domain-routing onboarding steps or create a forwarding rule.
2. Select the exact company From address and verify its sending domain. [Native bindings require an onboarded sending domain](https://developers.cloudflare.com/email-service/configuration/send-bindings/). No authenticated From address is established by the recipient confirmation or SPF observation.
3. Review the complete proposed [Email Sending DNS diff](https://developers.cloudflare.com/email-service/configuration/domains/) before approving onboarding: bounce-subdomain MX/SPF and DKIM authentication records are distinct from inbound root MX. Use only account-provided values/priorities/public key. Preserve existing root MX/SPF, Microsoft 365 DKIM and DMARC/reporting. If the wizard requires incompatible changes, stop this path for review; do not weaken existing policy. No record has been added here.
4. Verify provider sender/destination authorization, suppression settings and a named bounce/delivery monitor. Capture status evidence without secret values. This task has not triggered Cloudflare verification or authenticated the sender.

## Secrets and production configuration

| Setting | Prepared state / next input |
|---|---|
| `CONTACT_EMAIL` | Native binding prepared, fixed `info@itkeepers.com`, local `remote=false`; account authorization remains unverified. No SMTP/M365 credentials are needed by this binding. |
| `CONTACT_DELIVERY_ENABLED` | **false**; keep off for public submissions until Privacy approval and controlled delivery acceptance, followed by separate release authorization. |
| `CONTACT_ALLOWED_ORIGIN` | `https://itkeepers.com`; preview collection remains disabled. Do not add wildcard origins. |
| `CONTACT_EMAIL_FROM` | **Not supplied in the prepared configuration**, pending an exact approved/authenticated company sender; remote account state is unverified. It is fixed server configuration, never a visitor field or PUBLIC_* variable. |
| `TURNSTILE_SECRET_KEY` | **Not created/configured in this phase; remote state unverified.** Account owner provides the production widget secret through encrypted Worker secret storage; never source/config/browser/chat/logs. |
| `CONTACT_RATE_HMAC_KEY` | **Not created/configured in this phase; remote state unverified.** Generate at least 32 random bytes in an approved secret manager and store as a Worker secret; do not reuse a Turnstile/API/M365 secret. Reconcile pending sends before rotation. |
| Build controls | Public enable flag stays unset/off; endpoint/sitekey remain inactive. After approval, the enabled build needs `PUBLIC_CONTACT_FORM_ENABLED=true`, `PUBLIC_CONTACT_FORM_ENDPOINT=/api/inquiry`, and the approved `PUBLIC_TURNSTILE_SITE_KEY`. The sitekey is public; the widget secret is not. |
| Infrastructure | Existing `CONTACT_GUARD` binding/migration remains prepared. Account owner approves namespace, access, limits/expiry/recovery policy, actual Worker/domain/preview routes, logs and rollback. No namespace or production secret was created remotely. |

[Prepare a production Turnstile widget](https://developers.cloudflare.com/turnstile/get-started/widget-management/dashboard/) for `itkeepers.com` with separately approved mode and no unapproved pre-clearance. Keep test keys/localhost fixtures separate. Server checks action **inquiry**, expected hostname and token freshness/single-use via Siteverify. The enabled build already prepares the minimal script/frame CSP origins; actual challenge keyboard/screen-reader/device behavior and production CSP still need approval.

## Controlled delivery and release gates

**Do not enable the public form to run its first real test.** After Privacy approval and separate authorization for the test, use a restricted operator-only test against native sending with synthetic content, the fixed recipient and approved From/Reply-To identities. Public delivery stays off throughout. This task has neither sent nor enabled that test, and supplies no public test endpoint.

Required evidence: provider messageId/acceptance; actual receipt or M365 trace in the approved inbox; correct To/From/Reply-To with no CC/BCC; SPF/DKIM/DMARC passing against the preserved mail policy; working reply target and known bounce/suppression handling. Record sanitized timestamps/IDs, not message bodies/secrets. A local simulator's 202 or provider acceptance alone is not a successful inbox receipt test. Failure leaves public delivery off.

Remaining owners: qualified reviewer approves the exact Privacy notice/controller/processors/retention/transfers/effective date; mail/account owner verifies destination/sender and controlled receipt; Security/Ops approve keys, limits and uncertain-send handling; release/QA owner verifies bindings, Access/TLS/CSP and rollback. Only then may the separately authorized production release enable the handler and matching frontend. Rollback disables new submissions and restores email-handoff build settings; it does not recall in-flight messages or require changing MX.

## Focused validation

**39/39 focused tests pass**, including fixed binding/recipient agreement, visitor envelope rejection, missing/provider-rejected sender, Reply-To validation, duplicates/timeouts, contact fallback and SEO/config regression. Astro build and focused Worker TypeScript checks pass. Actual local Workers with the new binding: Home and Contact return 200 in email-handoff mode; API POST returns 503 with no-store. **All 107 public build files are byte-identical** to the starting candidate, preserving 20 routes/19 indexable URLs, all 28 redirects, metadata, design, copy and animations. Previous broader browser/native-simulator evidence is reused; no repeat real challenge or live delivery is claimed.

Evidence: sibling `v2-phase54-contact-evidence/` contains the 357-file starting snapshot, public DNS observations, focused tests/build/type/runtime results and final preservation hashes. Final 21 October read-only comparison confirms the observed apex MX/TXT and DMARC records are unchanged. The temporary local validation server was stopped. Stop for review; delivery remains disabled.
