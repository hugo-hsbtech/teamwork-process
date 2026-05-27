// figma: 396:74 Badge (shadcn·P&S) (7 variants)
const __variants = {
  "state=draft": { width: 59, backgroundColor: "var(--state-draft-wash)" },
  "state=staging": { width: 70, backgroundColor: "var(--state-staging-wash)" },
  "state=canary": { width: 70, backgroundColor: "var(--state-canary-wash)" },
  "state=running": { width: 73, backgroundColor: "var(--state-running-wash)" },
  "state=error": { width: 59, backgroundColor: "var(--state-error-wash)" },
  "state=paused": { width: 69, backgroundColor: "var(--state-paused-wash)" },
};
const __vkey = (p) => "state=" + p.state;

export function BadgeShadcnPS(_p = {}) {
  const props = { ..._p, state: _p.state ?? "production" };
  const __vs = __variants[__vkey(props)] ?? {};
  return (
    <div className={props.className} style={{
      width: 89,
      height: 22,
      borderRadius: 999,
      backgroundColor: "var(--state-production-wash)",
      display: "flex",
      flexDirection: "row",
      gap: 6,
      padding: "4px 10px 4px 8px",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      ...__vs, ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 8,
        top: 7.5,
        width: 7,
        height: 7,
        borderRadius: "50%",
        backgroundColor: "var(--state-production)",
      }} />
      <div style={{
        position: "absolute",
        left: 21,
        top: 4,
        width: 58,
        height: 14,
        display: "flex",
        flexDirection: "row",
        gap: 10,
        justifyContent: "center",
        alignItems: "center",
      }}>
        <span style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 58,
          height: 14,
          fontFamily: "Hanken Grotesk",
          fontWeight: 700,
          fontSize: 11,
          textAlign: "center",
          lineHeight: "14px",
          letterSpacing: "0.400px",
          color: "var(--state-production)",
        }}>Production</span>
      </div>
    </div>
  );
}
export default BadgeShadcnPS;
