# Submitter Figma Prototype — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Figma-specific:** This plan builds a Figma file, not code. Every `use_figma` / `create_new_file` / `generate_figma_design` call has a MANDATORY prerequisite skill that MUST be loaded first:
> - Load **figma:figma-create-new-file** before `create_new_file`.
> - Load **figma:figma-use** before EVERY `use_figma` call.
> - Load **figma:figma-generate-library** when building foundations + components (Phase A).
> - Load **figma:figma-generate-design** when building screens (Phase B).
>
> The plan specifies WHAT to build (structure, tokens, variants, copy) and HOW to VERIFY it. The Plugin-API mechanics (the JS passed to `use_figma`) are owned by those skills at execution time — do not hand-write speculative `use_figma` JS from this plan; follow the skill.

**Goal:** Build a high-fidelity, clickable Figma prototype of the Submitter persona's end-to-end experience (create → enrich on a dedicated Demand Panel → hand off → monitor → outcome), on the Conductor "Paper & Signal" design language, to validate with real COO/CEO/Sales users.

**Architecture:** One new Figma file, four pages (Foundations, Components, Screens, Prototype). Build bottom-up: variables + type styles → primitive components (shadcn/ui restyled with Conductor tokens) → domain components → screen frames assembled from components → prototype wiring. Light mode only.

**Tech Stack:** Figma (variables, components/variants, interactive components, prototype flows) via the Figma MCP + the figma:* skills. Source design system: `design-system/` (Conductor "Paper & Signal"). Source spec: `docs/superpowers/specs/2026-05-27-submitter-figma-prototype-design.md`. Primary research: `prototypes/demandos-prototype-v167.tsx`.

---

## Conventions

- **Verification, not tests.** Each task ends with a visual/structural check using Figma read tools: `get_variable_defs` (tokens), `get_metadata` (node tree/structure), `get_screenshot` (visual). "Expected" describes what the check must show.
- **Checkpoints, not git commits.** The Figma file is the artifact (git holds only this plan/spec). After each task, save a **named Figma version** (History → name the version, e.g. `A1 · color variables`) as the rollback point. Update this plan's checkboxes.
- **Naming.** Variables in `kebab/slash` groups (`stone/50`, `surface/canvas`, `state/draft`). Components in `PascalCase` (`ReadinessRing`). Variants use `Property=Value` (`state=resolved`). Frames named `J{n}.{m} · {Title}`.
- **Tokens are the source of truth.** Every fill/stroke/spacing/radius on every component and frame MUST bind to a variable from Phase A — never a raw hex except inside the variable definitions themselves.
- **Copy is final.** All visible strings in this plan are the real prototype copy (Portuguese product, per the repo). Use them verbatim. Seed scenario below.
- **No emoji anywhere** (Conductor hard rule). Status = colored dot + label. Tide is signal-only, never a large fill.

### Seed scenario (use verbatim across all screens)

- **User:** Carlos Silva · COO · `carlos.silva` · org `acme`.
- **Demand:** `INT-2026-014` — **"Conta enterprise em risco de churn exige SSO/SAML + exportação de log de auditoria."** A top-3 account threatens non-renewal without it.
- **Dashboard portfolio numbers:** Impacto anual projetado **R$ 412k/ano** · **14** demandas submetidas · **3** em execução · Conversão demanda→RP **64%** · Lead time submissão→congelado **8,5 dias** · Aceite na 1ª versão **78%**. Funnel: **14 → 11 → 9 → 7 → 3**.
- **8 compliance requirements (the canvas rows):** 1 Enunciado do problema (bloqueia) · 2 Originador e contexto (bloqueia) · 3 Quem é impactado / Alcance (bloqueia) · 4 Impacto de negócio (bloqueia) · 5 Urgência · 6 Evidência / documentos · 7 Constraints · 8 Stakeholders.
- **RICE-lite:** Impacto = Alto · Alcance = Médio · Urgência = Alta · (Esforço = soft/low_confidence). **Tension to show:** "Impacto alto + confiança baixa — que evidência te deixaria seguro?"
- **Readiness during the demo:** opens at **38%**, climbs to **64%** after one answer (show the `+26%` delta), reaches **100% / gateReady** at review.

