# Drafting the triage — flagged for human review

The Intake Record's *Triagem* section is the **PO's Act 1**: a routing decision
(Product Ready / Discovery / Backlog / Reject) with traceable rationale
([`personas/02-po.md` §3, §6.1](../../../../personas/02-po.md)). Triage is normally
**human judgment**. This skill brainstorms with the *Submitter*, who does not
make that call. So you **draft** the triage as a proposal grounded in the
captured evidence — and you **flag it clearly as a draft awaiting PO
confirmation**. Never present it as a settled decision.

## The non-negotiable: flag it

At the top of the *Triagem* section, insert a visible banner, in the document's
language. For example (pt-BR):

```markdown
> ⚠️ **RASCUNHO DE TRIAGEM — gerado por IA a partir da captura, pendente de
> confirmação do PO.** Os vereditos e a decisão de caminho abaixo são uma
> *proposta* baseada na evidência capturada, não uma decisão final. O PO deve
> revisar, ajustar e assinar. Até lá, `Status` = *Em triagem* e a disposição
> desta seção é `low_confidence`.
```

en-US equivalent:

```markdown
> ⚠️ **TRIAGE DRAFT — AI-generated from the capture, pending PO confirmation.**
> The verdicts and routing decision below are a *proposal* grounded in the
> captured evidence, not a final call. The PO must review, adjust, and sign off.
> Until then, `Status` = *In triage* and this section's disposition is
> `low_confidence`.
```

Set the Metadados `Status` to *Em triagem* (not *Triado*) and leave *Triado por
(PO)* / *Data de triagem* blank for the human to fill.

## Step 1 — Evaluate the 5 criteria from evidence

For each criterion, give a verdict, a rationale, and the **basis/source** it
rests on (trace-to-source — every claim points back to captured evidence). Only
assert what the capture supports; where evidence is thin, say so and lower the
draft's confidence.

| # | Criterion | Verdict | What to ground it in |
|---|---|---|---|
| 1 | Is it a real problem (not an isolated symptom)? | Sim / Não | Concrete evidence in the capture — data, repeated incidents, complaints. Not a hypothesis. |
| 2 | Is it recurring / does it have volume? | Sim / Não | Does the pain recur per ticket / per cycle, or affect many? Cite the reach/frequency captured. |
| 3 | Does it fit the product vision? | Sim / Não | Strategic alignment. If you can't judge fit from the capture, say so and defer to the PO. |
| 4 | Technical & business impact? | Alto / Médio / Baixo | Business magnitude from the impact capture; technical signal from constraints/risks. |
| 5 | Do urgency & impact justify *now*? | Sim / Não | The urgency capture — deadline, window, compounding cost. |

## Step 2 — Propose a routing decision

Pick **one** path, with an obligatory, defensible rationale. Use this evidence-
based heuristic (it guides the *draft*; the PO owns the final call):

| Propose… | When the capture shows… |
|---|---|
| **Discovery** | Blocking unknowns that prevent scoping with confidence — open `assumption`/`discovery` items on critical dimensions (e.g. "does the current PSP support split?", unmapped fiscal/legal rules, unverified integration). **Default to Discovery when key blocking sections cleared the gate only via `assumption`/`discovery` dispositions.** |
| **Product Ready** | A real, recurring, strategically-aligned problem with clear-enough impact and urgency, and **no blocking unknowns** — the scope can be closed. |
| **Backlog (Opportunity)** | A good demand whose urgency/impact don't justify acting now. |
| **Reject** | Out of strategy or low value. Closes the door — only draft this with strong, explicit rationale, and be conservative: rejection is the PO's call to make, so lean toward flagging for review rather than proposing a hard reject. |

Because the Submitter's capture is your only evidence and unknowns are common at
intake time, **Discovery is the most common honest draft** when blocking items
were parked as assumptions. Don't over-claim *Product Ready* on soft evidence.

Fill the decision table: Decisão · Justificativa · Reversível? · Submitter
notificado (leave the notification date blank — that's a human action).

## Step 3 — Conditional sections

- **If the draft decision is Discovery:** fill the *Discovery Brief* — turn each
  open unknown into a row (incógnita · who can answer · method) and propose a
  time-box. Leave the *Log* and *Resultado* empty (they're filled as Discovery
  runs).
- **Otherwise:** remove the Discovery Brief section entirely, as the template
  instructs.

## Step 4 — CTO escalation signal

Fill *Escalada arquitetural ao CTO* (Sim/Não + brief rationale). Draft **Sim**
when the capture touches infra, platform, payments/split, security, AI/runtime,
or integrations with unknowns — these need CTO feasibility before scope can
freeze. This too is a draft signal for the PO to confirm.

## Premissas validadas na triagem

For each assumption captured during the interview, give a **proposed PO verdict**
(Aceita / Rejeitada / A validar) and who to validate it with — again, flagged as
a draft read of the evidence, not a final PO ruling. Assumptions that survive
must travel forward explicitly.

## The bar

A good triage draft is **defensible**: every verdict traces to captured
evidence, the routing rationale would survive a PO reading it cold, and the
draft never pretends to be a decision a human hasn't yet made. When in doubt
between two paths, state the tension and let the PO decide — that *is* the
correct, honest output.
