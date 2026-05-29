# Submitter Figma Prototype — Implementation Plan

> **Revision:** v2 (revised 2026-05-27 PM). Tracks spec v2. Sections marked *(v2)* are new or refactored; everything else is unchanged from v1 and stays valid.

---

## Current build state (2026-05-29) — addendum

> Living source-of-truth for what's actually built. The numbered tasks below are the original plan; this section is the **delta** between plan and the live Figma file.

**Live Figma:** `Intake-Platform` · fileKey `6Yfv523dlb2bfZS9zWGJly` · Submitter journeys page `2:789` · 65 top-level frames.

**Persona seed (active):** Hugo Seabra · COO · demand **`INT-2026-015`** *"Autenticação SSO/SAML para parceiros B2B"* · sources deck+transcript+pipeline · R$ 412k YTD.

**Known data inconsistency:** C1 Demandas list row 1 still shows `INT-2026-015 · SSO/SAML para Pagamentos` (original Carlos seed); B4 Demand Panel shows `INT-2026-015 · Autenticação SSO/SAML para parceiros B2B`. Plan: sync C1 row 1 to match B4 panel in a later cycle.

**Screen inventory built (Submitter):**

| Surface | Status | Nodes |
|---|---|---|
| B0 · Sign in | ✓ built | `439:2` |
| B1 · Dashboard | ✓ built | `811:3890` (component) + `736:3640` alt |
| B2 · Nova demanda (rich form) | ✓ refactored 2026-05-29 — see Field-set update below | `835:3979` |
| B2 · Gravando áudio (recording state) | ✓ built + mirrored fields 2026-05-29 | `850:4010` |
| B4 · Demand Panel (39 variants, all fullscreen-no-sidebar) | ✓ built | base `478:703` + 38 variants across 9 semantic columns |
| C1 · Demandas list (spacing fix 2026-05-29) | ✓ refactored | `548:2298` |
| C2 · Notifications · C7 · Atividade · C8 · Pendências | ✓ built | `560:2492` · `752:3822` · `753:4085` |

**Recent design system decisions (consolidated principles):**

1. **Deep-detail screens are fullscreen (no sidebar).** B4 Demand Panel hides the global sidebar (`sidebar.visible=false`) and expands content to 1440w. The breadcrumb "Demandas" in the TopBar is the close affordance (wired → C1 in all 39 variants). Pages that KEEP sidebar: B0, B1, B2, C-series. Future deep-journey pages (B5 Discovery, etc.) should follow this pattern.

2. **List rows HUG height with rich cells.** Rows with mixed-altura columns (id + rich title+byline + badges + bars) must NOT have any cell `layoutSizingVertical='FIXED'` with height >> content. Set the rich cell to HUG, row padding 16/16, `counterAxisAlignItems='CENTER'`, `itemSpacing=2` between title and subtitle. Gives ~60px rows that vertically center properly.

3. **Form sections — Mono Medium 11px uppercase 8% labels.** Stack vertical with 24px gap. Sections obrigatórias (Título, Descrição) first with stroke stone-300 + radius/md + white fill. Evidências = ghost button row. Contexto/Opcional = labeled rows with 96px label column + control HUG.

4. **Master instances over locals.** Every reusable element on a screen must be an instance of a master component on the `Components` page (253 components available). Audited 2026-05-29 — replaced 8 locals in B2 with `Input`, `Button`, `Avatar`, `Tag` instances.

**Master components — known gaps surfaced by the build (TODO for the design-system page):**

- **`Button` master `leadingIcon` is a RECTANGLE placeholder, not an `INSTANCE_SWAP` property.** Buttons with real icons need manual replacement of the rectangle. Future: convert to INSTANCE_SWAP so labels with icons can be assembled declaratively.
- **No dedicated "Date field" component.** Prazo in B2 is a local custom frame.
- **`Tag` selected variant visual is subtle.** When used for picked-state (e.g., Urgência "Alta"), the user signal could be stronger. Consider a `Variant=picked` with tide bg + white text.
- **No `MultiSelect Tag`/`Tag input` component** for the tags chip-row affordance. Currently composed from Tag/removable + Tag/default.

**Open Figma comments:** 1 vague comment (`1779637369` "We also need the complete place as well.") deferred until clarification.

---



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

**Architecture:** One Figma file, four pages (Foundations, Components, Screens, Prototype). Build bottom-up: variables + type styles → primitive components (shadcn/ui restyled with Conductor tokens) → domain components → screen frames assembled from components → prototype wiring. Light mode only.

**Tech Stack:** Figma (variables, components/variants, interactive components, prototype flows) via the Figma MCP + the figma:* skills. Source design system: `design-system/` (Conductor "Paper & Signal"). Source spec: `docs/superpowers/specs/2026-05-27-submitter-figma-prototype-design.md` (v2). Primary visual reference: `prototypes/demandos-prototype-unified-v1.tsx` (visual reference only — docs remain conceptual ground truth).

