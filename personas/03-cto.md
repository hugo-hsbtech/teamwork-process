# Persona: CTO (the Feasibility Authority — the Terrain-Setter)

> Third document in the persona series. Maps the CTO end to end: who he is, how he reasons, what he judges, what he delivers — and the **data structure** that makes that reasoning operable on screen.
>
> If the [Submitter](./01-submitter.md) is the persona whose core is **capturing** a pain honestly, and the [PO](./02-po.md) is the persona whose core is **deciding** a demand's path and product form, the CTO is the persona whose core is **judging feasibility** — can this be built well, on terrain we understand, with people we have? **Feasibility is first class** here, in the same way confidence is first class there and decision is first class for the PO.

---

## Purpose of this document

Current documents define the CTO in a **fragmented and two-headed** way: his role is in [`01-roles.md` §CTO](../01-roles.md) (split across *technical strategy* and an unusually large *people-leadership* section), his demand-facing handoffs are in [`interactions/04-ceo-to-cto.md`](../interactions/04-ceo-to-cto.md), [`05-po-to-cto.md`](../interactions/05-po-to-cto.md), and [`06-cto-to-po.md`](../interactions/06-cto-to-po.md), and the shape of his deliverable is split across two templates — the [`Technical Assessment`](../templates/03-technical-assessment.md) (per demand) and the [`Tech Landscape`](../templates/tech-landscape.md) (per system). No single place brings this together into a unified persona view — exactly the problem the Submitter and PO docs solved for their layers.

Additionally, the [unified prototype](../prototypes/demandos-prototype-unified-v1.tsx) — built by learning from the role — encoded knowledge that the docs **treat only as templates**: the technical assessment as a *scoreable, confidence-graded set of pendencies* (15 of them), **AI-suggested ADRs reused from the knowledge base** (the CTO approves/adjusts rather than authoring from scratch), trace-to-source on every technical claim, and a *CTO assessment-time* KPI (e.g.: 3.2 days).

This document **consolidates all three sources** (roles, templates, prototype), **incorporates the market and engineering calibration** already present in the templates (BMAD greenfield/brownfield tracks, arc42 quality scenarios, C4 context/containers, Nygard ADRs, ISO/IEC 25010 NFRs, Google/RFC design-doc "alternatives considered", Kiro steering docs), and makes explicit the **structural particularity of this persona**: the CTO is the **only role with a dual mandate** — technical strategy *and* people leadership — and the only one whose first-class judgment **rests on terrain that may not yet be documented**. It is simultaneously:

- **Documentation** of the persona (evolves existing docs);
- **Specification** of the abstraction that should become screen value.

The principle that runs through everything: **feasibility is first class.** Every technical judgment carries a verdict, a rationale, and — crucially — **the terrain it rests on**. A feasibility verdict on unknown terrain is not a verdict; it is a guess. Making that terrain explicit is the CTO's equivalent of the Submitter's honesty layer.

---

## 1. Who the CTO is

The CTO is the **feasibility authority** — the persona with **final say on whether and how something can be built**, and the guardian of the platform's architectural integrity. Where the Submitter speaks *problem/value/opportunity* and the PO speaks *scope/rule/criterion/risk*, the CTO speaks *feasibility, architecture, constraint, terrain, sustainability*. He is the second half of the **translation layer**: together with the PO he "stops merely receiving requests and starts producing context, scope, and direction" ([`README.md`](../README.md)). Without this layer, the README is explicit: *"Engineering becomes a help desk, the PO becomes a meeting note-taker, and the CTO becomes a firefighter."*

But the CTO is unlike every persona before him in one decisive way: **he points in two directions at once.**

| Face | Points toward | Native question | Produces |
|---|---|---|---|
| **Technical strategy** | the **platform** (architecture, runtime, integrations, security) | "Can this be built well, on terrain we understand?" | the **Technical Assessment** (per demand) + the **Tech Landscape** (per system) |
| **People leadership** | the **technical chain** (Tech Leads, Engineers) | "Do we have — and will we keep — the people to build it?" | capacity map · 90-day reviews · development plans · hiring signals |

> **Central design constraint:** the CTO is neither the originator of the demand (Submitter) nor its product translator (PO) nor its executor (Tech Leads/Engineers). His value is entirely **judgment over feasibility and integrity** — what can be built, on what terrain, at what cost, with what people, without compromising the platform. Anything that reduces him to a section-filler inside someone else's document (the old "CTO fills RP Section 8") destroys the role. **The CTO never edits the RP**; he responds with his own artifact.

