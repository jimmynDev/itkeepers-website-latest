# V2 — October 27 Presentation: versioned deployment completed

26 October 2026 · V2 only · Worker `itkeepers-v2-staging` · account `eabf58c0ea3cf8629b95c29042124f72`.

This section supersedes the historical deployment/rollback instructions below. No immediate `wrangler deploy` was used. No old Worker version, Worker or release artifact was deleted. No commit, push, merge, Team page publication, V4 deployment, DNS/mail change or unrelated Cloudflare change occurred.

| Release record | Exact value |
|---|---|
| Public website | https://itkeepers-v2-staging.jimnassar99.workers.dev |
| Previous version / now preserved rollback target | `1d88e2b0-4e2c-40e0-b92a-4fe310b7beba` |
| Previous deployment | `d011faf2-af1c-4867-9b97-4adc4bc51ced` |
| Previous recorded source revision | `e34b69b1f4288e5fcc6c80b1a6c70519c4d9ff94` |
| New version | `97cf3bf6-69c6-43db-b044-cc7704d41e72` |
| New deployment | `dc77ddc8-0ee8-4ad3-bc8b-0d9bf3dad286` |
| Active allocation | New version 100%; original retained, inactive |
| New version message / tag | `V2 — October 27 Presentation` / `v2-october-27-presentation` |
| Source branch / unchanged base HEAD | `codex/v2-prompt3-restored` / `e86d5ff1f7f22ee0135d6071f8377106c0a31260` |
| Frozen source manifest SHA-256 | `ab2cf7b3efb4b02cba7cb90ad45dda0b1c03dbc840e81450052cfce44cee15bb` |

The released source includes the validated uncommitted V2 work; the base Git commit alone does not contain the release. The 310-file source snapshot is frozen in sibling `v2-continuous-motion-20261026/candidate/source/`; the source and 117-file staging artifact manifests are copied into sibling `v2-presentation-release-20261026/`. Source/configuration, credentials and backup artifacts are outside the public assets directory.

## Mandatory version-preserving procedure

1. Read the active deployment and exact version before any upload. Capture version/settings/subdomain/bindings and available source provenance. Stop if the active release cannot be identified or preserved. Do not assume the last listed version is active: API and CLI ordering differ; select the newest deployment by its timestamp and inspect its allocation.
2. Preserve deployed Worker code, source map, source-revision archive, public HTML/assets, headers/redirects and metadata. This run saved 111 public responses plus a deployable recovery configuration and verified its dry-run compilation. The only four uncaptured current-public-file candidates are hero-status font/license files absent from the old release (404); they are new release assets. The backup ZIP `previous-release-1d88e2b0.zip` has SHA-256 `4cf6202dcf257d291f6548c20996dbfb93b9b1f17f33d6fa96f6ac6ff649c439`. The old complete Cloudflare version remains available; the export also preserves the rendered site's code/dependencies independently.
3. Confirm the current source/artifact hashes match the validated V2 snapshot and that no Team page exists. Use only the explicit staging configuration and this account:

```powershell
$env:CLOUDFLARE_ACCOUNT_ID = 'eabf58c0ea3cf8629b95c29042124f72'
node node_modules/wrangler/bin/wrangler.js versions upload --config wrangler.staging.toml --tag v2-october-27-presentation --message 'V2 — October 27 Presentation'
```

4. Record the returned immutable version ID and confirm upload has not changed normal traffic. This run retained the original deployment unchanged after upload. Check the version URL if available. Existing `preview_urls=false` and the exact-host guard make version URLs unavailable (404); neither was weakened. Instead stage original at 100%, new at 0%, then verify with Cloudflare's documented version-override header:

```powershell
node node_modules/wrangler/bin/wrangler.js versions deploy 1d88e2b0-4e2c-40e0-b92a-4fe310b7beba@100 97cf3bf6-69c6-43db-b044-cc7704d41e72@0 --config wrangler.staging.toml --yes
# GET requests to the primary host only, with:
# Cloudflare-Workers-Version-Overrides: itkeepers-v2-staging="97cf3bf6-69c6-43db-b044-cc7704d41e72"
```

