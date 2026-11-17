import { ACHIEVEMENTS } from '../../types/adventure';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { X, Award, CheckCircle2, Lock } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AchievementsModal({ isOpen, onClose }: Props) {
  const { unlockedAchievementIds, playerXP } = useAdventureStore();

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 80,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 620,
          maxHeight: '85vh',
          background: 'linear-gradient(145deg, #1e293b, #0f172a)',
          border: '2px solid rgba(245, 158, 11, 0.4)',
          borderRadius: 28,
          boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.8rem' }}>🏆</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900 }}>Trophy Cabinet & Badges</h3>
              <div style={{ fontSize: '0.75rem', color: '#fef08a', fontWeight: 700 }}>
                {unlockedAchievementIds.length} of {ACHIEVEMENTS.length} Badges Earned • {playerXP} Adventure XP
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: 36,
              height: 36,
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Badges List */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = unlockedAchievementIds.includes(ach.id);
            return (
              <div
                key={ach.id}
                style={{
                  background: isUnlocked ? 'rgba(30, 41, 59, 0.8)' : 'rgba(15, 23, 42, 0.5)',
                  border: isUnlocked ? '2px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 20,
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  opacity: isUnlocked ? 1 : 0.6,
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 16,
                    background: isUnlocked ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                    flexShrink: 0,
                  }}
                >
                  {isUnlocked ? ach.icon : <Lock size={20} color="#94a3b8" />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 900, color: isUnlocked ? '#facc15' : '#94a3b8' }}>
                      {ach.title}
                    </div>
                    {isUnlocked && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          color: '#facc15',
                          background: 'rgba(245, 158, 11, 0.15)',
                          padding: '2px 8px',
                          borderRadius: 6,
                          fontWeight: 800,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <CheckCircle2 size={12} /> Unlocked
                      </span>
                    )}
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#cbd5e1' }}>{ach.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