---

## Task 0 — File, connection, page scaffold

**Figma target:** new file `Intake · Submitter`.

- [ ] **Step 1: Confirm live Figma MCP connection.**
Run `mcp__plugin_figma_figma__whoami`. Expected: a valid user, no auth error. If it errors, STOP — the user must open Figma (desktop/plugin) and authenticate; this plan cannot proceed without a live connection.

- [ ] **Step 2: Create the file.** Load **figma:figma-create-new-file**, then `create_new_file` (editorType `design`, name `Intake · Submitter`).
Expected: a new fileKey is returned.

- [ ] **Step 3: Create four pages.** Load **figma:figma-use**, then via `use_figma`: pages `Foundations`, `Components`, `Screens`, `Prototype`.

- [ ] **Step 4: Verify.** Run `get_metadata` on the file root.
Expected: four pages with the names above.

- [ ] **Step 5: Checkpoint.** Save Figma version `Task 0 · scaffold`.

---

## Phase A — Foundations (page: Foundations / Components)

> Load **figma:figma-generate-library** for all of Phase A; load **figma:figma-use** before each `use_figma` call.

### Task A1 — Color variables (collection `color`, mode `Light`)

**Figma target:** Variables → new collection `color`, single mode `Light` (add an empty `Dark` mode slot, no values).

- [ ] **Step 1: Create primitive color variables** (group `primitive/…`), exact values from `design-system/_fig/.../tokens.css`:

```
stone/50  rgb(250,249,245)   stone/100 rgb(244,242,236)  stone/200 rgb(231,228,219)
stone/300 rgb(214,210,199)   stone/400 rgb(181,176,164)  stone/500 rgb(156,151,140)
stone/600 rgb(107,103,94)    stone/700 rgb(74,71,66)     stone/800 rgb(46,44,40)
stone/900 rgb(28,27,24)
tide/50   rgb(230,243,244)   tide/100  rgb(199,230,233)  tide/300  rgb(111,196,203)
tide/500  rgb(19,164,176)    tide/600  rgb(14,138,148)   tide/700  rgb(14,124,134)
tide/900  rgb(10,90,97)
amber/50  rgb(251,241,220)   amber/500 rgb(217,119,6)    amber/600 rgb(180,83,9)
green/50  rgb(228,243,234)   green/600 rgb(21,128,61)
red/50    rgb(251,234,234)   red/600   rgb(220,38,38)
slate/50  rgb(238,241,245)   slate/500 rgb(100,116,139)
violet/50 rgb(238,233,254)   violet/500 rgb(124,92,252)
provider/claude rgb(204,120,92)  provider/gemini rgb(91,141,239)
provider/grok   rgb(75,85,99)    provider/openai rgb(16,163,127)
white rgb(255,255,255)   black rgb(0,0,0)
```

- [ ] **Step 2: Create semantic alias variables** (group `semantic/…`) pointing at primitives:

```
surface/canvas→stone/50   surface/card→white   surface/sunken→stone/100   surface/inverse→stone/900
text/ink→stone/900   text/muted→stone/600   text/faint→stone/500   text/on-brand→white
border/hairline→stone/200   border/strong→stone/300
brand/tide→tide/700   brand/tide-bright→tide/500   brand/tide-text→tide/700   brand/tide-wash→tide/50
state/draft→slate/500       state/draft-wash→slate/50
state/staging→violet/500    state/staging-wash→violet/50
state/canary→amber/500      state/canary-wash→amber/50
state/running→tide/500      state/running-wash→tide/50
state/production→green/600  state/production-wash→green/50
state/paused→amber/600      state/paused-wash→amber/50
state/error→red/600         state/error-wash→red/50
```

- [ ] **Step 3: Verify.** Run `get_variable_defs`. Expected: collection `color` with all primitives + semantic aliases; aliases resolve to the correct primitives (e.g. `surface/canvas` = `stone/50`).
- [ ] **Step 4: Checkpoint.** Version `A1 · color variables`.

### Task A2 — Spacing, radii, elevation

