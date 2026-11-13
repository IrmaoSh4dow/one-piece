import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { scoresFilePlugin } from './scores-plugin.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), scoresFilePlugin()],
})
