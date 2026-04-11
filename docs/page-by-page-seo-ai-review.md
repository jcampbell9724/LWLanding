# Page-by-Page SEO, AI Search, and Schema Review

Updated: 2026-04-11

## Sitewide changes

- Rewrote key titles, meta descriptions, H1s, and hero intros across the main commercial pages to make the page topic clearer in the first 100-200 words.
- Added explicit AI crawler allow rules for `GPTBot`, `PerplexityBot`, `ClaudeBot`, `anthropic-ai`, `Google-Extended`, `Applebot-Extended`, and `cohere-ai` in `robots.txt`.
- Added JSON-LD structured data across the main site:
  - `WebPage` on core marketing pages
  - `AboutPage` on `/about.html`
  - `ContactPage` on `/contact.html`
  - `CollectionPage` on `/customers.html` and `/resources.html`
  - `FAQPage` on pages with visible Q&A content
  - `Blog` on `/blog/`
  - `BlogPosting` plus `FAQPage` on each post
- Added direct-answer FAQ sections to the homepage, platform, integrations, and security pages to improve extractability for AI search systems.
- Updated the blog generator so posts render with a single H1, article metadata, article schema, and FAQ schema when a post includes a FAQ section.

## Page matrix

| Page | Primary intent | Changes made | Follow-up opportunity |
| --- | --- | --- | --- |
| `/` | Collections automation software | Reworked title, meta description, H1, hero intro, added FAQ section, `WebPage` schema, and `FAQPage` schema | Add a real product screenshot and proof metrics |
| `/platform.html` | Product detail | Reworked title, meta description, H1, hero intro, added FAQ section, `WebPage` schema, and `FAQPage` schema | Add real product imagery and stronger module proof |
| `/solutions.html` | Role and team fit | Reworked title, meta description, H1, hero intro, added `WebPage` schema | Add role-specific proof links or case studies |
| `/operations.html` | Weekly workflow and rollout | Reworked title, meta description, H1, hero intro, added `WebPage` schema and `FAQPage` schema | Add internal links from resources and blog posts into the workflow sections |
| `/integrations.html` | ERP and CRM fit | Reworked title, meta description, H1, hero intro, added FAQ section, `WebPage` schema, and `FAQPage` schema | Publish deeper system-specific notes once available |
| `/pricing.html` | Pricing and commercial scope | Reworked title, meta description, H1, hero intro, added `WebPage` schema and `FAQPage` schema | Add an example pricing framework or buyer planning range when ready |
| `/security.html` | Trust and diligence | Reworked title, meta description, H1, hero intro, added FAQ section, `WebPage` schema, and `FAQPage` schema | Add substantiated trust artifacts if available |
| `/demo.html` | Demo conversion | Reworked title, meta description, H1, hero intro, added `WebPage` schema and `FAQPage` schema | Add confirmation expectations or meeting outcomes near the form |
| `/resources.html` | Resource hub | Reworked title, meta description, H1, hero intro, added `CollectionPage` schema | Expand templates and owned tools over time |
| `/customers.html` | Buyer proof and fit | Reworked title, meta description, H1, hero intro, added `CollectionPage` schema | Publish named customer stories when public proof is ready |
| `/about.html` | Company credibility | Reworked title, meta description, H1, hero intro, added `AboutPage` schema | Add founder or company proof details if available |
| `/contact.html` | Contact and routing | Reworked title, meta description, H1, hero intro, added `ContactPage` schema | Add richer contact-point detail if phone or team routing becomes public |
| `/why-ledgewave.html` | Category point of view | Reworked title, meta description, H1, hero intro, added `WebPage` schema | Add a comparison table versus spreadsheet workflow |
| `/blog/` | Blog index | Reworked title, meta description, H1, intro copy, added `Blog` schema | Add author or category archive pages later |
| `/blog/*.html` | Long-tail educational intent | Updated summaries, added FAQ sections in source content, removed duplicate H1 output, added `BlogPosting` schema and `FAQPage` schema | Add original examples, data, or diagrams to strengthen citations |
| `/privacy.html` | Legal policy | Left content unchanged | Consider whether this should stay indexable |
| `/terms.html` | Legal policy | Left content unchanged | Consider whether this should stay indexable |
| `/terms-of-service.html` | Legal policy | Left content unchanged | Consider whether this should stay indexable |

## What improved for AI search

- More pages now answer the core query directly in the opening copy instead of relying on abstract positioning.
- FAQ sections are visible on-page and mirrored in `FAQPage` schema, which makes the content easier for answer engines to quote or summarize.
- Blog posts now contain extractable Q&A blocks and article metadata that help AI systems understand topic, freshness, and page type.

## Remaining gaps

- The site still relies heavily on placeholder imagery, which limits proof and citation quality.
- The blog is structurally stronger now, but it would benefit from more original examples, benchmarks, or proprietary data.
- Legal pages have no schema and were intentionally left unchanged because indexability there is a policy decision, not just an SEO decision.
