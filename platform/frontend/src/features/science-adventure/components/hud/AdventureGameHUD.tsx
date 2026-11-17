import { useState, useRef, useEffect } from 'react';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { MISSIONS } from '../../types/adventure';
import { Home, Volume2, VolumeX, RotateCcw, Sparkles } from 'lucide-react';

export default function AdventureGameHUD() {
  const {
    currentScreen,
    setScreen,
    gameplayMode,
    activeMissionId,
    missionState,
    abandonMission,
    retryMission,
    skaterSpeed,
    currentSurface,
    isBraking,
    setBraking,
    isSprinting,
    setSprinting,
    starsCollected,
    soundEnabled,
    toggleSound,
    setVirtualJoystick,
    touchControlsActive,
  } = useAdventureStore();

  const activeMission = MISSIONS.find((m) => m.id === activeMissionId);

  // Virtual Joystick state
  const joystickRef = useRef<HTMLDivElement>(null);
  const [joystickTouch, setJoystickTouch] = useState<{ active: boolean; x: number; y: number }>({
    active: false,
    x: 0,
    y: 0,
  });

  const handleJoystickStart = (e: React.TouchEvent | React.MouseEvent) => {
    setJoystickTouch({ active: true, x: 0, y: 0 });
  };

  const handleJoystickMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!joystickTouch.active || !joystickRef.current) return;
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const maxRadius = 40;
    const distance = Math.min(maxRadius, Math.sqrt(dx * dx + dy * dy));
    const angle = Math.atan2(dy, dx);

    const clampedX = Math.cos(angle) * distance;
    const clampedY = Math.sin(angle) * distance;

    setJoystickTouch({ active: true, x: clampedX, y: clampedY });
    setVirtualJoystick(clampedX / maxRadius, -clampedY / maxRadius);
  };

  const handleJoystickEnd = () => {
    setJoystickTouch({ active: false, x: 0, y: 0 });
    setVirtualJoystick(0, 0);
  };

  // Surface visual badge labels (pure visual feel, zero scientific jargon)
  const surfaceDisplay: Record<string, { label: string; icon: string; bg: string }> = {
    concrete: { label: 'Smooth Track', icon: '🛹', bg: 'rgba(100, 116, 139, 0.7)' },
    ice: { label: 'Slippery Ice!', icon: '❄️', bg: 'rgba(2, 132, 199, 0.85)' },
    grass: { label: 'Park Grass', icon: '🌱', bg: 'rgba(22, 163, 74, 0.8)' },
    wood: { label: 'Wood Ramp', icon: '🪵', bg: 'rgba(180, 83, 9, 0.8)' },
  };

  const curSurf = surfaceDisplay[currentSurface] || surfaceDisplay.concrete;

  // Speed level (0 to 10)
  const speedNormalized = Math.min(10, skaterSpeed);
  const speedPercent = Math.min(100, (skaterSpeed / 9.5) * 100);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px 20px',
        userSelect: 'none',
      }}
    >
      {/* ── TOP BAR: Navigation, Mission Badge & Speedometer ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
        {/* Left: Hub Home Button & Mode Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, pointerEvents: 'auto' }}>
          <button
            onClick={() => setScreen('hub')}
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '2px solid rgba(56, 189, 248, 0.4)',
              color: '#ffffff',
              borderRadius: 16,
              padding: '8px 14px',
              fontSize: '0.85rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
              transition: 'transform 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Home size={18} color="#38bdf8" />
            <span>Adventure Hub</span>
          </button>

          {/* Current Surface Badge */}
          <div
            style={{
              background: curSurf.bg,
              color: '#ffffff',
              borderRadius: 14,
              padding: '6px 14px',
              fontSize: '0.8rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span>{curSurf.icon}</span>
            <span>{curSurf.label}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#ffffff',
              borderRadius: 12,
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {soundEnabled ? <Volume2 size={16} color="#38bdf8" /> : <VolumeX size={16} color="#94a3b8" />}
          </button>
        </div>

        {/* Center: Active Mission Objective Pill (when in mission mode) */}
        {gameplayMode === 'mission' && activeMission && (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9))',
              border: '2px solid #f59e0b',
              borderRadius: 20,
              padding: '8px 20px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 4px 20px rgba(245, 158, 11, 0.35)',
              pointerEvents: 'auto',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{activeMission.thumbnail}</span>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase' }}>
                Mission {activeMission.number}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{activeMission.objective}</div>
            </div>
          </div>
        )}

        {/* Right: Stylized Speedometer & Stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, pointerEvents: 'auto' }}>
          {/* Mission 5 Stars Collected Pill */}
          {activeMissionId === 'mission-5' && (
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '2px solid #facc15',
                borderRadius: 16,
                padding: '6px 14px',
                color: '#facc15',
                fontWeight: 800,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>⭐</span>
              <span>{starsCollected.length} / 3 Stars</span>
            </div>
          )}

          {/* Speedometer Gauge */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.9)',
              border: '2px solid rgba(56, 189, 248, 0.3)',
              borderRadius: 18,
              padding: '8px 16px',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              minWidth: 120,
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>SPEED</span>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 900,
                  color: speedPercent > 70 ? '#f43f5e' : speedPercent > 35 ? '#facc15' : '#38bdf8',
                }}
              >
                {speedPercent > 70 ? 'TURBO 🚀' : speedPercent > 35 ? 'CRUISE ⚡' : 'GLIDE ⛸️'}
              </span>
            </div>
            {/* Speed Bar */}
            <div style={{ width: '100%', height: 8, background: '#334155', borderRadius: 4, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${speedPercent}%`,
                  background:
                    speedPercent > 70
                      ? 'linear-gradient(90deg, #facc15, #f43f5e)'
                      : 'linear-gradient(90deg, #38bdf8, #22c55e)',
                  borderRadius: 4,
                  transition: 'width 0.1s ease-out',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM AREA: Desktop Hint & Mobile Touch Controls ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
        {/* Left: Mobile Virtual Joystick or Desktop Hints */}
        <div style={{ pointerEvents: 'auto' }}>
          {/* Virtual Joystick for touch / mobile */}
          <div
            ref={joystickRef}
            onTouchStart={handleJoystickStart}
            onTouchMove={handleJoystickMove}
            onTouchEnd={handleJoystickEnd}
            onMouseDown={handleJoystickStart}
            onMouseMove={handleJoystickMove}
            onMouseUp={handleJoystickEnd}
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'rgba(15, 23, 42, 0.45)',
              border: '2px solid rgba(56, 189, 248, 0.4)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              touchAction: 'none',
              cursor: 'grab',
              backdropFilter: 'blur(4px)',
            }}
          >
            {/* Joystick Thumb Stick */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.5)',
                transform: `translate(${joystickTouch.x}px, ${joystickTouch.y}px)`,
                transition: joystickTouch.active ? 'none' : 'transform 0.15s ease-out',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>

        {/* Center: Desktop Quick Key Hints (subtle pill) */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 20,
            padding: '6px 16px',
            color: '#cbd5e1',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            gap: 12,
            backdropFilter: 'blur(8px)',
          }}
        >
          <span>
            <strong style={{ color: '#38bdf8' }}>WASD / Arrows</strong> Steer
          </span>
          <span>•</span>
          <span>
            <strong style={{ color: '#f43f5e' }}>SPACE</strong> Brake
          </span>
          <span>•</span>
          <span>
            <strong style={{ color: '#facc15' }}>SHIFT</strong> Sprint
          </span>
          <span>•</span>
          <span>
            <strong style={{ color: '#4ade80' }}>Mouse</strong> Look Around
          </span>
        </div>

        {/* Right: Big Touch Action Buttons (Brake, Sprint, Retry) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, pointerEvents: 'auto' }}>
          {/* Retry / Respawn Button */}
          {gameplayMode === 'mission' && (
            <button
              onClick={retryMission}
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'rgba(30, 41, 59, 0.9)',
                border: '2px solid rgba(255,255,255,0.3)',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
              title="Restart Mission Attempt"
            >
              <RotateCcw size={20} color="#38bdf8" />
            </button>
          )}

          {/* SPRINT BUTTON (Press & Hold) */}
          <button
            onMouseDown={() => setSprinting(true)}
            onMouseUp={() => setSprinting(false)}
            onTouchStart={() => setSprinting(true)}
            onTouchEnd={() => setSprinting(false)}
            style={{
              padding: '14px 20px',
              borderRadius: 22,
              background: isSprinting
                ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              border: '2px solid #ffffff',
              color: '#1e293b',
              fontWeight: 900,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(245, 158, 11, 0.4)',
              transform: isSprinting ? 'scale(0.96)' : 'scale(1)',
              transition: 'transform 0.1s',
            }}
          >
            ⚡ SPRINT
          </button>

          {/* BIG BRAKE BUTTON (Press & Hold) */}
          <button
            onMouseDown={() => setBraking(true)}
            onMouseUp={() => setBraking(false)}
            onTouchStart={() => setBraking(true)}
            onTouchEnd={() => setBraking(false)}
            style={{
              padding: '16px 26px',
              borderRadius: 24,
              background: isBraking
                ? 'linear-gradient(135deg, #be123c, #9f1239)'
                : 'linear-gradient(135deg, #f43f5e, #e11d48)',
              border: '3px solid #ffffff',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 6px 22px rgba(244, 63, 94, 0.5)',
              transform: isBraking ? 'scale(0.95)' : 'scale(1)',
              transition: 'transform 0.1s',
            }}
          >
            🛑 BRAKE
          </button>
        </div>
      </div>
    </div>
  );
}
