# Submitter Brief — Room Access Control

> **This is the Submitter Brief** — the first artifact of the journey (`00`) and the deliverable of the Submitter persona. It **instantiates** the model from [`personas/01-submitter.md`](../../../personas/01-submitter.md): the reasoning (compliance requirements, ToDo generation, score formula) lives in the persona; this document **instantiates** it per demand, in the **Submitter's language** — problem, value, pain, opportunity. Each answer carries how solid it is and where it came from: the confidence layer travels *with* the capture.
>
> **Journey:** `00 Submitter Brief` → [`01 Intake Record (PO — triage)`](./01-intake-record-access-control.md) → [`02 Readiness Package (PO)`](./02-readiness-package-access-control.md) → [`03 Technical Assessment (CTO)`](./03-technical-assessment-access-control.md) → [`04 PRD (PO+CTO → PM)`](./04-prd-access-control.md). See [`README.md`](./README.md).
>
> **Nothing precedes this document as an artifact.** What comes before is **raw signal** — a pre-close call with the client, an email thread with Sales, a meeting note — that **is not an artifact**. That signal enters *here* as evidence/source (disposition `inferred`, with `source`); it is the **capture** that transforms it into this first formal document.
>
> **Handoff:** freezes when `gateReady = true` (every blocking requirement resolved by an honest disposition) and is handed off to the **PO**, who formalizes and triages it in the [`01 Intake Record`](./01-intake-record-access-control.md).

## The two lenses (every demand is read through both simultaneously)

> See [`personas/01-submitter.md` §2](../../../personas/01-submitter.md). ToDos live where the lenses intersect: "given what *this* demand means, what does the contract still need?"

| Lens | What it is | Where it appears in this document |
|---|---|---|
| **Contract** (deterministic) | The fixed compliance requirements every demand must satisfy to move forward | **Readiness Summary** + the numbered requirements (score + pending items) |
| **Semantic** (contextual) | What *this* demand means: the real pain (open access exposes identities in mixed-team ceremonies), its value thesis (R$ 42k deal blocked), its unknowns (Azure AD, LGPD, Jira) | **Problem Statement**, **Impact**, **Value Indicators** and their tensions |

## Metadata

| Field | Value |
|---|---|
| **Demand** | Room Access Control |
| **Submitted by** | Rafael Souza (Sales) |
| **Capture date** | 2026-03-15 |
| **Status** | Ready for handoff (`gateReady`) |
| **Linked Intake Record** | INT-2026-002 (assigned by PO at triage) |

## Revision History

| Version | Date | Event | Summary |
|---|---|---|---|
| v1 | 2026-03-15 | Capture initiated and completed | Sales (Rafael Souza) captured the demand immediately after the pre-close call with Construtora Ágil. All blocking requirements resolved by honest disposition; 3 integration unknowns recorded as Discovery. |

---

## Readiness Summary

> Snapshot of the capture. The score is derived from the requirements below; `low_confidence` counts as partial. The demand is only handed off to the PO when all blocking requirements are resolved (`gateReady = Yes`).

| Field | Value |
|---|---|
| **Readiness Score** | 84 % |
| **Gate released (gateReady)** | Yes |
| **Pending blocking requirements** | — (all resolved by honest disposition) |
| **Dispositions** | 5 answered · 1 inferred · 4 assumptions · 3 discovery · 0 delegated |

> **How to read the score:** blocking requirements (1, 2, 3, 4) are all resolved. The score stays below 100% because urgency (req. 5) and constraints (req. 7) have fields with `low_confidence` and the 3 integration unknowns enter as `discovery` — an honest disposition that counts partially in the calculation. This does not block the gate; it only signals what the PO needs to watch.

### Confidence legend (applies to each answered section)

| Attribute | Values |
|---|---|
| **Confidence** | 0–100 |
| **Source** | Direct Submitter · Attached document (p.X) · Inferred · Assumption · Other stakeholder |
| **Status** | Empty · Low confidence · Resolved |
| **Disposition** | Answered · Inferred · Assumption (to validate) · Discovery (to investigate) · Delegated (owner: __) |
| **Hint** | Why confidence is low / what would raise it |

> **"I don't know" does not block.** A requirement reaches readiness by any honest disposition — including "nobody knows yet, and this is the plan" (Discovery) or "we are assuming X" (Assumption). See [`personas/01-submitter.md` §6](../../../personas/01-submitter.md).

