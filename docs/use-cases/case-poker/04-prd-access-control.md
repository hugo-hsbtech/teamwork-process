# PRD — Room Access Control

> The PRD (Product Requirements Document) is the **merger** of the [Readiness Package](./02-readiness-package-access-control.md) (product, authored by the PO) with the [Technical Assessment](./03-technical-assessment-access-control.md) (technical, authored by the CTO). It is the **only artifact that opens the downstream** — delivered to the **PM**. Each half retains clear authorship: the PO does not write the technical part, the CTO does not rewrite the product. The PRD stitches, reconciles, and exposes to the PM what they need to plan. See [`personas/02-po.md` §2, §10 and §11](../../../personas/02-po.md).
>
> `PRD = RP-2026-002 (PO) + TA-2026-002 (CTO)`
>
> **Journey:** [`00 Submitter Document`](./00-submitter-brief-access-control.md) → [`01 Intake Record (PO — triage)`](./01-intake-record-access-control.md) → [`02 Readiness Package (PO)`](./02-readiness-package-access-control.md) → [`03 Technical Assessment (CTO)`](./03-technical-assessment-access-control.md) → `04 PRD (PO+CTO → PM)`.

## Metadata

| Field | Value |
|---|---|
| **PRD ID** | PRD-2026-002 |
| **Version** | v1 |
| **Linked RP** | RP-2026-002 v1 |
| **Linked Technical Assessment** | TA-2026-002 v1 |
| **Linked Intake** | INT-2026-002 |
| **Authors** | Lucas Mendes (PO) + Rodrigo Lima (CTO) |
| **Status** | Accepted |
| **Delivered to PM on** | 2026-03-27 |

## Revision History

| Version | Date | Author | Status | Summary |
|---|---|---|---|---|
| v1 | 2026-03-27 | Lucas Mendes (PO) + Rodrigo Lima (CTO) | Accepted | Initial merge RP-2026-002 + TA-2026-002. PM approved on first review. Demand advances to execution planning. |

---

## Sign-off

> The merge only closes with a dual signature.

| Role | Name | Verdict | Date |
|---|---|---|---|
| **PO** (product) | Lucas Mendes | RP frozen (freeze) — `freezeReady = true` | 2026-03-27 |
| **CTO** (technical) | Rodrigo Lima | Viable with caveats | 2026-03-27 |

---

## Combined Executive Summary

The PokerPlan platform currently offers no access control within planning rooms. Anyone with the link joins, sees all participants, and votes. This model is incompatible with the security profile of enterprise clients that operate with mixed teams (employees, external contractors, executives) under internal data governance policies that restrict cross-identity visibility — specifically Construtora Ágil, which conditions the closing of its R$ 42,000 ARR contract on this feature.

This PRD defines a **Room Access Control** system that gives the room owner: (1) control over who can enter — Open, Invite-only, or Mandatory approval modes; (2) identity anonymity via anonymous mode with server-side filtering; and (3) Voter / Observer roles manageable in real time. All access rules are enforced server-side, with no client trust for access state.

The CTO assessed feasibility as **Viable with caveats**. Azure AD OIDC integration (group-claim) is achievable via extension of the existing auth layer. LGPD compliance is addressed by Option C (conditional `sa-east-1` routing per flagged tenant). The two caveats the PM must monitor: (1) RDS instance procurement in `sa-east-1` must be initiated by the CTO before LGPD routing development begins; and (2) Azure AD integration depends on action by Construtora Ágil's IT team (Fernanda Ramos) to register the platform in the Azure portal — an external dependency outside our control that impacts the timeline.

The firm effort is **25 days** (per TA-2026-002), distributed across senior backend (auth, access control, Azure AD OIDC, LGPD routing) and mid-level frontend. The effort estimate does not include the PM's capacity assessment — the PM is responsible for mapping these days onto the calendar and confirming the timeline before Sales communicates any date to the client.

---

## Part A — Product Definition (from Readiness Package · PO)