**Existing Figma file (v2):** the Figma file `Intake · Submitter` already exists (fileKey `6Yfv523dlb2bfZS9zWGJly`). v2 does not create a new file — it **refactors** specific frames and **adds** new components/frames inside the same file. Task 0 below covers the audit of the existing file before refactoring begins.

---

## Conventions

- **Verification, not tests.** Each task ends with a visual/structural check using Figma read tools: `get_variable_defs` (tokens), `get_metadata` (node tree/structure), `get_screenshot` (visual). "Expected" describes what the check must show.
- **Checkpoints, not git commits.** The Figma file is the artifact (git holds only this plan/spec). After each task, save a **named Figma version** (History → name the version, e.g. `A1 · color variables`) as the rollback point. Update this plan's checkboxes.
- **Naming.** Variables in `kebab/slash` groups (`stone/50`, `surface/canvas`, `state/draft`). Components in `PascalCase` (`ReadinessRing`). Variants use `Property=Value` (`state=resolved`). Frames named `J{n}.{m} · {Title}`.
- **Tokens are the source of truth.** Every fill/stroke/spacing/radius on every component and frame MUST bind to a variable from Phase A — never a raw hex except inside the variable definitions themselves.
- **Copy is final.** All visible strings in this plan are the real prototype copy (Portuguese product, per the repo). Use them verbatim. Seed scenario below.
- **No emoji anywhere** (Conductor hard rule). Status = colored dot + label. Tide is signal-only, never a large fill.
- *(v2)* **Delete-when-replaced.** When a frame is refactored in v2 (e.g. J4.1, J2.1, J3.1, J3.2, J5.1, J5.3), the **previous frame is deleted** from the Screens page after the new one is verified. We do not keep parallel "old" and "new" versions cluttering the canvas. Frames not listed as refactored in the spec stay untouched.

### Seed scenario (use verbatim across all screens)

- **User:** Hugo Seabra · COO · `hugo.seabra` · org `acme`.
- **Demand:** `INT-2026-015` — **"Conta enterprise em risco de churn exige SSO/SAML + exportação de log de auditoria."** A top-3 account threatens non-renewal without it.
- **Dashboard portfolio numbers:** HeroMetric = **R$ 412k/ano** (Impacto financeiro YTD) · CompactKPIs: **1** demanda ativa · **8/14** aceitas no ano (57%) · **6,2 dias** tempo médio até congelamento (−2,1d vs mercado) · **18h** que você não gastou · **4,2x** ROI médio realizado · Inadimplência projetada.
- **Funnel (if used):** **14 → 11 → 9 → 7 → 3**.
- **AI Impact (Dashboard scope):** "18h economizadas · 65% automatizado neste portfólio".
- **AI Impact (Demand Panel scope, J4.1):** "12h economizadas nesta demanda · 5 de 8 requisitos pré-preenchidos · 3 fontes mineradas".
- **8 compliance requirements (the canvas rows):** 1 Enunciado do problema (bloqueia) · 2 Originador e contexto (bloqueia) · 3 Quem é impactado / Alcance (bloqueia) · 4 Impacto de negócio (bloqueia) · 5 Urgência · 6 Evidência / documentos · 7 Constraints · 8 Stakeholders.
- **PendencyGroups on J4.1 (initial state):**
  - **"Bloqueiam envio · 3"** — Alcance (empty), Constraints (empty), Stakeholders (empty).
  - **"Em discovery / premissa / delegado · 1"** — Impacto de negócio (Premissa, com nota "Assumindo R$ 2,1M de ARR combinado em risco — a validar com Vendas.").
  - **"Respondidas · 4"** (collapsed) — Enunciado do problema, Originador e contexto, Urgência, Evidência/documentos.
- **RICE-lite:** Impacto = Alto · Alcance = Médio · Urgência = Alta · (Esforço = soft/low_confidence). **Tension to show:** "Impacto alto + confiança baixa — que evidência te deixaria seguro?"
- **Readiness during the demo:** opens at **38%** (`building`), climbs to **64%** after one answer (show the `+26%` delta), reaches **100% / gateReady** at J4.12 review.
- **Gate copy (GateToolbar):**
  - Pendente (≥1 bloqueante sem disposição honesta): *"Faltam {N} requisitos bloqueantes sem disposição honesta — responda, marque como Premissa/Discovery/Delegado, ou ajuste o escopo."*
  - GateReady: *"Pronto para envio — todos os requisitos bloqueantes têm disposição honesta."*

---

## Task 0 — File state audit *(v2)*

**Figma target:** existing file `Intake · Submitter` (fileKey `6Yfv523dlb2bfZS9zWGJly`).

