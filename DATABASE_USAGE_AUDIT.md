# DATABASE USAGE AUDIT - COMPLETE CODEBASE MAP

**Generated:** January 2026  
**Purpose:** Single source of truth for all database interactions  
**Status:** Read-only audit - no code changes made

---

## AUTH & SESSION HANDLING

### Table: `users`
**File:** `app/(admin)/layout.tsx`
- **Columns:** `role`
- **Query Type:** SELECT
- **Details:** `.select("role").eq("id", user.id).single()`

**File:** `app/(app)/app/subscription/page.tsx`
- **Columns:** `id`, `email`, `name`, `plan_id`
- **Query Type:** SELECT
- **Details:** `.select("id, email, name, plan_id").eq("id", user.id).single()`

**File:** `app/(app)/app/settings/profile/page.tsx`
- **Columns:** `name`
- **Query Type:** SELECT + UPDATE
- **Details:** 
  - SELECT: `.select("name").eq("id", user.id).single()`
  - UPDATE: `.update({ name }).eq("id", user.id)`

**File:** `app/actions/admin.ts`
- **Columns:** `role`, `plan_id`, `updated_at`
- **Query Type:** SELECT + UPDATE
- **Details:** 
  - SELECT: `.select("role").eq("id", user.id).single()`
  - UPDATE role: `.update({ role, updated_at }).eq("id", userId)`
  - UPDATE plan: `.update({ plan_id, updated_at }).eq("id", userId)`

**File:** `app/actions/stripe.ts`
- **Columns:** `stripe_customer_id`, `email`
- **Query Type:** SELECT + UPDATE
- **Details:**
  - SELECT: `.select("stripe_customer_id, email").eq("id", user.id).single()`
  - UPDATE: `.update({ stripe_customer_id }).eq("id", user.id)`

**File:** `app/(app)/billing/success/page.tsx`
- **Columns:** `plan_id`
- **Query Type:** UPDATE
- **Details:** `.update({ plan_id }).eq("id", user.id)`

**File:** `app/api/webhooks/stripe/route.ts`
- **Columns:** `id`, `plan_id`, `stripe_customer_id`
- **Query Type:** SELECT + UPDATE
- **Details:**
  - SELECT by stripe_customer_id: `.select("id").eq("stripe_customer_id", customerId).single()`
  - UPDATE plan_id: `.update({ plan_id }).eq("id", user.id)`

**File:** `app/api/webhooks/paypal/route.ts`
- **Columns:** `plan_id`
- **Query Type:** UPDATE
- **Details:** `.update({ plan_id: guestPlan.id }).eq("id", subscription.user_id)`

**File:** `lib/utils/usage.ts`
- **Columns:** `id`, `plan` (with join to plans table)
- **Query Type:** SELECT
- **Details:** `.select("*, plan:plans(*)").eq("id", userId).maybeSingle()`

---

## SIDEBAR USER PROFILE

### Table: `users`
**File:** `components/app/sidebar.tsx`
- **Columns:** `*` (all columns), `plan` (joined)
- **Query Type:** SELECT
- **Details:** `.select("*, plan:plans(*)").eq("id", authUser.id).maybeSingle()`

---

## DASHBOARD STATS

### Table: `users`
**File:** `app/(app)/app/page.tsx`
- **Columns:** `*`, `plan` (joined)
- **Query Type:** SELECT
- **Details:** `.select("*, plan:plans(*)").eq("id", user.id).single()`

### Table: `invoices`
**File:** `app/(app)/app/page.tsx`
- **Columns:** `id`, `total`, `status`, `*` (for recent list)
- **Query Type:** SELECT (count + aggregation)
- **Details:**
  - Count: `.select("id", { count: "exact" }).eq("user_id", user.id)`
  - Paid total: `.select("total").eq("user_id", user.id).eq("status", "PAID")`
  - Pending: `.select("total").eq("user_id", user.id).eq("status", "PENDING")`
  - Recent: `.select("*").eq("user_id", user.id).order("created_at", desc).limit(5)`

### Table: `clients`
**File:** `app/(app)/app/page.tsx`
- **Columns:** `id`
- **Query Type:** SELECT (count)
- **Details:** `.select("id", { count: "exact" }).eq("user_id", user.id)`

### Table: `usage_logs`
**File:** `app/(app)/app/page.tsx`
- **Columns:** `*`
- **Query Type:** SELECT
- **Details:** `.select("*").eq("user_id", user.id).eq("date", today).maybeSingle()`

