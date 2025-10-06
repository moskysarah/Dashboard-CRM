import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      "/auth": {
        target: "http://192.162.69.75:8078", // mon backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
