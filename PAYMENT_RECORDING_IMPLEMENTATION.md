# Payment Recording Implementation

This document explains the payment recording feature in the Invoice Generator dashboard.

## Overview

The payment recording system allows users to record partial or full payments for invoices directly from the dashboard workflow. The implementation includes:

1. **Multi-currency support** with FX conversion
2. **Partial and full payment** options
3. **Automatic invoice status updates** via database triggers
4. **Server-side FX rate lookup** for accurate conversions
5. **Comprehensive validation** and error handling

## Architecture

### Database Tables

#### 1. `fx_rates`
Stores historical foreign exchange rates for currency conversion.

**Columns:**
- `id` - UUID primary key
- `base_currency` - Source currency (e.g., "USD")
- `target_currency` - Destination currency (e.g., "EUR")
- `rate` - Exchange rate (DECIMAL 18,8)
- `rate_date` - Date of the rate
- `source` - Rate source (manual, api, system)
- `created_at`, `updated_at` - Timestamps

**View: `fx_latest_rates`**
A view that returns the latest rate for each currency pair.

#### 2. `payment_entries`
Extended with FX conversion fields:

**New Columns:**
- `payment_currency` - Currency of the invoice being paid
- `payment_reference` - Optional payment reference/transaction ID
- `fx_rate` - Exchange rate applied at payment time
- `fx_date` - Date the FX rate was applied
- `converted_amount` - Amount converted to dashboard currency
- `converted_currency` - Dashboard currency at time of payment

### Server Actions

#### `recordPayment(input: RecordPaymentInput)`
Main server action for recording payments.

**Flow:**
1. Authenticate user
2. Fetch invoice details (currency, amounts, ownership)
3. Get latest FX rate from `fx_rates` table
4. Calculate converted amount
5. Insert payment entry with all FX fields
6. Revalidate dashboard paths

