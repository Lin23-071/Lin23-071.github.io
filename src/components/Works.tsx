import { useEffect, useRef, useState } from 'react'
import { CATEGORY_LABEL, CATEGORY_ORDER, WORKS } from '../data/works'
import { collect } from '../state/collect'
import { useDecode } from '../hooks/useDecode'
import WorkDetail from './WorkDetail'

interface Preview {
  images: string[]
  page: number
}

type WorkItem = (typeof WORKS)[number]
type Entry = { w: WorkItem; i: number }

/** 精选按指定顺序整行展开；其余按形态归进索引 */
const FEATURED: Entry[] = WORKS.map((w, i) => ({ w, i }))
  .filter((e) => e.w.featured)
  .sort((a, b) => (a.w.order ?? 99) - (b.w.order ?? 99))

const REST: Entry[] = WORKS.map((w, i) => ({ w, i }))
  .filter((e) => !e.w.featured)
  .sort((a, b) => CATEGORY_ORDER.indexOf(a.w.category) - CATEGORY_ORDER.indexOf(b.w.category))

/** 页面上的展示序列：详情页编号与左右翻页都按它走，保证 01–10 连续 */
const DISPLAY: Entry[] = [...FEATURED, ...REST]

/** 索引网格凑满 3 列，空位做成通往档案页的出口卡 */
const FILLER_COUNT = (3 - (REST.length % 3)) % 3

/** 索引小卡的内容：精选行与索引卡共用一套事实 */
function WorkCardBody({ w }: { w: WorkItem }) {
  return (
    <>
      <span className="work-card__top">
        <span className={`work-card__cat work-card__cat--${w.category}`}>
          {CATEGORY_LABEL[w.category]}
        </span>
        <span className="work-card__year">{w.subtitle.split(' · ')[0]}</span>
      </span>
      <strong className="work-card__title">{w.title}</strong>
      <span className="work-card__desc">{w.summary?.[0] ?? w.description}</span>
      {w.aiTag && <span className="work-card__ai">{w.aiTag}</span>}
      <span className="work-card__foot">
        {w.draft ? '整理中 / COMING SOON' : 'DETAILS →'}
      </span>
    </>
  )
}

