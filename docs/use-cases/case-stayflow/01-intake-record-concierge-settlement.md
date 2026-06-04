# Intake Record — Concierge & Settlement

> **This is the Intake Record — the formal artifact of the Intake Layer, authored by the PO.** It receives the [`00 Submitter Brief`](./00-submitter-brief-concierge-settlement.md) (`gateReady = true`), assigns the official ID `INT-AAAA-NNN`, and records the **PO's first act: triage** — the routing decision (Product Ready / Discovery / Backlog / Reject) with a traceable rationale. See [`personas/02-po.md` §3 and §6.1](../../../personas/02-po.md).
>
> **It does not rewrite the Submitter's capture** — it **references** the brief 00 and consolidates it. The product deepening (vision, scope, rules, metrics) is the **PO's second act** and lives in the [`02 Readiness Package`](./02-readiness-package-concierge-settlement.md).
>
> **Journey:** [`00 Submitter Brief`](./00-submitter-brief-concierge-settlement.md) → `01 Intake Record (PO — triage)` → [`02 Readiness Package (PO)`](./02-readiness-package-concierge-settlement.md) → [`03 Technical Assessment (CTO)`](./03-technical-assessment-concierge-settlement.md) → [`04 PRD (PO+CTO → PM)`](./04-prd-concierge-settlement.md).

## Metadata

| Field | Value |
|---|---|
| **Record ID** | INT-2026-050 |
| **Version** | v2 (post-Discovery) |
| **Submitter Brief (origin)** | [`00-submitter-brief-concierge-settlement.md`](./00-submitter-brief-concierge-settlement.md) |
| **Recorded by (Submitter)** | Camila Rocha (CS/Operations) |
| **Triaged by (PO)** | Rafael Souza (PO) |
| **Record date** | 2026-04-08 |
| **Initial triage date** | 2026-04-09 |
| **Final triage date (post-Discovery)** | 2026-04-22 |
| **Status** | Triaged — Product Ready (post-Discovery) |
| **Linked Readiness Package** | RP-2026-050 |

## Revision History

| Version | Date | Event | Summary |
|---|---|---|---|
| v1 | 2026-04-08 | Intake formalized | Brief 00 received with `gateReady = true`. PO initiated triage. |
| v1 | 2026-04-09 | Initial triage complete | Decision: Discovery. 3 unknowns identified. Discovery Brief opened. |
| v2 | 2026-04-22 | Discovery closed | All unknowns resolved. Decision revised: Product Ready. Escalation to CTO confirmed. |

---

## Readiness received from Submitter

> Snapshot inherited from brief 00 at handoff. The PO does not recalculate the capture — records what was received and what remains *soft*.

| Field | Value |
|---|---|
| **Readiness Score at handoff** | 81 % |
| **Blocking requirements** | All resolved by honest disposition (`gateReady`) — **Yes** |
| **Open dispositions** | 3 assumptions to validate · 1 discovery (PSP/fiscal) · 0 delegated |

---

## Consolidated demand

