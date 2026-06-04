# Readiness Package — Queue Voting

> The Readiness Package (RP) is the **product definition of done** — the PO's product output, written **alone**. It is a complete and self-sufficient document: vision, problem, scope, rules, user stories, NFRs, edge cases, criteria, and metrics. **The RP contains no sections authored by the CTO.** The technical assessment lives in a separate artifact — the Technical Assessment (not requested in this case) (CTO) — which the RP only **references** (see "Technical Assessment Reference"). The merge of both happens in the [PRD](./04-prd-queue-voting.md), and it is the PRD — not the RP — that opens the downstream. See [`personas/02-po.md` §2 and §6.2](../../../personas/02-po.md).
>
> The RP **inherits the confidence layer** from the linked Intake Record ([`01-intake-record-queue-voting.md`](./01-intake-record-queue-voting.md)): what entered as an assumption does not disappear at rationalization — it is resolved, or carried forward explicitly (see "Inherited readiness"). *Projected* values (especially Success Metrics) carry confidence and become the baseline that [`../../../metrics.md`](../../../metrics.md) compares against actuals post-delivery.
>
> **Journey:** [`00 Submitter Brief`](./00-submitter-brief-queue-voting.md) → [`01 Intake Record (PO — triage)`](./01-intake-record-queue-voting.md) → `02 Readiness Package (PO)` → `03 Technical Assessment — not requested` → [`04 PRD (PO+CTO → PM)`](./04-prd-queue-voting.md).

## Metadata

| Field | Value |
|---|---|
| **Package ID** | RP-2026-001 |
| **Version** | v2 |
| **Linked Intake** | INT-2026-001 |
| **Owner** | Lucas Mendes (PO) |
| **CTO Escalation** | Not required — no architectural impact |
| **Status** | Approved — awaiting execution planning by PM |
| **Freeze date** | 2026-03-28 |

## Revision History

| Version | Date | Author | Status | Summary |
|---|---|---|---|---|
| v1 | 2026-03-20 | Lucas Mendes (PO) | Rejected by PM | Initial submission. PM returned the package citing missing rollout strategy and undefined acceptance criteria for vote hiding edge cases. |
| v2 | 2026-03-28 | Lucas Mendes (PO) | Approved (`freezeReady`) | Rollout strategy added; acceptance criteria defined for all edge cases (facilitator disconnection, partial votes at reveal time, participant reconnection during active item). PM approved. |

---

## Inherited readiness and open dispositions

> Summary of what the Intake delivered and what remains *soft* at execution entry. Assumptions and delegated answers that survived rationalization must be visible — not buried in sections.

| Field | Value |
|---|---|
| **Readiness Score at Intake handoff** | 87 % |
| **Assumptions still to validate** | (1) Scrum Master adoption autonomy without client IT approval — to validate with CS before delivery; (2) Per-squad ticket for pending squads equals that of active ones — to validate with Finance/CS |
| **Discovery unknowns** | — (none open; no Discovery phase) |
| **Delegated requirements (with owner)** | — |

> The technical assumptions about WebSocket and session schema were handled during rationalization: the Tech Lead confirmed at breakdown start that the existing infrastructure absorbs the extension without full migration. These assumptions are resolved and no longer travel as open.

---

## Section 1 — Executive Summary  ·  *(blocks freeze)*

The planning poker platform currently gives the facilitator no control over the estimation flow: all backlog items are visible from the start and votes appear in real time as they are submitted. This creates two distinct problems — ungoverned ceremonies, with participants forming out-of-order opinions, and anchoring-biased estimates, where late voters copy already-visible votes.

This package defines the addition of two complementary capabilities: (1) **Question Queue** — the facilitator loads a list of stories and reveals them sequentially, one at a time, with advance, skip, and return controls; (2) **Secret Voting** — votes remain hidden from all participants until the facilitator deliberately triggers the reveal.

The immediate trigger is the Banco Meridional renewal risk (R$ 84,000 ARR, expiring in ~90 days from March 2026). Delivery will also unblock adoption by 3 additional squads in the same account (R$ 28,000 ARR expansion). The demand is limited to UI and session state — no new infrastructure, no platform architectural impact.

---

## Section 2 — Context and Problem (the pain, not the solution)  ·  *(blocks freeze)*

### Current Scenario

When a facilitator creates a planning room and adds items for estimation, all participants can immediately see the full list. Votes are displayed in real time as each participant submits them. The facilitator has no native mechanism to control the pace of story exposure or the timing of vote reveal.

