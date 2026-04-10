-- Create jobs table for real persistent job records
-- ⚠ Run this SQL in: Supabase Dashboard → SQL Editor → New query

create extension if not exists pgcrypto;

create table if not exists public.jobs (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  job_number      text,
  client_name     text,
  client_id       text,
  site_address    text,
  status          text not null default 'Scheduled',
  assigned_staff  text,
  scheduled_date  text,
  start_date      text,
  end_date        text,
  time_window     text,
  assigned_crew   text,
  scope           text,
  notes           text,
  quote_id        uuid references public.quotes(id) on delete set null
);

-- Enable Row Level Security
alter table public.jobs enable row level security;

create policy "Allow read for authenticated users"
  on public.jobs for select
  using (auth.role() = 'authenticated');

create policy "Allow insert for authenticated users"
  on public.jobs for insert
  with check (auth.role() = 'authenticated');

create policy "Allow update for authenticated users"
  on public.jobs for update
  using (auth.role() = 'authenticated');

create policy "Allow delete for authenticated users"
  on public.jobs for delete
  using (auth.role() = 'authenticated');
