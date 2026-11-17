import { useEffect, useRef, useState } from 'react'
import { REGIONS } from '../data/china-map'
import { collect, hasStardust, useStardustVersion } from '../state/collect'

/**
 * CN SECTOR —— hero 全屏粒子中国地图（Canvas 2D）
 * 对齐 CliVigil 的英雄页结构：画布铺满整个首屏，粒子云落在右侧
 * （窄屏居中让开底部数据条），地图是 hero 的背景本身，不再有局部边界。
 * 引擎机制移植自 CliVigil 的 particle-field：
 * 径向飞入汇聚（2.9s 收敛）→ 到位后环境漂移 → 整体呼吸 + 鼠标视差 → 底光渐显。
 */

const TAU = Math.PI * 2

/** 星星藏点（460 空间坐标，东南海面空白处；沿用原星图收集 key） */
const HIDDEN_460 = { x: 404, y: 356 }

/** 内容包围盒：把点阵归一化到 0..1，粒子云随视口自适应，不随 460 画布留白 */
const BBOX = (() => {
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  for (const r of REGIONS) {
    for (let i = 0; i < r.pts.length; i += 2) {
      const x = r.pts[i]
      const y = r.pts[i + 1]
      if (x < x0) x0 = x
      if (x > x1) x1 = x
      if (y < y0) y0 = y
      if (y > y1) y1 = y
    }
  }
  const w = x1 - x0
  const h = y1 - y0
  return { x0, y0, w, h, aspect: w / h }
})()

const HIDDEN_N = {
  x: (HIDDEN_460.x - BBOX.x0) / BBOX.w,
  y: (HIDDEN_460.y - BBOX.y0) / BBOX.h,
}

