import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],

  server: {
    proxy: {
      '/api': 'http://10.102.45.239:5000',
    },
  },
})