import { useState } from 'react'
import type { IDockviewPanelProps } from 'dockview-react'
import { ChevronDownIcon, ChevronRightIcon, EntityIcon } from './panelIcons'
import './assets-panel.css'

type AssetNode = {
  id: string
  name: string
  kind: 'folder' | 'file'
  children?: AssetNode[]
}

const PROJECT_TREE: AssetNode[] = [
  {
    id: 'assets',
    name: 'Assets',
    kind: 'folder',
    children: [
      {
        id: 'fbx',
        name: 'fbx',
        kind: 'folder',
        children: [
          { id: 'ybot', name: 'ybot.fbx', kind: 'file' },
          { id: 'idle', name: 'idle.fbx', kind: 'file' },
          { id: 'walking', name: 'walking.fbx', kind: 'file' },
          { id: 'running', name: 'running.fbx', kind: 'file' }
        ]
      },
      {
        id: 'hdri',
        name: 'HDRI',
        kind: 'folder',
        children: [{ id: 'autumn', name: 'autumn_field_puresky_2k.hdr', kind: 'file' }]
      },
      {
        id: 'scenes',
        name: 'Scenes',
        kind: 'folder',
        children: [{ id: 'main-scene', name: 'Main.scene', kind: 'file' }]
      }
    ]
  }
]

function AssetRow({
  node,
  depth,
  expanded,
  selectedId,
  onToggle,
  onSelect
}: {
  node: AssetNode
  depth: number
  expanded: Set<string>
  selectedId: string | null
  onToggle: (id: string) => void
  onSelect: (id: string) => void
}) {
  const hasChildren = node.kind === 'folder' && (node.children?.length ?? 0) > 0
  const isExpanded = expanded.has(node.id)

  return (
    <>
      <div
        className={`assets-row${selectedId === node.id ? ' assets-row--selected' : ''}`}
        style={{ paddingLeft: 8 + depth * 16 }}
        role="treeitem"
        aria-selected={selectedId === node.id}
        aria-expanded={node.kind === 'folder' ? isExpanded : undefined}
        tabIndex={0}
        onClick={() => onSelect(node.id)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onSelect(node.id)
          }
        }}
      >
        {node.kind === 'folder' ? (
          <button
            type="button"
            className="assets-row__chevron"
            onClick={(event) => {
              event.stopPropagation()
              onToggle(node.id)
            }}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
          </button>
        ) : (
          <span className="assets-row__spacer" aria-hidden="true" />
        )}
        <EntityIcon />
        <span className="assets-row__label">{node.name}</span>
      </div>
      {hasChildren && isExpanded
        ? node.children!.map((child) => (
            <AssetRow
              key={child.id}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              selectedId={selectedId}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))
        : null}
    </>
  )
}

export function AssetsPanel(_props: IDockviewPanelProps) {
  const [selectedId, setSelectedId] = useState<string | null>('assets')
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(['assets', 'fbx']))

  const onToggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="assets-panel">
      <div className="assets-panel__tree" role="tree">
        {PROJECT_TREE.map((node) => (
          <AssetRow
            key={node.id}
            node={node}
            depth={0}
            expanded={expanded}
            selectedId={selectedId}
            onToggle={onToggle}
            onSelect={setSelectedId}
          />
        ))}
      </div>
    </div>
  )
}
