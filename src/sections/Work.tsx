import React from 'react'

export const PROJECTS = [
  {
    title: "Aether",
    description: "A decentralized data visualization platform focusing on real-time spatial analytics.",
    tags: ["React", "Three.js", "GraphQL"],
    year: "2024"
  },
  {
    title: "Chronos",
    description: "High-performance booking engine optimized for global scale and low-latency travel transactions.",
    tags: ["Node.js", "Redis", "Next.js"],
    year: "2023"
  },
  {
    title: "Lumina",
    description: "AI-driven design system auditor that identifies visual inconsistencies across large-scale web apps.",
    tags: ["Python", "PyTorch", "React"],
    year: "2023"
  },
  {
    title: "Vertex",
    description: "Collaborative 3D scene editor allowing teams to build immersive web environments in real-time.",
    tags: ["R3F", "WebGL", "Firebase"],
    year: "2022"
  },
  {
    title: "Nexus",
    description: "Enterprise-scale micro-frontend orchestrator designed for modular architecture and rapid deployment.",
    tags: ["TypeScript", "Go", "Webpack"],
    year: "2021"
  }
]

export function ProjectItem({ project }: { project: typeof PROJECTS[0] }) {
  return (
    <div className="h-screen w-full flex flex-col justify-center snap-start group cursor-pointer pl-[64px] pr-[180px]">
      <div className="flex items-start justify-between py-12 border-b border-[var(--kami-brand)] border-opacity-10 group-hover:border-opacity-30 transition-all duration-500 max-w-3xl">
        <div className="flex flex-col gap-4">
          <h2 className="text-5xl serif text-[var(--kami-brand)] opacity-80 group-hover:opacity-100 transition-all tracking-tight">
            {project.title}
          </h2>

          <p className="text-xl text-[var(--kami-brand)] opacity-50 group-hover:opacity-70 leading-relaxed font-light transition-all">
            {project.description}
          </p>

          <div className="flex gap-3 mt-4">
            {project.tags.map(tag => (
              <span 
                key={tag}
                className="text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 border border-[var(--kami-brand)] border-opacity-20 rounded-sm opacity-40 group-hover:opacity-80 transition-all"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-end justify-between self-stretch py-2 min-w-[100px]">
          <span className="serif text-lg opacity-30 italic">{project.year}</span>
          <div className="opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-700">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
               <path d="M5 12h14M12 5l7 7-7 7" />
             </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function WorkPlaceholder() {
  return null // 该组件现在仅作为数据源和子组件提供者
}
