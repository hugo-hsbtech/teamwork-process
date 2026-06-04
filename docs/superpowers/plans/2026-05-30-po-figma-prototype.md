# PO Figma Prototype — Implementation Plan

> **Status:** v1 · **Date:** 2026-05-30 · **Author:** hugo (+ Claude)
> **Tracks spec:** [`specs/2026-05-30-po-figma-prototype-design.md`](../specs/2026-05-30-po-figma-prototype-design.md). Companion stories: [`stories/2026-05-30-po-stories.md`](../stories/2026-05-30-po-stories.md).

---

> **For agentic workers:** REQUIRED SUB-SKILL — use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Figma-specific:** this plan builds a Figma file, not code. Every `use_figma` / `create_new_file` / `generate_figma_design` call has a MANDATORY prerequisite skill that MUST be loaded first:
> - Load **figma:figma-create-new-file** before `create_new_file`.
> - Load **figma:figma-use** before EVERY `use_figma` call.
> - Load **figma:figma-generate-library** when building components (Phase A).
> - Load **figma:figma-generate-design** when building screens (Phase B).
>
> The plan specifies WHAT to build and HOW to VERIFY it. Plugin-API mechanics (the JS passed to `use_figma`) are owned by those skills at execution time — do not hand-write speculative `use_figma` JS from this plan.

**Goal:** Build a high-fidelity, clickable Figma prototype of the **PO persona's** end-to-end experience — triage (scored queue → 4-value path decision) → rationalization (AI-pre-drafted RP → freeze) → CTO escalation (Technical Assessment ref) → PRD fusion → handoff to PM → monitoring/rebound — on the Conductor "Paper & Signal" design language, to validate with real PO/PM users.

**Architecture:** This is the **second persona** in the same product. Reuse the existing Submitter Figma file's Foundations + Components pages. Add a new **PO domain component set** on the Components page and a new **PO Journeys** page for the P-frames. Build bottom-up: extend tokens/badges → PO domain components → screen frames → wiring. Light mode only.

**Tech stack:** Figma (variables, components/variants, interactive components, prototype flows) via the Figma MCP + figma:* skills. Source design system: `design-system/` (Conductor). Source spec: the PO spec above. Conceptual ground truth: [`personas/02-po.md`](../../../personas/02-po.md). Visual/component reference: the live Submitter Figma file + `prototypes/demandos-prototype-unified-v1.tsx` (PO surfaces only — and superseded where it mixes technical sections into the RP).

---

## Conventions

