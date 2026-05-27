/* Conductor UI kit — chrome.
   AppShell, Sidebar, TopBar, PageHeader, FilterBar, Breadcrumb. */

const { useState: useStateChrome } = React;

// ---------- AppShell ------------------------------------------------
function AppShell({ children, sidebar, topbar }) {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "row", background: "var(--surface-canvas)" }}>
      {sidebar}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {topbar}
        <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ---------- Sidebar -------------------------------------------------
const NAV = [
  { group: "Build", items: [
    { id: "agents", label: "Agents", icon: "layout-grid" },
    { id: "playground", label: "Playground", icon: "play" },
    { id: "evals", label: "Evaluations", icon: "check-circle-2" },
  ]},
  { group: "Operate", items: [
    { id: "runs", label: "Runs", icon: "list" },
    { id: "traces", label: "Traces", icon: "activity" },
    { id: "health", label: "Health", icon: "diamond" },
    { id: "memory", label: "Memory", icon: "cpu" },
  ]},
  { group: "Engage", items: [
    { id: "chat", label: "Chat", icon: "message-square" },
  ]},
  { group: "Catalog", items: [
    { id: "tools", label: "Tools & MCPs", icon: "wrench" },
    { id: "kb", label: "Knowledge Base", icon: "book-open" },
    { id: "schedules", label: "Schedules", icon: "calendar" },
    { id: "creds", label: "Credentials", icon: "key" },
    { id: "ns", label: "Namespaces", icon: "folder" },
  ]},
];

function Sidebar({ active, onNavigate }) {
  return (
    <aside style={{
      width: 256, flexShrink: 0,
      background: "var(--surface-card)",
      borderRight: "1px solid var(--border-hairline)",
      display: "flex", flexDirection: "column",
      padding: "16px 12px",
      gap: 8,
    }}>
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px 14px" }}>
        <img src="../../assets/conductor-mark.svg" width={26} height={26} alt="" />
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, letterSpacing: "-0.01em", color: "var(--text-ink)" }}>Conductor</span>
      </div>

      {/* Project switcher */}
      <button style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "8px 10px",
        background: "var(--surface-card)",
        border: "1px solid var(--border-hairline)",
        borderRadius: 8,
        textAlign: "left",
      }}>
        <span style={{ width: 18, height: 18, borderRadius: 4, background: "var(--brand-tide-bright)" }} />
        <span style={{ flex: 1, fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 13, color: "var(--text-ink)" }}>acme-support</span>
        <Icon name="chevrons-up-down" size={14} color="var(--text-faint)" />
      </button>

      <div style={{ height: 12 }} />

      {/* Nav groups */}
      {NAV.map(grp => (
        <div key={grp.group} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.10em",
            textTransform: "uppercase", color: "var(--text-faint)",
            padding: "10px 10px 4px",
          }}>{grp.group}</div>
          {grp.items.map(item => {
            const isActive = item.id === active;
            return (
              <button key={item.id} onClick={() => onNavigate && onNavigate(item.id)} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "7px 10px",
                borderRadius: 8,
                background: isActive ? "var(--brand-tide-wash)" : "transparent",
                color: isActive ? "var(--brand-tide-text)" : "var(--text-ink)",
                fontFamily: "var(--font-sans)",
                fontWeight: isActive ? 600 : 500,
                fontSize: 13,
                textAlign: "left",
                transition: "background 120ms var(--ease-standard)",
              }}>
                <Icon name={item.icon} size={15} stroke={1.75} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      ))}

      <div style={{ flex: 1 }} />

      {/* Footer */}
      <button style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "8px 10px",
        borderRadius: 8,
        textAlign: "left",
      }}>
        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--stone-300)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, color: "var(--text-ink)" }}>RT</div>
        <span style={{ flex: 1, fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 13, color: "var(--text-ink)" }}>Ren Tanaka</span>
        <Icon name="settings" size={14} color="var(--text-faint)" />
      </button>
    </aside>
  );
}

// ---------- Breadcrumb ---------------------------------------------
function Breadcrumb({ items }) {
  return (
    <nav style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)", fontSize: 13 }}>
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <React.Fragment key={i}>
            <span style={{ color: last ? "var(--text-ink)" : "var(--text-muted)", fontWeight: last ? 600 : 400 }}>{it}</span>
            {!last && <span style={{ color: "var(--text-faint)" }}>/</span>}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

// ---------- TopBar --------------------------------------------------
function TopBar({ breadcrumb }) {
  const [q, setQ] = useStateChrome("");
  return (
    <div style={{
      height: 56, flexShrink: 0,
      background: "var(--surface-card)",
      borderBottom: "1px solid var(--border-hairline)",
      display: "flex", alignItems: "center",
      padding: "0 24px",
      gap: 24,
    }}>
      <Breadcrumb items={breadcrumb} />
      <div style={{ flex: 1 }} />
      <Input value={q} onChange={setQ} leadingIcon="search" placeholder="Search agents, runs, tools…" width={300} />
      <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 6, color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: 11 }}>
        <kbd style={{ background: "var(--surface-sunken)", border: "1px solid var(--border-hairline)", borderRadius: 4, padding: "1px 5px", fontFamily: "var(--font-mono)", fontSize: 10 }}>⌘K</kbd>
      </button>
    </div>
  );
}

// ---------- PageHeader ---------------------------------------------
function PageHeader({ title, sub, eyebrow, actions }) {
  return (
    <div style={{ padding: "32px 32px 20px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {eyebrow && <div style={{ font: "500 11px/1 var(--font-mono)", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--brand-tide-text)" }}>{eyebrow}</div>}
        <h1 style={{ font: "800 40px/1.05 var(--font-display)", letterSpacing: "-0.02em", margin: 0 }}>{title}</h1>
        {sub && <div style={{ font: "400 14px/1.5 var(--font-sans)", color: "var(--text-muted)" }}>{sub}</div>}
      </div>
      {actions && <div style={{ display: "flex", gap: 10 }}>{actions}</div>}
    </div>
  );
}

// ---------- FilterBar ----------------------------------------------
function FilterBar({ chips, onClearAll }) {
  return (
    <div style={{
      margin: "0 32px",
      padding: "14px 16px",
      background: "var(--surface-card)",
      border: "1px solid var(--border-hairline)",
      borderRadius: 12,
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <Input placeholder="Search agents…" leadingIcon="search" width={260} />
        {["Type", "Provider", "State", "Namespace"].map(label => (
          <button key={label} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "0 12px", height: 32,
            borderRadius: 8,
            background: "var(--surface-card)",
            border: "1px solid var(--border-hairline)",
            fontFamily: "var(--font-display)",
            fontWeight: 500, fontSize: 13,
            color: "var(--text-ink)",
          }}>
            {label}
            <Icon name="chevron-down" size={13} color="var(--text-faint)" />
          </button>
        ))}
      </div>
      {chips && chips.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {chips.map((c, i) => (
            <span key={i} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 10px", borderRadius: 9999,
              background: "var(--surface-sunken)",
              fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--text-ink)",
            }}>
              {c}
              <Icon name="x" size={11} color="var(--text-muted)" />
            </span>
          ))}
          <button onClick={onClearAll} style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12,
            color: "var(--brand-tide-text)", padding: "4px 6px",
          }}>Clear all</button>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { AppShell, Sidebar, TopBar, PageHeader, FilterBar, Breadcrumb });
