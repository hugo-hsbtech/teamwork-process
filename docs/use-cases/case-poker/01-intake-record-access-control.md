# Intake Record — Room Access Control

> **This is the Intake Record — the formal artifact of the Intake Layer, authored by the PO.** It receives the [`00 Submitter Brief`](./00-submitter-brief-access-control.md) (`gateReady = true`), assigns the official ID `INT-2026-002`, and records the **PO's first act: triage** — the routing decision with traceable justification. See [`personas/02-po.md` §3 and §6.1](../../../personas/02-po.md).
>
> **It does not rewrite the Submitter's capture** — it **references** brief 00 and consolidates it. The product deepening (vision, scope, rules, metrics) is the **PO's second act** and lives in the [`02 Readiness Package`](./02-readiness-package-access-control.md).
>
> **Journey:** [`00 Submitter Brief`](./00-submitter-brief-access-control.md) → `01 Intake Record (PO — triage)` → [`02 Readiness Package (PO)`](./02-readiness-package-access-control.md) → [`03 Technical Assessment (CTO)`](./03-technical-assessment-access-control.md) → [`04 PRD (PO+CTO → PM)`](./04-prd-access-control.md).

## Metadata

| Field | Value |
|---|---|
| **Record ID** | INT-2026-002 |
| **Version** | v1 |
| **Submitter Brief (origin)** | [`00-submitter-brief-access-control.md`](./00-submitter-brief-access-control.md) |
| **Submitted by (Submitter)** | Rafael Souza (Sales) |
| **Triaged by (PO)** | Lucas Mendes (PO) |
| **Submission date** | 2026-03-15 |
| **Triage date** | 2026-03-17 |
| **Status** | Triaged — Product Ready (post-Discovery) |
| **Linked Readiness Package** | RP-2026-002 |

## Revision History

| Version | Date | Event | Summary |
|---|---|---|---|
| v1 | 2026-03-15 | Intake formalized | Sales (Rafael Souza) recorded the demand immediately after the pre-close call with Construtora Ágil. |
| v1 | 2026-03-17 | Triage completed | PO (Lucas Mendes) triaged. Three integration unknowns identified. Path decision: Discovery. |
| v1 | 2026-03-18 | Discovery opened | PO opened Discovery Brief. CTO notified for technical spikes (Azure AD, LGPD). Sales notified to schedule client call (Jira). |
| v1 | 2026-03-25 | Discovery closed | All 3 unknowns resolved within the 7-day time-box. Demand re-triaged as Product Ready. |
| v1 | 2026-03-27 | RP-2026-002 v1 approved | PO and CTO submitted the Readiness Package. PM approved on first review. |

---

## Readiness received from Submitter

> Snapshot inherited from brief 00 at handoff. The PO does not recalculate the capture — records what was received and what remains *soft*.

| Field | Value |
|---|---|
| **Readiness Score at handoff** | 84 % |
| **Blocking requirements** | All resolved by honest disposition (`gateReady`) — Yes |
| **Open dispositions** | 4 assumptions to validate · 3 discovery (integration unknowns) · 0 delegated |

---

## Consolidated demand

> Summary validated by PO against brief 00. Full detail, with per-field confidence, is in [`00`](./00-submitter-brief-access-control.md).

| Dimension | Summary | Inherited confidence |
|---|---|---|
| **Problem** (the pain, not the solution) | The platform offers no entry control, participant anonymity, or role differentiation within a room. Enterprise clients with mixed teams (internal + contractors) cannot operate within their internal data governance policies. | 92 |
| **Reach** (who is impacted) | Scrum Masters (facilitators), external contractors, observers (PM/executives) at Construtora Ágil. Pipeline: 2 enterprise deals with similar requirement. | 88 |
| **Business impact** | R$ 42,000 ARR blocked (deal contingent on feature). Potential of R$ 84,000+ additional via pipeline. Non-negotiable LGPD requirement for onboarding. | 90 |
| **Urgency** (why now) | Informal Sales commitment of 60 days. Without the feature, the deal does not close and the client may seek an alternative. | 80 |
| **Declared priority** | High | — |

---

## Triage — routing decision  ·  *(PO's Act 1)*

> PO evaluated all criteria before completing triage. See [`personas/02-po.md` §6.1](../../../personas/02-po.md).

### Evaluated criteria

