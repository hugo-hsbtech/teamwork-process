# Submitter Journey Stories

> **Status:** v2 (flow validated 2026-05-29) · **Date:** 2026-05-29 · **Author:** hugo (+ Claude)
> **Companion to:** [`specs/2026-05-27-submitter-figma-prototype-design.md`](../specs/2026-05-27-submitter-figma-prototype-design.md) (the WHAT) and [`plans/2026-05-27-submitter-figma-prototype.md`](../plans/2026-05-27-submitter-figma-prototype.md) (the HOW it was built).
> **Live Figma:** `Intake-Platform` · fileKey `6Yfv523dlb2bfZS9zWGJly` · Submitter journeys page `2:789`.

> **v2 revision (2026-05-29 afternoon):** Walk-through validation done. Lane C merged into B (became "ENRICH · INPUTS" — voice + file converge). Several lanes reordered for narrative clarity (D, F, H, M). Alt-variants moved to slots BELOW their primary screen (B2 voice in A, Sources-without-chat in E, rails in G). Reason modal (universal) lifted to new Lane Z · REUSABLE PATTERNS. Arrows added for B/L which start mid-flow.

## Purpose

The prototype now contains ~54 Submitter screens. The spec describes the design contract; the plan tracks build tasks. **Neither tells the journey stories.** This doc fills that gap: each story is a single user intent, told as a narrative arc with the screens that materialize it.

## Reading the canvas

The canvas is laid out in **15 horizontal lanes** (Story 0 + A→N + Z). Each lane has a big letter label at the left (x=-900) and screens stacked left → right by narrative beat. Lanes are spaced 2800px vertically; screens 1740px horizontally.

**Reading conventions:**
- Primary beats are on the main row (y = lane_y).
- **Alt-variants and rails** sit on a row 1400px BELOW the main row (still inside the same lane). They are paths the user CAN take but aren't sequential beats.
- **Lane Z** at the bottom contains reusable patterns referenced by multiple stories (currently: Reason modal).
- Lanes that start mid-flow (B, L) have a text arrow at the far left pointing to the lane they depend on.

To trace a story: find its letter on the left of the canvas, then read left → right on the main row.

## Seed scenario (used across every story)

**Submitter:** Hugo Seabra · COO · Payments
**Demand:** `INT-2026-015` — *"SSO/SAML authentication for B2B partners"*
**Why this matters:** B2B partners cannot authenticate on the portal because their SAML does not match ours. ~18% loss in onboarding. Q3 closes in 8 weeks.
**Stake:** R$ 412k YTD in accumulated financial impact from Hugo's portfolio.

---

## Story 0 · Intro · Auth

**Intent:** Enter the product.

Hugo opens the product. He sees a focused landing page — eyebrow + display + quote from another team — and the authentication card on the right with SSO (Google + Microsoft + SAML), divider and "Request access" link. It is not a form. It is an entry door that signals who the product is for.

**Beats:**
1. **B0 · Sign in** (`439:2`) — Tide mark · "Your next decision starts here." · three SSO buttons · "In use by Payments, Revenue, Discovery and Sales teams."

---

## Story A · First create

**Intent:** Capture a new demand, from the initial click to the first screen where it takes shape.

Hugo is in Demands, sees the portfolio (8 active), clicks **+ New demand**. The capture screen **does not ask him to think like an engineer**: it asks for a title, a description in his own language (with mic if he prefers to speak), evidence (file or audio) and — optionally — tags/urgency/deadline/people. He continues → lands on the **Demand Panel** (B4), where the demand now exists as an object with its own readiness, pending questions, sources and tabs. The **Readiness breakdown** modal shows what is needed to reach 80% (Discovery gate) with inline CTAs to fill in.

**Beats (main row):**
1. **C1 · Demands** (`548:2298`) — Portfolio list · row 1 highlighted INT-2026-015 · clicks "+ New demand" top right.
2. **B2 · New demand** (`835:3979`) — Rich form: Title · Description (textarea + inline mic) · Evidence (Attach file · Record audio) · Optional context (Tags · Urgency · Deadline · People) · Continue →.
3. **B4 · Demand Panel — drafting** (`478:703`) — The demand was born. Readiness 24% In Capture · Add information tab active · "Focus here · 10 items need you" with prioritized list.
4. **B4 · Readiness breakdown (modal)** (`963:5649`) — "To open Discovery, you still need…" with empty artifacts and pending questions · each with inline CTA "Fill in →" / "Answer →".

