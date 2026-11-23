import type { Metadata } from "next"
import Script from "next/script"
import Link from "next/link"
import Image from "next/image"
import { getSiteUrl } from "@/lib/utils/site-url"
import { getBlogPost } from "@/lib/data/blog-posts"

const siteUrl = getSiteUrl()
const post = getBlogPost("how-to-invoice-as-a-freelancer-uk")!
const pageUrl = `${siteUrl}/blog/${post.slug}`
const coverImageUrl = `${siteUrl}${post.coverImage}`

export const metadata: Metadata = {
  title: "How to Invoice as a Freelancer in the UK (Step by Step)",
  description: post.excerpt,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "How to Invoice as a Freelancer in the UK (Step by Step) | MakeInvo",
    description: post.excerpt,
    url: pageUrl,
    type: "article",
    publishedTime: post.publishedDate,
    modifiedTime: post.updatedDate,
    images: [{ url: coverImageUrl, width: 1200, height: 675, alt: post.coverImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Invoice as a Freelancer in the UK (Step by Step)",
    description: post.excerpt,
    images: [coverImageUrl],
  },
  robots: { index: true, follow: true },
}

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "How to Invoice as a Freelancer in the UK: A Step-by-Step Guide",
    "description": "Agree terms, number your invoices, bill day rates, hours or projects, add expenses and VAT only if registered, and get paid on time. A UK freelancer guide.",
    "image": "https://makeinvo.com/blog/how-to-invoice-as-a-freelancer-uk/how-to-invoice-as-a-freelancer-uk-featured.webp",
    "datePublished": "2026-11-23",
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
      "@id": "https://makeinvo.com/blog/how-to-invoice-as-a-freelancer-uk"
    },
    "inLanguage": "en-GB"
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Do I need to be registered as self-employed to send an invoice?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "If you're working for yourself, you may need to register with HMRC as self-employed, and the rules depend on your circumstances. Check GOV.UK's guidance on becoming a sole trader or speak to an accountant. This isn't tax advice."
        }
      },
      {
        "@type": "Question",
        "name": "What should a freelance invoice include in the UK?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "At minimum: a unique invoice number, your details, your client's details, a description of the work, the supply date, the invoice date, the amounts and the total. Sole traders also need their name and any business name. See what to include on a UK invoice for the full checklist."
        }
      },
      {
        "@type": "Question",
        "name": "How should I number my invoices?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Use a simple running sequence, such as INV-0001, INV-0002, and keep the same format throughout. Each invoice needs a unique number, so never reuse one."
        }
      },
      {
        "@type": "Question",
        "name": "Should a freelancer charge VAT?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Only if you're VAT-registered. If you're not, don't add VAT to your invoices. Check GOV.UK for the current registration rules."
        }
      },
      {
        "@type": "Question",
        "name": "Can I invoice before the work is finished?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, if you've agreed it. A deposit or milestone invoice is common for larger projects. Put the payment schedule in your written agreement and label each invoice clearly."
        }
      },
      {
        "@type": "Question",
        "name": "How long does a client have to pay a freelancer invoice?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It depends on what you agreed. If you haven't agreed a payment date, GOV.UK says the customer must pay within 30 days of receiving your invoice or the goods or service. It's better to state a due date on every invoice. For more, see our guide to invoice payment terms in the UK."
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
        "name": "How to Invoice as a Freelancer in the UK: A Step-by-Step Guide",
        "item": "https://makeinvo.com/blog/how-to-invoice-as-a-freelancer-uk"
      }
    ]
  }
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })
}

