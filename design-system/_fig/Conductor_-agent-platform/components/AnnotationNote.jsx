// figma: 641:206 Annotation / Note
export function AnnotationNote(_p = {}) {
  const props = _p;
  return (
    <div className={props.className} style={{
      width: 1440,
      height: 72,
      overflow: "hidden",
      borderRadius: 10,
      backgroundColor: "var(--surface-card)",
      border: "1px solid var(--border-hairline)",
      boxShadow: "0px 3px 10px 0px rgba(0,0,0,0.06)",
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
        height: 3,
        backgroundColor: "var(--text-ink)",
      }} />
      <div style={{
        position: "absolute",
        left: 0,
        top: 3,
        width: 1440,
        height: 69,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: 5,
        padding: "13px 20px 14px 18px",
      }}>
        <span style={{
          position: "absolute",
          left: 18,
          top: 13,
          width: 1402,
          height: 19,
          fontFamily: "Hanken Grotesk",
          fontWeight: 700,
          fontSize: 14,
          lineHeight: 1.350000023841858,
          color: "var(--text-ink)",
        }}>Title</span>
        <span style={{
          position: "absolute",
          left: 18,
          top: 37,
          width: 1402,
          height: 18,
          fontFamily: "Hanken Grotesk",
          fontSize: 13,
          lineHeight: 1.350000023841858,
          color: "var(--text-muted)",
        }}>Body text</span>
      </div>
    </div>
  );
}
export default AnnotationNote;
