import { create } from 'zustand';
import {
  ProjectileParameters,
  TargetZone,
  TrajectoryResult,
  Vector3D,
  LearningMode,
} from '../types/physics';
import { solveProjectileTrajectory } from '../game/physics/projectileSolver';

export const LAUNCHER_ORIGIN: Vector3D = { x: 0, y: 3.2, z: 12.0 };

export const RELAY_TARGET: TargetZone = {
  position: { x: 0, y: -7.5, z: 120.0 }, // Target crater across canyon
  radius: 8.5,                          // Outer capture cone
  innerRadius: 2.8,                     // High-precision bullseye funnel
  elevation: -7.5,
  name: 'Emergency Relay Funnel #4',
};

interface PhysicsStore {
  params: ProjectileParameters;
  target: TargetZone;
  trajectory: TrajectoryResult;
  isFiring: boolean;
  flightCurrentTime: number;
  currentProjectilePos: Vector3D | null;
  lastResult: TrajectoryResult | null;

  // Actions
  setSpeed: (speed: number, mode: LearningMode) => void;
  setAngle: (angle: number, mode: LearningMode) => void;
  setAzimuth: (azimuth: number, mode: LearningMode) => void;
  updateParameters: (partial: Partial<ProjectileParameters>, mode: LearningMode) => void;
  recomputeTrajectory: (mode: LearningMode) => void;
  startLaunch: () => void;
  updateFlightTick: (dt: number) => { finished: boolean; impactPoint?: Vector3D };
  resetLaunch: () => void;
}

const defaultParams: ProjectileParameters = {
  initialSpeed: 34.0,
  launchAngle: 42.0,
  launchAzimuth: 0.0,
  initialPosition: LAUNCHER_ORIGIN,
  gravity: 9.81,
  projectileMass: 3.5,
  dragCoefficient: 0.47,
  crossSectionArea: 0.04,
  airDensity: 0.0, // Default School (vacuum)
  windVelocity: { x: 0, y: 0, z: 0 },
};

const initialTrajectory = solveProjectileTrajectory(defaultParams, RELAY_TARGET, 'school');

export const usePhysicsStore = create<PhysicsStore>((set, get) => ({
  params: defaultParams,
  target: RELAY_TARGET,
  trajectory: initialTrajectory,
  isFiring: false,
  flightCurrentTime: 0,
  currentProjectilePos: null,
  lastResult: null,

  setSpeed: (speed, mode) => {
    const updated = { ...get().params, initialSpeed: speed };
    const traj = solveProjectileTrajectory(updated, get().target, mode);
    set({ params: updated, trajectory: traj });
  },

  setAngle: (angle, mode) => {
    const updated = { ...get().params, launchAngle: angle };
    const traj = solveProjectileTrajectory(updated, get().target, mode);
    set({ params: updated, trajectory: traj });
  },

  setAzimuth: (azimuth, mode) => {
    const updated = { ...get().params, launchAzimuth: azimuth };
    const traj = solveProjectileTrajectory(updated, get().target, mode);
    set({ params: updated, trajectory: traj });
  },

  updateParameters: (partial, mode) => {
    const updated = { ...get().params, ...partial };
    const traj = solveProjectileTrajectory(updated, get().target, mode);
    set({ params: updated, trajectory: traj });
  },

  recomputeTrajectory: (mode) => {
    const params = get().params;
    // When in university mode, apply Kepler-186f atmosphere and gravity
    const adjustedParams: ProjectileParameters = {
      ...params,
      gravity: mode === 'university' ? 12.1 : 9.81,
      airDensity: mode === 'university' ? 1.38 : 0.0,
    };
    const traj = solveProjectileTrajectory(adjustedParams, get().target, mode);
    set({ params: adjustedParams, trajectory: traj });
  },

  startLaunch: () => {
    set({
      isFiring: true,
      flightCurrentTime: 0,
      currentProjectilePos: { ...get().params.initialPosition },
    });
  },

  updateFlightTick: (dt: number) => {
    const { isFiring, flightCurrentTime, trajectory } = get();
    if (!isFiring) return { finished: true };

    const newTime = flightCurrentTime + dt;
    const points = trajectory.points;
    const totalTime = trajectory.metrics.timeOfFlight;

    if (newTime >= totalTime) {
      const lastPoint = points[points.length - 1];
      set({
        isFiring: false,
        flightCurrentTime: totalTime,
        currentProjectilePos: { x: lastPoint.x, y: lastPoint.y, z: lastPoint.z },
        lastResult: trajectory,
      });
      return {
        finished: true,
        impactPoint: { x: lastPoint.x, y: lastPoint.y, z: lastPoint.z },
      };
    }

    // Interpolate position along pre-calculated points
    const stepFraction = Math.min(1, Math.max(0, newTime / totalTime));
    const targetIndex = Math.min(
      points.length - 1,
      Math.floor(stepFraction * (points.length - 1))
    );
    const p = points[targetIndex];

    set({
      flightCurrentTime: newTime,
      currentProjectilePos: { x: p.x, y: p.y, z: p.z },
    });

    return { finished: false };
  },

  resetLaunch: () => {
    set({
      isFiring: false,
      flightCurrentTime: 0,
      currentProjectilePos: null,
    });
  },
}));

