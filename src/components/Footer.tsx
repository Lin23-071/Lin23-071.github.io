import { useState, useEffect, useRef } from 'react'
import './Footer.css'

const Footer = () => {
  const [copied, setCopied] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const footerRef = useRef<HTMLElement>(null)
  const email = 'hi@example.com' // 替换为你的邮箱

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (footerRef.current) {
      observer.observe(footerRef.current)
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current)
      }
    }
  }, [])

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('复制失败:', err)
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = email
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <footer id="contact" className={`footer ${isVisible ? 'visible' : ''}`} ref={footerRef}>
      <div className="container">
        <div className="footer-content glass">
          <h2 className="footer-title">保持联系</h2>
          <p className="footer-subtitle">有想法？让我们一起聊聊</p>
          
          <button 
            className="email-button"
            onClick={handleCopyEmail}
            aria-label="复制邮箱地址"
          >
            <span className="email-text">{email}</span>
            <span className="copy-icon">{copied ? '✓' : '📋'}</span>
            {copied && (
              <span className="copy-toast">已复制！</span>
            )}
          </button>

          <div className="footer-links">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-link">
              GitHub
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-link">
              Twitter
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-link">
              LinkedIn
            </a>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} 个人主页. 保留所有权利.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
