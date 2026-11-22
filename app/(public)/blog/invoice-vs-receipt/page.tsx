import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getSiteUrl } from "@/lib/utils/site-url"
import { getBlogPost } from "@/lib/data/blog-posts"

const siteUrl = getSiteUrl()
const post = { ...getBlogPost("invoice-vs-receipt")!, updatedDate: "2026-11-23" }
const pageUrl = `${siteUrl}/blog/${post.slug}`
const coverImageUrl = `${siteUrl}${post.coverImage}`

export const metadata: Metadata = {
  title: "Invoice vs Receipt: What's the Difference? (UK)",
  description: post.excerpt,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Invoice vs Receipt: What's the Difference? (UK) | MakeInvo",
    description: post.excerpt,
    url: pageUrl,
    type: "article",
    publishedTime: post.publishedDate,
    modifiedTime: post.updatedDate,
    images: [{ url: coverImageUrl, width: 1200, height: 675, alt: post.coverImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Invoice vs Receipt: What's the Difference? (UK)",
    description: post.excerpt,
    images: [coverImageUrl],
  },
  robots: { index: true, follow: true },
}

const faqs = [
  {
    "question": "Does sending an invoice prove the customer paid?",
    "answer": "No. It records a charge, not the arrival of money. Check the payment and keep evidence linking it to the invoice before confirming that the balance is settled."
  },
  {
    "question": "Can I acknowledge payment on the original invoice?",
    "answer": "You can send a paid copy using the original reference. State the amount received, the payment date and any remaining balance so the customer can see exactly what the acknowledgement covers."
  },
  {
    "question": "Is a bank transfer confirmation enough for my records?",
    "answer": "It helps show that money moved, but may not describe the purchase or contain the invoice details you need. Keep the supplier's invoice or receipt alongside the payment evidence."
  },
  {
    "question": "Does every till receipt count as a VAT invoice?",
    "answer": "No. Its contents and the applicable VAT rules matter. Some receipts meet the simplified VAT invoice requirements; ask the supplier for an appropriate VAT invoice if the necessary information is missing."
  },
  {
    "question": "What should I send after a deposit?",
    "answer": "Acknowledge the amount received and identify the booking or invoice it relates to. Make any outstanding balance clear, and do not describe the whole sale as paid in full unless it is."
  },
  {
    "question": "Can I invoice without being VAT-registered?",
    "answer": "Yes. You can use an invoice to explain your charges and payment terms. Do not charge VAT when you are not VAT-registered, and include the business details relevant to your circumstances."
  },
  {
    "question": "Does MakeInvo generate receipts?",
    "answer": "This guide does not claim that MakeInvo offers a receipt generator. It creates invoices, with payment recording available on plans that include payment tracking."
  }
]

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: pageUrl },
      ],
    },
    {
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      image: [coverImageUrl],
      datePublished: post.publishedDate,
      dateModified: post.updatedDate,
      author: { "@type": "Organization", name: "MakeInvo", url: siteUrl },
      publisher: {
        "@type": "Organization",
        name: "MakeInvo",
        logo: { "@type": "ImageObject", url: `${siteUrl}/Make-invo-logo.webp` },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ],
}


function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })
}

