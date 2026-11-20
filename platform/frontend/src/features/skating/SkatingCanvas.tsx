import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import SkatingCamera from './components/SkatingCamera';
import SkatingEnvironment from './components/SkatingEnvironment';
import SkaterAlex from './components/SkaterAlex';
import AriaCompanion from '../../game/aria/AriaCompanion';

export default function SkatingCanvas() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <Canvas
        shadows={{ type: THREE.PCFShadowMap }}
        camera={{ position: [0, 5, -32], fov: 60, near: 0.1, far: 400 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
        style={{ width: '100%', height: '100%', background: '#38bdf8' }}
      >
        <Suspense fallback={null}>
          <SkatingCamera />
          <SkatingEnvironment />
          <SkaterAlex />
          <AriaCompanion />
        </Suspense>
      </Canvas>
    </div>
  );
}
