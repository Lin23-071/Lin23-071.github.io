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
  const [selectedCollage, setSelectedCollage] = useState<string | null>(null)
  const [selectedAbout, setSelectedAbout] = useState<number | null>(null)
  const [showSlidesOverlay, setShowSlidesOverlay] = useState(false)
  const [slidesTextDisplayed, setSlidesTextDisplayed] = useState('')
  const [slidesCursor, setSlidesCursor] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showPictureOverlay, setShowPictureOverlay] = useState(false)
  const [currentPictureSlide, setCurrentPictureSlide] = useState(0)

  const fullText = 'Glad to see you ! :D'
  const typingSpeed = 100
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
  const collageRef = useRef<HTMLDivElement>(null)
  const collageTypes = ['project', 'blog', 'gallery', 'contact']

  const getCollageTypes = () => {
    switch (selectedCard) {
      case 'about':
        return ['project', 'blog', 'gallery', 'contact']
      case 'skills':
        return ['webdev', 'design', 'tools', 'learning']
      case 'contact':
        return ['email', 'social', 'portfolio', 'location']
      case 'fun':
        return ['art', 'music', 'games', 'hobbies']
      default:
        return ['project', 'blog', 'gallery', 'contact']
    }
  }

  const slidesFullText = 'Slides — Project Demos'

  const slideImages = [
    '/PPT-chiikawa.png',
    '/PPT-dehua.png',
    '/PPT-MIABOX.png',
    '/PPT-生涯规划.png',
    '/PPT-罗小黑.png'
  ]

  // Picture images：仅展示 pic-1-1 与 pic-1-2，其他暂用 slideImages 作为占位
  const pictureImages = [
    '/pic-1-1.jpg',
    '/pic-2-1.png',
    ...slideImages
  ]
  // pic-1 系列用于竖向轮播
  const pic1Images = [
    '/pic-1-1.jpg',
    '/pic-1-2.jpg',
    '/pic-1-3.jpg',
    '/pic-1-4.jpg',
    '/pic-1-5.jpg'
  ]
  const [pic1Index, setPic1Index] = useState(0)
  // pic-2 系列：与 pic-1 相同的竖向轮播逻辑
  const pic2Images = [
    '/pic-2-1.png',
    '/pic-2-2.png',
    '/pic-2-3.png',
    '/pic-2-4.png'
  ]
  const [pic2Index, setPic2Index] = useState(0)

  useEffect(() => {
    if (!showSlidesOverlay) {
      setSlidesTextDisplayed('')
      setSlidesCursor(true)
      return
    }

    let current = 0
    setSlidesTextDisplayed('')
    setSlidesCursor(true)
    const timer = setInterval(() => {
      if (current < slidesFullText.length) {
        setSlidesTextDisplayed(slidesFullText.slice(0, current + 1))
        current++
      } else {
        clearInterval(timer)
        setTimeout(() => setSlidesCursor(false), 700)
      }
    }, 70)

    return () => clearInterval(timer)
  }, [showSlidesOverlay])

  useEffect(() => {
    if (!showSlidesOverlay) return
    // 打开弹窗时确保 currentSlide 合法
    setCurrentSlide(prev => (prev < 0 || prev >= slideImages.length) ? 0 : prev)
  }, [showSlidesOverlay])

  useEffect(() => {
    if (!showPictureOverlay) return
    setCurrentPictureSlide(prev => (prev < 0 || prev >= pictureImages.length) ? 0 : prev)
  }, [showPictureOverlay])

  const getOffset = (index: number) => {
    const len = slideImages.length
    let diff = index - currentSlide
    // wrap to shortest distance
    if (diff > len / 2) diff -= len
    if (diff < -len / 2) diff += len
    return diff
  }

  const getOffsetFor = (index: number, current: number, len: number) => {
    let diff = index - current
    if (diff > len / 2) diff -= len
    if (diff < -len / 2) diff += len
    return diff
  }

  const handleSlideClick = (index: number) => {
    if (index === currentSlide) return
    setCurrentSlide(index)
  }

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

  useEffect(() => {
    const handleCollageWheel = (e: WheelEvent) => {
      e.preventDefault()
      const currentCollageTypes = getCollageTypes()
      const currentIndex = selectedCollage ? currentCollageTypes.indexOf(selectedCollage) : -1
      const direction = e.deltaY > 0 ? 1 : -1
      const nextIndex = (currentIndex + direction + currentCollageTypes.length) % currentCollageTypes.length
      setSelectedCollage(currentCollageTypes[nextIndex])
    }

    const collageElement = collageRef.current
    if (collageElement) {
      collageElement.addEventListener('wheel', handleCollageWheel, { passive: false })
    }

    return () => {
      if (collageElement) {
        collageElement.removeEventListener('wheel', handleCollageWheel)
      }
    }
  }, [selectedCollage, selectedCard])

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

  const handleCollageClick = (e: React.MouseEvent, type: string) => {
    e.stopPropagation()
    setSelectedCollage(selectedCollage === type ? null : type)
    // 这里可以添加更多的交互逻辑，比如导航到对应页面
    console.log(`Clicked collage item: ${type}`)
  }

  const handleAboutClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    // 如果同一项再次点击：对于索引0（Slides）打开/关闭幻灯片弹窗，其他项则切换选中状态
    if (selectedAbout === index) {
      if (index === 0) {
        setShowSlidesOverlay(prev => !prev)
        return
      }
      if (index === 1) {
        setShowPictureOverlay(prev => !prev)
        return
      }
      setSelectedAbout(null)
      return
    }
    setSelectedAbout(index)
  }

  const getSkillDescription = (skill: string) => {
    switch (skill) {
      case 'webdev':
        return 'Proficient in modern web development technologies including React, TypeScript, Node.js, and responsive design principles.'
      case 'design':
        return 'Skilled in UI/UX design with tools like Figma and Adobe Creative Suite, focusing on user-centered design approaches.'
      case 'tools':
        return 'Experienced with development tools including Git, Docker, VS Code, and various build systems for efficient workflow.'
      case 'learning':
        return 'Committed to continuous learning, currently exploring AI/ML technologies and advanced frontend frameworks.'
      default:
        return 'Click on a skill to see details'
    }
  }

  const renderSidePaperContent = () => {
    switch (selectedCard) {
      case 'about':
        return (
          <div>
            <h3>About Me Notes</h3>
            <p>Here are some personal insights and background information.</p>
            <p>I'm passionate about creating meaningful digital experiences.</p>
            
            <div className="about-showcase">
              <div 
                key="about-item-0"
                className={`about-item item-1 ${selectedAbout === 0 ? 'selected' : ''}`} 
                onClick={(e) => handleAboutClick(e, 0)}
              >
                <span>📊</span>
                <div className="about-content">
                  <h4>Slides</h4>
                  <p>Presentation materials and project demos</p>
                </div>
                <div 
                  className={`about-index-label ${selectedAbout === 0 ? 'selected' : ''}`}
                  onClick={(e) => handleAboutClick(e, 0)}
                >
                  1
                </div>
              </div>
              <div 
                className={`about-item item-2 ${selectedAbout === 1 ? 'selected' : ''}`} 
                onClick={(e) => handleAboutClick(e, 1)}
              >
                <span>🖼️</span>
                <div className="about-content">
                  <h4>Picture</h4>
                  <p>Visual storytelling through photography</p>
                </div>
                <div 
                  className={`about-index-label ${selectedAbout === 1 ? 'selected' : ''}`}
                  onClick={(e) => handleAboutClick(e, 1)}
                >
                  2
                </div>
              </div>
              <div 
                className={`about-item item-3 ${selectedAbout === 2 ? 'selected' : ''}`} 
                onClick={(e) => handleAboutClick(e, 2)}
              >
                <span>💻</span>
                <div className="about-content">
                  <h4>Code Project</h4>
                  <p>Open source contributions and personal projects</p>
                </div>
                <div 
                  className={`about-index-label ${selectedAbout === 2 ? 'selected' : ''}`}
                  onClick={(e) => handleAboutClick(e, 2)}
                >
                  3
                </div>
              </div>
              <div 
                className={`about-item item-4 ${selectedAbout === 3 ? 'selected' : ''}`} 
                onClick={(e) => handleAboutClick(e, 3)}
              >
                <span>📝</span>
                <div className="about-content">
                  <h4>Words</h4>
                  <p>Writing about technology and life experiences</p>
                </div>
                <div 
                  className={`about-index-label ${selectedAbout === 3 ? 'selected' : ''}`}
                  onClick={(e) => handleAboutClick(e, 3)}
                >
                  4
                </div>
              </div>
              <div 
                className={`about-item item-5 ${selectedAbout === 4 ? 'selected' : ''}`} 
                onClick={(e) => handleAboutClick(e, 4)}
              >
                <span>✨</span>
                <div className="about-content">
                  <h4>Something Else</h4>
                  <p>Creative experiments and random inspirations</p>
                </div>
                <div 
                  className={`about-index-label ${selectedAbout === 4 ? 'selected' : ''}`}
                  onClick={(e) => handleAboutClick(e, 4)}
                >
                  5
                </div>
              </div>
            </div>
          </div>
        )
      case 'skills':
        return (
          <div>
            <h3>Skills Showcase</h3>
            <p>Technical skills and creative abilities that drive innovation.</p>
            <p>Always learning and exploring new technologies.</p>
            
            <div className="collage-showcase" ref={collageRef}>
              <div 
                className={`collage-item ${selectedCollage === 'webdev' ? 'selected' : ''}`} 
                data-type="webdev"
                onClick={(e) => handleCollageClick(e, 'webdev')}
              >
                <div className="collage-content">
                  <span>💻</span>
                  <p>Web Dev</p>
                </div>
              </div>
              <div 
                className={`collage-item ${selectedCollage === 'design' ? 'selected' : ''}`} 
                data-type="design"
                onClick={(e) => handleCollageClick(e, 'design')}
              >
                <div className="collage-content">
                  <span>🎨</span>
                  <p>Design</p>
                </div>
              </div>
              <div 
                className={`collage-item ${selectedCollage === 'tools' ? 'selected' : ''}`} 
                data-type="tools"
                onClick={(e) => handleCollageClick(e, 'tools')}
              >
                <div className="collage-content">
                  <span>🛠️</span>
                  <p>Tools</p>
                </div>
              </div>
              <div 
                className={`collage-item ${selectedCollage === 'learning' ? 'selected' : ''}`} 
                data-type="learning"
                onClick={(e) => handleCollageClick(e, 'learning')}
              >
                <div className="collage-content">
                  <span>📚</span>
                  <p>Learning</p>
                </div>
              </div>
            </div>
            <div className="skill-description" onClick={(e) => e.stopPropagation()}>
              {selectedCollage ? getSkillDescription(selectedCollage) : 'Click on a skill to see details'}
            </div>
          </div>
        )
      case 'contact':
        return (
          <div>
            <h3>Get In Touch</h3>
            <p>Let's connect and create something amazing together!</p>
            <p>Open to collaborations and new opportunities.</p>
            
            <div className="contact-list">
              <div 
                className="contact-item"
                onClick={(e) => { e.stopPropagation(); window.open('https://github.com/Mr23_071', '_blank'); }}
              >
                <span>🐙</span>
                <div className="contact-text">
                  <strong>Github：</strong>Mr23_071
                </div>
              </div>
              <div 
                className="contact-item"
                onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText('2236659454@qq.com').then(() => alert('Email copied to clipboard!')); }}
              >
                <span>📧</span>
                <div className="contact-text">
                  <strong>Email：</strong>2236659454@qq.com
                </div>
              </div>
              <div className="contact-item" onClick={(e) => e.stopPropagation()}>
                <span>📍</span>
                <div className="contact-text">
                  <strong>Location：</strong>Amoy&Shenzhen
                </div>
              </div>
            </div>
          </div>
        )
      case 'fun':
        return (
          <div>
            <h3>Fun & Creative</h3>
            <p>Life is too short not to smile! 😊</p>
            <p>Exploring creativity in all its forms.</p>
            
            <div className="collage-showcase" ref={collageRef}>
              <div 
                className={`collage-item ${selectedCollage === 'art' ? 'selected' : ''}`} 
                data-type="art"
                onClick={(e) => handleCollageClick(e, 'art')}
              >
                <div className="collage-content">
                  <span>🎭</span>
                  <p>Art</p>
                </div>
              </div>
              <div 
                className={`collage-item ${selectedCollage === 'music' ? 'selected' : ''}`} 
                data-type="music"
                onClick={(e) => handleCollageClick(e, 'music')}
              >
                <div className="collage-content">
                  <span>🎵</span>
                  <p>Music</p>
                </div>
              </div>
              <div 
                className={`collage-item ${selectedCollage === 'games' ? 'selected' : ''}`} 
                data-type="games"
                onClick={(e) => handleCollageClick(e, 'games')}
              >
                <div className="collage-content">
                  <span>🎮</span>
                  <p>Games</p>
                </div>
              </div>
              <div 
                className={`collage-item ${selectedCollage === 'hobbies' ? 'selected' : ''}`} 
                data-type="hobbies"
                onClick={(e) => handleCollageClick(e, 'hobbies')}
              >
                <div className="collage-content">
                  <span>🎪</span>
                  <p>Hobbies</p>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div>
            <h3>Additional Notes</h3>
            <p>This is some additional content that appears when you click the side paper area.</p>
            <p>You can add more details, links, or whatever you want here!</p>
            
            <div className="collage-showcase" ref={collageRef}>
              <div 
                className={`collage-item ${selectedCollage === 'project' ? 'selected' : ''}`} 
                data-type="project"
                onClick={(e) => handleCollageClick(e, 'project')}
              >
                <div className="collage-content">
                  <span>🚀</span>
                  <p>Projects</p>
                </div>
              </div>
              <div 
                className={`collage-item ${selectedCollage === 'blog' ? 'selected' : ''}`} 
                data-type="blog"
                onClick={(e) => handleCollageClick(e, 'blog')}
              >
                <div className="collage-content">
                  <span>📝</span>
                  <p>Blog</p>
                </div>
              </div>
              <div 
                className={`collage-item ${selectedCollage === 'gallery' ? 'selected' : ''}`} 
                data-type="gallery"
                onClick={(e) => handleCollageClick(e, 'gallery')}
              >
                <div className="collage-content">
                  <span>🎨</span>
                  <p>Gallery</p>
                </div>
              </div>
              <div 
                className={`collage-item ${selectedCollage === 'contact' ? 'selected' : ''}`} 
                data-type="contact"
                onClick={(e) => handleCollageClick(e, 'contact')}
              >
                <div className="collage-content">
                  <span>📧</span>
                  <p>Contact</p>
                </div>
              </div>
            </div>
          </div>
        )
    }
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
              {renderSidePaperContent()}
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
      {showSlidesOverlay && (
        <div className="slides-overlay" onClick={() => setShowSlidesOverlay(false)}>
          <div className="slides-expanded-paper" onClick={(e) => e.stopPropagation()}>
            <div className="slides-typing-text">
              {slidesTextDisplayed}
              {slidesCursor && <span className="cursor">|</span>}
            </div>
            <div className="slides-images">
              {slideImages.map((src, i) => {
                const offset = getOffset(i) // -2..2
                const abs = Math.abs(offset)
                // sizes and spacing
                const scale = abs === 0 ? 1 : abs === 1 ? 0.62 : 0.44
                const x = offset * 300 // horizontal spacing
                const z = 50 - abs // center on top
                const opacity = abs > 2 ? 0 : (abs === 0 ? 1 : 0.9 - abs * 0.12)
                return (
                  <div
                    key={src}
                    className={`slide-image slide-${i}`}
                    onClick={() => handleSlideClick(i)}
                    style={{
                      transform: `translateX(${x}px) scale(${scale})`,
                      zIndex: z,
                      opacity,
                      transition: 'transform 420ms cubic-bezier(.22,.61,.36,1), opacity 360ms ease'
                    }}
                  >
                    <img src={src} alt={`slide-${i}`} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {showPictureOverlay && (
        <div className="slides-overlay" onClick={() => setShowPictureOverlay(false)}>
          <div className="slides-expanded-paper" onClick={(e) => e.stopPropagation()}>
            <div className="vertical-frost" aria-hidden="true" />
            <div className="slides-images pictures">
              {pictureImages.map((src, i) => {
                const len = pictureImages.length
                const offset = getOffsetFor(i, currentPictureSlide, len)
                const abs = Math.abs(offset)
                const scale = abs === 0 ? 1 : abs === 1 ? 0.62 : 0.44
                const x = offset * 300
                const z = 50 - abs
                const opacity = abs > 2 ? 0 : (abs === 0 ? 1 : 0.92 - abs * 0.12)
                return (
                  <div
                    key={src}
                    className={`slide-image picture-${i}`}
                    onClick={() => setCurrentPictureSlide(i)}
                    style={{
                      transform: `translateX(${x}px) scale(${scale})`,
                      zIndex: z,
                      opacity,
                      transition: 'transform 420ms cubic-bezier(.22,.61,.36,1), opacity 360ms ease'
                    }}
                  >
                    {/* 居中且为 pic-1 或 pic-2 系列时渲染竖向轮播 */}
                    {abs === 0 && (src.startsWith('/pic-1') || src.startsWith('/pic-2')) ? (
                      <div className="vertical-carousel">
                        {((src.startsWith('/pic-1') ? pic1Images : pic2Images) as string[]).map((p, idx) => {
                          const is1 = src.startsWith('/pic-1')
                          const currentIndex = is1 ? pic1Index : pic2Index
                          const setter = is1 ? setPic1Index : setPic2Index
                          let diff = idx - currentIndex
                          const lenV = (is1 ? pic1Images : pic2Images).length
                          if (diff > lenV / 2) diff -= lenV
                          if (diff < -lenV / 2) diff += lenV
                          const abs2 = Math.abs(diff)
                          const y = diff * 220
                          const scaleV = abs2 === 0 ? 1 : abs2 === 1 ? 0.62 : 0.44
                          const z = 60 - abs2
                          const opacityV = abs2 > 2 ? 0 : (abs2 === 0 ? 1 : 0.9 - abs2 * 0.12)
                          return (
                            <div
                              key={p}
                              className={`vc-item vc-${idx}`}
                              onClick={() => setter(idx)}
                              style={{
                                transform: `translate(-50%, calc(-50% + ${y}px)) scale(${scaleV})`,
                                zIndex: z,
                                opacity: opacityV,
                                transition: 'transform 420ms cubic-bezier(.22,.61,.36,1), opacity 360ms ease'
                              }}
                            >
                              <img src={p} alt={`${is1 ? 'pic1' : 'pic2'}-${idx}`} />
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <img src={src} alt={`picture-${i}`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Hero
