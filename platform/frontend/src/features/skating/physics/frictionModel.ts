/**
 * PRISM Scientific Friction & Stopping Distance Engine
 * ====================================================
 * Implements the constant-deceleration braking resistance model:
 *
 * Normal Force:          N = m * g
 * Friction Force:        F = mu * N = mu * m * g
 * Deceleration:          a = F / m = mu * g
 * Stopping Distance:     d = v0^2 / (2 * mu * g)
 * Stopping Time:         t_stop = v0 / (mu * g)
 *
 * Instantaneous kinematics during braking (0 <= t <= t_stop):
 * Position:              x(t) = v0 * t - 0.5 * a * t^2
 * Velocity:              v(t) = max(0, v0 - a * t)
 *
 * Work-Energy Theorem:   W_friction = -F * d = -0.5 * m * v0^2
 */

import { FrictionCalculationResult, SurfaceType, SURFACES } from '../types/skating';

export const STANDARD_GRAVITY = 9.81; // m/s^2
export const SKATER_MASS = 50.0;      // kg (Alex: 50 kg youth skater)

/**
 * Calculates theoretical stopping metrics for a given initial velocity and surface
 */
export function calculateFrictionMetrics(
  initialSpeed: number,
  surface: SurfaceType,
  skaterMass: number = SKATER_MASS,
  gravity: number = STANDARD_GRAVITY
): FrictionCalculationResult {
  const mu = SURFACES[surface].frictionCoeff;
  const v0 = Math.max(0.1, initialSpeed);

  // Normal Force N = m * g
  const normalForce = skaterMass * gravity;

  // Friction Force F = mu * N
  const frictionForce = mu * normalForce;

  // Deceleration a = mu * g
  const deceleration = mu * gravity;

  // Stopping distance d = v0^2 / (2 * a)
  const stoppingDistance = (v0 * v0) / (2 * deceleration);

  // Stopping time t = v0 / a
  const stoppingTime = v0 / deceleration;

  // Work done by friction = -0.5 * m * v0^2
  const workDoneByFriction = -0.5 * skaterMass * v0 * v0;

  return {
    initialSpeed: Number(v0.toFixed(2)),
    frictionCoeff: mu,
    gravity,
    normalForce: Number(normalForce.toFixed(2)),
    frictionForce: Number(frictionForce.toFixed(2)),
    deceleration: Number(deceleration.toFixed(3)),
    stoppingDistance: Number(stoppingDistance.toFixed(2)),
    stoppingTime: Number(stoppingTime.toFixed(2)),
    workDoneByFriction: Number(workDoneByFriction.toFixed(1)),
  };
}

/**
 * Computes instantaneous position and velocity at time t after brake activation
 */
export function getKinematicStateAtTime(
  initialSpeed: number,
  deceleration: number,
  elapsedTime: number
): { distance: number; velocity: number; isStopped: boolean } {
  const tStop = initialSpeed / deceleration;

  if (elapsedTime >= tStop) {
    const finalDistance = (initialSpeed * initialSpeed) / (2 * deceleration);
    return {
      distance: finalDistance,
      velocity: 0,
      isStopped: true,
    };
  }

  const t = Math.max(0, elapsedTime);
  const distance = initialSpeed * t - 0.5 * deceleration * t * t;
  const velocity = Math.max(0, initialSpeed - deceleration * t);

  return {
    distance,
    velocity,
    isStopped: false,
  };
}
