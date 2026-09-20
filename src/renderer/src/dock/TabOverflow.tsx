import { useEffect, useRef, useState } from 'react'
import type { IDockviewHeaderActionsProps } from 'dockview-react'
import { OverflowIcon } from '../shell/icons'
import { resetLayout } from './defaultLayout'

export function TabOverflow(props: IDockviewHeaderActionsProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const closeActiveTab = () => {
    props.activePanel?.api.close()
    setOpen(false)
  }

  const floatGroup = () => {
    props.containerApi.addFloatingGroup(props.group)
    setOpen(false)
  }

  const reset = () => {
    resetLayout(props.containerApi)
    setOpen(false)
  }

  return (
    <div className="tab-overflow" ref={rootRef}>
      <button
        className="tab-overflow__button"
        type="button"
        aria-label="Panel options"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <OverflowIcon />
      </button>
      {open ? (
        <div className="tab-overflow__menu" role="menu">
          <button type="button" role="menuitem" onClick={closeActiveTab} disabled={!props.activePanel}>
            Close tab
          </button>
          <button type="button" role="menuitem" onClick={floatGroup}>
            Float group
          </button>
          <button type="button" role="menuitem" onClick={reset}>
            Reset layout
          </button>
        </div>
      ) : null}
    </div>
  )
}
