import { useSyncExternalStore } from 'react'

export const STARDUST_TOTAL = 9
const KEY = '071-stardust'

function load(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(raw) ? raw.filter((v) => typeof v === 'string') : []
  } catch {
    return []
  }
}

let ids: string[] = load()
let version = 0
const listeners = new Set<() => void>()

function emit() {
  version++
  listeners.forEach((fn) => fn())
}

/** 收集一枚星星。重复收集返回 false。 */
export function collect(id: string): boolean {
  if (ids.includes(id)) return false
  ids = [...ids, id]
  try {
    localStorage.setItem(KEY, JSON.stringify(ids))
  } catch {
    // 隐私模式下静默降级：只活在当前会话
  }
  emit()
  return true
}

export function hasStardust(id: string): boolean {
  return ids.includes(id)
}

export function collectedList(): string[] {
  return ids
}

export function resetStardust() {
  ids = []
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
  emit()
}

function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

/** 订阅星星变化，返回版本号（变化即重渲染） */
export function useStardustVersion(): number {
  return useSyncExternalStore(
    subscribe,
    () => version,
    () => 0,
  )
}
