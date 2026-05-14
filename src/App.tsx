import { useRef, useEffect } from 'react'
import type { LenisRef } from 'lenis/react'
import { ReactLenis, useLenis } from 'lenis/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HeroSection } from './components/hero/HeroSection'
import { TheApproach } from './components/sections/TheApproach'
import { TheStack } from './components/sections/TheStack'
import { TheWork } from './components/sections/TheWork'
import { TheImpact } from './components/sections/TheImpact'
import { CustomCursor } from './components/ui/CustomCursor'
import { NoiseOverlay } from './components/ui/NoiseOverlay'
import { ScrollProgress } from './components/ui/ScrollProgress'

gsap.registerPlugin(ScrollTrigger)

function ScrollProxy() {
  useLenis(() => {
    ScrollTrigger.update()
  })

  useEffect(() => {
    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return null
}

export default function App() {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(update)
    }
  }, [])

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{ lerp: 0.1, smoothWheel: true, autoRaf: false }}
    >
      <ScrollProxy />
      <CustomCursor />
      <ScrollProgress />
      <NoiseOverlay />
      <main className="relative" style={{ background: 'var(--color-bg)' }}>
        <HeroSection />
        <TheApproach />
        <TheStack />
        <TheWork />
        <TheImpact />

        <footer
          className="py-8 text-center font-mono text-xs tracking-wider"
          style={{
            color: 'var(--color-text-3)',
            background: 'var(--color-bg)',
          }}
        >
          You Are The Product
        </footer>
      </main>
    </ReactLenis>
  )
}