---

## Origin  ·  *(Requirement 2 — Originator and context)*

| Field | Value |
|---|---|
| **Source** | Client |
| **Client / Requester** | Construtora Ágil (mid-market, onboarding process in progress) |
| **Originator and context** | Rafael Souza (Sales), pre-close call on 2026-03-15. Construtora Ágil's IT Lead (Fernanda Ramos) and Scrum Masters participated in the call. |
| **Reported via** | Pre-close video call — notes recorded by Rafael immediately after the call |

`Confidence:` 95 · `Source:` Direct Submitter · `Status:` Resolved · `Disposition:` Answered · `Hint:` —

---

## Type

- [x] Feature
- [ ] Bug
- [ ] Improvement
- [x] Compliance
- [x] Integration
- [ ] Operational

---

## Problem Statement  ·  *(Requirement 1 — blocks gate)*

> What is the existing pain? Describe the problem, not the solution.

Construtora Ágil runs agile planning ceremonies with mixed teams: internal developers, external contractors, and product managers. The platform's current model is completely open — anyone with the room link enters, sees everyone's names, and can vote. This creates three concrete pain points:

1. **No entry control:** external contractors with the link can enter without the facilitator's approval, violating the company's internal data governance policy.
2. **No anonymity among voters:** in sessions with contractors, cross-visibility of identities is prohibited by internal policy. There is currently no way to hide who is in the room.
3. **No role differentiation:** product managers and executives who want to observe the ceremony without influencing estimates have no observer mode — they either join as voters or stay out.

The result is that Construtora Ágil **cannot complete onboarding** until these gaps are addressed. The deal is contingent on this feature.

`Confidence:` 92 · `Source:` Direct Submitter · `Status:` Resolved · `Disposition:` Answered · `Hint:` —

---

## Who Is Impacted (Reach)  ·  *(Requirement 3 — blocks gate)*

> Personas, segments, or teams that feel this pain.

| Persona / Segment | How they are impacted |
|---|---|
| **Construtora Ágil Scrum Masters** | Need granular control over who enters and what they see; currently managing access outside the platform (manual workaround). |
| **Construtora Ágil external contractors** | Participate in sessions but must not see colleagues' identities; currently see everything. |
| **Product Managers / Executives** | Want to observe ceremonies without voting; currently either join as voters (influencing the process) or stay out. |
| **Construtora Ágil IT Lead (Fernanda Ramos)** | Responsible for LGPD compliance and Azure AD integration; needs technical guarantees before go-live. |
| **Enterprise deals in pipeline (2 identified)** | Two other prospects with the same requirement signaled by Sales in Q1. |

`Confidence:` 88 · `Source:` Direct Submitter + inferred from call · `Status:` Resolved · `Disposition:` Answered · `Hint:` The 2 pipeline deals are Sales signals without written client confirmation — confidence slightly lower than the main deal.

---

## Business Impact  ·  *(Requirement 4 — blocks gate)*

> Applicable dimensions quantified where possible.

| Dimension | Detail |
|---|---|
| **Revenue** | Construtora Ágil deal: R$ 42,000/year (ARR). Contingent on this feature — without it, the contract does not close. Sales made an informal delivery commitment of 60 days (to be validated with PM before confirming to client). |
| **Market** | Two additional enterprise pipeline deals with the same requirement signaled by Sales in Q1. Potential of R$ 84,000+ in additional ARR if the feature is generic enough. |
| **Retention** | Not applicable — client not yet onboarded. Becomes relevant after onboarding. |
| **Operational** | Scrum Masters use manual workarounds today (controlling who receives the link, out-of-platform notifications). Real operational impact for the facilitator. |
| **Compliance** | Construtora Ágil operates under internal data governance policies. LGPD requirement: participant identity data must reside in Brazil. Non-negotiable for this client. |

`Confidence:` 90 · `Source:` Direct Submitter (main deal) + inferred (pipeline) · `Status:` Resolved · `Disposition:` Answered · `Hint:` The value of the 2 pipeline deals is not quantified — assumption that they follow a similar profile to Construtora Ágil. The Sales 60-day commitment has no capacity validation; PO should investigate before confirming.

---

## Value Indicators (RICE-lite)

