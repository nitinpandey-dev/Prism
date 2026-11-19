import { useAdventureStore } from '../../stores/useAdventureStore';
import { MISSIONS } from '../../types/adventure';
import { RotateCcw, ArrowLeft, AlertCircle } from 'lucide-react';

export default function MissionFailedModal() {
  const { missionState, activeMissionId, retryMission, abandonMission } = useAdventureStore();

  if (missionState !== 'failed' || !activeMissionId) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        background: 'rgba(7, 10, 19, 0.88)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          background: '#0d1322',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          borderRadius: 20,
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.8)',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 16,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'rgba(244, 63, 94, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AlertCircle size={24} color="#f43f5e" />
        </div>

        <div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
            Attempt Incomplete
          </h3>
          <p style={{ margin: '8px 0 0 0', color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.55 }}>
            {activeMissionId === 'mission-2'
              ? 'You reached the ball before coming to a complete stop. Apply your brakes earlier to stop inside the safe green zone.'
              : activeMissionId === 'mission-1'
              ? 'The ice reduced your steering grip at speed. Try coasting through the ice without aggressive turns.'
              : 'Kinematics is learned through iteration. Adjust your velocity and braking timing and try again.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 10, width: '100%', marginTop: 8 }}>
          <button
            onClick={abandonMission}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#cbd5e1',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <ArrowLeft size={15} />
            <span>Free Play</span>
          </button>

          <button
            onClick={retryMission}
            style={{
              flex: 2,
              padding: '12px',
              borderRadius: 10,
              background: '#00d2ff',
              border: 'none',
              color: '#070a13',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <RotateCcw size={15} />
            <span>Retry Attempt</span>
          </button>
        </div>
      </div>
    </div>
  );
}