The zero-percent verification deployment is `d569ade5-d72a-423a-817f-9e34d980d7ec`. Ordinary requests continued returning the byte-identical original homepage. Override requests returned the byte-identical new artifact, including scripts/styles/assets. Do not send the override to unrelated hosts. Version overrides require the version to be included in the active deployment, which is why the zero-percent staging step is necessary.

5. Verify recoverability/rollback selectability before switching traffic. After successful HTTP/browser checks, promote the tested version explicitly:

```powershell
node node_modules/wrangler/bin/wrangler.js versions deploy 97cf3bf6-69c6-43db-b044-cc7704d41e72@100 --config wrangler.staging.toml --yes --message 'V2 — October 27 Presentation'
```

6. Re-read the active deployment and original version, verify the public site without override headers, and run the explicit original-version rollback command with `--dry-run`. Stop or restore the preserved original if material public verification fails. Keep all old versions and release artifacts.

## Exact rollback for this presentation release

From the verified V2 worktree, with Node 22 and existing Wrangler authentication:

```powershell
$env:CLOUDFLARE_ACCOUNT_ID = 'eabf58c0ea3cf8629b95c29042124f72'
node node_modules/wrangler/bin/wrangler.js versions deploy 1d88e2b0-4e2c-40e0-b92a-4fe310b7beba@100 --config wrangler.staging.toml --yes
```

This targets the captured original `1d88e2b0-4e2c-40e0-b92a-4fe310b7beba`, not an inferred previous version. The executable sibling `v2-presentation-release-20261026/ROLLBACK.ps1` sets the account, Node path, workspace and exact target; `-DryRun` verifies selection without changing traffic. Final dry run passed after promotion, and the original version's entire API metadata remains unchanged. No actual rollback was needed. A future release must capture its own starting version rather than blindly reusing this target.

## Verification and scope

- Before promotion: 127 HTTP checks and four Chromium/WebKit browser contexts (1440px and 390px), including 20 motion/visibility/reduced-motion checks. All pass while normal traffic stays on the original release.
- After promotion: another 127 HTTP checks and four fresh Chromium/WebKit contexts, with another 20 motion checks; zero browser console/network errors. All 115 served artifact files match the validated build. The two excluded artifact files are private `_headers`/`_redirects` controls. Sitemap has 15 approved current-host URLs; existing noindex holds remain.
- Team `/team`, `/team/`, `/team.html` and `/team/index.html` return 404. Private source/configuration probes return 404; disabled local contact API GET requests return 405.
- Formspree, Privacy, consultation CTA and business functionality were not edited. The validated artifact is deployed as authorized; this does not invent legal approval or mailbox receipt. No real or synthetic inquiry POST was sent; mailbox delivery remains unverified.
- This release retains the candidate's prior 223/223 tests, production/staging builds, TypeScript checks and 108 timed local animation cases; deployment did not change app source or dependencies. Existing owner-requested pause-control accessibility tradeoff remains documented in the motion review.
- Only this Worker's version upload and versioned traffic deployments were changed. Primary `workers.dev` enabled, preview URLs disabled, no custom routes/domains, same variables/bindings/settings and no new secrets.