- [ ] **Step 1: Collection `space`** (numbers): `0=0, 2=2, xs=4, sm=8, md=12, lg=16, xl=24, 2xl=32, 3xl=48, 4xl=64`.
- [ ] **Step 2: Collection `radius`** (numbers): `none=0, sm=6, md=8, lg=12, xl=16, full=9999`.
- [ ] **Step 3: Effect styles** (elevation): `elev/1` = `0 1px 0 rgba(28,27,24,0.04)` + `0 1px 2px rgba(28,27,24,0.04)`; `elev/2` = `0 4px 8px -2px rgba(28,27,24,0.06)` + `0 12px 32px -4px rgba(28,27,24,0.12)`; `elev/pop` = `0 8px 24px -8px rgba(28,27,24,0.16)` + `0 24px 56px -12px rgba(28,27,24,0.18)`.
- [ ] **Step 4: Verify.** `get_variable_defs` shows `space` + `radius`; `get_metadata` on a probe rect with `elev/2` shows the effect style applied.
- [ ] **Step 5: Checkpoint.** Version `A2 · space/radius/elevation`.

### Task A3 — Type styles (13)

**Figma target:** text styles. Fonts: **Hanken Grotesk**, **Inter**, **Geist Mono** (ship from `design-system/fonts/`; if Figma lacks them, surface to user to install — do not substitute silently).

- [ ] **Step 1: Create styles** (family · weight · size · line-height · tracking · default color):

```
Display    Hanken Grotesk 800 · 56 · 1.05 · -0.02em · text/ink
H1         Hanken Grotesk 800 · 40 · 1.10 · -0.02em · text/ink
H2         Hanken Grotesk 700 · 28 · 1.15 · -0.01em · text/ink
H3         Hanken Grotesk 700 · 20 · 1.20 · -0.005em · text/ink
Label      Hanken Grotesk 700 · 14 · 1.0 · text/ink
Label/sm   Hanken Grotesk 700 · 12 · 1.0 · text/ink
Eyebrow    Geist Mono 500 · 11 · 1.0 · +0.08em · UPPERCASE · brand/tide-text
Body       Inter 400 · 14 · 1.5 · text/ink
Body/sm    Inter 400 · 12 · 1.5 · text/muted
Meta       Inter 400 · 12 · 1.0 · text/faint
Mono       Geist Mono 400 · 13 · 1.5 · text/ink
Mono/sm    Geist Mono 400 · 12 · 1.4 · text/muted
Code       Geist Mono 400 · 12.5 · 1.55 · text/ink · bg surface/sunken · radius/sm · pad 1px 5px
```

- [ ] **Step 2: Verify.** `get_metadata` on a specimen frame with one text node per style. Expected: 13 named text styles applied; eyebrow renders UPPERCASE in mono teal.
- [ ] **Step 3: Checkpoint.** Version `A3 · type styles`.

### Task A4 — Primitive components, cluster 1 (controls)

**Figma target:** page `Components`, section `Primitives`. Build as components with variants; bind every property to Phase-A variables. Reference the existing JSX in `design-system/ui_kits/conductor-app/components/primitives.jsx` and `_fig/.../components/*.jsx` for exact structure.

- [ ] **Step 1: Button** — variants `variant = primary | secondary | ghost | destructive` × `state = default | hover | disabled`. Primary: fill `brand/tide`, text `text/on-brand`, radius/md, pad `space/sm space/md`, Label style. Hover: fill `tide/900`. Ghost: transparent → hover `surface/sunken`. Disabled: 40% opacity. Optional trailing `→` only on forward variant.
- [ ] **Step 2: Input / Textarea / Select** — fill `surface/sunken`, 1px `border/hairline`, radius/md, Body text, placeholder `text/faint`; focus = 2px `brand/tide-bright` outline + 2px offset. Select shows chevron (Lucide `chevron-down`, 16, stroke 1.75).
- [ ] **Step 3: Checkbox / Radio** — 16px, `border/strong`, checked fill `brand/tide`.
- [ ] **Step 4: Segmented** (`SegmentedShadcnPS`) — pill track `surface/sunken`, active item `surface/card` + Label/sm; radius/sm items in radius/md track.
- [ ] **Step 5: Verify.** `get_screenshot` of the Primitives section. Expected: all controls render with tokenized fills, hairline borders, correct radii; no raw hex (spot-check via `get_variable_defs` on a fill).
- [ ] **Step 6: Checkpoint.** Version `A4 · controls`.

