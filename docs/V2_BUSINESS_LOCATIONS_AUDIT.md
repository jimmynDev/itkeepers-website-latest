# V2 business identity and physical offices — 26 October 2026

Done: local implementation ready for owner review. Branch `codex/v2-business-locations`, isolated checkout `outputs/v2-business-locations`. Local baseline commit `bfcd0322174c6bf5a00ed602c47c633fc9aaf337` checkpoints the complete current V2 source, including the existing uncommitted presentation, continuous-motion and social-preview work from `codex/v2-prompt3-restored` at `e86d5ff1f7f22ee0135d6071f8377106c0a31260`. Location changes remain uncommitted above that baseline. The baseline commit is preservation work, not part of the location diff.

The original V2 checkout and its branch are preserved. The V4 checkout is untouched. No push, merge, upload, deployment, remote write, DNS change or real inquiry submission occurred. The existing Cloudflare deployment is unchanged by this task; its recorded version is `97cf3bf6-69c6-43db-b044-cc7704d41e72`. This task did not independently re-query its status.

## Audit and decisions

| Surface | Before | Final action |
|---|---|---|
| Home proof metric | 2 locations / Lebanon & USA | Exact Hero source and rendered metric preserved |
| Home identity paragraph | Lebanon-based MSP | Names both verified office cities and countries |
| Home business-value eyebrow | ITKeepers · Lebanon | ITKeepers · Lebanon & USA; copy only |
| About | No office information | Adds concise physical-office introduction and both office details inside the existing intro, using the existing split layout |
| Contact | Call, emergency and email cards; no offices | Retains those cards and the exact form; adds an office card using existing tokens/card styles |
| Shared footer | No office information | Adds the same two office labels and details beneath the existing tagline |
| Home metadata | Lebanon-only title/description | General service title; description names both offices |
| About metadata | Approach only | Description names both physical offices |
| Contact metadata | Lebanon only | Description names both offices, retaining consultation wording |
| Organization JSON-LD | One Organization per page; no location | Retains the same Organization ID; adds two nested Place entries with only verified geographic details |
| LocalBusiness JSON-LD | None | No additional business/legal entities created |
| Other service metadata and copy | Lebanon service focus and Lebanon-based references | Retained: these remain accurate and do not state an exclusive location. Office confirmation does not establish additional service commitments |
| Social graphic and its alt text | Existing artwork ends with Lebanon | Retained exactly: alt text accurately describes the unchanged artwork; it does not claim an exclusive office location |
| Privacy geography | Provider processing in the United States and other countries | Retained: this describes Formspree processing, not ITKeepers office locations |

Source: the company's geographic details and explicit confirmation, supplied by Jim in the current request, that both are genuine physical offices. No independent address search used to extend those facts. No new product assumptions or missing input blocks this local work.

The Organization `location` property accepts Place values: https://schema.org/location. Each Place uses a partial PostalAddress containing only the supplied city, country and, for the USA, state. The Lebanon building name is represented as `containedInPlace`, rather than invented street-address text: https://schema.org/containedInPlace. No coordinates, postal codes, street addresses, office-specific numbers, hours, registrations, staffing, legal names, parent/subsidiary relationships, or expanded service areas are inferred.

## Exact final public copy

Unlisted existing copy and CTAs are unchanged. The following is all added or replaced public wording; `&` is rendered normally from HTML escaping.

Home identity paragraph (the existing About link remains on its final sentence):

> ITKeepers is a managed service provider with offices in Dbayeh, Lebanon and Pompano Beach, Florida, USA. Meet the team behind the work.

Home business-value eyebrow:

> ITKeepers · Lebanon & USA

Home metric, preserved with its existing line breaks and styling:

> 2 locations
>
> Lebanon & USA

About heading and introduction:

> Our offices in Lebanon and the USA.
>
> ITKeepers has two physical offices:

Contact card heading:

> Our offices

Office labels and details, identical on About, Contact and in the shared footer:

> Lebanon office
>
> Enterprise & Innovation Centre, Dbayeh, Lebanon
>
> USA office
>
> Pompano Beach, Florida, USA

Home title (also used for Open Graph and Twitter title):

> Managed IT, Cybersecurity & Cloud | ITKeepers

Home description (also used for Open Graph, Twitter and WebSite JSON-LD description):

> ITKeepers provides managed IT, cybersecurity, Microsoft 365, networking and backup, with offices in Dbayeh, Lebanon and Pompano Beach, Florida, USA.

About description (also used for Open Graph and Twitter):

