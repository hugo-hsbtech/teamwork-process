# Readiness Package — Concierge & Settlement

> The Readiness Package (RP) is the **product definition of done** — the PO's product output, written **alone**. It is a complete and self-contained document: vision, problem, scope, rules, user stories, NFRs, edge cases, criteria, and metrics. **The RP contains no sections authored by the CTO.** The technical assessment lives in a separate artifact — the [Technical Assessment](./03-technical-assessment-concierge-settlement.md) (CTO) — which the RP only **references** (see "Technical Assessment Reference"). The merger of the two happens in the [PRD](./04-prd-concierge-settlement.md), and it is the PRD — not the RP — that opens the downstream. See [`personas/02-po.md` §2 and §6.2](../../../personas/02-po.md).
>
> The RP **inherits the confidence layer** from the linked Intake Record ([`01-intake-record-concierge-settlement.md`](./01-intake-record-concierge-settlement.md)): what entered as an assumption, a Discovery unknown, or a delegated answer does not disappear in rationalization — it is resolved, or carried forward explicitly (see "Inherited Readiness"). The *projected* values (especially Success Metrics) carry confidence and become the baseline that [`../../../metrics.md`](../../../metrics.md) confronts with post-delivery actuals.
>
> **Journey:** [`00 Submitter Brief`](./00-submitter-brief-concierge-settlement.md) → [`01 Intake Record (PO — triage)`](./01-intake-record-concierge-settlement.md) → `02 Readiness Package (PO)` → [`03 Technical Assessment (CTO)`](./03-technical-assessment-concierge-settlement.md) → [`04 PRD (PO+CTO → PM)`](./04-prd-concierge-settlement.md).

## Metadata

| Field | Value |
|---|---|
| **Package ID** | RP-2026-050 |
| **Version** | v1 |
| **Linked Intake** | INT-2026-050 |
| **Owner** | Rafael Souza (PO) |
| **Escalation to CTO** | Yes — Technical Assessment TA-2026-050 |
| **Status** | Frozen (`freezeReady = true`) |
| **Freeze date** | 2026-04-25 |

## Revision History

| Version | Date | Author | Status | Summary |
|---|---|---|---|---|
| v1 | 2026-04-22 | Rafael Souza (PO) | Draft | Start of rationalization post-Discovery. |
| v1 | 2026-04-25 | Rafael Souza (PO) | Frozen | TA-2026-050 returned signed. RP frozen with `freezeReady = true`. |

---

## Inherited readiness and open dispositions

> Summary of what the Intake delivered and what remains *soft* at the start of execution. Assumptions, unknowns, and delegated answers that survived rationalization must be visible — not buried in the sections. See [`../../../personas/01-submitter.md` §6](../../../personas/01-submitter.md).

| Field | Value |
|---|---|
| **Readiness Score at Intake handoff** | 81 % (brief 00) |
| **Assumptions still to validate** | (1) Commission percentages per hotel: registered in spreadsheet; must be migrated to the Settlement Service database before go-live — FinOps action; (2) Withholding tax rule: configurable field per hotel — requires contract-by-contract review by FinOps before go-live |
| **Discovery unknowns** | All 3 resolved (see Discovery Log in the Intake Record) |
| **Delegated requirements (with owner)** | Migration of commission percentages to the system: Bruno Takeda (FinOps) — precondition for go-live |

> If an assumption carried here proves false during execution, the demand must be re-evaluated — the same re-triage trigger from intake applies downstream. In particular: if the migration to Stripe Connect reveals incompatibility with the per-hotel split model (old contracts with rules that Stripe does not support), the Settlement scope must be revisited with the CTO.

---

## Section 1 — Executive Summary  ·  *(blocks freeze)*

StayFlow operates today with two operational bottlenecks that grow linearly with booking volume: guest support is 100% human even for routine questions, generating queues, cost, and dissatisfaction; financial remittances to partner hotels are executed manually, with percentage errors that have already threatened two partnership contracts.

This RP defines **two capabilities that will be delivered together** under the name Concierge & Settlement:

1. **Concierge Service** — automated first-layer guest support (AI), with structured handoff to a human specialist when needed, real-time booking context, and support queues by category.
2. **Settlement Service** — split and financial remittance engine: automatic calculation (per-hotel percentage), execution via Stripe Connect, per-transaction idempotency, failure handling, reconciliation, and data export for accounting reconciliation.

The expected outcome: resolve the immediate partner termination risk with Gran Vista (correct and reliable remittance), reduce guest CSAT to ≥ 4.3/5, and create an operational foundation that supports growth without scaling support cost or the finance team proportionally.

The demand arrived as "chatbot + remittance automation" — two apparently simple requests. The passage through intake revealed two domains with business rules, edge cases, non-functional requirements, and integrations that, combined, represent medium-to-large effort. This RP documents the real size of what needs to be built for the solution to be reliable.

---

## Section 2 — Context and Problem (the pain, not the solution)  ·  *(blocks freeze)*

> **Golden rule:** problem before solution. If this section describes a solution instead of the problem, it is not satisfied — the same principle the Submitter applies to her Requirement 1.

### Current Scenario

StayFlow is an OTA/marketplace: the guest books and pays through the platform; StayFlow retains a commission and remits the balance to the hotel. There are two operational flows that are currently entirely manual:

**Support:** when a guest has a question or problem (booking status, check-in confirmation, cancellation policy, room issues), they open a ticket in the support channel. All tickets go to human agents, regardless of complexity. There is no triage, automatic categorization, or automated response.

