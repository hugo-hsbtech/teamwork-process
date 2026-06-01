// data.jsx — mock content for the Intake · Submitter journey. Exposed on window.DATA.

// ---- Lifecycle states -------------------------------------------------
// Canonical pipeline (faithful to the Figma state-badge component set):
// Em Captura → Em Triagem → Em Discovery → Racionalização → RP Congelado
// → Em Execução → Entregue, plus Backlog and Arquivada.
// Colors/dots/washes lifted from the Figma symbols.
const STATES = {
  capture:         { label: "In Capture",      dot: "var(--slate-500)",  wash: "var(--slate-50)",   text: "var(--slate-500)" },
  triage:          { label: "In Triage",       dot: "var(--violet-500)", wash: "var(--violet-50)",  text: "var(--violet-500)" },
  discovery:       { label: "In Discovery",    dot: "var(--tide-700)",   wash: "var(--tide-50)",    text: "var(--tide-700)" },
  rationalization: { label: "Rationalization", dot: "var(--violet-500)", wash: "var(--violet-50)",  text: "var(--violet-500)" },
  frozen:          { label: "Frozen · v1",     dot: "var(--tide-500)",   wash: "var(--tide-50)",    text: "var(--tide-600)" },
  execution:       { label: "In Execution",    dot: "var(--tide-500)",   wash: "var(--tide-50)",    text: "var(--tide-600)" },
  delivered:       { label: "Delivered",       dot: "var(--green-600)",  wash: "var(--green-50)",   text: "var(--green-600)" },
  backlog:         { label: "Backlog",         dot: "var(--amber-600)",  wash: "var(--amber-50)",   text: "var(--amber-600)" },
  archived:        { label: "Archived",        dot: "var(--red-600)",    wash: "var(--red-50)",     text: "var(--red-600)" },
  // v2draft is not a pipeline stage — it's an editing sub-mode of a frozen demand.
  // It reuses the frozen badge; the "v2 draft" context is shown as a separate pill.
  v2draft:         { label: "Frozen · v1",     dot: "var(--tide-500)",   wash: "var(--tide-50)",    text: "var(--tide-600)" },
};

// Schedule / parking status — a SEPARATE axis from the pipeline stage.
// Shown as an extra pill, never as a lifecycle state.
const FLAGS = {
  late:      { label: "Late",      tone: "red",   icon: "clock" },
  postponed: { label: "Postponed", tone: "amber", icon: "snooze" },
  returned:  { label: "Returned",  tone: "amber", icon: "arrowLeft" },
  sent:      { label: "Sent",      tone: "tide",  icon: "send" },
};

// Submitter-owned stages vs downstream (handed-off) stages.
const SUBMITTER_STAGES = ["capture", "frozen", "v2draft"];
const DOWNSTREAM_STAGES = ["triage", "discovery", "rationalization", "execution", "delivered"];

// The end-to-end journey track shown after handoff.
const JOURNEY = [
  { key: "capture",         label: "Capture",        owner: "You" },
  { key: "frozen",          label: "v1 Published",   owner: "You" },
  { key: "triage",          label: "Triage",         owner: "Intake desk" },
  { key: "discovery",       label: "Discovery",      owner: "Ana Costa" },
  { key: "rationalization", label: "Rationalization",owner: "Portfolio" },
  { key: "execution",       label: "Execution",      owner: "Eng" },
  { key: "delivered",       label: "Delivered",      owner: "—" },
];

// Downstream events that land on the demand after v1 is published.
const DOWNSTREAM_EVENTS = [
  { id: "d1", who: "AC", state: "discovery",       text: "Ana Costa accepted the package into Discovery.", ago: "1h ago" },
  { id: "d2", who: "AC", state: "discovery",       text: "Opened 2 follow-up questions on partner IdP coverage.", ago: "1h ago" },
  { id: "d3", who: "AI", state: "triage",          text: "Triage routed this to the Payments squad (auto).", ago: "3h ago" },
];

// readiness color by pct
function readinessColor(pct) {
  if (pct >= 80) return "var(--green-600)";
  if (pct >= 50) return "var(--amber-500)";
  return "var(--red-600)";
}

