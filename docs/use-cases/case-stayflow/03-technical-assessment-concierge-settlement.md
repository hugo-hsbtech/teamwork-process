# Technical Assessment — Concierge & Settlement

> The Technical Assessment (TA) is the **CTO's output** — feasibility, constraints, architecture, integrations, technical risks, ADRs, and firm cost. It is written **alone** by the CTO, **in parallel** with the Readiness Package, and **responds** to it: the CTO **never edits the RP**. The TA does not redefine the product — it can **veto** the scope's feasibility, and in that case the PO revises the RP scope.
>
> The merger of the RP (product) with this TA (technical) happens in the [PRD](./04-prd-concierge-settlement.md), and it is the PRD that opens the downstream. See [`personas/02-po.md` §2 and §10](../../../personas/02-po.md) and [`interactions/05-po-to-cto.md`](../../../interactions/05-po-to-cto.md).
>
> **Journey:** [`00 Submitter Brief`](./00-submitter-brief-concierge-settlement.md) → [`01 Intake Record (PO — triage)`](./01-intake-record-concierge-settlement.md) → [`02 Readiness Package (PO)`](./02-readiness-package-concierge-settlement.md) → `03 Technical Assessment (CTO)` → [`04 PRD (PO+CTO → PM)`](./04-prd-concierge-settlement.md).

## Metadata

| Field | Value |
|---|---|
| **Assessment ID** | TA-2026-050 |
| **Version** | v1 |
| **Linked RP** | RP-2026-050 v1 |
| **Linked Intake** | INT-2026-050 |
| **Owner** | Davi Lima (CTO) |
| **Status** | **Signed** |
| **Feasibility verdict** | **Feasible with caveats** |
| **Sign-off date** | 2026-04-25 |

## Revision History

| Version | Date | Author | Status | Summary |
|---|---|---|---|---|
| v1 | 2026-04-22 | Davi Lima (CTO) | In progress | Started in parallel with the RP, post-Discovery. |
| v1 | 2026-04-25 | Davi Lima (CTO) | Signed | Assessment finalized. Main caveat: PSP migration on critical path. |

---

## Feasibility Verdict

> The CTO's first-class decision. Carries rationale — never a rubber stamp.

| Field | Value |
|---|---|
| **Verdict** | **Feasible with caveats** |
| **Rationale** | Both domains (Concierge and Settlement) are technically feasible within the scope defined in the RP. The architecture is well-established — AI orchestration with handoff and payment split with ledger are known patterns. The main caveat is **operational and schedule-related**: the migration from Pagar.me to Stripe Connect is a non-negotiable precondition of the Settlement Service, and this migration involves creating connected accounts for all partner hotels, end-to-end integration tests, and a cutover window with zero downtime on active bookings. This migration **is the item with the highest schedule risk** — it may be the bottleneck that determines the Settlement go-live date. The Concierge Service has no dependency on the PSP and can be delivered independently. |
| **Caveats** | (1) PSP migration (Pagar.me → Stripe Connect) is a Settlement precondition — without it the service cannot go to production. The migration requires coordination with partner hotels for Stripe account creation; (2) The LLM provider must be selected and contracted before Concierge development; (3) The financial ledger must be implemented with immutability guarantees from the start — it is not something that can be added later without data migration; (4) PCI DSS scope: the solution must be designed so that card data never touches StayFlow's systems — exclusively via Stripe. |

---

## PO Questions Addressed

> *Trace-to-source.* The specific technical unknowns the PO escalated — and the answer to each.

