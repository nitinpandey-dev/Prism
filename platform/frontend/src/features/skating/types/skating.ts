/**
 * PRISM Skating Science Adventure Types
 * PHY-ACT-001: The Great Skating Challenge
 */

export type SurfaceType = 'slippery' | 'normal' | 'rough';

export interface SurfaceConfig {
  id: SurfaceType;
  name: string;
  materialName: string;
  frictionCoeff: number; // Effective braking resistance mu
  color: string;
  laneX: number; // Lane lateral X offset in the skate park
  description: string;
  realWorldExample: string;
}

export const SURFACES: Record<SurfaceType, SurfaceConfig> = {
  slippery: {
    id: 'slippery',
    name: 'Slippery Surface',
    materialName: 'Polished Resin / Ice Sheet',
    frictionCoeff: 0.15,
    color: '#38bdf8', // Ice Cyan
    laneX: -6.0,
    description: 'Minimal braking resistance. Low friction requires extensive stopping distance.',
    realWorldExample: 'Ice rink, wet tile, polished resin floor',
  },
  normal: {
    id: 'normal',
    name: 'Normal Concrete',
    materialName: 'Smooth Skatepark Concrete',
    frictionCoeff: 0.40,
    color: '#94a3b8', // Concrete Gray
    laneX: 0.0,
    description: 'Balanced braking traction. Standard baseline for recreational roller skating.',
    realWorldExample: 'Standard skatepark concrete, dry outdoor basketball court',
  },
  rough: {
    id: 'rough',
    name: 'Rough Surface',
    materialName: 'Textured Tartan / Weathered Asphalt',
    frictionCoeff: 0.75,
    color: '#f97316', // Terra-cotta Orange
    laneX: 6.0,
    description: 'High braking resistance. Strong grip produces rapid deceleration.',
    realWorldExample: 'Textured rubber athletic track, coarse asphalt road',
  },
};

export type LearningStage =
  | 'STAGE_1_CHOOSE_ACTIVITY'
  | 'STAGE_2_WATCH_WONDER'
  | 'STAGE_3_GET_MISSION'
  | 'STAGE_4_MAKE_PREDICTION'
  | 'STAGE_5_EXPERIMENT'
  | 'STAGE_6_SEE_RESULTS'
  | 'STAGE_7_LEARN_CONCEPT'
  | 'STAGE_8_EXPLORE_MORE';

export type PredictionOption = 'slippery' | 'normal' | 'rough' | 'not_sure';

export interface ExperimentRunRecord {
  id: string;
  timestamp: number;
  surface: SurfaceType;
  surfaceName: string;
  frictionCoeff: number;
  initialSpeed: number; // m/s
  deceleration: number; // m/s^2
  stoppingDistance: number; // m
  stoppingTime: number; // s
  wasTargetHit: boolean; // Stopped inside target zone (10m - 14m)
}

export interface FrictionCalculationResult {
  initialSpeed: number;
  frictionCoeff: number;
  gravity: number;
  normalForce: number;
  frictionForce: number;
  deceleration: number;
  stoppingDistance: number;
  stoppingTime: number;
  workDoneByFriction: number;
}
