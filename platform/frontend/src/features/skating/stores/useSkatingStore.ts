import { create } from 'zustand';
import {
  LearningStage,
  SurfaceType,
  PredictionOption,
  ExperimentRunRecord,
  FrictionCalculationResult,
  SURFACES,
} from '../types/skating';
import { calculateFrictionMetrics, getKinematicStateAtTime } from '../physics/frictionModel';

// Track geometry constants
export const TRACK_START_Z = -25.0; // Starting line
export const BRAKE_LINE_Z = 0.0;    // Checkered line where braking begins
export const TARGET_ZONE_START_Z = 10.0;
export const TARGET_ZONE_END_Z = 14.0;
export const TRACK_END_Z = 35.0;

export type ExperimentState = 'idle' | 'approaching' | 'braking' | 'finished';

interface SkatingStore {
  // 8-Stage Progression
  stage: LearningStage;
  studentPrediction: PredictionOption | null;
  xp: number;
  achievements: string[];

  // Experiment Parameters
  selectedSurface: SurfaceType;
  initialSpeed: number; // 2 to 10 m/s
  showTrajectoryMarkers: boolean;

  // Live Experiment Execution State
  experimentState: ExperimentState;
  skaterPosition: [number, number, number];
  skaterRotation: number;
  skaterAnimState: 'idle' | 'skating' | 'sprinting' | 'braking' | 'stopped';
  currentSpeed: number;
  brakingDistance: number;
  elapsedBrakeTime: number;

  // History & Telemetry
  lastMetrics: FrictionCalculationResult;
  history: ExperimentRunRecord[];
  isTargetChallengeActive: boolean;

  // Actions
  setStage: (stage: LearningStage) => void;
  selectSurface: (surface: SurfaceType) => void;
  setInitialSpeed: (speed: number) => void;
  makePrediction: (option: PredictionOption) => void;
  startExperiment: () => void;
  triggerBrake: () => void;
  tickExperiment: (delta: number) => void;
  resetExperiment: () => void;
  updateSkaterFreeRoam: (pos: [number, number, number], rot: number, anim: any) => void;
  awardXP: (amount: number, reason: string) => void;
  toggleTrajectoryMarkers: () => void;
  setTargetChallengeActive: (active: boolean) => void;
}

const defaultSurface: SurfaceType = 'normal';
const defaultSpeed = 6.0;
const initialMetrics = calculateFrictionMetrics(defaultSpeed, defaultSurface);

