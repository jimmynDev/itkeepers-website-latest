# Dependency advisory closure — 19 October 2026

**Result: zero remaining npm audit advisories**, including development and optional dependencies. The previous three affected packages represented **14 distinct GHSA records**. Branch `codex/v2-prompt3-restored`, HEAD `22b5c2f9e74d9c734137036ec74a3db289c67761`; all changes remain uncommitted. No push, merge or deployment.

## Versions and dependency paths

Paths below are relative to the application root. Both logical npm paths and physical installed locations were recorded before and after.

| Dependency path | Before | After |
|---|---|---|
| application → Astro, `node_modules/astro` | 5.18.2 | **7.2.8**, direct exact pin |
| application → Astro → Sharp, `node_modules/sharp` | 0.34.5 | **0.35.5**, supported optional dependency range |
| application → Astro → esbuild, `node_modules/astro/node_modules/esbuild` | 0.27.7 | **0.28.2**, supported dependency range |
| application → Astro → Vite → esbuild | Vite 6 / root esbuild 0.25.12, outside the listed Windows affected range | Vite 8.3.4 / esbuild 0.28.2; old root copy removed |
| application → Wrangler 4.151.1 → Miniflare → Sharp | 0.35.5 nested under Miniflare, already patched | 0.35.5 shared from root |
| application → Wrangler 4.151.1 → esbuild | 0.28.2 under Wrangler, already patched | 0.28.2 under Wrangler, unchanged |

Astro 5.18.2 is the last published Astro 5 release. The Astro advisory with the highest required version is fixed in **7.2.8**; older major/patch updates cannot close all ten Astro records. This is the smallest Astro release beyond every recorded affected range. Sharp 0.35.5 is required for the SVG advisory; esbuild 0.28.2 resolves normally and matches existing Wrangler tooling. No direct Sharp/esbuild pins, overrides, resolutions, advisory exclusions or `npm audit fix --force` were used. Audit remains enabled.

Current Windows Sharp native libraries: libvips **8.18.7**, libheif **1.23.5**, librsvg **2.63.2**. Native versions were read from the installed module; other platforms must install their appropriate prebuilt packages or maintain their own patched system libraries.

## Exact GHSA records and original exposure

Every row is now outside its affected version range. “Runtime” below means an Astro application server, which this static Workers deployment does not run. Template-rendering issues could also poison prerendered output if an application supplied the required untrusted inputs at build time; this project uses reviewed repository content.

