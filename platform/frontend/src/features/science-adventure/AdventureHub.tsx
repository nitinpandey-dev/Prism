import { useState, useMemo } from 'react';
import { useAdventureStore } from './stores/useAdventureStore';
import { MISSIONS } from './types/adventure';
import { useGameStore } from '../../stores/useGameStore';
import DiscoveriesJournalModal from './components/modals/DiscoveriesJournalModal';
import AchievementsModal from './components/modals/AchievementsModal';
import SettingsModal from './components/modals/SettingsModal';
import {
  Sparkles,
  Trophy,
  BookOpen,
  Settings,
  Play,
  CheckCircle2,
  ArrowRight,
  Flame,
  GraduationCap,
  FlaskConical,
  Volume2,
  VolumeX,
  Target,
  Zap,
  Layers,
  Compass,
  Cpu,
  Atom,
  Wind,
  ShieldCheck,
} from 'lucide-react';

type FilterCategory = 'all' | '3d' | 'physics' | 'chemistry' | 'math';

interface ShowcaseItem {
  id: string;
  type: '3d-world' | 'lab-sim';
  category: '3d' | 'physics' | 'chemistry' | 'math';
  code: string;
  title: string;
  domain: string;
  description: string;
  badge: string;
  badgeColor: string;
  accentGradient: string;
  tags: string[];
  launchAction: () => void;
}