// ---- People -----------------------------------------------------------
const USER = { name: "Hugo Seabra", initials: "HS", role: "COO · Payments", color: "rgb(18,110,128)" };
const PEOPLE = {
  HS: USER,
  AC: { name: "Ana Costa", initials: "AC", role: "Discovery Lead", color: "rgb(124,92,252)" },
  ML: { name: "Marcos Lima", initials: "ML", role: "Eng Manager", color: "rgb(204,120,92)" },
  CR: { name: "Carla Ribeiro", initials: "CR", role: "Product", color: "rgb(21,128,61)" },
  AI: { name: "Intake Copilot", initials: "AI", role: "Copilot", color: "var(--accent)" },
};

// ---- Demands list -----------------------------------------------------
const DEMANDS = [
  { id: "INT-2026-015", title: "B2B partner SSO/SAML authentication", by: "You", sources: 3, state: "capture",         readiness: 24,  updated: "4m",  focal: true },
  { id: "INT-2026-013", title: "Multi-currency wallet",               by: "Carla Ribeiro", sources: 6, state: "execution",       readiness: 86,  updated: "1d" },
  { id: "INT-2026-012", title: "Anti-fraud rules engine",             by: "Marcos Lima",   sources: 5, state: "rationalization", readiness: 72,  updated: "4d" },
  { id: "INT-2026-011", title: "Onboarding revamp",                   by: "Ana Costa",     sources: 4, state: "discovery",       readiness: 58,  updated: "12d", flag: "late" },
  { id: "INT-2026-014", title: "Webhook retry backoff",              by: "You",           sources: 2, state: "frozen",          readiness: 88,  updated: "6h" },
  { id: "INT-2026-010", title: "CDN repricing",                       by: "Júlia Mendes",  sources: 3, state: "execution",       readiness: 91,  updated: "22d" },
  { id: "INT-2026-009", title: "Partner BI reporting",                by: "Rafael Souza",  sources: 8, state: "delivered",       readiness: 100, updated: "1m" },
  { id: "INT-2026-008", title: "Chargeback automation",               by: "Ana Costa",     sources: 4, state: "triage",          readiness: 44,  updated: "1m" },
  { id: "INT-2026-007", title: "KYC document pipeline",               by: "Marcos Lima",   sources: 5, state: "capture",         readiness: 33,  updated: "2m",  flag: "postponed" },
  { id: "INT-2026-006", title: "Legacy SOAP gateway sunset",          by: "You",           sources: 2, state: "backlog",         readiness: 12,  updated: "3m" },
];

// ---- Focal demand detail ---------------------------------------------
const FOCAL = {
  id: "INT-2026-015",
  title: "B2B partner SSO/SAML authentication",
  desc: "B2B partners can't authenticate in the portal because their SAML doesn't match ours. ~18% drop-off in onboarding. Q3 closes in 8 weeks.",
  state: "capture",
  version: "v1 · DRAFT",
  deadline: "11 DAYS · JUN 12",
  assignee: USER,
  assignedAgo: "took it 2 days ago",
  readiness: 24,
  threshold: 80,
  delta: "+2%",
};

// ---- Audit log (immutable, server-timestamped, hash-chained) ---------
// Mirrors the Figma "Histórico · Auditoria" tab.
const AUDIT = [
  { id: "au1", ts: "2026-05-29 14:02:11Z", actor: "AI", event: "Copilot updated 2 artifacts from an audio note", hash: "a91f3c7" },
  { id: "au2", ts: "2026-05-29 13:48:55Z", actor: "HS", event: "Answered “Which SAML providers…” · cited slide 7", hash: "7d2e0b1" },
  { id: "au3", ts: "2026-05-29 11:20:03Z", actor: "HS", event: "Added source · CISO interview transcript", hash: "c40a8f9" },
  { id: "au4", ts: "2026-05-28 16:55:42Z", actor: "AI", event: "Copilot generated 5 questions from the Q3 deck", hash: "1b6d44e" },
  { id: "au5", ts: "2026-05-27 09:12:30Z", actor: "HS", event: "Created demand INT-2026-015", hash: "0f5c213" },
];

