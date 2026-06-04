# PRD — Concierge & Settlement

> The PRD (Product Requirements Document) is the **merger** of the [Readiness Package](./02-readiness-package-concierge-settlement.md) (product, authored by the PO) with the [Technical Assessment](./03-technical-assessment-concierge-settlement.md) (technical, authored by the CTO). It is the **only artifact that opens the downstream** — delivered to the **PM**. Each half maintains clear authorship: the PO does not write the technical part, the CTO does not rewrite the product. The PRD stitches, reconciles, and exposes to the PM what they need to plan. See [`personas/02-po.md` §2, §10 and §11](../../../personas/02-po.md).
>
> `PRD = RP (PO) + Technical Assessment (CTO)`
>
> **Journey:** [`00 Submitter Brief`](./00-submitter-brief-concierge-settlement.md) → [`01 Intake Record (PO — triage)`](./01-intake-record-concierge-settlement.md) → [`02 Readiness Package (PO)`](./02-readiness-package-concierge-settlement.md) → [`03 Technical Assessment (CTO)`](./03-technical-assessment-concierge-settlement.md) → `04 PRD (PO+CTO → PM)`.

## Metadata

| Field | Value |
|---|---|
| **PRD ID** | PRD-2026-050 |
| **Version** | v1 |
| **Linked RP** | RP-2026-050 v1 |
| **Linked Technical Assessment** | TA-2026-050 v1 |
| **Linked Intake** | INT-2026-050 |
| **Authors** | Rafael Souza (PO) + Davi Lima (CTO) |
| **Status** | Delivered to PM |
| **Delivered to PM on** | 2026-04-28 |

## Revision History

| Version | Date | Author | Status | Summary |
|---|---|---|---|---|
| v1 | 2026-04-26 | Rafael Souza (PO) + Davi Lima (CTO) | Draft | Initial merger RP-2026-050 + TA-2026-050. |
| v1 | 2026-04-28 | Rafael Souza (PO) + Davi Lima (CTO) | Delivered to PM | PRD reviewed and signed. Delivered to PM for planning. |

---

## Sign-off

> The merger only closes with dual sign-off. The feasibility verdict comes from the Technical Assessment.

| Role | Name | Verdict | Date |
|---|---|---|---|
| **PO** (product) | Rafael Souza | RP frozen (`freezeReady = true`) | 2026-04-25 |
| **CTO** (technical) | Davi Lima | **Feasible with caveats** — PSP migration on critical path; see TA-2026-050 | 2026-04-25 |

---

## Combined Executive Summary

> 2–4 paragraphs: the problem, what will be built, technical feasibility, and expected business outcome. The one-page view for CEO/CFO/PM.

StayFlow operates today with two critical operational bottlenecks that grow with booking volume: first-layer guest support is 100% human even for routine questions (CSAT 3.8/5; SLA missed on 34% of tickets; 4h+ queues at peak), and financial remittances to partner hotels are calculated and executed manually, with percentage errors in 3 incidents over the last 6 months — two partners at risk of termination and one chargeback absorbed without coverage. The demand arrived as "chatbot + remittance automation", but the passage through intake revealed two distinct technical domains with business rules, financial edge cases, and security requirements that constitute a medium-to-large delivery.

This PRD defines **Concierge & Settlement**, two capabilities delivered together: (1) **Concierge Service** — AI-automated first-layer support, with structured handoff to a human specialist (full context traveling with the ticket), a knowledge base about StayFlow bookings, and escalation rules configurable by the CS manager without code; (2) **Settlement Service** — automated split and remittance engine: calculates the amount per booking (per-hotel percentage, configurable withholding tax), executes via Stripe Connect, guarantees per-transaction idempotency, handles failures with automatic retries, reconciles automatically, and exports data for the hotel and for accounting.