Evidence and backup: sibling `v2-presentation-release-20261026/RELEASE.html`, `RELEASE.json`, `previous-release-1d88e2b0.zip`, state snapshots, public/candidate HTTP and browser records, source/artifact manifests and rollback logs. Official workflow references: [Cloudflare versions](https://developers.cloudflare.com/workers/versions-and-deployments/), [version overrides](https://developers.cloudflare.com/workers/versions-and-deployments/version-overrides/) and [version URLs](https://developers.cloudflare.com/workers/versions-and-deployments/version-urls/).

---

# Historical release records below

# Public workers.dev preview deployment

> **Historical Phase 7 release (22 October):** `dda1d98f-5f00-47e8-b765-ff697018571d`, verified live after the authorized deployment. Immediate previous public rollback version: `178a3076-f774-4b55-bd30-146bb3555a34`. See [V2_PHASE7_FINAL_REPORT.md](../V2_PHASE7_FINAL_REPORT.md) for current validation, security maintenance and recovery. Earlier counts below describe the indexing deployment.

Updated: 22 October 2026. Account: `eabf58c0ea3cf8629b95c29042124f72`.

The owner explicitly replaced the private Cloudflare Access requirement with a public link-only preview. Cloudflare Zero Trust checkout was not completed and is not required. No payment information is needed for this preview.

## Historical deployment — 22 October

- URL: `https://itkeepers-v2-staging.jimnassar99.workers.dev`
- Worker: `itkeepers-v2-staging`
- Current indexable public version: `dda1d98f-5f00-47e8-b765-ff697018571d`
- Immediate previous public rollback version: `178a3076-f774-4b55-bd30-146bb3555a34`
- Previous public noindex version: `57b86416-3714-4f48-adab-38e641080173`
- Previous deny-all rollback version: `d28d15f5-b0d2-44e5-ac2c-c68528438f32`
- Wrangler identity/account matched `jimnassar99@gmail.com` and the owner-supplied account ID.
- Only the primary workers.dev hostname is enabled. Version/alias preview URLs are disabled; there are no custom routes or domains.
- Bindings: static assets, exact `STAGING_HOSTNAME`, and two false contact flags only. No Access, Durable Object, migration, email, database, queue or production binding.

Anyone with the primary link can view the site without authentication. The Worker rejects alternate hostnames. Following the owner's22October indexing instruction,15 approved pages use `index, follow` with no HTTP noindex header. Canonical, Open Graph, Twitter-image, schema entity URLs and the15-entry sitemap use this workers.dev origin. The official-domain source/configuration and its build output remain unchanged.

robots.txt allows all crawlers (`User-agent: *` / `Allow: /`) and advertises `https://itkeepers-v2-staging.jimnassar99.workers.dev/sitemap.xml`. Responses retain `private, no-store` and existing security headers. The standalone artifact retains the existing HSTS max-age86400 policy on its current public hostname; no includeSubDomains/preload was introduced. Visible content, CSS/JS/images and28 redirect rules are unchanged.

Five routes retain HTML and HTTP `noindex, follow` and are absent from the sitemap:

- `/privacy/`: final notice/legal approval pending.
- `/blog/`: archive listing articles awaiting rights/editorial approval.
- `/2023/09/the-future-of-artificial-intelligence-ai/`
- `/2023/09/understanding-datafication/`
- `/2023/10/how-do-ai-and-ml-differ/`

The three article holds follow the existing `V2_RELEASE_PREPARATION.md` rights/accuracy findings; this indexing request does not invent missing publication approval. Pulse's informational development page and the approved AI governance explainer retain their existing disclosures and are among the15 public indexable pages. Pending product functionality is not represented as launched.

The shared private configuration `worker/public-indexing-policy.json` governs the public origin/holds for artifact generation and HTTP headers. It is not served as a public file. APIs, unknown/private paths and other errors retain noindex; no staging-wide noindex remains in the artifact's `_headers`.

Contact remains email-app/telephone fallback only. POST `/api/contact` and `/api/inquiry` return503 `contact_unavailable` without reading or storing submissions or sending email. Other API methods are rejected.

## Validation

- TypeScript, staging build and artifact comparison pass:20 pages; only allowed head/index controls, sitemap/robots and host-specific header scope differ from official-domain output. Body/assets and28 redirect rules retained.
- Full regression suite:182/182 passed, including held-page/HTML-alias noindex versus public indexing. Prior npm audit0 remains applicable; dependencies unchanged in this indexing update.
- Live Home, Services, Contact, robots, sitemap and real hashed asset return200. Unknown path returns404.
- Live Home HTML contains `index, follow`, canonical `https://itkeepers-v2-staging.jimnassar99.workers.dev/`, and the exact accessible H1 `Your IT person is a team.`
- All28 legacy redirect rows return one301 with destination and query preserved.
- Live synthetic POST to contact returns503 `contact_unavailable`; inquiry GET returns405.
- Browser rendered the mobile homepage and exposed the expected navigation, content, email-app form handoff and telephone links.

### Fresh unauthenticated checks — 22 October

- Access API confirms Access is not enabled on the personal account. No application or hostname policy exists to remove. No Access binding or internal authentication code is deployed. Primary workers.dev enabled, alias/version previews disabled.
- `node scripts/verify-public-staging.mjs`:234 HTTP requests;0 functional failures, with the upstream Python restriction reported separately. All20 HTML responses match local output and the intended per-page meta/header policy exactly; canonical, OG, Twitter and schema origins verified on every page. Sitemap exactly15 approved current-host URLs; all5 holds excluded. Public assets load,28 redirect rows preserve destination/query and lead directly to200. Both API endpoints reject synthetic submissions503; GET/OPTIONS405 with Allow POST.
- Private source/configuration/docs probes return404: .env, .dev.vars, .git/config, Wrangler files, package.json, PROJECT_STATUS.md, AGENTS.md, private Privacy draft, deployment report, Worker/scripts, _headers and _redirects. No credentials, cookie or Authorization header was used.
- Two fresh Chromium contexts with no initial cookies at390px and1440px:12 browser checks pass,0 page errors. Home, Services, Contact, Emergency and Pulse render without HTTP noindex, use current-host canonicals/index-follow meta, and have no horizontal overflow. Home→Managed IT→Contact navigation works. Contact retains email-app and telephone fallback, with no Turnstile/backend collection.
-7 user-agent profiles (Googlebot, bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot and curl) each fetch Home, Services and robots.txt with200; this tests agent strings from this client, not genuine visits from those operators' networks.
- **Remaining upstream limitation:** Python-urllib/3.13 receives Cloudflare403/error1010 before the Worker (no application X-Robots-Tag). The workers.dev zone is not accessible to this personal account and the inspected Worker settings expose no Browser Integrity Check exception. No account-wide or other-site security change was made. Cloudflare documents1010 as browser-signature blocking and BIC exceptions as zone controls: [error1010](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1010/), [BIC controls](https://developers.cloudflare.com/waf/tools/browser-integrity-check/). A Worker-specific provider remedy requires Cloudflare support; a custom-domain workaround would exceed this workers.dev-only scope. Do not claim every automated auditor can access the host.
- An independent ChatGPT web-fetch attempt could not open Home or robots.txt; its tool returned only “not accessible,” without an HTTP status. That external fetch remains unverified, despite successful local crawler-profile and fresh-browser checks. It must not be reported as a genuine ChatGPT crawler pass.

Evidence: ignored `.wrangler/public-verification/http.json` and `browser.json`. The browser harness also remains outside public artifacts. Earlier private-preview evidence, robots disallow and staging-wide noindex/official-host canonical policies are historical, superseded by this update. Indexing is now permitted for15 pages; actual search-engine inclusion is not measured or promised.

## Historical rollback examples — superseded for the presentation release

To undo only the indexing/origin change while retaining the public site, roll back this same Worker to `57b86416-3714-4f48-adab-38e641080173` with the command below using that version ID. This restores staging-wide noindex and official-host canonicals; verify Home/Privacy/sitemap afterward. Keep preview aliases disabled and contact flags false.

To restore the secure deny-all version without changing DNS or other Workers:

```powershell
$env:CLOUDFLARE_ACCOUNT_ID = 'eabf58c0ea3cf8629b95c29042124f72'
node node_modules/wrangler/bin/wrangler.js rollback d28d15f5-b0d2-44e5-ac2c-c68528438f32 --config wrangler.staging.toml
```

The rollback target has blank hostname/Access settings and returns403 to every request. Do not use production `npm run deploy` for this preview.

No itkeepers.com domain, nameserver, DNS, MX, Microsoft365, production Worker, contact delivery, commit, push or merge was changed.