| # | PO question | CTO answer |
|---|---|---|
| 1 | Does Pagar.me (current PSP) support payment split adequately for StayFlow's model? | Not adequately. Pagar.me has "Split Rules" but without an idempotency key per remittance (duplicity risk on retries) and without confirmation webhook per beneficiary. I recommend migration to **Stripe Connect** — native split, idempotency key per transaction, webhooks per connected account, PCI Level 1 absorbed by Stripe. Adyen Marketplace was also evaluated — Stripe Connect is the choice for superior documentation and ecosystem in Brazil. |
| 2 | Does the internal bookings API have context endpoints consumable by the Concierge Service? | Yes. The endpoint `/reservations/{id}/context` exists, returns the necessary data (confirmed in the Discovery spike), latency ~140ms p95. No changes needed to the bookings API. Will be consumed by the Concierge Service via HTTP with JWT authentication. |
| 3 | Which LLM provider to use for the Concierge? What are the vendor lock-in risks? | I recommend **OpenAI GPT-4o-mini** as the primary provider, with fallback to **Anthropic Claude Haiku** for resilience. The architecture must use an abstraction layer (LLM interface) to avoid coupling the code to the provider — allows switching without refactoring. The cost per token (GPT-4o-mini) for the estimated ticket volume is ~R$ 1,200/month. |
| 4 | How to ensure the Concierge and Settlement do not affect each other in case of failure? | The two services must be deployed and scaled **independently**. Each service has its own database, its own monitoring service, and its own alerts. The Concierge consumes the bookings API and Zendesk; the Settlement consumes Stripe. There is no direct synchronous call between Concierge and Settlement. Failure of one does not propagate to the other. |
| 5 | How to guarantee financial ledger immutability? Is this a design constraint or can it be added later? | It is a **design constraint** — it cannot be added later without migration. The ledger must be an append-only table from creation: no UPDATE, no DELETE, with database triggers that prevent modification of existing records. Adjustments are made via debit/credit entries with reference to the original record. This is what makes the ledger auditable and reliable as financial evidence. |
| 6 | PCI DSS: what is StayFlow's compliance scope with the proposed solution? | With Stripe absorbing card processing (SAQ A), StayFlow's PCI scope is minimal: StayFlow does not store, process, or transmit card data — it only receives payment confirmations via signed webhook. The guest billing flow uses Stripe Elements (frontend) or Stripe Checkout — the card number never touches StayFlow's servers. This design is non-negotiable: any deviation expands the PCI scope to SAQ D or QSA audit, which is prohibitive for the company's current size. |

---

## Systems and Components Affected

| System / Component | Nature of impact |
|---|---|
| **PSP / Payment Gateway (Pagar.me)** | Replaced by Stripe Connect for the hotel remittance flow. Pagar.me may remain for guest billing in Phase 1 (billing and remittance are different flows). Decision: migrate guest billing to Stripe in Phase 2 to unify the PSP. |
| **Stripe Connect** | New — payment split and remittance platform. Requires creation of connected accounts per partner hotel. Integration via REST API with official SDK. |
| **Internal Bookings API** | Only consumed — no modifications. Existing endpoint `/reservations/{id}/context`. |
| **Zendesk** | Integrated by the Concierge Service for ticket creation with context. Zendesk public API (ticket creation, custom fields, routing rules). No change to existing Zendesk — only new fields and routing rules by category. |
| **Concierge Service** | New service — AI support orchestrator. Components: LLM engine (OpenAI + fallback), knowledge base (RAG), escalation rules engine, bookings API integration, Zendesk integration. |
| **Settlement Service** | New service — split and remittance engine. Components: remittance calculator, idempotency engine, financial ledger, Stripe Connect integrator, reconciliation engine, FinOps panel. |
| **Database — Ledger** | New dedicated database (PostgreSQL) for the financial ledger — append-only table, with immutability triggers. Separate from the main database to isolate financial data. |
| **Database — Escalation Rules** | Extension of the existing database or Concierge Service database — stores configurable escalation rules. |
| **LLM Infrastructure** | New — OpenAI API key (primary provider) and Anthropic (fallback). Recurring cost per token. |
| **Management Panel (Concierge)** | New web interface: CSAT visualization, resolution rate, ticket volume, escalation rule configuration. |
| **FinOps Panel (Settlement)** | New web interface: remittance cycle status, reconciliation, history per hotel, data export. |

