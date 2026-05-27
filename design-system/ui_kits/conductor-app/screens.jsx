/* Conductor UI kit — screens. */

const { useState: useStateScreens } = React;

const AGENTS_DATA = [
  { name: "Support Router", identifier: "agent.support.router", description: "Classifies each user turn and routes to the right specialist chatbot.", provider: "Claude", state: "production", type: "Chatbot", version: 7, when: "2m ago" },
  { name: "Payments Specialist", identifier: "agent.support.payments", description: "Handles billing, refunds, and subscription questions with KB lookup.", provider: "Claude", state: "production", type: "Chatbot", version: 4, when: "5m ago" },
  { name: "Technical Specialist", identifier: "agent.support.technical", description: "Resolves API & integration questions. Falls back to human on low confidence.", provider: "Claude", state: "staging", type: "Chatbot", version: 12, when: "1h ago" },
  { name: "Onboarding Concierge", identifier: "agent.onboarding.concierge", description: "Guides new workspaces through namespace + connector setup.", provider: "OpenAI", state: "running", type: "Workflow", version: 3, when: "running" },
  { name: "Churn Predictor", identifier: "agent.ops.churn", description: "Nightly scoring run against the past 30 days of conversation memory.", provider: "Gemini", state: "canary", type: "Workflow", version: 9, when: "8h ago" },
  { name: "Knowledge Refresh", identifier: "agent.kb.refresh", description: "Re-embeds the docs corpus when a doc changes; emits to KB index.", provider: "OpenAI", state: "paused", type: "Workflow", version: 22, when: "3d ago" },
  { name: "Eval Replayer", identifier: "agent.eval.replayer", description: "Replays the last 1k production turns against a candidate version.", provider: "Grok", state: "draft", type: "Workflow", version: 1, when: "drafted today" },
  { name: "Reflex Triage", identifier: "agent.support.triage", description: "First-touch triage; tags urgency before the router classifies.", provider: "Claude", state: "error", type: "Chatbot", version: 6, when: "errored 12m ago" },
];

// ---------- AgentsScreen --------------------------------------------
function AgentsScreen({ onOpenDeploy, onOpenAddMCP }) {
  const [view, setView] = useStateScreens("blocks");
  return (
    <div>
      <PageHeader
        title="Agents"
        sub="8 agents · 3 chatbots · 5 workflows · acme-support"
        actions={
          <React.Fragment>
            <ViewToggle value={view} onChange={setView} />
            <Button variant="ghost" leadingIcon="plus" onClick={onOpenAddMCP}>Add MCP</Button>
            <Button variant="primary" leadingIcon="sparkles" onClick={onOpenDeploy}>New agent</Button>
          </React.Fragment>
        }
      />

      <FilterBar chips={["Chatbot ✕", "Production ✕"]} />

      <div style={{ padding: "20px 32px 80px" }}>
        {view === "blocks" ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 16,
          }}>
            {AGENTS_DATA.map(a => (
              <AgentCard key={a.identifier} {...a} />
            ))}
          </div>
        ) : (
          <AgentsTable agents={AGENTS_DATA} />
        )}
      </div>
    </div>
  );
}

