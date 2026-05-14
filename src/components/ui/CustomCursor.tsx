import { useEffect, useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

export function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const glowX = useMotionValue(-100)
  const glowY = useMotionValue(-100)
  const springX = useSpring(cursorX, { stiffness: 500, damping: 28 })
  const springY = useSpring(cursorY, { stiffness: 500, damping: 28 })
  const glowSpringX = useSpring(glowX, { stiffness: 40, damping: 20 })
  const glowSpringY = useSpring(glowY, { stiffness: 40, damping: 20 })
  const hoveringRef = useRef(false)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX)
    cursorY.set(e.clientY)
    glowX.set(e.clientX)
    glowY.set(e.clientY)
  }, [cursorX, cursorY, glowX, glowY])

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('a, button, [role="button"], .magnetic-target')) {
      hoveringRef.current = true
    }
  }, [])

  const handleMouseOut = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('a, button, [role="button"], .magnetic-target')) {
      hoveringRef.current = false
    }
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseover', handleMouseOver, { passive: true })
    document.addEventListener('mouseout', handleMouseOut, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [handleMouseMove, handleMouseOver, handleMouseOut])

  return (
    <>
      <motion.div
        className="custom-cursor"
        style={{ left: springX, top: springY }}
      />
      <motion.div
        className="cursor-glow"
        style={{ left: glowSpringX, top: glowSpringY }}
      />
    </>
  )
}
