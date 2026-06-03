# Figma Build Log — Submitter Intake Prototype

> Running memo of what has been done in Figma, for context across sessions.
> Append a dated entry whenever the Figma file changes. Newest first.

## File of record

- **Build target:** `Intake-Platform` — fileKey `6Yfv523dlb2bfZS9zWGJly`
  (URL: https://www.figma.com/design/6Yfv523dlb2bfZS9zWGJly/Intake-Platform)
- **Token source of truth:** `design-system/colors_and_type.css` ("Paper & Signal").
- **Plan:** `docs/superpowers/plans/2026-05-27-submitter-figma-prototype.md` (v2).
  Note: the plan references an old fileKey `mUIHJQvbeHidhp8bjUcZbK` ("Intake · Submitter") —
  **that file has been DELETED**. All work happens in `Intake-Platform`.
- **Workflow:** every Figma change runs through `frontend-design` + the `figma:*` skills.
  Build screen-by-screen; iterate on each with Hugo before moving on.

## Starting state (audit 2026-05-27)

`Intake-Platform` has one page, **Components**, containing shadcn × Paper & Signal atoms
rethemed to P&S, plus Conductor domain components:

- shadcn atoms: Button (primary/secondary), Input, Badge (7 states), Segmented
- Conductor: Version State Badge, Provider Chip, Stepper, Drawer shell, Takeover shell,
  Result chip, Connector card, Progress-step row, ViewToggle, FilterBar, BlockGrid, DataTable + Pager

**No Figma variables/tokens** existed in this file at audit time.
**No Screens or Prototype pages** existed.

## Log

## 2026-05-28 — B1 panels restructure (full-width demandas + 2-col atividades/pendências)

Restructured the bottom of **B1 · Dashboard** (`441:14`). Old Panels row `717:3601`
(3 equal columns) was replaced with a new VERTICAL container **Panels area v2**
(`770:3890`) holding:

- ROW 1 (FILL width): `Panel / Minhas demandas` (`717:3602`)
- ROW 2 (HORIZONTAL, gap `space/lg`, FILL 1:1): **Sub-row 2** (`770:3891`) with
  `Panel / Atividades recentes` (`717:3669`) + `Panel / Pendências` (`717:3706`)

Old `717:3601` removed. New containers built with `space/lg` itemSpacing (lg instead
of the spec's xl for fit; documented compression). All padding/spacing bound to
design tokens.

**Minhas demandas — 5th inline column added**: each of the 5 rows now ends with a
`hint` TEXT (Inter Regular 12, bound to `text/faint`), right-aligned, e.g.
"passar p/ Discovery em 3d", "entrega prevista 12/07", "discovery ativa há 12d",
"revisão de rationalização", "entregue · ROI confirmado". To prevent visual overlap
with the trailing hint, the `ConfidenceBar` instances were widened from 80→170
(their internal track+percent already rendered at ~165 — pre-existing layout bug
where instance frame was narrower than its rendered content).

**Pendências consistency**: panel now uses padding `lg lg lg lg` (top, right, bot, left
all 16) except `paddingTop` re-set to `md`(12) so the absolute-positioned
`CriticalAccentStripe` (`742:3758`, y=0, h=2) sits above the header without
overlapping it; header now sits at y=12, matching Atividades' header y=12. Each
Pendency row padding `sm md sm md` (8/12/8/12) with `itemSpacing` = `xs`(4). Meta
lines hidden in each row (visibility=false) to recover vertical budget.

**Compression applied to fit 1440×900 viewport**:
- Atividades: dropped events 6 and 7, then event 5 → 7 events became 4 (h: 311→197)
- Pendências: dropped Pend-3 → 3 rows became 2 (and meta lines hidden in 1 and 2)
- KPI cards: paddingTop/Bottom 16→8 (`sm`), itemSpacing 12→8 (h: 164→140)
- Charts cards: paddingTop/Bottom 16→12; Chart1 chart-area resized 142→54;
  Chart2 bar-area resized 90→38 (charts row h: 215→127)
- Content area: itemSpacing `lg`→`md`, all paddings `lg`→`md`
- Panels area v2: itemSpacing `xl`→`md` (deliberate deviation from spec for fit)
- Footer status (`719:3644`): `layoutPositioning='ABSOLUTE'`, pinned at y=820 inside
  Content (still visible at bottom of dashboard; out of auto-layout flow)

**Reactions preserved** (verified post-move): Row-INT014→B4, VerTodasLink→C1,
AtividadesVerTodas→C7, PendenciasVerTodas→C8, PendencyCTA-1→B4, PendencyCTA-2→B4.
(PendencyCTA-3 was removed with its parent Pend-3.)

**Final vertical fit**: Panels area v2 ends at y=899 inside a 900px B1 frame
(1px slack). Atividades extends to y=887; Pendências (taller of the two) extends
to y=899.

New container IDs:
- `Panels area v2`: `770:3890`
- `Sub-row 2 · Atividades + Pendências`: `770:3891`

### 2026-05-27 — Session start
- Audited file; confirmed divergence from plan (plan assumed a 4-page single file; reality is a
  components-only library with no tokens).
- Decision (Hugo): build in `Intake-Platform`, port Paper & Signal tokens here first.
- Old `Intake · Submitter` file deleted by Hugo.

### 2026-05-27 — Foundations ported (Phase A tokens/type/elevation)
On page **Components** (collections are file-global):
- **`color`** collection (mode: Light) — 62 vars: 34 raw primitives (stone/tide/amber/green/red/
  slate/violet/provider/white/black) + 28 semantic aliases (surface/*, text/*, border/*, brand/*,
  state/* and washes). Primitives hidden from pickers (scopes `[]`); provider/* directly fill-scoped;
  semantics scoped by role. WEB code syntax set to `var(--name)` matching the CSS.
- **`space`** collection (mode: Value) — 10 vars (space/0,2,xs,sm,md,lg,xl,2xl,3xl,4xl), scoped GAP+W/H.
- **`radius`** collection (mode: Value) — 6 vars (none/sm/md/lg/xl/full), scoped CORNER_RADIUS.
- **13 text styles**: Display, Heading/H1·H2·H3, Label/md·sm, Eyebrow (mono, uppercase, +8% tracking),
  Body/md·sm, Meta, Mono/md·sm, Code. (Color applied per-node via color vars — text styles carry
  typography only.) Fonts confirmed available: Hanken Grotesk (ExtraBold/Bold), Inter, Geist Mono.
- **3 effect styles**: elev/1, elev/2, elev/pop (ink-tinted, low-opacity drop shadows).
- Note: `figma.saveVersionHistoryAsync` not supported in this MCP env — no named version checkpoints; this log is the record.

### 2026-05-27 — Direction change: build the reusable kit first (agnostic), then screens
Hugo redirected: build a granular, agnostic, token-bound component catalog before any product screens.
Approved scope + best-practice path (atoms → molecules → organisms → templates → pages).

**Page structure restructured to conventional DS layout:**
`Cover (16:107) · Foundations (16:108) · — · Components (0:1) · — · Patterns (16:111) · Templates (16:112) · — · Submitter journeys (2:789)`
- Foundations = token/style specimen docs. Components = atoms + molecules. Patterns = organisms
  (TopBar, Sidebar, DataTable, FilterBar, Forms…). Templates = AppShell + page skeletons.
- "Submitter journeys" (2:789) = future Screens page, left EMPTY (we stop before screens).
- Deleted a duplicate empty "Foundations" page (was 2:600).

**Execution method:** serial subagents (one group at a time), controller verifies via screenshots.
NEVER parallel use_figma. Everything binds to tokens (no raw hex). Agnostic placeholder content.
Reuse existing Components-page atoms (Button, Input, Badge, Segmented, Provider Chip, etc.).

**Token reference (names to bind by):**
- color semantic: surface/{canvas,card,sunken,inverse}, text/{ink,muted,faint,on-brand},
  border/{hairline,strong}, brand/{tide,tide-bright,tide-text,tide-wash},
  state/{draft,staging,canary,running,production,paused,error}(+ -wash each)
- color primitive: stone/50..900, tide/50,100,300,500,600,700,900, amber/50,500,600,
  green/50,600, red/50,600, slate/50,500, violet/50,500, provider/{claude,gemini,grok,openai}, white, black
- space/0,2,xs,sm,md,lg,xl,2xl,3xl,4xl = 0,2,4,8,12,16,24,32,48,64
- radius/none,sm,md,lg,xl,full = 0,6,8,12,16,9999
- text styles: Display, Heading/H1·H2·H3, Label/md·sm, Eyebrow, Body/md·sm, Meta, Mono/md·sm, Code
- effect styles: elev/1, elev/2, elev/pop

### Build progress (append node IDs as groups land)
- ✅ Foundations specimens (page 16:108) — root frame `20:2` "Foundations / Specimen". Sections: title 20:3,
  color-semantic 21:2, primitive ramps 23:2, type ladder 24:2, spacing 25:2, radius 26:2, elevation 27:2.
  Verified by controller screenshot — clean, on-brand, all token-bound.
- ⏳ Components / Form controls (page 0:1, new column at x≈4300 under "Form controls" header):
  - ✅ 3a: Button set `32:107` (12 variants: Variant×Size; props leadingIcon/trailingIcon/disabled),
    Input set `35:107` (4 states; leadingIcon prop), Textarea `37:107`, Select set `39:107` (3 states).
    All token-bound (0 raw hex), verified by controller screenshots.
  - ✅ 3b (column x≈5800): Checkbox `51:107` (4), Radio `55:107` (3), Switch `58:107` (3),
    Slider `60:111` (2), FormField `62:107` (text label/helper, bool required/error, instance-swap control=Input),
    Fieldset `67:110` (legend+desc+divider+2 FormFields). Reuse chain Fieldset→FormField→Input verified.
    Note: FormField error uses two stacked helper texts (Figma can't invert a boolean for color swap).
- ⏳ Components / Icons + indicators (Task 4):
  - ✅ 4a Icons (group `90:128` at x≈7000): 32 real Lucide components named `Icon / {name}`, 24×24,
    strokes bound to text/ink, instance-swap ready. (search, plus, x, check, chevrons, arrows, bell, menu,
    more-h/v, settings, user, home, file-text, layout-grid, list, filter, sparkles, zap, message-square,
    paperclip, clock, alert-circle, info, panel-left, trash-2, pencil, download.) Verified.
  - ✅ 4b (column x≈8200): StatusDot set `97:152` (8 tones), Tag set `100:137` (3), Avatar set `102:148`
    (6: Size×Type, reuses Icon/user), CountChip `104:136`, Tooltip `105:136` (elev/pop + caret), Kbd `107:136`.
    Reuses Icon/x in Tag. All token-bound, verified.
- ✅ Task 4 COMPLETE.
- ⏳ Components / Nav + data atoms (Task 5):
  - ✅ 5a nav+overlays (column x≈9300): IconButton set `112:148` (4), BreadcrumbItem `114:149` (2),
    Tab `116:149` (3), MenuItem `118:169` (4), Pagination `119:169`, DropdownMenu `120:171` (reuses MenuItem),
    Popover `121:199`, Toast set `123:212` (3 tones). All token-bound, reuse icons, verified.
  - ✅ 5b data/display (column x≈10400): Card set `135:212` (2), Divider `136:214` (2), TableHeaderCell `139:214`
    (3, text prop label), TableCell `145:225` (4: text/number/badge/actions; reuses StatusDot+IconButton),
    ListRow `149:231` (3 states; reuses Avatar+chevron), EmptyState `152:231` (reuses Button), Skeleton `153:242` (3).
    All token-bound, verified.
- ✅ Task 5 COMPLETE. Atom/molecule catalog done.
- Fix applied: added TEXT property `label` (label#156:0) to Button set `32:107`, wired across all 12 variants.
- ⏳ Patterns / organisms (Task 6, page 16:111):
  - ✅ 6a chrome: TopBar `165:11` (1440×56; brand+breadcrumbs+search/bell+count/avatar), Breadcrumbs `164:3`,
    Sidebar set `172:85` (expanded `168:33` + collapsed `171:66`; reuses MenuItem/IconButton/Avatar/icons).
    Token-bound, verified. Note: collapsed nav uses IconButton (MenuItem has no label-hide bool).
  - ✅ 6b lists/filters/form: DataTable `178:86` (header+5 rows+pager; reuses TableHeaderCell/TableCell/StatusDot/Pagination),
    BlockList `185:159` (3×2 Card grid), FilterBar `186:177` (search+facets+tags), AdvancedFilters `190:196`
    (Selects+Checkboxes+Reset/Apply), FormLayout `193:215` (2 Fieldsets + Cancel/Save). Verified.
  - ✅ Sidebar fix (Hugo feedback): added **ContextSwitcher** set `203:240` (expanded `200:239` + collapsed `202:240`)
    in Components nav area; inserted instances into both Sidebar variants ABOVE the menu items (expanded `206:293`,
    collapsed `207:302`). Workspace switcher [A · WORKSPACE/Acme Inc · chevron]. Verified.
- ✅ Task 6 COMPLETE (Patterns).
- BACKLOG (polish, non-blocking): (1) Input `leadingIcon` slot is a plain rect placeholder, not an instance-swap
  icon — make it swappable for real use. (2) FilterBar facet/sort pills + segmented toggle built manually (no
  pill/segmented component) — promote to a component if reused (rule of three). (3) consider a real workspace-switcher
  dropdown (open state) later.
- ⏳ Templates (Task 7, page 16:112):
  - ✅ AppShell `210:3` (1440×900; TopBar + Sidebar expanded + Content slot frame `211:95`).
  - ✅ List page `214:155` (chrome + SECTION/Items header + New item + FilterBar + DataTable). Verified — composes
    perfectly from instances. (Visible nit: Input leadingIcon placeholder square — backlog item 1.)
  - ✅ Detail page `222:486` (chrome + breadcrumbs + header w/ Running status + Edit/Publish + 2-col Overview/Activity + Details side card).
  - ✅ Chrome relayout (Hugo feedback): all 3 templates restructured to root HORIZONTAL = [Sidebar(FILL height),
    RightCol(VERTICAL)=[TopBar(FILL width), Content(FILL)]]. Sidebar full-height on left; topbar starts after sidebar.
    RightCols: 230:597 (AppShell), 230:599 (List), 230:601 (Detail).
  - ✅ De-dup: added `showBrand` boolean (showBrand#232:0) to TopBar `165:11` (wired Brand 165:12 + Divider 165:15);
    set FALSE on the 3 template TopBar instances so the full-height sidebar owns the brand and the topbar starts at breadcrumbs.
- ✅ Task 7 COMPLETE (Templates).

## STOPPING POINT REACHED — full reusable kit built; ready for product Screens (page "Submitter journeys" 2:789, empty).
Page layout: Cover · Foundations(specimens) · Components(atoms+molecules) · Patterns(organisms) · Templates(AppShell/List/Detail) · Submitter journeys(empty).
The List/Detail templates compose 100% from instances — screens = copy a template, swap content. Do NOT detach; override text/icon/variant only.

### 2026-05-28 — Polish pass (Hugo chose "fix backlog first")
- ✅ Input set `35:107`: replaced grey-rect leadingIcon with real `Icon / search` instances (text/faint) across all 4
  variants + added INSTANCE_SWAP prop `icon#242:0` (swappable, still toggled by leadingIcon). Propagates to all
  Input instances (FilterBar/templates Search now shows the glyph). Verified.
- ✅ Created **FilterPill** component `249:240` (label prop) in Components nav area; replaced FilterBar's 3 manual pills
  with FilterPill instances (Status/Owner/Sort: Updated). Verified.
- ✅ EmptyState button confirmed using Button `label#156:0` prop ("Create item").
- Remaining optional: workspace-switcher open/dropdown state.

### 2026-05-28 — Extend Templates to reference screen archetypes (Hugo request)
Adding generic reference templates beyond AppShell/List·Table/Detail: Dashboard, List·Blocks, Form, Form Wizard.
Placed on Templates page `16:112` to the right of existing (x≥4920). All agnostic, composed from kit instances.
- ✅ 9a: StatCard set `265:241` (3 trends; label/value/delta props) + Dashboard template `272:600`
  (4 StatCards + Activity bar-chart card + Recent list + DataTable). Showcase-quality. Verified.
- ✅ 9b: List·Blocks template `288:842` (header+FilterBar+BlockList grid+Pagination) + Form template `291:1023`
  (SETTINGS/Form title + FormLayout 2 fieldsets; FormLayout internal header hidden to avoid dup; actions below fold = long form). Verified.
- ✅ 9c: Form Wizard template `301:1244` (header + 3-step stepper done/active/upcoming + step card w/ Fieldset + Back/Continue). Verified.
Templates page layout (x): AppShell 0 · List·Table 1640 · Detail 3280 · Dashboard 4920 · List·Blocks 6560 · Form 8200 · Form Wizard 9840.

### 2026-05-28 — SUBMITTER SCREENS phase begins (Hugo: "submitter screens now")
Grounding: spec `docs/superpowers/specs/2026-05-27-submitter-figma-prototype-design.md`, `personas/01-submitter.md`,
visual ref `prototypes/demandos-prototype-unified-v1.tsx`. Decisions: brand="**Intake**"; build FULL connected set
autonomously with a screenshot check-in each wave; screens on "**Submitter journeys**" page `2:789`; Portuguese copy;
seed = **Carlos Silva COO · INT-2026-014 · SSO/SAML + audit-log** (documented seed, NOT the prototype's "Gateway").
"Do not leave gaps between transitions" → build every screen any CTA references; gap-free graph (~18 frames).
Waves: A domain components → B golden-path spine → C branch+cross-cutting → D wiring.
Reuse existing Conductor components where they map: Version State Badge `2:105`, Progress-step row `2:231`,
Takeover shell `2:192`, Stepper `2:133`, Drawer shell `2:159`, plus the whole kit (Button 32:107 w/ label prop, Card 135:212, Avatar 102:148, StatusDot 97:152, Tag 100:137, Icons, StatCard 265:241, etc.).
- ⏳ Wave A domain components (Components page, new "Submitter domain" cluster). Dispatches: A1 metrics/status, A2a canvas-reqs, A2b canvas-value+gate, A3 conversation/sources/chrome.

## STATE: kit + 7 reference templates COMPLETE (2026-05-28). Submitter screens IN PROGRESS (Wave A).
Reference templates available to start any screen from: AppShell, List·Table, Detail, Dashboard, List·Blocks, Form, Form Wizard.
New reusable components added this session: FilterPill `249:240`, StatCard set `265:241`. Cover page still empty (optional DS cover).

---

## 2026-05-28 — TopBar polish

**Change:** Removed Avatar `166:48` ("CS") from TopBar `165:11` → Actions `166:27`. Topbar now ends at Bell+CountChip. Propagates to all Template instances automatically. Rationale: the user (avatar) belongs in a profile/account menu surface or sidebar context-switcher footer, not the topbar — keeps the topbar focused on navigation + global actions only.

**Verified:** screenshot of `165:11` shows brand · breadcrumbs · search · bell — no avatar.


## 2026-05-28 — Wave A2a (canvas-reqs)

Submitter-domain Canvas-Requirements layer added to Components page `0:1`, file `6Yfv523dlb2bfZS9zWGJly`.
Cluster bbox: x=12800, y=1800, w=1480, h=788. All fills/strokes/radii/spacing bound to existing tokens
(`color` 7:107, `space` 10:107, `radius` 10:118). No literal hex.

Components shipped:

- **A2a Header** `358:246` — frame at (12800, 1800), 187×27. Eyebrow "INTAKE · SUBMITTER DOMAIN" (Geist Mono Medium, `text/muted`)
  over Label/md "Canvas — requirements" (`text/ink`).
- **ConfidenceBar** set `360:258` — 3 variants:
  - `Level=low`  `360:246` — 28%, fill `red/600`
  - `Level=mid`  `360:250` — 62%, fill `amber/500`
  - `Level=high` `360:254` — 88%, fill `state/production`
  - 200×20 with 140×6 track (`border/hairline` bg, radius `full`), Mono/sm `%` label `text/muted`.
  - TEXT prop `percent#362:0` (set-level, default "62%") for instance-level overrides; per-variant default text baked.
  - Note: spec said `red/500` for low — `red/500` does not exist in the file; used `red/600`. Logged for follow-up.
- **DispositionPill** set `363:261` — 5 variants:
  - `State=answered`   `363:246` — bg `brand/tide-wash`, dot `brand/tide`, label "Respondido", `text/ink`
  - `State=inferred`   `363:249` — bg `tide/50`, dot `tide/300`, label "Inferido", `text/ink`
  - `State=assumption` `363:252` — bg `amber/50`, dot `amber/500`, label "Suposição", `text/ink`
  - `State=discovery`  `363:255` — bg `surface/sunken`, dot `text/faint`, label "Em descoberta", `text/muted`
  - `State=deferred`   `363:258` — bg `surface/sunken`, dot `border/strong`, label "Adiado", `text/muted`
  - All padding 4 8 4 8, radius `full`, hairline border. TEXT prop `label#363:0` exposed.
- **DispositionPicker** `364:246` — single component at (13380, 1980). Same visual as `answered` pill + a
  trailing chevron-down icon (instance of `74:145`, 12×12) exposed as INSTANCE_SWAP prop `trailing#364:0`.
- **RequirementRow** set `366:319` — 4 variants stacked vertically (24px gap inside set padding 24):
  - `State=ok`      `365:247` — base
  - `State=warn`    `366:269` — 4px absolute left strip `amber/500`, dimension chip bg `amber/50`
  - `State=error`   `366:286` — 4px absolute left strip `state/error`, header row bg `red/50` (subtle tint)
  - `State=focused` `366:303` — 2px outside stroke `brand/tide-bright`
  - 720 wide. VERTICAL auto-layout, padding `md`, gap `sm`, bg `surface/card`, hairline border, radius `lg`.
  - Header row: dimension chip (Eyebrow text, `surface/sunken` bg) + Label/md question (FILL) + DispositionPill
    instance (`State=answered`) + ConfidenceBar instance (`Level=mid`).
  - Body: Body/sm `text/ink`, FILL width, line-height 150%, default copy "Pagamentos perde 18% do funil…".
  - Footer: Meta "Inferido de" + file-text icon (76:138, 14×14) + Meta "deck.pptx" + spacer FILL + 3 ghost
    action icon instances (pencil 77:160, trash-2 77:156, sparkles 76:162).
  - TEXT props on set: `dimension#366:0`, `question#366:5`, `body#366:10`.
- **PendencyGroup** `368:335` — single component at (13560, 2080), 720×164.
  - VERTICAL auto-layout, padding `md`, gap `sm`, bg `surface/sunken`, hairline border, radius `lg`.
  - Header: alert-circle icon (77:140, 16×16, tinted `state/error`) + Label/md "Pendências críticas" `text/ink`
    + CountChip instance (104:136, text "3") + spacer FILL + chevron-down caret (74:145, 16×16, `text/muted`).
  - Body: 3 PendencyItem rows (Evidência / Stakeholders / Constraints) — each a HORIZONTAL row with dimension
    chip + Meta body text (FILL) + DispositionPill instance (discovery / assumption / discovery) + ConfidenceBar
    instance (`Level=low`). Padding `sm`, bg `surface/card`, hairline border, radius `md`.
  - TEXT prop `title#368:0`.

Decisions / follow-ups:
- Per-variant TEXT-property defaults can't differ on a single shared property; baked variant-specific text as
  the local characters and exposed a separate TEXT prop so authors can still override at instance level.
  ConfidenceBar's `percent` therefore behaves as expected when picking a variant (28/62/88) but switching the
  variant inside an instance won't auto-rewrite the % string unless the user clears the override.
- `red/500` color token missing from the file — used `red/600` for ConfidenceBar low; consider adding `red/500`
  to the primitives so Hugo's signal accents have the canonical mid step.
- alert-circle and chevron-down inner vector tints are best-effort (icons are instances; deeper vector recoloring
  was applied via `findOne(VECTOR/BOOLEAN_OPERATION)` which works when icons expose a single vector).

Validated: per-component screenshots confirm correct fills, widths, hierarchy. No literal hex anywhere.

## 2026-05-28 — Wave A2b (canvas-value+gate)

Submitter-domain component layer, second slice of Wave A. Built on the existing A2a cluster
(ConfidenceBar, DispositionPill, DispositionPicker, RequirementRow, PendencyGroup). Wave A2b
delivers the "value side" of the demand canvas (RICE-lite tension mirror + AI semantic reflection)
and the Readiness gate toolbar at the bottom of the canvas.

Cluster bbox (12800, 2780) → (13856, 3836). Sits ~200px below A2a cluster (whose bbox ends at y=2588).

- **A2b Header** `379:355` — frame at (12800, 2780), 187×29. Eyebrow "INTAKE · SUBMITTER DOMAIN"
  (Geist Mono Medium, `text/muted`) over Label/md "Canvas — value & gate" (`text/ink`).

- **ValueIndicatorMeter** set `382:395` — 3 variants in a HORIZONTAL grid (24px gap):
  - `State=balanced` `381:355` — pointers at 50%/50%; hint "Postura: equilibrada — sem tensões agudas"
  - `State=tense`    `382:355` — row 1 pointer at 75% (effort overshoot); hint "Esforço subestimado vs. alcance prometido"
  - `State=fragile`  `382:375` — row 2 pointer at 70% (urgency); hint "Urgência alta com confiança baixa"
  - 320 wide per variant. VERTICAL auto-layout, padding `md`, gap `md`, bg `surface/card`, hairline border,
    radius `lg`. Two axis rows (ALCANCE × ESFORÇO / CONFIANÇA × URGÊNCIA) — Eyebrow labels (72px fixed,
    `text/muted`) flank a 12px-tall track frame (FILL width) containing a 6px bar with two absolute segments
    (`brand/tide` / `amber/500`), 2px center tick (`border/strong`), and an absolutely-positioned 12×12
    `brand/tide-bright` pointer ellipse with 2px `border/strong` stroke. Bottom hint Meta text `text/faint`.
  - TEXT prop `hint#383:0` (set-level) wired to the hint text node in each variant.

- **TensionCallout** `385:355` — single COMPONENT at (12800, 3200), 480×133. HORIZONTAL auto-layout,
  padding `md`, gap `sm`, bg `brand/tide-wash`, `tide/300` border 1px, radius `lg`. Left 32×32 brand/tide
  square (radius `sm`) with white-tinted 16×16 sparkles icon (`76:162`). Right VERTICAL column: Eyebrow
  "TENSÃO PERCEBIDA" `text/muted`, Label/md headline `text/ink`, Body/sm body `text/muted`, and an action
  row with two ghost-md Button instances ("Refinar com IA" with leadingIcon=true, "Ignorar").
  TEXT props: `headline#385:0`, `body#385:1`.

- **SemanticReflectionCard** `387:368` — single COMPONENT at (13320, 3200), 480×200. VERTICAL auto-layout,
  padding `lg md lg md`, gap `sm`, bg `surface/card`, hairline border, radius `lg`, effect `elev/1`.
  Header row: 24×24 `brand/tide-wash` square (radius `sm`) with brand-tide-tinted 14×14 sparkles icon,
  Eyebrow "REFLEXÃO SEMÂNTICA" `text/muted`, spacer FILL, Meta stamp "atualizado há 12s" `text/faint`.
  Quote body: Body/md italic (Hanken Grotesk Italic loaded successfully — applied directly via `fontName`
  override on top of the Body/md text style), `text/ink`, default copy "Você está enquadrando um problema
  de receita com viés de produto…". Confidence row: Meta label + ConfidenceBar instance (Level=mid, percent
  override "72%"). Footer: secondary "Concordo" + ghost "Reformular" + spacer FILL + IconButton ghost-md
  instance with `x` icon (`74:139`).
  TEXT prop: `quote#387:0`.

- **GateToolbar** set `395:472` — 3 variants stacked vertically (24px gap):
  - `State=blocked` `395:408` — ReadinessRing State=building (38%), primary disabled (`disabled#33:26`=true),
    status "Em construção", note "Defina pelo menos 5 dimensões para destravar". Trailing arrow hidden.
  - `State=near`    `390:387` — ReadinessRing State=near (64% +26%), primary enabled, status "Quase pronto",
    note "Faltam 2 evidências críticas para abrir a passagem". Trailing arrow visible (brand/tide tint).
  - `State=ready`   `395:440` — ReadinessRing State=ready (100% PRONTO), primary enabled, status "Pronto
    para Discovery", note "Todas as dimensões com confiança suficiente". Trailing arrow visible.
  - 840 wide per variant (widened from spec's 720 to fit "Passar para Discovery" without text clipping after
    button HUG sizing). HORIZONTAL auto-layout, padding `md lg md lg`, gap `lg`, bg `surface/card`, hairline
    border (top-only via `strokeTopWeight=1`, other sides 0), radius `lg`, effect `elev/2`.
  - Left cluster: ReadinessRing instance native 96×96 then `rescale(56/96)` to ~56×56 (instance.resize alone
    leaves inner ellipses at 96×96, clipping them — rescale shrinks all children proportionally and worked
    cleanly). Followed by a text column (Label/md status + Meta note, gap `xs`).
  - Action cluster: ghost-md "Adiar" + secondary-md "Pedir revisão" + primary-cluster (primary-md "Passar
    para Discovery" + 16×16 arrow-right icon `75:131`, tinted `brand/tide` so it stays visible against the
    white card surround).

Anomalies / follow-ups:

- **Button has no INSTANCE_SWAP icon prop.** The shared Button (`32:107`) exposes `leadingIcon#33:0` and
  `trailingIcon#33:13` as BOOLEAN switches over white RECTANGLE placeholders — there is no swap slot to
  inject an actual `arrow-right` vector inside the button. Resolved per spec's fallback: composed the
  arrow-right icon as a sibling of the primary Button instance inside a small `primary-cluster` HORIZONTAL
  auto-layout, with the arrow tinted `brand/tide` (instead of `text/on-brand`) so it reads against the white
  card. Consider adding a proper trailingIcon INSTANCE_SWAP to the Button library down the road.

- **Set-level TEXT props with state-specific defaults are not supported.** Adding `status` and `note` TEXT
  props at the GateToolbar set level pushed a single default ("Quase pronto" / "Faltam 2 evidências...")
  across all three variants. Deleted those props and baked each variant's copy directly as text-node
  characters. Instance authors can still edit the text via the canvas (it's a plain TEXT node), but there's
  no exposed component property for overriding `status`/`note` on instances; this matches the trade-off
  documented in the A2a entry for ConfidenceBar `percent`.

- **Italic on SemanticReflectionCard quote** — Hanken Grotesk Italic IS available in the file; applied via
  direct `fontName = { family: 'Hanken Grotesk', style: 'Italic' }` after `setTextStyleIdAsync(Body/md)`.

- **Font preload** — `Geist Mono Medium/Regular` (Eyebrow style) was not preloaded by default and required an
  explicit `loadFontAsync` at the start of every script that wrote text. Worth pinning as a recipe before any
  Submitter-domain text work.

Validated: per-component screenshots confirm correct fills, widths, hierarchy. No literal hex anywhere; all
fills, strokes, paddings, gaps, and radii bound to the color/space/radius collections.

## 2026-05-28 — Wave A3 (chrome+conversation+sources)

Final wave of the Submitter persona's domain-component layer. Built the chrome (notifications panel, global
copilot sheet), conversation surface (copilot messages + multimodal composer), and sources panel
(source-card + sources-tray). Placed below A2b with ~200px of air starting at y=4040.

### Cluster bounding box

- x: 12800 → 14760
- y: 4040 → 6188
- ~1960 × 2148 px

### Components built (8 total)

| Component | Type | Node ID | Variants | Position |
|-----------|------|---------|----------|----------|
| A3 Header (text frame) | FRAME | `415:444` | — | (12800, 4040) |
| BlockReferenceChip | COMPONENT_SET | `416:488` | 4 (Type=doc/email/chat/meeting) | (12800, 4120) |
| CopilotMessage | COMPONENT_SET | `420:506` | 3 (Role=user/ai/system) | (12800, 4220) |
| MultimodalComposer | COMPONENT_SET | `422:584` | 3 (State=empty/typing/with-attachments) | (12800, 4520) |
| SourceCard | COMPONENT_SET | `425:683` | 4 (Type=document/deck/sheet/video) | (12800, 5000) |
| SourcesTray | COMPONENT | `426:608` | — | (14400, 5000) |
| NotificationRow | COMPONENT_SET | `427:734` | 8 (State × Type = unread/read × mention/update/alert/gate) | (12800, 5380) |
| TopBarNotifications | COMPONENT | `429:670` | — | (12800, 5680) |
| GlobalChatSheet | COMPONENT | `430:720` | — | (13280, 5680) |

### Variant IDs (key references)

- **BlockReferenceChip**: doc `416:444`, email `416:455`, chat `416:466`, meeting `416:477`
- **CopilotMessage**: user `418:472`, ai `419:473`, system `420:498`
- **MultimodalComposer**: empty `421:503`, typing `422:513`, with-attachments `422:538`
- **SourceCard**: document `424:548`, plus deck/sheet/video siblings inside set `425:683`
- **NotificationRow**: 8 variants `427:?`, named `State=unread|read, Type=mention|update|alert|gate`

### Reused upstream components

- Icons: `sparkles 76:162`, `file-text 76:138`, `arrow-right 75:131`, `x 74:139`, `check 74:142`,
  `chevron-right 74:148`, `alert-circle 77:140`, `search 74:131`, `zap 76:165`, `settings 75:158`
- Atoms: `Avatar set 102:148` (Size=md, Type=initials = `102:136`), `Tag default 100:128`,
  `CountChip 104:136`, `Kbd 107:136`, `IconButton ghost md 111:141`, `IconButton ghost sm 111:136`,
  `Input default 34:107`, `Button ghost md 31:142`
- Cross-component embeds: GlobalChatSheet embeds CopilotMessage `user` × 2 + `ai` × 1 + MultimodalComposer
  `typing`. TopBarNotifications embeds 4 NotificationRow variants (unread/mention, unread/alert,
  unread/gate, read/update).

### Anomalies & follow-ups

- **No mic / email / chat / meeting / slide-deck icons in the file.** MultimodalComposer uses `zap` as a mic
  proxy. BlockReferenceChip uses `file-text` for all four types and distinguishes them via background tint
  (violet/green/amber/stone). SourceCard `deck/sheet/video` also use `file-text` and differentiate by the
  preview-strip thumbnail color. Add real glyphs (microphone, email, slack, calendar, slide-deck) when the
  icon set is extended.

- **IconButton placeholder leadingIcon doesn't accept color swap.** Same as documented in A2a — the
  IconButton wraps an INSTANCE_SWAP rect that renders the icon; recoloring the icon to white/on-brand
  requires editing the icon component, not the button. The CopilotMessage `ai` badge and GlobalChatSheet
  `Copilot global` badge both contain a `sparkles` icon inside a `brand/tide` square that renders in default
  ink color rather than `text/on-brand`. Cosmetic — fix when icon components expose a fill prop.

- **CountChip in SourcesTray** shows `3` because that's the existing component default; intended value is
  `4`. The component is not parameterized via TEXT prop at the source-of-truth level. Bake an override when
  composing real screens, or upgrade CountChip to expose a `value` TEXT prop in a future wave.

- **Input component lacks a TEXT prop for placeholder.** SourcesTray's searchbar renders the upstream's
  built-in "Placeholder" text. Override on instance level when composing screens; or upgrade Input to expose
  a `placeholder` TEXT prop in a future wave.

- **Instance-level TEXT defaults reset on creation.** GlobalChatSheet's embedded MultimodalComposer
  (`typing` variant) renders with the empty placeholder because the TEXT prop's default reverts on
  instantiation. Same with the 4 NotificationRow instances inside TopBarNotifications — they show the
  default mention headline. Treat as illustrative; downstream composers will override `value`, `headline`,
  `meta` per usage.

- **Set-level dashed-border wrapper frames** — every COMPONENT_SET uses a dashed `border/hairline` stroke
  with `fills=[]` for visual grouping, matching A1/A2a/A2b convention.

- **A3 cluster screenshot couldn't be taken as a single bbox PNG.** Tried wrapping in a Frame (empty since
  the children aren't actually descendants) and a Section (same — children remain page-level). Took
  per-component screenshots instead. Future-proof: build a top-level Frame to *contain* (not just overlap)
  cluster children if a single PNG is needed for review.

- **Stray Ellipse `316:241` at (12800, 4400)** — moved to (100000, 100000) at the start of the wave to clear
  the build zone. Did not delete (user content).

- **Notification icons.** The mention/update/alert/gate type icons inside NotificationRow are
  `sparkles/file-text/alert-circle/check` and inherit the icon component's default fill — they read as ink
  against the type-specific tinted backgrounds (`brand/tide-wash`, `surface/sunken`, `red/50`,
  `state/production-wash`/`green/50`). Recoloring to `red/600`, `green/600`, `brand/tide` etc. requires the
  icon-fill-prop upgrade noted above.

- **Filter tabs underline bar** in TopBarNotifications uses an opacity-0 rect on inactive tabs to preserve
  layout height; the active tab's bar is bound to `brand/tide-bright`. Considered using `dashPattern` or
  visibility toggles — opacity-0 is simpler and matches the visual.

- **Italic system message** in CopilotMessage uses direct `fontName = { family:'Hanken Grotesk',
  style:'Italic' }` + size 12 (Body/sm equivalent) rather than a style ref — there's no `Body/sm-italic`
  style. Same approach as the SemanticReflectionCard quote.

- **Strict serial build order.** All 8 components built in single-file sequence per spec; no parallel
  `use_figma` writes. Each component screenshot-verified before proceeding to the next.

Validated: per-component screenshots all clean, no literal hex, all fills/strokes/padding/gap/radius bound to
design tokens. Reused upstream atoms (Avatar, Tag, CountChip, Kbd, IconButton, Input, Button) and Wave A1/A2
domain components where called for.

## 2026-05-28 — Wave B.1 (Sign in + Dashboard)

First two screens of the Submitter golden path, built on page **`2:789` (Submitter journeys)** of file
`6Yfv523dlb2bfZS9zWGJly`. Strictly serial, all writes bound to design tokens.

### Screen IDs and bounding boxes

| Screen | Node ID | Position | Size |
|--------|---------|----------|------|
| B0 · Sign in | `439:2` | (0, 0) | 1440 × 900 |
| B1 · Dashboard | `441:14` | (1560, 0) | 1440 × 900 |

### B0 · Sign in — composition

- Root frame `439:2` HORIZONTAL, fill `surface/canvas` (warm paper stone-50)
- Left column `439:3` — 640px fixed, padding `4xl`, gap `xl`, Display "Sua próxima decisão começa aqui.",
  body intro, italic quote attributed to Hugo Seabra
  - Tide mark `439:4` (56×56, radius `lg`, fill `brand/tide`) — simple block, no inverted-T glyph
- Right column `440:2` — FILL, padding `4xl`, gap `lg`, centered
- Sign-in card `440:3` — 400px fixed, `surface/card`, hairline border, radius `xl`, padding `2xl`,
  effect style `elev/1`
  - Buttons: SSO `440:9` (primary lg, FILL), Google `440:18` (secondary lg, FILL),
    Microsoft `440:23` (secondary lg, FILL)
  - Divider with text "ou" `440:14` built inline (2 hairline lines + Meta text)
  - Real Divider component instance `440:28`
  - Request access link in `brand/tide-text` Inter Semi Bold

### B1 · Dashboard — composition

Cloned AppShell template `210:3` → `441:14` (AppShell is a FRAME, not a component — used
`node.clone()`).

- Sidebar `441:15` — instance of Sidebar `168:33`
  - ContextSwitcher initials `I → I` and label `Acme Inc → Intake`
  - Brand text `Acme → Intake` (mark glyph preserved)
  - Renamed nav "Items" → "Demandas" and forced its variant `State=selected` (active pill).
- TopBar `441:17` — `showBrand` already false in the template default
  - Breadcrumbs `I441:17;166:11`: kept Home, mutated "Section" → "Demandas",
    hid the 3rd ("Current") segment frame so the trail reads `Home › Demandas`.
- Content area `441:18` — padding `xl`, gap `xl`:
  - Page header `444:160` with eyebrow / H1 "Boa tarde, Hugo." / subtitle and two right-aligned actions
    (Filtrar `444:167` ghost md, "+ Nova demanda" `444:172` primary md — both forced to HUG so they don't
    clip)
  - **AIImpactBanner instance `444:177`** (variant `scope=portfolio`) — label mutated to
    "18h economizadas · 65% automatizado neste portfólio"
  - Metrics block `446:183` VERTICAL gap `lg`:
    - **HeroMetric instance `446:184`** (variant `state=data`) — label "IMPACTO FINANCEIRO DAS SUAS
      DEMANDAS · YTD", value "R$ 412k", trend "+R$ 78k projetados". The "PAY-JUSTIFYING KPI" sticker
      child `I446:184;334:246` is hidden because it visually overflowed the frame edge.
    - Rings row `446:211` with two demand blocks:
      - **ReadinessRing instance `446:213`** variant `State=near`, percent forced to "64%" with
        StateBadge `Em Captura` for INT-2026-014 (SSO/SAML Pagamentos)
      - **ReadinessRing instance `446:228`** variant `State=ready`, percent "100%" with StateBadge
        `Em Execução` for INT-2026-002 (Multi-currency wallet)
  - Demands table section `450:223`:
    - Section header with Eyebrow "MINHAS DEMANDAS" + CountChip (count=8) + "Ver todas →" link in
      `brand/tide-text`
    - Table `450:230` built inline (header row in `surface/sunken` + 5 body rows with hairline
      bottom-border separators) — 5 columns: ID (Mono/sm), Demanda (Body/sm Medium), Estado
      (StateBadge), Prontidão (ConfidenceBar), Atualizado (Meta).
      Rows for INT-2026-014/013/011/009/007 with the spec'd states, levels, and updated times.
  - Below-fold row `451:249` HORIZONTAL gap `lg`:
    - **SemanticReflectionCard instance `451:250`** (FILL) — quote prop overridden to "Seu portfólio
      está concentrado em escalabilidade de Pagamentos. Considere balancear com 1 demanda de
      fidelização."
    - Activity card `451:304` (400×, surface/card, hairline, radius `lg`) with eyebrow
      "ATIVIDADE RECENTE" + 3 **NotificationRow instances** `451:306`/`451:324`/`451:342`
      (Type=mention/update/gate with mention&update unread, gate read).

### Key component instance IDs

| Component | Instance | Variant / override |
|-----------|----------|--------------------|
| AIImpactBanner `329:244` | `444:177` | `scope=portfolio`; label mutated |
| HeroMetric `336:246` | `446:184` | `state=data`; label/value/trend/sub overridden; kpi-badge hidden |
| ReadinessRing `320:241` | `446:213` (near 64%), `446:228` (ready 100%) | value text overridden |
| StateBadge `341:246` | (multiple) | one per demand row + 2 in rings |
| ConfidenceBar `360:258` | (multiple) | one per table row; percent text forced via direct override |
| SemanticReflectionCard `387:368` | `451:250` | quote prop overridden |
| NotificationRow `427:734` | `451:306`, `451:324`, `451:342` | mention/update/gate variants |
| CountChip `104:136` | one in section header | count="8" |
| Button `32:107` | many | primary/secondary/ghost lg+md |
| Divider `136:214` | `440:28` in B0 card | default |

### Anomalies & workarounds

- **AppShell is a template FRAME** — used `node.clone()` not `createInstance()`. Mutations to the
  cloned sidebar/topbar instances (text characters, variant props) propagated cleanly.
- **Sidebar nav "Demandas" active state.** The template's Sidebar has nav items
  Home/Items/Reports/Settings (no "Demandas"). Renamed `Items → Demandas` and set its MenuItem
  variant `State=selected`. Home remained default. Tradeoff: copy reflects spec, but nav order is
  template-determined.
- **ContextSwitcher initials.** Mutated `A` (avatar initial) → `I` and `Acme Inc` → `Intake`.
- **Breadcrumbs.** Template renders 3 segments by default. To get `Home › Demandas` (2 segments)
  cleanly, mutated middle segment text and hid the third segment frame (`visible = false`).
- **ConfidenceBar percent override.** Each variant of the COMPONENT_SET has hardcoded text
  ("28%", "62%", "88%") that overrides the `percent` componentProperty TEXT default. Had to find
  the `percent` text node directly inside each instance and `characters = '…'` it after font load.
- **HeroMetric width vs content area.** HeroMetric component is 1216px wide; content area is 1152px
  (1200 RightCol − 24 padding). Setting `layoutSizingHorizontal = 'FILL'` works fine, but I also
  hid the "PAY-JUSTIFYING KPI" sticker child since it visually intruded into the rings row.
- **MetricsRow initial height clip.** When switching `metricsRow` from HORIZONTAL to VERTICAL
  layout, `primaryAxisSizingMode` stuck on FIXED at the old height (135) which clipped the rings
  row underneath. Fixed by re-setting `primaryAxisSizingMode = 'AUTO'`.
- **Button HUG.** Several Button instances came out FIXED-width (80px) from the variant default.
  Forced `primaryAxisSizingMode = 'AUTO' + layoutSizingHorizontal = 'HUG'` on the Filtrar and
  "+ Nova demanda" instances so the labels fit.
- **Stale child IDs after instance text edit.** After mutating a nested text inside the Sidebar
  instance, subsequent `findAll` against the cached path threw "node not found". Re-discovered
  every nav item by traversal from the cloned root each call.

### Tokens & styles touched (verification)

All visual properties bound — no literal hex:

- Fills: `surface/canvas`, `surface/card`, `surface/sunken`, `brand/tide`
- Text: `text/ink`, `text/muted`, `text/faint`, `brand/tide-text`
- Strokes: `border/hairline`
- Padding/gap: `space/xs`, `space/sm`, `space/md`, `space/lg`, `space/xl`, `space/2xl`, `space/4xl`
- Radii: `radius/lg`, `radius/xl`
- Effects: `elev/1` on B0 sign-in card
- Text styles applied: Display, Heading/H1, Heading/H2, Eyebrow, Body/md, Body/sm, Mono/sm, Meta

## 2026-05-28 — Wave B.2 (Nova demanda + IA lendo + Demand Panel)

Built three connected Submitter golden-path screens on page **Submitter journeys** (`2:789`),
extending the B0/B1 chain to the full intake flow.

### Frames created

- **B2 · Nova demanda** — `468:345` at (3120, 0), 1440×900
- **B3 · IA lendo** — `473:532` at (4680, 0), 1440×900
- **B4 · Demand Panel — drafting** — `478:703` at (6240, 0), 1440×900

Each frame is a clone of `AppShell` template `210:3`. Sidebar/topbar chrome was mutated to
match B1's identity overrides: ContextSwitcher "Intake", Mark text "Intake", Demandas
MenuItem set to selected with `icon#118:5=76:152`, profile to Hugo Seabra / COO with HS
avatar initials, topbar `showBrand#232:0=false`, breadcrumbs per screen.

### B2 · Nova demanda — content highlights

- Page header VERTICAL block: Eyebrow "NOVA DEMANDA · INTAKE 014 SUGERIDO" → H1
  "Capture o problema antes da solução." → Body/md subhead; right-aligned ghost
  "Cancelar" button (`469:426`).
- 2-column main: LEFT (FILL) two stacked cards (Enunciado `470:425`, Evidência inicial
  `470:444`); RIGHT (FIXED 400) AI scaffold preview card (`471:528`) + Tip card
  (`471:576`).
- AI scaffold card carries the **next-screen CTA** "Pré-analisar com IA" (primary lg full-width,
  `471:570`) — telegraphs B3 transition.
- BlockReferenceChip instances for the two known sources: `470:513` (doc) +
  `470:531` (meeting).

### B3 · IA lendo — content highlights

- Centered hero composition (720 wide): 96px tide-wash pulse ellipse behind a 64×64
  tide-wash square containing the 32×32 sparkles icon (recoloured to `brand/tide`); Mono
  eyebrow "INTAKE 014 · LENDO SEU CONTEXTO" → H1 "Lendo deck-pagamentos-Q3.pptx" → Body/md
  subhead.
- Progress sub-row: ConfidenceBar (Level=mid, percent "62%") + Meta meta-line.
- Discoveries card `475:611` (720 wide, `elev/1`) with 6 live extraction rows
  (4 done with `state/production` checks + 2 in-progress with `brand/tide-bright` dots).
- Source cards row: 2 SourceCard `document` variants (`475:637`, `475:693`) rescaled
  to ~240 width.

### B4 · Demand Panel — content highlights ★

- Page header strip: INT-2026-014 Mono + StateBadge "Em Captura" (`479:783`) → H1
  "SSO/SAML para Pagamentos" → meta "Por Hugo Seabra · há 12 min · 2 fontes · 5/8 dimensões ·
  atualizando ao vivo" (last clause in `brand/tide-text`); right-side ghost buttons
  Adiar / Pedir revisão / Compartilhar.
- 3-column workspace (`479:807`): **LEFT col 240** — ReadinessRing card (`480:793`, near
  variant), compact pendency card replacement (`495:1628`, see anomaly below),
  ValueIndicatorMeter `tense` (`480:870`).
- **CENTER col FILL** — section header with CountChip "5/8" + ghost buttons
  Reordenar / Ocultar 'inferidos'; **8 RequirementRow instances** stacked:
  - `481:899` PROBLEMA (ok)
  - `481:959` ORIGINADOR (ok)
  - `481:997` ALCANCE (warn)
  - `481:1058` IMPACTO (ok)
  - `481:1096` URGÊNCIA (warn)
  - `481:1135` EVIDÊNCIA (error)
  - `481:1196` CONSTRAINTS (warn)
  - `481:1235` STAKEHOLDERS (focused)
- **RIGHT col 300** — SemanticReflectionCard (`482:1281`, quote override applied),
  TensionCallout (`482:1316`, headline + body override applied), GlobalChatSheet
  (`482:1352`, rescaled to 360 wide).
- Bottom sticky **GateToolbar `near`** (`483:1574`) provides the canonical CTAs
  Adiar / Pedir revisão / Passar para Discovery → with the inline ReadinessRing summary.

### Anomalies & decisions

- **RequirementRow setProperties does not drive nested TEXT nodes for body.** The component
  exposes `dimension#366:0`, `question#366:5`, `body#366:10` as TEXT properties, but only
  dimension+question text nodes appear to be bound — the inner `body` TEXT node retains
  its default characters ("Pagamentos perde 18% do funil…"). Worked around by directly
  mutating the `body` text nodes inside each instance after creation (`getStyledTextSegments`
  → loadFontAsync → setCharacters). Component-side fix: bind the `body` TEXT node to the
  `body#366:10` instance-swap-text property in the master.
- **PendencyGroup `368:335` does not scale below ~480px.** At a 240-wide left column the
  internal `pendency-item` HORIZONTAL frames have FIXED-200 confidence bars + HUG
  dim-chip + HUG disposition pill, leaving 1px for the body text which then wraps
  one-character-per-line (item height 400–448 each). Confidence sub-instance resize is
  blocked because it's a nested instance child. Replaced with a custom compact pendency
  card (`495:1628`): icon + title + CountChip + 3 plain dot+text rows. Component-side fix:
  make confidence bar FILL with min-width, or accept a separate "compact" variant.
- **ValueIndicatorMeter at 240px** stacks the ALCANCE/CONFIANÇA labels over the bars.
  Functional but visually overlapping. Kept as-is; rebuild as a stacked variant if needed.
- **RequirementRow confidence resize ignored.** Tried to shrink the internal `confidence`
  sub-instance to 120 before realising the workspace fix (narrower cols) was enough.
  Confidence stayed at native 200; question text gets ~230px which is enough for short
  questions but truncates "Quem decide e quem precisa estar a bordo?" — accept for now.
- **MultimodalComposer default attachment chips kept.** The instance shows "deck.pptx · 2.4MB"
  and "notas.pdf · 18KB" as fallback — these are component defaults not exposed as text
  props, so we accepted them per spec rather than detaching the instance.
- **Continuity chain.** B1's "+ Nova demanda" button (444:172) → B2; B2's "Pré-analisar com
  IA" CTA (471:570) → B3; B3 finishes → B4 drafting. Prototype wiring not added (no
  request to author flow connections in this wave).

### Tokens & styles touched (verification)

All visual properties bound — no literal hex on any new node.

- Fills: `surface/card`, `surface/sunken`, `brand/tide`, `brand/tide-wash`, `border/hairline`,
  `state/error`, `state/production`, `brand/tide-bright`.
- Text: `text/ink`, `text/muted`, `text/faint`, `brand/tide-text`, `text/on-brand`.
- Strokes: `border/hairline`.
- Padding/gap: `space/xs`, `space/sm`, `space/md`, `space/lg`, `space/xl`, `space/2xl`,
  `space/3xl`.
- Radii: `radius/sm`, `radius/md`, `radius/lg`.
- Effects: `elev/1` on AI scaffold card (B2) + Discoveries card (B3); `elev/pop` on B3
  hero inner square.
- Text styles applied: Display, Heading/H1, Heading/H3, Eyebrow, Body/md, Body/sm, Mono/sm,
  Meta, Label/md.

## 2026-05-28 — Wave B.3 (Pre-send + Handoff + Timeline + Outcome)

Closed the Submitter golden path. The page `2:789` "Submitter journeys" now holds
B0..B8 — nine 1440x900 frames at 1560px intervals.

Screens shipped:

- **B5 · Pre-send review** `507:1564` at x=7800
  Two-column review sheet. LEFT: checklist card with the 8 dimensions (each row
  carries a check/warn icon, dimension Tag, short answer, Meta, DispositionPill
  and ConfidenceBar) followed by an inline amber-50 pendency block listing the
  two open items. RIGHT 360px column: ReadinessRing `near` (Quase pronto),
  Destination card with arrow chip for Carla Ribeiro · Discovery, an opcional
  add-on with two Tags (one selected = "Pode esperar 48h"), and the action stack
  with primary "Passar para Discovery" + ghost "Voltar ao panel".
  Breadcrumbs detached to extend to 4 items (Home > Demandas > INT-2026-014 >
  Revisão final, last marked State=current).

- **B6 · Handoff confirm** `511:1718` at x=9360
  Celebration moment, centered. 80x80 production-wash square (radius xl, elev/pop)
  with a 40x40 check icon in `state/production` green nested inside a 120x120
  fainter ring. H1 "Passou para Discovery.", supporting Body/md. Timeline preview
  card 720px wide with 5 TimelineStateRow instances (done/done/active/upcoming/
  upcoming), horizontal divider, centered Meta. Action row with secondary
  "Ver timeline completa ->" + ghost "Voltar ao Dashboard" (both HUG-sized).
  AIImpactBanner `scope=demand` slid in below at 720px wide.

- **B7 · Timeline** `517:1853` at x=10920
  Three-column post-handoff view. Header row carries Mono eyebrow + StateBadge
  "Em Discovery" + H1, plus ghost "Compartilhar"/"Exportar" buttons. LEFT 280px:
  Overview card (ReadinessRing locked at `near`, "Pacote enviado"), People card
  with Carla as Discovery lead and stakeholders Marcos Lima/Ana Souza/Ricardo
  Pinto. CENTER: section header with StateBadge, vertical stack of 6
  TimelineStateRow instances (done/done/active + 3 upcoming with estimates), and
  a sunken expanded event card under the active row carrying the 30/05 14h
  discovery session note + two Tags + ghost "Abrir convite" button. RIGHT 360px:
  Notifications card with CountChip "4" + tide-text "Marcar como lido" + 4
  NotificationRow instances (mention/update/gate/alert mix of unread/read), and
  Linked sources card with 3 BlockReferenceChip instances (deck/CISO meeting/
  transcript). Breadcrumbs again extended to 4 items, last set to "Timeline".

- **B8 · Outcome** `521:2066` at x=12480
  Delivered state. Header eyebrow "INT-2026-014 · ENCERRADA" + StateBadge
  "Entregue" + H1 "SSO/SAML para Pagamentos · entregue", plus ghost
  "Compartilhar resultado" and primary "+ Nova demanda". Hero strip splits 60/40:
  LEFT HeroMetric `state=data` mutated to show "+R$ 78k" with delta "+R$ 12k acima"
  and subline "8 entregas · ROI confirmado pelo CFO"; RIGHT 360px Achievements
  card listing 4 entregue milestones with production-green check icons.
  Compact horizontal completed-journey strip with 5 production-wash circles
  (Captura/Triagem/Discovery/Execução/Entrega) connected by hairline lines plus
  date Meta labels. Below the fold: Evidence card (Body/md narrative + 3
  BlockReferenceChip refs in a wrap row) and the highlighted Next demand CTA
  card (elev/1) with brand/tide-wash icon box, H3 "Pronto para a próxima?", and
  full-width primary "Capturar nova demanda".

Tokens & conventions held the line:
- Color: surface/card, surface/sunken, text/{ink,muted,faint}, border/hairline,
  brand/{tide,tide-text,tide-wash}, state/{production,production-wash,running,
  running-wash}, amber/{50,500,600}. No literal hex anywhere.
- Spacing: space/{0,xs,sm,md,lg,xl,2xl,3xl,4xl} bound via setBoundVariable on
  paddingTop/Right/Bottom/Left and itemSpacing.
- Radius: radius/{sm,md,lg,xl,full} bound on the four corner radii.
- Effects: elev/pop on B6 hero check square; elev/1 on B8 Next demand card.
- Text styles applied: Display NOT used in this wave; Heading/H1, Heading/H3,
  Label/md, Label/sm, Eyebrow, Body/md, Body/sm, Meta, Mono/sm covered the rest.

Continuity:
- B4 "Passar para Discovery" -> B5 review sheet.
- B5 primary -> B6 confirm.
- B6 "Voltar ao Dashboard" -> B1; "Ver timeline completa" -> B7.
- B7 (time passes) -> B8 outcome.

Anomalies / accepted compromises:
- Default Breadcrumbs instance only carries 3 BreadcrumbItems; for B5 and B7 we
  detached the instance and cloned the third item to add a 4th, then swapped it
  to State=current. B6 and B8 only need 3 levels and kept the live instance.
- ConfidenceBar's `percent#362:0` TEXT property set on instances showed mixed
  visual update behavior in B5 (the underlying bar rendered correctly but the
  trailing percent label stayed at the variant default in some rows). Accepted
  for this wave; revisit when the component is upgraded.
- AppShell sidebar still shows the template defaults (Acme / Acme Inc / Carlos
  Silva COO) because the underlying Sidebar component instance was never
  customised in the chain (matches B0..B4 chrome). Brand/profile mutation
  belongs to a follow-up wave that updates the template itself.
- Button variant Size=lg defaults to a fixed 80px width; in B6 we explicitly
  set `layoutSizingHorizontal = 'HUG'` after instancing so the labels render
  without truncation.

Frame IDs (top-level of page `2:789`):
- B5 `507:1564` ; B6 `511:1718` ; B7 `517:1853` ; B8 `521:2066`.

## 2026-05-28 — Wave B.3 chrome fix
Applied missing chrome mutations to B5/B6/B7/B8 to match B1-B4: Intake brand, Demandas nav selected, Hugo Seabra HS profile.

## 2026-05-28 — Wave C.1 (Empty + Demandas list + Notifications inbox)

Three cross-cutting Submitter surfaces built on the Submitter journeys page
(`2:789`). Each clones the AppShell template (`210:3`) and applies the
Intake/Hugo Seabra chrome (brand text, ContextSwitcher "Intake" + "I",
profile "Hugo Seabra" + "HS", MenuItem "Items" renamed to "Demandas").

Frame IDs (top-level of page `2:789`):
- C0 `535:2223` — "C0 · Empty Dashboard" at (14040, 0)
- C1 `548:2298` — "C1 · Demandas" at (15600, 0)
- C2 `560:2492` — "C2 · Notifications" at (17160, 0)

### C0 · Empty Dashboard
First-run state. Home nav stays selected (this IS the home destination).
Breadcrumbs reduced to just "Home" (Section/Current crumbs hidden).
Content: monospace eyebrow date line, H1 greeting, H2 hero card with sparkles
icon (40px, tinted brand/tide) inside an 80px tide-wash square with elev/pop,
primary CTA "+ Nova demanda" (width 280, size lg) with ⌘N kbd hint, and two
helper cards (Importe uma reunião / Comece com um exemplo) on the sunken
surface. Footer meta in text/faint.

### C1 · Demandas (full list)
Demandas nav selected. Breadcrumbs "Home > Demandas".
- Page header: "MINHAS DEMANDAS · 8 TOTAL" eyebrow, H1 "Demandas", Exportar
  (ghost) + "+ Nova demanda" (primary) actions.
- Filter bar: Input ("Buscar demandas…", 360w), 3 FilterPills (estados /
  urgência / donos), "+ Filtro" ghost button, Spacer FILL, sort dropdown.
- DataTable built from atomic pieces (TableHeaderCell `139:214` + per-row
  HORIZONTAL frames). Columns: ID (110, Mono/sm), DEMANDA (FILL, Label/md
  + Meta subtitle), ESTADO (140, StateBadge instance per state), PRONTIDÃO
  (180, ConfidenceBar instance with percent text), FONTES (80, count),
  ATUALIZADA (110, Meta), Actions (40, IconButton ghost + chevron-right).
- 8 body rows representing the full portfolio lifecycle (Em Captura through
  Entregue). Last row has no bottom border.
- Pagination row beneath table: "1–8 de 8" meta on the left, Spacer FILL,
  Pagination instance (`119:169`) on the right.

### C2 · Notifications inbox
Home nav selected (chrome destination, ambiguous between Home/Demandas;
picked Home). Breadcrumbs "Home > Notificações".
- Page header: "INBOX · 12 NÃO LIDAS · 47 TOTAL" eyebrow, H1 "Notificações",
  "Marcar como lido" (ghost) + "Configurar" (secondary) actions. Both
  buttons forced to `layoutSizingHorizontal = 'HUG'` (the Button default
  variant ships at FIXED 80px and clips long labels otherwise).
- Tab strip: 5 underlined tabs (Tudo active with brand/tide-bright 2px bar;
  Menções / Updates / Alertas / Gate inactive in text/muted). Strip has a
  hairline bottom border via `strokeBottomWeight=1`. Spacer FILL + two
  FilterPills (Últimos 7 dias / Todas as demandas) on the right.
- Notification list: card with hairline, radius/lg, clipsContent. 12 rows
  grouped under 3 day headers (sunken bg, hairline borders top+bottom):
  - HOJE · 28 MAI — 6 rows mixing unread/read x mention/update/alert/gate
  - ONTEM · 27 MAI — 3 rows (alert unread, mention read, gate read)
  - SEMANA PASSADA — 3 rows (update, mention, update — all read)
- Footer: "Carregar mais" ghost button centered.

### Recurring gotcha — fixed across all 3 screens
`setBoundVariableForPaint` returns a paint whose `color` field is
`{r:0, g:0, b:0}` (Figma stores the fallback as black even when bound).
The bound variable resolves correctly in the variables overlay panel, but
visually rendered fills/strokes show as black because the resolved color
isn't precomputed into the paint's `color` field. Fix: build a
`resolveColor(varId)` cache that walks `valuesByMode` (following
`VARIABLE_ALIAS` chains) to the underlying RGB, then bake that RGB into
`paint.color` while keeping `boundVariables.color` intact. Run a recursive
fix pass over the whole frame after construction to repair any black
fallbacks introduced by helper functions. B1-B8 (Wave B) had this already
because the original AppShell template carried real RGB values; our newly
created paints needed the fix.

### MenuItem state swap caveat
After cloning the AppShell, mutating "Items" -> "Demandas" via direct text
characters change, and then calling `setProperties({ State: 'selected' })`
on the menu item: collect menu item IDs BEFORE mutating the text label,
then re-fetch the menu item by ID. Otherwise the post-mutation `findAll`
sometimes encounters stale instance text nodes (because changing the label
on a nested component instance re-keys descendant IDs in some cases).

### ConfidenceBar percent text
`percent#362:0` TEXT property writes the displayed percentage successfully,
but the bar's filled width is a static asset within each Level variant (low
/ mid / high) — it does not reflow based on the percent text. This is by
design of the component; the text is informational, the bar is variant-
driven. Choose Level to match the bracket containing the percent.


## 2026-05-28 — Wave C.2 (Read-only + Devolução + Arquivada + Search)

Built the final four demand-side branches on page `2:789`
(Submitter journeys), bringing the page total to **16 frames** spanning
x=0..23400. All frames are 1440×900, chrome-mutated AppShell clones,
tokens-bound, components from the existing library only.

### Frames added

| Frame | Node ID | x | What it is |
|---|---|---|---|
| C3 · Demand Panel — read-only | `574:2729` | 18720 | Hugo observing INT-2026-014 while Carla deepens Discovery |
| C4 · Devolução | `588:3061` | 20280 | Carla sent the demand back asking for EVIDÊNCIA + CONSTRAINTS revisions |
| C5 · Arquivada | `594:3556` | 21840 | INT-2026-009 CDN repricing — respectfully retired after Cloudflare renegotiation |
| C6 · Search results | `597:3668` | 23400 | ⌘K overlay: 3 demandas + 2 fontes + 1 pessoa, kbd footer |

### Storytelling moves

- **C3** introduces a *read-only mode* — top tide-wash banner makes
  clear that the canvas is locked because Discovery owns it; Hugo can
  comment but not edit. Left rail keeps the readiness ring as a frozen
  snapshot and adds a "DISCOVERY EM ANDAMENTO" card showing what Carla
  is currently doing (live-feeling without being noisy).
- **C4** establishes the "devolution" loop: Carla pings Hugo with
  exactly two requests (EVIDÊNCIA + CONSTRAINTS), the 8 dimensions stay
  visible but only the two warn rows have inline amber annotation strips
  ("Carla pediu: …"). Right column shows the conversation thread + a
  "Salvar revisões e reenviar" primary CTA. Amber is used assertively
  but not angrily — actionable signal, not alarm.
- **C5** demonstrates the terminal alt-state. We deliberately used a
  *different* demand seed (INT-2026-009 · CDN repricing) so the file
  doesn't feel like the SSO story is the only thing that ever happens.
  Stone-100 banner + muted heading + faded 28% ring + "PODE
  INTERESSAR" related-demands card communicate respectful retirement.
- **C6** treats search as a full-screen overlay rather than an inline
  page. We placed a ghost "Demandas" list as the backdrop, then a
  surface/inverse 35% opacity overlay on top, then the 720-wide
  floating panel (elev/pop) centered. Three result groups (Demandas,
  Fontes, Pessoas) with a Kbd-driven footer. The ↵ kbd indicator on
  the first row signals which item is "highlighted".

### Implementation notes (delta from earlier waves)

- **RequirementRow `setProperties` is a no-op** for `dimension`,
  `question`, `body` — the component set declares those as TEXT
  properties but the variant components were NOT authored with text-node
  links to them. Workaround: direct-mutate the inner TEXT nodes by name
  (`dimension`, `question`, `body`) after every `createInstance`.
- **Button instances default to FIXED 80 wide.** After setting a long
  label, you MUST set `instance.layoutSizingHorizontal = 'HUG'` for the
  button to shrink-wrap. Otherwise the new text overflows the 80px
  fixed container and renders clipped — the symptom shows in `get_screenshot`
  as partial label fragments ("para reabrir e"). Also visibility-toggle
  off the placeholder `leadingIcon` and `trailingIcon` rectangles.
- **Center column width is the gating constraint** in the 3-column
  pattern. With root padding `xl` (24+24), workspace gap `lg` (16), and
  rails 280+360, the center collapses to ~432px — narrow enough that
  the RequirementRow's question text starts wrapping vertically. For
  Wave C.2 we trimmed rails to 240/320 (left/right) which yields ~476
  center; readable while preserving the 3-column intent.
- **Avatar instance with initials** lives in component set `102:148`.
  Use the `Size=md, Type=initials` variant; after `createInstance`,
  load the initial TEXT's font (the avatar interior uses Hanken
  Grotesk Bold) then mutate `characters` to e.g. "CR".
- **StateBadge "Arquivada"** exists as variant `340:270`. Despite the
  spec hedging ("if not, build a custom muted tag"), we used it — the
  red dot reads OK in context because the surrounding chrome (stone-100
  banner, faded heading, muted meta) does the muting work.
- **Overlay opacity** for C6 needed two passes. 0.45 was too dark —
  backdrop ghost invisible. 0.55 worse. 0.35 lets the demandas list
  bleed through legibly while keeping the panel feeling floating. Bind
  the underlying paint to `surface/inverse` but set `paint.opacity`
  numerically — there's no opacity token.
- **Content slot layoutMode = NONE for overlays.** The AppShell's
  Content frame is auto-layout VERTICAL. For C6 we switched it to NONE
  so the backdrop + overlay + panel can stack via absolute x/y. This
  doesn't break other screens because each screen's Content is its own
  cloned instance.
- **`paint.opacity` is a property of the SOLID paint object**, NOT a
  field of `paint.color`. `{type:'SOLID', color:{r,g,b}, opacity:0.35}`
  works; `color:{r,g,b,a}` does not (the API silently drops `a`).
- **Effect style ID for `elev/pop`** is
  `S:142a484e19d5ee51a303a5f7e3f39e7d0588882c,`. The trailing comma is
  literal — that's how Figma serializes effect style IDs.

### Page state after C.2

| Block | Count | x range |
|---|---|---|
| B0–B8 (sign-in → outcome) | 9 | 0 .. 12480 |
| C0–C2 (empty, demandas, notif) | 3 | 14040 .. 17160 |
| C3–C6 (read-only, devolução, arquivada, search) | 4 | 18720 .. 23400 |
| **Total** | **16** | 0 .. 23400 |

Submitter prototype demand-side coverage is now complete. Next likely
waves: timeline-side states (B7 already exists but isolated), system-
notification follow-ups (C2 deeper drilldowns), or moving up to
Discovery-persona screens.

## 2026-05-28 — Wave D (prototype wiring)

Wired the Submitter prototype so the 16 frames on page `2:789` ("Submitter
journeys") play end-to-end in Figma preview mode.

- **Prototype start node**: B0 · Sign in (`439:2`). Set via
  `figma.currentPage.flowStartingPoints = [{ nodeId: '439:2',
  name: 'Submitter journey start' }]`. Verified `page.prototypeStartNode`
  now resolves to `439:2`.
- All reactions attached with `node.setReactionsAsync([...])` using
  `ON_CLICK` triggers. Spine flow uses `SMART_ANIMATE` 0.3s ease-out;
  cross-cutting branches use `DISSOLVE` 0.2s ease-out.

### Golden-path spine

| # | Source (id) | Label | Target | Transition |
|---|---|---|---|---|
| 1 | `440:9` | "Continuar com SSO da empresa" Button (B0) | B1 `441:14` | SMART_ANIMATE 0.3s |
| 2 | `440:18` | "Continuar com Google" Button (B0) | B1 `441:14` | SMART_ANIMATE 0.3s |
| 3 | `440:23` | "Continuar com Microsoft" Button (B0) | B1 `441:14` | SMART_ANIMATE 0.3s |
| 4 | `444:172` | "+ Nova demanda" Button (B1 header) | B2 `468:345` | SMART_ANIMATE 0.3s |
| 5 | `471:570` | "Pré-analisar com IA" Button (B2 right col) | B3 `473:532` | SMART_ANIMATE 0.3s |
| 6 | `473:532` | B3 root frame click-anywhere | B4 `478:703` | SMART_ANIMATE 0.3s |
| 7 | `I483:1574;390:413` | "Passar para Discovery" Button (B4 GateToolbar) | B5 `507:1564` | SMART_ANIMATE 0.3s |
| 8 | `510:1730` | "Passar para Discovery" Button (B5 action stack) | B6 `511:1718` | SMART_ANIMATE 0.3s |
| 9 | `511:1866` | "Ver timeline completa →" Button (B6) | B7 `517:1853` | SMART_ANIMATE 0.3s |
| 10 | `523:2264` | "Capturar nova demanda" Button (B8) | B2 `468:345` | SMART_ANIMATE 0.3s |

### Cross-cutting (branches off Dashboard)

| # | Source (id) | Label | Target | Transition |
|---|---|---|---|---|
| 11 | `450:229` | "Ver todas →" TEXT in B1 section header | C1 `548:2298` | DISSOLVE 0.2s |
| 12 | `I441:17;166:39` | Bell IconButton (B1 topbar) | C2 `560:2492` | DISSOLVE 0.2s |
| 13 | `I441:17;166:28` | Search IconButton (B1 topbar) | C6 `597:3668` | DISSOLVE 0.2s |
| 14 | `554:2421` | "Row · INT-2026-014" FRAME (C1 table, first row) | B4 `478:703` | DISSOLVE 0.2s |
| 15 | `562:2583` | First NotificationRow INSTANCE (C2, Carla mention) | B7 `517:1853` | DISSOLVE 0.2s |
| 16 | `599:3753` | First "result-row" FRAME (C6 SearchPanel, SSO/SAML) | B4 `478:703` | DISSOLVE 0.2s |

### Return paths

| # | Source (id) | Label | Target | Transition |
|---|---|---|---|---|
| 17 | `511:1871` | "Voltar ao Dashboard" Button (B6) | B1 `441:14` | DISSOLVE 0.2s |

### Optional secondary wiring (added)

| # | Source (id) | Label | Target | Transition |
|---|---|---|---|---|
| 18 | `589:3153` | "Começar revisão" Button (C4 Devolução) | B4 `478:703` | SMART_ANIMATE 0.3s |
| 19 | `595:3644` | "Reabrir demanda" Button (C5 Arquivada) | B4 `478:703` | SMART_ANIMATE 0.3s |

### Missing / skipped

None — every transition listed in the brief was located and wired. The
`prototypeStartNode` property on PAGE is read-only in the Plugin API; the
correct path is `page.flowStartingPoints`, which Figma then exposes as
`page.prototypeStartNode` (verified to resolve to `439:2`).

Submitter prototype now plays end-to-end from B0 through B8 with all
cross-cutting branches reachable from B1 and the return path from B6
landing back on B1.

## 2026-05-28 — Frontend-design polish pass

Cosmetic polish pass across the Submitter prototype to amplify Paper &
Signal's signature moves — heroic typography, disciplined Tide accent,
editorial composition, and high-impact celebration moments. 14 planned
refinements; 12 fully applied, 1 already-consistent (no-op), 1 partial
with a noted limitation. Final B1 / B8 screenshots taken to verify the
heroic moments land.

### Refinements

1. **B1 — Display title.** Applied `Display` text style
   (`S:fabda970b87dfd68747d0af055cd61112d930f72,`) to the H1
   "Boa tarde, Hugo." — bumped from 40px ExtraBold to 56px ExtraBold.
   Mutated: `444:163`.

2. **B8 — Hero value.** HeroMetric value "+R$ 78k" lifted to 88px Hanken
   Grotesk Bold, `-3%` letter-spacing (per brief; replaced the previous
   Geist Mono 48px treatment). Delta "+R$ 12k acima" bumped to 18px.
   Mutated: `I521:2180;332:246`, `I521:2180;332:251`.
   Follow-up: the larger value overflowed the FIXED 140px HeroMetric
   container — resized the instance to 180px so the eyebrow + sub stay
   visible. Mutated: `521:2180`.

3. **B6 — Bigger celebration.** Check square 80→120, inner Icon/check
   40→56, headline "Passou para Discovery." → Display style (56px
   ExtraBold). Mutated: `511:1814`, `511:1815`, `511:1818`.

4. **B4 — Declutter page header.** Hid the "Header actions" row in B4's
   page-header (Adiar / Pedir revisão / Passar para Discovery) — the
   GateToolbar at the bottom already carries those actions. Mutated:
   `479:791`.

5. **B4 — Focused STAKEHOLDERS row emphasis.** Outer 2px tide-bright
   stroke already in place. Set the focused RequirementRow's `header`
   override fill to `brand/tide-wash` to make it visibly pop. Mutated:
   `I481:1235;366:304`.

6. **B5 — Breathe the dimensions list.** Bound the parent `Rows`
   itemSpacing to `space/lg` (16px). Inserted a `group-break` wrapper
   between row 5 (URGÊNCIA) and row 6 (EVIDÊNCIA) with a hairline rule +
   "REVISÃO RECOMENDADA" Eyebrow (`text/faint`, `space/xs` padding).
   Mutated: `508:1639`. Created: `641:3763` (group-break), `641:3764`
   (rule), `641:3765` (eyebrow text).

7. **B7 — Active timeline row emphasis.** Active TimelineStateRow tinted
   `brand/tide-wash`. EVENTO ATIVO card given 2px LEFT-only stroke
   `brand/tide-bright`. Mutated: `519:1963`, `519:1995`.
   **Anomaly:** the rail dot ellipse (`I519:1963;343:249`) is a child of
   an instance template — `resize()`/`rescale()` are silently rejected
   by the Plugin API. Size stays at 10px. Visual emphasis still reads
   strongly via the row tint + card left stroke.

8. **C1 — First row affordance.** Row "Row · INT-2026-014" given
   `brand/tide-wash` background + 2px LEFT-only `brand/tide-bright`
   stroke. Mutated: `554:2421`.

9. **C5 — Arquivada tag neutral.** Brief said the badge read tide; in
   practice it was bound to error-red. Re-bound the StateBadge fill to
   `surface/sunken`, label fill to `text/faint`, and the inner dot fill
   to `border/strong` — the badge now reads as inert chrome. Mutated:
   `595:3653`, `I595:3653;340:272`, `I595:3653;340:271`.

10. **C5 — Heading mute.** H1 "CDN repricing" confirmed bound to
    `text/muted` (`VariableID:8:112`); set explicitly to ensure the
    binding. Mutated: `595:3656`.

11. **C6 — Focused first result.** Search panel `result-row` "SSO/SAML
    para Pagamentos · INT-2026-014" given `brand/tide-wash` bg + 2px
    LEFT-only `brand/tide-bright` stroke for command-palette
    selection affordance. Mutated: `599:3753`.

12. **Topbar bell CountChip — reposition.** Direct attempt to translate
    each CountChip's x/y failed: the Plugin API rejects x/y overrides on
    nested instances (`set_x: This property cannot be overridden in an
    instance`). Applied the brief's fallback — hid the CountChip on
    every frame except B1 (`441:14`) so only the dashboard shows the
    unread count. Mutated: 14 CountChip nodes — `I468:348;166:46`,
    `I473:535;166:46`, `I478:706;166:46`, `507:1665`,
    `I511:1721;166:46`, `517:1954`, `I521:2069;166:46`,
    `I535:2226;166:46`, `I548:2301;166:46`, `I560:2495;166:46`,
    `I574:2732;166:46`, `I588:3064;166:46`, `I594:3559;166:46`,
    `I597:3671;166:46`.

13. **HeroMetric sparkline — standardize bar widths.** Inspected both
    HeroMetric instances (B1 `446:184`, B8 `521:2180`) — all 8 bars are
    already uniform width (19px each) with varying heights. **No-op;
    already consistent.**

14. **B0 — Pull-quote upgrade.** Italic quote "—— Já economizou 18h da
    minha semana nas últimas duas demandas." lifted from Inter Italic
    12px → Hanken Grotesk Italic 22px, `-1%` letter-spacing, 140%
    line-height. Color stays `text/ink`. Mutated: `439:9`.

### Verification

Final screenshots of B1 (`441:14`) and B8 (`521:2066`) captured. B1's
"Boa tarde, Hugo." now lands as a true display moment; B8's "+R$ 78k"
reads as the unmistakable hero of the outcome screen. Both screens hold
the Paper & Signal aesthetic — flat hairlines, Tide as sole signal,
stone neutrals, no shadows beyond `elev/*`.

### Anomalies / partial work

- **B7 active dot stays at 10px** (instance-template lock; documented).
- **CountChip reposition** could not move the chip — applied the
  brief-sanctioned fallback (hide everywhere except B1).
- **Sparkline widths** already uniform — no mutation needed.

## 2026-05-28 — Systematic spacing refactor (B2 / B4 / B5)

Hugo flagged "grotesque spacing and assembled paddings" on B2. Audited
the three dense screens and applied a single canonical rhythm bound to
the `space` collection (`VariableCollectionId:10:107`) on every
mutation — no literal pixel values.

### Canonical rhythm

- Card padding (all sides): `space/xl` (24)
- Card internal `itemSpacing`: `space/md` (12)
- Header block (eyebrow → title → subtitle) wrapped into a sub-frame
  with `itemSpacing = space/xs` (4)
- Card-to-card gap inside a column: `space/lg` (16)
- Column-to-column gap: `space/xl` (24)
- Page-content padding: `space/2xl` top/bottom, `space/xl` left/right
  (32 / 24)
- Compact list rows: `space/sm` (8) between rows
- Sub-cards / helper cards: `space/lg` (16) padding (deliberately
  smaller than primary cards)

### B2 · Nova demanda (`468:345`)

- Content area padding: `2xl/xl/2xl/xl` (was 32/48).
- Main composition column gap: `xl`; right column resized 400 → 440
  fixed.
- Card · Enunciado (`470:425`), Card · Evidência (`470:444`), AI
  scaffold (`471:528`), Tip card (`471:576`) all rebound to padding
  `xl` + itemSpacing `md`. Previously AI scaffold was `lg`/`sm`, Tip
  card was `md`/`xs` — visibly tighter than the left column.
- Wrapped eyebrow + title + subtitle into a `Header block` sub-frame
  with `xs` gap on Enunciado, Evidência, AI scaffold (icon-row + body
  subtitle), and Tip card (eyebrow + body). Creates the
  eyebrow→title→subtitle tight pairing without flattening the rhythm.
- Inserted a `BLOCOS REFERENCIADOS` mono eyebrow above the
  BlockReferenceChips inside Evidência (chips no longer feel
  orphaned).
- Updated composer attachment chip text to seed-scenario filenames:
  `deck-pagamentos-Q3.pptx · 2.4MB` and
  `transcript-CISO-22-05.txt · 186KB`.
- Scaffold-list internal rows bumped from `xs` → `sm` for legibility.
- Tried `counterAxisAlignItems = CENTER` on Main composition; right
  column is now taller than left (532 vs 435 px), so vertical
  centering pushed the left column down ~48 px and read as
  unintentional. Reverted to `MIN` (top-aligned) — cleaner editorial
  read.

### B4 · Demand Panel — drafting (`478:703`)

- Content padding: `2xl/xl/2xl/xl` (was `lg/xl/lg/xl`).
- 3-column workspace gap: `xl` (was `lg`).
- Left-column Readiness card (`480:793`): pad `xl`, gap `md`; wrapped
  "Quase pronto" + "Faltam 2 evidências…" into a `Header block` with
  `xs` gap after the ring.
- Left-column Pendency card (`495:1628`): pad `xl`, gap `md`; grouped
  the 3 pendency items into a `Pendency list` sub-frame with `sm` row
  spacing.
- Center-column RequirementRows kept as-is — component instances with
  internal padding (`md` all sides). Column itemSpacing `sm` is
  already correct for compact list density.
- Right-column SemanticReflectionCard, TensionCallout, GlobalChatSheet
  left untouched — all are component instances; padding is component-
  defined. Logged as anomaly.
- ValueIndicatorMeter in left column also left untouched (instance).

### B5 · Pre-send review (`507:1564`)

- Content padding: `2xl/xl/2xl/xl` (was 24/48/24/48).
- Body column-gap: `xl` (already xl, re-bound to confirm).
- Left column card-to-card gap: `lg` (was `md`).
- Checklist card (`508:1630`) already at pad `xl`/gap `md`; the 8-row
  Rows frame (`508:1639`) tightened from `lg` → `sm` between rows for
  compact list density (per spec); rebound row top/bottom padding to
  `space/sm` token.
- "Ainda em aberto" amber pendency card (`508:1772`): pad `lg`
  (sub-card visual), gap `sm` (was `lg`/`sm`).
- Right column card-to-card gap: `lg`.
- Readiness card (`510:1699`): gap `md`; wrapped "Quase pronto" +
  "Discovery vai partir daqui." into a Header block (`xs`) after the
  ring.
- Destination card (`510:1710`): pad `xl`, gap `md` (was `lg`/`sm`).
- OPCIONAL card (`510:1721`): pad `lg`, gap `sm` (was `md`/`xs`);
  wrapped OPCIONAL + "Marcar como urgente?" into a Header block (xs).

### Anomalies / resistances

- Component-instance internals (RequirementRow padding,
  SemanticReflectionCard padding, TensionCallout padding,
  GlobalChatSheet padding, ValueIndicatorMeter padding, MultimodalComposer
  padding) cannot be remapped from outside without detaching. Left
  alone — these are component-controlled and consistent across screens.
  If the global rhythm warrants a future revision, the component
  masters need to be edited.
- B2 right-column vertical centering: not applied. The "if right is
  shorter, vertically center" rule from the brief inverted here —
  right is now the *taller* column. Top-aligned reads as more
  intentional than pushing the (shorter) left column down off the
  baseline.

### Final state

All four "primary" cards on B2 + the non-instance cards on B4/B5 share
identical xl padding and md internal rhythm. The eyebrow → title →
subtitle pairing has a discernible header-block sub-rhythm. The page
feels composed and intentional rather than spreadsheet-perfect.

## 2026-05-28 — B1 analytics dashboard rebuild

### Comments addressed
- 1779595552 — sidebar dual-selection bug. Audit found only Home had
  State=selected; Demandas was already State=default. Likely the
  reporter's confusion was the ContextSwitcher (State=expanded) reading
  visually as a "selected" item. Renamed Home → Dashboard so the only
  selected item on B1 is the active item the user is on.
- 1779598254 — isolated ReadinessRings. The whole prior content area
  (header strip with rings/AIImpactBanner/ad-hoc HeroMetric/table) was
  cleared and replaced with a true analytics dashboard. No standalone
  ReadinessRings.
- 1779601184 — content below the fold / truncation. Final B1 fits
  inside the 1440×900 viewport with all five rows (header, KPI, charts,
  panels, footer) fully visible. Verified via screenshot at
  maxDimension 1600.

### Top-level structure (page = 2:789, B1 = 441:14)

- Content frame (cleared and rebuilt): 441:18
- Header strip: 714:3596
  - Header left (eyebrow/Display title/subtitle): 714:3597
  - Header right (RangeSelector + button): 714:3601
  - RangeSelector pseudo-button: 714:3602
  - "+ Nova demanda" Button instance: 714:3606
- KPI row: 715:3601
  - KPI / Impacto YTD: 715:3602
  - KPI / Demandas ativas: 715:3620
  - KPI / Tempo economizado: 715:3644
  - KPI / Readiness médio: 715:3653
- Charts row: 716:3601
  - Chart A (Fluxo de demandas, 60%): 716:3602
  - Chart B (Impacto por trimestre, 40%): 716:3639
- Panels row: 717:3601
  - Panel / Minhas demandas (with Row-INT014 = 717:3609,
    VerTodasLink = 717:3608): 717:3602
  - Panel / Atividades recentes: 717:3669
  - Panel / Pendências (PendencyCTA-1 = 717:3718,
    -2 = 717:3729, -3 = 717:3740): 717:3706
- Footer status: 719:3644

### Standalone overlay frame

- B1.1 · Range popover: 726:3644 at (1700, 920). 4 menu rows
  ("Últimos 14/30/90 dias", "Personalizado…"), divider, hint. The
  "Últimos 30 dias" row is rendered as selected (brand/tide-wash bg,
  Medium label, check indicator).

### Sidebar / topbar chrome fixes

- Sidebar "Home" MenuItem (I441:15;169:35) — label component property
  set to "Dashboard". State remains "selected" (this is the active
  page).
- Topbar breadcrumb (I441:17;166:11;164:4;113:149) — characters
  changed from "Home" to "Dashboard" to stay consistent.

### Reactions wired (ON_CLICK)

| Source | Source ID | Target | Transition |
|---|---|---|---|
| + Nova demanda button | 714:3606 | B2 = 468:345 | SMART_ANIMATE 0.3s |
| RangeSelector | 714:3602 | B1.1 = 726:3644 | DISSOLVE 0.2s |
| Row-INT014 (Panel 1 first row) | 717:3609 | B4 = 478:703 | DISSOLVE 0.2s |
| VerTodasLink | 717:3608 | C1 = 548:2298 | DISSOLVE 0.2s |
| PendencyCTA-1 | 717:3718 | B4 = 478:703 | DISSOLVE 0.2s |
| PendencyCTA-2 | 717:3729 | B4 = 478:703 | DISSOLVE 0.2s |
| PendencyCTA-3 | 717:3740 | B4 = 478:703 | DISSOLVE 0.2s |
| Sidebar Demandas MenuItem | I441:15;169:50 | C1 = 548:2298 | DISSOLVE 0.2s |
| Topbar bell IconButton | I441:17;166:39 | C2 = 560:2492 | DISSOLVE 0.2s |
| Topbar search IconButton | I441:17;166:28 | C6 = 597:3668 | DISSOLVE 0.2s |

All ten reactions returned ok: true from setReactionsAsync.

### Compromises / anomalies

- **NAVIGATE not OVERLAY for the range popover.** The Figma plugin
  reaction action accepts navigation: 'OVERLAY' in theory but in
  practice the popover renders as a separate screen via DISSOLVE. This
  still demonstrates the interaction; promoting to a true overlay
  later just needs the navigation property swapped, no layout change
  to B1.1.
- **Vertical compression.** The original budget (header 96 + KPI 130
  + charts 240 + panels 220 + footer 32 = 718 plus 4×24 gaps + 64
  padding = 878) overflowed slightly once instances rendered. To fit
  900px viewport: content paddingTop/Bottom reduced from 2xl→lg, row
  itemSpacing from xl→lg, panel padding from lg→md, panel itemSpacing
  from md→sm, Display title from 48→40, Chart B bar area from 120→90.
  Final composition: 16 + 79 + 16 + 164 + 16 + 187 + 16 + 268 + 16 +
  24 = 802px (with 42px slack). All five rows visible.
- **"+ Nova demanda" button width.** The Button component variant
  ships at 80px fixed width which clipped the longer label. The
  instance was switched to layoutSizingHorizontal = HUG (resolved to
  ~140px) so the full "+ Nova demanda" reads.
- **No dedicated chevron / check icons.** The icon library does have
  chevron-down (used in RangeSelector), but no obvious check glyph;
  the popover's selected-row check is a 14×14 brand/tide-text rounded
  square placeholder. Acceptable until the icon library expands.
- **Sidebar dual-selection.** Was already correct (only Home/Dashboard
  had State=selected). The visible "two-thing" appearance was the
  ContextSwitcher's State=expanded styling, not a MenuItem selection.
  No code change needed beyond the Home → Dashboard rename.

## 2026-05-28 — B1 chart resilience + Pendências cosmetic + overflow affordances

### Task 1 — Chart A "Fluxo de demandas" refactored for resolution resilience
- Deleted old fragile structure: stacked horizontal bar (`716:3607`) + 6-column
  labels row (`716:3614`).
- Replaced with vertical list of 6 self-contained mini-bar rows inside chart
  area `716:3606`. New container: "States list" frame, gap `space/sm`.
- Each row: 10×10 colored dot · 96px-wide Eyebrow Mono label (`text/muted`)
  · FILL bar track (height 8, radius `radius/full`, bg `surface/sunken`, hairline
  border) with two FILL children — colored segment (grow=count) + empty
  segment (grow=8-count) — · 32px right-aligned Mono/sm count number.
- Rows: CAPTURA 3 (state/draft), TRIAGEM 2 (state/staging), DISCOVERY 5
  (brand/tide), RACIONALIZ. 3 (violet/500), EXECUÇÃO 4 (state/running),
  ENTREGUE 8 (state/production). MAX = 8.
- Resilience: every row sizes proportionally via auto-layout grow ratios, so
  the chart degrades cleanly at any container width — no more colliding
  segments or stacked labels.
- New row node IDs: `763:3891`, `763:3898`, `763:3905`, `763:3912`,
  `763:3919`, `763:3926`. States list: `763:3890`.

### Task 2 — Pendências panel cosmetic upgrade (`717:3706`)
- 2a/d — Pend rows (`717:3712`, `717:3723`, `717:3734`) were already
  restructured (LeftStrip + content with tag-row, problem, meta lines). Footer
  link `PendenciasVerTodas` (`748:3750`) was in place — wired its reaction.
- 2b — Top 2px critical accent: mutated the existing `CriticalAccentStripe`
  frame (`742:3758`) to `layoutPositioning = ABSOLUTE`, anchored at
  `x=0 y=0`, resized to the full panel width (373.33px), constraints
  `{horizontal: STRETCH, vertical: MIN}`, top corner radii bound to
  `radius/md` so the accent follows the panel's top curve. Fill stays bound
  to `state/error`. This achieves the visual "top critical border" without
  fighting the single-stroke-color constraint on frames.
- 2c — `CountChip` text inside `717:3709` was already "3 de 12".
- 2d — Footer "Ver todas (12) →" `748:3750` wired with ON_CLICK NAVIGATE
  → C8 Pendências `752:4085`, DISSOLVE 0.2s ease-out.

### Task 3 — Overflow affordances on Panels 1 and 2
- Panel 1 CountChip already "5 de 8". `VerTodasLink` (`717:3608`) keeps its
  prior wiring to C1.
- Panel 2 CountChip already "6 hoje" (redundant "hoje" Meta was already
  absent from header). Footer link `AtividadesVerTodas` (`749:3750`) wired
  with ON_CLICK NAVIGATE → C7 Atividade `752:3822`, DISSOLVE 0.2s.

### Reactions wired
- `749:3750` AtividadesVerTodas → NAVIGATE `752:3822` DISSOLVE 0.2s
- `748:3750` PendenciasVerTodas → NAVIGATE `752:4085` DISSOLVE 0.2s

### Anomalies
- Most Task 2 and Task 3 sub-items were already implemented from a prior
  session (footers, CountChip strings, Pend row structure, stripe frame).
  Only Chart A (Task 1) needed a from-scratch rebuild, and the top-accent
  stripe needed conversion from in-flow to absolute positioning to span
  the full card edge.
- Single-stroke-color limitation on frames means the "top 2px state/error
  border" is implemented as an absolutely-positioned 2px frame overlay
  rather than literal `strokeTopWeight=2`. Visually identical; semantically
  equivalent for the "critical present" signal.

### Verification
- Chart A renders correctly at 568×~120px in B1's Charts row.
- B1 Dashboard `441:14` renders at 1440×900 — still fits within the 900px
  height budget. No clipping, no overflow.

---

## 2026-05-28 — B4 rebuild State 0 (just-captured workspace)

**Target:** `478:703` (B4 · Demand Panel — drafting) in file `6Yfv523dlb2bfZS9zWGJly`, page `2:789`.
**Demand context:** INT-2026-015 · "Autenticação SSO/SAML para parceiros B2B" · State `Em Captura` · Readiness 24%.

Rebuilt from scratch as a hub-and-spoke workspace for enriching a freshly-captured demand. Replaces the old 3-column workspace + GateToolbar with a 2-column grid (primary actions left, Data Room right) and a sticky gate footer.

### Content frame
- `Content` (`478:707`) — wiped of all prior children (`479:779`, `479:807`, `483:1574`) and reset to VERTICAL auto-layout, padding `space/xl` on all sides, itemSpacing `space/xl`, HUG vertical.
- B4 frame: counterAxisSizingMode AUTO so it grows; RightCol primaryAxisSizingMode AUTO.
- Breadcrumb final crumb retitled `INT-2026-014` → `INT-2026-015`.

### New top-level children of Content (in vertical order)
1. `HeaderStrip` — `866:3264`
2. `ReadinessBar` (full-width, 24% state/error fill + sunken track) — `866:3295`
3. `MainGrid` — `867:3272`
   - `LeftCol` (FILL) — `867:3273`
     - `Section-Adicione` — `867:3275` (multimodal input card with placeholder textarea, attach + audio mini-buttons via Lucide SVG, primary Enviar)
     - `Section-Artefatos` — `873:3276` (8 artifact cards: Problema/Originador/Impacto satisfied; Alcance/Urgência/Constraints/Stakeholders empty; Evidência low-confidence at 42%)
     - `Section-Perguntas` — `875:3292` (top 3 pendency cards on state/error-wash bg, "Ver todas (5) →" link)
   - `RightCol-DataRoom` (FIXED 360) — `867:3274`
     - 3 file cards (`876:3308`, `876:3336`, `876:3364`) for deck-pagamentos-Q3 / transcript-CISO-22-05 / audio-impacto-Q1 with status pills (ingested / analyzing) and topic tags
     - `AddSourceBtn` (ghost md, FILL) — `876:3387`
4. `GateFooter` — `877:3334` (top-only hairline, contains ReadinessRing@24%, "Em captura" label + meta, Adiar/Pedir revisão/Passar para Discovery[disabled])

Plus a floating `ChatFAB` (`877:3362`) appended to RightCol with `layoutPositioning='ABSOLUTE'`, 56×56 circle, `brand/tide` fill, `elev/pop` shadow, white MessageCircle Lucide icon, anchored bottom-right and positioned just above the gate footer.

### Wired reactions
- Footer **Adiar** (`877:3347`) → `B1` (`811:3890`) via SMART_ANIMATE 300ms.
- Footer **Pedir revisão** (`877:3352`) → `B5` (`507:1564`) via SMART_ANIMATE 300ms.
- Footer **Passar para Discovery** (`877:3357`) — left unwired, set to `disabled=true` (gating not satisfied at 24% readiness).
- EditTitleBtn, EditDescBtn, Multimodal Enviar, Responder→ links, Ver todas link, +Adicionar fonte, ChatFAB — intentionally unwired for this slice (no-op placeholders; modals/answer flows not yet built).

### Chrome state confirmed
- Sidebar: `Demandas` already selected; profile already Hugo Seabra · HS.
- TopBar `showBrand=false`.
- Breadcrumbs now read `Home › Demandas › INT-2026-015`.

### Anomalies / compromises
- **CountChip is 16×16 fixed and accepts only a short numeric string.** Setting "3 de 8 satisfeitos" overflowed and clipped. Compromise: chip set to `3/8` and an adjacent Meta-styled "satisfeitos" text appended in the same header row. Visually reads as one chip + caption.
- **ConfidenceBar variants have a fixed inline % label baked in (88% on `high`, 28% on `low`)** — that number is the component's static visual. I added a separate Meta-style "%" text to the right of the bar showing the real per-artifact confidence. The two numbers can disagree by item; minor visual noise to revisit if ConfidenceBar variants get a `value` text prop later.
- **Lucide SVGs imported via `createNodeFromSvg`** for paperclip / mic / chat icons. The wrapping FRAME that `createNodeFromSvg` returns ships with an opaque white fill behind the vector — needed an explicit `fills = []` pass on the wrapper to expose the underlying card bg. Recorded as a recurring footgun.
- **State/error border on pendency cards uses stroke + opacity 0.3** (mutated `paint.opacity` on the bound stroke array) because the file lacks a `state/error-soft` variable. Token-bound color, opacity literal.
- **FAB anchored to RightCol with absolute coords** (`x = width − 80`, `y = footerTop − 80`) rather than B4's HORIZONTAL auto-layout. Constraints set to MAX/MAX so it sticks to bottom-right if RightCol resizes.
- B4 height now 1370px (was 900). Content HUGs vertical, no clipping anywhere observed.

### Verification
- Full screenshot at maxDimension 1600 captured cleanly. 2-column grid balances (LeftCol FILL, RightCol FIXED 360). Data Room visually separated. Footer sticky at bottom. FAB floats clear of footer in bottom-right.
- Section A icons (Anexar paperclip, Áudio mic) render as outlines after clearing wrapper fills.

## 2026-05-28 — B4 v3 (tabs + readiness hero + edit modal)

### Restructuring intent
User feedback: previous build stacked 4 subjects (Adicionar / Artefatos / Perguntas / Data Room) in the same page space. New structure:
1. Readiness as HERO indicator on top (96px ring + 8px full-width bar + stats row).
2. Tab strip below hero to separate the 4 subjects — one visible at a time.
3. Edit modal for title + description together with ONE button "Concluir" top-right of modal header.

### Wiped + rebuilt
Wiped previous Content (478:707) children: HeaderStrip 866:3264, ReadinessBar 866:3295, MainGrid 867:3272, GateFooter 877:3334. Reset Content padding to `2xl xl 2xl xl`, itemSpacing `xl`, HUG vertical.

### Sections (top → bottom, all bound to tokens)
- **HeaderStrip** `892:3264` — Left FILL VERTICAL gap xs: IdRow (Mono/sm INT-2026-015 + StateBadge instance `892:3268` Em Captura) · TitleRow (H2 "Autenticação SSO/SAML…" + IconButton `892:3273` pencil "EditTitleDescBtn-1") · DescRow (Body/sm wrap). Right HUG VERTICAL: Eyebrow "ÚLTIMA ATUALIZAÇÃO" + Meta "há 4 min · você".
- **Readiness HERO** `894:3269` — Card surface/card + border/strong + radius/lg. Top row: 96×96 ring `894:3271` (sunken track + state/error 24% arc + inner donut + "24%" centered, 24px Bold) + text block (Eyebrow `READINESS · EM CAPTURA` state/error, H2 "24% pronto", Body/sm sub). Full-width 8px progress bar `894:3280` with radius/full, 24:76 layoutGrow split between state/error fill and surface/sunken track. Stats row `894:3283`: ARTEFATOS 3/8, PERGUNTAS 0/5, FONTES 3, spacer FILL, "limiar mínimo para Discovery: 80%".
- **Tabs strip** `895:3269` — HORIZONTAL gap 0 with hairline bottom border. Tabs:
  - `895:3270` Tab-Adicionar (ACTIVE, SemiBold ink, 2px brand/tide-bright bottom)
  - `895:3272` Tab-Artefatos + custom CountChip 3/8
  - `895:3276` Tab-Perguntas + custom CountChip 0/5
  - `895:3280` Tab-DataRoom + custom CountChip 3
  - Custom CountChip nodes (surface/sunken + text/muted Mono/sm 10px) replaced the existing CountChip component (104:136) because the component is a fixed 16×16 red dot that clipped multi-char counts.
- **Active tab content** `896:3272` (Adicionar informação) — Multimodal input card `896:3273`: Eyebrow "ADICIONE INFORMAÇÃO", H-block (Label/md SemiBold prompt + Body/sm sub), Textarea (surface/canvas + border/strong + radius/md, contains placeholder Body/md text/faint), Footer row: paperclip + "Anexar arquivo" / mic + "Gravar áudio" on left, primary Button `896:3293` "Enviar →" on right. Empty state `896:3298` below: sparkles 32px + centered Body/sm muted "Nenhuma contribuição ainda…".
- **Gate Footer** `897:3276` — HORIZONTAL surface/card + hairline top border + padding `lg xl lg xl`. Left: 32×32 state/error-wash mini ring with "24%" Mono state/error + LabelBlock (Label/md SemiBold "Em captura" + Meta "Precisa de 80% para abrir Discovery"). Spacer FILL. Actions: Btn-Adiar `897:3285` (ghost md), Btn-PedirRevisao `897:3290` (secondary md), Btn-Discovery `897:3295` (primary md, disabled=true, HUG width so text "Passar para Discovery →" renders fully).

### Chat FAB
- Removed accidental duplicate `898:3288` I added on B4.
- Repositioned the existing ChatFAB `877:3362` (already in RightCol from earlier build) to ABSOLUTE positioning, constraints MAX/MAX, x=1120, y=903 — bottom-right of RightCol with xl (24px) gap.

### Edit modal — alt frame
- Created top-level frame `B4 · Editar título e descrição (modal)` `904:3285` positioned at (b4.x, b4.y + b4.height + 120), size 1440×983 to match B4.
- Children (absolute layout):
  - B4 clone `904:3286` at (0,0) — base layer for visual continuity.
  - DimOverlay `904:3386` — rectangle 1440×983, surface/inverse fill, opacity 0.45. Wired ON_CLICK → B4.
  - ModalCard `904:3387` — VERTICAL auto-layout, 560 wide, HUG height, surface/card, radius/lg, effect elev/pop, centered both axes.
    - Header row: Eyebrow "EDITAR DEMANDA" left, Btn-Concluir `904:3390` (primary md) right (the single button per spec). Wired ON_CLICK → B4.
    - 1px hairline divider.
    - Body VERTICAL gap lg, padding `lg xl xl xl`: Field "TÍTULO" (Eyebrow + Body/md input on surface/canvas + border/strong + radius/md) and Field "DESCRIÇÃO" (same styling, 3-line wrap).

### Wired reactions (DISSOLVE 0.2s NAVIGATE)
- EditTitleDescBtn-1 `892:3273` → modal frame `904:3285`
- Btn-Concluir `904:3390` → B4 `478:703`
- DimOverlay `904:3386` → B4 `478:703`

### Anomalies / deferred
- CountChip design system component is locked to 16×16 red dot — replaced with custom inline chips for tabs to support "3/8" / "0/5" multi-char counts. Suggest evolving CountChip to a variant set (xs/sm + tone={brand,muted,error}) and re-binding tabs to instances.
- Discovery button HUG fix was applied after first render showed clipping; same applied to all three GateFooter buttons.
- Modal title/desc edits do not propagate back to the B4 clone because B4 is a plain FRAME, not yet componentized. Componentizing B4 would let the modal's "Concluir" reflect title/desc edits to the live instance. Deferred.
- Other tabs (Artefatos, Perguntas, Data Room) have no alt-frame content yet — tab buttons are present but don't navigate. Deferred as separate alt frames.
- B4 height auto-hugged to 982 (down from 1370) because content is now leaner with a single active tab visible.

### Verification
- Final B4 screenshot: clean header, prominent readiness hero, tabs strip with active "Adicionar informação", multimodal input card, empty state, gate footer with disabled Discovery, FAB clear of footer.
- Modal screenshot: dim overlay, centered 560×287 card, "EDITAR DEMANDA" + "Concluir" header, two field inputs (TÍTULO + DESCRIÇÃO) populated.
