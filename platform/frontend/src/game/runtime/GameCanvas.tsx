import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import GameCamera from '../camera/GameCamera';
import OutpostEnvironment from '../environment/OutpostEnvironment';
import PlayerController from '../player/PlayerController';
import AriaCompanion from '../aria/AriaCompanion';
import LauncherMortar from '../interactive/LauncherMortar';
import RelayReceiver from '../interactive/RelayReceiver';
import InteractiveConsole from '../interactive/InteractiveConsole';
import TrajectoryVisualizer from '../simulation/TrajectoryVisualizer';

export default function GameCanvas() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <Canvas
        shadows={{ type: THREE.PCFShadowMap }}
        camera={{ position: [0, 4, -15], fov: 60, near: 0.1, far: 500 }}
        dpr={[1, 1.5]} // Optimized pixel ratio for 60fps performance
        gl={{ antialias: true, alpha: false }}
        style={{ width: '100%', height: '100%', background: '#0a0f1d' }}
      >
        <Suspense fallback={null}>
          <GameCamera />
          <OutpostEnvironment />
          <PlayerController />
          <AriaCompanion />
          <LauncherMortar />
          <RelayReceiver />
          <InteractiveConsole />
          <TrajectoryVisualizer />
        </Suspense>
      </Canvas>
    </div>
  );
}