**Remittance:** at the end of each period (bi-weekly or monthly, as per the hotel contract), the FinOps team exports the bookings for the period, consults the commission percentage spreadsheet per hotel, calculates the net amount, executes the wire transfer manually, and records the payment in another spreadsheet. Each hotel has its commission percentage and, in some cases, withholding tax.

### Limitations

- **No automatic support triage:** any question goes to a human agent. FAQ questions consume the same agent time as cancellations or financial disputes.
- **No handoff with context:** when a ticket is escalated from one channel to a human specialist, the guest starts from scratch — no conversation history, no booking data displayed to the agent.
- **No context persistence across channels:** if the guest tried to resolve by email before calling, the agent has no access to that history.
- **100% manual remittance calculation:** the split logic (percentage per hotel, withholding tax) is executed by humans in a spreadsheet each cycle. Any data entry error generates an incorrect remittance.
- **No idempotency:** if a remittance is initiated and fails, there is no guarantee that the retry will not generate a duplicate payment.
- **No automated reconciliation:** there is no automatic cross-check between the expected remittance amount (based on bookings for the period) and the amount actually sent.
- **No payment failure handling:** when a wire transfer fails, the retry process is manual and unstructured.

### Customer Pain

**Guest:** waits in a queue for up to 4h during demand peaks for information that is available in the system. When transferred to a specialist, they must repeat the entire incident history. Average CSAT of 3.8/5 reflects frustration with the process.

**Partner hotel:** receives remittances that, in 12% of cycles, have a different amount than expected (percentage or calculation error). Without a transparency portal or automatic reconciliation, the hotel only discovers the error when comparing with its own records. Two partners have already threatened termination; one chargeback was absorbed by StayFlow due to the absence of clear contractual coverage.

**Internal FinOps:** dedicates ~18 hours per week to mechanical tasks (export, calculate, execute wire transfer, record). With booking growth, this time will grow linearly — unless the process is automated.

### Business Impact

- Partner loss risk: estimated ~R$ 140k GMV/year if the two at-risk partners terminate.
- Growing support cost: R$ 28k+/month current; scales with booking volume.
- Exposure to contractual penalties: 2% penalty clause on incorrect remittance amount in at least one contract.
- Guest CSAT correlates with rebooking rate — satisfaction decline compromises organic growth.

---

## Section 3 — Objectives and Expected Outcome  ·  *(blocks freeze)*

Numbered objectives that this delivery must achieve. Each objective must be observable after the release.

1. **Relieve the support team** at the first layer: automatically resolve at least 55% of guest tickets without human intervention, reducing queues and cost.
2. **Improve guest CSAT** to ≥ 4.3/5 within 60 days post-release, through faster and more contextualized responses.
3. **Eliminate remittance percentage errors**: no remittance executed with a different percentage than contracted — correct remittance rate ≥ 99.5%.
4. **Eliminate the risk of duplicate remittance** via per-transaction idempotency: zero cases of duplicate remittance under normal operation.
5. **Reduce FinOps manual workload** in the remittance cycle to < 4 hours/week (from ~18 hrs current).
6. **Protect partner hotel trust**: no termination due to remittance errors in the 90 days post-release.
7. **Enable handoff with full context**: when a ticket is escalated from the Concierge to a specialist, the specialist must receive the complete conversation history and booking data without asking the guest.

---

## Section 4 — Impacted Personas / Jobs-to-be-done  ·  *(blocks freeze)*

| Persona | Job-to-be-done | Impact |
|---|---|---|
| **Guest** | Get a quick response to questions about their booking (status, check-in, cancellation, issues) without waiting in a queue. | Primary user of the Concierge. Expects the system to understand the context of *their* booking, not just answer generic FAQs. |
| **Specialist agent (CS)** | Focus on cases that genuinely need human judgment (disputes, complex cases, serious complaints) without losing time on routine questions; receive full context when the guest arrives escalated. | User of the queues + handoff system. Needs to see the prior conversation history and the guest's booking data when taking over the ticket. |
| **Partner hotel** | Receive the correct remittance amount, on time, with predictability — and be able to verify the calculation. | Final beneficiary of the Settlement Service. Does not interact directly with the platform (partner portal deferred), but feels it directly if the remittance is wrong or late. |
| **FinOps (StayFlow)** | Close each period's remittance cycle with confidence that all hotels were paid correctly, without spending hours on manual tasks. | Settlement Service operator. Needs visibility of executed remittances, status per hotel, and export for reconciliation. |
| **CS / Operations Manager** | Monitor Concierge performance (first-layer resolution rate, CSAT, escalation volume) and adjust escalation rules without involving engineering. | User of the Concierge management panel (escalation rule configuration and reports). |

---

## Section 5 — Included and Excluded Scope  ·  *(blocks freeze)*

> Protects the downstream from scope creep.

### Included

**Concierge Service:**
- First-layer LLM-powered chatbot, with StayFlow knowledge base (FAQs, cancellation policies, check-in instructions, booking status)
- Integration with internal bookings API (`/reservations/{id}/context`) to respond with real booking data for the guest
- Configurable escalation rules (by question type, by keywords, by number of unresolved attempts, by explicit guest request)
- Handoff to Zendesk: automatic ticket creation with full conversation history + booking data + inferred category
- Support queues by category (Financial, Stay (check-in/out), Room Issues, Cancellation, General) — specialist agents receive pre-triaged tickets
- CSAT collected at the end of each interaction (Concierge and specialist)
- Management panel: first-layer resolution rate, ticket volume by category, escalations by rule, CSAT by channel
- Escalation rule configuration via interface (without code deployment)

