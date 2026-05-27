// figma: 92:48 Progress-step row (3 variants)
const __variants = {

};
const __vkey = (p) => "state=" + p.state;

export function ProgressStepRow(_p = {}) {
  const props = { ..._p, state: _p.state ?? "done" };
  const __vs = __variants[__vkey(props)] ?? {};
  return (
    <div className={props.className} style={{
      width: 360,
      height: 40,
      borderRadius: 8,
      display: "flex",
      flexDirection: "row",
      gap: 10,
      padding: "10px 12px 10px 12px",
      alignItems: "center",
      position: "relative",
      ...__vs, ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 12,
        top: 15,
        width: 10,
        height: 10,
        borderRadius: "50%",
        backgroundColor: "var(--state-production)",
      }} />
      <span style={{
        position: "absolute",
        left: 32,
        top: 10,
        width: 241,
        height: 20,
        fontFamily: "Inter",
        fontSize: 12,
        lineHeight: "100%",
        color: "var(--text-ink)",
      }}>Validate config</span>
      <span style={{
        position: "absolute",
        left: 283,
        top: 12,
        width: 65,
        height: 16,
        fontFamily: "Inter",
        fontSize: 12,
        lineHeight: "100%",
        color: "var(--text-muted)",
      }}>12 checks</span>
    </div>
  );
}
export default ProgressStepRow;
