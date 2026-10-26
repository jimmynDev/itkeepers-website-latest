# Private personal-account Workers staging

Date:21 October2026. Status: locally implemented; deployment/account setup pending separate authorization.

Superseded later the same day for this temporary preview: the owner explicitly requested public access for anyone with the workers.dev link. The retained controls are exact-host restriction, disabled preview aliases/custom routes, noindex/private-no-store, and disabled contact APIs. Access/JWT code and its dependency were removed from staging only; production remains unchanged.

The owner requested workers.dev-only temporary hosting with Cloudflare Access, no collection or email, and no production changes. Reusing the production configuration would inherit prepared Durable Object migrations/email bindings and production indexing behavior.

Use a standalone `wrangler.staging.toml`, separate `dist-staging` artifact and staging-only entry point. Run the Worker before every asset/request. Require mandatory Access All traffic policy plus exact-hostname and cryptographic JWT validation. Pin `jose@6.2.13` for standards-based signature/JWKS handling rather than custom cryptography; it is absent from client bundles. Blank identifiers fail closed. Disable preview URLs, all collection and provider bindings. Add noindex at artifact and response layers, keeping production canonicals and otherwise identical assets. Use private/no-store on protected responses.

No new inquiry processor/store or outbound provider is introduced. Future Cloudflare Access identity processing and platform logging require owner account configuration/review. Production resources and rollback constraints remain unchanged; staging avoids DO migrations entirely. The application gate supplements Access, rather than replacing its policy enforcement or revocation.

Rejected: inherited production bindings, public noindex-only previews, trusting identity headers without signature verification, custom-domain/DNS changes, and assuming `ctx.access` reaches a static-assets Worker. See [Cloudflare Workers Access](https://developers.cloudflare.com/workers/configuration/cloudflare-access/).

Local validation and the exact future setup/rollback checklist are in [the staging guide](../V2_PERSONAL_CLOUDFLARE_STAGING.md). No deployment, account/DNS change, commit, push or merge occurred.
