import React, { useState, useEffect, useRef } from "react";

export default function GraphTraversalSim() {
  const [algorithm, setAlgorithm] = useState("BFS"); // "BFS" | "DFS"
  const [startNode, setStartNode] = useState("A");
  const [isRunning, setIsRunning] = useState(false);
  const [speedLevel, setSpeedLevel] = useState(75); // 10 to 100% (higher = faster)

  // Graph Structure (Nodes with 2D positions and Adjacency List)
  const [nodes, setNodes] = useState([
    { id: "A", x: 120, y: 190 },
    { id: "B", x: 260, y: 100 },
    { id: "C", x: 260, y: 280 },
    { id: "D", x: 420, y: 90 },
    { id: "E", x: 420, y: 210 },
    { id: "F", x: 420, y: 320 },
    { id: "G", x: 580, y: 200 },
  ]);

  const [edges, setEdges] = useState([
    ["A", "B"], ["A", "C"],
    ["B", "D"], ["B", "E"],
    ["C", "E"], ["C", "F"],
    ["D", "G"], ["E", "G"], ["F", "G"],
  ]);

  // Traversal State
  const [visited, setVisited] = useState([]);
  const [traversalOrder, setTraversalOrder] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const [activeEdge, setActiveEdge] = useState(null);
  const [frontier, setFrontier] = useState([]); // Queue for BFS, Stack for DFS

  const isRunningRef = useRef(false);
  isRunningRef.current = isRunning;

  const speedRef = useRef(150);
  // Calculate delay: 100% = 40ms, 75% = 120ms, 50% = 250ms, 10% = 500ms
  const getDelay = (lvl) => Math.max(30, Math.round(550 * Math.pow((100 - lvl) / 100, 1.4)));
  speedRef.current = getDelay(speedLevel);

  const canvasRef = useRef(null);

  const resetTraversal = () => {
    setIsRunning(false);
    setVisited([]);
    setTraversalOrder([]);
    setCurrentNode(null);
    setActiveEdge(null);
    setFrontier([]);
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Build Adjacency List
  const getAdjList = () => {
    const adj = {};
    nodes.forEach((n) => (adj[n.id] = []));
    edges.forEach(([u, v]) => {
      adj[u].push(v);
      adj[v].push(u);
    });
    // Sort neighbors alphabetically for deterministic traversal
    Object.keys(adj).forEach((k) => adj[k].sort());
    return adj;
  };

  // 1. Breadth-First Search (BFS)
  const runBFS = async () => {
    const adj = getAdjList();
    const queue = [startNode];
    const seen = new Set([startNode]);
    const order = [];

    setFrontier([...queue]);
    setVisited([startNode]);

    while (queue.length > 0) {
      if (!isRunningRef.current) return;
      const u = queue.shift();
      setCurrentNode(u);
      order.push(u);
      setTraversalOrder([...order]);
      setFrontier([...queue]);
      await sleep(speedRef.current);

      const neighbors = adj[u] || [];
      for (const v of neighbors) {
        if (!isRunningRef.current) return;
        if (!seen.has(v)) {
          seen.add(v);
          setActiveEdge([u, v]);
          queue.push(v);
          setVisited((prev) => [...prev, v]);
          setFrontier([...queue]);
          await sleep(Math.round(speedRef.current * 0.6));
        }
      }
      setActiveEdge(null);
    }
    setCurrentNode(null);
    setIsRunning(false);
  };

  // 2. Depth-First Search (DFS)
  const runDFS = async () => {
    const adj = getAdjList();
    const stack = [startNode];
    const seen = new Set();
    const order = [];

    setFrontier([...stack]);

    while (stack.length > 0) {
      if (!isRunningRef.current) return;
      const u = stack.pop();
      setFrontier([...stack]);

      if (!seen.has(u)) {
        seen.add(u);
        setCurrentNode(u);
        order.push(u);
        setVisited((prev) => [...prev, u]);
        setTraversalOrder([...order]);
        await sleep(speedRef.current);

        // Push neighbors in reverse to visit in alphabetical order
        const neighbors = [...(adj[u] || [])].reverse();
        for (const v of neighbors) {
          if (!seen.has(v)) {
            setActiveEdge([u, v]);
            stack.push(v);
            setFrontier([...stack]);
            await sleep(Math.round(speedRef.current * 0.5));
          }
        }
        setActiveEdge(null);
      }
    }
    setCurrentNode(null);
    setIsRunning(false);
  };

  const handleStart = () => {
    if (visited.length > 0) {
      resetTraversal();
    }
    setIsRunning(true);
    if (algorithm === "BFS") runBFS();
    else runDFS();
  };

  const handlePause = () => {
    setIsRunning(false);
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
      // Scale node coordinates to fit canvas dimensions nicely
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
        ctx.strokeStyle = "rgba(37, 99, 235, 0.3)";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(px, py, 26, 0, Math.PI * 2);
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
  }, [nodes, edges, currentNode, visited, activeEdge, frontier, startNode, traversalOrder]);

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
        <div className="sim-canvas-overlay-badge">
          {algorithm} Traversal · Start at Node {startNode}
        </div>
      </div>

      {/* ── Controls Strip ── */}
      <div className="sim-controls-strip">
        <div className="sim-ctrl-item">
          <label>Algorithm</label>
          <div className="sim-segmented-btn">
            {["BFS", "DFS"].map((alg) => (
              <button
                key={alg}
                className={`seg-btn ${algorithm === alg ? "active" : ""}`}
                onClick={() => {
                  setAlgorithm(alg);
                  resetTraversal();
                }}
              >
                {alg === "BFS" ? "Breadth-First (BFS)" : "Depth-First (DFS)"}
              </button>
            ))}
          </div>
        </div>

        <div className="sim-ctrl-item">
          <label>Starting Node</label>
          <div className="sim-segmented-btn">
            {nodes.map((n) => (
              <button
                key={n.id}
                className={`seg-btn ${startNode === n.id ? "active" : ""}`}
                disabled={isRunning}
                onClick={() => {
                  setStartNode(n.id);
                  resetTraversal();
                }}
              >
                {n.id}
              </button>
            ))}
          </div>
        </div>

        <div className="sim-ctrl-item">
          <label>
            <span>Execution Speed</span>
            <strong>{speedLevel}% ({speedRef.current}ms)</strong>
          </label>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={speedLevel}
            onChange={(e) => setSpeedLevel(Number(e.target.value))}
          />
        </div>

        <div className="sim-btn-group">
          {!isRunning ? (
            <button className="btn btn-primary" onClick={handleStart}>
              {visited.length > 0 ? "Replay" : "Start Traversal"}
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={handlePause}>
              Pause
            </button>
          )}
          <button className="btn btn-secondary" onClick={resetTraversal}>
            Reset
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
              : "Click 'Start Traversal' to begin"}
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
          <span className="res-label">Current Node & Progress</span>
          <span className="res-val">
            Node: {currentNode || "—"} ({visited.length}/{nodes.length})
          </span>
          <span className="res-eq">Complexity: O(V + E)</span>
        </div>
      </div>
    </div>
  );
}