export default function AdventureHub() {
  const {
    setScreen,
    setGameplayMode,
    startMission,
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

  // Studio-grade Showcase Items
  const showcaseItems: ShowcaseItem[] = useMemo(
    () => [
      {
        id: 'skating-world',
        type: '3d-world',
        category: '3d',
        code: 'PHY-ACT-001',
        title: 'Skating Science Adventure',
        domain: 'Friction, Grip & Stopping Distance',
        description:
          'Third-person 3D physics game. Control skater Alex across polished concrete, slick ice, and wooden ramps with dynamic deceleration and stopping distance kinematics.',
        badge: '3D EXPERIENCE',
        badgeColor: '#00d2ff',
        accentGradient: 'linear-gradient(135deg, #09203f, #1e3c72)',
        tags: ['Friction (F = μN)', 'Stopping Distance', 'Dynamic Grip', 'Third-Person 3D'],
        launchAction: handleLaunchSkating,
      },
      {
        id: 'outpost-theta',
        type: '3d-world',
        category: '3d',
        code: 'PHY-001',
        title: 'The Last Signal — Kepler Outpost',
        domain: 'Ballistics & Projectile Trajectories',
        description:
          'Futuristic research station simulation on Kepler-186f. Calibrate mortar angles and initial velocity to launch emergency rescue capsules across a 120-meter canyon.',
        badge: '3D MISSION',
        badgeColor: '#818cf8',
        accentGradient: 'linear-gradient(135deg, #1e1b4b, #312e81)',
        tags: ['Vacuum Kinematics', 'Elevation Delta', 'Differential Drag', 'ARIA Companion'],
        launchAction: handleLaunchOutpost,
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
        accentGradient: 'linear-gradient(135deg, #2e1065, #4c1d95)',
        tags: ['FCC & BCC Lattice', 'Packing Fraction', 'Unit Cells', 'Coordination Number'],
        launchAction: () => handleLaunchLabSim('crystal'),
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
        accentGradient: 'linear-gradient(135deg, #451a03, #78350f)',
        tags: ['Launch Velocity', 'Range Equation', 'Time of Flight', 'Aerodynamic Drag'],
        launchAction: () => handleLaunchLabSim('projectile'),
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
        badgeColor: '#38bdf8',
        accentGradient: 'linear-gradient(135deg, #082f49, #0369a1)',
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
        accentGradient: 'linear-gradient(135deg, #022c22, #064e3b)',
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
        accentGradient: 'linear-gradient(135deg, #4c0519, #881337)',
        tags: ['BFS Traversal', 'DFS Traversal', 'Adjacency Matrix', 'Graph Theory'],
        launchAction: () => handleLaunchLabSim('graph'),
      },
      {
        id: 'cycling-world',
        type: '3d-world',
        category: '3d',
        code: 'PHY-ACT-002',
        title: 'Cycling Trail: Balance & Momentum',
        domain: 'Rotational Mechanics & Torque',
        description:
          'Explore angular momentum and stability on two wheels. Experience how mechanical gear ratios trade torque for distance on varying inclines.',
        badge: 'IN DEVELOPMENT',
        badgeColor: '#64748b',
        accentGradient: 'linear-gradient(135deg, #0f172a, #1e293b)',
        tags: ['Angular Momentum', 'Gear Ratios', 'Centripetal Force', 'Incline Dynamics'],
        launchAction: () => {},
      },
    ],
    []
  );

  const filteredShowcase = useMemo(() => {
    if (activeFilter === 'all') return showcaseItems;
    return showcaseItems.filter((item) => item.category === activeFilter);
  }, [activeFilter, showcaseItems]);

  const toggleLearningMode = () => {
    const next = learningMode === 'school' ? 'university' : 'school';
    setLearningMode(next);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        background: '#070a13',
        color: '#f8fafc',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        scrollBehavior: 'smooth',
      }}
    >
      {/* ── 1. MODERN MINIMAL NAVIGATION BAR ── */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(7, 10, 19, 0.92)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0 32px',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: '#00d2ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '0.95rem',
              color: '#070a13',
            }}
          >
            P
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
              PRISM
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#94a3b8',
                borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
                paddingLeft: 10,
              }}
            >
              Interactive STEM
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: '0.82rem', fontWeight: 600 }}>
          <a
            href="#hero"
            style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#00d2ff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
          >
            Overview
          </a>
          <a
            href="#showcase"
            style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#00d2ff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
          >
            Simulations
          </a>
          <a
            href="#missions"
            style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#00d2ff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
          >
            Missions
          </a>
          <button
            onClick={() => setJournalOpen(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#cbd5e1',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#00d2ff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
          >
            <BookOpen size={14} color="#00d2ff" />
            <span>Discoveries</span>
          </button>
          <button
            onClick={() => setAppMode('lab')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#cbd5e1',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#00d2ff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
          >
            <FlaskConical size={14} color="#f59e0b" />
            <span>Workbench</span>
          </button>
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Rigor Mode Toggle */}
          <button
            onClick={toggleLearningMode}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 8,
              padding: '6px 12px',
              color: '#f8fafc',
              fontSize: '0.75rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
            title="Toggle between School & University Pedagogical Rigor"
          >
            <GraduationCap size={14} color="#00d2ff" />
            <span>{learningMode === 'school' ? 'School' : 'University'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 8,
              padding: '7px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {soundEnabled ? <Volume2 size={15} color="#00d2ff" /> : <VolumeX size={15} color="#64748b" />}
          </button>

          {/* Settings */}
          <button
            onClick={() => setSettingsOpen(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 8,
              padding: '7px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Settings size={15} />
          </button>

          {/* Primary Action Button */}
          <button
            onClick={handleLaunchSkating}
            style={{
              background: '#00d2ff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              color: '#070a13',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'background 0.15s, transform 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#38bdf8';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#00d2ff';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Play size={14} fill="#070a13" />
            <span>Launch 3D Game</span>
          </button>
        </div>
      </nav>

      {/* ── 2. CLEAN HERO SECTION ── */}
      <section
        id="hero"
        style={{
          minHeight: '68vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '64px 24px 36px',
          position: 'relative',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse at 50% 20%, #0d1b33 0%, #070a13 70%)',
        }}
      >
        <div style={{ maxWidth: 860, zIndex: 2 }}>
          {/* Subtle Tagline Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 20,
              padding: '5px 14px',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#00d2ff',
              marginBottom: 20,
            }}
          >
            <Sparkles size={13} color="#00d2ff" />
            <span>Computational STEM Platform</span>
          </div>

          {/* Monumental Clean Title */}
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 4.8vw, 3.8rem)',
              fontWeight: 900,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              margin: '0 0 18px 0',
              color: '#ffffff',
            }}
          >
            Experience Physics Through Motion Before the Equations.
          </h1>

          {/* Clean Description */}
          <p
            style={{
              fontSize: 'clamp(0.98rem, 1.5vw, 1.15rem)',
              color: '#94a3b8',
              lineHeight: 1.6,
              maxWidth: 720,
              margin: '0 auto 32px auto',
              fontWeight: 400,
            }}
          >
            Explore real friction, stopping distance, orbital kinematics, and crystal lattices naturally through
            playable 3D adventure environments and analytical laboratories.
          </p>

          {/* Primary Action Buttons */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleLaunchSkating}
              style={{
                background: '#00d2ff',
                border: 'none',
                borderRadius: 10,
                padding: '14px 28px',
                color: '#070a13',
                fontSize: '0.95rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'background 0.15s, transform 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#38bdf8';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#00d2ff';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Play size={16} fill="#070a13" />
              <span>Launch Skating World</span>
            </button>

            <button
              onClick={handleLaunchOutpost}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 10,
                padding: '14px 24px',
                color: '#ffffff',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
            >
              <span>Kepler Outpost (PHY-001)</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* ── 3. CLEAN STATS STRIP ── */}
        <div
          style={{
            marginTop: 56,
            maxWidth: 980,
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 16,
            padding: '20px 28px',
            backdropFilter: 'blur(16px)',
            zIndex: 2,
          }}
        >
          {[
            { value: '5', label: 'EXPLORABLE WORLDS', sub: 'Skating, Cycling, Outpost' },
            { value: '100%', label: 'SCIENTIFIC ACCURACY', sub: 'Accurate differential ODEs' },
            { value: '5', label: 'ANALYTICAL LABS', sub: 'Chemistry, Math & Kinematics' },
            { value: 'ARIA', label: 'SOCRATIC AI AGENT', sub: 'Contextual learning companion' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'left', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none', paddingRight: 16 }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#00d2ff', letterSpacing: '-0.02em' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.06em', marginTop: 2 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. FILTERABLE SIMULATION SHOWCASE ── */}
      <section id="showcase" style={{ padding: '60px 32px 40px', maxWidth: 1200, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        {/* Section Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 36 }}>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#00d2ff',
              marginBottom: 8,
            }}
          >
            PORTFOLIO OF SIMULATIONS
          </div>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 900, margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
            Interactive Computational Simulations
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: 600, margin: 0 }}>
            Select any simulation to launch the 3D environment or open its analytical laboratory.
          </p>

          {/* Filter Tabs */}
          <div
            style={{
              display: 'flex',
              gap: 6,
              marginTop: 24,
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '4px',
              borderRadius: 12,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {[
              { id: 'all', label: 'All Experiences' },
              { id: '3d', label: '3D Worlds' },
              { id: 'physics', label: 'Physics' },
              { id: 'chemistry', label: 'Chemistry' },
              { id: 'math', label: 'Mathematics' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as FilterCategory)}
                style={{
                  background: activeFilter === tab.id ? '#00d2ff' : 'transparent',
                  color: activeFilter === tab.id ? '#070a13' : '#94a3b8',
                  border: 'none',
                  borderRadius: 8,
                  padding: '7px 16px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {filteredShowcase.map((item) => (
            <div
              key={item.id}
              onClick={item.launchAction}
              style={{
                background: '#0d1322',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 16,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: item.badge === 'IN DEVELOPMENT' ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (item.badge !== 'IN DEVELOPMENT') {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(0, 210, 255, 0.35)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              }}
            >
              {/* Card Header Banner */}
              <div
                style={{
                  height: 120,
                  background: item.accentGradient,
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    background: 'rgba(7, 10, 19, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 6,
                  }}
                >
                  {item.code}
                </span>

                <span
                  style={{
                    background: item.badgeColor,
                    color: '#070a13',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: 6,
                  }}
                >
                  {item.badge}
                </span>
              </div>

              {/* Card Content */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ fontSize: '0.72rem', color: '#00d2ff', fontWeight: 700, textTransform: 'uppercase' }}>
                  {item.domain}
                </div>
                <h3 style={{ margin: '4px 0 8px 0', fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                  {item.title}
                </h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  {item.description}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '14px 0 18px 0' }}>
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.07)',
                        borderRadius: 6,
                        padding: '2px 8px',
                        fontSize: '0.7rem',
                        color: '#94a3b8',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Link */}
                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: 12,
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: item.badgeColor }}>
                    {item.badge === 'IN DEVELOPMENT' ? 'Coming Soon' : 'Launch Simulation'}
                  </span>
                  {item.badge !== 'IN DEVELOPMENT' && <ArrowRight size={14} color={item.badgeColor} />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. MISSIONS & CHALLENGES STRIP ── */}
      <section id="missions" style={{ padding: '30px 32px 50px', maxWidth: 1200, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
          <div>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#f59e0b',
                marginBottom: 4,
              }}
            >
              STRUCTURED ADVENTURES
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>
              Story Missions & Challenges
            </h2>
          </div>
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: 10,
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#facc15',
            }}
          >
            {completedMissionIds.length} of {MISSIONS.length} Solved
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {MISSIONS.map((m) => {
            const isCompleted = completedMissionIds.includes(m.id);
            return (
              <div
                key={m.id}
                style={{
                  background: '#0d1322',
                  border: isCompleted
                    ? '1px solid rgba(74, 222, 128, 0.35)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 14,
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800 }}>
                    MISSION 0{m.number}
                  </span>
                  {isCompleted ? (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        color: '#4ade80',
                        background: 'rgba(74, 222, 128, 0.12)',
                        padding: '2px 8px',
                        borderRadius: 6,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <CheckCircle2 size={12} /> Solved
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.72rem', color: '#facc15', fontWeight: 700 }}>+150 XP</span>
                  )}
                </div>

                <div>
                  <h4 style={{ margin: '2px 0 6px 0', fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>
                    {m.title}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.45 }}>
                    {m.objective}
                  </p>
                </div>

                <button
                  onClick={() => startMission(m.id)}
                  style={{
                    marginTop: 'auto',
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: isCompleted ? 'rgba(255, 255, 255, 0.06)' : '#00d2ff',
                    border: 'none',
                    color: isCompleted ? '#ffffff' : '#070a13',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <Play size={12} fill={isCompleted ? '#ffffff' : '#070a13'} />
                  <span>{isCompleted ? 'Replay Mission' : 'Start Mission'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 6. CLEAN MINIMAL FOOTER ── */}
      <footer
        style={{
          marginTop: 'auto',
          background: '#04060c',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '32px 32px 24px',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff' }}>PRISM</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
              Interactive Multi-Subject STEM Platform
            </div>
          </div>

          <button
            onClick={() => setAppMode('lab')}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 8,
              padding: '6px 14px',
              color: '#00d2ff',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <FlaskConical size={14} />
            <span>Open Analytical STEM Workbench</span>
          </button>
        </div>

        <div
          style={{
            maxWidth: 1200,
            margin: '20px auto 0',
            paddingTop: 16,
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
            color: '#475569',
          }}
        >
          <span>© 2026 PRISM. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 16 }}>
            <span>Backend: http://localhost:8000/api</span>
            <span>Frontend: http://localhost:5173/</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DiscoveriesJournalModal isOpen={isJournalOpen} onClose={() => setJournalOpen(false)} />
      <AchievementsModal isOpen={isAchievementsOpen} onClose={() => setAchievementsOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
