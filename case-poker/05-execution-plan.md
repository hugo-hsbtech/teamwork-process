# Execution Plan — Sprint Cycle 2024-Q2

## Metadata

| Field | Value |
|---|---|
| **Plan ID** | EP-2024-001 |
| **Version** | v1 |
| **Owned by** | Carla Ribeiro (PM) |
| **Covers demands** | INT-2024-001 (Queue Voting, RP v2) · INT-2024-002 (Access Control, RP v1) |
| **Status** | Active |
| **Plan date** | 2024-03-29 |
| **Execution window** | 2024-04-01 → 2024-05-31 |

## Revision History

| Version | Date | Author | Summary |
|---|---|---|---|
| v1 | 2024-03-29 | Carla Ribeiro (PM) | Initial plan. Capacity assessment completed. Demands sequenced. Shared with PO and CTO. |

---

## 1. Capacity Assessment

> 🔒 **Internal use only.** This section must not be shared with clients or external stakeholders.

### Team Composition (as of 2024-03-29)

| Person | Role | Seniority | Current allocation | Available from |
|---|---|---|---|---|
| Diego Alves | Backend Engineer | Senior | 100% — ongoing platform maintenance | 2024-04-01 (maintenance cycle ends) |
| Priya Nair | Backend Engineer | Mid-senior | 100% — ongoing platform maintenance | 2024-04-01 |
| Camila Torres | Frontend Engineer | Mid | 20% — minor bug fixes | 2024-04-01 (fully available) |
| Lucas Park | Frontend Engineer | Mid | 20% — minor bug fixes | 2024-04-01 (fully available) |
| Fernanda Lima | QA | QA | 30% — regression suite maintenance | 2024-04-08 (fully available) |

### Skill Coverage

| Required skill | Demand | Available? | Who |
|---|---|---|---|
| WebSocket / session state | INT-2024-001 | Yes | Diego Alves |
| Frontend component (facilitator UI) | INT-2024-001 | Yes | Camila Torres |
| Frontend component (participant UI) | INT-2024-001 | Yes | Lucas Park |
| Auth layer / OAuth2 / OIDC | INT-2024-002 | Yes — with ramp-up | Diego Alves (3-day ramp on OIDC group claims) |
| Participant data model migration | INT-2024-002 | Yes | Priya Nair |
| Multi-region DB routing (sa-east-1) | INT-2024-002 | Partial — CTO spike required first | Diego Alves + CTO guidance |
| QA — load + security + multi-tenant | Both | Yes | Fernanda Lima |

### Conflict Map

Both demands touch overlapping systems:

| Shared system | INT-2024-001 | INT-2024-002 | Risk |
|---|---|---|---|
| WebSocket event layer | New event types (item_revealed, votes_revealed) | New event types (join_request, join_approved, role_changed) | Parallel changes to the same event bus — must be coordinated |
| Session state schema | Queue + reveal state fields | Participant role, access_mode, invite_token fields | Both require schema migrations — must be sequenced, not parallelized |
| Participant model | Vote concealment display logic | Full participant state machine rewrite | INT-2024-002 changes the participant model; INT-2024-001 depends on it — INT-2024-002 backend must land first |

### Capacity Decision

Total estimated effort: 14 days (INT-2024-001) + 41 days (INT-2024-002) = **55 working days**.

Available team capacity from 2024-04-01 (2 backend + 2 frontend + 1 QA):
- Backend: 2 engineers × ~45 working days in window = ~90 backend-days available
- Frontend: 2 engineers × ~45 working days = ~90 frontend-days available
- QA: 1 × ~42 working days (starts 2024-04-08) = ~42 QA-days available

**Assessment: capacity is sufficient to absorb both demands sequentially within the window.**

Critical constraint: INT-2024-002 has an external dependency (Azure AD registration by Construtora Ágil IT). This must be tracked as a milestone blocker. If not resolved by 2024-04-14, INT-2024-002 backend auth work is blocked and schedule shifts.

### PM Recommendation

Sequence INT-2024-001 first — lower risk, shorter delivery, and resolves a renewal deadline (90 days from 2024-03-12 = by 2024-06-10). INT-2024-002 begins in parallel on non-conflicting tracks, with full focus after INT-2024-001 ships.

