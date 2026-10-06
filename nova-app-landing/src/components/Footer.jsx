import React from 'react'
import { Link } from 'react-router-dom'
import { NAV, APP } from '../content'

export default function Footer() {
  return (
    <footer className="relative border-t border-line py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-5 md:flex-row md:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600">
            <span className="font-display text-lg font-extrabold">W</span>
          </span>
          <div>
            <p className="font-display font-bold">{APP.fullName}</p>
            <p className="text-xs text-white/40">{APP.tagline}</p>
          </div>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-7 gap-y-3">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-sm text-white/50 transition-colors hover:text-white">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <Link to="/admin" className="text-xs text-white/35 transition-colors hover:text-white/70">
            Admin
          </Link>
          <p className="text-xs text-white/35">
            © 2026 {APP.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
