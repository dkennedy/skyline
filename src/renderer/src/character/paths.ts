/** Served from src/renderer/public/fbx via Vite publicDir. */
export const fbxPaths = {
  ybot: '/fbx/ybot.fbx',
  idle: '/fbx/idle.fbx',
  walking: '/fbx/walking.fbx',
  running: '/fbx/running.fbx'
} as const

/** Mixamo FBX is authored in centimeters. */
export const ybotScale = 0.01

export const characterSpawn = {
  position: [0, 0, 0] as [number, number, number],
  rotationY: 0
}
