# Intake Record — Room Access Control

## Metadata

| Field | Value |
|---|---|
| **Record ID** | INT-2024-002 |
| **Version** | v1 |
| **Registered by** | Rafael Souza (Sales) |
| **Registration date** | 2024-03-15 |
| **Status** | Approved — in execution planning |
| **Triage date** | 2024-03-17 |
| **Triaged by** | Lucas Mendes (PO) |
| **Linked Readiness Package** | RP-2024-002 v1 |

## Revision History

| Version | Date | Event | Summary |
|---|---|---|---|
| v1 | 2024-03-15 | Intake registered | Sales registered demand from Construtora Ágil pre-close call. |
| v1 | 2024-03-17 | Triage completed | PO triaged. Three integration unknowns identified. Demand sent to Discovery. |
| v1 | 2024-03-18 | Discovery opened | PO opened Discovery for Azure AD, Jira, and LGPD unknowns. CTO notified. |
| v1 | 2024-03-25 | Discovery closed | All unknowns resolved within time-box. Demand re-triaged as Product Ready. |
| v1 | 2024-03-27 | RP-2024-002 v1 approved | PO + CTO submitted Readiness Package. PM approved on first review. Demand advances to execution planning. |

---

## Origin

| Field | Value |
|---|---|
| **Source** | Client |
| **Client** | Construtora Ágil (mid-market, onboarding in progress) |
| **Reported via** | Sales pre-close call |

---

## Type

- [x] Feature
- [ ] Bug
- [ ] Improvement
- [x] Compliance
- [x] Integration
- [ ] Operational

---

## Problem Statement

Construtora Ágil runs planning ceremonies with mixed attendance: some sessions include external contractors and consultants who should not have visibility into all participants' estimates or identities. The room owner (Scrum Master or Tech Lead) needs control over:

1. **Who can see the list of participants** in the room — in some sessions, anonymity between voters is required.
2. **Who can join the room** — currently any person with the link can enter. The client needs invite-only or approval-based access.
3. **Observer vs. voter distinction** — some attendees should be able to watch the ceremony without voting (e.g., product managers, executives observing the process).

The current model is fully open: anyone with the link joins, sees everyone, and votes. There is no differentiation of roles or visibility control within the room.

---

## Business Impact

| Dimension | Detail |
|---|---|
| **Revenue** | This is a blocker for closing the Construtora Ágil contract (R$ 42.000/year). Deal is contingent on this feature. Sales has committed a 60-day delivery expectation informally — PO must clarify this with Sales. |
| **Retention** | Not applicable (client not yet onboarded). |
| **Market** | Sales reports this request came up in 2 other pipeline deals in Q1. Likely a segment-level need for enterprise and regulated environments. |
| **Compliance** | Construtora Ágil operates under internal data governance policies that restrict participant data visibility across contractors. |

## Stakeholders

| Stakeholder | Role | Interest | Influence |
|---|---|---|---|
| Rafael Souza | Sales | Close the Construtora Ágil contract | High — demand reporter, owns deal relationship |
| Construtora Ágil Scrum Masters | End users (facilitators) | Controlled, compliant ceremony access | High — primary operators of the feature |
| Construtora Ágil IT Lead (Fernanda Ramos) | Client technical authority | Azure AD integration and LGPD compliance | High — must approve and configure Azure AD registration |
| Construtora Ágil External Contractors | End users (restricted observers) | Join sessions with limited visibility | Medium — affected users, no product decision power |
| Ana Costa | Customer Success | Smooth onboarding and post-sale health | Medium — will own the relationship post-close |
| Lucas Mendes | PO | Product alignment, scope definition | High — owns rationalization and Readiness Package |
| Rodrigo Lima | CTO | Architectural integrity, LGPD compliance, Azure AD feasibility | High — required for technical assessment and data residency decision |
| CEO | Executive sponsor | Revenue (new contract) and compliance posture | Medium — must be informed of LGPD risk before scope is committed |

