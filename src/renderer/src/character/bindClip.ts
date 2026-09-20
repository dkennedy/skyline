import { AnimationClip, type KeyframeTrack, type Object3D } from 'three'

function trackParts(trackName: string): { node: string; property: string } {
  const dot = trackName.lastIndexOf('.')
  const property = dot >= 0 ? trackName.slice(dot + 1) : trackName
  let node = dot >= 0 ? trackName.slice(0, dot) : trackName
  node = node.split('|').pop() ?? node
  node = node.split('/').pop() ?? node
  return { node, property }
}

function stripMixamo(name: string): string {
  return name.replace(/^mixamorig:?/i, '').toLowerCase()
}

/**
 * Rebind Mixamo animation tracks onto a target rig by matching bone names.
 * Animation FBX files often prefix bones differently than the mesh FBX.
 */
export function bindClipToRig(clip: AnimationClip, root: Object3D): AnimationClip {
  const names: string[] = []
  root.traverse((obj) => {
    if (obj.name) names.push(obj.name)
  })

  const byExact = new Map(names.map((name) => [name, name]))
  const byStripped = new Map(names.map((name) => [stripMixamo(name), name]))

  const tracks: KeyframeTrack[] = []
  for (const track of clip.tracks) {
    const { node, property } = trackParts(track.name)
    const resolved = byExact.get(node) ?? byStripped.get(stripMixamo(node))
    if (!resolved) continue
    const next = track.clone()
    next.name = `${resolved}.${property}`
    tracks.push(next)
  }

  if (tracks.length === 0) {
    console.warn(`No matching bones for clip "${clip.name}"; using original tracks`)
    return clip.clone()
  }

  return new AnimationClip(clip.name, clip.duration, tracks)
}