- [ ] **Step 1: Confirm live Figma MCP connection.** Run `mcp__plugin_figma_figma__whoami`. Expected: a valid user, no auth error. STOP if it errors.
- [ ] **Step 2: Audit current file.** Load **figma:figma-use**, then `get_metadata` on file root + each of the 4 pages (Foundations, Components, Screens, Prototype). Expected: confirm v1 components and frames exist; record nodeIDs of:
  - All v1 components that are being kept unchanged.
  - The v1 frames that will be replaced: J2.1, J2.2, J3.1, J3.2, J4.1, J5.1, J5.3.
  - The v1 components that will be deprecated and removed after v2 lands: per-screen Copilot pill, "Notifications rail" on Dashboard (if instantiated as its own component), generic KPI row component on Dashboard.
- [ ] **Step 3:** Save Figma version `Task 0 v2 · pre-refactor audit`.

> Original Tasks A1–A6, A8, A9, A10 from v1 of this plan (color variables, spacing/radii, type styles, primitive components, readiness/confidence/requirements components, conversation/input/sources components, panel/collab/scaffolding components, foundations specimen) are **unchanged** in v2 and continue valid. If those tasks were completed in v1, do not redo them — they are the foundation v2 builds on. Below we only enumerate the **new and refactored** tasks. See v1 of this file in git history if you need the originals.

---

## Phase A — Foundations refactor *(v2)*

### Task A7-bis — HeroMetric refactor + CompactKPI *(v2)*

**Figma target:** `Components` → section `Domain` → group `Metrics`.

- [ ] **Step 1: HeroMetric (refactored).** Replace the current `KPICard` "hero" usage with a dedicated `HeroMetric` component. Structure (1216 wide on 1184 content column, height ~140):
  - Anchor: `surface/card`, 1px `border/hairline`, `radius/lg`, `elev/1`, `padding 24 32`.
  - Left column: Eyebrow (Mono 11, +0.08em, `text/muted`) → big number (H2 56/56, mono numerics, `text/ink`, `font-variant-numeric: tabular-nums`) with inline suffix slot (H3, `text/muted`) → trend chip (Eyebrow style + arrow icon + `state/production` text for up, `state/error` for down) → sub-composition (Body/sm, `text/muted`).
  - Right column: `Sparkline` slot (180×56), Meta caption ("Acumulado mensal").
  - Right edge: `badge="Pay-justifying KPI"` — Eyebrow mono, `brand/tide-bright` wash background, `radius/sm`, padding 4 8. Positioned top-right of the card.
  - Variants: `accent = submitter | po | cto | pm | viewer` (changes the left accent stripe — 4px wide, `radius/sm`, `tide-700` for submitter); `state = data | empty` (empty replaces value with em-dash + helper Body/sm).
- [ ] **Step 2: CompactKPI.** New component for the secondary 3×2 grid. Structure (per card, ~200 wide × 92 tall):
  - `surface/card`, 1px `border/hairline`, `radius/md`, padding 16 20.
  - Top row: Eyebrow label (left) · 24×24 rounded icon square (right, `accent` color wash + accent foreground).
  - Big number (H3 20, mono numerics) + optional suffix (Body, `text/muted`) + optional trend chip (Meta + arrow).
  - Body/sm sub (`text/muted`).
  - Variants: `accent = neutral | submitter | success | warning | ai`; `hasTrend = true|false`.
- [ ] **Step 3:** Update Sparkline to support a `width=180` size variant.
- [ ] **Step 4: Verify.** `get_screenshot` of the Metrics group. Expected: HeroMetric is visually heavier than CompactKPI, badge "Pay-justifying KPI" reads as a stamp, the accent stripe is unmistakably Tide for the Submitter, mono numerics align.
- [ ] **Step 5: Checkpoint.** Version `A7-bis · HeroMetric + CompactKPI`.

### Task A9-bis — PendencyGroup + GateToolbar *(v2)*

**Figma target:** `Components` → section `Domain` → group `Demand Panel`.

- [ ] **Step 1: PendencyGroup.** A wrapper component that groups N `RequirementRow`s. Structure:
  - Header row: 6px dot (color = `state/error | state/canary | state/production` per group) · Eyebrow label uppercase ("BLOQUEIAM ENVIO" / "EM DISCOVERY / PREMISSA / DELEGADO" / "RESPONDIDAS") · count chip (`surface/sunken`, Meta) · ChevronDown/Up toggle on the right.
  - Body: vertical stack of `RequirementRow` slots, spacing `space/sm` (8px).
  - Variants:
    - `tone = blocking | pending | resolved` (drives dot color + label color).
    - `defaultOpen = true | false` (resolved defaults closed; the other two default open).
    - `count` is a number prop.
  - Animation hook: rows animate position when migrating between groups (this is wired in Phase C as an interactive component).
