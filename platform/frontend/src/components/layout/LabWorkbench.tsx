import React, { useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import ProjectileMotionSim from '../../simulations/ProjectileMotionSim';
import CrystalStructuresSim from '../../simulations/CrystalStructuresSim';
import FunctionVisualizerSim from '../../simulations/FunctionVisualizerSim';
import WaveSuperpositionSim from '../../simulations/WaveSuperpositionSim';
import GraphTraversalSim from '../../simulations/GraphTraversalSim';

const SIMULATIONS = [
  {
    id: 'projectile',
    num: '01',
    name: 'Projectile Motion',
    desc: 'Explore velocity, angle, gravity and trajectory.',
    subject: 'Physics',
  },
  {
    id: 'crystal',
    num: '02',
    name: 'Crystal Structures',
    desc: 'Visualize SC, BCC, and FCC solid-state unit cell geometry in 3D.',
    subject: 'Chemistry',
  },
  {
    id: 'function',
    num: '03',
    name: 'Function Visualizer',
    desc: 'Plot dynamic algebraic, trigonometric and exponential equations.',
    subject: 'Mathematics',
  },
  {
    id: 'waves',
    num: '04',
    name: 'Wave Superposition',
    desc: 'Visualize constructive, destructive, and beat interference patterns instantly.',
    subject: 'Physics',
  },
  {
    id: 'graph',
    num: '05',
    name: 'Graph Traversal',
    desc: 'Animate Breadth-First (BFS) and Depth-First (DFS) search across node graphs.',
    subject: 'Algorithms',
  },
];

export default function LabWorkbench() {
  const selectedLabSim = useGameStore((s) => s.selectedLabSim);
  const setSelectedLabSim = useGameStore((s) => s.setSelectedLabSim);
  const [activeSimId, setActiveSimId] = useState<string | null>(selectedLabSim || 'projectile');

  const handleSelectSim = (id: string) => {
    setActiveSimId(id);
    setSelectedLabSim(id);
  };

  const activeSim = SIMULATIONS.find((s) => s.id === activeSimId);

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 52px)',
        overflow: 'hidden',
        background: '#f8fafc',
      }}
    >
      {/* ── Secondary Sub-Nav Tabs for the 5 Simulators ── */}
      <div
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '0 20px',
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
        }}
      >
        {SIMULATIONS.map((sim) => (
          <button
            key={sim.id}
            onClick={() => handleSelectSim(sim.id)}
            style={{
              padding: '12px 16px',
              border: 'none',
              borderBottom: activeSimId === sim.id ? '2px solid #0284c7' : '2px solid transparent',
              background: 'transparent',
              color: activeSimId === sim.id ? '#0284c7' : '#64748b',
              fontWeight: activeSimId === sim.id ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s',
            }}
          >
            <span
              style={{
                fontSize: '0.72rem',
                fontFamily: 'monospace',
                background: activeSimId === sim.id ? '#e0f2fe' : '#f1f5f9',
                color: activeSimId === sim.id ? '#0284c7' : '#64748b',
                padding: '2px 6px',
                borderRadius: 4,
              }}
            >
              {sim.num}
            </span>
            <span>{sim.name}</span>
          </button>
        ))}
      </div>

      {/* ── Active Simulator Workspace View ── */}
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        {activeSimId === 'projectile' && <ProjectileMotionSim />}
        {activeSimId === 'crystal' && <CrystalStructuresSim />}
        {activeSimId === 'function' && <FunctionVisualizerSim />}
        {activeSimId === 'waves' && <WaveSuperpositionSim />}
        {activeSimId === 'graph' && <GraphTraversalSim />}
      </div>
    </div>
  );
}

