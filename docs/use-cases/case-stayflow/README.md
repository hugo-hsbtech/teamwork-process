# Case: StayFlow — Concierge & Settlement

## Scenario

**StayFlow** is a B2B2C lodging platform that operates as an OTA (Online Travel Agency) / booking marketplace. The guest searches, compares, and books directly through StayFlow; StayFlow charges the guest, **retains a commission (split)**, and **remits the remainder to the partner hotel**. The network already has dozens of partner hotels and grows in booking volume month over month.

The business model has three parties with distinct interests:
- **Guests**: want to book easily, pay securely, and be served quickly when something goes wrong.
- **Partner hotels**: want to receive the correct remittance, on time, with predictability — and they trust StayFlow to honor the financial contract.
- **StayFlow**: needs to scale service without scaling cost, maintain hotel trust, and guarantee the financial integrity of remittances.

---

## The demand

**Originated by:** Camila Rocha, CS/Operations Lead  
**Capture date:** 2026-04-07  
**How it arrived:** Q2 planning meeting — Camila presented two operational pain points which, in her framing, came packaged as a solution: *"We need a chatbot to handle first-contact guest support and, when necessary, transfer to a human specialist; and we need to automate payment remittances to hotels."*

The real pain behind it:

| Pain | Manifestation | Impact |
|---|---|---|
| **Expensive, slow first-layer support** | 100% of support interactions are handled by human agents, even those resolved with basic information (booking status, check-in confirmation, cancellation policy). | CSAT below target (3.8/5), operational cost rising with volume growth, first-response SLA missed on 34% of tickets. |
| **Manual remittance with financial and operational risk** | Hotel remittances are calculated manually in a spreadsheet, with field-by-field verification of the commission percentage per hotel. Manual wire transfers. No automatic reconciliation. | 3 incorrect-amount remittance incidents in the last 6 months. Two hotels threatened to terminate their contract. 1 chargeback with no hotel coverage. Finance team spends ~18 hrs/week on this operation. |

---

## Why this demand looks small — and isn't

The original framing ("a chatbot + automate the remittance") suggests two small projects, each with limited scope. The passage through intake revealed the true size:

**On the support side:**
- "A chatbot" implies: defining the AI layer (LLM, knowledge base, fallback), escalation-to-human rules (when to transfer? with what context? to which queue?), support queues, SLAs by ticket type, context management across layers, CSAT per channel.
- Integration with the booking system is required so that support is contextualized (the guest wants to know the status of *their* booking, not a generic FAQ).

**On the remittance side:**
- "Automate the remittance" implies: split model per hotel (different percentages per partner), guest billing (PSP/gateway), commission retention, hotel remittance (banking or PIX integration), idempotency (the remittance cannot happen twice), accounting reconciliation, payment failure handling, chargeback handling, partial refund, transaction ledger.
- An incorrect remittance percentage has direct financial and legal impact — it is not just an operational bug.

**The architectural escalation was inevitable:** payment split, idempotency, reconciliation, PCI DSS, PSP/gateway integration, financial ledger — all of this required CTO evaluation before the scope could be frozen.

---

## Documents in this case

| Artifact | ID | File | Owner | Status |
|---|---|---|---|---|
| Submitter Brief | — | [`00-submitter-brief-concierge-settlement.md`](./00-submitter-brief-concierge-settlement.md) | Camila Rocha (CS/Ops) | `gateReady = true` |
| Intake Record | INT-2026-050 | [`01-intake-record-concierge-settlement.md`](./01-intake-record-concierge-settlement.md) | Rafael Souza (PO) | Triaged — Discovery |
| Readiness Package | RP-2026-050 | [`02-readiness-package-concierge-settlement.md`](./02-readiness-package-concierge-settlement.md) | Rafael Souza (PO) | `freezeReady = true` |
| Technical Assessment | TA-2026-050 | [`03-technical-assessment-concierge-settlement.md`](./03-technical-assessment-concierge-settlement.md) | Davi Lima (CTO) | Signed |
| PRD | PRD-2026-050 | [`04-prd-concierge-settlement.md`](./04-prd-concierge-settlement.md) | Rafael Souza (PO) + Davi Lima (CTO) | Delivered to PM |

---

## Process state

```text
[INT-2026-050] Concierge & Settlement — "small demand that exploded"

  Capture (Camila, 2026-04-07)
    → Handoff to PO (2026-04-08)
    → Triage (Rafael, 2026-04-09): Discovery requested
        Unknown 1: split capability of the current PSP (Stripe Connect vs. alternative)
        Unknown 2: accounting reconciliation model / fiscal requirements for the remittance
        Unknown 3: feasibility of booking system integration for context in support
    → Discovery (2026-04-09 → 2026-04-18, 7 business days)
        Result: current PSP does not support native split → migration or multi-PSP required
        Result: Accounting requires an invoice for the remittance per hotel → fiscal scope added
        Result: Booking system API has a context endpoint available → feasible
    → Decision revised: Product Ready (2026-04-18)
    → Escalation to CTO (2026-04-18): architectural escalation confirmed
    → RP rationalizing in parallel with TA (2026-04-18 → 2026-04-25)
    → TA signed (Davi, 2026-04-25): Feasible with caveats (PSP migration on critical path)
    → RP Frozen with TechAssessmentRef = Signed (2026-04-25)
    → PRD merge (2026-04-26)
    → Delivered to PM (2026-04-28)
```

---

## Condensed journey of Discovery unknowns

| Unknown | Resolved by | Result | Scope impact |
|---|---|---|---|
| Split capability of current PSP | Technical spike — CTO + Finance | Current PSP (basic Stripe) does not support native split; migration to Stripe Connect or Adyen Marketplace required | Added to scope: PSP migration as a precondition of the Settlement Service |
| Reconciliation model and fiscal requirements | Meeting with Accounting + Legal | Remittance to a partner hotel requires issuance of a service invoice (or fiscal receipt, depending on the hotel's tax regime); reconciliation must generate a report per hotel per period | Added to scope: reconciliation module with per-hotel export; invoice deferred to Phase 2 (complex fiscal integration) |
| Feasibility of booking system integration | API review (CTO) | Endpoint `/reservations/{id}/context` available on the internal API — booking, guest, and status data returned in < 200ms | Added to scope: Concierge Service consumes the context API to personalize AI responses |

---

## What the "small demand" produced — pedagogical summary

This demand arrived with **2 requests** and generated:

| Dimension | Quantity |
|---|---|
| Formal artifacts produced | **5** (00 → 04) |
| Discovery unknowns investigated | **3** |
| Product domains covered in the RP | **2** (Concierge + Settlement) |
| User Stories in the RP | **12** |
| Explicit edge cases in the RP | **18** |
| Business rules documented | **21** |
| Product/business risks in the RP | **8** |
| Technical risks in the TA | **9** |
| Architectural ADRs in the TA | **6** |
| External integrations identified in the TA | **4** (PSP, banking gateway, LLM provider, booking API) |
| Hard constraints (PCI DSS, idempotency, financial consistency) | **5** |
| Total effort estimate (firm, from CTO) | **~67 engineering days** |
| Submitter's preliminary estimate | *"I have no idea — maybe 2 weeks?"* |

> **The pedagogical point:** the Submitter's original framing underestimated the scope by ~700%. The intake did not create complexity — it revealed it. Without the triage, Discovery, and TA layer, engineering would have started building "a little chatbot and a spreadsheet automation" and found, halfway through the sprint, PCI DSS, payment split, idempotency, reconciliation failures, and missing PSP support.