---

## Architectural Impact

> Exclusive CTO territory.

| Area | Impact | Architectural note |
|---|---|---|
| **Data model** | Two additional databases: (1) Ledger (PostgreSQL append-only, immutable); (2) Concierge DB (escalation rules, conversation history, CSAT). Main database is not altered. | The financial ledger **never** shares a database with other domains — isolated by design to guarantee integrity and facilitate auditing. |
| **Events / messaging** | Settlement Service: remittance cycle events published to a queue (e.g., SQS or equivalent) to decouple the trigger from the processing. Enables retries and asynchronous processing without blocking the caller. Concierge Service: conversations can be processed as a stream (SSE or WebSocket) to improve LLM response UX. | Avoid blocking synchronous calls in the remittance flow — the cycle can process N hotels in parallel via asynchronous workers. |
| **Frontend** | Concierge widget: embeddable React component on the StayFlow platform (not a separate page). Must work on mobile via responsive CSS. Management Panel and FinOps Panel: SPAs with SSO authentication. | The Concierge widget must be loaded lazily (must not block the booking page loading). |
| **Security** | Minimal PCI DSS scope (SAQ A) via Stripe Elements — card data never touches StayFlow's servers. Stripe webhooks must be validated via HMAC signature. FinOps Panel access restricted by role (FinOps + Admin only). Ledger: only INSERT permitted on the transactions table (database triggers). | The Stripe webhook signature is validated on each receipt — without this, an attacker can inject fake payment confirmation webhooks. |
| **Multi-tenancy** | No impact on the existing multi-tenancy model. Hotels are entities in the StayFlow domain — they are not tenants of the platform. The Settlement Service operates on the existing hotel/contract data model. | — |
| **Performance / Scalability** | Concierge Service: sized for current support volume (estimate: 500–800 conversations/day). Can scale horizontally. Settlement Service: remittance processing is batch (cycle per hotel) — does not require high scale, but must complete the cycle for all hotels in < 30 min. | The Settlement Service must implement rate limiting on Stripe API calls (API limit: 100 req/s per account). With N hotels in parallel, ensure the rate limit is not exceeded. |
| **Observability** | Two new services require: distributed traces (OpenTelemetry), structured logs, business metrics (Concierge resolution rate, correct remittance rate, latency per step). Specific alerts: LLM provider unavailable, remittance failure, reconciliation divergence. | Use the existing observability stack (if available). If not, provision Datadog or Grafana Cloud — cost to include in TCO. |

---

## Required Integrations

> Through the lens of technical feasibility.

| System | Type | Protocol | Feasibility / Known risks |
|---|---|---|---|
| **Stripe Connect** | External / PSP | REST (official SDK) + Webhooks (HTTPS) | Feasible. Excellent documentation. Risk: creating connected accounts for all hotels requires email and tax data from each partner — coordination with FinOps and communication with hotels required. Cost: ~0.5% additional per remittance + transfer fee (~R$ 0.70/transfer). |
| **OpenAI API (GPT-4o-mini)** | External / LLM | REST (HTTPS) | Feasible. Estimated cost: ~R$ 1,200/month for the projected support volume. Risk: variable provider latency (p99 may be > 5s at peak). Fallback to Anthropic Claude Haiku mitigates single-provider dependency. |
| **Anthropic Claude Haiku (fallback)** | External / LLM | REST (HTTPS) | Feasible — fallback only. Activated if OpenAI returns 5xx error or timeout > 5s. |
| **Zendesk API** | External / Helpdesk | REST (HTTPS) | Feasible. Well-documented public API. Risk: Zendesk rate limits may be reached if escalation volume is high at launch. Monitor and implement circuit breaker. |
| **Internal Bookings API** | Internal | REST (HTTPS, JWT) | Feasible — confirmed in Discovery. No changes to the API. Risk: if the bookings API suffers downtime, the Concierge operates in degraded mode (see edge case in RP). |
| **Banking Gateway (PIX/wire transfer)** | Via Stripe Connect | Stripe API | Hotel remittances are executed via Stripe Connect — Stripe handles the banking integration (PIX or wire transfer). StayFlow has no direct banking integration for the remittance. No direct banking integration risk for StayFlow. |

