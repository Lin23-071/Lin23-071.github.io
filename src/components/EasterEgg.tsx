import { useEffect, useState } from 'react'
import './EasterEgg.css'

const TARGET = '071'
const WINDOW_SIZE = 12 // 监听最近 N 个按键

export default function EasterEgg() {
  const [burstKey, setBurstKey] = useState(0)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const buf: string[] = []
    const onKey = (e: KeyboardEvent) => {
      // 只取字符键，忽略功能键
      if (e.key.length === 1) {
        buf.push(e.key.toLowerCase())
        if (buf.length > WINDOW_SIZE) buf.shift()
        const joined = buf.join('')
        if (joined.includes(TARGET)) {
          trigger()
          buf.length = 0
        }
      }
    }
    const trigger = () => {
      setBurstKey((k) => k + 1)
      setActive(true)
      window.setTimeout(() => setActive(false), 2400)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // 浮动小恐龙 emoji 雨
  const items = Array.from({ length: 18 }, (_, i) => ({
    id: `${burstKey}-${i}`,
    left: Math.random() * 100,
    delay: Math.random() * 0.6,
    duration: 2.2 + Math.random() * 1.2,
    size: 18 + Math.random() * 22,
    rotate: (Math.random() - 0.5) * 60,
  }))

  return (
    <div className={`egg ${active ? 'is-active' : ''}`} aria-hidden="true">
      <div className="egg__toast">
        <span className="egg__toast-emoji">🦖</span>
        <span className="egg__toast-text">找到我了！欢迎欢迎。</span>
      </div>
      <div className="egg__rain">
        {active &&
          items.map((it) => (
            <span
              key={it.id}
              className="egg__dino"
              style={{
                left: `${it.left}%`,
                animationDelay: `${it.delay}s`,
                animationDuration: `${it.duration}s`,
                fontSize: `${it.size}px`,
                transform: `rotate(${it.rotate}deg)`,
              }}
            >
              🦖
            </span>
          ))}
      </div>
    </div>
  )
}
