import { useEffect, useState } from 'react'

/**
 * 打字机效果：逐字输出文本。
 * @param text 目标文本
 * @param speedMs 每个字符间隔（毫秒）
 */
export function useTypewriter(text: string, speedMs = 60) {
  const [out, setOut] = useState('')

  useEffect(() => {
    setOut('')
    if (!text) return
    let i = 0
    const id = window.setInterval(() => {
      i++
      setOut(text.slice(0, i))
      if (i >= text.length) {
        window.clearInterval(id)
      }
    }, speedMs)
    return () => window.clearInterval(id)
  }, [text, speedMs])

  return out
}
