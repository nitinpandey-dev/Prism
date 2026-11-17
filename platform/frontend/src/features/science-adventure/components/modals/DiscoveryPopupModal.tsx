import { useAdventureStore } from '../../stores/useAdventureStore';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function DiscoveryPopupModal() {
  const { activeDiscoveryModal, closeDiscoveryModal } = useAdventureStore();

  if (!activeDiscoveryModal) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 60,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 540,
          background: 'linear-gradient(145deg, #1e293b, #0f172a)',
          border: '3px solid #38bdf8',
          borderRadius: 32,
          boxShadow: '0 25px 60px rgba(0,0,0,0.7), 0 0 50px rgba(56, 189, 248, 0.35)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          animation: 'popIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      >
        {/* Celebration Top Banner */}
        <div
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #0284c7, #8b5cf6)',
            padding: '24px 20px',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {/* Confetti Emojis */}
          <div style={{ position: 'absolute', left: 24, top: 20, fontSize: '1.6rem' }}>🎉</div>
          <div style={{ position: 'absolute', right: 24, top: 20, fontSize: '1.6rem' }}>✨</div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 20,
              padding: '4px 14px',
              fontSize: '0.75rem',
              fontWeight: 900,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <CheckCircle2 size={14} color="#facc15" />
            <span>MISSION COMPLETE!</span>
          </div>

          <h2 style={{ margin: '8px 0 0 0', fontSize: '1.6rem', fontWeight: 900 }}>
            You Discovered Something! 💡
          </h2>
        </div>

        {/* Discovery Body */}
        <div
          style={{
            padding: '28px 32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {/* Concept Reveal Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'rgba(56, 189, 248, 0.1)',
              border: `2px solid ${activeDiscoveryModal.color}`,
              borderRadius: 20,
              padding: '10px 22px',
            }}
          >
            <span style={{ fontSize: '2rem' }}>{activeDiscoveryModal.icon}</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
                Science Discovery Unlocked
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: activeDiscoveryModal.color }}>
                {activeDiscoveryModal.conceptName}
              </div>
            </div>
          </div>

          {/* Child-Friendly Narrative Explanation */}
          <div style={{ background: 'rgba(30, 41, 59, 0.6)', borderRadius: 20, padding: '16px 20px', width: '100%' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', color: '#f8fafc', fontWeight: 800 }}>
              {activeDiscoveryModal.headline}
            </h4>
            <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.92rem', lineHeight: 1.6, textAlign: 'left' }}>
              {activeDiscoveryModal.explanation}
            </p>
          </div>

          {/* Real World Fun Fact */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              textAlign: 'left',
              background: 'rgba(250, 204, 21, 0.1)',
              border: '1px solid rgba(250, 204, 21, 0.3)',
              borderRadius: 16,
              padding: '12px 16px',
              width: '100%',
            }}
          >
            <Sparkles size={20} color="#facc15" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: '0.85rem', color: '#fef08a', lineHeight: 1.4 }}>
              <strong>Did You Know? </strong> {activeDiscoveryModal.funFact}
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={closeDiscoveryModal}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: 20,
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              border: 'none',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '1.05rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              boxShadow: '0 6px 25px rgba(2, 132, 199, 0.5)',
              marginTop: 6,
            }}
          >
            <span>Add to My Discoveries (+150 XP)</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
