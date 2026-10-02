# Security baseline

This is a static/prerendered Astro marketing site. It contains no credentials, API keys, client records, monitoring data or private infrastructure details.

## Implemented
- No client-side form submission or secrets.
- Minimal dependency surface.
- Deployment header baseline for CSP, clickjacking, MIME sniffing, referrer and permissions controls.
- No third-party analytics, embeds, trackers or remote scripts.
- Public operational examples are explicitly illustrative.

## Deployment checks
HSTS is deliberately not declared until the production HTTPS/subdomain plan is verified. Confirm platform support for the header file, TLS redirects, canonical host and dependency audit before launch. If a form is added: validate server-side, rate limit, add bot protection, keep message bodies out of analytics, and store secrets only in deployment environment variables.