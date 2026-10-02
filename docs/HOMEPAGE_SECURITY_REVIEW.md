# Homepage redesign — security and privacy review

Reviewed 1 October 2026 (Asia/Beirut). Owner: Agent 03; integration owner: Workflow.
Scope: the authorized local homepage/header redesign. Application, deployment configuration,
root instructions and dependency files are read-only for this reviewer. No production,
DNS, mail or disruptive remote testing is authorized by this task.

## Baseline and boundaries

Sources inspected: root AGENTS.md, PROJECT_STATUS.md, claims-register.md, website brief,
site map, both tool specifications, Agent 03 instructions, SECURITY.md, Base.astro,
Home and illustrative components/scripts, Contact/Privacy, package/lockfile architecture,
astro.config.mjs, wrangler.toml and public/_headers. All required sources exist.
No Git commit is available: unborn master and existing project files are untracked.

The existing Astro build is static. wrangler.toml declares Worker static assets from dist;
it has no Worker entrypoint, form endpoint or data binding. Actual remote deployment,
deployed revision and production security responses remain unverified (B11/B14).
The local dev preview is http://127.0.0.1:4321/. Integration also started the configured
static-assets Wrangler preview at http://127.0.0.1:8788/; this review uses that runtime.
Both are loopback-bound rather than publicly hosted previews; no external preview
authentication pass is inferred. Host access logs/identifiers remain an environment
review topic; absence of application telemetry does not establish absence of host logging.

Contact has no form controls, submission script or endpoint. Privacy is a development
explanation, not an approved final legal notice. B3/B13 still block enabling inquiry
collection and a complete production Contact release. A contact CTA may link to the
existing route for local design review; this does not establish working inquiry delivery.

## Checks and findings

| Check | Result | Evidence and owner |
|---|---|---|
| Baseline visitor data collection | Pass, scoped | Source scan: no fetch/XMLHttpRequest, cookies, localStorage/sessionStorage, form or iframe in src; no analytics/chat/processor. Agent 03 |
| Baseline illustrative data | Pass, scoped | Workflow, daily questions, category layers and TeamThread notes are synthetic; no real tickets, console screenshots, identities or internal maps. Production wording still requires Copy review. Agent 03/Copy |
| Existing output exposure scan | Pass, scoped baseline | 18 dist files, 17 text files: no publication-placeholder, private-key/AWS/GitHub token patterns, long literal secret assignment or prohibited internal management-vendor matches; no source maps or private instruction/tracker/environment files. Agent 03 |
| Header configuration compatibility | Pass for source review | Existing CSP script-src self; Astro assetsInlineLimit=0 and external component modules avoid adding script allowances. No CSP relaxation requested. Agent 03 |
| Actual configured local runtime static/error responses | Pass, local runtime | Wrangler at 127.0.0.1:8788: Home, Contact, Privacy, CSS, PNG and all three emitted scripts 200 with configured CSP/nosniff/referrer/permissions/frame headers and no Set-Cookie; synthetic missing route 404 with those headers. Agent 03 |
| Dynamic/form security responses | Not applicable to this change | No Worker script or form endpoint exists. Validation/rate/token/delivery tests become mandatory if a separately approved form is introduced. Agent 03 |
| Final redesign source/output scan | Pass, scoped | 20 dist files/18 text files; repeated baseline patterns found no matches, source maps or private artifacts. Changed source adds no application fetch/storage/cookie/form/iframe/analytics/processor. Agent 03 |
| Executable resources/CSP source compatibility | Pass, scoped | Home has three empty-body same-origin module scripts plus inert 330-byte application/ld+json; no inline executable script. Styles/image are same-origin, canonical href is metadata, not an asset request. Agent 03 |
| Official logo metadata | Pass | 17,991-byte PNG chunks IHDR/pHYs/IDAT/IEND only; no EXIF or text metadata chunks. Official image copied unchanged to public/assets/itkeepers-logo.png by integration. Agent 03 |
| Header file exposure | Pass, local runtime | GET /_headers returned 404, no configuration content. Agent 03 |
| Production headers/HTTPS/preview protection | Blocked | No production deployment requested or verified; remote environment and release authorization remain B11/B14. Workflow/account owner |
| Dependency audit | Fail for clean-audit gate; relevance assessed below | npm audit --json: five vulnerable packages, one critical/two high/two moderate. Existing lockfile unchanged; Agent 03/Workflow |

Baseline public/_headers already enforces CSP and allows unsafe-inline styles. It has no
new rollout/Report-Only record. Retaining this baseline for the scoped design is not an
assertion that the full policy rollout has passed. HSTS was deliberately held until hosts
are verified. Future CSP changes must follow the shared Report-Only rollout requirement.

The initial remote official-logo request was replaced with the official asset served
locally; no cross-origin image request or processor was added. Existing img-src allowance
remains untouched. No new photography, third-party asset or dependency was introduced.

The baseline LocalBusiness/ITStore and Lebanon areaServed assertions were corrected by
SEO/integration to minimal Organization and Home WebSite, stable IDs and publisher
reference. No unsupported local/legal details remain in that schema. JSON.stringify
escapes less-than signs before inert JSON-LD insertion; schema values are fixed approved
identity data, not visitor input. No policy relaxation or security claim approval implied.

