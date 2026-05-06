import React from 'react'

export default function About() {
  return (
    <section className="h-screen w-full flex flex-col justify-center snap-start pl-[64px] pr-24">
      <div className="max-w-4xl w-full">
        <h1 className="text-7xl serif text-[var(--kami-brand)] opacity-90 lowercase tracking-tighter mb-8">
          About
        </h1>
        <p className="text-sm tracking-widest uppercase opacity-40 my-4">
          Web FullStack
        </p>


        <div className="flex flex-col gap-6 text-xl text-[var(--kami-brand)] opacity-70 leading-relaxed font-light max-w-2xl">
          <p>
            An alumnus of the <span className="font-medium opacity-100">University of Queensland</span>,
            I have spent the past four years at <span className="font-medium opacity-100">Trip.com</span> as a
            Full-Stack Web Engineer.
          </p>
          <p>
            My journey has been defined by a deep-seated commitment to technical excellence
            across the entire development lifecycle—from crafting intuitive interfaces
            and robust back-end architectures to orchestrating seamless deployment pipelines
            and system operations.
          </p>

        </div>
      </div>
    </section>
  )
}
