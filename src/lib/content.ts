export const HERO = {
  name: 'Isaac Nathan',
  title: 'Frontend Engineer',
  titlePT: 'Engenheiro Frontend',
  subtitle: 'Building with intention. Every pixel, every interaction, every line of code.',
}

export const APPROACH = {
  headline: 'The Hard Way',
  body: "I don't do tutorial projects. I build real systems — the kind that break at 3AM and teach you what the docs won't. Manual annotation, honest metrics, authentic struggle. That's where the engineering happens.",
}

export interface Skill {
  name: string
  category: string
  color: string
}

export const STACK: Skill[] = [
  { name: 'TypeScript', category: 'core', color: '#3178C6' },
  { name: 'React', category: 'core', color: '#61DAFB' },
  { name: 'GSAP', category: 'animation', color: '#88CE02' },
  { name: 'Motion', category: 'animation', color: '#000000' },
  { name: 'Three.js', category: '3d', color: '#000000' },
  { name: 'R3F', category: '3d', color: '#000000' },
  { name: 'Tailwind CSS', category: 'styling', color: '#06B6D4' },
  { name: 'Python', category: 'backend', color: '#3776AB' },
  { name: 'Rust', category: 'systems', color: '#CE422B' },
]

export interface Project {
  title: string
  description: string
  tech: string
  github: string
}

export const WORK: Project[] = [
  {
    title: 'HarpIA',
    description: 'AI-powered code review assistant.',
    tech: 'Python + GPT + AST analysis',
    github: 'https://github.com/xAngryBadger/harpIA',
  },
  {
    title: 'Flora Sensus',
    description: 'IoT environmental monitoring.',
    tech: 'React + Python + MQTT',
    github: 'https://github.com/xAngryBadger/flora-sensus',
  },
  {
    title: 'SRF System',
    description: 'Strategic resource framework.',
    tech: 'React + TypeScript + Zustand',
    github: 'https://github.com/xAngryBadger/srf-system',
  },
  {
    title: 'Fennec Excel',
    description: 'Excel automation toolkit.',
    tech: 'Python + openpyxl',
    github: 'https://github.com/xAngryBadger/fennec-excel',
  },
]

export interface Stat {
  value: number
  suffix: string
  label: string
}

export const STATS: Stat[] = [
  { value: 5, suffix: '+', label: 'Projects Shipped' },
  { value: 10, suffix: '+', label: 'Months Professional Experience' },
  { value: 3, suffix: '', label: 'Certification Paths' },
]

export const IMPACT = {
  pcdLine: 'PCD — ASD + ADHD',
  available: 'Available immediately for frontend roles',
}

export const CTA = {
  headline: "Let's Talk",
  link: '/',
}
