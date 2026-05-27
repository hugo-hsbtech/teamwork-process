/* Conductor UI kit — wizard chrome.
   Stepper, Drawer, Takeover. */

function Stepper({ steps, current, compact }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        const dotColor = done || active ? "var(--brand-tide)" : "var(--border-strong)";
        return (
          <React.Fragment key={i}>
            <div title={s} style={{
              width: 12, height: 12, borderRadius: "50%",
              background: dotColor,
              transition: "background 200ms var(--ease-standard)",
              flexShrink: 0,
            }} />
            {i < steps.length - 1 && (
              <div style={{
                width: compact ? 20 : 28, height: 2, borderRadius: 2, margin: "0 10px",
                background: i < current ? "var(--brand-tide)" : "var(--border-hairline)",
                transition: "background 200ms var(--ease-standard)",
              }} />
            )}
          </React.Fragment>
        );
      })}
      {!compact && (
        <span style={{ marginLeft: 16, font: "400 12px/1 var(--font-sans)", color: "var(--text-muted)" }}>
          Step {current + 1} of {steps.length}
        </span>
      )}
    </div>
  );
}

// ---------- Drawer (right-edge sliding wizard) ---------------------
function Drawer({ open, onClose, title, steps, currentStep, footer, children, width = 560 }) {
  if (!open) return null;
  return (
    <React.Fragment>
      <div className="scrim" onClick={onClose} />
      <aside className="drawer-enter" style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width, zIndex: 51,
        background: "var(--surface-card)",
        boxShadow: "var(--elev-2)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{
          height: 60, flexShrink: 0,
          padding: "0 24px",
          display: "flex", alignItems: "center", gap: 12,
          borderBottom: "1px solid var(--border-hairline)",
        }}>
          <span style={{ flex: 1, font: "700 15px/1 var(--font-display)", color: "var(--text-ink)" }}>{title}</span>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 999,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            color: "var(--text-muted)",
          }}>
            <Icon name="x" size={16} />
          </button>
        </div>
        {/* Stepper */}
        {steps && (
          <div style={{
            height: 56, flexShrink: 0,
            padding: "0 24px",
            display: "flex", alignItems: "center",
            borderBottom: "1px solid var(--border-hairline)",
          }}>
            <Stepper steps={steps} current={currentStep} compact />
            <span style={{ marginLeft: 14, font: "400 12px/1 var(--font-sans)", color: "var(--text-muted)" }}>
              Step {currentStep + 1} of {steps.length} · <span style={{ color: "var(--text-ink)" }}>{steps[currentStep]}</span>
            </span>
          </div>
        )}
        {/* Body (scrolls) */}
        <div style={{ flex: 1, minHeight: 0, overflow: "auto", padding: 24 }}>
          {children}
        </div>
        {/* Footer */}
        {footer && (
          <div style={{
            height: 66, flexShrink: 0,
            padding: "0 24px",
            borderTop: "1px solid var(--border-hairline)",
            display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10,
          }}>
            {footer}
          </div>
        )}
      </aside>
    </React.Fragment>
  );
}

// ---------- Takeover (full-screen wizard chrome) -------------------
function Takeover({ open, onClose, title, steps, currentStep, footer, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 60,
      background: "var(--surface-canvas)",
      display: "flex", flexDirection: "column",
    }}>
      {/* Top bar */}
      <div style={{
        height: 66, flexShrink: 0,
        background: "var(--surface-card)",
        borderBottom: "1px solid var(--border-hairline)",
        padding: "0 32px",
        display: "flex", alignItems: "center",
      }}>
        <img src="../../assets/conductor-mark.svg" width={22} height={22} alt="" style={{ marginRight: 10 }} />
        <span style={{ font: "700 15px/1 var(--font-display)", color: "var(--text-ink)" }}>Conductor · {title}</span>
        <div style={{ flex: 1 }} />
        <button onClick={onClose} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "6px 12px",
          color: "var(--text-muted)",
          fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 13,
        }}>
          Exit <Icon name="x" size={14} />
        </button>
      </div>

      {/* Stepper */}
      <div style={{
        height: 62, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--surface-canvas)",
      }}>
        <Stepper steps={steps} current={currentStep} />
      </div>

      {/* Body */}
      <div style={{ flex: 1, minHeight: 0, overflow: "auto", padding: 32, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
        <div style={{
          width: "100%", maxWidth: 720,
          background: "var(--surface-card)",
          border: "1px solid var(--border-hairline)",
          borderRadius: 16,
          padding: 40,
          display: "flex", flexDirection: "column", gap: 24,
        }}>
          {children}
        </div>
      </div>

      {/* Footer */}
      {footer && (
        <div style={{
          height: 70, flexShrink: 0,
          background: "var(--surface-card)",
          borderTop: "1px solid var(--border-hairline)",
          padding: "0 32px",
          display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12,
        }}>
          {footer}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Stepper, Drawer, Takeover });
