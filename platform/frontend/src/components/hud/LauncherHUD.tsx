import { useGameStore } from '../../stores/useGameStore';
import { usePhysicsStore } from '../../stores/usePhysicsStore';
import { useMissionStore } from '../../stores/useMissionStore';
import { Play, RotateCcw, X, Target, Zap, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function LauncherHUD() {
  const { isConsoleOpen, closeConsole, learningMode, setLearningMode } = useGameStore();
  const {
    params,
    trajectory,
    isFiring,
    setSpeed,
    setAngle,
    setAzimuth,
    startLaunch,
    resetLaunch,
    recomputeTrajectory,
  } = usePhysicsStore();

  const completeObjective = useMissionStore((s) => s.completeObjective);
  const { metrics } = trajectory;

  if (!isConsoleOpen) return null;

  const handleLaunch = () => {
    if (isFiring) return;
    completeObjective('obj-calibrate');
    startLaunch();
  };

  const handleModeChange = (mode: 'school' | 'university') => {
    setLearningMode(mode);
    recomputeTrajectory(mode);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 64,
        right: 20,
        bottom: 24,
        width: 380,
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(56, 189, 248, 0.35)',
        borderRadius: 14,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 12px 48px rgba(0, 0, 0, 0.6)',
        color: '#f8fafc',
        zIndex: 50,
        overflow: 'hidden',
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(30, 41, 59, 0.5)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Target size={18} color="#38bdf8" />
          <h3 style={{ fontSize: '1.0rem', fontWeight: 700, margin: 0, letterSpacing: '0.02em' }}>
            Launcher Diagnostics
          </h3>
        </div>
        <button
          onClick={closeConsole}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: 4,
          }}
          title="Disconnect Console [ESC]"
        >
          <X size={20} />
        </button>
      </div>

      {/* ── Learning Mode Pill ── */}
      <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: 6, fontWeight: 600 }}>
          PHYSICS MODEL FIDELITY
        </div>
        <div
          style={{
            display: 'flex',
            background: 'rgba(30, 41, 59, 0.8)',
            padding: 3,
            borderRadius: 8,
          }}
        >
          <button
            onClick={() => handleModeChange('school')}
            style={{
              flex: 1,
              padding: '6px 10px',
              border: 'none',
              borderRadius: 6,
              fontSize: '0.76rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: learningMode === 'school' ? '#0284c7' : 'transparent',
              color: learningMode === 'school' ? '#ffffff' : '#94a3b8',
              transition: 'all 0.2s',
            }}
          >
            School (Ideal Vacuum)
          </button>
          <button
            onClick={() => handleModeChange('university')}
            style={{
              flex: 1,
              padding: '6px 10px',
              border: 'none',
              borderRadius: 6,
              fontSize: '0.76rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: learningMode === 'university' ? '#7c3aed' : 'transparent',
              color: learningMode === 'university' ? '#ffffff' : '#94a3b8',
              transition: 'all 0.2s',
            }}
          >
            University (Drag & RK4)
          </button>
        </div>
      </div>

      {/* ── Scrollable Sliders Body ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Launch Angle (Elevation Theta) */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e2e8f0' }}>
              Elevation Angle (θ)
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'monospace' }}>
              {params.launchAngle.toFixed(1)}°
            </span>
          </div>
          <input
            type="range"
            min={15}
            max={75}
            step={0.5}
            value={params.launchAngle}
            disabled={isFiring}
            onChange={(e) => setAngle(parseFloat(e.target.value), learningMode)}
            style={{ width: '100%', accentColor: '#0284c7', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748b' }}>
            <span>15° (Shallow)</span>
            <span>45° (Standard)</span>
            <span>75° (High Lob)</span>
          </div>
        </div>

        {/* Initial Speed (Velocity v0) */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e2e8f0' }}>
              Initial Speed (v₀)
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'monospace' }}>
              {params.initialSpeed.toFixed(1)} m/s
            </span>
          </div>
          <input
            type="range"
            min={20}
            max={55}
            step={0.5}
            value={params.initialSpeed}
            disabled={isFiring}
            onChange={(e) => setSpeed(parseFloat(e.target.value), learningMode)}
            style={{ width: '100%', accentColor: '#0284c7', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748b' }}>
            <span>20 m/s</span>
            <span>34 m/s (Nominal)</span>
            <span>55 m/s (Max)</span>
          </div>
        </div>

        {/* Azimuth Angle (Heading Phi) */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e2e8f0' }}>
              Azimuth Heading (φ)
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'monospace' }}>
              {params.launchAzimuth.toFixed(1)}°
            </span>
          </div>
          <input
            type="range"
            min={-15}
            max={15}
            step={0.5}
            value={params.launchAzimuth}
            disabled={isFiring}
            onChange={(e) => setAzimuth(parseFloat(e.target.value), learningMode)}
            style={{ width: '100%', accentColor: '#0284c7', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748b' }}>
            <span>-15° (Left)</span>
            <span>0° (Center)</span>
            <span>+15° (Right)</span>
          </div>
        </div>

        {/* ── Telemetry Output Box ── */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.7)',
            borderRadius: 10,
            padding: '12px 14px',
            border: '1px solid rgba(148, 163, 184, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em' }}>
            ANALYTICAL TRAJECTORY READOUT
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '0.78rem' }}>
            <div>
              <span style={{ color: '#94a3b8' }}>Flight Time (T):</span>{' '}
              <strong style={{ color: '#f8fafc', fontFamily: 'monospace' }}>{metrics.timeOfFlight} s</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Peak Apex (H):</span>{' '}
              <strong style={{ color: '#c084fc', fontFamily: 'monospace' }}>{metrics.maxHeight} m</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Downrange (R):</span>{' '}
              <strong style={{ color: '#f8fafc', fontFamily: 'monospace' }}>{metrics.horizontalRange} m</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Miss Delta:</span>{' '}
              <strong
                style={{
                  color: metrics.isHit ? '#10b981' : '#f59e0b',
                  fontFamily: 'monospace',
                }}
              >
                {metrics.distanceToTarget} m
              </strong>
            </div>
          </div>

          {/* Hit / Miss Status Indicator */}
          <div
            style={{
              marginTop: 4,
              padding: '6px 10px',
              borderRadius: 6,
              background: metrics.isBullseye
                ? 'rgba(16, 185, 129, 0.2)'
                : metrics.isHit
                ? 'rgba(6, 182, 212, 0.2)'
                : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${
                metrics.isBullseye ? '#10b981' : metrics.isHit ? '#06b6d4' : '#ef4444'
              }`,
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontWeight: 600,
              color: metrics.isBullseye ? '#34d399' : metrics.isHit ? '#38bdf8' : '#f87171',
            }}
          >
            {metrics.isHit ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
            <span>
              {metrics.isBullseye
                ? 'ON TARGET (Bullseye Alignment)'
                : metrics.isHit
                ? 'WITHIN FUNNEL CATCH ZONE'
                : 'OFF TARGET (Re-calibrate Sliders)'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Footer Action Buttons ── */}
      <div
        style={{
          padding: '14px 18px',
          borderTop: '1px solid rgba(148, 163, 184, 0.15)',
          display: 'flex',
          gap: 10,
          background: 'rgba(30, 41, 59, 0.5)',
        }}
      >
        <button
          onClick={handleLaunch}
          disabled={isFiring}
          style={{
            flex: 2,
            padding: '12px 16px',
            background: isFiring
              ? '#475569'
              : 'linear-gradient(135deg, #0284c7, #2563eb)',
            color: '#ffffff',
            border: '1px solid #38bdf8',
            borderRadius: 8,
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: isFiring ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: isFiring ? 'none' : '0 4px 16px rgba(2, 132, 199, 0.4)',
          }}
        >
          {isFiring ? <Zap size={18} className="animate-pulse" /> : <Play size={18} />}
          <span>{isFiring ? 'IN FLIGHT...' : 'LAUNCH BEACON'}</span>
        </button>

        <button
          onClick={resetLaunch}
          disabled={isFiring}
          style={{
            flex: 1,
            padding: '12px',
            background: 'rgba(51, 65, 85, 0.8)',
            color: '#94a3b8',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: 8,
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
          title="Reset Calibration"
        >
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}

