-- Create dashboard_invoices_base view for invoice workflow
-- This view provides base invoice data joined with client information
CREATE OR REPLACE VIEW dashboard_invoices_base AS
SELECT
  i.id,
  i.user_id,
  i.client_id,
  i.invoice_number,
  i.issue_date,
  i.due_date,
  i.status,
  i.total_amount,
  i.amount_paid,
  i.currency,
  i.created_at,
  i.updated_at,
  c.name AS client_name,
  c.email AS client_email
FROM invoices i
LEFT JOIN clients c ON i.client_id = c.id;

-- Create invoice_payment_summary view for payment calculations
-- This view calculates remaining amounts and total paid per invoice
CREATE OR REPLACE VIEW invoice_payment_summary AS
SELECT
  i.id AS invoice_id,
  i.user_id,
  i.total_amount,
  COALESCE(i.amount_paid, 0) AS total_paid,
  i.total_amount - COALESCE(i.amount_paid, 0) AS remaining_amount,
  CASE
    WHEN i.status = 'PAID' THEN 'paid'
    WHEN i.status = 'PARTIALLY_PAID' THEN 'partial'
    WHEN i.status = 'SENT' OR i.status = 'OVERDUE' THEN 'pending'
    WHEN i.status = 'DRAFT' THEN 'draft'
    ELSE 'unknown'
  END AS payment_status
FROM invoices i;

-- Grant access to authenticated users
GRANT SELECT ON dashboard_invoices_base TO authenticated;
GRANT SELECT ON invoice_payment_summary TO authenticated;
