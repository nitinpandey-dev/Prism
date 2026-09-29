import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Line, Text } from "@react-three/drei";
import * as THREE from "three";

// Color scheme per atom role
const ROLE_COLORS = {
  corner: "#818cf8",       // indigo
  body_center: "#22d3ee",  // cyan
  face_center: "#a78bfa",  // violet
};

function Atom({ position, role, radius }) {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.emissiveIntensity =
        0.3 + 0.15 * Math.sin(state.clock.elapsedTime * 1.5);
    }
  });

  const color = ROLE_COLORS[role] || "#ffffff";
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[radius * 0.9, 24, 24]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        metalness={0.4}
        roughness={0.3}
      />
    </mesh>
  );
}

function UnitCellEdges({ latticeConstant, supercell }) {
  const a = latticeConstant;
  const n = supercell;
  const lines = useMemo(() => {
    const result = [];
    for (let ix = 0; ix < n; ix++) {
      for (let iy = 0; iy < n; iy++) {
        for (let iz = 0; iz < n; iz++) {
          const ox = ix * a, oy = iy * a, oz = iz * a;
          const pts = [
            [[ox,oy,oz],[ox+a,oy,oz]], [[ox,oy+a,oz],[ox+a,oy+a,oz]],
            [[ox,oy,oz+a],[ox+a,oy,oz+a]], [[ox,oy+a,oz+a],[ox+a,oy+a,oz+a]],
            [[ox,oy,oz],[ox,oy+a,oz]], [[ox+a,oy,oz],[ox+a,oy+a,oz]],
            [[ox,oy,oz+a],[ox,oy+a,oz+a]], [[ox+a,oy,oz+a],[ox+a,oy+a,oz+a]],
            [[ox,oy,oz],[ox,oy,oz+a]], [[ox+a,oy,oz],[ox+a,oy,oz+a]],
            [[ox,oy+a,oz],[ox,oy+a,oz+a]], [[ox+a,oy+a,oz],[ox+a,oy+a,oz+a]],
          ];
          result.push(...pts);
        }
      }
    }
    return result;
  }, [a, n]);

  return (
    <>
      {lines.map(([start, end], i) => (
        <Line
          key={i}
          points={[start, end]}
          color="#3730a3"
          lineWidth={1}
          opacity={0.5}
          transparent
        />
      ))}
    </>
  );
}

export default function CrystalScene({ atoms, structure, atomRadius, latticeConstant, supercell }) {
  const center = ((supercell * latticeConstant) / 2);

  return (
    <Canvas
      camera={{ position: [center + 8, center + 6, center + 8], fov: 50 }}
      style={{ background: "transparent", borderRadius: "var(--radius-md)" }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
      <pointLight position={[-5, -5, -5]} color="#6366f1" intensity={0.8} />
      <pointLight position={[5, 5, 5]} color="#06b6d4" intensity={0.5} />

      <UnitCellEdges latticeConstant={latticeConstant} supercell={supercell} />

      {atoms.map((atom, i) => (
        <Atom
          key={i}
          position={[atom.x, atom.y, atom.z]}
          role={atom.role}
          radius={atomRadius}
        />
      ))}

      {/* Legend labels */}
      <Text
        position={[center, supercell * latticeConstant + 1.5, 0]}
        fontSize={0.4}
        color="#94a3b8"
        anchorX="center"
      >
        {structure} — {supercell}×{supercell}×{supercell} Supercell
      </Text>

      <OrbitControls
        target={[center, center, center]}
        enableDamping
        dampingFactor={0.08}
        minDistance={3}
        maxDistance={40}
      />
    </Canvas>
  );
}
