import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { IDockviewPanelProps } from 'dockview-react'
import { usePlayMode } from '../play/playStore'
import { ChevronDownIcon, ChevronRightIcon } from './panelIcons'
import './mixer-panel.css'

type BusId =
  | 'master'
  | 'environment'
  | 'vfx'
  | 'media'
  | 'microphone'
  | 'ui'
  | 'voice'

type BusDef = {
  id: BusId
  name: string
  send: string
  stereo: boolean
  /** Fader gain in dB (−60 … +20). */
  gainDb: number
  /** Simulated source profile while playing. */
  profile: 'music' | 'vfx' | 'media' | 'mic' | 'ui' | 'voice' | 'master'
}

const DB_MIN = -60
const DB_MAX = 20
const METER_HEIGHT = 130
const SCALE_LABELS = ['+20', '+10', '0', '-10', '-20', '-30', '-40', '-50'] as const

const INITIAL_BUSES: BusDef[] = [
  {
    id: 'master',
    name: 'Master',
    send: 'System Out',
    stereo: true,
    gainDb: 0,
    profile: 'master'
  },
  {
    id: 'environment',
    name: 'Environment',
    send: 'Master',
    stereo: false,
    gainDb: 0,
    profile: 'music'
  },
  {
    id: 'vfx',
    name: 'VFX',
    send: 'Master',
    stereo: false,
    gainDb: 0,
    profile: 'vfx'
  },
  {
    id: 'media',
    name: 'Media',
    send: 'Master',
    stereo: false,
    gainDb: -10,
    profile: 'media'
  },
  {
    id: 'microphone',
    name: 'Microphone',
    send: 'Master',
    stereo: false,
    gainDb: 0,
    profile: 'mic'
  },
  {
    id: 'ui',
    name: 'UI',
    send: 'Master',
    stereo: false,
    gainDb: 0,
    profile: 'ui'
  },
  {
    id: 'voice',
    name: 'Voice',
    send: 'Master',
    stereo: false,
    gainDb: 0,
    profile: 'voice'
  }
]

type MeterLevels = Record<BusId, { left: number; right: number; peakDb: number }>

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function formatDb(db: number): string {
  const rounded = Math.round(db)
  if (rounded > 0) return `+${rounded} db`
  return `${rounded} db`
}

function peakToneClass(db: number): string {
  if (db >= 6) return 'mixer-channel__peak--hot'
  if (db >= -6) return 'mixer-channel__peak--warm'
  return ''
}

function MixerBusIcon() {
  return (
    <svg className="panel-icon" width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4.5" y="5" width="3" height="14" rx="1" fill="currentColor" opacity="0.35" />
      <rect x="10.5" y="5" width="3" height="14" rx="1" fill="currentColor" opacity="0.55" />
      <rect x="16.5" y="5" width="3" height="14" rx="1" fill="currentColor" opacity="0.8" />
      <rect x="3.75" y="9" width="4.5" height="3" rx="1" fill="currentColor" />
      <rect x="9.75" y="13" width="4.5" height="3" rx="1" fill="currentColor" />
      <rect x="15.75" y="7" width="4.5" height="3" rx="1" fill="currentColor" />
    </svg>
  )
}

/** Tick marks beside the VU meter — no center rail. Left side is end-aligned
 * (flush to the meter); right side is start-aligned (also flush to the meter). */
function MeterTicks({ align }: { align: 'start' | 'end' }) {
  return (
    <div className={`mixer-ticks mixer-ticks--${align}`} aria-hidden>
      {Array.from({ length: 15 }, (_, i) => (
        <span
          key={i}
          className={`mixer-ticks__mark${i % 2 === 0 ? ' mixer-ticks__mark--major' : ' mixer-ticks__mark--minor'}`}
        />
      ))}
    </div>
  )
}

function MeterBar({ level }: { level: number }) {
  const fraction = clamp(level, 0, 1)
  const greenEnd = 0.72
  const orangeEnd = 0.9
  const greenH = Math.min(fraction, greenEnd) * METER_HEIGHT
  const orangeH = Math.max(0, Math.min(fraction, orangeEnd) - greenEnd) * METER_HEIGHT
  const redH = Math.max(0, fraction - orangeEnd) * METER_HEIGHT

  return (
    <div className="mixer-meter" style={{ height: METER_HEIGHT }}>
      {greenH > 0 ? (
        <div
          className="mixer-meter__fill mixer-meter__fill--green"
          style={{ height: greenH, bottom: 0 }}
        />
      ) : null}
      {orangeH > 0 ? (
        <div
          className="mixer-meter__fill mixer-meter__fill--orange"
          style={{ height: orangeH, bottom: greenH }}
        />
      ) : null}
      {redH > 0 ? (
        <div
          className="mixer-meter__fill mixer-meter__fill--red"
          style={{ height: redH, bottom: greenH + orangeH }}
        />
      ) : null}
    </div>
  )
}

