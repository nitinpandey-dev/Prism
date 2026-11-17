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
      }}
    >
      {/* ── High-Tech Top Navigation Bar ── */}
      <TopNavigation />

      {/* ── Main Platform Viewport ── */}
      <main style={{ flex: 1, position: "relative", width: "100%", height: "calc(100vh - 52px)", overflow: "hidden" }}>
        {appMode === "story" ? (
          activeActivity === "skating" ? (
            /* ── 1A. SCIENCE ADVENTURE: SKATING WORLD & ADVENTURE HUB ── */
            currentAdventureScreen === "hub" ? (
              <AdventureHub />
            ) : (
              <SkatingWorldView />
            )
          ) : (
            /* ── 1B. EXISTING ACTIVITY: KEPLER-186F OUTPOST THETA (PHY-001) ── */
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

      {/* ── Physics World Activity Selector Modal (Switcher) ── */}
      <ActivitySelectorModal
        isOpen={isActivityModalOpen}
        onClose={() => setActivityModalOpen(false)}
      />
    </div>
  );
}
