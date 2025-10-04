import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Needed for Docker container port mapping
    proxy: {
      '/api': {
        // This should match the service name in docker-compose.yml
        target: 'http://backend:3001',
        changeOrigin: true,
      }
    }
  }
})