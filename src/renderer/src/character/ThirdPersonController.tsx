import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { AnimStateMachine } from './AnimStateMachine'
import { clampToArena } from '../scene/arena'

const WALK_SPEED = 2.4
const RUN_SPEED = 5.8
const TURN_SPEED = 10
const LOOK_SENS = 0.0022
const PITCH_MIN = -0.55
const PITCH_MAX = 0.85
const ARM_LENGTH = 4.2
const ARM_HEIGHT = 1.55
const LOOK_AT_HEIGHT = 1.4
const CAM_FOLLOW = 12

type ThirdPersonControllerProps = {
  character: THREE.Group | null
  anim: AnimStateMachine | null
}

/**
 * Unreal-style TPS: camera-relative WASD, Shift to run, mouse orbits follow camera.
 */
export function ThirdPersonController({ character, anim }: ThirdPersonControllerProps) {
  const { camera, gl } = useThree()
  const keys = useRef(new Set<string>())
  const yaw = useRef(0)
  const pitch = useRef(0.22)
  const pointerDown = useRef(false)
  const initialized = useRef(false)
  const forward = useRef(new THREE.Vector3())
  const right = useRef(new THREE.Vector3())
  const move = useRef(new THREE.Vector3())
  const camPos = useRef(new THREE.Vector3())
  const lookAt = useRef(new THREE.Vector3())

  useEffect(() => {
    initialized.current = false
  }, [character])

  useEffect(() => {
    const el = gl.domElement

    const onKeyDown = (event: KeyboardEvent) => {
      keys.current.add(event.code)
    }
    const onKeyUp = (event: KeyboardEvent) => {
      keys.current.delete(event.code)
    }
    const onPointerDown = (event: PointerEvent) => {
      if (event.button === 0 || event.button === 2) {
        pointerDown.current = true
        el.setPointerCapture(event.pointerId)
        el.focus()
      }
    }
    const onPointerUp = (event: PointerEvent) => {
      pointerDown.current = false
      if (el.hasPointerCapture(event.pointerId)) {
        el.releasePointerCapture(event.pointerId)
      }
    }
    const onPointerMove = (event: PointerEvent) => {
      if (!pointerDown.current) return
      yaw.current -= event.movementX * LOOK_SENS
      pitch.current = THREE.MathUtils.clamp(
        pitch.current - event.movementY * LOOK_SENS,
        PITCH_MIN,
        PITCH_MAX
      )
    }
    const onContextMenu = (event: MouseEvent) => {
      event.preventDefault()
    }
    const onBlur = () => {
      keys.current.clear()
      pointerDown.current = false
    }

    el.tabIndex = 0
    el.focus()
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointercancel', onPointerUp)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('contextmenu', onContextMenu)
    window.addEventListener('blur', onBlur)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointercancel', onPointerUp)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('contextmenu', onContextMenu)
      window.removeEventListener('blur', onBlur)
    }
  }, [gl])

  useFrame((_, delta) => {
    if (!character || !anim) return

    if (!initialized.current) {
      yaw.current = character.rotation.y
      initialized.current = true
    }

    const wantsRun = keys.current.has('ShiftLeft') || keys.current.has('ShiftRight')
    const speed = wantsRun ? RUN_SPEED : WALK_SPEED

    // yaw = camera facing on XZ. Mixamo default forward is +Z (yaw 0).
    forward.current.set(Math.sin(yaw.current), 0, Math.cos(yaw.current))
    // Camera-relative right (screen-right when looking along forward).
    right.current.set(-forward.current.z, 0, forward.current.x)

    move.current.set(0, 0, 0)
    if (keys.current.has('KeyW')) move.current.add(forward.current)
    if (keys.current.has('KeyS')) move.current.sub(forward.current)
    if (keys.current.has('KeyD')) move.current.add(right.current)
    if (keys.current.has('KeyA')) move.current.sub(right.current)

    let planarSpeed = 0
    if (move.current.lengthSq() > 0) {
      move.current.normalize()
      planarSpeed = speed
      character.position.addScaledVector(move.current, speed * delta)
      const targetYaw = Math.atan2(move.current.x, move.current.z)
      character.rotation.y = THREE.MathUtils.damp(character.rotation.y, targetYaw, TURN_SPEED, delta)
    }

    // Keep the player inside the walled arena.
    const clamped = clampToArena(character.position.x, character.position.z)
    character.position.x = clamped.x
    character.position.z = clamped.z

    anim.update(delta, planarSpeed, wantsRun)

    const lookX = Math.sin(yaw.current)
    const lookZ = Math.cos(yaw.current)
    camPos.current.set(
      character.position.x - lookX * ARM_LENGTH,
      character.position.y + ARM_HEIGHT + pitch.current * 2.2,
      character.position.z - lookZ * ARM_LENGTH
    )
    camera.position.lerp(camPos.current, 1 - Math.exp(-CAM_FOLLOW * delta))

    lookAt.current.copy(character.position)
    lookAt.current.y += LOOK_AT_HEIGHT
    camera.lookAt(lookAt.current)
  })

  return null
}
