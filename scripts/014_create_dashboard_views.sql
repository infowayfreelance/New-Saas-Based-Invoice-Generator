-- Create dashboard_totals view for aggregated statistics
-- This view provides historically locked totals based on invoice currency
CREATE OR REPLACE VIEW dashboard_totals AS
SELECT
  i.user_id,
  COUNT(DISTINCT i.id) AS total_invoices,
  COUNT(DISTINCT i.client_id) AS total_clients,
  SUM(CASE WHEN i.status = 'PAID' THEN i.total_amount ELSE 0 END) AS total_received_locked
FROM invoices i
GROUP BY i.user_id;

-- Create dashboard_pending_converted view for FX-converted pending amounts
-- This view calculates pending amounts converted to the user's selected currency
-- For now, we'll use a simplified version that returns amounts in their original currency
-- In a production system, you would join with exchange rate tables
CREATE OR REPLACE VIEW dashboard_pending_converted AS
SELECT
  i.user_id,
  i.id AS invoice_id,
  i.currency AS original_currency,
  i.total_amount - COALESCE(i.amount_paid, 0) AS pending_amount,
  i.total_amount - COALESCE(i.amount_paid, 0) AS pending_converted_amount,
  i.currency AS converted_currency
FROM invoices i
WHERE i.status IN ('SENT', 'PARTIALLY_PAID', 'OVERDUE')
  AND (i.total_amount - COALESCE(i.amount_paid, 0)) > 0;

-- Grant access to authenticated users
GRANT SELECT ON dashboard_totals TO authenticated;
GRANT SELECT ON dashboard_pending_converted TO authenticated;
