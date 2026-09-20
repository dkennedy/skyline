import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ACESFilmicToneMapping } from 'three'
import { cameraStart } from './lighting'
import { YBot } from '../character/YBot'
import { DefaultWorld } from './DefaultWorld'
import { UnrealFlyControls } from './UnrealFlyControls'

export function SceneViewport() {
  return (
    <Canvas
      className="scene-viewport__canvas"
      dpr={[1, 2]}
      camera={{
        position: cameraStart.position.toArray(),
        fov: cameraStart.fov,
        near: cameraStart.near,
        far: cameraStart.far
      }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      }}
      onCreated={({ camera, gl }) => {
        camera.lookAt(cameraStart.target)
        gl.setClearColor('#1a2030')
        gl.toneMapping = ACESFilmicToneMapping
        gl.toneMappingExposure = 0.4
        gl.domElement.style.outline = 'none'
        gl.domElement.style.touchAction = 'none'
      }}
    >
      <Suspense fallback={null}>
        <DefaultWorld />
        <YBot tpose />
      </Suspense>
      <UnrealFlyControls />
    </Canvas>
  )
}
