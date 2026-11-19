import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getSiteUrl } from "@/lib/utils/site-url"
import { getBlogPost } from "@/lib/data/blog-posts"

const siteUrl = getSiteUrl()
const post = getBlogPost("what-to-include-on-a-uk-invoice")!
const pageUrl = `${siteUrl}/blog/${post.slug}`
const coverImageUrl = `${siteUrl}${post.coverImage}`

export const metadata: Metadata = {
  title: "What to Include on a UK Invoice (VAT Checklist)",
  description: post.excerpt,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "What to Include on a UK Invoice (VAT Checklist) | MakeInvo",
    description: post.excerpt,
    url: pageUrl,
    type: "article",
    publishedTime: post.publishedDate,
    modifiedTime: post.updatedDate,
    images: [{ url: coverImageUrl, width: 1200, height: 675, alt: post.coverImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: "What to Include on a UK Invoice (VAT Checklist)",
    description: post.excerpt,
    images: [coverImageUrl],
  },
  robots: { index: true, follow: true },
}

const faqs = [
  {
    "question": "1. What information is legally required on a UK invoice?",
    "answer": "A standard UK invoice should include a unique number, supplier details, customer name and address, a description of the goods or services, supply date, invoice date, amounts, VAT where applicable and the total owed. Additional rules apply to VAT invoices."
  },
  {
    "question": "2. Do sole traders need to include their own name on invoices?",
    "answer": "Yes. Sole traders should include their own name alongside any business or trading name they use. If they use a business name, they should also include a legal delivery address."
  },
  {
    "question": "3. Does a limited company need to show its full registered name?",
    "answer": "Yes. It should use its full company name as shown on the certificate of incorporation. If directors' names appear, all directors must be named."
  },
  {
    "question": "4. Do I need to include my address on an invoice?",
    "answer": "Supplier address details should be included. Sole traders using a business name should provide a legal address where documents can be delivered."
  },
  {
    "question": "5. Do all UK invoices need a VAT number?",
    "answer": "No. A VAT number is relevant to VAT-registered businesses. Businesses that are not VAT registered should not present themselves as VAT registered."
  },
  {
    "question": "6. When must I issue a VAT invoice?",
    "answer": "Generally, VAT-registered suppliers must provide a VAT invoice when supplying another VAT-registered business. Check GOV.UK for the applicable requirements."
  },
  {
    "question": "7. Can I send an invoice without a VAT registration number?",
    "answer": "Yes, if you are not VAT registered. You should not charge VAT as a VAT-registered supplier would."
  },
  {
    "question": "8. Does an invoice need a payment due date?",
    "answer": "A clear payment due date is useful because it tells customers when payment is expected. Include the agreed payment terms or a specific date."
  },
  {
    "question": "9. What is the difference between an invoice date and a supply date?",
    "answer": "The invoice date is when you issue the invoice. The supply date is when the goods or services were supplied. They can be different."
  },
  {
    "question": "10. Can I create and send UK invoices as PDFs?",
    "answer": "Yes. PDF is a common format for sending invoices electronically. Check that your document contains the information required for your type of invoice before sending it."
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


function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })
}

