# Case: PokerPlan — Startup Planning Poker Platform

## Scenario

PokerPlan is a B2B SaaS platform for agile planning ceremonies. The platform already has paying clients and is in a growth phase. This case illustrates two concurrent demands flowing through the operational model — from intake capture to a complete Readiness Package ready for PM handoff.

---

## Demands in This Case

### Demand 1 — Queue Voting

**Client:** Banco Meridional (existing enterprise client, renewal in 90 days)
**Pain:** No mechanism to control the sequence of story estimation or hide votes until reveal.
**Priority:** High
**Architectural escalation:** No

| Document | Description |
|---|---|
| `intake-queue-voting.md` | Structured intake record registered by CS |
| `readiness-package-queue-voting.md` | Full 12-section Readiness Package — ready for PM |

---

### Demand 2 — Room Access Control

**Client:** Construtora Ágil (pre-close, deal contingent on feature)
**Pain:** No access control, anonymity, or role differentiation within a planning room.
**Priority:** High
**Architectural escalation:** Yes — CTO reviewed participant data model and multi-tenancy implications.

| Document | Description |
|---|---|
| `intake-access-control.md` | Structured intake record registered by Sales |
| `readiness-package-access-control.md` | Full 12-section Readiness Package with CTO architectural notes |

---

## Downstream Artifacts

| Document | Owner | Description |
|---|---|---|
| `05-execution-plan.md` | PM | Capacity assessment, demand sequencing, milestone map, sprint structure, escalation triggers |
| `06.1-product-backlog-queue-voting.md` | PO | Epics + stories + acceptance criteria for Queue Voting — what to build and for whom |
| `06.2-tech-backlog-queue-voting.md` | Tech Lead | ADRs, tasks, refined estimates, DoD, rollout strategy for Queue Voting — how to build it |
| `07.1-product-backlog-access-control.md` | PO | Epics + stories + acceptance criteria for Access Control — what to build and for whom |
| `07.2-tech-backlog-access-control.md` | Tech Lead | ADRs, tasks, refined estimates, DoD, rollout strategy for Access Control — how to build it |

---

## Process State

Both demands have completed the Intake Layer and are approved for PM handoff.

```text
[INT-2024-001] Queue Voting (RP v2 — rejected once, resubmitted)
  Intake → Triage → Rationalization → RP v1 rejected → RP v2 approved
    → Execution Plan ✓ → Breakdown Package ✓ → In development (Sprint 1–2)
    → Release target: 2024-04-26

[INT-2024-002] Room Access Control (RP v1 — approved directly after Discovery)
  Intake → Triage → Discovery [7 days] → CTO Assessment → Rationalization → RP v1 approved
    → Execution Plan ✓ → Breakdown Package ✓ → In development (Sprint 1–5)
    → Release target: 2024-06-05 (revised from 2024-05-30 after Tech Lead refinement)
```

**INT-2024-002 went through Discovery** before it could be rationalized. Three integration unknowns were identified at intake and had to be resolved before scope could be defined:

| Unknown | Resolved by | Outcome |
|---|---|---|
| Azure AD / OIDC integration feasibility | CTO technical spike | Feasible — added to scope |
| Jira integration requirement | Client call | Not required — moved to backlog |
| LGPD data residency posture | CTO infrastructure review | Non-compliant — Option C added to scope |

---

## Key Differences Between the Two Cases

| Dimension | Queue Voting | Room Access Control |
|---|---|---|
| CTO escalation | No | Yes |
| Went through Discovery | No | Yes — 3 integration unknowns |
| Architectural complexity | Low | High |
| Effort estimate | 14 days | 25 days (revised up from initial estimate) |
| Security considerations | Vote concealment (server-enforced) | Full access model + OIDC auth + LGPD routing |
| Risk profile | Low | High |
| Deal type | Renewal retention | Pre-close blocker |
| Scope risk | Low | High (LGPD + Azure AD dependency on client action) |
| External dependencies | None | Client must register app in Azure AD portal |
