# Submitter Brief — Concierge & Settlement

> **This is the Submitter Brief** — the first artifact in the journey (`00`) and the deliverable of the Submitter persona. It **instantiates** the model from [`personas/01-submitter.md`](../../../personas/01-submitter.md): the reasoning (compliance requirements, ToDo generation, score formula) lives in the persona; this document **instantiates** it per demand, in the **Submitter's language** — problem, value, pain, opportunity. Each answer carries how solid it is and where it came from: the confidence layer travels *with* the capture.
>
> **Journey:** `00 Submitter Brief` → [`01 Intake Record (PO — triage)`](./01-intake-record-concierge-settlement.md) → [`02 Readiness Package (PO)`](./02-readiness-package-concierge-settlement.md) → [`03 Technical Assessment (CTO)`](./03-technical-assessment-concierge-settlement.md) → [`04 PRD (PO+CTO → PM)`](./04-prd-concierge-settlement.md). See [`README.md`](./README.md).
>
> **Nothing precedes this document as an artifact.** What comes before is **raw signal** — a call, a ticket, an email, an audio, a deal conversation — which **is not an artifact** (see [`../../../README.md`](../../../README.md)). That signal enters *here* as evidence/source (disposition `inferred`, with `source`); it is the **capture** that transforms it into this first formal document.
>
> **Handoff:** freezes when `gateReady = true` (every blocking requirement resolved by an honest disposition) and is delivered to the **PO**, who formalizes and triages it in the [`01 Intake Record`](./01-intake-record-concierge-settlement.md).

## The two lenses (every demand is read through both simultaneously)

> See [`personas/01-submitter.md` §2](../../../personas/01-submitter.md). ToDos live where the lenses intersect: "given what *this* demand means, what does the contract still need?"

| Lens | What it is | Where it appears in this document |
|---|---|---|
| **Contract** (deterministic) | The fixed compliance requirements every demand must satisfy to advance | **Readiness Summary** + the numbered requirements (score + open items) |
| **Semantics** (contextual) | What *this* demand means: the real pain, its type, its value thesis, its unknowns | **Problem Statement**, **Impact**, **Value Indicators** and their tensions |

## Metadata

| Field | Value |
|---|---|
| **Demand** | Concierge & Settlement — Automated guest support + financial remittance to the partner hotel |
| **Recorded by** | Camila Rocha (CS/Operations Lead) |
| **Capture date** | 2026-04-07 |
| **Status** | Ready for handoff (`gateReady = true`) |
| **Linked Intake Record** | INT-2026-050 (assigned by the PO at triage) |

## Revision History

| Version | Date | Event | Summary |
|---|---|---|---|
| v1 | 2026-04-07 | Capture initiated | Camila records the demand after the Q2 operational planning meeting. |
| v1 | 2026-04-07 | `gateReady = true` | All blocking requirements resolved. Handoff to PO. |

---

## Readiness Summary

> Snapshot of the capture. The score is derived from the requirements below; `low_confidence` counts as partial. The demand is only delivered to the PO when all blocking requirements are resolved (`gateReady = Yes`).

| Field | Value |
|---|---|
| **Readiness Score** | 81 % |
| **Gate cleared (gateReady)** | Yes |
| **Pending blocking requirements** | — (all resolved by honest disposition) |
| **Dispositions** | 5 answered · 2 inferred · 3 assumptions · 1 discovery · 0 delegated |

### Confidence legend (applies to each answered section)

| Attribute | Values |
|---|---|
| **Confidence** | 0–100 |
| **Source** | Direct Submitter · Attached document (p.X) · Inferred · Assumption · Other stakeholder |
| **Status** | Empty · Low confidence · Resolved |
| **Disposition** | Answered · Inferred · Assumption (to validate) · Discovery (to investigate) · Delegated (owner: __) |
| **Hint** | Why confidence is low / what would raise it |