### Task A5 — Primitive components, cluster 2 (containers & chrome)

- [ ] **Step 1: Card** — fill `surface/card`, 1px `border/hairline`, radius/lg, pad `space/lg`, `elev/1`. No left stripe, no corner icon.
- [ ] **Step 2: Badge** (`BadgeShadcnPS`) + **StateBadge** — dot (7–8px, `state/*`) + Label/sm on `state/*-wash` pill, radius/full. Variants `state = draft | capturing | triage | discovery | rationalization | rp-frozen | execution | delivered | backlog | archived`. Map: draft→draft, capturing→running, triage→staging, discovery→tide/staging, rationalization→staging, rp-frozen→production, execution→running, delivered→production, backlog→canary, archived→error.
- [ ] **Step 3: Tabs**, **Tooltip** (`surface/inverse`, `text/on-brand`, radius/md), **Progress** (track `surface/sunken`, fill `brand/tide`).
- [ ] **Step 4: TopBar** (66px, `surface/card`, hairline-bottom, wordmark left from `design-system/assets/conductor-wordmark.svg` — replace with "Intake" wordmark text in Label), **Sidebar** (256px, nav groups in Eyebrow caps: `CRIAR · MINHAS DEMANDAS · CAIXA · MÉTRICAS`), **Toast**.
- [ ] **Step 5: DrawerShell** (`size = 480 | 560`, right-anchored, `elev/2`), **TakeoverShell** (full-screen, 720 centered column, 66px top bar + exit), **Stepper** (`type` variants) + **ProgressStepRow** (`state = todo | active | done`).
- [ ] **Step 6: Verify.** `get_screenshot` of the chrome section. Expected: TopBar/Sidebar/Drawer/Takeover match Conductor proportions; StateBadge shows all 10 states as dot+wash pill.
- [ ] **Step 7: Checkpoint.** Version `A5 · containers & chrome`.

### Task A6 — Domain components, cluster 1 (readiness & confidence)

**Figma target:** `Components` → section `Domain`.

- [ ] **Step 1: ReadinessRing** — circular gauge (SVG arc), center = score % in H3 mono-ish (use H3), color ramp by value: `<30 state/error · 31–70 state/canary · 71–99 brand/tide-bright · 100 state/production`. Variants `state = building | near-gate | gateReady`. Include a `delta` overlay slot (e.g. `+26%`).
- [ ] **Step 2: ConfidenceBar** — 10 segments; filled = round(confidence/10); color `≥90 state/production · 70–89 state/canary · <70 state/error`. Variant `compact = true|false` (compact hides "Confiança: N%" Meta label).
- [ ] **Step 3: RequirementRow** — label (Label) · dimension chip (Meta) · ConfidenceBar(compact) · DispositionPill · blocksGate flag (small `state/error` dot when blocking & unresolved); `status = empty | low_confidence | resolved` variants; `addressable` boolean (hover shows DiscussAffordance, Step in A8).
- [ ] **Step 4: DispositionPill** + **DispositionPicker** — pill variants `answered | inferred | assumption | discovery | deferred` (each its own muted color + Mono/sm label). Picker = a small menu listing the five with one-line helper copy each (e.g. assumption → "Estamos assumindo — marcar a validar").
- [ ] **Step 5: Verify.** `get_screenshot`. Expected: ReadinessRing at 38/64/100 shows correct colors + delta; ConfidenceBar fills match value; RequirementRow shows all three statuses.
- [ ] **Step 6: Checkpoint.** Version `A6 · readiness & confidence`.

### Task A7 — Domain components, cluster 2 (value mirror & reflection)

