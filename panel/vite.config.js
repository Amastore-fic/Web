import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// El panel se sirve bajo /panel/ en el mismo dominio que la tienda.
// https://vite.dev/config/
export default defineConfig({
  base: '/panel/',
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': fileURLToPath(new URL('../shared', import.meta.url)),
    },
  },
  server: {
    port: 5174,
  },
})
