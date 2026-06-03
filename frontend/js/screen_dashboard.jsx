// screen_dashboard.jsx — indicators / KPI dashboard. window.Dashboard
const IconD = window.Icon;
const UID = window.UI;

// ---- KPI card with count-up + delta + sparkline -----------------------
function KpiCard({ k }) {
  const color = window.DATA.readinessColor(0); // unused base
  const up = k.delta.trim().startsWith("+");
  const deltaColor = k.good ? "var(--green-600)" : "var(--red-600)";
  return (
    <div className="card" style={{ padding: 16, flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
      <div className="spread">
        <window.UI.Eyebrow>{k.label}</window.UI.Eyebrow>
        <span className="pill" style={{ background: k.good ? "var(--green-50)" : "var(--red-50)", color: deltaColor, fontSize: 10, padding: "2px 7px" }}>
          {up ? "▲" : "▼"} {k.delta.replace(/^[+-]/, "")}
        </span>
      </div>
      <div className="row" style={{ alignItems: "baseline", gap: 4 }}>
        <span className="f-h1" style={{ fontSize: "calc(32px * var(--type-scale))" }}>
          <window.Anim.AnimatedNumber value={k.value} decimals={k.dec || 0} />
        </span>
        {k.unit && <span className="f-sm muted">{k.unit}</span>}
      </div>
      <window.Charts.Sparkline data={k.trend} width={150} height={30} color="var(--accent)" animateKey={k.value} />
    </div>
  );
}

function Panel({ eyebrow, title, right, children, style }) {
  return (
    <div className="card" style={{ padding: 20, display: "flex", flexDirection: "column", minWidth: 0, ...style }}>
      <div className="spread" style={{ marginBottom: 18 }}>
        <div>
          <window.UI.Eyebrow style={{ marginBottom: 6 }}>{eyebrow}</window.UI.Eyebrow>
          <div className="f-h3">{title}</div>
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

function Dashboard({ onOpenDemand, onNew, onNav, demandStates }) {
  const D = window.DATA;

  // derive state distribution from the demands list (live w/ tweaked focal state)
  const counts = {};
  D.DEMANDS.forEach(d => { const s = demandStates[d.id] || d.state; counts[s] = (counts[s] || 0) + 1; });
  const order = ["capture", "triage", "discovery", "rationalization", "frozen", "execution", "delivered", "backlog", "archived"];
  const stateSegs = order.filter(s => counts[s]).map(s => ({ label: D.STATES[s].label, value: counts[s], color: D.STATES[s].dot }));
  const totalDemands = D.DEMANDS.length;

  const ot = D.ONTIME;

  return (
    <div className="app-scroll scroll anim-screen" style={{ padding: 24, maxWidth: 1280, margin: "0 auto", width: "100%" }}>
      {/* Header */}
      <div className="spread" style={{ marginBottom: 24 }}>
        <div>
          <window.UI.Eyebrow style={{ marginBottom: 8 }}>INTAKE INDICATORS · LAST 30 DAYS · ACME-PAYMENTS</window.UI.Eyebrow>
          <div className="f-h1">Overview</div>
        </div>
        <div className="row gap8">
          <window.UI.Button variant="ghost" icon="calendar">Last 30 days</window.UI.Button>
          <window.UI.Button variant="primary" icon="plus" onClick={onNew}>New demand</window.UI.Button>
        </div>
      </div>

      {/* KPI ROW */}
      <div className="row gap16" style={{ marginBottom: 16, flexWrap: "wrap" }}>
        {D.KPIS.map(k => <KpiCard key={k.id} k={k} />)}
      </div>

      {/* CHART ROW 1 — throughput (wide) + state donut */}
      <div className="row gap16" style={{ marginBottom: 16, alignItems: "stretch", flexWrap: "wrap" }}>
        <Panel eyebrow="WEEKLY · CREATED VS MOVED" title="Intake throughput"
          right={<div className="row gap6"><IconD name="trendingUp" size={16} style={{ color: "var(--green-600)" }} /><span className="f-sm" style={{ color: "var(--green-600)", fontWeight: 600 }}>Clearing faster than intake</span></div>}
          style={{ flex: "1 1 440px" }}>
          <window.Charts.GroupedBars data={D.THROUGHPUT} height={170}
            series={[{ key: "created", label: "Created", color: "var(--stone-300)" }, { key: "moved", label: "Moved to Discovery", color: "var(--accent)" }]} />
        </Panel>

        <Panel eyebrow={`${totalDemands} DEMANDS`} title="By state" style={{ flex: "1 1 320px" }}>
          <div className="row gap24" style={{ alignItems: "center", flexWrap: "wrap" }}>
            <window.Charts.Donut segments={stateSegs} size={132} stroke={18} centerLabel={totalDemands} centerSub="demands" />
            <div className="col grow" style={{ gap: 9, minWidth: 132 }}>
              {stateSegs.map(s => (
                <div key={s.label} className="spread">
                  <div className="row gap8"><span className="dot" style={{ background: s.color, width: 8, height: 8 }} /><span className="f-sm" style={{ color: "var(--text-ink)" }}>{s.label}</span></div>
                  <span className="mono f-sm muted">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      {/* CHART ROW 2 — readiness dist + on-time + attention */}
      <div className="row gap16" style={{ alignItems: "stretch", flexWrap: "wrap" }}>
        <Panel eyebrow="DISTRIBUTION" title="Readiness of open demands" style={{ flex: "1 1 300px" }}>
          <window.Charts.HBars data={D.READINESS_DIST} valueFmt={v => `${v} demand${v !== 1 ? "s" : ""}`} />
          <div className="hr" style={{ margin: "18px 0 14px" }} />
          <div className="row gap6 f-sm muted"><IconD name="flag" size={14} style={{ color: "var(--text-faint)" }} /> 3 demands sit below the 80% publish threshold</div>
        </Panel>

        <Panel eyebrow="DEADLINES" title="On-time delivery" style={{ flex: "1 1 200px" }}>
          <div className="col" style={{ alignItems: "center", gap: 4, marginBottom: 16 }}>
            <window.UI.ReadinessRing pct={ot.rate} size={104} stroke={9} />
            <span className="f-sm faint">on-time rate</span>
          </div>
          <div className="col" style={{ gap: 8 }}>
            {[["On track", ot.onTrack, "var(--green-600)"], ["At risk", ot.atRisk, "var(--amber-500)"], ["Late", ot.late, "var(--red-600)"]].map(([l, v, c]) => (
              <div key={l} className="spread"><div className="row gap8"><span className="dot" style={{ background: c }} /><span className="f-sm">{l}</span></div><span className="mono f-sm muted">{v}</span></div>
            ))}
          </div>
        </Panel>

        {/* Needs you — the only operational list, kept compact and metric-led */}
        <Panel eyebrow="REQUIRES ACTION" title="Needs you"
          right={<span className="lnk f-sm" onClick={() => onNav("pending")}>All →</span>}
          style={{ flex: "1 1 300px" }}>
          <div className="row gap16" style={{ marginBottom: 16 }}>
            <div className="col" style={{ gap: 2 }}>
              <span className="f-h1" style={{ fontSize: "calc(30px * var(--type-scale))", color: "var(--red-600)" }}><window.Anim.AnimatedNumber value={D.DASH.needsYou} /></span>
              <span className="f-sm faint">open items</span>
            </div>
            <div className="col" style={{ gap: 2 }}>
              <span className="f-h1" style={{ fontSize: "calc(30px * var(--type-scale))" }}>{D.DASH.awaitingOthers}</span>
              <span className="f-sm faint">awaiting others</span>
            </div>
          </div>
          <div className="col" style={{ gap: 0 }}>
            {D.TASKS.filter(t => t.urgency === "high").slice(0, 3).map((t, i) => (
              <button key={t.id} onClick={() => onOpenDemand(D.FOCAL.id)} className="row gap8" style={{ padding: "10px 0", borderTop: i ? "1px solid var(--border-hairline)" : "none", textAlign: "left", width: "100%" }}>
                <window.UI.ConfidenceDot value={t.conf} />
                <span className="f-sm grow clip" style={{ color: "var(--text-ink)" }}>{t.title}</span>
                <IconD name="arrowRight" size={14} style={{ color: "var(--text-faint)" }} />
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

window.Dashboard = Dashboard;
