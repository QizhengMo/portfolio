import React from 'react'

export default function Contact() {
  return (
    <section className="h-screen w-full flex flex-col justify-center snap-start pl-[64px] pr-24">
      <div className="max-w-4xl w-full">
        <h1 className="text-7xl serif text-[var(--kami-brand)] opacity-90 lowercase tracking-tighter">
          Contact
        </h1>
        <p className="mt-6 text-lg text-[var(--kami-gray)] max-w-md leading-[var(--kami-reading)]">
          Let's build something quiet and authoritative together.
        </p>
      </div>
    </section>
  )
}
