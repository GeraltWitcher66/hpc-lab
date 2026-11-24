import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // GitHub Pages project site is served from /<repo>/, dev server stays at /
  base: command === 'build' ? '/hpc-lab/' : '/',
  server: {
    port: 5173,
    host: true,
  },
}))
