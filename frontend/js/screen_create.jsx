// screen_create.jsx — B2 New demand (2-step takeover). Exposes window.CreateDemand.
const { useState: useStateN } = React;
const IconN = window.Icon;
const UIN = window.UI;

function CreateDemand({ onCancel, onCreate, toast }) {
  const [step, setStep] = useStateN(1);
  const [title, setTitle] = useStateN("B2B partner SSO/SAML authentication");
  const [desc, setDesc] = useStateN("B2B partners can't do SSO into our portal because their SAML doesn't match ours. Today we lose about 18% of new partners in onboarding because of it, and Sales is begging us to fix it before Q3. I attached the CISO deck with the analysis and the meeting transcript.");
  const [evidence, setEvidence] = useStateN([{ id: "e1", name: "payments-Q3-deck.pdf", icon: "fileText" }, { id: "e2", name: "CISO interview transcript", icon: "fileText" }]);
  const [recording, setRecording] = useStateN(false);
  const [assignee, setAssignee] = useStateN("HS");
  const [deadline, setDeadline] = useStateN("2026-06-12");
  const [priority, setPriority] = useStateN("high");

  const slimHeader = (
    <div style={{ height: 56, flex: "none", borderBottom: "1px solid var(--border-hairline)", display: "flex", alignItems: "center", padding: "0 32px", background: "var(--surface-card)" }}>
      <div className="row gap8">
        <div style={{ width: 26, height: 26, borderRadius: 6, background: "var(--accent)" }} />
        <span className="f-label" style={{ fontSize: 16 }}>Intake</span>
      </div>
      <div className="grow" />
      <window.UI.Eyebrow>NEW DEMAND · STEP {step} OF 2</window.UI.Eyebrow>
      <button className="btn btn-ghost btn-sm" style={{ marginLeft: 16, width: 30, height: 30, padding: 0 }} onClick={onCancel}><IconN name="x" size={18} /></button>
    </div>
  );

  const stepBar = (
    <div className="row gap8" style={{ marginBottom: 28 }}>
      {[1, 2].map(n => (
        <div key={n} style={{ height: 4, flex: 1, borderRadius: 9999, background: n <= step ? "var(--accent)" : "var(--surface-sunken)", transition: "background var(--dur-base)" }} />
      ))}
    </div>
  );

  return (
    <div className="anim-screen" style={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column", background: "var(--surface-canvas)" }}>
      {slimHeader}
      <div className="app-scroll scroll" style={{ padding: "56px 32px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <button className="row gap4 f-sm muted" onClick={() => step === 1 ? onCancel() : setStep(1)} style={{ marginBottom: 18 }}>
            <IconN name="arrowLeft" size={14} /> Back
          </button>
          {stepBar}

          {step === 1 && (
            <div className="anim-up">
              <div className="f-h1" style={{ marginBottom: 8 }}>Capture your demand</div>
              <div className="f-body muted" style={{ marginBottom: 32, maxWidth: 600 }}>
                Tell it like you're talking to a colleague — or click the mic and speak. In the next step you'll add evidence and files.
              </div>

              <div className="col gap8" style={{ marginBottom: 24 }}>
                <window.UI.Eyebrow>TITLE</window.UI.Eyebrow>
                <input className="field" value={title} onChange={e => setTitle(e.target.value)} placeholder="A short name for the demand" style={{ height: 42 }} />
              </div>

              <div className="col gap8" style={{ marginBottom: 24 }}>
                <window.UI.Eyebrow>DESCRIPTION</window.UI.Eyebrow>
                <div style={{ position: "relative" }}>
                  <textarea className="field scroll" value={desc} onChange={e => setDesc(e.target.value)} rows={6} style={{ resize: "none", lineHeight: 1.6, paddingRight: 52 }} />
                  <button onClick={() => { setRecording(r => !r); toast(recording ? "Recording stopped" : "Listening… (demo)"); }}
                    style={{ position: "absolute", right: 10, bottom: 10, width: 36, height: 36, borderRadius: 9999,
                      background: recording ? "var(--red-600)" : "var(--surface-card)", border: "1px solid var(--border-strong)",
                      display: "grid", placeItems: "center", color: recording ? "#fff" : "var(--text-muted)" }}>
                    <IconN name="mic" size={18} />
                  </button>
                </div>
                {recording && (
                  <div className="row gap8" style={{ color: "var(--red-600)" }}>
                    <span className="row gap4" style={{ alignItems: "flex-end", height: 14 }}>
                      {[0,1,2,3,4].map(i => <span key={i} style={{ width: 3, height: 14, background: "var(--red-600)", borderRadius: 2, transformOrigin: "bottom", animation: `voicePulse 0.9s ${i*0.12}s ease-in-out infinite` }} />)}
                    </span>
                    <span className="f-sm" style={{ color: "var(--red-600)" }}>Listening · speak naturally, we'll transcribe</span>
                  </div>
                )}
              </div>

              <div className="col gap12" style={{ marginBottom: 36 }}>
                <window.UI.Eyebrow>EVIDENCE</window.UI.Eyebrow>
                <div className="f-sm muted" style={{ marginTop: -6 }}>Attach what you already have — decks, transcripts, spreadsheets, audio.</div>
                <div className="row gap8" style={{ flexWrap: "wrap" }}>
                  {evidence.map(e => (
                    <div key={e.id} className="row gap6 card" style={{ padding: "7px 10px 7px 9px", borderRadius: 8 }}>
                      <span style={{ color: "var(--text-muted)", display: "flex" }}><IconN name={e.icon} size={15} /></span>
                      <span className="f-sm">{e.name}</span>
                      <button onClick={() => setEvidence(ev => ev.filter(x => x.id !== e.id))} style={{ color: "var(--text-faint)", display: "flex" }}><IconN name="x" size={13} /></button>
                    </div>
                  ))}
                  <window.UI.Button variant="ghost" icon="paperclip" onClick={() => { const id = "e" + Date.now(); setEvidence(ev => [...ev, { id, name: "onboarding-funnel.csv", icon: "fileText" }]); toast("Attached onboarding-funnel.csv"); }}>Attach file</window.UI.Button>
                  <window.UI.Button variant="ghost" icon="mic" onClick={() => toast("Recorder opened (demo)")}>Record audio</window.UI.Button>
                </div>
              </div>

              <div className="row" style={{ justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-hairline)", paddingTop: 18 }}>
                <div className="row gap6 f-sm muted"><IconN name="sparkles" size={15} style={{ color: "var(--accent-text)" }} /> Copilot will draft artifacts & questions from this</div>
                <window.UI.Button variant="primary" iconRight="arrowRight" disabled={!title.trim()} onClick={() => setStep(2)}>Continue</window.UI.Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="anim-up">
              <div className="f-h1" style={{ marginBottom: 8 }}>Set it up</div>
              <div className="f-body muted" style={{ marginBottom: 32, maxWidth: 600 }}>
                A few details so the right people see it. The copilot already detected a draft for you.
              </div>

              {/* AI detected preview */}
              <div className="card" style={{ padding: 18, marginBottom: 24, background: "var(--accent-wash)", borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)" }}>
                <div className="row gap6" style={{ marginBottom: 10 }}>
                  <IconN name="sparkles" size={15} style={{ color: "var(--accent-text)" }} />
                  <window.UI.Eyebrow style={{ color: "var(--accent-text)" }}>COPILOT DETECTED</window.UI.Eyebrow>
                </div>
                <div className="row gap16" style={{ flexWrap: "wrap" }}>
                  {[["Type", "Capability gap"], ["Area", "Authentication · B2B"], ["Suggested reach", "≈14 partners"], ["Drafted artifacts", "3 of 8"]].map(([k, v]) => (
                    <div key={k} className="col" style={{ gap: 3, minWidth: 120 }}>
                      <span className="f-sm faint" style={{ fontSize: 11 }}>{k}</span>
                      <span className="f-label" style={{ fontWeight: 600 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="row gap16" style={{ marginBottom: 24, flexWrap: "wrap" }}>
                <div className="col gap8 grow" style={{ minWidth: 220 }}>
                  <window.UI.Eyebrow>OWNER</window.UI.Eyebrow>
                  <div className="row gap8 field" style={{ height: 42, alignItems: "center", cursor: "default" }}>
                    <window.UI.Avatar person={window.DATA.USER} size={26} />
                    <span className="f-body">{window.DATA.USER.name} · you</span>
                  </div>
                </div>
                <div className="col gap8 grow" style={{ minWidth: 220 }}>
                  <window.UI.Eyebrow>DEADLINE</window.UI.Eyebrow>
                  <input type="date" className="field" value={deadline} onChange={e => setDeadline(e.target.value)} style={{ height: 42 }} />
                </div>
              </div>

              <div className="col gap8" style={{ marginBottom: 36 }}>
                <window.UI.Eyebrow>PRIORITY</window.UI.Eyebrow>
                <div className="row gap8">
                  {[["high", "High"], ["mid", "Medium"], ["low", "Low"]].map(([k, l]) => (
                    <button key={k} onClick={() => setPriority(k)} className="btn btn-md" style={{
                      flex: 1, border: "1px solid " + (priority === k ? "var(--accent)" : "var(--border-strong)"),
                      background: priority === k ? "var(--accent-wash)" : "var(--surface-card)",
                      color: priority === k ? "var(--accent-text)" : "var(--text-muted)",
                    }}>{l}</button>
                  ))}
                </div>
              </div>

              <div className="row" style={{ justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-hairline)", paddingTop: 18 }}>
                <button className="btn btn-ghost btn-md" onClick={() => setStep(1)}>Back</button>
                <window.UI.Button variant="primary" iconRight="arrowRight" onClick={onCreate}>Create demand</window.UI.Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

window.CreateDemand = CreateDemand;