> One-screen summary, validated by the PO against brief 00 (not re-typed — it is the PO's reading). Full detail, with confidence per field, is in [`00`](./00-submitter-brief-concierge-settlement.md).

| Dimension | Synthesis | Inherited confidence |
|---|---|---|
| **Problem** (the pain, not the solution) | **Two distinct problems:** (A) first-layer guest support is 100% human, with SLA missed on 34% and CSAT falling (3.8/5); context is lost when transferring between agents. (B) financial remittance to the partner hotel is calculated and executed manually, with percentage errors in 3 incidents over the last 6 months; two partners at risk of termination. | 88 |
| **Reach** (who is impacted) | All platform guests (support channel); all partner hotels (remittance cycle); CS and FinOps teams internally. | 85 |
| **Business impact** | Risk of losing ~R$ 140k GMV/year (2 partners in termination talks); support cost at scale (R$ 28k+/month + future hires); financial manual workload of 18 hrs/week; exposure to contractual penalties. | 72 (estimates, not calculated) |
| **Urgency** (why now) | Hotel Gran Vista with an informal ~60-day deadline to see progress before evaluating termination. Booking volume growing — every cycle without automation amplifies the risk. | 75 (informal deadline, not documented) |
| **Declared priority** | High | — |

---

## Triage — routing decision  ·  *(PO's Act 1)*

> The PO evaluates each criterion (all evaluated = can conclude triage) and then makes **one** routing decision, with mandatory rationale. See [`personas/02-po.md` §6.1](../../../personas/02-po.md).

### Criteria evaluated

| # | Criterion | Verdict | Rationale | Basis / Source |
|---|---|---|---|---|
| 1 | Is it a real problem (not an isolated symptom)? | **Yes** | Both problems have concrete evidence: CSAT and SLA data in Zendesk, 3 remittance incidents documented in the financial log, formal complaint emails from partners. These are not hypotheses — they are operational facts. | Brief 00, Q1-2026 indicators slide, incident log |
| 2 | Is it recurring / does it have volume? | **Yes** | The support problem occurs on every ticket — structural, not episodic. The remittance problem occurs on every cycle (monthly) — and the errors are 3 in 6 months, with a worsening trend as volume grows. | Brief 00, Zendesk data |
| 3 | Does it fit the product vision? | **Yes** | StayFlow is a booking marketplace — guest support and remittance integrity to the partner are core operations, not peripheral. Automating both is directly aligned with the scalability of the business model. | Strategic alignment verified with Operations Director (present at Q2 meeting) |
| 4 | What is the technical and business impact? | **High** | Business impact: partner termination risk, operational cost at scale, legal exposure. Technical impact: payment split, idempotency, PSP integration, accounting reconciliation — a domain with non-trivial architectural complexity. Requires CTO assessment. | Brief 00, PO's preliminary assessment |
| 5 | Do urgency and impact justify acting now? | **Yes** | Gran Vista's 60-day deadline is real (even if informal). The cost of waiting grows linearly with volume. | Brief 00 — urgency and termination risk |

### Routing decision (initial — 2026-04-09)

| Field | Value |
|---|---|
| **Decision** | **Discovery** |
| **Rationale** | Three critical unknowns prevent the scope from being closed with confidence: (1) does the current PSP support native payment split? (2) what are the fiscal requirements of the remittance (withholding tax, invoice)? (3) does the booking system API have context endpoints consumable by support? Without these answers, the RP could be closed on wrong assumptions — especially the PSP one, which is critical for the Settlement domain. | — |
| **Reversible?** | Yes — Discovery → Product Ready after unknowns are resolved |
| **Submitter notified** | Yes — 2026-04-09 (Camila informed by email about the Discovery and the 14-day time-box) |

### Routing decision (revised — 2026-04-22, post-Discovery)

| Field | Value |
|---|---|
| **Decision** | **Product Ready** |
| **Rationale** | All three unknowns were resolved in Discovery (see Log and Result below). Scope can be closed. PSP migration was confirmed as necessary and enters scope. Basic fiscal requirements were mapped (with part deferred to Phase 2). The context API is viable. | — |
| **Reversible?** | N/A — opening Act 2 (rationalization → RP) |
| **Submitter notified** | Yes — 2026-04-22 (Camila informed of Discovery result and start of RP) |

---

## Architectural escalation to CTO

**Required:** **Yes** — The demand touches payment split, financial transaction idempotency, PSP/gateway integration, accounting reconciliation, and AI orchestration. All these domains require feasibility assessment, architecture choices, and constraints definition by the CTO before the product scope can be frozen.

> The escalation will be formalized during rationalization (RP). The CTO will produce Technical Assessment TA-2026-050 in parallel with the RP. See [`interactions/05-po-to-cto.md`](../../../interactions/05-po-to-cto.md).

---

## Assumptions validated at triage

> Which assumptions from brief 00 the PO reviewed and the verdict for each. Assumptions that survive travel forward explicitly.

| Assumption (from brief 00) | PO verdict | To validate with |
|---|---|---|
| Commission percentages per hotel are registered in a queryable spreadsheet or system | **To validate** — confirmed they exist, but the format (spreadsheet vs. system) defines the integration difficulty | Bruno Takeda (FinOps) — in Discovery |
| Current gateway has an API for creating and querying transactions | **To validate in Discovery** — the current PSP may not support split; this defines much of the Settlement scope | CTO — technical spike in Discovery |
| Support team uses an integrable helpdesk tool (Zendesk) | **Accepted** — Camila confirmed they use Zendesk. Zendesk API is public and well-documented. | — |
| Booking platform has an API with booking context data | **To validate in Discovery** — critical for the Concierge Service to be contextualized | CTO — internal API review in Discovery |

---

## Recognized constraints

> Constraints the PM must consider from day one (inherited from brief, validated here).

| Constraint | Type | PO note |
|---|---|---|
| Informal 60-day Gran Vista deadline | Time | Informal but real. PM must consider when planning capacity. If the firm technical effort (TA) exceeds the deadline, it is a business decision to communicate to the partner. |
| PCI DSS — payment compliance | Legal / Technical | The guest billing and remittance flow touches card data. The solution must be PCI-compliant or use a PSP that absorbs the scope. CTO will confirm in the TA. |
| Individual percentages per hotel | Scope | Each hotel has its own percentage. The split engine must support per-partner configuration — not a global percentage. |
| Must not interrupt ongoing bookings | Technical | Any change to the PSP or gateway must be done with zero downtime on existing bookings. Migration strategy required. |
| Zendesk as existing support system | Technical / Scope | Support automation must integrate with existing Zendesk — replacing the helpdesk system is out of scope. |

---

## Discovery Brief

> Fill in only if the routing decision is **Discovery**. Otherwise, remove this section.

### What was missing

| # | Unknown | Who can answer | Method |
|---|---|---|---|
| 1 | Does the current PSP/gateway (existing payment integration) support native payment split between StayFlow and the hotel? If not, what are the options (migrate to a PSP with split, multi-PSP architecture, manual split via ledger)? | CTO (Davi Lima) | Technical spike — review current PSP documentation and evaluate Stripe Connect / Adyen Marketplace / Pagar.me as alternatives |
| 2 | What are the fiscal and accounting requirements of the remittance to the partner hotel? Is there withholding tax? Does StayFlow issue an invoice on the remittance? Does the hotel issue an invoice to StayFlow? How should reconciliation be structured from an accounting standpoint? | Legal/Accounting (Isabela Ramos) + FinOps (Bruno Takeda) | Meeting with both areas; review of partner hotel contracts |
| 3 | Does the StayFlow internal booking system API expose context data (booking status, guest, check-in/out, hotel details) in a form consumable by the Concierge Service? What is the format, expected latency, and any limitations? | CTO (Davi Lima) | Review internal API documentation; consumption spike of the relevant endpoint |

**Discovery time-box:** 14 calendar days (2026-04-09 → 2026-04-22)

---

### Discovery Log

#### 2026-04-11 — Technical spike: current PSP

Rafael and Davi reviewed the documentation for the current integration with Pagar.me (PSP in use). Result: Pagar.me has split support via "Split Rules", but with limitations: (a) the split is configured at transaction time, not programmatically afterwards; (b) there is no native idempotency guarantee — a duplicate transaction can generate two remittances; (c) the split API has no confirmation webhook per beneficiary.

**Partial decision:** the current PSP is not adequate for the Settlement model without a proprietary idempotency ledger. Davi initiated evaluation of Stripe Connect and Adyen Marketplace as alternatives.

#### 2026-04-14 — Meeting with FinOps and Legal

Bruno Takeda (FinOps) and Isabela Ramos (Legal) participated. Results:
- The hotel remittance is financial (bank transfer), not an invoice from StayFlow — it is the hotel that issues the invoice for its own services rendered to StayFlow (StayFlow is the hotel's client, not the other way around). In some cases, StayFlow must withhold income tax at the source (legal-entity hotels with certain tax classifications). The fiscal rule depends on each hotel's tax ID — a field to be registered.
- Today's reconciliation is manual in a spreadsheet. There is no system. The process requires: record of the executed remittance, comparison with the expected amount (commission × booking), and monthly export per hotel.
- Invoice issued by the hotel to StayFlow: each hotel has its own process. StayFlow does not issue an invoice on the remittance — it pays, it does not receive a service. Integration with the hotel's invoice issuance is outside StayFlow's control (each hotel has its own fiscal system).

**Decision:** hotel invoice issuance is the hotel's responsibility; StayFlow must record the remittance and export data so the hotel can issue the invoice. Invoice automation deferred to Phase 2 (would require integration per tax ID/regime for each hotel — disproportionate complexity for the MVP). Withholding tax rule: enters the split engine scope as a configurable field per hotel.

#### 2026-04-16 — Technical spike: internal bookings API

Davi reviewed the internal documentation. Endpoint `/reservations/{id}/context` exists and returns relevant data: `guest_name`, `hotel_name`, `check_in`, `check_out`, `status`, `booking_id`, `room_type`. Latency measured in staging: ~140ms p95. Authentication via internal JWT. No relevant rate limits for the expected support volume.

**Decision:** viable. The Concierge Service can consume this endpoint to personalize AI responses. No changes needed to the bookings API.

#### 2026-04-18 — Alternative PSP evaluation

Davi finalized evaluation of Stripe Connect. Result: supports native split via "connected accounts", with idempotency keys per transaction (resolves the duplicity problem), confirmation webhooks per beneficiary, and PCI DSS Level 1 compliance absorbed by Stripe. Additional cost: ~0.5% per remittance transaction. Migration requires: creating Stripe accounts for each partner hotel, mapping split contracts, testing end-to-end flow.

**CTO decision (partial):** migration to Stripe Connect is the recommended route. Will be formalized in the TA. The migration is a scope item that enters the PRD.

---

### Discovery Result

| # | Unknown | Resolution | Scope impact |
|---|---|---|---|
| 1 | Does current PSP (Pagar.me) support native split? | **Not adequately.** Pagar.me has basic split but without guaranteed idempotency. CTO recommendation: migrate to Stripe Connect (native split, idempotency keys, webhooks, PCI). | **Added to scope:** migration to Stripe Connect as a precondition for the Settlement Service. Migration estimate enters the TA. |
| 2 | Fiscal requirements of the remittance | **Partially mapped.** Withholding tax: configurable per hotel (field to be registered). Invoice is the hotel's responsibility; StayFlow exports the data. Accounting reconciliation: manual process to be automated. | **Added to scope:** withholding tax field per hotel, data export for invoicing, reconciliation module. **Deferred:** integration with hotel invoice issuer (Phase 2). |
| 3 | Does the internal bookings API have a context endpoint? | **Yes.** Endpoint `/reservations/{id}/context` available, latency ~140ms p95, no relevant limitations. | **Added to scope:** Concierge Service consumes the endpoint to contextualize AI responses. No changes to the bookings API. |

**New routing decision:** Discovery → **Product Ready**

**Discovery closed:** 2026-04-22 (13 calendar days — within the 14-day time-box)

---

## Handoff

- **Product Ready** confirmed (2026-04-22): PO initiates **rationalization** → [`02 Readiness Package`](./02-readiness-package-concierge-settlement.md).
- **Escalation to CTO** confirmed (2026-04-22): CTO produces Technical Assessment TA-2026-050 in parallel with the RP.
- Submitter (Camila) notified of the Discovery result and start of RP — 2026-04-22.
