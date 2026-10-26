# V2 consolidated release preparation

20 October 2026 · `codex/v2-prompt3-restored` · HEAD `22b5c2f9e74d9c734137036ec74a3db289c67761` plus preserved uncommitted work.

**NO-GO for production.** Safe preparation and local validation are complete; publication, privacy/inquiry and Cloudflare release gates below remain open. No commit, push, merge, deployment, production mutation or real inquiry was made.

## Completed changes and scope

- Prepared [private migration records](drafts/V2_RELEASE_MIGRATION_PREPARATION.json): 13 article reviews, six distinct area evidence briefs, six client-story structures, 12 media references, privacy data flow and future-backend acceptance contract. These files are outside `public/` and `dist/`; no unpublished story, city copy, media or placeholder page was added to the site.
- Verified all 13 original archive hashes, publication timestamps and URL/snapshot identities against existing captures. Re-extracted all three restored bodies: paragraphs/headings and original dates match exactly. No new image, invented author or modified date was imported. The remaining ten originals were already recovered in Phase 5.2; no verified publication-rights record was found for any of the 13. Added explicit rights/release-gate columns to [the article inventory](../legacy-article-inventory.csv). Prior retention instructions are separate from documented authorship/assignment/license.
- Existing three article routes remain **local candidates for review, not cleared for production**. No new article was restored or redirected; all ten blocked article routes remain genuine local 404s. The historical welcome announcement remains blocked as thin coming-soon content. Do not interpret temporary 404s as approved retirement.
- Six area briefs preserve the original Florida paths, source provenance and city-specific review questions. Historical copy differs, but **no genuinely distinct current delivery facts were verified**. Therefore no public city pages, city-swapped duplicates, office claims, schema or sitemap entries were created. Ops must supply real differences before page copy can be finalized.
- Six story records preserve original paths and prepare context → work → evidence-backed outcome → optional permitted media → service-link structure. Twelve asset references were catalogued without downloading/importing logos or videos. Full-story/name/media permissions and outcome evidence remain missing. Existing exact homepage testimonial approvals/copy are preserved and do not authorize complete cases or additional media.
- Privacy draft and public indexing remain unchanged; old `/privacy-policy/` stays unmapped. Prepared exact email-handoff data flow, owner decisions and future API contract without enabling an endpoint, new processor, analytics or collection. Current forms prepare a visitor-reviewed email; the website does not confirm delivery. A backend is required only if server delivery is approved launch scope.
- Fixed two reproducible semantic defects: removed `aria-label` from the generic `.business-services` container and paragraph `.business-service-line`; visible native text supplies their content. Removed the now-unused local constant. Added a built-HTML regression. WebKit reproduced the prior axe `aria-prohibited-attr` incomplete findings; after correction those findings are absent. No new WCAG conformance claim is made.

## Three restored article accuracy reviews

| Article | Review result / release action |
|---|---|
| Future of AI — 2023-09-28 | Historical forecast, not verified 2026 advice. Assertions of inevitable growth, accurate predictions and savings need qualification; more data alone does not establish reliability. Preserve original date and historical context; content owner approves corrections and rights. |
| Understanding Datafication — 2023-09-04 | Historical overview, not evidence of ITKeepers processing practices. Rights/consent passages are normative and jurisdiction-dependent; obtain qualified editorial/legal review rather than treating them as the company policy. Rights evidence also outstanding. |
| AI vs ML — 2023-10-05 | Subset distinction is supported. Correct implications that all AI learns from training data, deployed ML necessarily continues learning/improving, or NLP/computer vision cleanly separate AI from ML. Minimal proposed qualification is in the private record; approved article text was not rewritten. Rights evidence also outstanding. |

