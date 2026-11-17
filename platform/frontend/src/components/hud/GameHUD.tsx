import { useGameStore } from '../../stores/useGameStore';
import { useMissionStore } from '../../stores/useMissionStore';
import { useAriaStore } from '../../stores/useAriaStore';
import { Compass, MessageSquare, Terminal } from 'lucide-react';

export default function GameHUD() {
  const { player, activeInteractable, isConsoleOpen, openConsole } = useGameStore();
  const { title, missionId, objectives, stage } = useMissionStore();
  const { toggleOpen, unreadCount, currentMood } = useAriaStore();

  const currentObj = objectives.find((o) => o.isCurrent) || objectives[0];

  return (
    <div className="prism-game-hud" style={{ pointerEvents: 'none' }}>
      {/* ── Top Left: Mission Objective Card ── */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: 10,
          padding: '12px 18px',
          color: '#f8fafc',
          maxWidth: 380,
          pointerEvents: 'auto',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              padding: '2px 8px',
              borderRadius: 4,
              background: 'rgba(56, 189, 248, 0.2)',
              color: '#38bdf8',
            }}
          >
            {missionId}
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' }}>
            {title}
          </span>
        </div>
        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc', marginBottom: 2 }}>
          {currentObj?.title}
        </div>
        <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
          {currentObj?.description}
        </div>
      </div>

      {/* ── Top Right: Outpost Telemetry & Coordinates ── */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: 10,
          padding: '10px 16px',
          color: '#94a3b8',
          fontSize: '0.78rem',
          fontFamily: 'monospace',
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#38bdf8' }}>
          <Compass size={14} />
          <span>KEPLER-186f • OUTPOST THETA</span>
        </div>
        <div>
          POS: X={player.position[0].toFixed(1)} Y={player.position[1].toFixed(1)} Z={player.position[2].toFixed(1)}
        </div>
        <div>GRAVITY: 9.81 m/s² (Kepler Local)</div>
      </div>

      {/* ── Bottom Center: Proximity [E] Interaction Prompt ── */}
      {activeInteractable && !isConsoleOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'auto',
            animation: 'pulse 1.8s infinite',
          }}
        >
          <button
            onClick={() => openConsole(activeInteractable)}
            style={{
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              color: '#ffffff',
              border: '1px solid #38bdf8',
              borderRadius: 30,
              padding: '12px 28px',
              fontSize: '0.92rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              boxShadow: '0 0 24px rgba(2, 132, 199, 0.6)',
            }}
          >
            <Terminal size={18} />
            <span>[E] {activeInteractable.prompt}</span>
          </button>
        </div>
      )}

      {/* ── Bottom Left: Navigation Keyboard Hints ── */}
      {!isConsoleOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(8px)',
            borderRadius: 8,
            padding: '8px 14px',
            color: '#64748b',
            fontSize: '0.74rem',
            display: 'flex',
            gap: 12,
          }}
        >
          <span><strong style={{ color: '#94a3b8' }}>WASD / Arrows:</strong> Move</span>
          <span><strong style={{ color: '#94a3b8' }}>Shift:</strong> Sprint</span>
          <span><strong style={{ color: '#94a3b8' }}>Mouse Drag:</strong> Orbit Look</span>
        </div>
      )}

      {/* ── Bottom Right: ARIA Companion Floating Button ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          pointerEvents: 'auto',
        }}
      >
        <button
          onClick={toggleOpen}
          style={{
            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            color: '#ffffff',
            border: '2px solid #7dd3fc',
            borderRadius: '50%',
            width: 54,
            height: 54,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(14, 165, 233, 0.5)',
            position: 'relative',
          }}
          title="Open ARIA AI Companion"
        >
          <MessageSquare size={22} />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: -2,
                right: -2,
                background: '#ef4444',
                color: '#ffffff',
                borderRadius: '50%',
                width: 20,
                height: 20,
                fontSize: '0.72rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #0f172a',
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