**Settlement Service:**
- Split engine: automatic calculation per booking based on the registered commission percentage per hotel
- Withholding tax field: configurable per hotel (yes/no + rate)
- Stripe Connect integration: creation of connected accounts per hotel, remittance execution, confirmation webhook
- Per-transaction idempotency: each remittance has a unique idempotency key — retries do not generate duplicates
- Payment failure handling: automatic retry (up to 3 attempts with exponential backoff), FinOps alert after persistent failure
- Transaction ledger: immutable record of each remittance (gross amount, commission retained, withholding tax retained, net amount, status, timestamp)
- Automatic reconciliation: cross-check between expected remittances (bookings closed in the period) and executed confirmed remittances, with divergence report
- Data export per hotel/period for accounting reconciliation (CSV/XLSX)
- FinOps panel: current period remittance status, hotels with failures, history per hotel

### Excluded

- Partner hotel portal (hotel self-service to view their remittances and issue invoices) — deferred to Phase 2
- Integration with hotel invoice issuance — deferred to Phase 2 (each hotel has its own fiscal system)
- Chatbot on additional channels (WhatsApp, mobile app) — Phase 1 focuses on web channel (widget on StayFlow platform)
- Replacement of Zendesk with another helpdesk system — out of scope
- Multi-currency — out of scope (100% BRL operation at the moment)
- Advanced BI reports (historical dashboards, trend analysis, benchmarking) — Phase 2
- Automatic remittance receipt sent by email to hotel — Phase 2 (simple to do, but deferred to avoid complicating the MVP)

### Deferred (future phases)

- Partner portal with remittance statements and self-service — Phase 2
- Integration with hotel invoice issuer (by tax ID/tax regime) — Phase 2
- Chatbot on WhatsApp and mobile app — Phase 2
- Advanced support and financial analytics — Phase 2
- Proactive notification to hotel about scheduled remittance — Phase 2

---

## Section 6 — Business Rules and Flows  ·  *(blocks freeze)*

### Block 1 — Concierge Service Rules

**BR-C01.** The Concierge responds to questions in these categories: booking status, cancellation policies, check-in/check-out, room issues, payment questions. Questions outside these categories are automatically escalated to the specialist.

**BR-C02.** For questions about a specific booking, the Concierge must identify the guest (via login or session token) and consume the context API before responding. Without context, the response cannot be personalized — the system must inform the guest and offer escalation.

**BR-C03.** Mandatory escalation when: (a) the guest explicitly requests to speak with a human; (b) the same intent is not resolved after 2 Concierge attempts; (c) the content contains urgency keywords (emergency, accident, room invaded, child, danger); (d) the inferred category is "financial dispute" or "cancellation with penalty."

**BR-C04.** On handoff to specialist: the Concierge closes the conversation on the bot channel and opens a ticket in Zendesk containing: (a) full conversation transcript with timestamps; (b) booking data via context API (guest_name, hotel_name, check_in, check_out, status, booking_id, room_type); (c) inferred category; (d) escalation reason; (e) guest identifier.

**BR-C05.** Zendesk queues by category: Financial, Stay (check-in/out), Room Issues, Cancellation, General. The category inferred by the Concierge determines the target queue. The CS manager can reconfigure the categorization rules via the management interface without code deployment.

**BR-C06.** CSAT is collected at the end of every interaction — both from the Concierge (bot) and from the specialist (Zendesk). The Concierge score is separate from the specialist score. Handoff interactions generate two separate CSAT records.

**BR-C07.** The Concierge has no authority to execute transactional actions (cancel booking, issue refund, change dates). For all such actions, it escalates to a specialist. The Concierge informs, explains, and guides — it never executes.

**BR-C08.** If the booking context API is unavailable (timeout > 2s or 5xx error), the Concierge responds with what it knows (without booking personalization) and informs the guest of the temporary limitation. It does not block the conversation.

### Block 2 — Settlement Service Rules

**BR-S01.** Each remittance is calculated per booking: `remittance_amount = total_booking_amount × (1 - hotel_commission_percentage) - withholding_tax (if applicable)`. The commission percentage is the one registered in the hotel's record at the time of calculation — it is not retroactive.

**BR-S02.** The remittance is executed only for bookings with status `check-out completed` and `guest payment confirmed`. Bookings cancelled with full refund do not generate a remittance. Cancellations with penalty generate a remittance proportional to the penalty charged.

**BR-S03.** Each remittance has an `idempotency_key` generated from `hotel_id + period + hash(bookings)`. The same key in repeated attempts guarantees exactly one executed remittance — Stripe Connect will reject the duplicate.

**BR-S04.** Remittance cycle: configurable per hotel (bi-weekly or monthly). The trigger can be automatic (cycle date) or manual (FinOps). Manual triggering always requires explicit operator confirmation before execution.

**BR-S05.** Remittance failure handling: automatic retry at 1h, 4h, and 24h (exponential backoff). After 3 failures, the remittance is marked as `persistent_failure` and FinOps receives an alert with failure details. The hotel is not automatically notified of the failure — this is done by FinOps after triage.

**BR-S06.** Withholding tax: if the hotel has the field `withholding_tax = true` + `tax_rate`, the withheld amount is calculated on the net remittance amount and registered in the ledger. FinOps is responsible for remitting the tax. The system calculates and records — it does not remit.

