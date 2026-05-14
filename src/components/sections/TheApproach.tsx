import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { SplitHeadline } from '../ui/SplitHeadline'
import { APPROACH } from '../../lib/content'

gsap.registerPlugin(ScrollTrigger)

export function TheApproach() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!sectionRef.current) return

      const chars = sectionRef.current.querySelectorAll('.split-char')
      const words = sectionRef.current.querySelectorAll('.approach-word')

      gsap.set(chars, { opacity: 0, y: 60, rotateY: -60 })
      gsap.set(words, { opacity: 0, y: 20 })

      ScrollTrigger.matchMedia({
        '(min-width: 768px)': () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              pin: true,
              scrub: 1,
              start: 'top top',
              end: '+=200%',
              pinSpacing: true,
            },
          })

          tl.to(chars, {
            opacity: 1,
            y: 0,
            rotateY: 0,
            stagger: 0.025,
            duration: 1,
            ease: 'power3.out',
          }).to(
            words,
            { opacity: 1, y: 0, stagger: 0.02, duration: 1, ease: 'power2.out' },
            '-=0.5',
          )
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

          tl.to(chars, {
            opacity: 1,
            y: 0,
            rotateY: 0,
            stagger: 0.02,
            duration: 0.8,
            ease: 'power3.out',
          }).to(
            words,
            { opacity: 1, y: 0, stagger: 0.015, duration: 0.8, ease: 'power2.out' },
            '-=0.4',
          )
        },
      })
    },
    { scope: sectionRef },
  )

  const bodyWords = APPROACH.body.split(' ')

  return (
    <section
      ref={sectionRef}
      className="section-pin relative flex h-screen w-full items-center justify-center overflow-hidden"
      style={{ background: 'var(--color-bg-alt)' }}
    >
      <div className="ambient-mesh">
        <div className="ambient-orb approach-glow" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <SplitHeadline
          as="h2"
          className="mb-12 text-center font-bold leading-tight tracking-tight"
          style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            color: 'var(--color-text)',
            perspective: '600px',
          }}
        >
          {APPROACH.headline}
        </SplitHeadline>

        <p
          className="text-lg leading-relaxed md:text-xl"
          style={{ color: 'var(--color-text-2)' }}
        >
          {bodyWords.map((word, i) => (
            <span
              key={i}
              className="approach-word inline-block"
              style={{ willChange: 'transform, opacity' }}
            >
              {word}&nbsp;
            </span>
          ))}
        </p>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24"
        style={{ background: 'linear-gradient(to top, var(--color-bg-alt), transparent)' }}
      />
    </section>
  )
}
