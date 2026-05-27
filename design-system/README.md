# Conductor Design System

> **System name:** Paper & Signal
> **Product:** Conductor — an agent workflow management platform
> **Tagline (from the file):** _Paper & Signal — the design system for an agent orchestration platform_

Conductor is the management plane for AI agents. The product surfaces are: a **Build** workspace (Agents, Playground, Evaluations), an **Operate** workspace (Runs, Traces, Health, Memory), an **Engage** surface (Chat), and a **Catalog** of resources (Tools & MCPs, Knowledge Base, Schedules, Credentials, Namespaces). Authoring is mostly done through stepped wizards that fly in as drawers or take over the screen.

The brand metaphor is **paper + signal**: warm stone neutrals for the page (the "paper"), with a single saturated teal called **Tide** for any UI that means *signal* — primary buttons, brand marks, links, the active step in a wizard, the running state. Everything else is greyscale. The aesthetic is deliberately quiet and operational — closer to a Bloomberg terminal or a Linear plan view than a marketing site.

---

## Sources

- **Figma — `Conductor · agent platform.fig`**
  Mounted as a virtual filesystem at `_fig/Conductor_-agent-platform/`. Pages: Screens, Foundations, Components, MCP creation, Agent journeys, Namespace creation, KB Journeys, Trigger creation, Credentials, Lists pattern, shadcn pilot, Agent · data flow. The Figma is the single source of truth — there is no codebase attached to this project.
- **No GitHub repo** was attached.
- **No slide deck** was attached.

Extracted artifacts that informed this system:
- `_fig/Conductor_-agent-platform/tokens.css` — 82 color/space/radius variables
- `_fig/Conductor_-agent-platform/components/*.jsx` — 15 Figma components reified as JSX
- `_fig/Conductor_-agent-platform/inventory.json` — page list & component manifest

---

## Index

| File | What's inside |
| --- | --- |
| `README.md` | This document. Brand context, content & visual rules. |
| `SKILL.md` | Agent Skill manifest — read this if you are an LLM invoking the system as a skill. |
| `colors_and_type.css` | Raw palette, semantic tokens, type styles. **Import this first** in every new artifact. |
| `fonts/` | Font notes + Google Fonts links. No webfont files shipped — all three families are loaded from Google Fonts. |
| `assets/` | Logos, mark, favicon. No raster brand imagery — Conductor is a pure UI brand. |
| `preview/` | Cards rendered into the project's Design System tab. |
| `ui_kits/conductor-app/` | Pixel-faithful recreation of the Conductor product UI. **Read its README** before mocking screens. |

---

## Fonts

Three families, all shipped as local variable-weight TTFs in `fonts/`. Just import `colors_and_type.css` — the `@font-face` declarations at the top of that file wire each family in. No `<link>` tag, no CDN, no network round-trip.

```html
<link rel="stylesheet" href="colors_and_type.css">
```

| Role | Family | Used for |
| --- | --- | --- |
| Display | **Hanken Grotesk** | Page titles ("Conductor", "Agents"), button labels, badge text, segmented controls. Always weight 700–800 for headings, 700 for UI labels. |
| Body | **Inter** | Body copy, descriptions, table cells, inputs, helper text. Weight 400/500. |
| Mono | **Geist Mono** | Identifiers (`agent.support.router`), token names, code, eyebrow labels (`LIGHT MODE · 82 VARIABLES`), and any tabular numeric data. |

> ✅ All three families now ship as local variable-weight TTFs in `fonts/`. Importing `colors_and_type.css` is sufficient — no Google Fonts link tag needed.

---

## Content fundamentals

How copy is written across the product.

### Voice & tone
- **Operational, declarative, precise.** Headers are nouns or short noun phrases, not full sentences: *"Agents"*, *"Connect MCP server"*, *"Deploy agent"*. Descriptions are matter-of-fact and terse: *"Classifies each user turn and routes to the right specialist chatbot."*
- **Second person, never "we".** Forms address the user as *you*: *"Pick a transport"*, *"Name this agent"*. We never narrate from the company side (*"We'll guide you…"* is wrong).
- **No marketing words.** No "powerful", "seamless", "AI-driven", "delight", "magic". The product talks about itself in terms of *what it is* (versioned DSL, namespace, specialist, router) and *what just happened* (12 checks, 3 errors, v7 · 2m ago).
- **Imperative buttons.** *Continue → · Deploy · Save draft · Add MCP · Connect · Run once*. Single verb where possible; if a verb needs an object, keep it short (*New agent*).
- **Empty states explain the unit of work, not the feeling.** *"No agents yet — agents are versioned routing DSLs. Create one to start dispatching turns."* Not *"Get started by creating your first agent!"*

