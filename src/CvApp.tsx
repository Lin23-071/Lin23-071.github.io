import { WORKS } from './data/works'
import { AWARDS, CAMPUS, CV_CONTACTS, CV_SKILLS, CV_UPDATED, EDUCATION, INTERNSHIP, PROJECT_GROUPS, type CvItem } from './data/cv'

function Item({ item }: { item: CvItem }) {
  return (
    <div className="cv__item">
      <div className="cv__item-head">
        <h3 className="cv__item-title">{item.title}</h3>
        <span className="cv__item-when">{item.when}</span>
      </div>
      {item.note && <p className="cv__item-note">{item.note}</p>}
      {item.subs && (
        <ul className="cv__subs">
          {item.subs.map((s) => (
            <li key={s.label}>
              <b>{s.label}</b>
              {s.note && <span>{s.note}</span>}
            </li>
          ))}
        </ul>
      )}
      {item.points && (
        <ul className="cv__points">
          {item.points.map((p) => <li key={p}>{p}</li>)}
        </ul>
      )}
    </div>
  )
}

/**
 * 档案页：给 HR / 面试官的履历视图。
 * 纯文本、无动画、可打印；打印样式见 styles/cv.css。
 */
export default function CvApp() {
  const projects = WORKS.filter((w) => !w.draft)

  // 按类型分组，组内保持配置顺序（时间倒序），编号跨组连续
  let seq = 0
  const groups = PROJECT_GROUPS.map((g) => ({
    label: g.label,
    items: g.ids
      .flatMap((id) => {
        const w = projects.find((p) => p.id === id)
        return w ? [w] : []
      })
      .map((w) => ({ work: w, no: String(++seq).padStart(2, '0') })),
  })).filter((g) => g.items.length > 0)

  return (
    <div className="cv">
      <div className="cv__toolbar">
        <a className="cv__back" href="/">← 回主页 / Lin071</a>
        <div className="cv__toolbar-right">
          <span>UPDATED {CV_UPDATED}</span>
          <button type="button" className="cv__print" onClick={() => window.print()}>
            打印 / 存为 PDF ↗
          </button>
        </div>
      </div>

      <article className="cv__sheet">
        <header className="cv__header">
          <p className="cv__eyebrow">CURRICULUM VITAE · 档案 / 01</p>
          <div className="cv__name-row">
            <h1 className="cv__name">林巧</h1>
            <span className="cv__name-en">Lin Qiao</span>
          </div>
          <p className="cv__lede">
            哈尔滨工业大学（深圳）· 工科试验班（计算机与电子通信）
            <br />
            本科大三在读，主修计算机，辅修经济学
            <br />
            尝试AI产品、AIGC、游戏、软硬件、数据...持续探索。
            <br />
            目前暂无科研经历...待挖掘
          </p>
          <dl className="cv__meta">
            <div><dt>GITHUB</dt><dd>@Lin23-071</dd></div>
            <div><dt>EMAIL</dt><dd>2024311515@stu.hit.edu.cn</dd></div>
            <div><dt>SITE</dt><dd>lin23-071.github.io</dd></div>
          </dl>
        </header>

        <section className="cv__section">
          <h2 className="cv__label">01<span>EDUCATION / 教育</span></h2>
          <div className="cv__body">
            {EDUCATION.map((e) => <Item key={e.title} item={e} />)}
          </div>
        </section>

        <section className="cv__section">
          <h2 className="cv__label">02<span>AWARDS / 奖项</span></h2>
          <div className="cv__body">
            {AWARDS.map((a) => <Item key={a.title} item={a} />)}
          </div>
        </section>

        <section className="cv__section">
          <h2 className="cv__label">03<span>PROJECTS / 项目</span></h2>
          <div className="cv__body">
            {groups.map((g) => (
              <div className="cv__group" key={g.label}>
                <h3 className="cv__group-label">{g.label}</h3>
                {g.items.map(({ work: w, no }) => (
                  <div className="cv__item" key={w.id}>
                    <div className="cv__item-head">
                      <h3 className="cv__item-title">
                        <span className="cv__no">{no}</span>
                        {w.title}
                        {w.href && (
                          <a
                            className="cv__ext"
                            href={w.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${w.title}（新窗口打开）`}
                          >↗</a>
                        )}
                      </h3>
                      <span className="cv__item-when">{w.subtitle.split(' · ')[0]}</span>
                    </div>
                    {w.aiTag && <p className="cv__item-ai">{w.aiTag}</p>}
                    <p className="cv__item-note">
                      {w.summary?.[0] ?? w.description}
                      {w.highlight ? ` · ${w.highlight}` : ''}
                    </p>
                    {w.summary?.[1] && (
                      <p className="cv__item-note cv__item-note--sub">{w.summary[1]}</p>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="cv__section">
          <h2 className="cv__label">04<span>INTERNSHIP / 实习</span></h2>
          <div className="cv__body">
            {INTERNSHIP.map((i) => <Item key={i.title} item={i} />)}
          </div>
        </section>

        <section className="cv__section">
          <h2 className="cv__label">05<span>CAMPUS / 校园与社会实践</span></h2>
          <div className="cv__body">
            {CAMPUS.map((c) => <Item key={c.title} item={c} />)}
          </div>
        </section>

        <section className="cv__section">
          <h2 className="cv__label">06<span>TOOLKIT / 技能</span></h2>
          <div className="cv__body">
            <ul className="cv__skills">
              {CV_SKILLS.map((g) => (
                <li key={g.label}>
                  <span className="cv__skills-label">{g.label}</span>
                  <span className="cv__skills-items">{g.items.join(' · ')}</span>
                </li>
              ))}
            </ul>
            <p className="cv__item-note cv__hint">
              角色以技术负责人 / 核心开发为主，覆盖纯前端、全栈、数据建模与软硬件联调。
            </p>
          </div>
        </section>

        <section className="cv__section cv__section--last">
          <h2 className="cv__label">07<span>CONTACT / 联系</span></h2>
          <div className="cv__body cv__links">
            {CV_CONTACTS.map((c) =>
              c.href ? (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {c.label} · {c.value}
                </a>
              ) : (
                <span key={c.label}>{c.label} · {c.value}</span>
              ),
            )}
          </div>
        </section>

        <footer className="cv__footer">
          <span>网页版档案 · 与主页共用同一份项目数据</span>
          <a href="/">← lin23-071.github.io</a>
        </footer>
      </article>
    </div>
  )
}
