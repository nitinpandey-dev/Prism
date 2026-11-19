import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useSkatingStore } from '../stores/useSkatingStore';

export default function SkatingCamera() {
  const { camera } = useThree();
  const experimentState = useSkatingStore((s) => s.experimentState);

  const orbitYaw = useRef(0);
  const orbitPitch = useRef(0.28);
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'CANVAS') {
        isDragging.current = true;
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      orbitYaw.current -= dx * 0.005;
      orbitPitch.current = Math.max(0.08, Math.min(1.2, orbitPitch.current + dy * 0.005));
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  const currentCamPos = useRef(new THREE.Vector3(0, 4.5, -32));
  const currentLookAt = useRef(new THREE.Vector3(0, 1.2, -25));

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const skaterPosition = useSkatingStore.getState().skaterPosition;
    const [sx, sy, sz] = skaterPosition;

    const targetCamPos = new THREE.Vector3();
    const targetLookAt = new THREE.Vector3();

    if (experimentState === 'approaching' || experimentState === 'braking' || experimentState === 'finished') {
      // ── Dynamic Experiment Tracking Camera ──
      // Positioned behind Alex in the lane, looking forward along the track
      targetCamPos.set(sx * 0.8, 3.8, sz - 7.5);
      targetLookAt.set(sx * 0.8, 1.2, sz + 6.0);
    } else {
      // ── Third-person Orbit Camera for Free-Roam ──
      const distance = 6.8;
      const camY = sy + 1.2 + distance * Math.sin(orbitPitch.current);
      const horizontalDist = distance * Math.cos(orbitPitch.current);
      const camX = sx - horizontalDist * Math.sin(orbitYaw.current);
      const camZ = sz - horizontalDist * Math.cos(orbitYaw.current);

      targetCamPos.set(camX, camY, camZ);
      targetLookAt.set(sx, sy + 1.2, sz);
    }

    const lerpSpeed = 7.0;
    currentCamPos.current.lerp(targetCamPos, lerpSpeed * dt);
    currentLookAt.current.lerp(targetLookAt, lerpSpeed * dt);

    camera.position.copy(currentCamPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
