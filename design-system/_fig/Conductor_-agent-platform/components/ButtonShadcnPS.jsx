// figma: 392:77 Button (shadcn·P&S) (2 variants)
const __variants = {
  "variant=secondary": { backgroundColor: "revert", border: "1px solid var(--border-hairline)" },
};
const __vkey = (p) => "variant=" + p.variant;

export function ButtonShadcnPS(_p = {}) {
  const props = { ..._p, variant: _p.variant ?? "primary" };
  const __vs = __variants[__vkey(props)] ?? {};
  return (
    <div className={props.className} style={{
      width: 95,
      height: 36,
      borderRadius: 8,
      backgroundColor: "var(--brand-tide)",
      display: "flex",
      flexDirection: "row",
      gap: 6,
      padding: "8px 14px 8px 14px",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      ...__vs, ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 14,
        top: 8,
        width: 67,
        height: 20,
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
          width: 67,
          height: 20,
          fontFamily: "Hanken Grotesk",
          fontWeight: 700,
          fontSize: 14,
          lineHeight: "20px",
          color: "var(--text-on-brand)",
        }}>New agent</span>
      </div>
    </div>
  );
}
export default ButtonShadcnPS;
