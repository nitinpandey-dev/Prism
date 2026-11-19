import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useGameStore } from '../../stores/useGameStore';
import { useMissionStore } from '../../stores/useMissionStore';

// Resolve circle against an AABB box obstacle (smooth sliding collision)
function resolveCircleAABB(
  px: number,
  pz: number,
  r: number,
  minX: number,
  maxX: number,
  minZ: number,
  maxZ: number
): [number, number] {
  const closestX = Math.max(minX, Math.min(maxX, px));
  const closestZ = Math.max(minZ, Math.min(maxZ, pz));
  const dx = px - closestX;
  const dz = pz - closestZ;
  const distSq = dx * dx + dz * dz;

  if (distSq < r * r && distSq > 0.000001) {
    const dist = Math.sqrt(distSq);
    const overlap = r - dist;
    return [px + (dx / dist) * overlap, pz + (dz / dist) * overlap];
  } else if (distSq <= 0.000001) {
    const dLeft = px - minX;
    const dRight = maxX - px;
    const dBack = pz - minZ;
    const dFront = maxZ - pz;
    const minD = Math.min(dLeft, dRight, dBack, dFront);
    if (minD === dLeft) return [minX - r, pz];
    if (minD === dRight) return [maxX + r, pz];
    if (minD === dBack) return [px, minZ - r];
    return [px, maxZ + r];
  }
  return [px, pz];
}

// Resolve circle against a cylindrical obstacle
function resolveCircleCylinder(
  px: number,
  pz: number,
  r: number,
  cx: number,
  cz: number,
  cylinderRadius: number
): [number, number] {
  const dx = px - cx;
  const dz = pz - cz;
  const dist = Math.sqrt(dx * dx + dz * dz);
  const minDist = r + cylinderRadius;
  if (dist < minDist && dist > 0.0001) {
    const push = (minDist - dist) / dist;
    return [px + dx * push, pz + dz * push];
  }
  return [px, pz];
}

