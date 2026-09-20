/** Shared play-area dimensions used by the world mesh and player bounds. */
export const ARENA_SIZE = 40
export const ARENA_HALF = ARENA_SIZE / 2
export const WALL_HEIGHT = 5
export const WALL_THICKNESS = 0.5
/** Keep the player clear of wall faces. */
export const PLAYER_RADIUS = 0.45

export type ArenaCube = {
  position: [number, number, number]
  size: [number, number, number]
  color: string
}

function mulberry32(seed: number): () => number {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

const CUBE_COLORS = ['#c4c0bb', '#b0aca7', '#d0ccc6', '#9e9a95']

/** Deterministic prop layout so Scene and Game share the same cubes. */
export const ARENA_CUBES: ArenaCube[] = (() => {
  const rand = mulberry32(0xc0ffee)
  const cubes: ArenaCube[] = []
  const margin = 2.5
  const spawnClear = 3.5
  const max = ARENA_HALF - margin

  for (let i = 0; i < 12; i++) {
    let x = 0
    let z = 0
    let attempts = 0
    do {
      x = (rand() * 2 - 1) * max
      z = (rand() * 2 - 1) * max
      attempts++
    } while (Math.hypot(x, z) < spawnClear && attempts < 24)

    const w = 0.6 + rand() * 1.8
    const h = 0.5 + rand() * 2.4
    const d = 0.6 + rand() * 1.8
    cubes.push({
      position: [x, h / 2, z],
      size: [w, h, d],
      color: CUBE_COLORS[Math.floor(rand() * CUBE_COLORS.length)]!
    })
  }

  return cubes
})()

export function clampToArena(x: number, z: number): { x: number; z: number } {
  const limit = ARENA_HALF - WALL_THICKNESS / 2 - PLAYER_RADIUS
  return {
    x: Math.min(limit, Math.max(-limit, x)),
    z: Math.min(limit, Math.max(-limit, z))
  }
}
