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
      className="work-card gpu group block overflow-hidden rounded-2xl border transition-colors"
      style={{
        borderColor: 'var(--color-bg)',
        background: 'var(--color-bg-alt)',
      }}
    >
      <div className="p-6 md:p-8">
        <div
          className="mb-4 inline-block rounded-full px-3 py-1 font-mono text-xs uppercase tracking-wider"
          style={{
            background: 'rgba(168, 97, 26, 0.1)',
            color: 'var(--color-accent)',
            border: '1px solid rgba(168, 97, 26, 0.2)',
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
          style={{ color: 'var(--color-accent)' }}
        >
          <span>View on GitHub</span>
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

  useGSAP(
    () => {
      if (!sectionRef.current) return

      const cards = sectionRef.current.querySelectorAll('.work-card')
      const headline = sectionRef.current.querySelector('.work-headline')

      gsap.set(cards, { opacity: 0, y: 60, scale: 0.9 })
      gsap.set(headline, { opacity: 0, y: 40 })

      ScrollTrigger.matchMedia({
        '(min-width: 768px)': () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              pin: true,
              scrub: 1,
              start: 'top top',
              end: '+=400%',
              pinSpacing: true,
            },
          })

          tl.to(headline, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }).to(
            cards,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              stagger: { each: 0.12, from: 'start' },
              duration: 0.8,
              ease: 'power3.out',
            },
            0.3,
          )
        },
        '(max-width: 767px)': () => {
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

          tl.to(headline, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }).to(
            cards,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              stagger: { each: 0.08, from: 'start' },
              duration: 0.5,
              ease: 'power3.out',
            },
            0.2,
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
      style={{ background: 'var(--color-bg-alt)' }}
    >
      <div className="mx-auto w-full max-w-5xl px-6">
        <h2
          className="work-headline mb-12 text-center font-bold leading-tight tracking-tight"
          style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            color: 'var(--color-text)',
          }}
        >
          The Work
        </h2>

        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          {WORK.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24"
        style={{ background: 'linear-gradient(to top, var(--color-bg-alt), transparent)' }}
      />
    </section>
  )
}