/** 作品区（白 · 静区）：整行精选 → 分类索引 → 共用同一个二级详情页 */
export default function Works() {
  const tagRef = useDecode<HTMLSpanElement>('02 / Works')
  const restoreRef = useRef<HTMLElement | null>(null)
  const [detailIndex, setDetailIndex] = useState<number | null>(null)
  const [preview, setPreview] = useState<Preview | null>(null)

  const detail = detailIndex === null ? null : WORKS[detailIndex]
  const detailPos = detailIndex === null
    ? 0
    : Math.max(0, DISPLAY.findIndex((e) => e.i === detailIndex))
  const shots = preview?.images ?? []

  const openDetail = (i: number) => {
    restoreRef.current = document.activeElement as HTMLElement | null
    collect('detail') // 第一次打开二级页 = 一枚星星
    setPreview(null)
    setDetailIndex(i)
  }
  const closeDetail = () => {
    setPreview(null)
    setDetailIndex(null)
    requestAnimationFrame(() => restoreRef.current?.focus())
  }
  const turnWork = (dir: 1 | -1) => {
    setPreview(null)
    setDetailIndex((cur) => {
      if (cur === null) return cur
      const pos = DISPLAY.findIndex((e) => e.i === cur)
      return DISPLAY[(pos + dir + DISPLAY.length) % DISPLAY.length].i
    })
  }
  const turnShot = (dir: 1 | -1) => {
    setPreview((p) => (p ? { ...p, page: (p.page + dir + p.images.length) % p.images.length } : p))
  }

  // 打开二级页时锁滚动；Esc 先关大图、再关详情
  useEffect(() => {
    document.documentElement.classList.toggle('detail-open', detail !== null)
    return () => document.documentElement.classList.remove('detail-open')
  }, [detail])

  useEffect(() => {
    if (detail === null && preview === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (preview) setPreview(null)
        else closeDetail()
      } else if (e.key === 'ArrowRight') {
        if (preview) turnShot(1)
        else turnWork(1)
      } else if (e.key === 'ArrowLeft') {
        if (preview) turnShot(-1)
        else turnWork(-1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [detail, preview]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="section" id="works" data-theme="paper">
      <div className="section__inner">
        <div className="section__head">
          <span className="section__tag rv--s" ref={tagRef}>02 / Works</span>
          <div>
            <h2 className="section__title rv--s" style={{ '--d': '.05s' } as React.CSSProperties}>
              一些工作记录
            </h2>
            <p className="section__sub rv--s" style={{ '--d': '.1s' } as React.CSSProperties}>
              持续更新中，最近更新2026.11，腾讯云黑客松全球总决赛产出暂未复盘收录
            </p>
          </div>
        </div>

        <hr className="section__rule rv-line--s" />

        <ul className="works__list">
          {FEATURED.map(({ w, i }, n) => (
            <li
              key={w.id}
              className={`work-row rv--s ${w.draft ? 'is-draft' : ''}`}
              style={{ '--d': `${n * 0.06}s` } as React.CSSProperties}
            >
              <span className="work-row__no">{String(n + 1).padStart(2, '0')}</span>

              <button
                type="button"
                className="work-row__thumb"
                onClick={() => openDetail(i)}
                disabled={!w.image && !w.cover}
                aria-label={`展开 ${w.title} 的详情`}
              >
                {w.image ? (
                  <>
                    <img className="work-row__thumb-bg" src={w.image} alt="" aria-hidden="true" />
                    <img
                      className="work-row__thumb-img"
                      src={w.image}
                      alt={w.imageAlt ?? w.title}
                      loading="lazy"
                    />
                  </>
                ) : w.cover ? (
                  <span className="work-row__cover" aria-hidden="true">
                    <span className="work-row__cover-kicker">{w.cover.kicker}</span>
                    <b className="work-row__cover-big">{w.cover.big}</b>
                    <span className="work-row__cover-foot">{w.cover.foot}</span>
                  </span>
                ) : (
                  <span className="work-row__thumb-empty">NO<br />PREVIEW</span>
                )}
              </button>

              <span className="work-row__main">
                <span
                  className="work-row__title work-row__title--btn"
                  role="button"
                  tabIndex={0}
                  onClick={() => openDetail(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      openDetail(i)
                    }
                  }}
                  aria-label={`展开 ${w.title} 的详情`}
                >
                  {w.title}
                </span>
                <span className="work-row__sub">{w.subtitle}</span>
                {w.highlight && <span className="work-row__highlight">✦ {w.highlight}</span>}
              </span>

              <span className="work-row__aside">
                <span className="work-row__desc">
                  {(w.summary ?? [w.description]).map((line, k) => (
                    <span key={k} className="work-row__desc-line">{line}</span>
                  ))}
                </span>
                <ul className="work-row__tags">
                  {w.aiTag && <li className="work-row__tags-ai">{w.aiTag}</li>}
                  {w.tags.map((t) => <li key={t}>{t}</li>)}
                </ul>
              </span>

              <span className="work-row__action">
                <button type="button" className="work-row__detail" onClick={() => openDetail(i)}>
                  DETAILS <span aria-hidden="true">→</span>
                </button>
                {w.href ? (
                  <a
                    className="work-row__cta"
                    href={w.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${w.title}（新窗口打开）`}
                  >
                    VIEW <span className="arrow" aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span className="work-row__cta is-muted">
                    {w.draft ? '整理中' : '无外链'}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>

        <div className="works__index">
          <div className="works__index-head rv--s" style={{ '--d': '.18s' } as React.CSSProperties}>
            <h3>INDEX / 其余 {REST.length} 件</h3>
            <ul className="works__legend">
              {CATEGORY_ORDER.map((c) => (
                <li key={c}>
                  <i data-cat={c} aria-hidden="true" />
                  {CATEGORY_LABEL[c]}
                </li>
              ))}
            </ul>
          </div>

          <ul className="works__cards rv-frame">
            {REST.map(({ w, i }, k) => (
              <li
                key={w.id}
                className={`work-card rv--s ${w.draft ? 'is-draft' : ''}`}
                style={{ '--d': `${0.22 + k * 0.05}s` } as React.CSSProperties}
              >
                {w.draft ? (
                  <div className="work-card__inner">
                    <WorkCardBody w={w} />
                  </div>
                ) : (
                  <button
                    type="button"
                    className="work-card__inner"
                    onClick={() => openDetail(i)}
                    aria-label={`展开 ${w.title} 的详情`}
                  >
                    <WorkCardBody w={w} />
                  </button>
                )}
              </li>
            ))}

            {Array.from({ length: FILLER_COUNT }, (_, k) => (
              <li
                key={`filler-${k}`}
                className="work-card work-card--filler rv--s"
                style={{ '--d': `${0.22 + (REST.length + k) * 0.05}s` } as React.CSSProperties}
              >
                <a className="work-card__inner" href="/cv.html">
                  <span className="work-card__top">
                    <span className="work-card__cat">ARCHIVE / 档案</span>
                  </span>
                  <strong className="work-card__title">更多详见CV</strong>
                  <span className="work-card__foot">/cv.html ↗</span>
                </a>
              </li>
            ))}
          </ul>

          <p className="works__index-foot rv--s" style={{ '--d': '.5s' } as React.CSSProperties}>
            按做出来的形态归类，不按技术栈；完整履历在档案页
          </p>
        </div>
      </div>

      {detail && (
        <WorkDetail
          work={detail}
          index={detailPos}
          total={DISPLAY.length}
          onClose={closeDetail}
          onPrev={() => turnWork(-1)}
          onNext={() => turnWork(1)}
          onZoom={(images, page) => {
            collect('gallery') // 第一次放大截图 = 一枚星星
            setPreview({ images, page })
          }}
        />
      )}

      {preview && (
        <div className="lightbox" onClick={() => setPreview(null)} role="presentation">
          <div className="lightbox__panel" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox__close"
              onClick={() => setPreview(null)}
              aria-label="关闭截图"
            >
              ✕
            </button>
            <img src={shots[preview.page]} alt={`${detail?.title ?? '作品'} 截图 ${preview.page + 1}`} />

            {shots.length > 1 && (
              <div className="lightbox__nav">
                <button type="button" onClick={() => turnShot(-1)} aria-label="上一张">←</button>
                <span>
                  {String(preview.page + 1).padStart(2, '0')} / {String(shots.length).padStart(2, '0')}
                </span>
                <button type="button" onClick={() => turnShot(1)} aria-label="下一张">→</button>
              </div>
            )}

            <div className="lightbox__cap">
              <strong>{detail?.title}</strong>
              <span>{detail?.subtitle}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
