import { useAdventureStore } from '../../stores/useAdventureStore';
import { MISSIONS } from '../../types/adventure';
import { RotateCcw, ArrowLeft } from 'lucide-react';

export default function MissionFailedModal() {
  const { missionState, activeMissionId, retryMission, abandonMission } = useAdventureStore();

  if (missionState !== 'failed' || !activeMissionId) return null;

  const mission = MISSIONS.find((m) => m.id === activeMissionId);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 460,
          background: 'linear-gradient(145deg, #1e293b, #0f172a)',
          border: '2px solid rgba(244, 63, 94, 0.4)',
          borderRadius: 28,
          boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(244, 63, 94, 0.2)',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 16,
          animation: 'fadeIn 0.25s ease-out',
        }}
      >
        <div style={{ fontSize: '3.5rem' }}>⛸️💨</div>

        <div>
          <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#f8fafc' }}>
            Whoops! Slippery Move!
          </h3>
          <p style={{ margin: '8px 0 0 0', color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.5 }}>
            {activeMissionId === 'mission-2'
              ? 'You bumped into the ball! Try applying your brakes a little earlier to stop inside the safe green zone.'
              : activeMissionId === 'mission-1'
              ? 'The ice was too slick for that speed! Try coasting without sudden sharp turns.'
              : 'Every try teaches your muscles how grip and balance work. Let’s try that again!'}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 12, width: '100%', marginTop: 8 }}>
          <button
            onClick={abandonMission}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: 16,
              background: 'rgba(51, 65, 85, 0.6)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#cbd5e1',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <ArrowLeft size={16} />
            <span>Free Play</span>
          </button>

          <button
            onClick={retryMission}
            style={{
              flex: 2,
              padding: '14px',
              borderRadius: 16,
              background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
              border: 'none',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 6px 20px rgba(2, 132, 199, 0.45)',
            }}
          >
            <RotateCcw size={18} />
            <span>Try Again!</span>
          </button>
        </div>
      </div>
    </div>
  );
}