**Alt-below (over B2 base):**
- **B2 · Recording audio** (`850:4010`) — B2 alt: textarea becomes live waveform · ⏱ 00:42 · "Stop and transcribe" → returns with text filled in.

---

## Story B · Enrich · Inputs

**Intent:** Add information to the Demand Panel — by voice OR by file — generating an approved contribution.

*(This lane starts from the Demand Panel already open — comes from lane A.)*

Hugo opens an existing demand, is in the composer (Add information tab). Two paths available: **speak** (mic morphs the composer into an inline waveform) or **attach a file** (centered modal to choose files or paste a URL). Either one ends at the same destination: the feed shows the **Approved contribution** banner "AI extracted · updated REACH · updated URGENCY". Each extraction has a traceable source back to the original input.

**Beats (main row):**
1. **B4 · Recording audio (inline composer)** (`949:4132`) — Composer expanded into waveform · ⏱ counter · "Stop and transcribe" black · rest of screen unchanged. *(Voice path)*
2. **B4 · Attach file (modal)** (`945:4039`) — Centered modal · "Attach files to the demand" · two quadrants (Attach files · Web source) · Cancel · Attach. *(File path)*
3. **B4 · Approved contribution** (`949:4464`) — Updated feed · banner "AI extracted · updated REACH (B2B partners) · updated URGENCY" · inline Approve/Discuss CTAs. *(Convergence — destination of both paths)*

---

## Story D · Resolve a pending item

**Intent:** Answer one of the pending questions that are blocking the demand from advancing.

The **Questions** tab lists what the AI still needs to know. Hugo filters by **Empty** to attack the highest blockers — sees "How many B2B partners are in the onboarding queue today?" at the top (Blocks). Clicks → **Answer pending item** modal with the question highlighted, response field + disposition options (Answer · Assumption · Discovery · Delegate). Hugo answers "47, with 31 in backlog ≥30 days." Saves. Back in the Questions tab — the question moved to the **Confirm** filter (answer given, AI wants to validate). In parallel, he can look at the **Artifacts** tab to see the full picture of the 8 dimensions, and open an **Artifact detail** modal to see what has already been filled in.

**Beats (main row):**
1. **B4 · Questions (alt)** (`919:3560`) — Questions tab · prioritized list · filter chips (All · Empty · Confirm) · "+5 answered" collapsed.
2. **B4 · Questions filter: Empty** (`953:4874`) — Filter applied · only unanswered questions · empty state when exhausted.
3. **B4 · Questions filter: Confirm** (`953:5321`) — Filter applied · questions that already have an AI answer awaiting Submitter confirmation.
4. **B4 · Answer pending item (modal)** (`922:3738`) — Question highlighted · textarea · disposition pill picker · "Save and continue" / "Save and close".
5. **B4 · Artifacts (alt)** (`918:3471`) — Artifacts tab · 8 cards (Problem · Originator · Reach · Impact · Urgency · Evidence · Constraints · Stakeholders) with readiness/status indicators. *(Parallel view)*
6. **B4 · Artifact detail (modal)** (`954:4819`) — Drawer/modal showing a complete artifact (e.g.: "Affected companies") with source trail + edit affordances.

---

## Story E · Add a source

**Intent:** Link a document or link as an evidence source for the demand.

The **Sources** tab shows what is already linked (CISO deck · Stone transcript · pipeline data). Hugo needs to add the internal presentation that shows the month-over-month loss. Clicks "+ Add source" → modal identical to Attach file, but with "structured source" semantics (will have source citation, will be cited in derived artifacts). Saves. List grows. The AI will now cite it in future artifacts.

**Beats (main row):**
1. **B4 · Sources (alt)** (`920:3649`) — Sources tab · vertical list · each item with title · type (📎/🎙/🔗) · "extracted by AI" trail.
2. **B4 · Add source (modal)** (`953:4552`) — Modal identical to Attach file but semantically a Source · extra fields (Type · Tags · Optional description).

**Alt-below:**
- **B4 · Sources (without chat — files view)** (`1019:4815`) — Same tab but chat panel closed · used when focus is only on sources.

---

## Story F · Discuss with AI · Chat

**Intent:** Ask a question or refine understanding with the AI, without leaving the Demand Panel.

