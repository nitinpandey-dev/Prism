/**
 * PRISM Mission System Types
 * PHY-001: The Last Signal
 */

export type MissionStage =
  | 'BRIEFING'          // Initial arrival, review mission context
  | 'INVESTIGATION'     // Locate launcher apparatus
  | 'CALIBRATION'       // Adjust angle and velocity to match target
  | 'LAUNCH_IN_FLIGHT'  // Projectile is actively flying
  | 'EVALUATION'        // Telemetry review & hit/miss scoring
  | 'COMPLETED';        // Relay online, mission cleared

export interface MissionObjective {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface MissionState {
  missionId: string;
  title: string;
  stage: MissionStage;
  objectives: MissionObjective[];
  attemptsCount: number;
  bestScore: number;
  lastScore: number;
  isRelayOnline: boolean;
}

