# Phase 3 Step 2 — local implementation and validation

The subsequent owner-directed approved-reference correction supersedes this report's original five-stage visual and supporting static modules. Current implementation, source provenance and validation are recorded in [PHASE3_STEP2_APPROVED_REFERENCES.md](PHASE3_STEP2_APPROVED_REFERENCES.md). Client Proof remains as described below.

Date:6 October2026. Owner brief:a121c531-a945-4112-87f2-e11337dc8670/Pasted text.txt. Repository:C:/Users/Jim/Documents/Projects/itkeepers-website-latest; branch:v2-full-services; inspected HEAD:92dd3cb8932710e2a94d260131481b7bb233f9a0, with earlier local changes preserved. Astro5.18.2, npm, Node22.23.3; existing Cloudflare Worker static-assets configuration. No release or deployment performed.

## IMPLEMENTED

Two sections inserted after WhoWeAre and before unchanged TeamThread/following content. Only existing implementation file changed:src/pages/index.astro. Added:

- src/components/HowWeOperate.astro
- src/components/animations/OperationalWorkflowAnimation.astro
- src/components/ClientProof.astro
- src/data/client-proof.ts
- src/scripts/client-proof.ts
- tests/client-proof.test.mjs
- docs/PHASE3_STEP2_VALIDATION.md

PROJECT_STATUS.md and claims-register.md updated separately. Source hashes cover107 preexisting implementation/test/config files; only index changed, and removing its two imports/tags restores the prior homepage byte-for-byte after line-ending normalization. Technology/Who surfaces, rail/artwork, TeamEscalation, Phase2 animations, header/CTA/emergency, floating playbook, following sections, internal pages, footer, lifecycle utilities and dependencies remain unchanged.

## HOW WE OPERATE

HOW WE WORK / **From signal to resolution.** Supporting sentence:“Monitoring, engineering context and internal escalation keep work moving without making the client coordinate the response.” Ordered semantic Detect→Assign→Investigate→Resolve→Document stages remain readable throughout the animation and without scripts. Four editorial stories:proactive monitoring, internal escalation, prominent documentation/operational memory, and deliberate Keep/Upgrade/Replace decisions. No ticket-pickup figures, coverage guarantee, prevention claim or purchasing-independence assertion.

Structured pale surface blends from Who's #FAFCFE into #EDF3F8. Navy typography, restrained panel, thin blue connectors; no purple or glass cards. Documentation gets greater editorial weight rather than an equal-card feature grid. Mobile/tablet≤900px shows the process vertically at16px description size. Small blue labels use a slight brand-blue/navy mix to retain contrast on the pale surface.

Reuses existing mountAnimation unchanged. Detect starts with the incoming signal; Assign850ms, Investigate1700ms, Resolve3000ms, Document3850ms; complete/settle4800ms. These are presentation timings, explicitly qualified as illustrative. No loop/ambient activity; offscreen/document-hidden pause,96px entry and160px meaningful-exit replay remain existing lifecycle behavior. Reduced-motion and no-JS present all five completed steps. Decorative source/context/connection elements are hidden from assistive technology; meaning stays in the ordered HTML and accessible caption.

## TESTIMONIALS

CLIENT PROOF / **What clients say after the handoff.** Current media/content state is explicitly pending at heading, frame, caption, five disabled numbered selectors and four written slots. One fixed16:9 media frame; two-column editorial text rows on desktop, one column mobile. No real video, poster, client face, quote, attribution, rating or review schema supplied or emitted.

src/data/client-proof.ts defines exactly five video/four quote slots. A video is available only when approved and sources/poster/captions/transcript exist; a quote requires approved exact content. Replace pending values only with permitted, reviewed client material. Missing input:B15, owned by Jim/client-content owner. Five videos and four text testimonials were reported by the owner; their actual content and permissions remain Open. The explicit brief authorizes these marked local slots despite general placeholder restrictions. No [[INPUT-PENDING]] tokens are exposed.

