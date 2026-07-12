# 个人主页占位页 — 技术方案

## 1. 技术栈

| 类别 | 选型 | 理由 |
|---|---|---|
| 构建工具 | **Vite 5** | 已有项目沿用，HMR 快 |
| UI 框架 | **React 18 + TypeScript** | 已有项目沿用 |
| 路由 | 无 | 单页，不需要 |
| 状态管理 | `useState` + `useRef` | 单页够用 |
| 样式 | **CSS Modules / 原生 CSS** | 沿用项目风格，零依赖 |
| 动画 | CSS Animation + Framer-Motion 风格的纯 CSS | 避免引入 framer-motion 包 |
| 游戏渲染 | `<canvas>` 2D | 性能足够 |
| 字体加载 | `<link>` Google Fonts + `font-display: swap` | 标准做法 |
| 部署 | GitHub Pages（已有 workflow） | 沿用 |

### 1.1 明确不引入的依赖
- ❌ Tailwind（与"有质感"目标冲突；需要自己写才出效果）
- ❌ Framer Motion（CSS + 一个轻量自写 hook 够用）
- ❌ 任何 Canvas 库（如 PixiJS、Phaser）—— 自写 300 行内
- ❌ 任何 UI 组件库（不需要）

---

## 2. 目录结构

```
f:\Lin23-071.github.io
├── .github/workflows/deploy.yml    # 已有，沿用
├── public/
│   ├── noise.png                  # 噪点纹理（200×200）
│   └── favicon.svg                # 自定义 favicon（小恐龙）
├── src/
│   ├── components/
│   │   ├── Hero.tsx               # 主标题区
│   │   ├── Hero.css
│   │   ├── ConstructionTape.tsx   # 顶部施工带
│   │   ├── ConstructionTape.css
│   │   ├── StickyNote.tsx         # 便签组件（复用）
│   │   ├── StickyNote.css
│   │   ├── Stamp.tsx              # 印章 SVG
│   │   ├── Stamp.css
│   │   ├── GameInvite.tsx         # 邀请玩游戏的卡片
│   │   ├── GameInvite.css
│   │   ├── TrexGame.tsx           # 恐龙游戏本体
│   │   ├── TrexGame.css
│   │   ├── Contact.tsx            # 联系方式
│   │   ├── Contact.css
│   │   ├── EasterEgg.tsx          # 彩蛋监听
│   │   └── EasterEgg.css
│   ├── hooks/
│   │   ├── useTypewriter.ts       # 打字机 hook
│   │   ├── useMouseTilt.ts        # 鼠标倾斜 hook
│   │   └── useReducedMotion.ts    # 减弱动画偏好
│   ├── App.tsx                    # 总入口
│   ├── App.css
│   ├── main.tsx
│   └── index.css                  # 全局变量、字体、reset
├── index.html                     # 改：换 title/meta/字体链接
├── package.json                   # 不动
├── tsconfig.json                  # 不动
└── vite.config.ts                 # 不动
```

---

## 3. 数据流与状态

整个应用状态非常简单，无需复杂方案：

```ts
// App.tsx
const [gameOpen, setGameOpen] = useState(false)  // 游戏是否展开
const [eggActive, setEggActive] = useState(false) // 彩蛋是否激活

// Hero.tsx
const typedText = useTypewriter("正在装修中。", 60)

// TrexGame.tsx（内部状态，不外露）
const [state, setState] = useState<'idle'|'running'|'dead'>('idle')
const scoreRef = useRef(0)
const speedRef = useRef(6)
```

不引入 Context / Redux / Zustand。

---

## 4. 关键模块设计

