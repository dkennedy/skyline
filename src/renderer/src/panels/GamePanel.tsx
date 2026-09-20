import type { IDockviewPanelProps } from 'dockview-react'
import { usePlayMode } from '../play/playStore'
import { GameViewport } from '../scene/GameViewport'
import './scene-panel.css'

export function GamePanel(_props: IDockviewPanelProps) {
  const playing = usePlayMode() === 'playing'

  return (
    <div className="scene-panel">
      {playing ? (
        <GameViewport />
      ) : (
        <div className="placeholder-panel">
          <div className="placeholder-panel__title">Game</div>
          <div className="placeholder-panel__hint">Press Play to control the character</div>
        </div>
      )}
      {playing ? (
        <div className="scene-panel__hint" aria-hidden="true">
          LMB/RMB look · WASD move · Shift run
        </div>
      ) : null}
    </div>
  )
}
