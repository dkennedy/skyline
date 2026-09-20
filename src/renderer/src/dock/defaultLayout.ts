import type { DockviewApi, SerializedDockview } from 'dockview-react'
import { componentForPanel, defaultPanels, type PanelDefinition } from '../panels/registry'

export const LAYOUT_STORAGE_KEY = 'skyline.layout.v6'

/** Default width for left (Hierarchy/Agent) and right (Properties/Environment) panes. */
export const SIDE_PANEL_WIDTH = 320

function addTabGroup(
  api: DockviewApi,
  panels: readonly PanelDefinition[],
  position?: Parameters<DockviewApi['addPanel']>[0]['position'],
  size?: { initialWidth?: number; initialHeight?: number }
): void {
  panels.forEach((panel, index) => {
    api.addPanel({
      id: panel.id,
      component: componentForPanel(panel),
      title: panel.title,
      ...(index === 0
        ? { position, ...size }
        : {
            position: {
              direction: 'within',
              referencePanel: panels[0].id
            }
          })
    })
  })
}

export function applyDefaultLayout(api: DockviewApi): void {
  api.clear()

  addTabGroup(api, defaultPanels.left, undefined, { initialWidth: SIDE_PANEL_WIDTH })

  addTabGroup(
    api,
    defaultPanels.right,
    { direction: 'right', referencePanel: 'hierarchy' },
    { initialWidth: SIDE_PANEL_WIDTH }
  )

  addTabGroup(api, defaultPanels.centerTop, {
    direction: 'right',
    referencePanel: 'hierarchy'
  })

  addTabGroup(
    api,
    defaultPanels.centerBottom,
    { direction: 'below', referencePanel: 'scene' },
    { initialHeight: 288 }
  )

  // Lock side panes to the designed default width after the grid settles.
  api.getPanel('hierarchy')?.api.group.api.setSize({ width: SIDE_PANEL_WIDTH })
  api.getPanel('properties')?.api.group.api.setSize({ width: SIDE_PANEL_WIDTH })

  api.getPanel('hierarchy')?.api.setActive()
  api.getPanel('scene')?.api.setActive()
  api.getPanel('assets')?.api.setActive()
  api.getPanel('properties')?.api.setActive()
}

function setPanelComponent(data: SerializedDockview, panelId: string, component: string): void {
  const panel = data.panels?.[panelId]
  if (panel && 'contentComponent' in panel) {
    ;(panel as { contentComponent: string }).contentComponent = component
  }
}

function migrateLayout(data: SerializedDockview): SerializedDockview {
  setPanelComponent(data, 'scene', 'scene')
  setPanelComponent(data, 'game', 'game')
  setPanelComponent(data, 'hierarchy', 'hierarchy')
  setPanelComponent(data, 'agent', 'agent')
  setPanelComponent(data, 'assets', 'assets')
  setPanelComponent(data, 'mixer', 'mixer')
  setPanelComponent(data, 'properties', 'properties')
  setPanelComponent(data, 'environment', 'environment')
  return data
}

export function loadLayout(api: DockviewApi): void {
  // v6: Mixer panel; bottom tabs Assets / Console / Mixer (Output removed).
  const raw = localStorage.getItem(LAYOUT_STORAGE_KEY)
  if (raw) {
    try {
      const layout = migrateLayout(JSON.parse(raw) as SerializedDockview)
      api.fromJSON(layout)
      return
    } catch (error) {
      console.warn('Failed to restore dock layout, using default', error)
      localStorage.removeItem(LAYOUT_STORAGE_KEY)
    }
  }
  applyDefaultLayout(api)
}

export function persistLayout(api: DockviewApi): void {
  localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(api.toJSON()))
}

export function resetLayout(api: DockviewApi): void {
  localStorage.removeItem(LAYOUT_STORAGE_KEY)
  localStorage.removeItem('skyline.layout.v5')
  localStorage.removeItem('game-engine-tools.layout.v6')
  localStorage.removeItem('game-engine-tools.layout.v5')
  localStorage.removeItem('game-engine-tools.layout.v4')
  localStorage.removeItem('game-engine-tools.layout.v3')
  localStorage.removeItem('game-engine-tools.layout.v2')
  localStorage.removeItem('game-engine-tools.layout')
  applyDefaultLayout(api)
  persistLayout(api)
}
