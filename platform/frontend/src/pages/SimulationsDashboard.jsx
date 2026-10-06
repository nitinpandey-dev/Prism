import { Link } from "react-router-dom";
import { SIMULATORS, SUBJECT_META } from "../config/simulatorRegistry";
import "./SimulationsDashboard.css";

export default function SimulationsDashboard() {
  return (
    <div className="sim-hub-container">
      <header className="sim-hub-header">
        <div>
          <h1 className="sim-hub-title">PRISM Simulations</h1>
          <p className="sim-hub-subtitle">
            Interactive STEM simulation laboratory powered by Python (NumPy, SciPy, SymPy)
          </p>
        </div>
      </header>

      <main className="sim-hub-content">
        <div className="sim-boxes-grid">
          {SIMULATORS.map((sim) => {
            const meta = SUBJECT_META[sim.subject] || {};
            return (
              <Link key={sim.id} to={sim.route} className="sim-box-card">
                <div className="sim-box-top">
                  <span
                    className="sim-box-subject"
                    style={{ color: meta.color || "#2563eb" }}
                  >
                    {meta.label || sim.subject}
                  </span>
                  <span className="sim-box-type">{sim.visualizationType}</span>
                </div>

                <h3 className="sim-box-title">{sim.title}</h3>
                <p className="sim-box-desc">{sim.description}</p>

                <div className="sim-box-bottom">
                  <span className="sim-box-topic">{sim.topic}</span>
                  <span className="sim-box-action">Open &rarr;</span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
