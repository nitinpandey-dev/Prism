import { useSkatingStore } from '../stores/useSkatingStore';
import { useGameStore } from '../../../stores/useGameStore';
import { Award, CheckCircle2, RotateCcw, ArrowRight, Zap, Target, Compass } from 'lucide-react';

export default function SkatingMissionCompleteModal() {
  const { stage, setStage, xp, achievements, history, setTargetChallengeActive, resetExperiment } =
    useSkatingStore();
  const setActiveActivity = useGameStore((s) => (s as any).setActiveActivity);

  if (stage !== 'STAGE_8_EXPLORE_MORE') return null;

  const handleStartTargetChallenge = () => {
    setTargetChallengeActive(true);
    resetExperiment();
    setStage('STAGE_5_EXPERIMENT');
  };

  const handleReturnToOutpost = () => {
    if (setActiveActivity) {
      setActiveActivity('outpost');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 110,
        padding: 20,
      }}
    >
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.96)',
          border: '2px solid #10b981',
          borderRadius: 20,
          maxWidth: 560,
          width: '100%',
          padding: '28px 32px',
          color: '#f8fafc',
          boxShadow: '0 20px 60px rgba(16, 185, 129, 0.3)',
          textAlign: 'center',
          animation: 'fadeIn 0.35s ease',
        }}
      >
        {/* Celebration Trophy Icon */}
        <div
          style={{
            width: 68,
            height: 68,
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
          <Award size={38} />
        </div>

        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34d399', letterSpacing: '0.08em' }}>
          MISSION ACCOMPLISHED • PHY-ACT-001
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '6px 0 12px 0' }}>
          The Great Skating Challenge Complete!
        </h2>
        <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: 20 }}>
          You have mastered the physical relationship between frictional resistance, deceleration, and braking distance!
        </p>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 10,
            background: 'rgba(15, 23, 42, 0.65)',
            padding: 16,
            borderRadius: 12,
            border: '1px solid rgba(148, 163, 184, 0.15)',
            marginBottom: 20,
          }}
        >
          <div>
            <div style={{ fontSize: '0.70rem', color: '#94a3b8' }}>Total Earned XP</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#facc15' }}>
              +{xp} XP
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.70rem', color: '#94a3b8' }}>Runs Executed</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>
              {history.length}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.70rem', color: '#94a3b8' }}>Achievements</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>
              {achievements.length}
            </div>
          </div>
        </div>

        {/* Achievements list */}
        <div style={{ textAlign: 'left', marginBottom: 24 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
            CONCEPTS & ACHIEVEMENTS:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.78rem', color: '#cbd5e1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={15} color="#10b981" />
              <span>Deceleration is independent of skater mass (a = μg)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={15} color="#10b981" />
              <span>Stopping distance scales with the square of speed (d ∝ v₀²)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={15} color="#10b981" />
              <span>Stopping distance is inversely proportional to friction (d ∝ 1/μ)</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setStage('STAGE_5_EXPERIMENT')}
            style={{
              flex: 1,
              padding: '12px',
              background: 'rgba(51, 65, 85, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: 8,
              color: '#f8fafc',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Free Skate & Replay
          </button>

          <button
            onClick={handleStartTargetChallenge}
            style={{
              flex: 1.2,
              padding: '12px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              border: 'none',
              borderRadius: 8,
              color: '#ffffff',
              fontSize: '0.84rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Target size={16} />
            <span>Target Challenge</span>
          </button>

          <button
            onClick={handleReturnToOutpost}
            style={{
              flex: 1.2,
              padding: '12px',
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              border: 'none',
              borderRadius: 8,
              color: '#ffffff',
              fontSize: '0.84rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Compass size={16} />
            <span>Return to Outpost</span>
          </button>
        </div>
      </div>
    </div>
  );
}
