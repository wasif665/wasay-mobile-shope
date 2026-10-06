import { getSupabase } from './_lib/supabase.js'

export default async function handler(req, res) {
  if (getSupabase() === null) return res.status(503).json({ error: 'Database not configured' })
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { password } = req.body || {}
  if (process.env.ADMIN_KEY && password === process.env.ADMIN_KEY) {
    return res.status(200).json({ ok: true })
  }
  return res.status(401).json({ error: 'Wrong password' })
}
