BROWSER RULE (Hamza): don't paste prompts/text/links by script (no JS injection, clipboard script or fill command); only paste or type like a human; leave a 30–60 second gap between actions; move the cursor along random human-like paths, not straight lines.

MODE: AUTOMATED (Hamza 12 Nov + 16 Nov: local build/test first, then PR base main, merge when green, deploy live, verify live). Automatic Vercel preview on a feature-branch PR is fine; do NOT change Vercel settings or promote a preview yourself. Merge and deploy live without waiting for Hamza.

Repo: infowayfreelance/New-Saas-Based-Invoice-Generator
Branch from main: onpage-simple-invoice-template
PR base: main

Page ONLY: https://makeinvo.com/invoice-templates/simple-invoice-template
Scope: copy, metadata, JSON-LD, internal links. No design change, no template-preview design change, no product behaviour change, no plan prices.

No invented stats/time-saved numbers/ratings, no "in minutes"/"in seconds", no legal-validity or compliance claims. UK spelling ("customise"). Tax and legal copy stays general with GOV.UK links; keep the existing disclaimer word for word. Check the code first (six layouts, per-line tax, due date / payment terms / bank details / note fields, invoice numbering, PDF download without an account) and only claim what it supports.
makeinvo.com 429s curl: verify in a headless browser.

Full Day-6 brief follows next. Implement every section: title (UK + Free PDF) and meta (165→149) + OG, copy clean-up, 4 new H2s (UK sole trader / limited company rules, with or without VAT, payment terms, templates by type of work), FAQ 5 → 9 with all answers in the DOM, WebApplication + FAQPage 9 (keep BreadcrumbList), internal links. Push, PR base=main, merge when green, deploy live.

Report back: live URL, PR number, merge SHA, the code-check result, and the brief's verify checklist.

========== FULL DAY-6 BRIEF ==========

BROWSER RULE (Hamza): don't paste prompts/text/links by script (no JS injection, clipboard script or fill command); only paste or type like a human; leave a 30–60 second gap between actions; move the cursor along random human-like paths, not straight lines.

# On-page brief: makeinvo.com/invoice-templates/simple-invoice-template (Day 6, 24 Nov 2026)

**For:** ChatGPT, in the makeinvo.com "Website work" chat. **MODE: AUTOMATED** (Hamza 12 Nov + 16 Nov): local build/test first, then PR base main, merge when green, deploy live, verify live yourself. An automatic Vercel preview on the feature-branch PR is fine; do NOT change Vercel settings. Merge and deploy live without waiting for Hamza. **Report back: live URL, PR number, merge SHA** and the verify checklist (section 8).
**Repo:** infowayfreelance/New-Saas-Based-Invoice-Generator · branch from main: `onpage-simple-invoice-template` · PR base: main.
**Scope:** copy, metadata, JSON-LD and internal links on this page only. **No design change, no template/preview design change, no product behaviour change, no plan prices anywhere.** White-hat only.
**Page:** https://makeinvo.com/invoice-templates/simple-invoice-template
**Status in queue:** row #6, not done (first on-page pass). **165-char meta** (over the snippet width), title "Simple Invoice Template \| Create & Customize Online \| MakeInvo" (62, US spelling, no "UK" or "free"), **no page-level schema** (only BreadcrumbList + FAQPage 5), **nothing UK-specific**: no VAT vs non-VAT guidance, no sole trader / limited company rules, no payment terms guidance, no GOV.UK source, although the main UK competitors all lead with that. Other copy points: "customize" (×3), "in minutes" (unsourced speed claim; Days 1–5 removed similar wording), sample invoice dates in US format ("January 6, 2025"), and **only 1 internal link points to this page** (from /invoice-templates).

## Brand / product rules (MakeInvo, SaaS)
- SaaS template page: help UK freelancers and small businesses choose and fill in a simple invoice, then send them to the existing "Use Simple Invoice Template" / "Use Template" buttons. Brand **"MakeInvo"**. UK spelling; £ only for GBP.
- **No invented stats, time-saved numbers, user counts, ratings, testimonials or plan prices.** No "in seconds", "in minutes", "instantly", "100%".
- Tax and legal copy stays general, quotes GOV.UK and links to it; keep the existing disclaimer "Exact invoice requirements can vary by country, business type and tax status. MakeInvo provides invoice-creation software, not legal, tax or accounting advice." **word for word**.
- **Check the code before writing** and drop or reword any sentence it doesn't support (say so in the report): the six layouts (Simple Classic, Modern, Minimal, Business, Clean, Professional); that choosing a template opens the generator without resetting entered data (already stated on the page); **per-line tax**; whether the generator has fields for **due date, payment terms, bank/payment details and a free-text note** (used in section 3); whether invoice numbers are suggested/auto-incremented; and **whether a PDF can be downloaded without an account**.
- makeinvo.com returns **429 to curl**: verify in a headless browser.