### Limitations

- **No sequential control:** participants read ahead and form anchored opinions before the item is discussed by the group.
- **No vote hiding:** early voters influence late voters; anchoring bias degrades estimate accuracy.
- **Facilitator with no flow control:** ceremony pace is dictated by the slowest voter, with no mechanism for the facilitator to deliberately advance.

### Client Pain

Banco Meridional Scrum Masters report that ceremonies with 10+ stories take 40–60% longer than expected. The current workaround — sharing one story at a time via room chat — adds 15–20 minutes of overhead per ceremony and puts the facilitator in manual operation mode throughout the session.

### Business Impact

- **Renewal risk:** R$ 84,000 ARR (4 squads × R$ 21,000). Renewal in ~90 days. CS flagged as churn risk if the gap is not addressed.
- **Blocked expansion:** 3 additional squads within Banco Meridional not onboarded. The gap is the adoption blocker explicitly cited.
- **Competitive gap:** signaled against 2 competing tools during the renewal conversation. Client has viable market alternatives.

---

## Section 3 — Objectives and Expected Outcome  ·  *(blocks freeze)*

1. Allow facilitators to load a list of items and reveal them sequentially, one at a time, with controls to advance, skip, and return.
2. Hide all participants' votes until the facilitator explicitly and deliberately triggers the reveal.
3. Reduce average ceremony time by at least 20% for sessions with 10+ items (measurable via session duration telemetry).
4. Remove the adoption blocker for the 3 pending squads at Banco Meridional — unlocking R$ 28,000 ARR expansion.

---

## Section 4 — Impacted Personas / Jobs-to-be-done  ·  *(blocks freeze)*

| Persona | Job-to-be-done | Impact |
|---|---|---|
| **Scrum Master / Facilitator** | Run a planning ceremony with controlled pace and unbiased estimates, without manual workarounds | Primary user of the new controls. Gains full flow control: when each item is presented and when votes are revealed. |
| **Developer / Voter** | Estimate each story independently, without seeing colleagues' estimates before voting | Sees only the active item. Vote recorded, but value hidden until reveal. Less distraction, more focused estimate. |
| **Observer** *(future role — out of this scope)* | Follow the ceremony without participating in voting | Not impacted in this release. |

---

## Section 5 — Included and Excluded Scope  ·  *(blocks freeze)*

### Included

- Facilitator UI: ability to add a list of items to the queue before or during a session
- Facilitator UI: "Reveal next item" control to advance the queue one item at a time
- Participant UI: view of only the current active item (no visibility into queued items)
- Vote hiding: all votes remain hidden until the facilitator triggers "Reveal votes"
- Facilitator UI: "Reveal votes" control, available at any time after voting starts
- Session state: persistence of queue order and reveal state across reconnections
- Basic facilitator controls: skip item, return to previous item, end session
- Session telemetry: duration per item and per session (required to measure objectives)

### Excluded

- Per-item timer with auto-advance (separate backlog)
- Automatic reveal after all votes submitted (could be a preference toggle — future phase)
- Voting result export or reports (existing feature, no changes)
- Mobile-specific redesign (existing mobile layout applies)
- Multi-facilitator co-control (single-facilitator model per session remains in this release)
- Jira/Linear integration for direct story import into the queue

### Deferred (future phases)

- Auto-reveal after all participants vote (optional toggle) → feeds Roadmap Phase 2
- Queue template reuse between sessions → feeds Phase 2
- Per-item timer → feeds Phase 2
- Co-facilitator mode → feeds Phase 2
- Ceremony analytics dashboard → feeds Phase 3

---

## Section 6 — Business Rules and Flows  ·  *(blocks freeze)*

### Queue Management Rules

1. Only the facilitator can add, reorder, or remove items from the queue.
2. Items in the queue are not visible to participants until explicitly revealed by the facilitator.
3. The facilitator can reveal items in sequence or skip ahead — but cannot "un-reveal" an already-revealed item without ending and restarting the session for that item.
4. A session can have at most 100 queued items (operational limit — to confirm with Tech Lead at breakdown).
5. The facilitator can return to an already-revealed item for re-voting; on return, the previous item's vote state is preserved in the session history.

### Vote Hiding Rules

