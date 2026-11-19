import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useAdventureStore } from '../../stores/useAdventureStore';

export default function SkateParkEnvironment() {
  const { starsCollected, collectStar } = useAdventureStore();

  const footballGroupRef = useRef<THREE.Group>(null);
  const footballMeshRef = useRef<THREE.Mesh>(null);
  const starRefs = useRef<(THREE.Group | null)[]>([]);

  // 3 Golden Adventure Emblems (Prisms)
  const starPositions: [number, number, number][] = useMemo(
    () => [
      [6.5, 2.2, -12], // Prism 1: Elevated Wooden Ramp
      [-6.0, 1.2, -2], // Prism 2: Over the Frosted Ice Pond
      [8.0, 1.0, 18],  // Prism 3: Beside the Pine Grove
    ],
    []
  );

  // Tree coordinates with natural randomized scales and rotations
  const treeData = useMemo(
    () => [
      { pos: [-16, -20], scale: 1.15, rot: 0.4 },
      { pos: [-17, -8], scale: 0.95, rot: 1.8 },
      { pos: [-16, 8], scale: 1.25, rot: 3.1 },
      { pos: [-18, 22], scale: 1.05, rot: 0.9 },
      { pos: [-17, 34], scale: 1.3, rot: 2.4 },
      { pos: [16, -22], scale: 1.2, rot: 1.2 },
      { pos: [17, -6], scale: 1.0, rot: 2.7 },
      { pos: [16, 10], scale: 1.35, rot: 0.3 },
      { pos: [18, 24], scale: 0.9, rot: 4.1 },
      { pos: [17, 36], scale: 1.15, rot: 1.5 },
    ],
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Read directly from store state to avoid 60fps React component re-renders!
    const storeState = useAdventureStore.getState();
    const skaterPosition = storeState.skaterPosition;
    const footballPosition = storeState.footballPosition;

    // Rotate and bob the collectible adventure prisms
    starRefs.current.forEach((ref, idx) => {
      if (ref && !starsCollected.includes(idx + 1)) {
        ref.rotation.y = t * 1.8;
        ref.rotation.z = Math.sin(t * 2 + idx) * 0.15;
        ref.position.y = starPositions[idx][1] + Math.sin(t * 2.5 + idx) * 0.12;

        // Check if skater collected this emblem
        const dx = skaterPosition[0] - ref.position.x;
        const dz = skaterPosition[2] - ref.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < 1.6) {
          collectStar(idx + 1);
        }
      }
    });

    // Animate football position and realistic rolling rotation
    if (footballGroupRef.current) {
      footballGroupRef.current.position.set(footballPosition[0], footballPosition[1], footballPosition[2]);
    }
  });

  return (
    <group>
      {/* ── 1. ATMOSPHERIC LIGHTING & SKY ── */}
      <ambientLight intensity={0.55} color="#cbd5e1" />
      <directionalLight
        position={[35, 55, 30]}
        intensity={1.85}
        color="#fffbeb"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={55}
        shadow-camera-bottom={-55}
        shadow-bias={-0.0001}
      />
      <hemisphereLight args={['#93c5fd', '#1e293b', 0.5]} />

      {/* Atmospheric Horizon Fog */}
      <fog attach="fog" args={['#0f172a', 35, 130]} />

      {/* Atmospheric Sky Dome */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[180, 32, 16]} />
        <meshBasicMaterial color="#0c1527" side={THREE.BackSide} />
      </mesh>

      {/* Stylized Sun Glow */}
      <mesh position={[85, 110, 75]}>
        <sphereGeometry args={[8, 16, 16]} />
        <meshBasicMaterial color="#fef08a" />
      </mesh>

      {/* ── 2. PARK TERRAIN (Multi-Layered Ground) ── */}
      {/* Outer Forest Meadow Base */}
      <mesh position={[0, -0.16, 0]} receiveShadow>
        <boxGeometry args={[96, 0.3, 130]} />
        <meshStandardMaterial color="#1a2e22" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* ── 3. MAIN CONCRETE SKATE PLAZA & STREET TRACKS ── */}
      {/* Central Slate Concrete Skating Track */}
      <mesh position={[0, 0.01, 2.0]} receiveShadow>
        <boxGeometry args={[17.0, 0.05, 78]} />
        <meshStandardMaterial color="#334155" roughness={0.55} metalness={0.15} />
      </mesh>

      {/* Concrete Cross Paths */}
      <mesh position={[0, 0.015, -15]} receiveShadow>
        <boxGeometry args={[38, 0.04, 8]} />
        <meshStandardMaterial color="#475569" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.015, 15]} receiveShadow>
        <boxGeometry args={[38, 0.04, 8]} />
        <meshStandardMaterial color="#475569" roughness={0.6} />
      </mesh>

      {/* Perimeter Street Skate Curbing with Metal Coping */}
      {[-8.7, 8.7].map((cx, i) => (
        <group key={i} position={[cx, 0.1, 2.0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.4, 0.2, 78]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} />
          </mesh>
          <mesh position={[i === 0 ? 0.18 : -0.18, 0.1, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 78, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* ── 4. STAINLESS STEEL GRIND RAILS ── */}
      <group position={[-2.5, 0.45, -5]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.045, 12, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.92} roughness={0.18} />
        </mesh>
        {[-5, 0, 5].map((zLeg, i) => (
          <mesh key={i} position={[0, -0.22, zLeg]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.45, 12]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* ── 5. QUARTERPIPE / BANKED RAMP TRANSITIONS ── */}
      <group position={[6.5, 0, -12.5]}>
        <mesh position={[0, 0.72, 0]} rotation={[0.095, 0, 0]} receiveShadow castShadow>
          <boxGeometry args={[4.4, 0.14, 15]} />
          <meshStandardMaterial color="#78350f" roughness={0.65} metalness={0.1} />
        </mesh>
        {[-6, -4, -2, 0, 2, 4, 6].map((zp, i) => (
          <mesh key={i} position={[0, 0.8 + zp * 0.015, zp]} rotation={[0.095, 0, 0]}>
            <boxGeometry args={[4.35, 0.01, 0.04]} />
            <meshBasicMaterial color="#451a03" />
          </mesh>
        ))}
        {[-1.9, 1.9].map((px, i) => (
          <group key={i}>
            <mesh position={[px, 0.4, -4.5]} castShadow>
              <cylinderGeometry args={[0.12, 0.12, 0.8, 8]} />
              <meshStandardMaterial color="#451a03" />
            </mesh>
            <mesh position={[px, 0.75, 0.5]} castShadow>
              <cylinderGeometry args={[0.12, 0.12, 1.5, 8]} />
              <meshStandardMaterial color="#451a03" />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── 6. FROSTED ICY POND ── */}
      <group position={[-6.0, 0.03, -2.0]}>
        <mesh receiveShadow>
          <boxGeometry args={[5.2, 0.03, 16]} />
          <meshStandardMaterial
            color="#e0f2fe"
            roughness={0.06}
            metalness={0.35}
            transparent
            opacity={0.88}
            emissive="#0284c7"
            emissiveIntensity={0.15}
          />
        </mesh>
        <mesh position={[0, -0.02, 0]}>
          <boxGeometry args={[5.1, 0.02, 15.9]} />
          <meshStandardMaterial color="#0369a1" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[5.35, 0.01, 16.2]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      </group>

      {/* ── 7. MISSION 2: FOOTBALL & GREEN SAFE STOPPING ZONE ── */}
      <group position={[0, 0.035, 9.5]}>
        <mesh receiveShadow>
          <boxGeometry args={[16.6, 0.01, 5.0]} />
          <meshStandardMaterial color="#10b981" transparent opacity={0.25} />
        </mesh>
        <mesh position={[0, 0.01, -2.5]}>
          <boxGeometry args={[16.6, 0.015, 0.15]} />
          <meshBasicMaterial color="#34d399" />
        </mesh>
        <mesh position={[0, 0.01, 2.5]}>
          <boxGeometry args={[16.6, 0.015, 0.15]} />
          <meshBasicMaterial color="#34d399" />
        </mesh>
      </group>

      {/* Interactive 3D Football (At Z = 12.5) */}
      <group ref={footballGroupRef} position={[0, 0.35, 12.5]}>
        <mesh ref={footballMeshRef} castShadow receiveShadow>
          <sphereGeometry args={[0.38, 24, 24]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.35} />
        </mesh>
        {[
          [0, 0.35, 0.15],
          [-0.2, 0.12, 0.28],
          [0.2, 0.12, 0.28],
          [-0.2, -0.15, 0.25],
          [0.2, -0.15, 0.25],
        ].map(([px, py, pz], i) => (
          <mesh key={i} position={[px, py, pz]}>
            <circleGeometry args={[0.09, 5]} />
            <meshStandardMaterial color="#0f172a" roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* ── 8. STARTING ARCH & FINISH GATES ── */}
      <group position={[0, 0, -22]}>
        <mesh position={[0, 0.038, 0]}>
          <boxGeometry args={[16.8, 0.015, 0.7]} />
          <meshBasicMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[-8.8, 2.8, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.22, 5.6, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[8.8, 2.8, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.22, 5.6, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 5.2, 0]} castShadow>
          <boxGeometry args={[18.2, 0.8, 0.3]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, 5.2, 0.16]}>
          <boxGeometry args={[17.6, 0.4, 0.02]} />
          <meshBasicMaterial color="#00d2ff" />
        </mesh>
      </group>

      {/* Finish Target Line */}
      <group position={[0, 0, 28]}>
        <mesh position={[0, 0.038, 0]}>
          <boxGeometry args={[16.8, 0.015, 1.0]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.65, 1.2]} castShadow>
          <boxGeometry args={[17.2, 1.3, 0.6]} />
          <meshStandardMaterial color="#dc2626" roughness={0.65} />
        </mesh>
        <mesh position={[0, 0.65, 1.52]}>
          <boxGeometry args={[16.6, 0.25, 0.03]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
      </group>

      {/* ── 9. THREE ADVENTURE PRISMS ── */}
      {starPositions.map((pos, idx) => {
        const isCollected = starsCollected.includes(idx + 1);
        if (isCollected) return null;
        return (
          <group
            key={idx}
            ref={(el) => (starRefs.current[idx] = el)}
            position={[pos[0], pos[1], pos[2]]}
          >
            <mesh castShadow>
              <octahedronGeometry args={[0.48, 0]} />
              <meshStandardMaterial
                color="#00d2ff"
                emissive="#0284c7"
                emissiveIntensity={0.6}
                metalness={0.85}
                roughness={0.15}
              />
            </mesh>
            <mesh scale={[1.2, 1.2, 1.2]}>
              <octahedronGeometry args={[0.48, 0]} />
              <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.4} />
            </mesh>
            <pointLight color="#00d2ff" intensity={1.2} distance={3.5} />
          </group>
        );
      })}

      {/* ── 10. PARK FLORA & HARDSCAPE ── */}
      {treeData.map((tree, i) => (
        <group key={i} position={[tree.pos[0], 0, tree.pos[1]]} scale={[tree.scale, tree.scale, tree.scale]} rotation={[0, tree.rot, 0]}>
          <mesh position={[0, 1.2, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.35, 2.4, 8]} />
            <meshStandardMaterial color="#382414" roughness={0.9} />
          </mesh>
          <mesh position={[0, 3.2, 0]} castShadow>
            <coneGeometry args={[1.8, 2.6, 7]} />
            <meshStandardMaterial color="#14532d" roughness={0.75} />
          </mesh>
          <mesh position={[0, 4.6, 0]} castShadow>
            <coneGeometry args={[1.4, 2.2, 7]} />
            <meshStandardMaterial color="#166534" roughness={0.75} />
          </mesh>
          <mesh position={[0, 5.8, 0]} castShadow>
            <coneGeometry args={[0.9, 1.8, 7]} />
            <meshStandardMaterial color="#15803d" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Street Lamps */}
      {[
        [-9.5, -12], [-9.5, 12],
        [9.5, -12], [9.5, 12],
      ].map(([lx, lz], i) => (
        <group key={i} position={[lx, 0, lz]}>
          <mesh position={[0, 2.4, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 4.8, 8]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
          <mesh position={[lx > 0 ? -0.4 : 0.4, 4.7, 0]}>
            <boxGeometry args={[0.8, 0.06, 0.06]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[lx > 0 ? -0.8 : 0.8, 4.6, 0]}>
            <sphereGeometry args={[0.16, 12, 12]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
          <pointLight position={[lx > 0 ? -0.8 : 0.8, 4.5, 0]} color="#fef08a" intensity={0.8} distance={8} />
        </group>
      ))}

      {/* Benches */}
      {[-10.2, 10.2].map((bx, i) => (
        <group key={i} position={[bx, 0.35, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 0.35, 2.6]} />
            <meshStandardMaterial color="#451a03" roughness={0.65} />
          </mesh>
          {[-1.0, 1.0].map((lz, j) => (
            <mesh key={j} position={[0, -0.15, lz]}>
              <boxGeometry args={[1.22, 0.35, 0.08]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
