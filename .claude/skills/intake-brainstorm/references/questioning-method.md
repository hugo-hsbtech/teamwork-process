# The questioning method — how to brainstorm toward a filled template

The unit of work is **the question** — asked like a curious partner who already
did their homework, not a form field. This guidance is used by the **Question
Strategist** (to decide what to ask) and by the orchestrator (to ask it). It is
template-agnostic: the *contract* (`contract-and-template.md`) says which sections
exist and what "good enough" means; this file says *how to ask*.

## Cardinal rules

1. **Harvest before you ask.** Mine the opening statement and every referenced
   file first (that is File Extraction's job). Pre-fill everything sourceable as
   `inferred` with a precise `source`, then ask only the gaps. The person should
   feel "it read my stuff," never "it ignored what I gave it."
2. **One theme at a time, ≈1–3 questions.** A wall of questions is a form, not a
   brainstorm. Ask a tight batch, listen, regenerate.
3. **Business language only.** Clients, value, pain, money, risk, relationship —
   never "what database / which API." Meet a non-technical Submitter in their
   language and do the structuring for them.
4. **Reflect, then probe.** Open each round by mirroring what you now understand in
   their words, then ask the next thing. The demand should get sharper, not a
   checklist get ticked.
5. **Every question carries an escape hatch** so "I don't know" stays productive
   (see Dispositions).
6. **Lead with blocking gaps.** Spend questions where they move the gate first
   (sections with `blocks=true` below `min-confidence`), then the rest.

## Targeting the next question

After each round, pick the next theme by: **blocking before non-blocking →
lowest confidence first → the gap whose answer unlocks the most other sections.**
A single good question about the *pain* often clarifies reach and urgency too —
chase high-leverage threads. Regenerate the set after every answer: the contract
never changes, but your *semantic reading* of this demand sharpens, so new
questions appear because it came into focus, not because a box is still empty.

## Dispositions — making "I don't know" productive

A blocking section isn't binary (answered / missing). It has honest routes to
"ready enough." When an answer is uncertain, *route it* instead of leaving it
empty:

| If the person… | Disposition | How you offer it |
|---|---|---|
| answers directly | `answered` | — |
| points you at a doc | `inferred` | "Got it from the deck — I'll cite p.4." |
| has a working belief | `assumption` | "Want to **assume** ~40% for now, flagged to validate?" |
| genuinely doesn't know | `discovery` | "Nobody knows yet? Let's send it to **Discovery**, time-boxed." |
| says it's someone else's call | `deferred` | "I'll mark **<owner>** as the owner of that answer." |

The gate is **"every blocking section has an honest disposition"** — not "the
person knows everything." Never let the session stall on a blank.

## Tensions — the value mirror

If the template carries value indicators (impact / reach / urgency, scored
lightly), use the **tension between them** as a gentle provocation that sharpens
answers *and* raises readiness:

- Impact high + confidence low → "You see big value — what evidence would make you sure?"
- Urgency high + impact low → "Sounds urgent — is it truly now, or just loud?"
- Reach high + per-unit impact thin → "Many touched, small effect each — is that the real win?"

Record each tension and its resolution; an unresolved tension is itself a gap.

## Confidence calibration

Judge `confidence` against the section's rubric in `contract.lock.md`, not your
gut:

- **85–100** — concrete, sourced, quantified where it should be.
- **70–84** — solid and answered, minor softness; clears a typical gate.
- **40–69** — captured but soft (estimate, single-source inference, unvalidated
  assumption). `low_confidence`. Always attach a `hint`.
- **1–39** — vague or second-hand; usually needs a disposition route.
- **0** — `empty`.

Honest mid-range numbers with sharp hints beat fake 95s. Calibrate against the
bundled exemplar in `grounding.md`.

## What "done" feels like

You are done asking when every blocking section is resolved or honestly disposed
and the gate clears. The session shouldn't end on "you're still missing 4 fields"
— it should end on "here is what this demand *is*, how solid each part is, and
what we deliberately parked (with owners / time-box)."
