import type { Metadata } from "next"
import Script from "next/script"
import Link from "next/link"
import Image from "next/image"
import { getSiteUrl } from "@/lib/utils/site-url"
import { getBlogPost } from "@/lib/data/blog-posts"

const siteUrl = getSiteUrl()
const post = getBlogPost("how-to-add-vat-to-an-invoice")!
const pageUrl = `${siteUrl}/blog/${post.slug}`
const coverImageUrl = `${siteUrl}${post.coverImage}`

export const metadata: Metadata = {
  title: { absolute: "How to Add VAT to a UK Invoice (Plain Guide)" },
  description: post.excerpt,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "How to Add VAT to a UK Invoice (Plain Guide)",
    description: post.excerpt,
    url: pageUrl,
    type: "article",
    publishedTime: post.publishedDate,
    modifiedTime: post.updatedDate,
    images: [{ url: coverImageUrl, width: 1200, height: 630, alt: post.coverImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Add VAT to a UK Invoice (Plain Guide)",
    description: post.excerpt,
    images: [coverImageUrl],
  },
  robots: { index: true, follow: true },
}

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "How to Add VAT to a UK Invoice (If You're VAT-Registered)",
    "description": "Add VAT only if you are VAT-registered. Show your VAT number and tax separately, check current GOV.UK rates, and add tax to each line in MakeInvo.",
    "image": "https://makeinvo.com/blog/how-to-add-vat-to-an-invoice/how-to-add-vat-to-an-invoice-featured.webp",
    "datePublished": "2026-11-27",
    "dateModified": "2026-11-27",
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
      "@id": "https://makeinvo.com/blog/how-to-add-vat-to-an-invoice"
    },
    "inLanguage": "en-GB"
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Do I add VAT if I am not VAT-registered?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Leave VAT off if you are not registered. Do not add a VAT charge just because a customer asks for a VAT invoice."
        }
      },
      {
        "@type": "Question",
        "name": "How do I calculate 20% VAT on an invoice?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For a correctly standard-rated net charge, multiply by 0.20 to find VAT. Add that VAT to the net charge, or multiply the net charge by 1.2 for the gross total."
        }
      },
      {
        "@type": "Question",
        "name": "What must a VAT invoice include?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It needs the applicable invoice details plus VAT information, including your VAT number and VAT shown separately. Check the GOV.UK requirements rather than treating a tax total alone as sufficient."
        }
      },
      {
        "@type": "Question",
        "name": "Can I add VAT in MakeInvo without creating an account?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. The guest generator supports tax on each line and PDF download without an account. Only add VAT if you are registered, and check the applicable rate yourself."
        }
      },
      {
        "@type": "Question",
        "name": "What if some lines are reduced-rated or zero-rated?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Check the correct treatment for each supply and review each line separately. Zero-rated and exempt supplies are different; follow GOV.UK guidance if you are unsure how to show them."
        }
      },
      {
        "@type": "Question",
        "name": "Where do I put my VAT registration number?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Place it clearly with your business details on the invoice. Check the downloaded PDF to make sure it is present, correct and easy for your customer to find."
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
        "name": "How to Add VAT to a UK Invoice (If You're VAT-Registered)",
        "item": "https://makeinvo.com/blog/how-to-add-vat-to-an-invoice"
      }
    ]
  }
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })
}