| # | Criterion | Verdict | Rationale | Basis / Source |
|---|---|---|---|---|
| 1 | Is it a real problem (not an isolated symptom)? | Yes | The pain is structural: the platform's open-access model is incompatible with the security profile of enterprise clients with mixed teams. Not a symptom — it is a product limitation. | Brief 00, Problem Statement section |
| 2 | Is it recurring / does it have volume? | Yes | The requirement appeared in 2 other enterprise pipeline deals in Q1 — signals a segment need, not an isolated case. | Brief 00, Business Impact; Sales signals |
| 3 | Does it fit the product vision? | Yes | The platform needs to mature its access model to serve the enterprise segment. Access control, anonymity, and roles are natural product maturity requirements for a corporate collaboration tool. | Product strategy — PO |
| 4 | What is the technical and business impact? | High | R$ 42,000 direct ARR + 2 pipeline deals. CTO signaled architectural impact on the participant data model. Three integration unknowns identified at capture (Azure AD, Jira, LGPD). | Brief 00; prior CTO signal |
| 5 | Do urgency and impact justify acting now? | Yes | Pre-close blocker with informal deadline. Cost of inaction: deal loss. However, the integration unknowns prevent rationalization from starting — Discovery is needed first. | Brief 00, Urgency |

### Path decision

| Field | Value |
|---|---|
| **Decision** | Discovery (initial path) → Product Ready (after Discovery closure) |
| **Rationale** | Three integration unknowns identified at capture prevent scope definition: (1) Azure AD OIDC integration feasibility, (2) whether Jira integration is a hard requirement, and (3) current data residency posture for LGPD compliance. The demand cannot be scoped until these unknowns are resolved. Impact and urgency justify treating with highest priority in Discovery. |
| **Reversible?** | Yes — Discovery opens a lateral gate; if unknowns are not resolved within the time-box, PO escalates to CEO. |
| **Submitter notified** | Yes — 2026-03-17 |

> **Triage gate:** all criteria evaluated — informed decision. Discovery was opened with a defined time-box; upon closure, the demand was re-triaged as Product Ready, opening Act 2 (rationalization → RP).

---

## Architectural escalation to CTO

**Required:** Yes — the architectural impact is multiple: (1) change to the participant data model (new fields, state machine), (2) server-side filtering of WebSocket events for anonymous mode, (3) OIDC group-claim integration with Azure AD, and (4) LGPD data residency routing (`sa-east-1`). Any one of these individually would already justify escalation; all four together make the Technical Assessment indispensable.

> The Technical Assessment took place during Discovery (CTO technical spikes) and was formalized in the RP. See [`03 Technical Assessment`](./03-technical-assessment-access-control.md) and [`interactions/05-po-to-cto.md`](../../../interactions/05-po-to-cto.md).

---

## Assumptions validated at triage

> Which assumptions from brief 00 the PO reviewed and the verdict for each.

| Assumption (from brief 00) | PO Verdict | To validate with |
|---|---|---|
| Construtora Ágil is willing and able to register the platform in Azure AD | Accepted — confirmed on the pre-close call | Fernanda Ramos (IT Lead) — registration checklist at project start |
| The IT team can complete Azure AD registration within the delivery window | To validate — depends on client IT team availability | Fernanda Ramos — to confirm after technical Discovery |
| The existing auth layer can be extended for OIDC group-claim without rewrite | To validate — CTO technical Discovery will resolve | CTO (Azure AD technical spike) |
| LGPD compliance can be achieved with tenant routing without platform migration | To validate — CTO technical Discovery will resolve | CTO (infrastructure review) |
| Jira integration is not required to close the deal | To validate — client call will resolve | Construtora Ágil via Sales (call scheduled) |
| Anonymous aliases are sufficient for compliance without additional database masking | Accepted provisionally — plausible as minimum scope | PO + CTO at rationalization |
| Scope of access control is per room, not per organization account | Accepted — confirmed in pain description | Brief 00 — no conflict at triage |

---

## Recognized constraints

> Constraints the PM must consider from day one.

| Constraint | Type | PO Note |
|---|---|---|
| Deal deadline (informal, 60 days) | Time | No date may be communicated to the client before the PM's capacity assessment. PO owns this gate. |
| LGPD compliance (`sa-east-1`) | Legal / Regulatory | Non-negotiable for this client. CTO confirmed need for conditional routing (Option C). Adds ~2 weeks to effort. |
| Azure AD dependency (client side) | External | Integration cannot be completed without action from Construtora Ágil IT. Deadline partially outside our control. Technical spec must be delivered to client early. |
| No full enterprise SSO | Scope | Only OIDC group-claim validation in this release. SSO/SAML is a separate roadmap item. |
| Backward compatibility with existing rooms | Technical | Access control is opt-in per room. Existing open rooms must not be affected. CTO confirmed feasibility. |
| No new external auth providers | Budget | Only extension of the existing auth layer. No new providers (Okta, Auth0, etc.) may be contracted. |

---

## Discovery Brief