/** 固定种子伪随机：每次重建（resize）粒子分布完全一致 */
function mulberry(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** 发光贴图：中心亮、边缘透明的径向渐变 sprite，质感来源 */
function makeSprite(rgb: string) {
  const S = 64
  const c = document.createElement('canvas')
  c.width = c.height = S
  const g = c.getContext('2d')
  if (!g) return c
  const grd = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
  grd.addColorStop(0, `rgba(${rgb},1)`)
  grd.addColorStop(0.16, `rgba(${rgb},0.86)`)
  grd.addColorStop(0.4, `rgba(${rgb},0.26)`)
  grd.addColorStop(0.72, `rgba(${rgb},0.05)`)
  grd.addColorStop(1, `rgba(${rgb},0)`)
  g.fillStyle = grd
  g.fillRect(0, 0, S, S)
  return c
}

const SPRITES = {
  white: makeSprite('255,255,255'),
  blue: makeSprite('109,178,255'),
  cyan: makeSprite('143,212,255'),
  dim: makeSprite('158,172,205'),
}

/** 省名简称：去掉行政区后缀 */
const shortName = (n: string) => n.replace(/省|市|特别行政区|自治区|壮族|回族|维吾尔/g, '')

/** 悬停命中盒：每省包围盒（460 空间），面积小者优先（直辖市才不会被邻省吞掉） */
const HITBOXES = REGIONS.map((r, idx) => {
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  for (let i = 0; i < r.pts.length; i += 2) {
    const x = r.pts[i]
    const y = r.pts[i + 1]
    if (x < x0) x0 = x
    if (x > x1) x1 = x
    if (y < y0) y0 = y
    if (y > y1) y1 = y
  }
  return { name: shortName(r.name), idx, x0, y0, x1, y1, area: (x1 - x0) * (y1 - y0) }
})

interface Particle {
  tx: number
  ty: number
  sx: number
  sy: number
  r: number
  a: number
  sp: number
  ph: number
  depth: number
  delay: number
  dur: number
  spr: HTMLCanvasElement
  prov: number
}

interface BoxInfo {
  x: number
  y: number
  w: number
  h: number
}

interface EngineOpts {
  onHover: (name: string | null) => void
  onGrab: () => void
  isCollected: () => boolean
  onBox: (b: BoxInfo) => void
}

function createEngine(canvas: HTMLCanvasElement, opts: EngineOpts) {
  const ctx0 = canvas.getContext('2d', { alpha: true })
  if (!ctx0) return null
  const ctx: CanvasRenderingContext2D = ctx0

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // 质量分级：核心少 / 移动端降到 1700，其余 2900
  const cores = navigator.hardwareConcurrency || 8
  const TARGET = cores <= 4 ? 1700 : 2900

  let W = 0
  let H = 0
  let dpr = 1
  let unit = 1
  let box: BoxInfo = { x: 0, y: 0, w: 0, h: 0 }
  let starX = 0
  let starY = 0
  let particles: Particle[] = []
  let raf = 0
  let started = false
  let t0 = 0
  let last = 0
  let hoverIdx = -1
  let visible = true
  const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 }

  function layout() {
    const cw = canvas.clientWidth || window.innerWidth
    const ch = canvas.clientHeight || window.innerHeight
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(cw * dpr)
    canvas.height = Math.round(ch * dpr)
    W = cw
    H = ch

    // 布局逻辑与 CliVigil 的 particle-field 相同：宽屏粒子云落在右侧栏居中，
    // 窄屏单列时居中并让开底部数据条
    let bh: number
    let cx: number
    let cy: number
    if (W >= 900) {
      bh = Math.min(H * 0.68, (W * 0.44) / BBOX.aspect)
      cx = W * 0.73
      cy = H * 0.53
    } else {
      bh = Math.min(H * 0.28, (W * 0.80) / BBOX.aspect)
      cx = W / 2
      cy = H * 0.655
    }
    const bw = bh * BBOX.aspect
    box = { x: cx - bw / 2, y: cy - bh / 2, w: bw, h: bh }
    unit = bw / BBOX.w
    starX = box.x + HIDDEN_N.x * box.w
    starY = box.y + HIDDEN_N.y * box.h

    build()
    opts.onBox(box)
  }

  function build() {
    const rnd = mulberry(20260911)
    const totalPts = REGIONS.reduce((s, r) => s + r.pts.length / 2, 0)
    const stride = Math.max(1, Math.ceil(totalPts / TARGET))
    const ccx = box.x + box.w / 2
    const ccy = box.y + box.h / 2
    particles = []
    REGIONS.forEach((reg, ri) => {
      const n = reg.pts.length / 2
      for (let i = 0; i < n; i += stride) {
        const tx = box.x + ((reg.pts[i * 2] - BBOX.x0) / BBOX.w) * box.w
        const ty = box.y + ((reg.pts[i * 2 + 1] - BBOX.y0) / BBOX.h) * box.h
        const spr = reg.focus
          ? rnd() < 0.5
            ? SPRITES.cyan
            : SPRITES.white
          : reg.lit
            ? rnd() < 0.62
              ? SPRITES.blue
              : SPRITES.white
            : SPRITES.dim
        const p: Particle = {
          tx,
          ty,
          sx: tx,
          sy: ty,
          r: reg.focus ? 0.72 + rnd() * 1.1 : reg.lit ? 0.62 + rnd() * 1.0 : 0.5 + rnd() * 0.72,
          a: reg.focus ? 0.5 + rnd() * 0.45 : reg.lit ? 0.42 + rnd() * 0.42 : 0.2 + rnd() * 0.26,
          sp: 0.55 + rnd() * 1.15,
          ph: rnd() * TAU,
          depth: 0.35 + rnd() * 0.65,
          delay: 0,
          dur: 0,
          spr,
          prov: ri,
        }
        if (!reduce) {
          if (rnd() < 0.72) {
            // 从形状外围径向飞入：起点向外扩 1.9~7.2 倍并带角度抖动
            const ang = Math.atan2(ty - ccy, tx - ccx) + (rnd() - 0.5) * 0.7
            const dist = Math.max(Math.hypot(tx - ccx, ty - ccy), 70)
            const k = 1.9 + rnd() * 5.2
            p.sx = ccx + Math.cos(ang) * dist * k
            p.sy = ccy + Math.sin(ang) * dist * k
          } else {
            // 从屏幕随机位置飞入
            p.sx = (rnd() * 1.5 - 0.25) * W
            p.sy = (rnd() * 1.5 - 0.25) * H
          }
          const fly = Math.hypot(p.sx - p.tx, p.sy - p.ty)
          p.dur = Math.min(2.1, 1.15 + fly / 1400)
          p.delay = rnd() * 0.46
        }
        particles.push(p)
      }
    })
  }

  function drawHalo(strength: number) {
    const cx = box.x + box.w / 2
    const cy = box.y + box.h / 2
    const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(box.w, box.h) * 0.72)
    rg.addColorStop(0, `rgba(77,163,255,${(0.12 * strength).toFixed(4)})`)
    rg.addColorStop(0.55, `rgba(77,163,255,${(0.045 * strength).toFixed(4)})`)
    rg.addColorStop(1, 'rgba(77,163,255,0)')
    ctx.fillStyle = rg
    ctx.fillRect(0, 0, W, H)
  }

  function drawFrame(now: number) {
    raf = requestAnimationFrame(drawFrame)
    if (!visible) {
      last = now
      return
    }
    if (!started) {
      started = true
      t0 = now
    }
    const dt = Math.min(50, now - (last || now))
    last = now
    const t = (now - t0) / 1000

    // 鼠标惯性跟随
    mouse.x += (mouse.tx - mouse.x) * Math.min(1, dt / 260)
    mouse.y += (mouse.ty - mouse.y) * Math.min(1, dt / 260)

    // 整体呼吸 + 视差
    const breathe = 1 + Math.sin(t * 0.42) * 0.011
    const parX = (mouse.x - 0.5) * 30
    const parY = (mouse.y - 0.5) * 20

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, W, H)

    // 底光：收敛完成后渐显，覆盖全屏、以粒子云为中心
    const halo = Math.min(1, Math.max(0, (t - 1.6) / 1.4))
    if (halo > 0) drawHalo(halo)

    const cx = box.x + box.w / 2
    const cy = box.y + box.h / 2
    ctx.save()
    ctx.translate(cx + parX, cy + parY)
    ctx.scale(breathe, breathe)
    ctx.translate(-cx, -cy)

    for (const p of particles) {
      const prog = reduce ? 1 : Math.min(1, Math.max(0, (t - p.delay) / p.dur))
      const e = 1 - Math.pow(1 - prog, 5)
      let px = p.sx + (p.tx - p.sx) * e
      let py = p.sy + (p.ty - p.sy) * e
      // 到位后叠加环境漂移：每个点以自己的相位与景深缓慢游动
      if (prog >= 1) {
        const d = t * p.sp
        px += Math.sin(d * 1.7 + p.ph) * 1.9 * p.depth * unit
        py += Math.cos(d * 1.3 + p.ph * 1.7) * 1.5 * p.depth * unit
      }
      const size = p.r * 9
      const boost = p.prov === hoverIdx ? 1.9 : 1
      ctx.globalAlpha = Math.min(1, p.a * (0.2 + 0.8 * e) * boost)
      ctx.drawImage(p.spr, px - size / 2, py - size / 2, size, size)
    }

    // 星星：东南海面上的一颗微弱的星
    if (!opts.isCollected()) {
      ctx.globalAlpha = 0.35 + 0.3 * (0.5 + 0.5 * Math.sin(t * 2.4))
      ctx.drawImage(SPRITES.cyan, starX - 13, starY - 13, 26, 26)
    }

    ctx.restore()
    ctx.globalAlpha = 1
  }

  function drawStatic() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, W, H)
    drawHalo(1)
    for (const p of particles) {
      const size = p.r * 9
      ctx.globalAlpha = p.a
      ctx.drawImage(p.spr, p.tx - size / 2, p.ty - size / 2, size, size)
    }
    ctx.globalAlpha = 1
  }

  // --- 事件（全挂 window：画布 pointer-events 关闭，文字层不受影响） ---
  function onGlobalPointer(e: PointerEvent) {
    mouse.tx = e.clientX / window.innerWidth
    mouse.ty = e.clientY / window.innerHeight

    const r = canvas.getBoundingClientRect()
    const px = e.clientX - r.left
    const py = e.clientY - r.top

    // 星星热区
    const near = Math.hypot(px - starX, py - starY) < 20
    document.body.style.cursor = near ? 'pointer' : ''

    // 省份悬停：仅在粒子云区域内换算到 460 空间查命中盒
    let best = -1
    let bestArea = Infinity
    if (px >= box.x && px <= box.x + box.w && py >= box.y && py <= box.y + box.h) {
      const mx = ((px - box.x) / box.w) * BBOX.w + BBOX.x0
      const my = ((py - box.y) / box.h) * BBOX.h + BBOX.y0
      for (const hb of HITBOXES) {
        if (mx >= hb.x0 && mx <= hb.x1 && my >= hb.y0 && my <= hb.y1 && hb.area < bestArea) {
          bestArea = hb.area
          best = hb.idx
        }
      }
    }
    if (best !== hoverIdx) {
      hoverIdx = best
      opts.onHover(best >= 0 ? HITBOXES[best].name : null)
    }
  }

  function onGlobalClick(e: MouseEvent) {
    const r = canvas.getBoundingClientRect()
    const px = e.clientX - r.left
    const py = e.clientY - r.top
    if (Math.hypot(px - starX, py - starY) < 20) opts.onGrab()
  }

  let resizeTimer: number | undefined
  function onResize() {
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => {
      layout()
      started = false // 重新汇聚
      if (reduce) drawStatic()
    }, 160)
  }

  const io = new IntersectionObserver((entries) => {
    visible = entries[0]?.isIntersecting ?? true
  })
  io.observe(canvas)

  window.addEventListener('resize', onResize)
  layout()

  if (reduce) {
    drawStatic()
  } else {
    window.addEventListener('pointermove', onGlobalPointer, { passive: true })
    window.addEventListener('click', onGlobalClick)
    raf = requestAnimationFrame(drawFrame)
  }

  return {
    destroy() {
      cancelAnimationFrame(raf)
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onGlobalPointer)
      window.removeEventListener('click', onGlobalClick)
      document.body.style.cursor = ''
      io.disconnect()
    },
  }
}