export default function InvoiceVsReceiptPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-foreground hover:underline">Blog</Link>
            <span className="mx-2">/</span>
            <span aria-current="page">Invoice vs receipt</span>
          </nav>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            By {post.author} &middot; Published {formatDate(post.publishedDate)} &middot; {post.readingTime} &middot; Updated {formatDate(post.updatedDate)}
          </p>
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-xl border border-border bg-muted">
            <Image src={post.coverImage} alt={post.coverImageAlt} fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          </div>
          <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-h2:text-2xl prose-h2:font-bold prose-h3:text-lg prose-h3:font-semibold">
            <p>{"A customer asks for a receipt, but you have already emailed an invoice. Should you send the same PDF again, change its heading or make another document? The answer depends on whether you are asking for money or confirming money you have received."}</p>
            <p>{"An invoice sets out the charge. A receipt records a payment. Keeping those jobs clear helps your customer understand their balance and helps you match each sale to the money in your account. This guide is general information, not legal, tax or accounting advice."}</p>
            <h2>{"Invoice and receipt: the difference at a glance"}</h2>
            <p>{"The useful question is: “What does this document confirm?” An invoice confirms what you are charging. A receipt confirms what was paid. An unpaid invoice alone does not show that the customer settled the bill."}</p>
            <table><thead><tr><th>{"Detail"}</th><th>{"Invoice"}</th><th>{"Receipt"}</th></tr></thead><tbody><tr><td>{"Main purpose"}</td><td>{"Ask the customer to pay"}</td><td>{"Acknowledge money received"}</td></tr><tr><td>{"Usual timing"}</td><td>{"At the agreed billing stage"}</td><td>{"Once payment has been received"}</td></tr><tr><td>{"Important date"}</td><td>{"Invoice date and payment deadline"}</td><td>{"Date of payment"}</td></tr><tr><td>{"Amount shown"}</td><td>{"Charges and the amount due"}</td><td>{"Amount actually received"}</td></tr><tr><td>{"Useful reference"}</td><td>{"Unique invoice number"}</td><td>{"Receipt reference and related invoice number"}</td></tr><tr><td>{"After a part-payment"}</td><td>{"Still shows the remaining debt"}</td><td>{"Confirms only the payment received"}</td></tr></tbody></table>
            <p><a href="https://www.gov.uk/invoicing-and-taking-payment-from-customers">{"GOV.UK's invoicing overview"}</a>{" makes the same distinction between an invoice and an acknowledgement of payment. Sometimes both jobs fit on one document, but the wording and payment details must make that clear."}</p>
            <h2>{"Start with the invoice when payment is due"}</h2>
            <div className="not-prose relative my-8 aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted"><Image src="/blog/invoice-vs-receipt/invoice-request-for-payment.webp" alt="Freelancer reviewing an invoice on a laptop before sending it" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /></div>
            <p>{"An invoice gives your customer enough information to check the charge and arrange payment. You might send one when a project ends, at an agreed milestone or before work starts if your terms require payment upfront. Sending it is not evidence that the money has arrived."}</p>
            <p>{"For example, a freelance editor finishes an agreed piece of work and sends an invoice with a due date. The client can use that invoice to approve the expense. The editor should still check for payment before marking the account as settled."}</p>
            <p>{"A useful invoice includes:"}</p>
            <ul><li>{"a unique invoice number;"}</li><li>{"your business name, address and contact details;"}</li><li>{"the customer's name and address;"}</li><li>{"a clear description of the goods or services;"}</li><li>{"the supply date and invoice date;"}</li><li>{"the charges, VAT where applicable and total owed;"}</li><li>{"payment instructions and the agreed due date."}</li></ul>
            <p>{"Sole traders and limited companies have additional naming requirements. Our guide to "}<Link href="/blog/what-to-include-on-a-uk-invoice">{"what a UK invoice must include"}</Link>{" explains these, with links to the official checklist. For the practical steps, see "}<Link href="/blog/how-to-make-an-invoice-online">{"how to make an invoice online"}</Link>{"."}</p>
            <h2>{"Send a receipt when you acknowledge payment"}</h2>
            <div className="not-prose relative my-8 aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted"><Image src="/blog/invoice-vs-receipt/receipt-proof-of-payment.webp" alt="Printed receipt confirming a card payment at a shop counter" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /></div>
            <p>{"A receipt answers a different set of questions: who paid, who received the money, when did it arrive and which purchase did it cover? It is particularly helpful when a customer pays in cash or needs a record for their own bookkeeping."}</p>
            <p>{"Think of a customer collecting an order and paying at the counter. There may be no period of waiting for payment, so a receipt is the document they leave with. For a service sold on credit, there may instead be an invoice followed later by a receipt."}</p>
            <p>{"For a clear payment record, include your business details, the payment date, the amount received, a short description and the payment method. Where an invoice exists, reference its number. A separate receipt reference can help you find the document again."}</p>
            <p>{"Do not include full card details or other payment information the customer does not need. A method such as “bank transfer” is usually clearer than copying a long bank transaction description into the document."}</p>
            <h2>{"Can you use a paid invoice as a receipt?"}</h2>
            <p>{"A copy of an invoice marked “Paid” can provide a useful payment acknowledgement when it also shows what was received and when. It keeps the charge and the payment linked through the original invoice number."}</p>
            <p>{"Before sending it, check that the payment has actually reached you. A customer's message saying they have made a transfer is a reason to check your account, rather than proof that the funds have arrived."}</p>
            <p>{"Keep the original invoice reference. On the paid copy, make the payment status clear, add the payment date and amount, and show whether anything remains outstanding. Avoid creating a second invoice for the same sale just to acknowledge payment: that can make the customer think you are billing twice."}</p>
            <p>{"If the customer asks for a separate receipt, clarify what their accounts team needs. They may want a short payment acknowledgement referencing the invoice, rather than another copy of the full list of charges."}</p>
            <h2>{"Deposits and part-payments need careful labels"}</h2>
            <p>{"Receiving some money does not mean the whole invoice is paid. A deposit may cover only a booking stage, while a later transfer may leave a balance outstanding. Your records should show each payment against the right sale."}</p>
            <p>{"For an existing invoice, record the amount received, its date and the remaining balance. If you acknowledge that payment to the customer, say “Part-payment received” or “Deposit received”, as appropriate. Reserve “Paid in full” for a balance that has actually been cleared."}</p>
            <p>{"A simple fictional example is a designer who invoices for a project and receives a deposit first. The deposit acknowledgement refers to the project and original invoice. When the final payment arrives, the designer records that separately and confirms that no balance remains. No extra sale has taken place merely because there were two payments."}</p>
            <p>{"If your contract uses separate invoices for separate stages, name each stage clearly. Check the customer's reference when matching a transfer, especially if they have several invoices open at once."}</p>
            <h2>{"UK VAT: the document's details matter"}</h2>
            <p>{"GOV.UK says you must give an invoice when both you and your customer are VAT-registered. That does not make every receipt a VAT invoice, or mean a document becomes suitable for VAT records simply because its heading says “Invoice”."}</p>
            <p>{"A till receipt may contain the details needed for a simplified VAT invoice. Under "}<a href="https://www.gov.uk/guidance/record-keeping-for-vat-notice-70021">{"HMRC's VAT Notice 700/21"}</a>{", a retailer asked for an invoice can use the simplified form for an individual supply of £250 or less, including VAT, subject to the rules in the notice."}</p>
            <p>{"Those details include the supplier's name, address and VAT registration number, the tax point, a description of the supply and the required VAT information. Exempt supplies must not be included on that type of invoice. If the purchase does not fit the simplified rules, ask the supplier for the appropriate VAT invoice."}</p>
            <p>{"For your own sales, only charge VAT if you are VAT-registered. Keep the invoice and payment evidence together, and check the official guidance or your accountant if you are unsure which document your customer needs. A payment confirmation does not repair missing VAT invoice information."}</p>
            <h2>{"Which document fits these everyday situations?"}</h2>
            <h3>{"A client will pay after you finish"}</h3>
            <p>{"Send the invoice at the stage agreed in your contract. Include the deadline and payment instructions. Once you receive the money, update your records and provide an acknowledgement if needed. For overdue business invoices, follow our guide to "}<Link href="/blog/how-to-chase-a-late-invoice-uk">{"chasing a late invoice in the UK"}</Link>{"."}</p>
            <h3>{"A customer pays immediately"}</h3>
            <p>{"A receipt confirms the payment without suggesting that another amount is due. If the customer also needs a VAT invoice, check whether your receipt contains the right information or whether you need to provide a separate document."}</p>
            <h3>{"An employee needs to claim an expense"}</h3>
            <p>{"The employee may need both the supplier's invoice or receipt and evidence of payment under their employer's policy. A card statement can show a transaction but may not explain what was purchased. Keep the itemised document rather than assuming the bank entry covers everything."}</p>
            <h3>{"A customer asks for a duplicate"}</h3>
            <p>{"Resend a copy of the relevant original document with its reference intact. Make clear that it is a copy, and check whether they want the unpaid invoice or confirmation of a payment. This avoids turning a simple records request into a fresh charge."}</p>
            <h2>{"Bills, quotes and other documents nearby"}</h2>
            <p>{"The words used in everyday conversation are not always precise. A customer may call your invoice a “bill”, for example. Focus on the document's purpose and contents rather than the label alone."}</p>
            <ul><li><strong>{"Quote:"}</strong>{" your proposed price before the customer agrees to the work. It does not acknowledge payment."}</li><li><strong>{"Pro forma invoice:"}</strong>{" a preliminary document setting out a proposed transaction or requesting advance payment. It is not a VAT invoice."}</li><li><strong>{"Bill:"}</strong>{" commonly another word for an invoice or request to pay."}</li><li><strong>{"Statement:"}</strong>{" a summary of account activity, often showing several invoices, payments and balances."}</li><li><strong>{"Credit note:"}</strong>{" a document recording a reduction or correction to an earlier invoice; it does not by itself confirm a refund was paid."}</li></ul>
            <p>{"Keep references between related documents. If you issue a credit note or make a refund, retain a clear record of both the adjustment and any money returned. Deleting the earlier paperwork can make the sequence harder to explain later."}</p>
            <h2>{"Keep a trail from the sale to the payment"}</h2>
            <div className="not-prose relative my-8 aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted"><Image src="/blog/invoice-vs-receipt/paid-invoice-records.webp" alt="Folder of invoices with one marked paid next to a laptop" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /></div>
            <p>{"Store the invoice, payment acknowledgement and supporting bank entry so you can find them together. A consistent filename using the date and invoice reference helps. Keep a backup, and check that scanned receipts remain readable."}</p>
            <p>{"For self-employed businesses, "}<a href="https://www.gov.uk/self-employed-records/how-long-to-keep-your-records">{"GOV.UK's record retention guidance"}</a>{" says to keep records for at least five years after the relevant tax year's 31 January submission deadline. Count from that deadline, not simply from the day you bought something."}</p>
            <p>{"For limited companies, the general period is six years from the end of the last company financial year the records relate to. "}<a href="https://www.gov.uk/running-a-limited-company/company-and-accounting-records">{"GOV.UK's company records guidance"}</a>{" lists circumstances requiring longer retention. VAT and other rules can also affect what you must keep, so use the guidance relevant to your business."}</p>
            <h2>{"Where MakeInvo fits"}</h2>
            <p>{"Use the "}<Link href="/">{"MakeInvo invoice generator"}</Link>{" to create a PDF invoice without signup, a watermark or a credit card. A free account lets you save clients and invoice history, so you can refer back to earlier billing details."}</p>
            <p>{"On plans that include payment tracking, MakeInvo lets you record payment amounts, dates and methods, including partial payments. The paid, unpaid, partially paid and overdue statuses help you see where an invoice stands. Review the available "}<Link href="/features">{"features"}</Link>{" and compare options on the "}<Link href="/pricing">{"pricing page"}</Link>{"."}</p>
            <p>{"MakeInvo is not presented here as a receipt generator. Creating an invoice and recording its payment are distinct tasks. For a separate receipt, provide the payment acknowledgement your customer needs and keep it with your invoice records."}</p>
            <h2>{"Frequently asked questions"}</h2>
            <h3>{"Does sending an invoice prove the customer paid?"}</h3>
            <p>{"No. It records a charge, not the arrival of money. Check the payment and keep evidence linking it to the invoice before confirming that the balance is settled."}</p>
            <h3>{"Can I acknowledge payment on the original invoice?"}</h3>
            <p>{"You can send a paid copy using the original reference. State the amount received, the payment date and any remaining balance so the customer can see exactly what the acknowledgement covers."}</p>
            <h3>{"Is a bank transfer confirmation enough for my records?"}</h3>
            <p>{"It helps show that money moved, but may not describe the purchase or contain the invoice details you need. Keep the supplier's invoice or receipt alongside the payment evidence."}</p>
            <h3>{"Does every till receipt count as a VAT invoice?"}</h3>
            <p>{"No. Its contents and the applicable VAT rules matter. Some receipts meet the simplified VAT invoice requirements; ask the supplier for an appropriate VAT invoice if the necessary information is missing."}</p>
            <h3>{"What should I send after a deposit?"}</h3>
            <p>{"Acknowledge the amount received and identify the booking or invoice it relates to. Make any outstanding balance clear, and do not describe the whole sale as paid in full unless it is."}</p>
            <h3>{"Can I invoice without being VAT-registered?"}</h3>
            <p>{"Yes. You can use an invoice to explain your charges and payment terms. Do not charge VAT when you are not VAT-registered, and include the business details relevant to your circumstances."}</p>
            <h3>{"Does MakeInvo generate receipts?"}</h3>
            <p>{"This guide does not claim that MakeInvo offers a receipt generator. It creates invoices, with payment recording available on plans that include payment tracking."}</p>
            <h2>{"Give each document a clear job"}</h2>
            <p>{"Before sending paperwork, decide whether you are requesting payment or confirming it. Use a clear reference, check the balance and keep the supporting records together. Start your next bill with MakeInvo's "}<Link href="/invoice-templates">{"invoice templates"}</Link>{", or browse the "}<Link href="/blog">{"MakeInvo blog"}</Link>{" for more practical invoicing guides.\n"}</p>
          </div>
          <div className="mt-10 border-t border-border pt-8">
            <Link href="/blog" className="text-sm font-medium text-primary hover:underline">&larr; Back to the blog</Link>
          </div>
        </article>
      </div>
    </>
  )
}
