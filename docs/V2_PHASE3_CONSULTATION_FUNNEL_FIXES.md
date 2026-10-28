# Phase 3 consultation funnel fixes — 27 October 2026

Done: local review candidate on `codex/v2-business-locations`, unchanged HEAD `bfcd0322174c6bf5a00ed602c47c633fc9aaf337`. All starting Phase 1 office/location and Phase 2 credibility changes are preserved. No commit, push, merge, upload, deployment, real inquiry, email or telephone call occurred.

## Implementation and confirmed fixes

1. **Submission race:** validate and capture FormData before locking editable fields. While AJAX is pending, inputs, textarea and inquiry selector are disabled. Repeated submit attempts remain guarded. On provider/network/verification failure or timeout, restore the original enabled states before focusing errors. On acceptance, editing is restored, the accepted submit button remains locked, and a subsequent edit retains the existing unsent-changes warning/unlock behavior.
2. **Native verification payload:** use the already validated, normalized payload to create temporary hidden successful controls before disabling the original named controls. This prevents native submission from omitting disabled fields or submitting duplicate names. The selected consultation subject and `type=review` are preserved. Returning from a hosted provider page restores editing; a cached return states that acceptance was not confirmed here. No native response is treated as local success.
3. **Pulse CTAs:** both consultation links use the exact requested label and `/contact/?type=review`. No other Pulse link changed.
4. **Static/no-JavaScript Contact:** add a native Inquiry type selector. Its successful control is `_subject`, so selecting Free IT Consultation directly submits the correct consultation subject without JavaScript. The Contact hidden `type` field starts disabled to avoid contradicting that selection with `general`; JavaScript enables/synchronizes the existing `type` field and selector from the existing query parameter. Manual JavaScript selection also updates intent/button label and preserves custom message text. The existing empty-message consultation prefill remains.
5. **Honest consultation success:** distinguish provider acceptance from both inbox delivery and appointment scheduling. No response-time, callback or scheduling promise is added. General-inquiry acceptance copy is unchanged.
6. **Contact jump:** add a native anchor near the introduction to the existing form panel. The panel has `tabindex=-1`, a heading association, visible focus outline and 140px scroll margin. Existing contact cards and responsive ordering remain. Keyboard activation focuses the panel, then Tab reaches Inquiry type; the sticky header does not obscure the target.
7. **Error fallback:** show actionable links to the already published general email and business telephone next to submission errors. Hide them during sending/after success. No new contact details, processors, routes or infrastructure.

## Exact before/after public copy

| Surface | Before | After |
|---|---|---|
| Both Pulse consultation CTAs | `Get a Free Consultation` → `/contact/` | `Book a Free IT Consultation` → `/contact/?type=review` |
| Contact inquiry selector | Absent | Label: `Inquiry type`; options: `General inquiry`, `Free IT Consultation` |
| Contact, JavaScript disabled | No consultation-selection instructions | `For a free IT consultation, select “Free IT Consultation” and briefly describe what you need below.` |
| Contact introduction | No form jump | `Go to the contact form` → `#contact-form` |
| Consultation AJAX acceptance | `Formspree accepted your message. Thank you.` | `Formspree accepted your consultation request. This does not confirm inbox delivery or schedule an appointment.` |
| Generic AJAX acceptance | `Formspree accepted your message. Thank you.` | Unchanged |
| Nearby actionable error contacts | Absent | `Prefer another way? Email info@itkeepers.com or call +961 81 816 761.` |
| Cached return from native provider verification | Form could remain locked | `Acceptance on Formspree has not been confirmed here. Check before resending, or use email or telephone.` |

The existing after-acceptance edit warning remains: `Your previous message was accepted. Changes have not been sent.` Existing provider error messages and both competition-preview/Privacy disclosures are unchanged.

## No-JavaScript and provider limitations

- This remains a static Astro site. **Without JavaScript, `?type=review` cannot automatically select the inquiry type or prefill the message.** Visitors must select Free IT Consultation and enter their message. The visible no-JavaScript instructions explain this. The native subject carries consultation intent; the extra hidden `type` field is intentionally omitted in this mode. With JavaScript, the existing legacy query and `type=review` payload remain supported.
- The homepage compact form already represents a consultation and still submits the consultation subject, `type=review` and request message without JavaScript; no manual selection is necessary there.
- Native/no-JavaScript submissions leave the site and use Formspree's hosted verification/confirmation UI. Local success wording applies to recognized AJAX acceptance only. This implementation does not control or verify the hosted provider's confirmation text or inbox delivery.
- Duplicate protection is per form instance. No persistent localStorage block, new server-side idempotency, Worker/SSR, dependency or infrastructure was added. Reloading can still permit a deliberate repeat request; uncertain outcomes continue to advise checking before resending.
- The previously documented Formspree account/recipient monitoring, provider spam settings, actual delivery and customer testimonial-permission checks remain separate owner follow-ups. The prior owner-attested delivery test is not reclassified as a fresh inbox test. Existing Privacy approval records are not silently changed.
- Physical-device and screen-reader verification are not claimed. Automated form checks and desktop browser engines do not establish full-site accessibility conformance. The existing dismissible homepage Playbook popup is unchanged; unobscured form screenshots use its existing dismiss button.

