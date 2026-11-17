import { useCallback, useEffect, useRef, useState } from 'react'
import { collect, hasStardust, useStardustVersion } from '../state/collect'

/**
 * SECTOR MAP —— hero 右侧的可玩星图
 * 拖拽漫游（松手回弹）/ 悬停点亮 / 命名节点点击跳转 / 藏一颗星星
 */

interface Star {
  x: number
  y: number
  r: number
  /** 闪烁动画延迟 */
  d?: number
}

interface Node extends Star {
  id: string
  label: string
  target: string
}

const NODES: Node[] = [
  { id: 'core', label: '071 CORE', target: '#top', x: 230, y: 235, r: 7 },
  { id: 'works', label: 'WORKS', target: '#works', x: 128, y: 118, r: 5.5 },
  { id: 'about', label: 'ABOUT', target: '#about', x: 96, y: 330, r: 5.5 },
  { id: 'contact', label: 'CONTACT', target: '#contact', x: 336, y: 306, r: 5.5 },
]

/** 命名节点之间的连线 */
const LINKS: Array<[string, string]> = [
  ['core', 'works'],
  ['core', 'contact'],
  ['works', 'about'],
  ['core', 'about'],
  ['works', 'contact'],
]

/** 装饰性的微弱连线（纯坐标，不参与跳转） */
const WISPS: Array<[number, number, number, number]> = [
  [62, 210, 128, 118],
  [96, 330, 128, 118],
  [148, 260, 128, 118],
  [250, 300, 230, 235],
  [300, 210, 336, 306],
  [336, 306, 396, 246],
  [300, 400, 336, 306],
  [410, 386, 396, 246],
  [200, 60, 128, 118],
  [320, 70, 336, 306],
]

const FILLERS: Star[] = [
  { x: 62, y: 210, r: 2, d: 0 },
  { x: 96, y: 330, r: 1.6, d: 0.7 },
  { x: 148, y: 260, r: 2.2, d: 1.4 },
  { x: 196, y: 356, r: 1.5, d: 2.1 },
  { x: 250, y: 300, r: 2.4, d: 0.4 },
  { x: 300, y: 210, r: 1.8, d: 1.1 },
  { x: 352, y: 150, r: 2, d: 1.8 },
  { x: 396, y: 246, r: 2.2, d: 0.9 },
  { x: 410, y: 386, r: 1.5, d: 2.5 },
  { x: 200, y: 60, r: 1.8, d: 1.6 },
  { x: 320, y: 70, r: 1.4, d: 0.3 },
  { x: 424, y: 60, r: 2, d: 2.2 },
  { x: 40, y: 90, r: 1.6, d: 1.2 },
  { x: 300, y: 400, r: 1.7, d: 0.6 },
]

/** 隐藏星星的坐标 */
const HIDDEN = { x: 392, y: 112 }

const byId = (id: string) => NODES.find((n) => n.id === id)!

const DRAG_LIMIT = 42

