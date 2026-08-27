import { NextRequest, NextResponse } from "next/server"
import { getInvoiceDataForPDF } from "@/app/actions/invoice-pdf"
import { markInvoiceAsSent } from "@/app/actions/invoice-status"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: invoiceId } = await params

  console.log("[v0] PDF Download API: Request for invoice ID:", invoiceId)

  // Fetch invoice data with auth check
  const result = await getInvoiceDataForPDF(invoiceId)

  if (!result.success || !result.data) {
    console.error("[v0] PDF Download API: Failed to fetch invoice data")
    return NextResponse.json(
      { error: result.error || "Failed to fetch invoice data" },
      { status: 404 }
    )
  }

  const invoiceData = result.data

  console.log("[v0] PDF Download API: Invoice data fetched, generating HTML for client-side PDF generation")

  // Mark invoice as sent when downloaded (business rule: download = send to client)
  const statusUpdate = await markInvoiceAsSent(invoiceId)
  if (statusUpdate.success) {
    console.log("[v0] PDF Download API: Invoice marked as sent")
  } else {
    console.warn("[v0] PDF Download API: Could not mark invoice as sent:", statusUpdate.error)
  }

  // Return HTML that will trigger client-side PDF generation
  // This is a workaround since we can't run html2canvas on the server
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoiceData.invoiceNumber}</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }
    #invoice-preview {
      background: white;
      padding: 3rem;
      /* Fixed A4 width so the PDF looks identical on every device */
      width: 794px;
      min-width: 794px;
      max-width: 794px;
      margin: 0 auto;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .header { display: flex; justify-content: space-between; margin-bottom: 2rem; }
    .header h1 { font-size: 2rem; font-weight: bold; color: #171717; }
    .header-right { text-align: right; }
    .separator { border-top: 1px solid #e5e5e5; margin: 1.5rem 0; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
    .section-title { font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #737373; }
    .section-content { margin-top: 0.5rem; color: #171717; }
    table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
    th, td { padding: 0.75rem; text-align: left; }
    th { font-weight: 600; border-bottom: 1px solid #e5e5e5; }
    td { border-bottom: 1px solid #f5f5f5; }
    .text-right { text-align: right; }
    .totals { margin-top: 2rem; }
    .totals-row { display: flex; justify-content: space-between; margin: 0.5rem 0; }
    .total-label { color: #737373; }
    .total-value { color: #171717; font-weight: 600; }
    .grand-total { font-size: 1.5rem; font-weight: 800; padding-top: 1rem; border-top: 2px solid #e5e5e5; }
    #loading { text-align: center; padding: 2rem; }
  </style>
</head>
<body>
  <div id="loading">
    <h2>Generating PDF...</h2>
    <p>Please wait while your invoice is being prepared.</p>
  </div>

  <div id="invoice-preview" style="display: none;">
    <div class="header">
      <div>
        <h1>INVOICE</h1>
        <p style="color: #737373; margin-top: 0.5rem;">#${invoiceData.invoiceNumber}</p>
      </div>
      <div class="header-right">
        <p style="font-weight: 600; color: #171717;">${invoiceData.fromName}</p>
        <p style="color: #737373;">${invoiceData.fromEmail}</p>
        ${invoiceData.fromAddress ? `<p style="color: #737373; white-space: pre-line;">${invoiceData.fromAddress}</p>` : ""}
      </div>
    </div>

    <div class="separator"></div>

    <div class="grid">
      <div>
        <p class="section-title">Bill To</p>
        <div class="section-content">
          <p style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">${invoiceData.clientName}</p>
          <p style="color: #737373;">${invoiceData.clientEmail}</p>
          ${invoiceData.clientAddress ? `<p style="color: #737373; white-space: pre-line;">${invoiceData.clientAddress}</p>` : ""}
        </div>
      </div>
      <div style="text-align: right;">
        <div style="margin-bottom: 1rem;">
          <p class="section-title">Issue Date</p>
          <p class="section-content">${new Date(invoiceData.issueDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p class="section-title">Due Date</p>
          <p class="section-content">${new Date(invoiceData.dueDate).toLocaleDateString()}</p>
        </div>
      </div>
    </div>

    <div class="separator"></div>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th class="text-right">Qty</th>
          <th class="text-right">Price</th>
          <th class="text-right">Tax</th>
          <th class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${invoiceData.items.map(item => {
          const qty = parseFloat(item.quantity) || 0
          const price = parseFloat(item.unitPrice) || 0
          const taxRate = parseFloat(item.taxRate) || 0
          const subtotal = qty * price
          const tax = subtotal * (taxRate / 100)
          const total = subtotal + tax
          
          return `
            <tr>
              <td style="font-weight: 500;">${item.description}</td>
              <td class="text-right">${qty}</td>
              <td class="text-right">$${price.toFixed(2)}</td>
              <td class="text-right">${taxRate}%</td>
              <td class="text-right" style="font-weight: 600;">$${total.toFixed(2)}</td>
            </tr>
          `
        }).join('')}
      </tbody>
    </table>

    <div class="separator"></div>

    <div style="display: flex; justify-content: flex-end;">
      <div style="width: 300px;">
        ${(() => {
          const subtotal = invoiceData.items.reduce((sum, item) => {
            const qty = parseFloat(item.quantity) || 0
            const price = parseFloat(item.unitPrice) || 0
            return sum + (qty * price)
          }, 0)
          
          const taxAmount = invoiceData.items.reduce((sum, item) => {
            const qty = parseFloat(item.quantity) || 0
            const price = parseFloat(item.unitPrice) || 0
            const taxRate = parseFloat(item.taxRate) || 0
            return sum + ((qty * price) * (taxRate / 100))
          }, 0)
          
          const discount = parseFloat(invoiceData.discountAmount) || 0
          const total = subtotal + taxAmount - discount
          
          return `
            <div class="totals-row">
              <span class="total-label">Subtotal</span>
              <span class="total-value">$${subtotal.toFixed(2)}</span>
            </div>
            <div class="totals-row">
              <span class="total-label">Tax</span>
              <span class="total-value">$${taxAmount.toFixed(2)}</span>
            </div>
            ${discount > 0 ? `
              <div class="totals-row">
                <span class="total-label">Discount</span>
                <span class="total-value">-$${discount.toFixed(2)}</span>
              </div>
            ` : ''}
            <div class="totals-row grand-total">
              <span>Total</span>
              <span>$${total.toFixed(2)}</span>
            </div>
          `
        })()}
      </div>
    </div>

    ${invoiceData.bankDetails || invoiceData.terms ? `
      <div class="separator"></div>
      <div class="grid">
        ${invoiceData.bankDetails ? `
          <div>
            <p class="section-title">Bank Details</p>
            <p class="section-content" style="white-space: pre-line;">${invoiceData.bankDetails}</p>
          </div>
        ` : ''}
        ${invoiceData.terms ? `
          <div>
            <p class="section-title">Important</p>
            <p class="section-content" style="white-space: pre-line;">${invoiceData.terms}</p>
          </div>
        ` : ''}
      </div>
    ` : ''}
  </div>

  ${invoiceData.termsDetail ? `
  <div id="terms-page" style="display: none; background: white; padding: 3rem; width: 794px; min-width: 794px; max-width: 794px; margin: 0 auto;">
    <p style="font-size: 1.25rem; font-weight: 700; color: #171717;">Terms &amp; Conditions</p>
    <p style="margin-top: 1rem; white-space: pre-line; font-size: 0.875rem; line-height: 1.6; color: #404040;">${invoiceData.termsDetail}</p>
  </div>
  ` : ''}

  <script>
    console.log('[v0] PDF Download: Starting PDF generation');
    
    window.onload = async function() {
      try {
        // Show invoice preview
        document.getElementById('invoice-preview').style.display = 'block';
        document.getElementById('loading').style.display = 'none';
        
        // Wait for fonts to load
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('[v0] PDF Download: Capturing element as canvas');

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 10;

        async function addPageFromElement(el, isFirstPage) {
          const canvas = await html2canvas(el, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false
          });

          const imgData = canvas.toDataURL('image/png');
          const imgWidth = pageWidth - margin * 2;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          if (!isFirstPage) pdf.addPage();
          pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
        }

        await addPageFromElement(document.getElementById('invoice-preview'), true);

        const termsPage = document.getElementById('terms-page');
        if (termsPage) {
          termsPage.style.display = 'block';
          await addPageFromElement(termsPage, false);
        }

        console.log('[v0] PDF Download: Saving PDF');
        pdf.save('invoice-${invoiceData.invoiceNumber}.pdf');
        
        // Close window after a short delay
        setTimeout(() => {
          window.close();
        }, 1000);
        
      } catch (error) {
        console.error('[v0] PDF Download: Error generating PDF:', error);
        document.getElementById('loading').innerHTML = '<h2>Error</h2><p>Failed to generate PDF. Please try again.</p>';
      }
    };
  </script>
</body>
</html>
  `

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  })
}