---

## Assumptions

These are conditions assumed to be true at intake. If any assumption proves false, the demand must be re-triaged.

1. Construtora Ágil is willing and able to register the platform as an approved application in their Azure AD tenant.
2. The client's IT team can complete the Azure AD registration within the delivery window once technical specs are provided.
3. The existing auth layer (OAuth2) can be extended to support OIDC group-claim validation without replacing or rewriting the authentication service.
4. LGPD compliance for this client can be achieved by scoping data residency per tenant (Option C), without requiring a full platform migration.
5. The Jira integration is not a hard requirement for the deal to close (to be confirmed in Discovery).
6. Anonymous mode aliases are sufficient for compliance — no additional data masking at the database level is required beyond what is displayed.
7. The scope of access control is per-room, not per-organization-account. Organization-level defaults are out of scope for this release.

---

## Constraints

Conditions that limit the solution space and must be respected regardless of what is built.

| Constraint | Type | Detail |
|---|---|---|
| Deal timeline | Time | Sales made an informal 60-day commitment. No date is confirmed until PM capacity assessment is complete. |
| LGPD compliance | Legal / Regulatory | Participant identity data for Brazilian clients must be stored in Brazil (`sa-east-1`). Non-negotiable for this client. |
| Azure AD dependency | External | Construtora Ágil controls their own Azure AD tenant. Platform cannot complete integration without their IT action. Timeline is partially outside our control. |
| No SSO full implementation | Scope | Full enterprise SSO is out of scope. OIDC group-claim validation only for this release. |
| Backward compatibility | Technical | Existing open-link rooms must continue to work unchanged. Access control is opt-in per room, not a platform-wide breaking change. |
| No new external auth providers | Budget | No new identity providers (Okta, Auth0, etc.) may be contracted. Extension of existing auth layer only. |

---

## Preliminary Risks

Risks identified at intake — before technical assessment. Updated after Discovery. Not a complete risk register (that belongs in the Readiness Package).

| Risk | Category | Probability | Impact | Initial Assessment |
|---|---|---|---|---|
| Azure AD registration delayed by client IT | External / Schedule | Medium | High | Client-side dependency outside our control. Mitigation: provide spec and checklist to client IT early. |
| LGPD posture requires infrastructure work beyond Option C | Compliance | Low | High | CTO must confirm scope of Option C before commitment. If broader, CEO must decide. |
| Sales timeline commitment conflicts with actual capacity | Operational | High | High | PM must run capacity assessment before any date is communicated externally. PO owns this gate. |
| Participant data model migration breaks active sessions | Technical | Low | High | Additive schema change strategy must be confirmed by CTO. |
| Scope expansion pressure (audit logs, SSO, guest access) | Scope | Medium | Medium | Explicit exclusions documented in scope boundary below. PO enforces boundary. |
| Jira integration escalated to hard requirement mid-delivery | Scope | Low | Medium | To be definitively closed in Discovery client call. |
| Anonymous mode bypass (client infers identity from vote pattern) | Security / Product | Low | Low | Accepted risk — platform controls digital display only, not behavioral inference. |

---

## High-Level Scope Boundary

**In:** Access modes (Open / Invite-only / Approval-required), anonymous mode, Voter/Observer role assignment, participant removal, Azure AD OIDC group-claim mapping, LGPD-compliant data residency (Option C — per-client `sa-east-1` routing).

**Out:** Full SSO / SAML, audit logs, Jira integration, guest access without registration, organization-level default settings, room passwords.

**Deferred:** Bulk invite via CSV, automated observer assignment by org role, compliance export for governance.

---

## Integration Challenges Identified at Intake

During the intake call, Sales surfaced three integration dependencies that were **not anticipated** and block rationalization until investigated:

### 1. Microsoft Azure Active Directory (Azure AD / Entra ID)

Construtora Ágil manages all employee and contractor identities through Azure AD. They expect the platform to validate room access against their existing Azure AD groups — not via invite links or manual approval. Specifically:

