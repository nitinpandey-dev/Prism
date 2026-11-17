import { useState } from 'react';
import { useGameStore } from '../../../stores/useGameStore';
import { useSkatingStore } from '../stores/useSkatingStore';
import { SURFACES } from '../types/skating';
import { Atom, ChevronDown, ChevronUp, BookOpen, GraduationCap, ChevronRight } from 'lucide-react';

export default function SkatingScienceHUD() {
  const [isOpen, setIsOpen] = useState(false);
  const learningMode = useGameStore((s) => s.learningMode);
  const { stage, setStage, selectedSurface, initialSpeed, lastMetrics } = useSkatingStore();

  const isStage7 = stage === 'STAGE_7_LEARN_CONCEPT';
  const effectiveOpen = isOpen || isStage7;

  return (
    <div
      style={{
        position: 'absolute',
        top: 80,
        left: 16,
        background: 'rgba(15, 23, 42, 0.90)',
        backdropFilter: 'blur(14px)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: 12,
        color: '#f8fafc',
        width: effectiveOpen ? 370 : 'auto',
        zIndex: 42,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* ── Toggle Header ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '10px 14px',
          background: 'transparent',
          border: 'none',
          color: '#38bdf8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          cursor: 'pointer',
          fontSize: '0.82rem',
          fontWeight: 700,
          letterSpacing: '0.04em',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Atom size={16} />
          <span>FRICTION DERIVATION</span>
        </div>
        {effectiveOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* ── Derivation Content ── */}
      {effectiveOpen && (
        <div style={{ padding: '0 14px 14px 14px', fontSize: '0.78rem', color: '#cbd5e1' }}>
          <div style={{ borderTop: '1px solid rgba(148, 163, 184, 0.15)', paddingTop: 10 }}>
            {/* Mode Title */}
            <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <GraduationCap size={15} />
              <span>
                {learningMode === 'school'
                  ? 'School Model: Constant Braking Resistance'
                  : 'University Level: Work-Energy Theorem'}
              </span>
            </div>

            {/* 1. Friction Force Equation */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginBottom: 2 }}>
                1. Friction Force (Coulomb Model):
              </div>
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.7)',
                  padding: '6px 10px',
                  borderRadius: 6,
                  fontFamily: 'monospace',
                  color: '#facc15',
                }}
              >
                F = μ · N = μ · (m · g)
              </div>
              <div style={{ fontSize: '0.70rem', color: '#94a3b8', marginTop: 2 }}>
                • <strong>μ</strong>: Friction coefficient ({SURFACES[selectedSurface].frictionCoeff})<br />
                • <strong>N</strong>: Normal contact force ({lastMetrics.normalForce} N)<br />
                • <strong>m</strong>: Skater mass (50 kg) • <strong>g</strong>: 9.81 m/s²
              </div>
            </div>

            {/* 2. Deceleration Equation */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginBottom: 2 }}>
                2. Newton’s Second Law (a = F / m):
              </div>
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.7)',
                  padding: '6px 10px',
                  borderRadius: 6,
                  fontFamily: 'monospace',
                  color: '#38bdf8',
                }}
              >
                a = (μ · m · g) / m = μ · g
              </div>
              <div style={{ fontSize: '0.70rem', color: '#94a3b8', marginTop: 2 }}>
                Notice mass cancels out! Alex decelerates at {lastMetrics.deceleration.toFixed(2)} m/s².
              </div>
            </div>

            {/* 3. Stopping Distance Equation */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginBottom: 2 }}>
                3. Stopping Distance (v² = v₀² - 2ad when v = 0):
              </div>
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.7)',
                  padding: '6px 10px',
                  borderRadius: 6,
                  fontFamily: 'monospace',
                  color: '#4ade80',
                  fontWeight: 700,
                }}
              >
                d = v₀² / (2 · μ · g)
              </div>
              <div style={{ fontSize: '0.70rem', color: '#94a3b8', marginTop: 2 }}>
                At {initialSpeed} m/s on {SURFACES[selectedSurface].name}:<br />
                d = {initialSpeed}² / (2 · {lastMetrics.frictionCoeff} · 9.81) = <strong>{lastMetrics.stoppingDistance} m</strong>
              </div>
            </div>

            {/* 4. University Mode Work-Energy Deep Dive */}
            {learningMode === 'university' && (
              <div
                style={{
                  background: 'rgba(124, 58, 237, 0.15)',
                  border: '1px solid #7c3aed',
                  borderRadius: 8,
                  padding: '8px 10px',
                  marginBottom: 10,
                }}
              >
                <div style={{ fontWeight: 700, color: '#c084fc', fontSize: '0.72rem', marginBottom: 2 }}>
                  Work-Energy Principle:
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#e9d5ff' }}>
                  W_nc = ΔE_k<br />
                  -F_friction · d = 0 - 0.5 · m · v₀²<br />
                  -μ · m · g · d = -0.5 · m · v₀²<br />
                  d = v₀² / (2μg)
                </div>
              </div>
            )}

            {/* Scientific Clarification Note */}
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontStyle: 'italic', lineHeight: 1.35 }}>
              *Model Note: The coefficients μ = 0.15, 0.40, and 0.75 represent effective braking resistance in this simplified educational model, not universal material constants.
            </div>

            {/* Stage 7 Next Button */}
            {isStage7 && (
              <button
                onClick={() => setStage('STAGE_8_EXPLORE_MORE')}
                style={{
                  marginTop: 12,
                  width: '100%',
                  padding: '10px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none',
                  borderRadius: 8,
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <span>Complete Mission (Stage 8)</span>
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
