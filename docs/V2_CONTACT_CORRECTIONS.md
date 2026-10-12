# V2 Contact and homepage CTA corrections

12 October 2026. Current V2 branch `v2-mega-navigation`, checkpoint/HEAD
`da3161d38f99a8c2a29e4e2d1fba56f283e15740`, with all current uncommitted refinements
preserved. The latest owner brief supersedes the earlier no-home-form instruction
and enabled local-validation submit behavior. No commit/push/merge/deployment or
V3/V4 edits.

## Current behavior

- Removed both prominent preview notices. Replaced them with one compact sentence
  under each disabled action: **Online requests are unavailable. Please email our
  team or call us.** These are real `mailto:info@itkeepers.com` / `tel:+96181816761`
  links using Jim's previously confirmed business details.
- Both submit buttons remain disabled in initial HTML and after JavaScript mounts.
  Native Enter cannot submit; an additional shared submit guard cancels forced
  events and reports that nothing was sent. No fake success, discarded inquiry,
  email-service connection, new processor or secret configuration.
- Contact has separate **Inquiry purpose** radios: **A free IT review** and
  **General inquiry**. `?intent=review` and `?intent=general` keep their behavior;
  missing/unknown values default to general. Purpose still changes the disabled
  action label. No visitor data is written to query parameters.
- Optional **Interested in** contains eight native checkbox chips: Managed IT,
  Cybersecurity, Microsoft 365 & Cloud, Networking & Infrastructure, Backup &
  Disaster Recovery, AI & Automation, Web Design & Hosting, Not sure yet.
  Multiple services can be selected. Not sure clears services; a service clears
  Not sure. All-empty remains valid. Visible checkmarks, cyan selection borders
  and keyboard focus distinguish states beyond color alone.
- Repeated native `interests` values become an allowlisted, deduplicated array.
  Shared validation rejects unknown/nonstring values and mixed Not sure/services.
  This is frontend preparation for structured submission, not a server-security
  or delivery claim. With JavaScript unavailable, controls still have native
  semantics; dynamic exclusivity requires JS, and submission remains disabled.
- Existing five Contact text fields and required/optional rules remain. Field
  length limits are 120/254/160/40/3,000 for name/email/company/phone/message.
  Native email validity and inline blur/correction errors remain accessible;
  no common email-provider or US-phone restriction.
- The closing CTA is now approximately **45% copy / 55% form**, with the exact
  requested headline/description, Prefer to talk? and verified number on the left.
  A restrained raised-surface card on the right says **Book your free IT review.**
  and contains only name/email/optional phone/optional company. It fixes inquiry
  purpose to review and has no long message field, service chips or company size.
  Phones stack copy above the card and all four fields; action spans full width.
- Contact Call Us, emergency and Email sidebar contents/links remain unchanged.
  Emergency help still uses `/emergency/`. Navigation, Hero, service pages,
  animations, testimonials, Playbook, schema and metadata remain preserved.

## Shared architecture and activation blocker

`InquiryForm.astro` renders both layouts; `data/inquiry.ts` supplies field limits,
purpose/label helpers and service values; `contact-form.ts` mounts the same scoped
controller and guard; `inquiry-form.css` styles both. IDs are unique (`contact-*`
versus `home-review-*`). Shared initialization is idempotent and listeners clean
up on Astro navigation. Both forms declare POST to `/contact` in the single shared
component; this remains a disabled static form destination, **not a live endpoint**.
Hidden `form_kind` distinguishes contact versus compact review for future validation.

Inspection reconfirmed static Astro and assets-only Cloudflare Workers configuration.
There is no operational inquiry handler, provider or mail delivery integration.
Shared frontend handling is implemented; **shared backend integration, real success/
error delivery, server-side validation and anti-spam are blocked/unimplemented**.
No end-to-end delivery test is claimed.

Exactly what is needed to enable both forms under existing B3/B13 gates:

