# Phase 3 security audit — 19 October 2026

Follow-up: the dependency findings below are historical. All 14 listed package advisories were subsequently closed with Astro 7.2.8 / Sharp 0.35.5 / esbuild 0.28.2 and zero full-audit findings. See [advisory closure](V2_SECURITY_ADVISORY_CLOSURE.md) for exact IDs and clean-install evidence. Production/access/privacy checks below remain open.

Local hardening completed on `codex/v2-prompt3-restored`, HEAD `22b5c2f9e74d9c734137036ec74a3db289c67761`. Existing dirty work was retained. No commit, push, merge, deployment, account mutation or real inquiry submission occurred. This is a local audit, not production release approval.

## Findings and fixes

| Severity / status | Finding, exposure and action |
|---|---|
| Critical scanner finding — open | Astro 5.18.2 is flagged for AVIF image-processing RCE and other advisories. Deployment is static assets only: no Astro server, server islands, user-controlled template input or image optimizer; `/_image` returns 404 locally. The AVIF vector requires processing untrusted artwork. Keep builds limited to reviewed inputs; a reviewed Astro major migration remains outstanding. Do not describe npm audit as clean. Owner: developer/Ops. |
| High — fixed in tooling | Wrangler 4.143.0 pulled vulnerable Undici/Sharp through Miniflare. Updated only this direct dependency to pinned 4.151.1 with its lockfile. Undici is now 7.29.1, tooling Sharp 0.35.5, and local Workers tests pass. No Astro major upgrade or broad audit-force operation. |
| High scanner finding — open | Astro's Sharp 0.34.5 retains image-decoder advisories, including SVG processing on affected Linux environments. Current build uses reviewed local assets; no remote input or uploads are accepted. Untrusted image processing/builds remain unsafe until reviewed remediation. Owner: developer/Ops. |
| Medium — production check open | Read-only HTTPS requests to the existing live site did not return the application CSP, HSTS, framing or nosniff headers. It remains the legacy application, not this V2 build. Local V2 header checks pass; no remote remediation was authorized. Owner: Ops, B11/B14. |
| Medium — activation/access gates open | Private preview authentication, deployment-token scopes, MFA, branch protection and CI isolation are unverified. workers.dev noindex works locally but does not protect content. Optional inquiry API remains disabled; server abuse controls and B3/B13 privacy/retention approval are prerequisites for activation. Owner: project owner/Ops. |
| Low — fixed | Build/browser endpoint guards disagreed on `/contact` versus `/contact/`. One shared validator now rejects both, case/slash variants, external/protocol-relative URLs, query/fragment/control-character and traversal forms. Added behavioral boundary tests. Current email handoff stays unchanged. |
| Low — fixed | Wrangler `.dev.vars*` secret files were not ignored. Added exact ignore patterns; no existing environment file or leaked secret was found in the inspected checkout. |
| Low scanner finding — open | Astro's esbuild 0.27.7 has a Windows development-server file-read advisory. Do not expose development servers; local audit services bind to loopback. A transitive override across esbuild minor versions was not imposed without compatibility review. Owner: developer. |

`npm audit`: **6 → 3 affected packages**, remaining **1 critical / 1 high / 1 low**. These labels describe dependency advisories; no exploitable critical production endpoint was demonstrated. Trusted inputs and absent runtime features constrain exposure, but do not patch the dependencies.

## Headers and browser behavior

The tighter CSP ran in **Report-Only first**, alongside the original enforced policy. After zero normal-operation violations on all 16 routes at 390/1440px, it was promoted and the browser matrix repeated. Deliberate inline-script and iframe probes were blocked as expected; their violations are separate from normal-operation results. No CSP report collector/processor was added.

Final policy permits same-origin scripts, connections, fonts and manifests; images are same-origin/data only. It blocks frames, workers, objects, base elements and framing by other sites. `form-action 'self'` remains. Existing inline CSS is required by SVG artwork and style updates, so `style-src 'unsafe-inline'` remains; JavaScript has neither `unsafe-inline` nor `unsafe-eval`. No Trusted Types/COEP restriction or unsupported bot-provider exception was introduced. COOP was evaluated: external PDF tabs already use `noopener noreferrer`; no opener-dependent flow or verified COOP defect justified a new policy.

`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin` and camera/microphone/geolocation denial remain active. HSTS is staged on the verified HTTPS apex only at **86400 seconds**, without `includeSubDomains` or preload. Local Host-header matching proves configuration delivery, not TLS/browser HSTS enforcement. A browser that receives it can retain it for one day; removing the header alone does not immediately reset that state.

The actual local Wrangler/Miniflare runtime returned these controls on tested 200/301/304/404/405 responses. Cloudflare documents redirect/header precedence and separate Worker-response handling; production edge redirects/errors must still be checked independently. No Worker entrypoint was added merely to duplicate observed local header behavior.

