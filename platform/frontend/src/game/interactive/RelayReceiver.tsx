import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useMissionStore } from '../../stores/useMissionStore';
import { RELAY_TARGET } from '../../stores/usePhysicsStore';

export default function RelayReceiver() {
  const isOnline = useMissionStore((s) => s.isRelayOnline);
  const ringRef = useRef<THREE.Mesh>(null);
  const beamRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.4;
    }
    if (beamRef.current && isOnline) {
      beamRef.current.scale.y = 1.0 + 0.1 * Math.sin(t * 3);
    }
  });

  const pos = RELAY_TARGET.position;

  return (
    <group position={[pos.x, pos.y, pos.z]}>
      {/* ── Outer Foundation Ring ── */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[11, 12, 0.4, 32]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* ── Outer Target Catch Cone (Radius 8.5m) ── */}
      <mesh position={[0, 0.35, 0]} rotation={[-Math.PI / 2, 0, 0]} ref={ringRef}>
        <ringGeometry args={[8.0, 8.5, 32]} />
        <meshBasicMaterial
          color={isOnline ? '#10b981' : '#f59e0b'}
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* ── Inner Bullseye Funnel (Radius 2.8m) ── */}
      <mesh position={[0, 0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 2.8, 32]} />
        <meshBasicMaterial color={isOnline ? '#06b6d4' : '#ef4444'} side={THREE.DoubleSide} />
      </mesh>

      {/* Center Receiver Core */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[2.4, 0.8, 1.2, 24]} />
        <meshStandardMaterial
          color={isOnline ? '#059669' : '#b91c1c'}
          emissive={isOnline ? '#10b981' : '#dc2626'}
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Status Light Beacon */}
      <pointLight
        position={[0, 2, 0]}
        color={isOnline ? '#10b981' : '#ef4444'}
        intensity={isOnline ? 3.5 : 1.5}
        distance={25}
      />

      {/* ── Uplink Signal Beam (Active when Mission Complete) ── */}
      {isOnline && (
        <group position={[0, 15, 0]} ref={beamRef}>
          <mesh>
            <cylinderGeometry args={[0.6, 2.2, 30, 16, 1, true]} />
            <meshBasicMaterial
              color="#06b6d4"
              transparent
              opacity={0.45}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, -14, 0]}>
            <sphereGeometry args={[1.5, 16, 16]} />
            <meshBasicMaterial color="#34d399" />
          </mesh>
        </group>
      )}

      {/* Holographic Label */}
      <group position={[0, 4.5, 0]}>
        <mesh>
          <sphereGeometry args={[0.3, 12, 12]} />
          <meshBasicMaterial color={isOnline ? '#10b981' : '#f59e0b'} />
        </mesh>
      </group>
    </group>
  );
}

