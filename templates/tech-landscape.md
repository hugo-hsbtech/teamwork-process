# Technical Knowledge Base (Tech Landscape) — [System Name]

> **What it is.** A **persistent, per-system** document (not per demand) that describes the technical terrain on which demands are assessed and built. It is the "prior knowledge base" that the [Technical Assessment](./03-technical-assessment.md) **references** (brownfield) or **seeds** (greenfield, from the foundational ADRs). It exists because the execution layer — a newly onboarded engineer or an **AI agent** — **has no implicit knowledge of the code**; this file makes explicit what normally lives only in the team's heads.
>
> **Inspiration.** Kiro's *steering docs* (`product.md` / `tech.md` / `structure.md`) and the BMAD Method's `document-project` / `project-context.md` — consolidated into a single document per system. This is **persistent context** knowledge, not feature knowledge.
>
> **Lifecycle.** Created when a system is born (greenfield) or when the first brownfield demand requires documenting it (Discovery). **Living:** every demand that changes the terrain updates this file. It may be **complete, partial, or absent** — Section 6 honestly records the gaps (same confidence philosophy as the rest of the process).
>
> **Usage:** one file per system/service. Name it `tech-landscape-[system].md`.

## Metadata

| Field | Value |
|---|---|
| **System / Service** | [Name] |
| **Technical owner** | [Name / team] |
| **Origin** | Greenfield (seeded by TA TA-YYYY-NNN) / Brownfield (documented in INT-YYYY-NNN) |
| **KB status** | Complete · Partial · Stub (initial skeleton) |
| **Last updated** | YYYY-MM-DD — [by whom, for which demand] |

## Update History

| Date | Demand | What changed in the terrain |
|---|---|---|
| YYYY-MM-DD | [INT/PRD-ID] | [Creation / stack change / new integration / debt resolved] |

---

## 1. Product / Domain  ·  *(the "why" — `product.md` style)*

> What this system exists for, who uses it, and what capabilities it delivers. Anchors technical decisions in product purpose.

- **Purpose:** [The problem this system solves]
- **Users / personas:** [Who depends on it]
- **Key capabilities:** [What it does, in 3–7 items]
- **System boundaries:** [What is NOT this system's responsibility]

---

## 2. Stack & Tools  ·  *(the "with what" — `tech.md` style)*

> What the team **already uses** — so that new implementations prefer the established stack rather than reinventing.

| Layer | Technology | Version / note |
|---|---|---|
| **Language(s) / runtime** | [e.g.: TypeScript / Node 20] | |
| **Framework / app** | [e.g.: NestJS] | |
| **Persistence / data** | [e.g.: PostgreSQL + Prisma] | |
| **Messaging / events** | [e.g.: Kafka — or N/A] | |
| **Frontend** | [e.g.: React] | |
| **Infra / deploy** | [e.g.: Kubernetes / AWS] | |
| **Tests** | [e.g.: Jest, Playwright] | |
| **Observability** | [e.g.: OpenTelemetry, Grafana] | |

---

## 3. Structure & Conventions  ·  *(the "how we organize" — `structure.md` style)*

> Where the code lives and the rules that new code must follow to fit without friction.

- **Folder / module organization:** [Pattern — e.g.: by domain, by layer]
- **Naming conventions:** [Files, classes, endpoints]
- **Relevant code patterns:** [e.g.: dependency injection, repository pattern]
- **API / contract patterns:** [REST/events, versioning, authentication]
- **Data patterns:** [Migrations, soft-delete, multi-tenancy]
- **Branching / CI:** [Branch flow, pipeline gates]

---

## 4. Integrations & Dependencies

> Who this system talks to. Context map (C4 style — *system context / landscape*).

| System / Service | Direction | Protocol | Coupling nature |
|---|---|---|---|
| [Name] | Consumes / Is consumed / Bidirectional | [REST / event / DB] | [Synchronous / asynchronous / tight / loose] |

---

## 5. Constraints & Known Debt

> Non-negotiable restrictions and fragilities that every demand must respect/avoid.

| Item | Type | Detail | Implication |
|---|---|---|---|
| [Constraint / debt] | Constraint / Technical debt | [What it is] | [What to avoid or watch out for] |

---

## 6. KB Gaps  ·  *(honesty about what we don't yet know)*

> What is **not yet documented** or has low confidence. Same logic as process dispositions: "not documented yet, and this is the plan" is a valid state — better than silence. A brownfield demand that touches an area listed here must document it before advancing.

| Undocumented area | Why it matters | How/when to fill in |
|---|---|---|
| [Area] | [Risk of not knowing] | [Discovery / next demand that touches it] |

---

## 7. Glossary  *(optional)*

> Domain and technical terms the team uses when talking about this system (arc42 §12 style). Reduces ambiguity for newcomers.

| Term | Definition |
|---|---|
| [Term] | [Definition] |
