# Spec — Submitter Figma Prototype ("Intake")

> **Status:** Draft for review · **Date:** 2026-05-27 · **Author:** hugo (+ Claude)
> **Type:** Design spec for a high-fidelity, clickable Figma prototype of the Submitter persona's end-to-end experience, built on the Conductor "Paper & Signal" design system. Feeds an implementation (build) plan.

---

## 1. Purpose & validation goal

Build a Figma prototype we can put in front of a **real Submitter (COO / CEO / Sales)** to validate the end-to-end experience of the intake product. The prototype must let them feel the whole simulated process:

- a demand is **created**, then **enriched/matured** with AI help,
- **handed off to the PO**, and the Submitter can then **monitor the steps ahead** (and see how the PO edits/triages it),
- the **dashboard** surfaces the metrics and information that matter to them,
- and throughout, the **AI inside the platform empowers the velocity and maturity** of the demand (product requirement).

The prototype aims at the **final product**: all Submitter journeys designed, every state explicit, **no implicit screens**.

The reasoning model behind the screens (compliance contract, confidence layer, dispositions, Readiness Score, RICE-lite, 3-layer metrics) lives in [`personas/01-submitter.md`](../../../personas/01-submitter.md), [`templates/00-intake-record.md`](../../../templates/00-intake-record.md) and [`metrics.md`](../../../metrics.md). This spec instantiates that model as a UI.

## 2. Persona & seed scenario

**Persona:** the Submitter — non-technical, business-language native (problem / value / opportunity / relationship). Cannot be asked to think like an engineer; the system meets her in her language and does the translation *for* her.

**Seed scenario (the demand we prototype):** Carlos Silva, COO. *"A top-3 enterprise account is threatening non-renewal unless we ship SSO/SAML login + audit-log export."* Chosen because it carries a clear ARR figure (Impact), a clear affected segment (Reach), real time pressure (Urgency), and natural tensions for the RICE-lite mirror. Easily swappable.

## 3. Locked design decisions

| # | Decision | Choice |
|---|---|---|
| D1 | AI modality | **Conversational development is the spine.** The demand matures through dialogue; the readiness canvas is the materialized state the conversation writes to; every element (sources, fields, AI suggestions, reflection text, requirements, RICE indicators) is addressable back into chat as a referenced block. |
| D2 | Aesthetic | **Conductor "Paper & Signal"** — stone paper canvas, single Tide-teal as signal, Hanken Grotesk (titles/labels) / Inter (body) / Geist Mono (identifiers, eyebrows, numerics). Flat, near-shadowless, no imagery, no emoji. |
| D3 | Component base | **shadcn/ui primitives** restyled with Conductor tokens (continues the existing "shadcn pilot" component set). |
| D4 | Device | **Desktop, 1440 viewport.** Sidebar 256 · centered work column · top bar 66. |
| D5 | Fidelity | **High-fidelity, final-product intent, every state explicit** — empty / AI-reading / parsing / recording / transcribing / filled / disposition / tension / confirm / error. |
| D6 | Seed scenario | Carlos Silva (COO) + the SSO/SAML + audit-log demand (see §2). |
| D7 | Figma file | New file **"Intake · Submitter"** using Conductor as the visual language (Conductor itself is a different product). |

## 4. Experience principles (carried into every screen)

From the persona + the Conductor README:

1. **Not a form being validated — a partner that understood the demand.** Contract lens renders as *readiness*; semantic lens renders as *meaning reflected back in her language*.
2. **Confidence is first-class and visible.** Every substantive value carries `confidence / source / status / hint`. Honesty is the differentiator — the UI shows what is firm and what needs Discovery.
3. **"I don't know" never blocks.** It routes to an honest disposition (`answered / inferred / assumption / discovery / deferred`). The gate is "every blocking requirement has an honest disposition," not "she knows everything."
4. **RICE-lite is a mirror, not a ranking.** Tensions between indicators are gentle provocations that sharpen thinking; sharpening also raises readiness.
5. **Operational quiet.** Bloomberg-terminal / Linear calm. Declarative noun headers, imperative buttons, middot metadata, status as a colored dot + label, no emoji.

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

