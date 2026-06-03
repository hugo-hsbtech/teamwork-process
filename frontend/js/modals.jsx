// modals.jsx — all demand modals. window.DemandModals
const { useState: useStateM } = React;
const IconM = window.Icon;
const ModalM = window.UI.Modal;
const ButtonM = window.UI.Button;

const ARTIFACT_DRAFTS = {
  a4: "Reduce partner onboarding drop-off at the auth step from ~18% to under 5% within one quarter of launch.",
  a5: "≈14 partners in active onboarding (CISO transcript). Sales pipeline likely adds more — flagged for confirmation.",
  a6: "Support SP-initiated SAML 2.0; map partner IdP attributes (Okta, Azure AD, Ping) to our schema; no PII in assertions (SOC2).",
  a7: "Dependency on Security review (SOC2). Risk: partner IdP variance may require per-partner attribute mapping.",
  a8: "OAuth/OIDC partners, consumer SSO, and SCIM provisioning are out of scope for v1.",
};

function SuggestionBlock({ text, onUse }) {
  if (!text) return null;
  return (
    <div className="row gap8" style={{ background: "var(--accent-wash)", borderRadius: 10, padding: "12px 14px", marginBottom: 14, alignItems: "flex-start" }}>
      <IconM name="sparkles" size={15} style={{ color: "var(--accent-text)", marginTop: 2, flex: "none" }} />
      <div className="grow">
        <window.UI.Eyebrow style={{ color: "var(--accent-text)", marginBottom: 5 }}>COPILOT SUGGESTION</window.UI.Eyebrow>
        <div className="f-sm" style={{ color: "var(--text-ink)" }}>{text}</div>
      </div>
      <button className="btn btn-secondary btn-sm" style={{ flex: "none" }} onClick={onUse}>Use</button>
    </div>
  );
}

