# Direct Formspree inquiry incident runbook

Local OPS-01/02/04 proposal, 27 October 2026. No incident action, provider change, real submission or deployment is authorized or performed by preparing this runbook. Agent03 coordinates; the project owner authorizes changes, the Formspree/inbox owner operates provider/mailbox controls, and Workflow handles any separately approved website release. Record named responders privately before operational use.

## Data path and control boundary

Home consultation and Contact → native HTTPS POST or browser AJAX → fixed `https://formspree.io/f/mrppzvpo` → provider processing/archive and configured delivery/workflow copies → temporary administrator-managed inbox. Actual recipient, enabled integrations, archive settings and retention require owner observation; do not infer them from the public form ID.

The first-party `/api/contact` and `/api/inquiry` preparation is separate and disabled. Its `CONTACT_VALIDATION_ENABLED` / `CONTACT_DELIVERY_ENABLED` switches, guard quotas and Turnstile verification do **not** stop or protect the direct Formspree path. Turning off email notifications alone may leave provider collection/storage active. A frontend rollback or removal alone cannot stop submissions from cached pages or callers using the public endpoint. Worker rollback does not recall accepted provider/inbox copies.

## Detection and initial triage

1. Identify the affected hostname, route, public form ID, inquiry intent and approximate UTC time. Distinguish website/UI failure, provider rejection/challenge/rate response, provider acceptance and inbox receipt. An AJAX timeout, browser Back return or missing email is not proof that no submission exists.
2. Preserve the minimum sanitized evidence: request outcome/status, time, environment/version, provider reference if available and a non-sensitive incident marker. Restrict evidence access. Do not copy inquiry bodies, personal addresses, tokens, credentials or raw provider errors into Git, public reports, analytics or shared logs.
3. The Formspree owner checks activation, quota/system-limit alerts, spam classification, domain/challenge rules, archive entries, notification destinations/integrations and available delivery-failure metadata. The inbox owner checks receipt, spam/quarantine and any suppression or forwarding failure. Record observations, not assumed settings. Review only authorized data; use redacted references for handoff.
4. For legitimate messages classified as spam, check the effective **page response** Referrer-Policy and browser/provider eligibility. Do not disable spam/challenge/domain protection merely to obtain apparent success. Privacy-focused browsers may suppress Referer even with the proposed policy. Browser-supplied Referer is not authentication and non-browser callers may forge it.

## Containment decision — requires separate authorization

- For harmful collection/abuse or destination compromise, the provider owner must identify and verify a provider-enforced pause/disable/restriction available to this actual account and form. Confirm whether it stops acceptance/storage as well as notification. Do not assume a particular dashboard control exists, and do not delete the form/account to guess at containment.
- Record authorized scope, affected form/hosts, owner, start time, expected collection/storage effect and recovery condition. Avoid broad domain allow rules such as all of `workers.dev`. A referrer/domain restriction alone is not an authenticated kill switch.
- Coordinate any necessary website fallback/removal release with Workflow only after target-specific approval. Cover both homepage and Contact, JavaScript and native/no-JavaScript forms; retain approved email/telephone fallback. Until that approved artifact is released, source edits alone do not change live behavior. Cached forms/direct callers still require provider-side containment.
- Reconcile messages already accepted or in an uncertain state before any retry. Do not automatically replay submissions or promise to recall/delete copies. Map provider archive, integrations, mailboxes and relevant logs/backups with their authorized owners; preserve incident evidence and apply the approved retention/deletion process.

## Recovery and communication

1. Agent03 records cause, containment effectiveness and which provider/archive/inbox copies may exist. The project owner decides affected-user communication with the responsible inquiry/privacy owner; this document invents no notification deadline or legal conclusion.
2. Resolve the observed configuration/delivery fault with the owner. Confirm exact eligible hosts, active destination ownership, spam/challenge behavior, remaining quota, archive/integration access and any provider/inbox suppression before restoration. Do not weaken controls or send a real test without separate authorization.
3. Run the existing staging and RC response-policy regression cases before release. If real end-to-end delivery is separately approved, agree on the controlled destination, harmless marker, minimal cases and evidence cleanup first. Provider acceptance, correct inbox receipt and human response/scheduling are separate outcomes.
4. Workflow verifies a separately approved target-specific artifact/version and recovery plan before any release. RC and staging are distinct; a staging version cannot roll back the RC. Re-observe actual page headers and relevant paths only within approved smoke-check scope. No existing release or account setting changes in this follow-up.
5. Close only after the owner records the result and residual limits. Do not mark containment/recovery complete while provider enforcement, pending messages or receipt are unknown. A client timeout does not cancel processing that Formspree may already have accepted.

## Owner evidence checklist

Record sanitized evidence for form activation and eligible domains, spam/challenge controls, quota state, approved recipients and integrations, archived-submission access, and actual delivery separately. Keep evidence timestamps and owners private where appropriate. No secrets or customer message contents belong in this repository.

References: [Formspree domain restriction](https://help.formspree.io/articles/form-and-project-settings/restrict-to-domain), [system limits](https://help.formspree.io/articles/form-and-project-settings/system-limits), [delivery troubleshooting](https://help.formspree.io/articles/troubleshooting/i-m-not-receiving-emails). These explain provider features; they do not prove this account's configuration.