From a technical standpoint, the solution is **feasible with caveats**: the migration of the current PSP (Pagar.me) to Stripe Connect is a non-negotiable precondition of the Settlement Service — Pagar.me does not offer the necessary idempotency and split guarantees. This migration is the item with the highest schedule risk and requires coordination with all partner hotels (connected account creation). The CTO estimated **89 engineering days** in total (vs. ~70 preliminary days from the PO), with team parallelism resulting in ~10 weeks of development. The Concierge Service does not depend on the PSP migration and can be delivered independently — the PM can evaluate a phased delivery.

The expected outcome: no partner termination due to remittance errors in the 90 days post-release, guest CSAT ≥ 4.3/5 in 60 days, ≥ 55% of tickets resolved by the Concierge without human intervention, and FinOps workload reduced from ~18 hrs/week to < 4 hrs. The foundation created — Stripe Connect with immutable ledger and Concierge with RAG — is reusable for the following phases (partner portal, WhatsApp, analytics).

---

## Part A — Product Definition (from the Readiness Package · PO)

> Synthesis of the RP's key sections. The full source document is [`RP-2026-050`](./02-readiness-package-concierge-settlement.md); here is what the PM needs to plan, without rewriting the entire RP.

### A.1 Objectives and Expected Outcome

1. Relieve the support team at the first layer: ≥ 55% of tickets resolved by the Concierge without human intervention.
2. Improve guest CSAT to ≥ 4.3/5 within 60 days post-release.
3. Eliminate remittance percentage errors: correct remittance rate ≥ 99.5%.
4. Eliminate duplicate remittance risk via idempotency — zero duplicates.
5. Reduce FinOps manual workload to < 4 hrs/week (from ~18 hrs current).
6. Protect partner trust: no termination due to remittance errors in the 90 days post-release.
7. Enable handoff with full context: specialist receives history + booking data when taking over ticket.

### A.2 Scope (final)

**Included:**
- Concierge Service: first-layer chatbot (web channel), bookings API integration, configurable escalation rules, handoff to Zendesk with context, CSAT, management panel.
- Settlement Service: per-hotel split engine, Stripe Connect, idempotency, failure handling (retry + alert), immutable ledger, automatic reconciliation, data export, FinOps panel.
- PSP Migration: Pagar.me → Stripe Connect for the remittance flow (does not affect guest billing in Phase 1).

**Excluded:**
- Partner hotel portal (self-service); integration with hotel invoice issuance; chatbot on additional channels (WhatsApp); Zendesk replacement; multi-currency; advanced BI.

**Deferred to Phase 2:**
- Partner portal with statements and self-service; proactive hotel notification about remittance; WhatsApp chatbot; integration with invoice issuer; advanced analytics; automated remittance receipt by email.

### A.3 Personas / Jobs-to-be-done

| Persona | Job | Impact |
|---|---|---|
| **Guest** | Get a quick response about their booking without waiting in a queue | Primary Concierge user — entire active guest base |
| **Specialist agent (CS)** | Receive pre-triaged tickets with full context; focus on cases requiring human judgment | Handoff + queues user. Gains efficiency without processing routine questions |
| **Partner hotel** | Receive correct remittance, on time, with predictability | Final Settlement beneficiary. Does not interact directly (portal deferred to Phase 2) |
| **FinOps (StayFlow)** | Close remittance cycle without manual tasks; have status and reconciliation visibility | FinOps panel operator — gains time and eliminates human error |
| **CS/Operations Manager** | Monitor Concierge quality and adjust rules without engineering | Management panel user — operational autonomy |

### A.4 Business Rules and Flows

See full detail in [RP-2026-050, Section 6](./02-readiness-package-concierge-settlement.md). Summary of critical rules for the PM:

**Concierge (key business rules):**
- BR-C03: Mandatory escalation under 4 conditions (guest request, 2 unresolved attempts, urgency keywords, financial dispute category).
- BR-C04: Handoff to Zendesk must include full transcript + booking data + category + reason.
- BR-C07: The Concierge **does not execute transactional actions** — informs and guides. Actions (cancellation, refund) are always escalated.

