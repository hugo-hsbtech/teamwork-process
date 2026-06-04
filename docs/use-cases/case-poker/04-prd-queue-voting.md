# PRD — Queue Voting

> The PRD (Product Requirements Document) is the **merger** of the [Readiness Package](./02-readiness-package-queue-voting.md) (product, authored by the PO) with the Technical Assessment (technical, authored by the CTO) — **not requested in this case**. It is the **only artifact that opens the downstream** — delivered to the **PM**. Each half retains clear authorship: the PO does not write the technical part, the CTO does not rewrite the product. See [`personas/02-po.md` §2, §10 and §11](../../../personas/02-po.md).
>
> **In this case, there was no escalation to the CTO:** the PRD is formed solely from the RP; Part B references "no Technical Assessment — no architectural impact."
>
> `PRD = RP (PO) [Technical Assessment: Not requested]`
>
> **Journey:** [`00 Submitter Document`](./00-submitter-brief-queue-voting.md) → [`01 Intake Record (PO — triage)`](./01-intake-record-queue-voting.md) → [`02 Readiness Package (PO)`](./02-readiness-package-queue-voting.md) → `03 Technical Assessment — not requested` → `04 PRD (PO+CTO → PM)`.

## Metadata

| Field | Value |
|---|---|
| **PRD ID** | PRD-2026-001 |
| **Version** | v1 |
| **Linked RP** | RP-2026-001 v2 |
| **Linked Technical Assessment** | N/A — no architectural escalation |
| **Linked Intake** | INT-2026-001 |
| **Authors** | Lucas Mendes (PO) |
| **Status** | Under PM review |
| **Delivered to PM on** | 2026-03-28 |

## Revision History

| Version | Date | Author | Status | Summary |
|---|---|---|---|---|
| v1 | 2026-03-28 | Lucas Mendes (PO) | Under PM review | PRD formed from RP-2026-001 v2 (approved). No Technical Assessment — no architectural escalation. Delivered to PM for downstream opening. |

---

## Sign-off

> The merge only closes with the PO's signature. Since there was no escalation to the CTO, the technical field is N/A justified.

| Role | Name | Verdict | Date |
|---|---|---|---|
| **PO** (product) | Lucas Mendes | RP frozen (`freezeReady`) — v2 approved by PM | 2026-03-28 |
| **CTO** (technical) | — | N/A — no architectural escalation. Technical premises validated as reasonable; Tech Lead confirms in breakdown. | — |

---

## Combined Executive Summary

The PokerPlan platform gives facilitators no control over the flow of estimates during planning ceremonies: all items are exposed from the start and votes appear in real time. This leads to ungoverned ceremonies and anchoring-biased estimates — issues reported directly by Banco Meridional's Scrum Masters (enterprise client, 4 active squads, contract renewal in ~90 days).

This PRD defines the delivery of two complementary capabilities: **Queue of Questions** (facilitator reveals stories sequentially, one at a time) and **Secret Voting** (votes hidden until deliberately revealed by the facilitator). Together, these capabilities return control of the ceremony's pace to the facilitator and eliminate anchoring bias.

From a technical standpoint, the demand is entirely confined to UI and session state — extension of the existing WebSocket infrastructure and session persistence schema. No new infrastructure, no new external services, no platform architectural impact. Escalation to the CTO was not needed; technical premises were assessed as reasonable by the PO and will be confirmed by the Tech Lead in the breakdown.

The expected business outcome: retention of R$ 84,000 ARR (Banco Meridional renewal) + unlocking R$ 28,000 ARR of expansion (3 pending squads). Estimated effort: 14 days. Timeline: feature in production before the renewal conversation (~90 days from March 2026).

---

## Part A — Product Definition (from Readiness Package · PO)

> Synthesis of the RP's key sections. The full source document is [`RP-2026-001 v2`](./02-readiness-package-queue-voting.md); what follows is what the PM needs to plan, without rewriting the entire RP.

### A.1 Objectives and Expected Outcome

