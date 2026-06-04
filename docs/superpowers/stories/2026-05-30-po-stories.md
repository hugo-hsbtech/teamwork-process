# PO Journey Stories

> **Status:** v1 · **Date:** 2026-05-30 · **Author:** hugo (+ Claude)
> **Companion to:** [`specs/2026-05-30-po-figma-prototype-design.md`](../specs/2026-05-30-po-figma-prototype-design.md) (the WHAT) and [`plans/2026-05-30-po-figma-prototype.md`](../plans/2026-05-30-po-figma-prototype.md) (the HOW it is built).
> **Conceptual ground truth:** [`personas/02-po.md`](../../../personas/02-po.md). **Engine inherited from:** [`personas/01-submitter.md`](../../../personas/01-submitter.md).

## Purpose

The spec describes the design contract; the plan tracks build tasks. **Neither tells the journey stories.** This doc fills that gap for the PO: each story is a single user intent, told as a narrative arc with the screens that materialize it. It mirrors the Submitter stories doc one-to-one in form, instantiated for the **translation layer**.

The PO's whole experience turns on one principle: **decision is first-class** — the exact analog of the Submitter's confidence layer. Where the Submitter *captures* a pain honestly, the PO *decides* — first the demand's path (triage), then the product's form (rationalization). Every passage of a demand through the PO is a decision, justified and traceable.

## Reading the canvas

Laid out in **horizontal lanes** (Story 0 + A→M + Z), same convention as the Submitter canvas. Each lane has a big letter at the left; screens stacked left → right by narrative beat. Alt-variants and rails sit on a row below the main row. Lane Z holds reusable patterns. Lanes that start mid-flow have a text arrow pointing to the lane they depend on. Frame IDs use the **`P`** prefix (PO) to stay separate from the Submitter's `J` frames.

## Seed scenario (used across every story)

**PO:** Marina Costa · Product Owner · orange accent.
**Demand:** `DEM-2026-001` — *"Gateway de Pagamento Recorrente"* (from Carlos Silva, COO).
**Why it matters:** Charging via invoice generates ~30h/month of manual reconciliation and an 18% default rate. Critical · SLA 21h remaining · delay cost **R$ 2.6k/day** · impact **R$ 78k/year**.
**Cast:** CTO Rafael Lima · PM Juliana Reis · Submitter Carlos Silva (COO) · Viewer Ana Santos (CFO).
**Portfolio stake:** **9 frozen RPs/month**, **89%** accepted on 1st version by PM (was 64%).

---

## Story 0 · Intro · Auth

**Intent:** Enter the product as a PO.

Marina opens the product. The same entry door as the Submitter, but what comes after points inward — toward engineering. She logs in.

**Beats:**
1. **P1.1 · Sign in** — reuses the Submitter chrome (Tide mark · SSO · "in use by Product and Engineering teams").

---

## Story A · PO Panel

**Intent:** Get the portfolio view before diving into any demand — the PO works the queue, not one demand.

Marina lands on the **PO Panel**. Unlike the Submitter (whose number-king is financial impact), her number-king is **frozen RP throughput (9 this month)** — the executable context she produces. Above it, the `AIImpactBanner` shows how much the AI contributed (168h YTD · triage 6min vs 45min). Below, the `CompactKPI` grid orbits: delay cost avoided (R$ 47k/month), **1st-version acceptance (89%, +25pp vs 64%)** — the mirror of herself — average time in rationalization (2.4d, −1.8d with AI), and the honest counter-indicator (PRDs returned by PM, 11%).

**Beats (main row):**
1. **P1.2 · PO Panel** — Header "Good morning, Marina · 4 in triage · 4 in rationalization" · AIImpactBanner (po-portfolio) · HeroMetric "9 frozen RPs" + sparkline · CompactKPI 3×2 · Showcase RP-2026-000 · Recent demands.

**Alt-below:**
- **P1.3 · Empty panel** — HeroMetric at "—" · helper "Triage your first demand to start producing RPs" · central CTA "Go to triage".

