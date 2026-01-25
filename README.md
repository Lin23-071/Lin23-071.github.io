# 个人主页 - 罗小黑玻璃生态主题

一个充满创意和灵动的个人主页，采用"罗小黑玻璃生态"设计风格，具有现代化的玻璃态效果和流畅的动画交互。

## ✨ 特性

- 🎨 **玻璃态设计** - 毛玻璃效果，营造轻盈通透的视觉体验
- 🌓 **主题切换** - 支持白天/夜晚模式，自动适配系统偏好
- ⌨️ **打字机效果** - 英雄区文字逐字显示，带有光标动画
- 💫 **涟漪动画** - 文字完成后，光标化作涟漪扩散
- ✨ **粒子背景** - 缓慢流动的绿色粒子，增加动态感
- 🎯 **可唤起式导航** - 顶部边缘下滑或点击菜单图标显示导航栏
- 🎪 **环形技能图** - 交互式技能展示，hover 显示百分比
- 🗂️ **项目分类过滤** - 支持按类别筛选作品集
- 📧 **一键复制邮箱** - 点击按钮自动复制邮箱地址

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 `http://localhost:5173` 查看效果。

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📦 部署到 GitHub Pages

### 方法一：使用 GitHub Actions（推荐）

1. 在 GitHub 仓库设置中启用 Pages，选择 "GitHub Actions" 作为源
2. 推送代码到 `main` 分支，GitHub Actions 会自动构建并部署

### 方法二：手动部署

1. 构建项目：`npm run build`
2. 安装 gh-pages：`npm install -D gh-pages`
3. 在 `package.json` 添加部署脚本：
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```
4. 运行：`npm run deploy`

## 🎨 设计规范

### 配色系统

**白天模式：**
- 主背景：`#f8faf0` (米白)
- 主绿色：`#2a9d8f` (青绿)
- 点缀色：`#e9c46a` (琥珀)

**夜晚模式：**
- 主背景：`#1d3557` (深蓝黑)
- 主绿色：`#2a9d8f` (保持不变)
- 点缀色：`#a8dadc` (浅青)

### 玻璃态效果

```css
background: rgba(255, 255, 255, 0.08);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

### 过渡动画

所有状态过渡使用：
```css
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

## 📝 自定义内容

### 修改邮箱地址

编辑 `src/components/Footer.tsx`：
```tsx
const email = 'your-email@example.com'
```

### 修改技能数据

编辑 `src/components/Skills.tsx` 中的 `skills` 数组。

### 修改项目数据

编辑 `src/components/Projects.tsx` 中的 `projects` 数组。

### 修改社交链接

编辑 `src/components/Footer.tsx` 中的 `footer-links` 部分。

## 🛠️ 技术栈

- React 18
- TypeScript
- Vite
- CSS3 (Glassmorphism, Animations)

## 📄 许可证

MIT License

---

**享受你的创意空间！** 🎉
