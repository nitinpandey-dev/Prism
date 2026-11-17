import React, { useState, useEffect, useRef, useMemo } from "react";

// Precomputes the deterministic sequence of traversal execution steps
function computeTraversalSteps(alg, start, nodeList, edgeList) {
  const adj = {};
  nodeList.forEach((n) => (adj[n.id] = []));
  edgeList.forEach(([u, v]) => {
    adj[u].push(v);
    adj[v].push(u);
  });
  Object.keys(adj).forEach((k) => adj[k].sort());

  const steps = [];

  // Step 0: Initial state before any action
  steps.push({
    currentNode: null,
    activeEdge: null,
    visited: [],
    frontier: [start],
    traversalOrder: [],
    desc: `Ready: ${alg} initialized with Start Node ${start} in frontier`,
  });

  if (alg === "BFS") {
    const queue = [start];
    const seen = new Set([start]);
    const order = [];

    while (queue.length > 0) {
      const u = queue.shift();
      order.push(u);

      steps.push({
        currentNode: u,
        activeEdge: null,
        visited: [...order],
        frontier: [...queue],
        traversalOrder: [...order],
        desc: `Dequeued & visiting Vertex ${u}`,
      });

      const neighbors = adj[u] || [];
      for (const v of neighbors) {
        if (!seen.has(v)) {
          seen.add(v);
          queue.push(v);
          steps.push({
            currentNode: u,
            activeEdge: [u, v],
            visited: [...order],
            frontier: [...queue],
            traversalOrder: [...order],
            desc: `Explored edge (${u} ─ ${v}) → Enqueued Vertex ${v}`,
          });
        }
      }
    }
  } else {
    // Depth-First Search (DFS)
    const stack = [start];
    const seen = new Set();
    const order = [];

    while (stack.length > 0) {
      const u = stack.pop();

      if (!seen.has(u)) {
        seen.add(u);
        order.push(u);

        steps.push({
          currentNode: u,
          activeEdge: null,
          visited: [...order],
          frontier: [...stack],
          traversalOrder: [...order],
          desc: `Popped & visiting Vertex ${u}`,
        });

        // Push neighbors in reverse to explore in alphabetical order
        const neighbors = [...(adj[u] || [])].reverse();
        for (const v of neighbors) {
          if (!seen.has(v)) {
            stack.push(v);
            steps.push({
              currentNode: u,
              activeEdge: [u, v],
              visited: [...order],
              frontier: [...stack],
              traversalOrder: [...order],
              desc: `Explored edge (${u} ─ ${v}) → Pushed Vertex ${v} onto call stack`,
            });
          }
        }
      }
    }
  }

  // Final Step: Complete
  const last = steps[steps.length - 1];
  steps.push({
    currentNode: null,
    activeEdge: null,
    visited: [...last.visited],
    frontier: [],
    traversalOrder: [...last.traversalOrder],
    desc: `Traversal Complete · All ${last.visited.length} reachable vertices visited`,
  });

  return steps;
}

