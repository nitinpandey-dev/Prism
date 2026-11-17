import { create } from 'zustand';
import {
  AdventureScreen,
  GameplayMode,
  MissionState,
  MissionDefinition,
  DiscoveryDefinition,
  SurfaceId,
  MISSIONS,
  DISCOVERIES,
  ACHIEVEMENTS,
  SURFACES_INFO,
} from '../types/adventure';

interface AdventureState {
  // Navigation & View
  currentScreen: AdventureScreen;
  gameplayMode: GameplayMode;
  setScreen: (screen: AdventureScreen) => void;
  setGameplayMode: (mode: GameplayMode) => void;

  // Active Mission State
  activeMissionId: string | null;
  missionState: MissionState;
  missionAttemptCount: number;
  starsCollected: number[]; // e.g. [1, 2, 3] for Mission 5
  activeDiscoveryModal: DiscoveryDefinition | null;

  // Real-time Skater State in 3D Park
  skaterPosition: [number, number, number];
  skaterRotation: number;
  skaterSpeed: number;
  skaterAnim: 'idle' | 'skating' | 'sprinting' | 'braking' | 'stopped' | 'stumble';
  currentSurface: SurfaceId;
  isBraking: boolean;
  isSprinting: boolean;
  virtualJoystick: { x: number; y: number };

  // Park Interactive Elements
  footballPosition: [number, number, number];
  footballVelocity: [number, number, number];

  // Learning Progress & Achievements (Persisted)
  completedMissionIds: string[];
  unlockedDiscoveryIds: string[];
  unlockedAchievementIds: string[];
  visitedSurfaces: string[];
  playerXP: number;

  // Settings
  soundEnabled: boolean;
  musicEnabled: boolean;
  touchControlsActive: boolean;
  highContrast: boolean;

  // Actions
  startMission: (missionId: string) => void;
  launchMissionGameplay: () => void;
  retryMission: () => void;
  abandonMission: () => void;
  completeMissionSuccess: () => void;
  closeDiscoveryModal: () => void;

  // 3D Runtime Updaters
  updateSkaterTransform: (
    pos: [number, number, number],
    rot: number,
    speed: number,
    anim: 'idle' | 'skating' | 'sprinting' | 'braking' | 'stopped' | 'stumble',
    surface: SurfaceId
  ) => void;
  setBraking: (braking: boolean) => void;
  setSprinting: (sprinting: boolean) => void;
  setVirtualJoystick: (x: number, y: number) => void;
  collectStar: (starIndex: number) => void;
  failMission: (reason?: string) => void;

  // Settings & Progress Actions
  toggleSound: () => void;
  toggleMusic: () => void;
  setTouchControls: (active: boolean) => void;
  resetAllProgress: () => void;
}

const STORAGE_KEY = 'science_adventure_progress_v2';

// Load saved data from localStorage
const loadSavedData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to parse saved adventure progress', e);
  }
  return {
    completedMissionIds: [],
    unlockedDiscoveryIds: [],
    unlockedAchievementIds: [],
    visitedSurfaces: ['concrete'],
    playerXP: 0,
    soundEnabled: true,
    musicEnabled: true,
    touchControlsActive: false,
  };
};

const saved = loadSavedData();