### Table: `users` (Admin Dashboard)
**File:** `app/(admin)/admin/page.tsx`
- **Columns:** `*`, `id`, `email`, `name`, `created_at`, `role`
- **Query Type:** SELECT (count + list)
- **Details:**
  - Count: `.select("*", { count: "exact", head: true })`
  - List: `.select("id, email, name, created_at, role").order("created_at", desc).limit(10)`

### Table: `invoices` (Admin Dashboard)
**File:** `app/(admin)/admin/page.tsx`
- **Columns:** `*`, `total`, `status`, `id`, `invoice_number`, `created_at`
- **Query Type:** SELECT (count + aggregation)
- **Details:**
  - Count: `.select("*", { count: "exact", head: true })`
  - Paid total: `.select("total").eq("status", "PAID")`
  - Recent: `.select("id, invoice_number, total, status, created_at").order("created_at", desc).limit(10)`

### Table: `subscriptions` (Admin Dashboard)
**File:** `app/(admin)/admin/page.tsx`
- **Columns:** `*`, `*` (with relationships)
- **Query Type:** SELECT (count + list)
- **Details:**
  - Count: `.select("*", { count: "exact", head: true })`
  - List: `.select("*").order("created_at", desc).limit(10)`

---

## INVOICE LIST PAGE

### Table: `invoices`
**File:** `app/(app)/app/invoices/page.tsx`
- **Columns:** `*`
- **Query Type:** SELECT
- **Details:** `.select("*").eq("user_id", user.id).order("created_at", { ascending: false })`
- **Filters:** Status filter applied dynamically

**File:** `app/(admin)/admin/invoices/page.tsx` (Admin)
- **Columns:** `*`, `user` (joined - but NOT GUARANTEED TO EXIST)
- **Query Type:** SELECT
- **Details:** `.select("*, user:users(email, name)").order("created_at", desc)`
- **⚠️ FLAG:** Join to `user:users(email, name)` - relationship may not be defined in schema

**File:** `app/(app)/app/clients/[id]/page.tsx` (Client detail)
- **Columns:** `*`
- **Query Type:** SELECT
- **Details:** `.select("*").eq("client_id", id).eq("user_id", user.id).order("created_at", desc)`

**File:** `components/invoice/invoice-list-actions.tsx`
- **Usage:** References invoice data but doesn't query directly

---

## INVOICE DETAIL / PREVIEW PAGE

### Table: `invoices`
**File:** `app/(app)/app/invoices/[id]/page.tsx`
- **Columns:** `*`
- **Query Type:** SELECT
- **Details:** `.select("*").eq("id", id).eq("user_id", user.id).single()`

### Table: `invoice_items`
**File:** `app/(app)/app/invoices/[id]/page.tsx`
- **Columns:** `*`
- **Query Type:** SELECT
- **Details:** `.select("*").eq("invoice_id", id).order("created_at", { ascending: true })`

### Table: `clients`
**File:** `app/(app)/app/invoices/[id]/page.tsx`
- **Columns:** `*` (all columns including name, email, address fields)
- **Query Type:** SELECT
- **Details:** `.select("*").eq("id", invoice.client_id).single()` (if client_id exists)

### Table: `user_settings`
**File:** `app/(app)/app/invoices/[id]/page.tsx`
- **Columns:** `*`
- **Query Type:** SELECT
- **Details:** `.select("*").eq("user_id", user.id).single()`

---

## INVOICE CREATE PAGE

### Table: `user_settings`
**File:** `app/(app)/app/invoices/new/page.tsx`
- **Columns:** `*`
- **Query Type:** SELECT
- **Details:** `.select("*").eq("user_id", user.id).maybeSingle()`

### Table: `clients` (For dropdown)
**File:** `components/invoice/invoice-form.tsx`
- **Columns:** `*`
- **Query Type:** SELECT
- **Details:** `.select("*").eq("user_id", user.id).order("name")`

### Table: `invoices` (On submit)
**File:** `app/actions/invoice.ts`
- **Columns:** `user_id`, `client_id`, `invoice_number`, `status`, `issue_date`, `due_date`, `currency`, `subtotal`, `tax_total`, `discount_total`, `total`, `notes`
- **Query Type:** INSERT
- **Details:** `.insert({...}).select().single()`

### Table: `invoice_items` (On submit)
**File:** `app/actions/invoice.ts`
- **Columns:** `invoice_id`, `user_id`, `description`, `quantity`, `unit_price`, `tax_rate`, `line_total`
- **Query Type:** INSERT
- **Details:** `.insert(itemsToInsert)`
- **Rollback:** If insert fails, invoice is deleted

---

## INVOICE EDIT PAGE

