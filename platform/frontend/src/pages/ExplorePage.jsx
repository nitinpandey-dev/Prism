import { useState, useMemo } from "react";
import SimulatorCard from "../components/simulations/SimulatorCard";
import { filterSimulators, SUBJECT_META, SIMULATORS } from "../config/simulatorRegistry";
import "./ExplorePage.css";

const SUBJECTS = ["all", ...Object.keys(SUBJECT_META)];
const DIFFICULTIES = ["all", "beginner", "intermediate", "advanced"];
const STATUSES = ["all", "available", "coming_soon"];

function getSubjectCounts(sims) {
  const counts = { all: sims.length };
  for (const sim of sims) {
    counts[sim.subject] = (counts[sim.subject] || 0) + 1;
  }
  return counts;
}

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(
    () =>
      filterSimulators({
        subject: subject !== "all" ? subject : undefined,
        difficulty: difficulty !== "all" ? difficulty : undefined,
        status: status !== "all" ? status : undefined,
        search: search.trim() || undefined,
      }),
    [search, subject, difficulty, status]
  );

  const subjectCounts = useMemo(() => getSubjectCounts(SIMULATORS), []);

  const clearFilters = () => {
    setSearch("");
    setSubject("all");
    setDifficulty("all");
    setStatus("all");
  };

  const hasActiveFilters =
    search || subject !== "all" || difficulty !== "all" || status !== "all";

  return (
    <div className="explore-page">
      <div className="container">
        {/* ── Hero ── */}
        <div className="explore-hero">
          <div className="section-label">Simulation Library</div>
          <h1>
            Explore <span className="gradient-text">STEM Simulations</span>
          </h1>
          <p>
            Discover interactive simulations across Chemistry, Physics, Mathematics, Biology,
            and Computer Science. Learn by doing — not just by reading.
          </p>
        </div>

        {/* ── Filters ── */}
        <div className="explore-filters">
          {/* Search */}
          <div className="explore-search-row">
            <input
              id="sim-search"
              className="explore-search-input"
              placeholder="🔍  Search simulations by name, topic, or keyword…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {hasActiveFilters && (
              <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
                Clear filters
              </button>
            )}
          </div>

          {/* Subject Tabs */}
          <div className="subject-tabs">
            {SUBJECTS.map((s) => {
              const meta = SUBJECT_META[s];
              const count = subjectCounts[s] || 0;
              const isActive = subject === s;
              return (
                <button
                  key={s}
                  id={`subject-tab-${s}`}
                  className={`subject-tab ${isActive ? "active" : ""}`}
                  style={isActive && meta ? { background: meta.gradient } : {}}
                  onClick={() => setSubject(s)}
                >
                  {meta?.icon || "🌐"}{" "}
                  {meta?.label || "All Subjects"}
                  <span className="subject-tab-count">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Difficulty & Status filters */}
          <div className="explore-filter-row">
            <div className="filter-group">
              <span className="filter-label">Difficulty:</span>
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  id={`filter-diff-${d}`}
                  className={`filter-chip ${difficulty === d ? "active" : ""}`}
                  onClick={() => setDifficulty(d)}
                >
                  {d === "all" ? "All" : d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>

            <div className="filter-group">
              <span className="filter-label">Status:</span>
              {STATUSES.map((s) => (
                <button
                  key={s}
                  id={`filter-status-${s}`}
                  className={`filter-chip ${status === s ? "active" : ""}`}
                  onClick={() => setStatus(s)}
                >
                  {s === "all" ? "All" : s === "available" ? "✓ Available" : "⏳ Coming Soon"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Results ── */}
        <div className="explore-results-header">
          <div className="explore-results-count">
            Showing <strong style={{ color: "var(--clr-text-primary)" }}>{filtered.length}</strong>{" "}
            simulation{filtered.length !== 1 ? "s" : ""}
            {hasActiveFilters && " (filtered)"}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="explore-empty">
            <span className="icon">🔭</span>
            <h3>No simulations found</h3>
            <p>
              No simulations match your current filters. Try broadening your search
              or selecting a different subject.
            </p>
            <button className="btn btn-secondary" onClick={clearFilters}>
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="sim-grid">
            {filtered.map((sim, i) => (
              <SimulatorCard
                key={sim.id}
                sim={sim}
                style={{ animationDelay: `${i * 40}ms` }}
              />
            ))}
          </div>
        )}

        <div style={{ height: "var(--sp-16)" }} />
      </div>
    </div>
  );
}
