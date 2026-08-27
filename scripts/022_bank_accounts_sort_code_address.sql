-- Adds fields needed for country-specific bank details (e.g. UK sort code,
-- a printable bank address) so a saved bank account can carry everything
-- needed to auto-fill an invoice's Bank Details when its currency matches.

alter table public.bank_accounts add column if not exists sort_code text;
alter table public.bank_accounts add column if not exists bank_address text;