**Parameters:**
\`\`\`typescript
interface RecordPaymentInput {
  invoiceId: string
  amount: number
  paymentDate: string
  paymentMethod?: string
  reference?: string
  dashboardCurrency: string
}
\`\`\`

**Response:**
\`\`\`typescript
{ success: true } | { error: string }
\`\`\`

#### `getFXRate(fromCurrency, toCurrency)`
Internal helper that fetches the latest exchange rate.

**Behavior:**
- Returns 1.0 for same-currency conversions
- Queries `fx_rates` table ordered by date and updated_at
- Fallback to 1.0 if rate not found
- Logs errors for debugging

#### `getInvoiceForPayment(invoiceId)`
Fetches invoice details for the payment modal.

**Returns:**
\`\`\`typescript
{
  id: string
  invoice_number: string
  currency: string
  total_amount: number
  amount_paid: number
  remaining_amount: number
  status: string
  client_name: string
}
\`\`\`

## UI Components

### `PaymentRecordModal`
A reusable modal for recording payments.

**Props:**
- `open` - Controls modal visibility
- `invoiceId` - Invoice to record payment for
- `invoiceNumber`, `clientName` - Display information
- `currency` - Invoice currency
- `remainingAmount` - Unpaid amount
- `dashboardCurrency` - User's current dashboard currency
- `paymentType` - "partial" or "full"
- `onSuccess` - Callback after successful payment

**Features:**
- Auto-fills amount for full payments
- Validates amount ranges
- Shows confirmation step for full payments
- Displays remaining amount
- Optional payment method and reference fields
- Loading states and error handling
- Toast notifications on success/error

### `InvoiceWorkflow` (Updated)
Enhanced to support payment recording:

**New State:**
- `paymentModalOpen` - Controls payment modal visibility
- `paymentType` - Current payment type selection

**New Handlers:**
- `handleRecordPayment(type)` - Opens payment modal with selected type
- `handlePaymentSuccess()` - Refreshes workflow data after payment
- `fetchWorkflowData()` - Extracted for reuse after payments

**Integration:**
- Triggers from "Record Partial Payment" and "Record Full Payment" buttons
- Passes invoice details to `PaymentRecordModal`
- Refreshes dashboard data on successful payment

## Workflow

### Recording a Partial Payment

1. User clicks "Actions" on a pending invoice
2. User clicks "Record Partial Payment"
3. Action dialog closes, payment modal opens
4. User enters:
   - Amount (validated < remaining)
   - Payment date (defaults to today)
   - Optional payment method
   - Optional reference/transaction ID
5. User clicks "Record Payment"
6. Server action:
   - Validates ownership and amount
   - Fetches FX rate for invoice currency → dashboard currency
   - Calculates converted amount
   - Inserts payment entry with FX data
7. Modal closes, success toast appears
8. Dashboard workflow refreshes automatically

### Recording a Full Payment

1. User clicks "Actions" on a pending invoice
2. User clicks "Record Full Payment"
3. Action dialog closes, payment modal opens
4. Amount is **auto-filled** with remaining amount
5. User reviews and optionally adds:
   - Payment date
   - Payment method
   - Reference
6. User clicks "Record Full Payment"
7. **Confirmation dialog** appears:
   - "Are you sure you want to record a full payment of $X?"
8. User clicks "Confirm Payment"
9. Server action processes (same as partial payment)
10. Invoice status updates to "PAID" via database trigger
11. Modal closes, workflow refreshes

## FX Rate Management

### Default Rates
The system includes default 1:1 rates for same-currency conversions:
- USD → USD
- EUR → EUR
- GBP → GBP
- JPY → JPY
- AUD → AUD
- CAD → CAD

### Sample Rates
Initial setup includes sample cross-currency rates:
- USD → EUR (0.92)
- USD → GBP (0.79)
- USD → JPY (149.50)
- EUR → USD (1.09)
- GBP → USD (1.27)

### Updating Rates
**Manual Update:**
\`\`\`sql
INSERT INTO fx_rates (base_currency, target_currency, rate, rate_date, source)
VALUES ('USD', 'EUR', 0.92, CURRENT_DATE, 'manual')
ON CONFLICT (base_currency, target_currency, rate_date) 
DO UPDATE SET rate = EXCLUDED.rate, updated_at = NOW();
\`\`\`

**Via API (Future):**
Integration with a currency API service would update rates automatically:
1. Scheduled job fetches latest rates
2. Inserts new rates with `source = 'api'`
3. `fx_latest_rates` view always returns the most recent rate

### Rate Lookup Priority
The `getFXRate` function queries in this order:
1. Latest rate by `rate_date DESC`
2. If multiple rates on same date, use `updated_at DESC`
3. Fallback to 1.0 if no rate found

## Validation Rules

### Amount Validation
- **Must be > 0**
- **Partial payments:** Amount < remaining_amount
- **Full payments:** Amount = remaining_amount (auto-filled)

### Authorization
- User must own the invoice
- Checked on server-side before processing

### Data Integrity
- Invoice ID must exist
- Client ID is copied from invoice
- Payment date defaults to today
- All FX fields are automatically calculated

## Error Handling

### Client-Side
- Form validation before submission
- Loading states during processing
- Error alerts displayed in modal
- Toast notifications for user feedback

### Server-Side
- Try-catch blocks around all DB operations
- Detailed error logging with `[v0]` prefix
- Graceful fallbacks for missing FX rates
- Authorization checks before mutations

### Common Errors
1. **"Invoice not found"** - Invalid invoice ID
2. **"Unauthorized"** - User doesn't own invoice
3. **"Failed to get FX rate"** - FX rate table missing
4. **"Failed to record payment"** - Database insert error
5. **"Partial payment must be less than remaining"** - Validation error

## Database Triggers (Not Implemented Here)

The system relies on existing database triggers to:
1. **Update `invoices.amount_paid`** when payment_entries are inserted
2. **Update `invoices.status`** based on payment totals:
   - PAID if amount_paid >= total_amount
   - PARTIALLY_PAID if amount_paid > 0 and < total_amount
   - SENT/OVERDUE otherwise

These triggers should be created separately to maintain data consistency.

## Setup Instructions

### 1. Run FX Rate Migrations
\`\`\`bash
# In Supabase SQL Editor:
scripts/016_create_fx_tables.sql
scripts/017_add_fx_fields_to_payments.sql
\`\`\`

### 2. Verify FX Rates Table
\`\`\`sql
SELECT * FROM fx_latest_rates;
\`\`\`

### 3. Test Payment Recording
1. Create a test invoice with status "SENT"
2. Navigate to dashboard
3. Click "Actions" on the invoice
4. Click "Record Partial Payment"
5. Enter amount and submit
6. Verify payment appears in `payment_entries` table
7. Verify FX fields are populated correctly

## Future Enhancements

### 1. Payment History View
Add a page to view all payment entries for an invoice:
- Payment date, amount, method
- Converted amounts and FX rates
- Payment references

### 2. Automatic FX Updates
Integrate with currency API:
- Scheduled job (daily/hourly)
- Update `fx_rates` table automatically
- Support more currency pairs

### 3. Payment Attachments
Allow users to attach receipts or confirmation documents to payments.

### 4. Payment Reminders
Automated email reminders for overdue invoices.

### 5. Bulk Payment Recording
Record multiple payments at once from a CSV import.

## API Integration Example

\`\`\`typescript
// Future: Fetch FX rates from external API
async function updateFXRatesFromAPI() {
  const response = await fetch('https://api.exchangerate.com/latest/USD')
  const data = await response.json()
  
  const supabase = createServiceClient()
  
  for (const [currency, rate] of Object.entries(data.rates)) {
    await supabase.from('fx_rates').insert({
      base_currency: 'USD',
      target_currency: currency,
      rate: rate,
      rate_date: new Date().toISOString().split('T')[0],
      source: 'api'
    })
  }
}
\`\`\`

## Testing Checklist

- [ ] Record partial payment with same currency
- [ ] Record partial payment with different currency
- [ ] Record full payment with confirmation
- [ ] Verify FX rate is fetched correctly
- [ ] Verify converted amount is calculated
- [ ] Verify invoice status doesn't update (relies on trigger)
- [ ] Verify dashboard refreshes after payment
- [ ] Test error handling (invalid amount, unauthorized)
- [ ] Test form validation (amount <= 0, amount >= remaining)
- [ ] Verify payment appears in payment_entries table

## Support

For issues or questions about payment recording:
1. Check server logs for `[v0]` prefixed errors
2. Verify FX tables exist and have data
3. Ensure payment_entries table has new FX columns
4. Check user authorization and invoice ownership
5. Review Supabase RLS policies for payment_entries
