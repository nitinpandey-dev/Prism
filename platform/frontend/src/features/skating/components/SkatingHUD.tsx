import { useSkatingStore } from '../stores/useSkatingStore';
import { useAriaStore } from '../../../stores/useAriaStore';
import { Award, Bot, Sparkles, HelpCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { LearningStage, PredictionOption, SURFACES } from '../types/skating';

export default function SkatingHUD() {
  const {
    stage,
    setStage,
    studentPrediction,
    makePrediction,
    selectedSurface,
    xp,
    startExperiment,
  } = useSkatingStore();

  const { toggleOpen, unreadCount } = useAriaStore();

  const STAGE_LABELS: Record<LearningStage, { num: string; title: string }> = {
    STAGE_1_CHOOSE_ACTIVITY: { num: '01', title: 'Choose Activity' },
    STAGE_2_WATCH_WONDER: { num: '02', title: 'Watch & Wonder' },
    STAGE_3_GET_MISSION: { num: '03', title: 'Get Mission' },
    STAGE_4_MAKE_PREDICTION: { num: '04', title: 'Make a Prediction' },
    STAGE_5_EXPERIMENT: { num: '05', title: 'Interactive Experiment' },
    STAGE_6_SEE_RESULTS: { num: '06', title: 'See the Results' },
    STAGE_7_LEARN_CONCEPT: { num: '07', title: 'Learn the Concept' },
    STAGE_8_EXPLORE_MORE: { num: '08', title: 'Explore More' },
  };

  const curr = STAGE_LABELS[stage];

  return (
    <div style={{ pointerEvents: 'none' }}>
      {/* ── Top-Left Mission Progress Card ── */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: 12,
          padding: '14px 18px',
          color: '#f8fafc',
          maxWidth: 420,
          pointerEvents: 'auto',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                padding: '2px 8px',
                borderRadius: 4,
                background: 'rgba(56, 189, 248, 0.25)',
                color: '#38bdf8',
              }}
            >
              PHY-ACT-001
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
              The Great Skating Challenge
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#facc15',
              background: 'rgba(250, 204, 21, 0.15)',
              padding: '2px 8px',
              borderRadius: 12,
            }}
          >
            <Award size={14} />
            <span>{xp} XP</span>
          </div>
        </div>

        {/* Current Stage Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#38bdf8', marginBottom: 6 }}>
          <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>Stage {curr.num}/08:</span>
          <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{curr.title}</span>
        </div>

        {/* ── STAGE 2: WATCH AND WONDER PROMPT ── */}
        {stage === 'STAGE_2_WATCH_WONDER' && (
          <div style={{ borderTop: '1px solid rgba(148, 163, 184, 0.15)', paddingTop: 8 }}>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.4, margin: '0 0 8px 0' }}>
              “Notice how Alex slides much farther when braking on the smooth blue surface than on the textured red lane!”
            </p>
            <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#facc15', margin: '0 0 10px 0' }}>
              Why do you think Alex stopped differently?
            </p>
            <button
              onClick={() => setStage('STAGE_3_GET_MISSION')}
              style={{
                background: '#0284c7',
                border: 'none',
                borderRadius: 6,
                color: '#ffffff',
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>Continue to Mission</span>
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* ── STAGE 3: GET A MISSION (ARIA BRIEFING) ── */}
        {stage === 'STAGE_3_GET_MISSION' && (
          <div style={{ borderTop: '1px solid rgba(148, 163, 184, 0.15)', paddingTop: 8 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 10 }}>
              <Bot size={18} color="#38bdf8" />
              <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.45, margin: 0 }}>
                “Welcome to the skating park! Alex needs to reach the finish line and stop safely. But the park has three different surfaces. Can you discover how friction changes the stopping distance?”
              </p>
            </div>
            <button
              onClick={() => setStage('STAGE_4_MAKE_PREDICTION')}
              style={{
                background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                border: 'none',
                borderRadius: 6,
                color: '#ffffff',
                padding: '8px 16px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>Make a Scientific Prediction</span>
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* ── STAGE 4: MAKE A PREDICTION SELECTOR ── */}
        {stage === 'STAGE_4_MAKE_PREDICTION' && (
          <div style={{ borderTop: '1px solid rgba(148, 163, 184, 0.15)', paddingTop: 8 }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#facc15', marginBottom: 8 }}>
              Which surface will require the LONGEST stopping distance?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
              {[
                { opt: 'slippery', label: 'A. Slippery surface (Ice / Polished Resin)' },
                { opt: 'normal', label: 'B. Normal surface (Smooth Concrete)' },
                { opt: 'rough', label: 'C. Rough surface (Textured Tartan)' },
                { opt: 'not_sure', label: 'D. I am not sure. Let’s experiment!' },
              ].map(({ opt, label }) => (
                <button
                  key={opt}
                  onClick={() => makePrediction(opt as PredictionOption)}
                  style={{
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: 6,
                    padding: '8px 12px',
                    textAlign: 'left',
                    color: '#f8fafc',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#38bdf8';
                    e.currentTarget.style.background = 'rgba(2, 132, 199, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.2)';
                    e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Select an option to lock in your scientific hypothesis (+50 XP).
            </span>
          </div>
        )}

        {/* ── STAGE 5 / 6 / 7 / 8 MINIMAL STATUS ── */}
        {(stage === 'STAGE_5_EXPERIMENT' || stage === 'STAGE_6_SEE_RESULTS' || stage === 'STAGE_7_LEARN_CONCEPT' || stage === 'STAGE_8_EXPLORE_MORE') && (
          <div style={{ borderTop: '1px solid rgba(148, 163, 184, 0.15)', paddingTop: 8 }}>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4 }}>
              Active Track Surface: <strong style={{ color: SURFACES[selectedSurface].color }}>{SURFACES[selectedSurface].name}</strong> (μ = {SURFACES[selectedSurface].frictionCoeff})
            </div>
            {studentPrediction && (
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: 3 }}>
                Your Prediction: <strong style={{ color: '#facc15' }}>Option {studentPrediction.toUpperCase()}</strong>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Bottom Right: ARIA Companion Floating Button ── */}
      <div style={{ position: 'absolute', bottom: 24, right: 24, pointerEvents: 'auto', zIndex: 50 }}>
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
          title="Ask ARIA about Friction"
        >
          <Bot size={24} />
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
