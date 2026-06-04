# Technical Assessment — Room Access Control

> The Technical Assessment (TA) is the **CTO's output** — feasibility, constraints, architecture, integrations, technical risks, ADRs, and firm cost. It is written **alone** by the CTO, **in parallel** with the Readiness Package, and **responds** to it: the CTO **never edits the RP**. The TA does not redefine the product — it may **veto** the feasibility of the scope, in which case the PO revises the RP scope.
>
> The merge of the RP (product) with this TA (technical) happens in the [PRD](./04-prd-access-control.md), and it is the PRD that opens the downstream. See [`personas/02-po.md` §2 and §10](../../../personas/02-po.md) and [`interactions/05-po-to-cto.md`](../../../interactions/05-po-to-cto.md).
>
> **Journey:** [`00 Submitter Document`](./00-submitter-brief-access-control.md) → [`01 Intake Record (PO — triage)`](./01-intake-record-access-control.md) → [`02 Readiness Package (PO)`](./02-readiness-package-access-control.md) → `03 Technical Assessment (CTO)` → [`04 PRD (PO+CTO → PM)`](./04-prd-access-control.md).

## Metadata

| Field | Value |
|---|---|
| **Assessment ID** | TA-2026-002 |
| **Version** | v1 |
| **Linked RP** | RP-2026-002 v1 |
| **Linked Intake** | INT-2026-002 |
| **Owner** | Rodrigo Lima (CTO) |
| **Status** | Signed |
| **Feasibility Verdict** | Viable with caveats |
| **Sign-off date** | 2026-03-27 |

## Revision History

| Version | Date | Author | Status | Summary |
|---|---|---|---|---|
| v1 | 2026-03-20 to 2026-03-25 | Rodrigo Lima (CTO) | Signed | Technical spikes on Azure AD (2026-03-20) and LGPD data residency (2026-03-21) executed during Discovery. Assessment formalized and signed on 2026-03-27 alongside the RP. |

---

## Feasibility Verdict

> The CTO's first-class decision.

| Field | Value |
|---|---|
| **Verdict** | Viable with caveats |
| **Justification** | The product scope defined in RP-2026-002 is technically achievable with the current stack. Azure AD OIDC integration can be implemented by extending the existing auth layer, without a new identity provider. LGPD compliance can be achieved with Option C (conditional routing per client). The caveats are: (1) a new RDS instance in `sa-east-1` may be needed and its procurement must be initiated before Option C development begins; (2) the client's action to register Azure AD is external and outside the platform's control. |
| **Caveats (if applicable)** | (1) RDS instance procurement in `sa-east-1` must be initiated by the CTO before LGPD routing work begins. If the environment is not available within the right window, that part of the scope is delayed. (2) Azure AD integration can only be completed after Construtora Ágil registers the platform in their Azure AD portal — external dependency outside our control. (3) The firm effort assumes senior-level engineers in critical backend areas (auth, LGPD routing) — downgrading seniority on those tasks invalidates the estimate. |

---

## PO Questions Addressed

> Specific technical unknowns escalated by the PO during Discovery — and each answer.

| # | PO Question | CTO Answer |
|---|---|---|
| 1 | Does Azure AD integration require full SSO, OIDC group-claim validation, or webhook-based synchronization? | OIDC group-claim validation. The existing auth layer (OAuth2) supports extension to OIDC without a rewrite. The platform requests the `groups` claim at login and maps AD groups to platform roles at room entry. Full SSO and webhooks are not needed for this scope. |
| 2 | Is the current data residency posture for session records LGPD-compliant for Brazilian clients? | No. The primary cluster is in `us-east-1`. Participant records (names, emails, session metadata) are stored outside Brazil. Option C — conditional routing with storage in `sa-east-1` only for tenants with the LGPD flag — is the recommended approach for this release. Options A and B (global migration) are strategic platform decisions that require CEO alignment and cannot be committed for a single deal. |
| 3 | Is Jira API integration within the technical scope of this assessment? | No — closed by call with the client on 2026-03-22. Fernanda Ramos confirmed it is not mandatory. Logged as `BACKLOG-2026-007`. |

---

## Affected Systems and Components

| System / Component | Nature of impact |
|---|---|
| **Participant data model** | Modified — new fields (`role`, `access_mode`, `anonymous_alias`, `invite_token`), new state machine |
| **Authentication / auth backend layer** | Modified — extension to request `groups` claim in OIDC flow + AD group → room role mapping logic |
| **WebSocket / real-time session events layer** | Modified — new event types (`join_request`, `join_approved`, `join_denied`, `role_changed`, `participant_removed`); server-side payload filtering per recipient in anonymous mode |
| **Session persistence layer** | Modified — additive schema migration; new nullable fields with defaults compatible with current behavior |
| **Data routing by region** | New — conditional routing logic `us-east-1` / `sa-east-1` based on tenant LGPD flag |
| **Database infrastructure** | Possibly new — RDS instance (or read-write endpoint) in `sa-east-1` depending on current provisioning state |
| **Transactional email service** | Consumed only — no modification to existing provider; new email invite template |