Reviewed emitted scripts: Base.astro_astro_type_script_index_0_lang.BBdRbm83.js
(native mobile-menu Escape closes/re-focuses summary); Workflow...CxaO8bh4.js
(existing guarded steps and polite status); TeamThread...BNpD-ZF8.js (bounded DOM/CSS
motion with observer/media/fit guards). No script sends or persists input. A pending
geometry short-circuit/metadescription refinement is not security-sensitive; integration
must retain this data-flow/CSP scope if rebuilding and record the final emitted filenames.
Actual browser CSP violations and input modes remain Design/integration's rendered check;
successful header GETs alone are not a browser interaction pass.

The generic output scan is bounded evidence, not proof of absence of all confidential
content. No private business deny-list has been supplied; sensitive values were neither
invented nor stored. Approved public references include ITKeepers, Microsoft service
names, canonical host and technical namespace/standards URLs. Reports show only rule IDs
and paths, never secret matches.

Cloudflare's current [Workers static asset headers documentation](https://developers.cloudflare.com/workers/static-assets/headers/)
confirms that _headers is parsed for static assets and does not itself become a public
asset; responses generated by Worker code require their own headers. This is why static
and hypothetical dynamic coverage are reported separately. Consulted 1 October 2026.

## Existing dependency findings

Read-only npm audit reported Astro (critical, direct), sharp (high, transitive),
undici (high, transitive), miniflare and Wrangler (moderate, tooling). No dependency
or install-script change was made. Owner: Workflow/security maintenance before a release.

- [Astro AVIF optimization RCE advisory](https://github.com/withastro/astro/security/advisories/GHSA-26w7-cxv4-gfx2):
  maintainer states exploitation requires processing an untrusted AVIF image; patched
  Astro 7.2.8 uses sharp 0.35.4. This site uses ordinary img markup, has no remote image
  optimization, upload or dynamic production image endpoint. No affected published
  request path was observed. Keep build inputs trusted; resolve before introducing
  optimization of untrusted images. The audit's generic suggested Astro 5.18.2 is not
  proof this advisory is fixed; assess a deliberate update separately.
- [Astro dev image file-read advisory](https://github.com/withastro/astro/security/advisories/GHSA-x3h8-62x9-952g):
  the installed 5.14.0 dev server is affected; patch starts at 5.14.3. Keep dev local
  and prefer a built static-assets preview for delivery; never expose this dev server
  via LAN/tunnel. No exploit requests or private-image reads were performed.
- [Astro dev error-page XSS advisory](https://github.com/withastro/astro/security/advisories/GHSA-w2vj-39qv-7vh7):
  concerns development error pages with trailingSlash; that option is not configured
  here. The static production output does not contain the dev handler. Other listed
  SSR/server-island/authentication/Cloudflare-image advisories require features absent
  in this project's inspected runtime; no SSR adapter, user-driven render props,
  middleware authentication or hydrated/server islands are used.
- sharp/libvips/libheif vulnerabilities concern processing image inputs. Current assets
  are trusted and shipped unchanged; no user upload or transformation pipeline added.
- Undici/Miniflare/Wrangler are local build/development tooling dependencies, not shipped
  browser or Worker scripts. [Undici TLS advisory](https://github.com/nodejs/undici/security/advisories/GHSA-w293-vg96-wgc3)
  describes BalancedPool connect-options handling. No application outbound HTTP/cookies/
  WebSocket/retry feature is introduced. Toolchain maintenance remains outstanding;
  no blanket statement that every tooling advisory is inapplicable is made.

Maintainer advisories consulted 1 October 2026. Loopback preview and absence of dynamic
handlers limit the current task's exposure; they do not convert a failing audit into a pass
or justify exposing an affected dev server publicly.

## Handoff

- **Done:** final source/data-flow review, scoped public-output scan, official PNG metadata review and actual local Wrangler static/error/header checks; no inquiry collection enabled.
- **Decisions made:** retain local-only scope, existing architecture/CSP and unapproved form gate; distinguish static runtime evidence from deployed controls.
- **Assumptions:** none about production header activation, legal/privacy approval or blanket dependency safety.
- **Validation:** scoped final output/data-flow/runtime checks Pass as above; dependency clean-audit gate Fail with relevance assessed. Production/host-access/release checks Blocked; dynamic inquiry tests Not applicable because no handler exists. No comprehensive security or accessibility claim.
- **Blocked on:** B3/B13 production inquiry path; B11/B14 actual deployment, HTTPS and release evidence. These do not block homepage design preview.
- **Needs review from:** integration for final rebuild/browser CSP observation and tracked toolchain maintenance; Copy/business owner for production wording; Ops/reviewer for B3/B13.
- **Files changed:** docs/HOMEPAGE_SECURITY_REVIEW.md only; no commit.
- **Deployment:** not deployed; local loopback dev and configured static preview only. No push, merge, DNS or account mutation. Git remains unborn; no inspected commit exists.
- **Next:** retain the validated local static preview for review; resolve production inputs and assessed toolchain maintenance through Workflow before any release.
