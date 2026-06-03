# Grounding — calibrate against the golden case

The `case-stayflow` "Concierge & Settlement" demand is the **gold standard** for
what a well-run intake looks like. Before declaring a run done, read the two
golden files and compare your output against them — not for the same content,
but for the same *quality bar*:

- [`case-stayflow/00-submitter-brief-concierge-settlement.md`](../../../../case-stayflow/00-submitter-brief-concierge-settlement.md)
  — the capture (what your brainstorming produces, surfaced inside the Intake Record).
- [`case-stayflow/01-intake-record-concierge-settlement.md`](../../../../case-stayflow/01-intake-record-concierge-settlement.md)
  — the formalized Intake Record + triage (your deliverable's shape).

> Note the golden `01` was triaged and signed by a human PO (Rafael Souza), and
> even went through a real Discovery. **Your** triage section is a *draft*
> (flagged, see [`triage-drafting.md`](triage-drafting.md)) — the human steps
> (signature, dates, Discovery log/result) stay blank. Compare against it for
> *rationale quality and structure*, not for the human-only fields.

## What "good" looks like — the calibration checklist

**Problem statement — depth.** The golden brief states the pain concretely and
*without solutions*: "first-layer guest support is 100% human; SLA breached on
34% of tickets; queue hits 4h+ at peak; CSAT down to 3.8/5." It even splits a
two-headed demand into Problem A and Problem B. Thin output names a feature
("we need a chatbot"); good output names the pain a chatbot would relieve.

**Confidence — honest, mid-range, hinted.** The golden numbers are *not* a wall
of 95s:

| Section | Golden confidence | Why |
|---|---|---|
| Problem | 88 | sourced to a deck + meeting |
| Reach | 85 | direct + inferred; exact user counts not shared |
| Business impact | 72 | "estimates, not calculated" — hint says how to firm them |
| Urgency | 75 | "informal deadline, undocumented" |
| Constraints | 78 | PCI is the PO's assumption, not yet confirmed |

Match this texture: solid where it's solid, honestly soft where it's soft, with
a `hint` on every soft section saying what would raise it.

**Dispositions — used, not avoided.** The golden brief lands 5 answered, 2
inferred, 3 assumptions, 1 discovery. Several *blocking* items cleared the gate
via honest assumptions (PSP API, reservations API) — and the brief is still
`gateReady = true`. That is the model: "we don't know yet, here's the plan" is
readiness, not failure.

**Tensions — registered with resolutions.** The golden brief records "Impact
high + confidence 70 → accept as assumption, PO quantifies in RP" and "Urgency
high + Effort uncertain → if firm effort > 60 days, it's a business decision to
tell the partner." Your output should carry the same kind of registered tension,
not silently drop it.

**Triage rationale — defensible, traceable.** The golden `01` evaluates all 5
criteria with a rationale *and a basis/source* each (e.g. "data in Zendesk, 3
documented incidents, partner complaint emails"), then routes to Discovery
because three blocking unknowns prevent closing scope. Note how the decision is
*informed by* the evidence, and how the unknowns become a Discovery Brief. Your
draft should read with the same defensibility — and be flagged as a draft.

**CTO escalation — signalled with reason.** The golden record marks escalation
**Sim** because the demand touches payment split, idempotency, PSP integration,
reconciliation, and AI orchestration. Draft the same kind of reasoned signal.

## Quick self-check before writing the file

- [ ] Does the Problem describe **pain**, not a solution? (golden rule)
- [ ] Are all four blocking sections resolved or honestly disposed?
- [ ] Does every section carry `Confiança / Fonte / Status / Disposição / Hint`?
- [ ] Are confidence numbers honest and mid-range where evidence is soft, each with a real hint?
- [ ] Are assumptions and discovery items explicit, with owners / time-box?
- [ ] Are at least the obvious RICE-lite tensions surfaced and resolved?
- [ ] Is the triage a **flagged draft**, with criteria traced to evidence and a defensible routing rationale?
- [ ] If the draft routes to Discovery, is the Discovery Brief filled (and the human Log/Result left blank)?
- [ ] Does it read like the gold standard — a demand *understood* — rather than a thin form?

If any box is unchecked, you're not done: go back and either ask the missing
question or route the gap to an honest disposition.