### Table: `invoices`
**File:** `app/(app)/app/invoices/[id]/page.tsx` (same as detail page)
- **Columns:** `*`
- **Query Type:** SELECT
- **Details:** See Invoice Detail section above

### Table: `invoice_items`
**File:** `app/(app)/app/invoices/[id]/page.tsx`
- **Columns:** `*`
- **Query Type:** SELECT
- **Details:** See Invoice Detail section above

**Note:** Actual UPDATE logic not found in codebase - may be TODO

---

## INVOICE ITEMS CRUD

### Table: `invoice_items`
**File:** `app/actions/invoice.ts` (Create)
- **Columns:** `invoice_id`, `user_id`, `description`, `quantity`, `unit_price`, `tax_rate`, `line_total`
- **Query Type:** INSERT
- **Details:** `.insert(itemsToInsert)` during invoice creation

**File:** `app/api/recurring/run/route.ts` (Recurring create)
- **Columns:** `invoice_id`, `user_id`, `description`, `quantity`, `unit_price`, `amount`, `sort_order`
- **Query Type:** INSERT
- **Details:** `.insert(items)` when cloning from base invoice
- **⚠️ FLAG:** Uses `amount` field which may differ from `line_total`

**Note:** No explicit UPDATE or DELETE operations found for individual items

---

## CLIENTS LIST PAGE

### Table: `clients`
**File:** `app/(app)/app/clients/page.tsx`
- **Columns:** `*`
- **Query Type:** SELECT
- **Details:** `.select("*").eq("user_id", user.id).order("created_at", { ascending: false })`

**File:** `app/(admin)/admin/clients/page.tsx` (Admin)
- **Columns:** `*`, `user` (joined - but relationship may not be defined)
- **Query Type:** SELECT
- **Details:** `.select("*, user:users(email, name)").order("created_at", desc)`
- **⚠️ FLAG:** Join to `user:users(email, name)` - relationship may not be defined in schema

### Table: `invoices` (For client stats)
**File:** `app/(app)/app/clients/page.tsx`
- **Columns:** `client_id`
- **Query Type:** SELECT
- **Details:** `.select("client_id").eq("user_id", user.id).in("client_id", clientIds)`

### Table: `users` (For plan check)
**File:** `app/(app)/app/clients/page.tsx`
- **Columns:** `*`, `plan` (joined)
- **Query Type:** SELECT
- **Details:** `.select("*, plan:plans(*)").eq("id", user.id).single()`

---

## CLIENT CREATE PAGE

### Table: `clients`
**File:** `app/(app)/app/clients/new/page.tsx`
- **Columns:** `user_id`, `name`, `email`, `phone`, `address_line1`, `address_line2`, `city`, `state`, `postal_code`, `country`, `tax_id`, `notes`
- **Query Type:** INSERT
- **Details:** `.insert(insertPayload).select().single()`

---

## CLIENT EDIT PAGE

### Table: `clients`
**File:** `app/(app)/app/clients/[id]/edit/page.tsx`
- **Columns:** `*`
- **Query Type:** SELECT + UPDATE + DELETE
- **Details:**
  - SELECT: `.select("*").eq("id", params.id).eq("user_id", user.id).single()`
  - UPDATE: `.update(updateData).eq("id", params.id).eq("user_id", user.id)`
  - DELETE: `.delete().eq("id", params.id).eq("user_id", user.id)`

**File:** `app/(app)/app/clients/[id]/page.tsx` (Detail view)
- **Columns:** `*`
- **Query Type:** SELECT
- **Details:** `.select("*").eq("id", id).eq("user_id", user.id).single()`

---

## COMPANY SETTINGS PAGE

### Table: `user_settings`
**File:** `app/(app)/app/settings/company/page.tsx`
- **Columns:** `user_id`, `full_name`, `business_name`, `email`, `phone`, `address_line1`, `address_line2`, `city`, `state`, `postal_code`, `country`, `currency`, `timezone`
- **Query Type:** SELECT + UPSERT
- **Details:**
  - SELECT: `.select("*").eq("user_id", user.id).single()`
  - UPSERT: `.upsert({...}, { onConflict: "user_id" })`

**⚠️ CRITICAL FLAG:** Previously referenced non-existent columns:
- ❌ `company_name` (DOES NOT EXIST)
- ❌ `company_tax_id` (DOES NOT EXIST)
- ❌ `company_address` (DOES NOT EXIST)
- ❌ `default_currency` (DOES NOT EXIST)
- ❌ `invoice_prefix` (DOES NOT EXIST)
- ❌ `invoice_start_number` (DOES NOT EXIST)