export default function StarMap() {
  useStardustVersion()
  const collected = hasStardust('starmap')

  const boxRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(null)
  const movedRef = useRef(false)
  const rafRef = useRef(0)

  const [drag, setDrag] = useState({ x: 0, y: 0, active: false })
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState<string | null>(null)
  const [coord, setCoord] = useState({ ra: '042.71', dec: '-07.10' })
  const [flash, setFlash] = useState<string | null>(null)

  // 鼠标视差（拖拽时不叠加）
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const box = boxRef.current
    if (!box) return
    const rect = box.getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width - 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5
    if (!dragRef.current) setParallax({ x: nx * 10, y: ny * 10 })
    setCoord({
      ra: (180 + nx * 120).toFixed(2).padStart(6, '0'),
      dec: (-7 - ny * 60).toFixed(2),
    })
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    dragRef.current = { startX: e.clientX, startY: e.clientY, baseX: drag.x, baseY: drag.y }
    movedRef.current = false
    setDrag((d) => ({ ...d, active: true }))
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  const onDragMove = (e: React.PointerEvent) => {
    const d = dragRef.current
    if (!d) return
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    if (Math.abs(dx) + Math.abs(dy) > 6) movedRef.current = true
    const x = Math.max(-DRAG_LIMIT, Math.min(DRAG_LIMIT, d.baseX + dx))
    const y = Math.max(-DRAG_LIMIT, Math.min(DRAG_LIMIT, d.baseY + dy))
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => setDrag({ x, y, active: true }))
  }

  const endDrag = () => {
    if (!dragRef.current) return
    dragRef.current = null
    setDrag({ x: 0, y: 0, active: false }) // 松手后 CSS transition 弹回原点
  }

  const goto = (target: string) => {
    if (movedRef.current) return // 刚拖拽过就不当点击
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  }

  const grabHidden = () => {
    if (movedRef.current || collected) return
    const first = collect('starmap')
    if (first) {
      setFlash('✦ STAR +1')
      window.setTimeout(() => setFlash(null), 1800)
    }
  }

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  const groupTransform = `translate(${drag.x + parallax.x}px, ${drag.y + parallax.y}px)`

  return (
    <div
      ref={boxRef}
      className={`starmap ${drag.active ? 'is-dragging' : ''}`}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerMoveCapture={onDragMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      role="group"
      aria-label="扇区星图：拖拽漫游，点击命名节点跳转"
    >
      <span className="starmap__corner starmap__corner--tl" aria-hidden="true" />
      <span className="starmap__corner starmap__corner--tr" aria-hidden="true" />
      <span className="starmap__corner starmap__corner--bl" aria-hidden="true" />
      <span className="starmap__corner starmap__corner--br" aria-hidden="true" />

      <div className="starmap__readout" aria-hidden="true">
        <span>RA {coord.ra}</span>
        <span>DEC {coord.dec}</span>
      </div>

      <svg className="starmap__svg" viewBox="0 0 460 460">
        <g className="starmap__world" style={{ transform: groupTransform }}>
          {/* 参考圈 + 十字线 */}
          <circle cx="230" cy="235" r="150" className="starmap__ring" />
          <circle cx="230" cy="235" r="92" className="starmap__ring" />
          <g className="starmap__orbit">
            <circle cx="230" cy="235" r="120" className="starmap__ring starmap__ring--spin" />
            <circle cx="230" cy="115" r="2.6" className="starmap__orbit-dot" />
          </g>
          <line x1="230" y1="52" x2="230" y2="418" className="starmap__axis" />
          <line x1="47" y1="235" x2="413" y2="235" className="starmap__axis" />

          {/* 装饰连线 */}
          {WISPS.map(([x1, y1, x2, y2], i) => (
            <line
              key={`w-${i}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              className="starmap__link starmap__link--faint"
              style={{ '--ld': `${1.1 + i * 0.08}s` } as React.CSSProperties}
            />
          ))}

          {/* 星座连线：入场描线动画 */}
          {LINKS.map(([a, b], i) => {
            const A = byId(a)
            const B = byId(b)
            return (
              <line
                key={`${a}-${b}`}
                x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                className="starmap__link"
                style={{ '--ld': `${1.2 + i * 0.16}s` } as React.CSSProperties}
              />
            )
          })}

          {/* 无名小星 */}
          {FILLERS.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} className="starmap__dot" style={{ '--d': `${s.d ?? 0}s` } as React.CSSProperties} />
          ))}

          {/* 命名节点 */}
          {NODES.map((n) => (
            <g
              key={n.id}
              className={`starmap__node ${hovered === n.id ? 'is-hot' : ''}`}
              onMouseEnter={() => setHovered(n.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={(e) => {
                e.stopPropagation()
                goto(n.target)
              }}
              tabIndex={0}
              role="link"
              aria-label={`${n.label}，跳转到对应区块`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') goto(n.target)
              }}
            >
              <circle cx={n.x} cy={n.y} r={n.r * 3.2} className="starmap__halo" />
              <circle cx={n.x} cy={n.y} r={n.r} className="starmap__star" />
              <text x={n.x} y={n.y - n.r - 12} className="starmap__label" textAnchor="middle">
                {n.label}
              </text>
            </g>
          ))}

          {/* 隐藏星星 */}
          <g
            className={`starmap__hidden ${collected ? 'is-collected' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              grabHidden()
            }}
            tabIndex={collected ? -1 : 0}
            role="button"
            aria-label="一颗微弱的星"
            onKeyDown={(e) => {
              if (e.key === 'Enter') grabHidden()
            }}
          >
            <circle cx={HIDDEN.x} cy={HIDDEN.y} r={14} className="starmap__hidden-hit" />
            <circle cx={HIDDEN.x} cy={HIDDEN.y} r={2.4} className="starmap__hidden-star" />
          </g>
        </g>
      </svg>

      <div className="starmap__caption">
        <span>SECTOR MAP · 071</span>
        <span className="starmap__hint">拖拽漫游 · 点节点跳转</span>
      </div>

      {flash && <div className="starmap__flash">{flash}</div>}
    </div>
  )
}