**BR-S07.** Automatic reconciliation: after each remittance cycle, the system compares the total expected remittances (sum of bookings closed in the period × percentage per hotel) with the total confirmed executed remittances. Any divergence > 0.01% of the total amount generates an automatic alert to FinOps.

**BR-S08.** Partial remittance: not permitted. If a booking has an open dispute (chargeback in progress), it does not enter the remittance cycle until the dispute is resolved. FinOps receives an alert about bookings blocked in the cycle.

**BR-S09.** If the registered commission percentage differs from the percentage in the hotel contract (detected by manual audit or hotel complaint), the remittance cannot be reprocessed retroactively automatically — requires FinOps approval with a recorded rationale. The system exposes the divergence, but does not auto-correct.

**BR-S10.** The ledger is immutable: no record can be edited or deleted after insertion. Corrections are made via adjustment entries with a reference to the original record.

### State Transition Flow — Concierge

```text
Guest initiates contact
    ↓
Concierge identifies guest (session token or login)
    ↓
Concierge queries context API (/reservations/{id}/context)
    ↓ (if available)
Concierge categorizes the question intent
    ↓
[Direct resolution]
  Concierge responds based on context + knowledge base
    ↓
  Guest satisfied? → CSAT collected → Conversation closed
    ↓ (if not resolved after 2 attempts or escalation rule)
[Escalation]
  Concierge opens ticket in Zendesk (transcript + context + category + reason)
    ↓
  Ticket routed to correct queue (by category)
    ↓
  Specialist takes over ticket with full context
    ↓
  Specialist resolves → CSAT collected → Ticket closed
```

### State Transition Flow — Settlement

```text
Remittance cycle trigger (automatic or manual)
    ↓
System fetches bookings with check-out in the period AND payment confirmed
    ↓
For each hotel: calculates remittance = bookings × (1 - commission) - withholding tax
    ↓
Generates idempotency_key per hotel + period
    ↓
Executes via Stripe Connect (hotel's connected account)
    ↓
[Success] → Confirmation webhook → Ledger updated → Status: remittance_confirmed
    ↓
[Failure] → Retry 1h / 4h / 24h
    ↓ (if 3 failures)
Status: persistent_failure → FinOps alert
    ↓
Reconciliation: total expected vs. total confirmed
    ↓ (if divergence > 0.01%)
Divergence alert → FinOps reviews
    ↓
Data export for the period per hotel (CSV/XLSX)
```

---

## Section 7 — User Stories + Acceptance Criteria  ·  *(blocks freeze)*

> One story per value block. Acceptance criterion **verifiable by a non-dev**, in Given/When/Then format, with specific limits.

### ST-001 — Contextualized Concierge response

**As** a guest with an active booking,  
**I want** to receive a response about my specific booking (status, check-in, etc.) without having to repeat my data,  
**so that** I can resolve my question without waiting in a human support queue.

**Acceptance Criteria:**
- [ ] **Given** an authenticated guest initiates a conversation in the Concierge, **when** they ask about their booking status, **then** the Concierge responds with the real booking data (hotel name, check-in/out date, status) fetched via the context API within 3 seconds.
- [ ] **Given** the Concierge receives a question about cancellation policy, **when** the guest's booking is more than 48 hours from check-in, **then** the Concierge informs the penalty-free cancellation policy and the steps to request it, without escalating to a human.
- [ ] **Given** the context API returns a 5xx error, **when** the guest asks about their booking, **then** the Concierge informs that it cannot access the data at the moment and offers escalation to a specialist or later contact — without freezing the conversation or displaying a technical error message.

### ST-002 — Escalation with context to specialist

**As** a CS specialist agent,  
**I want** to receive a Concierge ticket already with the conversation history and the guest's booking data,  
**so that** I can resume the case without asking the guest to repeat the history.

**Acceptance Criteria:**
- [ ] **Given** the Concierge escalates a ticket to Zendesk, **when** the agent opens the ticket, **then** they must see: (a) full conversation transcript with timestamps, (b) booking data (guest name, hotel, check-in/out, status, booking_id, room type), (c) category inferred by the Concierge, (d) escalation reason.
- [ ] **Given** the ticket is created with category "Financial", **when** it arrives in Zendesk, **then** it is automatically routed to the Financial queue — without manual operator action.
- [ ] **Given** the guest explicitly requested to speak with a human, **when** the ticket is created, **then** the `escalation_reason` field must record "guest_request" (not "unresolved").

### ST-003 — CSAT collection post-interaction

**As** a CS/Operations manager,  
**I want** CSAT to be collected at the end of each interaction (Concierge and specialist),  
**so that** I can monitor quality separately by channel and identify where the experience is failing.

**Acceptance Criteria:**
- [ ] **Given** a Concierge conversation is closed (resolved or escalated), **when** the closure occurs, **then** the guest receives a CSAT message with a 1-to-5 scale — and the score is available in the management panel within 5 minutes.
- [ ] **Given** a Zendesk ticket is closed by the specialist, **when** the status changes to "Resolved", **then** Zendesk triggers the specialist CSAT survey — score separate from the Concierge score for the same case.
- [ ] **Given** a guest does not respond to the CSAT survey within 24 hours, **then** the case is counted as "no response" — not as zero — in the management panel.

### ST-004 — Escalation rule configuration by manager

**As** a CS/Operations manager,  
**I want** to adjust the rules that define when the Concierge escalates to a specialist (keywords, number of attempts, categories),  
**so that** I can refine behavior without having to involve engineering for each adjustment.

