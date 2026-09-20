import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import type { IDockviewPanelProps } from 'dockview-react'
import dkProfileUrl from '../assets/avatar/dk-profile.jpg'
import { AddIcon, AgentMarkIcon, ArrowUpIcon } from './panelIcons'
import './agent-panel.css'

type AgentMessage = {
  id: string
  role: 'user' | 'agent'
  text: string
}

const INITIAL_MESSAGES: AgentMessage[] = [
  {
    id: '1',
    role: 'user',
    text: 'Create a landing platform. Don’t code yet, come back to me with a plan.'
  },
  {
    id: '2',
    role: 'agent',
    text: 'Thinking...'
  }
]

export function AgentPanel(_props: IDockviewPanelProps) {
  const [messages, setMessages] = useState<AgentMessage[]>(INITIAL_MESSAGES)
  const [draft, setDraft] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages])

  const send = () => {
    const text = draft.trim()
    if (!text) return
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-user`, role: 'user', text },
      { id: `${Date.now()}-agent`, role: 'agent', text: 'Thinking...' }
    ])
    setDraft('')
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    send()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      send()
    }
  }

  return (
    <div className="agent-panel">
      <div className="agent-panel__transcript" ref={listRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`agent-message agent-message--${message.role}`}
          >
            {message.role === 'agent' ? (
              <AgentMarkIcon className="agent-message__avatar" />
            ) : null}
            <div className="agent-message__bubble">{message.text}</div>
            {message.role === 'user' ? (
              <img
                className="agent-message__avatar agent-message__avatar--user"
                src={dkProfileUrl}
                alt=""
              />
            ) : null}
          </div>
        ))}
      </div>

      <form className="agent-composer" onSubmit={onSubmit}>
        <textarea
          className="agent-composer__input"
          placeholder="Enter your prompt"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          rows={4}
          spellCheck={false}
        />
        <div className="agent-composer__actions">
          <button className="agent-composer__btn" type="button" aria-label="Add attachment">
            <AddIcon />
          </button>
          <button
            className="agent-composer__btn agent-composer__btn--send"
            type="submit"
            aria-label="Send prompt"
            disabled={!draft.trim()}
          >
            <ArrowUpIcon />
          </button>
        </div>
      </form>
    </div>
  )
}
