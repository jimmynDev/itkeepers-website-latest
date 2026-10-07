# Phase 3 Step 2 — approved animation reference correction

6 October 2026. Latest owner instruction: reuse the supplied approved HTML concepts rather than invent replacement animations. Local implementation only; branch v2-full-services, inspected HEAD 92dd3cb8932710e2a94d260131481b7bb233f9a0. Existing dirty work preserved. Astro5.18.2 / Node22 / Cloudflare Worker static-assets configuration unchanged.

## IMPLEMENTED

Changed:
- src/components/HowWeOperate.astro
- src/components/animations/OperationalWorkflowAnimation.astro
- docs/PHASE3_STEP2_VALIDATION.md (points to this current correction)
- claims-register.md
- PROJECT_STATUS.md

Added:
- src/components/animations/KnowledgeContinuityAnimation.astro
- src/components/animations/HardwareAssessmentAnimation.astro
- src/scripts/approved-operate-animations.ts
- docs/PHASE3_STEP2_APPROVED_REFERENCES.md

The current correction baseline includes114 existing implementation/config/test files. Hash checks show only HowWeOperate and OperationalWorkflowAnimation changed among them. The two supporting components and scoped script are new. Homepage insertion/order, Who We Are/Team, Technology Ecosystem/rail/logos, Pulse, Client Proof, header CTA, emergency control, other services/internal pages, shared animation lifecycle, packages and footer are unchanged. No source HTML file was modified.

## HOW WE OPERATE

Existing headline and introduction remain: HOW WE WORK / From signal to resolution. / Monitoring, engineering context and internal escalation keep work moving without making the client coordinate the response.

Primary visual adapts incident-response.html's compact dark panel, three-dot support chrome, cyan vertical rail/nodes, travelling diamond ticket, assigned ownership cue and Detected → Owned → Resolved badge. Seven ordered HTML stages are Issue detected → Ticket created automatically → Engineer assigned → Client notified → Investigation → Resolved → Documented. This latest explicit seven-stage request replaces the original five-column preview. Content stays readable throughout; hypothetical automatic ticket/client update/outcome states are qualified by the visible Illustrative caption and timing limitation. No response-time or prevention promise is imported.

Documentation adapts yourITKnowledge.html's Environment → Client IT Record → Shared composition. Five environment categories populate five documented rows, then the example engineer changes A → B while Prior incidents / Configurations / User context remain. Caption and outcome communicate shared knowledge rather than a guarantee of perfect continuity. This is an open, compact supporting module, not another full-height standalone window or team-escalation animation.

Keep / Upgrade / Replace adapts the source diagnostic readout: CPU, RAM, Storage, Age, Warranty and Security compatibility are evaluated, then one fictional Upgrade outcome is highlighted. Keep and Replace retain full readable explanations. Visible Sample assessment / Example outcome / Illustrative labels make clear this is not a real client diagnosis or an interactive recommendation engine. No spend/savings, universal purchasing policy or security-baseline assurance is added.

Existing proactive-monitoring, internal-escalation, documentation and hardware-philosophy prose remains. The section retains its pale technical surface and navy/blue typography, with only the primary incident panel dark. No purple, duplicated cursor tracking, iframe, library or prototype page scaffolding was imported. Small diagnostic green/amber colors convey sample status; text explains each signal independently of color.

All three use unchanged mountAnimation and its scheduler. Total sequences4800/4300/3000ms respectively; purposeful entrance/capture/evaluation → settle. Offscreen/page-hidden pause; resume within the existing boundary; replay only after full160px buffered exit and96px entry. Fresh factory references are captured after pristine scene restoration. Completed semantic HTML is the no-JS/reduced-motion fallback; changing reduced motion during playback settles immediately. No continuously running glow/LED/flow animation or production replay UI copied from prototypes. Bounded ticket top interpolation and short color/border transitions are documented reference-preserving exceptions to the reviewed transform/opacity preference, not continuous loops.

Mobile retains the seven-stage vertical incident timeline, stacks Environment / Documented / Shared in normal flow and places the diagnostic readout before three readable outcomes. Typography is not scaled down from desktop to fit the visuals; labels are at least12px, incident stage text16px and supporting body text16px. Desktop support visuals are shorter than the primary incident figure.

## TESTIMONIALS

Unchanged: one future native player/facade, five marked video slots, four editorial written slots. No media, faces, quotes, attribution or client evidence was fabricated or added. B15 remains the missing approved videos/posters/captions/transcripts and exact quotes/attributions/permissions. The completed pending structure and existing single-player architecture remain as recorded in the original Step2 report.