---

## Story B · Triage · deciding the path

**Intent:** Pick a raw demand from the queue and decide, with justification, which path it follows.

This is **Act 1** — a **routing** decision: fast, scorable, disposable. Marina opens the **Triage Queue** and sees 4 demands ordered by priority and SLA. DEM-2026-001 is at the top: Critical, **21h remaining**, **R$ 2.6k/day** delay cost — the signals that say "decide this first." She opens the detail (fullscreen). The AI **has already pre-assessed the 5 criteria** with suggestion + confidence, each traceable to the Submitter's Intake Record. Marina's job is not to type — it is to **decide**: for each criterion she confirms or adjusts the verdict and writes the justification (required). The `TriageScoreMeter` rises with each decision. At 100% (all criteria assessed — the gate does not force a verdict, it forces an **informed** decision), the `PathDecisionPicker` enables. The AI recommends **Product Ready**; Marina agrees, justifies, confirms. This verdict is an **effort filter** — *is this demand worth rationalizing now* — not a "ready" stamp: the end of Act 2 (the frozen RP) is the **commitment point**, and real readiness (the Definition of Ready, *Ready for Development*) only comes downstream. The demand becomes "In Rationalization" and opens Act 2.

**Beats (main row):**
1. **P2.1 · Triage Queue** — 4 `TriageQueueCard`s (Critical→Low) · SLAChip + DelayCostChip visible · clicks DEM-2026-001.
2. **P2.2 · Triage — detail** — fullscreen · Intake Record read-only (with sources) · AIImpactBanner (po-triage) · 5 pre-assessed `TriageCriterionRow`s · isPath with `PathDecisionPicker` (disabled until 100%).
3. **P2.3 · Criterion decided** — one `DecisionCard` goes from undecided→decided · TriageScoreMeter 20%.
4. **P2.4 · Score 100%** — 5 decided · PathDecisionPicker enabled.
5. **P2.5 · Product Ready (confirm)** — `DecisionCard kind=path` (rationale "Worth the effort: sufficient context to invest, no unknowns that block the start; assumptions manageable in Discovery", basis=Intake Record) → demand "In Rationalization" → lands on P3.1.

---

## Story C · The other three paths

**Intent:** Show that triage has four doors — only one opens rationalization; the others close the PO's passage at this moment.

The path decision is an **effort filter**: where is it worth concentrating energy now. Only `Product Ready` opens Act 2 — and even that does not declare the demand "ready" (the RP freeze is the *commitment point*; the Definition of Ready / *Ready for Development* is downstream). The other three close the PO's passage at this moment. **Discovery** (investigate before rationalizing — 2-week time-box) and **Backlog** (good demand, not a priority now) exit through recoverable lateral doors. **Reject** (outside strategy or low value) closes the door — with mandatory justification, and the Submitter is notified. Each is a defensible `DecisionCard kind=path`.

**Beats (main row):**
1. **P2.6 · Discovery** — time-box modal ("Investigate until: 13 Jun") · demand → "In Discovery" (lateral, recoverable).
2. **P2.7 · Backlog** — demand → "Backlog (Opportunity)" (lateral, recoverable).
3. **P2.8 · Reject** — mandatory justification modal · demand → "Rejected" (closes) · Submitter notified.

---

## Story D · Rationalization · the AI WOW

**Intent:** Open the Product Ready demand and discover that the RP **has already been pre-drafted** — the work becomes judgment, not typing.

