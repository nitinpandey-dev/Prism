/**
 * PRISM Scientific Projectile Physics Engine
 * ============================================
 * Rigorous projectile motion calculations supporting:
 * - Analytical vacuum ballistic kinematics (School Mode)
 * - Numerical Runge-Kutta 4th Order (RK4) with quadratic air resistance (University Mode)
 * - 3D trajectory decomposition with elevation theta and azimuth phi
 * - Exact ground / target plane collision detection
 */

import {
  ProjectileParameters,
  TrajectoryPoint,
  TrajectoryMetrics,
  TrajectoryResult,
  TargetZone,
  LearningMode,
  Vector3D,
} from '../../types/physics';

/**
 * Solves 3D projectile trajectory with analytical or RK4 integration
 */
export function solveProjectileTrajectory(
  params: ProjectileParameters,
  target: TargetZone,
  mode: LearningMode = 'school'
): TrajectoryResult {
  const thetaRad = (params.launchAngle * Math.PI) / 180;
  const phiRad = (params.launchAzimuth * Math.PI) / 180;

  // Initial velocity components
  // In our 3D coordinate system facing down the canyon (+Z):
  // -X is Right, +X is Left
  // Positive azimuth (+phi) aims Right -> negative X velocity
  const v0 = params.initialSpeed;
  const vx0 = -v0 * Math.cos(thetaRad) * Math.sin(phiRad);
  const vy0 = v0 * Math.sin(thetaRad);
  const vz0 = v0 * Math.cos(thetaRad) * Math.cos(phiRad);

  const p0 = params.initialPosition;
  const g = params.gravity;

  const points: TrajectoryPoint[] = [];

  // Mode Selection: School (vacuum analytical) vs University (RK4 with drag)
  if (mode === 'school' || params.airDensity <= 0.001) {
    // ─── 1. SCHOOL MODE: EXACT ANALYTICAL SOLUTION ───
    // y(t) = y0 + vy0*t - 0.5*g*t^2
    // Target landing plane: y = target.elevation
    // y0 - y_target + vy0*t - 0.5*g*t^2 = 0
    // 0.5*g*t^2 - vy0*t - (y0 - y_target) = 0
    const dy = p0.y - target.elevation;
    const discriminant = vy0 * vy0 + 2 * g * dy;
    const tFlight = discriminant >= 0 ? (vy0 + Math.sqrt(discriminant)) / g : (2 * vy0) / g;

    const timeAtMaxH = Math.max(0, vy0 / g);
    const apexHeight = p0.y + (vy0 * vy0) / (2 * g);

    const steps = 180;
    const dt = tFlight / steps;

    for (let i = 0; i <= steps; i++) {
      const t = i * dt;
      const x = p0.x + vx0 * t;
      const y = Math.max(target.elevation - 1.0, p0.y + vy0 * t - 0.5 * g * t * t);
      const z = p0.z + vz0 * t;

      const vy = vy0 - g * t;
      const speed = Math.sqrt(vx0 * vx0 + vy * vy + vz0 * vz0);

      const kinetic = 0.5 * params.projectileMass * speed * speed;
      const potential = params.projectileMass * g * Math.max(0, y - target.elevation);

      points.push({
        x,
        y,
        z,
        vx: vx0,
        vy,
        vz: vz0,
        speed,
        time: t,
        kineticEnergy: kinetic,
        potentialEnergy: potential,
      });

      // Stop once passed target elevation after apex
      if (t > timeAtMaxH && y <= target.elevation) {
        break;
      }
    }

    const lastPoint = points[points.length - 1];
    const dx = lastPoint.x - target.position.x;
    const dz = lastPoint.z - target.position.z;
    const missDistance = Math.sqrt(dx * dx + dz * dz);

    const isHit = missDistance <= target.radius;
    const isBullseye = missDistance <= target.innerRadius;

    // Score: 100 for bullseye, scaled down to 0 at 2.5x radius
    const score = Math.max(
      0,
      Math.min(100, Math.round(100 * Math.max(0, 1 - missDistance / (target.radius * 2.0))))
    );

    const horizontalRange = Math.sqrt(
      Math.pow(lastPoint.x - p0.x, 2) + Math.pow(lastPoint.z - p0.z, 2)
    );

    const metrics: TrajectoryMetrics = {
      timeOfFlight: Number(lastPoint.time.toFixed(2)),
      maxHeight: Number(apexHeight.toFixed(2)),
      horizontalRange: Number(horizontalRange.toFixed(2)),
      impactVelocity: {
        x: Number(lastPoint.vx.toFixed(2)),
        y: Number(lastPoint.vy.toFixed(2)),
        z: Number(lastPoint.vz.toFixed(2)),
      },
      impactSpeed: Number(lastPoint.speed.toFixed(2)),
      distanceToTarget: Number(missDistance.toFixed(2)),
      isHit,
      isBullseye,
      score,
    };

    return { points, metrics };
  } else {
    // ─── 2. UNIVERSITY MODE: RUNGE-KUTTA 4TH ORDER (RK4) WITH DRAG ───
    // Drag equation: F_d = -0.5 * rho * Cd * A * |v| * v
    // Acceleration: a = g_vec + F_d / m
    const m = params.projectileMass;
    const rho = params.airDensity;
    const Cd = params.dragCoefficient;
    const A = params.crossSectionArea;
    const dragConstant = 0.5 * rho * Cd * A;

    // State vector: [x, y, z, vx, vy, vz]
    type State = [number, number, number, number, number, number];

    const getDerivatives = (s: State): State => {
      const vx = s[3] - params.windVelocity.x;
      const vy = s[4] - params.windVelocity.y;
      const vz = s[5] - params.windVelocity.z;
      const speedRel = Math.sqrt(vx * vx + vy * vy + vz * vz);

      const Fd_x = -dragConstant * speedRel * vx;
      const Fd_y = -dragConstant * speedRel * vy;
      const Fd_z = -dragConstant * speedRel * vz;

      const ax = Fd_x / m;
      const ay = -g + Fd_y / m;
      const az = Fd_z / m;

      return [s[3], s[4], s[5], ax, ay, az];
    };

    let state: State = [p0.x, p0.y, p0.z, vx0, vy0, vz0];
    let t = 0;
    const dt = 0.02; // 50 Hz numerical resolution
    let maxApex = p0.y;

    points.push({
      x: state[0],
      y: state[1],
      z: state[2],
      vx: state[3],
      vy: state[4],
      vz: state[5],
      speed: v0,
      time: 0,
      kineticEnergy: 0.5 * m * v0 * v0,
      potentialEnergy: m * g * (p0.y - target.elevation),
    });

    const maxSteps = 1000;
    for (let step = 0; step < maxSteps; step++) {
      // RK4 step
      const k1 = getDerivatives(state);

      const s2: State = [
        state[0] + 0.5 * dt * k1[0],
        state[1] + 0.5 * dt * k1[1],
        state[2] + 0.5 * dt * k1[2],
        state[3] + 0.5 * dt * k1[3],
        state[4] + 0.5 * dt * k1[4],
        state[5] + 0.5 * dt * k1[5],
      ];
      const k2 = getDerivatives(s2);

      const s3: State = [
        state[0] + 0.5 * dt * k2[0],
        state[1] + 0.5 * dt * k2[1],
        state[2] + 0.5 * dt * k2[2],
        state[3] + 0.5 * dt * k2[3],
        state[4] + 0.5 * dt * k2[4],
        state[5] + 0.5 * dt * k2[5],
      ];
      const k3 = getDerivatives(s3);

      const s4: State = [
        state[0] + dt * k3[0],
        state[1] + dt * k3[1],
        state[2] + dt * k3[2],
        state[3] + dt * k3[3],
        state[4] + dt * k3[4],
        state[5] + dt * k3[5],
      ];
      const k4 = getDerivatives(s4);

      state = [
        state[0] + (dt / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]),
        state[1] + (dt / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]),
        state[2] + (dt / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]),
        state[3] + (dt / 6) * (k1[3] + 2 * k2[3] + 2 * k3[3] + k4[3]),
        state[4] + (dt / 6) * (k1[4] + 2 * k2[4] + 2 * k3[4] + k4[4]),
        state[5] + (dt / 6) * (k1[5] + 2 * k2[5] + 2 * k3[5] + k4[5]),
      ];
      t += dt;

      if (state[1] > maxApex) maxApex = state[1];

      const currentSpeed = Math.sqrt(state[3] * state[3] + state[4] * state[4] + state[5] * state[5]);

      points.push({
        x: state[0],
        y: state[1],
        z: state[2],
        vx: state[3],
        vy: state[4],
        vz: state[5],
        speed: currentSpeed,
        time: t,
        kineticEnergy: 0.5 * m * currentSpeed * currentSpeed,
        potentialEnergy: m * g * Math.max(0, state[1] - target.elevation),
      });

      // Impact termination: y <= target.elevation while falling
      if (state[4] < 0 && state[1] <= target.elevation) {
        break;
      }
    }

    const lastPoint = points[points.length - 1];
    const dx = lastPoint.x - target.position.x;
    const dz = lastPoint.z - target.position.z;
    const missDistance = Math.sqrt(dx * dx + dz * dz);

    const isHit = missDistance <= target.radius;
    const isBullseye = missDistance <= target.innerRadius;

    const score = Math.max(
      0,
      Math.min(100, Math.round(100 * Math.max(0, 1 - missDistance / (target.radius * 2.0))))
    );

    const horizontalRange = Math.sqrt(
      Math.pow(lastPoint.x - p0.x, 2) + Math.pow(lastPoint.z - p0.z, 2)
    );

    const metrics: TrajectoryMetrics = {
      timeOfFlight: Number(lastPoint.time.toFixed(2)),
      maxHeight: Number(maxApex.toFixed(2)),
      horizontalRange: Number(horizontalRange.toFixed(2)),
      impactVelocity: {
        x: Number(lastPoint.vx.toFixed(2)),
        y: Number(lastPoint.vy.toFixed(2)),
        z: Number(lastPoint.vz.toFixed(2)),
      },
      impactSpeed: Number(lastPoint.speed.toFixed(2)),
      distanceToTarget: Number(missDistance.toFixed(2)),
      isHit,
      isBullseye,
      score,
    };

    return { points, metrics };
  }
}

