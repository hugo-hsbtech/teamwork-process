# Conductor — product UI kit

A pixel-faithful recreation of the Conductor agent platform. **It is not real production code** — interactions are mocked just enough that you can click through the main flows.

## Run it

Open `index.html`. No build step.

## What's in scope

| Screen | Status |
| --- | --- |
| Agents list (`/agents`) — default landing | ✅ |
| Add MCP — drawer wizard, 6 steps | ✅ (steps 1–2 wired; rest stub) |
| Deploy agent — full-screen takeover | ✅ |
| Runs list (`/runs`) | ✅ |
| Playground / Evaluations / Health / Memory / Chat / KB / Schedules / Credentials / Namespaces | sidebar only — no screen content |

## Components (in `components/`)

Small, composable, mostly cosmetic:

- `AppShell.jsx` — sidebar + topbar wrapper
- `Sidebar.jsx` — left nav, project switcher, grouped sections
- `TopBar.jsx` — breadcrumb + search input + user
- `PageHeader.jsx` — H1 + subtitle row
- `FilterBar.jsx` — search + dropdown filters + chips
- `AgentCard.jsx` — the card in the 3-up grid
- `Badge.jsx` — lifecycle state pill (draft / staging / canary / running / production / paused / error)
- `ProviderChip.jsx` — model vendor chip
- `Button.jsx` — primary / ghost / text / destructive
- `Input.jsx` — text input with optional label
- `Segmented.jsx` — view toggle / transport picker
- `Stepper.jsx` — wizard step indicator
- `Drawer.jsx` — right-edge sliding drawer wizard
- `Takeover.jsx` — full-screen wizard chrome
- `ConnectorCard.jsx` — selectable connector tile
- `Icon.jsx` — Lucide bridge (icons load via CDN)

## How to extend

1. Add a sidebar nav item in `Sidebar.jsx` (keyed to a route name).
2. Add a screen component in `screens/`.
3. Register it in `app.jsx`'s screen switch.
4. Pull components from `components/` — do not invent new chrome. If you find yourself reaching for a new card style, talk to design first.

## Known gaps

- The dropdown filters (`Type`, `Provider`, `State`, `Namespace`) open as visual chips but don't expose a real menu.
- The MCP drawer's later steps (auth, scope selection, test) are placeholder bodies — the chrome and stepper progression work.
- No keyboard navigation, no virtualisation, no real data.