---

## Architectural Impact

> Exclusive CTO territory. Content migrated and expanded from the former RP (old Sections 7 and 8) into this artifact.

| Area | Impact | Architectural note |
|---|---|---|
| **Participant data model** | Significant. The current participant model is a flat, session-scoped record. Adding `role`, `access_mode`, `anonymous_alias`, and `invite_token` requires a schema migration and a new participant state machine. | The migration must be strictly additive (new nullable fields with defaults that reproduce current behavior). Existing sessions with an open link must not be affected. No existing data migration — only new optional fields. |
| **Multi-tenancy** | Medium. Anonymous aliases must be session-scoped, not account-scoped. Invite tokens must be non-guessable and scoped to the specific room+session. | Token generation: cryptographically random 128 bits (e.g., `crypto.randomBytes(16).toString('hex')`). Tokens expire on first use or at session end — whichever comes first. Rate limiting on the join endpoint to mitigate brute force. |
| **Real-time membership (WebSocket)** | Medium. The current WebSocket layer broadcasts the participant list to all members. With anonymous mode, the server must filter the participant list payload per recipient. | Server-side filtering is mandatory and non-negotiable. The client must never receive another participant's real name in anonymous mode payloads. Filtering must be applied at send time, per recipient connection — not on the client. |
| **Security** | High. The access control model must be enforced server-side. A denied, removed, or uninvited participant must not be able to access session state via direct API calls or WebSocket. | The server must validate room membership on **every** WebSocket message and **every** REST request that touches session state. A valid session token is not sufficient — the specific room membership must be verified. No client trust for access state. |
| **Performance / Scalability** | Low. Approval notifications and role changes are low-frequency events. No scalability concerns at current session volumes. | Monitor at 10× current peak if enterprise adoption accelerates significantly. Per-recipient WebSocket payload filtering adds marginal CPU on the event server — irrelevant at current volumes. |
| **Observability** | Mandatory addition. Product telemetry must be added: access mode distribution per room, approval/denial rate, Observer/Voter ratio, anonymous mode usage per enterprise session, approval event latency. | Needed for Phase 2 product decisions and security monitoring. Events must be emitted before go-live — not retrofitted. |
| **Data residency routing (LGPD)** | High. New architectural pattern: conditional write/read routing per tenant based on LGPD flag. For flagged tenants, participant data is written to and read from `sa-east-1`. For others, current behavior (`us-east-1`) is preserved. | Implement via a data access layer (DAL) that resolves the correct database endpoint based on the tenant flag in the request context. Do not leak routing logic into the business layer. Once the pattern is established, it becomes reusable for any future compliance region requirement. |

---

## Required Integrations

> Now with the lens of technical feasibility.

| System | Type | Protocol | Feasibility / Known risks |
|---|---|---|---|
| **Construtora Ágil's Azure AD (Entra ID)** | External | OIDC (OpenID Connect) — `groups` claim | Viable via extension of the existing auth layer. The platform requests the `groups` claim in the OIDC flow; AD groups are mapped to room roles at entry. **Risk:** integration can only be completed after Construtora Ágil registers the platform in their Azure AD portal (client action, outside our control). The technical registration spec (redirect URIs, required scopes, tenant ID) must be delivered to the client's IT team (Fernanda Ramos) as early as possible. |
| **WebSocket layer (internal)** | Internal | WebSocket / session events | Existing infrastructure applies. New event types to implement: `join_request`, `join_approved`, `join_denied`, `role_changed`, `participant_removed`. Per-recipient payload filtering for anonymous mode is the most sensitive addition. |
| **Database — `sa-east-1` endpoint** | Infrastructure | PostgreSQL (RDS) | Viable with provisioning. Verify whether an instance already exists in `sa-east-1` or if procurement is needed. Start procurement immediately if absent — does not block parallel development of other parts, but blocks LGPD routing merge and testing. |
| **Transactional email service** | Internal/External | SMTP / existing provider API | Consumed only — no change to provider. New email invite template to be created. |
| **Existing authentication layer** | Internal | OAuth2 / OIDC extension | Modified. The extension to OIDC with `groups` claim is additive — the existing OAuth2 flow for users without Azure AD is not altered. Both flows coexist. |

---

## Hard Constraints

> Non-negotiable conditions that limit the solution space.