// ---- Tasks (the "needs you" focus list) -------------------------------
// kind: question | artifact ; urgency: high | mid | low ; confidence 0-1
const TASKS = [
  { id: "t1", kind: "question", urgency: "high", title: "How many B2B partners are in the onboarding queue today?", conf: 0.32, refId: "q1" },
  { id: "t2", kind: "question", urgency: "high", title: "What's the expected ROI if we solve this before Q3?", conf: 0.28, refId: "q2" },
  { id: "t3", kind: "artifact", urgency: "high", title: "Success metric", conf: 0.41, refId: "a4" },
  { id: "t4", kind: "artifact", urgency: "high", title: "Reach · total number impacted", conf: 0.38, refId: "a5" },
  { id: "t5", kind: "question", urgency: "mid",  title: "Which SAML providers do partners use most?", conf: 0.55, refId: "q3" },
  { id: "t6", kind: "artifact", urgency: "mid",  title: "Technical constraints", conf: 0.6, refId: "a6" },
  { id: "t7", kind: "question", urgency: "mid",  title: "Who is the executive sponsor?", conf: 0.62, refId: "q4" },
  { id: "t8", kind: "artifact", urgency: "mid",  title: "Risks & dependencies", conf: 0.58, refId: "a7" },
  { id: "t9", kind: "question", urgency: "low",  title: "Are there compliance / security requirements?", conf: 0.7, refId: "q5" },
  { id: "t10", kind: "artifact", urgency: "low", title: "Out of scope", conf: 0.74, refId: "a8" },
];

// ---- Questions (5) ----------------------------------------------------
const QUESTIONS = [
  { id: "q1", text: "How many B2B partners are in the onboarding queue today?", status: "open", hint: "Copilot found 14 in the CISO transcript — confirm with Sales.", suggestion: "≈14 partners in active onboarding (CISO interview). Likely the head of the funnel only." },
  { id: "q2", text: "What's the expected ROI if we solve this before Q3?", status: "open", hint: "No source covers ROI yet.", suggestion: "" },
  { id: "q3", text: "Which SAML providers do partners use most?", status: "open", hint: "Mentioned in the Q3 deck.", suggestion: "Okta and Azure AD account for most partner IdPs (payments-Q3 deck, slide 7)." },
  { id: "q4", text: "Who is the executive sponsor?", status: "open", hint: "", suggestion: "" },
  { id: "q5", text: "Are there compliance / security requirements?", status: "open", hint: "SOC2 referenced by CISO.", suggestion: "SAML assertions must stay SOC2-compliant; no PII in attributes (CISO)." },
];

// ---- Artifacts (8, 3 done) -------------------------------------------
const ARTIFACTS = [
  { id: "a1", name: "Problem statement", status: "done", body: "B2B partners cannot complete SSO into the portal because their SAML assertions don't map to our schema." },
  { id: "a2", name: "Context", status: "done", body: "Raised by Sales after Q2 partner reviews. ~18% onboarding drop-off attributed to the auth step." },
  { id: "a3", name: "Impact hypothesis", status: "done", body: "Fixing SAML mapping recovers most of the 18% drop-off and unblocks the Q3 partner cohort." },
  { id: "a4", name: "Success metric", status: "empty", body: "" },
  { id: "a5", name: "Reach · total number impacted", status: "empty", body: "" },
  { id: "a6", name: "Technical constraints", status: "empty", body: "" },
  { id: "a7", name: "Risks & dependencies", status: "empty", body: "" },
  { id: "a8", name: "Out of scope", status: "empty", body: "" },
];

// ---- Sources (3) ------------------------------------------------------
const SOURCES = [
  { id: "s1", type: "file", name: "payments-Q3-deck.pdf", meta: "PDF · 24 slides · added 2d ago", icon: "fileText" },
  { id: "s2", type: "transcript", name: "CISO interview transcript", meta: "Transcript · 38 min · added 2d ago", icon: "fileText" },
  { id: "s3", type: "link", name: "Onboarding funnel dashboard", meta: "Link · metabase.acme.io · added 1d ago", icon: "link" },
];

