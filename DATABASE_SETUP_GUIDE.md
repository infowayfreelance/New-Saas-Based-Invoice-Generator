# Database Setup Guide

This guide walks you through setting up the Supabase database for the Invoice Generator SaaS application.

## Prerequisites

1. A Supabase project (create one at [supabase.com](https://supabase.com))
2. The following environment variables configured in your Vercel/v0 project:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Setup Steps

Run these SQL scripts **in order** in your Supabase SQL Editor:

### 1. Create Tables
**File:** `scripts/001_create_tables.sql`

This creates all the necessary database tables including:
- Plans (subscription tiers)
- Users
- Subscriptions
- Clients
- Invoices & Invoice Items
- Payment Entries
- Usage Logs
- Settings tables

### 2. Create RLS Policies
**File:** `scripts/002_rls_policies.sql`

This enables Row-Level Security (RLS) and creates policies that:
- Allow users to access only their own data
- Prevent unauthorized access to other users' records
- Enable proper security for invoice items (linked to parent invoices)

**Important:** This script is required for invoice creation to work!

### 3. Seed Initial Data
**File:** `scripts/003_seed_data.sql`

This populates:
- 4 subscription plans (Guest, Basic, Standard, Pro)
- Default invoice templates
- Global settings with usage limits

### 4. Create User Trigger
**File:** `scripts/004_create_user_trigger.sql`

This creates a trigger that automatically:
- Creates a user record when someone signs up via Supabase Auth
- Assigns the GUEST plan by default
- Creates an inactive subscription record

### 5. Fix Default Plan (if needed)
**File:** `scripts/005_fix_default_plan.sql`

Run this if you need to update the default plan assignment for new users.

### 6. Create Dashboard Views
**File:** `scripts/014_create_dashboard_views.sql`

This creates database views for the dashboard statistics:
- `dashboard_totals` - Aggregated stats (total invoices, clients, received amounts)
- `dashboard_pending_converted` - Pending invoice amounts

**Important:** These views are required for the dashboard stats cards to display data!

### 7. Create Invoice Workflow Views
**File:** `scripts/015_create_invoice_workflow_views.sql`

This creates database views for the invoice workflow columns:
- `dashboard_invoices_base` - Base invoice data with client information
- `invoice_payment_summary` - Payment calculations (total paid, remaining amounts)

**Important:** These views are required for the invoice workflow (Draft, Pending, Paid) to display data!

### 8. Create FX Tables
**File:** `scripts/016_create_fx_tables.sql`

This creates foreign exchange rate tables for currency conversion:
- `fx_rates` - Historical FX rates table
- `fx_latest_rates` - View for quick lookups of the latest rates
- Default rates for common currencies (USD, EUR, GBP, JPY, AUD, CAD)

**Important:** These tables are required for payment recording with currency conversion!

### 9. Add FX Fields to Payment Entries
**File:** `scripts/017_add_fx_fields_to_payments.sql`

This adds currency conversion fields to the payment_entries table:
- `payment_currency` - Currency of the invoice
- `fx_rate` - Exchange rate at time of payment
- `converted_amount` - Amount converted to dashboard currency
- `converted_currency` - Dashboard currency at time of payment

**Important:** These fields enable multi-currency payment tracking!

## Verification

After running all scripts, verify the setup:

1. **Check Tables:** All tables should exist with proper columns
2. **Check RLS:** Row-Level Security should be enabled on all user-facing tables
3. **Test Invoice Creation:** Try creating an invoice as a logged-in user
4. **Test Plans:** Verify all 4 plans exist in the plans table

## Troubleshooting

### "Row-level security policy violation"
- Make sure you've run `scripts/002_rls_policies.sql`
- Check that you're logged in when creating invoices

### "Column does not exist"
- Your table schema might be outdated
- Re-run `scripts/001_create_tables.sql` or manually add missing columns

### "Could not find table"
- The migration scripts haven't been run yet
- Run scripts 001-004 in order

## Column Name Reference

If you encounter column mismatch errors, use these correct column names:

**Invoices table:**
- `user_id`, `client_id`, `template_id`
- `invoice_number`, `status`, `currency`
- `issue_date`, `due_date`
- `subtotal`, `tax_total`, `discount_total`, `total`
- `notes`, `created_at`, `updated_at`

**Invoice Items table:**
- `invoice_id`, `description`, `quantity`
- `unit_price`, `tax_rate`, `line_total`
- `created_at`, `updated_at`
