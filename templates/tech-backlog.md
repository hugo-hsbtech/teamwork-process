# Tech Backlog — [Nome da Demanda]

## Metadata

| Field | Value |
|---|---|
| **Backlog ID** | TB-YYYY-NNN |
| **Version** | v1 |
| **Linked Product Backlog** | PB-YYYY-NNN |
| **Linked RP** | RP-YYYY-NNN vX |
| **Linked Execution Plan** | EP-YYYY-NNN |
| **Owned by** | [Nome] (Tech Lead) |
| **Status** | Draft |
| **Backlog date** | YYYY-MM-DD |

> This document defines **how** the stories in [PB-YYYY-NNN] will be built.
> Scope decisions, acceptance criteria, and product intent belong to the Product Backlog. This Tech Backlog does not redefine them.

## Revision History

| Version | Date | Author | Summary |
|---|---|---|---|
| v1 | YYYY-MM-DD | [Nome] (Tech Lead) | Initial breakdown. |

---

## Architecture Decisions (ADRs)

| # | Decision | Rationale | CTO sign-off |
|---|---|---|---|
| ADR-001 | [Decisão] | [Justificativa] | Yes / Not required |

---

## Task Breakdown by Story

---

### ST-001 — [Nome da História]

| ID | Task | Assignee | Estimate |
|---|---|---|---|
| T-001 | [Tarefa] | [Nome] | [X days] |

---

## Refined Effort Estimate

> 🔒 Internal use only.

| Area | RP estimate | Refined estimate | Delta | Note |
|---|---|---|---|---|
| [Área] | [X days] | [X days] | [+/- X] | [Nota] |
| **Total** | **X days** | **X days** | **+/- X** | |

---

## Definition of Done

A story is done when **all** of the following are true:

- [ ] All acceptance criteria defined in the Product Backlog are met and verified by QA
- [ ] Server-side enforcement confirmed for security-sensitive behavior
- [ ] Unit tests cover happy path and all story edge cases
- [ ] Code reviewed and approved by Tech Lead
- [ ] No regressions in existing flow — QA regression suite passes
- [ ] Tech Lead closes the story in the backlog

---

## Rollout Strategy

1. **Feature flag** `feature_[name]` — disabled by default for all tenants on deploy
2. **Internal validation** — [passos]
3. **General availability** — [condição]
4. **Rollback** — [plano]