// ---- Contributions feed (Add information tab) -------------------------
const CONTRIBUTIONS = [
  { id: "c2", who: "HS", kind: "AUDIO", ago: "2m ago", text: "The B2B partners can't do SSO into our portal because their SAML doesn't match ours. Today we lose about 18% of new partners in onboarding because of it, and Sales is begging us to fix it before Q3.", aiExtracted: "Copilot updated Problem statement & Impact hypothesis from this note.", status: "approved" },
  { id: "c1", who: "HS", kind: "TEXT",  ago: "8m ago", text: "Created the demand. Priority is the Q3 partner cohort — roughly 14 partners are waiting.", aiExtracted: "Copilot pre-filled Context artifact and raised confidence on Reach.", status: "pending" },
];

// ---- Copilot chat -----------------------------------------------------
const CHAT = [
  { id: "m1", role: "user", who: "HS", ago: "6m ago", text: "I want to think harder about REACH. How many B2B partners actually enter this queue?" },
  { id: "m2", role: "ai", who: "AI", ago: "5m ago", text: "I looked at the payments-Q3 deck and the CISO transcript: there are 14 partners mentioned in active onboarding. But that's only the head of the funnel. Worth talking to Sales — they own the pipeline. Want me to draft a request to Ana Costa?", cites: ["payments-Q3-deck.pdf", "CISO interview transcript"], chips: ["Draft the request", "Fill \"Reach\" with 14", "Show the source"] },
];

// Suggested starter prompts shown on the fullscreen copilot page.
const CHAT_SUGGESTIONS = [
  { icon: "trendingUp", label: "Estimate the ROI of fixing this before Q3" },
  { icon: "users", label: "Who should I talk to about the partner pipeline?" },
  { icon: "box", label: "Draft the Success metric artifact" },
  { icon: "help", label: "Which questions are blocking Discovery?" },
];

// Scripted copilot replies, matched loosely by keyword. Falls back to default.
const SCRIPTED_REPLIES = [
  { match: /roi|return|revenue|payback/i, text: "No source covers ROI directly yet. From the Q3 deck, partner ARR averages ~$42k. If we recover the 18% drop-off across 14 partners, that's roughly $105k of at-risk ARR this quarter. I can draft this into the \"Success metric\" artifact as a hypothesis — want me to?", cites: ["payments-Q3-deck.pdf"], chips: ["Draft into Success metric", "Add a source for ROI"] },
  { match: /saml|provider|okta|azure|idp/i, text: "The Q3 deck (slide 7) lists Okta and Azure AD as the dominant partner IdPs, with two partners on Ping. I can answer \"Which SAML providers…\" with that and cite the slide. Confirm?", cites: ["payments-Q3-deck.pdf"], chips: ["Answer the question", "Open slide 7"] },
  { match: /reach|how many|partners|queue|funnel/i, text: "14 partners are named in active onboarding (CISO transcript). That's the head of the funnel only — Sales' pipeline likely adds more. Shall I fill \"Reach\" with 14 as a floor and flag it for Sales confirmation?", cites: ["CISO interview transcript"], chips: ["Fill \"Reach\" with 14", "Draft request to Sales"] },
  { match: /sponsor|exec|owner/i, text: "The CISO is the most senior name across your sources, but no explicit sponsor is stated. I'd suggest confirming with your VP. Want me to leave the \"Executive sponsor\" question open with that note?", cites: ["CISO interview transcript"], chips: ["Add the note"] },
  { match: /risk|depend|security|compliance|soc2/i, text: "The CISO flags that SAML assertions must remain SOC2-compliant and carry no PII in attributes. That's a real dependency on the security team. I can populate \"Risks & dependencies\" with it.", cites: ["CISO interview transcript"], chips: ["Fill Risks & dependencies"] },
];
const DEFAULT_REPLY = { text: "Got it. I've noted that against the demand. Based on your three sources, the biggest gaps right now are the Success metric and Reach — those two unlock the most readiness toward the 80% Discovery threshold. Want me to take a first pass at either?", chips: ["Draft Success metric", "Estimate Reach"] };

