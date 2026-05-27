// figma: 393:94 Input (shadcn·P&S)
export function InputShadcnPS(_p = {}) {
  const props = _p;
  return (
    <div className={props.className} style={{
      width: 280,
      height: 36,
      borderRadius: 8,
      backgroundColor: "var(--surface-sunken)",
      border: "1px solid var(--border-hairline)",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 195.33,
        height: 36,
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        gap: 65,
        padding: "4px 12px 4px 12px",
        alignItems: "center",
      }}>
        <div style={{
          position: "absolute",
          left: 12,
          top: 6,
          width: 171.33,
          height: 24,
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
        }}>
          <span style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 171.33,
            height: 24,
            fontFamily: "Hanken Grotesk",
            fontSize: 14,
            lineHeight: "24px",
            color: "var(--text-faint)",
          }}>Search agents, runs, tools…</span>
        </div>
      </div>
    </div>
  );
}
export default InputShadcnPS;
