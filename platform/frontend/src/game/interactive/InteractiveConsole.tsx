import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../stores/useGameStore';

export default function InteractiveConsole() {
  const isConsoleOpen = useGameStore((s) => s.isConsoleOpen);
  const nearInteractableId = useGameStore((s) => s.player.nearInteractableId);
  const isNear = nearInteractableId === 'launcher_console';

  const screenRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (screenRef.current) {
      const mat = screenRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = 0.5 + 0.2 * Math.sin(state.clock.elapsedTime * 2);
      }
    }
  });

  return (
    <group position={[0, 0.8, 8.2]}>
      {/* Console Pedestal Base */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.8, 1.0, 0.8]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Angled Control Screen Deck */}
      <group position={[0, 1.1, 0.1]} rotation={[-0.45, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.6, 0.9, 0.12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.5} />
        </mesh>
        {/* Glowing Interface Screen */}
        <mesh position={[0, 0, 0.07]} ref={screenRef}>
          <planeGeometry args={[1.45, 0.75]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0284c7"
            emissiveIntensity={0.6}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Ambient Console Glow */}
      <pointLight position={[0, 1.4, 0.4]} color="#38bdf8" intensity={isNear ? 2.5 : 1.0} distance={4} />

      {/* Proximity Floating [E] Prompt Marker */}
      {isNear && !isConsoleOpen && (
        <group position={[0, 2.2, 0]}>
          <mesh>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
      )}
    </group>
  );
}

