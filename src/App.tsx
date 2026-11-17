import { useEffect, useState } from 'react'
import Topbar from './components/Topbar'
import Hero from './components/Hero'
import Works from './components/Works'
import Marquee from './components/Marquee'
import Now from './components/Now'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Terminal from './components/Terminal'
import { useScrollFx } from './hooks/useScrollFx'
import { collect } from './state/collect'

export default function App() {
  const [termOpen, setTermOpen] = useState(false)
  const [nightToast, setNightToast] = useState(false)
  const { scrolled, progress, activeId } = useScrollFx(7)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const typing = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA'
      if (typing) return
      if (e.key === '`' || e.key === '~') {
        e.preventDefault()
        setTermOpen((v) => !v)
      }
      if (e.key === 'Escape' && termOpen) setTermOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [termOpen])

  // 首次访问：开场编排结束后自动呼出一次终端，让访客知道它的存在
  useEffect(() => {
    let seen = false
    try {
      seen = localStorage.getItem('071-term-seen') === '1'
    } catch {
      /* 隐私模式：视为未见过，本次会话内仍自动呼出 */
    }
    if (seen) return
    const timer = window.setTimeout(() => {
      setTermOpen(true)
      try {
        localStorage.setItem('071-term-seen', '1')
      } catch {
        /* ignore */
      }
    }, 4600)
    return () => window.clearTimeout(timer)
  }, [])

  // 深夜彩蛋：22:00–06:00 访问 = 一枚星星，右下角轻提示一次
  useEffect(() => {
    const h = new Date().getHours()
    if ((h >= 22 || h < 6) && collect('night')) {
      setNightToast(true)
      const t = window.setTimeout(() => setNightToast(false), 4600)
      return () => window.clearTimeout(t)
    }
  }, [])

  return (
    <>
      <div className="scroll-progress" style={{ width: `${progress}%` }} aria-hidden="true" />
      <Topbar scrolled={scrolled} activeId={activeId} onTerminal={() => setTermOpen(true)} />
      <main>
        <Hero />
        <Works />
        <Marquee />
        <Now />
        <About />
        <Contact />
      </main>
      <Footer />
      {nightToast && (
        <div className="night-toast" role="status">✦ 深夜好，一枚星星悄悄落进了口袋</div>
      )}
      <Terminal open={termOpen} onClose={() => setTermOpen(false)} />
    </>
  )
}
