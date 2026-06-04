# Spec — Submitter Figma Prototype ("Intake")

> **Status:** Draft v3 (decisions revised 2026-05-29, conceptual model unchanged) · **Date:** 2026-05-27, last touched 2026-05-29 · **Author:** hugo (+ Claude)

> **Revision note (v3 · 2026-05-29):** Two locked decisions evolved as the build progressed. **D8 (Create vs enrich)** and **D9 (Entry tone)** still describe the philosophy ("decoupled creation, demand-panel does the enrichment"), but the **field set** in B2 (create surface) was expanded based on Hugo's review — see "Field-set update (2026-05-29)" below. **D14** (deep-detail screens are fullscreen) added. Seed scenario updated: Hugo Seabra, INT-2026-015 ("SSO/SAML authentication for B2B partners"). File key changed to `6Yfv523dlb2bfZS9zWGJly` (`Intake-Platform`).
> **Type:** Design spec for a high-fidelity, clickable Figma prototype of the Submitter persona's end-to-end experience, built on the Conductor "Paper & Signal" design system. Feeds an implementation (build) plan.

> **Revision note (v2):** The spec's conceptual model (compliance contract, confidence layer, dispositions, Readiness Score, RICE-lite, semantic reflection, RICE tensions, projected-vs-realized) is **kept intact** — it is more mature than any prototype. What this revision changes is the **visual choreography and inventory** so the Figma execution stops feeling like a wireframe and starts feeling like a living product. Driver of change: `prototypes/demandos-prototype-unified-v1.tsx` ships the visual maturity (HeroMetric, AIImpactBanner, global ChatSheet, TopBar notifications, "tell-me-as-a-colleague" entry tone, urgency-grouped Demand Panel, sticky-bottom toolbar with contextual gate copy) that the conceptual maturity of the docs deserves. The unified-v1 is **visual reference**, not conceptual ground truth — the docs remain the source of truth for what the Submitter *is*.

---

## 1. Purpose & validation goal

Build a Figma prototype we can put in front of a **real Submitter (COO / CEO / Sales)** to validate the end-to-end experience of the intake product. The prototype must let them feel the whole simulated process:

- a demand is **created**, then **enriched/matured** with AI help,
- **handed off to the PO**, and the Submitter can then **monitor the steps ahead** (and see how the PO edits/triages it),
- the **dashboard** surfaces the metrics and information that matter to them,
- and throughout, the **AI inside the platform empowers the velocity and maturity** of the demand (product requirement).

The prototype aims at the **final product**: all Submitter journeys designed, every state explicit, **no implicit screens**.

The reasoning model behind the screens (compliance contract, confidence layer, dispositions, Readiness Score, RICE-lite, 3-layer metrics) lives in [`personas/01-submitter.md`](../../../personas/01-submitter.md), [`templates/00-submitter-brief.md`](../../../templates/00-submitter-brief.md) and [`metrics.md`](../../../metrics.md). This spec instantiates that model as a UI.

**Primary research:**
- Conceptual ground truth: `personas/01-submitter.md`, `templates/00-submitter-brief.md`, `metrics.md`.
- Visual & choreography reference: `prototypes/demandos-prototype-unified-v1.tsx` (most mature *experience*, even if conceptually behind the docs in places).
- Earlier prototypes (`v167`, `fase2-v9`, `fase4-v8`) are superseded.

## 2. Persona & seed scenario

**Persona:** the Submitter — non-technical, business-language native (problem / value / opportunity / relationship). Cannot be asked to think like an engineer; the system meets her in her language and does the translation *for* her.

**Seed scenario (the demand we prototype):** Hugo Seabra, COO. *"A top-3 enterprise account is threatening non-renewal unless we ship SSO/SAML login + audit-log export."* Chosen because it carries a clear ARR figure (Impact), a clear affected segment (Reach), real time pressure (Urgency), and natural tensions for the RICE-lite mirror. Easily swappable.

## 3. Locked design decisions

