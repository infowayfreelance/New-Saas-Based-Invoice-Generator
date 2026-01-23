# DATABASE SCHEMA RECONCILIATION REPORT

**Generated:** January 2026  
**Purpose:** Compare code usage vs actual Supabase schema  
**Status:** Analysis complete - migration plan ready

---

## METHODOLOGY

1. Source 1: `DATABASE_USAGE_AUDIT.md` - Every database interaction in code
2. Source 2: `scripts/001_create_tables.sql` - Actual Supabase schema definition
3. Source 3: `scripts/002_rls_policies.sql` - RLS verification
4. Source 4: `scripts/006_create_bank_accounts.sql` - Bank accounts table

---

## TABLE-BY-TABLE RECONCILIATION

### TABLE: users
- **Exists in Supabase:** YES
- **Schema Columns:** id, email, name, plan_id, role, stripe_customer_id, created_at, updated_at
- **Code → Supabase mismatches:**
  - Missing in Supabase: NONE
  - Extra in Supabase: NONE
  - Naming mismatches: NONE
- **Severity:** SAFE

---

### TABLE: plans
- **Exists in Supabase:** YES
- **Schema Columns:** id, name, code, price_monthly, invoice_limit_per_day, invoice_limit_per_month, features_json, created_at, updated_at
- **Code → Supabase mismatches:**
  - Missing in Supabase:
    - `paypal_plan_id` (used in app/actions/paypal.ts, app/(public)/pricing/page.tsx)
    - `features` (code uses `features` but schema has `features_json`)
    - `is_active` (used in app/(admin)/admin/plans/page.tsx)
  - Extra in Supabase:
    - `invoice_limit_per_day` (not used in code)
    - `invoice_limit_per_month` (not used in code)
  - Naming mismatches:
    - `features` (code) → `features_json` (schema)
- **Severity:** WARNING (PayPal integration broken, features field mismatch)

---

### TABLE: subscriptions
- **Exists in Supabase:** YES
- **Schema Columns:** id, user_id, provider, provider_customer_id, provider_subscription_id, status, current_plan_id, trial_ends_at, current_period_start, current_period_end, created_at, updated_at
- **Code → Supabase mismatches:**
  - Missing in Supabase: NONE (code uses `SELECT *` without specific columns)
  - Extra in Supabase: NONE
  - Naming mismatches: NONE
- **Severity:** SAFE

---

### TABLE: clients
- **Exists in Supabase:** YES
- **Schema Columns:** id, user_id, name, email, company_name, phone, address_line1, address_line2, city, state, postcode, country, notes, created_at, updated_at
- **Code → Supabase mismatches:**
  - Missing in Supabase:
    - `postal_code` (used in code)
    - `tax_id` (used in app/(app)/app/clients/new/page.tsx)
  - Extra in Supabase:
    - `postcode` (exists in schema)
    - `company_name` (exists in schema but not used in code)
  - Naming mismatches:
    - `postal_code` (code) → `postcode` (schema) - CRITICAL MISMATCH
- **Severity:** BLOCKER (postal_code vs postcode field mismatch will cause insert/update failures)

---

### TABLE: invoice_templates
- **Exists in Supabase:** YES
- **Schema Columns:** id, user_id, name, is_default, layout_config, primary_color, accent_color, logo_url, watermark_text, signature_url, min_plan, created_at, updated_at
- **Code → Supabase mismatches:**
  - Missing in Supabase: NONE (code only uses `SELECT *`)
  - Extra in Supabase: NONE
  - Naming mismatches: NONE
- **Severity:** SAFE

---

### TABLE: invoices
- **Exists in Supabase:** YES
- **Schema Columns:** id, user_id, client_id, invoice_number, status, issue_date, due_date, currency, subtotal, tax_amount, discount_amount, total_amount, amount_paid, notes, terms, template_id, client_name, client_email, client_address, from_name, from_email, from_address, sent_at, paid_at, created_at, updated_at
- **Code → Supabase mismatches:**
  - Missing in Supabase:
    - `tax_total` (used in app/actions/invoice.ts)
    - `discount_total` (used in app/actions/invoice.ts)
    - `total` (used throughout code)
    - `tax_rate` (used in app/api/recurring/run/route.ts)
    - `discount` (used in app/api/recurring/run/route.ts)
  - Extra in Supabase:
    - `tax_amount` (exists in schema)
    - `discount_amount` (exists in schema)
    - `total_amount` (exists in schema)
  - Naming mismatches:
    - `tax_total` (code) → `tax_amount` (schema)
    - `discount_total` (code) → `discount_amount` (schema)
    - `total` (code) → `total_amount` (schema)
