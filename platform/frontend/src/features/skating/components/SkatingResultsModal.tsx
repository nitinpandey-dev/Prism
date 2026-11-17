import { useSkatingStore } from '../stores/useSkatingStore';
import { SURFACES } from '../types/skating';
import { calculateFrictionMetrics } from '../physics/frictionModel';
import { BarChart3, CheckCircle2, AlertCircle, X, ChevronRight, Award, Zap } from 'lucide-react';

export default function SkatingResultsModal() {
  const {
    stage,
    setStage,
    studentPrediction,
    selectedSurface,
    initialSpeed,
    lastMetrics,
    history,
  } = useSkatingStore();

  if (stage !== 'STAGE_6_SEE_RESULTS') return null;

  // Compute exact theoretical values across all three surfaces at this exact initialSpeed
  const slipperyMetrics = calculateFrictionMetrics(initialSpeed, 'slippery');
  const normalMetrics = calculateFrictionMetrics(initialSpeed, 'normal');
  const roughMetrics = calculateFrictionMetrics(initialSpeed, 'rough');

  const maxDist = Math.max(slipperyMetrics.stoppingDistance, 1.0);

  // Prediction accuracy analysis
  const isPredictionCorrect = studentPrediction === 'slippery';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.82)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: 20,
      }}
    >
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.96)',
          border: '2px solid #38bdf8',
          borderRadius: 18,
          maxWidth: 620,
          width: '100%',
          padding: '24px 28px',
          color: '#f8fafc',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* ── Modal Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'rgba(56, 189, 248, 0.2)',
                border: '1.5px solid #38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BarChart3 size={20} color="#38bdf8" />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.06em' }}>
                STAGE 06 • EXPERIMENT TELEMETRY
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                Stopping Distance Comparison
              </h2>
            </div>
          </div>
          <button
            onClick={() => setStage('STAGE_5_EXPERIMENT')}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Prediction Feedback Banner ── */}
        <div
          style={{
            background: isPredictionCorrect
              ? 'rgba(16, 185, 129, 0.15)'
              : 'rgba(245, 158, 11, 0.15)',
            border: `1px solid ${isPredictionCorrect ? '#10b981' : '#f59e0b'}`,
            borderRadius: 10,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 18,
          }}
        >
          {isPredictionCorrect ? (
            <CheckCircle2 size={24} color="#10b981" />
          ) : (
            <AlertCircle size={24} color="#f59e0b" />
          )}
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isPredictionCorrect ? '#34d399' : '#fbbf24' }}>
              {isPredictionCorrect
                ? 'Your Hypothesis Was Confirmed!'
                : studentPrediction === 'not_sure'
                ? 'Scientific Experiment Discovery!'
                : 'Hypothesis Contrast Observed!'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4 }}>
              {isPredictionCorrect ? (
                <span>
                  You predicted <strong>A. Slippery surface</strong>. Correct! Because the slippery surface has the smallest friction coefficient (μ = 0.15), it generates the least deceleration, requiring the greatest distance to stop.
                </span>
              ) : (
                <span>
                  You selected <strong>{studentPrediction?.toUpperCase()}</strong>. The data reveals that the <strong>Slippery surface</strong> produces the longest stopping distance ({slipperyMetrics.stoppingDistance.toFixed(1)} m) because deceleration is directly proportional to friction (a = μg).
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Visual Comparison Bar Chart (Calculated Values) ── */}
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: 12, padding: '16px', border: '1px solid rgba(148, 163, 184, 0.15)', marginBottom: 20 }}>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
            <span>STOPPING DISTANCE AT v₀ = {initialSpeed.toFixed(1)} m/s (d = v₀² / 2μg)</span>
            <span style={{ color: '#38bdf8' }}>Friction (μ)</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* 1. Slippery */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 4 }}>
                <span style={{ fontWeight: 700, color: '#38bdf8' }}>Slippery Surface (Polished Resin)</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 800 }}>
                  {slipperyMetrics.stoppingDistance.toFixed(2)} m (μ = 0.15)
                </span>
              </div>
              <div style={{ height: 16, background: 'rgba(51, 65, 85, 0.5)', borderRadius: 8, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${(slipperyMetrics.stoppingDistance / maxDist) * 100}%`,
                    background: 'linear-gradient(90deg, #0284c7, #38bdf8)',
                    borderRadius: 8,
                  }}
                />
              </div>
            </div>

            {/* 2. Normal */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 4 }}>
                <span style={{ fontWeight: 700, color: '#94a3b8' }}>Normal Surface (Skatepark Concrete)</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 800 }}>
                  {normalMetrics.stoppingDistance.toFixed(2)} m (μ = 0.40)
                </span>
              </div>
              <div style={{ height: 16, background: 'rgba(51, 65, 85, 0.5)', borderRadius: 8, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${(normalMetrics.stoppingDistance / maxDist) * 100}%`,
                    background: 'linear-gradient(90deg, #64748b, #94a3b8)',
                    borderRadius: 8,
                  }}
                />
              </div>
            </div>

            {/* 3. Rough */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 4 }}>
                <span style={{ fontWeight: 700, color: '#f97316' }}>Rough Surface (Textured Tartan)</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 800 }}>
                  {roughMetrics.stoppingDistance.toFixed(2)} m (μ = 0.75)
                </span>
              </div>
              <div style={{ height: 16, background: 'rgba(51, 65, 85, 0.5)', borderRadius: 8, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${(roughMetrics.stoppingDistance / maxDist) * 100}%`,
                    background: 'linear-gradient(90deg, #c2410c, #f97316)',
                    borderRadius: 8,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Key Takeaway Callout ── */}
        <div style={{ fontSize: '0.80rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: 20 }}>
          💡 <strong>Key Takeaway:</strong> Stopping distance is <em>inversely proportional</em> to the coefficient of friction (d ∝ 1/μ). When μ doubles, stopping distance is cut in half!
        </div>

        {/* ── Modal Footer ── */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setStage('STAGE_5_EXPERIMENT')}
            style={{
              flex: 1,
              padding: '12px',
              background: 'rgba(51, 65, 85, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.25)',
              borderRadius: 8,
              color: '#f8fafc',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Repeat Experiment
          </button>
          <button
            onClick={() => setStage('STAGE_7_LEARN_CONCEPT')}
            style={{
              flex: 1.5,
              padding: '12px',
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              border: 'none',
              borderRadius: 8,
              color: '#ffffff',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <span>Learn the Math (Stage 7)</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
