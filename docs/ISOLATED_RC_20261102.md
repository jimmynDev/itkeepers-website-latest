# November 2 isolated competition RC

Prepared only. Deployment requires the project owner's explicit approval.

- Worker: `itkeepers-v2-rc-20261102`
- Proposed URL: `https://itkeepers-v2-rc-20261102.jimnassar99.workers.dev/`
- Config: `wrangler.isolated.toml`; entry: `worker/isolated-release.ts`
- Runtime compatibility: 2026-10-30, supported by the pinned Wrangler/workerd; no dependency upgrade.
- Artifact: `dist-isolated-release`; policy: `worker/isolated-release-policy.json`
- Node 22.19+ within Node 22. No install or lockfile upgrade is required.

Build/check with `npm run build`, `npm run build:isolated-rc`, and `npm run check:isolated-rc`.
The checker requires the exact new name/account/entry/hostname/artifact, no routes,
ASSETS only, collection/delivery flags false, no preview URLs and no observability.
All 21 pages carry noindex; the sitemap is empty and unadvertised. The public
Formspree form and existing CSP remain. New-origin domain restrictions and inbox
receipt require owner verification; do not send an inquiry during release QA.

Only after explicit approval, from the reviewed release commit, the deployment
command is `npx --no-install wrangler deploy --config wrangler.isolated.toml --var RELEASE_COMMIT:<full-reviewed-SHA>`.
Do not use `npm run deploy`, name/account/environment overrides, custom domains or
route flags. The prepared config has no build hook: build and check the exact
commit first. A deliberate CLI override could bypass any configuration file;
the checked command must therefore retain the explicit config and no overrides.

This new Worker does not replace November 1, October 27, staging, production or
their rollback versions. Keep those URLs/configs unchanged. A future deployment
must record its new deployment/version IDs and check HTML/assets/errors/headers,
noindex, navigation and mocked form behavior. No real inquiry is part of QA.

Current Home retains its original Cloud/security illustrations. The dedicated
service pages use the newer radar and Cloud heroes. Global motion control covers
the existing three page placements; paused-before-entry scenes show static
information, and transient menus remain readable. Critical CSS duplication is
retained within its 90 KB budget; field performance and native screen-reader
certification remain follow-up checks.