> Synthesis of the RP's key sections. The full source document is [`RP-2026-002`](./02-readiness-package-access-control.md); what follows is what the PM needs to plan.

### A.1 Objectives and Expected Outcome

1. Allow the room owner to define the access mode: Open (default), Invite-only, or Mandatory approval — configurable per room, without impacting existing rooms.
2. Allow the room owner to activate anonymous mode, hiding participant identities from each other (the owner retains full visibility).
3. Allow the room owner to assign and change Voter / Observer roles to any participant, before or during the session.
4. Allow the room owner to remove a participant from the active session with immediate effect.
5. Close the Construtora Ágil deal with a compliant access control model, within the timeline confirmed by the PM.

### A.2 Scope (final)

**Included:**
- Access mode selector per room (Open / Invite-only / Mandatory approval)
- Generation and revocation of individual invite links (128-bit tokens, single-use)
- Real-time approval flow with 5-min TTL for unanswered requests
- Anonymous mode: server-side aliases per session; owner always sees real names; cannot be deactivated during the session
- Voter / Observer role assignment (before or during the session, with protection rules during active voting)
- Participant removal with vote invalidation and re-entry block
- Server-side enforcement of all access rules (no client trust)
- Azure AD OIDC group-claim integration for automatic role mapping at room entry
- LGPD data residency routing (Option C): participant data from flagged tenants in `sa-east-1`

**Excluded:**
- Enterprise SSO / SAML, audit logs, Jira integration, registration-free guest access, password protection, account-level default settings

**Deferred:**
- Bulk invite via CSV, automatic Observer assignment by organizational role, compliance export, organization-level default settings

### A.3 Personas / Jobs-to-be-done

| Persona | Job | Impact |
|---|---|---|
| **Room Owner (Scrum Master / Tech Lead)** | Run ceremonies with mixed teams in a controlled, policy-compliant manner | New: configures access mode, manages invites/approvals, assigns roles, activates anonymity |
| **Voter (Dev / Team Member)** | Estimate items collaboratively | Experience unchanged; in anonymous mode, sees colleagues' aliases |
| **Observer (PM / Executive)** | Follow the ceremony without influencing estimates | New role: full session visibility, no voting controls |
| **Uninvited / Unapproved User** | (attempts to enter) | New: waiting screen or block instead of direct entry |

### A.4 Business Rules and Flows

Detailed rules in [`RP-2026-002, Section 6`](./02-readiness-package-access-control.md). Summary for the PM:

- **Open:** no behavior change (existing rooms preserved).
- **Invite-only:** single-use tokens, revocable before use; user without invite is blocked.
- **Mandatory approval:** request queue with 5-min TTL; owner approves/denies in real time.
- **Anonymous mode:** activated by owner; cannot be deactivated in session; mandatory server-side filtering.
- **Roles:** Voter is default; Observer may be assigned between items; promotion blocked during active voting.
- **Removal:** immediate effect; current item vote invalidated; re-entry blocked in the same session.

### A.5 User Stories + Acceptance Criteria

> Full stories with Given/When/Then criteria in [`RP-2026-002, Section 7`](./02-readiness-package-access-control.md). Summary for the PM:

| ID | Story | Acceptance criteria (summary) |
|---|---|---|
| ST-001 | As Room Owner, I want to choose the access mode | Mode saved immediately; new mode blocks or allows entry as expected; existing rooms remain in Open mode unchanged |
| ST-002 | As Room Owner, I want to generate and revoke invites | Unique 128-bit token generated; revoked token becomes invalid immediately; token is single-use |
| ST-003 | As a participant, I want to request entry into a room with approval | Waiting screen displayed; entry confirmed in ≤ 2s after approval; denial message shown; expires in 5 min |
| ST-004 | As Room Owner, I want to activate anonymous mode | Aliases displayed to non-owners; owner sees real names; WebSocket payload without real names; cannot be deactivated in session |
| ST-005 | As Room Owner, I want to assign Voter/Observer roles | Voting controls disappear immediately when demoting to Observer; current item vote invalidated; promotion blocked during active voting |
| ST-006 | As Room Owner, I want to remove a participant | Disconnected in ≤ 2s; vote invalidated; re-entry blocked in the same session |

