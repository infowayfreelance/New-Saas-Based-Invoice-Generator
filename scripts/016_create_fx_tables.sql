-- Create FX rates tables for currency conversion

-- FX rates historical table
CREATE TABLE IF NOT EXISTS fx_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_currency TEXT NOT NULL DEFAULT 'USD',
  target_currency TEXT NOT NULL,
  rate DECIMAL(18, 8) NOT NULL,
  rate_date DATE NOT NULL DEFAULT CURRENT_DATE,
  source TEXT DEFAULT 'manual',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(base_currency, target_currency, rate_date)
);

-- FX latest rates view for quick lookups
CREATE OR REPLACE VIEW fx_latest_rates AS
SELECT DISTINCT ON (base_currency, target_currency)
  base_currency,
  target_currency,
  rate,
  rate_date,
  source,
  updated_at
FROM fx_rates
ORDER BY base_currency, target_currency, rate_date DESC, updated_at DESC;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_fx_rates_currencies ON fx_rates(base_currency, target_currency);
CREATE INDEX IF NOT EXISTS idx_fx_rates_date ON fx_rates(rate_date DESC);

-- Add RLS policies
ALTER TABLE fx_rates ENABLE ROW LEVEL SECURITY;

-- Everyone can read FX rates
CREATE POLICY "Anyone can read FX rates"
  ON fx_rates
  FOR SELECT
  USING (true);

-- Only admins can insert/update FX rates
CREATE POLICY "Admins can insert FX rates"
  ON fx_rates
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can update FX rates"
  ON fx_rates
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Insert default rates (1:1 for same currency)
INSERT INTO fx_rates (base_currency, target_currency, rate, rate_date, source)
VALUES 
  ('USD', 'USD', 1.0, CURRENT_DATE, 'system'),
  ('EUR', 'EUR', 1.0, CURRENT_DATE, 'system'),
  ('GBP', 'GBP', 1.0, CURRENT_DATE, 'system'),
  ('JPY', 'JPY', 1.0, CURRENT_DATE, 'system'),
  ('AUD', 'AUD', 1.0, CURRENT_DATE, 'system'),
  ('CAD', 'CAD', 1.0, CURRENT_DATE, 'system')
ON CONFLICT (base_currency, target_currency, rate_date) DO NOTHING;

-- Insert some sample rates (these should be updated by API in production)
INSERT INTO fx_rates (base_currency, target_currency, rate, rate_date, source)
VALUES 
  ('USD', 'EUR', 0.92, CURRENT_DATE, 'manual'),
  ('USD', 'GBP', 0.79, CURRENT_DATE, 'manual'),
  ('USD', 'JPY', 149.50, CURRENT_DATE, 'manual'),
  ('USD', 'AUD', 1.52, CURRENT_DATE, 'manual'),
  ('USD', 'CAD', 1.36, CURRENT_DATE, 'manual'),
  ('EUR', 'USD', 1.09, CURRENT_DATE, 'manual'),
  ('GBP', 'USD', 1.27, CURRENT_DATE, 'manual')
ON CONFLICT (base_currency, target_currency, rate_date) DO NOTHING;
