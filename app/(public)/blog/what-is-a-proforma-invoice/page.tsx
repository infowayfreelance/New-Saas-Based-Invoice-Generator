import type { Metadata } from "next"
import Script from "next/script"
import Link from "next/link"
import Image from "next/image"
import { getSiteUrl } from "@/lib/utils/site-url"
import { getBlogPost } from "@/lib/data/blog-posts"

const siteUrl = getSiteUrl()
const post = getBlogPost("what-is-a-proforma-invoice")!
const pageUrl = `${siteUrl}/blog/${post.slug}`
const coverImageUrl = `${siteUrl}${post.coverImage}`

export const metadata: Metadata = {
  title: "What Is a Proforma Invoice? Plain-English UK Guide",
  description: post.excerpt,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "What Is a Proforma Invoice? Plain-English UK Guide | MakeInvo",
    description: post.excerpt,
    url: pageUrl,
    type: "article",
    publishedTime: post.publishedDate,
    modifiedTime: post.updatedDate,
    images: [{ url: coverImageUrl, width: 1200, height: 630, alt: post.coverImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: "What Is a Proforma Invoice? Plain-English UK Guide",
    description: post.excerpt,
    images: [coverImageUrl],
  },
  robots: { index: true, follow: true },
}

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "What Is a Proforma Invoice? A Plain-English UK Guide (With VAT Points)",
    "description": "A proforma invoice sets out a sale before it happens. When to use one, what to include, how it differs from an invoice or quote, plus VAT basics.",
    "image": "https://makeinvo.com/blog/what-is-a-proforma-invoice/what-is-a-proforma-invoice-featured.webp",
    "datePublished": "2026-11-25",
    "dateModified": "2026-11-25",
    "author": {
      "@type": "Organization",
      "name": "MakeInvo",
      "url": "https://makeinvo.com/"
    },
    "publisher": {
      "@type": "Organization",
      "name": "MakeInvo",
      "url": "https://makeinvo.com/"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://makeinvo.com/blog/what-is-a-proforma-invoice"
    },
    "inLanguage": "en-GB"
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a proforma invoice used for?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It sets out a proposed transaction for review or invites payment before supply. Explain which purpose applies when you send it."
        }
      },
      {
        "@type": "Question",
        "name": "Is a proforma invoice legally binding?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The heading alone does not settle that question. Check the agreement, terms and acceptance, and get legal advice if an obligation is disputed."
        }
      },
      {
        "@type": "Question",
        "name": "Is a proforma invoice a VAT invoice?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. It cannot be used as evidence to reclaim input VAT, even if it shows an expected VAT amount. Ask for the appropriate VAT invoice. GOV.UK"
        }
      },
      {
        "@type": "Question",
        "name": "Does a proforma invoice need an invoice number?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Use a clear reference so you can identify it. Keeping proforma references separate from your actual invoice numbering is practical good practice, rather than a universal numbering requirement."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between a proforma invoice and a quote?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A quote presents a proposed price and scope. A proforma presents transaction details in an invoice-style document and may invite advance payment. Their contents and purpose can overlap."
        }
      },
      {
        "@type": "Question",
        "name": "What happens after a proforma invoice is paid?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Record the payment, connect it to the order and issue the appropriate invoice. VAT-registered suppliers should check HMRC’s invoicing and tax-point rules rather than waiting automatically until delivery."
        }
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://makeinvo.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://makeinvo.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "What Is a Proforma Invoice? A Plain-English UK Guide (With VAT Points)",
        "item": "https://makeinvo.com/blog/what-is-a-proforma-invoice"
      }
    ]
  }
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })
}

