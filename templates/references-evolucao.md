# References — Template Evolution (journey, greenfield/brownfield, knowledge base, enriched TA)

> **What this document is.** A reference base that **justifies the changes introduced in the templates** in this folder — so that when porting them to the original documentation repository, every decision has traceable grounding, following the same standard as [`../references.md`](../references.md). This file **extends** `references.md` (which anchors the original upstream→downstream process); here are only the anchors for the additions.
>
> **Changes covered.** (1) **Greenfield vs. brownfield** classification at triage; (2) **End-to-end user journey** in the Readiness Package (Section 6.5); (3) **Persistent technical knowledge base** (`tech-landscape.md`); (4) **Technical Assessment beyond architecture** (NFR feasibility, alternatives considered, build vs. buy, testability/observability); (5) the meta-justification of the **AI era** (Spec-Driven Development and *context engineering*); (6) **EARS** as support for testable criteria.
>
> **Principle that runs through all of them.** The upstream must carry **sufficient context for implementation decisions** — because the execution layer (a newly onboarded engineer or an AI agent) **has no implicit knowledge of the source code**. Every addition closes a gap in that context, maintaining the repo's rule: *"the contract is a ceiling, not a floor."*

---

## Why these changes, now

The original process (see [`../references.md`](../references.md)) was already solid on **governance** (Stage-Gate), **discovery** (Continuous Discovery), **flow** (Reinertsen), and **roles** (Team Topologies). What a template audit revealed were gaps in the **technical-product terrain** that the definition delivers to the downstream:

- the end-to-end journey existed only in the downstream Product Backlog, not in the upstream product definition;
- the Technical Assessment was almost purely architecture, without the landscape an implementer needs;
- there was no distinction between **building new software** and **modifying existing software** — opposite decisions;
- there was no concept of a **prior knowledge base** of the system, which may or may not exist.

These four gaps are exactly the ones that the 2024–2026 literature on **AI-assisted development** made critical: without an explicit terrain, the agent (and the human) guesses. The anchors below support the closing of each one.

---

## Consolidated Mapping

| Template change | Where | Framework / Literature | Canonical source |
|---|---|---|---|
| Greenfield vs. Brownfield classification | `01-intake-record` · `03-technical-assessment` | Greenfield/brownfield tracks; brownfield field studies | BMAD Method (2024–25); Feathers, *Working Effectively with Legacy Code* (2004) |
| Document the system before changing it (brownfield path) | `03-technical-assessment` (Current state) | `document-project` / existing system analysis | BMAD *working-in-the-brownfield*; arc42 §3 (Context & Scope) |
| Define the foundation with criteria (greenfield path) | `03-technical-assessment` (Technical foundation) | Solution Strategy + Architecture Decisions | arc42 §4 and §9; Nygard, ADRs (2011) |
| End-to-end user journey | `02-readiness-package` §6.5 | Journey Mapping; Mapping Experiences | Nielsen Norman Group; Kalbach, *Mapping Experiences* (2016) |
| Optional service blueprint | `02-readiness-package` §6.5 | Service Blueprinting | Nielsen Norman Group; Bitner et al. (2008) |
| Persistent technical knowledge base | `tech-landscape.md` (new) | *Steering docs* / persistent context; `project-context` | Kiro (AWS); BMAD Method |
| TA: NFR feasibility (mapped to RP §8) | `03-technical-assessment` | Quality requirements as scenarios | arc42 §10; ISO/IEC 25010 |
| TA: alternatives considered | `03-technical-assessment` · `04-prd` | Design Docs / RFC (alternatives considered) | Google Design Docs; Pragmatic Engineer (RFCs) |
| TA: build vs. buy | `03-technical-assessment` | Stage-Gate Scoping / Business Case | Cooper, *Winning at New Products* |
| TA: testability & observability | `03-technical-assessment` | Design for testability; observability | Google Design Docs; SRE practices |
| Context/container diagrams | `03-technical-assessment` · `tech-landscape` | C4 model (system context / landscape / container) | Simon Brown, c4model.com |
| Testable acceptance criteria for AI | (support for RP §7 / TA) | EARS — Easy Approach to Requirements Syntax | Mavin et al., IEEE RE 2009 |
| Meta: sufficient context for implementation decisions | entire chain → `04-prd` | Spec-Driven Development; Context Engineering | GitHub Spec Kit; Kiro; Thoughtworks (2025) |

---

## 1. Greenfield vs. Brownfield classification → distinct tracks

**What changed.** The Intake (`01`) now classifies the demand as **greenfield** (new software/module), **brownfield** (modifies existing), or **hybrid**; the Technical Assessment (`03`) forks into two paths from there.

