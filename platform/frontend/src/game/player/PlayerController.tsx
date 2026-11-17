import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useGameStore } from '../../stores/useGameStore';
import { useMissionStore } from '../../stores/useMissionStore';

export default function PlayerController() {
  const { camera } = useThree();
  const {
    player,
    isConsoleOpen,
    cameraView,
    updatePlayerPosition,
    setNearInteractable,
    openConsole,
  } = useGameStore();

  const completeObjective = useMissionStore((s) => s.completeObjective);

  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);

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
        accel * delta
      );
      velocity.current.z = THREE.MathUtils.lerp(
        velocity.current.z,
        inputDir.z * moveSpeed,
        accel * delta
      );

      // Rotate character to face movement direction smoothly (shortest angular distance)
      const targetAngle = Math.atan2(inputDir.x, inputDir.z);
      let diff = targetAngle - currentRotation.current;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      currentRotation.current += diff * Math.min(1, 14 * delta);
    } else {
      // Deceleration damping
      velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, 0, 15 * delta);
      velocity.current.z = THREE.MathUtils.lerp(velocity.current.z, 0, 15 * delta);
    }

    // Update position
    const currentPos = groupRef.current.position;
    const nextX = currentPos.x + velocity.current.x * delta;
    const nextZ = currentPos.z + velocity.current.z * delta;

    // Clamp inside Outpost boundary
    const clampedX = Math.max(-28, Math.min(28, nextX));
    const clampedZ = Math.max(-24, Math.min(20, nextZ));

    currentPos.x = clampedX;
    currentPos.z = clampedZ;
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

    // Sync to global store
    updatePlayerPosition([clampedX, 0.9, clampedZ], currentRotation.current, isMoving);

    // Proximity detection for Launcher Console at [0, 0.8, 8.2]
    const distToConsole = Math.sqrt(
      Math.pow(clampedX - 0, 2) + Math.pow(clampedZ - 8.2, 2)
    );

    if (distToConsole < 3.2) {
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
  });

  return (
    <group ref={groupRef} position={[player.position[0], player.position[1], player.position[2]]}>
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

