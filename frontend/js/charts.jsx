// charts.jsx — dashboard charts powered by Chart.js 4. window.Charts
// Chart.js is loaded via CDN as window.Chart before this script runs.

const { useRef: useRefC, useEffect: useEffectC } = React;

// ── CSS variable resolver (Chart.js renders to Canvas — no CSS vars) ──
function rv(color) {
  if (!color || !color.startsWith("var(")) return color;
  const name = color.slice(4, -1).trim();
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || color;
}

// ── alpha helper — works for hex (#rrggbb), rgb(...) and rgba(...) ─────
// (tokens resolve to rgb(...) strings, so we can't just append a hex suffix)
function withAlpha(color, a) {
  const c = rv(color);
  if (!c) return c;
  if (c.startsWith("#")) {
    const h = c.slice(1);
    const n = h.length === 3 ? h.split("").map(x => x + x).join("") : h;
    const r = parseInt(n.slice(0, 2), 16), g = parseInt(n.slice(2, 4), 16), b = parseInt(n.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }
  const nums = c.match(/[\d.]+/g);
  if (nums && nums.length >= 3) return `rgba(${nums[0]},${nums[1]},${nums[2]},${a})`;
  return c;
}

// ── shared Chart.js defaults ──────────────────────────────────────────
const FONT_FAMILY = "Inter, system-ui, sans-serif";
const MUTED  = "rgb(107,103,94)";
const FAINT  = "rgb(156,151,140)";
const GRID   = "rgb(231,228,219)";

const baseFont  = { family: FONT_FAMILY, size: 11 };
const gridStyle = { color: GRID, drawBorder: false };
const noTicks   = { display: false };

function tooltipStyle(tooltip) {
  Object.assign(tooltip, {
    backgroundColor: "#fff",
    borderColor: GRID,
    borderWidth: 1,
    titleColor: FAINT,
    bodyColor: MUTED,
    titleFont: { ...baseFont, size: 10 },
    bodyFont: { ...baseFont },
    padding: 10,
    cornerRadius: 8,
    boxPadding: 4,
    displayColors: true,
    usePointStyle: true,
    pointStyle: "rect",
  });
}

// ── safe mount — never let a chart config error blank the app ─────────
function safeMount(ref, inst, cfg) {
  if (!ref.current || !window.Chart) return;
  try {
    inst.current = new window.Chart(ref.current, cfg);
  } catch (e) {
    console.warn("[charts] render skipped:", e && e.message);
  }
}

// ── Grouped bars (e.g. Created vs Moved) ─────────────────────────────
function GroupedBars({ data, series, height = 170 }) {
  const ref = useRefC(null);
  const inst = useRefC(null);

  useEffectC(() => {
    if (!ref.current) return;
    if (inst.current) inst.current.destroy();

    const cfg = {
      type: "bar",
      data: {
        labels: data.map(d => d.label),
        datasets: series.map(s => ({
          label: s.label,
          data: data.map(d => d[s.key]),
          backgroundColor: rv(s.color),
          borderRadius: 4,
          borderSkipped: false,
          maxBarThickness: 20,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 700, easing: "easeOutQuart" },
        plugins: {
          legend: { position: "bottom", labels: { font: baseFont, color: MUTED, usePointStyle: true, pointStyle: "rect", boxWidth: 8, padding: 14 } },
          tooltip: { callbacks: {}, },
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: baseFont, color: FAINT }, border: { display: false } },
          y: { grid: gridStyle, ticks: { font: baseFont, color: FAINT, maxTicksLimit: 5 }, border: { display: false } },
        },
      },
    };
    tooltipStyle(cfg.options.plugins.tooltip);
    safeMount(ref, inst, cfg);
    return () => inst.current && inst.current.destroy();
  }, [JSON.stringify(data), JSON.stringify(series)]);

  return (
    <div style={{ position: "relative", height }}>
      <canvas ref={ref} />
    </div>
  );
}

// ── Donut (state distribution) ────────────────────────────────────────
function Donut({ segments, size = 132, stroke = 18, centerLabel, centerSub }) {
  const ref = useRefC(null);
  const inst = useRefC(null);
  const cutout = Math.round(((size / 2 - stroke) / (size / 2)) * 100) + "%";

  useEffectC(() => {
    if (!ref.current) return;
    if (inst.current) inst.current.destroy();

    const cfg = {
      type: "doughnut",
      data: {
        labels: segments.map(s => s.label),
        datasets: [{
          data: segments.map(s => s.value),
          backgroundColor: segments.map(s => rv(s.color)),
          borderWidth: 2,
          borderColor: "#fff",
          hoverBorderColor: "#fff",
          hoverOffset: 4,
        }],
      },
      options: {
        responsive: false,
        cutout,
        animation: { duration: 800, animateRotate: true, animateScale: false },
        plugins: {
          legend: { display: false },
          tooltip: {},
        },
      },
    };
    tooltipStyle(cfg.options.plugins.tooltip);
    safeMount(ref, inst, cfg);
    return () => inst.current && inst.current.destroy();
  }, [JSON.stringify(segments)]);

  return (
    <div style={{ position: "relative", width: size, height: size, flex: "none" }}>
      <canvas ref={ref} width={size} height={size} />
      {centerLabel != null && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 2, pointerEvents: "none" }}>
          <span style={{ fontFamily: "Hanken Grotesk, sans-serif", fontWeight: 800,
            fontSize: size * 0.26, color: "rgb(28,27,24)", lineHeight: 1 }}>{centerLabel}</span>
          {centerSub && <span style={{ fontFamily: FONT_FAMILY, fontSize: 10, color: FAINT }}>{centerSub}</span>}
        </div>
      )}
    </div>
  );
}

