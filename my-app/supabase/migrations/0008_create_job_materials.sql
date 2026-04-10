-- Create job materials tracking table
-- ⚠ Run this SQL in: Supabase Dashboard → SQL Editor → New query

create table if not exists public.job_materials (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  job_id      text not null,   -- text covers both mock ids and real uuids
  description text not null,
  status      text not null default 'Needed'   -- 'Needed' | 'Ordered' | 'Delivered'
);

-- Enable Row Level Security
alter table public.job_materials enable row level security;

create policy "Allow read for authenticated users"
  on public.job_materials for select
  using (auth.role() = 'authenticated');

create policy "Allow insert for authenticated users"
  on public.job_materials for insert
  with check (auth.role() = 'authenticated');

create policy "Allow update for authenticated users"
  on public.job_materials for update
  using (auth.role() = 'authenticated');

create policy "Allow delete for authenticated users"
  on public.job_materials for delete
  using (auth.role() = 'authenticated');
