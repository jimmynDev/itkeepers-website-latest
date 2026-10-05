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

All six TOMLs parse; role names are unique and referenced role files exist. Required package files and explicit root source paths were checked, and root `AGENTS.md` fits the configured 65,536-byte budget. Installed runtime discovery, website builds and deployed behavior remain untested; see `PROJECT_STATUS.md`.

## Installed workspace — verified local commands (30 September 2026)

This checkout also contains the existing Astro application; the archive itself did not. Use the current package-lock.json and Node 22.x requirement in package.json/.nvmrc. The observed shell currently reports Node 24.21.0 and npm 11.19.0; this merge changes neither.

| Operation | Established command / evidence |
| --- | --- |
| Install | npm ci with the existing lockfile; not rerun for a docs-only change |
| Development | npm run dev -- --host 127.0.0.1; existing local preview http://127.0.0.1:4321/ |
| Build | npm run build; prior ten-route build passed, not rerun for this merge |
| Workflow tests | node --test tests/workflow.test.mjs after build; prior four tests passed |
| Production-output preview | npm run preview; script exists, not reverified in this merge |
| Deploy | npm run deploy invokes wrangler deploy; release authorization and gates required |
| Lint/type | No dedicated scripts currently configured |

wrangler.toml declares Worker static assets from dist; actual deployed environment remains unverified. See PROJECT_STATUS.md and docs/INTERACTION_VALIDATION.md for current implementation and outstanding B9/B14 checks. Draft robots stays under docs/drafts and was not promoted to public/robots.txt.

Documentation rollback is available at .codex/backups/structure-before-20260930-a1ce3fe8; copy its matching 20 files back to their original paths, preserving unrelated source. The baseline.json records application hashes and package paths.

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
