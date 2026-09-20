import type { FunctionComponent } from 'react'
import type { IDockviewPanelProps } from 'dockview-react'
import { AgentPanel } from './AgentPanel'
import { AssetsPanel } from './AssetsPanel'
import { EnvironmentPanel } from './EnvironmentPanel'
import { GamePanel } from './GamePanel'
import { HierarchyPanel } from './HierarchyPanel'
import { MixerPanel } from './MixerPanel'
import { PlaceholderPanel } from './PlaceholderPanel'
import { PropertiesPanel } from './PropertiesPanel'
import { ScenePanel } from './ScenePanel'

export const panelComponents: Record<string, FunctionComponent<IDockviewPanelProps>> = {
  placeholder: PlaceholderPanel,
  scene: ScenePanel,
  game: GamePanel,
  hierarchy: HierarchyPanel,
  agent: AgentPanel,
  assets: AssetsPanel,
  mixer: MixerPanel,
  properties: PropertiesPanel,
  environment: EnvironmentPanel
}

export type PanelDefinition = {
  id: string
  title: string
  component?: keyof typeof panelComponents
}

export const defaultPanels = {
  left: [
    { id: 'hierarchy', title: 'Hierarchy', component: 'hierarchy' },
    { id: 'agent', title: 'Agent', component: 'agent' }
  ],
  centerTop: [
    { id: 'scene', title: 'Scene', component: 'scene' },
    { id: 'game', title: 'Game', component: 'game' }
  ],
  centerBottom: [
    { id: 'assets', title: 'Assets', component: 'assets' },
    { id: 'console', title: 'Console' },
    { id: 'mixer', title: 'Mixer', component: 'mixer' }
  ],
  right: [
    { id: 'properties', title: 'Properties', component: 'properties' },
    { id: 'environment', title: 'Environment', component: 'environment' }
  ]
} as const satisfies Record<string, PanelDefinition[]>

export function componentForPanel(panel: PanelDefinition): string {
  return panel.component ?? 'placeholder'
}
