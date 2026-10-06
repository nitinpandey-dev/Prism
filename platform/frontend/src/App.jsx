import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SimulationsDashboard from "./pages/SimulationsDashboard";

// ── Full-featured dedicated simulation pages ──────────────────────────────────
const SolidStatePage = lazy(() =>
  import("./simulations/chemistry/solid-state/SolidStatePage")
);
const ProjectilePage = lazy(() =>
  import("./simulations/physics/projectile-motion/ProjectilePage")
);
const FunctionExplorerPage = lazy(() =>
  import("./simulations/mathematics/function-explorer/FunctionExplorerPage")
);

// ── Interactive Simulation Suite for all other simulators ─────────────────────
const InteractiveSimRunner = lazy(() =>
  import("./simulations/InteractiveSimRunner")
);

function PageLoader() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
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

export default function App() {
  return (
    <BrowserRouter>
      {/* Ambient background */}
      <div className="prism-bg" />

      <main style={{ minHeight: "100vh" }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Simple Box Plot UI Hub */}
            <Route path="/" element={<SimulationsDashboard />} />

            {/* Redirect legacy routes directly to clean hub */}
            <Route path="/explore" element={<Navigate to="/" replace />} />
            <Route path="/about" element={<Navigate to="/" replace />} />

            {/* Available Simulations */}
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

            {/* All Remaining Interactive Simulators */}
            <Route
              path="/simulations/:simulatorId"
              element={<InteractiveSimRunner />}
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </BrowserRouter>
  );
}
