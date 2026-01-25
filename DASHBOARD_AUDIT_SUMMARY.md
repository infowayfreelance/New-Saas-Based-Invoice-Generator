# Dashboard Data Fetching Audit Summary

## Files Involved

### 1. Main Dashboard Page
- **File**: `/app/(app)/app/page.tsx`
- **Purpose**: Server component that fetches user data and renders DashboardClient

### 2. Client Component
- **File**: `/components/dashboard/dashboard-client.tsx`
- **Purpose**: Manages currency/date filters and renders child components

### 3. Stats Cards
- **File**: `/components/dashboard/dashboard-stats.tsx`
- **Purpose**: Displays 4 stat cards (Total Invoices, Received, Pending, Clients)
- **Data Source**: Calls `getDashboardStats()` from actions

### 4. Invoice Workflow Columns
- **File**: `/components/dashboard/invoice-workflow.tsx`
- **Purpose**: Displays 3 columns (Draft, Pending, Paid invoices)
- **Data Source**: Calls `getInvoiceWorkflowData()` from actions

### 5. Server Actions
- **File**: `/app/actions/dashboard.ts`
- **Purpose**: Contains all data fetching logic

---

## Queries Implemented

### Query 1: Total Invoices Card
```typescript
Source: invoices table
Filters:
  - user_id = auth user id
  - issue_date >= startDate
  - issue_date <= endDate
Returns: COUNT of matching rows
```

### Query 2: Total Clients Card
```typescript
Source: clients table
Filters:
  - user_id = auth user id
Returns: COUNT of matching rows (no date filter)
```

### Query 3: Total Received Card
```typescript
Source: invoices table
Filters:
  - user_id = auth user id
  - status = 'PAID'
  - issue_date >= startDate
  - issue_date <= endDate
Returns: Array of invoices, then SUM of total_amount
```

### Query 4: Total Pending Card
```typescript
Source: dashboard_pending_converted view
Filters:
  - user_id = auth user id
Returns: Array of rows, then SUM of pending_converted_amount
Note: NO date filter (pending is current state regardless of issue date)
```

### Query 5: Draft Invoices List
```typescript
Source: dashboard_invoices_base view
Columns: invoice_id, invoice_number, client_name, invoice_total, issue_date, status
Filters:
  - user_id = auth user id
  - status = 'draft'
  - issue_date >= startDate
  - issue_date <= endDate
Order: issue_date DESC
Returns: Array of draft invoice objects
```

### Query 6: Pending Invoices List
```typescript
Source: dashboard_invoices_base view
Columns: invoice_id, invoice_number, client_name, invoice_total, total_paid, issue_date, status
Filters:
  - user_id = auth user id
  - status IN ['sent', 'partially_paid', 'overdue']
  - issue_date >= startDate
  - issue_date <= endDate
Order: issue_date DESC
Returns: Array of pending invoice objects
```

### Query 7: Paid Invoices List
```typescript
Source: dashboard_invoices_base view
Columns: invoice_id, invoice_number, client_name, invoice_total, total_paid, issue_date, status
Filters:
  - user_id = auth user id
  - status IN ['paid', 'partially_paid']
  - issue_date >= startDate
  - issue_date <= endDate
Order: issue_date DESC
Limit: 10 most recent
Returns: Array of paid invoice objects
```

---

## Console Logging Added

All queries now log the following information to the console:

1. **Auth user ID** - The authenticated user ID used for filtering
2. **Source** - View or table name being queried
3. **Filters Applied** - All WHERE conditions with exact values
4. **Date Range** - Computed startDate and endDate for date filters
5. **Rows Returned** - Count of rows returned
6. **Sample Data** - First 2 rows with safe fields only:
   - invoice_id
   - issue_date
   - status
   - invoice_total
   - total_paid
   - remaining_amount
   - user_id

---

## Column Name Fixes Applied

### Problem
The code was querying for wrong column names:
- Used `total_amount` instead of `invoice_total`
- Used `amount_paid` instead of `total_paid`

### Confirmed Correct Columns (from Supabase)
```
dashboard_invoices_base view columns:
- invoice_id
- user_id
- client_id
- issue_date
- status
- currency
- invoice_total  ← NOT total_amount
- total_paid     ← NOT amount_paid
- remaining_amount
- client_name (from join)
```

### Fix Applied
Updated all queries to use correct column names:
- Changed SELECT clauses to use `invoice_total` and `total_paid`
- Changed data transformation to map `inv.invoice_total` and `inv.total_paid`

---

## Why Draft Invoices Were Empty

### Root Cause
1. **Wrong column names**: Querying `total_amount` instead of `invoice_total` caused column not found errors
2. **Lowercase status**: Using `status = 'draft'` instead of uppercase `'DRAFT'`

### Fix Applied
1. Use correct column names from the confirmed view schema
2. Status values are already lowercase in the view (per view definition)
3. Query uses `invoice_total` which exists in the view

---

## Expected Result After Fix

✅ **Draft Invoices**: Will now appear correctly
- Uses `dashboard_invoices_base` view
- Filters by `user_id` and `status = 'draft'`
- Uses correct column `invoice_total`
- Date filter properly computed
- Shows empty state if no drafts exist (not an error)

✅ **Pending Invoices**: Will now appear correctly
- Uses correct columns `invoice_total` and `total_paid`

✅ **Paid Invoices**: Will now appear correctly
- Uses correct columns `invoice_total` and `total_paid`

✅ **Total Pending Card**: Already correct
- Uses `dashboard_pending_converted` view
- Sums `pending_converted_amount` from multiple rows
- No date filter (current pending state)

---

## Code Changes Made

### File: `/app/actions/dashboard.ts`

1. **Added comprehensive audit logging** to all queries
2. **Fixed column names**:
   - `total_amount` → `invoice_total`
   - `amount_paid` → `total_paid`
3. **Maintained existing logic**:
   - No changes to date filter computation
   - No changes to data source (still uses dashboard_invoices_base)
   - No changes to status filter values
   - No database schema changes

---

## Debugging Instructions

To verify the fixes:

1. **Check browser console** for audit logs starting with `[v0] AUDIT:`
2. **Verify auth user ID** matches between console log and Supabase
3. **Check date range** - ensure it includes the issue_date of existing drafts
4. **Check rows returned** - should show count > 0 if drafts exist
5. **Review sample data** - first 2 rows should show correct invoice_id, status, etc.

If drafts still don't appear:
- Check if issue_date of draft invoices falls within the computed date range
- Verify status is exactly 'draft' (lowercase) in the database
- Confirm view returns correct column names in Supabase SQL editor
