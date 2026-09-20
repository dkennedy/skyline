import type { IDockviewPanelProps } from 'dockview-react'

export function PlaceholderPanel(props: IDockviewPanelProps) {
  return (
    <div className="placeholder-panel">
      <div className="placeholder-panel__title">{props.api.title}</div>
      <div className="placeholder-panel__hint">Placeholder — panel tools come later</div>
    </div>
  )
}
