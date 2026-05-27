# Fonts

All three Conductor families ship as **local variable-weight TTFs**. No CDN, no `<link>` tag — just import `colors_and_type.css` and the `@font-face` rules at the top of that file pick them up.

## Files

| Family | Upright | Italic |
| --- | --- | --- |
| Hanken Grotesk | `HankenGrotesk-VariableFont_wght.ttf` | `HankenGrotesk-Italic-VariableFont_wght.ttf` |
| Inter (with opsz axis) | `Inter-VariableFont.ttf` | `Inter-Italic-VariableFont.ttf` |
| Geist Mono | `GeistMono-VariableFont_wght.ttf` | `GeistMono-Italic-VariableFont_wght.ttf` |

All six are variable on the weight axis (`100 900`). Inter additionally carries an optical-size axis but it's resolved automatically by the browser using `font-optical-sizing: auto` (CSS default in modern engines).

## How to use

```html
<link rel="stylesheet" href="colors_and_type.css">
```

That's it. Then use `var(--font-display)`, `var(--font-sans)`, or `var(--font-mono)` in CSS, or apply the prebuilt classes `t-display`, `t-h1`, `t-body`, `t-mono`, etc.

## Roles

| Family | Role | CSS var |
| --- | --- | --- |
| Hanken Grotesk | Display + UI labels (titles, buttons, badges) | `var(--font-display)` |
| Inter | Body + descriptions + table cells | `var(--font-sans)` |
| Geist Mono | Identifiers, code, eyebrows, numeric data | `var(--font-mono)` |

## Weights used

- **Hanken Grotesk:** 700 (UI labels, badges), 800 (titles).
- **Inter:** 400 (body), 500 (small label runs).
- **Geist Mono:** 400 (code), 500 (eyebrow caps).

Other weights are available (these are variable fonts) but should not be reached for without a reason.

## Licenses

All three families are SIL Open Font License. License files live alongside the TTFs in the original upload bundle — copy them in if shipping production.