function DemandModals({ modal, meta, version, questions, artifacts, sources, frozenSnap, readiness, handlers, toast }) {
  if (!modal) return null;
  const { onClose } = handlers;
  const t = modal.type;

  // ---- Answer question ----
  if (t === "answer") {
    return <AnswerModal q={questions.find(x => x.id === modal.id)} taskId={modal.taskId} handlers={handlers} toast={toast} />;
  }
  // ---- Fill artifact ----
  if (t === "fillArtifact") {
    return <FillArtifactModal a={artifacts.find(x => x.id === modal.id)} taskId={modal.taskId} handlers={handlers} toast={toast} />;
  }
  // ---- Attach file ----
  if (t === "attach") {
    return (
      <ModalM width={560} onClose={onClose} eyebrow="ADD INFORMATION" title="Attach a file"
        sub="The copilot reads it and updates artifacts & questions."
        footer={<><button className="btn btn-ghost btn-md" onClick={onClose}>Cancel</button><ButtonM variant="primary" onClick={() => { handlers.onContribution("Attached spec-v2.pdf", "FILE"); onClose(); toast("File attached — copilot is reading it"); }}>Attach</ButtonM></>}>
        <div style={{ border: "2px dashed var(--border-strong)", borderRadius: 12, padding: 36, textAlign: "center", marginBottom: 16 }}>
          <IconM name="download" size={26} style={{ color: "var(--text-faint)", margin: "0 auto 8px" }} />
          <div className="f-label" style={{ marginBottom: 4 }}>Drop a file here</div>
          <div className="f-sm faint">PDF, DOCX, XLSX, audio — up to 50MB</div>
        </div>
        <window.UI.Eyebrow style={{ marginBottom: 8 }}>RECENT</window.UI.Eyebrow>
        {["spec-v2.pdf", "partner-list.xlsx"].map(f => (
          <div key={f} className="row gap8" style={{ padding: "8px 0" }}><IconM name="fileText" size={15} style={{ color: "var(--text-muted)" }} /><span className="f-sm">{f}</span></div>
        ))}
      </ModalM>
    );
  }
  // ---- Add source ----
  if (t === "addSource") return <AddSourceModal handlers={handlers} toast={toast} />;
  // ---- Postpone ----
  if (t === "postpone") return <PostponeModal handlers={handlers} toast={toast} />;
  // ---- Request review (peer loop — does NOT advance the stage) ----
  if (t === "review") return <ReviewModal handlers={handlers} toast={toast} />;
  // ---- Freeze & publish v1 (the handoff) ----
  if (t === "freezeV1") return <FreezeModal v="v1" meta={meta} readiness={readiness} questions={questions} artifacts={artifacts} sources={sources} handlers={handlers} toast={toast} />;
  // ---- Freeze & publish v2 ----
  if (t === "freezeV2") return <FreezeModal v="v2" meta={meta} readiness={readiness} questions={questions} artifacts={artifacts} sources={sources} handlers={handlers} toast={toast} />;
  // ---- Start a v2 draft ----
  if (t === "startV2") {
    return (
      <ModalM width={500} onClose={onClose} eyebrow="EDIT PUBLISHED DEMAND" title="Start a v2 draft?"
        sub="v1 stays frozen and live downstream. Your edits go into a parallel v2 until you publish it."
        footer={<><button className="btn btn-ghost btn-md" onClick={onClose}>Cancel</button><ButtonM variant="primary" iconRight="arrowRight" onClick={() => { handlers.onStartV2(); onClose(); toast("v2 draft started · v1 stays published"); }}>Start v2 draft</ButtonM></>}>
        <div className="card row gap10" style={{ padding: 14, background: "var(--surface-sunken)", alignItems: "center" }}>
          <IconM name="lock" size={16} style={{ color: "var(--tide-600)" }} />
          <span className="f-sm muted">Downstream teams keep working from v1. They’ll see a v2 is in progress and can compare once you publish.</span>
        </div>
      </ModalM>
    );
  }
  // ---- Discard v2 ----
  if (t === "discardV2") {
    return (
      <ModalM width={460} onClose={onClose} eyebrow="DISCARD DRAFT" title="Discard the v2 draft?"
        sub="Your v2 edits will be dropped. v1 remains the published, frozen version."
        footer={<><button className="btn btn-ghost btn-md" onClick={onClose}>Keep editing</button><ButtonM variant="primary" onClick={() => { handlers.onFreezeV1(); onClose(); toast("v2 draft discarded · back to frozen v1"); }} style={{ background: "var(--red-600)" }}>Discard v2</ButtonM></>}>
        <div className="f-sm muted">Nothing downstream changes — they never saw the draft.</div>
      </ModalM>
    );
  }
  // ---- v1 ↔ v2 diff ----
  if (t === "diff") return <DiffModal frozenSnap={frozenSnap} artifacts={artifacts} questions={questions} onClose={onClose} />;
  // ---- Assign ----
  if (t === "assign") return <AssignModal current={meta && meta.assignee} handlers={handlers} toast={toast} />;
  // ---- Edit title & description ----
  if (t === "editMeta") return <EditMetaModal meta={meta} handlers={handlers} toast={toast} />;
  // ---- Archive ----
  if (t === "archive") {
    return (
      <ModalM width={460} onClose={onClose} eyebrow="ARCHIVE" title="Archive this demand?"
        sub="It leaves the active pipeline and becomes read-only. You can restore it later."
        footer={<><button className="btn btn-ghost btn-md" onClick={onClose}>Cancel</button><ButtonM variant="primary" onClick={() => { handlers.onArchive(); onClose(); toast("Demand archived"); }} style={{ background: "var(--red-600)" }}>Archive</ButtonM></>}>
        <div className="f-sm muted">Nothing is deleted — the full audit trail is preserved.</div>
      </ModalM>
    );
  }
  // ---- Restore (from backlog/archived) ----
  if (t === "restore") {
    return (
      <ModalM width={460} onClose={onClose} eyebrow="RESTORE" title="Move back into Capture?"
        sub="The demand re-enters the active pipeline so you can keep enriching it."
        footer={<><button className="btn btn-ghost btn-md" onClick={onClose}>Cancel</button><ButtonM variant="primary" iconRight="arrowRight" onClick={() => { handlers.onRestore(); onClose(); toast("Back in Capture"); }}>Move to Capture</ButtonM></>}>
        <div className="f-sm muted">Its sources, artifacts and audit history come back with it.</div>
      </ModalM>
    );
  }
  // ---- Actions menu ----
  if (t === "actions") {
    const items = [
      { icon: "pencil", label: "Edit title & description", act: () => handlers.onOpenModal({ type: "editMeta" }) },
      { icon: "users", label: "Assign to someone else", act: () => handlers.onOpenModal({ type: "assign" }) },
      { icon: "refresh", label: "Duplicate demand", act: () => toast("Duplicated (demo)") },
      { icon: "download", label: "Export package", act: () => toast("Export queued") },
      { icon: "trash", label: "Archive demand", danger: true, act: () => handlers.onOpenModal({ type: "archive" }) },
    ];
    return (
      <ModalM width={400} onClose={onClose} title="Demand actions">
        <div className="col" style={{ gap: 2 }}>
          {items.map(it => (
            <button key={it.label} onClick={() => { it.act(); }} className="row gap10" style={{ padding: "11px 12px", borderRadius: 8, textAlign: "left", color: it.danger ? "var(--red-600)" : "var(--text-ink)", gap: 10 }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--surface-sunken)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <IconM name={it.icon} size={17} /><span className="f-label" style={{ fontWeight: 500, color: it.danger ? "var(--red-600)" : "var(--text-ink)" }}>{it.label}</span>
            </button>
          ))}
        </div>
      </ModalM>
    );
  }
  // ---- Readiness breakdown ----
  if (t === "readiness") return <ReadinessModal questions={questions} artifacts={artifacts} sources={sources} onClose={onClose} />;
  return null;
}

