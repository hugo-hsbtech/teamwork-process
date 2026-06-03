// app.jsx — orchestrator: routing, shared demand state, handlers, theming, tweaks.
const { useState: useStateA, useEffect: useEffectA, useCallback: useCB } = React;

const ACCENTS = {
  "#0e7c86": { accent: "rgb(14,124,134)", bright: "rgb(19,164,176)", text: "rgb(14,124,134)", wash: "rgb(230,243,244)", on: "#fff" },
  "#3b5bdb": { accent: "#3b5bdb", bright: "#5c7cfa", text: "#3b5bdb", wash: "#edf1ff", on: "#fff" },
  "#7048e8": { accent: "#7048e8", bright: "#9775fa", text: "#7048e8", wash: "#f3effe", on: "#fff" },
  "#197d52": { accent: "#197d52", bright: "#23a06a", text: "#197d52", wash: "#e3f3ea", on: "#fff" },
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "demandState": "capture",
  "readinessViz": "ring",
  "liveReadiness": true,
  "readinessManual": 24,
  "chatTreatment": "cards",
  "density": "cozy",
  "accent": "#0e7c86",
  "dark": false,
  "typeScale": 1
}/*EDITMODE-END*/;

function computeReadiness(questions, artifacts, sources) {
  const aQ = questions.filter(q => q.status === "answered").length;
  const dA = artifacts.filter(a => a.status === "done").length;
  const extra = Math.max(0, sources.length - 3);
  return Math.min(100, Math.round(9 + aQ * 8 + dA * 5 + extra * 2));
}

const clone = (x) => JSON.parse(JSON.stringify(x));

