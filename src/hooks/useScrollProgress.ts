import { useEffect, useRef } from 'react'

export function useScrollProgress() {
  const progress = useRef(0)

  useEffect(() => {
    const handler = (e: Event) => {
      progress.current = (e as CustomEvent<number>).detail
    }
    window.addEventListener('cosmos-scroll', handler)
    return () => window.removeEventListener('cosmos-scroll', handler)
  }, [])

  return progress
}

export function useCursorWorld() {
  const cursor = useRef({ x: 0, y: 0, active: false })

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      cursor.current.x = (e.clientX / window.innerWidth) * 2 - 1
      cursor.current.y = -(e.clientY / window.innerHeight) * 2 + 1
      cursor.current.active = true
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return cursor
}
