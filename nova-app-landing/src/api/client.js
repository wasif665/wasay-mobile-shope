// ------------------------------------------------------------------
//  DATA LAYER
//  If Supabase env vars are configured (Vercel), all data goes through
//  /api/* serverless routes. Otherwise it transparently falls back to
//  the browser's localStorage so the site works with zero setup.
// ------------------------------------------------------------------

const LS_PRODUCTS = 'wasay_products'
const LS_SETTINGS = 'wasay_settings'
const LS_ADMIN = 'wasay_admin_key'

let apiAvailable = null

async function tryApi(path, options = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  if (!res.ok) throw new Error((await res.text()) || res.statusText)
  return res.json()
}

export async function detectMode() {
  if (apiAvailable !== null) return apiAvailable
  try {
    await tryApi('/api/products')
    apiAvailable = true
  } catch {
    apiAvailable = false
  }
  return apiAvailable
}

/* ---------------- localStorage helpers ---------------- */
const readLS = (k, fb) => {
  try { return JSON.parse(localStorage.getItem(k)) ?? fb } catch { return fb }
}
const writeLS = (k, v) => localStorage.setItem(k, JSON.stringify(v))
const localId = () =>
  (crypto.randomUUID ? crypto.randomUUID() : `local-${Date.now()}-${Math.random().toString(36).slice(2)}`)

/* ---------------- admin session ---------------- */
export const getAdminKey = () => sessionStorage.getItem(LS_ADMIN) || ''
export const setAdminKey = (k) => (k ? sessionStorage.setItem(LS_ADMIN, k) : sessionStorage.removeItem(LS_ADMIN))
const authHeaders = () => ({ 'x-admin-key': getAdminKey() })

export async function login(password) {
  if (await detectMode()) {
    return tryApi('/api/login', { method: 'POST', body: JSON.stringify({ password }) })
  }
  // local fallback password (demo mode) — set ADMIN_KEY env var in production
  if (password === 'wasay123') return { ok: true }
  throw new Error('Wrong password')
}

/* ---------------- products ---------------- */
export async function listProducts() {
  if (await detectMode()) return tryApi('/api/products')
  return readLS(LS_PRODUCTS, [])
}

export async function createProduct(p) {
  if (await detectMode()) {
    return tryApi('/api/products', { method: 'POST', body: JSON.stringify(p), headers: authHeaders() })
  }
  const item = { ...p, id: localId(), created_at: new Date().toISOString() }
  writeLS(LS_PRODUCTS, [item, ...readLS(LS_PRODUCTS, [])])
  return item
}

export async function updateProduct(id, p) {
  if (await detectMode()) {
    return tryApi(`/api/products?id=${encodeURIComponent(id)}`, {
      method: 'PUT', body: JSON.stringify(p), headers: authHeaders(),
    })
  }
  const items = readLS(LS_PRODUCTS, []).map((x) => (x.id === id ? { ...x, ...p } : x))
  writeLS(LS_PRODUCTS, items)
  return { id, ...p }
}

export async function deleteProduct(id) {
  if (await detectMode()) {
    return tryApi(`/api/products?id=${encodeURIComponent(id)}`, { method: 'DELETE', headers: authHeaders() })
  }
  writeLS(LS_PRODUCTS, readLS(LS_PRODUCTS, []).filter((x) => x.id !== id))
  return { ok: true }
}

/* ---------------- settings (WhatsApp number etc.) ---------------- */
export async function getSettings() {
  if (await detectMode()) return tryApi('/api/settings')
  return readLS(LS_SETTINGS, { whatsapp: '' })
}

export async function saveSettings(settings) {
  if (await detectMode()) {
    return tryApi('/api/settings', { method: 'PUT', body: JSON.stringify(settings), headers: authHeaders() })
  }
  writeLS(LS_SETTINGS, { ...readLS(LS_SETTINGS, {}), ...settings })
  return { ok: true }
}

/* ---------------- image upload ---------------- */
export function compressImage(file, maxWidth = 900, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(e) }
    img.src = url
  })
}

export async function uploadImage(file) {
  const dataUrl = await compressImage(file)
  if (await detectMode()) {
    const { url } = await tryApi('/api/upload', {
      method: 'POST', body: JSON.stringify({ data: dataUrl }), headers: authHeaders(),
    })
    return url
  }
  return dataUrl // localStorage mode: keep the small base64 image inline
}

/* ---------------- WhatsApp order link ---------------- */
export function whatsappOrderLink(number, product) {
  const msg = `Hello Wasay Online Mobile Shop! I want to order: ${product.name}` +
    (product.storage ? ` (${product.storage})` : '') +
    (product.price ? ` - Rs ${Number(product.price).toLocaleString('en-PK')}` : '') +
    '. Please confirm availability.'
  return `https://wa.me/${String(number || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`
}
