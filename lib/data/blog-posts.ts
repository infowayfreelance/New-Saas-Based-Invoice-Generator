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

