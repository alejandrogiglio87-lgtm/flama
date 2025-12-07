import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Exponer variables de entorno con prefijo VITE_ al cliente
  // Las variables VITE_* están disponibles en import.meta.env
})