function AnswerModal({ q, taskId, handlers, toast }) {
  const [val, setVal] = useStateM("");
  if (!q) return null;
  return (
    <ModalM width={600} onClose={handlers.onClose} eyebrow="ANSWER QUESTION" title={q.text}
      footer={<><button className="btn btn-ghost btn-md" onClick={handlers.onClose}>Cancel</button><ButtonM variant="primary" disabled={!val.trim()} onClick={() => { handlers.onAnswer(q.id, val.trim(), taskId); handlers.onClose(); toast("Answer saved · readiness updated"); }}>Save answer</ButtonM></>}>
      <SuggestionBlock text={q.suggestion} onUse={() => setVal(q.suggestion)} />
      <window.UI.Eyebrow style={{ marginBottom: 8 }}>YOUR ANSWER</window.UI.Eyebrow>
      <textarea className="field scroll" value={val} onChange={e => setVal(e.target.value)} rows={4} placeholder="Type your answer, or use the copilot suggestion…" style={{ resize: "none", lineHeight: 1.5 }} />
    </ModalM>
  );
}

function FillArtifactModal({ a, taskId, handlers, toast }) {
  const draft = ARTIFACT_DRAFTS[a && a.id] || "";
  const [val, setVal] = useStateM(a && a.status === "done" ? a.body : "");
  if (!a) return null;
  return (
    <ModalM width={600} onClose={handlers.onClose} eyebrow="ARTIFACT" title={a.name}
      footer={<><button className="btn btn-ghost btn-md" onClick={handlers.onClose}>Cancel</button><ButtonM variant="primary" disabled={!val.trim()} onClick={() => { handlers.onFillArtifact(a.id, val.trim(), taskId); handlers.onClose(); toast("Artifact saved · readiness updated"); }}>Save artifact</ButtonM></>}>
      <SuggestionBlock text={draft} onUse={() => setVal(draft)} />
      <window.UI.Eyebrow style={{ marginBottom: 8 }}>CONTENT</window.UI.Eyebrow>
      <textarea className="field scroll" value={val} onChange={e => setVal(e.target.value)} rows={4} placeholder="Describe this artifact, or use the copilot draft…" style={{ resize: "none", lineHeight: 1.5 }} />
    </ModalM>
  );
}

