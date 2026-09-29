import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";

// ── Pages (eager loaded) ──────────────────────────────────────────────────────
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import AboutPage from "./pages/AboutPage";
import ComingSoonPage from "./pages/ComingSoonPage";

// ── Simulation pages (lazy loaded) ────────────────────────────────────────────
// Each simulation is its own code-split chunk.
// To add a new simulator, add a lazy import here and a Route below.
const SolidStatePage = lazy(() =>
  import("./simulations/chemistry/solid-state/SolidStatePage")
);
const ProjectilePage = lazy(() =>
  import("./simulations/physics/projectile-motion/ProjectilePage")
);
const FunctionExplorerPage = lazy(() =>
  import("./simulations/mathematics/function-explorer/FunctionExplorerPage")
);

// ── Fallback loading state ─────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 64px)",
        flexDirection: "column",
        gap: "var(--sp-4)",
      }}
    >
      <div className="spinner" />
      <p style={{ color: "var(--clr-text-muted)", fontSize: "0.9rem" }}>
        Loading simulation…
      </p>
    </div>
  );
}

// ── 404 Not Found ─────────────────────────────────────────────────────────────
function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "var(--sp-6)",
        textAlign: "center",
        padding: "var(--sp-8)",
        animation: "fadeIn 0.4s ease both",
      }}
    >
      <div style={{ fontSize: "4rem" }}>🌌</div>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "3rem",
          color: "var(--clr-text-primary)",
          letterSpacing: "-0.03em",
        }}
      >
        404
      </h1>
      <p style={{ color: "var(--clr-text-secondary)", maxWidth: 400 }}>
        This page doesn't exist in the PRISM universe. Maybe it's coming soon?
      </p>
      <div style={{ display: "flex", gap: "var(--sp-3)" }}>
        <a href="/" className="btn btn-primary">
          ← Back to Home
        </a>
        <a href="/explore" className="btn btn-secondary">
          Explore Simulations
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Background grid */}
      <div className="prism-bg" />

      <Navbar />

      <main style={{ flex: 1 }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ── Main pages ── */}
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* ── Available simulations ── */}
            <Route
              path="/simulations/solid-state"
              element={<SolidStatePage />}
            />
            <Route
              path="/simulations/projectile-motion"
              element={<ProjectilePage />}
            />
            <Route
              path="/simulations/function-explorer"
              element={<FunctionExplorerPage />}
            />

            {/*
              ── Coming-soon catch-all ──────────────────────────────────────────
              Any /simulations/:id route not matched above will render the
              Coming Soon page, which looks up the simulator from the registry
              and displays its metadata (or a 404-like message if unknown).
            */}
            <Route
              path="/simulations/:simulatorId"
              element={<ComingSoonPage />}
            />

            {/* ── Fallbacks ── */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
    </BrowserRouter>
  );
}
