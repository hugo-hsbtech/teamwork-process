// ui.jsx — shared primitives. Exposes window.UI.* and a few globals.
const { useState, useRef, useEffect, useCallback } = React;
const Icon = window.Icon;

// ---- Button -----------------------------------------------------------
function Button({ variant = "secondary", size = "md", icon, iconRight, children, disabled, onClick, style, title }) {
  return (
    <button className={`btn btn-${variant} btn-${size}${disabled ? " is-disabled" : ""}`}
      onClick={onClick} disabled={disabled} style={style} title={title}>
      {icon && <Icon name={icon} size={size === "lg" ? 18 : 16} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === "lg" ? 18 : 16} />}
    </button>
  );
}

// ---- StateBadge -------------------------------------------------------
function StateBadge({ state, size = "md" }) {
  const s = window.DATA.STATES[state];
  if (!s) return null;
  const fs = size === "sm" ? "var(--fs-xs)" : "var(--fs-sm)";
  return (
    <span className="pill" style={{ background: s.wash, fontFamily: "var(--font-sans)", letterSpacing: 0, fontWeight: 500, fontSize: fs, color: s.text, padding: "3px 9px 3px 7px" }}>
      <span className="dot" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
}

// ---- Version / meta pill (mono caps) ----------------------------------
function MetaPill({ children, tone = "muted", icon }) {
  const tones = {
    muted: { bg: "var(--surface-sunken)", fg: "var(--text-muted)" },
    amber: { bg: "var(--amber-50)", fg: "var(--amber-600)" },
    tide:  { bg: "var(--tide-50)", fg: "var(--accent-text)" },
    red:   { bg: "var(--red-50)", fg: "var(--red-600)" },
  };
  const t = tones[tone] || tones.muted;
  return (
    <span className="pill" style={{ background: t.bg, color: t.fg }}>
      {icon && <Icon name={icon} size={11} />}
      {children}
    </span>
  );
}

// ---- Avatar -----------------------------------------------------------
function Avatar({ person, size = 28, ai }) {
  const sz = size, fs = Math.round(size * 0.4);
  return (
    <span className="avatar" style={{
      width: sz, height: sz, fontSize: fs,
      background: person.color,
      border: ai ? "none" : undefined,
      fontFamily: ai ? "var(--font-mono)" : "var(--font-display)",
    }}>{person.initials}</span>
  );
}

// ---- Confidence dot (AI confidence on a task) -------------------------
function ConfidenceDot({ value }) {
  // low confidence => warmer/red, high => calmer
  const color = value < 0.45 ? "var(--red-600)" : value < 0.65 ? "var(--amber-500)" : "var(--tide-500)";
  return <span className="dot" style={{ background: color, width: 8, height: 8 }} title={`Copilot confidence ${Math.round(value*100)}%`} />;
}

// ---- Type tag (QUESTION / ARTIFACT) -----------------------------------
function KindTag({ kind }) {
  const isQ = kind === "question";
  return (
    <span className="pill" style={{
      background: isQ ? "var(--amber-50)" : "var(--tide-50)",
      color: isQ ? "var(--amber-600)" : "var(--accent-text)",
      letterSpacing: "0.07em", padding: "3px 8px",
    }}>{isQ ? "QUESTION" : "ARTIFACT"}</span>
  );
}

// ---- Readiness ring ---------------------------------------------------
function ReadinessRing({ pct, size = 96, stroke = 8, showPct = true }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const color = window.DATA.readinessColor(pct);
  const targetOff = circ * (1 - pct / 100);
  const [off, setOff] = useState(circ);            // draw-in from empty
  useEffect(() => { const id = requestAnimationFrame(() => setOff(targetOff)); const fb = setTimeout(() => setOff(targetOff), 420); return () => { cancelAnimationFrame(id); clearTimeout(fb); }; }, [targetOff, circ]);
  const shown = window.Anim.useCountUp(pct, 900);
  return (
    <div style={{ position: "relative", width: size, height: size, flex: "none" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--surface-sunken)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off}
          style={{ transition: "stroke-dashoffset 800ms var(--ease-out), stroke 300ms" }} />
      </svg>
      {showPct && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color, fontSize: size * 0.26,
            lineHeight: 1, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>{Math.round(shown)}%</span>
        </div>
      )}
    </div>
  );
}

// ---- Readiness bar ----------------------------------------------------
function ReadinessBar({ pct, threshold, height = 8 }) {
  const color = window.DATA.readinessColor(pct);
  const w = window.Anim.useGrow(pct);
  return (
    <div style={{ position: "relative", width: "100%", height, borderRadius: 9999, background: "var(--surface-sunken)", overflow: "visible" }}>
      <div style={{ position: "absolute", left: 0, top: 0, height, width: `${w}%`, background: color, borderRadius: 9999, transition: "width 700ms var(--ease-out), background 300ms" }} />
      {threshold != null && (
        <div title={`Discovery threshold ${threshold}%`} style={{ position: "absolute", left: `${threshold}%`, top: -2, height: height + 4, width: 2, background: "var(--text-faint)", borderRadius: 2 }} />
      )}
    </div>
  );
}

