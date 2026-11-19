import React, { useState } from 'react';
import { useAdventureStore } from './stores/useAdventureStore';
import { useGameStore } from '../../stores/useGameStore';
import DiscoveriesJournalModal from './components/modals/DiscoveriesJournalModal';
import AchievementsModal from './components/modals/AchievementsModal';
import SettingsModal from './components/modals/SettingsModal';
import officialHeroImg from '../../assets/apple-vision-pro-official-hero.jpg';

// Apple Logo SVG Component
function AppleLogo({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 170 170" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.71-11.64-14.01-6.72-10.45-12.01-22.37-15.86-35.77-3.85-13.4-5.78-25.79-5.78-37.16 0-14.8 3.59-27.18 10.77-37.14 7.18-9.96 16.29-15.02 27.32-15.18 4.7 0 9.77 1.14 15.22 3.42 5.45 2.28 9.24 3.46 11.38 3.54 1.74-.08 5.76-1.32 12.06-3.72 6.3-2.4 11.75-3.48 16.34-3.25 12.35.61 22.37 5.16 30.06 13.65-10.74 6.53-15.99 15.6-15.75 27.22.25 9.17 3.73 16.92 10.45 23.25 6.72 6.33 14.86 9.87 24.42 10.62-2.18 6.82-5.04 14.16-8.58 22.03zM119.22 31.84c0-7.39 2.65-14.43 7.95-21.12 5.3-6.69 11.83-10.72 19.59-12.08.38 1.45.57 2.89.57 4.32 0 7.23-2.73 14.28-8.19 21.14-5.46 6.86-12.08 10.78-19.86 11.76-.04-1.34-.06-2.68-.06-4.02z" />
    </svg>
  );
}

// Apple Search Icon SVG
function SearchIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="7" cy="7" r="5" />
      <line x1="10.5" y1="10.5" x2="15" y2="15" strokeLinecap="round" />
    </svg>
  );
}

// Apple Bag Icon SVG
function BagIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M4 5h9l1 9H3L4 5z" />
      <path d="M6 5V3.5a2.5 2.5 0 0 1 5 0V5" strokeLinecap="round" />
    </svg>
  );
}

