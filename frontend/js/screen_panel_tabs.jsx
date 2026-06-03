// screen_panel_tabs.jsx — Demand Panel tab contents.
// "Add information" = Composer + ContributionsFeed (pure input channel).
// "Questions"       = Merged with task urgency/confidence/accept inline.
// "Artifacts"       = Merged with task urgency inline.
// window.PanelAddInfo / PanelArtifacts / PanelQuestions / PanelSources / PanelAudit

const { useState: useStateT } = React;
const IconT = window.Icon;

// ── TYPE TAG (AUDIO · TEXT · FILE) ────────────────────────────────────
function KindTypeTag({ kind }) {
  const icons = { AUDIO: "mic", TEXT: "pencil", FILE: "fileText", LINK: "link", IMAGE: "eye" };
  return (
    <span className="pill" style={{
      background: "var(--surface-sunken)", padding: "2px 6px 2px 5px",
      fontSize: 9, letterSpacing: "0.06em", color: "var(--text-muted)",
      fontFamily: "var(--font-mono)", display: "flex", alignItems: "center", gap: 4,
    }}>
      <IconT name={icons[kind] || "fileText"} size={10} style={{ flex: "none" }} />
      {kind}
    </span>
  );
}

// ── URGENCY BADGE ────────────────────────────────────────────────────
function UrgencyBadge({ urgency }) {
  const colors = { high: ["var(--red-50)", "var(--red-600)"], mid: ["var(--amber-50)", "var(--amber-600)"], low: ["var(--surface-sunken)", "var(--text-muted)"] };
  const [bg, fg] = colors[urgency] || colors.low;
  return <span className="pill" style={{ background: bg, color: fg, fontSize: 9, letterSpacing: "0.06em", fontFamily: "var(--font-mono)", padding: "2px 6px" }}>{urgency.toUpperCase()}</span>;
}

// ── COMPOSER ─────────────────────────────────────────────────────────
function Composer({ onSend, onOpenModal, toast }) {
  const [val, setVal] = useStateT("");
  const [rec, setRec] = useStateT(false);
  return (
    <div className="card" style={{ padding: 20, marginBottom: 20 }}>
      <window.UI.Eyebrow style={{ marginBottom: 8 }}>ADD INFORMATION</window.UI.Eyebrow>
      <div className="f-label" style={{ marginBottom: 4 }}>How do you want to enrich this demand?</div>
      <div className="f-sm muted" style={{ marginBottom: 14, lineHeight: 1.5 }}>Text, audio or files — each input feeds the copilot, which updates artifacts and questions.</div>
      <div className="field" style={{ padding: 0, background: "var(--surface-canvas)", overflow: "hidden" }}>
        <textarea className="scroll" value={val} onChange={e => setVal(e.target.value)} rows={3}
          placeholder="Type an update, attach a file or record audio…"
          style={{ width: "100%", border: "none", background: "transparent", resize: "none",
            padding: "12px 12px 0", color: "var(--text-ink)", fontSize: "var(--fs-body)",
            lineHeight: 1.5, outline: "none", fontFamily: "var(--font-sans)" }} />
        <div className="spread" style={{ padding: "8px 12px" }}>
          <div className="row gap12">
            <button className="row gap4 f-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)", fontWeight: 700 }}
              onClick={() => onOpenModal({ type: "attach" })}><IconT name="paperclip" size={16} /> Attach file</button>
            <button className="row gap4 f-sm" style={{ color: rec ? "var(--red-600)" : "var(--text-muted)", fontFamily: "var(--font-display)", fontWeight: 700 }}
              onClick={() => { setRec(r => !r); toast(rec ? "Recording stopped" : "Listening… (demo)"); }}>
              <IconT name="mic" size={16} /> Record audio
            </button>
          </div>
          <window.UI.Button variant="primary" size="md" iconRight="arrowRight" disabled={!val.trim()}
            onClick={() => { onSend(val.trim()); setVal(""); }}>Send</window.UI.Button>
        </div>
      </div>
      {rec && (
        <div className="row gap8" style={{ marginTop: 10 }}>
          <span className="row gap4" style={{ alignItems: "flex-end", height: 14 }}>
            {[0,1,2,3,4].map(i => <span key={i} style={{ width: 3, height: 14, background: "var(--red-600)", borderRadius: 2, transformOrigin: "bottom", animation: `voicePulse 0.9s ${i*0.12}s ease-in-out infinite` }} />)}
          </span>
          <span className="f-sm" style={{ color: "var(--red-600)" }}>Listening · transcribes to a contribution when you stop</span>
        </div>
      )}
    </div>
  );
}

