import { Link } from "react-router-dom";
import { SUBJECT_META } from "../../config/simulatorRegistry";
import "./SimulatorCard.css";

const DIFFICULTY_LABELS = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function SimulatorCard({ sim, style }) {
  const subjectMeta = SUBJECT_META[sim.subject] || {};
  const isAvailable = sim.status === "available";

  const CardContent = (
    <div className={`sim-card ${!isAvailable ? "coming-soon" : ""}`} style={style}>
      {/* ── Header ── */}
      <div className="sim-card-header">
        <div
          className="sim-card-header-bg"
          style={{ background: sim.thumbnailColor || subjectMeta.gradient }}
        />
        <div className="sim-card-header-overlay" />
        <span className="sim-card-icon">{sim.icon || subjectMeta.icon}</span>
      </div>

      {/* ── Body ── */}
      <div className="sim-card-body">
        <div className="sim-card-meta">
          <span
            className="sim-card-subject"
            style={{ color: subjectMeta.color }}
          >
            {subjectMeta.label || sim.subject}
          </span>
          <span className={`badge badge-${isAvailable ? "available" : "coming-soon"}`}>
            {isAvailable ? "✓ Available" : "Coming Soon"}
          </span>
        </div>

        <h3 className="sim-card-title">{sim.title}</h3>
        <p className="sim-card-desc">{sim.description}</p>

        <div className="sim-card-footer">
          <div className="sim-card-tags">
            <span className={`badge badge-${sim.difficulty}`}>
              {DIFFICULTY_LABELS[sim.difficulty]}
            </span>
          </div>
          <span className="sim-card-action">
            {isAvailable ? (
              <>Launch →</>
            ) : (
              <>Planned</>
            )}
          </span>
        </div>
      </div>
    </div>
  );

  if (isAvailable) {
    return <Link to={sim.route} style={{ textDecoration: "none" }}>{CardContent}</Link>;
  }
  return CardContent;
}