He holds **final authority** on architectural decisions ("no override below this role" — [`01-roles.md`](../01-roles.md)) and can **veto feasibility** — but he does **not redefine the product**. When he vetoes, the PO revises scope; the CTO does not rewrite the demand.

In the prototype example he is **Rafael Lima, CTO** ("technical assessment, ADRs, architectural decisions").

### 1.1 Calibration note — why "CTO" here is the technical authority *and* the people leader

The title "CTO" in the market spans a wide range — from the founder who still writes code, to the VP of Engineering who runs people, to the Chief Architect who owns no humans. This project deliberately fuses two of those:

- The **technical-strategy** CTO — architecture, platform direction, governance — closest to the **enabling-team** role in Team Topologies (Skelton & Pais): *does not execute; empowers, removes friction, transfers context* (see [`references.md` §7](../references.md)).
- The **people-leadership** CTO — the one accountable for the health, growth, and performance of the entire technical chain, normally a **VP of Engineering** function in larger orgs.

**The fusion is intentional and has a thesis behind it.** In the startup this model serves, the person who decides *how the platform is built* must also own *the people who build it* — because architectural integrity and team health are the same constraint seen from two sides. A brilliant architecture executed by a burned-out, single-point-of-knowledge team is not feasible; a healthy team with no architectural direction ships chaos. The CTO is the **managed bottleneck** of the Theory of Constraints (Goldratt — [`references.md` §5](../references.md)): the role you protect, exploit, and elevate, precisely because both of its faces gate the downstream.

> In small teams the function can be accumulated (a founding engineer, a VP Eng, a staff+ lead) — but **both faces must exist**. You cannot subordinate the downstream to a feasibility authority who has no view of whether the people can sustain it.

---

## 2. The two mandates — technical strategy and people leadership

The CTO's work, like the PO's, is **not a single continuous flow**. But where the PO's two *acts* (triage, rationalization) are sequential stages of the same demand, the CTO's two **mandates** have **fundamentally different natures and clocks**. Confusing them is the classic design error (treating the CTO as "the architect who occasionally does 1:1s", or "the manager who occasionally signs off ADRs").

| Mandate | Nature | Clock | The question | The output | Renders on screen as |
|---|---|---|---|---|---|
| **Technical strategy** | **Judgment** · episodic · per demand / per system | Triggered by escalation; **has an end** (assessment signed) | "Can this be built well, on terrain we understand?" | Signed **Technical Assessment** + updated **Tech Landscape** | **Assessment workspace** — pendencies, feasibility verdict, ADRs, sign-off gate |
| **People leadership** | **Stewardship** · continuous · per person | **Never ends** — "People management has no end" ([`01-roles.md`](../01-roles.md)) | "Do we have — and will we keep — the people to build it?" | Capacity map · review signals · dev plans · hiring signals | **Team cockpit** — capacity coverage, health signals, review cadence |

> **The line separating the two mandates is the artifact.** Technical strategy *produces a document that freezes* (the TA, like the RP, has a sign-off gate). People leadership *produces a living state that never freezes* (a capacity map is never "done"; a 1:1 cadence never "closes"). This is the CTO analogue to the PO's `Product Ready` line — except here it is not a gate *between* the mandates but a difference *of kind*: one mandate concludes, the other only continues.

Both mandates answer the **same first-class question from two terrains** — *is this feasible, sustainably?* Technical strategy answers it on the terrain of the **platform**; people leadership answers it on the terrain of the **team**. A feasibility verdict that ignores team capacity is as incomplete as one that ignores architecture. This is why the persona keeps them together rather than splitting "CTO" and "VP Eng" into two documents.

> **Scope of this document.** Both mandates are first class, but they mature at different speeds for *screen* purposes. The **technical-strategy** mandate maps cleanly onto the same engine as the Submitter and PO (contract → graded entry → derived gate) and is where the prototype already lives — so it gets the heavier data-structure treatment (§3–§7). The **people-leadership** mandate is structured (§5.3, §8) but is, by nature, less of a frozen artifact and more of a continuous instrument; it is specified here, not reduced.

---

## 3. The feasibility model (core)

Feasibility is the axis that sustains everything else — the exact analogue to the Submitter's trust model and the PO's decision model. Every CTO technical judgment — whether a whole-assessment verdict or a single pendency answer — carries:

