import { Environment, Grid } from '@react-three/drei'
import { DoubleSide } from 'three'
import { publicUrl } from '../assets/publicUrl'
import {
  ARENA_CUBES,
  ARENA_HALF,
  ARENA_SIZE,
  WALL_HEIGHT,
  WALL_THICKNESS
} from './arena'
import {
  ambientLight,
  fillLight,
  skyEnvironmentIntensity,
  skyRotationY,
  sunLight
} from './lighting'

const SKY_HDR = publicUrl('sky/autumn_field_puresky_2k.hdr')
const SURFACE_COLOR = '#d4d4d4'

/** Shared with floor + wall Grid so they match exactly. */
const GRID_PROPS = {
  cellSize: 1,
  sectionSize: 10,
  cellThickness: 0.6,
  sectionThickness: 1,
  cellColor: '#6a6a6a',
  sectionColor: '#8a8a8a'
} as const

/**
 * drei's infinite Grid scales a unit plane by (1 + fadeDistance), so the mesh
 * half-extent is ~fadeDistance / 2. Cover the arena and fade just past the rim.
 */
const GRID_FADE_DISTANCE = ARENA_SIZE * 1.25

function SkyBackground() {
  return (
    <Environment
      files={SKY_HDR}
      background
      backgroundIntensity={0.55}
      environmentIntensity={skyEnvironmentIntensity}
      backgroundRotation={[0, skyRotationY, 0]}
      environmentRotation={[0, skyRotationY, 0]}
    />
  )
}

function Lights() {
  return (
    <>
      <ambientLight color={ambientLight.color} intensity={ambientLight.intensity} />
      <directionalLight
        color={sunLight.color}
        intensity={sunLight.intensity}
        position={sunLight.position.toArray()}
      />
      <directionalLight
        color={fillLight.color}
        intensity={fillLight.intensity}
        position={fillLight.position.toArray()}
      />
    </>
  )
}

function EditorGrid() {
  // No mesh rotation: drei's Grid shader remaps XY → XZ (horizontal ground).
  return (
    <Grid
      infiniteGrid
      fadeDistance={GRID_FADE_DISTANCE}
      fadeStrength={1}
      {...GRID_PROPS}
      position={[0, 0, 0]}
    />
  )
}

function ArenaWalls() {
  const y = WALL_HEIGHT / 2
  const h = WALL_HEIGHT
  const s = ARENA_SIZE
  const edge = ARENA_HALF - WALL_THICKNESS

  const walls: Array<{
    position: [number, number, number]
    rotation: [number, number, number]
  }> = [
    { position: [0, y, -edge], rotation: [0, 0, 0] },
    { position: [0, y, edge], rotation: [0, Math.PI, 0] },
    { position: [-edge, y, 0], rotation: [0, Math.PI / 2, 0] },
    { position: [edge, y, 0], rotation: [0, -Math.PI / 2, 0] }
  ]

  return (
    <group name="arena-walls">
      {walls.map((wall, index) => (
        <group key={index} position={wall.position} rotation={wall.rotation}>
          {/* Solid wall face */}
          <mesh castShadow={false} receiveShadow={false}>
            <planeGeometry args={[s, h]} />
            <meshStandardMaterial
              color={SURFACE_COLOR}
              roughness={1}
              metalness={0}
              side={DoubleSide}
            />
          </mesh>
          {/*
            Grid's shader remaps the plane onto XZ. Rotate -90° around X so it
            stands upright on the wall, matching the floor's line style.
          */}
          <Grid
            args={[s, h]}
            infiniteGrid={false}
            fadeDistance={200}
            fadeStrength={1}
            side={DoubleSide}
            {...GRID_PROPS}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0, 0.02]}
          />
        </group>
      ))}
    </group>
  )
}

function ArenaCubes() {
  return (
    <group name="arena-cubes">
      {ARENA_CUBES.map((cube, index) => (
        <mesh key={index} position={cube.position} castShadow={false} receiveShadow={false}>
          <boxGeometry args={cube.size} />
          <meshStandardMaterial color={cube.color} roughness={0.88} metalness={0.04} />
        </mesh>
      ))}
    </group>
  )
}

export function DefaultWorld() {
  return (
    <>
      <SkyBackground />
      <Lights />
      <EditorGrid />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow={false}>
        <planeGeometry args={[ARENA_SIZE, ARENA_SIZE]} />
        <meshStandardMaterial color={SURFACE_COLOR} roughness={1} metalness={0} />
      </mesh>
      <ArenaWalls />
      <ArenaCubes />
    </>
  )
}
