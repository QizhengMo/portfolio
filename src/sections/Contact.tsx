import React, { useState } from 'react'

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const email = "moqizhengz@gmail.com"

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="h-screen w-full flex flex-col justify-center snap-start pl-[64px] pr-24 relative overflow-hidden">
      <div className="max-w-4xl w-full flex flex-col gap-10">
        {/* 标题 - 恢复到全站统一的 7xl 尺寸 */}
        <h1 className="text-7xl serif text-[var(--kami-brand)] opacity-90 lowercase tracking-tighter">
          Get in touch.
        </h1>

        {/* 极简联系区域 */}
        <div className="flex flex-col gap-8">
          {/* 邮箱项目 */}
          <div className="flex flex-col items-start gap-1 group">
            <div className="relative cursor-pointer w-fit" onClick={handleCopyEmail}>
              <span className="text-2xl serif text-[var(--kami-brand)] opacity-60 group-hover:opacity-100 transition-all">
                {email}
              </span>
              <div className="absolute -bottom-1 left-0 h-[1px] w-0 bg-[var(--kami-brand)] group-hover:w-full transition-all duration-700 opacity-30" />
              {/* 复制成功提示 */}
              <div className={`absolute -right-20 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-widest text-[var(--kami-brand)] transition-all duration-500 ${copied ? 'opacity-40 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                Copied
              </div>
            </div>
          </div>

          {/* 社交链接 - 水平一排 */}
          <div className="flex gap-10 items-baseline">
            <a
              href="https://github.com/QizhengMo"
              target="_blank"
              rel="noreferrer"
              className="text-lg serif text-[var(--kami-brand)] opacity-50 hover:opacity-100 transition-all flex items-center gap-2 group"
            >
              <span>GitHub</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-0 group-hover:opacity-100 transition-all">
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* 底部版权信息 */}
      <div className="absolute bottom-12 left-[64px] flex gap-6 items-center opacity-10 text-[9px] uppercase tracking-[0.3em] text-[var(--kami-brand)]">
        <span>© 2026 Nathan Mo</span>
      </div>
    </section>
  )
}