### 4.1 字体加载（index.html）
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,900&family=JetBrains+Mono:wght@400;700&family=Caveat:wght@500&family=Noto+Serif+SC:wght@600;900&display=swap" rel="stylesheet">
```

### 4.2 全局 CSS 变量（index.css）
```css
:root {
  --bg: #F4EFE6;
  --ink: #1A1A1A;
  --ink-soft: #6B6557;
  --warning: #F5C518;
  --persimmon: #D65A3C;
  --moss: #6B7A4A;
  --paper: #F7F0DD;
  --line: #1A1A1A;
  
  --font-display: 'Fraunces', 'Noto Serif SC', serif;
  --font-mono: 'JetBrains Mono', monospace;
  --font-hand: 'Caveat', cursive;
  --font-cn: 'Noto Serif SC', 'Fraunces', serif;
  
  --radius-sm: 4px;
  --radius-md: 12px;
  --radius-lg: 24px;
  
  --shadow-soft: 0 2px 8px rgba(26, 26, 26, 0.06);
  --shadow-hard: 4px 4px 0 var(--ink);
}
```

### 4.3 打字机 hook（useTypewriter.ts）
```ts
export function useTypewriter(text: string, speedMs = 60) {
  const [out, setOut] = useState('')
  useEffect(() => {
    let i = 0
    setOut('')
    const id = setInterval(() => {
      i++
      setOut(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speedMs)
    return () => clearInterval(id)
  }, [text, speedMs])
  return out
}
```

### 4.4 鼠标倾斜 hook（useMouseTilt.ts）
```ts
export function useMouseTilt(maxDeg = 6) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      el.style.transform = `perspective(800px) rotateY(${x * maxDeg}deg) rotateX(${-y * maxDeg}deg)`
    }
    const onLeave = () => { el.style.transform = '' }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [maxDeg])
  return ref
}
```

### 4.5 施工带（ConstructionTape.tsx）
- 纯 CSS 实现斜纹背景：`repeating-linear-gradient(45deg, var(--warning) 0 30px, var(--ink) 30px 60px)`
- 内部文字横排，CSS marquee 动画从右向左
- 文字内容：状态文案数组，循环

### 4.6 恐龙游戏（TrexGame.tsx）

#### 数据结构
```ts
type Obstacle = { x: number; h: 30|50|70; passed: boolean }
type GameState = {
  dino: { y: number; vy: number; ducking: boolean }
  obstacles: Obstacle[]
  score: number
  speed: number
  state: 'idle'|'running'|'dead'
  groundOffset: number
}
```

#### 渲染循环
```ts
useEffect(() => {
  let raf = 0
  let last = performance.now()
  const tick = (now: number) => {
    const dt = Math.min(40, now - last)  // cap dt
    last = now
    if (stateRef.current.state === 'running') {
      update(dt)
      draw()
    }
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(raf)
}, [])
```

#### 物理常量
- 重力 g = 0.6 (px/frame²)
- 跳跃初速度 vy0 = -14
- 起跳速度 6
- 速度上限 18

#### 输入
- keydown Space / ArrowUp：跳跃
- keydown ArrowDown：下蹲
- click / touchstart：跳跃
- keydown R：重开

#### 碰撞检测
- AABB，恐龙 hitbox 比视觉小 30%（更宽容）
- 仙人掌按高度分别给 hitbox

#### 死亡 / 复活
- 死亡：state = 'dead'，弹出"再来一把"按钮
- 复活：清空 obstacles，score = 0，speed = 6

### 4.7 彩蛋（EasterEgg.tsx）
- 监听全局 keydown
- 维护一个 ring buffer 最近 5 个按键
- 包含 "071" 任意位置：触发
- 触发：Hero 标题切换为"在这里！🎉" 1.5s，背景瞬间出现一群小恐龙 emoji 飘过

### 4.8 噪点纹理
- 一张 200×200 PNG，base64 内嵌到 CSS
- 透明度 0.04，`mix-blend-mode: multiply`
- 固定在 `body::before`，`pointer-events: none`

---

## 5. 样式策略

### 5.1 不用 utility-first
- 全部手写 CSS（沿用项目风格）
- 每个组件配 .css 文件
- 共用变量在 `index.css`

### 5.2 关键样式技巧
- **硬阴影**：`4px 4px 0 var(--ink)`，无 blur，呼应 Risograph
- **不对称旋转**：便签、印章默认带 `rotate(-2deg)`，增加手作感
- **破折线边框**：`border: 2px dashed var(--ink)`
- **米色纸感**：`background: var(--paper); box-shadow: 0 8px 24px rgba(0,0,0,0.08);`

### 5.3 响应式断点
- 移动端 < 768px
- 桌面端 >= 768px（默认）
- 不做平板特殊处理

---

## 6. 性能优化

### 6.1 字体
- 仅加载 4 个字体、每个最多 2 个字重
- 用 `&display=swap` 避免 FOIT
- Fraunces 用 opsz 轴可变字体，体积反而更小

### 6.2 Canvas
- 启用 `desynchronized: true` 减少 tearing
- 用 `devicePixelRatio` 适配高分屏，但缩放上限为 2
- 死亡时不 cancel 渲染循环，保留背景动画

### 6.3 动画
- 仅 transform / opacity（GPU 加速）
- 不用 left / top / width 做动画
- `will-change` 只在 hover 期间用

### 6.4 首屏体积
- 不引第三方包
- 不引 polyfill
- 单一入口 `index.html`

---

## 7. 部署

沿用现有 `.github/workflows/deploy.yml`，不需要改动。

```bash
npm run build  # tsc + vite build
# 推送到 main → GitHub Pages 自动部署
```

---

## 8. 风险与应对

| 风险 | 应对 |
|---|---|
| Google Fonts 加载慢 | 关键文本用 system font fallback |
| Canvas 移动端掉帧 | 自动降速（检测 FPS，连续 30 帧 < 50fps 时降低粒子） |
| TypeScript 严格模式踩坑 | 游戏循环里全部用 `useRef` + 命令式，避免每次重渲染创建对象 |
| 字体版权 | 全部用 Google Fonts 开源字体 |
| favicon 缺失 | 在 public/ 放一个 SVG 小恐龙 |
| 旧版部署残留 | 删除 `public/PPT-*` `public/pic-*` 等文件前先确认旧版本已存档 |

---

## 9. 实施步骤

1. 清理 src/ 旧组件（保留 main.tsx / index.css 框架结构）
2. 改 `index.html`：title、字体、meta
3. 写 `index.css` 全局变量
4. 写 `Hero.tsx` + `ConstructionTape.tsx` + `StickyNote.tsx`
5. 写 `TrexGame.tsx`（最大单文件）
6. 写 `Stamp.tsx` + `Contact.tsx` + `GameInvite.tsx` + `EasterEgg.tsx`
7. 写 `App.tsx` 串起来
8. 加 `public/noise.png`、`public/favicon.svg`
9. 本地 `npm run dev` 验证
10. 视觉细节迭代
11. `npm run build` 通过
12. 提交 + 推送（用户确认后）

---

## 10. 不做的事

- 不接入任何第三方 npm 包
- 不写单元测试（一次性占位页不划算）
- 不做 i18n（默认中文 + 英文点缀）
- 不做主题切换
- 不接入分析工具
- 不做 SEO 深度优化（仅基础 meta）
