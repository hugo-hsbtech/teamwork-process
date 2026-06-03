# Spec — PO Figma Prototype ("Tradução")

> **Status:** Draft v1 · **Date:** 2026-05-30 · **Author:** hugo (+ Claude)
> **Type:** Design spec for a high-fidelity, clickable Figma prototype of the **PO persona's** end-to-end experience, built on the Conductor "Paper & Signal" design system. Feeds an implementation (build) plan and a stories doc.
>
> **Lineage:** This is the **second persona prototype**. It inherits the engine, the confidence layer, the *trace-to-source* honesty layer and the whole component foundation from the Submitter prototype ([`specs/2026-05-27-submitter-figma-prototype-design.md`](2026-05-27-submitter-figma-prototype-design.md)). It does **not** rebuild foundations — it adds the PO-specific domain kit on top. Conceptual ground truth is [`personas/02-po.md`](../../../personas/02-po.md); this spec instantiates that model as a UI.

---

## 1. Purpose & validation goal

Build a Figma prototype we can put in front of a **real PO / Product Manager** to validate the end-to-end experience of the **translation layer** of the intake product. The prototype must let them feel the whole simulated process:

- a demand **arrives from the Submitter** as an Intake Record and lands in a **scored triage queue**,
- the PO **triages** it — scoring each routing criterion and committing to one of **4 path decisions**, each with a justification,
- a *Product Ready* demand — meaning *worth the effort of rationalizing now*, **not** *already ready* — opens **rationalization**, where the AI has **already drafted** the Readiness Package (RP) sections and the PO's job is **judgment** — review, edit, justify, freeze,
- the PO **escalates to the CTO** when needed and gets back a **Technical Assessment** (a separate artifact, not RP sections),
- the **RP is frozen** (the **commitment point** — where options become commitment; this is the **end of the PO's arc**, and is explicitly **NOT** the Definition of Ready, which lives several steps downstream) and **fused with the Technical Assessment into a PRD**,
- the **PRD is handed off to the PM**, with monitoring, rebound and feedback-loop states,
- the **dashboard** surfaces portfolio KPIs that justify paying for the platform (throughput, delay-cost avoided, first-version acceptance),
- and throughout, the **AI empowers velocity and defensibility** — every decision and every RP claim is traceable to its source.

The prototype aims at the **final product**: all PO journeys designed, every state explicit, **no implicit screens**.

The reasoning model behind the screens (decision-as-first-class, the two acts, the data structure, the two compliance contracts, dispositions, portfolio indicators, the RP→PRD chain) lives in [`personas/02-po.md`](../../../personas/02-po.md). The Submitter prototype is the **visual & component reference**.

**Primary research:**
- Conceptual ground truth: `personas/02-po.md` (decision is first-class — the exact analog to the Submitter's confidence layer).
- Engine & honesty layer (inherited): `personas/01-submitter.md`.
- Visual & component reference: the live Submitter Figma file + `prototypes/demandos-prototype-unified-v1.tsx` (the PO surfaces — triage items, rationalization pendencies, RP-2026-000 showcase, PO dashboard KPIs — already exist there as visual reference, even where conceptually behind `03-po.md`).
- Interactions: [`interactions/01-sales-to-po.md`](../../../interactions/01-sales-to-po.md), [`05-po-to-cto.md`](../../../interactions/05-po-to-cto.md), [`07-po-to-pm.md`](../../../interactions/07-po-to-pm.md), [`08-pm-to-po-capacity.md`](../../../interactions/08-pm-to-po-capacity.md).

> **Conceptual correction carried from `03-po.md` §2 / §10:** the RP is the **PO's** definition-of-ready (authored alone); the CTO produces a **separate Technical Assessment**; the **PRD is the fusion of the two** and is what goes to the PM. The prototype must render this as two artifacts that *stitch* into a PRD — never as one document the CTO co-edits. Where the unified-v1 prototype mixes technical sections into the RP, **this spec supersedes it** (see §11).

## 2. Persona & seed scenario

**Persona:** the PO — the **tradutor**. The first persona whose face points *inward* toward engineering while still carrying the customer's pain. Speaks the language of *scope, business rule, acceptance criterion, risk, metric*. His value is entirely **judgment of product** — never transcription. Anything that reduces him to a typist destroys the role.

**Seed scenario (the demand we prototype):** **`DEM-2026-001` — "Gateway de Pagamento Recorrente"**, submitted by Carlos Silva (COO). *"A plataforma cobra clientes via boleto/transferência com reconciliação manual (~30h/mês) e inadimplência de 18%; precisa migrar para cartão de crédito recorrente."* Chosen because it carries a clear delay cost (R$ 2,6k/dia, SLA 21h restantes), a clean **Product Ready** triage outcome with two premises to validate, a non-trivial **CTO escalation** (PCI, Stripe, webhooks → Technical Assessment), and reusable ADRs. Easily swappable.

**Cast (consistent across the file):** PO **Marina Costa** · CTO **Rafael Lima** · PM **Juliana Reis** · Submitter **Carlos Silva (COO)** · Viewer **Ana Santos (CFO)**.

## 3. Locked design decisions

| # | Decision | Choice |
|---|---|---|
| P1 | Inherit, don't rebuild | **Foundations are reused.** Variables, type styles, primitives and the cross-cutting domain kit (AIImpactBanner, GlobalChatSheet, TopBarNotifications, HeroMetric, CompactKPI, PendencyGroup, ConfidenceBar, SourcesTray, CopilotMessage, BlockReferenceChip, StateBadge, MultimodalComposer) come from the Submitter file unchanged. This spec adds only the **PO domain kit** (§5.4). |
| P2 | Aesthetic | **Conductor "Paper & Signal"** — stone paper, single Tide-teal signal, Hanken/Inter/Geist Mono. Flat, near-shadowless, no imagery, **no emoji**. PO persona accent = the `po` accent token (warm orange) used only as an accent stripe / wash, never a large fill. |
| P3 | Device & chrome | Desktop **1440** viewport. Same TopBar (wordmark · breadcrumb · "Discutir com a IA" · notifications bell · avatar) and Sidebar as the Submitter. |
| P4 | **Decision is first-class** | The PO analog of the Submitter's confidence layer. Every triage criterion and every RP section carries a **DecisionCard** payload: `verdict · rationale · basis · source · reversible`. `rationale` is **never optional**. The UI renders decisions as defensible objects, not checkboxes. |
| P5 | **Two acts, two gates — different purposes** | The PO surface is **not** one continuous flow. **Triagem** (a routing decision — fast, scored, disposable) and **Racionalização** (a construction decision — deep, accumulative) are distinct surfaces, each ending in its own gate. The **triage gate** (`triageScore=100%` → a `Product Ready` path) is an **effort filter**: *is this demand worth rationalizing now?* The **freeze gate** (`freezeReady=true`) is the **commitment point** — where options become commitment and the PO's arc ends; it is explicitly **NOT** the Definition of Ready (that lives downstream, when stories/tasks are written and estimated and only coding remains). `Product Ready` opens Act 2; it does **not** declare the demand ready. Conflating the effort filter with the commitment point — or either with the downstream DoR, or merging the two surfaces — is the classic design error and is explicitly out (§11). |
| P6 | Triage renders as a **scored queue** | Items to assess, a `triageScore` (% of criteria evaluated) gate, and a 4-value **path decision** with mandatory justification. Stage-Gate's *gate decision*. The gate forces an **informed** decision (no criterion skipped), not a specific one. |
| P7 | Rationalization renders as **product vision, already materialized** | The RP sections arrive **pre-drafted by AI**, each with confidence + origin + trace-to-source. The PO **reviews, edits, justifies, freezes** — never fills a blank form. This is the WOW: ~108h → ~21h across 18 demands. |
| P8 | The freeze gate **explains itself** | `freezeReady` is rendered by a sticky **FreezeToolbar** (the PO analog of the Submitter's GateToolbar). It states, in business language, *what* still blocks the freeze ("Faltam 2 seções bloqueantes sem disposição honesta" / "Technical Assessment pendente") and switches to a rewarding ready state. Stage-Gate *commitment point* turned number. |
| P9 | The CTO relationship is **two artifacts that fuse** | The RP **references** the Technical Assessment via a `TechAssessmentRefCard` (status + verdict + link) — it never absorbs it. The CTO authors the Technical Assessment separately. The **PRD seam** screen shows RP (PO) and Technical Assessment (CTO) side by side, each half with a clear author, stitching into the PRD. |
| P10 | The PO works a **portfolio**, not one demand | The productive tension is *between* demands in the queue. Portfolio indicators (custo de atraso R$/dia · SLA restante · esforço · reuso possível) drive **sequencing provocations** ("Caro de esperar e caro de fazer — esta é a próxima, ou fatiar?"), the PO analog of the Submitter's RICE-lite mirror. |
| P11 | Pay-justifying KPI | The PO Dashboard has **one number-rei**: **`Throughput de RPs congelados`** (the contexto executável he produces). `HeroMetric` with `badge="Pay-justifying KPI"`, accent=po. Secondary KPIs (custo de atraso evitado, aceite-na-1ª-versão 64%→89%, tempo médio em racionalização, PRDs devolvidos) orbit it as `CompactKPI`s. |
| P12 | Deep-detail screens are fullscreen | The Triage detail, the Rationalization canvas and the PRD seam hide the global sidebar and use the full 1440w (the breadcrumb is the close affordance) — same rule established for the Submitter's Demand Panel. Dashboard/list/cross-cutting pages keep the sidebar. |
| P13 | "Not yet decidable" is structured, never paralysis | A section/criterion reaches "resolved enough to advance" through one of four **dispositions**: `decided · inherited · ai_drafted · discovery`. `escalated` is **not** an RP disposition — escalation is a *dependency on another artifact* (`TechAssessmentRef`), not a section someone else fills. |

## 4. Experience principles (carried into every screen)

Inherited from the Submitter spec §4 (1–8 stay valid: partner-not-form, confidence first-class, "I don't know" routes to a disposition, mirror-not-ranking, operational quiet, urgency-grouped lists, the gate explains itself, AI value shown not implied). The PO adds:

9. **Decision is shown, defended, and traceable.** No state ever reads "advanced" without *why*, *under which form*, and *based on what*. The DecisionCard is the unit; `rationale` is always visible; `source` is always one click from chat (*trace-to-source*).
10. **The two acts feel different on purpose.** Triage is light, scannable, disposable — a routing desk. Rationalization is a deep, calm work surface — a vision being materialized. The visual weight, density and rhythm differ so the PO never confuses "should this advance?" with "what is the product?".
11. **Judgment over typing.** Every rationalization surface opens with the AI's draft already present. The PO's affordances are *review / edit / justify / freeze* — never an empty textarea waiting to be filled. The AIImpactBanner makes the saved hours visible so the value is never implied.
12. **Authorship is never blurred.** Where the RP meets the Technical Assessment (the PRD seam), each half is unmistakably attributed. One never writes over the other.

## 5. Foundations & components

### 5.1 Reused from the Submitter file (no rebuild)
All Phase-A foundations (color/spacing/radii/elevation variables, type styles, shadcn-restyled primitives) and these domain components, used as-is: **AIImpactBanner** (new `scope` values added in §5.4), **GlobalChatSheet**, **TopBarNotifications**, **HeroMetric** (already supports `accent=po`), **CompactKPI**, **PendencyGroup**, **ConfidenceBar**, **SemanticReflectionCard**, **SourceCard / SourcesTray**, **MultimodalComposer**, **CopilotMessage**, **BlockReferenceChip / DiscussAffordance**, **StateBadge**, **TimelineStateRow**, **Sparkline / Donut / FunnelChart**.

### 5.2 StateBadge — PO lifecycle variants (extend, don't replace)
Add demand-lifecycle variants the PO drives: `em-triagem` (violet) · `em-discovery` (blue) · `em-racionalizacao` (po-accent) · `rp-congelado` (green) · `prd-pronto` (tide) · `backlog` (slate) · `rejeitada` (red) · `devolvida-pm` (amber). Reuse the existing dot+label pattern.

### 5.3 The PO domain kit (new components)

> All bind to Phase-A tokens; no raw hex. PO accent stripe uses the `po` accent token.

**Act 1 — Triage**
- **TriageQueueCard** — one demand in the queue. Anatomy: `DEM-id` (Mono) · title · originador byline · `PriorityChip` (Crítica/Alta/Média/Baixa, colored dot) · `SLAChip` (tempo restante, turns `state/error` under 24h) · `DelayCostChip` (R$/dia) · impact preview line · trailing chevron. **Addressable**.
- **PriorityChip · SLAChip · DelayCostChip** — small metadata chips (Mono numerics). SLAChip and DelayCostChip are the portfolio-sequencing signals (P10).
- **TriageScoreMeter** — gauge of `triageScore` (% of criteria evaluated); variants `incomplete | complete`. The triage analog of the ReadinessRing; "complete" is the *can-conclude* gate, not a verdict.
- **TriageCriterionRow** — one routing criterion. Anatomy: `label` (the judgment question) · `dimension` chip (RealProblem/Recurrence/StrategicFit/BusinessImpact/Urgency/Routing) · **AISuggestionBlock** (the pre-filled recommendation + confidence, addressable) · the PO's `DecisionCard` · `why` tooltip. The `isPath=true` row is visually distinguished (the routing decision).
- **PathDecisionPicker** — the 4-value routing control on the `isPath` row: `Product Ready` (opens Act 2) · `Discovery` (lateral, recoverable, time-box field) · `Backlog` (lateral, recoverable) · `Rejeitar` (closes, mandatory justification). Each option shows its `reversible` semantics and its effect on demand state.
- **DecisionCard** — the **defensibility layer**, the PO analog of ConfidenceBar. Anatomy: `verdict` (the choice) · `rationale` (required text, the spine) · `basis` chip (intake record / Submitter disposition / ADR / portfolio data) · `source` (trace-to-source link → chat) · `reversible` indicator. Variants: `state = undecided | decided`; `kind = triage | path | section`.

**Act 2 — Rationalization (the RP)**
- **RPReadinessRing** — reuse ReadinessRing; `rpReadiness = f(weights, statuses)` with `low_confidence` counting as partial. States `building | near-freeze | freezeReady`; `delta` overlay supported.
- **RPSectionCard** — one section of the definition-of-ready. Anatomy: section number + `title` · `group` chip (Contexto/Escopo/Comportamento/Qualidade/Sucesso/Riscos/Roadmap) · `blocksFreeze` flag · AI-drafted `content` (editable) · `ConfidenceBar` (evaluated against `satisfiedWhen`) · `OriginBadge` · `RPDispositionPill` · `satisfiedWhen` rubric tooltip · DiscussAffordance. **Addressable**.
- **OriginBadge** — provenance of the entry: `inherited | ai_drafted | po_authored | reused_from_KB`. Drives the trust signal and the trace-to-source.
- **RPDispositionPill + RPDispositionPicker** — `decided · inherited · ai_drafted · discovery` (note: **no `escalated`**, per P13). `discovery` carries a time-box.
- **FreezeToolbar** — sticky bottom toolbar inside the Rationalization canvas. Left: Eyebrow "GATE" + dynamic business-language copy (pending vs freezeReady, incl. the Technical-Assessment-pending case). Right: ghost "Revisar tudo" + primary "Congelar RP" (disabled with tooltip until `freezeReady`, subtle pulse when enabled). Variant `freezeState = pending | blocked-by-assessment | ready`.
- **SequencingTensionCallout** — reuse TensionCallout copy pattern for **portfolio** provocations (P10): custo-alto+esforço-alto, SLA-estourando+impacto-baixo, demanda-parecida-com-RP-recente (reuse).

**Lateral — CTO bridge & PRD fusion**
- **TechAssessmentRefCard** — the **bridge** (not RP content). Anatomy: Eyebrow "AVALIAÇÃO TÉCNICA (CTO)" · `status` chip (`not_requested | requested | in_progress | signed | vetoed`) · `verdict` (viável / viável-com-ressalvas / inviável-como-escopado) · CTO byline (Rafael Lima) · `link` affordance ("Ver Technical Assessment") · when `vetoed`, a callout prompting RP scope revision. Counts toward `freezeReady` only when `status ∈ {signed, not_requested}`.
- **EscalateToCTOModal** — escalate-to-CTO valve: shows what's being sent (the RP + specific questions), explicitly **not** "empty sections for the CTO to fill".
- **ADRSuggestionCard** *(read-context for PO)* — AI-suggested / KB-reused ADRs that will live in the Technical Assessment; the PO sees them on the ref, the CTO approves/edits. Shows `reused_from_KB` count (the velocity lever).
- **PRDSeam** — the fusion view. Two columns, clearly attributed: **left = RP (Marina Costa, PO)**, **right = Technical Assessment (Rafael Lima, CTO)**, stitched under a single `PRD-AAAA-NNN` header. A center seam visual makes the join explicit. Read-only; the artifact that opens downstream.
- **PRDHandoffModal** — confirm handoff of the **PRD** (not RP) to the PM; consequences + notify-PM checkbox.

### 5.4 AIImpactBanner — PO scopes
Add `scope` values: `po-portfolio` (Dashboard: "168h economizadas YTD · triagem 6min vs 45min · racionalização 1.2h vs 6h"), `po-triage` (Triage detail: "5 critérios pré-avaliados · justificativas sugeridas"), `po-rationalization` (RP canvas: "RP pré-redigido pela IA · 9 de 14 seções · 3 ADRs reaproveitados · 86h economizadas neste mês"), `po-prd` (PRD seam: "RP + Technical Assessment fundidos · cada afirmação rastreável").

## 6. Input strategy
Identical to the Submitter (one `MultimodalComposer` everywhere; GlobalChatSheet is global; sources mined into `inferred` fields with trace-to-source). For the PO, the composer's primary job shifts from *capturing* to *justifying and deciding*: the AI proposes a `rationale`/`content` draft, the PO hardens it. Block-reference-to-chat (§7) is how a decision or an RP claim is interrogated.

## 7. Core pattern — Decision-reference-to-chat ("Discutir / Justificar")
Same addressable-everything mechanic as the Submitter, retargeted to decisions:
1. Hover/select any unit — a TriageCriterionRow's AI suggestion, a DecisionCard's basis, an RPSectionCard's claim, a TechAssessmentRef verdict, a portfolio tension, a KPI — and a floating **"Discutir / Justificar com a IA"** affordance appears.
2. Pin it as a `BlockReferenceChip`. The AI replies quoting the block and proposes a `rationale` or an edit to the `content`.
3. Resolution flows back to the canvas: a decision moves `undecided → decided`, a section's confidence rises, a disposition resolves, the TriageScoreMeter or RPReadinessRing advances.
4. **Trace-to-source:** clicking a `source` on any DecisionCard/RPSectionCard opens the GlobalChatSheet with that source pinned — defensibility is one click.

## 8. Journey & screen map (Phase B — every frame explicit)

> Frame IDs use the **`P`** prefix (PO) to avoid collision with the Submitter's `J` frames. Each transient state is its own frame.

**P1 · Entry & Dashboard**
- P1.1 Sign in (reuse B0 chrome).
- P1.2 **PO Dashboard** — vertical rhythm: TopBar+Sidebar → header ("Painel do PO" · "Bom dia, Marina" · "4 demandas em triagem · 4 em racionalização") → **AIImpactBanner** (scope=po-portfolio) → **HeroMetric** `label="RPs congelados (este mês)"` `value="9"` `trend="+2 vs mês anterior"` `sub="7 aceitos na 1ª versão · 2 em execução"` `badge="Pay-justifying KPI"` accent=po → **CompactKPI grid (3×2)**: Custo de atraso evitado (R$ 47k/mês) · Aceite na 1ª versão (89%, trend +25pp vs 64%, accent=success) · Tempo médio em racionalização (2,4d, −1,8d com IA, accent=ai) · PRDs devolvidos pelo PM (11%, contra-indicador) · Discoveries ativos (3) · Demandas em triagem (4) → **Showcase card** ("Veja um RP completo: RP-2026-000 · Notificações WebSocket — 17 seções, score 96%, cada afirmação rastreável") → **"Demandas recentes"** preview (link → list).
- P1.3 Dashboard — empty state.

**P2 · Triage (Act 1 — the scored queue)** *(fullscreen on detail)*
- P2.1 **Fila de Triagem** — keeps sidebar. List of `TriageQueueCard`s ordered by priority/SLA: DEM-2026-001 (Crítica, 21h, R$ 2,6k/dia) · DEM-2026-002 (Alta) · DEM-2026-003 (Média) · DEM-2026-004 (Baixa). Filter chips (Todas · SLA vencendo · Por prioridade).
- P2.2 **Triagem — detalhe** (fullscreen, no sidebar): identity header (DEM-2026-001 · StateBadge "Em Triagem" · `TriageScoreMeter` 0%) · Intake Record summary (read-only, from Submitter, with sources) · **AIImpactBanner** (scope=po-triage) · the 5 `TriageCriterionRow`s (each with an AISuggestionBlock pre-filled — see seed). The `isPath` row hosts the `PathDecisionPicker`.
- P2.3 Decide a criterion → `DecisionCard` moves `undecided → decided`; TriageScoreMeter advances. (Show the +20% per criterion.)
- P2.4 TriageScoreMeter reaches 100% → PathDecisionPicker enables.
- P2.5 **Path = Product Ready** → confirm → demand → "Em Racionalização" → lands on P3.1.
- P2.6 **Path = Discovery** → time-box modal (ex.: 2 semanas) → "Em Discovery" (lateral, recoverable).
- P2.7 **Path = Backlog** → "Backlog (Opportunity)" (lateral, recoverable).
- P2.8 **Path = Rejeitar** → mandatory-justification modal → "Rejeitada" (closes; Submitter notified).

**P3 · Rationalization (Act 2 — the RP canvas)** *(fullscreen)*
- P3.1 **Canvas de Racionalização** — DemandPanel-style, fullscreen. Identity header (DEM-2026-001 · StateBadge "Em Racionalização" · `RPReadinessRing` opens ~25%) · title · **AIImpactBanner** (scope=po-rationalization). Three-zone body:
  - Left (380) — **Conversa** (GlobalChatSheet anchored open): AI opening turn ("Li o Intake Record e já redigi 9 de 14 seções a partir do PDF e da triagem. Comecei pelo Escopo — confira o que marquei como fora.").
  - Center (619) — **Canvas** of `RPSectionCard`s grouped by `PendencyGroup`: **"Bloqueiam congelamento · N"** (state/error, expanded — sections still `empty`/`low_confidence`), `SemanticReflectionCard` ("O QUE ESTA DEMANDA É — risco operacional + financeiro, não pedido de feature"), then **"Em discovery / premissa · N"** (state/canary), then **"Resolvidas · N"** (state/production, collapsed). Each card: AI-drafted content, ConfidenceBar, OriginBadge, RPDispositionPill.
  - Right (279) — **Fontes** (`SourcesTray`) + the **TechAssessmentRefCard** (status reflecting whether the CTO was requested).
  - **FreezeToolbar** (sticky bottom): pending copy "Faltam {N} seções bloqueantes sem disposição honesta".
- P3.2 RPSectionCard states — ai_drafted · editing · po_authored · low_confidence · resolved · discovery (time-boxed).
- P3.3 Edit/justify a section → DecisionCard `kind=section` → confidence rises → card migrates from "Bloqueiam congelamento" to "Resolvidas"; RPReadinessRing delta.
- P3.4 "Ainda não dá pra decidir" → RPDispositionPicker → `discovery` (time-box) or `inherited` (from intake, with source) or `ai_drafted` (confirm) frames.
- P3.5 The 14-section contract specimen (the definition-of-ready, see §6.2 of `03-po.md`): Contexto (1–4), Escopo (5–6), Comportamento (7 user stories + Given/When/Then), Qualidade (8 NFRs, 9 edge cases), Sucesso (10 métricas com guardrails, 11 aceite do release), Riscos (12–13), Roadmap (14), + the TechAssessmentRef bridge row.

**P4 · CTO escalation & Technical Assessment** *(lateral)*
- P4.1 **EscalateToCTOModal** — pick what touches infra/platform/PCI/IA; attach the RP + specific questions; confirm.
- P4.2 TechAssessmentRefCard states — `requested` → `in_progress` → `signed` (verdict + link) → `vetoed` (scope-revision prompt).
- P4.3 **Technical Assessment specimen** (CTO-authored, read context for the PO) — viability, constraints, sistemas afetados, riscos técnicos, **ADRSuggestionCards** (incl. `reused_from_KB`), esforço firme (34 dias úteis). This is the CTO's artifact, shown so the PO sees what fuses into the PRD; it is **not** part of the RP.

**P5 · Freeze, PRD fusion & handoff**
- P5.1 **Congelar RP (modal)** — `freezeReady=true`; consequences (RP becomes the frozen definition-of-ready; fuses into PRD). Confirm.
- P5.2 **PRDSeam** (fullscreen) — `PRD-2026-001` header; left column = RP (Marina, PO), right column = Technical Assessment (Rafael, CTO), center seam; **AIImpactBanner** (scope=po-prd).
- P5.3 **PRDHandoffModal** — hand the **PRD** to Juliana Reis (PM); notify checkbox; consequences. → success.

**P6 · Monitoring, rebound & loops**
- P6.1 **Enviado ao PM** (status) — banner tide "PRD enviado · aguardando aceite da PM".
- P6.2 **Devolvido pela PM** (status) — banner amber with the specific gap ("Falta cenário de fallback nos critérios de aceite") + CTA "Tratar gaps". The PM has explicit authority to reject (per `07-po-to-pm.md`).
- P6.3 **Tratar gaps + nova versão** — only the gaps are addressed; version increments (RP/PRD v1.1). Routes the gap to PO or CTO depending on its nature.
- P6.4 **Aceito pela PM** (status) — banner emerald; PRD opens execution.
- P6.5 **Escalada de capacidade (da PM)** — per `08-pm-to-po-capacity.md`; PO re-sequences the portfolio.
- P6.6 **Feedback loop fechado** — outcome flows back to update Product Backlog priorities.

**P7 · Portfolio & cross-cutting**
- P7.1 **Sequenciamento** — the queue with `SequencingTensionCallout`s active (P10 provocations).
- P7.2 Notifications (TopBar dropdown + full page) — reuse.
- P7.3 GlobalChatSheet open over the Dashboard — reuse (specimen).
- P7.4 Atividade / Pendências cross-demand — reuse pattern.

## 9. AI empowerment thread
Triage pre-scorer (each criterion gets a suggested verdict + confidence + a drafted rationale, traceable to the intake) → path recommender (suggests *Product Ready* with reasoning, PO commits) → **RP pre-drafter** (writes the sections from the intake + triage, marks origin, flags `low_confidence` and `discovery`) → user-story & NFR generator (Given/When/Then, ISO/IEC 25010 checklist) → **ADR suggester / KB-reuser** (for the Technical Assessment) → sequencing tension-spotter (portfolio) → PRD stitcher (fuses RP + Technical Assessment, preserving authorship). **Velocity** = decisions pre-drafted, sections pre-written; **defensibility** = every decision and claim traceable. Visibility is explicit via `AIImpactBanner` (~108h → ~21h on 18 demands).

## 10. Prototype wiring & fidelity
- Clickable **golden path**: P1.2 → P2.1 → P2.2 (score 5 criteria) → P2.5 (Product Ready) → P3.1 (RP pre-drafted) → P3.3 (resolve a section) → P4.1 (escalate) → P4.2 (signed) → P5.1 (freeze) → P5.2 (PRD seam) → P5.3 (handoff) → P6.1 → P6.4.
- **Branch demos:** the 3 non-Product-Ready triage outcomes (P2.6/2.7/2.8); the `discovery` disposition fork (P3.4); a portfolio sequencing tension (P7.1); the **PM rebound loop** (P6.2 → P6.3 → re-handoff); the **CTO veto** path (P4.2 vetoed → P3 scope revision).
- Interactive components: TriageScoreMeter fill, DecisionCard undecided→decided, RPReadinessRing with delta, FreezeToolbar pending→ready, PathDecisionPicker, RPSectionCard migration between PendencyGroups, TechAssessmentRefCard status progression.
- Goal: a real PO clicks through unaided and *feels* the two acts and the RP→PRD chain.

## 11. Out of scope & do-not-resurrect (this prototype)
- Other personas' full working UIs beyond the read-context the PO needs (the CTO's Technical Assessment specimen P4.3, the PM's rebound). The CTO and PM get their **own** prototypes later, on this same molde.
- Dark mode (token slot reserved). Real backend / functional AI (scripted). Production code.

**Do NOT resurrect / do NOT build:**
- **The RP containing technical sections** (impacto arquitetural, ADRs, sistemas afetados, riscos técnicos, segurança, performance, rollout, rollback, observabilidade as *RP* sections). The unified-v1 prototype does this; **`03-po.md` §2/§6.2 supersedes it** — those belong to the CTO's **Technical Assessment**, referenced via `TechAssessmentRefCard`.
- **The CTO co-editing the RP** (the old `escalated` disposition filling RP sections). Replaced by the two-artifact bridge (P9, P13).
- **"RP → PM" as the handoff.** The handoff is the **PRD** (P5.3). "RP → PM" is the superseded direction.
- A flat list of triage criteria or RP sections — both are grouped/structured (TriageScoreMeter gate; PendencyGroups on the canvas).
- Treating triage and rationalization as one continuous flow (P5).

## 12. Build sequence
1. **Phase A — PO domain kit:** extend StateBadge + AIImpactBanner scopes; build DecisionCard, TriageQueueCard + chips, TriageScoreMeter, TriageCriterionRow, PathDecisionPicker, RPSectionCard + OriginBadge + RPDispositionPicker, FreezeToolbar, TechAssessmentRefCard, ADRSuggestionCard, PRDSeam, EscalateToCTOModal, PRDHandoffModal, SequencingTensionCallout. (Reuse everything in §5.1.)
2. **Phase B — Journeys:** assemble P1–P7, every state explicit.
3. **Phase C — Wiring:** golden path + branch demos + interactive components.

Implementation plan: [`plans/2026-05-30-po-figma-prototype.md`](../plans/2026-05-30-po-figma-prototype.md). Stories: [`stories/2026-05-30-po-stories.md`](../stories/2026-05-30-po-stories.md).
