import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getSiteUrl } from "@/lib/utils/site-url"
import { getBlogPost } from "@/lib/data/blog-posts"

const siteUrl = getSiteUrl()
const post = getBlogPost("how-to-chase-a-late-invoice-uk")!
const pageUrl = `${siteUrl}/blog/${post.slug}`
const coverImageUrl = `${siteUrl}${post.coverImage}`

export const metadata: Metadata = {
  title: "How to Chase a Late Invoice in the UK",
  description: post.excerpt,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "How to Chase a Late Invoice in the UK | MakeInvo",
    description: post.excerpt,
    url: pageUrl,
    type: "article",
    publishedTime: post.publishedDate,
    modifiedTime: post.updatedDate,
    images: [{ url: coverImageUrl, width: 1200, height: 675, alt: post.coverImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Chase a Late Invoice in the UK",
    description: post.excerpt,
    images: [coverImageUrl],
  },
  robots: { index: true, follow: true },
}

const faqs = [
  {
    "question": "How soon should I chase an invoice after the due date?",
    "answer": "Once the due date has passed and you have checked that the invoice is correct and was received, a polite reminder is reasonable. There is no single official waiting period. Do not open with formal legal language on the first day."
  },
  {
    "question": "Can I charge interest on a late invoice in the UK?",
    "answer": "On many business-to-business invoices, yes — either at the rate in your contract, or, if the contract does not set a different rate, at the statutory rate of 8% plus the Bank of England base rate. You cannot use a lower contractual rate with a public authority. Check the GOV.UK interest guidance and the current base rate before you add a figure."
  },
  {
    "question": "What is statutory interest, and does it apply to every unpaid invoice?",
    "answer": "Statutory interest is the interest the law allows on a late commercial payment between businesses. It does not apply to every unpaid invoice, or where your contract already sets a different interest rate, or to a private individual or consumer customer."
  },
  {
    "question": "What should I include in a reminder email?",
    "answer": "Include the invoice number, the amount, the due date, a copy or link to the invoice, and your payment details. Ask them to confirm they have received it, or to let you know if anything is outstanding, and keep a copy."
  },
  {
    "question": "What is a letter before action?",
    "answer": "It is a formal letter, sent after ordinary reminders, that sets out the debt and gives a clear deadline for payment before you consider further steps. It is not a court claim or a template. Typical contents include the invoice details, the amount owed, any interest or compensation claimed, payment instructions, and a deadline."
  },
  {
    "question": "What if the customer is a private individual, not a business?",
    "answer": "This is not a standard business-to-business late-payment chase. Statutory interest and the fixed compensation bands above are for commercial debts between businesses. Recovery from a consumer or a sole trader usually follows a different official process, including the Pre-Action Protocol for Debt Claims. Check official guidance or get professional help."
  },
  {
    "question": "Where can I get official help with unpaid invoices?",
    "answer": "Start with the GOV.UK pages on late commercial payments for interest and debt recovery costs. For practical steps and possible help with a dispute, see the Office of the Small Business Commissioner’s guidance on unpaid invoices. If the amount is significant or the facts are disputed, consider professional advice."
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

export default function LateInvoiceUkPage() {
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
            <span aria-current="page">Chasing a late invoice in the UK</span>
          </nav>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            By {post.author} &middot; Published {formatDate(post.publishedDate)} &middot; {post.readingTime}
          </p>
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-xl border border-border bg-muted">
            <Image src={post.coverImage} alt={post.coverImageAlt} fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          </div>
          <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-h2:text-2xl prose-h2:font-bold prose-h3:text-lg prose-h3:font-semibold">
            <p>{"An unpaid invoice is one of the most common cash-flow problems for UK freelancers, sole traders and small companies. In most cases, a calmer sequence works better than formal language: check that the invoice is correct and was received, send a polite reminder, speak to the client, and only then move on to formal steps."}</p>
            <p>{"This guide is for business-to-business invoices — work you have done for another business, not a sale to a private consumer. It sets out a practical chase sequence, then outlines statutory interest and fixed compensation in plain English, with links to official guidance. This is not legal, tax or debt-collection advice, and it is not a guide for collecting consumer debts. If your situation is unusual, or the amount is significant, check the official pages or speak to a professional."}</p>
            <p>{"If you need to correct or resend the invoice itself, you can create a clear PDF on the "}<Link href="https://makeinvo.com/">{"MakeInvo homepage"}</Link>{" without signing up."}</p>
            <h2>{"Short answer: the calm order of steps"}</h2>
            <p>{"Start with the paperwork, not the courtroom. Before you write a formal letter, confirm that the invoice is accurate, that it went to the right person, and that payment is genuinely overdue under the terms you agreed. Plenty of “late” invoices are still sitting in the wrong inbox, waiting on a purchase-order number, or held up by a small error on the document."}</p>
            <p>{"Once you are sure the invoice is in order, send a short, polite reminder. If you hear nothing, follow up with a phone call, then resend the invoice so the client has everything they need to pay. Keep a written record of what you sent and when."}</p>
            <p>{"If the client cannot pay in full, a written instalment plan can be a practical option. If the debt is still unpaid, you may look at statutory interest and compensation on a business-to-business invoice, then a formal follow-up. The "}<a href="https://www.smallbusinesscommissioner.gov.uk/help-and-guidance/all-advice/help-with-unpaid-invoices/">{"Office of the Small Business Commissioner"}</a>{" sets out a similar sequence: check the terms, remind, call, resend, consider late-payment charges, discuss a payment plan, then a final demand, and only after that consider the Commissioner, a collection agency or legal action. Do not open with court language."}</p>
            <h2>{"Check the invoice before you chase"}</h2>
            <div className="not-prose relative my-8 aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted"><Image src="/blog/how-to-chase-a-late-invoice-uk/invoice-check-before-chase.webp" alt="Checking an invoice number and due date before following up" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /></div>
            <p>{"The first job is to check your own invoice. Look at the client name, the amount, the description of the work, the invoice number and the payment details. A typo in the sort code, a missing purchase-order number or the wrong legal entity can delay payment for weeks, and chasing hard will not fix it."}</p>
            <p>{"Confirm that the invoice went to the right person — often the accounts payable contact, not only the person who commissioned the work — and that it was received. A quick, polite check (“I just wanted to make sure invoice 1042 arrived”) can resolve the issue before you treat it as a refusal to pay."}</p>
            <p>{"Then check the payment terms and the due date. An invoice is not late simply because you hoped to be paid sooner. If you agreed 30 days, or the contract sets a different period, work from that date. Be honest about when payment was actually due, and about what you printed on the invoice."}</p>
            <p>{"If anything is missing or unclear, correct it and send a clean copy rather than chasing a flawed document. "}<Link href="https://makeinvo.com/blog/what-to-include-on-a-uk-invoice">{"What a UK invoice should include"}</Link>{" is covered in a separate checklist, including VAT details where they apply. If you need to create or resend a PDF, "}<Link href="https://makeinvo.com/blog/how-to-make-an-invoice-online">{"how to make an invoice online"}</Link>{" walks through that process. This article is about what to do once a complete invoice is overdue, not how to draft the original document."}</p>
            <h2>{"A polite reminder sequence"}</h2>
            <div className="not-prose relative my-8 aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted"><Image src="/blog/how-to-chase-a-late-invoice-uk/polite-payment-reminder.webp" alt="Laptop and smartphone with a polite payment reminder draft" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /></div>
            <p>{"A first reminder should be short and easy to act on. An email or message is usually enough. Include the invoice number, the amount, the original due date and how to pay. Keep the tone professional and matter-of-fact. You are prompting a payment, not accusing anyone of bad faith. Many late payments are administrative: the invoice was overlooked, a new approver is in post, or the file was never passed to finance."}</p>
            <p>{"If you get no reply, call. A conversation often surfaces the real reason — a query about the work, a missing purchase order, a cash-flow squeeze — much faster than a chain of emails. Follow the call with a short written note of what was agreed, so both sides have a record."}</p>
            <p>{"If the client says they never received the invoice, or cannot find it, resend it promptly. Use a clear subject line, attach the PDF, and repeat the payment details. Double-check that the bank details on the resend are correct."}</p>
            <p>{"Throughout, keep a written record: the original invoice, reminder emails, notes of calls, and any promises of a date. That record is useful if you later need a formal letter, and it also helps you stay consistent if several people in your business are chasing the same invoice. There is no official “best day of the week” to chase, despite what some articles claim. What matters is a timely, polite follow-up after the due date, and a clear paper trail."}</p>
            <h2>{"If the client cannot pay in full"}</h2>
            <p>{"Sometimes the client accepts the invoice but cannot pay the full amount at once. In that situation, a written instalment plan can be a practical way to get the money in without jumping straight to formal recovery. Agree the amounts, the dates and the payment method, and put it in writing — an email confirmation is usually enough — so there is no later dispute about what was promised."}</p>
            <p>{"This is a commercial decision, not a legal requirement. Only offer a plan you can live with, and be clear about what happens if an instalment is missed. If the arrangement is working, keep the tone cooperative and stick to the agreed dates. If it is not, you can still move on to the formal steps below."}</p>
            <h2>{"Statutory interest and compensation, in plain English"}</h2>
            <div className="not-prose relative my-8 aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted"><Image src="/blog/how-to-chase-a-late-invoice-uk/govuk-interest-notes.webp" alt="Notebook and tablet with official late-payment guidance" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /></div>
            <p>{"For many business-to-business invoices, UK law allows you to charge statutory interest on a late commercial payment. According to "}<a href="https://www.gov.uk/late-commercial-payments-interest-debt-recovery/charging-interest-commercial-debt">{"GOV.UK guidance on interest on late commercial payments"}</a>{", statutory interest is 8% plus the Bank of England base rate for business-to-business transactions. You cannot claim statutory interest if the contract already sets a different rate of interest. You also cannot use a lower interest rate in a contract with a public authority."}</p>
            <p>{"These rules come from late payment legislation, including the Late Payment of Commercial Debts (Interest) Act 1998, and apply to commercial debts between businesses, not to every unpaid invoice or to consumer customers."}</p>
            <p>{"GOV.UK’s official worked example uses a Bank of England base rate of 0.5% on a debt of £1,000. On that example, the annual statutory interest is £85 (£1,000 × 0.085), which is 23p a day, or £11.50 after 50 days. That 0.5% figure is the rate used in the official example; it is not necessarily the rate in force today. Check the current Bank of England base rate, and the GOV.UK page, before you calculate a figure on a live invoice. If you decide to add interest, GOV.UK says you should send a new invoice for the extra amount."}</p>
            <p>{"You may also be able to charge a fixed sum for the cost of recovering a late commercial payment, on top of interest. "}<a href="https://www.gov.uk/late-commercial-payments-interest-debt-recovery/claim-debt-recovery-costs">{"GOV.UK’s debt recovery costs guidance"}</a>{" sets the bands as follows: £40 where the debt is up to £999.99, £70 where it is £1,000 to £9,999.99, and £100 where it is £10,000 or more. You can only charge the business once for each payment. The same official page notes that a supplier may also claim reasonable costs each time they try to recover the debt. Use the live GOV.UK page if you are applying these sums."}</p>
            <p>{"Mention interest and compensation only when they actually apply, not in a first reminder."}</p>
            <h2>{"Formal follow-up and further help"}</h2>
            <p>{"If reminders, a call and, where relevant, a payment plan have not worked, the next step is usually a formal written follow-up, sometimes called a letter before action or a final demand. This is not a court form, and this article is not a template. In general terms, a formal letter typically sets out who you are, the invoice number and date, the work or goods supplied, the amount outstanding, the original due date, any interest or compensation you are claiming, a clear deadline for payment, and how to pay or to raise a genuine dispute. Keep a copy."}</p>
            <p>{"The process is different if the person who owes you the money is a consumer or a sole trader — an individual rather than a limited company or other business entity. Official pre-action rules, including the Pre-Action Protocol for Debt Claims, usually apply in those cases. Do not send a formal letter copied from a business-debt template if you are unsure which process applies. Check the official protocol or get professional advice."}</p>
            <p>{"Before you instruct a solicitor or a collection agency, there is another official route that may help. The "}<a href="https://www.smallbusinesscommissioner.gov.uk/help-and-guidance/all-advice/help-with-unpaid-invoices/">{"Office of the Small Business Commissioner"}</a>{" can, in some cases, assist small businesses with unpaid invoices and unresolved payment disputes with a larger customer. Legal action and debt collection are last resorts, not the starting point of a calm chase."}</p>
            <h2>{"How a simple invoicing tool helps you stay organised"}</h2>
            <p>{"Chasing is easier when you can see, at a glance, which invoices are still unpaid and which have gone overdue. A simple invoicing tool will not recover a debt for you, and it will not send legal letters. What it can do is keep the record tidy: the invoice itself, the date it was sent, its status (sent, unpaid, overdue or paid), and a way to resend or share it when a client says they have lost the original."}</p>
            <p><Link href="https://makeinvo.com/features">{"MakeInvo’s features"}</Link>{" include payment tracking and payment reminders, which can help you follow up consistently. Reminders are a product capability — a prompt you can use in your own process — not a legal timetable. There is no official schedule of “day three, day five and day seven” that you must follow."}</p>
            <p>{"If you need a fresh or replacement invoice, the "}<Link href="https://makeinvo.com/">{"MakeInvo homepage"}</Link>{" generator lets you create and download a PDF without signing up. A free account can save clients and invoice history if you want to keep that record in one place. For more practical guides, see the "}<Link href="https://makeinvo.com/blog">{"MakeInvo blog"}</Link>{"."}</p>
            <h2>{"Frequently asked questions"}</h2>
            <h3>{"How soon should I chase an invoice after the due date?"}</h3>
            <p>{"Once the due date has passed and you have checked that the invoice is correct and was received, a polite reminder is reasonable. There is no single official waiting period. Do not open with formal legal language on the first day."}</p>
            <h3>{"Can I charge interest on a late invoice in the UK?"}</h3>
            <p>{"On many business-to-business invoices, yes — either at the rate in your contract, or, if the contract does not set a different rate, at the statutory rate of 8% plus the Bank of England base rate. You cannot use a lower contractual rate with a public authority. Check the "}<a href="https://www.gov.uk/late-commercial-payments-interest-debt-recovery/charging-interest-commercial-debt">{"GOV.UK interest guidance"}</a>{" and the current base rate before you add a figure."}</p>
            <h3>{"What is statutory interest, and does it apply to every unpaid invoice?"}</h3>
            <p>{"Statutory interest is the interest the law allows on a late commercial payment between businesses. It does not apply to every unpaid invoice, or where your contract already sets a different interest rate, or to a private individual or consumer customer."}</p>
            <h3>{"What should I include in a reminder email?"}</h3>
            <p>{"Include the invoice number, the amount, the due date, a copy or link to the invoice, and your payment details. Ask them to confirm they have received it, or to let you know if anything is outstanding, and keep a copy."}</p>
            <h3>{"What is a letter before action?"}</h3>
            <p>{"It is a formal letter, sent after ordinary reminders, that sets out the debt and gives a clear deadline for payment before you consider further steps. It is not a court claim or a template. Typical contents include the invoice details, the amount owed, any interest or compensation claimed, payment instructions, and a deadline."}</p>
            <h3>{"What if the customer is a private individual, not a business?"}</h3>
            <p>{"This is not a standard business-to-business late-payment chase. Statutory interest and the fixed compensation bands above are for commercial debts between businesses. Recovery from a consumer or a sole trader usually follows a different official process, including the Pre-Action Protocol for Debt Claims. Check official guidance or get professional help."}</p>
            <h3>{"Where can I get official help with unpaid invoices?"}</h3>
            <p>{"Start with the "}<a href="https://www.gov.uk/late-commercial-payments-interest-debt-recovery/charging-interest-commercial-debt">{"GOV.UK pages on late commercial payments"}</a>{" for interest and "}<a href="https://www.gov.uk/late-commercial-payments-interest-debt-recovery/claim-debt-recovery-costs">{"debt recovery costs"}</a>{". For practical steps and possible help with a dispute, see the "}<a href="https://www.smallbusinesscommissioner.gov.uk/help-and-guidance/all-advice/help-with-unpaid-invoices/">{"Office of the Small Business Commissioner’s guidance on unpaid invoices"}</a>{". If the amount is significant or the facts are disputed, consider professional advice."}</p>
            <h2>{"Get the next invoice out clearly"}</h2>
            <p>{"The easiest invoice to chase is the one that was complete, sent to the right person, and easy to pay in the first place. Before you issue the next one, check the details, the terms and the payment instructions, and keep a record of when it went out."}</p>
            <p>{"If you need to raise or resend a UK invoice, you can create a PDF on the "}<Link href="https://makeinvo.com/">{"MakeInvo homepage"}</Link>{" or use "}<Link href="https://makeinvo.com/features">{"payment tracking and reminders"}</Link>{" to keep overdue invoices in view. A clear invoice, sent promptly, gives the next chase far less work to do."}</p>
          </div>
          <div className="mt-10 border-t border-border pt-8">
            <Link href="/blog" className="text-sm font-medium text-primary hover:underline">&larr; Back to the blog</Link>
          </div>
        </article>
      </div>
    </>
  )
}
