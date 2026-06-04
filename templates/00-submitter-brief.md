# Submitter Brief — [Demand Name]

> **This is the Submitter's document** — the first artifact in the journey (`00`) and the Submitter persona's deliverable. It **instantiates** the model from [`personas/01-submitter.md`](../personas/01-submitter.md): the reasoning (compliance requirements, ToDo generation, score formula) lives in the persona; this document **instances** it per demand, in the **Submitter's language** — problem, value, pain, opportunity. Each answer carries how solid it is and where it came from: the confidence layer travels *with* the capture.
>
> **Journey:** `00 Submitter Brief` → [`01 Intake Record (PO — triage)`](./01-intake-record.md) → [`02 Readiness Package (PO)`](./02-readiness-package.md) → [`03 Technical Assessment (CTO)`](./03-technical-assessment.md) → [`04 PRD (PO+CTO → PM)`](./04-prd.md). See [`README.md`](./README.md).
>
> **Nothing precedes this document as an artifact.** What comes before is **raw signal** — a call, a ticket, an email, an audio clip, a conversation about a deal — which is **not an artifact** (see [`../README.md`](../README.md)). That signal enters *here* as evidence/source (disposition `inferred`, with `source`); it is the **capture** that transforms it into this first formal document.
>
> **Handoff:** freezes when `gateReady = true` (every blocking requirement resolved by an honest disposition) and is handed off to the **PO**, who formalizes and triages it in the [`01 Intake Record`](./01-intake-record.md).

## The two lenses (every demand is read through both simultaneously)

> See [`personas/01-submitter.md` §2](../personas/01-submitter.md). ToDos live where the lenses intersect: "given what *this* demand means, what does the contract still need?"

| Lens | What it is | Where it appears in this document |
|---|---|---|
| **Contract** (deterministic) | The fixed compliance requirements every demand must satisfy to advance | **Readiness Summary** + the numbered requirements (score + pending items) |
| **Semantic** (contextual) | What *this* demand means: the real pain, its type, its value thesis, its unknowns | **Problem Statement**, **Impact**, **Value Indicators** and their tensions |

## Metadata

| Field | Value |
|---|---|
| **Demand** | [Name] |
| **Submitted by** | [Name] ([Sales / CS / CEO / Marketing]) |
| **Capture date** | YYYY-MM-DD |
| **Status** | In capture / Ready for handoff (`gateReady`) |
| **Linked Intake Record** | INT-YYYY-NNN (assigned by the PO at triage) |

## Revision History

| Version | Date | Event | Summary |
|---|---|---|---|
| v1 | YYYY-MM-DD | Capture started | [Brief description] |

---

## Readiness Summary

> Snapshot of the capture. The score is derived from the requirements below; `low_confidence` counts as partial. The demand is handed off to the PO only when all blocking requirements are resolved (`gateReady = Yes`).

| Field | Value |
|---|---|
| **Readiness Score** | __ % |
| **Gate unlocked (gateReady)** | Yes / No |
| **Pending blocking requirements** | [list or —] |
| **Dispositions** | __ answered · __ inferred · __ assumptions · __ discovery · __ deferred |

### Confidence legend (applies to each answered section)

| Attribute | Values |
|---|---|
| **Confidence** | 0–100 |
| **Source** | Direct Submitter · Attached document (p.X) · Inferred · Assumption · Other stakeholder |
| **Status** | Empty · Low confidence · Resolved |
| **Disposition** | Answered · Inferred · Assumption (to validate) · Discovery (to investigate) · Deferred (owner: __) |
| **Hint** | Why confidence is low / what would raise it |

> **"I don't know" does not block.** A requirement reaches readiness through any honest disposition — including "nobody knows yet, and this is the plan" (Discovery) or "we are assuming X" (Assumption). See [`personas/01-submitter.md` §6](../personas/01-submitter.md).

---

## Origin  ·  *(Requirement 2 — Originator and context)*

| Field | Value |
|---|---|
| **Source** | Client / Internal / Market / Support |
| **Client / Requester** | [Name] |
| **Originator and context** | [Who raised it and in what situation — e.g.: "COO, Q2 planning meeting"] |
| **Reported via** | [Channel — call, email, support ticket, etc.] |

`Confidence:` __ · `Source:` __ · `Status:` __ · `Disposition:` __ · `Hint:` __

---

## Type

- [ ] Feature
- [ ] Bug
- [ ] Improvement
- [ ] Compliance
- [ ] Integration
- [ ] Operational

> **Tip (seeds the PO's classification):** does this look like a **new capability** (something that doesn't exist today) or an adjustment to **something that already works**? No certainty needed — it is just a signal that helps the PO classify the demand as greenfield/brownfield at triage.

**Touches:** New capability / Something existing / Don't know

---

## Problem Statement  ·  *(Requirement 1 — blocks gate)*

> What is the existing pain? Describe the problem, not the solution. If the statement contains a proposed solution, it is returned for reformulation.

