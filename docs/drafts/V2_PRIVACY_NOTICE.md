# ITKeepers Privacy Policy — private legal-review draft

Updated 21 October 2026. **Prepared for legal review, not approved or effective. Do not publish, redirect the old policy or activate contact delivery from this document.** The inspected V2 candidate still uses email handoff. Its `/api/contact` and former `/api/inquiry` routes reject before reading a submission while disabled. An isolated validation-only test may process synthetic fields and abuse metadata, but returns `submission_not_stored`; it neither retains the inquiry nor invokes email. The historical email handler is preserved in source and is not routed by the public Worker. Production account/tenant settings have not been inspected.

## Proposed notice text

### Who we are and how to contact us

Business: **ITKeepers**. Business contact address: **4100 N Powerline Rd, B2, Pompano Beach, FL 33073, USA**. Privacy contact: [info@itkeepers.com](mailto:info@itkeepers.com).

These details were approved by the owner on 21 October 2026. “ITKeepers” is the approved business name; its exact legal entity designation and controller identity remain unverified. No LLC, corporation, registration, headquarters or jurisdictional status is inferred from the name or address.

This notice concerns the marketing website and business inquiries. It does not describe processing within client-managed systems or IT Keepers Pulse. Any applicable customer-service processing terms require separate review.

### Information you choose to provide

The contact form asks for your name, email and message. Company, phone and service interests are optional. The free IT review form asks for name and email, with optional company and phone, and prepares a review-request message. Please do not include passwords, account credentials or confidential technical information.

The proposed purposes are to receive and respond to inquiries, manage related business correspondence and protect the website from abuse. The legal reviewer must confirm these purposes and applicable legal bases; no marketing enrollment, sale-of-data assurance or universal consent basis is asserted.

### How an inquiry is sent

**Current inspected V2 mode:** “Continue to email” validates details in your browser and opens a draft addressed to **info@itkeepers.com** in your email app. You review and send it there. The website does not confirm that it was sent or received. Form fields are not submitted to the disabled website API or saved in application browser storage. A direct email link is available without JavaScript; email apps, providers and browser autofill can keep their own drafts or values.

**Owner-approved destination and record model:** contact submissions are delivered only to **info@itkeepers.com**, with no CRM or separate application database for the submissions. The fixed recipient is enforced in the deferred email handler and binding preparation; current public API routes never call that handler. Future activation requires an approved code change and tested acceptance semantics, not a flag change alone. This statement does not exclude necessary mail-provider processing, mailbox copies, security logs or backups. The disabled metadata-store exception below must be resolved before using broader “no database” wording for an enabled backend.

### Inquiry retention

The owner has approved this schedule for inquiry correspondence:

| Inquiry category | Approved retention |
|---|---|
| Non-customer inquiries | Up to **12 months after the last interaction**. |
| Customer-related inquiries | During the customer relationship and up to **3 years after it ends**. |
| Required exception | Longer where **legally required** or subject to **valid legal holds**. |

**Enforcement is unverified.** These are approved policy limits, not confirmation that existing Microsoft 365 policies or other systems implement them. No automated mailbox deletion, complete erasure at a deadline or removal from every backup is claimed. Classification, last-interaction/customer-end dates, legal-hold controls, review/deletion responsibility and evidence of enforcement require operational approval. These inquiry periods do not establish retention rules for unrelated platform logs or browser preferences.

### Browser storage, hosting and external services

The homepage remembers AI playbook engagement or dismissal in local storage under `itkeepers.aiGovernancePlaybook`. Dismissal suppresses the prompt for **14 days**; it does not delete the stored timestamp after 14 days. An engagement flag has no automatic expiry. The code does not send these preferences to analytics. Visitors can remove the entry through browser site-data controls. Its duration and any required notice/consent remain legal-review items.

Website requests reach Cloudflare infrastructure configured to serve the V2 site, which processes network/request information needed to handle them. The incoming mail path uses Microsoft 365 protection according to observed MX records. Actual account/tenant logging, onward routing, mailbox location, access and retention require verification; DNS does not prove the complete processing arrangement.