// ---- Activity log -----------------------------------------------------
const ACTIVITY = [
  { id: "ac1", ago: "4m ago", who: "AI", text: "Copilot updated 2 artifacts from your audio note", kind: "ai" },
  { id: "ac2", ago: "12m ago", who: "HS", text: "You added a source · CISO interview transcript", kind: "source" },
  { id: "ac3", ago: "2h ago", who: "AI", text: "Copilot generated 5 questions from the Q3 deck", kind: "ai" },
  { id: "ac4", ago: "2d ago", who: "HS", text: "You created demand INT-2026-015", kind: "create" },
];

// ---- Notifications ----------------------------------------------------
const NOTIFICATIONS = [
  { id: "n1", unread: true,  who: "AI", text: "Copilot answered 1 question and raised confidence on \"Reach\".", ago: "4m" },
  { id: "n2", unread: true,  who: "AC", text: "Ana Costa requested more detail on the success metric before Discovery.", ago: "1h" },
  { id: "n3", unread: false, who: "ML", text: "Marcos Lima mentioned you on INT-2026-012.", ago: "1d" },
];

// ---- Dashboard aggregates --------------------------------------------
const DASH = {
  needsYou: 10,
  inFlight: 4,
  awaitingOthers: 2,
  thisWeek: 3,
};

// ---- Indicators / KPIs -----------------------------------------------
// Each KPI: value, unit, delta (signed), deltaGood (is up good?), 7-pt spark trend.
const KPIS = [
  { id: "open",      label: "OPEN DEMANDS",      value: 7,   unit: "",     delta: "+2",    good: true,  trend: [4, 5, 5, 6, 6, 5, 7] },
  { id: "needs",     label: "NEEDS YOU",         value: 10,  unit: "items",delta: "-3",    good: true,  trend: [16, 15, 14, 13, 12, 13, 10] },
  { id: "readiness", label: "AVG READINESS",     value: 64,  unit: "%",    delta: "+6%",   good: true,  trend: [48, 51, 53, 55, 58, 60, 64] },
  { id: "cycle",     label: "AVG DAYS IN CAPTURE",value: 5.2,unit: "d",    delta: "-0.8d", good: true,  trend: [7.1, 6.8, 6.4, 6.0, 5.8, 5.6, 5.2], dec: 1 },
  { id: "moved",     label: "MOVED TO DISCOVERY",value: 7,   unit: "/30d", delta: "+3",    good: true,  trend: [2, 3, 4, 4, 5, 6, 7] },
];

// Weekly intake throughput — created vs moved on to Discovery.
const THROUGHPUT = [
  { label: "W1", created: 3, moved: 1 },
  { label: "W2", created: 4, moved: 2 },
  { label: "W3", created: 2, moved: 3 },
  { label: "W4", created: 5, moved: 2 },
  { label: "W5", created: 4, moved: 4 },
  { label: "W6", created: 6, moved: 3 },
  { label: "W7", created: 3, moved: 5 },
  { label: "W8", created: 5, moved: 4 },
];

// Readiness distribution buckets (count of demands).
const READINESS_DIST = [
  { label: "0–25%",   value: 1, color: "var(--red-600)" },
  { label: "25–50%",  value: 2, color: "var(--amber-500)" },
  { label: "50–75%",  value: 2, color: "var(--amber-600)" },
  { label: "75–100%", value: 3, color: "var(--green-600)" },
];

// On-time indicator
const ONTIME = { rate: 82, onTrack: 5, atRisk: 2, late: 1 };

window.DATA = {
  STATES, FLAGS, SUBMITTER_STAGES, DOWNSTREAM_STAGES, JOURNEY, DOWNSTREAM_EVENTS,
  readinessColor, USER, PEOPLE, DEMANDS, FOCAL, AUDIT, TASKS, QUESTIONS,
  ARTIFACTS, SOURCES, CONTRIBUTIONS, CHAT, CHAT_SUGGESTIONS, SCRIPTED_REPLIES, DEFAULT_REPLY,
  ACTIVITY, NOTIFICATIONS, DASH, KPIS, THROUGHPUT, READINESS_DIST, ONTIME,
};
