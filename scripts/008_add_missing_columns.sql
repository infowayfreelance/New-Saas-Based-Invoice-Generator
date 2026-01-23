-- ============================================================================
-- MIGRATION: Add Missing Columns (Schema Reconciliation)
-- PURPOSE: Align database schema with application code requirements
-- SAFE: Only ADDS columns, never removes or renames
-- ============================================================================

-- ============================================================================
-- 1. CLIENTS TABLE - Add postal_code
-- ============================================================================
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' AND column_name = 'postal_code'
  ) THEN
    ALTER TABLE clients ADD COLUMN postal_code TEXT;
    COMMENT ON COLUMN clients.postal_code IS 'Postal/ZIP code (alias for postcode)';
  END IF;
END $$;

-- ============================================================================
-- 2. INVOICES TABLE - Add computed amount columns
-- ============================================================================
DO $$ 
BEGIN
  -- Add tax_amount (alias for tax_total)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'invoices' AND column_name = 'tax_amount'
  ) THEN
    ALTER TABLE invoices ADD COLUMN tax_amount NUMERIC(10, 2) DEFAULT 0;
    COMMENT ON COLUMN invoices.tax_amount IS 'Tax amount (alias for tax_total)';
  END IF;

  -- Add discount_amount (alias for discount_total)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'invoices' AND column_name = 'discount_amount'
  ) THEN
    ALTER TABLE invoices ADD COLUMN discount_amount NUMERIC(10, 2) DEFAULT 0;
    COMMENT ON COLUMN invoices.discount_amount IS 'Discount amount (alias for discount_total)';
  END IF;

  -- Add total_amount (alias for total)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'invoices' AND column_name = 'total_amount'
  ) THEN
    ALTER TABLE invoices ADD COLUMN total_amount NUMERIC(10, 2) DEFAULT 0;
    COMMENT ON COLUMN invoices.total_amount IS 'Total amount (alias for total)';
  END IF;
END $$;

-- ============================================================================
-- 3. INVOICE_ITEMS TABLE - Add user_id for RLS
-- ============================================================================
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'invoice_items' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE invoice_items ADD COLUMN user_id UUID REFERENCES auth.users(id);
    COMMENT ON COLUMN invoice_items.user_id IS 'Owner user ID for RLS policies';
    
    -- Create index for performance
    CREATE INDEX IF NOT EXISTS idx_invoice_items_user_id ON invoice_items(user_id);
  END IF;
END $$;

-- ============================================================================
-- 4. RECURRING_INVOICE_RULES TABLE - Add missing fields
-- ============================================================================
DO $$ 
BEGIN
  -- Add next_run_at (alias for next_run_date)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'recurring_invoice_rules' AND column_name = 'next_run_at'
  ) THEN
    ALTER TABLE recurring_invoice_rules ADD COLUMN next_run_at TIMESTAMP WITH TIME ZONE;
    COMMENT ON COLUMN recurring_invoice_rules.next_run_at IS 'Next scheduled run time (alias for next_run_date)';
  END IF;

  -- Add active (alias for is_active)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'recurring_invoice_rules' AND column_name = 'active'
  ) THEN
    ALTER TABLE recurring_invoice_rules ADD COLUMN active BOOLEAN DEFAULT true;
    COMMENT ON COLUMN recurring_invoice_rules.active IS 'Active status (alias for is_active)';
  END IF;
END $$;

-- ============================================================================
-- 5. USER_SETTINGS TABLE - Add all missing personal/business info columns
-- ============================================================================
DO $$ 
BEGIN
  -- Personal information
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_settings' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN full_name TEXT;
    COMMENT ON COLUMN user_settings.full_name IS 'User full name';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_settings' AND column_name = 'business_name'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN business_name TEXT;
    COMMENT ON COLUMN user_settings.business_name IS 'Business/company name';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_settings' AND column_name = 'email'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN email TEXT;
    COMMENT ON COLUMN user_settings.email IS 'Contact email address';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_settings' AND column_name = 'phone'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN phone TEXT;
    COMMENT ON COLUMN user_settings.phone IS 'Contact phone number';
  END IF;

  -- Address information
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_settings' AND column_name = 'address_line1'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN address_line1 TEXT;
    COMMENT ON COLUMN user_settings.address_line1 IS 'Address line 1';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_settings' AND column_name = 'address_line2'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN address_line2 TEXT;
    COMMENT ON COLUMN user_settings.address_line2 IS 'Address line 2';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_settings' AND column_name = 'city'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN city TEXT;
    COMMENT ON COLUMN user_settings.city IS 'City';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_settings' AND column_name = 'state'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN state TEXT;
    COMMENT ON COLUMN user_settings.state IS 'State/province';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_settings' AND column_name = 'postal_code'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN postal_code TEXT;
    COMMENT ON COLUMN user_settings.postal_code IS 'Postal/ZIP code';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_settings' AND column_name = 'country'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN country TEXT;
    COMMENT ON COLUMN user_settings.country IS 'Country';
  END IF;

  -- Localization
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_settings' AND column_name = 'currency'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN currency TEXT DEFAULT 'USD';
    COMMENT ON COLUMN user_settings.currency IS 'Preferred currency code';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_settings' AND column_name = 'timezone'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN timezone TEXT DEFAULT 'UTC';
    COMMENT ON COLUMN user_settings.timezone IS 'User timezone';
  END IF;
END $$;

-- ============================================================================
-- 6. INVOICE STATUS ENUM - Ensure case compatibility
-- ============================================================================
-- Note: This adds CHECK constraint to accept both cases without modifying enum
DO $$ 
BEGIN
  -- Drop existing constraint if exists
  IF EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage 
    WHERE table_name = 'invoices' AND constraint_name = 'invoices_status_case_check'
  ) THEN
    ALTER TABLE invoices DROP CONSTRAINT invoices_status_case_check;
  END IF;

  -- Add CHECK constraint to normalize status values
  ALTER TABLE invoices ADD CONSTRAINT invoices_status_case_check 
    CHECK (
      status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled', 'DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED')
    );
END $$;

-- ============================================================================
-- VERIFICATION QUERIES (Run separately to verify)
-- ============================================================================
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'postal_code';
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'invoices' AND column_name IN ('tax_amount', 'discount_amount', 'total_amount');
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'invoice_items' AND column_name = 'user_id';
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'recurring_invoice_rules' AND column_name IN ('next_run_at', 'active');
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name IN ('full_name', 'business_name', 'email', 'phone', 'address_line1', 'address_line2', 'city', 'state', 'postal_code', 'country', 'currency', 'timezone');
