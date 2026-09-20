import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function base(props: IconProps) {
  const { className, ...rest } = props
  return {
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': true as const,
    className: `panel-icon${className ? ` ${className}` : ''}`,
    ...rest
  }
}

/** Exact path geometry from Figma Hierarchy / Agent icons. */
export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M17.4697 8.46973C17.7626 8.17683 18.2374 8.17683 18.5303 8.46973C18.8232 8.76262 18.8232 9.23738 18.5303 9.53027L12.5303 15.5303C12.3896 15.6709 12.1989 15.75 12 15.75C11.8011 15.75 11.6104 15.6709 11.4697 15.5303L5.46973 9.53027C5.17683 9.23738 5.17683 8.76262 5.46973 8.46973C5.76262 8.17683 6.23738 8.17683 6.53027 8.46973L12 13.9395L17.4697 8.46973Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M8.46976 6.53027C8.17687 6.23738 8.17687 5.76262 8.46976 5.46973C8.76266 5.17683 9.23742 5.17683 9.53031 5.46973L15.5303 11.4697C15.671 11.6104 15.75 11.8011 15.75 12C15.75 12.1989 15.671 12.3896 15.5303 12.5303L9.53031 18.5303C9.23742 18.8232 8.76266 18.8232 8.46976 18.5303C8.17687 18.2374 8.17687 17.7626 8.46976 17.4697L13.9395 12L8.46976 6.53027Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function EntityIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M5.75 15.5645L11.25 18.707V12.4346L5.75 9.29199V15.5645ZM12.75 12.4346V18.707L18.25 15.5645V9.29199L12.75 12.4346ZM6.51172 8L12 11.1357L17.4873 8L12 4.86328L6.51172 8ZM19.75 16C19.75 16.2691 19.6058 16.5178 19.3721 16.6514L12.3721 20.6514C12.1415 20.783 11.8585 20.783 11.6279 20.6514L4.62793 16.6514C4.39425 16.5178 4.25 16.2691 4.25 16V8C4.25 7.73086 4.39425 7.48217 4.62793 7.34863L11.6279 3.34863L11.7168 3.30566C11.9285 3.21927 12.1704 3.23342 12.3721 3.34863L19.3721 7.34863C19.6058 7.48217 19.75 7.73086 19.75 8V16Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function AddIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M11.25 20L11.25 4C11.25 3.58579 11.5858 3.25 12 3.25C12.4142 3.25 12.75 3.58579 12.75 4L12.75 20C12.75 20.4142 12.4142 20.75 12 20.75C11.5858 20.75 11.25 20.4142 11.25 20Z"
        fill="currentColor"
      />
      <path
        d="M20 11.25C20.4142 11.25 20.75 11.5858 20.75 12C20.75 12.4142 20.4142 12.75 20 12.75L4 12.75C3.58579 12.75 3.25 12.4142 3.25 12C3.25 11.5858 3.58579 11.25 4 11.25L20 11.25Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function ArrowUpIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M12.75 20C12.75 20.4142 12.4142 20.75 12 20.75C11.5858 20.75 11.25 20.4142 11.25 20L11.25 5.81055L6.53027 10.5303C6.23738 10.8232 5.76262 10.8232 5.46973 10.5303C5.17684 10.2374 5.17684 9.76262 5.46973 9.46973L11.4697 3.46973C11.6104 3.32907 11.8011 3.25 12 3.25C12.1989 3.25 12.3896 3.32908 12.5303 3.46973L18.5303 9.46973C18.8232 9.76262 18.8232 10.2374 18.5303 10.5303C18.2374 10.8232 17.7626 10.8232 17.4697 10.5303L12.75 5.81055L12.75 20Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function AgentMarkIcon(props: IconProps) {
  return (
    <svg
      width={28}
      height={28}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={`panel-icon panel-icon--mark${props.className ? ` ${props.className}` : ''}`}
      {...props}
    >
      <circle cx="14" cy="14" r="14" fill="#000000" />
      <circle cx="14" cy="14" r="13.5" stroke="white" strokeOpacity="0.24" />
    </svg>
  )
}

