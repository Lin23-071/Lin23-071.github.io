import { useState, useEffect, useRef } from 'react'
import './Skills.css'

interface Skill {
  name: string
  percentage: number
  color: string
}

const skills: Skill[] = [
  { name: '前端开发', percentage: 85, color: '#2a9d8f' },
  { name: 'UI设计', percentage: 75, color: '#e9c46a' },
  { name: 'React', percentage: 90, color: '#2a9d8f' },
  { name: 'TypeScript', percentage: 80, color: '#457b9d' },
  { name: 'Node.js', percentage: 70, color: '#a8dadc' },
  { name: '创意设计', percentage: 88, color: '#e9c46a' },
]

const Skills = () => {
  const [hoveredSkill, setHoveredSkill] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const totalPercentage = skills.reduce((sum, skill) => sum + skill.percentage, 0)
  let currentAngle = -90 // 从顶部开始

  return (
    <section id="skills" className="skills-section" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">技能树</h2>
        <div className="skills-container">
          <div className={`skills-ring ${isVisible ? 'visible' : ''}`}>
            <svg viewBox="0 0 300 300" className="skills-svg">
              <defs>
                {skills.map((skill, index) => (
                  <linearGradient key={index} id={`gradient-${index}`}>
                    <stop offset="0%" stopColor={skill.color} stopOpacity="0.6" />
                    <stop offset="100%" stopColor={skill.color} stopOpacity="1" />
                  </linearGradient>
                ))}
              </defs>
              
              {skills.map((skill, index) => {
                const angle = (skill.percentage / totalPercentage) * 360
                const startAngle = currentAngle
                const endAngle = currentAngle + angle
                currentAngle = endAngle

                const startAngleRad = (startAngle * Math.PI) / 180
                const endAngleRad = (endAngle * Math.PI) / 180
                const radius = 120
                const centerX = 150
                const centerY = 150

                const x1 = centerX + radius * Math.cos(startAngleRad)
                const y1 = centerY + radius * Math.sin(startAngleRad)
                const x2 = centerX + radius * Math.cos(endAngleRad)
                const y2 = centerY + radius * Math.sin(endAngleRad)

                const largeArcFlag = angle > 180 ? 1 : 0

                const pathData = [
                  `M ${centerX} ${centerY}`,
                  `L ${x1} ${y1}`,
                  `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  'Z'
                ].join(' ')

                const isHovered = hoveredSkill === index

                return (
                  <path
                    key={index}
                    d={pathData}
                    fill={`url(#gradient-${index})`}
                    className={`skill-arc ${isHovered ? 'hovered' : ''}`}
                    onMouseEnter={() => setHoveredSkill(index)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    style={{
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      filter: isHovered ? 'brightness(1.3) drop-shadow(0 0 10px ' + skill.color + ')' : 'none'
                    }}
                  />
                )
              })}
            </svg>
            
            <div className="skills-labels">
              {skills.map((skill, index) => {
                const angle = skills.slice(0, index).reduce((sum, s) => 
                  sum + (s.percentage / totalPercentage) * 360, 0
                ) + (skill.percentage / totalPercentage) * 180 - 90
                
                const angleRad = (angle * Math.PI) / 180
                const radius = 100
                const centerX = 150
                const centerY = 150
                const labelX = centerX + radius * Math.cos(angleRad)
                const labelY = centerY + radius * Math.sin(angleRad)

                return (
                  <div
                    key={index}
                    className={`skill-label ${hoveredSkill === index ? 'active' : ''}`}
                    style={{
                      left: `${labelX}px`,
                      top: `${labelY}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onMouseEnter={() => setHoveredSkill(index)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    <span className="skill-name">{skill.name}</span>
                    {hoveredSkill === index && (
                      <span className="skill-percentage">{skill.percentage}%</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills
