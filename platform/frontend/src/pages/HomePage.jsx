import { Link, useNavigate } from "react-router-dom";
import { SIMULATORS, SUBJECT_META, getSubjectCounts, getAvailable } from "../config/simulatorRegistry";
import SimulatorCard from "../components/simulations/SimulatorCard";
import "./HomePage.css";

const HOW_STEPS = [
  { icon: "📚", title: "Learn", desc: "Read a concise conceptual overview of the topic." },
  { icon: "🎛️", title: "Manipulate", desc: "Adjust parameters using intuitive interactive controls." },
  { icon: "▶️", title: "Simulate", desc: "Run the scientifically accurate computation in real-time." },
  { icon: "👁️", title: "Visualize", desc: "See the results through 3D scenes, graphs, and animations." },
  { icon: "💡", title: "Understand", desc: "Connect equations to behavior through direct experimentation." },
];

export default function HomePage() {
  const navigate = useNavigate();
  const available = getAvailable();
  const subjectCounts = getSubjectCounts();
  const subjects = Object.entries(SUBJECT_META);

  const totalSims = SIMULATORS.length;
  const totalSubjects = subjects.length;
  const availableCount = available.length;

  return (
    <div className="home-page">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-tagline">
              🔭 Educational STEM Platform
            </div>
            <h1 className="hero-title">
              Turning abstract concepts into things you can{" "}
              <span className="gradient-text">see</span>.
            </h1>
            <p className="hero-subtitle">
              PRISM is an interactive multi-subject simulation platform for students.
              Explore Chemistry, Physics, Mathematics, Biology, and Computer Science through
              accurate, hands-on computational simulations.
            </p>
            <div className="hero-cta">
              <Link to="/explore" className="btn btn-primary btn-lg" id="hero-explore-btn">
                Explore Simulations →
              </Link>
              <Link to="/about" className="btn btn-secondary btn-lg" id="hero-about-btn">
                Learn More
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-canvas">
              <div className="hero-orb hero-orb-1" />
              <div className="hero-orb hero-orb-2" />
              <div className="hero-floating-cards">
                <div className="hero-float-card">⚗️ Crystal Lattice</div>
                <div className="hero-float-card">🚀 Projectile Motion</div>
                <div className="hero-float-card">📈 f(x) = sin(x)</div>
                <div className="hero-float-card">🧬 DNA Structure</div>
                <div className="hero-float-card">🔭</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div className="stats-bar">
        <div className="stats-bar-inner">
          {[
            { num: totalSubjects, lbl: "Subjects" },
            { num: totalSims, lbl: "Simulations" },
            { num: availableCount, lbl: "Live Now" },
            { num: "3D+2D", lbl: "Visualization" },
          ].map(({ num, lbl }) => (
            <div key={lbl} className="stat-item">
              <div className="stat-num">{num}</div>
              <div className="stat-lbl">{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Subjects ── */}
      <section className="subjects-section">
        <div className="container">
          <div className="section-label">Browse by Subject</div>
          <h2 className="section-title">
            Five disciplines, one <span className="gradient-text">platform</span>
          </h2>
          <div className="subjects-grid">
            {subjects.map(([key, meta]) => (
              <button
                key={key}
                id={`subject-${key}`}
                className="subject-card"
                onClick={() => navigate(`/explore?subject=${key}`)}
              >
                <span className="subject-card-icon">{meta.icon}</span>
                <div className="subject-card-name" style={{ color: meta.color }}>
                  {meta.label}
                </div>
                <div className="subject-card-count">
                  {subjectCounts[key]?.total || 0} simulations ·{" "}
                  {subjectCounts[key]?.available || 0} available
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured (available) simulations ── */}
      <section className="featured-section">
        <div className="container">
          <div className="section-label">Available Now</div>
          <h2 className="section-title">
            Start <span className="gradient-text">exploring today</span>
          </h2>
          <p style={{ marginBottom: "var(--sp-8)", maxWidth: 520 }}>
            These simulations are live and powered by a real Python scientific computing backend.
          </p>
          <div className="sim-grid">
            {available.map((sim, i) => (
              <SimulatorCard
                key={sim.id}
                sim={sim}
                style={{ animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "var(--sp-8)" }}>
            <Link to="/explore" className="btn btn-secondary btn-lg" id="view-all-btn">
              View All Simulations →
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="how-section">
        <div className="container">
          <div className="section-label">Methodology</div>
          <h2 className="section-title">
            The PRISM <span className="gradient-text">learning flow</span>
          </h2>
          <div className="how-grid">
            {HOW_STEPS.map((step, i) => (
              <div key={step.title} className="how-card glass-card" style={{ padding: "var(--sp-6)" }}>
                <div className="how-card-num">{i + 1}</div>
                <div className="how-card-icon">{step.icon}</div>
                <div className="how-card-title">{step.title}</div>
                <div className="how-card-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ height: "var(--sp-16)" }} />
    </div>
  );
}
