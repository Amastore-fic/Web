import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': fileURLToPath(new URL('../shared', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    // Dentro de Docker (ver docker-compose.yml) los cambios se detectan por polling
    watch: { usePolling: process.env.DOCKER_POLLING === 'true', interval: 300 },
  },
})