// ── CONTRIBUTION CARD (faithful to Figma "B4 · Contribuição aprovada") ─
function ContributionCard({ c, onOpenChat, onEditContribution, onApproveContribution }) {
  const D = window.DATA;
  const p = D.PEOPLE[c.who];
  const isAuthor = c.who === D.USER.initials;
  const isPending = c.status === "pending";
  const [editing, setEditing] = useStateT(false);
  const [draft, setDraft] = useStateT(c.text);

  const saveEdit = () => {
    if (draft.trim() && draft.trim() !== c.text) onEditContribution(c.id, draft.trim());
    setEditing(false);
  };

  return (
    <div className="card" style={{ padding: "12px 16px", marginBottom: 12,
      borderColor: isPending ? "var(--amber-500)" : "var(--border-hairline)" }}>

      {/* Header row */}
      <div className="row gap8" style={{ marginBottom: 10, alignItems: "flex-start" }}>
        <window.UI.Avatar person={p} size={28} />
        <div className="col grow" style={{ gap: 2 }}>
          <div className="row gap6" style={{ alignItems: "center" }}>
            <span className="f-sm" style={{ fontWeight: 700, color: "var(--text-ink)" }}>{p.name}</span>
            <KindTypeTag kind={c.kind} />
            {isPending
              ? <span className="pill" style={{ background: "var(--amber-50)", color: "var(--amber-600)", fontSize: 9, letterSpacing: "0.05em" }}>PENDING APPROVAL</span>
              : <span className="pill row gap4" style={{ background: "var(--green-50)", color: "var(--green-600)", fontSize: 9, letterSpacing: "0.05em" }}>
                  <IconT name="checkCircle" size={10} />APPROVED
                </span>}
          </div>
          <span className="f-sm faint" style={{ fontSize: 11 }}>{c.ago}</span>
        </div>
        {/* Author edit button — only on pending contributions */}
        {isAuthor && isPending && !editing && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setDraft(c.text); setEditing(true); }} title="Edit">
            <IconT name="pencil" size={14} />
          </button>
        )}
      </div>

      {/* Body — inline edit or read */}
      {editing ? (
        <div className="col gap8" style={{ marginBottom: 10 }}>
          <textarea className="field scroll" value={draft} onChange={e => setDraft(e.target.value)} rows={3}
            style={{ resize: "none", lineHeight: 1.5 }} autoFocus />
          <div className="row gap8">
            <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>Cancel</button>
            <button className="btn btn-secondary btn-sm" onClick={saveEdit} disabled={!draft.trim()}>Save edit</button>
          </div>
        </div>
      ) : (
        <div className="f-body" style={{ color: "var(--text-ink)", lineHeight: 1.55, marginBottom: 10 }}>{c.text}</div>
      )}

      {/* AI extracted note */}
      {c.aiExtracted && !editing && (
        <div className="row gap6" style={{ padding: "6px 10px", background: "var(--accent-wash)", borderRadius: 6, marginBottom: 8, alignItems: "flex-start" }}>
          <IconT name="sparkles" size={13} style={{ color: "var(--accent-text)", flex: "none", marginTop: 1 }} />
          <span className="f-sm" style={{ color: "var(--accent-text)", lineHeight: 1.45 }}>{c.aiExtracted}</span>
        </div>
      )}
      {!c.aiExtracted && !editing && (
        <div className="row gap6" style={{ padding: "6px 10px", background: "var(--surface-sunken)", borderRadius: 6, marginBottom: 8, alignItems: "center" }}>
          <IconT name="sparkles" size={13} style={{ color: "var(--text-faint)", flex: "none" }} />
          <span className="f-sm faint">Copilot is processing this contribution…</span>
        </div>
      )}

      {/* Footer actions */}
      {!editing && (
        <div className="row gap12" style={{ marginTop: 4 }}>
          {/* Pending contributions must be approved before they're considered */}
          {isAuthor && isPending && (
            <button className="btn btn-primary btn-sm" onClick={() => onApproveContribution(c.id)}>
              Approve
            </button>
          )}
          <button className="lnk f-sm row gap4" onClick={onOpenChat} style={{ color: "var(--text-muted)" }}>
            <IconT name="message" size={13} />Discuss with AI
          </button>
          {isPending && (
            <span className="f-sm faint" style={{ marginLeft: "auto" }}>Not considered until approved</span>
          )}
        </div>
      )}
    </div>
  );
}

