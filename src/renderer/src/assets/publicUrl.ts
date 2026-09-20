/** Vite public-dir URL. BASE_URL is `/` in Electron and `/skyline/` on GitHub Pages. */
export function publicUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}
