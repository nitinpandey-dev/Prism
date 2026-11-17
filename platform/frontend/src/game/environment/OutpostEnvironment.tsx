import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export default function OutpostEnvironment() {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const sparkRef = useRef<THREE.Points>(null);

  // Subtle electrical sparks on damaged comms tower
  useFrame((state) => {
    if (sparkRef.current) {
      sparkRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group>
      {/* ── Lighting & Atmosphere ── */}
      <ambientLight intensity={0.4} color="#8ca4d8" />
      <directionalLight
        ref={lightRef}
        position={[-30, 45, -20]}
        intensity={1.8}
        color="#ffd2b8" // M-Dwarf Red/Orange Sunlight
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
      />
      <hemisphereLight args={['#a5b4fc', '#475569', 0.5]} />
      <fog attach="fog" args={['#0f172a', 30, 220]} />

      {/* ── Kepler-186f Sky Dome & Distant Mountains ── */}
      <mesh position={[0, -10, 0]}>
        <sphereGeometry args={[220, 32, 16]} />
        <meshBasicMaterial color="#0c1222" side={THREE.BackSide} />
      </mesh>

      {/* Distant Keplerian Sun */}
      <mesh position={[-90, 80, -90]}>
        <sphereGeometry args={[14, 16, 16]} />
        <meshBasicMaterial color="#ff7b54" />
      </mesh>

      {/* ── 1. MAIN OUTPOST PLATEAU (Z: -40 to +25, Y: 0) ── */}
      {/* Main Ground Deck */}
      <mesh position={[0, -0.2, -5]} receiveShadow>
        <boxGeometry args={[70, 0.4, 60]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Launch Pad Raised Platform (Z: 5 to 20, Y: 0.6) */}
      <mesh position={[0, 0.3, 12]} receiveShadow>
        <cylinderGeometry args={[12, 13, 0.8, 32]} />
        <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.4} />
      </mesh>
      {/* Platform Safety Ring */}
      <mesh position={[0, 0.72, 12]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[10.5, 11.2, 32]} />
        <meshBasicMaterial color="#eab308" />
      </mesh>

      {/* ── 2. HABITATION DOME (Behind Player, Z: -26) ── */}
      <group position={[0, 0, -26]}>
        <mesh position={[0, 5, 0]} castShadow>
          <sphereGeometry args={[10, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, 2.5, 9]} castShadow>
          <boxGeometry args={[4, 5, 4]} />
          <meshStandardMaterial color="#64748b" metalness={0.5} />
        </mesh>
        {/* Airlock Light */}
        <pointLight position={[0, 4, 11]} color="#38bdf8" intensity={2} distance={8} />
      </group>

      {/* ── 3. DAMAGED COMMS TOWER (Left, X: -20, Z: 2) ── */}
      <group position={[-20, 0, 2]}>
        {/* Tower Base & Lattice */}
        <mesh position={[0, 8, 0]} castShadow>
          <cylinderGeometry args={[0.8, 2.5, 16, 6]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>
        {/* Tilted Damaged Antenna Dish */}
        <group position={[0, 16, 0]} rotation={[0.4, 0.2, 0.6]}>
          <mesh castShadow>
            <cylinderGeometry args={[4.5, 0.5, 0.6, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} />
          </mesh>
          <pointLight position={[0, 1, 0]} color="#ef4444" intensity={2.5} distance={10} />
        </group>
      </group>

      {/* ── 4. SOLAR ARRAY PANELS (Right, X: 22, Z: -8) ── */}
      <group position={[22, 0, -8]}>
        {[-8, 0, 8].map((zOffset, i) => (
          <group key={i} position={[0, 0, zOffset]} rotation={[-0.3, -0.4, 0]}>
            <mesh position={[0, 2.5, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.3, 5]} />
              <meshStandardMaterial color="#64748b" />
            </mesh>
            <mesh position={[0, 5, 0]} rotation={[Math.PI / 4, 0, 0]} castShadow>
              <boxGeometry args={[6, 0.2, 3]} />
              <meshStandardMaterial color="#1e3a8a" roughness={0.2} metalness={0.9} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── 5. CANYON / CHASM (Z: 25 to 110, Y: -25 to -15) ── */}
      {/* Deep Canyon Bottom */}
      <mesh position={[0, -22, 70]} receiveShadow>
        <boxGeometry args={[120, 2, 80]} />
        <meshStandardMaterial color="#451a03" roughness={0.9} />
      </mesh>
      {/* Canyon Left Cliff Wall */}
      <mesh position={[-38, -10, 70]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[10, 26, 80]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      {/* Canyon Right Cliff Wall */}
      <mesh position={[38, -10, 70]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[10, 26, 80]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>

      {/* ── 6. OPPOSITE CLIFF & RELAY PLATEAU (Z: 110 to 160, Y: -8) ── */}
      <mesh position={[0, -9, 135]} receiveShadow>
        <boxGeometry args={[70, 2, 50]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
      {/* Rocky Cliff Edge facing canyon */}
      <mesh position={[0, -10, 110]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[72, 8, 4]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>

      {/* Barrier Railings at Outpost Edge */}
      <group position={[0, 0.5, 24]}>
        <mesh position={[-12, 0.5, 0]}>
          <boxGeometry args={[14, 1.0, 0.3]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.8} />
        </mesh>
        <mesh position={[12, 0.5, 0]}>
          <boxGeometry args={[14, 1.0, 0.3]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

