import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getSiteUrl } from "@/lib/utils/site-url"
import { getBlogPost } from "@/lib/data/blog-posts"

const siteUrl = getSiteUrl()
const post = getBlogPost("invoice-vs-receipt")!
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
    "question": "Is an invoice the same as a receipt?",
    "answer": "No. An invoice asks for payment. A receipt confirms payment has been received. GOV.UK states that an invoice is not the same as a receipt."
  },
  {
    "question": "Do I have to give a receipt in the UK?",
    "answer": "There is generally no blanket legal requirement to issue a receipt for every sale, but it is good practice, especially for cash payments. Specific rules can apply in some situations, such as VAT, so check GOV.UK if you are unsure."
  },
  {
    "question": "Can a receipt be used as a VAT invoice?",
    "answer": "Sometimes. HMRC allows VAT-registered retailers to issue a simplified VAT invoice for supplies of £250 or less including VAT when a customer asks, and some till receipts include the required details. Check HMRC's VAT guidance for the exact requirements."
  },
  {
    "question": "Can I send a paid invoice instead of a receipt?",
    "answer": "Many small businesses send a copy of the invoice marked \"Paid\" with the payment date and amount. It links the payment to the original invoice number and gives the customer a clear record."
  },
  {
    "question": "What comes first, the invoice or the receipt?",
    "answer": "Usually the invoice. You send the invoice, the customer pays, and the receipt (or paid invoice) confirms the payment. At a shop till, payment is immediate, so you normally just get a receipt."
  },
  {
    "question": "Do I need an invoice if I am not VAT registered?",
    "answer": "GOV.UK's legal requirement to give an invoice applies when both parties are VAT registered. Many businesses that are not VAT registered still invoice customers because it is clearer for both sides and helps with record keeping."
  },
  {
    "question": "How long should I keep receipts and invoices?",
    "answer": "Sole traders must keep records for at least 5 years after the 31 January submission deadline for the relevant tax year. Limited companies generally keep records for 6 years from the end of the last financial year they relate to. Check GOV.UK for the details that apply to you."
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
            By {post.author} &middot; Published {formatDate(post.publishedDate)} &middot; {post.readingTime}
          </p>
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-xl border border-border bg-muted">
            <Image src={post.coverImage} alt={post.coverImageAlt} fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          </div>
          <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-h2:text-2xl prose-h2:font-bold prose-h3:text-lg prose-h3:font-semibold">
            <p>{"Invoices and receipts are easy to mix up. Both list what was sold, both show an amount, and both end up in your records. But they do different jobs, they are issued at different times, and the rules around them are not the same."}</p>
            <p>{"This guide explains the difference in plain English for UK freelancers, sole traders and small businesses: what each document is for, when you need one, what to include, how \"paid invoices\" fit in, and how long to keep your records. It is general information, not legal, tax or accounting advice. If your situation is complicated, check GOV.UK or speak to an accountant."}</p>
            <h2>{"Short answer: invoice vs receipt"}</h2>
            <ul><li><strong>{"An invoice is a request for payment."}</strong>{" It tells the customer what they owe, what it is for and when to pay."}</li><li><strong>{"A receipt is proof of payment."}</strong>{" It confirms that money has been received, how much, when and for what."}</li></ul>
            <p>{"GOV.UK puts it simply: an invoice is not the same as a receipt, which is an acknowledgement of payment."}</p>
            <p>{"In a typical sale, the invoice comes first and the receipt comes after the customer pays. In a shop or café, where payment happens straight away, you often only see a receipt."}</p>
            <h2>{"What is an invoice?"}</h2>
            <div className="not-prose relative my-8 aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted"><Image src="/blog/invoice-vs-receipt/invoice-request-for-payment.webp" alt="Freelancer reviewing an invoice on a laptop before sending it" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /></div>
            <p>{"An invoice is a document you send to a customer asking them to pay for goods or services you have supplied, or are about to supply. It sets out:"}</p>
            <ul><li>{"who is billing whom;"}</li><li>{"what was supplied;"}</li><li>{"how much is owed;"}</li><li>{"when payment is due and how to pay."}</li></ul>
            <p>{"Invoices are standard in business-to-business work and in any situation where the customer pays after the work is done, such as freelance projects, trades jobs, consulting and agency retainers."}</p>
            <p>{"In the UK, GOV.UK says you must give an invoice by law if both you and your customer are registered for VAT (a business-to-business transaction). Many businesses that are not VAT registered still issue invoices because customers expect them and they make bookkeeping much easier."}</p>
            <p>{"For a full checklist of what to put on a UK invoice, including VAT details, read our guide to "}<Link href="https://makeinvo.com/blog/what-to-include-on-a-uk-invoice">{"what a UK invoice must include"}</Link>{"."}</p>
            <h2>{"What is a receipt?"}</h2>
            <div className="not-prose relative my-8 aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted"><Image src="/blog/invoice-vs-receipt/receipt-proof-of-payment.webp" alt="Printed receipt confirming a card payment at a shop counter" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /></div>
            <p>{"A receipt confirms that a payment has been made. It is usually issued:"}</p>
            <ul><li>{"at the point of sale, when someone pays in a shop, on a website or in person;"}</li><li>{"after an invoice is paid, if the customer asks for confirmation;"}</li><li>{"when payment is made in cash, so both sides have a record."}</li></ul>
            <p>{"A receipt typically shows:"}</p>
            <ul><li>{"the seller's business name and contact details;"}</li><li>{"the date of payment;"}</li><li>{"what was bought or which invoice was paid;"}</li><li>{"the amount paid;"}</li><li>{"the payment method, such as card, bank transfer or cash;"}</li><li>{"any amount still outstanding, if it was a part-payment."}</li></ul>
            <p>{"In general there is no blanket UK legal requirement to issue a receipt for every sale, but giving one is good practice, especially for cash payments, and customers often need one for their own records or expense claims."}</p>
            <h2>{"Invoice vs receipt: side by side"}</h2>
            <div className="overflow-x-auto"><table><thead><tr><th scope="col"></th><th scope="col">{"Invoice"}</th><th scope="col">{"Receipt"}</th></tr></thead><tbody><tr><th scope="row">{"Purpose"}</th><td>{"Requests payment"}</td><td>{"Confirms payment"}</td></tr><tr><th scope="row">{"When issued"}</th><td>{"Before payment (after or during supply)"}</td><td>{"After payment"}</td></tr><tr><th scope="row">{"Shows amount due"}</th><td>{"Yes"}</td><td>{"Shows amount paid"}</td></tr><tr><th scope="row">{"Payment terms and due date"}</th><td>{"Yes"}</td><td>{"No"}</td></tr><tr><th scope="row">{"Payment method"}</th><td>{"Usually how to pay"}</td><td>{"How it was paid"}</td></tr><tr><th scope="row">{"Typical use"}</th><td>{"B2B work, freelancers, trades, services"}</td><td>{"Retail, online sales, confirming a paid invoice"}</td></tr><tr><th scope="row">{"Legal requirement in the UK"}</th><td>{"Required for VAT-registered B2B sales"}</td><td>{"Generally good practice rather than a blanket requirement"}</td></tr></tbody></table></div>
            <h2>{"What about VAT invoices and receipts?"}</h2>
            <p>{"If you are VAT registered, the rules are more specific. HMRC's VAT record-keeping guidance (VAT Notice 700/21) sets out what a full VAT invoice must contain."}</p>
            <p>{"Retailers have some flexibility. Under HMRC's guidance, a VAT-registered retailer does not have to issue a VAT invoice unless the customer asks for one. If the customer asks and the supply is £250 or less including VAT, the retailer can issue a "}<strong>{"simplified (less detailed) VAT invoice"}</strong>{". This is why some till receipts show the seller's VAT number and the VAT rate: they can double as a simplified VAT invoice."}</p>
            <p>{"The exact requirements depend on your circumstances, so check the current HMRC guidance before relying on a till-style receipt for VAT purposes."}</p>
            <h2>{"What is a \"paid invoice\"?"}</h2>
            <div className="not-prose relative my-8 aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted"><Image src="/blog/invoice-vs-receipt/paid-invoice-records.webp" alt="Folder of invoices with one marked paid next to a laptop" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /></div>
            <p>{"A paid invoice is an invoice that has been marked as settled. Some businesses send the customer a copy of the original invoice stamped or marked \"Paid\", with the payment date and amount, instead of a separate receipt."}</p>
            <p>{"That can work well for small businesses because:"}</p>
            <ul><li>{"the customer gets confirmation that matches the invoice they already have;"}</li><li>{"the invoice number links the payment to the original bill;"}</li><li>{"your own records show at a glance which invoices are settled."}</li></ul>
            <p>{"If a customer pays part of an invoice, record the part-payment and show the remaining balance clearly. Do not mark the invoice as fully paid until the whole amount has arrived."}</p>
            <h2>{"Other documents that get confused with invoices"}</h2>
            <p><strong>{"Quote or estimate:"}</strong>{" sent before the work to show the expected price. It is not a request for payment."}</p>
            <p><strong>{"Pro forma invoice:"}</strong>{" a preliminary invoice sent before supply, sometimes to request an upfront payment or for customs purposes. It is usually followed by a proper invoice."}</p>
            <p><strong>{"Bill:"}</strong>{" in everyday UK speech, \"bill\" often just means an invoice, for example a utility bill. GOV.UK uses \"invoice (bill)\" on its invoicing guidance page."}</p>
            <p><strong>{"Statement:"}</strong>{" a summary of several invoices and payments over a period, showing what is still owed overall."}</p>
            <p><strong>{"Credit note:"}</strong>{" issued to reduce or cancel an invoice, for example after a refund or a pricing error."}</p>
            <h2>{"When should you issue an invoice, a receipt or both?"}</h2>
            <p><strong>{"Freelancer or consultant billing a client after the work:"}</strong>{" send an invoice. When it is paid, update its status and, if the client asks, send confirmation of payment."}</p>
            <p><strong>{"Trades or contractor jobs:"}</strong>{" send an invoice for labour and materials when the job is done, or at agreed stages. Give a receipt if the customer pays in cash on the day."}</p>
            <p><strong>{"Shop, market stall or online store:"}</strong>{" customers pay at the point of sale, so a receipt is the usual document. If a VAT-registered business customer asks, provide a VAT invoice."}</p>
            <p><strong>{"Upfront deposits:"}</strong>{" you might send an invoice for the deposit, confirm receipt when it is paid, and later invoice the balance."}</p>
            <h2>{"How long should you keep invoices and receipts?"}</h2>
            <p>{"Invoices you issue and receipts you collect are part of your business records. GOV.UK sets minimum periods:"}</p>
            <ul><li><strong>{"Self-employed (sole traders and partners):"}</strong>{" keep records for at least 5 years after the 31 January submission deadline of the relevant tax year."}</li><li><strong>{"Limited companies:"}</strong>{" keep records for 6 years from the end of the last company financial year they relate to, or longer in some situations, such as when a transaction covers more than one accounting period."}</li><li><strong>{"VAT-registered businesses:"}</strong>{" follow HMRC's VAT record-keeping rules in VAT Notice 700/21."}</li></ul>
            <p>{"Keep copies of both the invoices you send and the receipts for money you spend, and store them somewhere safe and searchable."}</p>
            <h2>{"Common mistakes to avoid"}</h2>
            <ul><li><strong>{"Treating a quote as an invoice."}</strong>{" A quote shows an expected price; it does not ask for payment."}</li><li><strong>{"Re-using invoice numbers."}</strong>{" Each invoice should have its own unique number so payments and receipts can be matched to it."}</li><li><strong>{"Marking an invoice paid too early."}</strong>{" Wait until the money has actually arrived, and record part-payments separately."}</li><li><strong>{"Not keeping copies."}</strong>{" Keep the invoices you send and the receipts for what you spend, for the periods GOV.UK sets out."}</li><li><strong>{"Losing cash receipts."}</strong>{" If you take or pay cash, a written record is especially useful."}</li></ul>
            <h2>{"How an invoicing tool helps keep invoices and payments straight"}</h2>
            <p>{"Keeping invoices and payment records together saves time when customers ask questions and when you prepare your accounts. With "}<Link href="https://makeinvo.com/">{"MakeInvo"}</Link>{", you can create and download a professional PDF invoice in the free generator without signing up. A free account lets you save clients and see your invoice history."}</p>
            <p>{"On plans that include payment tracking, you can "}<Link href="https://makeinvo.com/features">{"record payments"}</Link>{" with the amount, date and method, including partial payments, and see which invoices are paid, unpaid, partially paid or overdue. That makes it easy to confirm to a customer that their invoice has been settled. You can compare plans on the "}<Link href="https://makeinvo.com/pricing">{"pricing page"}</Link>{"."}</p>
            <p>{"If you are just getting started, our guide on "}<Link href="https://makeinvo.com/blog/how-to-make-an-invoice-online">{"how to make an invoice online"}</Link>{" walks through each step, and the "}<Link href="https://makeinvo.com/invoice-templates">{"invoice templates"}</Link>{" page has layouts for freelancers, contractors, consultants and small businesses. If an invoice is overdue, read "}<Link href="https://makeinvo.com/blog/how-to-chase-a-late-invoice-uk">{"how to chase a late invoice in the UK"}</Link>{"."}</p>
            <h2>{"Frequently asked questions"}</h2>
            <h3>{"Is an invoice the same as a receipt?"}</h3>
            <p>{"No. An invoice asks for payment. A receipt confirms payment has been received. GOV.UK states that an invoice is not the same as a receipt."}</p>
            <h3>{"Do I have to give a receipt in the UK?"}</h3>
            <p>{"There is generally no blanket legal requirement to issue a receipt for every sale, but it is good practice, especially for cash payments. Specific rules can apply in some situations, such as VAT, so check GOV.UK if you are unsure."}</p>
            <h3>{"Can a receipt be used as a VAT invoice?"}</h3>
            <p>{"Sometimes. HMRC allows VAT-registered retailers to issue a simplified VAT invoice for supplies of £250 or less including VAT when a customer asks, and some till receipts include the required details. Check HMRC's VAT guidance for the exact requirements."}</p>
            <h3>{"Can I send a paid invoice instead of a receipt?"}</h3>
            <p>{"Many small businesses send a copy of the invoice marked \"Paid\" with the payment date and amount. It links the payment to the original invoice number and gives the customer a clear record."}</p>
            <h3>{"What comes first, the invoice or the receipt?"}</h3>
            <p>{"Usually the invoice. You send the invoice, the customer pays, and the receipt (or paid invoice) confirms the payment. At a shop till, payment is immediate, so you normally just get a receipt."}</p>
            <h3>{"Do I need an invoice if I am not VAT registered?"}</h3>
            <p>{"GOV.UK's legal requirement to give an invoice applies when both parties are VAT registered. Many businesses that are not VAT registered still invoice customers because it is clearer for both sides and helps with record keeping."}</p>
            <h3>{"How long should I keep receipts and invoices?"}</h3>
            <p>{"Sole traders must keep records for at least 5 years after the 31 January submission deadline for the relevant tax year. Limited companies generally keep records for 6 years from the end of the last financial year they relate to. Check GOV.UK for the details that apply to you."}</p>
            <h2>{"Create your next invoice clearly"}</h2>
            <p>{"Getting the paperwork right is simple once you know which document does which job: invoices ask for payment, receipts confirm it, and good records tie them together. When you are ready to bill your next customer, create a clear PDF invoice with the free "}<Link href="https://makeinvo.com/">{"MakeInvo invoice generator"}</Link>{", with no signup, watermark or credit card needed. For more practical guides, visit the "}<Link href="https://makeinvo.com/blog">{"MakeInvo blog"}</Link>{"."}</p>
          </div>
          <div className="mt-10 border-t border-border pt-8">
            <Link href="/blog" className="text-sm font-medium text-primary hover:underline">&larr; Back to the blog</Link>
          </div>
        </article>
      </div>
    </>
  )
}
