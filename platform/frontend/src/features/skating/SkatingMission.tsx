import SkatingCanvas from './SkatingCanvas';
import SkatingHUD from './components/SkatingHUD';
import SkatingControlsHUD from './components/SkatingControlsHUD';
import SkatingTimelineHUD from './components/SkatingTimelineHUD';
import SkatingResultsModal from './components/SkatingResultsModal';
import SkatingScienceHUD from './components/SkatingScienceHUD';
import SkatingMissionCompleteModal from './components/SkatingMissionCompleteModal';
import AriaDialogueHUD from '../../components/aria/AriaDialogueHUD';

export default function SkatingMission() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* ── 3D WebGL Skating Canvas ── */}
      <SkatingCanvas />

      {/* ── HUD & Learning Stages ── */}
      <SkatingHUD />
      <SkatingControlsHUD />
      <SkatingTimelineHUD />
      <SkatingScienceHUD />
      <SkatingResultsModal />
      <SkatingMissionCompleteModal />
      <AriaDialogueHUD />
    </div>
  );
}
