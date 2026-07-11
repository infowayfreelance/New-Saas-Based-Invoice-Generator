-- ============================================================================
-- Add WhatsApp number fields to user_settings and clients
-- ============================================================================
-- Lets a business owner save their own WhatsApp number (with country code)
-- and each client's WhatsApp number, so invoices can be sent via a
-- wa.me click-to-chat link without any paid WhatsApp Business API.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_settings' AND column_name = 'whatsapp_number'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN whatsapp_number TEXT;
    COMMENT ON COLUMN user_settings.whatsapp_number IS 'Owner WhatsApp number with country code, e.g. +1 234 567 8900';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'whatsapp_number'
  ) THEN
    ALTER TABLE clients ADD COLUMN whatsapp_number TEXT;
    COMMENT ON COLUMN clients.whatsapp_number IS 'Client WhatsApp number with country code, e.g. +1 234 567 8900';
  END IF;
END $$;
