# Execution Plan — Sprint Cycle 2026-Q2

## Metadata

| Field | Value |
|---|---|
| **Plan ID** | EP-2026-001 |
| **Version** | v1 |
| **Owner** | Carla Ribeiro (PM) |
| **Covers demands** | INT-2026-001 (Queue Voting, PRD-2026-001) · INT-2026-002 (Access Control, PRD-2026-002) |
| **Status** | Active |
| **Plan date** | 2026-03-29 |
| **Execution window** | 2026-04-01 → 2026-05-31 |

## Revision History

| Version | Date | Author | Summary |
|---|---|---|---|
| v1 | 2026-03-29 | Carla Ribeiro (PM) | Initial plan. Capacity assessment completed. Demands sequenced. Shared with PO and CTO. |

---

## 1. Capacity Assessment

> Internal use only. This section must not be shared with clients or external stakeholders.

### Team Composition (as of 2026-03-29)

| Person | Role | Seniority | Current allocation | Available from |
|---|---|---|---|---|
| Diego Alves | Backend Engineer | Senior | 100% — ongoing platform maintenance | 2026-04-01 (maintenance cycle ends) |
| Priya Nair | Backend Engineer | Mid-senior | 100% — ongoing platform maintenance | 2026-04-01 |
| Camila Torres | Frontend Engineer | Mid | 20% — minor bug fixes | 2026-04-01 (fully available) |
| Lucas Park | Frontend Engineer | Mid | 20% — minor bug fixes | 2026-04-01 (fully available) |
| Fernanda Lima | QA | QA | 30% — regression suite maintenance | 2026-04-08 (fully available) |

### Skills Coverage

| Required skill | Demand | Available? | Who |
|---|---|---|---|
| WebSocket / session state | INT-2026-001 | Yes | Diego Alves |
| Frontend component (facilitator UI) | INT-2026-001 | Yes | Camila Torres |
| Frontend component (participant UI) | INT-2026-001 | Yes | Lucas Park |
| Auth layer / OAuth2 / OIDC | INT-2026-002 | Yes — with ramp-up | Diego Alves (3-day ramp on OIDC group claims) |
| Participant data model migration | INT-2026-002 | Yes | Priya Nair |
| Multi-region DB routing (sa-east-1) | INT-2026-002 | Partial — CTO spike needed first | Diego Alves + CTO guidance |
| QA — load + security + multi-tenant | Both | Yes | Fernanda Lima |

### Conflict Map

Both demands touch overlapping systems:

| Shared system | INT-2026-001 | INT-2026-002 | Risk |
|---|---|---|---|
| WebSocket event bus layer | New event types (item_revealed, votes_revealed) | New event types (join_request, join_approved, role_changed) | Parallel changes to the same event bus — must be coordinated |
| Session state schema | Queue fields + reveal state | Participant role fields, access_mode, invite_token | Both require schema migrations — must be sequenced, not parallelized |
| Participant model | Vote hiding display logic | Full participant state machine rewrite | INT-2026-002 changes the participant model; INT-2026-001 depends on it — INT-2026-002 backend must go first |

### Capacity Decision

Total estimated effort: 14 days (INT-2026-001) + 41 days (INT-2026-002) = **55 business days**.

Team capacity available from 2026-04-01 (2 backend + 2 frontend + 1 QA):
- Backend: 2 engineers × ~45 business days in window = ~90 backend-days available
- Frontend: 2 engineers × ~45 business days = ~90 frontend-days available
- QA: 1 × ~42 business days (starts 2026-04-08) = ~42 QA-days available

Assessment: capacity is sufficient to absorb both demands sequentially within the window.

Critical constraint: INT-2026-002 has an external dependency (Azure AD registration by Construtora Ágil IT). This must be tracked as a milestone blocker. If not resolved by 2026-04-14, the INT-2026-002 auth backend work is blocked and the schedule changes.

### PM Recommendation

Sequence INT-2026-001 first — lower risk, shorter delivery, and resolves a renewal deadline (90 days from 2026-03-12 = by 2026-06-10). INT-2026-002 starts in parallel on non-conflicting tracks, with full focus after INT-2026-001 ships.

