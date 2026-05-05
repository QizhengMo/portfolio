import React, { useState, useRef } from 'react'
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
  const [gridMargin, setGridMargin] = useState(48)
  
  const sectionList = [
    { name: 'About', Component: About },
    { name: 'Work', Component: Work },
    { name: 'Contact', Component: Contact }
  ]

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop
    const height = e.currentTarget.clientHeight
    const index = Math.round(scrollTop / height)
    if (index !== activeSection) {
      setActiveSection(index)
    }
  }

  const gridGroupRef = useRef<THREE.Group>(null)

  return (
    <div className="fixed inset-0 w-full h-full bg-[var(--kami-parchment)] overflow-hidden">
      {/* 1. Logo - 左上角 */}
      <div 
        className="absolute top-20 z-[1000] flex flex-col items-start gap-2"
        style={{ left: `${gridMargin}px` }}
      >
        <div className="serif text-xl font-medium tracking-[0.3em] text-[var(--kami-brand)] uppercase">
          Nathan Mo
        </div>
        <div className="h-[1px] w-12 bg-[var(--kami-brand)] opacity-40" />
      </div>

      {/* 2. 3D 背景层 - 已提取至 Experience 组件 */}
      <div className="absolute inset-0 z-0">
        <Experience 
          activeSection={activeSection}
          setGridMargin={setGridMargin}
          gridGroupRef={gridGroupRef}
        />
      </div>

      {/* 3. 内容层 (文字) */}
      <div 
        className="absolute inset-0 z-10 overflow-y-auto scroll-smooth snap-y snap-mandatory"
        onScroll={handleScroll}
      >
        {sectionList.map(({ name, Component }, i) => (
          <div key={name} id={`section-${i}`}>
            <Component />
          </div>
        ))}
      </div>

      {/* 4. 导航菜单 (动态对齐) */}
      <div 
        className="absolute bottom-12 z-[1000] flex flex-col items-end gap-8 text-right"
        style={{ right: `${gridMargin}px` }}
      >
        <nav className="flex flex-col items-end gap-4">
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