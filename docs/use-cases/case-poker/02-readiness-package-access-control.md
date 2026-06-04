# Readiness Package — Room Access Control

> The Readiness Package (RP) is the **product definition of done** — the PO's product output, written **alone**. It is a complete and self-sufficient document: vision, problem, scope, rules, user stories, NFRs, edge cases, criteria, and metrics. **The RP contains no sections authored by the CTO.** The technical assessment lives in a separate artifact — the [Technical Assessment](./03-technical-assessment-access-control.md) (CTO) — which the RP only **references** (see "Technical Assessment Reference"). The merge of both happens in the [PRD](./04-prd-access-control.md), and it is the PRD — not the RP — that opens the downstream. See [`personas/02-po.md` §2 and §6.2](../../../personas/02-po.md).
>
> The RP **inherits the confidence layer** from the linked Intake Record ([`01-intake-record-access-control.md`](./01-intake-record-access-control.md)): what entered as an assumption, Discovery unknown, or delegated answer does not disappear at rationalization — it is resolved, or carried forward explicitly.
>
> **Journey:** [`00 Submitter Brief`](./00-submitter-brief-access-control.md) → [`01 Intake Record (PO — triage)`](./01-intake-record-access-control.md) → `02 Readiness Package (PO)` → [`03 Technical Assessment (CTO)`](./03-technical-assessment-access-control.md) → [`04 PRD (PO+CTO → PM)`](./04-prd-access-control.md).

## Metadata

| Field | Value |
|---|---|
| **Package ID** | RP-2026-002 |
| **Version** | v1 |
| **Linked Intake** | INT-2026-002 |
| **Owner** | Lucas Mendes (PO) |
| **CTO Escalation** | Yes — Technical Assessment TA-2026-002 |
| **Status** | Frozen |
| **Freeze date** | 2026-03-27 |

## Revision History

| Version | Date | Author | Status | Summary |
|---|---|---|---|---|
| v1 | 2026-03-27 | Lucas Mendes (PO) | Frozen | Initial submission. Includes complete Discovery findings (Azure AD OIDC, LGPD Option C). Technical Assessment TA-2026-002 signed by CTO. |

---

## Inherited readiness and open dispositions

> Summary of what the Intake delivered and what remains *soft* at execution entry.

| Field | Value |
|---|---|
| **Readiness Score at Intake handoff** | 84 % |
| **Assumptions still to validate** | (1) Construtora Ágil IT team completes Azure AD registration within the delivery window — owner: Fernanda Ramos, track at project start; (2) Azure AD integration does not require auth layer rewrite — confirmed by CTO in Discovery ✓ |
| **Discovery unknowns** | All resolved: Azure AD via OIDC (feasible), Jira (removed from scope), LGPD Option C (added to scope) |
| **Delegated requirements (with owner)** | — |

> The assumption about client Azure AD registration remains the primary external timeline risk. If Construtora Ágil IT delays, the delivery deadline slips with no internal technical mitigation.

---

## Section 1 — Executive Summary  ·  *(blocks freeze)*

The platform currently offers no access control within a planning room. Anyone with the room link enters, sees all participants' names, and can vote. This model is insufficient for enterprise clients that operate with mixed teams — internal staff, external contractors, and managers — under data governance policies that restrict cross-visibility of identities.

This Readiness Package defines a **Room Access Control** system that allows the room owner to: (1) control who can enter (open access, invite-only, or mandatory approval); (2) control participant visibility via anonymous mode; and (3) assign and manage Voter/Observer roles in real time. All access rules are enforced server-side — no client trust for access state.

This feature is the pre-close blocker for Construtora Ágil (R$ 42,000 ARR) and was signaled as a requirement by 2 additional enterprise pipeline deals in Q1. The 7-day Discovery (2026-03-18 to 2026-03-25) resolved the three integration unknowns: Azure AD OIDC integration (feasible), Jira requirement (removed from scope), and LGPD data residency (Option C — `sa-east-1` routing for clients with LGPD flag). Technical content (data model, multi-tenancy, Azure AD, LGPD, effort, and firm cost) lives in Technical Assessment TA-2026-002 and is referenced via `TechAssessmentRef` at the end of this document.

---

## Section 2 — Context and Problem (the pain, not the solution)  ·  *(blocks freeze)*

### Current Scenario