// ── Horizontal bars (readiness distribution) ──────────────────────────
function HBars({ data, valueFmt }) {
  const ref = useRefC(null);
  const inst = useRefC(null);
  const h = data.length * 40 + 24;

  useEffectC(() => {
    if (!ref.current) return;
    if (inst.current) inst.current.destroy();

    const cfg = {
      type: "bar",
      data: {
        labels: data.map(d => d.label),
        datasets: [{
          data: data.map(d => d.value),
          backgroundColor: data.map(d => rv(d.color || "var(--accent)")),
          borderRadius: 4,
          borderSkipped: false,
          maxBarThickness: 14,
        }],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 700, easing: "easeOutQuart" },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => " " + (valueFmt ? valueFmt(ctx.parsed.x) : ctx.parsed.x),
            },
          },
          datalabels: { display: false },
        },
        scales: {
          x: { grid: gridStyle, ticks: { font: baseFont, color: FAINT, maxTicksLimit: 4 }, border: { display: false } },
          y: { grid: { display: false }, ticks: { font: baseFont, color: MUTED }, border: { display: false } },
        },
      },
    };
    tooltipStyle(cfg.options.plugins.tooltip);
    safeMount(ref, inst, cfg);
    return () => inst.current && inst.current.destroy();
  }, [JSON.stringify(data)]);

  return (
    <div style={{ position: "relative", height: h }}>
      <canvas ref={ref} />
    </div>
  );
}

// ── Sparkline (area line, no axes — lightweight) ──────────────────────
function Sparkline({ data, width = 150, height = 32, color = "var(--accent)", animateKey }) {
  const ref = useRefC(null);
  const inst = useRefC(null);
  const resolvedColor = rv(color);

  useEffectC(() => {
    if (!ref.current) return;
    if (inst.current) inst.current.destroy();

    const cfg = {
      type: "line",
      data: {
        labels: data.map((_, i) => i),
        datasets: [{
          data,
          borderColor: resolvedColor,
          borderWidth: 1.5,
          fill: true,
          backgroundColor: ctx => {
            const grad = ctx.chart.ctx.createLinearGradient(0, 0, 0, height);
            grad.addColorStop(0, withAlpha(resolvedColor, 0.2));
            grad.addColorStop(1, withAlpha(resolvedColor, 0));
            return grad;
          },
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 0,
        }],
      },
      options: {
        responsive: false,
        animation: { duration: 900 },
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } },
      },
    };
    safeMount(ref, inst, cfg);
    return () => inst.current && inst.current.destroy();
  }, [animateKey]);

  return <canvas ref={ref} width={width} height={height} />;
}

window.Charts = { GroupedBars, Donut, HBars, Sparkline };
