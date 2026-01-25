import { useState, useRef, useEffect } from 'react'
import './Projects.css'

interface Project {
  id: number
  title: string
  description: string
  category: 'hand-drawn' | 'web' | 'program'
  tags: string[]
  image?: string
}

const projects: Project[] = [
  {
    id: 1,
    title: '手绘插画集',
    description: '一系列充满创意的手绘作品，展现独特的艺术风格',
    category: 'hand-drawn',
    tags: ['插画', '手绘', '艺术'],
  },
  {
    id: 2,
    title: '响应式网站设计',
    description: '现代化的响应式网站，采用最新的设计趋势',
    category: 'web',
    tags: ['网页设计', 'UI/UX', '响应式'],
  },
  {
    id: 3,
    title: 'React 应用开发',
    description: '使用 React 和 TypeScript 构建的高性能 Web 应用',
    category: 'program',
    tags: ['React', 'TypeScript', '前端'],
  },
  {
    id: 4,
    title: '品牌视觉设计',
    description: '为品牌打造独特的视觉识别系统',
    category: 'hand-drawn',
    tags: ['品牌设计', '视觉', '创意'],
  },
  {
    id: 5,
    title: '移动端应用',
    description: '流畅的移动端用户体验设计',
    category: 'web',
    tags: ['移动端', 'UI设计', '交互'],
  },
  {
    id: 6,
    title: '全栈项目',
    description: '前后端分离的完整项目解决方案',
    category: 'program',
    tags: ['全栈', 'Node.js', '数据库'],
  },
]

const categories = [
  { id: 'all', label: '全部' },
  { id: 'hand-drawn', label: '手绘' },
  { id: 'web', label: '网页' },
  { id: 'program', label: '程序' },
]

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const gridRef = useRef<HTMLDivElement>(null)

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(project => project.category === activeCategory)

  // 鼠标跟踪光晕效果
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const handleMouseMove = (e: MouseEvent) => {
      const cards = grid.querySelectorAll('.project-card')
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        
        ;(card as HTMLElement).style.setProperty('--mouse-x', `${x}px`)
        ;(card as HTMLElement).style.setProperty('--mouse-y', `${y}px`)
      })
    }

    grid.addEventListener('mousemove', handleMouseMove)
    return () => grid.removeEventListener('mousemove', handleMouseMove)
  }, [activeCategory])

  return (
    <section id="projects" className="projects-section">
      <div className="container">
        <h2 className="section-title">作品集</h2>
        
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category.id}
              className={`filter-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="projects-grid" ref={gridRef}>
          {filteredProjects.map(project => (
            <div
              key={project.id}
              className="project-card glass"
            >
              <div className="project-image">
                <div className="project-placeholder">
                  {project.category === 'hand-drawn' && '🎨'}
                  {project.category === 'web' && '🌐'}
                  {project.category === 'program' && '💻'}
                </div>
              </div>
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag, index) => (
                    <span key={index} className="project-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