| Constraint | Type | Detail | Effect on scope |
|---|---|---|---|
| LGPD: participant data from flagged clients in `sa-east-1` | Security / Compliance / Legal | Participant identity data (names, emails, session metadata) from LGPD-flagged tenants must be written to and read exclusively from `sa-east-1`. Non-negotiable for Construtora Ágil onboarding. | Adds ~2 weeks of effort (conditional routing + infrastructure provisioning). Cannot be done post go-live — it is a prerequisite. |
| RDS provisioning in `sa-east-1` required | Infrastructure | If the instance in `sa-east-1` does not exist, it must be provisioned before LGPD routing development begins. Procurement takes time. | CTO must verify current state and start procurement immediately if absent. Does not block parallel development of other parts. |
| Azure AD integration: OIDC group-claim only (no full SSO) | Scope / External | Scope is restricted to OIDC group-claim validation for role mapping at room entry. Full SSO/SAML and user synchronization are out of scope for this release. | Limits auth integration complexity. Any pressure to expand to full SSO must be triaged as a new demand. |
| Strictly additive schema migration | Technical | New fields in the participant model must be nullable with defaults that reproduce current behavior. No DROP of columns, no type changes. Existing sessions must not be affected. | Preserves backward compatibility. Limits the design of some fields (e.g., `access_mode` cannot be NOT NULL without a default). |
| No new external identity providers | Budget / Scope | No new provider (Okta, Auth0, Cognito, etc.) may be contracted. Extension of the existing auth layer only. | Confirms the additive OIDC extension approach. |
| Anonymous mode payload filtering: server-side mandatory | Security | The client must never receive another participant's real name in anonymous mode payloads. Filtering is on the server, at send time, per recipient. | Affects the design of the WebSocket events layer — filtering must be centralized on the event server, not delegated to the client. |

---

## Technical Risks and Mitigations

> **Technical** risks live here. Product/business risks are in RP-2026-002, Section 12.

| Risk | Category | Probability | Impact | Mitigation |
|---|---|---|---|---|
| Participant data model migration breaks active sessions | Data | Low | High | Strictly additive migration — new nullable fields with defaults. Deploy in low-traffic window. Rollback tested before production deploy. Existing sessions unaffected by design. |
| Anonymous alias collision (two participants with the same alias) | Technical | Low | Medium | Alias assignment is deterministic by participant ordinal index in the session. No collision possible within a session by construction. |
| Invite token brute force | Security | Low | High | Tokens are cryptographically random 128 bits. Expire on first use. Rate limiting on the room join endpoint. No sequential ID exposure. |
| Room owner disconnects with approvals pending in queue | Technical | Medium | Medium | Pending approvals persist on the server with a 5-min TTL. If the owner reconnects within the TTL, the queue is presented. If not, requests expire. Stateful design on the server (not the client). |
| RDS `sa-east-1` instance not provisioned within the required window | Infrastructure | Medium | High | Immediately verify environment state. If absent, start procurement before development kick-off. Parallel development of other parts can proceed without blocking — but LGPD routing merge is blocked. |
| `groups` claim not available in the client tenant's OIDC flow | Integration | Low | High | Technical registration spec (including `groups` scope) must be delivered to Construtora Ágil IT early. Fernanda Ramos must confirm the Azure AD tenant exposes the `groups` claim and that the `pokerplan-voters` and `pokerplan-observers` groups exist in the tenant. Test in staging with a test tenant before go-live. |
| LGPD routing logic leaks into the business layer | Architectural | Medium | Medium | Implement routing via DAL (Data Access Layer) with endpoint abstraction. Region/endpoint resolution logic is internal to the DAL — the business layer neither knows nor decides the region. Mandatory code review before merge. |
| Access control bypass via direct API call | Security | Low | High | Room membership validation on **every** request (REST and WebSocket). Automated security tests covering: message replay after removal, uninvited join attempt via API, session payload access without valid membership. |

---

## Architectural Decisions (ADRs)

> Architectural direction at the CTO level. Fine-grained breakdown and implementation ADRs belong to the Tech Lead's Tech Backlog (TB).