export default function ChinaMap() {
  useStardustVersion()
  const collected = hasStardust('starmap')
  const collectedRef = useRef(collected)
  collectedRef.current = collected

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [flash, setFlash] = useState<string | null>(null)
  const [box, setBox] = useState<BoxInfo | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const engine = createEngine(canvas, {
      onHover: setHovered,
      onGrab: () => {
        const first = collect('starmap')
        if (first) {
          setFlash('✦ STAR +1')
          window.setTimeout(() => setFlash(null), 1800)
        }
      },
      isCollected: () => collectedRef.current,
      onBox: setBox,
    })
    return engine?.destroy
  }, [])

  const b = box

  return (
    <div
      className="chmap"
      role="group"
      aria-label="粒子中国地图：九个省份点亮，其中福建与广东为重点；东南海面藏着一枚星星"
    >
      <canvas ref={canvasRef} className="chmap__canvas" aria-hidden="true" />
      {b && (
        <>
          <div
            className="chmap__readout"
            style={{ left: b.x, width: b.w, top: Math.max(8, b.y - 30) }}
            aria-hidden="true"
          >
            <span>{hovered ?? 'CN SECTOR · 34'}</span>
            <span>9 LIT</span>
          </div>
          <div className="chmap__caption" style={{ left: b.x, top: b.y + b.h + 12 }}>
            <span>CN SECTOR · 071</span>
            <span className="chmap__hint">悬停看省份 · 藏着 1 枚星星</span>
          </div>
        </>
      )}
      {flash && b && (
        <div className="chmap__flash" style={{ left: b.x + b.w / 2, top: b.y + b.h * 0.35 }}>
          {flash}
        </div>
      )}
    </div>
  )
}
