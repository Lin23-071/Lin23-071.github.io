import './Stamp.css'

interface StampProps {
  text?: string
  sub?: string
  rotation?: number
  size?: number
}

/** 圆形红章 SVG。 */
export default function Stamp({
  text = 'UNDER CONSTRUCTION',
  sub = 'EST. 2026 · 071',
  rotation = -8,
  size = 130,
}: StampProps) {
  return (
    <div
      className="stamp"
      style={{
        transform: `rotate(${rotation}deg)`,
        width: size,
        height: size,
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 200" width={size} height={size}>
        <defs>
          <path
            id="stamp-curve-top"
            d="M 30 100 A 70 70 0 0 1 170 100"
            fill="none"
          />
          <path
            id="stamp-curve-bottom"
            d="M 30 100 A 70 70 0 0 0 170 100"
            fill="none"
          />
        </defs>
        {/* 外圈粗线 */}
        <circle
          cx="100"
          cy="100"
          r="86"
          fill="none"
          stroke="var(--persimmon)"
          strokeWidth="4"
        />
        {/* 内圈细线 */}
        <circle
          cx="100"
          cy="100"
          r="76"
          fill="none"
          stroke="var(--persimmon)"
          strokeWidth="1.5"
        />
        {/* 顶部弧形文字 */}
        <text
          fill="var(--persimmon)"
          fontSize="13"
          fontWeight="800"
          fontFamily="var(--font-mono), monospace"
          letterSpacing="2"
        >
          <textPath href="#stamp-curve-top" startOffset="50%" textAnchor="middle">
            {text}
          </textPath>
        </text>
        {/* 底部弧形文字 */}
        <text
          fill="var(--persimmon)"
          fontSize="10"
          fontWeight="700"
          fontFamily="var(--font-mono), monospace"
          letterSpacing="2"
        >
          <textPath href="#stamp-curve-bottom" startOffset="50%" textAnchor="middle">
            {sub}
          </textPath>
        </text>
        {/* 中央图案：一只几何风格的扳手（"under construction" 主题） */}
        <g transform="translate(100 105) rotate(-28)">
          {/* 把手 */}
          <rect x="-22" y="-3.5" width="26" height="7" rx="1" fill="var(--persimmon)" />
          {/* 扳手头：圆头 + 开口 */}
          <circle cx="13" cy="0" r="11" fill="var(--persimmon)" />
          {/* 中心螺帽孔 */}
          <circle cx="13" cy="0" r="4" fill="var(--bg)" />
          {/* 开口端：把右侧切掉，做成 C 型扳手 */}
          <rect x="13" y="-2.5" width="16" height="5" fill="var(--bg)" />
        </g>
        {/* 装饰小星 */}
        <text
          x="100"
          y="148"
          textAnchor="middle"
          fill="var(--persimmon)"
          fontSize="8"
          fontFamily="var(--font-mono), monospace"
        >
          ★ ★ ★
        </text>
      </svg>
    </div>
  )
}