- [ ] **Step 2: GateToolbar.** Sticky bottom toolbar inside DemandPanel `phase=drafting`. Structure (1216 wide, 66 tall):
  - Anchor: `surface/card`, 1px top `border/hairline`, `elev/2`, padding 16 32.
  - Left: Eyebrow "GATE" + Body/sm of dynamic copy. Two states of copy (see seed scenario): pending vs gateReady.
  - Right: `Button variant=ghost label="Revisar tudo"` + `Button variant=primary label="Enviar ao PO"`.
  - Variants: `gateState = pending | ready` (pending → primary button is disabled with tooltip "Atenda os bloqueantes acima primeiro"; ready → primary button is enabled and has the subtle pulse animation hook).
- [ ] **Step 3: Verify.** `get_screenshot` of both. Expected: group header reads instantly as a sectioning device (not a card); GateToolbar pending state visually communicates "blocked" without being aggressive; ready state visually rewards (subtle Tide accent on the primary button).
- [ ] **Step 4: Checkpoint.** Version `A9-bis · PendencyGroup + GateToolbar`.

### Task A11 — Persistent AI affordances *(v2)*

**Figma target:** `Components` → section `Domain` → group `AI surfaces`.

- [ ] **Step 1: AIImpactBanner.** Structure (full content width on the page it appears, height 56):
  - Anchor: `radius/md`, 1px `border/hairline` with subtle tide tint, padding 12 16, background `linear-gradient(90deg, var(--tide-wash) 0%, var(--accent-wash) 100%)`.
  - Left: 36×36 rounded square `brand/tide-bright` fill with Zap icon (white, 16).
  - Middle (flex-1): Eyebrow "IA IMPACT" (Mono, `brand/tide-text`) · Label (Hanken 700/14) of dynamic copy ("18h economizadas · 65% automatizado neste portfólio" — context-driven).
  - Right (flex-end): two stat blocks separated by a 1px hairline, each: big number (H3, mono numerics, `brand/tide-text`) over Meta caption (`text/muted`).
  - Variants: `scope = portfolio | demand | review`, drives default copy and the second stat (portfolio → hoursSaved + automatedPct; demand → hoursSaved + reqsPrefilled; review → hoursSaved + automatedPct).
- [ ] **Step 2: GlobalChatSheet.** Right-anchored sheet, 420 wide × full viewport height. Structure:
  - Header (72 tall): 32×32 rounded `brand/tide-wash` square with Sparkles icon (`brand/tide-text`, 16) · Label "Assistente IA" + Eyebrow "CONTEXTO: {current-route-label}" (e.g. "CONTEXTO: DASHBOARD" / "CONTEXTO: INT-2026-015") · ✕ close button on the right.
  - Divider (1px `border/hairline`).
  - Body (scrollable):
    - Empty-state variant: Sparkles icon (32, `brand/tide-bright`, centered top) · Body "Como posso ajudar?" · Body/sm "Tenho contexto completo desta tela." · 3 suggestion buttons (`surface/sunken`, `border/hairline`, padding 12 16, left-aligned, Body/sm): "Resuma o status da demanda", "Quais ADRs estão envolvidos?", "Qual o ROI estimado?".
    - Conversation variant: `CopilotMessage` ai/user/quotesBlock stack (reuse from A8).
  - Pinned-blocks strip (above composer, only when ≥1 block pinned): horizontal scroll of `BlockReferenceChip`s.
  - Composer footer: `MultimodalComposer` (reuse from A8).
  - Variants: `state = closed | open-empty | open-conversation`; `pinnedBlocks = 0 | 1 | many`.
- [ ] **Step 3: TopBarNotifications.** Bell icon + dropdown. Structure:
  - **Bell trigger** (in TopBar): 32×32 ghost button, Lucide `bell` (18, `text/muted`) · top-right badge: 16×16 rounded-full, `state/error` fill + count number (Meta white, mono) when unread > 0; hidden when 0.
  - **Dropdown** (360 wide, max-height 480, anchored under bell):
    - `surface/card`, `border/hairline`, `radius/md`, `elev/pop`.
    - Header (Eyebrow "NOTIFICAÇÕES" + count of unread + "Marcar todas como lidas" ghost link).
    - Divider.
    - List of up to 5 `NotificationRow` items: 8px dot (unread → `brand/tide-bright`; read → `text/faint`) · Body two-line clamp · Meta timestamp ("1h" / "3h" / "1d").
    - Footer link "Ver todas" → navigates to J5.1.
  - Variants on the dropdown: `count = empty | 1 | 5+`.
- [ ] **Step 4: Verify.** `get_screenshot` of all three components. Expected: AIImpactBanner reads as "the AI's badge of honor" without being noisy; GlobalChatSheet header shows context; TopBarNotifications dropdown is dense but legible.
- [ ] **Step 5: Checkpoint.** Version `A11 · persistent AI affordances`.

---

## Phase B — Journeys refactor *(v2)*

