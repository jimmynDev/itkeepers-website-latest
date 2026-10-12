# V2 contact page and closing CTA refinement

Historical record of the first refinement. The later 12 October correction brief
supersedes its no-home-form layout and enabled validation action: both forms now
stay disabled, the homepage has a compact review form, and Contact has eight service
chips. See [V2_CONTACT_CORRECTIONS.md](V2_CONTACT_CORRECTIONS.md) for current behavior.

12 October 2026. Branch `v2-mega-navigation`; HEAD/checkpoint
`da3161d38f99a8c2a29e4e2d1fba56f283e15740`. Continued the current dirty V2 with its
navigation, navy-background and content-consolidation refinements. No reset,
V3/V4 changes, commit, push, merge or deployment.

## Implemented

The closing CTA now has the exact requested eyebrow, headline and supporting copy,
with a review button and general-contact link. A restrained right-hand typographic
composition uses Environment / Priorities / One conversation. No homepage form,
new image, decorative card, arrow, motion or additional submission system.

Contact uses the requested H1 and concise introduction. The form occupies 60% of
the desktop content grid and contact information 40%, using existing navy tokens,
fonts, cyan actions and subtle borders. Call, separate emergency guidance and email
cards follow the form on phones. No hours, address, availability or response promise.

| Field | Requirement | Character limit / handling |
| --- | --- | --- |
| I'm interested in | Review or general | Two native radio choices; allowlisted |
| Full name | Required | 120; Unicode supported; whitespace-only rejected |
| Work email | Required | 254; native email validity; no provider restriction |
| Company | Optional | 160 |
| Phone | Optional | 40; native tel input, no US-specific pattern |
| How can we help? | Required | 3,000; multiline; credentials/confidential-data warning |

Desktop name/email and company/phone pairs share rows. Phone layouts stack all
fields and make the submit action full width. Controls have explicit labels,
autocomplete, required/optional text, visible focus and associated inline errors.

## Routing and verified contact details

- Closing review button: `/contact?intent=review`; radio selects **A free IT review**;
  submit label **Request my free IT review**.
- Closing secondary link: `/contact?intent=general`; radio selects **Talking to the
  team**; submit label **Send my message**.
- Missing/unsupported intent defaults to general. Changing the radio updates the
  label. No arbitrary redirect, query interpolation or form values in URLs.
- Existing Hero and IT Services menu review links now use the same review intent.
  Other service destinations and general `/contact` links retain their routes.
  Fixed query-aware active-page matching so the Contact menu marker stays correct.
- General phone: **+961 81 816 761**, `tel:+96181816761`. Jim confirmed on this task
  that the previously authorized emergency number is also the general number.
- Email: **info@itkeepers.com**, `mailto:info@itkeepers.com`. Jim supplied it directly.
  These details are owner-confirmed; no real call or email was placed.
- Emergency help opens existing `/emergency/`, retaining its verified call link.
  Urgent incidents are directed there rather than through the normal inquiry form.

The original Contact title, description, social metadata, canonical and Organization
schema are byte-identical in the production artifact. Query variants canonicalize
to `/contact/`; only one H1 and one existing Organization record. No duplicate schema.

## Submission architecture and security status

Inspection found static Astro output and Cloudflare Worker **assets only** in
`wrangler.toml`. No server entry point, inquiry endpoint, email provider or existing
delivery integration is present in this V2 checkout. No provider, secret, binding,
account connection or deployment configuration has been invented or installed.

**This form is non-operational for delivery.** The notice appears before the fields.
JavaScript enables local validation only after installing a submission-cancelling
guard. Invalid attempts expose inline errors, a polite status and focus on the first
problem. Valid attempts explicitly say **Your details have not been sent** and
direct visitors to phone/email. Values remain intact; no success or booking state.
Without JavaScript the button stays disabled, with phone/email fallback and manual
purpose selection. Static prerendering cannot select a query intent without JS.

Implemented frontend controls: exact intent allowlist, native email validity,
required/length checks, POST-shaped form, unconditional submit cancellation,
textContent-only errors/status, no HTML insertion, fetch, storage, analytics,
client secrets, redirect handling or credentials collection. External same-origin
controller complies with current `script-src 'self'` and form-action remains self.
The old unavailable-review guard was replaced, not left as orphan code. Initialization
is idempotent and listeners clean up on Astro navigation.

There is no live endpoint on which to enforce server validation, request-size limits,
header injection protection, distributed rate limits, bot verification, delivery
confirmation or endpoint-specific CSRF protections. Those are **not implemented or
claimed as passed**. Client validation is not a server security boundary.

