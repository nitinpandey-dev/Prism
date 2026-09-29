import { useState, useEffect, useCallback, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Legend,
} from "recharts";
import SimulationLayout, {
  ControlsPanel, ControlSection, VisualizationPanel,
  StatCard, StatsRow, LearningPanel, EquationDisplay,
  SimLoadingState, SimErrorState,
} from "../../../components/simulations/SimulationLayout";
import { functionApi } from "../../../services/api";
import { getById } from "../../../config/simulatorRegistry";

const SIM = getById("function-explorer");

const PRESETS = [
  { label: "sin(x)", expr: "sin(x)" },
  { label: "x² − 4", expr: "x**2 - 4" },
  { label: "x³ − 3x", expr: "x**3 - 3*x" },
  { label: "e^(−x²/2)", expr: "exp(-x**2/2)" },
  { label: "1/(x²+1)", expr: "1/(x**2 + 1)" },
  { label: "sin(x)+cos(2x)", expr: "sin(x) + cos(2*x)" },
  { label: "e^(−x/3)·sin(2x)", expr: "exp(-x/3)*sin(2*x)" },
  { label: "log(x)", expr: "log(x)" },
];

const FuncTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--clr-bg-elevated)", border: "1px solid var(--clr-border)",
      borderRadius: "var(--radius-md)", padding: "var(--sp-2) var(--sp-3)", fontSize: "0.78rem",
    }}>
      {payload.map((p) => (
        <div key={p.dataKey}>
          <span style={{ color: p.color }}>{p.name}</span>: {" "}
          <strong style={{ color: "var(--clr-text-primary)" }}>
            {isFinite(p.value) ? p.value?.toFixed(4) : "undefined"}
          </strong>
        </div>
      ))}
    </div>
  );
};

