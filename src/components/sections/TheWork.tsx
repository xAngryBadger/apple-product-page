import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { WORK } from '../../lib/content'
import type { Project } from '../../lib/content'

gsap.registerPlugin(ScrollTrigger)

function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      href={project.github}
      target="_blank"
      rel="noopener noreferrer"
      className="work-card gpu group block flex-shrink-0 overflow-hidden rounded-2xl border transition-all duration-300"
      style={{
        width: 'clamp(280px, 30vw, 420px)',
        borderColor: 'var(--color-bg)',
        background: 'rgba(17, 17, 17, 0.7)',
        backdropFilter: 'blur(12px)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${project.accent}44`
        e.currentTarget.style.boxShadow = `0 0 40px ${project.accent}0a, 0 8px 32px rgba(0,0,0,0.3)`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-bg)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div className="p-6 md:p-8">
        <div
          className="mb-4 inline-block rounded-full px-3 py-1 font-mono text-xs uppercase tracking-wider"
          style={{
            background: `${project.accent}1a`,
            color: project.accent,
            border: `1px solid ${project.accent}33`,
          }}
        >
          {project.tech}
        </div>
        <h3
          className="mb-3 text-xl font-bold tracking-tight md:text-2xl"
          style={{ color: 'var(--color-text)' }}
        >
          {project.title}
        </h3>
        <p className="text-sm leading-relaxed md:text-base" style={{ color: 'var(--color-text-2)' }}>
          {project.description}
        </p>
        <div
          className="mt-6 flex items-center gap-2 font-mono text-xs uppercase tracking-wider"
          style={{ color: project.accent }}
        >
          <span>View project</span>
          <span className="inline-block transition-transform group-hover:translate-x-1">
            &rarr;
          </span>
        </div>
      </div>
    </a>
  )
}

export function TheWork() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!sectionRef.current || !trackRef.current) return

      const headline = sectionRef.current.querySelector('.work-headline')
      gsap.set(headline, { opacity: 0, y: 40 })

      const cards = trackRef.current.querySelectorAll('.work-card')
      gsap.set(cards, { opacity: 0, y: 40 })

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

          tl.to(headline, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' })
            .to(
              cards,
              {
                opacity: 1,
                y: 0,
                stagger: 0.05,
                duration: 0.3,
                ease: 'power2.out',
              },
              0.2,
            )
            .to(
              trackRef.current,
              {
                x: () => -(trackRef.current!.scrollWidth - window.innerWidth + 100),
                duration: 4,
                ease: 'none',
              },
              0.6,
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
              end: '+=300%',
              pinSpacing: true,
            },
          })

          tl.to(headline, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' })
            .to(cards, { opacity: 1, y: 0, stagger: 0.03, duration: 0.2, ease: 'power2.out' }, 0.15)
            .to(
              trackRef.current,
              {
                x: () => -(trackRef.current!.scrollWidth - window.innerWidth + 40),
                duration: 3,
                ease: 'none',
              },
              0.4,
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
      style={{ background: 'transparent' }}
    >
      <div className="relative z-10 w-full">
        <h2
          className="work-headline mb-12 text-center font-bold leading-tight tracking-tight"
          style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            color: 'var(--color-text)',
          }}
        >
          The Work
        </h2>

        <div className="overflow-hidden px-8 md:px-16">
          <div
            ref={trackRef}
            className="flex gap-5 md:gap-6"
            style={{ width: 'max-content' }}
          >
            {WORK.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
            {WORK.map((project) => (
              <ProjectCard key={`${project.title}-clone`} project={project} />
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {WORK.map((_, i) => (
            <div
              key={i}
              className="h-1 w-1 rounded-full"
              style={{ background: 'var(--color-text-3)' }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
