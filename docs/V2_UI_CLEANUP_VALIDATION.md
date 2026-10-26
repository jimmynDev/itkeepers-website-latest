# V2 UI cleanup — local review, 26 October 2026

Scope: the owner's latest form/contact, decorative controls and hero example-label cleanup. Current checkout is `codex/v2-prompt3-restored`, inspected HEAD `e86d5ff1f7f22ee0135d6071f8377106c0a31260`. Existing unrelated working changes were preserved. The configured deployment remains Cloudflare Worker with static assets; no deployment action was performed.

## Done and decisions

- Removed the requested form introductions, privacy/processor paragraphs, repeated contact fallback sentences, optional service selector, confidentiality helper and closing CTA description. Kept titles, required name/email, optional company/phone, contact message, honeypot, fixed Formspree destination, native constraints, validation, status messages and contextual provider-verification fallback. The latter only appears after a verification challenge or unconfirmed request; it is necessary error recovery.
- Removed service-selection UI, client state, browser payload serialization and mailto body content. Review intent still comes from `?type=review`; invalid values fall back to general, and review message prefill remains. The disabled first-party worker's legacy input validator is retained because the worker still uses it. Worker and CSP files are byte-identical to the starting snapshot.
- Kept the Privacy page and its processor, competition-preview, inbox, retention, transfer and rights disclosures. Corrected only the obsolete service-interest reference in its collected-fields sentence, so it matches the simplified forms. All other Privacy content is identical to the starting snapshot.
- Simplified the three contact cards to a heading and actual phone, email or emergency link. No new claims or services were introduced.
- Removed standalone hero/background/particle controls and their markup, styles, event handlers and state. Removed the obsolete hero network component. Decorative loops preview for at most five seconds; short finite service stories finish normally. The shared lifecycle stops final-frame CSS/SMIL loops and renderer activity as well as JavaScript scheduling. Existing viewport suspension, meaningful entry/replay, reduced motion and interactive experiences remain. Hero headline motion briefly previews a capability, then settles on the original brand line by five seconds; its text/layout and all six phrases remain.
- Shared finite-preview helper also governs the panel, continuous services background, technology rail and business-circle orbits. No-JS and reduced-motion states are static. Emergency status-dot motion is one 3.2-second iteration. Interactive controls such as testimonial navigation, video playback, menus and tool inputs are preserved.
- The hero status panel reproduces the attachment's layout, fonts, spacing, radius, badges, text and initial animation timings in a scoped Astro component with ITKeepers colors. Fonts are self-hosted with their OFL licenses. The owner's later cleanup replaces the original header text with **Example view**, removes the external caption and pause control, and settles scan/beam/activity motion. The accessible figure description explicitly says sample data, not live monitoring. No hero wave overlaps it; hero background, lighting, copy, CTA, metrics and navigation are preserved.
- Fixed a form retry defect found during browser QA: provider field errors persist on blur, preventing error removal from moving the submit button between pointer down/up. Editing or resubmitting revalidates. Forced-colors submit controls use ButtonFace/ButtonText to retain readable labels.

## Validation

Owner for implementation and automated checks: Codex. Evidence is in sibling `outputs/v2-ui-cleanup/`; original panel reference evidence is in `outputs/v2-hero-status-panel/`.

| Check | Result | Evidence / boundary |
| --- | --- | --- |
| Astro build | Pass | `build.log`; 20 pages, Node 22.23.3 |
| TypeScript | Pass | `typecheck.log`; `npm run typecheck` |
| Existing and relevant tests | Pass | `tests.log`; 206/206; updated removed-feature expectations and added finite-preview/lifecycle coverage |
| Forms and provider feedback | Pass | `review.json`; 20 intercepted POSTs across home, contact, review intent and invalid intent. Required/invalid fields, focus, 422, 403 challenge, 429, network failure, retry, acceptance, edit-after-acceptance and payload allowlist. No real inquiries sent. |
| No-JS validation | Pass | Native POST destination/method and required constraints on both forms; no service selectors |
| Responsive / automated accessibility | Pass | Home/contact at 320, 390, 768, 1024 and 1440px, plus contact light/forced colors; no horizontal overflow or broken ARIA references. Zero axe WCAG A/AA findings in tested configurations. Forced system-color contrast reviewed visually; axe contrast is excluded only in that emulation because it cannot evaluate effective system-color painting. |
| Five-second motion limit | Pass | Real elapsed-time hero/services checks in `review.json`, plus clock-driven checks of CSS/SMIL/canvas roots in `site-review.json`; no decorative controls across all 20 routes |
| Panel fidelity | Pass | `reference-comparison.json`: zero geometry/typography differences at 320/390/901/1024/1440px after applying only the later Example view / stopped-beam changes to the comparison reference |
| Touch / keyboard / contact links | Pass | `site-review.json`; mobile emulation, labeled form tab order/focus, phone/mailto/emergency destinations |
| Protected content | Pass | `site-review.json`; Worker/CSP hashes unchanged; Privacy differs only by the corrected field list |
| Vercel guideline review | Pass for scoped implementation | Official skill and current rules retrieved 26 October 2026; applied to changed UI, keyboard/focus, error states, reflow and motion. Fixed retry layout movement and forced-color submit label. No remaining scoped actionable finding. |
| Production delivery / deployment | Not applicable | Local-only request; mocked provider acceptance does not verify actual mailbox delivery |
| Physical devices, Safari, screen-reader speech, actual browser zoom, field performance | Blocked/manual follow-up | Not performed; responsive emulation and axe do not establish those results. Owner: project owner/manual QA. |

Guideline sources: [Vercel skill](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md), [current review rules](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md).

## Handoff

Done: implementation and local checks above. Decisions: keep useful error recovery and the Privacy disclosures; replace decorative controls with finite previews; identify the panel inside its own header. Proposed assumptions: none required. Implementation blockers: none. Needs review from: project owner, desktop/mobile visual review. Files changed: form/CTA/contact/Privacy, scoped hero panel and fonts, ambient helper/shared lifecycle, affected decorative components, related tests and project records; see evidence change inventory. Deployment: local only, no commits, pushes, merges or deployments. Next: owner visual review at `http://127.0.0.1:4400/` and `/contact/`.

Final evidence: `site-review.json` passed 20 routes, 21 motion roots and six mobile form keyboard targets. The message field remains partially exposed while Chrome positions its caret, with visible focus; subsequent Tab scrolls the submit button into view. All tested CSS/SMIL and canvas roots are stationary after their finite preview. Final build/typecheck and 206 tests passed after the Privacy field-list correction.