### Casing
- **Page titles & H1:** Title case capitalised by hand, with thoughtful exceptions for compound terms (*"MCP creation"*, *"KB journeys"*, *"Agent · data flow"*).
- **Section headings (inline):** Title case for nouns (*"Connect MCP server"*, *"Env / secrets"*).
- **Sidebar groups:** ALL CAPS in mono (*"BUILD"*, *"OPERATE"*, *"ENGAGE"*, *"CATALOG"*).
- **Eyebrows above hero text:** ALL CAPS in mono, separated by `·` middots (*"LIGHT MODE · 82 VARIABLES · 13 TEXT STYLES · 3 ELEVATIONS"*).
- **Button labels:** Sentence case (*"New agent"*, *"Save draft"*, *"Connect"*). Never all caps.
- **Identifiers in body text:** Always rendered in mono, lowercase with dots: `agent.support.router`, `acme.payments`, `claude-3-7-sonnet`.

### Punctuation & joiners
- **Middot `·`** separates short metadata fragments: *"Chatbot · v7 · 2m ago"*, *"Conductor · Add MCP"*. Use a real `·` (U+00B7), not a bullet `•`.
- **Em-dash `—`** for parenthetical clauses in long copy. *"The agent definition — one JSON document, versioned."*
- **Arrow `→`** appears only on forward-progress buttons (*"Continue →"*). Never on links, breadcrumbs, or back buttons.
- **Ellipsis `…`** in placeholders (*"Search agents, runs, tools…"*) and loading states (*"Loading more…"*). Single char `…`, not three dots.
- **No emoji.** Anywhere in the product. The Figma uses none.

### Numbers & quantities
- Counts are always plain numerals with a unit on the same line: *"8 agents · 3 chatbots · 5 workflows"*. Spell out only zero in user-facing prose (*"No agents yet"*) — counts ≥ 1 always use digits.
- Versions are prefixed with `v`: *"v7"*, *"v12"*.
- Time deltas are compact: *"2m ago"*, *"5m ago"*, *"3h"*, *"4d"*. Never full sentences.

### Examples to copy verbatim

> **Page title:** Agents
> **Page sub:** 8 agents · 3 chatbots · 5 workflows · acme-support
> **Filter chips:** Chatbot · Production · Clear all
> **Card title:** Support Router · `agent.support.router` · Classifies each user turn and routes to the right specialist chatbot. · Chatbot · v7 · 2m ago

> **Wizard title:** Connect MCP server
> **Field label:** Transport · Server URL · Env / secrets
> **Primary button:** Continue →
> **Secondary button:** Back

---

## Visual foundations

### Colour
- **Single brand colour: Tide (teal).** Use it for primary buttons, the active step in a stepper, brand glyphs, links, the "running" state, and selection highlights. Never as a large fill background — Tide is signal, not surface.
- **Surfaces are stone (warm grey).** The canvas is `stone-50` (a soft paper cream, not pure white). Cards sit on top in white. Sunken surfaces (inputs, code blocks, sidebar hover) are `stone-100`. Borders are `stone-200` hairlines, `stone-300` when they need to read stronger.
- **Lifecycle states each have a colour family** — draft (slate), staging (violet), canary (amber), running (tide), production (green), paused (amber), error (red). They appear only as: a 7-8px solid dot, on a 50-tint wash pill background, with text in the 500/600 saturated tone. Never anywhere else.
- **Provider chips** carry the model vendor's own brand colour as an 8px dot (Claude orange, OpenAI green, Gemini blue, Grok grey). The chip background stays neutral.
- **Dark mode** is acknowledged as a future mode in the tokens (`data-theme="dark"`) but no dark palette is defined yet. Build light-first.

### Type
- **Three families, three jobs.** Hanken Grotesk for anything that *labels* (titles, buttons, badges). Inter for anything that *reads* (paragraphs, descriptions). Geist Mono for anything that *identifies* (IDs, code, eyebrow labels above hero titles, numeric data in tables).
- **Page titles are heavy.** H1 is Hanken Grotesk 800 at 40-56px with -0.02em tracking. They feel almost editorial — the page feels like a paper document, not a SaaS dashboard.
- **Eyebrows above titles** use mono caps in `--brand-tide-text` separated by middots. This is the system's signature type move.
- **No script, no serif, no display-display fonts.** Three families, that's the whole budget.

### Spacing & layout
- **8px base grid.** All padding/gap values resolve to multiples of 4 with 8 as the primary unit (`--space-sm: 8, --space-md: 12, --space-lg: 16, --space-xl: 24, --space-2xl: 32, --space-3xl: 48, --space-4xl: 64`).
- **Centred 720px working column** inside takeover wizards (1440 viewport → 360px gutters → 720px form column). Drawer wizards use a fixed 480 or 560 width.
- **Sidebar 256px** with a 16px hairline-bordered project switcher at the top, grouped nav sections labelled in mono caps.
- **Cards are 320×72 (connector cards) or larger 280-wide agent cards** in a 3-up grid. Never edge-to-edge — always 16px of breathing room from card edge to content.

