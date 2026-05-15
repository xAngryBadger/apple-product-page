import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export function CosmosTransition() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!sectionRef.current) return

      const directive = sectionRef.current.querySelector('.cosmos-directive')
      const arrow = sectionRef.current.querySelector('.cosmos-arrow')

      gsap.set(directive, { opacity: 0, y: 30 })
      gsap.set(arrow, { opacity: 0, y: -10 })

      ScrollTrigger.matchMedia({
        '(min-width: 768px)': () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              pin: true,
              scrub: 1,
              start: 'top top',
              end: '+=150%',
              pinSpacing: true,
            },
          })

          tl.to(directive, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
            .to(arrow, { opacity: 0.6, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.2')
            .to({}, { duration: 1 })
        },
        '(max-width: 767px)': () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              pin: true,
              scrub: 1,
              start: 'top top',
              end: '+=100%',
              pinSpacing: true,
            },
          })

          tl.to(directive, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' })
            .to(arrow, { opacity: 0.6, y: 0, duration: 0.3, ease: 'power2.out' }, '-=0.1')
        },
      })
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      className="section-pin relative flex h-screen w-full items-center justify-center overflow-hidden"
      style={{ background: 'transparent' }}
    >
      <div className="relative z-10 flex flex-col items-center gap-6 px-6">
        <p
          className="cosmos-directive font-mono text-sm uppercase tracking-[0.3em] md:text-base"
          style={{ color: 'var(--color-text-3)' }}
        >
          Scroll to Explore
        </p>
        <div
          className="cosmos-arrow flex flex-col items-center gap-1"
          style={{ color: 'var(--color-accent)' }}
        >
          <span className="font-mono text-xs tracking-widest opacity-60">↓</span>
          <span className="font-mono text-xs tracking-widest opacity-40">↓</span>
          <span className="font-mono text-xs tracking-widest opacity-20">↓</span>
        </div>
      </div>
    </section>
  )
}