Room access is entirely link-based: anyone with the URL enters immediately. Once inside, all participants are visible to each other by name or username. There is no distinction between voters and observers. The room owner has no control over who enters or what others can see.

### Limitations

- No entry gate: anyone with the link enters without approval.
- No anonymity: participant identities are fully visible to everyone.
- No role differentiation: everyone who enters is a voter by default.
- No mechanism to remove or restrict a participant during the session.

### Client Pain

Construtora Ágil Scrum Masters run ceremonies that include external contractors. The company's internal data governance policy prohibits identity visibility between contractors and employees in planning sessions. Additionally, product managers and executives want to participate as observers without being able to vote or influence estimates. The result is that the company cannot use the platform for its real ceremonies — only for purely internal teams, which are a minority in their operating model.

### Business Impact

- Deal blocker: R$ 42,000 ARR contingent on this feature. Contract does not close without it.
- Pipeline signal: 2 additional enterprise deals with the same requirement identified in Q1.
- Compliance: Construtora Ágil cannot onboard without LGPD compliance confirmation. IT Lead sign-off (Fernanda Ramos) is the go-live gate.

---

## Section 3 — Objectives and Expected Outcome  ·  *(blocks freeze)*

1. Allow the room owner to set the access mode: Open (current behavior), Invite-only, or Mandatory approval — configurable per room.
2. Allow the room owner to activate anonymous mode, hiding participant identities from each other (the owner retains full visibility of real names).
3. Allow the room owner to assign Voter or Observer roles to any participant, before or during a session.
4. Allow the room owner to remove a participant from an active session with immediate effect.
5. Close the Construtora Ágil deal by delivering an access control model compliant with the stated requirements within the timeline enabled by the PM.

---

## Section 4 — Impacted Personas / Jobs-to-be-done  ·  *(blocks freeze)*

| Persona | Job-to-be-done | Impact |
|---|---|---|
| **Room Owner (Scrum Master / Tech Lead)** | Run planning ceremonies with mixed teams in a controlled manner compliant with internal policies | New: configures access mode, manages invites/approvals, assigns roles, activates anonymous mode |
| **Voter (Developer / Team Member)** | Estimate backlog items collaboratively | Voting experience unchanged. In anonymous mode, sees colleague aliases instead of real names. |
| **Observer (Product Manager / Executive)** | Follow the ceremony and gain visibility into estimates without interfering with the process | New role: enters the room, sees everything in real time (items, revealed votes), has no voting controls |
| **Uninvited / Unapproved User** | (attempts to enter the room) | New: sees a waiting screen or block instead of entering directly |

---

## Section 5 — Included and Excluded Scope  ·  *(blocks freeze)*

> Protects downstream from scope creep.

### Included

- Room settings: access mode selector (Open / Invite-only / Mandatory approval)
- Invite-only mode: room owner generates individual invite links or sends email invites; uninvited users are blocked
- Mandatory approval mode: user with URL requests entry; owner approves or denies in real time; request expires in 5 min without response
- Anonymous mode: participant names replaced by randomized aliases for non-owner participants; owner sees real names
- Role assignment: room owner assigns Voter or Observer per participant before or during the session
- Observer experience: sees the session in real time, no voting controls
- Participant removal: owner can remove any participant at any time; current-item votes are voided; removed participant cannot re-enter the same session via the same link
- Access settings are per room (not account-level defaults in this release)

### Excluded

- Account-level default access settings (future phase)
- Enterprise SSO / SAML integration (separate roadmap item)
- Audit log of who entered, when, and what they voted (future compliance phase)
- Guest access without account registration
- Room password protection
- Jira integration for participant pre-population (`BACKLOG-2026-007`)

### Deferred (future phases)

- Bulk invite via CSV or team roster
- Automatic Observer assignment by organizational role
- Compliance export for governance
- Organization-level default access settings — feeds Phase 2

---

## Section 6 — Business Rules and Flows  ·  *(blocks freeze)*

### Access Mode Rules

**Open (default)**
- Behavior unchanged from current. Existing open-link rooms are not affected by the delivery of this feature.

**Invite-only**
1. Room owner generates individual invite links or sends email invites via the room settings panel.
2. Only users who received a valid invite can enter.
3. A user without an invite who tries to enter via the room URL sees: "This room requires an invite."
4. The room owner can revoke an invite before it is used.
5. Invite tokens are cryptographically secure (128 bits), single-use, and expire at end of session.

