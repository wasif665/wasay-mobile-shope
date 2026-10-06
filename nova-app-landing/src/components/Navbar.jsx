import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV, APP } from '../content'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass-deep shadow-glow-soft' : 'bg-transparent'
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-[72px]">
          <a href="#top" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-glow-brand">
              <span className="font-display text-lg font-extrabold">W</span>
            </span>
            <span className="font-display text-lg font-bold tracking-wide">{APP.name}</span>
          </a>

          <div className="hidden items-center gap-7 md:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-white/60 transition-colors hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <a href="#download" className="btn-primary !px-5 !py-2.5 text-sm">
              Get the app
            </a>
          </div>

          {/* mobile hamburger */}
          <button
            className="glass grid h-10 w-10 place-items-center rounded-xl md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-5 bg-white transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`block h-0.5 w-5 bg-white transition-opacity ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-5 bg-white transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
            </div>
          </button>
        </nav>
      </motion.header>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="glass-deep fixed inset-x-4 top-20 z-40 rounded-3xl p-4 md:hidden"
          >
            <div className="flex flex-col">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3.5 font-display font-semibold text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
              <a href="#download" onClick={() => setOpen(false)} className="btn-primary mt-3 justify-center">
                Get the app
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
