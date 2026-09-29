import { Link } from "react-router-dom";
import { SIMULATORS, SUBJECT_META } from "../config/simulatorRegistry";

const TECH_STACK = [
  { icon: "⚛️", name: "React + Vite", desc: "Fast, modern SPA frontend" },
  { icon: "🐍", name: "FastAPI", desc: "Python scientific computing backend" },
  { icon: "🔢", name: "NumPy / SciPy", desc: "Numerical computation engine" },
  { icon: "🔣", name: "SymPy", desc: "Symbolic mathematics" },
  { icon: "🎲", name: "Three.js / R3F", desc: "3D WebGL visualization" },
  { icon: "📊", name: "Recharts", desc: "2D scientific graphing" },
];

const ARCH_PRINCIPLES = [
  {
    icon: "🗂️",
    title: "Centralized Registry",
    desc: "A single simulatorRegistry.js/registry.py file is the source of truth for all simulator metadata. Adding a simulator starts here.",
  },
  {
    icon: "🔌",
    title: "Modular Simulation Engines",
    desc: "Each simulator lives in its own folder under simulations/<subject>/<id>/. It can have its own models, API routes, and computation logic.",
  },
  {
    icon: "🎨",
    title: "Shared UI Components",
    desc: "SimulationLayout, ControlsPanel, ParameterSlider, and others are reusable across all simulations, ensuring consistent UX.",
  },
  {
    icon: "🚦",
    title: "Dynamic Routing",
    desc: "Routes are resolved via the registry. Unavailable simulators gracefully redirect to a polished Coming Soon page.",
  },
  {
    icon: "🧪",
    title: "Python Computes, React Renders",
    desc: "All scientific computation runs server-side in Python. The frontend only handles UI and visualization.",
  },
];

export default function AboutPage() {
  const totalSims = SIMULATORS.length;
  const available = SIMULATORS.filter((s) => s.status === "available").length;

  return (
    <div style={{ animation: "fadeIn 0.4s ease both" }}>
      <div className="container">
        {/* ── Hero ── */}
        <div style={{ padding: "var(--sp-16) 0 var(--sp-10)", textAlign: "center" }}>
          <div className="section-label">About PRISM</div>
          <h1 style={{ marginBottom: "var(--sp-5)" }}>
            The platform behind{" "}
            <span className="gradient-text">STEM education</span>
          </h1>
          <p style={{ maxWidth: 580, margin: "0 auto var(--sp-8)", fontSize: "1.05rem" }}>
            PRISM (Platform for Real-time Interactive STEM Modules) is an extensible,
            multi-subject educational simulation platform designed to make abstract
            scientific concepts visually understandable.
          </p>
        </div>

        {/* ── Platform Stats ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "var(--sp-4)",
          marginBottom: "var(--sp-12)",
        }}>
          {[
            { num: Object.keys(SUBJECT_META).length, lbl: "Subjects", icon: "📚" },
            { num: totalSims, lbl: "Registered Sims", icon: "🗂️" },
            { num: available, lbl: "Available Now", icon: "✅" },
            { num: "∞", lbl: "Extensible", icon: "🚀" },
          ].map(({ num, lbl, icon }) => (
            <div key={lbl} className="glass-card" style={{ padding: "var(--sp-6)", textAlign: "center" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: "var(--sp-2)" }}>{icon}</div>
              <div style={{
                fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800,
                background: "linear-gradient(135deg, var(--clr-indigo-400), var(--clr-cyan-400))",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>{num}</div>
              <div style={{ fontSize: "0.78rem", color: "var(--clr-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "var(--sp-1)" }}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* ── Architecture ── */}
        <div style={{ marginBottom: "var(--sp-12)" }}>
          <div className="section-label">Architecture</div>
          <h2 style={{ marginBottom: "var(--sp-4)" }}>
            Built for <span className="gradient-text">extensibility</span>
          </h2>
          <p style={{ marginBottom: "var(--sp-8)", maxWidth: 560 }}>
            PRISM is designed so that adding a new simulator never requires touching
            unrelated code. Every simulator is a self-contained module.
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "var(--sp-4)"
          }}>
            {ARCH_PRINCIPLES.map((p) => (
              <div key={p.title} className="glass-card" style={{ padding: "var(--sp-5)" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "var(--sp-3)" }}>{p.icon}</div>
                <h4 style={{ marginBottom: "var(--sp-2)", color: "var(--clr-text-primary)" }}>{p.title}</h4>
                <p style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tech Stack ── */}
        <div style={{ marginBottom: "var(--sp-12)" }}>
          <div className="section-label">Technology Stack</div>
          <h2 style={{ marginBottom: "var(--sp-8)" }}>
            Built with the <span className="gradient-text">right tools</span>
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "var(--sp-3)"
          }}>
            {TECH_STACK.map((t) => (
              <div key={t.name} className="glass-card" style={{ padding: "var(--sp-4)", display: "flex", alignItems: "center", gap: "var(--sp-3)" }}>
                <span style={{ fontSize: "1.5rem" }}>{t.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, color: "var(--clr-text-primary)", fontSize: "0.9rem" }}>{t.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--clr-text-muted)" }}>{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── How to Add a Simulator ── */}
        <div style={{ marginBottom: "var(--sp-12)" }}>
          <div className="section-label">For Developers</div>
          <h2 style={{ marginBottom: "var(--sp-4)" }}>
            Adding a new <span className="gradient-text">simulator</span>
          </h2>
          <div className="glass-card" style={{ padding: "var(--sp-6)" }}>
            <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
              {[
                { step: "1", title: "Register metadata", desc: "Add an entry to simulatorRegistry.js (frontend) and registry.py (backend) with id, title, subject, status: 'available', etc." },
                { step: "2", title: "Create the engine", desc: "Implement simulations/<subject>/<id>/engine.py with your scientific computation using NumPy/SciPy/SymPy." },
                { step: "3", title: "Create the router", desc: "Add routers/simulations/<id>_router.py and include it in main.py's include_routers()." },
                { step: "4", title: "Create the page", desc: "Add src/simulations/<subject>/<id>/YourPage.jsx using SimulationLayout and its sub-components." },
                { step: "5", title: "Add the route", desc: "Import your page in App.jsx and add a lazy Route for /simulations/<id>. Done!" },
              ].map(({ step, title, desc }) => (
                <li key={step} style={{ display: "flex", gap: "var(--sp-4)", alignItems: "flex-start" }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg, var(--clr-indigo-500), var(--clr-violet-600))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.75rem", fontWeight: 800, color: "white", marginTop: 2
                  }}>{step}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--clr-text-primary)", marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--clr-text-secondary)", lineHeight: 1.6 }}>{desc}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div style={{ textAlign: "center", paddingBottom: "var(--sp-16)" }}>
          <Link to="/explore" className="btn btn-primary btn-lg" id="about-explore-btn">
            Start Exploring →
          </Link>
        </div>
      </div>
    </div>
  );
}
