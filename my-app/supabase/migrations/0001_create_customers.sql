-- Create customers table
-- Run this SQL in: Supabase Dashboard → SQL Editor → New query

create table if not exists public.customers (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  full_name   text not null,
  phone       text,
  email       text,
  suburb      text,
  job_type    text,
  status      text not null default 'lead',
  notes       text
);

-- Enable Row Level Security (RLS) — no rows exposed until policies are added
alter table public.customers enable row level security;

-- Allow authenticated users to read/write their own data
-- (update these policies to match your auth model)
create policy "Allow read for authenticated users"
  on public.customers for select
  using (auth.role() = 'authenticated');

create policy "Allow insert for authenticated users"
  on public.customers for insert
  with check (auth.role() = 'authenticated');

create policy "Allow update for authenticated users"
  on public.customers for update
  using (auth.role() = 'authenticated');

create policy "Allow delete for authenticated users"
  on public.customers for delete
  using (auth.role() = 'authenticated');

-- Optional: seed a few test rows for development
insert into public.customers (full_name, phone, email, suburb, job_type, status, notes)
values
  ('Sarah Mitchell', '0412 345 678', 'sarah@example.com', 'Bondi', 'Electrical', 'active', 'Needs switchboard upgrade'),
  ('James Carver',   '0421 987 654', 'james@example.com', 'Parramatta', 'Plumbing', 'lead', 'Called re hot water system'),
  ('Priya Sharma',   '0435 111 222', 'priya@example.com', 'Chatswood', 'Roofing', 'active', 'Commercial job, needs quote');
