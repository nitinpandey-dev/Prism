import { useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { usePhysicsStore } from '../../stores/usePhysicsStore';
import { BookOpen, ChevronDown, ChevronUp, Atom } from 'lucide-react';

export default function ScienceHUD() {
  const [isOpen, setIsOpen] = useState(false);
  const learningMode = useGameStore((s) => s.learningMode);
  const { params, trajectory } = usePhysicsStore();
  const { metrics } = trajectory;

  const theta = params.launchAngle;
  const v0 = params.initialSpeed;
  const g = params.gravity;

  return (
    <div
      style={{
        position: 'absolute',
        top: 80,
        left: 16,
        background: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(148, 163, 184, 0.25)',
        borderRadius: 10,
        color: '#f8fafc',
        width: isOpen ? 340 : 'auto',
        zIndex: 40,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Toggle Bar */}
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
          <span>SCIENTIFIC DERIVATION</span>
        </div>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* Expanded Equation Content */}
      {isOpen && (
        <div style={{ padding: '0 14px 14px 14px', fontSize: '0.78rem', color: '#cbd5e1' }}>
          <div style={{ borderTop: '1px solid rgba(148, 163, 184, 0.15)', paddingTop: 10 }}>
            <div style={{ fontWeight: 600, color: '#38bdf8', marginBottom: 6 }}>
              {learningMode === 'school'
                ? 'Standard Kinematic Balistics (Vacuum)'
                : 'Numerical Aerodynamic Drag (Kepler-186f)'}
            </div>

            {/* Velocity Vectors */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.6)',
                padding: '8px 10px',
                borderRadius: 6,
                fontFamily: 'monospace',
                marginBottom: 8,
              }}
            >
              <div>v_0z = v0 · cos(θ) = {(v0 * Math.cos((theta * Math.PI) / 180)).toFixed(2)} m/s</div>
              <div>v_0y = v0 · sin(θ) = {(v0 * Math.sin((theta * Math.PI) / 180)).toFixed(2)} m/s</div>
            </div>

            {/* Trajectory Governing Equation */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginBottom: 2 }}>
                Trajectory Parabola Equation:
              </div>
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  padding: '8px 10px',
                  borderRadius: 6,
                  fontFamily: 'monospace',
                  color: '#facc15',
                  lineHeight: 1.4,
                }}
              >
                y(z) = y₀ + z·tan(θ) - (g · z²) / [2 · v₀² · cos²(θ)]
              </div>
            </div>

            {/* Mechanical Energy Conservation */}
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginBottom: 2 }}>
                Energy Conservation at Apex:
              </div>
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  padding: '8px 10px',
                  borderRadius: 6,
                  fontFamily: 'monospace',
                  fontSize: '0.74rem',
                }}
              >
                <div>E_total = 0.5 · m · v₀² = {(0.5 * params.projectileMass * v0 * v0).toFixed(0)} Joules</div>
                <div>Apex Potential E_p = {(params.projectileMass * g * metrics.maxHeight).toFixed(0)} J</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

