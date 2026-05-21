# Readiness Package — Room Access Control

## Metadata

| Field | Value |
|---|---|
| **Package ID** | RP-2024-002 |
| **Version** | v1 |
| **Linked Intake** | INT-2024-002 |
| **Owned by** | Lucas Mendes (PO) |
| **CTO contribution** | Yes — architectural assessment on participant data model and real-time session membership |
| **Status** | Approved — pending PM execution planning |
| **Current version approval date** | 2024-03-27 |

## Revision History

| Version | Date | Author | Status | Summary |
|---|---|---|---|---|
| v1 | 2024-03-27 | Lucas Mendes (PO) + Rodrigo Lima (CTO) | Approved | Initial submission. Package included full Discovery findings (Azure AD OIDC, LGPD Option C). PM approved on first review. |

---

## Section 1 — Executive Summary

The platform currently offers no access control within a planning room. Any person with the room link can join, see all participants, and vote. This model is insufficient for enterprise clients operating with mixed internal/external teams or under data governance policies that restrict participant visibility.

This package defines a **Room Access Control** system enabling the room owner to:

1. Control who can join (invite-only or approval-required access)
2. Control participant visibility (anonymous mode — voters cannot see each other's identities)
3. Assign roles within the room (voter vs. observer)

This feature is a pre-close blocker for Construtora Ágil (R$ 42.000 ARR) and has been flagged as a need in 2 additional pipeline deals. The CTO has assessed this as requiring a participant data model change with multi-tenancy implications that must be handled carefully.

---

## Section 2 — Context & Problem

### Current Scenario

Room access is entirely link-based: whoever has the URL can join. Once inside, all participants are visible to each other by name or username. There is no distinction between voters and observers. The room owner has no control over who enters or what others can see.

### Limitations

- No access gate: any person with the link enters immediately.
- No anonymity: participant identities are fully visible to all others.
- No role differentiation: everyone who joins is a voter by default.
- No mechanism to remove or restrict a participant mid-session.

### Customer Pain

Construtora Ágil's Scrum Masters run ceremonies that include external contractors. Their internal data governance policy prohibits contractor-to-contractor identity visibility. Additionally, they want product managers to attend as observers without being able to vote or influence estimates.

### Business Impact

- Deal blocker: R$ 42.000 ARR contingent on this feature
- Pipeline signal: 2 other enterprise deals with same requirement
- Compliance: Construtora Ágil cannot onboard without this — legal/governance sign-off required on their end

---

## Section 3 — Objectives

1. Enable the room owner to set access mode: open (current behavior), invite-only, or approval-required.
2. Enable the room owner to activate anonymous mode, hiding participant identities from other participants (facilitator retains full visibility).
3. Enable the room owner to assign participants as voters or observers before or during a session.
4. Enable the room owner to remove a participant from an active session.
5. Close the Construtora Ágil deal by delivering a compliant access control model within 60 days of package approval.

---

## Section 4 — Scope

### Included

- Room settings: access mode selector (Open / Invite-only / Approval-required)
- Invite-only mode: room owner sends invite links or email invitations; non-invited users are blocked
- Approval-required mode: any user with the link can request to join; room owner approves or denies in real time
- Anonymous mode: participant names replaced with randomized aliases (e.g., "Participant A", "Participant B") for non-facilitator participants; facilitator sees real names
- Role assignment: room owner assigns Voter or Observer role per participant before session starts or during session
- Observer experience: observers see the session in real time but have no voting controls
- Room owner can remove a participant at any time during an active session
- Access settings are configurable per room (not account-wide defaults in this release)

### Excluded

- Account-level default access settings (future phase)
- SSO / SAML integration for enterprise identity management (separate roadmap item)
- Audit log of who joined, when, and what they voted (future compliance phase)
- Guest access without account registration (remains out of scope)
- Room password protection (access modes above are sufficient for this release)

---

## Section 5 — Personas Impacted

| Persona | Role | Impact |
|---|---|---|
| **Room Owner (Scrum Master / Tech Lead)** | Creates and manages the room | New: configures access mode, manages invites/approvals, assigns roles, activates anonymous mode |
| **Voter (Developer / Team Member)** | Estimates items | Unchanged voting experience. In anonymous mode, sees peer aliases instead of names. |
| **Observer (Product Manager / Executive)** | Watches the ceremony | New role: joins the room, sees everything in real time, cannot vote |
| **Uninvited / Unapproved User** | Attempts to join | New: sees a waiting/blocked screen instead of entering directly |

---

## Section 6 — Business Rules & Flows

### Access Mode Rules

**Open (default)**
- Behavior unchanged from current.

**Invite-only**
1. Room owner generates invite links or sends email invitations from the room settings panel.
2. Only users who received an invitation can join.
3. A user without an invitation who attempts to join via the room URL sees: "This room requires an invitation."
4. The room owner can revoke an invitation before it is used.

**Approval-required**
1. Any user with the room URL can request to join.
2. The room owner receives a real-time notification: "User X is requesting to join."
3. Room owner approves or denies. Approved users enter immediately. Denied users see: "Your request was not approved."
4. If the room owner does not respond within 5 minutes, the request expires and the user sees: "Request expired. Contact the room owner."

### Anonymous Mode Rules

1. Anonymous mode can be activated by the room owner at any time before votes are revealed.
2. When active: all participant names are replaced with aliases for non-owner participants. Order of aliases is randomized per session.
3. The room owner always sees real names regardless of anonymous mode.
4. Aliases are consistent within a session — "Participant C" is the same person throughout.
5. Anonymous mode cannot be deactivated mid-session once activated (prevents unmasking attempts).

### Role Assignment Rules

1. Default role for any joined participant: Voter.
2. Room owner can change a participant's role to Observer before the session starts or between items.
3. Observers see the full session (items, votes after reveal) but have no voting controls.
4. A Voter can be downgraded to Observer mid-session — their previously submitted votes for the current item are voided.
5. An Observer cannot be upgraded to Voter after voting has started for the current item.

### Participant Removal Rules

1. Room owner can remove any participant at any time.
2. Removed participant sees: "You have been removed from this session."
3. Any votes submitted by the removed participant in the current item are voided.
4. Removed participants cannot rejoin via the same link in the same session.

### State Transition — Approval Flow

```text
User requests to join
    ↓
Room owner receives notification
    ↓
    ├── Approved → User enters session
    ├── Denied → User sees denial message
    └── No response in 5 min → Request expires
```

---

## Section 7 — Integrations Required

| System | Type | Detail |
|---|---|---|
| **WebSocket / real-time session layer** | Internal | New event types required: `join_request`, `join_approved`, `join_denied`, `role_changed`, `participant_removed`. Existing WebSocket infrastructure applies. |
| **Session persistence layer** | Internal | Participant records must now carry: access_mode, role, anonymous_alias, invite_token. Schema extension required — CTO has flagged multi-tenancy implications (see Section 8). |
| **Email service (optional)** | Internal/External | If invite-by-email is included in MVP, the existing transactional email provider is used. No new provider required. |
| **Authentication layer** | Internal | Invite-only and approval modes require participant identity to be verifiable at join time. Auth token validation at room entry must be enforced. |

---

## Section 8 — Technical Impact

*CTO architectural assessment completed 2024-03-25. Notes below are from CTO review.*

| Area | Impact | CTO Note |
|---|---|---|
| **Participant data model** | Significant. The current participant model is a flat session-scoped record. Adding role, access_mode, anonymous_alias, and invite_token requires a schema migration and a new participant state machine. | Migration must be backward-compatible. Existing open sessions must not be affected. |
| **Multi-tenancy** | Medium. Anonymous aliases must be scoped to the session, not the account. Invite tokens must be non-guessable and scoped to the specific room+session. | Token generation must use cryptographically secure random values. Tokens must expire after first use or session end. |
| **Real-time membership** | Medium. The WebSocket layer currently broadcasts participant list to all members. With anonymous mode, the server must filter the participant list payload per recipient — room owner gets real names, others get aliases. | Server-side filtering is mandatory. Client must never receive another participant's real name in anonymous mode payloads. |
| **Security** | High. The access control model must be enforced server-side. A participant who is denied or removed must not be able to rejoin or access session state via direct API calls. | Server must validate room membership on every WebSocket message and REST request. No client-trust for access state. |
| **Performance** | Low. Approval notifications and role changes are low-frequency events. No scalability concerns at current session volumes. | Monitor at 10x current peak if enterprise adoption accelerates. |
| **Observability** | Add telemetry: access mode distribution, approval rate, observer-to-voter ratio. | Required for product decisions in Phase 2. |

---

## Section 9 — Risks & Dependencies

| Risk | Type | Probability | Impact | Mitigation |
|---|---|---|---|---|
| Participant data model migration breaks active sessions | Technical | Low | High | Migration strategy: additive schema change only. New fields are nullable with defaults matching current behavior. Existing sessions unaffected. |
| Anonymous alias collision (two participants get same alias) | Technical | Low | Medium | Alias assignment is deterministic per session participant index. No collision possible within a session. |
| Invite token brute-force | Security | Low | High | Tokens are 128-bit cryptographically random. Expire on first use. Rate limiting on join endpoint. |
| Room owner disconnects during pending approvals | Technical | Medium | Medium | Pending approvals persist for 5 min. If room owner reconnects, queue is presented. If not, requests expire cleanly. |
| Sales timeline commitment conflict | Operational | High | High | Sales informally committed 60-day delivery to client. PM must run capacity assessment and confirm timeline to PO before Sales communicates anything further to the client. |
| Scope expansion pressure (SSO, audit logs) | Operational | Medium | Medium | Scope boundary is explicit in this package. Any additions require a new intake record. |

**Dependencies:**
- CTO availability to review participant model migration plan before Tech Lead breakdown begins
- Auth team (or Tech Lead with auth ownership) for invite token and session validation work
- QA environment with multi-tenant session simulation

---

## Section 10 — Internal Effort & Cost Assessment

> 🔒 **Internal use only.** This section is an operational planning instrument for internal decision-making. The estimates below are not commitments, not contractual obligations, and must never be shared with clients, prospects, or external stakeholders in any form. They exist to support capacity planning, prioritization trade-offs, and administrative resource allocation within the company.
>
> Estimates are based on current team seniority and known system state at the time of rationalization. They will be revised by the Tech Lead during technical breakdown. The inclusion of LGPD data residency work (Option C) and Azure AD integration increases the original estimate significantly from what was initially scoped at intake.

### Development Effort

| Area | Estimate | Seniority |
|---|---|---|
| Backend — participant model migration + state machine | 6 days | Senior |
| Backend — WebSocket event filtering (anonymous mode) | 3 days | Senior |
| Backend — access mode enforcement (invite, approval, removal) | 5 days | Mid-senior |
| Backend — Azure AD OIDC group-claim integration | 5 days | Senior |
| Backend — LGPD data residency routing (Option C, `sa-east-1`) | 10 days | Senior |
| Frontend — room owner access settings panel | 4 days | Mid |
| Frontend — participant UI (anonymous aliases, observer view, approval screen) | 3 days | Mid |
| QA (functional + security + multi-tenant + LGPD validation) | 5 days | QA |
| **Total** | **41 days** | |

> ⚠️ **Estimate note:** The original intake-level estimate (25 days) did not include Azure AD integration or LGPD data residency work. Both were added to scope during Discovery. The revised total reflects the full post-Discovery scope.

### Infrastructure Impact

No new infrastructure services. Database schema migration on existing cluster. Conditional `sa-east-1` routing requires a read-replica or write endpoint in the Brazil region — CTO to confirm whether this is already provisioned or requires a new RDS instance. If new instance required, procurement must be initiated by CTO before development begins.

### Third-party Cost Impact

None beyond existing services. Email provider is already contracted. Azure AD integration is client-side — no cost to the platform.

### Recurring Operational Cost Impact

Low-to-medium. `sa-east-1` data residency adds a Brazil-region database endpoint. Estimated monthly cost increase: TBD by CTO infrastructure review. Must be factored into pricing for LGPD-flagged tenants in future commercial planning.

### TCO Assessment

This feature adds meaningful and lasting complexity to the participant model and the infrastructure layer. Future features touching session membership (SSO, audit logs, guest access) and multi-region data residency will build on this foundation — investment here reduces marginal cost of those phases. The LGPD routing pattern, once established, becomes reusable for any future compliance region requirement.

---

## Section 11 — Success Criteria

| Metric | Target | Measurement |
|---|---|---|
| Construtora Ágil deal closed | Contract signed within 30 days of release | Sales CRM |
| Anonymous mode adoption | Used in ≥ 30% of enterprise sessions within 60 days | Session telemetry |
| Approval-mode join success rate | ≥ 95% of valid join requests approved within 2 min | Telemetry: request-to-approval latency |
| Zero unauthorized access incidents | No reported cases of removed/blocked participants accessing session data | CS tickets + security monitoring |
| Additional pipeline deals unblocked | At least 1 of 2 flagged pipeline deals advances to close within 90 days | Sales CRM |

---

## Section 12 — Suggested Roadmap

### MVP (this release)

- Access modes: Open / Invite-only / Approval-required
- Anonymous mode
- Voter / Observer role assignment
- Participant removal
- Server-side enforcement of all access rules

### Phase 2 (future backlog)

- Account-level default access settings
- Audit log: who joined, when, role, votes submitted
- Bulk invite via CSV or team roster
- Automatic observer assignment for non-engineering roles (based on account role configuration)

### Phase 3 (future backlog)

- SSO / SAML integration for enterprise identity management
- Compliance export (session audit report for governance purposes)
- Guest access without account registration (scoped, time-limited tokens)
