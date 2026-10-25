import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  assetsInclude: ['**/*.glb'],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // No manual chunks: three.js is only used by the lazily loaded Lanyard, so it
  // lands in that chunk. A forced 'three' chunk also captured React itself,
  // which made the entry preload all of three.js on page open.
})