### 5.4 Domain components (the Submitter kit — new)
- **ReadinessRing** — score gauge; variants: building / near-gate / gateReady.
- **ConfidenceBar** — 0–100 + source + hint; status: empty / low_confidence / resolved.
- **RequirementRow** — one of 8 compliance reqs: label · dimension · confidence · disposition · blocksGate flag; **addressable**.
- **DispositionPill** + **DispositionPicker** — answered / inferred / assumption / discovery / deferred.
- **ValueIndicatorMeter** — RICE-lite Impacto/Alcance/Urgência (B/M/A) + confidence; **addressable**. **TensionCallout** — the gentle provocation.
- **SemanticReflectionCard** — "here's what this demand *is*, in your words"; spans **addressable**.
- **MultimodalComposer** — text + mic + attach + pinned block chips + send (see §6).
- **VoiceRecorder** — idle / recording (waveform) / transcribing / transcribed / error.
- **UploadDropzone** — idle / dragging / parsing / parsed / error.
- **SourceCard** — file / voice memo / typed note, with "contributed N fields" + confidence; **addressable**.
- **SourcesTray** — persistent "what the AI knows" inventory.
- **BlockReferenceChip** (quote-card) + **DiscussAffordance** (the hover/select pin) — see §7.
- **CopilotMessage** (incl. reply-quoting-a-block variant) · **EvidenceChip** · **StakeholderRow**.
- **KPICard** · **Sparkline / Donut / Funnel** minis · **TimelineStateRow** · **StateBadge** (demand lifecycle).

## 6. Input strategy — all three modalities, everywhere

One **MultimodalComposer** is the constant affordance — present at demand entry and persistently in the workspace.

| Modality | Role | Behavior |
|---|---|---|
| **Typing** | Default turn + free context | Becomes a chat message; bot proposes canvas updates. |
| **File upload** | Drop deck / email / PDF / sheet | AI mines it → pre-fills fields as `inferred` with the file as `source` + partial confidence; shows an extraction summary ("read your deck — found 5 of 8"). |
| **Voice** | (a) dictate a turn, (b) attach a voice memo | **Dictated turn** → transcript becomes a chat message; bot interprets and *proposes* field updates she confirms. **Voice memo as source** → mined like a document (`inferred` + memo as `source`). Nothing auto-commits to a field without her seeing it. |

**Sources tray** — a persistent inventory of everything the AI is aware of (uploads, voice memos, typed context). Each entry shows *what it contributed* (which fields, at what confidence), making the bot's global awareness tangible and trustworthy, and tying directly to the persona's `source` attribute. Each source is itself block-referenceable.

## 7. Core pattern — Block-reference-to-chat ("Discuss this")

1. **Addressable everything.** Hover/select any unit — a requirement row, an AI-suggested value, a sentence in the semantic reflection, an excerpt in an uploaded source, a RICE tension — and a floating **"Discuss with AI"** affordance appears (Figma-comment / Notion-quote style).
2. **Pin it.** The block drops into the composer as a **BlockReferenceChip** (quote-card). Multiple pins allowed.
3. **Harden the turn.** Her message is anchored to that block; the bot's reply quotes the block back and addresses exactly it. The bot retains **global context** (all sources + all injected content) — the pin just *focuses* this turn so it's precisely addressed.
4. **Canvas updates.** Resolution flows back: confidence rises, a disposition resolves, a to-do clears, the readiness ring moves.

## 8. Journey & screen map (Phase B — every frame explicit)

> Frame IDs are for 1:1 mapping in the build plan. Each transient state listed is its own frame.

**J1 · Entry**
- J1.1 Sign in
- J1.2 Landing → Dashboard

