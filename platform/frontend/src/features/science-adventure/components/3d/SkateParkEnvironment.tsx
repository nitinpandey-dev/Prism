import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useAdventureStore } from '../../stores/useAdventureStore';

export default function SkateParkEnvironment() {
  const {
    activeMissionId,
    missionState,
    starsCollected,
    collectStar,
    skaterPosition,
    footballPosition,
  } = useAdventureStore();

  const footballRef = useRef<THREE.Group>(null);
  const starRefs = useRef<(THREE.Group | null)[]>([]);

  // 3 Golden Adventure Stars positions
  const starPositions: [number, number, number][] = useMemo(
    () => [
      [6.5, 2.2, -12], // Star 1: On top of wooden ramp
      [-6.0, 1.2, -2], // Star 2: Over the icy pond
      [8.0, 1.0, 18],  // Star 3: In the park garden
    ],
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Rotate the collectible stars
    starRefs.current.forEach((ref, idx) => {
      if (ref && !starsCollected.includes(idx + 1)) {
        ref.rotation.y = t * 2.5;
        ref.position.y = starPositions[idx][1] + Math.sin(t * 3 + idx) * 0.15;

        // Check if skater collected this star
        const dx = skaterPosition[0] - ref.position.x;
        const dz = skaterPosition[2] - ref.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < 1.6) {
          collectStar(idx + 1);
        }
      }
    });

    // Update football position from store
    if (footballRef.current) {
      footballRef.current.position.set(footballPosition[0], footballPosition[1], footballPosition[2]);
    }
  });

  return (
    <group>
      {/* ── 1. WARM SUNNY DAYLIGHT & SKY ── */}
      <ambientLight intensity={0.7} color="#f0f9ff" />
      <directionalLight
        position={[30, 50, 25]}
        intensity={2.0}
        color="#fffbeb"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-35}
        shadow-camera-right={35}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <hemisphereLight args={['#bae6fd', '#4ade80', 0.65]} />

      {/* Sky Sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[200, 32, 16]} />
        <meshBasicMaterial color="#38bdf8" side={THREE.BackSide} />
      </mesh>

      {/* Sun glow */}
      <mesh position={[80, 110, 70]}>
        <sphereGeometry args={[12, 16, 16]} />
        <meshBasicMaterial color="#fde047" />
      </mesh>

      {/* ── 2. GENERAL PARK BASE (Green Grass Lawn) ── */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[90, 0.3, 120]} />
        <meshStandardMaterial color="#22c55e" roughness={0.85} />
      </mesh>

      {/* ── 3. MAIN CONCRETE SKATE PLAZA & TRACKS ── */}
      {/* Central Wide Concrete Plaza */}
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <boxGeometry args={[16, 0.04, 76]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.45} metalness={0.15} />
      </mesh>

      {/* Concrete Cross Paths */}
      <mesh position={[0, 0.015, -15]} receiveShadow>
        <boxGeometry args={[36, 0.03, 10]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.015, 15]} receiveShadow>
        <boxGeometry args={[36, 0.03, 10]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.5} />
      </mesh>

      {/* Track Outer Safety Curbing */}
      {[-8.2, 8.2].map((cx, i) => (
        <mesh key={i} position={[cx, 0.08, 0]}>
          <boxGeometry args={[0.4, 0.16, 76]} />
          <meshStandardMaterial color="#64748b" roughness={0.6} />
        </mesh>
      ))}

      {/* ── 4. ICY POND / SLIPPERY PATCH (Left side: X ≈ -6, Z between -8 and 4) ── */}
      <group position={[-6.0, 0.03, -2.0]}>
        {/* Ice Surface */}
        <mesh receiveShadow>
          <boxGeometry args={[5.2, 0.02, 16]} />
          <meshStandardMaterial
            color="#38bdf8"
            roughness={0.06}
            metalness={0.7}
            emissive="#0284c7"
            emissiveIntensity={0.25}
          />
        </mesh>
        {/* Ice Frost Rim Border */}
        <mesh position={[0, 0.015, 0]}>
          <boxGeometry args={[5.4, 0.01, 16.2]} />
          <meshBasicMaterial color="#e0f2fe" wireframe />
        </mesh>
        {/* Frosted Warning Snowflake Icons on Ground */}
        {[-4, 0, 4].map((zOffset, i) => (
          <mesh key={i} position={[0, 0.03, zOffset]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.4, 0.7, 6]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
          </mesh>
        ))}
      </group>

      {/* ── 5. WOODEN RAMP & ELEVATED BOARDWALK (Right side: X ≈ 6.5, Z between -20 and -5) ── */}
      <group position={[6.5, 0, -12.5]}>
        {/* Sloped Incline Ramp */}
        <mesh position={[0, 0.75, 0]} rotation={[0.1, 0, 0]} receiveShadow castShadow>
          <boxGeometry args={[4.2, 0.15, 14]} />
          <meshStandardMaterial color="#b45309" roughness={0.65} metalness={0.1} />
        </mesh>
        {/* Wooden Support Pillars */}
        {[-1.8, 1.8].map((px, i) => (
          <group key={i}>
            <mesh position={[px, 0.4, -4]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
            <mesh position={[px, 0.75, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, 1.5, 8]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── 6. MISSION 2: FOOTBALL & GREEN SAFE STOPPING ZONE ── */}
      {/* Green Safe Stopping Zone (Z = 7 to 12) */}
      <group position={[0, 0.035, 9.5]}>
        <mesh receiveShadow>
          <boxGeometry args={[15.6, 0.01, 5.0]} />
          <meshStandardMaterial color="#10b981" transparent opacity={0.35} />
        </mesh>
        {/* Safe Stop Boundary Line */}
        <mesh position={[0, 0.01, -2.5]}>
          <boxGeometry args={[15.6, 0.02, 0.2]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
        <mesh position={[0, 0.01, 2.5]}>
          <boxGeometry args={[15.6, 0.02, 0.2]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
      </group>

      {/* Interactive Football (At Z = 12.5) */}
      <group ref={footballRef} position={[footballPosition[0], footballPosition[1], footballPosition[2]]}>
        {/* Football Sphere with Classic Hexagon pattern approximation */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.38, 20, 20]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
        {/* Black Football Patches */}
        {[-0.2, 0.2].map((ox, i) => (
          <mesh key={i} position={[ox, 0.15, 0.15]}>
            <boxGeometry args={[0.14, 0.14, 0.14]} />
            <meshStandardMaterial color="#1e293b" roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* ── 7. STARTING ARCH & FINISH GATES ── */}
      {/* Starting Arch (Z = -22) */}
      <group position={[0, 0, -22]}>
        {/* Checkered Start Line */}
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[16.0, 0.02, 0.8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Arch Pillars */}
        <mesh position={[-8.5, 2.8, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.3, 5.6, 12]} />
          <meshStandardMaterial color="#3b82f6" metalness={0.6} />
        </mesh>
        <mesh position={[8.5, 2.8, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.3, 5.6, 12]} />
          <meshStandardMaterial color="#3b82f6" metalness={0.6} />
        </mesh>
        {/* Arch Header */}
        <mesh position={[0, 5.2, 0]} castShadow>
          <boxGeometry args={[18.0, 1.1, 0.4]} />
          <meshStandardMaterial color="#1d4ed8" />
        </mesh>
        <mesh position={[0, 5.2, 0.22]}>
          <boxGeometry args={[17.2, 0.7, 0.04]} />
          <meshBasicMaterial color="#facc15" />
        </mesh>
      </group>

      {/* Finish Arch & Target (Z = 28) */}
      <group position={[0, 0, 28]}>
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[16.0, 0.02, 1.2]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
        {/* Red/White Safety Foam Crash Barrier */}
        <mesh position={[0, 0.7, 1.2]} castShadow>
          <boxGeometry args={[16.4, 1.4, 0.8]} />
          <meshStandardMaterial color="#dc2626" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.7, 1.62]}>
          <boxGeometry args={[15.8, 0.3, 0.05]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
      </group>

      {/* ── 8. THREE GOLDEN ADVENTURE STARS (Mission 5 & Exploration) ── */}
      {starPositions.map((pos, idx) => {
        const isCollected = starsCollected.includes(idx + 1);
        if (isCollected) return null;
        return (
          <group
            key={idx}
            ref={(el) => (starRefs.current[idx] = el)}
            position={[pos[0], pos[1], pos[2]]}
          >
            {/* Glowing Golden Star Mesh */}
            <mesh castShadow>
              <octahedronGeometry args={[0.55, 0]} />
              <meshStandardMaterial
                color="#facc15"
                emissive="#eab308"
                emissiveIntensity={0.8}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            {/* Pulsing Light */}
            <pointLight color="#fde047" intensity={1.5} distance={4} />
          </group>
        );
      })}

      {/* ── 9. PARK DECORATIONS (Trees, Benches, Cones) ── */}
      {/* Trees along borders */}
      {[
        [-14, -18], [-15, 0], [-14, 16], [-16, 30],
        [14, -18], [15, 2], [14, 20], [16, 32],
      ].map(([tx, tz], i) => (
        <group key={i} position={[tx, 0, tz]}>
          {/* Trunk */}
          <mesh position={[0, 1.4, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.45, 2.8, 8]} />
            <meshStandardMaterial color="#713f12" />
          </mesh>
          {/* Foliage Cones */}
          <mesh position={[0, 3.8, 0]} castShadow>
            <coneGeometry args={[2.0, 3.2, 8]} />
            <meshStandardMaterial color="#15803d" roughness={0.7} />
          </mesh>
          <mesh position={[0, 5.4, 0]} castShadow>
            <coneGeometry args={[1.5, 2.5, 8]} />
            <meshStandardMaterial color="#16a34a" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Park Benches */}
      {[-10.5, 10.5].map((bx, i) => (
        <group key={i} position={[bx, 0.4, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.4, 0.45, 3.0]} />
            <meshStandardMaterial color="#92400e" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Orange Safety Traffic Cones */}
      {[
        [-3.0, -10], [3.0, -10],
        [-3.0, 5], [3.0, 5],
        [0, 18],
      ].map(([cx, cz], i) => (
        <group key={i} position={[cx, 0, cz]}>
          {/* Base */}
          <mesh position={[0, 0.05, 0]} castShadow>
            <boxGeometry args={[0.5, 0.1, 0.5]} />
            <meshStandardMaterial color="#ea580c" />
          </mesh>
          {/* Cone */}
          <mesh position={[0, 0.45, 0]} castShadow>
            <coneGeometry args={[0.2, 0.8, 12]} />
            <meshStandardMaterial color="#f97316" />
          </mesh>
          {/* White Stripe */}
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.13, 0.15, 0.2, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