- [ ] **Step 1: ValueIndicatorMeter** — label (Impacto/Alcance/Urgência) · B/M/A segmented value · ConfidenceBar(compact) · justification (Body/sm); `addressable`.
- [ ] **Step 2: TensionCallout** — `surface/sunken` card, radius/md, Lucide `sparkles` (16, `brand/tide`), Body italic provocation text. Seed copy: "Impacto alto + confiança baixa — que evidência te deixaria seguro?"
- [ ] **Step 3: SemanticReflectionCard** — Eyebrow "O QUE ESTA DEMANDA É" · H3 one-line restatement · Body paragraph in her language; spans `addressable`.
- [ ] **Step 4: KPICard** — Eyebrow label · big number (H2, Mono for numerics) · trend Sparkline slot · Meta caption. **Sparkline**, **Donut**, **FunnelChart** (5 bars 14→11→9→7→3, labels Meta).
- [ ] **Step 5: TimelineStateRow** — dot + state label (Label) + actor + timestamp (Meta, compact like "2d"); `state = done | current | upcoming`.
- [ ] **Step 6: Verify.** `get_screenshot`. Expected: components render with tokens; FunnelChart shows the 5-stage drop-off; TensionCallout uses sparkles + italic.
- [ ] **Step 7: Checkpoint.** Version `A7 · value & reflection`.

### Task A8 — Domain components, cluster 3 (conversation & input)

- [ ] **Step 1: CopilotMessage** — variants `author = ai | user`; AI has small `brand/tide` avatar dot; `quotesBlock = true` variant renders a left-border quote card (the pinned block) above the reply text.
- [ ] **Step 2: MultimodalComposer** — `surface/card`, 1px `border/hairline`, radius/lg: textarea + a row with mic button, attach button, and a pinned-blocks strip + send (primary, `→`). States via variants `mode = idle | typing | recording | transcribing | file-attached | one-block | multi-block`.
- [ ] **Step 3: VoiceRecorder** (`state = idle | recording | transcribing | done | error`; recording shows a waveform bar row) and **UploadDropzone** (`state = idle | dragging | parsing | parsed | error`; parsed shows extraction summary "Li seu deck — 5 de 8 preenchidos, faltam 3").
- [ ] **Step 4: BlockReferenceChip** (quote-card chip with source label + ✕) and **DiscussAffordance** (floating pill "Discutir com a IA" + Lucide `message-square-quote`, appears on hover/selection of any `addressable` element).
- [ ] **Step 5: SourceCard** (`type = file | voice | note`; shows name, "contribuiu N campos", ConfidenceBar(compact); `addressable`) and **SourcesTray** (vertical list of SourceCards under Eyebrow "O QUE A IA SABE").
- [ ] **Step 6: Verify.** `get_screenshot`. Expected: composer shows all 7 modes; CopilotMessage `quotesBlock` shows the quoted block; SourcesTray lists sources with contribution counts.
- [ ] **Step 7: Checkpoint.** Version `A8 · conversation & input`.

### Task A9 — Domain components, cluster 4 (panel, collab, scaffolding)

- [ ] **Step 1: DemandPanel** shell — identity header (INT id in Mono · title in H2 · StateBadge · ReadinessRing · handoff CTA) + three-zone body slots (Conversation | Canvas | Sources). Layout variants `phase = drafting | handoff | monitoring | outcome | backlog | archived`.
- [ ] **Step 2: CollectInboxItem** — PO question (Body) + answer field + DispositionPill; `state = pending | answered`.
- [ ] **Step 3: CommentThread / CommentItem** — author dot + Body + Meta timestamp, reply field; `resolved = true|false`.
- [ ] **Step 4: EscalationModal** (reason select + justification textarea + Escalar primary), **TourBanner** (`surface/sunken`, 3-item checklist, "Entendi, ocultar" ghost), **EvidenceChip**, **StakeholderRow** (name · papel · interesse · influência B/M/A).
- [ ] **Step 5: Verify.** `get_screenshot` of full Domain section. Expected: DemandPanel shell shows the header + three labelled zones; all collab/scaffold components present.
- [ ] **Step 6: Checkpoint.** Version `A9 · panel & scaffolding`.

### Task A10 — Foundations specimen + audit