function AddSourceModal({ handlers, toast }) {
  const [tab, setTab] = useStateM("upload");
  const [link, setLink] = useStateM("");
  const tabs = [["upload", "Upload"], ["link", "Link"], ["workspace", "Workspace"]];
  return (
    <ModalM width={560} onClose={handlers.onClose} eyebrow="ADD SOURCE" title="Add a source"
      sub="Sources feed the copilot. The more it reads, the higher its confidence."
      footer={<><button className="btn btn-ghost btn-md" onClick={handlers.onClose}>Cancel</button><ButtonM variant="primary" onClick={() => { handlers.onAddSource(tab === "link" ? (link || "metabase.acme.io/funnel") : "design-spec.pdf", tab); handlers.onClose(); toast("Source added · copilot is reading it"); }}>Add source</ButtonM></>}>
      <div className="row gap4" style={{ background: "var(--surface-sunken)", padding: 3, borderRadius: 9, marginBottom: 16, width: "fit-content" }}>
        {tabs.map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className="f-label" style={{ padding: "6px 14px", borderRadius: 6, fontSize: "var(--fs-sm)", background: tab === k ? "var(--surface-card)" : "transparent", color: tab === k ? "var(--text-ink)" : "var(--text-muted)", boxShadow: tab === k ? "var(--elev-1)" : "none" }}>{l}</button>
        ))}
      </div>
      {tab === "upload" && <div style={{ border: "2px dashed var(--border-strong)", borderRadius: 12, padding: 36, textAlign: "center" }}><IconM name="download" size={26} style={{ color: "var(--text-faint)", margin: "0 auto 8px" }} /><div className="f-label">Drop a file</div><div className="f-sm faint" style={{ marginTop: 4 }}>PDF, DOCX, XLSX, audio</div></div>}
      {tab === "link" && <><window.UI.Eyebrow style={{ marginBottom: 8 }}>URL</window.UI.Eyebrow><input className="field" value={link} onChange={e => setLink(e.target.value)} placeholder="https://…" /></>}
      {tab === "workspace" && <div className="col gap8">{["Q2 partner review notes", "Auth architecture doc", "Stone integration spec"].map(f => <div key={f} className="row gap8 card" style={{ padding: 12 }}><IconM name="fileText" size={16} style={{ color: "var(--text-muted)" }} /><span className="f-sm grow">{f}</span><input type="radio" name="ws" /></div>)}</div>}
    </ModalM>
  );
}

function PostponeModal({ handlers, toast }) {
  const [reason, setReason] = useStateM("");
  return (
    <ModalM width={520} onClose={handlers.onClose} eyebrow="POSTPONE" title="Postpone this demand"
      sub="It stays yours and drops off your active list until the date you pick."
      footer={<><button className="btn btn-ghost btn-md" onClick={handlers.onClose}>Cancel</button><ButtonM variant="primary" onClick={() => { handlers.onPostpone(); handlers.onClose(); toast("Demand postponed"); }}>Postpone</ButtonM></>}>
      <window.UI.Eyebrow style={{ marginBottom: 8 }}>REMIND ME</window.UI.Eyebrow>
      <input type="date" className="field" defaultValue="2026-06-20" style={{ marginBottom: 16 }} />
      <window.UI.Eyebrow style={{ marginBottom: 8 }}>REASON (OPTIONAL)</window.UI.Eyebrow>
      <textarea className="field scroll" value={reason} onChange={e => setReason(e.target.value)} rows={3} placeholder="Waiting on Sales pipeline data…" style={{ resize: "none" }} />
    </ModalM>
  );
}