**Why.** These are opposite forms of reasoning. Greenfield *decides* the foundation (there is no terrain to respect); brownfield *discovers and respects* what already exists — patterns, integrations, debt, regression risk. Treating them with the same template produces, in greenfield, unrecorded decisions and, in brownfield, changes that break the system due to ignorance of the existing state.

**Anchor.** The **BMAD Method** formalizes the distinction with separate tracks and templates: greenfield follows "project brief → PRD → architecture → dev" on a clean slate; brownfield requires **documenting the existing system first** (`document-project`), then `brownfield-prd` and `brownfield-architecture`, with attention to integration points and legacy constraints. The classic legacy code literature (Michael Feathers) and greenfield vs. brownfield engineering studies support that the first brownfield task is **understanding the existing system**, not coding.

**Sources.**
- [BMAD Method — Working in the Brownfield (GitHub)](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/docs/working-in-the-brownfield.md)
- [BMAD Method — Brownfield Development (DeepWiki)](https://deepwiki.com/bmad-code-org/BMAD-METHOD/4.9-brownfield-development)
- [BMAD Method — Established Projects](https://docs.bmad-method.org/how-to/established-projects/)
- [Brownfield vs. Greenfield Development in Software — Synoptek](https://synoptek.com/insights/it-blogs/greenfield-vs-brownfield-software-development/)

---

## 2. End-to-end user journey → Journey Mapping (RP §6.5)

**What changed.** The Readiness Package gains **Section 6.5 — End-to-end user journey(s)** (happy path + alternative paths + optional service blueprint), authored by the PO, positioned before User Stories — which now **derive** from it.

**Why.** A product definition needs a sense of what the user does **end to end**, not loose stories. Without the complete flow, the downstream (human or agent) cannot see the sequence it needs to implement, and edge cases are left orphaned. In the original model, "user journeys" lived only in the downstream Product Backlog — too late to inform the definition.

**Anchor.** The **Nielsen Norman Group** defines a journey map as "a visualization of the process a person goes through to accomplish a goal" — actor, scenario, expectations, phases, actions, emotions. The **service blueprint** is the "part two" of the journey map: it exposes people, evidence, and backstage processes linked to touchpoints — ideal when the experience is omnichannel or requires cross-functional effort (which is why we made it **optional**). Jim Kalbach (*Mapping Experiences*) is the canonical work that brings both techniques together as an alignment between business value and experience.

**Sources.**
- [Journey Mapping 101 — Nielsen Norman Group](https://www.nngroup.com/articles/journey-mapping-101/)
- [Service Blueprints: Definition — Nielsen Norman Group](https://www.nngroup.com/articles/service-blueprints-definition/)
- [When to Use Journey Maps vs Service Blueprints — Miro](https://miro.com/customer-journey-map/service-blueprint-vs-journey-map/)
- Kalbach, J. (2016). *Mapping Experiences*. O'Reilly.

---

## 3. Persistent technical knowledge base → Steering Docs / `document-project`

**What changed.** New template `tech-landscape.md`: a **persistent, per-system** document (not per demand) — product/domain, stack & tools, structure & conventions, integrations, constraints & debt, gaps. The Technical Assessment **references** it (brownfield) or **seeds** it (greenfield).

**Why.** It is the "prior knowledge base, which may or may not exist" that was missing. The execution layer has no implicit knowledge of the code; without a persistent place for that context, each demand **re-discovers** the system (the *relearning* waste from Lean Software Development — see [`../references.md` §10](../references.md)). When it does not exist, creating it becomes the first task (Discovery).

**Anchor.** **Kiro (AWS)** materializes exactly this with *steering docs*: `product.md` (purpose, users, features — the "why"), `tech.md` (stack, tools, constraints — the "with what"), and `structure.md` (organization, conventions — the "how"), included as persistent knowledge in every agent interaction. **BMAD** generates `project-context.md` to capture existing code patterns and conventions "to ensure AI agents follow established practices." It also connects to **Team Topologies** (reducing cognitive load of the execution team — see [`../references.md` §7](../references.md)) and to **arc42 §12** (domain glossary).

**Sources.**
- [Kiro — Steering Docs](https://kiro.dev/docs/steering/)
- [Master Kiro Steering Docs in Minutes — AWS Builder Center](https://builder.aws.com/content/32ocJQtMKLT0I8zUp3Kg8C3eAkJ/master-kiro-steering-docs-in-minutes)
- [BMAD Method — Working in the Brownfield (`document-project`, `project-context`)](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/docs/working-in-the-brownfield.md)

---

## 4. Technical Assessment beyond architecture → Design Docs + arc42 + C4

**What changed.** The TA (`03`) moves beyond near-architecture-only to also cover: **NFR feasibility** (mapped NFR-by-NFR to RP §8), **alternatives considered**, **build vs. buy**, **testability and observability**, plus context/container diagrams.

**Why.** An implementer (and an agent) decides from the *rationale*, not just the conclusion. "Why NOT alternative X" prevents downstream re-litigation; the feasibility of each NFR closes the product ↔ technical loop (an infeasible NFR is a veto, not a footnote); testability/observability make acceptance criteria verifiable and behavior monitorable.

**Anchor.**
- **Google Design Docs / RFCs** prescribe: context, goals/non-goals, proposed solution with diagrams, **alternatives considered**, risks — exactly the added sections.
- **arc42** provides the lenses: §3 Context & Scope (current state), §4 Solution Strategy (greenfield foundation), §9 Architecture Decisions (ADRs), §10 **Quality Requirements as scenarios** (NFR feasibility), §11 Risks & Technical Debt.
- **C4 model** (Simon Brown) provides diagram levels — *system context* and *container* suffice for most cases; *system landscape* for the panorama of an existing system.
- **ISO/IEC 25010** continues as the quality dimension checklist (already used in RP §8), now *answered* in the TA.
- **Stage-Gate** (Cooper) anchors **build vs. buy** as part of *scoping/business case* (see [`../references.md` §2](../references.md)).

**Sources.**
- [Design Docs at Google — Industrial Empathy](https://www.industrialempathy.com/posts/design-docs-at-google/)
- [Companies Using RFCs or Design Docs — The Pragmatic Engineer](https://blog.pragmaticengineer.com/rfcs-and-design-docs/)
- [arc42 — Overview](https://arc42.org/overview) · [arc42 Documentation](https://docs.arc42.org/home/)
- [C4 model](https://c4model.com/) · [System landscape diagram](https://c4model.com/diagrams/system-landscape)
- [Documenting Architecture Decisions — Michael Nygard (2011)](https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions) · [adr.github.io](https://adr.github.io/)

---

## 5. Meta-justification: the AI era → Spec-Driven Development and Context Engineering

**What sustains all of the above.** The practice that solidified in 2025–2026, **Spec-Driven Development (SDD)**, puts the specification at the center: `Specify → Plan → Tasks → Implement` (GitHub Spec Kit) / `Requirements → Design → Tasks` (Kiro). The premise: the agent only implements well if the spec carries **sufficient context for the decisions** — what Thoughtworks and the community call *context engineering* ("optimizing agent-LLM interaction," as opposed to *prompt engineering*).

**Why it matters for these templates.** The **PRD is the point where that context must be true**. The four additions (nature, journey, knowledge base, technical landscape) are, taken together, the *implementation context* that was missing — deliverable both to a human engineer unfamiliar with the code and to an agent. This does not replace the frameworks in `references.md`; it **operates on top of them**, making the output executable in the AI-assisted era.

**Sources.**
- [Spec-driven development with AI — GitHub Blog](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)
- [GitHub Spec Kit — Documentation](https://github.github.com/spec-kit/)
- [Understanding Spec-Driven Development: Kiro, spec-kit, Tessl — Martin Fowler](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
- [Spec-driven development: unpacking 2025's new engineering practices — Thoughtworks](https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/spec-driven-development-unpacking-2025-new-engineering-practices)
- [Diving Into Spec-Driven Development with Spec Kit — Microsoft for Developers](https://developer.microsoft.com/blog/spec-driven-development-spec-kit)

---

## 6. EARS → less ambiguous acceptance criteria (support for RP §7 and the TA)

**What it is.** **EARS (Easy Approach to Requirements Syntax)** — structural patterns (`Ubiquitous`, `Event-driven` "When…", `State-driven` "While…", `Optional` "Where…") in the format *"WHEN [condition], THE SYSTEM SHALL [behavior]"*. It does not replace the Given/When/Then in the RP, but is a useful reference: EARS requirements are easier to **decompose by AI agents** and to test, covering edge cases by construction. Kiro adopts EARS natively.

**Why cite it.** Justifies the emphasis, in the templates, on **verifiable and specific** criteria (not "should work well") — and provides a ready-made standard if the team wants to harden acceptance criteria for AI consumption.

**Sources.**
- [EARS — Official guide (Alistair Mavin)](https://alistairmavin.com/ears/)
- Mavin, A., Wilkinson, P., Harwood, A., Novak, M. (2009). *Easy Approach to Requirements Syntax (EARS)*. 17th IEEE International Requirements Engineering Conference (RE'09), pp. 317–322. [University of Manchester Research](https://research.manchester.ac.uk/en/publications/easy-approach-to-requirements-syntax-ears/)
- [Adopting EARS Notation — Jama Software](https://www.jamasoftware.com/requirements-management-guide/writing-requirements/adopting-the-ears-notation-to-improve-requirements-engineering/)

---

## Honest critiques and mitigations

Maintaining the honesty standard of [`../references.md`](../references.md):

### Critique 1: "More sections = more bureaucracy upstream"
Additions can inflate what the repo deliberately kept lean.
**Mitigation:** every new section is **conditional** (greenfield *or* brownfield) and has an explicit **compression rule**; follows the principle "contract is a ceiling, not a floor." A small journey is 3–5 steps; the service blueprint is optional; the KB can be an honest *stub*.

### Critique 2: "Referencing BMAD/Kiro/Spec-Kit anchors tools, not theory"
These are products and may change.
**Mitigation:** the tools are *instances* of older principles — Stage-Gate scoping, Lean (relearning/handoffs), Team Topologies (cognitive load), arc42, C4, Nygard's ADRs, NN/g journey mapping. The document cites both layers; if the tool disappears, the theoretical anchor remains.

### Critique 3: "The knowledge base becomes documentation that rots"
Stale docs mislead more than absence.
**Mitigation:** the `tech-landscape` has an **Update History** and **Section 6 — KB Gaps** (honest about what is not yet documented, same logic as process *dispositions*); each demand that touches the terrain updates the file. It is a **living** document, not a one-shot.

### Critique 4: "Greenfield/brownfield is too binary"
Real systems are hybrid.
**Mitigation:** the classification explicitly includes **Hybrid** (new module within an existing system), with a "Both" path in the TA.

---

## Bibliography

### Books
- **Feathers, M.** (2004). *Working Effectively with Legacy Code*. Prentice Hall. *(foundation of brownfield reasoning: understand before changing.)*
- **Kalbach, J.** (2016). *Mapping Experiences: A Complete Guide to Creating Value through Journeys, Blueprints, and Diagrams*. O'Reilly.
- **Brown, S.** (2018). *Software Architecture for Developers* (C4 model). Leanpub.
- **Starke, G., & Hruschka, P.** — *arc42* (architecture template and documentation).
- *(Complement the bibliography in [`../references.md`](../references.md): Cooper, Poppendieck, Skelton & Pais, Cagan, Torres, Reinertsen.)*

### Papers and Standards
- **Mavin, A., et al.** (2009). *Easy Approach to Requirements Syntax (EARS)*. IEEE RE'09, pp. 317–322.
- **Nygard, M.** (2011). *Documenting Architecture Decisions*.
- **ISO/IEC 25010** — *Systems and software Quality Requirements and Evaluation (SQuaRE)*.

### Online resources (verified)
- BMAD Method — [working-in-the-brownfield](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/docs/working-in-the-brownfield.md) · [established-projects](https://docs.bmad-method.org/how-to/established-projects/)
- Kiro — [Steering Docs](https://kiro.dev/docs/steering/)
- GitHub — [Spec Kit](https://github.github.com/spec-kit/) · [Spec-driven development (blog)](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)
- Thoughtworks — [Spec-driven development (2025)](https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/spec-driven-development-unpacking-2025-new-engineering-practices)
- Nielsen Norman Group — [Journey Mapping 101](https://www.nngroup.com/articles/journey-mapping-101/) · [Service Blueprints: Definition](https://www.nngroup.com/articles/service-blueprints-definition/)
- arc42 — [arc42.org](https://arc42.org/overview) · C4 — [c4model.com](https://c4model.com/) · ADRs — [adr.github.io](https://adr.github.io/)
- Google Design Docs — [Industrial Empathy](https://www.industrialempathy.com/posts/design-docs-at-google/) · RFCs — [The Pragmatic Engineer](https://blog.pragmaticengineer.com/rfcs-and-design-docs/)

---

## How to use when porting to the original repository

1. **Bring this file along** with the templates — it is the defense of the changes when someone asks "why did this come in?".
2. **Merge with the original `references.md`**: the anchors here are **additive**. Suggested new rows in the *Consolidated Mapping* of that file — Journey (NN/g), Greenfield/Brownfield (BMAD/Feathers), Knowledge Base (Kiro/BMAD), enriched TA (arc42/C4/Design Docs), SDD/Context Engineering (Spec Kit/Thoughtworks).
3. **Reconcile the role boundary**: record that the **end-to-end product journey belongs to the PO (in the RP)**; detailed UX flows remain downstream (Product Backlog). This does not conflict with "the PM does not write journeys" — it merely makes explicit who writes which journey.
4. **Update diagrams/tables** in the process README to include the classification, the journey, and the `tech-landscape` support artifact.
