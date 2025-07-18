import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),vueDevTools(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: process.env.API_URL ?? "http://0.0.0.0:12000",
        rewrite: path => path.replace(/^\/api/, "")
      }
    }
  }
})
