-- Add scheduling fields to jobs table (when jobs are migrated to Supabase)
-- Run this SQL in: Supabase Dashboard → SQL Editor → New query
-- NOTE: This migration is for when a jobs table exists. If you are using
-- mock data only, this file documents the intended schema shape.

-- alter table public.jobs
--   add column if not exists start_date      date,
--   add column if not exists end_date        date,
--   add column if not exists time_window     text,
--   add column if not exists assigned_crew   text;

-- All four columns are nullable so existing rows are unaffected.