**Acceptance Criteria:**
- [ ] **Given** the manager accesses the Concierge management panel, **when** they edit an escalation rule (e.g., adds an urgency keyword), **then** the rule takes effect in the next conversation — without needing code deployment.
- [ ] **Given** the manager defines that "category: financial dispute" always escalates immediately, **when** the Concierge categorizes a question as "financial dispute", **then** the escalation occurs without attempting to resolve at the first layer.
- [ ] **Given** an invalid configuration is submitted (e.g., number of attempts = 0), **when** the manager tries to save, **then** the system displays a validation message and does not save the invalid configuration.

### ST-005 — Automatic remittance calculation

**As** FinOps,  
**I want** the system to automatically calculate the remittance for each hotel based on bookings closed in the period and the contract commission percentage,  
**so that** I don't have to calculate manually and the risk of human error is eliminated.

**Acceptance Criteria:**
- [ ] **Given** the remittance cycle is triggered (automatic or manual), **when** the system processes the bookings for the period of a hotel, **then** the amount calculated per booking must be exactly `total_amount × (1 - commission_percentage) - withholding_tax` — verifiable via an exportable calculation report.
- [ ] **Given** a hotel's commission percentage is 15% and the booking was R$ 1,000.00, **when** the remittance is calculated (without withholding tax), **then** the remittance amount must be exactly R$ 850.00 — without incorrect rounding.
- [ ] **Given** a hotel has `withholding_tax = true` with a rate of 1.5%, **when** the remittance of R$ 850.00 is calculated, **then** the withheld tax must be R$ 12.75 and the net remittance R$ 837.25 — both recorded in the ledger with separate line items.

### ST-006 — Remittance idempotency

**As** FinOps,  
**I want** an executed remittance to never be duplicated, even in case of failure and retry,  
**so that** a hotel never receives the same remittance twice.

**Acceptance Criteria:**
- [ ] **Given** a remittance was successfully executed and confirmed by the Stripe webhook, **when** the same cycle is triggered again (by error or manual retry), **then** the system identifies the duplicate `idempotency_key` and returns the result of the original remittance — without executing a new payment.
- [ ] **Given** a remittance failed on the first attempt and the retry is triggered in 1h, **when** the retry uses the same `idempotency_key`, **then** Stripe Connect treats it as the same transaction — without duplicate payment, even if the first attempt was partially processed.
- [ ] **Given** two operators manually trigger the cycle for the same hotel in the same period simultaneously, **when** both requests arrive, **then** only one is processed — the second returns a conflict error with reference to the original remittance.

### ST-007 — Remittance failure handling

**As** FinOps,  
**I want** to be alerted when a remittance fails after all retries,  
**so that** I can intervene manually and resolve before the hotel is harmed.

**Acceptance Criteria:**
- [ ] **Given** a remittance fails on execution, **when** the failure occurs, **then** the system automatically schedules retries at 1h, 4h, and 24h — without manual intervention.
- [ ] **Given** all 3 automatic retries failed, **when** the third failure occurs, **then** FinOps receives an alert (email + panel notification) with: hotel, period, expected amount, failure reason, and link for manual action.
- [ ] **Given** a remittance is in status `persistent_failure`, **when** FinOps triggers the manual remittance from the panel with explicit confirmation, **then** a new attempt is executed with a new `idempotency_key` based on the timestamp of the manual action — recorded in the ledger as "manual_remittance" with the operator's identification.

### ST-008 — Automatic reconciliation

**As** FinOps,  
**I want** the system to automatically compare the total expected remittances with the total executed after each cycle,  
**so that** I can quickly identify any divergence without having to perform the check manually.

**Acceptance Criteria:**
- [ ] **Given** the remittance cycle is completed, **when** all remittances for the period have been processed (or marked as `persistent_failure`), **then** the system automatically generates the reconciliation report with: total expected per hotel, total executed per hotel, divergence in R$ and %, status per hotel.
- [ ] **Given** a hotel's divergence exceeds 0.01% of the expected amount, **when** the report is generated, **then** the system highlights the row and sends an alert to FinOps — regardless of the absolute amount.
- [ ] **Given** the reconciliation is 100% correct (no divergences), **when** the report is generated, **then** it displays "no divergences" clearly — and FinOps can export it as audit evidence.

### ST-009 — Data export per hotel

**As** FinOps,  
**I want** to export the remittance cycle data per hotel and per period in a structured format,  
**so that** I can provide the data to accounting and so the hotel can issue the corresponding invoices.

**Acceptance Criteria:**
- [ ] **Given** FinOps selects a hotel and a period in the panel, **when** they request the export, **then** the system generates a CSV/XLSX file with: booking_id, total_booking_amount, commission_percentage, commission_amount, withholding_tax, net_remittance_amount, remittance_date, remittance_status — one row per booking.
- [ ] **Given** the hotel has cancelled bookings with penalty in the period, **when** the data is exported, **then** cancelled bookings with penalty appear with the amount proportional to the penalty charged — distinct from bookings without penalty.
- [ ] **Given** an export is requested for a period with no executed remittances, **when** the system processes the request, **then** it returns an empty file with header (not an error) and displays the message "no remittances for the selected period."

---

## Section 8 — Non-Functional Requirements (NFRs)  ·  *(blocks freeze)*

> The #1 gap that causes rework. Fill in only the applicable dimensions. Here the PO describes the **quality requirement**; feasibility and *how* belong to the Technical Assessment.

