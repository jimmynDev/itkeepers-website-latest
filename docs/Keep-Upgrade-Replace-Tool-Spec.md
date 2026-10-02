# Keep / Upgrade / Replace: Interactive Tool Spec

Prepared: 28 September 2026 | Project: ITKeepers website | Status: **Proposed, not built**
Evidence labels follow the project brief: everything here is **Proposed** unless marked **Open**.

## 1. Purpose

Show, rather than claim, promise #4 from the brief: *"We protect your technology budget too. Assess before recommending purchases."*

The tool demonstrates how ITKeepers engineers think about hardware spending (avoid overspecified laptops, upgrade RAM where it helps, avoid unnecessary equipment) using a small interactive decision aid on the homepage or "How We Work" page.

**It is not** a quote, an audit, a risk score, or evidence of an existing assessment product. The brief explicitly says KEEP / UPGRADE / REPLACE is an illustrative device, not a claim that an assessment product exists.

## 2. Claim guardrails (must hold in UI copy)

- Label the tool "An illustration of how we think", not "our assessment".
- Output is advice with reasons, never a score, percentage, or savings figure.
- No prices, no "save X%", no guaranteed outcomes.
- Every result states it is a rule of thumb and that an engineer would check the actual device.
- No claim that hardware is sold at cost or that ITKeepers earns no margin. **Open:** decide on a transparent one-line margin disclosure (see section 11).
- Do not imply the tool collects or stores anything unless it does.

## 3. Scope

| Phase | Scope | Notes |
|---|---|---|
| **MVP** | Workstations (laptops and desktops): Keep / Upgrade / Replace, plus a "Right-size a new purchase" mini-path | Covers the brief's strongest examples: RAM upgrades, retiring old devices, overspecified laptops |
| Phase 2 | Servers and firewalls ("do you need this at all?") | Adds a fourth outcome, **Consolidate / Retire**; needs engineer input |
| Phase 3 | Aggregated, consented analytics on which verdicts users reach | Product insight only; no per-user data |

Out of scope: power/UPS assessment (the brief says a specialized third party handles electrical work), backup or resilience scoring, anything that stores answers server-side.

## 4. User flow (MVP)

1. Choose a path: **"Check a device I have"** or **"I'm about to buy one"**.
2. Answer 4-6 short questions (radio groups; one per screen or a compact single form).
3. Get a verdict with reasons, "what we'd check next", and a CTA.
4. CTA: **"Talk to an engineer about this device"**. Optionally pre-fills the standard contact form with a summary of the answers, only after the user opts in.

No account, no email required to see the result.

## 5. Inputs: "Check a device I have"

| # | Question | Options |
|---|---|---|
| 1 | Device type | Laptop / Desktop |
| 2 | Age | Under 3 years / 3-5 / 5-7 / Over 7 / Not sure |
| 3 | Operating system | Windows 11 / Windows 10 / Older or other / Not sure |
| 4 | If Windows 10: can it run Windows 11? | Yes / No / Not sure |
| 5 | Memory (RAM) | 4 GB or less / 8 GB / 16 GB or more / Not sure |
| 6 | Can the RAM be upgraded? | Yes / No (soldered) / Not sure |
| 7 | Main drive | SSD / Traditional hard disk / Not sure |
| 8 | What's the problem? (multi-select) | Slow at startup / Slow with several apps open / Runs out of disk space / Battery (laptops) / Crashes or hardware faults / Physical damage / No real problem |
| 9 | Typical use | Email, web, Office / Line-of-business apps / Heavy (CAD, video, development) |

Keep it to what a non-technical person can answer. Every question has a "Not sure" path that falls back to "Ask an engineer" rather than guessing.

## 6. Decision rules (ordered; first hard match wins, reasons accumulate)

**All thresholds below are engineering opinions and must be approved by the ITKeepers engineers before launch.** They live in a config file (section 8), not in code.

| Order | Condition | Verdict | Reason shown |
|---|---|---|---|
| 1 | OS is Windows 10 or older **and** cannot run Windows 11 | **Replace** | No longer receives regular security updates and can't move to a supported OS |
| 2 | OS is Windows 10 **and** can run Windows 11 | **Upgrade** | Move to a supported OS; check RAM and disk at the same time |
| 3 | Physical damage or repeated hardware faults, age 3 or over | **Replace** | Repair costs and downtime usually exceed the value of an aging device |
| 3b | Same, age under 3 | **Ask an engineer** | May be under warranty; check before spending |
| 4 | Main drive is a hard disk and age is 6 or under | **Upgrade** | An SSD is usually the highest-impact, lowest-cost upgrade |
| 4b | Main drive is a hard disk and age is over 6 | **Replace** | Aging platform; an SSD alone likely doesn't justify the cost |
| 5 | RAM 4 GB or less **and** use is not "Heavy" **and** upgradeable | **Upgrade** | Memory is the bottleneck; a RAM upgrade is inexpensive |
| 5b | RAM 4 GB or less **and** not upgradeable | **Replace** | Can't be fixed by adding memory |
| 6 | Only symptom is battery, laptop, age 5 or under | **Upgrade** | A battery service is likely enough |
| 7 | "Heavy" use and RAM 8 GB or less | **Ask an engineer** | Workload-specific; needs a real look |
| 8 | Age over 7, no problems, supported OS, SSD | **Keep** (with note) | Working well; plan a replacement date rather than spending now |
| 9 | No problems and everything above passes | **Keep** | Nothing here justifies spending money |
| Fallback | Any required answer is "Not sure" and no rule can fire | **Ask an engineer** | Not enough information to advise responsibly |