### A.6 Non-Functional Requirements (NFRs)

> Full details in [`RP-2026-002, Section 8`](./02-readiness-package-access-control.md). Key dimensions:

| Dimension | Requirement | Verification |
|---|---|---|
| Performance | Approval, removal, and role-change events propagate in ≤ 2 seconds | WebSocket latency telemetry in load tests (20 participants) |
| Security | Access control enforced server-side on every request and WebSocket message; anonymous payload without real names | Security tests: replay after removal, payload inspection, access without membership |
| Security | 128-bit invite tokens, single-use, expire at session end | Code review + token reuse test |
| Compliance | Participant data from LGPD-flagged tenants only in `sa-east-1` | Data residency verification by CTO; confirmation by Fernanda Ramos before go-live |
| Maintainability | Feature flag disableable without redevelopment; product telemetry added before go-live | Staging verification + data pipeline |

### A.7 Edge Cases and Failure Modes

- Owner disconnects with pending approvals → 5-min TTL persists on the server; queue presented on reconnection.
- Owner cannot be removed (not even by themselves) → server-side block.
- Anonymous mode activated with voting in progress → aliases assigned immediately; prior history not retroactively hidden (accepted behavior).
- Bypass via direct API → membership validated on every request; no client trust for access state.
- Invite token used by a third party → single-use invalidates the token; original invitee receives error "Invite already used."

---

## Part B — Technical Definition (from Technical Assessment · CTO)

> Synthesis of the TA. The full source document is [`TA-2026-002`](./03-technical-assessment-access-control.md).

### B.1 Feasibility Verdict

| Field | Value |
|---|---|
| **Verdict** | Viable with caveats |
| **Caveats** | (1) RDS instance `sa-east-1` may need to be provisioned — procurement must be initiated by the CTO immediately; (2) Azure AD integration is only completed after action by Construtora Ágil's IT team (Fernanda Ramos) — external dependency that impacts timeline; (3) senior-level engineers in critical backend areas (auth, LGPD routing) are a premise of the 25-day firm estimate |

### B.2 Architectural Impact and Integrations

> Detailed in [`TA-2026-002`](./03-technical-assessment-access-control.md).

| Area / System | Impact | Note |
|---|---|---|
| Participant data model | Significant — new fields + state machine | Additive schema migration; nullable fields with defaults; no existing data migration |
| WebSocket / session events layer | Modified — new events + per-recipient filtering (anonymous mode) | Filtering mandatorily server-side — client never receives real name in anonymous mode |
| Authentication layer | Modified — extension for OIDC group-claim (Azure AD) | Existing OAuth2 flow preserved; both flows coexist |
| Data residency routing | New — DAL with conditional routing `us-east-1` / `sa-east-1` per tenant flag | Routing logic encapsulated in the DAL; reusable for future regional compliance requirements |
| RDS infrastructure `sa-east-1` | Possibly new — confirm current state | Procurement initiated by CTO; no blocking of parallel development of other parts |
| Azure AD (Entra ID) — external | Integration via OIDC group-claim | Technical registration spec delivered to client IT early; dependency outside our control |

### B.3 Hard Constraints

| Constraint | Effect on scope |
|---|---|
| LGPD: participant data from flagged tenants must reside in `sa-east-1` | Adds ~2 weeks; cannot be done post go-live; prerequisite for Construtora Ágil onboarding |
| Azure AD integration: OIDC group-claim only (no full SSO) | Limits complexity; any expansion to SSO requires a new demand |
| Strictly additive schema migration | Preserves backward compatibility; limits design of new fields |
| Anonymous payload filtering: server-side mandatory | Affects design of the WebSocket events layer |
| No new external identity providers | Confirms the additive extension approach for the existing auth layer |

### B.4 ADRs (architectural level)