**FIXED:** Now only uses actual schema columns listed above

---

## PROFILE SETTINGS PAGE

### Table: `users`
**File:** `app/(app)/app/settings/profile/page.tsx`
- **Columns:** `name`
- **Query Type:** SELECT + UPDATE
- **Details:** See Auth & Session section above

---

## EMAIL SETTINGS PAGE

### Table: `user_email_settings`
**File:** `app/(app)/app/settings/email/page.tsx`
- **Columns:** `user_id`, `reply_to_email`
- **Query Type:** SELECT + UPDATE
- **Details:**
  - SELECT: `.select("*").eq("user_id", user.id).single()`
  - UPDATE: `.update({ reply_to_email }).eq("user_id", user.id)`

**⚠️ FLAG:** Table `user_email_settings` may not exist in schema - verify

---

## BRANDING SETTINGS PAGE

### Table: `user_settings`
**File:** `app/(app)/app/settings/branding/page.tsx`
- **Columns:** `theme`
- **Query Type:** SELECT + UPDATE
- **Details:**
  - SELECT: `.select("theme").eq("user_id", user.id).single()`
  - UPDATE: `.update({ theme }).eq("user_id", user.id)`

---

## SUBSCRIPTION PAGE

### Table: `users`
**File:** `app/(app)/app/subscription/page.tsx`
- **Columns:** `id`, `email`, `name`, `plan_id`
- **Query Type:** SELECT
- **Details:** `.select("id, email, name, plan_id").eq("id", user.id).single()`

### Table: `plans`
**File:** `app/(app)/app/subscription/page.tsx`
- **Columns:** `*`
- **Query Type:** SELECT
- **Details:** `.select("*").order("price_monthly", { ascending: true })`

### Table: `subscriptions`
**File:** `app/(app)/app/subscription/page.tsx`
- **Columns:** `*`
- **Query Type:** SELECT
- **Details:** `.select("*").eq("user_id", user.id).maybeSingle()`

**File:** `app/(admin)/admin/subscriptions/page.tsx` (Admin)
- **Columns:** `*` (with relationships - may not be defined)
- **Query Type:** SELECT
- **Details:** `.select("*").order("created_at", desc)`

---

## TEMPLATES PAGE

### Table: `users`
**File:** `app/(app)/app/templates/page.tsx`
- **Columns:** `*`, `plan` (joined)
- **Query Type:** SELECT
- **Details:** `.select("*, plan:plans(*)").eq("id", user.id).single()`

### Table: `invoice_templates`
**File:** `app/(app)/app/templates/page.tsx`
- **Columns:** `*`
- **Query Type:** SELECT
- **Details:** `.select("*").eq("user_id", user.id).order("created_at", desc)`

**⚠️ FLAG:** Table `invoice_templates` referenced but may not exist in schema

---

## RECURRING INVOICES

### Table: `recurring_invoice_rules`
**File:** `app/(app)/app/recurring/page.tsx`
- **Columns:** `*`, `client` (joined)
- **Query Type:** SELECT
- **Details:** `.select("*, client:clients(id, name)").eq("user_id", user.id).order("created_at", desc)`

**File:** `app/(app)/app/recurring/[id]/page.tsx`
- **Columns:** `*`, `client` (joined)
- **Query Type:** SELECT + UPDATE + DELETE
- **Details:**
  - SELECT: `.select("*, client:clients(id,name)").eq("id", id).eq("user_id", user.id).single()`
  - UPDATE: `.update(patch).eq("id", id).eq("user_id", user.id)`
  - DELETE: `.delete().eq("id", id).eq("user_id", user.id)`

**File:** `app/(app)/app/recurring/new/page.tsx`
- **Columns:** `user_id`, `client_id`, `base_invoice_id`, `frequency`, `day_of_month`, `next_run_at`, `active`, `auto_send`
- **Query Type:** INSERT
- **Details:** `.insert(payload)`

**File:** `app/api/recurring/run/route.ts` (Cron job)
- **Columns:** `*`, `active`, `next_run_at`, `day_of_month`, `updated_at`
- **Query Type:** SELECT + UPDATE
- **Details:**
  - SELECT: `.select("*").eq("active", true).lte("next_run_at", today)`
  - UPDATE: `.update({ next_run_at, updated_at }).eq("id", r.id)`

### Table: `clients` (For recurring)
**File:** `app/(app)/app/recurring/new/page.tsx`
- **Columns:** `id`, `name`
- **Query Type:** SELECT
- **Details:** `.select("id,name").eq("user_id", user.id).order("name")`

