import React, { useState, useEffect, useRef } from "react";

export default function ProjectileMotionSim() {
  const [velocity, setVelocity] = useState(25);
  const [angle, setAngle] = useState(45);
  const [gravity, setGravity] = useState(9.81);
  const [isPlaying, setIsPlaying] = useState(false);
  const [simTime, setSimTime] = useState(0);

  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const lastTimeRef = useRef(null);

  // Physics Calculations
  const angleRad = (angle * Math.PI) / 180;
  const vx0 = velocity * Math.cos(angleRad);
  const vy0 = velocity * Math.sin(angleRad);

  const totalFlightTime = (2 * vy0) / gravity;
  const maxRange = (velocity * velocity * Math.sin(2 * angleRad)) / gravity;
  const maxHeight = (velocity * velocity * Math.sin(angleRad) * Math.sin(angleRad)) / (2 * gravity);

  // Current position at simTime
  const currentT = Math.min(simTime, totalFlightTime);
  const currentX = vx0 * currentT;
  const currentY = Math.max(0, vy0 * currentT - 0.5 * gravity * currentT * currentT);
  const currentVx = vx0;
  const currentVy = vy0 - gravity * currentT;
  const currentSpeed = Math.sqrt(currentVx * currentVx + currentVy * currentVy);

  const handleReset = () => {
    setIsPlaying(false);
    setSimTime(0);
    lastTimeRef.current = null;
  };

  const handlePlayToggle = () => {
    if (simTime >= totalFlightTime) {
      setSimTime(0);
      lastTimeRef.current = null;
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = null;
      return;
    }

    const animate = (now) => {
      if (!lastTimeRef.current) lastTimeRef.current = now;
      const dt = ((now - lastTimeRef.current) / 1000) * 1.6;
      lastTimeRef.current = now;

      setSimTime((prev) => {
        const next = prev + dt;
        if (next >= totalFlightTime) {
          setIsPlaying(false);
          return totalFlightTime;
        }
        return next;
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, totalFlightTime]);

  // Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const padding = { left: 55, right: 35, top: 35, bottom: 45 };
    const plotW = width - padding.left - padding.right;
    const plotH = height - padding.top - padding.bottom;

    // Scale calculation
    const maxPlotX = Math.max(maxRange * 1.15, 20);
    const maxPlotY = Math.max(maxHeight * 1.35, 15);

    const scaleX = plotW / maxPlotX;
    const scaleY = plotH / maxPlotY;

    const toCanvasX = (x) => padding.left + x * scaleX;
    const toCanvasY = (y) => height - padding.bottom - y * scaleY;

    // 1. Grid Lines
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);

    const numGridLinesX = 8;
    for (let i = 0; i <= numGridLinesX; i++) {
      const valX = (maxPlotX * i) / numGridLinesX;
      const cx = toCanvasX(valX);
      ctx.beginPath();
      ctx.moveTo(cx, padding.top);
      ctx.lineTo(cx, height - padding.bottom);
      ctx.stroke();

      ctx.fillStyle = "#6b7280";
      ctx.font = "11px var(--font-mono)";
      ctx.textAlign = "center";
      ctx.fillText(`${Math.round(valX)}m`, cx, height - padding.bottom + 16);
    }

    const numGridLinesY = 5;
    for (let i = 0; i <= numGridLinesY; i++) {
      const valY = (maxPlotY * i) / numGridLinesY;
      const cy = toCanvasY(valY);
      ctx.beginPath();
      ctx.moveTo(padding.left, cy);
      ctx.lineTo(width - padding.right, cy);
      ctx.stroke();

      ctx.fillStyle = "#6b7280";
      ctx.font = "11px var(--font-mono)";
      ctx.textAlign = "right";
      ctx.fillText(`${Math.round(valY)}m`, padding.left - 8, cy + 4);
    }
    ctx.setLineDash([]);

    // 2. Axes
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Y Axis
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    // X Axis (Ground)
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();

    // 3. Full Theoretical Trajectory (Dashed Guide)
    ctx.strokeStyle = "#93c5fd";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    const steps = 150;
    for (let i = 0; i <= steps; i++) {
      const t = (totalFlightTime * i) / steps;
      const x = vx0 * t;
      const y = vy0 * t - 0.5 * gravity * t * t;
      const cx = toCanvasX(x);
      const cy = toCanvasY(Math.max(0, y));
      if (i === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. Completed Path Trail up to simTime
    if (simTime > 0) {
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 3;
      ctx.beginPath();
      const trailSteps = Math.max(10, Math.floor(steps * (currentT / totalFlightTime)));
      for (let i = 0; i <= trailSteps; i++) {
        const t = (currentT * i) / trailSteps;
        const x = vx0 * t;
        const y = vy0 * t - 0.5 * gravity * t * t;
        const cx = toCanvasX(x);
        const cy = toCanvasY(Math.max(0, y));
        if (i === 0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      }
      ctx.stroke();
    }

    // 5. Peak Height Marker & Ground Marker
    const peakX = (maxRange / 2);
    const peakCX = toCanvasX(peakX);
    const peakCY = toCanvasY(maxHeight);

    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(peakCX, height - padding.bottom);
    ctx.lineTo(peakCX, peakCY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#d97706";
    ctx.beginPath();
    ctx.arc(peakCX, peakCY, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#b45309";
    ctx.font = "11px var(--font-sans)";
    ctx.textAlign = "center";
    ctx.fillText(`H_max: ${maxHeight.toFixed(1)}m`, peakCX, peakCY - 10);

    // Range Landing Marker
    const landCX = toCanvasX(maxRange);
    const landCY = toCanvasY(0);
    ctx.fillStyle = "#16a34a";
    ctx.beginPath();
    ctx.arc(landCX, landCY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText(`Range: ${maxRange.toFixed(1)}m`, landCX, landCY + 18);

    // 6. Launch Cannon Base & Vector
    const originCX = toCanvasX(0);
    const originCY = toCanvasY(0);
    const vecLength = Math.min(60, velocity * 1.5);
    const vecEndX = originCX + vecLength * Math.cos(angleRad);
    const vecEndY = originCY - vecLength * Math.sin(angleRad);

    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(originCX, originCY);
    ctx.lineTo(vecEndX, vecEndY);
    ctx.stroke();

    // 7. Projectile Ball (Animated Position)
    const ballCX = toCanvasX(currentX);
    const ballCY = toCanvasY(currentY);

    // Ball Glow & Body
    ctx.fillStyle = "#1d4ed8";
    ctx.beginPath();
    ctx.arc(ballCX, ballCY, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Velocity vector on the ball
    if (isPlaying && currentT < totalFlightTime) {
      const vScale = 1.2;
      const vEndX = ballCX + currentVx * vScale;
      const vEndY = ballCY - currentVy * vScale;
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ballCX, ballCY);
      ctx.lineTo(vEndX, vEndY);
      ctx.stroke();
    }
  }, [velocity, angle, gravity, simTime, maxRange, maxHeight, totalFlightTime, currentT, currentX, currentY, currentVx, currentVy, angleRad, vx0, vy0, isPlaying]);

  return (
    <div className="sim-module-workspace">
      {/* ── Main Canvas Viewport ── */}
      <div className="sim-canvas-container">
        <canvas
          ref={canvasRef}
          width={880}
          height={420}
          className="sim-main-canvas"
        />
        <div className="sim-canvas-overlay-badge">
          {isPlaying ? "● RUNNING" : simTime >= totalFlightTime ? "● LANDED" : "● READY"}
        </div>
      </div>

      {/* ── Controls Section ── */}
      <div className="sim-controls-strip">
        <div className="sim-ctrl-item">
          <label>
            <span>Initial Velocity (u)</span>
            <strong>{velocity} m/s</strong>
          </label>
          <input
            type="range"
            min="5"
            max="60"
            step="1"
            value={velocity}
            onChange={(e) => {
              setVelocity(Number(e.target.value));
              handleReset();
            }}
          />
        </div>

        <div className="sim-ctrl-item">
          <label>
            <span>Launch Angle (θ)</span>
            <strong>{angle}°</strong>
          </label>
          <input
            type="range"
            min="5"
            max="85"
            step="1"
            value={angle}
            onChange={(e) => {
              setAngle(Number(e.target.value));
              handleReset();
            }}
          />
        </div>

        <div className="sim-ctrl-item">
          <label>
            <span>Gravity (g)</span>
            <strong>{gravity.toFixed(2)} m/s²</strong>
          </label>
          <input
            type="range"
            min="1.6"
            max="25.0"
            step="0.1"
            value={gravity}
            onChange={(e) => {
              setGravity(Number(e.target.value));
              handleReset();
            }}
          />
        </div>

        <div className="sim-btn-group">
          <button
            className={`btn ${isPlaying ? "btn-secondary" : "btn-primary"}`}
            onClick={handlePlayToggle}
          >
            {isPlaying ? "Pause" : simTime >= totalFlightTime ? "Replay" : "Launch"}
          </button>
          <button className="btn btn-secondary" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      {/* ── Live Results Strip ── */}
      <div className="sim-results-grid">
        <div className="sim-result-card">
          <span className="res-label">Horizontal Range (R)</span>
          <span className="res-val">{maxRange.toFixed(2)} m</span>
          <span className="res-eq">R = u² sin(2θ) / g</span>
        </div>

        <div className="sim-result-card">
          <span className="res-label">Maximum Height (H)</span>
          <span className="res-val">{maxHeight.toFixed(2)} m</span>
          <span className="res-eq">H = u² sin²(θ) / 2g</span>
        </div>

        <div className="sim-result-card">
          <span className="res-label">Time of Flight (T)</span>
          <span className="res-val">{totalFlightTime.toFixed(2)} s</span>
          <span className="res-eq">T = 2u sin(θ) / g</span>
        </div>

        <div className="sim-result-card highlight">
          <span className="res-label">Current State (t = {simTime.toFixed(2)}s)</span>
          <span className="res-val">
            ({currentX.toFixed(1)}m, {currentY.toFixed(1)}m)
          </span>
          <span className="res-eq">v = {currentSpeed.toFixed(1)} m/s</span>
        </div>
      </div>
    </div>
  );
}