---

## Hard Constraints

> Non-negotiable conditions that limit the solution space. The PO does not soften or reinterpret these.

| Constraint | Type | Detail | Effect on scope |
|---|---|---|---|
| **Migration to Stripe Connect is a Settlement precondition** | Technical / External | Pagar.me does not offer the necessary guarantees (idempotency, webhooks per beneficiary). The Settlement Service cannot go to production with the current Pagar.me. | PSP migration enters the scope and schedule. Settlement go-live cannot occur before the migration is complete and tested. |
| **Immutable ledger by design from the start** | Technical | Append-only table with database triggers. It is not possible to "add immutability later" without data migration and risk of history corruption. | Settlement Service database design must include this from Sprint 1. It is not optional. |
| **PCI DSS — card data never touches StayFlow's servers** | Security / Legal | StayFlow must use Stripe Elements/Checkout to keep the PCI scope minimal (SAQ A). Any integration that makes the guest's card number travel through StayFlow's servers dramatically expands the PCI scope. | The payment frontend design must use Stripe Elements or Stripe Checkout — no custom payment form that directly captures the card number. |
| **Concierge and Settlement are independent services** | Technical / Product | No direct synchronous calls between the two services. Failure of one does not propagate to the other. Independent deployment. | Each service has its own repository (or module), database, and deployment pipeline. Cannot be a joint monolith. |
| **Stripe webhooks validated via HMAC signing secret** | Security | Without HMAC signature validation on webhook receipt, an attacker can inject fake payment confirmation webhooks — the system would mark remittances as executed without them having occurred. | Webhook receiver implementation is one of the first pieces to be developed and reviewed in a security code review. |

---

## Technical Risks and Mitigations

> **Technical** risks live here. Product/business risks remain in the RP, Section 12.

| Risk | Category | Probability | Impact | Mitigation |
|---|---|---|---|---|
| **Zero-downtime PSP migration fails in production** | Integration / Infra | Medium | High | Dual-write migration strategy: Pagar.me and Stripe coexist for 1 sprint, with all new remittances on Stripe. Rollback available. Mandatory end-to-end tests in staging with real test data for each hotel before production migration. |
| **Stripe connected account creation for hotels fails due to incomplete data** | Integration / Data | Medium | High | FinOps must collect and validate hotel data (tax ID, banking data, email) before migration. Hotel onboarding process in Stripe Connect must be automated in the FinOps panel — not manual. Hotels with uncreated accounts are blocked for remittance (see edge case in RP). |
| **LLM provider latency exceeds 5s at peak (Concierge experience degradation)** | Infra / External | Medium | Medium | Fallback to Anthropic Claude Haiku with 5s timeout. Response streaming (SSE) to reduce latency perception: text starts appearing before it is complete. Latency monitoring p95/p99 per provider — alert if p99 > 7s. |
| **Split calculation inconsistency (rounding or rule bug)** | Data / Financial | Low | High | Exhaustive unit tests on the calculation engine with extreme cases (fractional percentages, withholding tax, bookings with partial cancellation). Double validation: the system calculates AND FinOps manually validates the first cycle before removing the manual check. |
| **Stripe API rate limit reached on large cycles** | Infra / Integration | Low | Medium | Implement remittance processing queue with limited worker pool (e.g., max 50 req/s). Monitor Stripe API rate limit headers and implement backoff when approaching the limit. |
| **Silent Stripe webhook failure (webhook delivered but not processed)** | Integration | Low | High | Idempotency on webhook receipt: processing the same event twice must be safe. Stripe API status polling as fallback if webhook not received in X minutes. Dead-letter queue for webhook events that failed processing. |
| **Concierge knowledge base outdated (incorrect response about a changed policy)** | Product / AI | Medium | Medium | Knowledge base update process must be operationally simple (management panel). Alerts when guests report incorrect response (dissatisfaction flag + escalation). Bi-weekly knowledge base review by CS managers. |
| **Sensitive booking data exposed in Concierge logs** | Security | Low | High | Log sanitization: SSN, email, card number, and sensitive personal data must be masked before logging. Mandatory security review on the logging module before go-live. |
| **Inconsistency between withheld tax calculated and actual fiscal rule** | Compliance | Low | Medium | The withholding tax rule in the system is manually configured by FinOps. The system calculates and records — FinOps is responsible for the accuracy of the registered rate. Legal reviews the rates before go-live. |