| # | Decision | Choice |
|---|---|---|
| D1 | AI modality | **Conversational development is the spine.** The demand matures through dialogue; the readiness canvas is the materialized state the conversation writes to; every element (sources, fields, AI suggestions, reflection text, requirements, RICE indicators) is addressable back into chat as a referenced block. |
| D2 | Aesthetic | **Conductor "Paper & Signal"** — stone paper canvas, single Tide-teal as signal, Hanken Grotesk (titles/labels) / Inter (body) / Geist Mono (identifiers, eyebrows, numerics). Flat, near-shadowless, no imagery, no emoji. |
| D3 | Component base | **shadcn/ui primitives** restyled with Conductor tokens (continues the existing "shadcn pilot" component set). |
| D4 | Device | **Desktop, 1440 viewport.** Sidebar 256 · centered work column · top bar 66. |
| D5 | Fidelity | **High-fidelity, final-product intent, every state explicit** — empty / AI-reading / parsing / recording / transcribing / filled / disposition / tension / confirm / error. |
| D6 | Seed scenario | Hugo Seabra (COO) + the SSO/SAML + audit-log demand (see §2). |
| D7 | Figma file | New file **"Intake · Submitter"** using Conductor as the visual language (Conductor itself is a different product). |
| D8 | Create vs enrich | **Decoupled.** Creating a demand captures only **basic info** (fast, low-friction) and produces a **Draft**. All enrichment happens later, over multiple sessions, from a dedicated **Demand Panel** page — because maturing a good demand takes time and depends on external inputs the Submitter does not control. The Demand Panel is the **central object**, spanning the demand's whole lifecycle (enrich → handoff → monitor → outcome). |
| D9 *(new)* | Entry tone | **"Tell me as if you were talking to a colleague."** Quick-create is a single rich problem field + optional artifact/voice. Origin/type are inferred by the AI from the narrative or artifact — they are NOT separate form inputs the Submitter has to classify. This honors the persona's "she does not think like an engineer" constraint. |
| D10 *(new)* | AI visibility | **AI value must be visible across the product, not only inside a demand.** A persistent `AIImpactBanner` (hours saved + % automated for the current artifact/context) appears at the top of every primary screen (Dashboard, Demand Panel, Pre-send Review). It is the explicit answer to "would she pay for this?" — she sees the value the AI is producing every time she opens the app. |
| D11 *(new)* | Chat invocation | **The copilot is global, not per-screen.** A single `GlobalChatSheet` is summoned from a TopBar button on every screen; context (current demand, selected block, current dashboard) flows in automatically. The "Discuss this" block-reference pattern (§7) is its primary input. The Demand Panel's Conversation zone is the *same* sheet, anchored open in `phase=drafting`. |
| D12 *(new)* | Notifications | **Notifications are anchored to the TopBar.** A bell icon with unread badge opens a dropdown for triage; the dedicated `J5.1 Notifications` page is the "view all" fallback, reachable from "View all" in the dropdown. They are not a sidebar menu item competing with primary workflow. |
| D13 *(new)* | Pay-justifying KPI | **The Dashboard has one number-king.** A `HeroMetric` with explicit `badge="Pay-justifying KPI"`, trend, sparkline and sub-composition occupies the visual gravity center. For the Submitter that number is **"Financial impact of your demands in production (YTD)"** (R$ 412k). All other KPIs are secondary (`CompactKPI` grid) and orbit it. |
| D14 *(v3, 2026-05-29)* | Deep-detail screens are fullscreen | **B4 Demand Panel and similar deep-journey screens hide the global sidebar.** The full 1440w is the work surface; the TopBar breadcrumb ("Demands") is the close affordance. Pages that keep the sidebar: B0, B1, B2, C-series. Future deep-journey pages (B5 Discovery, etc.) follow this pattern. |

### Field-set update (2026-05-29) — B2 create surface

D8/D9 are unchanged in spirit ("creation is decoupled from enrichment; tell me as a colleague"), but B2's actual field set was expanded after live review. The build now captures, on the create surface itself:

- **Title** — short demand name (single-line Input)
- **Description** — rich problem field with mic affordance (textarea, or recording state in the audio variant)
- **Evidence** — `Attach file` + `Record audio` ghost buttons
- **Context · OPTIONAL** — Tags (chips, removable), Urgency (4-pill picker, default+selected), Deadline (date field), People (avatar + add)

