# V2 final presentation corrections — October 26, 2026

Scope: current `codex/v2-prompt3-restored` worktree, base commit `e86d5ff1f7f22ee0135d6071f8377106c0a31260`, including its existing uncommitted work. V4 is excluded. No commit, push, merge, package upgrade or deployment is authorized/performed.

## Technology Ecosystem

The former component used `mountAmbientPreview`, which permanently exhausted its five-second visible-motion allowance before the 30-second mobile / 38-second desktop marquee completed. The paused transform and hidden overflow stranded later logos. Horizontally clipped lazy images could remain unloaded, making a simple timer removal insufficient as a complete initialization check.

The dedicated `technology-marquee.ts` controller decodes both identical logo groups before movement, maintains the existing CSS loop, and pauses/resumes the same clock on visibility, document hiding and bfcache events. Manual pause survives these events. It mounts once and cleans listeners/observers on disposal. Other finite-preview animations are unchanged.

A discreet 28px native pause/play control provides keyboard/touch operation without changing the artwork, original durations, optical sizing, spacing or section height. Fine-pointer hover and keyboard focus still pause the track. Reduced motion, forced colors and no-JavaScript use one nonduplicated, horizontally scrollable static row. Static mode removes the edge fades so edge-aligned logos remain readable.

## Contact processing and approval boundary

Current provider: direct browser POST to **`https://formspree.io/f/mrppzvpo`**, fixed in `src/data/formspree.ts`. This public form identifier is not a secret. The endpoint, client validation, provider acceptance/error handling, native verification fallback, own disabled API handlers, recipient configuration and business contact data are unchanged.

Existing owner evidence says notification delivery uses a **temporary administrator-managed personal inbox**, not an officially configured ITKeepers mailbox, and records a successful owner local delivery test. The private inbox address is not published. The recipient behind the Formspree ID is not exposed by the client configuration and was not independently verified through the provider account in this session. A new public inbox delivery test was not sent.

### Proposed concise form notice — owner wording approval still required

> Competition preview. Inquiries are processed by Formspree for a temporary administrator-managed inbox. Privacy notice.

“Privacy notice” links to `/privacy/`. The notice is rendered on both normal forms and associated with the form using `aria-describedby`. It is deliberately short; the existing substantive Privacy page retains the details about preview scope, provider processing, technical information, international processing, plan-dependent provider retention, separate inbox copies and privacy requests.

The Privacy page body is unchanged. Its metadata now describes the actual competition-preview notice; the existing noindex hold remains. Neither this local implementation nor the owner's request to prepare corrections establishes approval of the exact short notice or the full Privacy wording. The approval gate recorded in `V2_FINAL_PRIVACY_APPROVAL.md` remains open. No data controller, retention period, recipient, mailbox operation or legal sign-off has been invented.

The primary booking CTA in the hero and navigation feature is exactly **Book a Free IT Consultation**, as explicitly requested. Compatible `type=review` intent URLs remain internal identifiers. Submitted consultation wording remains “IT consultation”.

## Cloudflare release preparation

- Correct target: personal Worker **`itkeepers-v2-staging`**, `https://itkeepers-v2-staging.jimnassar99.workers.dev/`.
- Account verified in existing records/read-only Wrangler access: `eabf58c0ea3cf8629b95c29042124f72`.
- Active version rechecked: **`1d88e2b0-4e2c-40e0-b92a-4fe310b7beba`**, 100%; deployment message identifies source `e34b69b1f4288e5fcc6c80b1a6c70519c4d9ff94`.
- Local base HEAD remains `e86d5ff…`; current local changes are additional dirty work, not falsely attributed to that commit.
- Public release still has the earlier hero, older IT Review wording and email-app contact handoff. Current local build adds subsequent UI, Formspree/Privacy and wording work plus these corrections.
- Use **`wrangler.staging.toml`** explicitly. Its build command is `npm run build:staging`, its assets directory is `dist-staging`, and its entry is `worker/staging.ts`. The default `npm run deploy` selects a different Worker/configuration and must not be used for this personal preview.
- Required binding: `ASSETS`. Required plain configuration: exact `STAGING_HOSTNAME`; `CONTACT_VALIDATION_ENABLED=false` and `CONTACT_DELIVERY_ENABLED=false`. These own-API flags do not disable the separate browser-to-Formspree integration.
- The current staging version has **no configured Worker secrets**. No mail, database, Durable Object, new processor, custom domain or DNS change is needed. CLI deployment later requires an authorized Cloudflare login or a suitably scoped account API token; no token belongs in the public build.
- Standard/staging builds and a Wrangler **`deploy --dry-run`** are preparation only. The prepared source/artifact manifests and Worker bundle are saved in sibling `../v2-final-presentation-fixes-20261026/`.

### Rollback, only after separate authorization if a later release needs recovery

Use the same account and staging configuration, then:

```powershell
node node_modules/wrangler/bin/wrangler.js rollback 1d88e2b0-4e2c-40e0-b92a-4fe310b7beba --config wrangler.staging.toml --yes --message 'Recover V2 presentation to validated prior release'
```

This restores the older presentation and mailto contact journey, not the new Formspree candidate. This staging target has no stateful migrations to reverse. After any authorized release or rollback, check the actual deployed version/allocation, Home/Contact/Privacy, wording, asset hashes, CSP, redirects and PDF; distinguish provider acceptance from actual inbox delivery. The rollback command was **not executed**.

## Validation and handoff

Evidence and exact final browser/test results: sibling `../v2-final-presentation-fixes-20261026/`. Initial established checks: 20-page production/staging builds, TypeScript and 218/218 tests pass. Cross-engine final results are recorded in that handoff report; mocked/intercepted provider requests never reach real recipients.

Remaining release gates: owner review of the exact notice/full Privacy wording, confirmation of the intended temporary destination/current public delivery, and explicit release authorization. Physical devices/native screen readers/field performance remain outside the browser-emulation evidence. This is a local prepared correction, not an authorized public release.
