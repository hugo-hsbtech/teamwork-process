// screens_misc.jsx — Pending, Activity, Settings, Notifications, Search. window.Misc
const { useState: useStateMi, useEffect: useEffectMi } = React;
const IconMi = window.Icon;

function Pending({ tasks, onOpenDemand, onOpenModal }) {
  const D = window.DATA;
  const open = tasks.filter(t => !t.resolved);
  return (
    <div className="app-scroll scroll anim-screen" style={{ padding: 24, maxWidth: 980, margin: "0 auto", width: "100%" }}>
      <window.UI.Eyebrow style={{ marginBottom: 8 }}>ACROSS YOUR DEMANDS</window.UI.Eyebrow>
      <div className="f-h1" style={{ marginBottom: 4 }}>Pending</div>
      <div className="f-body muted" style={{ marginBottom: 24 }}>{open.length} items need you. Most live on your active demand, {D.FOCAL.id}.</div>
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "12px 20px", background: "var(--surface-sunken)", borderBottom: "1px solid var(--border-hairline)" }} className="row gap8">
          <span className="mono f-sm faint">{D.FOCAL.id}</span><span className="f-label clip" style={{ fontWeight: 600 }}>{D.FOCAL.title}</span>
          <div className="grow" /><button className="lnk f-sm" onClick={() => onOpenDemand(D.FOCAL.id)}>Open demand →</button>
        </div>
        {open.map((t, i) => {
          const isQ = t.kind === "question";
          return (
            <div key={t.id} className="row gap12" style={{ padding: "14px 20px", borderTop: i ? "1px solid var(--border-hairline)" : "none" }}>
              <window.UI.ConfidenceDot value={t.conf} /><window.UI.KindTag kind={t.kind} />
              <span className="f-label grow clip" style={{ fontWeight: 600 }}>{t.title}</span>
              <button className="lnk f-sm row gap4" onClick={() => onOpenModal({ type: isQ ? "answer" : "fillArtifact", id: t.refId, taskId: t.id })}>{isQ ? "Answer" : "Fill in"} <IconMi name="arrowRight" size={14} /></button>
            </div>
          );
        })}
        {open.length === 0 && <div className="col" style={{ alignItems: "center", padding: 48, gap: 6 }}><IconMi name="checkCircle" size={28} style={{ color: "var(--green-600)" }} /><div className="f-label">Nothing pending — nice.</div></div>}
      </div>
    </div>
  );
}

