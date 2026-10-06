import { getSupabase, isAdmin } from './_lib/supabase.js'

export default async function handler(req, res) {
  const db = getSupabase()
  if (!db) return res.status(503).json({ error: 'Database not configured' })

  if (req.method === 'GET') {
    const { data, error } = await db.from('settings').select('key, value')
    if (error) return res.status(500).json({ error: error.message })
    const settings = Object.fromEntries((data || []).map((r) => [r.key, r.value]))
    return res.status(200).json(settings)
  }

  if (req.method === 'PUT') {
    if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })
    const body = req.body || {}
    const rows = Object.entries(body).map(([key, value]) => ({ key, value: String(value ?? '') }))
    const { error } = await db.from('settings').upsert(rows, { onConflict: 'key' })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ ok: true })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
