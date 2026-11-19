import React, { useState, useEffect, useRef } from "react";

export default function FunctionVisualizerSim() {
  const [funcType, setFuncType] = useState("sin"); // "quad" | "sin" | "cos" | "exp" | "log"
  const [paramA, setParamA] = useState(1.5);
  const [paramB, setParamB] = useState(1.0);
  const [xRange, setXRange] = useState(10); // [-10, 10]
  const [hoverPos, setHoverPos] = useState(null);

  const canvasRef = useRef(null);

  const FUNCTION_DEFS = {
    quad: {
      name: "Quadratic",
      getEquation: (a, b) => `y = ${a.toFixed(1)} x²`,
      eval: (x, a, b) => a * x * x,
      derivative: (x, a, b) => 2 * a * x,
    },
    sin: {
      name: "Sine",
      getEquation: (a, b) => `y = ${a.toFixed(1)} sin(${b.toFixed(1)} x)`,
      eval: (x, a, b) => a * Math.sin(b * x),
      derivative: (x, a, b) => a * b * Math.cos(b * x),
    },
    cos: {
      name: "Cosine",
      getEquation: (a, b) => `y = ${a.toFixed(1)} cos(${b.toFixed(1)} x)`,
      eval: (x, a, b) => a * Math.cos(b * x),
      derivative: (x, a, b) => -a * b * Math.sin(b * x),
    },
    exp: {
      name: "Exponential",
      getEquation: (a, b) => `y = ${a.toFixed(1)} e^(${b.toFixed(1)} x)`,
      eval: (x, a, b) => a * Math.exp(b * x),
      derivative: (x, a, b) => a * b * Math.exp(b * x),
    },
    log: {
      name: "Logarithm",
      getEquation: (a, b) => `y = ${a.toFixed(1)} ln(${b.toFixed(1)} x)`,
      eval: (x, a, b) => (x > 0 ? a * Math.log(b * x) : null),
      derivative: (x, a, b) => (x > 0 ? a / x : null),
    },
  };

  const curr = FUNCTION_DEFS[funcType];
  const equationStr = curr.getEquation(paramA, paramB);

  // Mouse & Touch pointer hover listener (with 1:1 canvas coordinate scaling)
  const handlePointerHover = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const width = canvas.width;
    const height = canvas.height;

    // Correct scaling between CSS layout pixels and internal canvas resolution
    const mx = (clientX - rect.left) * (width / rect.width);
    const my = (clientY - rect.top) * (height / rect.height);

    const cx = width / 2;
    const cy = height / 2;

    const scaleX = width / (2 * xRange);
    const scaleY = height / (2 * xRange);

    const mathX = (mx - cx) / scaleX;
    const mathY = -(my - cy) / scaleY;

    const curveY = curr.eval(mathX, paramA, paramB);
    const slope = curr.derivative(mathX, paramA, paramB);

    setHoverPos({
      canvasX: mx,
      canvasY: my,
      mathX,
      mathY,
      curveY,
      slope,
    });
  };

  const handleMouseMove = (e) => handlePointerHover(e.clientX, e.clientY);
  const handleTouchMove = (e) => {
    if (e.touches && e.touches.length > 0) {
      handlePointerHover(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleMouseLeave = () => setHoverPos(null);

  // Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    const scaleX = width / (2 * xRange);
    const scaleY = height / (2 * xRange);

    const toCanvasX = (x) => cx + x * scaleX;
    const toCanvasY = (y) => cy - y * scaleY;

    // 1. Grid lines
    ctx.strokeStyle = "#f1f5f9";
    ctx.lineWidth = 1;

    const step = xRange <= 5 ? 1 : xRange <= 10 ? 2 : 5;

    for (let x = -xRange; x <= xRange; x += step) {
      if (x === 0) continue;
      const px = toCanvasX(x);
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.stroke();

      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px var(--font-mono)";
      ctx.textAlign = "center";
      ctx.fillText(x.toString(), px, cy + 14);
    }

    for (let y = -xRange; y <= xRange; y += step) {
      if (y === 0) continue;
      const py = toCanvasY(y);
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();

      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px var(--font-mono)";
      ctx.textAlign = "right";
      ctx.fillText(y.toString(), cx - 6, py + 3);
    }

    // 2. Axes
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    // X Axis
    ctx.moveTo(0, cy);
    ctx.lineTo(width, cy);
    // Y Axis
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, height);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = "#334155";
    ctx.font = "bold 11px var(--font-sans)";
    ctx.textAlign = "right";
    ctx.fillText("x", width - 8, cy - 6);
    ctx.textAlign = "left";
    ctx.fillText("y", cx + 8, 14);

    // 3. Draw Continuous Function Curve
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 3;
    ctx.beginPath();

    const ptsCount = width;
    let started = false;

    for (let i = 0; i <= ptsCount; i++) {
      const x = -xRange + (2 * xRange * i) / ptsCount;
      const y = curr.eval(x, paramA, paramB);

      if (y === null || isNaN(y) || !isFinite(y)) {
        started = false;
        continue;
      }

      const px = toCanvasX(x);
      const py = toCanvasY(y);

      // Clamp huge values to prevent canvas overflow
      if (py < -500 || py > height + 500) {
        started = false;
        continue;
      }

      if (!started) {
        ctx.moveTo(px, py);
        started = true;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // 4. Hover Crosshair & Tangent Line
    if (hoverPos && hoverPos.curveY !== null && isFinite(hoverPos.curveY)) {
      const hX = hoverPos.mathX;
      const hY = hoverPos.curveY;
      const hPx = toCanvasX(hX);
      const hPy = toCanvasY(hY);

      // Tangent Line
      if (hoverPos.slope !== null && isFinite(hoverPos.slope)) {
        const m = hoverPos.slope;
        const dx = 2.5;
        const x1 = hX - dx, y1 = hY - m * dx;
        const x2 = hX + dx, y2 = hY + m * dx;

        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(toCanvasX(x1), toCanvasY(y1));
        ctx.lineTo(toCanvasX(x2), toCanvasY(y2));
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Point Marker on Curve
      ctx.fillStyle = "#2563eb";
      ctx.beginPath();
      ctx.arc(hPx, hPy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Tooltip Box on Canvas
      const text = `(${hX.toFixed(2)}, ${hY.toFixed(2)})`;
      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      ctx.fillRect(hPx + 8, hPy - 24, 110, 20);
      ctx.fillStyle = "#ffffff";
      ctx.font = "11px var(--font-mono)";
      ctx.textAlign = "left";
      ctx.fillText(text, hPx + 14, hPy - 10);
    }
  }, [funcType, paramA, paramB, xRange, hoverPos, curr]);

  return (
    <div className="sim-module-workspace">
      {/* ── Main Coordinate Canvas ── */}
      <div
        className="sim-canvas-container"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseLeave}
      >
        <canvas
          ref={canvasRef}
          width={880}
          height={420}
          className="sim-main-canvas"
        />
        <div className="sim-canvas-overlay-badge">
          {equationStr}
        </div>
      </div>

      {/* ── Controls Strip ── */}
      <div className="sim-controls-strip">
        <div className="sim-ctrl-item">
          <label>Function Type</label>
          <div className="sim-segmented-btn">
            {Object.keys(FUNCTION_DEFS).map((k) => (
              <button
                key={k}
                className={`seg-btn ${funcType === k ? "active" : ""}`}
                onClick={() => setFuncType(k)}
              >
                {FUNCTION_DEFS[k].name}
              </button>
            ))}
          </div>
        </div>

        <div className="sim-ctrl-item">
          <label>
            <span>Parameter (a)</span>
            <strong>{paramA.toFixed(1)}</strong>
          </label>
          <input
            type="range"
            min="-5.0"
            max="5.0"
            step="0.1"
            value={paramA}
            onChange={(e) => setParamA(parseFloat(e.target.value))}
          />
        </div>

        <div className="sim-ctrl-item">
          <label>
            <span>Parameter (b / frequency)</span>
            <strong>{paramB.toFixed(1)}</strong>
          </label>
          <input
            type="range"
            min="0.2"
            max="4.0"
            step="0.1"
            value={paramB}
            onChange={(e) => setParamB(parseFloat(e.target.value))}
          />
        </div>

        <div className="sim-btn-group">
          <button
            className={`btn ${xRange === 5 ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setXRange(5)}
          >
            Zoom In (±5)
          </button>
          <button
            className={`btn ${xRange === 10 ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setXRange(10)}
          >
            Standard (±10)
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setParamA(1.5);
              setParamB(1.0);
              setXRange(10);
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* ── Live Calculus & Curve Metrics ── */}
      <div className="sim-results-grid">
        <div className="sim-result-card">
          <span className="res-label">Current Equation</span>
          <span className="res-val" style={{ fontSize: "1.1rem" }}>{equationStr}</span>
          <span className="res-eq">Dynamic Algebraic Formulation</span>
        </div>

        <div className="sim-result-card">
          <span className="res-label">y-Intercept f(0)</span>
          <span className="res-val">
            {curr.eval(0, paramA, paramB) !== null ? curr.eval(0, paramA, paramB).toFixed(2) : "Undefined"}
          </span>
          <span className="res-eq">Evaluated at x = 0</span>
        </div>

        <div className="sim-result-card">
          <span className="res-label">Interactive Tangent Slope f'(x)</span>
          <span className="res-val">
            {hoverPos?.slope !== null && hoverPos?.slope !== undefined
              ? hoverPos.slope.toFixed(3)
              : "Hover curve"}
          </span>
          <span className="res-eq">Instantaneous Rate of Change</span>
        </div>

        <div className="sim-result-card highlight">
          <span className="res-label">Current Cursor Coord (x, y)</span>
          <span className="res-val">
            {hoverPos
              ? `(${hoverPos.mathX.toFixed(2)}, ${hoverPos.curveY !== null ? hoverPos.curveY.toFixed(2) : "—"})`
              : "Hover to inspect"}
          </span>
          <span className="res-eq">Cartesian Coordinates</span>
        </div>
      </div>
    </div>
  );
}
