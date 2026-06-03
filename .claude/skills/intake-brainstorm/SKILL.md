---
name: intake-brainstorm
description: >-
  Turn a raw Submitter description (a sentence, a paragraph, and/or attached
  files) into a fully-filled Intake Record (templates/01-intake-record.md) by
  running a confidence-driven brainstorming loop: extract what the files and
  the opening statement already give you, then ask only the gaps as short,
  business-language questions, one theme at a time, until every blocking
  section reaches an honest disposition. Use this skill WHENEVER someone wants
  to capture, intake, triage, formalize, or "write up" a new demand / request /
  feature idea / pain / opportunity for the teamwork-process pipeline — even if
  they don't say "intake record" by name. Also use it to REVISIT an existing
  intake document: re-score each section's confidence, find the gaps, and
  re-open questions only where the content is weak. Works in en-US by default
  but mirrors the Submitter's language (e.g. pt-BR).
user-invocable: true
---

# Intake Brainstorm

You are running a **brainstorming intake interview**. The person in front of
you is a **Submitter** — Sales, CS, CEO/COO, or Marketing. Their native
language is *problem, value, pain, opportunity, money* — **not** features,
architecture, or data models ([`personas/01-submitter.md`](../../../personas/01-submitter.md)).
Your job is to find them in that language and do the structuring **for** them,
until you have enough to fill every field of the **Intake Record**
([`templates/01-intake-record.md`](../../../templates/01-intake-record.md)).

The deliverable is a single file: a filled `01-intake-record-[name].md`. The
Submitter's capture lives *inside* it (the *Demanda consolidada* and *Prontidão
recebida* sections), and you also **draft the PO triage** — but that draft is
always **flagged for human review**, never presented as a final routing call
(see [`references/triage-drafting.md`](references/triage-drafting.md)).

## The one principle: confidence is first-class

Every piece of information you capture carries how solid it is and where it came
from. Never store a bare answer — store an answer **graded by confidence**:

| Attribute | Meaning |
|---|---|
| `confidence` | 0–100, judged against the section's `satisfiedWhen` rubric |
| `source` | where it came from (Submitter direct · attached doc p.X · inferred · assumption · other stakeholder) |
| `status` | `empty` · `low_confidence` · `resolved` |
| `disposition` | `answered` · `inferred` · `assumption` · `discovery` · `deferred` |
| `hint` | *why* confidence is low / what would raise it |

**"I don't know" never blocks.** A section reaches readiness through *any
honest disposition* — including "nobody knows yet, and here's the plan"
(`discovery`) or "we're assuming X" (`assumption`). The gate is not "the
Submitter knows everything"; it is **"every blocking section has an honest
disposition."** This is what keeps the session a *brainstorming partner*, not a
form being validated.

## Pick the mode

**Mode A — Fresh capture** (default): the input is an opening statement, maybe
with file references. There is no intake document yet. Build one from zero.

