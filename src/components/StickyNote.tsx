import { useMouseTilt } from '../hooks/useMouseTilt'
import './StickyNote.css'

type Variant = 'yellow' | 'persimmon' | 'moss' | 'paper' | 'ink'

interface StickyNoteProps {
  text: string
  signature?: string
  variant?: Variant
  rotation?: number
  withTape?: boolean
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  enterDelay?: number
}

/** 飘浮便签纸（带鼠标 3D 倾斜、磁带装饰、入场动画）。 */
export default function StickyNote({
  text,
  signature,
  variant = 'yellow',
  rotation = 0,
  withTape = false,
  className = '',
  style,
  onClick,
  enterDelay = 0,
}: StickyNoteProps) {
  const tiltRef = useMouseTilt<HTMLDivElement>(5)

  return (
    <div
      ref={tiltRef}
      className={`sticky sticky--${variant} ${className} ${onClick ? 'sticky--clickable' : ''}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        animationDelay: `${enterDelay}ms`,
        ...style,
      }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {withTape && <span className="sticky__tape" aria-hidden="true" />}
      <p className="sticky__text">{text}</p>
      {signature && <span className="sticky__signature">— {signature}</span>}
    </div>
  )
}