export default function VatInvoiceGuidePage() {
  return (
    <>
      {schemas.map((schema) => (
        <Script key={schema["@type"]} id={`vat-guide-${schema["@type"]}`} strategy="beforeInteractive" type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      ))}
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-foreground hover:underline">Blog</Link>
            <span className="mx-2">/</span>
            <span aria-current="page">Add VAT to an invoice</span>
          </nav>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            By {post.author} &middot; Published {formatDate(post.publishedDate)} &middot; {post.readingTime} &middot; Updated {formatDate(post.updatedDate)}
          </p>
          <div className="relative mt-8 aspect-[1200/630] w-full overflow-hidden rounded-xl border border-border bg-muted">
            <Image src={post.coverImage} alt={post.coverImageAlt} fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          </div>
          <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-h2:text-2xl prose-h2:font-bold prose-h3:text-lg prose-h3:font-semibold">
            <p>{"To add VAT to a UK invoice, first check that you are VAT-registered and that VAT applies to what you are selling. Work out the tax using the correct rate, then show the amount before VAT, the VAT amount and the total payable."}</p>
            <p>{"Include your VAT registration number and show VAT separately. If you are not VAT-registered, leave VAT off. Do not add a tax charge simply because a customer asks for a VAT invoice or because another business charges it."}</p>
            <p>{"This guide explains the calculation, the details to check and how to add tax to each line in MakeInvo. Rates and registration guidance were checked on 27 November 2026. This is general information, not tax or legal advice; check GOV.UK for your circumstances."}</p>
            <h2>{"Short answer: when to add VAT, and when not to"}</h2>
            <p>{"VAT registration and the correct treatment of your sale come before the invoice calculation. Being registered does not mean every item automatically attracts the standard rate. Some supplies have a different rate, while others are exempt."}</p>
            <p>{"Start by asking two separate questions: are you registered, and what VAT treatment applies to this particular item? A customer's location or an unusual type of sale may need more checking than a straightforward UK transaction."}</p>
            <p><a href="https://www.gov.uk/charge-reclaim-record-vat">{"GOV.UK explains when businesses must charge VAT"}</a>{". Use that guidance before building your invoice. If you cannot tell how a sale should be treated, ask an accountant rather than choosing a rate that makes the total look right."}</p>
            <p>{"For freelancers, it helps to settle the agreed fee and whether it includes VAT before billing. Our guide to "}<Link href="/blog/how-to-invoice-as-a-freelancer-uk">{"invoicing as a freelancer in the UK"}</Link>{" covers the wider process without turning every invoice into a tax calculation exercise."}</p>
            <h2>{"Check you are VAT-registered (and where to confirm the rules)"}</h2>
            <p>{"As checked on 27 November 2026, GOV.UK says you must register if your total VAT-taxable turnover for the last 12 months goes over £90,000, or you expect it to exceed £90,000 in the next 30 days. Voluntary registration is possible below that threshold. "}<a href="https://www.gov.uk/register-for-vat">{"GOV.UK"}</a></p>
            <p>{"These are turnover tests, not profit tests. Do not treat the threshold as a reason to start adding VAT before checking your registration position. Other registration rules can apply, so a short article cannot decide the answer for every business."}</p>
            <p>{"Check the current "}<a href="https://www.gov.uk/register-for-vat">{"GOV.UK VAT registration guidance"}</a>{", including the rules that apply to your circumstances. If you have recently registered, confirm your effective registration date rather than assuming the date you opened the invoice is what matters."}</p>
            <p>{"Keep your registration details somewhere you can check them while preparing invoices. Copy the VAT number carefully, and compare it with your records before exporting a document. A saved draft can still contain an old business name or an unfinished placeholder."}</p>
            <h2>{"How to calculate VAT on a line (standard and reduced rate)"}</h2>
            <div className="not-prose relative my-8 aspect-[3/2] w-full overflow-hidden rounded-xl border border-border bg-muted"><Image src="/blog/how-to-add-vat-to-an-invoice/vat-calculation-notebook.webp" alt="Working out VAT to add to an invoice" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /></div>
            <p>{"Begin with the net amount: the charge before VAT. Multiply that amount by the applicable percentage to find the VAT. Add the two amounts together to get the gross total, which is the amount including VAT."}</p>
            <p>{"The "}<a href="https://www.gov.uk/vat-rates">{"current GOV.UK VAT rates"}</a>{" are 20% standard rate, 5% reduced rate and 0% zero rate, checked on 27 November 2026. Which rate applies depends on the goods or services. A lower rate is not an optional discount."}</p>
            <h3>{"Standard-rate example"}</h3>
            <p><strong>{"Fictional arithmetic example:"}</strong>{" assume a VAT-registered business supplies a service that correctly attracts the standard rate. Its agreed net charge is £100. These figures illustrate the calculation; they are not a MakeInvo price or a recommendation for your fees."}</p>
            <ul><li>{"Net charge: £100."}</li><li>{"VAT calculation: £100 × 20% = £20."}</li><li>{"Total including VAT: £100 + £20 = £120."}</li></ul>
            <p>{"You can also multiply the net amount by 1.2 to get the standard-rate gross total. Keep the VAT amount visible separately, even when you use that shortcut to check your arithmetic."}</p>
            <h3>{"Reduced-rate example"}</h3>
            <p><strong>{"Fictional arithmetic example:"}</strong>{" assume the supply correctly qualifies for the reduced rate and the net charge is £200. Confirm the rate first; the calculation alone does not establish whether a real sale qualifies."}</p>
            <ul><li>{"Net charge: £200."}</li><li>{"VAT calculation: £200 × 5% = £10."}</li><li>{"Total including VAT: £200 + £10 = £210."}</li></ul>
            <p>{"Multiplying the net amount by 1.05 gives the same gross total. GOV.UK's "}<a href="https://www.gov.uk/charge-reclaim-record-vat">{"guide to charging and calculating VAT"}</a>{" explains these methods. Check whether your starting figure already includes VAT before adding anything, or you could charge the tax twice."}</p>
            <h3>{"Mixed rates, zero-rated items and exempt supplies"}</h3>
            <p>{"Check each item on its own. An invoice can need different treatment for different lines, so do not apply one rate across everything without checking. Keep descriptions clear enough to connect each charge with the work or goods supplied."}</p>
            <p>{"Zero-rated and exempt are different VAT categories. Neither should be used as a general label for a business that is not registered. Follow the official guidance for the supply, and ask for help if your invoice combines unfamiliar treatments. "}<a href="https://www.gov.uk/vat-rates">{"GOV.UK"}</a></p>
            <p>{"For a manual cross-check, review the net amounts first, then the VAT amounts, then the final total. If the result differs from your draft, check the starting figures and rates before changing the total. Do not force a match by guessing a tax adjustment."}</p>
            <p>{"For a longer invoice, make a separate working list of the rates you have checked for each type of item. Compare it with the draft line by line. This is a checking aid, not a substitute for official guidance or professional advice."}</p>
            <h2>{"What to show on a VAT invoice"}</h2>
            <p>{"Show your VAT registration number and make the VAT charge separate from the underlying charge. The customer should be able to understand what they are paying for and how the final amount was reached without reconstructing your calculation."}</p>
            <p>{"VAT invoices have additional requirements beyond an ordinary invoice. Consult "}<a href="https://www.gov.uk/invoicing-and-taking-payment-from-customers/invoices-what-they-must-include">{"GOV.UK's invoice requirements"}</a>{" for the official rules, and use our "}<Link href="/blog/what-to-include-on-a-uk-invoice">{"UK invoice checklist"}</Link>{" for the wider field-by-field review. This article focuses on adding and showing the tax."}</p>
            <p>{"When reviewing the document, look for a clear relationship between each description, its net charge and its VAT treatment. Then check the summary shows the net total, VAT and amount payable. Make sure your VAT number is readable on the finished PDF."}</p>
            <p>{"Do not confuse a request for payment with a preliminary document. If you are preparing a proforma, read "}<Link href="/blog/what-is-a-proforma-invoice">{"what a proforma invoice is"}</Link>{" before copying the same wording or tax presentation into it."}</p>
            <h2>{"Adding tax on each line in MakeInvo"}</h2>
            <div className="not-prose relative my-8 aspect-[3/2] w-full overflow-hidden rounded-xl border border-border bg-muted"><Image src="/blog/how-to-add-vat-to-an-invoice/invoice-line-with-tax-field.webp" alt="Adding tax to invoice line items" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /></div>
            <p>{"MakeInvo supports tax on each invoice line and calculates totals. Its "}<Link href="/features">{"features page"}</Link>{" confirms that guest users can create and download a PDF without an account. The correct VAT treatment is still something you must establish before using the builder."}</p>
            <h3>{"Prepare the items and check the tax"}</h3>
            <p>{"First, gather the agreed charges and identify whether they are net or VAT-inclusive. Have your VAT registration details and the customer's billing information ready. This reduces the chance of mixing an agreed total with a figure that excludes tax."}</p>
            <p>{"Enter clear descriptions and the charges for your items. Use the per-line tax option for the applicable rate, then review the calculated totals. For a general walkthrough of the builder, follow "}<Link href="/blog/how-to-make-an-invoice-online">{"how to make an invoice online"}</Link>{"."}</p>
            <p>{"Check one line manually against the method above before reviewing the rest. If some items have different rates, check those separately. An automatic total can accurately add up incorrect inputs, so it does not replace your decision about the right tax treatment."}</p>
            <p>{"If you work from a repeatable layout, keep the permanent business details separate in your preparation notes from the details you must review each time. Our guide to "}<Link href="/blog/how-to-create-an-invoice-template">{"creating an invoice template"}</Link>{" explains that distinction."}</p>
            <p>{"Before exporting, read the descriptions without looking at your notes. Could the customer connect each charge with the agreed work? If two lines look similar but have different tax treatment, check that you have not copied the wrong rate while entering them."}</p>
            <h3>{"Download the PDF and send it yourself"}</h3>
            <div className="not-prose relative my-8 aspect-[3/2] w-full overflow-hidden rounded-xl border border-border bg-muted"><Image src="/blog/how-to-add-vat-to-an-invoice/vat-invoice-pdf-ready-to-send.webp" alt="VAT invoice PDF ready to send to a client" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /></div>
            <p>{"Download the PDF, then open the exported file for a final check. Look at the actual document your customer will receive, including the VAT number, item descriptions, tax amounts and total. Do not rely only on what you remember entering."}</p>
            <p>{"Send the downloaded PDF yourself, such as by attaching it to your own email. MakeInvo does not currently provide built-in email delivery or automatic reminder sending. Check the attachment and recipient before sending, and keep a copy with your own invoice records. "}<a href="https://makeinvo.com/features">{"MakeInvo"}</a></p>
            <p>{"If you spot a problem before sending, return to the invoice details and correct it first. Export and review the replacement PDF, then make sure you attach that version. Clearly named files help prevent an earlier draft being sent by mistake."}</p>
            <p>{"Use a clear email subject and identify which invoice you have attached. If the customer gave you a billing contact or purchase reference, check those details against the agreement. These small checks make the document easier to route to the right person."}</p>
            <p>{"Keep your calculation notes with the invoice copy. That gives you a useful starting point if the customer later asks how you reached a figure. Notes should explain your inputs, rather than simply repeat the final total from the PDF."}</p>
            <h2>{"Common VAT invoice mistakes"}</h2>
            <h3>{"Adding VAT without being registered"}</h3>
            <p>{"Do not add a VAT charge because your invoice layout has a tax box. Establish your registration position first. If you are not registered, leave VAT off rather than presenting yourself as registered or borrowing another business's VAT number."}</p>
            <h3>{"Using the wrong starting amount"}</h3>
            <p>{"Check whether the agreed charge includes VAT. A net amount needs the applicable VAT added; a gross amount already includes it. Label your working notes clearly so a copied quote or project total does not get taxed a second time."}</p>
            <h3>{"Choosing a rate without checking the supply"}</h3>
            <p>{"Do not use the standard rate automatically or choose a reduced rate because a client requests it. Check the official guidance for what you supply. When the treatment is unclear, resolve that question before creating a final document."}</p>
            <h3>{"Leaving an old VAT number or unclear total"}</h3>
            <p>{"Reused documents can carry old details forward. Compare your VAT number with your records, check that the tax is shown separately and read the final amount as a customer would. The PDF should not leave them guessing which figure to pay."}</p>
            <h3>{"Skipping the final document check"}</h3>
            <p>{"A draft can look complete while still containing an unclear description or an incorrect amount. Review the exported PDF alongside the agreed charges. If someone else prepares your invoices, give them the checked details rather than expecting them to infer the tax treatment."}</p>
            <p>{"A useful final check is to read the invoice in three passes. First check who it is for and what was supplied. Then check the amounts and tax. Finally check the PDF attachment against the version you intend to send."}</p>
            <p>{"Keep questions about the agreed fee separate from questions about VAT. If a client disputes the total, compare the agreement, your net charge and the tax calculation in that order. This helps you explain the difference without changing a rate simply to reach the amount they expected."}</p>
            <h2>{"Frequently asked questions"}</h2>
            <h3>{"Do I add VAT if I am not VAT-registered?"}</h3>
            <p>{"No. Leave VAT off if you are not registered. Do not add a VAT charge just because a customer asks for a VAT invoice."}</p>
            <h3>{"How do I calculate 20% VAT on an invoice?"}</h3>
            <p>{"For a correctly standard-rated net charge, multiply by 0.20 to find VAT. Add that VAT to the net charge, or multiply the net charge by 1.2 for the gross total."}</p>
            <h3>{"What must a VAT invoice include?"}</h3>
            <p>{"It needs the applicable invoice details plus VAT information, including your VAT number and VAT shown separately. Check the GOV.UK requirements rather than treating a tax total alone as sufficient."}</p>
            <h3>{"Can I add VAT in MakeInvo without creating an account?"}</h3>
            <p>{"Yes. The guest generator supports tax on each line and PDF download without an account. Only add VAT if you are registered, and check the applicable rate yourself."}</p>
            <h3>{"What if some lines are reduced-rated or zero-rated?"}</h3>
            <p>{"Check the correct treatment for each supply and review each line separately. Zero-rated and exempt supplies are different; follow GOV.UK guidance if you are unsure how to show them."}</p>
            <h3>{"Where do I put my VAT registration number?"}</h3>
            <p>{"Place it clearly with your business details on the invoice. Check the downloaded PDF to make sure it is present, correct and easy for your customer to find."}</p>
            <h2>{"Create a VAT invoice"}</h2>
            <p>{"Once you have checked your registration, rates and charges, use MakeInvo's "}<Link href="/">{"free invoice generator"}</Link>{" to prepare your invoice. You can browse "}<Link href="/invoice-templates">{"invoice templates"}</Link>{" for a layout, review the tax and totals, then download the PDF and send it yourself."}</p>
          </div>
          <div className="mt-10 border-t border-border pt-8">
            <Link href="/blog" className="text-sm font-medium text-primary hover:underline">&larr; Back to the blog</Link>
          </div>
        </article>
      </div>
    </>
  )
}
