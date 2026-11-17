import { useSkatingStore } from '../stores/useSkatingStore';
import { SURFACES } from '../types/skating';
import { Gauge, Play, RotateCcw, Flame } from 'lucide-react';

export default function SkatingTimelineHUD() {
  const {
    currentSpeed,
    brakingDistance,
    experimentState,
    selectedSurface,
    lastMetrics,
    startExperiment,
    triggerBrake,
    resetExperiment,
  } = useSkatingStore();

  const isBraking = experimentState === 'braking';
  const isApproaching = experimentState === 'approaching';
  const isFinished = experimentState === 'finished';

  const progressFraction = Math.min(
    1,
    lastMetrics.stoppingDistance > 0 ? brakingDistance / lastMetrics.stoppingDistance : 0
  );

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(90vw, 760px)',
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(56, 189, 248, 0.35)',
        borderRadius: 14,
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)',
        color: '#f8fafc',
        zIndex: 45,
      }}
    >
      {/* ── Left: Speedometer & Distance Gauge ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Speed Dial Card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              background: isBraking ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.2)',
              border: `2px solid ${isBraking ? '#ef4444' : '#38bdf8'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Gauge size={20} color={isBraking ? '#f87171' : '#38bdf8'} />
          </div>
          <div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600 }}>CURRENT SPEED</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'monospace', color: '#f8fafc' }}>
              {currentSpeed.toFixed(1)} <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>m/s</span>
            </div>
          </div>
        </div>

        {/* Distance Readout */}
        <div style={{ borderLeft: '1px solid rgba(148, 163, 184, 0.2)', paddingLeft: 16 }}>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600 }}>BRAKING DISTANCE</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'monospace', color: '#facc15' }}>
            {brakingDistance.toFixed(2)} <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>meters</span>
          </div>
        </div>
      </div>

      {/* ── Center: Dynamic Braking Progress Bar ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.70rem', color: '#94a3b8' }}>
          <span>Brake Line (0.0 m)</span>
          <span style={{ fontWeight: 700, color: SURFACES[selectedSurface].color }}>
            {SURFACES[selectedSurface].name} (μ = {SURFACES[selectedSurface].frictionCoeff})
          </span>
          <span>Target Stop ({lastMetrics.stoppingDistance.toFixed(1)} m)</span>
        </div>
        <div
          style={{
            height: 8,
            width: '100%',
            background: 'rgba(51, 65, 85, 0.6)',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${(progressFraction * 100).toFixed(1)}%`,
              background: isBraking
                ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                : isFinished
                ? '#10b981'
                : '#0284c7',
              borderRadius: 4,
              transition: isBraking ? 'width 0.05s linear' : 'width 0.2s ease',
            }}
          />
        </div>
      </div>

      {/* ── Right: Playback / Brake Controls ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {isApproaching ? (
          <button
            onClick={triggerBrake}
            style={{
              background: '#ef4444',
              border: 'none',
              borderRadius: 8,
              padding: '8px 14px',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.80rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 0 12px rgba(239, 68, 68, 0.5)',
            }}
          >
            <Flame size={16} />
            <span>BRAKE [SPACE]</span>
          </button>
        ) : (
          <button
            onClick={startExperiment}
            disabled={isBraking}
            style={{
              background: isBraking ? '#475569' : '#0284c7',
              border: 'none',
              borderRadius: 8,
              padding: '8px 14px',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.80rem',
              cursor: isBraking ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Play size={16} />
            <span>{isFinished ? 'Re-run' : 'Start'}</span>
          </button>
        )}

        <button
          onClick={resetExperiment}
          style={{
            background: 'rgba(51, 65, 85, 0.7)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: 8,
            padding: '8px',
            color: '#94a3b8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
          title="Reset Skater"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
}