**Mandatory approval**
1. Any user with the room URL can request entry.
2. The owner receives a real-time notification: "User X is requesting entry."
3. Owner approves or denies. Approved users enter immediately. Denied users see: "Your request was not approved."
4. If the owner does not respond within 5 minutes, the request expires: "Request expired. Contact the room owner."

### Anonymous Mode Rules

1. Anonymous mode can be activated by the owner at any time before votes are revealed.
2. When active: all participants' names are replaced by aliases for non-owner participants. Alias order is randomized per session.
3. The room owner **always** sees real names, regardless of anonymous mode.
4. Aliases are consistent within a session — "Participant C" is the same person throughout the session.
5. Anonymous mode **cannot be deactivated** during the session once activated, to prevent unmasking attempts.
6. Identity filtering is done server-side: the client never receives another participant's real name in anonymous mode payloads.

### Role Assignment Rules

1. Default role for any participant who has entered: Voter.
2. The room owner can change a participant's role to Observer before the session starts or between voting items.
3. Observers see the full session (items, votes after reveal), but have no voting controls.
4. A Voter downgraded to Observer during the session has their current-item votes voided.
5. An Observer cannot be promoted to Voter after voting has started for the current item.

### Participant Removal Rules

1. The room owner can remove any participant at any time during the session.
2. The removed participant receives: "You have been removed from this session."
3. Any votes submitted by the removed participant on the current item are voided.
4. Removed participants cannot re-enter via the same link in the same session.

### State Transition Flow — Entry Approval

```text
User requests entry (Mandatory approval mode)
    ↓
Server persists pending request (TTL: 5 min)
    ↓
Room owner receives real-time notification (WebSocket)
    ↓
    ├── Approved  → User enters session with Voter role (default)
    ├── Denied    → User sees denial message; request closed
    └── No response in 5 min → Request expires; user sees expiry message
```

### Participant Removal Flow

```text
Owner triggers removal of participant X
    ↓
Server immediately invalidates X's session membership
    ↓
X's pending votes on the current item are voided
    ↓
Participant X receives notification and is disconnected
    ↓
Future re-entry attempts via the same link are blocked server-side
```

---

## Section 7 — User Stories + Acceptance Criteria  ·  *(blocks freeze)*

### ST-001 — Configure Room Access Mode

**As** a Scrum Master (room owner),
**I want** to choose the room access mode before the session starts,
**so that** I can control who can enter based on the ceremony profile.

**Acceptance Criteria:**

- [ ] **Given** I am on the room settings screen, **when** I select "Invite-only", **then** the mode is saved and new entry attempts without an invite are blocked immediately.
- [ ] **Given** I am on the room settings screen, **when** I select "Mandatory approval", **then** the mode is saved and new entry attempts trigger an approval request to me.
- [ ] **Given** a room is in "Invite-only" or "Mandatory approval" mode, **when** I change it to "Open", **then** restrictions are removed and link-based access works again without blocking.
- [ ] **Given** a room was created before this feature, **when** it is accessed, **then** its access mode is "Open" by default, without breaking current behavior.

---

### ST-002 — Generate and Revoke Invite

**As** a Scrum Master (room owner in Invite-only mode),
**I want** to generate individual invite links and be able to revoke them,
**so that** I precisely control who has access.

**Acceptance Criteria:**

- [ ] **Given** the room is in Invite-only mode, **when** I generate an invite, **then** I receive a unique, non-guessable link valid until end of session.
- [ ] **Given** a generated invite, **when** I revoke it before it is used, **then** the link becomes invalid and anyone trying to use it sees "This invite is no longer valid."
- [ ] **Given** a used invite (entry confirmed), **when** the participant enters, **then** the token is invalidated and cannot be reused by another user.

---

### ST-003 — Request Entry with Mandatory Approval

**As** a participant (guest without explicit invite),
**I want** to request entry into a room with mandatory approval,
**so that** the room owner can authorize me to participate.

**Acceptance Criteria:**

- [ ] **Given** the room is in Mandatory approval mode, **when** I access the room URL without an invite, **then** I see a waiting screen with the message "Waiting for room owner approval."
- [ ] **Given** a pending request, **when** the room owner approves, **then** I enter the session with Voter role in less than 2 seconds.
- [ ] **Given** a pending request, **when** the room owner denies, **then** I see "Your request was not approved."
- [ ] **Given** a pending request without response for 5 minutes, **when** the TTL expires, **then** I see "Request expired. Contact the room owner."

