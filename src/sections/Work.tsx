import React from 'react'

const PROJECTS = [
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

export default function Work() {
  return (
    <section className="min-h-screen w-full flex flex-col justify-center snap-start px-[64px] py-24">
      <div className="max-w-5xl w-full">
        {/* 标题 */}
        <h1 className="text-7xl serif text-[var(--kami-brand)] opacity-90 lowercase tracking-tighter mb-16">
          Selected Works
        </h1>

        {/* 项目列表 */}
        <div className="flex flex-col">
          {PROJECTS.map((project, i) => (
            <div 
              key={project.title}
              className="group relative flex items-start justify-between py-12 border-b border-[var(--kami-brand)] border-opacity-10 hover:border-opacity-30 transition-all duration-500 cursor-pointer"
            >
              <div className="flex flex-col gap-4 max-w-2xl">
                {/* 序号与标题 */}
                <div className="flex items-baseline gap-6">
                  <span className="serif text-sm opacity-30 italic">0{i + 1}</span>
                  <h2 className="text-4xl serif text-[var(--kami-brand)] opacity-80 group-hover:opacity-100 transition-all">
                    {project.title}
                  </h2>
                </div>

                {/* 描述 */}
                <p className="text-lg text-[var(--kami-brand)] opacity-50 group-hover:opacity-70 leading-relaxed font-light transition-all">
                  {project.description}
                </p>

                {/* 标签 */}
                <div className="flex gap-3 mt-2">
                  {project.tags.map(tag => (
                    <span 
                      key={tag}
                      className="text-[10px] tracking-[0.15em] uppercase px-2 py-1 border border-[var(--kami-brand)] border-opacity-20 rounded-sm opacity-50 group-hover:opacity-80 transition-all"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 年份/箭头 */}
              <div className="flex flex-col items-end justify-between self-stretch">
                <span className="serif text-sm opacity-30 italic">{project.year}</span>
                <div className="opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                     <path d="M5 12h14M12 5l7 7-7 7" />
                   </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