| Dimension | Requirement | How it will be verified |
|---|---|---|
| **Performance / Efficiency** | Concierge response: first response in < 3s for questions without context API query; < 5s with API query. Individual remittance execution: < 10s per hotel per cycle (excluding Stripe response time). | Load tests with simulated ticket volume; latency measurement in staging environment. |
| **Reliability** | Concierge: availability ≥ 99.5% (excluding scheduled maintenance). Settlement Service: availability ≥ 99.9% on remittance cycle days. Concierge failure must not affect Settlement and vice versa. | Monitoring with downtime alerts; SLA measured monthly. |
| **Security** | Guest payment data is not stored by the Settlement Service — flows exclusively through Stripe (PCI DSS). Concierge logs must not store card numbers, passwords, or sensitive payment data. Access to the management panel and FinOps panel via SSO/MFA authentication. Immutable ledger — no UPDATE/DELETE on financial records. | Log audit; security code review; penetration testing on the payment flow before go-live. |
| **Idempotency** (product requirement) | Every Settlement Service transaction must be idempotent: the same operation executed N times produces exactly the same result as 1 time. This is a **product requirement**, not just technical — StayFlow contractually assumes it will not pay the same remittance twice. | Idempotency tests with duplicate keys in staging; partial failure simulation. |
| **Usability** | The CS manager must be able to configure a simple escalation rule without technical training (max. 10 minutes the first time). FinOps must be able to trigger a manual remittance cycle in up to 3 clicks in the panel. | Usability test with the CS manager and FinOps before release. |
| **Compatibility** | Concierge: widget functional in Chrome, Firefox, Safari (versions from the last 2 years), on desktop and mobile (responsive layout — no native app). | Cross-browser tests in QA environment. |
| **Maintainability** | Concierge escalation rules must be configurable via interface (without code deployment). Commission percentages per hotel must be editable by FinOps via admin panel (without directly modifying the database). Feature flags for gradual rollout of each service (Concierge and Settlement independent). | Configuration review in the management panel; flag verification at deployment. |
| **Auditability** | Every financial operation (calculation, execution, failure, retry, adjustment) must be recorded in the ledger with timestamp, operator (if human), and cross-references. Exportable for audit purposes. | Ledger review in staging environment after simulation of a full cycle. |

---

## Section 9 — Edge Cases and Failure Modes  ·  *(blocks freeze)*

> Error states, timeouts, permissions, concurrency. First class — not a footnote.

**Concierge:**

- **Unauthenticated guest tries to use the Concierge**: the Concierge responds only with a generic FAQ (without booking data). Displays a login invitation for a personalized response. Does not block the conversation.
- **Booking context API unavailable (timeout or 5xx)**: Concierge responds with what it knows (FAQ), informs of the limitation, offers escalation. Does not display a technical error message to the guest.
- **Question in a language other than the platform's default**: Concierge responds in the detected language (if the LLM supports it) or, if not supported, informs that support is in the platform language and offers escalation. Does not freeze.
- **Guest with multiple active bookings**: Concierge asks which booking the question refers to before consuming the context API. If the guest has only one booking, uses it automatically.
- **Guest sends inappropriate content, threats, or violent language**: Concierge immediately closes the conversation, records the event, and escalates to a specialist with a safety flag. The specialist decides whether to trigger the safety protocol.
- **LLM provider unavailable (AI model offline)**: the Concierge enters degraded mode — responds only with pre-defined answers for the top 10 most frequent questions and escalates everything else to a human. The manager receives a degradation alert.
- **Concierge ticket cannot open in Zendesk (Zendesk API failure)**: the conversation history is saved locally with status "pending Zendesk submission." Automatic retry in 15 minutes. FinOps/manager receives an alert. The guest is informed that they have been placed in the specialist queue.
- **Guest reopens conversation after Zendesk ticket created**: the Concierge recognizes that there is an open ticket for that guest and informs them that the specialist is handling the case, with the ticket number.

**Settlement:**

- **Remittance outside expected percentage (rule bug)**: if the calculated amount differs from the expected by more than 0.5% (configurable tolerance), the system blocks execution, records the anomaly in the ledger, and alerts FinOps for manual review before proceeding.
- **Hotel without banking data registered in Stripe Connect**: the remittance cycle for that hotel is marked as `blocked_no_account` and FinOps receives an alert. The remittance is not attempted. The bookings accumulate for the next cycle after resolution.
- **Guest chargeback after remittance executed to hotel**: the already executed remittance cannot be automatically reversed. The system records the chargeback linked to the booking and the corresponding remittance. FinOps decides whether to engage the hotel for partial return (process outside the system for now).
- **Booking with zero amount (complimentary or error)**: bookings with `total_amount = 0` are included in the cycle but the calculated remittance is R$ 0.00. Recorded in the ledger for reconciliation purposes. Does not generate a Stripe transaction.
- **Partial guest refund after remittance to hotel already executed**: the system records the partial refund linked to the booking. The remittance is not automatically reversed. FinOps receives an alert: "booking X had a partial refund after remittance executed — verify adjustment with the hotel."
- **Commission percentage not registered for a hotel**: the remittance cycle for that hotel is interrupted with status `percentage_missing`. FinOps receives an alert before execution (pre-cycle validation) — the cycle does not start if there are hotels without a registered percentage.
- **Cycle triggered on an unusual date (outside schedule)**: accepted if manually triggered by FinOps with explicit confirmation. Recorded as "manual cycle" in the ledger with operator identification.
- **Network failure during remittance execution (connection to Stripe interrupted)**: the system detects the timeout and waits for the confirmation webhook for up to 30 minutes. If the webhook does not arrive, it checks the transaction status via the Stripe API. If Stripe confirms the payment, records as success. If not, normal retry.
- **Hotel with multiple bookings in the same period, one with a pending chargeback**: bookings without chargebacks are remitted normally. The booking with a pending chargeback is blocked (BR-S08) and displayed in the reconciliation report with status `blocked_chargeback`.
- **Data export requested during cycle execution**: the system displays a notice that the cycle is in progress and the export will be from the data of the previous (complete) cycle. The current cycle export becomes available after completion.
- **Retroactive commission percentage adjustment**: if a hotel's percentage is corrected after an executed cycle, the system displays the impact of the difference (adjustment amount needed) but does not automatically recalculate the past remittance. FinOps must approve a manual adjustment entry, recorded in the ledger with reference to the original cycle.

