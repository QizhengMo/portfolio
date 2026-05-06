import React, { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'

// 引入章节组件
import { ProjectItem, PROJECTS } from './sections/Work'
import About from './sections/About'
import Contact from './sections/Contact'

// 引入拆分后的 3D 组件
import { Experience } from './components/Experience'

// --- 主应用 ---

export default function App() {
  const [activeSection, setActiveSection] = useState(0)
  const FIXED_MARGIN = 64 

  // 1. 构建展平后的页面列表
  // Index 0: About
  // Index 1-5: Work Projects
  // Index 6: Contact
  const flatSections = [
    { type: 'about', Component: About },
    ...PROJECTS.map(p => ({ type: 'work', project: p })),
    { type: 'contact', Component: Contact }
  ]

  const gridGroupRef = useRef<THREE.Group>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observerOptions = {
      root: scrollContainerRef.current,
      threshold: 0.5,
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index') || '0')
          setActiveSection(index)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)
    const sections = scrollContainerRef.current?.querySelectorAll('.section-wrapper')
    sections?.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  // 判断当前是否处于 Work 序列中
  const isWorkSection = activeSection >= 1 && activeSection <= PROJECTS.length
  // 确定当前显示的 Work 索引，并进行边界钳制，防止在动画过渡时出现 0 或 6
  const displayWorkIdx = Math.max(0, Math.min(PROJECTS.length - 1, activeSection - 1))

  return (
    <div className="fixed inset-0 w-full h-full bg-[var(--kami-parchment)] overflow-hidden">
      
      {/* A. 顶层 Logo - 仅在 About 显示 */}
      <div 
        className={`absolute top-20 z-[1000] flex flex-col items-start gap-2 transition-all duration-700 ease-in-out pointer-events-none ${
          activeSection === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
        }`}
        style={{ left: `${FIXED_MARGIN}px` }}
      >
        <div className="serif text-xl font-medium tracking-[0.3em] text-[var(--kami-brand)] uppercase pointer-events-auto">
          Nathan Mo
        </div>
        <div className="h-[1px] w-12 bg-[var(--kami-brand)] opacity-40" />
      </div>

      {/* B. 固定 Work 标题 - 仅在 Work 序列显示 */}
      <div 
        className={`absolute top-20 z-[1000] flex items-baseline gap-12 transition-all duration-700 ease-in-out pointer-events-none ${
          isWorkSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{ left: `${FIXED_MARGIN}px` }}
      >
        <h1 className="text-7xl serif text-[var(--kami-brand)] opacity-90 lowercase tracking-tighter">
          Selected Works
        </h1>
        <div className="serif text-xl text-[var(--kami-brand)] opacity-30 italic tracking-[0.2em]">
          {displayWorkIdx + 1} <span className="mx-3 opacity-40">/</span> {PROJECTS.length}
        </div>
      </div>

      {/* 2. 3D 背景层 */}
      <div className="absolute inset-0 z-0">
        <Experience 
          activeSection={activeSection}
          gridGroupRef={gridGroupRef}
        />
      </div>

      {/* 3. 内容层 (主滚动条) */}
      <div 
        ref={scrollContainerRef}
        className="absolute inset-0 z-10 overflow-y-auto scroll-smooth snap-y snap-mandatory no-scrollbar"
      >
        {flatSections.map((item, i) => (
          <div 
            key={i} 
            id={`section-${i}`} 
            data-index={i}
            className="section-wrapper snap-start"
          >
            {item.type === 'about' && <About />}
            {item.type === 'work' && <ProjectItem project={(item as any).project} />}
            {item.type === 'contact' && <Contact />}
          </div>
        ))}
      </div>

      {/* 4. 底部导航 + 动态 Logo */}
      <div 
        className="absolute bottom-12 z-[1000] flex flex-col items-end gap-8 text-right pointer-events-none"
        style={{ right: `${FIXED_MARGIN}px` }}
      >
        <div className={`transition-all duration-700 ease-in-out ${
          activeSection > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="serif text-sm font-medium tracking-[0.3em] text-[var(--kami-brand)] uppercase">
            Nathan Mo
          </div>
          <div className="h-[1px] w-8 bg-[var(--kami-brand)] opacity-40 ml-auto mt-2" />
        </div>

        <nav className="flex flex-col items-end gap-4 pointer-events-auto">
          {/* About */}
          <button
            onClick={() => document.getElementById('section-0')?.scrollIntoView({ behavior: 'smooth' })}
            className="group flex items-center gap-4 cursor-pointer"
          >
            <span className={`text-xs font-medium tracking-[0.2em] uppercase transition-all duration-500 ${activeSection === 0 ? 'text-[var(--kami-brand)]' : 'text-[var(--kami-brand)] opacity-30 group-hover:opacity-60'}`}>
              About
            </span>
            <div className={`h-[1px] bg-[var(--kami-brand)] transition-all duration-500 ${activeSection === 0 ? 'w-12' : 'w-4 opacity-30'}`} />
          </button>
          
          {/* Work (对应到 Work 序列的第一个项目) */}
          <button
            onClick={() => document.getElementById('section-1')?.scrollIntoView({ behavior: 'smooth' })}
            className="group flex items-center gap-4 cursor-pointer"
          >
            <span className={`text-xs font-medium tracking-[0.2em] uppercase transition-all duration-500 ${isWorkSection ? 'text-[var(--kami-brand)]' : 'text-[var(--kami-brand)] opacity-30 group-hover:opacity-60'}`}>
              Work
            </span>
            <div className={`h-[1px] bg-[var(--kami-brand)] transition-all duration-500 ${isWorkSection ? 'w-12' : 'w-4 opacity-30'}`} />
          </button>

          {/* Contact (对应到最后一个索引) */}
          <button
            onClick={() => document.getElementById(`section-${flatSections.length - 1}`)?.scrollIntoView({ behavior: 'smooth' })}
            className="group flex items-center gap-4 cursor-pointer"
          >
            <span className={`text-xs font-medium tracking-[0.2em] uppercase transition-all duration-500 ${activeSection === flatSections.length - 1 ? 'text-[var(--kami-brand)]' : 'text-[var(--kami-brand)] opacity-30 group-hover:opacity-60'}`}>
              Contact
            </span>
            <div className={`h-[1px] bg-[var(--kami-brand)] transition-all duration-500 ${activeSection === flatSections.length - 1 ? 'w-12' : 'w-4 opacity-30'}`} />
          </button>
        </nav>

        <div className="serif text-3xl text-[var(--kami-brand)] opacity-20 italic">
          0{activeSection + 1}
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}