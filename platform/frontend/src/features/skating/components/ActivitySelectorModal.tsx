import { useGameStore } from '../../../stores/useGameStore';
import { useSkatingStore } from '../stores/useSkatingStore';
import { Compass, Flame, Sparkles, X, ChevronRight, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ActivitySelectorModal({ isOpen, onClose }: Props) {
  const activeActivity = useGameStore((s) => (s as any).activeActivity || 'outpost');
  const setActiveActivity = useGameStore((s) => (s as any).setActiveActivity);
  const setStage = useSkatingStore((s) => s.setStage);

  if (!isOpen) return null;

  const activities = [
    {
      id: 'outpost',
      code: 'PHY-001',
      title: 'The Last Signal',
      topic: 'Projectile Motion & 3D Kinematics',
      location: 'Kepler-186f Research Outpost Theta',
      icon: '🚀',
      difficulty: 'Beginner → Intermediate',
      desc: 'Explore a futuristic alien outpost, calibrate a pneumatic mortar, and launch an emergency distress beacon across a 120-meter canyon.',
      tags: ['Kinematics', 'Trajectory', 'Ballistics', 'Energy'],
    },
    {
      id: 'skating',
      code: 'PHY-ACT-001',
      title: 'Science Adventure — Skating World',
      topic: 'Explore. Play. Experiment. Discover.',
      location: 'Sunnyvale Outdoor Skate Park & Adventure Hub',
      icon: '⛸️',
      difficulty: 'All Ages (10–15)',
      desc: 'Skate freely across concrete, ice, grass, and ramps with Alex! Experience grip, slipping, and stopping distance through interactive 3D missions.',
      tags: ['Friction & Grip', 'Stopping Distance', 'Slopes & Gravity', 'Surface Resistance'],
    },
  ];

  const handleSelect = (activityId: string) => {
    if (setActiveActivity) {
      setActiveActivity(activityId);
    }
    if (activityId === 'skating') {
      setStage('STAGE_2_WATCH_WONDER');
    }
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.84)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 120,
        padding: 20,
      }}
    >
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.98)',
          border: '2px solid rgba(56, 189, 248, 0.4)',
          borderRadius: 20,
          maxWidth: 720,
          width: '100%',
          padding: '28px 32px',
          color: '#f8fafc',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.7)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.08em' }}>
              STAGE 01 • PHYSICS WORLD ACTIVITIES
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '4px 0 0 0' }}>
              Choose a Story Adventure
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Activity Cards Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
          {activities.map((act) => {
            const isSelected = activeActivity === act.id;
            return (
              <div
                key={act.id}
                onClick={() => handleSelect(act.id)}
                style={{
                  background: isSelected ? 'rgba(2, 132, 199, 0.18)' : 'rgba(15, 23, 42, 0.65)',
                  border: `2px solid ${isSelected ? '#38bdf8' : 'rgba(148, 163, 184, 0.2)'}`,
                  borderRadius: 14,
                  padding: '16px 20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  transition: 'all 0.25s',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.6)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.2)';
                }}
              >
                {/* Icon Circle */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 12,
                    background: isSelected ? 'rgba(56, 189, 248, 0.25)' : 'rgba(51, 65, 85, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                    flexShrink: 0,
                  }}
                >
                  {act.icon}
                </div>

                {/* Details */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: 4,
                        background: 'rgba(56, 189, 248, 0.2)',
                        color: '#38bdf8',
                      }}
                    >
                      {act.code}
                    </span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>{act.title}</h3>
                    {isSelected && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#10b981', fontSize: '0.72rem', fontWeight: 700 }}>
                        <CheckCircle2 size={14} /> Active
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#facc15', fontWeight: 600, marginBottom: 4 }}>
                    {act.topic} • <span style={{ color: '#94a3b8' }}>{act.location}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4, marginBottom: 6 }}>
                    {act.desc}
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {act.tags.map((t, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.66rem',
                          background: 'rgba(51, 65, 85, 0.7)',
                          color: '#94a3b8',
                          padding: '1px 6px',
                          borderRadius: 4,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <ChevronRight size={22} color={isSelected ? '#38bdf8' : '#64748b'} />
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              background: 'rgba(51, 65, 85, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: 8,
              color: '#f8fafc',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
