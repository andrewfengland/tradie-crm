-- Create internal notes table for jobs and quotes
-- Run this SQL in: Supabase Dashboard → SQL Editor → New query

create extension if not exists pgcrypto;

create table if not exists public.notes (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  parent_type text not null,   -- 'job' | 'quote'
  parent_id   text not null,   -- job or quote id (text covers mock ids and uuids)
  body        text not null
);

-- Enable Row Level Security
alter table public.notes enable row level security;

create policy "Allow read for authenticated users"
  on public.notes for select
  using (auth.role() = 'authenticated');

create policy "Allow insert for authenticated users"
  on public.notes for insert
  with check (auth.role() = 'authenticated');

create policy "Allow delete for authenticated users"
  on public.notes for delete
  using (auth.role() = 'authenticated');
