# Phase 5.2 — Retained legacy URL migration

20 October 2026 · `codex/v2-prompt3-restored` · HEAD `22b5c2f9e74d9c734137036ec74a3db289c67761` plus preserved uncommitted work.

**Partially implemented; production migration remains NO-GO.** Retention is approved for the client-story collection, all six Florida service areas and old articles. That decision supersedes possible retirement for those families; it does not verify old project outcomes, availability, credentials or city-specific delivery facts. Privacy redirects remain gated on legal approval; Reviews/Feedback remain pending. No new redirect or 410 was added.

## Implemented from supported source

- `/blog/`: a real archive index linking to three substantive retained articles, also linked from the existing Resources footer. It is not a coming-soon page or a claim that the whole blog is migrated.
- `/2023/09/the-future-of-artificial-intelligence-ai/` — originally published 28 September 2023.
- `/2023/09/understanding-datafication/` — originally published 4 September 2023.
- `/2023/10/how-do-ai-and-ml-differ/` — originally published 5 October 2023.

The three educational article bodies retain their recovered core paragraphs/headings and original dates. An explicit historical-context notice distinguishes them from current service inclusions; no new expert, review date, dateModified or business result is claimed. The old shared sales module, local-business/location/hours schema, theme code and optional stock images were not imported. No image was hotlinked or invented. Existing Organization identity is reused, with one Article entity per article and verified source publication dates. Metadata, OG, self-canonicals and sitemap entries are aligned. E1/E2, Pulse, backup and emergency boundaries remain unchanged.

## Source, article and asset inventory

- **Six complete client stories recovered:** static legacy data and all 61 body fields match fresh rendered public pages. Captured story sections cover project, story, partnership, initiatives and impact. Aliases such as Corning Insurance Solutions LLC/CorningInssol and TG Forwarding/TransGlobal are recorded as source wording, not newly verified legal identities. Full source is available for review; lack of source text is no longer the blocker. Project/outcome evidence and safe qualification of legacy absolutes remain missing. Existing PFC/IMA homepage testimonial approval covers those exact excerpts, not every case-study assertion or media asset.
- **Client media:** six logo references (four remote files, two embedded images) and six video references inventoried. All ten remote files returned 200 with expected image/video MIME types on HEAD. Asset availability does not prove permission or project facts. Logos/video are optional for text-first stories; review rights and, if video is retained, captions/transcripts/poster and accessible playback. No client media was added to V2.
- **Historical content:** the public archive index yielded 77 URL records. All 21 selected snapshots were recovered: 13 dated posts, six city pages and the blog index/page 2. These are archived source versions, not an exhaustive or necessarily latest CMS export. The workspace/archive searches found no original WordPress database/export; the other local checkout and ZIP are Astro iterations, not the missing legacy CMS. Current live feed, WordPress-post API and sitemap URLs return React HTML, not content inventories.
- **Three of 13 recovered posts implemented; ten held for specific editorial/claim gaps.** [Article inventory](../legacy-article-inventory.csv) records every exact URL, original title/date, snapshot, file hash, assets, approval scope and blocker. A seventh city name appears in the Parkland RPA article; retaining that article does not establish another office or service promise.
- [Additional URL inventory](../legacy-additional-url-inventory.csv) records 46 further archive observations, including pagination/taxonomy/author routes, old HTML URLs, legal/review/feedback query paths and infrastructure/assets. These are candidates, not verified replacement decisions. No auto-retirement or speculative redirect was inferred. Search Console/server/CMS/backlink exports are still needed for complete coverage.