Why the expansion: "the moment the submitter has information to input" should not be blank when the user already has voice/files/context in hand. The original "single rich problem field" model still applies for **users with nothing but a sentence to say** (the mic + textarea covers them), but power users with deck/transcript/known stakeholders can drop everything they have without bouncing to a later step. The Context section is explicitly optional to preserve D9's "no classification required" guarantee.

## 4. Experience principles (carried into every screen)

From the persona + the Conductor README, augmented by the visual choreography from `unified-v1`:

1. **Not a form being validated — a partner that understood the demand.** Contract lens renders as *readiness*; semantic lens renders as *meaning reflected back in her language*. The AI shows its work (sources contributed, fields inferred, what is firm and what needs Discovery).
2. **Confidence is first-class and visible.** Every substantive value carries `confidence / source / status / hint`. Honesty is the differentiator.
3. **"I don't know" never blocks.** It routes to an honest disposition (`answered / inferred / assumption / discovery / deferred`). The gate is "every blocking requirement has an honest disposition," not "she knows everything."
4. **RICE-lite is a mirror, not a ranking.** Tensions between indicators are gentle provocations that sharpen thinking; sharpening also raises readiness.
5. **Operational quiet.** Bloomberg-terminal / Linear calm. Declarative noun headers, imperative buttons, middot metadata, status as a colored dot + label, no emoji.
6. *(new)* **Urgency is grouped, not hidden.** Lists of work — pending items, requirements, notifications — group **by what the Submitter must do now** ("Block submission" → "In discovery/assumption" → "Answered"), with the danger group on top and visible by default and the resolved group collapsible. Flat lists are out.
7. *(new)* **The gate explains itself.** When an action is blocked (e.g. "Send to PO" disabled), the surrounding UI states *what* unblocks it in business language ("2 blocking requirements still lack an honest disposition") and how to act, never just a greyed-out button.
8. *(new)* **AI value is shown, not implied.** Every screen makes visible what the AI contributed in this context: hours saved, fields pre-filled, sources mined, blocks discussable. Invisible AI cannot be paid for.

## 5. Foundations (Phase A — build first in Figma)

No screen is built before its components exist.

### 5.1 Variable collections (from Conductor `tokens.css`)
- **Color** — stone scale (paper/surfaces/borders/text), Tide scale (signal), state families (draft·slate / triage·violet / discovery·blue / ready·green / running·tide / paused·amber / error·red), provider dots, surface/text/border semantics.
- **Spacing** — 8px grid (`sm 8 · md 12 · lg 16 · xl 24 · 2xl 32 · 3xl 48 · 4xl 64`).
- **Radii** — 6 / 8 / 12 / 16 / 9999.
- **Elevation** — elev-1 / elev-2 / elev-pop.
- Light mode only; `dark` slot reserved.

### 5.2 Type styles
Display (Hanken 800, 40–56, -0.02em) · Title/Label (Hanken 700) · Body (Inter 400/500) · Eyebrow (Geist Mono caps, Tide, middot-separated) · Identifier & numeric (Geist Mono).

### 5.3 Primitive components (shadcn/ui → Conductor tokens)
Button (variants: primary/secondary/ghost/destructive) · Input · Textarea · Select · Checkbox/Radio · Badge · Segmented · Tabs · Card · Tooltip · Progress · Dialog · **DrawerShell** (480/560) · **TakeoverShell** (720 column) · **Stepper** · ProgressStepRow · Toast · Sidebar · TopBar.

### 5.4 Domain components (the Submitter kit)

> Components marked *(new)* are added in v2 of the spec. Components marked *(revised)* exist already but have new variants/structure. Everything else is unchanged.

**Readiness, confidence, requirements**
- **ReadinessRing** — score gauge; variants: building / near-gate / gateReady; optional `delta` overlay (e.g. `+26%`).
- **ConfidenceBar** — 0–100 + source + hint; 10 segments; status: empty / low_confidence / resolved.
- **RequirementRow** — one of 8 compliance reqs: label · dimension · confidence · disposition · blocksGate flag; **addressable**.
- **DispositionPill** + **DispositionPicker** — answered / inferred / assumption / discovery / deferred.

