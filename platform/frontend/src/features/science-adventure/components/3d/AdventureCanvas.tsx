import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import SkateParkEnvironment from './SkateParkEnvironment';
import SkaterAlex from './SkaterAlex';
import AdventureCamera from './AdventureCamera';

export default function AdventureCanvas() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: 'linear-gradient(to bottom, #38bdf8, #bae6fd)',
        userSelect: 'none',
      }}
    >
      <Canvas
        shadows={{ type: THREE.PCFShadowMap }}
        camera={{ position: [0, 4, -22], fov: 60, near: 0.1, far: 500 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <AdventureCamera />
          <SkateParkEnvironment />
          <SkaterAlex />
        </Suspense>
      </Canvas>
    </div>
  );
}
