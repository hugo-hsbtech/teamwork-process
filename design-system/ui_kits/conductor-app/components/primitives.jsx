/* Conductor UI kit — primitives.
   Defines: Icon, Button, Input, Badge, ProviderChip, Segmented, AvatarDot.
   Exported to window at end for cross-file use under text/babel. */

const { useState } = React;

// ---------- Icon (Lucide bridge) -----------------------------------
function Icon({ name, size = 18, stroke = 1.75, color = "currentColor", style }) {
  // Lucide is loaded globally via unpkg. createIcons swaps <i data-lucide>
  // for inline SVG. We use a stateless wrapper that asks Lucide to
  // process the icon after mount.
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, [name]);
  return (
    <i
      data-lucide={name}
      style={{ width: size, height: size, color, display: "inline-flex", alignItems: "center", justifyContent: "center", strokeWidth: stroke, ...style }}
    />
  );
}

// ---------- Button --------------------------------------------------
function Button({ variant = "primary", size = "md", onClick, children, leadingIcon, trailingIcon, disabled, style }) {
  const base = {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: size === "lg" ? 14 : 14,
    lineHeight: 1,
    borderRadius: 8,
    padding: size === "lg" ? "10px 18px" : "8px 14px",
    height: size === "lg" ? 38 : 34,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    transition: "background var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard)",
    border: "1px solid transparent",
    whiteSpace: "nowrap",
    ...style,
  };
  const variants = {
    primary: { background: "var(--brand-tide)", color: "var(--text-on-brand)" },
    ghost:   { background: "var(--surface-card)", color: "var(--text-ink)", borderColor: "var(--border-hairline)" },
    text:    { background: "transparent", color: "var(--text-ink)" },
    destructive: { background: "var(--state-error-wash)", color: "var(--state-error)" },
    "primary-dark": { background: "var(--surface-inverse)", color: "white" },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[variant] }}>
      {leadingIcon && <Icon name={leadingIcon} size={14} />}
      <span>{children}</span>
      {trailingIcon && <Icon name={trailingIcon} size={14} />}
    </button>
  );
}

// ---------- Input ---------------------------------------------------
function Input({ value, onChange, placeholder, leadingIcon, label, hint, width = 280, mono, autoFocus }) {
  const [focus, setFocus] = useState(false);
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, width }}>
      {label && <span style={{ font: "500 12px/1 var(--font-sans)", color: "var(--text-muted)" }}>{label}</span>}
      <div style={{
        height: 36, borderRadius: 8,
        background: focus ? "var(--surface-card)" : "var(--surface-sunken)",
        border: focus ? "1px solid var(--brand-tide)" : "1px solid var(--border-hairline)",
        outline: focus ? "2px solid var(--tide-100)" : "none",
        outlineOffset: 0,
        display: "flex", alignItems: "center", gap: 8,
        padding: "0 12px",
        transition: "border-color 120ms var(--ease-standard), background 120ms var(--ease-standard)",
      }}>
        {leadingIcon && <Icon name={leadingIcon} size={14} color="var(--text-faint)" />}
        <input
          autoFocus={autoFocus}
          value={value ?? ""}
          onChange={e => onChange && onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholder={placeholder}
          style={{
            flex: 1, minWidth: 0, height: "100%",
            border: 0, outline: 0, background: "transparent",
            fontFamily: mono ? "var(--font-mono)" : "var(--font-sans)",
            fontSize: 14,
            color: "var(--text-ink)",
          }}
        />
      </div>
      {hint && <span style={{ font: "400 12px/1.4 var(--font-sans)", color: "var(--text-faint)" }}>{hint}</span>}
    </label>
  );
}

// ---------- Badge ---------------------------------------------------
function Badge({ state = "production", children, pulse, style }) {
  const stateMap = {
    draft: "draft", staging: "staging", canary: "canary",
    running: "running", production: "production",
    paused: "paused", error: "error",
    success: "production", // alias
    pending: "running",
  };
  const key = stateMap[state] || "draft";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 10px 4px 8px",
      borderRadius: 9999,
      background: `var(--state-${key}-wash)`,
      color: `var(--state-${key})`,
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 11,
      lineHeight: 1,
      letterSpacing: "0.04em",
      whiteSpace: "nowrap",
      ...style,
    }}>
      <span style={{
        position: "relative",
        width: 7, height: 7, borderRadius: "50%",
        background: `var(--state-${key})`,
      }} className={pulse ? "dot-pulse" : ""} />
      {children || state.charAt(0).toUpperCase() + state.slice(1)}
    </span>
  );
}

// ---------- ProviderChip --------------------------------------------
function ProviderChip({ provider = "Claude", style }) {
  const map = {
    Claude: "var(--provider-claude)",
    OpenAI: "var(--provider-openai)",
    Gemini: "var(--provider-gemini)",
    Grok:   "var(--provider-grok)",
  };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 10px 4px 8px",
      borderRadius: 9999,
      background: "var(--surface-sunken)",
      border: "1px solid var(--border-hairline)",
      fontFamily: "var(--font-display)",
      fontWeight: 500,
      fontSize: 12, lineHeight: 1,
      color: "var(--text-muted)",
      whiteSpace: "nowrap",
      ...style,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: map[provider] || "var(--text-muted)" }} />
      {provider}
    </span>
  );
}

// ---------- Segmented ----------------------------------------------
function Segmented({ value, onChange, options, style }) {
  return (
    <div style={{
      display: "inline-flex",
      padding: 3,
      background: "var(--surface-sunken)",
      borderRadius: 8,
      gap: 2,
      ...style,
    }}>
      {options.map(opt => {
        const active = (typeof opt === "string" ? opt : opt.value) === value;
        const label = typeof opt === "string" ? opt : opt.label;
        const v = typeof opt === "string" ? opt : opt.value;
        return (
          <button
            key={v}
            onClick={() => onChange && onChange(v)}
            style={{
              padding: "6px 14px",
              borderRadius: 6,
              fontFamily: "var(--font-display)",
              fontWeight: active ? 700 : 500,
              fontSize: 12,
              lineHeight: 1,
              color: active ? "var(--text-ink)" : "var(--text-muted)",
              background: active ? "var(--surface-card)" : "transparent",
              border: active ? "1px solid var(--border-hairline)" : "1px solid transparent",
              transition: "all 120ms var(--ease-standard)",
            }}
          >{label}</button>
        );
      })}
    </div>
  );
}

// ---------- ViewToggle (specialized segmented with icons) -----------
function ViewToggle({ value, onChange }) {
  return (
    <div style={{
      display: "inline-flex",
      padding: 3,
      background: "var(--surface-card)",
      border: "1px solid var(--border-hairline)",
      borderRadius: 8,
      gap: 2,
    }}>
      {[
        { v: "blocks", label: "Blocks", icon: "layout-grid" },
        { v: "table",  label: "Table",  icon: "list" },
      ].map(({ v, label, icon }) => {
        const active = v === value;
        return (
          <button key={v} onClick={() => onChange(v)} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 12px",
            borderRadius: 6,
            fontFamily: "var(--font-display)",
            fontWeight: active ? 700 : 500,
            fontSize: 12,
            color: active ? "var(--text-on-brand)" : "var(--text-muted)",
            background: active ? "var(--brand-tide)" : "transparent",
            transition: "all 120ms var(--ease-standard)",
          }}>
            <Icon name={icon} size={13} stroke={2} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

Object.assign(window, { Icon, Button, Input, Badge, ProviderChip, Segmented, ViewToggle });
