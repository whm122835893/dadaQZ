import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    // 线上预览时边缘代理对同源并发连接有随机 404 限制，
    // 用 inlineDynamicImports 把所有懒加载路由打包成单一 chunk，
    // 把 JS/CSS 请求数从 100+ 降到 2 个
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/app.js',
        assetFileNames: 'assets/app.[ext]'
      }
    },
    cssCodeSplit: false,
    chunkSizeWarningLimit: 3000
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') }
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: true
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
    proxy: {
      '/api': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/addons': { target: 'http://127.0.0.1:8000', changeOrigin: true }
    }
  }
})
