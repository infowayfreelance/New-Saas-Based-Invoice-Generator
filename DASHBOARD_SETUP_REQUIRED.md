# Dashboard Setup Required

## Current Status

The dashboard code is correctly written to use the `dashboard_invoices_base` view, but **the view does not exist in your database yet**.

## Error Messages You're Seeing

\`\`\`
column dashboard_invoices_base.invoice_id does not exist
\`\`\`

This happens because the view hasn't been created in Supabase.

## Required Database Migrations

You MUST run these SQL scripts in your Supabase SQL Editor in order:

### 1. Create Dashboard Statistics Views
**File:** `scripts/014_create_dashboard_views.sql`

Creates views for dashboard stats cards:
- `dashboard_totals` - Total invoices and clients
- `dashboard_pending_converted` - Pending invoice amounts

### 2. Create Invoice Workflow Views
**File:** `scripts/015_create_invoice_workflow_views.sql`

Creates views for the invoice workflow columns:
- `dashboard_invoices_base` - Invoice data with client names
- `invoice_payment_summary` - Payment calculations

### 3. Create FX Rate Tables (Optional, for payments)
**File:** `scripts/016_create_fx_tables.sql`

Creates foreign exchange rate tables for multi-currency support.

### 4. Add FX Fields to Payments (Optional, for payments)
**File:** `scripts/017_add_fx_fields_to_payments.sql`

Adds currency conversion fields to payment_entries table.

## How to Run the Migrations

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open each script file from the `scripts/` folder
4. Copy the entire SQL content
5. Paste into the SQL Editor
6. Click **Run** to execute
7. Repeat for each script in order

## What the Code Expects

The `dashboard_invoices_base` view provides these columns:

- `invoice_id` - Primary identifier (NOT `id`)
- `user_id` - User who owns the invoice
- `invoice_number` - Invoice number
- `client_name` - Client name (already joined)
- `total_amount` - Invoice total
- `amount_paid` - Amount already paid
- `issue_date` - Invoice issue date
- `status` - Invoice status (lowercase: 'draft', 'sent', 'paid', etc.)

## Verification

After running the migrations, you can verify they worked:

\`\`\`sql
-- Check if view exists
SELECT * FROM dashboard_invoices_base LIMIT 1;

-- Check if view has correct columns
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'dashboard_invoices_base';
\`\`\`

## Current Code Status

✅ The code is **correct** and ready to work  
❌ The database views are **missing**  
🔧 Action required: **Run the migration scripts**

Once you run the migrations, the dashboard will work correctly with no code changes needed.
