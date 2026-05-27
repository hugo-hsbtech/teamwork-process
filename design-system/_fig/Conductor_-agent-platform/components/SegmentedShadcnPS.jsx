// figma: 398:81 Segmented (shadcn·P&S)
export function SegmentedShadcnPS(_p = {}) {
  const props = _p;
  return (
    <div className={props.className} style={{
      width: 160,
      height: 36,
      borderRadius: 8,
      backgroundColor: "var(--surface-card)",
      display: "flex",
      flexDirection: "row",
      padding: "3px 3px 3px 3px",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 3,
        top: 3.5,
        width: 77,
        height: 29,
        borderRadius: 8,
        backgroundColor: "var(--brand-tide)",
        border: "1px solid rgb(229,229,229)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: "4px 8px 4px 8px",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <div style={{
          position: "absolute",
          left: 17.5,
          top: 4.5,
          width: 42,
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
            width: 42,
            height: 20,
            fontFamily: "Hanken Grotesk",
            fontWeight: 700,
            fontSize: 14,
            lineHeight: "20px",
            color: "var(--text-on-brand)",
          }}>Blocks</span>
        </div>
      </div>
      <div style={{
        position: "absolute",
        left: 80,
        top: 3.5,
        width: 77,
        height: 29,
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: "4px 8px 4px 8px",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <div style={{
          position: "absolute",
          left: 21,
          top: 4.5,
          width: 35,
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
            width: 35,
            height: 20,
            fontFamily: "Hanken Grotesk",
            fontWeight: 700,
            fontSize: 14,
            lineHeight: "20px",
            color: "var(--text-muted)",
          }}>Table</span>
        </div>
      </div>
    </div>
  );
}
export default SegmentedShadcnPS;
