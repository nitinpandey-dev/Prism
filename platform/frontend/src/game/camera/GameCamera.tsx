import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useGameStore } from '../../stores/useGameStore';
import { usePhysicsStore } from '../../stores/usePhysicsStore';

export default function GameCamera() {
  const { camera } = useThree();
  const isConsoleOpen = useGameStore((s) => s.isConsoleOpen);

  // Mouse orbit variables
  const orbitYaw = useRef(0);
  const orbitPitch = useRef(0.25); // Slight top-down angle
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      // Only drag if not clicking UI elements
      if ((e.target as HTMLElement)?.tagName === 'CANVAS') {
        isDragging.current = true;
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || isConsoleOpen) return;
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      orbitYaw.current -= dx * 0.005;
      orbitPitch.current = Math.max(0.05, Math.min(1.1, orbitPitch.current + dy * 0.005));
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [isConsoleOpen]);

  // Current camera smoothed position and lookTarget
  const currentCamPos = useRef(new THREE.Vector3(0, 5, -16));
  const currentLookAt = useRef(new THREE.Vector3(0, 1.5, -10));

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const gameState = useGameStore.getState();
    const physicsState = usePhysicsStore.getState();
    const playerPos = gameState.player.position;
    const px = playerPos[0];
    const py = playerPos[1];
    const pz = playerPos[2];
    const cameraView = gameState.cameraView;
    const isFiring = physicsState.isFiring;
    const currentProjectilePos = physicsState.currentProjectilePos;

    const targetCamPos = new THREE.Vector3();
    const targetLookAt = new THREE.Vector3();

    if (isFiring && currentProjectilePos) {
      // ─── 1. Flight Chase Cam ───
      targetCamPos.set(
        currentProjectilePos.x,
        currentProjectilePos.y + 3.0,
        currentProjectilePos.z - 8.0
      );
      targetLookAt.set(
        currentProjectilePos.x,
        currentProjectilePos.y,
        currentProjectilePos.z + 10.0
      );
    } else if (cameraView === 'terminal_view' || isConsoleOpen) {
      // ─── 2. Launcher Terminal Aim Cam (Looking down the canyon towards receiver) ───
      targetCamPos.set(0, 2.8, 6.2);
      targetLookAt.set(0, 0, 70); // Looking towards canyon target
    } else {
      // ─── 3. Standard Third-Person Orbit Cam ───
      const distance = 6.5;
      const camY = py + 1.2 + distance * Math.sin(orbitPitch.current);
      const horizontalDist = distance * Math.cos(orbitPitch.current);
      const camX = px - horizontalDist * Math.sin(orbitYaw.current);
      const camZ = pz - horizontalDist * Math.cos(orbitYaw.current);

      targetCamPos.set(camX, camY, camZ);
      targetLookAt.set(px, py + 1.2, pz);
    }

    // Smooth spring-damping interpolation
    const lerpSpeed = cameraView === 'terminal_view' ? 4.0 : 7.0;
    currentCamPos.current.lerp(targetCamPos, lerpSpeed * dt);
    currentLookAt.current.lerp(targetLookAt, lerpSpeed * dt);

    camera.position.copy(currentCamPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}

