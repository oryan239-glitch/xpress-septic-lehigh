# Xpress Septic Tank Pumping — website

Live site: https://xpressseptictankpumpinglehighacres.com (GitHub Pages, custom domain via `CNAME`, HTTPS enforced).

Plain HTML/CSS/JS with no framework, no web fonts and no third-party scripts. Node is only used locally to rebuild pages and images.

## Update business info, Google profile, reviews and photos → `site.config.mjs`

Everything about the business lives in **`site.config.mjs`** at the repo root:

| Setting | What it does |
|---|---|
| `name`, `phoneDisplay`, `phoneTel`, `email`, `hours` | Business identity used in the header, footer, CTAs and schema |
| `gbpUrl` | **Google Business Profile share link.** Turns on "View us on Google", "Read Our Google Reviews", the reviews section, and `sameAs`/`hasMap` in the schema |
| `gbpReviewUrl` | "Ask for reviews" link. Turns on "Leave a Review" buttons |
| `gbpRating` + `gbpReviewCount` | Shows the visible rating (both required). Copy from the live profile only |
| `reviews` | Genuine Google review excerpts, word for word |
| `trust.yearsInBusiness` / `license` / `jobsCompleted` | Stats row under the trust bar, shown only when set |
| `heroPhoto` | Replaces the truck illustration with a real photo, preloaded as the LCP image |
| `gallery` | "Real trucks. Real jobs." photo section, shown only when it has photos |

Anything empty (`""`, `null`, `[]`) simply isn't rendered. Nothing fake ever shows.

Then rebuild: `node tools/build-pages.mjs`, commit and push.

## Add real photos

1. Put originals in `photos/` (not published).
2. Run `node tools/build-photos.mjs`. This creates AVIF/WebP/JPEG at 480/800/1200/1600 px in `assets/img/` and strips GPS/EXIF data.
3. Add an entry to `heroPhoto` or `gallery` in `site.config.mjs`, e.g.
   `{ name: "xpress-truck-side", width: 1600, height: 1066, widths: [480, 800, 1200, 1600], alt: "Xpress Septic Tank Pumping vacuum truck at a home in Lehigh Acres", caption: "Our truck on a Lehigh Acres pump-out" }`
4. Rebuild.

## Layout

| Path | What it is |
|---|---|
| `src/pages/*.html` | Page content: **edit these**, not the built HTML |
| `tools/build-pages.mjs` | Header, footer, meta tags, JSON-LD, reviews/gallery/stats components, sitemap |
| `tools/build-photos.mjs` / `build-icons.mjs` | Image pipeline / favicon and social image |
| `tools/check.mjs` | Crawls a running copy for broken links, H1s, duplicate titles and JSON-LD |
| `index.html`, `*/index.html`, `404.html`, `sitemap.xml` | **Generated.** Commit them, but don't hand-edit |
| `quote/` | Hidden redirect to the ServiceM8 booking form (noindex) |
| `docs/` | Local SEO playbook and keyword map (not published) |

## Rebuild and test

```bash
cd tools && npm install        # first time only (sharp)
cd .. && node tools/build-pages.mjs
npx http-server . -p 8080      # preview at http://localhost:8080
node tools/check.mjs           # with the preview server running
```

## Tracking

Elements with `data-track` (calls, quote buttons, Google profile and review links) and successful form sends are pushed to `window.dataLayer` / `gtag()` when present. Nothing is loaded by default.
