import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { motion, AnimatePresence, useInView } from 'motion/react'
import { MagneticButton } from '../ui/MagneticButton'
import { STATS, IMPACT, CTA } from '../../lib/content'
import type { Stat } from '../../lib/content'

gsap.registerPlugin(ScrollTrigger)

function AnimatedCounter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        const obj = { val: 0 }
        gsap.to(obj, {
          val: stat.value,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            setValue(Math.round(obj.val))
          },
        })
      },
    })

    return () => {
      trigger.kill()
    }
  }, [stat.value])

  return (
    <div className="text-center">
      <span
        ref={ref}
        className="text-5xl font-extrabold tabular-nums md:text-6xl"
        style={{ color: 'var(--color-accent)' }}
      >
        {value}
        {stat.suffix}
      </span>
      <p
        className="mt-2 text-sm font-mono uppercase tracking-wider"
        style={{ color: 'var(--color-text-2)' }}
      >
        {stat.label}
      </p>
    </div>
  )
}

export function TheImpact() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ctaRef, { once: true, margin: '-100px' })

  useGSAP(
    () => {
      if (!sectionRef.current) return

      const statItems = sectionRef.current.querySelectorAll('.impact-stat')
      const pcdLine = sectionRef.current.querySelector('.pcd-line')
      const availLine = sectionRef.current.querySelector('.avail-line')

      gsap.set(statItems, { opacity: 0, y: 30 })
      gsap.set(pcdLine, { opacity: 0, scale: 0.9 })
      gsap.set(availLine, { opacity: 0, y: 20 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          once: true,
        },
      })

      tl.to(statItems, {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
      })
        .to(
          pcdLine,
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.5)',
          },
          '-=0.3',
        )
        .to(
          availLine,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
          },
          '-=0.2',
        )
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden"
      style={{ background: 'var(--color-bg)' }}
    >
      <div className="ambient-mesh">
        <div className="ambient-orb impact-glow" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 py-24">
        <h2
          className="mb-16 text-center font-bold leading-tight tracking-tight"
          style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            color: 'var(--color-text)',
          }}
        >
          The Impact
        </h2>

        <div className="grid gap-12 md:grid-cols-3">
          {STATS.map((stat) => (
            <div key={stat.label} className="impact-stat">
              <AnimatedCounter stat={stat} />
            </div>
          ))}
        </div>

        <div className="pcd-line mt-16 text-center">
          <span
            className="inline-block rounded-full px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest"
            style={{
              color: 'var(--color-sage)',
              border: '2px solid var(--color-sage)',
            }}
          >
            {IMPACT.pcdLine}
          </span>
        </div>

        <div className="avail-line mt-8 text-center">
          <p className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
            {IMPACT.available}
          </p>
        </div>

        <div ref={ctaRef} className="mt-20 text-center">
          <AnimatePresence>
            {isInView && (
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 120, damping: 14 }}
              >
                <MagneticButton
                  href={CTA.link}
                  className="inline-flex items-center gap-3 rounded-full px-10 py-5 text-base font-bold uppercase tracking-wider"
                  style={{
                    background: 'var(--color-accent)',
                    color: 'var(--color-bg)',
                  }}
                >
                  {CTA.headline}
                  <span className="inline-block">&rarr;</span>
                </MagneticButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
