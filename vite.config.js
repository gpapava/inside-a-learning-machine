import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/inside-a-learning-machine/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})
