import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { usePhysicsStore } from '../../stores/usePhysicsStore';
import { useMissionStore } from '../../stores/useMissionStore';
import { useAriaStore } from '../../stores/useAriaStore';

export default function LauncherMortar() {
  const params = usePhysicsStore((s) => s.params);
  const isFiring = usePhysicsStore((s) => s.isFiring);
  const recordLaunchAttempt = useMissionStore((s) => s.recordLaunchAttempt);
  const addAriaMessage = useAriaStore((s) => s.addMessage);

  const barrelRef = useRef<THREE.Group>(null);
  const baseRef = useRef<THREE.Group>(null);
  const flashRef = useRef<THREE.PointLight>(null);
  const projectileRef = useRef<THREE.Group>(null);

  // Convert degrees to radians
  const pitchRad = (params.launchAngle * Math.PI) / 180;
  const yawRad = (params.launchAzimuth * Math.PI) / 180;

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);

    // Smoothly orient barrel pitch and base yaw (negative yaw rotates right)
    if (baseRef.current) {
      baseRef.current.rotation.y = THREE.MathUtils.lerp(
        baseRef.current.rotation.y,
        -yawRad,
        0.1
      );
    }
    if (barrelRef.current) {
      // In Three.js, rotating around X tilts the barrel up towards positive Z
      barrelRef.current.rotation.x = THREE.MathUtils.lerp(
        barrelRef.current.rotation.x,
        -pitchRad,
        0.1
      );
    }

    // Step the projectile flight physics if actively firing
    if (isFiring) {
      const result = usePhysicsStore.getState().updateFlightTick(dt);

      // Direct ref update without React re-render
      if (projectileRef.current) {
        const curPos = usePhysicsStore.getState().currentProjectilePos;
        if (curPos) {
          projectileRef.current.position.set(
            curPos.x - params.initialPosition.x,
            curPos.y - 0.8,
            curPos.z - params.initialPosition.z
          );
        }
      }

      if (result.finished) {
        // Projectile hit ground or target!
        const lastResult = usePhysicsStore.getState().lastResult;
        if (lastResult) {
          const isHit = recordLaunchAttempt(lastResult.metrics);
          if (isHit) {
            addAriaMessage(
              'aria',
              `DIRECT HIT! Capsule captured by Relay Funnel #4! Score: ${lastResult.metrics.score}%. Emergency beacon uplink verified. Outpost telemetry restored!`,
              'celebrating'
            );
          } else {
            addAriaMessage(
              'aria',
              `Missed by ${lastResult.metrics.distanceToTarget} meters! Impact velocity: ${lastResult.metrics.impactSpeed} m/s. Adjust initial speed or launch angle on the console and try again.`,
              'warning'
            );
          }
        }
      }
    }
  });

  return (
    <group position={[params.initialPosition.x, 0.8, params.initialPosition.z]}>
      {/* ── 1. Heavy Static Pedestal ── */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.0, 2.5, 0.8, 16]} />
        <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* ── 2. Rotating Turret Base (Yaw) ── */}
      <group ref={baseRef}>
        <mesh position={[0, 1.0, 0]} castShadow>
          <cylinderGeometry args={[1.5, 1.8, 0.6, 16]} />
          <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.9} />
        </mesh>

        {/* Support Trunnions (Left & Right) */}
        <mesh position={[-1.1, 1.8, 0]} castShadow>
          <boxGeometry args={[0.3, 1.2, 0.8]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
        <mesh position={[1.1, 1.8, 0]} castShadow>
          <boxGeometry args={[0.3, 1.2, 0.8]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>

        {/* ── 3. Elevating Launcher Tube / Barrel (Pitch) ── */}
        <group position={[0, 1.8, 0]} ref={barrelRef}>
          {/* Main Launch Tube */}
          <mesh position={[0, 0, 1.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.45, 0.55, 3.6, 24]} />
            <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.7} />
          </mesh>

          {/* Muzzle Ring */}
          <mesh position={[0, 0, 3.6]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.48, 0.08, 16, 24]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.5} />
          </mesh>

          {/* Pneumatic Reservoir Tank */}
          <mesh position={[0, -0.4, 1.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.25, 0.25, 2.2, 16]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.6} />
          </mesh>

          {/* Muzzle Flash Light when Firing */}
          {isFiring && (
            <pointLight
              ref={flashRef}
              position={[0, 0, 3.8]}
              color="#38bdf8"
              intensity={4}
              distance={12}
            />
          )}
        </group>
      </group>

      {/* ── 4. Projectile In Flight ── */}
      <group ref={projectileRef} visible={isFiring}>
        {/* Beacon Canister Capsule */}
        <mesh castShadow>
          <cylinderGeometry args={[0.3, 0.3, 1.0, 16]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.8}
            metalness={0.9}
          />
        </mesh>
        {/* Ion Glow Trail */}
        <pointLight color="#38bdf8" intensity={2.5} distance={8} />
        <mesh scale={[1.4, 1.4, 1.4]}>
          <sphereGeometry args={[0.4, 12, 12]} />
          <meshBasicMaterial color="#7dd3fc" transparent opacity={0.6} />
        </mesh>
      </group>
    </group>
  );
}

