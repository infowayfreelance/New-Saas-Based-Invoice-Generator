-- Add is_active column to country_pricing table
ALTER TABLE country_pricing 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Set all existing rows to active
UPDATE country_pricing SET is_active = true WHERE is_active IS NULL;

-- Add comment explaining the column
COMMENT ON COLUMN country_pricing.is_active IS 'Indicates if this pricing is currently active and should be displayed to users';
