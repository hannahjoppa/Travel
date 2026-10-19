-- Run ONCE in Supabase SQL Editor. All access is through the Vercel serverless API.
create table if not exists public.trip_expenses (
  id text primary key,
  data jsonb not null
);
alter table public.trip_expenses enable row level security;
-- No anonymous or authenticated browser access policies intentionally.
-- Vercel uses SUPABASE_SERVICE_ROLE_KEY only on the server, which bypasses RLS.