**Value mirror & reflection**
- **ValueIndicatorMeter** — RICE-lite Impact/Reach/Urgency (L/M/H) + confidence + contextual justification (Body/sm); **addressable**.
- **TensionCallout** — gentle provocation card.
- **SemanticReflectionCard** — "here's what this demand *is*, in your words"; spans **addressable**.

**Conversation, input, sources**
- **MultimodalComposer** — text + mic + attach + pinned block chips + send (see §6).
- **VoiceRecorder** — idle / recording (waveform) / transcribing / transcribed / error.
- **UploadDropzone** — idle / dragging / parsing / parsed / error.
- **SourceCard** — file / voice memo / typed note, with "contributed N fields" + confidence; **addressable**.
- **SourcesTray** — persistent "what the AI knows" inventory.
- **BlockReferenceChip** (quote-card) + **DiscussAffordance** (the hover/select pin) — see §7.
- **CopilotMessage** (incl. reply-quoting-a-block variant) · **EvidenceChip** · **StakeholderRow**.

**Metrics & navigation**
- *(revised)* **HeroMetric** — the dashboard number-king. Anatomy: Eyebrow label · big number H2 (mono numerics) · trailing suffix · trend chip (↑/↓ with delta) · sub-composition (Body/sm: "8 delivered · 3 with confirmed ROI · 1 in progress") · `Sparkline` to the right · accent stripe in persona color · explicit `badge="Pay-justifying KPI"` slot. Replaces the generic `KPICard` for the *one* hero metric per screen.
- *(new)* **CompactKPI** — secondary KPI grid card. Anatomy: Eyebrow label · Icon (top-right, in accent wash) · big-but-not-hero number · suffix · optional trend · Body/sm sub. Used in 3×2 grids beneath the HeroMetric.
- **KPICard** — kept for cases where neither hero nor compact fits (e.g. drill-downs).
- **Sparkline / Donut / FunnelChart** (5 bars 14→11→9→7→3, labels Meta).
- **TimelineStateRow** — dot + state label (Label) + actor + timestamp (Meta).
- **StateBadge** — demand lifecycle: draft / capturing / triage / discovery / rationalization / RP-frozen / execution / delivered / backlog / archived-rejected.

**Panel & cross-cutting**
- **DemandPanel** — the per-demand page shell; layout variants: drafting/enriching · handoff · handed-off/monitoring · outcome · backlog · archived. **DraftBadge** + **Save-and-exit** affordance.
- *(new)* **PendencyGroup** — section header with state color + dot + Eyebrow label + count; collapsible body. Three canonical groups for the Demand Panel `phase=drafting`: **"Block submission"** (state/error, expanded), **"In discovery / assumption / delegated"** (state/canary, expanded), **"Answered"** (state/production, collapsed). Replaces the flat list of 8 RequirementRows.
- *(new)* **GateToolbar** — sticky bottom toolbar inside DemandPanel. Anatomy: left side = gate status copy in business language ("2 blocking requirements still lack an honest disposition" / "Ready to send — all blocking requirements have an honest disposition"); right side = secondary "Review all" + primary "Send to PO" (disabled until gateReady, animate-pulse when enabled).
- **CollectInboxItem** — a PO async question + her batched answer (decoupled enrichment).
- **CommentThread / CommentItem** — inline collaboration on demand sections.
- **EscalationModal** — escalate-early / flag-blocker urgency valve.
- **TourBanner / OnboardingStep** — first-run guidance for a non-technical exec. Surface `surface/sunken`, 4-item checklist (per `unified-v1`), "Got it, hide" ghost dismiss.