> A mirror to challenge thinking — **not** automatic ranking. Effort stays *soft* (Submitter's guess; firmed up later by CTO).

| Indicator | Score | Rationale (in their language) | Confidence |
|---|---|---|---|
| **Impact** ("how much does it move the business?") | High | R$ 42k ARR blocked + 2 pipeline deals with the same requirement. Feature unlocks an enterprise segment that currently cannot onboard. | 88 |
| **Reach** ("how many people feel this?") | Medium | Directly affects Construtora Ágil + the 2 pipeline deals. On the current platform, impacts the enterprise/regulated segment — a minority of total volume but high value per account. | 75 |
| **Urgency** ("why now? cost of waiting?") | High | Every week without the feature delays deal closure and increases the risk of the client seeking an alternative. Sales already made an informal 60-day commitment. | 85 |
| **Effort** *(soft — deferred to CTO)* | High | Sales intuition: involves access control, Azure AD integration and LGPD compliance. Probably larger than it appears. | low_confidence |

> **Recorded tensions:**
> - **High Impact + Medium Reach:** the per-account impact is high (R$ 42k), but immediate reach is limited to a specific segment. Resolution: per-account value is sufficient to justify; the pattern created serves as a foundation for the broader enterprise segment.
> - **High Urgency + (soft) High Effort:** real risk that the informal 60-day deadline is not viable if effort is larger than expected. Disposition: technical Discovery before any external date commitment.

---

## Urgency  ·  *(Requirement 5)*

**Deadline / window:** Sales made an informal commitment to the client of delivery in 60 days from mid-March. No date is confirmed until the PM runs a capacity assessment. Critical window: if the deal does not close in Q2, it risks prospect churn.

**Cost of waiting:** Construtora Ágil will not start onboarding without this feature. Every week of delay is a week of lost MRR. Additionally, the 2 pipeline deals may seek alternatives if delivery is significantly delayed.

`Confidence:` 80 · `Source:` Direct Submitter · `Status:` Low confidence · `Disposition:` Assumption (to validate) · `Hint:` The 60-day deadline is an informal Sales commitment without PM capacity validation. Confidence rises after PM confirms timeline viability.

---

## Evidence and Documents  ·  *(Requirement 6)*

> Attachments or prior conversations that support the demand.

| Document / Conversation | Type | Relevance |
|---|---|---|
| Pre-close call notes (2026-03-15) | Internal Sales notes | Primary source: pain described by Scrum Masters and Construtora Ágil IT Lead |
| Follow-up email from Fernanda Ramos (IT Lead) | Email thread | Written confirmation of LGPD requirements and need for Azure AD integration |
| Q1 pipeline signals (Sales) | Internal CRM | 2 deals with similar requirement identified by Rafael Souza |

`Confidence:` 78 · `Source:` Direct Submitter + document · `Status:` Low confidence · `Disposition:` Answered · `Hint:` Call notes are from Sales' perspective, not a transcript. Fernanda's email raises confidence in the LGPD/Azure AD requirement. Pipeline signals are CRM entries without detail — PO should confirm with Sales whether they are analogous or merely similar requirements.

---

## Stakeholders  ·  *(Requirement 8)*

| Stakeholder | Role | Interest | Influence |
|---|---|---|---|
| Rafael Souza | Sales — demand reporter | Close the Construtora Ágil contract | High |
| Fernanda Ramos (IT Lead — Construtora Ágil) | Client technical authority | Azure AD integration and LGPD compliance confirmed before go-live | High |
| Construtora Ágil Scrum Masters | Primary end users | Compliant access control for ceremonies with contractors | High |
| Ana Costa | Customer Success — post-sale relationship owner | Smooth onboarding and post-close health | Medium |
| Lucas Mendes | PO — rationalization owner | Product alignment and scope definition | High |
| Rodrigo Lima | CTO — technical assessment | Architectural integrity, LGPD compliance, Azure AD feasibility | High |
| CEO | Executive sponsor | New contract revenue and compliance posture | Medium |

`Confidence:` 92 · `Source:` Direct Submitter · `Status:` Resolved · `Disposition:` Answered · `Hint:` —

---

## Assumptions

Conditions assumed to be true at capture. If an assumption proves false, the demand must be re-triaged.

1. Construtora Ágil is willing and able to register the platform as an approved application in their Azure AD tenant — `to validate with:` Fernanda Ramos (IT Lead) at the start of Discovery
2. The client's IT team can complete Azure AD registration within the delivery window after technical specifications are provided — `to validate with:` Fernanda Ramos at project start
3. The existing auth layer (OAuth2) can be extended for OIDC group-claim validation without replacement or rewrite — `to validate with:` CTO (technical spike)
4. LGPD compliance can be achieved with tenant-based routing (without full platform migration) — `to validate with:` CTO (infrastructure review)
5. Jira integration is not required to close the deal — `to validate with:` Construtora Ágil (client call)
6. Aliases in anonymous mode are sufficient for compliance — no additional database-level masking beyond what is displayed — `to validate with:` PO + CTO
7. The scope of access control is per room, not per organization account — `to validate with:` PO at rationalization

---

## Constraints  ·  *(Requirement 7)*

Conditions that limit the solution space, to be respected regardless of what is built.

| Constraint | Type | Detail |
|---|---|---|
| Deal deadline (informal) | Time | Sales made an informal 60-day commitment to the client. No confirmation until PM capacity assessment. |
| LGPD compliance | Legal / Regulatory | Identity data for Brazilian client participants must reside in `sa-east-1`. Non-negotiable for this client. |
| Azure AD dependency (client side) | External | Construtora Ágil controls their own Azure AD tenant. Integration cannot be completed without action from their IT team. Deadline is partially outside our control. |
| No full enterprise SSO | Scope | Only OIDC group-claim validation for this release — not a full SSO/SAML implementation. |
| Backward compatibility | Technical | Existing open-link rooms must continue working without changes. Access control is opt-in per room, not a platform-level breaking change. |
| No new external auth providers | Budget | No new identity provider (Okta, Auth0, etc.) may be contracted. Only extension of the existing auth layer. |

`Confidence:` 85 · `Source:` Direct Submitter (business constraints) + inferred (technical) · `Status:` Resolved · `Disposition:` Answered · `Hint:` Technical constraints (backward compatibility, no full SSO) were confirmed on the call by the client's IT team. The deadline constraint has lower confidence because it is an informal commitment.

---

## Preliminary Risks

Risks identified at capture — before technical assessment. Full record belongs to the Readiness Package.

| Risk | Category | Initial Assessment |
|---|---|---|
| Azure AD registration delayed by client's IT team | External / Timeline | Medium — dependency outside our control; mitigation: provide spec and checklist to client IT team early |
| LGPD posture requires more infrastructure work than expected | Compliance | Medium — CTO must confirm scope before commitment |
| Sales' informal deadline commitment conflicts with actual capacity | Operational | High — PM must run capacity assessment before any external communication |
| Jira integration escalated to mandatory during delivery | Scope | Low — to be definitively closed in client call |
| Scope expansion pressure (audit logs, SSO, guest access) | Scope | Medium — explicit exclusions must be documented and enforced by PO |

---

## High-Level Scope Boundary

**In:** Access modes (Open / Invite-only / Mandatory approval), anonymous mode, Voter/Observer role assignment, participant removal, Azure AD OIDC group-claim mapping, per-client `sa-east-1` data residency routing with LGPD flag.

**Out:** Full SSO / SAML, audit logs, Jira integration, guest access without account registration, organization-level default settings, room password protection.

**Deferred:** Bulk invite via CSV, automatic Observer assignment by organizational role, compliance export for governance — feeds the backlog.

---

## Priority

**Level:** High

**Reason:** Pre-close blocker for the Construtora Ágil deal (R$ 42,000 ARR). Urgency validated by deal dependency and Sales' informal commitment. Without resolving the integration unknowns, the timeline cannot be confirmed.

---

## Success Criteria

High-level indicators that define "done and valuable." Detailed measurable targets belong to the Readiness Package.

| Criterion | Type | Indicator | Projected value |
|---|---|---|---|
| Construtora Ágil contract closed | Business | Contract signed after release | R$ 42,000 ARR |
| Zero unauthorized access incidents | Security / Compliance | None reported after go-live | 0 incidents |
| LGPD compliance confirmed by client | Legal | Construtora Ágil IT confirms data residency before go-live | Fernanda Ramos sign-off |
| Azure AD mapping working end-to-end | Technical | Employees and contractors receive correct roles automatically | 100% in UAT |
| At least 1 additional pipeline deal unblocked | Business | One of the 2 signaled deals advances to close | Within 90 days of release |
| Anonymous mode adopted in enterprise sessions | Product | Adoption in ≥ 30% of enterprise sessions | Within 60 days of release |
