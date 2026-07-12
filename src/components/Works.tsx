import { useState, useEffect, useRef } from 'react'
import './Works.css'

interface Work {
  id: string
  title: string
  subtitle: string
  description: string
  tags: string[]
  href: string
  featured?: boolean
}

interface Contact {
  label: string
  value: string
  hint: string
}

const WORKS: Work[] = [
  {
    id: '01',
    title: '番客：银信之海',
    subtitle: '腾讯云黑客松 · 叙事卡牌 · 华南#3',
    description:
      '以闽南潮汕侨批文化为背景的叙事卡牌游戏。线下路演腾讯云黑客松华南赛区第3名。',
    tags: ['hackathon', 'game', 'top3'],
    href: 'http://e429b064a45ba02257346c9c458727e3.tch.qcdntest.cn',
    featured: true,
  },
  {
    id: '02',
    title: '智能坐垫 WebApp',
    subtitle: 'WebApp · 前端 + IoT 概念',
    description:
      '坐姿监测 IoT 项目的前端 demo。没硬件时主要展示前端，手机比例更佳。',
    tags: ['webapp', 'iot', 'mobile'],
    href: 'https://project-objyw.vercel.app/',
  },
  {
    id: '03',
    title: 'PawPrint-爪印',
    subtitle: '30h hackathon · AI 知识管理',
    description:
      '针对"视频收藏吃灰"与宠物类信息的 AI 知识管理工具。30 小时极限可路演 demo 落地。',
    tags: ['hackathon', 'AI', '30h', 'demo'],
    href: 'https://traepet22j4.vercel.app/',
  },
  {
    id: '04',
    title: 'GitHub',
    subtitle: '@Lin23-071',
    description: '代码、想法、偶尔的小项目。',
    tags: ['profile'],
    href: 'https://github.com/Lin23-071',
  },
]

const CONTACTS: Contact[] = [
  { label: 'TELE', value: '13376987385', hint: '电话' },
  { label: 'QQ', value: '2236659454', hint: 'QQ' },
  { label: 'WECHAT', value: 'L13376987385', hint: '微信' },
]

export default function Works() {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const copiedTimerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) window.clearTimeout(copiedTimerRef.current)
    }
  }, [])

  const fallbackCopy = (text: string) => {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    try {
      document.execCommand('copy')
    } catch {
      // ignore
    }
    document.body.removeChild(ta)
  }

  const copyText = (text: string, onSuccess: () => void) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(onSuccess, () => {
        fallbackCopy(text)
        onSuccess()
      })
    } else {
      fallbackCopy(text)
      onSuccess()
    }
  }

  // 点击某个联系方式：复制该条 → 高亮 1.2s（每条独立）
  const handleContactClick = (idx: number, value: string) => {
    const flash = () => {
      setCopiedIdx(idx)
      if (copiedTimerRef.current) window.clearTimeout(copiedTimerRef.current)
      copiedTimerRef.current = window.setTimeout(() => setCopiedIdx(null), 1200)
    }
    copyText(value, flash)
  }

  const renderWorkCard = (w: Work) => (
    <li
      key={w.id}
      className={`work-card ${w.featured ? 'work-card--featured' : ''}`}
    >
      <a
        className="work-card__link"
        href={w.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${w.title} — ${w.subtitle}（新窗口打开）`}
      >
        <div className="work-card__top">
          <span className="work-card__id">#{w.id}</span>
          <span className="work-card__type">
            {w.featured ? '★ featured' : w.tags[0]}
          </span>
        </div>
        <h3 className="work-card__title">{w.title}</h3>
        <p className="work-card__sub">{w.subtitle}</p>
        <p className="work-card__desc">{w.description}</p>
        <div className="work-card__bottom">
          <ul className="work-card__tags">
            {w.tags.map((t) => (
              <li key={t} className="work-card__tag">{t}</li>
            ))}
          </ul>
          <span className="work-card__cta">
            VIEW
            <span className="work-card__arrow" aria-hidden="true">↗</span>
          </span>
        </div>
      </a>
    </li>
  )

  return (
    <section className="works" id="works">
      <div className="works__inner">
        <div className="works__head">
          <span className="works__tag">#03 · WORKS</span>
          <h2 className="works__title">做过的，和正在做的东西。</h2>
          <p className="works__desc">
            正式版 coming soon。
            <br />
            <em className="works__quote">Not all those who wander are lost.</em>
          </p>
        </div>

        <ul className="works__grid">
          {/* 前 3 张：番客（featured）/ 智能坐垫 / PawPrint */}
          {WORKS.slice(0, 3).map(renderWorkCard)}

          {/* 第 4 张：GitHub */}
          {WORKS.slice(3).map(renderWorkCard)}

          {/* 第 5 张：Find Me —— 与项目卡同尺寸（1 列宽），深色卡，3 个堆叠小卡 */}
          <li className="work-card work-card--contact">
            <div className="work-card__link work-card__link--contact">
              <div className="work-card__top">
                <span className="work-card__id">#05</span>
                <span className="work-card__type">↻ find me</span>
              </div>
              <p className="work-card__sub work-card__sub--contact">
                点哪条复制哪条
              </p>
              <div className="findme-list">
                {CONTACTS.map((c, i) => (
                  <button
                    key={c.label}
                    type="button"
                    className={`findme-cell ${copiedIdx === i ? 'is-copied' : ''}`}
                    onClick={() => handleContactClick(i, c.value)}
                    aria-label={`复制 ${c.label} ${c.value}`}
                  >
                    <span className="findme-cell__label">{c.label}</span>
                    <span className="findme-cell__value">{c.value}</span>
                    <span className="findme-cell__arrow" aria-hidden="true">
                      {copiedIdx === i ? '✓' : '→'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
  )
}
