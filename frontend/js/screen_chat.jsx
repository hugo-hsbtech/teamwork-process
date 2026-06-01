// screen_chat.jsx — Copilot: docked drawer + dedicated fullscreen page + voice mode.
// window.CopilotChat, window.VoiceMode
const { useState: useStateCh, useRef: useRefCh, useEffect: useEffectCh } = React;
const IconCh = window.Icon;

const REF_ICON = { question: "help", source: "fileText", demand: "box" };

// ---- Reference chip (attached context) --------------------------------
function RefChip({ r, onRemove, small }) {
  return (
    <span className="row gap6" style={{
      background: "var(--surface-card)", border: "1px solid var(--border-strong)", borderRadius: 8,
      padding: small ? "3px 6px 3px 8px" : "5px 8px 5px 10px", maxWidth: 240,
    }}>
      <IconCh name={REF_ICON[r.kind]} size={13} style={{ color: "var(--accent-text)", flex: "none" }} />
      <span className="f-sm clip" style={{ fontSize: 12, color: "var(--text-ink)" }}>{r.label}</span>
      {onRemove && <button onClick={() => onRemove(r)} style={{ color: "var(--text-faint)", display: "flex", flex: "none" }}><IconCh name="x" size={12} /></button>}
    </span>
  );
}

// ---- Message ----------------------------------------------------------
function ChatMessage({ m, treatment, page, onChip, onRefClick }) {
  const isUser = m.role === "user";
  const p = window.DATA.PEOPLE[m.who] || window.DATA.USER;
  // On the dedicated page we use a clean thread style; drawer respects the treatment tweak.
  const bubble = page ? isUser : treatment !== "minimal";
  const alignRight = isUser && (page || treatment === "bubbles");
  return (
    <div className="col" style={{ gap: 7, alignItems: alignRight ? "flex-end" : "stretch" }}>
      <div className="row gap8" style={{ alignItems: "center", flexDirection: alignRight ? "row-reverse" : "row" }}>
        {!isUser && <window.UI.Avatar person={p} size={page ? 24 : 20} ai />}
        <span className="f-eyebrow" style={{ color: isUser ? "var(--text-faint)" : "var(--accent-text)" }}>{isUser ? "YOU" : "COPILOT"}</span>
        <span className="f-sm faint" style={{ fontSize: 11 }}>· {m.ago}</span>
      </div>
      {/* attached refs on a user message */}
      {m.refs && m.refs.length > 0 && (
        <div className="row gap6" style={{ flexWrap: "wrap", justifyContent: alignRight ? "flex-end" : "flex-start", paddingLeft: bubble ? 0 : 32 }}>
          {m.refs.map((r, i) => <RefChip key={i} r={r} small />)}
        </div>
      )}
      <div className="f-body" style={{
        color: "var(--text-ink)", lineHeight: 1.6,
        background: bubble ? (isUser ? "var(--surface-sunken)" : "var(--accent-wash)") : "transparent",
        border: bubble ? "1px solid " + (isUser ? "var(--border-hairline)" : "color-mix(in srgb, var(--accent) 22%, transparent)") : "none",
        borderRadius: 12, padding: bubble ? "12px 14px" : (isUser ? 0 : "0 0 0 32px"),
        maxWidth: alignRight ? "82%" : "100%",
      }}>{m.text}</div>
      {/* citations */}
      {m.cites && m.cites.length > 0 && (
        <div className="row gap6" style={{ flexWrap: "wrap", paddingLeft: bubble && !isUser ? 0 : 32, alignItems: "center" }}>
          <span className="f-eyebrow" style={{ color: "var(--text-faint)" }}>SOURCES</span>
          {m.cites.map((c, i) => (
            <button key={i} className="row gap6" onClick={() => onRefClick && onRefClick(c)} style={{ background: "var(--surface-sunken)", border: "1px solid var(--border-hairline)", borderRadius: 8, padding: "3px 8px", cursor: "pointer" }}>
              <IconCh name="fileText" size={12} style={{ color: "var(--text-muted)" }} />
              <span className="f-sm" style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{c}</span>
            </button>
          ))}
        </div>
      )}
      {/* action chips */}
      {m.chips && (
        <div className="row gap6" style={{ flexWrap: "wrap", paddingLeft: bubble && !isUser ? 0 : 32 }}>
          {m.chips.map((c, i) => (
            <button key={i} className="pill" onClick={() => onChip(c)} style={{
              background: "var(--surface-card)", border: "1px solid var(--border-strong)", color: "var(--accent-text)",
              fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: 0, fontSize: "var(--fs-sm)", padding: "6px 11px", cursor: "pointer",
              transition: "background var(--dur-fast)",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--accent-wash)"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--surface-card)"}>{c}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Typing indicator -------------------------------------------------
function Typing({ page }) {
  return (
    <div className="row gap8" style={{ alignItems: "center", color: "var(--accent-text)" }}>
      <window.UI.Avatar person={window.DATA.PEOPLE.AI} size={page ? 24 : 20} ai />
      <div className="row gap4" style={{ padding: "8px 0" }}>
        {[0,1,2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: 9999, background: "var(--accent)", animation: `blink 1s ${i*0.2}s infinite` }} />)}
      </div>
    </div>
  );
}

// ---- Reference picker popover -----------------------------------------
function RefPicker({ kind, questions, sources, onPick, onClose }) {
  const [q, setQ] = useStateCh("");
  let items = [];
  if (kind === "question") items = questions.filter(x => x.status !== "answered").map(x => ({ kind, id: x.id, label: x.text, icon: "help" }));
  else if (kind === "source") items = sources.map(x => ({ kind, id: x.id, label: x.name, icon: x.icon }));
  else items = [{ kind: "demand", id: window.DATA.FOCAL.id, label: `${window.DATA.FOCAL.id} · ${window.DATA.FOCAL.title}`, icon: "box" }];
  const filtered = q ? items.filter(i => i.label.toLowerCase().includes(q.toLowerCase())) : items;
  const titleMap = { question: "Attach a question", source: "Attach a source", demand: "Attach the demand" };
  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 70 }} onClick={onClose} />
      <div className="card" style={{ position: "absolute", bottom: "calc(100% + 8px)", left: 0, width: 340, zIndex: 71, boxShadow: "var(--elev-pop)", overflow: "hidden", animation: "scaleIn 160ms var(--ease-out) forwards" }}>
        <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--border-hairline)" }}>
          <window.UI.Eyebrow style={{ marginBottom: 8 }}>{titleMap[kind]}</window.UI.Eyebrow>
          {kind !== "demand" && (
            <div className="row gap8" style={{ background: "var(--surface-sunken)", borderRadius: 8, padding: "6px 9px" }}>
              <IconCh name="search" size={14} style={{ color: "var(--text-faint)" }} />
              <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder={`Search ${kind}s…`} style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: "var(--fs-sm)", color: "var(--text-ink)" }} />
            </div>
          )}
        </div>
        <div className="scroll" style={{ maxHeight: 240, overflowY: "auto", padding: 6 }}>
          {filtered.map(it => (
            <button key={it.id} onClick={() => { onPick(it); onClose(); }} className="row gap8" style={{ width: "100%", textAlign: "left", padding: "9px 10px", borderRadius: 8, alignItems: "flex-start" }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--surface-sunken)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <IconCh name={it.icon} size={15} style={{ color: "var(--accent-text)", marginTop: 1, flex: "none" }} />
              <span className="f-sm" style={{ color: "var(--text-ink)" }}>{it.label}</span>
            </button>
          ))}
          {filtered.length === 0 && <div className="f-sm faint" style={{ padding: 16, textAlign: "center" }}>Nothing to attach</div>}
        </div>
      </div>
    </>
  );
}