- Internal employees belong to the AD group `pokerplan-voters`
- External contractors belong to `pokerplan-observers`
- The room owner should not need to manually assign roles — roles should be derived from the user's AD group at join time

**Unknown:** The platform currently has no OAuth/OIDC integration with Azure AD. It is unclear whether this requires a full SSO implementation, a lightweight group-claim validation, or a webhook-based sync. This needs a technical spike before scope can be defined.

### 2. Jira Integration for Participant Identity Resolution

Construtora Ágil uses Jira as the source of truth for team membership per squad. They reported that in their ideal flow, when a room is created for a specific Jira sprint, the platform should automatically pull the sprint participants from Jira and pre-populate the room's approved voter list.

**Unknown:** The platform currently has no Jira integration. A read-only Jira API connection would be needed. It is unclear if this is within scope for this demand or a separate integration initiative. PO needs to assess whether this is a hard requirement or a nice-to-have for the deal to close.

### 3. Client Data Residency Requirement

During the compliance discussion, Construtora Ágil's IT team mentioned that participant identity data (names, emails, AD group memberships) must be stored in Brazil (LGPD compliance). The current platform infrastructure uses a multi-region cloud setup — it is unknown whether participant session records are stored in a Brazil-based region or not.

**Unknown:** The CTO must confirm the current data residency posture of the session participant model. If data is stored outside Brazil, this may require infrastructure changes before the feature can be delivered to this client.

---

## Priority

**Level:** High

**Reason:** Pre-close deal blocker. Sales has made an informal timeline commitment that needs to be validated against capacity before being confirmed to the client.

> ⚠️ **Priority note:** Despite High urgency, this demand cannot proceed to rationalization until the three integration unknowns are resolved. Discovery is time-boxed to 2 weeks. If unknowns are not resolved within that window, the PO will escalate to CEO with a risk assessment for the deal.

---

## Success Criteria

High-level indicators that define what "done and valuable" looks like for this demand. Detailed measurable targets are owned by the Readiness Package — these are the intake-level signals.

| Criterion | Type | Indicator |
|---|---|---|
| Construtora Ágil contract closed | Business | Contract signed within 30 days of release |
| Zero unauthorized access incidents | Security / Compliance | No reported cases of blocked or removed participants accessing session data |
| LGPD compliance confirmed | Legal | Construtora Ágil IT confirms data residency requirement is met before go-live |
| Azure AD role mapping working end-to-end | Technical | Employees and contractors receive correct platform roles (Voter / Observer) automatically from AD group at join time |
| At least 1 additional pipeline deal unblocked | Business | One of the 2 flagged pipeline deals advances to close within 90 days of release |
| Anonymous mode adopted in enterprise sessions | Product | Used in ≥ 30% of enterprise-tier sessions within 60 days of release |
| Sales no longer making informal timeline commitments | Process | PO and Sales align on a formal intake gate rule before next enterprise deal |

---

## PO Triage Notes

This demand is strategically aligned — the platform needs to mature its access model for enterprise segments. However, three integration unknowns surfaced during intake that prevent rationalization from starting. The demand cannot be scoped until these are resolved.

**Decision path:** ~~Product Ready~~ → **Discovery**

**Architectural escalation to CTO:** Yes — expanded. Originally flagged for participant data model. Now also requires CTO input on: (1) Azure AD OIDC feasibility, (2) Jira API integration scope, (3) data residency posture for LGPD compliance.

**Discovery time-box:** 2 weeks (2024-03-18 → 2024-04-01)

**Risk flag:** Sales made an informal timeline commitment to the client. No external date can be confirmed until Discovery concludes and PM runs a capacity assessment.

---

## Discovery Brief

### What is missing

