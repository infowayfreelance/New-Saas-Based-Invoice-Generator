-- Create currencies table
CREATE TABLE IF NOT EXISTS currencies (
  code VARCHAR(3) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE currencies ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users
CREATE POLICY "Allow read access to all authenticated users"
ON currencies FOR SELECT
TO authenticated
USING (true);

-- Insert seed data
INSERT INTO currencies (code, name, symbol) VALUES
  ('USD', 'US Dollar', '$'),
  ('EUR', 'Euro', '€'),
  ('GBP', 'British Pound', '£'),
  ('PKR', 'Pakistani Rupee', '₨'),
  ('INR', 'Indian Rupee', '₹'),
  ('AUD', 'Australian Dollar', 'A$'),
  ('CAD', 'Canadian Dollar', 'C$'),
  ('JPY', 'Japanese Yen', '¥'),
  ('CNY', 'Chinese Yuan', '¥'),
  ('CHF', 'Swiss Franc', 'CHF'),
  ('SEK', 'Swedish Krona', 'kr'),
  ('NZD', 'New Zealand Dollar', 'NZ$'),
  ('SGD', 'Singapore Dollar', 'S$'),
  ('HKD', 'Hong Kong Dollar', 'HK$'),
  ('NOK', 'Norwegian Krone', 'kr'),
  ('MXN', 'Mexican Peso', '$'),
  ('BRL', 'Brazilian Real', 'R$'),
  ('ZAR', 'South African Rand', 'R'),
  ('AED', 'UAE Dirham', 'د.إ')
ON CONFLICT (code) DO NOTHING;
