import { DISCOVERIES } from '../../types/adventure';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { X, Sparkles, CheckCircle2, Lock } from 'lucide-react';

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
          maxWidth: 680,
          maxHeight: '85vh',
          background: 'linear-gradient(145deg, #1e293b, #0f172a)',
          border: '2px solid rgba(56, 189, 248, 0.4)',
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
            background: 'linear-gradient(135deg, #0284c7, #4f46e5)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.8rem' }}>📖</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900 }}>Science Discoveries Journal</h3>
              <div style={{ fontSize: '0.75rem', color: '#facc15', fontWeight: 700 }}>
                {unlockedDiscoveryIds.length} of {discoveryList.length} Concepts Discovered Through Play
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

        {/* Scrollable List */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {discoveryList.map((disc) => {
            const isUnlocked = unlockedDiscoveryIds.includes(disc.id);
            return (
              <div
                key={disc.id}
                style={{
                  background: isUnlocked ? 'rgba(30, 41, 59, 0.8)' : 'rgba(15, 23, 42, 0.6)',
                  border: isUnlocked ? `2px solid ${disc.color}` : '1px dashed rgba(255,255,255,0.15)',
                  borderRadius: 20,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 16,
                  opacity: isUnlocked ? 1 : 0.6,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background: isUnlocked ? `${disc.color}25` : 'rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                    flexShrink: 0,
                  }}
                >
                  {isUnlocked ? disc.icon : <Lock size={22} color="#94a3b8" />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: 900, color: isUnlocked ? disc.color : '#94a3b8' }}>
                      {isUnlocked ? disc.conceptName : 'Undiscovered Secret'}
                    </div>
                    {isUnlocked && (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          color: '#4ade80',
                          background: 'rgba(74, 222, 128, 0.15)',
                          padding: '2px 8px',
                          borderRadius: 6,
                          fontWeight: 800,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <CheckCircle2 size={12} /> Discovered
                      </span>
                    )}
                  </div>

                  {isUnlocked ? (
                    <>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginTop: 4 }}>
                        {disc.headline}
                      </div>
                      <p style={{ margin: '6px 0 0 0', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                        {disc.explanation}
                      </p>
                      <div
                        style={{
                          marginTop: 8,
                          fontSize: '0.75rem',
                          color: '#fef08a',
                          background: 'rgba(250, 204, 21, 0.1)',
                          padding: '6px 12px',
                          borderRadius: 8,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <Sparkles size={14} color="#facc15" />
                        <span>{disc.funFact}</span>
                      </div>
                    </>
                  ) : (
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                      Complete missions in the park to experience this natural phenomenon and reveal its secret!
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
