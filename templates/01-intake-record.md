# Intake Record — [Demand Name]

> **This is the Intake Record — the formal artifact of the intake layer, authored by the PO.** It receives the [`00 Submitter Brief`](./00-submitter-brief.md) (`gateReady = true`), assigns the official ID `INT-YYYY-NNN`, and records the **PO's first act: triage** — the routing decision (Product Ready / Discovery / Backlog / Reject) with a traceable rationale. See [`personas/02-po.md` §3 and §6.1](../personas/02-po.md).
>
> **It does not rewrite the Submitter's capture** — it **references** brief 00 and consolidates it. The product deepening (vision, scope, rules, metrics) is the **PO's second act** and lives in the [`02 Readiness Package`](./02-readiness-package.md).
>
> **Journey:** [`00 Submitter Brief`](./00-submitter-brief.md) → `01 Intake Record (PO — triage)` → [`02 Readiness Package (PO)`](./02-readiness-package.md) → [`03 Technical Assessment (CTO)`](./03-technical-assessment.md) → [`04 PRD (PO+CTO → PM)`](./04-prd.md).

## Metadata

| Field | Value |
|---|---|
| **Record ID** | INT-YYYY-NNN |
| **Version** | v1 |
| **Submitter Brief (origin)** | [`00-submitter-brief-[name].md`](./00-submitter-brief.md) |
| **Submitted by (Submitter)** | [Name] ([Sales / CS / CEO / Marketing]) |
| **Triaged by (PO)** | [Name] (PO) |
| **Record date** | YYYY-MM-DD |
| **Triage date** | YYYY-MM-DD |
| **Status** | New / In Triage / Triaged |
| **Linked Readiness Package** | RP-YYYY-NNN (after Product Ready) |

## Revision History

| Version | Date | Event | Summary |
|---|---|---|---|
| v1 | YYYY-MM-DD | Intake formalized | [Brief description] |

---

## Readiness received from the Submitter

> Snapshot inherited from brief 00 at handoff. The PO does not recalculate the capture — records what was received and what remains *soft*.

| Field | Value |
|---|---|
| **Readiness Score at handoff** | __ % |
| **Blocking requirements** | All resolved by honest disposition (`gateReady`) — Yes / No |
| **Open dispositions** | __ assumptions to validate · __ discovery · __ deferred |

---

## Consolidated demand

> Single-screen summary validated by the PO against brief 00 (not a re-entry — it is the PO's reading). The full detail, with per-field confidence, is in [`00`](./00-submitter-brief.md).

| Dimension | Summary | Inherited confidence |
|---|---|---|
| **Problem** (the pain, not the solution) | [Summary] | __ |
| **Reach** (who is impacted) | [Personas/segments] | __ |
| **Business impact** | [Quantified where possible] | __ |
| **Urgency** (why now) | [Window + cost of waiting] | __ |
| **Declared priority** | Critical / High / Medium / Low | — |

---

## Triage — routing decision  ·  *(PO's Act 1)*

> The PO evaluates each criterion (all evaluated = can complete triage) and then makes **one** path decision with a mandatory rationale. See [`personas/02-po.md` §6.1](../personas/02-po.md).

### Criteria evaluated

| # | Criterion | Verdict | Rationale | Basis / Source |
|---|---|---|---|---|
| 1 | Is it a real problem (not an isolated symptom)? | Yes / No | [why] | [intake / data] |
| 2 | Is it recurring / does it have volume? | Yes / No | | |
| 3 | Does it fit the product vision? | Yes / No | | |
| 4 | What is the technical and business impact? | High / Medium / Low | | |
| 5 | Do urgency and impact justify action now? | Yes / No | | |

### Path decision

| Field | Value |
|---|---|
| **Decision** | Product Ready / Discovery / Opportunity Backlog / Reject |
| **Rationale** | [Why this decision — defensible] |
| **Reversible?** | Yes (Discovery/Backlog — side door) / No (Reject — closes with rationale) |
| **Submitter notified** | Yes — YYYY-MM-DD |

> **Triage gate:** all criteria evaluated (does not force a specific decision — forces the decision to be **informed**). Only `Product Ready` opens Act 2 (rationalization → RP). All other paths end the demand's passage through the PO at this point.

---

## Demand nature and Knowledge Base  ·  *(classification — originates here)*

> **Why this section exists.** Before any technical assessment, it is necessary to know whether the demand builds **new software** or modifies **existing software** — because the two require opposite reasoning in the Technical Assessment: greenfield *decides* the foundation (stack, ADRs, structure); brownfield *discovers* what already exists (patterns, integrations, debt). Without this classification, the CTO is guessing. The AI/engineering layer **has no implicit knowledge of the code** — it depends on what is declared here. See [`03-technical-assessment.md`](./03-technical-assessment.md).

| Field | Value |
|---|---|
| **Nature** | Greenfield (new software/module) · Brownfield (modifies existing software) · Hybrid (new module within an existing system) |
| **Affected system(s)** | [Product/service/module name — or "new" if greenfield] |
| **Knowledge base exists?** | Yes (reference below) · Partial · No → requires documentation discovery |
| **Knowledge Base reference** | [`tech-landscape-[system].md`](./tech-landscape.md) · link · — |

> **Greenfield** → the Technical Assessment will **define** the technical foundation, and the foundational ADRs will **seed** a new Knowledge Base.
> **Brownfield/Hybrid** → the Technical Assessment **references** the existing Knowledge Base; if it does not exist (or is incomplete), the first technical task is to **create it** (document the current system) — register as Discovery.

---

## Architectural escalation to the CTO

**Required:** Yes / No — [brief rationale]

> If Yes, the escalation and Technical Assessment occur during rationalization (RP). The **demand nature** (above) travels with it and determines the assessment path. See [`interactions/05-po-to-cto.md`](../interactions/05-po-to-cto.md).

---

## Assumptions validated at triage

> Which assumptions from brief 00 the PO reviewed and the verdict for each. Surviving assumptions travel forward explicitly.

| Assumption (from brief 00) | PO verdict | To validate with |
|---|---|---|
| [Assumption] | Accepted / Rejected / To validate | [Who] |

---

## Recognized constraints

> Constraints the PM must consider from day one (inherited from the brief, validated here).

| Constraint | Type | PO note |
|---|---|---|
| [Constraint] | Time / Budget / Legal / Technical / Scope / External | [Note] |

---

## Discovery Brief

> Fill in only if the path decision is **Discovery**. Otherwise remove this section.

### What is missing

| # | Unknown | Who can answer | Method |
|---|---|---|---|
| 1 | [Unknown] | [PO / CTO / Client / Sales] | [Technical spike / Client call / Infrastructure review] |

**Discovery time-box:** [N days] (YYYY-MM-DD → YYYY-MM-DD)

---

### Discovery Log

#### YYYY-MM-DD — [Event]

[Summary of what was done, finding, decision, or blocker]

---

### Discovery Outcome

| # | Unknown | Resolution | Impact on scope |
|---|---|---|---|
| 1 | [Unknown] | [Resolution] | Added / Removed / Moved to backlog |

**New path decision:** Discovery → Product Ready / Rejected / Opportunity Backlog

**Discovery closed:** YYYY-MM-DD ([N days — within / outside the time-box])

---

## Handoff

- **If `Product Ready`:** the PO begins **rationalization** → [`02 Readiness Package`](./02-readiness-package.md).
- **If `Discovery`:** opens the Discovery Brief above; upon closing, re-triages.
- **If `Backlog` / `Reject`:** ends the demand's passage through the PO; Submitter notified with rationale.