function ChannelStrip({
  bus,
  levels,
  selected,
  onSelect,
  onGainChange
}: {
  bus: BusDef
  levels: { left: number; right: number; peakDb: number }
  selected: boolean
  onSelect: () => void
  onGainChange: (gainDb: number) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const gainToTop = (gainDb: number) => {
    const t = 1 - (gainDb - DB_MIN) / (DB_MAX - DB_MIN)
    return clamp(t, 0, 1) * 122
  }

  const setGainFromClientY = useCallback(
    (clientY: number) => {
      const el = trackRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const t = clamp((clientY - rect.top) / rect.height, 0, 1)
      const gainDb = DB_MAX - t * (DB_MAX - DB_MIN)
      onGainChange(Math.round(gainDb))
    },
    [onGainChange]
  )

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (!dragging.current) return
      setGainFromClientY(event.clientY)
    }
    const onUp = () => {
      dragging.current = false
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [setGainFromClientY])

  const peakDb = levels.peakDb
  const showPeak = peakDb > DB_MIN + 0.5

  return (
    <div
      className={`mixer-channel${bus.stereo ? ' mixer-channel--master' : ''}${
        selected ? ' mixer-channel--selected' : ''
      }`}
      onClick={onSelect}
    >
      <div className="mixer-channel__title">{bus.name}</div>
      <div className="mixer-channel__body">
        <div className="mixer-channel__stage">
          <div className="mixer-channel__gain-label">{formatDb(bus.gainDb)}</div>
          <div className="mixer-channel__scale" aria-hidden>
            {SCALE_LABELS.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          <div
            className="mixer-fader mixer-fader--control"
            ref={trackRef}
            onPointerDown={(event) => {
              event.preventDefault()
              dragging.current = true
              setGainFromClientY(event.clientY)
            }}
          >
            <MeterTicks align="end" />
            <div className="mixer-fader__thumb" style={{ top: gainToTop(bus.gainDb) }} />
          </div>
          <div className={`mixer-channel__meters${bus.stereo ? ' mixer-channel__meters--stereo' : ''}`}>
            <MeterBar level={levels.left} />
            {bus.stereo ? <MeterBar level={levels.right} /> : null}
          </div>
          <div className="mixer-fader mixer-fader--rail" aria-hidden>
            <MeterTicks align="start" />
          </div>
          <div className={`mixer-channel__peak ${peakToneClass(peakDb)}`}>
            {showPeak ? formatDb(peakDb) : '— db'}
          </div>
        </div>
      </div>
      <div className="mixer-channel__send">{bus.send}</div>
    </div>
  )
}

function sampleSource(profile: BusDef['profile'], time: number): number {
  // Continuous modulation — keep it lively but not noisy.
  const breathe = (speed: number, depth: number, phase = 0) =>
    depth * Math.sin(time * speed + phase)

  switch (profile) {
    case 'music': {
      return 0.54 + breathe(0.85, 0.1) + breathe(1.6, 0.04, 1.2)
    }
    case 'media': {
      return 0.64 + breathe(1.0, 0.12) + breathe(1.9, 0.05, 0.6)
    }
    case 'vfx': {
      // Footsteps most of the time; every few hits punch into orange/red.
      const period = 0.55
      const step = Math.floor(time / period)
      const phase = (time % period) / period
      const envelope = phase < 0.3 ? Math.sin((phase / 0.3) * Math.PI) ** 1.25 : 0
      // Hot impacts: every 4th step → orange; every 12th → red clip.
      const hot = step % 12 === 0
      const warm = step % 4 === 0
      const peak = hot ? 1.12 : warm ? 0.92 : 0.7
      return 0.03 + envelope * peak
    }
    case 'ui': {
      const period = 2.8
      const phase = (time % period) / period
      const click = phase < 0.1 ? Math.sin((phase / 0.1) * Math.PI) ** 1.3 : 0
      return 0.02 + click * 0.5
    }
    case 'voice': {
      const gate = 0.5 + 0.5 * Math.sin(time * 0.7)
      const talking = gate > 0.4 ? (gate - 0.4) / 0.6 : 0
      return 0.03 + talking * (0.36 + breathe(2.6, 0.07))
    }
    case 'mic': {
      return 0.02 + breathe(1.1, 0.01)
    }
    case 'master':
    default:
      return 0
  }
}

function smoothToward(current: number, target: number, attack: number, release: number): number {
  const rate = target > current ? attack : release
  return current + (target - current) * rate
}

function emptyLevels(): MeterLevels {
  return {
    master: { left: 0, right: 0, peakDb: DB_MIN },
    environment: { left: 0, right: 0, peakDb: DB_MIN },
    vfx: { left: 0, right: 0, peakDb: DB_MIN },
    media: { left: 0, right: 0, peakDb: DB_MIN },
    microphone: { left: 0, right: 0, peakDb: DB_MIN },
    ui: { left: 0, right: 0, peakDb: DB_MIN },
    voice: { left: 0, right: 0, peakDb: DB_MIN }
  }
}

export function MixerPanel(_props: IDockviewPanelProps) {
  const playing = usePlayMode() === 'playing'
  const [buses, setBuses] = useState(INITIAL_BUSES)
  const [selectedId, setSelectedId] = useState<BusId>('master')
  const [masterExpanded, setMasterExpanded] = useState(true)
  const [levels, setLevels] = useState<MeterLevels>(emptyLevels)
  const busesRef = useRef(buses)
  busesRef.current = buses

  const groups = useMemo(() => buses.filter((b) => b.id !== 'master'), [buses])
  const master = buses[0]

  useEffect(() => {
    if (!playing) {
      setLevels(emptyLevels())
      return
    }

    let frame = 0
    const started = performance.now()
    // Hold smoothed meter state so levels ease instead of jumping every frame.
    const smoothed: MeterLevels = emptyLevels()
    // Snappier than before, still eased — VFX uses a faster attack so peaks punch through.
    const attack = 0.22
    const release = 0.07
    const vfxAttack = 0.38
    const stereoDrift = 0.015

    const tick = (now: number) => {
      const time = (now - started) / 1000
      const current = busesRef.current
      const next = emptyLevels()
      let masterL = 0
      let masterR = 0

      for (const bus of current) {
        if (bus.id === 'master') continue
        const activity = sampleSource(bus.profile, time + bus.id.length * 0.37)
        const gainLin = Math.pow(10, bus.gainDb / 20)
        const level = clamp(activity * gainLin * 0.92, 0, 1.15)
        const width = stereoDrift * Math.sin(time * 0.8 + bus.id.length)
        const targetL = clamp(level * (1 + width), 0, 1)
        const targetR = clamp(level * (1 - width * 0.5), 0, 1)

        const prev = smoothed[bus.id]
        const rise = bus.profile === 'vfx' ? vfxAttack : attack
        const left = smoothToward(prev.left, targetL, rise, release)
        const right = smoothToward(prev.right, bus.stereo ? targetR : targetL, rise, release)
        const peakDb = DB_MIN + Math.max(left, right) * (DB_MAX - DB_MIN)
        smoothed[bus.id] = { left, right, peakDb }
        next[bus.id] = smoothed[bus.id]

        masterL += left * 0.35
        masterR += right * 0.35
      }

      const masterBus = current.find((b) => b.id === 'master')
      const masterGain = Math.pow(10, (masterBus?.gainDb ?? 0) / 20)
      const targetL = clamp(masterL * masterGain, 0, 1)
      const targetR = clamp(masterR * masterGain, 0, 1)
      const left = smoothToward(smoothed.master.left, targetL, attack, release)
      const right = smoothToward(smoothed.master.right, targetR, attack, release)
      smoothed.master = {
        left,
        right,
        peakDb: DB_MIN + Math.max(left, right) * (DB_MAX - DB_MIN)
      }
      next.master = smoothed.master

      setLevels({ ...next })
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [playing])

  const setGain = (id: BusId, gainDb: number) => {
    setBuses((prev) =>
      prev.map((bus) => (bus.id === id ? { ...bus, gainDb: clamp(gainDb, DB_MIN, DB_MAX) } : bus))
    )
  }

  return (
    <div className="mixer-panel">
      <aside className="mixer-panel__tree" aria-label="Mixer groups">
        <button
          type="button"
          className={`mixer-tree-row${selectedId === 'master' ? ' mixer-tree-row--selected' : ''}`}
          onClick={() => setSelectedId('master')}
        >
          <span
            className="mixer-tree-row__chevron"
            onClick={(event) => {
              event.stopPropagation()
              setMasterExpanded((v) => !v)
            }}
          >
            {masterExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
          </span>
          <MixerBusIcon />
          <span>Master</span>
        </button>
        {masterExpanded
          ? groups.map((bus) => (
              <button
                key={bus.id}
                type="button"
                className={`mixer-tree-row mixer-tree-row--child${
                  selectedId === bus.id ? ' mixer-tree-row--selected' : ''
                }`}
                onClick={() => setSelectedId(bus.id)}
              >
                <span className="mixer-tree-row__spacer" />
                <MixerBusIcon />
                <span>{bus.name}</span>
              </button>
            ))
          : null}
      </aside>

      <div className="mixer-panel__strips" role="list">
        <ChannelStrip
          bus={master}
          levels={levels.master}
          selected={selectedId === 'master'}
          onSelect={() => setSelectedId('master')}
          onGainChange={(gainDb) => setGain('master', gainDb)}
        />
        {groups.map((bus) => (
          <ChannelStrip
            key={bus.id}
            bus={bus}
            levels={levels[bus.id]}
            selected={selectedId === bus.id}
            onSelect={() => setSelectedId(bus.id)}
            onGainChange={(gainDb) => setGain(bus.id, gainDb)}
          />
        ))}
      </div>
    </div>
  )
}
