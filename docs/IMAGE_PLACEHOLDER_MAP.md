# Image Placeholder Map

Use this as the asset drop checklist for the site.

Export to the exact sizes below. The placeholder loader now uses the file directly, so matching the target dimensions matters.

## Photoshop Setup

- Work on a crop artboard at `2x` the final export size, then export down to the exact final size listed in the tables.
- The site frame ratios are fixed:
  `1600 x 1000` for hero screenshots,
  `1600 x 900` for wide screenshots and blog covers,
  `1600 x 1200` for resource covers,
  `2000 x 400` for logo strips.
- Keep the important UI, labels, and any editorial text inside the center `80%` of the frame because the loaded image uses center-cover cropping.
- Export product screenshots in `sRGB` as `PNG-24`. Keep logos, editorial covers, and other generated support graphics as `SVG`.

Every gathered image in this map should be saved into:

- `assets/images/`

Use the exact filenames below. The HTML placeholders already point at those paths, so once the file exists you can swap the placeholder block for a real image without renaming anything.

You can still search the codebase for a `data-placeholder-id` when you want to replace a specific placeholder quickly.

## Core Product Screens

| Asset ID | Save gathered file as | Put it here | Required size | Main placeholder IDs | Used on pages | What to capture |
|---|---|---|---|---|---|---|
| A01 | `product-command-center.png` | `assets/images/product-command-center.png` | `1600 x 1000 PNG` | `home-hero-command-center`, `platform-hero-command-center`, `why-hero-command-center` | Homepage, Platform, Why Ledgewave | One polished all-in-one dashboard showing portfolio health, queue coverage, and cash visibility in the same frame |
| A02 | `product-collector-queue.png` | `assets/images/product-collector-queue.png` | `1600 x 900 PNG` | `home-why-teams-buy-queue`, `platform-portfolio-queue` | Homepage, Platform | Prioritized work queue with aging pressure, owner, status, and next action |
| A03 | `product-account-detail-timeline.png` | `assets/images/product-account-detail-timeline.png` | `1600 x 1000 PNG` | `home-why-teams-buy-history`, `platform-team-consistency-history`, `demo-hero-account-history` | Homepage, Platform, Demo | Invoice detail with notes, promise dates, sent outreach, follow-up history, and next-step context. Keep the key detail centered so the wide placements can crop cleanly. |
| A04 | `product-dunning-workflow.png` | `assets/images/product-dunning-workflow.png` | `1600 x 900 PNG` | `platform-outreach-dunning` | Platform | Draft follow-up or stage-based workflow with communication review visible |
| A05 | `product-forecast-intelligence.png` | `assets/images/product-forecast-intelligence.png` | `1600 x 900 PNG` | `home-why-teams-buy-forecast`, `platform-forecast` | Homepage, Platform | Forecast timing, confidence, buckets, and planned billing impact |
| A06 | `product-import-validation.svg` | `assets/images/product-import-validation.svg` | `1600 x 900 SVG` | `platform-import-validation` | Platform | File validation, mapping, flagged rows, dry-run review, or readiness exceptions. Use this as rollout proof, not as the main hero visual. |

## Logos And Brand Support

| Asset ID | Save gathered file as | Put it here | Required size | Main placeholder IDs | Used on pages | What to gather |
|---|---|---|---|---|---|---|
| A08 | `logos-integrations.svg` | `assets/images/logos-integrations.svg` | `2000 x 400 SVG` | `home-enterprise-fit-logos`, `demo-request-form-logos`, `integrations-supported-environments-logos` | Homepage, Demo, Integrations | Simple onboarding-path visual or approved system logos that reflect the real file-based and scoped ingest paths you support |

## Resource Guide Covers

