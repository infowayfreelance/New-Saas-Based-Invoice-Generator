-- Add FX conversion fields to payment_entries table

ALTER TABLE payment_entries
ADD COLUMN IF NOT EXISTS payment_currency TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS payment_reference TEXT,
ADD COLUMN IF NOT EXISTS fx_rate DECIMAL(18, 8),
ADD COLUMN IF NOT EXISTS fx_date DATE,
ADD COLUMN IF NOT EXISTS converted_amount DECIMAL(12, 2),
ADD COLUMN IF NOT EXISTS converted_currency TEXT;

-- Update existing records to have default values
UPDATE payment_entries
SET 
  payment_currency = 'USD',
  converted_amount = amount,
  converted_currency = 'USD',
  fx_rate = 1.0,
  fx_date = payment_date
WHERE payment_currency IS NULL;

-- Add comment to explain the fields
COMMENT ON COLUMN payment_entries.payment_currency IS 'Currency of the invoice being paid';
COMMENT ON COLUMN payment_entries.payment_reference IS 'Optional payment reference/transaction ID';
COMMENT ON COLUMN payment_entries.fx_rate IS 'Exchange rate at time of payment';
COMMENT ON COLUMN payment_entries.fx_date IS 'Date the FX rate was applied';
COMMENT ON COLUMN payment_entries.converted_amount IS 'Amount converted to dashboard currency';
COMMENT ON COLUMN payment_entries.converted_currency IS 'Dashboard currency at time of payment';
