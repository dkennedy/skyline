import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: resolve('src/renderer'),
  publicDir: resolve('src/renderer/public'),
  base: '/skyline/',
  plugins: [react()],
  resolve: {
    alias: {
      '@renderer': resolve('src/renderer/src')
    }
  },
  build: {
    outDir: resolve('dist'),
    emptyOutDir: true
  },
  server: {
    port: 5173
  }
})
