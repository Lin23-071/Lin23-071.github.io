import { useMemo } from 'react'
import './ConstructionTape.css'

const STATUS_WORDS = [
  'UNDER CONSTRUCTION',
  '施工中',
  '请稍候',
  'COMING SOON',
  '翻修中',
  '别急',
  '即将上新',
  'WORK IN PROGRESS',
  '正在造点什么',
  'SOON™',
  'BREWING',
]

/** 顶部 + 底部环绕的施工带，黑黄斜纹 + 文案横向滚动。 */
export default function ConstructionTape({ position = 'top' }: { position?: 'top' | 'bottom' }) {
  // 复制多次让无缝循环
  const items = useMemo(() => Array.from({ length: 4 }, () => STATUS_WORDS).flat(), [])

  return (
    <div className={`tape tape--${position}`} aria-hidden="true">
      <div className="tape__strip">
        <div className="tape__track">
          {items.map((w, i) => (
            <span className="tape__item" key={i}>
              <span className="tape__diamond">◆</span>
              <span className="tape__word">{w}</span>
            </span>
          ))}
        </div>
        <div className="tape__track" aria-hidden="true">
          {items.map((w, i) => (
            <span className="tape__item" key={i}>
              <span className="tape__diamond">◆</span>
              <span className="tape__word">{w}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