function ReviewModal({ handlers, toast }) {
  const [who, setWho] = useStateM("AC");
  const people = ["AC", "ML", "CR"];
  return (
    <ModalM width={520} onClose={handlers.onClose} eyebrow="REQUEST REVIEW" title="Ask someone to review"
      sub="A peer review while it stays in your Capture — it doesn't change the demand's stage."
      footer={<><button className="btn btn-ghost btn-md" onClick={handlers.onClose}>Cancel</button><ButtonM variant="primary" onClick={() => { handlers.onRequestReview(who); handlers.onClose(); toast("Review requested from " + window.DATA.PEOPLE[who].name); }}>Send request</ButtonM></>}>
      <window.UI.Eyebrow style={{ marginBottom: 10 }}>REVIEWER</window.UI.Eyebrow>
      <div className="col gap8" style={{ marginBottom: 16 }}>
        {people.map(p => {
          const person = window.DATA.PEOPLE[p];
          return (
            <button key={p} onClick={() => setWho(p)} className="row gap10 card" style={{ padding: 12, border: "1px solid " + (who === p ? "var(--accent)" : "var(--border-hairline)"), background: who === p ? "var(--accent-wash)" : "var(--surface-card)" }}>
              <window.UI.Avatar person={person} size={30} />
              <div className="col grow" style={{ alignItems: "flex-start" }}><span className="f-label" style={{ fontWeight: 600 }}>{person.name}</span><span className="f-sm faint">{person.role}</span></div>
              {who === p && <IconM name="check" size={18} style={{ color: "var(--accent-text)" }} />}
            </button>
          );
        })}
      </div>
      <window.UI.Eyebrow style={{ marginBottom: 8 }}>NOTE</window.UI.Eyebrow>
      <textarea className="field scroll" rows={3} placeholder="What should they focus on?" style={{ resize: "none" }} />
    </ModalM>
  );
}

// ---- Freeze & publish (v1 or v2) — the handoff (LANE-K) ---------------
function FreezeModal({ v, meta, readiness, questions, artifacts, sources, handlers, toast }) {
  const aQ = questions.filter(q => q.status === "answered").length;
  const dA = artifacts.filter(a => a.status === "done").length;
  const isV2 = v === "v2";
  return (
    <ModalM width={620} onClose={handlers.onClose} eyebrow={`ACTION · FREEZE & PUBLISH · ${v}`}
      title={`Publish version ${isV2 ? "2" : "1"} of this demand`}
      footer={<><button className="btn btn-ghost btn-md" onClick={handlers.onClose}>Not yet</button>
        <ButtonM variant="primary" icon="lock" onClick={() => { (isV2 ? handlers.onFreezeV2() : handlers.onFreezeV1()); handlers.onClose(); toast(`${v} frozen & published · Ana Costa notified`); }}>Freeze &amp; publish {v}</ButtonM></>}>
      {/* What happens */}
      <window.UI.Eyebrow style={{ marginBottom: 8 }}>WHAT HAPPENS WHEN YOU FREEZE</window.UI.Eyebrow>
      <div className="f-sm muted" style={{ marginBottom: 18, lineHeight: 1.55 }}>
        The demand becomes <b style={{ color: "var(--text-ink)" }}>immutable</b>. Any later edit creates a {isV2 ? "v3" : "v2"} draft that runs in parallel. <b style={{ color: "var(--text-ink)" }}>Ana Costa</b> receives the published package immediately.
      </div>

      {/* State it will be frozen with */}
      <window.UI.Eyebrow style={{ marginBottom: 10 }}>{v} WILL BE FROZEN WITH</window.UI.Eyebrow>
      <div className="card" style={{ padding: 16, background: "var(--surface-sunken)", marginBottom: 18 }}>
        <div className="row gap16" style={{ alignItems: "center" }}>
          <window.UI.ReadinessRing pct={readiness} size={64} stroke={6} />
          <div className="col gap8 grow">
            <div className="row gap16" style={{ flexWrap: "wrap" }}>
              <div className="row gap6" style={{ alignItems: "baseline" }}><span className="f-eyebrow" style={{ color: "var(--text-faint)" }}>QUESTIONS</span><span className="mono f-sm">{aQ} / {questions.length}</span></div>
              <div className="row gap6" style={{ alignItems: "baseline" }}><span className="f-eyebrow" style={{ color: "var(--text-faint)" }}>ARTIFACTS</span><span className="mono f-sm">{dA} / {artifacts.length}</span></div>
              <div className="row gap6" style={{ alignItems: "baseline" }}><span className="f-eyebrow" style={{ color: "var(--text-faint)" }}>SOURCES</span><span className="mono f-sm">{sources.length}</span></div>
            </div>
            <div className="row gap8" style={{ color: "var(--green-600)" }}><IconM name="checkCircle" size={15} /><span className="f-sm" style={{ color: "var(--green-600)" }}>Above the {meta.threshold}% publish threshold</span></div>
          </div>
        </div>
      </div>

      {/* Who receives it */}
      <window.UI.Eyebrow style={{ marginBottom: 10 }}>HANDS OFF TO</window.UI.Eyebrow>
      <div className="card row gap10" style={{ padding: 12, alignItems: "center" }}>
        <window.UI.Avatar person={window.DATA.PEOPLE.AC} size={30} />
        <div className="col grow"><span className="f-label" style={{ fontWeight: 600 }}>Ana Costa</span><span className="f-sm faint">Discovery Lead · will be assigned the published package</span></div>
        <IconM name="arrowRight" size={16} style={{ color: "var(--text-faint)" }} />
      </div>
    </ModalM>
  );
}

