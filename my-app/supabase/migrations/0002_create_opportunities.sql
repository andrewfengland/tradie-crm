-- Create opportunities table
-- Run this SQL in: Supabase Dashboard → SQL Editor → New query

create extension if not exists pgcrypto;

create table if not exists public.opportunities (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  title        text not null,
  customer_id  uuid references public.customers(id) on delete set null,
  contact_name text,
  stage        text,
  value        numeric,
  notes        text
);

-- Enable Row Level Security
alter table public.opportunities enable row level security;

create policy "Allow read for authenticated users"
  on public.opportunities for select
  using (auth.role() = 'authenticated');

create policy "Allow insert for authenticated users"
  on public.opportunities for insert
  with check (auth.role() = 'authenticated');

create policy "Allow update for authenticated users"
  on public.opportunities for update
  using (auth.role() = 'authenticated');

create policy "Allow delete for authenticated users"
  on public.opportunities for delete
  using (auth.role() = 'authenticated');