**Settlement (key business rules):**
- BR-S01: `remittance_amount = total_amount × (1 - commission_percentage) - withholding_tax`. Percentage is the one in the record at the time of calculation.
- BR-S03: Idempotency via `idempotency_key = hotel_id + period + hash(bookings)` — duplicates are rejected by Stripe.
- BR-S09: Remittance with percentage different from the record is blocked and alerts FinOps — no auto-correction.
- BR-S10: Immutable ledger — no DELETE/UPDATE. Corrections via adjustment entries.

### A.5 User Stories + Acceptance Criteria

Full stories with Given/When/Then in [RP-2026-050, Section 7](./02-readiness-package-concierge-settlement.md). Summary for the PM:

| ID | Story | Summarized acceptance criterion |
|---|---|---|
| ST-001 | As a guest, I want a contextualized response about my booking | Response with real data in < 5s; degraded mode if bookings API unavailable |
| ST-002 | As an agent, I want a Concierge ticket with history and booking data | Zendesk receives transcript + data + category + escalation reason |
| ST-003 | As a CS manager, I want CSAT separate by channel (Concierge and specialist) | CSAT collected on close; available in panel in < 5 min |
| ST-004 | As a manager, I want to configure escalation rules without code deployment | Saved rule takes effect in the next conversation without deployment |
| ST-005 | As FinOps, I want automatic remittance calculation per hotel | Verifiable and exportable calculation; withholding tax recorded separately |
| ST-006 | As FinOps, I want a guarantee that no remittance is duplicated | Stripe rejects duplicate idempotency key; 2 simultaneous triggers result in 1 remittance |
| ST-007 | As FinOps, I want an alert when a remittance fails after all retries | Alert with hotel + amount + reason after 3 failures; manual action available in panel |
| ST-008 | As FinOps, I want an automatic reconciliation report per cycle | Report generated at end of cycle; divergence > 0.01% alerts and highlights |
| ST-009 | As FinOps, I want to export cycle data per hotel | CSV/XLSX per hotel/period; with withholding tax and penalty itemized |

### A.6 Non-Functional Requirements (NFRs)

| Dimension | Requirement | Verification |
|---|---|---|
| Performance | Concierge: first response < 5s (with bookings API); Settlement: remittance per hotel < 10s (ex-Stripe) | Load tests in staging |
| Reliability | Concierge: ≥ 99.5% availability; Settlement: ≥ 99.9% on cycle days; independent services | Monitoring + downtime alerts |
| Security | PCI DSS SAQ A — card data never touches StayFlow servers; Stripe webhooks validated via HMAC; immutable ledger; FinOps panel with MFA | Security code review; pen test on payment flow |
| **Idempotency** (product requirement) | Every Settlement transaction is idempotent — same result N times | Idempotency tests with duplicate keys; partial failure simulation |
| Usability | Manager configures escalation rule in ≤ 10 min; FinOps triggers cycle in ≤ 3 clicks | Usability test before release |
| Auditability | Every financial operation recorded in ledger with timestamp, operator, and cross-reference | Ledger review after full cycle simulation |

### A.7 Edge Cases and Failure Modes

See full listing in [RP-2026-050, Section 9](./02-readiness-package-concierge-settlement.md). Critical edge cases for the PM to be aware of:

- **Remittance outside expected percentage**: blocked and FinOps alerted — not executed automatically.
- **Hotel without banking data in Stripe Connect**: remittance blocked; accumulates for next cycle after resolution.
- **Chargeback after remittance executed**: no automatic reversal; FinOps handles manually.
- **Partial refund after remittance executed**: FinOps alert to verify adjustment with the hotel.
- **LLM provider unavailable**: Concierge in degraded mode (pre-defined responses for top 10 questions + escalation of everything else).
- **Cycle triggered in parallel by two operators**: only one is processed — idempotency by key.

---

## Part B — Technical Definition (from the Technical Assessment · CTO)

> TA synthesis. The full source document is [`TA-2026-050`](./03-technical-assessment-concierge-settlement.md).

### B.1 Feasibility Verdict