**AI visibility & global chat**
- *(new)* **AIImpactBanner** — horizontal banner shown above the HeroMetric on Dashboard and at the top of the Demand Panel canvas. Anatomy: small Zap-icon square in `brand/tide-bright` · Eyebrow "AI Impact" · Body label ("18h saved · 65% automated in this artifact") · right-aligned two stat blocks (`{hoursSaved}h saved` + `{automatedPct}% automated`). Surface: subtle gradient `tide-wash → persona-accent-wash`. Always present; never decorative — its numbers must be true to context (e.g. on the Demand Panel, it reflects this demand; on the Dashboard, it reflects the portfolio).
- *(new)* **GlobalChatSheet** — right-anchored sheet (420 wide, full height), invoked from a TopBar button "Discuss with AI" (Sparkles icon + label) present on every screen. Anatomy: header (Sparkles avatar · "AI Assistant" title · Eyebrow `Context: {current-route-label}` · close ✕) · scrollable message list (`CopilotMessage` ai/user variants, including the `quotesBlock` variant) · empty-state with 3 quick suggestions ("Summarize the demand status", "Which ADRs are involved?", "What is the estimated ROI?") · pinned-blocks strip · `MultimodalComposer` at the bottom. Variants: `state = closed | open-empty | open-conversation`. In Demand Panel `phase=drafting` the sheet is *anchored open* and shares state with the panel's Conversation zone (one and the same chat, not two).
- *(new)* **TopBarNotifications** — bell icon on the right side of the TopBar with unread count badge (slate dot if 0, error dot if >0). Click opens a 360-wide dropdown: Eyebrow "Notifications" · top 5 `NotificationRow` items (status + body + timestamp) · footer link "View all" → J5.1. The dedicated J5.1 page exists as the full archive.

**Removed from inventory in v2 (replaced or absorbed)**
- ~~"Notifications rail" on Dashboard~~ — replaced by `TopBarNotifications`.
- ~~Flat list of 8 `RequirementRow` in J4.1~~ — wrapped by `PendencyGroup`s.
- ~~Header CTA "Send to PO" on J4.1~~ — moved into `GateToolbar` at bottom.
- ~~Per-screen Copilot pill (J5.3)~~ — replaced by `GlobalChatSheet` button on TopBar; J5.3 frame becomes the "global chat sheet open from any screen" specimen.

## 6. Input strategy — all three modalities, everywhere

One **MultimodalComposer** is the constant affordance — present in the GlobalChatSheet, in the Demand Panel's Conversation zone (which is the sheet anchored open), and in the New Demand entry.

| Modality | Role | Behavior |
|---|---|---|
| **Typing** | Default turn + free context | Becomes a chat message; bot proposes canvas updates. |
| **File upload** | Drop deck / email / PDF / sheet | AI mines it → pre-fills fields as `inferred` with the file as `source` + partial confidence; shows an extraction summary ("read your deck — found 5 of 8"). |
| **Voice** | (a) dictate a turn, (b) attach a voice memo | **Dictated turn** → transcript becomes a chat message; bot interprets and *proposes* field updates she confirms. **Voice memo as source** → mined like a document (`inferred` + memo as `source`). Nothing auto-commits to a field without her seeing it. |

**Sources tray** — a persistent inventory of everything the AI is aware of (uploads, voice memos, typed context). Each entry shows *what it contributed* (which fields, at what confidence), making the bot's global awareness tangible and trustworthy, and tying directly to the persona's `source` attribute. Each source is itself block-referenceable.

## 7. Core pattern — Block-reference-to-chat ("Discuss this")

1. **Addressable everything.** Hover/select any unit — a requirement row, an AI-suggested value, a sentence in the semantic reflection, an excerpt in an uploaded source, a RICE tension, a KPI card, a HeroMetric sub-composition — and a floating **"Discuss with AI"** affordance appears (Figma-comment / Notion-quote style).
2. **Pin it.** The block drops into the composer as a **BlockReferenceChip** (quote-card). Multiple pins allowed.
3. **Harden the turn.** Her message is anchored to that block; the bot's reply quotes the block back and addresses exactly it. The bot retains **global context** (all sources + all injected content + the current screen route) — the pin just *focuses* this turn so it's precisely addressed.
4. **Canvas updates.** Resolution flows back: confidence rises, a disposition resolves, a to-do clears, the readiness ring moves.
5. *(new)* **Cross-screen pinning.** A block pinned from a Dashboard KPI opens the `GlobalChatSheet` with that block already in the composer — discussing a number is a one-click action, not a navigation puzzle.

## 8. Journey & screen map (Phase B — every frame explicit)

> Frame IDs are for 1:1 mapping in the build plan. Each transient state listed is its own frame. Frames marked *(refactored)* are being rebuilt in v2; frames not marked are unchanged from v1.