Hugo clicks the chat icon in the corner. **Side panel** opens on the right (Demand Panel stays visible on the left). He types freely ("I still don't know the ROI") → user bubble appears · "thinking…" banner · after 1.5s, **AI response** arrives with action chips ("View Reach Artifact" · "Add as assumption"). As an alternative entry, he can use the **Chat picker** to choose context first (which question, which artifact to discuss). Or he can speak the message using the **inline voice mode** in chat.

**Beats (main row):**
1. **B4 · Chat open (alt)** (`923:3827`) — Chat side panel open · empty history · composer in footer · Demand Panel on the left intact.
2. **B4 · Chat with new message sent** (`951:4624`) — User bubble sent · AI "thinking…" with animated 3-dots · AFTER_TIMEOUT 1.5s to next beat.
3. **B4 · Chat with AI response** (`963:5280`) — AI response with action chips ("View Reach" · "Review text" · "Send directly") · complete conversational loop.
4. **B4 · Chat picker (modal)** (`951:4314`) — *Alt entry.* Picker modal · "Discuss what?" · list (Questions · Artifacts · Sources · The demand) with chip filter.
5. **B4 · Chat with inline voice (alt)** (`939:3946`) — *Alt input.* Chat composer morphed into inline waveform (same pattern as the main composer).

---

## Story G · Voice mode fullscreen

**Intent:** Talk to the AI for long stretches without visual distraction.

From the chat side panel, Hugo clicks expand → **Chat fullscreen** (full screen, sidebar automatically hidden). Clicks mic → **Voice mode**: centered waveform, AI listening, counter. Hugo pauses to think — **Voice paused**: shows "Paused · 1:23 recorded" + options (Resume · Stop and send · Discard). Optionally, he can activate a right rail: **+Contributions** (shows what he has already contributed) or **+Artifacts** (shows the state of the 8 artifacts) — visible in parallel to the conversation.

**Beats (main row):**
1. **B4 · Chat fullscreen** (`933:3927`) — Chat occupies full screen · global sidebar hidden · breadcrumb top "Demands > INT-2026-015 > Chat".
2. **B4 · Chat voice mode** (`936:3946`) — Centered waveform · AI "listening" indicator · pause · stop · discard.
3. **B4 · Voice mode paused** (`952:4500`) — Frozen waveform · banner "Paused · 1:23 recorded" · Resume (primary) · Stop and send · Discard.

**Alt-below (rails):**
- **B4 · Chat fullscreen + Contributions rail** (`952:4599`) — Rail on the right shows what Hugo contributed (transcripts · files) as reference during the conversation.
- **B4 · Chat fullscreen + Artifacts rail** (`952:4814`) — Same structure but rail shows the 8 artifacts · useful for "completing the picture" while talking.

---

## Story H · Edit metadata

**Intent:** Assign a responsible person and see who is involved (main); edit title/description (alt).

Hugo clicks the **three dots** in the demand header → actions menu. Main path: **Assign** → modal with avatar picker (team list + search). After choosing, the header now shows the **assignee avatar + deadline chip + version chip** (v0 DRAFT). On hover over the avatar, a **popover** shows responsible + reviewer + last update. Alternative path from the same menu: **Edit title and description** → modal with two pre-filled fields.

**Beats (main row):**
1. **B4 · Actions menu** (`910:3397`) — Demand Panel with "..." menu open · list of actions ordered by usage.
2. **B4 · Assign demand (modal)** (`974:4077`) — Modal with avatar grid · search · single selection (responsible) + multi (reviewers) · Confirm.
3. **B4 · Header with assignee + deadline + version** (`974:4389`) — Final complete header: avatar HS + name · ⏱ 11 DAYS · 12 JUN · v0 DRAFT chip.
4. **B4 · Hover popover · responsible + reviewer** (`976:4296`) — Popover over avatar stack · "Responsible: Hugo Seabra (COO) · Reviewer: Ana Costa (PO)" + last update timestamp.
5. **B4 · Edit title and description (modal)** (`904:3285`) — *Alt action.* Modal with pre-filled "Title" Input + expanded "Description" Textarea · Save / Cancel.

---

## Story I · Postpone

**Intent:** Pause the demand with a recorded reason — can't move forward right now.

