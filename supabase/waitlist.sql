-- Run this in the Supabase dashboard → SQL Editor.
-- Creates the waitlist table that /api/waitlist inserts into.

create table if not exists public.waitlist (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  created_at  timestamptz not null default now()
);

-- Enable Row Level Security. The API route uses the service-role key, which
-- bypasses RLS, so writes still work — but with NO permissive policies,
-- the public anon key can neither read nor write. The email list stays private.
alter table public.waitlist enable row level security;