**J1 · Entry**
- J1.1 Sign in
- J1.2 Landing → Dashboard
- J1.3 First-run onboarding (TourBanner overlaid on Dashboard): 4 bullets in business language ("You create demands and track impact — the system handles the rest" · "The Hero Metric below shows the value generated by your demands in production" · "Click 'Show the example' to see a complete RP" · "You don't fill out forms — AI captures through text, PDF or audio"), "Got it, hide" ghost.

**J2 · Submitter Dashboard** *(refactored)*
- **J2.1 Dashboard** — vertical rhythm from top to bottom:
  1. TopBar (with Notifications bell, "Discuss with AI" button) + Sidebar.
  2. Header row: Eyebrow "Submitter Panel" · H1 "Good morning, Carlos" · Body/sm "You have 1 active demand, 8 delivered this year" · primary "New Demand" CTA top-right.
  3. **AIImpactBanner** — "18h saved · 65% automated in this portfolio" (portfolio scope).
  4. **HeroMetric** — `label="Financial impact of your demands in production (YTD)"` · `value="R$ 412k"` · `trend="+R$ 78k projected on this demand"` · `sub="8 delivered · 3 with confirmed ROI · 1 in progress"` · `sparklineData` (8 monthly points) · `badge="Pay-justifying KPI"`.
  5. **CompactKPI grid (3×2)** — Active demands (1) · Accepted this year (8/14, 57%) · Average time to freeze (6.2d, -2.1d vs market) · Hours you did not spend ({hours}h, accent AI) · Average realized ROI (4.2x) · Projected default rate.
  6. **Showcase card** — gradient `tide-wash → tide-wash-2`, Award icon, "See a complete RP: RP-2026-000 · WebSocket Notifications — every claim has a traceable source", click → ShowcaseRP. (Kept from original spec, restyled.)
  7. **"My demands" list** — moved to its own primary route (`My Demands` in sidebar), NOT cluttering the dashboard. Dashboard shows a 3-row preview ("Recent demands") with link "View all".
- **J2.2 Dashboard — empty state** — same chrome, HeroMetric shows "—" with helper "Create your first demand to start measuring impact", CompactKPI grid hidden, big "New Demand" CTA center.

**J3 · Create demand (quick capture — light)** *(refactored)*
> Decoupled from enrichment. Goal: get the demand out of her head in under a minute; structure it later. Honors D9 — tell-me-as-a-colleague.
- **J3.1 New demand** — `TakeoverShell` (720 column, not a side drawer). Centered:
  - H1 "New Demand"
  - Body "Tell us as if you were talking to a colleague. The platform handles the structure."
  - Single big textarea labelled "What happened?" (8 rows, surface/card)
  - Below: Eyebrow "Or attach something that helps" + secondary buttons `Upload document` (UploadDropzone trigger) + `Record audio` (VoiceRecorder trigger)
  - Footer: primary "Save draft" (always enabled once textarea has content OR an artifact is attached).
  - **No** Origin/Type selects — these are inferred by the AI from the narrative or artifact during the AI quick-read step.
- **J3.2 AI reading** — `TakeoverShell` content swaps to a process view:
  - Loader2 spinning · H2 "Processing…"
  - Three `ProgressStepRow` items: "Reading your text" → "Analyzing strategy-monetization.pdf" → "Identifying useful information for the demand…"
  - When done, swap to success: green check · H2 "Processing complete" · Body "I read your document and identified 5 useful pieces of information. I will use them to get ahead of the filling. Only 3 pending items remain for you to answer." · primary "Continue" → J4.1.
- **J3.3 Lands on the Demand Panel in Draft state** — animated transition into J4.1.

**J4 · Demand Panel (the dedicated per-demand page — the heart)**
> One persistent, beautiful page that is the home of a demand across its WHOLE lifecycle. Enrichment happens here over many sessions; she can leave and return; Discovery/assumptions wait on external inputs she doesn't control. Layout emphasis shifts by lifecycle phase.

