import { useEffect, useRef, useState, useCallback } from 'react'
import './TrexGame.css'

type Obstacle = { x: number; w: number; h: number }
type Phase = 'idle' | 'running' | 'dead'

const GAME_W = 600
const GAME_H = 220
const GROUND_Y = 180
const GRAVITY = 0.55
const JUMP_VY = -13.2
const MAX_SPEED = 18
const START_SPEED = 6
const STORAGE_KEY = '071-trex-high'

export default function TrexGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const stateRef = useRef({
    phase: 'idle' as Phase,
    dinoY: 0,
    dinoVY: 0,
    dinoDuck: false,
    legFrame: 0,
    obstacles: [] as Obstacle[],
    spawnTimer: 60,
    speed: START_SPEED,
    score: 0,
    highScore: 0,
    groundOffset: 0,
    cloudOffset: 0,
  })
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState<number>(() => {
    const v = Number(localStorage.getItem(STORAGE_KEY) || '0')
    return Number.isFinite(v) ? v : 0
  })

  const resetToIdle = useCallback(() => {
    const s = stateRef.current
    s.phase = 'idle'
    s.dinoY = 0
    s.dinoVY = 0
    s.dinoDuck = false
    s.obstacles = []
    s.spawnTimer = 60
    s.speed = START_SPEED
    s.score = 0
    setScore(0)
  }, [])

  const startRun = useCallback(() => {
    const s = stateRef.current
    if (s.phase === 'idle' || s.phase === 'dead') {
      s.phase = 'running'
      s.dinoY = 0
      s.dinoVY = JUMP_VY
      s.dinoDuck = false
      s.obstacles = []
      s.spawnTimer = 50
      s.speed = START_SPEED
      s.score = 0
      setScore(0)
    }
  }, [])

  const jump = useCallback(() => {
    const s = stateRef.current
    if (s.phase === 'idle' || s.phase === 'dead') {
      startRun()
      return
    }
    if (s.phase === 'running' && s.dinoY <= 0.5) {
      s.dinoVY = JUMP_VY
    }
  }, [startRun])

  // 键盘
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault()
        jump()
      } else if (e.code === 'KeyR') {
        resetToIdle()
        startRun()
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        stateRef.current.dinoDuck = true
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        stateRef.current.dinoDuck = false
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [jump, resetToIdle, startRun])

  // 主循环：物理 + 渲染
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = GAME_W * dpr
    canvas.height = GAME_H * dpr
    canvas.style.width = '100%'
    canvas.style.height = 'auto'
    ctx.scale(dpr, dpr)

    const s = stateRef.current
    // 初始化最高分
    s.highScore = highScore

    const spawnObstacle = () => {
      const r = Math.random()
      let h: number
      if (r < 0.55) h = 30
      else if (r < 0.9) h = 50
      else h = 70
      const w = h === 70 ? 16 : h === 50 ? 18 : 12
      s.obstacles.push({ x: GAME_W + 10, w, h })
    }

    const drawDino = () => {
      const duck = s.dinoDuck && s.dinoY <= 0.5
      const dinoX = 50
      // 站姿 62×40，下蹲 72×22（横向压扁）
      const dinoW = duck ? 72 : 62
      const dinoH = duck ? 22 : 40
      const baseY = GROUND_Y - s.dinoY
      const dy = baseY - dinoH

      ctx.fillStyle = '#1a1a1a'

      if (duck) {
        // 下蹲：身体压扁成横向长条，头仍在右上方，腿变成扁脚
        // 尾巴
        ctx.fillRect(dinoX - 2, dy + 10, 8, 6)
        // 身体（扁宽）
        ctx.fillRect(dinoX + 7, dy + 8, 50, 10)
        // 头（仍明显高出身体）
        ctx.fillRect(dinoX + dinoW - 27, dy + 0, 24, 16)
        // 嘴（张开的缺口，背景色）
        ctx.fillStyle = '#f7f0dd'
        ctx.fillRect(dinoX + dinoW - 7, dy + 10, 8, 3)
        ctx.fillStyle = '#1a1a1a'
        // 眼睛（白方块 + 黑瞳）
        ctx.fillStyle = '#f7f0dd'
        ctx.fillRect(dinoX + dinoW - 17, dy + 3, 4, 4)
        ctx.fillStyle = '#1a1a1a'
        ctx.fillRect(dinoX + dinoW - 16, dy + 4, 2, 2)
        // 小短手（霸王龙特征）
        ctx.fillRect(dinoX + dinoW - 22, dy + 12, 3, 5)
        // 两只扁脚
        ctx.fillRect(dinoX + 15, dy + 16, 6, 6)
        ctx.fillRect(dinoX + 32, dy + 16, 6, 6)
      } else {
        // 站立：按 hero 图标比例放大 ~1.7×
        // 尾巴（左下小尾巴）
        ctx.fillRect(dinoX - 2, dy + 20, 8, 8)
        // 身体（横向长方形）
        ctx.fillRect(dinoX + 7, dy + 15, 37, 15)
        // 头（明显高出身体）
        ctx.fillRect(dinoX + 34, dy + 0, 27, 20)
        // 嘴（张开的缺口，背景色）
        ctx.fillStyle = '#f7f0dd'
        ctx.fillRect(dinoX + 51, dy + 15, 10, 5)
        ctx.fillStyle = '#1a1a1a'
        // 眼睛（白方块 + 黑瞳）
        ctx.fillStyle = '#f7f0dd'
        ctx.fillRect(dinoX + 41, dy + 5, 5, 5)
        ctx.fillStyle = '#1a1a1a'
        ctx.fillRect(dinoX + 42, dy + 6, 3, 3)
        // 小短手（霸王龙特征）
        ctx.fillRect(dinoX + 37, dy + 20, 3, 7)
        // 两条后腿（着地时摆动，空中/死亡时并拢）
        if (s.dinoY <= 0.5 && s.phase === 'running') {
          const f = Math.floor(s.legFrame) % 2
          const off1 = f === 0 ? 0 : 4
          const off2 = f === 0 ? 4 : 0
          ctx.fillRect(dinoX + 17, dy + 30 + off1, 5, 10 - off1)
          ctx.fillRect(dinoX + 34, dy + 30 + off2, 5, 10 - off2)
        } else {
          // 空中/死亡：两条腿并拢伸直
          ctx.fillRect(dinoX + 17, dy + 30, 5, 10)
          ctx.fillRect(dinoX + 34, dy + 30, 5, 10)
        }
      }
    }

    const drawObstacle = (o: Obstacle) => {
      const baseY = GROUND_Y - o.h
      ctx.fillStyle = '#1a1a1a'
      // trunk
      ctx.fillRect(o.x + 4, baseY, o.w - 8, o.h)
      // arms
      ctx.fillRect(o.x, baseY + 6, 4, 10)
      ctx.fillRect(o.x + o.w - 4, baseY + 10, 4, 12)
      // top spikes
      ctx.fillRect(o.x + 2, baseY - 4, 4, 4)
      ctx.fillRect(o.x + o.w - 6, baseY - 4, 4, 4)
    }

    const drawGround = () => {
      ctx.fillStyle = '#1a1a1a'
      ctx.fillRect(0, GROUND_Y, GAME_W, 2)
      const tickSpacing = 20
      const offset = s.groundOffset % tickSpacing
      ctx.fillStyle = 'rgba(26, 26, 26, 0.45)'
      for (let x = -offset; x < GAME_W; x += tickSpacing) {
        ctx.fillRect(x, GROUND_Y + 4, 1, 4)
      }
    }

    const drawClouds = () => {
      ctx.fillStyle = 'rgba(26, 26, 26, 0.08)'
      const cloudSpacing = 180
      const off = s.cloudOffset % cloudSpacing
      for (let x = -off; x < GAME_W + 100; x += cloudSpacing) {
        ctx.fillRect(x, 30, 30, 4)
        ctx.fillRect(x + 6, 26, 18, 4)
        ctx.fillRect(x + 4, 34, 22, 4)
      }
    }

    const drawScore = () => {
      const text = String(Math.floor(s.score)).padStart(5, '0')
      ctx.fillStyle = '#1a1a1a'
      ctx.font = '700 16px "JetBrains Mono", monospace'
      ctx.textAlign = 'right'
      ctx.fillText(text, GAME_W - 14, 30)
      ctx.font = '500 9px "JetBrains Mono", monospace'
      ctx.fillStyle = 'rgba(26, 26, 26, 0.55)'
      ctx.fillText('HI  ' + String(Math.floor(s.highScore)).padStart(5, '0'), GAME_W - 14, 44)
    }

    const drawOverlay = (lines: { text: string; y: number; size: number; weight?: string; color?: string }[]) => {
      ctx.fillStyle = 'rgba(244, 239, 230, 0.86)'
      ctx.fillRect(0, 0, GAME_W, GAME_H)
      ctx.textAlign = 'center'
      for (const l of lines) {
        ctx.fillStyle = l.color || '#1a1a1a'
        ctx.font = `${l.weight || '900'} ${l.size}px ${l.size >= 18 ? '"Fraunces", serif' : '"JetBrains Mono", monospace'}`
        ctx.fillText(l.text, GAME_W / 2, l.y)
      }
    }

    const checkCollision = (o: Obstacle) => {
      const duck = s.dinoDuck && s.dinoY <= 0.5
      const dinoX = 50
      const dinoW = duck ? 72 : 62
      const dinoH = duck ? 22 : 40
      const dinoY = GROUND_Y - s.dinoY - dinoH
      // 缩小 hitbox 让判定更宽容
      const padX = 6
      const padY = 4
      const ax = dinoX + padX
      const ay = dinoY + padY
      const aw = dinoW - padX * 2
      const ah = dinoH - padY * 2
      const bx = o.x + 3
      const by = GROUND_Y - o.h + 3
      const bw = o.w - 6
      const bh = o.h - 6
      return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by
    }

    const update = () => {
      s.legFrame += 0.22
      s.groundOffset += s.speed
      s.cloudOffset += s.speed * 0.15

      if (s.phase === 'running') {
        // physics
        s.dinoVY += GRAVITY
        s.dinoY -= s.dinoVY
        if (s.dinoY < 0) {
          s.dinoY = 0
          s.dinoVY = 0
        }
        // spawn obstacles
        s.spawnTimer--
        if (s.spawnTimer <= 0) {
          spawnObstacle()
          s.spawnTimer = 55 + Math.floor(Math.random() * 70)
        }
        // move obstacles
        for (const o of s.obstacles) o.x -= s.speed
        s.obstacles = s.obstacles.filter((o) => o.x + o.w > -20)
        // collision
        for (const o of s.obstacles) {
          if (checkCollision(o)) {
            s.phase = 'dead'
            if (s.score > s.highScore) {
              s.highScore = s.score
              localStorage.setItem(STORAGE_KEY, String(s.highScore))
              setHighScore(s.highScore)
            }
            break
          }
        }
        // score & speed
        s.score += 0.2
        s.speed = Math.min(MAX_SPEED, START_SPEED + s.score / 100)
        if (Math.floor(s.score) % 20 === 0 && Math.floor(s.score) > 0) {
          setScore(Math.floor(s.score))
        }
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, GAME_W, GAME_H)
      // 纸面背景
      ctx.fillStyle = '#f7f0dd'
      ctx.fillRect(0, 0, GAME_W, GAME_H)
      // 极淡网格
      ctx.strokeStyle = 'rgba(26, 26, 26, 0.04)'
      ctx.lineWidth = 1
      for (let x = 0; x < GAME_W; x += 40) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, GAME_H)
        ctx.stroke()
      }
      drawClouds()
      drawGround()
      for (const o of s.obstacles) drawObstacle(o)
      drawDino()
      drawScore()

      if (s.phase === 'idle') {
        drawOverlay([
          { text: 'PRESS  SPACE  TO  RUN', y: GAME_H / 2 - 6, size: 17, weight: '900' },
          { text: 'OR  TAP  THE  SCREEN', y: GAME_H / 2 + 18, size: 10, weight: '500' },
          { text: '↑  JUMP    ↓  DUCK    R  RESET', y: GAME_H / 2 + 40, size: 9, weight: '500', color: 'rgba(26,26,26,0.55)' },
        ])
      }
      if (s.phase === 'dead') {
        drawOverlay([
          { text: 'GAME  OVER', y: GAME_H / 2 - 22, size: 26, weight: '900' },
          { text: 'SCORE  ' + String(Math.floor(s.score)).padStart(5, '0'), y: GAME_H / 2 + 4, size: 12, weight: '700' },
          { text: 'HI    ' + String(Math.floor(s.highScore)).padStart(5, '0'), y: GAME_H / 2 + 22, size: 12, weight: '700' },
          { text: 'PRESS  R  OR  TAP  TO  RETRY', y: GAME_H / 2 + 50, size: 9, weight: '500', color: 'rgba(26,26,26,0.55)' },
        ])
      }
    }

    const tick = () => {
      update()
      draw()
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(rafRef.current)
  }, [highScore])

  const onCanvasPointer = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault()
      const s = stateRef.current
      if (s.phase === 'idle' || s.phase === 'dead') {
        startRun()
      } else {
        jump()
      }
    },
    [startRun, jump]
  )

  return (
    <div className="trex">
      <div className="trex__frame">
        <canvas
          ref={canvasRef}
          className="trex__canvas"
          onClick={onCanvasPointer}
          onTouchStart={onCanvasPointer}
          aria-label="小恐龙跑酷游戏：按空格或点击屏幕跳跃"
        />
        <div className="trex__corner trex__corner--tl" aria-hidden="true" />
        <div className="trex__corner trex__corner--tr" aria-hidden="true" />
        <div className="trex__corner trex__corner--bl" aria-hidden="true" />
        <div className="trex__corner trex__corner--br" aria-hidden="true" />
      </div>
      <div className="trex__hud">
        <div className="trex__hud-item">
          <span className="trex__hud-label">SCORE</span>
          <span className="trex__hud-value">{String(score).padStart(5, '0')}</span>
        </div>
        <div className="trex__hud-item">
          <span className="trex__hud-label">HI</span>
          <span className="trex__hud-value">{String(highScore).padStart(5, '0')}</span>
        </div>
        <div className="trex__hud-item trex__hud-item--right">
          <span className="trex__hud-hint">SPACE · TAP</span>
        </div>
      </div>
    </div>
  )
}
