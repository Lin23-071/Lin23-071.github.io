import { useEffect, useRef } from 'react'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*<>/\\[]{}'

/**
 * 标题解码动效：进入视口时文字从随机字符逐字"解码"成真实内容。
 * 参考 CliVigil polish.js 的 title decode，reduce-motion 时直接跳过。
 */
export function useDecode<T extends HTMLElement>(text: string, duration = 900) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let done = false

    const run = () => {
      const start = performance.now()
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / duration)
        const revealed = Math.floor(p * text.length)
        let out = ''
        for (let i = 0; i < text.length; i++) {
          const ch = text[i]
          out += i < revealed || ch === ' '
            ? ch
            : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        }
        el.textContent = out
        if (p < 1) raf = requestAnimationFrame(step)
        else el.textContent = text
      }
      raf = requestAnimationFrame(step)
    }

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !done) {
          done = true
          run()
          obs.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    obs.observe(el)

    return () => {
      obs.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [text, duration])

  return ref
}
