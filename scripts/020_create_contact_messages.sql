-- Stores submissions from the public /contact page. No transactional email
-- provider is currently wired up in the codebase, so messages are recorded
-- here for the team to review, rather than claiming an email is sent.
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  category text not null,
  subject text not null,
  message text not null,
  account_email text,
  reference text,
  consent boolean not null default false,
  ip_address text,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- Intentionally no policies: the /contact server action writes using the
-- service-role client (bypasses RLS), and there is no client-side read or
-- write path. This keeps submissions inaccessible via the anon/public key.
