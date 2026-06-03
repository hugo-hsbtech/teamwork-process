// screen_auth.jsx — B0 Sign in. Exposes window.SignIn.
const IconA = window.Icon;
const { Button: ButtonA } = window.UI;

function SignIn({ onSignIn }) {
  return (
    <div className="anim-screen" style={{ height: "100vh", width: "100vw", display: "flex", background: "var(--surface-canvas)" }}>
      {/* Left — brand */}
      <div style={{ flex: "0 0 44%", padding: 64, display: "flex", flexDirection: "column", justifyContent: "space-between", borderRight: "1px solid var(--border-hairline)" }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--accent)" }} />
        <div style={{ maxWidth: 520 }}>
          <window.UI.Eyebrow style={{ color: "var(--accent-text)", marginBottom: 20 }}>INTAKE · CAPTURE LAYER</window.UI.Eyebrow>
          <div className="f-display" style={{ fontSize: "calc(46px * var(--type-scale))", marginBottom: 18 }}>Your next decision starts here.</div>
          <div className="f-body muted" style={{ fontSize: "var(--fs-title)", maxWidth: 460 }}>
            Capture demands with enough context for the team to act. Intake turns your intuition into a clear package for Discovery.
          </div>
        </div>
        <div>
          <div className="f-h3" style={{ fontStyle: "italic", fontWeight: 700, fontFamily: "var(--font-display)", maxWidth: 500, lineHeight: 1.4, letterSpacing: "-0.01em" }}>
            “Already saved me 18 hours this week across two demands.”
          </div>
          <div className="f-sm faint" style={{ marginTop: 10 }}>Hugo Seabra · COO, Payments</div>
        </div>
      </div>
      {/* Right — card */}
      <div className="grow" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 48, gap: 20 }}>
        <div className="card anim-up" style={{ width: 400, padding: 32, borderRadius: 16, boxShadow: "var(--elev-1)" }}>
          <div style={{ marginBottom: 22 }}>
            <div className="f-h3">Welcome back</div>
            <div className="f-sm muted" style={{ marginTop: 6 }}>Use your corporate provider.</div>
          </div>
          <div className="col" style={{ gap: 10 }}>
            <ButtonA variant="primary" size="lg" onClick={onSignIn} style={{ width: "100%" }}>Continue with company SSO</ButtonA>
            <div className="row gap8" style={{ justifyContent: "center", margin: "4px 0" }}>
              <div className="hr grow" /><span className="f-sm faint">or</span><div className="hr grow" />
            </div>
            <ButtonA variant="secondary" size="lg" icon="google" onClick={onSignIn} style={{ width: "100%" }}>Continue with Google</ButtonA>
            <ButtonA variant="secondary" size="lg" icon="ms" onClick={onSignIn} style={{ width: "100%" }}>Continue with Microsoft</ButtonA>
          </div>
          <div className="hr" style={{ margin: "20px 0 16px" }} />
          <div className="row gap4" style={{ justifyContent: "center" }}>
            <span className="f-sm muted">No corporate account?</span>
            <span className="lnk f-sm">Request access →</span>
          </div>
        </div>
        <div className="f-sm faint">In use by Payments, Revenue, Discovery and Commercial teams.</div>
      </div>
    </div>
  );
}

window.SignIn = SignIn;
