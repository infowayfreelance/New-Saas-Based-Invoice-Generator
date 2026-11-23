import type { Metadata } from "next"
import Script from "next/script"
import Link from "next/link"
import Image from "next/image"
import { getSiteUrl } from "@/lib/utils/site-url"
import { getBlogPost } from "@/lib/data/blog-posts"

const siteUrl = getSiteUrl()
const post = { ...getBlogPost("invoice-payment-terms-uk")!, updatedDate: "2026-11-23" }
const pageUrl = `${siteUrl}/blog/${post.slug}`
const coverImageUrl = `${siteUrl}${post.coverImage}`

export const metadata: Metadata = {
  title: "Invoice Payment Terms UK: Net 30, Net 14 & More",
  description: post.excerpt,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Invoice Payment Terms UK: Net 30, Net 14 & More | MakeInvo",
    description: post.excerpt,
    url: pageUrl,
    type: "article",
    publishedTime: post.publishedDate,
    modifiedTime: post.updatedDate,
    images: [{ url: coverImageUrl, width: 1200, height: 675, alt: post.coverImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Invoice Payment Terms UK: Net 30, Net 14 & More",
    description: post.excerpt,
    images: [coverImageUrl],
  },
  robots: { index: true, follow: true },
}

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "Invoice Payment Terms Explained: Net 30, Due on Receipt and More (UK Guide)",
    "description": "What invoice payment terms like Net 7, Net 30 and EOM mean, UK legal time limits, how to choose terms and how to word them on your invoice clearly.",
    "image": "https://makeinvo.com/blog/invoice-payment-terms-uk/invoice-payment-terms-uk-featured.webp",
    "datePublished": "2026-11-22",
    "dateModified": "2026-11-23",
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
      "@id": "https://makeinvo.com/blog/invoice-payment-terms-uk"
    },
    "url": "https://makeinvo.com/blog/invoice-payment-terms-uk",
    "inLanguage": "en-GB"
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Does Net 30 mean the end of next month?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. When counted from the invoice date, Net 30 means thirty calendar days later. End-of-month arrangements use a different starting point, so show the actual due date rather than relying on the abbreviation."
        }
      },
      {
        "@type": "Question",
        "name": "Are Net 7 and Net 14 working days?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Normally they refer to calendar days. If you and the customer agree working days instead, state that clearly and put the resulting due date on the invoice."
        }
      },
      {
        "@type": "Question",
        "name": "Does due on receipt mean the invoice is paid?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. It says when payment is expected. You still need to check that the money has arrived before recording the invoice as paid."
        }
      },
      {
        "@type": "Question",
        "name": "What if the customer never agreed a deadline?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For commercial payments, GOV.UK says payment becomes late thirty days after receipt of the invoice or the goods or service, whichever is later. Check the rules for your transaction rather than assuming the invoice date alone starts that period."
        }
      },
      {
        "@type": "Question",
        "name": "Can a business agree more than sixty days?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "GOV.UK allows a longer business payment period if it is fair to both parties. Make the agreement clear and seek advice if the proposed terms are difficult to assess."
        }
      },
      {
        "@type": "Question",
        "name": "Can I change terms for an invoice already sent?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Discuss the change with the customer and keep a record of any agreement. Do not assume that sending a replacement PDF with a different deadline changes the original contract."
        }
      },
      {
        "@type": "Question",
        "name": "Should I include bank details and a payment reference?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, where bank transfer is the agreed method. Give the customer clear payment instructions and ask them to quote the invoice number so you can match the money to the right bill."
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
        "name": "Invoice Payment Terms Explained: Net 30, Due on Receipt and More (UK Guide)",
        "item": "https://makeinvo.com/blog/invoice-payment-terms-uk"
      }
    ]
  }
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })
}