---

## Architecture Decisions (ADRs)

> Architectural direction at the CTO level. Fine-grained breakdown and implementation ADRs belong to the Tech Lead's Tech Backlog (TB).

| # | Decision | Rationale | CTO sign-off |
|---|---|---|---|
| **ADR-001** | **Stripe Connect as remittance PSP (replacing Pagar.me)** | Stripe Connect is the only evaluated option that offers: native split per connected account, idempotency key per transaction, confirmation webhooks per beneficiary, and PCI DSS Level 1 absorbed. Adyen Marketplace was considered but discarded due to inferior documentation for the Brazilian market and a slower onboarding process. Pagar.me remains for guest billing (Phase 1) — unification deferred to Phase 2. | ✓ |
| **ADR-002** | **Financial ledger: append-only table with database triggers (PostgreSQL)** | The remittance ledger is auditable financial data — it cannot have records edited or deleted after insertion. Immutability via database trigger (instead of just code convention) is more robust: it prevents an application bug or operational accident from corrupting the history. Adjustments are modeled as debit/credit entries with reference to the original (double-entry accounting pattern). | ✓ |
| **ADR-003** | **Abstract LLM provider with interface layer (OpenAI + Anthropic fallback)** | Direct coupling to the LLM provider creates vendor lock-in and risk of total Concierge downtime if the provider has an incident. The abstraction layer (interface `LLMClient`) enables: (a) automatic fallback between providers, (b) provider switching without refactoring the Concierge Service, (c) LLM mocking in tests. GPT-4o-mini is the primary provider for cost-effectiveness; Claude Haiku as fallback for similar latency and independent provider. | ✓ |
| **ADR-004** | **Concierge and Settlement as independent services (not a monolith)** | The two domains have completely different load patterns, SLAs, and dependencies. The Concierge is synchronous and user-facing (latency matters); the Settlement is asynchronous and batch (throughput matters). Combining them in a monolith creates deployment, scalability, and failure coupling that has no technical justification. Each service has its own database, deployment, and alerts. | ✓ |
| **ADR-005** | **Message queue for asynchronous processing of the remittance cycle (SQS or equivalent)** | The remittance cycle processes N hotels — if processed synchronously in a single HTTP request, request timeout would become a problem (and any failure would restart everything). With the queue, each hotel is an independent message: parallel processing, per-message retries, dead-letter queue for persistent failures. The remittance cycle becomes resilient by design. | ✓ |
| **ADR-006** | **RAG (Retrieval-Augmented Generation) for the Concierge knowledge base** | Instead of including the entire knowledge base in the prompt (expensive and with context limit), the Concierge uses RAG: the guest's question is used to retrieve the relevant documents from the base, which are included in the prompt along with the question. This reduces cost per token, allows a large knowledge base, and facilitates updates without retraining. The embeddings vector is stored in pgvector (PostgreSQL extension) to avoid an additional service. | ✓ |

---

## Effort and Cost Assessment (firm)

> Internal use only. These are the CTO's **firm** estimates — they replace the PO's preliminary estimate (RP Section 13). Will be refined by the Tech Lead in the Tech Backlog. Not a contractual commitment or client-facing material.

### Development Effort

