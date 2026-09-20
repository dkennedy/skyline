import { activatePanel } from '../play/dockApi'
import { playStore, usePlayMode } from '../play/playStore'
import { ChevronRightIcon, MenuIcon, OverflowIcon, PlayIcon, StopIcon } from './icons'

export function Toolbar() {
  const playing = usePlayMode() === 'playing'

  const onTogglePlay = () => {
    if (playing) {
      playStore.stop()
      activatePanel('scene')
      return
    }
    playStore.play()
    activatePanel('game')
  }

  return (
    <div className="toolbar">
      <div className="toolbar__left">
        <button className="icon-button" type="button" aria-label="Menu">
          <MenuIcon />
        </button>
        <span className="toolbar__project">Skyline</span>
      </div>

      <div className="toolbar__center">
        <div className="play-bar">
          <button
            className="icon-button icon-button--play"
            type="button"
            aria-label={playing ? 'Stop' : 'Play'}
            aria-pressed={playing}
            onClick={onTogglePlay}
          >
            {playing ? <StopIcon /> : <PlayIcon />}
          </button>
          <button className="preview-chip" type="button">
            <span>Desktop</span>
            <ChevronRightIcon />
            <span className="preview-chip__status">
              {playing ? 'Running' : 'Ready to Preview'}
            </span>
          </button>
          <button className="icon-button icon-button--filled" type="button" aria-label="Preview options">
            <OverflowIcon />
          </button>
        </div>
      </div>

      <div className="toolbar__right">
        <div className="avatar" aria-hidden="true">
          DK
        </div>
        <button className="publish-button" type="button">
          Publish
        </button>
      </div>
    </div>
  )
}
