import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useAdventureStore } from '../../stores/useAdventureStore';

export default function AdventureCamera() {
  const { camera, gl } = useThree();

  const orbitYaw = useRef(0);
  const orbitPitch = useRef(0.28);
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = gl.domElement;

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      orbitYaw.current -= dx * 0.006;
      orbitPitch.current = Math.max(0.08, Math.min(1.1, orbitPitch.current + dy * 0.005));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    // Touch support for orbiting
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging.current = true;
        lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - lastMousePos.current.x;
      const dy = e.touches[0].clientY - lastMousePos.current.y;
      orbitYaw.current -= dx * 0.006;
      orbitPitch.current = Math.max(0.08, Math.min(1.1, orbitPitch.current + dy * 0.005));
      lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging.current = false;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [gl]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    // Read directly from store state to avoid triggering React re-renders at 60fps!
    const state = useAdventureStore.getState();
    const skaterPosition = state.skaterPosition;
    const skaterSpeed = state.skaterSpeed;
    const skaterRotation = state.skaterRotation;

    // Soft yaw auto-alignment: when moving forward at speed and not dragging, gently align camera behind skater
    if (!isDragging.current && skaterSpeed > 1.2) {
      let diff = -skaterRotation - orbitYaw.current;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      orbitYaw.current += diff * Math.min(1, 1.8 * dt);
    }

    const targetX = skaterPosition[0];
    const targetY = skaterPosition[1] + 1.2;
    const targetZ = skaterPosition[2];

    const distance = 7.5;
    const camX = targetX + distance * Math.sin(orbitYaw.current) * Math.cos(orbitPitch.current);
    const camY = targetY + distance * Math.sin(orbitPitch.current);
    const camZ = targetZ - distance * Math.cos(orbitYaw.current) * Math.cos(orbitPitch.current);

    // Smooth camera damping without jitter
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, camX, 8 * dt);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, camY, 8 * dt);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, camZ, 8 * dt);

    camera.lookAt(targetX, targetY, targetZ);
  });

  return null;
}
