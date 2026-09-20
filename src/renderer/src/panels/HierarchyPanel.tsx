import { useMemo, useState } from 'react'
import type { IDockviewPanelProps } from 'dockview-react'
import { SCENE_TREE, type HierarchyNode } from '../ecs/sceneData'
import { selectionStore, useSelectedEntityId } from '../ecs/selectionStore'
import { ChevronDownIcon, ChevronRightIcon, EntityIcon } from './panelIcons'
import './hierarchy-panel.css'

function matchesQuery(node: HierarchyNode, query: string): boolean {
  if (!query) return true
  if (node.name.toLowerCase().includes(query)) return true
  return node.children?.some((child) => matchesQuery(child, query)) ?? false
}

function HierarchyRow({
  node,
  depth,
  query,
  expanded,
  selectedId,
  onToggle,
  onSelect
}: {
  node: HierarchyNode
  depth: number
  query: string
  expanded: Set<string>
  selectedId: string | null
  onToggle: (id: string) => void
  onSelect: (id: string) => void
}) {
  const hasChildren = (node.children?.length ?? 0) > 0
  const isExpanded = expanded.has(node.id) || Boolean(query)
  const visibleChildren =
    hasChildren && isExpanded
      ? node.children!.filter((child) => matchesQuery(child, query))
      : []

  if (!matchesQuery(node, query)) return null

  return (
    <>
      <div
        className={`hierarchy-row${selectedId === node.id ? ' hierarchy-row--selected' : ''}`}
        style={{ paddingLeft: 8 + depth * 16 }}
        role="treeitem"
        aria-selected={selectedId === node.id}
        aria-expanded={hasChildren ? isExpanded : undefined}
        tabIndex={0}
        onClick={() => onSelect(node.id)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onSelect(node.id)
          }
        }}
      >
        {hasChildren ? (
          <button
            type="button"
            className="hierarchy-row__chevron"
            onClick={(event) => {
              event.stopPropagation()
              onToggle(node.id)
            }}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
          </button>
        ) : (
          <span className="hierarchy-row__spacer" aria-hidden="true" />
        )}
        <EntityIcon />
        <span className="hierarchy-row__label">{node.name}</span>
      </div>
      {visibleChildren.map((child) => (
        <HierarchyRow
          key={child.id}
          node={child}
          depth={depth + 1}
          query={query}
          expanded={expanded}
          selectedId={selectedId}
          onToggle={onToggle}
          onSelect={onSelect}
        />
      ))}
    </>
  )
}

export function HierarchyPanel(_props: IDockviewPanelProps) {
  const selectedId = useSelectedEntityId()
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(['cubes', 'surface']))

  const normalizedQuery = query.trim().toLowerCase()
  const visibleRoots = useMemo(
    () => SCENE_TREE.filter((node) => matchesQuery(node, normalizedQuery)),
    [normalizedQuery]
  )

  const onToggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="hierarchy-panel">
      <div className="hierarchy-panel__search">
        <input
          className="hierarchy-panel__search-input"
          type="search"
          placeholder="Search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          spellCheck={false}
        />
      </div>
      <div className="hierarchy-panel__tree" role="tree">
        {visibleRoots.map((node) => (
          <HierarchyRow
            key={node.id}
            node={node}
            depth={0}
            query={normalizedQuery}
            expanded={expanded}
            selectedId={selectedId}
            onToggle={onToggle}
            onSelect={(id) => selectionStore.select(id)}
          />
        ))}
      </div>
    </div>
  )
}
