import AdventureCanvas from './components/3d/AdventureCanvas';
import AdventureGameHUD from './components/hud/AdventureGameHUD';
import MissionBriefingModal from './components/modals/MissionBriefingModal';
import MissionFailedModal from './components/modals/MissionFailedModal';
import DiscoveryPopupModal from './components/modals/DiscoveryPopupModal';

export default function SkatingWorldView() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* 3D Scene */}
      <AdventureCanvas />

      {/* Child-Friendly HUD */}
      <AdventureGameHUD />

      {/* Modals & Popups */}
      <MissionBriefingModal />
      <MissionFailedModal />
      <DiscoveryPopupModal />
    </div>
  );
}
