/* Conductor UI kit — app composition. */

const { useState: useStateApp } = React;

function App() {
  const [active, setActive] = useStateApp("agents");
  const [drawerOpen, setDrawerOpen] = useStateApp(false);
  const [takeoverOpen, setTakeoverOpen] = useStateApp(false);

  const breadcrumbs = {
    agents: ["Build", "Agents"],
    playground: ["Build", "Playground"],
    evals: ["Build", "Evaluations"],
    runs: ["Operate", "Runs"],
    traces: ["Operate", "Traces"],
    health: ["Operate", "Health"],
    memory: ["Operate", "Memory"],
    chat: ["Engage", "Chat"],
    tools: ["Catalog", "Tools & MCPs"],
    kb: ["Catalog", "Knowledge Base"],
    schedules: ["Catalog", "Schedules"],
    creds: ["Catalog", "Credentials"],
    ns: ["Catalog", "Namespaces"],
  };

  const labels = {
    agents: "Agents", playground: "Playground", evals: "Evaluations",
    runs: "Runs", traces: "Traces", health: "Health", memory: "Memory",
    chat: "Chat",
    tools: "Tools & MCPs", kb: "Knowledge Base", schedules: "Schedules",
    creds: "Credentials", ns: "Namespaces",
  };

  let screen;
  if (active === "agents") {
    screen = <AgentsScreen onOpenDeploy={() => setTakeoverOpen(true)} onOpenAddMCP={() => setDrawerOpen(true)} />;
  } else if (active === "runs") {
    screen = <RunsScreen />;
  } else {
    screen = <BlankScreen label={labels[active]} />;
  }

  return (
    <React.Fragment>
      <AppShell
        sidebar={<Sidebar active={active} onNavigate={setActive} />}
        topbar={<TopBar breadcrumb={breadcrumbs[active] || ["Conductor"]} />}
      >
        {screen}
      </AppShell>

      <AddMCPDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <DeployTakeover open={takeoverOpen} onClose={() => setTakeoverOpen(false)} />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
