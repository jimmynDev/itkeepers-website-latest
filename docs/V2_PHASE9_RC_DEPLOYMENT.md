# Phase 9 — Isolated V2 RC deployed and verified

27 October 2026, Asia/Beirut. The owner explicitly authorized **only** the new isolated RC. No branch merge, commit, GitHub push, existing-staging/production deployment, domain/route/secret change or real form inquiry occurred.

Live RC: **https://itkeepers-v2-rc-20261027.jimnassar99.workers.dev/**

| Item | Verified value |
|---|---|
| Account | `eabf58c0ea3cf8629b95c29042124f72` |
| Worker | `itkeepers-v2-rc-20261027` |
| Deployment ID | `136c9364-5b5d-41f9-90a0-4ada65ac97ec` |
| Version ID | `0aec0a19-30dd-49e6-9370-6ca1697fc34e` |
| Version / traffic | First RC version, number1,100%. |
| Created | `2026-10-27T18:28:02.955236Z` |
| Branch / HEAD | `codex/v2-business-locations` / `bfcd0322174c6bf5a00ed602c47c633fc9aaf337`, plus the reviewed uncommitted Phase1–8 candidate. No new commit. |
| Config | Root `wrangler.rc.toml`, SHA-256 `096ca8ba30f827ba4ecfbfea5f54da4c86255548355f0aa04894a1851e72298d`. |

## Preflight and deployment

Project-local Wrangler4.153.0 authenticated successfully to the correct account with Worker deployment scopes, using Node22.23.3. Cloudflare GET checks verified `jimnassar99`, the existing staging deployment and genuine404 for both proposed RC Worker settings and Service. No existing RC was overwritten.

All325 approved source files and118 RC artifact files matched Phase8 `release-integrity.json`. `npm run check:rc` passed:20 pages,0 indexable,2 preserved forms and exact target/binding/hostname/artifact isolation. The published artifact includes all Phase1–5 business-location, credibility, consultation and popup corrections, unchanged since approval.

This exact command ran once from the V2 root and exited0:

```powershell
npx --no-install wrangler deploy --config .\wrangler.rc.toml --no-autoconfig --strict --message "V2 Phase 1-5 isolated release candidate"
```

Only the new workers.dev target was published. Worker bundle6.76KiB/gzip2.67KiB; reported startup2ms. Bindings are ASSETS, the exact RC hostname and false local validation/delivery switches. No custom domain, DO, email, database, service, cron or secret binding; version-preview URLs remain disabled. No repair deployment or traffic adjustment was needed.

Evidence is outside the deployed assets in sibling `../../v2-phase9-rc-deployment-20261027/`: `preflight.json`, `deploy.log`, `live-release.json`, `http-rc.json`, live browser scripts/JSON/logs and `final-verification.json`.

## Hosted validation

**No confirmed technical defect was found within the tested scope.** Every provider submission was intercepted/mocked or aborted. Network guards allowed only RC GET/HEAD traffic outside the explicit mock handlers. No real inquiry was sent.

| Check | Result / evidence |
|---|---|
| Public pages/services | PASS, all20 HTML routes including homepage, service index and all7 service detail pages return200 on GET/HEAD;40 page requests. `http-rc.json`. |
| Approved artifacts | PASS, all116 publicly served files match approved SHA-256 values, including HTML, scripts, styles, images, fonts and PDF. `_headers`/`_redirects` are deployment controls, not public downloads. `live-release.json`. |
| Metadata/indexing | PASS, exact approved HTML proves canonical/OG/social/JSON-LD RC origins and approved geography/metrics. All pages have noindex meta; every tested response has `X-Robots-Tag: noindex, follow`. Robots permits public access; sitemap has0 entries and is not advertised. |
| Headers/documents/cache | PASS, CSP, nosniff, frame/referrer/permissions controls, HTTPS HSTS max-age86400, immutable fingerprinted assets, correct PDF bytes/MIME and noindex on GET/HEAD/304.7 document/robots/sitemap requests and7 API/missing/exposure probes. `http-rc.json`, `live-release.json`. |
| Legacy redirects/queries | PASS,28 permanent redirects retain `?type=review&phase8=rc`; the query's phase8 label is just the reused test marker. Consultation prefill and unrelated query parameters remain intact. |
| Browser/AI access | PASS, Mozilla, ChatGPT-User and Googlebot user agents receive200 and identical homepage content. No authentication/interstitial observed. Actual search-engine index membership is not asserted. |
| Full consultation matrix | PASS, Chromium/WebKit390/1440:72 validation/success/delayed-edit/provider-rejection/challenge/network/rate/server scenarios;12 native/no-JS payload cases;8 keyboard jumps;2 manual intent changes;20 scoped accessibility/reflow surfaces. `browser.json`. |
| Additional form smoke | PASS, six intercepted15-second-timeout/generic-success/no-JS-home cases. Generic success stays generic; consultation success distinguishes provider acceptance, inbox delivery and scheduling. `smoke.json`. |
| Navigation/responsiveness | PASS,56 surfaces (Chromium all20 routes, WebKit8 representative routes at390/1440),0 page errors/axe violations/overflow;30 additional320/375/768/1024/1440 reflow checks;6 keyboard-menu/jump checks;12 further consultation/native cases. `wide-browser.json`. |
| Motion/focus | PASS in tested scope: normal technology animation runs and platform reduced-motion removes the tested continuous animation in both engines. Sampled field centers are usable. Deployed animation code/styles match approved bytes; none was modified. |
| Popup regression | PASS,650 clearance checks at320/375/390/768/1024/1440 plus short viewport, focused/unfocused fields and normal/reduced motion;12 Contact surfaces;12 keyboard-dismiss/focus/persistence checks.0 page errors/external POST. `popup-browser.json`. |
| Visual review | Live Contact mobile screenshot reviewed; office cards, selector/prefill, form and footer retained. Desktop/mobile screenshots saved. No redesign/new page. |
| Source preservation | PASS,325 approved source files,118 local artifacts, Git HEAD/status unchanged through final live verification. Only local documentation was updated afterward. |