## Why this page (GSC first)
- GSC (16 Nov export, Web, 3 months 15 Aug–14 Nov 2026, `/workspace/gsc-onpage-2026-11-16/makeinvo.com/Pages.csv`): **this URL has no row (0 clicks, 0 impressions).** Nothing to protect: title, meta and copy can change; the URL and H1 stay. It's the next "not done" page after /features (Day 5).
- Related site queries (Queries.csv; query→page mapping inferred, all ranking ~89–100): "create an invoice template" 21 impr pos 91.4 · "create invoice template" 18 pos 88.9 · "invoice template maker" 17 pos 95.6 · "invoice template generator" 12 pos 96.2 · "simple invoice generator" 8 pos 91.4 · "simple online invoice generator" 7 pos 93.6. UK competitors target **"simple invoice template UK"** and **"free invoice template UK"**, so the title adds "UK" and "Free PDF".
- Live page (24 Nov headless fetch): 1,147 words (incl. 6 sample previews), H1 "Simple Invoice Template", 6 H2s (What Is…, What Should a Simple Invoice Include?, How to Use…, Who Is… Best For?, Why Choose a Simple Invoice Layout?, FAQ) + CTA, BreadcrumbList + FAQPage (5), canonical self-referencing, 27 internal links (nav/footer). Extract: `/workspace/onpage-daily/2026-11-24/competitors/_own-pages/makeinvo_com_invoice_templates_simple_invoice_template.txt`.

