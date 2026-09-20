import { useSyncExternalStore } from 'react'

export type PlayMode = 'edit' | 'playing'

type Listener = () => void

let mode: PlayMode = 'edit'
const listeners = new Set<Listener>()

function emit(): void {
  listeners.forEach((listener) => listener())
}

export const playStore = {
  getMode(): PlayMode {
    return mode
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  play(): void {
    if (mode === 'playing') return
    mode = 'playing'
    emit()
  },
  stop(): void {
    if (mode === 'edit') return
    mode = 'edit'
    emit()
  }
}

export function usePlayMode(): PlayMode {
  return useSyncExternalStore(playStore.subscribe, playStore.getMode, playStore.getMode)
}
