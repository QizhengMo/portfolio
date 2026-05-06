import React from 'react'

export const PROJECTS = [
  {
    title: "Arex",
    description: "A next-generation regression testing platform powered by Java Agent instrumentation, enabling non-intrusive traffic recording and high-fidelity replay for complex microservices.",
    tags: ["Java Agent", "Instrumentation", "Traffic Replay", "Bytecode"],
    year: "2024",
    link: "https://github.com/arextest"
  },
  {
    title: "Trip.com Engineering Assistant",
    description: "A full-stack Chrome extension for Trip.com engineers that enables real-time context-aware navigation and in-place data decoding. It integrates fragmented internal systems using high-performance content sniffing and WebAssembly-powered utilities.",
    tags: ["Chrome Extension", "WebAssembly", "TypeScript", "Content Sniffing"],
    year: "2023"
  }
]

export function ProjectItem({ project }: { project: typeof PROJECTS[0] }) {
  return (
    <div className="h-screen w-full flex flex-col justify-center snap-start group pl-[64px] pr-[180px]">
      <div className="flex items-start justify-between py-12 border-b border-[var(--kami-brand)] border-opacity-10 group-hover:border-opacity-30 transition-all duration-500 max-w-3xl">
        <div className="flex flex-col gap-4 text-left">
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

          {/* 仅在 link 存在时显示并触发跳转 */}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-700 text-[var(--kami-brand)] hover:scale-125 transition-transform"
              title="View Project"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function WorkPlaceholder() {
  return null
}
