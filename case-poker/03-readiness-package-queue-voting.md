# Readiness Package — Queue Voting

## Metadata

| Field | Value |
|---|---|
| **Package ID** | RP-2024-001 |
| **Version** | v2 |
| **Linked Intake** | INT-2024-001 |
| **Owned by** | Lucas Mendes (PO) |
| **CTO contribution** | Not required — no architectural escalation |
| **Status** | Approved — pending PM execution planning |
| **Current version approval date** | 2024-03-28 |

## Revision History

| Version | Date | Author | Status | Summary |
|---|---|---|---|---|
| v1 | 2024-03-20 | Lucas Mendes (PO) | Rejected by PM | Initial submission. PM returned package citing missing rollout strategy and undefined acceptance criteria for vote concealment edge cases. |
| v2 | 2024-03-28 | Lucas Mendes (PO) | Approved | Added rollout strategy, defined acceptance criteria for all edge cases (facilitator disconnect, partial votes at reveal, participant reconnect mid-item). PM approved. |

---

## Section 1 — Executive Summary

The platform currently has no mechanism for facilitators to control the flow of story estimation during planning ceremonies. All items are visible simultaneously and all votes appear in real time as cast.

This package defines the addition of two capabilities:

1. **Question Queue** — facilitators can load a list of stories/questions and reveal them one at a time to participants, controlling the estimation sequence.
2. **Secret Voting** — participant votes are hidden from all other participants until the facilitator explicitly reveals them.

These capabilities address a retention risk with Banco Meridional (renewal in 90 days) and unblock adoption by 3 additional squads within the same account.

---

## Section 2 — Context & Problem

### Current Scenario

When a facilitator creates a planning room and adds items to be estimated, all participants can see the full list immediately. Votes are displayed in real time as each participant submits them.

### Limitations

- No sequential control: participants read ahead and form anchored opinions before the item is discussed.
- No vote concealment: early voters influence late voters, creating anchoring bias and less accurate estimates.
- Facilitator has no flow control: the ceremony pace is dictated by the slowest voter on each item, with no mechanism to move forward deliberately.

### Customer Pain

Banco Meridional's Scrum Masters report that ceremonies with 10+ stories take 40–60% longer than expected due to participants debating items out of order and re-estimating based on visible peer votes. The workaround (sending one story at a time via chat) adds 15–20 min of overhead per ceremony.

### Business Impact

- Renewal risk: R$ 84.000 ARR (4 squads × R$ 21.000)
- Expansion blocked: 3 additional squads not onboarded
- Competitive gap: flagged against 2 competing tools in renewal conversation

---

## Section 3 — Objectives

1. Enable facilitators to load a list of items and reveal them sequentially, one at a time.
2. Conceal participant votes until the facilitator triggers the reveal.
3. Reduce average ceremony time by at least 20% for ceremonies with 10+ items (measurable via session duration telemetry).
4. Remove the adoption blocker for the 3 pending squads at Banco Meridional.

---

## Section 4 — Scope

### Included

- Facilitator UI: ability to add a list of items to a queue before or during a session
- Facilitator UI: "Reveal next item" control to advance the queue one item at a time
- Participant UI: view of the current active item only (no visibility into queued items)
- Vote concealment: all participant votes are hidden until facilitator triggers "Reveal votes"
- Facilitator UI: "Reveal votes" control, available after all participants have voted or after a timer expires
- Session state: persistence of queue order and reveal state across reconnections
- Basic facilitator controls: skip item, return to previous item, end session

### Excluded

- Timer per item (out of scope for this release — separate backlog item)
- Automated reveal after all votes submitted (could be a preference toggle — future phase)
- Export or reporting of voting results (existing functionality, no changes)
- Mobile-specific redesign (existing mobile layout applies)
- Multi-facilitator co-control (single facilitator per session remains the model)

---

## Section 5 — Personas Impacted

| Persona | Role in Session | Impact |
|---|---|---|
| **Scrum Master / Facilitator** | Creates and controls the room | Primary user of queue and reveal controls. Gains ceremony flow control. |
| **Developer / Voter** | Estimates items | Sees only the active item. Votes are hidden until reveal. Experience change: less distraction, more focused estimation. |
| **Observer** (future role, not in this scope) | Watches without voting | Not impacted in this release. |

---

## Section 6 — Business Rules & Flows

### Queue Management Rules

1. Only the facilitator can add, reorder, or remove items from the queue.
2. Items in the queue are not visible to participants until revealed.
3. The facilitator can reveal items in order or skip ahead — but cannot un-reveal an already-revealed item without ending the session for that item.
4. A session can have a maximum of 100 queued items (technical limit, not a business rule — to be confirmed by CTO if needed).

### Vote Concealment Rules

1. Once a participant submits a vote, it is recorded but displayed only as "Voted" (not the value) to other participants.
2. The facilitator can see the count of votes submitted but not the values until reveal.
3. The facilitator triggers "Reveal votes" at any time — this shows all submitted votes simultaneously to all participants.
4. Participants who have not voted when reveal is triggered will see their slot as "Not voted" — no blocking.
5. After reveal, the facilitator can move to the next queued item or re-vote the current item.

### State Transition Flow

```text
Session created
    ↓
Facilitator loads queue (1..N items)
    ↓
Facilitator reveals item 1
    ↓
Participants vote (votes hidden)
    ↓
Facilitator triggers "Reveal votes"
    ↓
All votes shown simultaneously
    ↓
Facilitator advances to item 2 (or closes session)
    ↓
[repeat]
```

