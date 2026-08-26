import type { ProfessionInvoicePreview } from "./types"

interface InvoicePreviewCardProps {
  preview: ProfessionInvoicePreview
  alt: string
  compact?: boolean
}

/**
 * A static, purely illustrative invoice preview used on profession landing
 * pages. This is deliberately NOT the real interactive invoice generator -
 * it renders fixed example data only, so these marketing pages stay light
 * and don't duplicate the generator's calculation/PDF logic.
 */
export function InvoicePreviewCard({ preview, alt, compact = false }: InvoicePreviewCardProps) {
  return (
    <div
      role="img"
      aria-label={alt}
      className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
    >
      {/* Browser-style chrome to read as a document preview, not a real form */}
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
      </div>

      <div className={compact ? "p-5" : "p-6 sm:p-8"}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold">{preview.fromName}</p>
            {preview.fromLine && <p className="text-xs text-muted-foreground">{preview.fromLine}</p>}
          </div>
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Invoice</p>
            <p className="text-xs text-muted-foreground">{preview.invoiceNumber}</p>
          </div>
        </div>

        <div className="mt-5 flex items-start justify-between gap-4 border-t border-border pt-4 text-xs">
          <div>
            <p className="font-medium uppercase tracking-wide text-muted-foreground">Bill to</p>
            <p className="mt-1 font-medium text-foreground">{preview.clientName}</p>
            {preview.clientLine && <p className="text-muted-foreground">{preview.clientLine}</p>}
          </div>
          <div className="text-right">
            <p className="font-medium uppercase tracking-wide text-muted-foreground">Due</p>
            <p className="mt-1 text-foreground">{preview.dueLabel}</p>
          </div>
        </div>

        <div className="mt-5 space-y-2.5 border-t border-border pt-4">
          {preview.items.map((item) => (
            <div key={item.description} className="flex items-start justify-between gap-4 text-sm">
              <div>
                <p className="font-medium text-foreground">{item.description}</p>
                {item.meta && <p className="text-xs text-muted-foreground">{item.meta}</p>}
              </div>
              <p className="shrink-0 font-medium text-foreground">{item.amount}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-1.5 border-t border-border pt-4 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{preview.subtotal}</span>
          </div>
          {preview.discount && (
            <div className="flex justify-between text-muted-foreground">
              <span>Discount</span>
              <span>{preview.discount}</span>
            </div>
          )}
          {preview.tax && (
            <div className="flex justify-between text-muted-foreground">
              <span>Tax</span>
              <span>{preview.tax}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-border pt-1.5 font-semibold text-foreground">
            <span>Total</span>
            <span>{preview.total}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
