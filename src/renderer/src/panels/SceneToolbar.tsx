import { useState, type ReactNode } from 'react'
import { ChevronDownIcon } from './panelIcons'
import {
  MoveToolIcon,
  RotateToolIcon,
  ScaleToolIcon,
  SelectToolIcon
} from '../shell/sceneToolIcons'
import './scene-toolbar.css'

type SceneTool = 'select' | 'move' | 'rotate' | 'scale'

const TOOLS: Array<{ id: SceneTool; label: string; icon: ReactNode }> = [
  { id: 'select', label: 'Select', icon: <SelectToolIcon /> },
  { id: 'move', label: 'Move', icon: <MoveToolIcon /> },
  { id: 'rotate', label: 'Rotate', icon: <RotateToolIcon /> },
  { id: 'scale', label: 'Scale', icon: <ScaleToolIcon /> }
]

export function SceneToolbar() {
  const [tool, setTool] = useState<SceneTool>('select')

  return (
    <div className="scene-toolbar">
      <div className="scene-toolbar__tools">
        {TOOLS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`scene-toolbar__tool${tool === item.id ? ' scene-toolbar__tool--active' : ''}`}
            aria-label={item.label}
            aria-pressed={tool === item.id}
            onClick={() => setTool(item.id)}
          >
            {item.icon}
          </button>
        ))}
      </div>

      <div className="scene-toolbar__right">
        <button type="button" className="scene-toolbar__select">
          <span>Perspective</span>
          <ChevronDownIcon />
        </button>
        <button type="button" className="scene-toolbar__select">
          <span>Shaded</span>
          <ChevronDownIcon />
        </button>
      </div>
    </div>
  )
}
