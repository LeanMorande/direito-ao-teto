import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // es2019: compatible con móviles antiguos. jsPDF va en su propio chunk (carga diferida).
  build: { target: 'es2019', chunkSizeWarningLimit: 900 },
})
