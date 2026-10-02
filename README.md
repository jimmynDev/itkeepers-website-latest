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