1. Once a participant submits a vote, it is recorded and displayed only as "Voted" (binary indicator — without the value) to all other participants.
2. The facilitator sees the count of submitted votes, but not the values, until they trigger the reveal.
3. The facilitator triggers "Reveal votes" at any time — this displays all submitted votes simultaneously to all participants.
4. Hiding is enforced **server-side**: vote values are not included in WebSocket broadcast payloads to participants before the reveal event. The client is not responsible for hiding — the server is.
5. Participants who have not voted when the reveal is triggered will have their slot displayed as "Did not vote" — without blocking the flow.
6. After the reveal, the facilitator can advance to the next item or request re-voting on the current item.

### State Transition Flow

```text
Session created
    ↓
Facilitator loads the queue (1..N items, max 100)
    ↓
Facilitator reveals item 1  →  [Active item: voting open]
    ↓
Participants vote  →  each vote displayed as "Voted" (value hidden)
    ↓
Facilitator triggers "Reveal votes"
    ↓
All votes displayed simultaneously  →  [Active item: votes revealed]
    ↓
Facilitator: advance to item 2  |  re-vote current item  |  skip  |  end session
    ↓
[repeat for each item in queue]
    ↓
Session ended  →  results history available
```

---

## Section 7 — User Stories + Acceptance Criteria  ·  *(blocks freeze)*

### ST-001 — Load and Manage the Item Queue

**As** a facilitator,
**I want** to add a list of stories/questions to the session queue and control it during the ceremony,
**so that** I can run the planning in order and at my pace, without exposing upcoming items.

**Acceptance Criteria:**

- [ ] **Given** I am the facilitator of an active session, **when** I access the control panel, **then** I see a field to add items to the queue (free text, one per line or one at a time).
- [ ] **Given** I have added items to the queue, **when** I check the participants' view, **then** queued items do not appear to any participant — only the active item is visible.
- [ ] **Given** the queue has pending items, **when** I trigger "Reveal next item", **then** the next item in the queue becomes the active item and is displayed to all participants.
- [ ] **Given** I am the facilitator, **when** I trigger "Skip item", **then** the current item is marked as skipped in the history and the next item becomes active.
- [ ] **Given** I am the facilitator, **when** I trigger "Return to previous item", **then** the preceding item becomes active again with its vote history preserved.

### ST-002 — Vote Hiding and Reveal

**As** a facilitator,
**I want** participants' votes to remain hidden until I reveal them,
**so that** each voter forms their estimate independently, without being influenced by colleagues.

**Acceptance Criteria:**

- [ ] **Given** a participant submits a vote, **when** another participant checks the screen, **then** they see "Voted" next to their colleague's name — without the estimate value.
- [ ] **Given** the facilitator checks the panel before the reveal, **when** they view the votes, **then** they see the count of participants who voted, but not the individual values.
- [ ] **Given** the facilitator triggers "Reveal votes", **when** the event is processed, **then** all submitted votes are displayed simultaneously to all participants in ≤ 500ms.
- [ ] **Given** a participant did not vote when the facilitator triggers the reveal, **when** the reveal occurs, **then** that participant's slot is displayed as "Did not vote" — without blocking the flow.
- [ ] **Given** the reveal has occurred, **when** a participant attempts to inspect WebSocket payloads received before the reveal, **then** vote values are not present in those payloads (verification: penetration test on the reveal flow).

### ST-003 — State Persistence on Reconnection

**As** a facilitator or participant,
**I want** session state (queue, active item, votes) to be restored if I temporarily disconnect,
**so that** a connection drop does not destroy ceremony progress.

**Acceptance Criteria:**

- [ ] **Given** the facilitator disconnects, **when** they reconnect within 5 minutes, **then** the queue state, active item, and all submitted votes are restored exactly as they were.
- [ ] **Given** the facilitator disconnects and does not reconnect within 5 minutes, **when** the grace period expires, **then** the session ends cleanly and participants receive an end-of-session notification.
- [ ] **Given** a participant disconnects during an active vote and reconnects, **when** they return to the session, **then** they see the current active item and can vote normally; if they had already voted, their vote is preserved.

---

## Section 8 — Non-Functional Requirements (NFRs)  ·  *(blocks freeze)*

> Gap #1 that causes rework. Applicable dimensions filled in. The PO describes the **quality requirement**; feasibility and the *how* belong to the Technical Assessment (not requested in this case — Tech Lead validates at breakdown).