> Full justifications in [`TA-2026-002`](./03-technical-assessment-access-control.md).

| # | Decision | CTO Sign-off |
|---|---|---|
| ADR-001 | Azure AD integration via OIDC group-claim, without full SSO | ✓ |
| ADR-002 | LGPD compliance via Option C: conditional routing by tenant flag (`sa-east-1`) | ✓ |
| ADR-003 | WebSocket payload filtering in anonymous mode: server-side, per recipient, at send time | ✓ |
| ADR-004 | Strictly additive schema migration for the participant model | ✓ |
| ADR-005 | Invite tokens: cryptographically random 128 bits, single-use, expire on first use or session end | ✓ |
| ADR-006 | Data residency routing implemented in the DAL, not in the business layer | ✓ |

---

## Scope Reconciliation

> The Technical Assessment did not veto any item from the RP. The CTO's caveats added two scope items that were not in the original intake (Azure AD OIDC and LGPD Option C) — both were incorporated during Discovery and are in the final RP.

| Original item (RP) | Change after Technical Assessment | Reason |
|---|---|---|
| Access control (modes, anonymity, roles, removal) | Kept in full | No technical veto |
| Azure AD integration (added in Discovery) | Kept — scope confirmed as OIDC group-claim only | ADR-001: full SSO out of scope; group-claim is sufficient |
| LGPD routing `sa-east-1` (added in Discovery) | Kept — Option C confirmed | ADR-002: Options A and B are strategic platform decisions for another round |
| Jira integration (removed in Discovery) | Removed — `BACKLOG-2026-007` | Client call: not mandatory to close the deal |
| RDS `sa-east-1` procurement | New action added | CTO must verify state and initiate procurement before Option C development |

**Final reconciled scope:** RP-2026-002 kept in full. No items vetoed by the CTO. Two preparation actions added by the CTO: (1) delivery of the Azure AD technical registration spec to Construtora Ágil; (2) verification and eventual procurement of an RDS instance in `sa-east-1`.

---

## Consolidated Risk and Dependency View

> Product/business risks (from RP-2026-002, Section 12) + technical risks (from TA-2026-002) in a single table — the PM plans against this view.

| Risk | Origin | Type | Probability | Impact | Mitigation |
|---|---|---|---|---|---|
| Azure AD registration delayed by Construtora Ágil IT | RP + TA | External | Medium | High | Technical spec delivered to client early; registration close date as an external milestone in the execution plan |
| RDS `sa-east-1` instance not provisioned within the required window | TA | Infrastructure | Medium | High | CTO verifies immediately; procurement started before kick-off; parallel development of other parts preserved |
| Informal timeline commitment from Sales conflicts with actual capacity | RP | Operational | High | High | PM runs capacity assessment before any external communication; PO owns this gate |
| Schema migration breaks active sessions | TA | Data | Low | High | Additive migration; deploy in low-traffic window; rollback previously tested |
| Access control bypass via direct API | TA | Security | Low | High | Membership validation on every request; automated security tests before go-live |
| `groups` claim unavailable in client Azure AD tenant | TA | Integration | Low | High | Technical spec confirms requirement; Fernanda Ramos confirms group existence before development |
| Scope expansion pressure (SSO, audit logs) | RP | Product / Scope | Medium | Medium | Explicit scope boundary in RP; any addition requires a new demand triaged by the PO |
| Invite token brute force | TA | Security | Low | High | 128 bits; single-use; rate limiting on join endpoint |
| Anonymous mode adopted below 30% in enterprise sessions | RP | Adoption | Low | Low | Track telemetry in the first 60 days; investigate with CS if below target |
| Jira integration escalated from desirable to mandatory during delivery | RP | Scope | Low | Medium | Confirmed as backlog; any escalation retriaged by the PO |

**Known external dependencies:**
- **Construtora Ágil (Fernanda Ramos — IT Lead):** registration of the platform in the client tenant's Azure AD portal. Critical external timeline milestone — the PM must include it in the execution plan with a target date and escalation point if delayed.
- **PM:** capacity assessment before any timeline communication to Sales or the client (non-negotiable — PO owns this gate).

