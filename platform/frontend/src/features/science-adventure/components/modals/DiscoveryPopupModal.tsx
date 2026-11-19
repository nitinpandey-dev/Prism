import { useAdventureStore } from '../../stores/useAdventureStore';
import { Sparkles, CheckCircle2, ArrowRight, Lightbulb } from 'lucide-react';

export default function DiscoveryPopupModal() {
  const { activeDiscoveryModal, closeDiscoveryModal } = useAdventureStore();

  if (!activeDiscoveryModal) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 60,
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
          maxWidth: 520,
          background: '#0d1322',
          border: '1px solid rgba(0, 210, 255, 0.4)',
          borderRadius: 20,
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.8), 0 0 32px rgba(0, 210, 255, 0.2)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Clean Header */}
        <div
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #09203f, #1e3c72)',
            padding: '22px 24px',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              borderRadius: 20,
              padding: '4px 12px',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <CheckCircle2 size={13} color="#00d2ff" />
            <span>MISSION COMPLETE</span>
          </div>

          <h2 style={{ margin: '8px 0 0 0', fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
            Scientific Discovery Unlocked
          </h2>
        </div>

        {/* Discovery Body */}
        <div
          style={{
            padding: '24px 28px',
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
              background: 'rgba(0, 210, 255, 0.08)',
              border: `1px solid ${activeDiscoveryModal.color}60`,
              borderRadius: 14,
              padding: '10px 20px',
              width: '100%',
              boxSizing: 'border-box',
              textAlign: 'left',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                PHYSICAL PRINCIPLE
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: activeDiscoveryModal.color }}>
                {activeDiscoveryModal.conceptName}
              </div>
            </div>
          </div>

          {/* Narrative Explanation */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 14, padding: '16px', width: '100%', boxSizing: 'border-box' }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '0.98rem', color: '#f8fafc', fontWeight: 800 }}>
              {activeDiscoveryModal.headline}
            </h4>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.55, textAlign: 'left' }}>
              {activeDiscoveryModal.explanation}
            </p>
          </div>

          {/* Real World Fact */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              textAlign: 'left',
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: 12,
              padding: '12px 14px',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <Lightbulb size={18} color="#facc15" style={{ flexShrink: 0, marginTop: 1 }} />
            <div style={{ fontSize: '0.8rem', color: '#fef08a', lineHeight: 1.45 }}>
              <strong>Real-World Application: </strong> {activeDiscoveryModal.funFact}
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={closeDiscoveryModal}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 12,
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
              marginTop: 4,
            }}
          >
            <span>Save to Discoveries Journal (+150 XP)</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
