import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function icon(props: IconProps) {
  return {
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    ...props
  }
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...icon(props)}>
      <path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...icon(props)}>
      <path d="M8 6.5v11l10-5.5-10-5.5Z" fill="currentColor" />
    </svg>
  )
}

export function StopIcon(props: IconProps) {
  return (
    <svg {...icon(props)}>
      <rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor" />
    </svg>
  )
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...icon(props)}>
      <path
        d="M8.46976 6.53027C8.17687 6.23738 8.17687 5.76262 8.46976 5.46973C8.76266 5.17683 9.23742 5.17683 9.53031 5.46973L15.5303 11.4697C15.671 11.6104 15.75 11.8011 15.75 12C15.75 12.1989 15.671 12.3896 15.5303 12.5303L9.53031 18.5303C9.23742 18.8232 8.76266 18.8232 8.46976 18.5303C8.17687 18.2374 8.17687 17.7626 8.46976 17.4697L13.9395 12L8.46976 6.53027Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function OverflowIcon(props: IconProps) {
  return (
    <svg {...icon(props)}>
      <circle cx="6" cy="12" r="1.4" fill="currentColor" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
      <circle cx="18" cy="12" r="1.4" fill="currentColor" />
    </svg>
  )
}

export function DeviceIcon(props: IconProps) {
  return (
    <svg {...icon(props)}>
      <rect x="8" y="4" width="8" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="17.5" r="0.8" fill="currentColor" />
    </svg>
  )
}
