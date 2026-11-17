import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // 如果部署到 GitHub Pages 子路径，改为 '/项目名/'
  build: {
    // 多页入口：主页 + 可独立访问/被索引的档案页，无需 SPA 404 回退
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        cv: fileURLToPath(new URL('./cv.html', import.meta.url)),
      },
    },
  },
  server: {
    host: '127.0.0.1', // 使用 127.0.0.1 而不是 localhost
    port: 5173,
    strictPort: false, // 如果端口被占用，自动尝试下一个端口
    open: true, // 自动打开浏览器
    cors: true, // 启用 CORS
  },
})