## Competitors checked (web search "simple invoice template UK free" and "\"simple invoice template\" UK", UK, 24 Nov 2026)
| Competitor | Title (chars) | Words | Schema | What they have that we don't |
|---|---|---|---|---|
| [PoundKit – Simple UK Invoice Template (No VAT)](https://poundkit.co.uk/templates/simple-invoice-template/) | Simple UK Invoice Template (No VAT) — Free Download \| PoundKit (62) | 394 | WebApplication, FAQPage (5) | **"UK" and "No VAT" in title/H1**; "Not VAT registered — no VAT charged" line on the sample; FAQs "Can I use this if I'm VAT registered?", "Do I need payment terms?"; sole-trader angle (their "legally valid" claim is theirs) |
| [Xero UK – Free Invoice Template](https://www.xero.com/uk/templates/invoice-template/) | Free Invoice Template UK – Download a PDF Invoice \| Xero UK (59) | 2,160 | none | **"What must a UK invoice include?"**, **"Extra details for sole traders and companies"**, **"VAT invoice or non-VAT invoice?"**, **"UK invoice payment times"**, "Get paid on time…", templates by trade |
| [Solodesks – Free UK Invoice Template](https://solodesks.com/templates/invoice-template) | Free Invoice Template UK: Word, Excel, PDF & Google Docs (56) | 2,242 | SoftwareApplication, CreativeWork, FAQPage (9), BreadcrumbList | Completed sole-trader example, "How to fill in your invoice", **"What invoice number should I start at?"**, "Do I need to be VAT registered…", **"Sources and further detail"** (GOV.UK) |
| [BroadPaper – Free invoice template (UK, VAT-ready)](https://www.broadpaper.com/templates/invoice/) | Free invoice template and generator (UK, VAT-ready) · BroadPaper (64) | 599 | SoftwareApplication, FAQPage (4), BreadcrumbList | **"What every UK invoice must show"** and **"What a VAT invoice must add"**; FAQ "Does it work if I am not VAT registered?" |
Not readable today: labourless.co.uk simple invoice template (no response to curl). Extracts: `/workspace/onpage-daily/2026-11-24/competitors/makeinvo/`. (Competitor claims are theirs; **don't copy them**.)

**Gap summary:** every UK competitor answers the three questions a UK freelancer has before sending a simple invoice: **what must it show (GOV.UK list, sole trader vs limited company), do I add VAT, and what payment terms can I use**, and three of four cite or follow GOV.UK. Our page is a generic "simple layout" page with no UK detail, no source, no page-level schema, US spelling and a long meta. Fix: UK title/meta, 3 UK sections with GOV.UK links, a "by trade" link block, FAQ 5 → 9, WebApplication + updated FAQPage.

## 1. Title, meta, H1
| Element | Current | New |
|---|---|---|
| Title | Simple Invoice Template \| Create & Customize Online \| MakeInvo (62) | **Simple Invoice Template UK: Free PDF Invoice \| MakeInvo** (55) |
| Meta | Use a simple invoice template to create clear, professional invoices online. Add your business, client and payment details, then customize and download your invoice. (165) | **Free simple invoice template for UK freelancers and sole traders. Pick a clean layout, add your details (and VAT if registered), then download a PDF.** (149) |
| H1 | Simple Invoice Template | No change |
| Sub-line | Create a clear, professional invoice with a simple invoice template. Add your business, client and payment details, then customize and download your invoice with MakeInvo. | **Create a clear, professional invoice with a simple invoice template. Add your business, client and payment details, then customise and download your invoice as a PDF with MakeInvo.** |
Update og:title / og:description / twitter tags to match. Canonical is already self-referencing; keep it. "Free" is already on the page ("All templates are free to use").

## 2. Edit existing copy (text only, same components)
- "customize" → **"customise"** everywhere in this page's copy (hero sub-line, FAQ "Can I customize…" → "Can I customise…").
- Final CTA "Add your details and download a clear, professional PDF invoice in minutes." → **"Add your details and download a clear, professional PDF invoice."**
- "Why Choose a Simple Invoice Layout?" → "Faster to complete" card: keep (no number).
- Sample previews: if the date strings "January 6, 2025" / "January 20, 2025" are **static sample text in this page's code**, change them to **"6 January 2025" / "20 January 2025"** (UK format). If they come from the shared template renderer or the generator's date logic, leave them and say so (no product behaviour change).
- In "What Should a Simple Invoice Include?", after "Total amount due", add one list item **"Supply date (the date the work or goods were provided), if it's different from the invoice date"** (GOV.UK lists it; see section 3). Keep the disclaimer under the list word for word.

## 3. New sections (existing section components; insert in this order after "What Should a Simple Invoice Include?" and before "How to Use a Simple Invoice Template")

**H2: Simple Invoices in the UK: Sole Traders and Limited Companies**
GOV.UK lists what an invoice [must include](https://www.gov.uk/invoicing-and-taking-payment-from-customers/invoices-what-they-must-include): a unique invoice number, your business name, address and contact details, your customer's name and address, a clear description of what you're charging for, the supply date, the invoice date, the amounts charged, VAT if applicable, and the total owed. A simple template covers all of these. Two extra rules depend on how you trade:
- **Sole traders** must also show their own name and any business name they use and, if trading under a business name, an address where legal documents can be delivered.
- **Limited companies** must show the full company name as it appears on the certificate of incorporation. If you list directors' names on your invoices, you must list all of them.

**H2: A Simple Invoice With or Without VAT**
- **Not VAT-registered?** Don't add VAT. Leave the tax rate at zero so no VAT amount appears. Some businesses add a short note such as "Not VAT registered" to avoid questions, but it isn't required.
- **VAT-registered?** You must [charge VAT](https://www.gov.uk/charge-reclaim-record-vat) on taxable sales, and your invoices must show your VAT number and the VAT separately. MakeInvo lets you add a tax rate to each line, so standard-rated and other items can sit on the same invoice. Check the current rates on GOV.UK before you invoice.
- **Not sure whether you need to register?** GOV.UK explains [when you must register for VAT](https://www.gov.uk/register-for-vat).

**H2: Payment Terms on a Simple Invoice**
You can [set your own payment terms](https://www.gov.uk/invoicing-and-taking-payment-from-customers/payment-obligations), such as 14 or 30 days, or payment upfront. If you haven't agreed a date, the customer must pay within 30 days of getting your invoice or the goods or service. Put the due date and how to pay (for example your bank details) on the invoice so the client doesn't have to ask. If a business customer pays late, you have the right to [charge interest on late commercial payments](https://www.gov.uk/late-commercial-payments-interest-debt-recovery), though you can choose not to.
*(Mention bank/payment details and a note field only if the code check confirms the generator has them; otherwise say "in the payment terms".)*

**H2: Simple Invoice Templates by Type of Work** (insert after "Who Is a Simple Invoice Template Best For?" and before "Why Choose a Simple Invoice Layout?"; cards or a link list using the existing card component)
The simple layout suits most service work. If your invoices need trade-specific lines, such as hours and day rates, materials, or retainers, start from a generator built for your work:
[Freelancers](/invoice-generator-for-freelancers) · [Self-employed](/invoice-generator-for-self-employed) · [Contractors](/invoice-generator-for-contractors) · [Consultants](/invoice-generator-for-consultants) · [Tradespeople](/invoice-generator-for-tradespeople) · [Small businesses](/invoice-generator-for-small-businesses). Prefer a different look? Browse all [invoice templates](/invoice-templates), or read our step-by-step guide on [how to make an invoice online](/blog/how-to-make-an-invoice-online).

## 4. FAQs (exact text; keep the existing accordion, **all 9 answers in the DOM before any click**; panels may start collapsed). The first 5 are the current Q&As with "customize" → "customise" (answers unchanged); Q6–Q9 are new. Q5 and Q6 must match the code check; reword if the code says otherwise and keep the JSON-LD identical
1. **What is a simple invoice template?** A simple invoice template is a clean, no-frills invoice layout that includes only the essential billing fields - business and client details, line items, and the total due.
2. **Can I customise a simple invoice template?** Yes. You can add your own business details, client information, line items, tax and payment terms before creating your invoice with MakeInvo.
3. **Is a simple invoice suitable for freelancers?** Yes. A simple invoice works well for freelancers, contractors and self-employed workers who want a quick, professional invoice without extra detail.
4. **What details should I include on the invoice?** At minimum: your business and client details, an invoice number, dates, a description of the work, quantities or hours, rates, subtotal, tax where applicable, and the total due. Requirements can vary by country and business type.
5. **Can I download my completed invoice as PDF?** Yes. Once you've filled in your details, you can create the invoice and download it as a PDF directly from MakeInvo.
6. **Do I need to add VAT to a simple invoice?** Only if you're VAT-registered. If you aren't, leave the tax at zero and don't show a VAT amount. If you are, you must charge VAT on taxable sales and show your VAT number and the VAT separately on the invoice; GOV.UK explains what a VAT invoice needs.
7. **Can I use a simple invoice template as a sole trader?** Yes. GOV.UK says a sole trader's invoice must also show your name and any business name you use, and, if you trade under a business name, an address where legal documents can be delivered to you. Add these in the business details section.
8. **What invoice number should I use?** Each invoice needs a unique identification number. Many businesses simply number invoices in order, for example INV-001, INV-002, so that no number is used twice and gaps are easy to spot.
9. **What payment terms should I put on a simple invoice?** You can set your own terms, such as 14 or 30 days. If you haven't agreed a payment date, GOV.UK says the customer must pay within 30 days of receiving your invoice or the goods or service. Showing the due date and how to pay helps you get paid on time.

In Q6 link "what a VAT invoice needs" → https://www.gov.uk/charge-reclaim-record-vat; in Q9 link "GOV.UK" → https://www.gov.uk/invoicing-and-taking-payment-from-customers/payment-obligations.

**FAQ markup pattern (answers present in the rendered DOM; reuse the existing accordion component and classes, this only shows the required structure):**
```html
<section id="faq">
  <details>
    <summary><h3>What is a simple invoice template?</h3></summary>
    <p>A simple invoice template is a clean, no-frills invoice layout that includes only the essential billing fields - business and client details, line items, and the total due.</p>
  </details>
  <details>
    <summary><h3>Can I customise a simple invoice template?</h3></summary>
    <p>Yes. You can add your own business details, client information, line items, tax and payment terms before creating your invoice with MakeInvo.</p>
  </details>
  <details>
    <summary><h3>Is a simple invoice suitable for freelancers?</h3></summary>
    <p>Yes. A simple invoice works well for freelancers, contractors and self-employed workers who want a quick, professional invoice without extra detail.</p>
  </details>
  <details>
    <summary><h3>What details should I include on the invoice?</h3></summary>
    <p>At minimum: your business and client details, an invoice number, dates, a description of the work, quantities or hours, rates, subtotal, tax where applicable, and the total due. Requirements can vary by country and business type.</p>
  </details>
  <details>
    <summary><h3>Can I download my completed invoice as PDF?</h3></summary>
    <p>Yes. Once you&#x27;ve filled in your details, you can create the invoice and download it as a PDF directly from MakeInvo.</p>
  </details>
  <details>
    <summary><h3>Do I need to add VAT to a simple invoice?</h3></summary>
    <p>Only if you&#x27;re VAT-registered. If you aren&#x27;t, leave the tax at zero and don&#x27;t show a VAT amount. If you are, you must charge VAT on taxable sales and show your VAT number and the VAT separately on the invoice; GOV.UK explains what a VAT invoice needs.</p>
  </details>
  <details>
    <summary><h3>Can I use a simple invoice template as a sole trader?</h3></summary>
    <p>Yes. GOV.UK says a sole trader&#x27;s invoice must also show your name and any business name you use, and, if you trade under a business name, an address where legal documents can be delivered to you. Add these in the business details section.</p>
  </details>
  <details>
    <summary><h3>What invoice number should I use?</h3></summary>
    <p>Each invoice needs a unique identification number. Many businesses simply number invoices in order, for example INV-001, INV-002, so that no number is used twice and gaps are easy to spot.</p>
  </details>
  <details>
    <summary><h3>What payment terms should I put on a simple invoice?</h3></summary>
    <p>You can set your own terms, such as 14 or 30 days. If you haven&#x27;t agreed a payment date, GOV.UK says the customer must pay within 30 days of receiving your invoice or the goods or service. Showing the due date and how to pay helps you get paid on time.</p>
  </details>
</section>
```

## 5. Schema (JSON-LD), this page only
**WebApplication** (new; free to use, **no plan prices**; keep `featureList` only for what the code check confirms):
```json
{
 "@context": "https://schema.org",
 "@type": "WebApplication",
 "@id": "https://makeinvo.com/invoice-templates/simple-invoice-template#app",
 "name": "MakeInvo Simple Invoice Template",
 "url": "https://makeinvo.com/invoice-templates/simple-invoice-template",
 "description": "Free simple invoice template for UK freelancers and sole traders. Pick a clean layout, add your details (and VAT if registered), then download a PDF.",
 "applicationCategory": "BusinessApplication",
 "operatingSystem": "Web",
 "isAccessibleForFree": true,
 "featureList": [
  "Six simple invoice layouts: Classic, Modern, Minimal, Business, Clean and Professional",
  "Business, client and line-item details",
  "Tax per line where applicable",
  "Automatic subtotal, tax and total",
  "Payment terms",
  "PDF download"
 ],
 "offers": {
  "@type": "Offer",
  "price": "0",
  "priceCurrency": "GBP"
 },
 "provider": {
  "@id": "https://makeinvo.com/#organization"
 }
}
```

**FAQPage**: replace the 5-question block with all 9 visible Q&As exactly as shown:
```json
{
 "@context": "https://schema.org",
 "@type": "FAQPage",
 "@id": "https://makeinvo.com/invoice-templates/simple-invoice-template#faq",
 "mainEntity": [
  {
   "@type": "Question",
   "name": "What is a simple invoice template?",
   "acceptedAnswer": {
    "@type": "Answer",
    "text": "A simple invoice template is a clean, no-frills invoice layout that includes only the essential billing fields - business and client details, line items, and the total due."
   }
  },
  {
   "@type": "Question",
   "name": "Can I customise a simple invoice template?",
   "acceptedAnswer": {
    "@type": "Answer",
    "text": "Yes. You can add your own business details, client information, line items, tax and payment terms before creating your invoice with MakeInvo."
   }
  },
  {
   "@type": "Question",
   "name": "Is a simple invoice suitable for freelancers?",
   "acceptedAnswer": {
    "@type": "Answer",
    "text": "Yes. A simple invoice works well for freelancers, contractors and self-employed workers who want a quick, professional invoice without extra detail."
   }
  },
  {
   "@type": "Question",
   "name": "What details should I include on the invoice?",
   "acceptedAnswer": {
    "@type": "Answer",
    "text": "At minimum: your business and client details, an invoice number, dates, a description of the work, quantities or hours, rates, subtotal, tax where applicable, and the total due. Requirements can vary by country and business type."
   }
  },
  {
   "@type": "Question",
   "name": "Can I download my completed invoice as PDF?",
   "acceptedAnswer": {
    "@type": "Answer",
    "text": "Yes. Once you've filled in your details, you can create the invoice and download it as a PDF directly from MakeInvo."
   }
  },
  {
   "@type": "Question",
   "name": "Do I need to add VAT to a simple invoice?",
   "acceptedAnswer": {
    "@type": "Answer",
    "text": "Only if you're VAT-registered. If you aren't, leave the tax at zero and don't show a VAT amount. If you are, you must charge VAT on taxable sales and show your VAT number and the VAT separately on the invoice; GOV.UK explains what a VAT invoice needs."
   }
  },
  {
   "@type": "Question",
   "name": "Can I use a simple invoice template as a sole trader?",
   "acceptedAnswer": {
    "@type": "Answer",
    "text": "Yes. GOV.UK says a sole trader's invoice must also show your name and any business name you use, and, if you trade under a business name, an address where legal documents can be delivered to you. Add these in the business details section."
   }
  },
  {
   "@type": "Question",
   "name": "What invoice number should I use?",
   "acceptedAnswer": {
    "@type": "Answer",
    "text": "Each invoice needs a unique identification number. Many businesses simply number invoices in order, for example INV-001, INV-002, so that no number is used twice and gaps are easy to spot."
   }
  },
  {
   "@type": "Question",
   "name": "What payment terms should I put on a simple invoice?",
   "acceptedAnswer": {
    "@type": "Answer",
    "text": "You can set your own terms, such as 14 or 30 days. If you haven't agreed a payment date, GOV.UK says the customer must pay within 30 days of receiving your invoice or the goods or service. Showing the due date and how to pay helps you get paid on time."
   }
  }
 ]
}
```

**BreadcrumbList**: keep the existing one (Home › Invoice Templates › Simple Invoice Template). No AggregateRating, no Review markup.

## 6. Internal links (body copy)
- Section 3 "by type of work": /invoice-generator-for-freelancers, /invoice-generator-for-self-employed, /invoice-generator-for-contractors, /invoice-generator-for-consultants, /invoice-generator-for-tradespeople, /invoice-generator-for-small-businesses, /invoice-templates, /blog/how-to-make-an-invoice-online. All are in the live sitemap/queue (the blog post is a recent sister post: link to it, don't edit it).
- External GOV.UK sources: [what an invoice must include](https://www.gov.uk/invoicing-and-taking-payment-from-customers/invoices-what-they-must-include), [payment obligations](https://www.gov.uk/invoicing-and-taking-payment-from-customers/payment-obligations), [charging VAT](https://www.gov.uk/charge-reclaim-record-vat), [register for VAT](https://www.gov.uk/register-for-vat), [late commercial payments](https://www.gov.uk/late-commercial-payments-interest-debt-recovery). All returned 200 on 24 Nov. (The sitewide nav/footer links stay as they are.)
- Inbound links: only /invoice-templates links to this page today. **Don't edit /invoice-templates or any other page in this PR**; just note it in the report so it can be queued later.

## 7. Do NOT touch
- Layout, design, nav, footer, cookie banner, the six template previews' design, the buttons and their targets, plan prices, the product itself.
- The disclaimer sentence under "What Should a Simple Invoice Include?" (word for word).
- No new stats, speed claims ("seconds", "minutes", "instantly"), user counts, ratings, testimonials, legal-validity or compliance claims ("HMRC-approved", "legally valid") or prices.
- Don't change /features (Day 5), /invoice-generator-for-photographers (Day 4), -tradespeople (Day 3), -consultants (Day 2), -freelancers (Day 1), /invoice-templates, /blog/how-to-make-an-invoice-online, /terms, /privacy or any other page.
- URL stays `/invoice-templates/simple-invoice-template`. H1 unchanged.

## 8. Verify after deploy (report back)
1. Live URL 200 (verify in a headless browser; curl gets 429) with a self-referencing canonical. Report the **live URL, PR number and merge SHA**, and the code-check result from the brand rules.
2. Rendered `<title>`, meta and og tags match section 1; H1 unchanged and the only H1.
3. "customize" and "in minutes" no longer appear in the page copy; the disclaimer sentence is unchanged.
4. The 4 new H2s are visible in the stated positions; all 9 FAQ answers are in the DOM before any click.
5. Rich Results Test: WebApplication (price 0 GBP), FAQPage (9) and BreadcrumbList valid.
6. The 5 GOV.UK links and the 8 new internal links return 200; "Use Simple Invoice Template" still opens the generator with the simple design applied.
