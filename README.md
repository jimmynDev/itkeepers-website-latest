# ITKeepers Website — Documentation and Agent Package

This package supports the existing ITKeepers website repository. It includes project sources, shared instructions, five role documents, six TOML configuration files and tracking registers. It contains no website application, package manifest, lockfile, build output or Cloudflare deployment configuration. This documentation update does not deploy the website.

## Package layout

| Path | Purpose |
|---|---|
| `AGENTS.md` | Canonical shared project instructions and release gates |
| `PROJECT_STATUS.md` | Baseline, decisions, input dependencies, validation and release log |
| `claims-register.md` | Evidence and exact wording approvals |
| `.codex/config.toml` | Instruction budget and concurrency setting |
| `.codex/agents/*.toml` | Five role definitions |
| `docs/agents/*.md` | Role-specific requirements |
| `docs/*.md` | Brief, site map and tool specifications |
| `docs/drafts/robots.txt` | Draft crawler policy; not production configuration |

All instruction paths resolve from the repository root. Root `AGENTS.md` governs shared policy and current release order; source documents retain historical proposals.

## Install into the existing repository

1. Inspect Git status and preserve unrelated work. Compare existing documents before merging; do not overwrite a current register or approval history with the seed files in this package.
2. Merge `.codex/config.toml` with existing settings. Retain top-level `project_doc_max_bytes = 65536` before tables and the existing concurrency cap of three. Avoid duplicate keys/tables.
3. Review and merge `.codex/agents/` and `docs/agents/`, retaining the exact referenced filenames. Keep shared instructions and both trackers at the root.
4. Start a new session in the intended trusted repository and verify discovery of all five roles. Syntax validation here does not prove installed runtime discovery.
5. Replace the unverified baseline in `PROJECT_STATUS.md` with the inspected commit, stack and actual deployment configuration.

## Website setup

Use the existing application and its established package manager. Before installing dependencies, inspect the manifest, lockfile, runtime version files and existing CI. Use the project’s reproducible lockfile-based installation procedure; do not guess an npm command or switch package managers.

Inventory required environment-variable names from code and configuration. Document purpose, local setup and preview/production scope without committing values or secrets. Preserve existing runtime versions and processor choices. The package alone cannot establish these settings.

## Local development and build

Inspect the actual scripts and framework documentation, then fill this command inventory in the installed repository with verified commands and results:

| Operation | Current state | Evidence to record |
|---|---|---|
| Dependency install | Requires repository inspection | Package manager/version and lockfile-based command |
| Development server | Requires repository inspection | Script, local URL and environment requirements |
| Lint/type checks | Requires repository inspection | Available scripts and results; explain absent checks |
| Tool tests | Requires repository inspection | Approved rule version, test command and result |
| Production build | Requires repository inspection | Build command, runtime and output/Worker entrypoint |
| Local production preview | Requires repository inspection | Preview command and route/error behavior |

Run established lint/type/build checks and meaningful tool tests. Inspect core HTML, navigation, metadata, accessibility and public-output scans. Record evidence in `PROJECT_STATUS.md`. No website build has been run from this documentation-only archive.

## Cloudflare deployment

1. Identify the actual existing Cloudflare project and whether it uses Pages or Workers. Read repository deployment configuration and the connected branch, build command, output/entrypoint and environment bindings. Record them; do not assume them from this package.
2. Confirm whether a push triggers production. Treat such a push as a release; use the existing preview process for review and retain the intended audience/protection.
3. Apply root release gates to the exact candidate commit, including privacy before inquiry collection, real HTTP 404 handling, claim approval, tool rules, headers and inquiry delivery.
4. Release through the established workflow when authorized. Store secrets in platform secret storage. Do not change DNS or migrate hosting for an ordinary update.
5. Record full commit SHA, deployment ID/type, URL, time and status. Verify actual static and dynamic responses, canonical/indexing policy, redirects, form acceptance/delivery and error behavior.
6. Mark release complete only after production smoke checks pass. Record the known-good rollback revision and environment/configuration dependencies.

Do not substitute a draft `docs/drafts/robots.txt` for an approved environment-specific crawler policy.

## Rollback and maintenance

Before release, document the available platform rollback or established revert-and-redeploy procedure, the exact known-good target and required permissions. Restore compatible code/configuration, verify deployment status and repeat smoke checks. Record the outcome; do not force-push.

