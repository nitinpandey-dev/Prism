import { useParams, Link } from "react-router-dom";
import { getById, SUBJECT_META } from "../config/simulatorRegistry";

export default function ComingSoonPage() {
  const { simulatorId } = useParams();
  const sim = getById(simulatorId);
  const subjectMeta = sim ? SUBJECT_META[sim.subject] : null;

  return (
    <div style={{
      minHeight: "calc(100vh - 64px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "var(--sp-8)",
      animation: "fadeIn 0.4s ease both"
    }}>
      <div style={{
        maxWidth: "560px",
        width: "100%",
        background: "var(--clr-bg-card)",
        border: "1px solid var(--clr-border)",
        borderRadius: "var(--radius-xl)",
        padding: "var(--sp-10)",
        textAlign: "center",
        backdropFilter: "blur(16px)",
      }}>
        {/* Icon */}
        <div style={{ fontSize: "4rem", marginBottom: "var(--sp-5)" }}>
          {sim?.icon || "🔭"}
        </div>

        {/* Subject */}
        {subjectMeta && (
          <div style={{
            display: "inline-block",
            padding: "3px 12px",
            borderRadius: "var(--radius-full)",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: subjectMeta.color,
            background: `${subjectMeta.color}18`,
            border: `1px solid ${subjectMeta.color}30`,
            marginBottom: "var(--sp-4)"
          }}>
            {subjectMeta.label}
          </div>
        )}

        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.8rem",
          fontWeight: 800,
          color: "var(--clr-text-primary)",
          marginBottom: "var(--sp-3)",
          letterSpacing: "-0.02em"
        }}>
          {sim?.title || "Simulator Not Found"}
        </h1>

        <p style={{ color: "var(--clr-text-secondary)", marginBottom: "var(--sp-6)", lineHeight: 1.7 }}>
          {sim
            ? `${sim.description} This simulation is currently in development and will be available soon.`
            : "This simulator doesn't exist in the registry."}
        </p>

        {/* Learning objectives preview */}
        {sim?.learningObjectives?.length > 0 && (
          <div style={{
            background: "var(--clr-bg-elevated)",
            border: "1px solid var(--clr-border)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--sp-4)",
            marginBottom: "var(--sp-6)",
            textAlign: "left"
          }}>
            <div style={{
              fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", color: "var(--clr-text-muted)", marginBottom: "var(--sp-3)"
            }}>
              What you'll learn
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
              {sim.learningObjectives.slice(0, 3).map((obj, i) => (
                <li key={i} style={{
                  fontSize: "0.82rem", color: "var(--clr-text-secondary)",
                  display: "flex", alignItems: "flex-start", gap: "var(--sp-2)"
                }}>
                  <span style={{ color: "var(--clr-indigo-400)", flexShrink: 0 }}>→</span>
                  {obj}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Status badge */}
        <div style={{ marginBottom: "var(--sp-6)" }}>
          <span className="badge badge-coming-soon" style={{ fontSize: "0.8rem", padding: "6px 16px" }}>
            ⏳ Coming Soon
          </span>
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: "var(--sp-3)", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/explore" className="btn btn-primary" id="back-to-explore-btn">
            ← Back to Explore
          </Link>
          <Link to="/" className="btn btn-secondary" id="back-to-home-btn">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