| Field | Value |
|---|---|
| **Verdict** | **Feasible with caveats** |
| **Caveats** | (1) Migration to Stripe Connect is a Settlement precondition — without it, the service does not go to production. Requires coordination with all partner hotels. This is the item with the highest schedule risk. (2) LLM provider must be contracted before development. (3) Immutable ledger by design from the start — not retroactive. (4) Minimal PCI DSS scope requires card data to never touch StayFlow's servers. |

### B.2 Architectural Impact and Integrations

| Area / System | Impact | Note |
|---|---|---|
| **Stripe Connect** | New PSP for remittances — replaces Pagar.me in the split flow. Pagar.me remains for guest billing in Phase 1. | Requires creation of connected accounts per partner hotel before go-live |
| **Ledger (PostgreSQL append-only)** | New dedicated database for the Settlement Service. Immutable table with database triggers. | Isolated from the main database for financial integrity |
| **Concierge Service** | New service: LLM orchestration (OpenAI + Anthropic fallback), RAG with pgvector, escalation rules engine, Zendesk integration, and bookings API | Deployed and scaled independently of Settlement |
| **Settlement Service** | New service: split calculator, idempotency engine, Stripe Connect integrator, reconciliation engine | Asynchronous processing via message queue (SQS or equivalent) |
| **OpenAI API + Anthropic (fallback)** | New external LLM providers | Recurring cost per token; abstraction layer to avoid vendor lock-in |
| **Zendesk** | Integrated (not replaced) — new fields and routing rules | No change to existing helpdesk |
| **Internal Bookings API** | Only consumed — no modifications. Existing endpoint `/reservations/{id}/context` | — |

### B.3 Hard Constraints

| Constraint | Effect on scope |
|---|---|
| **Migration to Stripe Connect is a Settlement precondition** | Settlement does not go to production without the complete and tested migration. PM must plan the migration as a schedule milestone. |
| **Financial ledger immutable by design from the start** | Sprint 1 of Settlement must include the ledger design and implementation — cannot be postponed. |
| **PCI DSS: card data never touches StayFlow's servers** | Guest payment frontend uses Stripe Elements/Checkout. No custom payment form. |
| **Concierge and Settlement as independent services** | Two deployments, two databases, two pipelines. No direct synchronous calls between services. |
| **Stripe webhooks validated via HMAC** | The webhook receiver implementation is early scope — mandatory security code review before the first remittance cycle. |

### B.4 ADRs (architectural level)

| # | Decision | CTO sign-off |
|---|---|---|
| ADR-001 | Stripe Connect as remittance PSP (replacing Pagar.me) | ✓ |
| ADR-002 | Financial ledger: append-only table with database triggers (PostgreSQL) | ✓ |
| ADR-003 | Abstract LLM provider with interface (OpenAI + Anthropic fallback) to avoid vendor lock-in | ✓ |
| ADR-004 | Concierge and Settlement as independent services (not monolith) | ✓ |
| ADR-005 | Message queue for asynchronous processing of the remittance cycle (SQS or equivalent) | ✓ |
| ADR-006 | RAG with pgvector for Concierge knowledge base | ✓ |

---

## Scope Reconciliation

> The CTO did not veto any RP item. The caveats generated scope additions and design constraints, not cuts.

| Original item (RP) | Change after Technical Assessment | Reason |
|---|---|---|
| "Split engine with Pagar.me" (implicit in the original demand) | **Re-scoped**: migration to Stripe Connect as Settlement precondition | Pagar.me does not offer guaranteed idempotency or webhooks per beneficiary |
| "Transaction ledger" | **Reinforced with design constraint**: immutable by design from Sprint 1, with database triggers | Immutability cannot be added retroactively |
| "LLM integration" | **ADR added**: abstraction layer (LLMClient interface) + Anthropic fallback | Avoid vendor lock-in and risk of total Concierge downtime |
| "Remittance via banking integration" | **Clarified**: Stripe Connect handles the banking integration — StayFlow has no direct banking integration | Simplifies StayFlow's scope and maintains minimal PCI scope |
| Effort estimate (PO: ~70 days) | **Revised upward**: 89 engineering days (~10 weeks with parallel team) | PSP migration and financial tests were underestimated in the RP |