> **"I don't know" does not block.** A requirement reaches readiness through any honest disposition — including "nobody knows yet, and this is the plan" (Discovery) or "we are assuming X" (Assumption). See [`personas/01-submitter.md` §6](../../../personas/01-submitter.md).

---

## Origin  ·  *(Requirement 2 — Originator and context)*

| Field | Value |
|---|---|
| **Source** | Internal — CS/Operations team |
| **Client / Requester** | Camila Rocha, CS/Operations Lead |
| **Originator and context** | Camila raised both pain points at the Q2 operational planning meeting (2026-04-07), after the CS team identified accelerating CSAT deterioration and three incorrect remittance incidents in the last 90 days. The meeting included the Operations Director and the CFO. |
| **Reported via** | In-person meeting + slide deck of operational indicators shared on Notion |

`Confidence:` 92 · `Source:` Direct Submitter · `Status:` Resolved · `Disposition:` Answered · `Hint:` —

---

## Type

- [ ] Feature
- [ ] Bug
- [x] Improvement
- [ ] Compliance
- [x] Integration
- [x] Operational

---

## Problem Statement  ·  *(Requirement 1 — blocks gate)*

> What is the existing pain? Describe the problem, not the solution. If the statement contains a proposed solution, it is returned for reformulation.

**Problem A — Guest support:**
First-layer guest support is 100% human. With the growth in booking volume, the support team has not kept pace with growth: the first-response SLA is missed on 34% of tickets, the support queue reaches 4h+ at peak times, and average CSAT dropped to 3.8/5 (target: 4.5). The most frequent questions (booking status, check-in confirmation, cancellation policy) could be resolved without human intervention, but today consume the same agent time as complex cases. When a guest needs a specialist, there is no context-transfer mechanism — the guest repeats the entire problem from scratch to the new agent.

**Problem B — Financial remittance to the partner hotel:**
The calculation and execution of remittances to partner hotels is done manually: the finance team consults the contracts spreadsheet (commission percentages per hotel), calculates the net amount, issues the wire transfer, and records it in a second spreadsheet. Without automation or cross-validation, percentage errors occur. In the last 6 months: 3 remittances with incorrect amounts, 2 partner hotels threatening to terminate their contract, 1 chargeback that StayFlow absorbed due to the absence of clear contractual coverage. The finance team dedicates ~18 hrs/week to this operation — time that grows linearly with booking volume.

`Confidence:` 88 · `Source:` Direct Submitter + indicators slide (Notion, meeting 2026-04-07) · `Status:` Resolved · `Disposition:` Answered · `Hint:` CSAT and SLA data are in the Zendesk dashboard (export available). Remittance incidents are in the financial log — access can be provided to the PO.

---

## Who Is Impacted (Reach)  ·  *(Requirement 3 — blocks gate)*

> Personas, segments, or teams that feel this pain. This is the "Reach" of the value indicators.

| Persona / Segment | How they are impacted |
|---|---|
| **Guest** | Waits more than 4h for a response at peak; repeats context when switching agents; low CSAT reflects frustration. The entire platform guest base is affected. |
| **Partner hotel** | Receives remittances with incorrect amounts or outside the agreed timeline; lack of financial predictability; two partners at risk of contract termination. Affects the entire hotel network (dozens of active partners). |
| **Support team (CS)** | Overloaded with tickets that could be resolved automatically; no triage tool or structured handoff; handles simple cases alongside complex ones without differentiation. |
| **Finance team (FinOps)** | Spends ~18 hrs/week on repetitive manual tasks; exposed to human error in each remittance cycle; no automatic audit of amounts. |
| **StayFlow (business)** | Risk of partner hotel churn (revenue and network); unsustainable growth in support operational cost; reputational and legal risk from remittance errors. |

`Confidence:` 85 · `Source:` Direct Submitter + inferred from indicators slide · `Status:` Resolved · `Disposition:` Answered · `Hint:` Exact count of active guests and partner hotels was not shared in this brief — PO can request from FinOps to quantify Reach precisely.

