# The contract — sections, rubrics, gate, scoring

This is the **deterministic contract** the brainstorming loop fills. The
*structure* is fixed; the *content* varies per demand. Everything below
`content` (confidence, status, todos, score, gate) is a pure function of what
was captured — regenerated after every answer, never stored as truth.

The contract has two layers, because the Intake Record is itself two layers:

- **The capture** (what the Submitter would put in the `00` brief) — surfaced
  inside the Intake Record as *Prontidão recebida* + *Demanda consolidada* and
  the assumptions/constraints. These are the **blocking** requirements: they
  decide whether the demand is honestly ready to be triaged.
- **The triage** (the PO's Act 1) — the 5 routing criteria + the routing
  decision. The skill **drafts** these (flagged for review); see
  [`triage-drafting.md`](triage-drafting.md).

## Table of contents

- [Capture requirements (blocking gate)](#capture-requirements-blocking-gate)
- [Capture requirements (non-blocking)](#capture-requirements-non-blocking)
- [How confidence maps to status](#how-confidence-maps-to-status)
- [Dispositions and the gate](#dispositions-and-the-gate)
- [Readiness scoring](#readiness-scoring)
- [Mapping capture → Intake Record sections](#mapping-capture--intake-record-sections)

---

## Capture requirements (blocking gate)

Derived from the Submitter's compliance contract ([`personas/01-submitter.md` §5](../../../../personas/01-submitter.md)).
`satisfiedWhen` is the rubric you judge `confidence` against — it is what "good
enough" means, and it orients your AI judgment.

| # | Requirement | Dimension | `satisfiedWhen` (rubric for confidence) | Blocks gate |
|---|---|---|---|---|
| 1 | **Problem statement** (the pain, *not* the solution) | Problem | The existing pain is described concretely, with observable symptoms, **without** prescribing implementation. If the statement names a solution ("build a chatbot"), it is **not** satisfied — reframe to the pain underneath. | ✅ |
| 2 | **Originator & context** | Evidence | Who raised it and in what situation is clear (e.g. "COO, Q2 planning meeting"), plus the channel it came through. | ✅ |
| 3 | **Who is impacted (Reach)** | Reach | The personas / segments / teams who feel the pain are named, with *how* each is affected. | ✅ |
| 4 | **Business impact** | Impact | Value is described across the applicable dimensions (revenue, retention, operational, competitive, compliance) — **quantified when possible** (R$, churn, hours, risk). Estimates are fine if marked low-confidence with a hint on what would firm them up. | ✅ |

> **Golden rule — problem before solution.** Requirement 1 is the guardian. A
> demand that arrives as "we need feature X" must be turned back into the pain X
> would relieve. If you can't, it isn't satisfied. ([`templates/README.md` › Regra de ouro](../../../../templates/README.md))

## Capture requirements (non-blocking)

These raise the readiness score and quality but do **not** block the gate. Don't
grind on them if the Submitter is tapped out — an honest `assumption` /
`discovery` / `deferred` disposition is a valid close.

| # | Requirement | Dimension | `satisfiedWhen` | Blocks gate |
|---|---|---|---|---|
| 5 | **Urgency & why now** | Impact | "Why now" and the cost of waiting are clear (a window, a deadline, a compounding cost). | — |
| 6 | **Evidence / prior documents** | Evidence | Attachments or prior conversations that ground the demand are listed with their relevance. | — |
| 7 | **Known constraints** | Constraints | Time / regulatory / budget / technical / scope limits are flagged — or an explicit "none known". | — |
| 8 | **Stakeholders** | Stakeholders | Who must be aware / decide is named, with interest and influence. | — |

Plus the **soft / contextual** captures that enrich the Intake Record (never
blocking): Type, RICE-lite value indicators + tensions, preliminary risks,
high-level scope (in/out/deferred), declared priority, success criteria. Fill
them from what the interview surfaces; don't force irrelevant dimensions.

---

## How confidence maps to status

| Confidence | Status | Meaning |
|---|---|---|
| empty / unaddressed | `empty` | Nothing captured yet. |
| ~1–69 | `low_confidence` | Captured but soft — an estimate, an inference, an unvalidated assumption. Counts **partially** toward the score. |
| ~70–100 | `resolved` | Solid enough to travel downstream. |

A `low_confidence` section is **not** a failure — it is honest. Its `hint` must
say *why* it's low and *what* would raise it (e.g. "GMV per hotel not shared —
PO can request from FinOps"). That hint is what turns "this is weak" into "this
is weak *for this reason*, and *this* would fix it."

## Dispositions and the gate

A blocking requirement reaches "ready" through **any honest disposition** — not
only a direct answer:

| Disposition | What it means | Effect on readiness |
|---|---|---|
| `answered` | The Submitter answered directly | full confidence |
| `inferred` | Extracted from their artifacts (file/deck) — record `source` | partial confidence + traceable |
| `assumption` | "We're assuming X" | counts, marked *to validate* |
| `discovery` | "Nobody knows yet — here's how we'll find out" | counts as *resolved-as-unknown*, time-boxed |
| `deferred` | Another stakeholder owns the answer | counts, with an owner attached |

> **`gateReady` = every requirement whose `blocksGate = true` is resolved by an
> honest disposition.** Not "the Submitter knows everything." A blocking
> requirement parked as a well-formed `assumption` or `discovery` item *clears
> the gate* — that is exactly what the Discovery Brief and Premissas sections
> encode.

## Readiness scoring

```
readinessScore = Σ(weightᵢ · satisfactionᵢ) / Σ(weightᵢ)   × 100

  satisfaction:  resolved = 1.0 · low_confidence = 0.5 · empty = 0.0
  weights:       blocking requirements weigh more than non-blocking ones
                 (a sensible default: blocking = 2, non-blocking = 1, soft = 0.5)

gateReady = ∀ requirement with blocksGate=true : disposition is honest
            AND status ≠ empty
```

Report the score as a percentage and the gate as Yes/No, mirroring the
*Prontidão recebida do Submitter* table. The score is a thermometer, not a
ranking — its job is to tell you and the Submitter how close you are.

---

## Mapping capture → Intake Record sections

The captured material flows into specific Intake Record fields. Don't re-type
the capture; **read** it into the PO-level consolidation.

| Captured requirement | → Intake Record section |
|---|---|
| Originator & context (#2) | *Metadados* (Registrado por) + feeds *Demanda consolidada* |
| Problem (#1) | *Demanda consolidada* › Problema (the pain, not the solution) |
| Reach (#3) | *Demanda consolidada* › Alcance |
| Business impact (#4) | *Demanda consolidada* › Impacto de negócio |
| Urgency (#5) | *Demanda consolidada* › Urgência |
| Declared priority | *Demanda consolidada* › Prioridade declarada |
| Readiness score + gate + open dispositions | *Prontidão recebida do Submitter* |
| Assumptions captured | *Premissas validadas na triagem* (each with a PO verdict: Aceita / Rejeitada / A validar) |
| Constraints captured | *Constraints reconhecidos* |
| Discovery unknowns (if triage → Discovery) | *Discovery Brief* |
| Triage criteria + routing decision | *Triagem* — **drafted, flagged** (see triage-drafting.md) |
| CTO architectural signal | *Escalada arquitetural ao CTO* (Sim/Não + brief rationale) |

Each consolidated dimension carries its **inherited confidence** (the confidence
of the capture it came from). The PO doesn't recompute the capture — they record
what they received and what stays soft.
