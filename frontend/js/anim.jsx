// anim.jsx — motion utilities: count-up numbers, animated sparkline. window.Anim
const { useState: useStateAn, useEffect: useEffectAn, useRef: useRefAn } = React;

// Count from the previous shown value to `target` with easeOutCubic.
// rAF for smoothness + a timeout fallback so the final value is correct even
// if rAF is throttled (hidden tab / offscreen iframe).
function useCountUp(target, duration = 850) {
  const [val, setVal] = useStateAn(0);
  const valRef = useRefAn(0);
  useEffectAn(() => {
    const from = valRef.current;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      const cur = from + (target - from) * e;
      valRef.current = cur; setVal(cur);
      if (p < 1) raf = requestAnimationFrame(tick);
      else { valRef.current = target; setVal(target); }
    };
    raf = requestAnimationFrame(tick);
    const fb = setTimeout(() => { valRef.current = target; setVal(target); }, duration + 320);
    return () => { cancelAnimationFrame(raf); clearTimeout(fb); };
  }, [target, duration]);
  return val;
}

function AnimatedNumber({ value, duration, decimals = 0, suffix = "", prefix = "" }) {
  const v = useCountUp(value, duration);
  const f = decimals ? v.toFixed(decimals) : Math.round(v).toString();
  return prefix + f + suffix;
}

// Sparkline that draws itself in (stroke-dashoffset) with an area wash + end dot.
function Sparkline({ data, width = 132, height = 40, color = "var(--accent)", duration = 1000, animateKey }) {
  const ref = useRefAn(null);
  const dotRef = useRefAn(null);
  const max = Math.max(...data), min = Math.min(...data);
  const span = (max - min) || 1;
  const pad = 3;
  const pts = data.map((d, i) => [
    pad + (i / (data.length - 1)) * (width - pad * 2),
    pad + (1 - (d - min) / span) * (height - pad * 2),
  ]);
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = `M ${pts[0][0].toFixed(1)} ${height} ` + pts.map(p => `L ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ") + ` L ${pts[pts.length-1][0].toFixed(1)} ${height} Z`;
  const last = pts[pts.length - 1];

  useEffectAn(() => {
    const el = ref.current; if (!el) return;
    let len = 0; try { len = el.getTotalLength(); } catch (e) { len = width * 1.4; }
    el.style.transition = "none";
    el.style.strokeDasharray = len; el.style.strokeDashoffset = len;
    el.getBoundingClientRect();
    el.style.transition = `stroke-dashoffset ${duration}ms var(--ease-out)`;
    requestAnimationFrame(() => { el.style.strokeDashoffset = 0; });
    if (dotRef.current) {
      dotRef.current.style.transition = "none"; dotRef.current.style.opacity = 0;
      dotRef.current.getBoundingClientRect();
      dotRef.current.style.transition = `opacity 300ms ${duration * 0.7}ms ease`;
      requestAnimationFrame(() => { if (dotRef.current) dotRef.current.style.opacity = 1; });
    }
  }, [line, duration, animateKey]);

  const gid = "sg" + Math.abs(data.join().split("").reduce((a, c) => a + c.charCodeAt(0), 0));
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} preserveAspectRatio="none"
      style={{ display: "block", width: "100%", maxWidth: width, height: height, overflow: "visible" }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} stroke="none" />
      <path ref={ref} d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <circle ref={dotRef} cx={last[0]} cy={last[1]} r="3" fill={color} />
    </svg>
  );
}

// Bars that grow from 0 on mount (and re-grow when `value` changes).
function useGrow(value, deps) {
  const [w, setW] = useStateAn(0);
  useEffectAn(() => { const id = requestAnimationFrame(() => setW(value)); const fb = setTimeout(() => setW(value), 400); return () => { cancelAnimationFrame(id); clearTimeout(fb); }; }, [value]);
  return w;
}

window.Anim = { useCountUp, AnimatedNumber, Sparkline, useGrow };