---

## 2. Demand Sequencing

```
APRIL                          MAY
Wk 1     Wk 2     Wk 3     Wk 4     Wk 1     Wk 2     Wk 3     Wk 4
[Apr 01] [Apr 08] [Apr 15] [Apr 22] [Apr 29] [May 06] [May 13] [May 20]

INT-2026-001 (Queue Voting — 14 days)
├── Backend ──────────────┤
               ├── Frontend ───────┤
                            ├─ QA ─┤
                                   [RELEASE: Apr 26]

INT-2026-002 (Access Control — 41 days)
├── Participant model migration ──────────────────────────────┤
     ├── Azure AD OIDC (blocked until client registers app) ──────────┤
               ├── Access modes + anonymous mode ─────────────────────────────┤
                         ├── Frontend settings panel + participant UI ──────────────┤
                                                        ├── QA ─────────────────────────┤
                                                                          [RELEASE: May 30]
```

---

## 3. Milestone Map

### INT-2026-001 — Queue Voting

| Milestone | Owner | Target date | Gate |
|---|---|---|---|
| M1 — Breakdown Package complete | Tech Lead | 2026-04-03 | PM confirms Tech Lead has sufficient context |
| M2 — Backend complete (session state + WebSocket events) | Diego Alves | 2026-04-12 | Code review approved, unit tests green |
| M3 — Frontend complete (facilitator UI + participant) | Camila Torres / Lucas Park | 2026-04-19 | Tech Lead review approved |
| M4 — QA cycle complete | Fernanda Lima | 2026-04-24 | All acceptance criteria validated |
| M5 — Release | PM + Tech Lead | 2026-04-26 | QA release approval issued |
| M6 — Feedback loop initiated | PM | 2026-05-03 | Async summary delivered to PO + CS |

### INT-2026-002 — Room Access Control

| Milestone | Owner | Target date | Gate |
|---|---|---|---|
| M1 — Breakdown Package complete | Tech Lead | 2026-04-05 | PM confirms Tech Lead has sufficient context |
| M2 — Participant model migration complete | Priya Nair | 2026-04-19 | Schema applied in staging, backward compatibility verified |
| M3 — Azure AD OIDC integration complete | Diego Alves | 2026-04-26 | Blocked until Construtora Ágil registers app in Azure portal (external dependency — target: 2026-04-14) |
| M4 — Access modes + anonymous mode complete | Priya Nair + Diego Alves | 2026-05-09 | Code review approved, server-side enforcement verified |
| M5 — LGPD sa-east-1 routing complete | Diego Alves | 2026-05-14 | CTO confirms data residency posture. Staging validation with Brazilian tenant data. |
| M6 — Frontend complete | Camila Torres / Lucas Park | 2026-05-20 | Tech Lead review approved |
| M7 — QA cycle complete | Fernanda Lima | 2026-05-27 | All acceptance criteria validated, security + multi-tenant tests passed |
| M8 — LGPD sign-off by Construtora Ágil IT | Fernanda Ramos (client) | 2026-05-28 | Client confirms data residency requirement met |
| M9 — Release | PM + Tech Lead | 2026-05-30 | QA release approval + client LGPD sign-off |
| M10 — Feedback loop initiated | PM | 2026-06-06 | Async summary delivered to PO + CS |

---

## 4. Cross-Demand Dependency Map

| Dependency | From | To | Type | Risk if not met |
|---|---|---|---|---|
| Session state schema must be stable before INT-2026-002 participant model migration | INT-2026-001 backend | INT-2026-002 backend | Sequential mandatory | INT-2026-002 migration conflicts with INT-2026-001 schema changes — data corruption risk |
| WebSocket event bus changes must not conflict | INT-2026-001 (item events) | INT-2026-002 (membership events) | Coordination | Merged in the same PR review cycle — Tech Lead owns conflict resolution |
| Azure AD registration by client | External (Construtora Ágil IT) | INT-2026-002 M3 | External blocker | If not done by 2026-04-14, M3 shifts 1 week per day of delay |
| sa-east-1 infrastructure confirmation by CTO | CTO | INT-2026-002 M5 | Internal blocker | If RDS instance not provisioned, M5 and all subsequent milestones shift |

