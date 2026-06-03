# The questioning method — how to brainstorm an intake

The unit of work is **the question**. Not a form field — a question, asked like
a curious partner who already did their homework. This is the same spirit as a
good brainstorming facilitator: pull the thread, reflect understanding, follow
the energy where the substance (or the fog) actually is.

## Cardinal rules

1. **Harvest before you ask.** Read the opening statement and every referenced
   file first. Pre-fill everything you can as `inferred` with a precise
   `source`. Then ask *only the gaps*. The Submitter should feel "it read my
   stuff," never "it ignored what I already gave it."
2. **One theme at a time, ≈1–3 questions.** A wall of 12 questions is a form,
   not a brainstorm. Ask a tight batch, listen, regenerate.
3. **Business language only.** Clients, value, pain, money, risk, relationship.
   Never "what's the data model / which API / what database." The Submitter is
   not technical and asking them to think like an engineer breaks the session.
4. **Reflect, then probe.** Open each round by mirroring what you now understand
   in *their* words, then ask the next thing. They should see the demand getting
   sharper, not a checklist getting ticked.
5. **Every question carries an escape hatch.** "I don't know" must stay
   productive — offer the assumption / discovery / deferred route in the same
   breath (see Dispositions below).
6. **Lead with blocking gaps.** Spend questions where they move the gate:
   Problem, Originator/context, Reach, Business impact first. Urgency,
   evidence, constraints, stakeholders second.

## Targeting the next question

After each round, recompute confidence per section and pick the next theme by:
**(blocking before non-blocking) → (lowest confidence first) → (the gap whose
answer unlocks the most other sections)**. A single good question about the
*pain* often clarifies Reach and Urgency too — chase those high-leverage threads.

Regenerate the question set after every answer. The contract never changes; what
changes is your *semantic reading* of this specific demand. New questions appear
because the demand came into focus, not because a box is still empty.

## Extracting from referenced files

The input may arrive as a sentence **plus file references** (paths, attachments,
links to decks, tickets, call transcripts, spreadsheets, contracts, dashboards).
Treat files as a first-class source:

- **Read each file** and pull every claim that maps to a contract section.
- Record each as disposition `inferred`, `status` per confidence, with a
  **precise `source`** — `deck p.4`, `Zendesk export 2026-Q1`, `contract §3.2`,
  `call transcript 12:30`. Precision here is what makes the capture defensible.
- A number you read from a file is usually *higher* confidence than a number the
  Submitter recalls from memory — grade accordingly, and note it in the `hint`.
- After extraction, summarize: *"From your files I filled Problem, Reach, and
  the CSAT/SLA numbers (from the Q1 deck). Three things aren't in there — let's
  talk about those."* Then ask only those.

If a referenced file can't be read (missing, binary you can't parse, access
denied), say so plainly and ask the Submitter to summarize it or re-share —
don't silently drop it.

## Dispositions — making "I don't know" productive

A blocking requirement isn't binary (answered / missing). It has several honest
routes to "ready enough to advance." When an answer is uncertain, *route it*
instead of leaving it empty:

| If the Submitter… | Disposition | How you phrase the offer |
|---|---|---|
| answers directly | `answered` | — |
| points you at a doc | `inferred` | "Got it from the deck — I'll cite p.4." |
| has a working belief | `assumption` | "Want to **assume** ~40% opt-in for now, flagged to validate?" |
| genuinely doesn't know | `discovery` | "Nobody knows yet? Let's send it to **Discovery** with a time-box." |
| says it's someone else's call | `deferred` | "I'll mark **FinOps** as the owner of that number." |

The gate is **"every blocking requirement has an honest disposition"** — not
"the Submitter knows everything." Never let the session stall on a blank; always
offer a route forward.

## Tensions — the RICE-lite mirror

RICE-lite here is **not** a ranking formula. It's a mirror to challenge the
thinking. Have the Submitter score Impact / Reach / Urgency lightly (Low / Med /
High); Effort stays *soft* (a guess, marked `low_confidence`, firmed later by the
CTO). The value is in the **tension between scores**, surfaced as a gentle
provocation:

- **Impact High + confidence Low** → "You see big value — what evidence would make you sure?"
- **Urgency High + Impact Low** → "Sounds urgent — is it truly *now*, or just loud?"
- **Reach High + per-user impact thin** → "Many people, small effect each — is that the real win?"

Record each tension *and its resolution*. Sharpening a tension raises readiness —
mirror and gate pull the same direction. An unresolved tension is a gap.

## Confidence calibration

Judge `confidence` against the section's `satisfiedWhen` rubric in
[`compliance-and-mapping.md`](compliance-and-mapping.md), not your gut:

- **85–100** — concrete, sourced, quantified where it should be.
- **70–84** — solid and answered, minor softness; clears the gate.
- **40–69** — captured but soft (estimate, single-source inference, unvalidated
  assumption). `low_confidence`. Always attach a `hint`.
- **1–39** — vague or second-hand; usually needs a disposition route.
- **0** — `empty`.

Calibrate against [`grounding-stayflow.md`](grounding-stayflow.md): the golden
example runs Problem at 88, Business impact at 72 (explicitly "estimates, not
calculated"), Urgency at 75 ("informal deadline, undocumented"). Honest mid-range
numbers with sharp hints beat fake 95s.

## Language

Mirror the Submitter's language for the conversation **and** the output document.
Default en-US only when the input is ambiguous. The process templates and the
golden case are pt-BR — when the Submitter writes Portuguese, write the artifact
in Portuguese using the template's pt-BR headings. The *structure* of questions
and sections is identical across languages; only the prose changes. Don't ask
the Submitter to switch languages to match a template — translate for them.

## What "done" feels like

You are done asking when every blocking section is `resolved` or honestly
disposed and the readiness gate is clear. The session shouldn't end on "you're
still missing 4 fields" — it should end on "here's what this demand *is*, here's
how solid each part is, and here's what we deliberately parked for Discovery /
assumption, with owners." Then move to consolidation and the triage draft.
