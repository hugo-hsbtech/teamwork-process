# Intake · Submitter — Frontend Prototype

High-fidelity, interactive prototype of the **Submitter journey** for the Intake
(Demandas) platform, built on the Conductor **"Paper & Signal"** design system and
implemented as a single-page React app.

This is the implementation of the `index.html` design handed off from Claude Design.
It models the full submitter loop end-to-end:

**Sign-in → Dashboard (indicators/KPIs) → Demands list → New demand → Demand Panel →
copilot chat / resolve → Freeze & publish v1 → downstream outcomes.**

## Highlights

- **Canonical lifecycle** — In Capture → In Triage → In Discovery → Rationalization →
  Frozen·v1 → In Execution → Delivered, plus Backlog & Archived. Schedule status
  (on-time / at-risk / late) and postpone are separate status flags.
- **Demand Panel** — readiness hero (ring / bar / segments), four tabs
  (Add information, Artifacts, Questions, Sources) plus a **History · Audit** tab.
  The 80% readiness gate controls **Freeze & publish v1**.
- **Add information** — pure input channel: composer (text / audio / file) + a
  contributions feed. Contributions are **editable by their author** and **must be
  approved** before they count.
- **Questions** — task context merged inline (urgency, copilot confidence, Accept).
- **Versioning** — Frozen·v1 is immutable; "Start v2 draft" branches a parallel v2
  with a v1↔v2 diff view.
- **Copilot chat** — docked drawer + dedicated full-page mode with a context rail,
  reference-attach picker, citations, action chips, and a voice mode (visual).
- **Dashboard** — KPI cards with trend deltas + sparklines, intake throughput,
  state-distribution donut, readiness distribution, on-time delivery — rendered with
  **Chart.js**.
- **Tweaks panel** — toggleable floating panel to drive demand state, readiness
  visualization, copilot chat style, density, accent color, type scale, and an
  exploratory dark mode.

## Stack

- **React 18** + **Babel Standalone** (in-browser JSX transpile — no build step)
- **Chart.js 4** for data viz
- Conductor design tokens + local variable fonts (Hanken Grotesk, Inter, Geist Mono)

React, Babel and Chart.js load from CDN, so the page needs network access at runtime.

## Running locally

Because the browser fetches the `.jsx` modules over HTTP, you must serve the folder
(opening `index.html` via `file://` will fail CORS):

```bash
cd frontend
python3 -m http.server 8000
# then open http://localhost:8000
```

Any static file server works (`npx serve`, `php -S`, etc.).

## Structure

```
frontend/
├── index.html              # entry — loads CSS, fonts, and all JS modules in order
├── css/
│   ├── conductor.css       # design-system tokens + @font-face declarations
│   └── app.css             # app-level layout & component styles
├── fonts/                  # Hanken Grotesk, Inter, Geist Mono (variable TTFs)
└── js/
    ├── icons.jsx           # Lucide-style icon set
    ├── anim.jsx            # animation utilities (count-up, draw-in)
    ├── charts.jsx          # Chart.js wrappers (bars, donut, sparklines)
    ├── data.jsx            # mock data layer (demands, contributions, audit, KPIs)
    ├── ui.jsx              # shared UI primitives (badges, readiness ring, etc.)
    ├── chrome.jsx          # sidebar + top bar
    ├── screen_auth.jsx     # sign-in
    ├── screen_dashboard.jsx# indicators dashboard
    ├── screen_demands.jsx  # demands list (search / filter / sort)
    ├── screen_create.jsx   # new-demand takeover wizard
    ├── screen_panel.jsx    # demand panel shell (state-aware)
    ├── screen_panel_tabs.jsx# panel tab contents
    ├── screen_chat.jsx     # copilot drawer + full-page + voice
    ├── modals.jsx          # all modals (freeze, diff, assign, edit, etc.)
    ├── screens_misc.jsx    # pending, activity, settings, search palette
    ├── tweaks-panel.jsx    # floating design Tweaks panel
    └── app.jsx             # orchestrator — routing, shared state, handlers
```
