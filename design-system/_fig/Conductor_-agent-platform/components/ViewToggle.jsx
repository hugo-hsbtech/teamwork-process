// figma: 279:67 ViewToggle (2 variants)
const __variants = {
  "view=Table": { width: 163 },
};
const __vkey = (p) => "view=" + p.view;

export function ViewToggle(_p = {}) {
  const props = { ..._p, view: _p.view ?? "Blocks" };
  const __vs = __variants[__vkey(props)] ?? {};
  return (
    <div className={props.className} style={{
      width: 161,
      height: 34,
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "var(--surface-card)",
      border: "1px solid var(--border-hairline)",
      display: "flex",
      flexDirection: "row",
      gap: 2,
      padding: "3px 3px 3px 3px",
      alignItems: "center",
      position: "relative",
      ...__vs, ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 3,
        top: 4,
        width: 78,
        height: 26,
        overflow: "hidden",
        borderRadius: 6,
        backgroundColor: "var(--brand-tide)",
        display: "flex",
        flexDirection: "row",
        gap: 6,
        padding: "6px 12px 6px 12px",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <div style={{
          position: "absolute",
          left: 12,
          top: 6.5,
          width: 13,
          height: 13,
        }}>
          <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 5,
            height: 5,
            borderRadius: 1,
            backgroundColor: "var(--text-on-brand)",
          }} />
          <div style={{
            position: "absolute",
            left: 7,
            top: 0,
            width: 5,
            height: 5,
            borderRadius: 1,
            backgroundColor: "var(--text-on-brand)",
          }} />
          <div style={{
            position: "absolute",
            left: 0,
            top: 7,
            width: 5,
            height: 5,
            borderRadius: 1,
            backgroundColor: "var(--text-on-brand)",
          }} />
          <div style={{
            position: "absolute",
            left: 7,
            top: 7,
            width: 5,
            height: 5,
            borderRadius: 1,
            backgroundColor: "var(--text-on-brand)",
          }} />
        </div>
        <span style={{
          position: "absolute",
          left: 31,
          top: 6,
          width: 35,
          height: 14,
          fontFamily: "Hanken Grotesk",
          fontWeight: 700,
          fontSize: 12,
          lineHeight: "100%",
          color: "var(--text-on-brand)",
        }}>Blocks</span>
      </div>
      <div style={{
        position: "absolute",
        left: 83,
        top: 3,
        width: 75,
        height: 28,
        overflow: "hidden",
        borderRadius: 6,
        display: "flex",
        flexDirection: "row",
        gap: 6,
        padding: "6px 12px 6px 12px",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <div style={{
          position: "absolute",
          left: 12,
          top: 7.5,
          width: 13,
          height: 13,
        }}>
          <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 13,
            height: 3,
            borderRadius: 1,
            backgroundColor: "var(--text-muted)",
          }} />
          <div style={{
            position: "absolute",
            left: 0,
            top: 5,
            width: 13,
            height: 3,
            borderRadius: 1,
            backgroundColor: "var(--text-muted)",
          }} />
          <div style={{
            position: "absolute",
            left: 0,
            top: 10,
            width: 13,
            height: 3,
            borderRadius: 1,
            backgroundColor: "var(--text-muted)",
          }} />
        </div>
        <span style={{
          position: "absolute",
          left: 31,
          top: 6,
          width: 32,
          height: 16,
          fontFamily: "Hanken Grotesk",
          fontWeight: 500,
          fontSize: 12,
          lineHeight: "100%",
          color: "var(--text-muted)",
        }}>Table</span>
      </div>
    </div>
  );
}
export default ViewToggle;
