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
| **Discovery** | Open unknowns **on the blocking capture itself** (problem, reach, impact) or on product scope that prevent closing the scope with confidence — e.g. unmapped fiscal/legal rules, an unverified integration the whole demand hinges on, a problem still framed as a guess. Route here when a *blocking* section cleared the gate only via `assumption`/`discovery`. **Do not** send to Discovery merely because *technical-feasibility* assumptions are open — those belong in rationalization / the Technical Assessment (see CTO escalation below). |
| **Product Ready** | A real, recurring, strategically-aligned problem with clear-enough impact and urgency, and **no blocking unknowns** — the scope can be closed. |
| **Backlog (Opportunity)** | A good demand whose urgency/impact don't justify acting now. |
| **Reject** | Out of strategy or low value. Closes the door — only draft this with strong, explicit rationale, and be conservative: rejection is the PO's call to make, so lean toward flagging for review rather than proposing a hard reject. |

Distinguish two kinds of open assumption. A **product/scoping** unknown (does
the demand even make sense without answering X?) is a reason for Discovery. A
**technical-feasibility** assumption ("the existing WebSocket layer can carry a
new event type", "session state extends without a full schema migration") is
*not* — it is exactly what rationalization and the CTO's Technical Assessment
exist to firm up, and parking it does not block triage.

So: when the four blocking capture sections are **answered directly** at solid
confidence and the only open items are reasonable technical-feasibility
assumptions, **draft `Product Ready`** — don't hedge to Discovery. Reserve
Discovery for genuine product/scoping unknowns. Conversely, don't over-claim
`Product Ready` when the *problem or impact itself* is still a guess.

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
only when the capture touches genuine **architectural** impact — new infra or
platform changes, payments/split, multi-tenancy, the security model, AI/runtime,
or integrations with real unknowns — the kind of thing that must be de-risked
*before* scope can freeze.

Draft **Não** when the work is an extension of existing UI and session state on
current infrastructure, even if it carries ordinary technical assumptions. Those
are validated by the **Tech Lead during the technical breakdown in
rationalization** — they do not, by themselves, require a CTO Technical
Assessment. Escalating every routine assumption defeats the purpose of the gate;
reserve escalation for architectural risk that actually changes the build. As
always, this is a draft signal the PO confirms.

## Premissas validadas na triagem

For each assumption captured during the interview, give a **proposed PO verdict**
and who to validate it with — flagged as a draft read of the evidence, not a
final PO ruling. Calibrate the verdict to the assumption's risk; don't default
everything to "A validar":

- **Aceita** — reasonable and low-risk given the system, and *does not block the
  routing decision*. Most routine technical-feasibility and scope assumptions
  land here. (They still travel forward to be confirmed during rationalization —
  acceptance at triage isn't a guarantee, it's "no red flag.")
- **A validar** — material to scope or value **and** genuinely uncertain (e.g. an
  expansion-ARR ticket estimate, a customer-adoption dependency, an integration
  the demand hinges on).
- **Rejeitada** — evidence already contradicts it.

Blanket "A validar" on every premissa is the over-cautious failure mode: it
mirrors the human PO poorly, who accepts reasonable assumptions and moves on.
Assumptions that survive must travel forward explicitly, whatever the verdict.

## The bar

A good triage draft is **defensible**: every verdict traces to captured
evidence, the routing rationale would survive a PO reading it cold, and the
draft never pretends to be a decision a human hasn't yet made. When in doubt
between two paths, state the tension and let the PO decide — that *is* the
correct, honest output.