This is **Act 2** — a **construction** decision: deep, accumulative. Marina enters the **Rationalization Canvas** (fullscreen) and the README fear — "PO becomes a meeting scribe" — does not happen: the AI **has already read the Intake Record and the triage and drafted 9 of 14 sections**. On the left, the conversation opens with "I already drafted 9 of 14 sections from the PDF and the triage. I started with Scope — check what I marked as out of scope." In the center, the `RPSectionCard`s are grouped by freeze urgency: **"Block freeze · 7"** (empty/low-confidence sections), the `SemanticReflectionCard` anchoring the meaning ("operational + financial risk, not a feature request"), **"In discovery / assumption · 1"** (the 40% opt-in assumption, with time-box), and **"Resolved · 3"** (collapsed). Each section shows its origin (`ai_drafted`/`inherited`), confidence against the `satisfiedWhen` rubric, and is traceable to the source. On the right, the sources and the `TechAssessmentRefCard` (still `not_requested`). At the footer, the `FreezeToolbar` explains why it cannot be frozen yet.

**Beats (main row):**
1. **P3.1 · Rationalization Canvas** — RPReadinessRing 25% · AIImpactBanner (po-rationalization: "RP pre-drafted · 9 of 14 sections · 3 ADRs reused") · three zones · FreezeToolbar pending (N=7).
2. **P3.5 · RP contract (commitment point)** — specification of the 14 sections grouped + the Technical Assessment bridge row · section 7 with Given/When/Then example · section 8 with NFR checklist (ISO/IEC 25010) · section 10 with primary·secondary·guardrail metrics table.

**Alt-below:**
- **P3.2 · RPSectionCard states** — empty · ai_drafted · editing · low_confidence · resolved · discovery.

---

## Story E · Resolve a section

**Intent:** Exercise judgment over a pre-drafted section — review, edit, justify — and watch it migrate to resolved.

Marina tackles the **Scope (IN/OUT)** section, which is empty (blocks). She uses the composer/chat to refine with the AI ("what does NOT belong?"), edits the content, and records the `DecisionCard kind=section` with the justification. The section migrates from the "Block freeze" group to "Resolved"; the count drops from 7 to 6; the `RPReadinessRing` rises with a delta. It is the same engine as the Submitter (fixed requirement → graduated input → derived score), instantiated for product decisions.

**Beats (main row):**
1. **P3.3 · Resolved section** — Scope IN/OUT edited + justified · card migrates blocking→resolved · count 7→6 · RPReadinessRing delta.

---

## Story F · "Not decidable yet"

**Intent:** Handle a product unknown without stalling the flow — uncertainty is a structured disposition, not paralysis.

Just as the Submitter's "I don't know" never blocks, Marina's uncertainty never stalls. The **40% opt-in assumption** needs to be validated with CS before the freeze. Instead of guessing, Marina marks the section as **`discovery`** (with time-box) — counts as *resolved-as-unknown*. Other sections can be `inherited` (come ready from the intake, with source) or `ai_drafted` (AI wrote it, she confirms). The gate is not "Marina knows everything" — it is "every blocking section has an honest disposition." Note that **there is no `escalated`**: escalating to the CTO is not a section someone else fills inside the RP — it is a dependency on another artifact (Story G).

**Beats (main row):**
1. **P3.4 · Honest disposition** — RPDispositionPicker → frames: `discovery` (time-box "validate 40% with CS by 13 Jun") · `inherited` (from intake + source) · `ai_drafted` (confirm).

---

## Story G · Escalate to CTO · Technical Assessment

**Intent:** When the demand touches infra/PCI/AI, request a technical assessment from the CTO — without handing over empty sections for him to fill.

DEM-2026-001 touches PCI, Stripe and webhooks. Marina **escalates to the CTO**: she delivers the **RP** (the product vision) + specific questions. The CTO **does not edit the RP** — he produces his **own artifact, the Technical Assessment**, with viability, constraints, affected systems, technical risks and ADRs (including two reused from the knowledge base — the velocity lever). In Marina's canvas, the `TechAssessmentRefCard` evolves `requested → in_progress → signed` (verdict "viable-with-caveats", firm effort 34 business days). If the CTO **vetoes** viability, Marina revises the RP scope — but the CTO never redefines the product. This is the structural correction of the project, in data: the RP *references* the assessment, does not absorb it.

