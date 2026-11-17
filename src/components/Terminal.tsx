import { useEffect, useRef, useState } from 'react'
import { collect, collectedList, hasStardust, STARDUST_TOTAL } from '../state/collect'

interface Line {
  kind: 'in' | 'out' | 'err'
  text: string
  /** 有链接时把整行渲染成可点的 <a> */
  href?: string
}

const BANNER = [
  'LIN071 TERMINAL v0.2',
  '输入 help 查看可用命令。',
]

function runCommand(raw: string): { lines: Line[]; collected?: string } {
  const cmd = raw.trim().toLowerCase()
  if (!cmd) return { lines: [] }

  if (cmd === 'help') {
    return {
      lines: [
        { kind: 'out', text: 'ls         列出这个站点里的东西' },
        { kind: 'out', text: 'whoami     我是谁' },
        { kind: 'out', text: 'cv         打开网页版档案' },
        { kind: 'out', text: 'stardust   查看已收集的星星' },
        { kind: 'out', text: 'hint       给一点提示' },
        { kind: 'out', text: 'clear      清屏' },
      ],
    }
  }
  if (cmd === 'ls') {
    return {
      lines: [
        { kind: 'out', text: 'works/    now/    about/    contact/    cv.html' },
      ],
    }
  }
  if (cmd === 'whoami') {
    return {
      lines: [
        { kind: 'out', text: '林巧 / Lin Qiao · @Lin23-071' },
        { kind: 'out', text: '哈工深（深圳）· 计算机与电子通信 · 辅修经济学' },
      ],
    }
  }
  if (cmd === 'cv') {
    const first = !hasStardust('cv')
    if (first) collect('cv')
    return {
      lines: [
        { kind: 'out', text: '详见，最近修改2026.11：' },
        { kind: 'out', text: '→ /cv.html　（点这行打开）', href: '/cv.html' },
        { kind: 'out', text: '教育 / 奖项 / 实习 / 项目 / 技能 / 联系 · 可打印成 PDF' },
        ...(first ? [{ kind: 'out' as const, text: '✦ 一枚星星落进了口袋' }] : []),
      ],
    }
  }
  if (cmd === 'stardust') {
    const ids = collectedList()
    if (ids.length === 0) {
      return { lines: [{ kind: 'out', text: `还没有星星。这个站里藏着 ${STARDUST_TOTAL} 枚。` }] }
    }
    return {
      lines: [
        { kind: 'out', text: `已收集 ${ids.length}/${STARDUST_TOTAL}：` },
        ...ids.map((id) => ({ kind: 'out' as const, text: `  ✦ ${id}` })),
      ],
    }
  }
  if (cmd === 'hint') {
    return {
      lines: [
        { kind: 'out', text: '随意探索页面，enjoy，:D' },
        { kind: 'out', text: '更多未知命令，可随意尝试' },
      ],
    }
  }
  if (cmd === 'sudo make me a sandwich' || cmd.startsWith('sudo ')) {
    const first = !hasStardust('sudo')
    if (first) collect('sudo')
    return {
      lines: [{ kind: 'out', text: 'okay. 🥪（一枚星星飘进了你的口袋）' }],
      collected: first ? 'sudo' : undefined,
    }
  }
  if (cmd === 'clear') return { lines: [] }

  return { lines: [{ kind: 'err', text: `command not found: ${cmd}` }] }
}

interface TerminalProps {
  open: boolean
  onClose: () => void
}

export default function Terminal({ open, onClose }: TerminalProps) {
  const [lines, setLines] = useState<Line[]>(BANNER.map((t) => ({ kind: 'out', text: t })))
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  // 首次呼出终端 = 收集一枚星星
  useEffect(() => {
    if (open) {
      collect('terminal')
      inputRef.current?.focus()
    }
  }, [open])

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [lines, open])

  const submit = () => {
    const v = value
    setValue('')
    if (!v.trim()) return
    const { lines: out } = runCommand(v)
    const echo: Line = { kind: 'in', text: v }
    setLines((prev) => {
      const next = v.trim().toLowerCase() === 'clear' ? [] : prev
      return [...next, echo, ...out]
    })
  }

  if (!open) return null

  return (
    <div className="terminal" role="dialog" aria-label="隐藏终端">
      <div className="terminal__head">
        <span>lin071:~ — terminal</span>
        <button type="button" className="terminal__close" onClick={onClose} aria-label="关闭终端">
          ✕
        </button>
      </div>
      <div className="terminal__body" ref={bodyRef}>
        {lines.map((l, i) => (
          <div key={i} className={`terminal__line terminal__line--${l.kind}`}>
            {l.kind === 'in'
              ? `lin071:~$ ${l.text}`
              : l.href
                ? <a href={l.href}>{l.text}</a>
                : l.text}
          </div>
        ))}
      </div>
      <div className="terminal__input">
        <span className="terminal__prompt">lin071:~$</span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
            if (e.key === 'Escape') onClose()
          }}
          spellCheck={false}
          autoComplete="off"
          aria-label="终端命令输入"
        />
      </div>
    </div>
  )
}
