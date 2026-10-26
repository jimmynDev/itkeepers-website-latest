# Direct Formspree contact submission — local integration

Date: 23 October 2026. Status: implemented and tested locally; public deployment withheld.

## Decision and authorization

The owner explicitly requested Formspree at `https://formspree.io/f/mrppzvpo`, actual email notifications, a local preview and one owner-performed delivery test. This authorizes the processor integration and local test. It does not authorize deployment, final Privacy wording, a Git commit, account changes or general public collection. The repository's Privacy approval gate still applies before general public use.

Use browser HTTPS POST with FormData and `Accept: application/json`; no SDK, new dependency, API key, database or backend. The endpoint is a public form identifier. Keep `/api/contact` and `/api/inquiry` disabled. Preserve direct email and telephone alternatives.

## Data and user interaction

Send only name, email, company, phone, message, validated service interests, readable service labels and fixed inquiry context/subject. Preserve optional values and selected services. Formspree uses the single `email` field for the reply address. Native submissions preserve repeated `interests` fields. No hidden recipient or user-controlled redirect is added.

Use the provider-supported `_gotcha` honeypot. Existing provider spam settings are not inspected or changed; no CAPTCHA bypass is added. If the provider requires verification, the user can explicitly continue with a native POST to Formspree's hosted flow. Without JavaScript the same form posts natively, with browser validation and labelled service checkboxes. This leaves the website for provider confirmation.

AJAX locks duplicate submissions, times out after 15 seconds and never retries automatically. Only a recognized successful provider response displays acceptance. Unknown responses, provider failures and network interruptions retain values and do not assert receipt or inbox delivery. Rate limiting instructs the user to wait and provides direct alternatives. Provider error strings are rendered as text.

## Security and publication boundary

CSP `connect-src` adds only the exact endpoint. `form-action` adds only the Formspree HTTPS origin so native submission and provider-hosted confirmation/verification redirects work. All other security controls, immutable asset caching, private-file protection and disabled local API behavior are preserved. No provider scripts, frames, extra image origins, credentials or secret settings are introduced.

Both forms disclose processing through Formspree. `/privacy/` remains a noindex draft and accurately identifies the new local processing flow rather than claiming there is no processor. Owner/reviewer approval of identity, purpose, recipient/configuration, provider/subprocessors, retention/deletion, rights and international processing remains required before general public use. Provider storage is not represented as absent.

## Validation and consequences

Automated provider submissions are intercepted and mocked, including native fallback. No automated live inquiry or email is sent. The owner must perform the single manual inquiry and check both provider acceptance and actual inbox delivery. Recipient activation, notification routing, account limits, allowed domains and spam settings remain provider-account responsibilities, unverified by this local code change.

See `V2_FORMSPREE_CONTACT_INTEGRATION.md` for validation results and exact manual steps. Previous source, evidence and public PDF are preserved. No deployment, Git mutation, DNS or Microsoft 365 change is performed.

## Primary references

- [Formspree special fields](https://help.formspree.io/articles/building-your-form/special-fields)
- [Formspree honeypot](https://help.formspree.io/articles/building-your-form/honeypot-spam-filtering)
- [Formspree system limits](https://help.formspree.io/articles/form-and-project-settings/system-limits)
- [Formspree current response contract](https://github.com/formspree/formspree-js/blob/main/packages/formspree-core/src/submission.ts)
- [Formspree Privacy Policy](https://formspree.io/legal/privacy-policy/)
