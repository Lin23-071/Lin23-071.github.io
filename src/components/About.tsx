import { useEffect, useRef, useState } from 'react'
import HalftoneWave from './HalftoneWave'
import { useDecode } from '../hooks/useDecode'
import { collect } from '../state/collect'
import { TOOLKIT } from '../data/cv'

/** 项目之外的三个身份，刻意不带数字 */
const HUMAN = [
  { value: '运动', note: '足球&乒羽网&跑步&游泳' },
  { value: '表达', note: '或许算半个业余辩手&画画&音乐' },
  { value: 'INFJ', note: 'but人是复杂的，警惕标签' },
]

/** 长期兴趣：半年后还成立，所以放在 About 而不是 Now */
const INTERESTS = [
  '吉他 音乐',
  '绘画和手作',
  '足球 羽毛球',
  '跑步 游泳 乒乓球 网球',
  '业余辩手',
  '尝试各类AI工具',
  '探索更多',
]

/** 左下角的照片堆：点击翻一翻，顶层翻回最底下 */
const STACK = [
  { src: '/about-fig.jpg', alt: '手绘：背粉色背包、戴耳机仰头发问的小人' },
  { src: '/about-shuttle.jpg', alt: '羽毛球场上并排的两支球拍与一颗球' },
  { src: '/about-run.jpg', alt: '跑步、足球场与乒乓球的运动合辑' },
  { src: '/about-circuit.jpg', alt: '戴红框眼镜的动画角色正在焊电路板' },
]

/** About（黑 · 响区）：项目之外的部分；完整履历收在 /cv.html */
export default function About() {
  const tagRef = useDecode<HTMLSpanElement>('04 / About')
  const [stack, setStack] = useState([0, 1, 2, 3])
  /** 正在甩出的那张：先飞出画面淡出，归位到堆底时才重排，避开 z-index 瞬切 */
  const [flying, setFlying] = useState<number | null>(null)
  const flyTimer = useRef<number | null>(null)

  useEffect(() => () => {
    if (flyTimer.current) window.clearTimeout(flyTimer.current)
  }, [])

  const shuffle = () => {
    if (flying !== null) return
    setFlying(stack[3])
    flyTimer.current = window.setTimeout(() => {
      const next = [stack[3], stack[0], stack[1], stack[2]]
      setStack(next)
      // 翻完一整轮回原位 = 一枚星星
      if (next[0] === 0 && next[1] === 1 && next[2] === 2 && next[3] === 3) collect('stack')
      setFlying(null)
    }, 200)
  }

  return (
    <section className="section about" id="about" data-theme="ink">
      <HalftoneWave />
      <div className="about__veil" aria-hidden="true" />
      <div className="section__inner about__inner">
        <div className="section__head">
          <span className="section__tag rv--s" ref={tagRef}>04 / About</span>
          <div>
            <h2 className="section__title rv--s" style={{ '--d': '.05s' } as React.CSSProperties}>
              SOMETHING
            </h2>
            <p className="section__sub rv--s" style={{ '--d': '.1s' } as React.CSSProperties}>
              Among countless choices,walk towards yourself.
            </p>
          </div>
        </div>

        <hr className="section__rule rv-line--s" />

        <ul className="about__human rv--s" style={{ '--d': '.14s' } as React.CSSProperties}>
          {HUMAN.map((h) => (
            <li key={h.value}>
              <b className="about__human-value">{h.value}</b>
              <span className="about__human-note">{h.note}</span>
            </li>
          ))}
        </ul>

        <div className="about__grid">
          <div className="about__intro rv--s" style={{ '--d': '.15s' } as React.CSSProperties}>
            <p className="about__quote">Stay hungry, stay foolish.<br />Seek more, live <em>more</em>.</p>
            <p className="about__text">
              在学习和工作之外，看见生活本身和外部世界。
              <br /><br />
              做很多事情的时候其实都是兴趣驱动的，或者说对很多很多事情都还抱有好奇心，还有很多很多想尝试的事情，即使它们可能在某种意义上是很无聊的工作，但是每每尝试新的事情，进入新的领域，从小白变成熟手的过程中，似乎就打开了理解某些事情的一个新的视角，或者是和以往其他领域的经验产生一种意料之外的共振。
              <br /><br />
              希望能一直保持这样的好奇和耐心，慢慢发现更多有趣的事情。做一个有趣的、好玩的人。
            </p>
            <a className="about__cv-link" href="/cv.html">
              看完整档案 / CV <span aria-hidden="true">↗</span>
            </a>

            <div
              className="about__stack rv--s"
              style={{ '--d': '.3s' } as React.CSSProperties}
              role="button"
              tabIndex={0}
              aria-label="生活照片堆：手绘、羽毛球、运动与日常，点击翻看下一张"
              onClick={shuffle}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  shuffle()
                }
              }}
            >
              {stack.map((pi, pos) => (
                <figure
                  key={STACK[pi].src}
                  className={`about__stack-item${flying === pi ? ' is-flying' : ''}`}
                  data-pos={pos}
                >
                  <img src={STACK[pi].src} alt={STACK[pi].alt} loading="lazy" />
                </figure>
              ))}
              <p className="about__stack-note">PHOTO STACK · 点击翻一翻</p>
            </div>
          </div>

          <div className="about__side">
            <figure className="about__portrait rv--s" style={{ '--d': '.2s' } as React.CSSProperties}>
              <img
                src="/about-sketch.jpg"
                alt="手绘拍立得：窝在沙发里用电脑的日常速写"
                loading="lazy"
              />
              <figcaption>SKETCH · 2025.07.26 IN SH.</figcaption>
            </figure>
            <div className="about__block rv--s" style={{ '--d': '.24s' } as React.CSSProperties}>
              <h3 className="about__label">TOOLKIT / 常用</h3>
              <ul className="about__tags">
                {TOOLKIT.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </div>

            <div className="about__block rv--s" style={{ '--d': '.34s' } as React.CSSProperties}>
              <h3 className="about__label">OFF HOURS / 兴趣</h3>
              <ul className="about__tastes">
                {INTERESTS.map((t) => (
                  <li key={t}>
                    <b>{t}</b>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