> Meet ITKeepers: familiar engineers and shared expertise, with physical offices at Enterprise & Innovation Centre in Dbayeh, Lebanon and in Pompano Beach, Florida, USA.

Contact description (also used for Open Graph and Twitter):

> Contact ITKeepers for IT support or a free IT consultation. Our offices are at Enterprise & Innovation Centre in Dbayeh, Lebanon and in Pompano Beach, Florida, USA.

Exact new `location` value on the existing Organization, across all pages:

```json
[
  {
    "@type": "Place",
    "name": "ITKeepers Lebanon office",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Dbayeh",
      "addressCountry": "LB"
    },
    "containedInPlace": {
      "@type": "Place",
      "name": "Enterprise & Innovation Centre"
    }
  },
  {
    "@type": "Place",
    "name": "ITKeepers USA office",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Pompano Beach",
      "addressRegion": "Florida",
      "addressCountry": "US"
    }
  }
]
```

## Validation

Owner: Codex. All commands below use the existing dependencies and Node 22.23.3, matching the project's Node 22 engine. Initial frozen before-build used installed Node 24.19.0; final production/staging builds, tests and typecheck used Node 22.23.3. No dependency or runtime configuration changed.

- PASS: production build, 20 pages.
- PASS: staging build and checker, 20 pages, 15 indexable / 5 held, 2 forms, 28 redirect rules, production/staging bodies and assets consistent.
- PASS: TypeScript `npm run typecheck`.
- PASS: complete existing suite, 225/225; existing metadata expectations and schema assertions updated for verified offices.
- PASS: production SEO audit, zero failures or warnings; public-output security/placeholder audit, zero findings across 118 files.
- PASS: Chromium and WebKit, Home/About/Contact at 320, 390, 768, 1024 and 1440px: 30 route checks, no horizontal overflow, both offices visible, one H1, no page errors. Contact retains `?type=review&source=location-audit` and the consultation prefill.
- PASS: all anchor attributes, destinations and labels and all form markup identical across 20 before/after pages. Includes CTA links and existing query strings.
- PASS: compiled browser JavaScript payloads identical; 82 original scripts, animation components, public assets and Worker source files byte-identical. Exact Hero source preserved. No Team page added.
- PASS: routing, sitemap, robots and headers byte-identical. No production routing or deployment configuration edited.
- PASS: visual review of desktop About and mobile Contact screenshots, including the shared footer. Reuses existing design; office content wraps cleanly.
- PASS: whitespace diff check with CR-at-EOL handling for existing Windows source line endings.
- NOT RUN: physical-device, screen-reader and hosted-deployment checks. These are not claimed by local browser verification. No new full accessibility certification claimed.

Evidence: sibling `outputs/v2-business-locations-evidence/verification.json`, `seo.json`, `security.json`, desktop/mobile PNGs and `verify.cjs`. Build/type/test results are also recorded in the sibling `v2-business-locations-*.log` files. No extra behavior tests were added for static copy; existing SEO tests now restrict structured locations to the verified data.

## All files changed relative to the preservation baseline

New source:

- `src/data/locations.ts` — one shared source for office copy and structured geographic data.

Modified source:

- `src/components/BusinessValue.astro` — identity eyebrow only.
- `src/components/WhoWeAre.astro` — homepage identity paragraph only.
- `src/data/seo.ts` — Home/About/Contact metadata and Organization location values.
- `src/layouts/Base.astro` — shared footer office labels/details.
- `src/pages/about.astro` — office presentation and one spacing rule using the existing layout.
- `src/pages/contact.astro` — office card and scoped text styling using existing tokens.

Modified existing tests:

- `tests/claude-refinements.test.mjs` — final Home metadata expectations.
- `tests/phase-two-cleanup.test.mjs` — final Home social-description expectation.
- `tests/seo.test.mjs` — exact company-verified locations and visible/schema consistency on every page.

Project records:

- `claims-register.md` — current company verification and approval boundary.
- `PROJECT_STATUS.md` — baseline, decision and validation record.
- `docs/V2_BUSINESS_LOCATIONS_AUDIT.md` — this audit, exact final wording and full file list.

Total: 13 files, including 2 new files. No animation implementation, route, CTA, business phone/email, privacy policy, form, dependency, deployment configuration or existing public asset changed.

Needs review from: Jim, local wording and visual review. Blocked on: no implementation input. Deployment: not deployed. Next: review this candidate; pushing, merging and deploying require explicit approval under the owner's current request.
