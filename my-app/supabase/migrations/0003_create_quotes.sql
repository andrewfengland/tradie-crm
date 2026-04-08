-- Create quotes table
-- Run this SQL in: Supabase Dashboard → SQL Editor → New query

create extension if not exists pgcrypto;

create table if not exists public.quotes (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  contact_name    text,
  opportunity_id  uuid references public.opportunities(id) on delete set null,
  status          text not null default 'Draft',
  subtotal        numeric,
  margin          numeric,
  deposit_percent numeric,
  total           numeric,
  notes           text
);

-- Enable Row Level Security
alter table public.quotes enable row level security;

create policy "Allow read for authenticated users"
  on public.quotes for select
  using (auth.role() = 'authenticated');

create policy "Allow insert for authenticated users"
  on public.quotes for insert
  with check (auth.role() = 'authenticated');

create policy "Allow update for authenticated users"
  on public.quotes for update
  using (auth.role() = 'authenticated');

create policy "Allow delete for authenticated users"
  on public.quotes for delete
  using (auth.role() = 'authenticated');
