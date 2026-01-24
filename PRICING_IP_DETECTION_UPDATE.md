# Pricing Page - IP-Based Country Detection Update

## Changes Made

### 1. IP Detection Logic (`/app/actions/pricing.ts`)
- **Updated `getPricingCountry()`** to use ONLY IP-based detection:
  - First tries `x-vercel-ip-country` header
  - Falls back to `cf-ipcountry` header  
  - Default fallback to 'US' if no headers found
  - Removed user settings/authentication check (pricing page is PUBLIC)
  
### 2. Enhanced Query Filtering
- Added `is_active` column filter to pricing queries
- Only returns active pricing plans
- Created migration script: `/scripts/013_add_is_active_to_pricing.sql`

### 3. Improved Fallback Logic
- If detected country has no pricing → automatically retry with 'US'
- Added comprehensive debug logging throughout the flow
- Console logs show:
  - Detected country code
  - Number of pricing rows returned
  - When US fallback is triggered
  - Any errors encountered

### 4. Billing Toggle Enhancement (`/components/pricing/billing-toggle.tsx`)
- Added `useEffect` to initialize yearly pricing on component mount
- Ensures yearly pricing is displayed by default
- Refactored toggle logic for better code organization

### 5. UI Improvements (`/app/(public)/pricing/page.tsx`)
- Improved error message styling and content
- Removed any references to country selectors
- Pricing page works entirely via IP detection

## Migration Required

**IMPORTANT:** Run the following migration before deploying:

```bash
# In Supabase SQL Editor or your database client
psql -f scripts/013_add_is_active_to_pricing.sql
```

Or execute directly in Supabase:
```sql
ALTER TABLE country_pricing 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

UPDATE country_pricing SET is_active = true WHERE is_active IS NULL;
```

## How It Works

1. User visits `/pricing`
2. Server reads IP headers (`x-vercel-ip-country` or `cf-ipcountry`)
3. Query `country_pricing` table for detected country with `is_active = true`
4. If no pricing found → automatically fallback to US pricing
5. Display pricing with yearly selected by default
6. All debug info logged to console

## Testing

To test different countries locally:
- Use Vercel preview deployments (automatic geo-detection)
- Or manually set headers in middleware/testing tools
- US pricing will always work as fallback

## Debug Console Logs

All logs are prefixed with `[v0]`:
- `[v0] Detected country from x-vercel-ip-country: XX`
- `[v0] Fetching pricing for country: XX`
- `[v0] Found N pricing rows for country: XX`
- `[v0] No pricing for XX - falling back to US pricing`

## No Country Selector

The pricing page does NOT have a country selector. Country selection is:
- **Pricing page:** Automatic via IP (public)
- **Signup page:** Manual selection during registration (will be implemented separately)
