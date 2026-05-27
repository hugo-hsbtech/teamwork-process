---
name: conductor-design
description: Use this skill to generate well-branded interfaces and assets for Conductor (an agent workflow management platform), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files. Key files:

- `README.md` — brand context, content fundamentals, visual foundations
- `ICONOGRAPHY.md` — icon system + Lucide mapping
- `colors_and_type.css` — the file to import first; all tokens and type classes live here
- `assets/` — Conductor mark + wordmark SVGs
- `fonts/README.md` — Google Fonts link tag for Hanken Grotesk / Inter / Geist Mono
- `preview/*.html` — small specimen cards showing tokens & components in isolation
- `ui_kits/conductor-app/` — pixel-faithful React recreation of the product. `index.html` is the entry point. Use the components in `components/` as the source of truth when mocking new screens.

The system's identity in one line: **Conductor / "Paper & Signal"** — warm stone neutrals (the paper) with a single saturated teal called Tide (the signal). Hanken Grotesk for titles, Inter for body, Geist Mono for identifiers. Flat, near-shadowless, no imagery, no gradients, no emoji.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy `colors_and_type.css` into the artifact's folder and link it; pull SVG assets from `assets/`; reach for the JSX components in `ui_kits/conductor-app/components/` before writing new chrome from scratch.

If working on production code, you can copy assets and read the rules in `README.md` to become an expert in designing with this brand. Hard rules worth memorising:

- Tide is **signal-only** — never a large fill background.
- Status is **always a coloured dot + label**, never an icon.
- No emoji, ever, in product UI.
- Buttons are radius-8, Hanken Grotesk 700, sentence case.
- Cards are 1px hairline border + white fill + radius-12, no left-stripe, no decorative corner icon.
- All identifiers (`agent.support.router`) are rendered in Geist Mono.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
