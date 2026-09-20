/// <reference types="vite/client" />

declare module '*.hdr' {
  const src: string
  export default src
}

declare module '*.hdr?url' {
  const src: string
  export default src
}

declare module '*.svg?url' {
  const src: string
  export default src
}