**J2 · Submitter Dashboard** ("metrics & important infos")
- J2.1 Dashboard — portfolio KPIs (Annual impact R$/yr · Conversion demand→RP 64% · Lead time submit→frozen 8.5d · 1st-version acceptance 78%), "My demands" list (StateBadge + readiness + last activity), Notifications rail, **New demand** CTA
- J2.2 Dashboard — empty state (no demands yet)

**J3 · Create + Enrich** (TakeoverShell wizard — the core)
- J3.1 New demand entry — title + MultimodalComposer (drop / type / record) *or* start blank
- J3.2 AI reading/parsing state — extraction summary ("read your deck — found 5 of 8, 3 to go")
- J3.3 Readiness workspace — three zones: **Conversation** (copilot thread + MultimodalComposer) · **Canvas** (ReadinessRing + 8 RequirementRows + RICE-lite + SemanticReflection, all addressable) · **Sources** (tray)
- J3.4 Composer states — typing · recording · transcribing · file-attached · 1 block pinned · multiple blocks pinned
- J3.5 Bot reply quoting a pinned block
- J3.6 Answer-a-question turn (business language) → canvas update
- J3.7 "I don't know" → DispositionPicker → explicit frames for: assumption · discovery · deferred
- J3.8 RICE-lite mirror + TensionCallout (e.g., "big value, low confidence — what evidence would make you sure?") + a tension-resolution turn
- J3.9 Evidence & docs sub-view
- J3.10 Stakeholders sub-view
- J3.11 Constraints sub-view
- J3.12 Gate reached → Intake Record review (the frozen artifact, INT-2026-NNN)
- J3.13 Handoff to PO confirm (gateReady = true)

**J4 · Monitor the steps ahead** (post-handoff)
- J4.1 Demand timeline — state machine progress (Captured → Triage → Rationalization → RP → Execution → Delivered), with discovery loops & PM rebounds shown
- J4.2 What the PO did — triage outcome + PO edits/notes reflected back to her (read-mostly: the notification + a diff of what changed)
- J4.3 Projected vs realized — outcome tracking 30/60/90d, annual impact projected vs measured (closes metrics.md camada 3)

**J5 · Cross-cutting**
- J5.1 Notifications center
- J5.2 Comments / collaboration thread
- J5.3 Persistent copilot affordance (collapsed/expanded)
- J5.4 Global empty & error states

## 9. AI empowerment thread

Pre-fill extractor (with sources) → conversational gap-closer (one business-language question at a time) → tension-spotter on RICE-lite → disposition coach ("don't know? mark it a premise, or send to Discovery") → summarizer that produces the Intake Record. **Velocity** = fewer blank fields to fight manually; **maturity** = the Readiness Score climbs visibly as honest dispositions resolve — as a *conversation*, not a form.

## 10. Prototype wiring & fidelity

- Clickable **golden path** end-to-end (J1 → J2 → J3 → J4).
- Explicit **branch demos**: the disposition fork (J3.7), a tension resolution (J3.8), a PO rebound (J4.2).
- Figma interactive components for state toggles where they sell the experience (composer states, ConfidenceBar fill, ReadinessRing progress).
- Goal: a real COO clicks through unaided.

## 11. Out of scope (this prototype)

- Other personas' working UIs (PO/CTO/PM/Tech Leads) beyond the read-mostly reflection the Submitter sees in J4.2.
- Dark mode (token slot reserved, not designed).
- Real backend / functional AI — all AI behavior is scripted for the validation narrative.
- Production code / CSS / handoff specs — this is a Figma prototype.

## 12. Build sequence

1. **Phase A — Foundations:** variables → type → primitives → domain components (figma-generate-library).
2. **Phase B — Journeys:** assemble J1–J5 frames from components, every state explicit (figma-generate-design).
3. **Phase C — Wiring:** golden path + branch demos + interactive components.

Next: turn this spec into a detailed build plan (writing-plans).
