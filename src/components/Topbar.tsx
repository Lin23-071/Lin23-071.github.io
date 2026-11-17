import { STARDUST_TOTAL, collectedList, useStardustVersion } from '../state/collect'

interface TopbarProps {
  scrolled: boolean
  activeId: string
  onTerminal: () => void
}

const NAV = [
  { href: '#works', label: 'Works', key: 'works' },
  { href: '#now', label: 'Now', key: 'now' },
  { href: '#about', label: 'About', key: 'about' },
  { href: '#contact', label: 'Contact', key: 'contact' },
]

export default function Topbar({ scrolled, activeId, onTerminal }: TopbarProps) {
  useStardustVersion()
  const count = collectedList().length

  return (
    <header className={`topbar ${scrolled ? 'is-scrolled' : ''}`}>
      <a className="topbar__brand" href="#top">
        <span className="brand__dot" aria-hidden="true" />
        <span>Lin071</span>
      </a>

      <nav className="topbar__nav" aria-label="页面导航">
        {NAV.map((n) => (
          <a key={n.key} href={n.href} className={activeId === n.key ? 'is-active' : ''}>
            {n.label}
          </a>
        ))}
      </nav>

      <div className="topbar__right">
        <button
          type="button"
          className="cv-link topbar__term"
          onClick={onTerminal}
          title="呼出隐藏终端（快捷键 ` 或 ~）"
        >
          &gt;_ TERMINAL
        </button>
        <a className="cv-link" href="/cv.html" aria-label="查看网页版档案">
          CV <span aria-hidden="true">↗</span>
        </a>
        <button
          type="button"
          className="stardust-chip"
          onClick={onTerminal}
          title={`全站藏着 ${STARDUST_TOTAL} 枚星星，点击或按 ~ 呼出终端查看`}
        >
          <span className="stardust-chip__star" aria-hidden="true">✦</span>
          <span className="stardust-chip__count">{count}</span>
          <span>/ {STARDUST_TOTAL}</span>
        </button>
      </div>
    </header>
  )
}