// ---- Composer (shared by drawer + page) -------------------------------
function ChatComposer({ val, setVal, refs, setRefs, questions, sources, onSend, onVoice, page }) {
  const [picker, setPicker] = useStateCh(null);
  const taRef = useRefCh(null);
  const addRef = (it) => setRefs(rs => rs.find(r => r.kind === it.kind && r.id === it.id) ? rs : [...rs, it]);
  const removeRef = (it) => setRefs(rs => rs.filter(r => !(r.kind === it.kind && r.id === it.id)));
  const send = () => { if (!val.trim() && refs.length === 0) return; onSend(val.trim(), refs); setVal(""); setRefs([]); };
  const ctxBtns = [["question", "Question"], ["source", "Source"], ["demand", "Demand"]];

  return (
    <div className="card" style={{ padding: 0, overflow: "visible", boxShadow: page ? "var(--elev-1)" : "none", borderColor: page ? "var(--border-strong)" : "var(--border-hairline)" }}>
      {/* attached refs */}
      {refs.length > 0 && (
        <div className="row gap6" style={{ flexWrap: "wrap", padding: "10px 12px 0" }}>
          {refs.map((r, i) => <RefChip key={i} r={r} onRemove={removeRef} />)}
        </div>
      )}
      <textarea ref={taRef} value={val} onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
        rows={page ? 2 : 1} placeholder="Ask about this demand…"
        className="scroll"
        style={{ width: "100%", border: "none", background: "transparent", resize: "none", outline: "none",
          padding: "14px 14px 6px", color: "var(--text-ink)", fontSize: "var(--fs-body)", lineHeight: 1.5, fontFamily: "var(--font-sans)" }} />
      <div className="spread" style={{ padding: "8px 10px 10px 12px", position: "relative" }}>
        <div className="row gap6" style={{ position: "relative" }}>
          <span className="f-eyebrow" style={{ color: "var(--text-faint)", marginRight: 2, alignSelf: "center" }}>ADD CONTEXT</span>
          {ctxBtns.map(([k, l]) => (
            <button key={k} onClick={() => setPicker(p => p === k ? null : k)} className="row gap4" style={{
              border: "1px solid " + (picker === k ? "var(--accent)" : "var(--border-strong)"), borderRadius: 8, padding: "5px 9px",
              background: picker === k ? "var(--accent-wash)" : "var(--surface-card)", color: picker === k ? "var(--accent-text)" : "var(--text-muted)",
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--fs-sm)",
            }}>
              <IconCh name="plus" size={13} /> {l}
            </button>
          ))}
          {picker && <RefPicker kind={picker} questions={questions} sources={sources} onPick={addRef} onClose={() => setPicker(null)} />}
        </div>
        <div className="row gap4">
          <button className="btn btn-ghost btn-sm" style={{ width: 34, height: 34, padding: 0, borderRadius: 9999 }} onClick={onVoice} title="Voice mode"><IconCh name="mic" size={17} /></button>
          <button className="btn btn-primary btn-sm" style={{ width: 36, height: 36, padding: 0, borderRadius: 9999 }} onClick={send} title="Send"><IconCh name="arrowUp" size={17} /></button>
        </div>
      </div>
    </div>
  );
}