**File:** `app/api/recurring/run/route.ts`
- **Columns:** `*`
- **Query Type:** SELECT
- **Details:** `.select("*").eq("id", r.client_id).single()`

### Table: `invoices` (For recurring dropdown)
**File:** `app/(app)/app/recurring/new/page.tsx`
- **Columns:** `id`, `invoice_number`
- **Query Type:** SELECT
- **Details:** `.select("id,invoice_number").eq("user_id", user.id).order("created_at", desc)`

**File:** `app/api/recurring/run/route.ts` (Cron creates invoices)
- **Columns:** `user_id`, `client_id`, `invoice_number`, `issue_date`, `due_date`, `currency`, `tax_rate`, `discount`, `notes`, `terms`, `status`, `subtotal`, `tax_amount`, `total`
- **Query Type:** INSERT
- **Details:** `.insert(invoiceData).select().single()`

---

## BANK ACCOUNTS

### Table: `bank_accounts`
**File:** `app/(app)/app/accounts/page.tsx`
- **Columns:** `*`
- **Query Type:** SELECT
- **Details:** `.select("*").eq("user_id", user.id).order("created_at", desc)`

**File:** `app/(app)/app/accounts/[id]/page.tsx`
- **Columns:** `*`
- **Query Type:** SELECT
- **Details:** `.select("*").eq("id", params.id).eq("user_id", user.id).single()`

**File:** `app/(app)/app/accounts/new/page.tsx`
- **Columns:** None (just checks user plan)
- **Query Type:** None

**File:** `app/actions/accounts.ts`
- **Columns:** `user_id`, `account_name`, `bank_name`, `account_number`, `routing_number`, `swift_code`, `currency`, `is_default`, `updated_at`
- **Query Type:** INSERT + UPDATE + DELETE
- **Details:**
  - INSERT: `.insert(payload).select().single()`
  - UPDATE default flag: `.update({ is_default: false }).eq("user_id", user.id).eq("is_default", true)`
  - UPDATE account: `.update(patch).eq("id", accountId).eq("user_id", user.id)`
  - DELETE: `.delete().eq("id", accountId).eq("user_id", user.id)`

**File:** `components/accounts/new-account-form.tsx` + `components/accounts/edit-account-form.tsx`
- **Usage:** Client-side forms, no direct DB queries

**⚠️ NOTE:** Bank accounts feature temporarily hidden in sidebar - table exists and is functional

---

## PAYMENT ENTRIES

### Table: `payment_entries`
**File:** `app/(app)/app/payments/page.tsx`
- **Columns:** `*`, includes relationships (invoice, client details)
- **Query Type:** SELECT
- **Details:** `.select("*, invoice:invoices(*), client:clients(*)").eq("user_id", user.id).order("payment_date", desc)`
- **⚠️ FLAG:** Relationships may not be defined in schema

**File:** `app/(app)/app/payments/record/page.tsx`
- **Columns:** `user_id`, `invoice_id`, `amount`, `payment_date`, `payment_method`, `reference_number`, `notes`
- **Query Type:** INSERT
- **Details:** `.insert({...})`

### Table: `invoices` (Payment recording)
**File:** `app/(app)/app/payments/record/page.tsx`
- **Columns:** `*` (for dropdown), `status` (for update)
- **Query Type:** SELECT + UPDATE
- **Details:**
  - SELECT: `.select("*").eq("user_id", user.id).eq("status", "SENT").order("due_date", asc)`
  - UPDATE: `.update({ status: "paid" }).eq("id", formData.invoice_id)`

**⚠️ FLAG:** Status value "paid" (lowercase) but elsewhere uses "PAID" (uppercase) - inconsistency

---

## PLANS TABLE

### Table: `plans`
**File:** `app/(admin)/admin/plans/page.tsx`
- **Columns:** `*`, `name`, `code`, `price_monthly`, `features` (JSON), `is_active`
- **Query Type:** SELECT + UPDATE
- **Details:**
  - SELECT: `.select("*").order("price_monthly", { ascending: true })`
  - UPDATE: `.update({ name, code, price_monthly, features, is_active }).eq("id", planId)`

**File:** `app/(public)/pricing/page.tsx`
- **Usage:** Fetches plans from database (specific query not in file)

**File:** `app/(admin)/admin/users/[id]/page.tsx`
- **Columns:** `*`
- **Query Type:** SELECT
- **Details:** `.select("*").order("price_monthly", { ascending: true })`

**File:** `app/actions/admin.ts`
- **Columns:** `id`, `code`
- **Query Type:** SELECT
- **Details:** `.select("id, code").eq("id", planId).single()`

