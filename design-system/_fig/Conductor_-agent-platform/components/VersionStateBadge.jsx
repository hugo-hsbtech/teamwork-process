import { BadgeShadcnPS } from './BadgeShadcnPS.jsx';

// figma: 20:23 Version State Badge (7 variants)
const __variants = {
  "state=Staging": { width: 70 },
  "state=Canary": { width: 70 },
  "state=Production": { width: 89 },
  "state=Running": { width: 73 },
  "state=Failed": { width: 63 },
  "state=Paused": { width: 69 },
};
const __vkey = (p) => "state=" + p.state;

export function VersionStateBadge(_p = {}) {
  const props = { ..._p, state: _p.state ?? "Draft" };
  const __vs = __variants[__vkey(props)] ?? {};
  return (
    <div className={props.className} style={{
      width: 59,
      height: 22,
      borderRadius: 999,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
      ...__vs, ...props.style,
    }}>
      <BadgeShadcnPS style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 59,
          height: 22,
        }} />
    </div>
  );
}
export default VersionStateBadge;
