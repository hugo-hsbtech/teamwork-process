# Readiness Package — [Demand Name]

> The Readiness Package (RP) is the **product definition of ready** — the PO's product output, written **alone**. It is a complete, self-contained document: vision, problem, scope, rules, user stories, NFRs, edge cases, criteria, and metrics. **The RP does not contain sections authored by the CTO.** The technical assessment lives in a separate artifact — the [Technical Assessment](./03-technical-assessment.md) (CTO) — which the RP merely **references** (see "Technical Assessment Reference"). The merge of the two happens in the [PRD](./04-prd.md), and it is the PRD — not the RP — that opens the downstream. See [`personas/02-po.md` §2 and §6.2](../personas/02-po.md).
>
> The RP **inherits the confidence layer** from the linked Intake Record ([`01-intake-record.md`](./01-intake-record.md)): what entered as an assumption, Discovery unknown, or delegated answer does not disappear in rationalization — it is resolved, or carried forward explicitly (see "Inherited readiness"). The *projected* values (especially the Success Metrics) carry confidence and become the baseline that [`../metrics.md`](../metrics.md) compares against post-delivery actuals.

## Metadata

| Field | Value |
|---|---|
| **Package ID** | RP-YYYY-NNN |
| **Version** | v1 |
| **Linked Intake** | INT-YYYY-NNN |
| **Owner** | [Name] (PO) |
| **Demand nature** | Greenfield / Brownfield / Hybrid (inherited from Intake) |
| **Knowledge base** | [`tech-landscape-[system].md`](./tech-landscape.md) · Partial · To create · N/A (greenfield) |
| **CTO escalation** | Not required — no architectural impact / Yes — Technical Assessment TA-YYYY-NNN |
| **Status** | Draft |
| **Freeze date** | — |

## Revision History

| Version | Date | Author | Status | Summary |
|---|---|---|---|---|
| v1 | YYYY-MM-DD | [Name] (PO) | Draft | Initial submission. |

---

## Inherited readiness and open dispositions

> Summary of what the Intake delivered and what remains *soft* at the entry to execution. Assumptions, unknowns, and delegated answers that survived rationalization must be visible — not buried in the sections. See [`../personas/01-submitter.md` §6](../personas/01-submitter.md).

| Field | Value |
|---|---|
| **Readiness Score at Intake handoff** | __ % |
| **Assumptions still to validate** | [list or —] |
| **Discovery unknowns** | [resolved / still open — ] |
| **Delegated requirements (with owner)** | [list or —] |

> If an assumption carried here proves false during execution, the demand must be reassessed — the same re-triage trigger from the intake applies downstream.

---

## Section 1 — Executive Summary  ·  *(blocks freeze)*

> 2–4 short paragraphs. What is the problem, what will be built, and what is the expected business outcome.

[Summary here]

---

## Section 2 — Context and Problem (the pain, not the solution)  ·  *(blocks freeze)*

> **Golden rule:** problem before solution. If this section describes a solution instead of the problem, it is not satisfied — the same principle the Submitter applies to their requirement 1.

### Current State

[How the system/product behaves today]

### Limitations

- [Limitation 1]
- [Limitation 2]

### Customer Pain

[Who feels the pain, how it is experienced day to day]

### Business Impact

- [Quantified impact — revenue, retention, efficiency, etc.]

---

## Section 3 — Objectives and Expected Outcome  ·  *(blocks freeze)*

Numbered objectives this delivery must achieve. Each objective must be observable after the release.

1. [Objective 1]
2. [Objective 2]
3. [Objective 3]

---

## Section 4 — Impacted Personas / Jobs-to-be-done  ·  *(blocks freeze)*

| Persona | Job-to-be-done | Impact |
|---|---|---|
| [Persona 1] | [What they are trying to accomplish] | [How they are impacted] |

---

## Section 5 — Included and Excluded Scope  ·  *(blocks freeze)*

> Protects the downstream from scope creep.

### Included

- [Item 1]
- [Item 2]

### Excluded

- [Item 1 — with rationale, if useful]
- [Item 2]

### Deferred (future phases)

- [Item 1 — feeds the Roadmap, Section 14]

---

## Section 6 — Business Rules and Flows  ·  *(blocks freeze)*

Describe the rules, validations, and state transitions that govern this feature. Use subsections per rule block when useful.

### [Rule Block 1]

1. [Rule 1]
2. [Rule 2]

### State Transition Flow

```text
[Text diagram or reference to diagram]
```

---

## Section 6.5 — User Journey(s) (end-to-end)  ·  *(blocks freeze)*

> **The missing piece between "what" and "the stories."** A product definition needs a sense of what the user does **end to end** — the complete path, not fragments. User Stories (Section 7) **derive** from the steps of this journey; without it, stories float loose and the downstream (human or AI agent) cannot see the flow it needs to implement. This is **PO** territory — product, not detailed UX (fine-grained screen flows remain downstream). Standard: *user journey map* (the experience) and, when there is relevant backstage, *service blueprint*.
>
> **Compression rule:** small improvement = a 3–5 step happy-path journey, no service blueprint. The contract is a ceiling, not a floor.

### Main journey (happy path) — [Journey name]

> The steps the user takes to reach the value outcome. Each step generates (or validates) a User Story in Section 7.

| # | Trigger / User action | Expected outcome | Touchpoint / Screen | Precondition |
|---|---|---|---|---|
| 1 | [What the user does] | [What the system delivers/responds] | [Where it happens] | [What must be true before] |
| 2 | | | | |
| 3 | | | | |

### Alternative and exit paths

> Deviations, cancellations, empty states. Linked to Edge Cases (Section 9).

- **[Alternative path]:** [when it occurs → where it leads]
- **[Exit / cancellation]:** [what happens to the state]

