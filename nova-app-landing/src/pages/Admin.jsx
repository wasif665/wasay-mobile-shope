import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  login, getAdminKey, setAdminKey, listProducts, createProduct,
  updateProduct, deleteProduct, getSettings, saveSettings, uploadImage, detectMode,
} from '../api/client'

const emptyForm = { name: '', brand: '', price: '', storage: '', description: '', image_url: '', featured: false }

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/50">{label}</span>
      {children}
    </label>
  )
}

const inputCls = 'glass w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-brand-500/60'

export default function Admin() {
  const [authed, setAuthed] = useState(!!getAdminKey())
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [tab, setTab] = useState('products')

  const [products, setProducts] = useState(null)
  const [settings, setSettings] = useState({ whatsapp: '' })
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [notice, setNotice] = useState('')
  const [localMode, setLocalMode] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => {
    detectMode().then(setLocalMode)
    if (getAdminKey()) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function load() {
    const [p, s] = await Promise.all([listProducts(), getSettings()])
    setProducts(p)
    setSettings(s)
  }

  function notify(msg) {
    setNotice(msg)
    setTimeout(() => setNotice(''), 2500)
  }

  /* ---------------- auth ---------------- */
  async function handleLogin(e) {
    e.preventDefault()
    try {
      await login(password)
      setAdminKey(password)
      setAuthed(true)
      setPassword('')
      load()
    } catch (err) {
      setError('Wrong password. Try again.')
    }
  }

  function logout() {
    setAdminKey('')
    setAuthed(false)
    setProducts(null)
  }

  /* ---------------- product form ---------------- */
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  async function handleImage(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file)
      set('image_url', url)
      notify('Image uploaded ✓')
    } catch {
      notify('Upload failed — try a smaller image')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return notify('Product name is required')
    setSaving(true)
    try {
      if (editingId) {
        await updateProduct(editingId, form)
        notify('Product updated ✓')
      } else {
        await createProduct(form)
        notify('Product added ✓')
      }
      setForm(emptyForm)
      setEditingId(null)
      load()
    } catch {
      notify('Save failed — check your connection')
    } finally {
      setSaving(false)
    }
  }

  function startEdit(p) {
    setEditingId(p.id)
    setForm({
      name: p.name || '', brand: p.brand || '', price: p.price ?? '',
      storage: p.storage || '', description: p.description || '',
      image_url: p.image_url || '', featured: !!p.featured,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDelete(p) {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return
    await deleteProduct(p.id)
    notify('Product deleted')
    load()
  }

  async function handleSaveSettings(e) {
    e.preventDefault()
    await saveSettings({ whatsapp: settings.whatsapp })
    notify('Settings saved ✓')
  }

  /* ---------------- login screen ---------------- */
  if (!authed) {
    return (
      <div className="relative flex min-h-screen items-center justify-center px-5">
        <div className="orb left-1/2 top-[10%] h-[50vh] w-[70vw] -translate-x-1/2 bg-brand-500/20" />
        <form onSubmit={handleLogin} className="glass-deep relative w-full max-w-sm rounded-3xl p-8">
          <Link to="/" className="text-xs text-white/40 hover:text-white">← Back to shop</Link>
          <div className="mt-6 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 font-display text-xl font-extrabold shadow-glow-brand">
            W
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold">Admin Panel</h1>
          <p className="mt-1 text-sm text-white/45">Wasay Online Mobile Shop</p>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError('') }}
            placeholder={localMode ? 'Password (demo: wasay123)' : 'Admin password'}
            className={inputCls + ' mt-6'}
            autoFocus
          />
          {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
          <button type="submit" className="btn-primary mt-4 w-full justify-center">Sign in</button>
          {localMode && (
            <p className="mt-3 text-center text-[11px] text-white/35">
              Demo mode — data is stored in this browser only.
            </p>
          )}
        </form>
      </div>
    )
  }

  /* ---------------- admin dashboard ---------------- */
  return (
    <div className="relative min-h-screen pb-20">
      <div className="orb right-[-10%] top-[5%] h-[40vh] w-[40vw] bg-brand-500/15" />
      <div className="relative mx-auto max-w-4xl px-5 pt-8">
        {/* header */}
        <div className="flex items-center justify-between">
          <div>
            <Link to="/" className="text-xs text-white/40 hover:text-white">← View shop</Link>
            <h1 className="mt-2 font-display text-2xl font-bold">Admin Panel</h1>
          </div>
          <button onClick={logout} className="btn-ghost !px-4 !py-2 text-sm">Log out</button>
        </div>

        {notice && (
          <div className="glass-deep sticky top-4 z-20 mt-4 rounded-2xl px-4 py-3 text-center text-sm font-semibold text-accent">
            {notice}
          </div>
        )}

        {/* tabs */}
        <div className="mt-6 flex gap-2">
          {[['products', 'Products'], ['settings', 'Settings']].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                tab === k ? 'bg-gradient-to-r from-brand-500 to-brand-600 shadow-glow-brand' : 'glass text-white/60'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ---------------- PRODUCTS TAB ---------------- */}
        {tab === 'products' && (
          <div className="mt-6 space-y-8">
            {/* add / edit form */}
            <form onSubmit={handleSubmit} className="glass-deep rounded-3xl p-6">
              <h2 className="font-display text-lg font-bold">
                {editingId ? 'Edit product' : 'Add a new phone'}
              </h2>

              {/* image upload */}
              <div className="mt-4 flex items-start gap-4">
                <div className="glass relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl">
                  {form.image_url ? (
                    <img src={form.image_url} alt="preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-2xl text-white/20">📷</div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 grid place-items-center bg-black/60 text-xs">Uploading…</div>
                  )}
                </div>
                <div className="flex-1">
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="btn-ghost !px-4 !py-2.5 text-sm"
                  >
                    {form.image_url ? 'Change image' : 'Upload photo'}
                  </button>
                  {form.image_url && (
                    <button type="button" onClick={() => set('image_url', '')} className="ml-2 text-xs text-red-400 hover:underline">
                      Remove
                    </button>
                  )}
                  <p className="mt-2 text-[11px] text-white/35">JPG/PNG, auto-compressed. Square photos look best.</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Product name *">
                  <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. iPhone 15 Pro Max" />
                </Field>
                <Field label="Brand">
                  <input className={inputCls} value={form.brand} onChange={(e) => set('brand', e.target.value)} placeholder="e.g. Apple" />
                </Field>
                <Field label="Price (Rs)">
                  <input className={inputCls} type="number" min="0" value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="e.g. 385000" />
                </Field>
                <Field label="Storage">
                  <input className={inputCls} list="storage-options" value={form.storage} onChange={(e) => set('storage', e.target.value)} placeholder="e.g. 256GB" />
                  <datalist id="storage-options">
                    {['64GB', '128GB', '256GB', '512GB', '1TB'].map((s) => <option key={s} value={s} />)}
                  </datalist>
                </Field>
              </div>
              <Field label="Description">
                <textarea className={inputCls + ' mt-4 min-h-[80px] resize-y'} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Short selling points: condition, color, warranty…" />
              </Field>
              <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-white/70">
                <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="h-4 w-4 accent-brand-500" />
                Feature this product (shown first)
              </label>

              <div className="mt-6 flex gap-3">
                <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                  {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add product'}
                </button>
                {editingId && (
                  <button type="button" onClick={() => { setForm(emptyForm); setEditingId(null) }} className="btn-ghost">
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* product list */}
            <div className="glass-deep rounded-3xl p-6">
              <h2 className="font-display text-lg font-bold">Products ({products?.length ?? 0})</h2>
              {products === null ? (
                <p className="mt-4 text-sm text-white/40">Loading…</p>
              ) : products.length === 0 ? (
                <p className="mt-4 text-sm text-white/40">No products yet — add your first phone above.</p>
              ) : (
                <ul className="mt-4 divide-y divide-white/5">
                  {products.map((p) => (
                    <li key={p.id} className="flex items-center gap-4 py-3.5">
                      <div className="glass h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                        {p.image_url
                          ? <img src={p.image_url} alt="" className="h-full w-full object-cover" />
                          : <div className="grid h-full place-items-center text-white/20">📱</div>}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{p.name} {p.storage && <span className="text-white/40">· {p.storage}</span>}</p>
                        <p className="text-sm text-brand-300">Rs {Number(p.price || 0).toLocaleString('en-PK')}</p>
                      </div>
                      <button onClick={() => startEdit(p)} className="glass rounded-xl px-3.5 py-2 text-xs font-semibold hover:text-white text-white/60">Edit</button>
                      <button onClick={() => handleDelete(p)} className="rounded-xl bg-red-500/15 px-3.5 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/25">Delete</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* ---------------- SETTINGS TAB ---------------- */}
        {tab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="glass-deep mt-6 rounded-3xl p-6">
            <h2 className="font-display text-lg font-bold">Shop settings</h2>
            <Field label="WhatsApp number (with country code, digits only)">
              <input
                className={inputCls + ' mt-4'}
                value={settings.whatsapp || ''}
                onChange={(e) => setSettings((s) => ({ ...s, whatsapp: e.target.value }))}
                placeholder="e.g. 923001234567"
              />
            </Field>
            <p className="mt-2 text-[11px] leading-relaxed text-white/35">
              Pakistan example: 92 + 3001234567 → <span className="text-white/60">923001234567</span>.
              This number receives all "Order on WhatsApp" messages.
            </p>
            <button type="submit" className="btn-primary mt-5">Save settings</button>
          </form>
        )}
      </div>
    </div>
  )
}
