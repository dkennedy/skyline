import type { DockviewApi } from 'dockview-react'

let dockApi: DockviewApi | null = null

export function setDockApi(api: DockviewApi | null): void {
  dockApi = api
}

export function activatePanel(panelId: string): void {
  dockApi?.getPanel(panelId)?.api.setActive()
}