### Edge Cases (in scope)

- **Participant joins mid-item**: sees the active item and can vote. Queue position is not shown.
- **Facilitator disconnects**: session pauses. If facilitator reconnects within 5 min, state is restored. After 5 min, session closes.
- **All participants vote before reveal**: facilitator still controls reveal timing — no auto-reveal.
- **Facilitator skips an item**: item is marked as skipped in session history. Can be returned to.

---

## Section 7 — Integrations Required

| System | Type | Detail |
|---|---|---|
| **WebSocket / real-time session layer** | Internal | Queue state and vote reveal events must be broadcast to all session participants in real time. Existing WebSocket infrastructure applies. |
| **Session persistence layer** | Internal | Queue order, reveal state, and votes must persist across reconnections. Existing session storage applies — schema extension required. |

No external third-party integrations required for this feature.

---

## Section 8 — Technical Impact

*CTO escalation: not required. Notes provided by PO based on existing system knowledge. Tech Leads to validate during breakdown.*

| Area | Impact |
|---|---|
| **Session state model** | Schema extension to support queue (ordered list of items + reveal state per item) and vote concealment flag per session. |
| **WebSocket events** | New event types: `item_revealed`, `votes_revealed`, `item_skipped`. Existing event bus applies. |
| **Frontend (facilitator)** | New queue management UI component. New reveal controls. |
| **Frontend (participant)** | Vote display logic change: show "Voted" instead of value until reveal event received. |
| **Security** | Vote values must not be exposed in WebSocket payloads to participants before reveal — server must enforce concealment, not just the client. |
| **Multi-tenancy** | No impact — session scope is already tenant-isolated. |
| **Observability** | Add telemetry: session duration, time per item, reveal lag. Required for success metric measurement. |
| **Scalability** | No new concerns — queue is session-scoped and bounded (max 100 items). |

---

## Section 9 — Risks & Dependencies

| Risk | Type | Probability | Impact | Mitigation |
|---|---|---|---|---|
| WebSocket event ordering issues under high participant count | Technical | Medium | Medium | Load test with 30+ concurrent participants before release. |
| Vote concealment bypass via client-side inspection | Security | Low | High | Server enforces concealment. Votes not included in broadcast payloads until reveal event. Penetration test on the reveal flow. |
| Session state loss on facilitator reconnect | Technical | Low | High | Grace period of 5 min with state restoration. Fallback: session closes cleanly with a notification. |
| Schema migration conflicts with active sessions | Technical | Low | Medium | Migration runs on sessions with status = closed only. Active sessions use old schema until natural close. |

**Dependencies:**
- WebSocket infrastructure team availability for event schema review
- QA environment with multi-participant simulation capability

---

## Section 10 — Internal Effort & Cost Assessment

> 🔒 **Internal use only.** This section is an operational planning instrument for internal decision-making. The estimates below are not commitments, not contractual obligations, and must never be shared with clients, prospects, or external stakeholders in any form. They exist to support capacity planning, prioritization trade-offs, and administrative resource allocation within the company.
>
> Estimates are based on current team seniority and known system state at the time of rationalization. They will be revised by the Tech Lead during technical breakdown.

### Development Effort

| Area | Estimate | Seniority |
|---|---|---|
| Backend (session state + WebSocket events) | 5 days | Mid-senior |
| Frontend — facilitator UI | 4 days | Mid |
| Frontend — participant UI | 2 days | Mid |
| QA (functional + security + load) | 3 days | QA |
| **Total** | **14 days** | |

### Infrastructure Impact

No new infrastructure required. Existing WebSocket and session storage infrastructure absorbs this feature within current capacity. No procurement or provisioning actions needed.

### Third-party Cost Impact

None. No new external services, APIs, or licenses required.

### Recurring Operational Cost Impact

Minimal. Additional telemetry events increase observability storage by an estimated 2–3% at current session volume. No budget action required.

### TCO Assessment

Feature is operationally neutral — no new services, no new external dependencies. Total cost of ownership impact is limited to development time. No ongoing cost line is added to the company's operational budget.

---

## Section 11 — Success Criteria

| Metric | Target | Measurement |
|---|---|---|
| Average ceremony duration (10+ items) | Reduce by ≥ 20% vs. current baseline | Session duration telemetry — compare before/after for Banco Meridional cohort |
| Banco Meridional renewal | Confirmed before contract date | CS tracks renewal outcome |
| Additional squad adoption | 3 new squads activated within 60 days of release | Account dashboard — squad activation count |
| Vote anchoring incidents reported | Zero CS tickets about anchoring bias post-release | CS ticket tagging |
| Facilitator-reported satisfaction | ≥ 4.5/5 in post-ceremony survey (if survey exists) | CS follow-up with account |

---

## Section 12 — Suggested Roadmap

### MVP (this release)

- Queue management (add, order, reveal one at a time)
- Vote concealment with facilitator-controlled reveal
- Session state persistence across reconnections
- Basic facilitator controls (skip, return, end)

### Phase 2 (future backlog)

- Auto-reveal after all participants vote (optional preference toggle)
- Per-item timer with optional auto-advance
- Queue template reuse across sessions
- Co-facilitator mode (multiple facilitators sharing control)

### Phase 3 (future backlog)

- Ceremony analytics dashboard (time per item, consensus rate, revision frequency)
- Integration with Jira/Linear for direct story import into queue
