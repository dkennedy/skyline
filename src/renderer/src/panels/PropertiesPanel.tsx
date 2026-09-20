import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { IDockviewPanelProps } from 'dockview-react'
import {
  getEntity,
  type EntityComponent,
  type SoundComponent,
  type TransformComponent,
  type Vec3
} from '../ecs/sceneData'
import { useSelectedEntityId } from '../ecs/selectionStore'
import {
  AnimationIcon,
  AssetPickerIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  EntityIcon,
  MeshIcon,
  OverflowDotsIcon,
  SoundIcon,
  SoundLoopIcon,
  SoundPlayIcon,
  SoundStopIcon,
  TransformIcon
} from './panelIcons'
import './properties-panel.css'

/** Waveform bar heights from Figma (node 232:749). */
const WAVEFORM_HEIGHTS = [
  20, 14, 30, 20, 10, 4, 14, 20, 26, 20, 24, 14, 8, 4, 6, 18, 22, 16, 24, 30, 32, 22, 16, 12, 6, 2, 4,
  6, 4, 20, 14, 30, 20, 10, 4, 14, 20, 26, 20, 24, 14, 8, 4, 6, 18, 22, 16, 24, 16, 6, 8, 16, 12, 6,
  2, 4, 6, 4, 12, 8, 4, 10, 16, 6, 14, 8, 4, 8, 14, 4, 8
]

function formatAxis(value: number): string {
  return Number.isInteger(value) ? value.toFixed(1) : String(value)
}

function Vec3Fields({ value }: { value: Vec3 }) {
  const axes = ['X', 'Y', 'Z'] as const
  const keys: Array<keyof Vec3> = ['x', 'y', 'z']
  return (
    <div className="prop-vec3">
      {keys.map((key, index) => (
        <label key={key} className="prop-axis-input">
          <span className="prop-axis-input__axis">{axes[index]}</span>
          <input
            className="prop-axis-input__value"
            type="text"
            defaultValue={formatAxis(value[key])}
            spellCheck={false}
          />
        </label>
      ))}
    </div>
  )
}

function FieldRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="prop-field-row">
      <div className="prop-field-row__label">{label}</div>
      <div className="prop-field-row__field">{children}</div>
    </div>
  )
}

function ComponentHeader({
  title,
  icon,
  expanded,
  onToggle
}: {
  title: string
  icon: ReactNode
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <div className="prop-component__header">
      <button type="button" className="prop-component__toggle" onClick={onToggle}>
        {expanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
        <span className="prop-component__icon">{icon}</span>
        <span className="prop-component__title">{title}</span>
      </button>
      <button type="button" className="prop-component__overflow" aria-label={`${title} options`}>
        <OverflowDotsIcon />
      </button>
    </div>
  )
}

function TransformBody({ component }: { component: TransformComponent }) {
  return (
    <div className="prop-component__body">
      <FieldRow label="Position">
        <Vec3Fields value={component.position} />
      </FieldRow>
      <FieldRow label="Rotation">
        <Vec3Fields value={component.rotation} />
      </FieldRow>
      <FieldRow label="Scale">
        <Vec3Fields value={component.scale} />
      </FieldRow>
    </div>
  )
}

function SoundBody({ component }: { component: SoundComponent }) {
  return (
    <div className="prop-component__body">
      <div className="prop-waveform" aria-hidden="true">
        {WAVEFORM_HEIGHTS.map((height, index) => (
          <span key={index} className="prop-waveform__bar" style={{ height }} />
        ))}
      </div>
      <div className="prop-sound-transport">
        <button type="button" className="prop-icon-btn" aria-label="Play sound">
          <SoundPlayIcon />
        </button>
        <button type="button" className="prop-icon-btn" aria-label="Stop sound">
          <SoundStopIcon />
        </button>
        <button type="button" className="prop-icon-btn" aria-label="Loop sound">
          <SoundLoopIcon />
        </button>
      </div>
      <FieldRow label="Type">
        <div className="prop-select">
          <span>{component.soundType}</span>
          <ChevronDownIcon />
        </div>
      </FieldRow>
      <FieldRow label="Asset">
        <div className="prop-select">
          <span>{component.asset}</span>
          <AssetPickerIcon />
        </div>
      </FieldRow>
      <FieldRow label="Mixer Output">
        <div className="prop-select">
          <span>{component.mixerOutput}</span>
          <ChevronDownIcon />
        </div>
      </FieldRow>
    </div>
  )
}

function ComponentBlock({
  component,
  expanded,
  onToggle
}: {
  component: EntityComponent
  expanded: boolean
  onToggle: () => void
}) {
  if (component.type === 'transform') {
    return (
      <section className="prop-component">
        <ComponentHeader
          title="Transform"
          icon={<TransformIcon />}
          expanded={expanded}
          onToggle={onToggle}
        />
        {expanded ? <TransformBody component={component} /> : null}
      </section>
    )
  }

  if (component.type === 'mesh') {
    return (
      <section className="prop-component">
        <ComponentHeader title="Mesh" icon={<MeshIcon />} expanded={expanded} onToggle={onToggle} />
      </section>
    )
  }

  if (component.type === 'animation') {
    return (
      <section className="prop-component">
        <ComponentHeader
          title="Animation"
          icon={<AnimationIcon />}
          expanded={expanded}
          onToggle={onToggle}
        />
      </section>
    )
  }

  return (
    <section className="prop-component">
      <ComponentHeader title="Sound" icon={<SoundIcon />} expanded={expanded} onToggle={onToggle} />
      {expanded ? <SoundBody component={component} /> : null}
    </section>
  )
}

export function PropertiesPanel(_props: IDockviewPanelProps) {
  const selectedId = useSelectedEntityId()
  const entity = useMemo(() => getEntity(selectedId), [selectedId])
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    transform: true,
    mesh: false,
    animation: false,
    sound: true
  })
  const [nameDraft, setNameDraft] = useState<string | null>(null)

  useEffect(() => {
    setNameDraft(null)
  }, [selectedId])

  const displayName = nameDraft ?? entity?.name ?? ''

  const toggle = (type: string) => {
    setExpanded((prev) => ({ ...prev, [type]: !prev[type] }))
  }

  if (!entity) {
    return (
      <div className="properties-panel properties-panel--empty">
        <div className="properties-panel__empty">Select an entity in Hierarchy</div>
      </div>
    )
  }

  return (
    <div className="properties-panel">
      <div className="properties-panel__entity">
        <EntityIcon />
        <input
          className="properties-panel__name"
          type="text"
          value={displayName}
          onChange={(event) => setNameDraft(event.target.value)}
          onBlur={() => setNameDraft(null)}
          spellCheck={false}
          aria-label="Entity name"
        />
      </div>

      <div className="properties-panel__components">
        {entity.components.map((component) => (
          <ComponentBlock
            key={component.type}
            component={component}
            expanded={expanded[component.type] ?? false}
            onToggle={() => toggle(component.type)}
          />
        ))}
      </div>

      <div className="properties-panel__footer">
        <button type="button" className="properties-panel__add">
          Add Component
        </button>
      </div>
    </div>
  )
}
