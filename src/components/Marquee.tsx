const PHRASES = ['BUILD', 'PLAY', 'HACK', 'REPEAT']

/** 满幅跑马灯：打破区块边界，填充横向节奏 */
export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((k) => (
          <span key={k} className="marquee__group">
            {PHRASES.map((p, i) => (
              <b key={p + i} className={i % 2 === 1 ? 'is-outline' : ''}>
                {p}
              </b>
            ))}
            <i>✦</i>
            {PHRASES.map((p, i) => (
              <b key={p + i + 'b'} className={i % 2 === 0 ? 'is-outline' : ''}>
                {p}
              </b>
            ))}
            <i>✦</i>
          </span>
        ))}
      </div>
    </div>
  )
}
