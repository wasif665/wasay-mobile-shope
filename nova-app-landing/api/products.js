import { getSupabase, isAdmin } from './_lib/supabase.js'

export default async function handler(req, res) {
  const db = getSupabase()
  if (!db) return res.status(503).json({ error: 'Database not configured' })

  const { id } = req.query

  if (req.method === 'GET') {
    const { data, error } = await db
      .from('products')
      .select('*')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'POST') {
    const p = req.body || {}
    const { data, error } = await db
      .from('products')
      .insert({
        name: p.name || '',
        brand: p.brand || '',
        price: Number(p.price) || 0,
        storage: p.storage || '',
        description: p.description || '',
        image_url: p.image_url || '',
        featured: !!p.featured,
      })
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  if (req.method === 'PUT') {
    if (!id) return res.status(400).json({ error: 'Missing id' })
    const p = req.body || {}
    const { data, error } = await db
      .from('products')
      .update({
        name: p.name || '',
        brand: p.brand || '',
        price: Number(p.price) || 0,
        storage: p.storage || '',
        description: p.description || '',
        image_url: p.image_url || '',
        featured: !!p.featured,
      })
      .eq('id', id)
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    if (!id) return res.status(400).json({ error: 'Missing id' })
    const { error } = await db.from('products').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ ok: true })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
