# Astro security update

Status: implemented locally for owner review, 19 October 2026. User authorized closing the Astro/Sharp/esbuild advisories while preserving the current site; publication remains prohibited.

Problem: Astro 5.18.2 requires dependency ranges that cannot clear all recorded advisories. The latest Astro 5 release is 5.18.2. Astro 6 cannot satisfy advisories patched in Astro 7. No force update, suppression or risky transitive override is acceptable.

Decision: pin Astro 7.2.8, the first release beyond every recorded Astro affected range. Resolve Sharp 0.35.5 and esbuild 0.28.2 through its supported ranges and retain the lockfile. Keep the existing Wrangler version and static Workers architecture. Do not move to Astro 7.4 merely because the audit suggests the newest release.

Compatibility: explicitly retain `compressHTML: true`, the previous whitespace behavior. Switch the isolated render-test helper to the current Rust compiler. Declare its compiler, TypeScript and parse5 test imports as pinned development dependencies; TypeScript/parse5 retain the versions previously installed transitively. Require Node 22.12.0+ within Node 22. No product source, styles, interactions, metadata, header policy or route mapping changes.

Consequences: Astro's compiler/bundler and dependency tree change, so clean install, build/tests, actual local Workers, CSP/form checks, responsive visual comparisons and SEO preservation are required. All pass; details and exact GHSA IDs are in ../V2_SECURITY_ADVISORY_CLOSURE.md. Production verification and release approval remain separate. No business/legal approval was inferred and no third-party processor was added.
