# Personal Cloudflare staging — review before deployment

> **Superseded access model:** On 21 October 2026 the owner explicitly changed this preview from private Cloudflare Access to a public link-only workers.dev preview. Do not complete Zero Trust onboarding or use the Access deployment commands below. The current configuration and live evidence are in `V2_PERSONAL_CLOUDFLARE_STAGING_DEPLOYMENT.md`; this document remains as the original private-preview design record.

Prepared 21 October 2026 on `codex/v2-prompt3-restored`, HEAD `22b5c2f9e74d9c734137036ec74a3db289c67761` plus preserved uncommitted work. **Local preparation passes. Deployment and account changes have not been performed or authorized.** This is a private preview, not production release approval.

## Prepared configuration and boundaries

Use **`wrangler.staging.toml` explicitly**, never the default `npm run deploy`. It is standalone, not an inherited production environment.

| Control | Prepared behavior |
|---|---|
| Address | Only `itkeepers-v2-staging.<PERSONAL_WORKERS_SUBDOMAIN>.workers.dev`; no routes/custom domains or DNS changes |
| Authentication | All requests enter the Worker before assets. Exact primary hostname and signed Cloudflare Access JWT required; blank/invalid configuration denies everything with403 |
| Other entry points | `preview_urls=false`; other hosts denied even with a valid JWT. Account inventory and real Access policy still require owner verification |
| Indexing | All20 HTML pages have noindex/nofollow, all Worker responses carry X-Robots-Tag, staging robots disallows crawling |
| SEO/content | Production `https://itkeepers.com` canonicals, Open Graph/schema, sitemap URLs, design, copy, animation code and28 redirects retained |
| Contact | Both public APIs disabled before reading bodies. POST503, other API methods405 after authentication; default email-app and telephone fallback retained. No Turnstile widget, server collection or delivery |
| Isolation | No Durable Object, migration, mail, database, queue, service or cron binding; no production handler imported |
| Privacy/cache | No application request/body/identity logging; Worker observability disabled. All responses private/no-store. Cloudflare Access/platform logging remains an account-level dependency |

`scripts/build-staging.mjs` creates ignored `dist-staging/`, forcing contact flags off regardless of shell settings. It changes only robots metadata, robots.txt and staging headers. `scripts/check-staging.mjs` compares it against a normal production build: all other files must be byte-identical. Never serve `dist/` as this private preview.

The staging Worker verifies RS256 signatures, issuer, application audience, expiry and not-before using trusted team JWKS; spoofed email/identity headers cannot authenticate. Pinned `jose@6.2.13` is imported only by staging server code, with no client bundle change. Worker validation supplements the mandatory Access edge policy; it does not replace policy/session revocation. Cloudflare's current static-assets router does not pass `ctx.access` to user code, so that property is not used. See [Workers Access](https://developers.cloudflare.com/workers/configuration/cloudflare-access/) and [JWT validation](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/).

## Owner inputs required

- Personal account ID and its existing workers.dev subdomain; verify the Worker name is unused or belongs only to this preview. Never overwrite an unrelated Worker.
- Zero Trust team domain, exact-hostname Access application AUD and explicit permitted reviewer identities. No service-token bypass is prepared.
- Authorization for future deployment/Access setup, named owner for remote acceptance and eventual preview removal.

No credentials, account IDs, real tokens or fabricated Access values were saved. The three checked-in Access variables intentionally remain blank. They are identifiers, not secret keys; supplying only some of them cannot enable the site.

## Future setup — do not execute until separately authorized

Run from the repository root with the package-required Node22 (`^22.12.0`; tested22.23.3), npm and Python3.11+ available. No inbound email routing, Microsoft365 MX, company DNS or custom domain is needed.