export default function AdventureHub() {
  const {
    setScreen,
    setGameplayMode,
  } = useAdventureStore();

  const {
    setAppMode,
    setActiveActivity,
    setSelectedLabSim,
  } = useGameStore();

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
      {/* ── 1. APPLE GLOBAL NAVIGATION BAR (Exact Apple Top Nav) ── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 16px',
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
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              opacity: 0.9,
              transition: 'opacity 0.2s',
            }}
            title="Apple"
          >
            <AppleLogo size={16} />
          </a>
          <span style={{ cursor: 'pointer', opacity: 0.8 }}>Store</span>
          <span style={{ cursor: 'pointer', opacity: 0.8 }}>Mac</span>
          <span style={{ cursor: 'pointer', opacity: 0.8 }}>iPad</span>
          <span style={{ cursor: 'pointer', opacity: 0.8 }}>iPhone</span>
          <span style={{ cursor: 'pointer', opacity: 0.8 }}>Watch</span>
          <span
            style={{
              cursor: 'pointer',
              color: '#000000',
              fontWeight: 500,
              opacity: 1,
            }}
          >
            Vision
          </span>
          <span style={{ cursor: 'pointer', opacity: 0.8 }}>AirPods</span>
          <span style={{ cursor: 'pointer', opacity: 0.8 }}>Home</span>
          <span style={{ cursor: 'pointer', opacity: 0.8 }}>Entertainment</span>
          <span style={{ cursor: 'pointer', opacity: 0.8 }}>Accessories</span>
          <span style={{ cursor: 'pointer', opacity: 0.8 }}>Support</span>
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(0, 0, 0, 0.8)',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
            }}
            title="Search"
            onClick={() => setJournalOpen(true)}
          >
            <SearchIcon size={15} />
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(0, 0, 0, 0.8)',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
            }}
            title="Account / Settings"
            onClick={() => setSettingsOpen(true)}
          >
            <BagIcon size={15} />
          </button>
        </div>
      </header>

      {/* ── 2. STICKY PRODUCT SUB-NAVIGATION (Apple Vision Pro) ── */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontSize: '21px',
                fontWeight: 600,
                color: '#1d1d1f',
                letterSpacing: '-0.02em',
              }}
            >
              Apple Vision Pro
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
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
              href="#tech-specs"
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
                padding: '4px 12px',
                fontSize: '12px',
                fontWeight: 400,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Book a demo
            </button>
            <button
              onClick={handleLaunchSkating}
              style={{
                background: '#0071e3',
                border: 'none',
                color: '#ffffff',
                borderRadius: '980px',
                padding: '4px 14px',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
            >
              Buy
            </button>
          </div>
        </div>
      </nav>

      {/* ── 3. HERO STAGE (Exact Match to User Reference Screenshot) ── */}
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
          padding: '20px 0 60px 0',
          boxSizing: 'border-box',
        }}
      >
        {/* Centered Hero Image */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '920px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src={officialHeroImg}
            alt="Apple Vision Pro"
            style={{
              width: '100%',
              maxWidth: '720px',
              height: 'auto',
              maxHeight: '620px',
              objectFit: 'contain',
              display: 'block',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          />
          {/* Subtle bottom gradient mask seamlessly transitioning the shirt to the background */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '140px',
              background: 'linear-gradient(to bottom, rgba(245, 245, 247, 0) 0%, rgba(245, 245, 247, 0.95) 75%, #f5f5f7 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Bottom Left Lockup:  Vision Pro & Subtitle */}
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <AppleLogo size={42} color="#1d1d1f" />
            <h1
              style={{
                margin: 0,
                fontSize: 'clamp(36px, 4.5vw, 54px)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: '#1d1d1f',
                lineHeight: 1,
              }}
            >
              Vision Pro
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
            New powerful M5 chip and comfortable Dual Knit Band.
          </p>
        </div>

        {/* Bottom Right Actions: [Book a demo] [Buy] */}
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
            onClick={() => setDemoModalOpen(true)}
            style={{
              background: '#ffffff',
              border: '1px solid #1d1d1f',
              color: '#1d1d1f',
              borderRadius: '980px',
              padding: '10px 22px',
              fontSize: '14px',
              fontWeight: 400,
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
            Book a demo
          </button>

          <button
            onClick={handleLaunchSkating}
            style={{
              background: '#1d1d1f',
              border: 'none',
              color: '#ffffff',
              borderRadius: '980px',
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: 400,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
              transition: 'background 0.2s ease',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#333336';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#1d1d1f';
            }}
          >
            Buy
          </button>
        </div>
      </section>

      {/* ── 4. SPATIAL COMPUTING OVERVIEW SECTION ── */}
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
            Apple Vision Pro
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
            Welcome to the era of spatial computing.
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
            Apple Vision Pro seamlessly blends digital content with your physical space.
            You navigate simply by using your eyes, hands, and voice. Explore interactive
            simulations, experiment with real physics, and discover science through direct play.
          </p>
        </div>

        {/* ── SPATIAL EXPERIENCES CARDS ── */}
        <div
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
              minHeight: '380px',
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
                Spatial 3D Simulation • PHY-ACT-001
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
                Skating Science Adventure
              </h3>
              <p
                style={{
                  fontSize: '16px',
                  color: '#6e6e73',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                Third-person 3D physics experience. Guide Alex across polished concrete, slick ice, and wooden boardwalk ramps. Discover friction, grip dynamics, and stopping distance in real time.
              </p>
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
                Launch Experience
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
              minHeight: '380px',
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
                Spatial 3D Mission • PHY-001
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
                Futuristic planetary research outpost on Kepler-186f. Calibrate elevation angles and ballistic velocity to launch emergency rescue capsules across a 120-meter canyon with ARIA guidance.
              </p>
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
                Launch Mission
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. STEM LAB WORKSTATION SIMULATORS (Infinite Canvas) ── */}
      <section
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
            Infinite Canvas
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
            Explore Interactive STEM Simulators.
          </h2>
          <p
            style={{
              fontSize: '18px',
              color: '#6e6e73',
              margin: '0 0 48px 0',
              maxWidth: '680px',
              lineHeight: 1.5,
            }}
          >
            Five dedicated analytical laboratory simulations designed to visualize physics, chemistry, calculus, and computer science in real time.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
              gap: '20px',
            }}
          >
            {/* Sim 1: Kinematics */}
            <div
              onClick={() => handleLaunchLabSim('projectile')}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '32px 28px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '220px',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.04)';
              }}
            >
              <div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#f59e0b', textTransform: 'uppercase' }}>
                  PHY-002 • Physics Lab
                </span>
                <h4 style={{ fontSize: '20px', fontWeight: 600, margin: '8px 0', color: '#1d1d1f' }}>
                  Kinematics & Trajectory Solver
                </h4>
                <p style={{ fontSize: '14px', color: '#6e6e73', margin: 0, lineHeight: 1.45 }}>
                  Compute parametric flight paths, launch angles, vertex heights, and differential aerodynamic drag.
                </p>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#0071e3', marginTop: '20px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Open Simulator &rarr;
              </span>
            </div>

            {/* Sim 2: Crystal Lattice */}
            <div
              onClick={() => handleLaunchLabSim('crystal')}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '32px 28px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '220px',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.04)';
              }}
            >
              <div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#a855f7', textTransform: 'uppercase' }}>
                  CHEM-001 • Materials Lab
                </span>
                <h4 style={{ fontSize: '20px', fontWeight: 600, margin: '8px 0', color: '#1d1d1f' }}>
                  Crystal Lattice Explorer
                </h4>
                <p style={{ fontSize: '14px', color: '#6e6e73', margin: 0, lineHeight: 1.45 }}>
                  Interactive 3D unit cells for Simple Cubic, BCC, and FCC structures with packing fractions.
                </p>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#0071e3', marginTop: '20px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Open Simulator &rarr;
              </span>
            </div>

            {/* Sim 3: Wave Superposition */}
            <div
              onClick={() => handleLaunchLabSim('waves')}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '32px 28px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '220px',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.04)';
              }}
            >
              <div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#0284c7', textTransform: 'uppercase' }}>
                  PHY-003 • Wave Mechanics
                </span>
                <h4 style={{ fontSize: '20px', fontWeight: 600, margin: '8px 0', color: '#1d1d1f' }}>
                  Wave Superposition & Harmonics
                </h4>
                <p style={{ fontSize: '14px', color: '#6e6e73', margin: 0, lineHeight: 1.45 }}>
                  Simulate constructive and destructive interference, nodal patterns, and standing harmonics.
                </p>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#0071e3', marginTop: '20px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Open Simulator &rarr;
              </span>
            </div>

            {/* Sim 4: Calculus Visualizer */}
            <div
              onClick={() => handleLaunchLabSim('function')}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '32px 28px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '220px',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.04)';
              }}
            >
              <div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#10b981', textTransform: 'uppercase' }}>
                  MATH-001 • Calculus Lab
                </span>
                <h4 style={{ fontSize: '20px', fontWeight: 600, margin: '8px 0', color: '#1d1d1f' }}>
                  Calculus & Function Visualizer
                </h4>
                <p style={{ fontSize: '14px', color: '#6e6e73', margin: 0, lineHeight: 1.45 }}>
                  Real-time polynomial graphing with dynamic tangent slopes, instantaneous derivatives, and roots.
                </p>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#0071e3', marginTop: '20px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Open Simulator &rarr;
              </span>
            </div>

            {/* Sim 5: Graph Traversal */}
            <div
              onClick={() => handleLaunchLabSim('graph')}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '32px 28px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '220px',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.04)';
              }}
            >
              <div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#f43f5e', textTransform: 'uppercase' }}>
                  CS-001 • Algorithms Lab
                </span>
                <h4 style={{ fontSize: '20px', fontWeight: 600, margin: '8px 0', color: '#1d1d1f' }}>
                  Graph Algorithms & Traversal
                </h4>
                <p style={{ fontSize: '14px', color: '#6e6e73', margin: 0, lineHeight: 1.45 }}>
                  Step-by-step interactive Breadth-First Search (BFS) and Depth-First Search (DFS) node traversal.
                </p>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#0071e3', marginTop: '20px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Open Simulator &rarr;
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. TECHNOLOGY & BREAKTHROUGH HARDWARE (Apple Signature Dark Section) ── */}
      <section
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
            Technology
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
            Innovation you can see, hear, and feel.
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
            Pushing the boundaries from the inside out. Spatial experiences on Apple Vision Pro are only possible through groundbreaking Apple technology.
          </p>
        </div>

        {/* 4 Tech Pillars */}
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
            <h3 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 12px 0', color: '#f5f5f7' }}>
              23M
            </h3>
            <h4 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 8px 0', color: '#f5f5f7' }}>
              Micro-OLED pixels
            </h4>
            <p style={{ fontSize: '14px', color: '#86868b', lineHeight: 1.5, margin: 0 }}>
              More pixels than a 4K TV for each eye. Provides astonishing clarity and realism for scientific environments.
            </p>
          </div>

          <div style={{ padding: '24px 0', borderTop: '1px solid #333336' }}>
            <h3 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 12px 0', color: '#f5f5f7' }}>
              M5 + R1
            </h3>
            <h4 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 8px 0', color: '#f5f5f7' }}>
              Dual-chip architecture
            </h4>
            <p style={{ fontSize: '14px', color: '#86868b', lineHeight: 1.5, margin: 0 }}>
              The powerful M5 chip executes high-fidelity 3D physics, while the R1 chip streams 12 cameras with 12ms latency.
            </p>
          </div>

          <div style={{ padding: '24px 0', borderTop: '1px solid #333336' }}>
            <h3 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 12px 0', color: '#f5f5f7' }}>
              Spatial
            </h3>
            <h4 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 8px 0', color: '#f5f5f7' }}>
              Audio ray-tracing
            </h4>
            <p style={{ fontSize: '14px', color: '#86868b', lineHeight: 1.5, margin: 0 }}>
              Dual-driver audio pods deliver acoustic simulation matched to the physical properties of your exact room.
            </p>
          </div>

          <div style={{ padding: '24px 0', borderTop: '1px solid #333336' }}>
            <h3 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 12px 0', color: '#f5f5f7' }}>
              Eyes & Hands
            </h3>
            <h4 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 8px 0', color: '#f5f5f7' }}>
              Natural input
            </h4>
            <p style={{ fontSize: '14px', color: '#86868b', lineHeight: 1.5, margin: 0 }}>
              Precision eye tracking and invisible infrared LEDs allow intuitive selection with a subtle finger pinch.
            </p>
          </div>
        </div>
      </section>

      {/* ── 7. TECH SPECS ACCORDION / TABLE ── */}
      <section
        id="tech-specs"
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
            Technical Specifications
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
            Apple Vision Pro Tech Specs.
          </h2>

          <div style={{ borderTop: '1px solid #d2d2d7' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', padding: '28px 0', borderBottom: '1px solid #d2d2d7' }}>
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#1d1d1f' }}>Display</span>
              <div style={{ fontSize: '15px', color: '#6e6e73', lineHeight: 1.6 }}>
                23 million pixels micro-OLED 3D display system • 92% DCI-P3 color gamut • 90Hz, 96Hz, 100Hz refresh rates • Dynamic spatial video playback.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', padding: '28px 0', borderBottom: '1px solid #d2d2d7' }}>
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#1d1d1f' }}>Chips</span>
              <div style={{ fontSize: '15px', color: '#6e6e73', lineHeight: 1.6 }}>
                Apple Silicon M5 chip with 16-core Neural Engine • Dedicated R1 real-time coprocessor with 12-millisecond photon-to-motion latency.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', padding: '28px 0', borderBottom: '1px solid #d2d2d7' }}>
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#1d1d1f' }}>Camera & Sensors</span>
              <div style={{ fontSize: '15px', color: '#6e6e73', lineHeight: 1.6 }}>
                12 cameras (2 main high-resolution, 6 world-facing tracking, 4 high-speed eye tracking) • LiDAR Scanner • TrueDepth sensor array • 4 IMUs.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', padding: '28px 0', borderBottom: '1px solid #d2d2d7' }}>
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#1d1d1f' }}>Audio</span>
              <div style={{ fontSize: '15px', color: '#6e6e73', lineHeight: 1.6 }}>
                Spatial Audio with dynamic head tracking • Personalized Spatial Audio with ray tracing • Six-microphone array with directional beamforming.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', padding: '28px 0', borderBottom: '1px solid #d2d2d7' }}>
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#1d1d1f' }}>Input & Interaction</span>
              <div style={{ fontSize: '15px', color: '#6e6e73', lineHeight: 1.6 }}>
                Natural eye, hand, and voice controls • Precision micro-gesture tracking • Bluetooth keyboard and trackpad support • Game controller compatible.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. APPLE GLOBAL DIRECTORY FOOTER ── */}
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
          {/* Disclaimers */}
          <div
            style={{
              paddingBottom: '24px',
              borderBottom: '1px solid #d2d2d7',
              lineHeight: 1.6,
              fontSize: '11px',
              color: '#86868b',
            }}
          >
            1. Apple Vision Pro is available in select countries and regions. Eye tracking accuracy and gesture control may vary based on user fit and environmental lighting.
            <br />
            2. Testing conducted by Apple with preproduction Apple Vision Pro units with Apple M5 chip and visionOS 2. Battery life depends on device settings, usage, and environment.
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
                Shop and Learn
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ cursor: 'pointer' }}>Store</span>
                <span style={{ cursor: 'pointer' }}>Mac</span>
                <span style={{ cursor: 'pointer' }}>iPad</span>
                <span style={{ cursor: 'pointer' }}>iPhone</span>
                <span style={{ cursor: 'pointer' }}>Watch</span>
                <span style={{ cursor: 'pointer', color: '#1d1d1f', fontWeight: 500 }}>Vision</span>
                <span style={{ cursor: 'pointer' }}>AirPods</span>
              </div>
            </div>

            <div>
              <h5 style={{ color: '#1d1d1f', fontSize: '12px', fontWeight: 600, margin: '0 0 10px 0' }}>
                Account & Progress
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ cursor: 'pointer' }} onClick={() => setJournalOpen(true)}>Discoveries Journal</span>
                <span style={{ cursor: 'pointer' }} onClick={() => setAchievementsOpen(true)}>Achievements</span>
                <span style={{ cursor: 'pointer' }} onClick={() => setSettingsOpen(true)}>Settings & Accessibility</span>
              </div>
            </div>

            <div>
              <h5 style={{ color: '#1d1d1f', fontSize: '12px', fontWeight: 600, margin: '0 0 10px 0' }}>
                Entertainment
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ cursor: 'pointer' }}>Apple TV+</span>
                <span style={{ cursor: 'pointer' }}>Apple Music</span>
                <span style={{ cursor: 'pointer' }}>Apple Arcade</span>
                <span style={{ cursor: 'pointer' }}>Apple Fitness+</span>
              </div>
            </div>

            <div>
              <h5 style={{ color: '#1d1d1f', fontSize: '12px', fontWeight: 600, margin: '0 0 10px 0' }}>
                For Education
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ cursor: 'pointer' }}>Prism STEM Learning</span>
                <span style={{ cursor: 'pointer' }}>Interactive 3D Worlds</span>
                <span style={{ cursor: 'pointer' }}>Analytical Simulators</span>
              </div>
            </div>

            <div>
              <h5 style={{ color: '#1d1d1f', fontSize: '12px', fontWeight: 600, margin: '0 0 10px 0' }}>
                Apple Values
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ cursor: 'pointer' }}>Accessibility</span>
                <span style={{ cursor: 'pointer' }}>Education</span>
                <span style={{ cursor: 'pointer' }}>Environment</span>
                <span style={{ cursor: 'pointer' }}>Privacy</span>
              </div>
            </div>
          </div>

          {/* Copyright & Region Bar */}
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
              Copyright © 2026 Apple Inc. All rights reserved.
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
              <span>|</span>
              <span style={{ cursor: 'pointer' }}>Terms of Use</span>
              <span>|</span>
              <span style={{ cursor: 'pointer' }}>Sales Policy</span>
              <span>|</span>
              <span style={{ cursor: 'pointer' }}>Legal</span>
              <span>|</span>
              <span style={{ cursor: 'pointer' }}>Site Map</span>
            </div>

            <div style={{ color: '#1d1d1f', fontWeight: 500 }}>
              United States
            </div>
          </div>
        </div>
      </footer>

      {/* ── DEMO SELECTOR MODAL (Book a demo) ── */}
      {isDemoModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.4)',
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
            <AppleLogo size={32} color="#1d1d1f" />
            <h3
              style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#1d1d1f',
                margin: '12px 0 6px 0',
                letterSpacing: '-0.02em',
              }}
            >
              Experience Apple Vision Pro
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: '#6e6e73',
                margin: '0 0 28px 0',
                lineHeight: 1.5,
              }}
            >
              Choose which spatial simulation demo you would like to test:
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
                    Skating Science Adventure
                  </div>
                  <div style={{ fontSize: '13px', color: '#6e6e73' }}>
                    3D friction, grip & stopping distance game
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
                    The Last Signal — Kepler Outpost
                  </div>
                  <div style={{ fontSize: '13px', color: '#6e6e73' }}>
                    3D canyon projectile trajectory simulation
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