*Drafting / Enriching layout* *(refactored — J4.1 only)*
- **J4.1 Panel shell** — DemandPanel `phase=drafting`:
  - **Identity header**: INT-2026-015 (Mono) · separator · `StateBadge` (In Capture) · spacer · `ReadinessRing` 38% (with `delta` slot for +26% animation in J4.4).
  - Title H2: "Enterprise account at risk of churn requires SSO/SAML + audit log export."
  - **AIImpactBanner** (demand-scoped): "12h saved on this demand · 5 of 8 requirements pre-filled · 3 sources mined".
  - **Three-zone body**:
    - Left zone (380 wide) — **Conversation**: same content as GlobalChatSheet, anchored-open variant. `CopilotMessage` ai opening turn ("I read your deck and the renewal email. I identified 5 of 8 pieces of information. To start: who feels this pain the most — which accounts or segments?") + composer.
    - Center zone (619 wide) — **Canvas**: organized in **PendencyGroups** instead of a flat list:
      - PendencyGroup "Block submission" (state/error, expanded) — RequirementRows for the blocking items still without honest disposition (e.g. Reach, Constraints, Stakeholders).
      - `SemanticReflectionCard` ("WHAT THIS DEMAND IS" · "A strategic enterprise account threatens non-renewal without SSO/SAML…") — sits between groups as the meaning anchor.
      - `ValueIndicatorMeters` (Impact / Reach / Urgency) with contextual justifications.
      - PendencyGroup "In discovery / assumption / delegated" (state/canary, expanded) — RequirementRows where disposition is honest but not answered yet (e.g. Business impact = Assumption).
      - PendencyGroup "Answered" (state/production, collapsed by default with count) — RequirementRows resolved.
    - Right zone (279 wide) — **Sources tray** (`SourcesTray` with 3 `SourceCard`s).
  - **GateToolbar (sticky bottom)** — left: "2 blocking requirements still lack an honest disposition" (state/canary copy when between 1–N pending) → "Ready to send — all blocking requirements have an honest disposition" (state/production copy when gateReady); right: "Review all" ghost + "Send to PO" primary (disabled with explanation tooltip until gateReady).
- J4.2 Composer states — typing · recording · transcribing · file-attached · 1 block pinned · multiple blocks pinned (unchanged).
- J4.3 Bot reply quoting a pinned block (unchanged).
- J4.4 Answer-a-question turn (business language) → canvas update (ReadinessRing delta "+26%"). Note: the resolved RequirementRow migrates visually from the "Block submission" group into the "Answered" group; the count badges update.
- J4.5 "I don't know" → DispositionPicker → explicit frames: assumption · discovery · deferred (unchanged).
- J4.6 RICE-lite mirror + TensionCallout + tension-resolution turn (unchanged).
- J4.7 Evidence/Sources detail · Stakeholders · Constraints sub-views (unchanged).
- J4.8 Save & exit — Draft persists (return-later); appears as a Draft on the dashboard (unchanged).
- J4.9 Collect inbox — PO's async questions land on the panel; she answers in business language without re-opening the whole flow (unchanged).
- J4.10 Comments thread — inline PO/CTO/PM comments on sections + her replies (unchanged).
- J4.11 Escalate / flag blocker — urgency valve when waiting on something stuck (unchanged).

*Handoff*
- J4.12 Pre-send review — readiness checkpoint: every blocking requirement has an honest disposition (gateReady); the Intake Record (INT-2026-NNN) shown read-only; **AIImpactBanner** present ("Ready after 38min of your work · 12h saved · 65% automated").
- J4.13 Handoff to PO confirm → success.

*Handed-off / Monitoring layout*
- J4.14 Timeline (unchanged).
- J4.15 What the PO did (unchanged).

*Outcome layout*
- J4.16 Projected vs realized (unchanged — this is exemplary in v1).

*Closure states*
- J4.17 Backlog (unchanged).
- J4.18 Archived / Rejected (unchanged).

**J5 · Cross-cutting** *(refactored — J5.1 and J5.3)*
- **J5.1 Notifications full page** — reachable from the TopBar bell's "View all". Filter chips · grouped list (Recent / Earlier) · `NotificationRow`s · "Mark all as read" ghost. This is the archive view; the TopBar dropdown is the daily-driver triage.
- **J5.1.1 TopBar Notifications dropdown** *(new frame)* — 360-wide popover anchored under the bell icon, showing top 5 notifications + "View all" footer link.
- J5.2 Comments / collaboration thread (unchanged).
- **J5.3 GlobalChatSheet — open from a non-Demand-Panel screen** *(refactored)* — specimen showing the sheet open over J2.1 Dashboard, with empty-state + 3 quick suggestions, demonstrating that chat is global.
- J5.4 Global empty & error states (unchanged).

