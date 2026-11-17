import { useRef } from 'react'
import { useDecode } from '../hooks/useDecode'
import { useMagnetic } from '../hooks/useMagnetic'
import { collect } from '../state/collect'

interface ContactItem {
  label: string
  value: string
  hint: string
  href?: string
}

const CONTACTS: ContactItem[] = [
  { label: 'GITHUB', value: '@Lin23-071', hint: '代码与项目', href: 'https://github.com/Lin23-071' },
  { label: 'EMAIL', value: '2024311515@stu.hit.edu.cn', hint: '点一下复制' },
  { label: 'QQ', value: '2236659454', hint: '点一下复制' },
  { label: 'WECHAT', value: 'L13376987385', hint: '点一下复制' },
]

function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useMagnetic<HTMLDivElement>()
  return <div className="contact__magnet" ref={ref}>{children}</div>
}

/** 联系区（蓝 · 响区）：GitHub 直跳，其余点击复制 */
export default function Contact() {
  const timerRef = useRef<number | null>(null)
  const tagRef = useDecode<HTMLSpanElement>('05 / Contact')

  const copy = async (item: ContactItem, el: HTMLElement) => {
    const text = item.value
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      el.classList.add('is-copied')
      const first = collect('contact') // 第一次复制联系方式 = 一枚星星
      const hint = el.querySelector('.contact-cell__hint')
      if (hint) hint.textContent = first ? '已复制 ✓ ✦' : '已复制 ✓'
      if (timerRef.current) window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => {
        el.classList.remove('is-copied')
        const hint = el.querySelector('.contact-cell__hint')
        if (hint) hint.textContent = item.hint
      }, 1400)
    } catch {
      // 复制失败静默降级
    }
  }

  return (
    <section className="section contact" id="contact" data-theme="electric">
      <div className="section__inner">
        <div className="section__head">
          <span className="section__tag rv--s" ref={tagRef}>05 / Contact</span>
          <div>
            <h2 className="section__title rv--s" style={{ '--d': '.05s' } as React.CSSProperties}>
              联系方式
            </h2>
          </div>
        </div>

        <hr className="section__rule rv-line--s" />

        <div className="contact__grid">
          {CONTACTS.map((c, i) => (
            <div key={c.label} className="rv--s" style={{ '--d': `${0.15 + i * 0.08}s` } as React.CSSProperties}>
              <Magnetic>
              {c.href ? (
                <a
                  className="contact-cell"
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="contact-cell__label">{c.label}</span>
                  <span className={`contact-cell__value ${c.value.length > 16 ? 'is-long' : ''}`}>{c.value}</span>
                  <span className="contact-cell__hint">{c.hint}</span>
                </a>
              ) : (
                <button
                  type="button"
                  className="contact-cell"
                  onClick={(e) => copy(c, e.currentTarget)}
                >
                  <span className="contact-cell__label">{c.label}</span>
                  <span className={`contact-cell__value ${c.value.length > 16 ? 'is-long' : ''}`}>{c.value}</span>
                  <span className="contact-cell__hint">{c.hint}</span>
                </button>
              )}
              </Magnetic>
            </div>
          ))}
        </div>

        <p className="contact__note rv--s" style={{ '--d': '.4s' } as React.CSSProperties}>
          * 学校邮箱、微信、QQ 都能找到我；欢迎联系
        </p>
      </div>
    </section>
  )
}