Hugo decides to postpone (CISO is traveling, will be back in 3 weeks). Menu "..." → **Postpone**. Modal asks for a reason (free textarea + common-reason chips: "Waiting for stakeholder" · "Re-prioritization" · "Missing critical evidence") + return date. Confirms. Demand Panel returns with an **amber banner** at the top ("Postponed · 1 min ago · you"), header with **4px amber left-strip** + StateBadge "Postponed", "Undo" ghost button on the banner to revert quickly. The entire Add information tab is grayed out — signals pause.

*(The reason modal is a reusable pattern in Lane Z — see Reason modal.)*

**Beats:**
1. **B4 · Postpone (modal)** (`954:5177`) — Specialized version of the Reason modal · postpone-reason chips · "Revisit this on" field (date picker).
2. **B4 · Postponed** (`955:5094`) — Demand Panel post-Postpone · amber banner · amber header strip · StateBadge "Postponed" · "Undo" available.

---

## Story J · Request review

**Intent:** I want help from someone more experienced before sending it forward.

Demand is in limbo — Hugo wrote it, but wants a sanity check from another PO. Menu "..." → **Request review** → modal with reviewer picker + reason. Confirms. Header now has **4px violet left-strip** + StateBadge "In review" + violet banner "In review · you asked Ana Costa". Demand Panel enters **read-only mode** (Hugo cannot edit, only view).

**Beats:**
1. **B4 · Request review (modal)** (`954:5363`) — Reason modal with reviewer picker + free reason + "allow editing" checkbox.
2. **B4 · In review** (`955:5352`) — Demand Panel post-Request review · violet banner · violet header strip · StateBadge "In review" · read-only fields.

---

## Story K · Handoff · Freeze v1

**Intent:** The demand reached 100% readiness — freeze and publish for the PO to take over.

Readiness Ring reaches 100%. Primary CTA in the footer changes to **"Freeze and publish v1"**. Hugo clicks → confirmation modal (consequences: becomes immutable v1, PO receives handoff, I can still create a v2 draft in parallel). Confirms. Demand Panel returns as **B4 · Handoff published v1**: header with chip **v1 PUBLISHED · FROZEN**, emerald success banner ("Published · Ana Costa was notified"), all fields in frozen state (gray, hover shows "v1 is frozen — create v2 to edit").

**Beats:**
1. **B4 · Freeze and publish v1 (modal)** (`998:4445`) — Modal "Freeze v1" · consequences explained · "Notify Ana Costa (PO)" checkbox pre-checked · Cancel / Confirm.
2. **B4 · Handoff published v1 (frozen)** (`1008:4720`) — Demand Panel in frozen mode · v1 PUBLISHED chip · emerald header strip · success banner · read-only fields.

---

## Story L · V2 draft

**Intent:** v1 is already out, but Hugo found more info — wants to update it.

*(This lane starts from Handoff published — comes from lane K.)*

Hugo opens the already-published demand. Sees the v1 frozen state. Clicks **"Edit new version"** → creates v2 draft. Header now shows **two chips: v1 PUBLISHED + v2 DRAFT** (side by side). Fields become editable again (but in a v2 layer). When he makes an edit, a **Diff modal** optionally opens showing v1 → v2 inline (field by field, with strikethrough/insertion). **Lean v2** = post-publish view where only new TODOs are shown (does not revisit everything).

**Beats:**
1. **B4 · v1 published + v2 draft (editing)** (`1008:5141`) — Header with two chips · editable fields · banner "Editing v2 · v1 stays published".
2. **B4 · Diff modal v1 → v2 (draft)** (`998:4640`) — Side-by-side modal · "Summary of changes" · fields with strikethrough/insertion · CTA "Back to editing" / "Ready to publish v2".
3. **B4 v2 — lean** (`1005:4631`) — Post-v1 simplified view · only new TODOs (does not revisit 8 artifacts) · compact readiness · pagination.

---

## Story M · Post-handoff outcomes

**Intent:** What the Submitter sees after delivering — different destinations for the demand in the funnel.

After handoff, the demand goes through states controlled by the PO/Discovery. The Submitter **cannot edit**, but needs to **know where it stands**. Four terminal or intermediate states (in order from most common/positive to most critical): **Sent** (PO received, is triaging) → **Returned** (PO returned it asking for more info) → **Late** (deadline passed) → **Archived** (finished, rejected or de-prioritized). At any point the **History/Audit** tab shows the full event log, and **Status Journey + Downstream Events** is the expanded view of the complete funnel (Sent → Discovery → RP-Frozen → In Execution → Delivered).

