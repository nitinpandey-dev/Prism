import React, { useState, useEffect, useRef, useCallback } from "react";

export default function SortingVisualizerSim() {
  const [algorithm, setAlgorithm] = useState("bubble");
  const [arraySize, setArraySize] = useState(20);
  const [speedLevel, setSpeedLevel] = useState(90);
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

  const speedRef = useRef(3);
  // Ultra-fast non-linear delay: 100% = 0ms (instant), 90% = 2ms, 70% = 8ms, 50% = 18ms
  const getDelay = (lvl) => Math.max(0, Math.round(40 * Math.pow((100 - lvl) / 100, 1.8)));
  speedRef.current = getDelay(speedLevel);

  // Generate random array
  const generateArray = useCallback(() => {
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
  }, [arraySize]);

  useEffect(() => {
    generateArray();
  }, [generateArray]);

  // Efficient sleep: uses rAF for 0ms delay, setTimeout otherwise
  const sleep = (ms) => {
    if (ms <= 0) return new Promise((resolve) => requestAnimationFrame(resolve));
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  // ─── SORTING ALGORITHMS ─────────────────────────────────────────────────────

  // 1. Bubble Sort
  const runBubbleSort = async (arr) => {
    let a = [...arr];
    const n = a.length;
    let comps = 0, swaps = 0, steps = 0;

    for (let i = 0; i < n; i++) {
      let swappedInPass = false;
      for (let j = 0; j < n - i - 1; j++) {
        if (!isRunningRef.current) return;
        comps++; steps++;
        setComparing([j, j + 1]);
        setSwapped([]);
        setComparisonsCount(comps);
        setStepCount(steps);

        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          swaps++;
          setSwapsCount(swaps);
          setSwapped([j, j + 1]);
          setArray([...a]);
          swappedInPass = true;
        }
        await sleep(speedRef.current);
      }
      setSortedIndices((prev) => [...prev, n - i - 1]);
      if (!swappedInPass) break;
    }
    finishSort(n);
  };

  // 2. Selection Sort
  const runSelectionSort = async (arr) => {
    let a = [...arr];
    const n = a.length;
    let comps = 0, swaps = 0, steps = 0;

    for (let i = 0; i < n; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        if (!isRunningRef.current) return;
        comps++; steps++;
        setComparing([minIdx, j]);
        setSwapped([]);
        setComparisonsCount(comps);
        setStepCount(steps);
        await sleep(speedRef.current);

        if (a[j] < a[minIdx]) minIdx = j;
      }

      if (minIdx !== i) {
        if (!isRunningRef.current) return;
        [a[i], a[minIdx]] = [a[minIdx], a[i]];
        swaps++;
        setSwapsCount(swaps);
        setSwapped([i, minIdx]);
        setArray([...a]);
        await sleep(speedRef.current);
      }
      setSortedIndices((prev) => [...prev, i]);
    }
    finishSort(n);
  };

  // 3. Insertion Sort
  const runInsertionSort = async (arr) => {
    let a = [...arr];
    const n = a.length;
    let comps = 0, swaps = 0, steps = 0;

    setSortedIndices([0]);
    for (let i = 1; i < n; i++) {
      let key = a[i];
      let j = i - 1;

      while (j >= 0) {
        if (!isRunningRef.current) return;
        comps++; steps++;
        setComparing([j, j + 1]);
        setSwapped([]);
        setComparisonsCount(comps);
        setStepCount(steps);
        await sleep(speedRef.current);

        if (a[j] > key) {
          a[j + 1] = a[j];
          swaps++;
          setSwapsCount(swaps);
          setSwapped([j, j + 1]);
          setArray([...a]);
          await sleep(speedRef.current);
          j--;
        } else {
          break;
        }
      }
      a[j + 1] = key;
      setArray([...a]);
      setSortedIndices(Array.from({ length: i + 1 }, (_, k) => k));
    }
    finishSort(n);
  };

  // 4. Merge Sort
  const runMergeSort = async (arr) => {
    let a = [...arr];
    const n = a.length;
    let comps = 0, swaps = 0, steps = 0;

    const merge = async (left, mid, right) => {
      const leftArr = a.slice(left, mid + 1);
      const rightArr = a.slice(mid + 1, right + 1);
      let i = 0, j = 0, k = left;

      while (i < leftArr.length && j < rightArr.length) {
        if (!isRunningRef.current) return;
        comps++; steps++;
        setComparing([left + i, mid + 1 + j]);
        setComparisonsCount(comps);
        setStepCount(steps);
        await sleep(speedRef.current);

        if (leftArr[i] <= rightArr[j]) {
          a[k] = leftArr[i]; i++;
        } else {
          a[k] = rightArr[j]; j++;
          swaps++;
          setSwapsCount(swaps);
        }
        setSwapped([k]);
        setArray([...a]);
        k++;
      }

      while (i < leftArr.length) {
        if (!isRunningRef.current) return;
        a[k] = leftArr[i]; i++; k++;
        steps++;
        setStepCount(steps);
        setArray([...a]);
        await sleep(speedRef.current);
      }
      while (j < rightArr.length) {
        if (!isRunningRef.current) return;
        a[k] = rightArr[j]; j++; k++;
        steps++;
        setStepCount(steps);
        setArray([...a]);
        await sleep(speedRef.current);
      }
    };

    const mergeSortHelper = async (left, right) => {
      if (left >= right || !isRunningRef.current) return;
      const mid = Math.floor((left + right) / 2);
      await mergeSortHelper(left, mid);
      await mergeSortHelper(mid + 1, right);
      await merge(left, mid, right);
    };

    await mergeSortHelper(0, n - 1);
    finishSort(n);
  };

  // 5. Quick Sort
  const runQuickSort = async (arr) => {
    let a = [...arr];
    const n = a.length;
    let comps = 0, swaps = 0, steps = 0;

    const partition = async (low, high) => {
      const pivot = a[high];
      let i = low - 1;

      for (let j = low; j < high; j++) {
        if (!isRunningRef.current) return -1;
        comps++; steps++;
        setComparing([j, high]);
        setComparisonsCount(comps);
        setStepCount(steps);
        await sleep(speedRef.current);

        if (a[j] < pivot) {
          i++;
          [a[i], a[j]] = [a[j], a[i]];
          swaps++;
          setSwapsCount(swaps);
          setSwapped([i, j]);
          setArray([...a]);
          await sleep(speedRef.current);
        }
      }
      [a[i + 1], a[high]] = [a[high], a[i + 1]];
      swaps++;
      setSwapsCount(swaps);
      setSwapped([i + 1, high]);
      setArray([...a]);
      setSortedIndices((prev) => [...prev, i + 1]);
      await sleep(speedRef.current);
      return i + 1;
    };

    const quickSortHelper = async (low, high) => {
      if (low >= high || !isRunningRef.current) return;
      const pi = await partition(low, high);
      if (pi < 0) return;
      await quickSortHelper(low, pi - 1);
      await quickSortHelper(pi + 1, high);
    };

    await quickSortHelper(0, n - 1);
    finishSort(n);
  };

  const finishSort = (n) => {
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
    switch (algorithm) {
      case "bubble": runBubbleSort(array); break;
      case "selection": runSelectionSort(array); break;
      case "insertion": runInsertionSort(array); break;
      case "merge": runMergeSort(array); break;
      case "quick": runQuickSort(array); break;
      default: break;
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const ALGO_DESCS = {
    bubble: { name: "Bubble Sort", time: "O(n²)", best: "O(n)", space: "O(1)", stable: "Yes" },
    selection: { name: "Selection Sort", time: "O(n²)", best: "O(n²)", space: "O(1)", stable: "No" },
    insertion: { name: "Insertion Sort", time: "O(n²)", best: "O(n)", space: "O(1)", stable: "Yes" },
    merge: { name: "Merge Sort", time: "O(n log n)", best: "O(n log n)", space: "O(n)", stable: "Yes" },
    quick: { name: "Quick Sort", time: "O(n²)", best: "O(n log n)", space: "O(log n)", stable: "No" },
  };

  const maxVal = Math.max(...array, 100);

  // Adaptive font size for bar values based on array size
  const getValFontSize = () => {
    if (arraySize > 35) return "7px";
    if (arraySize > 28) return "8px";
    if (arraySize > 22) return "9px";
    return "11px";
  };

  return (
    <div className="sim-module-workspace">
      {/* ── Main Bar Chart Viewport ── */}
      <div className="sim-canvas-container sim-sorting-container">
        <div className="sim-sorting-bars-wrap">
          {array.map((val, idx) => {
            const isComp = comparing.includes(idx);
            const isSwap = swapped.includes(idx);
            const isDone = sortedIndices.includes(idx);

            let barColor = "#64748b";
            if (isDone) barColor = "#16a34a";
            if (isComp) barColor = "#f59e0b";
            if (isSwap) barColor = "#ef4444";

            const heightPct = Math.max(6, (val / maxVal) * 82);

            return (
              <div key={idx} className="sim-sorting-bar-col">
                <span
                  className="sim-sorting-bar-val"
                  style={{
                    fontSize: getValFontSize(),
                    letterSpacing: arraySize > 30 ? "-0.04em" : "normal",
                  }}
                >
                  {val}
                </span>
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
                disabled={isRunning}
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
            min="8"
            max="60"
            step="2"
            disabled={isRunning}
            value={arraySize}
            onChange={(e) => setArraySize(Number(e.target.value))}
          />
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
              {isSorted ? "Replay" : "Start"}
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={handlePause}>
              Pause
            </button>
          )}
          <button className="btn btn-secondary" onClick={generateArray} disabled={isRunning}>
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
          <span className="res-eq">Worst: {ALGO_DESCS[algorithm].time}</span>
        </div>

        <div className="sim-result-card highlight">
          <span className="res-label">Complexity Analysis</span>
          <span className="res-val">Best {ALGO_DESCS[algorithm].best}</span>
          <span className="res-eq">Space: {ALGO_DESCS[algorithm].space} · Stable: {ALGO_DESCS[algorithm].stable}</span>
        </div>
      </div>
    </div>
  );
}