**Result:** RP scope maintained in full. No item was removed — the reconciliation added architectural clarity and a design constraint (ledger immutability) that the RP had not made explicit.

---

## Consolidated Risk and Dependency View

> Product/business risks (RP, Section 12) + technical risks (TA) in a single table — the PM plans against this view.

| Risk | Origin | Type | Probability | Impact | Mitigation |
|---|---|---|---|---|---|
| Zero-downtime PSP migration fails in production | TA | Technical / Integration | Medium | High | Dual-write (Pagar.me + Stripe coexisting for 1 sprint); end-to-end tests in staging with real data before production; rollback available |
| Hotel Gran Vista terminates before Settlement go-live | RP | External / Business | Medium | High | CS proactively communicates the schedule; if deadline is not achievable, decide between communicating to the partner or prioritizing a minimum Settlement MVP first |
| Chatbot worsens CSAT in the initial phase (inadequate responses) | RP | Product | Medium | High | Gradual rollout: 20% of traffic in the first 2 weeks; explicit guardrail — if CSAT falls < 3.8, shut down and return to human support |
| Stripe connected account creation for hotels with incomplete data | TA | Integration / Data | Medium | High | FinOps collects hotel data before migration; automated onboarding in FinOps panel; hotels without accounts are blocked for remittance (does not abort the other hotels' cycle) |
| Split calculation inconsistency (rounding or rule bug) | TA | Data / Financial | Low | High | Exhaustive unit tests with extreme cases; manual FinOps validation in the first cycle before removing the manual check |
| Commission percentages in the system diverge from contracts | RP | Business | Medium | High | FinOps (Bruno Takeda) validates and migrates the percentages from the spreadsheet to the system before go-live — blocking precondition |
| Silent Stripe webhook failure | TA | Integration | Low | High | Idempotency on receipt; status polling as fallback; dead-letter queue for unprocessed events |
| Withholding tax rule configured incorrectly per hotel | RP / TA | Compliance | Low | High | Legal reviews the rates before go-live; field manually configured by FinOps with explicit confirmation |
| LLM latency exceeds 5s at peak | TA | Infra / External | Medium | Medium | Anthropic fallback with 5s timeout; response streaming (SSE) to reduce latency perception |
| FinOps panel adoption slow (parallel spreadsheet use) | RP | Adoption | Medium | Medium | Training before go-live; "spreadsheet deactivation date" established with FinOps |
| Concierge knowledge base outdated | TA | Product / AI | Medium | Medium | Simple update process by CS manager (panel); bi-weekly review; dissatisfaction flag as incorrect response signal |

**Known external dependencies:**
- **Bruno Takeda (FinOps)** must migrate commission percentages to the system before Settlement go-live — blocking precondition.
- **All partner hotels** must have a Stripe Connect account created before the first automated remittance cycle — coordination between FinOps and CTO.
- **CS team** needs training on the handoff flow before Concierge go-live.
- **LLM provider** must be contracted and configured before the start of Concierge Service development.

---

## Effort and Cost (firm)

> From the Technical Assessment (replaces the RP preliminary). Internal use only — not a contractual commitment or client-facing material.

| Area | Firm estimate | Seniority |
|---|---|---|
| Backend — Concierge Service | 18 days | Senior |
| Backend — Settlement Service | 22 days | Senior |
| Backend — PSP Migration | 10 days | Senior |
| Frontend — Concierge Widget | 8 days | Mid-Senior |
| Frontend — Management Panel (Concierge) | 6 days | Mid |
| Frontend — FinOps Panel (Settlement) | 6 days | Mid |
| QA — Concierge | 6 days | QA |
| QA — Settlement (includes idempotency and financial tests) | 8 days | QA |
| DevOps / Infra | 5 days | DevOps |
| **Total** | **89 days** | |

> With parallel team (2 Seniors + 1 Mid-Senior + 1 Mid + 1 QA + 1 DevOps): **~10 development weeks**. PO estimate (~70 days) underestimated by ~27%, mainly due to PSP migration and financial tests.

**Infra / Third parties / Recurring OpEx:**
- OpenAI API (GPT-4o-mini): ~R$ 1,200/month
- Anthropic Claude Haiku (fallback): ~R$ 150/month
- Stripe Connect: ~0.5% per remittance + ~R$ 0.70/transfer (variable with GMV)
- Observability (Datadog/Grafana Cloud, if no existing stack): R$ 800–2,000/month
- New database for ledger: marginal (~R$ 50/month)

---

## Inherited Readiness and Open Dispositions

> What the PM needs to see before planning: assumptions to validate, Discovery unknowns, and delegated answers that survived to this point. If an assumption proves false during execution, the demand is re-evaluated.

| Field | Value |
|---|---|
| **Assumptions still to validate** | (1) Commission percentages per hotel will be migrated from the spreadsheet to the system by FinOps before go-live — blocking precondition for Settlement; (2) Withholding tax rule for each hotel will be reviewed and configured by FinOps/Legal before the first automated cycle |
| **Discovery unknowns** | All resolved (see [Intake Record — Discovery Log](./01-intake-record-concierge-settlement.md)) |
| **Delegated requirements (with owner)** | Percentage migration and withholding tax configuration per hotel: **Bruno Takeda (FinOps)** — must be done before Settlement go-live. Stripe account creation for hotels: **FinOps + CTO** — coordination needed during development. CS team training on handoff: **CS Manager (Camila Rocha)** — before Concierge go-live. |

---

## Success Criteria and Metrics (projected)

> Projected baseline for post-rollout comparison with actuals.

| Type | Metric | Target (projected) | Window | Confidence |
|---|---|---|---|---|
| **Primary** | First-layer resolution rate (Concierge) | ≥ 55% of conversations resolved without escalation | 30 days post-release | 70 |
| **Primary** | Correct remittance rate | ≥ 99.5% of remittances with amount within ±0.5% of expected | Per cycle | 85 |
| **Secondary** | Average guest CSAT | ≥ 4.3/5 | 60 days post-release | 65 |
| **Secondary** | FinOps hrs/week in remittance cycle | < 4 hrs/week | 60 days post-release | 60 |
| **Guardrail** | Overall support average CSAT must not fall | ≥ 3.8/5 (current baseline) during Concierge rollout | First 30 days | 90 |
| **Guardrail** | Zero duplicate remittances | 0 occurrences of duplicate payment | Throughout lifetime | 95 |
| **Guardrail** | Settlement availability on cycle days | ≥ 99.9% | Per cycle | 80 |

---

## Handoff to PM — Acceptance Gate

> The PM has **explicit authority to reject** the PRD and return it with specific gaps (not a generic "needs more detail"). The rejection and reason enter the Revision History; the PO (or the CTO, depending on the gap) addresses only the gaps and increments the version. See [`interactions/07-po-to-pm.md`](../../../interactions/07-po-to-pm.md).

| Delivery checklist | OK? |
|---|---|
| RP frozen (`freezeReady = true`) and referenced | ☑ |
| Technical Assessment signed (TA-2026-050 v1) | ☑ |
| Scope reconciliation recorded | ☑ |
| Risks and dependencies consolidated | ☑ |
| External dependencies explicit (FinOps, hotels, CS, LLM provider) | ☑ |
| Open dispositions visible (commission percentages, withholding tax, CS training) | ☑ |

**Priority and business context:** high. This is StayFlow's most urgent operational demand in Q2-2026. Hotel Gran Vista has an informal ~60-day deadline from 2026-04-07 to see progress. The PM must evaluate whether a phased delivery (Concierge first, Settlement after PSP migration) is safer for the deadline than a single delivery. The decision to communicate to the partner about the realistic schedule is CS/Operations' to make — but the PM needs to confirm whether the ~10-week development timeline is compatible with the business risk.
