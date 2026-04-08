# Manual Update Checklist

This file lists everything in `btlanding` that should be manually reviewed or replaced before treating the site as a real production marketing website.

## 1. Launch blockers

- Confirm the form backend and lead-routing flow.
  Files: `demo.html`, `resources.html`, `contact.html`, `assets/js/script.js`
  The site is currently wired to a Google Apps Script endpoint. Replace or finalize that flow with your real CRM, scheduler, email automation, webhook, or form backend as needed.

- Remove all `prototype` messaging.
  Files: `index.html`, `platform.html`, `solutions.html`, `operations.html`, `resources.html`, `why-ledgewave.html`, `demo.html`, `assets/js/script.js`
  The site currently says things like `Prototype marketing site`, `ready for live form and CRM wiring`, and form success messages that explicitly mention a prototype.

- Replace or remove the internal strategy helper blocks.
  Files: `index.html`, `platform.html`, `solutions.html`, `operations.html`, `resources.html`, `why-ledgewave.html`
  There are several read-only panels with labels like `Recommended CTA`, `Best next page`, `Recommended journey`, and similar planning notes. These are useful for internal review, but they should not stay on a live site.

- Add real contact and company details.
  Files: site-wide footer, `contact.html`, and demo flow
  A contact page now exists, but the public email addresses, company address, phone number, founder/team details, and legal entity details are still placeholders or missing.

- Finalize legal pages and link policy details cleanly.
  Missing files/pages: `cookie policy`
  Privacy, website terms, and SaaS terms now exist in the site build, but they still contain placeholder legal and commercial details that should be finalized before launch.

## 2. Brand and positioning decisions

- Confirm the final product name.
  Files: all HTML pages, `assets/images/ledgewave-mark.svg`
  The site is built around `Ledgewave`. If the name changes, update every page title, meta description, hero, footer, CTA, and asset label.

- Confirm the final tagline.
  Files: all HTML pages
  The current core label is `Receivables OS`. Keep it if that is the actual market position; otherwise replace it everywhere consistently.

- Review all claims for accuracy.
  Files: all HTML pages
  The copy is based on the actual `Blank_Test` app structure, but you should still verify that every claim is something you want to promise publicly.

- Decide which audience to lead with.
  Files: `index.html`, `solutions.html`
  The site currently speaks to collections leads, controllers, AR managers, shared services, and finance operations. You may want to tighten that to one or two primary buyer groups.

## 3. Product content to replace or expand

- Add real screenshots or UI mockups.
  Files: mostly `index.html`, `platform.html`
  The current site is text-led. There are no actual product screenshots, dashboard captures, forecast visuals, or workflow images yet.

- Add real customer proof.
  Files: `index.html`, `resources.html`, `why-ledgewave.html`
  There are no testimonials, case studies, customer logos, metrics, implementation stories, or proof points yet.

- Replace placeholder resource titles if you do not actually offer them.
  File: `resources.html`
  The guides and templates are framed as content themes, not real downloadable assets with landing flows.

- Decide whether to keep the detailed operations page public.
  File: `operations.html`
  It is useful for technical buyers, but you may prefer to move some of that material into a deck, PDF, or private sales follow-up.

- Review the buyer-fit and point-of-view pages for tone.
  Files: `solutions.html`, `why-ledgewave.html`
  These pages are intentionally opinionated. Tighten them if you want a more conservative or more enterprise tone.

## 4. Form and conversion updates

- Replace sample form placeholder values.
  Files: `demo.html`, `resources.html`, `contact.html`
  Examples like `Jordan Lee`, `Alex Rivera`, `Northstar Logistics`, and `NetSuite + spreadsheets` should be updated if you want different examples or more neutral placeholders.

- Decide what happens after submit.
  Files: `demo.html`, `resources.html`, `assets/js/script.js`
  Right now the user gets an on-page success message only. You likely want:
  - redirect to a thank-you page
  - calendar booking link
  - automated confirmation email
  - CRM owner assignment
  - UTM capture and attribution

- Add spam protection.
  Files: form backend, not yet implemented
  Add CAPTCHA, honeypot, rate limiting, or provider-level protection before going live.

- Add real conversion tracking.
  Files: site-wide, especially form submission path
  Track CTA clicks, form starts, form completions, and demo conversions in analytics/ad platforms.

## 5. Navigation and page structure

