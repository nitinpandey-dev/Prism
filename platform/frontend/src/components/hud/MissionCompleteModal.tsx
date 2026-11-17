import { useMissionStore } from '../../stores/useMissionStore';
import { usePhysicsStore } from '../../stores/usePhysicsStore';
import { useGameStore } from '../../stores/useGameStore';
import { Award, CheckCircle, RotateCcw, ArrowRight, Zap } from 'lucide-react';

export default function MissionCompleteModal() {
  const { stage, missionId, title, attemptsCount, bestScore, resetMission } = useMissionStore();
  const { lastResult, resetLaunch } = usePhysicsStore();
  const { setLearningMode, recomputeTrajectory } = usePhysicsStore.getState()
    ? {
        setLearningMode: useGameStore((s) => s.setLearningMode),
        recomputeTrajectory: usePhysicsStore((s) => s.recomputeTrajectory),
      }
    : ({} as any);

  if (stage !== 'COMPLETED') return null;

  const metrics = lastResult?.metrics;

  const handleRetryUniversity = () => {
    setLearningMode('university');
    recomputeTrajectory('university');
    resetMission();
    resetLaunch();
  };

  const handleClose = () => {
    useMissionStore.getState().setStage('BRIEFING');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.8)',
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
          background: 'rgba(30, 41, 59, 0.95)',
          border: '2px solid #10b981',
          borderRadius: 18,
          maxWidth: 520,
          width: '100%',
          padding: '28px 32px',
          color: '#f8fafc',
          boxShadow: '0 20px 60px rgba(16, 185, 129, 0.3)',
          textAlign: 'center',
          animation: 'fadeIn 0.4s ease',
        }}
      >
        {/* Badge Icon */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.2)',
            border: '2px solid #10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            color: '#10b981',
          }}
        >
          <Award size={36} />
        </div>

        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34d399', letterSpacing: '0.1em' }}>
          MISSION ACCOMPLISHED • {missionId}
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '6px 0 12px 0', color: '#f8fafc' }}>
          {title}
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: 20 }}>
          The emergency beacon capsule struck Emergency Relay Funnel #4 with precision. Telemetry uplink has been
          re-established across Outpost Theta!
        </p>

        {/* Scorecard Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 10,
            background: 'rgba(15, 23, 42, 0.6)',
            padding: 16,
            borderRadius: 12,
            border: '1px solid rgba(148, 163, 184, 0.15)',
            marginBottom: 24,
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Accuracy Score</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>
              {bestScore}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Impact Speed</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>
              {metrics?.impactSpeed || 32} m/s
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Attempts</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#facc15' }}>
              {attemptsCount}
            </div>
          </div>
        </div>

        {/* Scientific Concepts Mastered */}
        <div style={{ textAlign: 'left', marginBottom: 24 }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: 8 }}>
            SCIENTIFIC CONCEPTS MASTERED:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.8rem', color: '#cbd5e1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle size={16} color="#10b981" />
              <span>Independent orthogonal decomposition of 2D velocity vectors (vx, vy)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle size={16} color="#10b981" />
              <span>Quadratic kinematic equation for unequal launch/landing elevations (Δy = -10.5 m)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle size={16} color="#10b981" />
              <span>Mechanical energy conservation across gravitational potential gradients</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={handleClose}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: 'rgba(51, 65, 85, 0.8)',
              color: '#f8fafc',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: 8,
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Continue Exploring
          </button>
          <button
            onClick={handleRetryUniversity}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 8,
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <span>University Challenge</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

