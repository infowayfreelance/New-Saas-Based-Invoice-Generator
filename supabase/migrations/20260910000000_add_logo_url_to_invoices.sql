-- Add logo_url column to invoices table to persist per-invoice logos
-- Run this migration in your Supabase SQL editor before deploying
alter table invoices
  add column if not exists logo_url text;
