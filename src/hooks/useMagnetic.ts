import { useEffect, useRef } from 'react'

/**
 * 磁性悬停：元素朝鼠标方向轻微位移，离开后弹回。
 * 触屏与 reduce-motion 下自动禁用。
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.14) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return

    const move = (e: MouseEvent) => {
      if (!el.isConnected) return
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      el.style.transform = `translate(${(dx * strength).toFixed(1)}px, ${(dy * strength).toFixed(1)}px)`
    }
    const leave = () => {
      el.style.transform = ''
    }

    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', leave)
    return () => {
      el.removeEventListener('mousemove', move)
      el.removeEventListener('mouseleave', leave)
    }
  }, [strength])

  return ref
}