Future configured media uses one native controls/playsinline/preload=none player behind a lazy poster facade. Explicit Play loads only the selected MP4/WebM sources and captions; selection pauses/releases prior sources and updates poster/transcript; offscreen/document-hidden pauses without auto-resume. Pending play attempts are invalidated on pause/selection to avoid stale focus or error announcements. Script-free approved content exposes direct video/transcript links instead of a nonworking Play button. No YouTube/Vimeo provider, iframe, external processor or autoplay/audio was added. This architecture is exercised with simulated media in unit tests; actual footage/codec/caption-delivery/native media keyboard verification is unavailable until approved assets arrive.

## VALIDATION

- PASS: final npm run build under Node22,16 static pages; node --test tests/*.test.mjs,62/62 pass. Five new native regression tests cover pending no-op, explicit selected source/caption loading and release, interrupted playback focus safety, stale completion after hide/selection, and duplicate-initialization/cleanup.
- PASS:14 Chrome viewport/theme cases at1920/1440/1024/768/430/390/375; no horizontal overflow, clipped text, duplicate IDs, console/page errors or failed requests. Five pending selector targets≥44px; media count/request count0. H2/H3/ordered-list meaning is present statically. Observed CLS0 in these cases; this is a lab observation with pending media, not a promise for future files.
- PASS: unchanged Technology→Who light treatment revalidated at all seven widths/both themes. Decoded logo gap remains40–60px; exact10-vendor group; actual boundary pixel step0. Source hashes confirm both components and rail/team assets unchanged.
- PASS:375/1440 normal-motion entry threshold, real offscreen pause/frozen phase, resume, settle, minor-scroll stability, meaningful-exit replay, live reduced-motion settlement. Document-hidden event behavior additionally tested by browser simulation.
- PASS:352 actual rendered text-background samples at375/1440/both themes, minimum4.922:1. Small-label contrast corrected during QA.320px text-spacing and200% text-size emulation pass without page/text overflow; selectors wrap and retain touch sizes. Independent Design rechecked its initial narrow-label issue after the fix.
- PASS: four final built-artifact cases at375/1440 with JavaScript on/off; complete static/reduced workflow, pending content honesty, one H1, unchanged canonical/schema/header/footer and zero proof-media/embed requests. Built new chunks:workflow.89kB/.48kB gzip; client-proof2.37kB/1.01kB gzip. No dependencies added.
- PASS: root visual review of complete desktop/mobile captures, independent Design/UIUX, Copy and SEO/Performance reviews. Vercel review rules refreshed2026-10-06. Future media focus race found in review, corrected and covered by regression tests. Scoped source and whitespace checks pass.
- UNAVAILABLE: actual testimonial playback/caption quality, physical touch hardware/native Safari/screen reader, production release checks and field Core Web Vitals. No WCAG compliance or production certification claimed.

Evidence:C:/Users/Jim/Documents/Codex/2026-10-06/files-mentioned-by-the-user-it/outputs/phase3-step2/ — build.txt,tests.txt,responsive.json,motion.json,pixel-contrast.json,reflow.json,built.json and full section/reflow PNGs.

## CLAIMS

P3-OPERATE-01..03 record exact qualitative process/support/decision wording as employee-reported, authorized for this local implementation by Jim's current brief and maintained project account. P3-OPERATE-04 records the conceptual visual as Illustrative. P3-PROOF-01 records authorized pending structure separately from Open real client evidence/media/quote permissions. No entry becomes independently Verified; no stats, SLA promises, certifications, formal partnerships or invented client results were added.

## ISSUES / DECISIONS

Actual testimonials remain deferred only because required content/assets/permissions are absent. Complete marked slots and the future single-player architecture are implemented as requested. Pending selectors intentionally do not pretend to play media. Current later TeamThread/Workflow content is preserved despite narrative overlap, as required. No final CTA/footer work, SEO overhaul, internal-page work, dependency/security maintenance, commit, push or deployment. Local dev4321 remains running; built preview4330 used for verification.

## NEXT

Ready for Phase 3 — final conversion, SEO, security and judge audit.
