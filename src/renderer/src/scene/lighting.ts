import * as THREE from 'three'

/** Soft fill — kept modest so skybox IBL can carry most of the tint. */
export const ambientLight = {
  color: '#ffffff',
  intensity: 0.2
} as const

/** Main sun — modest so the HDRI carries most of the illumination. */
export const sunLight = {
  color: '#ffffff',
  intensity: 0.55,
  position: new THREE.Vector3(-40, 28, -10),
  target: new THREE.Vector3(0, 0, 0)
} as const

/** Opposite fill for grid readability in shadow. */
export const fillLight = {
  color: '#ffffff',
  intensity: 0.15,
  position: new THREE.Vector3(30, 12, 40)
} as const

/** How strongly MeshStandard materials sample the sky PMREM. */
export const skyEnvironmentIntensity = 1

/** Shared yaw so background and IBL stay aligned. */
export const skyRotationY = 0

export const cameraStart = {
  position: new THREE.Vector3(6, 3.5, 12),
  target: new THREE.Vector3(0, 1.25, 0),
  fov: 60,
  near: 0.1,
  far: 2500
} as const

export const flySpeeds = {
  normal: 8,
  fast: 20,
  lookSensitivity: 0.0022,
  orbitSensitivity: 0.005,
  panSensitivity: 0.01,
  zoomSensitivity: 0.002
} as const
