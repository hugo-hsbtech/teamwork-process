// figma: 21:14 Provider Chip (4 variants)
const __variants = {
  "provider=OpenAI": { width: 76 },
  "provider=Gemini": { width: 74 },
  "provider=Grok": { width: 62 },
};
const __vkey = (p) => "provider=" + p.provider;

export function ProviderChip(_p = {}) {
  const props = { ..._p, provider: _p.provider ?? "Claude" };
  const __vs = __variants[__vkey(props)] ?? {};
  return (
    <div className={props.className} style={{
      width: 75,
      height: 24,
      borderRadius: 999,
      backgroundColor: "var(--surface-sunken)",
      border: "1px solid var(--border-hairline)",
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
        top: 8,
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: "var(--provider-claude-2)",
      }} />
      <span style={{
        position: "absolute",
        left: 22,
        top: 4,
        width: 43,
        height: 16,
        fontFamily: "Hanken Grotesk",
        fontWeight: 500,
        fontSize: 12,
        lineHeight: "100%",
        color: "var(--text-muted)",
      }}>Claude</span>
    </div>
  );
}
export default ProviderChip;
