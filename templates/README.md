# Templates

Blank templates for each artifact in the operational process.

## The demand journey — five artifacts

The demand passes through five formal documents, each with **a single owner**. Two structural principles (refined in the personas):

1. **The Submitter and the PO have distinct artifacts.** The Submitter captures the pain (`00`); the PO formalizes and triages (`01`) and then rationalizes (`02`) — the **two PO acts** ([`personas/02-po.md` §3](../personas/02-po.md)).
2. **The RP and the Technical Assessment are separate** and **merge in the PRD** — it is the **PRD**, not the RP, that opens the downstream ([`personas/02-po.md` §2](../personas/02-po.md)).

```
00 Submitter     →  01 Intake Record  →  02 Readiness      →  04 PRD            →  downstream (PM)
   Brief               (PO — triage)       Package (PO)         (RP + TA)
   (Submitter)                               03 Technical ┘       └─ PO+CTO merge ─┘
                                             Assessment (CTO)
```

| # | Template | Owner | What it is | Delivers to |
|---|---|---|---|---|
| 00 | [`00-submitter-brief.md`](./00-submitter-brief.md) | **Submitter** (Sales / CS / CEO / Marketing) | The pain captured in the Submitter's language — per-field confidence + RICE-lite + dispositions + readiness score | PO |
| 01 | [`01-intake-record.md`](./01-intake-record.md) | **PO** (act 1 — triage) | Formalizes the brief, assigns the `INT` ID, records the routing decision (Product Ready / Discovery / Backlog / Reject) | rationalization |
| 02 | [`02-readiness-package.md`](./02-readiness-package.md) | **PO** (act 2 — rationalization) | The **product** definition of ready: vision, scope, rules, user stories, NFRs, edge cases, metrics | merges into PRD |
| 03 | [`03-technical-assessment.md`](./03-technical-assessment.md) | **CTO** (alone) | Feasibility, constraints, architecture, integrations, technical risks, ADRs, firm cost | merges into PRD |
| 04 | [`04-prd.md`](./04-prd.md) | **PO + CTO** (merge) | `RP + Technical Assessment` combined — the document that opens the downstream | **PM** |

> **The Technical Assessment only exists when there is architectural escalation.** Without technical impact, the PRD is formed from the RP alone, and the reference in the RP stays `Status: Not requested`.

### Downstream artifacts (after the PRD)

| Template | Owner | When to use |
|---|---|---|
| [`execution-plan.md`](./execution-plan.md) | PM | After receiving and accepting the PRD |
| [`product-backlog.md`](./product-backlog.md) | PO | In parallel with the Execution Plan — what to build |
| [`tech-backlog.md`](./tech-backlog.md) | Tech Lead | After Product Backlog is baselined — how to build |

### Support artifact (persistent, cross-cutting)

| Template | Owner | What it is |
|---|---|---|
| [`tech-landscape.md`](./tech-landscape.md) | CTO / Tech Lead | **Technical knowledge base per system** (not per demand) — product/stack/structure/integrations/debt. The Technical Assessment **references** it (brownfield) or **seeds** it (greenfield). It is the "prior knowledge base" that gives the engineer — or AI agent — the terrain for implementation decisions. Style: *steering docs* (Kiro) / `document-project` (BMAD). |

> **Greenfield vs. Brownfield, journey, and knowledge base.** The upstream journey now declares, at triage ([`01`](./01-intake-record.md)), whether the demand is **greenfield** (new software/module) or **brownfield** (modifies existing) — and this governs the path of the [Technical Assessment](./03-technical-assessment.md): greenfield *defines* the foundation (stack, ADRs, structure); brownfield *documents* the current system. The [Readiness Package](./02-readiness-package.md) gained the **end-to-end user journey** (Section 6.5), from which User Stories derive. The technical terrain lives in the `tech-landscape` and is exposed to the PM in the [PRD](./04-prd.md).
>
> **Rationale and references for these changes:** [`references-evolucao.md`](./references-evolucao.md) — literature base and verified sources (BMAD, Kiro/steering docs, NN/g journey mapping, arc42, C4, Design Docs, Spec-Driven Development) that anchors each addition, for use when porting the templates to the original repository. Extends [`../references.md`](../references.md).

## How to use

1. Copy the template to the folder for the corresponding case or project
2. Rename it keeping the journey prefix and the demand name: `00-submitter-brief-[name].md`, `01-intake-record-[name].md`, etc.
3. Fill in the fields before advancing to the next stage
4. Each artifact advances through a **gate** (not just "fields filled in")

> **Confidence layer and gates.** The Submitter brief carries per-field confidence (`confidence / source / status / hint`) and dispositions; its gate is quantitative (`gateReady = true`, via Readiness Score) — "I don't know, and this is the plan" is valid readiness. The Intake Record inherits that readiness and adds the **triage decision**. The RP freezes (`freezeReady`) when its blocking sections are resolved **and**, if the CTO was requested, the Technical Assessment has been returned signed off. See [`../personas/01-submitter.md`](../personas/01-submitter.md), [`../personas/02-po.md`](../personas/02-po.md), and [`../metrics.md`](../metrics.md).

## Golden rule — problem before solution

If the brief (requirement 1) or the RP (Section 2) describes a **solution** instead of the **problem**, the requirement is not satisfied and is returned for reformulation. The upstream does not define API, database, architecture, or tasks — that is the territory of the Technical Assessment (CTO) and the downstream. See [`../README.md` › Upstream rule](../README.md).

## ID Convention

| Artifact | Prefix | Example |
|---|---|---|
| Submitter Brief | (references the demand; `INT` is assigned at triage) | — |
| Intake Record | INT-YYYY-NNN | INT-2026-001 |
| Readiness Package | RP-YYYY-NNN | RP-2026-001 |
| Technical Assessment | TA-YYYY-NNN | TA-2026-001 |
| PRD | PRD-YYYY-NNN | PRD-2026-001 |
| Execution Plan | EP-YYYY-NNN | EP-2026-001 |
| Product Backlog | PB-YYYY-NNN | PB-2026-001 |
| Tech Backlog | TB-YYYY-NNN | TB-2026-001 |

## File prefixes (instances)

The upstream → PRD journey uses the stage numeric prefix; multiple demands in the same case are distinguished by name (`-queue-voting`, `-access-control`).

| Artifact | File prefix |
|---|---|
| Submitter Brief | `00-` |
| Intake Record | `01-` |
| Readiness Package | `02-` |
| Technical Assessment | `03-` |
| PRD | `04-` |
| Execution Plan | `05-` |
| Product Backlog | `06.1-` / `07.1-` (per demand) |
| Tech Backlog | `06.2-` / `07.2-` (per demand) |