function App() {
  const D = window.DATA;
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  const [route, setRoute] = useStateA("signin");
  const [focalState, setFocalState] = useStateA(t.demandState);

  // shared demand data
  const [tasks, setTasks] = useStateA(() => clone(D.TASKS));
  const [questions, setQuestions] = useStateA(() => clone(D.QUESTIONS));
  const [artifacts, setArtifacts] = useStateA(() => clone(D.ARTIFACTS));
  const [sources, setSources] = useStateA(() => clone(D.SOURCES));
  const [contributions, setContributions] = useStateA(() => clone(D.CONTRIBUTIONS));
  const [chat, setChat] = useStateA(() => clone(D.CHAT));
  const [typing, setTyping] = useStateA(false);

  // versioning + editable meta + status flags
  const [version, setVersion] = useStateA(D.FOCAL.version);
  const [meta, setMeta] = useStateA({ title: D.FOCAL.title, desc: D.FOCAL.desc });
  const [assignee, setAssignee] = useStateA(D.FOCAL.assignee);
  const [demandFlag, setDemandFlag] = useStateA(null); // schedule/parking (postponed/late)
  const [reviewReq, setReviewReq] = useStateA(null);   // peer-review loop within Capture (does NOT advance stage)
  const [frozenSnap, setFrozenSnap] = useStateA(null); // immutable v1 snapshot for the v1↔v2 diff

  // overlays
  const [modal, setModal] = useStateA(null);
  const [chatOpen, setChatOpen] = useStateA(false);
  const [chatMode, setChatMode] = useStateA("drawer");
  const [voiceOpen, setVoiceOpen] = useStateA(false);
  const [notifOpen, setNotifOpen] = useStateA(false);
  const [searchOpen, setSearchOpen] = useStateA(false);
  const [toastMsg, setToastMsg] = useStateA(null);

  const toast = useCB((text, icon) => { setToastMsg({ text, icon, k: Date.now() }); }, []);
  useEffectA(() => { if (!toastMsg) return; const id = setTimeout(() => setToastMsg(null), 2600); return () => clearTimeout(id); }, [toastMsg]);

  // sync focal state from tweak (preview any stage), keeping the version label coherent
  useEffectA(() => {
    setFocalState(t.demandState);
    if (t.demandState === "v2draft") setVersion("v2 · DRAFT");
    else if (t.demandState === "frozen") setVersion("v1 · PUBLISHED");
    else if (D.DOWNSTREAM_STAGES.includes(t.demandState)) setVersion("v1 · PUBLISHED");
    else setVersion("v1 · DRAFT");
  }, [t.demandState]);

  // ---- THEME application (to documentElement so overlays inherit) ----
  useEffectA(() => {
    const r = document.documentElement;
    const a = ACCENTS[t.accent] || ACCENTS["#0e7c86"];
    r.style.setProperty("--accent", a.accent);
    r.style.setProperty("--accent-bright", a.bright);
    r.style.setProperty("--accent-text", a.text);
    r.style.setProperty("--accent-on", a.on);
    r.style.setProperty("--accent-wash", t.dark ? `color-mix(in srgb, ${a.accent} 18%, transparent)` : a.wash);
    r.style.setProperty("--type-scale", t.typeScale);
    if (t.dark) r.setAttribute("data-theme", "dark"); else r.removeAttribute("data-theme");
  }, [t.accent, t.dark, t.typeScale]);

  // ⌘K search
  useEffectA(() => {
    const h = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setSearchOpen(o => !o); } };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, []);

  const readiness = t.liveReadiness ? computeReadiness(questions, artifacts, sources) : t.readinessManual;

  // ---- handlers ----
  const resolveTaskById = (taskId) => { if (taskId) setTasks(ts => ts.map(x => x.id === taskId ? { ...x, resolved: true } : x)); };

  const onAnswer = (qId, text, taskId) => {
    setQuestions(qs => qs.map(q => q.id === qId ? { ...q, status: "answered", answer: text } : q));
    resolveTaskById(taskId);
  };
  const onFillArtifact = (aId, text, taskId) => {
    setArtifacts(as => as.map(a => a.id === aId ? { ...a, status: "done", body: text } : a));
    resolveTaskById(taskId);
  };
  const onAddSource = (name, kind) => {
    const icon = kind === "link" ? "link" : "fileText";
    setSources(s => [...s, { id: "s" + Date.now(), type: kind, name, meta: `${(kind||"file").toUpperCase()} · added just now`, icon }]);
  };
  const onContribution = (text, kind = "TEXT") => {
    setContributions(c => [{ id: "c" + Date.now(), who: "HS", kind, ago: "just now", text, aiExtracted: null, status: "pending" }, ...c]);
  };
  const onEditContribution   = (id, text) => setContributions(cs => cs.map(c => c.id === id ? { ...c, text } : c));
  const onApproveContribution = (id)      => setContributions(cs => cs.map(c => c.id === id ? { ...c, status: "approved" } : c));

  // resolveTask multiplexer used by panel
  const onResolveTask = (payload) => {
    if (payload.contribution) { onContribution(payload.contribution); return; }
    if (payload.taskId && payload.kind) {
      if (payload.kind === "question") onAnswer(payload.refId, payload.value, payload.taskId);
      else onFillArtifact(payload.refId, payload.value, payload.taskId);
    }
  };

  // ---- chat ----
  const pushAi = (reply, delay = 850) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setChat(c => [...c, { id: "m" + Date.now(), role: "ai", who: "AI", ago: "now", text: reply.text, chips: reply.chips, cites: reply.cites }]);
    }, delay);
  };
  const onSendChat = (text, refs = []) => {
    setChat(c => [...c, { id: "u" + Date.now(), role: "user", who: "HS", ago: "now", text: text || "(see attached)", refs }]);
    const query = [text, ...refs.map(r => r.label)].join(" ");
    const hit = D.SCRIPTED_REPLIES.find(r => r.match.test(query)) || D.DEFAULT_REPLY;
    pushAi(hit);
  };
  const onChip = (label) => {
    const l = label.toLowerCase();
    if (/reach.*14|fill.*reach/.test(l)) { onFillArtifact("a5", "≈14 partners in active onboarding (CISO transcript). Flagged for Sales confirmation.", "t4"); setChat(c => [...c, { id: "u"+Date.now(), role:"user", who:"HS", ago:"now", text: label }]); pushAi({ text: "Done — I filled Reach with ≈14 and flagged it for Sales. Your readiness just went up.", chips: ["Now estimate ROI"] }); return; }
    if (/success metric|draft.*success/.test(l)) { onFillArtifact("a4", "Cut partner onboarding drop-off at auth from ~18% to under 5% within a quarter.", "t3"); setChat(c => [...c, { id:"u"+Date.now(), role:"user", who:"HS", ago:"now", text: label }]); pushAi({ text: "Drafted the Success metric artifact for you. Edit it any time from the Artifacts tab." }); return; }
    if (/risks|depend/.test(l)) { onFillArtifact("a7", "Dependency on Security (SOC2). Risk: partner IdP variance may need per-partner mapping.", "t8"); pushAi({ text: "Filled Risks & dependencies from the CISO notes." }); return; }
    if (/answer.*question|provider|saml/.test(l)) { onAnswer("q3", "Okta and Azure AD are the dominant partner IdPs; two partners on Ping (Q3 deck, slide 7).", "t5"); pushAi({ text: "Answered “which SAML providers” and cited slide 7." }); return; }
    if (/draft.*request|sales|ana costa/.test(l)) { toast("Drafted a request to Ana Costa"); pushAi({ text: "I drafted a short request to Ana Costa asking for the Sales pipeline count. Want to send it?", chips: ["Send to Ana"] }); return; }
    if (/send to ana/.test(l)) { toast("Request sent to Ana Costa"); pushAi({ text: "Sent. I'll fold her number into Reach when she replies." }); return; }
    onSendChat(label);
  };

  // ---- state-changing actions ----
  // Freeze & publish v1 = the handoff (LANE-K "Congelar v1"). Demand becomes
  // immutable; the downstream lead (Ana Costa) is notified.
  const onFreezeV1 = () => {
    setFrozenSnap({ artifacts: clone(artifacts), questions: clone(questions), readiness });
    setFocalState("frozen"); setVersion("v1 · PUBLISHED");
  };
  // Editing a frozen demand spawns a parallel v2 draft (LANE-L).
  const onStartV2 = () => { setFocalState("v2draft"); setVersion("v2 · DRAFT"); };
  const onFreezeV2 = () => {
    setFrozenSnap({ artifacts: clone(artifacts), questions: clone(questions), readiness });
    setFocalState("frozen"); setVersion("v2 · PUBLISHED");
  };
  // Peer review is a loop WITHIN Capture — it must not advance the pipeline stage.
  const onRequestReview = (who) => setReviewReq({ who: who || "AC" });
  const onPostpone = () => { setDemandFlag("postponed"); setRoute("demands"); };
  const onArchive = () => { setFocalState("archived"); setRoute("demands"); };
  const onAssign = (who) => setAssignee(window.DATA.PEOPLE[who] || assignee);
  const onEditMeta = (title, desc) => setMeta({ title: title, desc: desc });

  const openDemand = (id) => {
    if (id === "__list") { setRoute("demands"); return; }
    if (id !== D.FOCAL.id) toast("This prototype follows " + D.FOCAL.id);
    setRoute("panel");
  };

  const demandStates = { [D.FOCAL.id]: focalState };
  const openTasks = tasks.filter(x => !x.resolved).length;
  const focalMeta = { ...D.FOCAL, title: meta.title, desc: meta.desc, version, assignee, state: focalState };
  const handlers = { onClose: () => setModal(null), onOpenModal: setModal, onAnswer, onFillArtifact, onAddSource, onContribution,
    onFreezeV1, onStartV2, onFreezeV2, onPostpone, onRequestReview, onArchive, onAssign, onEditMeta,
    onEditContribution, onApproveContribution,
    onRestore: () => { setDemandFlag(null); setFocalState("capture"); setVersion("v1 · DRAFT"); } };

  // ---- takeover routes (no chrome) ----
  if (route === "signin") return <><window.SignIn onSignIn={() => setRoute("dashboard")} /><TweaksUI t={t} setTweak={setTweak} /></>;
  if (route === "create") return <><window.CreateDemand onCancel={() => setRoute("demands")} onCreate={() => { setFocalState("capture"); setVersion("v1 · DRAFT"); setMeta({ title: D.FOCAL.title, desc: D.FOCAL.desc }); setRoute("panel"); toast("Demand created · copilot drafted 3 artifacts"); }} toast={toast} /><window.UI.Toast toast={toastMsg} /><TweaksUI t={t} setTweak={setTweak} /></>;

  // ---- crumbs ----
  const crumbs = {
    dashboard: [{ label: "Home" }],
    demands: [{ label: "Home", to: "dashboard" }, { label: "Demands" }],
    panel: [{ label: "Home", to: "dashboard" }, { label: "Demands", to: "demands" }, { label: D.FOCAL.id, mono: true }],
    pending: [{ label: "Home", to: "dashboard" }, { label: "Pending" }],
    activity: [{ label: "Home", to: "dashboard" }, { label: "Activity" }],
    settings: [{ label: "Home", to: "dashboard" }, { label: "Settings" }],
  }[route] || [{ label: "Home" }];

  return (
    <div className="app-frame">
      <window.Chrome.Sidebar route={route} onNav={setRoute} badges={{ demands: D.DEMANDS.length, pending: openTasks }} />
      <div className="app-main">
        <window.Chrome.TopBar crumbs={crumbs} onCrumb={setRoute} notifCount={2}
          onSearch={() => setSearchOpen(true)} onBell={() => setNotifOpen(o => !o)} />

        {route === "dashboard" && <window.Dashboard onOpenDemand={openDemand} onNew={() => setRoute("create")} onNav={setRoute} demandStates={demandStates} />}
        {route === "demands" && <window.Demands onOpenDemand={openDemand} onNew={() => setRoute("create")} demandStates={demandStates} toast={toast} />}
        {route === "panel" && (
          <window.DemandPanel state={focalState} meta={focalMeta} version={version} flag={demandFlag}
            reviewReq={reviewReq} frozenSnap={frozenSnap} readiness={readiness} tasks={tasks} questions={questions}
            artifacts={artifacts} sources={sources} contributions={contributions} tweaks={t}
            onResolveTask={onResolveTask} onOpenModal={setModal} onBack={() => setRoute("demands")}
            onOpenChat={() => { setChatOpen(true); setChatMode("drawer"); }}
            onEditContribution={onEditContribution} onApproveContribution={onApproveContribution}
            toast={toast} />
        )}
        {route === "pending" && <window.Misc.Pending tasks={tasks} onOpenDemand={openDemand} onOpenModal={setModal} />}
        {route === "activity" && <window.Misc.ActivityScreen />}
        {route === "settings" && <window.Misc.Settings />}
      </div>

      {/* Chat FAB */}
      {route === "panel" && !chatOpen && !voiceOpen && (
        <button onClick={() => { setChatOpen(true); setChatMode("drawer"); }} title="Copilot"
          style={{ position: "fixed", bottom: 84, right: 24, width: 56, height: 56, borderRadius: 9999, zIndex: 40,
            background: "var(--accent)", color: "#fff", boxShadow: "var(--elev-pop)", display: "grid", placeItems: "center",
            animation: "scaleIn 240ms var(--ease-out) forwards" }}>
          <window.Icon name="sparkles" size={24} />
        </button>
      )}

      <window.CopilotChat open={chatOpen} mode={chatMode} messages={chat} typing={typing} treatment={t.chatTreatment}
        questions={questions} sources={sources} artifacts={artifacts} readiness={readiness} state={focalState}
        onSend={onSendChat} onChip={onChip} onClose={() => setChatOpen(false)}
        onFullscreen={() => setChatMode(m => m === "fullscreen" ? "drawer" : "fullscreen")}
        onVoice={() => { setVoiceOpen(true); }} toast={toast} />

      <window.VoiceMode open={voiceOpen} onClose={() => setVoiceOpen(false)}
        onMessage={() => { onContribution("(voice) Sales says the real pipeline is closer to 40 partners over two quarters.", "AUDIO"); toast("Voice note transcribed to a contribution"); }} />

      <window.DemandModals modal={modal} meta={focalMeta} version={version} questions={questions} artifacts={artifacts}
        sources={sources} frozenSnap={frozenSnap} readiness={readiness} handlers={handlers} toast={toast} />

      <window.Misc.NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} onOpenDemand={openDemand} />
      <window.Misc.SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} onNav={setRoute} onOpenDemand={openDemand} />

      <window.UI.Toast toast={toastMsg} />
      <TweaksUI t={t} setTweak={setTweak} />
    </div>
  );
}

