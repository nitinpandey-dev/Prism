import { Link } from "react-router-dom";
import { SUBJECT_META } from "../../config/simulatorRegistry";
import "./SimulationLayout.css";

/**
 * SimulationLayout
 * Shared wrapper used by every simulation page.
 * Provides: header with breadcrumb, two-column body (controls + visualization).
 */
export default function SimulationLayout({ sim, children, fullWidth = false }) {
  const subjectMeta = SUBJECT_META[sim?.subject] || {};

  return (
    <div className="sim-layout">
      {/* ── Page Header ── */}
      <div className="sim-layout-header">
        <div className="sim-layout-header-inner">
          <span className="sim-layout-icon">{sim?.icon || subjectMeta.icon}</span>
          <div className="sim-layout-info">
            <div className="sim-layout-breadcrumb">
              <Link to="/">Home</Link>
              <span className="sim-layout-breadcrumb-sep">›</span>
              <Link to="/explore">Explore</Link>
              <span className="sim-layout-breadcrumb-sep">›</span>
              <span style={{ color: subjectMeta.color }}>
                {subjectMeta.label || sim?.subject}
              </span>
              <span className="sim-layout-breadcrumb-sep">›</span>
              <span>{sim?.title}</span>
            </div>
            <h1 className="sim-layout-title">{sim?.title}</h1>
            <p className="sim-layout-desc">{sim?.description}</p>
            <div className="sim-layout-badges">
              <span className="badge badge-available">✓ Available</span>
              <span className={`badge badge-${sim?.difficulty}`}>
                {sim?.difficulty}
              </span>
              <span className="badge" style={{
                background: "rgba(99,102,241,0.1)",
                color: "var(--clr-indigo-400)",
                border: "1px solid rgba(99,102,241,0.2)"
              }}>
                {sim?.visualizationType?.toUpperCase()} Visualization
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body (controls + viz) ── */}
      <div className={`sim-layout-body${fullWidth ? " full-width" : ""}`}>
        {children}
      </div>
    </div>
  );
}

/** Sub-components re-exported for convenience */
export function ControlsPanel({ children, title = "Controls" }) {
  return (
    <div className="sim-controls-panel">
      <div className="sim-controls-section">
        <div className="sim-controls-section-title">{title}</div>
        {children}
      </div>
    </div>
  );
}

export function ControlSection({ title, children }) {
  return (
    <div className="sim-controls-section">
      <div className="sim-controls-section-title">{title}</div>
      {children}
    </div>
  );
}

export function VisualizationPanel({ title, actions, children }) {
  return (
    <div className="sim-visualization-panel">
      <div className="sim-viz-header">
        <span className="sim-viz-title">{title}</span>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      <div className="sim-viz-body">{children}</div>
    </div>
  );
}

export function StatCard({ label, value, unit }) {
  return (
    <div className="sim-stat-card">
      <div className="sim-stat-label">{label}</div>
      <div className="sim-stat-value">{value ?? "—"}</div>
      {unit && <div className="sim-stat-unit">{unit}</div>}
    </div>
  );
}

export function StatsRow({ children }) {
  return <div className="sim-stats-row">{children}</div>;
}

export function LearningPanel({ objectives = [], title = "Learning Objectives" }) {
  return (
    <div className="learning-panel">
      <div className="learning-panel-title">📚 {title}</div>
      <ul className="learning-objectives">
        {objectives.map((obj, i) => (
          <li key={i} className="learning-objective">{obj}</li>
        ))}
      </ul>
    </div>
  );
}

export function EquationDisplay({ label, equation }) {
  return (
    <div>
      {label && <div className="equation-label">{label}</div>}
      <div className="equation-display">{equation}</div>
    </div>
  );
}

export function ParameterSlider({ id, label, value, min, max, step = 1, unit, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label className="label" htmlFor={id} style={{ marginBottom: 0 }}>{label}</label>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.85rem",
          color: "var(--clr-cyan-400)",
          fontWeight: 600
        }}>
          {value}{unit}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.68rem", color: "var(--clr-text-muted)" }}>{min}{unit}</span>
        <span style={{ fontSize: "0.68rem", color: "var(--clr-text-muted)" }}>{max}{unit}</span>
      </div>
    </div>
  );
}

export function SimLoadingState({ message = "Running simulation…" }) {
  return (
    <div className="sim-loading-state">
      <div className="spinner" />
      <p style={{ color: "var(--clr-text-secondary)", fontSize: "0.9rem" }}>{message}</p>
    </div>
  );
}

export function SimErrorState({ error, onRetry }) {
  return (
    <div className="sim-error-state">
      <span className="icon">⚠️</span>
      <h3>Simulation Error</h3>
      <p>{error}</p>
      {onRetry && (
        <button className="btn btn-secondary btn-sm" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}