---

## Effort and Cost (firm)

> From Technical Assessment TA-2026-002 (replaces the RP preliminary). Internal use only — not a contractual commitment or client-facing material.

| Area | Firm estimate | Seniority |
|---|---|---|
| Backend — schema migration + state machine | 6 days | Senior |
| Backend — WebSocket filtering (anonymous mode) | 3 days | Senior |
| Backend — access control logic (invite, approval, removal) | 5 days | Mid-Senior |
| Backend — OIDC group-claim Azure AD | 5 days | Senior |
| Backend — LGPD Option C routing + DAL | 10 days | Senior |
| Frontend — owner settings panel | 4 days | Mid |
| Frontend — participant UI (aliases, Observer, approval) | 3 days | Mid |
| QA (functional + security + multi-tenant + LGPD) | 5 days | QA |
| **Firm total** | **25 days** | |

**Infra / Third-parties / Recurring opex:** Possible new RDS instance in `sa-east-1` (CTO verifying state; procurement to start if absent). Monthly recurring cost of the `sa-east-1` endpoint to be determined after infrastructure review with DevOps — must be factored into LGPD-flagged tenant pricing. No new third-party providers.

---

## Inherited Readiness and Open Dispositions

> What the PM needs to see before planning.

| Field | Value |
|---|---|
| **Premises still to validate** | Construtora Ágil IT team completes Azure AD registration within the delivery window (owner: Fernanda Ramos; milestone in PM plan). RDS `sa-east-1` instance available before LGPD routing development (owner: CTO). |
| **Discovery unknowns** | All resolved: Azure AD (viable via OIDC), Jira (removed), LGPD (Option C added to scope). |
| **Delegated requirements (with owner)** | — |

> If Construtora Ágil delays the Azure AD registration, the role mapping feature via Azure AD cannot be validated with the client before go-live. The PM must include this milestone as a client acceptance blocker, not an internal development blocker.

---

## Success Criteria and Metrics (projected)

> Projected baseline that `metrics.md` compares against measured post-rollout.

| Type | Metric | Target (projected) | Window | Confidence |
|---|---|---|---|---|
| **Primary** | Construtora Ágil contract closed | Contract signed | Within 30 days of release | 85 |
| **Primary** | Anonymous mode adoption in enterprise sessions | ≥ 30% of enterprise sessions | 60 days post-release | 65 |
| **Secondary** | Entry success rate in Approval mode | ≥ 95% of valid requests approved in ≤ 2 min | 30 days post-release | 70 |
| **Secondary** | Additional deals in pipeline unblocked | ≥ 1 of 2 signaled deals advances | 90 days post-release | 60 |
| **Guardrail** | Unauthorized access incidents | 0 reported incidents | Continuous from release | 90 |
| **Guardrail** | Voting latency in open rooms (unaffected) | No degradation vs. pre-release baseline | 30 days post-release | 85 |

---

## Handoff to PM — Acceptance Gate

> The PM has **explicit authority to reject** the PRD and return it with specific gaps. See [`interactions/07-po-to-pm.md`](../../../interactions/07-po-to-pm.md).

| Delivery checklist | OK? |
|---|---|
| RP frozen (freeze) and referenced | ☑ |
| Technical Assessment signed (or N/A justified) | ☑ |
| Scope reconciliation recorded | ☑ |
| Risks and dependencies consolidated | ☑ |
| External dependencies explicit | ☑ |
| Open dispositions visible | ☑ |

**Priority and business context:** High — pre-close blocker for Construtora Ágil (R$ 42,000 ARR) with deal conditioned on the feature. Analogous requirement signaled in 2 additional enterprise deals in pipeline. Without the PM's capacity assessment, no date can be confirmed to Sales or the client. The critical external timeline dependency (Azure AD registration by the client's IT) must be treated as an explicit milestone in the execution plan.