- **Severity:** BLOCKER (field name mismatches will break invoice creation)

---

### TABLE: invoice_items
- **Exists in Supabase:** YES
- **Schema Columns:** id, invoice_id, description, quantity, unit_price, tax_rate, total, sort_order, created_at, updated_at
- **Code → Supabase mismatches:**
  - Missing in Supabase:
    - `user_id` (used in app/actions/invoice.ts, app/api/recurring/run/route.ts)
    - `line_total` (used in app/actions/invoice.ts)
    - `amount` (used in app/api/recurring/run/route.ts)
  - Extra in Supabase:
    - `total` (exists but code uses `line_total` or `amount`)
  - Naming mismatches:
    - `line_total` (invoice creation) → `total` (schema)
    - `amount` (recurring cron) → `total` (schema)
- **Severity:** BLOCKER (field mismatches + missing user_id FK)

---

### TABLE: recurring_invoice_rules
- **Exists in Supabase:** YES
- **Schema Columns:** id, user_id, client_id, base_invoice_id, frequency, day_of_month, auto_send, auto_reminder_days, next_run_date, is_active, created_at, updated_at
- **Code → Supabase mismatches:**
  - Missing in Supabase:
    - `next_run_at` (TIMESTAMPTZ - used in code)
    - `active` (BOOLEAN - used in code)
  - Extra in Supabase:
    - `next_run_date` (DATE - exists in schema)
    - `is_active` (BOOLEAN - exists in schema)
  - Naming mismatches:
    - `next_run_at` (code) → `next_run_date` (schema)
    - `active` (code) → `is_active` (schema)
- **Severity:** BLOCKER (field mismatches will break recurring invoice cron)

---

### TABLE: payment_entries
- **Exists in Supabase:** YES
- **Schema Columns:** id, user_id, invoice_id, client_id, amount, payment_date, payment_method, note, created_at, updated_at
- **Code → Supabase mismatches:**
  - Missing in Supabase:
    - `reference_number` (used in app/(app)/app/payments/record/page.tsx)
    - `notes` (used in app/(app)/app/payments/record/page.tsx)
  - Extra in Supabase:
    - `note` (singular - exists in schema)
  - Naming mismatches:
    - `notes` (plural in code) → `note` (singular in schema)
- **Severity:** WARNING (reference_number missing, notes vs note mismatch)

---

### TABLE: usage_logs
- **Exists in Supabase:** YES
- **Schema Columns:** id, user_id, ip_address, date, month, invoices_today, invoices_this_month, last_invoice_at, created_at, updated_at
- **Code → Supabase mismatches:**
  - Missing in Supabase: NONE
  - Extra in Supabase: NONE
  - Naming mismatches: NONE
- **Severity:** SAFE

---

### TABLE: user_settings
- **Exists in Supabase:** YES
- **Schema Columns:** id, user_id, default_currency, theme, default_reply_to_email, company_name, company_address, company_tax_id, invoice_start_number, invoice_prefix, created_at, updated_at
- **Code → Supabase mismatches:**
  - Missing in Supabase:
    - `full_name` (used in app/(app)/app/settings/company/page.tsx)
    - `business_name` (used in app/(app)/app/settings/company/page.tsx)
    - `email` (used in app/(app)/app/settings/company/page.tsx)
    - `phone` (used in app/(app)/app/settings/company/page.tsx)
    - `address_line1` (used in app/(app)/app/settings/company/page.tsx)
    - `address_line2` (used in app/(app)/app/settings/company/page.tsx)
    - `city` (used in app/(app)/app/settings/company/page.tsx)
    - `state` (used in app/(app)/app/settings/company/page.tsx)
    - `postal_code` (used in app/(app)/app/settings/company/page.tsx)
    - `country` (used in app/(app)/app/settings/company/page.tsx)
    - `currency` (used in app/(app)/app/settings/company/page.tsx)
    - `timezone` (used in app/(app)/app/settings/company/page.tsx)
  - Extra in Supabase:
    - `default_currency` (not used in code)
    - `default_reply_to_email` (not used in code)
    - `company_name`, `company_address`, `company_tax_id`, `invoice_start_number`, `invoice_prefix` (exist but not used)
  - Naming mismatches: NONE