// ---- Header (shared) --------------------------------------------------
function ChatHeader({ page, state, onVoice, onToggle, onClose }) {
  return (
    <div className="spread" style={{ padding: page ? "0 20px" : "14px 16px", height: page ? 56 : undefined, borderBottom: "1px solid var(--border-hairline)", flex: "none", background: "var(--surface-card)" }}>
      <div className="row gap10">
        <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--accent-wash)", display: "grid", placeItems: "center", color: "var(--accent-text)" }}><IconCh name="sparkles" size={17} /></div>
        <div className="col" style={{ gap: 2 }}>
          <span className="f-label" style={{ fontWeight: 700 }}>Copilot</span>
          <div className="row gap6">
            <span className="mono f-sm faint" style={{ fontSize: 11 }}>{window.DATA.FOCAL.id}</span>
            <window.UI.StateBadge state={state} size="sm" />
          </div>
        </div>
      </div>
      <div className="row gap4">
        {!page && <button className="btn btn-ghost btn-sm" style={{ width: 32, height: 32, padding: 0 }} onClick={onVoice} title="Voice mode"><IconCh name="mic" size={17} /></button>}
        <button className="btn btn-ghost btn-sm" style={{ height: 32, padding: page ? "0 10px" : 0, width: page ? undefined : 32, gap: 6 }} onClick={onToggle} title={page ? "Dock to panel" : "Open as page"}>
          <IconCh name={page ? "minimize" : "maximize"} size={16} />{page && <span className="f-sm" style={{ fontWeight: 700 }}>Dock</span>}
        </button>
        <button className="btn btn-ghost btn-sm" style={{ width: 32, height: 32, padding: 0 }} onClick={onClose} title="Close"><IconCh name="x" size={18} /></button>
      </div>
    </div>
  );
}

