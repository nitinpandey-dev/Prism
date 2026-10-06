import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getById, SUBJECT_META, SIMULATORS } from "../config/simulatorRegistry";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import "./InteractiveSimRunner.css";

// ─── 1. MOLECULAR GEOMETRY SIMULATOR ──────────────────────────────────────────
function MolecularGeometrySim() {
  const [molecule, setMolecule] = useState("CH4");
  const [showLonePairs, setShowLonePairs] = useState(true);
  const [showAngles, setShowAngles] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const canvasRef = useRef(null);
  const angleRef = useRef(0);

  const MOLECULES = {
    CO2: {
      name: "Carbon Dioxide (CO₂)",
      formula: "CO₂",
      geometry: "Linear",
      electronGeo: "Linear",
      hybrid: "sp",
      bondAngle: "180°",
      polarity: "Non-polar",
      atoms: [
        { el: "C", color: "#334155", radius: 24, pos: [0, 0, 0] },
        { el: "O", color: "#ef4444", radius: 20, pos: [-120, 0, 0] },
        { el: "O", color: "#ef4444", radius: 20, pos: [120, 0, 0] },
      ],
      bonds: [
        [0, 1, 2],
        [0, 2, 2],
      ],
      lonePairs: [],
    },
    H2O: {
      name: "Water (H₂O)",
      formula: "H₂O",
      geometry: "Bent",
      electronGeo: "Tetrahedral",
      hybrid: "sp³",
      bondAngle: "104.5°",
      polarity: "Polar (1.85 D)",
      atoms: [
        { el: "O", color: "#ef4444", radius: 24, pos: [0, -20, 0] },
        { el: "H", color: "#f8fafc", radius: 16, pos: [-75, 60, 0] },
        { el: "H", color: "#f8fafc", radius: 16, pos: [75, 60, 0] },
      ],
      bonds: [
        [0, 1, 1],
        [0, 2, 1],
      ],
      lonePairs: [
        { pos: [-45, -70, 30] },
        { pos: [45, -70, -30] },
      ],
    },
    BF3: {
      name: "Boron Trifluoride (BF₃)",
      formula: "BF₃",
      geometry: "Trigonal Planar",
      electronGeo: "Trigonal Planar",
      hybrid: "sp²",
      bondAngle: "120°",
      polarity: "Non-polar",
      atoms: [
        { el: "B", color: "#ec4899", radius: 22, pos: [0, 0, 0] },
        { el: "F", color: "#10b981", radius: 19, pos: [0, -110, 0] },
        { el: "F", color: "#10b981", radius: 19, pos: [95, 55, 0] },
        { el: "F", color: "#10b981", radius: 19, pos: [-95, 55, 0] },
      ],
      bonds: [
        [0, 1, 1],
        [0, 2, 1],
        [0, 3, 1],
      ],
      lonePairs: [],
    },
    CH4: {
      name: "Methane (CH₄)",
      formula: "CH₄",
      geometry: "Tetrahedral",
      electronGeo: "Tetrahedral",
      hybrid: "sp³",
      bondAngle: "109.5°",
      polarity: "Non-polar",
      atoms: [
        { el: "C", color: "#334155", radius: 24, pos: [0, 0, 0] },
        { el: "H", color: "#f8fafc", radius: 16, pos: [0, -100, 30] },
        { el: "H", color: "#f8fafc", radius: 16, pos: [94, 40, 40] },
        { el: "H", color: "#f8fafc", radius: 16, pos: [-94, 40, 40] },
        { el: "H", color: "#f8fafc", radius: 16, pos: [0, 40, -100] },
      ],
      bonds: [
        [0, 1, 1],
        [0, 2, 1],
        [0, 3, 1],
        [0, 4, 1],
      ],
      lonePairs: [],
    },
    PCl5: {
      name: "Phosphorus Pentachloride (PCl₅)",
      formula: "PCl₅",
      geometry: "Trigonal Bipyramidal",
      electronGeo: "Trigonal Bipyramidal",
      hybrid: "sp³d",
      bondAngle: "90° & 120°",
      polarity: "Non-polar",
      atoms: [
        { el: "P", color: "#f59e0b", radius: 25, pos: [0, 0, 0] },
        { el: "Cl", color: "#22c55e", radius: 20, pos: [0, -115, 0] },
        { el: "Cl", color: "#22c55e", radius: 20, pos: [0, 115, 0] },
        { el: "Cl", color: "#22c55e", radius: 20, pos: [100, 0, 0] },
        { el: "Cl", color: "#22c55e", radius: 20, pos: [-50, 0, 86] },
        { el: "Cl", color: "#22c55e", radius: 20, pos: [-50, 0, -86] },
      ],
      bonds: [
        [0, 1, 1],
        [0, 2, 1],
        [0, 3, 1],
        [0, 4, 1],
        [0, 5, 1],
      ],
      lonePairs: [],
    },
    SF6: {
      name: "Sulfur Hexafluoride (SF₆)",
      formula: "SF₆",
      geometry: "Octahedral",
      electronGeo: "Octahedral",
      hybrid: "sp³d²",
      bondAngle: "90°",
      polarity: "Non-polar",
      atoms: [
        { el: "S", color: "#eab308", radius: 25, pos: [0, 0, 0] },
        { el: "F", color: "#10b981", radius: 19, pos: [0, -105, 0] },
        { el: "F", color: "#10b981", radius: 19, pos: [0, 105, 0] },
        { el: "F", color: "#10b981", radius: 19, pos: [-105, 0, 0] },
        { el: "F", color: "#10b981", radius: 19, pos: [105, 0, 0] },
        { el: "F", color: "#10b981", radius: 19, pos: [0, 0, -105] },
        { el: "F", color: "#10b981", radius: 19, pos: [0, 0, 105] },
      ],
      bonds: [
        [0, 1, 1],
        [0, 2, 1],
        [0, 3, 1],
        [0, 4, 1],
        [0, 5, 1],
        [0, 6, 1],
      ],
      lonePairs: [],
    },
  };

  const current = MOLECULES[molecule];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const render = () => {
      if (autoRotate) angleRef.current += 0.015;
      const angle = angleRef.current;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Project 3D to 2D with isometric-like rotation
      const project = ([x, y, z]) => {
        const rotX = x * cosA - z * sinA;
        const rotZ = x * sinA + z * cosA;
        const scale = 1.0 + rotZ * 0.0018;
        return {
          px: cx + rotX * scale,
          py: cy + y * scale + rotZ * 0.25,
          depth: rotZ,
          scale,
        };
      };

      // Draw Bonds
      current.bonds.forEach(([i, j, order]) => {
        const p1 = project(current.atoms[i].pos);
        const p2 = project(current.atoms[j].pos);
        ctx.strokeStyle = "rgba(148, 163, 184, 0.6)";
        ctx.lineWidth = order === 2 ? 8 : 5;
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.stroke();

        if (order === 2) {
          ctx.strokeStyle = "rgba(248, 250, 252, 0.4)";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // Draw Lone Pairs
      if (showLonePairs && current.lonePairs) {
        current.lonePairs.forEach((lp) => {
          const p = project(lp.pos);
          const pOrigin = project([0, -20, 0]);
          ctx.strokeStyle = "rgba(168, 85, 247, 0.4)";
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(pOrigin.px, pOrigin.py);
          ctx.lineTo(p.px, p.py);
          ctx.stroke();
          ctx.setLineDash([]);

          const grad = ctx.createRadialGradient(p.px, p.py, 2, p.px, p.py, 18);
          grad.addColorStop(0, "rgba(168, 85, 247, 0.8)");
          grad.addColorStop(1, "rgba(168, 85, 247, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.px, p.py, 18, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#c084fc";
          ctx.beginPath();
          ctx.arc(p.px - 4, p.py, 3, 0, Math.PI * 2);
          ctx.arc(p.px + 4, p.py, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Draw Atoms sorted by depth
      const sortedAtoms = current.atoms
        .map((atom, idx) => ({ ...atom, proj: project(atom.pos), idx }))
        .sort((a, b) => a.proj.depth - b.proj.depth);

      sortedAtoms.forEach(({ el, color, radius, proj }) => {
        const r = radius * proj.scale;
        const grad = ctx.createRadialGradient(
          proj.px - r * 0.35,
          proj.py - r * 0.35,
          r * 0.1,
          proj.px,
          proj.py,
          r
        );
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(0.3, color);
        grad.addColorStop(1, "#090d16");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(proj.px, proj.py, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = el === "H" ? "#0f172a" : "#f8fafc";
        ctx.font = `bold ${Math.round(13 * proj.scale)}px var(--font-sans)`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(el, proj.px, proj.py);
      });

      // Draw Angle indicator
      if (showAngles && current.bondAngle) {
        ctx.fillStyle = "rgba(99, 102, 241, 0.9)";
        ctx.font = "bold 13px var(--font-mono)";
        ctx.textAlign = "center";
        ctx.fillText(`Bond Angle: ${current.bondAngle}`, cx, canvas.height - 24);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [current, autoRotate, showLonePairs, showAngles]);

  return (
    <div className="sim-interactive-grid">
      <div className="sim-ctrl-card">
        <h3>Molecule Selection</h3>
        <div className="sim-btn-grid">
          {Object.entries(MOLECULES).map(([key, val]) => (
            <button
              key={key}
              className={`sim-preset-btn ${molecule === key ? "active" : ""}`}
              onClick={() => setMolecule(key)}
            >
              <span>{val.formula}</span>
              <small>{val.geometry}</small>
            </button>
          ))}
        </div>

        <div className="sim-toggles">
          <label className="sim-checkbox">
            <input
              type="checkbox"
              checked={autoRotate}
              onChange={(e) => setAutoRotate(e.target.checked)}
            />
            <span>3D Continuous Rotation</span>
          </label>
          <label className="sim-checkbox">
            <input
              type="checkbox"
              checked={showLonePairs}
              onChange={(e) => setShowLonePairs(e.target.checked)}
            />
            <span>Show Lone Electron Pairs (VSEPR)</span>
          </label>
          <label className="sim-checkbox">
            <input
              type="checkbox"
              checked={showAngles}
              onChange={(e) => setShowAngles(e.target.checked)}
            />
            <span>Display Measured Bond Angles</span>
          </label>
        </div>

        <div className="sim-metric-table">
          <h4>VSEPR Geometry Summary</h4>
          <div className="metric-row">
            <span>Molecular Shape:</span>
            <strong>{current.geometry}</strong>
          </div>
          <div className="metric-row">
            <span>Electron Geometry:</span>
            <strong>{current.electronGeo}</strong>
          </div>
          <div className="metric-row">
            <span>Hybridization:</span>
            <strong>{current.hybrid}</strong>
          </div>
          <div className="metric-row">
            <span>Ideal Bond Angle:</span>
            <strong>{current.bondAngle}</strong>
          </div>
          <div className="metric-row">
            <span>Molecular Polarity:</span>
            <strong>{current.polarity}</strong>
          </div>
        </div>
      </div>

      <div className="sim-viz-card">
        <div className="viz-header">
          <span className="viz-title">3D VSEPR Ball-and-Stick Model</span>
          <span className="viz-tag">{current.name}</span>
        </div>
        <canvas
          ref={canvasRef}
          width={580}
          height={420}
          className="sim-canvas"
        />
        <div className="viz-footer">
          Drag / Observe the Valence Shell Electron Pair Repulsion in real-time.
        </div>
      </div>
    </div>
  );
}

// ─── 2. ATOMIC ORBITALS SIMULATOR ─────────────────────────────────────────────
function AtomicOrbitalsSim() {
  const [orbital, setOrbital] = useState("2px");
  const [cutoff, setCutoff] = useState(0.5);
  const canvasRef = useRef(null);

  const ORBITALS = {
    "1s": { n: 1, l: 0, m: 0, name: "1s Orbital", color: "#38bdf8", radialNodes: 0, angularNodes: 0 },
    "2s": { n: 2, l: 0, m: 0, name: "2s Orbital", color: "#818cf8", radialNodes: 1, angularNodes: 0 },
    "2px": { n: 2, l: 1, m: 1, name: "2pₓ Orbital", color: "#a855f7", radialNodes: 0, angularNodes: 1 },
    "2py": { n: 2, l: 1, m: -1, name: "2pᵧ Orbital", color: "#ec4899", radialNodes: 0, angularNodes: 1 },
    "2pz": { n: 2, l: 1, m: 0, name: "2p₂ Orbital", color: "#f43f5e", radialNodes: 0, angularNodes: 1 },
    "3d_xy": { n: 3, l: 2, m: -2, name: "3dₓᵧ Orbital", color: "#10b981", radialNodes: 0, angularNodes: 2 },
    "3d_z2": { n: 3, l: 2, m: 0, name: "3d₂² Orbital", color: "#eab308", radialNodes: 0, angularNodes: 2 },
  };

  const current = ORBITALS[orbital];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const imgData = ctx.createImageData(w, h);
    const data = imgData.data;

    const scale = 0.045 * (current.n / 1.5);

    for (let py = 0; py < h; py += 2) {
      for (let px = 0; px < w; px += 2) {
        const x = (px - cx) * scale;
        const y = -(py - cy) * scale;
        const r = Math.sqrt(x * x + y * y);
        const theta = Math.atan2(y, x);

        let psi = 0;
        if (orbital === "1s") {
          psi = Math.exp(-r);
        } else if (orbital === "2s") {
          psi = (2 - r) * Math.exp(-r / 2);
        } else if (orbital === "2px") {
          psi = r * Math.exp(-r / 2) * Math.cos(theta);
        } else if (orbital === "2py") {
          psi = r * Math.exp(-r / 2) * Math.sin(theta);
        } else if (orbital === "2pz") {
          psi = r * Math.exp(-r / 2) * Math.sin(theta);
        } else if (orbital === "3d_xy") {
          psi = r * r * Math.exp(-r / 3) * Math.sin(2 * theta);
        } else if (orbital === "3d_z2") {
          psi = r * r * Math.exp(-r / 3) * (3 * Math.sin(theta) ** 2 - 1);
        }

        const prob = Math.abs(psi) ** 2;
        const normProb = Math.min(1, prob * (1.2 / cutoff));
        const sign = psi >= 0 ? 1 : -1;

        const idx = (py * w + px) * 4;
        const idxNext = ((py + 1) * w + px) * 4;

        let rColor = sign > 0 ? 129 : 236;
        let gColor = sign > 0 ? 140 : 72;
        let bColor = sign > 0 ? 248 : 153;

        const alpha = Math.round(normProb * 240);

        [idx, idx + 4, idxNext, idxNext + 4].forEach((offset) => {
          data[offset] = rColor;
          data[offset + 1] = gColor;
          data[offset + 2] = bColor;
          data[offset + 3] = alpha;
        });
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // Axes
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, h);
    ctx.stroke();

    // Nucleus
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
  }, [orbital, cutoff, current]);

  return (
    <div className="sim-interactive-grid">
      <div className="sim-ctrl-card">
        <h3>Hydrogen Orbital Selector</h3>
        <div className="sim-btn-grid">
          {Object.entries(ORBITALS).map(([key, val]) => (
            <button
              key={key}
              className={`sim-preset-btn ${orbital === key ? "active" : ""}`}
              onClick={() => setOrbital(key)}
            >
              <span>{val.name}</span>
              <small>n={val.n}, l={val.l}, m={val.m}</small>
            </button>
          ))}
        </div>

        <div className="sim-slider-group">
          <label>Probability Cutoff / Density: {cutoff.toFixed(2)}</label>
          <input
            type="range"
            min="0.1"
            max="1.5"
            step="0.05"
            value={cutoff}
            onChange={(e) => setCutoff(parseFloat(e.target.value))}
          />
        </div>

        <div className="sim-metric-table">
          <h4>Quantum Numbers & Nodes</h4>
          <div className="metric-row">
            <span>Principal (n):</span>
            <strong>{current.n}</strong>
          </div>
          <div className="metric-row">
            <span>Azimuthal (l):</span>
            <strong>{current.l}</strong>
          </div>
          <div className="metric-row">
            <span>Magnetic (mₗ):</span>
            <strong>{current.m}</strong>
          </div>
          <div className="metric-row">
            <span>Radial Spherical Nodes:</span>
            <strong>{current.radialNodes}</strong>
          </div>
          <div className="metric-row">
            <span>Angular Nodal Planes:</span>
            <strong>{current.angularNodes}</strong>
          </div>
          <div className="metric-row">
            <span>Bohr Energy Eₙ:</span>
            <strong>{(-13.6 / (current.n * current.n)).toFixed(2)} eV</strong>
          </div>
        </div>
      </div>

      <div className="sim-viz-card">
        <div className="viz-header">
          <span className="viz-title">Electron Probability Density |ψ|²</span>
          <span className="viz-tag">{current.name} Cross-Section</span>
        </div>
        <canvas
          ref={canvasRef}
          width={560}
          height={400}
          className="sim-canvas"
        />
        <div className="viz-footer">
          Blue = Positive wave-function phase (+) | Pink = Negative phase (-) | Center = Nucleus
        </div>
      </div>
    </div>
  );
}

// ─── 3. REACTION KINETICS SIMULATOR ───────────────────────────────────────────
function ReactionKineticsSim() {
  const [order, setOrder] = useState(1);
  const [k, setK] = useState(0.08);
  const [a0, setA0] = useState(1.0);
  const [temp, setTemp] = useState(298);

  const data = useMemo(() => {
    const points = [];
    const effectiveK = k * Math.exp((5000 / 8.314) * (1 / 298 - 1 / temp));
    const tMax = 60;
    const dt = 1;

    for (let t = 0; t <= tMax; t += dt) {
      let concA = 0;
      if (order === 0) {
        concA = Math.max(0, a0 - effectiveK * t);
      } else if (order === 1) {
        concA = a0 * Math.exp(-effectiveK * t);
      } else if (order === 2) {
        concA = a0 / (1 + effectiveK * t * a0);
      }
      const concB = Math.max(0, a0 - concA);
      points.push({
        time: t,
        "[A] (Reactant)": parseFloat(concA.toFixed(3)),
        "[B] (Product)": parseFloat(concB.toFixed(3)),
      });
    }
    return points;
  }, [order, k, a0, temp]);

  const halfLife = useMemo(() => {
    const effectiveK = k * Math.exp((5000 / 8.314) * (1 / 298 - 1 / temp));
    if (order === 0) return (a0 / (2 * effectiveK)).toFixed(1);
    if (order === 1) return (Math.LN2 / effectiveK).toFixed(1);
    return (1 / (effectiveK * a0)).toFixed(1);
  }, [order, k, a0, temp]);

  return (
    <div className="sim-interactive-grid">
      <div className="sim-ctrl-card">
        <h3>Reaction Parameters (A → B)</h3>
        <div className="sim-btn-grid">
          {[
            { o: 0, label: "Zero Order", eq: "-d[A]/dt = k" },
            { o: 1, label: "1st Order", eq: "-d[A]/dt = k[A]" },
            { o: 2, label: "2nd Order", eq: "-d[A]/dt = k[A]²" },
          ].map(({ o, label, eq }) => (
            <button
              key={o}
              className={`sim-preset-btn ${order === o ? "active" : ""}`}
              onClick={() => setOrder(o)}
            >
              <span>{label}</span>
              <small>{eq}</small>
            </button>
          ))}
        </div>

        <div className="sim-slider-group">
          <label>Initial Concentration [A]₀: {a0.toFixed(2)} M</label>
          <input
            type="range"
            min="0.2"
            max="2.0"
            step="0.1"
            value={a0}
            onChange={(e) => setA0(parseFloat(e.target.value))}
          />
        </div>

        <div className="sim-slider-group">
          <label>Rate Constant k: {k.toFixed(3)} s⁻¹</label>
          <input
            type="range"
            min="0.01"
            max="0.25"
            step="0.01"
            value={k}
            onChange={(e) => setK(parseFloat(e.target.value))}
          />
        </div>

        <div className="sim-slider-group">
          <label>Temperature (Arrhenius T): {temp} K</label>
          <input
            type="range"
            min="273"
            max="373"
            step="5"
            value={temp}
            onChange={(e) => setTemp(parseInt(e.target.value))}
          />
        </div>

        <div className="sim-metric-table">
          <h4>Kinetics Output</h4>
          <div className="metric-row">
            <span>Half-Life (t₁/₂):</span>
            <strong>{halfLife} s</strong>
          </div>
          <div className="metric-row">
            <span>Rate Law:</span>
            <code>{order === 0 ? "Rate = k" : order === 1 ? "Rate = k[A]" : "Rate = k[A]²"}</code>
          </div>
          <div className="metric-row">
            <span>Arrhenius Factor:</span>
            <strong>{(Math.exp((5000 / 8.314) * (1 / 298 - 1 / temp))).toFixed(2)}×</strong>
          </div>
        </div>
      </div>

      <div className="sim-viz-card">
        <div className="viz-header">
          <span className="viz-title">Concentration vs. Time Kinetics Curve</span>
          <span className="viz-tag">Order {order}</span>
        </div>
        <div style={{ height: 380, width: "100%", padding: "10px" }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="time" stroke="#94a3b8" label={{ value: "Time (s)", position: "insideBottom", offset: -5, fill: "#94a3b8" }} />
              <YAxis stroke="#94a3b8" label={{ value: "Concentration (M)", angle: -90, position: "insideLeft", fill: "#94a3b8" }} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="[A] (Reactant)" stroke="#ef4444" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="[B] (Product)" stroke="#10b981" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── 4. SIMPLE HARMONIC MOTION SIMULATOR ──────────────────────────────────────
function HarmonicMotionSim() {
  const [mass, setMass] = useState(1.0);
  const [k, setK] = useState(25);
  const [damping, setDamping] = useState(0.1);
  const [amp, setAmp] = useState(80);
  const [isRunning, setIsRunning] = useState(true);

  const canvasRef = useRef(null);
  const stateRef = useRef({ x: amp, v: 0, t: 0 });

  useEffect(() => {
    stateRef.current.x = amp;
    stateRef.current.v = 0;
  }, [amp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let lastTime = performance.now();

    const render = (now) => {
      const dt = Math.min(0.04, (now - lastTime) / 1000);
      lastTime = now;

      if (isRunning) {
        // Runge-Kutta 2 / Verlet integration
        const s = stateRef.current;
        const accel = (-k * s.x - damping * s.v) / mass;
        s.v += accel * dt;
        s.x += s.v * dt;
        s.t += dt;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const originY = 60;
      const massY = originY + 160 + stateRef.current.x;

      // Draw Support Wall
      ctx.fillStyle = "#334155";
      ctx.fillRect(cx - 60, originY - 12, 120, 12);
      ctx.strokeStyle = "#64748b";
      ctx.strokeRect(cx - 60, originY - 12, 120, 12);

      // Draw Coiled Spring
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx, originY);
      const coils = 14;
      const springLength = massY - originY;
      for (let i = 1; i <= coils; i++) {
        const segY = originY + (springLength * i) / coils;
        const segX = cx + (i % 2 === 0 ? 20 : -20);
        ctx.lineTo(segX, segY);
      }
      ctx.lineTo(cx, massY);
      ctx.stroke();

      // Draw Mass Bob
      const r = 24 + mass * 4;
      const grad = ctx.createRadialGradient(cx - r * 0.3, massY - r * 0.3, 3, cx, massY, r);
      grad.addColorStop(0, "#f87171");
      grad.addColorStop(1, "#991b1b");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, massY, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#fca5a5";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px var(--font-sans)";
      ctx.textAlign = "center";
      ctx.fillText(`${mass} kg`, cx, massY + 4);

      // Draw Equilibrium Guideline
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(cx - 100, originY + 160);
      ctx.lineTo(cx + 100, originY + 160);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.font = "11px var(--font-mono)";
      ctx.fillText("Equilibrium (x = 0)", cx + 110, originY + 164);

      // Energy calculation
      const ke = 0.5 * mass * (stateRef.current.v * 0.05) ** 2;
      const pe = 0.5 * k * (stateRef.current.x * 0.01) ** 2;
      const total = ke + pe;

      // Draw Energy Bars
      const barX = 30;
      const barY = 320;
      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px var(--font-mono)";
      ctx.fillText(`Kinetic: ${ke.toFixed(2)} J`, barX + 50, barY - 18);
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(barX, barY - 14, Math.min(120, ke * 40), 10);

      ctx.fillStyle = "#94a3b8";
      ctx.fillText(`Potential: ${pe.toFixed(2)} J`, barX + 50, barY + 12);
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(barX, barY + 16, Math.min(120, pe * 40), 10);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [mass, k, damping, isRunning]);

  const naturalFreq = (Math.sqrt(k / mass) / (2 * Math.PI)).toFixed(2);
  const period = ((2 * Math.PI) / Math.sqrt(k / mass)).toFixed(2);

  return (
    <div className="sim-interactive-grid">
      <div className="sim-ctrl-card">
        <h3>Oscillator Controls</h3>
        <div className="sim-action-row">
          <button
            className={`btn ${isRunning ? "btn-secondary" : "btn-primary"} btn-sm`}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? "⏸ Pause" : "▶ Resume"}
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              stateRef.current.x = amp;
              stateRef.current.v = 0;
            }}
          >
            ↺ Reset
          </button>
        </div>

        <div className="sim-slider-group">
          <label>Mass (m): {mass} kg</label>
          <input
            type="range"
            min="0.2"
            max="3.0"
            step="0.1"
            value={mass}
            onChange={(e) => setMass(parseFloat(e.target.value))}
          />
        </div>

        <div className="sim-slider-group">
          <label>Spring Constant (k): {k} N/m</label>
          <input
            type="range"
            min="5"
            max="60"
            step="1"
            value={k}
            onChange={(e) => setK(parseFloat(e.target.value))}
          />
        </div>

        <div className="sim-slider-group">
          <label>Damping Coefficient (b): {damping.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="0.8"
            step="0.05"
            value={damping}
            onChange={(e) => setDamping(parseFloat(e.target.value))}
          />
        </div>

        <div className="sim-slider-group">
          <label>Initial Amplitude (x₀): {amp} px</label>
          <input
            type="range"
            min="20"
            max="120"
            step="5"
            value={amp}
            onChange={(e) => setAmp(parseFloat(e.target.value))}
          />
        </div>

        <div className="sim-metric-table">
          <h4>Oscillation Metrics</h4>
          <div className="metric-row">
            <span>Natural Frequency (f₀):</span>
            <strong>{naturalFreq} Hz</strong>
          </div>
          <div className="metric-row">
            <span>Period (T):</span>
            <strong>{period} s</strong>
          </div>
          <div className="metric-row">
            <span>Angular Speed (ω₀):</span>
            <strong>{Math.sqrt(k / mass).toFixed(2)} rad/s</strong>
          </div>
        </div>
      </div>

      <div className="sim-viz-card">
        <div className="viz-header">
          <span className="viz-title">Damped Harmonic Oscillator Simulation</span>
          <span className="viz-tag">Hooke's Law: F = -kx - bv</span>
        </div>
        <canvas
          ref={canvasRef}
          width={540}
          height={400}
          className="sim-canvas"
        />
      </div>
    </div>
  );
}

// ─── 5. WAVE INTERFERENCE SIMULATOR ───────────────────────────────────────────
function WaveInterferenceSim() {
  const [lambda, setLambda] = useState(550); // nm
  const [slitDist, setSlitDist] = useState(0.25); // mm
  const [screenDist, setScreenDist] = useState(1.2); // m
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Compute fringe width beta = lambda * D / d
    const fringeWidthPx = (lambda * 1e-9 * screenDist) / (slitDist * 1e-3) * 8000;

    // Draw intensity profile on right 25% of canvas
    const splitX = w - 120;
    const cy = h / 2;

    // Laser color
    const laserColor = lambda < 450 ? "#a855f7" : lambda < 510 ? "#06b6d4" : lambda < 580 ? "#22c55e" : lambda < 640 ? "#eab308" : "#ef4444";

    // 1. Interference 2D waves
    const imgData = ctx.createImageData(splitX, h);
    const data = imgData.data;

    const kVal = (2 * Math.PI) / (lambda * 0.05);
    const s1y = cy - slitDist * 80;
    const s2y = cy + slitDist * 80;

    for (let py = 0; py < h; py += 2) {
      for (let px = 0; px < splitX; px += 2) {
        const r1 = Math.sqrt(px * px + (py - s1y) * (py - s1y));
        const r2 = Math.sqrt(px * px + (py - s2y) * (py - s2y));
        const val = Math.cos(kVal * r1) + Math.cos(kVal * r2);
        const norm = (val + 2) / 4; // 0 to 1

        const idx = (py * splitX + px) * 4;
        const idxNext = ((py + 1) * splitX + px) * 4;

        const alpha = Math.round(norm * 220);
        [idx, idx + 4, idxNext, idxNext + 4].forEach((o) => {
          data[o] = 34;
          data[o + 1] = 197;
          data[o + 2] = 94;
          data[o + 3] = alpha;
        });
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Slits barrier
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 8, h);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, s1y - 3, 8, 6);
    ctx.fillRect(0, s2y - 3, 8, 6);

    // Screen divider
    ctx.strokeStyle = "#475569";
    ctx.beginPath();
    ctx.moveTo(splitX, 0);
    ctx.lineTo(splitX, h);
    ctx.stroke();

    // Screen intensity fringes
    for (let y = 0; y < h; y++) {
      const dy = y - cy;
      const phase = (Math.PI * slitDist * 1e-3 * dy) / (lambda * 1e-9 * screenDist * 100);
      const intensity = Math.cos(phase) ** 2;

      ctx.fillStyle = laserColor;
      ctx.globalAlpha = intensity;
      ctx.fillRect(splitX + 10, y, 30, 1);

      // Intensity curve
      ctx.fillStyle = "#38bdf8";
      ctx.globalAlpha = 1;
      ctx.fillRect(splitX + 50 + intensity * 50, y, 2, 1);
    }
    ctx.globalAlpha = 1;
  }, [lambda, slitDist, screenDist]);

  const fringeWidthMm = ((lambda * 1e-9 * screenDist) / (slitDist * 1e-3) * 1000).toFixed(3);

  return (
    <div className="sim-interactive-grid">
      <div className="sim-ctrl-card">
        <h3>Young's Double-Slit Controls</h3>
        <div className="sim-slider-group">
          <label>Wavelength (λ): {lambda} nm</label>
          <input
            type="range"
            min="400"
            max="700"
            step="10"
            value={lambda}
            onChange={(e) => setLambda(parseInt(e.target.value))}
          />
        </div>

        <div className="sim-slider-group">
          <label>Slit Separation (d): {slitDist.toFixed(2)} mm</label>
          <input
            type="range"
            min="0.1"
            max="0.8"
            step="0.05"
            value={slitDist}
            onChange={(e) => setSlitDist(parseFloat(e.target.value))}
          />
        </div>

        <div className="sim-slider-group">
          <label>Screen Distance (D): {screenDist.toFixed(2)} m</label>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.1"
            value={screenDist}
            onChange={(e) => setScreenDist(parseFloat(e.target.value))}
          />
        </div>

        <div className="sim-metric-table">
          <h4>Interference Fringes</h4>
          <div className="metric-row">
            <span>Fringe Width (β = λD/d):</span>
            <strong>{fringeWidthMm} mm</strong>
          </div>
          <div className="metric-row">
            <span>Angular Fringe Separation:</span>
            <strong>{((lambda * 1e-9) / (slitDist * 1e-3) * 1000).toFixed(3)} mrad</strong>
          </div>
        </div>
      </div>

      <div className="sim-viz-card">
        <div className="viz-header">
          <span className="viz-title">Dual Wavefronts & Screen Fringe Pattern</span>
          <span className="viz-tag">λ = {lambda} nm</span>
        </div>
        <canvas
          ref={canvasRef}
          width={560}
          height={380}
          className="sim-canvas"
        />
        <div className="viz-footer">
          Left: Double Slit Wave Propagation | Right: Screen Intensity Profile I(θ) = I₀ cos²(β)
        </div>
      </div>
    </div>
  );
}

// ─── 6. ELECTRIC FIELDS SIMULATOR ─────────────────────────────────────────────
function ElectricFieldsSim() {
  const [charges, setCharges] = useState([
    { x: -100, y: 0, q: 1 },
    { x: 100, y: 0, q: -1 },
  ]);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;

    // Draw Vector Field arrows on a grid
    const step = 28;
    for (let x = -w / 2 + step / 2; x < w / 2; x += step) {
      for (let y = -h / 2 + step / 2; y < h / 2; y += step) {
        let ex = 0;
        let ey = 0;
        charges.forEach((c) => {
          const dx = x - c.x;
          const dy = y - c.y;
          const r2 = dx * dx + dy * dy;
          const r = Math.sqrt(r2);
          if (r > 15) {
            const mag = (c.q * 1000) / r2;
            ex += (mag * dx) / r;
            ey += (mag * dy) / r;
          }
        });

        const eMag = Math.sqrt(ex * ex + ey * ey);
        if (eMag > 0.05) {
          const arrowLen = Math.min(16, eMag * 8);
          const px = cx + x;
          const py = cy + y;
          const angle = Math.atan2(ey, ex);

          ctx.strokeStyle = `rgba(99, 102, 241, ${Math.min(0.8, eMag * 0.4 + 0.2)})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + Math.cos(angle) * arrowLen, py + Math.sin(angle) * arrowLen);
          ctx.stroke();
        }
      }
    }

    // Draw Charges
    charges.forEach((c) => {
      const px = cx + c.x;
      const py = cy + c.y;
      const r = 18;
      const grad = ctx.createRadialGradient(px - 5, py - 5, 2, px, py, r);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.5, c.q > 0 ? "#ef4444" : "#3b82f6");
      grad.addColorStop(1, c.q > 0 ? "#991b1b" : "#1e3a8a");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px var(--font-sans)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(c.q > 0 ? "+q" : "-q", px, py);
    });
  }, [charges]);

  return (
    <div className="sim-interactive-grid">
      <div className="sim-ctrl-card">
        <h3>Electrostatic Charge Setup</h3>
        <div className="sim-btn-grid">
          <button
            className="sim-preset-btn active"
            onClick={() =>
              setCharges([
                { x: -100, y: 0, q: 1 },
                { x: 100, y: 0, q: -1 },
              ])
            }
          >
            <span>Electric Dipole</span>
            <small>+q and -q</small>
          </button>
          <button
            className="sim-preset-btn"
            onClick={() =>
              setCharges([
                { x: -100, y: 0, q: 1 },
                { x: 100, y: 0, q: 1 },
              ])
            }
          >
            <span>Like Charges</span>
            <small>+q and +q</small>
          </button>
          <button
            className="sim-preset-btn"
            onClick={() =>
              setCharges([
                { x: -80, y: -80, q: 1 },
                { x: 80, y: -80, q: -1 },
                { x: -80, y: 80, q: -1 },
                { x: 80, y: 80, q: 1 },
              ])
            }
          >
            <span>Quadrupole</span>
            <small>4 Charges</small>
          </button>
        </div>

        <div className="sim-metric-table">
          <h4>Coulomb Field Principles</h4>
          <div className="metric-row">
            <span>Coulomb's Law:</span>
            <code>E = kq / r²</code>
          </div>
          <div className="metric-row">
            <span>Superposition:</span>
            <strong>E_total = Σ Eᵢ</strong>
          </div>
        </div>
      </div>

      <div className="sim-viz-card">
        <div className="viz-header">
          <span className="viz-title">2D Electric Field Lines & Vector Grid</span>
          <span className="viz-tag">{charges.length} Point Charges</span>
        </div>
        <canvas
          ref={canvasRef}
          width={560}
          height={380}
          className="sim-canvas"
        />
        <div className="viz-footer">
          Red = Positive charge (+q) | Blue = Negative charge (-q) | Arrows = Field direction E
        </div>
      </div>
    </div>
  );
}

// ─── 7. VECTOR FIELDS SIMULATOR ───────────────────────────────────────────────
function VectorFieldsSim() {
  const [preset, setPreset] = useState("vortex");
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const particles = Array.from({ length: 60 }, () => ({
      x: (Math.random() - 0.5) * 360,
      y: (Math.random() - 0.5) * 280,
      age: Math.random() * 100,
    }));

    const render = () => {
      ctx.fillStyle = "rgba(11, 15, 30, 0.25)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      const getVector = (x, y) => {
        if (preset === "vortex") return [-y, x];
        if (preset === "source") return [x, y];
        if (preset === "sink") return [-x, -y];
        if (preset === "saddle") return [x, -y];
        return [Math.sin(y * 0.03) * 30, Math.cos(x * 0.03) * 30];
      };

      // Draw flowing particles
      particles.forEach((p) => {
        const [vx, vy] = getVector(p.x, p.y);
        const speed = Math.sqrt(vx * vx + vy * vy) || 1;
        p.x += (vx / speed) * 2;
        p.y += (vy / speed) * 2;
        p.age++;

        if (p.age > 120 || Math.abs(p.x) > 200 || Math.abs(p.y) > 160) {
          p.x = (Math.random() - 0.5) * 360;
          p.y = (Math.random() - 0.5) * 280;
          p.age = 0;
        }

        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.arc(cx + p.x, cy + p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [preset]);

  return (
    <div className="sim-interactive-grid">
      <div className="sim-ctrl-card">
        <h3>Vector Field Presets F(x, y)</h3>
        <div className="sim-btn-grid">
          {[
            { id: "vortex", name: "Vortex / Circulation", formula: "⟨-y, x⟩" },
            { id: "source", name: "Source (Divergent)", formula: "⟨x, y⟩" },
            { id: "sink", name: "Sink (Convergent)", formula: "⟨-x, -y⟩" },
            { id: "saddle", name: "Saddle Point", formula: "⟨x, -y⟩" },
          ].map((item) => (
            <button
              key={item.id}
              className={`sim-preset-btn ${preset === item.id ? "active" : ""}`}
              onClick={() => setPreset(item.id)}
            >
              <span>{item.name}</span>
              <code>{item.formula}</code>
            </button>
          ))}
        </div>
      </div>

      <div className="sim-viz-card">
        <div className="viz-header">
          <span className="viz-title">Streamline Particle Tracing</span>
          <span className="viz-tag">{preset.toUpperCase()}</span>
        </div>
        <canvas
          ref={canvasRef}
          width={560}
          height={380}
          className="sim-canvas"
        />
      </div>
    </div>
  );
}

// ─── 8. DIFFERENTIAL EQUATIONS SIMULATOR ──────────────────────────────────────
function DifferentialEquationsSim() {
  const [ode, setOde] = useState("logistic");
  const [y0, setY0] = useState(0.8);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const scale = 36; // px per unit

    const f = (x, y) => {
      if (ode === "logistic") return y * (1 - y / 3);
      if (ode === "damped") return x - y;
      if (ode === "harmonic") return -x / (y === 0 ? 0.001 : y);
      return Math.sin(x) - y;
    };

    // Draw Slope Field Segments
    ctx.strokeStyle = "rgba(99, 102, 241, 0.4)";
    ctx.lineWidth = 1.5;
    for (let x = -6; x <= 6; x += 0.5) {
      for (let y = -4; y <= 4; y += 0.5) {
        const slope = f(x, y);
        const len = 7;
        const angle = Math.atan(slope);
        const px = cx + x * scale;
        const py = cy - y * scale;

        ctx.beginPath();
        ctx.moveTo(px - Math.cos(angle) * len, py + Math.sin(angle) * len);
        ctx.lineTo(px + Math.cos(angle) * len, py - Math.sin(angle) * len);
        ctx.stroke();
      }
    }

    // Integrate Solution curve via Runge-Kutta 4
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 3;
    ctx.beginPath();

    let curX = -5;
    let curY = y0;
    const step = 0.05;

    ctx.moveTo(cx + curX * scale, cy - curY * scale);

    for (let i = 0; i < 200; i++) {
      const k1 = f(curX, curY);
      const k2 = f(curX + step / 2, curY + (step * k1) / 2);
      const k3 = f(curX + step / 2, curY + (step * k2) / 2);
      const k4 = f(curX + step, curY + step * k3);
      curY += (step * (k1 + 2 * k2 + 2 * k3 + k4)) / 6;
      curX += step;
      ctx.lineTo(cx + curX * scale, cy - curY * scale);
    }
    ctx.stroke();
  }, [ode, y0]);

  return (
    <div className="sim-interactive-grid">
      <div className="sim-ctrl-card">
        <h3>First-Order ODE System dy/dx = f(x, y)</h3>
        <div className="sim-btn-grid">
          {[
            { id: "logistic", name: "Logistic Growth", eq: "y(1 - y/3)" },
            { id: "damped", name: "Linear Damped", eq: "x - y" },
            { id: "harmonic", name: "Circle Field", eq: "-x / y" },
          ].map((item) => (
            <button
              key={item.id}
              className={`sim-preset-btn ${ode === item.id ? "active" : ""}`}
              onClick={() => setOde(item.id)}
            >
              <span>{item.name}</span>
              <code>{item.eq}</code>
            </button>
          ))}
        </div>

        <div className="sim-slider-group">
          <label>Initial Condition y(0): {y0.toFixed(2)}</label>
          <input
            type="range"
            min="-3"
            max="3"
            step="0.2"
            value={y0}
            onChange={(e) => setY0(parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div className="sim-viz-card">
        <div className="viz-header">
          <span className="viz-title">Slope Field & RK4 Solution Trajectory</span>
          <span className="viz-tag">y(0) = {y0}</span>
        </div>
        <canvas
          ref={canvasRef}
          width={560}
          height={380}
          className="sim-canvas"
        />
      </div>
    </div>
  );
}

// ─── 9. POPULATION GROWTH SIMULATOR ───────────────────────────────────────────
function PopulationGrowthSim() {
  const [r, setR] = useState(0.12);
  const [k, setK] = useState(1000);
  const [n0, setN0] = useState(50);

  const data = useMemo(() => {
    const pts = [];
    let nLog = n0;
    let nExp = n0;
    for (let t = 0; t <= 50; t += 2) {
      nLog = (k * n0) / (n0 + (k - n0) * Math.exp(-r * t));
      nExp = Math.min(2500, n0 * Math.exp(r * t));
      pts.push({
        t,
        "Logistic (K Saturation)": Math.round(nLog),
        "Exponential (Unbounded)": Math.round(nExp),
      });
    }
    return pts;
  }, [r, k, n0]);

  return (
    <div className="sim-interactive-grid">
      <div className="sim-ctrl-card">
        <h3>Ecology Parameters</h3>
        <div className="sim-slider-group">
          <label>Growth Rate (r): {r.toFixed(2)} / yr</label>
          <input
            type="range"
            min="0.05"
            max="0.3"
            step="0.01"
            value={r}
            onChange={(e) => setR(parseFloat(e.target.value))}
          />
        </div>
        <div className="sim-slider-group">
          <label>Carrying Capacity (K): {k}</label>
          <input
            type="range"
            min="200"
            max="2000"
            step="50"
            value={k}
            onChange={(e) => setK(parseInt(e.target.value))}
          />
        </div>
        <div className="sim-slider-group">
          <label>Initial Population (N₀): {n0}</label>
          <input
            type="range"
            min="10"
            max="200"
            step="5"
            value={n0}
            onChange={(e) => setN0(parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="sim-viz-card">
        <div className="viz-header">
          <span className="viz-title">Logistic vs. Exponential Population Curves</span>
          <span className="viz-tag">dN/dt = rN(1 - N/K)</span>
        </div>
        <div style={{ height: 380, width: "100%", padding: "10px" }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="t" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} />
              <Legend verticalAlign="top" />
              <ReferenceLine y={k} stroke="#eab308" strokeDasharray="5 5" label="Carrying Capacity K" />
              <Line type="monotone" dataKey="Logistic (K Saturation)" stroke="#22c55e" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="Exponential (Unbounded)" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── 10. DNA STRUCTURE SIMULATOR ──────────────────────────────────────────────
function DnaStructureSim() {
  const [speed, setSpeed] = useState(0.02);
  const canvasRef = useRef(null);
  const angleRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const basePairs = [
      { a: "A", b: "T", cA: "#22c55e", cB: "#ef4444" },
      { a: "G", b: "C", cA: "#eab308", cB: "#3b82f6" },
      { a: "T", b: "A", cA: "#ef4444", cB: "#22c55e" },
      { a: "C", b: "G", cA: "#3b82f6", cB: "#eab308" },
      { a: "A", b: "T", cA: "#22c55e", cB: "#ef4444" },
      { a: "C", b: "G", cA: "#3b82f6", cB: "#eab308" },
    ];

    const render = () => {
      angleRef.current += speed;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const count = 28;
      const radius = 90;

      for (let i = 0; i < count; i++) {
        const y = 30 + i * 12;
        const theta = angleRef.current + i * 0.45;
        const x1 = cx + Math.cos(theta) * radius;
        const x2 = cx - Math.cos(theta) * radius;
        const depth1 = Math.sin(theta);

        const bp = basePairs[i % basePairs.length];

        // Hydrogen bond rungs
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();

        // Sugar-phosphate backbone nodes
        [
          { x: x1, color: bp.cA, base: bp.a },
          { x: x2, color: bp.cB, base: bp.b },
        ].forEach((node) => {
          ctx.fillStyle = node.color;
          ctx.beginPath();
          ctx.arc(node.x, y, 7 + depth1 * 2, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [speed]);

  return (
    <div className="sim-interactive-grid">
      <div className="sim-ctrl-card">
        <h3>DNA Double Helix Parameters</h3>
        <div className="sim-slider-group">
          <label>Rotation Velocity: {speed.toFixed(3)}</label>
          <input
            type="range"
            min="0.005"
            max="0.06"
            step="0.005"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
          />
        </div>

        <div className="sim-metric-table">
          <h4>Base Pairing Rules</h4>
          <div className="metric-row">
            <span>Adenine (A) = Thymine (T):</span>
            <strong style={{ color: "#22c55e" }}>2 Hydrogen Bonds</strong>
          </div>
          <div className="metric-row">
            <span>Guanine (G) ≡ Cytosine (C):</span>
            <strong style={{ color: "#eab308" }}>3 Hydrogen Bonds</strong>
          </div>
          <div className="metric-row">
            <span>Helical Pitch:</span>
            <strong>3.4 nm (10.5 bp / turn)</strong>
          </div>
        </div>
      </div>

      <div className="sim-viz-card">
        <div className="viz-header">
          <span className="viz-title">3D Antiparallel Double Helix</span>
          <span className="viz-tag">Watson & Crick Model</span>
        </div>
        <canvas
          ref={canvasRef}
          width={560}
          height={380}
          className="sim-canvas"
        />
      </div>
    </div>
  );
}

// ─── 11. SORTING ALGORITHMS SIMULATOR ─────────────────────────────────────────
function SortingAlgorithmsSim() {
  const [arraySize, setArraySize] = useState(25);
  const [algo, setAlgo] = useState("bubble");
  const [array, setArray] = useState([]);
  const [activeIndices, setActiveIndices] = useState([]);
  const [isSorting, setIsSorting] = useState(false);

  const resetArray = useCallback(() => {
    const arr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 80) + 10);
    setArray(arr);
    setActiveIndices([]);
  }, [arraySize]);

  useEffect(() => {
    resetArray();
  }, [resetArray]);

  const runSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    const arr = [...array];

    if (algo === "bubble") {
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
          setActiveIndices([j, j + 1]);
          await new Promise((r) => setTimeout(r, 40));
          if (arr[j] > arr[j + 1]) {
            const tmp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = tmp;
            setArray([...arr]);
          }
        }
      }
    } else if (algo === "insertion") {
      for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
          setActiveIndices([j, j + 1]);
          await new Promise((r) => setTimeout(r, 40));
          arr[j + 1] = arr[j];
          j--;
          setArray([...arr]);
        }
        arr[j + 1] = key;
        setArray([...arr]);
      }
    }

    setActiveIndices([]);
    setIsSorting(false);
  };

  return (
    <div className="sim-interactive-grid">
      <div className="sim-ctrl-card">
        <h3>Sorting Visualizer</h3>
        <div className="sim-btn-grid">
          {[
            { id: "bubble", name: "Bubble Sort", o: "O(n²)" },
            { id: "insertion", name: "Insertion Sort", o: "O(n²)" },
          ].map((item) => (
            <button
              key={item.id}
              className={`sim-preset-btn ${algo === item.id ? "active" : ""}`}
              onClick={() => setAlgo(item.id)}
            >
              <span>{item.name}</span>
              <small>{item.o}</small>
            </button>
          ))}
        </div>

        <div className="sim-action-row" style={{ marginTop: 16 }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={runSort}
            disabled={isSorting}
          >
            {isSorting ? "Sorting…" : "▶ Play Sort"}
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={resetArray}
            disabled={isSorting}
          >
            ↺ Shuffle Array
          </button>
        </div>

        <div className="sim-slider-group">
          <label>Array Size (n): {arraySize}</label>
          <input
            type="range"
            min="10"
            max="40"
            step="5"
            value={arraySize}
            onChange={(e) => setArraySize(parseInt(e.target.value))}
            disabled={isSorting}
          />
        </div>
      </div>

      <div className="sim-viz-card">
        <div className="viz-header">
          <span className="viz-title">Real-Time Comparison & Swap Array Bars</span>
          <span className="viz-tag">{algo.toUpperCase()}</span>
        </div>
        <div className="sorting-bars-container">
          {array.map((val, idx) => {
            const isActive = activeIndices.includes(idx);
            return (
              <div
                key={idx}
                className="sorting-bar"
                style={{
                  height: `${val * 3.5}px`,
                  background: isActive ? "#ef4444" : "#6366f1",
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── 12. GRAPH ALGORITHMS SIMULATOR ───────────────────────────────────────────
function GraphAlgorithmsSim() {
  const [grid, setGrid] = useState(() =>
    Array(12).fill(0).map(() => Array(16).fill(0))
  );
  const [visited, setVisited] = useState([]);
  const [path, setPath] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const start = [2, 2];
  const target = [9, 13];

  const toggleWall = (r, c) => {
    if ((r === start[0] && c === start[1]) || (r === target[0] && c === target[1])) return;
    setGrid((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = next[r][c] === 1 ? 0 : 1;
      return next;
    });
  };

  const runBFS = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setVisited([]);
    setPath([]);

    const queue = [[...start, []]];
    const seen = new Set([`${start[0]},${start[1]}`]);
    const visList = [];

    while (queue.length > 0) {
      const [r, c, p] = queue.shift();
      const currentPath = [...p, [r, c]];

      if (r === target[0] && c === target[1]) {
        setPath(currentPath);
        setIsRunning(false);
        return;
      }

      const dirs = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ];
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        const key = `${nr},${nc}`;
        if (
          nr >= 0 &&
          nr < 12 &&
          nc >= 0 &&
          nc < 16 &&
          grid[nr][nc] === 0 &&
          !seen.has(key)
        ) {
          seen.add(key);
          visList.push([nr, nc]);
          queue.push([nr, nc, currentPath]);
        }
      }

      setVisited([...visList]);
      await new Promise((res) => setTimeout(res, 20));
    }

    setIsRunning(false);
  };

  return (
    <div className="sim-interactive-grid">
      <div className="sim-ctrl-card">
        <h3>Breadth-First Search (BFS) Pathfinding</h3>
        <div className="sim-action-row">
          <button
            className="btn btn-primary btn-sm"
            onClick={runBFS}
            disabled={isRunning}
          >
            {isRunning ? "Exploring…" : "▶ Find Shortest Path"}
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setGrid(Array(12).fill(0).map(() => Array(16).fill(0)));
              setVisited([]);
              setPath([]);
            }}
            disabled={isRunning}
          >
            Clear Obstacles
          </button>
        </div>

        <div className="sim-metric-table" style={{ marginTop: 20 }}>
          <h4>Graph Metrics</h4>
          <div className="metric-row">
            <span>Explored Nodes:</span>
            <strong>{visited.length}</strong>
          </div>
          <div className="metric-row">
            <span>Optimal Path Length:</span>
            <strong>{path.length ? `${path.length} steps` : "—"}</strong>
          </div>
        </div>
      </div>

      <div className="sim-viz-card">
        <div className="viz-header">
          <span className="viz-title">2D Grid Graph Search</span>
          <span className="viz-tag">Click Cells to Draw Walls</span>
        </div>
        <div className="pathfind-grid">
          {grid.map((row, r) => (
            <div key={r} className="pathfind-row">
              {row.map((cell, c) => {
                const isStart = r === start[0] && c === start[1];
                const isTarget = r === target[0] && c === target[1];
                const isWall = cell === 1;
                const isP = path.some(([pr, pc]) => pr === r && pc === c);
                const isV = visited.some(([vr, vc]) => vr === r && vc === c);

                let cellClass = "pathfind-cell";
                if (isStart) cellClass += " start";
                else if (isTarget) cellClass += " target";
                else if (isWall) cellClass += " wall";
                else if (isP) cellClass += " path";
                else if (isV) cellClass += " visited";

                return (
                  <div
                    key={c}
                    className={cellClass}
                    onClick={() => toggleWall(r, c)}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="viz-footer">
          🟢 Start | 🎯 Target | Yellow = Shortest Path | Cyan = Visited Nodes
        </div>
      </div>
    </div>
  );
}

// ─── MAIN RUNNER ROUTER ───────────────────────────────────────────────────────
export default function InteractiveSimRunner() {
  const { simulatorId } = useParams();
  const navigate = useNavigate();
  const sim = getById(simulatorId);
  const subjectMeta = sim ? SUBJECT_META[sim.subject] : null;

  if (!sim) {
    return (
      <div className="sim-not-found">
        <h2>Simulation not found</h2>
        <Link to="/" className="btn btn-primary">
          ← Back to Simulations
        </Link>
      </div>
    );
  }

  const renderSimComponent = () => {
    switch (sim.id) {
      case "molecular-geometry":
        return <MolecularGeometrySim />;
      case "atomic-orbitals":
        return <AtomicOrbitalsSim />;
      case "reaction-kinetics":
        return <ReactionKineticsSim />;
      case "simple-harmonic-motion":
        return <HarmonicMotionSim />;
      case "wave-interference":
        return <WaveInterferenceSim />;
      case "electric-fields":
        return <ElectricFieldsSim />;
      case "vector-fields":
        return <VectorFieldsSim />;
      case "differential-equations":
        return <DifferentialEquationsSim />;
      case "population-growth":
        return <PopulationGrowthSim />;
      case "dna-structure":
        return <DnaStructureSim />;
      case "sorting-algorithms":
        return <SortingAlgorithmsSim />;
      case "graph-algorithms":
        return <GraphAlgorithmsSim />;
      default:
        return <div>Simulator engine coming soon.</div>;
    }
  };

  return (
    <div className="sim-runner-page">
      {/* Top Bar with 1-click back to box view */}
      <div className="sim-runner-header">
        <button
          className="btn-back"
          onClick={() => navigate("/")}
          title="Return to Box View"
        >
          ← All Simulations
        </button>

        <div className="sim-runner-meta">
          <span className="sim-runner-icon">{sim.icon}</span>
          <div>
            <div className="sim-runner-breadcrumb">
              <span style={{ color: subjectMeta?.color }}>
                {subjectMeta?.label}
              </span>
              <span>›</span>
              <span>{sim.topic}</span>
            </div>
            <h1 className="sim-runner-title">{sim.title}</h1>
          </div>
        </div>

        {/* Quick simulator switcher dropdown */}
        <select
          className="sim-quick-switch"
          value={sim.id}
          onChange={(e) => navigate(SIMULATORS.find((s) => s.id === e.target.value).route)}
        >
          {SIMULATORS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.icon} {s.title} ({s.subject})
            </option>
          ))}
        </select>
      </div>

      {/* Simulation Container */}
      <div className="sim-runner-content">{renderSimComponent()}</div>
    </div>
  );
}
