import React from 'react'
import Reveal from './Reveal'
import { motion } from 'framer-motion'
import { APP } from '../content'

export default function Download() {
  return (
    <section id="download" className="relative py-24 sm:py-32">
      <div className="relative mx-auto max-w-5xl px-5">
        <Reveal>
          <div className="glass-deep relative overflow-hidden rounded-[2.5rem] px-6 py-16 text-center sm:px-16 sm:py-20">
            <div className="orb left-1/2 top-[-40%] h-[60vh] w-[80vw] -translate-x-1/2 bg-brand-500/25" />
            <motion.div
              animate={{ y: [0, -12, 0], rotate: [0, 2, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              className="relative mx-auto mb-8 grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-glow-brand"
            >
              <span className="font-display text-4xl font-extrabold">W</span>
            </motion.div>
            <h2 className="relative mx-auto max-w-xl font-display text-3xl font-extrabold leading-tight sm:text-5xl">
              Ready to meet <span className="text-gradient">{APP.name}?</span>
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-white/55">
              Free to download. Yours in seconds. Your future self says thanks.
            </p>
            <div className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                href={APP.iosUrl}
                className="btn-primary w-full sm:w-auto"
              >
                ⬇&nbsp; Download on the App Store
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                href={APP.androidUrl}
                className="btn-ghost w-full sm:w-auto"
              >
                ▶&nbsp; Get it on Google Play
              </motion.a>
            </div>
            <p className="relative mt-6 text-xs text-white/35">
              iOS 16+ · Android 11+ · No account required · Free forever plan
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
