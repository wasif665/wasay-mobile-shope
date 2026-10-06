import React from 'react'
import Reveal from './Reveal'
import { motion } from 'framer-motion'
import { STEPS } from '../content'

export default function HowItWorks() {
  return (
    <section id="how" className="relative py-24 sm:py-32">
      <div className="orb right-[-10%] bottom-[0%] h-[40vh] w-[40vw] bg-gold/10" />
      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">How it works</span>
          <h2 className="mt-5 font-display text-3xl font-bold sm:text-5xl">
            Up and running in <span className="text-gradient">under three minutes.</span>
          </h2>
        </Reveal>

        <div className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-6">
          {/* connector line */}
          <div className="absolute left-[16%] right-[16%] top-8 hidden h-px bg-gradient-to-r from-brand-500/0 via-brand-400/50 to-brand-500/0 md:block" />
          {STEPS.map((s, i) => (
            <Reveal key={s.num} delay={i * 0.12}>
              <div className="relative text-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 8 }}
                  className="glass-deep relative z-10 mx-auto grid h-16 w-16 place-items-center rounded-2xl font-display text-xl font-extrabold text-brand-300 shadow-glow-brand"
                >
                  {s.num}
                </motion.div>
                <h3 className="mt-6 font-display text-xl font-bold">{s.title}</h3>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-white/55">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
