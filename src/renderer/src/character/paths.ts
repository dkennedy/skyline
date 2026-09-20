import { publicUrl } from '../assets/publicUrl'

/** Served from src/renderer/public/fbx via Vite publicDir. */
export const fbxPaths = {
  ybot: publicUrl('fbx/ybot.fbx'),
  idle: publicUrl('fbx/idle.fbx'),
  walking: publicUrl('fbx/walking.fbx'),
  running: publicUrl('fbx/running.fbx')
} as const

/** Mixamo FBX is authored in centimeters. */
export const ybotScale = 0.01

export const characterSpawn = {
  position: [0, 0, 0] as [number, number, number],
  rotationY: 0
}