The inspected V2 application adds no advertising, remarketing, chatbot, SMS, marketing subscription, behavioral analytics or application cookies. Hosting/security features configured outside the application must be reviewed separately. Email/telephone apps and external sites operate under their own terms/settings.

### Location, requests and changes

The US business address does not establish US-only processing. Account-specific hosting, email storage, support access, subprocessors and any international transfers or safeguards remain to be verified. No particular residency, contractual transfer mechanism or legal compliance claim is made.

For questions or requests about your information, contact **info@itkeepers.com**. Do not send credentials or unnecessary sensitive information. Applicable rights, identity-checking procedure, response periods and exceptions require qualified review; this draft does not promise unconditional deletion contrary to valid legal holds. An effective date and final notice wording must be approved before publication.

## Processing and deletion dependencies — internal review notes

The following distinguishes inspected implementation from provider capabilities and unverified account settings. Provider documentation is not evidence that ITKeepers has enabled a feature, accepted a particular agreement or configured a stated retention period.

| Layer / status | Data handling identified | Logging, transfers and deletion dependencies |
|---|---|---|
| **Cloudflare site delivery — configured V2 infrastructure** | Workers/static assets process page and asset requests, including network/request metadata. The disabled contact route rejects before consuming inquiry bodies. | Inspect actual edge/security/Workers logs, observability sampling, exports/Logpush destinations, account-injected features and administrator access. Application code has no inquiry-body logging; this does not mean Cloudflare keeps no logs. Confirm each product's actual retention, regions and deletion/export process. [Workers logging documentation](https://developers.cloudflare.com/workers/observability/logs/workers-logs/) describes service capabilities, not the account configuration. |
| **Microsoft 365 mail path — DNS-supported; tenant/mailbox uninspected** | Incoming email is handled through the Microsoft 365 protection path; the intended company recipient is info@itkeepers.com. Confirm whether the final mailbox is Exchange Online and whether connectors, forwarding, delegation or journaling create additional copies. | Verify inbound protection/message traces, audit logs, mailbox rules, archives, Outlook/device caches or exports, backups and holds. Deleting visible mail can leave [Recoverable Items or held copies](https://learn.microsoft.com/en-us/exchange/security-and-compliance/recoverable-items-folder/recoverable-items-folder). [Audit-log retention](https://learn.microsoft.com/en-us/purview/audit-log-retention-policies) is separate and license/configuration dependent. No tenant deletion setting or mailbox access was verified here. |
| **Cloudflare Email Service / Turnstile — prepared, disabled for this form** | Turnstile is prepared for gated validation tests. The current public Worker routes have no email call path. A separately approved future delivery implementation would validate fields and the token, then request a plain-text email only to info@itkeepers.com. Visitor email is validated Reply-To; From must be the authenticated company sender. Provider acceptance is not inbox receipt. Turnstile would receive browser/network verification information; the server Siteverify request does not add the raw client IP. | Verify sending-domain/destination authorization, suppression/bounce handling, email content/transient delivery copies, [Email Service activity logs](https://developers.cloudflare.com/email-service/observability/logs/), provider retention and actual Turnstile settings/terms. Do not infer that a failed or accepted send leaves no provider records. These services have not been proven active for the V2 form or approved as processors. |
| **Cloudflare Durable Object — prepared, disabled technical metadata store** | The validation-only handler transiently derives a keyed identifier from the platform client IP and stores keyed admission counters in the guard. The deferred delivery handler additionally supports keyed request/content digests, status, reservation ticket and expiry; no raw IP, inquiry body, email address or bot token. Keyed identifiers remain pseudonymous, not claimed anonymous. | Source specifies active-record windows of **10 minutes** for client attempts, **1 hour** for request totals and **24 hours** for outbound totals/duplicates, with transactional expiry/alarm cleanup. These are technical defaults, not verified production deletion or approved log retention. [SQLite point-in-time recovery](https://developers.cloudflare.com/durable-objects/best-practices/access-durable-objects-storage/) and provider backups are separate from active-key expiry. **Owner/legal clarification required:** the “no separate application database” instruction must either explicitly distinguish this metadata store or be reconciled with the design in a separately authorized change; no code is changed here. |
| **Browser/email-client copies and transfers — outside the form's storage controls** | Browser preferences, visitor drafts/sent mail and staff mailbox/client copies can persist independently of the website. Intended delivery only to info does not prove that forwarding rules or copies are absent. | Identify actual recipients/access roles and approved mailbox/client/backup handling. Confirm tenant geography and service/support access; [Exchange Online data-location guidance](https://learn.microsoft.com/en-us/microsoft-365/enterprise/m365-dr-service-exo) does not establish this tenant's location or exclude international access. No US-only or local-only storage promise. |

Legal must establish the contracting entities and appropriate roles/arrangements for each actual service, rather than treating every provider activity automatically as ITKeepers-directed processing. Review the applicable [Cloudflare DPA](https://www.cloudflare.com/cloudflare-customer-dpa/), [Turnstile-specific privacy terms](https://www.cloudflare.com/turnstile-privacy-policy/) and [Microsoft DPA](https://www.microsoft.com/licensing/docs/view/Microsoft-Products-and-Services-Data-Protection-Addendum-DPA), current subprocessors and transfer terms against the actual accounts/contracts. Availability of those documents does not prove acceptance, applicability or compliance.

## One legal-review and operational-approval checklist

| Open approval | Owner | Required evidence / decision |
|---|---|---|
| **Legal identity and notice** | Business owner + legal reviewer | Confirm exact controller/legal entity designation, use of the approved address, applicable jurisdictions, purposes/legal bases, rights/request procedure and final notice/effective date. No compliance certification, unverified rights deadline or blanket consent/deletion claim. |
| **Provider arrangements and transfers** | Legal + Cloudflare/Microsoft 365 administrators | Identify actual services, contracting entities/roles, agreements, subprocessors, tenant/storage/support locations, international access/transfers and applicable safeguards. Record verified settings; do not infer them from the address or DNS. |
| **No-database boundary** | Business owner + technical owner | Resolve the disabled Durable Object metadata-store qualification before enabling it or publishing a broad “no database” statement. No CRM or additional inquiry-content database is authorized by this draft. |
| **Retention classification and triggers** | Inquiry owner + records/legal owner | Approve how non-customer/customer records are classified, what counts as last interaction, the authoritative relationship-end date and how records change category. Assign a review/deletion owner and schedule; retain the approved 12-month and relationship-plus-3-year limits and documented legal exceptions. Do not assume a mailbox age-based rule implements these triggers. |
| **Holds, mailbox deletion and copies** | Microsoft 365/records administrator + legal | Inspect mailbox/retention policies, labels, archives, Recoverable Items, holds and their release process, forwarding/journaling/delegated access, client exports/caches and backups. Reconcile conflicts and test deletion with authorized synthetic records; keep evidence and document remaining recovery copies. Do not remove a valid hold or claim automation exists without verification. |
| **Technical logs and metadata** | Cloudflare/Microsoft 365 administrators + privacy reviewer | Inventory message traces/audit/security/Workers/email-provider logs and exports, access and retention; approve the pseudonymous metadata windows separately from correspondence retention. Validate alarm cleanup and backup/PITR dependencies. Review browser preference expiry/notice. No message bodies/tokens/secrets in application logs. |
| **Activation and publication** | Legal + inquiry/release/QA owners | Approve the final policy and operational enforcement, then separately authorize controlled provider/inbox testing. Keep public delivery off until approved testing succeeds; verify authenticated From/fixed To/validated Reply-To and fallback. Publishing the policy, any old-policy redirect or enabling delivery requires separate authorization. None occurs in this edit. |

Owner-approved business/address/contact/destination and inquiry-retention facts above are incorporated, not reopened. Legal entity designation, provider arrangements, retention enforcement and the metadata-store boundary remain open. The prior EMPIST reference supplied section coverage only; none of its tracking, chatbot, SMS, marketing or legal assertions is adopted. No production deployment, legal sign-off, account inspection or automated deletion has been represented as complete.
