import React, { useState, useEffect, useRef, useMemo } from "react";

export default function WaveSuperpositionSim() {
  // Wave 1 parameters
  const [amp1, setAmp1] = useState(1.0);
  const [freq1, setFreq1] = useState(1.0);
  const [phase1, setPhase1] = useState(0);

  // Wave 2 parameters
  const [amp2, setAmp2] = useState(1.0);
  const [freq2, setFreq2] = useState(1.0);
  const [phase2, setPhase2] = useState(0);

  // Display
  const [showWave1, setShowWave1] = useState(true);
  const [showWave2, setShowWave2] = useState(true);
  const [showResultant, setShowResultant] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [timeOffset, setTimeOffset] = useState(0);

  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const lastFrameRef = useRef(null);

  const handleReset = () => {
    setAmp1(1.0);
    setFreq1(1.0);
    setPhase1(0);
    setAmp2(1.0);
    setFreq2(1.0);
    setPhase2(0);
    setShowWave1(true);
    setShowWave2(true);
    setShowResultant(true);
    setAnimating(false);
    setTimeOffset(0);
  };

  // Derived values (instant)
  const maxAmp = amp1 + amp2;
  const minAmp = Math.abs(amp1 - amp2);
  const isConstructive = freq1 === freq2 && Math.abs(phase1 - phase2) < 0.05;
  const isDestructive = freq1 === freq2 && Math.abs(Math.abs(phase1 - phase2) - Math.PI) < 0.15;

  const interferenceType = isConstructive
    ? "Constructive"
    : isDestructive
    ? "Destructive"
    : freq1 === freq2
    ? "Partial"
    : "Beat Pattern";

  const beatFrequency =
    freq1 !== freq2 ? Math.abs(freq1 - freq2).toFixed(2) : "—";

  // Animation loop for traveling waves
  useEffect(() => {
    if (!animating) {
      lastFrameRef.current = null;
      return;
    }
    const tick = (now) => {
      if (!lastFrameRef.current) lastFrameRef.current = now;
      const rawDt = (now - lastFrameRef.current) / 1000;
      const dt = Math.min(Math.max(rawDt, 0), 0.05);
      lastFrameRef.current = now;
      setTimeOffset((prev) => (prev + dt * 2) % (Math.PI * 200));
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [animating]);

  // Canvas rendering — fires instantly on any parameter change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    const pad = { left: 50, right: 20, top: 30, bottom: 30 };
    const plotW = W - pad.left - pad.right;
    const plotH = H - pad.top - pad.bottom;
    const midY = pad.top + plotH / 2;
    const maxY = Math.max(maxAmp, 0.5) * 1.2;

    const toX = (i) => pad.left + (i / 500) * plotW;
    const toY = (val) => midY - (val / maxY) * (plotH / 2);

    // Grid
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);

    // Horizontal grid lines
    const ySteps = 6;
    for (let i = 0; i <= ySteps; i++) {
      const v = -maxY + (2 * maxY * i) / ySteps;
      const y = toY(v);
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(W - pad.right, y);
      ctx.stroke();

      if (Math.abs(v) > 0.01) {
        ctx.fillStyle = "#9ca3af";
        ctx.font = "10px var(--font-mono)";
        ctx.textAlign = "right";
        ctx.fillText(v.toFixed(1), pad.left - 6, y + 3);
      }
    }

    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = pad.left + (plotW * i) / 10;
      ctx.beginPath();
      ctx.moveTo(x, pad.top);
      ctx.lineTo(x, H - pad.bottom);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Axes
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, H - pad.bottom);
    ctx.lineTo(W - pad.right, H - pad.bottom);
    ctx.stroke();

    // Zero line
    ctx.strokeStyle = "#d1d5db";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, midY);
    ctx.lineTo(W - pad.right, midY);
    ctx.stroke();

    ctx.fillStyle = "#6b7280";
    ctx.font = "10px var(--font-mono)";
    ctx.textAlign = "right";
    ctx.fillText("0", pad.left - 6, midY + 3);

    // Axis labels
    ctx.fillStyle = "#475569";
    ctx.font = "11px var(--font-sans)";
    ctx.textAlign = "center";
    ctx.fillText("Position (x)", pad.left + plotW / 2, H - 6);
    ctx.save();
    ctx.translate(14, midY);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Amplitude", 0, 0);
    ctx.restore();

    // Calculate wave values
    const N = 500;
    const wave1 = new Float32Array(N);
    const wave2 = new Float32Array(N);
    const resultant = new Float32Array(N);

    for (let i = 0; i < N; i++) {
      const xPos = (i / N) * 4 * Math.PI;
      wave1[i] = amp1 * Math.sin(freq1 * xPos + phase1 - timeOffset * freq1);
      wave2[i] = amp2 * Math.sin(freq2 * xPos + phase2 - timeOffset * freq2);
      resultant[i] = wave1[i] + wave2[i];
    }

    // Draw helper
    const drawWave = (data, color, lineWidth, dash) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      if (dash) ctx.setLineDash(dash);
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const x = toX(i);
        const y = toY(data[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    };

    // Draw waves
    if (showWave1) drawWave(wave1, "#3b82f6", 2, [6, 3]);
    if (showWave2) drawWave(wave2, "#f59e0b", 2, [6, 3]);

    // Resultant wave with fill
    if (showResultant) {
      // Fill under the resultant wave
      ctx.fillStyle = "rgba(16, 185, 129, 0.08)";
      ctx.beginPath();
      ctx.moveTo(toX(0), midY);
      for (let i = 0; i < N; i++) {
        ctx.lineTo(toX(i), toY(resultant[i]));
      }
      ctx.lineTo(toX(N - 1), midY);
      ctx.closePath();
      ctx.fill();

      drawWave(resultant, "#10b981", 3, null);
    }

    // Legend
    const legendX = W - pad.right - 180;
    const legendY = pad.top + 10;
    ctx.font = "11px var(--font-sans)";

    if (showWave1) {
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 3]);
      ctx.beginPath();
      ctx.moveTo(legendX, legendY);
      ctx.lineTo(legendX + 20, legendY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#3b82f6";
      ctx.textAlign = "left";
      ctx.fillText(`Wave 1  A=${amp1.toFixed(1)}  f=${freq1.toFixed(1)}`, legendX + 25, legendY + 4);
    }

    if (showWave2) {
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 3]);
      ctx.beginPath();
      ctx.moveTo(legendX, legendY + 18);
      ctx.lineTo(legendX + 20, legendY + 18);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#f59e0b";
      ctx.fillText(`Wave 2  A=${amp2.toFixed(1)}  f=${freq2.toFixed(1)}`, legendX + 25, legendY + 22);
    }

    if (showResultant) {
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(legendX, legendY + 36);
      ctx.lineTo(legendX + 20, legendY + 36);
      ctx.stroke();
      ctx.fillStyle = "#10b981";
      ctx.fillText("Resultant (y₁ + y₂)", legendX + 25, legendY + 40);
    }

    // Interference type badge
    const badgeColors = {
      Constructive: "#16a34a",
      Destructive: "#dc2626",
      Partial: "#d97706",
      "Beat Pattern": "#7c3aed",
    };
    const badgeColor = badgeColors[interferenceType] || "#475569";
    ctx.fillStyle = badgeColor;
    ctx.font = "bold 12px var(--font-sans)";
    ctx.textAlign = "left";
    ctx.fillText(`${interferenceType} Interference`, pad.left + 8, pad.top + 16);
  }, [
    amp1, freq1, phase1, amp2, freq2, phase2,
    showWave1, showWave2, showResultant,
    maxAmp, interferenceType, timeOffset,
  ]);

  // Preset configurations
  const presets = [
    { label: "Constructive", desc: "Same freq, in phase", a1: 1, f1: 1, p1: 0, a2: 1, f2: 1, p2: 0 },
    { label: "Destructive", desc: "Same freq, π out of phase", a1: 1, f1: 1, p1: 0, a2: 1, f2: 1, p2: Math.PI },
    { label: "Beat Pattern", desc: "Close frequencies", a1: 1, f1: 2.0, p1: 0, a2: 1, f2: 2.3, p2: 0 },
    { label: "Harmonic", desc: "Octave relationship", a1: 1.2, f1: 1, p1: 0, a2: 0.6, f2: 2, p2: 0 },
    { label: "Complex", desc: "Different everything", a1: 0.8, f1: 1.3, p1: 0.5, a2: 1.2, f2: 2.7, p2: 1.2 },
  ];

  const applyPreset = (p) => {
    setAmp1(p.a1); setFreq1(p.f1); setPhase1(p.p1);
    setAmp2(p.a2); setFreq2(p.f2); setPhase2(p.p2);
    setTimeOffset(0);
  };

  return (
    <div className="sim-module-workspace">
      {/* ── Main Canvas ── */}
      <div className="sim-canvas-container">
        <canvas
          ref={canvasRef}
          width={880}
          height={400}
          className="sim-main-canvas"
        />
        <div className="sim-canvas-overlay-badge">
          y(x) = y₁(x) + y₂(x) · Superposition Principle
        </div>
      </div>

      {/* ── Controls Strip ── */}
      <div className="sim-controls-strip">
        <div className="sim-ctrl-item">
          <label>
            <span style={{ color: "#3b82f6" }}>Wave 1 Amplitude</span>
            <strong>{amp1.toFixed(1)}</strong>
          </label>
          <input type="range" min="0" max="2" step="0.1" value={amp1}
            onChange={(e) => setAmp1(Number(e.target.value))} />
        </div>

        <div className="sim-ctrl-item">
          <label>
            <span style={{ color: "#3b82f6" }}>Wave 1 Frequency</span>
            <strong>{freq1.toFixed(1)} Hz</strong>
          </label>
          <input type="range" min="0.2" max="5" step="0.1" value={freq1}
            onChange={(e) => setFreq1(Number(e.target.value))} />
        </div>

        <div className="sim-ctrl-item">
          <label>
            <span style={{ color: "#3b82f6" }}>Wave 1 Phase (φ₁)</span>
            <strong>{(phase1 / Math.PI).toFixed(2)}π</strong>
          </label>
          <input type="range" min="0" max={2 * Math.PI} step="0.05" value={phase1}
            onChange={(e) => setPhase1(Number(e.target.value))} />
        </div>
      </div>

      <div className="sim-controls-strip" style={{ borderTop: "1px solid #e5e7eb" }}>
        <div className="sim-ctrl-item">
          <label>
            <span style={{ color: "#f59e0b" }}>Wave 2 Amplitude</span>
            <strong>{amp2.toFixed(1)}</strong>
          </label>
          <input type="range" min="0" max="2" step="0.1" value={amp2}
            onChange={(e) => setAmp2(Number(e.target.value))} />
        </div>

        <div className="sim-ctrl-item">
          <label>
            <span style={{ color: "#f59e0b" }}>Wave 2 Frequency</span>
            <strong>{freq2.toFixed(1)} Hz</strong>
          </label>
          <input type="range" min="0.2" max="5" step="0.1" value={freq2}
            onChange={(e) => setFreq2(Number(e.target.value))} />
        </div>

        <div className="sim-ctrl-item">
          <label>
            <span style={{ color: "#f59e0b" }}>Wave 2 Phase (φ₂)</span>
            <strong>{(phase2 / Math.PI).toFixed(2)}π</strong>
          </label>
          <input type="range" min="0" max={2 * Math.PI} step="0.05" value={phase2}
            onChange={(e) => setPhase2(Number(e.target.value))} />
        </div>
      </div>

      {/* ── Presets & Toggles ── */}
      <div className="sim-controls-strip" style={{ borderTop: "1px solid #e5e7eb" }}>
        <div className="sim-ctrl-item">
          <label>Presets</label>
          <div className="sim-segmented-btn">
            {presets.map((p) => (
              <button key={p.label} className="seg-btn" onClick={() => applyPreset(p)}
                title={p.desc}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="sim-btn-group" style={{ gap: "10px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#3b82f6", cursor: "pointer" }}>
            <input type="checkbox" checked={showWave1} onChange={(e) => setShowWave1(e.target.checked)}
              style={{ accentColor: "#3b82f6" }} /> W1
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#f59e0b", cursor: "pointer" }}>
            <input type="checkbox" checked={showWave2} onChange={(e) => setShowWave2(e.target.checked)}
              style={{ accentColor: "#f59e0b" }} /> W2
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#10b981", cursor: "pointer" }}>
            <input type="checkbox" checked={showResultant} onChange={(e) => setShowResultant(e.target.checked)}
              style={{ accentColor: "#10b981" }} /> Sum
          </label>
        </div>

        <div className="sim-btn-group">
          <button className={`btn ${animating ? "btn-secondary" : "btn-primary"}`}
            onClick={() => setAnimating(!animating)}>
            {animating ? "Pause" : "Animate"}
          </button>
          <button className="btn btn-secondary" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      {/* ── Results Strip ── */}
      <div className="sim-results-grid">
        <div className={`sim-result-card ${isConstructive ? "highlight" : ""}`}>
          <span className="res-label">Interference Type</span>
          <span className="res-val" style={{ color: isConstructive ? "#16a34a" : isDestructive ? "#dc2626" : "#475569" }}>
            {interferenceType}
          </span>
          <span className="res-eq">
            {isConstructive ? "Δφ = 0 (max)" : isDestructive ? "Δφ = π (cancel)" : `Δφ = ${(Math.abs(phase1 - phase2) / Math.PI).toFixed(2)}π`}
          </span>
        </div>

        <div className="sim-result-card">
          <span className="res-label">Maximum Resultant</span>
          <span className="res-val">{maxAmp.toFixed(2)}</span>
          <span className="res-eq">A₁ + A₂ = {amp1.toFixed(1)} + {amp2.toFixed(1)}</span>
        </div>

        <div className="sim-result-card">
          <span className="res-label">Minimum Resultant</span>
          <span className="res-val">{minAmp.toFixed(2)}</span>
          <span className="res-eq">|A₁ − A₂| = |{amp1.toFixed(1)} − {amp2.toFixed(1)}|</span>
        </div>

        <div className="sim-result-card">
          <span className="res-label">Beat Frequency</span>
          <span className="res-val">{beatFrequency} Hz</span>
          <span className="res-eq">f_beat = |f₁ − f₂| = |{freq1.toFixed(1)} − {freq2.toFixed(1)}|</span>
        </div>
      </div>
    </div>
  );
}
