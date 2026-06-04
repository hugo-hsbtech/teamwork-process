# Persona: Submitter (Demand Originator)

> First document in the persona series. Maps a persona end to end: who she is, how she reasons, what she does, what she delivers — and the **data structure** that makes that reasoning operable on screen.

---

## Purpose of this document

The current documents ([`01-roles.md`](../01-roles.md), [`interactions/`](../interactions/), [`templates/00-submitter-brief.md`](../templates/00-submitter-brief.md)) define the Submitter in a **fragmented** way: her boundaries are in the roles doc, her handoff in the interactions, and the shape of her deliverable in the template. No single place brings this together into a unified persona view.

Additionally, the [prototypes](../prototypes/) — built by learning directly from the persona — encoded knowledge that the documents **do not yet have**: a per-field trust model, a readiness score as a quantitative gate, value indicators, and portfolio metrics.

This document **consolidates both sources** and assumes the docs are immature relative to what we have learned. It is simultaneously:

- **Documentation** of the persona (evolves existing docs);
- **Specification** of the abstraction that should become screen value.

The principle that runs through everything: **confidence is first class.** Every piece of information carries how solid it is and where it came from.

---

## 1. Who the Submitter is

The Submitter is the **boundary persona** — the only one whose face points outward, toward customers, end users, and the market. Her native language is **problem, value, opportunity, relationship** — not feature, not architecture.

She sells, delights, and creates the bond between company and customer. She knows (or tries to discover) pains, ideas, market conditions, and opportunities. She cares about **business value**.

> **Central design constraint:** she is not technical, not a product developer. She wants the work done and what she asked for, delivered.

This means **we cannot ask her to think like an engineer.** The model must meet her in her own language and do the translation *for* her — extracting enough structure for the demand to succeed downstream.

In the prototype example she is Hugo Seabra, COO. In real life, she can be any upstream origin: CEO/COO, Sales, Marketing, or CS. **"Submitter" is the generic abstraction** of those roles (defined individually in [`01-roles.md`](../01-roles.md)).

---

## 2. The two lenses of every demand

Every demand is read through **two lenses simultaneously**. They coexist — neither replaces the other.

| Lens | Nature | What it is | How it appears on screen |
|---|---|---|---|
| **Contract** | Deterministic · shared by all demands | The fixed set of **compliance requirements** a demand must satisfy to be "ready to advance" | **Readiness** — how close, what is missing, what is weak (score + pending items) |
| **Semantic** | Contextual · unique per demand | What *this specific* demand **means**: the real pain beneath the request, its type, its value thesis, its unknowns | **Meaning** — the demand reflected back to her, in her language, so she sees the system *understood* her, not just evaluated her |

The contract is the same for a payment gateway and a SAP integration. The semantics are completely different.

> **The ToDo list lives exactly where the two lenses meet:** "given what *this* demand means, what does the contract still need?" That is why ToDos regenerate — not because the contract changed (it never changes), but because the **semantic reading** of the demand became sharper.

---

## 3. The trust model (core)

Confidence is the axis that sustains everything else. Every captured piece of information — whether an answer to a requirement or a value indicator — carries:

| Attribute | Meaning |
|---|---|
| `confidence` | 0–100 — how solid the information is |
| `source` | where it came from (e.g.: "PDF p.4", "Submitter direct", "inferred", "assumption") |
| `status` | `empty` · `low_confidence` · `resolved` |
| `hint` | *why* the confidence is low / what would raise it |

This is the **honesty layer**: downstream does not just receive answers, it receives **confidence-graded** answers, knowing what is firm and what needs Discovery. The `hint` is what transforms "it's weak" into "it's weak *because of this*, and *this* would fix it".

> Classic RICE treats "confidence" as a single generic number. Here it is **per field and per indicator** — that granularity is the main new contribution the prototype taught us.

---

## 4. Data structure — deterministic in form, non-deterministic in content

The guiding phrase: **the structure is fixed; the content varies.** The data model is known in advance; what fills each field (and which ToDos emerge) is generated from the content of each demand.