- **Verification, not tests.** Each task ends with a visual/structural check via Figma read tools (`get_variable_defs`, `get_metadata`, `get_screenshot`). "Expected" describes what the check must show.
- **Checkpoints, not git commits.** Save a named Figma version after each task. Update this plan's checkboxes.
- **Naming.** Variables in `kebab/slash` groups. Components in `PascalCase`. Variants `Property=Value`. Frames named `P{n}.{m} · {Title}` (the **P** prefix keeps them separate from the Submitter's `J` frames).
- **Tokens are the source of truth.** Every fill/stroke/spacing/radius binds to a Phase-A variable — never raw hex. PO accent uses the `po` accent token, accent-only (never a large fill).
- **Copy is final.** All visible strings are the real prototype copy (Portuguese product). Use them verbatim. Seed scenario below.
- **No emoji anywhere.** Status = colored dot + label. Tide is signal-only.
- **Decision is first-class.** Every triage criterion and RP section that renders a verdict MUST render a `DecisionCard` with a non-empty `rationale`. A criterion/section without a rationale is an invalid state — never ship a frame that shows a verdict with an empty rationale.
- **Two-artifact rule.** The RP frames contain NO CTO-authored technical sections. Technical content lives only in the Technical Assessment specimen (P4.3) and is referenced from the RP via `TechAssessmentRefCard`. The PRD is the fusion (P5.2).

### Seed scenario (use verbatim across all screens)

- **PO:** Marina Costa · `marina.costa` · accent=po. **Cast:** CTO Rafael Lima · PM Juliana Reis · Submitter Carlos Silva (COO) · Viewer Ana Santos (CFO).
- **Live demand:** **`DEM-2026-001` — "Recurring Payment Gateway"**. *"Boleto billing generates ~30h/month of manual reconciliation and 18% default rate; migrate to recurring card."* Submitter Carlos Silva (COO). **Critical · SLA 21h remaining · delay cost R$ 2,6k/day · impact R$ 78k/year.**
- **Triage queue (P2.1):** DEM-2026-001 (Critical · 21h · R$ 2,6k/day) · DEM-2026-002 SAP Integration (High · 2d · R$ 145k deal) · DEM-2026-003 Export filter (Medium · 5d · 8h/month CS) · DEM-2026-004 Rename fields (Low · 7d · UX).
- **5 triage criteria (P2.2), each with its AI suggestion (verbatim):**
  1. *Demand is real and has evidence?* — "Yes. COO strategy PDF + goal declared in committee + measurable operational savings." (conf 92)
  2. *Aligned with roadmap?* — "Yes. 'Operational Efficiency' pillar of Q2-Q3 2026 roadmap, COO's declared priority." (conf 88)
  3. *Are there blocking unknowns?* — "No blockers. Open technical decision (which gateway), resolvable in Discovery." (conf 85)
  4. *Assumptions to validate?* — "Yes, 2 assumptions: (1) % customers who accept opt-in migration; (2) chargeback feasibility with the partner." (conf 90)
  5. **(isPath) *Demand path*** — "Recommendation: **Product Ready**. Clear context, resolvable unknowns in PO Discovery." (conf 87)
- **Path decision (P2.5):** **Product Ready** — the **effort** verdict ("worth rationalizing now", not "already ready"; RP freeze is the *commitment point*, and the Definition of Ready only comes downstream). Rationale "Worth the effort: sufficient context to invest, no unknowns that block the start; assumptions manageable in Discovery", basis=Intake Record, reversible=opens Act 2.
- **Frozen RP → *commitment point* — 14 sections + bridge (P3.1 / P3.5):** 1 Executive Summary · 2 Context and Problem · 3 Objectives and Outcome · 4 Personas/JTBD · 5 Scope IN/OUT · 6 Business Rules · 7 User Stories + Acceptance Criteria (Given/When/Then) · 8 NFRs (ISO/IEC 25010) · 9 Edge Cases and Failure Modes · 10 Metrics (primary·secondary·guardrail) · 11 Release Success Criteria · 12 Product/Business Risks · 13 Preliminary Effort/Cost (—, does not block) · 14 Roadmap (—, does not block) · **Technical Assessment reference** (bridge, blocks if requested). Sections 1–12 + bridge `blocksFreeze=true`; 13–14 do not block.
- **RP initial state (P3.1):** RPReadinessRing **25%**. AI pre-drafted: Context/Problem (conf 90, low_confidence, hint "missing NPS quantification") · Personas (conf 75, low_confidence) · Assumptions→`discovery` (conf 60, time-box, "40% opt-in to validate with CS"). Empty/blocking: Objectives, Scope IN, Scope OUT, Rules, Acceptance criteria, Metrics, Risks.
  - **PendencyGroups:** "Block freeze · 7" (expanded) · "In discovery / assumption · 1" (Assumptions, expanded) · "Resolved · 3" (collapsed).
- **AIImpactBanner copy:** portfolio "168h saved YTD · triage 6min vs 45min · rationalization 1.2h vs 6h" · triage "5 criteria pre-assessed · suggested justifications" · rationalization "RP pre-drafted by AI · 9 of 14 sections · 3 ADRs reused · 86h saved this month" · prd "RP + Technical Assessment fused · every claim traceable".
- **TechAssessmentRef (P4):** requested → signed. Verdict "viable-with-caveats". CTO Rafael Lima. Firm effort **34 business days**. ADRs: ADR-100 (PaymentProvider abstraction) · ADR-101 (idempotent webhook) · ADR-102 (PCI tokenized Vault) · ADR-103 (opt-in migration). PCI-DSS via tokenization; LGPD consent + Stripe DPA.
- **PRD (P5.2):** `PRD-2026-001` = RP (Marina) + Technical Assessment (Rafael).
- **Dashboard portfolio (P1.2):** HeroMetric **9** frozen RPs (month), trend "+2 vs previous month", sub "7 accepted on 1st version · 2 in execution". CompactKPIs: Delay cost avoided **R$ 47k/month** · 1st-version acceptance **89%** (trend +25pp vs 64%) · Average time in rationalization **2.4d** (−1.8d with AI) · PRDs returned by PM **11%** · Active discoveries **3** · Demands in triage **4**.
- **Freeze gate copy (FreezeToolbar):**
  - Pending: *"{N} blocking sections still lack an honest disposition — answer them, mark as Assumption/Discovery, or request a CTO assessment."*
  - Blocked-by-assessment: *"Technical Assessment requested and not yet signed — wait for the CTO or adjust the scope."*
  - Ready: *"Ready to freeze — all blocking sections have an honest disposition and the Technical Assessment came back signed."*

---

## Task 0 — File state audit & PO page

**Figma target:** existing Submitter file (reuse Foundations + Components).

- [ ] **Step 1:** Run `whoami`. Expected: valid user, no auth error. STOP if it errors.
- [ ] **Step 2:** Load **figma:figma-use**, `get_metadata` on file root + the 4 pages. Confirm the reusable foundations & domain components from spec §5.1 exist; record their nodeIDs. Flag any missing (e.g. HeroMetric `accent=po`).
- [ ] **Step 3:** Create a new page **"PO Journeys"** for the P-frames. Create a Components-page section **"Domain · PO"**.
- [ ] **Step 4:** Checkpoint — version `PO Task 0 · audit + PO page`.

---

## Phase A — PO domain kit

### Task A1 — Extend StateBadge + AIImpactBanner

- [ ] **Step 1:** Add StateBadge variants: `in-triage` (violet) · `in-discovery` (blue) · `in-rationalization` (po-accent) · `rp-frozen` (green) · `prd-ready` (tide) · `backlog` (slate) · `rejected` (red) · `returned-by-pm` (amber). Reuse the dot+label anatomy.
- [ ] **Step 2:** Add AIImpactBanner `scope` values `po-portfolio | po-triage | po-rationalization | po-prd` with the seed copy.
- [ ] **Step 3:** Verify (`get_screenshot`). Expected: new badges read with correct state colors; banner copy reflects scope.
- [ ] **Step 4:** Checkpoint — `A1 · StateBadge + AIImpactBanner (PO)`.

### Task A2 — DecisionCard (the defensibility layer)

- [ ] **Step 1:** Build `DecisionCard`. Anatomy: `verdict` (Label) · `rationale` (Body, required — empty state shows a `state/error` hint "Rationale required") · `basis` chip (Intake Record / Submitter Disposition / ADR / Portfolio) · `source` link (Mono, → trace-to-source) · `reversible` indicator (lock icon for irreversible, arrow for recoverable).
- [ ] **Step 2:** Variants: `state = undecided | decided`; `kind = triage | path | section`. `undecided` greys the verdict and shows the rationale field empty with the obligatory hint.
- [ ] **Step 3:** Verify. Expected: a decided card reads as defensible (verdict + why + basis + source); an undecided card visibly demands a rationale; the trace-to-source link is unmistakable.
- [ ] **Step 4:** Checkpoint — `A2 · DecisionCard`.

### Task A3 — Triage kit

- [ ] **Step 1:** `PriorityChip` (Critical/High/Medium/Low, colored dot + label) · `SLAChip` (Mono time, turns `state/error` < 24h) · `DelayCostChip` (R$/day, Mono).
- [ ] **Step 2:** `TriageQueueCard` — DEM-id (Mono) · title · originator byline · PriorityChip · SLAChip · DelayCostChip · impact preview · chevron. Addressable. Variant `priority`.
- [ ] **Step 3:** `TriageScoreMeter` — gauge of % criteria evaluated; variants `incomplete | complete`. "complete" = can-conclude gate (Tide ring full), not a verdict.
- [ ] **Step 4:** `TriageCriterionRow` — `label` · `dimension` chip · `AISuggestionBlock` (suggestion text + confidence + addressable) · embedded `DecisionCard kind=triage` · `why` tooltip. Variant `isPath = false | true` (true visually elevated).
- [ ] **Step 5:** `PathDecisionPicker` — 4 options (Product Ready · Discovery · Backlog · Reject), each showing effect-on-state + reversible semantics; Reject requires justification; Discovery shows a time-box field. Embeds `DecisionCard kind=path`.
- [ ] **Step 6:** Verify (`get_screenshot` of the group). Expected: the queue card surfaces SLA + delay-cost as the sequencing signal; the criterion row leads with the AI suggestion and demands a decision; the isPath row reads as the routing fork; the picker's 4 outcomes are visually distinct (Reject = irreversible/red, Discovery/Backlog = recoverable).
- [ ] **Step 7:** Checkpoint — `A3 · Triage kit`.

### Task A4 — RP kit

- [ ] **Step 1:** `OriginBadge` — `inherited | ai_drafted | po_authored | reused_from_KB` (Eyebrow + tinted wash).
- [ ] **Step 2:** `RPSectionCard` — section number + title · `group` chip · `blocksFreeze` flag dot · AI-drafted `content` (editable Body) · `ConfidenceBar` (vs `satisfiedWhen`) · `OriginBadge` · `RPDispositionPill` · `satisfiedWhen` rubric tooltip · DiscussAffordance. Variants: `status = empty | ai_drafted | editing | low_confidence | resolved | discovery`; `blocksFreeze = true | false`.
- [ ] **Step 3:** `RPDispositionPicker` + `RPDispositionPill` — `decided · inherited · ai_drafted · discovery` (NO `escalated`). `discovery` carries a time-box. Pill colors map to the PendencyGroup tones.
- [ ] **Step 4:** Reuse `ReadinessRing` as `RPReadinessRing` (states `building | near-freeze | freezeReady`, delta slot).
- [ ] **Step 5:** `FreezeToolbar` — sticky bottom (1216×66). Left: Eyebrow "GATE" + dynamic copy (3 states, see seed). Right: ghost "Review all" + primary "Freeze RP". Variant `freezeState = pending | blocked-by-assessment | ready` (ready → primary enabled + subtle pulse).
- [ ] **Step 6:** `SequencingTensionCallout` — reuse TensionCallout visuals; portfolio provocation copy.
- [ ] **Step 7:** Verify. Expected: an `ai_drafted` section reads as "the AI already wrote this — review me", not as an empty field; the disposition pill set has no `escalated`; the FreezeToolbar's blocked-by-assessment state is visibly distinct from the generic pending state.
- [ ] **Step 8:** Checkpoint — `A4 · RP kit`.

### Task A5 — CTO bridge & PRD fusion kit

- [ ] **Step 1:** `TechAssessmentRefCard` — Eyebrow "TECHNICAL ASSESSMENT (CTO)" · `status` chip (`not_requested | requested | in_progress | signed | vetoed`) · `verdict` (viable / viable-with-caveats / not-viable-as-scoped) · CTO byline · "View Technical Assessment" link · `vetoed` callout (scope-revision prompt). Variant `status`.
- [ ] **Step 2:** `EscalateToCTOModal` — "Escalate to CTO": shows the RP + a specific-questions field; explicit helper "The CTO produces a separate Technical Assessment — you are not sending empty sections for him to fill."
- [ ] **Step 3:** `ADRSuggestionCard` — id · title · context · decision · alternatives · consequences · category · `reused_from_KB` flag. (Lives in the Technical Assessment; PO sees on the ref.)
- [ ] **Step 4:** `PRDSeam` — two attributed columns (left RP/Marina/PO, right Technical Assessment/Rafael/CTO) under a `PRD-id` header, center seam visual. Read-only.
- [ ] **Step 5:** `PRDHandoffModal` — hand the PRD to the PM (Juliana Reis); notify checkbox; consequences (PM may reject and return with gaps).
- [ ] **Step 6:** Verify. Expected: the ref card never reads like an RP section (it's a bridge with a status); the PRD seam makes authorship unmistakable (two halves, one document).
- [ ] **Step 7:** Checkpoint — `A5 · CTO bridge + PRD fusion`.

---

## Phase B — Journeys

> Load **figma:figma-generate-design** for every screen task. Each frame is 1440 wide, `surface/canvas`, TopBar+Sidebar chrome (except fullscreen deep-detail per spec P12). Named `P{n}.{m} · {Title}`.

### Task B1 — P1 Dashboard

- [ ] **Step 1:** Build `P1.2 · PO Panel`: header (Eyebrow "PO PANEL" · H1 "Good morning, Marina" · Body/sm "4 demands in triage · 4 in rationalization" · primary "Go to triage") → AIImpactBanner (scope=po-portfolio) → HeroMetric (value "9", accent=po, badge, sparkline) → CompactKPI 3×2 (seed) → Showcase (RP-2026-000) → "Recent demands" preview.
- [ ] **Step 2:** Build `P1.1 · Sign in` (reuse B0) and `P1.3 · Dashboard — empty state` (HeroMetric `state=empty`, grid hidden, big CTA "Go to triage").
- [ ] **Step 3:** Verify. Expected: one unmistakable number (9 RPs), AI contribution above it, the counter-indicator (PRDs returned 11%) present but not dominant.
- [ ] **Step 4:** Checkpoint — `B1 · P1 dashboard`.

### Task B2 — P2 Triage (Act 1)

- [ ] **Step 1:** Build `P2.1 · Triage Queue` (sidebar kept): `TriageQueueCard`s (4, seed), ordered Critical→Low; filter chips (All · SLA expiring · By priority).
- [ ] **Step 2:** Build `P2.2 · Triage — detail` (fullscreen, no sidebar): identity header (DEM-2026-001 · StateBadge in-triage · TriageScoreMeter 0%) · Intake Record summary read-only (with sources) · AIImpactBanner (scope=po-triage) · 5 `TriageCriterionRow`s (seed suggestions); the isPath row hosts `PathDecisionPicker` (disabled until score 100%).
- [ ] **Step 3:** Build `P2.3 · Criterion decided` (one DecisionCard decided, TriageScoreMeter at 20%) and `P2.4 · Score 100%` (all 5 decided, PathDecisionPicker enabled).
- [ ] **Step 4:** Build the 4 outcome frames: `P2.5 · Product Ready (confirm)` → lands P3.1; `P2.6 · Discovery (time-box modal)`; `P2.7 · Backlog`; `P2.8 · Reject (mandatory justification)`.
- [ ] **Step 5:** Verify. Expected: triage feels light and scannable (a routing desk); each criterion shows the AI suggestion + a decision; the path fork is unmistakable; the 4 outcomes are visibly different doors (1 opens Act 2, 2 lateral/recoverable, 1 closes).
- [ ] **Step 6:** Checkpoint — `B2 · P2 triage`.

### Task B3 — P3 Rationalization (Act 2)

- [ ] **Step 1:** Build `P3.1 · Rationalization Canvas` (fullscreen): identity header (DEM-2026-001 · StateBadge in-rationalization · RPReadinessRing 25%) · title · AIImpactBanner (scope=po-rationalization). Three zones:
  - Left (380) Conversation — GlobalChatSheet anchored open, AI opening turn (seed).
  - Center (619) Canvas — PendencyGroups: "Block freeze · 7" (expanded, RPSectionCards empty/low_conf), `SemanticReflectionCard`, "In discovery / assumption · 1" (Assumptions, time-box), "Resolved · 3" (collapsed: Context, Personas, + Summary).
  - Right (279) Sources (SourcesTray: strategy-monetization.pdf) + `TechAssessmentRefCard` (status=not_requested initially).
  - FreezeToolbar (pending copy, N=7).
- [ ] **Step 2:** Build `P3.2 · RPSectionCard states` specimen (empty · ai_drafted · editing · low_confidence · resolved · discovery).
- [ ] **Step 3:** Build `P3.3 · Resolved section` — Scope IN/OUT edited+justified (DecisionCard kind=section), card migrates blocking→resolved, blocking count 7→6, RPReadinessRing delta.
- [ ] **Step 4:** Build `P3.4 · Disposition "not decidable yet"` — RPDispositionPicker → frames for `discovery` (time-box), `inherited` (from intake + source), `ai_drafted` (confirm).
- [ ] **Step 5:** Build `P3.5 · RP contract (commitment point)` specimen — the 14 sections grouped (Context/Scope/Behavior/Quality/Success/Risks/Roadmap) + the bridge row; section 7 shows a Given/When/Then example, section 8 an ISO/IEC 25010 NFR checklist, section 10 a primary·secondary·guardrail metrics table.
- [ ] **Step 6:** Verify. Expected: the canvas opens with the AI's draft already present (judgment, not typing); grouped by freeze-blocking urgency; no technical sections in the RP; the disposition set has no `escalated`.
- [ ] **Step 7:** Checkpoint — `B3 · P3 rationalization`.

### Task B4 — P4 CTO escalation & Technical Assessment

- [ ] **Step 1:** Build `P4.1 · Escalate to CTO (modal)` (EscalateToCTOModal, seed questions about PCI/Stripe/webhooks).
- [ ] **Step 2:** Build `P4.2 · TechAssessmentRef states` — requested → in_progress → signed (verdict viable-with-caveats, link) → vetoed (scope-revision callout).
- [ ] **Step 3:** Build `P4.3 · Technical Assessment (CTO)` specimen — viability, constraints, affected systems, technical risks, 4 `ADRSuggestionCard`s (ADR-100..103, 2 reused_from_KB), firm effort 34 business days, PCI/LGPD. Header attributed to Rafael Lima (CTO). Explicit caption "CTO artifact — referenced by the RP, fused into the PRD. NOT part of the RP."
- [ ] **Step 4:** Verify. Expected: the Technical Assessment is clearly the CTO's artifact (not RP); ADRs show the KB-reuse lever; the ref card on P3.1 updates to `signed` when this is done.
- [ ] **Step 5:** Checkpoint — `B4 · P4 CTO escalation`.

### Task B5 — P5 Freeze, PRD fusion & handoff

- [ ] **Step 1:** Build `P5.1 · Freeze RP (modal)` — freezeReady=true; consequences; confirm.
- [ ] **Step 2:** Build `P5.2 · PRD (seam)` (fullscreen) — `PRD-2026-001` header; left RP (Marina/PO), right Technical Assessment (Rafael/CTO), center seam; AIImpactBanner (scope=po-prd).
- [ ] **Step 3:** Build `P5.3 · PRD handoff to PM (modal)` — PRDHandoffModal (Juliana Reis), notify checkbox → success.
- [ ] **Step 4:** Verify. Expected: freeze modal communicates the commitment point; the PRD seam shows two attributed halves stitched into one PRD; the handoff is the PRD, not the RP.
- [ ] **Step 5:** Checkpoint — `B5 · P5 PRD & handoff`.

### Task B6 — P6 Monitoring, rebound & loops

- [ ] **Step 1:** Build status frames: `P6.1 · Sent to PM` (tide) · `P6.2 · Returned by PM` (amber, gap "Missing fallback scenario in acceptance criteria" + CTA "Address gaps") · `P6.4 · Accepted by PM` (emerald).
- [ ] **Step 2:** Build `P6.3 · Address gaps + new version` — only the gap section editable; version bump v1.1; gap routed to PO or CTO by nature.
- [ ] **Step 3:** Build `P6.5 · Capacity escalation (from PM)` and `P6.6 · Feedback loop closed` (outcome → Product Backlog priority update).
- [ ] **Step 4:** Verify. Expected: rebound is specific (names the gap), not a generic rejection; the loop closes back to the backlog.
- [ ] **Step 5:** Checkpoint — `B6 · P6 monitoring & loops`.

### Task B7 — P7 Portfolio & cross-cutting

- [ ] **Step 1:** Build `P7.1 · Sequencing` — the queue with `SequencingTensionCallout`s active (high-cost+high-effort; SLA-expiring+low-impact; demand similar to recent RP → reuse).
- [ ] **Step 2:** Reuse for `P7.2 · Notifications` (TopBar dropdown + full page), `P7.3 · Global chat over the Dashboard`, `P7.4 · Activity / Pending items cross-demand` (PO scope copy).
- [ ] **Step 3:** Verify. Expected: the sequencing tensions read as provocations that sharpen the queue order, not as errors.
- [ ] **Step 4:** Checkpoint — `B7 · P7 portfolio & cross-cutting`.

---

## Phase C — Wiring

### Task C1 — Golden path

- [ ] **Step 1:** Wire P1.2 → P2.1 → P2.2 (score 5) → P2.4 → P2.5 → P3.1 → P3.3 → P4.1 → P4.2 (signed) → P5.1 → P5.2 → P5.3 → P6.1 → P6.4. `on tap` → `navigate`, ease-standard 200–320ms.
- [ ] **Step 2:** Verify in Present mode (or `get_screenshot` per node). Expected: uninterrupted end-to-end, no dead hotspots; both acts and the RP→PRD chain are traversed.
- [ ] **Step 3:** Checkpoint — `C1 · golden path`.

### Task C2 — Branch demos & interactive components

- [ ] **Step 1:** Wire the 3 non-Product-Ready outcomes (P2.5 picker → P2.6/2.7/2.8).
- [ ] **Step 2:** Wire the `discovery` disposition fork (P3.4) and the CTO veto path (P4.2 vetoed → P3 scope revision).
- [ ] **Step 3:** Wire the PM rebound loop (P6.2 → P6.3 → re-handoff P5.3).
- [ ] **Step 4:** Interactive components: TriageScoreMeter fill, DecisionCard undecided→decided, RPReadinessRing delta, FreezeToolbar pending→ready, RPSectionCard migration between PendencyGroups, TechAssessmentRefCard status progression, PathDecisionPicker selection.
- [ ] **Step 5:** Verify. Expected: branches return cleanly; component states animate on interaction.
- [ ] **Step 6:** Checkpoint — `C2 · branches & interactions`.

### Task C3 — Final review pass

- [ ] **Step 1:** Full screenshot sweep for consistency: tokenized colors, hairline borders, no emoji, Tide signal-only, status-as-dot, type ladder. PO-specific invariants: **HeroMetric (frozen RPs) is the singular gravity center of P1.2**; **every verdict on screen has a non-empty rationale (DecisionCard)**; **the RP contains no technical sections**; **the disposition set has no `escalated`**; **the handoff artifact is the PRD (P5.3), not the RP**; **triage and rationalization are visibly distinct acts**; **the PRD seam attributes both halves**.
- [ ] **Step 2:** Fix any drift inline.
- [ ] **Step 3:** Produce a shareable Present link; note the entry node (P1.1).
- [ ] **Step 4:** Checkpoint — `C3 · PO prototype v1`.

---

## Self-Review (run before execution)

**Spec coverage (spec § → task):**
- P4 (decision first-class) → A2 (DecisionCard) + every B-task that shows a verdict ✓
- P5/P6 (two acts; triage = scored queue) → A3 + B2 ✓
- P7 (rationalization pre-drafted) → A4 + B3 ✓
- P8 (freeze gate explains itself) → A4 (FreezeToolbar) + B3/B5 ✓
- P9/P13 (two-artifact fusion; no `escalated`) → A4 + A5 + B4 + B5 ✓
- P10 (portfolio sequencing) → A4 (SequencingTensionCallout) + B7 ✓
- P11 (pay-justifying KPI) → A1/HeroMetric + B1 ✓
- §8 frames → B1–B7 ✓
- §10 branch demos → C2 ✓

**Placeholder scan:** No "TBD/TODO". Token values, variants and all visible copy are concrete (seed scenario). `use_figma` JS deferred to the figma:* skills.

**Reuse vs build:** Phase A builds ONLY the PO domain kit; all foundations + cross-cutting components are reused from the Submitter file (Task 0 confirms they exist).

**Do-not-resurrect (spec §11):** RP with technical sections · CTO co-editing the RP / `escalated` disposition · "RP → PM" handoff · flat criteria/section lists · triage and rationalization as one flow. C3 Step 1 verifies these invariants.