1. Allow facilitators to load a list of items and reveal them sequentially, one at a time, with controls to advance, skip, and return.
2. Hide all participants' votes until the facilitator explicitly and deliberately triggers the reveal.
3. Reduce the average ceremony duration by at least 20% for sessions with 10+ items (measurable via session duration telemetry).
4. Remove the adoption blocker for the 3 pending squads at Banco Meridional — unlocking R$ 28,000 ARR of expansion.

### A.2 Scope (final)

**Included:**
- Facilitator UI: item queue with controls to add, reveal next, skip, return
- Participant UI: only the active item visible (no queue visibility)
- Vote hiding until explicit reveal; simultaneous reveal for all participants
- State persistence across reconnections (5-min grace period for the facilitator)
- Basic controls: skip item, return to previous item, end session
- Session and per-item duration telemetry

**Excluded:**
- Per-item timer with auto-advance
- Automatic reveal after all votes submitted
- Co-facilitation / multi-facilitator control
- Mobile redesign; Jira/Linear integration; analytics reports

**Deferred (Phase 2+):**
- Auto-reveal toggle; queue template reuse; co-facilitator mode; analytics dashboard; Jira/Linear integration

### A.3 Personas / Jobs-to-be-done

| Persona | Job | Impact |
|---|---|---|
| Scrum Master / Facilitator | Run a planning ceremony with controlled pace and unbiased estimates, without manual workarounds | Primary user: gains full control over when each item is presented and when votes are revealed |
| Developer / Voter | Estimate each story independently, without seeing colleagues' estimates before voting | Sees only the active item; vote hidden until reveal; less distraction |

### A.4 Business Rules and Flows

Full rules in [`RP-2026-001 v2 — Section 6`](./02-readiness-package-queue-voting.md). Summary for the PM:

- Only the facilitator controls the queue (add, reorder, reveal, skip, return).
- Items in the queue are invisible to participants until revealed.
- Votes displayed as "Voted" (without value) until the facilitator triggers "Reveal votes."
- Reveal is server-side: values do not travel in WebSocket payloads before the `votes_revealed` event.
- Participants without a vote at reveal time receive "Did not vote" — flow is not blocked.
- Maximum of 100 items per queue (to be confirmed by the Tech Lead).

State flow: Session created → Queue loaded → Item revealed → Votes submitted (hidden) → Votes revealed → Advance / Re-vote / End.

### A.5 User Stories + Acceptance Criteria

| ID | Story | Primary acceptance criterion |
|---|---|---|
| ST-001 | As a facilitator, I want to manage the item queue (add, reveal one by one, skip, return) to run the planning at my own pace | Given I am the facilitator, when I trigger "Reveal next item," then the next item becomes active and is displayed to everyone; the remaining items in the queue remain hidden from participants |
| ST-002 | As a facilitator, I want votes to stay hidden until I explicitly reveal them, to eliminate anchoring bias | Given a participant votes, when another checks the screen, then they see "Voted" — without the value; when the facilitator triggers "Reveal votes," all values appear simultaneously in ≤ 500ms |
| ST-003 | As a facilitator or participant, I want session state to be restored after a temporary disconnection | Given the facilitator reconnects within 5 min, then queue, active item, and votes are restored; after 5 min, session ends cleanly with notification |

Full acceptance criteria (Given/When/Then for all cases) in [`RP-2026-001 v2 — Section 7`](./02-readiness-package-queue-voting.md).

### A.6 Non-Functional Requirements (NFRs)

| Dimension | Requirement | Verification |
|---|---|---|
| Performance | Vote reveal propagated to all in ≤ 500ms | Load test with 30+ concurrent participants before release |
| Reliability | Session state restored after facilitator reconnection within 5 min | Forced reconnection test in QA |
| Security | Vote values absent from WebSocket payloads before `votes_revealed`; server-side hiding | Penetration test on the reveal flow; payload inspection |
| Usability | Facilitator operates queue and reveal without training | Validation with ≥ 1 Banco Meridional Scrum Master before release |
| Compatibility | Functional on already-supported browsers and devices; existing mobile layout applies | Regression in current smoke test |
| Maintainability | Deploy without downtime of active sessions; telemetry available from the 1st deploy | Rollout strategy in Tech Backlog; post-deploy verification |

### A.7 Edge Cases and Failure Modes

