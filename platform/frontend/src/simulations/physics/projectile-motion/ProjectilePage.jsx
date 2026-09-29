import { useState, useEffect, useCallback, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Legend,
} from "recharts";
import SimulationLayout, {
  ControlsPanel, ControlSection, VisualizationPanel,
  StatCard, StatsRow, LearningPanel, EquationDisplay,
  ParameterSlider, SimLoadingState, SimErrorState,
} from "../../../components/simulations/SimulationLayout";
import { projectileApi } from "../../../services/api";
import { getById } from "../../../config/simulatorRegistry";

const SIM = getById("projectile-motion");

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: "var(--clr-bg-elevated)", border: "1px solid var(--clr-border)",
      borderRadius: "var(--radius-md)", padding: "var(--sp-3)", fontSize: "0.78rem",
    }}>
      <div>x = <strong style={{ color: "var(--clr-cyan-400)" }}>{d.x?.toFixed(2)} m</strong></div>
      <div>y = <strong style={{ color: "var(--clr-violet-400)" }}>{d.y?.toFixed(2)} m</strong></div>
      {d.t != null && <div>t = <strong style={{ color: "var(--clr-text-secondary)" }}>{d.t?.toFixed(3)} s</strong></div>}
    </div>
  );
};

export default function ProjectilePage() {
  const [params, setParams] = useState({
    initial_speed: 30,
    launch_angle: 45,
    initial_height: 0,
    gravity: 9.81,
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (key) => (val) => setParams((p) => ({ ...p, [key]: val }));

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await projectileApi.compute({ ...params, time_steps: 300 });
      if (!res.success) throw new Error(res.error || "Simulation failed");
      setData(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { run(); }, [run]);

  const chartData = data
    ? data.trajectory.x.map((x, i) => ({
        x: parseFloat(x.toFixed(2)),
        y: parseFloat(data.trajectory.y[i].toFixed(2)),
        t: data.trajectory.t[i],
      }))
    : [];

  return (
    <SimulationLayout sim={SIM}>
      {/* ── Controls ── */}
      <ControlsPanel title="Launch Parameters">
        <ControlSection title="Initial Conditions">
          <ParameterSlider
            id="speed" label="Launch Speed" value={params.initial_speed}
            min={5} max={150} step={1} unit=" m/s" onChange={set("initial_speed")}
          />
          <ParameterSlider
            id="angle" label="Launch Angle" value={params.launch_angle}
            min={0} max={90} step={1} unit="°" onChange={set("launch_angle")}
          />
          <ParameterSlider
            id="height" label="Initial Height" value={params.initial_height}
            min={0} max={100} step={1} unit=" m" onChange={set("initial_height")}
          />
        </ControlSection>

        <ControlSection title="Environment">
          <ParameterSlider
            id="gravity" label="Gravity" value={params.gravity}
            min={1.6} max={25} step={0.1} unit=" m/s²" onChange={set("gravity")}
          />
          <div style={{ fontSize: "0.72rem", color: "var(--clr-text-muted)", lineHeight: 1.5 }}>
            🌍 Earth: 9.81 m/s² &nbsp;|&nbsp; 🌙 Moon: 1.62 m/s² &nbsp;|&nbsp; ♂ Mars: 3.72 m/s²
          </div>
        </ControlSection>

        <ControlSection title="Equations">
          <EquationDisplay label="Horizontal" equation={`x(t) = v₀cos(θ)·t`} />
          <EquationDisplay label="Vertical" equation={`y(t) = h₀ + v₀sin(θ)·t − ½g·t²`} />
        </ControlSection>
      </ControlsPanel>

      {/* ── Visualization ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
        <VisualizationPanel title="Projectile Trajectory">
          {error ? (
            <SimErrorState error={error} onRetry={run} />
          ) : loading ? (
            <SimLoadingState message="Computing trajectory…" />
          ) : (
            <div style={{ height: "420px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
                  <XAxis
                    dataKey="x" type="number" domain={["auto", "auto"]}
                    label={{ value: "Horizontal Distance (m)", position: "insideBottom", offset: -10, fill: "#94a3b8", fontSize: 12 }}
                    stroke="#4b5563" tick={{ fill: "#94a3b8", fontSize: 11 }}
                  />
                  <YAxis
                    dataKey="y" type="number" domain={[0, "auto"]}
                    label={{ value: "Height (m)", angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 12 }}
                    stroke="#4b5563" tick={{ fill: "#94a3b8", fontSize: 11 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {data && (
                    <ReferenceLine
                      x={data.horizontal_range}
                      stroke="#22c55e" strokeDasharray="4 4"
                      label={{ value: `Range: ${data.horizontal_range.toFixed(1)}m`, fill: "#22c55e", fontSize: 11 }}
                    />
                  )}
                  <Line
                    type="monotone" dataKey="y"
                    stroke="url(#trajectoryGrad)" strokeWidth={2.5}
                    dot={false} isAnimationActive={true} animationDuration={600}
                  />
                  <defs>
                    <linearGradient id="trajectoryGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="50%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </VisualizationPanel>

        {data && (
          <StatsRow>
            <StatCard label="Range" value={data.horizontal_range.toFixed(2)} unit="m" />
            <StatCard label="Max Height" value={data.max_height.toFixed(2)} unit="m" />
            <StatCard label="Flight Time" value={data.time_of_flight.toFixed(3)} unit="s" />
            <StatCard label="Vₓ" value={data.vx.toFixed(2)} unit="m/s" />
            <StatCard label="Vᵧ" value={data.vy.toFixed(2)} unit="m/s" />
          </StatsRow>
        )}

        <LearningPanel objectives={SIM.learningObjectives} />
      </div>
    </SimulationLayout>
  );
}
