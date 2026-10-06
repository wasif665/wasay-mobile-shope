import { createClient } from '@supabase/supabase-js'

// Returns null when env vars are missing -> site falls back to localStorage mode
export function getSupabase() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

export function isAdmin(req) {
  const key = process.env.ADMIN_KEY
  return !!key && req.headers['x-admin-key'] === key
}
