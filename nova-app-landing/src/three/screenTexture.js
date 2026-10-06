// Procedural app-screen texture.
// REPLACE THIS: load your real screenshot with `new THREE.TextureLoader().load(url)` instead.
import * as THREE from 'three'

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export function createScreenTexture(variant = 0) {
  const W = 512, H = 1080
  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')

  // ---- wallpaper gradient ----
  const bg = ctx.createLinearGradient(0, 0, W, H)
  if (variant === 1) {
    bg.addColorStop(0, '#0a1030'); bg.addColorStop(0.5, '#141b4a'); bg.addColorStop(1, '#062a2a')
  } else {
    bg.addColorStop(0, '#0b0e22'); bg.addColorStop(0.55, '#141a3d'); bg.addColorStop(1, '#071022')
  }
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // soft blobs
  const blob = (x, y, r, c) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, c); g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2)
  }
  blob(420, 180, 260, 'rgba(91,108,255,0.35)')
  blob(90, 760, 300, variant === 1 ? 'rgba(126,240,212,0.22)' : 'rgba(255,138,176,0.18)')

  // ---- status bar ----
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = '600 22px Inter, sans-serif'
  ctx.fillText('9:41', 36, 46)
  ctx.textAlign = 'right'
  ctx.fillText('●●●', W - 36, 46)
  ctx.textAlign = 'left'

  // ---- header ----
  ctx.fillStyle = 'rgba(255,255,255,0.95)'
  ctx.font = '700 40px Sora, sans-serif'
  ctx.fillText(variant === 1 ? 'Focus' : 'Good morning', 36, 130)
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.font = '400 21px Inter, sans-serif'
  ctx.fillText(variant === 1 ? 'Deep work session · 52 min' : 'Tuesday, October 6 · 3 tasks today', 36, 168)

  // ---- hero card ----
  rr(ctx, 32, 210, W - 64, 260, 32)
  const card = ctx.createLinearGradient(32, 210, W - 32, 470)
  card.addColorStop(0, 'rgba(91,108,255,0.55)')
  card.addColorStop(1, 'rgba(126,240,212,0.25)')
  ctx.fillStyle = card
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.95)'
  ctx.font = '700 30px Sora, sans-serif'
  ctx.fillText(variant === 1 ? 'Flow State: 78%' : "Today's Focus", 64, 280)
  ctx.font = '400 22px Inter, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  ctx.fillText(variant === 1 ? 'Ambient sound · Rain over Kyoto' : 'Peak energy window: 10:00 – 12:30', 64, 322)
  // progress bar
  rr(ctx, 64, 370, W - 128, 16, 8)
  ctx.fillStyle = 'rgba(255,255,255,0.22)'
  ctx.fill()
  rr(ctx, 64, 370, (W - 128) * 0.68, 16, 8)
  ctx.fillStyle = '#7ef0d4'
  ctx.fill()

  // ---- task rows ----
  const rows = variant === 1
    ? [['◉', 'Design review', 'done'], ['◉', 'Prototype pass', 'done'], ['○', 'Ship build 2.4', 'now'], ['○', 'Write changelog', 'next']]
    : [['○', 'Review NOVA pitch deck', '9:30'], ['○', 'Gym — upper body', '12:00'], ['○', 'Dinner with Sam', '19:30']]
  rows.forEach((r, i) => {
    const y = 510 + i * 108
    rr(ctx, 32, y, W - 64, 88, 24)
    ctx.fillStyle = 'rgba(255,255,255,0.07)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.10)'
    ctx.stroke()
    ctx.font = '400 30px Inter, sans-serif'
    ctx.fillStyle = r[2] === 'done' ? '#7ef0d4' : 'rgba(255,255,255,0.85)'
    ctx.fillText(r[0], 60, y + 56)
    ctx.font = '500 24px Inter, sans-serif'
    ctx.fillText(r[1], 116, y + 56)
    ctx.textAlign = 'right'
    ctx.fillStyle = 'rgba(255,255,255,0.45)'
    ctx.font = '400 20px Inter, sans-serif'
    ctx.fillText(typeof r[2] === 'string' && r[2].includes(':') ? r[2] : '', W - 60, y + 56)
    ctx.textAlign = 'left'
  })

  // ---- bottom nav ----
  rr(ctx, 100, H - 118, W - 200, 74, 37)
  ctx.fillStyle = 'rgba(10,12,24,0.72)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.14)'
  ctx.stroke()
  const icons = ['⌂', '◔', '✦', '◌']
  icons.forEach((ic, i) => {
    ctx.font = i === 0 ? '700 32px Inter, sans-serif' : '400 30px Inter, sans-serif'
    ctx.fillStyle = i === 0 ? '#9db4ff' : 'rgba(255,255,255,0.45)'
    ctx.fillText(ic, 150 + i * 76, H - 70)
  })

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

export function createGlowTexture(inner = 'rgba(91,108,255,0.55)') {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
  g.addColorStop(0, inner)
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  return new THREE.CanvasTexture(c)
}
