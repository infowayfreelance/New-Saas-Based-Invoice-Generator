import type { Metadata } from "next"
import Script from "next/script"
import Link from "next/link"
import Image from "next/image"
import { getSiteUrl } from "@/lib/utils/site-url"
import { getBlogPost } from "@/lib/data/blog-posts"

const siteUrl = getSiteUrl()
const post = getBlogPost("how-to-create-an-invoice-template")!
const pageUrl = `${siteUrl}/blog/${post.slug}`
const coverImageUrl = `${siteUrl}${post.coverImage}`

export const metadata: Metadata = {
  title: "How to Create an Invoice Template (UK Guide)",
  description: post.excerpt,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "How to Create an Invoice Template (UK Guide) | MakeInvo",
    description: post.excerpt,
    url: pageUrl,
    type: "article",
    publishedTime: post.publishedDate,
    modifiedTime: post.updatedDate,
    images: [{ url: coverImageUrl, width: 1200, height: 630, alt: post.coverImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Create an Invoice Template (UK Guide)",
    description: post.excerpt,
    images: [coverImageUrl],
  },
  robots: { index: true, follow: true },
}

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "How to Create an Invoice Template (UK): Fields to Include and a Reusable Setup",
    "description": "Learn how to create an invoice template with reusable fields, clear numbering and VAT versions. Compare Word, Docs, Excel and an online invoice maker.",
    "image": "https://makeinvo.com/blog/how-to-create-an-invoice-template/how-to-create-an-invoice-template-featured.webp",
    "datePublished": "2026-11-26",
    "dateModified": "2026-11-26",
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
      "@id": "https://makeinvo.com/blog/how-to-create-an-invoice-template"
    },
    "inLanguage": "en-GB"
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I make my own invoice template?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Create a master layout with reusable business details and obvious placeholders for customer information, dates, references and charges. Copy it for each invoice and check the completed PDF."
        }
      },
      {
        "@type": "Question",
        "name": "What should an invoice template include in the UK?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Include space for the details required for your business and transaction. Use the GOV.UK invoice guidance linked above and check any extra VAT, sole trader or limited company requirements."
        }
      },
      {
        "@type": "Question",
        "name": "Can I create an invoice template in Word or Google Docs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Use a table for the item rows and keep an untouched master. Make a fresh copy, replace the changing details and check the totals before exporting a PDF."
        }
      },
      {
        "@type": "Question",
        "name": "How should I number invoices on a template?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Keep the number as a changing field and record each issued reference. Avoid duplicates, and check HMRC’s additional sequential numbering requirements if you issue VAT invoices."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need a separate VAT invoice template?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A separate master can help if you maintain document files, but the correct VAT information matters more than the filename. Check your registration, the supply and HMRC’s invoice requirements."
        }
      },
      {
        "@type": "Question",
        "name": "Is there a free invoice template maker?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can use MakeInvo’s guest invoice builder and download a PDF without creating an account. Review the available layout options and send the finished invoice to your client yourself."
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
        "name": "How to Create an Invoice Template (UK): Fields to Include and a Reusable Setup",
        "item": "https://makeinvo.com/blog/how-to-create-an-invoice-template"
      }
    ]
  }
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })
}

