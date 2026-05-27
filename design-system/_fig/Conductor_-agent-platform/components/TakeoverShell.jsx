import { Stepper } from './Stepper.jsx';

// figma: 88:26 Takeover shell
export function TakeoverShell(_p = {}) {
  const props = _p;
  return (
    <div className={props.className} style={{
      width: 1440,
      height: 1024,
      backgroundColor: "var(--surface-canvas)",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 1440,
        height: 66,
        overflow: "hidden",
        backgroundColor: "var(--surface-card)",
        border: "1px solid var(--border-hairline)",
        display: "flex",
        flexDirection: "row",
        gap: 12,
        padding: "18px 32px 18px 32px",
        alignItems: "center",
      }}>
        <span style={{
          position: "absolute",
          left: 32,
          top: 23,
          width: 1301,
          height: 20,
          fontFamily: "Hanken Grotesk",
          fontWeight: 700,
          fontSize: 15,
          lineHeight: "100%",
          color: "var(--text-ink)",
        }}>Conductor · Deploy agent</span>
        <div style={{
          position: "absolute",
          left: 1345,
          top: 18,
          width: 63,
          height: 30,
          overflow: "hidden",
          borderRadius: 8,
          display: "flex",
          flexDirection: "row",
          gap: 6,
          padding: "6px 10px 6px 10px",
          alignItems: "center",
        }}>
          <span style={{
            position: "absolute",
            left: 10,
            top: 6,
            width: 24,
            height: 18,
            fontFamily: "Hanken Grotesk",
            fontWeight: 500,
            fontSize: 14,
            lineHeight: "100%",
            color: "var(--text-muted)",
          }}>Exit</span>
          <span style={{
            position: "absolute",
            left: 40,
            top: 6,
            width: 13,
            height: 18,
            fontFamily: "Hanken Grotesk",
            fontWeight: 500,
            fontSize: 14,
            lineHeight: "100%",
            color: "var(--text-muted)",
          }}>✕</span>
        </div>
      </div>
      <div style={{
        position: "absolute",
        left: 0,
        top: 66,
        width: 1440,
        height: 62,
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        padding: "24px 0px 8px 0px",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Stepper style={{
            position: "absolute",
            left: 480,
            top: 24,
            width: 480,
            height: 30,
          }} />
      </div>
      <div style={{
        position: "absolute",
        left: 0,
        top: 128,
        width: 1440,
        height: 826,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        padding: "32px 32px 32px 32px",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <div style={{
          position: "absolute",
          left: 360,
          top: 32,
          width: 720,
          height: 762,
          overflow: "hidden",
          borderRadius: 12,
          backgroundColor: "var(--surface-card)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          padding: "40px 40px 40px 40px",
        }}>
          <span style={{
            position: "absolute",
            left: 40,
            top: 40,
            width: 640,
            height: 20,
            fontFamily: "Inter",
            fontSize: 12,
            lineHeight: "100%",
            color: "var(--text-muted)",
          }}>Step content — the centered 720px working column.</span>
        </div>
      </div>
      <div style={{
        position: "absolute",
        left: 0,
        top: 954,
        width: 1440,
        height: 70,
        overflow: "hidden",
        backgroundColor: "var(--surface-card)",
        border: "1px solid var(--border-hairline)",
        display: "flex",
        flexDirection: "row",
        gap: 12,
        padding: "16px 32px 16px 32px",
        justifyContent: "flex-end",
        alignItems: "center",
      }}>
        <div style={{
          position: "absolute",
          left: 1215,
          top: 16,
          width: 68,
          height: 38,
          overflow: "hidden",
          borderRadius: 8,
          border: "1px solid var(--border-hairline)",
          display: "flex",
          flexDirection: "row",
          padding: "10px 18px 10px 18px",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <span style={{
            position: "absolute",
            left: 18,
            top: 10,
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
          left: 1295,
          top: 16,
          width: 113,
          height: 38,
          overflow: "hidden",
          borderRadius: 8,
          backgroundColor: "var(--brand-tide)",
          display: "flex",
          flexDirection: "row",
          padding: "10px 18px 10px 18px",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <span style={{
            position: "absolute",
            left: 18,
            top: 10,
            width: 77,
            height: 18,
            fontFamily: "Hanken Grotesk",
            fontWeight: 700,
            fontSize: 14,
            lineHeight: "100%",
            color: "var(--text-on-brand)",
          }}>Continue →</span>
        </div>
      </div>
    </div>
  );
}
export default TakeoverShell;