### Service Blueprint *(optional — only when there is relevant backstage/ops/human integration)*

> Exposes what sustains the journey "behind the scenes." Skip when the journey is purely self-service.

| Layer | [Step 1] | [Step 2] | [Step 3] |
|---|---|---|---|
| **Frontstage** (what the user sees) | | | |
| **Backstage** (internal actions/team) | | | |
| **Supporting systems** (services, data, third parties) | | | |

---

## Section 7 — User Stories + Acceptance Criteria  ·  *(blocks freeze)*

> One story per value block. Acceptance criterion **verifiable by a non-dev**, in Given/When/Then format, with specific limits (not "should work well"). It is the behavior contract that QA validates.

### ST-001 — [Story Name]

**As** [persona],
**I want** [action],
**so that** [benefit].

**Acceptance Criteria:**

- [ ] **Given** [context], **when** [action], **then** [observable and specific result]
- [ ] **Given** [context], **when** [action], **then** [observable and specific result]

---

## Section 8 — Non-Functional Requirements (NFRs)  ·  *(blocks freeze)*

> The #1 gap that causes rework. Fill in only the applicable dimensions (ISO/IEC 25010-style checklist) — do not force irrelevant ones. Here the PO describes the **quality requirement**; feasibility and the *how* belong to the Technical Assessment.

| Dimension | Requirement | How it will be verified |
|---|---|---|
| **Performance / Efficiency** | [e.g.: vote reveal propagates in < 500ms for all in the room] | [Measurement] |
| **Reliability** | [e.g.: target availability, behavior under failure] | |
| **Security** | [e.g.: hidden vote enforced server-side, no client trust] | |
| **Usability** | [e.g.: flow completed without training] | |
| **Compatibility** | [e.g.: browsers, devices, integrations] | |
| **Maintainability** | [e.g.: feature flag, minimum observability] | |

---

## Section 9 — Edge Cases and Failure Modes  ·  *(blocks freeze)*

> Error states, timeouts, permissions, concurrency. For AI features: model behavior and low confidence. First class — not a footnote.

- **[Edge case 1]**: [expected behavior]
- **[Failure mode 1]**: [what happens, how the system degrades]
- **[Concurrency case]**: [expected resolution]

---

## Section 10 — Success Metrics (primary · secondary · guardrail)  ·  *(blocks freeze)*

> These are the **projected** values — the baseline that [`../metrics.md`](../metrics.md) (layer 3, projected vs. actual) compares against post-rollout measurements. Include *leading* and *lagging* indicators and at least one **guardrail** (the metric that must not worsen). Each target carries projection confidence.

| Type | Metric | Target (projected) | Measurement window | Measurement (who/how) | Confidence |
|---|---|---|---|---|---|
| **Primary** | [Metric] | [Target] | [e.g.: 30 days post-release] | [Who measures and how] | __ |
| **Secondary** | [Metric] | [Target] | | | __ |
| **Guardrail** | [Metric that must not worsen] | [Limit] | | | __ |

---

## Section 11 — Success and Acceptance Criteria (for the release)  ·  *(blocks freeze)*

High-level indicators that define "done and valuable" for **this release** — distinct from the ongoing metrics in Section 10.

| Criterion | Type | Indicator | Target value |
|---|---|---|---|
| [Criterion 1] | Business / Operational / Quality / UX / Security / Compliance | [How to observe] | [Target] |

---

## Section 12 — Risks and Dependencies (product and business)  ·  *(blocks freeze)*

> **Technical** risks migrate to the CTO's Technical Assessment. Product, business, adoption, external, and compliance risks stay here.

| Risk | Type | Probability | Impact | Mitigation |
|---|---|---|---|---|
| [Risk 1] | Business / Product / Adoption / External / Compliance | High / Medium / Low | High / Medium / Low | [Mitigation] |

**Dependencies (product/business):**
- [Dependency 1]
- [Dependency 2]

---

## Section 13 — Preliminary Effort and Cost Assessment

> Internal use only. **Preliminary** — the PO's rough estimate to support sequencing. The **firm** number comes from the CTO in the Technical Assessment and, later, from the Tech Lead in the Tech Backlog. Not a contractual commitment or client-facing material.

| Area | Preliminary estimate | Confidence |
|---|---|---|
| [Backend / Frontend / QA] | [X days] | __ |
| **Preliminary total** | **X days** | |

**Cost signals to confirm with the CTO:** [new infra, paid third parties, recurring opex — or "none apparent"]

---

## Section 14 — Suggested Roadmap

### MVP (this release)

- [Item 1]
- [Item 2]

### Phase 2 (future backlog)

- [Item 1]

### Phase 3 (future backlog)

- [Item 1]

---

## Technical Assessment Reference  ·  *(blocks freeze if requested)*

> This is the **bridge** (`TechAssessmentRef`), not content. The RP references the CTO's verdict — it does not absorb it. The merge happens in the [PRD](./04-prd.md). See [`personas/02-po.md` §5 and §10](../personas/02-po.md).

| Field | Value |
|---|---|
| **Status** | Not requested / Requested / In progress / Signed off / Vetoed |
| **Feasibility verdict** | Feasible / Feasible with caveats / Infeasible as scoped / — |
| **Linked Technical Assessment** | TA-YYYY-NNN vX / N/A |
| **Hard constraints affecting scope** | [summary or —] |

> **Freeze gate:** the RP freezes when every `blocks freeze` section is resolved **and**, if the CTO was requested, `Status = Signed off`. It does not freeze with a pending assessment when one was requested. For a small improvement, the RP compresses to the spine (Problem → Target metric → Scope in/out → 3–5 acceptance criteria → NFRs at risk) — the contract is a ceiling, not a floor.
