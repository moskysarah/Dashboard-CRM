import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  //  CORRECTION ICI : rend les chemins relatifs dans ton build (indispensable pour Render)
  base: './',

  server: {
    proxy: {
      "/auth": {
        target: "http://192.162.69.75:8078", // ton backend  
        secure: false,
      },
    },
  },
})
