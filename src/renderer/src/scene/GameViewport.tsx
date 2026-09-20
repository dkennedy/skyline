import { Suspense, useCallback, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ACESFilmicToneMapping } from 'three'
import { DefaultWorld } from './DefaultWorld'
import { YBot, type YBotHandle } from '../character/YBot'
import { ThirdPersonController } from '../character/ThirdPersonController'
import { characterSpawn } from '../character/paths'

export function GameViewport() {
  const [handle, setHandle] = useState<YBotHandle | null>(null)

  const onReady = useCallback((next: YBotHandle) => {
    const groundedY = next.group.position.y
    next.group.position.set(characterSpawn.position[0], groundedY, characterSpawn.position[2])
    next.group.rotation.y = characterSpawn.rotationY
    setHandle(next)
  }, [])

  return (
    <Canvas
      className="scene-viewport__canvas"
      dpr={[1, 2]}
      camera={{
        position: [0, 2.5, 6],
        fov: 60,
        near: 0.1,
        far: 2500
      }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      }}
      onCreated={({ gl }) => {
        gl.setClearColor('#1a2030')
        gl.toneMapping = ACESFilmicToneMapping
        gl.toneMappingExposure = 0.4
        gl.domElement.style.outline = 'none'
        gl.domElement.style.touchAction = 'none'
      }}
    >
      <Suspense fallback={null}>
        <DefaultWorld />
        <YBot onReady={onReady} />
      </Suspense>
      <ThirdPersonController character={handle?.group ?? null} anim={handle?.anim ?? null} />
    </Canvas>
  )
}
