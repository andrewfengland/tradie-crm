-- Add job_address to quotes table for the quote-to-job conversion flow
-- ⚠ Run this SQL in: Supabase Dashboard → SQL Editor → New query

alter table public.quotes
  add column if not exists job_address text;
