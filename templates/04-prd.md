# PRD — [Demand Name]

> The PRD (Product Requirements Document) is the **merge** of the [Readiness Package](./02-readiness-package.md) (product, authored by the PO) with the [Technical Assessment](./03-technical-assessment.md) (technical, authored by the CTO). It is the **only artifact that opens the downstream** — delivered to the **PM**. Each half maintains clear authorship: the PO does not write the technical part, the CTO does not rewrite the product. The PRD stitches, reconciles, and exposes to the PM what they need to plan. See [`personas/02-po.md` §2, §10, and §11](../personas/02-po.md).
>
> **When there was no CTO escalation:** the PRD is formed from the RP alone; Part B references "no Technical Assessment — no architectural impact."
>
> `PRD = RP (PO) + Technical Assessment (CTO)`

## Metadata

| Field | Value |
|---|---|
| **PRD ID** | PRD-YYYY-NNN |
| **Version** | v1 |
| **Linked RP** | RP-YYYY-NNN vX |
| **Linked Technical Assessment** | TA-YYYY-NNN vX / N/A — no escalation |
| **Linked Intake** | INT-YYYY-NNN |
| **Demand nature** | Greenfield / Brownfield / Hybrid |
| **Knowledge base** | [`tech-landscape-[system].md`](./tech-landscape.md) · To create · N/A (greenfield) |
| **Authors** | [Name] (PO) + [Name] (CTO) |
| **Status** | Draft / In PM Review / Accepted / Returned |
| **Delivered to PM on** | — |

## Revision History

| Version | Date | Author | Status | Summary |
|---|---|---|---|---|
| v1 | YYYY-MM-DD | PO + CTO | Draft | Initial RP + TA merge. |

---

## Sign-off

> The merge only closes with dual sign-off. The feasibility verdict comes from the Technical Assessment.

| Role | Name | Verdict | Date |
|---|---|---|---|
| **PO** (product) | [Name] | RP Frozen | YYYY-MM-DD |
| **CTO** (technical) | [Name] | Feasible / Feasible with caveats / N/A | YYYY-MM-DD |

---

## Combined Executive Summary

> 2–4 paragraphs: the problem, what will be built, the technical feasibility, and the expected business outcome. The one-page view for CEO/CFO/PM.

[Summary here]

---

## Part A — Product Definition (from the Readiness Package · PO)

> Summary of the key RP sections. The complete source document is [`RP-YYYY-NNN`](./02-readiness-package.md); here is what the PM needs to plan, without rewriting the entire RP.

### A.1 Objectives and Expected Outcome

1. [Objective 1]

### A.2 Scope (final)

**Included:** [items]
**Excluded:** [items]
**Deferred:** [items]

### A.3 Personas / Jobs-to-be-done

| Persona | Job | Impact |
|---|---|---|
| [Persona] | [Job] | [Impact] |

### A.4 User Journey (end-to-end)

> Summary of the happy path from [RP, Section 6.5]. What the user does end to end — the flow from which User Stories derive. The complete source document (with alternative paths and service blueprint) is in the RP.

| # | User action | Expected outcome | Touchpoint |
|---|---|---|---|
| 1 | [Action] | [Outcome] | [Where] |

### A.5 Business Rules and Flows

[Summary or reference to the RP sections]

### A.6 User Stories + Acceptance Criteria

| ID | Story | Acceptance criterion (Given/When/Then) |
|---|---|---|
| ST-001 | [As… I want… so that…] | [Given/When/Then] |

### A.7 Non-Functional Requirements (NFRs)

| Dimension | Requirement | Verification |
|---|---|---|
| [Performance / Security / …] | [Requirement] | [How] |

### A.8 Edge Cases and Failure Modes

- [Edge case / failure → expected behavior]

---

## Part B — Technical Definition (from the Technical Assessment · CTO)

> Summary of the TA. The complete source document is [`TA-YYYY-NNN`](./03-technical-assessment.md). Fill in "N/A — no architectural escalation" when there was no CTO involvement.

### B.1 Feasibility Verdict

| Field | Value |
|---|---|
| **Verdict** | Feasible / Feasible with caveats / Infeasible as scoped / N/A |
| **Caveats** | [—] |

### B.2 Nature and Technical Landscape

