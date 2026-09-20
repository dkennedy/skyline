import { useEffect, useState } from 'react'
import type { IDockviewPanelProps } from 'dockview-react'
import { usePlayMode } from '../play/playStore'
import { SceneViewport } from '../scene/SceneViewport'
import { SceneToolbar } from './SceneToolbar'
import './scene-panel.css'

export function ScenePanel(props: IDockviewPanelProps) {
  // Mount the WebGL canvas only while this tab is showing in its group.
  const [visible, setVisible] = useState(props.api.isVisible)
  const playing = usePlayMode() === 'playing'
  const showScene = visible && !playing

  useEffect(() => {
    setVisible(props.api.isVisible)
    const disposable = props.api.onDidVisibilityChange(({ isVisible }) => {
      setVisible(isVisible)
    })
    return () => disposable.dispose()
  }, [props.api])

  return (
    <div className="scene-panel">
      {showScene ? <SceneToolbar /> : null}
      {showScene ? <SceneViewport /> : null}
      {showScene ? (
        <div className="scene-panel__hint" aria-hidden="true">
          RMB look · WASD fly · Q/E up/down · Shift fast · MMB pan · Alt+LMB orbit
        </div>
      ) : null}
      {visible && playing ? (
        <div className="placeholder-panel">
          <div className="placeholder-panel__title">Scene paused</div>
          <div className="placeholder-panel__hint">Press Stop to return to the edit viewport</div>
        </div>
      ) : null}
    </div>
  )
}