---

## 5. Sprint Structure

### Sprint 1 — 2026-04-01 to 2026-04-12

**Focus:** INT-2026-001 backend + INT-2026-002 breakdown and start of participant model

| Task | Owner | Demand |
|---|---|---|
| Backend: session state schema extension (queue + reveal state) | Diego Alves | INT-2026-001 |
| Backend: WebSocket event types (item_revealed, votes_revealed, item_skipped) | Diego Alves | INT-2026-001 |
| Backend: server-side vote hiding enforcement | Priya Nair | INT-2026-001 |
| Participant model: schema design + migration plan | Priya Nair | INT-2026-002 |
| Tech Lead: complete breakdown package for both demands | Tech Lead | Both |
| PM: send Azure AD registration spec to Construtora Ágil IT | PM | INT-2026-002 |

### Sprint 2 — 2026-04-15 to 2026-04-26

**Focus:** INT-2026-001 frontend + QA · INT-2026-002 participant migration + OIDC start

| Task | Owner | Demand |
|---|---|---|
| Frontend: facilitator queue management UI | Camila Torres | INT-2026-001 |
| Frontend: participant vote hiding display | Lucas Park | INT-2026-001 |
| QA: INT-2026-001 functional + security + load | Fernanda Lima | INT-2026-001 |
| Backend: participant model migration (staging) | Priya Nair | INT-2026-002 |
| Backend: Azure AD OIDC group-claim integration (if client registration complete) | Diego Alves | INT-2026-002 |
| **RELEASE: INT-2026-001** | PM + Tech Lead | INT-2026-001 |

### Sprint 3 — 2026-04-29 to 2026-05-10

**Focus:** INT-2026-002 access modes + anonymous mode

| Task | Owner | Demand |
|---|---|---|
| Backend: invite-only and mandatory approval access modes | Priya Nair + Diego Alves | INT-2026-002 |
| Backend: server-side alias assignment and anonymous mode payload filtering | Diego Alves | INT-2026-002 |
| Backend: participant removal + role assignment | Priya Nair | INT-2026-002 |

### Sprint 4 — 2026-05-13 to 2026-05-24

**Focus:** INT-2026-002 LGPD routing + frontend

| Task | Owner | Demand |
|---|---|---|
| Backend: LGPD sa-east-1 routing (Option C) | Diego Alves | INT-2026-002 |
| Frontend: room owner access settings panel | Camila Torres | INT-2026-002 |
| Frontend: participant UI (aliases, Observer view, approval screen) | Lucas Park | INT-2026-002 |
| CTO: confirm sa-east-1 RDS instance provisioned | CTO | INT-2026-002 |

### Sprint 5 — 2026-05-27 to 2026-05-31

**Focus:** INT-2026-002 QA + release

| Task | Owner | Demand |
|---|---|---|
| QA: full cycle (functional + security + multi-tenant + LGPD validation) | Fernanda Lima | INT-2026-002 |
| Client LGPD sign-off | Construtora Ágil IT (Fernanda Ramos) | INT-2026-002 |
| **RELEASE: INT-2026-002** | PM + Tech Lead | INT-2026-002 |

---

## 6. Escalation Triggers

| Condition | PM action | Escalation destination |
|---|---|---|
| Azure AD registration not confirmed by 2026-04-14 | PM notifies PO. PO activates Sales to pressure client IT. | PO → Sales → Construtora Ágil |
| sa-east-1 RDS instance not provisioned by 2026-05-05 | PM escalates to CTO. CTO escalates to CEO if procurement approval is needed. | CTO → CEO |
| INT-2026-001 QA reveals blocker before release | PM holds release. Tech Lead triages. If > 2 days, PM notifies PO of renewal risk. | PO → CS → Banco Meridional |
| Any milestone delayed > 3 business days | PM produces revised milestone map and communicates to PO. No silent absorption. | PO |
| Scope addition request arrives during execution | PM rejects. Any addition requires a new intake record. | PO |