### Backgrounds & textures
- **No imagery.** No hero photos, no full-bleed illustrations, no gradients, no patterns, no grain, no noise. The product is *deliberately* flat colour fields. Stone canvas, white cards, occasional tide wash for selection.
- **Stripes / dividers** are exactly 1px `--border-hairline`. Never decorative.
- **Tide wash (`--brand-tide-wash`, the very pale teal)** is the only colour fill used on large surfaces, and only to indicate selection (selected connector card) or context (top of a step-flow card).

### Borders, radii, shadows
- **Hairline-first.** Every card, input, drawer, and dropdown is a 1px `--border-hairline` rectangle. Borders read before fills.
- **Radii ladder:** `6` (small chips, segmented item), `8` (default — buttons, inputs, cards inside cards), `12` (cards, connector tiles), `16` (large surfaces like the takeover working card), `9999` (pills and dots). Never mix radii on adjacent siblings.
- **Shadows are almost invisible.** `--elev-1` is a single 1-2px shadow used on cards in lists. `--elev-2` is a deeper double-layer for drawers and dropdowns. `--elev-pop` is reserved for command-K style modals. **Never use Material-style elevation.** Paper.
- **No inner shadows.** Use `var(--surface-sunken)` to depress an area instead.

### Animation
- **Fast, restrained, no bounce.** All transitions use `var(--ease-standard)` (`cubic-bezier(0.2, 0, 0, 1)`) or `var(--ease-out)`. Durations: 120ms (state change — hover, focus), 200ms (panel toggles, accordion), 320ms (drawer slide-in, takeover crossfade).
- **No springs, no rubber-banding, no rotation.** No celebratory bursts. The product is operational.
- **Loading states** are gentle skeleton placeholders (`--border-hairline` filled bars at 60% opacity, pulsing 1.5s ease-in-out) — never spinners with personality.

### Interactive states
- **Hover.** Buttons darken Tide by ~6% (use `--tide-900` shadow overlay) or shift to `--surface-sunken` for ghost variants. Cards lift by raising shadow from `--elev-0` to `--elev-1` and warming background to `--surface-card` (no movement, no scale).
- **Press / active.** No shrink. Background goes one tint deeper. Hold duration is 80ms.
- **Focus-visible.** A 2px `outline` in `--brand-tide-bright` with 2px `outline-offset`. Never a glow shadow.
- **Selected.** Background → `--brand-tide-wash`, border → `1.5px solid var(--brand-tide)`, text → `--brand-tide-text`. See `ConnectorCard` `selected=true`.
- **Disabled.** 40% opacity, `cursor: not-allowed`, no other treatment.

### Cards
- 1px `--border-hairline`, white background, `--radius-lg` (12px), 16px padding.
- Inside a card: title (Hanken Grotesk 700 16-20px) → identifier (mono 12px muted) → description (Inter 14px) → metadata footer (Inter 12px faint, separated by middots).
- Cards never have left-border accent stripes. Cards never have decorative icons in the corner. Cards never have gradient fills.

### Transparency & blur
- **Used sparingly, and only on overlays.** Modal scrims are `rgba(28,27,24,0.40)` with no blur. The only blurred surface in the file is a `rgba(255,255,255,0.95)` floating header — and even there, blur is optional.
- **No glass-morphism.** No frosted cards, no translucent sidebars.

### Layout rules
- **Top app bar is 66px**, white, hairline-bottom, with the product wordmark left and a contextual exit button right when in a takeover flow.
- **Stepper sits in its own 62px band** beneath the top bar, centred.
- **Footer action bar in wizards is 66-70px**, hairline-top, right-aligned actions (Back ghost, Continue primary).
- **The work column always centres.** Even on ultrawide, content caps at 1280-1440 with auto margins.

---

## Iconography

See `ICONOGRAPHY.md` for the full breakdown. Short version:

- Conductor does not ship a custom icon font. The Figma uses a sparse set of utility glyphs at the sidebar level — drawn as **Lucide** icons.
- For new artifacts: load Lucide from CDN (`https://unpkg.com/lucide@latest`) and use the named SVGs. Stroke width 1.75, size 16-20px to match the existing sidebar.
- **Status uses a coloured dot, not an icon.** A 7-8px filled circle in the matching state colour.
- **Provider chips** show the vendor as text + coloured dot, not a vendor logo.
- **Emoji are never used** in product UI.

---

## What's not in this system (yet)

- **Dark mode palette.** Token slot exists; values do not. Build light-first; flag any dark-mode design as exploratory.
- **Data-viz palette.** No chart colours defined. If you need them, derive from the state palette (running/tide for the primary series, stone for grid, state colours for category) rather than inventing new hues.
- **Marketing surfaces.** No landing page, no docs site, no email templates. This system is for the in-product surfaces only.
- **Illustration.** No brand illustration system exists. Use type and tokens to compose hero areas; do not invent SVG illustrations.