| Attribute | Meaning |
|---|---|
| `verdict` | the judgment itself (e.g.: `Feasible` · `Feasible with caveats` · `Infeasible as scoped`; or, per pendency: the technical answer) |
| `rationale` | **why** — text that makes the judgment defensible, never a rubber stamp |
| `terrain` | **the knowledge base it rests on** — a reference to the [`Tech Landscape`](../templates/tech-landscape.md) (or an honest note that the terrain is undocumented) |
| `confidence` | 0–100 — how solid the answer is (reuses the Submitter's layer; the prototype's 15 pendencies each carry one) |
| `source` | evidence traceability (*trace-to-source* — inherited honesty layer: "PO question #2", "tech-landscape §5", "reused ADR-102") |
| `generates` | what this judgment *creates* downstream — a hard constraint, an ADR, a Discovery spike, a KB update |

This is the **defensibility-on-terrain layer**. Downstream (the PRD, the PM, the Tech Leads, the CFO) does not just receive "it's feasible" — it receives *why*, *on what terrain*, *with what confidence*, and *what constraints/ADRs that judgment generates*, every claim traceable to its origin.

> The Submitter taught us confidence is **per field**. The PO taught us defensibility is **per decision**. The CTO adds the piece both were missing for technical work: **a verdict is only as good as the terrain it rests on.** `terrain` is the new first-class attribute. *"Feasibility cannot be assessed on unknown terrain"* ([`03-technical-assessment.md`](../templates/03-technical-assessment.md)) is the CTO's golden rule, the structural twin of the Submitter's "problem before solution".

### 3.1 The terrain fork — greenfield *creates* it, brownfield *discovers* it

