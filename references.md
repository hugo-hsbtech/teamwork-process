# References and Supporting Frameworks

> The process described in this repository was not invented from scratch. Every structural decision is grounded in a framework that has already been tested in product and engineering contexts. This document makes those mappings explicit for anyone who wants to understand where each piece comes from.

---

## Summary

The process operates at the intersection of:

1. Stage-Gate (Cooper) — gate governance between phases
2. Dual-Track Development (Patton, Cagan) — discovery and delivery in parallel
3. Continuous Discovery (Torres) — continuous validation of opportunities
4. Lean Startup (Ries) — validated learning and Build-Measure-Learn
5. Lean Software Development (Poppendieck) — waste elimination
6. Theory of Constraints (Goldratt) — bottleneck management
7. Principles of Product Development Flow (Reinertsen) — applied queue theory
8. Team Topologies (Skelton & Pais) — flow-based organizational design
9. Product Operations (Perri & Tilles, Cagan) — product operations

The sections below describe how each one appears in this repository's model.

---

## Consolidated Mapping

| Process Element | Framework | Reference Author(s) | Canonical Work |
|---|---|---|---|
| Upstream vs. Downstream | Dual-Track Agile / Continuous Discovery & Delivery | Jeff Patton, Marty Cagan, Teresa Torres | *INSPIRED* (Cagan, 2008/2017); *Continuous Discovery Habits* (Torres, 2021) |
| Intake Layer with gates | Stage-Gate System | Robert G. Cooper | *Winning at New Products* (Cooper, 1986/2017) |
| Readiness Package | Stage-Gate deliverables + Definition of Ready | Cooper; Schwaber & Sutherland | Cooper (1986); *The Scrum Guide* |
| Readiness Package sections (gate `freezeReady`) | Validated Learning + Opportunity Solution Tree | Eric Ries, Teresa Torres | *The Lean Startup* (2011); *Continuous Discovery Habits* (2021) |
| Feedback Loop | Build-Measure-Learn / PDCA | Eric Ries, W. Edwards Deming | *The Lean Startup* (2011); *Out of the Crisis* (Deming, 1986) |
| CTO/PO as managed bottleneck | Theory of Constraints | Eliyahu M. Goldratt | *The Goal* (1984) |
| Explicit demand states | Kanban — "make process policies explicit" | David J. Anderson | *Kanban* (Anderson, 2010) |
| WIP / queue / small batch | Principles of Product Development Flow | Donald G. Reinertsen | *The Principles of Product Development Flow* (2009) |
| Roles (stream-aligned + enabling) | Team Topologies | Matthew Skelton & Manuel Pais | *Team Topologies* (2019) |
| "Problem before solution" | Lean Software Development — delay commitment | Mary & Tom Poppendieck | *Lean Software Development* (2003) |
| Probability × Impact matrix | PMBOK / ISO 31000 | Project Management Institute / ISO | *PMBOK Guide* (PMI); *ISO 31000:2018* |
| Explicit success criteria | Outcome-based Product Management | Melissa Perri, Marty Cagan | *Escaping the Build Trap* (Perri, 2018) |
| Intake / Triage / Product Ops | Product Operations | Melissa Perri & Denise Tilles; Marty Cagan | *Product Operations* (Perri & Tilles, 2023) |
| Commitment point (Discovery → Delivery) | Upstream Kanban | David J. Anderson; Klaus Leopold | *Kanban* (Anderson, 2010); *Practical Kanban* (Leopold, 2017) |
| Readiness Score (quantitative gate) | Intake completeness gate (`gateReady`) + Stage-Gate gate decision | Robert G. Cooper; David J. Anderson | Cooper (1986); *Kanban* (Anderson, 2010) |
| Per-field confidence + dispositions ("honest I don't know") | Assumption Mapping + Validated Learning | Teresa Torres; David Bland & Alex Osterwalder; Eric Ries | *Continuous Discovery Habits* (2021); *Testing Business Ideas* (2019); *The Lean Startup* (2011) |
| Value indicators (RICE-lite) | RICE scoring | Sean McBride / Intercom | *Intercom on Product Management* (2016) |
| Greenfield vs. Brownfield classification | Greenfield/brownfield tracks; legacy code | BMAD Method; Michael Feathers | BMAD (2024–25); *Working Effectively with Legacy Code* (2004) |
| End-to-end user journey (RP §6.5) | Journey Mapping / Service Blueprinting | Nielsen Norman Group; Jim Kalbach | *Mapping Experiences* (Kalbach, 2016) |
| Technical knowledge base (`tech-landscape`) | *Steering docs* / persistent context | Kiro (AWS); BMAD Method | Kiro Docs; BMAD `document-project` |
| Technical Assessment beyond architecture | Design Docs / arc42 / C4 / ADRs | Google; Starke & Hruschka; Simon Brown; Michael Nygard | *Design Docs at Google*; arc42; c4model.com; ADRs (2011) |
| NFR feasibility (quality scenarios) | Quality requirements as scenarios | arc42; ISO/IEC | arc42 §10; *ISO/IEC 25010* |
| Sufficient context for implementation decisions | Spec-Driven Development / Context Engineering | GitHub; Kiro; Thoughtworks | Spec Kit; Kiro; Thoughtworks (2025) |
| Testable acceptance criteria (support) | EARS — Easy Approach to Requirements Syntax | Alistair Mavin et al. | IEEE RE'09 (Mavin et al., 2009) |

