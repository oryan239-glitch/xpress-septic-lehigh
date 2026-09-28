# Xpress Septic Tank Pumping — website

Live site: https://xpressseptictankpumpinglehighacres.com (GitHub Pages, custom domain via `CNAME`).

Plain HTML/CSS/JS. No framework and no runtime dependencies. Node is only used locally to rebuild pages and images.

## Layout

| Path | What it is |
|---|---|
| `src/pages/*.html` | Page content: **edit these**, not the built HTML |
| `tools/build-pages.mjs` | Wraps pages with header, footer, meta tags and JSON-LD. **Business facts (name, phone, Google profile links) live at the top of this file** |
| `tools/build-photos.mjs` | Turns real photos in `photos/` into AVIF/WebP/JPEG responsive sets |
| `tools/build-icons.mjs` | Regenerates favicon, touch icon and the social share image |
| `tools/check.mjs` | Crawls the local build for broken links, H1s, duplicate titles and JSON-LD |
| `index.html`, `*/index.html`, `404.html`, `sitemap.xml` | **Generated.** Commit them, but don't hand-edit |
| `quote/` | Hidden redirect to the ServiceM8 booking form (noindex, disallowed in robots.txt) |
| `docs/local-seo-playbook.md` | Search Console, Google Business Profile, reviews and link-building plan |

`_config.yml` stops GitHub Pages from publishing `src/`, `tools/`, `docs/` and `photos/`.

## Rebuild

```bash
cd tools && npm install        # first time only (installs sharp)
cd .. && node tools/build-pages.mjs
npx http-server . -p 8080      # preview at http://localhost:8080
node tools/check.mjs           # with the preview server running
```

## Connect the Google Business Profile

In `tools/build-pages.mjs`, set:

- `gbpUrl`: the profile's share link (Google Maps, then Share, then Copy link)
- `gbpReviewUrl`: the "Ask for reviews" link from the profile dashboard
- `gbpRating` and `gbpReviewCount`: only copy these from the live profile, and update them when they change. Leave them `null` to hide the rating

Rebuilding adds "View us on Google" and "Leave a review" links, a reviews section on the homepage, and `sameAs`/`hasMap` in the structured data.

## Add real photos

Put the originals in `photos/`, run `node tools/build-photos.mjs`, and paste the printed `<picture>` snippet into the page. For the hero, replace the `<img>` inside `<figure class="hero-visual">` in `src/pages/index.html`. Write alt text that describes what's actually in the photo. The script strips EXIF/GPS data.

## Tracking

Clicks on anything with `data-track` (calls, request buttons, Google profile and review links) and successful form sends are pushed to `window.dataLayer` and `gtag()` when either exists. Nothing is loaded by default. See the playbook for adding GA4 without slowing the site down.