Maintain dependency updates, claims reviews, tool-rule versions, inquiry handling and retention, security contact expiry when present, route migrations and deployment instructions. Track follow-ups separately from passed release checks.

## Package validation

All six TOMLs parse; role names are unique and referenced role files exist. Required package files and explicit root source paths were checked, and root `AGENTS.md` fits the configured 65,536-byte budget. These archive-package checks did not test the application runtime; current application and deployment results are recorded below and in `PROJECT_STATUS.md`.

## Installed workspace — verified commands (22 October 2026)

This checkout also contains the existing Astro application; the archive itself did not. Use the current package-lock.json and Node 22.19.0 or later within Node 22, as required by package.json/.nvmrc. Astro remains pinned to 7.3.3 and is validated with Node 22.23.3. The Phase 5 Undici maintenance update pins Wrangler 4.153.0; see [current corrections and validation](docs/V2_PHASE5_TECHNICAL_CORRECTIONS.md). See also [the earlier security maintenance decision](docs/adr/2026-10-22-astro-security-update.md) and [Phase 7 release results](V2_PHASE7_FINAL_REPORT.md). The isolated clean-install evidence in docs/V2_SECURITY_ADVISORY_CLOSURE.md records the earlier dependency state.

| Operation | Established command / evidence |
| --- | --- |
| Install | npm ci --ignore-scripts with the existing lockfile; prior isolated-install evidence is historical, while the current security update passed installed-runtime validation |
| Development | npm run dev -- --host 127.0.0.1; existing local preview http://127.0.0.1:4321/ |
| Build | npm run build followed by npm run build:staging and npm run check:staging; 20 routes, 15 staging indexable pages and five noindex holds |
| Tests | node --test tests/*.test.mjs after build; 186/186 passed for Phase 7 |
| Production-output preview | npm run preview; script exists, not reverified in this merge |
| Personal staging deploy | node node_modules/wrangler/bin/wrangler.js deploy --config wrangler.staging.toml; explicit target authorization and passing gates required |
| Production deploy | npm run deploy uses the separate production configuration; not authorized by the personal staging release |
| Lint/type | npm run typecheck checks TypeScript modules; Astro templates compile during build; no dedicated lint script |

wrangler.toml declares the separate production preparation from dist. The personal public Worker uses wrangler.staging.toml and dist-staging; its actual deployed version, public access, headers, redirects and indexing were verified in [V2_PHASE7_FINAL_REPORT.md](V2_PHASE7_FINAL_REPORT.md). The official domain and DNS were not changed. Historical migration/security reports remain in docs; see PROJECT_STATUS.md for outstanding owner and production release gates.

Documentation rollback is available at .codex/backups/structure-before-20260930-a1ce3fe8; copy its matching 20 files back to their original paths, preserving unrelated source. The baseline.json records application hashes and package paths.

### Isolated V2 release candidate

Use Node 22.19+ within Node 22 (validated with 22.23.3). Build the standard production/staging artifacts, then `npm run build:rc` and `npm run check:rc`; the complete suite is `node --test tests/*.test.mjs` after all three builds. RC output is the ignored `dist-rc/`, with its own `wrangler.rc.toml` and `worker/rc.ts`. Production `dist/`, existing `dist-staging/` and their configurations are preserved.

The RC uses `https://itkeepers-v2-rc-20261027.jimnassar99.workers.dev`, blanket `noindex, follow` headers (including documents), noindex HTML and an empty, unadvertised sitemap. Robots permits public browser/AI-evaluator access. The new handler accepts only that exact configured hostname. Formspree remains the existing direct form destination; disabled local APIs do not disable those forms.

No deployment is authorized by these scripts. See [Phase 8 validation, exact deployment command and recovery procedure](docs/V2_PHASE8_ISOLATED_RC.md). Use only the dedicated RC configuration after explicit approval; bare `npm run deploy` and the existing staging configuration target other Workers.

The isolated RC is now live at [itkeepers-v2-rc-20261027.jimnassar99.workers.dev](https://itkeepers-v2-rc-20261027.jimnassar99.workers.dev/) under the owner's Phase 9 RC-only authorization. [Deployment identifiers and hosted validation](docs/V2_PHASE9_RC_DEPLOYMENT.md) record the released artifact and preservation of the original staging deployment. No staging promotion or production release is authorized by that RC deployment.

### Homepage service chapters

Five consecutive, visible homepage sections appear in this order: Managed IT Services, Microsoft 365 & Cloud, Cybersecurity, Networking & Infrastructure, AI & Automation. No service selector, hidden panels or homepage index remains. Existing fragments `/#services/managed`, `cloud`, `security`, `networking` and `ai` target the corresponding sections; `/#services` targets the start. Older aliases still resolve without changing service state. The homepage DAY-TO-DAY link group was removed at the owner's request; Managed IT sub-services and Backup & Disaster Recovery remain on detail pages. Digital Services remains separate below the five chapters.

Every diagram uses the shared service-page viewport lifecycle: meaningful entry starts playback (bounded by default; AI and Networking explicitly loop continuously), offscreen departure pauses it, genuine exit makes replay ready, and re-entry restores pristine markup. Spatial hysteresis prevents threshold jitter from restarting a section. Each instance has isolated timers; reduced motion settles immediately. Accessible content is exposed once. Managed IT uses the owner-supplied compact dashboard SVG; Cloud uses the owner-supplied gold ecosystem network, ported to scoped SVG/CSS with hover, focus and click connection highlighting. Both provide static no-JavaScript fallbacks. Managed IT settles after the three delayed rows complete (16.66 seconds); Cloud runs three particle cycles (6.25 seconds), then rests. AI uses the owner-supplied 72-node neural sphere: rotation, traveling signals and neuron ripples loop continuously while visible. Its frame loop stops offscreen and for reduced motion; replay cleans up the previous canvas observers. A matching inline SVG sphere provides the no-JavaScript fallback. Original full diagrams remain on detail pages.

AI governance and website planning live on `/services/ai-automation/` and `/services/web-design-hosting/`. Existing service pages also retain their full-size diagram examples. Run `node --test tests/*.test.mjs` for animation lifecycle and interaction checks, and `npm run build` for all static routes.

The Services navigation opens /services/: five vertical, numbered summaries in order (Managed IT, Microsoft 365 & Cloud, Cybersecurity, Networking, AI & Automation). Each has an H2 and a descriptive detail-page link; mobile uses one column. This existing route and navigation architecture are unchanged by the homepage chapter layout.


The homepage uses the shared 96/72/56px section rhythm. Managed IT, Cloud, Cybersecurity and Networking have copy left/artwork right, and AI reverses this on desktop. Networking uses the supplied isometric server/packet animation with the same continuous viewport-aware canvas lifecycle and inline SVG fallback as AI. AI and Networking outer canvas backgrounds are transparent in both themes. Artwork has a larger desktop column (57.5% of the available grid), scales up to 560px, and uses 300–480px responsive artwork areas on mobile/tablet; Managed IT's cropped SVG can reach 640px. Mobile order is number/title/copy, animation, then Explore link. Day/night presentation and visible keyboard focus remain available.


The shared navigation stays pinned while scrolling. Desktop pill width is capped at 1600px with 16px side gutters; mobile preserves its compact menu. Document scroll padding reserves room above anchor destinations.


Navigation uses viewport-fixed positioning with reserved content spacing (104px desktop / 88px mobile); desktop links are centered between equal side columns.


The pinned menu uses finite CSS entrance/hover/dropdown animations. Prefers-reduced-motion disables movement while preserving visible focus and hover feedback.


### Phase 2.75 visual-system maintenance

Base loads local visual-system-tokens.css and visual-system.css after legacy/mobile/theme styles. Use namespaced --itk-* tokens for shells; preserve official brand aliases and animation-local variables. Scope prose/headings to shell children and exclude the hero from generic rules. Astro-scoped styles sometimes require explicit component token references: TeamThread uses these only for label/divider/chapter presentation. Preserve routes/content order, semantic tags and all animation lifecycle behavior.

Dark sections use one continuous near-black canvas; existing optional homepage day surfaces remain. Major section rhythm is96/72/56px and H2s30–48px. Dim/deep-blue tokens do not meet small-text contrast and must not be used for labels. Existing local official PNG supplies the favicon. No dependencies, external assets or JS were added. Build13routes,30unit tests and browser regression checks passed. Local review completed; Phase3 and deployment remain unstarted.



### Emergency header utility

The shared header includes Under Attack? beside Talk to our team on desktop and beside Menu on mobile. It opens /emergency/, where the call button displays owner-supplied +961 81 816 761 and uses tel:+96181816761. Emergency red and reduced-motion handling remain unchanged. Online review booking is not connected and reports no fake submission success. See docs/reviews/2026-10-05-homepage-refinements.md for current validation.


### Contact Worker wiring — collection disabled

The shared Home/Contact form now targets only `/api/contact` when explicitly enabled for local validation (`PUBLIC_CONTACT_FORM_ENABLED=true`, `PUBLIC_CONTACT_FORM_ENDPOINT=/api/contact`, and a Turnstile site key). Default builds still use the existing email-app handoff. No email provider is called by the public Worker. The historical email preparation remains in source, disabled and unrouted.

`wrangler.toml` routes `/api/contact` and the former `/api/inquiry` directly to the same non-storing handler, with `CONTACT_VALIDATION_ENABLED=false` and `CONTACT_DELIVERY_ENABLED=false`. Disabled requests return503 before consuming their body. Isolated synthetic tests may enable validation with Worker-only Turnstile/HMAC secrets and the existing Durable Object abuse guard; successful validation returns503 `submission_not_stored`. Abuse counters are not storage of an inquiry. No API success UI is enabled, including for an unexpected legacy202 response.

Production collection remains blocked until an approved durable storage/delivery contract, Privacy approval and successful acceptance testing exist. Do not enable these test settings in production. Existing email/telephone fallback, Microsoft365 MX and all email/DNS/account settings remain unchanged. Never enable remote email bindings during local tests.

See [endpoint wiring and validation evidence](docs/V2_CONTACT_ENDPOINT_WIRING.md). Earlier [Phase5.3](docs/V2_PHASE53_PRIVACY_CONTACT.md) and [Phase5.4](docs/V2_PHASE54_CONTACT_CONFIGURATION.md) reports describe deferred email preparation, not current active collection. The [private Privacy draft](docs/drafts/V2_PRIVACY_NOTICE.md) remains unpublished; this change does not approve a new inquiry database or processor. Build with Node22; run `node --test tests/contact-worker.test.mjs tests/free-it-review.test.mjs tests/security.test.mjs` for focused checks. No new dependencies.


### Final candidate validation

Current release gates, exact activation/staging/rollback steps and scoped results are consolidated in [FINAL_RELEASE_READINESS.md](FINAL_RELEASE_READINESS.md). Production collection and email integrations remain disabled/deferred. Node22 setup is reproducible with `npm ci --ignore-scripts` on the tested Windows platform; reviewed optional native binaries work without install hooks. Run `npm run typecheck`, `npm run build`, then `node --test tests/*.test.mjs`. The typecheck covers TypeScript modules; Astro templates compile through the build.

Read-only local release smoke: `python -X utf8 scripts/verify-release.py --base http://127.0.0.1:4377 --local-fixture --output ../v2-final-release-evidence/smoke-local.json`. Remote checks require separate owner authorization and explicit `--allow-production`; no POST or email is sent. Local host fixtures do not verify production TLS, Access or deployment.

### Private personal-account preview

The public workers.dev website uses the separate [Worker configuration](wrangler.staging.toml) and [deployment report](docs/V2_PERSONAL_CLOUDFLARE_STAGING_DEPLOYMENT.md). The owner approved public access and then indexing, superseding earlier Access and staging-wide noindex requirements. Only the exact primary workers.dev hostname is served; version/alias previews and custom routes remain disabled. There are no Access/DO/mail bindings and collection remains disabled. Build with `npm run build` then `npm run build:staging`; validate using `npm run check:staging`, `npm run typecheck` and `node --test tests/*.test.mjs`. Do not use the default production `npm run deploy` command for this Worker.

As of22October,15 approved pages permit indexing, use workers.dev canonical/social/schema URLs and appear in the current-host sitemap. Privacy, the blog archive and3 restored articles awaiting approval retain per-page noindex. The policy is in `worker/public-indexing-policy.json`; standalone artifact generation preserves the official-domain source/build and all visible content/assets. robots.txt allows crawling and advertises the current sitemap. Read-only unauthenticated smoke: `node scripts/verify-public-staging.mjs` (hard-limited to this hostname). The report distinguishes successful crawler-agent checks from Cloudflare's upstream Python-urllib1010 restriction and unverified external auditor networks.