- [ ] **Step 1:** Build a single `Foundations` page specimen frame: color swatches (grouped), type ladder (13 styles), spacing/radius scales, and a component contact sheet.
- [ ] **Step 2: Token audit.** Walk every component with `get_metadata`; confirm fills/strokes/spacing/radii reference variables (no raw hex outside variable defs). Fix any literal value found.
- [ ] **Step 3: Checkpoint.** Version `A10 · foundations complete`.

---

## Phase B — Journeys (page: Screens)

> Load **figma:figma-generate-design** for all of Phase B. Each frame is desktop **1440 wide**, `surface/canvas` background, TopBar + Sidebar chrome, named `J{n}.{m} · {Title}`. Assemble from Phase-A components only. Use the seed scenario copy verbatim.

### Task B1 — J1 Entry (3 frames)

- [ ] **Step 1:** `J1.1 · Entrar` (sign-in: Intake wordmark, email/senha inputs, primary "Entrar"). `J1.2 · Landing → Dashboard` (redirect state). `J1.3 · Onboarding` (Dashboard with TourBanner: "Crie uma demanda + PDF/voz" · "Enriqueça as pendências" · "Acompanhe o impacto").
- [ ] **Step 2: Verify.** `get_screenshot` of all 3. Expected: chrome consistent, tour banner dismissible affordance visible.
- [ ] **Step 3: Checkpoint.** Version `B1 · J1 entry`.

### Task B2 — J2 Dashboard (2 frames)

- [ ] **Step 1:** `J2.1 · Dashboard` — KPICards (R$ 412k/ano · 14 submetidas · 3 em execução · 64% conversão · 8,5d lead time · 78% aceite 1ª versão) + FunnelChart (14→11→9→7→3) + "Minhas demandas" list (StateBadge + ReadinessRing-mini + last activity; include one Draft, one Backlog, one Archived row) + Collect-inbox badge ("2 perguntas do PO") + Notifications rail + "Nova demanda" primary CTA. `J2.2 · Dashboard vazio` (empty state: "Nenhuma demanda ainda — crie a primeira para começar").
- [ ] **Step 2: Verify.** `get_screenshot`. Expected: KPIs + funnel + mixed-state list render; empty state uses unit-of-work copy, not "comece agora!".
- [ ] **Step 3: Checkpoint.** Version `B2 · J2 dashboard`.

### Task B3 — J3 Create (light) (3 frames)

- [ ] **Step 1:** `J3.1 · Nova demanda` (DrawerShell 560: título input, problema one-line textarea, Origem select [Cliente/Interno/Mercado/Suporte], Tipo select; footer with UploadDropzone + VoiceRecorder + "Salvar rascunho" primary). `J3.2 · IA lendo` (parsing state → "Salvo como rascunho · 5 campos pré-preenchidos do seu deck"). `J3.3 · Abre o Demand Panel (Draft)` (transition into J4.1).
- [ ] **Step 2: Verify.** `get_screenshot`. Expected: create is light (4 fields + optional artifact), not the full canvas; ends in Draft.
- [ ] **Step 3: Checkpoint.** Version `B3 · J3 create`.

### Task B4 — J4 Demand Panel: Drafting/Enriching (frames J4.1–J4.7)

