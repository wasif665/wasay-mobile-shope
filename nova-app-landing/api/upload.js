import { getSupabase, isAdmin } from './_lib/supabase.js'

export default async function handler(req, res) {
  const db = getSupabase()
  if (!db) return res.status(503).json({ error: 'Database not configured' })
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })

  const { data: dataUrl } = req.body || {}
  if (!dataUrl || !dataUrl.startsWith('data:image/')) {
    return res.status(400).json({ error: 'Expected a base64 image data URL' })
  }

  const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, '')
  const buffer = Buffer.from(base64, 'base64')
  const path = `products/${Date.now()}-${Math.round(Math.random() * 1e6)}.jpg`

  const { error } = await db.storage
    .from('product-images')
    .upload(path, buffer, { contentType: 'image/jpeg', upsert: false })

  if (error) return res.status(500).json({ error: error.message })
  const { data } = db.storage.from('product-images').getPublicUrl(path)
  return res.status(200).json({ url: data.publicUrl })
}