> The terrain on which engineering decides. Brownfield → summary of the **current state** (patterns, integrations, debt) with link to [`tech-landscape`](./tech-landscape.md). Greenfield → summary of the **foundation** (chosen stack + target architecture). Summary of the TA; full source in [`TA-YYYY-NNN`](./03-technical-assessment.md).

| Field | Value |
|---|---|
| **Nature** | Greenfield / Brownfield / Hybrid |
| **Knowledge base** | [reference or "created in this cycle"] |
| **Current state (brownfield)** | [Systems/patterns/integrations touched — or N/A] |
| **Foundation (greenfield)** | [Stack + target architecture — or N/A] |

### B.3 Architectural Impact and Integrations

| Area / System | Impact | Note |
|---|---|---|
| [Data model / Integration / …] | [Description] | |

### B.4 NFR Feasibility

> The CTO's response to the RP quality requirements (§8): each NFR is feasible and how. Summary of the TA.

| NFR (from RP §8) | Feasible? | Approach | Caveat |
|---|---|---|---|
| [Requirement] | Yes / With caveats / No | [How] | [—] |

### B.5 Key Alternatives Considered

> The rationale behind decisions — what was discarded and why. Only the alternatives the PM needs to know.

| Alternative | Why it was NOT chosen |
|---|---|
| [Approach] | [Reason] |

### B.6 Hard Constraints

| Constraint | Effect on scope |
|---|---|
| [Constraint] | [What it limits] |

### B.7 ADRs (architectural level)

| # | Decision | CTO sign-off |
|---|---|---|
| ADR-001 | [Decision] | ✓ |

---

## Scope Reconciliation

> If the CTO vetoed or imposed constraints that changed the RP scope, record here what changed and the final agreement between PO and CTO. If nothing changed: "RP scope maintained in full."

| Original item (RP) | Change after Technical Assessment | Reason |
|---|---|---|
| [Item] | Added / Removed / Re-scoped | [Constraint or veto] |

---

## Consolidated Risk and Dependency View

> Product/business risks (from RP, Section 12) + technical risks (from the TA) in a single table — the PM plans against this view.

| Risk | Origin | Type | Probability | Impact | Mitigation |
|---|---|---|---|---|---|
| [Risk] | RP / TA | Product / Business / Technical / External / Compliance | High/Medium/Low | High/Medium/Low | [Mitigation] |

**Known external dependencies:** [client action, procurement, third-party integration — or "None"]

---

## Effort and Cost (firm)

> From the Technical Assessment (replaces the RP preliminary estimate). Internal use only — not a contractual commitment or client-facing material.

| Area | Firm estimate | Seniority |
|---|---|---|
| [Backend / Frontend / QA] | [X days] | [Seniority] |
| **Total** | **X days** | |

**Infra / Third parties / Recurring opex:** [summary or "None"]

---

## Inherited Readiness and Open Dispositions

> What the PM needs to see before planning: assumptions to validate, Discovery unknowns, and delegated answers that survived to this point. If an assumption proves false during execution, the demand is reassessed (downstream re-triage trigger).

| Field | Value |
|---|---|
| **Assumptions still to validate** | [list or —] |
| **Discovery unknowns** | [resolved / open] |
| **Delegated requirements (with owner)** | [list or —] |

---

## Success Criteria and Metrics (projected)

> Projected baseline that [`../metrics.md`](../metrics.md) (layer 3, projected vs. actual) compares against post-rollout measurements.

| Type | Metric | Target (projected) | Window | Confidence |
|---|---|---|---|---|
| **Primary** | [Metric] | [Target] | [Window] | __ |
| **Guardrail** | [Metric that must not worsen] | [Limit] | | __ |

---

## Handoff to PM — Acceptance Gate

> The PM has **explicit authority to reject** the PRD and return it with specific gaps (not a generic "needs more detail"). The rejection and reason are entered in the Revision History; the PO (or CTO, depending on the gap) addresses only the gaps and increments the version. See [`interactions/07-po-to-pm.md`](../interactions/07-po-to-pm.md).

| Delivery checklist | OK? |
|---|---|
| RP frozen and referenced | ☐ |
| Technical Assessment signed off (or N/A justified) | ☐ |
| Scope reconciliation recorded | ☐ |
| Risks and dependencies consolidated | ☐ |
| External dependencies explicit | ☐ |
| Open dispositions visible | ☐ |

**Priority and business context:** [why this demand, now]
