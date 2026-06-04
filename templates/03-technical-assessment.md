# Technical Assessment — [Demand Name]

> The Technical Assessment (TA) is the **CTO's output** — and goes **beyond architecture**: it establishes the **technical terrain** on which engineering decides. Because the execution layer (human or AI agent) **has no implicit knowledge of the source code**, the TA must make explicit what normally goes unstated: the nature of the demand (new vs. existing software), the current state or the foundation to be created, the knowledge base, the feasibility of each NFR, the discarded alternatives, testability, and observability — not just the architectural impact. It is written **alone** by the CTO, **in parallel** with the Readiness Package, and **responds** to it: the CTO **never edits the RP**. The TA does not redefine the product — it may **veto** the feasibility of the scope, in which case the PO revises the RP scope.
>
> **Two paths, one template.** The *Technical classification* section below determines which path to fill in: **Greenfield** (new software/module → the TA *defines* the foundation: stack, ADRs, structure) or **Brownfield/Hybrid** (modifies existing software → the TA *discovers and documents* the current system). Fill in the applicable path; skip the other. The contract is a ceiling, not a floor. Inspired by the BMAD Method's greenfield/brownfield tracks, the arc42 lenses (context, *solution strategy*, *quality scenarios*), and engineering design docs (alternatives considered, *goals/non-goals*).
>
> The merge of the RP (product) with this TA (technical) happens in the [PRD](./04-prd.md), and it is the PRD that opens the downstream. See [`personas/02-po.md` §2 and §10](../personas/02-po.md) and [`interactions/05-po-to-cto.md`](../interactions/05-po-to-cto.md).
>
> **When there is NO TA:** if the demand has no architectural impact (no escalation), there is no Technical Assessment — the PRD is formed from the RP alone, and the reference in the RP stays `Status: Not requested`.

## Metadata

| Field | Value |
|---|---|
| **Assessment ID** | TA-YYYY-NNN |
| **Version** | v1 |
| **Linked RP** | RP-YYYY-NNN vX |
| **Linked Intake** | INT-YYYY-NNN |
| **Owner** | [Name] (CTO) |
| **Status** | Requested / In progress / Signed off / Vetoed |
| **Feasibility verdict** | Feasible / Feasible with caveats / Infeasible as scoped |
| **Sign-off date** | — |

## Revision History

| Version | Date | Author | Status | Summary |
|---|---|---|---|---|
| v1 | YYYY-MM-DD | [Name] (CTO) | In progress | Initial assessment. |

---

## Feasibility Verdict

> The CTO's first-class decision. Carries rationale — never a rubber stamp.

| Field | Value |
|---|---|
| **Verdict** | Feasible / Feasible with caveats / Infeasible as scoped |
| **Rationale** | [Why — defensible] |
| **Caveats (if applicable)** | [What must be true for the verdict to hold] |

> If **Infeasible as scoped**: the CTO returns with a veto + rationale; the PO revises the RP scope and re-escalates. The CTO does not redefine the product. See [`interactions/06-cto-to-po.md`](../interactions/06-cto-to-po.md).

---

## Technical classification and Knowledge Base

> **The decision that governs the rest of the document.** Inherits the demand nature from the [Intake](./01-intake-record.md) and confirms it under the technical lens. Defines which path to fill in (greenfield vs. brownfield) and anchors the TA in the knowledge base — what exists, what is missing, what will be created.

| Field | Value |
|---|---|
| **Nature (confirmed by CTO)** | Greenfield (new) · Brownfield (existing) · Hybrid (new within existing) |
| **Path to fill in** | Technical foundation (greenfield) · Current state (brownfield) · Both (hybrid) |
| **Knowledge Base (KB)** | Exists → reference · Partial → reference + gaps · Does not exist → create (Discovery) |
| **KB reference** | [`tech-landscape-[system].md`](./tech-landscape.md) · link · — |

> **If the KB does not exist or is incomplete (brownfield):** documenting the current system is a **prerequisite** of the assessment — register as a spike in the *Discovery Path* (end of document) and produce/update the [`tech-landscape`](./tech-landscape.md). Feasibility cannot be assessed on unknown terrain.
> **If greenfield:** the foundational ADRs (below) **seed** a new [`tech-landscape`](./tech-landscape.md) — the assessment is the origin of the KB, not a consumer of it.

