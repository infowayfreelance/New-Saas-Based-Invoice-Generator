import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getSiteUrl } from "@/lib/utils/site-url"
import { getBlogPost } from "@/lib/data/blog-posts"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const siteUrl = getSiteUrl()
const post = getBlogPost("how-to-make-an-invoice-online")!
const pageUrl = `${siteUrl}/blog/${post.slug}`
const coverImageUrl = `${siteUrl}${post.coverImage}`

export const metadata: Metadata = {
  title: "How to Make an Invoice Online: A Simple Step-by-Step Guide",
  description: post.excerpt,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "How to Make an Invoice Online: A Simple Step-by-Step Guide | MakeInvo",
    description: post.excerpt,
    url: pageUrl,
    type: "article",
    publishedTime: post.publishedDate,
    modifiedTime: post.updatedDate,
    images: [{ url: coverImageUrl, width: 836, height: 471, alt: post.coverImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Make an Invoice Online: A Simple Step-by-Step Guide",
    description: post.excerpt,
    images: [coverImageUrl],
  },
  robots: { index: true, follow: true },
}

const faqs = [
  {
    question: "How can I make an invoice online for free?",
    answer:
      "Use a free invoice generator, choose a template and enter your invoice details. Review the invoice, then download it as a PDF.",
  },
  {
    question: "What information must be included on an invoice?",
    answer:
      "Include your business details, client information, invoice number, dates, line items, total amount, payment terms and payment methods. Legal rules may differ by country.",
  },
  {
    question: "How do I choose an invoice number?",
    answer: "Use a unique number for each invoice. A simple order such as INV-001, INV-002 and INV-003 is easy to manage.",
  },
  {
    question: "What invoice due date should I use?",
    answer: "Choose the date agreed with your client. Common payment periods include 7, 14 or 30 days after the issue date.",
  },
  {
    question: "Can I create an invoice without a registered company?",
    answer:
      "In many places, freelancers and self-employed people can send invoices under their own names. Check the local rules that apply to you.",
  },
  {
    question: "Should I add tax or VAT to my invoice?",
    answer:
      "Add tax or VAT only when local rules require it. The correct rate depends on your location, registration and the product or service.",
  },
  {
    question: "What is the best format for sending an invoice?",
    answer: "PDF is usually the best format. It is easy to open, download, print and save without changing the invoice layout.",
  },
  {
    question: "Can I download an online invoice as a PDF?",
    answer: "Yes. Most online invoice tools allow you to create and download a PDF invoice.",
  },
  {
    question: "How should I send an invoice to a client?",
    answer: "Attach the PDF invoice to a short email. Mention the invoice number, total amount and due date in the message.",
  },
  {
    question: "What is the difference between an invoice and a receipt?",
    answer: "An invoice requests payment from a client. A receipt confirms that the payment has already been made.",
  },
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
      "@type": "Article",
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

const steps = [
  {
    title: "Step 1: Choose an Invoice Template",
    body: [
      "Start with a clean and simple invoice template. It should have clear spaces for your details, client information, services, prices and payment terms.",
      "Choose a design that is easy to read on both a phone and a computer. You can use one of MakeInvo's free invoice templates instead of creating the layout yourself.",
    ],
  },
  {
    title: "Step 2: Add Your Business Details",
    body: [
      "Enter your full name or business name at the top of the invoice. Add your email address, phone number and business address so the client can contact you.",
      "You can also add your logo to create a professional invoice. Include your tax or VAT number if your business is registered and you are required to show it.",
    ],
  },
  {
    title: "Step 3: Add the Client's Information",
    body: [
      "Add the full name of the person or company that needs to pay you. Include the correct email address and billing address if you have them.",
      "Check the spelling carefully. Incorrect client information may cause confusion or delay the payment, especially when working with a large company.",
    ],
  },
  {
    title: "Step 4: Enter the Invoice Number, Issue Date and Due Date",
    body: [
      "Give every invoice a unique invoice number. You can use a simple order such as INV-001, INV-002 and INV-003 to keep your records organised.",
      "Next, add the issue date. This is the date you create or send the invoice. Then enter the invoice due date so the client knows when payment is expected.",
      "Your invoice payment terms should match the agreement you made with the client. For example, payment may be due in 7, 14 or 30 days.",
    ],
  },
  {
    title: "Step 5: Add Products or Services as Clear Line Items",
    body: [
      "List every product or service on a separate line. Write a short description that clearly explains what you provided.",
      "Add the quantity and price for a product. For work charged by time, enter the number of hours and your hourly rate.",
      "Avoid descriptions such as ‘work completed’ because they do not explain enough. A clearer description would be ‘Website homepage design - 5 hours.’",
    ],
  },
  {
    title: "Step 6: Calculate the Subtotal, Tax, Discount and Total",
    body: [
      "Multiply the quantity or hours by the price or hourly rate for each line item. Add these amounts together to find the subtotal.",
      "Next, add any tax or VAT that applies to the sale. Only charge tax or VAT when you are legally required to do so.",
      "If you agreed to give the client a discount, show it separately. Then display the final total amount due in a clear place near the bottom of the invoice.",
      "Check every calculation before sending the invoice. An online invoice generator can calculate totals for you and reduce simple maths mistakes.",
    ],
  },
  {
    title: "Step 7: Add Payment Terms and Payment Methods",
    body: [
      "Tell the client how and when they should pay. You may accept a bank transfer, card payment, online payment service or another agreed method.",
      "If you accept bank transfers, add the correct bank details. You can also include the account name, payment reference and currency.",
      "Mention any late payment terms only if the client agreed to them before the invoice was sent. Keep all payment instructions short and easy to follow.",
    ],
  },
  {
    title: "Step 8: Review, Download as PDF and Send the Invoice",
    body: [
      "Check the business details, client information, invoice number, dates and line items. Make sure the subtotal, tax, discount and final total are correct.",
      "Next, download the invoice as a PDF. A PDF invoice keeps its layout and is easy to open on most phones and computers.",
      "Use a clear file name, such as Invoice-INV-001-Client-Name.pdf. Send the invoice to the correct email address and include a short, polite message.",
    ],
  },
]

const invoiceIncludes = [
  {
    title: "Your Business Details",
    body: "Add your name or business name, email address, phone number and business address. You can also include your logo and tax or VAT number if they apply to your business.",
  },
  {
    title: "Client Information",
    body: "Enter the client's full name or company name. You should also add their email address and billing address. Always check these details for mistakes.",
  },
  {
    title: "Invoice Details",
    body: "Give every invoice a unique invoice number. Add the issue date and a clear invoice due date. If the client gave you a purchase order number, include it too.",
  },
  {
    title: "Products or Services",
    body: "List each product or service on a separate line. Add a clear description, quantity, number of hours, price or hourly rate. This helps the client understand every charge.",
  },
  {
    title: "Charges and Final Total",
    body: "Show the subtotal before any changes. Add tax or VAT when required, then include any agreed discount or extra fee. Clearly show the final total amount due.",
  },
  {
    title: "Payment Information",
    body: "Explain how the client can pay you. Add your accepted payment methods, bank details and invoice payment terms. You may also include a short thank-you note.",
  },
]

const mistakes = [
  {
    title: "Using Incorrect Client Details",
    body: "A wrong name, email address or billing address may send the invoice to the wrong person. Always check the client's details first.",
  },
  {
    title: "Forgetting the Invoice Number",
    body: "Every invoice needs a unique invoice number. It helps you and your client find and track the invoice later.",
  },
  {
    title: "Writing Unclear Line Item Descriptions",
    body: "Do not use unclear words such as ‘services’ or ‘work done.’ Explain what you provided, how much you provided and the price.",
  },
  {
    title: "Leaving Out the Due Date",
    body: "Without a due date, the client may not know when to pay. Add a clear date that matches your agreed payment terms.",
  },
  {
    title: "Calculating Tax or VAT Incorrectly",
    body: "Check whether tax or VAT applies to your invoice. Make sure the rate and final amount are correct before sending it.",
  },
  {
    title: "Not Adding Payment Instructions",
    body: "Tell the client how they can pay. Include the payment method, bank details and any reference they should use.",
  },
  {
    title: "Sending the Invoice Without Reviewing It",
    body: "Check all names, dates, line items and totals. A quick review can help you find mistakes before the client sees them.",
  },
  {
    title: "Using an Unclear File Name",
    body: "Avoid file names such as document1.pdf. Use a clear name like Invoice-INV-001-Green-Leaf-Cafe.pdf so it is easy to find.",
  },
]

const benefits = [
  {
    title: "Create Invoices More Quickly",
    body: "You can add your details, choose a template and create an invoice within a few minutes. This gives you more time to focus on your work.",
  },
  {
    title: "Reduce Calculation Errors",
    body: "An invoice maker can calculate line items, tax, discounts and totals automatically. You should still review the final amounts before sending the invoice.",
  },
  {
    title: "Keep a Professional Design",
    body: "Using the same clean template makes your invoices look consistent. It also helps clients find important information easily.",
  },
  {
    title: "Download and Share PDF Invoices",
    body: "You can download an invoice as a PDF and send it by email. A PDF keeps the invoice layout clear across different devices.",
  },
  {
    title: "Reuse Important Details",
    body: "Some tools let you reuse your business and client information. This saves time when you invoice the same client again.",
  },
  {
    title: "Organise Your Records",
    body: "An online invoice generator can help you keep your invoices in one place. This makes it easier to check which invoices were created, sent or paid.",
  },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

export default function HowToMakeAnInvoiceOnlinePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground hover:underline">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-foreground hover:underline">
              Blog
            </Link>
            <span className="mx-2">/</span>
            <span aria-current="page">How to Make an Invoice Online</span>
          </nav>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            How to Make an Invoice Online
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">A Simple Step-by-Step Guide</p>
          <p className="mt-4 text-sm text-muted-foreground">
            By {post.author} &middot; Published {formatDate(post.publishedDate)} &middot; {post.readingTime}
          </p>

          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-xl border border-border bg-muted">
            <Image
              src={post.coverImage}
              alt={post.coverImageAlt}
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>

          <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-h2:text-2xl prose-h2:font-bold prose-h3:text-lg prose-h3:font-semibold">
            <p>
              The easiest way to make an invoice online is to use an online invoice generator. It helps you create a
              clear invoice without using difficult software or designing one from scratch.
            </p>
            <p>
              First, choose a template and add your business details. Then enter your client&apos;s information,
              invoice number, services, prices, due date and payment terms.
            </p>
            <p>
              Finally, check that every detail is correct. You can then download the invoice as a PDF and send it to
              your client. This guide will explain each step so you can create a professional invoice quickly and
              easily.
            </p>

            <h2 id="step-by-step">How to Make an Invoice Online Step by Step</h2>
            <p>
              You can make an invoice online in a few simple steps. Use the guide below to create an invoice that is
              clear, correct and easy for your client to pay.
            </p>

            <div className="not-prose relative my-8 aspect-[16/9] w-full overflow-hidden rounded-xl border border-border bg-muted">
              <Image
                src="/blog/how-to-make-an-invoice-online/make-invoice-online-8-step-checklist.webp"
                alt="Checklist of the 8 steps to make an invoice online using the MakeInvo invoice generator"
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-cover"
              />
            </div>

            {steps.map((step) => (
              <div key={step.title}>
                <h3>{step.title}</h3>
                {step.body.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            ))}
            <p>
              Keep a copy of every invoice you send. If you run a small company, MakeInvo&apos;s{" "}
              <Link href="/invoice-generator-for-small-businesses">invoice generator for small businesses</Link> can
              help you create and organise professional invoices.
            </p>

            <h2 id="what-to-include">What to Include on an Invoice</h2>
            <p>
              A complete invoice gives your client all the details they need to make a payment. Before sending it,
              make sure it includes the following information.
            </p>
            {invoiceIncludes.map((item) => (
              <div key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
            <p>
              These details are important whether you create invoices as a{" "}
              <Link href="/invoice-generator-for-freelancers">freelancer</Link>,{" "}
              <Link href="/invoice-generator-for-contractors">contractor</Link> or{" "}
              <Link href="/invoice-generator-for-consultants">consultant</Link>.
            </p>

            <h2 id="what-is-an-invoice">What Is an Invoice</h2>
            <p>
              An invoice is a document that asks a client to pay for a product or service. A freelancer, contractor
              or business sends it after completing work or providing something to a customer.
            </p>
            <p>
              It shows what the client bought, how much they need to pay and when the payment is due. It also
              includes important details such as the invoice number, issue date and payment methods.
            </p>
            <p>
              An invoice is different from a receipt. An invoice asks for payment, while a receipt confirms that the
              payment has already been made.
            </p>

            <h2 id="why-it-matters">Why Does a Clear and Professional Invoice Matter</h2>
            <div className="not-prose relative my-8 aspect-[16/9] w-full overflow-hidden rounded-xl border border-border bg-muted">
              <Image
                src="/blog/how-to-make-an-invoice-online/why-a-clear-professional-invoice-matters.webp"
                alt="Infographic showing why a clear, professional invoice builds trust and improves business records"
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-cover"
              />
            </div>
            <p>
              A clear invoice helps your client understand exactly what they are paying for. It shows the work
              completed, the amount due and the payment deadline without causing confusion.
            </p>
            <p>
              A professional invoice also makes your business look organised and trustworthy. It can reduce
              questions, prevent simple mistakes and help clients process payments more easily.
            </p>
            <p>
              Invoices are also useful for keeping business records. They help you track your income, unpaid work,
              taxes and payments throughout the year.
            </p>

            <h2 id="example">Simple Professional Invoice Example</h2>
            <p>
              Here is a simple invoice example for a freelance web designer. It shows the main details a client
              needs to check and make a payment.
            </p>

            <div className="not-prose my-8 overflow-hidden rounded-xl border border-border">
              <div className="grid gap-4 bg-muted/30 p-6 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground">From</p>
                  <p className="font-medium">Bright Web Studio</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Bill to</p>
                  <p className="font-medium">Green Leaf Cafe</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Invoice number</p>
                  <p className="font-medium">INV-001</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Issue date</p>
                  <p className="font-medium">21 September 2026</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Due date</p>
                  <p className="font-medium">5 October 2026</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment method</p>
                  <p className="font-medium">Bank transfer</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-3 font-semibold">Service</th>
                      <th className="px-4 py-3 font-semibold">Quantity</th>
                      <th className="px-4 py-3 font-semibold">Rate</th>
                      <th className="px-4 py-3 font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="px-4 py-3">Homepage design</td>
                      <td className="px-4 py-3">5 hours</td>
                      <td className="px-4 py-3">&pound;30</td>
                      <td className="px-4 py-3">&pound;150</td>
                    </tr>
                    <tr className="border-b border-border bg-muted/20">
                      <td className="px-4 py-3">Contact page design</td>
                      <td className="px-4 py-3">2 hours</td>
                      <td className="px-4 py-3">&pound;30</td>
                      <td className="px-4 py-3">&pound;60</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="space-y-1 border-t border-border p-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">&pound;210</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VAT</span>
                  <span className="font-medium">&pound;0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="font-medium">&pound;10</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-base">
                  <span className="font-semibold">Total amount due</span>
                  <span className="font-bold text-primary">&pound;200</span>
                </div>
                <p className="pt-2 text-muted-foreground">
                  Payment terms: Please pay within 14 days and use INV-001 as the payment reference.
                </p>
              </div>
            </div>
            <p>
              This invoice is easy to understand because it uses clear descriptions, dates and prices. It also tells
              the client how much to pay, when to pay and which payment method to use.
            </p>

            <h2 id="mistakes">Common Invoice Mistakes to Avoid</h2>
            <p>
              Small invoice mistakes can confuse clients and delay payment. Check for these common problems before
              you send an invoice.
            </p>
            <div className="not-prose relative my-8 aspect-[16/9] w-full overflow-hidden rounded-xl border border-border bg-muted">
              <Image
                src="/blog/how-to-make-an-invoice-online/common-invoice-mistakes-to-avoid.webp"
                alt="Infographic of common invoice mistakes to avoid, including missing invoice numbers and unclear line items"
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-cover"
              />
            </div>
            {mistakes.map((item) => (
              <div key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}

            <h2 id="get-paid-faster">How to Send an Invoice and Get Paid Faster</h2>
            <p>
              Send the invoice as soon as you finish the work or deliver the product. Waiting too long to send it
              can also delay the payment.
            </p>
            <p>
              Use a clear email subject line, such as &lsquo;Invoice INV-001 from Bright Web Studio.&rsquo; Add a
              short message that explains the amount due and the payment deadline.
            </p>
            <p>
              Send the invoice as a PDF file. A PDF invoice keeps the same design on phones and computers, making it
              easy for the client to read and save.
            </p>
            <p>
              Set a clear and reasonable due date. Make sure it matches the payment terms you agreed on before
              starting the work.
            </p>
            <p>
              Offer simple payment methods when possible. Bank transfer, card payment and trusted online payment
              services can make it easier for the client to pay.
            </p>
            <p>
              Send a polite reminder a few days before the due date. If the invoice becomes overdue, follow up with
              a friendly message and attach the invoice again.
            </p>
            <p>
              Keep a record of every invoice you send. Mark each one as sent, paid or overdue so you always know
              which payments are still missing.
            </p>

            <h2 id="benefits">Benefits of Using the MakeInvo Online Invoice Generator</h2>
            <p>
              An online invoice generator makes invoicing easier for freelancers, contractors and small business
              owners. It can help you create and send clear invoices without designing each one yourself.
            </p>
            <div className="not-prose relative my-8 aspect-[16/9] w-full overflow-hidden rounded-xl border border-border bg-muted">
              <Image
                src="/blog/how-to-make-an-invoice-online/benefits-of-makeinvo-online-invoice-generator.webp"
                alt="Benefits of using the MakeInvo online invoice generator: faster invoices, fewer errors and organised records"
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-cover"
              />
            </div>
            {benefits.map((item) => (
              <div key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}

            <h2 id="faq">Frequently Asked Questions</h2>
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
            <p>
              You can also use MakeInvo&apos;s <Link href="/invoice-templates">free invoice templates</Link> to
              create a clear layout.
            </p>
          </div>

          <div className="mt-12 rounded-xl border border-border bg-muted/30 p-8 text-center">
            <h2 className="text-2xl font-bold">Make a Professional Invoice Online with MakeInvo</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Learning how to make an invoice online is simple. Choose a clear template, add your business and
              client details, list your services, check the total and include a due date. Always review the invoice
              before sending it, then download it as a PDF and keep a copy for your records.
            </p>
            <div className="mt-6">
              <Link href="/register">
                <Button size="lg">
                  Create Your Free Invoice
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-10 border-t border-border pt-8">
            <Link href="/blog" className="text-sm font-medium text-primary hover:underline">
              &larr; Back to the blog
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