```
ComplianceRequirement   (DETERMINISTIC — the fixed contract)
  id                stable key
  label             "Quantified business impact"
  dimension         Problem | Reach | Impact | Constraints | Stakeholders | Evidence | …
  why               why readiness requires this
  satisfiedWhen     rubric: what is "good enough" (guides AI judgment)
  weight            contribution to readiness score
  blocksGate        true = cannot advance until resolved

SubmissionEntry         (NON-DETERMINISTIC content, deterministic envelope)
  requirementId     → which requirement this entry answers
  content           free text, in her language
  confidence        0–100, evaluated against satisfiedWhen
  source            origin of the information
  status            empty | low_confidence | resolved
  hint              why it is weak / what would raise it
  disposition       answered | inferred | assumption | discovery | deferred   (see §6)

ValueIndicator          (RICE-lite — the mirror, see §7)
  id                impact | reach | urgency
  score             low | medium | high  (or 1–3)
  confidence        0–100  (reuses the confidence layer — does not duplicate)
  rationale         why she scored it that way

— DERIVED, regenerated on every change (the engine, not stored truth) —
  todos[]           = requirements whose status ≠ resolved   ← the dynamic guide
  readinessScore    = f(weights, statuses)  (low_confidence counts as partial)
  gateReady         = all requirements with blocksGate are resolved
```

The clean line: **`ComplianceRequirement` is the deterministic contract; everything below `SubmissionEntry.content` is generated; `todos`/`readinessScore`/`gateReady` are pure functions of what is above.** This same engine is reusable for *each* future persona (each has its own set of requirements, same engine).

---

## 5. Compliance requirements — the Submitter's contract

Fixed set derived from [`00-submitter-brief.md`](../templates/00-submitter-brief.md) and the capture pending items from the prototype. Each requirement has a dimension, a reason, and a rubric for what satisfies it. `blocksGate` marks what prevents advancement.

| # | Requirement (`label`) | Dimension | Satisfied when… | Blocks gate? |
|---|---|---|---|---|
| 1 | Problem statement (not the solution) | Problem | The pain is described without proposing an implementation | ✅ |
| 2 | Originator and context | Evidence | Who raised it and in what situation is clear | ✅ |
| 3 | Who is impacted | Reach | Affected personas/segments are named | ✅ |
| 4 | Business impact | Impact | Value described (revenue, retention, hours, risk) — quantified when possible | ✅ |
| 5 | Urgency and why | Impact | "Why now" and the cost of waiting are clear | — |
| 6 | Evidence / prior documents | Evidence | Attachments or conversations that support the demand | — |
| 7 | Known constraints | Constraints | Deadline, regulatory, budget flagged (or "none known") | — |
| 8 | Stakeholders | Stakeholders | Who needs to be informed / decide is named | — |

