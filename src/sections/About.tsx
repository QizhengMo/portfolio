import React from 'react'

export default function About() {
  return (
    <section className="h-screen w-full flex items-center justify-center snap-start px-10">
      <div className="max-w-4xl w-full">
        <h1 className="text-7xl serif text-[var(--kami-brand)] opacity-90 lowercase tracking-tighter">
          About
        </h1>
        <p className="mt-6 text-lg text-[var(--kami-gray)] max-w-md leading-[var(--kami-reading)]">
          A minimalist approach to complex problems, driven by editorial design and code.
        </p>
      </div>
    </section>
  )
}