---

## PO Questions Addressed

> *Trace-to-source.* The specific technical unknowns the PO escalated — and the answer to each. Keeps the assessment anchored to what was asked.

| # | PO question | CTO answer |
|---|---|---|
| 1 | [Technical unknown] | [Answer] |

---

## BROWNFIELD Path — Current state / Technical landscape  ·  *(fill in if the demand modifies existing software)*

> **Document the system before changing it.** In brownfield, the implementation decision depends on what already exists — patterns, conventions, integrations, debt. This section is the equivalent of BMAD's *document-project*: it makes the terrain explicit for those unfamiliar with the code. When an up-to-date [`tech-landscape`](./tech-landscape.md) exists, **reference it** and record here only what is specific to this demand. Skip entirely if greenfield.

### Existing patterns and conventions to respect

| Aspect | How it is today | Implication for this demand |
|---|---|---|
| **Code structure / organization** | [Where things live] | [What to follow] |
| **Data / persistence patterns** | [Model, migrations] | |
| **API / contract patterns** | [REST/events, versioning] | |
| **Authentication / authorization** | [How it is applied] | |

### Integration points touched

| Integration point | System/module | Coupling nature | Risk of changing |
|---|---|---|---|
| [Interface/service] | [Who] | [Synchronous / event / shared DB] | High / Medium / Low |

### Technical debt and regression risk

| Area | Known debt / fragility | Regression risk | Current test coverage |
|---|---|---|---|
| [Module] | [What is fragile] | High / Medium / Low | [Good / partial / none] |

---

## GREENFIELD Path — Technical foundation  ·  *(fill in if the demand builds new software/module)*

> **Decide the foundation — with criteria, not by reflex.** In greenfield there is no terrain to discover: the TA **creates** it. Record the base choices and the *why*, so they sustain ADRs and become the starting point of the new [`tech-landscape`](./tech-landscape.md). Skip entirely if pure brownfield.

### Stack selection (with criteria)

| Layer | Choice | Decision criterion | Discarded alternative |
|---|---|---|---|
| **Language / runtime** | [Choice] | [Why — team, ecosystem, performance] | [What and why not] |
| **Framework / app** | | | |
| **Persistence / data** | | | |
| **Infra / deploy** | | | |

### Target architecture

> Context and container diagram (C4 style — only the levels that add value). Text or reference to diagram.

```text
[Context/container diagram — systems, users, containers and how they communicate]
```

### Structure and repository conventions

- **Folder / module organization:** [pattern to adopt]
- **Naming / lint / test conventions:** [pattern to adopt]
- **Branching / CI strategy:** [pattern to adopt]

---

## Affected Systems and Components

| System / Component | Nature of impact |
|---|---|
| [Service / module] | [New / modified / consumed only] |

---

## Architectural Impact

> Migrated from the old RP Section 8. Exclusive CTO territory.

| Area | Impact | Architectural note |
|---|---|---|
| **Data model** | [Description] | [Pattern to follow/avoid] |
| **Events / messaging** | [Description] | |
| **Frontend** | [Description] | |
| **Security** | [Description] | |
| **Multi-tenancy** | [Description] | |
| **Performance / Scalability** | [Description] | |
| **Observability** | [Description] | |

---

## Required Integrations

> Migrated from the old RP Section 7 — now with the technical feasibility lens.

| System | Type | Protocol | Feasibility / Known risks |
|---|---|---|---|
| [System 1] | Internal / External / API / Event / Webhook / DB | [REST / OIDC / gRPC / …] | [Feasible / third-party limitations / risk] |

---

## Build vs. Buy

> For each non-trivial capability: build, buy/integrate a third party, or reuse something existing? The decision has a direct effect on cost, timeline, and risk. Skip if there is no relevant make-or-buy decision.

| Capability | Decision | Rationale | Effect on cost/timeline |
|---|---|---|---|
| [Capability] | Build / Buy / Reuse | [Why] | [Summary] |