---

### ST-004 — Activate Anonymous Mode

**As** a Scrum Master (room owner),
**I want** to activate anonymous mode before votes are revealed,
**so that** participants do not know who voted what and the client's privacy policy is met.

**Acceptance Criteria:**

- [ ] **Given** I activate anonymous mode, **when** any non-owner participant views the participant list, **then** they see only aliases ("Participant A", "Participant B", etc.) — never real names.
- [ ] **Given** anonymous mode is active, **when** I view the list as room owner, **then** I see all participants' real names.
- [ ] **Given** anonymous mode is active, **when** I inspect the WebSocket payload received by a non-owner participant's client, **then** the payload contains only aliases — no real names are present in the response.
- [ ] **Given** anonymous mode has been activated, **when** I attempt to deactivate it during the same session, **then** the action is blocked with the message "Anonymous mode cannot be deactivated after the session starts."
- [ ] **Given** anonymous mode is active, **when** the same participant is observed at different points in the session, **then** their alias remains the same throughout the session.

---

### ST-005 — Assign Voter / Observer Role

**As** a Scrum Master (room owner),
**I want** to assign or change participants' roles between Voter and Observer,
**so that** product managers and executives can follow along without influencing estimates.

**Acceptance Criteria:**

- [ ] **Given** a participant has the Voter role, **when** I change them to Observer between voting items, **then** voting controls disappear from their interface immediately.
- [ ] **Given** I am mid-vote and downgrade a Voter to Observer, **when** the change is applied, **then** any votes already submitted by them on the current item are voided and they do not appear in the item results.
- [ ] **Given** a participant has the Observer role after voting has started on an item, **when** I attempt to promote them to Voter, **then** the action is blocked with the message "Cannot promote to Voter during item voting."
- [ ] **Given** I am an Observer, **when** the session is active, **then** I see all items, revealed votes, and the session panel, but my interface has no voting controls.

---

### ST-006 — Remove Participant from Session

**As** a Scrum Master (room owner),
**I want** to remove a participant from the active session,
**so that** I can handle unauthorized entries or behavior issues during the ceremony.

**Acceptance Criteria:**

- [ ] **Given** I trigger the removal of a participant, **when** the action is confirmed, **then** they are disconnected in less than 2 seconds and see "You have been removed from this session."
- [ ] **Given** the removed participant was a Voter with a submitted vote on the current item, **when** the removal occurs, **then** the vote is voided from the current item results.
- [ ] **Given** a participant has been removed, **when** they attempt to re-enter via the same URL in the same session, **then** they see "You do not have permission to enter this session."

---

## Section 8 — Non-Functional Requirements (NFRs)  ·  *(blocks freeze)*

> The PO describes the **quality requirement**; feasibility and the *how* belong to the Technical Assessment.

| Dimension | Requirement | How it will be verified |
|---|---|---|
| **Performance / Efficiency** | Entry request notification, approval/denial, and participant removal propagate in ≤ 2 seconds to all clients connected to the room | Measurement via WebSocket event latency telemetry in load tests with 20-participant sessions |
| **Reliability** | Pending approval requests persist on the server for 5 minutes even if the owner reconnects during that period | Reconnection test: disconnect and reconnect owner during pending approval and verify queue is presented on reconnect |
| **Security** | Access model (access mode, role, removal) is enforced server-side. Client never receives real names in anonymous mode payloads. Removed participants cannot access session state via direct API or WebSocket calls. | Security tests: WebSocket message replay after removal must be rejected with authorization error; anonymous mode payload inspection must contain no real names |
| **Security** | Invite tokens are 128-bit cryptographically random, single-use, expire at end of session. | Code review + token reuse attempt test after first use |
| **Usability** | Room owner can configure access mode, activate anonymous mode, and assign roles without training or consulting documentation | Usability test with a Construtora Ágil Scrum Master before go-live |
| **Compatibility** | Feature operates on the same browsers and devices supported by the current platform | Smoke test on current support environments (Chrome, Firefox, Safari, Edge — latest stable version) |
| **Maintainability** | Access control is per-room opt-in via a disableable feature flag without redevelopment | Staging verification with flag off: open-room behavior preserved; with flag on: new behavior active |
| **Maintainability** | Product telemetry added: access mode distribution, approval/denial rate, Observer/Voter ratio, anonymous mode usage per enterprise session | Verify presence of events in the data pipeline before go-live |
| **Compliance** | Identity data for participants from clients with LGPD flag is stored and processed only in `sa-east-1` | Data residency verification by CTO before go-live with Construtora Ágil; confirmation from Fernanda Ramos (IT Lead) |

