# V2 contact form and email handoff — 13 October 2026

Done on current V2 branch `codex/v2-prompt3-restored`, inspected HEAD `fc3ccf4`. Existing dirty work was preserved. This request supersedes the previous missing-endpoint requirement to hide the form. No branch switch, merge, commit, push, deployment or dependency change was performed.

The contact form is now always rendered. Without `PUBLIC_CONTACT_FORM_ENDPOINT`, the cyan CTA reads **Continue to email**, followed by **Your email app will open. Review and send your message there.** Required name, work email and message, optional company/phone, eight optional chips, inline validation, credentials warning and Privacy notice remain. Review URLs prefill the message and hidden review type; all other types normalize to general.

After validation, the form prepares a `mailto:info@itkeepers.com` URI. Its subject identifies a general inquiry or free IT review. Its body includes the completed fields, hidden inquiry type, readable selected service labels and multiline message. Subject/body parameters are encoded so visitor text cannot create recipients or mail headers. No email-mode HTTP submission or sent/received confirmation occurs; the visitor reviews and sends through their email application. Values remain in the form.

A valid same-origin endpoint configured at build time automatically selects the existing backend submission path after rebuilding. Only successful JSON `{ "ok": true }` after confirmed delivery reveals the success confirmation. HTTP, content-type, JSON, network and timeout failures announce that delivery could not be confirmed, preserve the form/details, restore the CTA and permit retry. The backend timeout and navigation cancellation cleanup remain. Default unavailable panels and duplicate contact buttons were removed, along with their unused styles.

The shared compact homepage review form follows the same delivery-mode switch and retains its existing review message and field arrangement. Contact-page layout, cards and stylesheet are unchanged. No unrelated homepage/service/navigation content was edited by this task.

Files changed by this task:

- `src/components/InquiryForm.astro`: always-rendered form, delivery-mode attributes, email label/note, no default fallback or duplicate actions, conditional backend confirmation, focusable error status.
- `src/data/inquiry.ts`: pure email-draft composition with encoded parameters and validated interest labels.
- `src/scripts/contact-form.ts`: email/backend routing, retained validation/prefill/chips, retryable announced backend errors.
- `src/styles/inquiry-form.css`: email-note typography; remove unused fallback/button selectors.
- `tests/free-it-review.test.mjs`: update obsolete default-fallback assertions and add three email-composition regression tests.
- `PROJECT_STATUS.md` and this handoff: decisions, validation and remaining configuration.

Validation by Codex:

| Check | Result | Evidence |
| --- | --- | --- |
| Production build | Pass | `npm run build`, 16 pages |
| Regression tests | Pass | `node --test tests/*.test.mjs`, 114/114, including three new composition tests |
| Responsive/visual layout | Pass | 360, 768, 1440px; dark/light; email/backend modes: 12 cases; screenshots reviewed |
| Text/CTA/focus | Pass | Minimum measured contact-text contrast 6.46:1; cyan CTA computed 16px/600/dark text; Privacy notice 14px; visible keyboard focus, no navigation obscuration |
| Overflow/order | Pass | No horizontal overflow; centered container at most 1100px; desktop form left/cards right, mobile Call/Under Attack above form |
| General/review flows | Pass | Type/prefill, completed draft fields/services, valid optional blanks, unknown type normalizes to general |
| Validation/keyboard | Pass | Three required inline errors, malformed email, described errors/invalid-field focus, native Enter/Space details/chips, exclusive Not sure, repeated initialization |
| Email handoff | Pass | Actual submit handlers exercised with only final mailto navigation captured; decoded URI verified; no POST or false delivery confirmation |
| Compact review regression | Pass | Homepage form creates a review draft with its existing hidden review message |
| Configured backend | Pass | Browser mocks: confirmed success, HTTP failure, HTML, negative JSON, invalid JSON, network failure and 15-second timeout; form/data available after failure |
| Whitespace | Pass | `git diff --check` |
| Actual mail application / real delivery | Not performed | Browser test captures handoff; no real email application launch or message transmission |
| Native screen reader / physical devices | Not performed | Browser semantics and keyboard checks do not establish these results |

Evidence lives in sibling `outputs/v2-contact-email-evidence/`: build/tests/final-test logs, repeatable `audit-contact.mjs`, responsive/behavior JSON, 12 screenshots and baseline/preservation hashes. Uses existing bundled Playwright and installed Edge without adding a project dependency. Email-mode checks exercise the production build. Backend checks use a separate local process with a temporary mocked endpoint; that process was stopped after testing, and the variable was not saved in configuration.

Preservation hashes show changes only to the five listed implementation/test files plus `tests/home-motion.test.mjs`, which was edited concurrently by unrelated work and retained. Other pre-existing dirty files, including supporting-copy and homepage/service content, were preserved. This task did not modify those files.

Remaining backend requirements (B3/B13, ITKeepers Ops/project owner): provide a working same-origin API; server-side field/interest validation and abuse controls; confirmed durable delivery/routing to the inquiry owner; reviewed data handling/retention and final Privacy notice; then set `PUBLIC_CONTACT_FORM_ENDPOINT`, rebuild and verify real delivery and failure behavior. The assets-only Worker currently contains no inquiry API. No response-time claim was added; the TODO remains.

No new factual assumptions. Needs review: Jim's visual review of `http://127.0.0.1:4366/contact/` and `http://127.0.0.1:4366/contact/?type=review`. Deployment: not deployed. Stop for visual review; merge/push/deploy remain outside this authorization.
