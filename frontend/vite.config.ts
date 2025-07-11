import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/api": {
        target: process.env.API_URL ?? "http://0.0.0.0:12000",
        rewrite: path => path.replace(/^\/api/, "")
      }
    }
  }
})