> Load **figma:figma-generate-design** for every screen task. Each frame is desktop **1440 wide**, `surface/canvas` background, TopBar + Sidebar chrome. Named `J{n}.{m} · {Title}`. v2-only: TopBar now includes `TopBarNotifications` and a `Button variant=ghost icon=sparkles label="Discutir com a IA"` to the right of the breadcrumb, before the avatar dropdown.

### Task B0 — Chrome update *(v2)*

- [ ] **Step 1: Update TopBar component.** Add the "Discutir com a IA" button (right of breadcrumb area) and the `TopBarNotifications` bell + badge (right of that, before the avatar). Keep the existing wordmark/breadcrumb/avatar.
- [ ] **Step 2: Verify.** `get_screenshot` of the TopBar specimen. Expected: clear horizontal rhythm wordmark → breadcrumb → chat button → notifications bell → avatar.
- [ ] **Step 3: Checkpoint.** Version `B0 · TopBar v2`.

### Task B2 — J2 Dashboard (refactored) *(v2)*

- [ ] **Step 1: DELETE the previous J2.1 and J2.2 frames** from the Screens page (record nodeIDs first from Task 0 audit).
- [ ] **Step 2: Build new `J2.1 · Dashboard`.** Vertical rhythm (see spec §8):
  1. TopBar + Sidebar chrome (uses B0).
  2. Header row (32 margin top, 1184 content width centered): Eyebrow "PAINEL DO SUBMITTER" · H1 "Bom dia, Carlos" · Body/sm "Você tem 1 demanda ativa, 8 entregues no ano." · primary `Button label="Nova Demanda" icon=plus` top-right.
  3. AIImpactBanner (scope=portfolio): "18h economizadas · 65% automatizado neste portfólio".
  4. HeroMetric (badge="Pay-justifying KPI"): label "Impacto financeiro das suas demandas em produção (YTD)" · value "R$ 412k" · trend "+R$ 78k projetados nesta demanda" (up) · sub "8 entregues · 3 com ROI confirmado · 1 em andamento" · sparkline `[120, 145, 180, 230, 270, 340, 380, 412]` · accent=submitter.
  5. CompactKPI grid (3 cols × 2 rows): Demandas ativas (1) · Aceitas no ano (8/14, sub "57% de aceite", accent=success) · Tempo médio até congelamento ("6,2" dias, trend "-2,1d vs média do mercado", up) · Horas que você não gastou ("18h", accent=ai, sub "vs preencher formulários") · ROI médio realizado ("4,2x", accent=success, sub "entre 8 entregas") · Inadimplência projetada (sub "redução de 18% para 6%", accent=success).
  6. Showcase card: gradient `tide-wash → violet-50`, Award icon left, Eyebrow "VEJA UM RP COMPLETO", H3 "RP-2026-000 · Notificações WebSocket", Body/sm "Exemplo entregue de outro Submitter: 17 seções, 5 ADRs, score 96%, NPS 9.4. Cada afirmação tem origem rastreável.", trailing arrow chip.
  7. "Demandas recentes" preview: 3 rows (1 In progress, 1 Draft, 1 Delivered) + ghost "Ver todas" link → Minhas Demandas route.
- [ ] **Step 3: Build new `J2.2 · Dashboard vazio`.** Same chrome; HeroMetric in `state=empty` with helper Body/sm "Crie sua primeira demanda para começar a medir impacto."; CompactKPI grid hidden; big centered `Button size=lg label="Nova Demanda" icon=plus`; AIImpactBanner hidden (no value to show yet).
- [ ] **Step 4: Verify.** `get_screenshot` of J2.1 and J2.2. Expected: J2.1 has one unmistakable number (R$ 412k), the AI's contribution is visible above it, CompactKPI feels supportive not competing, no Funnel/Notifications rail clutters the right side, sidebar's "Minhas Demandas" link is the path to the full list.
- [ ] **Step 5: Checkpoint.** Version `B2 v2 · J2 dashboard`.

### Task B3 — J3 Create (refactored) *(v2)*

- [ ] **Step 1: DELETE the previous J3.1 and J3.2 frames** (record nodeIDs first).
- [ ] **Step 2: Build new `J3.1 · Nova demanda`.** `TakeoverShell` 720 column centered, surface/canvas background, TopBar with breadcrumb "Demandas / Nova" + Exit ✕:
  - H1 "Nova Demanda".
  - Body "Conte como se estivesse falando com um colega. A plataforma estrutura o resto." (`text/muted`).
  - Card (`surface/card`, `border/hairline`, `radius/lg`, padding 24): Eyebrow "O QUE ACONTECEU?" + Textarea 8 rows (placeholder "Ex: Conta enterprise top-3 ameaça não renovar sem SSO/SAML…").
  - Sub-section in same card: Eyebrow "OU ANEXE ALGO QUE AJUDE" + two ghost buttons side-by-side: `Subir documento` (paperclip icon) + `Gravar áudio` (mic icon).
  - Footer (right-aligned): ghost "Cancelar" + primary `Button label="Salvar rascunho" icon=arrow-right` (enabled when textarea non-empty OR an artifact attached).
  - **NO** "Título" input, **NO** Origem select, **NO** Tipo select — these are inferred in J3.2.