Technical review references: [IBM's machine-learning explanation](https://www.ibm.com/think/topics/machine-learning) distinguishes manually defined rules from learning; [NIST's trustworthiness framework](https://airc.nist.gov/airmf-resources/airmf/3-sec-characteristics/) requires contextual evaluation of reliability, privacy and harmful bias. These support qualifications, not publication rights or ITKeepers capabilities.

## Validation and preservation

| Check | Result / limit |
|---|---|
| Build / regression | PASS: Astro build **20 HTML routes**, **147/147 tests**, including new homepage semantics regression. |
| Dependencies / install | Fresh npm audit: **0 advisories**. No package/lockfile change; reuse Phase 5's successful isolated clean install instead of repeating it. |
| SEO / links / output | PASS: **19 indexable URLs**, unique metadata, production canonicals, OG/schema, sitemap/robots and internal URL/fragments; zero failures/warnings. Privacy remains noindex/excluded. Bounded public-output/security scan: zero findings. |
| Local Workers | PASS: all **28 existing 301 rules**, slash forms and query preservation, direct 200 targets/no chains or loops; production and preview-host fixtures across 20 routes. All **60 retained-URL variant checks** pass against candidate expectations. Four implemented retained canonical URLs are 200; slashless equivalents use existing Workers 307 folder normalization. Sixteen original retention URLs plus ten posts remain blocked 404s. |
| Header/cache smoke | PASS: **99 read-only local HTTP requests**, exact built metadata/schema/main links, CSP/security headers, crawler resources, 301s, true unknown 404, immutable fingerprints and HTML/304 revalidation. Preview noindex passes local fixture. This does not verify real TLS/account rules, deployed headers or Access. |
| Browser / accessibility | **70 focused checks pass** in installed Chrome 155 and Playwright WebKit 26.5: **42 layout cases** (seven routes × 320/390/1440 × two engines), **14 axe cases**, native semantics, emergency computed name, disclosure activation/focus restoration, invalid inquiry/chip keyboard controls, no-JS direct email, particle pause/resume and reduced motion. No unexpected external requests/POSTs, page errors or CSP events in layout cases. Mobile homepage screenshots inspected in both engines. Existing broader Phase 4.3 responsive/animation evidence reused for unchanged assets. |
| Tooling/manual limits | Firefox 153 downloaded but cannot launch: Windows side-by-side runtime configuration error. WebKit Windows harness skips native links on Tab, including the unmodified skip link; native link traversal is **BLOCKED**, not passed. WebKit used programmatic focus followed by real Enter/Space/Escape; Chrome native Tab checks pass. [Playwright tracks this setting limitation](https://github.com/microsoft/playwright/issues/5609). Not actual Safari or physical-device testing; screen-reader, speech input, manual zoom/text spacing and real mail-client/delivery sign-off remain open. Automated contrast incompletes remain manual-review items. |
| Preservation | Every starting file retained. Only public-output difference is removal of the two ARIA attributes in Home HTML; all other generated files are byte-identical. Exact hero H1, visible copy/main links, SEO/schema, CSS/JS/assets, animations, article bodies, E1/E2, Pulse/backup/emergency qualifications, robots/security headers and both redirect files unchanged. |

The first WebKit runner expected fresh 200 on cached navigations and assumed native Tab included links. External validation code was corrected to accept legitimate browser 304s and report the Tab limitation explicitly; no site behavior was altered to accommodate it.

## Remaining owner decisions and release gates

| Priority / owner | Exact decision/evidence needed |
|---|---|
| **P0 — Content owner / rights reviewer** | Establish authorship, assignment or license for all 13 article texts; approve technical/legal qualifications before production publication. Recovering a source or retaining its path is insufficient. No additional articles can safely proceed without this. |
| **P0 — Ops + content/client permission owners** | Supply six genuinely distinct current area delivery facts and scope boundaries; for six cases, verify project/outcome claims and obtain scoped client signatory permissions for names/text and each optional asset. Retention is already decided; do not reopen it or replace gaps with duplicates. Full agreed migration remains blocked: client index + six cases + six cities + Privacy + Reviews/Feedback (16 original URLs), plus ten posts. Reviews/feedback, taxonomies, page 2 and additional archive observations need their separate recorded outcomes; no arbitrary 410/redirect. |
| **P0 — CEO/Ops + qualified Privacy reviewer (B3/B13)** | Approve controller/contact/jurisdictions, actual purposes/rights/retention/processors/transfers, Cloudflare logs/cookies/analytics, mailbox handling and prompt-storage notice. Set effective date after approval; only then replace `/privacy/` and authorize any equivalent old-policy redirect. No legal sign-off exists. |
| **P0 — Inquiry owner (B3/B13)** | Approve mailto-only launch or separately approve a backend. Verify mailbox ownership/handling and authorize a controlled real delivery test. For backend scope, satisfy the prepared server validation/abuse/durable-acceptance/no-store/data-handling contract before setting `PUBLIC_CONTACT_FORM_ENDPOINT`. Current client fallback is technically usable; absence of an API is not itself a defect. |
| **P0 — Cloudflare/release owner (B11/B14)** | Establish account access, actual Worker/version/domain/preview inventory, Access policy and bypass checks, deployed header/cache/CORS settings, minimum TLS/applicable origin settings, and known rollback target/procedure. Approve exact artifact and release separately. Previous production observations showed the legacy React site; no new V2 deployment was made or verified. |
| **P1 — Named QA owner (B14)** | Complete Firefox on a working runtime, actual Safari/full keyboard access, screen-reader/speech input, zoom/text spacing, representative physical devices and approved mail-client/receipt test. Automated checks are scoped evidence, not full accessibility certification. |
| **P1 — Cloudflare + service/product owners** | Resolve prior www/HTTP two-hop consolidation with an approved direct path/query-preserving rule. Accept limited E1/E2 example scope or supply verified delivery responsibilities before stronger claims. Preserve Pulse under-development/sample-data notices, qualified restore testing and emergency enquiry boundaries; no new failure found in these disclosures. |

P2 after launch: assign dependency/header/certificate monitoring, review staged HSTS, observe real 404/indexing/query data and inquiry operation; do not infer field INP or rankings from local checks. A limited release would require explicit scope acceptance; it is not completion of the full retention request.

## Exact smoke tests after a separately authorized deployment

First close P0 and required P1 gates, rebuild the approved candidate and record its source/artifact hashes, Worker/version and rollback target. These commands are prepared; **no production smoke of a new V2 deployment has occurred**.

From the repository root:

```powershell
python -X utf8 scripts/audit-seo.py dist ..\v2-release-consolidated-evidence\approved-build-seo.json
python -X utf8 ..\v2-phase5-readiness-evidence\post-deployment-smoke.py --base https://itkeepers.com --output ..\v2-release-consolidated-evidence\production-smoke.json
```

The existing read-only helper was revalidated locally at 20 routes/28 rules/99 requests; it derives counts from the approved build. Never pass `--local-fixture` or a forged Host header as production evidence. It reports unresolved URL observations, not approval of their outcomes.

1. Confirm the exact deployed artifact/version and normal certificate validation. HTTP apex, HTTP www and HTTPS www must permanently redirect directly to HTTPS apex; repeat with `/services/managed-it/?release_smoke=1`, preserving path/query without loops. Account owner separately verifies minimum TLS and applicable origin settings.
2. GET all approved canonical routes without following redirects: 200 HTML with exact metadata/H1/schema/main links. Current candidate is 20 HTML/19 indexable; rebuild expectations after any approved content decision. `/robots.txt` must be text/plain, sitemap XML exactly approved indexable canonicals, Privacy excluded while noindex, unknown path genuine 404.
3. Check every source row in `redirects.csv` with and without `?utm_source=release-smoke&type=review`: exactly 301 to approved apex target, preserved query, target direct 200. Compare both slash variants of all 17 retention rows and 13 article rows against signed dispositions. Current blocked 404s do not constitute an approved migration outcome.
4. Verify enforced CSP, nosniff, frame/referrer/permissions policies, staged HSTS, no permissive CORS, HTML revalidation/304 and fingerprinted immutable caching. Inspect redirects/errors and any future API separately; validate that account-injected scripts do not break CSP.
5. For every actual preview/default/version/alias/custom host, signed-out requests to `/`, `/contact/` and a direct asset must not disclose private content. Verify Access policy and bypass inventory, then authorized sign-in, page noindex and production canonicals; repeat signed out after logout. Noindex alone is not access control.
6. Verify deployed Home/Contact mode and fixed destination match the approved launch mode. Test errors/fallback without sending. Only with explicit test-recipient authorization, exercise email-client handoff and receipt, or approved server acceptance/error/rate-limit/delivery cases. No false success or unintended collection.
7. Run keyboard and manual browser/device sign-off, exact Emergency visible/computed name, particle pause/offscreen/reduced-motion behavior and contextual Home links. Confirm Pulse, backup, emergency and held AI/Web boundaries. Check blocked drafts/assets remain outside public output.
8. Save redacted evidence with version/time and recheck after cache revalidation. Any wrong artifact, broken required route/redirect, missing preview auth, false delivery success or CSP break stops promotion and invokes the approved rollback process.

Evidence: sibling `v2-release-consolidated-evidence/` contains the 346-file starting snapshot, article provenance, build/tests/audits, runtime/status/smoke results, browser diagnostics/screenshots and preservation comparison. Reused clean-install and wider browser evidence are identified above. **Stop for review; not deployed.**
