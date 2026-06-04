# Model Metrics and Observability

> The Intake Record ([`templates/00-submitter-brief.md`](./templates/00-submitter-brief.md)) is a **snapshot** of the content of *one* demand at handoff. This document covers what the snapshot does not capture: **measurement over time and across demands**. These are three distinct layers, with different owners and different lifecycles.

| Layer | Question it answers | Owner | Horizon |
|---|---|---|---|
| **1. Demand metrics** | "How is *this* demand progressing?" | PO (Intake) | Lifecycle of one demand |
| **2. Portfolio metrics** | "How is the intake as a whole performing?" | PO / PM | Ongoing / quarterly |
| **3. Post-handoff and outcome** | "What value did the delivered demand *actually* generate?" | PM + CS / PO | 30 / 60 / 90 days post-rollout |

> **Confidence runs across all three.** *Projected* values (at intake) carry confidence; *realized* values (post-delivery) are measured. The projected-vs-realized comparison is the heart of layer 3.

---

## 1. Demand metrics (the demand itself)

Instrumentation of the lifecycle of **one** demand — a time series of its progress, not the static content of the record. Feeds the "how are we doing" view for a specific demand.

| Metric | What it measures | Source |
|---|---|---|
| **Readiness Score (trajectory)** | Evolution of the readiness score over time, not just the final value | Derived from compliance requirements |
| **Time in each state** | How long the demand spent in Capture, Triage, Discovery, Rationalization, etc. | State machine ([`README.md` §9](./README.md)) |
| **Confidence trajectory** | Average field confidence over time (how solid the demand became) | Confidence layer ([`personas/01-submitter.md` §3](./personas/01-submitter.md)) |
| **Pending items by disposition** | How many requirements were answered vs. inferred vs. assumption vs. discovery vs. deferred | `SubmissionEntry.disposition` |
| **Discovery cycles** | Number of Discovery trips and duration vs. time-box | Discovery Brief |
| **Bounces (PM rejections)** | How many times the RP returned from the PM to the PO | RP revision history |
| **Versions until freeze** | Number of record/RP versions before `gateReady` | Revision history |
| **SLA adherence** | Actual time vs. state SLA | [`03-slas.md`](./03-slas.md) |

---

## 2. Aggregated portfolio metrics (all demands)

Aggregate view across many demands. **Partially covered in prototypes** (dashboard KPIs) and in [`personas/01-submitter.md` §8](./personas/01-submitter.md). Consolidated here.

| Metric | What it measures | Already in prototype? |
|---|---|---|
| **Demand → RP conversion rate** | % of submitted demands that survive the gate | ✅ (e.g.: 64%) |
| **Lead time submission → frozen** | Average time from intake to RP frozen | ✅ (e.g.: 8.5 days) |
| **First-version acceptance** | % of RPs accepted by the PM without v1.1 — *quality of raw material* | ✅ (e.g.: 78%) |
| **Throughput** | Demands/RPs completed per period | ✅ |
| **Distribution by state** | How many demands are in each state now (bottlenecks) | partial |
| **Distribution by origin / priority** | Where demands come from and how they are distributed | partial |
| **Rejection / backlog rate** | % rejected or sent to opportunity backlog at triage | — |
| **Average CTO assessment time** | When architectural escalation occurs | ✅ (e.g.: 3.2 days) |

> These metrics exist to **manage the constraint** (CTO/PO as bottleneck — Theory of Constraints, see [`references.md` §5](./references.md)). Lead time and distribution by state show where the queue stalls.

---

## 3. Post-handoff tracking strategy (business outcome)

The demand does not end at release. This layer **tracks the delivered demand** and measures **realized business value** — closing the feedback loop ([`README.md` §11](./README.md) and the `FeedbackLoop` state in [`README.md` §9](./README.md)). **Partially covered in the prototype** (drill-down "Annual impact"; metrics measured 30/60/90d post-rollout).

### 3.1 Execution tracking

After the handoff, the demand remains visible to the Submitter as a portfolio item (she wants to see what she requested being delivered):

| Metric | What it measures |
|---|---|
| **Execution state** | In planning / technical breakdown / development / QA / delivered |
| **Forecast vs. actual** | Projected delivery date vs. actual date |
| **Responsible PM** | Who is driving it |

### 3.2 Business outcome (projected vs. realized)

The core. At intake, the Submitter *projected* value (Success Criteria + Value Indicators). Here we measure what **actually** happened.

| Dimension | At intake (projected) | Post-rollout (realized) | Window |
|---|---|---|---|
| **Annual impact** | Projected $ (carries confidence) | Measured $ | 30 / 60 / 90 d |
| **Success criteria** | Declared targets | % of targets achieved | 30 / 60 / 90 d |
| **Adoption** | Usage expectation | Actual usage | 30 / 60 / 90 d |
| **Satisfaction / NPS** | Hypothesis | Measured with customer (via CS) | 60 / 90 d |

**Complete success criterion** (inherited from prototype): reaching N of M targets within 90 days.

### 3.3 Feedback

The projected-vs-realized delta feeds the PO's learning ([`README.md` Feedback Loop](./README.md)): it calibrates the confidence of future Submitter projections and improves triage. **Projection accuracy** becomes, over time, another quality metric for the Submitter — analogous to "first-version acceptance", but for business value.

---

## Relation to other documents

| Document | Relation |
|---|---|
| [`templates/00-submitter-brief.md`](./templates/00-submitter-brief.md) | Provides the *projected* values (Success Criteria, Value Indicators) that layer 3 compares against realized values |
| [`personas/01-submitter.md`](./personas/01-submitter.md) | §8 defines the Submitter's portfolio metrics; this doc generalizes to demand, portfolio, and outcome |
| [`03-slas.md`](./03-slas.md) | Defines the SLAs that layer 1 measures adherence against |
| [`README.md`](./README.md) | State machine (§9) and Feedback Loop (§11) are the sources for layers 1 and 3 |
| [`prototypes/`](./prototypes/) | Primary research — dashboard KPIs and annual impact drill-down originate layers 2 and 3 |
