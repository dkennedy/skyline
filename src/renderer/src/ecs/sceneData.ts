import { ARENA_CUBES } from '../scene/arena'
import { cameraStart } from '../scene/lighting'

export type Vec3 = { x: number; y: number; z: number }

export type TransformComponent = {
  type: 'transform'
  position: Vec3
  rotation: Vec3
  scale: Vec3
}

export type MeshComponent = {
  type: 'mesh'
}

export type AnimationComponent = {
  type: 'animation'
}

export type SoundComponent = {
  type: 'sound'
  soundType: string
  asset: string
  mixerOutput: string
}

export type EntityComponent =
  | TransformComponent
  | MeshComponent
  | AnimationComponent
  | SoundComponent

export type HierarchyNode = {
  id: string
  name: string
  children?: HierarchyNode[]
}

export type EntityRecord = {
  id: string
  name: string
  components: EntityComponent[]
}

function vec3(x: number, y: number, z: number): Vec3 {
  return { x, y, z }
}

function transform(
  position: Vec3,
  rotation: Vec3 = vec3(0, 0, 0),
  scale: Vec3 = vec3(1, 1, 1)
): TransformComponent {
  return { type: 'transform', position, rotation, scale }
}

const cubeNodes: HierarchyNode[] = ARENA_CUBES.map((_, index) => ({
  id: `cube-${index + 1}`,
  name: `Cube ${index + 1}`
}))

/** Scene hierarchy shown in the Hierarchy panel. */
export const SCENE_TREE: HierarchyNode[] = [
  { id: 'camera', name: 'Camera' },
  { id: 'player', name: 'Player' },
  {
    id: 'cubes',
    name: 'Cubes',
    children: cubeNodes
  },
  {
    id: 'surface',
    name: 'Surface',
    children: [
      { id: 'floor', name: 'Floor' },
      { id: 'walls', name: 'Walls' }
    ]
  }
]

const ENTITIES: Record<string, EntityRecord> = {
  camera: {
    id: 'camera',
    name: 'Camera',
    components: [
      transform(
        vec3(cameraStart.position.x, cameraStart.position.y, cameraStart.position.z),
        vec3(0, 0, 0)
      )
    ]
  },
  player: {
    id: 'player',
    name: 'Player',
    components: [
      transform(vec3(0, 0, 0)),
      { type: 'mesh' },
      { type: 'animation' },
      {
        type: 'sound',
        soundType: 'Spatial',
        asset: 'Engine.wav',
        mixerOutput: 'VFX'
      }
    ]
  },
  cubes: {
    id: 'cubes',
    name: 'Cubes',
    components: [transform(vec3(0, 0, 0))]
  },
  surface: {
    id: 'surface',
    name: 'Surface',
    components: [transform(vec3(0, 0, 0))]
  },
  floor: {
    id: 'floor',
    name: 'Floor',
    components: [transform(vec3(0, 0, 0)), { type: 'mesh' }]
  },
  walls: {
    id: 'walls',
    name: 'Walls',
    components: [transform(vec3(0, 0, 0)), { type: 'mesh' }]
  }
}

ARENA_CUBES.forEach((cube, index) => {
  const id = `cube-${index + 1}`
  const [x, y, z] = cube.position
  const [sx, sy, sz] = cube.size
  ENTITIES[id] = {
    id,
    name: `Cube ${index + 1}`,
    components: [
      transform(vec3(x, y, z), vec3(0, 0, 0), vec3(sx, sy, sz)),
      { type: 'mesh' }
    ]
  }
})

export function getEntity(id: string | null): EntityRecord | null {
  if (!id) return null
  return ENTITIES[id] ?? null
}

export function findEntityName(id: string | null): string | null {
  return getEntity(id)?.name ?? null
}
