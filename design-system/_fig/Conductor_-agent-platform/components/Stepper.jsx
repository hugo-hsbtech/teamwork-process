// figma: 84:15 Stepper (2 variants)
const __variants = {
  "type=Drawer/Compact": { width: 242, padding: "4px 0px 4px 0px" },
};
const __vkey = (p) => "type=" + p.type;

export function Stepper(_p = {}) {
  const props = { ..._p, type: _p.type ?? "Takeover/Horizontal" };
  const __vs = __variants[__vkey(props)] ?? {};
  return (
    <div className={props.className} style={{
      width: 480,
      height: 30,
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "8px 0px 8px 0px",
      alignItems: "center",
      position: "relative",
      ...__vs, ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 9,
        width: 12,
        height: 12,
        borderRadius: "50%",
        backgroundColor: "var(--brand-tide)",
      }} />
      <div style={{
        position: "absolute",
        left: 24,
        top: 14,
        width: 28,
        height: 2,
        borderRadius: 2,
        backgroundColor: "var(--brand-tide)",
      }} />
      <div style={{
        position: "absolute",
        left: 64,
        top: 9,
        width: 12,
        height: 12,
        borderRadius: "50%",
        backgroundColor: "var(--brand-tide)",
      }} />
      <div style={{
        position: "absolute",
        left: 88,
        top: 14,
        width: 28,
        height: 2,
        borderRadius: 2,
        backgroundColor: "var(--border-hairline)",
      }} />
      <div style={{
        position: "absolute",
        left: 128,
        top: 9,
        width: 12,
        height: 12,
        borderRadius: "50%",
        backgroundColor: "var(--border-hairline)",
      }} />
      <div style={{
        position: "absolute",
        left: 152,
        top: 14,
        width: 28,
        height: 2,
        borderRadius: 2,
        backgroundColor: "var(--border-hairline)",
      }} />
      <div style={{
        position: "absolute",
        left: 192,
        top: 9,
        width: 12,
        height: 12,
        borderRadius: "50%",
        backgroundColor: "var(--border-hairline)",
      }} />
      <div style={{
        position: "absolute",
        left: 216,
        top: 14,
        width: 28,
        height: 2,
        borderRadius: 2,
        backgroundColor: "var(--border-hairline)",
      }} />
      <div style={{
        position: "absolute",
        left: 256,
        top: 9,
        width: 12,
        height: 12,
        borderRadius: "50%",
        backgroundColor: "var(--border-hairline)",
      }} />
      <div style={{
        position: "absolute",
        left: 280,
        top: 14.5,
        width: 40,
        height: 1,
        overflow: "hidden",
      }} />
      <span style={{
        position: "absolute",
        left: 332,
        top: 8,
        width: 58,
        height: 14,
        fontFamily: "Inter",
        fontSize: 12,
        lineHeight: "100%",
        color: "var(--text-muted)",
      }}>Step 2 of 5</span>
    </div>
  );
}
export default Stepper;