function ActivityScreen() {
  const D = window.DATA;
  return (
    <div className="app-scroll scroll anim-screen" style={{ padding: 24, maxWidth: 820, margin: "0 auto", width: "100%" }}>
      <window.UI.Eyebrow style={{ marginBottom: 8 }}>ALL ACTIVITY</window.UI.Eyebrow>
      <div className="f-h1" style={{ marginBottom: 24 }}>Activity</div>
      <div className="card card-pad">
        {D.ACTIVITY.concat([
          { id: "x1", ago: "3d ago", who: "AC", text: "Ana Costa commented on INT-2026-011", kind: "source" },
          { id: "x2", ago: "5d ago", who: "HS", text: "You moved INT-2026-009 to Delivered", kind: "create" },
        ]).map((a, i) => (
          <div key={a.id} className="row" style={{ gap: 12, padding: "13px 0", borderTop: i ? "1px solid var(--border-hairline)" : "none", alignItems: "flex-start" }}>
            <span style={{ marginTop: 1, color: a.kind === "ai" ? "var(--accent-text)" : "var(--text-faint)", display: "flex" }}><IconMi name={a.kind === "ai" ? "sparkles" : a.kind === "source" ? "message" : "fileText"} size={16} /></span>
            <div className="grow"><div className="f-sm" style={{ color: "var(--text-ink)" }}>{a.text}</div><div className="f-sm faint" style={{ marginTop: 3, fontSize: 11 }}>{a.ago}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Settings() {
  return (
    <div className="app-scroll scroll anim-screen" style={{ padding: 24, maxWidth: 720, margin: "0 auto", width: "100%" }}>
      <window.UI.Eyebrow style={{ marginBottom: 8 }}>WORKSPACE</window.UI.Eyebrow>
      <div className="f-h1" style={{ marginBottom: 24 }}>Settings</div>
      <div className="card card-pad col gap16">
        <div className="row gap12"><window.UI.Avatar person={window.DATA.USER} size={44} /><div className="col"><span className="f-title" style={{ fontWeight: 700 }}>{window.DATA.USER.name}</span><span className="f-sm muted">{window.DATA.USER.role}</span></div></div>
        <div className="hr" />
        <div className="f-sm faint">Notification, integration and workspace preferences would live here. Out of scope for this prototype.</div>
      </div>
    </div>
  );
}

function NotificationsPanel({ open, onClose, onOpenDemand }) {
  if (!open) return null;
  const D = window.DATA;
  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 49 }} onClick={onClose} />
      <div className="card" style={{ position: "fixed", top: 52, right: 16, width: 380, zIndex: 50, boxShadow: "var(--elev-pop)", overflow: "hidden", animation: "scaleIn 180ms var(--ease-out) forwards" }}>
        <div className="spread" style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-hairline)" }}>
          <span className="f-label" style={{ fontWeight: 700 }}>Notifications</span>
          <button className="lnk f-sm">Mark all read</button>
        </div>
        {D.NOTIFICATIONS.map((n, i) => {
          const p = D.PEOPLE[n.who] || D.PEOPLE.AI;
          return (
            <button key={n.id} onClick={() => { onClose(); onOpenDemand(D.FOCAL.id); }} className="row gap10" style={{ padding: "14px 16px", borderTop: i ? "1px solid var(--border-hairline)" : "none", textAlign: "left", width: "100%", alignItems: "flex-start", background: n.unread ? "var(--accent-wash)" : "transparent" }}>
              {n.who === "AI" ? <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--accent-wash)", display: "grid", placeItems: "center", color: "var(--accent-text)", flex: "none" }}><IconMi name="sparkles" size={15} /></div> : <window.UI.Avatar person={p} size={28} />}
              <div className="grow"><div className="f-sm" style={{ color: "var(--text-ink)" }}>{n.text}</div><div className="f-sm faint" style={{ marginTop: 3, fontSize: 11 }}>{n.ago} ago</div></div>
              {n.unread && <span className="dot" style={{ background: "var(--accent)", marginTop: 6 }} />}
            </button>
          );
        })}
      </div>
    </>
  );
}

function SearchPalette({ open, onClose, onNav, onOpenDemand }) {
  const [q, setQ] = useStateMi("");
  useEffectMi(() => { if (open) setQ(""); }, [open]);
  if (!open) return null;
  const D = window.DATA;
  const matches = D.DEMANDS.filter(d => !q || d.title.toLowerCase().includes(q.toLowerCase()) || d.id.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <div className="scrim" onClick={onClose} style={{ background: "rgba(28,27,24,0.35)" }} />
      <div className="card" style={{ position: "fixed", top: "16vh", left: "50%", transform: "translateX(-50%)", width: 560, zIndex: 62, boxShadow: "var(--elev-pop)", overflow: "hidden", animation: "scaleIn 200ms var(--ease-out) forwards" }}>
        <div className="row gap10" style={{ padding: "14px 18px", borderBottom: "1px solid var(--border-hairline)" }}>
          <IconMi name="search" size={18} style={{ color: "var(--text-faint)" }} />
          <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search demands, runs, tools…" style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: "var(--fs-title)", color: "var(--text-ink)" }} />
          <span className="pill" style={{ background: "var(--surface-sunken)", color: "var(--text-faint)", fontSize: 10 }}>ESC</span>
        </div>
        <div className="scroll" style={{ maxHeight: 320, overflowY: "auto", padding: 6 }}>
          {matches.map(d => (
            <button key={d.id} onClick={() => { onClose(); onOpenDemand(d.id); }} className="row gap12" style={{ padding: "11px 12px", borderRadius: 8, width: "100%", textAlign: "left" }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--surface-sunken)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <span className="mono f-sm faint" style={{ width: 96, flex: "none" }}>{d.id}</span>
              <span className="f-label grow clip" style={{ fontWeight: 600 }}>{d.title}</span>
              <window.UI.StateBadge state={d.state} size="sm" />
            </button>
          ))}
          {matches.length === 0 && <div className="f-sm faint" style={{ padding: 24, textAlign: "center" }}>No matches</div>}
        </div>
      </div>
    </>
  );
}

window.Misc = { Pending, ActivityScreen, Settings, NotificationsPanel, SearchPalette };
