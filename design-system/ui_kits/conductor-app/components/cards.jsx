/* Conductor UI kit — cards & content blocks.
   AgentCard, ConnectorCard, AnnotationNote, EmptyState. */

function AgentCard({ name, identifier, description, provider, state, version, when, type = "Chatbot", onClick }) {
  return (
    <button onClick={onClick} style={{
      textAlign: "left",
      background: "var(--surface-card)",
      border: "1px solid var(--border-hairline)",
      borderRadius: 12,
      padding: 18,
      display: "flex", flexDirection: "column", gap: 14,
      transition: "border-color 120ms var(--ease-standard), box-shadow 120ms var(--ease-standard)",
      cursor: "pointer",
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.boxShadow = "var(--elev-1)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-hairline)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Top: chips */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <ProviderChip provider={provider} />
        <Badge state={state} pulse={state === "running"}>{state.charAt(0).toUpperCase() + state.slice(1)}</Badge>
      </div>

      {/* Body */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <h3 style={{ font: "700 20px/1.2 var(--font-display)", margin: 0, color: "var(--text-ink)", letterSpacing: "-0.005em" }}>{name}</h3>
        <div style={{ font: "400 12px/1 var(--font-mono)", color: "var(--text-muted)" }}>{identifier}</div>
        <div style={{ font: "400 13px/1.5 var(--font-sans)", color: "var(--text-ink)", marginTop: 6 }}>{description}</div>
      </div>

      <div style={{ borderTop: "1px solid var(--border-hairline)", margin: "0 -2px" }} />

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ font: "400 12px/1 var(--font-sans)", color: "var(--text-muted)" }}>{type}</span>
        <span style={{ font: "400 12px/1 var(--font-mono)", color: "var(--text-muted)" }}>v{version} · {when}</span>
      </div>
    </button>
  );
}

function ConnectorCard({ name, description, glyph = "◆", selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      textAlign: "left",
      width: "100%",
      padding: 16,
      borderRadius: 12,
      background: selected ? "var(--brand-tide-wash)" : "var(--surface-card)",
      border: selected ? "1.5px solid var(--brand-tide)" : "1px solid var(--border-hairline)",
      display: "flex", alignItems: "center", gap: 14,
      transition: "all 120ms var(--ease-standard)",
      cursor: "pointer",
    }}>
      <div style={{
        width: 36, height: 36,
        borderRadius: 8,
        background: selected ? "white" : "var(--surface-sunken)",
        color: selected ? "var(--brand-tide)" : "var(--text-muted)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-display)", fontSize: 16,
      }}>{glyph}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1, minWidth: 0 }}>
        <span style={{ font: "700 14px/1.1 var(--font-display)", color: selected ? "var(--brand-tide-text)" : "var(--text-ink)" }}>{name}</span>
        <span style={{ font: "400 12px/1.3 var(--font-sans)", color: "var(--text-muted)" }}>{description}</span>
      </div>
      {selected && <Icon name="check" size={16} color="var(--brand-tide)" />}
    </button>
  );
}

function AnnotationNote({ title, body }) {
  return (
    <div style={{
      width: "100%",
      borderRadius: 10,
      background: "var(--surface-card)",
      border: "1px solid var(--border-hairline)",
      boxShadow: "0 3px 10px rgba(0,0,0,0.04)",
      overflow: "hidden",
    }}>
      <div style={{ height: 3, background: "var(--text-ink)" }} />
      <div style={{ padding: "13px 18px" }}>
        <div style={{ font: "700 14px/1.35 var(--font-display)", color: "var(--text-ink)" }}>{title}</div>
        <div style={{ font: "400 13px/1.35 var(--font-sans)", color: "var(--text-muted)", marginTop: 2 }}>{body}</div>
      </div>
    </div>
  );
}

function EmptyState({ icon = "search-x", title, body, action }) {
  return (
    <div style={{
      padding: 64,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      textAlign: "center", gap: 12,
      color: "var(--text-muted)",
    }}>
      <Icon name={icon} size={32} color="var(--text-faint)" stroke={1.5} />
      <div style={{ font: "700 18px/1.2 var(--font-display)", color: "var(--text-ink)", marginTop: 8 }}>{title}</div>
      <div style={{ font: "400 13px/1.5 var(--font-sans)", color: "var(--text-muted)", maxWidth: 380 }}>{body}</div>
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  );
}

Object.assign(window, { AgentCard, ConnectorCard, AnnotationNote, EmptyState });
