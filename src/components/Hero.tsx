import { useState, useEffect, useRef } from 'react'
import './Hero.css'

const Hero = () => {
  const [displayedText, setDisplayedText] = useState('')
  const [showRipple, setShowRipple] = useState(false)
  const [showCursor, setShowCursor] = useState(true)
  const [selectedCard, setSelectedCard] = useState<'about' | 'skills' | 'contact' | 'fun' | null>(null)
  const [expandCount, setExpandCount] = useState(0)
  const [sidePaperClicked, setSidePaperClicked] = useState(false)
  const [cornerFoldClicks, setCornerFoldClicks] = useState(0)
  const [droplets, setDroplets] = useState([
    // 主功能卡片
    { id: 'about', x: 8, y: 15, scaleX: 1, scaleY: 1, rotation: 2, width: 220, height: 56, z: 2 },
    { id: 'skills', x: 65, y: 35, scaleX: 1, scaleY: 1, rotation: -3, width: 180, height: 48, z: 2 },
    { id: 'contact', x: 20, y: 60, scaleX: 1, scaleY: 1, rotation: 4, width: 200, height: 52, z: 2 },
    { id: 'fun', x: 70, y: 70, scaleX: 1, scaleY: 1, rotation: -2, width: 160, height: 44, z: 2 },
    // 空白纸条（形状、透明度与主卡片接近，位置更自然）
    { id: 'blank1', x: 25, y: 12, scaleX: 1, scaleY: 1, rotation: -5, width: 210, height: 52, z: 1, opacity: 0.82 },
    { id: 'blank2', x: 60, y: 22, scaleX: 1, scaleY: 1, rotation: 6, width: 170, height: 44, z: 3, opacity: 0.78 },
    { id: 'blank3', x: 15, y: 38, scaleX: 1, scaleY: 1, rotation: 3, width: 200, height: 48, z: 1, opacity: 0.8 },
    { id: 'blank4', x: 55, y: 60, scaleX: 1, scaleY: 1, rotation: -7, width: 180, height: 50, z: 3, opacity: 0.75 },
    { id: 'blank5', x: 35, y: 78, scaleX: 1, scaleY: 1, rotation: 4, width: 220, height: 56, z: 1, opacity: 0.77 },
    { id: 'blank6', x: 78, y: 52, scaleX: 1, scaleY: 1, rotation: 10, width: 140, height: 40, z: 3, opacity: 0.7 },
  ])
  const heroRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const fullText = 'Glad to see you ! :D'
  const typingSpeed = 100

  useEffect(() => {
    // 打字机效果
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(typingInterval)
        // 隐藏光标
        setTimeout(() => {
          setShowCursor(false)
          // 显示涟漪效果
          setTimeout(() => {
            setShowRipple(true)
          }, 300)
        }, 500)
      }
    }, typingSpeed)

    return () => clearInterval(typingInterval)
  }, [])

  useEffect(() => {
    const bgBlur = Math.max(0, 10 - expandCount) // 从10px减少，每次-1px
    const wrinkleScale = 4 + expandCount // 从4开始，每次+1
    document.documentElement.style.setProperty('--bg-blur', `${bgBlur}px`)
    // 更新SVG filter
    const displacementMap = document.querySelector('feDisplacementMap')
    if (displacementMap) {
      displacementMap.setAttribute('scale', wrinkleScale.toString())
    }
  }, [expandCount])

  const handleCardClick = (card: 'about' | 'skills' | 'contact' | 'fun') => {
    if (selectedCard === card) {
      setSelectedCard(null)
      setSidePaperClicked(false) // 重置
      setCornerFoldClicks(0) // 重置卷边点击次数
    } else {
      setSelectedCard(card)
      setExpandCount(prev => prev + 1)
      setSidePaperClicked(false) // 新展开时重置
      setCornerFoldClicks(0) // 重置卷边点击次数
    }
  }

  const handleCornerFoldClick = () => {
    setCornerFoldClicks(prev => (prev + 1) % 7) // 循环0-6，7次后回到0
  }

  const renderModalContent = () => {
    switch (selectedCard) {
      case 'about':
        return (
          <div>
            <p>Hi.</p>
            <p>Something about me.</p>
            <p>Enjoy your stay.</p>
          </div>
        )
      case 'skills':
        return (
          <div>
            <ul>
              <li>- maybe CoDing</li>
              <li>- maybe DRaWinG</li>
              <li>- maybe deSiGN</li>
              <li>- maybe cReaTing</li>
              <li>- more to ExPloRe</li>
            </ul>
          </div>
        )
      case 'contact':
        return (
          <div>
            <p>EMAIK:</p>
            <p>TELE:</p>
            <p>GITHUB:</p>
            <p>WECHAT:</p>
            <p>REDNOTE:</p>
            <p>GMAIL:</p>
            <p>SINA:</p>
            <p>......</p>
          </div>
        )
      case 'fun':
        return (
          <div>
            <p>Life is too short not to smile! 😊</p>
            <p>------</p>
            <p>上面是AI写的神奇句子，遂保留</p>
            <p>------</p>
            <p>这是一个快速项目，于20260124-AMOY创建，本意是试试cursor的强度，结果token使用速度巨快，现在又是vsc+copilot状态QAQ</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <section id="home" className="hero">
      {/* 右下角悬浮纸团已移除，避免找不到 PaperBall 报错 */}
      {/* 交互式卡片 */}
      <div className="interactive-cards">
        {droplets
          .sort((a, b) => (a.z || 2) - (b.z || 2))
          .map(droplet => (
            <div
              key={droplet.id}
              className={`card card-${droplet.id} ${selectedCard === droplet.id ? 'expanded-paper' : selectedCard ? 'squeezed' : ''} ${droplet.id.startsWith('blank') ? 'blank-paper' : ''}`}
              style={{
                left: `${droplet.x}%`,
                top: `${droplet.y}%`,
                width: selectedCard === droplet.id ? '420px' : `${droplet.width}px`,
                height: selectedCard === droplet.id ? '120px' : `${droplet.height}px`,
                borderRadius: selectedCard === droplet.id ? '28px 36px 24px 32px/32px 28px 36px 24px' : undefined,
                background: selectedCard === droplet.id
                  ? 'linear-gradient(90deg, #e5dcc3 0%, #e5dcc3 30%, #f7f3e8 30%, #f7f3e8 100%)'
                  : undefined,
                filter: 'url(#paperWrinkle)',
                boxShadow: selectedCard === droplet.id ? '0 12px 48px 0 rgba(120,100,60,0.13)' : (droplet.id.startsWith('blank') ? '0 8px 32px rgba(0,0,0,0.10)' : undefined),
                zIndex: droplet.z || 2,
                opacity: droplet.id.startsWith('blank') ? droplet.opacity : 1,
                pointerEvents: droplet.id.startsWith('blank') ? 'none' : undefined
              }}
              onClick={droplet.id.startsWith('blank') ? undefined : () => handleCardClick(droplet.id as any)}
            >
              {droplet.id === 'blank4' ? (
                <span style={{
                  fontFamily: 'cursive',
                  fontSize: '1.1em',
                  color: '#b7a97a',
                  letterSpacing: '0.04em',
                  opacity: 0.92,
                  userSelect: 'none',
                  pointerEvents: 'none',
                  textShadow: '0 1px 0 #fff, 0 2px 6px #e5dcc3'
                }}>Mr23&Ms71</span>
              ) : droplet.id.startsWith('blank') ? null : (
                selectedCard === droplet.id ? (
                  <>
                    <div className="modal-sidebar">
                      <div className="modal-sidebar-text">
                        {selectedCard === 'about' && '你站在桥上看风景  01'}
                        {selectedCard === 'skills' && '看风景的人在楼上看你  02'}
                        {selectedCard === 'contact' && '明月装饰了你的窗子  03'}
                        {selectedCard === 'fun' && '你装饰了别人的梦  04'}
                      </div>
                    </div>
                    <div className="modal-content">
                      {renderModalContent()}
                    </div>
                  </>
                ) : (
                  <span>
                    {droplet.id === 'about' ? 'About Me' :
                     droplet.id === 'skills' ? 'Skills' :
                     droplet.id === 'contact' ? 'Contact' : ':D'}
                  </span>
                )
              )}
            </div>
        ))}
      </div>
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="typed-text">{displayedText}</span>
          {showCursor && <span className="cursor">|</span>}
        </h1>
        {/* 移除居中圆形涟漪；改为卡片展开边缘的 SVG 波纹（在 modal 中渲染） */}
        <p className="hero-subtitle">
          welcome to my space!
        </p>
      </div>
      {selectedCard && (
        <div 
          className="side-paper" 
          onClick={() => setSidePaperClicked(prev => !prev)}
          style={{ 
            opacity: sidePaperClicked ? 1 : 0.3
          }}
        >
          {sidePaperClicked && (
            <div className="side-paper-content">
              <h3>Additional Notes</h3>
              <p>This is some additional content that appears when you click the side paper area.</p>
              <p>You can add more details, links, or whatever you want here!</p>
            </div>
          )}
          
          {/* 深棕色纸角区域 */}
          <div 
            className="paper-corner" 
            onClick={(e) => {
              e.stopPropagation() // 阻止事件冒泡到父元素
              if (sidePaperClicked) { // 只有右侧米色区域不透明时才能交互
                handleCornerFoldClick()
              }
            }}
            style={{
              transform: cornerFoldClicks === 0 ? 'scale(1)' :
                        cornerFoldClicks === 1 ? 'scale(2.2)' :
                        cornerFoldClicks === 2 ? 'scale(3.4)' :
                        cornerFoldClicks === 3 ? 'scale(9, 6)' :
                        cornerFoldClicks === 4 ? 'scale(3.4)' :
                        cornerFoldClicks === 5 ? 'scale(2.2)' :
                        'scale(1)',
              opacity: 1,
              pointerEvents: !sidePaperClicked ? 'none' : 'auto' // 透明度低时禁用交互，不透明时启用
            }}
          />
        </div>
      )}
    </section>
  )
}

export default Hero
