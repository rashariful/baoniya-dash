import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath } from 'url'
import path from 'node:path'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    
    react()],
  server: {
    port: 3001,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'lottie-web': 'lottie-web/build/player/lottie.min.js',
    },
  },
})