- Decide whether `demo.html` should be in the top nav.
  Files: all HTML page headers
  Right now the top nav links to six sections and the main CTA points to the demo page, but the demo page is not listed as a standard nav item.

- Decide whether you want additional pages.
  Potential additions:
  - Thank You page after form submit

- Add 404 and fallback pages if this is going to production.
  Missing page: `404.html`

## 6. SEO and metadata

- Review canonical URLs.
  Files: all HTML pages
  Canonical links now point to `https://ledgewave.com`, but they should be revisited if page paths, routing, or indexing strategy change.

- Review Open Graph and social share metadata.
  Files: all HTML pages, `assets/images/ledgewave-social-card.svg`
  Open Graph and Twitter metadata now exist site-wide using a shared social preview image, but you may still want page-specific images or richer article metadata later.

- Create a real social preview image.
  Missing asset: branded social share image

- Review sitemap and robots coverage.
  Files: `sitemap.xml`, `robots.txt`
  Both files now exist, but they should be revisited once canonical URLs, indexing decisions, and any future route changes are finalized.

- Decide whether to keep all copy indexed.
  Files: especially `operations.html`
  Some technical or internal-process-heavy pages may or may not be appropriate for search indexing.

## 7. Brand assets and design polish

- Replace the temporary single SVG mark with a full brand asset pack if available.
  Files: `assets/images/ledgewave-mark.svg`, all pages using it
  You may want:
  - full wordmark
  - dark/light variants
  - favicon set
  - app icons
  - social card image

- Add a full favicon set if you care about production polish.
  Missing assets:
  - `favicon.ico`
  - Apple touch icon
  - PNG favicon sizes
  - site manifest

- Decide whether to keep Google Fonts hosted externally.
  Files: all HTML pages
  Fonts currently load from Google. If you want fewer external dependencies or stricter privacy posture, self-host them.

- Review mobile and desktop visually in a browser.
  Files: all pages
  I validated markup and local file references, but visual QA still needs to happen in a real browser across breakpoints.

## 8. Content consistency cleanup

- Remove internal wording like `Best next page`, `Recommended CTA`, and `Recommended journey`.
  Files:
  - `index.html`
  - `platform.html`
  - `solutions.html`
  - `operations.html`
  - `resources.html`
  - `why-ledgewave.html`

- Remove references to the site being a `static multi-page build`.
  Files: footers site-wide

- Make CTA language consistent.
  Files: all pages
  Most CTAs say `Request a Demo`, but some sections imply walkthroughs, guides, or internal routing advice. Standardize the CTA language based on your real funnel.

- Review whether `Why Ledgewave` should remain the page name.
  Files: nav, `why-ledgewave.html`
  Alternatives might be `Why Us`, `Why It Matters`, `Our Point of View`, or `Modern Collections`.

## 9. Technical deployment tasks

- Decide how the site will be hosted.
  The current build is plain static HTML/CSS/JS and can be hosted almost anywhere, but you still need to choose:
  - web server / static host
  - domain
  - HTTPS
  - redirects
  - CDN if needed

- Add analytics and tag management.
  Missing scripts:
  - Google Analytics / GA4
  - Google Tag Manager
  - Meta Pixel
  - LinkedIn Insight Tag
  - any CRM form tracking

- Connect forms to real endpoints.
  Files: `assets/js/script.js`, `demo.html`, `resources.html`

- Decide whether to keep relative paths.
  Files: all HTML pages
  Relative links are fine for static hosting, but if you move into a framework or nested routes, you may want route handling changes.

- Add minification/build tooling if you want production optimization.
  Current state:
  - raw HTML
  - raw CSS
  - raw JS
  This is fine for now, but production teams often add bundling, minification, and cache-busting.

## 10. Specific text strings worth searching for

Search these strings in `btlanding` before launch:

- `Prototype marketing site`
- `ready for live form and CRM wiring`
- `captured in this prototype`
- `Recommended CTA`
- `Best next page`
- `Recommended journey`
- `readonly`
- `static multi-page build`

## 11. Suggested order of manual work

1. Confirm brand name, tagline, and target buyer.
2. Remove internal/prototype copy.
3. Wire forms and add legal pages.
4. Add real screenshots, proof, and contact details.
5. Add analytics, SEO, and social metadata.
6. Do full browser QA on desktop and mobile.
7. Deploy to the real domain and test live submissions.