export function TransformIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M13.1777 2.93945C13.4601 3.22076 13.563 3.60218 13.5 4C13.4844 4.09994 13.4687 4.19987 13.4531 4.2998C13.1719 6.0998 12.8906 7.90019 12.6094 9.7002C12.5938 9.80013 12.5781 9.90006 12.5625 10C12.5423 10.1277 12.4655 10.2505 12.3604 10.3408C12.2545 10.4311 12.1289 10.4814 12 10.4814C11.8711 10.4814 11.7455 10.4311 11.6396 10.3408C11.5345 10.2505 11.4577 10.1277 11.4375 10C11.4219 9.90006 11.4062 9.80013 11.3906 9.7002C11.1094 7.90019 10.8281 6.0998 10.5469 4.2998C10.5313 4.19987 10.5156 4.09994 10.5 4C10.437 3.60218 10.5399 3.22076 10.8223 2.93945C11.1025 2.65815 11.5392 2.5 12 2.5C12.4608 2.5 12.8975 2.65815 13.1777 2.93945Z"
        fill="currentColor"
      />
      <path
        d="M4.06296 16.8287C4.15605 16.7742 4.24927 16.7197 4.34236 16.6652C6.01801 15.6848 7.69371 14.7045 9.36936 13.7241C9.46244 13.6697 9.55568 13.6151 9.64876 13.5606C9.76137 13.4951 9.90543 13.4771 10.0422 13.5022C10.1795 13.5279 10.2987 13.5945 10.3799 13.6961C10.4611 13.7976 10.5 13.9285 10.4949 14.0681C10.4894 14.2071 10.4402 14.3436 10.3515 14.4391C10.278 14.518 10.2043 14.597 10.1307 14.6758C8.80644 16.0954 7.48215 17.515 6.15788 18.9346C6.08431 19.0135 6.01062 19.0924 5.93704 19.1713C5.66337 19.4658 5.29917 19.6214 4.90331 19.5768C4.50853 19.5337 4.11411 19.2938 3.8287 18.937C3.54329 18.5803 3.39585 18.1428 3.4404 17.7482C3.48382 17.3522 3.71553 17.031 4.06296 16.8287Z"
        fill="currentColor"
      />
      <path
        d="M18.063 19.1713C17.9894 19.0924 17.9157 19.0135 17.8421 18.9346C16.5178 17.515 15.1936 16.0954 13.8693 14.6758C13.7957 14.597 13.722 14.518 13.6485 14.4391C13.5598 14.3436 13.5106 14.2071 13.5051 14.0681C13.5 13.9285 13.5389 13.7976 13.6201 13.6961C13.7013 13.5945 13.8205 13.5279 13.9578 13.5022C14.0946 13.4771 14.2386 13.4951 14.3512 13.5606C14.4443 13.6151 14.5376 13.6697 14.6306 13.7241C16.3063 14.7045 17.982 15.6848 19.6576 16.6652C19.7507 16.7197 19.8439 16.7742 19.937 16.8287C20.2845 17.031 20.5162 17.3522 20.5596 17.7482C20.6042 18.1428 20.4567 18.5803 20.1713 18.937C19.8859 19.2938 19.4915 19.5337 19.0967 19.5768C18.7008 19.6214 18.3366 19.4658 18.063 19.1713Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function MeshIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M18.5 3.25C19.7426 3.25 20.75 4.25736 20.75 5.5V18.5C20.75 19.7426 19.7426 20.75 18.5 20.75H5.5C4.25736 20.75 3.25 19.7426 3.25 18.5V5.5C3.25 4.25736 4.25736 3.25 5.5 3.25H18.5ZM16.75 16.75V19.25H18.5C18.9142 19.25 19.25 18.9142 19.25 18.5V16.75H16.75ZM12.75 19.25H15.25V16.75H12.75V19.25ZM8.75 19.25H11.25V16.75H8.75V19.25ZM4.75 18.5C4.75 18.9142 5.08579 19.25 5.5 19.25H7.25V16.75H4.75V18.5ZM16.75 12.75V15.25H19.25V12.75H16.75ZM4.75 15.25H7.25V12.75H4.75V15.25ZM8.75 15.25H11.25V12.75H8.75V15.25ZM12.75 15.25H15.25V12.75H12.75V15.25ZM16.75 8.75V11.25H19.25V8.75H16.75ZM4.75 11.25H7.25V8.75H4.75V11.25ZM8.75 11.25H11.25V8.75H8.75V11.25ZM12.75 11.25H15.25V8.75H12.75V11.25ZM16.75 7.25H19.25V5.5C19.25 5.08579 18.9142 4.75 18.5 4.75H16.75V7.25ZM5.5 4.75C5.08579 4.75 4.75 5.08579 4.75 5.5V7.25H7.25V4.75H5.5ZM8.75 7.25H11.25V4.75H8.75V7.25ZM12.75 7.25H15.25V4.75H12.75V7.25Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function AnimationIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="17" cy="12" r="6" fill="currentColor" />
      <path d="M6 8L9 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2 12L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 16L9 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function SoundIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M2 10C2 9.44772 2.44772 9 3 9H4.58579C4.851 9 5.10536 8.89464 5.29289 8.70711L8.29289 5.70711C8.92286 5.07714 10 5.52331 10 6.41421V17.5858C10 18.4767 8.92286 18.9229 8.29289 18.2929L5.29289 15.2929C5.10536 15.1054 4.851 15 4.58579 15H3C2.44772 15 2 14.5523 2 14V10Z"
        fill="currentColor"
      />
      <path d="M14 9C14 9 15 10 15 12C15 14 14 15 14 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 7C16 7 18 9 18 12C18 15 16 17 16 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 5C18 5 21 8 21 12C21 16 18 19 18 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function SoundPlayIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M6 5.72318C6 4.95536 6.82948 4.47399 7.49614 4.85494L18.4806 11.1318C19.1524 11.5157 19.1524 12.4843 18.4806 12.8682L7.49614 19.1451C6.82948 19.526 6 19.0446 6 18.2768V5.72318Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function SoundStopIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor" />
    </svg>
  )
}

export function SoundLoopIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M10 18H5C3.89543 18 3 17.1046 3 16V8C3 6.89543 3.89543 6 5 6H19C20.1046 6 21 6.89543 21 8V16C21 17.1046 20.1046 18 19 18H14.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16 16L14 18L16 20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function AssetPickerIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="4.25" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function OverflowDotsIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="6" cy="12" r="1.4" fill="currentColor" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
      <circle cx="18" cy="12" r="1.4" fill="currentColor" />
    </svg>
  )
}