**General:**

- **Deploy during active remittance cycle**: the Settlement Service must implement graceful shutdown — remittances in progress are completed before the service is stopped.
- **Primary database unavailable during cycle**: the cycle is paused and resumed when the database recovers. Idempotency guarantees that already executed remittances are not repeated.

---

## Section 10 — Success Metrics (primary · secondary · guardrail)  ·  *(blocks freeze)*

> **Projected** values — the baseline for post-rollout comparison. *Leading* and *lagging* indicators. At least one **guardrail** (metric that must not worsen).

| Type | Metric | Target (projected) | Measurement window | Measurement (who/how) | Confidence |
|---|---|---|---|---|---|
| **Primary** | First-layer resolution rate (Concierge without escalation) | ≥ 55% of conversations resolved by the bot | 30 days post-release | Concierge management panel — count of conversations closed without escalation / total conversations | 70 (market benchmark; StayFlow's real baseline is zero — starting from scratch) |
| **Primary** | Correct remittance rate | ≥ 99.5% of remittances executed with amount within 0.5% tolerance of expected | Per cycle | Settlement Service — automatic reconciliation report | 85 (rule well-defined; calculation bug risk is mitigable) |
| **Secondary** | Average guest CSAT (Concierge + specialist) | ≥ 4.3/5 | 60 days post-release (30-day moving average) | Management panel — CSAT collected at the end of each interaction | 65 (CSAT improvement is a consequence of bot quality — uncertainty about initial training) |
| **Secondary** | Average first response time (Concierge) | < 5s for 95% of conversations | 30 days post-release | Concierge logs — p95 response time | 80 |
| **Secondary** | FinOps hours/week in remittance cycle | < 4 hrs/week | 60 days post-release | Self-reported by FinOps + panel usage data | 60 (depends on adoption and absence of constant manual exceptions) |
| **Guardrail** | Overall support average CSAT must not fall | ≥ 3.8/5 (current baseline) during Concierge rollout | During rollout (first 30 days) | Management panel — overall CSAT | 90 |
| **Guardrail** | Zero duplicate remittances | 0 occurrences of duplicate payment to the same hotel | Throughout the Settlement Service's lifetime | Ledger — audit of duplicate `idempotency_key` with execution status different from "rejected" | 95 (idempotency is a firm technical requirement, not an estimate) |
| **Guardrail** | Settlement Service availability on cycle days | ≥ 99.9% on remittance cycle execution days | Per cycle | Infrastructure monitoring | 80 |

---

## Section 11 — Success and Acceptance Criteria (of the release)  ·  *(blocks freeze)*

High-level indicators that define "done and valuable" for **this release** — distinct from the continuous metrics in Section 10.

| Criterion | Type | Indicator | Target value |
|---|---|---|---|
| Concierge in production with first-layer resolution | Operational | Concierge resolution rate in operation (30 days post-release) | ≥ 55% without escalation |
| Automated remittance without percentage errors | Business / Financial | First automated remittance cycle executed with 100% accuracy | 0 divergences > 0.5% in the first cycle |
| Hotel Gran Vista retained | Business | No termination notice in the 90 days post-release of Settlement | Zero termination notices due to remittance error |
| Idempotency proven | Quality / Security | No duplicate remittance detected in the audit of the first 3 cycles | 0 duplicate payments |
| Handoff with context working | UX / Operational | Specialist agents confirm receiving history and booking data when taking over escalated tickets | ≥ 90% of escalated tickets with full context (verified by CS sampling) |
| FinOps using the panel | Adoption | FinOps team operates the remittance cycle through the panel, without manual spreadsheet | FinOps confirms abandoning the manual spreadsheet after 2 cycles |
| Migration to Stripe Connect without booking downtime | Technical | No failed booking ticket during the migration window | 0 bookings impacted by the migration |

---

## Section 12 — Risks and Dependencies (product and business)  ·  *(blocks freeze)*

> **Technical** risks migrate to the CTO's Technical Assessment. Here stay the product, business, adoption, external, and compliance risks.

| Risk | Type | Probability | Impact | Mitigation |
|---|---|---|---|---|
| Hotel Gran Vista terminates before Settlement go-live | External / Business | Medium | High | CS proactively communicates the project schedule to Gran Vista. If the informal 60-day deadline is not achievable with the CTO's firm effort, business decision: communicate to the partner or prioritize a minimum Settlement MVP first. |
| First-layer chatbot worsens CSAT in the initial phase (inadequate responses) | Product | Medium | High | Gradual rollout: start with 20% of support traffic for 2 weeks, monitor CSAT, only expand if guardrail is being respected. Explicit guardrail: if CSAT falls below 3.8, shut down the Concierge and return to 100% human support. |
| Withholding tax rule configured incorrectly per hotel | Compliance | Low | High | FinOps will review the withholding tax field for each hotel before the first automated remittance cycle. Requires explicit human action (not configured automatically). |
| Commission percentages in contracts differ from the spreadsheet record | Business | Medium | High | FinOps (Bruno Takeda) is responsible for validating and migrating the percentages from the spreadsheet to the system before go-live. Precondition listed in inherited readiness. |
| Specialist agents ignore the Concierge handoff and ask the guest to repeat the history | Adoption | Medium | Medium | CS team training before go-live. The Zendesk interface must display the context prominently (not in a secondary tab). Monitor via CSAT of escalated tickets vs. direct tickets. |
| Fiscal regulation on remittances changes (withholding tax, ISS, others) | Compliance | Low | Medium | Withholding tax engine configurable per hotel and rate. Regulatory changes may require configuration updates (without code). Monitor Legal publications. |
| Support ticket volume grows beyond expected, overloading specialists | Product | Low | Medium | If the Concierge does not resolve 55% at the first layer, the volume of escalated tickets may overload the team. Plan: expand the Concierge knowledge base in the first 4 weeks post-release based on unresolved questions. |
| FinOps panel adoption slow (team continues using spreadsheet in parallel) | Adoption | Medium | Medium | Training before go-live. Establish a "spreadsheet deactivation date" with FinOps (e.g., after 2 cycles with the panel). CS/Ops monitor adoption. |

**Dependencies (product/business):**
- Bruno Takeda (FinOps) must migrate commission percentages to the system before Settlement go-live — this is a blocking precondition.
- Each partner hotel must have a Stripe Connect account created before the first automated remittance cycle — joint responsibility of FinOps + CTO (account creation automation is in scope for the Settlement Service).
- The CS team needs training on the handoff flow before Concierge go-live.

---

## Section 13 — Preliminary Effort and Cost Assessment

> Internal use only. **Preliminary** — the PO's guess to support sequencing. The **firm** number comes from the CTO in the Technical Assessment. Not a contractual commitment or client-facing material.

| Area | Preliminary estimate | Confidence |
|---|---|---|
| Backend — Concierge Service (AI orchestration, Zendesk integration, escalation rules) | ~15 days | low_confidence |
| Backend — Settlement Service (split engine, idempotency, ledger, Stripe Connect) | ~20 days | low_confidence |
| Backend — PSP migration (Pagar.me → Stripe Connect, hotel data migration) | ~8 days | low_confidence |
| Frontend — Concierge widget (web channel, responsive) | ~8 days | low_confidence |
| Frontend — Management panel (rules, reports, CSAT) | ~6 days | low_confidence |
| Frontend — FinOps panel (cycle, reconciliation, export) | ~5 days | low_confidence |
| QA (functional + security + idempotency + load) | ~8 days | low_confidence |
| **Preliminary total** | **~70 days** | low_confidence |

**Cost signals to confirm by CTO:** new infrastructure for Concierge Service (AI orchestration, likely LLM API cost per token); Stripe Connect account (fee per remittance ~0.5%); possible additional database provisioning cost for immutable ledger; expanded observability cost (two new services).

---

## Section 14 — Suggested Roadmap

### MVP (this release — Concierge & Settlement v1)

- **Concierge Service:** first-layer chatbot (web channel), integration with bookings API, configurable escalation rules, handoff to Zendesk with context, CSAT, basic management panel.
- **Settlement Service:** automatic split engine per hotel, Stripe Connect, idempotency, failure handling (retry + alert), automatic reconciliation, data export, basic FinOps panel.
- **Migration:** Pagar.me → Stripe Connect for the remittance flow.

### Phase 2 (future backlog)

- Partner hotel portal: remittance statements, history, receipt download.
- Proactive hotel notification: remittance confirmation email with details.
- Integration with hotel invoice issuance (by tax ID and tax regime — high complexity, prioritize based on partner demand).
- Concierge on additional channels: WhatsApp Business API.
- Advanced support analytics: resolution time by category, historical volume, CSAT trend.

### Phase 3 (future backlog)

- Integrated BI for remittances and support for leadership.
- More sophisticated commission rules engine (variable commission by seasonality, by booking volume, etc.).
- Accounting reconciliation automation with StayFlow ERP integration.

---

## Technical Assessment Reference  ·  *(blocks freeze if requested)*

> This is the **bridge** (`TechAssessmentRef`), not content. The RP references the CTO's verdict — it does not absorb it. The merger happens in the [PRD](./04-prd-concierge-settlement.md). See [`personas/02-po.md` §5 and §10](../../../personas/02-po.md).

| Field | Value |
|---|---|
| **Status** | **Signed** |
| **Feasibility verdict** | **Feasible with caveats** (PSP migration on critical path; migration timeline impacts schedule; see TA-2026-050 for detail) |
| **Linked Technical Assessment** | [TA-2026-050 v1](./03-technical-assessment-concierge-settlement.md) |
| **Hard constraints affecting scope** | (1) Settlement Service requires migration to Stripe Connect before go-live — without the correct PSP, the service cannot operate; (2) Financial ledger must be immutable by design — no UPDATE/DELETE on records; (3) Guest card data cannot be stored outside of Stripe; (4) Concierge and Settlement must be independent services with isolated failure; (5) The PSP migration must be executed with zero downtime on active bookings |

> **Freeze gate:** all `blocks freeze` sections resolved ✓ and `TechAssessmentRef.status = Signed` ✓ → `freezeReady = true` on 2026-04-25.
