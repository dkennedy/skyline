import {
  AnimationAction,
  AnimationClip,
  AnimationMixer,
  LoopRepeat,
  Object3D,
  MathUtils
} from 'three'

export type LocomotionState = 'idle' | 'walk' | 'run'

type Clips = {
  idle: AnimationClip
  walk: AnimationClip
  run: AnimationClip
}

const FADE = 0.2
const MOVE_EPS = 0.08

/**
 * Simple locomotion FSM with AnimationMixer crossfades.
 * Idle ↔ Walk ↔ Run based on planar speed and Shift (run).
 */
export class AnimStateMachine {
  readonly mixer: AnimationMixer
  private readonly actions: Record<LocomotionState, AnimationAction>
  private current: LocomotionState = 'idle'

  constructor(root: Object3D, clips: Clips) {
    this.mixer = new AnimationMixer(root)
    this.actions = {
      idle: this.mixer.clipAction(clips.idle),
      walk: this.mixer.clipAction(clips.walk),
      run: this.mixer.clipAction(clips.run)
    }

    ;(Object.keys(this.actions) as LocomotionState[]).forEach((key) => {
      const action = this.actions[key]
      action.enabled = true
      action.setLoop(LoopRepeat, Infinity)
      action.clampWhenFinished = false
      action.setEffectiveTimeScale(1)
      action.setEffectiveWeight(key === 'idle' ? 1 : 0)
      action.play()
    })
  }

  get state(): LocomotionState {
    return this.current
  }

  update(delta: number, planarSpeed: number, wantsRun: boolean): void {
    this.mixer.update(delta)

    let next: LocomotionState = 'idle'
    if (planarSpeed > MOVE_EPS) {
      next = wantsRun ? 'run' : 'walk'
    }

    if (next === 'walk') {
      this.actions.walk.setEffectiveTimeScale(MathUtils.clamp(planarSpeed / 2.2, 0.85, 1.25))
    } else if (next === 'run') {
      this.actions.run.setEffectiveTimeScale(MathUtils.clamp(planarSpeed / 5.5, 0.85, 1.2))
    }

    if (next !== this.current) {
      this.crossFade(next)
    }
  }

  private crossFade(next: LocomotionState): void {
    const from = this.actions[this.current]
    const to = this.actions[next]
    to.reset()
    to.setEffectiveWeight(1)
    to.fadeIn(FADE)
    from.fadeOut(FADE)
    this.current = next
  }

  dispose(): void {
    this.mixer.stopAllAction()
    this.mixer.uncacheRoot(this.mixer.getRoot())
  }
}
