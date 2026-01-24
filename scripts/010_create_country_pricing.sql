-- Create country_pricing table
CREATE TABLE IF NOT EXISTS country_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code VARCHAR(2) NOT NULL,
  country_name VARCHAR(100) NOT NULL,
  plan_code VARCHAR(20) NOT NULL CHECK (plan_code IN ('BASIC', 'STANDARD', 'PRO')),
  currency_code VARCHAR(3) NOT NULL,
  price_amount DECIMAL(10, 2) NOT NULL, -- Monthly price
  price_yearly DECIMAL(10, 2) NOT NULL, -- Yearly price (with 20% discount)
  stripe_price_id_monthly VARCHAR(255),
  stripe_price_id_yearly VARCHAR(255),
  paypal_plan_id_monthly VARCHAR(255),
  paypal_plan_id_yearly VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Foreign key to currencies
  CONSTRAINT fk_currency FOREIGN KEY (currency_code) REFERENCES currencies(code) ON DELETE CASCADE,
  
  -- Unique constraint on country + plan combination
  CONSTRAINT unique_country_plan UNIQUE (country_code, plan_code)
);

-- Enable RLS
ALTER TABLE country_pricing ENABLE ROW LEVEL SECURITY;

-- Allow read access to all users (public pricing data)
CREATE POLICY "Allow read access to all users"
ON country_pricing FOR SELECT
TO public
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_country_pricing_country ON country_pricing(country_code);
CREATE INDEX idx_country_pricing_plan ON country_pricing(plan_code);
CREATE INDEX idx_country_pricing_currency ON country_pricing(currency_code);

-- Insert seed data for US pricing
INSERT INTO country_pricing (country_code, country_name, plan_code, currency_code, price_amount, price_yearly) VALUES
  ('US', 'United States', 'BASIC', 'USD', 5.00, 48.00),      -- 5 * 12 * 0.8 = 48
  ('US', 'United States', 'STANDARD', 'USD', 12.00, 115.20),  -- 12 * 12 * 0.8 = 115.20
  ('US', 'United States', 'PRO', 'USD', 29.99, 287.90),       -- 29.99 * 12 * 0.8 = 287.90

  ('GB', 'United Kingdom', 'BASIC', 'GBP', 4.00, 38.40),      -- £4/mo
  ('GB', 'United Kingdom', 'STANDARD', 'GBP', 9.00, 86.40),   -- £9/mo
  ('GB', 'United Kingdom', 'PRO', 'GBP', 24.00, 230.40),      -- £24/mo

  ('PK', 'Pakistan', 'BASIC', 'PKR', 1200.00, 11520.00),      -- ₨1200/mo
  ('PK', 'Pakistan', 'STANDARD', 'PKR', 3000.00, 28800.00),   -- ₨3000/mo
  ('PK', 'Pakistan', 'PRO', 'PKR', 7500.00, 72000.00),        -- ₨7500/mo

  ('IN', 'India', 'BASIC', 'INR', 400.00, 3840.00),           -- ₹400/mo
  ('IN', 'India', 'STANDARD', 'INR', 950.00, 9120.00),        -- ₹950/mo
  ('IN', 'India', 'PRO', 'INR', 2400.00, 23040.00),           -- ₹2400/mo

  ('AU', 'Australia', 'BASIC', 'AUD', 7.00, 67.20),           -- A$7/mo
  ('AU', 'Australia', 'STANDARD', 'AUD', 17.00, 163.20),      -- A$17/mo
  ('AU', 'Australia', 'PRO', 'AUD', 42.00, 403.20),           -- A$42/mo

  ('CA', 'Canada', 'BASIC', 'CAD', 6.50, 62.40),              -- C$6.50/mo
  ('CA', 'Canada', 'STANDARD', 'CAD', 15.00, 144.00),         -- C$15/mo
  ('CA', 'Canada', 'PRO', 'CAD', 38.00, 364.80),              -- C$38/mo

  ('EU', 'European Union', 'BASIC', 'EUR', 4.50, 43.20),      -- €4.50/mo
  ('EU', 'European Union', 'STANDARD', 'EUR', 11.00, 105.60), -- €11/mo
  ('EU', 'European Union', 'PRO', 'EUR', 27.00, 259.20)       -- €27/mo
ON CONFLICT (country_code, plan_code) DO NOTHING;
