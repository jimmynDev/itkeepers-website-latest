# Astro security maintenance for Phase 7

Status: accepted for the authorized personal staging release, 22 October 2026.

Fresh npm audit reported two advisories against the existing Astro 7.2.8 pin:

- [GHSA-98hj-9722-w3j8](https://github.com/withastro/astro/security/advisories/GHSA-98hj-9722-w3j8): untrusted dynamic script/style children in JSX/MDX; fixed in 7.3.2.
- [GHSA-mpr7-6m5w-76rw](https://github.com/withastro/astro/security/advisories/GHSA-mpr7-6m5w-76rw): untrusted View Transition animation values; fixed in 7.3.3.

Pin the existing dependency to **7.3.3**, the smallest published release fixing both. Update its lockfile resolution without `--force`, overrides or a new top-level dependency. Install hooks were skipped with `--ignore-scripts`; actual native compilation/build functionality is verified by the release gate. Node 22 remains supported.

The current site uses static `.astro` output with no MDX/JSX integration or request-derived Astro transition animation properties found. No exposed exploit path was reproduced, and no remote exploit was attempted. Updating avoids relying on that limited exposure assessment.

The first rebuilt staging artifact is **109/109 files byte-identical** to the pre-upgrade local candidate. TypeScript, both builds, staging comparison, 186 regressions and fresh npm audit pass. Browser/performance/deployment verification belongs to `V2_PHASE7_FINAL_REPORT.md`; this decision alone does not authorize or prove a deployment.

No content, indexing, contact gates, backend processor, production-domain configuration or Cloudflare security setting changes. The original AI audit ZIP is preserved as historical evidence; the Phase 7 report records the new dependency audit.