---

## Section 9 — Edge Cases and Failure Modes  ·  *(blocks freeze)*

- **Room owner disconnects with pending approvals:** Pending approvals persist on the server for 5 min. If the owner reconnects within TTL, the queue is presented. If TTL expires, requests expire and users receive an expiry message.
- **Room owner removed from their own room (implementation error):** The system must not allow the room owner to be removed by any participant, including themselves. The removal action must be blocked by the server if the target is the owner.
- **Two simultaneous owners approve/deny the same request:** The server processes the first response and ignores the second (idempotence). The participant does not enter twice nor receive conflicting messages.
- **Participant in active vote has role changed to Observer:** Votes submitted on the current item are voided. Implementation must ensure the voiding is atomic with the role change — no inconsistent state where the vote persists but the role is Observer.
- **Anonymous mode activated with voting already in progress:** Aliases are assigned immediately for all participants. Real names that may have been visible before activation are not retroactively hidden in chat history or already-sent notifications — this is an accepted and expected behavior.
- **Anonymous alias collision:** Alias assignment is deterministic by participant index in the session. Collision within a session is impossible by design.
- **Invite token leaked (forwarded to a third party):** The token is single-use — the first entry invalidates it. If the link is used by a third party before the original invitee, the original invitee will see the error "Invite already used." The owner must generate a new invite.
- **Bypass attempt via direct API (REST or WebSocket call without membership):** The server validates room membership on every WebSocket message and on every REST request. Without valid membership, the request is rejected with an authorization error (401/403). No client trust for access state.
- **Active session in Open mode migrated to Invite-only or Approval:** Participants already in the room are not affected (not removed). Only new entry attempts are blocked.

---

## Section 10 — Success Metrics (primary · secondary · guardrail)  ·  *(blocks freeze)*

> Projected values — the baseline that `metrics.md` compares against measured post-rollout.

| Type | Metric | Target (projected) | Measurement window | Measurement (who/how) | Confidence |
|---|---|---|---|---|---|
| **Primary** | Construtora Ágil contract closed | Contract signed | Within 30 days of release | Sales CRM (Rafael Souza) | 85 |
| **Primary** | Anonymous mode adoption in enterprise sessions | ≥ 30% of enterprise-tier sessions | 60 days post-release | Session telemetry (enterprise tier filter) | 65 |
| **Secondary** | Entry success rate in Mandatory approval mode | ≥ 95% of valid requests approved in ≤ 2 min | 30 days post-release | Telemetry: request-to-approval latency | 70 |
| **Secondary** | Additional pipeline deals unblocked | ≥ 1 of the 2 signaled deals advances to close | 90 days post-release | Sales CRM | 60 |
| **Guardrail** | Unauthorized access incidents after go-live | 0 incidents reported | Continuous, from release | CS tickets + security monitoring | 90 |
| **Guardrail** | Voting latency in open rooms (unaffected) | No measurable degradation vs. pre-release baseline | 30 days post-release | Voting session performance telemetry | 85 |

---

## Section 11 — Release Success and Acceptance Criteria  ·  *(blocks freeze)*

| Criterion | Type | Indicator | Target value |
|---|---|---|---|
| Construtora Ágil contract closed | Business | Contract signed after release | R$ 42,000 ARR |
| LGPD compliance confirmed by client | Compliance | Fernanda Ramos (IT Lead) confirms data residency before go-live | Formal sign-off |
| Azure AD mapping working end-to-end | Technical | Employees and contractors automatically receive correct roles via group-claim | 100% in UAT with Construtora Ágil |
| Zero unauthorized access incidents | Security | No reported cases of removed/blocked participants accessing session data | 0 incidents in first 30 days |
| Backward compatibility preserved | Quality | Existing open rooms work without changes after release | Confirmed in regression tests |

---

## Section 12 — Risks and Dependencies (product and business)  ·  *(blocks freeze)*

> **Technical** risks live in Technical Assessment TA-2026-002. Product, business, adoption, and compliance risks are here.

