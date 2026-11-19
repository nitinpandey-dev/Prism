import { useState, useRef } from 'react';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { MISSIONS } from '../../types/adventure';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Layers,
  Zap,
} from 'lucide-react';

export default function AdventureGameHUD() {
  const {
    setScreen,
    gameplayMode,
    activeMissionId,
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

  // Surface status label
  const surfaceDisplay: Record<string, { label: string; color: string }> = {
    concrete: { label: 'Concrete Track (Normal Grip)', color: '#94a3b8' },
    ice: { label: 'Frosted Ice (Low Grip / Slick)', color: '#00d2ff' },
    grass: { label: 'Meadow Grass (High Resistance)', color: '#4ade80' },
    wood: { label: 'Boardwalk Ramp (Incline)', color: '#f59e0b' },
  };

  const curSurf = surfaceDisplay[currentSurface] || surfaceDisplay.concrete;

  // Speed telemetry
  const speedPercent = Math.min(100, (skaterSpeed / 9.5) * 100);
  const speedMps = skaterSpeed.toFixed(1);

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
        padding: '20px 24px',
        userSelect: 'none',
      }}
    >
      {/* ── TOP BAR: Navigation, Mission Badge & Speedometer ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
        {/* Left: Exit to Hub & Surface Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, pointerEvents: 'auto' }}>
          <button
            onClick={() => setScreen('hub')}
            style={{
              background: 'rgba(7, 10, 19, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              borderRadius: 10,
              padding: '8px 14px',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              backdropFilter: 'blur(12px)',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(7, 10, 19, 0.85)')}
          >
            <ArrowLeft size={16} />
            <span>Return to Hub</span>
          </button>

          {/* Current Surface Status */}
          <div
            style={{
              background: 'rgba(7, 10, 19, 0.85)',
              border: `1px solid ${curSurf.color}40`,
              color: curSurf.color,
              borderRadius: 10,
              padding: '8px 14px',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backdropFilter: 'blur(12px)',
            }}
          >
            <Layers size={14} />
            <span>{curSurf.label}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            style={{
              background: 'rgba(7, 10, 19, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              borderRadius: 10,
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(12px)',
            }}
          >
            {soundEnabled ? <Volume2 size={16} color="#00d2ff" /> : <VolumeX size={16} color="#64748b" />}
          </button>
        </div>

        {/* Center: Mission Goal Pill (when on mission) */}
        {gameplayMode === 'mission' && activeMission && (
          <div
            style={{
              background: 'rgba(7, 10, 19, 0.92)',
              border: '1px solid #f59e0b',
              borderRadius: 12,
              padding: '8px 20px',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backdropFilter: 'blur(16px)',
              pointerEvents: 'auto',
            }}
          >
            <div style={{ fontSize: '0.68rem', color: '#f59e0b', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Mission 0{activeMission.number} Goal
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: 2 }}>{activeMission.objective}</div>
          </div>
        )}

        {/* Right: Telemetry Gauge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, pointerEvents: 'auto' }}>
          {/* Mission 5 Emblem Counter */}
          {activeMissionId === 'mission-5' && (
            <div
              style={{
                background: 'rgba(7, 10, 19, 0.85)',
                border: '1px solid #00d2ff',
                borderRadius: 10,
                padding: '6px 14px',
                color: '#00d2ff',
                fontWeight: 700,
                fontSize: '0.8rem',
              }}
            >
              Emblems: {starsCollected.length} / 3
            </div>
          )}

          {/* Minimalist Speedometer */}
          <div
            style={{
              background: 'rgba(7, 10, 19, 0.92)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 12,
              padding: '10px 16px',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              minWidth: 130,
              backdropFilter: 'blur(16px)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, letterSpacing: '0.06em' }}>VELOCITY</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#00d2ff' }}>
                {speedMps} m/s
              </span>
            </div>
            {/* Speed Meter Bar */}
            <div style={{ width: '100%', height: 6, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 3, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${speedPercent}%`,
                  background: speedPercent > 70 ? '#f43f5e' : speedPercent > 35 ? '#00d2ff' : '#38bdf8',
                  borderRadius: 3,
                  transition: 'width 0.1s ease-out',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR: Desktop Controls & Touch Interface ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
        {/* Left: Virtual Touch Joystick */}
        <div style={{ pointerEvents: 'auto' }}>
          <div
            ref={joystickRef}
            onTouchStart={handleJoystickStart}
            onTouchMove={handleJoystickMove}
            onTouchEnd={handleJoystickEnd}
            onMouseDown={handleJoystickStart}
            onMouseMove={handleJoystickMove}
            onMouseUp={handleJoystickEnd}
            style={{
              width: 90,
              height: 90,
              borderRadius: '50%',
              background: 'rgba(7, 10, 19, 0.55)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              touchAction: 'none',
              cursor: 'grab',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: '#00d2ff',
                transform: `translate(${joystickTouch.x}px, ${joystickTouch.y}px)`,
                transition: joystickTouch.active ? 'none' : 'transform 0.15s ease-out',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>

        {/* Center: Desktop Key Indicator */}
        <div
          style={{
            background: 'rgba(7, 10, 19, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 10,
            padding: '6px 16px',
            color: '#94a3b8',
            fontSize: '0.75rem',
            fontWeight: 600,
            display: 'flex',
            gap: 12,
            backdropFilter: 'blur(8px)',
          }}
        >
          <span>
            <strong style={{ color: '#ffffff' }}>WASD</strong> Steer
          </span>
          <span>•</span>
          <span>
            <strong style={{ color: '#f43f5e' }}>SPACE</strong> Brake
          </span>
          <span>•</span>
          <span>
            <strong style={{ color: '#00d2ff' }}>SHIFT</strong> Sprint
          </span>
          <span>•</span>
          <span>
            <strong style={{ color: '#cbd5e1' }}>Mouse</strong> Look
          </span>
        </div>

        {/* Right: Clean Action Buttons (Sprint, Brake, Reset) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, pointerEvents: 'auto' }}>
          {gameplayMode === 'mission' && (
            <button
              onClick={retryMission}
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: 'rgba(7, 10, 19, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Restart Attempt"
            >
              <RotateCcw size={18} color="#00d2ff" />
            </button>
          )}

          {/* SPRINT BUTTON */}
          <button
            onMouseDown={() => setSprinting(true)}
            onMouseUp={() => setSprinting(false)}
            onTouchStart={() => setSprinting(true)}
            onTouchEnd={() => setSprinting(false)}
            style={{
              padding: '12px 18px',
              borderRadius: 10,
              background: isSprinting ? '#0284c7' : 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              letterSpacing: '0.04em',
            }}
          >
            SPRINT
          </button>

          {/* BRAKE BUTTON */}
          <button
            onMouseDown={() => setBraking(true)}
            onMouseUp={() => setBraking(false)}
            onTouchStart={() => setBraking(true)}
            onTouchEnd={() => setBraking(false)}
            style={{
              padding: '12px 22px',
              borderRadius: 10,
              background: isBraking ? '#be123c' : '#e11d48',
              border: 'none',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              letterSpacing: '0.04em',
            }}
          >
            BRAKE
          </button>
        </div>
      </div>
    </div>
  );
}
