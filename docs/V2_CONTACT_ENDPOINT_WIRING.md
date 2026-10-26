# Contact endpoint wiring — 21 October 2026

Branch `codex/v2-prompt3-restored`; HEAD `22b5c2f9e74d9c734137036ec74a3db289c67761` plus preserved uncommitted work. Local-only validation; no deployment or real inquiry/email.

## Implemented behavior

- Explicitly enabled Home/Contact forms POST to same-origin `/api/contact`. Default builds retain email-app handoff and verified email/telephone options. No design, approved copy, SEO metadata, URLs, animation or Privacy draft changes.
- Actual Workers `run_worker_first` includes `/api/contact` and former `/api/inquiry`; both call the non-storing contact handler. No redirects between them. Historical email implementation/binding preparation is preserved, disabled and unrouted; neither public endpoint can call it, even if the old delivery flag is true.
- New `CONTACT_VALIDATION_ENABLED=false` rejects before body read, verifier or abuse storage. Existing `CONTACT_DELIVERY_ENABLED=false` remains. No production collection enabled.
- Synthetic local validation can exercise the existing schema/size/time limits, exact Origin/Fetch Metadata, trusted Cloudflare identity, honeypot, field allowlist and server Turnstile hostname/action/freshness verification. Per-client/global admission limits and fail-closed guard behavior remain. Guard code and outbound/duplicate quotas are unchanged; without outbound delivery no outbound reservation is made.
- Validated submissions return503 `{ok:false,code:"submission_not_stored"}`. No inquiry body, email, token or rawIP is logged/persisted. Only existing keyed abuse counters are retained in the guard. This is explicitly **not** durable inquiry storage. Historical accepted-email dedup state cannot produce a contact acknowledgement.
- API errors stay no-store/noindex with existing security headers. The form retains entered details and focuses the accessible error status with fallback options. Unexpected2xx/legacy accepted responses cannot display success. No API success panel is rendered until durable acceptance is implemented.

## Validation

- PASS38/38 focused tests: Worker, form/fallback and endpoint security; added contact-specific checks for disabled/unread body, no email dependency, no false receipt, retained validation/verifier/rates, guard failure and legacy acceptance isolation.
- PASS default and isolated enabled Astro builds:20HTML routes/19indexable. Focused Worker/browser TypeScript check passes.
- PASS20 Chrome/Playwright WebKit browser cases against actual local Wrangler Worker/DO: full and compact forms, actual503 response, invalid/expired/unavailable verification, widget failure, unexpected202, keyboard submission/error focus, retained fields, email/phone fallback, no-JS restriction, default disabled behavior and320/1440reflow. Two axe scans report no WCAG2A/AA/2.1A/AA violations.
- Turnstile widget and Siteverify are mocked in an isolated synthetic local fixture; no email binding in that fixture. No real challenge, account, staging, production, physical-device or screen-reader sign-off claimed. Test-only substituted client identities never enter production source.
- SEO/link/schema/sitemap output audit:0failures/0warnings. Bounded public-output scan:0findings. Preservation comparison confirms unchanged approved authored content, metadata/schema, styles, animation sources, robots/sitemap and28redirect files. Private policy and all other starting source files preserved.
- Evidence outside repository: `../v2-contact-endpoint-evidence/` (hash baseline, test/type/build logs, local fixture and browser results). Application/runtime logs contain no submitted synthetic field/token values.

## Remaining release blockers / owner decisions

1. Choose and approve durable inquiry handling before collection: this change intentionally adds no inquiry database, queue or email delivery. Existing abuse metadata is not a receipt or retrievable inquiry. Storage selection must resolve ownership, access, retention/deletion, processor terms and Privacy implications; do not infer approval from these tests.
2. Approve the Privacy notice and production data flow. The private draft's12month/3year inquiry periods remain unchanged; no database, processor or legal approval is added here.
3. Configure real Turnstile hostname/sitekey/secret, HMAC secret, guard binding and preview authentication in approved environments; verify real challenge and trusted edge metadata without logging personal data.
4. After approved durable acceptance exists, add explicit acceptance semantics/UI and controlled end-to-end tests, then obtain separate release authorization. Until then, leave server validation/collection and public backend builds disabled. Email integrations remain deferred; Microsoft365 MX/DNS/account settings untouched.

No commit, push, merge, publish or deployment. Review only.