> **Detail on the eight rows above** (what changed in each template, why, and verified sources): see [`templates/references-evolucao.md`](./templates/references-evolucao.md), which extends this document for the template evolution (journey, greenfield/brownfield, knowledge base, enriched TA).

---

## § 1. Upstream / downstream separation → Dual-Track Development

The split between "discovering what to build" (CEO, Sales, CS, Intake) and "executing with quality" (PM, Tech Leads, Engineers) is Dual-Track Agile, a term coined by Jeff Patton and popularized by Marty Cagan (Silicon Valley Product Group).

Core principles:

- The Discovery Track produces validated backlog items; the Delivery Track produces shippable software.
- Both tracks run in parallel, validating risks before a single line of production code is written.
- Discovery faces four risks: value, usability, technical feasibility, and business feasibility.

Starting with INSPIRED v2, Cagan dropped the term "Dual-Track Agile" and moved to Continuous Discovery / Continuous Delivery, to prevent it from becoming a conversation about process instead of principle.

In this project. See [README › The translation layer: CTO + PO](./README.md#the-translation-layer-cto--po) and [README › 1. The three layers](./README.md#1-the-three-layers). The CTO + PO layer is what SVPG calls an empowered product team: the team rationalizes the problem before requesting execution. The downstream does not receive "a loose idea, a recorded call, a Slack message, or an audio clip" — it receives artifacts.

**Sources.**

- [Dual-Track Agile — Silicon Valley Product Group](https://www.svpg.com/dual-track-agile/)
- [Beyond Lean and Agile — SVPG](https://www.svpg.com/beyond-lean-and-agile/)
- [Process vs. Model — SVPG](https://www.svpg.com/process-vs-model/)

---

## § 2. Intake Layer with gates → Stage-Gate (Cooper)

The CTO/PO "Controlled Gate" is an implementation of Stage-Gate, created by Robert G. Cooper (ISBM Distinguished Research Fellow, Penn State; Professor Emeritus, McMaster).

The model emerged from a study of 252 new-product histories across 123 companies (Cooper & Kleinschmidt). Today, approximately 80% of North American companies use some variation of it.

The classic structure is Discover → Scoping → Build Business Case → Development → Testing & Validation → Launch, with gates between each stage.

In this project. See [README › 3. Intake Layer in detail](./README.md#3-intake-layer-in-detail) and [README › 4. What the intake produces — Readiness Package](./README.md#4-what-the-intake-produces--readiness-package). The rule "a demand only leaves the Intake when it is READY for execution" is Cooper's gate decision. The Readiness Package is the set of deliverables required at the gate.

It is worth noting that Cooper evolved the model into Next Generation Stage-Gate, which is adaptive, with "fuzzy" gates and iteration within phases — useful for responding to the "rigid gate" critique.

**Sources.**

- [Stage-Gate International — Our Story](https://www.stage-gate.com/about/our-story-2/)
- [Stage-Gate Systems: A New Tool for Managing New Products (ResearchGate)](https://www.researchgate.net/publication/4883499_Stage-Gate_Systems_A_New_Tool_for_Managing_New_Products)
- [Next Generation Stage-Gate® — Bob Cooper](https://www.bobcooper.ca/articles/next-generation-stage-gate-and-whats-next-after-stage-gate)
- [The Stage-Gate Model: An Overview — Stage-Gate International](https://www.stage-gate.com/blog/the-stage-gate-model-an-overview/)

---

## § 3. Readiness Package + "Problem before Solution" → Lean Startup + Continuous Discovery

See [README › 4. What the intake produces — Readiness Package](./README.md#4-what-the-intake-produces--readiness-package) and [README › 10. Golden rules of intake](./README.md#10-golden-rules-of-intake) (rule 1: "PROBLEM BEFORE SOLUTION").

The Readiness Package sections operationalize three complementary principles:

### 3.1 Validated Learning (Eric Ries)

*Build-Measure-Learn* requires explicit hypotheses before committing resources. The "Objectives and Expected Outcome" and "Success and Acceptance Criteria" sections of the RP force that explicitness.

> "Validated learning is the process of demonstrating empirically that a team has discovered valuable truths about a startup's present and future business prospects." — Eric Ries

### 3.2 Opportunity Solution Tree (Teresa Torres, 2016)

The OST starts from a *desired outcome* → maps *opportunities* (pain points) → tests *solutions* with *assumption tests*. The "Context and Problem," "Impacted Personas," and "Business Rules" sections of the RP implement this tree.

### 3.3 Delay Commitment (Poppendieck)

The principle "commit as late as possible, with the most complete information available" directly justifies the Intake gate: no roadmap commitment before the RP is complete.

**Sources.**

- [The Lean Startup — Principles (Eric Ries)](https://theleanstartup.com/principles)
- [Opportunity Solution Trees — Teresa Torres / Product Talk](https://www.producttalk.org/opportunity-solution-trees/)
- [Build-Measure-Learn feedback loop (Ries 2011) — ResearchGate](https://www.researchgate.net/figure/Build-measure-learn-feedback-loop-Ries-2011-p-75_fig2_308870019)
- [The 7 Principles of Lean Software Development (Poppendieck)](https://www.netsolutions.com/insights/7-principles-of-lean-software-development/)

---

## § 4. Feedback Loop → Build-Measure-Learn + PDCA + Post-Launch Review

See [README › 2. Full flow — from signal to delivery](./README.md#2-full-flow--from-signal-to-delivery) (subgraph "🔁 FEEDBACK LOOP") and [README › 9. States of a demand](./README.md#9-states-of-a-demand) (state `FeedbackLoop`).

The loop "PM + CS collects results → PO learns and updates → feeds back into SIGNAL" has three anchors:

- **PDCA — Plan, Do, Check, Act** (Deming, 1950s): the foundation of every continuous improvement cycle.
- **Build-Measure-Learn** (Ries, 2011): PDCA applied to startups, focused on *pivot or persevere*.
- **Post-Launch Review** (Stage-Gate): final gate that measures outcomes against the Success Criteria defined in the RP.

**Sources.**

- [Build-Measure-Learn — Verticode Insights](https://www.verticode.co.uk/blog/build-measure-learn-feedback-loop)
- [Lean Startup Methodology — Stratrix](https://www.stratrix.com/learn/frameworks/lean-startup-methodology)

---

## § 5. CTO/PO as managed bottleneck → Theory of Constraints (Goldratt)

See [README › The translation layer: CTO + PO](./README.md#the-translation-layer-cto--po). The text acknowledges: "without an intake layer before the CTO/PO, the CTO becomes the bottleneck." This is the starting point of the Theory of Constraints, formulated by Eliyahu M. Goldratt in *The Goal* (1984).

The five focusing steps:

1. Identify the bottleneck (CTO/PO).
2. Exploit — the Intake Layer exists to extract efficiency from it.
3. Subordinate — the other roles (PM, TL, Eng) work in service of its output; the **PRD** — the fusion of the Readiness Package (PO) with the Technical Assessment (CTO) — is the output that governs the downstream pace.
4. Elevate — when saturated, add Product Ops, Chief of Staff, or Founder Associate (already anticipated in `README.md`).
5. Repeat — after elevating, the bottleneck shifts; repeat the cycle.

Modern literature (DZone, Splunk, Pragmatic Engineer) shows that ToC applies to software development, not just manufacturing.

**Sources.**

- [Theory of Constraints — Wikipedia](https://en.wikipedia.org/wiki/Theory_of_constraints)
- [The Theory of Constraints — Splunk](https://www.splunk.com/en_us/blog/learn/theory-of-constraints.html)
- [Applying Theory of Constraints to Software Development — DZone](https://dzone.com/articles/apply-theory-constraints-software-development-bottlenecks)
- [The Pragmatic Engineer's Guide to the Theory of Constraints](https://www.morethanmonkeys.co.uk/article/the-pragmatic-engineers-guide-to-the-theory-of-constraints/)

---

## § 6. Flow management and WIP → Reinertsen (Product Development Flow)

Donald G. Reinertsen (*The Principles of Product Development Flow*, 2009) is the most rigorous reference on queue theory applied to product development. The book assembles 175 principles across eight areas: economic decisions, queue management, batch reduction, WIP constraints, accelerated feedback, flow under variability, and decentralized control.

In this project:

- WIP limits in the Intake — the PO's capacity needs to be visible and respected.
- Visualization of invisible queues — the [stateDiagram in README › 9. States of a demand](./README.md#9-states-of-a-demand) makes states explicit (`Captured → InTriage → Discovery → ProductReady…`) that would otherwise remain hidden.
- Small batch size — each demand moves through individually, not in an annual batch.

The Reinertsen quote that best summarizes the book: *"Queues are the most important factor in maintaining optimal product development flow, and product development queues are more insidious because they tend to be invisible."*

Reinertsen is critical of rigid gates because they block flow and create queues. That is why this model needs lead-time metrics in the Intake to avoid falling into that trap. See `03-slas.md` and section 8 below.

**Sources.**

- [The Principles of Product Development Flow — Reinertsen (Amazon)](https://www.amazon.com/Principles-Product-Development-Flow-Generation/dp/1935401009)
- [The 175 flow principles — Systems Engineering Trends](https://www.se-trends.de/en/the-175-flow-principles-why-product-development-is-often-slower-than-necessary/)
- [Principles of Product Development Flow — BPTrends](https://bptrends.info/principles-of-product-development-flow-second-generation-lean-product-development-by-donald-g-reinertsten/)

---

## § 7. Role structure → Team Topologies

See [README › 1. The three layers](./README.md#1-the-three-layers) and [README › 7. Responsibility matrix](./README.md#7-responsibility-matrix).

Matthew Skelton & Manuel Pais (*Team Topologies*, 2019) name the downstream roles:

- Stream-aligned team — the downstream (PM, TLs, Engineers, and QA) delivers an end-to-end value stream. Typical: 5 to 9 engineers owning the full cycle (design, build, deploy, operate, support).
- Enabling team — CTO and PO act as enablers: they do not execute; they empower, remove friction, and transfer context.
- Cognitive load — the Readiness Package reduces the cognitive load of the execution team. The downstream does not need to "discover the problem": it receives it consolidated.

The modern reading of Conway's Law: software structure mirrors the organization's communication structure. That is why organizational design flows from the value stream, not from technical components.

**Sources.**

- [Team Topologies — official site](https://teamtopologies.com/)
- [Team Topologies — Martin Fowler](https://martinfowler.com/bliki/TeamTopologies.html)
- [Team Topologies — Atlassian](https://www.atlassian.com/devops/frameworks/team-topologies)

---

## § 8. Commitment point (RP→PRD) ≠ Definition of Ready → Scrum + SAFe + Upstream Kanban

See [README › 4. What the intake produces — Readiness Package](./README.md#4-what-the-intake-produces--readiness-package) and [README › 10. Golden rules of intake](./README.md#10-golden-rules-of-intake) (rule 4: "GATE DISCIPLINE").

**The RP freeze is the *commitment point*, not the Definition of Ready.** This was the error the project corrected: treating "RP Frozen" as the DoR. These are different things at different points in the chain:

- **Commitment point** (Upstream/Discovery Kanban — Anderson, Leopold) = the line separating "discovery" (uncertain, optional, disposable) from "delivery" (committed, with deadline, with SLA). Before the line: options. After the line: commitments. **Freezing the RP and merging it into the PRD is that line** — and the *gate deliverable* of Stage-Gate (Cooper). It is the **end of the PO's arc**, not readiness to code.
- **Definition of Ready** (*"Ready for Development"*) = lives **downstream**, several steps after the commitment point: when Tech Leads have already written and estimated epics, stories, and tasks (INVEST; "*ready for development*" / *Story Ready* in SAFe) and **no step remains before coding**. Requires decomposition and estimation by the delivery team. **Writing epics and stories is downstream, outside the PO's scope.**
- **Definition of Done** = further still: increment delivered + quality criteria satisfied. Distinct from the DoR.

In one line: triage = *"is it worth the effort?"* (Stage-Gate gate decision) · commitment point (RP→PRD) = *"we are committing to build"* · DoR = *"ready to code"* · DoD = *"code complete"*.

Mike Cohn (Mountain Goat Software) warns that the DoR can degenerate into a waiting-and-approval mechanism that reduces agility. That is why this project defines explicit SLAs in `03-slas.md`: no gate — not the RP freeze, not the downstream DoR — can become indefinite bureaucracy.

**Sources.**

- [Definition of Ready — Atlassian](https://www.atlassian.com/agile/project-management/definition-of-ready)
- [Definition of Ready — Scrum Inc.](https://www.scruminc.com/definition-of-ready/)
- [The Definition of Ready and Its Dangers — Mountain Goat Software](https://www.mountaingoatsoftware.com/blog/the-dangers-of-a-definition-of-ready)
- [What does it mean to be "Feature Ready"? — Ivar Jacobson International](https://www.ivarjacobson.com/preparation-for-pi-planning/agile-product-management-what-is-feature-ready)
- [Ready or Not? Demystifying the Definition of Ready in Scrum — Scrum.org](https://www.scrum.org/resources/blog/ready-or-not-demystifying-definition-ready-scrum)
- [Upstream Kanban: The 5-Step Process — Nave](https://getnave.com/blog/upstream-kanban/)
- [Discovery Kanban — Aktia Solutions](https://aktiasolutions.com/discovery-kanban-upstream-kanban/)

---

## § 9. Product Operations → Perri & Tilles, Cagan

Melissa Perri & Denise Tilles (*Product Operations*, 2023) and Marty Cagan (SVPG) describe Product Ops as a function operating across four pillars:

1. Data — analytical infrastructure for the PO/PM.
2. User understanding — operationalizes continuous research.
3. Team ownership — process and tooling governance.
4. Cross-departmental communication — what the Intake Layer does in this project.

The "Intake / Product Operations" function described in [README › The translation layer: CTO + PO](./README.md#the-translation-layer-cto--po) is pillar 4. As volume grows, it can evolve into a dedicated Product Ops team.

**Sources.**

- [Product Ops Overview — SVPG (Cagan)](https://www.svpg.com/product-ops-overview/)
- [Product Operations — Melissa Perri & Denise Tilles (Amazon)](https://www.amazon.com/Product-Operations-successful-companies-products/dp/B0CK3HL4WF)
- [Good Product Ops, Bad Product Ops — Dragonboat](https://dragonboat.io/blog/good-product-ops-bad-product-ops/)
- [7 Habits of Highly Effective Product Operations — Mind the Product](https://www.mindtheproduct.com/7-habits-of-highly-effective-product-ops/)

---

## § 10. Lean Software Development → Poppendieck

Mary & Tom Poppendieck (*Lean Software Development*, 2003) translated the Toyota Production System into software. The seven principles and seven wastes underpin the Intake design.

Seven principles:

1. Eliminate waste
2. Amplify learning
3. Decide as late as possible
4. Deliver as fast as possible
5. Build integrity in
6. Respect people / engage everyone's intelligence
7. Optimize the whole

Seven wastes in software:

| Waste | How the Intake Layer combats it |
|---|---|
| Partial work | RP requires its blocking sections resolved (`freezeReady`) before advancing |
| Extra features | "Problem before solution" eliminates speculative features |
| Relearning | Consolidated context prevents downstream from "rediscovering" |
| Handoffs | RP transfers complete, unfragmented context |
| Task switching | WIP limits on the PO prevent multitasking |
| Delays | Explicit SLAs attack wait times |
| Defects | Acceptance criteria in the RP prevent rework |

**Sources.**

- [The 7 Principles of Lean Software Development — NetSolutions](https://www.netsolutions.com/insights/7-principles-of-lean-software-development/)
- [Lean Software Development — Wikipedia](https://en.wikipedia.org/wiki/Lean_software_development)
- [7 Wastes of Software Development — Medium (Milan Milanovic)](https://medium.com/@techworldwithmilan/7-wastes-of-software-development-8febe264c5a8)

---

## § 11. First-class confidence, Readiness Score, and RICE-lite

> This section anchors the mechanics introduced by the Submitter persona mapping ([`personas/01-submitter.md`](./personas/01-submitter.md)) and the intake template ([`templates/00-submitter-brief.md`](./templates/00-submitter-brief.md)), and generalized in [`metrics.md`](./metrics.md). These were learned through prototyping and mature the model described above — they do not replace it.

### 11.1 Readiness Score → intake completeness gate + Stage-Gate gate decision

The Readiness Score is the *quantitative* version of the **intake completeness gate** (the `Captured → InTriage` transition) — it is **not** the Definition of Ready, which lives downstream (§8). Rather than a subjective "ready / not ready," each compliance requirement has a weight and a status; the score is a function of those weights, and `low_confidence` counts as partial. A demand only leaves the Intake and reaches the PO when `gateReady = true` (every blocking requirement resolved by an honest disposition) — meaning it is complete enough to be **triaged**, not ready to code. This directly answers the "gate becomes a waiting mechanism" critique (Critique 2): the gate is an objective rubric, not a committee approval.

### 11.2 Per-field confidence + dispositions → Assumption Mapping + Validated Learning

Classic RICE treats "confidence" as a single generic number. Here it is **per field and per indicator** (`confidence / source / status / hint`) — the honesty layer that travels with the artifact. **Dispositions** (`answered · inferred · assumption · discovery · deferred`) operationalize the principle that an explicit assumption is better than false certainty:

- `assumption` is exactly the *assumption mapping* of Bland & Osterwalder (*Testing Business Ideas*) and the *assumption tests* of Torres's Opportunity Solution Tree (§3.2);
- time-boxed `discovery` is Ries's *validated learning* (§3.1) — "we don't know yet, and this is the plan to find out" is a valid form of readiness;
- the confidence graduation enacts Poppendieck's *delay commitment* (§3.3) at the field level, not just at the gate level.

### 11.3 Value indicators (RICE-lite) → RICE scoring (Intercom)

The Impact / Reach / Urgency indicators are a lean version of RICE (Reach, Impact, Confidence, Effort), created by Sean McBride at Intercom. Two conscious adaptations:

- **Confidence is not re-scored** as in the original RICE — it reuses the confidence layer from §11.2, avoiding duplication;
- **Effort stays *soft*** (the Submitter's rough estimate, confirmed later by the CTO), because the boundary persona is non-technical.

The crucial point: RICE-lite is **not** used as an automatic ranking formula. It is a mirror that challenges thinking — the tension between indicators (e.g., high Impact + low confidence) is a provocation, not a prioritization number. This preserves Reinertsen's principle (§6) that economic decisions are contextual, not mechanical.

**Sources.**

- [RICE Scoring Model — Intercom (Sean McBride)](https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/)
- [Testing Business Ideas — Bland & Osterwalder (Strategyzer)](https://www.strategyzer.com/library/testing-business-ideas)
- [Assumptions Mapping — Product Talk (Teresa Torres)](https://www.producttalk.org/2021/06/assumption-testing/)

---

## Honest Critiques and Mitigations

Every structural choice involves trade-offs. It is worth anticipating the most common critiques.

### Critique 1: "Stage-Gate is heavy and bureaucratic"

The classic 1986 version can be. Cooper evolved it into Next Generation Stage-Gate (adaptive, with fuzzy gates).

Mitigation in this project: the Readiness Package has fixed deliverables and clear SLAs (`03-slas.md`). Gates are evidence reviews, not committees.

### Critique 2: "Definition of Ready becomes a waiting mechanism"

Mike Cohn warns that the DoR can degenerate into "I can't start until approved."

Mitigation in this project: explicit SLAs per demand state and objective criteria (RP `freezeReady` gate) instead of subjective approval.

### Critique 3: "Gates create invisible queues"

Reinertsen shows that gates block flow when WIP is not managed.

Mitigation in this project: explicit states (`stateDiagram-v2` in `README.md`) make queues visible. Next step: instrument lead time per state.

### Critique 4: "Dual-Track Agile became an anti-pattern at SVPG itself"

Cagan dropped the term because it became a conversation about process.

Mitigation in this project: adopt the current terminology — Continuous Discovery / Continuous Delivery — in external communication and onboarding.

### Critique 5: "Model is too heavy for a small startup"

The real weight is in doing it poorly, not in doing it. The rework cost of a poorly specified feature is higher than the cost of the Intake.

Mitigation in this project: the Intake can start lean (CTO and PO accumulating the role) and grow into Product Ops when volume justifies it — as described in `README.md`.

---

## Recommended Bibliography

### Books (chronological order)

- **Goldratt, E. M.** (1984). *The Goal: A Process of Ongoing Improvement*. North River Press.
- **Cooper, R. G.** (1986/2017). *Winning at New Products: Creating Value Through Innovation* (5th ed.). Basic Books.
- **Poppendieck, M., & Poppendieck, T.** (2003). *Lean Software Development: An Agile Toolkit*. Addison-Wesley.
- **Cagan, M.** (2008/2017). *INSPIRED: How to Create Tech Products Customers Love* (2nd ed.). Wiley.
- **Reinertsen, D. G.** (2009). *The Principles of Product Development Flow: Second Generation Lean Product Development*. Celeritas Publishing.
- **Anderson, D. J.** (2010). *Kanban: Successful Evolutionary Change for Your Technology Business*. Blue Hole Press.
- **Ries, E.** (2011). *The Lean Startup: How Today's Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses*. Crown Business.
- **McBride, S., et al.** (2016). *Intercom on Product Management*. Intercom Inc. (origin of the RICE model).
- **Leopold, K.** (2017). *Practical Kanban: From Team Focus to Creating Value*. LEANability Press.
- **Perri, M.** (2018). *Escaping the Build Trap: How Effective Product Management Creates Real Value*. O'Reilly.
- **Bland, D. J., & Osterwalder, A.** (2019). *Testing Business Ideas*. Wiley / Strategyzer.
- **Skelton, M., & Pais, M.** (2019). *Team Topologies: Organizing Business and Technology Teams for Fast Flow*. IT Revolution Press.
- **Torres, T.** (2021). *Continuous Discovery Habits: Discover Products That Create Customer Value and Business Value*. Product Talk LLC.
- **Perri, M., & Tilles, D.** (2023). *Product Operations: How Successful Companies Build Better Products at Scale*. Product Institute.

> **Extension — template evolution** (detail and verified online sources in [`templates/references-evolucao.md`](./templates/references-evolucao.md)):
> - **Feathers, M.** (2004). *Working Effectively with Legacy Code*. Prentice Hall. *(brownfield reasoning.)*
> - **Kalbach, J.** (2016). *Mapping Experiences*. O'Reilly. *(journey maps + service blueprints.)*
> - **Brown, S.** (2018). *Software Architecture for Developers* (C4 model). Leanpub.
> - **Starke, G., & Hruschka, P.** — *arc42* (architecture documentation template).

### Standards and Norms

- **PMI** (2021). *A Guide to the Project Management Body of Knowledge (PMBOK Guide)* — 7th edition.
- **ISO** (2018). *ISO 31000:2018 — Risk management — Guidelines*.
- **ISO/IEC** (2011/2023). *ISO/IEC 25010 — Systems and software Quality Requirements and Evaluation (SQuaRE)*. *(quality dimensions / NFRs.)*
- **Mavin, A., et al.** (2009). *Easy Approach to Requirements Syntax (EARS)*. IEEE RE'09, pp. 317–322.
- **Nygard, M.** (2011). *Documenting Architecture Decisions* (ADRs).

### Articles and Online Resources

- [Stage-Gate International — Knowledge Center](https://www.stage-gate.com)
- [Silicon Valley Product Group — Articles](https://www.svpg.com)
- [Product Talk — Teresa Torres](https://www.producttalk.org)
- [Team Topologies — Resources](https://teamtopologies.com)
- [Reinertsen & Associates](http://reinertsenassociates.com)

---

## Conclusion

This process is not a parallel invention to the literature. It is a synthesis of the most validated frameworks in software product management over the past 40 years. To put it in context:

- Cooper has an empirical study of 252 products across 123 companies.
- Lean Startup is taught at Stanford, Harvard Business School, and LSE.
- Team Topologies is adopted at ING, Spotify, Amazon, and Bosch.
- ToC is applied from manufacturing (Toyota, Boeing) to software (Microsoft, Atlassian).
- Continuous Discovery is the de facto standard in modern B2B SaaS products.

What this repository does is operationalize the intersection of these frameworks into an executable process, with concrete artifacts (`templates/`), clear roles (`01-roles.md`), documented interactions (`interactions/`), and measurable SLAs (`03-slas.md`).

When someone asks "does this follow any reference?", this document is the answer.