| # | Unknown | Who can answer | Method |
|---|---|---|---|
| 1 | Azure AD integration: full SSO vs. group-claim validation vs. webhook sync | CTO | Technical spike (2–3 days max) |
| 2 | Jira integration: hard requirement or nice-to-have for deal close | Construtora Ágil (via Sales) | Client call — Sales to schedule within 3 days |
| 3 | Data residency: current posture of participant session records | CTO | Infrastructure review (1 day) |

---

### Discovery Log

#### 2024-03-18 — PO opens Discovery

Demand moved to Discovery. Three unknowns registered above. PO notified Sales (Rafael Souza) to schedule a follow-up call with Construtora Ágil's IT team to clarify the Jira requirement. CTO (Rodrigo Lima) notified for technical spike on Azure AD and data residency.

---

#### 2024-03-20 — CTO Technical Spike: Azure AD

**Finding:** Azure AD integration via OIDC is feasible using the existing auth layer (which already supports OAuth2). A full SSO implementation is not required. The platform can request the `groups` claim at login and map AD groups to platform roles at session join time.

**Effort estimate:** 4–6 days (backend auth extension + role mapping logic).

**Dependency:** Construtora Ágil must provide their Azure AD tenant ID and register the platform as an allowed application in their Azure portal. This is a client-side action — timeline depends on their IT team.

**CTO recommendation:** This is viable and does not require new infrastructure. However, it introduces a new auth flow that affects the participant model — the architectural escalation stands.

---

#### 2024-03-21 — CTO Infrastructure Review: Data Residency

**Finding:** The current platform uses a primary database cluster in `us-east-1` (AWS). Session participant records — including names, emails, and session metadata — are stored in this cluster. There is no Brazil-region (sa-east-1) replication for this data.

**LGPD implication:** Participant identity data for Brazilian clients is currently stored outside Brazil. Delivering this feature to Construtora Ágil without addressing this would expose the company to LGPD risk.

**Options identified by CTO:**

| Option | Description | Effort | Risk |
|---|---|---|---|
| A | Migrate participant table to `sa-east-1` for all tenants | High (3–4 weeks) | Disrupts all clients during migration |
| B | Implement per-tenant data residency routing (participant data stored in tenant's declared region) | Very High (6–8 weeks) | Platform-level change, new complexity |
| C | Store participant session data in `sa-east-1` only for clients who flag LGPD requirement | Medium (2 weeks) | Adds conditional routing logic, but scoped |

**CTO recommendation:** Option C for this release. Options A and B are strategic platform decisions that require CEO alignment and cannot be committed to for a single deal.

**PO note:** Option C adds ~2 weeks of infrastructure work to this demand. This must be factored into the PM capacity assessment and communicated to Sales before any client commitment.

---

#### 2024-03-22 — Client Call: Jira Integration Requirement

**Attendees:** Rafael Souza (Sales), Ana Costa (CS), Construtora Ágil IT Lead (Fernanda Ramos)

**Finding:** Jira integration is **not a hard requirement** for the deal to close. Fernanda confirmed that manually assigning voters and observers via Azure AD group mapping is acceptable for Phase 1. Jira-based room pre-population is a future wish, not a blocker.

**Impact on scope:** Jira integration is removed from this demand. It is registered as a separate backlog item: `BACKLOG-2024-007 — Jira Sprint Integration for Room Pre-population`.

---

### Discovery Outcome

**All three unknowns resolved.**

| # | Unknown | Resolution | Scope impact |
|---|---|---|---|
| 1 | Azure AD integration | Feasible via OIDC group-claim. 4–6 days effort. Client must register app in Azure portal. | Added to scope |
| 2 | Jira integration | Not required for deal close. Moved to backlog. | Removed from scope |
| 3 | Data residency (LGPD) | Option C: per-client LGPD flag with `sa-east-1` routing. ~2 weeks effort. | Added to scope |

**New decision path:** Discovery → **Product Ready**

**Revised demand complexity:** Significantly higher than originally estimated. The Readiness Package must be updated to reflect Azure AD integration and LGPD data residency work.

**Discovery closed:** 2024-03-25 (7 days — within 2-week time-box ✓)
