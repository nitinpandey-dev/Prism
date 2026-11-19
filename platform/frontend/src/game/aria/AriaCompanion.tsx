import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../stores/useGameStore';
import { useAriaStore } from '../../stores/useAriaStore';

export default function AriaCompanion() {
  const mood = useAriaStore((s) => s.currentMood);

  const droneGroupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  // Mood color map
  const moodColors = {
    idle: '#38bdf8',
    guiding: '#06b6d4',
    analyzing: '#c084fc',
    celebrating: '#34d399',
    warning: '#f59e0b',
  };

  const coreColor = moodColors[mood] || '#38bdf8';

  // Target floating offset relative to player
  const currentPos = useRef(new THREE.Vector3(0, 2.5, -10));

  useFrame((state, delta) => {
    if (!droneGroupRef.current) return;

    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const playerPos = useGameStore.getState().player.position;

    // Hover floating position slightly above and to the right of the player
    const targetX = playerPos[0] + 1.2;
    const targetY = playerPos[1] + 1.8 + Math.sin(t * 2.5) * 0.15;
    const targetZ = playerPos[2] - 0.4;

    currentPos.current.x = THREE.MathUtils.lerp(currentPos.current.x, targetX, 5 * dt);
    currentPos.current.y = THREE.MathUtils.lerp(currentPos.current.y, targetY, 5 * dt);
    currentPos.current.z = THREE.MathUtils.lerp(currentPos.current.z, targetZ, 5 * dt);

    droneGroupRef.current.position.copy(currentPos.current);

    // Spin gyroscopic rings
    if (ring1Ref.current) ring1Ref.current.rotation.x = t * 1.8;
    if (ring2Ref.current) ring2Ref.current.rotation.y = t * 1.4;
  });

  return (
    <group ref={droneGroupRef}>
      {/* ── ARIA Holographic Drone Core ── */}
      <mesh>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial
          color={coreColor}
          emissive={coreColor}
          emissiveIntensity={0.9}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Outer Gyro Ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[0.3, 0.02, 12, 32]} />
        <meshBasicMaterial color={coreColor} transparent opacity={0.7} />
      </mesh>

      {/* Outer Gyro Ring 2 */}
      <mesh ref={ring2Ref} rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[0.36, 0.02, 12, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
      </mesh>

      {/* Holographic Pulse Light */}
      <pointLight color={coreColor} intensity={2.0} distance={6} />
    </group>
  );
}

