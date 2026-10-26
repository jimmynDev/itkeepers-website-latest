# V2 technical SEO audit — 19 October 2026

## Scope and baseline

- Branch `codex/v2-prompt3-restored`, HEAD `22b5c2f9e74d9c734137036ec74a3db289c67761`. Local changes only; no commit, push, merge, deployment, DNS or account operation.
- Existing Astro 5.18.2, Node 22.23.3, Wrangler 4.143.0 and Workers static-assets architecture retained. No dependency or hosting change.
- Inventoried all 16 generated HTML routes. Full final metadata, indexability and schema inventory: [V2_SEO_METADATA_INVENTORY.md](V2_SEO_METADATA_INVENTORY.md).
- Baseline: all titles already unique; all pages already had one H1 and no heading-level skips. How We Work and Privacy shared a default description. Social images were absent. Navigation contained slashless variants; sitemap contained two slashless URLs and was maintained separately from metadata. Seven service pages lacked Service schema. Privacy explicitly remains an unfinished notice.
- Existing `robots.txt` wildcard allow policy preserved byte-for-byte from the starting workspace. Missing explicit index meta was implicit indexing, not a crawler block.

## Changes and evidence

- `src/data/seo.ts` is the single metadata/schema source. Page/template metadata props were removed to avoid competing definitions. Unregistered future routes fail the build until their SEO policy is defined.
- Preserved approved descriptions where suitable; supplied distinct How We Work/Privacy descriptions and service-specific AI, web and backup descriptions. Home, service-directory and Managed IT metadata naturally identify the Lebanon MSP using existing owner-authorized wording (claims register V2-POSITIONING-01). Existing visible BusinessValue text already explains the MSP/Lebanon positioning, so no visible copy change was needed.
- Preserved HTTPS apex canonical host. Canonicals, social URLs, schema identifiers, sitemap URLs and internal route links now use matching trailing slashes. Contact review query parameters and all fragments preserved; queries are not added to canonicals.
- Added shared social metadata using the existing official logo, absolute image URL, dimensions and alt text. This is a logo fallback, not newly designed social artwork. No social-profile URLs invented.
- One JSON-LD graph per page: one Organization definition with stable ID; WebSite on Home; Service on seven service pages; retained Pulse WebApplication and AI-playbook DigitalDocument in the shared graph using organization references rather than repeated nested Organization definitions. No ratings, reviews, offices, hours, certifications, prices, guarantees or availability added.
- LocalBusiness is **not applicable to the verified data available in this task**: no approved physical business address or separately verified local establishment. Lebanon-based MSP wording does not establish a street address. Older indexed Florida details and obsolete phone numbers were not imported. Revisit B3 when public location facts are verified and approved.
- Generated sitemap from the same registry: 15 canonical indexable URLs, no invented lastmod dates. `/privacy/` remains linked and crawlable with explicit `noindex, follow`; the draft is excluded from sitemap. Other 15 routes have `index, follow`.
- Preserved the existing robots crawler policy and sitemap declaration. No training/retrieval-policy change.
- Cloudflare `_redirects` contains exact 301 rules only. No wildcard/Home fallback or speculative numbered paths. See [redirects.csv](../redirects.csv) for every slash variant and evidence.

## Legacy discovery and all implemented migrations

Live retrieval began 18 October and validation completed 19 October (Asia/Beirut). Two site generations are visible: the current React application and older indexed WordPress pages/navigation.

Sources:

- Live homepage: <https://itkeepers.com/>. Its module `/assets/index-DmpsIxbM.js` was fetched successfully with ordinary browser request headers. The route definitions, `zb` service records, translated service labels and `Yj` route branches independently establish all seven solution IDs. Bundle SHA256: `e749c96f3daab9d4850181766daf2418aed9af12c3aa46995576e54282649f7d`.
- Indexed older navigation: <https://itkeepers.com/privacy-policy/> supplies explicit labels and links for Managed IT, Cloud Services, Security Solutions, Email Management, Computer Networking, Server Management and Contact Us.
- Indexed cloud content: <https://itkeepers.com/solutions/2> corroborates the cloud route.
- Both slash forms are implemented for **every source below**: 14 distinct legacy paths, 28 exact rules. Slash variants are URL normalization, not independently claimed historical URLs.

