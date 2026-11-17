import { useEffect, useRef } from 'react'
import type { Work } from '../data/works'

interface WorkDetailProps {
  work: Work
  index: number
  total: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  /** 放大某一张截图 */
  onZoom: (images: string[], page: number) => void
}

/** 作品二级页 —— 参考 CliVigil 的全屏 modal 详情面板 */
export default function WorkDetail({
  work,
  index,
  total,
  onClose,
  onPrev,
  onNext,
  onZoom,
}: WorkDetailProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const shots = work.images ?? (work.image ? [work.image] : [])

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  useEffect(() => {
    if (panelRef.current) panelRef.current.scrollTop = 0
  }, [work.id])

  // 01 速览 / 02 核心工作固定，其余区块按实际内容连续编号
  let sectionNo = 3
  const shotSection = shots.length > 0 ? String(sectionNo++) : null
  const videoSection = work.video ? String(sectionNo++) : null
  const linkSection = work.links?.length ? String(sectionNo++) : null

  return (
    <div className="detail" role="dialog" aria-modal="true" aria-labelledby="detail-title">
      <div className="detail__backdrop" onClick={onClose} role="presentation" />
      <div className="detail__panel" ref={panelRef} tabIndex={-1}>
        <div className="detail__head">
          <div className="detail__head-main">
            <p className="detail__eyebrow">
              PROJECT FILE <span>{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
            </p>
            <h3 className="detail__title" id="detail-title">{work.title}</h3>
            <p className="detail__subtitle">{work.subtitle}</p>
          </div>
          <button
            type="button"
            className="detail__close"
            onClick={onClose}
            aria-label="关闭详情"
            ref={closeRef}
          >
            ×
          </button>
        </div>

        <p className="detail__lede">{work.description}</p>

        <div className="detail__section-head">
          <span className="detail__label"><i>01</i> AT A GLANCE <em>速览</em></span>
        </div>
        <dl className="detail__spec">
          <div className="detail__spec-row">
            <dt>角色 / 时间</dt>
            <dd>{work.subtitle}</dd>
          </div>
          {work.aiTag && (
            <div className="detail__spec-row">
              <dt>AI 定位</dt>
              <dd>{work.aiTag}</dd>
            </div>
          )}
          <div className="detail__spec-row">
            <dt>技术 / 关键词</dt>
            <dd>{work.tags.join(' · ')}</dd>
          </div>
          {work.highlight && (
            <div className="detail__spec-row">
              <dt>关键结果</dt>
              <dd className="detail__accent">{work.highlight}</dd>
            </div>
          )}
        </dl>

        <div className="detail__section-head">
          <span className="detail__label"><i>02</i> WHAT I DID <em>核心工作</em></span>
        </div>
        <ul className="detail__points">
          {work.points.map((p, i) => (
            <li key={i}><span>{String(i + 1).padStart(2, '0')}</span>{p}</li>
          ))}
        </ul>

        {shots.length > 0 && (
          <>
            <div className="detail__section-head">
              <span className="detail__label">
                <i>{shotSection}</i> SCREENSHOTS <em>{shots.length} 张 · 点击放大</em>
              </span>
            </div>
            <div className="detail__shots">
              {shots.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => onZoom(shots, i)}
                  aria-label={`放大第 ${i + 1} 张截图`}
                >
                  <img className="detail__shot-bg" src={src} alt="" aria-hidden="true" />
                  <img
                    className="detail__shot-img"
                    src={src}
                    alt={`${work.title} 截图 ${i + 1}`}
                    loading="lazy"
                    onLoad={(e) => {
                      const im = e.currentTarget
                      im.parentElement?.classList.toggle(
                        'is-portrait',
                        im.naturalHeight > im.naturalWidth * 1.25,
                      )
                    }}
                  />
                  <span>0{i + 1}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {work.video && (
          <>
            <div className="detail__section-head">
              <span className="detail__label"><i>{videoSection}</i> DEMO <em>演示视频</em></span>
            </div>
            <figure className="detail__video">
              <video
                controls
                playsInline
                preload="none"
                poster={work.video.poster}
                src={work.video.src}
              >
                你的浏览器不支持内嵌视频，<a href={work.video.src}>点此打开</a>。
              </video>
              {work.video.caption && <figcaption>{work.video.caption}</figcaption>}
            </figure>
          </>
        )}

        {work.links && work.links.length > 0 && (
          <>
            <div className="detail__section-head">
              <span className="detail__label"><i>{linkSection}</i> RELATED <em>相关链接</em></span>
            </div>
            <ul className="detail__links">
              {work.links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target={l.href.startsWith('http') ? '_blank' : undefined}
                    rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {l.label} <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="detail__foot">
          {work.href ? (
            <a className="detail__go" href={work.href} target="_blank" rel="noopener noreferrer">
              {work.hrefLabel ?? '访问项目'} <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <span className="detail__go is-muted">
              {work.draft ? '细节整理中' : work.links?.length ? '详见上方链接' : '暂无外链'}
            </span>
          )}

          <div className="detail__pager">
            <button type="button" onClick={onPrev} aria-label="上一个作品">← 上一个</button>
            <span>{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
            <button type="button" onClick={onNext} aria-label="下一个作品">下一个 →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