// ---- Count chip -------------------------------------------------------
function CountChip({ children }) { return <span className="count-chip">{children}</span>; }

// ---- Tabs -------------------------------------------------------------
function Tabs({ tabs, active, onChange }) {
  return (
    <div className="row" style={{ gap: 24, borderBottom: "1px solid var(--border-hairline)" }}>
      {tabs.map(t => (
        <div key={t.id} className={`tab${active === t.id ? " is-active" : ""}`} onClick={() => onChange(t.id)}>
          {t.label}
          {t.count != null && <CountChip>{t.count}</CountChip>}
        </div>
      ))}
    </div>
  );
}

// ---- Eyebrow ----------------------------------------------------------
function Eyebrow({ children, color, style }) {
  return <div className="f-eyebrow" style={{ color: color || "var(--text-muted)", ...style }}>{children}</div>;
}

// ---- Modal ------------------------------------------------------------
function Modal({ width = 560, onClose, eyebrow, title, sub, children, footer, headRight }) {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose && onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="modal" style={{ width }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border-hairline)", display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div className="grow">
            {eyebrow && <Eyebrow style={{ marginBottom: 7 }}>{eyebrow}</Eyebrow>}
            <div className="f-h3">{title}</div>
            {sub && <div className="f-sm muted" style={{ marginTop: 5 }}>{sub}</div>}
          </div>
          {headRight}
          <button className="btn btn-ghost btn-sm" style={{ width: 30, height: 30, padding: 0, marginTop: -4, marginRight: -8 }} onClick={onClose}><Icon name="x" size={18} /></button>
        </div>
        <div className="scroll" style={{ padding: 24, overflowY: "auto" }}>{children}</div>
        {footer && <div style={{ padding: "14px 24px", borderTop: "1px solid var(--border-hairline)", display: "flex", justifyContent: "flex-end", gap: 8 }}>{footer}</div>}
      </div>
    </>
  );
}

// ---- Toast ------------------------------------------------------------
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 90,
      background: "var(--surface-inverse)", color: "var(--surface-canvas)", padding: "11px 16px",
      borderRadius: 10, boxShadow: "var(--elev-pop)", display: "flex", alignItems: "center", gap: 9,
      fontSize: "var(--fs-sm)", fontFamily: "var(--font-sans)", animation: "slideUp 240ms var(--ease-out) forwards" }}>
      <span style={{ color: "var(--tide-300)", display: "flex" }}><Icon name={toast.icon || "checkCircle"} size={16} /></span>
      {toast.text}
    </div>
  );
}

// ---- Status pill (schedule / parking flag — separate axis from state) -
function StatusPill({ flag }) {
  const f = window.DATA.FLAGS[flag];
  if (!f) return null;
  return <MetaPill tone={f.tone} icon={f.icon}>{f.label}</MetaPill>;
}

// ---- Journey track (end-to-end pipeline stepper) ----------------------
function JourneyTrack({ current }) {
  const D = window.DATA;
  const order = D.JOURNEY;
  // v2draft sits at the frozen node for progress purposes
  const cur = current === "v2draft" ? "frozen" : current;
  const curIdx = order.findIndex(s => s.key === cur);
  return (
    <div className="row" style={{ alignItems: "flex-start", gap: 0, overflowX: "auto" }}>
      {order.map((s, i) => {
        const done = i < curIdx, active = i === curIdx;
        const dotColor = active ? "var(--accent)" : done ? "var(--green-600)" : "var(--border-strong)";
        return (
          <div key={s.key} className="row" style={{ alignItems: "flex-start", flex: i === order.length - 1 ? "none" : 1, minWidth: 0 }}>
            <div className="col" style={{ alignItems: "center", gap: 6, flex: "none", width: 92 }}>
              <span className="dot" style={{ width: active ? 11 : 9, height: active ? 11 : 9, background: dotColor,
                boxShadow: active ? "0 0 0 4px var(--accent-wash)" : "none", transition: "all var(--dur-base)" }} />
              <div className="col" style={{ alignItems: "center", gap: 1 }}>
                <span className="f-sm" style={{ fontWeight: active ? 700 : 600, color: active ? "var(--text-ink)" : done ? "var(--text-muted)" : "var(--text-faint)", textAlign: "center", lineHeight: 1.15 }}>{s.label}</span>
                <span className="f-sm faint" style={{ fontSize: 10 }}>{s.owner}</span>
              </div>
            </div>
            {i < order.length - 1 && (
              <div style={{ flex: 1, height: 2, marginTop: 4, minWidth: 16, borderRadius: 2,
                background: done ? "var(--green-600)" : "var(--border-hairline)" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

window.UI = { Button, StateBadge, MetaPill, StatusPill, JourneyTrack, Avatar, ConfidenceDot, KindTag, ReadinessRing, ReadinessBar, CountChip, Tabs, Eyebrow, Modal, Toast };
