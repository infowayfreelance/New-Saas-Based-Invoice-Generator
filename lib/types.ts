export type UserRole = "USER" | "ADMIN"
export type PlanCode = "GUEST" | "BASIC" | "STANDARD" | "PRO"
export type SubscriptionStatus = "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED" | "INACTIVE"
export type InvoiceStatus = "DRAFT" | "SENT" | "PAID" | "PARTIALLY_PAID" | "OVERDUE"
export type RecurringFrequency = "MONTHLY"
export type ThemePreference = "LIGHT" | "DARK" | "SYSTEM"

export interface User {
  id: string
  email: string
  name: string | null
  plan_id: string | null
  role: UserRole
  stripe_customer_id: string | null
  created_at: string
  updated_at: string
}

export interface Plan {
  id: string
  name: string
  code: PlanCode
  price_monthly: number
  invoice_limit_per_day: number | null
  invoice_limit_per_month: number | null
  features_json: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  plan_id: string | null
  status: SubscriptionStatus
  started_at: string | null
  ends_at: string | null
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  user_id: string
  name: string
  email: string | null
  company_name: string | null
  phone: string | null
  address_line1: string | null
  address_line2: string | null
  city: string | null
  state: string | null
  postal_code: string | null
  country: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  user_id: string | null
  client_id: string | null
  invoice_number: string
  status: InvoiceStatus
  issue_date: string
  due_date: string
  currency: string
  subtotal: number
  tax_amount: number
  discount_amount: number
  total_amount: number
  amount_paid: number
  notes: string | null
  terms: string | null
  template_id: string | null
  client_name: string | null
  client_email: string | null
  client_address: string | null
  from_name: string | null
  from_email: string | null
  from_address: string | null
  sent_at: string | null
  paid_at: string | null
  created_at: string
  updated_at: string
}

export interface InvoiceItem {
  id: string
  invoice_id: string
  description: string
  quantity: number
  unit_price: number
  tax_rate: number
  total: number
  sort_order: number
  created_at: string
  updated_at: string
}

export interface InvoiceTemplate {
  id: string
  user_id: string | null
  name: string
  is_default: boolean
  layout_config: Record<string, unknown>
  primary_color: string
  accent_color: string
  logo_url: string | null
  watermark_text: string | null
  signature_url: string | null
  min_plan: PlanCode
  created_at: string
  updated_at: string
}

export interface UsageLog {
  id: string
  user_id: string | null
  ip_address: string | null
  date: string
  month: string
  invoices_today: number
  invoices_this_month: number
  last_invoice_at: string | null
  created_at: string
  updated_at: string
}

export interface UserSettings {
  id: string
  user_id: string
  currency: string
  timezone: string
  full_name: string | null
  business_name: string | null
  email: string | null
  phone: string | null
  address_line1: string | null
  address_line2: string | null
  city: string | null
  state: string | null
  postal_code: string | null
  country: string | null
  theme: ThemePreference
  created_at: string
  updated_at: string
}

export interface RecurringInvoiceRule {
  id: string
  user_id: string
  client_id: string
  base_invoice_id: string | null
  frequency: RecurringFrequency
  day_of_month: number
  auto_send: boolean
  reminder_days: string | null
  next_run_at: string | null // Changed from next_run_date to next_run_at
  active: boolean
  created_at: string
  updated_at: string
}

export interface PaymentEntry {
  id: string
  user_id: string
  invoice_id: string
  client_id: string | null
  amount: number
  payment_date: string
  payment_method: string | null
  note: string | null
  created_at: string
  updated_at: string
}

// Extended types with relations
export interface InvoiceWithItems extends Invoice {
  items: InvoiceItem[]
  client?: Client | null
}

export interface UserWithPlan extends User {
  plan?: Plan | null
}
