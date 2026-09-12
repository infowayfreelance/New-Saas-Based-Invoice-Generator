// Configuration for the 6 "Simple" invoice template variants. Each is a
// distinct visual treatment of the same underlying invoice data - no data
// is duplicated or reshaped per variant, only presentation. Adding a new
// variant later means adding one entry here; no other file needs to change
// its structure.
export interface SimpleInvoiceVariant {
  id: string
  label: string
  description: string
  /** Alternate row background in the items table. */
  zebraRows: boolean
  /** Light background panel behind the From/Bill To blocks. */
  panel: boolean
  /** Colored accent bar directly under the header. */
  headerAccentBar: boolean
  /** Grand total shown in a solid colored banner instead of plain text. */
  totalBanner: boolean
  /** Divider weight between sections. */
  divider: "solid" | "hairline"
  /** Extra vertical spacing between sections. */
  spacious: boolean
}

export const SIMPLE_INVOICE_TEMPLATES: SimpleInvoiceVariant[] = [
  {
    id: "simple-classic",
    label: "Simple Classic",
    description: "A traditional invoice layout with a clear header and a simple itemised table.",
    zebraRows: false,
    panel: false,
    headerAccentBar: false,
    totalBanner: false,
    divider: "solid",
    spacious: false,
  },
  {
    id: "simple-modern",
    label: "Simple Modern",
    description: "Modern typography with stronger spacing and a subtle brand accent bar.",
    zebraRows: false,
    panel: false,
    headerAccentBar: true,
    totalBanner: false,
    divider: "solid",
    spacious: true,
  },
  {
    id: "simple-minimal",
    label: "Simple Minimal",
    description: "A very clean layout with generous white space and minimal borders.",
    zebraRows: false,
    panel: false,
    headerAccentBar: false,
    totalBanner: false,
    divider: "hairline",
    spacious: true,
  },
  {
    id: "simple-business",
    label: "Simple Business",
    description: "Clear company and client panels with a structured totals section.",
    zebraRows: true,
    panel: true,
    headerAccentBar: false,
    totalBanner: false,
    divider: "solid",
    spacious: false,
  },
  {
    id: "simple-clean",
    label: "Simple Clean",
    description: "A lightweight design with a clear, easy-to-read items table.",
    zebraRows: false,
    panel: false,
    headerAccentBar: false,
    totalBanner: false,
    divider: "hairline",
    spacious: true,
  },
  {
    id: "simple-professional",
    label: "Simple Professional",
    description: "A premium layout with a strong header and a polished totals section.",
    zebraRows: false,
    panel: true,
    headerAccentBar: true,
    totalBanner: true,
    divider: "solid",
    spacious: true,
  },
]

export function getSimpleInvoiceVariant(id?: string | null): SimpleInvoiceVariant | undefined {
  if (!id) return undefined
  return SIMPLE_INVOICE_TEMPLATES.find((variant) => variant.id === id)
}

export const SIMPLE_INVOICE_TEMPLATE_IDS = SIMPLE_INVOICE_TEMPLATES.map((variant) => variant.id)