- **Severity:** BLOCKER (12 critical columns missing - company settings page completely broken)

---

### TABLE: user_email_settings
- **Exists in Supabase:** YES
- **Schema Columns:** id, user_id, use_system_email, reply_to_email, sending_domain, domain_verified, smtp_host, smtp_port, smtp_user, smtp_password, smtp_use_ssl, smtp_enabled, created_at, updated_at
- **Code → Supabase mismatches:**
  - Missing in Supabase: NONE
  - Extra in Supabase: Many SMTP fields not used in code
  - Naming mismatches: NONE
- **Severity:** SAFE

---

### TABLE: bank_accounts
- **Exists in Supabase:** YES
- **Schema Columns:** id, user_id, account_name, bank_name, account_number, routing_number, swift_code, currency, is_default, created_at, updated_at
- **Code → Supabase mismatches:**
  - Missing in Supabase: NONE
  - Extra in Supabase: NONE
  - Naming mismatches: NONE
- **Severity:** SAFE (fully functional, temporarily hidden in UI)

---

### TABLE: global_settings
- **Exists in Supabase:** YES
- **Schema Columns:** id, free_guest_daily_limit, free_guest_monthly_limit, basic_daily_limit, basic_monthly_limit, min_affiliate_payout, features_json, created_at, updated_at
- **Code → Supabase mismatches:**
  - Missing in Supabase: NONE
  - Extra in Supabase: NONE (all columns properly used in lib/utils/usage.ts)
  - Naming mismatches: NONE
- **Severity:** SAFE

---

### TABLE: integration_settings
- **Exists in Supabase:** YES
- **Schema Columns:** id, key, value, category, created_at, updated_at
- **Code → Supabase mismatches:**
  - Missing in Supabase: NONE
  - Extra in Supabase: NONE
  - Naming mismatches: NONE
- **Severity:** SAFE

---

## ADDITIONAL ISSUES

### 1. Payment Status Enum Case Inconsistency
- **Location:** app/(app)/app/payments/record/page.tsx line 87
- **Issue:** Updates invoice status to lowercase "paid" but enum is uppercase "PAID"
- **Schema:** CREATE TYPE invoice_status AS ENUM ('DRAFT', 'SENT', 'PAID', 'PARTIALLY_PAID', 'OVERDUE')
- **Severity:** WARNING (will fail database constraint)

### 2. Join Relationships Not Defined in Schema
- **admin/invoices/page.tsx:** `.select("*, user:users(email, name)")`
- **admin/clients/page.tsx:** `.select("*, user:users(email, name)")`
- **app/payments/page.tsx:** `.select("*, invoice:invoices(*), client:clients(*)")`
- **Issue:** Code uses Supabase implicit joins but foreign key names may not match
- **Severity:** WARNING (queries may fail silently)

---

## FINAL MIGRATION PLAN

### TABLES THAT MUST BE CREATED
- NONE (all referenced tables exist)

### COLUMNS THAT MUST BE ADDED

#### clients table:
- ADD `tax_id TEXT`
- ADD `postal_code TEXT` (then migrate data from `postcode`)

#### invoices table:
- ADD `tax_total DECIMAL(12, 2)` (alias or migrate from `tax_amount`)
- ADD `discount_total DECIMAL(12, 2)` (alias or migrate from `discount_amount`)
- ADD `total DECIMAL(12, 2)` (alias or migrate from `total_amount`)
- ADD `tax_rate DECIMAL(5, 2)`
- ADD `discount DECIMAL(12, 2)`

#### invoice_items table:
- ADD `user_id UUID REFERENCES users(id)` (critical for RLS)
- ADD `line_total DECIMAL(12, 2)` (alias or migrate from `total`)
- ADD `amount DECIMAL(12, 2)` (alternative name used by recurring cron)