function AgentsTable({ agents }) {
  const cell = { padding: "12px 16px", verticalAlign: "middle" };
  const head = { ...cell, font: "500 11px/1 var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-faint)", textAlign: "left", borderBottom: "1px solid var(--border-hairline)" };
  return (
    <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-hairline)", borderRadius: 12, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead><tr>
          <th style={head}>Name</th>
          <th style={head}>Identifier</th>
          <th style={head}>Provider</th>
          <th style={head}>State</th>
          <th style={head}>Version</th>
          <th style={head}>Updated</th>
        </tr></thead>
        <tbody>
          {agents.map((a, i) => (
            <tr key={a.identifier} style={{ borderBottom: i < agents.length - 1 ? "1px solid var(--border-hairline)" : "none" }}>
              <td style={{ ...cell, font: "600 13px/1 var(--font-display)", color: "var(--text-ink)" }}>{a.name}</td>
              <td style={{ ...cell, font: "400 12px/1 var(--font-mono)", color: "var(--text-muted)" }}>{a.identifier}</td>
              <td style={cell}><ProviderChip provider={a.provider} /></td>
              <td style={cell}><Badge state={a.state} pulse={a.state === "running"} /></td>
              <td style={{ ...cell, font: "400 12px/1 var(--font-mono)", color: "var(--text-muted)" }}>v{a.version}</td>
              <td style={{ ...cell, font: "400 12px/1 var(--font-sans)", color: "var(--text-muted)" }}>{a.when}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------- RunsScreen ----------------------------------------------
const RUNS_DATA = [
  { id: "run_3p9kZ", agent: "agent.support.router", started: "12:42:18", duration: "1.2s", turns: 4, status: "success" },
  { id: "run_3p9kY", agent: "agent.support.payments", started: "12:42:11", duration: "0.9s", turns: 2, status: "success" },
  { id: "run_3p9kX", agent: "agent.support.router", started: "12:41:55", duration: "3.4s", turns: 7, status: "success" },
  { id: "run_3p9kW", agent: "agent.support.triage", started: "12:41:40", duration: "—",   turns: 0, status: "error" },
  { id: "run_3p9kV", agent: "agent.onboarding.concierge", started: "12:41:22", duration: "running", turns: 1, status: "pending" },
  { id: "run_3p9kU", agent: "agent.support.router", started: "12:40:58", duration: "1.0s", turns: 3, status: "success" },
];

function RunsScreen() {
  const cell = { padding: "12px 16px", verticalAlign: "middle" };
  const head = { ...cell, font: "500 11px/1 var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-faint)", textAlign: "left", borderBottom: "1px solid var(--border-hairline)" };
  return (
    <div>
      <PageHeader
        title="Runs"
        sub="Live · last 1,000 turns · 99.2% success · p50 1.1s"
        actions={
          <React.Fragment>
            <Button variant="ghost" leadingIcon="filter">Filter</Button>
            <Button variant="ghost" leadingIcon="download">Export</Button>
          </React.Fragment>
        }
      />
      <div style={{ padding: "12px 32px 80px" }}>
        <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-hairline)", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>
              <th style={head}>Run</th>
              <th style={head}>Agent</th>
              <th style={head}>Started</th>
              <th style={head}>Duration</th>
              <th style={head}>Turns</th>
              <th style={head}>Status</th>
            </tr></thead>
            <tbody>
              {RUNS_DATA.map((r, i) => (
                <tr key={r.id} style={{ borderBottom: i < RUNS_DATA.length - 1 ? "1px solid var(--border-hairline)" : "none" }}>
                  <td style={{ ...cell, font: "400 12px/1 var(--font-mono)", color: "var(--text-ink)" }}>{r.id}</td>
                  <td style={{ ...cell, font: "400 12px/1 var(--font-mono)", color: "var(--text-muted)" }}>{r.agent}</td>
                  <td style={{ ...cell, font: "400 12px/1 var(--font-mono)", color: "var(--text-muted)" }}>{r.started}</td>
                  <td style={{ ...cell, font: "400 12px/1 var(--font-mono)", color: "var(--text-muted)" }}>{r.duration}</td>
                  <td style={{ ...cell, font: "400 12px/1 var(--font-mono)", color: "var(--text-muted)" }}>{r.turns}</td>
                  <td style={cell}><Badge state={r.status} pulse={r.status === "pending"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ---------- BlankScreen (for nav items we haven't built) -----------
function BlankScreen({ label }) {
  return (
    <div>
      <PageHeader title={label} sub="Coming in this UI kit's next pass." />
      <div style={{ padding: "0 32px 32px" }}>
        <EmptyState
          icon="construction"
          title={`${label} — placeholder`}
          body="This screen is intentionally blank in the UI kit. Use the components in components/ to compose it when you need it."
        />
      </div>
    </div>
  );
}

// ---------- AddMCPDrawer (right-edge wizard) ------------------------
const MCP_STEPS = ["Choose", "Connect", "Authorize", "Scope", "Test", "Review"];

function AddMCPDrawer({ open, onClose }) {
  const [step, setStep] = useStateScreens(0);
  const [transport, setTransport] = useStateScreens("SSE");
  const [selected, setSelected] = useStateScreens("linear");
  const [url, setUrl] = useStateScreens("https://mcp.linear.app/sse");

  React.useEffect(() => { if (open) setStep(0); }, [open]);

  const connectors = [
    { id: "linear", name: "Linear", glyph: "L", description: "Create issues from chat turns" },
    { id: "slack", name: "Slack", glyph: "S", description: "Post messages to channels and DMs" },
    { id: "github", name: "GitHub", glyph: "G", description: "Open PRs and read repo metadata" },
    { id: "notion", name: "Notion", glyph: "N", description: "Read & append to workspace pages" },
    { id: "stripe", name: "Stripe", glyph: "$", description: "Inspect customers, charges, subs" },
    { id: "custom", name: "Custom MCP", glyph: "+", description: "Bring your own server URL" },
  ];

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Add MCP"
      steps={MCP_STEPS}
      currentStep={step}
      footer={
        <React.Fragment>
          <Button variant="ghost" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>Back</Button>
          {step < MCP_STEPS.length - 1
            ? <Button variant="primary" trailingIcon="arrow-right" onClick={() => setStep(s => Math.min(MCP_STEPS.length - 1, s + 1))}>Continue</Button>
            : <Button variant="primary" onClick={onClose}>Add MCP</Button>}
        </React.Fragment>
      }
    >
      {step === 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <h2 style={{ font: "800 24px/1.15 var(--font-display)", letterSpacing: "-0.01em", margin: 0 }}>Pick a connector</h2>
          <p style={{ font: "400 13px/1.5 var(--font-sans)", color: "var(--text-muted)", margin: 0 }}>
            Connect a third-party MCP server, or bring your own URL.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
            {connectors.map(c => (
              <ConnectorCard
                key={c.id}
                {...c}
                selected={selected === c.id}
                onClick={() => setSelected(c.id)}
              />
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <h2 style={{ font: "800 24px/1.15 var(--font-display)", letterSpacing: "-0.01em", margin: 0 }}>Connect MCP server</h2>
          <p style={{ font: "400 13px/1.5 var(--font-sans)", color: "var(--text-muted)", margin: 0 }}>
            Choose a transport and point Conductor at the server.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ font: "500 12px/1 var(--font-sans)", color: "var(--text-muted)" }}>Transport</div>
            <Segmented
              value={transport}
              onChange={setTransport}
              options={["stdio", "SSE", "streamable-http"]}
            />
          </div>

          <Input
            label="Server URL"
            value={url}
            onChange={setUrl}
            placeholder="https://…"
            mono
            width="100%"
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ font: "500 12px/1 var(--font-sans)", color: "var(--text-muted)" }}>Env / secrets</div>
            <EnvRow k="LINEAR_WORKSPACE" v="acme" />
            <EnvRow k="LINEAR_API_KEY" v="lin_api_•••••••" secret />
            <button style={{
              alignSelf: "flex-start",
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "6px 10px", borderRadius: 6,
              font: "600 12px/1 var(--font-display)", color: "var(--brand-tide-text)",
            }}>
              <Icon name="plus" size={13} /> Add variable
            </button>
          </div>

          <AnnotationNote
            title="Why this matters"
            body="Conductor stores secrets in your Credentials vault, never the agent DSL. You can rotate them without redeploying."
          />
        </div>
      )}

      {step >= 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <h2 style={{ font: "800 24px/1.15 var(--font-display)", letterSpacing: "-0.01em", margin: 0 }}>{MCP_STEPS[step]}</h2>
          <p style={{ font: "400 13px/1.5 var(--font-sans)", color: "var(--text-muted)", margin: 0 }}>
            Step content for {MCP_STEPS[step].toLowerCase()} — wire it up next pass.
          </p>
          <div style={{
            padding: 20, marginTop: 8,
            background: "var(--surface-sunken)",
            borderRadius: 12,
            font: "400 12px/1.5 var(--font-mono)",
            color: "var(--text-muted)",
          }}>
            {`{\n  "step": "${MCP_STEPS[step].toLowerCase()}",\n  "status": "stub"\n}`}
          </div>
        </div>
      )}
    </Drawer>
  );
}

function EnvRow({ k, v, secret }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 14px 1fr", gap: 8, alignItems: "center" }}>
      <div style={{
        height: 34, padding: "0 12px", display: "flex", alignItems: "center",
        background: "var(--surface-sunken)", border: "1px solid var(--border-hairline)", borderRadius: 8,
        font: "500 13px/1 var(--font-mono)", color: "var(--text-ink)",
      }}>{k}</div>
      <span style={{ textAlign: "center", font: "500 12px/1 var(--font-mono)", color: "var(--text-faint)" }}>=</span>
      <div style={{
        height: 34, padding: "0 12px", display: "flex", alignItems: "center",
        background: "var(--surface-sunken)", border: "1px solid var(--border-hairline)", borderRadius: 8,
        font: "400 13px/1 var(--font-mono)", color: secret ? "var(--text-muted)" : "var(--text-ink)",
      }}>{v}</div>
    </div>
  );
}

// ---------- DeployTakeover (full-screen wizard) --------------------
const DEPLOY_STEPS = ["Target", "Routing", "Limits", "Review", "Deploy"];

function DeployTakeover({ open, onClose }) {
  const [step, setStep] = useStateScreens(0);
  const [target, setTarget] = useStateScreens("production");
  React.useEffect(() => { if (open) setStep(0); }, [open]);

  return (
    <Takeover
      open={open}
      onClose={onClose}
      title="Deploy agent"
      steps={DEPLOY_STEPS}
      currentStep={step}
      footer={
        <React.Fragment>
          <Button variant="ghost" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>Back</Button>
          {step < DEPLOY_STEPS.length - 1
            ? <Button variant="primary" size="lg" trailingIcon="arrow-right" onClick={() => setStep(s => Math.min(DEPLOY_STEPS.length - 1, s + 1))}>Continue</Button>
            : <Button variant="primary" size="lg" onClick={onClose}>Deploy v8</Button>}
        </React.Fragment>
      }
    >
      <div style={{ font: "500 11px/1 var(--font-mono)", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--brand-tide-text)" }}>
        AGENT.SUPPORT.ROUTER · CURRENT v7 → PROPOSED v8
      </div>
      <h2 style={{ font: "800 32px/1.1 var(--font-display)", letterSpacing: "-0.02em", margin: "0 0 4px" }}>
        {step === 0 && "Where should this version run?"}
        {step === 1 && "Routing & rollback"}
        {step === 2 && "Limits"}
        {step === 3 && "Review changes"}
        {step === 4 && "Ready to deploy"}
      </h2>
      <p style={{ font: "400 14px/1.5 var(--font-sans)", color: "var(--text-muted)", margin: 0 }}>
        {step === 0 && "Pick the lifecycle target. Production is gated behind a one-step canary by default."}
        {step === 1 && "Decide how this version receives traffic, and when Conductor should auto-rollback."}
        {step === 2 && "Per-turn cost, latency, and concurrency ceilings."}
        {step === 3 && "Diff between v7 and v8 — only routing rules changed."}
        {step === 4 && "Everything looks green. Hit Deploy to ship."}
      </p>

      {step === 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
          {[
            { v: "staging",    label: "Staging",    desc: "Internal-only traffic. No real users." },
            { v: "canary",     label: "Canary 5%",  desc: "5% of production traffic. Auto-promote on green." },
            { v: "production", label: "Production", desc: "All traffic. Requires a passing eval suite." },
          ].map(opt => (
            <ConnectorCard
              key={opt.v}
              name={opt.label}
              description={opt.desc}
              glyph={opt.v === "staging" ? "S" : opt.v === "canary" ? "C" : "P"}
              selected={target === opt.v}
              onClick={() => setTarget(opt.v)}
            />
          ))}
        </div>
      )}

      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 8 }}>
          <Input label="Auto-rollback threshold" value="3 errors / 1m" mono width="100%" />
          <Input label="Promotion eval suite" value="eval.support.full" mono width="100%" />
          <AnnotationNote
            title="What gets promoted"
            body="Conductor watches the canary for 30 minutes. If the rollback threshold is hit, traffic returns to v7 automatically."
          />
        </div>
      )}

      {step >= 2 && (
        <div style={{
          marginTop: 8, padding: 20,
          background: "var(--surface-sunken)",
          border: "1px solid var(--border-hairline)",
          borderRadius: 12,
          font: "400 13px/1.6 var(--font-mono)",
          color: "var(--text-muted)",
          whiteSpace: "pre",
        }}>{`{
  "step": "${DEPLOY_STEPS[step].toLowerCase()}",
  "target": "${target}",
  "from": "v7",
  "to": "v8",
  "diff": ["routing.specialists[+technical]", "routing.threshold 0.68 → 0.72"]
}`}</div>
      )}
    </Takeover>
  );
}

Object.assign(window, { AgentsScreen, RunsScreen, BlankScreen, AddMCPDrawer, DeployTakeover });