| Legacy source paths (with or without trailing slash) | V2 destination | Equivalence evidence |
|---|---|---|
| `/solutions/1`, `/security-solutions` | `/services/cybersecurity/` | Live Security record/branch; old Security Solutions navigation; V2 layered security scope |
| `/solutions/2`, `/cloud-services` | `/services/microsoft-cloud/` | Live Cloud record/branch and indexed cloud page; old Cloud Services navigation; V2 cloud administration scope |
| `/solutions/3`, `/managed-it` | `/services/managed-it/` | Live Managed IT record/branch and old Managed IT navigation |
| `/solutions/4`, `/computer-networking`, `/server-management` | `/services/networks-infrastructure/` | Live Networking record/branch and old networking/server navigation; V2 explicitly covers networks, servers and endpoints |
| `/solutions/5`, `/email-management` | `/services/microsoft-cloud/` | Live Email record/branch and old Email Management navigation; destination includes Exchange Online and email provisioning |
| `/solutions/6` | `/services/web-design-hosting/` | Live Web Dev record/branch; V2 design, hosting and maintenance scope |
| `/solutions/7` | `/services/ai-automation/` | Live AI & Automation record/branch; V2 AI governance and automation scope |
| `/contact-us` | `/contact/` | Old Contact Us navigation; current V2 contact route |

Current live `/`, `/about` and `/contact` retain their route meaning. Existing Workers HTML handling normalizes the latter two to directory URLs; no migration to a different page is necessary. The legacy app also exposes `/clients` and `/clients/:clientName`; neither has an equivalent V2 route. Its administrative routes are not public marketing migrations and receive no redirect.

## Verified paths deliberately left unmapped

These are inventory findings, not guessed redirects. Local runtime returns 404 for absent routes; no 410 retirement decision has been made.

| Legacy paths | Reason / required action |
|---|---|
| `/privacy-policy/` | V2 `/privacy/` is an unfinished noindex notice, not a release-ready replacement. B3/B13: finalize the notice, verify actual handling, then add the equivalent migration. Do not erase a published policy by redirecting it to a draft. |
| `/clients`, `/clients/:clientName` | Current app client listing/detail routes; no equivalent client-story pages in V2. Obtain real URL/export inventory and decide retention or restoration. Do not redirect unrelated stories to Home. |
| `/reviews/` | Old review page exists; V2 has no equivalent dedicated review page. No fake review markup or homepage redirect. |
| `/feedback/` | Old feedback form/page; Contact is not established as the equivalent workflow. |
| `/blog/` | No V2 blog or verified article replacements. Need Search Console/old sitemap export for article URLs. |
| `/managed-it-specialists-in-fort-lauderdale-fl/` | No equivalent V2 location page or approved location-content migration. |
| `/managed-it-specialists-in-boca-raton-fl/` | Same; indexed page independently confirms historical path. |
| `/managed-it-specialists-in-hollywood-fl/` | No equivalent V2 location page. |
| `/managed-it-specialists-in-orlando-fl/` | No equivalent V2 location page. |
| `/managed-it-specialists-in-hialeah-fl/` | Same; indexed page independently confirms historical path. |
| `/managed-it-specialists-in-miami-fl/` | No equivalent V2 location page. |

Discovery limitations: live `/robots.txt`, `/sitemap.xml`, `/sitemap_index.xml` and `/wp-sitemap.xml` returned the React HTML shell with 200 instead of usable crawler files. These are production findings, not proof that the paths contain sitemaps. Live JS provides the present route definitions; older indexed content provides historical navigation. Search Console/Bing, server logs, old CMS exports and backlink data were unavailable. B11 remains open for the full historical inventory, host/HTTPS consolidation and production revision. No claim of exhaustive historical URL discovery.