// ---- v1 ↔ v2 diff ----------------------------------------------------
function DiffModal({ frozenSnap, artifacts, questions, onClose }) {
  const snap = frozenSnap || { artifacts: [], questions: [] };
  const snapA = {}; snap.artifacts.forEach(a => { snapA[a.id] = a; });
  const snapQ = {}; (snap.questions || []).forEach(q => { snapQ[q.id] = q; });
  const changedA = artifacts.filter(a => snapA[a.id] && snapA[a.id].body !== a.body);
  const changedQ = questions.filter(q => snapQ[q.id] && snapQ[q.id].answer !== q.answer);
  const none = changedA.length === 0 && changedQ.length === 0;
  return (
    <ModalM width={640} onClose={onClose} eyebrow="COMPARE · v1 ↔ v2" title="What changed in the v2 draft"
      sub="v1 stays published and frozen. These are your unpublished v2 edits.">
      {none ? (
        <div className="col" style={{ alignItems: "center", padding: 32, gap: 8 }}>
          <IconM name="checkCircle" size={26} style={{ color: "var(--text-faint)" }} />
          <div className="f-label muted">No changes yet</div>
          <div className="f-sm faint">Edit an artifact or answer a question to see the diff.</div>
        </div>
      ) : (
        <div className="col gap16">
          {changedA.map(a => (
            <div key={a.id}>
              <div className="row gap8" style={{ marginBottom: 8 }}><window.UI.KindTag kind="artifact" /><span className="f-label" style={{ fontWeight: 700 }}>{a.name}</span></div>
              <div className="card" style={{ padding: 12, marginBottom: 6, background: "var(--red-50)", borderColor: "var(--red-50)" }}>
                <span className="mono f-sm" style={{ color: "var(--red-600)", fontSize: 10 }}>v1</span>
                <div className="f-sm" style={{ color: "var(--text-muted)", marginTop: 4, textDecoration: snapA[a.id].body ? "none" : "none" }}>{snapA[a.id].body || "— empty —"}</div>
              </div>
              <div className="card" style={{ padding: 12, background: "var(--green-50)", borderColor: "var(--green-50)" }}>
                <span className="mono f-sm" style={{ color: "var(--green-600)", fontSize: 10 }}>v2</span>
                <div className="f-sm" style={{ color: "var(--text-ink)", marginTop: 4 }}>{a.body || "— empty —"}</div>
              </div>
            </div>
          ))}
          {changedQ.map(q => (
            <div key={q.id}>
              <div className="row gap8" style={{ marginBottom: 8 }}><window.UI.KindTag kind="question" /><span className="f-label" style={{ fontWeight: 700 }}>{q.text}</span></div>
              <div className="card" style={{ padding: 12, background: "var(--green-50)", borderColor: "var(--green-50)" }}>
                <span className="mono f-sm" style={{ color: "var(--green-600)", fontSize: 10 }}>v2 answer</span>
                <div className="f-sm" style={{ color: "var(--text-ink)", marginTop: 4 }}>{q.answer}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ModalM>
  );
}

// ---- Assign ----------------------------------------------------------
function AssignModal({ current, handlers, toast }) {
  const [who, setWho] = useStateM("AC");
  const people = ["HS", "AC", "ML", "CR"];
  return (
    <ModalM width={500} onClose={handlers.onClose} eyebrow="ASSIGN" title="Assign this demand"
      sub="The assignee owns it through Capture until it's published."
      footer={<><button className="btn btn-ghost btn-md" onClick={handlers.onClose}>Cancel</button><ButtonM variant="primary" onClick={() => { handlers.onAssign(who); handlers.onClose(); toast("Assigned to " + window.DATA.PEOPLE[who].name); }}>Assign</ButtonM></>}>
      <div className="col gap8">
        {people.map(p => {
          const person = window.DATA.PEOPLE[p];
          return (
            <button key={p} onClick={() => setWho(p)} className="row gap10 card" style={{ padding: 12, border: "1px solid " + (who === p ? "var(--accent)" : "var(--border-hairline)"), background: who === p ? "var(--accent-wash)" : "var(--surface-card)" }}>
              <window.UI.Avatar person={person} size={30} />
              <div className="col grow" style={{ alignItems: "flex-start" }}><span className="f-label" style={{ fontWeight: 600 }}>{person.name}{p === "HS" ? " · you" : ""}</span><span className="f-sm faint">{person.role}</span></div>
              {who === p && <IconM name="check" size={18} style={{ color: "var(--accent-text)" }} />}
            </button>
          );
        })}
      </div>
    </ModalM>
  );
}

// ---- Edit title & description ----------------------------------------
function EditMetaModal({ meta, handlers, toast }) {
  const [title, setTitle] = useStateM(meta.title);
  const [desc, setDesc] = useStateM(meta.desc);
  return (
    <ModalM width={580} onClose={handlers.onClose} eyebrow="EDIT" title="Edit title & description"
      footer={<><button className="btn btn-ghost btn-md" onClick={handlers.onClose}>Cancel</button><ButtonM variant="primary" disabled={!title.trim()} onClick={() => { handlers.onEditMeta(title.trim(), desc.trim()); handlers.onClose(); toast("Demand updated"); }}>Save</ButtonM></>}>
      <window.UI.Eyebrow style={{ marginBottom: 8 }}>TITLE</window.UI.Eyebrow>
      <input className="field" value={title} onChange={e => setTitle(e.target.value)} style={{ marginBottom: 16 }} />
      <window.UI.Eyebrow style={{ marginBottom: 8 }}>DESCRIPTION</window.UI.Eyebrow>
      <textarea className="field scroll" value={desc} onChange={e => setDesc(e.target.value)} rows={4} style={{ resize: "none", lineHeight: 1.5 }} />
    </ModalM>
  );
}

function ReadinessModal({ questions, artifacts, sources, onClose }) {
  const aQ = questions.filter(q => q.status === "answered").length;
  const dA = artifacts.filter(a => a.status === "done").length;
  const rows = [
    { label: "Questions answered", val: `${aQ} / ${questions.length}`, weight: "40%", pct: aQ / questions.length },
    { label: "Artifacts complete", val: `${dA} / ${artifacts.length}`, weight: "40%", pct: dA / artifacts.length },
    { label: "Sources attached", val: `${sources.length}`, weight: "20%", pct: Math.min(1, sources.length / 5) },
  ];
  return (
    <ModalM width={560} onClose={onClose} eyebrow="READINESS BREAKDOWN" title="What makes this demand ready"
      sub="You can freeze & publish v1 at 80%. Here's where your readiness comes from.">
      <div className="col gap16">
        {rows.map(r => (
          <div key={r.label}>
            <div className="spread" style={{ marginBottom: 7 }}>
              <span className="f-label" style={{ fontWeight: 600 }}>{r.label}</span>
              <div className="row gap8"><span className="mono f-sm muted">{r.val}</span><span className="pill" style={{ background: "var(--surface-sunken)", color: "var(--text-faint)", fontSize: 10 }}>{r.weight}</span></div>
            </div>
            <window.UI.ReadinessBar pct={Math.round(r.pct * 100)} height={8} />
          </div>
        ))}
      </div>
    </ModalM>
  );
}

window.DemandModals = DemandModals;
