# Intake Record — Queue Voting

## Metadata

| Field | Value |
|---|---|
| **Record ID** | INT-2024-001 |
| **Version** | v2 |
| **Registered by** | Ana Costa (Customer Success) |
| **Registration date** | 2024-03-12 |
| **Status** | Approved — in execution planning |
| **Triage date** | 2024-03-13 |
| **Triaged by** | Lucas Mendes (PO) |
| **Linked Readiness Package** | RP-2024-001 v2 |

## Revision History

| Version | Date | Event | Summary |
|---|---|---|---|
| v1 | 2024-03-12 | Intake registered | CS registered demand from Banco Meridional quarterly review call. |
| v1 | 2024-03-13 | Triage completed | PO triaged as Product Ready. Readiness Package initiated. |
| v1 | 2024-03-20 | RP-2024-001 v1 submitted | PO submitted first Readiness Package to PM. |
| v1 | 2024-03-22 | RP rejected by PM | PM returned package: missing rollout strategy and incomplete acceptance criteria for edge cases. |
| v2 | 2024-03-28 | RP-2024-001 v2 approved | PO resubmitted with corrections. PM approved. Demand advances to execution planning. |

---

## Origin

| Field | Value |
|---|---|
| **Source** | Client |
| **Client** | Banco Meridional (enterprise customer, planning ceremonies for 12 squads) |
| **Reported via** | CS quarterly review call |

---

## Type

- [x] Feature
- [ ] Bug
- [ ] Improvement
- [ ] Compliance
- [ ] Integration
- [ ] Operational

---

## Problem Statement

During sprint planning ceremonies, teams use the poker planning room to estimate user stories. However, facilitators currently have no way to control which questions or user stories get voted on next. All participants can see the full backlog of items simultaneously.

The specific pain reported: when a facilitator shares a list of 20+ stories with the team, participants jump ahead, read future items, form premature opinions, and derail the estimation flow. There is no mechanism to queue items and reveal them one at a time.

Additionally, the client wants votes to remain hidden until the facilitator explicitly reveals them, preventing anchoring bias where participants copy the first vote they see.

---

## Business Impact

| Dimension | Detail |
|---|---|
| **Revenue** | Banco Meridional has 3 other squads not yet using the platform. Adoption is blocked by this UX gap. Estimated expansion ARR: R$ 28.000/year. |
| **Retention** | CS flagged this as a renewal risk. Contract renewal in 90 days. |
| **Operational** | Facilitators are using workarounds (sharing stories one at a time via chat) which adds 15–20 min per ceremony. |
| **Competitive** | Two competing tools already support this. It was mentioned as a differentiator gap in the renewal call. |

---

## Stakeholders

| Stakeholder | Role | Interest | Influence |
|---|---|---|---|
| Ana Costa | Customer Success | Renewal retention for Banco Meridional | High — primary demand reporter, owns client relationship |
| Banco Meridional Scrum Masters | End users (facilitators) | Ceremony flow control and vote integrity | High — direct users of the feature |
| Banco Meridional Developers | End users (voters) | Less distraction, more focused estimation | Medium — affected but not decision-makers |
| Lucas Mendes | PO | Product alignment and delivery quality | High — owns rationalization and Readiness Package |
| PM (TBD) | Project Manager | Delivery execution | High — accountable for timeline and capacity |
| CEO | Executive sponsor | Revenue retention and platform growth | Medium — not involved day-to-day, but informed of renewal risk |

---

## Assumptions

These are conditions assumed to be true at intake. If any assumption proves false, the demand must be re-triaged.

1. The existing WebSocket infrastructure supports new event types without requiring a new broker or messaging layer.
2. Session state persistence is already implemented and can be extended with new fields (queue order, reveal state) without a full schema migration.
3. Banco Meridional's Scrum Masters have authority to adopt new platform features without requiring IT approval from their organization.
4. The feature applies to all room types equally — no special handling needed for different ceremony formats.
5. A single facilitator per session remains the model (no co-facilitation required in this release).

---

## Constraints

Conditions that limit the solution space and must be respected regardless of what is built.

| Constraint | Type | Detail |
|---|---|---|
| Renewal deadline | Time | Contract renewal in 90 days. Feature must be live before renewal conversation. |
| No mobile redesign | Scope | Existing mobile layout applies. No new mobile-specific UI investment in this release. |
| Single facilitator model | Scope | Co-facilitation is explicitly out of scope. Architecture must not foreclose it but need not implement it. |
| Zero downtime deployment | Technical | Feature must be deployable without session disruption for active clients. |
| No new external services | Budget | Feature must be built on existing infrastructure. No new third-party services may be contracted. |

---

## Preliminary Risks

Risks identified at intake — before technical assessment. Not a complete risk register (that belongs in the Readiness Package).

| Risk | Category | Initial Assessment |
|---|---|---|
| WebSocket event ordering inconsistencies under load | Technical | Unknown — needs load testing during QA |
| Vote concealment bypass via client-side inspection | Security | Likely mitigable — server must enforce, not client |
| Session state loss during facilitator reconnect | Technical | Needs resilience design — grace period or session snapshot |
| Anchor bias not fully eliminated (participants may still share verbally) | Product | Accepted — platform can only control digital visibility |
| Renewal deadline not met if discovery reveals architectural blockers | Schedule | Low probability based on initial assessment, but not zero |

---

## High-Level Scope Boundary

**In:** Facilitator queue management, sequential item reveal, vote concealment, facilitator-controlled vote reveal, session state persistence.

**Out:** Per-item timers, automated reveal triggers, multi-facilitator control, mobile redesign, reporting/analytics, Jira/Linear integration.

**Deferred:** Auto-reveal preference toggle, queue template reuse, ceremony analytics dashboard.

---

## Priority

**Level:** High

**Reason:** Contract renewal in 90 days. CS has flagged as a potential churn signal if unresolved.

---

## Success Criteria

High-level indicators that define what "done and valuable" looks like for this demand. Detailed measurable targets are owned by the Readiness Package — these are the intake-level signals.

| Criterion | Type | Indicator |
|---|---|---|
| Banco Meridional contract renewed | Business | Renewal signed before contract expiry date |
| 3 pending squads onboarded | Business | Squad activation count in account dashboard within 60 days of release |
| Ceremony duration reduced | Operational | Average session time for 10+ item ceremonies drops by ≥ 20% vs. baseline |
| Facilitator workaround eliminated | Operational | No CS tickets reporting manual story-sharing workaround post-release |
| Zero vote anchoring complaints | Quality | No CS tickets citing vote visibility before reveal as a problem |
| Feature adopted without training | UX | Facilitators activate queue and reveal controls without requiring support intervention |

---

## PO Triage Notes

This demand is real, recurring across 3 other enterprise clients (CS has informal records), and aligns with the platform's roadmap toward facilitator control and ceremony quality. The scope is bounded and does not appear to require platform-level architectural changes — no new infrastructure, no AI/runtime impact.

**Decision path:** Product Ready → Rationalization

**Architectural escalation to CTO:** No. UI and session state changes only. To be confirmed during rationalization.

**Assumptions validated at triage:** All five assumptions above are considered reasonable. No immediate red flags.

**Constraints acknowledged:** Renewal deadline is the binding time constraint. PM must factor this into capacity assessment from day one.
