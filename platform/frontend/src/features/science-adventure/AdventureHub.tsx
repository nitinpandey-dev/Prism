import { useState, useMemo } from 'react';
import { useAdventureStore } from './stores/useAdventureStore';
import { ACTIVITY_WORLDS, MISSIONS, DISCOVERIES } from './types/adventure';
import { useGameStore } from '../../stores/useGameStore';
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
  CheckCircle2,
  Lock,
  ArrowRight,
  Flame,
  Atom,
  GraduationCap,
  Layers,
  FlaskConical,
  ExternalLink,
  ChevronRight,
  Volume2,
  VolumeX,
  Target,
  Zap,
} from 'lucide-react';

type FilterCategory = 'all' | '3d' | 'physics' | 'chemistry' | 'math';

interface ShowcaseItem {
  id: string;
  type: '3d-world' | 'lab-sim';
  category: '3d' | 'physics' | 'chemistry' | 'math';
  code: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
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

  // ShotGear-inspired Portfolio Showcase Items
  const showcaseItems: ShowcaseItem[] = useMemo(
    () => [
      {
        id: 'skating-world',
        type: '3d-world',
        category: '3d',
        code: 'PHY-ACT-001',
        title: 'Skating World: The Great Park Adventure',
        tagline: 'Friction, Grip & Deceleration',
        description:
          'Put on roller skates with Alex! Explore concrete tracks, slick ice ponds, and wooden ramps with third-person movement and accurate stopping kinematics.',
        icon: '⛸️',
        badge: '3D PLAYABLE NOW',
        badgeColor: '#00d2ff',
        accentGradient: 'linear-gradient(135deg, #0284c7, #00d2ff)',
        tags: ['Friction (F = μN)', 'Stopping Distance', 'Dynamic Grip', 'Third-Person 3D'],
        launchAction: handleLaunchSkating,
      },
      {
        id: 'outpost-theta',
        type: '3d-world',
        category: '3d',
        code: 'PHY-001',
        title: 'The Last Signal: Kepler-186f Outpost',
        tagline: '3D Projectile Kinematics & Ballistics',
        description:
          'Explore a sci-fi research outpost on Kepler-186f. Calibrate a pneumatic mortar, adjust angle and velocity, and fire signal capsules to rescue the relay station.',
        icon: '🚀',
        badge: '3D STORY MISSION',
        badgeColor: '#6366f1',
        accentGradient: 'linear-gradient(135deg, #4f46e5, #6366f1)',
        tags: ['Vacuum Kinematics', 'Elevation Delta', 'Differential Drag', 'ARIA Companion'],
        launchAction: handleLaunchOutpost,
      },
      {
        id: 'solid-state',
        type: 'lab-sim',
        category: 'chemistry',
        code: 'CHEM-001',
        title: 'Crystal Lattice Explorer',
        tagline: 'Solid State Chemistry & Materials',
        description:
          'Visualize Simple Cubic (SC), Body-Centered Cubic (BCC), and Face-Centered Cubic (FCC) lattices in 3D with packing efficiency and coordination numbers.',
        icon: '🔬',
        badge: 'INTERACTIVE 3D LAB',
        badgeColor: '#8b5cf6',
        accentGradient: 'linear-gradient(135deg, #7c3aed, #a855f7)',
        tags: ['FCC & BCC Lattice', 'Packing Fraction', 'Unit Cells', 'Coordination Number'],
        launchAction: () => handleLaunchLabSim('crystal'),
      },
      {
        id: 'projectile-motion',
        type: 'lab-sim',
        category: 'physics',
        code: 'PHY-002',
        title: 'Projectile Trajectory Workbench',
        tagline: 'Analytical 2D Ballistics Solver',
        description:
          'Compute high-precision projectile flight paths, maximum height, flight duration, and landing velocities with real-time parametric graphs.',
        icon: '⚡',
        badge: 'CALCULATION LAB',
        badgeColor: '#f59e0b',
        accentGradient: 'linear-gradient(135deg, #d97706, #f59e0b)',
        tags: ['Launch Velocity', 'Range Equation', 'Time of Flight', 'Aerodynamic Drag'],
        launchAction: () => handleLaunchLabSim('projectile'),
      },
      {
        id: 'wave-superposition',
        type: 'lab-sim',
        category: 'physics',
        code: 'PHY-003',
        title: 'Wave Superposition & Interference',
        tagline: 'Harmonics & Standing Wave Dynamics',
        description:
          'Combine traveling waveforms in real-time. Observe constructive and destructive interference, nodal points, and acoustic beats.',
        icon: '🌊',
        badge: 'WAVE LAB',
        badgeColor: '#0ea5e9',
        accentGradient: 'linear-gradient(135deg, #0284c7, #38bdf8)',
        tags: ['Superposition', 'Standing Waves', 'Constructive Phase', 'Fourier Harmonics'],
        launchAction: () => handleLaunchLabSim('waves'),
      },
      {
        id: 'function-explorer',
        type: 'lab-sim',
        category: 'math',
        code: 'MATH-001',
        title: 'Dynamic Function Explorer',
        tagline: 'Algebraic & Calculus Visualizer',
        description:
          'Plot polynomials, trigonometric curves, and exponential functions dynamically with real-time derivative tangents and roots.',
        icon: '📈',
        badge: 'MATH LAB',
        badgeColor: '#10b981',
        accentGradient: 'linear-gradient(135deg, #059669, #10b981)',
        tags: ['Derivatives', 'Local Extrema', 'Polynomial Roots', 'Trigonometry'],
        launchAction: () => handleLaunchLabSim('function'),
      },
      {
        id: 'graph-traversal',
        type: 'lab-sim',
        category: 'math',
        code: 'CS-001',
        title: 'Graph Traversal & Search Algorithms',
        tagline: 'Graph Theory & Computer Science',
        description:
          'Watch Breadth-First Search (BFS) and Depth-First Search (DFS) explore node networks step-by-step with queue and stack tracking.',
        icon: '🕸️',
        badge: 'ALGORITHMS LAB',
        badgeColor: '#ec4899',
        accentGradient: 'linear-gradient(135deg, #db2777, #f43f5e)',
        tags: ['BFS Search', 'DFS Search', 'Adjacency Lists', 'Tree Traversal'],
        launchAction: () => handleLaunchLabSim('graph'),
      },
      {
        id: 'cycling-world',
        type: '3d-world',
        category: '3d',
        code: 'PHY-ACT-002',
        title: 'Cycling World: Mountain Trail',
        tagline: 'Balance, Momentum & Mechanical Gears',
        description:
          'Discover how angular momentum creates stability on two wheels, how bicycle gears trade torque for speed, and how tires grip muddy slopes.',
        icon: '🚲',
        badge: 'COMING SOON',
        badgeColor: '#64748b',
        accentGradient: 'linear-gradient(135deg, #334155, #475569)',
        tags: ['Gyroscopic Stability', 'Gear Ratios', 'Centripetal Force', 'Incline Friction'],
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
      {/* ── 1. SHOTGEAR STICKY GLASS NAVBAR ── */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(7, 10, 19, 0.88)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0 32px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #00d2ff, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.1rem',
              color: '#070a13',
              boxShadow: '0 0 16px rgba(0, 210, 255, 0.4)',
            }}
          >
            ✦
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 900, fontSize: '1.15rem', letterSpacing: '0.04em', color: '#ffffff' }}>
                PRISM
              </span>
              <span
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 900,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#00d2ff',
                  background: 'rgba(0, 210, 255, 0.12)',
                  padding: '2px 8px',
                  borderRadius: 6,
                  border: '1px solid rgba(0, 210, 255, 0.3)',
                }}
              >
                SCIENCE ADVENTURE
              </span>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.04em' }}>
              EXPLORE • PLAY • EXPERIMENT • DISCOVER
            </div>
          </div>
        </div>

        {/* Center Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: '0.85rem', fontWeight: 700 }}>
          <a
            href="#hero"
            style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#00d2ff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
          >
            Overview
          </a>
          <a
            href="#showcase"
            style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#00d2ff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
          >
            Simulation Showcase
          </a>
          <a
            href="#missions"
            style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#00d2ff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
          >
            Missions ({completedMissionIds.length}/5)
          </a>
          <button
            onClick={() => setJournalOpen(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#cbd5e1',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
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
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#00d2ff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
          >
            <FlaskConical size={14} color="#f59e0b" />
            <span>Lab Workbench</span>
          </button>
        </div>

        {/* Right Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Rigor Mode Toggle */}
          <button
            onClick={toggleLearningMode}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 20,
              padding: '6px 14px',
              color: '#f8fafc',
              fontSize: '0.75rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
            title="Toggle between School & University Pedagogical Rigor"
          >
            <GraduationCap size={15} color="#00d2ff" />
            <span>{learningMode === 'school' ? 'School Mode' : 'University Mode'}</span>
          </button>

          {/* XP Badge */}
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 20,
              padding: '6px 12px',
              color: '#facc15',
              fontSize: '0.78rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Flame size={14} />
            <span>{playerXP} XP</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 10,
              padding: '8px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {soundEnabled ? <Volume2 size={16} color="#00d2ff" /> : <VolumeX size={16} color="#64748b" />}
          </button>

          {/* Settings */}
          <button
            onClick={() => setSettingsOpen(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 10,
              padding: '8px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Settings size={16} />
          </button>

          {/* Primary Action Button (ShotGear Filled Pill) */}
          <button
            onClick={handleLaunchSkating}
            style={{
              background: 'linear-gradient(135deg, #00d2ff, #0070f3)',
              border: 'none',
              borderRadius: 20,
              padding: '8px 18px',
              color: '#070a13',
              fontSize: '0.82rem',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 0 16px rgba(0, 210, 255, 0.4)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.04)';
              e.currentTarget.style.boxShadow = '0 0 24px rgba(0, 210, 255, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0 16px rgba(0, 210, 255, 0.4)';
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#070a13',
                animation: 'pulse 1.5s infinite',
              }}
            />
            <span>PLAY 3D WORLD</span>
          </button>
        </div>
      </nav>

      {/* ── 2. SHOTGEAR CINEMATIC HERO SECTION ── */}
      <section
        id="hero"
        style={{
          minHeight: '74vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '60px 24px 40px',
          position: 'relative',
          overflow: 'hidden',
          background: 'radial-gradient(circle at 50% 30%, #101c38 0%, #070a13 70%)',
        }}
      >
        {/* Ambient Glow Orbs */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '20%',
            width: 380,
            height: 380,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 210, 255, 0.12), transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '25%',
            right: '20%',
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: 940, zIndex: 2 }}>
          {/* Editorial Category Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 30,
              padding: '6px 18px',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#00d2ff',
              marginBottom: 24,
              backdropFilter: 'blur(8px)',
            }}
          >
            <Sparkles size={14} color="#00d2ff" />
            <span>Next-Gen 3D STEM Gaming & Computational Simulation</span>
          </div>

          {/* Monumental Hero Title */}
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 4.4rem)',
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              margin: '0 0 20px 0',
              color: '#ffffff',
            }}
          >
            Explore the Physics of Motion & Matter{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #00d2ff, #818cf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Through Play.
            </span>
          </h1>

          {/* ShotGear Subtitle */}
          <p
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.22rem)',
              color: '#94a3b8',
              lineHeight: 1.6,
              maxWidth: 780,
              margin: '0 auto 36px auto',
              fontWeight: 400,
            }}
          >
            Experience grip, sliding friction, projectile trajectories, and 3D crystal lattices naturally through
            adventure games before introducing the mathematical equations.
          </p>

          {/* Dual Call-to-Action Buttons */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleLaunchSkating}
              style={{
                background: 'linear-gradient(135deg, #00d2ff, #0070f3)',
                border: 'none',
                borderRadius: 24,
                padding: '16px 36px',
                color: '#070a13',
                fontSize: '1.05rem',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                boxShadow: '0 8px 30px rgba(0, 210, 255, 0.4)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 36px rgba(0, 210, 255, 0.55)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 210, 255, 0.4)';
              }}
            >
              <Play size={18} fill="#070a13" />
              <span>Enter Skating World (3D)</span>
            </button>

            <button
              onClick={handleLaunchOutpost}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 24,
                padding: '16px 28px',
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                backdropFilter: 'blur(10px)',
                transition: 'background 0.2s, border 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = '#00d2ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <span>🚀 Launch Kepler Outpost (PHY-001)</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* ── 3. SHOTGEAR SIGNATURE STATS RIBBON ── */}
        <div
          style={{
            marginTop: 64,
            maxWidth: 1040,
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 24,
            padding: '24px 32px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
            zIndex: 2,
          }}
        >
          {[
            { value: '5', label: 'EXPLORABLE WORLDS', sub: 'Skating, Cycling, Outpost' },
            { value: '100%', label: 'REAL PHYSICS SOLVERS', sub: 'Accurate differential ODEs' },
            { value: '5', label: 'ANALYTICAL LABS', sub: 'Chemistry, Math & Kinematics' },
            { value: 'ARIA AI', label: 'SOCRATIC COMPANION', sub: 'Contextual intelligent guide' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'left', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none', paddingRight: 16 }}>
              <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#00d2ff', letterSpacing: '-0.02em' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.08em', marginTop: 2 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. SHOTGEAR SIGNATURE FILTERABLE SIMULATION SHOWCASE ── */}
      <section id="showcase" style={{ padding: '60px 32px 40px', maxWidth: 1240, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        {/* Section Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 36 }}>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#00d2ff',
              marginBottom: 8,
            }}
          >
            PORTFOLIO OF EXPERIENCES
          </div>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 900, margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
            Interactive STEM Simulations
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: 640, margin: 0 }}>
            Filter by domain to launch real-time 3D story adventures, kinetic experiments, and analytical laboratories.
          </p>

          {/* ShotGear Filter Tabs */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              marginTop: 28,
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '5px',
              borderRadius: 30,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {[
              { id: 'all', label: 'All Experiences (8)' },
              { id: '3d', label: '3D Adventure Worlds (2)' },
              { id: 'physics', label: 'Physics & Kinematics (2)' },
              { id: 'chemistry', label: 'Chemistry & Materials (1)' },
              { id: 'math', label: 'Math & Algorithms (2)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as FilterCategory)}
                style={{
                  background: activeFilter === tab.id ? '#00d2ff' : 'transparent',
                  color: activeFilter === tab.id ? '#070a13' : '#94a3b8',
                  border: 'none',
                  borderRadius: 24,
                  padding: '8px 18px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
          {filteredShowcase.map((item) => (
            <div
              key={item.id}
              onClick={item.launchAction}
              style={{
                background: 'linear-gradient(145deg, #0e1526, #090e1a)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 24,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: item.badge === 'COMING SOON' ? 'default' : 'pointer',
                transition: 'all 0.25s cubic-bezier(0.165, 0.84, 0.44, 1)',
                position: 'relative',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
              }}
              onMouseEnter={(e) => {
                if (item.badge !== 'COMING SOON') {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = 'rgba(0, 210, 255, 0.4)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 210, 255, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
              }}
            >
              {/* Card Thumbnail Art Banner */}
              <div
                style={{
                  height: 170,
                  background: item.accentGradient,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {/* Large Subtle Icon Backdrop */}
                <div style={{ fontSize: '5rem', opacity: 0.85, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}>
                  {item.icon}
                </div>

                {/* Top Badge Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: 14,
                    left: 14,
                    background: 'rgba(7, 10, 19, 0.75)',
                    border: `1px solid ${item.badgeColor}40`,
                    backdropFilter: 'blur(8px)',
                    color: item.badgeColor,
                    fontSize: '0.68rem',
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    padding: '3px 10px',
                    borderRadius: 20,
                  }}
                >
                  {item.code}
                </div>

                <div
                  style={{
                    position: 'absolute',
                    top: 14,
                    right: 14,
                    background: 'rgba(7, 10, 19, 0.85)',
                    color: '#ffffff',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: 20,
                  }}
                >
                  {item.badge}
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#00d2ff', fontWeight: 800, textTransform: 'uppercase' }}>
                    {item.tagline}
                  </div>
                  <h3 style={{ margin: '6px 0 10px 0', fontSize: '1.25rem', fontWeight: 900, color: '#ffffff' }}>
                    {item.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.55 }}>
                    {item.description}
                  </p>
                </div>

                {/* Key Tags */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '16px 0 20px 0' }}>
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 8,
                        padding: '2px 8px',
                        fontSize: '0.72rem',
                        color: '#cbd5e1',
                        fontWeight: 600,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Card Action Trigger */}
                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: 14,
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: item.badgeColor }}>
                    {item.badge === 'COMING SOON' ? 'In Development' : 'Launch Simulation'}
                  </span>
                  {item.badge !== 'COMING SOON' && (
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#00d2ff',
                      }}
                    >
                      <ArrowRight size={16} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. FEATURED SPOTLIGHT SHOWCASE (ShotGear "About the Work" style) ── */}
      <section style={{ padding: '40px 32px 60px', maxWidth: 1240, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(14, 21, 38, 0.9), rgba(9, 14, 26, 0.9))',
            border: '1px solid rgba(0, 210, 255, 0.25)',
            borderRadius: 32,
            padding: '48px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 40,
            alignItems: 'center',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Left Column: Interactive Visual Showcase Card */}
          <div
            style={{
              background: '#070a13',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 24,
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '2rem' }}>⛸️</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>Skating Physics Engine</h4>
                  <div style={{ fontSize: '0.72rem', color: '#00d2ff', fontWeight: 700 }}>LIVE KINEMATICS TELEMETRY</div>
                </div>
              </div>
              <span
                style={{
                  fontSize: '0.68rem',
                  color: '#4ade80',
                  background: 'rgba(74, 222, 128, 0.15)',
                  padding: '3px 8px',
                  borderRadius: 8,
                  fontWeight: 800,
                }}
              >
                ACTIVE (60 FPS)
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: '#0e1526', padding: '12px', borderRadius: 12 }}>
                <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>ICE FRICTION (μ)</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#38bdf8' }}>0.12 (Slick)</div>
              </div>
              <div style={{ background: '#0e1526', padding: '12px', borderRadius: 12 }}>
                <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>CONCRETE FRICTION</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#94a3b8' }}>0.40 (Grip)</div>
              </div>
              <div style={{ background: '#0e1526', padding: '12px', borderRadius: 12 }}>
                <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>STOP DISTANCE (d)</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#facc15' }}>v₀² / (2μg)</div>
              </div>
              <div style={{ background: '#0e1526', padding: '12px', borderRadius: 12 }}>
                <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>SLOPE GRAVITY</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f43f5e' }}>g · sin(θ)</div>
              </div>
            </div>

            <button
              onClick={handleLaunchSkating}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 14,
                background: 'linear-gradient(135deg, #00d2ff, #0070f3)',
                border: 'none',
                color: '#070a13',
                fontWeight: 900,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Play size={16} fill="#070a13" />
              <span>Launch 3D Park Playground</span>
            </button>
          </div>

          {/* Right Column: Editorial Philosophy Breakdown */}
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#00d2ff',
                marginBottom: 10,
              }}
            >
              PEDAGOGICAL PHILOSOPHY
            </div>
            <h3 style={{ fontSize: '2.1rem', fontWeight: 900, margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>
              Experience Science Before Introducing the Concepts.
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 24px 0' }}>
              Traditional science education introduces definitions, formulas, and tests before students have developed
              an intuitive grasp of the physical phenomenon. PRISM flips this equation:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                {
                  num: '01',
                  title: 'Zero Formula Clutter in 3D',
                  desc: 'Children skate on ice, bump footballs, and coast down ramps with pure game controls.',
                },
                {
                  num: '02',
                  title: 'Accurate Mathematical Models',
                  desc: 'Every stop, bounce, and projectile arc is computed from real differential equations.',
                },
                {
                  num: '03',
                  title: 'Post-Mission Discovery Reveals',
                  desc: 'Friction, gravity, and momentum are revealed only when the student asks "Why did that happen?".',
                },
              ].map((step, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 900,
                      color: '#00d2ff',
                      background: 'rgba(0, 210, 255, 0.1)',
                      border: '1px solid rgba(0, 210, 255, 0.3)',
                      borderRadius: 10,
                      padding: '4px 8px',
                      flexShrink: 0,
                    }}
                  >
                    {step.num}
                  </div>
                  <div>
                    <h5 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>
                      {step.title}
                    </h5>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5 }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. MISSIONS & CHALLENGES STRIP ── */}
      <section id="missions" style={{ padding: '40px 32px 60px', maxWidth: 1240, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#f59e0b',
                marginBottom: 6,
              }}
            >
              STRUCTURED ADVENTURES
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>
              Story Missions & Challenges
            </h2>
          </div>
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 14,
              padding: '6px 14px',
              fontSize: '0.8rem',
              fontWeight: 800,
              color: '#facc15',
            }}
          >
            {completedMissionIds.length} / {MISSIONS.length} Completed
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
          {MISSIONS.map((m) => {
            const isCompleted = completedMissionIds.includes(m.id);
            return (
              <div
                key={m.id}
                style={{
                  background: 'linear-gradient(145deg, #0e1526, #090e1a)',
                  border: isCompleted
                    ? '1px solid rgba(74, 222, 128, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 20,
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.8rem' }}>{m.thumbnail}</span>
                  {isCompleted ? (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        color: '#4ade80',
                        background: 'rgba(74, 222, 128, 0.15)',
                        padding: '2px 8px',
                        borderRadius: 6,
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <CheckCircle2 size={12} /> Solved
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#facc15', fontWeight: 800 }}>+150 XP</span>
                  )}
                </div>

                <div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800 }}>MISSION {m.number}</div>
                  <h4 style={{ margin: '2px 0 6px 0', fontSize: '1.05rem', fontWeight: 900, color: '#ffffff' }}>
                    {m.title}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.45 }}>
                    {m.objective}
                  </p>
                </div>

                <button
                  onClick={() => startMission(m.id)}
                  style={{
                    marginTop: 'auto',
                    padding: '10px',
                    borderRadius: 12,
                    background: isCompleted ? 'rgba(255, 255, 255, 0.08)' : 'linear-gradient(135deg, #00d2ff, #0070f3)',
                    border: 'none',
                    color: isCompleted ? '#ffffff' : '#070a13',
                    fontWeight: 900,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <Play size={14} fill={isCompleted ? '#ffffff' : '#070a13'} />
                  <span>{isCompleted ? 'Replay Challenge' : 'Play Mission'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 7. SHOTGEAR EDITORIAL FOOTER ── */}
      <footer
        style={{
          marginTop: 'auto',
          background: '#04060c',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '40px 32px 30px',
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 20,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#ffffff' }}>PRISM</span>
              <span style={{ color: '#00d2ff', fontSize: '0.75rem', fontWeight: 800 }}>• SCIENCE ADVENTURE</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4 }}>
              Interactive 3D STEM Learning Platform • Powered by React Three Fiber & FastAPI
            </div>
          </div>

          {/* Quick Switch to Lab Workbench button */}
          <button
            onClick={() => setAppMode('lab')}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 14,
              padding: '8px 16px',
              color: '#00d2ff',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <FlaskConical size={16} />
            <span>Switch to Analytical STEM Workbench (5 Simulators)</span>
          </button>
        </div>

        <div
          style={{
            maxWidth: 1240,
            margin: '24px auto 0',
            paddingTop: 20,
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: '#475569',
          }}
        >
          <span>© 2026 PRISM. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 16 }}>
            <span>Backend API: Online (Port 8000)</span>
            <span>Frontend: Vite v8.3 (Port 5173)</span>
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