- [ ] **Step 3: Build new `J3.2 · IA lendo`.** Same TakeoverShell, content swaps to the process view:
  - Animation phase: `Loader2` 32px spinning (`brand/tide-bright`) centered, H2 "Processando…" + three vertically-stacked `ProgressStepRow` items (`state = done | active | upcoming`):
    1. "Lendo seu texto" — done.
    2. "Analisando estrategia-monetizacao.pdf" — active.
    3. "Identificando informações úteis para a demanda…" — upcoming.
  - Success phase (same frame, second variant via `phase = processing | done`): 64×64 `surface/card` rounded square with green check (`state/production`), H2 "Processamento concluído", Body "Li seu documento e identifiquei 5 informações úteis. Vou usar para adiantar o preenchimento. Faltam apenas 3 pendências pra você responder." + primary `Button label="Continuar" size=lg icon=arrow-right` centered.
- [ ] **Step 4: Verify.** `get_screenshot` of J3.1 and J3.2 (both phases). Expected: J3.1 is a single rich textarea + optional artifact — feels like "tell me a story", not a form; J3.2 makes the AI's work visible step-by-step then states the contribution explicitly.
- [ ] **Step 5: Checkpoint.** Version `B3 v2 · J3 create`.

### Task B4-J4.1 — Demand Panel: Drafting (refactored) *(v2)*

> Only J4.1 is refactored. J4.2 through J4.18 remain valid from v1 of this plan and stay untouched.

- [ ] **Step 1: DELETE the previous J4.1 frame** (record nodeID first). Also delete the previously-instantiated header CTA "Enviar ao PO" affordance from the canvas (it is now living inside `GateToolbar`).
- [ ] **Step 2: Build new `J4.1 · Painel (Rascunho)`.** DemandPanel `phase=drafting`, 1280 wide content (sidebar 160):
  - **Identity header** (1216 wide, 200 tall, surface/card, border-bottom hairline, padding 24 32):
    - Top row: INT-2026-015 (Mono 13, `text/faint`) · separator · `StateBadge` (variant=draft, label "Em Captura") · flex spacer · `ReadinessRing` 96×96 (state=building, score=38%, delta-slot empty in initial state, populated to "+26%" in J4.4).
    - Title H2: "Conta enterprise em risco de churn exige SSO/SAML + exportação de log de auditoria."
    - **AIImpactBanner** (scope=demand, embedded inside the header card, full width): "12h economizadas nesta demanda · 5 de 8 requisitos pré-preenchidos · 3 fontes mineradas".
    - No CTA here — moved to GateToolbar.
  - **Three-zone body** (1280 wide, fills remaining height minus 66 for GateToolbar):
    - **Left: Conversation zone** (380 wide, `surface/card`, border-right hairline, padding 20). Eyebrow "CONVERSA" · `CopilotMessage` ai (opening): "Li seu deck e o e-mail da renovação. Identifiquei 5 de 8 informações. Pra começar: quem sente mais essa dor — quais contas ou segmentos?" · spacer · `MultimodalComposer` (mode=idle). This zone shares state with GlobalChatSheet — when the user opens the sheet from anywhere else, it shows the same conversation.
    - **Center: Canvas zone** (619 wide, `surface/canvas`, padding 20). Vertical stack:
      1. Eyebrow "CANVAS".
      2. **PendencyGroup tone=blocking defaultOpen=true count=3** — header "BLOQUEIAM ENVIO · 3" with state/error dot; body holds 3 `RequirementRow`s for Alcance / Constraints / Stakeholders (each: label · dimension chip · ConfidenceBar (empty, 0/10 segments) · DispositionPill `—` · blocksGate dot=state/error).
      3. `SemanticReflectionCard` — Eyebrow "O QUE ESTA DEMANDA É" · H3 "Uma conta enterprise estratégica ameaça não renovar sem SSO/SAML e exportação de log de auditoria." · divider · Body "É risco de receita e retenção — não um pedido de funcionalidade.".
      4. `ValueIndicatorMeter` Impacto — value=Alto, confidence=62%, justification "Afeta todos os usuários ativos mensalmente."
      5. `ValueIndicatorMeter` Alcance — value=Médio, confidence=45%, justification "Estimativa baseada em dados de uso Q3." (addressable=false in this initial frame).
      6. `ValueIndicatorMeter` Urgência — value=Alto, confidence=78%, justification "SLA comprometido sem ação este trimestre.".
      7. **PendencyGroup tone=pending defaultOpen=true count=1** — header "EM DISCOVERY / PREMISSA / DELEGADO · 1" with state/canary dot; body holds 1 `RequirementRow` for Impacto de negócio with DispositionPill=Premissa and a sub-note (left-border tide stripe, Body/sm italic): "Assumindo R$ 2,1M de ARR combinado em risco — a validar com Vendas.".
      8. **PendencyGroup tone=resolved defaultOpen=false count=4** — header "RESPONDIDAS · 4" with state/production dot, collapsed; body (hidden in initial view) holds 4 `RequirementRow`s for Enunciado / Originador / Urgência / Evidência (each DispositionPill=Respondido, ConfidenceBar 9/10).
    - **Right: Sources zone** (279 wide, `surface/sunken`, border-left hairline, padding 20). Eyebrow "FONTES" · `SourcesTray` with 3 `SourceCard`s: deck-q2-2026.pdf (contribuiu 5 campos · conf alta), e-mail-renovacao.eml (contribuiu 2 campos · conf média), call-com-conta.m4a (contribuiu 1 campo · conf baixa).
  - **GateToolbar (sticky bottom, 1216 wide, 66 tall, anchored at viewport bottom inside the panel)**: gateState=pending, copy "Faltam 3 requisitos bloqueantes sem disposição honesta — responda, marque como Premissa/Discovery/Delegado, ou ajuste o escopo." (left); Buttons "Revisar tudo" (ghost) + "Enviar ao PO" (primary, disabled, tooltip "Atenda os bloqueantes acima primeiro") (right).
