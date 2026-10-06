import React, { useState } from "react";
import ProjectileMotionSim from "./simulations/ProjectileMotionSim";
import CrystalStructuresSim from "./simulations/CrystalStructuresSim";
import FunctionVisualizerSim from "./simulations/FunctionVisualizerSim";
import WaveSuperpositionSim from "./simulations/WaveSuperpositionSim";
import GraphTraversalSim from "./simulations/GraphTraversalSim";
import "./App.css";

const SIMULATIONS = [
  {
    id: "projectile",
    num: "01",
    name: "Projectile Motion",
    desc: "Explore velocity, angle, gravity and trajectory.",
    subject: "Physics",
  },
  {
    id: "crystal",
    num: "02",
    name: "Crystal Structures",
    desc: "Visualize SC, BCC, and FCC solid-state unit cell geometry.",
    subject: "Chemistry",
  },
  {
    id: "function",
    num: "03",
    name: "Function Visualizer",
    desc: "Plot dynamic algebraic, trigonometric and exponential equations.",
    subject: "Mathematics",
  },
  {
    id: "waves",
    num: "04",
    name: "Wave Superposition",
    desc: "Visualize constructive, destructive, and beat interference patterns instantly.",
    subject: "Physics",
  },
  {
    id: "graph",
    num: "05",
    name: "Graph Traversal",
    desc: "Animate Breadth-First (BFS) and Depth-First (DFS) search across node graphs.",
    subject: "Algorithms",
  },
];

export default function App() {
  const [activeSimId, setActiveSimId] = useState(null);

  const activeSim = SIMULATIONS.find((s) => s.id === activeSimId);

  return (
    <div className="prism-root">
      {/* ── Minimal Top Navigation Header ── */}
      <header className="prism-top-nav">
        <div className="prism-nav-inner">
          <div className="prism-brand" onClick={() => setActiveSimId(null)}>
            <span className="prism-logo">PRISM</span>
            <span className="prism-subtitle">Interactive STEM Simulations</span>
          </div>

          <div className="prism-nav-right">
            <span className="prism-sim-count">5 Simulations</span>
          </div>
        </div>
      </header>

      {/* ── Main Workspace Body ── */}
      <main className="prism-main">
        {!activeSimId ? (
          /* ── 1. SELECTOR VIEW (Initial State) ── */
          <div className="prism-selector-container">
            <div className="prism-selector-intro">
              <p className="prism-tagline">“Turning abstract concepts into things you can see.”</p>
              <h2 className="prism-heading">Choose a Simulation</h2>
            </div>

            <div className="prism-selector-list">
              {SIMULATIONS.map((sim) => (
                <button
                  key={sim.id}
                  className="prism-sim-row"
                  onClick={() => setActiveSimId(sim.id)}
                >
                  <div className="prism-sim-num">{sim.num}</div>
                  <div className="prism-sim-info">
                    <div className="prism-sim-title-row">
                      <h3 className="prism-sim-name">{sim.name}</h3>
                      <span className="prism-sim-subj">{sim.subject}</span>
                    </div>
                    <p className="prism-sim-desc">{sim.desc}</p>
                  </div>
                  <div className="prism-sim-arrow">→</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ── 2. ACTIVE SIMULATION WORKSPACE VIEW ── */
          <div className="prism-sim-active-container">
            <div className="prism-sim-header">
              <button
                className="prism-back-btn"
                onClick={() => setActiveSimId(null)}
              >
                ← Back to simulations
              </button>

              <div className="prism-sim-active-title">
                <h2>{activeSim?.name}</h2>
                <span className="prism-active-badge">{activeSim?.subject}</span>
              </div>
            </div>

            {/* Render Active Simulation Component */}
            <div className="prism-sim-workspace-body">
              {activeSimId === "projectile" && <ProjectileMotionSim />}
              {activeSimId === "crystal" && <CrystalStructuresSim />}
              {activeSimId === "function" && <FunctionVisualizerSim />}
              {activeSimId === "waves" && <WaveSuperpositionSim />}
              {activeSimId === "graph" && <GraphTraversalSim />}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