## Scope and verification

| Check | Result / evidence |
|---|---|
| Node 22 production build and regressions | **Pass:** 16 routes, 143/143 tests. |
| Workers runtime matrix | **Pass:** 158 requests covering both production/preview Host fixtures, pages, assets, crawler files, all 28 legacy rules with queries, missing/private-looking paths, GET/HEAD/POST/OPTIONS and conditional 304. No permissive CORS or header coverage gap observed. Fixtures use localhost only. |
| Migration/SEO | **Pass:** all 28 legacy rules and final destinations, 16 metadata/schema/link routes, 15 sitemap URLs and privacy noindex. Production canonicals and preview noindex retained. No redirect mappings changed. |
| CSP/browser | **Pass:** 32 page/viewport cases in Report-Only and 32 after enforcement; mobile cold responses and desktop cache revalidations (304) rendered correctly. No normal CSP violations, remote resource requests, page errors or horizontal overflow. Framing and inline execution probes blocked. |
| Contact browser fixtures | **Pass in both CSP phases:** invalid input; fixed-recipient email handoff; rejected contact-page endpoint; HTML response; JSON rejection; 429; 503; redirect; network failure; accepted JSON; 15-second timeout. Failure retains fields/retry, only accepted JSON shows success, no form values in app storage. These synthetic responses test the client, not a nonexistent backend's security. No email was sent. |
| No-JS fallback | **Pass:** direct approved email link remains. Native form submission to mailto is restricted by CSP; automatic inclusion of all fields requires JavaScript, as the page states. Native mail-client launch/delivery requires a human check. |
| Secrets/output/requests | **Pass within bounded scan:** repository files and 100 generated files, no detected credential pattern, leaked config/source map/internal document, remote executable resource or inline executable script. Private-looking/config paths and image/inquiry endpoints return 404; static page POST/OPTIONS return 405. No CORS credentials or wildcard grants. This is not proof that all possible secrets are absent. |
| Download/asset inspection | **Pass within inspected formats:** 26-page public PDF has no JavaScript, attachments, launch/open actions, additional page actions or detected credential/private-network pattern; only generic title/producer metadata. Eight PNG/WebP assets have no EXIF/XMP/IPTC. ICO is not decoded by Sharp; no photo/geolocation content is used. |
| Caching | **Pass:** only fingerprinted JS/CSS/assets immutable; HTML revalidates; no inquiry endpoint, session cookie or personalized response exists to cache. Future backend must explicitly use no-store. |
| Preservation | **Pass:** all 16 main-content text streams unchanged; all existing CSS/artwork/download bytes unchanged. Only `_headers` changed among non-HTML/JS build files. No design or animation implementation changed. |

## Production-only checks / blockers

Ops must verify the eventual deployed version/configuration and real apex, www, default, version, alias and custom preview hosts. Check HTTPS/certificate/redirect behavior, HSTS persistence, security headers on all response classes, CORS/cache rules, account-injected scripts and private-preview Access. The live legacy site still needs the V2 migration and security controls; this audit did not deploy them.

Review the remaining Astro/Sharp/esbuild advisories before allowing untrusted builds or introducing SSR/image processing. Keep backend delivery disabled until server-side method/size/schema/origin/rate/bot controls, durable acceptance, no-store behavior, inquiry ownership, retention and approved privacy wording are verified. Native email-client handoff, real delivery and physical-device/Safari checks remain human/production checks. A monitored vulnerability-reporting contact is unapproved, so no security.txt or response-time promise was invented.

Account/release controls and B3/B11/B13/B14 remain with the project owner/Ops. Review `THREAT_MODEL.md` and `SECURITY.md`. No release-readiness certification is implied.

Evidence: sibling `outputs/v2-security-evidence/` contains starting hashes/source/dist snapshot, before/after npm audit, dependency/lifecycle inventory, build/test logs, runtime headers, both CSP browser results, migration/SEO/output scans, asset inspection and preservation records. Browser helpers use a recorded external Puppeteer cache, not a new application dependency. To reproduce: Node 22 `node node_modules/astro/astro.js build`, `node --test tests/*.test.mjs`, `python scripts/audit-security.py dist`, `python scripts/audit-seo.py dist`, then Wrangler local and the evidence folder's runtime/browser helpers.

References: [Cloudflare asset headers and precedence](https://developers.cloudflare.com/workers/static-assets/headers/), [MDN CSP Report-Only](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy-Report-Only), [MDN HSTS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Strict-Transport-Security), [Astro AVIF advisory](https://github.com/advisories/GHSA-26w7-cxv4-gfx2), [Sharp SVG advisory](https://github.com/advisories/GHSA-wq5f-xc86-pv6w). Remaining advisory details/URLs are retained in `audit-after.json`.
