// figma: 89:46 Result chip (3 variants)
const __variants = {
  "state=error": { width: 64, backgroundColor: "var(--state-error-wash)" },
  "state=pending": { width: 74, backgroundColor: "var(--state-running-wash)" },
};
const __vkey = (p) => "state=" + p.state;

export function ResultChip(_p = {}) {
  const props = { ..._p, state: _p.state ?? "success" };
  const __vs = __variants[__vkey(props)] ?? {};
  return (
    <div className={props.className} style={{
      width: 90,
      height: 22,
      borderRadius: 999,
      backgroundColor: "var(--state-production-wash)",
      display: "flex",
      flexDirection: "row",
      gap: 6,
      padding: "4px 10px 4px 8px",
      alignItems: "center",
      position: "relative",
      ...__vs, ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 8,
        top: 7,
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: "var(--state-production)",
      }} />
      <span style={{
        position: "absolute",
        left: 22,
        top: 4,
        width: 58,
        height: 14,
        fontFamily: "Inter",
        fontSize: 12,
        lineHeight: "100%",
        color: "var(--text-ink)",
      }}>Connected</span>
    </div>
  );
}
export default ResultChip;
