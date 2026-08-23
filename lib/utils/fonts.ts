export interface FontOption {
  id: string
  label: string
  stack: string
}

// Web-safe stacks only — the invoice is rendered to a PDF via html2canvas,
// which can only capture glyphs from fonts actually available in the browser,
// so we avoid depending on webfonts that may not have finished loading.
export const FONT_OPTIONS: FontOption[] = [
  { id: "sans", label: "Sans", stack: "Arial, Helvetica, sans-serif" },
  { id: "serif", label: "Serif", stack: "Georgia, 'Times New Roman', serif" },
  { id: "modern", label: "Modern", stack: "'Helvetica Neue', Arial, sans-serif" },
  { id: "mono", label: "Mono", stack: "'Courier New', Courier, monospace" },
]

export function getFontStack(fontFamily?: string): string {
  return FONT_OPTIONS.find((f) => f.id === fontFamily)?.stack || FONT_OPTIONS[0].stack
}
