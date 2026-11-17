import { useMemo } from 'react';
import * as THREE from 'three';
import { useSkatingStore, TRACK_START_Z, BRAKE_LINE_Z, TARGET_ZONE_START_Z, TARGET_ZONE_END_Z, TRACK_END_Z } from '../stores/useSkatingStore';
import { SURFACES, SurfaceType } from '../types/skating';

export default function SkatingEnvironment() {
  const { selectedSurface, brakingDistance, experimentState } = useSkatingStore();

  // Meter distance markers from 0 to 30m
  const distanceMarkers = useMemo(() => {
    const list = [];
    for (let d = 2; d <= 28; d += 2) {
      list.push(d);
    }
    return list;
  }, []);

  return (
    <group>
      {/* ── 1. SUNNY DAYLIGHT & SKY ── */}
      <ambientLight intensity={0.65} color="#e0f2fe" />
      <directionalLight
        position={[25, 45, 20]}
        intensity={1.9}
        color="#fffbeb"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />
      <hemisphereLight args={['#bae6fd', '#4ade80', 0.6]} />

      {/* Blue Sky Dome */}
      <mesh position={[0, -10, 0]}>
        <sphereGeometry args={[180, 32, 16]} />
        <meshBasicMaterial color="#38bdf8" side={THREE.BackSide} />
      </mesh>

      {/* Stylized Sun */}
      <mesh position={[70, 90, 60]}>
        <sphereGeometry args={[10, 16, 16]} />
        <meshBasicMaterial color="#fde047" />
      </mesh>

      {/* ── 2. GENERAL PARK LAWN (Green grass plateau) ── */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[70, 0.3, 100]} />
        <meshStandardMaterial color="#22c55e" roughness={0.8} />
      </mesh>

      {/* ── 3. THREE SKATING LANES (Slippery, Normal, Rough) ── */}
      {/* Lane 1: SLIPPERY (X = -6) */}
      <mesh position={[-6.0, 0.01, 5.0]} receiveShadow>
        <boxGeometry args={[4.8, 0.05, 75]} />
        <meshStandardMaterial
          color="#38bdf8"
          roughness={0.08}
          metalness={0.6}
          emissive="#0284c7"
          emissiveIntensity={selectedSurface === 'slippery' ? 0.25 : 0.05}
        />
      </mesh>

      {/* Lane 2: NORMAL CONCRETE (X = 0) */}
      <mesh position={[0, 0.01, 5.0]} receiveShadow>
        <boxGeometry args={[4.8, 0.05, 75]} />
        <meshStandardMaterial
          color="#94a3b8"
          roughness={0.5}
          metalness={0.2}
          emissive="#64748b"
          emissiveIntensity={selectedSurface === 'normal' ? 0.25 : 0.05}
        />
      </mesh>

      {/* Lane 3: ROUGH TARTAN (X = +6) */}
      <mesh position={[6.0, 0.01, 5.0]} receiveShadow>
        <boxGeometry args={[4.8, 0.05, 75]} />
        <meshStandardMaterial
          color="#ea580c"
          roughness={0.9}
          metalness={0.05}
          emissive="#c2410c"
          emissiveIntensity={selectedSurface === 'rough' ? 0.25 : 0.05}
        />
      </mesh>

      {/* Lane Divider Stripes */}
      {[-3.3, 3.3].map((dx, i) => (
        <mesh key={i} position={[dx, 0.04, 5.0]}>
          <boxGeometry args={[0.2, 0.02, 74]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* ── 4. STARTING LINE (Z = -25) & OVERHEAD ARCH ── */}
      <group position={[0, 0, TRACK_START_Z]}>
        {/* White Starting Line Strip */}
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[17.0, 0.02, 0.8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Start Arch Pillars */}
        <mesh position={[-9.5, 3.0, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.3, 6.0, 16]} />
          <meshStandardMaterial color="#3b82f6" metalness={0.6} />
        </mesh>
        <mesh position={[9.5, 3.0, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.3, 6.0, 16]} />
          <meshStandardMaterial color="#3b82f6" metalness={0.6} />
        </mesh>

        {/* Start Overhead Banner */}
        <mesh position={[0, 5.4, 0]} castShadow>
          <boxGeometry args={[19.2, 1.4, 0.3]} />
          <meshStandardMaterial color="#1d4ed8" />
        </mesh>
        {/* Banner Trim */}
        <mesh position={[0, 5.4, 0.17]}>
          <boxGeometry args={[18.6, 1.0, 0.04]} />
          <meshBasicMaterial color="#facc15" />
        </mesh>
      </group>

      {/* ── 5. BRAKING LINE (Z = 0) (Checkered Line) ── */}
      <group position={[0, 0.04, BRAKE_LINE_Z]}>
        <mesh>
          <boxGeometry args={[17.0, 0.02, 1.0]} />
          <meshStandardMaterial color="#ef4444" roughness={0.3} />
        </mesh>
        {/* Checkered pattern markers */}
        {[-8, -6, -4, -2, 0, 2, 4, 6, 8].map((cx, i) => (
          <mesh key={i} position={[cx, 0.01, 0]}>
            <boxGeometry args={[0.8, 0.02, 1.0]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>

      {/* ── 6. DISTANCE METER MARKERS ALONG THE TRACK (Every 2m) ── */}
      {distanceMarkers.map((dist) => (
        <group key={dist} position={[0, 0.04, BRAKE_LINE_Z + dist]}>
          {/* Meter Line across all lanes */}
          <mesh>
            <boxGeometry args={[17.0, 0.01, 0.15]} />
            <meshBasicMaterial color="#cbd5e1" />
          </mesh>
          {/* Left Side Distance Board */}
          <mesh position={[-9.2, 0.5, 0]}>
            <boxGeometry args={[0.1, 0.8, 0.8]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          {/* Right Side Distance Board */}
          <mesh position={[9.2, 0.5, 0]}>
            <boxGeometry args={[0.1, 0.8, 0.8]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>
      ))}

      {/* ── 7. TARGET STOPPING ZONE (10m to 14m) ── */}
      <group position={[0, 0.03, (TARGET_ZONE_START_Z + TARGET_ZONE_END_Z) / 2]}>
        <mesh>
          <boxGeometry args={[17.0, 0.02, TARGET_ZONE_END_Z - TARGET_ZONE_START_Z]} />
          <meshStandardMaterial color="#10b981" transparent opacity={0.3} />
        </mesh>
        {/* Target Zone Boundary Borders */}
        <mesh position={[0, 0.02, -(TARGET_ZONE_END_Z - TARGET_ZONE_START_Z) / 2]}>
          <boxGeometry args={[17.0, 0.02, 0.2]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
        <mesh position={[0, 0.02, (TARGET_ZONE_END_Z - TARGET_ZONE_START_Z) / 2]}>
          <boxGeometry args={[17.0, 0.02, 0.2]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
      </group>

      {/* ── 8. FINISH LINE & SAFETY BARRIER (Z = 32m) ── */}
      <group position={[0, 0, TRACK_END_Z]}>
        {/* Finish Checker */}
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[17.0, 0.02, 1.2]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
        {/* Safety Padding Barrier Cushions */}
        <mesh position={[0, 0.75, 1.2]} castShadow>
          <boxGeometry args={[17.4, 1.5, 0.8]} />
          <meshStandardMaterial color="#dc2626" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.75, 1.62]}>
          <boxGeometry args={[16.8, 0.4, 0.05]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
      </group>

      {/* ── 9. DYNAMIC STOPPING DISTANCE TAPE (Visible when braking/finished) ── */}
      {brakingDistance > 0.1 && (
        <group position={[SURFACES[selectedSurface].laneX, 0.06, BRAKE_LINE_Z + brakingDistance / 2]}>
          <mesh>
            <boxGeometry args={[0.4, 0.02, brakingDistance]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={0.6}
            />
          </mesh>
          {/* Final Stop Marker Ring */}
          <mesh position={[0, 0.02, brakingDistance / 2]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.5, 0.9, 24]} />
            <meshBasicMaterial color="#ef4444" side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* ── 10. PARK SCENERY (Trees, Benches, Lights) ── */}
      {/* Track Wooden Side Guard Rails */}
      {[-9.0, 9.0].map((rx, i) => (
        <group key={i} position={[rx, 0.6, 5.0]}>
          <mesh castShadow>
            <boxGeometry args={[0.2, 0.8, 70]} />
            <meshStandardMaterial color="#78350f" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Low-Poly Park Trees */}
      {[
        [-16, -15], [-18, 0], [-17, 18], [-20, 32],
        [16, -18], [19, -2], [17, 16], [21, 30]
      ].map(([tx, tz], i) => (
        <group key={i} position={[tx, 0, tz]}>
          {/* Trunk */}
          <mesh position={[0, 1.5, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.45, 3.0, 8]} />
            <meshStandardMaterial color="#713f12" />
          </mesh>
          {/* Foliage Cones */}
          <mesh position={[0, 4.0, 0]} castShadow>
            <coneGeometry args={[2.2, 3.5, 8]} />
            <meshStandardMaterial color="#15803d" roughness={0.7} />
          </mesh>
          <mesh position={[0, 5.8, 0]} castShadow>
            <coneGeometry args={[1.7, 2.8, 8]} />
            <meshStandardMaterial color="#16a34a" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Park Benches */}
      {[-12.5, 12.5].map((bx, i) => (
        <group key={i} position={[bx, 0.4, 6]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 0.4, 2.6]} />
            <meshStandardMaterial color="#92400e" roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