export const useSkatingStore = create<SkatingStore>((set, get) => ({
  stage: 'STAGE_1_CHOOSE_ACTIVITY',
  studentPrediction: null,
  xp: 0,
  achievements: [],

  selectedSurface: defaultSurface,
  initialSpeed: defaultSpeed,
  showTrajectoryMarkers: true,

  experimentState: 'idle',
  skaterPosition: [SURFACES[defaultSurface].laneX, 0, TRACK_START_Z],
  skaterRotation: 0,
  skaterAnimState: 'idle',
  currentSpeed: defaultSpeed,
  brakingDistance: 0,
  elapsedBrakeTime: 0,

  lastMetrics: initialMetrics,
  history: [],
  isTargetChallengeActive: false,

  setStage: (stage) => set({ stage }),

  selectSurface: (surface) => {
    const speed = get().initialSpeed;
    const metrics = calculateFrictionMetrics(speed, surface);
    const laneX = SURFACES[surface].laneX;
    set((state) => ({
      selectedSurface: surface,
      lastMetrics: metrics,
      skaterPosition: state.experimentState === 'idle'
        ? [laneX, 0, TRACK_START_Z]
        : state.skaterPosition,
    }));
  },

  setInitialSpeed: (speed) => {
    const clampedSpeed = Math.max(2.0, Math.min(10.0, speed));
    const metrics = calculateFrictionMetrics(clampedSpeed, get().selectedSurface);
    set({ initialSpeed: clampedSpeed, lastMetrics: metrics, currentSpeed: clampedSpeed });
  },

  makePrediction: (option) => {
    set({ studentPrediction: option });
    get().awardXP(50, 'Made scientific stopping distance prediction');
    get().setStage('STAGE_5_EXPERIMENT');
  },

  startExperiment: () => {
    const { selectedSurface, initialSpeed } = get();
    const laneX = SURFACES[selectedSurface].laneX;
    const metrics = calculateFrictionMetrics(initialSpeed, selectedSurface);

    set({
      experimentState: 'approaching',
      skaterPosition: [laneX, 0, TRACK_START_Z],
      skaterRotation: 0,
      skaterAnimState: 'skating',
      currentSpeed: initialSpeed,
      brakingDistance: 0,
      elapsedBrakeTime: 0,
      lastMetrics: metrics,
    });
  },

  triggerBrake: () => {
    if (get().experimentState !== 'approaching') return;
    set({
      experimentState: 'braking',
      skaterAnimState: 'braking',
      elapsedBrakeTime: 0,
      brakingDistance: 0,
    });
  },

  tickExperiment: (delta: number) => {
    const state = get();
    if (state.experimentState === 'idle' || state.experimentState === 'finished') {
      return;
    }

    const { experimentState, initialSpeed, selectedSurface, skaterPosition, elapsedBrakeTime, lastMetrics } = state;
    const [x, y, z] = skaterPosition;

    if (experimentState === 'approaching') {
      // Skater is gliding forward toward the BRAKE_LINE_Z at initialSpeed
      const nextZ = z + initialSpeed * delta;

      if (nextZ >= BRAKE_LINE_Z) {
        // Automatically engage brakes at the checkered line
        set({
          experimentState: 'braking',
          skaterAnimState: 'braking',
          skaterPosition: [x, y, BRAKE_LINE_Z],
          elapsedBrakeTime: 0,
          brakingDistance: 0,
        });
      } else {
        set({
          skaterPosition: [x, y, nextZ],
          currentSpeed: initialSpeed,
          skaterAnimState: initialSpeed > 7.0 ? 'sprinting' : 'skating',
        });
      }
    } else if (experimentState === 'braking') {
      // Decelerating according to scientific friction model
      const newElapsed = elapsedBrakeTime + delta;
      const kinematic = getKinematicStateAtTime(initialSpeed, lastMetrics.deceleration, newElapsed);

      const actualDistance = kinematic.distance;
      const nextZ = BRAKE_LINE_Z + actualDistance;

      if (kinematic.isStopped) {
        // Alex has come to a complete stop!
        const wasTargetHit = nextZ >= TARGET_ZONE_START_Z && nextZ <= TARGET_ZONE_END_Z;

        const newRecord: ExperimentRunRecord = {
          id: `run-${Date.now()}`,
          timestamp: Date.now(),
          surface: selectedSurface,
          surfaceName: SURFACES[selectedSurface].name,
          frictionCoeff: lastMetrics.frictionCoeff,
          initialSpeed,
          deceleration: lastMetrics.deceleration,
          stoppingDistance: Number(actualDistance.toFixed(2)),
          stoppingTime: Number(newElapsed.toFixed(2)),
          wasTargetHit,
        };

        const updatedHistory = [newRecord, ...state.history];
        set({
          experimentState: 'finished',
          skaterAnimState: 'stopped',
          skaterPosition: [x, y, nextZ],
          currentSpeed: 0,
          brakingDistance: Number(actualDistance.toFixed(2)),
          elapsedBrakeTime: newElapsed,
          history: updatedHistory,
        });

        // Award XP for experiment
        get().awardXP(100, `Completed braking test on ${SURFACES[selectedSurface].name}`);
        if (wasTargetHit) {
          get().awardXP(150, 'Target Zone Precision Stop achieved!');
        }
      } else {
        set({
          skaterPosition: [x, y, nextZ],
          currentSpeed: kinematic.velocity,
          brakingDistance: Number(actualDistance.toFixed(2)),
          elapsedBrakeTime: newElapsed,
        });
      }
    }
  },

  resetExperiment: () => {
    const { selectedSurface, initialSpeed } = get();
    const laneX = SURFACES[selectedSurface].laneX;
    set({
      experimentState: 'idle',
      skaterPosition: [laneX, 0, TRACK_START_Z],
      skaterRotation: 0,
      skaterAnimState: 'idle',
      currentSpeed: initialSpeed,
      brakingDistance: 0,
      elapsedBrakeTime: 0,
    });
  },

  updateSkaterFreeRoam: (pos, rot, anim) => {
    if (get().experimentState !== 'idle') return;
    set({
      skaterPosition: pos,
      skaterRotation: rot,
      skaterAnimState: anim,
    });
  },

  awardXP: (amount, reason) => {
    set((s) => ({
      xp: s.xp + amount,
      achievements: s.achievements.includes(reason) ? s.achievements : [...s.achievements, reason],
    }));
  },

  toggleTrajectoryMarkers: () =>
    set((s) => ({ showTrajectoryMarkers: !s.showTrajectoryMarkers })),

  setTargetChallengeActive: (active) =>
    set({ isTargetChallengeActive: active }),
}));