// ---- Tweaks panel UI ----
function TweaksUI({ t, setTweak }) {
  const { TweaksPanel, TweakSection, TweakSelect, TweakRadio, TweakToggle, TweakSlider, TweakColor } = window;
  return (
    <TweaksPanel>
      <TweakSection label="Demand" />
      <TweakSelect label="Stage" value={t.demandState}
        options={[["capture","In Capture"],["frozen","Frozen · v1 published"],["v2draft","v2 draft (editing)"],["triage","In Triage"],["discovery","In Discovery"],["rationalization","Rationalization"],["execution","In Execution"],["delivered","Delivered"],["backlog","Backlog"],["archived","Archived"]].map(o=>({value:o[0],label:o[1]}))}
        onChange={v => setTweak("demandState", v)} />

      <TweakSection label="Readiness" />
      <TweakToggle label="Live (from tasks)" value={t.liveReadiness} onChange={v => setTweak("liveReadiness", v)} />
      <TweakSlider label="Readiness %" value={t.readinessManual} min={0} max={100} unit="%"
        onChange={v => setTweak({ readinessManual: v, liveReadiness: false })} />
      <TweakRadio label="Visualization" value={t.readinessViz} options={["ring", "bar", "segments"]} onChange={v => setTweak("readinessViz", v)} />

      <TweakSection label="Copilot" />
      <TweakRadio label="Chat style" value={t.chatTreatment} options={["cards", "bubbles", "minimal"]} onChange={v => setTweak("chatTreatment", v)} />

      <TweakSection label="Layout & theme" />
      <TweakRadio label="Density" value={t.density} options={["compact", "cozy"]} onChange={v => setTweak("density", v)} />
      <TweakColor label="Accent" value={t.accent} options={["#0e7c86", "#3b5bdb", "#7048e8", "#197d52"]} onChange={v => setTweak("accent", v)} />
      <TweakToggle label="Dark mode (exploratory)" value={t.dark} onChange={v => setTweak("dark", v)} />
      <TweakSlider label="Type scale" value={t.typeScale} min={0.9} max={1.2} step={0.05} unit="×" onChange={v => setTweak("typeScale", v)} />
    </TweaksPanel>
  );
}

window.App = App;