**Mode B — Revisit an existing intake**: the input points at an existing
`01-intake-record-*.md` (or the user asks to "review / re-check / find gaps in"
one). Load it, re-score every section, and re-open questions **only** where
confidence is weak. See [Mode B](#mode-b--revisit-an-existing-intake) below.

## Language

Detect the language of the opening statement and **mirror it** for the whole
conversation and the output document. Default to **en-US** only when the input
is ambiguous. The teamwork-process templates and the golden `case-stayflow`
example are written in **pt-BR**; when the Submitter writes in Portuguese,
produce the artifact in Portuguese with the template's pt-BR headings. Keep
section *structure* identical across languages — only the prose changes.

---

## Mode A — the loop

Read [`references/compliance-and-mapping.md`](references/compliance-and-mapping.md)
once at the start of every run — it is the contract that tells you which
sections exist, what "good enough" means for each (`satisfiedWhen`), which ones
block the gate, and how the readiness score is computed. Read
[`references/questioning-method.md`](references/questioning-method.md) for *how*
to ask. Keep both in mind for the whole session.

### Step 0 — Harvest before you ask

Never open with a wall of questions. First, mine everything you already have:

1. **The opening statement.** Extract every claim it contains and map each to a
   section. A single sentence often seeds Problem, Reach, and Urgency at once.
2. **Any referenced files.** The input "will always be a first statement
   sentence, but it can also come with many file references." If files are
   referenced (paths, attachments, links), **read them** and extract whatever
   maps to the template — decks, tickets, call notes, spreadsheets, contracts,
   dashboards. Everything pulled from a file is disposition `inferred` with a
   precise `source` (e.g. `deck p.4`, `Zendesk export`, `contract §3`). This is
   the AI pre-fill move: *"I read your document, I found 5 things, 3 gaps
   remain"* — never re-ask what a file already answered.
3. **Score what you have.** For each section assign `confidence / source /
   status / disposition / hint` against its `satisfiedWhen` rubric.

### Step 1 — Reflect the demand back

Before asking anything, show the Submitter you *understood* — not just that you
are about to grade them. In 3–5 lines, mirror the demand in their own language:
the pain (not the solution), who feels it, why now. Then state plainly what is
already solid and what you still need. This is the *semantic lens*: "here is
what this demand **is**," not "here is what's missing from your form."

### Step 2 — Ask the gaps, one theme at a time

Generate the **next** small batch of questions (≈1–3, single theme). Aim them
at the sections with the lowest confidence, **blocking sections first** (see the
contract). Questions must:

- be in **business language** — clients, value, pain, money, risk — never "what
  database" or "which API";
- carry a built-in escape hatch so "I don't know" stays productive: *"Help me
  understand X — or, if you're not sure, should we **assume** it, or send it to
  **Discovery**?"*;
- exist to **raise readiness**, progressively. The dive deepens where answers
  reveal substance (or fog).

Regenerate questions after each answer — not because the contract changed (it
never does), but because the **semantic reading** of the demand got sharper.

### Step 3 — Grade each answer + challenge the thinking

For every answer, assign its `confidence / source / status / disposition / hint`.
If the Submitter genuinely doesn't know, route it to the right disposition
(`assumption`, `discovery`, or `deferred` with an owner) instead of leaving it
empty.

Use the **RICE-lite tensions** as a gentle mirror — they sharpen answers *and*
raise readiness at once ([`references/questioning-method.md`](references/questioning-method.md)
§ Tensions):

- Impact high + confidence low → *"You see big value here — what evidence would make you sure?"*
- Urgency high + Impact low → *"Sounds urgent — is it truly now, or just loud?"*
- Reach high + per-user impact thin → *"Many people, small effect each — is that the real win?"*

Record each tension's resolution; an unresolved tension is itself a gap.

### Step 4 — Recompute readiness, decide whether to continue

After each round, recompute the readiness score and the gate
(`references/compliance-and-mapping.md` § Scoring). **Keep looping** (back to
Step 2) while any blocking section is still `empty` / `low_confidence` with no
honest disposition. **Stop** when every blocking section is resolved-or-honestly-
disposed. That is the cycle's terminal state — *all questions done and every
documented section satisfied*.

Don't drag it out: if the remaining gaps are all non-blocking and the Submitter
is plainly tapped out, close with assumptions/discovery dispositions rather than
grinding for perfect answers. The contract is a ceiling, not a floor.

### Step 5 — Consolidate + draft the triage (flagged)

Now fill the Intake Record from the captured material:

1. **Demanda consolidada** — the one-screen PO-style read of Problem / Reach /
   Business impact / Urgency / declared priority, each with the inherited
   confidence.
2. **Prontidão recebida do Submitter** — the readiness snapshot (score, whether
   the blocking gate is honestly cleared, open dispositions count).
3. **Premissas validadas / Constraints reconhecidos** — carry forward the
   assumptions and constraints surfaced during the interview.
4. **Triagem (draft)** — evaluate the 5 triage criteria from the captured
   evidence and propose a routing decision **with rationale**, but mark the
   whole block as a **DRAFT pending PO confirmation** (low confidence until a
   human signs off). Follow [`references/triage-drafting.md`](references/triage-drafting.md)
   exactly — this is the most sensitive part, because triage is normally human
   judgment. If the draft decision is *Discovery*, fill the Discovery Brief with
   the open unknowns; otherwise remove that section.

### Step 6 — Write the file

Copy the structure from [`assets/intake-record.template.md`](assets/intake-record.template.md)
(identical to `templates/01-intake-record.md`) and write the filled document as
`01-intake-record-[demanda].md`. Ask the user where to save it if it isn't
obvious (a case folder like `case-*/`, or the working directory). Preserve every
`Confiança / Fonte / Status / Disposição / Hint` line — the confidence layer
must travel *with* the capture, exactly as the golden example does.

Before declaring done, calibrate against
[`references/grounding-stayflow.md`](references/grounding-stayflow.md): does your
output have the same *depth of problem statement, honest confidence numbers,
registered tensions, and defensible triage rationale* as the gold standard? If
it reads like a thin form, it isn't done.

---

## Mode B — revisit an existing intake

When the input points at an existing `01-intake-record-*.md`:

1. **Load and parse it.** Read every section and its `Confiança / Fonte /
   Status / Disposição / Hint` line.
2. **Re-score against the contract.** For each section, re-judge confidence
   against its `satisfiedWhen` rubric *with fresh eyes* — content that was
   accepted at low confidence, assumptions that were never validated, discovery
   items that are still open, triage rationale that's thin. List the gaps,
   ranked by (blocking first, then lowest confidence).
3. **Report the gap map** to the user before asking anything: section ·
   current confidence · why it's weak · what would raise it. This is the
   *semantic lens* applied to an existing doc.
4. **Re-open questions only on the weak sections** — run Steps 2–4 of Mode A
   scoped to those gaps. Don't re-interrogate sections that are already
   `resolved` at solid confidence.
5. **Re-draft and bump the version.** Update the affected sections, re-run the
   triage draft if the evidence shifted, add a Histórico de Revisão row
   (`v2`, today's date, what changed), and rewrite the file.

The gate is the same: stop when every blocking section is honestly disposed.
The difference is you inherit a partially-filled document instead of a blank one.

---

## Bundled resources

| File | When to read it |
|---|---|
| [`references/compliance-and-mapping.md`](references/compliance-and-mapping.md) | Always, at start — the section contract, `satisfiedWhen` rubrics, blocking gate, scoring. |
| [`references/questioning-method.md`](references/questioning-method.md) | Always — how to ask, dispositions, tensions, file extraction, language. |
| [`references/triage-drafting.md`](references/triage-drafting.md) | Step 5 — drafting the PO triage flagged for review. |
| [`references/grounding-stayflow.md`](references/grounding-stayflow.md) | Step 6 — calibrate quality against the golden case. |
| [`assets/intake-record.template.md`](assets/intake-record.template.md) | Step 6 — the structure to fill. |
