import React, { useState, useEffect, useRef } from "react";

export default function SortingVisualizerSim() {
  const [algorithm, setAlgorithm] = useState("bubble"); // "bubble" | "selection" | "insertion"
  const [arraySize, setArraySize] = useState(20);
  const [speed, setSpeed] = useState(40); // ms delay per step
  const [array, setArray] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSorted, setIsSorted] = useState(false);

  // Execution Step State
  const [comparing, setComparing] = useState([]);
  const [swapped, setSwapped] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [comparisonsCount, setComparisonsCount] = useState(0);
  const [swapsCount, setSwapsCount] = useState(0);
  const [stepCount, setStepCount] = useState(0);

  const isRunningRef = useRef(false);
  isRunningRef.current = isRunning;

  // Generate random array
  const generateArray = () => {
    setIsRunning(false);
    setIsSorted(false);
    setComparing([]);
    setSwapped([]);
    setSortedIndices([]);
    setComparisonsCount(0);
    setSwapsCount(0);
    setStepCount(0);

    const newArr = [];
    for (let i = 0; i < arraySize; i++) {
      newArr.push(Math.floor(Math.random() * 85) + 12);
    }
    setArray(newArr);
  };

  useEffect(() => {
    generateArray();
  }, [arraySize]);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // 1. Bubble Sort
  const runBubbleSort = async (arr) => {
    let a = [...arr];
    const n = a.length;
    let comps = 0;
    let swaps = 0;
    let steps = 0;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (!isRunningRef.current) return;
        setComparing([j, j + 1]);
        setSwapped([]);
        comps++;
        steps++;
        setComparisonsCount(comps);
        setStepCount(steps);
        await sleep(speed);

        if (a[j] > a[j + 1]) {
          if (!isRunningRef.current) return;
          const temp = a[j];
          a[j] = a[j + 1];
          a[j + 1] = temp;
          swaps++;
          setSwapsCount(swaps);
          setSwapped([j, j + 1]);
          setArray([...a]);
          await sleep(speed);
        }
      }
      setSortedIndices((prev) => [...prev, n - i - 1]);
    }
    setSortedIndices(Array.from({ length: n }, (_, i) => i));
    setComparing([]);
    setSwapped([]);
    setIsRunning(false);
    setIsSorted(true);
  };

  // 2. Selection Sort
  const runSelectionSort = async (arr) => {
    let a = [...arr];
    const n = a.length;
    let comps = 0;
    let swaps = 0;
    let steps = 0;

    for (let i = 0; i < n; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        if (!isRunningRef.current) return;
        setComparing([minIdx, j]);
        setSwapped([]);
        comps++;
        steps++;
        setComparisonsCount(comps);
        setStepCount(steps);
        await sleep(speed);

        if (a[j] < a[minIdx]) {
          minIdx = j;
        }
      }

      if (minIdx !== i) {
        if (!isRunningRef.current) return;
        const temp = a[i];
        a[i] = a[minIdx];
        a[minIdx] = temp;
        swaps++;
        setSwapsCount(swaps);
        setSwapped([i, minIdx]);
        setArray([...a]);
        await sleep(speed);
      }
      setSortedIndices((prev) => [...prev, i]);
    }
    setSortedIndices(Array.from({ length: n }, (_, i) => i));
    setComparing([]);
    setSwapped([]);
    setIsRunning(false);
    setIsSorted(true);
  };

  // 3. Insertion Sort
  const runInsertionSort = async (arr) => {
    let a = [...arr];
    const n = a.length;
    let comps = 0;
    let swaps = 0;
    let steps = 0;

    setSortedIndices([0]);
    for (let i = 1; i < n; i++) {
      let key = a[i];
      let j = i - 1;

      while (j >= 0) {
        if (!isRunningRef.current) return;
        setComparing([j, j + 1]);
        setSwapped([]);
        comps++;
        steps++;
        setComparisonsCount(comps);
        setStepCount(steps);
        await sleep(speed);

        if (a[j] > key) {
          a[j + 1] = a[j];
          swaps++;
          setSwapsCount(swaps);
          setSwapped([j, j + 1]);
          setArray([...a]);
          await sleep(speed);
          j--;
        } else {
          break;
        }
      }
      a[j + 1] = key;
      setArray([...a]);
      setSortedIndices(Array.from({ length: i + 1 }, (_, k) => k));
    }
    setSortedIndices(Array.from({ length: n }, (_, i) => i));
    setComparing([]);
    setSwapped([]);
    setIsRunning(false);
    setIsSorted(true);
  };

  const handleStart = () => {
    if (isSorted) {
      generateArray();
      return;
    }
    setIsRunning(true);
    if (algorithm === "bubble") runBubbleSort(array);
    else if (algorithm === "selection") runSelectionSort(array);
    else if (algorithm === "insertion") runInsertionSort(array);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const ALGO_DESCS = {
    bubble: { name: "Bubble Sort", time: "O(n²)", space: "O(1)", stable: "Yes" },
    selection: { name: "Selection Sort", time: "O(n²)", space: "O(1)", stable: "No" },
    insertion: { name: "Insertion Sort", time: "O(n²) / O(n)", space: "O(1)", stable: "Yes" },
  };

  const maxVal = Math.max(...array, 100);

  return (
    <div className="sim-module-workspace">
      {/* ── Main Bar Chart Viewport ── */}
      <div className="sim-canvas-container sim-sorting-container">
        <div className="sim-sorting-bars-wrap">
          {array.map((val, idx) => {
            const isComp = comparing.includes(idx);
            const isSwap = swapped.includes(idx);
            const isDone = sortedIndices.includes(idx);

            let barColor = "#64748b"; // Clean Slate Blue
            if (isDone) barColor = "#16a34a"; // Green Sorted
            if (isComp) barColor = "#f59e0b"; // Amber Comparing
            if (isSwap) barColor = "#ef4444"; // Red Swapped

            const heightPct = Math.max(6, (val / maxVal) * 82);

            return (
              <div
                key={idx}
                className="sim-sorting-bar-col"
              >
                {arraySize <= 25 && (
                  <span className="sim-sorting-bar-val">
                    {val}
                  </span>
                )}
                <div
                  className="sim-sorting-bar"
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: barColor,
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="sim-canvas-overlay-badge">
          {ALGO_DESCS[algorithm].name} · {isRunning ? "Sorting..." : isSorted ? "Sorted ✓" : "Ready"}
        </div>
      </div>

      {/* ── Controls Strip ── */}
      <div className="sim-controls-strip">
        <div className="sim-ctrl-item">
          <label>Algorithm</label>
          <div className="sim-segmented-btn">
            {Object.keys(ALGO_DESCS).map((k) => (
              <button
                key={k}
                className={`seg-btn ${algorithm === k ? "active" : ""}`}
                onClick={() => {
                  setAlgorithm(k);
                  generateArray();
                }}
              >
                {ALGO_DESCS[k].name}
              </button>
            ))}
          </div>
        </div>

        <div className="sim-ctrl-item">
          <label>
            <span>Array Size (n)</span>
            <strong>{arraySize}</strong>
          </label>
          <input
            type="range"
            min="10"
            max="40"
            step="2"
            disabled={isRunning}
            value={arraySize}
            onChange={(e) => setArraySize(Number(e.target.value))}
          />
        </div>

        <div className="sim-ctrl-item">
          <label>
            <span>Execution Speed</span>
            <strong>{100 - speed}%</strong>
          </label>
          <input
            type="range"
            min="5"
            max="95"
            step="5"
            value={100 - speed}
            onChange={(e) => setSpeed(100 - Number(e.target.value))}
          />
        </div>

        <div className="sim-btn-group">
          {!isRunning ? (
            <button className="btn btn-primary" onClick={handleStart}>
              {isSorted ? "Replay" : "Start"}
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={handlePause}>
              Pause
            </button>
          )}
          <button className="btn btn-secondary" onClick={generateArray}>
            Generate Array
          </button>
        </div>
      </div>

      {/* ── Live Step Metrics Strip ── */}
      <div className="sim-results-grid">
        <div className="sim-result-card">
          <span className="res-label">Comparisons</span>
          <span className="res-val">{comparisonsCount}</span>
          <span className="res-eq">Element Inspections</span>
        </div>

        <div className="sim-result-card">
          <span className="res-label">Swaps / Shifts</span>
          <span className="res-val">{swapsCount}</span>
          <span className="res-eq">Data Movements</span>
        </div>

        <div className="sim-result-card">
          <span className="res-label">Current Step</span>
          <span className="res-val">{stepCount}</span>
          <span className="res-eq">Time: {ALGO_DESCS[algorithm].time}</span>
        </div>

        <div className="sim-result-card highlight">
          <span className="res-label">Complexity Analysis</span>
          <span className="res-val">Space {ALGO_DESCS[algorithm].space}</span>
          <span className="res-eq">Stable: {ALGO_DESCS[algorithm].stable}</span>
        </div>
      </div>
    </div>
  );
}
