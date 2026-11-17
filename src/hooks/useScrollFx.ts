import { useEffect, useState } from 'react'

export type ThemeName = 'theme-ink' | 'theme-paper' | 'theme-electric'

/**
 * 全站滚动效果：
 * 1) .rv--s / .rv-line--s 进入视口时加 .is-in
 * 2) 带 data-theme 的区块穿过视口中线时，把对应主题类切到 <body>
 * 3) 顶栏滚过阈值时加 .is-scrolled
 */
export function useScrollFx(sectionCount: number) {
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [theme, setTheme] = useState<ThemeName>('theme-ink')
  const [activeId, setActiveId] = useState('top')

  useEffect(() => {
    const revealEls = document.querySelectorAll('.rv--s, .rv-line--s, .rv-frame')
    const revealObs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            revealObs.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    revealEls.forEach((el) => revealObs.observe(el))

    let ticking = 0

    const measure = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? (y / max) * 100 : 0)

      // 每次读当前 DOM：HMR / 重渲染后挂载时的快照会指向已移除的旧节点
      const probe = 36
      const host = Array.from(document.querySelectorAll('[data-theme]')).find((el) => {
        if (!el.isConnected) return false
        const r = el.getBoundingClientRect()
        return r.top <= probe && r.bottom > probe
      })
      if (host) setTheme(`theme-${host.getAttribute('data-theme')}` as ThemeName)

      // 顶栏导航高亮：哪个区块的顶边越过视口上沿
      let cur = 'top'
      for (const id of ['works', 'now', 'about', 'contact']) {
        const el = document.getElementById(id)
        if (el && el.isConnected && el.getBoundingClientRect().top <= 140) cur = id
      }
      setActiveId(cur)
    }

    const onScroll = () => {
      if (ticking) return
      ticking = requestAnimationFrame(() => {
        ticking = 0
        measure()
      })
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      revealObs.disconnect()
      window.removeEventListener('scroll', onScroll)
      if (ticking) cancelAnimationFrame(ticking)
    }
  }, [sectionCount])

  // 主题写到 <body>，仅用于顶栏等区块外元素的配色
  useEffect(() => {
    document.body.className = theme
  }, [theme])

  return { scrolled, progress, activeId }
}
