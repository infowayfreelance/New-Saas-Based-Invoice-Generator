# Pricing Page Debug Checklist

## What Was Changed

### ✅ Fixed Query to Match Schema
- Query now uses EXACT columns from `country_pricing` table
- Removed references to non-existent `is_active` column
- Removed references to non-existent `plan_id` field
- Proper join with `currencies` table

### ✅ Added Comprehensive Logging
- Every step of data fetch is logged with `[v0]` prefix
- Shows detected country, row counts, sample data
- Logs fallback attempts and results
- Critical errors include database check commands

### ✅ Enhanced Error UI
- Visual debug alert when no data loads
- Shows exactly what to check in logs
- Provides database queries to run manually

## How to Use Debug Logs

1. **Open browser console or server logs**
2. **Look for the log sequence:**

\`\`\`
[v0] ======================================
[v0] PRICING PAGE DATA FETCH
[v0] ======================================
\`\`\`

3. **Check each step:**

| Step | What It Shows | What to Look For |
|------|---------------|------------------|
| Step 1 | Country detection | Should be 2-letter code (e.g., "US") |
| Step 2 | Primary query | Row count > 0 for US |
| Step 3 | Fallback (if needed) | Only runs if Step 2 = 0 rows |
| Sample row | Data structure | Should show all fields: country_code, plan_code, currency_code, etc. |
| Plan codes | Which plans returned | Should be: BASIC, STANDARD, PRO |

## Quick Database Checks

### 1. Check if table exists
\`\`\`sql
SELECT COUNT(*) FROM country_pricing;
\`\`\`
**Expected:** At least 3 rows

### 2. Check US pricing exists
\`\`\`sql
SELECT * FROM country_pricing WHERE country_code = 'US';
\`\`\`
**Expected:** 3 rows (BASIC, STANDARD, PRO)

### 3. Check join works
\`\`\`sql
SELECT cp.*, c.symbol 
FROM country_pricing cp
INNER JOIN currencies c ON cp.currency_code = c.code
WHERE cp.country_code = 'US';
\`\`\`
**Expected:** 3 rows with `symbol` field populated

### 4. Check currencies table
\`\`\`sql
SELECT * FROM currencies WHERE code = 'USD';
\`\`\`
**Expected:** 1 row with symbol = '$'

## Common Issues & Solutions

### Issue: "Row count: 0" in logs

**Cause:** No data in country_pricing table

**Solution:**
\`\`\`sql
-- Run seed data script
-- File: /scripts/010_create_country_pricing.sql
INSERT INTO country_pricing (country_code, country_name, plan_code, plan_name, currency_code, price_amount, price_yearly) VALUES
  ('US', 'United States', 'BASIC', 'Basic', 'USD', 5.00, 48.00),
  ('US', 'United States', 'STANDARD', 'Standard', 'USD', 12.00, 115.20),
  ('US', 'United States', 'PRO', 'Pro', 'USD', 29.99, 287.90);
\`\`\`

### Issue: Join error with currencies

**Cause:** currencies table missing or no USD row

**Solution:**
\`\`\`sql
-- File: /scripts/009_create_currencies.sql
INSERT INTO currencies (code, name, symbol) VALUES
  ('USD', 'US Dollar', '$');
\`\`\`

### Issue: Query error in logs

**Cause:** Column name mismatch

**Solution:** 
- Check that query uses: `country_code, country_name, plan_code, plan_name, currency_code, price_amount, price_yearly`
- Do NOT query: `is_active, plan_id, price_monthly`

### Issue: No logs at all

**Cause:** Supabase connection or environment variables

**Solution:**
1. Check `.env` or environment variables
2. Verify `NEXT_PUBLIC_SUPABASE_URL`
3. Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Debug UI Elements

### When data loads successfully
- Shows 4 pricing cards (Guest + 3 paid plans)
- "Most Popular" badge on Standard plan
- Currency and country displayed at bottom

### When data fails to load
- Red debug alert box at top
- Lists what to check in logs
- Provides database query to run
- Shows "Pricing Information Unavailable" message

## Next Steps After Fix

1. **Verify logs show successful fetch**
2. **Verify all 3 plans render on page**
3. **Test IP detection** from different locations (Vercel preview)
4. **Remove debug UI** alert once confirmed working
5. **Optional:** Run migration to add `is_active` column

## Files Changed

- `/app/actions/pricing.ts` - Fixed query, added logging
- `/app/(public)/pricing/page.tsx` - Added debug UI and logging
- `/components/pricing/billing-toggle.tsx` - Fixed yearly default
- `/PRICING_IP_DETECTION_UPDATE.md` - Documentation
- `/scripts/013_add_is_active_to_pricing.sql` - Optional migration
