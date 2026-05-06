import React, { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'

// 引入章节组件
import Work from './sections/Work'
import About from './sections/About'
import Contact from './sections/Contact'

// 引入拆分后的 3D 组件
import { Experience } from './components/Experience'

// --- 主应用 ---

export default function App() {
  const [activeSection, setActiveSection] = useState(0)
  const FIXED_MARGIN = 64 

  const sectionList = [
    { name: 'About', Component: About },
    { name: 'Work', Component: Work },
    { name: 'Contact', Component: Contact }
  ]

  const gridGroupRef = useRef<THREE.Group>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observerOptions = {
      root: scrollContainerRef.current,
      threshold: 0.4,
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

  return (
    <div className="fixed inset-0 w-full h-full bg-[var(--kami-parchment)] overflow-hidden">
      {/* 1. 顶层 Logo - 仅在首屏显示 */}
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

      {/* 2. 3D 背景层 */}
      <div className="absolute inset-0 z-0">
        <Experience 
          activeSection={activeSection}
          gridGroupRef={gridGroupRef}
        />
      </div>

      {/* 3. 内容层 (文字) */}
      <div 
        ref={scrollContainerRef}
        className="absolute inset-0 z-10 overflow-y-auto scroll-smooth snap-y snap-mandatory"
      >
        {sectionList.map(({ name, Component }, i) => (
          <div 
            key={name} 
            id={`section-${i}`} 
            data-index={i}
            className="section-wrapper snap-start"
          >
            <Component />
          </div>
        ))}
      </div>

      {/* 4. 底部导航 + 动态 Logo */}
      <div 
        className="absolute bottom-12 z-[1000] flex flex-col items-end gap-8 text-right pointer-events-none"
        style={{ right: `${FIXED_MARGIN}px` }}
      >
        {/* 动态 Logo - 滚动后在此处显示 */}
        <div className={`transition-all duration-700 ease-in-out ${
          activeSection > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="serif text-sm font-medium tracking-[0.3em] text-[var(--kami-brand)] uppercase">
            Nathan Mo
          </div>
          <div className="h-[1px] w-8 bg-[var(--kami-brand)] opacity-40 ml-auto mt-2" />
        </div>

        <nav className="flex flex-col items-end gap-4 pointer-events-auto">
          {sectionList.map((section, i) => (
            <button
              key={section.name}
              onClick={() => {
                document.getElementById(`section-${i}`)?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="group flex items-center gap-4 cursor-pointer"
            >
              <span className={`text-xs font-medium tracking-[0.2em] uppercase transition-all duration-500 ${activeSection === i ? 'text-[var(--kami-brand)]' : 'text-[var(--kami-brand)] opacity-30 group-hover:opacity-60'
                }`}>
                {section.name}
              </span>
              <div className={`h-[1px] bg-[var(--kami-brand)] transition-all duration-500 ${activeSection === i ? 'w-12' : 'w-4 opacity-30 group-hover:w-8'
                }`} />
            </button>
          ))}
        </nav>

        <div className="serif text-3xl text-[var(--kami-brand)] opacity-20 italic">
          0{activeSection + 1}
        </div>
      </div>
    </div>
  )
}