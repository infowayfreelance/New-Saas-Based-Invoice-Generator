import type { Metadata } from "next"
import Script from "next/script"
import Link from "next/link"
import Image from "next/image"
import { getSiteUrl } from "@/lib/utils/site-url"
import { getBlogPost } from "@/lib/data/blog-posts"

const siteUrl = getSiteUrl()
const post = getBlogPost("invoice-payment-terms-uk")!
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
    "dateModified": "2026-11-22",
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
        "name": "What does Net 30 mean on an invoice?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Net 30 means the full amount is due within 30 calendar days of the invoice date. Write the actual due date as well, so there is no confusion."
        }
      },
      {
        "@type": "Question",
        "name": "What is the most common payment term in the UK?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Net 30 is widely used for business-to-business invoices, but many freelancers and small businesses use shorter terms such as Net 7 or Net 14. Choose terms that suit your cash flow and agree them with the customer first."
        }
      },
      {
        "@type": "Question",
        "name": "What happens if I don't put payment terms on my invoice?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For business-to-business sales, GOV.UK says that if no payment date is agreed, payment is late 30 days after the customer gets the invoice or you deliver the goods or service, whichever is later. It is still clearer to state your terms."
        }
      },
      {
        "@type": "Question",
        "name": "Can I set payment terms longer than 60 days?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For business transactions, GOV.UK says agreed payment dates should usually be within 60 days. A longer period can be agreed, but it must be fair to both businesses."
        }
      },
      {
        "@type": "Question",
        "name": "What does \"due on receipt\" mean?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It means payment is due as soon as the customer receives the invoice. It suits small one-off jobs, but some customers will still need a few days to process payment."
        }
      },
      {
        "@type": "Question",
        "name": "Can I charge interest on late payments?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For business-to-business sales, you generally have the right to claim statutory interest and compensation on late payments under UK late payment legislation, unless your contract says otherwise. Check GOV.UK for the current rules."
        }
      },
      {
        "@type": "Question",
        "name": "Should I show the due date or just the payment term?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Show both. The term explains your policy, and the exact date removes any doubt about when payment is late."
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
            By {post.author} &middot; Published {formatDate(post.publishedDate)} &middot; {post.readingTime}
          </p>
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-xl border border-border bg-muted">
            <Image src={post.coverImage} alt={post.coverImageAlt} fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          </div>
          <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-h2:text-2xl prose-h2:font-bold prose-h3:text-lg prose-h3:font-semibold">
            <p>{"Payment terms are the small line on an invoice that decides when you actually get paid. Get them right and customers know exactly what to do. Leave them vague and you invite late payments, awkward emails and arguments about which day counts."}</p>
            <p>{"This plain-English guide explains what payment terms are, what common terms such as Net 30 and \"due on receipt\" mean, the UK rules on payment periods, how to choose terms that suit your business, and how to write them clearly on your invoice. It is general information, not legal, tax or accounting advice. If your situation is complicated, check GOV.UK or speak to an accountant or solicitor."}</p>
            <h2>{"Short answer: what are invoice payment terms?"}</h2>
            <p>{"Invoice payment terms tell your customer "}<strong>{"when"}</strong>{" payment is due, "}<strong>{"how"}</strong>{" to pay and, if you choose, what happens if they pay late or early."}</p>
            <ul><li><strong>{"Net 30"}</strong>{" means the full amount is due 30 days after the invoice date."}</li><li><strong>{"Due on receipt"}</strong>{" means payment is due as soon as the customer receives the invoice."}</li><li>{"If you "}<strong>{"never agreed a payment date"}</strong>{" with a business customer, GOV.UK says payment is late 30 days after the customer gets the invoice or after you deliver the goods or service, whichever is later."}</li></ul>
            <p>{"The clearest invoices show both the term and the actual date, for example, on an invoice dated 1 December 2026: \"Payment terms: Net 14. Due by 15 December 2026.\""}</p>
            <h2>{"Why payment terms matter"}</h2>
            <p>{"Clear payment terms help you:"}</p>
            <ul><li><strong>{"get paid on time"}</strong>{", because customers know the exact deadline;"}</li><li><strong>{"manage cash flow"}</strong>{", because you can plan when money will arrive;"}</li><li><strong>{"avoid disputes"}</strong>{", because there is no debate about when the clock started;"}</li><li><strong>{"enforce your rights"}</strong>{", because a clear due date makes it obvious when a payment becomes late."}</li></ul>
            <p>{"GOV.UK confirms you can set your own payment terms, such as discounts for early payment or payment upfront. The key is to agree them with the customer before you start the work, then repeat them on the invoice."}</p>
            <h2>{"Common invoice payment terms and what they mean"}</h2>
            <div className="not-prose relative my-8 aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted"><Image src="/blog/invoice-payment-terms-uk/payment-terms-calendar-due-date.webp" alt="Calendar with a circled due date and a Net 30 sticky note" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /></div>
            <p>{"Here is what the most common terms mean, using an example invoice dated "}<strong>{"1 December 2026"}</strong>{"."}</p>
            <div className="overflow-x-auto"><table><thead><tr><th scope="col">{"Term"}</th><th scope="col">{"What it means"}</th><th scope="col">{"Due date for an invoice dated 1 Dec 2026"}</th></tr></thead><tbody><tr><th scope="row">{"Due on receipt"}</th><td>{"Payable as soon as the customer receives the invoice"}</td><td>{"1 December 2026 (on receipt)"}</td></tr><tr><th scope="row">{"Net 7"}</th><td>{"7 days after the invoice date"}</td><td>{"8 December 2026"}</td></tr><tr><th scope="row">{"Net 14"}</th><td>{"14 days after the invoice date"}</td><td>{"15 December 2026"}</td></tr><tr><th scope="row">{"Net 30"}</th><td>{"30 days after the invoice date"}</td><td>{"31 December 2026"}</td></tr><tr><th scope="row">{"Net 60"}</th><td>{"60 days after the invoice date"}</td><td>{"30 January 2027"}</td></tr><tr><th scope="row">{"EOM (end of month)"}</th><td>{"Last day of the month the invoice is dated"}</td><td>{"31 December 2026"}</td></tr><tr><th scope="row">{"30 days EOM"}</th><td>{"30 days after the end of the invoice month"}</td><td>{"30 January 2027"}</td></tr><tr><th scope="row">{"CIA / payment in advance"}</th><td>{"Payment before work starts or goods are sent"}</td><td>{"Before supply"}</td></tr><tr><th scope="row">{"COD (cash on delivery)"}</th><td>{"Payment when the goods or service are delivered"}</td><td>{"On delivery"}</td></tr></tbody></table></div>
            <p>{"A few points worth knowing:"}</p>
            <ul><li><strong>{"\"Net\" days are calendar days"}</strong>{", including weekends and bank holidays, unless you say otherwise."}</li><li><strong>{"The clock usually starts on the invoice date"}</strong>{", but some businesses count from the delivery date. Say which one you mean."}</li><li><strong>{"\"Net 30\" and \"30 days\" are often used interchangeably"}</strong>{", but the safest approach is to write the actual due date."}</li></ul>
            <h3>{"Other terms you may see"}</h3>
            <ul><li><strong>{"Stage payments or milestones"}</strong>{": part of the total is due at agreed points in a project, such as a deposit, a mid-point payment and a final balance."}</li><li><strong>{"Deposit or upfront payment"}</strong>{": a percentage or fixed part of the total is paid before work begins."}</li><li><strong>{"Early payment discount"}</strong>{": for example, \"2/10 Net 30\" means a 2% discount if paid within 10 days, otherwise the full amount within 30 days. Only offer this if it makes sense for your margins."}</li><li><strong>{"Retainers and recurring invoices"}</strong>{": a fixed amount billed on the same day each month for ongoing work."}</li></ul>
            <h2>{"UK rules on payment periods"}</h2>
            <p>{"The UK has rules for business-to-business payments. According to GOV.UK and the Office of the Small Business Commissioner:"}</p>
            <ul><li><strong>{"If you agree a payment date"}</strong>{", it should usually be within "}<strong>{"60 days"}</strong>{" for business transactions. A longer period can be agreed, but it must be fair to both businesses."}</li><li><strong>{"Public authorities"}</strong>{" should usually pay within "}<strong>{"30 days"}</strong>{"."}</li><li><strong>{"If no payment date is agreed"}</strong>{", payment is late "}<strong>{"30 days"}</strong>{" after the customer gets the invoice or you deliver the goods or service, whichever is later."}</li></ul>
            <p>{"These rules cover business-to-business transactions. If you sell to consumers, your terms and contract still matter, but the late commercial payment rules described below do not apply in the same way."}</p>
            <h2>{"What happens if a customer pays late?"}</h2>
            <p>{"For business-to-business sales, the Late Payment of Commercial Debts legislation gives you the right to claim statutory interest and fixed compensation on late payments, unless your contract says otherwise. GOV.UK sets statutory interest at "}<strong>{"8% plus the Bank of England base rate"}</strong>{". You can choose not to charge it, and many small businesses use it as a last resort to protect the relationship."}</p>
            <p>{"Our step-by-step guide on "}<Link href="https://makeinvo.com/blog/how-to-chase-a-late-invoice-uk">{"how to chase a late invoice in the UK"}</Link>{" explains the full sequence, from a polite reminder to statutory interest, with links to the official guidance."}</p>
            <h2>{"How to choose the right payment terms for your business"}</h2>
            <p>{"There is no single right answer. Think about:"}</p>
            <h3>{"Your cash flow"}</h3>
            <p>{"Shorter terms bring money in sooner. If you have regular outgoings such as materials, subcontractors or rent, Net 7 or Net 14 may suit you better than Net 30."}</p>
            <h3>{"Your industry and customers"}</h3>
            <p>{"Some sectors and larger customers expect longer terms because they pay in monthly payment runs. If a client pays on fixed dates, agree terms that fit their process so your invoice is not left waiting a month for the next run."}</p>
            <h3>{"The size and length of the job"}</h3>
            <p>{"For larger projects, consider a deposit or stage payments so you are not funding the entire job yourself until the end."}</p>
            <h3>{"Your relationship with the customer"}</h3>
            <p>{"You might offer new customers shorter terms or ask for payment upfront, then extend terms for regular customers who always pay on time."}</p>
            <h3>{"Your own capacity to chase"}</h3>
            <p>{"The longer the terms, the longer you wait before you can follow up. Terms you can realistically monitor are better than generous terms you cannot keep track of."}</p>
            <h2>{"How to write payment terms on an invoice"}</h2>
            <div className="not-prose relative my-8 aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted"><Image src="/blog/invoice-payment-terms-uk/invoice-payment-terms-wording.webp" alt="Payment terms and due date section at the bottom of an invoice" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /></div>
            <p>{"Clear wording removes guesswork. Include:"}</p>
            <ol><li><strong>{"The term"}</strong>{", such as \"Net 14\"."}</li><li><strong>{"The exact due date"}</strong>{", such as \"Due by 15 December 2026\"."}</li><li><strong>{"How to pay"}</strong>{", including bank details or a payment link."}</li><li><strong>{"The invoice number"}</strong>{" to use as a payment reference."}</li><li><strong>{"Any late payment policy"}</strong>{", if you have agreed one, for example a reference to statutory interest."}</li><li><strong>{"Any early payment discount"}</strong>{", if you offer one."}</li></ol>
            <h3>{"Example payment terms wording"}</h3>
            <ul><li><em>{"\"Payment terms: Net 14. Please pay by 15 December 2026 by bank transfer to the account below, using invoice number INV-0042 as the reference.\""}</em></li><li><em>{"\"Payment due on receipt. Thank you for your business.\""}</em></li><li><em>{"\"50% deposit due before work starts; remaining balance due within 7 days of completion.\""}</em></li><li><em>{"\"Payment terms: Net 30 from the invoice date. We reserve the right to claim interest and compensation on late payments under the Late Payment of Commercial Debts (Interest) Act 1998.\""}</em></li></ul>
            <p>{"Adapt the wording to what you actually agreed with the customer. For the other details your invoice needs, see our checklist of "}<Link href="https://makeinvo.com/blog/what-to-include-on-a-uk-invoice">{"what a UK invoice must include"}</Link>{"."}</p>
            <h2>{"Tips to get paid on time"}</h2>
            <ul><li><strong>{"Agree terms before you start"}</strong>{", in your quote, proposal or contract."}</li><li><strong>{"Send the invoice promptly"}</strong>{", as soon as the work is done or the milestone is reached."}</li><li><strong>{"Make paying easy"}</strong>{", with clear bank details and the right reference."}</li><li><strong>{"Send polite reminders"}</strong>{" before and after the due date."}</li><li><strong>{"Keep records"}</strong>{" of invoices, payments and correspondence."}</li><li><strong>{"Review terms regularly"}</strong>{", especially for customers who are often late."}</li></ul>
            <h2>{"How MakeInvo helps with payment terms and due dates"}</h2>
            <div className="not-prose relative my-8 aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted"><Image src="/blog/invoice-payment-terms-uk/freelancer-tracking-paid-invoices.webp" alt="Freelancer reviewing an invoice list with paid, unpaid and overdue statuses" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /></div>
            <p>{"With MakeInvo you can create a clear PDF invoice in the free "}<Link href="https://makeinvo.com/">{"invoice generator"}</Link>{" without signing up, and include your payment terms and due date so customers can see exactly when to pay. A free account lets you save clients and see your invoice history."}</p>
            <p>{"On plans that include them, MakeInvo "}<Link href="https://makeinvo.com/features">{"features"}</Link>{" such as recurring invoices, automatic payment reminders after the due date and payment recording, including partial payments, help you keep track of what is paid, unpaid or overdue. You can compare plans on the "}<Link href="https://makeinvo.com/pricing">{"pricing page"}</Link>{". If you are new to invoicing, start with our guide on "}<Link href="https://makeinvo.com/blog/how-to-make-an-invoice-online">{"how to make an invoice online"}</Link>{" or browse the "}<Link href="https://makeinvo.com/invoice-templates">{"invoice templates"}</Link>{"."}</p>
            <h2>{"Frequently asked questions"}</h2>
            <h3>{"What does Net 30 mean on an invoice?"}</h3>
            <p>{"Net 30 means the full amount is due within 30 calendar days of the invoice date. Write the actual due date as well, so there is no confusion."}</p>
            <h3>{"What is the most common payment term in the UK?"}</h3>
            <p>{"Net 30 is widely used for business-to-business invoices, but many freelancers and small businesses use shorter terms such as Net 7 or Net 14. Choose terms that suit your cash flow and agree them with the customer first."}</p>
            <h3>{"What happens if I don't put payment terms on my invoice?"}</h3>
            <p>{"For business-to-business sales, GOV.UK says that if no payment date is agreed, payment is late 30 days after the customer gets the invoice or you deliver the goods or service, whichever is later. It is still clearer to state your terms."}</p>
            <h3>{"Can I set payment terms longer than 60 days?"}</h3>
            <p>{"For business transactions, GOV.UK says agreed payment dates should usually be within 60 days. A longer period can be agreed, but it must be fair to both businesses."}</p>
            <h3>{"What does \"due on receipt\" mean?"}</h3>
            <p>{"It means payment is due as soon as the customer receives the invoice. It suits small one-off jobs, but some customers will still need a few days to process payment."}</p>
            <h3>{"Can I charge interest on late payments?"}</h3>
            <p>{"For business-to-business sales, you generally have the right to claim statutory interest and compensation on late payments under UK late payment legislation, unless your contract says otherwise. Check GOV.UK for the current rules."}</p>
            <h3>{"Should I show the due date or just the payment term?"}</h3>
            <p>{"Show both. The term explains your policy, and the exact date removes any doubt about when payment is late."}</p>
            <h2>{"Set clear terms on your next invoice"}</h2>
            <p>{"Clear payment terms are one of the simplest ways to get paid faster. Agree them upfront, write the exact due date on every invoice and follow up promptly. When you are ready to bill your next customer, create a professional PDF invoice with the free "}<Link href="https://makeinvo.com/">{"MakeInvo invoice generator"}</Link>{", with no signup, watermark or credit card needed. For more practical guides, visit the "}<Link href="https://makeinvo.com/blog">{"MakeInvo blog"}</Link>{"."}</p>
          </div>
          <div className="mt-10 border-t border-border pt-8">
            <Link href="/blog" className="text-sm font-medium text-primary hover:underline">&larr; Back to the blog</Link>
          </div>
        </article>
      </div>
    </>
  )
}
