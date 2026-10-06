import React, { Suspense, lazy, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { APP } from '../content'

// Lazy-load the heavy 3D scene so it never blocks first paint
const HeroScene = lazy(() => import('../three/HeroScene.jsx'))

function StaticFallback() {
  // graceful poster if WebGL is unavailable — still looks premium
  return (
    <div className="flex h-full items-center justify-center">
      <div className="phone-frame w-[240px] -rotate-6">
        <div className="phone-screen bg-gradient-to-br from-brand-600/40 via-panel to-accent/20 p-4 pt-10">
          <div className="mb-3 h-3 w-24 rounded-full bg-white/80" />
          <div className="mb-1.5 h-2 w-32 rounded-full bg-white/40" />
          <div className="mb-4 h-16 rounded-2xl bg-white/10" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="mb-2 h-9 rounded-xl bg-white/5" />
          ))}
        </div>
        <div className="phone-notch" />
        <div className="phone-glare" />
      </div>
    </div>
  )
}

function webGLAvailable() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export default function Hero() {
  const pointer = useRef({ x: 0, y: 0 })
  const supportsGL = useMemo(webGLAvailable, [])

  const onMove = (e) => {
    const p = e.touches ? e.touches[0] : e
    const r = e.currentTarget.getBoundingClientRect()
    pointer.current.x = ((p.clientX - r.left) / r.width) * 2 - 1
    pointer.current.y = -(((p.clientY - r.top) / r.height) * 2 - 1)
  }

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
      onMouseMove={onMove}
      onTouchMove={onMove}
      onMouseLeave={() => (pointer.current = { x: 0, y: 0 })}
    >
      {/* atmosphere */}
      <div className="orb left-1/2 top-[-10%] h-[60vh] w-[90vw] -translate-x-1/2 bg-brand-500/25" />
      <div className="orb bottom-[-15%] left-[-20%] h-[50vh] w-[60vw] bg-accent/10" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-5 pt-28 sm:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <span className="eyebrow mb-5">✦ Introducing {APP.name} 3.0</span>
          <h1 className="mx-auto max-w-3xl font-display text-[2.6rem] font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            <span className="text-gradient">{APP.tagline}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-white/60 sm:text-lg">
            {APP.description}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#download" className="btn-primary w-full sm:w-auto">
              Download free
              <span aria-hidden>→</span>
            </a>
            <a href="#features" className="btn-ghost w-full sm:w-auto">
              Explore features
            </a>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/50">
            <span className="text-gold">★★★★★</span>
            <span>{APP.rating} · {APP.reviews} reviews · {APP.downloads} downloads</span>
          </div>
        </motion.div>

        {/* 3D canvas */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-6 h-[46vh] w-full min-h-[320px] sm:h-[52vh]"
        >
          {supportsGL ? (
            <Suspense fallback={<StaticFallback />}>
              <HeroScene pointer={pointer} />
            </Suspense>
          ) : (
            <StaticFallback />
          )}
          {/* soft floor fade */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink to-transparent" />
        </motion.div>
      </div>

      {/* scroll hint */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="relative z-10 mx-auto mb-6 flex flex-col items-center gap-1 text-white/35"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">Scroll</span>
        <span className="block h-8 w-px bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  )
}
