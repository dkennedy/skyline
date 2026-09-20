import { useSyncExternalStore } from 'react'

type Listener = () => void

let selectedEntityId: string | null = 'player'
const listeners = new Set<Listener>()

function emit(): void {
  listeners.forEach((listener) => listener())
}

export const selectionStore = {
  getSelectedId(): string | null {
    return selectedEntityId
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  select(id: string | null): void {
    if (selectedEntityId === id) return
    selectedEntityId = id
    emit()
  }
}

export function useSelectedEntityId(): string | null {
  return useSyncExternalStore(
    selectionStore.subscribe,
    selectionStore.getSelectedId,
    selectionStore.getSelectedId
  )
}