| Area | Estimate | Seniority |
|---|---|---|
| Backend — Concierge Service (LLM, RAG, escalation rules, bookings API, Zendesk) | 18 days | Senior |
| Backend — Settlement Service (split engine, ledger, idempotency, Stripe Connect, cycle, reconciliation) | 22 days | Senior |
| Backend — PSP Migration (Pagar.me → Stripe, hotel onboarding, end-to-end tests) | 10 days | Senior |
| Frontend — Concierge Widget (web channel, responsive, SSE streaming) | 8 days | Mid-Senior |
| Frontend — Management Panel (Concierge: rules, CSAT, reports) | 6 days | Mid |
| Frontend — FinOps Panel (cycle, reconciliation, export, alerts) | 6 days | Mid |
| QA — Concierge (functional, AI edge cases, data security, load) | 6 days | QA |
| QA — Settlement (idempotency, split calculation, financial edge cases, load, HMAC security) | 8 days | QA |
| DevOps / Infra — provisioning of new services, ledger DB, queues, observability | 5 days | DevOps |
| **Total** | **89 days** | |

> **Note on total:** the estimate of ~89 days considers team parallelism (Senior backend can work on both services in parallel if there are two engineers). With a team of 2 Seniors + 1 Mid-Senior + 1 Mid + 1 QA + 1 DevOps, the actual schedule is **~10 development weeks** (not 89 sequential days). The PO's estimate of ~70 days was underestimated by ~27%, mainly due to the PSP migration and the financial idempotency tests.

### Infrastructure Impact

- Two new backend services (Concierge Service + Settlement Service) — requires provisioning of containers/instances, separate database for ledger, message queue (SQS or equivalent).
- pgvector for Concierge RAG — PostgreSQL extension on existing database or separate database.
- Stripe Connect — platform account setup and connected account creation.
- Expanded observability for two new services: traces, logs, business metrics, alerts.

### Third-Party Cost Impact

| Item | Monthly estimate |
|---|---|
| OpenAI API (GPT-4o-mini, ~500K tokens/day for the projected support volume) | ~R$ 1,200/month |
| Anthropic Claude Haiku (fallback — low usage) | ~R$ 150/month |
| Stripe Connect (platform fee: ~0.5% per remittance + ~R$ 0.70 per transfer) | Variable — depends on remittance volume. With R$ 200k GMV/month and 30 hotels: ~R$ 1,000 + R$ 21 = ~R$ 1,021/month |
| Observability (Datadog or Grafana Cloud — if no existing stack) | R$ 800–2,000/month depending on log volume |

### Recurring Operational Cost Impact

- LLM cost: grows with support volume — monitor and optimize prompts to reduce tokens.
- Stripe cost: grows with GMV — it is a justified business cost (eliminates the risk of manual errors and the cost of 18 hrs/week for FinOps).
- Ledger storage grows linearly with booking volume — very low cost (~R$ 0.10/GB/month on RDS).

### TCO Assessment

The implementation creates **two new recurring costs** (LLM and Stripe fee) and eliminates the cost of scaling human support and the risk of contractual penalties. ROI is positive if:
- The Concierge resolves ≥ 55% of tickets without human → deferral of 2 hires (~R$ 19k/month) for at least 6 months.
- The Settlement eliminates remittance errors → avoiding contractual penalties and partner terminations.

The foundation created (Concierge Service with RAG and Settlement Service with ledger + Stripe Connect) is **reusable for future phases**: the partner portal (Phase 2) consumes the same Settlement Service; the Concierge can expand to WhatsApp with minimal changes to the channel layer.

---

## Discovery Path (if technical unknown blocks)

> All technical unknowns were resolved in Discovery (2026-04-09 to 2026-04-22, recorded in the Intake Record). No residual technical unknown blocks the assessment. The TA can be signed.
>
> Residual low-risk unknown: creation of connected accounts for hotels with incomplete data. Mitigated via operational process (FinOps collects data before migration) — does not require a new technical Discovery cycle.