[Describe the problem here]

`Confidence:` __ · `Source:` __ · `Status:` __ · `Disposition:` __ · `Hint:` __

---

## Who Is Impacted (Reach)  ·  *(Requirement 3 — blocks gate)*

> Personas, segments, or teams that feel this pain. This is the "Reach" of the value indicators.

| Persona / Segment | How they are impacted |
|---|---|
| [Persona] | [Impact] |

`Confidence:` __ · `Source:` __ · `Status:` __ · `Disposition:` __ · `Hint:` __

---

## Business Impact  ·  *(Requirement 4 — blocks gate)*

> Use the applicable dimensions. Revenue, Retention, Operational, Competitive, Compliance, Market are the most common. Do not force irrelevant dimensions. Quantify when possible.

| Dimension | Detail |
|---|---|
| **Revenue** | [Quantify — ARR expansion, blocked deal, etc.] |
| **Retention** | [Churn risk or impact on renewal] |
| **Operational** | [Impact on workarounds, time, efficiency] |
| **Competitive** | [Gap or lost differentiator] |
| **Compliance** | [Legal or regulatory requirements] |

`Confidence:` __ · `Source:` __ · `Status:` __ · `Disposition:` __ · `Hint:` __

---

## Value Indicators (RICE-lite)

> A mirror to challenge thinking — **not** an automatic ranking. Score each one (Low / Medium / High). Confidence reuses the column above — do not re-score. Effort stays *soft* (the Submitter's rough estimate, confirmed later by the CTO).

| Indicator | Score | Rationale (in their language) | Confidence |
|---|---|---|---|
| **Impact** ("how much does it move the business?") | L / M / H | [why] | __ |
| **Reach** ("how many people feel this?") | L / M / H | [why] | __ |
| **Urgency** ("why now? cost of waiting?") | L / M / H | [why] | __ |
| **Effort** *(soft — deferred to the CTO)* | L / M / H | [initial rough estimate] | low_confidence |

> **Tensions to record** (they challenge consistency of thinking): High impact + low confidence? High urgency + low impact? High reach + thin per-user impact? Note the resolution of each tension — sharpening the answer also raises readiness.

---

## Urgency  ·  *(Requirement 5)*

**Deadline / window:** [When and why]

**Cost of waiting:** [What happens if not now]

`Confidence:` __ · `Source:` __ · `Status:` __ · `Disposition:` __ · `Hint:` __

---

## Evidence and Documents  ·  *(Requirement 6)*

> Attachments or prior conversations that support the demand. Source for AI pre-filling.

| Document / Conversation | Type | Relevance |
|---|---|---|
| [Name] | [PDF / call / thread] | [What it supports] |

`Confidence:` __ · `Source:` __ · `Status:` __ · `Disposition:` __ · `Hint:` __

---

## Stakeholders  ·  *(Requirement 8)*

| Stakeholder | Role | Interest | Influence |
|---|---|---|---|
| [Name] | [Sponsor, End User, Impacted Team, Decision Maker] | [What they want] | High / Medium / Low |

`Confidence:` __ · `Source:` __ · `Status:` __ · `Disposition:` __ · `Hint:` __

---

## Assumptions

Conditions assumed to be true at capture. If an assumption proves false, the demand must be re-triaged. Assumptions are a **valid disposition** for requirements without a direct answer.

1. [Assumption 1] — `to validate with:` __
2. [Assumption 2] — `to validate with:` __

---

## Constraints  ·  *(Requirement 7)*

Conditions that limit the solution space and must be respected regardless of what is built.

| Constraint | Type | Detail |
|---|---|---|
| [Constraint 1] | Time / Budget / Legal / Technical / Scope / External | [Detail] |

`Confidence:` __ · `Source:` __ · `Status:` __ · `Disposition:` __ · `Hint:` __

---

## Preliminary Risks

Risks identified at capture — before the technical assessment. Full registration belongs to the Readiness Package.

| Risk | Category | Initial Assessment |
|---|---|---|
| [Risk 1] | Technical / Business / External / Security / Deadline / Product | [High / Medium / Low + note] |

---

## High-Level Scope Boundary

**In:** [What is clearly within scope for this release.]

**Out:** [What is clearly out of scope — explicit exclusions to prevent scope creep.]

**Deferred:** [What can be addressed in a future phase — feeds the opportunity backlog.]

---

## Priority

**Level:** Critical / High / Medium / Low

**Rationale:** [Why this level]

---

## Success Criteria

High-level indicators that define "done and valuable." Detailed measurable targets belong to the Readiness Package; these are the signals at the capture level. **They serve as the projected baseline** for post-handoff tracking (see [`metrics.md`](../metrics.md)).

| Criterion | Type | Indicator | Projected value |
|---|---|---|---|
| [Criterion 1] | Business / Operational / Quality / UX / Security / Compliance / Process | [How to observe] | [Target — e.g.: $78k/year] |
