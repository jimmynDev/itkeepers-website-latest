# "Quick Self-Check": Copy and Rules

Prepared: 28 September 2026 | Project: ITKeepers website | Status: **Proposed, not built**
Companion to `Keep-Upgrade-Replace-Tool-Spec.md`. Same guardrails: no score, no risk label, no claim that ITKeepers assessed anything.

## 1. Placement and role

- Second tab in the same component as the Keep / Upgrade / Replace tool (tabs: **Check a device** | **Quick self-check**), or a short section directly after it.
- Purpose: a low-commitment way in that supports "Let's talk about your IT before there's a problem."
- Runs fully client-side. Nothing stored or sent unless the visitor opts in to include answers in a contact message.

## 2. Section copy

**Eyebrow:** Before there's a problem
**Heading:** Four questions worth asking about your IT.
**Intro:** A quick conversation starter, not an audit. Your answers stay in your browser.
**Button (start):** Start the self-check
**Button (results):** See what's worth asking
**Progress label:** Question 2 of 4

Answer options for every question: **Yes** / **No** / **Not sure**

## 3. Questions and notes

| # | Question | Helper text | Note shown for "No" or "Not sure" |
|---|---|---|---|
| 1 | Do you know when a backup was last *restored* as a test, not just when it last ran? | A test restore proves you can actually get data back. | Backups that run aren't the same as backups that restore. **Worth asking:** when was a restore last tested, and how long did it take? |
| 2 | If your IT person were unavailable tomorrow, could someone else pick up where they left off? | Think logins, licences, network details, and open work. | Knowledge that lives in one person's head is fragile. **Worth asking:** where is your environment documented, and who else can reach it? |
| 3 | Do you know who is alerted, and how quickly, when something critical breaks at night or on a weekend? | Include what counts as "critical." | Out-of-hours expectations are often assumed rather than agreed. **Worth asking:** what counts as critical, who is notified, and what response should you expect? |
| 4 | Do you have a current list of your devices, their age, and their support status? | Laptops, desktops, servers, and firewalls. | Unsupported or aging devices tend to surface as surprises. **Worth asking:** which devices are near end of life, and which are fine to keep? *(Link: try the Keep / Upgrade / Replace tool.)* |

Do **not** add a question about power redundancy: the brief says a specialized third party handles electrical work.

## 4. Results copy

**If at least one answer is "No" or "Not sure":**
- Heading: **Worth a closer look**
- Body: list only the flagged questions, each with its note. Show no count, score, colour rating or "at risk" language.
- Footer: *A short self-check can't tell you whether your setup is sound. It only shows where to start a conversation.*
- Primary CTA: **Talk to an engineer about these**
- Secondary: **Copy these questions** (copies flagged questions to the clipboard; no network call)

**If every answer is "Yes":**
- Heading: **You've got the basics on your radar**
- Body: If you'd like a second opinion on any of them, we're happy to talk. Knowing the answer and having it verified are different things.
- Same footer, CTA: **Talk to our team**

## 5. CTA pre-fill (opt-in only)

Show an unchecked box: **"Include my answers in my message."** If checked, pre-fill the standard contact form with:

```
Self-check (from website):
1. Backup restore testing: Not sure
2. Documentation and continuity: No
```

Use the site's normal contact endpoint (rate-limited, bot-protected). No separate endpoint for this tool.

## 6. Rules (`self-check.json`)

```json
{
  "version": "1.0",
  "reviewed": "2026-09-28",
  "flagOn": ["no", "unsure"],
  "questions": [
    { "id": "backups",  "text": "Do you know when a backup was last restored as a test, not just when it last ran?",
      "helper": "A test restore proves you can actually get data back.",
      "noteKey": "note_backups",  "summary": "Backup restore testing" },
    { "id": "continuity", "text": "If your IT person were unavailable tomorrow, could someone else pick up where they left off?",
      "helper": "Think logins, licences, network details, and open work.",
      "noteKey": "note_continuity", "summary": "Documentation and continuity" },
    { "id": "afterhours", "text": "Do you know who is alerted, and how quickly, when something critical breaks at night or on a weekend?",
      "helper": "Include what counts as critical.",
      "noteKey": "note_afterhours", "summary": "Out-of-hours alerting" },
    { "id": "inventory", "text": "Do you have a current list of your devices, their age, and their support status?",
      "helper": "Laptops, desktops, servers, and firewalls.",
      "noteKey": "note_inventory", "summary": "Device inventory and support status" }
  ]
}
```

Evaluation logic (pure function):

```ts
type Answer = "yes" | "no" | "unsure";
export function evaluate(answers: Record<string, Answer>, cfg: Config) {
  const flagged = cfg.questions.filter(q => cfg.flagOn.includes(answers[q.id]));
  return { state: flagged.length ? "flags" : "clear", flagged };
}
```

Notes: the submit button stays disabled until all four are answered. Flagged items keep question order. "Not sure" is always flagged, since not knowing is the finding.

## 7. Test cases

| Answers (backups, continuity, afterhours, inventory) | Expected |
|---|---|
| Yes, Yes, Yes, Yes | Clear state, "Talk to our team" |
| No, Yes, Yes, Yes | Flags: backups only |
| Yes, Not sure, Yes, Yes | Flags: continuity only |
| No, No, No, No | All four flagged, question order preserved, no score shown |
| Not sure ×4 | All four flagged |
| Any question unanswered | Results button disabled |

## 8. Accessibility and safety

- Each question is a `<fieldset>` with `<legend>` and radio inputs; keyboard-operable, visible focus.
- Results region uses `aria-live="polite"` and receives focus after submit. Verdict is text-based, never colour-only.
- Respect `prefers-reduced-motion`; no auto-advance.
- Static HTML fallback: the four questions and their notes are present in the page without JavaScript.
- No free-text fields, cookies, storage or third-party scripts in the tool.
- Wording rules: never "you are at risk," "unsafe," "compliant," or "protected." Say "worth asking."

## 9. Open items

1. Engineers approve the four questions and notes (they are ITKeepers' voice).
2. Decide who receives CTA leads and the internal response expectation before launch.
3. Question 1's note invites "do *you* test restores?" Start documented restore tests first, or soften the note.
4. Arabic version and RTL layout, if planned.
