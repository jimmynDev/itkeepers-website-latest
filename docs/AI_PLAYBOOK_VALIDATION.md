# AI Governance Playbook validation — 6 October 2026

Scope: local existing Astro site; not deployed. Owner: implementation agent; Jim for final review.

Pass: npm run build, 11 static routes. Pass: node --test tests/*.test.mjs, 27/27 established tests. Pass: TypeScript noEmit check on src/scripts/ai-playbook.ts.

Pass: headless installed Chrome against Astro production preview at http://127.0.0.1:4336. Fresh state does not show immediately; 4.5-second timer opens; 25%-scroll exercise opens through the 20% threshold. ×, Maybe later and keyboard Escape close; focus enters the close control, Shift+Tab/Tab wrap and previous focus is restored. Background scroll lock is released on close. Dismissed state survives reload; 15-day-old dismissal is eligible again. CTA routes to resource and saves engaged=true, suppressing later Home visits. Service landing has no announcement. PDF returns HTTP 200/application/pdf and its entire body matches the supplied file byte-for-byte.

Pass: 320, 375, 768, 1024 and 1440 CSS-pixel viewport widths, 800px viewport height; no dialog horizontal overflow, minimum 16px side clearance, card within viewport after entrance transition, background does not scroll, resource page has no horizontal overflow. Simulated prefers-reduced-motion yields animation-name:none. No page errors observed. Desktop and mobile screenshots visually reviewed; fixed preview-label contrast. Browser runner and screenshots retained in this chat workspace work/ folder.

Limitations: headless keyboard and desktop-emulated mobile checks do not certify screen-reader behavior or physical mobile devices. Native dialog supplies modal inertness; explicit focus wrap is also implemented. When localStorage is denied, persistence is limited to module memory for the current document; cross-navigation persistence cannot be guaranteed without browser storage. No third-party analytics, cookie, framework or font dependency added. Playbook module ~2.22 kB / 0.98 kB gzip; PDF fetched only on explicit access. Existing Organization graph unchanged; DigitalDocument schema has no invented publication date.

Source: unchanged owner-supplied PDF titled AI Operations Playbook. Public requested title is ITKeepers AI Governance Playbook; source internal/draft limitations shown on resource page. Public PDF path: /resources/itkeepers-ai-governance-playbook.pdf. Resource route: /resources/ai-governance. Existing Cloudflare Worker-assets configuration preserved; no deployment performed.
