import React, { useState, useMemo } from 'react';
import { useAdventureStore } from './stores/useAdventureStore';
import { useGameStore } from '../../stores/useGameStore';
import { MISSIONS } from './types/adventure';
import DiscoveriesJournalModal from './components/modals/DiscoveriesJournalModal';
import AchievementsModal from './components/modals/AchievementsModal';
import SettingsModal from './components/modals/SettingsModal';
import {
  Compass,
  Sparkles,
  Trophy,
  BookOpen,
  Settings,
  Play,
  Volume2,
  VolumeX,
  Target,
  ArrowRight,
  ShieldCheck,
  Zap,
  Atom,
  Wind,
  Layers,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

// Geometric Prism Logo SVG
function PrismLogo({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <polygon points="12 2 2 22 22 22" />
      <line x1="12" y1="2" x2="12" y2="22" strokeDasharray="2 2" opacity="0.4" />
      <circle cx="12" cy="14" r="2.5" fill={color} stroke="none" />
    </svg>
  );
}

type FilterCategory = 'all' | '3d' | 'physics' | 'chemistry' | 'math';

export default function AdventureHub() {
  const {
    setScreen,
    setGameplayMode,
    completedMissionIds,
    unlockedDiscoveryIds,
    unlockedAchievementIds,
    playerXP,
    soundEnabled,
    toggleSound,
  } = useAdventureStore();

  const {
    setAppMode,
    setActiveActivity,
    learningMode,
    setLearningMode,
    setSelectedLabSim,
  } = useGameStore();

  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [isDemoModalOpen, setDemoModalOpen] = useState(false);
  const [isJournalOpen, setJournalOpen] = useState(false);
  const [isAchievementsOpen, setAchievementsOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  // Quick navigation handlers
  const handleLaunchSkating = () => {
    setActiveActivity('skating');
    setGameplayMode('free-play');
    setScreen('skating-world');
    setAppMode('story');
  };

  const handleLaunchOutpost = () => {
    setActiveActivity('outpost');
    setAppMode('story');
  };

  const handleLaunchLabSim = (simId: string) => {
    setSelectedLabSim(simId);
    setAppMode('lab');
  };

  const showcaseItems = useMemo(
    () => [
      {
        id: 'skating-world',
        type: '3d-world',
        category: '3d',
        code: 'PHY-ACT-001',
        title: 'Skating Science Adventure',
        domain: 'Friction, Grip & Stopping Distance',
        description:
          'Third-person 3D physics game. Control skater Alex across polished concrete, slick ice, and wooden boardwalk ramps with dynamic deceleration and stopping distance kinematics.',
        badge: '3D WORLD • FULLY PLAYABLE',
        badgeColor: '#0071e3',
        tags: ['Friction (F = μN)', 'Stopping Distance', 'Dynamic Grip', 'Third-Person 3D'],
        launchAction: handleLaunchSkating,
      },
      {
        id: 'outpost-theta',
        type: '3d-world',
        category: '3d',
        code: 'PHY-001',
        title: 'The Last Signal — Kepler Outpost',
        domain: 'Planetary Ballistics & Projectiles',
        description:
          'Futuristic research station simulation on Kepler-186f. Calibrate mortar angles and initial velocity to launch emergency rescue capsules across a 120-meter canyon.',
        badge: '3D MISSION • CANYON RESCUE',
        badgeColor: '#818cf8',
        tags: ['Vacuum Kinematics', 'Elevation Delta', 'Differential Drag', 'ARIA Companion'],
        launchAction: handleLaunchOutpost,
      },
      {
        id: 'projectile-motion',
        type: 'lab-sim',
        category: 'physics',
        code: 'PHY-002',
        title: 'Kinematics & Trajectory Solver',
        domain: 'Analytical 2D Ballistics',
        description:
          'Compute parametric flight paths, vertex altitudes, flight duration, and impact vectors with real-time parametric plots and differential drag comparisons.',
        badge: 'PHYSICS LAB',
        badgeColor: '#f59e0b',
        tags: ['Launch Velocity', 'Range Equation', 'Time of Flight', 'Aerodynamic Drag'],
        launchAction: () => handleLaunchLabSim('projectile'),
      },
      {
        id: 'solid-state',
        type: 'lab-sim',
        category: 'chemistry',
        code: 'CHEM-001',
        title: 'Crystal Lattice Explorer',
        domain: 'Solid State Chemistry & Materials',
        description:
          'Interactive 3D unit cells. Explore Simple Cubic (SC), Body-Centered Cubic (BCC), and Face-Centered Cubic (FCC) lattice geometries with packing efficiency equations.',
        badge: 'MATERIALS LAB',
        badgeColor: '#a855f7',
        tags: ['FCC & BCC Lattice', 'Packing Fraction', 'Unit Cells', 'Coordination Number'],
        launchAction: () => handleLaunchLabSim('crystal'),
      },
      {
        id: 'wave-superposition',
        type: 'lab-sim',
        category: 'physics',
        code: 'PHY-003',
        title: 'Wave Superposition & Harmonics',
        domain: 'Wave Mechanics & Interference',
        description:
          'Simulate continuous wave superposition in real-time. Analyze constructive and destructive phase interference, nodes, antinodes, and standing harmonic modes.',
        badge: 'PHYSICS LAB',
        badgeColor: '#0284c7',
        tags: ['Superposition', 'Standing Waves', 'Phase Shift', 'Harmonic Frequencies'],
        launchAction: () => handleLaunchLabSim('waves'),
      },
      {
        id: 'function-explorer',
        type: 'lab-sim',
        category: 'math',
        code: 'MATH-001',
        title: 'Dynamic Calculus & Function Visualizer',
        domain: 'Mathematical Analysis',
        description:
          'Real-time Cartesian function plotter. Analyze continuous polynomials, trigonometric curves, and asymptotic behavior with dynamic derivative slope visualizers.',
        badge: 'CALCULUS LAB',
        badgeColor: '#10b981',
        tags: ['Derivatives', 'Local Extrema', 'Polynomial Roots', 'Trigonometry'],
        launchAction: () => handleLaunchLabSim('function'),
      },
      {
        id: 'graph-traversal',
        type: 'lab-sim',
        category: 'math',
        code: 'CS-001',
        title: 'Graph Algorithms & State Traversal',
        domain: 'Computer Science & Graph Theory',
        description:
          'Step-by-step interactive execution of Breadth-First Search (BFS) and Depth-First Search (DFS) algorithms with queue, stack, and visited node indicators.',
        badge: 'ALGORITHMS LAB',
        badgeColor: '#f43f5e',
        tags: ['BFS Traversal', 'DFS Traversal', 'Adjacency Matrix', 'Graph Theory'],
        launchAction: () => handleLaunchLabSim('graph'),
      },
    ],
    []
  );

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return showcaseItems;
    return showcaseItems.filter((item) => item.category === activeFilter);
  }, [activeFilter, showcaseItems]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        background: '#ffffff',
        color: '#1d1d1f',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        scrollBehavior: 'smooth',
      }}
    >
      {/* ── 1. GLOBAL TOP NAVIGATION BAR (Apple Minimal UI Structure) ── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(255, 255, 255, 0.82)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 20px',
        }}
      >
        <div
          style={{
            maxWidth: '1024px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            fontWeight: 400,
            color: 'rgba(0, 0, 0, 0.8)',
          }}
        >
          <a
            href="#hero"
            style={{
              color: '#1d1d1f',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '13px',
              letterSpacing: '-0.01em',
            }}
          >
            <PrismLogo size={18} color="#1d1d1f" />
            <span>PRISM</span>
          </a>

          <a href="#overview" style={{ color: 'rgba(0, 0, 0, 0.8)', textDecoration: 'none', cursor: 'pointer' }}>
            Overview
          </a>
          <a href="#worlds" style={{ color: 'rgba(0, 0, 0, 0.8)', textDecoration: 'none', cursor: 'pointer' }}>
            3D Worlds
          </a>
          <a href="#simulators" style={{ color: 'rgba(0, 0, 0, 0.8)', textDecoration: 'none', cursor: 'pointer' }}>
            Lab Simulators
          </a>
          <a href="#missions" style={{ color: 'rgba(0, 0, 0, 0.8)', textDecoration: 'none', cursor: 'pointer' }}>
            Missions
          </a>
          <span
            onClick={() => setJournalOpen(true)}
            style={{ cursor: 'pointer', color: 'rgba(0, 0, 0, 0.8)' }}
          >
            Discoveries ({unlockedDiscoveryIds.length})
          </span>
          <span
            onClick={() => setAchievementsOpen(true)}
            style={{ cursor: 'pointer', color: 'rgba(0, 0, 0, 0.8)' }}
          >
            Achievements ({unlockedAchievementIds.length})
          </span>
          <a href="#technology" style={{ color: 'rgba(0, 0, 0, 0.8)', textDecoration: 'none', cursor: 'pointer' }}>
            Physics Engine
          </a>

          {/* Utility Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={toggleSound}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: soundEnabled ? '#0071e3' : '#86868b',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
              }}
              title={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
            >
              {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'rgba(0, 0, 0, 0.8)',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
              }}
              title="Settings & Accessibility"
            >
              <Settings size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* ── 2. STICKY SUB-NAVIGATION BAR (Apple Product Subnav Layout) ── */}
      <nav
        style={{
          position: 'sticky',
          top: '44px',
          zIndex: 90,
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          height: '52px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1024px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '21px',
                fontWeight: 600,
                color: '#1d1d1f',
                letterSpacing: '-0.02em',
              }}
            >
              Science Adventure
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#0071e3',
                background: 'rgba(0, 113, 227, 0.08)',
                padding: '2px 8px',
                borderRadius: '980px',
                letterSpacing: '0.04em',
              }}
            >
              AGE 10–15
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <a
              href="#overview"
              style={{
                fontSize: '12px',
                color: '#000000',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Overview
            </a>
            <a
              href="#specs"
              style={{
                fontSize: '12px',
                color: '#6e6e73',
                textDecoration: 'none',
                fontWeight: 400,
              }}
            >
              Tech Specs
            </a>
            <button
              onClick={() => setDemoModalOpen(true)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(0, 0, 0, 0.25)',
                color: '#1d1d1f',
                borderRadius: '980px',
                padding: '4px 14px',
                fontSize: '12px',
                fontWeight: 400,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Choose Mode
            </button>
            <button
              onClick={handleLaunchSkating}
              style={{
                background: '#0071e3',
                border: 'none',
                color: '#ffffff',
                borderRadius: '980px',
                padding: '4px 16px',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
            >
              Play 3D
            </button>
          </div>
        </div>
      </nav>

      {/* ── 3. HERO STAGE (Apple Vision Pro Layout Structure) ── */}
      <section
        id="hero"
        style={{
          position: 'relative',
          width: '100%',
          minHeight: 'calc(100vh - 96px)',
          maxHeight: '840px',
          background: '#f5f5f7',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '20px 24px 60px 24px',
          boxSizing: 'border-box',
        }}
      >
        {/* Centered Featured Showcase: 3D Studio Physics Showcase Card */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '860px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Spatial Simulation Showcase Ring / Visual Card */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '680px',
              height: '360px',
              borderRadius: '32px',
              background: 'linear-gradient(135deg, #091726 0%, #112840 50%, #1e3a5f 100%)',
              boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '36px',
              boxSizing: 'border-box',
              color: '#ffffff',
            }}
          >
            {/* Top Bar of the Card */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    background: '#00d2ff',
                    color: '#091726',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    padding: '4px 10px',
                    borderRadius: '980px',
                  }}
                >
                  3D SIMULATION ENGINE
                </span>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>PHY-ACT-001</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.12)', padding: '3px 10px', borderRadius: '980px' }}>
                  60 FPS WebGL
                </span>
                <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.12)', padding: '3px 10px', borderRadius: '980px' }}>
                  Friction F = μN
                </span>
              </div>
            </div>

            {/* Central Stage Graphic: Interactive Surface Kinematics */}
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <h2
                style={{
                  fontSize: 'clamp(28px, 3.5vw, 42px)',
                  fontWeight: 700,
                  letterSpacing: '-0.025em',
                  margin: '0 0 10px 0',
                  color: '#ffffff',
                }}
              >
                Skating World: Kinetic Friction & Grip
              </h2>
              <p
                style={{
                  fontSize: '15px',
                  color: '#cbd5e1',
                  maxWidth: '520px',
                  margin: '0 auto',
                  lineHeight: 1.5,
                }}
              >
                Let children experience science before introducing scientific concepts. Feel how polished concrete, slick ice, and wooden boardwalk ramps alter stopping distance.
              </p>
            </div>

            {/* Bottom Surface Pill Badges */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontSize: '12px', background: 'rgba(0, 210, 255, 0.15)', border: '1px solid rgba(0, 210, 255, 0.4)', color: '#00d2ff', padding: '5px 14px', borderRadius: '980px' }}>
                Concrete: μ = 0.70 (High Grip)
              </span>
              <span style={{ fontSize: '12px', background: 'rgba(165, 243, 252, 0.15)', border: '1px solid rgba(165, 243, 252, 0.4)', color: '#a5f3fc', padding: '5px 14px', borderRadius: '980px' }}>
                Ice: μ = 0.05 (Low Friction)
              </span>
              <span style={{ fontSize: '12px', background: 'rgba(251, 146, 60, 0.15)', border: '1px solid rgba(251, 146, 60, 0.4)', color: '#fb923c', padding: '5px 14px', borderRadius: '980px' }}>
                Wood Boardwalk: μ = 0.40
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Left Lockup: Brand Title & Philosophy Subtitle */}
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            left: 'clamp(24px, 6vw, 80px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <PrismLogo size={42} color="#1d1d1f" />
            <h1
              style={{
                margin: 0,
                fontSize: 'clamp(34px, 4.2vw, 52px)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: '#1d1d1f',
                lineHeight: 1,
              }}
            >
              Science Adventure
            </h1>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(16px, 1.8vw, 22px)',
              fontWeight: 400,
              color: '#1d1d1f',
              letterSpacing: '-0.015em',
            }}
          >
            Explore. Play. Experiment. Discover.
          </p>
        </div>

        {/* Bottom Right Actions: Pill Buttons side by side */}
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            right: 'clamp(24px, 6vw, 80px)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            zIndex: 10,
          }}
        >
          <button
            onClick={() => {
              const el = document.getElementById('worlds');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              background: '#ffffff',
              border: '1px solid #1d1d1f',
              color: '#1d1d1f',
              borderRadius: '980px',
              padding: '10px 22px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#000000';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.color = '#1d1d1f';
            }}
          >
            Explore Worlds
          </button>

          <button
            onClick={handleLaunchSkating}
            style={{
              background: '#1d1d1f',
              border: 'none',
              color: '#ffffff',
              borderRadius: '980px',
              padding: '10px 26px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
              transition: 'background 0.2s ease',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#0071e3';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#1d1d1f';
            }}
          >
            Play Skating 3D
          </button>
        </div>
      </section>

      {/* ── 4. EXPERIENTIAL SCIENCE OVERVIEW (Apple Typography Section) ── */}
      <section
        id="overview"
        style={{
          width: '100%',
          background: '#ffffff',
          padding: '120px 24px 100px 24px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '860px', width: '100%' }}>
          <p
            style={{
              fontSize: '14px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#6e6e73',
              marginBottom: '16px',
            }}
          >
            Product Philosophy
          </p>
          <h2
            style={{
              fontSize: 'clamp(36px, 5.5vw, 64px)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: '#1d1d1f',
              lineHeight: 1.08,
              margin: '0 0 28px 0',
            }}
          >
            Experience science before introducing concepts.
          </h2>
          <p
            style={{
              fontSize: 'clamp(18px, 2.2vw, 24px)',
              fontWeight: 400,
              lineHeight: 1.45,
              color: '#6e6e73',
              letterSpacing: '-0.015em',
              margin: '0 auto 48px auto',
              maxWidth: '740px',
            }}
          >
            Children already understand how the physical world works through everyday play—knowing that ice is slippery, bikes take time to brake, and balls roll differently on grass. We turn natural intuition into scientific mastery through playable 3D adventures.
          </p>
        </div>

        {/* ── SPATIAL EXPERIENCES CARDS (Apple 2-Column Showcase) ── */}
        <div
          id="worlds"
          style={{
            maxWidth: '1080px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px',
            marginTop: '20px',
            textAlign: 'left',
          }}
        >
          {/* Card 1: Skating World */}
          <div
            style={{
              background: '#f5f5f7',
              borderRadius: '28px',
              padding: '48px 40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '400px',
              boxSizing: 'border-box',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#0071e3',
                }}
              >
                3D Simulation • PHY-ACT-001
              </span>
              <h3
                style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: '#1d1d1f',
                  letterSpacing: '-0.02em',
                  margin: '12px 0 16px 0',
                }}
              >
                Skating World: Friction & Stopping Distance
              </h3>
              <p
                style={{
                  fontSize: '16px',
                  color: '#6e6e73',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                Third-person 3D physics environment. Control skater Alex wearing helmet and gear across smooth concrete, frictionless ice, and elevated wooden boardwalk ramps with dynamic deceleration.
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '20px' }}>
                <span style={{ fontSize: '11px', background: 'rgba(0,0,0,0.06)', padding: '4px 10px', borderRadius: '980px', color: '#1d1d1f' }}>
                  F = μN
                </span>
                <span style={{ fontSize: '11px', background: 'rgba(0,0,0,0.06)', padding: '4px 10px', borderRadius: '980px', color: '#1d1d1f' }}>
                  Stopping Distance d = v² / (2μg)
                </span>
                <span style={{ fontSize: '11px', background: 'rgba(0,0,0,0.06)', padding: '4px 10px', borderRadius: '980px', color: '#1d1d1f' }}>
                  Dynamic Grip
                </span>
              </div>
            </div>

            <div style={{ marginTop: '36px' }}>
              <button
                onClick={handleLaunchSkating}
                style={{
                  background: '#1d1d1f',
                  border: 'none',
                  color: '#ffffff',
                  borderRadius: '980px',
                  padding: '12px 26px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#0071e3')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#1d1d1f')}
              >
                Enter 3D Skate Park
              </button>
            </div>
          </div>

          {/* Card 2: Kepler Outpost */}
          <div
            style={{
              background: '#f5f5f7',
              borderRadius: '28px',
              padding: '48px 40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '400px',
              boxSizing: 'border-box',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#818cf8',
                }}
              >
                3D Mission • PHY-001
              </span>
              <h3
                style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: '#1d1d1f',
                  letterSpacing: '-0.02em',
                  margin: '12px 0 16px 0',
                }}
              >
                The Last Signal — Kepler Outpost
              </h3>
              <p
                style={{
                  fontSize: '16px',
                  color: '#6e6e73',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                Planetary research station canyon on Kepler-186f. Calibrate elevation angles and ballistic velocity to launch emergency rescue capsules across a 120-meter canyon with ARIA guidance.
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '20px' }}>
                <span style={{ fontSize: '11px', background: 'rgba(0,0,0,0.06)', padding: '4px 10px', borderRadius: '980px', color: '#1d1d1f' }}>
                  2D Ballistic Parabola
                </span>
                <span style={{ fontSize: '11px', background: 'rgba(0,0,0,0.06)', padding: '4px 10px', borderRadius: '980px', color: '#1d1d1f' }}>
                  Elevation Delta Δy = -35m
                </span>
                <span style={{ fontSize: '11px', background: 'rgba(0,0,0,0.06)', padding: '4px 10px', borderRadius: '980px', color: '#1d1d1f' }}>
                  ARIA AI Tutor
                </span>
              </div>
            </div>

            <div style={{ marginTop: '36px' }}>
              <button
                onClick={handleLaunchOutpost}
                style={{
                  background: '#1d1d1f',
                  border: 'none',
                  color: '#ffffff',
                  borderRadius: '980px',
                  padding: '12px 26px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#818cf8')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#1d1d1f')}
              >
                Launch Outpost Mission
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. STEM LAB WORKSTATION SIMULATORS (Infinite Canvas Grid) ── */}
      <section
        id="simulators"
        style={{
          width: '100%',
          background: '#f5f5f7',
          padding: '100px 24px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ maxWidth: '1080px', width: '100%', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
            <div>
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#6e6e73',
                  margin: '0 0 10px 0',
                }}
              >
                Interactive Laboratories
              </p>
              <h2
                style={{
                  fontSize: 'clamp(32px, 4.5vw, 48px)',
                  fontWeight: 700,
                  letterSpacing: '-0.025em',
                  color: '#1d1d1f',
                  margin: 0,
                }}
              >
                Analytical STEM Simulators.
              </h2>
            </div>

            {/* Apple-style Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(['all', '3d', 'physics', 'chemistry', 'math'] as FilterCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  style={{
                    border: 'none',
                    borderRadius: '980px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    background: activeFilter === cat ? '#1d1d1f' : '#ffffff',
                    color: activeFilter === cat ? '#ffffff' : '#6e6e73',
                    boxShadow: activeFilter === cat ? '0 2px 8px rgba(0,0,0,0.12)' : '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {cat === 'all' ? 'All Simulators' : cat === '3d' ? '3D Worlds' : cat}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
              gap: '24px',
            }}
          >
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={item.launchAction}
                style={{
                  background: '#ffffff',
                  borderRadius: '24px',
                  padding: '36px 32px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '260px',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 14px 28px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.04)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.06em',
                        color: item.badgeColor,
                        textTransform: 'uppercase',
                      }}
                    >
                      {item.badge}
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>
                      {item.code}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '21px', fontWeight: 600, margin: '0 0 10px 0', color: '#1d1d1f', letterSpacing: '-0.015em' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '14px', color: '#6e6e73', margin: 0, lineHeight: 1.5 }}>
                    {item.description}
                  </p>
                </div>

                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {item.tags.slice(0, 2).map((t) => (
                      <span key={t} style={{ fontSize: '11px', background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '6px' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#0071e3', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Open &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. LEARNING MISSIONS PROGRESS SECTION ── */}
      <section
        id="missions"
        style={{
          width: '100%',
          background: '#ffffff',
          padding: '100px 24px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ maxWidth: '1080px', width: '100%', textAlign: 'left' }}>
          <p
            style={{
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#6e6e73',
              marginBottom: '10px',
            }}
          >
            Structured Discovery Loop
          </p>
          <h2
            style={{
              fontSize: 'clamp(32px, 4.5vw, 48px)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: '#1d1d1f',
              margin: '0 0 16px 0',
            }}
          >
            Missions & Learning Moments.
          </h2>
          <p
            style={{
              fontSize: '18px',
              color: '#6e6e73',
              margin: '0 0 40px 0',
              maxWidth: '680px',
              lineHeight: 1.5,
            }}
          >
            Introduce missions only after free exploration. Scientific concepts are revealed as aha moments upon mission completion.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {MISSIONS.map((m) => {
              const isCompleted = completedMissionIds.includes(m.id);
              return (
                <div
                  key={m.id}
                  style={{
                    background: '#f5f5f7',
                    borderRadius: '20px',
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '180px',
                    border: isCompleted ? '1px solid #10b981' : '1px solid transparent',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: isCompleted ? '#10b981' : '#64748b' }}>
                        MISSION {m.id}
                      </span>
                      {isCompleted && (
                        <span style={{ fontSize: '11px', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '980px', fontWeight: 600 }}>
                          COMPLETED
                        </span>
                      )}
                    </div>
                    <h4 style={{ fontSize: '18px', fontWeight: 600, color: '#1d1d1f', margin: '0 0 8px 0' }}>
                      {m.title}
                    </h4>
                    <p style={{ fontSize: '14px', color: '#6e6e73', margin: 0, lineHeight: 1.45 }}>
                      {m.description}
                    </p>
                  </div>

                  <button
                    onClick={handleLaunchSkating}
                    style={{
                      marginTop: '20px',
                      background: isCompleted ? '#ffffff' : '#1d1d1f',
                      border: isCompleted ? '1px solid #d1d5db' : 'none',
                      color: isCompleted ? '#1d1d1f' : '#ffffff',
                      borderRadius: '980px',
                      padding: '8px 18px',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      width: 'fit-content',
                    }}
                  >
                    {isCompleted ? 'Replay Mission' : 'Start Mission'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 7. TECHNOLOGY & PHYSICS BREAKTHROUGH (Apple Signature Dark Section) ── */}
      <section
        id="technology"
        style={{
          width: '100%',
          background: '#000000',
          color: '#f5f5f7',
          padding: '120px 24px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '880px', width: '100%' }}>
          <p
            style={{
              fontSize: '14px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#86868b',
              marginBottom: '16px',
            }}
          >
            Engineering Foundation
          </p>
          <h2
            style={{
              fontSize: 'clamp(36px, 5.5vw, 64px)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: '#f5f5f7',
              lineHeight: 1.08,
              margin: '0 0 28px 0',
            }}
          >
            Breakthrough simulation physics.
          </h2>
          <p
            style={{
              fontSize: 'clamp(18px, 2.2vw, 24px)',
              fontWeight: 400,
              lineHeight: 1.45,
              color: '#86868b',
              letterSpacing: '-0.015em',
              margin: '0 auto 64px auto',
            }}
          >
            Deterministic mathematical precision underneath playful adventures. Real physical models simulate inertia, surface friction, drag, and harmonic interference.
          </p>
        </div>

        {/* 4 Pillars in Apple Spec Grid */}
        <div
          style={{
            maxWidth: '1080px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '32px',
            textAlign: 'left',
          }}
        >
          <div style={{ padding: '24px 0', borderTop: '1px solid #333336' }}>
            <h3 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 12px 0', color: '#00d2ff' }}>
              F = μN
            </h3>
            <h4 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 8px 0', color: '#f5f5f7' }}>
              Kinetic Friction
            </h4>
            <p style={{ fontSize: '14px', color: '#86868b', lineHeight: 1.5, margin: 0 }}>
              Real Coulomb-Amontons friction calculations dynamically resolve tangential deceleration on each contact patch.
            </p>
          </div>

          <div style={{ padding: '24px 0', borderTop: '1px solid #333336' }}>
            <h3 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 12px 0', color: '#818cf8' }}>
              60 FPS
            </h3>
            <h4 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 8px 0', color: '#f5f5f7' }}>
              Verlet Integration
            </h4>
            <p style={{ fontSize: '14px', color: '#86868b', lineHeight: 1.5, margin: 0 }}>
              Fixed-timestep numerical integration preserves energy conservation and provides smooth, reliable collision resolution.
            </p>
          </div>

          <div style={{ padding: '24px 0', borderTop: '1px solid #333336' }}>
            <h3 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 12px 0', color: '#10b981' }}>
              ARIA
            </h3>
            <h4 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 8px 0', color: '#f5f5f7' }}>
              Intelligent Companion
            </h4>
            <p style={{ fontSize: '14px', color: '#86868b', lineHeight: 1.5, margin: 0 }}>
              Context-aware pedagogical dialogue system provides scaffolded hints, encourages persistence, and celebrates discoveries.
            </p>
          </div>

          <div style={{ padding: '24px 0', borderTop: '1px solid #333336' }}>
            <h3 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 12px 0', color: '#f59e0b' }}>
              0% Stress
            </h3>
            <h4 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 8px 0', color: '#f5f5f7' }}>
              Zero Penalties
            </h4>
            <p style={{ fontSize: '14px', color: '#86868b', lineHeight: 1.5, margin: 0 }}>
              No time limits, no streaks, no punishments for unsuccessful attempts. Children learn by trying, observing, and iterating.
            </p>
          </div>
        </div>
      </section>

      {/* ── 8. TECHNICAL SPECIFICATIONS TABLE (Apple 2-Column Matrix) ── */}
      <section
        id="specs"
        style={{
          width: '100%',
          background: '#ffffff',
          padding: '100px 24px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ maxWidth: '860px', width: '100%', textAlign: 'left' }}>
          <p
            style={{
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#6e6e73',
              marginBottom: '10px',
            }}
          >
            Technical Architecture
          </p>
          <h2
            style={{
              fontSize: 'clamp(32px, 4.5vw, 48px)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: '#1d1d1f',
              margin: '0 0 48px 0',
            }}
          >
            Platform Specifications.
          </h2>

          <div style={{ borderTop: '1px solid #d2d2d7' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', padding: '28px 0', borderBottom: '1px solid #d2d2d7' }}>
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#1d1d1f' }}>3D Graphics</span>
              <div style={{ fontSize: '15px', color: '#6e6e73', lineHeight: 1.6 }}>
                Three.js WebGL & React Three Fiber • Directional soft shadows • Dynamic camera follow • Optimized low-poly procedural assets with stable 60 FPS.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', padding: '28px 0', borderBottom: '1px solid #d2d2d7' }}>
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#1d1d1f' }}>Physics Models</span>
              <div style={{ fontSize: '15px', color: '#6e6e73', lineHeight: 1.6 }}>
                Real Coulomb-Amontons friction (μ = 0.05 to 0.70) • Parabolic projectile ballistics with delta elevation • Ray-cast collision detection & boundary clamping.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', padding: '28px 0', borderBottom: '1px solid #d2d2d7' }}>
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#1d1d1f' }}>Target Learners</span>
              <div style={{ fontSize: '15px', color: '#6e6e73', lineHeight: 1.6 }}>
                Children aged 10–15 years • Multi-tiered reading levels • Zero prerequisite scientific terminology required.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', padding: '28px 0', borderBottom: '1px solid #d2d2d7' }}>
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#1d1d1f' }}>Input & Controls</span>
              <div style={{ fontSize: '15px', color: '#6e6e73', lineHeight: 1.6 }}>
                Desktop WASD / Arrow keys + Spacebar brake • Responsive on-screen virtual joystick for touchscreen and tablet devices.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', padding: '28px 0', borderBottom: '1px solid #d2d2d7' }}>
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#1d1d1f' }}>Accessibility</span>
              <div style={{ fontSize: '15px', color: '#6e6e73', lineHeight: 1.6 }}>
                Optional audio and SFX • High-contrast typography • No flashing effects • Fully offline client-side simulation execution.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. PLATFORM GLOBAL FOOTER (Apple Directory Structure) ── */}
      <footer
        style={{
          width: '100%',
          background: '#f5f5f7',
          color: '#6e6e73',
          fontSize: '12px',
          padding: '40px 24px 30px 24px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderTop: '1px solid #d2d2d7',
        }}
      >
        <div style={{ maxWidth: '1024px', width: '100%' }}>
          {/* Pedagogical Note */}
          <div
            style={{
              paddingBottom: '24px',
              borderBottom: '1px solid #d2d2d7',
              lineHeight: 1.6,
              fontSize: '11px',
              color: '#86868b',
            }}
          >
            Science Adventure is built upon the core philosophy that children should experience science through play before formal scientific concepts are introduced. All simulations run locally in high-performance WebGL.
          </div>

          {/* Directory Links Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '24px',
              padding: '24px 0',
              borderBottom: '1px solid #d2d2d7',
            }}
          >
            <div>
              <h5 style={{ color: '#1d1d1f', fontSize: '12px', fontWeight: 600, margin: '0 0 10px 0' }}>
                3D Worlds
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ cursor: 'pointer', color: '#1d1d1f', fontWeight: 500 }} onClick={handleLaunchSkating}>
                  Skating World (Friction)
                </span>
                <span style={{ cursor: 'pointer' }} onClick={handleLaunchOutpost}>
                  Kepler Outpost (Ballistics)
                </span>
                <span style={{ color: '#94a3b8' }}>Cycling World (Coming Soon)</span>
                <span style={{ color: '#94a3b8' }}>Football World (Coming Soon)</span>
                <span style={{ color: '#94a3b8' }}>Kite Flying (Coming Soon)</span>
              </div>
            </div>

            <div>
              <h5 style={{ color: '#1d1d1f', fontSize: '12px', fontWeight: 600, margin: '0 0 10px 0' }}>
                Lab Simulators
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ cursor: 'pointer' }} onClick={() => handleLaunchLabSim('projectile')}>
                  Kinematics Solver
                </span>
                <span style={{ cursor: 'pointer' }} onClick={() => handleLaunchLabSim('crystal')}>
                  Crystal Lattice
                </span>
                <span style={{ cursor: 'pointer' }} onClick={() => handleLaunchLabSim('waves')}>
                  Wave Harmonics
                </span>
                <span style={{ cursor: 'pointer' }} onClick={() => handleLaunchLabSim('function')}>
                  Calculus Visualizer
                </span>
                <span style={{ cursor: 'pointer' }} onClick={() => handleLaunchLabSim('graph')}>
                  Graph Traversal
                </span>
              </div>
            </div>

            <div>
              <h5 style={{ color: '#1d1d1f', fontSize: '12px', fontWeight: 600, margin: '0 0 10px 0' }}>
                Student Progress
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ cursor: 'pointer' }} onClick={() => setJournalOpen(true)}>
                  Discoveries Journal ({unlockedDiscoveryIds.length})
                </span>
                <span style={{ cursor: 'pointer' }} onClick={() => setAchievementsOpen(true)}>
                  Achievements ({unlockedAchievementIds.length})
                </span>
                <span style={{ cursor: 'pointer' }}>Total XP: {playerXP}</span>
              </div>
            </div>

            <div>
              <h5 style={{ color: '#1d1d1f', fontSize: '12px', fontWeight: 600, margin: '0 0 10px 0' }}>
                Platform
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ cursor: 'pointer' }} onClick={() => setSettingsOpen(true)}>
                  Settings & Audio
                </span>
                <span style={{ cursor: 'pointer' }}>Accessibility Controls</span>
                <span style={{ cursor: 'pointer' }}>Pedagogical Design</span>
              </div>
            </div>
          </div>

          {/* Copyright & Legal Bar */}
          <div
            style={{
              paddingTop: '20px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              fontSize: '11px',
            }}
          >
            <div>
              Copyright © 2026 PRISM Learning Platform. All rights reserved.
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
              <span>|</span>
              <span style={{ cursor: 'pointer' }}>Terms of Use</span>
              <span>|</span>
              <span style={{ cursor: 'pointer' }}>Educational Standards</span>
              <span>|</span>
              <span style={{ cursor: 'pointer' }}>Open Source</span>
            </div>

            <div style={{ color: '#1d1d1f', fontWeight: 500 }}>
              PRISM Interactive STEM
            </div>
          </div>
        </div>
      </footer>

      {/* ── MODE SELECTOR MODAL (Choose Mode) ── */}
      {isDemoModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setDemoModalOpen(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '36px',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <PrismLogo size={32} color="#1d1d1f" />
            <h3
              style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#1d1d1f',
                margin: '12px 0 6px 0',
                letterSpacing: '-0.02em',
              }}
            >
              Choose Adventure Mode
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: '#6e6e73',
                margin: '0 0 28px 0',
                lineHeight: 1.5,
              }}
            >
              Select an activity to begin your experiential science journey:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <button
                onClick={() => {
                  setDemoModalOpen(false);
                  handleLaunchSkating();
                }}
                style={{
                  background: '#f5f5f7',
                  border: '1px solid #e5e5ea',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#e5e5ea')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#f5f5f7')}
              >
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#1d1d1f' }}>
                    Skating World: Free Play
                  </div>
                  <div style={{ fontSize: '13px', color: '#6e6e73' }}>
                    Explore friction, grip & stopping distance in 3D
                  </div>
                </div>
                <span style={{ fontSize: '18px', color: '#0071e3' }}>&rarr;</span>
              </button>

              <button
                onClick={() => {
                  setDemoModalOpen(false);
                  handleLaunchOutpost();
                }}
                style={{
                  background: '#f5f5f7',
                  border: '1px solid #e5e5ea',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#e5e5ea')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#f5f5f7')}
              >
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#1d1d1f' }}>
                    The Last Signal: Kepler Outpost
                  </div>
                  <div style={{ fontSize: '13px', color: '#6e6e73' }}>
                    Calibrate projectile trajectories across a 120m canyon
                  </div>
                </div>
                <span style={{ fontSize: '18px', color: '#0071e3' }}>&rarr;</span>
              </button>
            </div>

            <button
              onClick={() => setDemoModalOpen(false)}
              style={{
                marginTop: '24px',
                background: 'none',
                border: 'none',
                color: '#86868b',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── MODALS FOR DISCOVERIES, ACHIEVEMENTS, AND SETTINGS ── */}
      {isJournalOpen && <DiscoveriesJournalModal onClose={() => setJournalOpen(false)} />}
      {isAchievementsOpen && <AchievementsModal onClose={() => setAchievementsOpen(false)} />}
      {isSettingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