export default function GraphTraversalSim() {
  const [algorithm, setAlgorithm] = useState("BFS"); // "BFS" | "DFS"
  const [startNode, setStartNode] = useState("A");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0); // 0.2x to 3.0x

  // Timeline scrub & pause-at-step state (matching Projectile Motion controls)
  const [currentStep, setCurrentStep] = useState(0);
  const [pauseAtEnabled, setPauseAtEnabled] = useState(false);
  const [pauseAtStep, setPauseAtStep] = useState(4);

  // Graph Structure (7 Nodes with 2D positions and 9 Edges)
  const nodes = useMemo(
    () => [
      { id: "A", x: 120, y: 190 },
      { id: "B", x: 260, y: 100 },
      { id: "C", x: 260, y: 280 },
      { id: "D", x: 420, y: 90 },
      { id: "E", x: 420, y: 210 },
      { id: "F", x: 420, y: 320 },
      { id: "G", x: 580, y: 200 },
    ],
    []
  );

  const edges = useMemo(
    () => [
      ["A", "B"], ["A", "C"],
      ["B", "D"], ["B", "E"],
      ["C", "E"], ["C", "F"],
      ["D", "G"], ["E", "G"], ["F", "G"],
    ],
    []
  );

  const canvasRef = useRef(null);

  // Precomputed traversal steps for current algorithm & startNode
  const steps = useMemo(
    () => computeTraversalSteps(algorithm, startNode, nodes, edges),
    [algorithm, startNode, nodes, edges]
  );
  const totalSteps = steps.length - 1;

  // Reset or adjust pause-at-step when totalSteps changes
  useEffect(() => {
    if (pauseAtStep > totalSteps) {
      setPauseAtStep(Math.max(1, Math.min(totalSteps, 4)));
    }
  }, [totalSteps, pauseAtStep]);

  // Reset timeline when algorithm or start node changes
  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
    setIsPaused(false);
  }, [algorithm, startNode]);

  // Animation playback loop
  useEffect(() => {
    if (!isPlaying) return;

    const delayMs = Math.max(90, Math.round(650 / playbackSpeed));
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;

        // Auto-pause if pauseAtStep breakpoint reached
        if (pauseAtEnabled && next === pauseAtStep) {
          setIsPlaying(false);
          setIsPaused(true);
          return next;
        }

        // Completion
        if (next >= totalSteps) {
          setIsPlaying(false);
          setIsPaused(false);
          return totalSteps;
        }

        return next;
      });
    }, delayMs);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, pauseAtEnabled, pauseAtStep, totalSteps]);

  // Active step state
  const activeState = steps[Math.min(currentStep, totalSteps)] || steps[0];
  const { currentNode, activeEdge, visited, frontier, traversalOrder, desc } =
    activeState;

  // Handlers
  const handlePlayToggle = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setIsPaused(true);
    } else {
      if (currentStep >= totalSteps) {
        // Replay from beginning
        setCurrentStep(0);
      }
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentStep(0);
  };

  const handleTimelineScrub = (e) => {
    const stepVal = Number(e.target.value);
    setIsPlaying(false);
    setIsPaused(true);
    setCurrentStep(stepVal);
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    setIsPaused(true);
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setIsPaused(true);
    setCurrentStep((prev) => Math.min(totalSteps, prev + 1));
  };

  // Canvas Graph Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const nodeMap = {};
    nodes.forEach((n) => {
      const px = (n.x / 700) * (width - 120) + 60;
      const py = (n.y / 400) * (height - 80) + 40;
      nodeMap[n.id] = { px, py };
    });

    // 1. Draw Edges
    edges.forEach(([u, v]) => {
      const p1 = nodeMap[u];
      const p2 = nodeMap[v];
      if (!p1 || !p2) return;

      const isActive =
        activeEdge &&
        ((activeEdge[0] === u && activeEdge[1] === v) ||
          (activeEdge[0] === v && activeEdge[1] === u));

      ctx.strokeStyle = isActive ? "#2563eb" : "#cbd5e1";
      ctx.lineWidth = isActive ? 3.5 : 2;
      ctx.beginPath();
      ctx.moveTo(p1.px, p1.py);
      ctx.lineTo(p2.px, p2.py);
      ctx.stroke();

      // If active edge, draw directional highlight pulse
      if (isActive) {
        ctx.strokeStyle = "rgba(37, 99, 235, 0.25)";
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.stroke();
      }
    });

    // 2. Draw Nodes
    nodes.forEach((n) => {
      const { px, py } = nodeMap[n.id];
      const isCur = currentNode === n.id;
      const isVis = visited.includes(n.id);
      const isFront = frontier.includes(n.id);

      let bgColor = "#ffffff";
      let borderColor = "#94a3b8";
      let textColor = "#0f172a";

      if (isVis) {
        bgColor = "#f0fdf4";
        borderColor = "#16a34a"; // green visited
        textColor = "#15803d";
      }
      if (isFront && !isVis) {
        bgColor = "#eff6ff";
        borderColor = "#3b82f6"; // blue frontier
        textColor = "#1d4ed8";
      }
      if (isCur) {
        bgColor = "#2563eb";
        borderColor = "#1d4ed8"; // solid blue current
        textColor = "#ffffff";
      }

      // Outer Pulse for Current Node
      if (isCur) {
        ctx.strokeStyle = "rgba(37, 99, 235, 0.35)";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(px, py, 26, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Pause-at indicator ring if reached
      if (pauseAtEnabled && currentStep === pauseAtStep && isCur) {
        ctx.strokeStyle = "rgba(249, 115, 22, 0.6)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(px, py, 32, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Node Body Circle
      ctx.fillStyle = bgColor;
      ctx.beginPath();
      ctx.arc(px, py, 20, 0, Math.PI * 2);
      ctx.fill();

      // Border
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Node Label (Letter)
      ctx.fillStyle = textColor;
      ctx.font = "bold 14px var(--font-sans)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(n.id, px, py);

      // Visited Order Badge
      const orderIdx = traversalOrder.indexOf(n.id);
      if (orderIdx !== -1) {
        ctx.fillStyle = "#16a34a";
        ctx.beginPath();
        ctx.arc(px + 14, py - 14, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 9px var(--font-mono)";
        ctx.fillText((orderIdx + 1).toString(), px + 14, py - 14);
      }
    });
  }, [
    nodes,
    edges,
    currentNode,
    visited,
    activeEdge,
    frontier,
    traversalOrder,
    pauseAtEnabled,
    currentStep,
    pauseAtStep,
  ]);

  return (
    <div className="sim-module-workspace">
      {/* ── Main Graph Canvas Viewport ── */}
      <div className="sim-canvas-container">
        <canvas
          ref={canvasRef}
          width={880}
          height={420}
          className="sim-main-canvas"
        />
        <div className="sim-canvas-overlay-badge" style={{ left: "12px", right: "auto" }}>
          {algorithm} Traversal · Start at Node {startNode}
        </div>
        <div className="sim-canvas-overlay-badge" style={{ right: "12px", left: "auto" }}>
          {isPlaying
            ? "● RUNNING"
            : isPaused
            ? "⏸ PAUSED"
            : currentStep >= totalSteps && totalSteps > 0
            ? "● COMPLETED"
            : "● READY"}
        </div>
      </div>

      {/* ── Controls Section ── */}
      <div className="sim-controls-strip">
        <div className="sim-ctrl-item sim-ctrl-segmented">
          <label>Algorithm</label>
          <div className="sim-segmented-btn">
            {["BFS", "DFS"].map((alg) => (
              <button
                key={alg}
                className={`seg-btn ${algorithm === alg ? "active" : ""}`}
                onClick={() => setAlgorithm(alg)}
              >
                {alg === "BFS" ? "Breadth-First (BFS)" : "Depth-First (DFS)"}
              </button>
            ))}
          </div>
        </div>

        <div className="sim-ctrl-item sim-ctrl-segmented">
          <label>Starting Node</label>
          <div className="sim-segmented-btn">
            {nodes.map((n) => (
              <button
                key={n.id}
                className={`seg-btn ${startNode === n.id ? "active" : ""}`}
                onClick={() => setStartNode(n.id)}
              >
                {n.id}
              </button>
            ))}
          </div>
        </div>

        <div className="sim-ctrl-item">
          <label>
            <span>Playback Speed</span>
            <strong>{playbackSpeed.toFixed(1)}×</strong>
          </label>
          <input
            type="range"
            min="0.2"
            max="3.0"
            step="0.1"
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
          />
        </div>

        <div className="sim-btn-group">
          <button
            className={`btn ${isPlaying ? "btn-secondary" : "btn-primary"}`}
            onClick={handlePlayToggle}
          >
            {isPlaying
              ? "⏸ Pause"
              : currentStep >= totalSteps && totalSteps > 0
              ? "↺ Replay"
              : isPaused
              ? "▶ Resume"
              : "▶ Start Traversal"}
          </button>
          <button className="btn btn-secondary" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      {/* ── Timeline Scrub & Stepping Controls (Matching Projectile Motion) ── */}
      <div className="sim-controls-strip" style={{ borderTop: "1px solid #e5e7eb" }}>
        <div className="sim-ctrl-item" style={{ flex: 2 }}>
          <label>
            <span>Timeline Scrub</span>
            <strong>Step = {currentStep} / {totalSteps}</strong>
          </label>
          <input
            type="range"
            min="0"
            max={totalSteps}
            step="1"
            value={currentStep}
            onChange={handleTimelineScrub}
          />
        </div>

        <div className="sim-ctrl-item" style={{ flex: 1 }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={pauseAtEnabled}
              onChange={(e) => setPauseAtEnabled(e.target.checked)}
              style={{ width: "14px", height: "14px", accentColor: "#f97316" }}
            />
            <span>Pause at step =</span>
            <strong style={{ color: pauseAtEnabled ? "#ea580c" : "#9ca3af" }}>
              {pauseAtStep}
            </strong>
          </label>
          <input
            type="range"
            min="1"
            max={Math.max(1, totalSteps)}
            step="1"
            value={pauseAtStep}
            disabled={!pauseAtEnabled}
            onChange={(e) => setPauseAtStep(Number(e.target.value))}
            style={{ opacity: pauseAtEnabled ? 1 : 0.4 }}
          />
        </div>

        <div className="sim-btn-group">
          <button
            className="btn btn-secondary"
            onClick={handleStepBackward}
            disabled={isPlaying || currentStep <= 0}
            title="Step backward 1 step"
          >
            ◀◀
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleStepForward}
            disabled={isPlaying || currentStep >= totalSteps}
            title="Step forward 1 step"
          >
            ▶▶
          </button>
        </div>
      </div>

      {/* ── Live Traversal State Strip ── */}
      <div className="sim-results-grid">
        <div className="sim-result-card" style={{ gridColumn: "span 2" }}>
          <span className="res-label">Traversal Order</span>
          <span className="res-val" style={{ fontSize: "1.05rem" }}>
            {traversalOrder.length > 0
              ? traversalOrder.join(" → ")
              : "Click 'Start Traversal' or scrub timeline"}
          </span>
          <span className="res-eq">Sequence of visited vertices</span>
        </div>

        <div className="sim-result-card">
          <span className="res-label">
            {algorithm === "BFS" ? "FIFO Queue State" : "LIFO Stack State"}
          </span>
          <span className="res-val">
            {frontier.length > 0 ? `[ ${frontier.join(", ")} ]` : "[ Empty ]"}
          </span>
          <span className="res-eq">
            {algorithm === "BFS" ? "Queue Frontier" : "Call Stack"}
          </span>
        </div>

        <div className="sim-result-card highlight">
          <span className="res-label">Current Step & Complexity</span>
          <span className="res-val" style={{ fontSize: "0.95rem" }}>
            {desc}
          </span>
          <span className="res-eq">
            Visited: {visited.length}/{nodes.length} · Complexity: O(V + E)
          </span>
        </div>
      </div>
    </div>
  );
}