export default function UkInvoiceChecklistPage() {
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
            <span aria-current="page">UK invoice checklist</span>
          </nav>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            By {post.author} &middot; Published {formatDate(post.publishedDate)} &middot; {post.readingTime}
          </p>
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-xl border border-border bg-muted">
            <Image src={post.coverImage} alt={post.coverImageAlt} fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          </div>
          <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-h2:text-2xl prose-h2:font-bold prose-h3:text-lg prose-h3:font-semibold">
            <p>{"Whether you are a freelancer, sole trader or limited company, sending invoices is an important part of running a business. But what information must a UK invoice actually contain?"}</p>
            <p>{"Getting the details right helps customers understand what they are paying for and makes your business records easier to manage. It also helps you meet the relevant invoicing requirements."}</p>
            <p>{"There are some differences between ordinary invoices and VAT invoices. Sole traders and limited companies also have different rules about the business names they should display."}</p>
            <p>{"In this guide, we explain what to include on a UK invoice, how VAT affects the information required and what to check before sending your document. We also provide a simple fictional invoice example."}</p>
            <h2>{"Short answer: What must a UK invoice include?"}</h2>
            <div className="not-prose relative my-8 aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted"><Image src="/blog/what-to-include-on-a-uk-invoice/uk-invoice-checklist-fields.webp" alt="Paper invoice with highlighted supplier, invoice number, VAT and total fields" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /></div>
            <p>{"A standard UK invoice should identify the supplier, customer, goods or services supplied and amount owed."}</p>
            <p>{"According to "}<a href="https://www.gov.uk/invoicing-and-taking-payment-from-customers/invoices-what-they-must-include">{"GOV.UK's official invoice guidance"}</a>{", the main details are:"}</p>
            <ul><li><strong>{"Unique identification number:"}</strong>{" Every invoice needs its own identification number."}</li><li><strong>{"Supplier details:"}</strong>{" Your business name, address and contact details."}</li><li><strong>{"Customer details:"}</strong>{" The customer's name and address."}</li><li><strong>{"Description:"}</strong>{" A clear explanation of the goods or services supplied."}</li><li><strong>{"Supply date:"}</strong>{" When the goods or services were supplied."}</li><li><strong>{"Invoice date:"}</strong>{" When the invoice was issued."}</li><li><strong>{"Amount charged:"}</strong>{" The amount being charged for the goods or services."}</li><li><strong>{"VAT amount:"}</strong>{" VAT information where applicable."}</li><li><strong>{"Total owed:"}</strong>{" The final amount the customer needs to pay."}</li></ul>
            <p>{"These are the main fields to check when preparing an ordinary UK invoice. VAT-registered businesses may need to include additional information."}</p>
            <p>{"For the official requirements, always refer to the "}<a href="https://www.gov.uk/invoicing-and-taking-payment-from-customers/invoices-what-they-must-include">{"GOV.UK invoice checklist"}</a>{"."}</p>
            <h2>{"Sole trader vs limited company: What details should appear?"}</h2>
            <div className="not-prose relative my-8 aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted"><Image src="/blog/what-to-include-on-a-uk-invoice/sole-trader-limited-company-invoice.webp" alt="Fictional invoice drafts for a sole trader and a limited company on a desk" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /></div>
            <p>{"Your business structure affects how you identify yourself on an invoice."}</p>
            <h3>{"Invoices for sole traders"}</h3>
            <p>{"If you work as a sole trader, include your own name on your invoices. You can also display the business or trading name you use, but it should not replace your personal name."}</p>
            <p>{"If you use a business name, you should include a legal address where documents can be delivered to you."}</p>
            <p>{"For example, someone trading under a business name should identify themselves using both their personal name and their trading name."}</p>
            <p>{"Also include your contact details, customer information and the other standard invoice fields."}</p>
            <h3>{"Invoices for limited companies"}</h3>
            <p>{"Limited companies have different naming requirements."}</p>
            <p>{"Your invoice should show the full company name exactly as it appears on the certificate of incorporation. Avoid shortening the name or using an informal alternative."}</p>
            <p>{"There is also a specific rule about directors. If you choose to include directors' names on an invoice, all directors must be named."}</p>
            <p>{"Before creating a reusable invoice template, check your company's official name and make sure the details are accurate."}</p>
            <h2>{"What a VAT invoice must show"}</h2>
            <div className="not-prose relative my-8 aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted"><Image src="/blog/what-to-include-on-a-uk-invoice/uk-vat-invoice-section.webp" alt="Invoice editor showing a VAT rate and VAT amount section" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /></div>
            <p>{"VAT invoices contain additional information compared with ordinary invoices."}</p>
            <p>{"Generally, a VAT-registered supplier must provide a VAT invoice when supplying another VAT-registered business. These invoices help customers understand the VAT charged and provide the necessary transaction information."}</p>
            <p>{"Depending on the invoice type, additional details can include:"}</p>
            <ul><li>{"The supplier's VAT registration number."}</li><li>{"Information identifying the VAT invoice."}</li><li>{"The relevant VAT rate."}</li><li>{"Net amounts and VAT amounts."}</li><li>{"The total payable, including VAT."}</li><li>{"Other transaction information required by the applicable rules."}</li></ul>
            <h3>{"Standard and simplified VAT invoices"}</h3>
            <p>{"You may come across standard and simplified VAT invoices. They have different information requirements and are not suitable for every transaction."}</p>
            <p>{"Do not assume that a simplified invoice can be used in every situation. The permitted threshold and other conditions should be checked against the latest official guidance."}</p>
            <p>{"For the complete requirements, read the "}<a href="https://www.gov.uk/invoicing-and-taking-payment-from-customers/invoices-what-they-must-include">{"GOV.UK invoice guidance"}</a>{"."}</p>
            <p><strong>{"Important:"}</strong>{" This article provides general invoicing information, not tax advice. If you are unsure about your VAT responsibilities, check HMRC guidance or speak to a qualified accountant."}</p>
            <h2>{"Invoice number, dates and payment terms"}</h2>
            <p>{"Invoice numbers and dates help identify transactions and keep business records organised."}</p>
            <h3>{"Use a unique invoice number"}</h3>
            <p>{"Every invoice needs a unique identification number. You can use a straightforward sequence such as:"}</p>
            <ul><li>{"INV-001"}</li><li>{"INV-002"}</li><li>{"INV-003"}</li></ul>
            <p>{"Choose a consistent format and avoid duplicate numbers. This makes it easier to find a particular invoice when reviewing your records."}</p>
            <h3>{"Include both relevant dates"}</h3>
            <p>{"Two dates are particularly important:"}</p>
            <ul><li><strong>{"Invoice date:"}</strong>{" The date you issue the invoice."}</li><li><strong>{"Supply date:"}</strong>{" The date the goods or services were supplied."}</li></ul>
            <p>{"These dates do not always match. For example, you might complete a website project on 12 November but issue the invoice on 15 November."}</p>
            <p>{"Showing both dates helps explain when the work took place and when the invoice was created."}</p>
            <h3>{"Add clear payment terms"}</h3>
            <p>{"Payment terms tell customers when you expect payment."}</p>
            <p>{"For example, you might agree on payment within 14 days or specify a particular calendar date."}</p>
            <p>{"These are examples, not universal legal requirements. Make sure your terms are clear and agreed with your customer."}</p>
            <h2>{"Line items, tax and total: How to break down an invoice"}</h2>
            <p>{"A customer should be able to understand exactly what they are paying for without having to ask for clarification."}</p>
            <p>{"Use specific descriptions rather than general phrases such as \"services provided\"."}</p>
            <p>{"For example:"}</p>
            <div className="overflow-x-auto"><table><thead><tr><th>{"Description"}</th><th>{"Amount"}</th></tr></thead><tbody><tr><td>{"Website content writing"}</td><td>{"£150.00"}</td></tr><tr><td>{"Website page editing"}</td><td>{"£75.00"}</td></tr><tr><td>{"Subtotal"}</td><td>{"£225.00"}</td></tr></tbody></table></div>
            <p>{"For invoices containing several products or services, consider showing:"}</p>
            <ul><li>{"Description of each item."}</li><li>{"Quantity and unit price, where relevant."}</li><li>{"Subtotal."}</li><li>{"Discounts, where applicable."}</li><li>{"VAT information, where required."}</li><li>{"Final amount payable."}</li></ul>
            <h3>{"Show VAT clearly"}</h3>
            <p>{"If VAT applies, present the relevant VAT information clearly. Customers should be able to understand the amounts charged and the final total, in line with the requirements for that invoice type."}</p>
            <p>{"Do not add VAT simply to make an invoice look more professional. Only charge VAT where the applicable rules allow or require it."}</p>
            <h3>{"Make the final amount easy to find"}</h3>
            <p>{"The total owed should be easy to identify. Avoid layouts that make customers calculate several figures themselves."}</p>
            <p>{"A clear breakdown helps prevent misunderstandings and makes invoices easier to check."}</p>
            <h2>{"Invoice vs receipt: What's the difference?"}</h2>
            <p>{"An invoice requests payment for goods or services. A receipt confirms that payment has been received."}</p>
            <p>{"For example, you send an invoice after completing a project. Once the customer pays, you can provide a receipt as confirmation."}</p>
            <p>{"Both documents are useful for business records."}</p>
            <p>{"For more help with creating invoices, read our guide: "}<Link href="/blog/how-to-make-an-invoice-online">{"How to Make an Invoice Online"}</Link>{"."}</p>
            <h2>{"A simple fictional UK invoice example"}</h2>
            <p>{"Here is a fictional example showing how the main invoice details can be arranged."}</p>
            <p>{"All business names, addresses, contact details and amounts are invented for illustration. The VAT line is also illustrative and does not represent a recommendation about the VAT treatment of any real transaction."}</p>
            <p><strong>{"Example invoice"}</strong></p>
            <p><strong>{"BRIGHT PATH DESIGN"}</strong>{" A fictional sole trader business 10 Example Street, Manchester, M1 1AA Email: hello@example.com"}</p>
            <p><strong>{"INVOICE"}</strong></p>
            <div className="overflow-x-auto"><table><thead><tr><th>{"Invoice detail"}</th><th>{"Information"}</th></tr></thead><tbody><tr><td>{"Invoice number"}</td><td>{"INV-2026-014"}</td></tr><tr><td>{"Invoice date"}</td><td>{"19 November 2026"}</td></tr><tr><td>{"Supply date"}</td><td>{"15 November 2026"}</td></tr><tr><td>{"Customer"}</td><td>{"Example Customer"}</td></tr><tr><td>{"Customer address"}</td><td>{"25 Sample Road, Manchester, M2 2BB"}</td></tr></tbody></table></div>
            <p><strong>{"Services supplied"}</strong></p>
            <div className="overflow-x-auto"><table><thead><tr><th>{"Description"}</th><th>{"Amount"}</th></tr></thead><tbody><tr><td>{"Website homepage design"}</td><td>{"£300.00"}</td></tr><tr><td>{"Additional page design"}</td><td>{"£100.00"}</td></tr><tr><td>{"Subtotal"}</td><td>{"£400.00"}</td></tr><tr><td>{"VAT (illustrative only)"}</td><td>{"Illustrative amount"}</td></tr><tr><td>{"Total owed"}</td><td>{"Illustrative total"}</td></tr></tbody></table></div>
            <p>{"Payment terms: Payment due within 14 days."}</p>
            <p>{"Thank you for your business."}</p>
            <p>{"This example demonstrates how supplier information, customer details, dates, descriptions and totals can fit into one document."}</p>
            <p>{"The VAT treatment and final total would need to be completed according to the actual transaction and applicable requirements."}</p>
            <h2>{"Common invoice mistakes to avoid"}</h2>
            <p>{"Small errors can make invoices confusing or create unnecessary work when checking business records."}</p>
            <p>{"Before sending an invoice, look out for these common mistakes:"}</p>
            <ul><li><strong>{"Missing invoice number:"}</strong>{" Give every invoice a unique identification number."}</li><li><strong>{"Incorrect business details:"}</strong>{" Check your name, business name and address."}</li><li><strong>{"Incomplete company name:"}</strong>{" Limited companies should use their full name from the certificate of incorporation."}</li><li><strong>{"Missing customer details:"}</strong>{" Include the customer's name and address."}</li><li><strong>{"Incorrect dates:"}</strong>{" Check both the invoice date and supply date."}</li><li><strong>{"Vague descriptions:"}</strong>{" Explain exactly what you supplied."}</li><li><strong>{"Unclear totals:"}</strong>{" Make the amount owed easy to find."}</li><li><strong>{"Missing VAT details:"}</strong>{" Include the relevant information when VAT invoice rules apply."}</li><li><strong>{"Duplicate numbers:"}</strong>{" Keep your invoice numbering consistent."}</li><li><strong>{"Outdated templates:"}</strong>{" Update your details when your business information changes."}</li></ul>
            <p>{"A quick review before sending can help catch these problems. If you are VAT registered, check your template against the latest HMRC requirements."}</p>
            <h2>{"How to put all these details on a PDF invoice"}</h2>
            <p>{"Once you understand the required information, arranging it in a clear document becomes much easier."}</p>
            <p>{"PDF invoices are a common way to send invoices electronically. They provide a convenient format that customers can open and keep for their records."}</p>
            <p>{"A simple invoice layout can contain five sections:"}</p>
            <ol><li><strong>{"Business information:"}</strong>{" Place your business name, address and contact details near the top."}</li><li><strong>{"Customer information:"}</strong>{" Include the customer's name and address so it is clear who the invoice is for."}</li><li><strong>{"Invoice identification:"}</strong>{" Display the unique invoice number, invoice date and supply date."}</li><li><strong>{"Description and amounts:"}</strong>{" List the products or services supplied, with the relevant amounts and VAT information where applicable."}</li><li><strong>{"Payment information:"}</strong>{" Show the total owed and the agreed payment terms."}</li></ol>
            <p>{"Keeping the same layout for future invoices saves time and makes your documents easier to recognise."}</p>
            <h3>{"Create invoices with MakeInvo"}</h3>
            <p>{"MakeInvo offers an online invoicing solution for people who want a straightforward way to prepare invoices."}</p>
            <p>{"Visit the "}<Link href="/">{"MakeInvo homepage"}</Link>{" to get started."}</p>
            <p>{"You can also explore these resources:"}</p>
            <ul><li>{"Browse "}<Link href="/invoice-templates">{"invoice templates"}</Link>{" for layout ideas."}</li><li>{"Explore the "}<Link href="/invoice-generator-for-freelancers">{"invoice generator for freelancers"}</Link>{"."}</li><li>{"Visit the "}<Link href="/features">{"MakeInvo features page"}</Link>{" to explore the available tools."}</li><li>{"Check "}<Link href="/pricing">{"MakeInvo pricing"}</Link>{" for current plan information."}</li><li><Link href="/register">{"Create your MakeInvo account"}</Link>{" to get started."}</li></ul>
            <p>{"Whichever method you choose, check all the details before sending your final PDF invoice."}</p>
            <h2>{"Frequently asked questions"}</h2>
            <h3>{"1. What information is legally required on a UK invoice?"}</h3>
            <p>{"A standard UK invoice should include a unique number, supplier details, customer name and address, a description of the goods or services, supply date, invoice date, amounts, VAT where applicable and the total owed. Additional rules apply to VAT invoices."}</p>
            <h3>{"2. Do sole traders need to include their own name on invoices?"}</h3>
            <p>{"Yes. Sole traders should include their own name alongside any business or trading name they use. If they use a business name, they should also include a legal delivery address."}</p>
            <h3>{"3. Does a limited company need to show its full registered name?"}</h3>
            <p>{"Yes. It should use its full company name as shown on the certificate of incorporation. If directors' names appear, all directors must be named."}</p>
            <h3>{"4. Do I need to include my address on an invoice?"}</h3>
            <p>{"Supplier address details should be included. Sole traders using a business name should provide a legal address where documents can be delivered."}</p>
            <h3>{"5. Do all UK invoices need a VAT number?"}</h3>
            <p>{"No. A VAT number is relevant to VAT-registered businesses. Businesses that are not VAT registered should not present themselves as VAT registered."}</p>
            <h3>{"6. When must I issue a VAT invoice?"}</h3>
            <p>{"Generally, VAT-registered suppliers must provide a VAT invoice when supplying another VAT-registered business. Check GOV.UK for the applicable requirements."}</p>
            <h3>{"7. Can I send an invoice without a VAT registration number?"}</h3>
            <p>{"Yes, if you are not VAT registered. You should not charge VAT as a VAT-registered supplier would."}</p>
            <h3>{"8. Does an invoice need a payment due date?"}</h3>
            <p>{"A clear payment due date is useful because it tells customers when payment is expected. Include the agreed payment terms or a specific date."}</p>
            <h3>{"9. What is the difference between an invoice date and a supply date?"}</h3>
            <p>{"The invoice date is when you issue the invoice. The supply date is when the goods or services were supplied. They can be different."}</p>
            <h3>{"10. Can I create and send UK invoices as PDFs?"}</h3>
            <p>{"Yes. PDF is a common format for sending invoices electronically. Check that your document contains the information required for your type of invoice before sending it."}</p>
            <h2>{"Create a UK invoice with MakeInvo"}</h2>
            <p>{"A complete invoice does not need to be complicated. Include the correct business and customer details, dates, descriptions and amounts, and make sure the final total is clear."}</p>
            <p>{"If you are VAT registered, check the additional requirements before issuing your invoice."}</p>
            <p>{"Ready to create your next invoice?"}</p>
            <p><Link href="/">{"Create an invoice with MakeInvo"}</Link>{" to get started with online invoicing and prepare clear invoices for your customers."}</p>
          </div>
          <div className="mt-10 border-t border-border pt-8">
            <Link href="/blog" className="text-sm font-medium text-primary hover:underline">&larr; Back to the blog</Link>
          </div>
        </article>
      </div>
    </>
  )
}
