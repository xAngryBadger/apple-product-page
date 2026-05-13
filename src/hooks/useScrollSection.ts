import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

interface ScrollSectionOptions {
  trigger: string
  pin?: boolean
  scrub?: number | boolean
  start?: string
  end?: string
  endTrigger?: string
  pinSpacing?: boolean
}

export function useScrollSection(options: ScrollSectionOptions) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!containerRef.current) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: options.pin ?? true,
          scrub: options.scrub ?? 1,
          start: options.start ?? 'top top',
          end: options.end ?? '+=200%',
          pinSpacing: options.pinSpacing ?? true,
        },
      })

      return () => {
        tl.kill()
      }
    },
    { scope: containerRef },
  )

  return containerRef
}