export const useAdventureStore = create<AdventureState>((set, get) => ({
  // Navigation & View
  currentScreen: 'hub',
  gameplayMode: 'free-play',
  setScreen: (screen) => set({ currentScreen: screen }),
  setGameplayMode: (mode) => set({ gameplayMode: mode }),

  // Active Mission State
  activeMissionId: null,
  missionState: 'idle',
  missionAttemptCount: 0,
  starsCollected: [],
  activeDiscoveryModal: null,

  // Skater State
  skaterPosition: [0, 0, -15],
  skaterRotation: 0,
  skaterSpeed: 0,
  skaterAnim: 'idle',
  currentSurface: 'concrete',
  isBraking: false,
  isSprinting: false,
  virtualJoystick: { x: 0, y: 0 },

  // Park Interactive Elements (Football at crosswalk)
  footballPosition: [0, 0.35, 12.5],
  footballVelocity: [0, 0, 0],

  // Saved Progress
  completedMissionIds: saved.completedMissionIds || [],
  unlockedDiscoveryIds: saved.unlockedDiscoveryIds || [],
  unlockedAchievementIds: saved.unlockedAchievementIds || [],
  visitedSurfaces: saved.visitedSurfaces || ['concrete'],
  playerXP: saved.playerXP || 0,

  // Settings
  soundEnabled: saved.soundEnabled ?? true,
  musicEnabled: saved.musicEnabled ?? true,
  touchControlsActive: saved.touchControlsActive ?? false,
  highContrast: false,

  // Start a mission (opens briefing modal)
  startMission: (missionId: string) => {
    const mission = MISSIONS.find((m) => m.id === missionId);
    if (!mission) return;

    set({
      activeMissionId: missionId,
      missionState: 'briefing',
      gameplayMode: 'mission',
      currentScreen: 'skating-world',
      starsCollected: [],
      // Reset position to mission start
      skaterPosition: [...mission.startPosition],
      skaterRotation: mission.startRotation,
      skaterSpeed: 0,
      skaterAnim: 'idle',
      isBraking: false,
      isSprinting: false,
      // Reset football if mission 2
      footballPosition: [0, 0.35, 12.5],
      footballVelocity: [0, 0, 0],
    });
  },

  // Launch the gameplay from briefing
  launchMissionGameplay: () => {
    set((s) => ({
      missionState: 'playing',
      missionAttemptCount: s.missionAttemptCount + 1,
    }));
  },

  // Retry after falling or stopping wrong
  retryMission: () => {
    const { activeMissionId } = get();
    const mission = MISSIONS.find((m) => m.id === activeMissionId);
    if (!mission) return;

    set((s) => ({
      missionState: 'playing',
      missionAttemptCount: s.missionAttemptCount + 1,
      skaterPosition: [...mission.startPosition],
      skaterRotation: mission.startRotation,
      skaterSpeed: 0,
      skaterAnim: 'idle',
      isBraking: false,
      isSprinting: false,
      starsCollected: [],
      footballPosition: [0, 0.35, 12.5],
      footballVelocity: [0, 0, 0],
    }));
  },

  // Abandon mission and return to free play in park
  abandonMission: () => {
    set({
      activeMissionId: null,
      missionState: 'idle',
      gameplayMode: 'free-play',
    });
  },

  // Mission Succeeded -> Trigger Discovery Reveal
  completeMissionSuccess: () => {
    const state = get();
    const mission = MISSIONS.find((m) => m.id === state.activeMissionId);
    if (!mission) return;

    const nextCompleted = Array.from(new Set([...state.completedMissionIds, mission.id]));
    const nextDiscoveries = Array.from(new Set([...state.unlockedDiscoveryIds, mission.discoveryId]));
    const discovery = DISCOVERIES[mission.discoveryId];

    // Check achievements
    const nextAchievements = [...state.unlockedAchievementIds];
    if (state.missionAttemptCount > 1 && !nextAchievements.includes('ach-never-give-up')) {
      nextAchievements.push('ach-never-give-up');
    }
    if (mission.id === 'mission-2' && !nextAchievements.includes('ach-smart-skater')) {
      nextAchievements.push('ach-smart-skater');
    }
    if (nextDiscoveries.length >= 1 && !nextAchievements.includes('ach-science-detective')) {
      nextAchievements.push('ach-science-detective');
    }
    if (nextCompleted.length === MISSIONS.length && !nextAchievements.includes('ach-champion')) {
      nextAchievements.push('ach-champion');
    }

    const nextXP = state.playerXP + 150;

    // Persist
    const toSave = {
      completedMissionIds: nextCompleted,
      unlockedDiscoveryIds: nextDiscoveries,
      unlockedAchievementIds: nextAchievements,
      visitedSurfaces: state.visitedSurfaces,
      playerXP: nextXP,
      soundEnabled: state.soundEnabled,
      musicEnabled: state.musicEnabled,
      touchControlsActive: state.touchControlsActive,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.warn('Storage save error', e);
    }

    set({
      missionState: 'success',
      completedMissionIds: nextCompleted,
      unlockedDiscoveryIds: nextDiscoveries,
      unlockedAchievementIds: nextAchievements,
      playerXP: nextXP,
      activeDiscoveryModal: discovery || null,
    });
  },

  closeDiscoveryModal: () => {
    set({
      activeDiscoveryModal: null,
      missionState: 'idle',
      gameplayMode: 'free-play',
      activeMissionId: null,
    });
  },

  failMission: (reason?: string) => {
    set({
      missionState: 'failed',
      skaterAnim: 'stumble',
    });
  },

  updateSkaterTransform: (pos, rot, speed, anim, surface) => {
    const state = get();

    // Check surface visit achievement
    const visited = state.visitedSurfaces.includes(surface)
      ? state.visitedSurfaces
      : [...state.visitedSurfaces, surface];

    const nextAchievements = [...state.unlockedAchievementIds];
    if (visited.length >= 4 && !nextAchievements.includes('ach-curious-explorer')) {
      nextAchievements.push('ach-curious-explorer');
    }

    set({
      skaterPosition: pos,
      skaterRotation: rot,
      skaterSpeed: speed,
      skaterAnim: anim,
      currentSurface: surface,
      visitedSurfaces: visited,
      unlockedAchievementIds: nextAchievements,
    });
  },

  setBraking: (braking) => set({ isBraking: braking }),
  setSprinting: (sprinting) => set({ isSprinting: sprinting }),
  setVirtualJoystick: (x, y) => set({ virtualJoystick: { x, y } }),

  collectStar: (starIndex) => {
    set((s) => {
      if (s.starsCollected.includes(starIndex)) return s;
      const nextStars = [...s.starsCollected, starIndex];
      // If all 3 collected in mission 5, trigger win!
      if (s.activeMissionId === 'mission-5' && nextStars.length >= 3) {
        setTimeout(() => {
          get().completeMissionSuccess();
        }, 500);
      }
      return { starsCollected: nextStars, playerXP: s.playerXP + 50 };
    });
  },

  toggleSound: () =>
    set((s) => {
      const next = !s.soundEnabled;
      return { soundEnabled: next };
    }),

  toggleMusic: () =>
    set((s) => {
      const next = !s.musicEnabled;
      return { musicEnabled: next };
    }),

  setTouchControls: (active) => set({ touchControlsActive: active }),

  resetAllProgress: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({
      completedMissionIds: [],
      unlockedDiscoveryIds: [],
      unlockedAchievementIds: [],
      visitedSurfaces: ['concrete'],
      playerXP: 0,
      activeMissionId: null,
      missionState: 'idle',
      gameplayMode: 'free-play',
      activeDiscoveryModal: null,
    });
  },
}));