export default function InvoicePaymentTermsPage() {
  return (
    <>
      {schemas.map((schema) => (
        <Script key={schema["@type"]} id={`payment-terms-${schema["@type"]}`} strategy="beforeInteractive" type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      ))}
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-foreground hover:underline">Blog</Link>
            <span className="mx-2">/</span>
            <span aria-current="page">Invoice payment terms</span>
          </nav>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            By {post.author} &middot; Published {formatDate(post.publishedDate)} &middot; {post.readingTime} &middot; Updated {formatDate(post.updatedDate)}
          </p>
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-xl border border-border bg-muted">
            <Image src={post.coverImage} alt={post.coverImageAlt} fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          </div>
          <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-h2:text-2xl prose-h2:font-bold prose-h3:text-lg prose-h3:font-semibold">
            <p>{"“Net 30” may be familiar to your customer's accounts team, but another customer may have no idea when it means they should pay. A short term becomes much more useful when you put a real due date beside it."}</p>
            <p>{"Invoice payment terms describe the payment arrangement: the deadline, how to pay and any agreed conditions. This guide explains the common labels, how to choose a suitable deadline and how to write the arrangement clearly. It is general information, not legal, tax or accounting advice."}</p>
            <h2>{"Agree the deadline before sending the invoice"}</h2>
            <p>{"Your invoice should reflect an agreement the customer already understands. Adding a new payment policy after the work is complete can create a disagreement just when you want the customer to approve the bill."}</p>
            <p>{"Put the terms in your quote, proposal or booking agreement first. Check that the person placing the order can accept them. For larger customers, ask whether you need a purchase order, supplier registration or a particular billing address before work starts."}</p>
            <p>{"That small check can prevent an invoice sitting in the wrong inbox. It also helps you plan your own spending: a payment deadline is useful only if you know when you can invoice and what the customer needs to process it."}</p>
            <h2>{"Net 7, Net 14 and Net 30 in plain English"}</h2>
            <div className="not-prose relative my-8 aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted"><Image src="/blog/invoice-payment-terms-uk/payment-terms-calendar-due-date.webp" alt="Calendar with a circled due date and a Net 30 sticky note" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /></div>
            <p>{"“Net” refers to the full amount being due within the stated period. On an invoice using the invoice date as its starting point, Net 7 means seven days later, Net 14 means fourteen days later and Net 30 means thirty days later."}</p>
            <p>{"These are normally calendar days, unless your agreement specifies working days. Do not quietly add extra time for weekends or assume the customer counts them differently. Write the actual deadline and agree any adjustment in advance."}</p>
            <p>{"The following worked example uses an invoice dated "}<strong>{"10 January 2027"}</strong>{". It assumes the day count starts from that invoice date and that the customer receives it on the same day."}</p>
            <div className="overflow-x-auto"><table><thead><tr><th scope="col">{"Payment term"}</th><th scope="col">{"How to read it"}</th><th scope="col">{"Example deadline"}</th></tr></thead><tbody><tr><th scope="row">{"Due on receipt"}</th><td>{"Payment is due when the invoice arrives"}</td><td>{"10 January 2027"}</td></tr><tr><th scope="row">{"Net 7"}</th><td>{"Seven calendar days after the invoice date"}</td><td>{"17 January 2027"}</td></tr><tr><th scope="row">{"Net 14"}</th><td>{"Fourteen calendar days after the invoice date"}</td><td>{"24 January 2027"}</td></tr><tr><th scope="row">{"Net 30"}</th><td>{"Thirty calendar days after the invoice date"}</td><td>{"9 February 2027"}</td></tr><tr><th scope="row">{"Net 60"}</th><td>{"Sixty calendar days after the invoice date"}</td><td>{"11 March 2027"}</td></tr><tr><th scope="row">{"EOM"}</th><td>{"Payment at the end of the invoice month"}</td><td>{"31 January 2027"}</td></tr><tr><th scope="row">{"30 days EOM"}</th><td>{"Thirty days after that month ends"}</td><td>{"2 March 2027"}</td></tr></tbody></table></div>
            <p>{"The difference between Net 30 and 30 days EOM can be substantial. One counts from the invoice date; the other waits until month end before counting. Avoid using EOM wording without explaining how you calculate the date."}</p>
            <h2>{"What does due on receipt mean?"}</h2>
            <p>{"Due on receipt asks the customer to pay when they receive the invoice. It does not give them a further seven or thirty days, and it does not mean payment has already been made."}</p>
            <p>{"It can suit a small one-off job where immediate payment was agreed. However, a business customer may need someone to approve the charge before a bank transfer can be arranged. Check that your chosen term fits the way the customer pays rather than expecting the label to change their process."}</p>
            <p>{"If payment must arrive before work begins, say “payment in advance” instead. If you expect payment when goods arrive, say “payment on delivery”. Those describe different stages and should not be treated as interchangeable."}</p>
            <h2>{"Other arrangements for longer jobs"}</h2>
            <p>{"A single final invoice is not always the best fit. When you need to buy materials or reserve time, you might agree a deposit followed by a balance payment. For a longer project, separate invoices at named milestones can make the amount due easier to understand."}</p>
            <p>{"Describe each stage precisely. “Design approval” or “delivery of the final files” is clearer than “later payment”. State the deadline for each stage and explain whether work continues while a payment is outstanding."}</p>
            <p>{"A retainer is another arrangement: the client pays for agreed ongoing work under the schedule in your contract. Repeating invoices should still identify the period they cover so the customer does not mistake them for duplicates."}</p>
            <p>{"You may also see an early-payment discount written as “2/10 Net 30”. That generally offers a 2% discount for payment within ten days, with the full amount due within thirty. Explain both deadlines in words, and check the effect on your margin before offering a discount."}</p>
            <h2>{"UK payment periods: agreements and the default rule"}</h2>
            <p><a href="https://www.gov.uk/invoicing-and-taking-payment-from-customers/payment-obligations">{"GOV.UK's payment obligations guidance"}</a>{" explains that you can set payment terms, including advance payment or an early-payment discount. Make the arrangement clear before the transaction."}</p>
            <p>{"For commercial payments, "}<a href="https://www.gov.uk/late-commercial-payments-interest-debt-recovery">{"GOV.UK's late-payment guidance"}</a>{" says agreed deadlines should usually be within 60 days for businesses and 30 days for public authorities. Businesses can agree a longer period if it is fair to both sides."}</p>
            <p>{"Without an agreed payment date, a commercial payment becomes late 30 days after the customer receives the invoice or the goods or service, whichever happens later. This is a default rule, not a reason to leave the due date off your invoice."}</p>
            <p>{"These commercial rules concern business transactions. Do not assume the same interest rights apply when invoicing a private customer. For an unusual contract, disputed charge or public-sector arrangement, check the guidance and get advice suited to the situation."}</p>
            <h2>{"Choose terms you can work with"}</h2>
            <p>{"Start with your own costs. If you pay for supplies before starting a job, waiting until the end of a long project and then allowing another month may leave a gap in your cash flow. A deposit or stage payment could be more practical than simply shortening the final deadline."}</p>
            <p>{"Next, ask how the customer handles invoices. A monthly payment run or an approval process may affect the date they can agree to. Find that out before committing to the work, and decide whether the arrangement is workable for you."}</p>
            <p>{"Consider the size of the job and your experience with the client. You might ask a new customer for payment in advance while offering an established customer an agreed period of credit. Avoid promising terms you cannot afford just because another supplier uses them."}</p>
            <p>{"Finally, choose a process you can monitor. Keep a list of upcoming due dates and check payments regularly. Short terms do little good if you do not notice an unpaid invoice until several weeks later."}</p>
            <h2>{"Write the payment instructions as one clear block"}</h2>
            <div className="not-prose relative my-8 aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted"><Image src="/blog/invoice-payment-terms-uk/invoice-payment-terms-wording.webp" alt="Payment terms and due date section at the bottom of an invoice" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /></div>
            <p>{"The customer should be able to find the deadline and payment details without reading the whole document. Put the term beside a specific date, then explain how to pay and which reference to use."}</p>
            <p>{"Include:"}</p>
            <ul><li>{"the agreed term and exact due date;"}</li><li>{"the bank details or payment route;"}</li><li>{"the invoice number to quote as a reference;"}</li><li>{"any agreed deposit or stage-payment details;"}</li><li>{"a contact for questions about the charge."}</li></ul>
            <p>{"For the rest of the document, follow our checklist of "}<Link href="/blog/what-to-include-on-a-uk-invoice">{"what to include on a UK invoice"}</Link>{". Payment instructions do not replace the business details, supply dates and descriptions an invoice needs."}</p>
            <h3>{"Wording you can adapt"}</h3>
            <p>{"For the worked example above: “Payment terms: Net 14 from the invoice date. Please pay by 24 January 2027 using the bank details below. Quote invoice INV-0107 as your payment reference.”"}</p>
            <p>{"For advance payment: “Payment is required before work begins, as agreed in your booking confirmation. Please use this invoice number as the reference.”"}</p>
            <p>{"For a staged project: “This invoice covers the agreed design approval stage. Payment is due on the date shown above. The remaining stage will be invoiced separately under our agreement.”"}</p>
            <p>{"Use only wording that matches your contract. Do not add a late-payment fee or cancellation condition for the first time on the invoice and assume that printing it makes it agreed."}</p>
            <h2>{"Make payment easier to process"}</h2>
            <p>{"Send the invoice when the agreed billing stage is reached. Check the customer's name, purchase order and billing address before sending. Attach the correct file and make the invoice number easy to find in the email subject."}</p>
            <p>{"Where the customer has a billing portal, find out whether an upload is required as well as an email. Keep a record of submission and respond to reasonable queries promptly. An accounts team cannot resolve a missing reference if you do not know they asked for it."}</p>
            <p>{"A friendly reminder before the deadline can help confirm that everything is in place. After the due date, check your payment records before chasing: a transfer might use an unexpected reference or cover several invoices together."}</p>
            <h2>{"What to do when a business invoice is overdue"}</h2>
            <p>{"Begin by checking the agreement, delivery record and payment details. Ask the customer whether there is a query or an expected payment date. Keep your message factual and save the correspondence."}</p>
            <p>{"Statutory interest on qualifying late business payments is 8% plus the Bank of England base rate. A different contractual interest rate can affect whether you can claim statutory interest. See "}<a href="https://www.gov.uk/late-commercial-payments-interest-debt-recovery/charging-interest-commercial-debt">{"GOV.UK's interest guidance"}</a>{" before calculating a charge; fixed recovery compensation may also apply under the commercial rules."}</p>
            <p>{"You do not have to start with a legal demand. Our guide to "}<Link href="/blog/how-to-chase-a-late-invoice-uk">{"how to chase a late invoice in the UK"}</Link>{" explains a measured follow-up sequence and links to the official guidance. If the debt is disputed, deal with the substance of the dispute rather than sending repeated reminders alone."}</p>
            <h2>{"Put the arrangement on your MakeInvo invoice"}</h2>
            <div className="not-prose relative my-8 aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted"><Image src="/blog/invoice-payment-terms-uk/freelancer-tracking-paid-invoices.webp" alt="Freelancer reviewing an invoice list with paid, unpaid and overdue statuses" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /></div>
            <p>{"The free "}<Link href="/">{"MakeInvo invoice generator"}</Link>{" lets you prepare a PDF invoice without signing up, a watermark or a credit card. Add the due date and use the terms or notes area to explain the payment arrangement. Review the finished PDF before you send it."}</p>
            <p>{"A free account gives you saved clients and invoice history. On plans that include them, recurring invoices, automatic reminders after the due date and payment recording can support your follow-up routine. Payment records can include partial payments, helping you distinguish money received from a remaining balance."}</p>
            <p>{"Check the current "}<Link href="/features">{"features"}</Link>{" and "}<Link href="/pricing">{"pricing page"}</Link>{" for plan availability. If this is your first invoice, use our guide to "}<Link href="/blog/how-to-make-an-invoice-online">{"making an invoice online"}</Link>{", or start with the "}<Link href="/invoice-templates">{"invoice templates"}</Link>{"."}</p>
            <h2>{"Frequently asked questions"}</h2>
            <h3>{"Does Net 30 mean the end of next month?"}</h3>
            <p>{"No. When counted from the invoice date, Net 30 means thirty calendar days later. End-of-month arrangements use a different starting point, so show the actual due date rather than relying on the abbreviation."}</p>
            <h3>{"Are Net 7 and Net 14 working days?"}</h3>
            <p>{"Normally they refer to calendar days. If you and the customer agree working days instead, state that clearly and put the resulting due date on the invoice."}</p>
            <h3>{"Does due on receipt mean the invoice is paid?"}</h3>
            <p>{"No. It says when payment is expected. You still need to check that the money has arrived before recording the invoice as paid."}</p>
            <h3>{"What if the customer never agreed a deadline?"}</h3>
            <p>{"For commercial payments, GOV.UK says payment becomes late thirty days after receipt of the invoice or the goods or service, whichever is later. Check the rules for your transaction rather than assuming the invoice date alone starts that period."}</p>
            <h3>{"Can a business agree more than sixty days?"}</h3>
            <p>{"GOV.UK allows a longer business payment period if it is fair to both parties. Make the agreement clear and seek advice if the proposed terms are difficult to assess."}</p>
            <h3>{"Can I change terms for an invoice already sent?"}</h3>
            <p>{"Discuss the change with the customer and keep a record of any agreement. Do not assume that sending a replacement PDF with a different deadline changes the original contract."}</p>
            <h3>{"Should I include bank details and a payment reference?"}</h3>
            <p>{"Yes, where bank transfer is the agreed method. Give the customer clear payment instructions and ask them to quote the invoice number so you can match the money to the right bill."}</p>
            <h2>{"Check the date before you send"}</h2>
            <p>{"Read your invoice as the customer would: is it clear what they owe, how to pay and which day the money is due? Keep those details consistent with your agreement, then save a copy for your records. Find more practical billing guides on the "}<Link href="/blog">{"MakeInvo blog"}</Link>{"."}</p>
          </div>
          <div className="mt-10 border-t border-border pt-8">
            <Link href="/blog" className="text-sm font-medium text-primary hover:underline">&larr; Back to the blog</Link>
          </div>
        </article>
      </div>
    </>
  )
}
