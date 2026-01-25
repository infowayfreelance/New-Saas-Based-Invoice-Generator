# Invoice Workflow Implementation

This document describes the implementation of the invoice workflow feature that displays invoices in three columns (Draft, Pending, Paid) on the dashboard.

## Overview

The invoice workflow provides a visual representation of invoices at different stages:
- **Draft**: Invoices that haven't been sent yet
- **Pending**: Invoices awaiting payment (sent, partially paid, or overdue)
- **Paid**: Invoices that have been fully or partially paid

## Architecture

### Database Views

Two database views power the workflow feature:

#### 1. `dashboard_invoices_base`
Location: `scripts/015_create_invoice_workflow_views.sql`

This view joins invoices with client information:
\`\`\`sql
SELECT
  i.id,
  i.user_id,
  i.client_id,
  i.invoice_number,
  i.issue_date,
  i.status,
  i.total_amount,
  i.amount_paid,
  i.currency,
  c.name AS client_name
FROM invoices i
LEFT JOIN clients c ON i.client_id = c.id
\`\`\`

#### 2. `invoice_payment_summary`
Location: `scripts/015_create_invoice_workflow_views.sql`

This view calculates payment amounts:
\`\`\`sql
SELECT
  i.id AS invoice_id,
  i.user_id,
  i.total_amount,
  COALESCE(i.amount_paid, 0) AS total_paid,
  i.total_amount - COALESCE(i.amount_paid, 0) AS remaining_amount,
  payment_status
FROM invoices i
\`\`\`

### Server Actions

Location: `app/actions/dashboard.ts`

#### `getInvoiceWorkflowData(filter: DateFilter)`

Fetches invoice data for all three columns with the following features:
- Filters by authenticated user
- Applies date range filtering based on issue_date
- Returns invoices grouped by status
- Includes client names and payment calculations

**Data Returned:**
\`\`\`typescript
{
  draft: WorkflowInvoice[],      // status = 'DRAFT'
  pending: WorkflowInvoice[],    // status IN ('SENT', 'PARTIALLY_PAID', 'OVERDUE')
  paid: WorkflowInvoice[]        // status IN ('PAID', 'PARTIALLY_PAID'), limited to 10
}
\`\`\`

### UI Component

Location: `components/dashboard/invoice-workflow.tsx`

#### Draft Column
- Displays: Client name, invoice number, total amount
- Action button opens modal with:
  - Send Invoice (placeholder)
  - Download PDF (placeholder)

#### Pending Column
- Displays: Client name, invoice number, remaining amount
- Action button opens modal with:
  - Record Partial Payment (placeholder)
  - Record Full Payment (placeholder)

#### Paid Column
- Displays: Client name, invoice number, amount paid, status badge
- Read-only (no actions)
- Badge shows "Paid" or "Partial" based on status

## Features

### Date Filtering
All columns respect the date filter from the dashboard:
- This Month
- Last 30 Days
- Last 3 Months
- Last 6 Months
- Last Year
- Custom Range

### Status Logic

**Draft Invoices:**
- `status = 'DRAFT'`

**Pending Payments:**
- `status IN ('SENT', 'PARTIALLY_PAID', 'OVERDUE')`
- Shows remaining amount (not total)

**Paid Invoices:**
- `status IN ('PAID', 'PARTIALLY_PAID')`
- Shows total paid amount
- Limited to 10 most recent

### Responsive Design
- Desktop: 3 columns side-by-side
- Mobile: Stacked columns (full width)

## Action Modals

### Draft Actions
1. **Send Invoice** - Placeholder for email functionality
2. **Download PDF** - Placeholder for PDF generation

### Pending Actions
1. **Record Partial Payment** - Opens form modal (to be implemented)
2. **Record Full Payment** - Opens confirmation modal (to be implemented)

## Data Flow

\`\`\`
User Interaction
    ↓
Dashboard Client Component
    ↓
Invoice Workflow Component
    ↓
getInvoiceWorkflowData() Server Action
    ↓
Supabase Views (dashboard_invoices_base)
    ↓
Filter by user_id + date range
    ↓
Group by status
    ↓
Return formatted data
    ↓
Display in 3 columns
\`\`\`

## Setup Instructions

1. Run the database migration:
   \`\`\`sql
   scripts/015_create_invoice_workflow_views.sql
   \`\`\`

2. The views will be automatically used by the workflow component

3. Refresh the dashboard to see live data

## Error Handling

The component includes comprehensive error handling:
- Loading states with skeleton UI
- Error alerts for failed API calls
- Empty states for each column when no data exists
- Fallback for missing client names

## Future Enhancements

### Planned Features
1. **Send Invoice** - Email integration with invoice PDF
2. **Download PDF** - Generate and download invoice PDF
3. **Record Payment** - Full payment recording form with:
   - Amount input
   - Payment date
   - Payment method
   - Notes
4. **Drag & Drop** - Move invoices between columns
5. **Quick Actions** - Inline actions without modal
6. **Bulk Actions** - Select multiple invoices

### Performance Optimizations
- Implement pagination for columns with many invoices
- Add virtual scrolling for large datasets
- Cache workflow data with SWR

## Testing

### Manual Testing
1. Create draft invoices → Verify they appear in Draft column
2. Change status to SENT → Verify they move to Pending column
3. Record payment → Verify amount updates in Pending/Paid columns
4. Filter by date → Verify columns update correctly

### Edge Cases
- Invoice with missing client
- Invoice with zero amount
- Partially paid invoice appearing in both columns
- Custom date range with no invoices

## Troubleshooting

### "No data available"
- Verify database views exist
- Check user authentication
- Ensure invoices have valid issue_date

### "Failed to fetch workflow data"
- Check Supabase connection
- Verify RLS policies allow SELECT on views
- Check browser console for detailed errors

### Invoices not appearing
- Verify status matches column criteria
- Check date filter includes invoice issue_date
- Ensure invoice belongs to authenticated user

## Related Files

- `app/actions/dashboard.ts` - Server actions
- `components/dashboard/invoice-workflow.tsx` - UI component
- `components/dashboard/dashboard-client.tsx` - Parent component
- `scripts/015_create_invoice_workflow_views.sql` - Database views
- `DATABASE_SETUP_GUIDE.md` - Setup documentation
