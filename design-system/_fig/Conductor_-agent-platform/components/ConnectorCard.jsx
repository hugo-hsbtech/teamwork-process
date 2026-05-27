// figma: 91:49 Connector card (2 variants)
const __variants = {
  "selected=true": { backgroundColor: "var(--brand-tide-wash)", border: "1.500px solid var(--brand-tide)" },
};
const __vkey = (p) => "selected=" + p.selected;

export function ConnectorCard(_p = {}) {
  const props = { ..._p, selected: _p.selected ?? "false" };
  const __vs = __variants[__vkey(props)] ?? {};
  return (
    <div className={props.className} style={{
      width: 320,
      height: 72,
      borderRadius: 12,
      backgroundColor: "var(--surface-card)",
      border: "1px solid var(--border-hairline)",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "16px 16px 16px 16px",
      alignItems: "center",
      position: "relative",
      ...__vs, ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 16,
        top: 18,
        width: 36,
        height: 36,
        overflow: "hidden",
        borderRadius: 8,
        backgroundColor: "var(--surface-sunken)",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <span style={{
          position: "absolute",
          left: 9,
          top: 7.5,
          width: 18,
          height: 21,
          fontFamily: "Hanken Grotesk",
          fontSize: 16,
          lineHeight: "100%",
          color: "var(--text-muted)",
        }}>◆</span>
      </div>
      <div style={{
        position: "absolute",
        left: 64,
        top: 16,
        width: 240,
        height: 40,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}>
        <span style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 240,
          height: 20,
          fontFamily: "Inter",
          fontSize: 12,
          lineHeight: "100%",
          color: "var(--text-ink)",
        }}>Slack</span>
        <span style={{
          position: "absolute",
          left: 0,
          top: 22,
          width: 240,
          height: 18,
          fontFamily: "Inter",
          fontSize: 12,
          lineHeight: "100%",
          color: "var(--text-muted)",
        }}>Post messages to channels and DMs</span>
      </div>
    </div>
  );
}
export default ConnectorCard;
