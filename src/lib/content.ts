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
  { name: 'Motion', category: 'animation', color: '#a8611a' },
  { name: 'Three.js', category: '3d', color: '#d4882a' },
  { name: 'R3F', category: '3d', color: '#d4882a' },
  { name: 'Tailwind CSS', category: 'styling', color: '#06B6D4' },
  { name: 'Tiptap', category: 'core', color: '#456a4b' },
  { name: 'Python', category: 'backend', color: '#3776AB' },
  { name: 'Rust', category: 'systems', color: '#CE422B' },
  { name: 'Tauri', category: 'systems', color: '#24C8DB' },
  { name: 'Zustand', category: 'core', color: '#7C3AED' },
  { name: 'CodeMirror', category: 'core', color: '#d4882a' },
  { name: 'dnd-kit', category: 'core', color: '#7C3AED' },
  { name: 'cmdk', category: 'core', color: '#a8611a' },
]

export interface Project {
  title: string
  description: string
  tech: string
  github: string
  accent: string
}

export const WORK: Project[] = [
  {
    title: 'Apple Product Page',
    description: 'Cinematic scroll experience with R3F 3D, GSAP ScrollTrigger, Lenis smooth scroll, and magnetic interactions.',
    tech: 'React + R3F + GSAP',
    github: 'https://xangrybadger.github.io/apple-product-page/',
    accent: '#a8611a',
  },
  {
    title: 'JSON Forge',
    description: 'JSON power tool — tree viewer, graph visualizer, diff mode, TypeScript gen, and REST client with CodeMirror 6.',
    tech: 'React + CodeMirror 6 + ReactFlow',
    github: 'https://xangrybadger.github.io/json-forge/',
    accent: '#456a4b',
  },
  {
    title: 'Notion Editor',
    description: 'Rich document editor with slash commands, drag handle, AI assistant, bubble menu, and Markdown export via Tiptap 3.',
    tech: 'React + Tiptap 3 + ProseMirror',
    github: 'https://xangrybadger.github.io/notion-editor/',
    accent: '#7C3AED',
  },
  {
    title: 'Linear App UI',
    description: '3-column project management clone with cmdk palette, dnd-kit Kanban, Zustand stores, and 25 seed issues.',
    tech: 'React + dnd-kit + Zustand + cmdk',
    github: 'https://xangrybadger.github.io/linear-app-ui/',
    accent: '#5E6AD2',
  },
  {
    title: 'Diskvisor',
    description: 'Native desktop disk analyzer with D3 sunburst visualization and jwalk parallel filesystem scanning.',
    tech: 'Tauri 2 + Rust + D3.js + jwalk',
    github: 'https://github.com/xAngryBadger/diskvisor',
    accent: '#24C8DB',
  },
  {
    title: 'Sysvisor',
    description: 'Real-time system monitor with 2-second refresh cycles for CPU, memory, disk, and network stats.',
    tech: 'Tauri 2 + Rust + sysinfo + React',
    github: 'https://github.com/xAngryBadger/sysvisor',
    accent: '#CE422B',
  },
  {
    title: 'Forge USB',
    description: 'Bootable USB maker and ISO creator with sysfs device listing and dd write for Linux-native flashing.',
    tech: 'Tauri 2 + Rust + sysfs',
    github: 'https://github.com/xAngryBadger/forge-usb',
    accent: '#3776AB',
  },
]

export interface Stat {
  value: number
  suffix: string
  label: string
}

export const STATS: Stat[] = [
  { value: 7, suffix: '', label: 'Demo Projects Shipped' },
  { value: 15, suffix: '+', label: 'Technologies Mastered' },
  { value: 3, suffix: '', label: 'Desktop Apps (Tauri + Rust)' },
]

export const IMPACT = {
  pcdLine: 'PCD — ASD + ADHD',
  available: 'Available immediately for frontend roles',
}

export const CTA = {
  headline: "Let's Talk",
  link: '/',
}