export default function FreelancerInvoicePage() {
  return (
    <>
      {schemas.map((schema) => (
        <Script key={schema["@type"]} id={`freelancer-guide-${schema["@type"]}`} strategy="beforeInteractive" type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      ))}
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-foreground hover:underline">Blog</Link>
            <span className="mx-2">/</span>
            <span aria-current="page">Freelance invoicing</span>
          </nav>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            By {post.author} &middot; Published {formatDate(post.publishedDate)} &middot; {post.readingTime} &middot; Updated {formatDate(post.updatedDate)}
          </p>
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-xl border border-border bg-muted">
            <Image src={post.coverImage} alt={post.coverImageAlt} fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          </div>
          <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-h2:text-2xl prose-h2:font-bold prose-h3:text-lg prose-h3:font-semibold">
            <h2>{"Short answer: how to invoice as a freelancer in the UK"}</h2>
            <p>{"Agree the terms in writing before you start work. Then send an invoice with a unique number, your details, your client's details, a clear description of the work, the supply date, the invoice date and the total owed. Bill the way you agreed, whether that's by the hour, by the day or per project. List any expenses separately and add VAT only if you're VAT-registered. State a due date and send the invoice promptly. Keep a copy, and chase politely if the money doesn't arrive."}</p>
            <p>{"That's the whole process in one paragraph. The rest of this guide takes each step in turn, so your first invoice (or your fiftieth) looks professional and is easy for a client to pay. If you'd rather not build an invoice from scratch, MakeInvo's "}<Link href="/">{"free invoice generator"}</Link>{" lets you create and download a PDF without signing up."}</p>
            <p>{"This guide is general information, not tax or legal advice. For questions about your own circumstances, check GOV.UK and HMRC or speak to an accountant."}</p>
            <h2>{"Before your first invoice: agree the terms in writing"}</h2>
            <div className="not-prose relative my-8 aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted"><Image src="/blog/how-to-invoice-as-a-freelancer-uk/freelance-agreement-before-invoice.webp" alt="Freelancer reviewing a project agreement before starting work" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /></div>
            <p>{"Most invoicing problems start before the invoice exists. A client who is vague about what they're paying for, or who pays, will be vague about paying on time. A short written agreement settles most of that. For a small job, a clear email that the client confirms can do the job. For bigger or longer projects, a proper contract is worth having."}</p>
            <p>{"The Small Business Commissioner's advice on "}<a href="https://www.smallbusinesscommissioner.gov.uk/help-and-guidance/all-advice/getting-invoices-right/">{"getting invoices right"}</a>{" makes the same point. Work out who actually pays, confirm the payment schedule up front, and ask whether the client needs a purchase order (PO) number on the invoice. The person you work with day to day isn't always the person who processes the payment, and a missing PO number is an easy way for an invoice to stall."}</p>
            <h3>{"What to put in a simple agreement"}</h3>
            <p>{"You don't need legal language. A short written agreement should cover:"}</p>
            <ul><li><strong>{"Scope:"}</strong>{" what you'll deliver, and what is not included."}</li><li><strong>{"Price and basis:"}</strong>{" hourly rate, day rate or fixed fee."}</li><li><strong>{"Timing:"}</strong>{" key dates or deadlines, and how many rounds of revisions are included."}</li><li><strong>{"Payment schedule:"}</strong>{" whether you invoice at the end, in stages, or monthly, and whether you take a deposit."}</li><li><strong>{"Payment terms:"}</strong>{" how many days the client has to pay after receiving your invoice."}</li><li><strong>{"Expenses:"}</strong>{" which costs you can pass on and whether you need approval first."}</li><li><strong>{"Invoice details:"}</strong>{" who the invoice is addressed to, and any PO number or reference the client needs."}</li></ul>
            <p>{"Having this in writing also makes the invoice easy to write, because every line traces back to something both of you already agreed."}</p>
            <h2>{"What a UK freelancer invoice must include"}</h2>
            <p>{"GOV.UK sets out what an invoice must contain in its guide to "}<a href="https://www.gov.uk/invoicing-and-taking-payment-from-customers/invoices-what-they-must-include">{"what invoices must include"}</a>{". In plain terms, your invoice needs:"}</p>
            <ul><li>{"a unique identification number"}</li><li>{"your name or company name, address and contact information"}</li><li>{"the name and address of the customer you're invoicing"}</li><li>{"a clear description of what you're charging for"}</li><li>{"the date the goods or service were provided (the supply date)"}</li><li>{"the date of the invoice"}</li><li>{"the amount or amounts being charged"}</li><li>{"the VAT amount, if applicable"}</li><li>{"the total amount owed"}</li></ul>
            <p>{"If you're a sole trader, which most freelancers are, GOV.UK also says the invoice must show your name and any business name you're using. If you trade under a business name, it must also include an address where legal documents can be delivered to you."}</p>
            <p>{"Always check the live GOV.UK page, because official guidance can change. For a fuller walk-through of each item, see our guide to "}<Link href="/blog/what-to-include-on-a-uk-invoice">{"what to include on a UK invoice"}</Link>{"."}</p>
            <h2>{"How to number your invoices"}</h2>
            <p>{"GOV.UK asks for a unique identification number on every invoice, so no two invoices should share one. The simplest approach is a running sequence: INV-0001, INV-0002, INV-0003 and so on. You can include the year or a short client code if that helps you find things later, but pick one format and stick to it."}</p>
            <p>{"Numbering consistently helps in three ways:"}</p>
            <ul><li>{"You can see at a glance which invoice a client is referring to."}</li><li>{"Gaps and duplicates stand out, which makes your own records easier to check."}</li><li>{"Your accountant, or you at tax time, can match payments to invoices without guesswork."}</li></ul>
            <p>{"If you correct a mistake, issue a new invoice or a clearly labelled credit note rather than reusing a number."}</p>
            <h2>{"How to invoice by the hour, by the day or by the project"}</h2>
            <p>{"How you bill depends on what you agreed. The invoice should make that obvious to the person reading it."}</p>
            <h3>{"Hourly rate"}</h3>
            <p>{"State the hours worked and your hourly rate. Describe what the hours covered, not just a total, because a client who can see what they paid for is less likely to query it. Many freelancers invoice hourly work monthly. Say which period the invoice covers, and keep a simple timesheet so you can back it up if asked."}</p>
            <h3>{"Day rate"}</h3>
            <p>{"State the number of days worked, the days or dates they fall on, and your day rate. If you've agreed what counts as a day, such as a set number of hours, put that in your written agreement rather than relying on the invoice to explain it. An illustrative line might read: \"Design work, 3 days at your agreed day rate\"."}</p>
            <h3>{"Fixed project fee"}</h3>
            <p>{"For a fixed price, describe the deliverable and refer to the scope you agreed. If the client asks for extra work outside that scope, quote it separately and invoice it as its own line, or its own invoice, so the original price stays clean. This is where the written agreement earns its keep."}</p>
            <p>{"Whichever model you use, avoid vague one-line descriptions. \"Services\" tells the client nothing. \"Website copywriting, homepage and three service pages\" tells them exactly what the money is for."}</p>
            <h2>{"Deposits, milestones and retainers"}</h2>
            <p>{"You don't have to wait until the work is finished to invoice. Three common patterns:"}</p>
            <ul><li><strong>{"Deposit:"}</strong>{" an upfront invoice before work begins, often used for new clients or larger projects."}</li><li><strong>{"Milestones:"}</strong>{" staged invoices tied to agreed points in a project, such as delivery of a first draft."}</li><li><strong>{"Retainer:"}</strong>{" a recurring invoice for an ongoing arrangement, such as a regular amount of work each month."}</li></ul>
            <p>{"GOV.UK confirms that you can set your own payment terms, including payment upfront. Label each invoice clearly, for example \"Deposit\" or \"Milestone 2 of 3\", and make sure the schedule is in your written agreement. It's also worth saying whether a deposit is deducted from the final invoice. Then the final bill shows what's already been paid and what remains."}</p>
            <h2>{"Adding expenses to an invoice"}</h2>
            <p>{"If you've agreed to recharge costs to the client, list them as separate lines below your fees, with a short description of each. Keep the receipts, and keep a note of the client's approval if you agreed it by email."}</p>
            <p>{"Be clear in your agreement about which expenses you'll pass on and which are part of your own running costs. Surprises on an invoice are the quickest route to a dispute. How expenses are treated for tax is a matter for HMRC or your accountant, so this guide doesn't cover it."}</p>
            <h2>{"VAT: only if you are registered"}</h2>
            <p>{"Charge VAT on your invoices only if you're VAT-registered. If you're not registered, your invoice shouldn't show VAT at all. If you are registered, the invoice needs to show the VAT amount, and GOV.UK has specific rules for VAT invoices, including your VAT number."}</p>
            <p>{"Whether you need to register depends on your taxable turnover. You can also choose to register voluntarily. This guide doesn't quote the threshold, because it can change. Check "}<a href="https://www.gov.uk/register-for-vat">{"when to register for VAT"}</a>{" on GOV.UK for the current rules, and ask an accountant if you're unsure."}</p>
            <h2>{"Payment terms and due dates"}</h2>
            <p>{"Put a clear due date on every invoice. \"Payable within 14 days\" or a specific date such as \"Due: 14 December\" leaves no room for doubt, and it shows up in the client's accounts system."}</p>
            <p>{"GOV.UK's guidance on "}<a href="https://www.gov.uk/invoicing-and-taking-payment-from-customers/payment-obligations">{"payment obligations"}</a>{" says you can set your own payment terms, such as discounts for early payment or payment upfront. It also says that unless you agree a payment date, the customer must pay within 30 days of receiving your invoice or the goods or service. Agreeing a date in advance is usually better than relying on that default, especially if you need cash flow to be predictable."}</p>
            <p>{"Include your payment details on the invoice: account name, sort code and account number, plus any reference the client should use. Our guide to "}<Link href="/blog/invoice-payment-terms-uk">{"invoice payment terms in the UK"}</Link>{" covers the options in more detail."}</p>
            <h2>{"Sending the invoice and keeping records"}</h2>
            <div className="not-prose relative my-8 aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted"><Image src="/blog/how-to-invoice-as-a-freelancer-uk/freelancer-invoice-paid-records.webp" alt="Freelancer checking paid invoices and keeping records" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /></div>
            <p>{"Send the invoice as soon as the work, or the agreed stage, is done. Prompt invoices get paid sooner, and the job is fresh in the client's mind. Send it to the person who handles payments, not just the person who commissioned the work, and include any PO number they asked for."}</p>
            <p>{"Then keep a record. Save a copy of every invoice you send, note the date each one is paid, and keep supporting paperwork such as the agreement, timesheets and expense receipts. A tidy record means you can answer a client's question in minutes and you'll be ready at tax time. It also helps to know the difference between the documents: an invoice asks for payment, while a receipt confirms it was made. See "}<Link href="/blog/invoice-vs-receipt">{"invoice vs receipt"}</Link>{" for a quick explainer."}</p>
            <h2>{"If a client pays late"}</h2>
            <p>{"Most late payments are administrative, so start with a friendly reminder that includes the invoice number, amount and due date. If that gets no response, follow up more firmly and offer to talk it through."}</p>
            <p>{"GOV.UK says you have the right to charge interest on late payment, though you can choose not to. Its page on "}<a href="https://www.gov.uk/late-commercial-payments-interest-debt-recovery/charging-interest-commercial-debt">{"charging interest on commercial debt"}</a>{" explains how this works for business-to-business invoices. For a step-by-step approach to the conversation itself, read "}<Link href="/blog/how-to-chase-a-late-invoice-uk">{"how to chase a late invoice"}</Link>{"."}</p>
            <h2>{"How to create a freelance invoice in MakeInvo"}</h2>
            <div className="not-prose relative my-8 aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted"><Image src="/blog/how-to-invoice-as-a-freelancer-uk/makeinvo-freelance-invoice-screenshot.webp" alt="MakeInvo invoice editor with an example freelance invoice" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /></div>
            <p>{"MakeInvo is built to make the steps above quicker:"}</p>
            <ol><li>{"Open the "}<Link href="/">{"free invoice generator"}</Link>{" on the homepage."}</li><li>{"Add your details, your client's details and the invoice number."}</li><li>{"Add your line items, such as hours, days or a fixed fee, and any expenses."}</li><li>{"Set the due date and payment details."}</li><li>{"Download the PDF."}</li></ol>
            <p>{"You can do all of this as a guest, without signing up. If you create a free account, MakeInvo saves your clients and invoice history, so repeat invoices take less typing. Registered users can also email an invoice or share it as a link, for example over WhatsApp."}</p>
            <p>{"If you want a ready-made layout to start from, browse the "}<Link href="/invoice-templates">{"invoice templates"}</Link>{". The "}<Link href="/features">{"features"}</Link>{" page lists what else MakeInvo can do. For a fuller walk-through of the process, see "}<Link href="/blog/how-to-make-an-invoice-online">{"how to make an invoice online"}</Link>{"."}</p>
            <h2>{"Frequently asked questions"}</h2>
            <h3>{"Do I need to be registered as self-employed to send an invoice?"}</h3>
            <p>{"If you're working for yourself, you may need to register with HMRC as self-employed, and the rules depend on your circumstances. Check GOV.UK's guidance on becoming a sole trader or speak to an accountant. This isn't tax advice."}</p>
            <h3>{"What should a freelance invoice include in the UK?"}</h3>
            <p>{"At minimum: a unique invoice number, your details, your client's details, a description of the work, the supply date, the invoice date, the amounts and the total. Sole traders also need their name and any business name. See "}<Link href="/blog/what-to-include-on-a-uk-invoice">{"what to include on a UK invoice"}</Link>{" for the full checklist."}</p>
            <h3>{"How should I number my invoices?"}</h3>
            <p>{"Use a simple running sequence, such as INV-0001, INV-0002, and keep the same format throughout. Each invoice needs a unique number, so never reuse one."}</p>
            <h3>{"Should a freelancer charge VAT?"}</h3>
            <p>{"Only if you're VAT-registered. If you're not, don't add VAT to your invoices. Check GOV.UK for the current registration rules."}</p>
            <h3>{"Can I invoice before the work is finished?"}</h3>
            <p>{"Yes, if you've agreed it. A deposit or milestone invoice is common for larger projects. Put the payment schedule in your written agreement and label each invoice clearly."}</p>
            <h3>{"How long does a client have to pay a freelancer invoice?"}</h3>
            <p>{"It depends on what you agreed. If you haven't agreed a payment date, GOV.UK says the customer must pay within 30 days of receiving your invoice or the goods or service. It's better to state a due date on every invoice. For more, see our guide to "}<Link href="/blog/invoice-payment-terms-uk">{"invoice payment terms in the UK"}</Link>{"."}</p>
            <h2>{"Create your next freelance invoice"}</h2>
            <p>{"A clear agreement, a complete invoice and a firm due date make freelance invoicing much less stressful. When you're ready to send your next one, open MakeInvo's "}<Link href="/">{"free invoice generator"}</Link>{" and create your invoice."}</p>
          </div>
          <div className="mt-10 border-t border-border pt-8">
            <Link href="/blog" className="text-sm font-medium text-primary hover:underline">&larr; Back to the blog</Link>
          </div>
        </article>
      </div>
    </>
  )
}
