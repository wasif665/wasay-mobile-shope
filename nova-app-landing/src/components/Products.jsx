import React, { useEffect, useState } from 'react'
import Reveal from './Reveal'
import { motion } from 'framer-motion'
import { listProducts, getSettings, whatsappOrderLink } from '../api/client'

function ProductCard({ p, whatsapp, index }) {
  const link = whatsappOrderLink(whatsapp, p)
  const ready = whatsapp && whatsapp.replace(/[^0-9]/g, '').length >= 10
  return (
    <Reveal delay={(index % 3) * 0.08}>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="glass-deep group relative flex h-full flex-col overflow-hidden rounded-3xl"
      >
        {/* image */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-brand-600/20 via-panel to-accent/10">
          {p.image_url ? (
            <img
              src={p.image_url}
              alt={p.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="font-display text-6xl font-extrabold text-white/10">
                {(p.brand || p.name || 'W')[0].toUpperCase()}
              </span>
            </div>
          )}
          {p.featured && (
            <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-glow-brand">
              Featured
            </span>
          )}
          {p.storage && (
            <span className="glass absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-semibold text-white/80">
              {p.storage}
            </span>
          )}
        </div>

        {/* body */}
        <div className="flex flex-1 flex-col p-5">
          {p.brand && <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-300">{p.brand}</p>}
          <h3 className="mt-1 font-display text-lg font-bold leading-snug">{p.name}</h3>
          {p.description && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/50">{p.description}</p>
          )}
          <div className="mt-auto flex items-end justify-between gap-3 pt-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/40">Price</p>
              <p className="font-display text-xl font-extrabold text-gradient">
                Rs {Number(p.price || 0).toLocaleString('en-PK')}
              </p>
            </div>
          </div>
          <a
            href={ready ? link : '#phones'}
            target={ready ? '_blank' : undefined}
            rel="noreferrer"
            onClick={!ready ? (e) => { e.preventDefault(); alert('WhatsApp ordering coming soon — please check back in a moment.') } : undefined}
            className="btn-primary mt-4 w-full justify-center !px-4 !py-3 text-sm"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.5 14.1c-.2.7-1.3 1.3-1.9 1.3-.5.1-1.1.1-1.8-.1a16 16 0 0 1-1.6-.6c-2.8-1.2-4.6-4-4.8-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6c-.2.2-.3.4-.1.7.1.3.7 1.2 1.6 2 1.1 1 2 1.3 2.3 1.4.3.1.5.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l2 .9c.2.1.4.2.4.3 0 .1 0 .6-.2 1.1z"/>
            </svg>
            Order on WhatsApp
          </a>
        </div>
      </motion.div>
    </Reveal>
  )
}

export default function Products() {
  const [products, setProducts] = useState(null)
  const [whatsapp, setWhatsapp] = useState('')

  useEffect(() => {
    let alive = true
    Promise.all([listProducts(), getSettings()])
      .then(([p, s]) => { if (alive) { setProducts(p); setWhatsapp(s.whatsapp || '') } })
      .catch(() => alive && setProducts([]))
    return () => { alive = false }
  }, [])

  return (
    <section id="phones" className="relative py-24 sm:py-32">
      <div className="orb left-1/2 top-[20%] h-[50vh] w-[70vw] -translate-x-1/2 bg-brand-500/12" />
      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Our phones</span>
          <h2 className="mt-5 font-display text-3xl font-bold sm:text-5xl">
            Fresh stock, <span className="text-gradient">best prices.</span>
          </h2>
          <p className="mt-4 text-white/55">
            Genuine, sealed devices with official warranty. Tap any phone to order instantly on WhatsApp.
          </p>
        </Reveal>

        {products === null ? (
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="glass-deep h-96 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <Reveal className="mt-14 text-center">
            <div className="glass-deep mx-auto max-w-md rounded-3xl p-10">
              <p className="text-4xl">📱</p>
              <p className="mt-4 font-display text-lg font-bold">New stock landing soon</p>
              <p className="mt-2 text-sm text-white/50">
                Phones will appear here as soon as they're listed. Check back shortly!
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <ProductCard key={p.id} p={p} whatsapp={whatsapp} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