Note for maintainers: the Windows 10 rules depend on Microsoft's current support and Windows 11 hardware-eligibility guidance. Verify at each review.

## 7. "I'm about to buy one" mini-path

Input: typical use (Email/web/Office, Line-of-business, Heavy) and device type. Output: a **spec class**, not a product or price:

- Email/web/Office: mid-range spec is enough; top-tier isn't needed.
- Line-of-business: mid-range with more memory.
- Heavy: higher-spec justified; talk to an engineer.

Show the reasoning ("Paying for a top-tier machine for email-and-Office work rarely improves anyone's day"). Concrete RAM/SSD numbers are engineering-approved config values, not hard-coded copy.

## 8. Implementation

- **Framework:** built as a small island in the static site (Astro with a React or Preact component, or plain TypeScript). The site should be static or prerendered so the surrounding content is in the HTML.
- **Rules as data:** `rules.json` (ordered rules, thresholds, copy keys) plus a pure `evaluate(answers) -> {verdict, reasons[], nextChecks[]}` function. Engineers can edit rules without touching UI code.
- **Tests:** table-driven unit tests, one case per rule (section 10 lists starter cases). Test "Not sure" paths explicitly.
- **Fully client-side:** no network calls while using the tool. No third-party scripts. No `eval`. Compatible with a strict CSP.
- **Progressive enhancement:** ship the KEEP / UPGRADE / REPLACE explanation as static HTML (what each verdict means, examples of when we'd recommend each). The tool enhances it; the page still makes sense without JavaScript.
- **Visible versioning:** show "Rules last reviewed: <date>" in the tool. It's honest and forces periodic review.

## 9. UX, accessibility, privacy

- Real form controls: `<fieldset>`/`<legend>` with radio groups, visible labels, full keyboard support, visible focus.
- Verdict conveyed by **text and icon**, never by color alone. Result region uses `aria-live="polite"` and receives focus after submit.
- Respect `prefers-reduced-motion`; no animation needed to understand the result.
- Mobile-first layout. Consider RTL support if an Arabic version is planned (**Open**).
- **Privacy:** answers stay in the browser. No cookies or storage by the tool. Aggregated analytics (Phase 3) only with consent, and no free-text fields anywhere, to avoid collecting personal data.
- CTA pre-fill happens only on explicit opt-in and goes through the site's normal contact endpoint (rate-limited, bot-protected). Do not build a separate submission endpoint for this tool.

## 10. Starter test cases

| Scenario | Expected verdict |
|---|---|
| Windows 10, can't run Windows 11, any age | Replace |
| Windows 10, can run Windows 11, 8 GB RAM, SSD | Upgrade (OS) |
| Windows 11, HDD, 4 years old, office use | Upgrade (SSD) |
| Windows 11, HDD, 8 years old | Replace |
| Windows 11, 4 GB RAM, upgradeable, office use | Upgrade (RAM) |
| Windows 11, 4 GB RAM, soldered | Replace |
| 2-year-old laptop, physical damage | Ask an engineer |
| 6-year-old laptop, SSD, 16 GB, only battery complaints | Upgrade (battery) |
| 9-year-old desktop, Windows 11, SSD, no problems | Keep (plan replacement) |
| Any answer "Not sure" with no other rule firing | Ask an engineer |

## 11. Open decisions and risks

**Open (needs Jim / CEO / engineers):**
1. Engineers approve the thresholds in section 6 (age cutoffs, RAM minimums).
2. Margin transparency: whether to add a one-line disclosure that ITKeepers may earn a margin on hardware it procures. The brief flags the 10% vs "$10 on $200" conflict; clarify internally before writing this line.
3. Who receives leads generated by the CTA, and the internal response expectation. An unanswered CTA damages the "people first" positioning.
4. Languages and RTL.
5. Which page hosts it (homepage section vs "How We Work").

**Risks:**
- *Over-precision:* mitigated by qualitative outputs, an "Ask an engineer" verdict, and no scores.
- *Stale rules:* mitigated by visible review date and a scheduled review.
- *Engineer disagreement with a verdict:* mitigated by rules living in a reviewed config file, not buried in code.
- *Perceived as a quote:* mitigated by the guardrails in section 2.

## 12. Acceptance criteria

- Every rule in section 6 has a passing test.
- Works with keyboard only and with a screen reader; passes an automated accessibility scan.
- Page content (verdict definitions and examples) is present in delivered HTML without JavaScript.
- No network requests fired by the tool during use.
- All engineer-approved thresholds are in `rules.json`, with a review date.
- No prices, scores, savings claims, or "assessment product" language appear anywhere in the UI.
