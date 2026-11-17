import { useEffect, useRef } from 'react'

/**
 * 半调网点波浪背景（复刻 CliVigil S6 的 halftone-wave）
 * Canvas 2D 点阵 + 双层正弦位移；鼠标靠近时波峰被"推"起来。
 * 离屏暂停 / reduce-motion 只画静态一帧 / 纯装饰。
 */
export default function HalftoneWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = 0
    let H = 0
    let raf = 0
    let visible = true
    let t0 = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const mouse = { x: -999, y: -999 }

    const layout = () => {
      if (!canvas.isConnected) return
      const host = canvas.parentElement
      if (!host) return
      const r = host.getBoundingClientRect()
      W = Math.max(1, Math.round(r.width))
      H = Math.max(1, Math.round(r.height))
      canvas.width = W * dpr
      canvas.height = H * dpr
      canvas.style.width = `${W}px`
      canvas.style.height = `${H}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    layout()

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H)
      const gap = Math.max(17, Math.round(W / 82))
      const cols = Math.ceil(W / gap) + 1
      const rows = Math.ceil(H / gap) + 1
      const base = gap * 0.11
      const amp = gap * 0.22

      for (let j = 0; j < rows; j++) {
        const y = j * gap
        for (let i = 0; i < cols; i++) {
          const x = i * gap
          let w =
            Math.sin(x * 0.011 + t * 0.9 + (i % 7) * 0.31) * 0.55 +
            Math.sin(y * 0.017 - t * 0.6) * 0.45 +
            Math.sin((x + y) * 0.007 + t * 0.35) * 0.5

          // 鼠标扰动：附近点被抬成波峰
          const dx = x - mouse.x
          const dy = y - mouse.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 150) w += (1 - d / 150) * 0.6

          const v = Math.max(0, Math.min(1, (w + 1.5) / 3))
          const edge =
            Math.min(1, Math.min(i, cols - 1 - i) / 5) *
            Math.min(1, Math.min(j, rows - 1 - j) / 5)
          const size = base + amp * v * edge
          if (size < 0.4) continue

          if (v > 0.9 && edge > 0.6) {
            ctx.beginPath()
            ctx.arc(x, y, size, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(77, 163, 255, ${(0.1 + 0.22 * v).toFixed(3)})`
            ctx.fill()
          } else {
            ctx.fillStyle = `rgba(214, 226, 255, ${(0.03 + 0.09 * v).toFixed(3)})`
            ctx.fillRect(x - size / 2, y - size / 2, size, size)
          }
        }
      }
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const onMove = (e: MouseEvent) => {
      if (!canvas.isConnected) return
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
      if (reduce) draw(2.4)
    }

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting
      },
      { threshold: 0 },
    )
    io.observe(canvas)

    if (!reduce) {
      const tick = (now: number) => {
        if (!t0) t0 = now - 2400
        if (visible) draw((now - t0) / 1000)
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    } else {
      draw(2.4)
    }

    const onResize = () => {
      layout()
      if (reduce) draw(2.4)
    }
    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="halftone-canvas" aria-hidden="true" />
}
