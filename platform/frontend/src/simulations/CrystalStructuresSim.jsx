import React, { useState, useEffect, useRef } from "react";

export default function CrystalStructuresSim() {
  const [structure, setStructure] = useState("BCC"); // "SC" | "BCC" | "FCC"
  const [radiusPm, setRadiusPm] = useState(128); // Atomic radius in picometers (pm)
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationAngle, setRotationAngle] = useState({ x: 25, y: 35 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);
  const animRef = useRef(null);

  // Structural Constants
  const STRUCTURE_DATA = {
    SC: {
      name: "Simple Cubic (SC)",
      description: "Corner atoms only",
      Z: 1,
      coordination: 6,
      packingEfficiency: 52.4,
      edgeRelation: "a = 2r",
      getA: (r) => 2 * r,
      element: "Polonium (Po)",
      molarMass: 209.0, // g/mol
    },
    BCC: {
      name: "Body-Centred Cubic (BCC)",
      description: "Corner atoms + 1 center atom",
      Z: 2,
      coordination: 8,
      packingEfficiency: 68.0,
      edgeRelation: "√3 a = 4r",
      getA: (r) => (4 * r) / Math.sqrt(3),
      element: "Iron (Fe)",
      molarMass: 55.85,
    },
    FCC: {
      name: "Face-Centred Cubic (FCC)",
      description: "Corner atoms + 6 face-centred atoms",
      Z: 4,
      coordination: 12,
      packingEfficiency: 74.0,
      edgeRelation: "√2 a = 4r",
      getA: (r) => (4 * r) / Math.sqrt(2),
      element: "Copper (Cu)",
      molarMass: 63.55,
    },
  };

  const curr = STRUCTURE_DATA[structure];
  const aPm = curr.getA(radiusPm);
  const aCm = aPm * 1e-10; // convert pm to cm
  const volumeCm3 = Math.pow(aCm, 3);
  const NA = 6.022e23; // Avogadro's constant
  const density = (curr.Z * curr.molarMass) / (NA * volumeCm3); // g/cm³

  // Base unit cell atom coordinates [x, y, z] normalized from 0 to 1
  const getAtoms = () => {
    const atoms = [];
    // 8 Corner Atoms
    const corners = [
      [0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0],
      [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]
    ];
    corners.forEach((pos) => atoms.push({ pos, type: "corner", color: "#3b82f6" }));

    if (structure === "BCC") {
      // 1 Body-center atom
      atoms.push({ pos: [0.5, 0.5, 0.5], type: "center", color: "#ef4444" });
    } else if (structure === "FCC") {
      // 6 Face-center atoms
      const faces = [
        [0.5, 0.5, 0], [0.5, 0.5, 1],
        [0.5, 0, 0.5], [0.5, 1, 0.5],
        [0, 0.5, 0.5], [1, 0.5, 0.5]
      ];
      faces.forEach((pos) => atoms.push({ pos, type: "face", color: "#10b981" }));
    }
    return atoms;
  };

  // Drag Interaction
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setAutoRotate(false);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setRotationAngle((prev) => ({
      x: prev.x + dy * 0.5,
      y: prev.y + dx * 0.5,
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Auto-rotation loop
  useEffect(() => {
    if (!autoRotate) return;
    let last = performance.now();
    const loop = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      setRotationAngle((prev) => ({
        x: prev.x + dt * 4,
        y: prev.y + dt * 14,
      }));
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [autoRotate]);

  // 3D Rendering on 2D Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const boxSize = 180; // Size of unit cell in px

    const radX = (rotationAngle.x * Math.PI) / 180;
    const radY = (rotationAngle.y * Math.PI) / 180;

    const cosX = Math.cos(radX), sinX = Math.sin(radX);
    const cosY = Math.cos(radY), sinY = Math.sin(radY);

    // 3D projection function
    const project = ([x, y, z]) => {
      // Center origin at [0, 0, 0]
      const ox = (x - 0.5) * boxSize;
      const oy = (y - 0.5) * boxSize;
      const oz = (z - 0.5) * boxSize;

      // Rotate Y
      const x1 = ox * cosY + oz * sinY;
      const z1 = -ox * sinY + oz * cosY;

      // Rotate X
      const y2 = oy * cosX - z1 * sinX;
      const z2 = oy * sinX + z1 * cosX;

      // Perspective scale
      const cameraDistance = 450;
      const scale = cameraDistance / (cameraDistance + z2);

      return {
        px: cx + x1 * scale,
        py: cy + y2 * scale,
        depth: z2,
        scale,
      };
    };

    // 12 Edges of the unit cell cube
    const edges = [
      [[0,0,0], [1,0,0]], [[1,0,0], [1,1,0]], [[1,1,0], [0,1,0]], [[0,1,0], [0,0,0]],
      [[0,0,1], [1,0,1]], [[1,0,1], [1,1,1]], [[1,1,1], [0,1,1]], [[0,1,1], [0,0,1]],
      [[0,0,0], [0,0,1]], [[1,0,0], [1,0,1]], [[1,1,0], [1,1,1]], [[0,1,0], [0,1,1]],
    ];

    // Draw Unit Cell Wireframe Edges
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 2;
    edges.forEach(([p1, p2]) => {
      const proj1 = project(p1);
      const proj2 = project(p2);
      ctx.beginPath();
      ctx.moveTo(proj1.px, proj1.py);
      ctx.lineTo(proj2.px, proj2.py);
      ctx.stroke();
    });

    // Atoms to render
    const atoms = getAtoms().map((a) => ({
      ...a,
      proj: project(a.pos),
    }));

    // Depth Sorting (draw back to front)
    atoms.sort((a, b) => a.proj.depth - b.proj.depth);

    // Atom radius scaling relative to cell size
    const atomRadiusScaled = (radiusPm / aPm) * (boxSize / 2) * 0.72;

    atoms.forEach(({ proj, color, type }) => {
      const r = Math.max(8, atomRadiusScaled * proj.scale);

      // Radial 3D sphere gradient
      const grad = ctx.createRadialGradient(
        proj.px - r * 0.35,
        proj.py - r * 0.35,
        r * 0.1,
        proj.px,
        proj.py,
        r
      );
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.35, color);
      grad.addColorStop(1, "#0f172a");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(proj.px, proj.py, r, 0, Math.PI * 2);
      ctx.fill();

      // Subtle contour stroke
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }, [structure, radiusPm, rotationAngle, aPm]);

  return (
    <div className="sim-module-workspace">
      {/* ── Main 3D Canvas Viewport ── */}
      <div
        className="sim-canvas-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <canvas
          ref={canvasRef}
          width={880}
          height={420}
          className="sim-main-canvas"
        />
        <div className="sim-canvas-overlay-badge">
          {curr.name} · {autoRotate ? "Auto-Rotating" : "Interactive View"}
        </div>
      </div>

      {/* ── Controls Strip ── */}
      <div className="sim-controls-strip">
        <div className="sim-ctrl-item">
          <label>Lattice System</label>
          <div className="sim-segmented-btn">
            {["SC", "BCC", "FCC"].map((type) => (
              <button
                key={type}
                className={`seg-btn ${structure === type ? "active" : ""}`}
                onClick={() => setStructure(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="sim-ctrl-item">
          <label>
            <span>Atomic Radius (r)</span>
            <strong>{radiusPm} pm</strong>
          </label>
          <input
            type="range"
            min="60"
            max="220"
            step="2"
            value={radiusPm}
            onChange={(e) => setRadiusPm(Number(e.target.value))}
          />
        </div>

        <div className="sim-btn-group">
          <button
            className={`btn ${autoRotate ? "btn-secondary" : "btn-primary"}`}
            onClick={() => setAutoRotate(!autoRotate)}
          >
            {autoRotate ? "Pause Rotation" : "Auto-Rotate"}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setRotationAngle({ x: 25, y: 35 });
              setAutoRotate(true);
            }}
          >
            Reset View
          </button>
        </div>
      </div>

      {/* ── Live Solid State Calculations Strip ── */}
      <div className="sim-results-grid">
        <div className="sim-result-card">
          <span className="res-label">Atoms Per Cell (Z)</span>
          <span className="res-val">{curr.Z}</span>
          <span className="res-eq">{curr.description}</span>
        </div>

        <div className="sim-result-card">
          <span className="res-label">Coordination Number</span>
          <span className="res-val">{curr.coordination}</span>
          <span className="res-eq">Nearest Neighbors</span>
        </div>

        <div className="sim-result-card">
          <span className="res-label">Packing Efficiency</span>
          <span className="res-val">{curr.packingEfficiency}%</span>
          <span className="res-eq">{curr.edgeRelation}</span>
        </div>

        <div className="sim-result-card highlight">
          <span className="res-label">Edge Length (a) & Density (ρ)</span>
          <span className="res-val">{aPm.toFixed(1)} pm</span>
          <span className="res-eq">ρ = {density.toFixed(2)} g/cm³ ({curr.element})</span>
        </div>
      </div>
    </div>
  );
}
