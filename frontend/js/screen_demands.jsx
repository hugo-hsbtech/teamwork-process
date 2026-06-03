// screen_demands.jsx — C1 Demands list with working filter/sort. Exposes window.Demands.
const { useState: useStateL } = React;
const IconL = window.Icon;

function ageToMin(s) {
  const n = parseInt(s, 10);
  if (s.includes("m") && !s.includes("mo")) return n;          // minutes
  if (s.includes("h")) return n * 60;
  if (s.includes("d")) return n * 1440;
  return n * 43200;                                            // months
}

function Demands({ onOpenDemand, onNew, demandStates, toast }) {
  const D = window.DATA;
  const [q, setQ] = useStateL("");
  const [stateFilter, setStateFilter] = useStateL(null);
  const [sort, setSort] = useStateL("updated");
  const [sortOpen, setSortOpen] = useStateL(false);

  const stateOpts = ["capture", "triage", "discovery", "rationalization", "frozen", "execution", "delivered", "backlog", "archived"];
  const sortLabels = { updated: "Updated ↓", readiness: "Readiness ↓", id: "ID ↓" };

  let rows = D.DEMANDS.map(d => ({ ...d, state: demandStates[d.id] || d.state }));
  if (q.trim()) {
    const t = q.toLowerCase();
    rows = rows.filter(d => d.title.toLowerCase().includes(t) || d.id.toLowerCase().includes(t) || d.by.toLowerCase().includes(t));
  }
  if (stateFilter) rows = rows.filter(d => d.state === stateFilter);
  rows = [...rows].sort((a, b) => {
    if (sort === "readiness") return b.readiness - a.readiness;
    if (sort === "id") return a.id < b.id ? 1 : -1;
    return ageToMin(a.updated) - ageToMin(b.updated);
  });

  const cols = [
    { k: "id", label: "ID", w: 110 },
    { k: "demand", label: "DEMAND", w: "grow" },
    { k: "state", label: "STATE", w: 150 },
    { k: "readiness", label: "READINESS", w: 160 },
    { k: "sources", label: "SOURCES", w: 80 },
    { k: "updated", label: "UPDATED", w: 80 },
  ];

  return (
    <div className="app-scroll scroll anim-screen" style={{ padding: 24, maxWidth: 1280, margin: "0 auto", width: "100%" }}>
      {/* Header */}
      <div className="spread" style={{ marginBottom: 18 }}>
        <div>
          <window.UI.Eyebrow style={{ marginBottom: 8 }}>MY DEMANDS · {D.DEMANDS.length} TOTAL</window.UI.Eyebrow>
          <div className="f-h1">Demands</div>
        </div>
        <div className="row gap8">
          <window.UI.Button variant="ghost" icon="download" onClick={() => toast("Export queued — you'll get a CSV by email")}>Export</window.UI.Button>
          <window.UI.Button variant="primary" icon="plus" onClick={onNew}>New demand</window.UI.Button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="row gap8" style={{ marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", width: 320 }}>
          <span style={{ position: "absolute", left: 11, top: 10, color: "var(--text-faint)" }}><IconL name="search" size={16} /></span>
          <input className="field" placeholder="Search demands…" value={q} onChange={e => setQ(e.target.value)} style={{ paddingLeft: 34, height: 38 }} />
        </div>
        <div style={{ width: 1, height: 24, background: "var(--border-hairline)", margin: "0 4px" }} />
        {stateOpts.map(s => {
          const active = stateFilter === s;
          return (
            <button key={s} onClick={() => setStateFilter(active ? null : s)} className="pill" style={{
              height: 32, padding: "0 12px", fontFamily: "var(--font-sans)", letterSpacing: 0, fontSize: "var(--fs-sm)",
              border: "1px solid " + (active ? "var(--accent)" : "var(--border-hairline)"),
              background: active ? "var(--accent-wash)" : "var(--surface-card)",
              color: active ? "var(--accent-text)" : "var(--text-muted)", fontWeight: active ? 600 : 500,
            }}>
              <span className="dot" style={{ background: D.STATES[s].dot }} />{D.STATES[s].label}
            </button>
          );
        })}
        {stateFilter && <button className="lnk f-sm" onClick={() => setStateFilter(null)} style={{ marginLeft: 2 }}>Clear</button>}
        <div className="grow" />
        <div className="row gap4" style={{ position: "relative" }}>
          <span className="f-sm muted">Sort:</span>
          <button className="btn btn-ghost btn-sm" onClick={() => setSortOpen(o => !o)} style={{ gap: 5 }}>
            {sortLabels[sort]} <IconL name="chevronDown" size={14} />
          </button>
          {sortOpen && (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 20 }} onClick={() => setSortOpen(false)} />
              <div className="card" style={{ position: "absolute", right: 0, top: 34, zIndex: 21, boxShadow: "var(--elev-2)", padding: 4, width: 160 }}>
                {Object.keys(sortLabels).map(k => (
                  <button key={k} onClick={() => { setSort(k); setSortOpen(false); }} style={{
                    display: "block", width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: 6,
                    fontSize: "var(--fs-sm)", color: sort === k ? "var(--accent-text)" : "var(--text-ink)",
                    fontWeight: sort === k ? 600 : 400, background: sort === k ? "var(--accent-wash)" : "transparent",
                  }}>{sortLabels[k]}</button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div className="row" style={{ padding: "10px 18px", background: "var(--surface-sunken)", borderBottom: "1px solid var(--border-hairline)", gap: 14 }}>
          {cols.map(c => (
            <div key={c.k} className="f-eyebrow" style={{ width: c.w === "grow" ? undefined : c.w, flex: c.w === "grow" ? 1 : "none", color: "var(--text-faint)" }}>{c.label}</div>
          ))}
        </div>
        {rows.length === 0 && (
          <div className="col" style={{ alignItems: "center", padding: 56, gap: 8 }}>
            <span style={{ color: "var(--text-faint)" }}><IconL name="inbox" size={28} /></span>
            <div className="f-label muted">No demands match</div>
            <div className="f-sm faint">Try clearing filters or search.</div>
          </div>
        )}
        {rows.map((d, i) => (
          <button key={d.id} onClick={() => onOpenDemand(d.id)} style={{
            display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "14px 18px",
            borderTop: i ? "1px solid var(--border-hairline)" : "none", textAlign: "left",
            transition: "background var(--dur-fast)",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--surface-sunken)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <span className="mono f-sm faint" style={{ width: 110, flex: "none" }}>{d.id}</span>
            <div className="grow" style={{ minWidth: 0 }}>
              <div className="f-label clip" style={{ fontWeight: 600 }}>{d.title}</div>
              <div className="f-sm faint clip" style={{ marginTop: 3, fontSize: 11 }}>By {d.by} · {d.sources} sources</div>
            </div>
            <div className="row" style={{ width: 150, flex: "none", display: "flex", flexWrap: "wrap", gap: 6 }}>
              <window.UI.StateBadge state={d.state} size="sm" />
              {d.flag && <window.UI.StatusPill flag={d.flag} />}
            </div>
            <div style={{ width: 160, flex: "none" }} className="row gap8">
              <window.UI.ReadinessBar pct={d.readiness} height={6} />
              <span className="mono f-sm faint" style={{ width: 32, fontSize: 11 }}>{d.readiness}%</span>
            </div>
            <span className="f-sm muted" style={{ width: 80, flex: "none" }}>{d.sources}</span>
            <span className="f-sm faint" style={{ width: 80, flex: "none" }}>{d.updated}</span>
          </button>
        ))}
      </div>
      <div className="row" style={{ padding: "14px 4px", justifyContent: "space-between" }}>
        <span className="f-sm faint">Showing {rows.length} of {D.DEMANDS.length}</span>
      </div>
    </div>
  );
}

window.Demands = Demands;
