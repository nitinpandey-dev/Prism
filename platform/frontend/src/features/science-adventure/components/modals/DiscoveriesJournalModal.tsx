import { DISCOVERIES } from '../../types/adventure';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { X, CheckCircle2, Lock, BookOpen, Lightbulb } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function DiscoveriesJournalModal({ isOpen, onClose }: Props) {
  const { unlockedDiscoveryIds } = useAdventureStore();

  if (!isOpen) return null;

  const discoveryList = Object.values(DISCOVERIES);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 80,
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
          maxWidth: 640,
          maxHeight: '85vh',
          background: '#0d1322',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 20,
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            background: 'linear-gradient(135deg, #09203f, #1e3c72)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BookOpen size={20} color="#00d2ff" />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Scientific Discoveries Journal</h3>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                {unlockedDiscoveryIds.length} of {discoveryList.length} Physical Concepts Unlocked
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: 8,
              width: 32,
              height: 32,
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* List */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {discoveryList.map((disc) => {
            const isUnlocked = unlockedDiscoveryIds.includes(disc.id);
            return (
              <div
                key={disc.id}
                style={{
                  background: isUnlocked ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.01)',
                  border: isUnlocked ? `1px solid ${disc.color}40` : '1px dashed rgba(255, 255, 255, 0.1)',
                  borderRadius: 14,
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  opacity: isUnlocked ? 1 : 0.55,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: isUnlocked ? `${disc.color}20` : 'rgba(255, 255, 255, 0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isUnlocked ? disc.color : '#64748b',
                    flexShrink: 0,
                  }}
                >
                  {isUnlocked ? <Lightbulb size={18} /> : <Lock size={16} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '0.98rem', fontWeight: 800, color: isUnlocked ? disc.color : '#94a3b8' }}>
                      {isUnlocked ? disc.conceptName : 'Undiscovered Physical Concept'}
                    </div>
                    {isUnlocked && (
                      <span
                        style={{
                          fontSize: '0.68rem',
                          color: '#4ade80',
                          background: 'rgba(74, 222, 128, 0.12)',
                          padding: '2px 8px',
                          borderRadius: 6,
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <CheckCircle2 size={11} /> Unlocked
                      </span>
                    )}
                  </div>

                  {isUnlocked ? (
                    <>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', marginTop: 4 }}>
                        {disc.headline}
                      </div>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                        {disc.explanation}
                      </p>
                      <div
                        style={{
                          marginTop: 8,
                          fontSize: '0.75rem',
                          color: '#fef08a',
                          background: 'rgba(245, 158, 11, 0.08)',
                          border: '1px solid rgba(245, 158, 11, 0.2)',
                          padding: '6px 10px',
                          borderRadius: 8,
                        }}
                      >
                        <strong>Application: </strong> {disc.funFact}
                      </div>
                    </>
                  ) : (
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                      Complete story missions in the 3D park to experience this phenomenon and unlock the derivation.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
