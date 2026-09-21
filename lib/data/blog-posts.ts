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