export default function PlayerController() {
  const { camera } = useThree();
  const isConsoleOpen = useGameStore((s) => s.isConsoleOpen);
  const cameraView = useGameStore((s) => s.cameraView);
  const updatePlayerPosition = useGameStore((s) => s.updatePlayerPosition);
  const setNearInteractable = useGameStore((s) => s.setNearInteractable);

  const completeObjective = useMissionStore((s) => s.completeObjective);

  const initialPos = useRef(useGameStore.getState().player.position);
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const wasNearRef = useRef(false);
  const lastStoreSync = useRef(0);

  // Key state map
  const keys = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;

      // Handle interaction key [E]
      if ((e.code === 'KeyE' || e.code === 'Enter') && !isConsoleOpen) {
        const state = useGameStore.getState();
        if (state.activeInteractable) {
          state.openConsole(state.activeInteractable);
          completeObjective('obj-explore');
        }
      }

      // Close console on Escape
      if (e.code === 'Escape' && isConsoleOpen) {
        useGameStore.getState().closeConsole();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [isConsoleOpen, completeObjective]);

  // Player physics variables
  const velocity = useRef(new THREE.Vector3());
  const currentRotation = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Freeze player motion if terminal console is open or firing
    if (isConsoleOpen || cameraView !== 'third_person') {
      return;
    }

    const dt = Math.min(delta, 0.05);
    const moveSpeed = keys.current['ShiftLeft'] || keys.current['ShiftRight'] ? 8.5 : 5.0;
    const accel = 25.0;

    // Get camera horizontal forward direction
    const camForward = new THREE.Vector3();
    camera.getWorldDirection(camForward);
    camForward.y = 0;
    if (camForward.lengthSq() < 0.001) {
      camForward.set(0, 0, 1);
    } else {
      camForward.normalize();
    }

    // Camera horizontal right vector: camForward x Up(0, 1, 0)
    // In Three.js: (0, 0, 1) x (0, 1, 0) = (-1, 0, 0), which points to camera's RIGHT
    const camRight = new THREE.Vector3().crossVectors(camForward, new THREE.Vector3(0, 1, 0)).normalize();

    // Direction vector relative to camera viewpoint
    const inputDir = new THREE.Vector3();
    if (keys.current['KeyW'] || keys.current['ArrowUp']) inputDir.add(camForward);
    if (keys.current['KeyS'] || keys.current['ArrowDown']) inputDir.sub(camForward);
    if (keys.current['KeyD'] || keys.current['ArrowRight']) inputDir.add(camRight); // Move Right
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) inputDir.sub(camRight);  // Move Left

    const isMoving = inputDir.lengthSq() > 0.01;

    if (isMoving) {
      inputDir.normalize();
      velocity.current.x = THREE.MathUtils.lerp(
        velocity.current.x,
        inputDir.x * moveSpeed,
        accel * dt
      );
      velocity.current.z = THREE.MathUtils.lerp(
        velocity.current.z,
        inputDir.z * moveSpeed,
        accel * dt
      );

      // Rotate character to face movement direction smoothly (shortest angular distance)
      const targetAngle = Math.atan2(inputDir.x, inputDir.z);
      let diff = targetAngle - currentRotation.current;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      currentRotation.current += diff * Math.min(1, 14 * dt);
    } else {
      // Deceleration damping
      velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, 0, 15 * dt);
      velocity.current.z = THREE.MathUtils.lerp(velocity.current.z, 0, 15 * dt);
    }

    // Update position with continuous obstacle collisions
    const currentPos = groupRef.current.position;
    let nextX = currentPos.x + velocity.current.x * dt;
    let nextZ = currentPos.z + velocity.current.z * dt;
    const playerRadius = 0.55;

    // 1. Boundary clamp (outer deck perimeter)
    nextX = Math.max(-27.5, Math.min(27.5, nextX));
    nextZ = Math.max(-23.5, Math.min(19.2, nextZ));

    // 2. Obstacle Collisions:
    // A. Launcher Console Deck: at [0, 0.8, 8.2], box ~1.8m x 0.8m
    [nextX, nextZ] = resolveCircleAABB(nextX, nextZ, playerRadius, -1.05, 1.05, 7.65, 8.75);

    // B. Launcher Mortar Turret & Pedestal: at [0, 0.8, 12.0], cylinder radius 2.5m
    [nextX, nextZ] = resolveCircleCylinder(nextX, nextZ, playerRadius, 0, 12.0, 2.5);

    // C. Damaged Comms Tower: at [-20, 0, 2.0], cylinder radius 2.2m
    [nextX, nextZ] = resolveCircleCylinder(nextX, nextZ, playerRadius, -20.0, 2.0, 2.2);

    // D. Solar Array Panels: at [22, 0, -8], AABB covering the 3 panels
    [nextX, nextZ] = resolveCircleAABB(nextX, nextZ, playerRadius, 19.5, 24.5, -16.5, 0.5);

    // E. Habitation Dome: at [0, 0, -26], radius 10m with airlock corridor [-2.2, 2.2]
    if (nextZ < -16.5) {
      if (Math.abs(nextX) > 2.2) {
        nextZ = -16.5; // Blocked by dome front walls
      } else if (nextZ < -23.0) {
        nextZ = -23.0; // Blocked by airlock back door
      }
    }

    currentPos.x = nextX;
    currentPos.z = nextZ;
    currentPos.y = 0.9; // Deck height

    groupRef.current.rotation.y = currentRotation.current;

    // Animated leg swing while walking
    if (leftLegRef.current && rightLegRef.current) {
      if (isMoving) {
        const t = state.clock.elapsedTime * (moveSpeed > 6 ? 14 : 9);
        leftLegRef.current.rotation.x = Math.sin(t) * 0.45;
        rightLegRef.current.rotation.x = -Math.sin(t) * 0.45;
      } else {
        leftLegRef.current.rotation.x = 0;
        rightLegRef.current.rotation.x = 0;
      }
    }

    // Throttled sync to global store (~20Hz) to prevent micro-stutter
    const now = state.clock.elapsedTime;
    if (now - lastStoreSync.current >= 0.05) {
      lastStoreSync.current = now;
      updatePlayerPosition([nextX, 0.9, nextZ], currentRotation.current, isMoving);
    }

    // Proximity detection for Launcher Console at [0, 0.8, 8.2]
    const distToConsole = Math.sqrt(
      Math.pow(nextX - 0, 2) + Math.pow(nextZ - 8.2, 2)
    );

    const isNear = distToConsole < 3.2;
    if (isNear !== wasNearRef.current) {
      wasNearRef.current = isNear;
      if (isNear) {
        setNearInteractable({
          id: 'launcher_console',
          name: 'Pneumatic Launcher Terminal',
          prompt: 'Press [E] to Calibrate & Launch',
          position: [0, 0.8, 8.2],
          interactionDistance: 3.2,
        });
      } else {
        setNearInteractable(null);
      }
    }
  });

  return (
    <group ref={groupRef} position={[initialPos.current[0], initialPos.current[1], initialPos.current[2]]}>
      {/* ── SCI-FI ASTRONAUT AVATAR ── */}
      {/* Torso & Suit */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.5, 8, 16]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Backpack / Life Support Unit */}
      <mesh position={[0, 0.95, -0.25]} castShadow>
        <boxGeometry args={[0.38, 0.48, 0.22]} />
        <meshStandardMaterial color="#475569" metalness={0.7} />
      </mesh>
      {/* Jetpack Thruster Nozzles */}
      <mesh position={[-0.12, 0.65, -0.25]}>
        <cylinderGeometry args={[0.06, 0.08, 0.15]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.12, 0.65, -0.25]}>
        <cylinderGeometry args={[0.06, 0.08, 0.15]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Helmet */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <sphereGeometry args={[0.26, 24, 24]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.6} />
      </mesh>
      {/* Glowing Cyan Visor */}
      <mesh position={[0, 1.45, 0.16]}>
        <sphereGeometry args={[0.17, 16, 16, 0, Math.PI, 0, Math.PI * 0.5]} rotation={[0.4, 0, 0]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.8}
          roughness={0.1}
        />
      </mesh>

      {/* Left Leg */}
      <mesh ref={leftLegRef} position={[-0.16, 0.35, 0]} castShadow>
        <capsuleGeometry args={[0.1, 0.45, 4, 8]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>

      {/* Right Leg */}
      <mesh ref={rightLegRef} position={[0.16, 0.35, 0]} castShadow>
        <capsuleGeometry args={[0.1, 0.45, 4, 8]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>

      {/* Shadow Blob / Ground Ring */}
      <mesh position={[0, -0.85, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.45, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

