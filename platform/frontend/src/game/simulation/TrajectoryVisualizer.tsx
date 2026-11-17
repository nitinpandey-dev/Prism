import { useMemo } from 'react';
import * as THREE from 'three';
import { usePhysicsStore } from '../../stores/usePhysicsStore';

export default function TrajectoryVisualizer() {
  const { trajectory, isFiring } = usePhysicsStore();
  const { points, metrics } = trajectory;

  // Build continuous 3D line geometry from calculated trajectory points
  const lineGeometry = useMemo(() => {
    if (!points || points.length < 2) return null;
    const pathPoints = points.map((p) => new THREE.Vector3(p.x, p.y, p.z));
    return new THREE.BufferGeometry().setFromPoints(pathPoints);
  }, [points]);

  // Apex (highest point) coordinates
  const apexPoint = useMemo(() => {
    if (!points || points.length === 0) return null;
    let highest = points[0];
    for (const p of points) {
      if (p.y > highest.y) highest = p;
    }
    return highest;
  }, [points]);

  const lastPoint = points && points.length > 0 ? points[points.length - 1] : null;

  // Trajectory color feedback
  const lineColor = metrics.isBullseye
    ? '#10b981' // Green
    : metrics.isHit
    ? '#06b6d4' // Cyan
    : '#f59e0b'; // Amber

  return (
    <group>
      {/* ── 1. The Trajectory Curve ── */}
      {lineGeometry && (
        <primitive object={new THREE.Line(
          lineGeometry,
          new THREE.LineBasicMaterial({
            color: lineColor,
            linewidth: 2,
            transparent: true,
            opacity: isFiring ? 0.4 : 0.85,
          })
        )} />
      )}

      {/* ── 2. Apex Marker (H_max) ── */}
      {apexPoint && !isFiring && (
        <group position={[apexPoint.x, apexPoint.y, apexPoint.z]}>
          <mesh>
            <sphereGeometry args={[0.3, 12, 12]} />
            <meshBasicMaterial color="#a855f7" />
          </mesh>
          <pointLight color="#c084fc" intensity={1.2} distance={4} />
        </group>
      )}

      {/* ── 3. Predicted Landing Ground Ring ── */}
      {lastPoint && !isFiring && (
        <group position={[lastPoint.x, lastPoint.y + 0.1, lastPoint.z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.8, 1.2, 24]} />
            <meshBasicMaterial color={lineColor} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}
    </group>
  );
}

