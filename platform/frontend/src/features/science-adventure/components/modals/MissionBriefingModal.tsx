import { useAdventureStore } from '../../stores/useAdventureStore';
import { MISSIONS } from '../../types/adventure';
import { Play, ArrowLeft, Lightbulb } from 'lucide-react';

export default function MissionBriefingModal() {
  const { activeMissionId, missionState, launchMissionGameplay, abandonMission } = useAdventureStore();

  if (missionState !== 'briefing' || !activeMissionId) return null;

  const mission = MISSIONS.find((m) => m.id === activeMissionId);
  if (!mission) return null;

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
          maxWidth: 520,
          background: 'linear-gradient(145deg, #1e293b, #0f172a)',
          border: '2px solid rgba(56, 189, 248, 0.4)',
          borderRadius: 28,
          boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(2, 132, 199, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeIn 0.25s ease-out',
        }}
      >
        {/* Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0284c7, #6366f1)',
            padding: '24px 28px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 900,
                letterSpacing: '0.1em',
                color: '#facc15',
                textTransform: 'uppercase',
              }}
            >
              MISSION {mission.number}
            </div>
            <h2 style={{ margin: '4px 0 0 0', fontSize: '1.4rem', fontWeight: 900 }}>{mission.title}</h2>
          </div>
          <div style={{ fontSize: '2.5rem' }}>{mission.thumbnail}</div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Story Scenario */}
          <div>
            <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase' }}>
              The Scenario
            </div>
            <p style={{ margin: '6px 0 0 0', color: '#f8fafc', fontSize: '0.95rem', lineHeight: 1.5 }}>
              {mission.story}
            </p>
          </div>

          {/* Objective Box */}
          <div
            style={{
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: 16,
              padding: '12px 18px',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: '#facc15', fontWeight: 800, textTransform: 'uppercase' }}>
              🎯 Your Goal
            </div>
            <div style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginTop: 4 }}>
              {mission.objective}
            </div>
          </div>

          {/* Friendly Hint */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <Lightbulb size={18} color="#facc15" style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>
              Tip: {mission.hint}
            </span>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
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
              onClick={launchMissionGameplay}
              style={{
                flex: 2,
                padding: '14px',
                borderRadius: 16,
                background: 'linear-gradient(135deg, #0284c7, #2563eb)',
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
              <Play size={18} fill="#ffffff" />
              <span>Let's Skate!</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
