-- Run this in Supabase: SQL Editor -> New query -> paste -> Run

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text default '',
  price numeric default 0,
  storage text default '',
  description text default '',
  image_url text default '',
  featured boolean default false,
  created_at timestamptz default now()
);

create table if not exists settings (
  key text primary key,
  value text
);

-- Default WhatsApp number (change it later from /admin)
insert into settings (key, value)
values ('whatsapp', '923001234567')
on conflict (key) do nothing;

-- For image uploads, also create a public storage bucket named: product-images
-- (Storage -> New bucket -> name: product-images -> Public: ON)