#### recurring_invoice_rules table:
- ADD `next_run_at TIMESTAMPTZ` (migrate from `next_run_date`)
- ADD `active BOOLEAN` (alias or migrate from `is_active`)

#### payment_entries table:
- ADD `reference_number TEXT`
- ADD `notes TEXT` (then optionally migrate from `note`)

#### plans table:
- ADD `paypal_plan_id TEXT`
- ADD `features JSONB` (alias for `features_json`)
- ADD `is_active BOOLEAN DEFAULT TRUE`

#### user_settings table (CRITICAL):
- ADD `full_name TEXT`
- ADD `business_name TEXT`
- ADD `email TEXT`
- ADD `phone TEXT`
- ADD `address_line1 TEXT`
- ADD `address_line2 TEXT`
- ADD `city TEXT`
- ADD `state TEXT`
- ADD `postal_code TEXT`
- ADD `country TEXT`
- ADD `currency TEXT DEFAULT 'USD'`
- ADD `timezone TEXT DEFAULT 'UTC'`

### COLUMNS THAT MUST BE RENAMED
NONE (prefer adding aliased columns to avoid data migration risks)

### COLUMNS THAT MAY BE REMOVED (LOW PRIORITY)
- `clients.postcode` (after migrating to `postal_code`)
- `invoices.tax_amount` (after aliasing to `tax_total`)
- `invoices.discount_amount` (after aliasing to `discount_total`)
- `invoices.total_amount` (after aliasing to `total`)
- `invoice_items.total` (after aliasing to `line_total`)
- `recurring_invoice_rules.next_run_date` (after migrating to `next_run_at`)
- `recurring_invoice_rules.is_active` (after aliasing to `active`)
- `payment_entries.note` (after migrating to `notes`)

### CRITICAL FIXES REQUIRED IN CODE
1. **app/(app)/app/payments/record/page.tsx line 87:**
   - Change: `.update({ status: "paid" })`
   - To: `.update({ status: "PAID" })`

2. **All invoice creation/update code:**
   - Standardize on either schema names OR add aliases
   - Recommend: Add columns to schema to match code

3. **Invoice items user_id:**
   - Must add `user_id` FK to `invoice_items` table
   - Update all insert statements to include `user_id`

---

## RISK ASSESSMENT

### BLOCKER Issues (Must fix before deployment):
1. `clients.postal_code` vs `postcode` mismatch
2. `invoices` field name mismatches (tax_total, discount_total, total)
3. `invoice_items.user_id` missing column
4. `invoice_items.line_total` vs `total` mismatch
5. `recurring_invoice_rules.next_run_at` vs `next_run_date` mismatch
6. `user_settings` missing 12 critical columns

### WARNING Issues (Fix soon):
1. `plans.paypal_plan_id` missing (PayPal integration broken)
2. `plans.features` vs `features_json` mismatch
3. `payment_entries.reference_number` missing
4. Payment status case inconsistency

### SAFE Issues (Working correctly):
1. All other tables properly aligned
2. RLS policies correctly implemented
3. Indexes properly created

---

## RECOMMENDED APPROACH

### Option A: Add Missing Columns (RECOMMENDED)
- Add all missing columns to match code expectations
- Keep existing columns for backward compatibility
- Zero code changes required
- Safe for production

### Option B: Refactor Code
- Update all code to match schema exactly
- Requires extensive testing
- Risk of introducing bugs
- NOT RECOMMENDED for production system

### Option C: Hybrid
- Add critical missing columns (user_settings, invoice_items.user_id)
- Use database views/aliases for naming mismatches
- Fix enum case issues in code
- Moderate risk, balanced approach

---

## NEXT STEPS

1. Review this reconciliation report
2. Choose migration approach (recommend Option A)
3. Generate migration SQL script
4. Test in development environment
5. Deploy to production
6. Verify all features working

---

**Report Complete**  
**Total Tables Analyzed:** 15  
**Critical Issues Found:** 6 BLOCKERS, 4 WARNINGS  
**Recommendation:** Execute Option A migration immediately
