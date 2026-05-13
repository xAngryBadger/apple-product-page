import { useRef, useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance: Lenis | null = null

export function useLenis() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const isMobile = window.innerWidth < 768
    if (isMobile) {
      ScrollTrigger.defaults({ toggleActions: 'play none none none' })
      return
    }

    lenisInstance = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    })

    lenisInstance.on('scroll', ScrollTrigger.update)

    const tickerCallback = (time: number) => {
      lenisInstance?.raf(time * 1000)
    }
    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tickerCallback)
      lenisInstance?.destroy()
      lenisInstance = null
    }
  }, [])
}

export function getLenis() {
  return lenisInstance
}