- [ ] **Step 3: Verify.** `get_screenshot` of J4.1. Expected: the page reads top-to-bottom as identity → AI contribution → conversation+canvas+memory; the canvas is grouped by urgency (red on top expanded, amber middle expanded, green bottom collapsed); the GateToolbar at the bottom explains *why* the CTA is disabled in business language.
- [ ] **Step 4:** Audit the v1 J4.4 frame to update it consistently with the new J4.1: when the answer turn lands, the `Alcance` RequirementRow migrates from PendencyGroup `blocking` to `resolved`; the blocking count drops to 2; the resolved count rises to 5; the ReadinessRing animates 38%→64% with `+26%`. (Frame stays — only the contents inside it are aligned to the new grouping. Do NOT delete J4.4.)
- [ ] **Step 5: Checkpoint.** Version `B4 v2 · J4.1 panel drafting`.

### Task B8 — J5 Cross-cutting (refactored) *(v2)*

- [ ] **Step 1: DELETE the previous J5.1 and J5.3 frames**.
- [ ] **Step 2: Build new `J5.1 · Notificações`** as the "full archive" page (reachable from "Ver todas" in the TopBar bell dropdown).
  - TopBar + Sidebar chrome (sidebar item "Notificações" highlighted only if reachable from sidebar — in v2 it is reachable via TopBar primarily; sidebar entry optional and lower-priority).
  - H1 "Notificações".
  - Filter chips row: `Não resolvidos` (active by default) · `Todos`.
  - Sections: Eyebrow "RECENTES" + 3 NotificationRow items (PO perguntou; INT-2026-015 avançou para Em Captura; RP-041 foi congelado pelo Produto) · Eyebrow "ANTERIORES" + 2 NotificationRow items (Discovery encerrado; INT-2026-004 entregue).
  - Footer ghost link "Marcar todas como lidas".
- [ ] **Step 3: Build new `J5.1.1 · TopBar Notifications dropdown` (new frame)**.
  - Render J2.1 Dashboard as the backdrop (small scrim, 30% black).
  - Position the `TopBarNotifications` dropdown (360 wide, count=3 unread) anchored under the bell in TopBar.
  - Show the same 3 recent items as J5.1 + footer link "Ver todas".
- [ ] **Step 4: Build new `J5.3 · Chat global sobre qualquer tela`** — specimen demonstrating D11.
  - Render J2.1 Dashboard as the backdrop (small scrim, 30% black).
  - Render `GlobalChatSheet` (state=open-empty) on the right side, showing context "DASHBOARD" and the 3 quick suggestions.
- [ ] **Step 5: Verify.** `get_screenshot` of J5.1, J5.1.1, J5.3. Expected: J5.1 is a calm archive; J5.1.1 shows the daily-driver triage right where it lives; J5.3 makes obvious that chat is summonable from anywhere.
- [ ] **Step 6: Checkpoint.** Version `B8 v2 · J5 cross-cutting`.

---

## Phase C — Wiring refactor *(v2)*

### Task C1-bis — Golden path update *(v2)*

- [ ] **Step 1: Re-wire the golden path** to account for the refactored frames: J1.1 → J1.3 → J2.1 (new) → (Nova demanda) → J3.1 (new) → J3.2 (new) → J4.1 (new) → J4.4 (aligned) → J4.6 → J4.12 → J4.13 → J4.14 → J4.16. Use `on tap` → `navigate to`, ease-standard, 200–320ms.
- [ ] **Step 2: Verify.** Open Present mode (or `get_screenshot` per node) and click through. Expected: uninterrupted end-to-end path, no dead hotspots; the new B-frames are reached.
- [ ] **Step 3: Checkpoint.** Version `C1 v2 · golden path`.

