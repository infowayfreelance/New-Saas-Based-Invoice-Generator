-- 006_create_bank_accounts.sql
-- Create bank_accounts table for PRO users to manage multiple bank accounts

CREATE TABLE IF NOT EXISTS bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_name TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL, -- store full; UI will mask
  routing_number TEXT,
  swift_code TEXT,
  currency TEXT DEFAULT 'USD',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow at most one default per user
CREATE UNIQUE INDEX IF NOT EXISTS bank_accounts_one_default_per_user
  ON bank_accounts(user_id)
  WHERE is_default = TRUE;

-- RLS
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY bank_accounts_select_own
  ON bank_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY bank_accounts_insert_own
  ON bank_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY bank_accounts_update_own
  ON bank_accounts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY bank_accounts_delete_own
  ON bank_accounts FOR DELETE
  USING (auth.uid() = user_id);