---

## 2. Demand Sequencing

```
APRIL                          MAY
Week 1   Week 2   Week 3   Week 4   Week 1   Week 2   Week 3   Week 4
[Apr 1]  [Apr 8]  [Apr 15] [Apr 22] [Apr 29] [May 6]  [May 13] [May 20]

INT-2024-001 (Queue Voting — 14 days)
├── Backend ──────────────┤
               ├── Frontend ───────┤
                            ├─ QA ─┤
                                   [RELEASE: Apr 26]

INT-2024-002 (Access Control — 41 days)
├── Participant model migration ──────────────────────────────┤
     ├── Azure AD OIDC (blocked until client registers app) ──┤
               ├── Access modes + anonymous mode ─────────────────────┤
                         ├── Frontend settings panel + participant UI ──────────┤
                                                        ├── QA ─────────────────┤
                                                                          [RELEASE: May 30]
```

---

## 3. Milestone Map

### INT-2024-001 — Queue Voting

| Milestone | Owner | Target date | Gate |
|---|---|---|---|
| M1 — Breakdown Package complete | Tech Lead | 2024-04-03 | PM confirms Tech Lead has sufficient context |
| M2 — Backend complete (session state + WebSocket events) | Diego Alves | 2024-04-12 | Code review passed, unit tests green |
| M3 — Frontend complete (facilitator + participant UI) | Camila Torres / Lucas Park | 2024-04-19 | Tech Lead review passed |
| M4 — QA cycle complete | Fernanda Lima | 2024-04-24 | All acceptance criteria validated |
| M5 — Release | PM + Tech Lead | 2024-04-26 | QA release approval issued |
| M6 — Feedback loop initiated | PM | 2024-05-03 | Async summary delivered to PO + CS |

### INT-2024-002 — Room Access Control

| Milestone | Owner | Target date | Gate |
|---|---|---|---|
| M1 — Breakdown Package complete | Tech Lead | 2024-04-05 | PM confirms Tech Lead has sufficient context |
| M2 — Participant model migration complete | Priya Nair | 2024-04-19 | Schema applied to staging, backward compat verified |
| M3 — Azure AD OIDC integration complete | Diego Alves | 2024-04-26 | Blocked until Construtora Ágil registers app in Azure portal (external dependency — target: 2024-04-14) |
| M4 — Access modes + anonymous mode complete | Priya Nair + Diego Alves | 2024-05-09 | Code review passed, server-side enforcement verified |
| M5 — sa-east-1 LGPD routing complete | Diego Alves | 2024-05-14 | CTO confirms data residency posture. Staging validation with Brazilian tenant data. |
| M6 — Frontend complete | Camila Torres / Lucas Park | 2024-05-20 | Tech Lead review passed |
| M7 — QA cycle complete | Fernanda Lima | 2024-05-27 | All acceptance criteria validated, security + multi-tenant tests passed |
| M8 — LGPD sign-off by Construtora Ágil IT | Fernanda Ramos (client) | 2024-05-28 | Client confirms data residency requirement met |
| M9 — Release | PM + Tech Lead | 2024-05-30 | QA release approval + client LGPD sign-off |
| M10 — Feedback loop initiated | PM | 2024-06-06 | Async summary delivered to PO + CS |

---

## 4. Cross-Demand Dependency Map

| Dependency | From | To | Type | Risk if missed |
|---|---|---|---|---|
| Session state schema must be stable before INT-2024-002 participant model migration | INT-2024-001 backend | INT-2024-002 backend | Hard sequential | INT-2024-002 migration conflicts with INT-2024-001 schema changes — data corruption risk |
| WebSocket event bus changes must not conflict | INT-2024-001 (item events) | INT-2024-002 (membership events) | Coordination | Merged in same PR review cycle — Tech Lead owns conflict resolution |
| Azure AD client registration | External (Construtora Ágil IT) | INT-2024-002 M3 | External blocker | If not done by 2024-04-14, M3 shifts by 1 week minimum per day of delay |
| CTO sa-east-1 infrastructure confirmation | CTO | INT-2024-002 M5 | Internal blocker | If RDS instance not provisioned, M5 and all subsequent milestones shift |

