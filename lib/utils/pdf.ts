"use client"

// A4 dimensions at 96dpi — the invoice is always rendered at this fixed size
// for both the on-screen preview and PDF export, so it looks identical on
// mobile, tablet, and desktop instead of shrinking to fit its content.
export const PDF_RENDER_WIDTH = 794
export const PDF_RENDER_HEIGHT = 1123

/**
 * Generates and downloads an A4 PDF from an invoice preview element.
 * The element is cloned into an off-screen container locked to a fixed
 * width before capture, so the current viewport size never affects the
 * PDF layout.
 *
 * The element may contain multiple `.pdf-page` children (e.g. the invoice
 * itself, followed by a separate Terms & Conditions page) — each is
 * captured and added as its own PDF page. Any single page taller than one
 * A4 sheet is still split across pages via the canvas-slicing fallback.
 */
export async function downloadInvoicePdf(element: HTMLElement, fileName: string): Promise<void> {
  const [html2canvas, { jsPDF }] = await Promise.all([
    import("html2canvas").then((mod) => mod.default),
    import("jspdf"),
  ])

  const doc = element.ownerDocument
  const container = doc.createElement("div")
  container.style.position = "fixed"
  container.style.left = "-10000px"
  container.style.top = "0"
  container.style.width = `${PDF_RENDER_WIDTH}px`
  container.style.backgroundColor = "#ffffff"

  const clone = element.cloneNode(true) as HTMLElement
  clone.style.width = `${PDF_RENDER_WIDTH}px`
  clone.style.minWidth = `${PDF_RENDER_WIDTH}px`
  clone.style.maxWidth = `${PDF_RENDER_WIDTH}px`
  clone.style.margin = "0"
  clone.style.transform = "none"
  clone.style.boxShadow = "none"
  clone.style.border = "none"
  clone.style.borderRadius = "0"

  container.appendChild(clone)
  doc.body.appendChild(container)

  try {
    const pageElements = Array.from(clone.querySelectorAll<HTMLElement>(".pdf-page"))
    const targets = pageElements.length > 0 ? pageElements : [clone]

    const pdf = new jsPDF("p", "mm", "a4")
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 10
    const imgWidth = pageWidth - margin * 2
    const usableHeight = pageHeight - margin * 2

    let addedAnyPage = false

    for (const target of targets) {
      const canvas = await html2canvas(target, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: PDF_RENDER_WIDTH,
      })

      const fullImgHeight = (canvas.height * imgWidth) / canvas.width

      if (fullImgHeight <= usableHeight) {
        if (addedAnyPage) pdf.addPage()
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", margin, margin, imgWidth, fullImgHeight)
        addedAnyPage = true
      } else {
        // Slice the rendered canvas into page-sized chunks
        const pageCanvasHeight = Math.floor((usableHeight * canvas.width) / imgWidth)
        let renderedHeight = 0

        while (renderedHeight < canvas.height) {
          const sliceHeight = Math.min(pageCanvasHeight, canvas.height - renderedHeight)
          const slice = doc.createElement("canvas")
          slice.width = canvas.width
          slice.height = sliceHeight

          const ctx = slice.getContext("2d")
          if (!ctx) throw new Error("Could not create canvas context")
          ctx.fillStyle = "#ffffff"
          ctx.fillRect(0, 0, slice.width, slice.height)
          ctx.drawImage(canvas, 0, renderedHeight, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight)

          if (addedAnyPage) pdf.addPage()
          pdf.addImage(
            slice.toDataURL("image/png"),
            "PNG",
            margin,
            margin,
            imgWidth,
            (sliceHeight * imgWidth) / canvas.width,
          )
          addedAnyPage = true

          renderedHeight += sliceHeight
        }
      }
    }

    pdf.save(fileName)
  } finally {
    doc.body.removeChild(container)
  }
}