## VALIDATION

- PASS: final Node22 npm run build,16 pages; node --test tests/*.test.mjs,62/62 pass. No new framework or dependencies.
- PASS:14 responsive day/night cases at1920/1440/1024/768/430/390/375; no page overflow, off-viewport text, duplicate IDs, browser errors or failed requests. Observed load CLS0 in these reduced-motion lab cases.
- PASS: six normal-motion lifecycle cases, all three visuals at375/1440: entry, real offscreen pause with frozen phase/content, resume, full completion, minor-scroll stability, meaningful-exit replay with reset rows/signals and live reduced-motion completion.
- PASS: six additional activity cases at375/1440: simulated document-hidden pause freezes scene content; return resumes and settles; no running descendant animation remains. Maximum measured finite-animation CLS.000244. This is a lab observation, not field data.
- PASS: four final built-page cases at375/1440 with JS on/off: seven completed incident stages, five record rows, Engineer B handoff, selected Upgrade example and complete phases.
- PASS:440 actual text/background samples at375/1440 in both themes, minimum4.931:1;320px text-spacing and200% text-size emulation without overflow. Independent Design additionally verified all descendants at320, no-JS and reduced motion.
- PASS: focused independent Design/UIUX, Copy and SEO/Performance source/render reviews. No confirmed actionable regressions. Root reviewed desktop/mobile reference and adapted screenshots. Vercel review rules refreshed2026-10-06 by Design.
- PASS: unchanged implementation-source hashes and scoped whitespace checks. New three-visual JS chunk3.27kB /1.12kB gzip, replacing the previous single .89kB/.48kB workflow chunk; existing lifecycle chunk reused. No runtime external asset requests introduced.
- Actual physical devices, Safari, native screen-reader/zoom, real client media, production checks and field Core Web Vitals unavailable/not run. Browser emulation and lab checks do not establish WCAG compliance or production readiness.

Evidence: C:/Users/Jim/Documents/Codex/2026-10-06/files-mentioned-by-the-user-it/outputs/phase3-approved-references/ contains original-reference screenshots; responsive/motion/fallback/pixel-contrast/reflow/scope JSON; final desktop/mobile captures and build/test logs. Activity evidence separately measures finite settling/no remaining running animations and simulated document-hidden behavior; simulation is not a native background-tab test.

## CLAIMS

P3-OPERATE-01..03 retain owner-supplied qualitative operating model/support/philosophy. Current illustrated incident wording and hypothetical knowledge/hardware states are separately recorded as Illustrative in the correction entries. Owner authorization for local reference adaptation does not independently verify operational claims or grant production publication of real client material. Prototype guarantees (“nothing to explain”, “hear from us first”, every-step updates, prevention, every-device assessment, no-spend or a universal security baseline) were omitted or qualified. No SLAs, metrics, savings, partnerships or fabricated testimonials added.

## ISSUES / DECISIONS

Only the supplied yourITKnowledge.html and onboarding.html exist; numbered (1) variants were not separately attached or found. The attached Knowledge file carries the requested documented-record concept and was used. No missing-source blocker was invented. onboarding.html stays available as an excluded reference; no onboarding module added. your-it-is-a-team.html stays associated with Who We Are; not imported into How We Operate. Downloaded source hashes:

| Reference | SHA256 | Use |
| --- | --- | --- |
| incident-response.html | B2CF3DC504D031801B17C6F498E62C7078ECF1C8080AFB63184152E917AD8A81 | Primary adapted story |
| yourITKnowledge.html | 2A99C19D7C57C4CF2C6E96BB7466F0F9AE5BF2B030DDAB6E9DEAAB650BA9DD51 | Compact documentation story |
| keep-upgrade-replace.html | E504FB8561E97B365844DFB3B95E4FB3A4D9429DC6D5561B5E9DFDDDF91FC416 | Compact sample assessment |
| onboarding.html | 2292D1F934AB1A1D46887BD4BFAA98C2D9E3106BD8D60DE2FCCA99331A1836AC | Reference only; excluded |
| your-it-is-a-team.html | 846AF5B1E328AF138E85BA71490EB14A6AC50F4079577CA791BDE98D78ABCE3D | Reference only; existing Who/Team preserved |

All references retained unchanged at C:/Users/Jim/Downloads/. Preview server restarted at4321 to clear stale dev CSS; built preview4330 retained. Local only: no commit, push, deployment, next-phase work or unrelated maintenance.

## NEXT

Ready for Phase 3 — final conversion, SEO, security and judge audit.
