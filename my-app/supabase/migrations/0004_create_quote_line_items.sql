-- Create quote line items table
-- Run this SQL in: Supabase Dashboard → SQL Editor → New query

create extension if not exists pgcrypto;

create table if not exists public.quote_line_items (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  quote_id    uuid not null references public.quotes(id) on delete cascade,
  description text not null,
  quantity    numeric not null default 1,
  unit_price  numeric not null default 0,
  line_total  numeric not null default 0
);

-- Enable Row Level Security
alter table public.quote_line_items enable row level security;

create policy "Allow read for authenticated users"
  on public.quote_line_items for select
  using (auth.role() = 'authenticated');

create policy "Allow insert for authenticated users"
  on public.quote_line_items for insert
  with check (auth.role() = 'authenticated');

create policy "Allow update for authenticated users"
  on public.quote_line_items for update
  using (auth.role() = 'authenticated');

create policy "Allow delete for authenticated users"
  on public.quote_line_items for delete
  using (auth.role() = 'authenticated');
