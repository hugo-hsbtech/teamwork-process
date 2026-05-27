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

**Primary research:** prototype [`prototypes/demandos-prototype-v167.tsx`](../../../prototypes/demandos-prototype-v167.tsx) is the canonical source for screens and mechanics; `fase2-v9` / `fase4-v8` are superseded earlier explorations and are not mined.

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
| D8 | Create vs enrich | **Decoupled.** Creating a demand captures only **basic info** (fast, low-friction) and produces a **Draft**. All enrichment happens later, over multiple sessions, from a dedicated **Demand Panel** page — because maturing a good demand takes time and depends on external inputs the Submitter does not control. The Demand Panel is the **central object**, spanning the demand's whole lifecycle (enrich → handoff → monitor → outcome). Validated against prototype v167 (`NewDemandScreen` → `CaptureQueueScreen`). |

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
- **KPICard** · **Sparkline / Donut / FunnelChart** (conversion across states) · **TimelineStateRow** · **StateBadge** (demand lifecycle: draft / capturing / triage / discovery / rationalization / RP-frozen / execution / delivered / backlog / archived-rejected).
- **DemandPanel** — the per-demand page shell; layout variants: drafting/enriching · handoff · handed-off/monitoring · outcome · backlog · archived. **DraftBadge** + **Save-and-exit** affordance.
- **CollectInboxItem** — a PO async question + her batched answer (decoupled enrichment).
- **CommentThread / CommentItem** — inline collaboration on demand sections.
- **EscalationModal** — escalate-early / flag-blocker urgency valve.
- **TourBanner / OnboardingStep** — first-run guidance for a non-technical exec.

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
- J1.3 First-run onboarding (TourBanner): create + drop/voice · enrich pendencies · track impact

**J2 · Submitter Dashboard** ("metrics & important infos")
- J2.1 Dashboard — portfolio KPIs (Annual impact R$/yr · Conversion demand→RP 64% · Lead time submit→frozen 8.5d · 1st-version acceptance 78%) + FunnelChart (submitted→triaged→RP→accepted→executing), "My demands" list (StateBadge + readiness + last activity, incl. Draft / Backlog / Archived states), Collect-inbox badge (PO questions waiting), Notifications rail, **New demand** CTA
- J2.2 Dashboard — empty state (no demands yet)

**J3 · Create demand (quick capture — light)**
> Decoupled from enrichment. Goal: get the demand out of her head in under a minute; structure it later.
- J3.1 Create — basic info only: title · one-line problem · origin (Client/Internal/Market/Support) · type — optionally drop an artifact or record a voice note
- J3.2 AI quick-read (if an artifact was given) — "Saved as draft · pre-filled N fields from your deck"
- J3.3 Lands on the Demand Panel in **Draft** state (see J4)

**J4 · Demand Panel (the dedicated per-demand page — the heart)**
> One persistent, beautiful page that is the home of a demand across its WHOLE lifecycle. Enrichment happens here over many sessions; she can leave and return; Discovery/assumptions wait on external inputs she doesn't control. Layout emphasis shifts by lifecycle phase.

*Drafting / Enriching layout*
- J4.1 Panel shell — identity header (INT-2026-NNN · title · StateBadge · ReadinessRing · handoff CTA, disabled until gate) over three zones: **Conversation** (copilot + MultimodalComposer) · **Canvas** (8 RequirementRows + RICE-lite + SemanticReflection, all addressable) · **Sources** tray
- J4.2 Composer states — typing · recording · transcribing · file-attached · 1 block pinned · multiple blocks pinned
- J4.3 Bot reply quoting a pinned block
- J4.4 Answer-a-question turn (business language) → canvas update (ReadinessRing delta "+23%")
- J4.5 "I don't know" → DispositionPicker → explicit frames: assumption · discovery · deferred
- J4.6 RICE-lite mirror + TensionCallout ("big value, low confidence — what evidence would make you sure?") + a tension-resolution turn
- J4.7 Evidence/Sources detail · Stakeholders · Constraints sub-views
- J4.8 Save & exit — Draft persists (return-later); appears as a Draft on the dashboard
- J4.9 Collect inbox — PO's async questions land on the panel; she answers in business language without re-opening the whole flow
- J4.10 Comments thread — inline PO/CTO/PM comments on sections + her replies
- J4.11 Escalate / flag blocker — urgency valve when waiting on something stuck

*Handoff*
- J4.12 Pre-send review — readiness checkpoint: every blocking requirement has an honest disposition (gateReady); the Intake Record (INT-2026-NNN) shown read-only
- J4.13 Handoff to PO confirm → success

*Handed-off / Monitoring layout*
- J4.14 Timeline — state-machine progress (Captured → Triage → Rationalization → RP → Execution → Delivered), discovery loops & PM rebounds shown
- J4.15 What the PO did — triage outcome + PO edits reflected back (read-mostly: notification + diff of what changed)

*Outcome layout*
- J4.16 Projected vs realized — outcome tracking 30/60/90d, annual impact projected vs measured (closes metrics.md camada 3)

*Closure states*
- J4.17 Backlog — deferred but valid, with the unlock trigger she's waiting on (e.g., "Q3 budget released")
- J4.18 Archived / Rejected — reason + justification (closure narrative, so she doesn't resubmit the same idea)

**J5 · Cross-cutting**
- J5.1 Notifications center
- J5.2 Comments / collaboration thread
- J5.3 Persistent copilot affordance (collapsed/expanded)
- J5.4 Global empty & error states

## 9. AI empowerment thread

Pre-fill extractor (with sources) → conversational gap-closer (one business-language question at a time) → tension-spotter on RICE-lite → disposition coach ("don't know? mark it a premise, or send to Discovery") → summarizer that produces the Intake Record. **Velocity** = fewer blank fields to fight manually; **maturity** = the Readiness Score climbs visibly as honest dispositions resolve — as a *conversation*, not a form.

## 10. Prototype wiring & fidelity

- Clickable **golden path** end-to-end (J1 → J2 → J3 create → J4 panel: enrich → handoff → monitor → outcome).
- Explicit **branch demos**: the disposition fork (J4.5), a tension resolution (J4.6), a PO rebound (J4.15), and the **save-and-return loop** (J4.8 → dashboard Draft → back into the panel) that proves create/enrich is decoupled.
- Figma interactive components for state toggles where they sell the experience (composer states, ConfidenceBar fill, ReadinessRing progress with the "+23%" delta).
- Goal: a real COO clicks through unaided.

## 11. Out of scope (this prototype)

- Other personas' working UIs (PO/CTO/PM/Tech Leads) beyond the read-mostly reflection the Submitter sees in J4.15.
- Dark mode (token slot reserved, not designed).
- Real backend / functional AI — all AI behavior is scripted for the validation narrative.
- Production code / CSS / handoff specs — this is a Figma prototype.

**Superseded prototype concepts — do NOT resurrect** (dropped between fase2/4 and v167, or dead code in v167): the three separate per-section pendency modals (use one unified DispositionPicker/answer flow instead) · PlaceholderDashboards for non-Submitter personas · DrillDownModal · RationalizationsListScreen (dead code) · ShowcaseRPScreen.

## 12. Build sequence

1. **Phase A — Foundations:** variables → type → primitives → domain components (figma-generate-library).
2. **Phase B — Journeys:** assemble J1–J5 frames from components, every state explicit (figma-generate-design).
3. **Phase C — Wiring:** golden path + branch demos + interactive components.

Next: turn this spec into a detailed build plan (writing-plans).