- [ ] **Step 1:** `J4.1 · Painel (Rascunho)` — DemandPanel `phase=drafting`: header (INT-2026-014 · título · StateBadge=draft · ReadinessRing=38% · "Enviar ao PO" disabled). Conversation zone (CopilotMessage ai: "Li seu deck. Identifiquei 5 de 8. Quem sente mais essa dor?") + MultimodalComposer(idle). Canvas zone (8 RequirementRows: 5 low_confidence/resolved, 3 empty; ValueIndicatorMeters; SemanticReflectionCard). Sources zone (SourcesTray: deck.pdf "contribuiu 5 campos").
- [ ] **Step 2:** `J4.2 · Composer states` — five frames or one frame with the composer variants shown: typing, recording (waveform), transcribing, file-attached, one-block-pinned, multi-block-pinned.
- [ ] **Step 3:** `J4.3 · Resposta citando bloco` — CopilotMessage `quotesBlock` quoting the pinned RequirementRow "Quem é impactado", then answering.
- [ ] **Step 4:** `J4.4 · Turno de resposta` — after she answers, ReadinessRing animates 38%→64% with `+26%` delta; the "Alcance" RequirementRow flips to resolved.
- [ ] **Step 5:** `J4.5 · Não sei → disposition` — DispositionPicker open on "Impacto de negócio"; three result frames: `assumption` ("Assumindo R$ 200k ARR — a validar"), `discovery` ("Ninguém sabe ainda — Discovery time-boxed 5d"), `deferred` ("Dono: CFO").
- [ ] **Step 6:** `J4.6 · Espelho RICE + tensão` — ValueIndicatorMeters (Impacto Alto / Alcance Médio / Urgência Alta) + TensionCallout + a resolution turn that raises confidence.
- [ ] **Step 7:** `J4.7 · Sub-vistas` — Evidência/Sources detail, Stakeholders (StakeholderRow list), Constraints.
- [ ] **Step 8: Verify.** `get_screenshot` of J4.1, J4.4, J4.5(assumption). Expected: three-zone panel reads as a conversation+canvas+memory; readiness delta visible; disposition routes "não sei" without blocking.
- [ ] **Step 9: Checkpoint.** Version `B4 · J4 enriching`.

### Task B5 — J4 Demand Panel: Handoff (frames J4.8–J4.13)

- [ ] **Step 1:** `J4.8 · Salvar e sair` (Draft persists; toast "Rascunho salvo" → back to dashboard Draft row). `J4.9 · Caixa de coleta` (CollectInboxItems: PO asks "Quem é o dono das escaladas de suporte?" + "Quantifique a economia de horas"; she answers inline). `J4.10 · Comentários` (CommentThread on "Impacto de negócio"). `J4.11 · Escalar / bloqueio` (EscalationModal).
- [ ] **Step 2:** `J4.12 · Revisão pré-envio` — readiness 100%/gateReady; read-only Intake Record (INT-2026-014) summary; "Enviar ao PO" now enabled. `J4.13 · Confirmar handoff` → success ("Enviado ao PO · aguardando triagem").
- [ ] **Step 3: Verify.** `get_screenshot` of J4.9 and J4.12. Expected: collect-inbox answers async (no full re-open); review gate enables handoff only at gateReady.
- [ ] **Step 4: Checkpoint.** Version `B5 · J4 handoff`.

### Task B6 — J4 Demand Panel: Monitoring (frames J4.14–J4.15)

- [ ] **Step 1:** `J4.14 · Timeline` — DemandPanel `phase=monitoring`: TimelineStateRows (Capturada→Em Triagem→Em Racionalização→RP Congelado→Em Execução→Entregue), with a Discovery loop and one PM rebound shown; current state highlighted. `J4.15 · O que o PO fez` — triage outcome (Product Ready) + a diff card of PO edits reflected back + notification.
- [ ] **Step 2: Verify.** `get_screenshot`. Expected: she can see where the demand is and what the PO changed (read-mostly).
- [ ] **Step 3: Checkpoint.** Version `B6 · J4 monitoring`.

### Task B7 — J4 Demand Panel: Outcome + Closure (frames J4.16–J4.18)

- [ ] **Step 1:** `J4.16 · Projetado vs realizado` — DemandPanel `phase=outcome`: a table/Donut of projected vs measured at 30/60/90d; annual impact R$ 412k projetado vs medido. `J4.17 · Backlog` (`phase=backlog`: deferred + unlock trigger "Orçamento Q3 liberado"). `J4.18 · Arquivada/Rejeitada` (`phase=archived`: reason + justification).
- [ ] **Step 2: Verify.** `get_screenshot`. Expected: outcome closes metrics camada 3; closure states explain why (not a dead end).
- [ ] **Step 3: Checkpoint.** Version `B7 · J4 outcome & closure`.

### Task B8 — J5 Cross-cutting (4 frames)

