-- Adds support for a full "Terms & Conditions" detail page on invoices,
-- backed by a reusable, named library of templates the user can save,
-- edit, and pick from per invoice. Also drops the "notes" field, which is
-- being replaced by "Bank Details" in the same spot on the invoice.

alter table public.invoices drop column if exists notes;
alter table public.invoices add column if not exists terms_detail text;

create table if not exists public.terms_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists terms_templates_user_id_idx on public.terms_templates(user_id);

alter table public.terms_templates enable row level security;

create policy "Users can view their own terms templates"
  on public.terms_templates for select
  using (auth.uid() = user_id);

create policy "Users can create their own terms templates"
  on public.terms_templates for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own terms templates"
  on public.terms_templates for update
  using (auth.uid() = user_id);

create policy "Users can delete their own terms templates"
  on public.terms_templates for delete
  using (auth.uid() = user_id);