**Beats (main row):**
1. **P4.1 · Escalate to CTO (modal)** — delivers the RP + questions (PCI/Stripe/webhooks) · helper "the CTO produces a separate Technical Assessment".
2. **P4.2 · TechAssessmentRef** — `requested` → `in_progress` → `signed` (verdict + link).
3. **P4.3 · Technical Assessment (CTO)** — Rafael Lima's artifact: viability, 4 `ADRSuggestionCard`s (ADR-100..103, 2 reused), effort 34 days, PCI/LGPD · caption "referenced by the RP, fused into the PRD · NOT part of the RP".

**Alt-below:**
- **P4.2 · TechAssessmentRef vetoed** — scope revision callout (CTO vetoed viability → Marina adjusts the RP).

---

## Story H · Freeze the RP

**Intent:** The RP is ready to freeze — cross the **commitment point** (not the DoR, which is downstream).

All blocking sections have an honest disposition, and the Technical Assessment came back signed. The `RPReadinessRing` reaches freezeReady and the `FreezeToolbar` changes from "N blocking sections still lack an honest disposition…" to "Ready to freeze — all blocking sections have an honest disposition and the Technical Assessment came back signed." Marina clicks **Freeze RP** → consequences modal (the RP becomes immutable and crosses the **commitment point**; fuses into the PRD that goes to the PM; **the PO's arc ends here** — the Definition of Ready and writing of epics/stories happen downstream). Confirms. RP-2026-001 is frozen — the **commitment point** of the Upstream Kanban and the Stage-Gate *gate deliverable* turned into a number.

**Beats (main row):**
1. **P5.1 · Freeze RP (modal)** — freezeReady=true · consequences explained · Confirm.

---

## Story I · The PRD seam · handoff to PM

**Intent:** Fuse the RP (PO) with the Technical Assessment (CTO) into a PRD and deliver it to the PM — the authorship of each half stays visible.

The deliverable that opens downstream is **not the RP** — it is the **PRD**. Marina sees the **seam**: on the left the RP (her authorship, PO), on the right the Technical Assessment (Rafael's authorship, CTO), joined under the `PRD-2026-001` header by a visible center seam. Each half with its clear author, without one writing over the other. She delivers the **PRD** to the PM (Juliana Reis). From here Marina no longer drives the demand day to day — but she remains the owner of the Opportunity Backlog and the point where the feedback loop closes.

**Beats (main row):**
1. **P5.2 · PRD (seam)** — fullscreen · `PRD-2026-001` · RP (Marina/PO) | Technical Assessment (Rafael/CTO) · center seam · AIImpactBanner (po-prd: "every claim traceable").
2. **P5.3 · PRD handoff to PM (modal)** — delivers PRD to Juliana Reis · notify · success.

---

## Story J · Post-handoff · return and acceptance

**Intent:** What the PO sees after delivering — the PM accepts, or returns with specific gaps.

The PM has **explicit authority to reject** and return with specific gaps. Four destinations: **Sent** (PM received, is validating) → **Returned** (PM pointed out "Missing fallback scenario in acceptance criteria") → **Accepted** (opens execution). When returned, Marina **addresses only the gaps** and increments the version (v1.1) — the gap is routed to her or to the CTO based on its nature. The dashboard counter-indicator (PRDs returned, 11%) is exactly this loop, measured.

**Beats (main row):**
1. **P6.1 · Sent to PM** — tide banner "awaiting PM acceptance".
2. **P6.2 · Returned by PM** — amber banner "Missing fallback scenario in acceptance criteria" + CTA "Address gaps".
3. **P6.3 · Address gaps + new version** — only the gap section editable · v1.1 · gap routed to PO/CTO.
4. **P6.4 · Accepted by PM** — emerald banner · PRD opens execution.

---

## Story K · Capacity and feedback loop

**Intent:** Receive the PM back on two occasions — capacity escalation and loop closure.

The PO **hears back from the PM** beyond returns: when the PM signals a **capacity escalation** (does not fit in the quarter), Marina re-sequences the portfolio; and when the delivery generates **feedback**, the loop closes back to the Opportunity Backlog to update priorities. This is what keeps the PO as the product vision owner even after handoff.

**Beats (main row):**
1. **P6.5 · Capacity escalation (from PM)** — PO re-sequences the queue.
2. **P6.6 · Feedback loop closed** — outcome → priority update in Product Backlog.

---

## Story L · Sequence the portfolio

**Intent:** Decide the queue order — the PO's productive tension is *between* demands, not inside one.

Unlike the Submitter (whose RICE-lite mirror sharpens *one* demand), the PO's mirror is the entire queue. The `SequencingTensionCallout`s provoke: **high delay cost + high effort** → "Expensive to wait and expensive to build — is this next, or should we slice it?"; **SLA expiring + low impact** → "It will breach the SLA, but is the effort worth it, or is honest Backlog the answer?"; **new demand very similar to a recent RP** → "We already rationalized something like this — reuse the context?". Each provocation that sharpens the sequencing improves throughput.

**Beats (main row):**
1. **P7.1 · Sequencing** — the queue with active `SequencingTensionCallout`s · delay cost + SLA + effort + reuse as signals.

---

## Story M · Cross-demand visibility

**Intent:** What the PO looks at outside of a specific demand — portfolio, notifications, activity, pending items.

Surfaces reused from the Submitter, with PO copy:

- **Panel** (Story A) — the throughput number-king + pay-justifying KPIs.
- **Notifications** — TopBar bell · PM asked a question, RP frozen, CTO signed assessment.
- **Activity** — cross-demand log: "PM returned PRD-2026-002" · "CTO signed assessment for DEM-2026-001" · "RP-2026-008 accepted on 1st version".
- **Pending items** — cross-demand view of what blocks the PO (sections without disposition, pending technical assessments), grouped by demand + SLA.

**Beats (main row):**
1. **P7.2 · Notifications** — dropdown + "view all" screen.
2. **P7.3 · Global chat over the Panel** — GlobalChatSheet open over P1.2.
3. **P7.4 · Activity / Pending items cross-demand** — feed + prioritized list by SLA.

---

## Lane Z · Reusable patterns

**Intent:** Patterns referenced by multiple stories, kept centralized.

**Beats:**
1. **DecisionCard (universal · defensibility)** — `verdict · rationale · basis · source · reversible`. Used by: triage (each criterion, lane B), path (lane B/C), RP section (lanes E/F). It is the PO's first-class layer — analogous to the Submitter's ConfidenceBar.
2. **Reason modal (universal · transition why)** — reused from the Submitter; specialized in Reject (lane C) and Return-gaps (lane J).

---

## Master gaps surfaced (carry forward)

Carries forward the gaps already recorded by the Submitter (Button leadingIcon as INSTANCE_SWAP, DateField, Tag/picked, MultiSelect). New ones, specific to the PO, to watch during the build:

1. **DecisionCard must visually enforce non-empty `rationale`** — the state "verdict without justification" must be clearly invalid (state/error hint), not just an acceptable empty field.
2. **TriageScoreMeter vs ReadinessRing** — reuse the same gauge with different semantics (can-conclude gate vs readiness score); confirm that the difference in meaning is clear on screen.
3. **PRDSeam is a new two-authorship layout** — validate that the center seam communicates "one document, two authors" without looking like two side-by-side screens.

## Next personas

CTO and PM join the prototype in the same mold (see the final note in [`personas/02-po.md`](../../../personas/02-po.md)):
- The **CTO** takes the **Technical Assessment** as a first-class deliverable (viability as his first-class model) and the fusion into the PRD as handoff — the screens P4.3 and P5.2 of this prototype are already his starting point.
- The **PM** receives the **PRD** and has authority to accept/return — the screens P6.1–P6.4 already show the PO side of that loop.
- Repeat: define intents (one per story) · categorize screens into lanes · write narrative · apply the principles from `03-po.md` (two acts, decision first-class, dispositions, RP→PRD chain).