| GHSA / severity | Affected package range → first patch | Affected functionality and exposure in this site |
|---|---|---|
| [GHSA-j687-52p2-xcff](https://github.com/advisories/GHSA-j687-52p2-xcff), moderate | Astro `<6.1.6` → 6.1.6 | Script `define:vars` closing-tag sanitization/XSS. Directive unused; no visitor input enters prerendering. |
| [GHSA-xr5h-phrj-8vxv](https://github.com/advisories/GHSA-xr5h-phrj-8vxv), low | Astro `<6.1.10` → 6.1.10 | Encrypted server-island props/slots replay across components. No server islands or dynamic Astro runtime. |
| [GHSA-jrpj-wcv7-9fh9](https://github.com/advisories/GHSA-jrpj-wcv7-9fh9), moderate | Astro `<6.4.6` → 6.4.6 | Untrusted spread-prop attribute names can inject HTML. No untrusted API/CMS/request keys enter template spreads. |
| [GHSA-f48w-9m4c-m7f5](https://github.com/advisories/GHSA-f48w-9m4c-m7f5), moderate | Astro `<7.0.6` → 7.0.6 | Incomplete spread-name fix in server `renderHTMLElement`. No DOM-enabled SSR with native HTMLElement-class components receiving untrusted props. The browser particle custom element is a different execution path. |
| [GHSA-7pw4-f3q4-r2p2](https://github.com/advisories/GHSA-7pw4-f3q4-r2p2), low | Astro `>=3.10.0 <7.0.4` → 7.0.4 | Unescaped `transition:*` directive values on hydrated islands. No `client:*` hydration or attacker-controlled transition directives. |
| [GHSA-4g3v-8h47-v7g6](https://github.com/advisories/GHSA-4g3v-8h47-v7g6), moderate | Astro `>=2.9.0 <=7.0.9` → 7.1.0 | View Transition animation-property injection into generated styles. No untrusted Astro transition properties; client-side theme animation is separate. |
| [GHSA-2pvr-wf23-7pc7](https://github.com/advisories/GHSA-2pvr-wf23-7pc7), high | Astro `<6.4.6` → 6.4.6 | Host-derived SSR fetch of prerendered error pages can cause SSRF. No Node adapter/custom Astro server or runtime error-page fetch. |
| [GHSA-8hv8-536x-4wqp](https://github.com/advisories/GHSA-8hv8-536x-4wqp), high | Astro `<6.3.3` → 6.3.3 | Unescaped named slots in hydrated templates/XSS. No hydrated islands or request-derived slot names. |
| [GHSA-26w7-cxv4-gfx2](https://github.com/advisories/GHSA-26w7-cxv4-gfx2), critical | Astro `<7.2.8` → 7.2.8 | Malicious AVIF decoding through Sharp can execute code. Relevant to builds/scripts if untrusted images are processed; no upload or runtime image optimizer. `/_image` remains 404. |
| [GHSA-376h-93r7-7g6f](https://github.com/advisories/GHSA-376h-93r7-7g6f), moderate | Astro `<=7.2.3` → 7.2.4 | Non-root base-path stripping can bypass pathname-based middleware authorization. No configured non-root base, authentication middleware or Astro server. |
| [GHSA-f88m-g3jw-g9cj](https://github.com/advisories/GHSA-f88m-g3jw-g9cj), high | Sharp `<0.35.0` → 0.35.0 | libvips GIF/TIFF/VIPS decoder vulnerabilities when processing untrusted input. Build/asset preparation exposure; reviewed local assets only, no deployed decoder. |
| [GHSA-rgj7-g3m4-5g8c](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c), high | Sharp `<0.35.4` → 0.35.4 | libheif memory vulnerabilities, potentially RCE in affected Linux conditions. Build-time AVIF processing exposure; no visitor-controlled decoder. |
| [GHSA-wq5f-xc86-pv6w](https://github.com/advisories/GHSA-wq5f-xc86-pv6w), high | Sharp `<0.35.5` → 0.35.5 | librsvg memory vulnerability, potentially RCE in affected Linux conditions. Relevant when decoding untrusted SVG during builds/scripts; no deployed decoder. |
| [GHSA-g7r4-m6w7-qqqr](https://github.com/advisories/GHSA-g7r4-m6w7-qqqr), low | esbuild `>=0.27.3 <0.28.1` → 0.28.1 | Windows traversal in esbuild's own HTTP `servedir` server. No repository `esbuild.serve()` use or deployed esbuild server. Build transforms alone do not expose that HTTP handler. |

The Sharp/libheif record also references underlying native advisories [GHSA-g89c-p67h-r497](https://github.com/advisories/GHSA-g89c-p67h-r497) and [GHSA-2jg2-4ch7-h545](https://github.com/advisories/GHSA-2jg2-4ch7-h545); these are references within the npm Sharp advisory, not two additional affected npm packages. Detailed upstream descriptions/ranges are retained in the evidence JSON.

## Compatibility and verification

- **Install/audit:** full `npm audit --json` reports zero in the working checkout and isolated clean installation. Standard `npm ci` started with no `node_modules` in a fresh copy of the current source/lockfile and exited 0. No audit omission, force operation or lifecycle-script bypass was added.
- **Build/tests:** Node **22.23.3**, `npm run build`, 16 routes and **143/143 tests** pass in both installations. Their **101 generated files match byte-for-byte**. Node engine now requires `^22.12.0`, matching the updated toolchain minimum.
- **Minimal compatibility changes:** preserve pre-v7 whitespace with `compressHTML: true`; switch the render-test helper from the old Go compiler to the current Rust compiler. Pin its compiler 0.4.1 and previously transitive TypeScript 5.9.3 / parse5 7.3.0 as explicit development dependencies, so clean tests no longer depend on removed Astro 5 packages. Test assertions and application source remain unchanged.
- **Workers:** the actual assets-only configuration passes **158 requests per installation**: canonical/preview Host fixtures, security headers, CORS, assets/cache/304, GET/HEAD/POST/OPTIONS, 404/405, crawler files and all 28 legacy redirect rules with queries. Migration destination checks pass without chains/loops. No API or image endpoint was introduced.
- **Browser:** all 16 routes at 390/1440px (**32 cases**) show no page errors, normal CSP violations, remote resource requests or horizontal overflow. Eleven controlled contact scenarios pass, including rejection, HTML, 429/503, redirect, network error, timeout, email fallback and accepted JSON; no real email sent. Inline-script/framing probes are blocked and direct no-JS email remains available.
- **Motion/visual:** particle running/pause/resume, offscreen frame-loop suspension, reduced-motion fallback, technology rail entry/hover pause and spotlight keyboard exclusion pass. **40 paired visual/layout cases**, five widths and both themes, retain visible main text, geometry, fonts/colors and existing clipping observations; desktop/mobile screenshots inspected. Raw header text-node whitespace differs with compiler serialization, without a rendered layout change. No new overflow or clipping observed.
- **SEO/preservation:** all 16 metadata/canonical/schema/link checks and sitemap/privacy/preview controls pass. Metadata, JSON-LD and normalized main copy match the baseline on every route. Public artwork, CSS source, downloads, robots, redirects and security headers are unchanged; only generated minification/chunk names differ. Bounded repository/output scan reports no findings.

## Remaining exposure and review

No advisories remain in this lockfile's current npm audit. This does not establish absence of unknown vulnerabilities. The deployed site has not changed: production header/TLS, version identity, preview Access and account-control checks remain B11/B14. Backend privacy/retention/abuse-control gates remain B3/B13. No SSR, upload, form backend, processor or runtime image service was added.

Evidence: sibling `outputs/v2-advisory-closure-evidence/` contains before hashes/dist, all 14 upstream GHSA details, before/after npm dependency paths and audits, isolated clean source/install/build/test logs, native versions, both Workers matrices, browser/form/motion results, paired visual records/screenshots and preservation comparisons. The source worktree remains the review target; the clean copy is verification evidence only.

Decision: [Astro security update](adr/2026-10-19-astro-security-update.md). Migration references: [Astro 6](https://docs.astro.build/en/guides/upgrade-to/v6/), [Astro 7](https://docs.astro.build/en/guides/upgrade-to/v7/), [Astro 7.2.8 release](https://github.com/withastro/astro/releases/tag/astro%407.2.8). Stop for owner review; no release action performed.