> Filled in because the initial path decision was **Discovery**. Closed on 2026-03-25.

### What was missing

| # | Unknown | Who can answer | Method |
|---|---|---|---|
| 1 | Azure AD integration: full SSO vs. OIDC group-claim validation vs. webhook sync | CTO | Technical spike (2–3 days max) |
| 2 | Jira integration: hard requirement or desirable for closing the deal | Construtora Ágil (via Sales) | Client call — Sales schedules within 3 days |
| 3 | LGPD data residency: current posture of participant session records | CTO | Infrastructure review (1 day) |

**Discovery time-box:** 7 days (2026-03-18 → 2026-03-25) — within the 2-week time-box.

---

### Discovery Log

#### 2026-03-18 — PO opens Discovery

Demand moved to Discovery. Three unknowns recorded. PO notified Rafael Souza (Sales) to schedule a follow-up call with Construtora Ágil's IT Lead to clarify the Jira requirement. CTO Rodrigo Lima notified for technical spikes on Azure AD and data residency.

---

#### 2026-03-20 — CTO Technical Spike: Azure AD

**Finding:** Azure AD integration via OIDC is feasible using the existing auth layer (which already supports OAuth2). Full SSO implementation is not required. The platform can request the `groups` claim at login and map AD groups to platform roles at session entry.

**Effort estimate:** 4–6 days (auth backend extension + role mapping logic).

**Client dependency:** Construtora Ágil must provide the Azure AD tenant ID and register the platform as an allowed application in the Azure portal. This is a client-side action — the timeline depends on their IT team.

**CTO recommendation:** Feasible with no new infrastructure required. Introduces a new auth flow affecting the participant model — architectural escalation stands.

---

#### 2026-03-21 — CTO Infrastructure Review: LGPD Data Residency

**Finding:** The platform uses a primary cluster in `us-east-1`. Session participant records (names, emails, metadata) are stored in this cluster. No replication to `sa-east-1`.

**LGPD implication:** Identity data for Brazilian client participants is stored outside Brazil. Delivering the feature to Construtora Ágil without addressing this exposes the company to LGPD risk.

**Options identified by CTO:**

| Option | Description | Effort | Risk |
|---|---|---|---|
| A | Migrate participant table to `sa-east-1` for all tenants | High (3–4 weeks) | Disrupts all clients |
| B | Per-tenant data residency routing (data stored in tenant's declared region) | Very high (6–8 weeks) | Platform change, new complexity |
| C | Store participant session data in `sa-east-1` only for clients with LGPD flag | Medium (~2 weeks) | Adds conditional routing logic, but scoped |

**CTO recommendation:** Option C for this release. Options A and B are strategic platform decisions requiring CEO alignment.

**PO note:** Option C adds ~2 weeks to total effort. Must be factored into the PM's capacity assessment and communicated to Sales before any client commitment.

---

#### 2026-03-22 — Client Call: Jira Integration Requirement

**Participants:** Rafael Souza (Sales), Ana Costa (CS), Fernanda Ramos (IT Lead — Construtora Ágil)

**Finding:** Jira integration **is not a hard requirement** to close the deal. Fernanda confirmed that voter and observer assignment via Azure AD group mapping is acceptable for Phase 1. Jira-based pre-population is a future wish, not a blocker.

**Scope impact:** Jira integration removed from this demand. Recorded as a separate backlog item: `BACKLOG-2026-007 — Jira Sprint Integration for Room Pre-population`.

---

### Discovery Outcome

**All three unknowns resolved.**

| # | Unknown | Resolution | Scope impact |
|---|---|---|---|
| 1 | Azure AD / OIDC integration | Feasible via OIDC group-claim. 4–6 days of effort. Client must register app in Azure portal. | Added to scope |
| 2 | Jira integration | Not required to close the deal. Moved to backlog. | Removed from scope |
| 3 | LGPD data residency | Not currently compliant. Option C: per-client LGPD flag with `sa-east-1` routing. ~2 weeks of effort. | Added to scope |

**New path decision:** Discovery → **Product Ready**

**Revised complexity:** Significantly higher than estimated at intake. The Readiness Package must reflect the Azure AD integration and LGPD data residency work. Total revised effort was 25 days (per Technical Assessment — TA-2026-002).

**Discovery closed:** 2026-03-25 (7 days — within the 2-week time-box ✓)

---

## Handoff

- `Product Ready` (post-Discovery): PO initiated **rationalization** → [`02 Readiness Package`](./02-readiness-package-access-control.md).
- Technical Assessment formalized in parallel → [`03 Technical Assessment`](./03-technical-assessment-access-control.md).
- PRD produced by fusion → [`04 PRD`](./04-prd-access-control.md) — delivered to PM.
