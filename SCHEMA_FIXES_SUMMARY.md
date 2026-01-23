# Schema Fixes Summary

## Overview
Fixed all references to non-existent or misnamed database columns to match the actual Supabase schema.

## Files Changed

### 1. `/app/(app)/app/clients/[id]/edit/page.tsx`
**Changes:**
- Renamed `form.postcode` → `form.postal_code` throughout (state variable, form field name, database update)
- Fixed all 4 references to ensure consistency with Supabase `clients.postal_code` column

**Impact:** Client edit form now correctly reads and writes `postal_code` field

---

### 2. `/app/(app)/app/settings/company/page.tsx`
**Major Rewrite:**
- Removed non-existent fields:
  - `company_name` → `business_name`
  - `company_address` → `address_line1`, `address_line2`, `city`, `state`, `postal_code`, `country`
  - `company_phone` → `phone`
  - `company_tax_id` → removed (doesn't exist in schema)
  - `default_currency` → `currency`
  - `invoice_prefix` → removed (doesn't exist)
  - `invoice_start_number` → removed (doesn't exist)
  - `default_reply_to_email` → `email`

- Added actual `user_settings` fields:
  - `full_name`
  - `business_name`
  - `email`
  - `phone`
  - `address_line1`
  - `address_line2`
  - `city`
  - `state`
  - `postal_code`
  - `country`
  - `currency`
  - `timezone`

- Changed update to use `upsert()` and reload data after save for verification

**Impact:** Company Settings page now reads/writes actual database fields and displays correct business information

---

### 3. `/app/(app)/app/invoices/[id]/page.tsx`
**Changes:**
- Removed references to:
  - `userSettings.company_name` → `userSettings.business_name` or `userSettings.full_name`
  - `userSettings.company_address` → composed from `address_line1`, `address_line2`, `city`, `state`, `postal_code`, `country`
  - `userSettings.company_phone` → `userSettings.phone`
  - `userSettings.default_reply_to_email` → `userSettings.email`

- Built proper sender address block from individual address fields
- Added phone and email to address block formatting

**Impact:** Invoice preview now correctly displays sender information from user_settings

---

### 4. `/app/(app)/app/invoices/new/page.tsx`
**Changes:**
- Updated initial invoice data loading to use actual `user_settings` fields:
  - `business_name` / `full_name` for sender name
  - Composed address from `address_line1`, `address_line2`, `city`, `state`, `postal_code`, `country`
  - `phone` and `email` for contact info
  - `currency` instead of `default_currency`
  - Removed invoice prefix/number loading (fields don't exist)

**Impact:** New invoice form initializes with correct user business information

---

### 5. `/lib/types.ts`
**Changes:**

**Subscription interface:**
- Removed non-existent fields:
  - `provider`
  - `provider_customer_id`
  - `provider_subscription_id`
  - `current_plan_id`
  - `trial_ends_at`
  - `current_period_start`
  - `current_period_end`

- Updated to match actual schema:
  - `plan_id` (nullable)
  - `started_at` (nullable)
  - `ends_at` (nullable)

**UserSettings interface:**
- Removed non-existent fields:
  - `default_currency`
  - `default_reply_to_email`
  - `company_name`
  - `company_address`
  - `company_tax_id`
  - `invoice_start_number`
  - `invoice_prefix`

- Updated to match actual schema:
  - `currency`
  - `timezone`
  - `full_name`
  - `business_name`
  - `email`
  - `phone`
  - `address_line1`
  - `address_line2`
  - `city`
  - `state`
  - `postal_code`
  - `country`

**Impact:** TypeScript types now match actual database schema, preventing type errors

---

### 6. `/app/(app)/app/accounts/page.tsx`
**Changes:**
- Replaced entire page content with "Coming Soon" message
- Commented out original functionality that depends on non-existent `bank_accounts` table
- Updated message to indicate feature is coming soon
- Changed CTA to link back to Invoices page instead of upgrade

**Impact:** Accounts page no longer tries to query non-existent `bank_accounts` table

---

### 7. `/components/app/sidebar.tsx`
**Changes:**
- Commented out "Accounts" navigation item with note explaining bank_accounts table doesn't exist yet
- Keeps code in place for when table is created

**Impact:** Accounts navigation hidden from sidebar, preventing users from accessing incomplete feature

---

## Known Issues NOT Fixed

The following files still reference wrong subscription fields but were NOT changed due to payment provider integration complexity:

### Stripe Integration Files:
- `/app/api/webhooks/stripe/route.ts` - uses `provider_subscription_id`, `current_plan_id`, `current_period_start`, `current_period_end`
- `/app/actions/stripe.ts` - may reference old subscription fields
- `/app/(app)/billing/success/page.tsx` - uses `provider_subscription_id`, `current_plan_id`, `current_period_start`, `current_period_end`

### PayPal Integration Files:
- `/app/api/webhooks/paypal/route.ts` - uses `provider_subscription_id`
- `/app/actions/paypal.ts` - uses `provider_subscription_id`, `current_plan_id`
- `/app/(app)/billing/paypal/success/page.tsx` - uses `provider_subscription_id`, `current_plan_id`, `current_period_start`, `current_period_end`

### Admin Files:
- `/app/actions/admin.ts` - uses `current_plan_id`
- `/app/(admin)/admin/subscriptions/page.tsx` - uses `current_period_end`

**Reason Not Fixed:** These files implement critical payment workflows. Changing subscription schema requires:
1. Database migration to alter `subscriptions` table structure
2. Updating ALL payment webhook handlers
3. Testing payment flows end-to-end
4. Risk of breaking active subscriptions

**Recommendation:** Create separate migration task to update subscription schema and payment integration code together.

---

## Testing Recommendations

1. **Client Management:**
   - Create new client with postal code
   - Edit existing client and verify postal code saves
   - Verify postal code displays correctly

2. **Company Settings:**
   - Visit Settings → Company page
   - Verify all fields load from database
   - Update fields and save
   - Verify changes persist after page reload

3. **Invoice Creation:**
   - Create new invoice
   - Verify sender information auto-fills correctly from company settings
   - Verify address formatting is correct

4. **Invoice Preview:**
   - View existing invoice
   - Verify sender block shows business name, address, phone, email correctly
   - Verify client information still displays

5. **Accounts Page:**
   - Navigate to /app/accounts
   - Verify "Coming Soon" message displays
   - Verify no database errors in console

---

## Next Steps

1. **Option A: Hide subscription/payment features** until schema is migrated
2. **Option B: Create migration script** to update subscriptions table and all payment integration code
3. **Option C: Create bank_accounts table** following the structure expected by accounts page code