export default function InvoiceTemplateGuidePage() {
  return (
    <>
      {schemas.map((schema) => (
        <Script key={schema["@type"]} id={`template-guide-${schema["@type"]}`} strategy="beforeInteractive" type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      ))}
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-foreground hover:underline">Blog</Link>
            <span className="mx-2">/</span>
            <span aria-current="page">Create an invoice template</span>
          </nav>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            By {post.author} &middot; Published {formatDate(post.publishedDate)} &middot; {post.readingTime} &middot; Updated {formatDate(post.updatedDate)}
          </p>
          <div className="relative mt-8 aspect-[1200/630] w-full overflow-hidden rounded-xl border border-border bg-muted">
            <Image src={post.coverImage} alt={post.coverImageAlt} fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          </div>
          <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-h2:text-2xl prose-h2:font-bold prose-h3:text-lg prose-h3:font-semibold">
            <p>{"To create an invoice template, start with a blank document or invoice layout, add your fixed business details, and leave clear spaces for information that changes. Include an item table, totals and payment details, then keep an untouched master for future invoices."}</p>
            <p>{"Before you reuse it, decide how you will number invoices and whether you need a VAT version. Check the UK requirements, test the layout with fictional details, and review an exported PDF. Each new invoice should have its own reference and the correct customer information."}</p>
            <p>{"This guide covers the reusable setup, rather than creating a single bill. You can use Word, Google Docs, Excel or an online invoice maker, provided you check each finished invoice before downloading and sending it yourself."}</p>
            <h2>{"Short answer: how to create an invoice template"}</h2>
            <p>{"Build the template around a repeatable process: copy the layout, replace the changing details, check the figures, and save the finished invoice separately."}</p>
            <p>{"Start with these steps:"}</p>
            <ol><li>{"Choose a document, spreadsheet or online invoice layout."}</li><li>{"Add the business information you expect to reuse."}</li><li>{"Mark customer, date, invoice number and work details as placeholders."}</li><li>{"Arrange item descriptions, charges and totals clearly."}</li><li>{"Add payment instructions and agreed terms."}</li><li>{"Test the template before using it for a real customer."}</li></ol>
            <p>{"A template provides the structure; it does not decide what you should charge or which tax treatment applies. Keep those decisions separate from formatting."}</p>
            <p>{"If you need instructions for completing an individual invoice instead, follow our guide to "}<Link href="/blog/how-to-make-an-invoice-online">{"how to make an invoice online"}</Link>{"."}</p>
            <h2>{"Fixed details vs details that change each time"}</h2>
            <p>{"Keep business details in the master, but treat transaction information as something you must review for every invoice."}</p>
            <p>{"The table below separates the two groups. “Reusable” means a useful starting point, not information you can ignore forever."}</p>
            <div className="overflow-x-auto"><table><thead><tr><th scope="col">{"Usually reusable"}</th><th scope="col">{"Review or replace each time"}</th></tr></thead><tbody><tr><td>{"Business name and contact details"}</td><td>{"Customer name, address and billing contact"}</td></tr><tr><td>{"Logo and chosen colours"}</td><td>{"Invoice number and invoice date"}</td></tr><tr><td>{"Item table headings"}</td><td>{"Work description, quantity and agreed charge"}</td></tr><tr><td>{"Payment instructions"}</td><td>{"Supply date, billing period and due date"}</td></tr><tr><td>{"Standard wording for agreed terms"}</td><td>{"Customer reference and any agreed exceptions"}</td></tr><tr><td>{"VAT registration details, where applicable"}</td><td>{"Applicable tax treatment and invoice totals"}</td></tr></tbody></table></div>
            <div className="not-prose relative my-8 aspect-[3/2] w-full overflow-hidden rounded-xl border border-border bg-muted"><Image src="/blog/how-to-create-an-invoice-template/invoice-template-fixed-vs-changing-fields.webp" alt="Invoice template layout showing fixed and changing sections" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /></div>
            <p>{"Use obvious placeholders such as "}<code>{"[Customer name]"}</code>{" or "}<code>{"[Invoice number]"}</code>{" in a document master. Avoid realistic customer details that could survive unnoticed when you copy the file."}</p>
            <p>{"Check reusable information whenever your business details or payment arrangements change. Update the master, then remove older working versions from your normal invoice folder so you do not pick one accidentally."}</p>
            <p>{"A simple naming habit helps: keep one clearly identified master and place completed invoices elsewhere. That separation matters more than choosing an elaborate filename."}</p>
            <h2>{"A clear layout, top to bottom"}</h2>
            <p>{"Arrange the invoice in the order a customer needs to read it: who issued it, what it covers, what is owed and how to pay."}</p>
            <p>{"Place your business details and the invoice heading near the top. Follow with customer information and the invoice reference, dates and any relevant project or purchase order reference."}</p>
            <p>{"Use a table for the work or goods. Give descriptions enough space to explain the charge, and align amounts consistently. Put the subtotal, applicable tax and final total together below it."}</p>
            <p>{"Finish with payment details and agreed terms. Keep decorative elements away from important instructions, and check that your colours remain readable when printed without colour."}</p>
            <p><a href="https://www.gov.uk/invoicing-and-taking-payment-from-customers/invoices-what-they-must-include">{"GOV.UK sets out what invoices must include"}</a>{", including different requirements for sole traders, limited companies and VAT invoices. Use our "}<Link href="/blog/what-to-include-on-a-uk-invoice">{"UK invoice checklist"}</Link>{" when reviewing the fields, rather than treating this layout guide as the full legal list."}</p>
            <h2>{"Setting up invoice numbering"}</h2>
            <p>{"Leave the invoice number as a changing field and keep a record of the references you have used."}</p>
            <p>{"For illustration only, a fictional business could work through "}<code>{"INV-001"}</code>{", "}<code>{"INV-002"}</code>{" and "}<code>{"INV-003"}</code>{". The example shows a pattern, not a required format or a claim that MakeInvo assigns these numbers automatically."}</p>
            <p>{"Do not leave the same example number on every copy. Check the last issued invoice or your invoice register before completing the next one."}</p>
            <p>{"GOV.UK requires a unique invoice identification number. HMRC also sets out sequential numbering requirements for VAT invoices in its guidance linked below. Choose a process that suits your records and check it with your accountant if necessary. "}<a href="https://www.gov.uk/invoicing-and-taking-payment-from-customers/invoices-what-they-must-include">{"GOV.UK"}</a></p>
            <p>{"If several people issue invoices, agree who controls numbering. A tidy template cannot prevent duplicate references when people maintain separate, uncoordinated lists."}</p>
            <h2>{"VAT and non-VAT versions"}</h2>
            <p>{"Keep VAT information separate from your general layout decisions, and use the version appropriate to your business and transaction."}</p>
            <p>{"If you are not VAT-registered, do not charge VAT. If you are registered, check the treatment of the supply and the details your VAT invoice needs before setting up the tax rows. "}<a href="https://www.gov.uk/charge-reclaim-record-vat">{"gov.uk"}</a></p>
            <p><a href="https://www.gov.uk/guidance/vat-guide-notice-700#section16">{"HMRC’s VAT invoice guidance"}</a>{" covers the required information, including numbering, the tax point, registration details and VAT amounts. Do not assume that adding a tax row makes an ordinary document a suitable VAT invoice."}</p>
            <p>{"For manually maintained files, clearly named VAT and non-VAT masters can help you choose the right starting point. Review the tax settings each time, rather than copying an old treatment without checking it."}</p>
            <p>{"This is general information, not tax or legal advice. Ask an accountant about your circumstances, especially if your registration or the type of work changes."}</p>
            <h2>{"Payment terms and payment details block"}</h2>
            <p>{"Give payment instructions their own clear block, using the terms agreed with your customer."}</p>
            <p>{"Keep standard wording in the master if it suits your work, but review the due date and any customer-specific conditions before issuing each invoice."}</p>
            <p>{"Check that payment details are current and that the customer knows which invoice reference to use. A copied bank-details block can look convincing even when it contains outdated information."}</p>
            <p>{"Our guide to "}<Link href="/blog/invoice-payment-terms-uk">{"UK invoice payment terms"}</Link>{" explains the wording in more detail. For project stages and client agreements, see "}<Link href="/blog/how-to-invoice-as-a-freelancer-uk">{"invoicing as a freelancer"}</Link>{"."}</p>
            <p>{"Avoid burying a changed payment arrangement in small print. Agree it with the customer first and make the relevant instructions easy to find."}</p>
            <h2>{"Word, Google Docs or Excel: pros and cons"}</h2>
            <p>{"Choose the format you can maintain accurately, rather than the one with the most decorative starting layout."}</p>
            <div className="overflow-x-auto"><table><thead><tr><th scope="col">{"Format"}</th><th scope="col">{"Useful for"}</th><th scope="col">{"What needs care"}</th></tr></thead><tbody><tr><td>{"Word"}</td><td>{"A document layout you can edit and reuse"}</td><td>{"Copying the master, checking totals and controlling page breaks"}</td></tr><tr><td>{"Google Docs"}</td><td>{"Maintaining an editable document online"}</td><td>{"Making a fresh copy and replacing every placeholder"}</td></tr><tr><td>{"Excel"}</td><td>{"A table-led layout with calculation formulas"}</td><td>{"Checking formula ranges, tax settings and the print area"}</td></tr><tr><td>{"Online invoice maker"}</td><td>{"Entering details into an invoice layout"}</td><td>{"Reviewing supported options and checking the downloaded PDF"}</td></tr></tbody></table></div>
            <p>{"With Word or Google Docs, build the structure using a table rather than repeated spaces. Keep your master separate and make a new copy before entering customer information."}</p>
            <p>{"With Excel, distinguish input cells from calculated cells. Test what happens when you add or remove an item, since a formula can miss a row while the spreadsheet still looks complete."}</p>
            <p>{"Whichever format you choose, test a longer description and a longer customer address. Preview the PDF to check whether totals move to another page or payment instructions become separated from the invoice."}</p>
            <h2>{"Using an online invoice template maker"}</h2>
            <p>{"An online invoice template maker gives you a structured layout without requiring you to build the document table yourself."}</p>
            <p>{"MakeInvo’s "}<Link href="/features">{"templates and branding features"}</Link>{" include multiple templates, a logo, a signature image, brand colours and optional watermark text. Its builder calculates totals, supports tax on individual lines and provides PDF downloads."}</p>
            <div className="not-prose relative my-8 aspect-[3/2] w-full overflow-hidden rounded-xl border border-border bg-muted"><Image src="/blog/how-to-create-an-invoice-template/makeinvo-guest-invoice-builder.webp" alt="MakeInvo guest invoice builder with a live invoice preview" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /></div>
            <p>{"You can create a guest invoice without signing up. An account is needed for saved client information and invoice history; this guide does not describe which plan includes each feature. "}<a href="https://makeinvo.com/features">{"MakeInvo"}</a></p>
            <p>{"Choose the available layout and branding options that suit the invoice, then review the business details, customer, items and totals. Leave out optional visual elements if they distract from the information the customer needs."}</p>
            <p>{"Treat these as invoice-building options. Do not assume there is a custom-field tool, automatic numbering or a “save as template” workflow without checking the current product."}</p>
            <p>{"The reusable part is your consistent layout and checking routine. You still need to review the details of each transaction, even when the software handles the arithmetic."}</p>
            <h2>{"Saving and sending your invoice as a PDF"}</h2>
            <p>{"Export a PDF after checking the editable invoice, then open that PDF before sending it."}</p>
            <div className="not-prose relative my-8 aspect-[3/2] w-full overflow-hidden rounded-xl border border-border bg-muted"><Image src="/blog/how-to-create-an-invoice-template/invoice-pdf-saved-laptop.webp" alt="Saving an invoice from a template as a PDF" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /></div>
            <p>{"Review the customer details, dates, reference, work descriptions and total. Check that the payment block appears and that nothing has been clipped or pushed onto an unexpected page."}</p>
            <p>{"Give the file a recognisable name linked to the invoice reference. Keep the completed PDF separate from your untouched master, alongside the records you use to track issued invoices."}</p>
            <p>{"With MakeInvo, download the PDF and email it to your client yourself. Built-in email delivery and automatic reminder sending are not currently available. "}<a href="https://makeinvo.com/features">{"MakeInvo"}</a></p>
            <p>{"Do not confuse the invoice with proof that payment has arrived. Our "}<Link href="/blog/invoice-vs-receipt">{"invoice vs receipt guide"}</Link>{" explains that difference. A preliminary proposal is different again; see "}<Link href="/blog/what-is-a-proforma-invoice">{"what a proforma invoice is"}</Link>{" before reusing an invoice layout for that purpose."}</p>
            <h2>{"Common invoice template mistakes"}</h2>
            <p>{"The most useful final check looks for information copied from an earlier invoice, not just spelling errors."}</p>
            <ul><li><strong>{"Overwriting the master:"}</strong>{" create a new working copy before entering transaction details."}</li><li><strong>{"Leaving an old reference:"}</strong>{" check the invoice number against your records."}</li><li><strong>{"Keeping yesterday’s customer:"}</strong>{" replace the billing details and relevant contact."}</li><li><strong>{"Copying old tax treatment:"}</strong>{" review what applies to the current supply."}</li><li><strong>{"Breaking spreadsheet totals:"}</strong>{" check formulas after changing the item rows."}</li><li><strong>{"Testing only the editor:"}</strong>{" open the exported PDF and read the finished document."}</li><li><strong>{"Leaving hidden customer details:"}</strong>{" a copied document may still contain comments, notes or extra spreadsheet tabs from an earlier job. Before exporting, check the whole file, remove anything unrelated to the current customer, and confirm that the PDF contains only the pages you intend to share."}</li></ul>
            <p>{"Keep a short checking list beside your invoice process. When you notice a recurring mistake, update the master or the checking list so the next invoice receives the same review."}</p>
            <h2>{"Frequently asked questions"}</h2>
            <h3>{"How do I make my own invoice template?"}</h3>
            <p>{"Create a master layout with reusable business details and obvious placeholders for customer information, dates, references and charges. Copy it for each invoice and check the completed PDF."}</p>
            <h3>{"What should an invoice template include in the UK?"}</h3>
            <p>{"Include space for the details required for your business and transaction. Use the GOV.UK invoice guidance linked above and check any extra VAT, sole trader or limited company requirements."}</p>
            <h3>{"Can I create an invoice template in Word or Google Docs?"}</h3>
            <p>{"Yes. Use a table for the item rows and keep an untouched master. Make a fresh copy, replace the changing details and check the totals before exporting a PDF."}</p>
            <h3>{"How should I number invoices on a template?"}</h3>
            <p>{"Keep the number as a changing field and record each issued reference. Avoid duplicates, and check HMRC’s additional sequential numbering requirements if you issue VAT invoices."}</p>
            <h3>{"Do I need a separate VAT invoice template?"}</h3>
            <p>{"A separate master can help if you maintain document files, but the correct VAT information matters more than the filename. Check your registration, the supply and HMRC’s invoice requirements."}</p>
            <h3>{"Is there a free invoice template maker?"}</h3>
            <p>{"You can use MakeInvo’s guest invoice builder and download a PDF without creating an account. Review the available layout options and send the finished invoice to your client yourself."}</p>
            <h2>{"Create your template with MakeInvo"}</h2>
            <p>{"Start with MakeInvo’s "}<Link href="/">{"free online invoice maker"}</Link>{", choose an available layout and build a consistent invoice structure. Check the changing details, review the PDF and send it to your client yourself."}</p>
          </div>
          <div className="mt-10 border-t border-border pt-8">
            <Link href="/blog" className="text-sm font-medium text-primary hover:underline">&larr; Back to the blog</Link>
          </div>
        </article>
      </div>
    </>
  )
}