- **Participant joins during active item:** sees active item, can vote. Queue not exposed.
- **Facilitator disconnects:** session pauses. 5-min grace period; after that, ends cleanly with notification.
- **All voted before reveal:** no auto-reveal — facilitator controls timing.
- **Partial votes at reveal:** participants without a vote receive "Did not vote." Flow not blocked.
- **Queue empty on advance:** control disabled; visual indication "All items completed."
- **Participant reconnects:** resumes active item; prior vote preserved if already voted.
- **Schema migration with active sessions:** migration runs only on ended sessions.

Full edge cases with expected behavior in [`RP-2026-001 v2 — Section 9`](./02-readiness-package-queue-voting.md).

---

## Part B — Technical Definition (from Technical Assessment · CTO)

> Technical Assessment **not requested** for this demand — no architectural escalation. The demand is confined to UI and session state extension within the existing infrastructure. Technical premises were assessed as reasonable at triage and will be validated by the Tech Lead during the technical breakdown.

### B.1 Feasibility Verdict

| Field | Value |
|---|---|
| **Verdict** | N/A — no architectural escalation |
| **Caveats** | No CTO escalation. Tech Lead validates technical premises (WebSocket + session schema) in breakdown. If a premise proves false, the demand is re-triaged — downstream re-triage trigger. |

### B.2 Architectural Impact and Integrations

| Area / System | Impact | Note |
|---|---|---|
| WebSocket / real-time session layer | New event types (`item_revealed`, `votes_revealed`, `item_skipped`) on existing infrastructure | No new broker or messaging layer — premise to confirm with Tech Lead |
| Session persistence | Schema extension to support ordered queue, per-item reveal state, and vote hiding flag | Premise: incremental migration, no full migration — to confirm with Tech Lead |
| Facilitator frontend | New queue management UI component and reveal controls | — |
| Participant frontend | Change in vote display logic (hidden → revealed) | — |
| Observability | New telemetry events: session duration, time per item, reveal lag | Required to measure objectives in Section 3 |
| Multi-tenancy | No impact — session scope already isolated per tenant | — |

> **Note:** the areas above are the PO's assessment based on system knowledge. They do not replace the CTO's Technical Assessment. The Tech Lead confirms during breakdown; if a blocker is found, a downstream re-triage is triggered.

### B.3 Hard Constraints

| Constraint | Effect on scope |
|---|---|
| Deploy without downtime | Incremental rollout mandatory. Rollout strategy documented in Tech Backlog before development starts. |
| No new external services | Feature built entirely within existing infrastructure. No procurement. |
| Max 100 items per queue | Operational limit to confirm with Tech Lead. If not feasible, reduce to 50 without functional impact for Banco Meridional's use case. |

### B.4 ADRs (architectural level)

| # | Decision | Sign-off |
|---|---|---|
| — | No architectural-level ADRs — no CTO escalation. Technical ADRs will be recorded by the Tech Lead in the Tech Backlog (06.2) during breakdown. | N/A |

---

## Scope Reconciliation

> RP scope kept in full. No Technical Assessment — no CTO technical veto or constraint altered the scope defined in RP-2026-001 v2.

| Original item (RP) | Change after Technical Assessment | Reason |
|---|---|---|
| — | RP scope kept in full | No CTO escalation; no technical conflict to reconcile |

---

## Consolidated Risk and Dependency View

> Product/business risks (from RP, Section 12) + PO's preliminary technical assessment — the PM plans against this view.

| Risk | Origin | Type | Probability | Impact | Mitigation |
|---|---|---|---|---|---|
| Renewal deadline not met if actual effort exceeds estimate | RP | Timeline | Low | High | PM assesses capacity at planning opening. Scope cut (advanced telemetry) takes precedence over timeline extension. |
| WebSocket or schema technical premise is false — identified in breakdown | RP/TA | Technical | Low | High | Tech Lead validates at opening. If blocker: immediate re-triage with PO. |
| Scrum Masters without adoption autonomy (unvalidated premise) | RP | External | Low | Medium | CS validates with client before delivery. |
| Residual anchoring bias (verbal communication) | RP | Product | High | Low | Accepted — platform controls only digital visibility. |
| Slower-than-expected adoption by pending squads | RP | Adoption | Medium | Medium | CS coordinates active onboarding post-release. 60-day target is conservative. |
| Vote hiding bypass via client-side inspection | RP | Security | Low | High | Server-side hiding (no value in payloads before `votes_revealed`). Penetration test on reveal flow. |
| Inconsistent WebSocket event ordering under load | RP | Technical | Medium | Medium | Load test with 30+ participants before release. Reveal is idempotent by design. |

