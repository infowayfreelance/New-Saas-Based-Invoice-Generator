-- Add country_code and city columns to user_settings
DO $$ 
BEGIN
  -- Add country_code column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_settings' AND column_name = 'country_code'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN country_code VARCHAR(2);
    COMMENT ON COLUMN user_settings.country_code IS 'User selected country code (ISO 3166-1 alpha-2)';
  END IF;
  
  -- Add city column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_settings' AND column_name = 'city'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN city TEXT;
    COMMENT ON COLUMN user_settings.city IS 'User city for profile and analytics';
  END IF;
END $$;

-- Create user_currencies table to store enabled currencies per user
CREATE TABLE IF NOT EXISTS user_currencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  currency_code VARCHAR(3) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Foreign key to currencies table
  CONSTRAINT fk_currency FOREIGN KEY (currency_code) REFERENCES currencies(code) ON DELETE CASCADE,
  
  -- Unique constraint: one currency per user
  CONSTRAINT unique_user_currency UNIQUE (user_id, currency_code)
);

-- Enable RLS on user_currencies
ALTER TABLE user_currencies ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_currencies
CREATE POLICY "Users can view their own currencies" ON user_currencies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own currencies" ON user_currencies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own currencies" ON user_currencies
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own currencies" ON user_currencies
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_currencies_user_id ON user_currencies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_currencies_currency_code ON user_currencies(currency_code);

COMMENT ON TABLE user_currencies IS 'Stores enabled currencies for each user';
COMMENT ON COLUMN user_currencies.is_default IS 'Whether this is the users default currency';
