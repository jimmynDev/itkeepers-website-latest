# V2 Parkland office and MENA/USA positioning — local owner review

28 October 2026, Asia/Beirut. Ready for owner review; **not deployed**. No new development commit, push or merge.

## Verified backup and development source

- Repository: [jimmynDev/itkeepers-website-latest](https://github.com/jimmynDev/itkeepers-website-latest).
- Created [backup/v2-rc-20261027](https://github.com/jimmynDev/itkeepers-website-latest/tree/backup/v2-rc-20261027) at exactly **b35279b5ba4ee0baa20c8004d0260489b956b6b3**, using the GitHub create-branch API before any source edits. Independently verified the remote branch/SHA with `git ls-remote`. Leave it unchanged as the permanent release checkpoint; no branch-protection settings were changed.
- Owner explicitly resolved the outdated version reference and selected current live RC version **3ff17ce5-9e35-4305-a912-2595ecd79f30**, deployment **90badc64-f8ea-4b7d-9c36-15e61a1501f2**. Cloudflare's deployment annotation names the exact commit above. All116 publicly served files matched its existing local artifact before editing. Version0aec0a19 is historical.
- Created local branch **codex/v2-parkland-mena-usa** directly from that commit after verifying the remote backup. HEAD remains b35279b; these changes are uncommitted. Existing competition branch b7f089349149b440d8d5adebd6c1c8a317308688, main2c271cac1d6da1aef1443f061294ccd28d16c72d and all other branches were not moved.
- Existing architecture: Cloudflare Worker plus static assets. Account/deployment/site checks were read-only. Authorized GitHub branch creation did not change any Cloudflare deployment.

## Exact copy

Homepage H1 remains **Your IT person is a team.** Homepage SEO title remains **Managed IT, Cybersecurity & Cloud | ITKeepers**.

Hero subheading before:

> Familiar engineers. Shared context. A whole team behind the work.

Hero subheading after:

> Proactive managed IT, cybersecurity, Microsoft 365 and infrastructure for businesses across MENA and the United States.

About replaces `ITKeepers has two physical offices:` within the existing office section with:

> With physical offices in Dbayeh, Lebanon, and Parkland, Florida, ITKeepers supports businesses across the Middle East and North Africa (MENA) and the United States.

No duplicate geographic-presence paragraph or new section. About, Contact and every shared footer now display:

```text
Lebanon office
Enterprise & Innovation Centre
Dbayeh, Lebanon
+961 81 816 761

USA office
ITKeepers
6778 NW 66th Ave
Parkland, FL 33067
United States
+1 561 600-9940
```

Telephone links: `tel:+96181816761` and `tel:+15616009940`. The USA address replaces `Pompano Beach, Florida, USA`. Lebanon gains line breaks and its existing published telephone. Existing info@itkeepers.com, support@itkeepers.com, emergency/general Lebanon phone and form handling remain unchanged. No Lebanese street/postal information was invented.

Homepage identity paragraph after:

> ITKeepers is a managed service provider with offices in Dbayeh, Lebanon and Parkland, Florida, USA. Discover how ITKeepers works.

Only Pompano Beach changed to Parkland in that paragraph; the existing last sentence remains linked to `/about/`.

Descriptions (also used for Open Graph/Twitter):

| Route | Before | After |
|---|---|---|
| / | ITKeepers provides managed IT, cybersecurity, Microsoft 365, networking and backup, with offices in Dbayeh, Lebanon and Pompano Beach, Florida, USA. | Managed IT, cybersecurity, Microsoft 365 and infrastructure across MENA and the United States, with offices in Dbayeh, Lebanon and Parkland, Florida. |
| /about/ | Meet ITKeepers: familiar engineers and shared expertise, with physical offices at Enterprise & Innovation Centre in Dbayeh, Lebanon and in Pompano Beach, Florida, USA. | Meet ITKeepers: familiar engineers and shared expertise, with physical offices in Dbayeh, Lebanon and Parkland, Florida, serving MENA and the United States. |
| /contact/ | Contact ITKeepers for IT support or a free IT consultation. Our offices are at Enterprise & Innovation Centre in Dbayeh, Lebanon and in Pompano Beach, Florida, USA. | Contact ITKeepers for IT support or a free IT consultation across MENA and the United States. Physical offices in Dbayeh, Lebanon and Parkland, Florida. |

Service-page titles/descriptions remain unchanged; Lebanon references do not claim exclusive coverage. Existing social artwork and its descriptive alt text remain unchanged.

## Structured data and environment isolation

One Organization per page retains two physical Place locations. US PostalAddress: streetAddress `6778 NW 66th Ave`, locality `Parkland`, region `FL`, postalCode `33067`, country `US`. Lebanon retains only Dbayeh/LB and contained Enterprise & Innovation Centre. Each Place has its verified telephone; Organization also lists both numbers.

Separate Organization/Service `areaServed` values: Place `Middle East and North Africa (MENA)` and Country `United States`. Coverage creates no extra office, legal entity, hours, staffing or guarantees. Property/type choices checked against [Schema.org Place](https://schema.org/Place), [PostalAddress](https://schema.org/PostalAddress) and [areaServed](https://schema.org/areaServed). Generated graphs parsed/asserted locally; no third-party validation certification or search-feature eligibility claimed.

Production/staging/RC configs, handlers, host restrictions, origin rewriting and indexing policies are unchanged byte-for-byte. RC retains its exact workers.dev canonical/social/schema origin, global noindex/follow, browser/crawler access and empty sitemap. Production/staging retain19/15 indexable pages; RC0. No indexing or routing change.

## Exact changed-file inventory

Exactly15 task files relative to b35279b; no deletions:

| File | Change |
|---|---|
| `src/components/Hero.astro` | Exact approved subheading only. |
| `src/components/WhoWeAre.astro` | Replace old US city with Parkland. |
| `src/data/contact.ts` | Add verified US display and dial number. |
| `src/data/locations.ts` | Shared verified address lines, office phones and separate client regions. |
| `src/data/seo.ts` | Three descriptions and Organization/Place/Service geographic data. |
| `src/layouts/Base.astro` | Existing footer office blocks gain address lines and telephone links. |
| `src/pages/about.astro` | Exact approved coverage sentence and existing office blocks. |
| `src/pages/contact.astro` | Existing office blocks gain address lines and telephone links. |
| `tests/claude-refinements.test.mjs` | Update approved metadata expectation. |
| `tests/phase-two-cleanup.test.mjs` | Update approved metadata expectation. |
| `tests/seo.test.mjs` | Verified address/phone and service-area assertions. |
| `claims-register.md` | Append owner-supplied evidence and local wording approval. |
| `PROJECT_STATUS.md` | Append backup, source, verification and authority record. |
| `README.md` | Local review/preview reference. |
| `docs/V2_PARKLAND_MENA_USA_UPDATE.md` | This review report. |

Pre-existing untracked `docs/V2_BUSINESS_LOCATIONS_AUDIT.md` and `docs/V2_OPS_01_02_04_REVIEW.md` were preserved, neither edited nor published. Historical private records retain their original Pompano references as history.

## Validation and preservation

Evidence: sibling `../v2-parkland-mena-usa-20261028/`, outside public assets.

| Check | Result |
|---|---|
| Runtime | PASS, Node22.23.3 compatible with ^22.19.0; no dependency or lockfile change. |
| Full tests | PASS,240/240;0fail/skip (`tests.log`). |
| TypeScript | PASS, npm run typecheck. |
| Builds | PASS, production/staging/RC20pages and118files each; both environment checkers pass. |
| SEO | PASS, production/staging audits0failures/0warnings; RC checker validates exact metadata/origin/indexing/forms/config isolation. |
| JSON-LD | PASS, all60generated graphs parsed/checked for exact verified address, phones and separate coverage. |
| Public scan | PASS, existing offline RC scan118files/20pages,0findings; not a new comprehensive security audit. |
| Stale office references | PASS, case-insensitive search finds no Pompano in src, public or any of the three builds. |
| Browser/layout/accessibility | PASS, Chromium/WebKit30Home/About/Contact surfaces at320/375/768/1024/1440;0page errors, overflow or axe A/AA violations in tested scope.12screenshots saved; mobile Home/mobile-desktop Contact visually reviewed. |
| Contact/navigation | PASS, telephone links,4keyboard menu/query/jump cases,4mocked general/consultation submissions and2native no-JS manual-selector cases without submission. Static no-JS manual-intent limitation remains. |
| Pointer follow-up | PASS, WebKit desktop pointer-open/pointer-select on local candidate and unchanged live RC. Initial mixed keyboard-open/pointer-select automation timed out; consistent keyboard and pointer flows passed. No navigation source changed. |
| Motion | PASS, sampled technology animation runs normally and stops with reduced-motion in both engines. All compiled JS/CSS/public assets are byte-identical to baseline. |
| Artifact preservation | PASS, only20HTML files per build differ; all98other files per build (294total) unchanged. Headers, redirects, robots, sitemap, PDF, assets and compiled animations preserved. |
| Content/function preservation | PASS, all20live-old/local-new comparisons preserve exact titles, H1s, form markup, executable script references and every existing anchor destination/count. Hero metrics exact. All testimonial/flag source files unchanged. |
| Git/Cloudflare | PASS, backup SHA exact; main/competition refs unchanged. RC deployment90badc64/version3ff17ce5 and stagingdc77ddc8/version97cf3bf6 remain at100%. No Cloudflare write or deployment. |

No real Formspree inquiry, telephone call or email occurred. Mocks do not establish provider acceptance/inbox receipt. Physical devices, full screen-reader conformance and field performance are not certified. Existing testimonial-permission/production-readiness follow-ups remain separate; no quotation, attribution, consent flag or metric changed.

## Review and next action

Local review: **http://127.0.0.1:4512/**, `/about/`, `/contact/?type=review`. This local server serves RC output, so canonical URLs intentionally use the RC hostname. No new business assumption or unresolved implementation blocker. Keep backup fixed at b35279b; owner reviews exact copy/layout before authorizing any commit, development push or deployment.