| Dimension | Requirement | How it will be verified |
|---|---|---|
| **Performance / Efficiency** | Vote reveal (`votes_revealed`) propagated to all room participants in ≤ 500ms under normal usage conditions | Load test with 30+ concurrent participants before release |
| **Reliability** | Session state (queue + active item + votes) restored in full after facilitator reconnection within 5 minutes | Forced reconnection test in QA environment; state verification before and after |
| **Security** | Vote values not included in WebSocket broadcast payloads to participants before the `votes_revealed` event. Hiding enforced server-side, with no dependency on client logic | Penetration test on the reveal flow; WebSocket payload inspection |
| **Usability** | Facilitator can configure and operate the queue + vote reveal without prior training or support | Validation with at least 1 Banco Meridional Scrum Master before release (CS coordinates) |
| **Compatibility** | Feature operational on the browsers and devices already supported by the platform. Existing mobile layout applies without adjustments. | Regression tests on current smoke test browsers |
| **Maintainability** | Feature deployable without downtime of active sessions (incremental deploy). New telemetry events (duration per item) available from first deploy. | Rollout strategy validated in Tech Backlog; metrics verification post-deploy |

---

## Section 9 — Edge Cases and Failure Modes  ·  *(blocks freeze)*

- **Participant enters during active item:** sees the current active item and can vote normally. Queue position (how many items remain) is not displayed to the participant.
- **Participant enters after votes have been revealed for an item:** sees the active item with votes already revealed. Can start the next item normally.
- **Facilitator disconnects during active vote:** session pauses automatically (does not advance). 5-minute grace period for reconnection with state restoration. After 5 min, session ends cleanly with notification to all participants.
- **All participants vote before the reveal:** the facilitator still controls the reveal timing. No auto-reveal in this release (this is expected behavior, not a bug).
- **Facilitator skips an item:** item marked as "Skipped" in the session history. Can be resumed with "Return to previous item" if it is the immediately preceding item.
- **Partial votes at reveal time:** participants who did not vote have their slot displayed as "Did not vote". The flow is not blocked. The facilitator decides whether to re-vote the item or advance.
- **Participant reconnection during active item:** participant reconnects, sees the active item, and can vote if they have not yet. If they already voted, the vote is preserved and displayed as "Voted".
- **Empty queue when triggering "Reveal next item":** control disabled when there is no next item. Facilitator sees a visual indication of "All items completed".
- **Schema migration conflict with active sessions:** schema migration runs only on sessions with `ended` status. Active sessions use the previous schema until natural close.
- **WebSocket event ordering under load (30+ participants):** expected behavior is eventual consistency — vote reveal is idempotent (revealing the same item twice is harmless). Load test before release verifies no state divergence between participants after reveal.

---

## Section 10 — Success Metrics (primary · secondary · guardrail)  ·  *(blocks freeze)*

> These are the **projected** values — the baseline that [`../../../metrics.md`](../../../metrics.md) compares against measured post-rollout. Includes *leading* and *lagging* indicators and two **guardrails** (metrics that must not worsen).

| Type | Metric | Target (projected) | Measurement window | Measurement (who/how) | Confidence |
|---|---|---|---|---|---|
| **Primary** | Average ceremony duration with 10+ items (Banco Meridional cohort) | ≥ 20% reduction vs. pre-release baseline | 30 days post-release | Session duration telemetry — before/after comparison for the account | 75 |
| **Primary** | Banco Meridional renewal | Contract renewed before expiry date | By ~2026-06-10 | CS tracks renewal outcome | 85 |
| **Secondary** | Additional squad adoption at Banco Meridional | 3 new squads activated within 60 days of release | 60 days post-release | Account dashboard — squad activation count | 70 |
| **Secondary** | Facilitator satisfaction | ≥ 4.5/5 in post-ceremony survey | 30 days post-release | CS follow-up with account (if survey is activated) | 55 |
| **Guardrail** | CS tickets about anchoring bias / premature vote visibility | Zero tickets on this topic post-release | Continuous post-release | CS ticket tagging | 90 |
| **Guardrail** | WebSocket error rate in sessions | Does not increase vs. pre-release baseline | 30 days post-release | Platform observability / APM | 80 |

---

## Section 11 — Release Success and Acceptance Criteria  ·  *(blocks freeze)*

High-level indicators that define "done and valuable" for **this release** — distinct from the ongoing metrics of Section 10.