// ---- Main: drawer OR page ---------------------------------------------
function CopilotChat({ open, mode, messages, typing, onSend, onClose, onFullscreen, onVoice, onChip,
                       treatment, questions, sources, artifacts, readiness, state, toast }) {
  const [val, setVal] = useStateCh("");
  const [refs, setRefs] = useStateCh([]);
  const scrollRef = useRefCh(null);
  useEffectCh(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, typing, open, mode]);
  if (!open) return null;
  const page = mode === "fullscreen";

  const composer = (
    <ChatComposer val={val} setVal={setVal} refs={refs} setRefs={setRefs}
      questions={questions} sources={sources} onVoice={onVoice} page={page}
      onSend={(text, r) => onSend(text, r)} />
  );

  // ---------- DEDICATED FULLSCREEN PAGE ----------
  if (page) {
    const openQ = questions.filter(q => q.status !== "answered");
    const draftA = artifacts.filter(a => a.status !== "done");
    const RailRow = ({ icon, label, onClick, tone }) => (
      <button onClick={onClick} className="row gap8" style={{ width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: 8, alignItems: "flex-start" }}
        onMouseEnter={e => e.currentTarget.style.background = "var(--surface-card)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
        <IconCh name={icon} size={15} style={{ color: tone || "var(--text-muted)", marginTop: 1, flex: "none" }} />
        <span className="f-sm clip" style={{ color: "var(--text-ink)" }}>{label}</span>
        <span className="grow" /><IconCh name="plus" size={13} style={{ color: "var(--text-faint)", marginTop: 2, flex: "none" }} />
      </button>
    );
    const addRail = (it) => setRefs(rs => rs.find(r => r.kind === it.kind && r.id === it.id) ? rs : [...rs, it]);

    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 60, background: "var(--surface-canvas)", display: "flex", flexDirection: "column", animation: "fadeInPage 220ms var(--ease-out) forwards" }}>
        <ChatHeader page state={state} onVoice={onVoice} onToggle={onFullscreen} onClose={onClose} />
        <div className="row grow" style={{ minHeight: 0 }}>
          {/* LEFT RAIL — demand context */}
          <div className="scroll" style={{ width: 312, flex: "none", borderRight: "1px solid var(--border-hairline)", overflowY: "auto", padding: 18, background: "var(--surface-card)" }}>
            <window.UI.Eyebrow style={{ marginBottom: 10 }}>THIS DEMAND</window.UI.Eyebrow>
            <div className="card" style={{ padding: 14, marginBottom: 22 }}>
              <div className="row gap12" style={{ alignItems: "center" }}>
                <window.UI.ReadinessRing pct={readiness} size={52} stroke={6} />
                <div className="grow" style={{ minWidth: 0 }}>
                  <div className="f-label clip" style={{ fontWeight: 700, marginBottom: 4 }}>{window.DATA.FOCAL.title}</div>
                  <window.UI.StateBadge state={state} size="sm" />
                </div>
              </div>
            </div>

            <div className="spread" style={{ marginBottom: 8 }}>
              <window.UI.Eyebrow>SOURCES · {sources.length}</window.UI.Eyebrow>
              <span className="f-sm faint" style={{ fontSize: 10 }}>CLICK TO ATTACH</span>
            </div>
            <div className="col" style={{ gap: 2, marginBottom: 22 }}>
              {sources.map(s => <RailRow key={s.id} icon={s.icon} label={s.name} onClick={() => addRail({ kind: "source", id: s.id, label: s.name })} />)}
            </div>

            <window.UI.Eyebrow style={{ marginBottom: 8 }}>OPEN QUESTIONS · {openQ.length}</window.UI.Eyebrow>
            <div className="col" style={{ gap: 2, marginBottom: 22 }}>
              {openQ.map(q => <RailRow key={q.id} icon="help" tone="var(--amber-500)" label={q.text} onClick={() => addRail({ kind: "question", id: q.id, label: q.text })} />)}
              {openQ.length === 0 && <div className="f-sm faint" style={{ padding: "4px 10px" }}>All answered</div>}
            </div>

            <window.UI.Eyebrow style={{ marginBottom: 8 }}>DRAFT ARTIFACTS · {draftA.length}</window.UI.Eyebrow>
            <div className="col" style={{ gap: 2 }}>
              {draftA.map(a => <RailRow key={a.id} icon="box" label={a.name} onClick={() => addRail({ kind: "source", id: a.id, label: a.name })} />)}
              {draftA.length === 0 && <div className="f-sm faint" style={{ padding: "4px 10px" }}>All complete</div>}
            </div>
          </div>

          {/* CENTER — conversation */}
          <div className="col grow" style={{ minWidth: 0, position: "relative" }}>
            <div ref={scrollRef} className="scroll grow" style={{ overflowY: "auto", padding: "28px 24px 24px" }}>
              <div className="col" style={{ maxWidth: 760, margin: "0 auto", gap: 24 }}>
                {/* pinned intro */}
                <div className="row gap10" style={{ alignItems: "flex-start" }}>
                  <window.UI.Avatar person={window.DATA.PEOPLE.AI} size={24} ai />
                  <div className="grow">
                    <div className="row gap8" style={{ marginBottom: 6 }}><span className="f-eyebrow" style={{ color: "var(--accent-text)" }}>COPILOT</span></div>
                    <div className="f-body" style={{ color: "var(--text-ink)", lineHeight: 1.6 }}>
                      I've read this demand's <b>{sources.length} sources</b>. Ask me anything, or attach a specific question or source below and I'll work from it. I can draft artifacts, answer open questions, and flag what's blocking Discovery.
                    </div>
                    {/* suggested prompts */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14 }}>
                      {window.DATA.CHAT_SUGGESTIONS.map((s, i) => (
                        <button key={i} className="card row gap8" style={{ padding: "11px 12px", textAlign: "left", alignItems: "flex-start", transition: "border-color var(--dur-fast), background var(--dur-fast)" }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "var(--accent-wash)"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-hairline)"; e.currentTarget.style.background = "var(--surface-card)"; }}
                          onClick={() => onSend(s.label, [])}>
                          <IconCh name={s.icon} size={15} style={{ color: "var(--accent-text)", marginTop: 1, flex: "none" }} />
                          <span className="f-sm" style={{ color: "var(--text-ink)" }}>{s.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {messages.map(m => <ChatMessage key={m.id} m={m} page onChip={onChip} onRefClick={() => toast && toast("Opening source preview (demo)")} />)}
                {typing && <Typing page />}
              </div>
            </div>
            {/* composer */}
            <div style={{ flex: "none", padding: "0 24px 22px", background: "linear-gradient(to top, var(--surface-canvas) 70%, transparent)" }}>
              <div style={{ maxWidth: 760, margin: "0 auto" }}>
                {composer}
                <div className="f-sm faint" style={{ textAlign: "center", marginTop: 8, fontSize: 11 }}>Copilot can make mistakes — it works only from this demand's sources.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- DOCKED DRAWER ----------
  return (
    <div style={{ position: "fixed", top: 0, right: 0, width: 440, height: "100vh", zIndex: 55,
      background: "var(--surface-card)", borderLeft: "1px solid var(--border-hairline)", boxShadow: "var(--elev-2)",
      display: "flex", flexDirection: "column", animation: "slideInRight 320ms var(--ease-out) forwards" }}>
      <ChatHeader state={state} onVoice={onVoice} onToggle={onFullscreen} onClose={onClose} />
      <div ref={scrollRef} className="scroll grow" style={{ overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 18 }}>
        {messages.map(m => <ChatMessage key={m.id} m={m} treatment={treatment} onChip={onChip} onRefClick={() => toast && toast("Opening source preview (demo)")} />)}
        {typing && <Typing />}
      </div>
      <div style={{ padding: 14, borderTop: "1px solid var(--border-hairline)", flex: "none" }}>{composer}</div>
    </div>
  );
}

// ---- Voice mode overlay ----------------------------------------------
function VoiceMode({ open, onClose, onMessage }) {
  const [paused, setPaused] = useStateCh(false);
  useEffectCh(() => { if (open) setPaused(false); }, [open]);
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80, background: "color-mix(in srgb, var(--surface-canvas) 92%, transparent)", backdropFilter: "blur(6px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32, animation: "fadeInPage 200ms forwards" }}>
      <button className="btn btn-ghost" style={{ position: "absolute", top: 24, right: 24, width: 40, height: 40, padding: 0, borderRadius: 9999 }} onClick={onClose}><IconCh name="x" size={20} /></button>
      <window.UI.Eyebrow style={{ color: paused ? "var(--text-faint)" : "var(--accent-text)" }}>{paused ? "MIC PAUSED" : "COPILOT LISTENING"}</window.UI.Eyebrow>
      <div style={{ position: "relative", width: 200, height: 200, display: "grid", placeItems: "center" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 9999, background: "var(--accent-wash)", animation: paused ? "none" : "pulse 2s ease-in-out infinite" }} />
        <div style={{ position: "absolute", inset: 30, borderRadius: 9999, background: "color-mix(in srgb, var(--accent) 18%, transparent)", animation: paused ? "none" : "pulse 2s 0.4s ease-in-out infinite" }} />
        <div style={{ width: 96, height: 96, borderRadius: 9999, background: "var(--accent)", display: "grid", placeItems: "center", color: "#fff", zIndex: 1 }}><IconCh name={paused ? "micOff" : "mic"} size={36} /></div>
      </div>
      <div className="row gap4" style={{ alignItems: "center", height: 40 }}>
        {Array.from({ length: 28 }).map((_, i) => (
          <span key={i} style={{ width: 4, height: 36, borderRadius: 3, background: "var(--accent)", opacity: 0.8, transformOrigin: "center", animation: paused ? "none" : `voicePulse ${0.7 + (i%5)*0.12}s ${i*0.05}s ease-in-out infinite`, transform: paused ? "scaleY(0.15)" : undefined }} />
        ))}
      </div>
      <div className="f-body muted" style={{ maxWidth: 460, textAlign: "center" }}>
        {paused ? "Tap resume to keep talking. Everything you say becomes a contribution." : "Talk through the demand — the copilot transcribes and turns it into artifacts and questions."}
      </div>
      <div className="row gap12">
        <button className="btn btn-secondary btn-lg" onClick={() => setPaused(p => !p)}>{paused ? "Resume" : "Pause"}</button>
        <window.UI.Button variant="primary" size="lg" icon="check" onClick={() => { onMessage && onMessage(); onClose(); }}>Done</window.UI.Button>
      </div>
    </div>
  );
}

window.CopilotChat = CopilotChat;
window.VoiceMode = VoiceMode;