export default function FunctionExplorerPage() {
  const [expression, setExpression] = useState("sin(x)");
  const [inputExpr, setInputExpr] = useState("sin(x)");
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [showDerivative, setShowDerivative] = useState(true);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(async () => {
    if (!expression.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await functionApi.compute({
        expression,
        x_min: xMin,
        x_max: xMax,
        points: 400,
        compute_derivative: true,
        compute_integral: true,
        find_roots: true,
        find_critical: true,
      });
      if (!res.success) throw new Error(res.error || "Computation failed");
      setData(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [expression, xMin, xMax]);

  useEffect(() => { run(); }, [run]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setExpression(inputExpr);
  };

  const chartData = data
    ? data.x.map((x, i) => ({
        x: parseFloat(x.toFixed(4)),
        "f(x)": isFinite(data.y[i]) ? parseFloat(data.y[i].toFixed(5)) : null,
        "f'(x)": data.dy && isFinite(data.dy[i]) ? parseFloat(data.dy[i].toFixed(5)) : null,
      }))
    : [];

  return (
    <SimulationLayout sim={SIM}>
      {/* ── Controls ── */}
      <ControlsPanel title="Function Parameters">
        <ControlSection title="Expression">
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
            <label className="label" htmlFor="expr">f(x) =</label>
            <div style={{ display: "flex", gap: "var(--sp-2)" }}>
              <input
                id="expr"
                className="input"
                value={inputExpr}
                onChange={(e) => setInputExpr(e.target.value)}
                placeholder="e.g. sin(x) + x**2"
                style={{ fontFamily: "var(--font-mono)" }}
              />
              <button type="submit" className="btn btn-primary btn-sm">Plot</button>
            </div>
          </form>
        </ControlSection>

        <ControlSection title="Presets">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--sp-2)" }}>
            {PRESETS.map((p) => (
              <button
                key={p.expr}
                className={`btn btn-sm ${expression === p.expr ? "btn-primary" : "btn-secondary"}`}
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem" }}
                onClick={() => { setInputExpr(p.expr); setExpression(p.expr); }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </ControlSection>

        <ControlSection title="Domain">
          <div style={{ display: "flex", gap: "var(--sp-3)" }}>
            <div style={{ flex: 1 }}>
              <label className="label" htmlFor="xmin">x min</label>
              <input
                id="xmin" className="input" type="number" value={xMin}
                onChange={(e) => setXMin(Number(e.target.value))}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="label" htmlFor="xmax">x max</label>
              <input
                id="xmax" className="input" type="number" value={xMax}
                onChange={(e) => setXMax(Number(e.target.value))}
              />
            </div>
          </div>
        </ControlSection>

        <ControlSection title="Display">
          <label style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)", cursor: "pointer", fontSize: "0.85rem", color: "var(--clr-text-secondary)" }}>
            <input
              type="checkbox" checked={showDerivative}
              onChange={(e) => setShowDerivative(e.target.checked)}
            />
            Show f'(x)
          </label>
        </ControlSection>

        {data && (
          <ControlSection title="Analysis">
            {data.expression_latex && (
              <EquationDisplay label="f(x)" equation={data.expression_str} />
            )}
            {data.derivative_str && (
              <EquationDisplay label="f'(x)" equation={data.derivative_str} />
            )}
            {data.integral_str && (
              <EquationDisplay label="∫f(x)dx" equation={data.integral_str} />
            )}
          </ControlSection>
        )}
      </ControlsPanel>

      {/* ── Visualization ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
        <VisualizationPanel title={`Graph: f(x) = ${expression}`}>
          {error ? (
            <SimErrorState error={error} onRetry={run} />
          ) : loading ? (
            <SimLoadingState message="Computing with SymPy…" />
          ) : (
            <div style={{ height: "440px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
                  <XAxis
                    dataKey="x" type="number" domain={[xMin, xMax]}
                    stroke="#4b5563" tick={{ fill: "#94a3b8", fontSize: 11 }}
                    label={{ value: "x", position: "insideBottom", offset: -10, fill: "#94a3b8", fontSize: 12 }}
                  />
                  <YAxis
                    stroke="#4b5563" tick={{ fill: "#94a3b8", fontSize: 11 }}
                    label={{ value: "f(x)", angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 12 }}
                    domain={["auto", "auto"]}
                  />
                  <Tooltip content={<FuncTooltip />} />
                  <Legend wrapperStyle={{ color: "var(--clr-text-secondary)", fontSize: "0.8rem" }} />
                  <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                  <ReferenceLine x={0} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                  <Line
                    type="monotone" dataKey="f(x)" name="f(x)"
                    stroke="#6366f1" strokeWidth={2.5}
                    dot={false} connectNulls={false}
                    isAnimationActive={true} animationDuration={500}
                  />
                  {showDerivative && data?.dy && (
                    <Line
                      type="monotone" dataKey="f'(x)" name="f'(x)"
                      stroke="#22d3ee" strokeWidth={1.5} strokeDasharray="6 3"
                      dot={false} connectNulls={false}
                      isAnimationActive={true} animationDuration={500}
                    />
                  )}
                  {/* Mark roots */}
                  {data?.roots?.map((root, i) => (
                    <ReferenceLine
                      key={i} x={root}
                      stroke="#22c55e" strokeDasharray="3 3" strokeWidth={1}
                      label={{ value: `x=${root.toFixed(2)}`, fill: "#22c55e", fontSize: 10 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </VisualizationPanel>

        {data && (
          <StatsRow>
            <StatCard label="Roots" value={data.roots?.length ?? "—"} unit="found" />
            <StatCard label="Critical Pts" value={data.critical_points?.length ?? "—"} unit="found" />
            {data.critical_points?.[0] && (
              <StatCard
                label="First Critical"
                value={`(${data.critical_points[0].x.toFixed(2)}, ${data.critical_points[0].y.toFixed(2)})`}
              />
            )}
          </StatsRow>
        )}

        {data?.roots?.length > 0 && (
          <div style={{
            background: "var(--clr-bg-card)", border: "1px solid var(--clr-border)",
            borderRadius: "var(--radius-lg)", padding: "var(--sp-4)"
          }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--clr-text-muted)", marginBottom: "var(--sp-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Roots in [{xMin}, {xMax}]
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--sp-2)" }}>
              {data.roots.map((r, i) => (
                <span key={i} style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.82rem",
                  padding: "2px 10px", background: "rgba(34,197,94,0.1)",
                  border: "1px solid rgba(34,197,94,0.2)", borderRadius: "var(--radius-full)",
                  color: "#4ade80"
                }}>
                  x = {r}
                </span>
              ))}
            </div>
          </div>
        )}

        <LearningPanel objectives={SIM.learningObjectives} />
      </div>
    </SimulationLayout>
  );
}
