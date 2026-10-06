import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Reveal from './Reveal'
import { FEATURES } from '../content'

function TiltCard({ feature, index }) {
  const ref = useRef(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rX = useSpring(useTransform(my, [0, 1], [9, -9]), { stiffness: 220, damping: 20 })
  const rY = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 220, damping: 20 })

  const onMove = (e) => {
    const p = e.touches ? e.touches[0] : e
    const r = ref.current.getBoundingClientRect()
    mx.set((p.clientX - r.left) / r.width)
    my.set((p.clientY - r.top) / r.height)
    ref.current.style.setProperty('--gx', `${mx.get() * 100}%`)
    ref.current.style.setProperty('--gy', `${my.get() * 100}%`)
  }
  const reset = () => { mx.set(0.5); my.set(0.5) }

  return (
    <Reveal delay={(index % 3) * 0.08}>
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onTouchMove={onMove}
        onMouseLeave={reset}
        onTouchEnd={reset}
        style={{ rotateX: rX, rotateY: rY, transformPerspective: 900 }}
        whileTap={{ scale: 0.97 }}
        className="tilt-card glass-deep group relative overflow-hidden rounded-3xl p-6 transition-shadow duration-500 hover:shadow-glow-brand"
      >
        <div className="tilt-glare pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="tilt-inner">
          <div
            className="mb-5 grid h-12 w-12 place-items-center rounded-2xl text-xl"
            style={{ background: `${feature.color}22`, color: feature.color, boxShadow: `0 0 24px ${feature.color}33` }}
          >
            {feature.icon}
          </div>
          <h3 className="font-display text-lg font-bold">{feature.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/55">{feature.text}</p>
        </div>
      </motion.div>
    </Reveal>
  )
}

export default function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="orb left-[-15%] top-[10%] h-[40vh] w-[40vw] bg-accent/10" />
      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Main features</span>
          <h2 className="mt-5 font-display text-3xl font-bold sm:text-5xl">
            Everything you need. <span className="text-gradient">Nothing you don't.</span>
          </h2>
          <p className="mt-4 text-white/55">
            Six pillars, one seamless experience — engineered to disappear into your day.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <TiltCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