1. In the personal Cloudflare account, record its account ID and workers.dev subdomain. Set up/select the personal Zero Trust team. Authenticate Wrangler to that account if necessary (`node node_modules/wrangler/bin/wrangler.js login`), then verify account identity with `whoami` below. Stop on an account/name mismatch.
2. **Before any deployment**, create a self-hosted Access application for the exact future hostname `itkeepers-v2-staging.<PERSONAL_WORKERS_SUBDOMAIN>.workers.dev`, covering **all paths** (leave Path empty). Configure an Allow policy for only named reviewer email addresses or the approved IdP group, using the selected identity provider/one-time PIN. Do not use Everyone, Bypass or public paths. Record that application's AUD and `https://<ZERO_TRUST_TEAM>.cloudflareaccess.com` issuer, without trailing slash. See [self-hosted applications](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/self-hosted-public-app/) and [policies](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/).
3. Perform a **locked bootstrap deployment with blank Access variables**. Even if edge protection is not ready, the Worker must return403 before serving any candidate content. Use the first command group below only after authorization.
4. Once the Worker exists, go to **Workers & Pages → itkeepers-v2-staging → Access → Protect this Worker behind Access → All traffic**, set the same explicit reviewer restriction and apply Access. Inspect all apps/policies for unintended Bypass rules. Keep the exact-hostname application: it takes precedence over Worker-level Access, so its AUD must be the value supplied to the Worker. Worker-level protection covers additional Worker entry points; the application hostname guard independently rejects them. See [Workers Access scope and precedence](https://developers.cloudflare.com/workers/configuration/cloudflare-access/).
5. Keep version/alias preview URLs disabled in the dashboard and confirm workers.dev is the only configured route. Do not add a custom domain. Then deploy with all three real non-secret identifiers, using the second command group.

```powershell
# FUTURE AUTHORIZED OPERATOR ONLY. Run in the repository root.
$env:CLOUDFLARE_ACCOUNT_ID = '<PERSONAL_ACCOUNT_ID>'
node node_modules/wrangler/bin/wrangler.js whoami
# Confirm personal account, Worker name and all-path hostname Access app first.
npm ci --ignore-scripts
npm run build
npm run typecheck
npm run build:staging
npm run check:staging
node --test tests/*.test.mjs
npm audit
node node_modules/wrangler/bin/wrangler.js deploy --config wrangler.staging.toml --dry-run --outdir .wrangler/staging-dry-run
# Review: ASSETS and five variables only; NO migrations or mail resources.
# Locked bootstrap: checked-in Access values must still be blank.
node node_modules/wrangler/bin/wrangler.js deploy --config wrangler.staging.toml
```

After applying **All traffic** Access and checking its policies:

```powershell
$stagingHostname = 'itkeepers-v2-staging.<PERSONAL_WORKERS_SUBDOMAIN>.workers.dev'
$stagingIssuer = 'https://<ZERO_TRUST_TEAM>.cloudflareaccess.com'
$stagingAudience = '<EXACT_HOSTNAME_ACCESS_APPLICATION_AUD>'
# AUD expected as the 64-character hexadecimal application value, not a token.
node node_modules/wrangler/bin/wrangler.js deploy --config wrangler.staging.toml --var "STAGING_HOSTNAME:$stagingHostname" --var "STAGING_ACCESS_ISSUER:$stagingIssuer" --var "STAGING_ACCESS_AUD:$stagingAudience"
```

Replace placeholders before executing; never paste JWTs, API tokens or secrets into these commands or documentation. Re-supply the three identifiers on every future functional deployment: checked-in blank values deliberately fail closed. Do not enable contact flags or copy production secrets/bindings. Deployment itself rebuilds the staging artifact via the configuration's build command.

## Exact remote acceptance checks after future deployment

Record account, Worker/version IDs, Access application IDs/AUD, policy reviewers and test time. No such remote checks have been performed here.

1. From a fresh signed-out browser, request `/`, `/contact/`, one actual `/_astro/` asset URL, `/robots.txt`, `/sitemap.xml`, a source path from `redirects.csv`, an unknown path and `/api/contact`. Require Access login or401/403 with no candidate page, asset or redirect leakage. A forged `Cf-Access-Jwt-Assertion` or identity header must not grant access. Check both GET and POST APIs with synthetic content only.
2. Sign in as an allowed reviewer. Home/Contact and all20 HTML routes must render; exact Home H1 remains “Your IT person is a team.” Check mobile menu, keyboard focus, animations/reduced motion and email/phone fallback. Deny a non-allowed identity.
3. Inspect authenticated page/asset/redirect/error/API responses: X-Robots-Tag noindex/nofollow and private/no-store. HTML robots must match; canonical/OG/schema/sitemap must still reference the production host. Staging robots must be `User-agent: *` plus `Disallow: /`.
4. For all28 rows in `redirects.csv`, request each listed slash variant with redirects disabled, then repeat with a harmless query string. Require one301, preserved query and matching V2 target on the same staging host. Request each target directly:200, no extra redirect. Do not follow a Location to the production host. Check slash normalization of direct V2 links separately.
5. Authenticated POST to `/api/contact` and `/api/inquiry` must return503 `{ok:false,code:'contact_unavailable'}` with no body storage, mail or success UI. GET/OPTIONS must return405 with Allow POST. Use synthetic input only. Inspect bindings to confirm ASSETS only, both flags false and no mail/DO/provider secrets.
6. Sign out and repeat protected page/asset requests; cached private content must not be newly served. Inventory every version, alias, preview and domain entry point in the account. Version/alias URLs must be disabled; any unexpectedly reachable alternate host must deny candidate content, even with an otherwise valid session. Never infer policy coverage from checking only Home. See [preview URL controls](https://developers.cloudflare.com/workers/versions-and-deployments/version-urls/) and [workers.dev routing](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/).

If any check leaks content, leave Access enabled and restore the blank-variable locked version immediately. The existing `scripts/verify-release.py` remote guard targets production; do not use its `--allow-production` switch for this staging task or accidentally test itkeepers.com.

## Rollback and cleanup

Record the locked bootstrap version ID and each approved functional version, variables, source snapshot and assets before changing staging. Only roll back within this **same personal-account staging Worker**, to a version that includes the Access/hostname gate and disabled contact handler:

```powershell
$approvedStagingVersionId = '<RECORDED_COMPATIBLE_STAGING_VERSION_ID>'
node node_modules/wrangler/bin/wrangler.js rollback $approvedStagingVersionId --config wrangler.staging.toml
```

Keep Access policies active and preview URLs disabled; repeat signed-out/in checks. The locked blank-variable version is a safe403-only fallback. Do not roll back to an unguarded historical production Worker. Do not delete namespaces/resources or modify mail/DNS as recovery.

Production `wrangler.toml` still contains the prepared InquiryGuard Durable Object migration and email binding. It was preserved, not used: deploying it can create resources and impose class-migration rollback constraints. Staging has no class/migration changes, avoiding that specific constraint; actual version/binding compatibility still requires account verification. Resources are not restored merely by a code rollback. See [Cloudflare rollback constraints](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/).

Future removal of the preview/Access applications is a separate owner action; keep protection in place until the Worker is no longer reachable. No removal or account setting change was performed in this task.

## Consolidated local evidence

| Validation | Result |
|---|---|
| Working and isolated clean install | `npm ci --ignore-scripts`; production/staging builds and TypeScript pass |
| Regression suites |183/183 in working tree and isolated copy; includes8 new staging test groups |
| Dependencies | npm audit:0 advisories; only pinned JOSE dependency added for staging |
| Wrangler dry run | Pass;37.86KiB /10.43KiB gzip bundle; ASSETS + variables only; no upload |
| Artifact comparison |108 files;20 HTML differ only in robots metadata; robots.txt/_headers differ as intended; all other files identical, including28 redirects and sitemap |
| Local Workers |166 requests pass: locked denial, authenticated20 routes,28 rules/query variants/direct targets, headers/errors/disabled APIs |
| Browser |8 Chrome/WebKit cases pass: denial, authenticated Home/Contact at390px, fallback/validation, disabled API; no unexpected external requests/page errors |
| Preservation | Starting367-file snapshot retained; production108-file output byte-identical; production configuration, approved content/design/animations unchanged |

Evidence is outside the public artifact in `../v2-personal-staging-evidence/`. Authentication tests used real RSA signatures with synthetic local JWKS, not a real Cloudflare Access session. They verify the actual bundled local Workers/asset behavior without claiming remote Access, TLS, account policy, physical-device or Safari validation. Logs contain synthetic test traffic, not visitor submissions.

**Remaining preview gates:** personal account/name and Access application/policy setup; genuine Access JWT forwarding and signed-out/in checks; compatible rollback target recorded after deployment. **Production remains NO-GO** under `FINAL_RELEASE_READINESS.md`: Privacy/content permissions and other existing launch gates are unchanged. This protected, collection-disabled preview does not resolve or bypass them.
