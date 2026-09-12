/**
 * A lightweight, decorative invoice-shaped preview used on the invoice
 * template hub and its per-template pages. Deliberately static (not the
 * real interactive generator) so these marketing/SEO pages stay light.
 */
export function TemplateThumbnail({ name }: { name: string }) {
  return (
    <div
      role="img"
      aria-label={`Preview of the ${name}`}
      className="overflow-hidden rounded-lg border border-border bg-card"
    >
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-muted-foreground/20" />
        <span className="h-2 w-2 rounded-full bg-muted-foreground/20" />
        <span className="h-2 w-2 rounded-full bg-muted-foreground/20" />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <div className="h-2.5 w-16 rounded-full bg-foreground/20" />
          <div className="h-2.5 w-10 rounded-full bg-muted-foreground/20" />
        </div>
        <div className="h-2 w-24 rounded-full bg-muted-foreground/15" />
        <div className="space-y-1.5 border-t border-border pt-3">
          <div className="flex items-center justify-between">
            <div className="h-2 w-28 rounded-full bg-muted-foreground/15" />
            <div className="h-2 w-8 rounded-full bg-muted-foreground/15" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-2 w-20 rounded-full bg-muted-foreground/15" />
            <div className="h-2 w-8 rounded-full bg-muted-foreground/15" />
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3">
          <div className="h-2.5 w-10 rounded-full bg-foreground/20" />
          <div className="h-3 w-14 rounded-full bg-primary/30" />
        </div>
      </div>
    </div>
  )
}