## 9. AI empowerment thread

Pre-fill extractor (with sources) → conversational gap-closer (one business-language question at a time) → tension-spotter on RICE-lite → disposition coach ("don't know? mark it an assumption, or send to Discovery") → summarizer that produces the Intake Record. **Velocity** = fewer blank fields to fight manually; **maturity** = the Readiness Score climbs visibly as honest dispositions resolve — as a *conversation*, not a form. *(new)* Visibility is made explicit at all times via `AIImpactBanner`, so the Submitter never has to wonder if the AI is "really doing something" — the contribution count is shown.

## 10. Prototype wiring & fidelity

- Clickable **golden path** end-to-end (J1 → J2 → J3 create → J4 panel: enrich → handoff → monitor → outcome).
- Explicit **branch demos**: the disposition fork (J4.5), a tension resolution (J4.6), a PO rebound (J4.15), and the **save-and-return loop** (J4.8 → dashboard Draft → back into the panel) that proves create/enrich is decoupled.
- *(new)* **Global chat demo**: from J2.1 Dashboard, click "Discuss with AI" in the TopBar → J5.3 (sheet open) → close → land back on J2.1. Demonstrates D11.
- *(new)* **Notifications demo**: from J2.1, click the bell → J5.1.1 dropdown → click "View all" → J5.1 page. Demonstrates D12.
- *(new)* **Pending-group demo on J4.1**: click an "In discovery" RequirementRow → DispositionPicker → resolve as `answered` → row migrates to the "Answered" group (animate); the "Block submission" group shrinks; if all blocking items are resolved, the GateToolbar switches state and the CTA enables.
- Figma interactive components for state toggles where they sell the experience (composer states, ConfidenceBar fill, ReadinessRing progress with the "+26%" delta, AIImpactBanner number animation, GateToolbar enabled/disabled).
- Goal: a real COO clicks through unaided.

## 11. Out of scope (this prototype)

- Other personas' working UIs (PO/CTO/PM/Tech Leads) beyond the read-mostly reflection the Submitter sees in J4.15.
- Dark mode (token slot reserved, not designed).
- Real backend / functional AI — all AI behavior is scripted for the validation narrative.
- Production code / CSS / handoff specs — this is a Figma prototype.

**Superseded prototype concepts — do NOT resurrect** (dropped between v167/unified-v1 explorations): the three separate per-section pending item modals (use one unified DispositionPicker/answer flow instead) · PlaceholderDashboards for non-Submitter personas · DrillDownModal · RationalizationsListScreen (dead code) · ShowcaseRPScreen.

**Superseded patterns from v1 of THIS spec — do NOT keep** (replaced in v2): the flat 8-RequirementRow list on J4.1 (use PendencyGroups) · the header CTA "Send to PO" on J4.1 (moved to GateToolbar) · the Notifications rail on J2.1 (moved to TopBar) · the per-screen Copilot pill J5.3 (replaced by GlobalChatSheet) · the Origin/Type selects on J3.1 (inferred by AI) · the generic KPI row on J2.1 (replaced by HeroMetric + CompactKPI grid).

## 12. Build sequence

1. **Phase A — Foundations:** variables → type → primitives → domain components (figma-generate-library). v2 adds A7-bis (HeroMetric refactor + CompactKPI), A9-bis (PendencyGroup + GateToolbar), A11 (AIImpactBanner + GlobalChatSheet + TopBarNotifications).
2. **Phase B — Journeys:** assemble J1–J5 frames from components, every state explicit (figma-generate-design). v2 rebuilds B2 (J2.1/J2.2), B3 (J3.1/J3.2), refactors first frame of B4 (J4.1), refactors B8 (J5.1, J5.3) and adds J5.1.1.
3. **Phase C — Wiring:** golden path + branch demos + interactive components.

Implementation plan: `docs/superpowers/plans/2026-05-27-submitter-figma-prototype.md` (revised v2).
