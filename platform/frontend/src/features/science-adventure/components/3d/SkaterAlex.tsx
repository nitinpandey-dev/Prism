import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { SurfaceId } from '../../types/adventure';

export default function SkaterAlex() {
  const { camera } = useThree();
  const activeMissionId = useAdventureStore((s) => s.activeMissionId);
  const missionState = useAdventureStore((s) => s.missionState);
  const updateSkaterTransform = useAdventureStore((s) => s.updateSkaterTransform);
  const completeMissionSuccess = useAdventureStore((s) => s.completeMissionSuccess);
  const failMission = useAdventureStore((s) => s.failMission);
  const virtualJoystick = useAdventureStore((s) => s.virtualJoystick);
  const mobileBraking = useAdventureStore((s) => s.isBraking);
  const mobileSprinting = useAdventureStore((s) => s.isSprinting);

  const initialPos = useRef(useAdventureStore.getState().skaterPosition);
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const brakeGlowRef = useRef<THREE.PointLight>(null);

  // Wheel meshes for physical rotation
  const wheelRefs = useRef<THREE.Mesh[]>([]);

  // Physics velocity and rotational state
  const velocity = useRef(new THREE.Vector3());
  const currentRotY = useRef(useAdventureStore.getState().skaterRotation);
  const bankRoll = useRef(0);
  const wheelSpin = useRef(0);
  const stumbleTimer = useRef(0);
  const lastSyncTime = useRef(0);

  // Initialize whether skater starts on the elevated boardwalk ramp
  const initPos = useAdventureStore.getState().skaterPosition;
  const isOnRamp = useRef(
    initPos[0] >= 4.3 && initPos[0] <= 8.7 && initPos[2] <= -5.0 && initPos[2] >= -22.5
  );

  // Keyboard keys
  const keys = useRef<{ [key: string]: boolean }>({});

  // Reset position & rotation when a mission begins or is retried
  useEffect(() => {
    if (missionState === 'briefing' || missionState === 'playing') {
      const state = useAdventureStore.getState();
      const onRamp = (
        state.skaterPosition[0] >= 4.3 &&
        state.skaterPosition[0] <= 8.7 &&
        state.skaterPosition[2] <= -5.0 &&
        state.skaterPosition[2] >= -22.5
      );
      isOnRamp.current = onRamp;

      const initY = onRamp
        ? 0.85 + THREE.MathUtils.clamp((-5.0 - state.skaterPosition[2]) / 15.0, 0, 1) * 1.40
        : 0.85;

      if (groupRef.current) {
        groupRef.current.position.set(
          state.skaterPosition[0],
          initY,
          state.skaterPosition[2]
        );
        currentRotY.current = state.skaterRotation;
        groupRef.current.rotation.y = state.skaterRotation;
        velocity.current.set(0, 0, 0);
        bankRoll.current = 0;
      }
    }
  }, [activeMissionId, missionState]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
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

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    // CRITICAL: Clamp delta to prevent physics explosions and clipping during frame drops
    const dt = Math.min(delta, 0.05);

    if (!groupRef.current) return;

    if (stumbleTimer.current > 0) {
      stumbleTimer.current -= dt;
    }

    const isShift = keys.current['ShiftLeft'] || keys.current['ShiftRight'] || mobileSprinting;
    const isBraking = keys.current['Space'] || mobileBraking;

    // Camera relative directions
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

    // Virtual Joystick input
    if (Math.abs(virtualJoystick.x) > 0.1 || Math.abs(virtualJoystick.y) > 0.1) {
      inputDir.addScaledVector(camRight, virtualJoystick.x);
      inputDir.addScaledVector(camForward, -virtualJoystick.y);
    }

    const hasInput = inputDir.lengthSq() > 0.01;
    const pos = groupRef.current.position;

    // ── 1. PARK BOUNDARIES & OBSTACLE COLLISION ──
    let nextX = pos.x + velocity.current.x * dt;
    let nextZ = pos.z + velocity.current.z * dt;

    // Outer Park Perimeter
    nextX = Math.max(-16.0, Math.min(16.0, nextX));
    nextZ = Math.max(-27.5, Math.min(27.6, nextZ));

    // Wooden Boardwalk Ramp Geometry: X in [4.3, 8.7], Z in [-22.5, -5.0]
    const rampMinX = 4.3;
    const rampMaxX = 8.7;
    const rampMinZ = -22.5;
    const rampEntranceZ = -5.0;

    let detectedSurface: SurfaceId = 'concrete';
    let targetY = 0.85;

    if (isOnRamp.current) {
      // Skater is safely riding ON TOP of the boardwalk ramp
      // 1. Side safety curbs (cannot fall off or clip through the sides)
      nextX = Math.max(rampMinX + 0.25, Math.min(rampMaxX - 0.25, nextX));
      // 2. Top resting deck back safety fence
      nextZ = Math.max(rampMinZ + 0.35, nextZ);

      // Height calculation on ramp:
      const rampProgress = THREE.MathUtils.clamp((-5.0 - nextZ) / 15.0, 0, 1);
      targetY = 0.85 + rampProgress * 1.40;
      detectedSurface = 'wood';

      // Gravity acceleration downhill (+Z)
      if (nextZ > -20.0 && nextZ < -5.0) {
        velocity.current.z += 6.5 * dt;
      }

      // Exit ramp back to concrete ground when rolling forward past the mouth
      if (nextZ > rampEntranceZ + 0.2) {
        isOnRamp.current = false;
      }
    } else {
      // Skater is down on the concrete / ground
      // Solid Side-Wall Obstacle: If skater tries to walk into the elevated sides of the ramp from the ground, block them!
      if (nextZ <= -5.8 && nextZ >= rampMinZ - 0.2) {
        if (nextX >= rampMinX - 0.45 && nextX <= rampMaxX + 0.45) {
          if (pos.x < 6.5) {
            nextX = rampMinX - 0.5; // pushed out to the left
          } else {
            nextX = rampMaxX + 0.5; // pushed out to the right
          }
        }
      } else if (nextZ < rampMinZ && nextZ >= rampMinZ - 0.8) {
        // Back of ramp wall
        if (nextX >= rampMinX - 0.45 && nextX <= rampMaxX + 0.45) {
          nextZ = rampMinZ - 0.85;
        }
      } else if (nextZ <= -5.0 && nextZ >= -5.8 && nextX >= rampMinX + 0.15 && nextX <= rampMaxX - 0.15) {
        // Skater entered through the designated ground-level entrance mouth!
        isOnRamp.current = true;
        detectedSurface = 'wood';
      }

      // Frosted Ice Pond: X in [-8.6, -3.4], Z in [-10, 6]
      if (nextX >= -8.6 && nextX <= -3.4 && nextZ >= -10 && nextZ <= 6) {
        detectedSurface = 'ice';
      }
      // Park Grass Meadow
      else if (Math.abs(nextX) > 8.5 || Math.abs(nextZ) > 37) {
        detectedSurface = 'grass';
      }
    }

    // Stainless Steel Grind Rail Collider: at X = -2.5, Z in [-11.0, 1.0]
    if (nextZ >= -11.2 && nextZ <= 1.2) {
      if (nextX >= -2.85 && nextX <= -2.15) {
        if (pos.x < -2.5) nextX = -2.9;
        else nextX = -2.1;
      }
    }

    // ── 2. SURFACE PHYSICAL DYNAMICS ──
    let maxSpeed = isShift ? 9.5 : 6.2;
    let accelerationRate = 19.0;
    let dragRate = 3.2;
    let brakePower = 18.0;

    if (detectedSurface === 'ice') {
      maxSpeed = isShift ? 11.2 : 7.8;
      accelerationRate = 5.5;
      dragRate = 0.35;
      brakePower = 4.2;
    } else if (detectedSurface === 'grass') {
      maxSpeed = isShift ? 4.5 : 2.8;
      accelerationRate = 12.0;
      dragRate = 14.0;
      brakePower = 22.0;
    }

    // ── 3. VELOCITY & BANKING CALCULATION ──
    let targetBank = 0;

    if (hasInput && !isBraking && missionState !== 'failed') {
      inputDir.normalize();
      const targetVelX = inputDir.x * maxSpeed;
      const targetVelZ = inputDir.z * maxSpeed;

      velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, targetVelX, accelerationRate * dt);
      velocity.current.z = THREE.MathUtils.lerp(velocity.current.z, targetVelZ, accelerationRate * dt);

      // Desired heading angle
      const targetAngle = Math.atan2(inputDir.x, inputDir.z);
      let diff = targetAngle - currentRotY.current;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;

      const turnRate = detectedSurface === 'ice' ? 3.8 : 12.0;
      currentRotY.current += diff * Math.min(1, turnRate * dt);

      // Clamped realistic skater banking/leaning into turn (max ~20 degrees)
      targetBank = Math.max(-0.35, Math.min(0.35, -diff * 0.35));
    } else if (isBraking) {
      velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, 0, brakePower * dt);
      velocity.current.z = THREE.MathUtils.lerp(velocity.current.z, 0, brakePower * dt);

      // Spin out if braking aggressively at high speed on ice
      if (detectedSurface === 'ice' && velocity.current.length() > 4.5) {
        currentRotY.current += 10 * dt;
        if (activeMissionId === 'mission-1' && missionState === 'playing') {
          failMission('Wiped out on the ice! Try taking it slower.');
        }
      }
    } else {
      velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, 0, dragRate * dt);
      velocity.current.z = THREE.MathUtils.lerp(velocity.current.z, 0, dragRate * dt);
    }

    // Smooth banking roll interpolation
    bankRoll.current = THREE.MathUtils.lerp(bankRoll.current, targetBank, 10 * dt);

    // Current scalar speed
    const currentSpeed = Math.sqrt(velocity.current.x ** 2 + velocity.current.z ** 2);

    // Wheel physical rolling rotation
    wheelSpin.current += (currentSpeed / 0.05) * dt;
    wheelRefs.current.forEach((w) => {
      if (w) w.rotation.x = wheelSpin.current;
    });

    // Apply collision-resolved position
    pos.x = nextX;
    pos.z = nextZ;
    if (isOnRamp.current) {
      pos.y = targetY; // Firmly lock to wooden ramp surface so wheels never sink through
    } else {
      pos.y = THREE.MathUtils.lerp(pos.y, targetY, 15 * dt);
    }

    groupRef.current.rotation.y = currentRotY.current;
    if (bodyRef.current) {
      bodyRef.current.rotation.z = bankRoll.current;
    }

    // ── 4. ANIMATION STATES ──
    let anim: 'idle' | 'skating' | 'sprinting' | 'braking' | 'stopped' | 'stumble' = 'idle';
    if (missionState === 'failed' || stumbleTimer.current > 0) {
      anim = 'stumble';
    } else if (isBraking && currentSpeed > 0.2) {
      anim = 'braking';
    } else if (currentSpeed > 0.4) {
      anim = isShift ? 'sprinting' : 'skating';
    } else if (isBraking) {
      anim = 'stopped';
    } else {
      anim = 'idle';
    }

    // Throttled Store Sync: Update React store at ~20Hz to eliminate UI micro-stutters
    if (t - lastSyncTime.current > 0.05) {
      lastSyncTime.current = t;
      updateSkaterTransform([pos.x, pos.y, pos.z], currentRotY.current, currentSpeed, anim, detectedSurface);
    }

    // ── 5. MISSION SUCCESS & COLLISION CHECKS ──
    if (missionState === 'playing') {
      if (activeMissionId === 'mission-1') {
        if (pos.z >= 10.0) completeMissionSuccess();
      } else if (activeMissionId === 'mission-2') {
        const distToBall = Math.sqrt(pos.x ** 2 + (pos.z - 12.5) ** 2);
        if (distToBall < 0.75) {
          failMission('Collided with the ball! Brake earlier to stop in the safe green zone.');
        } else if (pos.z >= 7.5 && pos.z <= 11.8 && Math.abs(pos.x) <= 8.0 && currentSpeed < 0.25) {
          completeMissionSuccess();
        }
      } else if (activeMissionId === 'mission-3') {
        if (pos.z >= 26.0) completeMissionSuccess();
      } else if (activeMissionId === 'mission-4') {
        if (pos.z >= 5.0 && pos.z <= 11.0 && currentSpeed < 0.25) completeMissionSuccess();
      }
    }

    // ── 6. PROCEDURAL ATHLETIC ANIMATION ──
    if (anim === 'skating' || anim === 'sprinting') {
      const strideFreq = anim === 'sprinting' ? 11.5 : 7.8;
      const stride = Math.sin(t * strideFreq);

      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.max(-0.55, Math.min(0.55, stride * 0.65));
        leftLegRef.current.rotation.z = Math.max(0, stride * 0.2);
        rightLegRef.current.rotation.x = Math.max(-0.55, Math.min(0.55, -stride * 0.65));
        rightLegRef.current.rotation.z = Math.min(0, -stride * 0.2);
      }

      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = -stride * 0.55;
        rightArmRef.current.rotation.x = stride * 0.55;
      }

      if (torsoRef.current) {
        torsoRef.current.rotation.x = anim === 'sprinting' ? 0.32 : 0.18;
      }
      if (brakeGlowRef.current) brakeGlowRef.current.intensity = 0;
    } else if (anim === 'braking') {
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = 0.25;
        rightLegRef.current.rotation.x = -0.55;
        rightLegRef.current.rotation.y = 0.65;
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.z = 0.55;
        rightArmRef.current.rotation.z = -0.55;
      }
      if (torsoRef.current) torsoRef.current.rotation.x = 0.12;

      if (brakeGlowRef.current) {
        brakeGlowRef.current.intensity = 1.6 + Math.sin(t * 30) * 0.8;
      }
    } else if (anim === 'stumble') {
      if (torsoRef.current) torsoRef.current.rotation.x = 0.35;
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.z = Math.sin(t * 14) * 0.7;
        rightArmRef.current.rotation.z = -Math.sin(t * 14) * 0.7;
      }
      if (brakeGlowRef.current) brakeGlowRef.current.intensity = 0;
    } else {
      const sway = Math.sin(t * 2) * 0.03;
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.set(0, 0, 0);
        rightLegRef.current.rotation.set(0, 0, 0);
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.set(0, 0, 0.12 + sway);
        rightArmRef.current.rotation.set(0, 0, -0.12 - sway);
      }
      if (torsoRef.current) torsoRef.current.rotation.set(0, 0, 0);
      if (brakeGlowRef.current) brakeGlowRef.current.intensity = 0;
    }
  });

  return (
    <group ref={groupRef} position={[initialPos.current[0], 0.85, initialPos.current[2]]}>
      <group ref={bodyRef}>
        {/* ── 1. TORSO & SKATE HOODIE ── */}
        <group ref={torsoRef} position={[0, 0.44, 0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.24, 0.2, 0.54, 16]} />
            <meshStandardMaterial color="#1e293b" roughness={0.65} />
          </mesh>
          <mesh position={[0, 0.04, 0.18]}>
            <boxGeometry args={[0.08, 0.38, 0.03]} />
            <meshBasicMaterial color="#00d2ff" />
          </mesh>
        </group>

        {/* ── 2. HEAD & HELMET ── */}
        <group position={[0, 0.94, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="#fed7aa" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.06, 0]} castShadow>
            <sphereGeometry args={[0.21, 18, 18, 0, Math.PI * 2, 0, Math.PI / 1.75]} />
            <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.2} />
          </mesh>
          <mesh position={[0, 0.06, 0.16]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.24, 0.035, 0.08]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>

        {/* ── 3. ARMS ── */}
        <group ref={leftArmRef} position={[-0.32, 0.62, 0]}>
          <mesh position={[0, -0.2, 0]} castShadow>
            <capsuleGeometry args={[0.065, 0.34, 8, 8]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          <mesh position={[0, -0.18, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>

        <group ref={rightArmRef} position={[0.32, 0.62, 0]}>
          <mesh position={[0, -0.2, 0]} castShadow>
            <capsuleGeometry args={[0.065, 0.34, 8, 8]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          <mesh position={[0, -0.18, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>

        {/* ── 4. LEGS & ROTATING INLINE WHEELS ── */}
        <group ref={leftLegRef} position={[-0.14, 0.15, 0]}>
          <mesh position={[0, -0.26, 0]} castShadow>
            <capsuleGeometry args={[0.085, 0.38, 8, 8]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, -0.24, 0.07]}>
            <boxGeometry args={[0.12, 0.12, 0.05]} />
            <meshStandardMaterial color="#334155" />
          </mesh>

          <mesh position={[0, -0.54, 0.04]} castShadow>
            <boxGeometry args={[0.14, 0.12, 0.28]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.62, 0.04]}>
            <boxGeometry args={[0.04, 0.05, 0.26]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>

          {[-0.08, -0.02, 0.04, 0.1].map((wz, i) => (
            <mesh
              key={i}
              ref={(el) => {
                if (el) wheelRefs.current[i] = el;
              }}
              position={[0, -0.66, wz]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.045, 0.045, 0.035, 12]} />
              <meshStandardMaterial color="#00d2ff" roughness={0.2} metalness={0.4} />
            </mesh>
          ))}
        </group>

        <group ref={rightLegRef} position={[0.14, 0.15, 0]}>
          <mesh position={[0, -0.26, 0]} castShadow>
            <capsuleGeometry args={[0.085, 0.38, 8, 8]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, -0.24, 0.07]}>
            <boxGeometry args={[0.12, 0.12, 0.05]} />
            <meshStandardMaterial color="#334155" />
          </mesh>

          <mesh position={[0, -0.54, 0.04]} castShadow>
            <boxGeometry args={[0.14, 0.12, 0.28]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.62, 0.04]}>
            <boxGeometry args={[0.04, 0.05, 0.26]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>

          {[-0.08, -0.02, 0.04, 0.1].map((wz, i) => (
            <mesh
              key={i}
              ref={(el) => {
                if (el) wheelRefs.current[4 + i] = el;
              }}
              position={[0, -0.66, wz]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.045, 0.045, 0.035, 12]} />
              <meshStandardMaterial color="#00d2ff" roughness={0.2} metalness={0.4} />
            </mesh>
          ))}
        </group>

        <pointLight ref={brakeGlowRef} position={[0, -0.64, -0.1]} color="#f97316" distance={2.2} intensity={0} />

        <mesh position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.5, 16]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.35} />
        </mesh>
      </group>
    </group>
  );
}
