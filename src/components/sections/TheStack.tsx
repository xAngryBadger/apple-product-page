import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { STACK } from '../../lib/content'
import type { Skill } from '../../lib/content'

gsap.registerPlugin(ScrollTrigger)

const categoryLabels: Record<string, string> = {
  core: 'Core',
  animation: 'Animation',
  '3d': '3D',
  styling: 'Styling',
  backend: 'Backend',
  systems: 'Systems',
}

function SkillIcon({ skill }: { skill: Skill }) {
  const shortName =
    skill.name === 'R3F'
      ? 'R3F'
      : skill.name.replace(/[^A-Z0-9]/g, '').slice(0, 2) || skill.name.slice(0, 2)

  return (
    <div
      className="stack-skill gpu flex flex-col items-center gap-3 rounded-2xl border p-4 md:p-6"
      style={{
        borderColor: `${skill.color}33`,
        background: `${skill.color}0a`,
      }}
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl font-mono text-base font-bold md:h-12 md:w-12 md:text-lg"
        style={{
          color: skill.color,
          background: `${skill.color}15`,
          border: `1px solid ${skill.color}33`,
        }}
      >
        {shortName}
      </div>
      <span className="text-xs font-semibold md:text-sm" style={{ color: 'var(--color-text)' }}>
        {skill.name}
      </span>
      <span
        className="text-xs font-mono uppercase tracking-wider"
        style={{ color: 'var(--color-text-3)' }}
      >
        {categoryLabels[skill.category]}
      </span>
    </div>
  )
}

export function TheStack() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      if (!sectionRef.current) return

      const headline = headlineRef.current
      const skills = sectionRef.current.querySelectorAll('.stack-skill')

      gsap.set(skills, { opacity: 0, y: 40, scale: 0.8 })

      ScrollTrigger.matchMedia({
        '(min-width: 768px)': () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              pin: true,
              scrub: 1,
              start: 'top top',
              end: '+=300%',
              pinSpacing: true,
            },
          })

          tl.fromTo(
            headline,
            { fontVariationSettings: '"wght" 200' },
            { fontVariationSettings: '"wght" 800', duration: 2, ease: 'none' },
          )
            .to(
              skills,
              {
                opacity: 1,
                y: 0,
                scale: 1,
                stagger: { each: 0.08, from: 'random' },
                duration: 0.6,
                ease: 'back.out(1.4)',
              },
              0.5,
            )
            .to({}, { duration: 1 })
        },
        '(max-width: 767px)': () => {
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

          tl.fromTo(
            headline,
            { fontVariationSettings: '"wght" 200' },
            { fontVariationSettings: '"wght" 800', duration: 1.5, ease: 'none' },
          ).to(
            skills,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              stagger: { each: 0.05, from: 'random' },
              duration: 0.4,
              ease: 'back.out(1.4)',
            },
            0.3,
          )
        },
      })
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      className="section-pin relative flex h-screen w-full flex-col items-center justify-center overflow-hidden"
      style={{ background: 'var(--color-bg)' }}
    >
      <div className="mx-auto w-full max-w-5xl px-6">
        <h2
          ref={headlineRef}
          className="mb-16 text-center font-bold leading-tight tracking-tight"
          style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontVariationSettings: '"wght" 200',
            color: 'var(--color-text)',
          }}
        >
          The Stack
        </h2>

        <div className="grid grid-cols-3 gap-3 md:grid-cols-5 md:gap-4">
          {STACK.map((skill) => (
            <SkillIcon key={skill.name} skill={skill} />
          ))}
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24"
        style={{ background: 'linear-gradient(to top, var(--color-bg), transparent)' }}
      />
    </section>
  )
}