| Risk | Type | Probability | Impact | Mitigation |
|---|---|---|---|---|
| Azure AD registration delayed by Construtora Ágil IT | External | Medium | High | Deliver technical spec and registration checklist to client IT (Fernanda Ramos) at project start. Include registration close date as external milestone in execution plan. |
| Sales' informal deadline commitment conflicts with actual capacity | Operational | High | High | PM runs capacity assessment before any date is communicated externally. PO owns this gate. Sales was notified: no date can be confirmed before PM assessment. |
| Scope expansion pressure (SSO, audit logs, guest access) | Product / Scope | Medium | Medium | Explicit scope boundary in this package. Any addition requires a new intake record with PO. |
| Anonymous mode adoption below target (30%) | Adoption | Low | Low | Track telemetry in first 60 days. If below target, investigate with CS and Construtora Ágil before drawing conclusions about the gap. |
| Jira integration pressured from desirable to mandatory during delivery | Scope | Low | Medium | Defined as backlog (`BACKLOG-2026-007`) on client call. Any escalation must be re-triaged by PO. |

**Dependencies (product/business):**
- Construtora Ágil IT action: platform registration in the client's Azure AD portal. Target date to be set in PM's execution plan.
- PM capacity assessment before any deadline communication to Sales or client.
- QA environment availability with multi-tenant session simulation for anonymous mode and access control testing.

---

## Section 13 — Preliminary Effort and Cost Assessment

> Internal use only. **Preliminary** — PO's guess to support sequencing. The **firm** number comes from the CTO in Technical Assessment TA-2026-002.

| Area | Preliminary estimate | Confidence |
|---|---|---|
| Backend (data model, auth, access, Azure AD, LGPD) | ~18 days | Low |
| Frontend (settings panel, participant UI) | ~6 days | Low |
| QA | ~5 days | Low |
| **Preliminary total** | **~29 days** | Low |

**Cost signals to confirm with CTO:** conditional `sa-east-1` routing (Option C) may require a new RDS instance in the Brazil region — procurement must be initiated by CTO before development starts if confirmed as necessary.

> The firm number is **25 days**, per TA-2026-002. The PO's preliminary estimate was ~29 days — the difference is explained by the additional granularity the CTO applied in separating effort across technical areas.

---

## Section 14 — Suggested Roadmap

### MVP (this release)

- Access modes: Open / Invite-only / Mandatory approval
- Anonymous mode with server-side filtering
- Voter / Observer role assignment
- Participant removal with immediate effect
- Server-side enforcement of all access rules (no client trust)

### Phase 2 (future backlog)

- Account-level default access settings
- Audit log: who entered, when, role, submitted votes
- Bulk invite via CSV or team roster
- Automatic Observer assignment for non-technical roles (based on account role configuration)

### Phase 3 (future backlog)

- SSO / SAML integration for enterprise identity management
- Compliance export (session audit report for governance purposes)
- Guest access without account registration (time-limited scoped tokens)
- Jira integration for participant pre-population by sprint (`BACKLOG-2026-007`)

---

## Technical Assessment Reference  ·  *(blocks freeze if requested)*

> This is the **bridge** (`TechAssessmentRef`), not content. The RP references the CTO's verdict — it does not absorb it. All architectural content (participant data model, multi-tenancy, Azure AD OIDC, LGPD `sa-east-1`, technical risks, ADRs, and firm effort) lives in [`03-technical-assessment-access-control.md`](./03-technical-assessment-access-control.md). The merge happens in the [PRD](./04-prd-access-control.md). See [`personas/02-po.md` §5 and §10](../../../personas/02-po.md).

| Field | Value |
|---|---|
| **Status** | Signed |
| **Feasibility verdict** | Feasible with caveats |
| **Linked Technical Assessment** | TA-2026-002 v1 — [`./03-technical-assessment-access-control.md`](./03-technical-assessment-access-control.md) |
| **Hard constraints affecting scope** | (1) LGPD: participant data for clients with LGPD flag must reside in `sa-east-1` — conditional routing (Option C) is in scope and adds ~2 weeks of effort; (2) new RDS instance in `sa-east-1` may be required — procurement initiated by CTO; (3) Azure AD integration is via OIDC group-claim only (no full SSO) — scope confirmed |

> **Freeze gate:** all `blocks freeze` sections are resolved **and** `TechAssessmentRef.Status = Signed`. RP-2026-002 frozen on 2026-03-27. `freezeReady = true`.