## Validation

| Check | Result / evidence |
|---|---|
| Astro production build | Pass: 16 HTML pages plus generated sitemap, Node 22.23.3 |
| Regression suite | Pass: 137/137, including four new built-output SEO regressions; existing URL assertions updated to require canonical slashes |
| Metadata/canonicals/social/H1 hierarchy | Pass on all 16 generated routes; unique titles/descriptions, one canonical/H1/robots tag, aligned OG values, social images and no heading-level skips |
| Internal links/anchors | Pass: all generated same-origin anchor destinations and fragments exist; no noncanonical route-link warnings; no duplicate element IDs |
| Structured data | Pass for JSON parsing, one graph/Organization definition per page, stable IDs, no duplicate entity definitions, seven Service entities and retained application/document entities; forbidden fabricated fields absent |
| Indexability/robots/sitemap | Pass: 15 indexable canonical pages in sitemap, draft Privacy noindex and crawlable, preserved wildcard robots policy |
| Local Cloudflare runtime | Pass: Wrangler parsed 28 valid redirect rules; 50 HTTP requests cover 28 source rules, all 16 HTML routes, robots/sitemap/logo, unknown/unmapped URLs. 301 + correct Location for every rule, direct 200 destinations, real 404s for missing/reviews/privacy-policy paths |
| Preservation | Pass: all 16 generated main regions match baseline after canonical-link normalization, removal of consolidated JSON-LD, scope-ID normalization and script-hash normalization. Exact hero H1 retained. All starting controller/style/animation source files unchanged; 120 starting source/public/test/config files byte-identical |
| Whitespace | Pass under repository CRLF-aware Git diff check |
| Semantic interface review | Pass within SEO scope against repository-required Vercel guidelines retrieved 19 October: native links, hierarchy, meaningful social-image alternative, no visible design/control changes. No full accessibility certification |
| Search-engine external validators | Not run: no live V2 URL published; local JSON/vocabulary checks are not Google's Rich Results Test or Schema.org validator approval |
| Production responses/search indexing | Not verified for V2: no deployment authorized. Local HTTP validation does not establish production DNS, host redirects, robots, headers, selected canonicals or indexing |
| Preview security | B14 remains open for remote preview authentication/noindex verification. Local production-mode build deliberately uses production canonical/indexability rules |

Evidence kept outside the Git worktree in sibling `outputs/v2-seo-evidence/`: before hashes/build HTML, baseline/final audits, legacy discovery and JS, build/test logs, HTTP results and preservation report. Reproduce with Node 22: `node node_modules/astro/astro.js build`, `node --test tests/*.test.mjs`, `python scripts/audit-seo.py dist`. Validate redirects through `node node_modules/wrangler/bin/wrangler.js dev --local`; Astro dev/preview does not apply Workers `_redirects`.

References checked: [Cloudflare Workers redirects](https://developers.cloudflare.com/workers/static-assets/redirects/), [Google LocalBusiness requirements](https://developers.google.com/search/docs/appearance/structured-data/local-business), [Vercel semantic review rules](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md).

## Handoff

- Decisions: exact verified migrations only; no LocalBusiness without verified location; draft Privacy noindex; preserve all approved visible wording. No proposed business facts introduced.
- Needs review: Jim for this local SEO patch and unresolved migration decisions; Ops for B3/B11/B13/B14 release inputs.
- Main files: `src/data/seo.ts`, `src/layouts/Base.astro`, page/template Base calls, `src/pages/sitemap.xml.ts`, `public/_redirects`, `redirects.csv`, canonical link literals, `scripts/audit-seo.py`, `tests/seo.test.mjs`, two existing URL-assertion tests, this report, inventory and maintained root records. Old `public/sitemap.xml` replaced by generated endpoint. Existing design/style/controller changes belong to the starting workspace.
- Preview: <http://127.0.0.1:4366/> using local Cloudflare runtime. Stop for review; no release action performed.
