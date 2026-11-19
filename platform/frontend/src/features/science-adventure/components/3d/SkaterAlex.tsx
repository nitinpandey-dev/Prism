import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { SurfaceId } from '../../types/adventure';

export default function SkaterAlex() {
  const { camera } = useThree();
  const {
    activeMissionId,
    missionState,
    skaterPosition,
    skaterRotation,
    updateSkaterTransform,
    completeMissionSuccess,
    failMission,
    virtualJoystick,
    isBraking: mobileBraking,
    isSprinting: mobileSprinting,
  } = useAdventureStore();

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
  const currentRotY = useRef(skaterRotation);
  const bankRoll = useRef(0);
  const wheelSpin = useRef(0);
  const stumbleTimer = useRef(0);
  const lastSyncTime = useRef(0);

  // Keyboard keys
  const keys = useRef<{ [key: string]: boolean }>({});

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

    // ── 1. DYNAMIC SURFACE DETECTION ──
    let detectedSurface: SurfaceId = 'concrete';
    let targetY = 0.85;

    // Frosted Ice Pond: X in [-8.6, -3.4], Z in [-10, 6]
    if (pos.x >= -8.6 && pos.x <= -3.4 && pos.z >= -10 && pos.z <= 6) {
      detectedSurface = 'ice';
    }
    // Wooden Boardwalk Ramp: X in [4.4, 8.6], Z in [-19.5, -5.5]
    else if (pos.x >= 4.4 && pos.x <= 8.6 && pos.z >= -19.5 && pos.z <= -5.5) {
      detectedSurface = 'wood';
      const rampProgress = (-5.5 - pos.z) / 14.0;
      targetY = 0.85 + Math.max(0, Math.min(1.5, rampProgress * 1.5));
    }
    // Park Grass Meadow
    else if ((Math.abs(pos.x) > 8.4 && !(pos.x >= 4.4 && pos.x <= 8.6 && pos.z >= -19.5 && pos.z <= -5.5)) || Math.abs(pos.z) > 37) {
      detectedSurface = 'grass';
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
    } else if (detectedSurface === 'wood') {
      if (pos.z > -19.5 && pos.z < -5.5) {
        velocity.current.z += 5.5 * dt;
      }
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

    // Enforce park boundaries (stops before clipping through finish barrier at Z = 28)
    pos.x = Math.max(-16.5, Math.min(16.5, pos.x + velocity.current.x * dt));
    pos.z = Math.max(-28, Math.min(27.8, pos.z + velocity.current.z * dt));
    pos.y = targetY;

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
    <group ref={groupRef} position={[skaterPosition[0], 0.85, skaterPosition[2]]}>
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