| # | Decision | Justification | CTO Sign-off |
|---|---|---|---|
| ADR-001 | Azure AD integration via OIDC group-claim, without full SSO | The existing auth layer (OAuth2) supports additive extension to OIDC. Full SSO requires more effort, metadata infrastructure, and is outside the scope declared by the client. Group-claim is sufficient for the role mapping requirement. | ✓ |
| ADR-002 | LGPD compliance via Option C: conditional routing by tenant flag, storage in `sa-east-1` only for flagged tenants | Option A (global migration) disrupts all clients. Option B (general routing) is a strategic platform decision requiring CEO alignment. Option C is scoped, deliverable for this deal, and reusable as a pattern for future regional compliance requirements. | ✓ |
| ADR-003 | WebSocket payload filtering in anonymous mode: server-side, per recipient, at send time | Security cannot depend on the client to hide data. Any approach that sends the real name to the client (even if "hidden" via CSS/JS) is vetoed. The server emits different payloads to each recipient based on role. | ✓ |
| ADR-004 | Strictly additive schema migration for the participant model | Preserves backward compatibility without disrupting existing sessions. New fields are nullable with defaults that reproduce current behavior. Eliminates the risk of migrating existing data. | ✓ |
| ADR-005 | Invite tokens: cryptographically random 128 bits, single-use, expire on first use or session end | Prevents brute force (2^128 space), replay (single-use), and orphaned tokens (session expiration). Does not use sequential IDs or room-data-derived values. | ✓ |
| ADR-006 | Data residency routing implemented in the DAL (Data Access Layer), not in the business layer | Endpoint/region resolution logic is internal to the DAL. The business layer passes only tenant context; the DAL resolves the correct endpoint. Maintains separation of concerns and makes the pattern reusable without coupling. | ✓ |

---

## Effort and Cost Assessment (firm)

> Internal use only. These are the CTO's **firm** estimates — they replace the PO's preliminary estimate (RP Section 13). They will be refined by the Tech Lead in the Tech Backlog. Not a contractual commitment or client-facing material.

### Development Effort

| Area | Estimate | Seniority |
|---|---|---|
| Backend — schema migration + participant state machine | 6 days | Senior |
| Backend — server-side WebSocket event filtering (anonymous mode) | 3 days | Senior |
| Backend — access control logic (invite, approval, removal, per-request validation) | 5 days | Mid-Senior |
| Backend — auth extension for OIDC group-claim (Azure AD) | 5 days | Senior |
| Backend — LGPD data residency routing (Option C, `sa-east-1`) + DAL | 10 days | Senior |
| Frontend — room owner access settings panel | 4 days | Mid |
| Frontend — participant UI (anonymous aliases, Observer view, approval/waiting screen) | 3 days | Mid |
| QA — functional + security + multi-tenant + LGPD validation | 5 days | QA |
| **Firm total** | **25 days** | |

> **Note on discrepancy vs. original intake estimate:** the original intake-level estimate (before Discovery) was 25 days for the core feature, without accounting for Azure AD or LGPD. The CTO's firm number coincides numerically (25 days), but with a different composition: the access control core was adjusted downward (greater precision after Discovery), while Azure AD work (5 days) and LGPD Option C (10 days) were added. The PO's preliminary estimate was ~29 days. The difference reflects the technical granularity applied by the CTO in separating the areas.

### Infrastructure Impact

No new application services. Schema migration on the existing cluster (`us-east-1`). The conditional `sa-east-1` routing requires a write endpoint or RDS instance in the Brazil region:

- **If already provisioned:** no procurement impact. Configure endpoint in the DAL.
- **If not provisioned:** start procurement immediately. RDS instance `db.t3.medium` estimated for the initial load — verify the correct tier with DevOps. Development of other parts can proceed in parallel, but LGPD routing merge and testing are blocked until the environment is available.

### Third-Party Cost Impact

None beyond existing services. Azure AD integration is on the client side (no cost to the platform). The transactional email provider is already contracted — only a new template.

### Recurring Operational Cost Impact

Low to medium. The database endpoint in `sa-east-1` adds recurring infrastructure cost (estimated: to be determined via infrastructure review with DevOps). This cost should be factored into the pricing of LGPD-flagged tenants in future commercial planning — the routing pattern, once established, becomes the baseline for all future regional compliance requirements.

### TCO Assessment

This feature adds significant and lasting complexity to the participant model (state machine) and to the infrastructure layer (multi-region routing). Future features that touch session membership (SSO/SAML, audit logs, guest access with tokens) and multi-region data residency will build on this foundation — the investment here reduces the marginal cost of those phases. The LGPD routing pattern via DAL, once established, becomes reusable for any future regional compliance requirement without coupling to the business logic.

---

## Discovery Path (if technical unknown blocks)

> Not applicable — all technical unknowns were resolved during Discovery (2026-03-18 to 2026-03-25). Technical spikes are documented in the Discovery log of the Intake Record ([`01-intake-record-access-control.md`](./01-intake-record-access-control.md)).

| Unknown | Spike / Investigation | Who | Result |
|---|---|---|---|
| Azure AD integration: SSO vs. OIDC group-claim vs. webhook | 1-day technical spike | Rodrigo Lima (CTO) | Resolved: OIDC group-claim viable (ADR-001) |
| LGPD data residency posture | 1-day infrastructure review | Rodrigo Lima (CTO) | Resolved: Option C recommended and adopted (ADR-002) |
| Jira integration: mandatory or desirable | Client call | Sales + Construtora Ágil | Resolved: not mandatory, moved to backlog |