export default function ProformaInvoicePage() {
  return (
    <>
      {schemas.map((schema) => (
        <Script key={schema["@type"]} id={`proforma-guide-${schema["@type"]}`} strategy="beforeInteractive" type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      ))}
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-foreground hover:underline">Blog</Link>
            <span className="mx-2">/</span>
            <span aria-current="page">Proforma invoices</span>
          </nav>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            By {post.author} &middot; Published {formatDate(post.publishedDate)} &middot; {post.readingTime} &middot; Updated {formatDate(post.updatedDate)}
          </p>
          <div className="relative mt-8 aspect-[1200/630] w-full overflow-hidden rounded-xl border border-border bg-muted">
            <Image src={post.coverImage} alt={post.coverImageAlt} fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          </div>
          <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-h2:text-2xl prose-h2:font-bold prose-h3:text-lg prose-h3:font-semibold">
            <p>{"A proforma invoice is a preliminary commercial document showing the details of a proposed sale. It can help a customer review the goods, services and expected charges before proceeding. It can also invite payment before the supplier provides the goods or starts the work."}</p>
            <p>{"The important distinction is that a proforma does not formally confirm a supply in the way a proper invoice does. It is not a VAT invoice, and sending one does not prove that a customer has paid."}</p>
            <p>{"This guide explains how UK small businesses can use proformas without confusing them with quotes, sales invoices or receipts. It is general information, not tax or legal advice; check the linked HMRC guidance or ask an accountant about your circumstances."}</p>
            <h2>{"Short answer: what a proforma invoice is"}</h2>
            <p>{"Think of a proforma as a clearly labelled document for the stage before the formal invoice. It sets out what is proposed, often in an invoice-style layout, while keeping that proposal separate from the final billing record."}</p>
            <p><a href="https://www.gov.uk/hmrc-internal-manuals/vat-trader-records/vatrec9010">{"HMRC’s proforma guidance"}</a>{" explains that it does not formally confirm a supply. HMRC also recognises its use as a document against which payment is invited. So saying a proforma never requests payment would be misleading: its purpose depends on the transaction."}</p>
            <p>{"If you have already confirmed the sale and need the actual invoice, MakeInvo’s "}<Link href="/">{"free invoice generator"}</Link>{" can help you prepare that document instead."}</p>
            <h2>{"When businesses use a proforma invoice"}</h2>
            <h3>{"To arrange payment before supply"}</h3>
            <p>{"A supplier may want payment before releasing an order or starting a job. A proforma can show the customer what they are being asked to pay for, with the proposed items, charges and payment instructions together."}</p>
            <p>{"This can be useful for a first order, where the parties have not worked together before. Make the arrangement explicit: explain whether payment is needed before you reserve materials, dispatch goods or begin work. Do not leave the customer to guess what happens next."}</p>
            <h3>{"To let a customer review a proposed transaction"}</h3>
            <p>{"A buyer may need a document to review internally before agreeing an order. An invoice-style summary can help them check quantities, descriptions and delivery arrangements against their request."}</p>
            <p>{"A proforma may also be requested for an international shipment. That does not make one generic form suitable for every customs situation. Check GOV.UK and the relevant shipping requirements rather than treating this guide as export advice."}</p>
            <p>{"Choose the document because it serves a clear purpose. If a straightforward quote already explains the proposal, you may not need another piece of paperwork."}</p>
            <h2>{"Proforma invoice vs invoice vs quote vs estimate"}</h2>
            <div className="not-prose relative my-8 aspect-[3/2] w-full overflow-hidden rounded-xl border border-border bg-muted"><Image src="/blog/what-is-a-proforma-invoice/proforma-vs-invoice-documents.webp" alt="Proforma invoice and final invoice side by side" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /></div>
            <p>{"These documents can contain similar descriptions and figures. The difference is what each document is doing at that stage of the sale."}</p>
            <div className="overflow-x-auto"><table><thead><tr><th scope="col">{"Document"}</th><th scope="col">{"Main purpose"}</th><th scope="col">{"Practical distinction"}</th></tr></thead><tbody><tr><td>{"Proforma invoice"}</td><td>{"Summarise a proposed transaction, sometimes inviting advance payment"}</td><td>{"Clearly identify it as preliminary; it is not a VAT invoice"}</td></tr><tr><td>{"Sales invoice"}</td><td>{"Formally record the supply and set out the charge"}</td><td>{"Use the appropriate invoice details and reference"}</td></tr><tr><td>{"Quote"}</td><td>{"Present a proposed price and scope for acceptance"}</td><td>{"State what the offer includes and its conditions"}</td></tr><tr><td>{"Estimate"}</td><td>{"Give an approximate expected cost"}</td><td>{"Explain the assumptions and what may change"}</td></tr></tbody></table></div>
            <p>{"Neither the heading nor the table settles the legal effect of an agreement. Whether a contract has been formed depends on the terms, acceptance and surrounding circumstances. Avoid assuming either that every proforma creates a binding obligation or that its title makes the whole arrangement non-binding."}</p>
            <p>{"An invoice is also different from a receipt. The invoice sets out the charge; the receipt acknowledges payment. "}<a href="https://www.gov.uk/invoicing-and-taking-payment-from-customers">{"GOV.UK’s invoicing overview"}</a>{" explains that distinction. Our guide to "}<Link href="/blog/invoice-vs-receipt">{"invoice vs receipt"}</Link>{" looks at the documents in more detail."}</p>
            <h2>{"What to include on a proforma invoice"}</h2>
            <p>{"Build the document around the decision or payment you want the customer to make. They should be able to identify the proposal, check its contents and understand the next step."}</p>
            <p>{"A practical checklist is:"}</p>
            <ul><li><strong>{"A clear heading:"}</strong>{" label the document “Proforma Invoice”."}</li><li><strong>{"A VAT distinction:"}</strong>{" include “This is not a VAT invoice”."}</li><li><strong>{"Your details:"}</strong>{" business name, contact information and address."}</li><li><strong>{"The customer’s details:"}</strong>{" the correct business or person and address."}</li><li><strong>{"A separate reference:"}</strong>{" a recognisable proforma reference and issue date."}</li><li><strong>{"The proposal:"}</strong>{" descriptions, quantities, agreed scope and expected charges."}</li><li><strong>{"Validity:"}</strong>{" when the proposed pricing or availability should be reconfirmed."}</li><li><strong>{"Terms:"}</strong>{" payment arrangements, delivery expectations and any conditions."}</li></ul>
            <p>{"HMRC recommends clear proforma labelling and the VAT distinction. The separate reference and validity date are practical ways to organise proposals, rather than a universal numbering rule. "}<a href="https://www.gov.uk/hmrc-internal-manuals/vat-trader-records/vatrec9010">{"GOV.UK"}</a></p>
            <p>{"For example, you could use a reference beginning “PF” for proposals and reserve your normal invoice references for actual invoices. Check your existing bookkeeping process before changing its numbering system."}</p>
            <p>{"If you show an anticipated VAT element, make clear that the document remains a proforma. A detailed breakdown does not turn it into evidence for reclaiming VAT. Avoid presenting provisional charges as settled if the order, delivery or scope still needs agreement."}</p>
            <h2>{"From proforma to final invoice: the usual sequence"}</h2>
            <div className="not-prose relative my-8 aspect-[3/2] w-full overflow-hidden rounded-xl border border-border bg-muted"><Image src="/blog/what-is-a-proforma-invoice/proforma-advance-payment-bank-transfer.webp" alt="Customer making an advance payment after receiving a proforma" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /></div>
            <h3>{"1. Confirm the proposal"}</h3>
            <p>{"Check the items or work with the customer before issuing the proforma. Record the agreed scope and explain whether the document is for approval, advance payment or another stated purpose."}</p>
            <p>{"Include enough information to prevent two different versions circulating without explanation. If the customer changes the order, clearly identify the revised proposal and tell them which earlier version it replaces."}</p>
            <h3>{"2. Record acceptance or payment"}</h3>
            <p>{"Keep the customer’s confirmation with the relevant proposal. If payment is requested, check that it has actually arrived and identify which order it relates to. A message saying “transfer sent” is a prompt to check, not a substitute for checking."}</p>
            <p>{"For deposits and staged work, make the payment schedule clear. Our guides to "}<Link href="/blog/invoice-payment-terms-uk">{"invoice payment terms in the UK"}</Link>{" and "}<Link href="/blog/how-to-invoice-as-a-freelancer-uk">{"invoicing as a freelancer"}</Link>{" cover wording and billing stages."}</p>
            <h3>{"3. Issue the proper invoice when required"}</h3>
            <p>{"Move to the appropriate invoice rather than continuing to use the proforma as the final billing document. VAT-registered suppliers need to follow the VAT invoicing rules when payment or supply takes place; do not assume the invoice can always wait until the order is completed. "}<a href="https://www.gov.uk/guidance/vat-guide-notice-700">{"GOV.UK"}</a></p>
            <p>{"Check the business and customer details again, use the correct invoice reference and explain any advance payment already received. For the final document’s fields, see "}<Link href="/blog/what-to-include-on-a-uk-invoice">{"what to include on a UK invoice"}</Link>{"."}</p>
            <h3>{"4. Keep the records connected"}</h3>
            <p>{"Retain the proposal, acceptance, payment evidence and invoice together. Cross-references make it easier to answer a customer who asks why an invoice differs from an earlier proposal."}</p>
            <p>{"If the agreed quantity changed, for example, the records should explain that change. Do not quietly replace the original paperwork and leave the customer with a different version."}</p>
            <h2>{"Proforma invoices and VAT: general information"}</h2>
            <p>{"A customer must not use a proforma as evidence to reclaim input VAT. "}<a href="https://www.gov.uk/guidance/vat-guide-notice-700#section17">{"VAT Notice 700, section 17.3"}</a>{", confirms this even where it contains the information normally found on a VAT invoice. It also explains the need for a proper VAT invoice when payment is received or the supply takes place."}</p>
            <p>{"The document and the payment are separate events. Receiving an advance payment can create a VAT tax point for the amount received. The general rules and exceptions are in "}<a href="https://www.gov.uk/guidance/vat-guide-notice-700#section14">{"section 14.2 of VAT Notice 700"}</a>{", including its treatment of deposits."}</p>
            <p>{"Do not assume all deposits receive identical treatment, or that calling a payment a “proforma payment” removes VAT obligations. Ask an accountant if the payment’s purpose or the timing is unclear."}</p>
            <p>{"For a buyer, the practical step is to ask the supplier for the appropriate VAT invoice. Keep the proforma as supporting correspondence, rather than relying on it as your VAT invoice."}</p>
            <h2>{"Common proforma mistakes to avoid"}</h2>
            <h3>{"Treating the proposal as a completed sale"}</h3>
            <p>{"A proposed transaction may change or never proceed. Keep it separate from final invoices, and make sure the person handling your bookkeeping knows what the document represents."}</p>
            <p>{"HMRC says proformas are not normally accounting documents. That does not mean ignoring money actually received: payments still need the appropriate records and accounting treatment. "}<a href="https://www.gov.uk/hmrc-internal-manuals/vat-trader-records/vatrec9010">{"GOV.UK"}</a></p>
            <h3>{"Leaving the status unclear"}</h3>
            <p>{"A document that looks like a normal invoice but has no clear label invites confusion. The customer may treat it as a final bill, while your team still regards it as a proposal."}</p>
            <p>{"Keep the heading, reference and explanatory wording consistent. When emailing a revised version, say what changed and whether the customer needs to take action."}</p>
            <h3>{"Reusing it as the only final document"}</h3>
            <p>{"Do not assume an earlier proforma will satisfy the customer’s later invoice requirements. Prepare the proper invoice, link it to the order and explain how any advance payment affects the balance."}</p>
            <p>{"Similarly, do not request the full amount again without acknowledging a payment already received. The customer should be able to understand the balance without reconstructing your records."}</p>
            <h3>{"Giving the customer no next step"}</h3>
            <p>{"State whether you need written acceptance, payment or confirmation of delivery details. Provide a contact for questions and explain whether the proposal needs reconfirming after its validity date."}</p>
            <p>{"That clarity is more useful than making the document look complicated. A short, accurate proforma is easier to check than a long document filled with unrelated conditions."}</p>
            <h2>{"Where MakeInvo fits"}</h2>
            <div className="not-prose relative my-8 aspect-[3/2] w-full overflow-hidden rounded-xl border border-border bg-muted"><Image src="/blog/what-is-a-proforma-invoice/proforma-downloading-pdf-invoice-to-email.webp" alt="Business owner downloading a PDF invoice to email to a client" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /></div>
            <p>{"MakeInvo fits the final-invoice stage of this process. It does not offer a proforma feature or template, so this guide is not suggesting a proforma toggle or a way to generate one inside the app."}</p>
            <p>{"Once you need the actual invoice, add the business and client details, describe the work or goods, and review the totals. MakeInvo supports line-item tax where applicable and PDF downloads. You download the invoice and email it to your client yourself; built-in email delivery and automatic reminder sending are not currently available."}</p>
            <p>{"You can create a guest invoice without signing up. An account lets you keep clients and invoice history. Read "}<Link href="/features">{"what MakeInvo does"}</Link>{" for the current capabilities, or follow "}<Link href="/blog/how-to-make-an-invoice-online">{"how to make an invoice online"}</Link>{" for the final-invoice steps."}</p>
            <h2>{"Frequently asked questions"}</h2>
            <h3>{"What is a proforma invoice used for?"}</h3>
            <p>{"It sets out a proposed transaction for review or invites payment before supply. Explain which purpose applies when you send it."}</p>
            <h3>{"Is a proforma invoice legally binding?"}</h3>
            <p>{"The heading alone does not settle that question. Check the agreement, terms and acceptance, and get legal advice if an obligation is disputed."}</p>
            <h3>{"Is a proforma invoice a VAT invoice?"}</h3>
            <p>{"No. It cannot be used as evidence to reclaim input VAT, even if it shows an expected VAT amount. Ask for the appropriate VAT invoice. "}<a href="https://www.gov.uk/guidance/vat-guide-notice-700">{"GOV.UK"}</a></p>
            <h3>{"Does a proforma invoice need an invoice number?"}</h3>
            <p>{"Use a clear reference so you can identify it. Keeping proforma references separate from your actual invoice numbering is practical good practice, rather than a universal numbering requirement."}</p>
            <h3>{"What is the difference between a proforma invoice and a quote?"}</h3>
            <p>{"A quote presents a proposed price and scope. A proforma presents transaction details in an invoice-style document and may invite advance payment. Their contents and purpose can overlap."}</p>
            <h3>{"What happens after a proforma invoice is paid?"}</h3>
            <p>{"Record the payment, connect it to the order and issue the appropriate invoice. VAT-registered suppliers should check HMRC’s invoicing and tax-point rules rather than waiting automatically until delivery."}</p>
            <h2>{"Create the final invoice"}</h2>
            <p>{"Use a proforma to explain the proposed transaction, then move to the right invoice when the transaction requires it. Keep the labels clear and the payment records connected. When you are ready for the actual invoice, open MakeInvo’s "}<Link href="/">{"free invoice generator"}</Link>{", review your details and download the PDF to send yourself."}</p>
          </div>
          <div className="mt-10 border-t border-border pt-8">
            <Link href="/blog" className="text-sm font-medium text-primary hover:underline">&larr; Back to the blog</Link>
          </div>
        </article>
      </div>
    </>
  )
}
