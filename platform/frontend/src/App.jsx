import React from "react";
import TopNavigation from "./components/layout/TopNavigation";
import GameCanvas from "./game/runtime/GameCanvas";
import GameHUD from "./components/hud/GameHUD";
import LauncherHUD from "./components/hud/LauncherHUD";
import ScienceHUD from "./components/hud/ScienceHUD";
import AriaDialogueHUD from "./components/aria/AriaDialogueHUD";
import MissionCompleteModal from "./components/hud/MissionCompleteModal";
import LabWorkbench from "./components/layout/LabWorkbench";
import SkatingWorldView from "./features/science-adventure/SkatingWorldView";
import AdventureHub from "./features/science-adventure/AdventureHub";
import ActivitySelectorModal from "./features/skating/components/ActivitySelectorModal";
import { useGameStore } from "./stores/useGameStore";
import { useAdventureStore } from "./features/science-adventure/stores/useAdventureStore";
import "./App.css";

export default function App() {
  const { appMode, activeActivity, isActivityModalOpen, setActivityModalOpen } = useGameStore();
  const currentAdventureScreen = useAdventureStore((s) => s.currentScreen);

  // Clean layout controller: Only show the standalone TopNavigation when inside Kepler Outpost or when specifically needed.
  // In the AdventureHub, the single unified Shotgear navigation bar governs the entire view.
  // In 3D Skating, the full-screen immersive view with clean gaming HUD takes over.
  const isHubView = appMode === "story" && activeActivity === "skating" && currentAdventureScreen === "hub";
  const isSkatingGameView = appMode === "story" && activeActivity === "skating" && currentAdventureScreen === "skating-world";

  return (
    <div
      className="prism-root"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        background: "#070a13",
      }}
    >
      {/* ── Top Navigation Bar: Shown only in Kepler Outpost or Lab Workbench ── */}
      {!isHubView && !isSkatingGameView && <TopNavigation />}

      {/* ── Main Platform Viewport ── */}
      <main
        style={{
          flex: 1,
          position: "relative",
          width: "100%",
          height: isHubView || isSkatingGameView ? "100vh" : "calc(100vh - 52px)",
          overflow: "hidden",
        }}
      >
        {appMode === "story" ? (
          activeActivity === "skating" ? (
            /* ── 1A. SCIENCE ADVENTURE: SKATING WORLD & ADVENTURE HUB ── */
            currentAdventureScreen === "hub" ? (
              <AdventureHub />
            ) : (
              <SkatingWorldView />
            )
          ) : (
            /* ── 1B. KEPLER-186F OUTPOST THETA (PHY-001) ── */
            <div style={{ width: "100%", height: "100%", position: "relative" }}>
              <GameCanvas />
              <GameHUD />
              <LauncherHUD />
              <ScienceHUD />
              <AriaDialogueHUD />
              <MissionCompleteModal />
            </div>
          )
        ) : (
          /* ── 2. LAB WORKBENCH: THE 5 INTERACTIVE SIMULATORS ── */
          <LabWorkbench />
        )}
      </main>

      {/* ── Physics World Activity Selector Modal ── */}
      <ActivitySelectorModal
        isOpen={isActivityModalOpen}
        onClose={() => setActivityModalOpen(false)}
      />
    </div>
  );
}
