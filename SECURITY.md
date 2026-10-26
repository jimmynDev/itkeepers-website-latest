# Security baseline

This is a static/prerendered Astro marketing site. Browser code and generated assets must not contain credentials, API keys, private client records, monitoring data or private infrastructure details.

## Implemented
- Contact forms currently use an email handoff. With JavaScript enabled, the browser validates the entered fields and service selections, then composes a `mailto:` message to the fixed inquiry address, `info@itkeepers.com`. The visitor must review and send it in their email app; the website does not confirm delivery.
- Without JavaScript, direct email links remain available; automatically including all form details requires JavaScript.
- The current static site provides no inquiry-processing backend, server-side validation, rate limiting, bot verification, delivery queue or delivery receipt. Browser validation is a usability measure, not a server security boundary.
- Optional backend mode is selected at build time through `PUBLIC_CONTACT_FORM_ENDPOINT`, restricted by one shared build/browser validator to a same-origin path, excluding `/contact` and its slash variants. Setting it does not create a backend or its security controls. No secrets belong in public environment variables.
- CSP was tested in Report-Only against the built site before enforcement. Scripts, connections and fonts are same-origin; frames, workers, objects and base elements are blocked. Inline styles remain permitted for existing SVG artwork and animation styles. Inline JavaScript and eval are not permitted.
- Deployment headers cover clickjacking, MIME sniffing, referrer and permissions controls. Local Wrangler 4.151.1 responses were tested independently for pages, assets, redirects, errors, HEAD, unsupported methods and conditional responses.
- `.env*` and Wrangler `.dev.vars*` files are ignored. `python scripts/audit-security.py dist` checks repository files and generated output with bounded credential patterns without echoing matches.
- No third-party analytics, embeds, trackers or remote scripts.

## Deployment checks

The static `_headers` file now adds `X-Robots-Tag: noindex` on `:version.:subdomain.workers.dev` hosts. Canonical production hosts do not receive that header. This is an indexing safeguard, not access control. Protect private previews through verified Cloudflare Access or equivalent authentication; account-level protection, actual preview hostnames and custom preview domains remain unverified. No remote configuration was changed. See `docs/V2_MIGRATION_READINESS.md`.
HSTS is staged at `max-age=86400` on `itkeepers.com` only, after read-only verification of the apex HTTPS response. It does not include subdomains or preload. The header matches in the local Workers runtime; browser enforcement over production HTTPS remains a release check. A browser can retain this policy for one day after receipt; removing the header does not immediately clear it. The live legacy site currently does not return HSTS or the new application security headers.

The 19 October 2026 follow-up closed the remaining 14 package advisories by updating Astro 5.18.2 to pinned 7.2.8; its supported dependency ranges resolve Sharp 0.35.5 and esbuild 0.28.2. Full npm audit and an isolated `npm ci` both report zero vulnerabilities. No overrides, advisory suppression or audit-force operation were used. Exact GHSA IDs, dependency paths, exposure and verification are in `docs/V2_SECURITY_ADVISORY_CLOSURE.md`; the earlier Phase 3 findings are historical.

This assets-only deployment has no Astro server, server islands or image-optimization endpoint. Reviewed repository assets are processed at build time; public visitors cannot invoke the build tools. Keep development servers on loopback and review build inputs even after this update. The required Node 22 minimum is now 22.12.0; validation used 22.23.3. These local updates have not been deployed and do not change the legacy site's production exposure.

Before enabling backend contact delivery, implement and verify server-side method, content-type, field and body-size validation; fixed recipient/sender handling; rate limits and bot protection; timeout, retry and delivery-failure behavior; and private server-side secret storage. The browser expects JSON `{ ok: true }` only after durable delivery acceptance. Keep message bodies out of analytics and operational logs. Confirm the inquiry owner, processor, mailbox handling, retention and approved privacy notice before activation.

## Review and incident ownership

Project owner/Ops must verify production routing, Access on every private preview hostname, least-privilege deployment tokens, MFA, branch protections, CI secret isolation and rollback access. These account controls were unavailable locally and are not certified by browser tests. `THREAT_MODEL.md` records the boundaries and containment steps.

A monitored vulnerability-reporting contact has not been approved. Do not invent a security mailbox, response deadline, safe-harbor promise or public security.txt. Route a suspected exposure privately to the project owner/Ops, retaining sanitized request IDs and timestamps rather than inquiry bodies or credential values.
