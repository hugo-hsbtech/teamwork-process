# Iconography

## Approach

Conductor takes a **utilitarian, near-invisible** approach to icons. The product communicates state and identity primarily through **type and colour** — page titles, mono identifiers, and small coloured status dots — and uses icons only where a glyph is genuinely faster to parse than a label.

Concretely:

- **No custom icon font** is shipped with the product. The Figma file does not include a custom icon library.
- **No emoji** appear anywhere in the product UI. (Emoji *are* sometimes acceptable in user-generated content like chat messages, but never in product chrome.)
- **No raster icons.** All icons are SVG.
- **Stroke style.** 1.75px stroke, rounded caps, rounded joins, 24px viewBox sized to 16-20px in UI. Single-colour, inherits `currentColor`.
- **Filled style is reserved for status dots.** A 7-8px filled circle in a state colour is the canonical Conductor status indicator — see badges and the sidebar.

## Recommended icon set: Lucide

For any new artifact (slide, mock, prototype), load **Lucide** from CDN. Stroke weight matches Conductor's existing sidebar glyphs perfectly.

```html
<script src="https://unpkg.com/lucide@latest"></script>
<i data-lucide="layout-grid"></i>
<script>lucide.createIcons();</script>
```

Or use the static SVG variant (no JS) by inlining from `https://lucide.dev`.

### Mapping to the Conductor sidebar

| Nav item | Lucide name |
| --- | --- |
| Agents | `layout-grid` |
| Playground | `play` |
| Evaluations | `check` (or `check-circle`) |
| Runs | `list` |
| Traces | `activity` |
| Health | `diamond` |
| Memory | `cpu` |
| Chat | `message-square` |
| Tools & MCPs | `wrench` |
| Knowledge Base | `book-open` |
| Schedules | `calendar` |
| Credentials | `key` |
| Namespaces | `folder` |

> **⚠️ Substitution flag.** The Figma file does not specify an icon library by name — these mappings are inferred from the rendered glyph shapes. If Conductor's engineering team has standardised on a different library (e.g. Phosphor, Tabler, Heroicons), swap the CDN and update this table.

## Brand mark

- `assets/conductor-mark.svg` — 32×32 square mark. Rounded `--radius-sm` corner, `--brand-tide` fill, white asterisk-star glyph at 1.75 stroke. Use at 24-40px.
- `assets/conductor-wordmark.svg` — mark + "Conductor" set in Hanken Grotesk 800. Use in app bars, footers, login screens.

The mark stands alone happily — the wordmark is preferred only when the brand needs to be named (login, marketing, the first frame of an onboarding).

## Status indicators

The canonical Conductor status pattern is **dot + label**, not icon + label:

```html
<span class="badge badge--production">
  <span class="dot"></span>
  Production
</span>
```

- 7-8px filled circle in the state's solid colour
- 4-10px padding, `--radius-full`, background in the state's `*-wash` token
- 11-12px Hanken Grotesk 700 caps-tracking label in the state's solid colour
- See `BadgeShadcnPS` for the canonical implementation

Provider chips follow the same shape — coloured dot + plain text label — using the provider's own brand colour for the dot.

## Things not to do

- ❌ Don't put an icon inside a circle/square chip (Material-style "leading icon").
- ❌ Don't use two-tone icons (Lucide's `lab` icons, Phosphor's "duotone"). The product is line-only.
- ❌ Don't replace the status-dot pattern with a `check`/`x`/`alert` icon. Conductor's whole status language is the dot.
- ❌ Don't invent illustrative icons (e.g. a robot for "Agents"). All Conductor icons are abstract glyphs.
