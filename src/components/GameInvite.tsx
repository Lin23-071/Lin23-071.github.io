import { useState } from 'react'
import TrexGame from './TrexGame'
import './GameInvite.css'

export default function GameInvite() {
  const [open, setOpen] = useState(false)

  return (
    <section className="invite" id="play">
      <div className="invite__inner">
        <div className="invite__head">
          <span className="invite__tag">#02 · INTERACTIVE</span>
          <h2 className="invite__title">
            <span>等得不耐烦？</span>
            <span className="invite__title-en">Press a button, then run.</span>
          </h2>
          <p className="invite__desc">
            上一位主人留下了一只像素恐龙。点 <kbd>SPACE</kbd> 跳一跳，消磨一下时间。
            <br />
            无网络也能玩，无登录、无追踪。
          </p>
        </div>

        <div className={`invite__game ${open ? 'is-open' : ''}`}>
          {open ? (
            <>
              <TrexGame />
              <button
                className="invite__close"
                onClick={() => setOpen(false)}
                aria-label="收起游戏"
              >
                收起 ▴
              </button>
            </>
          ) : (
            <button
              className="invite__cta"
              onClick={() => setOpen(true)}
              aria-label="展开恐龙游戏"
            >
              <span className="invite__cta-icon" aria-hidden="true">
                <svg viewBox="0 0 40 30" width="40" height="30">
                  <g fill="var(--ink)">
                    <rect x="4" y="12" width="22" height="12" />
                    <rect x="22" y="6" width="10" height="12" />
                    <rect x="28" y="10" width="6" height="2" />
                    <rect x="26" y="9" width="2" height="2" fill="var(--paper)" />
                    <rect x="2" y="14" width="4" height="6" />
                    <rect x="6" y="22" width="3" height="6" />
                    <rect x="14" y="22" width="3" height="6" />
                  </g>
                </svg>
              </span>
              <span className="invite__cta-text">开始游戏</span>
              <span className="invite__cta-arrow" aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
