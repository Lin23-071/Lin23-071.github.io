import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // 如果部署到 GitHub Pages 子路径，改为 '/项目名/'
  server: {
    host: '127.0.0.1', // 使用 127.0.0.1 而不是 localhost
    port: 5173,
    strictPort: false, // 如果端口被占用，自动尝试下一个端口
    open: true, // 自动打开浏览器
    cors: true, // 启用 CORS
  },
})