// ── ADD INFORMATION TAB ───────────────────────────────────────────────
function PanelAddInfo({ contributions, onSend, onOpenModal, onOpenChat, onEditContribution, onApproveContribution, toast }) {
  const approvedCount = contributions.filter(c => c.status === "approved").length;
  const pendingCount  = contributions.filter(c => c.status === "pending").length;
  return (
    <div className="anim-fade">
      <Composer onSend={onSend} onOpenModal={onOpenModal} toast={toast} />

      {/* Contributions feed */}
      <div className="spread" style={{ marginBottom: 12 }}>
        <div className="row gap8">
          <window.UI.Eyebrow>CONTRIBUTIONS</window.UI.Eyebrow>
          <span className="f-label muted" style={{ fontSize: "var(--fs-sm)" }}>· {contributions.length}</span>
          {pendingCount > 0 && (
            <span className="pill" style={{ background: "var(--amber-50)", color: "var(--amber-600)", fontSize: 9 }}>
              {pendingCount} PENDING APPROVAL
            </span>
          )}
          {approvedCount > 0 && (
            <span className="pill row gap4" style={{ background: "var(--green-50)", color: "var(--green-600)", fontSize: 9 }}>
              <IconT name="checkCircle" size={10} />{approvedCount} APPROVED
            </span>
          )}
        </div>
        <span className="f-sm faint">Most recent first</span>
      </div>

      {contributions.length === 0 ? (
        <div className="card col" style={{ alignItems: "center", padding: 40, gap: 6 }}>
          <IconT name="inbox" size={24} style={{ color: "var(--text-faint)" }} />
          <div className="f-label muted">No contributions yet</div>
          <div className="f-sm faint">Send a note above — the copilot reads it and updates artifacts & questions.</div>
        </div>
      ) : (
        <div className="col">
          {contributions.map(c => (
            <ContributionCard key={c.id} c={c} onOpenChat={onOpenChat}
              onEditContribution={onEditContribution} onApproveContribution={onApproveContribution} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── QUESTIONS TAB — merged with task urgency/confidence inline ─────────
function PanelQuestions({ questions, tasks, onOpenModal, onResolveTask, toast, readOnly }) {
  // build a quick-lookup: question id → task
  const taskByQ = {};
  tasks.forEach(t => { if (t.kind === "question") taskByQ[t.refId] = t; });

  const unanswered = questions.filter(q => q.status !== "answered");
  const answered   = questions.filter(q => q.status === "answered");

  return (
    <div className="anim-fade col gap12">
      {/* Unanswered */}
      {unanswered.length > 0 && (
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--border-hairline)", background: "var(--surface-sunken)" }}>
            <window.UI.Eyebrow style={{ color: "var(--text-muted)" }}>OPEN · {unanswered.length}</window.UI.Eyebrow>
          </div>
          {unanswered.map((q, i) => {
            const task = taskByQ[q.id];
            const resolved = task && task.resolved;
            return (
              <div key={q.id} style={{ padding: "16px 20px", borderTop: i ? "1px solid var(--border-hairline)" : "none" }}>
                <div className="row gap10" style={{ alignItems: "flex-start", marginBottom: 8 }}>
                  {task && !resolved
                    ? <window.UI.ConfidenceDot value={task.conf} />
                    : <IconT name="help" size={16} style={{ color: "var(--amber-500)", flex: "none", marginTop: 1 }} />}
                  <div className="grow">
                    <div className="row gap6" style={{ marginBottom: 4, flexWrap: "wrap" }}>
                      <span className="f-label" style={{ fontWeight: 600 }}>{q.text}</span>
                    </div>
                    <div className="row gap6" style={{ flexWrap: "wrap", marginBottom: q.hint ? 8 : 0 }}>
                      {task && !resolved && <UrgencyBadge urgency={task.urgency} />}
                      {task && !resolved && <span className="f-sm faint" style={{ fontSize: 11 }}>Copilot confidence {Math.round(task.conf * 100)}%</span>}
                    </div>
                    {q.hint && (
                      <div className="row gap6" style={{ marginTop: 6 }}>
                        <IconT name="sparkles" size={13} style={{ color: "var(--accent-text)" }} />
                        <span className="f-sm faint">{q.hint}</span>
                      </div>
                    )}
                  </div>
                  {!readOnly && (
                    <button className="lnk f-sm row gap4" style={{ flex: "none" }} onClick={() => onOpenModal({ type: "answer", id: q.id, taskId: task && task.id })}>
                      Answer <IconT name="arrowRight" size={14} />
                    </button>
                  )}
                </div>
                {/* Copilot suggestion with accept */}
                {!readOnly && q.suggestion && task && !resolved && (
                  <div className="row gap8" style={{ padding: "8px 12px", background: "var(--accent-wash)", borderRadius: 8, alignItems: "flex-start", marginLeft: 26 }}>
                    <IconT name="sparkles" size={14} style={{ color: "var(--accent-text)", flex: "none", marginTop: 2 }} />
                    <span className="f-sm grow" style={{ color: "var(--text-ink)", lineHeight: 1.45 }}>{q.suggestion}</span>
                    <button className="btn btn-primary btn-sm" style={{ flex: "none" }}
                      onClick={() => { onResolveTask({ taskId: task.id, refId: q.id, kind: "question", value: q.suggestion }); toast("Accepted copilot answer"); }}>
                      Accept
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Answered */}
      {answered.length > 0 && (
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--border-hairline)", background: "var(--surface-sunken)" }}>
            <window.UI.Eyebrow style={{ color: "var(--green-600)" }}>ANSWERED · {answered.length}</window.UI.Eyebrow>
          </div>
          {answered.map((q, i) => (
            <div key={q.id} style={{ padding: "16px 20px", borderTop: i ? "1px solid var(--border-hairline)" : "none" }}>
              <div className="row gap10" style={{ alignItems: "flex-start" }}>
                <IconT name="checkCircle" size={16} style={{ color: "var(--green-600)", flex: "none", marginTop: 1 }} />
                <div className="grow">
                  <div className="f-label" style={{ fontWeight: 600, marginBottom: 6 }}>{q.text}</div>
                  <div className="f-sm" style={{ color: "var(--text-muted)", lineHeight: 1.5 }}>{q.answer}</div>
                </div>
                {!readOnly && (
                  <button className="btn btn-ghost btn-sm" onClick={() => onOpenModal({ type: "answer", id: q.id })}><IconT name="pencil" size={14} /></button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {questions.length === 0 && (
        <div className="card col" style={{ alignItems: "center", padding: 40, gap: 6 }}>
          <IconT name="checkCircle" size={28} style={{ color: "var(--green-600)" }} />
          <div className="f-label">All questions answered</div>
        </div>
      )}
    </div>
  );
}

// ── ARTIFACTS TAB — merged with task urgency inline ───────────────────
function PanelArtifacts({ artifacts, tasks, onOpenModal, onResolveTask, toast, readOnly, frozenSnap }) {
  const taskByA = {};
  tasks.forEach(t => { if (t.kind === "artifact") taskByA[t.refId] = t; });

  const snapBy = {};
  if (frozenSnap) frozenSnap.artifacts.forEach(a => { snapBy[a.id] = a; });

  return (
    <div className="anim-fade" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {artifacts.map(a => {
        const done = a.status === "done";
        const task = taskByA[a.id];
        const changed = frozenSnap && snapBy[a.id] && snapBy[a.id].body !== a.body;
        return (
          <div key={a.id} className="card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 8,
            borderColor: changed ? "var(--tide-500)" : done ? "var(--border-hairline)" : (task && !task.resolved && !readOnly ? "var(--border-strong)" : "var(--border-hairline)") }}>
            <div className="spread">
              <div className="row gap8" style={{ flexWrap: "wrap" }}>
                <IconT name={done ? "checkCircle" : "box"} size={16} style={{ color: done ? "var(--green-600)" : "var(--text-faint)", flex: "none" }} />
                <span className="f-label" style={{ fontWeight: 700 }}>{a.name}</span>
                {changed && <span className="pill" style={{ background: "var(--tide-50)", color: "var(--tide-600)", fontSize: 9 }}>CHANGED IN v2</span>}
              </div>
              <div className="row gap6">
                {!done && task && !task.resolved && !readOnly && <UrgencyBadge urgency={task.urgency} />}
                {readOnly
                  ? (done ? <IconT name="lock" size={13} style={{ color: "var(--text-faint)" }} /> : <span className="pill" style={{ background: "var(--surface-sunken)", color: "var(--text-faint)", fontSize: 9 }}>EMPTY</span>)
                  : done
                    ? <button className="btn btn-ghost btn-sm" onClick={() => onOpenModal({ type: "fillArtifact", id: a.id })}><IconT name="pencil" size={14} /></button>
                    : <span className="pill" style={{ background: "var(--surface-sunken)", color: "var(--text-faint)", fontSize: 9 }}>EMPTY</span>}
              </div>
            </div>

            {done ? (
              <div className="f-sm" style={{ color: "var(--text-muted)", lineHeight: 1.5 }}>{a.body}</div>
            ) : readOnly ? (
              <span className="f-sm faint">Not filled in this version</span>
            ) : (
              <div className="col gap8">
                {task && !task.resolved && task.conf < 0.6 && (
                  <div className="row gap6" style={{ alignItems: "center" }}>
                    <window.UI.ConfidenceDot value={task.conf} />
                    <span className="f-sm faint" style={{ fontSize: 11 }}>Copilot confidence {Math.round(task.conf * 100)}%</span>
                  </div>
                )}
                <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                  <span className="f-sm faint">Not filled yet</span>
                  <button className="lnk f-sm row gap4" onClick={() => onOpenModal({ type: "fillArtifact", id: a.id, taskId: task && task.id })}>
                    Fill in <IconT name="arrowRight" size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── SOURCES TAB ───────────────────────────────────────────────────────
function PanelSources({ sources, onOpenModal, readOnly }) {
  return (
    <div className="anim-fade">
      {!readOnly && (
        <div className="row gap8" style={{ marginBottom: 14, padding: "12px 16px", background: "var(--accent-wash)", borderRadius: 10 }}>
          <IconT name="sparkles" size={16} style={{ color: "var(--accent-text)" }} />
          <span className="f-sm grow" style={{ color: "var(--text-ink)" }}>The copilot reads every source to draft artifacts and answer questions. Add more to raise confidence.</span>
          <window.UI.Button variant="primary" size="sm" icon="plus" onClick={() => onOpenModal({ type: "addSource" })}>Add source</window.UI.Button>
        </div>
      )}
      <div className="col gap12">
        {sources.map(s => (
          <div key={s.id} className="card" style={{ padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--surface-sunken)", display: "grid", placeItems: "center", color: "var(--text-muted)", flex: "none" }}>
              <IconT name={s.icon} size={20} />
            </div>
            <div className="grow" style={{ minWidth: 0 }}>
              <div className="f-label clip" style={{ fontWeight: 600 }}>{s.name}</div>
              <div className="f-sm faint clip" style={{ marginTop: 3 }}>{s.meta}</div>
            </div>
            <button className="btn btn-ghost btn-sm" title="Preview"><IconT name="eye" size={16} /></button>
            {!readOnly && <button className="btn btn-ghost btn-sm" title="Remove"><IconT name="trash" size={16} /></button>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── HISTORY · AUDIT TAB ───────────────────────────────────────────────
function PanelAudit() {
  const D = window.DATA;
  return (
    <div className="anim-fade">
      <div className="row gap8" style={{ marginBottom: 14, padding: "12px 16px", background: "var(--surface-sunken)", borderRadius: 10, alignItems: "center" }}>
        <IconT name="lock" size={16} style={{ color: "var(--text-muted)" }} />
        <span className="f-sm grow" style={{ color: "var(--text-muted)" }}>Immutable audit. Every event is server-timestamped and chained with a cryptographic hash.</span>
        <button className="btn btn-ghost btn-sm">Export CSV</button>
        <button className="btn btn-ghost btn-sm">Export JSON</button>
      </div>
      <div className="card" style={{ overflow: "hidden" }}>
        <div className="row" style={{ padding: "10px 18px", background: "var(--surface-sunken)", borderBottom: "1px solid var(--border-hairline)", gap: 14 }}>
          <div className="f-eyebrow" style={{ width: 168, flex: "none", color: "var(--text-faint)" }}>TIMESTAMP (UTC)</div>
          <div className="f-eyebrow" style={{ width: 54, flex: "none", color: "var(--text-faint)" }}>ACTOR</div>
          <div className="f-eyebrow grow" style={{ color: "var(--text-faint)" }}>EVENT</div>
          <div className="f-eyebrow" style={{ width: 80, flex: "none", color: "var(--text-faint)" }}>HASH</div>
        </div>
        {D.AUDIT.map((e, i) => {
          const p = D.PEOPLE[e.actor] || D.PEOPLE.AI;
          return (
            <div key={e.id} className="row gap14" style={{ padding: "12px 18px", borderTop: i ? "1px solid var(--border-hairline)" : "none", alignItems: "center" }}>
              <span className="mono f-sm faint" style={{ width: 168, flex: "none", fontSize: 11 }}>{e.ts}</span>
              <div style={{ width: 54, flex: "none" }}>
                {e.actor === "AI"
                  ? <span className="pill" style={{ background: "var(--accent-wash)", color: "var(--accent-text)", fontSize: 10 }}>AI</span>
                  : <window.UI.Avatar person={p} size={22} />}
              </div>
              <span className="f-sm grow" style={{ color: "var(--text-ink)" }}>{e.event}</span>
              <span className="mono f-sm faint" style={{ width: 80, flex: "none", fontSize: 11 }}>{e.hash}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { PanelAddInfo, PanelArtifacts, PanelQuestions, PanelSources, PanelAudit });
