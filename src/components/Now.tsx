import { NOW_ITEMS, NOW_LINE, NOW_UPDATED } from '../data/now'
import { useDecode } from '../hooks/useDecode'

/** Now（纸 · 静区）：会过期的近期事项；长期兴趣在 04 / About */
export default function Now() {
  const tagRef = useDecode<HTMLSpanElement>('03 / Now')

  return (
    <section className="section now" id="now" data-theme="paper">
      <div className="section__inner">
        <div className="section__head">
          <span className="section__tag rv--s" ref={tagRef}>03 / Now</span>
          <div>
            <h2
              className="section__title rv--s"
              style={{ '--d': '.05s' } as React.CSSProperties}
            >
              近期。
            </h2>
            <p
              className="section__sub rv--s"
              style={{ '--d': '.1s' } as React.CSSProperties}
            >
              {NOW_LINE}
            </p>
          </div>
        </div>

        <hr className="section__rule rv-line--s" />

        <ul className="now__list">
          {NOW_ITEMS.map((it, i) => (
            <li
              key={it.no}
              className="now__item rv--s"
              style={{ '--d': `${0.14 + i * 0.08}s` } as React.CSSProperties}
            >
              <span className="now__item-no">{it.no}</span>
              <span className="now__item-head">
                <span className="now__item-tag">{it.tag}</span>
                <strong className="now__item-title">{it.title}</strong>
              </span>
              <span className="now__item-note">{it.note}</span>
            </li>
          ))}
        </ul>

        <div className="now__foot rv--s" style={{ '--d': '.4s' } as React.CSSProperties}>
          <span>LAST UPDATED · {NOW_UPDATED}</span>
          <a className="now__cv" href="/cv.html">
            完整履历在档案页 <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}
