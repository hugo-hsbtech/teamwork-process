# Case: PokerPlan — Planning Poker SaaS Platform

## Scenario

PokerPlan is a B2B SaaS platform for agile planning ceremonies. The platform already has paying clients and is in a growth phase. This case illustrates two concurrent demands flowing through the operating model — from intake capture all the way to a complete **PRD** ready for handoff to the PM.

> **Artifact chain (mature model).** Each demand traverses: **00 Submitter Brief** (capture) → **01 Intake Record** (PO — triage) → **02 Readiness Package** (PO — rationalization) → **03 Technical Assessment** (CTO — only when there is an architectural escalation) → **04 PRD** (RP + TA merge, opens the downstream). See [`../../../templates/README.md`](../../../templates/README.md).

---

## Demands in this case

### Demand 1 — Queue Voting

**Client:** Banco Meridional (existing enterprise client, renewal in 90 days)
**Pain:** No mechanism to control the sequence of story estimations or hide votes until reveal.
**Priority:** High
**Architectural escalation:** No → **no Technical Assessment** (PRD formed from RP alone)

| Document | Description |
|---|---|
| `00-submitter-brief-queue-voting.md` | Submitter Brief — captured by CS, with per-field confidence and `gateReady` |
| `01-intake-record-queue-voting.md` | Intake Record — PO triage (INT-2026-001), **Product Ready** decision, no Discovery |
| `02-readiness-package-queue-voting.md` | PO-only Readiness Package (RP-2026-001) — `freezeReady`; `TechAssessmentRef: Not requested` |
| `04-prd-queue-voting.md` | PRD (PRD-2026-001) — RP-only merge; opens the downstream |

---

### Demand 2 — Room Access Control

**Client:** Construtora Ágil (pre-close, deal contingent on the feature)
**Pain:** No access control, anonymity, or role differentiation within a planning room.
**Priority:** High
**Architectural escalation:** Yes — CTO produced a dedicated **Technical Assessment** (participant data model, multi-tenancy, Azure AD OIDC, LGPD routing).

| Document | Description |
|---|---|
| `00-submitter-brief-access-control.md` | Submitter Brief — captured by Sales, with `gateReady` |
| `01-intake-record-access-control.md` | Intake Record — PO triage (INT-2026-002), **Discovery → Product Ready**, Discovery Brief filled in |
| `02-readiness-package-access-control.md` | PO-only Readiness Package (RP-2026-002) — product only; references the TA via `TechAssessmentRef` |
| `03-technical-assessment-access-control.md` | CTO Technical Assessment (TA-2026-002) — feasibility, architecture, ADRs, firm cost |
| `04-prd-access-control.md` | PRD (PRD-2026-002) — RP + Technical Assessment merge; opens the downstream |

---

## Downstream artifacts

| Document | Owner | Description |
|---|---|---|
| `05-execution-plan.md` | PM | Capacity assessment, demand sequencing, milestone map, sprint structure, escalation triggers |
| `06.1-product-backlog-queue-voting.md` | Tech Leads | Epics + stories + acceptance criteria for Queue Voting, derived from PRD product user stories — reaches Definition of Ready |
| `06.2-tech-backlog-queue-voting.md` | Tech Lead | ADRs, tasks, refined estimates, DoD, rollout strategy for Queue Voting — how to build |
| `07.1-product-backlog-access-control.md` | Tech Leads | Epics + stories + acceptance criteria for Access Control, derived from PRD product user stories — reaches Definition of Ready |
| `07.2-tech-backlog-access-control.md` | Tech Lead | ADRs, tasks, refined estimates, DoD, rollout strategy for Access Control — how to build |

> Backlogs and the execution plan receive the **PRD** (`Linked PRD`), not the RP in isolation.

---

## Process status

Both demands completed the Intake Layer and are approved for handoff to the PM.

```text
[INT-2026-001] Queue Voting (RP v2 — rejected once, resubmitted)
  00 Brief (CS) → 01 Triage [Product Ready] → 02 RP v1 rejected → RP v2 freezeReady
    → 04 PRD (no TA) → 05 Execution Plan ✓ → Backlogs ✓ → In dev (Sprint 1–2)
    → Projected release: 2026-04-26

[INT-2026-002] Room Access Control (RP v1 — approved directly after Discovery)
  00 Brief (Sales) → 01 Triage [Discovery 7d → Product Ready] → 03 Technical Assessment (CTO)
    ‖ 02 RP → 04 PRD (RP + TA) → 05 Execution Plan ✓ → Backlogs ✓ → In dev (Sprint 1–5)
    → Projected release: 2026-06-05 (revised from 2026-05-30 after Tech Lead refinement)
```

**INT-2026-002 went through Discovery** before it could be rationalized. Three integration unknowns were identified at intake and had to be resolved before scope could be defined (full log lives in `01-intake-record-access-control.md`):

| Unknown | Resolved by | Outcome |
|---|---|---|
| Azure AD / OIDC integration feasibility | CTO technical spike | Feasible — added to scope |
| Jira integration requirement | Client call | Not required — moved to backlog |
| LGPD data residency posture | CTO infrastructure review | Non-compliant — Option C added to scope |

---

## Key differences between the two cases

| Dimension | Queue Voting | Room Access Control |
|---|---|---|
| CTO escalation | No — no Technical Assessment | Yes — dedicated Technical Assessment (TA-2026-002) |
| Went through Discovery | No | Yes — 3 integration unknowns |
| Architectural complexity | Low | High |
| Effort estimate | 14 days | 25 days (firmed by CTO in Technical Assessment) |
| Security considerations | Vote hiding (server-enforced) | Full access model + OIDC auth + LGPD routing |
| Risk profile | Low | High |
| Deal type | Renewal retention | Pre-close blocker |
| Scope risk | Low | High (LGPD + client-side Azure AD dependency) |
| External dependencies | None | Client must register app in Azure AD portal |
