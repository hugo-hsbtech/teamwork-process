// screen_panel.jsx — B4 Demand Panel shell. Branches by lifecycle stage:
// live (Capture / v2 draft) · frozen (v1 published) · downstream (handed off) · parked.
// window.DemandPanel
const { useState: useStateP } = React;
const IconP = window.Icon;
const UIP = window.UI;

function DemandPanel(props) {
  const { state, meta, version, flag, reviewReq, frozenSnap, readiness, tasks, questions, artifacts, sources,
          contributions, tweaks, onResolveTask, onOpenModal, onBack, onOpenChat,
          onEditContribution, onApproveContribution, toast } = props;
  const D = window.DATA;
  const F = meta || D.FOCAL;

  const isV2 = state === "v2draft";
  const isLive = state === "capture" || isV2;
  const isFrozen = state === "frozen";
  const isDownstream = D.DOWNSTREAM_STAGES.includes(state);
  const isParked = state === "backlog" || state === "archived";
  const readOnly = !isLive;

  const liveTabs = [
    { id: "add", label: "Add information" },
    { id: "artifacts", label: "Artifacts" },
    { id: "questions", label: "Questions" },
    { id: "sources", label: "Sources" },
    { id: "history", label: "History" },
  ];
  const roTabs = liveTabs.filter(t => t.id !== "add");
  const tabList = isLive ? liveTabs : roTabs;
  const [tab, setTab] = useStateP(isLive ? "add" : "artifacts");
  React.useEffect(() => { if (!tabList.find(t => t.id === tab)) setTab(tabList[0].id); }, [state]);

  const answeredQ = questions.filter(q => q.status === "answered").length;
  const doneA = artifacts.filter(a => a.status === "done").length;
  const isUrgent = state === "capture";
  const stInfo = D.STATES[state];
  const gateNoun = isV2 ? "v2" : "v1";
  const canPublish = readiness >= F.threshold;

  const openTasks = tasks.filter(t => !t.resolved).length;
  const tabs = tabList.map(t => {
    if (t.id === "artifacts") return { ...t, count: `${doneA}/${artifacts.length}` };
    if (t.id === "questions") return { ...t, count: `${answeredQ}/${questions.length}` };
    if (t.id === "sources")   return { ...t, count: sources.length };
    return t;
  });

  return (
    <div className="app-scroll scroll anim-screen" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, padding: 24, maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        {/* HEADER CARD */}
        <div className="card" style={{ padding: 24, marginBottom: 16,
          background: isUrgent ? "color-mix(in srgb, var(--red-50) 70%, var(--surface-card))" : "var(--surface-card)",
          borderColor: isUrgent ? "var(--red-600)" : "var(--border-strong)",
          transition: "background var(--dur-base), border-color var(--dur-base)" }}>
          <div className="row" style={{ gap: 24, alignItems: "flex-start" }}>
            <div className="grow" style={{ minWidth: 0 }}>
              <div className="row gap8" style={{ flexWrap: "wrap", marginBottom: 10 }}>
                <span className="mono f-sm muted">{F.id}</span>
                <window.UI.StateBadge state={state} size="sm" />
                {isV2 && <window.UI.MetaPill tone="tide">v2 DRAFT</window.UI.MetaPill>}
                <window.UI.MetaPill tone={isFrozen || isDownstream ? "tide" : "amber"} icon={readOnly ? "lock" : undefined}>{version}</window.UI.MetaPill>
                <window.UI.MetaPill tone={isUrgent ? "red" : "muted"} icon="clock">{F.deadline}</window.UI.MetaPill>
                {flag && <window.UI.StatusPill flag={flag} />}
              </div>
              <div className="row" style={{ alignItems: "center", gap: 8 }}>
                <div className="f-h2 grow">{F.title}</div>
                <button className="btn btn-ghost" style={{ width: 34, height: 34, padding: 0, borderRadius: 9999 }}
                  onClick={() => onOpenModal({ type: "actions" })} title="Actions"><IconP name="moreVertical" size={18} /></button>
              </div>
              <div className="f-sm muted" style={{ marginTop: 8, maxWidth: 880 }}>{F.desc}</div>
            </div>
            <div className="col" style={{ alignItems: "flex-end", gap: 6, flex: "none" }}>
              <window.UI.Eyebrow>{readOnly ? "OWNER" : "PEOPLE · 1"}</window.UI.Eyebrow>
              <window.UI.Avatar person={F.assignee} size={28} />
              <span className="f-sm" style={{ fontWeight: 600 }}>{F.assignee.name}{F.assignee === D.USER ? " · you" : ""}</span>
              <span className="f-sm faint" style={{ fontSize: 11 }}>{F.assignedAgo}</span>
            </div>
          </div>
        </div>

        {/* PEER-REVIEW BANNER (Capture loop — does not advance the stage) */}
        {isLive && reviewReq && (
          <div className="card row gap10" style={{ padding: "12px 16px", marginBottom: 16, alignItems: "center",
            background: "var(--violet-50)", borderColor: "var(--violet-500)" }}>
            <IconP name="eye" size={16} style={{ color: "var(--violet-500)" }} />
            <span className="f-sm grow" style={{ color: "var(--text-ink)" }}>
              Review requested from <b>{(D.PEOPLE[reviewReq.who] || D.PEOPLE.AC).name}</b> — they can comment while it stays in your Capture. The pipeline stage hasn’t changed.
            </span>
            <span className="pill" style={{ background: "var(--surface-card)", color: "var(--violet-500)", fontSize: 10 }}>PEER REVIEW</span>
          </div>
        )}

        {/* V2 DRAFT CONTEXT (v1 stays frozen in parallel) */}
        {isV2 && (
          <div className="card row gap10" style={{ padding: "12px 16px", marginBottom: 16, alignItems: "center",
            background: "var(--tide-50)", borderColor: "var(--tide-500)" }}>
            <IconP name="lock" size={16} style={{ color: "var(--tide-600)" }} />
            <span className="f-sm grow" style={{ color: "var(--text-ink)" }}>
              <b>v1 is published and frozen.</b> You’re editing a v2 draft in parallel — it won’t replace v1 until you publish it.
            </span>
            <button className="btn btn-ghost btn-sm" onClick={() => onOpenModal({ type: "diff" })}>View v1 ↔ v2 diff</button>
          </div>
        )}

        {isParked ? (
          <ParkedPanel state={state} onOpenModal={onOpenModal} />
        ) : isFrozen ? (
          <FrozenView state={state} version={version} readiness={readiness} answeredQ={answeredQ}
            doneA={doneA} artifacts={artifacts} questions={questions} sources={sources} onOpenModal={onOpenModal} />
        ) : isDownstream ? (
          <DownstreamView state={state} onOpenChat={onOpenChat} />
        ) : (
          <ReadinessHero state={state} readiness={readiness} answeredQ={answeredQ} questions={questions}
            doneA={doneA} artifacts={artifacts} sources={sources} threshold={F.threshold} gateNoun={gateNoun}
            viz={tweaks.readinessViz} onDetail={() => onOpenModal({ type: "readiness" })} />
        )}

        {/* TABS */}
        {!isParked && (
          <>
            <div style={{ marginBottom: 16 }}>
              <window.UI.Tabs tabs={tabs} active={tab} onChange={setTab} />
            </div>
            {tab === "add" && isLive && (
              <window.PanelAddInfo contributions={contributions}
                onSend={(text) => { onResolveTask({ contribution: text }); toast("Sent — copilot is processing your update"); }}
                onOpenModal={onOpenModal} onOpenChat={onOpenChat}
                onEditContribution={onEditContribution} onApproveContribution={onApproveContribution}
                toast={toast} />
            )}
            {tab === "artifacts" && <window.PanelArtifacts artifacts={artifacts} tasks={tasks} onOpenModal={onOpenModal} onResolveTask={onResolveTask} toast={toast} readOnly={readOnly} frozenSnap={frozenSnap} />}
            {tab === "questions" && <window.PanelQuestions questions={questions} tasks={tasks} onOpenModal={onOpenModal} onResolveTask={onResolveTask} toast={toast} readOnly={readOnly} />}
            {tab === "sources" && <window.PanelSources sources={sources} onOpenModal={onOpenModal} readOnly={readOnly} />}
            {tab === "history" && <window.PanelAudit />}
          </>
        )}
      </div>

      {/* FOOTER ACTION BAR */}
      {!isParked && (
        <div style={{ flex: "none", borderTop: "1px solid var(--border-hairline)", background: "var(--surface-card)",
          padding: "14px 24px", position: "sticky", bottom: 0 }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", gap: 16 }}>
            {isLive ? (
              <>
                <window.UI.ReadinessRing pct={readiness} size={40} stroke={5} showPct={false} />
                <div className="col grow" style={{ gap: 2 }}>
                  <span className="f-label" style={{ fontWeight: 700 }}>{isV2 ? "v2 draft" : stInfo.label}</span>
                  <span className="f-sm faint">{canPublish ? `Ready to freeze & publish ${gateNoun}` : `Needs ${F.threshold}% to publish ${gateNoun} · now at ${readiness}%`}</span>
                </div>
                {isV2
                  ? <button className="btn btn-ghost btn-md" onClick={() => onOpenModal({ type: "discardV2" })}>Discard v2</button>
                  : <button className="btn btn-ghost btn-md" onClick={() => onOpenModal({ type: "postpone" })}>Postpone</button>}
                <button className="btn btn-secondary btn-md" onClick={() => onOpenModal({ type: isV2 ? "diff" : "review" })}>{isV2 ? "View diff" : "Request review"}</button>
                <window.UI.Button variant="primary" icon="lock" disabled={!canPublish}
                  onClick={() => onOpenModal({ type: isV2 ? "freezeV2" : "freezeV1" })}>Freeze &amp; publish {gateNoun}</window.UI.Button>
              </>
            ) : isFrozen ? (
              <>
                <div style={{ width: 40, height: 40, borderRadius: 9999, background: "var(--tide-50)", display: "grid", placeItems: "center", color: "var(--tide-600)", flex: "none" }}><IconP name="lock" size={18} /></div>
                <div className="col grow" style={{ gap: 2 }}>
                  <span className="f-label" style={{ fontWeight: 700 }}>{version} · immutable</span>
                  <span className="f-sm faint">Edits start a v2 draft. v1 stays published downstream.</span>
                </div>
                <button className="btn btn-ghost btn-md" onClick={() => toast("Export queued — package as PDF + JSON")}>Export package</button>
                <window.UI.Button variant="primary" icon="pencil" onClick={() => onOpenModal({ type: "startV2" })}>Start v2 draft</window.UI.Button>
              </>
            ) : (
              <>
                <div style={{ width: 40, height: 40, borderRadius: 9999, background: "var(--surface-sunken)", display: "grid", placeItems: "center", color: "var(--text-muted)", flex: "none" }}><IconP name="eye" size={18} /></div>
                <div className="col grow" style={{ gap: 2 }}>
                  <span className="f-label" style={{ fontWeight: 700 }}>Handed off · {stInfo.label}</span>
                  <span className="f-sm faint">Read-only. Owned downstream by {(D.JOURNEY.find(j => j.key === state) || {}).owner || "the next team"}.</span>
                </div>
                <button className="btn btn-ghost btn-md" onClick={onOpenChat}>Ask the copilot</button>
                <button className="btn btn-secondary btn-md" onClick={() => onOpenModal({ type: "startV2" })}>Suggest a change (v2)</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Frozen (v1 published) view --------------------------------------
function FrozenView({ state, version, readiness, answeredQ, doneA, artifacts, questions, sources, onOpenModal }) {
  const D = window.DATA;
  return (
    <div className="anim-fade">
      <div className="card row gap10" style={{ padding: "14px 18px", marginBottom: 16, alignItems: "center",
        background: "var(--tide-50)", borderColor: "var(--tide-500)" }}>
        <IconP name="lock" size={18} style={{ color: "var(--tide-600)", flex: "none" }} />
        <div className="grow">
          <div className="f-label" style={{ fontWeight: 700 }}>{version} — frozen &amp; immutable</div>
          <div className="f-sm muted" style={{ marginTop: 2 }}>This package can no longer be edited. Any change starts a parallel v2 draft. Ana Costa was notified the moment you published.</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => onOpenModal({ type: "readiness" })}>What shipped</button>
      </div>

      <div className="card card-pad" style={{ marginBottom: 16 }}>
        <window.UI.Eyebrow style={{ marginBottom: 16 }}>DEMAND JOURNEY</window.UI.Eyebrow>
        <window.UI.JourneyTrack current={state} />
      </div>

      <div className="card" style={{ overflow: "hidden", marginBottom: 16 }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border-hairline)" }}>
          <window.UI.Eyebrow style={{ color: "var(--accent-text)", marginBottom: 6 }}>DOWNSTREAM · AFTER HANDOFF</window.UI.Eyebrow>
          <div className="f-h3">What’s happened since you published</div>
        </div>
        {D.DOWNSTREAM_EVENTS.map((e, i) => {
          const p = D.PEOPLE[e.who] || D.PEOPLE.AI;
          return (
            <div key={e.id} className="row gap12" style={{ padding: "13px 20px", borderTop: i ? "1px solid var(--border-hairline)" : "none", alignItems: "flex-start" }}>
              {e.who === "AI"
                ? <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--accent-wash)", display: "grid", placeItems: "center", color: "var(--accent-text)", flex: "none" }}><IconP name="sparkles" size={15} /></div>
                : <window.UI.Avatar person={p} size={28} />}
              <div className="grow">
                <div className="f-sm" style={{ color: "var(--text-ink)" }}>{e.text}</div>
                <div className="row gap6" style={{ marginTop: 4 }}><window.UI.StateBadge state={e.state} size="sm" /><span className="f-sm faint" style={{ fontSize: 11 }}>{e.ago}</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- Downstream (handed off, in progress elsewhere) view -------------
function DownstreamView({ state, onOpenChat }) {
  const D = window.DATA;
  const owner = (D.JOURNEY.find(j => j.key === state) || {}).owner || "the next team";
  return (
    <div className="anim-fade">
      <div className="card row gap10" style={{ padding: "14px 18px", marginBottom: 16, alignItems: "center" }}>
        <div style={{ width: 36, height: 36, borderRadius: 9999, background: D.STATES[state].wash, display: "grid", placeItems: "center", flex: "none" }}>
          <span className="dot" style={{ background: D.STATES[state].dot, width: 10, height: 10 }} />
        </div>
        <div className="grow">
          <div className="f-label" style={{ fontWeight: 700 }}>Handed off — now in {D.STATES[state].label}</div>
          <div className="f-sm muted" style={{ marginTop: 2 }}>Owned by {owner}. You keep read-only visibility on everything you captured.</div>
        </div>
      </div>
      <div className="card card-pad" style={{ marginBottom: 16 }}>
        <window.UI.Eyebrow style={{ marginBottom: 16 }}>DEMAND JOURNEY</window.UI.Eyebrow>
        <window.UI.JourneyTrack current={state} />
      </div>
      <div className="card" style={{ overflow: "hidden", marginBottom: 16 }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border-hairline)" }}>
          <window.UI.Eyebrow style={{ color: "var(--accent-text)", marginBottom: 6 }}>DOWNSTREAM EVENTS</window.UI.Eyebrow>
          <div className="f-h3">Updates from the {owner} team</div>
        </div>
        {D.DOWNSTREAM_EVENTS.map((e, i) => {
          const p = D.PEOPLE[e.who] || D.PEOPLE.AI;
          return (
            <div key={e.id} className="row gap12" style={{ padding: "13px 20px", borderTop: i ? "1px solid var(--border-hairline)" : "none", alignItems: "flex-start" }}>
              {e.who === "AI"
                ? <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--accent-wash)", display: "grid", placeItems: "center", color: "var(--accent-text)", flex: "none" }}><IconP name="sparkles" size={15} /></div>
                : <window.UI.Avatar person={p} size={28} />}
              <div className="grow"><div className="f-sm" style={{ color: "var(--text-ink)" }}>{e.text}</div><div className="f-sm faint" style={{ marginTop: 4, fontSize: 11 }}>{e.ago}</div></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- Parked (backlog / archived) -------------------------------------
function ParkedPanel({ state, onOpenModal }) {
  const archived = state === "archived";
  return (
    <div className="card col" style={{ alignItems: "center", textAlign: "center", padding: 56, gap: 10, marginBottom: 16 }}>
      <div style={{ width: 52, height: 52, borderRadius: 9999, background: window.DATA.STATES[state].wash, display: "grid", placeItems: "center", color: window.DATA.STATES[state].text }}>
        <IconP name={archived ? "trash" : "inbox"} size={24} />
      </div>
      <div className="f-h3">{archived ? "This demand is archived" : "This demand is in the backlog"}</div>
      <div className="f-sm muted" style={{ maxWidth: 440 }}>
        {archived
          ? "It’s out of the active pipeline and read-only. Restore it to keep working."
          : "It hasn’t been picked up yet. Move it into Capture to start enriching it toward a v1 package."}
      </div>
      <window.UI.Button variant="primary" icon={archived ? "refresh" : "arrowRight"}
        onClick={() => onOpenModal({ type: archived ? "restore" : "restore" })}>
        {archived ? "Restore demand" : "Move to Capture"}
      </window.UI.Button>
    </div>
  );
}

// ---- Readiness hero (Capture / v2 draft) -----------------------------
function ReadinessHero({ state, readiness, answeredQ, questions, doneA, artifacts, sources, threshold, viz, gateNoun, onDetail }) {
  const D = window.DATA;
  const color = D.readinessColor(readiness);
  const needQ = questions.length - answeredQ;
  const needA = artifacts.length - doneA;
  const msg = readiness >= threshold
    ? `You’ve cleared the bar. Freeze & publish ${gateNoun} whenever you’re ready — it hands off to Discovery.`
    : `You need ${needQ} more question${needQ!==1?"s":""} answered and ${needA} artifact${needA!==1?"s":""} complete before you can freeze & publish ${gateNoun}.`;

  return (
    <div className="card" style={{ padding: 24, marginBottom: 20 }}>
      <div className="row" style={{ gap: 24, alignItems: "center", marginBottom: 16 }}>
        {viz !== "bar" && <window.UI.ReadinessRing pct={readiness} size={96} />}
        <div className="grow">
          <div className="row gap8" style={{ alignItems: "baseline", marginBottom: 6 }}>
            <span className="f-h3" style={{ color }}>{readiness}% ready</span>
            <span className="f-sm muted">· {D.STATES[state].label}</span>
            <span className="pill" style={{ background: "var(--tide-50)", color: "var(--accent-text)", fontSize: "var(--fs-xs)" }}>↑ {D.FOCAL.delta}</span>
          </div>
          <div className="f-sm muted" style={{ maxWidth: 760 }}>{msg}</div>
        </div>
        <button className="lnk f-sm row gap4" onClick={onDetail} style={{ flex: "none" }}>Detail <IconP name="arrowRight" size={14} /></button>
      </div>

      {viz === "segments" ? (
        <div className="row gap4" style={{ marginBottom: 14 }}>
          {Array.from({ length: 20 }).map((_, i) => {
            const filled = i < Math.round(readiness/5);
            return (
              <div key={i} style={{ flex: 1, height: 10, borderRadius: 3,
                background: filled ? color : "var(--surface-sunken)",
                transformOrigin: "bottom",
                animation: filled ? `segGrow 360ms ${i*28}ms var(--ease-out) both` : "none",
                transition: "background 400ms var(--ease-out)" }} />
            );
          })}
        </div>
      ) : (
        <div style={{ marginBottom: 14 }}><window.UI.ReadinessBar pct={readiness} threshold={threshold} /></div>
      )}

      <div className="row gap16" style={{ alignItems: "center", flexWrap: "wrap" }}>
        <StatPair label="QUESTIONS" value={`${answeredQ} / ${questions.length}`} />
        <StatPair label="ARTIFACTS" value={`${doneA} / ${artifacts.length}`} />
        <StatPair label="SOURCES" value={sources.length} />
        <div className="grow" style={{ minWidth: 60, display: "flex", justifyContent: "center" }}>
          <window.Charts.Sparkline data={[8, 11, 10, 14, 16, 21, readiness]} width={120} height={28} color={color} animateKey={readiness} />
        </div>
        <span className="f-sm faint">publish threshold: {threshold}%</span>
      </div>
    </div>
  );
}

function StatPair({ label, value }) {
  return (
    <div className="row gap6" style={{ alignItems: "baseline" }}>
      <span className="f-eyebrow" style={{ color: "var(--text-faint)" }}>{label}</span>
      <span className="mono f-sm" style={{ color: "var(--text-ink)", fontWeight: 500 }}>{value}</span>
    </div>
  );
}

window.DemandPanel = DemandPanel;
