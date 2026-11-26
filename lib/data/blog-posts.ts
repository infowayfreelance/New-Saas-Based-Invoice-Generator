export interface BlogPost {
  slug: string
  title: string
  // Shown on the blog index card and used as the meta description / OG description.
  excerpt: string
  publishedDate: string // ISO date
  updatedDate: string // ISO date
  readingTime: string
  author: string
  coverImage: string
  coverImageAlt: string
}

export const BLOG_POSTS: BlogPost[] = [
{
  "slug": "how-to-create-an-invoice-template",
  "title": "How to Create an Invoice Template (UK): Fields to Include and a Reusable Setup",
  "excerpt": "Learn how to create an invoice template with reusable fields, clear numbering and VAT versions. Compare Word, Docs, Excel and an online invoice maker.",
  "publishedDate": "2026-11-26",
  "updatedDate": "2026-11-26",
  "readingTime": "10 min read",
  "author": "MakeInvo Team",
  "coverImage": "/blog/how-to-create-an-invoice-template/how-to-create-an-invoice-template-featured.webp",
  "coverImageAlt": "Freelancer creating an invoice template on a laptop"
},
{
  "slug": "what-is-a-proforma-invoice",
  "title": "What Is a Proforma Invoice? A Plain-English UK Guide (With VAT Points)",
  "excerpt": "A proforma invoice sets out a sale before it happens. When to use one, what to include, how it differs from an invoice or quote, plus VAT basics.",
  "publishedDate": "2026-11-25",
  "updatedDate": "2026-11-25",
  "readingTime": "10 min read",
  "author": "MakeInvo Team",
  "coverImage": "/blog/what-is-a-proforma-invoice/what-is-a-proforma-invoice-featured.webp",
  "coverImageAlt": "Small business owner reviewing a proforma invoice before a sale"
},
{
  "slug": "how-to-invoice-as-a-freelancer-uk",
  "title": "How to Invoice as a Freelancer in the UK: A Step-by-Step Guide",
  "excerpt": "Agree terms, number your invoices, bill day rates, hours or projects, add expenses and VAT only if registered, and get paid on time. A UK freelancer guide.",
  "publishedDate": "2026-11-23",
  "updatedDate": "2026-11-23",
  "readingTime": "11 min read",
  "author": "MakeInvo Team",
  "coverImage": "/blog/how-to-invoice-as-a-freelancer-uk/how-to-invoice-as-a-freelancer-uk-featured.webp",
  "coverImageAlt": "Freelancer preparing an invoice on a laptop at a home desk"
},
{
  "slug": "invoice-payment-terms-uk",
  "title": "Invoice Payment Terms Explained: Net 30, Due on Receipt and More (UK Guide)",
  "excerpt": "What invoice payment terms like Net 7, Net 30 and EOM mean, UK legal time limits, how to choose terms and how to word them on your invoice clearly.",
  "publishedDate": "2026-11-22",
  "updatedDate": "2026-11-22",
  "readingTime": "10 min read",
  "author": "MakeInvo Team",
  "coverImage": "/blog/invoice-payment-terms-uk/invoice-payment-terms-uk-featured.webp",
  "coverImageAlt": "Printed invoice with a payment terms line next to a calendar with a circled due date"
},
{
  "slug": "invoice-vs-receipt",
  "title": "Invoice vs Receipt: What Is the Difference? (A Plain-English UK Guide)",
  "excerpt": "An invoice asks for payment; a receipt confirms it. A plain-English UK guide to when you need each, what to include, paid invoices and record keeping.",
  "publishedDate": "2026-11-21",
  "updatedDate": "2026-11-21",
  "readingTime": "9 min read",
  "author": "MakeInvo Team",
  "coverImage": "/blog/invoice-vs-receipt/invoice-vs-receipt-featured.webp",
  "coverImageAlt": "Printed invoice and paper receipt side by side on a desk"
},
{
  "slug": "how-to-chase-a-late-invoice-uk",
  "title": "How to Chase a Late Invoice in the UK: A Calm Step-by-Step Guide",
  "excerpt": "A practical UK sequence for unpaid invoices: check the invoice, send reminders, and understand statutory late-payment interest, with links to official guidance.",
  "publishedDate": "2026-11-20",
  "updatedDate": "2026-11-20",
  "readingTime": "11 min read",
  "author": "MakeInvo Team",
  "coverImage": "/blog/how-to-chase-a-late-invoice-uk/chase-late-invoice-uk-featured.webp",
  "coverImageAlt": "Desk with an invoice, calendar and reminder checklist, titled How to Chase a Late Invoice in the UK"
},
{
  "slug": "what-to-include-on-a-uk-invoice",
  "title": "What Must a UK Invoice Include? A Plain-English Checklist (Including VAT)",
  "excerpt": "A plain-English checklist of what a UK invoice must include, including VAT invoices, sole trader and limited company rules, with a link to official GOV.UK guidance.",
  "publishedDate": "2026-11-20",
  "updatedDate": "2026-11-20",
  "readingTime": "10 min read",
  "author": "MakeInvo Team",
  "coverImage": "/blog/what-to-include-on-a-uk-invoice/what-to-include-on-a-uk-invoice-featured.webp",
  "coverImageAlt": "UK-style invoice and laptop on a desk with the title What Must a UK Invoice Include?"
},
  {
    slug: "how-to-make-an-invoice-online",
    title: "How to Make an Invoice Online: A Simple Step-by-Step Guide",
    excerpt:
      "Learn how to make an invoice online in 8 simple steps - from choosing a template to adding line items, calculating totals and sending a PDF invoice that gets you paid faster.",
    publishedDate: "2026-09-21",
    updatedDate: "2026-09-21",
    readingTime: "9 min read",
    author: "MakeInvo Team",
    coverImage: "/blog/how-to-make-an-invoice-online/how-to-make-an-invoice-online-guide.webp",
    coverImageAlt: "Freelancer creating an invoice online using the MakeInvo invoice generator on a laptop",
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug)
}

