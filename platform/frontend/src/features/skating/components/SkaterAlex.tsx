import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useSkatingStore } from '../stores/useSkatingStore';
import { useGameStore } from '../../../stores/useGameStore';

export default function SkaterAlex() {
  const { camera } = useThree();
  const experimentState = useSkatingStore((s) => s.experimentState);
  const isConsoleOpen = useGameStore((s) => s.isConsoleOpen);

  const initialPos = useRef(useSkatingStore.getState().skaterPosition);
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const brakeSparksRef = useRef<THREE.PointLight>(null);

  // Keyboard input states for free-roam
  const keys = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;

      // Space key triggers brake during experiment or free roam
      if (e.code === 'Space') {
        const state = useSkatingStore.getState();
        if (state.experimentState === 'approaching') {
          state.triggerBrake();
        }
      }

      // Enter key starts experiment if idle
      if (e.code === 'KeyE' || e.code === 'Enter') {
        const state = useSkatingStore.getState();
        if (state.experimentState === 'idle') {
          state.startExperiment();
        }
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
  }, []);

  const velocity = useRef(new THREE.Vector3());
  const currentRotation = useRef(useSkatingStore.getState().skaterRotation);
  const lastSyncTime = useRef(0);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const storeState = useSkatingStore.getState();
    const skaterPosition = storeState.skaterPosition;
    const skaterRotation = storeState.skaterRotation;

    // ── 1. EXPERIMENT DRIVEN MOVEMENT ──
    if (experimentState === 'approaching' || experimentState === 'braking') {
      storeState.tickExperiment(dt);

      if (groupRef.current) {
        groupRef.current.position.set(skaterPosition[0], skaterPosition[1] + 0.85, skaterPosition[2]);
        groupRef.current.rotation.y = skaterRotation;
      }
    } else if (experimentState === 'finished') {
      if (groupRef.current) {
        groupRef.current.position.set(skaterPosition[0], skaterPosition[1] + 0.85, skaterPosition[2]);
      }
    } else {
      // ── 2. FREE-ROAM SKATING MOVEMENT IN THE PARK (when experimentState === 'idle') ──
      if (groupRef.current && !isConsoleOpen) {
        const isSprinting = keys.current['ShiftLeft'] || keys.current['ShiftRight'];
        const isBraking = keys.current['Space'];
        const moveSpeed = isBraking ? 1.5 : isSprinting ? 9.0 : 5.5;
        const accel = 18.0;

        const camForward = new THREE.Vector3();
        camera.getWorldDirection(camForward);
        camForward.y = 0;
        if (camForward.lengthSq() < 0.001) camForward.set(0, 0, 1);
        else camForward.normalize();

        const camRight = new THREE.Vector3().crossVectors(camForward, new THREE.Vector3(0, 1, 0)).normalize();

        const inputDir = new THREE.Vector3();
        if (keys.current['KeyW'] || keys.current['ArrowUp']) inputDir.add(camForward);
        if (keys.current['KeyS'] || keys.current['ArrowDown']) inputDir.sub(camForward);
        if (keys.current['KeyD'] || keys.current['ArrowRight']) inputDir.add(camRight);
        if (keys.current['KeyA'] || keys.current['ArrowLeft']) inputDir.sub(camRight);

        const isMoving = inputDir.lengthSq() > 0.01;

        if (isMoving) {
          inputDir.normalize();
          velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, inputDir.x * moveSpeed, accel * dt);
          velocity.current.z = THREE.MathUtils.lerp(velocity.current.z, inputDir.z * moveSpeed, accel * dt);

          const targetAngle = Math.atan2(inputDir.x, inputDir.z);
          let diff = targetAngle - currentRotation.current;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          currentRotation.current += diff * Math.min(1, 12 * dt);
        } else {
          velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, 0, 12 * dt);
          velocity.current.z = THREE.MathUtils.lerp(velocity.current.z, 0, 12 * dt);
        }

        const currentPos = groupRef.current.position;
        const nextX = Math.max(-14, Math.min(14, currentPos.x + velocity.current.x * dt));
        const nextZ = Math.max(-35, Math.min(42, currentPos.z + velocity.current.z * dt));

        currentPos.x = nextX;
        currentPos.z = nextZ;
        currentPos.y = 0.85;

        groupRef.current.rotation.y = currentRotation.current;

        // Throttled sync to store (~20Hz)
        if (t - lastSyncTime.current > 0.05) {
          lastSyncTime.current = t;
          const currentAnim = isBraking ? 'braking' : isMoving ? (isSprinting ? 'sprinting' : 'skating') : 'idle';
          storeState.updateSkaterFreeRoam([nextX, 0, nextZ], currentRotation.current, currentAnim);
        }
      }
    }

    // ── 3. PROCEDURAL SKATING & BRAKING ANIMATIONS ──
    const anim = skaterAnimState;

    if (anim === 'skating' || anim === 'sprinting') {
      const freq = anim === 'sprinting' ? 12.0 : 8.0;
      const stride = Math.sin(t * freq);

      // Alternating diagonal roller skate push (left/right push-offs)
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.max(-0.6, Math.min(0.6, stride * 0.7));
        leftLegRef.current.rotation.z = Math.max(0, stride * 0.25); // Push outwards
        rightLegRef.current.rotation.x = Math.max(-0.6, Math.min(0.6, -stride * 0.7));
        rightLegRef.current.rotation.z = Math.min(0, -stride * 0.25);
      }

      // Arm swing in counter-balance
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = -stride * 0.6;
        rightArmRef.current.rotation.x = stride * 0.6;
      }

      // Forward athletic lean
      if (torsoRef.current) {
        torsoRef.current.rotation.x = anim === 'sprinting' ? 0.35 : 0.2;
        torsoRef.current.rotation.z = stride * 0.05; // Subtle body weight roll
      }

      if (brakeSparksRef.current) brakeSparksRef.current.intensity = 0;
    } else if (anim === 'braking') {
      // T-stop / Toe brake posture: Lower center of gravity, right foot dragged behind at angle
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = 0.3; // Front supporting bent knee
        leftLegRef.current.rotation.z = 0;
        rightLegRef.current.rotation.x = -0.5; // Dragging rear skate
        rightLegRef.current.rotation.y = 0.6;  // Perpendicular T-stop angle
        rightLegRef.current.rotation.z = -0.15;
      }

      // Arms out for balance
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.z = 0.6;
        rightArmRef.current.rotation.z = -0.6;
      }

      if (torsoRef.current) torsoRef.current.rotation.x = 0.15;

      // Friction sparking effect under dragging skate
      if (brakeSparksRef.current) {
        brakeSparksRef.current.intensity = 1.8 + Math.sin(t * 30) * 0.8;
      }
    } else if (anim === 'stopped') {
      // Upright stance, relaxed arms
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.set(0, 0, 0);
        rightLegRef.current.rotation.set(0, 0, 0);
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.set(0, 0, 0.15);
        rightArmRef.current.rotation.set(0, 0, -0.15);
      }
      if (torsoRef.current) torsoRef.current.rotation.set(0, 0, 0);
      if (brakeSparksRef.current) brakeSparksRef.current.intensity = 0;
    } else {
      // Idle: Gentle breathing sway
      const sway = Math.sin(t * 2.0) * 0.04;
      if (torsoRef.current) torsoRef.current.rotation.z = sway;
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.set(0, 0, 0);
        rightLegRef.current.rotation.set(0, 0, 0);
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.set(0, 0, 0.1);
        rightArmRef.current.rotation.set(0, 0, -0.1);
      }
      if (brakeSparksRef.current) brakeSparksRef.current.intensity = 0;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.85, 0]}>
      {/* ── SKATER ALEX: 3D CHARACTER MODEL ── */}
      <group ref={torsoRef}>
        {/* Torso & Athletic Sports Jacket */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <capsuleGeometry args={[0.26, 0.42, 6, 12]} />
          <meshStandardMaterial color="#2563eb" roughness={0.4} metalness={0.1} />
        </mesh>

        {/* Jacket Zipper & Sport Stripes */}
        <mesh position={[0, 0.36, 0.22]}>
          <planeGeometry args={[0.06, 0.38]} />
          <meshBasicMaterial color="#facc15" />
        </mesh>

        {/* Head */}
        <mesh position={[0, 0.82, 0]} castShadow>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.6} />
        </mesh>

        {/* Skating Helmet */}
        <mesh position={[0, 0.88, 0]} castShadow>
          <sphereGeometry args={[0.21, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <meshStandardMaterial color="#ef4444" roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Helmet Visor Lip */}
        <mesh position={[0, 0.86, 0.14]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.22, 0.04, 0.1]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>

        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.32, 0.48, 0]}>
          <mesh position={[0, -0.22, 0]} castShadow>
            <capsuleGeometry args={[0.08, 0.32, 4, 8]} />
            <meshStandardMaterial color="#3b82f6" />
          </mesh>
          {/* Elbow Guard */}
          <mesh position={[0, -0.2, 0.04]}>
            <boxGeometry args={[0.14, 0.1, 0.08]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.32, 0.48, 0]}>
          <mesh position={[0, -0.22, 0]} castShadow>
            <capsuleGeometry args={[0.08, 0.32, 4, 8]} />
            <meshStandardMaterial color="#3b82f6" />
          </mesh>
          {/* Elbow Guard */}
          <mesh position={[0, -0.2, 0.04]}>
            <boxGeometry args={[0.14, 0.1, 0.08]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>
      </group>

      {/* Left Leg & Roller Skate */}
      <group ref={leftLegRef} position={[-0.14, 0.05, 0]}>
        <mesh position={[0, -0.26, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.36, 4, 8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Knee Pad */}
        <mesh position={[0, -0.22, 0.09]}>
          <boxGeometry args={[0.14, 0.12, 0.06]} />
          <meshStandardMaterial color="#f97316" />
        </mesh>

        {/* Roller Skate Boot */}
        <mesh position={[0, -0.48, 0.04]} castShadow>
          <boxGeometry args={[0.16, 0.14, 0.34]} />
          <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.4} />
        </mesh>
        {/* Skate Wheels Frame */}
        <mesh position={[0, -0.58, 0.04]}>
          <boxGeometry args={[0.12, 0.05, 0.3]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
        {/* 4 Roller Skate Wheels */}
        {[-0.1, -0.03, 0.04, 0.11].map((wz, i) => (
          <mesh key={i} position={[0, -0.62, wz + 0.04]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.18, 12]} />
            <meshStandardMaterial color="#ef4444" roughness={0.2} />
          </mesh>
        ))}
        {/* Front Toe Brake Stopper */}
        <mesh position={[0, -0.58, 0.2]}>
          <cylinderGeometry args={[0.04, 0.05, 0.08, 12]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>
      </group>

      {/* Right Leg & Roller Skate */}
      <group ref={rightLegRef} position={[0.14, 0.05, 0]}>
        <mesh position={[0, -0.26, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.36, 4, 8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Knee Pad */}
        <mesh position={[0, -0.22, 0.09]}>
          <boxGeometry args={[0.14, 0.12, 0.06]} />
          <meshStandardMaterial color="#f97316" />
        </mesh>

        {/* Roller Skate Boot */}
        <mesh position={[0, -0.48, 0.04]} castShadow>
          <boxGeometry args={[0.16, 0.14, 0.34]} />
          <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.4} />
        </mesh>
        {/* Skate Wheels Frame */}
        <mesh position={[0, -0.58, 0.04]}>
          <boxGeometry args={[0.12, 0.05, 0.3]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
        {/* 4 Roller Skate Wheels */}
        {[-0.1, -0.03, 0.04, 0.11].map((wz, i) => (
          <mesh key={i} position={[0, -0.62, wz + 0.04]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.18, 12]} />
            <meshStandardMaterial color="#ef4444" roughness={0.2} />
          </mesh>
        ))}
        {/* Front Toe Brake Stopper */}
        <mesh position={[0, -0.58, 0.2]}>
          <cylinderGeometry args={[0.04, 0.05, 0.08, 12]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>
      </group>

      {/* Brake Sparks Point Light */}
      <pointLight
        ref={brakeSparksRef}
        position={[0.15, -0.6, 0.2]}
        color="#fbbf24"
        intensity={0}
        distance={3.5}
      />

      {/* Shadow Blob / Ground Occlusion */}
      <mesh position={[0, -0.68, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.5, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}
