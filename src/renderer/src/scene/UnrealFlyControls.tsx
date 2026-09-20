import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { cameraStart, flySpeeds } from './lighting'

type Keys = Set<string>

/**
 * Unreal-style edit camera:
 * - RMB + mouse: look
 * - RMB + WASD / QE: fly (Shift = fast)
 * - MMB drag: pan
 * - Alt + LMB drag: orbit around pivot
 * - Scroll: dolly toward pivot
 */
export function UnrealFlyControls() {
  const { camera, gl } = useThree()
  const keys = useRef<Keys>(new Set())
  const buttons = useRef({ left: false, middle: false, right: false })
  const altHeld = useRef(false)
  const pivot = useRef(cameraStart.target.clone())
  const spherical = useRef(new THREE.Spherical())
  const lookEuler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      camera.position.copy(cameraStart.position)
      camera.lookAt(cameraStart.target)
      lookEuler.current.setFromQuaternion(camera.quaternion)
      spherical.current.setFromVector3(camera.position.clone().sub(pivot.current))
      initialized.current = true
    }
  }, [camera])

  useEffect(() => {
    const el = gl.domElement

    const onContextMenu = (event: MouseEvent) => {
      event.preventDefault()
    }

    const onPointerDown = (event: PointerEvent) => {
      el.focus()
      if (event.button === 0) buttons.current.left = true
      if (event.button === 1) buttons.current.middle = true
      if (event.button === 2) buttons.current.right = true
      el.setPointerCapture(event.pointerId)
    }

    const onPointerUp = (event: PointerEvent) => {
      if (event.button === 0) buttons.current.left = false
      if (event.button === 1) buttons.current.middle = false
      if (event.button === 2) buttons.current.right = false
      if (el.hasPointerCapture(event.pointerId)) {
        el.releasePointerCapture(event.pointerId)
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      const dx = event.movementX
      const dy = event.movementY
      if (dx === 0 && dy === 0) return

      const { left, middle, right } = buttons.current

      // Orbit: Alt + LMB
      if (altHeld.current && left) {
        spherical.current.setFromVector3(camera.position.clone().sub(pivot.current))
        spherical.current.theta -= dx * flySpeeds.orbitSensitivity
        spherical.current.phi -= dy * flySpeeds.orbitSensitivity
        spherical.current.phi = THREE.MathUtils.clamp(spherical.current.phi, 0.05, Math.PI - 0.05)
        const offset = new THREE.Vector3().setFromSpherical(spherical.current)
        camera.position.copy(pivot.current).add(offset)
        camera.lookAt(pivot.current)
        lookEuler.current.setFromQuaternion(camera.quaternion)
        return
      }

      // Pan: MMB
      if (middle) {
        const rightDir = new THREE.Vector3()
        const upDir = new THREE.Vector3()
        camera.getWorldDirection(new THREE.Vector3())
        rightDir.setFromMatrixColumn(camera.matrix, 0).normalize()
        upDir.setFromMatrixColumn(camera.matrix, 1).normalize()
        const distance = camera.position.distanceTo(pivot.current)
        const panScale = Math.max(distance, 1) * flySpeeds.panSensitivity
        const delta = rightDir.multiplyScalar(-dx * panScale).add(upDir.multiplyScalar(dy * panScale))
        camera.position.add(delta)
        pivot.current.add(delta)
        return
      }

      // Look: RMB
      if (right) {
        lookEuler.current.setFromQuaternion(camera.quaternion)
        lookEuler.current.y -= dx * flySpeeds.lookSensitivity
        lookEuler.current.x -= dy * flySpeeds.lookSensitivity
        lookEuler.current.x = THREE.MathUtils.clamp(lookEuler.current.x, -Math.PI / 2 + 0.01, Math.PI / 2 - 0.01)
        camera.quaternion.setFromEuler(lookEuler.current)
      }
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const direction = new THREE.Vector3().subVectors(pivot.current, camera.position)
      const distance = direction.length()
      if (distance < 0.001) return
      direction.normalize()
      const step = event.deltaY * flySpeeds.zoomSensitivity * Math.max(distance, 1)
      const nextDistance = THREE.MathUtils.clamp(distance + step, 0.5, 500)
      camera.position.copy(pivot.current).addScaledVector(direction, -nextDistance)
      lookEuler.current.setFromQuaternion(camera.quaternion)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'AltLeft' || event.code === 'AltRight') {
        altHeld.current = true
      }
      keys.current.add(event.code)
    }

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'AltLeft' || event.code === 'AltRight') {
        altHeld.current = false
      }
      keys.current.delete(event.code)
    }

    const onBlur = () => {
      keys.current.clear()
      buttons.current = { left: false, middle: false, right: false }
      altHeld.current = false
    }

    el.tabIndex = 0
    el.addEventListener('contextmenu', onContextMenu)
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointercancel', onPointerUp)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)

    return () => {
      el.removeEventListener('contextmenu', onContextMenu)
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointercancel', onPointerUp)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [camera, gl])

  useFrame((_, delta) => {
    if (!buttons.current.right) return

    const speed = (keys.current.has('ShiftLeft') || keys.current.has('ShiftRight')
      ? flySpeeds.fast
      : flySpeeds.normal) * delta

    const forward = new THREE.Vector3()
    const right = new THREE.Vector3()
    const up = new THREE.Vector3(0, 1, 0)
    camera.getWorldDirection(forward)
    forward.normalize()
    right.crossVectors(forward, up).normalize()

    const move = new THREE.Vector3()
    if (keys.current.has('KeyW')) move.add(forward)
    if (keys.current.has('KeyS')) move.sub(forward)
    if (keys.current.has('KeyD')) move.add(right)
    if (keys.current.has('KeyA')) move.sub(right)
    if (keys.current.has('KeyE')) move.add(up)
    if (keys.current.has('KeyQ')) move.sub(up)

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(speed)
      camera.position.add(move)
      pivot.current.add(move)
    }
  })

  return null
}
