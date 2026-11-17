import { useState } from 'react';
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
} from 'lucide-react';

export default function AdventureHub() {
  const {
    setScreen,
    setGameplayMode,
    startMission,
    completedMissionIds,
    unlockedDiscoveryIds,
    unlockedAchievementIds,
    playerXP,
  } = useAdventureStore();

  const setAppMode = useGameStore((s) => s.setAppMode);

  const [isJournalOpen, setJournalOpen] = useState(false);
  const [isAchievementsOpen, setAchievementsOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const handleEnterFreePlay = () => {
    setGameplayMode('free-play');
    setScreen('skating-world');
  };

  const handleLaunchMission = (missionId: string) => {
    startMission(missionId);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        background: 'radial-gradient(ellipse at top, #0f172a 0%, #020617 100%)',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      {/* ── 1. BRAND HEADER ── */}
      <header
        style={{
          padding: '16px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.75)',
          borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
          backdropFilter: 'blur(16px)',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}
      >
        {/* Brand Logo & Tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #0284c7, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              boxShadow: '0 4px 18px rgba(2, 132, 199, 0.5)',
            }}
          >
            ⛸️
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: '1.35rem',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              SCIENCE ADVENTURE
            </h1>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>
              Explore. Play. Experiment. Discover.
            </div>
          </div>
        </div>

        {/* Player Stats & Nav Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* XP Badge */}
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: 18,
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#facc15',
              fontWeight: 800,
              fontSize: '0.85rem',
            }}
          >
            <Flame size={16} />
            <span>{playerXP} XP</span>
          </div>

          {/* Discoveries Journal Button */}
          <button
            onClick={() => setJournalOpen(true)}
            style={{
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: 16,
              padding: '8px 14px',
              color: '#f8fafc',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <BookOpen size={16} color="#38bdf8" />
            <span>Discoveries ({unlockedDiscoveryIds.length}/5)</span>
          </button>

          {/* Trophy Cabinet Button */}
          <button
            onClick={() => setAchievementsOpen(true)}
            style={{
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 16,
              padding: '8px 14px',
              color: '#f8fafc',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <Trophy size={16} color="#facc15" />
            <span>Badges ({unlockedAchievementIds.length}/5)</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setSettingsOpen(true)}
            style={{
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 16,
              padding: '8px',
              color: '#cbd5e1',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* ── 2. HERO SECTION: Welcoming Adventure Banner ── */}
      <section style={{ padding: '32px 32px 16px', maxWidth: 1200, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.3), rgba(99, 102, 241, 0.25))',
            border: '2px solid rgba(56, 189, 248, 0.35)',
            borderRadius: 32,
            padding: '40px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
            boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
          }}
        >
          {/* Left Text & CTA */}
          <div style={{ maxWidth: 620, zIndex: 2 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(56, 189, 248, 0.2)',
                border: '1px solid rgba(56, 189, 248, 0.5)',
                borderRadius: 20,
                padding: '4px 12px',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#38bdf8',
                marginBottom: 12,
              }}
            >
              <Sparkles size={14} />
              <span>FEATURED WORLD • PLAYABLE NOW</span>
            </div>

            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, margin: '0 0 12px 0', lineHeight: 1.15 }}>
              Skating World: <br />
              <span style={{ color: '#38bdf8' }}>The Great Park Adventure</span>
            </h2>

            <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.6, margin: '0 0 24px 0' }}>
              Put on your helmet and roller skates with Alex! Skate across sunny concrete, slip across icy ponds,
              conquer wooden ramps, and discover how real grip and stopping distance work through action.
            </p>

            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              {/* PRIMARY CALL TO ACTION */}
              <button
                onClick={handleEnterFreePlay}
                style={{
                  background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                  border: 'none',
                  borderRadius: 20,
                  padding: '16px 32px',
                  color: '#ffffff',
                  fontSize: '1.1rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  boxShadow: '0 8px 30px rgba(2, 132, 199, 0.55)',
                  transform: 'scale(1)',
                  transition: 'transform 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <Play size={20} fill="#ffffff" />
                <span>Enter Skating Park</span>
              </button>

              <button
                onClick={() => handleLaunchMission('mission-1')}
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '2px solid rgba(255,255,255,0.25)',
                  borderRadius: 20,
                  padding: '16px 24px',
                  color: '#f8fafc',
                  fontSize: '1rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>Mission 1: The Slippery Surprise</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Right Mascot Art */}
          <div
            style={{
              width: 220,
              height: 220,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(56, 189, 248, 0.4), transparent 70%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '7rem',
              zIndex: 2,
              flexShrink: 0,
            }}
          >
            ⛸️
          </div>
        </div>
      </section>

      {/* ── 3. EXPLORE WORLDS SECTION ── */}
      <section style={{ padding: '24px 32px', maxWidth: 1200, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900 }}>Activity Worlds</h3>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              Explore different physical phenomena through everyday activities
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16 }}>
          {ACTIVITY_WORLDS.map((world) => {
            const isPlayable = world.status === 'playable';
            return (
              <div
                key={world.id}
                onClick={() => {
                  if (isPlayable) handleEnterFreePlay();
                }}
                style={{
                  background: isPlayable
                    ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.8))'
                    : 'rgba(15, 23, 42, 0.4)',
                  border: isPlayable ? '2px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 24,
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  cursor: isPlayable ? 'pointer' : 'default',
                  opacity: isPlayable ? 1 : 0.65,
                  transition: 'all 0.2s',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: `${world.accentColor}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.8rem',
                    }}
                  >
                    {world.icon}
                  </div>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: 10,
                      background: isPlayable ? '#0284c7' : 'rgba(255,255,255,0.1)',
                      color: '#ffffff',
                    }}
                  >
                    {isPlayable ? 'PLAYABLE' : 'COMING SOON'}
                  </span>
                </div>

                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#f8fafc' }}>{world.title}</h4>
                  <div style={{ fontSize: '0.75rem', color: world.accentColor, fontWeight: 700, marginTop: 2 }}>
                    {world.category}
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
                  {world.description}
                </p>

                {isPlayable && (
                  <div
                    style={{
                      marginTop: 'auto',
                      fontSize: '0.8rem',
                      color: '#38bdf8',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span>Launch World</span>
                    <ArrowRight size={14} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 4. SKATING MISSIONS BOARD (5 PLAYABLE MISSIONS) ── */}
      <section style={{ padding: '24px 32px 40px', maxWidth: 1200, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900 }}>Missions & Challenges</h3>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              Solve real skating challenges to unlock hidden scientific secrets
            </div>
          </div>
          <div
            style={{
              fontSize: '0.8rem',
              color: '#38bdf8',
              fontWeight: 800,
              background: 'rgba(56, 189, 248, 0.1)',
              padding: '6px 14px',
              borderRadius: 12,
            }}
          >
            {completedMissionIds.length} / {MISSIONS.length} Completed
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {MISSIONS.map((mission) => {
            const isCompleted = completedMissionIds.includes(mission.id);
            return (
              <div
                key={mission.id}
                style={{
                  background: 'linear-gradient(145deg, #1e293b, #0f172a)',
                  border: isCompleted
                    ? '2px solid rgba(74, 222, 128, 0.5)'
                    : '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 24,
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '1.8rem' }}>{mission.thumbnail}</span>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#facc15', fontWeight: 800 }}>
                        MISSION {mission.number}
                      </span>
                      <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#f8fafc' }}>
                        {mission.title}
                      </h4>
                    </div>
                  </div>
                  {isCompleted && (
                    <span
                      style={{
                        color: '#4ade80',
                        background: 'rgba(74, 222, 128, 0.15)',
                        padding: '4px 8px',
                        borderRadius: 8,
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <CheckCircle2 size={12} /> Solved
                    </span>
                  )}
                </div>

                <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  {mission.objective}
                </p>

                <div
                  style={{
                    marginTop: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 8,
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: '#facc15', fontWeight: 800 }}>+150 XP</span>
                  <button
                    onClick={() => handleLaunchMission(mission.id)}
                    style={{
                      background: isCompleted ? 'rgba(51, 65, 85, 0.8)' : 'linear-gradient(135deg, #0284c7, #2563eb)',
                      border: 'none',
                      borderRadius: 14,
                      padding: '8px 18px',
                      color: '#ffffff',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Play size={14} fill="#ffffff" />
                    <span>{isCompleted ? 'Replay' : 'Play Mission'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 5. FOOTER & CLASSIC PRISM REPOSITORY LINK ── */}
      <footer
        style={{
          marginTop: 'auto',
          padding: '20px 32px',
          background: 'rgba(15, 23, 42, 0.95)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <div>
          <span>Science Adventure © 2026 • </span>
          <span style={{ color: '#94a3b8' }}>Explore. Play. Experiment. Discover.</span>
        </div>

        {/* Switch to Classic PRISM Lab button (preserves 100% existing functionality) */}
        <button
          onClick={() => setAppMode('lab')}
          style={{
            background: 'transparent',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: 12,
            padding: '6px 14px',
            color: '#38bdf8',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Atom size={14} />
          <span>Switch to Advanced STEM Lab Workbench (PRISM)</span>
        </button>
      </footer>

      {/* Modals */}
      <DiscoveriesJournalModal isOpen={isJournalOpen} onClose={() => setJournalOpen(false)} />
      <AchievementsModal isOpen={isAchievementsOpen} onClose={() => setAchievementsOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
