import { forwardRef, useEffect, useMemo, type ForwardedRef } from 'react'
import { useFBX } from '@react-three/drei'
import * as THREE from 'three'
import { clone as cloneSkinned } from 'three/addons/utils/SkeletonUtils.js'
import { AnimStateMachine } from './AnimStateMachine'
import { bindClipToRig } from './bindClip'
import { characterSpawn, fbxPaths, ybotScale } from './paths'

export type YBotHandle = {
  group: THREE.Group
  anim: AnimStateMachine
}

type YBotProps = {
  /** Scene edit: static Mixamo bind pose, no animation. */
  tpose?: boolean
  onReady?: (handle: YBotHandle) => void
}

function prepareModel(source: THREE.Group): THREE.Group {
  const root = cloneSkinned(source) as THREE.Group
  root.scale.setScalar(ybotScale)
  root.position.set(...characterSpawn.position)
  root.rotation.y = characterSpawn.rotationY
  root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh
      mesh.castShadow = true
      mesh.receiveShadow = true
    }
  })
  root.updateMatrixWorld(true)
  const bounds = new THREE.Box3().setFromObject(root)
  if (Number.isFinite(bounds.min.y)) {
    root.position.y -= bounds.min.y
  }
  return root
}

function namedClip(group: THREE.Group, label: string): THREE.AnimationClip {
  const clip = group.animations[0]
  if (!clip) {
    throw new Error(`Missing animation clip in ${label}`)
  }
  const copy = clip.clone()
  copy.name = label
  return copy
}

function useModelRef(model: THREE.Group, ref: ForwardedRef<THREE.Group>): void {
  useEffect(() => {
    if (typeof ref === 'function') {
      ref(model)
    } else if (ref) {
      ref.current = model
    }
  }, [model, ref])
}

/** Static T-pose for Scene edit — mesh only, no clips. */
function YBotTPose({ forwardedRef }: { forwardedRef: ForwardedRef<THREE.Group> }) {
  const ybot = useFBX(fbxPaths.ybot)
  const model = useMemo(() => prepareModel(ybot), [ybot])
  useModelRef(model, forwardedRef)
  return <primitive object={model} />
}

/** Playable character with Idle / Walk / Run state machine. */
function YBotAnimated({
  forwardedRef,
  onReady
}: {
  forwardedRef: ForwardedRef<THREE.Group>
  onReady?: (handle: YBotHandle) => void
}) {
  const ybot = useFBX(fbxPaths.ybot)
  const idleFbx = useFBX(fbxPaths.idle)
  const walkFbx = useFBX(fbxPaths.walking)
  const runFbx = useFBX(fbxPaths.running)

  const model = useMemo(() => prepareModel(ybot), [ybot])
  const clips = useMemo(
    () => ({
      idle: bindClipToRig(namedClip(idleFbx, 'idle'), model),
      walk: bindClipToRig(namedClip(walkFbx, 'walk'), model),
      run: bindClipToRig(namedClip(runFbx, 'run'), model)
    }),
    [idleFbx, model, runFbx, walkFbx]
  )

  useModelRef(model, forwardedRef)

  useEffect(() => {
    const machine = new AnimStateMachine(model, clips)
    onReady?.({ group: model, anim: machine })
    return () => {
      machine.dispose()
    }
  }, [clips, model, onReady])

  return <primitive object={model} />
}

export const YBot = forwardRef<THREE.Group, YBotProps>(function YBot(
  { tpose = false, onReady },
  ref
) {
  if (tpose) {
    return <YBotTPose forwardedRef={ref} />
  }
  return <YBotAnimated forwardedRef={ref} onReady={onReady} />
})

useFBX.preload(fbxPaths.ybot)
useFBX.preload(fbxPaths.idle)
useFBX.preload(fbxPaths.walking)
useFBX.preload(fbxPaths.running)
