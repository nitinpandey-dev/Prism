import { useSkatingStore } from '../stores/useSkatingStore';
import { SURFACES, SurfaceType } from '../types/skating';
import { Play, RotateCcw, BarChart3, Target, Gauge, Zap, Flame, ShieldAlert } from 'lucide-react';

export default function SkatingControlsHUD() {
  const {
    stage,
    setStage,
    selectedSurface,
    selectSurface,
    initialSpeed,
    setInitialSpeed,
    experimentState,
    startExperiment,
    triggerBrake,
    resetExperiment,
    lastMetrics,
    history,
    isTargetChallengeActive,
    setTargetChallengeActive,
  } = useSkatingStore();

  const isRunning = experimentState === 'approaching' || experimentState === 'braking';

  return (
    <div
      style={{
        position: 'absolute',
        top: 64,
        right: 20,
        width: 370,
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
        maxHeight: 'calc(100vh - 140px)',
      }}
    >
      {/* ── Panel Header ── */}
      <div
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(30, 41, 59, 0.6)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Gauge size={18} color="#38bdf8" />
          <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, letterSpacing: '0.02em' }}>
            Skating Experiment Lab
          </h3>
        </div>

        {/* Target Stop Challenge Toggle */}
        <button
          onClick={() => setTargetChallengeActive(!isTargetChallengeActive)}
          style={{
            background: isTargetChallengeActive ? 'rgba(16, 185, 129, 0.25)' : 'rgba(51, 65, 85, 0.6)',
            border: `1px solid ${isTargetChallengeActive ? '#10b981' : 'rgba(148, 163, 184, 0.3)'}`,
            color: isTargetChallengeActive ? '#34d399' : '#94a3b8',
            borderRadius: 12,
            padding: '3px 8px',
            fontSize: '0.68rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
          title="Challenge: Stop precisely inside the 10m-14m target zone!"
        >
          <Target size={12} />
          <span>{isTargetChallengeActive ? 'Challenge ON' : 'Target Mode'}</span>
        </button>
      </div>

      {/* ── Controls Body ── */}
      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
        {/* 1. Surface Selection */}
        <div>
          <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>
            TRACK SURFACE (FRICTION COEFFICIENT μ)
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {(Object.keys(SURFACES) as SurfaceType[]).map((key) => {
              const surf = SURFACES[key];
              const isSelected = selectedSurface === key;
              return (
                <button
                  key={key}
                  onClick={() => selectSurface(key)}
                  disabled={isRunning}
                  style={{
                    padding: '8px 6px',
                    borderRadius: 8,
                    border: `1.5px solid ${isSelected ? surf.color : 'rgba(148, 163, 184, 0.2)'}`,
                    background: isSelected ? 'rgba(30, 41, 59, 0.9)' : 'rgba(15, 23, 42, 0.6)',
                    cursor: isRunning ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: isSelected ? surf.color : '#e2e8f0' }}>
                    {surf.id === 'slippery' ? 'Slippery' : surf.id === 'normal' ? 'Normal' : 'Rough'}
                  </span>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#facc15', fontWeight: 700 }}>
                    μ = {surf.frictionCoeff.toFixed(2)}
                  </span>
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: '0.70rem', color: '#94a3b8', marginTop: 4, fontStyle: 'italic' }}>
            {SURFACES[selectedSurface].description}
          </div>
        </div>

        {/* 2. Initial Speed Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: '0.80rem', fontWeight: 600, color: '#e2e8f0' }}>
              Skating Speed (v₀)
            </span>
            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'monospace' }}>
              {initialSpeed.toFixed(1)} m/s ({(initialSpeed * 3.6).toFixed(1)} km/h)
            </span>
          </div>
          <input
            type="range"
            min={2.0}
            max={10.0}
            step={0.5}
            value={initialSpeed}
            disabled={isRunning}
            onChange={(e) => setInitialSpeed(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#0284c7', cursor: isRunning ? 'not-allowed' : 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748b' }}>
            <span>2.0 m/s (Gentle)</span>
            <span>6.0 m/s (Moderate)</span>
            <span>10.0 m/s (Sprint)</span>
          </div>
        </div>

        {/* 3. Live Scientific Prediction Telemetry Box */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.7)',
            borderRadius: 10,
            padding: '12px 14px',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.04em' }}>
            THEORETICAL BRAKING CALCULATIONS
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '0.78rem' }}>
            <div>
              <span style={{ color: '#94a3b8' }}>Deceleration (a):</span>
              <div style={{ color: '#f8fafc', fontWeight: 700, fontFamily: 'monospace' }}>
                {lastMetrics.deceleration.toFixed(2)} m/s²
              </div>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Stopping Time (t):</span>
              <div style={{ color: '#f8fafc', fontWeight: 700, fontFamily: 'monospace' }}>
                {lastMetrics.stoppingTime.toFixed(2)} s
              </div>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Stopping Dist (d):</span>
              <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: '1.0rem', fontFamily: 'monospace' }}>
                {lastMetrics.stoppingDistance.toFixed(2)} m
              </div>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Friction Force (F):</span>
              <div style={{ color: '#facc15', fontWeight: 700, fontFamily: 'monospace' }}>
                {lastMetrics.frictionForce.toFixed(1)} N
              </div>
            </div>
          </div>

          {isTargetChallengeActive && (
            <div
              style={{
                marginTop: 4,
                padding: '6px 10px',
                borderRadius: 6,
                background:
                  lastMetrics.stoppingDistance >= 10.0 && lastMetrics.stoppingDistance <= 14.0
                    ? 'rgba(16, 185, 129, 0.2)'
                    : 'rgba(239, 68, 68, 0.15)',
                border: `1px solid ${
                  lastMetrics.stoppingDistance >= 10.0 && lastMetrics.stoppingDistance <= 14.0
                    ? '#10b981'
                    : '#ef4444'
                }`,
                fontSize: '0.74rem',
                fontWeight: 600,
                color:
                  lastMetrics.stoppingDistance >= 10.0 && lastMetrics.stoppingDistance <= 14.0
                    ? '#34d399'
                    : '#f87171',
              }}
            >
              {lastMetrics.stoppingDistance >= 10.0 && lastMetrics.stoppingDistance <= 14.0
                ? '🎯 PRECISE HIT: Will stop within Target Zone (10m–14m)!'
                : lastMetrics.stoppingDistance < 10.0
                ? '⚠️ Under target zone (will stop too early)'
                : '⚠️ Overshoot target zone (will crash into safety barrier!)'}
            </div>
          )}
        </div>
      </div>

      {/* ── Footer Action Buttons ── */}
      <div
        style={{
          padding: '14px 18px',
          borderTop: '1px solid rgba(148, 163, 184, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          background: 'rgba(30, 41, 59, 0.5)',
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          {experimentState === 'approaching' ? (
            <button
              onClick={triggerBrake}
              style={{
                flex: 2,
                padding: '12px 14px',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 8,
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)',
              }}
            >
              <Flame size={18} />
              <span>BRAKE NOW! [SPACE]</span>
            </button>
          ) : (
            <button
              onClick={startExperiment}
              disabled={experimentState === 'braking'}
              style={{
                flex: 2,
                padding: '12px 14px',
                background: experimentState === 'braking'
                  ? '#475569'
                  : 'linear-gradient(135deg, #0284c7, #2563eb)',
                color: '#ffffff',
                border: '1px solid #38bdf8',
                borderRadius: 8,
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: experimentState === 'braking' ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: experimentState === 'braking' ? 'none' : '0 4px 16px rgba(2, 132, 199, 0.4)',
              }}
            >
              <Play size={18} />
              <span>{experimentState === 'finished' ? 'RE-TEST RUN' : 'LAUNCH SKATER'}</span>
            </button>
          )}

          <button
            onClick={resetExperiment}
            style={{
              flex: 1,
              padding: '12px',
              background: 'rgba(51, 65, 85, 0.8)',
              color: '#94a3b8',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: 8,
              fontSize: '0.80rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}
            title="Reset Skater to Start Line"
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>
        </div>

        {/* View Results Button (Active once at least one test is run) */}
        {history.length > 0 && (
          <button
            onClick={() => setStage('STAGE_6_SEE_RESULTS')}
            style={{
              padding: '8px 12px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              borderRadius: 6,
              color: '#34d399',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <BarChart3 size={15} />
            <span>Compare Surface Results ({history.length} tested)</span>
          </button>
        )}
      </div>
    </div>
  );
}
