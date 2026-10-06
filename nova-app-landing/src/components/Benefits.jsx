import React from 'react'
import Reveal from './Reveal'
import { motion } from 'framer-motion'
import { BENEFITS, TESTIMONIALS } from '../content'

export default function Benefits() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="relative mx-auto max-w-6xl px-5">
        {/* stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.label} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6 }}
                className="glass-deep rounded-3xl p-6 text-center sm:p-8"
              >
                <p className="text-gradient font-display text-3xl font-extrabold sm:text-4xl">{b.value}</p>
                <p className="mt-2 text-xs text-white/50 sm:text-sm">{b.label}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* testimonials marquee */}
        <Reveal delay={0.1}>
          <div className="relative mt-14 overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
            <div className="marquee-track flex w-max gap-5">
              {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                <div key={i} className="glass w-[300px] shrink-0 rounded-3xl p-6 sm:w-[360px]">
                  <p className="text-gold">★★★★★</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/75">“{t.quote}”</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-accent font-display text-xs font-bold">
                      {t.author[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.author}</p>
                      <p className="text-xs text-white/45">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
