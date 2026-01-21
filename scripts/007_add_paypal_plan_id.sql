-- Add PayPal plan ID column to plans table
ALTER TABLE plans ADD COLUMN IF NOT EXISTS paypal_plan_id TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_plans_paypal_plan_id ON plans(paypal_plan_id);

-- Add comment
COMMENT ON COLUMN plans.paypal_plan_id IS 'PayPal billing plan ID for this subscription plan';