Phase8's238 tests, TypeScript and three builds validate the same unchanged source. Phase9 adds actual hosted checks; local results are not misrepresented as live results. No code/configuration/build artifact changed after publication.

## Existing staging/production preserved

Before and after deployment and live testing:

- Existing Worker remains `itkeepers-v2-staging`.
- Deployment remains **`dc77ddc8-0ee8-4ad3-bc8b-0d9bf3dad286`**.
- Version remains **`97cf3bf6-69c6-43db-b044-cc7704d41e72` at100%**.
- Remote bindings and compatibility date match preflight. Account custom-domain list remains empty.
- Fresh staging Home, Contact, Privacy, robots and sitemap body hashes match the saved records exactly; all five are recorded in `final-verification.json`.
- `wrangler.toml`/`wrangler.staging.toml` are unchanged. No command targeted production, an existing Worker, DNS or a custom route. No GitHub push occurred.

The official `itkeepers.com` zone was not visible in this personal account during preflight; its production DNS ownership/deployment ID is not claimed as verified. No operation attempted to change it. This deployment created only the authorized RC Worker and its workers.dev trigger.

## Outstanding issues and limits

1. **Real delivery unverified:** no real inquiry was authorized. Mocked live UI/payload/race/native/error paths do not prove provider acceptance for this hostname or inbox receipt. A controlled end-to-end delivery test needs separate authorization.
2. **Existing evidence follow-ups:** direct customer publication permission for the four retained testimonials remains undocumented in the inspected records; owner release authorization/booleans do not prove customer consent. Production Privacy/archive/domain decisions remain separate. No quote, attribution, metric, location or consent flag changed.
3. **Bounded coverage:** emulated Chromium/WebKit keyboard/motion/axe checks passed; physical devices, complete screen-reader/complex-background conformance and field performance are not certified. No new Lighthouse or response/delivery guarantee is claimed.
4. **First RC recovery:** version1 has no earlier RC version. Old staging IDs cannot roll back the new Worker. If withdrawal is needed, stop sharing it and obtain approval to remove only the RC; existing staging remains fallback. For later RC updates, retain known-good RC version `0aec0a19-30dd-49e6-9370-6ca1697fc34e` and its artifact hashes. No rollback/removal occurred.

These limits are not new confirmed application defects, and missing evidence has not been marked verified.

## Promotion recommendation

**Technical GO for a separately approved staging-specific release of the validated Phase1–5 source.** The live RC passes the hosted checks. Promotion itself remains unauthorized and was not performed.

Do not copy the RC artifact/configuration directly over the existing Worker: it deliberately accepts the new hostname, uses RC canonicals and applies blanket noindex. A future staging release must use the existing `wrangler.staging.toml` and a fresh checked `dist-staging`, retaining its approved15-indexable/5-held policy unless the owner separately approves a change. Phase8 already validated this environment separation.

Before any approved staging release, reverify account/current deployment/version/bindings/rollback availability, rebuild/check the staging-specific output from the reviewed source, preserve current97cf3bf6/backup, and review that target's rollout/rollback commands. Do not infer permission from this RC-only authorization. No official-domain release is approved or recommended by this report.

## Local documentation records

After successful live validation, only `PROJECT_STATUS.md`, `README.md`, `claims-register.md` and this new report were updated locally to record identifiers, results and authority/evidence boundaries. No deployed code/config/artifact, business wording, dependency or infrastructure setting was changed. No commit/push/merge.

Stop point: the RC is live and verified; the owner can review it and authorize the next target separately.
