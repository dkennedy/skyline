import { useRef } from 'react'
import {
  DockviewDefaultTab,
  DockviewReact,
  themeDark,
  type DockviewApi,
  type DockviewReadyEvent,
  type IDockviewPanelHeaderProps
} from 'dockview-react'
import { panelComponents } from '../panels/registry'
import { setDockApi } from '../play/dockApi'
import { loadLayout, persistLayout } from './defaultLayout'
import { TabOverflow } from './TabOverflow'
import 'dockview-react/dist/styles/dockview.css'
import './theme.css'

function EditorTab(props: IDockviewPanelHeaderProps) {
  return <DockviewDefaultTab {...props} hideClose />
}

export function Workspace() {
  const apiRef = useRef<DockviewApi | null>(null)
  const applyingLayout = useRef(false)

  const onReady = (event: DockviewReadyEvent) => {
    apiRef.current = event.api
    setDockApi(event.api)
    applyingLayout.current = true
    loadLayout(event.api)
    applyingLayout.current = false

    event.api.onDidLayoutFromJSON(() => {
      applyingLayout.current = true
      queueMicrotask(() => {
        applyingLayout.current = false
      })
    })

    event.api.onDidLayoutChange(() => {
      if (applyingLayout.current || !apiRef.current) return
      persistLayout(apiRef.current)
    })
  }

  return (
    <div className="workspace">
      <DockviewReact
        className="workspace__dock"
        theme={themeDark}
        components={panelComponents}
        defaultTabComponent={EditorTab}
        onReady={onReady}
        rightHeaderActionsComponent={TabOverflow}
        disableFloatingGroups={false}
      />
    </div>
  )
}