Because feasibility rests on terrain, the **first thing the CTO classifies is whether the terrain already exists.** This single classification governs the whole assessment (inherited directly from the TA template's two-path design — BMAD greenfield/brownfield):

| Nature | What the terrain looks like | What the TA does to it | Effect on the KB |
|---|---|---|---|
| **Greenfield** (new software/module) | There is no terrain yet | The TA **creates** it — stack, foundational ADRs, structure | **seeds** a new [`Tech Landscape`](../templates/tech-landscape.md) |
| **Brownfield** (modifies existing) | Terrain exists but may be tacit | The TA **discovers and documents** it before changing it | **references / updates** the existing Tech Landscape |
| **Hybrid** (new within existing) | Both | Both paths | references + seeds |

> **The honesty consequence.** If the terrain is brownfield and the KB does not exist or is incomplete, **documenting the current system is a prerequisite of the assessment, not a detail** — it becomes a Discovery spike (§6). The CTO does not bluff a verdict on terrain he has not seen. This is the same philosophy as the Submitter's `discovery` disposition: "not documented yet, and this is the plan" is a valid state — and a better one than a confident guess on unknown ground.

---

## 4. Data structure — deterministic in form, non-deterministic in content

The guiding phrase, identical to the Submitter's and the PO's: **the structure is fixed; the content varies.** The data model is known in advance; what fills each field (and which pendencies, ADRs, or constraints emerge) is generated from the content of each demand and the state of each system.

```
— MANDATE 1: TECHNICAL STRATEGY (produces the Technical Assessment) —

TASection              (DETERMINISTIC — the sections/pendencies of the assessment; see §5.1)
  id                stable key                         (prototype: tech-1 … tech-15)
  label             "Architectural impact" · "NFR feasibility" · "Hard constraints" · …
  group             Classification | Architecture | Integrations | Quality | Risk | Effort | Ops
  path              greenfield | brownfield | both     (the terrain fork — §3.1)
  why               what this section guarantees to whoever receives the PRD
  satisfiedWhen     rubric: what is "good enough" (guides AI judgment)
  blocksSignoff     true = TA does not sign until this section is resolved

TAEntry                (NON-DETERMINISTIC content, deterministic envelope)
  sectionId         → which section this entry fills
  content           the technical text
  verdict           the judgment (on the feasibility section: Feasible | Caveats | Infeasible)
  rationale         why — required (defensibility)
  terrain           → TechLandscape ref, or "undocumented" (the new first-class attribute, §3)
  confidence        0–100, evaluated against satisfiedWhen   (reuses the Submitter's layer)
  source            origin — PO question, KB, reused ADR, CTO-authored   (trace-to-source)
  disposition       assessed | ai_drafted | reused_from_KB | discovery   (see §6)
  generates         hard_constraint | adr | discovery_spike | kb_update | —   (§3)

ADR                    (DETERMINISTIC envelope, non-deterministic content — the architectural log)
  id                ADR-NNN
  decision/rationale/alternatives/consequences        (Nygard format)
  origin            ai_suggested | reused_from_KB | cto_authored   ← prototype WOW: AI arrives with these
  ctoSignoff        ✓ required — AI suggests, the CTO approves/adjusts

— THE TERRAIN (persistent, per-SYSTEM, not per-demand — the CTO's knowledge base) —

TechLandscape          (DETERMINISTIC — the "prior knowledge" the TA rests on; see §5.2)
  system            one file per system/service
  kbStatus          complete | partial | stub | absent   (honest about gaps)
  sections          Product | Stack | Structure | Integrations | Constraints&Debt | Gaps | Glossary
  origin            greenfield (seeded by a TA) | brownfield (documented in Discovery)
  → the TA REFERENCES this (brownfield) or SEEDS it (greenfield). Living: every demand updates it.

— MANDATE 2: PEOPLE LEADERSHIP (continuous — never freezes; see §5.3) —

CapacityMap            (DETERMINISTIC envelope, continuously updated)
  seniorityDistribution / skillsCoverage / singlePointsOfKnowledge / growthTrajectory
  → answers the PM's capacity assessment + raises the CTO's hiring signal

PersonSignal           (per person in the technical chain)
  reviewDimensions  6: TechnicalQuality, DeliveryReliability, ProblemSolving,
                       Communication, Growth, TeamContribution   (90-day review)
  signal            on_track | needs_support | at_risk           (the people verdict)
  plan              dev plan (continuous) · 30-day improvement plan (if at_risk)

— DERIVED, regenerated on every change (the engine, not stored truth) —
  assessmentReadiness  = f(sections resolved, weighted)   ← gate for "can sign the TA"
  signOffReady         = all blocksSignoff sections resolved AND terrain is documented
                         (does not sign a feasibility verdict on undocumented brownfield terrain)
  feasibilityVerdict   = the headline judgment merged into the PRD
  capacityCoverage     = skills/seniority vs. roadmap demand   ← the people-side gate
```

The clean line, identical in shape to the other two personas: **`TASection` is the deterministic contract; everything below `TAEntry.content` is generated; `assessmentReadiness` / `signOffReady` / `feasibilityVerdict` are pure functions of what is above.** It is the **same engine** as the Submitter's and PO's (fixed contract → graded entry → derived score/gate), instantiated with the CTO's sections. Two pieces are genuinely new:

1. **`TechLandscape` — the terrain.** A *persistent, per-system* document, not a per-demand artifact. It is the CTO's knowledge base; the TA rests on it. This is the structural twin of the confidence layer: it makes explicit what is normally tacit (the execution layer — a new engineer or an **AI agent** — *has no implicit knowledge of the code*).
2. **`ADR.origin = reused_from_KB`** — the prototype's WOW: the AI arrives with **suggested ADRs already reused from the knowledge base**, and the CTO approves/adjusts instead of authoring from scratch.

---

## 5. Compliance requirements — the CTO's contracts

The CTO has **three contracts**: one per-demand (the TA), one per-system (the terrain), one per-person (the people instrument).

### 5.1 Technical Assessment contract — the feasibility definition

Derived from [`templates/03-technical-assessment.md`](../templates/03-technical-assessment.md) and the prototype's 15 technical pendencies (`tech-1 … tech-15`). The `path` column marks the terrain fork (§3.1): fill the applicable path, skip the other. The contract is a **ceiling, not a floor** — a small change with no architectural impact produces *no TA at all* (the PRD forms from the RP alone).

| # | Section (`label`) | Group | Path | Blocks sign-off? |
|---|---|---|---|---|
| 1 | Feasibility verdict (+ rationale, caveats) | Classification | both | ✅ — the first-class judgment |
| 2 | Technical classification + Knowledge Base | Classification | both | ✅ — governs the rest; sets the terrain |
| 3 | PO questions addressed | Classification | both | ✅ — *trace-to-source* to what was escalated |
| 4 | Current state / landscape (existing patterns, debt, regression risk) | Architecture | **brownfield** | ✅ if brownfield |
| 5 | Technical foundation (stack with criteria, target architecture, structure) | Architecture | **greenfield** | ✅ if greenfield |
| 6 | Affected systems and architectural impact (data, events, security, multi-tenancy, perf, observability) | Architecture | both | ✅ |
| 7 | Required integrations (protocol, feasibility, third-party risk) | Integrations | both | — |
| 8 | Build vs. buy | Integrations | both | — |
| 9 | Alternatives considered (+ why rejected) | Architecture | both | — *(design-doc standard)* |
| 10 | NFR feasibility (mapped to RP §8) | Quality | both | ✅ — an infeasible NFR is a veto signal |
| 11 | Testability and observability | Quality | both | ✅ — without it, RP acceptance can't be verified |
| 12 | Hard constraints (non-negotiable, limit the solution space) | Risk | both | ✅ |
| 13 | Technical risks and mitigations | Risk | both | ✅ |
| 14 | Architecture Decisions (ADRs) | Architecture | both | ✅ — AI-suggested, CTO-signed |
| 15 | Effort and cost (firm — replaces the PO's preliminary) | Effort | both | ✅ |
| — | Discovery path (if a technical unknown blocks completion) | — | both | gate — see §6 |

> **Golden rule (CTO's):** *feasibility before commitment, terrain before feasibility.* Section 2 governs everything; an assessment that skips it is a guess. And consistent with the chain ([`02-po.md` §2](./02-po.md)): the TA **responds to** the RP and may **veto** its scope, but **never redefines the product** and **never edits the RP**.

### 5.2 Terrain contract — the Tech Landscape (per system)

Derived from [`templates/tech-landscape.md`](../templates/tech-landscape.md) (inspired by Kiro steering docs and BMAD `document-project`). This is **persistent and per-system** — the only CTO contract that is not per-demand. It exists because feasibility rests on terrain (§3), and because the execution layer has no implicit knowledge of the code.

| # | Section | Guarantees |
|---|---|---|
| 1 | Product / domain | why the system exists, its boundaries |
| 2 | Stack & tools | what the team already uses (prefer it over reinventing) |
| 3 | Structure & conventions | where code lives, rules new code must follow |
| 4 | Integrations & dependencies | who the system talks to (C4 context map) |
| 5 | Constraints & known debt | non-negotiables and fragilities every demand must respect |
| 6 | **KB gaps** | honest record of what is *not yet* documented — same confidence philosophy |
| 7 | Glossary *(optional)* | domain/technical terms, to reduce ambiguity for newcomers |

> **`kbStatus`** is the terrain's confidence dial: `complete · partial · stub · absent`. A brownfield demand that touches an `absent`/`partial` area must document it *first* (Discovery). Greenfield TAs *seed* this file from their foundational ADRs — the assessment becomes the **origin** of the KB, not a consumer of it.

### 5.3 People contract — the 90-day review and capacity map

Derived from [`01-roles.md` §CTO](../01-roles.md) (people management). This is the **continuous** mandate — it has no freeze. Two structured instruments:

| Instrument | Cadence | The six/four dimensions | The verdict |
|---|---|---|---|
| **90-day review** (per person) | every 90 days | Technical quality · Delivery reliability · Problem-solving · Communication · Growth · Team contribution | `on_track` · `needs_support` · `at_risk` → if at-risk, a 30-day plan starts within 5 business days |
| **Capacity map** (per team) | continuous | Seniority distribution · Skills coverage vs. roadmap · Single points of knowledge · 6-month growth trajectory | feeds the PM's capacity assessment + the CTO's **hiring signal** to the CEO |

> **Symmetry with the technical side.** The people signal (`on_track / needs_support / at_risk`) is the people-terrain analogue of the feasibility verdict (`Feasible / Caveats / Infeasible`). Both are judgments with a rationale and a plan attached; both gate the downstream. "Performance management is not punitive" ([`01-roles.md`](../01-roles.md)) — it is the obligation to give context and support *before* escalation, exactly as Discovery is the obligation to investigate *before* vetoing.

---

## 6. The judgments that guide the work — and why "I can't assess yet" is valid

The CTO's unit of work is **the feasibility judgment** (just as the Submitter's is the question and the PO's is the decision). Each judgment:

- targets a TA section, a KB gap, **or** a person's review dimension;
- is made in **technical/leadership language** (architecture, constraint, terrain, capacity, growth);
- carries a required `rationale` and a `terrain` — it exists to be **defensible on known ground**, not merely recorded.

### "I can't assess yet" is not paralysis — it is a structured disposition

Just as the Submitter's "I don't know" and the PO's "I can't decide yet" never block, the CTO's uncertainty never bluffs. A section or pendency has **several honest paths to "resolved enough to sign"**:

| Disposition | What it means | Effect |
|---|---|---|
| `assessed` | The CTO judges directly | full confidence |
| `ai_drafted` | The AI pre-filled it (from KB + RP); the CTO reviews and confirms | partial confidence until confirmed |
| `reused_from_KB` | A prior ADR/landscape pattern applies; the CTO adapts | partial confidence, traceable to the KB |
| `discovery` | A technical unknown blocks the verdict — **investigate before signing** | counts as *resolved-as-unknown*, time-boxed spike |

> **The gate is not "the CTO knows everything".** The gate is **"every blocking section has an honest disposition, the terrain is documented, and any Discovery spike is defined"** (`signOffReady`). On undocumented brownfield terrain, the only honest disposition is `discovery` — the CTO defines the spike, the PO time-boxes it, the demand returns to Discovery, and the [`Tech Landscape`](../templates/tech-landscape.md) is produced/updated as a *prerequisite* of the verdict. This keeps the screen a **judgment workspace**, not a form: the AI brings the draft and the reused ADRs, the CTO exercises judgment, and every verdict is defensible on known ground.

The same logic governs the people side: a person is never silently "fine" or "failing" — every signal has a disposition (`on_track`) or a plan (`needs_support`/`at_risk`), never a verdict without a path forward.

---

## 7. Indicators — the mirror that governs integrity (not a single TA)

The Submitter has RICE-lite as a mirror sharpening *one* demand; the PO has portfolio indicators sequencing the *queue*. The CTO's productive tension is different again: it is **between shipping now and keeping the platform and the team sustainable** — between feasibility and integrity. The indicators that matter:

| Indicator | The CTO's question | Note |
|---|---|---|
| **Technical debt pressure** | "What does this demand add to / pay down from the debt in this terrain?" | from the KB §5 (Constraints & Debt) |
| **ADR reuse** | "Have we decided something like this before? Is there a reusable ADR/pattern?" | the velocity lever — the prototype's WOW |
| **Build vs. buy / TCO** | "Build, integrate, or reuse — and what is the recurring cost?" | direct effect on cost, timeline, risk |
| **Capacity vs. roadmap** | "Do we have the seniority and skills — and is there a single point of knowledge?" | the people-side constraint |

### The "challenge integrity" mechanism

As with the other personas, the value is not the numbers — it is the **tension between them**, surfaced as a provocation:

- **High delay pressure + high debt in this terrain** → *"Fast to ship, but it deepens debt here — slice it, or pay the debt down first?"*
- **Feasible architecture + single point of knowledge** → *"Technically fine, but only one person knows this system — is that a delivery risk we're accepting silently?"*
- **New demand very similar to a signed TA** → *"We already assessed something like this — reuse the ADRs instead of re-deciding?"*
- **NFR demanded by RP §8 + infeasible as scoped** → *"The product wants <500ms; the terrain can't hold it as scoped — caveat, re-scope, or Discovery?"*

Each provocation that sharpens a judgment protects integrity *and* speeds the next assessment — mirror and gate pull in the same direction, exactly as on the other two personas' sides.

---

## 8. How the CTO is measured — portfolio view

The prototype and the metrics doc give the CTO a view the role docs never consolidated. These metrics *are* how he reasons about his own work — and they are **pay-justifying** (they justify paying for the platform):

| Metric | What it says | Origin |
|---|---|---|
| **Average CTO assessment time** (e.g.: 3.2 days) | Speed of the feasibility judgment — the constraint's throughput | [`metrics.md` §2](../metrics.md) / prototype KPI |
| **ADR reuse rate** (suggested-from-KB vs. authored-fresh) | How much the knowledge base accelerates assessment | prototype (`adrsReusedFromKB`) |
| **Infeasibility caught at intake** (vs. discovered in execution) | Value of catching "can't be built as scoped" *before* commitment | feasibility verdict |
| **NFR feasibility hit rate** (declared-feasible NFRs that held in production) | Quality of the CTO's quality judgment — projected vs. realized | [`metrics.md` §3](../metrics.md), arc42 quality scenarios |
| **KB coverage** (% of touched systems with a current Tech Landscape) | How much terrain is documented vs. tacit | Tech Landscape `kbStatus` |
| **Team health signal** (on-track / needs-support / at-risk distribution) | The people-mandate's hero metric | [`01-roles.md`](../01-roles.md) 90-day reviews |
| **Capacity coverage vs. roadmap** + **single-points-of-knowledge count** | Whether the team can sustain what's coming | capacity map |

> **Silent insight:** "NFR feasibility hit rate" is the CTO's mirror on himself — the direct analogue to the Submitter's "first-version acceptance" and the PO's "PM first-version acceptance". It tells whether his feasibility judgments hold up in production, without auditing every release. And "infeasibility caught at intake" is the value thesis of the whole intake layer for this role: an infeasible scope caught *before* commitment costs a conversation; caught *in execution* it costs a sprint.

---

## 9. The relationships — the hinge of the technical org

The CTO is the most **connected** persona — the hinge between executive direction, product translation, and execution. Four relationships define him:

| Relationship | Direction | What flows | Reference |
|---|---|---|---|
| **CEO → CTO** | down (executive) | Strategic direction + non-negotiable constraints → CTO returns feasibility + risk posture; routes product work into PO intake (never straight to Engineering) | [`04-ceo-to-cto.md`](../interactions/04-ceo-to-cto.md) |
| **PO ↔ CTO** | lateral (intake) | PO escalates the **RP + specific questions**; CTO returns a **signed Technical Assessment** (his own artifact). The merge happens in the **PRD**. CTO may **veto** scope; PO revises — CTO does not redefine the product | [`05-po-to-cto.md`](../interactions/05-po-to-cto.md), [`06-cto-to-po.md`](../interactions/06-cto-to-po.md) |
| **CTO → Tech Leads** | down (people) | Architectural direction (ADRs, governance) + the continuous people mandate (1:1s, reviews, growth). Tech Leads flag architectural concerns up; the CTO can override a TL decision that breaks standards | [`01-roles.md`](../01-roles.md) |
| **CTO → CEO** | up (signal) | The **hiring signal** when capacity can't be closed by development in time — specific gap + roadmap impact + proposed profile | [`01-roles.md`](../01-roles.md) |

> The defining boundary: **everything that enters Engineering through the CTO produces an artifact** — a Technical Assessment, an ADR, or an intake record (via PO). "Nothing enters Engineering informally from this interaction" ([`04-ceo-to-cto.md`](../interactions/04-ceo-to-cto.md)). The CTO is the role that refuses to let direction become tacit.

---

## 10. The deliverable and the handoff

- **Technical deliverable (per demand):** the **Technical Assessment** (`TA-YYYY-NNN`) — the frozen feasibility definition, authored solely by the CTO, in parallel with the RP.
- **Knowledge deliverable (per system):** the **Tech Landscape** (`tech-landscape-[system].md`) — seeded greenfield, updated brownfield; the terrain every future assessment rests on.
- **Combined deliverable:** the CTO is **co-author of the PRD** (`PRD-YYYY-NNN = RP (PO) + Technical Assessment (CTO)`). It is the PRD — not the TA — that opens downstream.
- **TA sign-off gate:** `signOffReady = true` (every `blocksSignoff` section resolved, terrain documented, Discovery spikes defined). It is the technical half of the Upstream Kanban *commitment point*.
- **People deliverable (continuous):** the **capacity answer** to the PM's assessment and the **hiring signal** to the CEO — neither of which ever "freezes".

> **When there is no TA.** If a demand has no architectural impact, there is no escalation and no Technical Assessment — the PRD forms from the RP alone, and the RP's `TechAssessmentRef` stays `Not requested`. The CTO's absence from a demand is itself a (delegated) judgment: the PO triages without architectural impact, with the CTO's standing delegation ([`01-roles.md`](../01-roles.md): "can delegate triage decisions to the PO for demands with no architectural impact").

After sign-off, the CTO **no longer drives the demand** — execution belongs to the PM and Tech Leads. But the CTO owns **Architecture Governance** (the standing ADR log, standards) and re-engages whenever an architectural issue surfaces downstream.

---

## 11. Screen value

The CTO has **two screens**, one per mandate — and both must feel like **judgment, not authoring**.

- **The assessment workspace** (technical strategy) should **not** feel like 15 empty technical fields to type. It should feel like the system **has already read the RP and the knowledge base, classified the terrain, drafted the pendencies, and arrived with suggested ADRs reused from the KB** — and the CTO's time becomes high-value judgment: confirm the terrain, approve/adjust the ADRs, sign the feasibility verdict. The **terrain fork** renders as the first decision (greenfield → *here is the foundation to seed*; brownfield → *here is the current system, documented*). Every claim is traceable (*trace-to-source*) and every verdict carries the terrain it rests on.
- **The team cockpit** (people leadership) renders the continuous mandate as *live state, not a form*: capacity coverage against the roadmap, single-points-of-knowledge flagged in red, the 90-day review cadence, health signals (`on-track / needs-support / at-risk`) — so the CTO sees *where the team can and cannot sustain what's coming*, the same way he sees where the platform can.
- **The PRD merge** renders as *visible stitching* (shared with the PO's screen): the CTO's Technical Assessment alongside the PO's RP, forming the PRD — each half with its clear author, neither writing over the other.

The WOW moment is the opposite of the README's fear: instead of "the CTO becomes a firefighter", the CTO arrives at a demand where the AI **has already classified greenfield vs. brownfield, documented the terrain (or flagged the gap), drafted the architectural impact, and suggested ADRs from the base** — and at a team view where capacity risk is visible *before* it becomes a delivery fire. His time becomes feasibility judgment and people stewardship, not typing and not firefighting.

---

## 12. What the prototype and research taught us (and the docs did not yet have)

1. **Feasibility on terrain** (`verdict / rationale / terrain / confidence / source / generates`) — the first-class layer, the technical analogue of the Submitter's honesty layer and the PO's defensibility layer. The new attribute is `terrain`.
2. **The terrain fork** (greenfield *creates* / brownfield *discovers*) as the classification that governs the whole assessment — and the Tech Landscape as a **persistent, per-system knowledge base**, not a per-demand artifact. *(BMAD, Kiro steering docs.)*
3. **AI-suggested ADRs reused from the KB** — the system arrives with drafted, reused architectural decisions; the CTO approves/adjusts (`ADR.origin = reused_from_KB`). The prototype's clearest WOW for this role.
4. **The TA as a scoreable, confidence-graded set of pendencies** (15 in the prototype) with a sign-off gate — the same engine as the RP, instantiated for the CTO.
5. **The TA → PRD chain** — the CTO authors his own artifact, never edits the RP, and co-authors the PRD via merge. *(structural correction, already reflected in the templates and interactions.)*
6. **The dual mandate as first class** — technical strategy *and* people leadership, both answering feasibility from two terrains (platform and team); the people signal (`on-track/needs-support/at-risk`) as the symmetric twin of the feasibility verdict.
7. **Engineering calibration** — NFR feasibility against RP §8 (arc42 quality scenarios), alternatives-considered (Google/RFC design docs), C4 context/containers (Brown), ADRs (Nygard), ISO/IEC 25010, build-vs-buy/TCO. *(template research.)*
8. **Pay-justifying KPIs** — assessment time (3.2d), ADR reuse, infeasibility caught at intake, NFR hit rate, KB coverage, team health and capacity coverage.

---

## 13. Relation to existing documents — and status of updates

| Document | Relation | Status |
|---|---|---|
| [`01-roles.md`](../01-roles.md) | Defines the CTO's dual mandate (technical strategy + people leadership). This doc **abstracts and unifies** both faces into one persona. | No change needed — this doc consolidates it. |
| [`personas/01-submitter.md`](./01-submitter.md) | Upstream origin of the honesty layer. | No — this doc **inherits** the confidence layer and *trace-to-source*. |
| [`personas/02-po.md`](./02-po.md) | The lateral partner; defines the RP → TA → PRD chain and the `TechAssessmentRef` bridge. | No — this doc is the **other half** of that chain, seen from the CTO. |
| [`templates/03-technical-assessment.md`](../templates/03-technical-assessment.md) | The shape of the per-demand deliverable. The TA contract (§5.1) and the terrain fork (§3.1) derive from it. | No — already mature; this doc makes it confidence-gradable and persona-grounded. |
| [`templates/tech-landscape.md`](../templates/tech-landscape.md) | The shape of the terrain. The terrain contract (§5.2) derives from it. | No — already mature; this doc elevates it to **first-class terrain**. |
| [`templates/tech-backlog.md`](../templates/tech-backlog.md) | Downstream of the CTO — Tech Lead refines ADRs/effort. | No — boundary respected (fine-grained ADRs belong to the TB, not the TA). |
| [`interactions/04-ceo-to-cto.md`](../interactions/04-ceo-to-cto.md), [`05`](../interactions/05-po-to-cto.md), [`06`](../interactions/06-cto-to-po.md) | The CTO's three demand-facing handoffs. | No — already corrected (CTO produces the TA, never edits the RP). |
| [`metrics.md`](../metrics.md) | Source of the CTO assessment-time KPI and projected-vs-realized NFR logic. | No — source of §8. |
| [`README.md`](../README.md) | Process overview; governance-document index. | **Done** — governance index (§12) gains a row for this persona. |
| [`prototypes/`](../prototypes/) | Primary research — the 15 pendencies, suggested/reused ADRs, assessment-time KPI. | No — source of mechanics (§3, §4, §6, §8, §12). |

---

> **Next persona** — the **PM** — follows this same template: who they are · central act(s) · the first-class model (confidence for the Submitter, decision for the PO, feasibility for the CTO, **execution/flow** for the PM) · data structure · compliance requirements · dispositions · indicators · metrics · handoff · screen value. The PM doc, in particular, should treat the **Execution Plan** as its first-class deliverable, the **PRD** as the artifact it receives (with explicit authority to reject and return), and downstream flow as its screen value.