1. Approved delivery mechanism and Worker endpoint; fixed receiving mailbox and
   responsible inquiry owner. Existing business email approval is for contact
   display, not confirmation of the form's receiving/processing workflow.
2. Confirmed sender identity and the selected provider's server-side credentials/
   platform configuration. No secret names or bindings have been invented.
3. One handler that validates form kind, intent, all field/request lengths and the
   service array. Require name/email on the mini-form, plus message on Contact;
   reject unknown values and contradictory Not sure selections server-side.
4. Fixed sender/recipient, safe header/message encoding, distributed request/delivery
   limits, anti-abuse policy and Origin/CSRF controls appropriate to the chosen path.
5. Approved processing/retention/deletion policy and a reviewed privacy notice before
   collection, followed by real delivery, recoverable failure and retry tests.

No external processor, logging of form contents, client secret, storage, analytics
or redirect processing was introduced. Existing same-origin CSP supports the
external controller. Frontend validation does not substitute for server controls.

## Checks and evidence

- PASS: Astro production build, **16 pages**; **107/107 tests**; diff whitespace.
  Required/length/email checks, retained intent routing, disabled state for both
  layouts, guard/preservation, lifecycle cleanup, all eight options, array rejection,
  mutual exclusivity, compact field list and sidebar links are covered.
- PASS: both surfaces at **1440, 1024, 768, 430, 390, 375, 320px**. The pasted brief
  ended after “and”; 375/320 continue the prior validation coverage. No horizontal
  overflow or clipped chips/fields. Eight chip targets are at least 48px high.
  Desktop CTA height about 640px at1440; about584px at1024. Mobile height grows
  naturally with four stacked labeled inputs rather than fixed-height clipping.
- PASS: actual keyboard Space selects multiple chips; Not sure exclusivity both
  directions; visible focus; radio ArrowLeft selects review; supported/unsupported
  query cases update labels and keep controls disabled. Full/compact invalid email
  blur/correction works; Enter leaves each URL unchanged and sends nothing.
- PASS: built link audit finds **0** broken internal destinations/fragments.
  Fourteen unrelated main regions, all16 headers/footers and Contact metadata/
  canonical/schema match the captured starting build. Audit includes prior local work.
- Independent repository-required source/CSP review: no actionable findings;
  focused contact suite **13/13** passed. Semantic labels/errors/native checkboxes,
  disabled states, compact contents and truthful fallback checked.
- Vercel interface rules reviewed12 October2026; no new changed-scope issue remains.

Real delivery/server controls are unavailable. Physical devices, Safari, native
screen-reader speech, native zoom, forced colors and live media-preference emulation
are not claimed tested in this correction. No new animation was added; existing
reduced-motion/lifecycle tests passed. Browser screenshots/DOM checks are lab evidence.

Evidence outside Git: `../v2-contact-corrections-evidence/` with starting source
hashes/build, final logs, seven-width geometry, chips/intent evidence, link/preservation
audit and Contact/homepage desktop/mobile screenshots. Screenshots require a settled
second observation after IAB viewport changes; initial stale captures were replaced.

Files changed: `src/components/CTA.astro`, `src/pages/contact.astro`,
`src/scripts/contact-form.ts`, `tests/free-it-review.test.mjs`; new
`src/components/InquiryForm.astro`, `src/data/inquiry.ts`, `src/styles/inquiry-form.css`;
`claims-register.md`, `PROJECT_STATUS.md`, this report and the historical refinement
report's supersession note. Shared/sidebar unrelated source is retained.

**Done:** targeted local corrections. **Decisions:** shared frontend, honest disabled
delivery state and functional fallback. **Assumptions:** no new company facts.
**Blocked:** backend activation and unperformed native validation above.
**Needs review:** Jim, at http://127.0.0.1:4352/#closing-title and
http://127.0.0.1:4352/contact?intent=review. **Deployment:** none. **Next:** stop for review.