**Known external dependencies:**

- CS (Ana Costa): adoption autonomy validation with client + post-release onboarding coordination
- PM: team capacity assessment and planning within the 90-day deadline
- Tech Lead: confirmation of technical premises at breakdown opening

---

## Effort and Cost

> PO's preliminary estimate (no firm Technical Assessment). Firm number comes from the Tech Lead in breakdown (Tech Backlog 06.2). Internal use only — not a contractual commitment.

| Area | Preliminary estimate | Seniority |
|---|---|---|
| Backend (session state + WebSocket events) | 5 days | Mid-senior |
| Frontend — facilitator UI | 4 days | Mid |
| Frontend — participant UI | 2 days | Mid |
| QA (functional + security + load) | 3 days | QA |
| **Preliminary total** | **14 days** | |

**Infra / Third-parties / Recurring opex:** None. No new infrastructure, no external services, no procurement. Opex impact: ~2–3% increase in observability storage (additional telemetry events) — no budget action needed.

---

## Inherited Readiness and Open Dispositions

> What the PM needs to see before planning: premises still to validate that survived to this point. If a premise proves false during execution, the demand is re-evaluated.

| Field | Value |
|---|---|
| **Premises still to validate** | (1) Banco Meridional Scrum Masters have adoption autonomy without IT approval — validate with CS before delivery; (2) per-squad ticket value for pending squads matches active squads — validate with Finance/CS to firm up expansion ARR |
| **Discovery unknowns** | — (none; no Discovery phase occurred) |
| **Delegated requirements (with owner)** | — |

> Technical premises (WebSocket and session schema) were addressed during rationalization and confirmed as reasonable. They will be definitively validated by the Tech Lead in breakdown — if one proves false, the PO is notified and the demand is re-triaged.

---

## Success Criteria and Metrics (projected)

> Projected baseline that [`../../../metrics.md`](../../../metrics.md) compares against measured post-rollout.

| Type | Metric | Target (projected) | Window | Confidence |
|---|---|---|---|---|
| **Primary** | Average ceremony duration with 10+ items (Banco Meridional cohort) | Reduction ≥ 20% vs. pre-release baseline | 30 days post-release | 75 |
| **Primary** | Banco Meridional renewal | Contract renewed before ~2026-06-10 | By expiration date | 85 |
| **Secondary** | Adoption by additional Banco Meridional squads | 3 new squads activated | 60 days post-release | 70 |
| **Guardrail** | CS tickets about anchoring bias / premature vote visibility | Zero | Continuous post-release | 90 |
| **Guardrail** | WebSocket error rate in sessions | Does not increase vs. baseline | 30 days post-release | 80 |

---

## Handoff to PM — Acceptance Gate

> The PM has **explicit authority to reject** the PRD and return it with specific gaps (not a generic "needs more detail"). The rejection and reason enter the Revision History; the PO addresses only the gaps and increments the version. See [`interactions/07-po-to-pm.md`](../../../interactions/07-po-to-pm.md).

| Delivery checklist | OK? |
|---|---|
| RP frozen (`freezeReady`) and referenced | ☑ |
| Technical Assessment signed (or N/A justified) | ☑ — N/A: no architectural escalation |
| Scope reconciliation recorded | ☑ — RP scope kept in full |
| Risks and dependencies consolidated | ☑ |
| External dependencies explicit | ☑ |
| Open dispositions visible | ☑ |

**Priority and business context:** High-priority demand. Banco Meridional renewal (largest enterprise account) in ~90 days. The deadline is non-negotiable — it is the scope-cutting constraint, not a deferral one. PM must assess team capacity at planning opening and, if necessary, cut advanced telemetry items before cutting queue or vote reveal functionality.