---

## Business Impact  ·  *(Requirement 4 — blocks gate)*

> Use the applicable dimensions. Revenue, Retention, Operational, Competitive, Compliance, Market are the most common. Do not force irrelevant dimensions. Quantify when possible.

| Dimension | Detail |
|---|---|
| **Retention** | Two partner hotels at risk of termination. If both leave, estimated loss of ~R$ 140k in GMV/year (assumption: average of ~R$ 70k GMV per hotel × 2). Additionally, guest CSAT below 4 correlates with lower booking recurrence — diffuse but real impact. |
| **Operational** | Support team cost: ~R$ 28k/month (3 agents × salary + employer charges). With expected volume growth, without automation the team will need 2 additional hires in the next 6 months (~R$ 19k/month additional). Finance team cost: ~18 hrs/week × hourly cost → saveable with automation. |
| **Compliance / Legal** | Remittance errors create exposure to contractual penalties. One hotel contract already has a penalty clause of 2% of the remittance amount per error. With growing volumes, exposure grows proportionally. |
| **Competitive** | Competing OTAs offer partner portals with automated reconciliation. StayFlow is at a disadvantage in attracting new partner hotels by not having this functionality. |

`Confidence:` 72 · `Source:` Inferred from operational data in the slide + Camila's own estimates · `Status:` Low confidence (numbers are estimates, not calculated) · `Disposition:` Inferred · `Hint:` To raise: request from FinOps the GMV per hotel over the last 12 months; request from HR the actual support team cost; review hotel contracts to identify penalty clauses. Numbers will be refined in the RP.

---

## Value Indicators (RICE-lite)

