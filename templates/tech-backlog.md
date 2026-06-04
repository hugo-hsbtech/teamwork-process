# Tech Backlog — [Demand Name]

## Metadata

| Field | Value |
|---|---|
| **Backlog ID** | TB-YYYY-NNN |
| **Version** | v1 |
| **Linked Product Backlog** | PB-YYYY-NNN |
| **Linked RP** | RP-YYYY-NNN vX |
| **Linked Execution Plan** | EP-YYYY-NNN |
| **Owner** | [Name] (Tech Lead) |
| **Status** | Draft |
| **Backlog date** | YYYY-MM-DD |

> This document defines **how** the stories in PB-YYYY-NNN will be built.
> Scope decisions, acceptance criteria, and product intent belong to the Product Backlog. This Tech Backlog does not redefine them.

## Revision History

| Version | Date | Author | Summary |
|---|---|---|---|
| v1 | YYYY-MM-DD | [Name] (Tech Lead) | Initial breakdown. ADRs documented, tasks defined, estimates refined. |

---

## Architecture Decisions (ADRs)

> One row per decision. Short rationale. When there is architectural escalation, include a CTO sign-off column.

| # | Decision | Rationale | CTO sign-off |
|---|---|---|---|
| ADR-001 | [Decision] | [Why this approach was chosen] | ✓ / N/A |

---

## Task Breakdown per Story

> One subsection per story from the Product Backlog. Tasks should be small enough for one pull request per task (ideally ≤ 1 day).

---

### ST-001 — [Story Name]

| ID | Task | Owner | Estimate |
|---|---|---|---|
| T-001 | [Task description] | [Name] | [X days] |

---

### ST-002 — [Story Name]

> For stories with external dependencies or blockers, mark at the top of the subsection:
>
> Blocked until: [condition]. Target: YYYY-MM-DD.

| ID | Task | Owner | Estimate |
|---|---|---|---|
| T-XXX | [Task description] | [Name] | [X days] |

---

## Refined Effort Estimate

> Internal use only.

| Area | RP estimate | Refined estimate | Delta | Note |
|---|---|---|---|---|
| Backend — [theme] | [X days] | [Y days] | [+/− Z days] | [Why it changed] |
| Frontend — [theme] | [X days] | [Y days] | [+/− Z days] | [Why it changed] |
| QA | [X days] | [Y days] | — | [On target / note] |
| **Total** | **X days** | **Y days** | **+/− Z days** | |

> PM notified on YYYY-MM-DD. [Milestone impact — maintain / revise release to YYYY-MM-DD].

---

## Definition of Done (DoD)

A story is done when **all** of the following are true:

- [ ] All acceptance criteria defined in the Product Backlog story have been met and verified by QA
- [ ] Server-side enforcement confirmed for all security-sensitive behaviors — no client trust
- [ ] Unit tests cover the happy path and all edge cases from the story
- [ ] Code reviewed and approved by the Tech Lead
- [ ] No regressions in the existing flow — QA regression suite passed
- [ ] Telemetry events confirmed received in the staging pipeline
- [ ] [Demand-specific additional criterion — e.g.: ADRs reviewed by CTO, data residency validated, etc.]
- [ ] Tech Lead closes the story in the backlog

---

## Rollout Strategy

1. **Feature flag** `feature_[name]` — disabled by default for all tenants on deploy
2. **Prerequisite gates** — [infrastructure, external integrations, client dependencies] confirmed before the flag is enabled
3. **Internal validation** — flag enabled on the internal test account; PM + CS run a full end-to-end simulation
4. **Early access [Target client]** — flag enabled for the pilot client N business days before general release; CS accompanies the first live ceremony/use
5. **General availability** — flag enabled for all tenants after pilot client confirms no issues
6. **Rollback** — disable flag `feature_[name]`; schema changes are additive and nullable — no rollback migration required