### Task C2-bis — New branch demos *(v2)*

- [ ] **Step 1: Global chat demo.** Wire the "Discutir com a IA" button in the TopBar (B0) to navigate from J2.1 → J5.3 (chat sheet open over Dashboard). Wire the ✕ on the sheet back to J2.1.
- [ ] **Step 2: Notifications demo.** Wire the bell icon in TopBar to navigate from J2.1 → J5.1.1 (dropdown frame). Wire "Ver todas" in the dropdown → J5.1.
- [ ] **Step 3: PendencyGroup migration demo on J4.1.** Make the `RequirementRow` for `Alcance` interactive (when tapped, it migrates from `blocking` group to `resolved` group; counts update; the ReadinessRing reaches its 64% state with delta "+26%"). Use Figma interactive components / variant swap on interaction.
- [ ] **Step 4: GateToolbar enable demo.** Wire a flow that demonstrates the GateToolbar switching from `pending` to `ready` when all bloqueantes resolve (terminal state of the J4 enrich path leading into J4.12).
- [ ] **Step 5: Verify.** Click each branch. Expected: branches return cleanly; component states animate on interaction.
- [ ] **Step 6: Checkpoint.** Version `C2 v2 · branches & interactions`.

### Task C3-bis — Final review pass *(v2)*

- [ ] **Step 1:** Full screenshot sweep (`get_screenshot` per frame) for visual consistency post-refactor: tokenized colors, hairline borders, no emoji, Tide signal-only, status-as-dot, type ladder correct, **HeroMetric is the singular gravity center of J2.1**, **AIImpactBanner is present on J2.1 / J4.1 / J4.12**, **GlobalChatSheet button is present in TopBar of every screen**, **TopBarNotifications bell is present in TopBar of every screen**, **GateToolbar is at the bottom of J4.1 (not a header CTA)**, **PendencyGroups replace the flat 8-row list on J4.1**, **no Origem/Tipo selects on J3.1**.
- [ ] **Step 2:** Fix any drift inline.
- [ ] **Step 3:** Verify deleted frames stay deleted (J2.1 old, J2.2 old, J3.1 old, J3.2 old, J4.1 old, J5.1 old, J5.3 old).
- [ ] **Step 4:** Produce a shareable Present link; note the entry node (J1.1).
- [ ] **Step 5: Checkpoint.** Version `C3 v2 · prototype v2`.

---

## Self-Review (run before execution)

**Spec coverage (spec v2 § → task):**
- D9 (entry tone) → B3 v2 ✓
- D10 (AI visibility) → A11 (AIImpactBanner) + B2 v2 + B4 v2 ✓
- D11 (global chat) → A11 (GlobalChatSheet) + B0 + B8 (J5.3) + C2-bis (global chat demo) ✓
- D12 (notifications in TopBar) → A11 (TopBarNotifications) + B0 + B8 (J5.1, J5.1.1) + C2-bis (notifications demo) ✓
- D13 (pay-justifying KPI) → A7-bis (HeroMetric badge slot) + B2 v2 ✓
- §4.6 (urgency-grouped lists) → A9-bis (PendencyGroup) + B4-J4.1 v2 ✓
- §4.7 (gate explains itself) → A9-bis (GateToolbar) + B4-J4.1 v2 ✓
- §4.8 (AI value shown not implied) → A11 (AIImpactBanner) + all v2 screens ✓
- §5.4 new/revised components → A7-bis + A9-bis + A11 ✓
- §8 refactored frames → B2 (J2.1/J2.2) + B3 (J3.1/J3.2) + B4-J4.1 + B8 (J5.1/J5.1.1/J5.3) ✓
- §10 new branch demos (global chat, notifications, pendency-group migration) → C2-bis ✓

**Placeholder scan:** No "TBD/TODO". Token values, type specs, and all visible copy are concrete (seed scenario). `use_figma` JS intentionally deferred to the figma:* skills.

**Type/name consistency:** New components (HeroMetric, CompactKPI, PendencyGroup, GateToolbar, AIImpactBanner, GlobalChatSheet, TopBarNotifications) are referenced in Phase B with matching names.

**Do-not-resurrect (from spec §11 v2):** the flat 8-RequirementRow list on J4.1 · the header CTA on J4.1 · the Notifications rail on J2.1 · the per-screen Copilot pill · the Origem/Tipo selects on J3.1 · the generic KPI row component used as hero on J2.1.

**Delete-when-replaced enforcement:** Task 0 records nodeIDs of replaced frames; B2 / B3 / B4-J4.1 / B8 explicitly delete them before building the new ones. C3-bis Step 3 verifies the deletions stuck.
