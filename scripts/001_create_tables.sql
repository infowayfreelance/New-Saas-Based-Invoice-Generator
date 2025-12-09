-- Create enum types
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');
CREATE TYPE plan_code AS ENUM ('GUEST', 'BASIC', 'STANDARD', 'PRO');
CREATE TYPE subscription_status AS ENUM ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'INACTIVE');
CREATE TYPE invoice_status AS ENUM ('DRAFT', 'SENT', 'PAID', 'PARTIALLY_PAID', 'OVERDUE');
CREATE TYPE recurring_frequency AS ENUM ('MONTHLY');
CREATE TYPE theme_preference AS ENUM ('LIGHT', 'DARK', 'SYSTEM');
CREATE TYPE integration_category AS ENUM ('STRIPE', 'EMAIL', 'PAYOUT', 'OTHER');

-- Plans table (seed data will be added separately)
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code plan_code NOT NULL UNIQUE,
  price_monthly DECIMAL(10, 2) NOT NULL DEFAULT 0,
  invoice_limit_per_day INTEGER,
  invoice_limit_per_month INTEGER,
  features_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table (references Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  plan_id UUID REFERENCES plans(id),
  role user_role DEFAULT 'USER',
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT DEFAULT 'STRIPE',
  provider_customer_id TEXT,
  provider_subscription_id TEXT,
  status subscription_status DEFAULT 'INACTIVE',
  current_plan_id UUID REFERENCES plans(id),
  trial_ends_at TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  company_name TEXT,
  phone TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postcode TEXT,
  country TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoice templates table
CREATE TABLE IF NOT EXISTS invoice_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  layout_config JSONB,
  primary_color TEXT DEFAULT '#000000',
  accent_color TEXT DEFAULT '#3b82f6',
  logo_url TEXT,
  watermark_text TEXT,
  signature_url TEXT,
  min_plan plan_code DEFAULT 'BASIC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL,
  status invoice_status DEFAULT 'DRAFT',
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  currency TEXT DEFAULT 'USD',
  subtotal DECIMAL(12, 2) DEFAULT 0,
  tax_amount DECIMAL(12, 2) DEFAULT 0,
  discount_amount DECIMAL(12, 2) DEFAULT 0,
  total_amount DECIMAL(12, 2) DEFAULT 0,
  amount_paid DECIMAL(12, 2) DEFAULT 0,
  notes TEXT,
  terms TEXT,
  template_id UUID REFERENCES invoice_templates(id),
  client_name TEXT,
  client_email TEXT,
  client_address TEXT,
  from_name TEXT,
  from_email TEXT,
  from_address TEXT,
  sent_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, invoice_number)
);

-- Invoice items table
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10, 2) DEFAULT 1,
  unit_price DECIMAL(12, 2) NOT NULL,
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  total DECIMAL(12, 2) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recurring invoice rules table (Pro only)
CREATE TABLE IF NOT EXISTS recurring_invoice_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  base_invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  frequency recurring_frequency DEFAULT 'MONTHLY',
  day_of_month INTEGER CHECK (day_of_month >= 1 AND day_of_month <= 28),
  auto_send BOOLEAN DEFAULT false,
  auto_reminder_days INTEGER[] DEFAULT '{3, 5, 7}',
  next_run_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment entries table
CREATE TABLE IF NOT EXISTS payment_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  amount DECIMAL(12, 2) NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage log table (for tracking invoice limits)
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ip_address TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  month TEXT NOT NULL,
  invoices_today INTEGER DEFAULT 0,
  invoices_this_month INTEGER DEFAULT 0,
  last_invoice_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date),
  UNIQUE(ip_address, date) WHERE user_id IS NULL
);

-- User settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  default_currency TEXT DEFAULT 'USD',
  theme theme_preference DEFAULT 'SYSTEM',
  default_reply_to_email TEXT,
  company_name TEXT,
  company_address TEXT,
  company_tax_id TEXT,
  invoice_start_number INTEGER DEFAULT 1,
  invoice_prefix TEXT DEFAULT 'INV-',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User email settings table
CREATE TABLE IF NOT EXISTS user_email_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  use_system_email BOOLEAN DEFAULT true,
  reply_to_email TEXT,
  sending_domain TEXT,
  domain_verified BOOLEAN DEFAULT false,
  smtp_host TEXT,
  smtp_port INTEGER,
  smtp_user TEXT,
  smtp_password TEXT,
  smtp_use_ssl BOOLEAN DEFAULT true,
  smtp_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Global settings table
CREATE TABLE IF NOT EXISTS global_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  free_guest_daily_limit INTEGER DEFAULT 3,
  free_guest_monthly_limit INTEGER DEFAULT 15,
  basic_daily_limit INTEGER DEFAULT 5,
  basic_monthly_limit INTEGER DEFAULT 30,
  min_affiliate_payout INTEGER DEFAULT 50,
  features_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Integration settings table
CREATE TABLE IF NOT EXISTS integration_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  category integration_category DEFAULT 'OTHER',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_plan_id ON users(plan_id);
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX idx_payment_entries_user_id ON payment_entries(user_id);
CREATE INDEX idx_payment_entries_invoice_id ON payment_entries(invoice_id);
CREATE INDEX idx_usage_logs_user_id_date ON usage_logs(user_id, date);
CREATE INDEX idx_usage_logs_ip_date ON usage_logs(ip_address, date);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