> **Golden rule inherited from the model:** if the record contains a proposed solution instead of a problem, requirement 1 is not satisfied and the demand is returned for reformulation (see [`README.md` › Upstream rule](../README.md#upstream-rule)).

The content of each requirement is non-deterministic (varies by demand). The **existence and shape** of the requirements is deterministic.

---

## 6. The questions that guide the "deep dive"

The unit of work is **the question**. Each question:

- targets a compliance requirement **and/or** a semantic gap in this demand;
- is asked in **business language** (customers, value, pain, money — never "what is the data model");
- exists to **raise readiness**, progressively — the "deep dive" deepens as answers reveal where the substance (or the fog) lies.

### "I don't know" is not a dead end — it is a structured disposition

Because she is a business person and may genuinely not have the answer, a requirement does not have just two states (answered / missing). It has **several paths to "resolved enough to advance"**, each with its own confidence and origin (`SubmissionEntry.disposition`):

| Disposition | What it means | Effect on readiness |
|---|---|---|
| `answered` | She answers directly | full confidence |
| `inferred` | System extracts from her artifacts (attached PDF/deck) | partial confidence + `source` recorded |
| `assumption` | "We are assuming 40% opt-in" | counts, but marked *to be validated* |
| `discovery` | "No one knows yet — here is how we will find out" | counts as *resolved-as-unknown*, time-boxed |
| `deferred` | Another stakeholder owns the answer | counts, with an owner attached |

> The gate is **not** "she knows everything". The gate is **"every requirement has an honest disposition"**. "We don't know yet, and this is the plan to find out" is a perfectly valid way to reach readiness — it is exactly what the **Discovery Brief** and the **Assumptions** in the template already encode.

This is what keeps the screen as a **brainstorming partner**: it never says "you are missing this". It says *"help me understand X — or, if you're not sure, we can assume it, or send it to Discovery?"* The system carries the burden of transforming the fog of business language into a structured, confidence-graded disposition.

---

## 7. Indicators (RICE-lite) — the mirror that challenges thinking

This is not RICE-as-formula (Reach × Impact × Confidence ÷ Effort → a ranking number). It is **a handful of business indicators, each with a lightweight score, used as a mirror to challenge reasoning** — not to prioritize automatically.

She scores each one simply (Low / Medium / High, or 1–3). She **provides the information**, and the score is just a trigger for reasoning:

| Indicator | Her question, in her language | Note |
|---|---|---|
| **Impact** | "How much does this move the business?" (revenue, retention, operating hours) | the value thesis |
| **Reach** | "How many customers / users / segments feel this?" | reach |
| **Urgency** | "Why now — and what happens if we wait?" | time sensitivity |
| ~~Confidence~~ | *already covered* | it is the confidence layer we already have — not added again |
| **Effort** | *(left soft / deferred)* | she is not technical; firms up later with the CTO. She can give a rough guess, marked `low_confidence` |

### The "challenge thinking" mechanism

The value is not in the scores themselves — it is in the **tension between them**, displayed on screen as a gentle provocation:

- **High impact + low confidence** → *"You see big value here — what evidence would make you confident?"*
- **High urgency + low impact** → *"Seems urgent — is it really now, or just noisy?"*
- **High reach + thin per-user impact** → *"Many people, small effect on each — is that the real gain?"*

Each challenge that sharpens an answer **also raises readiness** — mirror and gate pull in the same direction. Confidence (§3) is what makes the tension visible: it is the coordinate that crosses with each indicator.

---

## 8. How she is measured — portfolio view

The prototype gave the Submitter a dashboard the docs never imagined. These metrics *are* how she reasons about her own work:

| Metric | What it says | Origin |
|---|---|---|
| **Annual impact** ($/year per demand) | She thinks in money | prototype drill-down |
| **Demand → RP conversion rate** (e.g.: 64%) | How many of her demands survive the gate | prototype KPI |
| **Lead time submission → frozen** (e.g.: 8.5 days) | How quickly her input is rationalized | prototype KPI |
| **First-version acceptance** (e.g.: 78%) | Quality of *her raw material* (the RP was accepted on the first try) | prototype KPI |

> **Silent insight:** "first-version acceptance" is a *quality score about the Submitter herself* — it tells whether she is feeding the machine well, without requiring her to be technical.

---

## 9. The deliverable and the handoff

- **Deliverable:** the **Submitter Brief** — see [`templates/00-submitter-brief.md`](../templates/00-submitter-brief.md). It is the capture, frozen at handoff. The PO formalizes it and assigns the official ID `INT-YYYY-NNN` at triage, producing the [`01 Intake Record`](../templates/01-intake-record.md).
- **Gate:** the demand only exits when `gateReady = true` (all `blocksGate` requirements resolved). The **Readiness Score** is the quantitative version of the Stage-Gate gate decision (see [`references.md` § 2](../references.md)).
- **Handoff:** delivered to the **PO** (Intake layer). The handoff is only complete when "the Intake Layer has confirmed receipt" (see [`interactions/01-sales-to-po.md`](../interactions/01-sales-to-po.md)).

---

## 10. Screen value

The screen should **not** feel like a form being validated. It should feel like the system **understood the demand** and is brainstorming it with her.

- The **contract lens** renders as *readiness*: how close I am, what is missing, what is weak.
- The **semantic lens** renders as *meaning*: here is what this demand **is** — its problem, its value, its shape — reflected in her language, so she sees the system *understood* her, not just evaluated her.

---

## 11. What the prototype taught us (and the docs did not yet have)

1. **Per-field confidence** (`confidence/source/status/hint`) — the honesty layer.
2. **Readiness Score** — the Stage-Gate gate turned into a number with a rule (`low_confidence` counts as partial; 100% to advance).
3. **AI pre-fill** — the system extracts from her artifacts and only asks about gaps ("I read your document, identified 5 pieces of info, 3 pending items remain").
4. **Value indicators + tensions** (RICE-lite) — the mirror that challenges thinking.
5. **Portfolio metrics** — including "first-version acceptance" as a quality score for the persona itself.

---

## 12. Relation to existing documents

| Document | Relation |
|---|---|
| [`01-roles.md`](../01-roles.md) | Defines the individual upstream roles (CEO, Sales, Marketing, CS). This doc **abstracts** them into the generic Submitter persona. |
| [`templates/00-submitter-brief.md`](../templates/00-submitter-brief.md) | The shape of the deliverable. The **compliance requirements** (§5) derive from it and make it confidence-gradable. |
| [`interactions/01-sales-to-po.md`](../interactions/01-sales-to-po.md) (and other upstream→PO) | Describe the handoff. This doc adds the **quantitative gate** (Readiness Score) on top of it. |
| [`prototypes/`](../prototypes/) | Primary research. The confidence mechanics, score, indicators, and metrics (§3, §7, §8, §11) come from here. |

---

> **Next personas** follow this same template: who they are · two lenses · trust model · data structure · compliance requirements · questions/dispositions · indicators · metrics · handoff · screen value.
