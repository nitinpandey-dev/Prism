import { useGameStore } from '../../stores/useGameStore';
import { usePhysicsStore } from '../../stores/usePhysicsStore';
import { Compass, FlaskConical, GraduationCap, Volume2, VolumeX, Sparkles } from 'lucide-react';

export default function TopNavigation() {
  const {
    appMode,
    setAppMode,
    activeActivity,
    setActivityModalOpen,
    learningMode,
    setLearningMode,
    isSoundEnabled,
    toggleSound,
  } = useGameStore();
  const recomputeTrajectory = usePhysicsStore((s) => s.recomputeTrajectory);

  const handleLearningModeToggle = () => {
    const nextMode = learningMode === 'school' ? 'university' : 'school';
    setLearningMode(nextMode);
    recomputeTrajectory(nextMode);
  };

  return (
    <header
      style={{
        height: 52,
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        color: '#f8fafc',
        zIndex: 60,
        position: 'relative',
        userSelect: 'none',
      }}
    >
      {/* ── Brand Logo ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: 'linear-gradient(135deg, #0284c7, #6366f1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.9rem',
            color: '#ffffff',
            boxShadow: '0 0 10px rgba(2, 132, 199, 0.5)',
          }}
        >
          P
        </div>
        <div>
          <span style={{ fontWeight: 800, letterSpacing: '0.08em', fontSize: '1.05rem', color: '#f8fafc' }}>
            PRISM
          </span>
          <span
            style={{
              fontSize: '0.65rem',
              color: '#38bdf8',
              marginLeft: 8,
              padding: '1px 6px',
              borderRadius: 4,
              background: 'rgba(56, 189, 248, 0.15)',
              fontWeight: 700,
            }}
          >
            PHYSICS WORLD
          </span>

          {/* Activity Switcher Pill */}
          <button
            onClick={() => setActivityModalOpen(true)}
            style={{
              background: 'rgba(51, 65, 85, 0.7)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: 14,
              padding: '2px 10px',
              marginLeft: 10,
              color: '#f8fafc',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              transition: 'all 0.2s',
            }}
            title="Click to Switch Physics Story Activities"
          >
            <span>{activeActivity === 'skating' ? 'Science Adventure' : 'PHY-001: The Last Signal'}</span>
            <span style={{ color: '#38bdf8', fontSize: '0.65rem' }}>Change</span>
          </button>
        </div>
      </div>

      {/* ── Mode Switcher: Story Mode (3D) vs Lab Workbench ── */}
      <div
        style={{
          display: 'flex',
          background: 'rgba(30, 41, 59, 0.8)',
          padding: 3,
          borderRadius: 8,
          border: '1px solid rgba(148, 163, 184, 0.15)',
        }}
      >
        <button
          onClick={() => setAppMode('story')}
          style={{
            padding: '5px 14px',
            border: 'none',
            borderRadius: 6,
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: appMode === 'story' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'transparent',
            color: appMode === 'story' ? '#ffffff' : '#94a3b8',
            transition: 'all 0.2s',
          }}
        >
          <Compass size={14} />
          <span>Story Mode (3D)</span>
        </button>

        <button
          onClick={() => setAppMode('lab')}
          style={{
            padding: '5px 14px',
            border: 'none',
            borderRadius: 6,
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: appMode === 'lab' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'transparent',
            color: appMode === 'lab' ? '#ffffff' : '#94a3b8',
            transition: 'all 0.2s',
          }}
        >
          <FlaskConical size={14} />
          <span>Lab Workbench</span>
        </button>
      </div>

      {/* ── Right Controls ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* School vs University Mode Toggle */}
        <button
          onClick={handleLearningModeToggle}
          style={{
            background:
              learningMode === 'school'
                ? 'rgba(56, 189, 248, 0.15)'
                : 'rgba(192, 132, 252, 0.15)',
            border: `1px solid ${learningMode === 'school' ? '#0284c7' : '#9333ea'}`,
            color: learningMode === 'school' ? '#38bdf8' : '#c084fc',
            borderRadius: 20,
            padding: '4px 12px',
            fontSize: '0.74rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.2s',
          }}
          title="Click to toggle School vs University mode"
        >
          <GraduationCap size={14} />
          <span>{learningMode === 'school' ? 'School Mode (Ideal)' : 'University (Drag RK4)'}</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          style={{
            background: 'transparent',
            border: 'none',
            color: isSoundEnabled ? '#94a3b8' : '#64748b',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
          }}
          title={isSoundEnabled ? 'Sound Enabled' : 'Sound Muted'}
        >
          {isSoundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>
    </header>
  );
}

