import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { SplitHeadline } from '../ui/SplitHeadline'
import { MagneticButton } from '../ui/MagneticButton'
import { HeroCanvas } from './HeroCanvas'
import { HERO, CTA } from '../../lib/content'

gsap.registerPlugin(ScrollTrigger)

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!sectionRef.current) return

      const chars = sectionRef.current.querySelectorAll('.split-char')
      const title = sectionRef.current.querySelector('.hero-title')
      const subtitle = sectionRef.current.querySelector('.hero-subtitle')
      const cta = sectionRef.current.querySelector('.hero-cta')

      gsap.set(chars, { opacity: 0, y: 80, rotateX: -90 })
      gsap.set(title, { opacity: 0, y: 40 })
      gsap.set(subtitle, { opacity: 0, y: 30 })
      gsap.set(cta, { opacity: 0, scale: 0.8 })

      ScrollTrigger.matchMedia({
        '(min-width: 768px)': () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              pin: true,
              scrub: 1,
              start: 'top top',
              end: '+=500%',
              pinSpacing: true,
            },
          })

          tl.to(chars, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            stagger: 0.03,
            duration: 1,
            ease: 'power3.out',
          })
            .to(title, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
            .to(subtitle, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
            .to(cta, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }, '-=0.2')
            .to({}, { duration: 2 })
        },
        '(max-width: 767px)': () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              pin: true,
              scrub: 1,
              start: 'top top',
              end: '+=250%',
              pinSpacing: true,
            },
          })

          tl.to(chars, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            stagger: 0.02,
            duration: 0.8,
            ease: 'power3.out',
          })
            .to(title, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.3')
            .to(subtitle, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.2')
            .to(cta, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }, '-=0.1')
            .to({}, { duration: 1 })
        },
      })
    },
    { scope: sectionRef },
  )

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const event = new CustomEvent('hero-scroll', { detail: self.progress })
        window.dispatchEvent(event)
      },
    })

    return () => { st.kill() }
  }, [])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="section-pin relative h-screen w-full overflow-hidden"
      style={{ background: 'var(--color-bg)' }}
    >
      <HeroCanvas />

      <div className="ambient-mesh">
        <div className="ambient-orb hero-glow-1" />
        <div className="ambient-orb hero-glow-2" />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
        <SplitHeadline
          as="h1"
          className="mb-4 text-center font-extrabold leading-none tracking-tight"
          style={{
            fontSize: 'clamp(3.5rem, 8vw, 7rem)',
            color: 'var(--color-text)',
            perspective: '600px',
          }}
        >
          {HERO.name}
        </SplitHeadline>
        <p
          className="hero-title mt-2 text-center font-mono text-lg tracking-widest uppercase"
          style={{ color: 'var(--color-accent)' }}
        >
          {HERO.title}
        </p>
        <p
          className="hero-title mt-1 text-center font-mono text-sm tracking-wider"
          style={{ color: 'var(--color-text-2)' }}
        >
          {HERO.titlePT}
        </p>
        <p
          className="hero-subtitle mt-8 max-w-xl text-center text-lg leading-relaxed"
          style={{ color: 'var(--color-text-2)' }}
        >
          {HERO.subtitle}
        </p>
        <div className="hero-cta mt-12">
          <MagneticButton
            href={CTA.link}
            className="inline-flex items-center gap-2 rounded-full px-8 py-4 font-semibold text-sm uppercase tracking-wider"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            {CTA.headline}
            <span className="inline-block">&darr;</span>
          </MagneticButton>
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
        style={{ background: 'linear-gradient(to top, var(--color-bg), transparent)' }}
      />
    </section>
  )
}
