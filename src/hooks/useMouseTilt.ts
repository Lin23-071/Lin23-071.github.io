import { useEffect, useRef } from 'react'

/**
 * 鼠标倾斜：根据鼠标位置给元素加 3D 透视旋转，移开后还原。
 * @param maxDeg 最大倾斜角度
 */
export function useMouseTilt<T extends HTMLElement = HTMLDivElement>(maxDeg = 6) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let raf = 0
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    const animate = () => {
      currentX += (targetX - currentX) * 0.15
      currentY += (targetY - currentY) * 0.15
      el.style.transform = `perspective(800px) rotateX(${currentY}deg) rotateY(${currentX}deg)`
      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        raf = requestAnimationFrame(animate)
      } else {
        raf = 0
      }
    }

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      targetX = x * maxDeg
      targetY = -y * maxDeg
      if (!raf) raf = requestAnimationFrame(animate)
    }

    const onLeave = () => {
      targetX = 0
      targetY = 0
      if (!raf) raf = requestAnimationFrame(animate)
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)

    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [maxDeg])

  return ref
}
