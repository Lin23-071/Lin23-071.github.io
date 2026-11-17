import { useEffect, useState } from 'react'
import ChinaMap from './ChinaMap'

const WORDMARK = 'Lin 071'

/** hero 关键数字：在粒子收敛后段从 0 滚上来，机制对齐 CliVigil 的 countup */
const STATS = [
  { to: 10, suffix: '', label: 'Projects' },
  { to: 6, suffix: '', label: 'Awards' },
  { to: 1, suffix: '%', label: 'Outstanding Winner' },
]

function useCountup(startAtMs: number) {
  const [vals, setVals] = useState(() => STATS.map(() => '0'))
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVals(STATS.map((s) => `${s.to}${s.suffix}`))
      return
    }
    let raf = 0
    let origin: number | null = null
    const DUR = 1100
    const STAGGER = 110
    const timer = window.setTimeout(() => {
      const step = (now: number) => {
        if (origin === null) origin = now
        const e = now - origin
        setVals(
          STATS.map((s, i) => {
            const p = Math.min(1, Math.max(0, (e - i * STAGGER) / DUR))
            const eased = 1 - Math.pow(1 - p, 5)
            return `${Math.round(s.to * eased)}${s.suffix}`
          }),
        )
        if (e < DUR + STAGGER * (STATS.length - 1)) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, startAtMs)
    return () => {
      window.clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [startAtMs])
  return vals
}

export default function Hero() {
  const statVals = useCountup(2300)

  return (
    <section className="hero" id="top" data-theme="ink">
      {/* 全屏粒子中国地图：hero 的背景本身（对齐 CliVigil 的英雄页结构） */}
      <ChinaMap />
      <div className="hero__vignette" aria-hidden="true" />

      <div className="hero__inner">
        <div className="hero__mid">
          <p className="eyebrow hero__eyebrow rv" style={{ '--d': '.18s' } as React.CSSProperties}>
            HIT Shenzhen · CS / Economics · 2026
          </p>

          <h1 className="wordmark" aria-label={WORDMARK}>
            {WORDMARK.split('').map((ch, i) => (
              <span
                key={i}
                className="wordmark__ch"
                aria-hidden="true"
                style={{ '--d': `${1.3 + i * 0.055}s` } as React.CSSProperties}
              >
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
          </h1>

          <hr className="hero__rule rv-line" style={{ '--d': '2s' } as React.CSSProperties} />

          <p className="hero__lede rv" style={{ '--d': '2.16s' } as React.CSSProperties}>
            林巧，HITsz24级计算机与电子通信，主修计算机、辅修经济学
            <br />
            AI产品玩家&黑客松&游戏开发&软硬件&探索更多可能
          </p>

          <ul className="hero__facts rv" style={{ '--d': '2.34s' } as React.CSSProperties}>
            <li><b>2026 美赛 O 奖</b>全球前 1% · 队长</li>
            <li><b>腾讯云黑客松</b>华南 #3 · 769 分</li>
            <li><b>辩论校赛冠军</b>全程最佳辩手</li>
          </ul>
        </div>

        <div className="hero__bottom">
          <div className="hero__bottom-left">
            <div className="hero__stats rv" style={{ '--d': '2.3s' } as React.CSSProperties}>
              {STATS.map((s, i) => (
                <div className="hero__stat" key={s.label}>
                  <b>{statVals[i]}</b>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
            <div className="hero__credit rv" style={{ '--d': '2.44s' } as React.CSSProperties}>
              <strong>林巧 / Lin Qiao · @Lin23-071</strong>
              <br />
              哈尔滨工业大学（深圳）· 工科试验班（计算机与电子通信）
            </div>
          </div>
          <div className="scroll-cue rv" style={{ '--d': '2.6s' } as React.CSSProperties}>
            <span className="scroll-cue__line" aria-hidden="true" />
            <span>Scroll to explore</span>
          </div>
        </div>
      </div>
    </section>
  )
}
