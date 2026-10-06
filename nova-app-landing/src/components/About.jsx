import React from 'react'
import Reveal from './Reveal'
import { motion } from 'framer-motion'
import { APP } from '../content'

export default function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="orb right-[-15%] top-[20%] h-[45vh] w-[45vw] bg-brand-500/15" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
        <Reveal>
          <span className="eyebrow">About the app</span>
          <h2 className="mt-5 font-display text-3xl font-bold leading-tight sm:text-5xl">
            Not another tool.
            <br />
            <span className="text-gradient">A better way to live.</span>
          </h2>
          <p className="mt-6 max-w-lg text-white/60 leading-relaxed">
            {APP.name} blends a neural planning engine with cinematic design to turn chaos
            into clarity. It watches your energy, respects your attention, and quietly
            removes friction from every decision — so your phone finally works for you.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {['On-device AI', 'Zero ads', 'End-to-end private'].map((t) => (
              <span key={t} className="glass rounded-full px-4 py-2 text-sm font-medium text-white/70">
                {t}
              </span>
            ))}
          </div>
        </Reveal>

        {/* layered glass composition */}
        <Reveal delay={0.15}>
          <div className="relative mx-auto h-[380px] max-w-md">
            {[
              { label: 'Focus', value: '78%', c: '#5b6cff', pos: 'left-0 top-6', rot: '-6deg', w: 'w-44' },
              { label: 'Energy', value: 'Peak · 10 AM', c: '#7ef0d4', pos: 'right-0 top-24', rot: '5deg', w: 'w-52' },
              { label: 'Time saved', value: '+2.4h today', c: '#ffd58a', pos: 'left-8 bottom-4', rot: '-3deg', w: 'w-48' },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4 + i, ease: 'easeInOut', delay: i * 0.5 }}
                className={`glass-deep absolute ${card.pos} ${card.w} rounded-3xl p-5 shadow-glow-soft`}
                style={{ rotate: card.rot }}
              >
                <div className="mb-2 h-2 w-2 rounded-full" style={{ background: card.c, boxShadow: `0 0 12px ${card.c}` }} />
                <p className="text-xs uppercase tracking-widest text-white/45">{card.label}</p>
                <p className="mt-1 font-display text-xl font-bold">{card.value}</p>
              </motion.div>
            ))}
            <div className="orb left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 bg-brand-500/30" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