---

## 5. Sprint Structure

### Sprint 1 — 2024-04-01 to 2024-04-12

**Focus:** INT-2024-001 backend + INT-2024-002 breakdown and participant model start

| Task | Assignee | Demand |
|---|---|---|
| Backend: session state schema extension (queue + reveal state) | Diego Alves | INT-2024-001 |
| Backend: WebSocket event types (item_revealed, votes_revealed, item_skipped) | Diego Alves | INT-2024-001 |
| Backend: vote concealment server-side enforcement | Priya Nair | INT-2024-001 |
| Participant model: schema design + migration plan | Priya Nair | INT-2024-002 |
| Tech Lead: breakdown package complete for both demands | Tech Lead | Both |
| PM: send Azure AD registration spec to Construtora Ágil IT | PM | INT-2024-002 |

### Sprint 2 — 2024-04-15 to 2024-04-26

**Focus:** INT-2024-001 frontend + QA · INT-2024-002 participant migration + OIDC start

| Task | Assignee | Demand |
|---|---|---|
| Frontend: facilitator queue management UI | Camila Torres | INT-2024-001 |
| Frontend: participant vote concealment display | Lucas Park | INT-2024-001 |
| QA: INT-2024-001 functional + security + load | Fernanda Lima | INT-2024-001 |
| Backend: participant model migration (staging) | Priya Nair | INT-2024-002 |
| Backend: Azure AD OIDC group-claim integration (if client registration complete) | Diego Alves | INT-2024-002 |
| **RELEASE: INT-2024-001** | PM + Tech Lead | INT-2024-001 |

### Sprint 3 — 2024-04-29 to 2024-05-10

**Focus:** INT-2024-002 access modes + anonymous mode

| Task | Assignee | Demand |
|---|---|---|
| Backend: invite-only and approval-required access modes | Priya Nair + Diego Alves | INT-2024-002 |
| Backend: anonymous mode server-side alias assignment and payload filtering | Diego Alves | INT-2024-002 |
| Backend: participant removal + role assignment | Priya Nair | INT-2024-002 |

### Sprint 4 — 2024-05-13 to 2024-05-24

**Focus:** INT-2024-002 LGPD routing + frontend

| Task | Assignee | Demand |
|---|---|---|
| Backend: sa-east-1 LGPD routing (Option C) | Diego Alves | INT-2024-002 |
| Frontend: room owner access settings panel | Camila Torres | INT-2024-002 |
| Frontend: participant UI (aliases, observer view, approval screen) | Lucas Park | INT-2024-002 |
| CTO: confirm sa-east-1 RDS instance provisioned | CTO | INT-2024-002 |

### Sprint 5 — 2024-05-27 to 2024-05-31

**Focus:** INT-2024-002 QA + release

| Task | Assignee | Demand |
|---|---|---|
| QA: full cycle (functional + security + multi-tenant + LGPD validation) | Fernanda Lima | INT-2024-002 |
| Client LGPD sign-off | Construtora Ágil IT (Fernanda Ramos) | INT-2024-002 |
| **RELEASE: INT-2024-002** | PM + Tech Lead | INT-2024-002 |

---

## 6. Escalation Triggers

| Condition | PM Action | Escalation target |
|---|---|---|
| Azure AD registration not confirmed by 2024-04-14 | PM notifies PO. PO engages Sales to pressure client IT. | PO → Sales → Construtora Ágil |
| sa-east-1 RDS instance not provisioned by 2024-05-05 | PM escalates to CTO. CTO escalates to CEO if procurement approval needed. | CTO → CEO |
| INT-2024-001 QA reveals blocker before release | PM holds release. Tech Lead triages. If > 2 days, PM notifies PO of renewal risk. | PO → CS → Banco Meridional |
| Any milestone slips > 3 business days | PM produces revised milestone map and communicates to PO. No silent absorption. | PO |
| Scope addition request arrives during execution | PM rejects. Any addition requires a new Intake record. | PO |
