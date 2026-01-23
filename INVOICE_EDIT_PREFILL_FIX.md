# Invoice Edit Page Prefill Fix

## Changes Made

### 1. Fixed Column Name Mapping in Edit Page
**File:** `/app/(app)/app/invoices/[id]/edit/page.tsx`
- Changed `discount_total` → `discount_amount` to match actual database schema
- Ensured `clientId` is explicitly passed in formData (already present)

### 2. Fixed Client Select Prefill Logic
**File:** `/components/invoice/invoice-form.tsx`
- Updated Select component to use nullish coalescing (`??`) for better null handling
- Fixed `handleClientSelect` to set `selectedClientId` to `null` (not "none" string) when no client is selected
- This ensures proper client prefill on edit and correct submission data

### 3. Fixed client_id Update Logic
**File:** `/app/actions/invoice.ts`
- Changed from conditional inclusion to always including `client_id` in update payload
- Properly handles three cases:
  - Valid client ID: saves the ID
  - "none" string: saves as null
  - null/undefined: saves as null
- Ensures client_id is never lost during update

## How It Works Now

1. **Loading Invoice**: Invoice is fetched with all columns including `client_id`
2. **Prefilling Form**: `clientId` is passed to InvoiceForm and sets `selectedClientId` state
3. **Select Component**: Uses `selectedClientId ?? "none"` to display correct selected value
4. **Client Selection**: When user selects a client, state updates and client fields auto-fill
5. **Clearing Client**: When "No client selected" is chosen, `selectedClientId` becomes `null`
6. **Submitting**: Form submits with correct `clientId` value (ID string, null, or "none")
7. **Updating Database**: Server action converts "none" to null and always includes `client_id` in update

## Expected Results
✅ Client dropdown shows correct selected client on edit page load
✅ Client info fields are prefilled correctly
✅ Changing client updates all fields properly
✅ Selecting "No client selected" clears fields
✅ client_id is preserved during update if unchanged
✅ client_id can be changed to null or different client
✅ No data loss during invoice updates
