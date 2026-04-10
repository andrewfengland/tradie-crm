-- Add follow-up reminder fields to opportunities and quotes
-- Run this SQL in: Supabase Dashboard → SQL Editor → New query

alter table public.opportunities
  add column if not exists follow_up_date date,
  add column if not exists follow_up_note text;

alter table public.quotes
  add column if not exists follow_up_date date,
  add column if not exists follow_up_note text;

-- Both columns are nullable so existing rows are unaffected.
