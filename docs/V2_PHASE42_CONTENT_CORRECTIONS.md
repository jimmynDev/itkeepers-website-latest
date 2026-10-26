# Phase 4.2 approved content corrections — 19 October 2026

Implemented F1–F4 and E3 on `codex/v2-prompt3-restored` using the approval matrix and the owner's newer confirmed facts. E1/E2 remain held. No commit, push, merge or deployment.

| Item | Applied correction | Remaining boundary |
|---|---|---|
| F1 — backup verification | Services summary names restore tests; Backup page states “ITKeepers routinely performs restore tests.” Matching metadata/Service description updated. | No cadence, universal coverage, retention policy, RTO/RPO or guarantees inferred. Successful backup versus tested restore distinction retained. |
| F2 — backup cadence | “Morning checks” → “Backup status review.” | Actual schedules depend on the agreed service; no new frequency claimed. |
| F3 — emergency enquiries | Existing and new clients explicitly accepted. “Security incident contact,” “Call first. Review the general guidance below,” and “General steps for a suspected incident” replace response-underway wording. Relevant metadata/accessibility label aligned. | Acceptance of an enquiry does not promise response-work acceptance, guaranteed availability or response time. Phone/email and technical instructions unchanged. |
| F4 — Pulse | Explicit under-development labels in Home/Managed IT, shared signal/preview and product page; navigation description qualified. Preview retains sample-data/no-live-telemetry wording. Managed IT inclusion implication removed; product feature prose describes planned views. Title/description and derived social/schema descriptions aligned. | No shipped integration, package inclusion, live customer data or launch date asserted. |
| E3 — AI heading | “Use AI with clear controls.” | Existing adjacent non-guarantee/planning paragraphs retained. AI/Web service introductions and Web page remain unchanged (E1/E2 held). |

Owner confirmation and approval are recorded in `claims-register.md` as V2-P42-RESTORE/PULSE/EMERGENCY/AI-HEADING. Earlier B6/B7 holds are resolved only for the newly confirmed facts; hours, coverage, schedules and contractual commitments remain unconfirmed.

Preserved: exact homepage H1 “Your IT person is a team.”, approved positioning, service structure, link destinations, public assets/CSS, all component style/script blocks and animation controllers. Only directly affected wording/accessible labels and three pages' SEO descriptions (plus Pulse title) changed. Longer approved text can wrap naturally within the existing layout.

Validation: Node 22 build passes for 16 routes; 143/143 existing tests pass. SEO audit passes, including links, canonical/indexing, schema and sitemap checks; bounded output scan is clear. Browser copy/wrapping checks cover Home, Managed IT, Pulse, Backup, Emergency and AI at 320/390/768/1440px; results are recorded in the sibling evidence directory. No new browser behavior or backend was introduced.

Evidence: sibling `outputs/v2-phase42-content-evidence/` contains starting source hashes/dist snapshot, build/test logs, SEO/output scans, source preservation comparisons and browser results/screenshots. Final working-tree review remains with the project owner; release gates are unchanged.
