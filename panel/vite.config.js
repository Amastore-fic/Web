import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// El panel se sirve bajo /panel/ en el mismo dominio que la tienda.
// https://vite.dev/config/
export default defineConfig({
  base: '/panel/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@shared': fileURLToPath(new URL('../shared', import.meta.url)),
    },
  },
  server: {
    port: 5174,
    strictPort: true,
    // Dentro de Docker (ver docker-compose.yml) los cambios se detectan por polling
    watch: { usePolling: process.env.DOCKER_POLLING === 'true', interval: 300 },
  },
})
