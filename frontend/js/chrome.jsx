// chrome.jsx — Sidebar + TopBar. Exposes window.Chrome.
const { useState: useStateC } = React;
const IconC = window.Icon;

function Sidebar({ route, onNav, badges }) {
  const main = [
    { id: "dashboard", label: "Dashboard", icon: "home" },
    { id: "demands", label: "Demands", icon: "inbox", badge: badges.demands },
    { id: "pending", label: "Pending", icon: "flag", badge: badges.pending },
    { id: "activity", label: "Activity", icon: "activity" },
  ];
  const Item = ({ it }) => {
    const active = route === it.id || (it.id === "demands" && route === "panel");
    return (
      <button onClick={() => onNav(it.id)} style={{
        display: "flex", alignItems: "center", gap: 10, width: "100%", height: 36, padding: "0 10px",
        borderRadius: "var(--radius-md)", color: active ? "var(--accent-text)" : "var(--text-muted)",
        background: active ? "var(--accent-wash)" : "transparent", fontWeight: active ? 700 : 500,
        fontFamily: "var(--font-display)", fontSize: "var(--fs-label)", transition: "background var(--dur-fast), color var(--dur-fast)",
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "var(--surface-sunken)"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
        <IconC name={it.icon} size={18} />
        <span className="grow" style={{ textAlign: "left" }}>{it.label}</span>
        {it.badge ? <span className="count-chip" style={{ background: active ? "var(--surface-card)" : "var(--surface-sunken)" }}>{it.badge}</span> : null}
      </button>
    );
  };
  return (
    <div style={{ width: 240, flex: "none", height: "100vh", background: "var(--surface-card)",
      borderRight: "1px solid var(--border-hairline)", display: "flex", flexDirection: "column",
      padding: 12, gap: 16 }}>
      {/* Brand */}
      <div className="row gap8" style={{ padding: "2px 4px" }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, background: "var(--accent)" }} />
        <span className="f-label" style={{ fontSize: 15 }}>Intake</span>
      </div>
      {/* Context switcher */}
      <button style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px",
        border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-md)", background: "var(--surface-canvas)" }}>
        <span className="avatar" style={{ width: 26, height: 26, fontSize: 11, borderRadius: 7, background: "var(--stone-900)" }}>A</span>
        <div className="grow col" style={{ alignItems: "flex-start", gap: 2 }}>
          <span className="f-sm" style={{ fontWeight: 600, color: "var(--text-ink)" }}>Acme · Payments</span>
          <span className="f-eyebrow" style={{ color: "var(--text-faint)" }}>WORKSPACE</span>
        </div>
        <IconC name="chevronDown" size={15} style={{ color: "var(--text-faint)" }} />
      </button>
      {/* MAIN */}
      <div className="col" style={{ gap: 4 }}>
        <div className="f-sm" style={{ color: "var(--text-faint)", padding: "2px 6px 4px", fontSize: 11, letterSpacing: "0.04em" }}>MAIN</div>
        {main.map(it => <Item key={it.id} it={it} />)}
      </div>
      <div className="grow" />
      {/* WORKSPACE */}
      <div className="col" style={{ gap: 4 }}>
        <Item it={{ id: "settings", label: "Settings", icon: "settings" }} />
      </div>
      <div className="hr" />
      {/* User */}
      <div className="row gap8" style={{ padding: "2px 4px" }}>
        <window.UI.Avatar person={window.DATA.USER} size={32} />
        <div className="col grow" style={{ gap: 2, minWidth: 0 }}>
          <span className="f-sm clip" style={{ color: "var(--text-ink)", fontWeight: 600 }}>{window.DATA.USER.name}</span>
          <span className="f-sm faint clip" style={{ fontSize: 11 }}>{window.DATA.USER.role}</span>
        </div>
      </div>
    </div>
  );
}

function TopBar({ crumbs, onCrumb, onSearch, notifCount, onBell }) {
  return (
    <div style={{ height: 56, flex: "none", background: "var(--surface-card)",
      borderBottom: "1px solid var(--border-hairline)", display: "flex", alignItems: "center",
      padding: "0 24px", gap: 8 }}>
      <div className="row gap8 grow" style={{ minWidth: 0 }}>
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <IconC name="chevronRight" size={15} style={{ color: "var(--text-faint)" }} />}
            <button onClick={() => c.to && onCrumb(c.to)} className={c.mono ? "mono" : "f-label"} style={{
              fontSize: c.mono ? "var(--fs-sm)" : "var(--fs-label)",
              color: i === crumbs.length - 1 ? "var(--text-ink)" : "var(--text-muted)",
              fontWeight: i === crumbs.length - 1 ? 700 : 500,
              cursor: c.to ? "pointer" : "default",
            }}>{c.label}</button>
          </React.Fragment>
        ))}
      </div>
      <button className="btn btn-ghost" style={{ width: 38, height: 38, padding: 0, borderRadius: 9999 }} onClick={onSearch} title="Search (⌘K)"><IconC name="search" size={19} /></button>
      <button className="btn btn-ghost" style={{ width: 38, height: 38, padding: 0, borderRadius: 9999, position: "relative" }} onClick={onBell} title="Notifications">
        <IconC name="bell" size={19} />
        {notifCount > 0 && <span style={{ position: "absolute", top: 7, right: 8, width: 8, height: 8, borderRadius: 9999, background: "var(--red-600)", border: "2px solid var(--surface-card)" }} />}
      </button>
    </div>
  );
}

window.Chrome = { Sidebar, TopBar };