- [ ] **Step 1:** `J5.1 · Notificações` (NotificationsScreen: status updates, PO questions, escalations; mark-read). `J5.2 · Comentários (inbox)` (aggregated CommentThreads across demands). `J5.3 · Copilot afixado` (collapsed + expanded persistent copilot affordance). `J5.4 · Estados vazios & erro` (global empty + error/parse-error).
- [ ] **Step 2: Verify.** `get_screenshot`. Expected: cross-cutting surfaces consistent with chrome.
- [ ] **Step 3: Checkpoint.** Version `B8 · J5 cross-cutting`.

---

## Phase C — Wiring (page: Prototype)

> Load **figma:figma-use** for interaction wiring.

### Task C1 — Golden path flow

- [ ] **Step 1:** Wire the happy path with `on tap` → `navigate to`, ease-standard, 200–320ms: J1.1→J1.3→J2.1→(Nova demanda)→J3.1→J3.2→J4.1→J4.4→J4.6→J4.12→J4.13→J4.14→J4.16.
- [ ] **Step 2: Verify.** Open Present mode (or `get_screenshot` per node) and click through. Expected: uninterrupted end-to-end path, no dead hotspots.
- [ ] **Step 3: Checkpoint.** Version `C1 · golden path`.

### Task C2 — Branch demos + interactive components

- [ ] **Step 1:** Wire branch demos: disposition fork (J4.4→J4.5 → each of assumption/discovery/deferred → back), tension resolution (J4.6), PO rebound (J4.14→J4.15), and the save-and-return loop (J4.8→J2.1 Draft row→J4.1).
- [ ] **Step 2:** Make these interactive components (variant swap on interaction): MultimodalComposer modes, ConfidenceBar fill, ReadinessRing 38→64→100 with delta.
- [ ] **Step 3: Verify.** Click each branch + trigger each interactive component. Expected: branches return cleanly; component states animate on interaction.
- [ ] **Step 4: Checkpoint.** Version `C2 · branches & interactions`.

### Task C3 — Final review pass

- [ ] **Step 1:** Full screenshot sweep (`get_screenshot` per frame) for visual consistency: tokenized colors, hairline borders, no emoji, Tide signal-only, status-as-dot, type ladder correct.
- [ ] **Step 2:** Fix any drift inline.
- [ ] **Step 3:** Produce a shareable Present link; note the entry node (J1.1).
- [ ] **Step 4: Checkpoint.** Version `C3 · prototype v1`.

---

## Self-Review (run before execution)

**Spec coverage (§ → task):**
- §5.1 variables → A1, A2 ✓ · §5.2 type → A3 ✓ · §5.3 primitives → A4, A5 ✓ · §5.4 domain components → A6–A9 ✓
- §6 input strategy (type/upload/voice + Sources tray) → A8 (composer/recorder/dropzone/SourcesTray) + B3/B4 ✓
- §7 block-reference pattern → A8 (DiscussAffordance, BlockReferenceChip, CopilotMessage quotesBlock) + B4.3 ✓
- §8 journeys: J1→B1 · J2→B2 · J3→B3 · J4 enrich→B4 · J4 handoff→B5 · J4 monitor→B6 · J4 outcome/closure→B7 · J5→B8 ✓
- §10 wiring (golden path, branch demos, interactive components) → C1, C2 ✓
- D8 create/enrich decoupling → B3 + B4 + save-return loop in C2 ✓

**Placeholder scan:** No "TBD/TODO". Token values, type specs, and all visible copy are concrete (seed scenario). `use_figma` JS intentionally deferred to the figma:* skills per the header (not a placeholder — a skill boundary).

**Type/name consistency:** Component names match between A-definitions and B-usage (ReadinessRing, ConfidenceBar, RequirementRow, DispositionPicker, MultimodalComposer, DemandPanel, CollectInboxItem, FunnelChart, StateBadge, TimelineStateRow). StateBadge states (A5.2) match the lifecycle used in B6 timeline and B2 list.

**Known dependency/risk:** Phase A/B require a live Figma MCP connection (Task 0 Step 1) and the three font families installed in Figma (A3). Both are surfaced as STOP conditions, not assumptions.

**Do-not-resurrect (from spec §11):** separate per-section pendency modals, PlaceholderDashboards, DrillDownModal, RationalizationsListScreen, ShowcaseRPScreen — none appear in any task. ✓
