// figma: 285:70 BlockGrid sentinel (2 variants)
const __variants = {
  "state=end": { height: 77, padding: "24px 24px 24px 24px" },
};
const __vkey = (p) => "state=" + p.state;

export function BlockGridSentinel(_p = {}) {
  const props = { ..._p, state: _p.state ?? "loading-more" };
  const __vs = __variants[__vkey(props)] ?? {};
  return (
    <div className={props.className} style={{
      width: 900,
      height: 164,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      gap: 14,
      padding: "20px 24px 20px 24px",
      alignItems: "center",
      position: "relative",
      ...__vs, ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 24,
        top: 20,
        width: 852,
        height: 96,
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        gap: 16,
      }}>
        <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 273.333,
          height: 96,
          overflow: "hidden",
          borderRadius: 12,
          backgroundColor: "var(--surface-sunken)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "16px 16px 16px 16px",
        }}>
          <div style={{
            position: "absolute",
            left: 16,
            top: 16,
            width: 120,
            height: 12,
            borderRadius: 4,
            backgroundColor: "var(--border-hairline)",
          }} />
          <div style={{
            position: "absolute",
            left: 16,
            top: 38,
            width: 241.333,
            height: 10,
            borderRadius: 4,
            backgroundColor: "var(--border-hairline)",
          }} />
          <div style={{
            position: "absolute",
            left: 16,
            top: 58,
            width: 80,
            height: 10,
            borderRadius: 4,
            backgroundColor: "var(--border-hairline)",
          }} />
        </div>
        <div style={{
          position: "absolute",
          left: 289.333,
          top: 0,
          width: 273.333,
          height: 96,
          overflow: "hidden",
          borderRadius: 12,
          backgroundColor: "var(--surface-sunken)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "16px 16px 16px 16px",
        }}>
          <div style={{
            position: "absolute",
            left: 16,
            top: 16,
            width: 120,
            height: 12,
            borderRadius: 4,
            backgroundColor: "var(--border-hairline)",
          }} />
          <div style={{
            position: "absolute",
            left: 16,
            top: 38,
            width: 241.333,
            height: 10,
            borderRadius: 4,
            backgroundColor: "var(--border-hairline)",
          }} />
          <div style={{
            position: "absolute",
            left: 16,
            top: 58,
            width: 80,
            height: 10,
            borderRadius: 4,
            backgroundColor: "var(--border-hairline)",
          }} />
        </div>
        <div style={{
          position: "absolute",
          left: 578.667,
          top: 0,
          width: 273.333,
          height: 96,
          overflow: "hidden",
          borderRadius: 12,
          backgroundColor: "var(--surface-sunken)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "16px 16px 16px 16px",
        }}>
          <div style={{
            position: "absolute",
            left: 16,
            top: 16,
            width: 120,
            height: 12,
            borderRadius: 4,
            backgroundColor: "var(--border-hairline)",
          }} />
          <div style={{
            position: "absolute",
            left: 16,
            top: 38,
            width: 241.333,
            height: 10,
            borderRadius: 4,
            backgroundColor: "var(--border-hairline)",
          }} />
          <div style={{
            position: "absolute",
            left: 16,
            top: 58,
            width: 80,
            height: 10,
            borderRadius: 4,
            backgroundColor: "var(--border-hairline)",
          }} />
        </div>
      </div>
      <span style={{
        position: "absolute",
        left: 410,
        top: 130,
        width: 80,
        height: 14,
        fontFamily: "Hanken Grotesk",
        fontWeight: 700,
        fontSize: 12,
        lineHeight: "100%",
        color: "var(--text-muted)",
      }}>Loading more…</span>
    </div>
  );
}
export default BlockGridSentinel;
