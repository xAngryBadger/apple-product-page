import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export function Preloader() {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const [exited, setExited] = useState(false)

  const startCount = useCallback(() => {
    const totalFrames = 90
    let frame = 0

    const tick = () => {
      frame++
      const t = frame / totalFrames
      const eased = 1 - Math.pow(1 - t, 3)
      setProgress(Math.min(100, Math.round(eased * 100)))

      if (frame < totalFrames) {
        requestAnimationFrame(tick)
      } else {
        setProgress(100)
        setTimeout(() => setDone(true), 400)
      }
    }

    requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    startCount()
  }, [startCount])

  const handleExitComplete = useCallback(() => {
    setExited(true)
  }, [])

  if (exited) return null

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!done && (
        <motion.div
          initial={{ clipPath: 'inset(0 0 0 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[10000] flex items-center justify-center"
          style={{ background: 'var(--color-bg)' }}
        >
          <div className="flex flex-col items-center gap-6">
            <span
              className="font-mono text-6xl font-bold tabular-nums tracking-tight md:text-8xl"
              style={{ color: 'var(--color-accent)' }}
            >
              {String(progress).padStart(3, '0')}
            </span>
            <div className="h-[2px] w-48 overflow-hidden rounded-full" style={{ background: 'var(--color-bg-alt)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, var(--color-accent), var(--color-accent-light))' }}
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