## Validation

Owner: Codex. Existing dependencies, Node22.23.3 for project build/type/tests. Browser providers are mocked and external network requests blocked.

| Check | Result |
|---|---|
| Complete existing tests plus two focused regressions | PASS, 227/227 |
| TypeScript | PASS, `npm run typecheck` |
| Production and staging builds | PASS, 20 pages each |
| Staging checker | PASS, 15 indexable / 5 held, 2 forms, 28 redirect rules |
| Chromium/WebKit, desktop1440/mobile390, both forms | PASS, 72 cases: validation, success, delayed acceptance/error, attempted edits, repeated submits,422,403,network failure,429,500 |
| Native verification and no-JS Contact payloads | PASS,12 cases: every required/optional supplied value, correct consultation subject, no duplicate field names; back navigation restores editing |
| Keyboard jump with JS enabled/disabled, both engines/sizes | PASS,8 cases: target focus/visible outline, sticky-header clearance, next Tab to selector, original query parameters retained |
| Manual JavaScript inquiry selection | PASS,2 engine cases: consultation classification and custom message preserved |
| Additional smoke checks | PASS,6 engine cases: actual15-second timeout restores editing; general success unchanged; no-JS homepage consultation preserved |
| Responsive/automated form accessibility | PASS,20 engine/route/width checks at320/390/768/1024/1440; no horizontal overflow or scoped axe violations |
| SEO audit and public-output security/placeholder audit | PASS, no failures/warnings or findings |
| SEO/schema preservation | PASS, identical titles/descriptions/social/canonical/robots metadata and JSON-LD on all20 pages |
| Routing and asset preservation | PASS, headers/redirects/robots/sitemap unchanged; all original public assets, office source, metrics, testimonials, navigation, animation source, Privacy and dependencies unchanged |
| Visual review | PASS, desktop homepage form and mobile Contact, existing design and office content retained |
| Real submissions | NONE; all AJAX/native provider POSTs intercepted using reserved test data |
| Git/release actions | NONE; branch and HEAD unchanged, all edits uncommitted |

Two added unit regressions verify accurate consultation success boundaries and consistent native/AJAX subject options. Browser tests exercise the actual generated forms, disabled-field behavior, submitted payloads and recovery rather than only source patterns. No project browser dependency was added.

Evidence: sibling `outputs/v2-phase3-consultation-fixes-20261027/` includes the starting source manifest/build, build/staging/type/test/SEO/security logs, `browser.json`, `smoke.json`, `seo-preservation.json`, screenshots and reproducible mocked browser harnesses. Existing local preview serves the final production build at `http://127.0.0.1:4411/` and `/contact/?type=review`.

## Exact files changed in this phase

1. `src/components/InquiryForm.astro` — native inquiry selector, subject/intent controls and nearby published error contacts.
2. `src/scripts/contact-form.ts` — payload-before-lock, field restoration, normalized native snapshot, intent synchronization, accurate success and cached-return recovery.
3. `src/data/formspree.ts` — shared subject helper and consultation-specific factual success message.
4. `src/styles/inquiry-form.css` — existing field/focus styles extended to the selector, full-width inquiry row and stable disabled appearance.
5. `src/pages/it-keepers-pulse.astro` — two requested consultation label/destination corrections.
6. `src/pages/contact.astro` — accessible form jump/target and scoped offset/focus styles.
7. `tests/formspree.test.mjs` — two focused behavioral/subject regressions.
8. `claims-register.md` — requested technical copy and factual/approval boundaries.
9. `PROJECT_STATUS.md` — decisions, checks, limitations and handoff.
10. `docs/V2_PHASE3_CONSULTATION_FUNNEL_FIXES.md` — this report.

No source from the office/metrics/testimonial/navigation/animation/Privacy/SEO/Worker/dependency scope changed. The native selector is the one additional input requested for progressive enhancement; no new page or redesign.

## Review and approval

Implementation blockers: none. New business assumptions: none. No unverified operational statement was published or proposed as a fact; no response-time or scheduling commitment is implied. Jim reviews exact copy and native/manual behavior. Existing separate Privacy/customer-permission/account verification items remain recorded. Commit, push, merge and deployment still require explicit owner approval; none occurred.
