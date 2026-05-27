import { Stepper } from './Stepper.jsx';

// figma: 87:30 Drawer shell (2 variants)
const __variants = {
  "size=560": { width: 560, boxShadow: "0px 4px 8px -2px rgba(28,27,24,0.06), 0px 12px 32px -4px rgba(28,27,24,0.12)" },
};
const __vkey = (p) => "size=" + p.size;

export function DrawerShell(_p = {}) {
  const props = { ..._p, size: _p.size ?? "480" };
  const __vs = __variants[__vkey(props)] ?? {};
  return (
    <div className={props.className} style={{
      width: 480,
      height: 720,
      backgroundColor: "var(--surface-card)",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      ...__vs, ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 480,
        height: 68,
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        gap: 12,
        padding: "20px 20px 20px 24px",
        alignItems: "center",
      }}>
        <span style={{
          position: "absolute",
          left: 24,
          top: 21,
          width: 396,
          height: 26,
          fontFamily: "Inter",
          fontSize: 12,
          lineHeight: "100%",
          color: "var(--text-ink)",
        }}>Deploy agent</span>
        <div style={{
          position: "absolute",
          left: 432,
          top: 20,
          width: 28,
          height: 28,
          overflow: "hidden",
          borderRadius: 999,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <span style={{
            position: "absolute",
            left: 7,
            top: 3.5,
            width: 14,
            height: 21,
            fontFamily: "Hanken Grotesk",
            fontWeight: 500,
            fontSize: 16,
            lineHeight: "100%",
            color: "var(--text-muted)",
          }}>✕</span>
        </div>
      </div>
      <div style={{
        position: "absolute",
        left: 0,
        top: 68,
        width: 480,
        height: 1,
        backgroundColor: "var(--border-hairline)",
      }} />
      <div style={{
        position: "absolute",
        left: 0,
        top: 69,
        width: 480,
        height: 62,
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        padding: "16px 24px 16px 24px",
      }}>
        <Stepper style={{
            position: "absolute",
            left: 24,
            top: 16,
            width: 242,
            height: 30,
          }} />
      </div>
      <div style={{
        position: "absolute",
        left: 0,
        top: 131,
        width: 480,
        height: 1,
        backgroundColor: "var(--border-hairline)",
      }} />
      <div style={{
        position: "absolute",
        left: 0,
        top: 132,
        width: 480,
        height: 522,
        overflow: "hidden",
        backgroundColor: "var(--surface-card)",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: "24px 24px 24px 24px",
      }}>
        <span style={{
          position: "absolute",
          left: 24,
          top: 24,
          width: 432,
          height: 20,
          fontFamily: "Inter",
          fontSize: 12,
          lineHeight: "100%",
          color: "var(--text-muted)",
        }}>Form fields and step content scroll here.</span>
      </div>
      <div style={{
        position: "absolute",
        left: 0,
        top: 654,
        width: 480,
        height: 66,
        overflow: "hidden",
        backgroundColor: "var(--surface-card)",
        border: "1px solid var(--border-hairline)",
        display: "flex",
        flexDirection: "row",
        gap: 12,
        padding: "16px 24px 16px 24px",
        justifyContent: "flex-end",
        alignItems: "center",
      }}>
        <div style={{
          position: "absolute",
          left: 290,
          top: 16,
          width: 64,
          height: 34,
          overflow: "hidden",
          borderRadius: 8,
          border: "1px solid var(--border-hairline)",
          display: "flex",
          flexDirection: "row",
          padding: "8px 16px 8px 16px",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <span style={{
            position: "absolute",
            left: 16,
            top: 8,
            width: 32,
            height: 18,
            fontFamily: "Hanken Grotesk",
            fontWeight: 700,
            fontSize: 14,
            lineHeight: "100%",
            color: "var(--text-ink)",
          }}>Back</span>
        </div>
        <div style={{
          position: "absolute",
          left: 366,
          top: 16,
          width: 90,
          height: 34,
          overflow: "hidden",
          borderRadius: 8,
          backgroundColor: "var(--brand-tide)",
          display: "flex",
          flexDirection: "row",
          padding: "8px 16px 8px 16px",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <span style={{
            position: "absolute",
            left: 16,
            top: 8,
            width: 58,
            height: 18,
            fontFamily: "Hanken Grotesk",
            fontWeight: 700,
            fontSize: 14,
            lineHeight: "100%",
            color: "var(--text-on-brand)",
          }}>Continue</span>
        </div>
      </div>
    </div>
  );
}
export default DrawerShell;