Source examples: [AI article capture](https://web.archive.org/web/20231210225837id_/https://itkeepers.com/2023/09/the-future-of-artificial-intelligence-ai/), [datafication capture](https://web.archive.org/web/20231210233305id_/https://itkeepers.com/2023/09/understanding-datafication/), [AI/ML capture](https://web.archive.org/web/20231210225756id_/https://itkeepers.com/2023/10/how-do-ai-and-ml-differ/). The machine-readable records contain the other snapshot URLs.

## 17-URL migration manifest

[Full manifest](../legacy-retention-manifest.csv): exactly the original 17 URL rows, with retained-path intent, required text/assets, evidence, approval scope, active redirect, expected local status, canonical/sitemap state and launch blocker. Retained path means the intended original URL; a blocked 404 emits no page or canonical. Client paths without a final slash remain reserved as recorded; their final slash handling will be verified when implemented.

| Legacy URL | Current local result / decision | Remaining gate |
|---|---|---|
| `/privacy-policy/` | 404 · blocked, not retired | Approved accurate notice and legal redirect/destination decision. |
| `/clients` | 404 · blocked, not retired | Verified substantive story pages and an approved factual listing; no empty collection. |
| `/clients/corning-insurance-solutions` | 404 · blocked, not retired | Project/identity/outcome verification; protected-data wording and media rights. |
| `/clients/drugstore3u` | 404 · blocked, not retired | Business history/project facts; fully-protected/faster-response claims. |
| `/clients/international-maritime-academy` | 404 · blocked, not retired | Actual initiative/recovery/outcome scope; full story exceeds approved quote. |
| `/clients/transglobal` | 404 · blocked, not retired | Project and alias verification; no-interruption/security claims. |
| `/clients/pfc-international` | 404 · blocked, not retired | Case initiatives/outcomes; full story exceeds approved quote. |
| `/clients/sawaya-group` | 404 · blocked, not retired | Regional/project facts, Oracle/e-commerce scope and savings evidence. |
| `/reviews/` | 404 · blocked, not retired | Separate review content/permission/handling approval. |
| `/feedback/` | 404 · blocked, not retired | Separate workflow and query-variant handling approval. |
| `/blog/` | 200 · retain, partially implemented | Three real articles live locally; ten recovered posts and pagination/taxonomy still pending. |
| `/managed-it-specialists-in-fort-lauderdale-fl/` | 404 · blocked, not retired | Certified/local-provider/RPA assertions; distinct verified delivery scope. |
| `/managed-it-specialists-in-boca-raton-fl/` | 404 · blocked, not retired | Always-on/data/standby claims; distinct verified delivery scope. |
| `/managed-it-specialists-in-hollywood-fl/` | 404 · blocked, not retired | Always-available support claims; distinct verified delivery scope. |
| `/managed-it-specialists-in-orlando-fl/` | 404 · blocked, not retired | Certified/round-the-clock support claims; distinct verified delivery scope. |
| `/managed-it-specialists-in-hialeah-fl/` | 404 · blocked, not retired | Certified/always-available claims; distinct verified delivery scope. |
| `/managed-it-specialists-in-miami-fl/` | 404 · blocked, not retired | Flawless-migration guarantee and distinct verified delivery scope. |

The **16 unimplemented original URLs** remain genuine 404s, without links/sitemap entries or placeholder 200 pages. These are temporary implementation gaps, not approved retirements. Client stories and city routes are retained launch scope; they must be implemented with supported content before full cutover. Privacy/Reviews/Feedback need their separate decisions. The ten blocked article URLs likewise remain 404 and outside the sitemap.

## Validation and preservation

- Build: **20 HTML routes / 19 indexable**, up from 16/15 through the four supported additions; Privacy remains noindex. **146/146 tests pass**, including new source-body/date/schema/manifest/blocked-route regressions.
- SEO/link audit: **0 failures / 0 warnings** for metadata, canonicals, OG, schema, sitemap and links/fragments. No links to blocked stories, cities or articles were added. Homepage main content is unchanged; its contextual links stay intact.
- Local Workers: all **28 existing 301 rules**, both slash forms and query preservation, pass with direct 200 targets in production/preview-host fixtures across all 20 routes. `redirects.csv` and `public/_redirects` are byte-identical to the start.
- Retention status checks: **60 requests** cover both slash variants for all 17 original rows and 13 article rows. Four canonical retained URLs return 200; their slashless variants use the existing Workers **307** folder normalization. This is [documented default HTML handling](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/#automatic-trailing-slashes-default), separate from the unchanged legacy 301 rules. It is not reported as a new permanent migration redirect.
- New pages: **16 Chrome responsive cases** at 320/390/768/1440, plus four WCAG axe cases, pass with no overflow, page errors, CSP events or reported WCAG violations. A 320px long-heading overflow was fixed only in the new article template; mobile/desktop screenshots inspected. Manual/real-device accessibility remains part of the prior Phase 5 gate.
- Existing 16 generated pages differ only by the requested archive discovery link in the Resources footer (the already-fixed Emergency control is preserved). No prior visible copy, styles, scripts, animations, schema data or page URLs changed. Existing headers/robots, dependencies and public assets are unchanged; the sitemap grows only by the four approved additions. Bounded output/security scan has no findings. No archived LocalBusiness, address, rating, hours or partner claim was imported.

## Launch blockers / next evidence

1. **Client records:** verify each story’s actual project scope/outcomes and the required corrections to unsupported absolutes; confirm any media rights before use. Retention is already approved—do not reopen delete/retain decisions.
2. **Six cities:** confirm differentiated, truthful service-area delivery information and qualify/remove unsupported availability, certification, migration and protection claims. No city office, address, map, local case or duplicated city-swapped page can be invented.
3. **Blog:** complete review/correction of the ten identified posts; decide supported handling for the historical welcome announcement, blog page 2, taxonomies and author archives. Keep every known original article URL in the inventory; do not silently discard the blocked posts.
4. **Privacy/Reviews/Feedback:** legal approval precedes any Privacy redirect; review/feedback decisions remain separate. Existing Cloudflare deployment/access, inquiry handling and production verification gates remain open. **No production GO is implied.**

Evidence: sibling `v2-phase52-migration-evidence` contains the 231-file starting manifest, six rendered story captures and exact source comparisons, story/media inventories, 77-record archive index, 21 source snapshots/extracts, review notes, build/test/SEO/security logs, runtime/status/browser checks and preservation records. The initial count of 12 article URLs was corrected to **13** during inventory. A first validation-helper expectation for slashless redirects was corrected to Workers’ documented 307 behavior; application redirect configuration was not changed.

No commit, push, merge or deployment. Local archive preview: http://127.0.0.1:4368/blog/.