The existing Privacy page accurately states that no form processor is configured;
it is still an interim notice. Before inquiry collection, existing B3/B13 gates need:

1. Approved delivery mechanism and Worker endpoint architecture; actual receiving
   mailbox and responsible inquiry owner. Contact email approval alone does not
   establish a form-processing destination or ownership process.
2. Confirmed sender identity and provider-specific server secret configuration,
   kept in platform secret storage once the provider is selected.
3. Server schema/length/request limits, fixed recipient/sender, safe message encoding,
   per-client/global abuse limits, bot policy and Origin/CSRF threat model.
4. Processing/retention/deletion decisions and reviewed privacy notice before collection.
5. Real end-to-end delivery, recoverable failure and retry tests before enabling
   production submission or adding a genuine success message.

## Validation

- **PASS:** production Astro build, 16 pages; **105/105** tests; whitespace check.
  No separate lint/type-check command is configured. Build/transpilation is not
  claimed to replace full TypeScript checking.
- **PASS:** all requested widths for Contact and closing CTA: 1920, 1440, 1280,
  1024, 768, 430, 390, 375 and 320px. No horizontal overflow or clipped controls.
  Main contact grid switches to one column at 900px; fields/cards stack at 600px.
  Form-first order is preserved. Main input/action/label targets measure at least 48px.
- **PASS:** actual closing primary/secondary link clicks select their respective
  purposes. Browser default/general/review/invalid intent cases match the label;
  no autofocus; canonical excludes query parameters.
- **PASS:** empty and invalid email attempts; corrected Gmail address and Lebanese
  phone accepted; no delivery claim. Full tab order through five fields to the action,
  native radio ArrowRight behavior, Enter validation and first-error focus checked.
  Focus stays below the fixed header. Accessible snapshot exposes errors/status.
- **PASS:** unit coverage for optional blank fields, international phone formats,
  all field-length boundaries, Outlook/Gmail acceptance without domain policy,
  idempotent initialization, listener disposal and preserved values.
- **PASS:** full built internal-anchor audit: 0 broken destinations/fragments.
  Fourteen other built main regions and all 16 footers remain byte-identical.
  All headers match the baseline after normalizing the intentional review query.
- Independent repository-required reviewer: no actionable findings in Contact,
  CTA, validation controller, data, CSP compatibility and tests; focused 11/11 pass.
- Vercel Web Interface Guidelines retrieved/reviewed on 12 October 2026. Changed
  scope uses semantic controls, dimensions, visible focus and existing reduced-motion
  conventions; no new animation. Existing privacy/backend gates remain explicit.

**Unavailable/unperformed:** real delivery and success state (no backend), native
screen-reader speech, physical devices, Safari, browser 200% zoom, forced-colors
and live motion-preference emulation. IAB did not support the attempted zoom shortcut;
320px CSS reflow passed, which is not a claim of native zoom testing. No comprehensive
accessibility or field performance certification. EMPIST screenshot files were not
present with the pasted brief; the written structural requirements guided the layout.

Evidence outside Git: `../v2-contact-evidence/` contains before-build/source hashes,
build/test logs, nine-width geometry, intent/keyboard/validation evidence, link and
preservation audit, and desktop/mobile Contact/closing screenshots. Browser tools
redact entered email/phone values; the initial exact-value comparison was therefore
inconclusive. Name/message preservation was observed and unit tests confirm all
values stay intact. No sensitive actual inquiry data was used.

## Files and review handoff

- `src/components/CTA.astro`; `src/pages/contact.astro`.
- `src/data/contact.ts`; new `src/scripts/contact-form.ts`; removed unused
  `src/scripts/free-it-review.ts`.
- `src/components/Hero.astro` (review href only), `src/data/navigation.ts` (two review
  destinations), `src/components/navigation/MegaMenuContent.astro` (query matching).
- `tests/free-it-review.test.mjs`, `tests/home-consolidation.test.mjs`.
- `docs/V2_MEGA_NAVIGATION.md`, this report, `claims-register.md`, `PROJECT_STATUS.md`.

**Done:** local UI and validation. **Decisions:** one form/two intents, separate
emergency path; no unapproved processor. **Assumptions:** no new company facts.
**Blocked:** live inquiries pending B3/B13 decisions above; native validation limits
listed separately. **Needs review:** Jim's visual review. **Deployment:** none.
**Next:** stop; review at http://127.0.0.1:4352/contact?intent=review and
http://127.0.0.1:4352/#closing-title.