| Asset ID | Save gathered file as | Put it here | Required size | Placeholder IDs | Used on pages | What to gather |
|---|---|---|---|---|---|---|
| A11-1 | `resource-guide-exit-plan.svg` | `assets/images/resource-guide-exit-plan.svg` | `1600 x 1200 SVG` | `resources-guide-exit-plan` | Resources | Branded cover for the spreadsheet-exit guide |
| A11-2 | `resource-guide-planned-billing.svg` | `assets/images/resource-guide-planned-billing.svg` | `1600 x 1200 SVG` | `resources-guide-planned-billing` | Resources | Branded cover for the planned billing guide |
| A11-3 | `resource-guide-payment-behavior.svg` | `assets/images/resource-guide-payment-behavior.svg` | `1600 x 1200 SVG` | `resources-guide-payment-behavior` | Resources | Branded cover for the payment behavior guide |
| A11-4 | `resource-guide-follow-up-history.svg` | `assets/images/resource-guide-follow-up-history.svg` | `1600 x 1200 SVG` | `resources-guide-follow-up-history` | Resources | Branded cover for the follow-up history guide |

## Blog Covers

| Asset ID | Save gathered file as | Put it here | Required size | Main placeholder IDs | Used on pages | What to gather |
|---|---|---|---|---|---|---|
| A12-1 | `blog-cover-spreadsheet-exit.svg` | `assets/images/blog-cover-spreadsheet-exit.svg` | `1600 x 900 SVG` | `blog-featured-cover`, `blog-card-2026-03-30-5-signs-your-collections-workflow-has-outgrown-spreadsheets`, `blog-post-hero-2026-03-30-5-signs-your-collections-workflow-has-outgrown-spreadsheets` | Blog index, article page | Split-view graphic or product-led comparison between spreadsheet-heavy work and a cleaner operating workflow |
| A12-2 | `blog-cover-planned-billing.svg` | `assets/images/blog-cover-planned-billing.svg` | `1600 x 900 SVG` | `blog-card-2026-03-30-why-planned-billing-belongs-in-the-collections-forecast`, `blog-post-hero-2026-03-30-why-planned-billing-belongs-in-the-collections-forecast`, `resources-blog-planned-billing` | Blog index, article page, Resources | Forecast screen with planned billing visible |
| A12-3 | `blog-cover-payment-behavior.svg` | `assets/images/blog-cover-payment-behavior.svg` | `1600 x 900 SVG` | `blog-card-2026-04-01-what-payment-behavior-reveals-about-collections-risk`, `blog-post-hero-2026-04-01-what-payment-behavior-reveals-about-collections-risk`, `resources-blog-payment-behavior` | Blog index, article page, Resources | Analytics or payment-pattern image |
| A12-4 | `blog-cover-dunning-workflow.svg` | `assets/images/blog-cover-dunning-workflow.svg` | `1600 x 900 SVG` | `blog-card-how-teams-move-from-spreadsheet-follow-up-to-a-structured-dunning-workflow`, `blog-post-hero-how-teams-move-from-spreadsheet-follow-up-to-a-structured-dunning-workflow`, `resources-blog-dunning-workflow` | Blog index, article page, Resources | Draft follow-up workflow or queue image |
| A12-5 | `blog-cover-follow-up-history.svg` | `assets/images/blog-cover-follow-up-history.svg` | `1600 x 900 SVG` | `blog-card-why-follow-up-history-matters-in-dunning`, `blog-post-hero-why-follow-up-history-matters-in-dunning` | Blog index, article page | Account timeline or follow-up history image |

## Capture Order

If you are gathering assets in priority order, collect them like this:

1. `assets/images/product-command-center.png`
2. `assets/images/product-collector-queue.png`
3. `assets/images/product-account-detail-timeline.png`
4. `assets/images/product-forecast-intelligence.png`
5. `assets/images/product-dunning-workflow.png`
6. `assets/images/product-import-validation.svg`
7. `assets/images/logos-integrations.svg`
8. The five `assets/images/blog-cover-*.svg` files
9. The four `assets/images/resource-guide-*.svg` files

## Quick Replacement Notes

- Product screenshots: use PNG
- Logo packs: use SVG when possible
- Generated covers and support graphics: use SVG
- If you edit in Photoshop, use a `2x` working artboard and only resize down to the listed output size on export
- Match the listed export sizes so the site does not need extra contain/cover fitting overrides
- Keep screenshots anonymized and visually consistent
- Keep critical UI centered because the site uses `cover` cropping, not `contain`
- Apply any final sharpening after the export resize, not before
- Lead with workflow screenshots first. Treat import validation and onboarding graphics as supporting proof lower on the page.
- Search for the listed `data-placeholder-id` values when you are ready to replace a specific placeholder block