| Criterion | Type | Indicator | Target value |
|---|---|---|---|
| Banco Meridional contract renewed | Business | Renewal signed before expiry date | R$ 84,000 ARR retained |
| 3 pending squads onboarded | Business | Activation confirmed in account dashboard | R$ 28,000 ARR unlocked (within 60 days of release) |
| Ceremony duration reduced | Operational | ≥ 20% drop in average session time for sessions with 10+ items | ≥ 20% reduction (measured via telemetry) |
| Manual workaround eliminated | Operational | Zero CS tickets reporting manual story sharing post-release | 0 tickets |
| Zero vote anchoring incidents | Quality | Zero CS tickets about votes visible before reveal | 0 tickets |
| Feature adopted without training | UX | Facilitators operate queue and reveal without support intervention | 0 onboarding calls about this feature |
| Deploy without impact to active sessions | Operational | Zero sessions interrupted by deploy | 0 downtime incidents related to release |

---

## Section 12 — Risks and Dependencies (product and business)  ·  *(blocks freeze)*

> Technical risks belong to the CTO's Technical Assessment (not requested in this case — validated by Tech Lead at breakdown). Product, business, adoption, and external risks are here.

| Risk | Type | Probability | Impact | Mitigation |
|---|---|---|---|---|
| Renewal deadline missed if actual effort exceeds estimate | Timeline | Low | High | PM assesses team capacity at planning start. If scope needs cutting, basic facilitator controls take precedence over advanced telemetry. |
| Banco Meridional Scrum Masters without adoption autonomy (unvalidated assumption) | External | Low | Medium | CS validates with client contact before delivery. If false, client IT involvement may delay adoption but does not block release. |
| Anchoring bias not fully eliminated (participants talk verbally) | Product | High | Low | Accepted — the platform controls only digital visibility. Correct scope. |
| Adoption by 3 pending squads slower than expected | Adoption | Medium | Medium | CS coordinates active onboarding post-release. 60-day target is conservative. |
| Low facilitator satisfaction if UX controls are not intuitive | Product | Low | Medium | Validation with at least 1 Banco Meridional Scrum Master before release. UX review with design team at breakdown. |

**Dependencies (product/business):**

- CS (Ana Costa) available to validate adoption autonomy assumption before delivery
- CS coordination for active onboarding of the 3 pending squads post-release
- PM with capacity to plan and execute within the 90-day deadline

---

## Section 13 — Preliminary Effort and Cost Assessment

> Internal use only. **Preliminary** — PO's estimate to support sequencing. The **firm** number comes from the Tech Lead in the Tech Backlog. Not a contractual commitment or client-facing material.

| Area | Preliminary estimate | Confidence |
|---|---|---|
| Backend (session state + WebSocket events) | 5 days (mid-senior) | 65 |
| Frontend — facilitator UI | 4 days (mid) | 65 |
| Frontend — participant UI | 2 days (mid) | 70 |
| QA (functional + security + load) | 3 days (QA) | 60 |
| **Preliminary total** | **14 days** | |

**Cost signals to confirm with Tech Lead:** no new infrastructure, no external services, no procurement. Opex impact: ~2–3% increase in observability storage from the added telemetry event volume — no budget action required.

---

## Section 14 — Suggested Roadmap

### MVP (this release)

- Queue management (add, order, reveal one item at a time)
- Vote hiding with facilitator-controlled reveal
- Session state persistence across reconnections (5-min grace period)
- Basic facilitator controls (skip, return, end)
- Session and per-item duration telemetry

### Phase 2 (future backlog)

- Auto-reveal after all participants vote (optional preference toggle)
- Per-item timer with optional auto-advance
- Queue template reuse between sessions
- Co-facilitator mode (multiple facilitators sharing control)

### Phase 3 (future backlog)

- Ceremony analytics dashboard (time per item, consensus rate, revision frequency)
- Jira/Linear integration for direct story import into the queue

---

## Technical Assessment Reference  ·  *(blocks freeze if requested)*

> This is the **bridge** (`TechAssessmentRef`), not content. The RP references the CTO's verdict — it does not absorb it. The merge happens in the [PRD](./04-prd-queue-voting.md).

| Field | Value |
|---|---|
| **Status** | Not requested |
| **Feasibility verdict** | — |
| **Linked Technical Assessment** | N/A |
| **Hard constraints affecting scope** | — (none identified at triage; technical assumptions validated as reasonable by Tech Lead at breakdown start) |

> **Freeze gate (`freezeReady`):** all `blocks freeze` sections are resolved in v2. Technical Assessment was not requested — no CTO signature dependency. RP frozen as of 2026-03-28.