**File:** `app/actions/invoice.ts`
- **Columns:** `*` (via users join)
- **Query Type:** SELECT (joined)
- **Details:** Selected via `users.select("*, plan:plans(*)")`

**File:** `app/(app)/billing/success/page.tsx`
- **Columns:** `id`, `code`
- **Query Type:** SELECT
- **Details:** `.select("id").eq("code", planSlug.toUpperCase()).single()`

**File:** `app/api/webhooks/stripe/route.ts`
- **Columns:** `id`, `code`
- **Query Type:** SELECT
- **Details:** `.select("id").eq("code", planCode).single()`

**File:** `app/api/webhooks/paypal/route.ts`
- **Columns:** `id`, `code`
- **Query Type:** SELECT
- **Details:** `.select("id").eq("code", "GUEST").single()`

**File:** `app/actions/paypal.ts`
- **Columns:** `paypal_plan_id`, `id`, `name`, `code`, `price_monthly`
- **Query Type:** SELECT + UPDATE
- **Details:**
  - SELECT: `.select("paypal_plan_id").eq("code", planCode).single()`
  - UPDATE: `.update({ paypal_plan_id }).eq("code", planCode)`

---

## WEBHOOKS - STRIPE

### Table: `users`
**File:** `app/api/webhooks/stripe/route.ts`
- **Columns:** `id`, `plan_id`, `stripe_customer_id`
- **Query Type:** SELECT + UPDATE
- **Details:** See Stripe webhook section in Auth & Session above

### Table: `plans`
**File:** `app/api/webhooks/stripe/route.ts`
- **Columns:** `id`, `code`
- **Query Type:** SELECT
- **Details:** Looks up plan by code (BASIC, STANDARD, PRO, GUEST)

### Table: `subscriptions`
**File:** `app/api/webhooks/stripe/route.ts`
- **Columns:** `user_id`, `provider`, `provider_customer_id`, `provider_subscription_id`, `status`, `current_plan_id`, `current_period_start`, `current_period_end`
- **Query Type:** UPSERT + UPDATE
- **Details:**
  - UPSERT on checkout: `.upsert({...})`
  - UPDATE on subscription change: `.update({ status, current_period_start, current_period_end }).eq("provider_subscription_id", subscription.id)`
  - UPDATE on cancellation: `.update({ status: "CANCELED" }).eq("provider_subscription_id", subscription.id)`

**Events handled:**
- `checkout.session.completed` → Creates/updates subscription
- `customer.subscription.updated` → Updates subscription status and period
- `customer.subscription.deleted` → Cancels subscription, downgrades to GUEST
- `invoice.payment_succeeded` → Logged only
- `invoice.payment_failed` → Logged only

---

## WEBHOOKS - PAYPAL

### Table: `subscriptions`
**File:** `app/api/webhooks/paypal/route.ts`
- **Columns:** `status`, `updated_at`, `user_id`, `provider_subscription_id`, `payment_provider`
- **Query Type:** SELECT + UPDATE
- **Details:**
  - SELECT: `.select("user_id").eq("provider_subscription_id", subscriptionId).eq("payment_provider", "paypal").single()`
  - UPDATE status: `.update({ status, updated_at }).eq("provider_subscription_id", subscriptionId).eq("payment_provider", "paypal")`

### Table: `users`
**File:** `app/api/webhooks/paypal/route.ts`
- **Columns:** `plan_id`
- **Query Type:** UPDATE
- **Details:** `.update({ plan_id: guestPlan.id }).eq("id", subscription.user_id)` (on cancel/expire)

### Table: `plans`
**File:** `app/api/webhooks/paypal/route.ts`
- **Columns:** `id`, `code`
- **Query Type:** SELECT
- **Details:** `.select("id").eq("code", "GUEST").single()` (to downgrade users)

**Events handled:**
- `BILLING.SUBSCRIPTION.ACTIVATED` → Sets subscription ACTIVE
- `BILLING.SUBSCRIPTION.CANCELLED` → Cancels subscription, downgrades to GUEST
- `BILLING.SUBSCRIPTION.SUSPENDED` → Sets subscription PAST_DUE
- `BILLING.SUBSCRIPTION.EXPIRED` → Expires subscription, downgrades to GUEST
- `PAYMENT.SALE.COMPLETED` → Confirms subscription active