> A mirror to challenge thinking — **not** an automatic ranking. Score each (Low / Medium / High). Confidence reuses the column above — not re-scored. Effort stays *soft* (Submitter's guess, firmed up later by the CTO).

| Indicator | Score | Rationale (in her words) | Confidence |
|---|---|---|---|
| **Impact** ("how much does it move the business?") | High | Two partners at risk of termination. If we lose them, it's not just money — it's a signal to the market that StayFlow doesn't honor remittances. The reputational risk worries me more than the financial one. On the support side, with CSAT falling, the guest rebooking rate goes with it. | 70 |
| **Reach** ("how many people feel this?") | High | Every guest who opens a ticket feels the support problem. Every partner hotel that receives a remittance feels the financial problem. This isn't a niche — it's the core of the model. | 85 |
| **Urgency** ("why now? cost of waiting?") | High | One of the partner hotels has an informal 60-day deadline to see improvement before triggering the termination clause. On the support side, booking volume grows month over month — every week that passes without automation is one more manual ticket. | 80 |
| **Effort** *(soft — deferred to CTO)* | Medium | I think the chatbot itself isn't that complicated — there are ready-made platforms. The remittance seems more labor-intensive because of the per-hotel percentage rules. But honestly I have no idea what's technically involved. | low_confidence |

> **Tensions recorded:**
> - High impact + confidence 70: the partner termination risk is real, but the exact value (GMV that would be lost) is estimated. Resolution: accept as assumption; PO quantifies in the RP with FinOps data.
> - High urgency + uncertain effort: if effort is very high (CTO confirms), the partner's 60-day deadline may not be achievable. Resolution: this tension needs to be made explicit to the PO — if the firm effort > 60 days, there is a business decision about communicating to the partner.

---

## Urgency  ·  *(Requirement 5)*

**Deadline / window:** One of the partner hotels (Hotel Gran Vista, largest partner by GMV) informally communicated that they have 60 days to see progress before evaluating termination. Informal deadline: by 2026-06-07.

**Cost of waiting:** Every week without support automation = more manual tickets, more cost, more poor CSAT. Every remittance cycle without automation = more financial error risk. If Gran Vista terminates, it is the largest partner — a strong negative signal for new hotels joining the network.

`Confidence:` 75 · `Source:` Direct Submitter (verbal information from Gran Vista on a relationship call) · `Status:` Low confidence (informal deadline, not documented) · `Disposition:` Answered · `Hint:` Gran Vista's deadline was communicated verbally — worth formalizing by email to have a record. CS can do this. If the deadline is shorter than 60 days, the priority rises even more.

---

## Evidence and Documents  ·  *(Requirement 6)*

> Attachments or prior conversations that support the demand. Source for AI pre-filling.

| Document / Conversation | Type | Relevance |
|---|---|---|
| Q1-2026 operational indicators slide | Presentation (Notion) | Contains CSAT data (3.8/5), first-response SLA (missed on 34%), ticket volume by category |
| Remittance incident log (last 6 months) | Internal financial spreadsheet | Records the 3 incorrect remittance incidents: date, hotel, wrong amount, correct amount, difference |
| Hotel complaint emails | Email thread | Hotel Gran Vista and Hotel Pousada Serrana sent formal complaint emails about remittances |
| Support team cost report (Q1) | HR spreadsheet | Monthly cost of the 3-agent team + employer charges |
| Partner hotel contracts (sample) | PDF (restricted access — FinOps) | Details commission percentages and penalty clauses for remittance errors |

`Confidence:` 82 · `Source:` Direct Submitter · `Status:` Resolved · `Disposition:` Answered · `Hint:` Hotel contracts are with FinOps — PO should request access to review the penalty clauses before finalizing the RP.

---

## Stakeholders  ·  *(Requirement 8)*

| Stakeholder | Role | Interest | Influence |
|---|---|---|---|
| Camila Rocha | CS/Operations Lead — Submitter | Resolve the operational bottleneck in support and reduce remittance risk exposure | High — originator, has access to data and hotel relationships |
| Rafael Souza | PO | Define the product correctly before building | High — owner of triage and rationalization |
| Davi Lima | CTO | Technical feasibility, especially payment split and PSP integration | High — decides architecture and gateway integration |
| Bruno Takeda | FinOps | Financial remittance integrity; audit; reduction of manual workload | High — critical consultant for split rules and reconciliation |
| Hotel Gran Vista | Partner hotel (largest, at risk) | Receive correct remittance on time | High — external stakeholder with termination power |
| Isabela Ramos | Legal/Accounting | Fiscal compliance of remittances; withholding tax if applicable | Medium — consultant; does not block construction but defines fiscal constraints |
| Operations Director | Executive sponsor | Scale operations without scaling cost; protect partners | High — approves budget and priority |
| CFO | Financial sponsor | Control remittance risk; finance team cost | High — present at Q2 meeting; has visibility into the risk |

`Confidence:` 88 · `Source:` Direct Submitter + inferred from Q2 meeting · `Status:` Resolved · `Disposition:` Answered · `Hint:` —

---

## Assumptions

Conditions assumed to be true at capture. If an assumption proves false, the demand must be re-triaged. Assumptions are a **valid disposition** for requirements without a direct answer.

1. StayFlow's commission percentage is defined in the contract with each hotel (not a fixed percentage for all) and is registered in some system or spreadsheet that can be consulted programmatically. — `to validate with:` FinOps (Bruno Takeda)
2. The current payment gateway (used to charge guests) has an API for creating and querying transactions, and payment data is accessible for integration. — `to validate with:` CTO (Davi Lima) in Discovery
3. The support team currently uses some helpdesk tool (e.g., Zendesk) that can be integrated to receive transfers from the chatbot with context. — `to validate with:` Camila / CS team
4. The booking platform has an API that exposes booking data (status, guest, check-in/out) so that contextualized support is possible. — `to validate with:` CTO in Discovery

---

## Constraints  ·  *(Requirement 7)*

Conditions that limit the solution space, to be respected regardless of what is built.

| Constraint | Type | Detail |
|---|---|---|
| Informal Gran Vista partner deadline | Time | ~60 days to see progress (until ~2026-06-07). Not contractual, but a risk signal. |
| PCI DSS compliance | Legal / Technical | The payment flow (guest billing, hotel remittance) touches card data — any solution must be PCI-compliant or use a PSP that absorbs the PCI scope. |
| Partner hotel contracts with individual percentages | Scope | Each hotel has its commission percentage defined in the contract. The solution must support distinct percentages per hotel (cannot be a fixed global value). |
| Must not interrupt the existing booking flow | Technical / Scope | Remittance automation cannot impact the booking creation and confirmation flow. Gateway changes must be non-disruptive. |

`Confidence:` 78 · `Source:` Direct Submitter + inferred from regulatory context · `Status:` Low confidence (PCI is PO's assumption, not technically confirmed) · `Disposition:` Assumption (to validate) · `Hint:` The PCI constraint needs to be confirmed by the CTO — if the current PSP already absorbs the PCI scope, the technical constraint may be smaller. If not, it is a severe restriction.

---

## Preliminary Risks

Risks identified at capture — before technical assessment. Full record belongs to the Readiness Package.

| Risk | Category | Initial Assessment |
|---|---|---|
| Current PSP does not support native payment split | Technical | High — if confirmed, requires PSP migration or additional architecture. Technical Discovery needed. |
| Incorrect remittance percentage persists even after automation (rule bug) | Business | High — the risk that automation aims to resolve can be reintroduced by a bug. Rigorous testing and validation required. |
| Hotel Gran Vista terminates before delivery | External / Timeline | Medium — 60-day deadline may not be sufficient if technical effort is large. Proactive communication to the partner required. |
| Fiscal requirements (withholding tax, invoice) not mapped | Compliance | Medium — without understanding the fiscal requirements of the remittance, automation may create a fiscal problem. Discovery with Legal required. |
| Chatbot with inadequate response quality in the initial phase | Product | Medium — LLM may respond inadequately or imprecisely, worsening CSAT instead of improving it. Training and quality guardrails are critical. |
| Support team resistant to flow change | Adoption | Low — process change for specialist agents; training required. |

---

## High-Level Scope Boundary

**In scope:**
- Automated first-layer support (AI) for frequent guest questions
- Handoff mechanism to human specialist with conversation context
- Automatic remittance calculation to the hotel (with per-hotel percentage)
- Remittance execution via gateway/PSP integration
- Basic reconciliation: record of executed remittances and status

**Out of scope:**
- Partner hotel portal (hotel self-service to view their remittances)
- Chatbot for multiple simultaneous channels (focus on primary channel — to be defined)
- Fiscal integration for invoice issuance on remittances
- Multi-currency support

**Deferred:**
- Partner portal with remittance history and statements
- Integration with hotel accounting system
- BI and analytics for support and financials

---

## Priority

**Level:** High

**Reason:** Partner termination risk with 60-day deadline; falling CSAT with volume growth; legal and financial exposure from remittance errors. The combination of both problems creates urgency.

---

## Success Criteria

High-level indicators that define "done and valuable." Detailed measurable targets belong to the Readiness Package; these are the signals at the capture level. **They serve as the projected baseline** for post-handoff tracking (see [`metrics.md`](../../../metrics.md)).

| Criterion | Type | Indicator | Projected value |
|---|---|---|---|
| Guest CSAT improves | UX | Average CSAT in support interactions | ≥ 4.3/5 (from current 3.8) |
| First-response SLA normalized | Operational | % of tickets with first response within SLA | ≥ 90% (from ~66% current) |
| First-layer resolution rate (without human) | Operational | % of tickets resolved by chatbot without escalation | ≥ 55% |
| Correct remittances | Business / Financial | % of remittances executed with correct amount | ≥ 99.5% |
| Gran Vista and partners retained | Business | No termination for financial reasons in the 90 days post-release | Zero terminations due to remittance error |
| Reduction of manual FinOps workload | Operational | Hours/week dedicated to the manual remittance cycle | < 4 hrs/week (from ~18 hrs current) |
