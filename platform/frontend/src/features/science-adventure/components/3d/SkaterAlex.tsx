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
    skaterSpeed,
    skaterAnim,
    updateSkaterTransform,
    completeMissionSuccess,
    failMission,
    virtualJoystick,
    isBraking: mobileBraking,
    isSprinting: mobileSprinting,
  } = useAdventureStore();

  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const brakeGlowRef = useRef<THREE.PointLight>(null);

  // Velocity and rotational state
  const velocity = useRef(new THREE.Vector3());
  const currentRotY = useRef(skaterRotation);
  const stumbleTimer = useRef(0);

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
    if (!groupRef.current) return;

    // Handle stumble/recovery timer
    if (stumbleTimer.current > 0) {
      stumbleTimer.current -= delta;
      if (stumbleTimer.current <= 0 && missionState !== 'failed') {
        // Recovered
      }
    }

    // Determine input direction
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

    // Add virtual joystick input
    if (Math.abs(virtualJoystick.x) > 0.1 || Math.abs(virtualJoystick.y) > 0.1) {
      inputDir.addScaledVector(camRight, virtualJoystick.x);
      inputDir.addScaledVector(camForward, -virtualJoystick.y);
    }

    const hasInput = inputDir.lengthSq() > 0.01;

    // Current position
    const pos = groupRef.current.position;

    // ── 1. DYNAMIC SURFACE DETECTION ──
    let detectedSurface: SurfaceId = 'concrete';
    let targetY = 0.85;

    // Check Ice Patch: X in [-8.6, -3.4], Z in [-10, 6]
    if (pos.x >= -8.6 && pos.x <= -3.4 && pos.z >= -10 && pos.z <= 6) {
      detectedSurface = 'ice';
    }
    // Check Wooden Ramp: X in [4.4, 8.6], Z in [-19.5, -5.5]
    else if (pos.x >= 4.4 && pos.x <= 8.6 && pos.z >= -19.5 && pos.z <= -5.5) {
      detectedSurface = 'wood';
      // Elevation from Z = -5.5 (0.85) up to Z = -19.5 (2.35)
      const rampProgress = (-5.5 - pos.z) / 14.0;
      targetY = 0.85 + Math.max(0, Math.min(1.5, rampProgress * 1.5));
    }
    // Check Park Grass
    else if ((Math.abs(pos.x) > 8.0 && !(pos.x >= 4.4 && pos.x <= 8.6 && pos.z >= -19.5 && pos.z <= -5.5)) || Math.abs(pos.z) > 37) {
      detectedSurface = 'grass';
    }

    // ── 2. PHYSICS CONSTANTS BASED ON SURFACE ──
    let maxSpeed = isShift ? 9.2 : 6.0;
    let accelerationRate = 18.0;
    let dragRate = 3.5;
    let brakePower = 18.0;

    if (detectedSurface === 'ice') {
      // Slippery ice: low drag, low steering grip, coasting momentum!
      maxSpeed = isShift ? 11.0 : 7.5;
      accelerationRate = 6.0;
      dragRate = 0.45; // Coast forever on ice
      brakePower = 4.5; // Brakes slip on ice!
    } else if (detectedSurface === 'grass') {
      // Rough grass: high resistance
      maxSpeed = isShift ? 4.8 : 3.0;
      accelerationRate = 14.0;
      dragRate = 14.0; // Decelerates rapidly
      brakePower = 22.0;
    } else if (detectedSurface === 'wood') {
      // Downhill slope adds forward push if heading toward +Z
      if (pos.z > -19.5 && pos.z < -5.5) {
        velocity.current.z += 5.0 * delta; // Downhill gravity component
      }
    }

    // ── 3. VELOCITY CALCULATION ──
    if (hasInput && !isBraking && missionState !== 'failed') {
      inputDir.normalize();
      const targetVelX = inputDir.x * maxSpeed;
      const targetVelZ = inputDir.z * maxSpeed;

      velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, targetVelX, accelerationRate * delta);
      velocity.current.z = THREE.MathUtils.lerp(velocity.current.z, targetVelZ, accelerationRate * delta);

      // Rotate towards input direction
      const targetAngle = Math.atan2(inputDir.x, inputDir.z);
      let diff = targetAngle - currentRotY.current;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;

      // Slower rotation on ice (steering slip)
      const turnSpeed = detectedSurface === 'ice' ? 4.0 : 12.0;
      currentRotY.current += diff * Math.min(1, turnSpeed * delta);
    } else if (isBraking) {
      // Braking deceleration
      velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, 0, brakePower * delta);
      velocity.current.z = THREE.MathUtils.lerp(velocity.current.z, 0, brakePower * delta);

      // If braking too sharply at high speed on ice, Alex wobbles/spins!
      if (detectedSurface === 'ice' && velocity.current.length() > 4.5) {
        currentRotY.current += 12 * delta; // Spin out on ice
        if (activeMissionId === 'mission-1' && missionState === 'playing') {
          failMission('Wiped out on the ice! Try taking it slower.');
        }
      }
    } else {
      // Natural rolling drag
      velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, 0, dragRate * delta);
      velocity.current.z = THREE.MathUtils.lerp(velocity.current.z, 0, dragRate * delta);
    }

    // Current scalar speed
    const currentSpeed = Math.sqrt(velocity.current.x ** 2 + velocity.current.z ** 2);

    // Apply movement
    pos.x = Math.max(-18, Math.min(18, pos.x + velocity.current.x * delta));
    pos.z = Math.max(-32, Math.min(38, pos.z + velocity.current.z * delta));
    pos.y = targetY;

    groupRef.current.rotation.y = currentRotY.current;

    // ── 4. ANIMATION STATE SELECTION ──
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

    // Sync to adventure store
    updateSkaterTransform([pos.x, pos.y, pos.z], currentRotY.current, currentSpeed, anim, detectedSurface);

    // ── 5. MISSION SUCCESS / CHECK CONDITIONS ──
    if (missionState === 'playing') {
      // MISSION 1: The Slippery Surprise (reach Z >= 10 safely without falling)
      if (activeMissionId === 'mission-1') {
        if (pos.z >= 10.0) {
          completeMissionSuccess();
        }
      }

      // MISSION 2: Stop Before the Ball (safe stop in Z in [7, 12] before hitting ball at Z = 12.5)
      else if (activeMissionId === 'mission-2') {
        const distToBall = Math.sqrt(pos.x ** 2 + (pos.z - 12.5) ** 2);
        // If collided with ball
        if (distToBall < 0.75) {
          failMission('Whoops! You collided with the ball! Try braking earlier.');
        }
        // If stopped inside green zone (Z between 7.5 and 11.8)
        else if (pos.z >= 7.5 && pos.z <= 11.8 && currentSpeed < 0.25) {
          completeMissionSuccess();
        }
      }

      // MISSION 3: The Changing Track (reach finish gate at Z >= 26)
      else if (activeMissionId === 'mission-3') {
        if (pos.z >= 26.0) {
          completeMissionSuccess();
        }
      }

      // MISSION 4: The Downhill Challenge (ride down and stop at target bench Z between 5 and 11)
      else if (activeMissionId === 'mission-4') {
        if (pos.z >= 5.0 && pos.z <= 11.0 && currentSpeed < 0.25) {
          completeMissionSuccess();
        }
      }
    }

    // ── 6. PROCEDURAL SKELETON ANIMATIONS ──
    if (anim === 'skating' || anim === 'sprinting') {
      const strideFreq = anim === 'sprinting' ? 12.0 : 8.0;
      const stride = Math.sin(t * strideFreq);

      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.max(-0.6, Math.min(0.6, stride * 0.7));
        leftLegRef.current.rotation.z = Math.max(0, stride * 0.25);
        rightLegRef.current.rotation.x = Math.max(-0.6, Math.min(0.6, -stride * 0.7));
        rightLegRef.current.rotation.z = Math.min(0, -stride * 0.25);
      }

      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = -stride * 0.6;
        rightArmRef.current.rotation.x = stride * 0.6;
      }

      if (torsoRef.current) {
        torsoRef.current.rotation.x = anim === 'sprinting' ? 0.35 : 0.2;
        torsoRef.current.rotation.z = stride * 0.05;
      }
      if (brakeGlowRef.current) brakeGlowRef.current.intensity = 0;
    } else if (anim === 'braking') {
      // T-Stop posture with dragging rear skate
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = 0.3;
        leftLegRef.current.rotation.z = 0;
        rightLegRef.current.rotation.x = -0.55;
        rightLegRef.current.rotation.y = 0.65;
        rightLegRef.current.rotation.z = -0.15;
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.z = 0.6;
        rightArmRef.current.rotation.z = -0.6;
      }
      if (torsoRef.current) torsoRef.current.rotation.x = 0.15;

      // Friction sparking light under rear skate
      if (brakeGlowRef.current) {
        brakeGlowRef.current.intensity = 2.0 + Math.sin(t * 30) * 0.9;
      }
    } else if (anim === 'stumble') {
      // Wobble / fall animation
      if (torsoRef.current) torsoRef.current.rotation.x = 0.4;
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.z = Math.sin(t * 15) * 0.8;
        rightArmRef.current.rotation.z = -Math.sin(t * 15) * 0.8;
      }
      if (brakeGlowRef.current) brakeGlowRef.current.intensity = 0;
    } else {
      // Idle / Stopped breathing sway
      const sway = Math.sin(t * 2) * 0.04;
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.set(0, 0, 0);
        rightLegRef.current.rotation.set(0, 0, 0);
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.set(0, 0, 0.15 + sway);
        rightArmRef.current.rotation.set(0, 0, -0.15 - sway);
      }
      if (torsoRef.current) torsoRef.current.rotation.set(0, 0, 0);
      if (brakeGlowRef.current) brakeGlowRef.current.intensity = 0;
    }
  });

  return (
    <group ref={groupRef} position={[skaterPosition[0], 0.85, skaterPosition[2]]}>
      {/* ── 1. TORSO & SPORTS JERSEY ── */}
      <group ref={torsoRef} position={[0, 0.45, 0]}>
        {/* Bright Athletic Shirt */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.26, 0.22, 0.58, 12]} />
          <meshStandardMaterial color="#0284c7" roughness={0.4} />
        </mesh>
        {/* Sporty Racing Stripes */}
        <mesh position={[0, 0.05, 0.2]}>
          <boxGeometry args={[0.1, 0.4, 0.05]} />
          <meshBasicMaterial color="#facc15" />
        </mesh>
      </group>

      {/* ── 2. HEAD & PROTECTIVE SAFETY HELMET ── */}
      <group position={[0, 0.95, 0]}>
        {/* Head */}
        <mesh castShadow>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>
        {/* Safety Helmet */}
        <mesh position={[0, 0.07, 0]} castShadow>
          <sphereGeometry args={[0.23, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
          <meshStandardMaterial color="#f43f5e" roughness={0.2} metalness={0.3} />
        </mesh>
        {/* Helmet Visor Lip */}
        <mesh position={[0, 0.06, 0.18]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.26, 0.04, 0.1]} />
          <meshStandardMaterial color="#e11d48" />
        </mesh>
        {/* Friendly Eyes */}
        <mesh position={[-0.06, 0.01, 0.18]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0.06, 0.01, 0.18]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* ── 3. ARMS & ELBOW PADS ── */}
      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.34, 0.65, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.35, 8, 8]} />
          <meshStandardMaterial color="#38bdf8" />
        </mesh>
        {/* Elbow Pad */}
        <mesh position={[0, -0.2, 0]}>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.34, 0.65, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.35, 8, 8]} />
          <meshStandardMaterial color="#38bdf8" />
        </mesh>
        {/* Elbow Pad */}
        <mesh position={[0, -0.2, 0]}>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* ── 4. LEGS & ROLLER SKATES ── */}
      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.15, 0.16, 0]}>
        {/* Leg / Shorts */}
        <mesh position={[0, -0.28, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.42, 8, 8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Knee Pad */}
        <mesh position={[0, -0.25, 0.08]}>
          <boxGeometry args={[0.14, 0.14, 0.06]} />
          <meshStandardMaterial color="#f43f5e" />
        </mesh>

        {/* Roller Skate Boot */}
        <mesh position={[0, -0.56, 0.06]} castShadow>
          <boxGeometry args={[0.16, 0.14, 0.3]} />
          <meshStandardMaterial color="#facc15" roughness={0.3} />
        </mesh>
        {/* 4 Wheels */}
        {[-0.09, 0.09].map((wx, i) => (
          <group key={i}>
            <mesh position={[wx, -0.66, -0.06]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.05, 0.05, 0.04, 12]} />
              <meshStandardMaterial color="#f43f5e" />
            </mesh>
            <mesh position={[wx, -0.66, 0.16]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.05, 0.05, 0.04, 12]} />
              <meshStandardMaterial color="#f43f5e" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.15, 0.16, 0]}>
        {/* Leg / Shorts */}
        <mesh position={[0, -0.28, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.42, 8, 8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Knee Pad */}
        <mesh position={[0, -0.25, 0.08]}>
          <boxGeometry args={[0.14, 0.14, 0.06]} />
          <meshStandardMaterial color="#f43f5e" />
        </mesh>

        {/* Roller Skate Boot */}
        <mesh position={[0, -0.56, 0.06]} castShadow>
          <boxGeometry args={[0.16, 0.14, 0.3]} />
          <meshStandardMaterial color="#facc15" roughness={0.3} />
        </mesh>
        {/* 4 Wheels */}
        {[-0.09, 0.09].map((wx, i) => (
          <group key={i}>
            <mesh position={[wx, -0.66, -0.06]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.05, 0.05, 0.04, 12]} />
              <meshStandardMaterial color="#f43f5e" />
            </mesh>
            <mesh position={[wx, -0.66, 0.16]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.05, 0.05, 0.04, 12]} />
              <meshStandardMaterial color="#f43f5e" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Friction Brake Spark Light */}
      <pointLight ref={brakeGlowRef} position={[0, -0.65, -0.1]} color="#f97316" distance={2.5} intensity={0} />

      {/* Shadow Disc */}
      <mesh position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
