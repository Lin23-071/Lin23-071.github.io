# 快速启动指南

## 🚀 开始使用

### 1. 安装 Node.js
确保你的系统已安装 Node.js (版本 18 或更高)
- 下载地址: https://nodejs.org/

### 2. 安装依赖
```bash
npm install
```

### 3. 启动开发服务器
```bash
npm run dev
```

访问 `http://localhost:5173` 查看你的个人主页！

## ✨ 新增的优化功能

### 🎯 增强的粒子背景
- 粒子会跟随鼠标移动
- 近距离粒子之间会有连接线
- 更流畅的动画效果

### 💫 多重涟漪效果
- 打字完成后会触发三个连续的涟漪
- 营造更丰富的视觉层次

### 📜 滚动动画
- 技能图进入视口时会有缩放淡入效果
- 项目卡片依次淡入显示
- 页脚区域滚动时淡入

### ✨ 鼠标跟踪光晕
- 项目卡片上移动鼠标会有光晕跟随效果
- 增强交互体验

## 📝 自定义内容

### 修改个人信息
1. **邮箱地址**: 编辑 `src/components/Footer.tsx` 第 7 行
2. **技能数据**: 编辑 `src/components/Skills.tsx` 第 6-11 行
3. **项目数据**: 编辑 `src/components/Projects.tsx` 第 13-56 行
4. **社交链接**: 编辑 `src/components/Footer.tsx` 第 50-58 行
5. **欢迎文字**: 编辑 `src/components/Hero.tsx` 第 11 行

### 调整配色
编辑 `src/index.css` 中的 CSS 变量：
- `--bg-primary`: 主背景色
- `--color-primary`: 主绿色
- `--color-accent`: 点缀色

## 🎨 设计建议

如果你想要更个性化的效果，可以尝试：
- 调整粒子数量（Hero.tsx 第 61 行）
- 修改涟漪大小（Hero.css 中的 ripple-animation）
- 调整玻璃态模糊度（App.css 中的 backdrop-filter）
- 自定义动画时长（各组件 CSS 中的 transition）

## 📦 构建生产版本

```bash
npm run build
```

构建文件将输出到 `dist` 目录。

## 🌐 部署

### GitHub Pages
1. 推送代码到 GitHub
2. 在仓库设置中启用 Pages
3. 选择 "GitHub Actions" 作为源
4. 自动部署完成！

### 其他平台
- Vercel: 连接 GitHub 仓库即可自动部署
- Netlify: 拖拽 `dist` 文件夹或连接 Git 仓库
- 任何静态托管服务: 上传 `dist` 文件夹内容

---

**享受你的创意空间！** 🎉