**Beats (main row):**
1. **B4 · Sent (status)** (`969:3615`) — Tide banner "Sent · awaiting PO" · natural state post-handoff.
2. **B4 · Returned (status)** (`969:3873`) — Amber banner "Returned by PO · 'Missing fallback scenario'" + primary CTA "Respond to return".
3. **B4 · Late (status)** (`969:4387`) — Red banner "Late · deadline was 12 Jun" · CTA "Renegotiate deadline".
4. **B4 · Archived (status)** (`969:4128`) — Stone banner "Archived · 28 May 2026 · by Ana Costa" · frozen fields.
5. **B4 · History / Audit (tab)** (`972:3988`) — History tab · vertical event log · each event with timestamp + actor + action ("Hugo froze v1" · "Ana opened Discovery" · …).
6. **B4 · Status Journey + Downstream Events** (`970:3895`) — Tall screen (2134h) · horizontal funnel timeline · downstream events visible.

---

## Story N · Cross-demand visibility

**Intent:** What the Submitter looks at outside of a specific demand — portfolio, activity, pending items, alerts.

Four surfaces the Submitter visits for a high-level view:

- **Dashboard** — the portfolio number-king (R$ 412k YTD) + CompactKPI grid + AIImpactBanner ("18h saved · 65% automated").
- **Range open** (Dashboard variant) — drill-down on a specific time range.
- **Notifications** — TopBar bell open · dropdown with mentions, gates, updates, alerts triaged by type.
- **Activity** — cross-demand log: "PO asked in INT-015" · "INT-013 advanced to In Execution" · "RP-041 was frozen".
- **Pending items** — cross-demand view of what **blocks the Submitter** (pending questions across all their demands, grouped by demand + urgency).

**Beats:**
1. **B1 · Dashboard** (`811:3890`) — HeroMetric "R$ 412k" + trend + sparkline · CompactKPI grid · AIImpactBanner · recent demands list.
2. **B1 · Range open (alt)** (`736:3640`) — Dashboard with date-range filter expanded · KPIs recalculated for the range · monthly curve.
3. **C2 · Notifications** (`560:2492`) — "View all" notifications screen · sections (Recent · Earlier) · NotificationRow components.
4. **C7 · Activity** (`752:3822`) — Cross-demand activity feed · groups by day · each item links to the source demand.
5. **C8 · Pending items** (`752:4085`) — Prioritized list of Submitter cross-demand pending items · "X demands with Y blocking pending items" · grouped by urgency.

---

## Lane Z · Reusable patterns

**Intent:** Patterns referenced by multiple stories, kept centralized to avoid duplication.

Patterns that appear in more than one story deserve standalone visibility — one reference, easy to iterate without touching the stories.

**Beats:**
1. **B4 · Reason modal (universal · transition why)** (`969:3430`) — Generic "why?" modal · textarea + common-reason chips + conditional date. Used by: Postpone (lane I — `954:5177` is a specialized version), Request review (lane J — `954:5363`), and potentially Archive / Return in the future.

---

## Master gaps surfaced (carry forward)

Design-system inconsistencies found during the build, recorded to resolve before the next persona:

1. **`Button` master `leadingIcon` is RECTANGLE, not INSTANCE_SWAP** — blocks declarative icon swap. Result: ghost buttons in B2 ended up without an icon. Action: refactor master.
2. **No Date field component** — Deadline in B2 is a local custom. Action: create `DateField` in the design system.
3. **`Tag/selected` variant visual subtle** — for Urgency "High" selected, the visual signal is weak. Action: create `Variant=picked` with tide bg + white text.
4. **No `MultiSelect`/`Tag input` component** — chip-rows are composed manually from Tag/removable + Tag/default. Action: create dedicated component.

## Open Figma comments

- `1779637369` (FILE-LEVEL) — "We also need the complete place as well." — vague, awaiting clarification.

## Next personas

When the next persona joins the prototype (PO, Discovery, Execution), repeat the same template:
- Define intents (one per story)
- Categorize screens into lanes
- Write narrative per story
- Apply principles from [`personas/01-submitter.md`](../../../personas/01-submitter.md) (two lenses, confidence, dispositions) + from `.claude/memory/intake-screen-principles.md` (form sections, list rows HUG, deep-screens fullscreen)
