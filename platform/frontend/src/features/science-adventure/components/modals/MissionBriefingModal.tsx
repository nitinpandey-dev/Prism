import { useAdventureStore } from '../../stores/useAdventureStore';
import { MISSIONS } from '../../types/adventure';
import { Play, ArrowLeft, Lightbulb, Target } from 'lucide-react';

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
          maxWidth: 500,
          background: '#0d1322',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 20,
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.8)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #09203f, #1e3c72)',
            padding: '22px 26px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                letterSpacing: '0.1em',
                color: '#00d2ff',
                textTransform: 'uppercase',
              }}
            >
              MISSION 0{mission.number}
            </div>
            <h2 style={{ margin: '4px 0 0 0', fontSize: '1.35rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
              {mission.title}
            </h2>
          </div>
          <Target size={28} color="#00d2ff" />
        </div>

        {/* Body */}
        <div style={{ padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
              Scenario
            </div>
            <p style={{ margin: '6px 0 0 0', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.55 }}>
              {mission.story}
            </p>
          </div>

          {/* Goal */}
          <div
            style={{
              background: 'rgba(0, 210, 255, 0.06)',
              border: '1px solid rgba(0, 210, 255, 0.25)',
              borderRadius: 12,
              padding: '12px 16px',
            }}
          >
            <div style={{ fontSize: '0.7rem', color: '#00d2ff', fontWeight: 800, textTransform: 'uppercase' }}>
              Objective
            </div>
            <div style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: 700, marginTop: 4 }}>
              {mission.objective}
            </div>
          </div>

          {/* Hint */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <Lightbulb size={16} color="#facc15" style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              Strategy: {mission.hint}
            </span>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
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
              onClick={launchMissionGameplay}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: 10,
                background: '#00d2ff',
                border: 'none',
                color: '#070a13',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Play size={16} fill="#070a13" />
              <span>Start Mission</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
