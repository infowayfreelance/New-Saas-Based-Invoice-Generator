-- Add amount_paid column to invoices table if it doesn't exist
-- This column tracks the total amount paid on an invoice

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'invoices' 
    AND column_name = 'amount_paid'
  ) THEN
    ALTER TABLE invoices 
    ADD COLUMN amount_paid DECIMAL(12, 2) DEFAULT 0;
    
    COMMENT ON COLUMN invoices.amount_paid IS 'Total amount paid on this invoice, calculated from payment_entries';
  END IF;
END $$;

-- Update existing invoices to calculate amount_paid from payment_entries
UPDATE invoices i
SET amount_paid = COALESCE(
  (SELECT SUM(amount) 
   FROM payment_entries pe 
   WHERE pe.invoice_id = i.id),
  0
)
WHERE amount_paid IS NULL OR amount_paid = 0;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_invoices_amount_paid ON invoices(amount_paid);
