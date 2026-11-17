/**
 * PRISM Physics Simulation Types
 * Accurate Kinematic & Dynamic Trajectory Modeling
 */

export type LearningMode = 'school' | 'university';

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface TrajectoryPoint {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  speed: number;
  time: number;
  kineticEnergy?: number;
  potentialEnergy?: number;
}

export interface ProjectileParameters {
  initialSpeed: number;     // m/s (e.g. 20 - 60)
  launchAngle: number;      // degrees (elevation theta: 0 - 85)
  launchAzimuth: number;    // degrees (heading phi: -45 to +45)
  initialPosition: Vector3D;// [x0, y0, z0] in world space
  gravity: number;          // m/s^2 (e.g. 9.81 on Earth, 12.1 on Kepler-186f)
  projectileMass: number;   // kg (e.g. 2.5 kg beacon canister)
  dragCoefficient: number;  // Cd (e.g. 0.47 for sphere)
  crossSectionArea: number; // m^2 (e.g. 0.03 m^2)
  airDensity: number;       // kg/m^3 (0 for School mode, 1.38 for Kepler-186f University mode)
  windVelocity: Vector3D;   // m/s wind vector
}

export interface TargetZone {
  position: Vector3D;
  radius: number;           // outer target ring radius (e.g. 8.0 m)
  innerRadius: number;      // bullseye radius (e.g. 2.5 m)
  elevation: number;        // y coordinate of receiver
  name: string;
}

export interface TrajectoryMetrics {
  timeOfFlight: number;     // seconds
  maxHeight: number;        // apex height in meters
  horizontalRange: number;  // distance to ground/target plane in meters
  impactVelocity: Vector3D; // velocity at impact
  impactSpeed: number;      // speed magnitude at impact
  distanceToTarget: number; // miss distance to target center in meters
  isHit: boolean;           // landed within target radius
  isBullseye: boolean;      // landed within inner target radius
  score: number;            // 0 - 100 accuracy score
}

export interface TrajectoryResult {
  points: TrajectoryPoint[];
  metrics: TrajectoryMetrics;
}

