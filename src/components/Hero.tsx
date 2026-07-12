import { useState, useEffect } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'
import StickyNote from './StickyNote'
import './Hero.css'

interface HeroProps {
  onEgg?: () => void
}

export default function Hero({ onEgg }: HeroProps) {
  const [titleDone, setTitleDone] = useState(false)
  const titleText = useTypewriter('正在装修中。', 90)
  const [subTyped, setSubTyped] = useState('')
  const subText = 'Building something nice…'

  // 副标题打字
  useEffect(() => {
    if (!titleDone) return
    let i = 0
    const id = window.setInterval(() => {
      i++
      setSubTyped(subText.slice(0, i))
      if (i >= subText.length) window.clearInterval(id)
    }, 50)
    return () => window.clearInterval(id)
  }, [titleDone, subText])

  // 标题完成后切状态
  useEffect(() => {
    if (titleText.length >= 6) {
      const t = setTimeout(() => setTitleDone(true), 200)
      return () => clearTimeout(t)
    }
  }, [titleText])

  // 标题点击 3 次触发彩蛋
  const [titleClicks, setTitleClicks] = useState(0)
  const handleTitleClick = () => {
    const n = titleClicks + 1
    setTitleClicks(n)
    if (n >= 3) {
      setTitleClicks(0)
      onEgg?.()
    }
  }

  return (
    <header className="hero">
      {/* 左上角 #1 编号 */}
      <div className="hero__index" aria-hidden="true">
        <span className="hero__index-num">01</span>
        <span className="hero__index-divider" />
        <span className="hero__index-label">CURRENT STATUS</span>
      </div>

      {/* 右上角便签 */}
      <StickyNote
        text={'新版本正在打磨中，欢迎常来溜达 ✦'}
        signature="— 071"
        variant="yellow"
        rotation={5}
        withTape
        className="hero__note hero__note--tl"
        enterDelay={900}
      />

      {/* 主标题 */}
      <h1 className="hero__title" onClick={handleTitleClick} title="再点 2 下试试">
        <span className="hero__title-cursor" aria-hidden="true" />
        {titleText}
        <span className="hero__title-handwritten" aria-hidden="true">
          in progress
        </span>
      </h1>

      {/* 副标 */}
      <p className="hero__subtitle">
        <span className="hero__subtitle-prefix" aria-hidden="true">→</span>
        {subTyped}
        {titleDone && subTyped.length < subText.length && <span className="hero__cursor" />}
      </p>

      {/* 说明段 */}
      <p className="hero__desc">
        正在重写这一版——做完之后会有更多东西。
        <br />
        而今迈步从头越。
      </p>

      {/* 互动小游戏提示：明确告诉访客"下面有得玩" */}
      <a className="hero__game-hint" href="#play">
        <span className="hero__game-hint-dino" aria-hidden="true">
          <svg viewBox="0 0 40 26" width="40" height="26">
            <g fill="var(--ink)">
              {/* 尾巴：左下小尾巴 */}
              <rect x="0" y="12" width="5" height="5" />
              {/* 身体：横向长方形（霸王龙比例：长 > 高） */}
              <rect x="4" y="9" width="22" height="9" />
              {/* 头：靠在身体右上方，明显高出身体 */}
              <rect x="20" y="0" width="16" height="12" />
              {/* 张开的大嘴：嘴是张开的缺口，不是尖喙 */}
              <rect x="31" y="9" width="6" height="3" fill="var(--bg)" />
              {/* 眼睛：白色方块 */}
              <rect x="24" y="3" width="3" height="3" fill="var(--bg)" />
              <rect x="25" y="4" width="2" height="2" />
              {/* 小短手（霸王龙特征） */}
              <rect x="22" y="12" width="2" height="4" />
              {/* 两条后腿 */}
              <rect x="10" y="18" className="hero__dino-leg" width="3" height="6" />
              <rect x="20" y="18" className="hero__dino-leg" width="3" height="6" />
            </g>
          </svg>
        </span>
        <span className="hero__game-hint-text">
          下面有一只可以玩的小恐龙
        </span>
        <span className="hero__game-hint-arrow" aria-hidden="true">↓</span>
      </a>

      {/* 右侧竖排：施工中标签 */}
      <aside className="hero__side-tag" aria-hidden="true">
        <span>WORK</span>
        <span>IN</span>
        <span>PROGRESS</span>
      </aside>

      {/* 左侧底部：版本号 + 卷尺 */}
      <div className="hero__meta">
        <div className="hero__version">
          <span className="hero__version-label">VER</span>
          <span className="hero__version-num">26.07_3.0.0</span>
          <span className="hero__version-soon">is coming</span>
        </div>
        <div className="hero__ruler" aria-hidden="true">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className={`hero__ruler-tick ${i % 4 === 0 ? 'is-major' : ''}`} />
          ))}
        </div>
      </div>

      {/* 漂浮便签 */}
      <StickyNote
        text={'预计…很快（吧）'}
        variant="persimmon"
        rotation={-7}
        className="hero__note hero__note--br"
        enterDelay={1200}
      />
    </header>
  )
}