**File:** `app/(app)/billing/paypal/success/page.tsx`
- **Columns:** `current_plan_id`, `status`, `plan_id`
- **Query Type:** SELECT + UPDATE
- **Details:**
  - SELECT: `.select("current_plan_id").eq("user_id", user.id).single()`
  - UPDATE subscription: `.update({ current_plan_id, status: "ACTIVE" }).eq("user_id", user.id)`
  - UPDATE user: `.update({ plan_id }).eq("id", user.id)`

---

## BACKGROUND / CRON JOBS

### Recurring Invoice Generation
**File:** `app/api/recurring/run/route.ts`
- **Endpoint:** `/api/recurring/run`
- **Auth:** Optional CRON_SECRET header check
- **Trigger:** Vercel Cron job (see `vercel.json`)

**Tables accessed:**
1. **`recurring_invoice_rules`**
   - SELECT: Active rules where `next_run_at <= today`
   - UPDATE: Sets next run date after processing

2. **`clients`**
   - SELECT: Gets client details for invoice

3. **`invoices`**
   - SELECT: Gets base invoice template (if specified)
   - SELECT: Gets last invoice number for sequence
   - INSERT: Creates new recurring invoice

4. **`invoice_items`**
   - INSERT: Clones items from base invoice

**Process:**
1. Finds due recurring rules
2. For each rule, creates new invoice from template
3. Auto-generates invoice number (INV-####)
4. Clones items from base invoice if exists
5. Updates rule's next_run_at to next month
6. Status is DRAFT unless auto_send is true

---

## GLOBAL SETTINGS

### Table: `global_settings`
**File:** `app/(admin)/admin/settings/page.tsx`
- **Columns:** `*`, `free_guest_daily_limit`, `free_guest_monthly_limit`, etc.
- **Query Type:** SELECT + UPDATE
- **Details:**
  - SELECT: `.select("*").single()`
  - UPDATE: `.update({...}).eq("id", settings.id)`

**File:** `lib/utils/usage.ts`
- **Columns:** `*`, specifically `free_guest_daily_limit`, `free_guest_monthly_limit`
- **Query Type:** SELECT
- **Details:** `.select("*").maybeSingle()` (gracefully handles missing table)

**⚠️ FLAG:** Table may not exist - usage.ts has fallback to defaults

---

## USAGE TRACKING

### Table: `usage_logs`
**File:** `lib/utils/usage.ts`
- **Columns:** `user_id`, `ip_address`, `date`, `month`, `invoices_today`, `invoices_this_month`, `last_invoice_at`
- **Query Type:** SELECT + INSERT + UPDATE
- **Details:**
  - SELECT guest: `.select("*").eq("ip_address", ipAddress).eq("date", today).is("user_id", null).maybeSingle()`
  - SELECT user: `.select("*").eq("user_id", userId).eq("date", today).maybeSingle()`
  - INSERT: `.insert({...})` (creates new log entry)
  - UPDATE: `.update({ invoices_today, invoices_this_month, last_invoice_at }).eq("id", existing.id)`

**File:** `app/(app)/app/page.tsx` (Dashboard usage display)
- **Columns:** `*`
- **Query Type:** SELECT
- **Details:** `.select("*").eq("user_id", user.id).eq("date", today).maybeSingle()`

**Usage Tracking Logic:**
- Guest users: Tracked by IP address, `user_id` is NULL
- Logged-in users: Tracked by `user_id`
- Daily and monthly counters incremented on each invoice creation
- Limits enforced before invoice creation in `checkUsageLimits()`

---

## ADMIN USER MANAGEMENT

### Table: `users`
**File:** `app/(admin)/admin/users/page.tsx`
- **Columns:** `*`, `id`, `email`, `name`, `role`, `plan_id`, `created_at`, with joins to plans
- **Query Type:** SELECT
- **Details:** `.select("*, plan:plans(*)").order("created_at", desc)`

**File:** `app/(admin)/admin/users/[id]/page.tsx`
- **Columns:** `*`, `plan_id`, `role`, with plans join
- **Query Type:** SELECT + UPDATE
- **Details:**
  - SELECT: `.select("*, plan:plans(*)").eq("id", userId).single()`
  - UPDATE role: `.update({ role }).eq("id", userId)`
  - UPDATE plan: `.update({ plan_id }).eq("id", userId)`

### Table: `clients` (User detail page)
**File:** `app/(admin)/admin/users/[id]/page.tsx`
- **Columns:** `*`
- **Query Type:** SELECT
- **Details:** `.select("*").eq("user_id", userId).order("created_at", desc)`

### Table: `invoices` (User detail page)
**File:** `app/(admin)/admin/users/[id]/page.tsx`
- **Columns:** `*`, with client join
- **Query Type:** SELECT
- **Details:** `.select("*, client:clients(name)").eq("user_id", userId).order("created_at", desc)`

---

## ANALYTICS PAGE

### Table: `users`
**File:** `app/(app)/app/analytics/page.tsx`
- **Columns:** `*`, `plan` (joined)
- **Query Type:** SELECT
- **Details:** `.select("*, plan:plans(*)").eq("id", user.id).single()`

### Table: `invoices`
**File:** `app/(app)/app/analytics/page.tsx`
- **Columns:** `total`, `status`, `created_at`
- **Query Type:** SELECT (aggregation)
- **Details:**
  - Total revenue: `.select("total, status").eq("user_id", user.id).eq("status", "PAID")`
  - Outstanding: `.select("total, status").eq("user_id", user.id).in("status", ["SENT", "OVERDUE"])`
  - Monthly trend: `.select("total, status, created_at").eq("user_id", user.id).eq("status", "PAID").gte("created_at", sixMonthsAgo)`

### Table: `clients`
**File:** `app/(app)/app/analytics/page.tsx`
- **Columns:** `*` (count only)
- **Query Type:** SELECT (count)
- **Details:** `.select("*", { count: "exact", head: true }).eq("user_id", user.id)`

---

## AUTHENTICATION ACTIONS

### Table: `users`
**File:** `app/actions/auth.ts`
- **Details:** Uses Supabase Auth APIs, not direct table queries
- Auth operations: `signUp`, `signInWithPassword`, `signOut`, `getUser`

**File:** `app/(public)/register/page.tsx`
- **Details:** Calls Supabase Auth `signUp` method
- Creates auth user, then trigger creates users table record (see `scripts/004_create_user_trigger.sql`)

**File:** `app/(public)/login/page.tsx`
- **Details:** Calls Supabase Auth `signInWithPassword` method

**File:** `app/auth/callback/route.ts`
- **Details:** Handles OAuth callback, exchanges code for session

---

## CRITICAL FINDINGS & FLAGS

### ⚠️ SCHEMA MISMATCHES FOUND:

1. **company_settings page** (FIXED)
   - ❌ Referenced: `company_name`, `company_tax_id`, `company_address`, `default_currency`, `invoice_prefix`, `invoice_start_number`
   - ✅ These columns DO NOT EXIST in `user_settings` table
   - ✅ **STATUS:** CORRECTED in current codebase

2. **invoice_items inconsistency**
   - `app/actions/invoice.ts` uses: `line_total`
   - `app/api/recurring/run/route.ts` uses: `amount`
   - **FLAG:** Verify which field actually exists in schema

3. **payment_entries status casing**
   - `app/(app)/app/payments/record/page.tsx` sets invoice status to `"paid"` (lowercase)
   - Most other code uses `"PAID"` (uppercase)
   - **FLAG:** Verify correct status enum values

4. **Relationships not guaranteed:**
   - `invoices.user:users(email, name)` - used in admin pages
   - `payment_entries` with joins to `invoice:invoices(*)` and `client:clients(*)`
   - `clients.user:users(email, name)` - used in admin pages
   - **FLAG:** These foreign key relationships may not be defined in DB schema

5. **Tables that may not exist:**
   - `user_email_settings` - referenced in email settings page
   - `invoice_templates` - referenced in templates page
   - `global_settings` - has fallback logic, but existence uncertain

6. **Recurring invoice field name change:**
   - Code uses `active` but may have been `is_active` in earlier schema
   - Code uses `next_run_at` but may have been `next_run_date` in earlier schema
   - **STATUS:** Current code appears updated

---

## SUMMARY STATISTICS

**Total Tables Referenced:** 16
1. users
2. plans
3. invoices
4. invoice_items
5. clients
6. user_settings
7. user_email_settings (⚠️ may not exist)
8. subscriptions
9. bank_accounts
10. recurring_invoice_rules
11. payment_entries
12. usage_logs
13. global_settings (⚠️ may not exist)
14. invoice_templates (⚠️ may not exist)

**Total Files with DB Queries:** 60+

**Query Type Distribution:**
- SELECT: ~90 locations
- INSERT: ~15 locations
- UPDATE: ~35 locations
- UPSERT: ~5 locations
- DELETE: ~5 locations

**Most Queried Tables:**
1. `users` (~30 queries)
2. `invoices` (~25 queries)
3. `clients` (~20 queries)
4. `subscriptions` (~15 queries)
5. `plans` (~15 queries)

---

**END OF AUDIT**

This document represents a complete audit of all database interactions in the codebase as of the current commit. Use this as the single source of truth for database schema alignment and query verification.