---

## Alternatives Considered

> **The rationale, not just the conclusion.** Design doc standard (Google/RFC): recording what was evaluated and **why it was discarded** gives the downstream the context to decide on implementation — and prevents the same alternative from being re-litigated later. One row per significant alternative.

| Alternative | Pros | Cons | Why it was NOT chosen |
|---|---|---|---|
| [Approach A] | [Pros] | [Cons] | [Reason for rejection] |

---

## NFR Feasibility  ·  *(mapped to RP, Section 8)*

> **Closes the product ↔ technical loop.** The PO declared quality requirements in the RP (Section 8); here the CTO responds, NFR by NFR, whether they are **feasible** and **how** — the *quality scenarios* from arc42. An infeasible NFR is a veto or re-scoping signal, not a detail.

| NFR (from RP §8) | Feasible? | How it will be achieved / approach | Risk / caveat |
|---|---|---|---|
| [e.g.: propagation < 500ms] | Yes / With caveats / No | [Technical mechanism] | [What threatens it] |

---

## Testability and Observability

> How to **prove** it works and how to **see** it in production. Without this, the RP acceptance criteria cannot be verified and behavior cannot be monitored.

| Dimension | Approach |
|---|---|
| **Test strategy** | [Unit / integration / e2e — what covers what; regression risk areas] |
| **Test data / environment** | [How to reproduce scenarios, including edge cases from RP §9] |
| **Telemetry / technical metrics** | [What to instrument to observe the feature] |
| **Logs / alerts** | [Failure signals and how they will be detected] |

---

## Hard Constraints

> Non-negotiable conditions that limit the solution space. The PO does not soften or reinterpret them — if they disagree, they escalate explicitly. See [`interactions/06-cto-to-po.md`](../interactions/06-cto-to-po.md).

| Constraint | Type | Detail | Effect on scope |
|---|---|---|---|
| [Constraint 1] | Technical / Platform / Security / Multi-tenancy / External | [Detail] | [What changes in the RP, if anything] |

---

## Technical Risks and Mitigations

> **Technical** risks live here (migrated from the RP). Product/business risks remain in the RP, Section 12.

| Risk | Category | Probability | Impact | Mitigation |
|---|---|---|---|---|
| [Risk 1] | Technical / Security / Infra / Integration / Data | High / Medium / Low | High / Medium / Low | [Mitigation] |

---

## Architecture Decisions (ADRs)

> Architectural direction at the CTO level. AI may arrive with suggested ADRs (reused from the knowledge base) — the CTO approves/adjusts. Fine-grained breakdown and implementation ADRs belong to the Tech Lead's Tech Backlog (TB).

| # | Decision | Rationale | CTO sign-off |
|---|---|---|---|
| ADR-001 | [Decision] | [Why this approach] | ✓ |

---

## Effort and Cost Assessment (firm)

> Internal use only. These are the CTO's **firm** estimates — they replace the PO's preliminary estimate (RP Section 13). They will be refined by the Tech Lead in the Tech Backlog. Not a contractual commitment or client-facing material.

### Development Effort

| Area | Estimate | Seniority |
|---|---|---|
| [Backend / Frontend / QA] | [X days] | Senior / Mid / Junior / QA |
| **Total** | **X days** | |

### Infrastructure Impact

[New provisioning, cluster changes, additional regions — or "None"]

### Third-Party Cost Impact

[New providers, licenses, paid APIs — or "None"]

### Recurring Operational Cost Impact

[Storage, observability, bandwidth — quantify if possible]

### TCO Assessment

[Is the feature cost-neutral, does it add recurring cost, or does it create a reusable foundation for future phases?]

---

## Discovery Path (if a technical unknown blocks completion)

> Fill in only if a technical unknown prevents the assessment from closing. The CTO defines the spike/investigation; the PO determines the time-box. The demand returns to Discovery. See [`interactions/05-po-to-cto.md`](../interactions/05-po-to-cto.md).

| Unknown | Spike / Investigation | Who | Suggested time-box |
|---|---|---|---|
| [Technical unknown] | [What to investigate] | [CTO / team] | [N days] |
