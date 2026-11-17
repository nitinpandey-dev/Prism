import { useAdventureStore } from '../../stores/useAdventureStore';
import { X, Volume2, VolumeX, Smartphone, Eye, Trash2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: Props) {
  const {
    soundEnabled,
    toggleSound,
    musicEnabled,
    toggleMusic,
    touchControlsActive,
    setTouchControls,
    resetAllProgress,
  } = useAdventureStore();

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
          maxWidth: 480,
          background: 'linear-gradient(145deg, #1e293b, #0f172a)',
          border: '2px solid rgba(56, 189, 248, 0.3)',
          borderRadius: 28,
          boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            background: 'linear-gradient(135deg, #334155, #1e293b)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.5rem' }}>⚙️</span>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900 }}>Settings & Accessibility</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: 34,
              height: 34,
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Options */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Sound FX Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Volume2 size={20} color="#38bdf8" />
              <div>
                <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.95rem' }}>Sound Effects</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Skating strides, brakes, cheers</div>
              </div>
            </div>
            <button
              onClick={toggleSound}
              style={{
                width: 50,
                height: 28,
                borderRadius: 14,
                background: soundEnabled ? '#0284c7' : '#475569',
                border: 'none',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: '#ffffff',
                  position: 'absolute',
                  top: 3,
                  left: soundEnabled ? 25 : 3,
                  transition: 'left 0.2s',
                }}
              />
            </button>
          </div>

          {/* Music Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <VolumeX size={20} color="#a855f7" />
              <div>
                <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.95rem' }}>Park Ambiance Music</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Pleasant background park audio</div>
              </div>
            </div>
            <button
              onClick={toggleMusic}
              style={{
                width: 50,
                height: 28,
                borderRadius: 14,
                background: musicEnabled ? '#a855f7' : '#475569',
                border: 'none',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: '#ffffff',
                  position: 'absolute',
                  top: 3,
                  left: musicEnabled ? 25 : 3,
                  transition: 'left 0.2s',
                }}
              />
            </button>
          </div>

          {/* Mobile Joystick Always Visible */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Smartphone size={20} color="#facc15" />
              <div>
                <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.95rem' }}>Virtual Touch Joystick</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Show on-screen touch controls</div>
              </div>
            </div>
            <button
              onClick={() => setTouchControls(!touchControlsActive)}
              style={{
                width: 50,
                height: 28,
                borderRadius: 14,
                background: touchControlsActive ? '#f59e0b' : '#475569',
                border: 'none',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: '#ffffff',
                  position: 'absolute',
                  top: 3,
                  left: touchControlsActive ? 25 : 3,
                  transition: 'left 0.2s',
                }}
              />
            </button>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />

          {/* Reset Progress */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Trash2 size={20} color="#ef4444" />
              <div>
                <div style={{ fontWeight: 800, color: '#ef4444', fontSize: '0.95rem' }}>Reset Progress</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Clear completed missions & discoveries</div>
              </div>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to reset your Science Adventure progress?')) {
                  resetAllProgress();
                  onClose();
                }
              }}
              style={{
                padding: '6px 14px',
                borderRadius: 12,
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
